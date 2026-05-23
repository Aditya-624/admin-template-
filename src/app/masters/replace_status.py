import os
import re

target_dir = r"c:\Users\Abhi\admin-template-\src\app\masters"

# Find all page.tsx files
page_files = []
for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file == "page.tsx":
            page_files.append(os.path.join(root, file))

# We want to match the whole block for status:
# From <label htmlFor="status" ... up to the closing </div> of the edit-user-row
# Wait, the parent container is usually <div className="edit-user-row...">
# So it's easier to find the exact input checkbox and replace the div containing it.

regex = re.compile(
    r'(<label htmlFor="status"[^>]*>Status</label>\s*<div[^>]*>.*?(?:update|updateField|setForm)\(\s*"status"\s*,\s*[^)]+\s*\).*?</div>\s*</div>)',
    re.DOTALL
)

# Wait, the structure is:
# <label htmlFor="status">Status</label>
# <div className="edit-user-field" ...>
#   ...
#   <input type="checkbox" ... onChange={(e) => update("status", e.target.checked)} ... />
#   ...
# </div>

def get_replacement(func_name, label_match):
    return f'''{label_match}
            <div className="edit-user-field" style={{{{ display: "flex", alignItems: "center", minHeight: "42px" }}}}>
              <div style={{{{ display: "flex", alignItems: "center", gap: "12px" }}}}>
                <button
                  type="button"
                  id="status"
                  onClick={{() => {func_name}("status", !form.status)}}
                  className={{`status-toggle ${{form.status ? "active" : ""}}`}}
                  aria-pressed={{form.status}}
                  style={{{{
                    position: "relative",
                    width: "48px",
                    height: "24px",
                    borderRadius: "9999px",
                    background: form.status ? "#34c759" : "#4b5563",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease, transform 0.1s ease",
                    padding: "0"
                  }}}}
                >
                  <span
                    style={{{{
                      display: "block",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      position: "absolute",
                      top: "3px",
                      left: form.status ? "27px" : "3px",
                      transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }}}}
                  />
                </button>
                <span
                  style={{{{
                    color: form.status ? "#34c759" : "#9ca3af",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "color 0.2s ease"
                  }}}}
                >
                  {{form.status ? "Active" : "Inactive"}}
                </span>
              </div>
            </div>'''

for filepath in page_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip files that already have the toggle
    if 'borderRadius: "9999px"' in content and 'aria-pressed={form.status}' in content:
        continue

    # Look for the update function name
    # It might be onChange={(e) => update("status"
    # or onChange={(e) => updateField("status"
    # or onChange={(e) => setForm({...form, status: e.target.checked})} -> wait, if it's setForm, I need to know.

    func_match = re.search(r'onChange=\{\([^)]*\)\s*=>\s*(update|updateField)\("status"', content)
    
    if not func_match:
        # Check if it has a status checkbox at all
        if 'id="status"' in content and 'checkbox' in content:
            print(f"Manual intervention needed for {filepath}")
        continue
        
    func_name = func_match.group(1)

    # We need to replace the label and the div that follows it.
    # regex: <label htmlFor="status"[^>]*>Status</label>
    # followed by <div... >
    # up to the end of the div
    # To avoid parsing HTML with regex, let's find the label and the closing div by counting braces or simple string replacement.
    
    label_start = content.find('<label htmlFor="status"')
    if label_start == -1:
        continue
        
    # extract the label line
    label_end = content.find('</label>', label_start) + len('</label>')
    label_str = content[label_start:label_end]

    # the field div starts after the label
    field_start = content.find('<div className="edit-user-field"', label_end)
    if field_start == -1:
        field_start = content.find('<div', label_end)
        
    if field_start == -1 or field_start - label_end > 100:
        continue # something is wrong
        
    # Find the matching closing div for field_start
    # We can just count <div and </div
    div_count = 0
    i = field_start
    while i < len(content):
        if content[i:i+4] == '<div':
            div_count += 1
            i += 4
        elif content[i:i+6] == '</div>':
            div_count -= 1
            i += 6
            if div_count == 0:
                break
        else:
            i += 1
    
    field_end = i
    
    old_block = content[label_start:field_end]
    new_block = get_replacement(func_name, label_str)
    
    new_content = content.replace(old_block, new_block)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated {filepath}")
