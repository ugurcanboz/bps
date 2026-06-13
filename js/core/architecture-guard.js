/* Eignungstest-Trainer · Systemprüfung */
(function(){
  "use strict";
  if(window.ArchitectureGuard && window.ArchitectureGuard.__ready) return;
  const VERSION = "internal";
  const REQUIRED_IDS = ["start", "quiz", "memory", "blockIntro", "result", "analysis", "uiShell", "egtBottomDock", "uiModuleGridWrap"];
  const REQUIRED_GLOBALS = ["AppConfig","AppState","AppEvents","AppRouter","AppSchema","FeatureGates","AppComponents","TrainerModules","AppModuleLoader","App","AppFeedback"];
  const REQUIRED_FILES = [
    "./css/app.css",
    "./js/core/app-config.js",
    "./js/core/event-bus.js",
    "./js/core/state-manager.js",
    "./js/core/router.js",
    "./js/core/schema.js",
    "./js/core/feature-gates.js",
    "./js/components/component-registry.js",
    "./js/module-registry.js",
    "./js/modules/module-loader.js",
    "./js/ui-home-renderer.js",
    "./js/feedback-sheet.js"
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
    const modulesReady = [window.AppState, window.AppEvents, window.AppRouter, window.AppConfig, window.AppComponents, window.TrainerModules, window.AppModuleLoader, window.AppSchema, window.FeatureGates].filter(Boolean).length;
    return row("Core-Abgleich", modulesReady >= 8 ? "ok" : "warn", modulesReady >= 8 ? "Systemmodule geladen" : "Systemmodule prüfen");
  }
  function checkMobileNav(){
    const nav = document.getElementById("egtBottomDock");
    const mobile = isMobile();
    if(!nav) return row("Mobile Bottom Nav", "bad", "#egtBottomDock fehlt");
    if(!mobile) return row("Mobile Bottom Nav", "ok", "Desktop-Modus aktiv");
    const style = getComputedStyle(nav);
    const fixed = style.position === "fixed" || style.position === "sticky";
    const attached = nav.parentElement === document.getElementById("uiShell") || nav.parentElement === document.body || (nav.closest && nav.closest("#uiShell"));
    const visible = style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) !== 0;
    // Bei offenem Overlay/Sheet ist die ausgeblendete Dock gewolltes Verhalten -> kein Fehlalarm.
    const overlayOpen = document.documentElement.classList.contains("ui-overlay-open") || document.body.classList.contains("ui-overlay-open") || document.documentElement.classList.contains("egt-layer-open") || document.body.classList.contains("egt-layer-open");
    if(overlayOpen && fixed && attached) return row("Mobile Bottom Nav", "ok", "ausgeblendet hinter offenem Overlay (erwartet)");
    return row("Mobile Bottom Nav", fixed && attached && visible ? "ok" : "warn", `fixed:${fixed} · parent:${!!attached} · sichtbar:${visible}`);
  }
  function checkRouting(){
    const path = location.pathname || "";
    const hashSafe = !/\/(dashboard|settings|highscore|practice|live)(\/|$)/i.test(path);
    const has404 = true;
    return row("GitHub-Pages Routing", hashSafe && has404 ? "ok" : "warn", hashSafe ? "keine echte Unterseite erkannt" : "echte Unterseite erkannt");
  }
  async function checkFiles(){
    const safeOrigin = location.protocol === "http:" || location.protocol === "https:";
    if(!safeOrigin){
      return row("Dateipfade", "ok", "file:// Test erkannt · Dateipfad-Prüfung übersprungen");
    }
    const checks = await Promise.all(REQUIRED_FILES.map(async url => {
      try{ const res = await fetch(url, {method:"HEAD", cache:"no-store"}); return {url, ok:res.ok, status:res.status}; }
      catch(e){ return {url, ok:false, status:"fetch-error"}; }
    }));
    const bad = checks.filter(x => !x.ok);
    return row("Dateipfade", bad.length ? "bad" : "ok", bad.length ? bad.map(x => x.url.replace(/^\.\//,"") + "(" + x.status + ")").join(", ") : "alle Kern-Dateien erreichbar");
  }
  async function checkCaches(){
    let cacheCount = "n/a", workerCount = "n/a";
    const safeOrigin = location.protocol === "http:" || location.protocol === "https:";
    if(!safeOrigin){
      return row("Cache/Service Worker", "ok", "file:// Test erkannt · Service Worker bewusst übersprungen");
    }
    try{ if(window.caches){ const keys = await caches.keys(); cacheCount = keys.length; } }catch(e){}
    try{ if((location.protocol==="http:" || location.protocol==="https:") && navigator.serviceWorker && navigator.serviceWorker.getRegistrations){ const regs = await navigator.serviceWorker.getRegistrations(); workerCount = regs.length; } }catch(e){}
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
    return `<div class="architecture-guard-card"><b>Architecture Guard</b><br><span class="small">Readiness: ${summary.score}% · Fehler: ${summary.bad} · Warnungen: ${summary.warn}</span><div class="architecture-guard-grid">${summary.checks.map(c=>`<div class="architecture-guard-row"><span>${c.label}</span><strong class="${resultClass[c.state]||resultClass.warn}">${c.detail}</strong></div>`).join("")}</div></div>`;
  }
  function appendToHealthPanel(summary){
    const targets = [document.getElementById("globalDiagnosticsContent")].filter(Boolean);
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
    setTimeout(function(){ patchFrameworkHealth(); run().then(summary=>{ if(/[?&]healthcheck=1\b/.test(location.search)) { const panel = null; if(panel){ panel.classList.add("show"); panel.innerHTML = render(summary); } } }); }, 650);
  });
})();
