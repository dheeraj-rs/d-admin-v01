import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  description?: string;
  html: string;
  updatedAt: number;
  thumbnail?: string;
  category?: 'custom' | 'template';
  deploymentUrl?: string;
}

interface ProjectsState {
  projects: Project[];
  currentProjectId: string | null;

  // Actions
  saveProject: (project: Omit<Project, 'updatedAt'>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  getProject: (id: string) => Project | undefined;
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
    }),
    {
      name: 'd-admin-projects-storage',
    },
  ),
);
