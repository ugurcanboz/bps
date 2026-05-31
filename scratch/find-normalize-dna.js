const fs = require('fs');
const path = require('path');

const enginePath = path.resolve(__dirname, '../js/learning-coach-engine.js');
const engineContent = fs.readFileSync(enginePath, 'utf8');

// Find function normalizeTaskDNA
const regex = /function\s+normalizeTaskDNA\s*\(/;
const match = engineContent.match(regex);
if (match) {
  const start = match.index;
  console.log(engineContent.substring(start, start + 3000));
} else {
  // Let's search for "normalizeTaskDNA =" or similar
  const idx = engineContent.indexOf('normalizeTaskDNA');
  if (idx !== -1) {
    console.log(engineContent.substring(idx - 100, idx + 2000));
  } else {
    console.log('Not found');
  }
}
