import { useDragDropStore } from '../../drag-drop-view/lib/drag-drop-store';
import { DragDropSidebarContent } from './DragDropSidebarContent';

export function DragDropInterface() {
    const { isPreview } = useDragDropStore();

    if (isPreview) return null;

    return (
        <div className="h-full w-full border-r border-[var(--d-admin-surface-border)] overflow-hidden">
            <DragDropSidebarContent />
        </div>
    );
}
