import re
import pathlib

root = pathlib.Path(__file__).parent / "src" / "app"
pattern = re.compile(r'^\s*\);\s*$')

modified_files = []
for path in root.rglob('*.tsx'):
    try:
        text = path.read_text(encoding='utf-8')
    except Exception as e:
        continue
    lines = text.splitlines()
    new_lines = [ln for ln in lines if not pattern.match(ln)]
    if len(new_lines) != len(lines):
        # Preserve newline at end of file
        path.write_text('\n'.join(new_lines) + '\n', encoding='utf-8')
        modified_files.append(str(path))
        print(f"Cleaned {path}")

print('Modified files count:', len(modified_files))
