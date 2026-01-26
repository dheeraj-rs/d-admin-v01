import { useState, useEffect } from 'react';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import Bars3BottomLeftIcon from '@heroicons/react/24/outline/Bars3BottomLeftIcon';
import {
  useBuilderStore,
  THEMES,
} from '../store/builder-store';
import { Category } from './Category';
import { Select } from './Select';

export function Sidebar() {
  const {
    themeIndex,
    components,
    setThemeIndex,
    loadThemeComponents,
    setPendingAddComponent,
    setShowReorderModal,
  } = useBuilderStore();

  const [selectOpen, setSelectOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Initial load
  useEffect(() => {
    loadThemeComponents(themeIndex);
  }, [themeIndex, loadThemeComponents]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[var(--d-admin-surface-ground)] text-[var(--d-admin-text-color)]">
      {/* Header / Theme Selector */}
      <div className="shrink-0 border-b border-[var(--d-admin-surface-border)] pb-2 lg:p-4 mb-2">
        <div className="flex items-center gap-2">
          <Select
            trigger={
              <div className="flex w-full cursor-pointer items-center justify-between rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] px-3 py-2 text-sm shadow-sm transition-colors hover:bg-[var(--d-admin-surface-hover)] md:w-full">
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
          <button
            onClick={() => setShowReorderModal(true)}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]"
            title="Reorder Components"
          >
            <Bars3BottomLeftIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Component List */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        {Object.keys(components).map((c, i) => (
          <Category
            key={i}
            category={c}
            themeIndex={themeIndex}
            components={components[c]}
            standaloneServer={false}
            onComponentClick={(component, index) =>
              setPendingAddComponent({ component, category: c, index })
            }
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          />
        ))}
      </div>
    </div>
  );
}
