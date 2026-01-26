'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useProjectsStore } from '../store/projects-store';
import { useBuilderStore } from '../store/builder-store';
import { savePage } from '../lib/api';
import * as Tabs from '@radix-ui/react-tabs';
import { CreateProjectDialog } from './dialogs/CreateProjectDialog';
import { ProjectSettingsDialog } from './dialogs/ProjectSettingsDialog';
import { DeleteConfirmationDialog } from './dialogs/DeleteConfirmationDialog';
import { TemplatesList } from './TemplatesList';

export function ProjectsGallery() {
  const { projects, setCurrentProject, deleteProject } = useProjectsStore();
  const { setShowProjectsGallery, triggerClearCanvas, projectsGalleryTab, setProjectsGalleryTab } = useBuilderStore();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [settingsDialog, setSettingsDialog] = useState<{ isOpen: boolean; mode: 'edit' | 'template'; projectId: string | null }>({
    isOpen: false,
    mode: 'edit',
    projectId: null
  });
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; projectId: string | null; projectName: string }>({
    isOpen: false,
    projectId: null,
    projectName: ''
  });

  const handleOpenProject = (id: string) => {
    setCurrentProject(id);
    setShowProjectsGallery(false);
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const project = projects.find(p => p.id === id);
    setDeleteDialog({
      isOpen: true,
      projectId: id,
      projectName: project?.name || 'this project'
    });
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    if (deleteDialog.projectId) {
      deleteProject(deleteDialog.projectId);
    }
  };

  const handleCreateNew = () => {
    savePage('', false); // Clear the draft
    setCurrentProject(null);
    setShowProjectsGallery(false);
    triggerClearCanvas();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 top-[var(--header-height)] z-50 flex flex-col bg-[var(--d-admin-surface-ground)] duration-300 overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col px-4 py-4">

        <Tabs.Root
          value={projectsGalleryTab}
          onValueChange={(val) => setProjectsGalleryTab(val as 'projects' | 'templates')}
          className="flex h-full flex-col min-h-0"
        >


          {/* Projects Content */}
          <Tabs.Content
            value="projects"
            className="animate-in fade-in slide-in-from-bottom-4 flex-1 overflow-y-auto duration-500 outline-none pr-1"
          >
            {/* Header with Navigation */}
            <div className="flex items-center justify-between mb-8 gap-4 px-1">
                 {/* Left Side: Templates Switcher & Title */}
                 <div className="flex items-center gap-3">
                    <button 
                       onClick={() => setProjectsGalleryTab('templates')}
                       className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-all shrink-0"
                       title="Back to Templates"
                    >
                       <Icon icon="lucide:layout-template" className="size-4" />
                       <span className="hidden lg:inline">Templates Gallery</span>
                    </button>
                    <div className="w-px h-6 bg-[var(--d-admin-surface-border)] shrink-0" />
                 </div>

                {/* Right Side: Back to Edit */}
                <button
                  onClick={() => setShowProjectsGallery(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors shadow-sm shrink-0"
                >
                  <Icon icon="lucide:arrow-left" className="size-4" />
                  <span className="hidden sm:inline">Back to Edit</span>
                </button>
            </div>

            {projects.length === 0 ? (
              <div className="mx-auto flex h-[50vh] max-w-2xl flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)]/50">
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-[var(--d-admin-surface-hover)]">
                  <Icon
                    icon="lucide:package-open"
                    className="size-8 text-[var(--d-admin-text-color-secondary)]"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-[var(--d-admin-text-color)]">
                  No projects yet
                </h3>
                <p className="mb-8 max-w-sm text-center text-[var(--d-admin-text-color-secondary)]">
                  Start fresh with a blank canvas or choose a template to
                  kickstart your next big idea.
                </p>
                <button
                  onClick={() => setProjectsGalleryTab('templates')}
                  className="flex items-center gap-2 rounded-lg bg-[var(--d-admin-primary)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--d-admin-primary)]/90"
                >
                  <Icon icon="lucide:plus" />
                  Start New Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Create New Project Card (Creates Blank Draft) */}
                <div 
                  onClick={() => handleCreateNew()}
                  className="group flex flex-col gap-2 cursor-pointer"
                >
                  {/* Preview Area */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(var(--d-admin-surface-border)_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
                      
                      <div className="flex size-16 items-center justify-center rounded-xl bg-[var(--d-admin-surface-ground)] text-[var(--d-admin-text-color)] shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Icon icon="lucide:plus" className="size-8" />
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <div className="flex items-center justify-end gap-3">
                            <button 
                                className="px-3 py-1.5 rounded-md bg-white text-black text-xs font-bold hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap"
                            >
                                Create Blank
                            </button>
                        </div>
                      </div>
                  </div>

                  {/* Info Area */}
                  <div className="flex items-center justify-between px-0.5 mt-1">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-sm font-medium text-[var(--d-admin-text-color)] truncate">
                              Create New Project
                          </span>
                      </div>
                  </div>
                </div>

                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleOpenProject(project.id)}
                    className="group flex flex-col gap-2 cursor-pointer"
                  >
                    {/* Preview Area */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)]">
                      {/* Decorative Pattern */}
                      <div className="absolute inset-0 bg-[radial-gradient(var(--d-admin-surface-border)_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt={project.name}
                            className="h-full w-full object-cover object-top opacity-90 transition-opacity group-hover:opacity-100"
                          />
                        ) : (
                          <div className="flex size-16 items-center justify-center rounded-xl bg-[var(--d-admin-surface-ground)] text-2xl font-bold text-[var(--d-admin-text-color)] shadow-sm">
                            {project.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <div className="flex items-center justify-end gap-3">
                              <button 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenProject(project.id);
                                  }}
                                  className="px-3 py-1.5 rounded-md bg-white text-black text-xs font-bold hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap"
                              >
                                  Open Project
                              </button>
                          </div>
                      </div>
                    </div>

                    {/* Info Area (Bottom Bar) */}
                    <div className="flex items-center justify-between px-0.5 mt-1">
                      {/* Project Name (Left) */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                         <span className="text-sm font-medium text-[var(--d-admin-text-color)] truncate hover:underline uppercase" title={project.name}>
                            {project.name}
                         </span>
                         {project.deploymentUrl && (
                             <a 
                                href={project.deploymentUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--d-admin-blue-600)]/10 text-[var(--d-admin-blue-600)] hover:bg-[var(--d-admin-blue-600)]/20 transition-colors"
                                title="Visit Live Site"
                             >
                                <Icon icon="lucide:link" className="size-3" />
                                <span className="text-[10px] font-bold uppercase">Live</span>
                            </a>
                         )}
                      </div>
                      
                      {/* Actions/Date (Right) */}
                      <div className="flex items-center gap-3 text-xs font-medium text-[var(--d-admin-text-color-secondary)] shrink-0">
                        <span className="hidden sm:inline-block">{new Date(project.updatedAt).toLocaleDateString()}</span>
                        
                        {/* Kebab Menu */}
                        <div className="relative">
                            <button
                              className="p-1 rounded-md hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === project.id ? null : project.id);
                              }}
                            >
                              <Icon icon="lucide:more-vertical" className="size-4" />
                            </button>

                            {activeMenuId === project.id && (
                                <>
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                                <div className="absolute right-0 bottom-full mb-1 w-40 rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSettingsDialog({ isOpen: true, mode: 'edit', projectId: project.id });
                                            setActiveMenuId(null);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors text-left"
                                    >
                                        <Icon icon="lucide:pencil" className="size-3.5" />
                                        Rename
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSettingsDialog({ isOpen: true, mode: 'template', projectId: project.id });
                                            setActiveMenuId(null);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] transition-colors text-left"
                                    >
                                        <Icon icon="lucide:folder-up" className="size-3.5" />
                                        Move to Template
                                    </button>
                                    <div className="h-px bg-[var(--d-admin-surface-border)]" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteProject(e, project.id);
                                            setActiveMenuId(null);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors text-left"
                                    >
                                        <Icon icon="lucide:trash-2" className="size-3.5" />
                                        Delete
                                    </button>
                                </div>
                                </>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tabs.Content>

          {/* Templates Content */}
          <Tabs.Content
            value="templates"
            className="animate-in fade-in slide-in-from-bottom-4 flex-1 overflow-y-auto duration-500 outline-none pr-1"
          >
            <TemplatesList />
          </Tabs.Content>
        </Tabs.Root>
      </div>

      <CreateProjectDialog 
        isOpen={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
      />

      <ProjectSettingsDialog
        isOpen={settingsDialog.isOpen}
        onClose={() => setSettingsDialog({ isOpen: false, mode: 'edit', projectId: null })}
        mode={settingsDialog.mode}
        project={settingsDialog.projectId ? projects.find(p => p.id === settingsDialog.projectId) || null : null}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, projectId: null, projectName: '' })}
        onConfirm={confirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        itemName={deleteDialog.projectName}
      />
    </div>
  );
}
