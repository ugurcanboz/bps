const fs = require('fs');
const path = require('path');

const files = [
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank.js',
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-kaufm.js',
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-sozial.js',
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-it-extra.js'
];

global.window = {
  QUESTION_BANK_EXTERNAL: []
};

const output = [];

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    global.window.QUESTION_BANK_EXTERNAL = [];
    eval(content);
    const items = global.window.QUESTION_BANK_EXTERNAL;
    
    items.forEach(item => {
      const cat = String(item.category || '').toLowerCase();
      const group = String(item.group || '').toLowerCase();
      
      if (cat.includes('math') || cat.includes('rechnen') || cat.includes('algebra') || 
          cat.includes('logik') || cat.includes('zahlen') || group.includes('mathe') || group.includes('logik')) {
        output.push({
          file: path.basename(file),
          id: item.id,
          category: item.category,
          question: item.question,
          answers: item.answers,
          correct: item.correct,
          correctText: item.answers ? item.answers[item.correct] : null,
          explanation: item.explanation
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
});

fs.writeFileSync('C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\scratch\\math-logic-questions.json', JSON.stringify(output, null, 2), 'utf8');
console.log(`Extracted ${output.length} math/logic questions to scratch/math-logic-questions.json`);
