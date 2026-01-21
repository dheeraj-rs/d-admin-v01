import { memo, useRef, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { usePreviewStore } from '../../lib/stores/zustand';

export const Preview = memo(() => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeUrl = usePreviewStore(state => state.iframeUrl);
  const refreshTrigger = usePreviewStore(state => state.refreshTrigger);
  const previews = usePreviewStore(state => state.previews);
  const activePreviewIndex = usePreviewStore(state => state.activePreviewIndex);
  const [isSecureContext, setIsSecureContext] = useState(true);

  useEffect(() => {
    setIsSecureContext(window.crossOriginIsolated);
  }, []);

  useEffect(() => {
    console.log('[Preview] iframeUrl changed to:', iframeUrl);
  }, [iframeUrl]);

  // Listen for route changes from the iframe via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the message is from our preview iframe
      const activePreview = previews[activePreviewIndex];
      if (!activePreview) return;

      // Check if message origin matches the preview URL
      // We relax this check because the app might be running on a different port (e.g. 5174) 
      // than what we think is active (5173), causing origin mismatch.
      try {
        if (event.data?.type === 'ROUTE_CHANGE') {
          console.log('[Preview] Processing route change from origin:', event.origin);
        }
      } catch (e) {
        // ignore
      }

      // Handle route change messages
      if (event.data && event.data.type === 'ROUTE_CHANGE') {
        const newPath = event.data.path;
        console.log('[Preview] Received route change:', newPath);

        // Construct full URL with the new path
        // We use the active preview's base URL, effectively "re-rooting" the path to the current view
        const newUrl = `${activePreview.baseUrl}${newPath}`;

        // Update the URL in the store
        usePreviewStore.getState().setUrl(newUrl);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [previews, activePreviewIndex]);

  if (!isSecureContext) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-surface-0 p-6 text-center">
        <div className="bg-orange-500/10 p-4 rounded-full mb-4">
          <Icon icon="ph:warning-circle-duotone" className="w-8 h-8 text-orange-500" />
        </div>
        <h3 className="text-lg font-medium text-[var(--d-admin-text-color)] mb-2">
          Live Preview Unavailable
        </h3>
        <p className="text-sm text-[var(--d-admin-text-color-secondary)] max-w-sm">
          The live preview requires a secure context (HTTPS or localhost) to run the in-browser server.
          <br /><br />
          You are viewing the app in <strong>Read-Only Mode</strong>. You can still browse the code and chat with the AI.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-surface-0">
      <div className="flex-1 w-full h-full relative">
        {iframeUrl ? (
          <iframe
            key={refreshTrigger}
            ref={iframeRef}
            className="border-none w-full h-full absolute inset-0"
            src={iframeUrl}
            allow="clipboard-read; clipboard-write"
            onLoad={() => console.log('[Preview] Iframe loaded:', iframeUrl)}
            onError={(e) => console.error('[Preview] Iframe error:', e)}
          />
        ) : (
          <div className="flex w-full h-full justify-center items-center text-text-secondary">
            No preview available
          </div>
        )}
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';
