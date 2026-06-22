import json, re
from pathlib import Path
root=Path(__file__).resolve().parent
errors=[]
module=(root/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
checks={
 'version_g5421': "G54.21-phase33a-b2-course-speaking-structure" in module,
 'b2_blueprints': 'B2_LESSON_BLUEPRINTS' in module,
 'b2_ensure': 'ensurePhase33AB2Structure' in module,
 'b2_snapshot': 'b2StructureSnapshot' in module,
 'b2_export': 'b2StructureSnapshot:b2StructureSnapshot' in module,
 'parallel_policy': 'B2 wird ab Start mit Kursaufgaben und Speaking parallel aufgebaut.' in module,
 'speech_fallback_kept': 'language-course-speaking-self-assess' in module and 'phase30e' in module,
}
for k,v in checks.items():
    if not v: errors.append(k)
for rel, token in [('js/core/app-config.js','G54.21'),('update-check.json','G54.21'),('manifest.json','G54.21'),('service-worker.js','egt-trainer-g54-21')]:
    txt=(root/rel).read_text(encoding='utf-8')
    if token not in txt: errors.append(f'{rel}:{token}')
result={'pass':not errors,'errors':errors,'checks':checks}
(root/'phase33a_static_integrity_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
if errors:
    print(json.dumps(result,indent=2,ensure_ascii=False)); raise SystemExit(1)
print('PASS phase33A static integrity')
