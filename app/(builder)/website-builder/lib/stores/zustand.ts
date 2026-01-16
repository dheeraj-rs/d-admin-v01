import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export type ModelProvider = 'anthropic' | 'google' | 'openai';
export type Theme = 'dark' | 'light';

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

// ============================================================================
// THEME STORE
// ============================================================================

export const DEFAULT_THEME: Theme = 'dark';

function getThemeFromCookie(): Theme | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const themeCookie = cookies.find((c) =>
        c.trim().startsWith('d-admin-theme=')
    );

    if (themeCookie) {
        try {
            const value = themeCookie.split('=')[1];
            const decoded = decodeURIComponent(value);
            const parsed = JSON.parse(decoded);

            // Check if theme name contains 'dark'
            if (parsed.theme && typeof parsed.theme === 'string') {
                return parsed.theme.includes('dark') ? 'dark' : 'light';
            }

            // Check colorScheme property
            if (parsed.colorScheme) {
                return parsed.colorScheme as Theme;
            }
        } catch (e) {
            console.error('Error parsing theme cookie:', e);
        }
    }

    return null;
}

function initTheme(): Theme {
    if (typeof window !== 'undefined') {
        // First try to get theme from cookie
        const cookieTheme = getThemeFromCookie();
        if (cookieTheme) {
            // Set dark class immediately
            if (cookieTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return cookieTheme;
        }

        // Fallback to color-scheme CSS property
        const colorScheme = getComputedStyle(document.documentElement)
            .getPropertyValue('color-scheme')
            .trim();

        if (colorScheme === 'dark' || colorScheme === 'light') {
            if (colorScheme === 'dark') {
                document.documentElement.classList.add('dark');
            }
            return colorScheme as Theme;
        }
    }

    return DEFAULT_THEME;
}

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    syncThemeFromMainApp: () => void;
}

export const useThemeStore = create<ThemeState>()(
    devtools(
        (set, get) => ({
            theme: initTheme(),

            setTheme: (theme) => {
                set({ theme });

                // Update HTML class for Tailwind dark mode
                if (typeof document !== 'undefined') {
                    if (theme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            },

            syncThemeFromMainApp: () => {
                if (typeof window === 'undefined') return;

                // First check cookie
                const cookieTheme = getThemeFromCookie();
                if (cookieTheme && cookieTheme !== get().theme) {
                    get().setTheme(cookieTheme);
                    return;
                }

                // Then check CSS property
                const colorScheme = getComputedStyle(document.documentElement)
                    .getPropertyValue('color-scheme')
                    .trim();

                if ((colorScheme === 'dark' || colorScheme === 'light') && colorScheme !== get().theme) {
                    get().setTheme(colorScheme as Theme);
                }
            },
        }),
        { name: 'ThemeStore' }
    )
);

// Helper function
export function themeIsDark() {
    return useThemeStore.getState().theme === 'dark';
}

// Start theme sync interval
if (typeof window !== 'undefined') {
    setInterval(() => {
        useThemeStore.getState().syncThemeFromMainApp();
    }, 100);

    // Also set up MutationObserver for immediate updates
    const observer = new MutationObserver(() => {
        useThemeStore.getState().syncThemeFromMainApp();
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style'],
    });
}
