import os
import filecmp

addon_dir = r"c:\Users\Ugurcan\Desktop\Projekt APP\BPS Coach Addon V2"
v9_dir = r"c:\Users\Ugurcan\Desktop\Projekt APP\v9"

files = [
    "js/learning-coach-engine.js",
    "js/learning-coach-ui.js",
    "css/learning-coach.css",
    "data/coach-knowledge-base.js",
    "index.html",
    "VERSION_CHECK.html",
    "service-worker.js",
    "update-check.json",
    "manifest.json",
    "404.html",
    "coach-demo.html",
    "coach-qa-runner.html"
]

print("Comparing files between Addon V2 and v9:")
for f in files:
    path_addon = os.path.join(addon_dir, f)
    path_v9 = os.path.join(v9_dir, f)
    
    if not os.path.exists(path_addon):
        print(f"  [MISSING in Addon] {f}")
        continue
    if not os.path.exists(path_v9):
        print(f"  [MISSING in v9]    {f}")
        continue
        
    try:
        same = filecmp.cmp(path_addon, path_v9, shallow=False)
        if same:
            print(f"  [MATCH]           {f}")
        else:
            print(f"  [DIFFERENT]       {f}")
    except Exception as e:
        print(f"  [ERROR]           {f}: {e}")
