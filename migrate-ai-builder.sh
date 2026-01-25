#!/bin/bash

# Migration script for ai-website-builder restructuring
set -e

BASE_DIR="app/(main)/ai-website-builder"
OLD_DIR="$BASE_DIR/ai-chat-view"
NEW_COMPONENTS="$BASE_DIR/components"

echo "Starting migration..."

# Chat Components
[ -f "$OLD_DIR/components/chat/Chat.client.tsx" ] && mv "$OLD_DIR/components/chat/Chat.client.tsx" "$NEW_COMPONENTS/ChatManager.client.tsx"
[ -f "$OLD_DIR/components/chat/ChatInterfacePanel.client.tsx" ] && mv "$OLD_DIR/components/chat/ChatInterfacePanel.client.tsx" "$NEW_COMPONENTS/ChatInterfacePanel.client.tsx"
[ -f "$OLD_DIR/components/chat/Messages.client.tsx" ] && mv "$OLD_DIR/components/chat/Messages.client.tsx" "$NEW_COMPONENTS/ChatMessageList.client.tsx"
[ -f "$OLD_DIR/components/chat/UserMessage.tsx" ] && mv "$OLD_DIR/components/chat/UserMessage.tsx" "$NEW_COMPONENTS/ChatUserMessage.tsx"
[ -f "$OLD_DIR/components/chat/AssistantMessage.tsx" ] && mv "$OLD_DIR/components/chat/AssistantMessage.tsx" "$NEW_COMPONENTS/ChatAssistantMessage.tsx"
[ -f "$OLD_DIR/components/chat/CodeBlock.tsx" ] && mv "$OLD_DIR/components/chat/CodeBlock.tsx" "$NEW_COMPONENTS/ChatCodeBlock.tsx"
[ -f "$OLD_DIR/components/chat/Markdown.tsx" ] && mv "$OLD_DIR/components/chat/Markdown.tsx" "$NEW_COMPONENTS/ChatMarkdown.tsx"
[ -f "$OLD_DIR/components/chat/ModelSelector.tsx" ] && mv "$OLD_DIR/components/chat/ModelSelector.tsx" "$NEW_COMPONENTS/ChatModelSelector.tsx"
[ -f "$OLD_DIR/components/chat/SendButton.client.tsx" ] && mv "$OLD_DIR/components/chat/SendButton.client.tsx" "$NEW_COMPONENTS/ChatSendButton.client.tsx"
[ -f "$OLD_DIR/components/chat/Artifact.tsx" ] && mv "$OLD_DIR/components/chat/Artifact.tsx" "$NEW_COMPONENTS/ChatArtifact.tsx"

# Editor Components
[ -f "$OLD_DIR/components/editor/codemirror/indent.ts" ] && mv "$OLD_DIR/components/editor/codemirror/indent.ts" "$NEW_COMPONENTS/CodeMirrorIndent.ts"
[ -f "$OLD_DIR/components/editor/codemirror/languages.ts" ] && mv "$OLD_DIR/components/editor/codemirror/languages.ts" "$NEW_COMPONENTS/CodeMirrorLanguages.ts"
[ -f "$OLD_DIR/components/editor/codemirror/BinaryContent.tsx" ] && mv "$OLD_DIR/components/editor/codemirror/BinaryContent.tsx" "$NEW_COMPONENTS/CodeMirrorBinaryContent.tsx"

# Header Components
[ -f "$OLD_DIR/components/header/Header.tsx" ] && mv "$OLD_DIR/components/header/Header.tsx" "$NEW_COMPONENTS/AiBuilderHeader.tsx"
[ -f "$OLD_DIR/components/header/HeaderActionButtons.client.tsx" ] && mv "$OLD_DIR/components/header/HeaderActionButtons.client.tsx" "$NEW_COMPONENTS/AiBuilderHeaderActionButtons.client.tsx"

# Panels Components
[ -f "$OLD_DIR/components/panels/AnimatedPanel.tsx" ] && mv "$OLD_DIR/components/panels/AnimatedPanel.tsx" "$NEW_COMPONENTS/AnimatedPanel.tsx"
[ -f "$OLD_DIR/components/panels/HistoryPanel.tsx" ] && mv "$OLD_DIR/components/panels/HistoryPanel.tsx" "$NEW_COMPONENTS/HistoryPanel.tsx"
[ -f "$OLD_DIR/components/panels/PanelContainer.tsx" ] && mv "$OLD_DIR/components/panels/PanelContainer.tsx" "$NEW_COMPONENTS/PanelContainer.tsx"

# Sidebar Components
[ -f "$OLD_DIR/components/sidebar/HistorySidebar.tsx" ] && mv "$OLD_DIR/components/sidebar/HistorySidebar.tsx" "$NEW_COMPONENTS/HistorySidebar.tsx"
[ -f "$OLD_DIR/components/sidebar/HistoryItem.tsx" ] && mv "$OLD_DIR/components/sidebar/HistoryItem.tsx" "$NEW_COMPONENTS/HistoryItem.tsx"
[ -f "$OLD_DIR/components/sidebar/Menu.client.tsx" ] && mv "$OLD_DIR/components/sidebar/Menu.client.tsx" "$NEW_COMPONENTS/HistoryMenu.client.tsx"
[ -f "$OLD_DIR/components/sidebar/date-binning.ts" ] && mv "$OLD_DIR/components/sidebar/date-binning.ts" "$NEW_COMPONENTS/HistoryDateBinning.ts"

