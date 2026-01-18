
"use client";
import { useState, useCallback, useEffect } from 'react';
import { PortDropdown } from './components/workbench/PortDropdown';
import { Icon } from '@iconify/react';
import { classNames } from './utils/classNames';
import AppTopbarMenu from '@/core/layouts/default-bar/topbar-content/AppTopbarMenu';
import Link from 'next/link';
import { exportProjectAsZip } from './utils/zip';
import { useChatStore, useWorkbenchStore, usePreviewStore, useFilesStore } from './lib/stores/zustand';

function WebsiteBuilderTopbar() {
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

    return (
        <div className="layout-topbar builder-topbar-custom flex items-center justify-between px-4 gap-4">
            <div className="builder-topbar-left flex items-center gap-2 min-w-0">
                <Link
                    href="/"
                    className="p-2 rounded-md text-gray-500 hover:text-color hover:bg-surface-d transition-all flex items-center justify-center"
                >
                    <i className="pi pi-chevron-left" />
                </Link>
                <AppTopbarMenu />

                {chatStarted && (
                    <span className="flex-1 px-4 truncate text-center text-primary min-w-0 max-w-xs md:max-w-md lg:max-w-lg">
                        {chatDescription}
                    </span>
                )}
            </div>

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

            <div className="builder-topbar-right flex items-center">
                {/* History Toggle button */}
                <div className="flex items-center bg-surface-c rounded-lg border border-surface p-1 mr-2">
                    <button
                        className={classNames(
                            'p-1.5 rounded-md transition-all flex items-center justify-center',
                            showHistory ? 'bg-surface-d text-primary shadow-sm' : 'text-gray-500 hover:text-color hover:bg-surface-d'
                        )}
                        onClick={() => {
                            useChatStore.getState().setShowHistory(!showHistory);
                        }}
                        title="History"
                    >
                        <Icon icon="ph:clock-counter-clockwise-duotone" className="text-lg" />
                    </button>
                </div>

                {/* View Toggles */}
                <div className="flex items-center bg-surface-c rounded-lg border border-surface p-1">
                    <button
                        className={classNames(
                            'p-1.5 rounded-md transition-all flex items-center gap-2',
                            showChat ? 'bg-surface-d text-primary shadow-sm' : 'text-gray-500 hover:text-color'
                        )}
                        onClick={() => {
                            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                            const newShowChat = !showChat;

                            if (canHideChat) {
                                useChatStore.getState().setShowChat(newShowChat);

                                // On mobile, hide workbench when showing chat
                                if (isMobile && newShowChat && showWorkbench) {
                                    useWorkbenchStore.getState().setShowWorkbench(false);
                                }
                            }
                        }}
                        disabled={!canHideChat}
                        title="Toggle Chat"
                    >
                        <Icon icon="ph:chat-circle-dots-duotone" className="text-lg" />
                    </button>

                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                    <button
                        className={classNames(
                            'p-1.5 rounded-md transition-all flex items-center gap-2',
                            showWorkbench ? 'bg-surface-d text-primary shadow-sm' : 'text-gray-500 hover:text-color'
                        )}
                        onClick={() => {
                            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                            const newShowState = !showWorkbench;

                            if (showWorkbench && !showChat) {
                                useChatStore.getState().setShowChat(true);
                            }

                            // On mobile, hide chat when showing workbench
                            if (isMobile && newShowState && showChat) {
                                useChatStore.getState().setShowChat(false);
                            }

                            useWorkbenchStore.getState().setUserHidWorkbench(!newShowState);
                            useWorkbenchStore.getState().setShowWorkbench(newShowState);
                        }}
                        title="Toggle Code"
                    >
                        <Icon icon="ph:code-duotone" className="text-lg" />
                    </button>

                </div>

                {/* Export Button */}
                <button
                    className="mr-2 flex items-center gap-2 px-3 md:px-4 py-2 bg-surface-c rounded-lg border border-surface hover:bg-surface-d transition-colors font-medium text-sm"
                    onClick={() => {
                        const files = useFilesStore.getState().files; // Access files from store
                        exportProjectAsZip(files);
                    }}
                    title="Export as ZIP"
                >
                    <Icon icon="ph:download-duotone" className="text-lg" />
                    <span className="hidden md:inline">Export</span>
                </button>

                <Link
                    href="/website-builder/publish"
                    className="mr-2 flex items-center gap-2 px-3 md:px-4 py-2 bg-surface-c rounded-lg border border-surface hover:bg-surface-d transition-colors font-medium text-sm"
                    title="Deploy to Vercel"
                >
                    <Icon icon="ph:rocket-launch-duotone" className="text-lg" />
                    <span className="hidden md:inline">Publish</span>
                </Link>
            </div>
        </div >
    )
}

export default WebsiteBuilderTopbar