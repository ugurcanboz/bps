import json
from pathlib import Path
base=Path(__file__).resolve().parent
js=(base/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
required=['G54.23-phase33c-b2-lessons-6-10-content-speaking-expansion','B2_PHASE33C_EXPANDED_IDS','function ensurePhase33CContentExpansion','function b2ContentSnapshot','b2ContentSnapshot:b2ContentSnapshot']
errors=[]
for token in required:
    if token not in js: errors.append(f'missing {token}')
for rel in ['index.html','manifest.json','service-worker.js','update-check.json','START_HERE.md','WORKING-PLAN_1.md','tests_phase33c_b2_lessons_6_10_content_speaking_expansion.html','docs_PHASE33C_B2_LESSONS_6_10_CONTENT_SPEAKING_EXPANSION.md']:
    if not (base/rel).exists(): errors.append(f'missing file {rel}')
uc=json.loads((base/'update-check.json').read_text(encoding='utf-8'))
if 'G54.23' not in uc.get('version',''): errors.append('update-check version not G54.23')
if 'g54-23' not in (base/'service-worker.js').read_text(encoding='utf-8'): errors.append('service worker cache not G54.23')
res={'pass':not errors,'errors':errors,'checked':'phase33C static integrity'}
(base/'phase33c_static_integrity_result.json').write_text(json.dumps(res,indent=2),encoding='utf-8')
if errors:
    print(json.dumps(res,indent=2)); raise SystemExit(1)
print('PASS phase33C static integrity')
