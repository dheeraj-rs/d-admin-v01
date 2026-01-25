import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import type { ITerminal } from '../../types/terminal';
import type { PreviewInfo } from './previews';
import { newShellProcess } from '../../utils/shell';
import { coloredText } from '../../utils/terminal';
import { webcontainer } from '../webcontainer';

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
  chatId: string | undefined;
  description: string | undefined;
  pendingFix: boolean;
  pendingErrorLog: string | undefined;
  historyReloadTrigger: number;

  // Actions
  setStarted: (started: boolean) => void;
  setAborted: (aborted: boolean) => void;
  setShowChat: (show: boolean) => void;
  setShowHistory: (show: boolean) => void;
  setSelectedProvider: (provider: ModelProvider) => void;
  setChatId: (id: string | undefined) => void;
  setDescription: (desc: string | undefined) => void;
  setPendingFix: (pending: boolean) => void;
  setPendingErrorLog: (log: string | undefined) => void;
  triggerHistoryReload: () => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      started: false,
      aborted: false,
      showChat: true,
      showHistory: false,
      selectedProvider: 'google',
      chatId: undefined,
      description: undefined,
      pendingFix: false,
      pendingErrorLog: undefined,

      // Actions - simple setters
      setStarted: (started) => set({ started }),
      setAborted: (aborted) => set({ aborted }),
      setShowChat: (show) => set({ showChat: show }),
      setShowHistory: (show) => set({ showHistory: show }),
      setSelectedProvider: (provider) => set({ selectedProvider: provider }),
      setChatId: (id) => set({ chatId: id }),
      setDescription: (desc) => set({ description: desc }),
      setPendingFix: (pending) => set({ pendingFix: pending }),
      setPendingErrorLog: (log) => set({ pendingErrorLog: log }),
      
      // History refresh trigger
      historyReloadTrigger: 0,
      triggerHistoryReload: () => set((state) => ({ historyReloadTrigger: state.historyReloadTrigger + 1 })),
    }),
    { name: 'ChatStore' },
  ),
);

// ============================================================================
// THEME STORE
// ============================================================================

export const DEFAULT_THEME: Theme = 'dark';

function getThemeFromCookie(): Theme | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const themeCookie = cookies.find((c) =>
    c.trim().startsWith('d-admin-theme='),
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

        if (
          (colorScheme === 'dark' || colorScheme === 'light') &&
          colorScheme !== get().theme
        ) {
          get().setTheme(colorScheme as Theme);
        }
      },
    }),
    { name: 'ThemeStore' },
  ),
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

// ============================================================================
// PREVIEW STORE
// ============================================================================

interface PreviewState {
  activePreviewIndex: number;
  url: string;
  iframeUrl: string | undefined;
  previews: PreviewInfo[];
  refreshTrigger: number;

  setActivePreviewIndex: (index: number) => void;
  setUrl: (url: string) => void;
  setIframeUrl: (url: string | undefined) => void;
  setPreviews: (previews: PreviewInfo[]) => void;
  refreshPreview: () => void;
  reset: () => void;
}

export const usePreviewStore = create<PreviewState>()(
  devtools(
    (set) => ({
      activePreviewIndex: 0,
      url: '',
      iframeUrl: undefined,
      previews: [],
      refreshTrigger: 0,

      setActivePreviewIndex: (index) => set({ activePreviewIndex: index }),
      setUrl: (url) => set({ url }),
      setIframeUrl: (url) => set({ iframeUrl: url }),
      setPreviews: (previews) => set({ previews }),
      refreshPreview: () =>
        set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
      reset: () =>
        set({
          activePreviewIndex: 0,
          url: '',
          iframeUrl: undefined,
          previews: [],
          refreshTrigger: 0,
        }),
    }),
    { name: 'PreviewStore' },
  ),
);

// ============================================================================
// SETTINGS STORE
// ============================================================================

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  ctrlOrMetaKey?: boolean;
  action: () => void;
}

export interface Shortcuts {
  toggleTerminal: Shortcut;
}

interface SettingsState {
  shortcuts: Shortcuts;
  setShortcuts: (shortcuts: Shortcuts) => void;
}

// We'll initialize this with a placeholder and update it after terminal store is created
export const useSettingsStore = create<SettingsState>()(
  devtools(
    (set) => ({
      shortcuts: {
        toggleTerminal: {
          key: 'j',
          ctrlOrMetaKey: true,
          action: () => {
            // This will be updated to call useTerminalStore.getState().toggleTerminal()
            console.log('Toggle terminal');
          },
        },
      },
      setShortcuts: (shortcuts) => set({ shortcuts }),
    }),
    { name: 'SettingsStore' },
  ),
);

// ============================================================================
// TERMINAL STORE
// ============================================================================

