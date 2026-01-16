import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export type ModelProvider = 'anthropic' | 'google' | 'openai';

// ============================================================================
// CHAT STORE
// ============================================================================

interface ChatState {
    started: boolean;
    aborted: boolean;
    showChat: boolean;
    showHistory: boolean;
    selectedProvider: ModelProvider;

    // Actions
    setStarted: (started: boolean) => void;
    setAborted: (aborted: boolean) => void;
    setShowChat: (show: boolean) => void;
    setShowHistory: (show: boolean) => void;
    setSelectedProvider: (provider: ModelProvider) => void;
}

export const useChatStore = create<ChatState>()(
    devtools(
        (set) => ({
            // Initial state - matches nanostores exactly
            started: false,
            aborted: false,
            showChat: true,
            showHistory: false,
            selectedProvider: 'google',

            // Actions - simple setters
            setStarted: (started) => set({ started }),
            setAborted: (aborted) => set({ aborted }),
            setShowChat: (show) => set({ showChat: show }),
            setShowHistory: (show) => set({ showHistory: show }),
            setSelectedProvider: (provider) => set({ selectedProvider: provider }),
        }),
        { name: 'ChatStore' }
    )
);
