#!/usr/bin/env python3
"""Isolierte responsive Visual-QA für G54.46.5.

Die Prüfung rendert die neuen Admin-Komponenten mit derselben finalen CSS-Datei.
Sie ist kein Ersatz für einen vollständigen End-to-End-Lauf der gesamten App.
"""
from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Any

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / "css" / "admin-release-polish.css").read_text(encoding="utf-8")
EVIDENCE = ROOT / "release" / "evidence"
EVIDENCE.mkdir(parents=True, exist_ok=True)

BASE_CSS = r"""
:root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; background: #020617; color: #e2e8f0; }
body { padding: 18px; }
button, input, select, textarea { font: inherit; }
button { color: #e2e8f0; background: #172554; border: 1px solid rgba(147,197,253,.3); border-radius: 12px; padding: 9px 13px; cursor: pointer; }
#egtAdminModal { width: min(1180px, 100%); margin: auto; border: 1px solid rgba(148,163,184,.22); border-radius: 25px; background: linear-gradient(150deg,#0f172a,#030712); box-shadow: 0 30px 80px rgba(0,0,0,.45); overflow: hidden; }
.egt-admin-head { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:16px 18px; border-bottom:1px solid rgba(148,163,184,.14); }
.egt-admin-head h1 { font-size:1.1rem; margin:0; }
.egt-admin-tabs { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; padding:12px 16px; border-bottom:1px solid rgba(148,163,184,.14); }
.egt-portal-tab-group { display:flex; gap:8px; min-width:0; overflow-x:auto; scrollbar-width:thin; }
.egt-portal-tab-group button { flex:0 0 auto; white-space:nowrap; }
.egt-portal-tab-group button.active { background:#2563eb; }
.egt-tab-scroll-cue { color:#93c5fd; font-size:.75rem; padding-left:4px; }
.egt-admin-body { display:grid; gap:26px; padding:18px; }
.qa-section { min-width:0; }
.qa-section > h2 { margin:0 0 12px; font-size:1.05rem; }
.egt-session-kicker { color:#60a5fa; text-transform:uppercase; letter-spacing:.08em; font-size:.7rem; font-weight:900; }
.egt-admin-subcard, .egt-phase8-preview { border:1px solid rgba(148,163,184,.14); border-radius:18px; padding:16px; background:rgba(15,23,42,.62); min-width:0; }
.egt-admin-subcard strong { display:block; margin-bottom:10px; }
.egt-admin-row { display:flex; flex-wrap:wrap; gap:10px; }
.egt-admin-kv { display:grid; grid-template-columns:max-content minmax(0,1fr); gap:8px 14px; }
.egt-system-dashboard { display:grid; gap:12px; }
.egt-phase8-kpis { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }
.egt-phase8-type-grid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:10px; }
.egt-phase8-type { display:grid; align-content:start; gap:5px; min-width:0; text-align:left; }
.egt-phase8-type span { font-size:1.2rem; }
.egt-phase8-type small { color:#94a3b8; font-size:.7rem; line-height:1.35; }
.egt-phase8-type.active { background:#1d4ed8; }
.egt-phase8-table-view { overflow-x:auto; }
table { width:100%; min-width:940px; border-collapse:collapse; }
th,td { padding:11px 12px; border-bottom:1px solid rgba(148,163,184,.14); text-align:left; vertical-align:top; }
th { color:#93c5fd; font-size:.74rem; }
td { font-size:.78rem; }
.egt-phase8-mobile-cards { display:none; gap:12px; }
.egt-report-mobile-card { border:1px solid rgba(148,163,184,.16); border-radius:16px; padding:14px; background:rgba(15,23,42,.72); }
.egt-report-mobile-card h4 { margin:0 0 9px; }
.egt-report-mobile-card dl { display:grid; gap:7px; margin:0; }
.egt-report-mobile-card dl > div { display:grid; grid-template-columns:minmax(95px,.7fr) minmax(0,1.3fr); gap:9px; }
dt { color:#93c5fd; font-size:.72rem; font-weight:800; }
dd { margin:0; overflow-wrap:anywhere; }
.egt-qbank-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.egt-qbank-bar { display:grid; grid-template-columns:minmax(110px,.8fr) minmax(100px,1.5fr) 44px; gap:9px; align-items:center; margin:8px 0; }
.egt-qbank-track { height:8px; border-radius:999px; background:#1e293b; overflow:hidden; }
.egt-qbank-track i { display:block; height:100%; background:#3b82f6; border-radius:inherit; }
.egt-qbank-pills { display:flex; flex-wrap:wrap; gap:8px; }
.egt-qbank-pill { padding:7px 10px; border-radius:999px; background:#172554; font-size:.74rem; }
.egt-qbank-issue-list { display:grid; gap:8px; }
.egt-qbank-issue { display:grid; grid-template-columns:100px minmax(0,1fr); gap:10px; padding:10px; border-radius:12px; background:rgba(127,29,29,.15); }
.egt-admin-hint { color:#94a3b8; font-size:.76rem; line-height:1.45; }
.egt-phase8-export-actions { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; margin-top:12px; }
.egt-check { display:flex; gap:10px; }
@media (max-width:900px) { .egt-phase8-kpis{grid-template-columns:repeat(2,minmax(0,1fr));} }
"""