// Helper to strip ANSI codes
const stripAnsi = (str: string) =>
  str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  );

interface TerminalState {
  showTerminal: boolean;
  webcontainer: Promise<WebContainer> | null;
  terminals: Array<{ terminal: ITerminal; process: WebContainerProcess }>;
  terminalOutput: string[]; // Circular buffer for output

  // Actions
  setWebContainer: (webcontainer: Promise<WebContainer>) => void;
  toggleTerminal: (value?: boolean) => void;
  attachTerminal: (terminal: ITerminal) => Promise<void>;
  onTerminalResize: (cols: number, rows: number) => void;
  reset: () => void;
  getOutput: () => string; // Helper to get full output
}

export const useTerminalStore = create<TerminalState>()(
  devtools(
    (set, get) => ({
      showTerminal: false,
      webcontainer,
      terminals: [],
      terminalOutput: [],

      setWebContainer: (webcontainer) => set({ webcontainer }),

      toggleTerminal: (value) => {
        const current = get().showTerminal;
        set({ showTerminal: value !== undefined ? value : !current });
      },

      attachTerminal: async (terminal) => {
        const { webcontainer, terminals } = get();
        if (!webcontainer) {
          console.error('[TerminalStore] WebContainer not initialized');
          return;
        }

        // Intercept terminal.write to capture output
        const originalWrite = terminal.write.bind(terminal);
        terminal.write = (data) => {
          originalWrite(data);
          const text =
            typeof data === 'string' ? data : new TextDecoder().decode(data);

          set((state) => {
            const newLines = text.split('\n');
            // Keep last 1000 lines
            const updated = [...state.terminalOutput, ...newLines].slice(-1000);
            return { terminalOutput: updated };
          });
        };

        try {
          const shellProcess = await newShellProcess(
            await webcontainer,
            terminal,
          );
          set({
            terminals: [...terminals, { terminal, process: shellProcess }],
          });
        } catch (error: any) {
          terminal.write(
            coloredText.red('Failed to spawn shell\n\n') + error.message,
          );
        }
      },

      onTerminalResize: (cols, rows) => {
        const { terminals } = get();
        for (const { process } of terminals) {
          process.resize({ cols, rows });
        }
      },

      reset: () =>
        set({
          showTerminal: false,
          terminals: [],
          terminalOutput: [],
          // webcontainer is persistent, do not reset
        }),

      getOutput: () => {
        // Join lines and strip ANSI codes for cleaner AI prompt
        return stripAnsi(get().terminalOutput.join('\n'));
      },
    }),
    { name: 'TerminalStore' },
  ),
);

// Update settings store to use terminal store
if (typeof window !== 'undefined') {
  useSettingsStore.setState({
    shortcuts: {
      toggleTerminal: {
        key: 'j',
        ctrlOrMetaKey: true,
        action: () => useTerminalStore.getState().toggleTerminal(),
      },
    },
  });
}
// ============================================================================
// FILES STORE
// ============================================================================

export interface File {
  type: 'file';
  content: string;
  isBinary: boolean;
}

export interface Folder {
  type: 'folder';
}

export type Dirent = File | Folder;
export type FileMap = Record<string, Dirent | undefined>;

interface FilesState {
  files: FileMap;
  filesCount: number;
  modifiedFiles: Map<string, string>;

  setFiles: (files: FileMap) => void;
  setFile: (path: string, dirent: Dirent | undefined) => void;
  incrementFilesCount: () => void;
  decrementFilesCount: () => void;
  setModifiedFile: (path: string, content: string) => void;
  clearModifiedFiles: () => void;
  getFile: (path: string) => File | undefined;
  reset: () => void;
}

export const useFilesStore = create<FilesState>()(
  devtools(
    (set, get) => ({
      files: {},
      filesCount: 0,
      modifiedFiles: new Map(),

      setFiles: (files) => set({ files }),

      setFile: (path, dirent) =>
        set((state) => ({
          files: { ...state.files, [path]: dirent },
        })),

      incrementFilesCount: () =>
        set((state) => ({ filesCount: state.filesCount + 1 })),
      decrementFilesCount: () =>
        set((state) => ({ filesCount: state.filesCount - 1 })),

      setModifiedFile: (path, content) => {
        const modifiedFiles = new Map(get().modifiedFiles);
        modifiedFiles.set(path, content);
        set({ modifiedFiles });
      },

      clearModifiedFiles: () => set({ modifiedFiles: new Map() }),

      getFile: (path) => {
        const dirent = get().files[path];
        if (dirent?.type !== 'file') return undefined;
        return dirent;
      },

      reset: () =>
        set({
          files: {},
          filesCount: 0,
          modifiedFiles: new Map(),
        }),
    }),
    { name: 'FilesStore' },
  ),
);

