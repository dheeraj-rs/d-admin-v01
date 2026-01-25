import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useAiBuilderStore } from '../store/ai-builder-store';
// ==================================
import { PortDropdown } from './WorkbenchPortDropdown';
import { exportProjectAsZip } from '../utils/zip';
import {
    useChatStore,
    useWorkbenchStore,
    usePreviewStore,
    useFilesStore,
} from '../stores/zustand';
import { workbenchStore } from '../stores/workbench';
import { useParams } from 'next/navigation';
import DeploymentModal from '../publish/DeploymentModal';

export function Header() {
    const router = useRouter();
    const activeView = useWorkbenchStore((state) => state.currentView);
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



    const getBuilderIcon = () => 'lucide:sparkles';

    // =======================

    const showWorkbench = useWorkbenchStore((state) => state.showWorkbench);
    const showChat = useChatStore((state) => state.showChat);
    const previews = usePreviewStore((state) => state.previews);
    const activePreviewIndex = usePreviewStore(
        (state) => state.activePreviewIndex,
    );
    const url = usePreviewStore((state) => state.url);
    const iframeUrl = usePreviewStore((state) => state.iframeUrl);
    const activePreview = previews[activePreviewIndex];

    // Local state for the "pretty" URL shown to users
    const [displayUrl, setDisplayUrl] = useState('');

    const chatStarted = useChatStore((state) => state.started);
    const chatDescription = useChatStore((state) => state.description);
    const showHistory = useChatStore((state) => state.showHistory);
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
        <header className="flex h-[var(--header-height)] w-full shrink-0 items-center pr-3 pl-2 select-none">
            <div className="flex w-full max-w-[70%] min-w-0 flex-1 items-center gap-2 md:max-w-[40.5%]">
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
                    onClick={() => {
                        setIsHistoryOpen(!isHistoryOpen);
                        useChatStore.getState().setShowHistory(!showHistory);
                    }}
                >
                    <Icon icon="ph:clock-counter-clockwise" className="size-5" />
                </button>
                <span className="mx-1 text-xl text-[var(--d-admin-text-color)] antialiased opacity-[.12]">
                    /
                </span>
                <button
                    className={`flex-1 md:flex-none flex items-center justify-center font-medium min-w-0 rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-sm px-2 -mr-px ${isMobile && activeMobilePanel === 'workbench' ? 'hidden' : 'flex'}`}
                    type="button"
                >
                    <span className="max-w-full truncate md:max-w-md lg:max-w-lg">
                        {chatStarted ? (
                            <span className="text-primary flex-1 truncate text-center">
                                {chatDescription}
                            </span>
                        ) : (
                            'New Project'
                        )}
                    </span>
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
                        <Icon
                            icon={getBuilderIcon()}
                            className="size-3.5 text-[var(--d-admin-text-color-secondary)]"
                        />
                        <span>New Chat</span>
                    </Link>
                </div>
            </div>

            <div className="pointer-events-auto ml-auto flex w-auto shrink-0 items-center gap-2 md:w-full md:max-w-[59.5%]">
                <div className="relative flex min-h-[var(--panel-header-height)] w-auto items-center justify-end gap-2 py-2 pl-0 md:w-full">
                    {/* Mobile Panel Switcher */}
                    {isMobile && (
                        <div className="mr-0 flex items-center gap-2">
                            <div className="flex shrink-0 flex-wrap items-center overflow-hidden rounded-xl border border-[var(--d-admin-surface-border)] p-1">
                                <button
                                    onClick={() => setActiveMobilePanel('chat')}
                                    className={`relative rounded-full bg-transparent px-2.5 py-1 text-sm ${activeMobilePanel === 'chat' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
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
                                    className={`relative rounded-full bg-transparent px-2.5 py-1 text-sm ${activeMobilePanel === 'workbench' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
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
                                    <button
                                        onClick={() =>
                                            useWorkbenchStore.getState().setCurrentView('preview')
                                        }
                                        className={`relative rounded-full bg-transparent px-2.5 py-1 text-sm ${activeView === 'preview' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                                    >
                                        <span className="relative z-10 flex items-center gap-1.5 font-medium">
                                            <Icon icon="lucide:eye" className="size-4" />
                                            <span className="hidden sm:inline-block">Preview</span>
                                        </span>
                                        {activeView === 'preview' && (
                                            <span
                                                className="absolute inset-0 z-0 rounded-lg bg-[var(--d-admin-surface-hover)]"
                                                style={{ opacity: 1 }}
                                            ></span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() =>
                                            useWorkbenchStore.getState().setCurrentView('code')
                                        }
                                        className={`relative rounded-full bg-transparent px-2.5 py-1 text-sm ${activeView === 'code' ? 'text-[var(--d-admin-text-color)]' : 'text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]'}`}
                                    >
                                        <span className="relative z-10 flex items-center gap-1.5 font-medium">
                                            <Icon icon="lucide:code" className="size-4" />
                                            <span className="hidden sm:inline-block">Code</span>
                                        </span>
                                        {activeView === 'code' && (
                                            <span
                                                className="absolute inset-0 z-0 rounded-lg bg-[var(--d-admin-surface-hover)]"
                                                style={{ opacity: 1 }}
                                            ></span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    <div className="hidden w-full flex-1 items-center justify-center md:flex">
                        {/* <button type="button" id="radix-:r4g:" aria-haspopup="menu" aria-expanded="false" data-state="closed" className="bg-transparent p-0" aria-label="More Options">
                                    <div className="flex items-center bg-transparent text-sm px-2 py-1 rounded-full relative text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] pl-1 pr-1.5 h-5 opacity-90 hover:opacity-100" data-state="closed">
                                        <Icon icon="ph:gear-six-duotone" className="w-4 h-4" />
                                    </div>
                                </button> */}
                        <div className="builder-topbar-center mx-auto hidden w-full max-w-[400px] flex-1 md:block">
                            <div className="relative flex h-8 w-full items-center rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] px-3">
                                {activePreview && (
                                    <div className="mr-2">
                                        <PortDropdown
                                            activePreviewIndex={activePreviewIndex}
                                            setActivePreviewIndex={(index) =>
                                                usePreviewStore.getState().setActivePreviewIndex(index)
                                            }
                                            isDropdownOpen={isDropdownOpen}
                                            setIsDropdownOpen={setIsDropdownOpen}
                                            setHasSelectedPreview={() => { }}
                                            previews={previews}
                                        />
                                    </div>
                                )}
                                {!activePreview && (
                                    <Icon
                                        icon="ph:lock-key-duotone"
                                        className="mr-2 text-gray-400"
                                    />
                                )}
                                <input
                                    className="text-color hidden w-full bg-transparent text-sm outline-none md:block"
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
                                            else if (
                                                !targetUrl.includes('://') &&
                                                !targetUrl.startsWith('/')
                                            ) {
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
                                <div className="ml-2 flex items-center gap-1">
                                    <button
                                        className="rounded-md p-1 text-[var(--d-admin-text-color-secondary)] transition-colors hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]"
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
                    <div className="ml-auto hidden gap-3 md:flex">
                                <button
                                    className="disabled:op-50 gap-1.7 relative flex h-8 max-w-full min-w-0 shrink-0 items-center justify-center gap-2 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] px-3 text-sm font-medium text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)] focus-visible:outline-2 focus-visible:outline-[var(--d-admin-blue-600)] disabled:cursor-not-allowed"
                                    type="button"
                                    onClick={() => {
                                        const files = useFilesStore.getState().files;
                                        exportProjectAsZip(files);
                                    }}
                                    title="Export as ZIP"
                                >
                                    {' '}
                                    <Icon icon="ph:download-duotone" className="text-lg" />
                                    <span>Export</span>
                                </button>

                                <button
                                    className="disabled:op-50 gap-1.7 relative flex h-8 max-w-full min-w-0 shrink-0 items-center justify-center gap-2 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] px-3 text-sm font-medium text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)] focus-visible:outline-2 focus-visible:outline-[var(--d-admin-blue-600)] disabled:cursor-not-allowed"
                                    title="Deploy to Vercel"
                                    onClick={() => setIsDeployModalOpen(true)}
                                >
                                    {' '}
                                    <Icon icon="ph:rocket-launch-duotone" className="text-lg" />
                                    <span>Publish</span>
                                </button>
                    </div>

                    {/* Mobile More Menu */}
                    <div className="relative md:hidden">
                        <button
                            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                            className={`flex h-9 w-9 items-center justify-center rounded-md text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)] ${isMoreMenuOpen ? 'bg-[var(--d-admin-surface-hover)]' : ''}`}
                        >
                            <Icon icon="ph:dots-three-vertical-bold" className="size-5" />
                        </button>

                        {isMoreMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsMoreMenuOpen(false)}
                                ></div>
                                <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-2 flex w-56 flex-col overflow-hidden rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] p-1 shadow-xl duration-100">
                                    <div className="px-2 py-1.5 text-xs font-medium text-[var(--d-admin-text-color-secondary)] uppercase">
                                        Actions
                                    </div>

                                    <button
                                        onClick={() => {
                                            const files = useFilesStore.getState().files;
                                            exportProjectAsZip(files);
                                            setIsMoreMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                                    >
                                        <Icon icon="ph:download-duotone" className="size-4" />
                                        <span>Export as ZIP</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsMoreMenuOpen(false);
                                            setIsDeployModalOpen(true);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
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
            {isDeployModalOpen && (
                <DeploymentModal
                    isOpen={isDeployModalOpen}
                    onClose={() => setIsDeployModalOpen(false)}
                    chatId={chatId}
                />
            )}
        </header>
    );
}
