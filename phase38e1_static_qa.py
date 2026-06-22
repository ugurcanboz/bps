#!/usr/bin/env python3
import json, re, subprocess, pathlib, sys
root = pathlib.Path(__file__).resolve().parent
checks=[]
def add(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':detail})

shell=(root/'js/modules/language-exam-shell.js').read_text(encoding='utf-8')
css=(root/'css/language-course.css').read_text(encoding='utf-8')
sw=(root/'service-worker.js').read_text(encoding='utf-8')
update=json.loads((root/'update-check.json').read_text(encoding='utf-8'))

add('Shell phase 38E.1', "phase:'38E.1'" in shell)
add('Shell version 38E.1', 'G54.38E.1-exam-dashboard-progress-shell' in shell)
add('Dashboard renderer present', 'function dashboardHtml' in shell and 'Prüfungsdashboard' in shell)
add('History key present', 'language-academy-exam-shell-history-v1' in shell)
add('Archive final attempt present', 'function archiveFinalAttempt' in shell)
add('A1-B2 dashboard levels present', "['A1','A2','B1','B2']" in shell)
add('Dashboard public API present', 'dashboardHtml:dashboardHtml' in shell and 'loadHistory:loadHistory' in shell)
add('CSS dashboard grid present', '.la-exam-dashboard-grid' in css)
add('CSS mobile dashboard present', '@media (max-width:620px)' in css and '.la-exam-dashboard-grid{ grid-template-columns:1fr;' in css)
add('Service worker cache updated', "egt-g54-38e1" in sw)
add('Update check phase updated', update.get('phase') == '38E.1', str(update))
add('Update check cache updated', update.get('cache') == 'egt-g54-38e1')
add('Dashboard test file exists', (root/'tests_phase38e1_exam_dashboard.html').exists())
add('Dashboard docs file exists', (root/'docs_PHASE38E1_EXAM_DASHBOARD.md').exists())

# JS syntax check for touched shell
r=subprocess.run(['node','--check',str(root/'js/modules/language-exam-shell.js')],capture_output=True,text=True)
add('Node syntax check language-exam-shell.js', r.returncode==0, r.stderr[-500:])

# service-worker assets referenced in 38E.1 exist
missing=[]
for m in re.finditer(r"'\./([^']+)'", sw):
    rel=m.group(1)
    if rel and not (root/rel).exists():
        missing.append(rel)
add('Service worker 38E.1 assets exist', not any(x.startswith('tests_phase38e1') or x.startswith('docs_PHASE38E1') for x in missing), ', '.join(missing[:8]))

# secret check
secret_patterns=['gsk_','GROQ_API_KEY=']
front_files=list((root/'js').rglob('*.js'))+list((root/'data').rglob('*.js'))+list((root/'css').rglob('*.css'))
secret_hits=[]
for f in front_files:
    txt=f.read_text(encoding='utf-8',errors='ignore')
    for pat in secret_patterns:
        if pat in txt:
            secret_hits.append(str(f.relative_to(root))+':'+pat)
add('No obvious frontend API secrets', not secret_hits, ', '.join(secret_hits[:5]))

result={'ok':all(c['ok'] for c in checks),'phase':'38E.1','checks':checks}
(root/'phase38e1_static_qa_result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(0 if result['ok'] else 1)
