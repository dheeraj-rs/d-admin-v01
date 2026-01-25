'use client';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { HistorySidebar } from '../components/HistorySidebar';
import { ChatInterfacePanel } from '../components/ChatInterfacePanel.client';
import { useAiBuilderStore } from '../store/ai-builder-store';
import { WorkbenchPanel } from '../components/WorkbenchPanel';
import { Header } from '../components/AiBuilderHeaderWrapper';
import LightCircleRayBackground from '@/core/components/not-found/LightCircleRayBackground';
import { useEffect } from 'react';

export default function AiWebsiteBuilderPage() {
  const { activeMobilePanel, setBuilderView } = useAiBuilderStore();
  const isMobile = useIsMobile();

  // Ensure we are in chat mode when mounting this page
  useEffect(() => {
    setBuilderView('chat');
  }, [setBuilderView]);

  const showInterface = isMobile ? activeMobilePanel === 'chat' : true;
  const showWorkbench = isMobile ? activeMobilePanel === 'workbench' : true;

  return (
    <div className="relative h-full w-full bg-gradient-to-tl from-[var(--d-admin-surface-ground)] to-[var(--d-admin-surface-section)] text-[var(--d-admin-text-color)]">
      <LightCircleRayBackground />
      <HistorySidebar />
      <div className="relative z-10 flex h-full w-full flex-col">
        <Header />
        <div className="relative h-full w-full flex-1 overflow-hidden">
          <div className="h-full w-full">
            <div className="flex size-full overscroll-contain">
              <PanelGroup
                direction="horizontal"
                key={isMobile ? 'mobile' : 'desktop'}
              >
                {showInterface && (
                  <Panel
                    id="interface-panel"
                    order={1}
                    defaultSize={isMobile ? 100 : 30}
                    minSize={isMobile ? 100 : 25}
                    className="h-full"
                  >
                    <ChatInterfacePanel />
                  </Panel>
                )}

                {!isMobile && showInterface && (
                  <PanelResizeHandle className="w-1 bg-transparent transition-colors hover:bg-transparent" />
                )}

                {showWorkbench && (
                  <Panel
                    id="workbench-panel"
                    order={2}
                    defaultSize={isMobile ? 100 : 70}
                    minSize={isMobile ? 100 : 30}
                    className="h-full"
                  >
                    <WorkbenchPanel />
                  </Panel>
                )}
              </PanelGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
