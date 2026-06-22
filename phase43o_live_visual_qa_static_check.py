import json
from pathlib import Path
root = Path(__file__).resolve().parent
checks = []
def check(name, ok, detail=''):
    checks.append({'name': name, 'status': 'PASS' if ok else 'FAIL', 'detail': detail})
qa = root/'js/qa/egt-live-visual-qa.js'
index = (root/'index.html').read_text(encoding='utf-8')
app_config = (root/'js/core/app-config.js').read_text(encoding='utf-8')
sw = (root/'service-worker.js').read_text(encoding='utf-8')
qtxt = qa.read_text(encoding='utf-8')
check('QA file exists', qa.exists())
check('Global API present', 'window.EGTLiveVisualQA' in qtxt)
check('Auto activation query present', "params.get('qa') === 'visual'" in qtxt)
check('Auto activation hash present', "#qa-visual" in qtxt)
check('Overlay present', 'Live Visual QA' in qtxt and 'openOverlay' in qtxt)
check('Copy report present', 'copyReport' in qtxt and 'navigator.clipboard' in qtxt)
check('Analysis open fallbacks present', 'EGTAnalysisEntryModule' in qtxt and 'EGTUILayer.openActionMenu' in qtxt and 'DOM-click' in qtxt)
check('Dashboard selector present', '[data-analysis-dashboard-v2]' in qtxt and '.analysis-v2-shell' in qtxt)
check('Touch target check present', 'touch-targets' in qtxt and '< 44' in qtxt)
check('Overflow check present', 'horizontal-overflow' in qtxt and 'scrollWidth' in qtxt)
check('Bottom dock overlap check present', 'bottom-dock-overlap' in qtxt)
check('Index includes QA script', './js/qa/egt-live-visual-qa.js' in index)
check('AppConfig version updated', "var VERSION = 'G54.43.6';" in app_config)
check('Service worker cache updated', "egt-trainer-g54-43-6" in sw)
check('Test file exists', (root/'tests_phase43o_live_visual_qa_cockpit.html').exists())
check('Handoff exists', (root/'SCHICHTUEBERGABE_PHASE43O_LIVE_VISUAL_QA_COCKPIT.md').exists())
result = {'phase': 'G54.43.6', 'status': 'PASSED' if all(c['status']=='PASS' for c in checks) else 'FAILED', 'passed': sum(c['status']=='PASS' for c in checks), 'failed': sum(c['status']=='FAIL' for c in checks), 'checks': checks}
(root/'phase43o_live_visual_qa_static_result.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(result, ensure_ascii=False, indent=2))
raise SystemExit(0 if result['status']=='PASSED' else 1)
