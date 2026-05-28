const fs = require('fs');
const path = require('path');
const vm = require('vm');

const files = [
  'question-bank.js',
  'question-bank-kaufm.js',
  'question-bank-sozial.js',
  'question-bank-it-extra.js',
  'question-bank-mathe.js'
];

const dataDir = path.resolve(__dirname, '../data');

function mapCategory(cat, id) {
  const c = String(cat || '').toLowerCase().trim();
  if (c.includes('math') || c.includes('rechnen')) return 'mathe';
  if (c.includes('logik') || c.includes('zahlenreihen')) return 'logik';
  if (c.includes('it') || c.includes('fisi')) return 'it';
  if (c.includes('satz') || c.includes('sprache') || c.includes('deutsch') || c.includes('wort')) return 'sprache';
  if (c.includes('konzentration') || c.includes('aufmerksamkeit')) return 'konzentration';
  if (c.includes('allgemeinwissen') || c.includes('politik') || c.includes('geschichte') || c.includes('geografie') || c.includes('europa') || c.includes('kunst') || c.includes('literatur') || c.includes('musik') || c.includes('wirtschaft') || c.includes('wissenschaft') || c.includes('pädagogik')) return 'allgemeinwissen';
  if (c.includes('technisch')) return 'technisch';
  if (c.includes('visuell') || c.includes('bild') || c.includes('figur') || c.includes('matrix')) return 'visuell';
  return 'gemischt';
}

function mapSubtype(q, category) {
  const id = String(q.id || '').toLowerCase();
  const sub = String(q.subtype || '').toLowerCase().trim();
  const tags = (q.tags || []).map(t => String(t).toLowerCase());
  
  if (id.startsWith('se_') || id.includes('_de_') || id.includes('satzerg')) return 'satzergänzung';
  if (id.startsWith('alg_') || tags.includes('algebra')) return 'algebra';
  if (id.startsWith('gk_') || id.includes('_aw_') || sub === 'general_knowledge') return 'allgemeinwissen';
  if (id.startsWith('stmt_') || id.includes('_log_') || tags.includes('aussagenlogik') || sub === 'logic_statement' || sub === 'statement_logic') return 'aussagenlogik';
  if (id.startsWith('ratio_') || tags.includes('verhältnislogik') || sub === 'ratio_logic') return 'verhältnislogik';
  if (id.startsWith('zr_') || tags.includes('zahlenreihen') || sub === 'zahlenreihe') return 'zahlenreihe';
  
  if (id.startsWith('it_net_') || tags.includes('netzwerk')) return 'netzwerk';
  if (id.startsWith('it_os_') || tags.includes('linux') || tags.includes('windows')) return 'betriebssystem';
  if (id.startsWith('it_db_') || tags.includes('sql') || tags.includes('datenbanken')) return 'datenbanken';
  if (id.startsWith('it_sec_') || tags.includes('security') || tags.includes('sicherheit')) return 'it_sicherheit';
  
  if (id.startsWith('sz_paed_') || tags.includes('sozial-paedagogik')) return 'pädagogik';
  if (id.startsWith('sz_sit_') || tags.includes('situationsaufgabe')) return 'situationsaufgabe';
  
  if (id.startsWith('km_rech_') || tags.includes('kaufm-rechnen')) {
    if (tags.includes('rabatt') || tags.includes('skonto') || q.question.includes('%') || q.question.toLowerCase().includes('skonto') || q.question.toLowerCase().includes('rabatt')) return 'prozent';
    if (tags.includes('dreisatz') || q.question.toLowerCase().includes('kopierer') || q.question.toLowerCase().includes('arbeiter')) return 'dreisatz';
    return 'kopfrechnen';
  }
  if (id.startsWith('km_buero_')) return 'buerowissen';
  
  if (id.startsWith('math_proz_') || tags.includes('prozentrechnung')) return 'prozent';
  if (id.startsWith('math_') || category === 'mathe') {
    if (tags.includes('dreisatz')) return 'dreisatz';
    if (tags.includes('zins')) return 'zinsrechnung';
    if (tags.includes('bruch')) return 'bruchrechnen';
    return 'kopfrechnen';
  }
  
  if (sub) return sub;
  return 'standard';
}

