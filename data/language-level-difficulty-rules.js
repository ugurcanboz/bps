/* Language Academy · Phase 38D.2B
   Schwierigkeitsmatrix & Level-Garantie A1-C2.
   Ziel: gleicher Prüfungsrahmen, aber klar getrennte Niveau-Anforderungen. */
(function(){
  'use strict';
  function freezeDeep(obj){
    Object.keys(obj || {}).forEach(function(k){
      if(obj[k] && typeof obj[k] === 'object') freezeDeep(obj[k]);
    });
    return Object.freeze(obj);
  }
  var rules = freezeDeep({
    A1:{
      level:'A1', label:'A1 · elementare Alltagssprache', severity:1,
      readingWords:[35,90], listeningWords:[35,90], writingWords:[30,70], speakingWords:[15,60],
      expectedTasks:['Schilder','kurze Nachrichten','Formular','sich vorstellen','einfache Bitte'],
      grammar:['Präsens','Artikel','einfache Fragen','Personalpronomen','Zahlen/Uhrzeiten'],
      skills:['einzelne Informationen verstehen','kurz reagieren','Name/Ort/Zeit/Grund nennen'],
      writingMust:['Adressat','einfache Information','Grund oder Zeit'],
      speakingMust:['Begrüßung oder Einstieg','einfacher Satz','Kerninformation'],
      tolerates:['kurze Sätze','einfache Grammatikfehler','begrenzter Wortschatz'],
      rejects:['leere Antwort','Pflichtinformation fehlt','nicht verständlich'],
      caps:{ tooShort:45, missingCore:68, keywordOnly:50, offTopic:25, noStructure:72 }
    },
    A2:{
      level:'A2', label:'A2 · Alltag mit einfachen Begründungen', severity:2,
      readingWords:[80,180], listeningWords:[70,160], writingWords:[60,120], speakingWords:[35,110],
      expectedTasks:['Einladung','Entschuldigung','Termin','Anfrage','kurzer Bericht'],
      grammar:['Perfekt','Modalverben','Präpositionen','weil/dass','Satzstellung'],
      skills:['Alltagssituation erklären','einfach begründen','Termin/Wunsch/Vorschlag formulieren'],
      writingMust:['Anlass','Grund','konkreter Wunsch/Vorschlag'],
      speakingMust:['Situation','Grund','Frage oder Vorschlag'],
      tolerates:['einfache Wiederholungen','begrenzte Konnektoren'],
      rejects:['nur Stichwörter','kein Grund','keine konkrete Bitte'],
      caps:{ tooShort:45, missingCore:66, keywordOnly:42, offTopic:25, noStructure:70 }
    },
    B1:{
      level:'B1', label:'B1 · selbstständig im Alltag/Arbeit/Behörde', severity:3,
      readingWords:[160,360], listeningWords:[140,320], writingWords:[100,180], speakingWords:[65,190],
      expectedTasks:['Beschwerde','Terminverschiebung','Bewerbung','gemeinsam planen','Erfahrung berichten'],
      grammar:['Nebensätze','Kasus/Präpositionen','Konnektoren','Konjunktiv II höflich','Relativsatz einfach'],
      skills:['Problem schildern','Folge erklären','Lösung verlangen','zusammenhängend berichten'],
      writingMust:['formelle Anrede','Problem/Anlass','Folge oder Begründung','konkrete Bitte','höflicher Abschluss'],
      speakingMust:['Einstieg','Situation/Grund','Vorschlag oder Frage','Abschluss'],
      tolerates:['einige Fehler','einfache Argumentation'],
      rejects:['zu kurze Antwort','fehlende Pflichtpunkte','unhöflicher Ton','Thema verfehlt'],
      caps:{ tooShort:45, missingCore:68, keywordOnly:35, offTopic:20, noStructure:68 }
    },
    B2:{
      level:'B2', label:'B2 · Argumentation, indirekte Aussagen, differenzierte Sprache', severity:4,
      readingWords:[320,760], listeningWords:[260,650], writingWords:[180,280], speakingWords:[110,260],
      expectedTasks:['Stellungnahme','formelle Beschwerde mit Argumentation','Meinungsbeitrag','Diskussion','Vor-/Nachteile abwägen'],
      grammar:['komplexe Konnektoren','Passiv','Konjunktiv II','Nominalisierung','Textkohärenz','formelles Register'],
      skills:['These einordnen','Vor- und Nachteile abwägen','eigene Meinung begründen','Beispiele nennen','indirekte Bedeutung erkennen'],
      writingMust:['Einleitung/Position','mindestens zwei Argumente','Gegenperspektive oder Einschränkung','konkretes Beispiel','klarer Schluss'],
      speakingMust:['Thema einordnen','Pro/Contra','eigene Position','Beispiel','Fazit oder Lösung'],
      tolerates:['einzelne Fehler ohne Verständlichkeitsverlust'],
      rejects:['A1/A2-Satzketten','reine Behauptung ohne Begründung','keine eigene Position','nur Alltagssprache','keine Struktur'],
      caps:{ tooShort:40, missingCore:60, keywordOnly:30, offTopic:18, noStructure:62, simpleLanguage:65, noArgumentation:58, noOwnPosition:60 }
    },
    C1:{
      level:'C1', label:'C1 · komplex, präzise, registerbewusst', severity:5,
      readingWords:[600,1100], listeningWords:[450,900], writingWords:[240,380], speakingWords:[150,340],
      expectedTasks:['Erörterung','Kommentar','komplexe Analyse','Präsentation','Gegenargumente integrieren'],
      grammar:['Nominalstil','komplexe Satzgefüge','Register','Kohärenz','subtile Bedeutung'],
      skills:['abstrakt argumentieren','Positionen differenzieren','Gegenargumente einordnen','präzise Beispiele nutzen'],
      writingMust:['klare These','mehrere Perspektiven','Gegenargument','präzises Fazit','kohärente Struktur'],
      speakingMust:['strukturierte Präsentation','differenzierte Abwägung','spontane Reaktion','präzise Begriffe'],
      tolerates:['vereinzelte kleine Fehler'],
      rejects:['B2-Standard ohne Tiefe','unpräziser Wortschatz','fehlende Gegenperspektive'],
      caps:{ tooShort:38, missingCore:58, keywordOnly:25, offTopic:15, noStructure:58, simpleLanguage:60, noArgumentation:52, noOwnPosition:55 }
    },
    C2:{
      level:'C2', label:'C2 · nuanciert, stilistisch sicher, analytisch', severity:6,
      readingWords:[850,1400], listeningWords:[650,1200], writingWords:[320,560], speakingWords:[190,460],
      expectedTasks:['Analyse','Essay','komplexe Stellungnahme','nuancierte Debatte','Stil- und Bedeutungsanalyse'],
      grammar:['Stilpräzision','Registerwechsel','komplexe Syntax','Nuancen','idiomatische Sicherheit'],
      skills:['nuancieren','implizite Wertungen erkennen','mehrdimensional analysieren','stilsicher formulieren'],
      writingMust:['analytische Leitfrage','mehrdimensionale Argumentation','präzise Fachsprache','Risiko-/Folgenanalyse','nuanciertes Fazit'],
      speakingMust:['abstrakt analysieren','spontan nuancieren','mehrere Dimensionen verbinden','präziser Abschluss'],
      tolerates:['kaum relevante Fehler'],
      rejects:['zu allgemein','stilistisch unsicher','fehlende Nuancen','bloße B2/C1-Struktur'],
      caps:{ tooShort:35, missingCore:55, keywordOnly:20, offTopic:12, noStructure:55, simpleLanguage:55, noArgumentation:48, noOwnPosition:50 }
    }
  });
  function normalizeLevel(level){ var v=String(level||'B1').toUpperCase(); return rules[v]?v:'B1'; }
  function get(level){ return rules[normalizeLevel(level)]; }
  function list(){ return Object.keys(rules); }
  function summary(level){
    var r=get(level);
    return r.level+': '+r.label+' · Schreiben '+r.writingWords[0]+'–'+r.writingWords[1]+' Wörter · Sprechen '+r.speakingWords[0]+'–'+r.speakingWords[1]+' Wörter · Fokus: '+r.skills.slice(0,3).join(', ');
  }
  function validateDifferentiation(){
    var checks=[];
    checks.push({name:'A1-vs-B2-writing-gap', ok:get('B2').writingWords[0] >= get('A1').writingWords[0]*5});
    checks.push({name:'A1-vs-B2-speaking-gap', ok:get('B2').speakingWords[0] >= get('A1').speakingWords[0]*6});
    checks.push({name:'B2-has-argumentation', ok:get('B2').skills.join(' ').toLowerCase().indexOf('meinung')>=0 && get('B2').writingMust.join(' ').toLowerCase().indexOf('argument')>=0});
    checks.push({name:'A1-keeps-simple-communication', ok:get('A1').skills.join(' ').toLowerCase().indexOf('kurz')>=0});
    checks.push({name:'six-levels-defined', ok:list().length===6});
    return {ok:checks.every(function(c){return c.ok;}), phase:'38D.2B', checks:checks};
  }
  window.LanguageLevelDifficultyRules = Object.freeze({
    __version:'G54.38D.2B-level-differentiation-rules',
    get:get,
    list:list,
    summary:summary,
    validateDifferentiation:validateDifferentiation
  });
})();
