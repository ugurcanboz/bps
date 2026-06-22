#!/usr/bin/env python3
import json, re
from pathlib import Path
root = Path(__file__).resolve().parent
checks=[]
def add(name, ok, detail=''):
    checks.append({'name':name,'passed':bool(ok),'detail':detail})
def read(rel):
    return (root/rel).read_text(encoding='utf-8')
# version files
app=read('js/core/app-config.js')
manifest=json.loads(read('manifest.json'))
update=json.loads(read('update-check.json'))
sw=read('service-worker.js')
index=read('index.html')
add('AppConfig G54.41', "var VERSION = 'G54.41'" in app)
add('Manifest G54.41', manifest.get('version')=='G54.41', manifest.get('version',''))
add('Update check G54.41', update.get('version','').startswith('G54.41'), update.get('version',''))
add('Service worker cache G54.41', "egt-trainer-g54-41" in sw)
add('Manifest uses relative start_url', manifest.get('start_url','').startswith('./'), manifest.get('start_url',''))
add('Manifest uses relative scope', manifest.get('scope','').startswith('./'), manifest.get('scope',''))
add('Index manifest link relative', 'href="./manifest.json"' in index)
add('404 fallback exists', (root/'404.html').exists())
add('Phase41 browser test exists', (root/'tests_phase41_github_pages_deploy_check.html').exists())
add('Phase41 report exists', (root/'docs/PHASE41_GITHUB_PAGES_DEPLOY_CHECK.md').exists())
# service worker assets should exist for Phase40/41 critical artifacts
for rel in ['tests_phase41_github_pages_deploy_check.html','phase41_deploy_readiness_qa.py','docs/PHASE41_GITHUB_PAGES_DEPLOY_CHECK.md','tests_phase40_golden_master_qa.html','docs/PHASE40_GOLDEN_MASTER_QA_REPORT.md']:
    in_sw = "'./%s'" % rel in sw
    exists = (root/rel).exists()
    add('SW asset listed and exists: '+rel, in_sw and exists, f'in_sw={in_sw}, exists={exists}')
# no stale central versions
central = '\n'.join([app, json.dumps(manifest), json.dumps(update), sw[:500]])
add('No stale central manifest 39F', 'G54.39F' not in central)
add('No stale central app/update 39G', 'G54.39G' not in central)
result={'phase':'41','name':'GitHub Pages Deploy Readiness QA','checks':checks}
result['passed']=all(c['passed'] for c in checks)
(root/'phase41_deploy_readiness_qa_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(result,indent=2,ensure_ascii=False))
raise SystemExit(0 if result['passed'] else 1)
