#!/usr/bin/env python3
import json, re, subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent

def txt(p):
    return (ROOT/p).read_text(encoding='utf-8', errors='ignore') if (ROOT/p).exists() else ''

def exists(p): return (ROOT/p).exists()

checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'passed':bool(ok),'detail':detail})

index=txt('index.html')
app=txt('js/core/app-config.js')
sw=txt('service-worker.js')
upd=json.loads(txt('update-check.json') or '{}')

check('AppConfig Version G54.40', "var VERSION = 'G54.40'" in app)
check('Index fallback version G54.40', 'G54.40-2026-06-20' in index)
check('Update-check version G54.40', upd.get('version')=='G54.40-2026-06-20' and upd.get('phase')=='40')
check('Service worker cache G54.40', "egt-trainer-g54-40" in sw)
check('39H CSS still linked', './css/phase39h-medium-fixes.css' in index)
check('39I CSS still linked', './css/phase39i-pixel-polish.css' in index)
check('Visual Observer loaded', './js/qa-visual-observer.js' in index and exists('js/qa-visual-observer.js'))
check('Smoke runner loaded', './js/qa-smoke-runner.js' in index and exists('js/qa-smoke-runner.js'))
for p in ['tests_phase39e_full_app_smoke.html','tests_phase39f_visual_observer.html','tests_phase39h_medium_fixes.html','tests_phase39i_pixel_polish.html']:
    check(f'QA page exists: {p}', exists(p))
for p in ['docs/PHASE39G_VISUAL_OBSERVER_REPORT.md','docs/PHASE39H_MEDIUM_FIXES_REPORT.md','docs/PHASE39I_PIXEL_POLISH_REPORT.md']:
    check(f'Prior QA report exists: {p}', exists(p))
# service worker asset integrity
assets=re.findall(r"'\.\/([^']+)'", sw)
missing=[a for a in assets if a and not exists(a)]
check('Service worker asset list resolves', len(missing)==0, ', '.join(missing[:20]))
# major modules present
for p in ['js/modules/language-course-entry-module.js','js/modules/language-exam-shell.js','admin-portal.html','manifest.json','module-manifest.json']:
    check(f'Major artifact present: {p}', exists(p))
# syntax check selected critical JS files
syntax_files=['js/core/app-config.js','js/qa-smoke-runner.js','js/qa-visual-observer.js','js/modules/language-exam-shell.js','js/modules/language-course-entry-module.js']
for f in syntax_files:
    if exists(f):
        try:
            r=subprocess.run(['node','--check',str(ROOT/f)],capture_output=True,text=True,timeout=20)
            check(f'Node syntax ok: {f}', r.returncode==0, (r.stderr or r.stdout).strip()[:500])
        except Exception as e:
            check(f'Node syntax ok: {f}', False, str(e))
    else:
        check(f'Node syntax ok: {f}', False, 'missing')
# phase result summaries, allowing old exact-version tests to fail only due forward version bump
for f in ['phase39g_static_qa_result.json','phase39i_static_qa_result.json']:
    if exists(f):
        try:
            data=json.loads(txt(f))
            ok=data.get('passed') is True or data.get('ok') is True
            check(f'Prior static result passed: {f}', ok)
        except Exception as e:
            check(f'Prior static result passed: {f}', False, str(e))
    else:
        check(f'Prior static result passed: {f}', False, 'missing')

passed=sum(1 for c in checks if c['passed'])
result={'phase':'40','title':'Golden Master QA','version':'G54.40-2026-06-20','passed':passed==len(checks),'summary':{'total':len(checks),'passed':passed,'failed':len(checks)-passed},'checks':checks,'known_limitations':['Browser/Chromium-Live-Run kann in eingeschränkten Sandboxen policybedingt blockieren; lokale/CI-Ausführung über beigelegte HTML-QA-Seiten vorgesehen.']}
Path(ROOT/'phase40_golden_master_qa_result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
