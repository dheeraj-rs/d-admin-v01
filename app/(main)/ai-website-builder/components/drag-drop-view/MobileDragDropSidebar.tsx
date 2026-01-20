import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDragDropStore } from '../../drag-drop-view/lib/drag-drop-store';
import { DragDropSidebarContent } from './DragDropSidebarContent';

export function MobileDragDropSidebar() {
    const { showMobileSidebar, setMobileSidebar } = useDragDropStore();

    if (!showMobileSidebar) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col h-[45vh] bg-[var(--d-admin-surface-ground)] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-[var(--d-admin-surface-border)] animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle Indicator */}
            <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setMobileSidebar(false)}>
                <div className="w-12 h-1.5 rounded-full bg-[var(--d-admin-surface-border)]" />
            </div>

            <div className="flex items-center justify-between px-6 py-2 border-b border-[var(--d-admin-surface-border)]/50">
                <span className="font-semibold text-[var(--d-admin-text-color)] text-lg">Add Element</span>
                <button
                    onClick={() => setMobileSidebar(false)}
                    className="p-2 rounded-full text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)] transition-colors"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 pb-8">
                <DragDropSidebarContent />
            </div>
        </div>
    );
}
