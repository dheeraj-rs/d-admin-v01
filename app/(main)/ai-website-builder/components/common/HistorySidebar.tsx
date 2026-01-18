import React from 'react';
import { Icon } from '@iconify/react';
import { useAiBuilderStore } from '../../store/ai-builder-store';

export function HistorySidebar() {
    const { isHistoryOpen, setIsHistoryOpen } = useAiBuilderStore();

    if (!isHistoryOpen) return null;

    return (
        <div className="absolute inset-y-0 left-0 z-50 flex h-full font-sans">
            <div className="flex h-full w-[280px] flex-col bg-[var(--d-admin-surface-ground)] border-r border-[var(--d-admin-surface-border)] shadow-2xl animate-in slide-in-from-left duration-300 ease-in-out">
                <div className="p-4 border-b border-[var(--d-admin-surface-border)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-[var(--d-admin-text-color)] flex items-center gap-2">
                            <Icon icon="ph:clock-counter-clockwise" className="size-5 text-[var(--d-admin-text-color-secondary)]" />
                            History
                        </h2>
                        <button
                            onClick={() => setIsHistoryOpen(false)}
                            className="p-1.5 hover:bg-[var(--d-admin-surface-hover)] rounded-md text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] transition-colors"
                        >
                            <Icon icon="ph:x" className="size-4" />
                        </button>
                    </div>
                    <div className="relative">
                        <Icon icon="ph:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--d-admin-text-color-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search history..."
                            className="w-full bg-[var(--d-admin-surface-section)] text-sm rounded-lg pl-9 pr-3 py-2 border border-[var(--d-admin-surface-border)] focus:outline-none focus:border-[var(--d-admin-blue-600)] transition-colors text-[var(--d-admin-text-color)] placeholder-[var(--d-admin-text-color-secondary)]"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    <div className="px-2 py-3">
                        <h3 className="text-xs font-semibold text-[var(--d-admin-text-color-secondary)] uppercase tracking-wider mb-2">Today</h3>
                        <div className="flex flex-col gap-1">
                            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[var(--d-admin-surface-hover)] text-left group transition-all">
                                <span className="bg-[var(--d-admin-surface-section)] p-1.5 rounded-md text-[var(--d-admin-text-color-secondary)] group-hover:text-[var(--d-admin-primary-color)] transition-colors">
                                    <Icon icon="ph:chat-circle-text" className="size-4" />
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-[var(--d-admin-text-color)] truncate">Modern E-commerce</div>
                                    <div className="text-xs text-[var(--d-admin-text-color-secondary)] truncate">Started 2 hours ago</div>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[var(--d-admin-surface-hover)] text-left group transition-all">
                                <span className="bg-[var(--d-admin-surface-section)] p-1.5 rounded-md text-[var(--d-admin-text-color-secondary)] group-hover:text-[var(--d-admin-primary-color)] transition-colors">
                                    <Icon icon="ph:chat-circle-text" className="size-4" />
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-[var(--d-admin-text-color)] truncate">Portfolio Website</div>
                                    <div className="text-xs text-[var(--d-admin-text-color-secondary)] truncate">Started 5 hours ago</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="px-2 py-3">
                        <h3 className="text-xs font-semibold text-[var(--d-admin-text-color-secondary)] uppercase tracking-wider mb-2">Yesterday</h3>
                        <div className="flex flex-col gap-1">
                            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[var(--d-admin-surface-hover)] text-left group transition-all">
                                <span className="bg-[var(--d-admin-surface-section)] p-1.5 rounded-md text-[var(--d-admin-text-color-secondary)] group-hover:text-[var(--d-admin-primary-color)] transition-colors">
                                    <Icon icon="ph:chat-circle-text" className="size-4" />
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-[var(--d-admin-text-color)] truncate">Landing Page Draft</div>
                                    <div className="text-xs text-[var(--d-admin-text-color-secondary)] truncate">Edited 1 day ago</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Backdrop */}
            <div
                className="w-[100vw] h-full bg-black/20 transition-opacity duration-300"
                onClick={() => setIsHistoryOpen(false)}
            ></div>
        </div>
    );
}
