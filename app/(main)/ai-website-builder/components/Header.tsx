import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useAiBuilderStore } from '../store/ai-builder-store';
import { useIsMobile } from '@/core/hooks/use-mobile';

export function Header() {
    const [activeView, setActiveView] = useState<'code' | 'preview'>('preview');
    const { activeMobilePanel, setActiveMobilePanel } = useAiBuilderStore();
    const isMobile = useIsMobile();

    return (
        <header className="flex shrink-0 select-none items-center pl-2 pr-3 h-[var(--header-height)] w-full">
            <div className="flex justify-between items-center gap-2">
                <button className="flex items-center justify-center font-medium shrink-0 min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-sm px-2 -mr-px" type="button" id="radix-:r2r:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
                    <div className="size-6 flex items-center justify-center shrink-0 bg-[var(--d-admin-surface-section)] text-[var(--d-admin-text-color-secondary)] border overflow-hidden rounded-full border-[var(--d-admin-surface-border)]">
                        <img className="w-full h-full object-cover" src="https://stackblitz.com/avatars/D/194.svg" alt="" />
                    </div>
                </button>
                <span className="text-[var(--d-admin-text-color)] opacity-[.12] text-xl antialiased mx-1">/</span>
                <button className="flex items-center justify-center font-medium max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-sm px-2.5 transition-all duration-300 group shrink min-w-0" type="button" id="radix-:r2u:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
                    <span className="mt-px truncate sm:max-w-80">New Project Request</span>
                    <Icon icon="heroicons:lock-closed" className="shrink-0 ml-0.5" />
                    <Icon icon="lucide:chevron-down" className="size-4 opacity-0 transition-opacity duration-200 ml-1 -mr-1 shrink-0 group-hover:opacity-60" />
                </button>
            </div>

            <div className="flex-1 pointer-events-auto  w-[var(--workbench-inner-width)]">
                <div className="flex relative items-center gap-2 py-2 min-h-[var(--panel-header-height)] pl-0">
                    {/* Mobile Panel Switcher */}
                    {isMobile && (
                        <div className="flex items-center gap-2 mr-2">
                            <div className="flex items-center flex-wrap shrink-0 overflow-hidden rounded-xl p-1 border border-[var(--d-admin-surface-border)]">
                                <button
                                    onClick={() => setActiveMobilePanel('chat')}
                                    className={`bg-transparent text-sm px-3 py-1 rounded-full relative ${activeMobilePanel === 'chat' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                                >
                                    <span className="relative z-10 flex items-center font-medium">
                                        <Icon icon="lucide:message-square" className="size-4" />
                                    </span>
                                    {activeMobilePanel === 'chat' && <span className="absolute inset-0 z-0 bg-[var(--d-admin-surface-hover)] rounded-lg" style={{ opacity: 1 }}></span>}
                                </button>
                                <button
                                    onClick={() => setActiveMobilePanel('workbench')}
                                    className={`bg-transparent text-sm px-3 py-1 rounded-full relative ${activeMobilePanel === 'workbench' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                                >
                                    <span className="relative z-10 flex items-center font-medium">
                                        <Icon icon="lucide:layout-template" className="size-4" />
                                    </span>
                                    {activeMobilePanel === 'workbench' && <span className="absolute inset-0 z-0 bg-[var(--d-admin-surface-hover)] rounded-lg" style={{ opacity: 1 }}></span>}
                                </button>
                            </div>
                        </div>
                    )}


                    <div className="ml-auto flex items-center gap-2">
                        {(!isMobile || activeMobilePanel === 'workbench') && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center flex-wrap shrink-0 overflow-hidden rounded-xl p-1 border border-[var(--d-admin-surface-border)]">
                                    <div className="flex items-center">
                                        <button
                                            aria-label="Preview"
                                            aria-pressed={activeView === 'preview'}
                                            onClick={() => setActiveView('preview')}
                                            className={`bg-transparent text-sm px-2 py-1 rounded-full relative ${activeView === 'preview' ? 'text-[var(--d-admin-primary-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                                            data-state="closed"
                                        >
                                            <Icon icon="lucide:eye" className="size-4 block" />
                                            {/* {activeView === 'preview' && <span className="absolute inset-0 z-0 bg-[var(--d-admin-surface-overlay)] rounded-lg" style={{ opacity: 1 }}></span>} */}
                                        </button>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            aria-label="Code"
                                            aria-pressed={activeView === 'code'}
                                            onClick={() => setActiveView('code')}
                                            className={`bg-transparent text-sm px-2 py-1 rounded-full relative ${activeView === 'code' ? 'text-[var(--d-admin-primary-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                                            data-state="closed"
                                        >
                                            <Icon icon="lucide:code" className="size-4 block" />
                                            {/* {activeView === 'code' && <span className="absolute inset-0 z-0 bg-[var(--d-admin-surface-overlay)] rounded-lg" style={{ opacity: 1 }}></span>} */}
                                        </button>
                                        <div className="w-px h-5 bg-[var(--d-admin-surface-border)] mx-1 opacity-60"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <button aria-label="Database" aria-pressed="false" className="bg-transparent text-sm px-2 py-1 rounded-full relative text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]" data-state="closed">
                                            <Icon icon="heroicons:circle-stack" className="size-4 block" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button type="button" id="radix-:r4g:" aria-haspopup="menu" aria-expanded="false" data-state="closed" className="bg-transparent p-0" aria-label="More Options">
                                        <div className="flex items-center bg-transparent text-sm px-2 py-1 rounded-full relative text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] pl-1 pr-1.5 h-5 opacity-90 hover:opacity-100" data-state="closed">
                                            <Icon icon="ph:gear-six-duotone" className="w-4 h-4" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button className="items-center justify-center font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-text-color)] text-[var(--d-admin-surface-ground)] flex gap-1.7 shrink-0 h-8 text-sm px-3" type="button" aria-controls="publish-menu" id="radix-:r42:" aria-haspopup="menu" aria-expanded="false" data-state="closed">Publish</button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
