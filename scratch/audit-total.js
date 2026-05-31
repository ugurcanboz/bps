const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dataDir = path.resolve(__dirname, '../data');
const jsDir = path.resolve(__dirname, '../js');

const filesToLoad = [
  path.join(dataDir, 'question-bank.js'),
  path.join(dataDir, 'question-bank-kaufm.js'),
  path.join(dataDir, 'question-bank-sozial.js'),
  path.join(dataDir, 'question-bank-it-extra.js'),
  path.join(dataDir, 'question-bank-mathe.js'),
  path.join(jsDir, 'learning-coach-engine.js')
];

const context = {
  console,
  window: {},
  document: undefined,
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  Date, Math, setTimeout, clearTimeout
};
context.window = context;
vm.createContext(context);

filesToLoad.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  vm.runInContext(content, context, { filename: path.basename(f) });
});

const E = context.BPSLearningCoachEngine;
if (!E) {
  console.error("Engine failed to load");
  process.exit(1);
}

const audit = E.databaseDNAAudit();
console.log("Database DNA Audit Result:", {
  total: audit.total,
  checked: audit.checked,
  ok: audit.ok,
  weak: audit.weak,
  missing: audit.missing,
  avgQuality: audit.avgQuality,
  dnaReadyPercent: audit.dnaReadyPercent,
  status: audit.status
});
if (audit.samples && audit.samples.length > 0) {
  console.log("Sample issues:", JSON.stringify(audit.samples.slice(0, 3), null, 2));
}
