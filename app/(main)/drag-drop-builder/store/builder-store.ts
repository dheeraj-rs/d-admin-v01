import { create } from 'zustand';
import { Component, ComponentWithCategories, Theme } from '../types';
import { loadTheme } from '../lib/api';

export const THEMES: Theme[] = [
  { name: 'Hyper UI', folder: 'hyperui' },
  { name: 'Tailblocks', folder: 'tailblocks' },
  { name: 'Flowrift', folder: 'flowrift' },
  { name: 'Meraki UI', folder: 'meraki-light' },
  { name: 'Preline', folder: 'preline' },
  { name: 'Flowbite', folder: 'flowbite' },
];

interface DragDropState {
  // Content state
  themeIndex: number;
  components: ComponentWithCategories;
  error: string | null;

  // View state
  isPreview: boolean;
  showMobileSidebar: boolean;
  showReorderModal: boolean;

  // Actions
  toggleMobileSidebar: () => void;
  setMobileSidebar: (v: boolean) => void;

  // Canvas State for Sidebar Indicators
  // Sidebar View State
  sidebarView: 'components' | 'layers';
  toggleSidebarView: () => void;
  setSidebarView: (view: 'components' | 'layers') => void;

  // Layers / Reorder State
  activeLayers: HTMLElement[];
  setActiveLayers: (layers: HTMLElement[]) => void;
  reorderTrigger: number;
  triggerReorder: () => void;
}

export const useBuilderStore = create<DragDropState>((set, get) => ({
  themeIndex: 0,
  components: {},
  error: null,
  
  canvasComponents: {},
  setCanvasComponents: (map) => set({ canvasComponents: map }),

  sidebarView: 'components',
  toggleSidebarView: () => set((state) => ({ sidebarView: state.sidebarView === 'components' ? 'layers' : 'components' })),
  setSidebarView: (view) => set({ sidebarView: view }),

  activeLayers: [],
  setActiveLayers: (layers) => set({ activeLayers: layers }),
  reorderTrigger: 0,
  triggerReorder: () => set((state) => ({ reorderTrigger: state.reorderTrigger + 1 })),

  isPreview: false,
  showReorderModal: false,

  pendingAddComponent: null,
  headerAction: null,
  clearCanvasTrigger: 0,

  selectedElement: null,
  showImageDialog: false,
  showButtonDialog: false,
  showLinkDialog: false,
  showSvgDialog: false,
  showExportDialog: false,
  showPublishDialog: false,
  showSaveDialog: false,
  showProjectsGallery: false,

  setThemeIndex: (index) => set({ themeIndex: index }),
  setComponents: (components) => set({ components }),
  setError: (error) => set({ error }),
  setIsPreview: (v) => set({ isPreview: v }),
  setShowReorderModal: (v) => set({ showReorderModal: v }),

  setPendingAddComponent: (c) => set({ pendingAddComponent: c }),
  setHeaderAction: (action) => set({ headerAction: action }),
  triggerClearCanvas: () =>
    set((state) => ({ clearCanvasTrigger: state.clearCanvasTrigger + 1 })),

  setSelectedElement: (el) => set({ selectedElement: el }),

  setShowImageDialog: (v) => set({ showImageDialog: v }),
  setShowButtonDialog: (v) => set({ showButtonDialog: v }),
  setShowLinkDialog: (v) => set({ showLinkDialog: v }),
  setShowSvgDialog: (v) => set({ showSvgDialog: v }),
  setShowExportDialog: (v) => set({ showExportDialog: v }),
  setShowPublishDialog: (v) => set({ showPublishDialog: v }),
  setShowSaveDialog: (v) => set({ showSaveDialog: v }),
  setShowProjectsGallery: (v: boolean) => set({ showProjectsGallery: v }),

  closeAllDialogs: () =>
    set({
      showImageDialog: false,
      showButtonDialog: false,
      showLinkDialog: false,
      showSvgDialog: false,
      showExportDialog: false,
      showPublishDialog: false,
      showSaveDialog: false,
      showProjectsGallery: false,
      showReorderModal: false,
    }),

  loadThemeComponents: async (index: number, standaloneServer?: boolean) => {
    try {
      const componentsList = await loadTheme(
        THEMES[index].folder,
        standaloneServer ?? false,
      );

      if (!Array.isArray(componentsList)) {
        set({ error: JSON.stringify(componentsList, null, 2) });
        return;
      }
      set({ error: null });

      const components = componentsList.reduce(
        (r: ComponentWithCategories, c: Component) => {
          const category = c.folder.replace(/[0-9]/g, '');
          if (!r[category]) r[category] = [];
          r[category].push(c);
          return r;
        },
        {},
      );

      set({ components });
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  showMobileSidebar: false,
  toggleMobileSidebar: () =>
    set((state) => ({ showMobileSidebar: !state.showMobileSidebar })),
  setMobileSidebar: (v) => set({ showMobileSidebar: v }),
}));
