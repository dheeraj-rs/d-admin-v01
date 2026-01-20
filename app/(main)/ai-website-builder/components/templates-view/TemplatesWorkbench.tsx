import { Icon } from '@iconify/react';

export function TemplatesWorkbench() {
    return (
        <div className="flex flex-col h-full w-full bg-[var(--d-admin-surface-ground)]/5 items-center justify-center text-[var(--d-admin-text-color)] border border-[var(--d-admin-surface-border)] rounded-tl-xl overflow-hidden m-2 mr-0">
            <div className="flex flex-col items-center opacity-40">
                <Icon icon="lucide:presentation" className="size-16 mb-6" />
                <h2 className="text-2xl font-semibold mb-2">Template Preview</h2>
                <p className="text-base text-center max-w-md">
                    Select a template from the sidebar to preview it here.
                </p>
            </div>
        </div>
    );
}
