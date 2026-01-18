'use client';
import { Header } from './components/common/Header';
import { HistorySidebar } from './components/common/HistorySidebar';
import { ChatInterface } from './components/ai-chat-view/ChatInterface';
import { DragDropInterface } from './components/drag-drop-view/DragDropInterface';
import { TemplatesInterface } from './components/templates-view/TemplatesInterface';
import { Workbench } from './components/ai-chat-view/Workbench';
import { DragDropWorkbench } from './components/drag-drop-view/DragDropWorkbench';
import { TemplatesWorkbench } from './components/templates-view/TemplatesWorkbench';
import { LightRaysBackground } from '@/core/components/not-found/LightRaysBackground';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useAiBuilderStore } from './store/ai-builder-store';
import { useIsMobile } from '@/core/hooks/use-mobile';

export default function AiWebsiteBuilderPage() {
    const { activeMobilePanel, builderView } = useAiBuilderStore();
    const isMobile = useIsMobile();

    const InterfaceComponents = {
        chat: ChatInterface,
        'drag-drop': DragDropInterface,
        templates: TemplatesInterface,
    };

    const WorkbenchComponents = {
        chat: Workbench,
        'drag-drop': DragDropWorkbench,
        templates: TemplatesWorkbench,
    };

    const ActiveInterface = InterfaceComponents[builderView as keyof typeof InterfaceComponents];
    const ActiveWorkbench = WorkbenchComponents[builderView as keyof typeof WorkbenchComponents];

    const showInterface = isMobile ? activeMobilePanel === 'chat' : true;
    const showWorkbench = isMobile ? activeMobilePanel === 'workbench' : true;

    return (
        <div className="w-full h-full bg-[var(--d-admin-surface-ground)] relative text-[var(--d-admin-text-color)]">
            <LightRaysBackground />
            <HistorySidebar />
            <div className="flex flex-col h-full w-full relative z-10">
                <Header />
                <div className="relative flex-1 w-full h-full overflow-hidden">
                    <div
                        className="h-full w-full"
                    >
                        <div className="flex size-full overscroll-contain">
                            <PanelGroup direction="horizontal" key={isMobile ? 'mobile' : 'desktop'}>
                                {showInterface && (
                                    <Panel
                                        defaultSize={isMobile ? 100 : 40}
                                        minSize={isMobile ? 100 : 25}
                                        maxSize={isMobile ? 100 : 50}
                                        className={`${isMobile && activeMobilePanel !== 'chat' ? 'hidden' : ''}`}
                                    >
                                        {ActiveInterface && <ActiveInterface />}
                                    </Panel>
                                )}

                                {!isMobile && (
                                    <PanelResizeHandle className="w-2 bg-transparent hover:bg-transparent relative group flex justify-center items-center" />
                                )}

                                {showWorkbench && (
                                    <Panel
                                        defaultSize={isMobile ? 100 : 60}
                                        minSize={isMobile ? 100 : 50}
                                        className={`${isMobile && activeMobilePanel !== 'workbench' ? 'hidden' : ''}`}
                                    >
                                        {ActiveWorkbench && <ActiveWorkbench />}
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