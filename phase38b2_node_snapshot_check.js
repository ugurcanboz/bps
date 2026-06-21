const fs = require('fs');
const path = require('path');
const root = __dirname;
const files = [
  'js/modules/language-ai-client.js',
  'js/learning-coach-ui.js'
];
const checks = files.map((file) => {
  try {
    new Function(fs.readFileSync(path.join(root, file), 'utf8'));
    return { file, ok: true };
  } catch (error) {
    return { file, ok: false, error: error.message };
  }
});
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
checks.push({ file:'index.html', ok:index.includes('./data/language-ai-config.js') && index.includes('./js/modules/language-ai-client.js') });
const result = { phase:'38B.2', ok: checks.every(c => c.ok), checks };
fs.writeFileSync(path.join(root, 'phase38b2_node_snapshot_result.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 1);
