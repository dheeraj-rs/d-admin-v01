'use client';

import { useEffect } from 'react';
import { Header } from '../ai-website-builder/ai-chat-view/Header';
import { DragDropInterface } from '../ai-website-builder/components/drag-drop-view/DragDropInterface';
import { DragDropWorkbench } from '../ai-website-builder/components/drag-drop-view/DragDropWorkbench';
import { MobileDragDropSidebar } from '../ai-website-builder/components/drag-drop-view/MobileDragDropSidebar';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useAiBuilderStore } from '../ai-website-builder/store/ai-builder-store';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { useDragDropStore } from '../ai-website-builder/drag-drop-view/lib/drag-drop-store';
import { ProjectsGallery } from '../ai-website-builder/drag-drop-view/components/ProjectsGallery';
import { polyfill } from "mobile-drag-drop";
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";

export default function DragDropBuilderPage() {
    const { setBuilderView } = useAiBuilderStore();
    const isMobile = useIsMobile();
    const { isPreview, showProjectsGallery } = useDragDropStore();

    useEffect(() => {
        // Initialize mobile drag and drop polyfill
        polyfill({
            dragImageCenterOnTouch: true,
            // Force drag image to follow finger exactly
            dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
        });

        // Fix for iOS scrolling while dragging
        document.addEventListener("touchmove", function (e) { }, { passive: false });

        setBuilderView('drag-drop');
    }, [setBuilderView]);

    const showInterface = (isMobile ? false : true) && !isPreview;

    return (
        <div className="w-full h-full relative text-[var(--d-admin-text-color)] bg-gradient-to-tl from-[var(--d-admin-surface-ground)] to-[var(--d-admin-surface-section)]">
            <div className="flex flex-col h-full w-full relative z-10">
                <Header />
                <div className="relative flex-1 w-full h-full overflow-hidden">
                    {showProjectsGallery && <ProjectsGallery />}
                    {/* Mobile Sidebar Overlay */}
                    <MobileDragDropSidebar />

                    {/* Mobile Add Component FAB */}
                    {isMobile && !isPreview && (
                        <button
                            onClick={() => useDragDropStore.getState().setMobileSidebar(true)}
                            className="fixed bottom-24 right-5 z-40 size-14 rounded-full bg-[var(--d-admin-primary-color)] text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                            aria-label="Add Component"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    )}

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
                                        <DragDropInterface />
                                    </Panel>
                                )}

                                {!isMobile && showInterface && (
                                    <PanelResizeHandle className="w-1 bg-transparent hover:bg-blue-500/50 transition-colors" />
                                )}

                                <Panel
                                    id="workbench-panel"
                                    order={2}
                                    defaultSize={isMobile ? 100 : 75}
                                    minSize={isMobile ? 100 : 30}
                                    className="h-full"
                                >
                                    <DragDropWorkbench />
                                </Panel>
                            </PanelGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
