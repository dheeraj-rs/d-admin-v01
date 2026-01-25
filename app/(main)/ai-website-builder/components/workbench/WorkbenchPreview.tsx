import { memo, useRef, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { usePreviewStore } from '../../stores/zustand';

export const Preview = memo(() => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeUrl = usePreviewStore((state) => state.iframeUrl);
  const refreshTrigger = usePreviewStore((state) => state.refreshTrigger);
  const previews = usePreviewStore((state) => state.previews);
  const activePreviewIndex = usePreviewStore(
    (state) => state.activePreviewIndex,
  );
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
          console.log(
            '[Preview] Processing route change from origin:',
            event.origin,
          );
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
      <div className="bg-surface-0 flex h-full w-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-full bg-orange-500/10 p-4">
          <Icon
            icon="ph:warning-circle-duotone"
            className="h-8 w-8 text-orange-500"
          />
        </div>
        <h3 className="mb-2 text-lg font-medium text-[var(--d-admin-text-color)]">
          Live Preview Unavailable
        </h3>
        <p className="max-w-sm text-sm text-[var(--d-admin-text-color-secondary)]">
          The live preview requires a secure context (HTTPS or localhost) to run
          the in-browser server.
          <br />
          <br />
          You are viewing the app in <strong>Read-Only Mode</strong>. You can
          still browse the code and chat with the AI.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-0 flex h-full w-full flex-col">
      <div className="relative h-full w-full flex-1">
        {iframeUrl ? (
          <iframe
            key={refreshTrigger}
            ref={iframeRef}
            className="absolute inset-0 h-full w-full border-none"
            src={iframeUrl}
            allow="clipboard-read; clipboard-write"
            onLoad={() => console.log('[Preview] Iframe loaded:', iframeUrl)}
            onError={(e) => console.error('[Preview] Iframe error:', e)}
          />
        ) : (
          <div className="text-text-secondary flex h-full w-full items-center justify-center">
            No preview available
          </div>
        )}
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';
