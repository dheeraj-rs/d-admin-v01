#!/bin/bash

# Script to update imports in all moved files
set -e

COMPONENTS_DIR="app/(main)/ai-website-builder/components"

echo "Updating imports in component files..."

# Update imports from old nested structure to new flat structure
find "$COMPONENTS_DIR" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e "s|from '\.\./\.\./lib/hooks|from '../hooks|g" \
  -e "s|from '\.\./\.\./lib/persistence|from '../lib/persistence|g" \
  -e "s|from '\.\./\.\./lib/stores/zustand|from '../stores/zustand|g" \
  -e "s|from '\.\./\.\./lib/stores/workbench|from '../stores/workbench|g" \
  -e "s|from '\.\./\.\./lib/stores/editor|from '../stores/editor|g" \
  -e "s|from '\.\./\.\./lib/stores/files|from '../stores/files|g" \
  -e "s|from '\.\./\.\./lib/stores|from '../stores|g" \
  -e "s|from '\.\./\.\./lib/runtime|from '../lib/runtime|g" \
  -e "s|from '\.\./\.\./lib/webcontainer|from '../lib/webcontainer|g" \
  -e "s|from '\.\./\.\./lib|from '../lib|g" \
  -e "s|from '\.\./\.\./utils|from '../utils|g" \
  -e "s|from '\.\./\.\./types|from '../types|g" \
  -e "s|from '\.\./\.\./ChatInterface|from './ChatInterface|g" \
  -e "s|from '\.\./\.\./Header|from './AiBuilderHeaderWrapper|g" \
  -e "s|from '\.\./chat/|from './Chat|g" \
  -e "s|from '\.\./sidebar/|from './History|g" \
  -e "s|from '\.\./ui/|from './Ui|g" \
  -e "s|from '\.\./workbench/|from './Workbench|g" \
  -e "s|from '\.\./header/|from './AiBuilderHeader|g" \
  -e "s|from '\.\./panels/|from './|g" \
  -e "s|from '\.\./editor/codemirror/|from './CodeMirror|g" \
  -e "s|from './codemirror/|from './CodeMirror|g" \
  -e "s|from './terminal/|from './WorkbenchTerminal|g" \
  -e "s|from '\./date-binning'|from './HistoryDateBinning'|g" \
  {} \;

echo "Import updates complete!"
