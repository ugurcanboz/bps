const playwright = require('C:/Users/Ugurcan/AppData/Local/ms-playwright-go/1.57.0/package');
const path = require('path');
const fs = require('fs');

async function run() {
  const browserPaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  let executablePath = undefined;
  for (const p of browserPaths) {
    if (fs.existsSync(p)) {
      executablePath = p;
      break;
    }
  }
  console.log(`Using browser executable: ${executablePath || 'default'}`);

  const launchOptions = { headless: true };
  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }
  
  const browser = await playwright.chromium.launch(launchOptions);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type()}]: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error('[BROWSER RUNTIME ERROR]:', err);
  });

  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  console.log(`Navigating to ${fileUrl}...`);
  await page.goto(fileUrl);
  await page.waitForTimeout(2000);

  console.log('--- Checking Coach UI presence ---');
  const coachUIExists = await page.evaluate(() => {
    const dock = document.getElementById('bpsCoachDock');
    return {
      hasDock: !!dock,
      dockVisible: dock ? dock.style.display !== 'none' : false,
      hasEngine: !!window.BPSLearningCoachEngine,
      hasUI: !!window.BPSLearningCoach
    };
  });
  console.log('Coach UI Status on startup:', coachUIExists);

  console.log('--- Opening Coach Deep Sheet ---');
  await page.evaluate(() => {
    window.BPSLearningCoach.openHub();
  });
  await page.waitForTimeout(500);

  const sheetStatus = await page.evaluate(() => {
    const sheet = document.getElementById('bpsCoachSheet');
    return {
      hasSheet: !!sheet,
      sheetClasses: sheet ? sheet.className : '',
      sheetActive: sheet ? sheet.classList.contains('active') : false
    };
  });
  console.log('Coach Sheet status after openHub():', sheetStatus);

  console.log('--- Simulating recordAnswer calls ---');
  const recordResult = await page.evaluate(() => {
    // Let's get a real question from the question bank to record a correct answer
    const q1 = window.QUESTION_BANK_EXTERNAL[0];
    const historyItem1 = {
      q: q1.q || q1.question,
      cat: q1.cat || q1.category,
      group: q1.group || 'Logik',
      correct: true,
      givenIndex: q1.correct,
      correctIndex: q1.correct,
      duration: 5000,
      allowed: 15000
    };
    window.BPSLearningCoach.onAnswerRecorded(historyItem1, q1);

    // Record an incorrect answer with trap
    const q2 = window.QUESTION_BANK_EXTERNAL[1];
    const historyItem2 = {
      q: q2.q || q2.question,
      cat: q2.cat || q2.category,
      group: q2.group || 'IT',
      correct: false,
      givenIndex: (q2.correct + 1) % q2.answers.length,
      correctIndex: q2.correct,
      duration: 12000,
      allowed: 15000
    };
    window.BPSLearningCoach.onAnswerRecorded(historyItem2, q2);

    // Get command center status
    const cc = window.BPSLearningCoachEngine.commandCenter();
    const memory = window.BPSLearningCoachEngine.memoryHealthReport();
    return {
      cc,
      memory
    };
  });
  
  console.log('Command Center status after records:', JSON.stringify(recordResult.cc, null, 2));
  console.log('Memory report:', recordResult.memory);

  // Click the dashboard toggle to open the Command Center dashboard
  console.log('--- Toggling Command Center Dashboard ---');
  await page.click('#bpsCoachDashboardToggle');
  await page.waitForTimeout(300);

  // Let's check the recommendation text from the UI itself
  const recommendationHTML = await page.evaluate(() => {
    const recBox = document.querySelector('.bps-command-snapshot');
    return recBox ? recBox.innerHTML : 'Not found';
  });
  console.log('Command snapshot HTML content:\n', recommendationHTML);

  await browser.close();
  console.log('Test completed successfully!');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
