import { memo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IconButton } from '../ui/IconButton';
import { Icon } from '@iconify/react';
import type { PreviewInfo } from '../../lib/stores/previews';

interface PortDropdownProps {
  activePreviewIndex: number;
  setActivePreviewIndex: (index: number) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
  setHasSelectedPreview: (value: boolean) => void;
  previews: PreviewInfo[];
}

export const PortDropdown = memo(
  ({
    activePreviewIndex,
    setActivePreviewIndex,
    isDropdownOpen,
    setIsDropdownOpen,
    setHasSelectedPreview,
    previews,
  }: PortDropdownProps) => {


    // sort previews, preserving original index
    const sortedPreviews = previews
      .map((previewInfo, index) => ({ ...previewInfo, index }))
      .sort((a, b) => a.port - b.port);

    return (
      <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-transparent hover:text-gray-700 dark:hover:text-gray-200 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 outline-none disabled:cursor-not-allowed disabled:opacity-30"
            onClick={(e) => {
              // Trigger automatically handles click, but we want to toggle.
              // Controlled state handling needs care. Radix Trigger toggles automatically.
            }}
          >
            <Icon icon="ph:plug" className="text-xl" />
            <span className="text-sm font-medium text-text">
              {previews[activePreviewIndex]?.port}
            </span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-[9999] min-w-[140px] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] rounded shadow-sm overflow-hidden p-1 data-[side=top]:animate-slide-up-fade data-[side=right]:animate-slide-right-fade data-[side=bottom]:animate-slide-down-fade data-[side=left]:animate-slide-left-fade"
            align="end"
            sideOffset={5}
          >
            <div className="px-2 py-1.5 text-xs font-semibold text-[var(--d-admin-text-color)] border-b border-[var(--d-admin-surface-border)] mb-1">
              Ports
            </div>
            {sortedPreviews.map((preview) => (
              <DropdownMenu.Item
                key={preview.port}
                className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded outline-none text-[var(--d-admin-text-color)] data-[highlighted]:bg-[var(--d-admin-surface-hover)]"
                onSelect={() => {
                  setActivePreviewIndex(preview.index);
                  setHasSelectedPreview(true);
                  setIsDropdownOpen(false);
                }}
              >
                <span
                  className={
                    activePreviewIndex === preview.index
                      ? 'text-[var(--d-admin-primary-color)]'
                      : 'text-[var(--d-admin-text-color-secondary)]'
                  }
                >
                  {preview.port}
                </span>
                {activePreviewIndex === preview.index && (
                  <Icon icon="ph:check" className="ml-auto text-[var(--d-admin-primary-color)]" />
                )}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  },
);
