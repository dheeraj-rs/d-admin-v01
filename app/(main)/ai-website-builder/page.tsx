'use client';
import { Header } from './ai-chat-view/Header';
import { WorkbenchPanel } from './ai-chat-view/WorkbenchPanel';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useAiBuilderStore } from './store/ai-builder-store';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { ChatInterfacePanel } from './ai-chat-view/components/chat/ChatInterfacePanel.client';
import { HistorySidebar } from './ai-chat-view/components/sidebar/HistorySidebar';
import { useChatStore } from './ai-chat-view/lib/stores/zustand';
import { useEffect } from 'react';

export default function AiWebsiteBuilderPage() {
    const { activeMobilePanel, setBuilderView } = useAiBuilderStore();
    const isMobile = useIsMobile();
    const chatId = useChatStore(state => state.chatId);

    // Ensure we are in chat mode when mounting this page
    useEffect(() => {
        setBuilderView('chat');
    }, [setBuilderView]);

    // Components (Simplified for Chat only)
    const ActiveInterface = ChatInterfacePanel;
    const ActiveWorkbench = WorkbenchPanel;

    const showInterface = (isMobile ? activeMobilePanel === 'chat' : true);
    const showWorkbench = (isMobile ? activeMobilePanel === 'workbench' : true);

    return (
        <div className="w-full h-full relative text-[var(--d-admin-text-color)] bg-gradient-to-tl from-[var(--d-admin-surface-ground)] to-[var(--d-admin-surface-section)]">
            <HistorySidebar />
            <div className="flex flex-col h-full w-full relative z-10">
                <Header />
                <div className="relative flex-1 w-full h-full overflow-hidden">
                    <div className="h-full w-full">
                        <div className="flex size-full overscroll-contain">
                            <PanelGroup direction="horizontal" key={isMobile ? 'mobile' : 'desktop'}>
                                {showInterface && (
                                    <Panel
                                        id="interface-panel"
                                        order={1}
                                        defaultSize={isMobile ? 100 : 25}
                                        minSize={isMobile ? 100 : 20}
                                        className="h-full"
                                    >
                                        <ActiveInterface />
                                    </Panel>
                                )}

                                {!isMobile && showInterface && (
                                    <PanelResizeHandle className="w-1 bg-transparent hover:bg-blue-500/50 transition-colors" />
                                )}

                                {showWorkbench && (
                                    <Panel
                                        id="workbench-panel"
                                        order={2}
                                        defaultSize={isMobile ? 100 : 75}
                                        minSize={isMobile ? 100 : 30}
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