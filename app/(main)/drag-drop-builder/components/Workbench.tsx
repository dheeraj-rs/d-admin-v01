import React, { useEffect, useRef, useState } from 'react';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import ArrowDownIcon from '@heroicons/react/24/outline/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/outline/ArrowUpIcon';
import CursorArrowRaysIcon from '@heroicons/react/24/outline/CursorArrowRaysIcon';
import ArrowSmallUpIcon from '@heroicons/react/24/outline/ArrowSmallUpIcon'; // Check if needed

import { ImageDialog } from '../dialogs/ImageDialog';
import { ButtonDialog } from '../dialogs/ButtonDialog';
import { LinkDialog } from '../dialogs/LinkDialog';
import { SvgDialog } from '../dialogs/SvgDialog';
import { ExportDialog } from '../dialogs/ExportDialog';
import { PublishDialog } from '../dialogs/PublishDialog';
import { SaveProjectModal } from '../dialogs/SaveProjectModal';
import { ReorderModal } from './ReorderModal';

import {
  savePage,
  loadPage,
} from '../lib/api';
import {
  debounce,
  isEventOnElement,
  isElementTopHalf,
} from '../lib/utils';
import {
  Component,
  ComponentWithCategories,
} from '../types';
import {
  exportAsHTML,
  exportAsReactProject,
} from '../lib/export-utils';
import { useBuilderStore } from '../store/builder-store';
import { useProjectsStore } from '../store/projects-store';

import { useIsMobile } from '@/core/hooks/use-mobile';
import '../styles/builder.css';


