/*
  Eignungstest-Trainer V7.0.1 Bundle Builder
  Baut js/app.js reproduzierbar aus klar getrennten Framework-Modulen.
  Wichtig: Laufzeit bleibt ein Bundle für iPad/PWA-Kompatibilität, Wartung erfolgt in js/src/.
  Ausführen lokal mit: node js/build/build-app-bundle.js
*/
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const order = [
  'js/src/core/000-bootstrap-framework.part',
  'js/src/storage/010-storage-database.part',
  'js/src/engines/020-analytics-coach-engines.part',
  'js/src/data/030-question-bank-contracts.part',
  'js/src/factory/040-question-factory.part',
  'js/src/modules/knowledge/100-knowledge-data.part',
  'js/src/modules/english/110-english-data.part',
  'js/src/modules/it/120-it-data.part',
  'js/src/modules/edv/130-edv-schema-data.part',
  'js/src/core/140-exam-state-helpers.part',
  'js/src/factory/150-generator-registry-open.part',
  'js/src/modules/knowledge/151-knowledge-generator.part',
  'js/src/modules/it/152-it-generator.part',
  'js/src/modules/math/153-math-generators.part',
  'js/src/modules/logic/154-logic-generators.part',
  'js/src/modules/concentration/155-concentration-generators.part',
  'js/src/modules/visual/156-visual-iq-generators.part',
  'js/src/modules/math/157-math-sprint-generator.part',
  'js/src/modules/route-memory/158-route-memory-generator.part',
  'js/src/modules/edv/159-edv-multi-generator.part',
  'js/src/renderers/170-edv-renderer.part',
  'js/src/modules/interactive/180-interactive-state-modules.part',
  'js/src/ui/900-runtime-ui-core.part'
];
const missing = order.filter(file => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('Fehlende Source-Module:', missing.join(', '));
  process.exit(1);
}
const banner = '/* AUTO-GENERATED BUNDLE aus js/src/ · Änderungen bitte in den Source-Modulen machen. */\n';
const content = banner + order.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n\n');
fs.writeFileSync(path.join(root, 'js/app.js'), content, 'utf8');
console.log('Bundle geschrieben: js/app.js');
console.log('Module:', order.length);
