import React from 'react';
import { Icon } from '@iconify/react';

export function DragDropPlaceholder() {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-[var(--d-admin-text-color-secondary)]">
            <div className="bg-[var(--d-admin-surface-card)] p-8 rounded-full mb-6 border border-[var(--d-admin-surface-border)] shadow-[0_0_30px_-10px_var(--d-admin-primary-color)] relative group">
                <div className="absolute inset-0 bg-[var(--d-admin-primary-color)] opacity-5 blur-xl rounded-full"></div>
                <Icon icon="lucide:layout-dashed" className="size-16 text-[var(--d-admin-primary-color)] relative z-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-[var(--d-admin-text-color)] tracking-tight">Start Building</h2>
            <p className="text-center max-w-sm mb-8 opacity-70">
                Drag and drop components from the sidebar<br />to start creating your website.
            </p>
            <div className="flex gap-4 opacity-50 text-sm">
                <div className="flex items-center gap-2">
                    <Icon icon="lucide:mouse-pointer-click" />
                    <span>Select</span>
                </div>
                <div className="flex items-center gap-2">
                    <Icon icon="lucide:move" />
                    <span>Drag</span>
                </div>
                <div className="flex items-center gap-2">
                    <Icon icon="lucide:edit-3" />
                    <span>Edit</span>
                </div>
            </div>
        </div>
    );
}
