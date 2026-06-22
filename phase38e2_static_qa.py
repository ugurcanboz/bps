import json, re, subprocess, pathlib, zipfile
root=pathlib.Path(__file__).resolve().parent
result={"phase":"38E.2","checks":{},"errors":[]}
def check(name, ok, detail=""):
    result["checks"][name]={"ok":bool(ok),"detail":detail}
    if not ok: result["errors"].append(f"{name}: {detail}")
# JS syntax
js_files=list(root.rglob('*.js'))
bad=[]
for f in js_files:
    cp=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
    if cp.returncode: bad.append((str(f.relative_to(root)),cp.stderr[:300]))
check('node_js_syntax', not bad, f'{len(js_files)} JS files checked; bad={bad[:3]}')
# JSON syntax
json_files=list(root.rglob('*.json'))
badj=[]
for f in json_files:
    try: json.loads(f.read_text())
    except Exception as e: badj.append((str(f.relative_to(root)),str(e)))
check('json_syntax', not badj, f'{len(json_files)} JSON files checked; bad={badj[:3]}')
# phase markers
shell=(root/'js/modules/language-exam-shell.js').read_text()
check('phase_marker_shell', "phase:'38E.2'" in shell and 'G54.38E.2' in shell, 'Shell phase/version markers')
check('weakness_api_present', 'buildWeaknessProfile:function' not in shell and 'buildWeaknessProfile:buildWeaknessProfile' in shell and 'weaknessProfileHtml:weaknessProfileHtml' in shell, 'Exported weakness APIs')
check('weakness_ui_present', 'data-la-weakness-profile="phase38e2"' in shell and 'la-weakness-card' in (root/'css/language-course.css').read_text(), 'UI hook and CSS classes')
# service worker assets
sw=(root/'service-worker.js').read_text()
assets=re.findall(r"'([^']+)'", sw[sw.find('var ASSETS'): sw.find('];', sw.find('var ASSETS'))])
missing=[]
for a in assets:
    if a in ('./','/'): continue
    p=root/a.replace('./','',1)
    if not p.exists(): missing.append(a)
check('service_worker_assets', not missing, f'{len(assets)} assets; missing={missing[:10]}')
check('service_worker_cache', 'egt-g54-38e2' in sw, 'Cache name updated')
# secret check
secret_hits=[]
for f in list(root.rglob('*.js'))+list(root.rglob('*.html'))+list(root.rglob('*.md'))+list(root.rglob('*.json')):
    txt=f.read_text(errors='ignore')
    if re.search(r'gsk_[A-Za-z0-9_\-]{20,}',txt) or 'GROQ_API_KEY=' in txt:
        secret_hits.append(str(f.relative_to(root)))
check('secret_check', not secret_hits, f'hits={secret_hits[:5]}')
# root deploy files
check('root_index_404', (root/'index.html').exists() and (root/'404.html').exists(), 'index.html and 404.html in root')
# node runtime diagnostics
runner=root/'phase38e2_node_diag_runner.js'
runner.write_text(r"""
const fs=require('fs'), vm=require('vm'), path=require('path');
const root=__dirname;
global.window=global;
global.document={querySelectorAll:()=>[],getElementById:()=>null,createElement:()=>({}),body:{appendChild:()=>{}},addEventListener:()=>{}};
global.localStorage={_:{},getItem(k){return this._[k]||null},setItem(k,v){this._[k]=String(v)},removeItem(k){delete this._[k]}};
function load(p){ vm.runInThisContext(fs.readFileSync(path.join(root,p),'utf8'),{filename:p}); }
['data/language-exam-blueprints.js','data/language-level-difficulty-rules.js','data/language-b1-exam-pilot.js','data/language-b2-exam-pilot.js','js/modules/language-exam-engine.js','js/modules/language-exam-shell.js'].forEach(load);
const diag=window.LanguageExamShell.diagnostics();
const profile=window.LanguageExamShell.buildWeaknessProfile('B2',{level:'B2',completedParts:5,partScores:{reading:82,listening:44,grammar:61,writing:74,speaking:88}});
console.log(JSON.stringify({diag,first:profile.priority[0].part,count:profile.entries.length,action:profile.action}));
process.exit(0);
""")
cp=subprocess.run(['node',str(runner)],capture_output=True,text=True,cwd=root,timeout=20)
try:
    out=json.loads(cp.stdout)
    ok=cp.returncode==0 and out['diag']['phase']=='38E.2' and out['first']=='listening' and out['count']==5
    detail=json.dumps(out,ensure_ascii=False)
except Exception as e:
    ok=False; detail=cp.stderr or cp.stdout or str(e)
check('node_runtime_diagnostics', ok, detail[:1000])
(root/'phase38e2_static_qa_result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False,indent=2))
