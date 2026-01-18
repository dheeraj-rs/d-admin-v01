import { Icon } from '@iconify/react';

export function DragDropWorkbench() {
    return (
        <div className="flex flex-col h-full w-full bg-white/5 items-center justify-center text-[var(--d-admin-text-color)] border border-[var(--d-admin-surface-border)] rounded-tl-xl overflow-hidden m-2 mr-0">
            <div className="flex flex-col items-center opacity-40">
                <Icon icon="lucide:box-select" className="size-16 mb-6" />
                <h2 className="text-2xl font-semibold mb-2">Canvas Area</h2>
                <p className="text-base text-center max-w-md">
                    Target droppable zone for your components.
                </p>
            </div>
        </div>
    );
}