// ============================================================================
// EDITOR STORE
// ============================================================================

export interface EditorDocument {
  value: string;
  filePath: string;
  scroll?: ScrollPosition;
  isBinary: boolean;
}
export interface ScrollPosition {
  top: number;
  left: number;
}

export type EditorDocuments = Record<string, EditorDocument>;

interface EditorState {
  selectedFile: string | undefined;
  documents: EditorDocuments;

  setSelectedFile: (file: string | undefined) => void;
  setDocuments: (docs: EditorDocuments) => void;
  updateDocument: (path: string, doc: EditorDocument) => void;
  updateScrollPosition: (path: string, position: ScrollPosition) => void;
  updateFile: (path: string, content: string) => void;
  getCurrentDocument: () => EditorDocument | undefined;
  reset: () => void;
}

export const useEditorStore = create<EditorState>()(
  devtools(
    (set, get) => ({
      selectedFile: undefined,
      documents: {},

      setSelectedFile: (file) => set({ selectedFile: file }),

      setDocuments: (docs) => set({ documents: docs }),

      updateDocument: (path, doc) =>
        set((state) => ({
          documents: { ...state.documents, [path]: doc },
        })),

      updateScrollPosition: (path, position) => {
        const doc = get().documents[path];
        if (!doc) return;

        set((state) => ({
          documents: {
            ...state.documents,
            [path]: { ...doc, scroll: position },
          },
        }));
      },

      updateFile: (path, content) => {
        const doc = get().documents[path];
        if (!doc) return;

        const contentChanged = doc.value !== content;
        if (contentChanged) {
          set((state) => ({
            documents: {
              ...state.documents,
              [path]: { ...doc, value: content },
            },
          }));
        }
      },

      getCurrentDocument: () => {
        const selectedFile = get().selectedFile;
        if (!selectedFile) return undefined;
        return get().documents[selectedFile];
      },

      reset: () =>
        set({
          selectedFile: undefined,
          documents: {},
        }),
    }),
    { name: 'EditorStore' },
  ),
);

// ============================================================================
// WORKBENCH STORE
// ============================================================================

export type WorkbenchViewType = 'code' | 'preview';

export interface ArtifactState {
  id: string;
  title: string;
  closed: boolean;
  runner: any; // ActionRunner type
  actions?: Record<string, any>; // ActionState
}

interface WorkbenchState {
  showWorkbench: boolean;
  userHidWorkbench: boolean;
  currentView: WorkbenchViewType;
  unsavedFiles: Set<string>;
  artifacts: Record<string, ArtifactState>;
  artifactIdList: string[];
  buildError: boolean;

  setShowWorkbench: (show: boolean) => void;
  setUserHidWorkbench: (hid: boolean) => void;
  setCurrentView: (view: WorkbenchViewType) => void;
  setUnsavedFiles: (files: Set<string>) => void;
  setBuildError: (error: boolean) => void;
  addUnsavedFile: (file: string) => void;
  removeUnsavedFile: (file: string) => void;
  setArtifact: (id: string, artifact: ArtifactState) => void;
  setArtifactIdList: (list: string[]) => void;
  reset: () => void;
}

export const useWorkbenchStore = create<WorkbenchState>()(
  devtools(
    (set, get) => ({
      showWorkbench: true,
      userHidWorkbench: false,
      currentView: 'code',
      unsavedFiles: new Set(),
      artifacts: {},
      artifactIdList: [],
      buildError: false,

      setShowWorkbench: (show) => set({ showWorkbench: show }),
      setUserHidWorkbench: (hid) => set({ userHidWorkbench: hid }),
      setCurrentView: (view) => set({ currentView: view }),
      setUnsavedFiles: (files) => set({ unsavedFiles: files }),
      setBuildError: (error) => set({ buildError: error }),

      addUnsavedFile: (file) => {
        const unsavedFiles = new Set(get().unsavedFiles);
        unsavedFiles.add(file);
        set({ unsavedFiles });
      },

      removeUnsavedFile: (file) => {
        const unsavedFiles = new Set(get().unsavedFiles);
        unsavedFiles.delete(file);
        set({ unsavedFiles });
      },

      setArtifact: (id, artifact) =>
        set((state) => ({
          artifacts: { ...state.artifacts, [id]: artifact },
        })),

      setArtifactIdList: (list) => set({ artifactIdList: list }),

      reset: () =>
        set({
          showWorkbench: true,
          userHidWorkbench: false,
          currentView: 'code',
          unsavedFiles: new Set(),
          artifacts: {},
          artifactIdList: [],
          buildError: false,
        }),
    }),
    { name: 'WorkbenchStore' },
  ),
);
