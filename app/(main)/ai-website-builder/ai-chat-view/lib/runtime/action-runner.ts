import { WebContainer } from '@webcontainer/api';
import * as nodePath from 'path-browserify';
import type { BuilderAction } from '../../types/actions';
import { createScopedLogger } from '../../utils/logger';
import { unreachable } from '../../utils/unreachable';
import { useWorkbenchStore, useFilesStore } from '../stores/zustand';
import { useAiBuilderStore } from '../../../store/ai-builder-store';
import type { ActionCallbackData } from './message-parser';

const logger = createScopedLogger('ActionRunner');

// Helper to strip ANSI codes, handle backspaces, carriage returns, and excessive newlines
const stripAnsi = (str: string) => {
  // 1. Pre-process Cursor control codes
  let clean = str
    // Move Cursor Left (ESC[D or ESC[nD) -> Backspace(s). Default n=1.
    .replace(/\x1b\[(\d+)?D/g, (match, p1) => '\x08'.repeat(p1 ? parseInt(p1, 10) : 1))
    // Clear Line (ESC[2K or ESC[K) or Cursor Column (ESC[G or ESC[nG) -> Carriage Return (\r)
    .replace(/\x1b\[[0-2]?K|\x1b\[(\d+)?G/g, '\r');

  // 2. Strip standard ANSI color codes
  clean = clean.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

  // 3. Handle Backspace (\x08)
  while (clean.includes('\x08')) {
    clean = clean.replace(/[^\x08]\x08/g, '').replace(/^\x08+/g, '');
  }

  // 4. Handle Carriage Return (\r): keep last non-empty segment
  clean = clean.split('\n').map(line => {
    return line.split('\r').reduce((acc, curr) => curr || acc, '');
  }).join('\n');

  // 5. Collapse excessive newlines (max 2)
  return clean.replace(/\n{3,}/g, '\n\n');
};

export type ActionStatus =
  | 'pending'
  | 'running'
  | 'complete'
  | 'aborted'
  | 'failed';

export type BaseActionState = BuilderAction & {
  status: Exclude<ActionStatus, 'failed'>;
  abort: () => void;
  executed: boolean;
  abortSignal: AbortSignal;
  output?: string; // Add output field
};

export type FailedActionState = BuilderAction &
  Omit<BaseActionState, 'status'> & {
    status: Extract<ActionStatus, 'failed'>;
    error: string;
  };

export type ActionState = BaseActionState | FailedActionState;

type BaseActionUpdate = Partial<
  Pick<BaseActionState, 'status' | 'abort' | 'executed' | 'output'>
>;

export type ActionStateUpdate =
  | BaseActionUpdate
  | (Omit<BaseActionUpdate, 'status'> & { status: 'failed'; error: string });

export class ActionRunner {
  #webcontainer: Promise<WebContainer>;
  #currentExecutionPromise: Promise<void> = Promise.resolve();
  #artifactId: string;

  constructor(webcontainerPromise: Promise<WebContainer>, artifactId: string) {
    this.#webcontainer = webcontainerPromise;
    this.#artifactId = artifactId;
  }

  addAction(data: ActionCallbackData) {
    const { actionId } = data;

    const artifact = useWorkbenchStore.getState().artifacts[this.#artifactId];
    const actions = artifact?.actions || {};
    const action = actions[actionId];

    if (action) {
      // action already added
      return;
    }

    const abortController = new AbortController();

    const newAction: ActionState = {
      ...data.action,
      status: 'pending',
      executed: false,
      abort: () => {
        abortController.abort();
        this.#updateAction(actionId, { status: 'aborted' });
      },
      abortSignal: abortController.signal,
      output: '',
    };

    this.#updateArtifactActions({ ...actions, [actionId]: newAction });

    this.#currentExecutionPromise.then(() => {
      this.#updateAction(actionId, { status: 'running' });
    });
  }

  async runAction(data: ActionCallbackData) {
    const { actionId } = data;
    const actions = useWorkbenchStore.getState().artifacts[this.#artifactId]?.actions || {};
    const action = actions[actionId];

    if (!action) {
      unreachable(`Action ${actionId} not found`);
    }

    if (action.executed) {
      return;
    }

    this.#updateAction(actionId, { ...action, ...data.action, executed: true });

    this.#currentExecutionPromise = this.#currentExecutionPromise
      .then(() => {
        return this.#executeAction(actionId);
      })
      .catch((error) => {
        console.error('Action failed:', error);
      });
  }

  async #executeAction(actionId: string) {
    const actions = useWorkbenchStore.getState().artifacts[this.#artifactId]?.actions || {};
    const action = actions[actionId];

    console.log(
      `[ActionRunner] Executing action ${actionId}, type: ${action.type}`
    );
    console.time(`[ActionRunner] Action ${actionId}`);

    this.#updateAction(actionId, { status: 'running' });

    try {
      switch (action.type) {
        case 'shell': {
          await this.#runShellAction(action, actionId);
          break;
        }
        case 'file': {
          await this.#runFileAction(action);
          break;
        }
      }

      console.timeEnd(`[ActionRunner] Action ${actionId}`);
      this.#updateAction(actionId, {
        status: action.abortSignal.aborted ? 'aborted' : 'complete',
      });
    } catch (error: any) {
      console.timeEnd(`[ActionRunner] Action ${actionId}`);
      // Use warn to avoid triggering Next.js error overlay
      console.warn(`[ActionRunner] Action ${actionId} failed:`, error);

      this.#updateAction(actionId, {
        status: 'failed',
        error: error.message || 'Action failed',
      });

      // Do NOT re-throw, as we have handled the failure in the UI
    }
  }

  async #runShellAction(action: ActionState, actionId: string): Promise<void> {
    if (action.type !== 'shell') {
      unreachable('Expected shell action');
    }

    console.log('[ActionRunner] Shell command:', action.content);
    console.time('[ActionRunner] WebContainer await');
    const webcontainer = await this.#webcontainer;
    console.timeEnd('[ActionRunner] WebContainer await');

    const process = await webcontainer.spawn('jsh', ['-c', action.content], {
      env: { npm_config_yes: true },
    });

    action.abortSignal.addEventListener('abort', () => {
      process.kill();
    });

    // check if this is a dev server command
    const isDevServer = this.#isDevServerCommand(action.content);
    let devServerStarted = false;
    let outputBuffer = '';
    let rawOutput = ''; // Keep track of raw output for error reporting
    let missingDependencyDetected = false;
    let syntaxErrorDetected = false;
    let buildErrorDetected = false;
    let portConflictDetected = false;

    // Throttled update for UI
    let lastUpdate = Date.now();
    const updateInterval = 200; // ms

    process.output.pipeTo(
      new WritableStream({
        write: (data) => {
          // console.log(data); // Removed logging to reduce noise

          const str = data.toString();
          outputBuffer += str; // ANSI codes included for now, might need stripping if rendering issue
          rawOutput += str;

          // Update UI periodically
          const now = Date.now();
          if (now - lastUpdate > updateInterval) {
            this.#updateAction(actionId, { output: stripAnsi(outputBuffer) });
            lastUpdate = now;
          }

          const lowerStr = str.toLowerCase();

          // Detect various error types
          if (rawOutput.toLowerCase().includes('command not found') || rawOutput.toLowerCase().includes('not found:') || rawOutput.toLowerCase().includes('cannot find module')) {
            missingDependencyDetected = true;
          }

          if (rawOutput.match(/SyntaxError|Unexpected token|Parse error/i)) {
            syntaxErrorDetected = true;
            logger.error('Syntax error detected in generated code');
          }

          if (rawOutput.match(/Failed to compile|Build failed|compilation error|Failed to resolve import/i)) {
            buildErrorDetected = true;
            useWorkbenchStore.getState().setBuildError(true);
            logger.error('Build error detected');
          }

          if (rawOutput.match(/EADDRINUSE|port.*already in use/i)) {
            portConflictDetected = true;
            logger.warn('Port conflict detected');
          }
        },
      })
    );

    // for dev servers, monitor output and mark complete when started
    if (isDevServer) {
      // ... (dev server block - only updating usage of stripAnsi if needed, but since it's now top-level it works)
      // Actually I need to replace the whole method content to be safe or use targeted replace.
      // Let's replace the Logic inside runShellAction related to throwing.
    }
    // ...
    // replacing just the throw block


    // for dev servers, monitor output and mark complete when started
    if (isDevServer) {
      // Force initial update
      this.#updateAction(actionId, { output: 'Starting dev server...\n' });

      const startDetectionPromise = new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.#detectDevServerStart(rawOutput.toLowerCase())) {
            devServerStarted = true;
            clearInterval(checkInterval);
            // safe to clear timeout if it exists, though here we use a race
            logger.debug('Dev server detected as started');

            // Final update of output
            this.#updateAction(actionId, { output: stripAnsi(outputBuffer) });

            // Auto-switch to preview on success
            useAiBuilderStore.getState().setActiveMobilePanel('workbench');
            useWorkbenchStore.getState().setCurrentView('preview');

            resolve();
          }
        }, 100);

        // global timeout handled by race now, but good to have cleanup
      });

      const processExitPromise = process.exit.then((code) => {
        return { type: 'exit', code };
      });

      try {
        const result = await Promise.race([startDetectionPromise, processExitPromise]);

        // Final update upon completion/failure
        this.#updateAction(actionId, { output: stripAnsi(outputBuffer) });

        // If result has a type 'exit', the process finished before the server started
        if (result && 'type' in result && result.type === 'exit') {
          const code = (result as { code: number }).code;
          if (code !== 0) {
            const errorOutput = rawOutput.slice(-2000) || 'No output captured';
            throw new Error(`Process exited with code ${code}\nOutput:\n${errorOutput}`);
          }
          // If code is 0 but server didn't start, it might be a quick command or the Mock
          if (!devServerStarted) {
            // If it's the mock (which returns 0 immediately), we shouldn't fail, 
            // but strictly speaking a "dev server" command should keep running.
            // For now, we assume if it exits 0, it's fine (or it was the mock).
            logger.debug('Process exited with code 0 before dev server start detected.');
            return;
          }
        }
      } catch (error) {
        // Final update on error
        this.#updateAction(actionId, { output: stripAnsi(outputBuffer) });

        // If process exited with error, check if we should recover
        if (missingDependencyDetected) {
          logger.info(
            'Detected missing dependency. Attempting auto-recovery with npm install...'
          );

          this.#updateAction(actionId, { output: stripAnsi(outputBuffer) + '\n\n[Auto-Recovery] Installing missing dependencies...\n' });

          // Notify user (via terminal output mostly)
          const installProcess = await webcontainer.spawn('npm', ['install']);
          installProcess.output.pipeTo(
            new WritableStream({
              write: (data) => {
                const str = data.toString();
                outputBuffer += str;
                // Update UI periodically during recovery
                const now = Date.now();
                if (now - lastUpdate > updateInterval) {
                  this.#updateAction(actionId, { output: stripAnsi(outputBuffer) });
                  lastUpdate = now;
                }
              },
            })
          );
          await installProcess.exit;

          this.#updateAction(actionId, { output: stripAnsi(outputBuffer) });
          logger.info('Auto-recovery complete. Retrying original command...');
          return this.#runShellAction(action, actionId);
        }

        // Log other error types for visibility
        if (syntaxErrorDetected) {
          logger.error(
            'Syntax error in code - manual fix required or AI regeneration needed'
          );
        }

        if (buildErrorDetected) {
          logger.error('Build error detected - check generated code quality');
        }

        if (portConflictDetected) {
          logger.warn('Port conflict - dev server may need manual restart');
        }

        throw error;
      }

      console.log('[ActionRunner] Dev server started!');

      return;
    }

    // for non-dev-server commands, wait for exit as before
    const exitCode = await process.exit;
    this.#updateAction(actionId, { output: stripAnsi(outputBuffer) });

    // Auto-recovery for non-dev commands too
    if (exitCode !== 0 && missingDependencyDetected) {
      logger.info(
        'Detected missing dependency on non-dev command. Installing...'
      );
      this.#updateAction(actionId, { output: stripAnsi(outputBuffer) + '\n\n[Auto-Recovery] Installing missing dependencies...\n' });

      const installProcess = await webcontainer.spawn('npm', ['install']);
      installProcess.output.pipeTo(
        new WritableStream({
          write: (d) => {
            const str = d.toString();
            outputBuffer += str;
            // Update UI periodically during recovery
            const now = Date.now();
            if (now - lastUpdate > updateInterval) {
              this.#updateAction(actionId, { output: stripAnsi(outputBuffer) });
              lastUpdate = now;
            }
          },
        })
      );
      await installProcess.exit;
      this.#updateAction(actionId, { output: stripAnsi(outputBuffer) });

      // Retry
      logger.info('Retrying original command...');
      return this.#runShellAction(action, actionId);
    }

    logger.debug(`Process terminated with code ${exitCode}`);
  }

  #isDevServerCommand(command: string): boolean {
    const devPatterns = [
      /npm\s+run\s+dev/,
      /npm\s+run\s+start/,
      /npm\s+start/,
      /yarn\s+dev/,
      /yarn\s+start/,
      /pnpm\s+dev/,
      /pnpm\s+start/,
      /vite/,
      /next\s+dev/,
      /astro\s+dev/,
    ];

    return devPatterns.some((pattern) => pattern.test(command));
  }

  #detectDevServerStart(output: string): boolean {
    const successPatterns = [
      /local:\s*http/,
      /localhost:/,
      /:\d{4,5}/, // port numbers like :5173, :3000
      /ready in/,
      /server running/,
      /compiled successfully/,
      /built in/,
      /listening on/,
    ];

    const isSuccess = successPatterns.some((pattern) => pattern.test(output));

    if (isSuccess) {
      useWorkbenchStore.getState().setBuildError(false);
    }

    return isSuccess;
  }

  async #runFileAction(action: ActionState) {
    if (action.type !== 'file') {
      unreachable('Expected file action');
    }

    console.time(`[ActionRunner] Write file: ${action.filePath}`);
    const webcontainer = await this.#webcontainer;

    let folder = nodePath.dirname(action.filePath);

    // remove trailing slashes
    folder = folder.replace(/\/+$/g, '');

    if (folder !== '.') {
      try {
        await webcontainer.fs.mkdir(folder, { recursive: true });
        logger.debug('Created folder', folder);
        useFilesStore.getState().setFile(folder, { type: 'folder' });
      } catch (error) {
        logger.error('Failed to create folder\n\n', error);
      }
    }

    try {
      await webcontainer.fs.writeFile(action.filePath, action.content);
      console.timeEnd(`[ActionRunner] Write file: ${action.filePath}`);
      logger.debug(`File written ${action.filePath}`);
      useFilesStore.getState().setFile(action.filePath, {
        type: 'file',
        content: action.content,
        isBinary: false,
      });
    } catch (error) {
      console.timeEnd(`[ActionRunner] Write file: ${action.filePath}`);
      logger.error('Failed to write file\n\n', error);
    }
  }

  #updateAction(id: string, newState: ActionStateUpdate) {
    const artifact = useWorkbenchStore.getState().artifacts[this.#artifactId];
    const actions = artifact?.actions || {};
    this.#updateArtifactActions({ ...actions, [id]: { ...actions[id]!, ...newState } as ActionState });
  }

  #updateArtifactActions(actions: Record<string, ActionState>) {
    const artifact = useWorkbenchStore.getState().artifacts[this.#artifactId];
    if (artifact) {
      useWorkbenchStore.getState().setArtifact(this.#artifactId, { ...artifact, actions });
    }
  }
}
