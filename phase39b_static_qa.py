from pathlib import Path
import json, re, sys
root=Path('.')
admin_js=(root/'js/admin-participant-engine.js').read_text(encoding='utf-8')
css=(root/'css/admin-portal.css').read_text(encoding='utf-8')
checks={}
checks['no_admin_touchmove_manual_scroll'] = "modal.addEventListener('touchmove'" not in admin_js and 'scrollTop += dy' not in admin_js
checks['no_admin_wheel_manual_scroll'] = "modal.addEventListener('wheel'" not in admin_js and 'scrollTop += e.deltaY' not in admin_js
checks['native_scroll_class'] = 'egt-admin-native-scroll' in admin_js and '.egt-admin-modal.egt-admin-native-scroll' in css
checks['mobile_perf_media'] = '@media (max-width: 1024px), (pointer: coarse)' in css
checks['webkit_touch_scroll'] = '-webkit-overflow-scrolling: touch' in css
checks['backdrop_removed_mobile'] = 'backdrop-filter: none !important' in css and '-webkit-backdrop-filter: none !important' in css
checks['touch_targets_48'] = 'min-height: 48px' in css
checks['nested_scroll_reduced'] = 'max-height: none !important' in css and 'overflow-y: visible !important' in css
checks['doc_exists'] = (root/'docs_PHASE39B_ADMIN_SCROLL_PERFORMANCE_FIX.md').exists()
checks['test_exists'] = (root/'tests_phase39b_admin_scroll_performance.html').exists()
result={'ok':all(checks.values()),'phase':'39B','checks':checks}
Path('phase39b_static_qa_result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
if not result['ok']:
    sys.exit(1)
