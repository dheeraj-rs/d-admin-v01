import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useAiBuilderStore } from '../store/ai-builder-store';
import { useDragDropStore } from '../../drag-drop-builder/drag-drop-view/lib/drag-drop-store';
// ==================================
import { PortDropdown } from './components/workbench/PortDropdown';
import { exportProjectAsZip } from './utils/zip';
import { useChatStore, useWorkbenchStore, usePreviewStore, useFilesStore } from './lib/stores/zustand';
import { workbenchStore } from './lib/stores/workbench';
import { useParams } from 'next/navigation';
import DeploymentModal from './publish/DeploymentModal';

export function Header() {
    const router = useRouter();
    const activeView = useWorkbenchStore(state => state.currentView);
    const { activeMobilePanel, setActiveMobilePanel, isHistoryOpen, setIsHistoryOpen, builderView, setBuilderView } = useAiBuilderStore();
    const [isBuilderMenuOpen, setIsBuilderMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    // Drag Drop Store
    const {
        isPreview,
        setIsPreview,
        setShowExportDialog,
        setHeaderAction
    } = useDragDropStore();

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
    const iframeUrl = usePreviewStore(state => state.iframeUrl);
    const activePreview = previews[activePreviewIndex];

    // Local state for the "pretty" URL shown to users
    const [displayUrl, setDisplayUrl] = useState('');

    const chatStarted = useChatStore(state => state.started);
    const chatDescription = useChatStore(state => state.description);
    const showHistory = useChatStore(state => state.showHistory);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const params = useParams();
    const chatId = params?.id as string | undefined;

    // Sync displayUrl with the actual URL from the store
    useEffect(() => {
        if (previews.length === 0) {
            setDisplayUrl('');
            return;
        }

        const currentPreview = previews[activePreviewIndex];
        if (!currentPreview) return;

        // Extract just the path from the full URL
        if (url.startsWith(currentPreview.baseUrl)) {
            const path = url.slice(currentPreview.baseUrl.length) || '/';
            console.log('[Header] URL:', url);
            console.log('[Header] Base URL:', currentPreview.baseUrl);
            console.log('[Header] Extracted path:', path);
            setDisplayUrl(path);
        } else if (url.includes('://')) {
            // If it's a full URL (possibly old WebContainer URL), extract the path
            try {
                const urlObj = new URL(url);
                const path = urlObj.pathname + urlObj.search + urlObj.hash;
                console.log('[Header] Full URL detected, showing path:', path);
                setDisplayUrl(path);
            } catch (e) {
                // Fallback to just showing the URL as-is
                console.log('[Header] Invalid URL, showing as-is:', url);
                setDisplayUrl(url);
            }
        } else {
            // Fallback for relative paths
            console.log('[Header] Relative path:', url);
            setDisplayUrl(url.startsWith('/') ? url : '/' + url);
        }
    }, [url, activePreviewIndex, previews]);

    useEffect(() => {
        if (activePreview) {
            // Initial setup: Ensure store has the base URL if empty
            if (!url) {
                usePreviewStore.getState().setUrl(activePreview.baseUrl);
            }

            // Only set iframeUrl if it's different to prevent reloading
            if (activePreview.baseUrl !== iframeUrl && !iframeUrl) {
                usePreviewStore.getState().setIframeUrl(activePreview.baseUrl);
            }
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
            <div className="flex items-center gap-2 flex-1 min-w-0 w-full max-w-[70%] md:max-w-[40.5%]">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center font-medium shrink-0 min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-sm px-2 -mr-px"
                    type="button"
                >
                    <Icon icon="ph:caret-left" className="size-5" />
                </button>
                {builderView !== 'drag-drop' && (
                    <button
                        className={`flex items-center justify-center font-medium shrink-0 min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-sm px-2 -mr-px ${isHistoryOpen ? 'bg-[var(--d-admin-surface-hover)]' : ''}`}
                        type="button"
                        onClick={() => { setIsHistoryOpen(!isHistoryOpen); useChatStore.getState().setShowHistory(!showHistory); }}
                    >
                        <Icon icon="ph:clock-counter-clockwise" className="size-5" />
                    </button>
                )}
                <span className="text-[var(--d-admin-text-color)] opacity-[.12] text-xl antialiased mx-1">/</span>
                <button className={`flex-1 md:flex-none flex items-center justify-center font-medium min-w-0 rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-sm px-2 -mr-px ${isMobile && activeMobilePanel === 'workbench' ? 'hidden' : 'flex'}`} type="button">
                    <span className="truncate max-w-full md:max-w-md lg:max-w-lg">{chatStarted ? (
                        <span className="flex-1 truncate text-center text-primary">
                            {chatDescription}
                        </span>
                    ) : 'New Project'}</span>
                </button>
                <div className="relative ml-2 shrink-0 items-center gap-2">
                    <Link
                        href="/ai-website-builder"
                        onClick={() => {
                            workbenchStore.reset();
                        }}
                        className="flex items-center justify-center font-medium shrink-0 min-w-0 rounded-md focus-visible:outline-2 gap-1.5 h-8 bg-[var(--d-admin-surface-section)] hover:bg-[var(--d-admin-surface-hover)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] text-xs px-3 transition-colors"
                        title="Start New Chat"
                    >
                        <Icon icon={getBuilderIcon(builderView)} className="size-3.5 text-[var(--d-admin-text-color-secondary)]" />
                        <span>New Chat</span>
                    </Link>
                </div>

            </div>

            <div className="flex items-center pointer-events-auto shrink-0 ml-auto gap-2 w-auto md:w-full md:max-w-[59.5%]">
                <div className="flex relative justify-end w-auto md:w-full items-center gap-2 py-2 min-h-[var(--panel-header-height)] pl-0">
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


                    {(!isMobile || activeMobilePanel === 'workbench') && builderView !== 'drag-drop' && (
                        <div className=" flex items-center gap-2">
                            <div className="flex items-center shrink-0 overflow-hidden rounded-lg p-0.5 border border-[var(--d-admin-surface-border)] h-8">
                                <button
                                    onClick={() => useWorkbenchStore.getState().setCurrentView('preview')}
                                    className={`relative bg-transparent text-xs px-3 h-full rounded-md transition-all flex items-center justify-center ${activeView === 'preview' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                                >
                                    <span className="relative z-10 flex items-center font-medium gap-1.5">
                                        <Icon icon="lucide:eye" className="size-3.5" />
                                        <span className="hidden sm:inline-block">Preview</span>
                                    </span>
                                    {activeView === 'preview' && <span className="absolute inset-0 z-0 bg-[var(--d-admin-surface-hover)] rounded-md shadow-sm"></span>}
                                </button>
                                <button
                                    onClick={() => useWorkbenchStore.getState().setCurrentView('code')}
                                    className={`relative bg-transparent text-xs px-3 h-full rounded-md transition-all flex items-center justify-center ${activeView === 'code' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                                >
                                    <span className="relative z-10 flex items-center font-medium gap-1.5">
                                        <Icon icon="lucide:code" className="size-3.5" />
                                        <span className="hidden sm:inline-block">Code</span>
                                    </span>
                                    {activeView === 'code' && <span className="absolute inset-0 z-0 bg-[var(--d-admin-surface-hover)] rounded-md shadow-sm"></span>}
                                </button>
                            </div>

                        </div>
                    )}
                    <div className="w-full flex-1 hidden md:flex items-center justify-center">
                        {/* <button type="button" id="radix-:r4g:" aria-haspopup="menu" aria-expanded="false" data-state="closed" className="bg-transparent p-0" aria-label="More Options">
                                    <div className="flex items-center bg-transparent text-sm px-2 py-1 rounded-full relative text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] pl-1 pr-1.5 h-5 opacity-90 hover:opacity-100" data-state="closed">
                                        <Icon icon="ph:gear-six-duotone" className="w-4 h-4" />
                                    </div>
                                </button> */}
                        <div className="builder-topbar-center hidden md:block flex-1 mx-auto w-full max-w-[400px]">
                            <div className="relative flex items-center w-full bg-[var(--d-admin-surface-section)] rounded-md border border-[var(--d-admin-surface-border)] px-3 h-8">
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
                                    value={displayUrl}
                                    onChange={(e) => setDisplayUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (!activePreview) return;

                                            let targetUrl = displayUrl.trim();

                                            // If user types a path (starts with /), construct full URL
                                            if (targetUrl.startsWith('/')) {
                                                targetUrl = `${activePreview.baseUrl}${targetUrl}`;
                                            }
                                            // If user types just a page name without /, prepend /
                                            else if (!targetUrl.includes('://') && !targetUrl.startsWith('/')) {
                                                targetUrl = `${activePreview.baseUrl}/${targetUrl}`;
                                            }
                                            // If it's already a full URL, use it as-is
                                            else if (!targetUrl.startsWith(activePreview.baseUrl)) {
                                                // If it doesn't start with the base URL, assume it's a path
                                                targetUrl = `${activePreview.baseUrl}${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;
                                            }

                                            console.log('[Header] Navigating to:', targetUrl);
                                            console.log('[Header] Base URL:', activePreview.baseUrl);

                                            // Update both URL and iframe URL to trigger navigation
                                            usePreviewStore.getState().setUrl(targetUrl);
                                            usePreviewStore.getState().setIframeUrl(targetUrl);
                                        }
                                    }}
                                    placeholder="/"
                                />
                                <div className="flex items-center gap-1 ml-2">
                                    <button
                                        className="p-1 hover:bg-[var(--d-admin-surface-hover)] rounded-md text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] transition-colors"
                                        onClick={() => {
                                            usePreviewStore.getState().setIframeUrl(url);
                                            usePreviewStore.getState().refreshPreview();
                                        }}
                                        title="Refresh Preview"
                                    >
                                        <Icon icon="ph:arrow-clockwise" className="size-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Desktop Actions */}
                    <div className="ml-auto hidden md:flex gap-3">
                        {/* Drag & Drop Actions */}
                        {builderView === 'drag-drop' && (
                            <>
                                <button
                                    className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors flex gap-1.7 shrink-0 h-8 text-sm px-3"
                                    onClick={() => useDragDropStore.getState().setShowProjectsGallery(true)}
                                    title="Projects"
                                >
                                    <Icon icon="lucide:folder-open" className="text-lg" />
                                    <span>Projects</span>
                                </button>

                                <button
                                    className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors flex gap-1.7 shrink-0 h-8 text-sm px-3"
                                    onClick={() => setHeaderAction('save')}
                                    title="Save Project"
                                >
                                    <Icon icon="lucide:save" className="text-lg" />
                                    <span>Save</span>
                                </button>

                                {!isPreview ? (
                                    <button
                                        className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors flex gap-1.7 shrink-0 h-8 text-sm px-3"
                                        onClick={() => setIsPreview(true)}
                                    >
                                        <Icon icon="lucide:eye" className="text-lg" />
                                        <span>Preview</span>
                                    </button>
                                ) : (
                                    <button
                                        className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-blue-600)] border border-[var(--d-admin-blue-600)] text-white hover:bg-[var(--d-admin-blue-700)] transition-colors flex gap-1.7 shrink-0 h-8 text-sm px-3"
                                        onClick={() => setIsPreview(false)}
                                    >
                                        <Icon icon="lucide:pencil" className="text-lg" />
                                        <span>Editor</span>
                                    </button>
                                )}

                                <button
                                    className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors flex gap-1.7 shrink-0 h-8 text-sm px-3"
                                    onClick={() => setShowExportDialog(true)}
                                    title="Export"
                                >
                                    <Icon icon="ph:download-duotone" className="text-lg" />
                                    <span>Export</span>
                                </button>

                                <button
                                    className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors flex gap-1.7 shrink-0 h-8 text-sm px-3"
                                    title="Publish"
                                    onClick={() => setHeaderAction('preparePublish')}
                                >
                                    <Icon icon="ph:rocket-launch-duotone" className="text-lg" />
                                    <span>Publish</span>
                                </button>
                            </>
                        )}

                        {/* Mobile Add Component Button */}
                        {builderView === 'drag-drop' && isMobile && (
                            <button
                                className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-blue-600)] border border-[var(--d-admin-blue-600)] text-white hover:bg-[var(--d-admin-blue-700)] transition-colors flex gap-1.7 shrink-0 h-8 text-sm px-3 ml-auto"
                                onClick={() => useDragDropStore.getState().setMobileSidebar(true)}
                            >
                                <Icon icon="lucide:plus" className="text-lg" />
                                <span className="hidden sm:inline">Add</span>
                            </button>
                        )}

                        {/* Chat / Default Actions */}
                        {builderView !== 'drag-drop' && (
                            <>
                                <button className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors flex gap-1.7 shrink-0 h-8 text-sm px-3" type="button" onClick={() => {
                                    const files = useFilesStore.getState().files;
                                    exportProjectAsZip(files);
                                }}
                                    title="Export as ZIP">                    <Icon icon="ph:download-duotone" className="text-lg" />
                                    <span>Export</span></button>

                                <button
                                    className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors flex gap-1.7 shrink-0 h-8 text-sm px-3"
                                    title="Deploy to Vercel"
                                    onClick={() => setIsDeployModalOpen(true)}
                                >                    <Icon icon="ph:rocket-launch-duotone" className="text-lg" />
                                    <span>Publish</span>
                                </button>
                            </>
                        )}
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
                                <div className="absolute top-full right-0 mt-2 w-56 bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col p-1">



                                    <div className="px-2 py-1.5 text-xs font-medium text-[var(--d-admin-text-color-secondary)] uppercase">Actions</div>

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
                                    <button
                                        onClick={() => {
                                            setIsMoreMenuOpen(false);
                                            setIsDeployModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full text-left text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors"
                                    >
                                        <Icon icon="ph:rocket-launch-duotone" className="size-4" />
                                        <span>Publish</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {
                isDeployModalOpen && (
                    <DeploymentModal
                        isOpen={isDeployModalOpen}
                        onClose={() => setIsDeployModalOpen(false)}
                        chatId={chatId}
                    />
                )
            }
        </header >
    );
}
