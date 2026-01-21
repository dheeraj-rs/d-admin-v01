import React from 'react';
import { XMarkIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { useDragDropStore } from '../../../drag-drop-builder/drag-drop-view/lib/drag-drop-store';
import { DragDropSidebarContent } from './DragDropSidebarContent';

export function MobileDragDropSidebar() {
    const { showMobileSidebar, setMobileSidebar, showReorderModal, setShowReorderModal } = useDragDropStore();
    const [height, setHeight] = React.useState('45vh');
    const [isResizing, setIsResizing] = React.useState(false);
    const startY = React.useRef(0);
    const startH = React.useRef(0);

    if (!showMobileSidebar) return null;

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsResizing(true);
        startY.current = e.touches[0].clientY;
        const currentHeight = window.innerHeight * (parseFloat(height) / 100);
        startH.current = currentHeight || (window.innerHeight * 0.45);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const delta = startY.current - e.touches[0].clientY; // Dragging up = positive delta
        const newH = startH.current + delta;
        const maxH = window.innerHeight * 0.9;
        const minH = window.innerHeight * 0.2;

        if (newH > minH && newH < maxH) {
            setHeight(`${(newH / window.innerHeight) * 100}vh`);
        }
    };

    const handleTouchEnd = () => {
        setIsResizing(false);
    };

    return (
        <div
            style={{ height }}
            className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-[var(--d-admin-surface-ground)] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-[var(--d-admin-surface-border)] animate-in slide-in-from-bottom transform-gpu ${isResizing ? 'transition-none duration-0' : 'duration-300'}`}
        >
            {/* Drag Handle Indicator */}
            <div
                className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={(e) => {
                    // Only close if it was a quick tap, not a drag
                    // Logic could optionally be added, but for now specific close button exists
                }}
            >
                <div className="w-12 h-1.5 rounded-full bg-[var(--d-admin-surface-border)]" />
            </div>

            <div className="flex items-center justify-between px-6 py-2 border-b border-[var(--d-admin-surface-border)]/50">
                <span className="font-semibold text-[var(--d-admin-text-color)] text-lg">Add Element</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setShowReorderModal(true);
                            setMobileSidebar(false);
                        }}
                        className={`p-2 rounded-full transition-colors ${showReorderModal
                            ? 'bg-[var(--d-admin-primary-color)] text-white'
                            : 'text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]'
                            }`}
                        title="Reorder Components"
                    >
                        <Bars3BottomLeftIcon className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setMobileSidebar(false)}
                        className="p-2 rounded-full text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)] transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 pb-8">
                <DragDropSidebarContent />
            </div>
        </div>
    );
}
