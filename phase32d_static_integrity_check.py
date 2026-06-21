import json, re
from pathlib import Path
root=Path(__file__).resolve().parent
errors=[]
# Version consistency
files=['js/core/app-config.js','update-check.json','manifest.json','service-worker.js','js/modules/language-course-entry-module.js']
for rel in files:
    p=root/rel
    if not p.exists(): errors.append(f'missing {rel}')
app=(root/'js/core/app-config.js').read_text(encoding='utf-8')
if "G54.20" not in app or "Phase 32D" not in app: errors.append('app-config version mismatch')
if 'egt-trainer-g54-20' not in (root/'service-worker.js').read_text(encoding='utf-8'): errors.append('service-worker cache mismatch')
if 'G54.20' not in (root/'manifest.json').read_text(encoding='utf-8'): errors.append('manifest version mismatch')
if 'G54.20' not in (root/'update-check.json').read_text(encoding='utf-8'): errors.append('update-check version mismatch')
mod=(root/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
need=['phase32dQaSnapshot','b1ContentSnapshot','speakingFallbackReady','phase30e','language-course-speaking-self-assess','32D']
for n in need:
    if n not in mod: errors.append(f'missing marker {n}')
# HTML local refs
for html in list(root.glob('*.html')):
    txt=html.read_text(encoding='utf-8',errors='ignore')
    for m in re.finditer(r'''(?:src|href)=["']([^"'#]+)["']''', txt):
        ref=m.group(1)
        if ref.startswith(('http://','https://','mailto:','tel:','data:')): continue
        if ref.startswith('./'): ref=ref[2:]
        if ref.startswith('/'): continue
        if not (root/ref).exists():
            # ignore dynamic docs references known from old service worker docs not html
            errors.append(f'{html.name}: missing ref {ref}')
result={'pass':not errors,'errors':errors,'checkedHtml':len(list(root.glob('*.html'))),'version':'G54.20','phase':'32D'}
(root/'phase32d_static_integrity_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
if errors:
    print(json.dumps(result,indent=2,ensure_ascii=False)); raise SystemExit(1)
print('PASS phase32D static integrity')
