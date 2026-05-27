const fs = require('fs');

const file = 'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank.js';
const content = fs.readFileSync(file, 'utf8');
global.window = { QUESTION_BANK_EXTERNAL: [] };
eval(content);

const zrQuestions = global.window.QUESTION_BANK_EXTERNAL.filter(q => q.category === 'Zahlenreihen');
console.log(`Found ${zrQuestions.length} Zahlenreihen questions.`);

zrQuestions.forEach(item => {
  // Extract number sequence from question text
  // e.g. "Setze die Zahlenreihe fort: 3  4  6  9  13  18  24  ?"
  const match = item.question.match(/fort:\s*([0-9\s,\-\?]+)/);
  if (!match) {
    console.warn(`[UNPARSABLE QUESTION TEXT] ID: ${item.id}, text: ${item.question}`);
    return;
  }
  
  const seqStr = match[1].replace('?', '').trim();
  const seq = seqStr.split(/\s+/).map(x => Number(x.replace(',', '.')));
  const correctVal = Number(item.answers[item.correct].replace(',', '.'));
  
  // Let's verify standard rules:
  // Rule 1: Simple constant addition/subtraction
  // Rule 2: Incrementing addition/subtraction (+1, +2, +3...)
  // Rule 3: Alternating additions
  // Let's try to reconstruct the next element and see if it matches correctVal
  
  // Let's print out for inspection
  console.log(`ID: ${item.id} | Series: [${seq.join(', ')}] | Answer: ${correctVal} | Expl: ${item.explanation}`);
});
