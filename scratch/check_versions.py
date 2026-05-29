import os
import sys

# Ensure stdout uses utf-8
sys.stdout.reconfigure(encoding='utf-8')

files = ['VERSION_CHECK.html', 'update-check.json', 'service-worker.js', 'manifest.json', 'module-manifest.json']

print("Checking versions in config files:")
for f in files:
    if os.path.exists(f):
        print(f"\nFile: {f}")
        with open(f, 'r', encoding='utf-8') as file_obj:
            lines = file_obj.read().splitlines()
            for idx, line in enumerate(lines):
                if any(x in line for x in ['9.5.8', 'version', 'Version', 'VERSION']):
                    print(f"  Line {idx+1}: {line.strip()}")
