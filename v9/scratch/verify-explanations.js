const fs = require('fs');
const path = require('path');

const files = [
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank.js',
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-kaufm.js',
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-sozial.js',
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-it-extra.js'
];

global.window = { QUESTION_BANK_EXTERNAL: [] };

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    global.window.QUESTION_BANK_EXTERNAL = [];
    eval(content);
    const items = global.window.QUESTION_BANK_EXTERNAL;
    
    items.forEach(item => {
      if (!item.answers || !item.explanation) return;
      const correctText = item.answers[item.correct];
      const explanation = item.explanation.toLowerCase();
      
      // Check if any of the WRONG answers are explicitly highlighted in the explanation as the answer
      item.answers.forEach((ans, idx) => {
        if (idx === item.correct) return;
        
        // If the wrong answer is a substantial string and appears in the explanation
        // but the correct answer does NOT appear in the explanation, that's highly suspicious!
        if (ans.length > 3 && explanation.includes(ans.toLowerCase())) {
          // Verify if correct text is NOT in explanation
          if (!explanation.includes(correctText.toLowerCase())) {
            console.warn(`[SUSPICIOUS EXPLANATION] File: ${path.basename(file)}, ID: ${item.id}`);
            console.warn(`  Question: ${item.question}`);
            console.warn(`  Correct Answer [Index ${item.correct}]: "${correctText}"`);
            console.warn(`  Wrong Answer [Index ${idx}] mentioned: "${ans}"`);
            console.warn(`  Explanation: "${item.explanation}"`);
            console.warn('----------------------------------------------------');
          }
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
});
console.log('Suspicious explanation check finished.');
