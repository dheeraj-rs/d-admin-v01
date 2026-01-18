import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useIsMobile } from '@/core/hooks/use-mobile';
import Link from 'next/link';
import { useAiBuilderStore } from '../store/ai-builder-store';
// ==================================
import { PortDropdown } from './components/workbench/PortDropdown';
import { exportProjectAsZip } from './utils/zip';
import { useChatStore, useWorkbenchStore, usePreviewStore, useFilesStore } from './lib/stores/zustand';

export function Header() {
    const router = useRouter();
    const activeView = useWorkbenchStore(state => state.currentView);
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

    // =======================

    const showWorkbench = useWorkbenchStore(state => state.showWorkbench);
    const showChat = useChatStore(state => state.showChat);
    const previews = usePreviewStore(state => state.previews);
    const activePreviewIndex = usePreviewStore(state => state.activePreviewIndex);
    const url = usePreviewStore(state => state.url);
    const activePreview = previews[activePreviewIndex];

    const chatStarted = useChatStore(state => state.started);
    const chatDescription = useChatStore(state => state.description);
    const showHistory = useChatStore(state => state.showHistory);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (activePreview) {
            usePreviewStore.getState().setUrl(activePreview.baseUrl);
            usePreviewStore.getState().setIframeUrl(activePreview.baseUrl);
        }
    }, [activePreview]);

    const canHideChat = showWorkbench || !showChat;

    const validateUrl = useCallback(
        (value: string) => {
            if (!activePreview) {
                return false;
            }

            const { baseUrl } = activePreview;

            if (value === baseUrl) {
                return true;
            } else if (value.startsWith(baseUrl)) {
                return ['/', '?', '#'].includes(value.charAt(baseUrl.length));
            }

            return false;
        },
        [activePreview],
    );

    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

    return (
        <header className="flex shrink-0 select-none items-center pl-2 pr-3 h-[var(--header-height)] w-full">
            <div className="flex items-center gap-2 flex-1 min-w-0">
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
                    onClick={() => { setIsHistoryOpen(!isHistoryOpen); useChatStore.getState().setShowHistory(!showHistory); }}
                >
                    <Icon icon="ph:clock-counter-clockwise" className="size-5" />
                </button>
                <span className="text-[var(--d-admin-text-color)] opacity-[.12] text-xl antialiased mx-1">/</span>
                <button className={`flex items-center justify-center font-medium min-w-0 rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-sm px-2 -mr-px ${isMobile && activeMobilePanel === 'workbench' ? 'hidden' : 'flex'}`} type="button">
                    <span className="truncate max-w-[100px] md:max-w-md lg:max-w-lg">{chatStarted ? (
                        <span className="flex-1 truncate text-center text-primary">
                            {chatDescription}
                        </span>
                    ) : 'New Project'}</span>
                </button>
                <div className="relative ml-2 shrink-0">
                    <button
                        className="flex items-center justify-center font-medium max-w-full rounded-md gap-1.5 h-8 bg-transparent text-[var(--d-admin-text-color)] text-xs px-2.5 transition-all duration-300 group shrink min-w-0 hover:bg-[var(--d-admin-surface-hover)]"
                        type="button"
                        onClick={() => setIsBuilderMenuOpen(!isBuilderMenuOpen)}
                    >
                        <Icon icon={getBuilderIcon(builderView)} className="size-3.5 text-[var(--d-admin-text-color-secondary)] group-hover:text-[var(--d-admin-primary-color)] transition-colors" />
                        <span className="mt-px truncate hidden sm:block max-w-[80px] md:max-w-xs">{getBuilderLabel(builderView)}</span>
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

            <div className="flex items-center pointer-events-auto shrink-0 ml-auto gap-2">
                <div className="flex relative justify-end w-full items-center gap-2 py-2 min-h-[var(--panel-header-height)] pl-0">
                    {/* Mobile Panel Switcher */}
                    {isMobile && (
                        <div className="flex items-center gap-2 mr-0">
                            <div className="flex items-center flex-wrap shrink-0 overflow-hidden rounded-xl p-1 border border-[var(--d-admin-surface-border)]">
                                <button
                                    onClick={() => setActiveMobilePanel('chat')}
                                    className={`bg-transparent text-sm px-2.5 py-1 rounded-full relative ${activeMobilePanel === 'chat' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                                >
                                    <span className="relative z-10 flex items-center font-medium">
                                        <Icon icon="lucide:message-square" className="size-4" />
                                    </span>
                                    {activeMobilePanel === 'chat' && <span className="absolute inset-0 z-0 bg-[var(--d-admin-surface-hover)] rounded-lg" style={{ opacity: 1 }}></span>}
                                </button>
                                <button
                                    onClick={() => setActiveMobilePanel('workbench')}
                                    className={`bg-transparent text-sm px-2.5 py-1 rounded-full relative ${activeMobilePanel === 'workbench' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
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
                                        onClick={() => useWorkbenchStore.getState().setCurrentView('preview')}
                                        className={`bg-transparent text-sm px-2 py-1 rounded-full relative ${activeView === 'preview' ? 'text-[var(--d-admin-primary-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                                        data-state="closed"
                                    >
                                        <Icon icon="lucide:eye" className="size-4 block" />
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        aria-label="Code"
                                        aria-pressed={activeView === 'code'}
                                        onClick={() => useWorkbenchStore.getState().setCurrentView('code')}
                                        className={`bg-transparent text-sm px-2 py-1 rounded-full relative ${activeView === 'code' ? 'text-[var(--d-admin-primary-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                                        data-state="closed"
                                    >
                                        <Icon icon="lucide:code" className="size-4 block" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button type="button" id="radix-:r4g:" aria-haspopup="menu" aria-expanded="false" data-state="closed" className="bg-transparent p-0" aria-label="More Options">
                                    <div className="flex items-center bg-transparent text-sm px-2 py-1 rounded-full relative text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] pl-1 pr-1.5 h-5 opacity-90 hover:opacity-100" data-state="closed">
                                        <Icon icon="ph:gear-six-duotone" className="w-4 h-4" />
                                    </div>
                                </button>
                                <div className="builder-topbar-center hidden md:block flex-1 max-w-2xl mx-auto">
                                    <div className="relative flex items-center w-full bg-surface-c rounded-lg border border-surface px-3 py-2">
                                        {activePreview && (
                                            <div className="mr-2">
                                                <PortDropdown
                                                    activePreviewIndex={activePreviewIndex}
                                                    setActivePreviewIndex={(index) => usePreviewStore.getState().setActivePreviewIndex(index)}
                                                    isDropdownOpen={isDropdownOpen}
                                                    setIsDropdownOpen={setIsDropdownOpen}
                                                    setHasSelectedPreview={() => { }}
                                                    previews={previews}
                                                />
                                            </div>
                                        )}
                                        {!activePreview && <Icon icon="ph:lock-key-duotone" className="text-gray-400 mr-2" />}
                                        <input
                                            className="w-full bg-transparent outline-none text-sm text-color md:block hidden"
                                            type="text"
                                            value={url}
                                            onChange={(e) => usePreviewStore.getState().setUrl(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    if (validateUrl(url)) {
                                                        usePreviewStore.getState().setIframeUrl(url);
                                                    } else {
                                                        usePreviewStore.getState().setIframeUrl(url);
                                                    }
                                                }
                                            }}
                                        />
                                        <div className="flex items-center gap-1 ml-2">
                                            <button
                                                className="p-1 hover:bg-surface-d rounded-md text-gray-400 hover:text-color transition-colors"
                                                onClick={() => {
                                                    usePreviewStore.getState().setIframeUrl(url);
                                                    usePreviewStore.getState().refreshPreview();
                                                }}
                                            >
                                                <Icon icon="ph:arrow-clockwise" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Desktop Actions */}
                    <div className="ml-auto hidden md:flex gap-3">
                        <button className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-text-color)] text-[var(--d-admin-surface-ground)] flex gap-1.7 shrink-0 h-8 text-sm px-3" type="button" onClick={() => {
                            const files = useFilesStore.getState().files;
                            exportProjectAsZip(files);
                        }}
                            title="Export as ZIP">                    <Icon icon="ph:download-duotone" className="text-lg" />
                            <span>Export</span></button>

                        <Link href="/ai-website-builder/ai-chat-view/publish" className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-text-color)] text-[var(--d-admin-surface-ground)] flex gap-1.7 shrink-0 h-8 text-sm px-3" title="Deploy to Vercel" >                    <Icon icon="ph:rocket-launch-duotone" className="text-lg" />
                            <span>Publish</span>
                        </Link>
                    </div>

                    {/* Mobile More Menu */}
                    <div className="relative md:hidden">
                        <button
                            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                            className={`flex items-center justify-center h-9 w-9 rounded-md hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] transition-colors ${isMoreMenuOpen ? 'bg-[var(--d-admin-surface-hover)]' : ''}`}
                        >
                            <Icon icon="ph:dots-three-vertical-bold" className="size-5" />
                        </button>

                        {isMoreMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMoreMenuOpen(false)}></div>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col p-1">
                                    <button
                                        onClick={() => {
                                            const files = useFilesStore.getState().files;
                                            exportProjectAsZip(files);
                                            setIsMoreMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full text-left text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors"
                                    >
                                        <Icon icon="ph:download-duotone" className="size-4" />
                                        <span>Export as ZIP</span>
                                    </button>
                                    <Link
                                        href="/ai-website-builder/ai-chat-view/publish"
                                        onClick={() => setIsMoreMenuOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full text-left text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors"
                                    >
                                        <Icon icon="ph:rocket-launch-duotone" className="size-4" />
                                        <span>Publish</span>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
