#!/usr/bin/env python3
"""Phase 38D.8 visual/deploy QA for the static GitHub-Pages build.
Runs Chromium headless through the DevTools Protocol against a local HTTP server.
"""
from __future__ import annotations
import base64, json, os, shutil, socket, subprocess, sys, time, urllib.request
from pathlib import Path
from typing import Any, Dict, List

try:
    import websocket  # type: ignore
except Exception as exc:
    print(json.dumps({"ok": False, "error": f"websocket-client missing: {exc}"}, ensure_ascii=False, indent=2))
    sys.exit(2)

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "phase38d8_visual_deploy_qa_result.json"
SHOT_DIR = ROOT / "qa_phase38d8_screenshots"
PORT = int(os.environ.get("PHASE38D8_HTTP_PORT", "8765"))
CDP_PORT = int(os.environ.get("PHASE38D8_CDP_PORT", "9228"))
URL = f"http://127.0.0.1:{PORT}/index.html?phase38d8={int(time.time())}"
DEVICES = [
    {"name": "desktop-1440x900", "width": 1440, "height": 900, "deviceScaleFactor": 1, "mobile": False, "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome Phase38D8 Desktop"},
    {"name": "ipad-820x1180", "width": 820, "height": 1180, "deviceScaleFactor": 2, "mobile": True, "userAgent": "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1"},
    {"name": "iphone-390x844", "width": 390, "height": 844, "deviceScaleFactor": 3, "mobile": True, "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1"},
]

class CDP:
    def __init__(self, ws_url: str):
        self.ws = websocket.create_connection(ws_url, timeout=5)
        self.msg_id = 0
        self.events: List[Dict[str, Any]] = []
    def call(self, method: str, params: Dict[str, Any] | None = None, timeout: float = 10) -> Dict[str, Any]:
        self.msg_id += 1
        ident = self.msg_id
        self.ws.send(json.dumps({"id": ident, "method": method, "params": params or {}}))
        end = time.time() + timeout
        while time.time() < end:
            raw = self.ws.recv()
            msg = json.loads(raw)
            if msg.get("id") == ident:
                if "error" in msg:
                    raise RuntimeError(f"CDP {method} failed: {msg['error']}")
                return msg.get("result", {})
            self.events.append(msg)
        raise TimeoutError(method)
    def drain(self, seconds: float = 0.2) -> List[Dict[str, Any]]:
        old_timeout = self.ws.gettimeout()
        self.ws.settimeout(0.05)
        end = time.time() + seconds
        out = []
        while time.time() < end:
            try:
                msg = json.loads(self.ws.recv())
                out.append(msg)
                self.events.append(msg)
            except Exception:
                pass
        self.ws.settimeout(old_timeout)
        return out
    def close(self):
        try: self.ws.close()
        except Exception: pass

def wait_http(url: str, timeout: float = 10) -> None:
    end = time.time() + timeout
    last = None
    while time.time() < end:
        try:
            with urllib.request.urlopen(url, timeout=1) as r:
                if r.status < 500:
                    return
        except Exception as exc:
            last = exc
            time.sleep(0.15)
    raise RuntimeError(f"HTTP not ready: {url} ({last})")

def new_target_url(cdp_port: int, url: str) -> str:
    # Prefer the first real page target from Chromium launched with URL.
    with urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json/list", timeout=5) as r:
        items = json.loads(r.read().decode("utf-8"))
    for item in items:
        if item.get("type") == "page" and item.get("webSocketDebuggerUrl"):
            return item["webSocketDebuggerUrl"]
    req = urllib.request.Request(f"http://127.0.0.1:{cdp_port}/json/new?{urllib.request.quote(url, safe='')}", method="PUT")
    with urllib.request.urlopen(req, timeout=5) as r:
        data = json.loads(r.read().decode("utf-8"))
    return data["webSocketDebuggerUrl"]

def eval_js(cdp: CDP, expr: str, await_promise: bool = False) -> Any:
    res = cdp.call("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": await_promise, "userGesture": True}, timeout=20)
    if "exceptionDetails" in res:
        raise RuntimeError(json.dumps(res["exceptionDetails"], ensure_ascii=False))
    return res.get("result", {}).get("value")

