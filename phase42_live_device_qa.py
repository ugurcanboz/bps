#!/usr/bin/env python3
import json, re
from pathlib import Path
root = Path(__file__).resolve().parent
checks=[]
def add(name, ok, detail=''):
    checks.append({'name':name,'passed':bool(ok),'detail':detail})
def read(rel):
    return (root/rel).read_text(encoding='utf-8')
app=read('js/core/app-config.js')
manifest=json.loads(read('manifest.json'))
update=json.loads(read('update-check.json'))
sw=read('service-worker.js')
index=read('index.html')
add('AppConfig G54.42', "var VERSION = 'G54.42'" in app)
add('AppConfig label Phase42', 'Live Deploy Device QA' in app)
add('Manifest G54.42', manifest.get('version')=='G54.42', manifest.get('version',''))
add('Update check G54.42', update.get('version','').startswith('G54.42'), update.get('version',''))
add('Update phase 42', str(update.get('phase'))=='42', str(update.get('phase')))
add('Service worker cache G54.42', "egt-trainer-g54-42" in sw)
add('Index fallback G54.42', 'G54.42-2026-06-20' in index)
add('Manifest uses relative start_url', manifest.get('start_url','').startswith('./'), manifest.get('start_url',''))
add('Manifest uses relative scope', manifest.get('scope','').startswith('./'), manifest.get('scope',''))
add('404 fallback exists', (root/'404.html').exists())
add('Phase42 browser test exists', (root/'tests_phase42_live_device_qa.html').exists())
add('Phase42 report exists', (root/'docs/PHASE42_LIVE_DEVICE_QA.md').exists())
for rel in ['tests_phase42_live_device_qa.html','phase42_live_device_qa.py','docs/PHASE42_LIVE_DEVICE_QA.md','tests_phase41_github_pages_deploy_check.html','docs/PHASE41_GITHUB_PAGES_DEPLOY_CHECK.md','tests_phase40_golden_master_qa.html','docs/PHASE40_GOLDEN_MASTER_QA_REPORT.md']:
    in_sw = "'./%s'" % rel in sw
    exists = (root/rel).exists()
    add('SW asset listed and exists: '+rel, in_sw and exists, f'in_sw={in_sw}, exists={exists}')
central='\n'.join([app,json.dumps(manifest),json.dumps(update),sw[:900],index[:800]])
add('No stale central 39F', 'G54.39F' not in central)
add('No stale central 39G', 'G54.39G' not in central)
add('No stale central 40 fallback', 'G54.40-2026-06-20' not in central)
add('No stale central 41 current version', "var VERSION = 'G54.41'" not in central and 'egt-trainer-g54-41' not in central[:1500])
result={'phase':'42','name':'Live Deploy Device QA Static Readiness','checks':checks}
result['passed']=all(c['passed'] for c in checks)
(root/'phase42_live_device_qa_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(result,indent=2,ensure_ascii=False))
raise SystemExit(0 if result['passed'] else 1)
