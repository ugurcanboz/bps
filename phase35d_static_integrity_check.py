import json
from pathlib import Path
base=Path(__file__).resolve().parent
js=(base/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
required=['G54.32-phase35d-c2-total-qa-device-simulation','function phase35dQaSnapshot','phase35dQaSnapshot:phase35dQaSnapshot','phase35dQa:phase35dQaSnapshot()','function c2ContentSnapshot']
errors=[]
for token in required:
    if token not in js: errors.append(f'missing {token}')
for rel in ['index.html','manifest.json','service-worker.js','update-check.json','START_HERE.md','WORKING-PLAN_1.md','tests_phase35d_c2_total_qa_device_simulation.html','docs_PHASE35D_C2_TOTAL_QA_DEVICE_SIMULATION.md']:
    if not (base/rel).exists(): errors.append(f'missing file {rel}')
uc=json.loads((base/'update-check.json').read_text(encoding='utf-8'))
if 'G54.32' not in uc.get('version',''): errors.append('update-check version not G54.32')
if 'g54-32' not in (base/'service-worker.js').read_text(encoding='utf-8'): errors.append('service worker cache not G54.32')
res={'pass':not errors,'errors':errors,'checked':'phase35D static integrity'}
(base/'phase35d_static_integrity_result.json').write_text(json.dumps(res,indent=2),encoding='utf-8')
if errors:
    print(json.dumps(res,indent=2)); raise SystemExit(1)
print('PASS phase35D static integrity')
