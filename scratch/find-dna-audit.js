const fs = require('fs');
const path = require('path');

const enginePath = path.resolve(__dirname, '../js/learning-coach-engine.js');
const engineContent = fs.readFileSync(enginePath, 'utf8');

const idx = engineContent.indexOf('databaseDNAAudit');
if (idx !== -1) {
  console.log(engineContent.substring(idx, idx + 2000));
} else {
  console.log('Not found');
}
