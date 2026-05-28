const fs = require('fs');

const file = 'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank.js';
const content = fs.readFileSync(file, 'utf8');
global.window = { QUESTION_BANK_EXTERNAL: [] };
eval(content);

const textTasks = global.window.QUESTION_BANK_EXTERNAL.filter(q => q.category === 'Textaufgaben');

let outputStr = `Found ${textTasks.length} Textaufgaben.\n\n`;

textTasks.forEach(item => {
  outputStr += `ID: ${item.id}\n`;
  outputStr += `Q: ${item.question}\n`;
  outputStr += `Opts: ${JSON.stringify(item.answers)}\n`;
  outputStr += `Correct [${item.correct}]: "${item.answers[item.correct]}"\n`;
  outputStr += `Expl: ${item.explanation}\n`;
  outputStr += `---\n`;
});

fs.writeFileSync('C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\scratch\\text-tasks-output.txt', outputStr, 'utf8');
console.log('Finished writing to UTF-8 file.');
