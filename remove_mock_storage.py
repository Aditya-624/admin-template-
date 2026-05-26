import glob
import re
import os

def clean_local_storage_from_file(filepath):
    print(f"Refactoring storage in: {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content

    # 1. Remove all localStorage.setItem lines
    # Matches any line with localStorage.setItem(...) and strips it
    content = re.sub(r'localStorage\.setItem\([^)]+\);?', '', content)

    # 2. Replace catch blocks containing localStorage fallbacks for setStates
    # Example:
    #   const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
    #   setCourses(storedCourses ? JSON.parse(storedCourses) : []);
    # replaced with:
    #   setCourses([]);
    content = re.sub(
        r'const\s+(\w+)\s*=\s*localStorage\.getItem\([^)]+\);\s*set(\w+)\(\1\s*\?\s*JSON\.parse\(\1\)\s*:\s*([^;]+)\);',
        r'set\2(\3);',
        content
    )

    # 3. Simplify basic localStorage check & parse blocks to their fallback values
    # Matches: const stored = localStorage.getItem(...); const list = stored ? JSON.parse(stored) : fallback;
    # replaced with: const list = fallback;
    content = re.sub(
        r'const\s+(\w+)\s*=\s*localStorage\.getItem\([^)]+\);\s*const\s+(\w+)(?::\s*[^=]+)?\s*=\s*\1\s*\?\s*JSON\.parse\(\1\)\s*:\s*([^;]+);',
        r'const \2 = \3;',
        content
    )
    
    # Matches: let stored = localStorage.getItem(...); let list = stored ? JSON.parse(stored) : fallback;
    # replaced with: let list = fallback;
    content = re.sub(
        r'let\s+(\w+)\s*=\s*localStorage\.getItem\([^)]+\);\s*let\s+(\w+)(?::\s*[^=]+)?\s*=\s*\1\s*\?\s*JSON\.parse\(\1\)\s*:\s*([^;]+);',
        r'let \2 = \3;',
        content
    )

    # 4. Strip localStorage reads in Add/Edit forms that load master data options
    # Example: const localData = typeof window !== "undefined" ? localStorage.getItem(...) : null;
    # Replace with: const localData = null;
    content = re.sub(
        r'localStorage\.getItem\([^)]+\)',
        r'null',
        content
    )

    # 5. Handle direct state loads from localStorage at initialization
    # Example: const storedUsers = localStorage.getItem(storageKey); const existingUsers = storedUsers ? JSON.parse(storedUsers) : users;
    # Replace with: const existingUsers = users; (or initialData, initialCourses etc)
    content = re.sub(
        r'const\s+(\w+)\s*=\s*null;\s*const\s+(\w+)\s*=\s*\1\s*\?\s*JSON\.parse\(\1\)\s*:\s*([^;]+);',
        r'const \2 = \3;',
        content
    )
    
    # Same as above with let
    content = re.sub(
        r'let\s+(\w+)\s*=\s*null;\s*let\s+(\w+)\s*=\s*\1\s*\?\s*JSON\.parse\(\1\)\s*:\s*([^;]+);',
        r'let \2 = \3;',
        content
    )

    # 6. Simplify loadOfflineData functions if they exist
    # Matches loadOfflineData that checks localStorage
    # Replaces with a return of initial data or empty array
    if 'loadOfflineData' in content:
        content = re.sub(
            r'const loadOfflineData = \(\) => \{[\s\S]*?return\s+(\w+);\s*\}',
            r'const loadOfflineData = () => { return []; }',
            content
        )

    # 7. Safe fallback for other individual localStorage occurrences
    # Strip any standalone localStorage.getItem lines or block fragments safely
    content = re.sub(r'const\s+\w+\s*=\s*typeof\s+window\s*!==\s*["\']undefined["\']\s*\?\s*null\s*:\s*null;', '', content)
    content = re.sub(r'const\s+\w+\s*=\s*null;\s*if\s*\(\w+\)\s*\{[\s\S]*?\}', '', content)

    # 8. Optimize API mutation callbacks (Add/Edit/Delete) to be completely pure API-based
    # e.g., optimistic deletes: PATCH api.patch(...) -> setBranches(nextBranches);
    # Strip any silent `.catch(() => undefined)` and ensure the state is updated cleanly
    content = content.replace('.catch(() => undefined);', ';')

    # Remove double semicolons or trailing whitespace that might result from stripping
    content = re.sub(r';\s*;', ';', content)
    content = re.sub(r'\n{3,}', '\n\n', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully cleaned mock storage from: {filepath}")
    else:
        print(f"No mock storage items needed removal in: {filepath}")

def main():
    # Scan all TSX pages under masters and transaction directories
    search_dirs = [
        r'src/app/masters/**/*.tsx',
        r'src/app/transaction/**/*.tsx'
    ]
    
    files_processed = 0
    for pattern in search_dirs:
        for filepath in glob.glob(pattern, recursive=True):
            if os.path.isdir(filepath):
                continue
            clean_local_storage_from_file(filepath)
            files_processed += 1
            
    print(f"\nFinished mock storage clean-up! Total files processed: {files_processed}")

if __name__ == '__main__':
    main()
