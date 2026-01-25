'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useProjectsStore } from '../../../ai-website-builder/store/projects-store';
import { useAiBuilderStore } from '../../../ai-website-builder/store/ai-builder-store';
import { useDragDropStore } from '../lib/drag-drop-store';
import * as Tabs from '@radix-ui/react-tabs';

export function ProjectsGallery() {
  const { projects, setCurrentProject, deleteProject } = useProjectsStore();
  const { setShowProjectsGallery } = useDragDropStore();

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
    setCurrentProject(null);
    setShowProjectsGallery(false);
  };

  return (
    <div className="animate-in fade-in fixed inset-0 top-[var(--header-height)] z-50 flex flex-col bg-black/80 backdrop-blur-xl duration-300">
      {/* Background Gradients for Atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-violet-600/20 mix-blend-screen blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-blue-600/20 mix-blend-screen blur-[120px]" />
      </div>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-8 py-10">
        {/* Header Section */}
        <div className="mb-10 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-violet-400 uppercase">
              <Icon icon="lucide:sparkles" className="size-3" />
              <span>Creative Workspace</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--d-admin-text-color)]">
              Welcome back
            </h1>
          </div>

          <button
            onClick={() => setShowProjectsGallery(false)}
            className="group flex items-center gap-2 rounded-full border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)]/5 px-4 py-2 text-sm text-gray-400 transition-all hover:border-[var(--d-admin-surface-border)]/20 hover:bg-white/10 hover:text-white"
          >
            <span>Close Gallery</span>
            <div className="rounded-full bg-[var(--d-admin-surface-section)] p-1 transition-colors group-hover:bg-[var(--d-admin-surface-hover)]">
              <Icon icon="lucide:x" className="size-3" />
            </div>
          </button>
        </div>

        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-1 flex-col"
        >
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-1">
            <Tabs.List className="flex items-center gap-8">
              <Tabs.Trigger
                value="projects"
                className="group relative pb-4 text-sm font-medium text-[var(--d-admin-text-color-secondary)] transition-colors outline-none hover:text-[var(--d-admin-text-color)] data-[state=active]:text-[var(--d-admin-text-color)]"
              >
                <span className="flex items-center gap-2">
                  <Icon icon="lucide:folder-open" className="size-4" />
                  My Projects
                </span>
                <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
              </Tabs.Trigger>
              <Tabs.Trigger
                value="templates"
                className="group relative pb-4 text-sm font-medium text-[var(--d-admin-text-color-secondary)] transition-colors outline-none hover:text-[var(--d-admin-text-color)] data-[state=active]:text-[var(--d-admin-text-color)]"
              >
                <span className="flex items-center gap-2">
                  <Icon icon="lucide:layout-template" className="size-4" />
                  Templates gallery
                </span>
                <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-gradient-to-r from-pink-500 to-rose-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
              </Tabs.Trigger>
            </Tabs.List>

            <div className="pb-2">
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 rounded-lg bg-[var(--d-admin-surface-ground)] px-5 py-2.5 text-sm font-bold text-[var(--d-admin-text-color)] shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all hover:bg-gray-100 active:scale-95"
              >
                <Icon icon="lucide:plus" className="size-4" />
                Create New
              </button>
            </div>
          </div>

          {/* Projects Content */}
          <Tabs.Content
            value="projects"
            className="animate-in fade-in slide-in-from-bottom-4 flex-1 duration-500 outline-none"
          >
            {projects.length === 0 ? (
              <div className="mx-auto flex h-[50vh] max-w-2xl flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)]/5">
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-500/20 to-blue-500/20">
                  <Icon
                    icon="lucide:package-open"
                    className="size-8 text-violet-400"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-[var(--d-admin-text-color)]">
                  No projects yet
                </h3>
                <p className="mb-8 max-w-sm text-center text-[var(--d-admin-text-color)]">
                  Start fresh with a blank canvas or choose a template to
                  kickstart your next big idea.
                </p>
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-500"
                >
                  <Icon icon="lucide:plus" />
                  Start New Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* New Project Card */}
                <div
                  onClick={handleCreateNew}
                  className="group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[var(--d-admin-surface-border)] transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/5"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-[var(--d-admin-surface-ground)]/5 transition-colors group-hover:bg-violet-500/20">
                    <Icon
                      icon="lucide:plus"
                      className="size-6 text-[var(--d-admin-text-color)] transition-colors group-hover:text-violet-400"
                    />
                  </div>
                  <span className="text-sm font-medium text-[var(--d-admin-text-color)] transition-colors group-hover:text-violet-300">
                    New Blank Project
                  </span>
                </div>

                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleOpenProject(project.id)}
                    className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)]"
                  >
                    {/* Preview Area */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/5 bg-gradient-to-br from-gray-800 to-gray-900 transition-colors group-hover:border-violet-500/20">
                      {/* Decorative Pattern */}
                      <div className="absolute inset-0 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--d-admin-surface-ground)]">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt={project.name}
                            className="h-full w-full object-cover object-top opacity-90 transition-opacity group-hover:opacity-100"
                          />
                        ) : (
                          <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl font-bold text-white shadow-lg">
                            {project.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                        <button className="rounded-full bg-[var(--d-admin-surface-ground)] px-5 py-2 text-xs font-bold tracking-wider text-[var(--d-admin-text-color)] uppercase shadow-xl transition-transform hover:scale-105 hover:bg-[var(--d-admin-surface-ground)]/50 active:scale-95">
                          Open Editor
                        </button>
                      </div>

                      <div className="absolute top-3 right-3 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <button
                          className="rounded-lg border border-red-500/50 bg-red-500/20 p-2 text-red-200 transition-all hover:bg-red-500 hover:text-white"
                          onClick={(e) => handleDeleteProject(e, project.id)}
                          title="Delete Project"
                        >
                          <Icon icon="lucide:trash-2" className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Info Area */}
                    <div className="flex flex-1 flex-col justify-between bg-[var(--d-admin-surface-ground)]/5 p-4 transition-colors group-hover:bg-white/[0.07]">
                      <div>
                        <h3 className="truncate pr-4 text-lg font-medium text-[var(--d-admin-text-color)]">
                          {project.name}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--d-admin-text-color)]">
                          <Icon icon="lucide:clock" className="size-3" />
                          Edited{' '}
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
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
            className="animate-in fade-in slide-in-from-bottom-4 flex-1 duration-500 outline-none"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Static Template: Project Kickoff */}
              <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/50 hover:shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)]">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-white/5 bg-gradient-to-br from-indigo-900 to-purple-900">
                  <div className="absolute inset-0 animate-[pulse_8s_ease-in-out_infinite] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30" />
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="mb-1 text-2xl font-bold tracking-tight text-white drop-shadow-lg">
                      Kickoff
                    </h3>
                    <span className="rounded-full border border-white/10 bg-[var(--d-admin-surface-ground)]/20 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                      Project Sync
                    </span>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                    <button
                      onClick={handleCreateNew}
                      className="rounded-full bg-pink-500 px-5 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-xl transition-transform hover:scale-105 hover:bg-pink-600"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
                <div className="bg-[var(--d-admin-surface-ground)]/5 p-4 transition-colors group-hover:bg-white/[0.07]">
                  <h3 className="font-medium text-[var(--d-admin-text-color)]">
                    Project Kickoff Deck
                  </h3>
                  <p className="mt-1 text-xs text-[var(--d-admin-text-color)]">
                    Perfect for internal alignment
                  </p>
                </div>
              </div>

              {/* Static Template: Brainstorming */}
              <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-white/5 bg-gradient-to-br from-zinc-900 to-black">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent" />
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                    <Icon
                      icon="lucide:lightbulb"
                      className="mb-2 size-12 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                    />
                    <h3 className="text-xl font-bold text-white drop-shadow-md">
                      Brainstorming
                    </h3>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                    <button
                      onClick={handleCreateNew}
                      className="rounded-full bg-emerald-500 px-5 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-xl transition-transform hover:scale-105 hover:bg-emerald-600"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
                <div className="bg-[var(--d-admin-surface-ground)]/5 p-4 transition-colors group-hover:bg-white/[0.07]">
                  <h3 className="font-medium text-[var(--d-admin-text-color)]">
                    6 Thinking Hats
                  </h3>
                  <p className="mt-1 text-xs text-[var(--d-admin-text-color)]">
                    Structured creative thinking
                  </p>
                </div>
              </div>

              {/* Static Template: Portfolio */}
              <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)]">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-white/5 bg-gradient-to-tr from-gray-800 to-slate-800">
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-2 flex -space-x-4">
                      <div className="size-8 rounded-full border-2 border-gray-800 bg-red-400"></div>
                      <div className="relative -top-2 size-8 rounded-full border-2 border-gray-800 bg-yellow-400"></div>
                      <div className="size-8 rounded-full border-2 border-gray-800 bg-blue-400"></div>
                    </div>
                    <h3 className="text-xl font-bold text-white">Portfolio</h3>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                    <button
                      onClick={handleCreateNew}
                      className="rounded-full bg-orange-500 px-5 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-xl transition-transform hover:scale-105 hover:bg-orange-600"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
                <div className="bg-[var(--d-admin-surface-ground)]/5 p-4 transition-colors group-hover:bg-white/[0.07]">
                  <h3 className="font-medium text-[var(--d-admin-text-color)]">
                    Visual Portfolio
                  </h3>
                  <p className="mt-1 text-xs text-[var(--d-admin-text-color)]">
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
