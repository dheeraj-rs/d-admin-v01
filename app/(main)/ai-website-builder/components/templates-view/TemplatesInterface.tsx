import { Icon } from '@iconify/react';

export function TemplatesInterface() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--d-admin-surface-ground)] text-[var(--d-admin-text-color-secondary)]">
      <Icon icon="lucide:layout-template" className="mb-4 size-12 opacity-50" />
      <h2 className="mb-2 text-xl font-medium opacity-80">Templates Library</h2>
      <p className="max-w-xs text-center text-sm opacity-60">
        Browse and select from a variety of pre-built templates to kickstart
        your project.
      </p>
    </div>
  );
}
