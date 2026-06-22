from pathlib import Path
import json, re
base=Path(__file__).resolve().parent
checks=[]
def add(id, ok, detail=''):
    checks.append({'id':id,'status':'PASS' if ok else 'FAIL','detail':detail})
files={
    'vsc': base/'js/qa/egt-visual-state-capture.js',
    'css': base/'css/phase43s-iphone-scroll-qa-bubble.css',
    'app': base/'js/core/app-config.js',
    'sw': base/'service-worker.js',
    'manifest': base/'manifest.json',
    'update': base/'update-check.json',
    'test': base/'tests_phase43t_qa_bubble_interaction_fix.html',
}
text={k:p.read_text(encoding='utf-8') for k,p in files.items()}
add('vsc_version_8c', "var VERSION = 'G54.43.8C'" in text['vsc'])
add('app_version_8c', "var VERSION = 'G54.43.8C'" in text['app'])
add('manifest_version_8c', '"version": "G54.43.8C"' in text['manifest'])
add('update_check_8c', 'G54.43.8C-2026-06-21' in text['update'])
add('cache_bumped_8c', 'egt-trainer-g54-43-8c' in text['sw'] and 'egt-trainer-g54-43-8c' in text['update'])
add('direct_touch_handlers', 'ontouchend' in text['vsc'] and 'onpointerup' in text['vsc'] and "'touchend'" in text['vsc'])
add('capture_action_bound', "action === 'capture'" in text['vsc'] and 'captureCurrentState' in text['vsc'])
add('show_text_action_bound', "action === 'show'" in text['vsc'] and 'showLastCaptureText' in text['vsc'])
add('manual_textarea_fallback', 'egt-vsc__textarea' in text['vsc'] and 'Capture-JSON manuell kopieren' in text['vsc'])
add('no_app_scroll_css_touched_new_block', 'G54.43.8C · QA Bubble Interaction Fix' in text['css'] and '.egt-vsc__textarea' in text['css'])
add('buttons_min_44', 'min-width:44px' in text['css'] and 'min-height:44px' in text['css'])
add('browser_test_exists', 'bubble_opens_on_click' in text['test'] and 'capture_generated' in text['test'])
failed=[c for c in checks if c['status']=='FAIL']
out={'phase':'G54.43.8C','total':len(checks),'passed':len(checks)-len(failed),'failed':len(failed),'checks':checks}
(base/'phase43t_static_qa_bubble_interaction_result.json').write_text(json.dumps(out,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(out,indent=2,ensure_ascii=False))
if failed:
    raise SystemExit(1)
