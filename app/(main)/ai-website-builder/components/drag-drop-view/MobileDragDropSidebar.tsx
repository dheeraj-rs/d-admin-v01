import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDragDropStore } from '../../drag-drop-view/lib/drag-drop-store';
import { DragDropSidebarContent } from './DragDropSidebarContent';

export function MobileDragDropSidebar() {
    const { showMobileSidebar, setMobileSidebar } = useDragDropStore();

    if (!showMobileSidebar) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--d-admin-surface-ground)] animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[var(--d-admin-surface-border)]">
                <span className="font-semibold text-[var(--d-admin-text-color)]">Components</span>
                <button
                    onClick={() => setMobileSidebar(false)}
                    className="p-1 rounded-md text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="flex-1 overflow-hidden">
                <DragDropSidebarContent />
            </div>
        </div>
    );
}
