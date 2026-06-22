import json, threading, time
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os
root=Path(__file__).resolve().parent
result={'ok':False,'phase':'32A','devices':[],'error':None}
class Handler(SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
try:
    os.chdir(root)
    server=ThreadingHTTPServer(('127.0.0.1', 8765), Handler)
    thread=threading.Thread(target=server.serve_forever,daemon=True); thread.start(); time.sleep(.2)
    from playwright.sync_api import sync_playwright
    devices=[('desktop-1440',1440,900,False),('desktop-1024',1024,768,False),('iphone-15-pro-max',430,932,True),('iphone-se',375,667,True),('ipad-11',834,1194,True),('ipad-12-9',1024,1366,True)]
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox","--disable-dev-shm-usage"])
        for name,w,h,mobile in devices:
            page=browser.new_page(viewport={'width':w,'height':h}, is_mobile=mobile, has_touch=mobile)
            entry={'device':name,'viewport':f'{w}x{h}','ok':False}
            try:
                page.goto('http://127.0.0.1:8765/tests_phase32a_b1_course_speaking_structure.html', wait_until='networkidle', timeout=15000)
                page.wait_for_timeout(700)
                text=page.locator('#out').inner_text(timeout=5000)
                entry['ok']='❌' not in text and '✅' in text
                entry['textPreview']=text[:500]
                shot=root/f'phase32a_{name}.png'
                page.screenshot(path=str(shot), full_page=True)
                entry['screenshot']=shot.name
            except Exception as e:
                entry['error']=str(e)
            finally:
                page.close()
            result['devices'].append(entry)
        browser.close()
    server.shutdown()
    result['ok']=all(d.get('ok') for d in result['devices'])
except Exception as e:
    result['error']=str(e)
(root/'phase32a_browser_device_simulation_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False))
print(json.dumps(result,indent=2,ensure_ascii=False))
if not result.get('ok'):
    raise SystemExit(1)
