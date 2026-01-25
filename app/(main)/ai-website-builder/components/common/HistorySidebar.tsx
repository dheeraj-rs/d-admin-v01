import React from 'react';
import { Icon } from '@iconify/react';
import { useAiBuilderStore } from '../../store/ai-builder-store';

export function HistorySidebar() {
  const { isHistoryOpen, setIsHistoryOpen } = useAiBuilderStore();

  if (!isHistoryOpen) return null;

  return (
    <div className="absolute inset-y-0 left-0 z-50 flex h-full font-sans">
      <div className="animate-in slide-in-from-left flex h-full w-[280px] flex-col border-r border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] shadow-2xl duration-300 ease-in-out">
        <div className="border-b border-[var(--d-admin-surface-border)] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--d-admin-text-color)]">
              <Icon
                icon="ph:clock-counter-clockwise"
                className="size-5 text-[var(--d-admin-text-color-secondary)]"
              />
              History
            </h2>
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="rounded-md p-1.5 text-[var(--d-admin-text-color-secondary)] transition-colors hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]"
            >
              <Icon icon="ph:x" className="size-4" />
            </button>
          </div>
          <div className="relative">
            <Icon
              icon="ph:magnifying-glass"
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--d-admin-text-color-secondary)]"
            />
            <input
              type="text"
              placeholder="Search history..."
              className="w-full rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] py-2 pr-3 pl-9 text-sm text-[var(--d-admin-text-color)] placeholder-[var(--d-admin-text-color-secondary)] transition-colors focus:border-[var(--d-admin-blue-600)] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="px-2 py-3">
            <h3 className="mb-2 text-xs font-semibold tracking-wider text-[var(--d-admin-text-color-secondary)] uppercase">
              Today
            </h3>
            <div className="flex flex-col gap-1">
              <button className="group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all hover:bg-[var(--d-admin-surface-hover)]">
                <span className="rounded-md bg-[var(--d-admin-surface-section)] p-1.5 text-[var(--d-admin-text-color-secondary)] transition-colors group-hover:text-[var(--d-admin-primary-color)]">
                  <Icon icon="ph:chat-circle-text" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--d-admin-text-color)]">
                    Modern E-commerce
                  </div>
                  <div className="truncate text-xs text-[var(--d-admin-text-color-secondary)]">
                    Started 2 hours ago
                  </div>
                </div>
              </button>
              <button className="group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all hover:bg-[var(--d-admin-surface-hover)]">
                <span className="rounded-md bg-[var(--d-admin-surface-section)] p-1.5 text-[var(--d-admin-text-color-secondary)] transition-colors group-hover:text-[var(--d-admin-primary-color)]">
                  <Icon icon="ph:chat-circle-text" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--d-admin-text-color)]">
                    Portfolio Website
                  </div>
                  <div className="truncate text-xs text-[var(--d-admin-text-color-secondary)]">
                    Started 5 hours ago
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="px-2 py-3">
            <h3 className="mb-2 text-xs font-semibold tracking-wider text-[var(--d-admin-text-color-secondary)] uppercase">
              Yesterday
            </h3>
            <div className="flex flex-col gap-1">
              <button className="group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all hover:bg-[var(--d-admin-surface-hover)]">
                <span className="rounded-md bg-[var(--d-admin-surface-section)] p-1.5 text-[var(--d-admin-text-color-secondary)] transition-colors group-hover:text-[var(--d-admin-primary-color)]">
                  <Icon icon="ph:chat-circle-text" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--d-admin-text-color)]">
                    Landing Page Draft
                  </div>
                  <div className="truncate text-xs text-[var(--d-admin-text-color-secondary)]">
                    Edited 1 day ago
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Backdrop */}
      <div
        className="h-full w-[100vw] bg-black/20 transition-opacity duration-300"
        onClick={() => setIsHistoryOpen(false)}
      ></div>
    </div>
  );
}
