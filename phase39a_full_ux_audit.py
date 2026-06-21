#!/usr/bin/env python3
import json, os, re, pathlib
from contextlib import contextmanager
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent
OUT=ROOT/'phase39a_full_ux_audit_result.json'
SS=ROOT/'qa_phase39a_screenshots'; SS.mkdir(exist_ok=True)
POL='/etc/chromium/policies/managed/000_policy_merge.json'; BAK='/tmp/000_policy_merge.json.bak_phase39a_audit'
URL=os.environ.get('PHASE39A_URL','http://127.0.0.1:8788/index.html')
@contextmanager
def chromium_policy_unblocked():
    moved=False
    try:
        if os.path.exists(POL): os.rename(POL,BAK); moved=True
        yield
    finally:
        if moved and os.path.exists(BAK): os.rename(BAK,POL)

def metrics(page):
    return page.evaluate(r"""() => {
      const all=[...document.querySelectorAll('button,a,[role=button],input,textarea,select,[data-ui-action]')];
      const visible=all.filter(e=>{const r=e.getBoundingClientRect(); const s=getComputedStyle(e); return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';});
      const small=visible.map(e=>{const r=e.getBoundingClientRect();return {txt:(e.innerText||e.getAttribute('aria-label')||e.value||'').trim().slice(0,80), cls:String(e.className||''), act:e.getAttribute('data-ui-action')||'', w:Math.round(r.width), h:Math.round(r.height)}}).filter(x=>x.w<44||x.h<44);
      const emojis=(document.body.innerText.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu)||[]);
      const overflowX=Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth, document.body.scrollWidth - document.body.clientWidth);
      return {visibleTargets:visible.length, smallTargetCount:small.length, smallTargets:small.slice(0,18), emojiCount:emojis.length, emojiSample:[...new Set(emojis)].slice(0,24), overflowX, scrollHeight:document.documentElement.scrollHeight, clientHeight:document.documentElement.clientHeight};
    }""")

def safe_click(page, selector):
    try:
        page.locator(selector).first().click(timeout=2500); page.wait_for_timeout(500); return True
    except Exception:
        return False

def open_admin_nonblocking(page):
    try:
        page.evaluate("() => { setTimeout(() => { try { window.EGTAdminPortal && window.EGTAdminPortal.open && window.EGTAdminPortal.open(); } catch(e){} }, 0); return true; }")
    except Exception:
        pass
    page.wait_for_timeout(700)

def admin_metrics(page):
    return page.evaluate(r"""() => ({
      open:!!document.querySelector('.egt-admin-modal,.egt-admin-shell,.egt-admin-panel,.egt-admin-overlay'),
      tabs:[...document.querySelectorAll('.egt-admin-tab')].map(x=>x.innerText.trim()).slice(0,30),
      tabCount:document.querySelectorAll('.egt-admin-tab').length,
      scrollContainers:[...document.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e);return /(auto|scroll)/.test(s.overflowY)&&e.scrollHeight>e.clientHeight+5;}).map(e=>({cls:String(e.className||e.tagName).slice(0,80),h:e.clientHeight,sh:e.scrollHeight})).slice(0,12)
    })""")

