import json
from pathlib import Path
root = Path(__file__).resolve().parent
checks=[]
def add(id, ok, details=''):
    checks.append({'id':id,'status':'PASS' if ok else 'FAIL','details':details})

def read(rel): return (root/rel).read_text(encoding='utf-8')
idx=read('index.html')
cfg=read('js/core/app-config.js')
css=read('css/phase43s-iphone-scroll-qa-bubble.css')
js=read('js/modules/iphone-scroll-qa-hotfix.js')
vsc=read('js/qa/egt-visual-state-capture.js')
sw=read('service-worker.js')
upd=read('update-check.json')
manifest=read('manifest.json')
add('app_config_8b', "var VERSION = 'G54.43.8B'" in cfg)
add('css_loaded_last', './css/phase43s-iphone-scroll-qa-bubble.css' in idx)
add('scroll_guard_loaded', './js/modules/iphone-scroll-qa-hotfix.js' in idx)
add('css_mobile_sheet_rules', '.ui-sheet.ui-deep-sheet.show' in css and 'overflow-y:auto' in css and '-webkit-overflow-scrolling:touch' in css)
add('css_no_has_dependency', ':has(' not in css)
add('qa_bubble_rules', '.egt-vsc[data-minimized="true"]' in css and "content:'QA'" in css)
add('scroll_guard_global', 'window.EGTIPhoneScrollHotfix' in js)
add('scroll_guard_mutation', 'MutationObserver' in js and 'egt-deep-sheet-active' in js)
add('vsc_version_8b', "var VERSION = 'G54.43.8B'" in vsc)
add('vsc_event_delegation', "closest('button[data-action]')" in vsc)
add('vsc_default_minimized', "el.setAttribute('data-minimized', 'true')" in vsc)
add('service_worker_cache_8b', "egt-trainer-g54-43-8b" in sw)
add('update_check_8b', 'G54.43.8B-2026-06-21' in upd)
add('manifest_8b', '"version": "G54.43.8B"' in manifest)
add('test_file_present', (root/'tests_phase43s_iphone_scroll_qa_bubble.html').exists())
failed=[c for c in checks if c['status']=='FAIL']
out={'phase':'G54.43.8B','total':len(checks),'passed':len(checks)-len(failed),'failed':len(failed),'checks':checks}
(root/'phase43s_static_scroll_qa_result.json').write_text(json.dumps(out,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(out,indent=2,ensure_ascii=False))
if failed: raise SystemExit(1)
