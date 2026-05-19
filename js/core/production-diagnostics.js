/* Eignungstest-Trainer V7.5.9 · Production Diagnostics
   Berechnet Feature-Readiness anhand von Architektur, Verträgen, Modulen und Runtime. */
(function(){
  "use strict";
  if(window.ProductionDiagnostics && window.ProductionDiagnostics.__version === "7.5.9") return;
  const VERSION="7.5.9";
  function bool(value){ return !!value; }
  function scoreItem(name, ok, weight, detail){ return {name, ok:!!ok, weight, detail:detail || (ok ? "OK" : "prüfen")}; }
  async function fetchJson(path){ try{ const r=await fetch(path, {cache:"no-store"}); if(!r.ok) return null; return await r.json(); }catch(e){ return null; } }
  async function run(){
    const manifest = await fetchJson("./module-manifest.json?v="+VERSION);
    const items = [
      scoreItem("AppConfig", bool(window.AppConfig && AppConfig.__version===VERSION), 10, "zentrale Version/Pfade"),
      scoreItem("State Manager", bool(window.AppState && AppState.__version===VERSION), 10, "zentraler App-Zustand"),
      scoreItem("Event Bus", bool(window.AppEvents && AppEvents.__version===VERSION), 8, "entkoppelte Events"),
      scoreItem("Router", bool(window.AppRouter && AppRouter.__version===VERSION), 7, "Hash/GitHub-safe Routing"),
      scoreItem("Components", bool(window.AppComponents && AppComponents.__version===VERSION), 10, "UI-Bausteine registriert"),
      scoreItem("Module Loader", bool(window.AppModuleLoader && AppModuleLoader.__version===VERSION), 10, "Feature-Andockpunkt"),
      scoreItem("Schema Contracts", bool(window.AppSchema && AppSchema.__version===VERSION), 10, "Fragen/Module prüfbar"),
      scoreItem("Feature Gates", bool(window.FeatureGates && FeatureGates.__version===VERSION), 8, "große Features kontrolliert"),
      scoreItem("Module Manifest", bool(manifest && manifest.version===VERSION), 7, manifest ? "Manifest geladen" : "module-manifest.json fehlt"),
      scoreItem("UI Lock", bool(document.querySelector('link[href*="ui-lock.css"]')), 8, "UI-Layer geschützt"),
      scoreItem("Mobile Nav", bool(document.getElementById("appNav")), 5, "Navigation vorhanden"),
      scoreItem("GitHub Pages", bool(document.querySelector('link[href^="./"]') || location.protocol==="file:"), 7, "relative Pfade")
    ];
    const total = items.reduce((a,b)=>a+b.weight,0);
    const got = items.reduce((a,b)=>a+(b.ok?b.weight:0),0);
    const score = Math.round((got/total)*100);
    const report = {version:VERSION, score, ready:score>=98, items, manifest, timestamp:new Date().toISOString()};
    window.__PRODUCTION_READINESS__ = report;
    if(window.AppEvents) window.AppEvents.emit("production:readiness", report);
    return report;
  }
  function render(report){
    if(!report) report = window.__PRODUCTION_READINESS__;
    if(!report) return "";
    return `<div class="architecture-guard-card"><b>Production Readiness V${VERSION}</b><br><span class="small">Score: ${report.score}% · ${report.ready ? "Feature-ready" : "prüfen"}</span><div class="architecture-guard-grid">${report.items.map(i=>`<div class="architecture-guard-row"><span>${i.name}</span><strong class="${i.ok?'architecture-guard-ok':'architecture-guard-warn'}">${i.detail}</strong></div>`).join("")}</div></div>`;
  }
  function attach(report){
    const panel = document.getElementById("healthPanel") || document.getElementById("globalDiagnosticsContent");
    if(panel){ const old=panel.querySelector(".production-readiness-card"); if(old) old.remove(); const wrap=document.createElement("div"); wrap.className="production-readiness-card"; wrap.innerHTML=render(report); panel.appendChild(wrap); }
  }
  window.ProductionDiagnostics = Object.freeze({__version:VERSION, run, render, attach});
  document.addEventListener("DOMContentLoaded", ()=>setTimeout(()=>run().then(r=>{ if(/[?&](healthcheck|production)=1\b/.test(location.search)) attach(r); }),900));
})();
