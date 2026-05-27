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

const allQuestions = {};

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    global.window.QUESTION_BANK_EXTERNAL = [];
    eval(content);
    const items = global.window.QUESTION_BANK_EXTERNAL;
    
    items.forEach(item => {
      if (!item.question) return;
      const text = item.question.trim();
      if (allQuestions[text]) {
        allQuestions[text].push({ file: path.basename(file), id: item.id });
      } else {
        allQuestions[text] = [{ file: path.basename(file), id: item.id }];
      }
    });
  } catch (err) {
    console.error(err);
  }
});

let duplicates = 0;
for (const [text, occurrences] of Object.entries(allQuestions)) {
  if (occurrences.length > 1) {
    console.log(`Duplicate found for text: "${text.substring(0, 60)}..."`);
    occurrences.forEach(occ => {
      console.log(`  - File: ${occ.file}, ID: ${occ.id}`);
    });
    duplicates++;
  }
}
console.log(`Total duplicate questions across files: ${duplicates}`);
