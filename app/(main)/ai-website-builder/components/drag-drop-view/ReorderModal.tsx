import React, { useState, useEffect } from 'react';
import { XMarkIcon, Bars3Icon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
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

interface ReorderItem {
    id: string;
    element: HTMLDivElement;
    preview: string;
    thumbnail: string; // Base64 image data URL
}

interface ReorderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (newOrder: HTMLDivElement[]) => void;
    components: HTMLDivElement[];
}

interface SortableItemProps {
    item: ReorderItem;
    index: number;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
    isFirst: boolean;
    isLast: boolean;
}

function SortableItem({ item, index, onMoveUp, onMoveDown, isFirst, isLast }: SortableItemProps) {
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
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${isDragging
                ? 'border-[var(--d-admin-primary-color)] bg-[var(--d-admin-surface-hover)] shadow-lg z-10'
                : 'border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] hover:bg-[var(--d-admin-surface-hover)]'
                }`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-[var(--d-admin-text-color-secondary)] touch-none"
            >
                <Bars3Icon className="h-5 w-5" />
            </div>

            {/* Thumbnail Preview */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)]">
                <img
                    src={item.thumbnail}
                    alt={item.preview}
                    className="w-full h-full object-cover object-top"
                />
            </div>

            {/* Position Number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--d-admin-primary-color)] text-white flex items-center justify-center text-sm font-semibold">
                {index + 1}
            </div>

            {/* Preview Text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--d-admin-text-color)] truncate">
                    {item.preview}
                </p>
            </div>

            {/* Arrow Buttons */}
            <div className="flex flex-col gap-1">
                <button
                    onClick={() => onMoveUp(index)}
                    disabled={isFirst}
                    className={`p-1 rounded transition-colors ${isFirst
                        ? 'text-[var(--d-admin-text-color-secondary)] opacity-30 cursor-not-allowed'
                        : 'text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]'
                        }`}
                >
                    <ChevronUpIcon className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onMoveDown(index)}
                    disabled={isLast}
                    className={`p-1 rounded transition-colors ${isLast
                        ? 'text-[var(--d-admin-text-color-secondary)] opacity-30 cursor-not-allowed'
                        : 'text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]'
                        }`}
                >
                    <ChevronDownIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

export function ReorderModal({ isOpen, onClose, onApply, components }: ReorderModalProps) {
    const [items, setItems] = useState<ReorderItem[]>([]);

    // Configure sensors for both mouse and touch
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px of movement before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Initialize items when modal opens
    useEffect(() => {
        if (isOpen && components.length > 0) {
            // Generate items with thumbnails
            const generateThumbnails = async () => {
                const reorderItems = await Promise.all(
                    components.map(async (comp, index) => {
                        const thumbnail = await generateThumbnail(comp);
                        return {
                            id: `item-${index}-${Date.now()}`,
                            element: comp,
                            preview: getComponentPreview(comp),
                            thumbnail,
                        };
                    })
                );
                setItems(reorderItems);
            };

            generateThumbnails();
        }
    }, [isOpen, components]);

    // Generate thumbnail from component element
    const generateThumbnail = async (element: HTMLDivElement): Promise<string> => {
        try {
            // Use html2canvas to capture the element
            const html2canvas = (await import('html2canvas')).default;

            const canvas = await html2canvas(element, {
                scale: 0.2, // Lower scale for smaller thumbnail
                logging: false,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                width: element.offsetWidth,
                height: Math.min(element.offsetHeight, 300), // Max height 300px
            });

            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Failed to generate thumbnail:', error);
            // Return a placeholder SVG
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gUHJldmlldzwvdGV4dD48L3N2Zz4=';
        }
    };

    // Generate preview text from component
    const getComponentPreview = (element: HTMLDivElement): string => {
        // Try to get component name from data attributes (for newly added components)
        const dataName = element.getAttribute('data-component-name') ||
            element.getAttribute('data-name') ||
            element.getAttribute('data-type');

        if (dataName) {
            // Add icon based on category
            const icon = getIconForCategory(dataName);
            return `${icon} ${dataName}`;
        }

        // Try to get the first heading text (most descriptive)
        const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading?.textContent) {
            const text = heading.textContent.trim();
            if (text.length > 0) {
                // Add emoji based on heading level
                const emoji = heading.tagName === 'H1' ? '🎯' : '📝';
                if (text.length <= 35) {
                    return `${emoji} ${text}`;
                }
                return `${emoji} ${text.substring(0, 32)}...`;
            }
        }

        // Fallback to truncated text content
        const text = element.textContent?.trim() || '';
        if (text.length > 35) {
            return text.substring(0, 35) + '...';
        }

        return text || 'Component';
    };

    // Get icon for category
    const getIconForCategory = (name: string): string => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('banner') || lowerName.includes('hero')) return '🎯';
        if (lowerName.includes('cta') || lowerName.includes('call')) return '📢';
        if (lowerName.includes('content')) return '📝';
        if (lowerName.includes('faq') || lowerName.includes('question')) return '❓';
        if (lowerName.includes('footer')) return '📋';
        if (lowerName.includes('header') || lowerName.includes('nav')) return '🧭';
        if (lowerName.includes('pricing') || lowerName.includes('price')) return '💰';
        if (lowerName.includes('testimonial') || lowerName.includes('review')) return '💬';
        if (lowerName.includes('feature')) return '⭐';
        if (lowerName.includes('contact') || lowerName.includes('form')) return '📧';
        if (lowerName.includes('team') || lowerName.includes('about')) return '👥';
        if (lowerName.includes('blog') || lowerName.includes('article')) return '📰';
        return '🧩'; // Default component icon
    };

    // Handle drag end
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // Arrow button handlers
    const moveUp = (index: number) => {
        if (index === 0) return;
        setItems((items) => arrayMove(items, index, index - 1));
    };

    const moveDown = (index: number) => {
        if (index === items.length - 1) return;
        setItems((items) => arrayMove(items, index, index + 1));
    };

    // Apply new order
    const handleApply = () => {
        const newOrder = items.map((item) => item.element);
        onApply(newOrder);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--d-admin-surface-ground)] rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--d-admin-surface-border)]">
                    <h2 className="text-xl font-semibold text-[var(--d-admin-text-color)]">
                        Reorder Components
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)] transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Instructions */}
                <div className="px-6 py-3 bg-[var(--d-admin-surface-section)] border-b border-[var(--d-admin-surface-border)]">
                    <p className="text-sm text-[var(--d-admin-text-color-secondary)]">
                        Drag items to reorder or use arrow buttons
                    </p>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-[var(--d-admin-text-color-secondary)]">
                            No components to reorder
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

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--d-admin-surface-border)]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={items.length === 0}
                        className="px-6 py-2 rounded-lg bg-[var(--d-admin-primary-color)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Apply Order
                    </button>
                </div>
            </div>
        </div>
    );
}
