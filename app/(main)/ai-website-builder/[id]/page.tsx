'use client';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { HistorySidebar } from '../ai-chat-view/components/sidebar/HistorySidebar';
import { ChatInterfacePanel } from '../ai-chat-view/components/chat/ChatInterfacePanel.client';
import { useAiBuilderStore } from '../store/ai-builder-store';
import { WorkbenchPanel } from '../ai-chat-view/WorkbenchPanel';
import { Header } from '../ai-chat-view/Header';
import LightCircleRayBackground from '@/core/components/not-found/LightCircleRayBackground';

export default function AiWebsiteBuilderPage() {
  const { activeMobilePanel } = useAiBuilderStore();
  const isMobile = useIsMobile();

  const showInterface = isMobile ? activeMobilePanel === 'chat' : true;
  const showWorkbench = isMobile ? activeMobilePanel === 'workbench' : true;

  return (
    <div className="relative h-full w-full bg-[var(--d-admin-surface-ground)] text-[var(--d-admin-text-color)]">
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
                    defaultSize={isMobile ? 100 : 40}
                    minSize={isMobile ? 100 : 25}
                    maxSize={isMobile ? 100 : 50}
                    className={`${isMobile && activeMobilePanel !== 'chat' ? 'hidden' : ''}`}
                  >
                    <ChatInterfacePanel />
                  </Panel>
                )}

                {!isMobile && (
                  <PanelResizeHandle className="group relative flex w-2 items-center justify-center bg-transparent hover:bg-transparent" />
                )}

                {showWorkbench && (
                  <Panel
                    defaultSize={isMobile ? 100 : 60}
                    minSize={isMobile ? 100 : 50}
                    className={`${isMobile && activeMobilePanel !== 'workbench' ? 'hidden' : ''}`}
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
