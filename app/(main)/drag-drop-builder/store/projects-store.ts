import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  description?: string;
  html: string;
  updatedAt: number;
  thumbnail?: string;
  category?: string;
  deploymentUrl?: string;
}

export interface Template {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  isTeam?: boolean;
  thumbnail: string;
  video?: string;
  category: string;
  likes: string;
  views: string;
  html?: string; // Template HTML content
  deploymentUrl?: string; // Live URL for the template
}

interface ProjectsState {
  projects: Project[];
  currentProjectId: string | null;
  templates: Template[];

  // Actions
  saveProject: (project: Omit<Project, 'updatedAt'>) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setCurrentProject: (id: string | null) => void;
  getProject: (id: string) => Project | undefined;
  addTemplate: (template: Template) => void;
  deleteTemplate: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,

      saveProject: (projectData) => {
        const now = Date.now();
        set((state) => {
          const existingIndex = state.projects.findIndex(
            (p) => p.id === projectData.id,
          );
          if (existingIndex >= 0) {
            // Update existing
            const updatedProjects = [...state.projects];
            updatedProjects[existingIndex] = { ...projectData, updatedAt: now };
            return { projects: updatedProjects };
          } else {
            // Add new
            return {
              projects: [...state.projects, { ...projectData, updatedAt: now }],
            };
          }
        });
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      setCurrentProject: (id) => set({ currentProjectId: id }),

      getProject: (id) => get().projects.find((p) => p.id === id),

      // Templates (user-created only)
      templates: [],

      addTemplate: (template) => set((state) => ({ templates: [...state.templates, template] })),

      deleteTemplate: (id) => set((state) => ({
        templates: state.templates.filter((t) => t.id !== id),
      })),

      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map((p) => p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p)
      })),
    }),
    {
      name: 'd-admin-projects-storage',
      version: 1, // Increment this to force clear old data
      migrate: (persistedState: any, version: number) => {
        // If migrating from version 0 (old data), clear templates
        if (version === 0) {
          return {
            ...persistedState,
            templates: [], // Clear old dummy templates
          };
        }
        return persistedState;
      },
    },
  ),
);