HTML = f"""<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>{BASE_CSS}\n{CSS}</style></head><body>
<div id="egtAdminModal" role="dialog" aria-label="Adminportal Visual QA">
  <header class="egt-admin-head"><div><span class="egt-session-kicker">G54.46.5</span><h1>Adminportal</h1></div><button class="egt-admin-x" aria-label="Schließen">×</button></header>
  <nav class="egt-admin-tabs egt-portal-tabs egt-portal-tabbar" aria-label="Adminbereiche">
    <div class="egt-portal-tab-group" role="tablist">
      <button role="tab" aria-selected="true" class="active">Dashboard</button><button role="tab">Teilnehmer</button><button role="tab">Gruppen</button><button role="tab">Codes</button><button role="tab">Dozenten</button><button role="tab">Berichte</button><button role="tab">Tickets</button><button role="tab">System</button><button role="tab">Aufgabenbank</button>
    </div>
    <span class="egt-tab-scroll-cue">Seitlich wischen für weitere Bereiche →</span>
    <button class="egt-logout-tab">Abmelden</button>
  </nav>
  <main class="egt-admin-body">
    <section class="qa-section" id="system"><h2>Systemzentrale</h2>
      <div class="egt-system-dashboard">
        <article class="egt-system-card ok"><span class="egt-system-card-label">Version</span><strong class="egt-system-card-value">G54.46.5</strong><small class="egt-system-card-meta">App-Build · überall synchron</small></article>
        <article class="egt-system-card ok"><span class="egt-system-card-label">Betriebszustand</span><strong class="egt-system-card-value">Stabil</strong><small class="egt-system-card-meta">Keine akuten Warnungen</small></article>
        <article class="egt-system-card info"><span class="egt-system-card-label">Aufgaben</span><strong class="egt-system-card-value">4.404</strong><small class="egt-system-card-meta">Geladene Aufgabenbank</small></article>
        <article class="egt-system-card warn"><span class="egt-system-card-label">Firebase</span><strong class="egt-system-card-value">Lokaler Modus</strong><small class="egt-system-card-meta">Cloud erneut prüfen</small></article>
      </div>
      <div class="egt-admin-row" style="margin-top:12px"><button>Cloud erneut prüfen</button><button>Diagnose exportieren</button><label class="egt-check"><input type="checkbox"> Protokolle einschließen</label></div>
    </section>

    <section class="qa-section" id="qbank"><h2>Aufgabenbank</h2>
      <div class="egt-qbank-panel">
        <div class="egt-qbank-head"><div><span class="egt-session-kicker">Aufgabenbank</span><h3>Qualitätsprüfung</h3><p>Prüft Schema, Lösungen, Antwortoptionen, Dubletten, Fachgruppen und Metadaten.</p></div><div class="egt-qbank-score warn"><b>99%</b><span>prüfen</span></div></div>
        <div class="egt-qbank-metrics">
          <article class="egt-qbank-metric info"><strong>517</strong><span>Aufgaben</span><small>vollständig analysiert</small></article>
          <article class="egt-qbank-metric warn"><strong>3</strong><span>Hinweise</span><small>Prüfung empfohlen</small></article>
          <article class="egt-qbank-metric ok"><strong>0</strong><span>Kritische Punkte</span><small>blockierende Strukturfehler</small></article>
          <article class="egt-qbank-metric warn"><strong>3</strong><span>Fachlogik</span><small>Fachhinweise offen</small></article>
        </div>
        <div class="egt-qbank-grid">
          <div class="egt-admin-subcard"><strong>Fachgruppen</strong><div class="egt-qbank-bar"><span>Logik</span><div class="egt-qbank-track"><i style="width:92%"></i></div><b>140</b></div><div class="egt-qbank-bar"><span>Allgemeinwissen</span><div class="egt-qbank-track"><i style="width:88%"></i></div><b>134</b></div></div>
          <div class="egt-admin-subcard"><strong>Schwierigkeit</strong><div class="egt-qbank-bar"><span>Leicht</span><div class="egt-qbank-track"><i style="width:74%"></i></div><b>192</b></div><div class="egt-qbank-bar"><span>Schwer</span><div class="egt-qbank-track"><i style="width:58%"></i></div><b>151</b></div></div>
        </div>
        <div class="egt-admin-subcard egt-qbank-hints"><strong>Hinweisarten</strong><div class="egt-qbank-pills"><span class="egt-qbank-pill">Fachregel · 3</span><span class="egt-qbank-pill">Dubletten · 0</span></div></div>
        <div class="egt-qbank-issue-list"><div class="egt-qbank-issue"><b>Fachregel</b><span>Drei Aufgaben benötigen eine redaktionelle Prüfung.</span></div></div>
        <div class="egt-admin-row egt-qbank-actions"><button>Erneut prüfen</button><button>Bericht exportieren</button></div>
      </div>
    </section>

    <section class="qa-section" id="reports"><h2>Berichte</h2>
      <div class="egt-phase8-type-grid" role="group" aria-label="Berichtstyp wählen">
        <button class="egt-phase8-type active" aria-pressed="true"><span>👥</span><b>Teilnehmer</b><small>Stammdaten, Status, Quote und Empfehlung.</small></button>
        <button class="egt-phase8-type" aria-pressed="false"><span>🏫</span><b>Gruppen</b><small>Gruppenstatus und Dozentenzuordnung.</small></button>
        <button class="egt-phase8-type" aria-pressed="false"><span>🧑‍🏫</span><b>Dozenten</b><small>Gruppenbindung und Rechte.</small></button>
        <button class="egt-phase8-type" aria-pressed="false"><span>📊</span><b>Leistung</b><small>Modulvergleich und Schwächen.</small></button>
        <button class="egt-phase8-type" aria-pressed="false"><span>🚨</span><b>Hilfebedarf</b><small>Priorisierte Förderfälle.</small></button>
      </div>
      <div class="egt-phase8-kpis" style="margin-top:12px">
        <article class="egt-report-metric info"><strong>6</strong><span>Teilnehmer sichtbar</span><small>Alle Gruppen</small></article>
        <article class="egt-report-metric warn"><strong>4</strong><span>Hilfebedarf</span><small>kritisch oder riskant</small></article>
        <article class="egt-report-metric"><strong>61%</strong><span>Durchschnittsquote</span><small>sichtbare Teilnehmer</small></article>
        <article class="egt-report-metric info"><strong>6</strong><span>Datensätze</span><small>im aktuellen Bericht</small></article>
      </div>
      <div class="egt-phase8-preview" style="margin-top:12px">
        <div class="egt-phase8-table-view"><table><thead><tr><th>Teilnehmer-ID</th><th>Name</th><th>Gruppe</th><th>Status</th><th>Quote</th><th>Aufgaben</th><th>Letzte Aktivität</th><th>Empfehlung</th></tr></thead><tbody><tr><td>2026-GK-A001</td><td>Max Mustermann</td><td>GK 2026</td><td>Riskant</td><td>61%</td><td>84</td><td>10.07.2026</td><td>Logik stabilisieren und kurze Wiederholung planen.</td></tr><tr><td>2026-GK-A002</td><td>Ella Beispiel</td><td>GK 2026</td><td>Stabil</td><td>82%</td><td>120</td><td>09.07.2026</td><td>Leistungsniveau halten.</td></tr></tbody></table></div>
        <p class="egt-admin-hint egt-phase8-desktop-hint">Tabelle kann horizontal gescrollt werden.</p>
        <div class="egt-phase8-mobile-cards">
          <article class="egt-report-mobile-card"><h4>Max Mustermann</h4><dl><div><dt>Teilnehmer-ID</dt><dd>2026-GK-A001</dd></div><div><dt>Gruppe</dt><dd>GK 2026</dd></div><div><dt>Status</dt><dd>Riskant · 61%</dd></div><div><dt>Empfehlung</dt><dd>Logik stabilisieren und kurze Wiederholung planen.</dd></div></dl></article>
          <article class="egt-report-mobile-card"><h4>Ella Beispiel</h4><dl><div><dt>Teilnehmer-ID</dt><dd>2026-GK-A002</dd></div><div><dt>Gruppe</dt><dd>GK 2026</dd></div><div><dt>Status</dt><dd>Stabil · 82%</dd></div><div><dt>Empfehlung</dt><dd>Leistungsniveau halten.</dd></div></dl></article>
        </div>
        <div class="egt-phase8-export-actions"><button>CSV exportieren</button><button>JSON exportieren</button><button>PDF drucken</button><button>Bericht kopieren</button></div>
      </div>
    </section>
  </main>
</div></body></html>"""

