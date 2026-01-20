'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useProjectsStore } from '../../store/projects-store';
import { useAiBuilderStore } from '../../store/ai-builder-store';
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
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 top-[var(--header-height)]">
            {/* Background Gradients for Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="w-full max-w-[1400px] mx-auto px-8 py-10 flex-1 flex flex-col">
                {/* Header Section */}
                <div className="flex items-end justify-between mb-10">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-violet-400 font-medium tracking-wide text-xs uppercase">
                            <Icon icon="lucide:sparkles" className="size-3" />
                            <span>Creative Workspace</span>
                        </div>
                        <h1 className="text-4xl font-bold text-[var(--d-admin-text-color)] tracking-tight">
                            Welcome back
                        </h1>
                    </div>

                    <button
                        onClick={() => setShowProjectsGallery(false)}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--d-admin-surface-border)] hover:border-[var(--d-admin-surface-border)]/20 bg-[var(--d-admin-surface-ground)]/5 hover:bg-white/10 transition-all text-sm text-gray-400 hover:text-white"
                    >
                        <span>Close Gallery</span>
                        <div className="bg-[var(--d-admin-surface-section)] group-hover:bg-[var(--d-admin-surface-hover)] p-1 rounded-full transition-colors">
                            <Icon icon="lucide:x" className="size-3" />
                        </div>
                    </button>
                </div>

                <Tabs.Root
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex flex-col flex-1"
                >
                    <div className="flex items-center justify-between border-b border-white/10 mb-8 pb-1">
                        <Tabs.List className="flex items-center gap-8">
                            <Tabs.Trigger
                                value="projects"
                                className="relative pb-4 text-sm font-medium text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] transition-colors outline-none data-[state=active]:text-[var(--d-admin-text-color)] group"
                            >
                                <span className="flex items-center gap-2">
                                    <Icon icon="lucide:folder-open" className="size-4" />
                                    My Projects
                                </span>
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-blue-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300" />
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                value="templates"
                                className="relative pb-4 text-sm font-medium text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] transition-colors outline-none data-[state=active]:text-[var(--d-admin-text-color)] group"
                            >
                                <span className="flex items-center gap-2">
                                    <Icon icon="lucide:layout-template" className="size-4" />
                                    Templates gallery
                                </span>
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 to-rose-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300" />
                            </Tabs.Trigger>
                        </Tabs.List>

                        <div className="pb-2">
                            <button
                                onClick={handleCreateNew}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--d-admin-surface-ground)] text-[var(--d-admin-text-color)] text-sm font-bold rounded-lg hover:bg-gray-100 active:scale-95 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                            >
                                <Icon icon="lucide:plus" className="size-4" />
                                Create New
                            </button>
                        </div>
                    </div>

                    {/* Projects Content */}
                    <Tabs.Content value="projects" className="flex-1 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {projects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[50vh] border-2 border-dashed border-[var(--d-admin-surface-border)] rounded-2xl bg-[var(--d-admin-surface-ground)]/5 mx-auto max-w-2xl">
                                <div className="size-16 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-blue-500/20 flex items-center justify-center mb-6">
                                    <Icon icon="lucide:package-open" className="size-8 text-violet-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-[var(--d-admin-text-color)] mb-2">No projects yet</h3>
                                <p className="text-[var(--d-admin-text-color)] text-center max-w-sm mb-8">
                                    Start fresh with a blank canvas or choose a template to kickstart your next big idea.
                                </p>
                                <button
                                    onClick={handleCreateNew}
                                    className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Icon icon="lucide:plus" />
                                    Start New Project
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {/* New Project Card */}
                                <div
                                    onClick={handleCreateNew}
                                    className="group relative aspect-[4/3] rounded-2xl border-2 border-dashed border-[var(--d-admin-surface-border)] hover:border-violet-500/50 hover:bg-violet-500/5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4"
                                >
                                    <div className="size-12 rounded-full bg-[var(--d-admin-surface-ground)]/5 group-hover:bg-violet-500/20 flex items-center justify-center transition-colors">
                                        <Icon icon="lucide:plus" className="size-6 text-[var(--d-admin-text-color)] group-hover:text-violet-400 transition-colors" />
                                    </div>
                                    <span className="text-sm font-medium text-[var(--d-admin-text-color)] group-hover:text-violet-300 transition-colors">New Blank Project</span>
                                </div>

                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        onClick={() => handleOpenProject(project.id)}
                                        className="group relative flex flex-col bg-[var(--d-admin-surface-card)] backdrop-blur-sm border border-[var(--d-admin-surface-border)] hover:border-violet-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)] hover:-translate-y-1"
                                    >
                                        {/* Preview Area */}
                                        <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-gray-800 to-gray-900 border-b border-white/5 overflow-hidden group-hover:border-violet-500/20 transition-colors">
                                            {/* Decorative Pattern */}
                                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]" />

                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="size-16 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg flex items-center justify-center text-white text-2xl font-bold">
                                                    {project.name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                <button className="px-5 py-2 bg-[var(--d-admin-surface-ground)] text-[var(--d-admin-text-color)] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 transition-transform hover:scale-105 active:scale-95 shadow-xl">
                                                    Open Editor
                                                </button>
                                            </div>

                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                                <button
                                                    className="p-2 bg-red-500/20 hover:bg-red-500 border border-red-500/50 text-red-200 hover:text-white rounded-lg transition-all"
                                                    onClick={(e) => handleDeleteProject(e, project.id)}
                                                    title="Delete Project"
                                                >
                                                    <Icon icon="lucide:trash-2" className="size-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Info Area */}
                                        <div className="p-4 bg-[var(--d-admin-surface-ground)]/5 group-hover:bg-white/[0.07] transition-colors flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-[var(--d-admin-text-color)] font-medium truncate pr-4 text-lg">{project.name}</h3>
                                                <p className="text-xs text-[var(--d-admin-text-color)] mt-1 flex items-center gap-1.5">
                                                    <Icon icon="lucide:clock" className="size-3" />
                                                    Edited {new Date(project.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Tabs.Content>

                    {/* Templates Content */}
                    <Tabs.Content value="templates" className="flex-1 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Static Template: Project Kickoff */}
                            <div className="group relative flex flex-col bg-[var(--d-admin-surface-card)] backdrop-blur-sm border border-[var(--d-admin-surface-border)] hover:border-pink-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)] hover:-translate-y-1">
                                <div className="relative aspect-[16/9] bg-gradient-to-br from-indigo-900 to-purple-900 border-b border-white/5 overflow-hidden">
                                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-[pulse_8s_ease-in-out_infinite]" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                        <h3 className="text-white font-bold text-2xl mb-1 tracking-tight drop-shadow-lg">Kickoff</h3>
                                        <span className="px-3 py-1 bg-[var(--d-admin-surface-ground)]/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase text-white tracking-widest border border-white/10">Project Sync</span>
                                    </div>
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px] z-20">
                                        <button onClick={handleCreateNew} className="px-5 py-2 bg-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-pink-600 transition-transform hover:scale-105 shadow-xl">
                                            Use Template
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 bg-[var(--d-admin-surface-ground)]/5 group-hover:bg-white/[0.07] transition-colors">
                                    <h3 className="text-[var(--d-admin-text-color)] font-medium">Project Kickoff Deck</h3>
                                    <p className="text-xs text-[var(--d-admin-text-color)] mt-1">Perfect for internal alignment</p>
                                </div>
                            </div>

                            {/* Static Template: Brainstorming */}
                            <div className="group relative flex flex-col bg-[var(--d-admin-surface-card)] backdrop-blur-sm border border-[var(--d-admin-surface-border)] hover:border-emerald-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] hover:-translate-y-1">
                                <div className="relative aspect-[16/9] bg-gradient-to-br from-zinc-900 to-black border-b border-white/5 overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                        <Icon icon="lucide:lightbulb" className="size-12 text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                                        <h3 className="text-white font-bold text-xl drop-shadow-md">Brainstorming</h3>
                                    </div>
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px] z-20">
                                        <button onClick={handleCreateNew} className="px-5 py-2 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-emerald-600 transition-transform hover:scale-105 shadow-xl">
                                            Use Template
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 bg-[var(--d-admin-surface-ground)]/5 group-hover:bg-white/[0.07] transition-colors">
                                    <h3 className="text-[var(--d-admin-text-color)] font-medium">6 Thinking Hats</h3>
                                    <p className="text-xs text-[var(--d-admin-text-color)] mt-1">Structured creative thinking</p>
                                </div>
                            </div>

                            {/* Static Template: Portfolio */}
                            <div className="group relative flex flex-col bg-[var(--d-admin-surface-card)] backdrop-blur-sm border border-[var(--d-admin-surface-border)] hover:border-orange-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)] hover:-translate-y-1">
                                <div className="relative aspect-[16/9] bg-gradient-to-tr from-gray-800 to-slate-800 border-b border-white/5 overflow-hidden">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                        <div className="flex -space-x-4 mb-2">
                                            <div className="size-8 rounded-full bg-red-400 border-2 border-gray-800"></div>
                                            <div className="size-8 rounded-full bg-yellow-400 border-2 border-gray-800 relative -top-2"></div>
                                            <div className="size-8 rounded-full bg-blue-400 border-2 border-gray-800"></div>
                                        </div>
                                        <h3 className="text-white font-bold text-xl">Portfolio</h3>
                                    </div>
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px] z-20">
                                        <button onClick={handleCreateNew} className="px-5 py-2 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-orange-600 transition-transform hover:scale-105 shadow-xl">
                                            Use Template
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 bg-[var(--d-admin-surface-ground)]/5 group-hover:bg-white/[0.07] transition-colors">
                                    <h3 className="text-[var(--d-admin-text-color)] font-medium">Visual Portfolio</h3>
                                    <p className="text-xs text-[var(--d-admin-text-color)] mt-1">Showcase your work</p>
                                </div>
                            </div>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );
}