MEASURE_JS = r"""
(() => {
  function rgb(s){
    const m=String(s||'').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
    if(!m) return null;
    return {r:+m[1],g:+m[2],b:+m[3],a:m[4]===undefined?1:+m[4]};
  }
  function lum(c){
    const vals=[c.r,c.g,c.b].map(v=>{v/=255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});
    return .2126*vals[0]+.7152*vals[1]+.0722*vals[2];
  }
  function contrast(a,b){ const L1=lum(a), L2=lum(b); return +(((Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05)).toFixed(2)); }
  function effectiveBg(el){
    let n=el;
    while(n && n.nodeType===1){
      const c=rgb(getComputedStyle(n).backgroundColor);
      if(c && c.a>0.2) return c;
      n=n.parentElement;
    }
    return {r:8,g:18,b:34,a:1};
  }
  const sheet=document.querySelector('.ui-sheet.ui-deep-sheet[data-ui-deep-sheet="language-exam-shell"]') || document.querySelector('#language-exam-shell-fallback');
  const deepBody=document.querySelector('.ui-sheet.ui-deep-sheet[data-ui-deep-sheet="language-exam-shell"] .ui-deep-body') || sheet;
  const shell=document.querySelector('.la-exam-shell');
  const controls=[...document.querySelectorAll('.la-primary,.la-secondary,.la-exam-part-tab,.la-answer-choice')].map(el=>{ const r=el.getBoundingClientRect(); return {tag:el.tagName, cls:el.className, w:Math.round(r.width), h:Math.round(r.height), text:(el.textContent||'').trim().slice(0,50)}; });
  const shortControls=controls.filter(x=>x.w>0 && x.h>0 && (x.h<44 || x.w<44));
  const sampleSelectors=['.ui-deep-head','.la-exam-session-head','.la-exam-task','.la-exam-question','.la-answer-choice','.la-exam-warning','.la-exam-score','.la-exam-final'];
  const contrastSamples=[];
  for(const sel of sampleSelectors){
    const el=document.querySelector(sel);
    if(!el) continue;
    const cs=getComputedStyle(el); const fg=rgb(cs.color); const bg=effectiveBg(el);
    contrastSamples.push({selector:sel, color:cs.color, bg:`rgb(${bg.r}, ${bg.g}, ${bg.b})`, ratio:fg?contrast(fg,bg):0, text:(el.textContent||'').trim().slice(0,60)});
  }
  const tableScroll=document.querySelector('.la-exam-table-scroll');
  return {
    url:location.href,
    viewport:{w:innerWidth,h:innerHeight,dpr:devicePixelRatio},
    hasShell:!!sheet,
    hasDeepBody:!!deepBody,
    hasLanguageExamShell:!!window.LanguageExamShell,
    hasEngine:!!window.LanguageExamEngine,
    diagnostics: window.LanguageExamShell && window.LanguageExamShell.diagnostics ? window.LanguageExamShell.diagnostics() : null,
    shellData: shell ? shell.getAttribute('data-la-exam-shell') : null,
    level: shell ? shell.getAttribute('data-la-exam-level') : null,
    pageXOverflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    bodyXOverflow: deepBody ? Math.max(0, deepBody.scrollWidth - deepBody.clientWidth) : null,
    sheetRect: sheet ? (()=>{const r=sheet.getBoundingClientRect(); return {x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height)}})() : null,
    deepBodyRect: deepBody ? (()=>{const r=deepBody.getBoundingClientRect(); return {x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height), scrollH:deepBody.scrollHeight, clientH:deepBody.clientHeight}})() : null,
    partTabs: document.querySelectorAll('.la-exam-part-tab').length,
    answerChoices: document.querySelectorAll('.la-answer-choice').length,
    primaryButtons: document.querySelectorAll('.la-primary').length,
    secondaryButtons: document.querySelectorAll('.la-secondary').length,
    stickyActions: (()=>{const el=document.querySelector('.la-level-actions'); if(!el) return null; const st=getComputedStyle(el); const r=el.getBoundingClientRect(); return {position:st.position, bottom:st.bottom, h:Math.round(r.height), visible:r.height>0 && r.width>0};})(),
    tableScroll: tableScroll ? {clientWidth:tableScroll.clientWidth, scrollWidth:tableScroll.scrollWidth, overflowX:getComputedStyle(tableScroll).overflowX} : null,
    contrastSamples,
    contrastOk: contrastSamples.every(x=>x.ratio>=4.5 || x.selector==='.la-exam-warning'),
    shortControls: shortControls.slice(0,8),
    touchTargetsOk: shortControls.length===0,
    noHorizontalOverflow: Math.max(0, document.documentElement.scrollWidth - innerWidth) <= 8 && (!deepBody || Math.max(0, deepBody.scrollWidth - deepBody.clientWidth) <= 8 || !!tableScroll),
    finalVisible: !!document.querySelector('.la-exam-final'),
    resultTableWrapped: !!tableScroll,
    updatedAt: new Date().toISOString()
  };
})()
"""


