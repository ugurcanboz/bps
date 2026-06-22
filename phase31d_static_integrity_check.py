from pathlib import Path
import re, json
root=Path('/mnt/data/g5415_qa')
errors=[]
for html in root.glob('*.html'):
    s=html.read_text(errors='ignore')
    for attr in ['src','href']:
        for m in re.finditer(attr+r'=["\']([^"\']+)["\']', s):
            url=m.group(1)
            if url.startswith(('http:','https:','data:','#','mailto:','tel:')): continue
            if url.startswith('//'): continue
            if url.endswith('/'): continue
            clean=url.split('?')[0].split('#')[0]
            if not clean or clean.startswith('javascript:'): continue
            path=(html.parent/clean).resolve()
            try: path.relative_to(root.resolve())
            except Exception: continue
            if not path.exists(): errors.append({'file':html.name,'missing':clean})
# phase-specific required files
required=['tests_phase31c_a2_lessons_6_10_content_speaking_expansion.html','docs_PHASE31C_A2_LESSONS_6_10_CONTENT_SPEAKING_EXPANSION.md','js/modules/language-course-entry-module.js','css/language-course.css']
for r in required:
    if not (root/r).exists(): errors.append({'missingRequired':r})
print(json.dumps({'ok':not errors,'errors':errors[:100],'errorCount':len(errors)}, indent=2, ensure_ascii=False))
if errors: raise SystemExit(1)
