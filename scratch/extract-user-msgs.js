const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\Ugurcan\\.gemini\\antigravity\\brain\\0392f99a-317e-464e-9ae0-ee68386c414b\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.source === 'USER_EXPLICIT' || obj.type === 'USER_INPUT') {
        console.log(`[USER STEP ${obj.step_index}] ${obj.content}`);
        console.log('---');
      }
    } catch (e) {}
  }
}

processLineByLine();
