from pathlib import Path
import re, json
root=Path(__file__).resolve().parent
errors=[]
for html in root.glob('*.html'):
    s=html.read_text(errors='ignore')
    for attr in ['src','href']:
        for m in re.finditer(attr+r'=["\']([^"\']+)["\']', s):
            url=m.group(1)
            if url.startswith(('http:','https:','data:','#','mailto:','tel:')): continue
            if url.startswith('//') or url.endswith('/'): continue
            clean=url.split('?')[0].split('#')[0]
            if not clean or clean.startswith('javascript:'): continue
            path=(html.parent/clean).resolve()
            try: path.relative_to(root.resolve())
            except Exception: continue
            if not path.exists(): errors.append({'file':html.name,'missing':clean})
required=['tests_phase32a_b1_course_speaking_structure.html','docs_PHASE32A_B1_COURSE_SPEAKING_STRUCTURE.md','js/modules/language-course-entry-module.js','css/language-course.css','phase32a_node_snapshot_result.json']
for r in required:
    if not (root/r).exists(): errors.append({'missingRequired':r})
result={'ok':not errors,'errors':errors[:100],'errorCount':len(errors)}
(root/'phase32a_static_integrity_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False))
print(json.dumps(result,indent=2,ensure_ascii=False))
if errors: raise SystemExit(1)
