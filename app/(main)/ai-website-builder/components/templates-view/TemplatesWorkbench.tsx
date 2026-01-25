import { Icon } from '@iconify/react';

export function TemplatesWorkbench() {
  return (
    <div className="m-2 mr-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-tl-xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)]/5 text-[var(--d-admin-text-color)]">
      <div className="flex flex-col items-center opacity-40">
        <Icon icon="lucide:presentation" className="mb-6 size-16" />
        <h2 className="mb-2 text-2xl font-semibold">Template Preview</h2>
        <p className="max-w-md text-center text-base">
          Select a template from the sidebar to preview it here.
        </p>
      </div>
    </div>
  );
}