export function Workbench() {
  const {
    components,
    isPreview,
    showReorderModal,
    error,
    pendingAddComponent,
    selectedElement,
    showImageDialog,
    showButtonDialog,
    showLinkDialog,
    showSvgDialog,
    showExportDialog,
    showPublishDialog,

    setIsPreview,
    setShowReorderModal,
    setPendingAddComponent,
    setSelectedElement,

    setShowImageDialog,
    setShowButtonDialog,
    setShowLinkDialog,
    setShowSvgDialog,
    setShowExportDialog,
    setShowPublishDialog,
    showSaveDialog,
    setShowSaveDialog,
    clearCanvasTrigger,
  } = useBuilderStore();
  const { currentProjectId, getProject } = useProjectsStore();
  const isMobile = useIsMobile();

  const canvasRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const moveUpRef = useRef<SVGSVGElement>(null);
  const moveDownRef = useRef<SVGSVGElement>(null);
  const deleteRef = useRef<SVGSVGElement>(null);
  const popoverElementRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<SVGSVGElement>(null);

  const [hoveredComponent, setHoveredComponent] =
    useState<HTMLDivElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null,
  );
  const [isEmptyCanvas, setIsEmptyCanvas] = useState<boolean>(true);
  const [hasContent, setHasContent] = useState(false);

  // Component Control State
  const [canMoveUp, setCanMoveUp] = useState(false);
  const [canMoveDown, setCanMoveDown] = useState(false);

  const standaloneServer = false;

  // Auto-save on DOM changes
  const onDomChange = () => {
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    };
    const observer = new MutationObserver(
      debounce(() => {
        const html = canvasRef.current?.innerHTML;
        if (html) savePage(html, standaloneServer);
        setHasContent(!!html && html.trim().length > 0);
        setIsEmptyCanvas(!html || html.trim().length === 0);
      }),
    );
    observer.observe(canvasRef.current!, config);
    return observer;
  };

  // Initialize: load page
  // Initialize: Observer
  useEffect(() => {
    if (canvasRef.current) {
      const observer = onDomChange();
      return () => observer.disconnect();
    }
  }, []);

  // Handle Clear Canvas Trigger
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
      setHasContent(false);
      setIsEmptyCanvas(true);
      // Double ensure we cleared the draft in storage
      savePage('', standaloneServer);
    }
  }, [clearCanvasTrigger]);

  // Load Content (Project or Draft)
  useEffect(() => {
    if (!canvasRef.current) return;

    if (currentProjectId) {
      const project = getProject(currentProjectId);
      if (project) {
        console.log('Loading project:', project.name);
        canvasRef.current.innerHTML = project.html;
        // Update local draft to match project
        savePage(project.html, standaloneServer);
        setHasContent(!!project.html && project.html.trim().length > 0);
        setIsEmptyCanvas(!project.html || project.html.trim().length === 0);
      }
    } else {
      // Load Draft
      loadPage(standaloneServer).then((html) => {
        // Double check we are still in draft mode
        if (
          canvasRef.current &&
          !useProjectsStore.getState().currentProjectId
        ) {
          canvasRef.current.innerHTML = html;
          setHasContent(!!html && html.trim().length > 0);
          setIsEmptyCanvas(!html || html.trim().length === 0);
        }
      });
    }
  }, [currentProjectId, getProject, standaloneServer]);

  // Handle header actions
  const { headerAction, setHeaderAction } = useBuilderStore();

  useEffect(() => {
    if (headerAction === 'preparePublish') {
      if (canvasRef.current) {
        const html = canvasRef.current.innerHTML;
        localStorage.setItem('drag-drop-builder-html', html);
        setShowPublishDialog(true);
      }
      setHeaderAction(null);
    } else if (headerAction === 'save') {
      setShowSaveDialog(true);
      setHeaderAction(null);
    }
  }, [headerAction, setHeaderAction, setShowPublishDialog, setShowSaveDialog]);

  // Handle pending add component (from Sidebar click)
  useEffect(() => {
    if (pendingAddComponent) {
      addComponentToCanvas(pendingAddComponent);
      setPendingAddComponent(null);
    }
  }, [pendingAddComponent, setPendingAddComponent]);

  // Fix mobile touch scrolling while preserving contentEditable
  useEffect(() => {
    if (!isMobile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    let touchStartY = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchMoveY = e.touches[0].clientY;
      const deltaY = Math.abs(touchMoveY - touchStartY);

      // If moved more than 10px, consider it scrolling
      if (deltaY > 10) {
        isScrolling = true;
        // Temporarily disable text selection during scroll
        canvas.style.userSelect = 'none';
        canvas.style.webkitUserSelect = 'none';
      }
    };

    const handleTouchEnd = () => {
      // Re-enable text selection after scroll ends
      if (isScrolling) {
        setTimeout(() => {
          canvas.style.userSelect = '';
          canvas.style.webkitUserSelect = '';
        }, 50);
      }
      isScrolling = false;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, hasContent]);

  // Clear all components
  const clearComponents = async () => {
    canvasRef.current!.innerHTML = '';
  };

  // Get all components from canvas
  const getComponents = (): HTMLDivElement[] => {
    return Array.from(canvasRef.current?.children ?? []).filter(
      (c) => c.tagName !== 'SCRIPT',
    ) as HTMLDivElement[];
  };

  // Handle component drop
  const onCanvasDrop = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();

    const [categoryId, componentId] = e
      .dataTransfer!.getData('component')
      .split('-');
    if (
      !components[categoryId] ||
      !components[categoryId][componentId as unknown as number]
    )
      return;

    const component: Component =
      components[categoryId][componentId as unknown as number];
    const html = component.source;

    // Create a temporary container to parse and modify the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Add data attribute to the first child element for identification
    const firstChild = tempDiv.firstElementChild as HTMLElement;
    if (firstChild) {
      // Format as "BANNER 1", "CTA 2", etc.
      const componentName = `${categoryId.toUpperCase()} ${parseInt(componentId) + 1}`;
      firstChild.setAttribute('data-component-name', componentName);
    }

    const modifiedHtml = tempDiv.innerHTML;

    const _components = getComponents();
    if (_components.length === 0) {
      canvasRef.current!.innerHTML = modifiedHtml;
    } else if (hoveredComponent && isElementTopHalf(hoveredComponent!, e)) {
      hoveredComponent!.insertAdjacentHTML('beforebegin', modifiedHtml);
    } else if (hoveredComponent && !isElementTopHalf(hoveredComponent!, e)) {
      hoveredComponent!.insertAdjacentHTML('afterend', modifiedHtml);
    }

    removeBorders();
    setHoveredComponent(null);
    setIsEmptyCanvas(false);
  };

  // Handle mouse over canvas
  const onCanvasMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    if (!popoverRef.current) return;

    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      setHoveredElement(target);
      if (popoverElementRef.current) {
        popoverElementRef.current.style.top = `${target.offsetTop}px`;
        popoverElementRef.current.style.left = `${target.offsetLeft}px`;
      }
    } else if (target.tagName === 'BUTTON') {
      setHoveredElement(target);
      if (popoverElementRef.current) {
        popoverElementRef.current.style.top = `${target.offsetTop}px`;
        popoverElementRef.current.style.left = `${target.offsetLeft}px`;
      }
    }

    // Get hovered component
    const components = getComponents();
    const component = components.find((c) => c.matches(':hover'));
    if (!component) return;

    // Update hovered component
    setHoveredComponent(component);
    popoverRef.current.style.top = `${component.offsetTop}px`;
    popoverRef.current.style.left = `${component.offsetLeft}px`;

    // Update component control state
    const index = components.indexOf(component);
    setCanMoveUp(index > 0);
    setCanMoveDown(index < components.length - 1);
  };

  // Handle mouse leave canvas
  const onCanvasMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!isEventOnElement(popoverRef.current!, e)) {
      setHoveredComponent(null);
    }
  };

  // Handle mouse out canvas
  const onCanvasMouseOut = (e: React.MouseEvent<HTMLElement>) => {
    if (!isEventOnElement(popoverElementRef.current!, e)) {
      setHoveredElement(null);
    }
  };

  // Handle canvas click
  const onCanvasClickCapture = (e: React.MouseEvent<HTMLElement>) => {
    if (isPreview) return;

    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    setSelectedElement(target);

    // Handle element clicks
    if (target.tagName === 'IMG') {
      setShowImageDialog(true);
    } else if (target.tagName === 'path') {
      setShowSvgDialog(true);
    } else if (target.tagName === 'svg') {
      setShowSvgDialog(true);
    }

    // Handle popover clicks
    if (isEventOnElement(deleteRef.current, e)) {
      const clickEvent = new MouseEvent('click', { bubbles: true });
      deleteRef.current!.dispatchEvent(clickEvent);
    } else if (isEventOnElement(moveUpRef.current, e)) {
      const clickEvent = new MouseEvent('click', { bubbles: true });
      moveUpRef.current!.dispatchEvent(clickEvent);
    } else if (isEventOnElement(moveDownRef.current, e)) {
      const clickEvent = new MouseEvent('click', { bubbles: true });
      moveDownRef.current!.dispatchEvent(clickEvent);
    }
  };

  // Component actions
  const onComponentDelete = () => {
    if (canvasRef.current && hoveredComponent) {
      canvasRef.current.removeChild(hoveredComponent);
      setHoveredComponent(null);
    }
  };

  const onComponentMoveUp = () => {
    if (
      canvasRef.current &&
      hoveredComponent &&
      hoveredComponent.previousElementSibling
    ) {
      canvasRef.current.insertBefore(
        hoveredComponent,
        hoveredComponent.previousElementSibling,
      );
      setHoveredComponent(null);
    }
  };

  const onComponentMoveDown = () => {
    if (
      canvasRef.current &&
      hoveredComponent &&
      hoveredComponent.nextElementSibling
    ) {
      canvasRef.current.insertBefore(
        hoveredComponent.nextElementSibling,
        hoveredComponent,
      );
      setHoveredComponent(null);
    }
  };

  // Handle drag over
  const onCanvasDragOver = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    // Update empty flag
    const components = getComponents();
    const isEmpty = components.length === 0;
    if (isEmpty !== isEmptyCanvas) setIsEmptyCanvas(isEmpty);

    // Get hovered component
    if (components.length === 0) return;
    const componentWithEvent = components.find((c) => isEventOnElement(c, e));
    const component = componentWithEvent ?? components[components.length - 1];

    if (!component) return;

    // Update border
    const isTopHalf = isElementTopHalf(component, e);
    component.style.setProperty(
      'box-shadow',
      isTopHalf
        ? ' 0px 6px 0px -2px var(--d-admin-primary-color) inset'
        : '0px -6px 0px -2px var(--d-admin-primary-color) inset',
    );

    // Update hovered component
    if (!component.isEqualNode(hoveredComponent)) {
      setHoveredComponent(component);
    }
  };

  // Remove borders
  const removeBorders = () => {
    const components = getComponents();
    components.forEach((c: HTMLDivElement) => {
      c.style.setProperty('box-shadow', '');
    });
  };

  // Handle drag leave
  const onCanvasDragLeave = (e: React.DragEvent<HTMLElement>) => {
    if (!canvasRef.current?.contains(e.relatedTarget as HTMLElement)) {
      setHoveredComponent(null);
      removeBorders();
    }
    setIsEmptyCanvas(false);
  };

  // Add Component to Canvas (Tap to Add)
  const addComponentToCanvas = (component: Component) => {
    const html = component.source;

    // Create a temporary container to parse and modify the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Add data attribute to the first child element for identification
    const firstChild = tempDiv.firstElementChild as HTMLElement;
    if (firstChild && component.folder) {
      // Extract category and number from folder (e.g., "banner1" -> "BANNER 1")
      const folderName = component.folder.replace(/[0-9]/g, ''); // Remove numbers
      const folderNumber = component.folder.match(/\d+/)?.[0] || ''; // Extract number
      const componentName = `${folderName.toUpperCase()} ${folderNumber}`;
      firstChild.setAttribute('data-component-name', componentName.trim());
    }

    const modifiedHtml = tempDiv.innerHTML;

    if (canvasRef.current) {
      canvasRef.current.insertAdjacentHTML('beforeend', modifiedHtml);
      savePage(canvasRef.current.innerHTML, standaloneServer);
    }
  };

  // Apply reorder from modal
  const handleApplyReorder = (newOrder: HTMLDivElement[]) => {
    if (!canvasRef.current) return;

    // Clear canvas
    canvasRef.current.innerHTML = '';

    // Append elements in new order
    newOrder.forEach((element) => {
      canvasRef.current!.appendChild(element);
    });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[var(--d-admin-surface-section)] text-[var(--d-admin-text-color)] border-t border-[var(--d-admin-surface-border)]">
      {/* Error Alert */}
      {error && (
        <div
          className="relative m-2 mx-4 rounded border border-red-500 bg-red-50 px-4 py-3 text-red-600"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Canvas Area */}
      <div
        className={`relative flex-1 overflow-y-auto ${isPreview ? 'p-0' : 'p-4'}`}
      >
        <div className="flex min-h-full justify-center">
          {/* Dialogs */}
          <ImageDialog
            isOpen={showImageDialog}
            onClose={() => setShowImageDialog(false)}
            element={selectedElement as HTMLImageElement}
            standaloneServer={standaloneServer}
          />
          <ButtonDialog
            isOpen={showButtonDialog}
            onClose={() => setShowButtonDialog(false)}
            element={selectedElement as HTMLButtonElement}
          />
          <LinkDialog
            isOpen={showLinkDialog}
            onClose={() => setShowLinkDialog(false)}
            element={selectedElement as HTMLAnchorElement}
          />
          <SvgDialog
            isOpen={showSvgDialog}
            onClose={() => setShowSvgDialog(false)}
            element={selectedElement as unknown as SVGElement}
          />
          <ExportDialog
            isOpen={showExportDialog}
            onClose={() => setShowExportDialog(false)}
            onExportHTML={() => {
              if (canvasRef.current) {
                exportAsHTML(canvasRef.current.innerHTML);
              }
            }}
            onExportReact={() => {
              if (canvasRef.current) {
                exportAsReactProject(canvasRef.current.innerHTML);
              }
            }}
          />
          <PublishDialog
            isOpen={showPublishDialog}
            onClose={() => setShowPublishDialog(false)}
            onPublishHTML={() => {
              // Handled by PublishDialog inline modal
            }}
            onPublishReact={() => {
              // Handled by PublishDialog inline modal
            }}
          />
          <SaveProjectModal
            isOpen={showSaveDialog}
            onClose={() => setShowSaveDialog(false)}
            getHtmlContent={() => canvasRef.current?.innerHTML || ''}
          />

          {/* Element Popover */}
          {!isPreview && (
            <div
              ref={popoverElementRef}
              className="absolute z-10 rounded-md bg-gray-800 shadow-lg"
              style={{ display: hoveredElement ? 'block' : 'none' }}
            >
              <div className="flex flex-row p-1">
                <CursorArrowRaysIcon
                  ref={optionsRef}
                  onClick={() => {
                    setSelectedElement(hoveredElement);
                    if (hoveredElement?.tagName === 'BUTTON') {
                      setShowButtonDialog(true);
                    } else if (hoveredElement?.tagName === 'A') {
                      setShowLinkDialog(true);
                    }
                  }}
                  className="h-6 w-6 cursor-pointer p-1 text-white hover:text-blue-400"
                />
              </div>
            </div>
          )}

          {/* Component Popover */}
          {!isPreview && (
            <div
              ref={popoverRef}
              onMouseLeave={(e: any) => {
                if (!canvasRef.current?.isSameNode(e.target)) {
                  setHoveredComponent(null);
                }
              }}
              className="absolute z-10 rounded-md bg-gray-800 shadow-lg"
              style={{ display: hoveredComponent ? 'block' : 'none' }}
            >
              <div className="flex flex-row gap-1 p-1">
                {canMoveDown && (
                  <ArrowDownIcon
                    ref={moveDownRef}
                    onClick={onComponentMoveDown}
                    className="h-6 w-6 cursor-pointer p-1 text-white hover:text-blue-400"
                  />
                )}
                {canMoveUp && (
                  <ArrowUpIcon
                    ref={moveUpRef}
                    onClick={onComponentMoveUp}
                    className="h-6 w-6 cursor-pointer p-1 text-white hover:text-blue-400"
                  />
                )}
                <TrashIcon
                  id="delete"
                  ref={deleteRef}
                  onClick={onComponentDelete}
                  className="h-6 w-6 cursor-pointer p-1 text-white hover:text-red-400"
                />
              </div>
            </div>
          )}

          {/* Canvas */}
          <div
            id="editor"
            ref={canvasRef}
            className={`ease-animation flex-1 transition-all duration-300 ${isPreview ? 'min-h-full' : 'min-h-[1024px]'} bg-transparent ${isMobile ? 'touch-pan-y [&_img]:select-none [&_img]:[-webkit-user-drag:none]' : ''} ${!hasContent && !isPreview ? 'bg-[radial-gradient(circle_at_center,_var(--d-admin-surface-border)_1px,_transparent_1px)] [background-size:24px_24px] [background-position:center]' : ''} [&_img]:cursor-pointer`}
            onMouseOver={onCanvasMouseOver}
            onMouseLeave={onCanvasMouseLeave}
            onMouseOut={onCanvasMouseOut}
            onDrop={onCanvasDrop}
            onDragOver={onCanvasDragOver}
            onDragLeave={onCanvasDragLeave}
            onClickCapture={onCanvasClickCapture}
            style={{
              // boxShadow: isEmptyCanvas ? '0 0 0 2px var(--d-admin-primary-color) inset' : (isPreview ? 'none' : '0 0 40px -10px rgba(0,0,0,0.1)'),
              width: isPreview ? '100%' : '100%',
              maxWidth: isPreview ? '100%' : '1024px',
              outline: 'none',
            }}
            contentEditable={!isPreview && hasContent}
          />


          {/* Reorder Modal */}
          <ReorderModal
            isOpen={showReorderModal}
            onClose={() => setShowReorderModal(false)}
            onApply={handleApplyReorder}
            components={getComponents()}
          />
        </div>
      </div>
    </div>
  );
}
