const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../index.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const regex = /<script\s+src="[^"]+"><\/script>/gi;
const matches = content.match(regex);
if (matches) {
  matches.forEach(m => console.log(m));
} else {
  // Print script tags generally
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    console.log(match[0].substring(0, 150) + '...');
  }
}
