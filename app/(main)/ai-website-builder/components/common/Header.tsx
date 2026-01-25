import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useAiBuilderStore } from '../../store/ai-builder-store';
import { useIsMobile } from '@/core/hooks/use-mobile';

export function Header() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'code' | 'preview'>('preview');
  const {
    activeMobilePanel,
    setActiveMobilePanel,
    isHistoryOpen,
    setIsHistoryOpen,
    builderView,
    setBuilderView,
  } = useAiBuilderStore();
  const [isBuilderMenuOpen, setIsBuilderMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const getBuilderLabel = (view: typeof builderView) => {
    switch (view) {
      case 'chat':
        return 'AI Chat';
      case 'drag-drop':
        return 'Drag & Drop Snippet';
      case 'templates':
        return 'Templates';
      default:
        return 'AI Chat';
    }
  };

  const getBuilderIcon = (view: typeof builderView) => {
    switch (view) {
      case 'chat':
        return 'lucide:sparkles';
      case 'drag-drop':
        return 'lucide:hand';
      case 'templates':
        return 'lucide:layout-template';
      default:
        return 'lucide:sparkles';
    }
  };

  return (
    <header className="flex h-[var(--header-height)] w-full shrink-0 items-center pr-3 pl-2 select-none">
      <div className="flex w-full max-w-[40%] items-center gap-2">
        <button
          onClick={() => router.back()}
          className="disabled:op-50 relative -mr-px flex h-9 max-w-full min-w-0 shrink-0 items-center justify-center gap-1 rounded-md bg-transparent px-2 text-sm font-medium text-[var(--d-admin-text-color)] focus-visible:outline-2 focus-visible:outline-[var(--d-admin-blue-600)] enabled:hover:bg-[var(--d-admin-surface-hover)] disabled:cursor-not-allowed"
          type="button"
        >
          <Icon icon="ph:caret-left" className="size-5" />
        </button>
        <button
          className={`disabled:op-50 relative -mr-px flex h-9 max-w-full min-w-0 shrink-0 items-center justify-center gap-1 rounded-md bg-transparent px-2 text-sm font-medium text-[var(--d-admin-text-color)] focus-visible:outline-2 focus-visible:outline-[var(--d-admin-blue-600)] enabled:hover:bg-[var(--d-admin-surface-hover)] disabled:cursor-not-allowed ${isHistoryOpen ? 'bg-[var(--d-admin-surface-hover)]' : ''}`}
          type="button"
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
        >
          <Icon icon="ph:clock-counter-clockwise" className="size-5" />
        </button>
        <span className="mx-1 text-xl text-[var(--d-admin-text-color)] antialiased opacity-[.12]">
          /
        </span>
        <button
          className="disabled:op-50 relative -mr-px flex h-9 max-w-full items-center justify-center gap-1 rounded-md bg-transparent px-2 text-sm font-medium text-[var(--d-admin-text-color)] focus-visible:outline-2 focus-visible:outline-[var(--d-admin-blue-600)] enabled:hover:bg-[var(--d-admin-surface-hover)] disabled:cursor-not-allowed"
          type="button"
        >
          <span className="truncate sm:max-w-80">New Project</span>
        </button>
        <div className="relative ml-2">
          <button
            className="group flex h-8 max-w-full min-w-0 shrink items-center justify-center gap-1.5 rounded-md bg-transparent px-2.5 text-xs font-medium text-[var(--d-admin-text-color)] transition-all duration-300 hover:bg-[var(--d-admin-surface-hover)]"
            type="button"
            onClick={() => setIsBuilderMenuOpen(!isBuilderMenuOpen)}
          >
            <Icon
              icon={getBuilderIcon(builderView)}
              className="size-3.5 text-[var(--d-admin-text-color-secondary)] transition-colors group-hover:text-[var(--d-admin-primary-color)]"
            />
            <span className="mt-px truncate sm:max-w-80">
              {getBuilderLabel(builderView)}
            </span>
            <Icon
              icon="lucide:chevron-down"
              className={`ml-0.5 size-3 opacity-60 transition-transform duration-200 ${isBuilderMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isBuilderMenuOpen && (
            <div className="animate-in fade-in zoom-in-95 absolute top-full left-0 z-50 mt-1 flex w-56 flex-col overflow-hidden rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] p-1 shadow-xl duration-100">
              <button
                onClick={() => {
                  setBuilderView('chat');
                  setIsBuilderMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${builderView === 'chat' ? 'bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]'}`}
              >
                <Icon icon="lucide:sparkles" className="size-3.5" />
                <span>AI Chat</span>
                {builderView === 'chat' && (
                  <Icon icon="ph:check" className="ml-auto size-3" />
                )}
              </button>
              <button
                onClick={() => {
                  setBuilderView('drag-drop');
                  setIsBuilderMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${builderView === 'drag-drop' ? 'bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]'}`}
              >
                <Icon icon="lucide:hand" className="size-3.5" />
                <span>Drag & Drop Snippet</span>
                {builderView === 'drag-drop' && (
                  <Icon icon="ph:check" className="ml-auto size-3" />
                )}
              </button>
              <button
                onClick={() => {
                  setBuilderView('templates');
                  setIsBuilderMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${builderView === 'templates' ? 'bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]'}`}
              >
                <Icon icon="lucide:layout-template" className="size-3.5" />
                <span>Templates</span>
                {builderView === 'templates' && (
                  <Icon icon="ph:check" className="ml-auto size-3" />
                )}
              </button>
            </div>
          )}
          {isBuilderMenuOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsBuilderMenuOpen(false)}
            ></div>
          )}
        </div>
      </div>

      <div className="pointer-events-auto flex w-full items-center">
        <div className="relative flex min-h-[var(--panel-header-height)] w-full items-center justify-between gap-2 py-2 pl-0">
          {/* Mobile Panel Switcher */}
          {isMobile && (
            <div className="mr-2 flex items-center gap-2">
              <div className="flex shrink-0 flex-wrap items-center overflow-hidden rounded-xl border border-[var(--d-admin-surface-border)] p-1">
                <button
                  onClick={() => setActiveMobilePanel('chat')}
                  className={`relative rounded-full bg-transparent px-3 py-1 text-sm ${activeMobilePanel === 'chat' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                >
                  <span className="relative z-10 flex items-center font-medium">
                    <Icon icon="lucide:message-square" className="size-4" />
                  </span>
                  {activeMobilePanel === 'chat' && (
                    <span
                      className="absolute inset-0 z-0 rounded-lg bg-[var(--d-admin-surface-hover)]"
                      style={{ opacity: 1 }}
                    ></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveMobilePanel('workbench')}
                  className={`relative rounded-full bg-transparent px-3 py-1 text-sm ${activeMobilePanel === 'workbench' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                >
                  <span className="relative z-10 flex items-center font-medium">
                    <Icon icon="lucide:layout-template" className="size-4" />
                  </span>
                  {activeMobilePanel === 'workbench' && (
                    <span
                      className="absolute inset-0 z-0 rounded-lg bg-[var(--d-admin-surface-hover)]"
                      style={{ opacity: 1 }}
                    ></span>
                  )}
                </button>
              </div>
            </div>
          )}

          {(!isMobile || activeMobilePanel === 'workbench') && (
            <div className="flex items-center gap-2">
              <div className="flex shrink-0 flex-wrap items-center overflow-hidden rounded-xl border border-[var(--d-admin-surface-border)] p-1">
                <div className="flex items-center">
                  <button
                    aria-label="Preview"
                    aria-pressed={activeView === 'preview'}
                    onClick={() => setActiveView('preview')}
                    className={`relative rounded-full bg-transparent px-2 py-1 text-sm ${activeView === 'preview' ? 'text-[var(--d-admin-primary-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                    data-state="closed"
                  >
                    <Icon icon="lucide:eye" className="block size-4" />
                    {/* {activeView === 'preview' && <span className="absolute inset-0 z-0 bg-[var(--d-admin-surface-overlay)] rounded-lg" style={{ opacity: 1 }}></span>} */}
                  </button>
                </div>
                <div className="flex items-center">
                  <button
                    aria-label="Code"
                    aria-pressed={activeView === 'code'}
                    onClick={() => setActiveView('code')}
                    className={`relative rounded-full bg-transparent px-2 py-1 text-sm ${activeView === 'code' ? 'text-[var(--d-admin-primary-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                    data-state="closed"
                  >
                    <Icon icon="lucide:code" className="block size-4" />
                    {/* {activeView === 'code' && <span className="absolute inset-0 z-0 bg-[var(--d-admin-surface-overlay)] rounded-lg" style={{ opacity: 1 }}></span>} */}
                  </button>
                  {/* <div className="w-px h-5 bg-[var(--d-admin-surface-border)] mx-1 opacity-60"></div> */}
                </div>
                {/* <div className="flex items-center">
                                    <button aria-label="Database" aria-pressed="false" className="bg-transparent text-sm px-2 py-1 rounded-full relative text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]" data-state="closed">
                                        <Icon icon="heroicons:circle-stack" className="size-4 block" />
                                    </button>
                                </div> */}
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  id="radix-:r4g:"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  data-state="closed"
                  className="bg-transparent p-0"
                  aria-label="More Options"
                >
                  <div
                    className="relative flex h-5 items-center rounded-full bg-transparent px-2 py-1 pr-1.5 pl-1 text-sm text-[var(--d-admin-text-color-secondary)] opacity-90 hover:text-[var(--d-admin-text-color)] hover:opacity-100"
                    data-state="closed"
                  >
                    <Icon icon="ph:gear-six-duotone" className="h-4 w-4" />
                  </div>
                </button>
              </div>
            </div>
          )}
          <div className="ml-auto flex gap-3">
            <button
              className="disabled:op-50 gap-1.7 relative flex h-8 max-w-full min-w-0 shrink-0 items-center justify-center rounded-md bg-[var(--d-admin-text-color)] px-3 text-sm font-medium text-[var(--d-admin-surface-ground)] focus-visible:outline-2 focus-visible:outline-[var(--d-admin-blue-600)] disabled:cursor-not-allowed"
              type="button"
              aria-controls="publish-menu"
              id="radix-:r42:"
              aria-haspopup="menu"
              aria-expanded="false"
              data-state="closed"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
