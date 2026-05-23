import glob
import re

files = glob.glob(r'c:\Users\Abhi\admin-template-\src\app\**\*.tsx', recursive=True)
count = 0
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to remove the UI block: {error && <div ...>{error}</div>}
    # But since it varies, let's remove it if it has className="bg-yellow-...", or "text-yellow"
    # Actually, the user says "remove the line about api not connected which comes in yellow.... remove it from everywhere it is there."
    # Easiest way: remove the `setError("...API...")` line, then the error state remains null and the yellow block never shows.
    # We can also remove `const [error, setError] = useState...` and the `{error && ...}` block if we want to be thorough.
    
    # Just removing the setError line
    new_content = re.sub(r'^\s*setError\([\'"`].*?(?:API|offline).*?[\'"`]\);?\s*\n', '', content, flags=re.MULTILINE|re.IGNORECASE)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('Cleaned', filepath)
        count += 1

print(f'Total files cleaned: {count}')
