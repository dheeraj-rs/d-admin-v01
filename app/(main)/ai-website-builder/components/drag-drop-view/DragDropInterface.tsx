import { useDragDropStore } from '../../../drag-drop-builder/drag-drop-view/lib/drag-drop-store';
import { DragDropSidebarContent } from './DragDropSidebarContent';

export function DragDropInterface() {
  const { isPreview } = useDragDropStore();

  if (isPreview) return null;

  return (
    <div className="h-full w-full overflow-hidden border-r border-[var(--d-admin-surface-border)]">
      <DragDropSidebarContent />
    </div>
  );
}
