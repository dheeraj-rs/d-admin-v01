import { memo, useRef, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { usePreviewStore } from '../../lib/stores/zustand';

export const Preview = memo(() => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeUrl = usePreviewStore(state => state.iframeUrl);
  const refreshTrigger = usePreviewStore(state => state.refreshTrigger);
  const [isSecureContext, setIsSecureContext] = useState(true);

  useEffect(() => {
    setIsSecureContext(window.crossOriginIsolated);
  }, []);

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
