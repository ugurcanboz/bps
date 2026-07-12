from __future__ import annotations
import json, re, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PHASE='G54.46.5'
errors=[]
js_files=[]
for ext in ('*.js','*.cjs','*.mjs'):
    js_files += [p for p in ROOT.rglob(ext) if 'node_modules' not in p.parts and not p.name.endswith('.bak')]
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
    if ref: refs.append(ref)
missing_index=[ref for ref in sorted(set(refs)) if not (ROOT/ref).exists()]

sw=(ROOT/'service-worker.js').read_text(encoding='utf-8')
asset_block=re.search(r'var\s+ASSETS\s*=\s*\[(.*?)\];',sw,re.S)
sw_assets=re.findall(r'["\']([^"\']+)["\']',asset_block.group(1)) if asset_block else []
missing_sw=[]
for raw in sw_assets:
    ref=clean_ref(raw)
    if ref and not (ROOT/ref).exists(): missing_sw.append(ref)

app=(ROOT/'js/core/app-config.js').read_text(encoding='utf-8')
manifest=json.loads((ROOT/'manifest.json').read_text())
update=json.loads((ROOT/'update-check.json').read_text())
mm=json.loads((ROOT/'module-manifest.json').read_text())
visual_path=ROOT/'release/G54.46.5_VISUAL_QA_RESULT.json'
visual=json.loads(visual_path.read_text()) if visual_path.exists() else {}
version_match=re.search(r"var VERSION = '([^']+)'",app)
version=version_match.group(1) if version_match else ''
release_css='./css/admin-release-polish.css'
checks={
    'appVersion':version,
    'manifestVersion':manifest.get('version'),
    'updateVersion':update.get('version'),
    'moduleManifestVersion':mm.get('appVersion'),
    'serviceWorkerCache':'egt-trainer-g54-46-5' in sw,
    'releaseCssLoaded':release_css in index,
    'releaseCssPrecached':release_css in sw,
    'releaseCssAfterAdminBase':index.find(release_css)>index.rfind('admin-portal.css'),
    'adminEngineLoaded':'./js/admin-participant-engine.js' in index,
    'isolatedVisualQaPassed':visual.get('status')=='passed' and visual.get('passedDevices')==visual.get('totalDevices')==3,
    'fullAppBrowserQaPassed':False
}
if version!='G54.46.5': errors.append({'type':'version','file':'js/core/app-config.js','error':version})
if manifest.get('version')!='G54.46.5': errors.append({'type':'version','file':'manifest.json','error':manifest.get('version')})
if not str(update.get('version','')).startswith('G54.46.5-'): errors.append({'type':'version','file':'update-check.json','error':update.get('version')})
if mm.get('appVersion')!='G54.46.5': errors.append({'type':'version','file':'module-manifest.json','error':mm.get('appVersion')})
if missing_index: errors.append({'type':'missing-index-resources','items':missing_index})
if missing_sw: errors.append({'type':'missing-service-worker-resources','items':missing_sw})
for key in ('serviceWorkerCache','releaseCssLoaded','releaseCssPrecached','releaseCssAfterAdminBase','adminEngineLoaded','isolatedVisualQaPassed'):
    if not checks[key]: errors.append({'type':'integration-check','check':key})

result={
  'phase':PHASE,'ok':not errors,
  'javascript':{'checked':len(set(js_files)),'failed':len([e for e in errors if e['type']=='javascript-syntax'])},
  'json':{'checked':len(json_files),'failed':len([e for e in errors if e['type']=='json-parse'])},
  'indexResources':{'checked':len(set(refs)),'missing':missing_index},
  'serviceWorkerResources':{'checked':len(sw_assets),'missing':missing_sw},
  'checks':checks,'errors':errors,
  'browserNote':'Die responsive UI wurde isoliert mit produktiver CSS über page.set_content geprüft. Der vollständige lokale App-E2E-Lauf bleibt wegen der bekannten Navigationsrichtlinie ein separates Gate.'
}
out=ROOT/'release/G54.46.5_STATIC_VALIDATION.json'
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(0 if result['ok'] else 1)
