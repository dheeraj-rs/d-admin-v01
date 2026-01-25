'use client';
import { Header } from './components/header/AiBuilderHeaderWrapper';
import { WorkbenchPanel } from './components/workbench/WorkbenchPanel';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useAiBuilderStore } from './stores/ai-builder-store';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { ChatInterfacePanel } from './components/chat/ChatInterfacePanel.client';
import { HistorySidebar } from './components/history/HistorySidebar';
import { useChatStore } from './stores/zustand';
import { useEffect } from 'react';

export default function AiWebsiteBuilderPage() {
  const { activeMobilePanel, setBuilderView } = useAiBuilderStore();
  const isMobile = useIsMobile();
  const chatId = useChatStore((state) => state.chatId);

  // Ensure we are in chat mode when mounting this page
  useEffect(() => {
    setBuilderView('chat');
  }, [setBuilderView]);

  // Components (Simplified for Chat only)
  const ActiveInterface = ChatInterfacePanel;
  const ActiveWorkbench = WorkbenchPanel;

  const showInterface = isMobile ? activeMobilePanel === 'chat' : true;
  const showWorkbench = isMobile ? activeMobilePanel === 'workbench' : true;

  return (
    <div className="relative h-full w-full bg-gradient-to-tl from-[var(--d-admin-surface-ground)] to-[var(--d-admin-surface-section)] text-[var(--d-admin-text-color)]">
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
                    <ActiveInterface />
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
                    minSize={isMobile ? 100 : 50}
                    className="h-full"
                  >
                    <ActiveWorkbench />
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
