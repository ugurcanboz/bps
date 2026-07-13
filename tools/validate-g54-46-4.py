from __future__ import annotations
import json, re, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PHASE='G54.46.4'
errors=[]
js_files=[]
for ext in ('*.js','*.cjs','*.mjs'):
    js_files += [p for p in ROOT.rglob(ext) if 'node_modules' not in p.parts]
for p in sorted(set(js_files)):
    r=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
    if r.returncode:
        errors.append({'type':'javascript-syntax','file':str(p.relative_to(ROOT)),'error':(r.stderr or r.stdout).strip()})
json_files=[p for p in ROOT.rglob('*.json') if 'node_modules' not in p.parts]
for p in json_files:
    try: json.loads(p.read_text(encoding='utf-8-sig'))
    except Exception as e: errors.append({'type':'json-parse','file':str(p.relative_to(ROOT)),'error':str(e)})

def clean_ref(x:str)->str:
    x=x.split('#',1)[0].split('?',1)[0].strip()
    while x.startswith('./'): x=x[2:]
    return x
index=(ROOT/'index.html').read_text(encoding='utf-8')
refs=[]
for m in re.finditer(r'''(?:src|href)=["']([^"']+)["']''',index,re.I):
    raw=m.group(1)
    if re.match(r'^(?:https?:|data:|mailto:|tel:|javascript:|#)',raw,re.I): continue
    ref=clean_ref(raw)
    if not ref: continue
    refs.append(ref)
missing_index=[]
for ref in sorted(set(refs)):
    if not (ROOT/ref).exists(): missing_index.append(ref)
    
sw=(ROOT/'service-worker.js').read_text(encoding='utf-8')
asset_block=re.search(r'var\s+ASSETS\s*=\s*\[(.*?)\];',sw,re.S)
sw_assets=[]
if asset_block:
    sw_assets=re.findall(r'["\']([^"\']+)["\']',asset_block.group(1))
missing_sw=[]
for raw in sw_assets:
    ref=clean_ref(raw)
    if not ref: continue
    if not (ROOT/ref).exists(): missing_sw.append(ref)

app=(ROOT/'js/core/app-config.js').read_text(encoding='utf-8')
manifest=json.loads((ROOT/'manifest.json').read_text())
update=json.loads((ROOT/'update-check.json').read_text())
mm=json.loads((ROOT/'module-manifest.json').read_text())
version_match=re.search(r"var VERSION = '([^']+)'",app)
version=version_match.group(1) if version_match else ''
checks={
    'appVersion':version,
    'manifestVersion':manifest.get('version'),
    'updateVersion':update.get('version'),
    'moduleManifestVersion':mm.get('appVersion'),
    'serviceWorkerCache':'egt-trainer-g54-46-4' in sw,
    'analyticsLoaded': './js/core/admin-analytics-engine.js' in index,
    'analyticsBeforeAdmin': index.find('admin-analytics-engine.js') < index.find('admin-participant-engine.js'),
    'analyticsPrecached':'./js/core/admin-analytics-engine.js' in sw,
    'browserQaPassed':False
}
if version!='G54.46.4': errors.append({'type':'version','file':'js/core/app-config.js','error':version})
if manifest.get('version')!='G54.46.4': errors.append({'type':'version','file':'manifest.json','error':manifest.get('version')})
if not str(update.get('version','')).startswith('G54.46.4-'): errors.append({'type':'version','file':'update-check.json','error':update.get('version')})
if mm.get('appVersion')!='G54.46.4': errors.append({'type':'version','file':'module-manifest.json','error':mm.get('appVersion')})
if missing_index: errors.append({'type':'missing-index-resources','items':missing_index})
if missing_sw: errors.append({'type':'missing-service-worker-resources','items':missing_sw})
if not checks['analyticsBeforeAdmin']: errors.append({'type':'load-order','error':'admin analytics must load before admin engine'})

result={
  'phase':PHASE,'ok':not errors,
  'javascript':{'checked':len(set(js_files)),'failed':len([e for e in errors if e['type']=='javascript-syntax'])},
  'json':{'checked':len(json_files),'failed':len([e for e in errors if e['type']=='json-parse'])},
  'indexResources':{'checked':len(set(refs)),'missing':missing_index},
  'serviceWorkerResources':{'checked':len(sw_assets),'missing':missing_sw},
  'checks':checks,'errors':errors,
  'browserNote':'Playwright/System-Chromium navigation was blocked by ERR_BLOCKED_BY_ADMINISTRATOR; not counted as passed.'
}
out=ROOT/'release/G54.46.4_STATIC_VALIDATION.json'
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(0 if result['ok'] else 1)
