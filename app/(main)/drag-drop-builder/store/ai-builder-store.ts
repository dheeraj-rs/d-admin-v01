import { create } from 'zustand';

interface AiBuilderStore {
  activeMobilePanel: 'chat' | 'workbench';
  setActiveMobilePanel: (panel: 'chat' | 'workbench') => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (isOpen: boolean) => void;
  builderView: 'chat' | 'drag-drop' | 'templates';
  setBuilderView: (view: 'chat' | 'drag-drop' | 'templates') => void;
}

export const useAiBuilderStore = create<AiBuilderStore>((set) => ({
  activeMobilePanel: 'chat',
  setActiveMobilePanel: (panel) => set({ activeMobilePanel: panel }),
  isHistoryOpen: false,
  setIsHistoryOpen: (isOpen) => set({ isHistoryOpen: isOpen }),
  builderView: 'chat',
  setBuilderView: (view) => set({ builderView: view }),
}));
