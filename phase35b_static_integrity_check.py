
import json, pathlib, sys, re
base=pathlib.Path('.')
js=(base/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
errors=[]
for required in ['G54.30-phase35b-c2-lessons-1-5-content-speaking-expansion','function ensurePhase35BContentExpansion','function c2ContentSnapshot','c2ContentSnapshot:c2ContentSnapshot','c2Content:c2ContentSnapshot()']:
    if required not in js: errors.append('missing '+required)
uc=json.loads((base/'update-check.json').read_text(encoding='utf-8'))
if 'G54.30' not in uc.get('version',''): errors.append('update-check not G54.30')
if 'g54-30' not in (base/'service-worker.js').read_text(encoding='utf-8'): errors.append('service worker cache not g54-30')
if 'G54.30' not in (base/'manifest.json').read_text(encoding='utf-8'): errors.append('manifest not G54.30')
res={'ok':not errors,'errors':errors}
(base/'phase35b_static_integrity_result.json').write_text(json.dumps(res,indent=2),encoding='utf-8')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print('PASS phase35B static integrity')
