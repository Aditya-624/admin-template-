import os
import re

base_dirs = [
    r'c:\Users\Abhi\admin-template-\src\app\masters',
    r'c:\Users\Abhi\admin-template-\src\app\transaction'
]

def add_import(content, import_stmt):
    if import_stmt in content:
        return content
    # Find the last import
    last_import_idx = -1
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import_idx = i
    
    if last_import_idx != -1:
        lines.insert(last_import_idx + 1, import_stmt)
    else:
        # If no imports, put it after 'use client'
        for i, line in enumerate(lines):
            if 'use client' in line:
                lines.insert(i + 1, import_stmt)
                break
    return '\n'.join(lines)

def process_file(filepath, is_edit):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    if is_edit:
        # Match <h1> followed by optional emojis, then Edit/Modify/Update
        # But wait, earlier run might have already replaced some with <Edit size={24} /> Edit...
        # So we should be careful not to nest it.
        # Let's match <h1>(.*?)</h1> and replace its inner text if it contains Edit/Modify/Update
        
        # A safer approach for idempotency:
        if '<Edit size={24} />' in content:
            # Already updated
            return

        h1_match = re.search(r'(<h1[^>]*>)\s*(?:[^\w<]*|<span[^>]*>|<Plus[^>]*>|<Edit[^>]*>)*\s*(Edit|Modify|Update)\s+(.*?)(?:</span>)?\s*</h1>', content, re.IGNORECASE)
        if h1_match:
            start_tag = h1_match.group(1)
            action = h1_match.group(2).capitalize()
            rest = h1_match.group(3)
            
            new_h1 = f'{start_tag}<span style={{{{ display: "flex", alignItems: "center", gap: "10px" }}}}><Edit size={{24}} /> {action} {rest}</span></h1>'
            
            content = content[:h1_match.start()] + new_h1 + content[h1_match.end():]
            
            if 'import { Edit }' not in content and 'import {Edit}' not in content:
                content = add_import(content, 'import { Edit } from "lucide-react";')
                
    else:
        # Add pages
        if '<Plus size={24} />' in content:
            # Already updated
            return

        h1_match = re.search(r'(<h1[^>]*>)\s*(?:[^\w<]*|<span[^>]*>|<Plus[^>]*>|<Edit[^>]*>)*\s*(Add|Create|New)\s+(.*?)(?:</span>)?\s*</h1>', content, re.IGNORECASE)
        if h1_match:
            start_tag = h1_match.group(1)
            action = h1_match.group(2).capitalize()
            rest = h1_match.group(3)
            
            new_h1 = f'{start_tag}<span style={{{{ display: "flex", alignItems: "center", gap: "10px" }}}}><Plus size={{24}} /> {action} {rest}</span></h1>'
            
            content = content[:h1_match.start()] + new_h1 + content[h1_match.end():]
            
            if 'import { Plus }' not in content and 'import {Plus}' not in content:
                content = add_import(content, 'import { Plus } from "lucide-react";')

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        pass

for base_dir in base_dirs:
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file == 'page.tsx':
                filepath = os.path.join(root, file)
                if 'edit' in filepath.lower():
                    process_file(filepath, True)
                elif 'add' in filepath.lower():
                    process_file(filepath, False)
