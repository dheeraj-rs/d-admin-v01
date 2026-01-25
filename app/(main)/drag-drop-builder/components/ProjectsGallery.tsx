'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useProjectsStore } from '../store/projects-store';
import { useBuilderStore } from '../store/builder-store';
import { savePage } from '../lib/api';
import * as Tabs from '@radix-ui/react-tabs';

export function ProjectsGallery() {
  const { projects, setCurrentProject, deleteProject } = useProjectsStore();
  const { setShowProjectsGallery, triggerClearCanvas } = useBuilderStore();

  // Manage active tab state locally to control animations/styles
  const [activeTab, setActiveTab] = useState('projects');

  const handleOpenProject = (id: string) => {
    setCurrentProject(id);
    setShowProjectsGallery(false);
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
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
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex h-full flex-col min-h-0"
        >
          <div className="mb-4 flex flex-col shrink-0 border-b border-[var(--d-admin-surface-border)] pb-1 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Mobile: Single Row Layout [Back] [Tabs] [+] */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setShowProjectsGallery(false)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--d-admin-surface-section)] text-[var(--d-admin-text-color-secondary)] transition-colors hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]"
              >
                <Icon icon="lucide:arrow-left" className="size-4" />
              </button>

              <Tabs.List className="flex flex-1 items-center justify-center gap-4 overflow-x-auto no-scrollbar">
                <Tabs.Trigger
                  value="projects"
                  className="group relative pb-3 text-sm font-medium text-[var(--d-admin-text-color-secondary)] transition-colors outline-none whitespace-nowrap hover:text-[var(--d-admin-text-color)] data-[state=active]:text-[var(--d-admin-text-color)]"
                >
                  <span className="flex items-center gap-2">
                    <Icon icon="lucide:folder-open" className="size-4" />
                    Saved Projects
                  </span>
                  <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-[var(--d-admin-primary)] transition-transform duration-300 group-data-[state=active]:scale-x-100" />
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="templates"
                  className="group relative pb-3 text-sm font-medium text-[var(--d-admin-text-color-secondary)] transition-colors outline-none whitespace-nowrap hover:text-[var(--d-admin-text-color)] data-[state=active]:text-[var(--d-admin-text-color)]"
                >
                  <span className="flex items-center gap-2">
                    <Icon icon="lucide:layout-template" className="size-4" />
                    Templates
                  </span>
                  <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-[var(--d-admin-primary)] transition-transform duration-300 group-data-[state=active]:scale-x-100" />
                </Tabs.Trigger>
              </Tabs.List>

              <button
                onClick={handleCreateNew}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--d-admin-surface-section)] text-[var(--d-admin-text-color-secondary)] shadow-sm transition-colors hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]"
              >
                <Icon icon="lucide:plus" className="size-4" />
              </button>
            </div>

            {/* Desktop: Standard Layout */}
            <Tabs.List className="hidden items-center gap-8 sm:flex">
              <Tabs.Trigger
                value="projects"
                className="group relative pb-4 text-sm font-medium text-[var(--d-admin-text-color-secondary)] transition-colors outline-none whitespace-nowrap hover:text-[var(--d-admin-text-color)] data-[state=active]:text-[var(--d-admin-text-color)]"
              >
                <span className="flex items-center gap-2">
                  <Icon icon="lucide:folder-open" className="size-4" />
                  Saved Projects
                </span>
                <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-[var(--d-admin-primary)] transition-transform duration-300 group-data-[state=active]:scale-x-100" />
              </Tabs.Trigger>
              <Tabs.Trigger
                value="templates"
                className="group relative pb-4 text-sm font-medium text-[var(--d-admin-text-color-secondary)] transition-colors outline-none whitespace-nowrap hover:text-[var(--d-admin-text-color)] data-[state=active]:text-[var(--d-admin-text-color)]"
              >
                <span className="flex items-center gap-2">
                  <Icon icon="lucide:layout-template" className="size-4" />
                  Templates gallery
                </span>
                <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-[var(--d-admin-primary)] transition-transform duration-300 group-data-[state=active]:scale-x-100" />
              </Tabs.Trigger>
            </Tabs.List>

            <button
              onClick={() => setShowProjectsGallery(false)}
              className="hidden mb-0 items-center gap-2 px-3 py-1.5 text-xs font-medium text-[var(--d-admin-text-color-secondary)] transition-colors hover:text-[var(--d-admin-text-color)] sm:flex"
            >
              <Icon icon="lucide:arrow-left" className="size-3" />
              <span>Back to Editor</span>
            </button>
          </div>

          {/* Projects Content */}
          <Tabs.Content
            value="projects"
            className="animate-in fade-in slide-in-from-bottom-4 flex-1 overflow-y-auto duration-500 outline-none pr-1"
          >
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
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 rounded-lg bg-[var(--d-admin-primary)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--d-admin-primary)]/90"
                >
                  <Icon icon="lucide:plus" />
                  Start New Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* New Project Card - HIDDEN ON MOBILE */}
                <div
                  onClick={handleCreateNew}
                  className="hidden sm:flex group relative aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)]/30 transition-all duration-300 hover:border-[var(--d-admin-primary)] hover:bg-[var(--d-admin-surface-hover)]"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-[var(--d-admin-surface-ground)] transition-colors group-hover:bg-[var(--d-admin-primary)]/10">
                    <Icon
                      icon="lucide:plus"
                      className="size-6 text-[var(--d-admin-text-color)] transition-colors group-hover:text-[var(--d-admin-primary)]"
                    />
                  </div>
                  <span className="text-sm font-medium text-[var(--d-admin-text-color)] transition-colors group-hover:text-[var(--d-admin-primary)]">
                    New Blank Project
                  </span>
                </div>

                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleOpenProject(project.id)}
                    className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--d-admin-surface-border-hover)] hover:shadow-lg"
                  >
                    {/* Preview Area */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)]">
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
                          <div className="flex size-16 items-center justify-center rounded-xl bg-[var(--d-admin-surface-section)] text-2xl font-bold text-[var(--d-admin-text-color)] shadow-sm">
                            {project.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                        {project.deploymentUrl ? (
                          <a
                            href={project.deploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 rounded-full bg-[var(--d-admin-blue-600)] px-5 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-xl transition-transform hover:scale-105 hover:bg-[var(--d-admin-blue-700)] active:scale-95"
                          >
                            <Icon icon="lucide:external-link" className="size-3.5" />
                            Live Preview
                          </a>
                        ) : (
                          <button className="flex items-center gap-2 rounded-full bg-[var(--d-admin-surface-ground)] px-5 py-2 text-xs font-bold tracking-wider text-[var(--d-admin-text-color)] uppercase shadow-xl transition-transform hover:scale-105 hover:bg-[var(--d-admin-surface-hover)] active:scale-95">
                            <Icon icon="lucide:eye" className="size-3.5" />
                            Preview
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Info Area */}
                    <div className="flex items-center justify-between bg-[var(--d-admin-surface-section)] p-3 transition-colors group-hover:bg-[var(--d-admin-surface-hover)]">
                      <div className="min-w-0 pr-2">
                        <h3 className="truncate text-sm font-medium text-[var(--d-admin-text-color)]">
                          {project.name}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[var(--d-admin-text-color-secondary)]">
                          <Icon icon="lucide:clock" className="size-2.5" />
                          {new Date(project.updatedAt).toLocaleDateString()}
                          {project.deploymentUrl && (
                            <>
                              <span className="mx-1">•</span>
                              <Icon icon="lucide:globe" className="size-2.5 text-[var(--d-admin-blue-600)]" />
                              <span className="text-[var(--d-admin-blue-600)]">Deployed</span>
                            </>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          className="rounded-md p-1.5 text-[var(--d-admin-text-color-secondary)] hover:bg-[var(--d-admin-surface-ground)] hover:text-[var(--d-admin-text-color)]"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle Edit Name (TODO)
                          }}
                          title="Rename"
                        >
                          <Icon icon="lucide:pencil" className="size-3.5" />
                        </button>
                        <button
                          className="rounded-md p-1.5 text-[var(--d-admin-text-color-secondary)] hover:bg-red-500/10 hover:text-red-500"
                          onClick={(e) => handleDeleteProject(e, project.id)}
                          title="Delete Project"
                        >
                          <Icon icon="lucide:trash-2" className="size-3.5" />
                        </button>
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Static Template: Project Kickoff */}
              <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--d-admin-surface-border-hover)] hover:shadow-lg">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)]">
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="mb-1 text-2xl font-bold tracking-tight text-[var(--d-admin-text-color)] drop-shadow-sm">
                      Kickoff
                    </h3>
                    <span className="rounded-full border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)]/50 px-3 py-1 text-[10px] font-bold tracking-widest text-[var(--d-admin-text-color-secondary)] uppercase backdrop-blur-md">
                      Project Sync
                    </span>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                    <button
                      onClick={handleCreateNew}
                      className="rounded-full bg-[var(--d-admin-primary)] px-5 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-xl transition-transform hover:scale-105 hover:bg-[var(--d-admin-primary)]/90"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
                <div className="bg-[var(--d-admin-surface-section)] p-4 transition-colors group-hover:bg-[var(--d-admin-surface-hover)]">
                  <h3 className="font-medium text-[var(--d-admin-text-color)]">
                    Project Kickoff Deck
                  </h3>
                  <p className="mt-1 text-xs text-[var(--d-admin-text-color-secondary)]">
                    Perfect for internal alignment
                  </p>
                </div>
              </div>

              {/* Static Template: Brainstorming */}
              <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--d-admin-surface-border-hover)] hover:shadow-lg">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)]">
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                    <Icon
                      icon="lucide:lightbulb"
                      className="mb-2 size-12 text-[var(--d-admin-text-color-secondary)]"
                    />
                    <h3 className="text-xl font-bold text-[var(--d-admin-text-color)] drop-shadow-sm">
                      Brainstorming
                    </h3>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                    <button
                      onClick={handleCreateNew}
                      className="rounded-full bg-[var(--d-admin-primary)] px-5 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-xl transition-transform hover:scale-105 hover:bg-[var(--d-admin-primary)]/90"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
                <div className="bg-[var(--d-admin-surface-section)] p-4 transition-colors group-hover:bg-[var(--d-admin-surface-hover)]">
                  <h3 className="font-medium text-[var(--d-admin-text-color)]">
                    6 Thinking Hats
                  </h3>
                  <p className="mt-1 text-xs text-[var(--d-admin-text-color-secondary)]">
                    Structured creative thinking
                  </p>
                </div>
              </div>

              {/* Static Template: Portfolio */}
              <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--d-admin-surface-border-hover)] hover:shadow-lg">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)]">
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-2 flex -space-x-4">
                      <div className="size-8 rounded-full border-2 border-[var(--d-admin-surface-ground)] bg-red-400"></div>
                      <div className="relative -top-2 size-8 rounded-full border-2 border-[var(--d-admin-surface-ground)] bg-yellow-400"></div>
                      <div className="size-8 rounded-full border-2 border-[var(--d-admin-surface-ground)] bg-blue-400"></div>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--d-admin-text-color)]">Portfolio</h3>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                    <button
                      onClick={handleCreateNew}
                      className="rounded-full bg-[var(--d-admin-primary)] px-5 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-xl transition-transform hover:scale-105 hover:bg-[var(--d-admin-primary)]/90"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
                <div className="bg-[var(--d-admin-surface-section)] p-4 transition-colors group-hover:bg-[var(--d-admin-surface-hover)]">
                  <h3 className="font-medium text-[var(--d-admin-text-color)]">
                    Visual Portfolio
                  </h3>
                  <p className="mt-1 text-xs text-[var(--d-admin-text-color-secondary)]">
                    Showcase your work
                  </p>
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
