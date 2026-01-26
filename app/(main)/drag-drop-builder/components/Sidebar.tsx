import { useState, useEffect } from 'react';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';

import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
import {
  useBuilderStore,
  THEMES,
} from '../store/builder-store';
import { Category } from './Category';
import { Select } from './Select';
import { LayersPanel } from './LayersPanel';

export function Sidebar() {
  const {
    themeIndex,
    components,
    setThemeIndex,
    loadThemeComponents,
    setPendingAddComponent,
    sidebarView,
    setSidebarView,
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
      <div className="shrink-0 border-b border-[var(--d-admin-surface-border)] pb-2 md:pb-0 mb-2">
        <div className="flex items-center gap-2 pb-0 md:p-2">
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
            onClick={() => setSidebarView(sidebarView === 'components' ? 'layers' : 'components')}
            className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md border transition-colors ${
              sidebarView === 'layers'
                ? 'border-[var(--d-admin-primary-color)] bg-[var(--d-admin-primary-color)] text-white'
                : 'border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]'
            }`}
             title={sidebarView === 'components' ? "Reorder Components" : "Back to Components"}
          >
           {sidebarView === 'components' ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={1.5} 
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 6l4-4 4 4M8 18l4 4 4-4M4 12h16M4 9h16M4 15h16" />
              </svg>
            ) : (
              <Squares2X2Icon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Component List or Layers Panel */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        {sidebarView === 'components' ? (
          Object.keys(components).map((c, i) => (
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
          ))
        ) : (
          <LayersPanel />
        )}
      </div>
    </div>
  );
}

