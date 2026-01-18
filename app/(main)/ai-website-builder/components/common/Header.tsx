import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useAiBuilderStore } from '../../store/ai-builder-store';
import { useIsMobile } from '@/core/hooks/use-mobile';

export function Header() {
    const router = useRouter();
    const [activeView, setActiveView] = useState<'code' | 'preview'>('preview');
    const { activeMobilePanel, setActiveMobilePanel, isHistoryOpen, setIsHistoryOpen, builderView, setBuilderView } = useAiBuilderStore();
    const [isBuilderMenuOpen, setIsBuilderMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    const getBuilderLabel = (view: typeof builderView) => {
        switch (view) {
            case 'chat': return 'AI Chat';
            case 'drag-drop': return 'Drag & Drop Snippet';
            case 'templates': return 'Templates';
            default: return 'AI Chat';
        }
    };

    const getBuilderIcon = (view: typeof builderView) => {
        switch (view) {
            case 'chat': return 'lucide:sparkles';
            case 'drag-drop': return 'lucide:hand';
            case 'templates': return 'lucide:layout-template';
            default: return 'lucide:sparkles';
        }
    };

    return (
        <header className="flex shrink-0 select-none items-center pl-2 pr-3 h-[var(--header-height)] w-full">
            <div className="flex items-center gap-2 w-full max-w-[40%]">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center font-medium shrink-0 min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-sm px-2 -mr-px"
                    type="button"
                >
                    <Icon icon="ph:caret-left" className="size-5" />
                </button>
                <button
                    className={`flex items-center justify-center font-medium shrink-0 min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-sm px-2 -mr-px ${isHistoryOpen ? 'bg-[var(--d-admin-surface-hover)]' : ''}`}
                    type="button"
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                >
                    <Icon icon="ph:clock-counter-clockwise" className="size-5" />
                </button>
                <span className="text-[var(--d-admin-text-color)] opacity-[.12] text-xl antialiased mx-1">/</span>
                <button className="flex items-center justify-center font-medium max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-sm px-2 -mr-px" type="button">
                    <span className="truncate sm:max-w-80">New Project</span>
                </button>
                <div className="relative ml-2">
                    <button
                        className="flex items-center justify-center font-medium max-w-full rounded-md gap-1.5 h-8 bg-transparent text-[var(--d-admin-text-color)] text-xs px-2.5 transition-all duration-300 group shrink min-w-0 hover:bg-[var(--d-admin-surface-hover)]"
                        type="button"
                        onClick={() => setIsBuilderMenuOpen(!isBuilderMenuOpen)}
                    >
                        <Icon icon={getBuilderIcon(builderView)} className="size-3.5 text-[var(--d-admin-text-color-secondary)] group-hover:text-[var(--d-admin-primary-color)] transition-colors" />
                        <span className="mt-px truncate sm:max-w-80">{getBuilderLabel(builderView)}</span>
                        <Icon icon="lucide:chevron-down" className={`size-3 ml-0.5 opacity-60 transition-transform duration-200 ${isBuilderMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isBuilderMenuOpen && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col p-1">
                            <button
                                onClick={() => { setBuilderView('chat'); setIsBuilderMenuOpen(false); }}
                                className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded-md w-full text-left transition-colors ${builderView === 'chat' ? 'bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)]'}`}
                            >
                                <Icon icon="lucide:sparkles" className="size-3.5" />
                                <span>AI Chat</span>
                                {builderView === 'chat' && <Icon icon="ph:check" className="ml-auto size-3" />}
                            </button>
                            <button
                                onClick={() => { setBuilderView('drag-drop'); setIsBuilderMenuOpen(false); }}
                                className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded-md w-full text-left transition-colors ${builderView === 'drag-drop' ? 'bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)]'}`}
                            >
                                <Icon icon="lucide:hand" className="size-3.5" />
                                <span>Drag & Drop Snippet</span>
                                {builderView === 'drag-drop' && <Icon icon="ph:check" className="ml-auto size-3" />}
                            </button>
                            <button
                                onClick={() => { setBuilderView('templates'); setIsBuilderMenuOpen(false); }}
                                className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded-md w-full text-left transition-colors ${builderView === 'templates' ? 'bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)]'}`}
                            >
                                <Icon icon="lucide:layout-template" className="size-3.5" />
                                <span>Templates</span>
                                {builderView === 'templates' && <Icon icon="ph:check" className="ml-auto size-3" />}
                            </button>
                        </div>
                    )}
                    {isBuilderMenuOpen && (
                        <div className="fixed inset-0 z-40" onClick={() => setIsBuilderMenuOpen(false)}></div>
                    )}
                </div>

            </div>

            <div className="flex items-center pointer-events-auto w-full ">
                <div className="flex relative justify-between w-full items-center gap-2 py-2 min-h-[var(--panel-header-height)] pl-0">
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


                    {(!isMobile || activeMobilePanel === 'workbench') && (
                        <div className=" flex items-center gap-2">
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
                                    {/* <div className="w-px h-5 bg-[var(--d-admin-surface-border)] mx-1 opacity-60"></div> */}
                                </div>
                                {/* <div className="flex items-center">
                                    <button aria-label="Database" aria-pressed="false" className="bg-transparent text-sm px-2 py-1 rounded-full relative text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]" data-state="closed">
                                        <Icon icon="heroicons:circle-stack" className="size-4 block" />
                                    </button>
                                </div> */}
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
                    <div className="ml-auto flex gap-3">
                        <button className="items-center justify-center font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-text-color)] text-[var(--d-admin-surface-ground)] flex gap-1.7 shrink-0 h-8 text-sm px-3" type="button" aria-controls="publish-menu" id="radix-:r42:" aria-haspopup="menu" aria-expanded="false" data-state="closed">Publish</button>
                    </div>
                </div>
            </div>
        </header>
    );
}
