const fs = require('fs');
const path = require('path');

const enginePath = path.resolve(__dirname, '../js/learning-coach-engine.js');
const engineContent = fs.readFileSync(enginePath, 'utf8');

const idx = engineContent.indexOf('allQuestionBanks');
if (idx !== -1) {
  console.log(engineContent.substring(idx, idx + 1000));
} else {
  console.log('Not found');
}
