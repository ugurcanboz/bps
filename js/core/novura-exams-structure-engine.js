/* Novura · Novura Exams Structure Engine · G54.3
   Realer Novura Exams-Lohr Ablauf: Blocksystem mit echten Zeitprofilen, Eingabeaufgaben
   und FlowLogic-Finalblock. Scope: ausschließlich Simulation → IT/FISI → Novura Exams. */
(function(){
  'use strict';
  var VERSION = 'G54.5-novura-exams-numberseries';
  if (window.NovuraExamsStructureEngine && window.NovuraExamsStructureEngine.__version === VERSION) return;

  var BLOCKS = Object.freeze([
    { key:'generalKnowledge', label:'1. Allgemeinwissen', count:40, timeModel:'block', blockSeconds:420, questionSeconds:11, group:'Allgemeinwissen' },
    { key:'mathSprint', label:'2. Mathematik Sprint', count:9, timeModel:'perQuestion', questionSeconds:22, group:'Mathe' },
    { key:'ruleArithmetic', label:'3. Regelrechnung', count:6, timeModel:'perQuestion', questionSeconds:40, group:'Mathe' },
    { key:'numberSeries', label:'4. Zahlenreihen', count:6, timeModel:'perQuestion', questionSeconds:40, group:'Logik' },
    { key:'letterScan', label:'5. Buchstaben-Konzentration', count:4, timeModel:'perQuestion', questionSeconds:40, group:'Konzentration' },
    { key:'coordinateTable', label:'6. Tabellen ablesen', count:2, timeModel:'perQuestion', questionSeconds:90, group:'Konzentration' },
    { key:'flowLogic', label:'7. Wenn-Dann-Ablauf', count:1, timeModel:'perQuestion', questionSeconds:780, group:'Logik' }
  ]);

  function totalCount(){ return BLOCKS.reduce(function(sum,b){ return sum + b.count; }, 0); }
  function totalSeconds(){ return BLOCKS.reduce(function(sum,b){ return sum + (b.timeModel === 'block' ? b.blockSeconds : b.count * b.questionSeconds); }, 0); }
  function blockForIndex(index){
    var pos = Number(index) || 0;
    var cursor = 0;
    for(var i=0;i<BLOCKS.length;i++){
      var b = BLOCKS[i];
      if(pos < cursor + b.count) return Object.assign({ localIndex: pos - cursor, startIndex: cursor, endIndex: cursor + b.count - 1 }, b);
      cursor += b.count;
    }
    var last = BLOCKS[BLOCKS.length-1];
    return Object.assign({ localIndex: Math.max(0, last.count-1), startIndex: totalCount()-last.count, endIndex: totalCount()-1 }, last);
  }
  function isItNovuraExamsScope(input){
    input = input || {};
    var profile = input.questionProfile || input.profile || (window.EGT_ACTIVE_QUESTION_PROFILE || {});
    // Sicherheit: ohne explizite Angaben KEIN Novura Exams-Scope (verhindert versehentliche Aktivierung).
    var hasExplicit = (input.branch || input.mode || input.pool || input.simType ||
                       profile.branch || profile.mode || profile.simType || profile.poolKey || profile.pool);
    if(!hasExplicit) return false;
    var branch = String(input.branch || profile.branch || 'it');
    var mode = String(input.mode || profile.mode || 'novuraExams');
    var pool = String(input.pool || profile.poolKey || profile.pool || 'it-novura-exams');
    var simType = String(input.simType || profile.simType || 'novuraExams');
    return branch === 'it' && mode === 'novuraExams' && pool === 'it-novura-exams' && simType === 'novuraExams';
  }
  function esc(s){ return String(s == null ? '' : s); }
  function hash(str){ var h=0; str=String(str||''); for(var i=0;i<str.length;i++) h=((h<<5)-h+str.charCodeAt(i))|0; return Math.abs(h); }
  function seeded(seed){ var x = (hash(seed) || 123456789) >>> 0; return function(){ x = (1664525 * x + 1013904223) >>> 0; return x / 4294967296; }; }
  function choice(rng, arr){ return arr[Math.floor(rng()*arr.length)] || arr[0]; }
  function shuffle(rng, arr){ arr = arr.slice(); for(var i=arr.length-1;i>0;i--){ var j=Math.floor(rng()*(i+1)); var t=arr[i]; arr[i]=arr[j]; arr[j]=t; } return arr; }
  function baseMeta(q, block, localIndex){
    q.block = block.label;
    q.novuraExamsBlockKey = block.key;
    q.time = block.timeModel === 'block' ? block.questionSeconds : block.questionSeconds;
    q.blockSeconds = block.blockSeconds || null;
    q.timeModel = block.timeModel;
    q.helpAllowed = false;
    q.coachDuring = false;
    q.novuraExamsOnly = true;
    q.branch = 'it';
    q.simType = 'novuraExams';
    q.poolKey = 'it-novura-exams';
    q.examTarget = 'novuraExams';
    q.signature = q.signature || ('novura-exams|' + block.key + '|' + localIndex + '|' + esc(q.q));
    q.id = q.id || ('novura_exams_' + block.key + '_' + localIndex + '_' + hash(q.signature).toString(36));
    return q;
  }

  var GK = [
    ['Welcher Punkt gilt, gemessen ab dem Meeresspiegel, als höchster natürlicher Punkt der Erdoberfläche?', 'Mount Everest', ['Zugspitze','Burj Khalifa','Mont Blanc']],
    ['Welche Musikgruppe wurde wegen ihrer Frisuren zeitweise als „Pilzköpfe“ bezeichnet?', 'The Beatles', ['Queen','ABBA','The Rolling Stones']],
    ['Welches Bauwerk wird häufig mit Dubai und extremer Gebäudehöhe verbunden?', 'Burj Khalifa', ['Eiffelturm','Empire State Building','Taipei 101']],
    ['Welches Land hat die meisten direkten Nachbarstaaten innerhalb Europas?', 'Deutschland', ['Portugal','Island','Irland']],
    ['Welche Stadt ist Sitz des Europäischen Parlaments für die monatlichen Plenarsitzungen?', 'Straßburg', ['Brüssel','Luxemburg','Den Haag']],
    ['Welches chemische Symbol steht für Gold?', 'Au', ['Ag','Gd','Go']],
    ['Welcher Planet ist der Sonne am nächsten?', 'Merkur', ['Mars','Venus','Jupiter']],
    ['Welche Epoche wird besonders mit Leonardo da Vinci verbunden?', 'Renaissance', ['Barock','Romantik','Gotik']],
    ['Welche Einheit misst elektrische Spannung?', 'Volt', ['Watt','Ampere','Ohm']],
    ['Welche Sprache wird in Brasilien überwiegend gesprochen?', 'Portugiesisch', ['Spanisch','Französisch','Italienisch']],
    ['Welche Organisation verwendet die Abkürzung WHO?', 'Weltgesundheitsorganisation', ['Welthandelsorganisation','Weltbank','UNESCO']],
    ['Welcher Fluss fließt durch Wien?', 'Donau', ['Rhein','Elbe','Main']],
    ['Welche Währung wurde in Deutschland vor dem Euro verwendet?', 'Deutsche Mark', ['Schilling','Franc','Lira']],
    ['Welche Farbe entsteht aus Blau und Gelb?', 'Grün', ['Orange','Violett','Braun']],
    ['Welches Organ pumpt Blut durch den Körper?', 'Herz', ['Lunge','Leber','Milz']],
    ['Welche Zahl ist eine Primzahl?', '17', ['21','27','33']],
    ['Welcher Kontinent hat flächenmäßig die größte Ausdehnung?', 'Asien', ['Europa','Australien','Antarktis']],
    ['Welche Stadt ist die Hauptstadt Australiens?', 'Canberra', ['Sydney','Melbourne','Perth']],
    ['Welche Staatsform beschreibt die Herrschaft des Volkes durch Wahlen?', 'Demokratie', ['Monarchie','Diktatur','Oligarchie']],
    ['Welcher Begriff bezeichnet Wasser im festen Aggregatzustand?', 'Eis', ['Dampf','Nebel','Tau']],
    ['Welcher deutsche Feiertag liegt am 3. Oktober?', 'Tag der Deutschen Einheit', ['Reformationstag','Tag der Arbeit','Volkstrauertag']],
    ['Welcher Künstler malte die Mona Lisa?', 'Leonardo da Vinci', ['Michelangelo','Picasso','Rembrandt']],
    ['Welche Maßeinheit passt zu Temperatur?', 'Grad Celsius', ['Kilowatt','Liter','Newton']],
    ['Welches Tier ist ein Säugetier?', 'Delfin', ['Hai','Forelle','Karpfen']],
    ['Welche Himmelsrichtung liegt gegenüber von Norden?', 'Süden', ['Westen','Osten','Nordosten']],
    ['Welcher Stoff wird von Pflanzen bei der Fotosynthese aufgenommen?', 'Kohlendioxid', ['Sauerstoff','Stickstoff','Wasserstoff']],
    ['Welche Stadt liegt am Bosporus?', 'Istanbul', ['Ankara','Izmir','Antalya']],
    ['Was ist die Amtssprache der Türkei?', 'Türkisch', ['Arabisch','Persisch','Kurdisch']],
    ['Welches Land gehört nicht zur Europäischen Union?', 'Schweiz', ['Frankreich','Italien','Spanien']],
    ['Welche Zahl entspricht einem Viertel von 100?', '25', ['20','40','75']],
    ['Wie heißt die kleinste selbstständige Einheit eines Lebewesens?', 'Zelle', ['Atom','Organ','Molekül']],
    ['Welches Gerät wandelt elektrische Energie überwiegend in Licht um?', 'Lampe', ['Mikrofon','Lautsprecher','Thermometer']],
    ['Welche Sportart verbindet man mit Wimbledon?', 'Tennis', ['Golf','Rugby','Cricket']],
    ['Welche Stadt ist bekannt für den Schiefen Turm?', 'Pisa', ['Rom','Venedig','Florenz']],
    ['Welcher Begriff steht für die Gesamtheit von Hardware und Software in einem Netzwerk?', 'IT-System', ['Betriebsklima','Stromkreis','Getriebe']],
    ['Welche Zahl ist durch 3 teilbar?', '42', ['41','43','44']],
    ['Welches Material leitet elektrischen Strom besonders gut?', 'Kupfer', ['Holz','Gummi','Glas']],
    ['Welche Jahreszeit beginnt auf der Nordhalbkugel ungefähr im März?', 'Frühling', ['Herbst','Winter','Sommer']],
    ['Welches Land hat Rom als Hauptstadt?', 'Italien', ['Griechenland','Spanien','Portugal']],
    ['Welche Abkürzung steht häufig für künstliche Intelligenz?', 'KI', ['DNS','USB','BGB']],
    ['Welcher Begriff bezeichnet eine geordnete Folge von Arbeitsschritten?', 'Ablauf', ['Zufall','Material','Geräusch']]
  ];
  function generalQuestion(localIndex, seed){
    var rng = seeded(seed + '|gk|' + localIndex);
    var row = GK[localIndex % GK.length];
    var answers = shuffle(rng, [row[1]].concat(row[2]));
    return {
      type:'mc', cat:'Allgemeinwissen', group:'Allgemeinwissen',
      q: row[0], a: answers, correct: answers.indexOf(row[1]),
      ex: 'Prüfungsnah formulierte Allgemeinwissensfrage. Richtig ist: ' + row[1] + '.',
      time: 11
    };
  }
  function fmt(n){ var s = String(Math.round(n * 1000000000000) / 1000000000000); return s.replace('.', ','); }
  function mathQuestion(localIndex, seed){
    var rng = seeded(seed + '|math|' + localIndex);
    var templates = [
      function(){ var a=0.7, b=0.08, c=0.006, r=a+b+c; return ['Ein Messwert setzt sich aus 0,7, 0,08 und 0,006 zusammen. Welcher Gesamtwert ergibt sich?', r, ['0,786','0,7086','0,86']]; },
      function(){ var r=4.2-0.37; return ['Von 4,2 Einheiten werden 0,37 Einheiten abgezogen. Welcher Rest bleibt?', r, ['3,73','3,93','4,17']]; },
      function(){ var r=0.028/100000; return ['Ein Bauteil ist 0,028 cm lang. Für eine technische Dokumentation soll die Länge in Kilometern angegeben werden. Welcher Wert ist korrekt?', r, ['0,0000028','0,000000028','0,00028']]; },
      function(){ var r=80*0.85; return ['Ein Preis von 80 € wird um 15 % gesenkt. Wie hoch ist der neue Preis?', r, ['65','68','72']]; },
      function(){ var r=(50-40)/40*100; return ['Ein Wert steigt von 40 auf 50. Um wie viel Prozent ist er gestiegen?', r, ['20','10','30']]; },
      function(){ var r=0.75+0.25; return ['In einer Aufgabe sollen 3/4 und 0,25 addiert werden. Welches Ergebnis entsteht?', r, ['0,75','1,25','0,5']]; },
      function(){ var r=35/1000; return ['35 mm sollen in Meter angegeben werden. Welcher Wert ist richtig?', r, ['0,35','0,0035','3,5']]; },
      function(){ var r=2.5-0.75; return ['Ein Kabel ist 2,5 m lang. Davon werden 0,75 m abgeschnitten. Ein zweites Kabel liegt daneben, wird aber nicht verwendet. Wie lang ist das erste Kabel danach?', r, ['1,65','1,85','2,25']]; },
      function(){ var r=3/4-1/8; return ['Berechne gedanklich: 3/4 minus 1/8.', r, ['0,5','0,75','0,875']]; }
    ];
    var t = templates[localIndex % templates.length]();
    var correct = fmt(Number(t[1]));
    var answers = shuffle(rng, [correct].concat(t[2]));
    return { type:'mc', cat:'Mathe', group:'Mathe', q:t[0], a:answers, correct:answers.indexOf(correct), ex:'Ohne Taschenrechner lösbar: erst Einheiten/Komma sauber ordnen, dann rechnen. Ergebnis: '+correct+'.', time:22 };
  }
  function makeExpr(rng){
    var a = 18 + Math.floor(rng()*52), b = 5 + Math.floor(rng()*31), c = 1 + Math.floor(rng()*12);
    var d = 20 + Math.floor(rng()*58), e = 4 + Math.floor(rng()*35), f = 1 + Math.floor(rng()*10);
    var ops1 = choice(rng, [['-','+'], ['+','-'], ['-','-']]);
    var ops2 = choice(rng, [['-','-'], ['-','+'], ['+','-']]);
    function calc(x,op,y){ return op==='+' ? x+y : x-y; }
    var top = calc(calc(a,ops1[0],b), ops1[1], c);
    var bottom = calc(calc(d,ops2[0],e), ops2[1], f);
    if(top < 0) top = Math.abs(top) + 3;
    if(bottom < 0) bottom = Math.abs(bottom) + 5;
    var result = bottom < top ? top - bottom : top + bottom;
    return { text:''+a+ops1[0]+b+ops1[1]+c+'/'+d+ops2[0]+e+ops2[1]+f, top:top, bottom:bottom, result:result };
  }
  function ruleArithmeticQuestion(localIndex, seed){
    var rng = seeded(seed + '|rule|' + localIndex);
    var ex = makeExpr(rng);
    return {
      type:'novuraExamsRuleArithmeticInput', cat:'Novura Exams-Regelrechnung', group:'Mathe',
      q:'Berechne die Aufgabe im Kopf und wende danach die Novura Exams-Regel an.',
      formula: ex.text,
      answer: String(ex.result),
      a:[String(ex.result)], correct:0,
      time:40,
      ex:'Oben bis zum / rechnen: '+ex.top+'. Unten nach dem / rechnen: '+ex.bottom+'. Wenn der Nenner kleiner ist als der Zähler: minus. Wenn der Nenner größer oder gleich ist: plus. Ergebnis: '+ex.result+'.'
    };
  }
  function numberSeriesQuestion(localIndex, seed){
    var rng = seeded(seed + '|series|' + localIndex);
    // Anspruchsvolle Zahlenreihen, im Kopf lösbar. Ergebnis als Eingabefeld.
    var patterns = [
      function(){ var s=2+Math.floor(rng()*6), d=2+Math.floor(rng()*5); var seq=[s]; for(var i=0;i<5;i++) seq.push(seq[seq.length-1]+d*(i+1)); return {seq:seq.slice(0,5), next:seq[5], hint:'Die Differenz wächst um '+d+' pro Schritt.'}; },
      function(){ var s=1+Math.floor(rng()*4), f=2+Math.floor(rng()*2); var seq=[s]; for(var i=0;i<5;i++) seq.push(seq[seq.length-1]*f); return {seq:seq.slice(0,5), next:seq[5], hint:'Jede Zahl wird mit '+f+' multipliziert.'}; },
      function(){ var a=2+Math.floor(rng()*5), b=1+Math.floor(rng()*4); var seq=[a,b]; for(var i=0;i<4;i++) seq.push(seq[seq.length-1]+seq[seq.length-2]); return {seq:seq.slice(0,5), next:seq[5], hint:'Jede Zahl ist die Summe der beiden vorherigen.'}; },
      function(){ var s=3+Math.floor(rng()*8), d=3+Math.floor(rng()*7); var seq=[]; for(var i=0;i<6;i++) seq.push(s + d*i + (i%2===0?0:d)); return {seq:seq.slice(0,5), next:seq[5], hint:'Wechselnde Schrittweite – auf das Muster der Sprünge achten.'}; },
      function(){ var s=4+Math.floor(rng()*6); var seq=[s]; for(var i=0;i<5;i++) seq.push(seq[seq.length-1]*2 - 1); return {seq:seq.slice(0,5), next:seq[5], hint:'Verdoppeln und 1 abziehen.'}; }
    ];
    var p = patterns[localIndex % patterns.length]();
    return {
      type:'novuraExamsNumberSeriesInput', cat:'Zahlenreihen', group:'Logik',
      q:'Setze die Zahlenreihe fort. Gib die nächste Zahl ein.',
      sequence: p.seq, answer: String(p.next),
      a:[String(p.next)], correct:0, time:40,
      ex:'Lösung: '+p.next+'. '+p.hint
    };
  }
  function letterQuestion(localIndex, seed){
    var rng = seeded(seed + '|letter|' + localIndex);
    var pairs = [['b','p'],['r','n'],['q','p'],['m','n']];
    var p = pairs[localIndex % pairs.length];
    var base=p[0], target=p[1];
    var len = 34 + Math.floor(rng()*10), count = 2 + Math.floor(rng()*5);
    var arr = Array(len).fill(base);
    var used = {};
    while(Object.keys(used).length < count){ used[Math.floor(rng()*len)] = true; }
    Object.keys(used).forEach(function(i){ arr[Number(i)] = target; });
    return { type:'novuraExamsLetterScanInput', cat:'Buchstaben-Konzentration', group:'Konzentration', q:'Zähle den abweichenden Buchstaben und gib die Anzahl ein.', sequence: arr.join(''), targetLetter: target, answer:String(count), a:[String(count)], correct:0, time:40, ex:'Der Buchstabe '+target+' kommt '+count+'-mal vor.' };
  }
  function coordQuestion(localIndex, seed){
    var rng = seeded(seed + '|coord|' + localIndex);
    var cols = ['A','B','C','D','E','F','G'];
    var rows = [1,2,3,4,5,6,7];
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var grid = rows.map(function(){ return cols.map(function(){ return choice(rng, letters); }); });
    var prompts = [];
    for(var i=0;i<8;i++){
      var missing = i===2 || i===6;
      var col = missing ? choice(rng, ['H','I','J']) : choice(rng, cols);
      var row = choice(rng, rows);
      var val = cols.indexOf(col) >= 0 ? grid[row-1][cols.indexOf(col)] : 'X';
      prompts.push({ key: col + row, answer: val });
    }
    return { type:'novuraExamsCoordinateTableInput', cat:'Tabellen ablesen', group:'Konzentration', q:'Lies die Koordinaten ab. Wenn eine Spalte oder Zeile nicht existiert, trage X ein.', cols:cols, rows:rows, grid:grid, prompts:prompts, answer:prompts.map(function(p){return p.answer;}).join('|'), a:[prompts.map(function(p){return p.answer;}).join('|')], correct:0, time:90, ex:'Die Tabelle wird wie Koordinaten gelesen. Fehlende Spalten/Zeilen werden mit X beantwortet.' };
  }
  function flowLogicQuestion(index, deps, profile){
    if(window.NovuraExamsFlowLogicAdapter && typeof window.NovuraExamsFlowLogicAdapter.createQuestion === 'function'){
      return window.NovuraExamsFlowLogicAdapter.createQuestion({ index:index, total:totalCount(), mode:'novuraExams', questionProfile:profile || {branch:'it', simType:'novuraExams', poolKey:'it-novura-exams'}, source:'novura-exams-exam-structure-g54-2' });
    }
    return { type:'mc', cat:'Novura Exams-Logik', group:'Logik', q:'Novura Exams-Logik: Wenn-Dann-Ablauf konnte nicht geladen werden.', a:['Weiter'], correct:0, time:780, specialTimeSeconds:780, ex:'FlowLogic-Modul nicht verfügbar.' };
  }
  function createQuestion(input){
    input = input || {};
    if(!isItNovuraExamsScope(input)) return null;
    var index = Number(input.index) || 0;
    var seed = input.seed || ('g54.3|' + index);
    var block = blockForIndex(index);
    var q;
    if(block.key === 'generalKnowledge') q = generalQuestion(block.localIndex, seed);
    else if(block.key === 'mathSprint') q = mathQuestion(block.localIndex, seed);
    else if(block.key === 'ruleArithmetic') q = ruleArithmeticQuestion(block.localIndex, seed);
    else if(block.key === 'numberSeries') q = numberSeriesQuestion(block.localIndex, seed);
    else if(block.key === 'letterScan') q = letterQuestion(block.localIndex, seed);
    else if(block.key === 'coordinateTable') q = coordQuestion(block.localIndex, seed);
    else q = flowLogicQuestion(index, input.deps || {}, input.questionProfile);
    q = baseMeta(q || {}, block, block.localIndex);
    if(block.key === 'flowLogic') { q.specialTimeSeconds = 780; q.time = 780; }
    // G54.3 Stability: Allgemeinwissen ist 40 Fragen / 7 Minuten Gesamtzeit.
    // Da der Haupttimer pro Frage arbeitet, verteilen wir 420 Sekunden fair:
    // 20 Fragen × 11 Sekunden + 20 Fragen × 10 Sekunden = exakt 420 Sekunden.
    if(block.key === 'generalKnowledge') q.time = block.localIndex < 20 ? 11 : 10;
    q.novuraExamsStabilityGuard = 'G54.3';
    return q;
  }
  function createExam(input){
    input = input || {};
    var arr=[];
    for(var i=0;i<totalCount();i++) arr.push(createQuestion(Object.assign({}, input, { index:i })));
    return arr;
  }
  function diagnostics(){
    return { version:VERSION, totalQuestions:totalCount(), totalSeconds:totalSeconds(), totalMinutes:Math.round(totalSeconds()/60*10)/10, blocks:BLOCKS.map(function(b){return Object.assign({}, b);}) };
  }

  window.NovuraExamsStructureEngine = { __version:VERSION, blocks:BLOCKS, totalCount:totalCount, totalSeconds:totalSeconds, blockForIndex:blockForIndex, isItNovuraExamsScope:isItNovuraExamsScope, createQuestion:createQuestion, createExam:createExam, diagnostics:diagnostics };
  window.NovuraExamsStructureEngine = window.NovuraExamsStructureEngine;
  window.NovuraExamsStructureEngine = window.NovuraExamsStructureEngine;
})();
