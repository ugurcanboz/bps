const fs = require('fs');
const path = require('path');
const vm = require('vm');

const files = [
  'question-bank.js',
  'question-bank-mathe.js',
  'question-bank-kaufm.js',
  'question-bank-sozial.js',
  'question-bank-it-extra.js'
];

const dataDir = path.resolve(__dirname, '../data');

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Set up mock window object
  const context = {
    window: {},
  };
  context.window = context;
  vm.createContext(context);
  
  try {
    vm.runInContext(content, context);
    const questions = context.window.QUESTION_BANK_EXTERNAL || [];
    console.log(`File: ${file}`);
    console.log(`  Count: ${questions.length}`);
    if (questions.length > 0) {
      console.log(`  Sample categories:`, [...new Set(questions.map(q => q.category))]);
      console.log(`  Sample groups:`, [...new Set(questions.map(q => q.group))]);
      console.log(`  Sample subtypes:`, [...new Set(questions.map(q => q.subtype))]);
      console.log(`  Sample difficulties:`, [...new Set(questions.map(q => q.difficulty))]);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});
