import { create } from 'zustand';

interface AiBuilderStore {
    activeMobilePanel: 'chat' | 'workbench';
    setActiveMobilePanel: (panel: 'chat' | 'workbench') => void;
}

export const useAiBuilderStore = create<AiBuilderStore>((set) => ({
    activeMobilePanel: 'chat',
    setActiveMobilePanel: (panel) => set({ activeMobilePanel: panel }),
}));
