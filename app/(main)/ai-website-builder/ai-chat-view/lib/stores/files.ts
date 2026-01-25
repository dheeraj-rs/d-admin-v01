import type { PathWatcherEvent, WebContainer } from '@webcontainer/api';
import { getEncoding } from 'istextorbinary';
import { Buffer } from 'buffer';
import * as nodePath from 'path-browserify';
import { bufferWatchEvents } from '../../utils/buffer';
import { WORK_DIR } from '../../utils/constants';
import { computeFileModifications } from '../../utils/diff';
import { createScopedLogger } from '../../utils/logger';
import { unreachable } from '../../utils/unreachable';
import {
  useFilesStore,
  type FileMap,
  type File,
  type Dirent,
  type Folder,
} from './zustand';

// Re-export types for compatibility
export type { File, Folder, Dirent, FileMap } from './zustand';

const logger = createScopedLogger('FilesStore');

const utf8TextDecoder = new TextDecoder('utf8', { fatal: true });

export class FilesStore {
  #webcontainer: Promise<WebContainer>;

  /**
   * Tracks the number of files without folders.
   */
  #size = 0;

  /**
   * @note Keeps track all modified files with their original content since the last user message.
   * Needs to be reset when the user sends another message and all changes have to be submitted
   * for the model to be aware of the changes.
   */
  #modifiedFiles: Map<string, string> = new Map();

  get files() {
    return useFilesStore.getState().files;
  }

  get filesCount() {
    return useFilesStore.getState().filesCount;
  }

  constructor(webcontainerPromise: Promise<WebContainer>) {
    this.#webcontainer = webcontainerPromise;

    this.#init();
  }

  getFile(filePath: string) {
    return useFilesStore.getState().getFile(filePath);
  }

  getFileModifications() {
    return computeFileModifications(
      useFilesStore.getState().files,
      this.#modifiedFiles,
    );
  }

  resetFileModifications() {
    this.#modifiedFiles.clear();
    useFilesStore.getState().clearModifiedFiles();
  }

  reset() {
    this.#size = 0;
    this.#modifiedFiles.clear();
    useFilesStore.getState().reset();
  }

  async saveFile(filePath: string, content: string) {
    const webcontainer = await this.#webcontainer;

    try {
      const relativePath = nodePath.relative(webcontainer.workdir, filePath);

      if (!relativePath) {
        throw new Error(`EINVAL: invalid file path, write '${relativePath}'`);
      }

      const oldContent = this.getFile(filePath)?.content;

      if (!oldContent) {
        unreachable('Expected content to be defined');
      }

      await webcontainer.fs.writeFile(relativePath, content);

      if (!this.#modifiedFiles.has(filePath)) {
        this.#modifiedFiles.set(filePath, oldContent);
      }

      // we immediately update the file and don't rely on the `change` event coming from the watcher
      useFilesStore
        .getState()
        .setFile(filePath, { type: 'file', content, isBinary: false });

      logger.info('File updated');
    } catch (error) {
      logger.error('Failed to update file content\n\n', error);

      throw error;
    }
  }

  async #init() {
    const webcontainer = await this.#webcontainer;

    try {
      if ((webcontainer as any).internal?.watchPaths) {
        console.log('[FilesStore] Using internal watchPaths API');
        (webcontainer as any).internal.watchPaths(
          {
            include: [`${WORK_DIR}/**`],
            exclude: ['**/node_modules', '.git'],
            includeContent: true,
          },
          bufferWatchEvents(100, this.#processEventBuffer.bind(this)),
        );
      } else {
        console.error('[FilesStore] Internal WebContainer API not available!');
        console.error(
          '[FilesStore] File watching will not work. You need @webcontainer/api@1.3.0-internal.10',
        );
        console.error(
          '[FilesStore] Current version:',
          (webcontainer as any).constructor?.name,
        );
      }
    } catch (error) {
      console.error('[FilesStore] Error initializing file watcher:', error);
    }
  }

  #processEventBuffer(events: Array<[events: PathWatcherEvent[]]>) {
    const watchEvents = events.flat(2);

    for (const { type, path, buffer } of watchEvents) {
      // remove any trailing slashes
      const sanitizedPath = path.replace(/\/+$/g, '');

      switch (type) {
        case 'add_dir': {
          // we intentionally add a trailing slash so we can distinguish files from folders in the file tree
          useFilesStore.getState().setFile(sanitizedPath, { type: 'folder' });
          break;
        }
        case 'remove_dir': {
          useFilesStore.getState().setFile(sanitizedPath, undefined);

          const files = useFilesStore.getState().files;
          for (const [direntPath] of Object.entries(files)) {
            if (direntPath.startsWith(sanitizedPath)) {
              useFilesStore.getState().setFile(direntPath, undefined);
            }
          }

          break;
        }
        case 'add_file':
        case 'change': {
          if (type === 'add_file') {
            this.#size++;
            useFilesStore.getState().incrementFilesCount();
          }

          let content = '';

          /**
           * @note This check is purely for the editor. The way we detect this is not
           * bullet-proof and it's a best guess so there might be false-positives.
           * The reason we do this is because we don't want to display binary files
           * in the editor nor allow to edit them.
           */
          const isBinary = isBinaryFile(buffer);

          if (!isBinary) {
            content = this.#decodeFileContent(buffer);
          }

          useFilesStore
            .getState()
            .setFile(sanitizedPath, { type: 'file', content, isBinary });

          break;
        }
        case 'remove_file': {
          this.#size--;
          useFilesStore.getState().decrementFilesCount();
          useFilesStore.getState().setFile(sanitizedPath, undefined);
          break;
        }
        case 'update_directory': {
          // we don't care about these events
          break;
        }
      }
    }
  }

  #decodeFileContent(buffer?: Uint8Array) {
    if (!buffer || buffer.byteLength === 0) {
      return '';
    }

    try {
      return utf8TextDecoder.decode(buffer);
    } catch (error) {
      console.log(error);
      return '';
    }
  }
}

function isBinaryFile(buffer: Uint8Array | undefined) {
  if (buffer === undefined) {
    return false;
  }

  return (
    getEncoding(convertToBuffer(buffer), { chunkLength: 100 }, undefined) ===
    'binary'
  );
}

/**
 * Converts a `Uint8Array` into a Node.js `Buffer` by copying the prototype.
 * The goal is to  avoid expensive copies. It does create a new typed array
 * but that's generally cheap as long as it uses the same underlying
 * array buffer.
 */
function convertToBuffer(view: Uint8Array): Buffer {
  const buffer = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);

  Object.setPrototypeOf(buffer, Buffer.prototype);

  return buffer as Buffer;
}