# UI Components
[ -f "$OLD_DIR/components/ui/Dialog.tsx" ] && mv "$OLD_DIR/components/ui/Dialog.tsx" "$NEW_COMPONENTS/UiDialog.tsx"
[ -f "$OLD_DIR/components/ui/IconButton.tsx" ] && mv "$OLD_DIR/components/ui/IconButton.tsx" "$NEW_COMPONENTS/UiIconButton.tsx"
[ -f "$OLD_DIR/components/ui/PanelHeader.tsx" ] && mv "$OLD_DIR/components/ui/PanelHeader.tsx" "$NEW_COMPONENTS/UiPanelHeader.tsx"
[ -f "$OLD_DIR/components/ui/PanelHeaderButton.tsx" ] && mv "$OLD_DIR/components/ui/PanelHeaderButton.tsx" "$NEW_COMPONENTS/UiPanelHeaderButton.tsx"
[ -f "$OLD_DIR/components/ui/Slider.tsx" ] && mv "$OLD_DIR/components/ui/Slider.tsx" "$NEW_COMPONENTS/UiSlider.tsx"
[ -f "$OLD_DIR/components/ui/ThemeSwitch.tsx" ] && mv "$OLD_DIR/components/ui/ThemeSwitch.tsx" "$NEW_COMPONENTS/UiThemeSwitch.tsx"

# Workbench Components
[ -f "$OLD_DIR/components/workbench/Workbench.client.tsx" ] && mv "$OLD_DIR/components/workbench/Workbench.client.tsx" "$NEW_COMPONENTS/Workbench.client.tsx"
[ -f "$OLD_DIR/components/workbench/EditorPanel.tsx" ] && mv "$OLD_DIR/components/workbench/EditorPanel.tsx" "$NEW_COMPONENTS/WorkbenchEditorPanel.tsx"
[ -f "$OLD_DIR/components/workbench/Preview.tsx" ] && mv "$OLD_DIR/components/workbench/Preview.tsx" "$NEW_COMPONENTS/WorkbenchPreview.tsx"
[ -f "$OLD_DIR/components/workbench/FileTree.tsx" ] && mv "$OLD_DIR/components/workbench/FileTree.tsx" "$NEW_COMPONENTS/WorkbenchFileTree.tsx"
[ -f "$OLD_DIR/components/workbench/terminal/Terminal.tsx" ] && mv "$OLD_DIR/components/workbench/terminal/Terminal.tsx" "$NEW_COMPONENTS/WorkbenchTerminal.tsx"
[ -f "$OLD_DIR/components/workbench/terminal/theme.ts" ] && mv "$OLD_DIR/components/workbench/terminal/theme.ts" "$NEW_COMPONENTS/WorkbenchTerminalTheme.ts"
[ -f "$OLD_DIR/components/workbench/EmptyStateIllustration.tsx" ] && mv "$OLD_DIR/components/workbench/EmptyStateIllustration.tsx" "$NEW_COMPONENTS/WorkbenchEmptyStateIllustration.tsx"
[ -f "$OLD_DIR/components/workbench/FileBreadcrumb.tsx" ] && mv "$OLD_DIR/components/workbench/FileBreadcrumb.tsx" "$NEW_COMPONENTS/WorkbenchFileBreadcrumb.tsx"
[ -f "$OLD_DIR/components/workbench/FileTreeIllustration.tsx" ] && mv "$OLD_DIR/components/workbench/FileTreeIllustration.tsx" "$NEW_COMPONENTS/WorkbenchFileTreeIllustration.tsx"
[ -f "$OLD_DIR/components/workbench/PortDropdown.tsx" ] && mv "$OLD_DIR/components/workbench/PortDropdown.tsx" "$NEW_COMPONENTS/WorkbenchPortDropdown.tsx"

# Top-level Components
[ -f "$OLD_DIR/Header.tsx" ] && mv "$OLD_DIR/Header.tsx" "$NEW_COMPONENTS/AiBuilderHeaderWrapper.tsx"
[ -f "$OLD_DIR/ChatInterface.tsx" ] && mv "$OLD_DIR/ChatInterface.tsx" "$NEW_COMPONENTS/ChatInterface.tsx"
[ -f "$OLD_DIR/WorkbenchPanel.tsx" ] && mv "$OLD_DIR/WorkbenchPanel.tsx" "$NEW_COMPONENTS/WorkbenchPanel.tsx"
[ -f "$OLD_DIR/components/ClientOnly.tsx" ] && mv "$OLD_DIR/components/ClientOnly.tsx" "$NEW_COMPONENTS/ClientOnly.tsx"

# Move lib, stores, utils, types, styles
echo "Moving lib, stores, utils, types, styles..."
[ -d "$OLD_DIR/lib" ] && cp -R "$OLD_DIR/lib/." "$BASE_DIR/lib/"
[ -d "$OLD_DIR/types" ] && cp -R "$OLD_DIR/types/." "$BASE_DIR/types/"
[ -d "$OLD_DIR/utils" ] && cp -R "$OLD_DIR/utils/." "$BASE_DIR/utils/"
[ -d "$OLD_DIR/styles" ] && cp -R "$OLD_DIR/styles/." "$BASE_DIR/styles/"
[ -d "$OLD_DIR/publish" ] && cp -R "$OLD_DIR/publish/." "$BASE_DIR/publish/"
[ -d "$OLD_DIR/settings" ] && cp -R "$OLD_DIR/settings/." "$BASE_DIR/settings/"
[ -d "$OLD_DIR/svg" ] && cp -R "$OLD_DIR/svg/." "$BASE_DIR/svg/"

# Move stores from lib/stores to stores
if [ -d "$BASE_DIR/lib/stores" ]; then
  cp -R "$BASE_DIR/lib/stores/." "$BASE_DIR/stores/"
fi

# Move hooks from lib/hooks to hooks
if [ -d "$BASE_DIR/lib/hooks" ]; then
  cp -R "$BASE_DIR/lib/hooks/." "$BASE_DIR/hooks/"
fi

echo "Migration complete!"
