import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { useAiBuilderStore } from '../../store/ai-builder-store';
import { useProjectsStore } from '../../store/projects-store';
import { useDragDropStore } from '../lib/drag-drop-store';
import { savePage } from '../lib/builderApi';

export function Header() {
    const router = useRouter();
    const {
        activeMobilePanel,
    } = useAiBuilderStore();
    const isMobile = useIsMobile();

    // Drag Drop Store
    const {
        isPreview,
        setIsPreview,
        setShowExportDialog,
        setHeaderAction,
        showProjectsGallery,
        setShowProjectsGallery,
        triggerClearCanvas,
    } = useDragDropStore();

    const { currentProjectId, getProject, setCurrentProject } = useProjectsStore();
    const currentProjectName = currentProjectId ? getProject(currentProjectId)?.name : null;

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
                    className={`flex items-center justify-center font-medium shrink-0 min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-sm px-2 -mr-px ${showProjectsGallery ? 'bg-[var(--d-admin-surface-hover)]' : ''}`}
                    type="button"
                    onClick={() => {
                        setShowProjectsGallery(!showProjectsGallery);
                    }}
                    title="Projects"
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
                       {currentProjectName ? (
                            <span className="text-primary flex-1 truncate text-center">
                                {currentProjectName}
                            </span>
                        ) : (
                            'New Project'
                        )}
                    </span>
                </button>
                
               
                
                <div className="relative ml-2 shrink-0 items-center gap-2">
                    <button
                        onClick={() => {
                            savePage('', false); // Clear the draft
                            setCurrentProject(null);
                            triggerClearCanvas();
                        }}
                        className="flex items-center justify-center font-medium shrink-0 min-w-0 rounded-md focus-visible:outline-2 gap-1.5 h-8 bg-[var(--d-admin-surface-section)] hover:bg-[var(--d-admin-surface-hover)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] text-xs px-3 transition-colors"
                        title="Start New Project"
                    >
                        <Icon
                            icon="lucide:plus"
                            className="size-3.5 text-[var(--d-admin-text-color-secondary)]"
                        />
                        <span>New Project</span>
                    </button>
                </div>
            </div>

            <div className="pointer-events-auto ml-auto flex w-auto shrink-0 items-center gap-2 md:w-full md:max-w-[59.5%]">
                <div className="relative flex min-h-[var(--panel-header-height)] w-auto items-center justify-end gap-2 py-2 pl-0 md:w-full">

                     {/* Path Input Box with Integrated Actions */}
                <div className="relative flex-1 max-w-2xl hidden md:flex items-center">
                    <div className="relative w-full flex items-center h-8 rounded-md bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] focus-within:ring-2 focus-within:ring-[var(--d-admin-blue-600)] focus-within:border-transparent transition-all">
                        {/* New Path Button - Inside Left */}
                        <button
                            onClick={() => setHeaderAction('addNewPath')}
                            className="flex items-center justify-center shrink-0 h-full px-2 hover:bg-[var(--d-admin-surface-hover)] rounded-l-md transition-colors border-r border-[var(--d-admin-surface-border)]"
                            title="Add New Path"
                        >
                            <Icon
                                icon="lucide:plus"
                                className="size-4 text-[var(--d-admin-text-color-secondary)]"
                            />
                        </button>

                        {/* Path Icon */}
                        <Icon 
                            icon="ph:path" 
                            className="ml-2 size-4 text-[var(--d-admin-text-color-secondary)] shrink-0" 
                        />

                        {/* Path Input */}
                        <input
                            type="text"
                            placeholder="/index"
                            defaultValue="/index"
                            className="flex-1 h-full px-2 text-sm bg-transparent text-[var(--d-admin-text-color)] placeholder:text-[var(--d-admin-text-color-secondary)] focus:outline-none"
                        />

                        {/* Refresh Button - Inside Right */}
                        <button
                            onClick={() => setHeaderAction('refreshPreview')}
                            className="flex items-center justify-center shrink-0 h-full px-2 hover:bg-[var(--d-admin-surface-hover)] rounded-r-md transition-colors border-l border-[var(--d-admin-surface-border)]"
                            title="Refresh Preview"
                        >
                            <Icon
                                icon="lucide:refresh-cw"
                                className="size-4 text-[var(--d-admin-text-color-secondary)]"
                            />
                        </button>
                    </div>
                </div>
                    
                    {/* Desktop Actions */}
                    <div className="ml-auto hidden gap-3 md:flex">
                        {/* Drag & Drop Actions */}
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

                        {/* Mobile Add Component Button */}
                        {isMobile && (
                            <button
                                className="items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-blue-600)] border border-[var(--d-admin-blue-600)] text-white hover:bg-[var(--d-admin-blue-700)] transition-colors flex gap-1.7 shrink-0 h-8 text-sm px-3 ml-auto"
                                onClick={() =>
                                    useDragDropStore.getState().setMobileSidebar(true)
                                }
                            >
                                <Icon icon="lucide:plus" className="text-lg" />
                                <span className="hidden sm:inline">Add</span>
                            </button>
                        )}
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
                                            setHeaderAction('save');
                                            setIsMoreMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                                    >
                                        <Icon icon="lucide:save" className="size-4" />
                                        <span>Save Project</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            setIsPreview(!isPreview);
                                            setIsMoreMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                                    >
                                        <Icon icon={!isPreview ? "lucide:eye" : "lucide:pencil"} className="size-4" />
                                        <span>{!isPreview ? "Preview" : "Back to Editor"}</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowExportDialog(true);
                                            setIsMoreMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                                    >
                                        <Icon icon="ph:download-duotone" className="size-4" />
                                        <span>Export</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setHeaderAction('preparePublish');
                                            setIsMoreMenuOpen(false);
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
        </header>
    );
}

