import json, os, socket, threading, time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'docs'/'PHASE39G_VISUAL_OBSERVER_REPORT.md'
JSON_OUT=ROOT/'phase39g_visual_observer_result.json'
SCREEN_DIR=ROOT/'qa_phase39g_screenshots'
SCREEN_DIR.mkdir(exist_ok=True)

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args): pass

def free_port():
    s=socket.socket(); s.bind(('127.0.0.1',0)); p=s.getsockname()[1]; s.close(); return p

def normalize_issue(issue, viewport, stage='final'):
    sev=(issue.get('severity') or 'low').lower()
    if sev not in ('high','medium','low'): sev='low'
    return {
        'severity': sev,
        'viewport': viewport,
        'stage': stage,
        'type': issue.get('type','unknown'),
        'message': issue.get('message',''),
        'path': issue.get('path',''),
        'label': issue.get('label',''),
        'rect': issue.get('rect') or {}
    }

def summarize(res, viewport):
    issues=[]
    for key in ('start','final'):
        for i in (res.get(key,{}).get('issues') or []):
            issues.append(normalize_issue(i, viewport, key))
    # de-dupe
    seen=set(); ded=[]
    for i in issues:
        k=(i['severity'],i['viewport'],i['type'],i['message'],i['path'],i['label'])
        if k in seen: continue
        seen.add(k); ded.append(i)
    return ded

viewports={
 'iphone': {'width':390,'height':844,'is_mobile':True},
 'ipad': {'width':820,'height':1180,'is_mobile':True},
 'desktop': {'width':1440,'height':900,'is_mobile':False},
}

port=free_port()
os.chdir(ROOT)
server=ThreadingHTTPServer(('127.0.0.1',port), Handler)
th=threading.Thread(target=server.serve_forever, daemon=True); th.start()
base=f'http://localhost:{port}'
results={'phase':'39G','source_zip':'G54.39F','generated_at':time.strftime('%Y-%m-%dT%H:%M:%S'), 'base_url':base, 'viewports':{}, 'issues':[]}

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-web-security','--disable-features=BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessSendPreflights'])
    for name,vp in viewports.items():
        ctx=browser.new_context(viewport={'width':vp['width'],'height':vp['height']}, is_mobile=vp['is_mobile'], device_scale_factor=2 if vp['is_mobile'] else 1)
        page=ctx.new_page()
        console=[]; errors=[]
        page.on('console', lambda msg: console.append({'type':msg.type,'text':msg.text[:500]}))
        page.on('pageerror', lambda err: errors.append(str(err)[:800]))
        page.goto(base+'/index.html?qa=1&visualObserver=39g&vp='+name, wait_until='networkidle', timeout=30000)
        page.wait_for_timeout(1200)
        # inject if needed
        if not page.evaluate("!!window.Phase39FVisualObserver"):
            page.add_script_tag(path=str(ROOT/'js'/'qa-visual-observer.js'))
            page.wait_for_timeout(500)
        res=page.evaluate("""async () => {
          const o=window.Phase39FVisualObserver;
          if(!o) return {error:'observer_missing'};
          return await o.runFullObservation({initialWait:500, actionWait:250, tabWait:180});
        }""")
        shot=str(SCREEN_DIR/f'{name}-phase39g-final.png')
        page.screenshot(path=shot, full_page=True)
        issues=summarize(res if isinstance(res,dict) else {}, name)
        # Add runtime errors as high/medium
        for e in errors:
            issues.append({'severity':'high','viewport':name,'stage':'runtime','type':'page-error','message':e,'path':'','label':'','rect':{}})
        bad_console=[c for c in console if c['type'] in ('error','warning')]
        for c in bad_console[:20]:
            sev='high' if c['type']=='error' else 'low'
            issues.append({'severity':sev,'viewport':name,'stage':'console','type':'console-'+c['type'],'message':c['text'],'path':'','label':'','rect':{}})
        results['viewports'][name]={'size':vp,'observerSummary':(res or {}).get('summary') if isinstance(res,dict) else None,'screenshot':str(Path(shot).relative_to(ROOT)),'issue_count':len(issues),'console_count':len(console),'page_errors':errors}
        results['issues'].extend(issues)
        ctx.close()
    browser.close()
server.shutdown()

# overall de-dupe
seen=set(); cleaned=[]
for i in results['issues']:
    k=(i['severity'],i['viewport'],i['type'],i['message'],i.get('path',''),i.get('label',''))
    if k not in seen:
        seen.add(k); cleaned.append(i)
results['issues']=cleaned
counts={s:sum(1 for i in cleaned if i['severity']==s) for s in ('high','medium','low')}
results['summary']={'ok':counts['high']==0,'counts':counts,'total':len(cleaned)}
JSON_OUT.write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')

def table_rows(sev):
    rows=[i for i in cleaned if i['severity']==sev]
    if not rows:
        return '| - | - | - | - | - |\n| Keine Befunde | - | - | - | - |'
    out='| Viewport | Typ | Befund | Element | Priorität |\n|---|---|---|---|---|\n'
    for i in rows[:80]:
        msg=(i['message'] or '').replace('\n',' ').replace('|','/')[:260]
        el=((i.get('label') or i.get('path') or '-')).replace('\n',' ').replace('|','/')[:140]
        out+=f"| {i['viewport']} | {i['type']} | {msg} | {el} | {sev.upper()} |\n"
    return out.rstrip()

md=f"""# Phase 39G – Visual Observer Report ausführen/auswerten

Stand: {results['generated_at']}  
Basis: `Eignungstest-Trainer-G54.39F-Visual-Observer-QA-Cockpit.zip`  
Ausführung: Chromium Headless über `index.html?qa=1&visualObserver=39g` mit QA-Bypass und Visual Observer API.

## Ergebnisübersicht

| Kategorie | Anzahl |
|---|---:|
| HIGH | {counts['high']} |
| MEDIUM | {counts['medium']} |
| LOW | {counts['low']} |
| Gesamt | {len(cleaned)} |

Bewertung: **{'BESTANDEN – keine HIGH-Blocker' if counts['high']==0 else 'NICHT BESTANDEN – HIGH-Blocker vorhanden'}**

## Getestete Viewports

| Viewport | Größe | Screenshot | Befunde |
|---|---:|---|---:|
"""
for n,v in results['viewports'].items():
    md+=f"| {n} | {v['size']['width']}×{v['size']['height']} | `{v['screenshot']}` | {v['issue_count']} |\n"
md += f"""

## HIGH – kritische Fehler

{table_rows('high')}

## MEDIUM – echte UI-/UX-Probleme

{table_rows('medium')}

## LOW – kosmetische/technische Hinweise

{table_rows('low')}

## Interpretation

Die Phase 39F hat das Observer-Werkzeug bereitgestellt. Phase 39G hat dieses Werkzeug gegen echte Browser-Viewports ausgeführt und daraus eine priorisierte Fehlerliste erzeugt. Der nächste sinnvolle Schritt ist Phase 39H: zuerst ausschließlich HIGH-Befunde beheben, ohne neue Features oder große Umbauten einzubauen.

## Artefakte

- Rohdaten: `phase39g_visual_observer_result.json`
- Screenshots: `qa_phase39g_screenshots/`
- Report: `docs/PHASE39G_VISUAL_OBSERVER_REPORT.md`
"""
OUT.write_text(md,encoding='utf-8')
print(json.dumps(results['summary'],ensure_ascii=False,indent=2))
print('Report', OUT)
