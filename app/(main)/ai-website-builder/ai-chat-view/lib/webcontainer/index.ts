import { WebContainer } from '@webcontainer/api';
import { WORK_DIR_NAME } from '../../utils/constants';

interface WebContainerContext {
  loaded: boolean;
}

// Extend Window interface for HMR support
declare global {
  interface Window {
    __webcontainerContext?: WebContainerContext;
    __webcontainer?: Promise<WebContainer>;
  }
}

// HMR support for development
export const webcontainerContext: WebContainerContext =
  typeof window !== 'undefined' && window.__webcontainerContext
    ? window.__webcontainerContext
    : { loaded: false };

if (typeof window !== 'undefined') {
  window.__webcontainerContext = webcontainerContext;
}

// Initialize with noop promise for SSR
export let webcontainer: Promise<WebContainer> = new Promise(() => {
  // noop for SSR
});

// Mock WebContainer for insecure contexts
class MockWebContainer {
  workdir = '/home/project';
  fs = {
    writeFile: async (path: string, content: string | Uint8Array) => {
      console.log('[MockWebContainer] writeFile:', path);
    },
    mkdir: async (path: string, options?: { recursive?: boolean }) => {
      console.log('[MockWebContainer] mkdir:', path);
    },
    readFile: async (path: string, encoding?: string) => {
      console.log('[MockWebContainer] readFile:', path);
      return '';
    },
    rm: async (path: string, options?: { recursive?: boolean; force?: boolean }) => {
      console.log('[MockWebContainer] rm:', path);
    },
    readdir: async (path: string) => {
      return [];
    }
  };

  async spawn(command: string, args: string[], options?: any) {
    console.warn(`[MockWebContainer] Cannot spawn "${command}" in insecure context.`);
    return {
      output: new ReadableStream({
        start(controller) {
          controller.close();
        }
      }),
      input: new WritableStream(),
      exit: Promise.resolve(0),
      kill: () => { }
    };
  }

  on(event: string, listener: (...args: any[]) => void) {
    return () => { };
  }

  mount(mountPoints: any) {
    return Promise.resolve();
  }
}

// Boot WebContainer only on client-side
if (typeof window !== 'undefined') {
  // HMR support - check for cached WebContainer
  const cachedWebContainer = window.__webcontainer;

  webcontainer =
    cachedWebContainer ??
    Promise.resolve()
      .then(() => {
        if (!window.crossOriginIsolated) {
          console.warn(
            'WebContainer requires a Secure Context (HTTPS or localhost) including specific headers (Cross-Origin-Opener-Policy: same-origin, Cross-Origin-Embedder-Policy: require-corp). The application is running in an insecure context, so WebContainer will NOT boot.'
          );
          return new MockWebContainer() as any as WebContainer;
        }
        return WebContainer.boot({ workdirName: WORK_DIR_NAME });
      })
      .then((webcontainer) => {
        webcontainerContext.loaded = true;
        return webcontainer;
      });

  // Cache for HMR
  window.__webcontainer = webcontainer;
}
