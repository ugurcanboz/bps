import json, pathlib, re
base=pathlib.Path(__file__).resolve().parent
errors=[]
js=(base/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
for required in ['G54.29-phase35a-c2-course-speaking-structure','function ensurePhase35AC2Structure','function c2StructureSnapshot','c2StructureSnapshot:c2StructureSnapshot','c2Structure:c2StructureSnapshot()']:
    if required not in js: errors.append('missing '+required)
if js.count("id:'c2'") < 1: errors.append('C2 level missing')
uc=json.loads((base/'update-check.json').read_text(encoding='utf-8'))
if 'G54.29' not in uc.get('version',''): errors.append('update-check version not G54.29')
if 'g54-29' not in (base/'service-worker.js').read_text(encoding='utf-8'): errors.append('service worker cache not G54.29')
if 'G54.29' not in (base/'manifest.json').read_text(encoding='utf-8'): errors.append('manifest not G54.29')
if not (base/'tests_phase35a_c2_course_speaking_structure.html').exists(): errors.append('browser test missing')
result={'pass':not errors,'errors':errors}
(base/'phase35a_static_integrity_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
if errors:
    print(json.dumps(result,indent=2,ensure_ascii=False)); raise SystemExit(1)
print('PASS phase35A static integrity')