function determineSkill(q, category, subtype) {
  if (category === 'sprache') {
    if (subtype === 'satzergänzung') return 'sprachlogik_und_grammatik';
    return 'sprachverstaendnis_anwenden';
  }
  
  if (category === 'mathe') {
    if (subtype === 'prozent') return 'prozentwert_berechnen';
    if (subtype === 'zinsrechnung') return 'zins_oder_kapital_berechnen';
    if (subtype === 'dreisatz') return 'proportionaler_oder_antiproportionaler_dreisatz';
    if (subtype === 'bruchrechnen') return 'bruchteile_berechnen';
    if (subtype === 'algebra') return 'gleichungen_loesen';
    return 'mathe_grundrechnen';
  }
  
  if (category === 'logik') {
    if (subtype === 'zahlenreihe') return 'zahlenreihen_fortsetzen';
    if (subtype === 'aussagenlogik') return 'logische_schluesse_ziehen';
    if (subtype === 'verhältnislogik') return 'mengen_und_verhaeltnisse_bestimmen';
    return 'logisches_denken';
  }
  
  if (category === 'it') {
    if (subtype === 'netzwerk') return 'netzwerkschichten_oder_protokolle_bestimmen';
    if (subtype === 'betriebssystem') return 'betriebssystem_grundlagen_verstehen';
    if (subtype === 'datenbanken') return 'datenbank_abfragen_oder_relationen_bestimmen';
    if (subtype === 'it_sicherheit') return 'it_sicherheit_und_bedrohungen_erkennen';
    return 'it_systemwissen';
  }
  
  if (category === 'allgemeinwissen') {
    if (subtype === 'pädagogik') return 'paedagogisches_fachwissen_anwenden';
    if (subtype === 'situationsaufgabe') return 'konfliktloesung_und_kommunikation';
    if (subtype === 'buerowissen') return 'bueroorganisation_und_allgemeinwissen';
    return 'allgemeinwissen_fakten_abrufen';
  }
  
  return category + '_grundskill';
}

function determineTrap(q, category, subtype) {
  if (category === 'sprache') {
    return 'grammatikalische_falle_oder_wortbedeutung_verwechselt';
  }
  
  if (category === 'mathe') {
    if (subtype === 'prozent') return 'prozentwert_mit_grundwert_verwechselt';
    if (subtype === 'zinsrechnung') return 'jahreszins_statt_monatszins_berechnet';
    if (subtype === 'dreisatz') return 'proportional_statt_antiproportional_gerechnet';
    if (subtype === 'bruchrechnen') return 'zaehler_und_nenner_verwechselt';
    if (subtype === 'algebra') return 'vorzeichenfehler_bei_aequivalenzumformung';
    return 'rechenfehler_durch_zeitdruck';
  }
  
  if (category === 'logik') {
    if (subtype === 'zahlenreihe') return 'lineare_addition_vermutet_statt_wechselmuster';
    if (subtype === 'aussagenlogik') return 'umkehrschluss_fehler_oder_mengenfehler';
    if (subtype === 'verhältnislogik') return 'verhaeltnis_vertauscht_oder_doppelzaehlung';
    return 'denkfehler_oder_voreiliger_schluss';
  }
  
  if (category === 'it') {
    if (subtype === 'netzwerk') return 'protokoll_oder_port_verwechselt';
    if (subtype === 'betriebssystem') return 'befehl_oder_verzeichnis_verwechselt';
    if (subtype === 'datenbanken') return 'join_art_oder_relationenfehler';
    if (subtype === 'it_sicherheit') return 'angriffstyp_oder_schutzmassnahme_verwechselt';
    return 'ursache_und_wirkung_verwechselt';
  }
  
  if (category === 'allgemeinwissen') {
    if (subtype === 'pädagogik') return 'fachbegriff_oder_psychologe_verwechselt';
    if (subtype === 'situationsaufgabe') return 'unprofessionelle_oder_voreilige_reaktion_gewaehlt';
    if (subtype === 'buerowissen') return 'organisation_oder_rechtschreibfehler';
    return 'ablenkungsantwort_gewaehlt_durch_halbwissen';
  }
  
  return 'denkfehler_oder_voreiliger_schluss';
}