DEVICES = [
    {"name": "desktop", "width": 1440, "height": 1050, "mobile": False},
    {"name": "ipad", "width": 834, "height": 1112, "mobile": False},
    {"name": "iphone", "width": 390, "height": 844, "mobile": True},
]


async def inspect(page, device: dict[str, Any]) -> dict[str, Any]:
    return await page.evaluate(
        """(device) => {
          const visible = el => !!el && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0;
          const rect = el => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; };
          const modal = document.querySelector('#egtAdminModal');
          const buttons = [...document.querySelectorAll('#egtAdminModal button')].filter(visible);
          const checks = [...document.querySelectorAll('#egtAdminModal input[type=checkbox], #egtAdminModal input[type=radio]')].filter(visible);
          const cards = [...document.querySelectorAll('.egt-system-card,.egt-qbank-metric,.egt-report-metric,.egt-report-mobile-card')].filter(visible);
          const tooSmallButtons = buttons.filter(b => b.getBoundingClientRect().height < 43.5).map(b => ({text:b.textContent.trim(), ...rect(b)}));
          const tooSmallChecks = checks.filter(b => b.getBoundingClientRect().width < 23.5 || b.getBoundingClientRect().height < 23.5).map(b => rect(b));
          const viewportOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
          const modalOverflow = modal.scrollWidth - modal.clientWidth;
          const tableVisible = visible(document.querySelector('.egt-phase8-table-view'));
          const mobileCardsVisible = visible(document.querySelector('.egt-phase8-mobile-cards'));
          const tabGroup = document.querySelector('.egt-portal-tab-group');
          const tabScrollable = tabGroup.scrollWidth > tabGroup.clientWidth + 1;
          const cueVisible = visible(document.querySelector('.egt-tab-scroll-cue'));
          const touching = [];
          for (let i=0;i<cards.length;i++) for (let j=i+1;j<cards.length;j++) {
            const a=cards[i].getBoundingClientRect(), b=cards[j].getBoundingClientRect();
            const overlapX=Math.min(a.right,b.right)-Math.max(a.left,b.left);
            const overlapY=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
            if(overlapX>1 && overlapY>1) touching.push([i,j,overlapX,overlapY]);
          }
          return {
            device,
            viewportOverflow,
            modalOverflow,
            bodyWidth: document.body.scrollWidth,
            viewportWidth: document.documentElement.clientWidth,
            tooSmallButtons,
            tooSmallChecks,
            cardCount: cards.length,
            cardOverlaps: touching,
            tableVisible,
            mobileCardsVisible,
            tabScrollable,
            cueVisible,
            qbankMetricTexts: [...document.querySelectorAll('.egt-qbank-metric')].map(x => x.innerText.trim().split(String.fromCharCode(10)).filter(Boolean)),
            systemCardTexts: [...document.querySelectorAll('.egt-system-card')].map(x => x.innerText.trim().split(String.fromCharCode(10)).filter(Boolean)),
            reportMetricTexts: [...document.querySelectorAll('.egt-report-metric')].map(x => x.innerText.trim().split(String.fromCharCode(10)).filter(Boolean))
          };
        }""",
        device,
    )


