/* Eignungstest-Trainer V7.6.0 · Architecture Guard
   Prüft Core/State/Module/UI-Basis, ohne bestehende V7.3.1/V7.4.0-UI zu ersetzen. */
(function(){
  "use strict";
  if(window.ArchitectureGuard && window.ArchitectureGuard.__version === "7.6.0") return;
  const VERSION = "7.6.0";
  const REQUIRED_IDS = ["start","appNav","sectionIntro","modeGrid","premiumDashboard","mobileTopNav"];
  const REQUIRED_GLOBALS = ["AppConfig","AppState","AppEvents","AppRouter","AppSchema","FeatureGates","AppComponents","TrainerModules","AppModuleLoader","App"];
  const REQUIRED_FILES = [
    "./css/app.css?v=7.6.0",
    "./css/mobile.css?v=7.6.0",
    "./css/ui-lock.css?v=7.6.0",
    "./js/core/app-config.js?v=7.6.0",
    "./js/core/event-bus.js?v=7.6.0",
    "./js/core/state-manager.js?v=7.6.0",
    "./js/core/router.js?v=7.6.0",
    "./js/core/schema.js?v=7.6.0",
    "./js/core/feature-gates.js?v=7.6.0",
    "./js/components/component-registry.js?v=7.6.0",
    "./js/module-registry.js?v=7.6.0",
    "./js/modules/module-loader.js?v=7.6.0"
  ];
  const resultClass = {ok:"architecture-guard-ok", warn:"architecture-guard-warn", bad:"architecture-guard-bad"};
  function status(ok, warn){ return ok ? "ok" : (warn ? "warn" : "bad"); }
  function row(label, state, detail){ return {label, state, detail: detail || (state === "ok" ? "OK" : "Prüfen")}; }
  function isMobile(){ return (window.matchMedia && window.matchMedia("(max-width: 900px)").matches) || window.innerWidth <= 900; }
  function checkDom(){
    const missing = REQUIRED_IDS.filter(id => !document.getElementById(id));
    return row("DOM-Grundstruktur", missing.length ? "bad" : "ok", missing.length ? "Fehlt: " + missing.join(", ") : "alle Basis-IDs vorhanden");
  }
  function checkGlobals(){
    const missing = REQUIRED_GLOBALS.filter(name => !window[name]);
    return row("Core-Globals", missing.length ? "bad" : "ok", missing.length ? "Fehlt: " + missing.join(", ") : "State/Event/Router/Module geladen");
  }
  function checkVersions(){
    const versions = [window.AppState && AppState.__version, window.AppEvents && AppEvents.__version, window.AppRouter && AppRouter.__version, window.AppConfig && AppConfig.__version, window.AppComponents && AppComponents.__version, window.TrainerModules && TrainerModules.__version, window.AppModuleLoader && AppModuleLoader.__version, window.AppSchema && AppSchema.__version, window.FeatureGates && FeatureGates.__version].filter(Boolean);
    const bad = versions.filter(v => v !== VERSION);
    return row("Core-Versionen", bad.length ? "warn" : "ok", versions.length ? (bad.length ? "uneinheitlich: " + versions.join(" / ") : "V" + VERSION) : "keine Versionen gefunden");
  }
  function checkMobileNav(){
    const nav = document.getElementById("appNav");
    const mobile = isMobile();
    if(!nav) return row("Mobile Bottom Nav", "bad", "#appNav fehlt");
    if(!mobile) return row("Mobile Bottom Nav", "ok", "Desktop-Modus aktiv");
    const style = getComputedStyle(nav);
    const fixed = style.position === "fixed";
    const attached = nav.parentElement === document.body;
    const visible = style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) !== 0;
    return row("Mobile Bottom Nav", fixed && attached && visible ? "ok" : "warn", `fixed:${fixed} · body:${attached} · sichtbar:${visible}`);
  }
  function checkRouting(){
    const path = location.pathname || "";
    const hashSafe = !/\/(dashboard|settings|highscore|practice|live)(\/|$)/i.test(path);
    const has404 = true;
    return row("GitHub-Pages Routing", hashSafe && has404 ? "ok" : "warn", hashSafe ? "keine echte Unterseite erkannt" : "echte Unterseite erkannt");
  }
  async function checkFiles(){
    const checks = await Promise.all(REQUIRED_FILES.map(async url => {
      try{ const res = await fetch(url, {method:"HEAD", cache:"no-store"}); return {url, ok:res.ok, status:res.status}; }
      catch(e){ return {url, ok:false, status:"fetch-error"}; }
    }));
    const bad = checks.filter(x => !x.ok);
    return row("Dateipfade", bad.length ? "bad" : "ok", bad.length ? bad.map(x => x.url.replace(/^\.\//,"") + "(" + x.status + ")").join(", ") : "alle Kern-Dateien erreichbar");
  }
  async function checkCaches(){
    let cacheCount = "n/a", workerCount = "n/a";
    try{ if(window.caches){ const keys = await caches.keys(); cacheCount = keys.length; } }catch(e){}
    try{ if(navigator.serviceWorker && navigator.serviceWorker.getRegistrations){ const regs = await navigator.serviceWorker.getRegistrations(); workerCount = regs.length; } }catch(e){}
    return row("Cache/Service Worker", "ok", `Caches:${cacheCount} · SW:${workerCount} · Kill-Switch temporär`);
  }
  function checkModules(){
    let list = [];
    try{ if(window.AppModuleLoader && typeof AppModuleLoader.list === "function") list = AppModuleLoader.list(); }catch(e){}
    return row("Module Loader", window.AppModuleLoader ? "ok" : "bad", window.AppModuleLoader ? `${list.length} Modul(e) registriert` : "fehlt");
  }
  async function run(){
    const checks = [checkDom(), checkGlobals(), checkVersions(), checkMobileNav(), checkRouting(), checkModules()];
    checks.push(await checkFiles());
    checks.push(await checkCaches());
    const bad = checks.filter(x => x.state === "bad").length;
    const warn = checks.filter(x => x.state === "warn").length;
    const summary = {version:VERSION, ok:bad===0, score: Math.max(0, Math.round(100 - bad*14 - warn*4)), bad, warn, checks, timestamp:new Date().toISOString()};
    window.__ARCHITECTURE_HEALTH__ = summary;
    if(window.AppEvents) window.AppEvents.emit("architecture:health", summary);
    return summary;
  }
  function render(summary){
    if(!summary) summary = window.__ARCHITECTURE_HEALTH__;
    if(!summary) return "";
    return `<div class="architecture-guard-card"><b>Architecture Guard V${VERSION}</b><br><span class="small">Readiness: ${summary.score}% · Fehler: ${summary.bad} · Warnungen: ${summary.warn}</span><div class="architecture-guard-grid">${summary.checks.map(c=>`<div class="architecture-guard-row"><span>${c.label}</span><strong class="${resultClass[c.state]||resultClass.warn}">${c.detail}</strong></div>`).join("")}</div></div>`;
  }
  function appendToHealthPanel(summary){
    const targets = [document.getElementById("healthPanel"), document.getElementById("globalDiagnosticsContent")].filter(Boolean);
    if(!summary || !targets.length) return;
    targets.forEach(panel => {
      const existing = panel.querySelector(".architecture-guard-card");
      if(existing) existing.remove();
      panel.insertAdjacentHTML("beforeend", render(summary));
    });
  }
  function patchFrameworkHealth(){
    if(!window.App || !App.showFrameworkHealth || App.__architectureGuardPatched) return;
    const original = App.showFrameworkHealth;
    App.showFrameworkHealth = async function(){
      const value = await original.apply(this, arguments);
      try{ appendToHealthPanel(await run()); }catch(e){}
      return value;
    };
    App.__architectureGuardPatched = true;
  }
  window.ArchitectureGuard = Object.freeze({__version:VERSION, run, render, appendToHealthPanel, patchFrameworkHealth});
  document.addEventListener("DOMContentLoaded", function(){
    setTimeout(function(){ patchFrameworkHealth(); run().then(summary=>{ if(/[?&]healthcheck=1\b/.test(location.search)) { const panel = document.getElementById("healthPanel"); if(panel){ panel.classList.add("show"); panel.innerHTML = render(summary); } } }); }, 650);
  });
})();
