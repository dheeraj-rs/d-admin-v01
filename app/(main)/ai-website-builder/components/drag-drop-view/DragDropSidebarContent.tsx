import { useState, useEffect } from 'react';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import { useDragDropStore, THEMES } from '../../../drag-drop-builder/drag-drop-view/lib/drag-drop-store';
import { Category } from '../../../drag-drop-builder/drag-drop-view/components/Category';
import { Select } from '../../../drag-drop-builder/drag-drop-view/components/Select';

export function DragDropSidebarContent() {
    const {
        themeIndex,
        components,
        setThemeIndex,
        loadThemeComponents,
        setPendingAddComponent,
    } = useDragDropStore();

    const [selectOpen, setSelectOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Initial load
    useEffect(() => {
        loadThemeComponents(themeIndex);
    }, [themeIndex, loadThemeComponents]);

    return (
        <div className="flex flex-col h-full w-full bg-[var(--d-admin-surface-ground)] text-[var(--d-admin-text-color)] overflow-hidden">
            {/* Header / Theme Selector */}
            <div className="p-4 border-b border-[var(--d-admin-surface-border)] shrink-0">
                <div className="flex items-center gap-2">
                    <Select
                        trigger={
                            <div className="flex w-full items-center justify-between rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] px-3 py-2 text-sm shadow-sm md:w-full cursor-pointer hover:bg-[var(--d-admin-surface-hover)] transition-colors">
                                <span>{THEMES[themeIndex].name}</span>
                                <ChevronDownIcon className="h-4 w-4 opacity-50" />
                            </div>
                        }
                        defaultValue={THEMES[themeIndex].name}
                        values={THEMES.map((c) => c.name)}
                        open={selectOpen}
                        setOpen={setSelectOpen}
                        onChange={(e) => {
                            const index = THEMES.findIndex((r) => r.name === e);
                            loadThemeComponents(index).then(() => setThemeIndex(index));
                        }}
                    />
                </div>
            </div>

            {/* Component List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {Object.keys(components).map((c, i) => (
                    <Category
                        key={i}
                        category={c}
                        themeIndex={themeIndex}
                        components={components[c]}
                        standaloneServer={false}
                        onComponentClick={(component) => setPendingAddComponent(component)}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={() => setIsDragging(false)}
                    />
                ))}
            </div>
        </div>
    );
}