async def main() -> None:
    results: list[dict[str, Any]] = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path="/usr/bin/chromium",
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
        )
        for device in DEVICES:
            context = await browser.new_context(
                viewport={"width": device["width"], "height": device["height"]},
                device_scale_factor=1,
                is_mobile=device["mobile"],
                has_touch=True,
            )
            page = await context.new_page()
            await page.set_content(HTML, wait_until="load")
            await page.evaluate("document.fonts && document.fonts.ready")
            await page.screenshot(path=str(EVIDENCE / f"G54.46.5_{device['name']}_admin_ui.png"), full_page=True)
            result = await inspect(page, device)
            expected_mobile_cards = device["width"] <= 760
            failures = []
            if result["viewportOverflow"] > 1:
                failures.append(f"Viewport overflow {result['viewportOverflow']}px")
            if result["modalOverflow"] > 1:
                failures.append(f"Modal overflow {result['modalOverflow']}px")
            if result["tooSmallButtons"]:
                failures.append(f"{len(result['tooSmallButtons'])} sichtbare Buttons unter 44px")
            if result["tooSmallChecks"]:
                failures.append(f"{len(result['tooSmallChecks'])} Checkboxen/Radios unter 24px")
            if result["cardOverlaps"]:
                failures.append(f"{len(result['cardOverlaps'])} Kartenüberlappungen")
            if expected_mobile_cards and (result["tableVisible"] or not result["mobileCardsVisible"]):
                failures.append("Mobile Berichtsumschaltung fehlerhaft")
            if not expected_mobile_cards and (not result["tableVisible"] or result["mobileCardsVisible"]):
                failures.append("Desktop-Berichtsumschaltung fehlerhaft")
            # Semantik: Wert, Label und Meta müssen eigene Zeilen/Elemente bilden.
            for group in ("qbankMetricTexts", "systemCardTexts", "reportMetricTexts"):
                if any(len(parts) < 3 for parts in result[group]):
                    failures.append(f"Zusammengeklebte Inhalte in {group}")
            result["failures"] = failures
            result["passed"] = not failures
            results.append(result)
            await context.close()
        await browser.close()

    report = {
        "phase": "G54.46.5",
        "scope": "isolated-admin-components-responsive-visual-qa",
        "fullAppE2E": False,
        "status": "passed" if all(r["passed"] for r in results) else "failed",
        "passedDevices": sum(1 for r in results if r["passed"]),
        "totalDevices": len(results),
        "results": results,
        "evidence": [f"release/evidence/G54.46.5_{d['name']}_admin_ui.png" for d in DEVICES],
        "limitation": "Die Komponenten wurden mit produktiver G54.46.5-CSS isoliert gerendert. Die vollständige Appnavigation bleibt ein separates Browser-Gate."
    }
    out = ROOT / "release" / "G54.46.5_VISUAL_QA_RESULT.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if report["status"] != "passed":
        raise SystemExit(1)


if __name__ == "__main__":
    asyncio.run(main())
