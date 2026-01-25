'use client';

import { useEffect } from 'react';
import { Header } from './drag-drop-view/components/Header';
import { DragDropInterface } from './drag-drop-view/components/DragDropInterface';
import { DragDropWorkbench } from './drag-drop-view/components/DragDropWorkbench';
import { MobileDragDropSidebar } from './drag-drop-view/components/MobileDragDropSidebar';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useAiBuilderStore } from './store/ai-builder-store';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { useDragDropStore } from './drag-drop-view/lib/drag-drop-store';
import { ProjectsGallery } from './drag-drop-view/components/ProjectsGallery';

export default function DragDropBuilderPage() {
  const { setBuilderView } = useAiBuilderStore();
  const isMobile = useIsMobile();
  const { isPreview, showProjectsGallery } = useDragDropStore();

  useEffect(() => {
    setBuilderView('drag-drop');
  }, [setBuilderView]);

  const showInterface = (isMobile ? false : true) && !isPreview;

  return (
    <div className="relative h-full w-full bg-gradient-to-tl from-[var(--d-admin-surface-ground)] to-[var(--d-admin-surface-section)] text-[var(--d-admin-text-color)]">
      <div className="relative z-10 flex h-full w-full flex-col">
        <Header />
        <div className="relative h-full w-full flex-1 overflow-hidden">
          {showProjectsGallery && <ProjectsGallery />}
          {/* Mobile Sidebar Overlay */}
          <MobileDragDropSidebar />

          {/* Mobile Add Component FAB */}
          {isMobile && !isPreview && (
            <button
              onClick={() => useDragDropStore.getState().setMobileSidebar(true)}
              className="fixed right-5 bottom-14 z-40 flex size-14 items-center justify-center rounded-full bg-[var(--d-admin-primary-color)] text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              aria-label="Add Component"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          )}

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
                    defaultSize={isMobile ? 100 : 25}
                    minSize={isMobile ? 100 : 20}
                    className="h-full"
                  >
                    <DragDropInterface />
                  </Panel>
                )}
                {!isMobile && showInterface &&
                <PanelResizeHandle
                  className="group relative"
                  style={{ touchAction: 'none' }}
                >
                  <div className="absolute inset-0 z-10 flex w-2 items-center justify-center" />
                </PanelResizeHandle>
                }
                <Panel
                  id="workbench-panel"
                  order={2}
                  defaultSize={isMobile ? 100 : 75}
                  minSize={isMobile ? 100 : 50}
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
