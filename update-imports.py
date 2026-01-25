#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Base directory
base_dir = Path("app/(main)/ai-website-builder")
components_dir = base_dir / "components"

# Define replacement patterns
replacements = [
    # Hooks
    (r"from ['\"]\.\.\/\.\.\/lib\/hooks['\"]", "from '../hooks'"),
    (r"from ['\"]\.\.\/\.\.\/lib\/hooks\/([^'\"]+)['\"]", r"from '../hooks/\1'"),
    
    # Stores
    (r"from ['\"]\.\.\/\.\.\/lib\/stores\/zustand['\"]", "from '../stores/zustand'"),
    (r"from ['\"]\.\.\/\.\.\/lib\/stores\/workbench['\"]", "from '../stores/workbench'"),
    (r"from ['\"]\.\.\/\.\.\/lib\/stores\/editor['\"]", "from '../stores/editor'"),
    (r"from ['\"]\.\.\/\.\.\/lib\/stores\/files['\"]", "from '../stores/files'"),
    (r"from ['\"]\.\.\/\.\.\/lib\/stores\/([^'\"]+)['\"]", r"from '../stores/\1'"),
    (r"from ['\"]\.\.\/\.\.\/lib\/stores['\"]", "from '../stores'"),
    
    # Persistence
    (r"from ['\"]\.\.\/\.\.\/lib\/persistence['\"]", "from '../lib/persistence'"),
    (r"from ['\"]\.\.\/\.\.\/lib\/persistence\/([^'\"]+)['\"]", r"from '../lib/persistence/\1'"),
    
    # Runtime
    (r"from ['\"]\.\.\/\.\.\/lib\/runtime['\"]", "from '../lib/runtime'"),
    (r"from ['\"]\.\.\/\.\.\/lib\/runtime\/([^'\"]+)['\"]", r"from '../lib/runtime/\1'"),
    
    # Webcontainer
    (r"from ['\"]\.\.\/\.\.\/lib\/webcontainer['\"]", "from '../lib/webcontainer'"),
    
    # Utils
    (r"from ['\"]\.\.\/\.\.\/utils\/([^'\"]+)['\"]", r"from '../utils/\1'"),
    (r"from ['\"]\.\.\/\.\.\/utils['\"]", "from '../utils'"),
    
    # Types
    (r"from ['\"]\.\.\/\.\.\/types\/([^'\"]+)['\"]", r"from '../types/\1'"),
    (r"from ['\"]\.\.\/\.\.\/types['\"]", "from '../types'"),
    
    # SVG
    (r"from ['\"]\.\.\/\.\.\/svg\/([^'\"]+)['\"]", r"from '../svg/\1'"),
    
    # Settings
    (r"from ['\"]\.\.\/\.\.\/settings\/([^'\"]+)['\"]", r"from '../settings/\1'"),
    
    # Publish
    (r"from ['\"]\.\.\/\.\.\/publish\/([^'\"]+)['\"]", r"from '../publish/\1'"),
    
    # Top-level components
    (r"from ['\"]\.\.\/\.\.\/ChatInterface['\"]", "from './ChatInterface'"),
    (r"from ['\"]\.\.\/\.\.\/Header['\"]", "from './AiBuilderHeaderWrapper'"),
    (r"from ['\"]\.\.\/\.\.\/WorkbenchPanel['\"]", "from './WorkbenchPanel'"),
    
    # Chat components
    (r"from ['\"]\.\.\/chat\/Chat\.client['\"]", "from './ChatManager.client'"),
    (r"from ['\"]\.\.\/chat\/ChatInterfacePanel\.client['\"]", "from './ChatInterfacePanel.client'"),
    (r"from ['\"]\.\.\/chat\/Messages\.client['\"]", "from './ChatMessageList.client'"),
    (r"from ['\"]\.\.\/chat\/UserMessage['\"]", "from './ChatUserMessage'"),
    (r"from ['\"]\.\.\/chat\/AssistantMessage['\"]", "from './ChatAssistantMessage'"),
    (r"from ['\"]\.\.\/chat\/CodeBlock['\"]", "from './ChatCodeBlock'"),
    (r"from ['\"]\.\.\/chat\/Markdown['\"]", "from './ChatMarkdown'"),
    (r"from ['\"]\.\.\/chat\/ModelSelector['\"]", "from './ChatModelSelector'"),
    (r"from ['\"]\.\.\/chat\/SendButton\.client['\"]", "from './ChatSendButton.client'"),
    (r"from ['\"]\.\.\/chat\/Artifact['\"]", "from './ChatArtifact'"),
    
    # Sidebar components
    (r"from ['\"]\.\.\/sidebar\/HistorySidebar['\"]", "from './HistorySidebar'"),
    (r"from ['\"]\.\.\/sidebar\/HistoryItem['\"]", "from './HistoryItem'"),
    (r"from ['\"]\.\.\/sidebar\/Menu\.client['\"]", "from './HistoryMenu.client'"),
    (r"from ['\"]\.\.\/sidebar\/date-binning['\"]", "from './HistoryDateBinning'"),
    (r"from ['\"]\.\/date-binning['\"]", "from './HistoryDateBinning'"),
    
    # UI components
    (r"from ['\"]\.\.\/ui\/Dialog['\"]", "from './UiDialog'"),
    (r"from ['\"]\.\.\/ui\/IconButton['\"]", "from './UiIconButton'"),
    (r"from ['\"]\.\.\/ui\/PanelHeader['\"]", "from './UiPanelHeader'"),
    (r"from ['\"]\.\.\/ui\/PanelHeaderButton['\"]", "from './UiPanelHeaderButton'"),
    (r"from ['\"]\.\.\/ui\/Slider['\"]", "from './UiSlider'"),
    (r"from ['\"]\.\.\/ui\/ThemeSwitch['\"]", "from './UiThemeSwitch'"),
    
    # Workbench components
    (r"from ['\"]\.\.\/workbench\/Workbench\.client['\"]", "from './Workbench.client'"),
    (r"from ['\"]\.\.\/workbench\/EditorPanel['\"]", "from './WorkbenchEditorPanel'"),
    (r"from ['\"]\.\.\/workbench\/Preview['\"]", "from './WorkbenchPreview'"),
    (r"from ['\"]\.\.\/workbench\/FileTree['\"]", "from './WorkbenchFileTree'"),
    (r"from ['\"]\.\.\/workbench\/terminal\/Terminal['\"]", "from './WorkbenchTerminal'"),
    (r"from ['\"]\.\.\/workbench\/terminal\/theme['\"]", "from './WorkbenchTerminalTheme'"),
    (r"from ['\"]\.\.\/workbench\/EmptyStateIllustration['\"]", "from './WorkbenchEmptyStateIllustration'"),
    (r"from ['\"]\.\.\/workbench\/FileBreadcrumb['\"]", "from './WorkbenchFileBreadcrumb'"),
    (r"from ['\"]\.\.\/workbench\/FileTreeIllustration['\"]", "from './WorkbenchFileTreeIllustration'"),
    (r"from ['\"]\.\.\/workbench\/PortDropdown['\"]", "from './WorkbenchPortDropdown'"),
    (r"from ['\"]\.\/terminal\/Terminal['\"]", "from './WorkbenchTerminal'"),
    (r"from ['\"]\.\/terminal\/theme['\"]", "from './WorkbenchTerminalTheme'"),
    
    # Header components
    (r"from ['\"]\.\.\/header\/Header['\"]", "from './AiBuilderHeader'"),
    (r"from ['\"]\.\.\/header\/HeaderActionButtons\.client['\"]", "from './AiBuilderHeaderActionButtons.client'"),
    (r"from ['\"]\.\/Header['\"]", "from './AiBuilderHeader'"),
    (r"from ['\"]\.\/HeaderActionButtons\.client['\"]", "from './AiBuilderHeaderActionButtons.client'"),
    
    # Panels components
    (r"from ['\"]\.\.\/panels\/AnimatedPanel['\"]", "from './AnimatedPanel'"),
    (r"from ['\"]\.\.\/panels\/HistoryPanel['\"]", "from './HistoryPanel'"),
    (r"from ['\"]\.\.\/panels\/PanelContainer['\"]", "from './PanelContainer'"),
    
    # Editor/CodeMirror components
    (r"from ['\"]\.\.\/editor\/codemirror\/CodeMirrorEditor['\"]", "from './CodeMirrorEditor'"),
    (r"from ['\"]\.\.\/editor\/codemirror\/cm-theme['\"]", "from './CodeMirrorTheme'"),
    (r"from ['\"]\.\.\/editor\/codemirror\/indent['\"]", "from './CodeMirrorIndent'"),
    (r"from ['\"]\.\.\/editor\/codemirror\/languages['\"]", "from './CodeMirrorLanguages'"),
    (r"from ['\"]\.\.\/editor\/codemirror\/BinaryContent['\"]", "from './CodeMirrorBinaryContent'"),
    (r"from ['\"]\.\/codemirror\/CodeMirrorEditor['\"]", "from './CodeMirrorEditor'"),
    (r"from ['\"]\.\/codemirror\/cm-theme['\"]", "from './CodeMirrorTheme'"),
    (r"from ['\"]\.\/codemirror\/indent['\"]", "from './CodeMirrorIndent'"),
    (r"from ['\"]\.\/codemirror\/languages['\"]", "from './CodeMirrorLanguages'"),
    (r"from ['\"]\.\/codemirror\/BinaryContent['\"]", "from './CodeMirrorBinaryContent'"),
    
    # ClientOnly
    (r"from ['\"]\.\.\/ClientOnly['\"]", "from './ClientOnly'"),
    (r"from ['\"]\.\/ClientOnly['\"]", "from './ClientOnly'"),
]

def update_imports_in_file(file_path):
    """Update imports in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply all replacements
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {file_path.name}")
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to update all component files"""
    updated_count = 0
    
    # Process all TypeScript/TSX files in components directory
    for file_path in components_dir.glob("*.ts*"):
        if file_path.is_file():
            if update_imports_in_file(file_path):
                updated_count += 1
    
    print(f"\nTotal files updated: {updated_count}")

if __name__ == "__main__":
    main()
