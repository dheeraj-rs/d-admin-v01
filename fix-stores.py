#!/usr/bin/env python3
import re

files_to_fix = [
    "app/(main)/ai-website-builder/stores/workbench.ts",
    "app/(main)/ai-website-builder/stores/zustand.ts",
]

for file_path in files_to_fix:
    with open(file_path, 'r') as f:
        content = f.read()
    
    original = content
    
    # Fix imports
    content = re.sub(r"from '\.\.\/\.\.\/utils\/", r"from '../utils/", content)
    content = re.sub(r"from '\.\.\/\.\.\/lib\/", r"from '../lib/", content)
    content = re.sub(r"from '\.\.\/\.\.\/types\/", r"from '../types/", content)
    
    if content != original:
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Fixed: {file_path}")
    else:
        print(f"No changes: {file_path}")
