
import { memo, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  type OnChangeCallback as OnEditorChange,
  type OnScrollCallback as OnEditorScroll,
} from '../editor/codemirror/CodeMirrorEditor';
import { IconButton } from '../ui/IconButton';
import { PanelHeaderButton } from '../ui/PanelHeaderButton';
import { Slider, type SliderOptions } from '../ui/Slider';
import { workbenchStore, type WorkbenchViewType } from '../../lib/stores/workbench';
import { useFilesStore, useEditorStore, useWorkbenchStore, usePreviewStore, useTerminalStore } from '../../lib/stores/zustand';
import { renderLogger } from '../../utils/logger';
import { EditorPanel } from './EditorPanel';
import { Preview } from './Preview';

interface WorkspaceProps {
  isStreaming?: boolean;
}



const sliderOptions: SliderOptions<WorkbenchViewType> = {
  left: {
    value: 'code',
    text: 'Code',
  },
  right: {
    value: 'preview',
    text: 'Preview',
  },
};

export const Workbench = memo(({ isStreaming }: WorkspaceProps) => {
  renderLogger.trace('Workbench');

  const selectedView = useWorkbenchStore(state => state.currentView);
  const currentDocument = useEditorStore(state => state.getCurrentDocument());
  const unsavedFiles = useWorkbenchStore(state => state.unsavedFiles);
  const files = useFilesStore(state => state.files);
  const selectedFile = useEditorStore(state => state.selectedFile);

  const setSelectedView = (view: WorkbenchViewType) => {
    useWorkbenchStore.getState().setCurrentView(view);
  };

  const hasPreview = usePreviewStore(state => state.previews.length > 0);

  useEffect(() => {
    if (hasPreview) {
      setSelectedView('preview');
    }
  }, [hasPreview]);

  useEffect(() => {
    workbenchStore.setDocuments(files);
  }, [files]);

  const onEditorChange = useCallback<OnEditorChange>((update) => {
    workbenchStore.setCurrentDocumentContent(update.content);
  }, []);

  const onEditorScroll = useCallback<OnEditorScroll>((position) => {
    workbenchStore.setCurrentDocumentScrollPosition(position);
  }, []);

  const onFileSelect = useCallback((filePath: string | undefined) => {
    workbenchStore.setSelectedFile(filePath);
  }, []);

  const onFileSave = useCallback(() => {
    workbenchStore.saveCurrentDocument().catch(() => {
      toast.error('Failed to update file content');
    });
  }, []);

  const onFileReset = useCallback(() => {
    workbenchStore.resetCurrentDocument();
  }, []);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-surface-0">
      <div className="flex items-center px-3 py-2 border-b border-surface">
        <Slider selected={selectedView} options={sliderOptions} setSelected={setSelectedView} />
        <div className="ml-auto" />
        {selectedView === 'code' && (
          <PanelHeaderButton
            className="mr-1 text-sm"
            onClick={() => {
              workbenchStore.toggleTerminal(!workbenchStore.showTerminal);
            }}
          >
            <div className="i-ph:terminal" />
            Toggle Terminal
          </PanelHeaderButton>
        )}
        <IconButton
          icon="i-ph:x-circle"
          className="-mr-1"
          size="xl"
          onClick={() => {
            useWorkbenchStore.getState().setShowWorkbench(false);
          }}
        />
      </div>
      <div className="relative flex-1 overflow-hidden">
        <View
          animate={{ x: selectedView === 'code' ? 0 : '-100%' }}
        >
          <EditorPanel
            editorDocument={currentDocument}
            isStreaming={isStreaming}
            selectedFile={selectedFile}
            files={files}
            unsavedFiles={unsavedFiles}
            onFileSelect={onFileSelect}
            onEditorScroll={onEditorScroll}
            onEditorChange={onEditorChange}
            onFileSave={onFileSave}
            onFileReset={onFileReset}
          />
        </View>
        <View
          animate={{ x: selectedView === 'preview' ? 0 : '100%' }}
        >
          <Preview />
        </View>
      </div>
    </div>
  );
});

Workbench.displayName = 'Workbench';

interface ViewProps {
  children: React.ReactNode;
  animate?: { x: number | string };
}

const View = memo(({ children, animate }: ViewProps) => {
  return (
    <div className="absolute inset-0" style={{ transform: `translateX(${typeof animate?.x === 'number' ? animate.x + 'px' : animate?.x || 0})` }}>
      {children}
    </div>
  );
});

View.displayName = 'View';
