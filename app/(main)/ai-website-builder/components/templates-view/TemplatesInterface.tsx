import { Icon } from '@iconify/react';

export function TemplatesInterface() {
    return (
        <div className="flex flex-col h-full w-full bg-[var(--d-admin-surface-ground)] items-center justify-center text-[var(--d-admin-text-color-secondary)]">
            <Icon icon="lucide:layout-template" className="size-12 mb-4 opacity-50" />
            <h2 className="text-xl font-medium mb-2 opacity-80">Templates Library</h2>
            <p className="text-sm max-w-xs text-center opacity-60">Browse and select from a variety of pre-built templates to kickstart your project.</p>
        </div>
    );
}