def run_device(cdp: CDP, device: Dict[str, Any]) -> Dict[str, Any]:
    cdp.call("Emulation.setDeviceMetricsOverride", {
        "width": device["width"], "height": device["height"], "deviceScaleFactor": device["deviceScaleFactor"], "mobile": device["mobile"],
    })
    cdp.call("Network.setUserAgentOverride", {"userAgent": device["userAgent"]})
    cdp.call("Page.navigate", {"url": URL + "&device=" + device["name"]})
    load = None
    for _ in range(40):
        time.sleep(0.25)
        cdp.drain(0.05)
        try:
            load = eval_js(cdp, "({href:location.href, ready:document.readyState, title:document.title, hasShell:!!window.LanguageExamShell, hasEngine:!!window.LanguageExamEngine})")
        except Exception:
            continue
        if load and str(load.get('href','')).startswith('http://127.0.0.1') and load.get('ready') == 'complete' and load.get('hasShell') and load.get('hasEngine'):
            break
    if not load:
        load = {"ready":"unknown", "hasShell":False, "hasEngine":False}
    # Home sheet
    eval_js(cdp, "try{ localStorage.clear(); }catch(e){}; window.LanguageExamShell && window.LanguageExamShell.open && window.LanguageExamShell.open();")
    time.sleep(0.4)
    home = eval_js(cdp, MEASURE_JS)
    # B2 active reading view
    eval_js(cdp, "window.LanguageExamShell && window.LanguageExamShell.start && window.LanguageExamShell.start('B2');")
    time.sleep(0.6)
    reading = eval_js(cdp, MEASURE_JS)
    # Full final report using built-in QA session
    eval_js(cdp, "(() => { const diag=window.LanguageExamShell.diagnostics(); const s=window.LanguageExamEngine.createB2FullQaSession('strong-pass'); s.currentPart='speaking'; localStorage.setItem(diag.storageKey, JSON.stringify(s)); window.LanguageExamShell.resume(); })()")
    time.sleep(0.6)
    final = eval_js(cdp, MEASURE_JS)
    eval_js(cdp, "(() => { const el=document.querySelector('.la-exam-final'); if(el) el.scrollIntoView({block:'start'}); })()")
    time.sleep(0.25)
    screenshot_path = SHOT_DIR / f"{device['name']}-b2-final.png"
    shot = cdp.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False}, timeout=20)
    screenshot_path.write_bytes(base64.b64decode(shot["data"]))
    checks = [
        {"name":"app-loaded", "ok": bool(load.get("hasShell") and load.get("hasEngine")), "details": load},
        {"name":"home-opens", "ok": bool(home.get("hasShell") and home.get("shellData") == "phase38d8"), "details": {"shellData":home.get("shellData"), "overflow":home.get("pageXOverflow")}},
        {"name":"b2-session-opens", "ok": bool(reading.get("level") == "B2" and reading.get("partTabs") == 5), "details": {"level":reading.get("level"), "partTabs":reading.get("partTabs"), "answers":reading.get("answerChoices")}},
        {"name":"touch-targets", "ok": bool(reading.get("touchTargetsOk") and final.get("touchTargetsOk")), "details": {"readingShort":reading.get("shortControls"), "finalShort":final.get("shortControls")}},
        {"name":"no-horizontal-overflow", "ok": bool(reading.get("noHorizontalOverflow") and final.get("noHorizontalOverflow")), "details": {"reading":{"page":reading.get("pageXOverflow"),"body":reading.get("bodyXOverflow")}, "final":{"page":final.get("pageXOverflow"),"body":final.get("bodyXOverflow")}}},
        {"name":"final-report-visible", "ok": bool(final.get("finalVisible") and final.get("resultTableWrapped")), "details": {"finalVisible":final.get("finalVisible"), "table":final.get("tableScroll")}},
        {"name":"diagnostics-phase", "ok": bool(final.get("diagnostics") and final["diagnostics"].get("phase") == "38D.8"), "details": final.get("diagnostics")},
        {"name":"contrast-samples", "ok": bool(reading.get("contrastOk") and final.get("contrastOk")), "details": {"reading":reading.get("contrastSamples"), "final":final.get("contrastSamples")}},
    ]
    return {"device": device, "load": load, "home": home, "reading": reading, "final": final, "checks": checks, "ok": all(c["ok"] for c in checks), "screenshot": str(screenshot_path.relative_to(ROOT))}


