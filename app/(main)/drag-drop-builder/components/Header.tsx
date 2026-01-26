import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { useAiBuilderStore } from '../store/ai-builder-store';
import { useProjectsStore } from '../store/projects-store';
import { useBuilderStore } from '../store/builder-store';


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
        projectsGalleryTab,
        setProjectsGalleryTab,
    } = useBuilderStore();

    const { currentProjectId, getProject, setCurrentProject } = useProjectsStore();
    const currentProjectName = currentProjectId ? getProject(currentProjectId)?.name : null;

    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

    return (
        <header className="flex h-[var(--header-height)] w-full shrink-0 items-center pr-3 pl-2 select-none">
            <div className="flex w-full max-w-[75%] min-w-0 flex-1 items-center gap-2 md:max-w-[40.5%]">
                {/* Back Button - Hidden on Mobile */}
                <button
                    onClick={() => router.back()}
                    className="hidden md:flex items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors gap-1.7 shrink-0 h-8 text-sm px-2"
                    type="button"
                    title="Go Back"
                >
                    <Icon icon="ph:caret-left" className="text-lg" />
                </button>
            
                {/* New Project Button - Moved Left for Mobile */}
                 <button
                    onClick={() => {
                        const newProjectId = `project-${Date.now()}`;
                        const { saveProject, setCurrentProject } = useProjectsStore.getState();
                        saveProject({
                            id: newProjectId,
                            name: 'New Project',
                            html: '',
                        });
                        setCurrentProject(newProjectId);
                        triggerClearCanvas();
                    }}
                    className="flex md:hidden items-center justify-center gap-2 font-medium min-w-0 rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors shrink-0 h-8 text-sm px-2"
                    type="button"
                    title="Create New Project"
                >
                    <Icon icon="lucide:plus" className="text-lg" />
                </button>

                {/* Project Name */}
                <button
                    className="flex-1 md:flex-none flex items-center justify-start md:justify-center font-semibold min-w-0 rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] text-base px-1 md:px-3 -mr-px"
                    type="button"
                >
                    <span className="max-w-full truncate md:max-w-md lg:max-w-lg uppercase">
                       {currentProjectName ? (
                            <span className="text-primary flex-1 truncate text-center">
                                {currentProjectName}
                            </span>
                        ) : (
                            'New Project'
                        )}
                    </span>
                </button>
                
                {/* New Project Button - Desktop (Right aligned in left block) */}
                <button
                    onClick={() => {
                        const newProjectId = `project-${Date.now()}`;
                        const { saveProject, setCurrentProject } = useProjectsStore.getState();
                        saveProject({
                            id: newProjectId,
                            name: 'New Project',
                            html: '',
                        });
                        setCurrentProject(newProjectId);
                        triggerClearCanvas();
                    }}
                    className="hidden md:flex items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors gap-1.7 shrink-0 h-8 text-sm px-3 ml-auto"
                    type="button"
                    title="Create New Project"
                >
                    <Icon icon="lucide:plus" className="text-lg" />
                    <span>New Project</span>
                </button>
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
                         {/* Undo/Redo Group */}
                        <div className="flex items-center gap-1 bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] rounded-md p-0.5 h-8">
                             <button
                                onClick={useBuilderStore.getState().undo}
                                disabled={useBuilderStore(state => state.historyIndex <= 0)}
                                className="flex items-center justify-center p-1.5 rounded hover:bg-[var(--d-admin-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[var(--d-admin-text-color)]"
                                title="Undo"
                             >
                                <Icon icon="lucide:undo-2" className="size-4" />
                             </button>
                             <div className="w-px h-4 bg-[var(--d-admin-surface-border)]" />
                             <button
                                onClick={useBuilderStore.getState().redo}
                                disabled={useBuilderStore(state => state.historyIndex >= state.history.length - 1)}
                                className="flex items-center justify-center p-1.5 rounded hover:bg-[var(--d-admin-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[var(--d-admin-text-color)]"
                                title="Redo"
                             >
                                <Icon icon="lucide:redo-2" className="size-4" />
                             </button>
                        </div>

                        {/* Templates Button */}
                        <button
                            className={`items-center justify-center gap-2 font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors flex gap-1.7 shrink-0 h-8 text-sm px-3 ${showProjectsGallery && projectsGalleryTab === 'templates' ? 'bg-[var(--d-admin-surface-hover)]' : ''}`}
                            onClick={() => {
                                if (showProjectsGallery && projectsGalleryTab === 'templates') {
                                    setShowProjectsGallery(false);
                                } else {
                                    setProjectsGalleryTab('templates');
                                    setShowProjectsGallery(true);
                                }
                            }}
                            title="Browse Templates"
                        >
                            <Icon icon="lucide:layout-template" className="text-lg" />
                            <span>Templates</span>
                        </button>

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
                                    useBuilderStore.getState().setMobileSidebar(true)
                                }
                            >
                                <Icon icon="lucide:plus" className="text-lg" />
                                <span className="hidden sm:inline">Add</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Controls & Menu */}
                    <div className="flex items-center gap-1 md:hidden">
                        {/* Mobile Undo */}
                        <button
                            onClick={useBuilderStore.getState().undo}
                            disabled={useBuilderStore(state => state.historyIndex <= 0)}
                            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)] disabled:opacity-30"
                        >
                            <Icon icon="lucide:undo-2" className="size-5" />
                        </button>

                        {/* Mobile Redo */}
                        <button
                            onClick={useBuilderStore.getState().redo}
                            disabled={useBuilderStore(state => state.historyIndex >= state.history.length - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)] disabled:opacity-30"
                        >
                            <Icon icon="lucide:redo-2" className="size-5" />
                        </button>

                        {/* Mobile Preview */}
                         <button
                            onClick={() => setIsPreview(!isPreview)}
                            className={`flex h-9 w-9 items-center justify-center rounded-md text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)] ${isPreview ? 'bg-[var(--d-admin-surface-hover)] text-blue-500' : ''}`}
                        >
                            <Icon icon={isPreview ? "lucide:pencil" : "lucide:eye"} className="size-5" />
                        </button>

                        {/* Mobile More Kebab */}
                        <div className="relative">
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
                                            const newProjectId = `project-${Date.now()}`;
                                            const { saveProject, setCurrentProject } = useProjectsStore.getState();
                                            saveProject({
                                                id: newProjectId,
                                                name: 'New Project',
                                                html: '',
                                            });
                                            setCurrentProject(newProjectId);
                                            triggerClearCanvas();
                                            setIsMoreMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                                    >
                                        <Icon icon="lucide:plus" className="size-4" />
                                        <span>New Project</span>
                                    </button>

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
                                                 if (showProjectsGallery && projectsGalleryTab === 'templates') {
                                                    setShowProjectsGallery(false);
                                                } else {
                                                    setProjectsGalleryTab('templates');
                                                    setShowProjectsGallery(true);
                                                }
                                                setIsMoreMenuOpen(false);
                                            }}
                                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                                        >
                                            <Icon icon="lucide:layout-template" className="size-4" />
                                            <span>Templates</span>
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
                                        
                                         {/* Mobile Add Component (If in preview, maybe hide? user request flow implies basic actions) */}
                                        <button
                                            onClick={() => {
                                                 useBuilderStore.getState().setMobileSidebar(true);
                                                 setIsMoreMenuOpen(false);
                                            }}
                                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                                        >
                                             <Icon icon="lucide:plus" className="size-4" />
                                             <span>Add Element</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

