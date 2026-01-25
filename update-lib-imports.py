#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Base directory
base_dir = Path("app/(main)/ai-website-builder")

# Define replacement patterns for hooks, stores, lib
replacements = [
    # Fix stores references
    (r"from ['\"]\.\.\/stores\/", "from '../stores/"),
    (r"from ['\"]\.\.\/\.\.\/stores\/", "from '../../stores/"),
    
    # Fix lib references within lib
    (r"from ['\"]\.\.\/stores\/zustand['\"]", "from '../../stores/zustand'"),
    (r"from ['\"]\.\.\/stores\/workbench['\"]", "from '../../stores/workbench'"),
    (r"from ['\"]\.\.\/stores\/editor['\"]", "from '../../stores/editor'"),
    (r"from ['\"]\.\.\/stores\/files['\"]", "from '../../stores/files'"),
    
    # Fix utils references
    (r"from ['\"]\.\.\/utils\/", "from '../../utils/"),
    (r"from ['\"]\.\.\/\.\.\/utils\/", "from '../../utils/"),
]

def update_imports_in_file(file_path, base_path):
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
            rel_path = file_path.relative_to(base_path)
            print(f"Updated: {rel_path}")
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to update all files"""
    updated_count = 0
    
    # Process hooks
    hooks_dir = base_dir / "hooks"
    if hooks_dir.exists():
        for file_path in hooks_dir.rglob("*.ts*"):
            if file_path.is_file():
                if update_imports_in_file(file_path, base_dir):
                    updated_count += 1
    
    # Process stores
    stores_dir = base_dir / "stores"
    if stores_dir.exists():
        for file_path in stores_dir.rglob("*.ts*"):
            if file_path.is_file():
                if update_imports_in_file(file_path, base_dir):
                    updated_count += 1
    
    # Process lib
    lib_dir = base_dir / "lib"
    if lib_dir.exists():
        for file_path in lib_dir.rglob("*.ts*"):
            if file_path.is_file():
                if update_imports_in_file(file_path, base_dir):
                    updated_count += 1
    
    print(f"\nTotal files updated: {updated_count}")

if __name__ == "__main__":
    main()
