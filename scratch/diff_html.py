import difflib

addon_file = r"c:\Users\Ugurcan\Desktop\Projekt APP\BPS Coach Addon V2\404.html"
v9_file = r"c:\Users\Ugurcan\Desktop\Projekt APP\v9\404.html"

with open(addon_file, 'r', encoding='utf-8') as f:
    addon_lines = f.readlines()
    
with open(v9_file, 'r', encoding='utf-8') as f:
    v9_lines = f.readlines()

diff = difflib.unified_diff(addon_lines, v9_lines, fromfile='addon', tofile='v9', n=3)
for line in diff:
    print(line, end='')
