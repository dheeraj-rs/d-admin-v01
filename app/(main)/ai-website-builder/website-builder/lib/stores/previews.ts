import type { WebContainer } from '@webcontainer/api';
import { usePreviewStore } from './zustand';

export interface PreviewInfo {
  port: number;
  ready: boolean;
  baseUrl: string;
}

export class PreviewsStore {
  #availablePreviews = new Map<number, PreviewInfo>();
  #webcontainer: Promise<WebContainer>;

  constructor(webcontainerPromise: Promise<WebContainer>) {
    this.#webcontainer = webcontainerPromise;

    this.#init();
  }

  get previews() {
    return usePreviewStore.getState().previews;
  }

  async #init() {
    const webcontainer = await this.#webcontainer;

    if (!webcontainer) {
      console.error('[PreviewsStore] WebContainer is undefined!');
      return;
    }

    webcontainer.on('port', (port, type, url) => {
      console.log('[PreviewsStore] Port event:', { port, type, url });
      let previewInfo = this.#availablePreviews.get(port);

      if (type === 'close' && previewInfo) {
        console.log('[PreviewsStore] Closing preview on port:', port);
        this.#availablePreviews.delete(port);
        const currentPreviews = usePreviewStore.getState().previews;
        usePreviewStore.getState().setPreviews(
          currentPreviews.filter((preview) => preview.port !== port)
        );

        return;
      }

      const currentPreviews = [...usePreviewStore.getState().previews];

      if (!previewInfo) {
        console.log('[PreviewsStore] Creating new preview for port:', port);
        previewInfo = { port, ready: type === 'open', baseUrl: url };
        this.#availablePreviews.set(port, previewInfo);
        currentPreviews.push(previewInfo);
      }

      previewInfo.ready = type === 'open';
      previewInfo.baseUrl = url;

      console.log('[PreviewsStore] Updated previews:', currentPreviews);
      usePreviewStore.getState().setPreviews(currentPreviews);

      // Set the iframe URL in Zustand store when preview is ready
      if (type === 'open' && url) {
        console.log('[PreviewsStore] Setting iframe URL:', url);
        usePreviewStore.getState().setIframeUrl(url);
      }
    });
  }
}
