import React, { useState, useEffect } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderStore } from '../store/builder-store';

interface ReorderItem {
  id: string;
  element: HTMLElement;
  preview: string;
  thumbnail: string; // Base64 image data URL
}

interface SortableItemProps {
  item: ReorderItem;
  index: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

function SortableItem({
  item,
  index,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 rounded-lg border p-2 transition-all ${
        isDragging
          ? 'z-10 border-[var(--d-admin-primary-color)] bg-[var(--d-admin-surface-hover)] shadow-lg'
          : 'border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] hover:bg-[var(--d-admin-surface-hover)]'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none p-2 text-[var(--d-admin-text-color-secondary)] active:cursor-grabbing hover:text-[var(--d-admin-text-color)]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            d="M2.66669 5.33333H13.3334M2.66669 8H13.3334M2.66669 10.6667H9.33335"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Position Number */}
      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--d-admin-primary-color)] text-[10px] font-bold text-white">
        {index + 1}
      </div>

      {/* Thumbnail Preview - significantly wider for desktop components */}
      <div className="flex h-16 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-[var(--d-admin-surface-border)] bg-transparent">
        <img
          src={item.thumbnail}
          alt={item.preview}
          className="h-full w-full object-contain"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>

      {/* Preview Text */}
      <div className="min-w-0 flex-1 pl-1">
        <p className="truncate text-xs font-medium text-[var(--d-admin-text-color)]">
          {item.preview}
        </p>
      </div>

      {/* Arrow Buttons - Opacity fade/show on group hover */}
      <div className="flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
        <button
          onClick={() => onMoveUp(index)}
          disabled={isFirst}
          className={`rounded p-0.5 transition-colors ${
            isFirst
              ? 'cursor-not-allowed text-[var(--d-admin-text-color-secondary)] opacity-30'
              : 'text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]'
          }`}
        >
          <ChevronUpIcon className="h-3 w-3" />
        </button>
        <button
          onClick={() => onMoveDown(index)}
          disabled={isLast}
          className={`rounded p-0.5 transition-colors ${
            isLast
              ? 'cursor-not-allowed text-[var(--d-admin-text-color-secondary)] opacity-30'
              : 'text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]'
          }`}
        >
          <ChevronDownIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}


export function LayersPanel() {
  const { activeLayers, setActiveLayers, triggerReorder } = useBuilderStore();
  const [items, setItems] = useState<ReorderItem[]>([]);

  // Configure sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Sync state with store activeLayers
  useEffect(() => {
    const generateThumbnails = async () => {
      const reorderItems = await Promise.all(
        activeLayers.map(async (comp, index) => {
          // Check if we already have a thumbnail stored to avoid regenerating unnecessarily
          // For now regenerated to ensure fresh state, but sidebar toggle is fast.
          // Optimization: could store thumbnail in a map in store if needed.
          
          return {
            id: `layer-${index}-${Date.now()}`, // Unique ID for DnD
            element: comp,
            preview: getComponentPreview(comp),
            thumbnail: await generateThumbnail(comp),
          };
        }),
      );
      setItems(reorderItems);
    };

    if (activeLayers.length > 0) {
      generateThumbnails();
    } else {
      setItems([]);
    }
  }, [activeLayers]);

  // Generate thumbnail from component element
  const generateThumbnail = async (
    element: HTMLElement,
  ): Promise<string> => {
    try {
      const { toPng } = await import('html-to-image');

      const dataUrl = await toPng(element, {
        quality: 0.8,
        pixelRatio: 0.5,
        cacheBust: true,
        backgroundColor: '#1f2937',
        width: element.offsetWidth,
        height: Math.min(element.offsetHeight, 800),
        style: {
            transform: 'scale(1)',
            margin: '0',
            maxHeight: 'none', // Allow full capture within limit
        },
      });

      return dataUrl;
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gUHJldmlldzwvdGV4dD48L3N2Zz4=';
    }
  };

  const getComponentPreview = (element: HTMLElement): string => {
    const dataName =
      element.getAttribute('data-component-name') ||
      element.getAttribute('data-name');

    if (dataName) {
      const icon = getIconForCategory(dataName);
      return `${icon} ${dataName}`;
    }
    
    // Fallback logic SAME as ReorderModal
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading?.textContent) {
      const text = heading.textContent.trim();
      const emoji = heading.tagName === 'H1' ? '🎯' : '📝';
      return text.length <= 25 ? `${emoji} ${text}` : `${emoji} ${text.substring(0, 22)}...`;
    }

    return 'Component';
  };

  const getIconForCategory = (name: string): string => {
     const lowerName = name.toLowerCase();
     if (lowerName.includes('banner')) return '🎯';
     if (lowerName.includes('cta')) return '📢';
     if (lowerName.includes('footer')) return '📋';
     if (lowerName.includes('nav')) return '🧭';
     // ... Add others as needed, simplified for now
     return '🧩';
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      
      // Update Store and Trigger Reorder
      const newOrder = newItems.map(i => i.element);
      setActiveLayers(newOrder); // Update store ref
      triggerReorder(); // Tell workbench to update DOM
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = arrayMove(items, index, index - 1);
    setItems(newItems);
    setActiveLayers(newItems.map(i => i.element));
    triggerReorder();
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = arrayMove(items, index, index + 1);
    setItems(newItems);
    setActiveLayers(newItems.map(i => i.element));
    triggerReorder();
  };

  return (
    <div className="flex h-full flex-col">
       <div className="flex-1 space-y-2 overflow-y-auto p-2 custom-scrollbar">
          {items.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--d-admin-text-color-secondary)]">
              No components added yet.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item, index) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    index={index}
                    onMoveUp={moveUp}
                    onMoveDown={moveDown}
                    isFirst={index === 0}
                    isLast={index === items.length - 1}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
       </div>
    </div>
  );
}
