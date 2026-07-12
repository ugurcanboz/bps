#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════
   sync-version.js — VERSIONS-SYNCHRONISATION
   ════════════════════════════════════════════════════════════════
   Liest die Version aus js/core/app-config.js (Single Source of Truth)
   und trägt sie automatisch ein in:
     - service-worker.js   (CACHE_NAME + Kommentar)
     - update-check.json   (version, latest, build, cache, label)
     - manifest.json       (version, falls vorhanden)

   AUSFÜHREN nach jeder Versionsänderung:
     node sync-version.js
   ════════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const cfgPath = path.join(root, 'js/core/app-config.js');
const cfg = fs.readFileSync(cfgPath, 'utf8');

// Version + Datum + Label aus app-config.js extrahieren
const version = (cfg.match(/var VERSION\s*=\s*'([^']+)'/) || [])[1];
const date = (cfg.match(/var VERSION_DATE\s*=\s*'([^']+)'/) || [])[1];
const label = (cfg.match(/var VERSION_LABEL\s*=\s*'([^']+)'/) || [])[1];

if (!version || !date) {
  console.error('❌ Konnte VERSION/VERSION_DATE nicht aus app-config.js lesen.');
  process.exit(1);
}

const fullVersion = version + '-' + date;
const cacheName = 'egt-trainer-' + version.toLowerCase().replace(/[^a-z0-9]+/g, '-');

console.log('🔄 Synchronisiere Version:', fullVersion);
console.log('   Cache-Name:', cacheName);

// 1) service-worker.js
const swPath = path.join(root, 'service-worker.js');
if (fs.existsSync(swPath)) {
  let sw = fs.readFileSync(swPath, 'utf8');
  sw = sw.replace(/var CACHE_NAME\s*=\s*'[^']*';/, "var CACHE_NAME = '" + cacheName + "';");
  // Kommentar-Kopf aktualisieren (erste Zeile)
  sw = sw.replace(/^\/\* .*? · Service Worker · [^\n]*/, '/* Novura · Service Worker · ' + version + ' (' + date + ')');
  sw = sw.replace(/var VERSION\s*=\s*'[^']*';/, "var VERSION = '" + fullVersion + "';");
  fs.writeFileSync(swPath, sw);
  console.log('   ✓ service-worker.js');
}

// 2) update-check.json
const ucPath = path.join(root, 'update-check.json');
const uc = {
  version: fullVersion,
  latest: fullVersion,
  required: true,
  force: false,
  label: (version + ': ' + (label || 'Update')),
  build: fullVersion,
  cache: cacheName
};
fs.writeFileSync(ucPath, JSON.stringify(uc, null, 2));
console.log('   ✓ update-check.json');

// 3) manifest.json (falls version-Feld existiert)
const mfPath = path.join(root, 'manifest.json');
if (fs.existsSync(mfPath)) {
  try {
    const mf = JSON.parse(fs.readFileSync(mfPath, 'utf8'));
    mf.version = version;
    fs.writeFileSync(mfPath, JSON.stringify(mf, null, 2));
    console.log('   ✓ manifest.json');
  } catch (e) {
    console.log('   ⚠ manifest.json übersprungen (kein gültiges JSON)');
  }
}


// 4) weitere Laufzeitdateien mit Versions-Fallbacks synchronisieren
const runtimeTargets = [
  ['js/core/runtime-environment.js', /G54\.\d+\.\d+[A-Z]?/g, version],
  ['js/core/release-channel.js', /G54\.\d+\.\d+[A-Z]?/g, version],
  ['js/core/app-monitoring.js', /G54\.\d+\.\d+[A-Z]?/g, version],
  ['js/core/pwa-update-manager.js', /G54\.\d+\.\d+[A-Z]?/g, version],
  ['js/core/dom-security.js', /G54\.\d+\.\d+[A-Z]?/g, version],
  ['data/language-ai-config.js', /appVersion: '[^']+'/, "appVersion: '" + version + "'"],
  ['worker/src/index.js', /const VERSION = '[^']+';/, "const VERSION = '" + version + "';"],
  ['worker/src/ai-security.js', /G54\.\d+\.\d+[A-Z]?/g, version],
  ['worker/src/api-security.js', /G54\.\d+\.\d+[A-Z]?/g, version]
];
for (const [rel, pattern, replacement] of runtimeTargets) {
  const target = path.join(root, rel);
  if (!fs.existsSync(target)) continue;
  const current = fs.readFileSync(target, 'utf8');
  fs.writeFileSync(target, current.replace(pattern, replacement));
  console.log('   ✓ ' + rel);
}

console.log('✅ Fertig. Version', fullVersion, 'ist jetzt überall synchron.');
