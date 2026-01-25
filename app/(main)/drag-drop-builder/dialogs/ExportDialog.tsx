import * as DialogPrimitive from '@radix-ui/react-dialog';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon';
import CodeBracketIcon from '@heroicons/react/24/outline/CodeBracketIcon';
import { classMixin } from '../lib/class-utils';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExportHTML: () => void;
  onExportReact: () => void;
}

export function ExportDialog({
  isOpen,
  onClose,
  onExportHTML,
  onExportReact,
}: ExportDialogProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
        <DialogPrimitive.Content
          className={classMixin(
            'fixed rounded-lg bg-(--d-admin-surface-card) p-6 shadow-lg',
            'w-[95vw] max-w-md md:w-full',
            'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform',
          )}
        >
          <DialogPrimitive.Title className="mb-4 text-lg font-semibold text-(--d-admin-text-color)">
            Choose Export Format
          </DialogPrimitive.Title>

          <div className="space-y-3">
            {/* HTML Option */}
            <button
              onClick={() => {
                onExportHTML();
                onClose();
              }}
              className={classMixin(
                'flex w-full items-center rounded-lg border-2 border-(--d-admin-surface-border) p-4',
                'transition-all hover:border-(--d-admin-blue-600) hover:bg-(--d-admin-blue-50)',
                'group text-left',
              )}
            >
              <DocumentIcon className="mr-4 h-8 w-8 text-(--d-admin-text-color-secondary) group-hover:text-(--d-admin-blue-600)" />
              <div>
                <div className="font-semibold text-(--d-admin-text-color) group-hover:text-(--d-admin-blue-600)">
                  HTML File
                </div>
                <div className="text-sm text-(--d-admin-text-color-secondary)">
                  Export as a standalone HTML file with inline Tailwind CSS
                </div>
              </div>
            </button>

            {/* React Option */}
            <button
              onClick={() => {
                onExportReact();
                onClose();
              }}
              className={classMixin(
                'flex w-full items-center rounded-lg border-2 border-(--d-admin-surface-border) p-4',
                'transition-all hover:border-(--d-admin-primary-600) hover:bg-(--d-admin-surface-d)',
                'group text-left',
              )}
            >
              <CodeBracketIcon className="mr-4 h-8 w-8 text-(--d-admin-text-color-secondary) group-hover:text-(--d-admin-primary-600)" />
              <div>
                <div className="font-semibold text-(--d-admin-text-color) group-hover:text-(--d-admin-primary-600)">
                  React Project (Vite)
                </div>
                <div className="text-sm text-(--d-admin-text-color-secondary)">
                  Export as a complete React + Vite + Tailwind CSS project
                </div>
              </div>
            </button>
          </div>

          <DialogPrimitive.Close
            onClick={() => onClose()}
            className={classMixin(
              'absolute top-4 right-4 inline-flex items-center justify-center rounded-full p-1',
              'hover:bg-(--d-admin-surface-hover)',
            )}
          >
            <XMarkIcon className="h-5 w-5 text-(--d-admin-text-color-secondary) hover:text-(--d-admin-text-color)" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
