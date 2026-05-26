import pathlib, re, sys

root = pathlib.Path(__file__).parent / "src" / "app"

# Patterns to remove
patterns = [
    re.compile(r".*localStorage.*"),
    re.compile(r".*initial[A-Za-z]*\s*=\s*\[.*\]"),
    re.compile(r".*Mock.*"),
    re.compile(r".*dummyData.*"),
]

modified = []
for path in root.rglob("*.tsx"):
    try:
        text = path.read_text(encoding='utf-8')
    except Exception:
        continue
    lines = text.splitlines()
    new_lines = []
    changed = False
    for line in lines:
        if any(p.search(line) for p in patterns):
            changed = True
            continue
        new_lines.append(line)
    if changed:
        path.write_text("\n".join(new_lines) + "\n", encoding='utf-8')
        modified.append(str(path))
        print(f"Cleaned {path}")

print('Modified files count:', len(modified))