def static_checks() -> List[Dict[str, Any]]:
    checks=[]
    checks.append({"name":"root-index-present", "ok": (ROOT/'index.html').exists()})
    checks.append({"name":"root-404-present", "ok": (ROOT/'404.html').exists()})
    upd=json.loads((ROOT/'update-check.json').read_text(encoding='utf-8'))
    checks.append({"name":"update-check-phase", "ok": upd.get('phase')=='38D.8' and upd.get('cache')=='egt-g54-38d8', "details":upd})
    sw=(ROOT/'service-worker.js').read_text(encoding='utf-8')
    checks.append({"name":"service-worker-cache", "ok": "egt-g54-38d8" in sw})
    for asset in ['docs_PHASE38D8_VISUAL_DEPLOY_QA.md','tests_phase38d8_visual_deploy_qa.html','phase38d8_visual_deploy_qa.py','phase38d8_visual_deploy_qa_result.json']:
        checks.append({"name":"asset-present-"+asset, "ok": (ROOT/asset).exists()})
        checks.append({"name":"asset-in-service-worker-"+asset, "ok": f"'./{asset}'" in sw or f'"./{asset}"' in sw})
    return checks


def main() -> int:
    SHOT_DIR.mkdir(exist_ok=True)
    for old in SHOT_DIR.glob('*.png'):
        old.unlink()
    server = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '--bind', '127.0.0.1'], cwd=str(ROOT), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    chrome_path = shutil.which('chromium') or shutil.which('google-chrome') or shutil.which('chromium-browser')
    if not chrome_path:
        raise RuntimeError('Chromium not found')
    user_data = Path('/tmp/phase38d8_chrome_profile')
    if user_data.exists(): shutil.rmtree(user_data, ignore_errors=True)
    chrome = subprocess.Popen([
        chrome_path, '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--remote-allow-origins=*',
        f'--remote-debugging-port={CDP_PORT}', f'--user-data-dir={user_data}', URL
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    result: Dict[str, Any] = {"phase":"38D.8", "ok": False, "devices": [], "staticChecks": [], "errors": [], "url": URL, "generatedAt": time.strftime('%Y-%m-%dT%H:%M:%S%z')}
    cdp = None
    try:
        wait_http(f"http://127.0.0.1:{PORT}/index.html")
        wait_http(f"http://127.0.0.1:{CDP_PORT}/json/version")
        ws_url = new_target_url(CDP_PORT, URL)
        cdp = CDP(ws_url)
        cdp.call('Page.enable')
        cdp.call('Runtime.enable')
        cdp.call('Network.enable')
        result['staticChecks'] = static_checks()
        for device in DEVICES:
            result['devices'].append(run_device(cdp, device))
        result['ok'] = all(c.get('ok') for c in result['staticChecks']) and all(d.get('ok') for d in result['devices'])
    except Exception as exc:
        result['errors'].append(str(exc))
        result['ok'] = False
    finally:
        if cdp: cdp.close()
        chrome.terminate(); server.terminate()
        try: chrome.wait(timeout=3)
        except Exception: chrome.kill()
        try: server.wait(timeout=3)
        except Exception: server.kill()
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({"ok": result['ok'], "phase": result['phase'], "devices": [d.get('device',{}).get('name') for d in result.get('devices',[])], "errors": result.get('errors',[])}, ensure_ascii=False, indent=2))
    return 0 if result['ok'] else 1

if __name__ == '__main__':
    sys.exit(main())
