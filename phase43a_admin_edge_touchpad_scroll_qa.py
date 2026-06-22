import json, hashlib
from pathlib import Path

checks=[]
def add(name, ok, detail=''):
    checks.append({'name': name, 'passed': bool(ok), 'detail': detail})

ui = Path('js/ui-router.js').read_text(encoding='utf-8')
admin_css = Path('css/admin-portal.css').read_bytes()
admin_html = Path('admin-portal.html').read_bytes()
orig_css_hash = '3b1ff67f16c04e0b6e8af0ffdaa294e54ef82e81a4801bc80a2a49267fbac5e0'
orig_html_hash = '5f81ee84b6066e2165610a9d20c608bc1341e1480c6d031364724052e20a4a71'
app = Path('js/core/app-config.js').read_text(encoding='utf-8')
manifest = json.loads(Path('manifest.json').read_text(encoding='utf-8'))
update = json.loads(Path('update-check.json').read_text(encoding='utf-8'))
sw = Path('service-worker.js').read_text(encoding='utf-8')
index = Path('index.html').read_text(encoding='utf-8')

add('UI-Router enthält Admin-Modal Wheel/Touchpad Bypass', "closest(target, '.egt-admin-modal.show')" in ui and 'return adminModal' in ui)
add('Bypass ist nur aktiv, wenn Admin-Modal wirklich scrollen kann', 'adminModal.scrollHeight > adminModal.clientHeight + 2' in ui)
add('WheelGuard bleibt global erhalten', "document.addEventListener('wheel', wheelGuard, {capture:true, passive:false});" in ui)
add('TouchMove Guard bleibt global erhalten', "document.addEventListener('touchmove', touchMove, {capture:true, passive:false});" in ui)
add('Admin CSS unverändert', hashlib.sha256(admin_css).hexdigest() == orig_css_hash, hashlib.sha256(admin_css).hexdigest())
add('Admin HTML unverändert', hashlib.sha256(admin_html).hexdigest() == orig_html_hash, hashlib.sha256(admin_html).hexdigest())
add('AppConfig Hotfix Version', "var VERSION = 'G54.42.1'" in app)
add('Manifest Hotfix Version', manifest.get('version') == 'G54.42.1', manifest.get('version',''))
add('Update Check Hotfix Version', update.get('version','').startswith('G54.42.1'), update.get('version',''))
add('Service Worker Hotfix Cache', 'egt-trainer-g54-42-1' in sw)
add('Index Fallback Hotfix Version', 'G54.42.1-2026-06-20' in index)

result={'phase':'43A_ADMIN_EDGE_TOUCHPAD_SCROLL_HOTFIX','passed': all(c['passed'] for c in checks), 'checks': checks}
Path('phase43a_admin_edge_touchpad_scroll_qa_result.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(result, ensure_ascii=False, indent=2))
