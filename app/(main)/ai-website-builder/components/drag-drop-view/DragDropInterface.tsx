import { Icon } from '@iconify/react';

export function DragDropInterface() {
    return (
        <div className="flex flex-col h-full w-full bg-[var(--d-admin-surface-ground)] items-center justify-center text-[var(--d-admin-text-color-secondary)]">
            <Icon icon="lucide:hand" className="size-12 mb-4 opacity-50" />
            <h2 className="text-xl font-medium mb-2 opacity-80">Drag & Drop Builder</h2>
            <p className="text-sm max-w-xs text-center opacity-60">This feature is coming soon. You will be able to drag and drop components to build your website.</p>
        </div>
    );
}   