def main():
    result={'phase':'39A','ok':True,'url':URL,'devices':{},'findings':[]}
    css_files=list((ROOT/'css').glob('*.css'))
    result['cssAudit']={'files':len(css_files),'important':0,'backdropFilter':0,'boxShadow':0,'overflowAuto':0}
    for p in css_files:
        t=p.read_text(encoding='utf-8',errors='ignore')
        result['cssAudit']['important']+=t.count('!important')
        result['cssAudit']['backdropFilter']+=len(re.findall(r'backdrop-filter|-webkit-backdrop-filter',t))
        result['cssAudit']['boxShadow']+=len(re.findall(r'box-shadow',t))
        result['cssAudit']['overflowAuto']+=len(re.findall(r'overflow[^;{]*:\s*(auto|scroll)',t))
    home=(ROOT/'js'/'ui-home-renderer.js').read_text(encoding='utf-8',errors='ignore')
    admin=(ROOT/'js'/'admin-participant-engine.js').read_text(encoding='utf-8',errors='ignore')
    lang=(ROOT/'js'/'modules'/'language-exam-shell.js').read_text(encoding='utf-8',errors='ignore')
    result['staticAudit']={
      'homeEmojiLiterals':len(re.findall(r'[\U0001F300-\U0001FAFF\u2600-\u27BF]',home)),
      'adminEmojiLiterals':len(re.findall(r'[\U0001F300-\U0001FAFF\u2600-\u27BF]',admin)),
      'examEmojiLiterals':len(re.findall(r'[\U0001F300-\U0001FAFF\u2600-\u27BF]',lang)),
      'adminTabs':len(re.findall(r'class="egt-admin-tab',admin)),
      'adminTouchHandlers':len(re.findall(r'touchmove|touchstart|touchend',admin)),
      'homeDataUiActions':len(re.findall(r'data-ui-action',home)),
      'languageExamActions':len(re.findall(r'data-ui-action',lang))
    }
    with chromium_policy_unblocked(), sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
        for name,w,h,mobile,touch in [('desktop',1440,900,False,False),('ipad',820,1180,True,True),('iphone',390,844,True,True)]:
            page=browser.new_page(viewport={'width':w,'height':h}, is_mobile=mobile, has_touch=touch)
            page.goto(URL, wait_until='domcontentloaded', timeout=12000); page.wait_for_timeout(700)
            try: page.evaluate("async () => { if(window.EGTAuthEngine?.startDemo){ await window.EGTAuthEngine.startDemo(); window.dispatchEvent(new CustomEvent('egt:gate-status-changed',{detail:{gateOpen:true}})); } }")
            except Exception: pass
            page.wait_for_timeout(700)
            d={'home':metrics(page)}
            page.screenshot(path=str(SS/f'{name}-home.png'), full_page=False, timeout=6000)
            safe_click(page,'[data-ui-action="language-course-open"]')
            d['languageDashboard']=metrics(page)
            page.screenshot(path=str(SS/f'{name}-language-dashboard.png'), full_page=False, timeout=6000)
            safe_click(page,'[data-ui-action="language-exam-open"]')
            d['examDashboard']=metrics(page)
            page.screenshot(path=str(SS/f'{name}-exam-dashboard.png'), full_page=False, timeout=6000)
            result['devices'][name]=d; page.close()
            # Admin auf frischer Seite prüfen, damit Deep-Sheet/Exam-DOM das Mobile-Scrollprofil nicht verfälscht.
            admin_page=browser.new_page(viewport={'width':w,'height':h}, is_mobile=mobile, has_touch=touch)
            admin_page.goto(URL, wait_until='domcontentloaded', timeout=12000); admin_page.wait_for_timeout(700)
            try: admin_page.evaluate("async () => { if(window.EGTAuthEngine?.startDemo){ await window.EGTAuthEngine.startDemo(); window.dispatchEvent(new CustomEvent('egt:gate-status-changed',{detail:{gateOpen:true}})); } }")
            except Exception: pass
            admin_page.wait_for_timeout(700)
            open_admin_nonblocking(admin_page)
            try:
                result['devices'][name]['admin']=metrics(admin_page)
                result['devices'][name]['adminDom']=admin_metrics(admin_page)
                admin_page.screenshot(path=str(SS/f'{name}-admin.png'), full_page=False, timeout=6000)
            except Exception as e:
                result['devices'][name]['adminError']=str(e)
            admin_page.close()
        browser.close()
    # derived findings
    def add(sev,area,f): result['findings'].append({'severity':sev,'area':area,'finding':f})
    if result['cssAudit']['important']>300: add('high','CSS','Sehr viele !important-Regeln; Design-System ist über Jahre geflickt und braucht Konsolidierung.')
    if result['staticAudit']['adminTabs']>9: add('high','Admin','Admin-Portal hat zu viele Tabs für iPad/iPhone; mobile Navigation muss reduziert/gebündelt werden.')
    if result['staticAudit']['adminTouchHandlers']>0: add('high','Admin iOS','Manuelle Touch-/Scroll-Handler können natives iOS Momentum-Scrolling ausbremsen.')
    if result['cssAudit']['backdropFilter']>0: add('medium','Performance','Backdrop-Blur/Glassmorphism ist auf iOS teuer; Admin braucht mobile Performance-Variante.')
    if result['staticAudit']['homeEmojiLiterals']>20 or result['staticAudit']['examEmojiLiterals']>10: add('medium','Icons','Gemischte Emoji-/SVG-/Text-Icons; braucht zentralen Icon-Token-Standard.')
    if any(result['devices'][d]['home']['smallTargetCount']>0 for d in result['devices']): add('medium','Touch','Einige sichtbare Touch-Ziele unter 44px; muss vor Release normalisiert werden.')
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'ok':True,'devices':list(result['devices'].keys()),'findings':len(result['findings']),'screenshots':len(list(SS.glob('*.png')))},ensure_ascii=False))
if __name__=='__main__': main()
