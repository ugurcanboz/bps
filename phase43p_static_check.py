from pathlib import Path
checks=[]
def add(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':detail})
root=Path('.')
js=(root/'js/qa/egt-visual-state-capture.js').read_text()
idx=(root/'index.html').read_text()
cfg=(root/'js/core/app-config.js').read_text()
sw=(root/'service-worker.js').read_text()
uc=(root/'update-check.json').read_text()
add('capture_module_exists', (root/'js/qa/egt-visual-state-capture.js').exists())
add('global_api', 'window.EGTVisualStateCapture' in js)
add('auto_start_params', "qa === 'capture'" in js and "#qa-capture" in js)
add('manual_png_api', 'getDisplayMedia' in js and 'capturePngFromScreen' in js)
add('state_capture_api', 'captureCurrentState' in js and 'collectImportantElements' in js)
add('overflow_capture', 'collectOverflowFindings' in js)
add('touch_target_capture', 'collectTouchTargets' in js and 'ok44' in js)
add('json_copy_download', 'copyLastCapture' in js and 'downloadLastCapture' in js)
add('index_script_registered', 'js/qa/egt-visual-state-capture.js' in idx)
add('version_config', "var VERSION = 'G54.43.7'" in cfg)
add('version_label', 'Screenshot-Recorder / Visual-State-Capture' in cfg)
add('service_worker_cache', "egt-trainer-g54-43-7" in sw)
add('update_check', 'G54.43.7-2026-06-21' in uc)
failed=[c for c in checks if not c['ok']]
import json
out={'phase':'G54.43.7','total':len(checks),'passed':len(checks)-len(failed),'failed':len(failed),'checks':checks}
Path('phase43p_static_check_result.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
print(json.dumps(out,indent=2,ensure_ascii=False))
raise SystemExit(1 if failed else 0)
