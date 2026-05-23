import glob
import re

files = glob.glob(r'c:\Users\Abhi\admin-template-\src\app\masters\**\*.tsx', recursive=True) + glob.glob(r'c:\Users\Abhi\admin-template-\src\app\transaction\**\*.tsx', recursive=True)

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    content = content.replace('import {\nimport { Edit } from "lucide-react";', 'import { Edit } from "lucide-react";\nimport {')
    content = content.replace('import {\nimport { Plus } from "lucide-react";', 'import { Plus } from "lucide-react";\nimport {')
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed", filepath)
