
import json, pathlib, sys
base=pathlib.Path('.')
js=(base/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
errors=[]
for required in ['G54.31-phase35c-c2-lessons-6-10-content-speaking-expansion','function ensurePhase35CContentExpansion','function createC2ExpandedTasks35C','phase:\'35C\'','c2ContentSnapshot:c2ContentSnapshot']:
    if required not in js: errors.append('missing '+required)
uc=json.loads((base/'update-check.json').read_text(encoding='utf-8'))
if 'G54.31' not in uc.get('version',''): errors.append('update-check not G54.31')
if 'g54-31' not in (base/'service-worker.js').read_text(encoding='utf-8'): errors.append('service worker cache not g54-31')
if 'G54.31' not in (base/'manifest.json').read_text(encoding='utf-8'): errors.append('manifest not G54.31')
res={'ok':not errors,'errors':errors}
(base/'phase35c_static_integrity_result.json').write_text(json.dumps(res,indent=2),encoding='utf-8')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print('PASS phase35C static integrity')