function estimateTime(category, subtype, difficultyText) {
  const d = String(difficultyText || 'medium').toLowerCase();
  const mult = d === 'easy' ? 0.7 : d === 'hard' ? 1.5 : 1.0;
  
  let base = 15000;
  if (category === 'sprache') base = 12000;
  else if (category === 'allgemeinwissen') {
    if (subtype === 'situationsaufgabe') base = 30000;
    else base = 10000;
  }
  else if (category === 'mathe') base = 25000;
  else if (category === 'logik') {
    if (subtype === 'zahlenreihe') base = 18000;
    else base = 30000;
  }
  else if (category === 'it') base = 18000;
  
  return Math.round(base * mult);
}

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
    console.log(`Processing ${file} (${questions.length} questions)...`);
    
    questions.forEach(q => {
      // Determine base info
      const catMapped = mapCategory(q.category || q.cat, q.id);
      const subMapped = mapSubtype(q, catMapped);
      const skill = determineSkill(q, catMapped, subMapped);
      const trap = determineTrap(q, catMapped, subMapped);
      const expectedTimeMs = estimateTime(catMapped, subMapped, q.difficulty);
      
      let diffNum = 3;
      if (q.difficulty === 'easy') diffNum = 2;
      else if (q.difficulty === 'hard') diffNum = 4;
      else if (typeof q.difficulty === 'number') diffNum = q.difficulty;
      
      const examTarget = (diffNum >= 4) ? 'ctc' : 'bps';
      
      // Build distractors
      const answers = q.answers || q.a || [];
      const correctIdx = q.correct;
      const distractors = answers.map((ans, idx) => {
        if (idx === correctIdx) {
          return {
            value: ans,
            index: idx,
            errorPath: 'correct'
          };
        } else {
          let hint = 'Ablenkungsantwort gewählt. Bitte Erklärung prüfen.';
          if (catMapped === 'logik' && subMapped === 'zahlenreihe') {
            hint = 'Ablenkungszahl gewählt. Prüfe die mathematische Beziehung der Reihe erneut.';
          } else if (catMapped === 'mathe') {
            hint = 'Rechenfehler oder falsches prozentuales Verhältnis.';
          } else if (catMapped === 'it') {
            hint = 'Unpassende technologische Komponente oder falsches Protokoll.';
          } else if (catMapped === 'sprache') {
            hint = 'Grammatikalisch oder logisch unpassende Ergänzung.';
          }
          return {
            value: ans,
            index: idx,
            errorPath: 'wrong_choice',
            hint: hint
          };
        }
      });
      
      // Attach dna
      q.dna = {
        category: catMapped,
        subtype: subMapped,
        difficulty: diffNum,
        skill: skill,
        expectedTimeMs: expectedTimeMs,
        trap: trap,
        examTarget: examTarget,
        distractors: distractors
      };
      
      // Clean up top-level properties if they duplicate/clutter unnecessarily, but keeping original fields is fine.
    });
    
    // Write back to file beautifully
    let fileOut = `window.QUESTION_BANK_EXTERNAL = window.QUESTION_BANK_EXTERNAL || [];\nwindow.QUESTION_BANK_EXTERNAL.push(\n`;
    questions.forEach((q, idx) => {
      const isLast = idx === questions.length - 1;
      const jsonStr = JSON.stringify(q, null, 2);
      const indented = jsonStr.split('\n').map(line => '  ' + line).join('\n');
      fileOut += indented + (isLast ? '\n' : ',\n');
    });
    fileOut += `);\n`;
    
    fs.writeFileSync(filePath, fileOut, 'utf8');
    console.log(`Successfully updated ${file}!`);
    
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
});
