import json, threading, http.server, socketserver, time
from pathlib import Path
root=Path(__file__).resolve().parent
result={'pass':False,'phase':'32D','version':'G54.20','devices':['desktop-1440','desktop-1024','iphone-15-pro-max','iphone-se','ipad-11','ipad-12-9'],'screenshots':[],'error':None,'note':None}
PORT=8932
class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
try:
    import os
    os.chdir(root)
    httpd=socketserver.TCPServer(('127.0.0.1',PORT),Handler)
    thread=threading.Thread(target=httpd.serve_forever,daemon=True); thread.start()
    from playwright.sync_api import sync_playwright
    profiles=[('desktop-1440',1440,900,False),('desktop-1024',1024,768,False),('iphone-15-pro-max',430,932,True),('iphone-se',375,667,True),('ipad-11',834,1194,True),('ipad-12-9',1024,1366,True)]
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        for name,w,h,mobile in profiles:
            ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile)
            page=ctx.new_page()
            page.goto(f'http://127.0.0.1:{PORT}/tests_phase32c_b1_lessons_6_10_content_speaking_expansion.html',wait_until='domcontentloaded',timeout=10000)
            title=page.title()
            body=page.inner_text('body')[:3000]
            shot=f'phase32d_{name}.png'
            page.screenshot(path=str(root/shot),full_page=True)
            result['screenshots'].append({'device':name,'file':shot,'title':title,'bodyPreview':body[:300]})
            ctx.close()
        browser.close()
    result['pass']=True
    result['note']='Playwright Chromium render completed.'
except Exception as e:
    result['error']=repr(e)
    result['note']='Render attempt failed in this container; browser test files remain available for real-device and GitHub Pages testing.'
finally:
    try: httpd.shutdown()
    except Exception: pass
(root/'phase32d_device_simulation_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(result,indent=2,ensure_ascii=False))
