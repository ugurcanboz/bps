#!/usr/bin/env python3
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parent
checks = []
def add(name, ok, detail=''):
    checks.append({'name': name, 'ok': bool(ok), 'detail': detail})
css = ROOT/'css'/'phase39h-medium-fixes.css'
idx = ROOT/'index.html'
sw = ROOT/'service-worker.js'
css_text = css.read_text(encoding='utf-8') if css.exists() else ''
idx_text = idx.read_text(encoding='utf-8') if idx.exists() else ''
sw_text = sw.read_text(encoding='utf-8') if sw.exists() else ''
add('phase39h css exists', css.exists())
add('css linked in index', 'phase39h-medium-fixes.css' in idx_text)
add('build version bumped', 'G54.39H' in idx_text or 'G54.39H' in sw_text)
add('dock reserve variable', '--phase39h-dock-reserve' in css_text)
add('mobile dock reserve >= 156 marker', 'max(156px' in css_text)
add('tablet gate breakpoint', '@media (min-width: 769px) and (max-width: 1180px)' in css_text)
add('scroll hardening', 'overscroll-behavior' in css_text and '-webkit-overflow-scrolling' in css_text)
add('flowlogic mobile layout', '.ctc-flowlogic-host .flowlogic-input-root' in css_text and 'grid-template-columns: 1fr' in css_text)
add('test page exists', (ROOT/'tests_phase39h_medium_fixes.html').exists())
add('report exists', (ROOT/'docs'/'PHASE39H_MEDIUM_FIXES_REPORT.md').exists())
add('service worker includes css', 'phase39h-medium-fixes.css' in sw_text)
add('service worker includes qa', 'phase39h_static_qa_result.json' in sw_text)
result = {'phase':'39H','title':'MEDIUM-Befunde beheben','passed': all(c['ok'] for c in checks),'checks': checks}
(ROOT/'phase39h_static_qa_result.json').write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps(result, indent=2, ensure_ascii=False))
