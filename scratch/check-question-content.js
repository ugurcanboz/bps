const fs = require('fs');
const path = require('path');

const files = [
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank.js',
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-kaufm.js',
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-sozial.js',
  'C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-it-extra.js'
];

// Helper to mock the window object
global.window = {
  QUESTION_BANK_EXTERNAL: []
};

files.forEach(file => {
  console.log(`Checking ${path.basename(file)}...`);
  try {
    const content = fs.readFileSync(file, 'utf8');
    // Clear the external bank
    global.window.QUESTION_BANK_EXTERNAL = [];
    
    // Evaluate the file
    eval(content);
    
    const items = global.window.QUESTION_BANK_EXTERNAL;
    console.log(`Found ${items.length} questions.`);
    
    items.forEach((item, idx) => {
      const qId = item.id || `index_${idx}`;
      
      // 1. Basic validation
      if (!item.question) {
        console.warn(`[MISSING QUESTION] File: ${path.basename(file)}, ID: ${qId}`);
      }
      if (!item.answers || !Array.isArray(item.answers) || item.answers.length === 0) {
        console.warn(`[MISSING ANSWERS] File: ${path.basename(file)}, ID: ${qId}`);
      }
      if (item.correct === undefined || item.correct < 0 || item.correct >= (item.answers ? item.answers.length : 0)) {
        console.warn(`[INVALID CORRECT INDEX] File: ${path.basename(file)}, ID: ${qId}, correct: ${item.correct}`);
      }
      
      // 2. Duplicate answers check
      if (item.answers && Array.isArray(item.answers)) {
        const uniqueAnswers = new Set(item.answers);
        if (uniqueAnswers.size !== item.answers.length) {
          console.warn(`[DUPLICATE ANSWERS] File: ${path.basename(file)}, ID: ${qId}, answers: ${JSON.stringify(item.answers)}`);
        }
      }
      
      // 3. Explanation and Correct answer match check
      // For example, if explanation mentions one number and correct answer is different
      const correctText = item.answers ? item.answers[item.correct] : null;
      const explanation = item.explanation || '';
      
      // If correct answer is a number/percentage, let's verify if the explanation contains it
      if (correctText) {
        // Look for numbers or specific words in explanation
        // e.g. if correct is "340 €" and explanation doesn't mention "340" or "60" etc.
        const cleanCorrect = correctText.replace(/[^a-zA-Z0-9]/g, ' ').trim();
        // Just print some info for potential mismatch
      }
    });
  } catch (err) {
    console.error(`Error processing file ${file}:`, err);
  }
});
