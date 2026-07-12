/* Eignungstest-Trainer · Sprachtest-Kalibrierung · G54.46.10
   Einheitliche Variantenlast, Zeitmodell, Gewichtung und vorsichtige Trainingsprognose.
   Keine offizielle Zertifizierung: Die Kalibrierung gilt nur für diese interne Hardmode-Simulation. */
(function(){
  'use strict';

  var VERSION = 'G54.46.10';
  var SCHEMA = 'egt-language-exam-calibration-v1';
  var PARTS = ['reading','listening','grammar','writing','speaking'];
  var LEVELS = ['A1','A2','B1','B2','C1','C2'];

  var PROFILES = Object.freeze({
    A1:Object.freeze({readingWords:[30,70],listeningWords:[24,55],questions:{reading:4,listening:4,grammar:4},weights:{reading:20,listening:20,grammar:20,writing:20,speaking:20}}),
    A2:Object.freeze({readingWords:[45,90],listeningWords:[50,80],questions:{reading:4,listening:4,grammar:4},weights:{reading:20,listening:20,grammar:20,writing:20,speaking:20}}),
    B1:Object.freeze({readingWords:[75,145],listeningWords:[65,120],questions:{reading:5,listening:5,grammar:5},weights:{reading:20,listening:20,grammar:15,writing:25,speaking:20}}),
    B2:Object.freeze({readingWords:[95,175],listeningWords:[70,135],questions:{reading:6,listening:6,grammar:6},weights:{reading:20,listening:20,grammar:15,writing:25,speaking:20}}),
    C1:Object.freeze({readingWords:[120,210],listeningWords:[90,165],questions:{reading:6,listening:6,grammar:6},weights:{reading:20,listening:20,grammar:15,writing:25,speaking:20}}),
    C2:Object.freeze({readingWords:[145,245],listeningWords:[105,190],questions:{reading:7,listening:7,grammar:7},weights:{reading:20,listening:20,grammar:15,writing:25,speaking:20}})
  });

  var EXTRA = {
    de:{
      A1:{
        reading:' Bei Fragen hilft das Büro. Es ist heute bis 19 Uhr geöffnet.',
        listening:' Am Ende wird gesagt: Bitte kommen Sie zehn Minuten früher.'
      },
      A2:{
        reading:' Änderungen sollen spätestens am Vortag gemeldet werden. Wer Hilfe braucht, kann zwischen 14 und 16 Uhr anrufen. Eine kurze Nachricht per E-Mail ist ebenfalls möglich.',
        listening:' Die Nachricht erklärt außerdem, dass Änderungen bis zum Vortag gemeldet werden sollen. Für Rückfragen ist das Büro zwischen 14 und 16 Uhr erreichbar.'
      },
      B1:{
        reading:' Ergänzend bittet die verantwortliche Stelle darum, Rückfragen schriftlich zu senden. Eine Antwort wird innerhalb von zwei Arbeitstagen zugesagt. Wer eine genannte Frist verpasst, muss mit einer längeren Bearbeitungszeit rechnen. In dringenden Fällen soll die eigene Telefonnummer angegeben werden.',
        listening:' Zum Schluss weist die Sprecherin darauf hin, dass Rückfragen schriftlich gestellt werden sollen. Eine Antwort folgt normalerweise innerhalb von zwei Arbeitstagen. Bei dringenden Fällen soll eine Telefonnummer hinterlassen werden, damit ein Rückruf möglich ist.'
      },
      B2:{
        reading:' Der Beitrag unterscheidet ausdrücklich zwischen kurzfristiger Wirkung und langfristiger Tragfähigkeit. Eine Maßnahme könne zunächst überzeugend wirken, ohne die strukturellen Ursachen zu lösen. Deshalb wird vorgeschlagen, sie zuerst in einem begrenzten Pilotprojekt zu testen, transparente Kriterien festzulegen und die Ergebnisse nach sechs Monaten öffentlich auszuwerten. Erst danach solle über eine dauerhafte Ausweitung entschieden werden.',
        listening:' Im weiteren Gespräch wird zwischen einem schnellen sichtbaren Effekt und einer langfristig tragfähigen Lösung unterschieden. Die Expertin empfiehlt ein begrenztes Pilotprojekt mit vorher festgelegten Kriterien. Nach sechs Monaten sollen Ergebnisse und unerwünschte Folgen ausgewertet werden, bevor die Maßnahme dauerhaft ausgeweitet wird.'
      },
      C1:{
        reading:' Zugleich warnt der Text davor, vorläufige Befunde vorschnell als allgemeingültige Evidenz zu behandeln. Aussagekräftig werde eine Bewertung erst dann, wenn unterschiedliche Betroffenengruppen einbezogen, die verwendeten Kriterien offengelegt und unbeabsichtigte Nebenfolgen dokumentiert würden. Transparenz bedeute dabei nicht nur, Zahlen zu veröffentlichen, sondern auch zu erklären, welche Annahmen den Kennzahlen zugrunde liegen und welche Perspektiven möglicherweise unberücksichtigt bleiben.',
        listening:' Die Sprecherin bezeichnet die bisherige Evidenz als vorläufig. Eine belastbare Bewertung müsse verschiedene Betroffenengruppen berücksichtigen, Kriterien offenlegen und Nebenfolgen dokumentieren. Transparenz bedeute nicht nur die Veröffentlichung von Zahlen, sondern auch eine Erklärung der Annahmen, auf denen diese Zahlen beruhen. Andernfalls könne eine scheinbar neutrale Auswertung bestehende Interessen verdecken.'
      },
      C2:{
        reading:' Der Essay verschiebt die Frage schließlich von der bloßen Wirksamkeit zur Verteilung von Deutungsmacht. Kategorien, Kennzahlen und scheinbar neutrale Schwellenwerte beschreiben eine Wirklichkeit nicht nur, sondern strukturieren zugleich, welche Ziele als vernünftig gelten und wer Abweichungen rechtfertigen muss. Gerade deshalb müsse Unsicherheit sichtbar bleiben: Eine präzise Zahl könne größere Gewissheit suggerieren, als die zugrunde liegenden Annahmen erlauben. Verantwortliche sollten Klassifikationen daher als anfechtbare argumentative Entscheidungen behandeln und nicht als naturgegebene Eigenschaften des Gegenstands.',
        listening:' Im letzten Abschnitt verlagert die Rednerin die Debatte von der technischen Wirksamkeit auf die Frage der Deutungsmacht. Kennzahlen beschreiben Ziele nicht lediglich, sondern prägen, welche Ziele überhaupt als vernünftig erscheinen. Eine präzise Zahl könne dabei Gewissheit vortäuschen, obwohl Annahmen und Kategorien umstritten bleiben. Deshalb sollten Klassifikationen als begründungspflichtige Entscheidungen behandelt werden. Betroffene müssten außerdem die Möglichkeit erhalten, die ihnen zugewiesenen Kategorien anzufechten.'
      }
    },
    en:{
      A1:{
        reading:' The office can answer questions. It is open until seven o’clock today.',
        listening:' At the end, the speaker asks everyone to arrive ten minutes early.'
      },
      A2:{
        reading:' Changes should be reported by the previous day. People who need help can call between two and four in the afternoon. A short email is also possible.',
        listening:' The message also says that changes should be reported by the previous day. The office answers questions between two and four in the afternoon.'
      },
      B1:{
        reading:' The responsible office also asks people to send questions in writing. It promises a reply within two working days. Anyone who misses the stated deadline may have to wait longer. In an urgent case, the person should include a telephone number so that the office can call back.',
        listening:' At the end, the speaker asks listeners to send questions in writing. A reply normally arrives within two working days. In urgent cases, people should leave a telephone number so that the office can call them back.'
      },
      B2:{
        reading:' The article explicitly distinguishes between a short-term effect and long-term sustainability. A measure may look convincing at first without addressing the underlying causes. It therefore recommends a limited pilot, transparent success criteria and a public review after six months. Only after that review should decision-makers consider a permanent expansion.',
        listening:' The discussion distinguishes a quick visible effect from a sustainable solution. The expert recommends a limited pilot with criteria agreed in advance. After six months, both intended results and unintended consequences should be reviewed before the measure is expanded permanently.'
      },
      C1:{
        reading:' The text also warns against treating provisional findings as universally valid evidence. An evaluation becomes persuasive only when it includes different affected groups, discloses its criteria and records unintended consequences. Transparency therefore means more than publishing figures: it requires an account of the assumptions behind them and of the perspectives that may have been excluded.',
        listening:' The speaker describes the available evidence as provisional. A robust evaluation must include different affected groups, disclose its criteria and document unintended consequences. Transparency is not achieved by publishing figures alone; the assumptions behind those figures must also be explained. Otherwise, an apparently neutral assessment may conceal existing interests.'
      },
      C2:{
        reading:' The essay ultimately shifts the issue from effectiveness alone to the distribution of interpretive power. Categories, metrics and apparently neutral thresholds do not merely describe reality; they also shape which goals appear reasonable and who must justify deviation. Uncertainty must therefore remain visible. A precise figure may imply more confidence than its underlying assumptions permit. Classifications should consequently be treated as contestable argumentative decisions rather than as natural properties of the subject.',
        listening:' In the final section, the speaker moves from technical effectiveness to interpretive power. Metrics do not merely record goals; they influence which goals can appear reasonable. A precise number may project certainty while its categories and assumptions remain disputed. Classifications should therefore be justified as decisions, and affected people should be able to challenge the categories assigned to them.'
      }
    }
  };

  function normalizeLevel(level){ level=String(level||'B1').toUpperCase(); return LEVELS.indexOf(level)>=0?level:'B1'; }
  function normalizeLanguage(language){ language=String(language||'de').toLowerCase(); return language==='en'||language==='english'||language==='englisch'?'en':'de'; }
  function words(text){ return String(text||'').trim().split(/\s+/).filter(Boolean); }
  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function row(id,q,c,w1,w2,e){ return [id,q,c,w1,w2,'a',e]; }
  function profile(level){ return PROFILES[normalizeLevel(level)]; }
  function weights(level){ return Object.assign({},profile(level).weights); }
  function sumWeights(map){ return PARTS.reduce(function(sum,p){return sum+Number(map[p]||0);},0); }

  function supplementalRows(level,language,part,variant){
    level=normalizeLevel(level); language=normalizeLanguage(language); part=String(part||'reading');
    var base=(variant&&variant.id?variant.id:(language+'-'+level.toLowerCase()))+'-cal-'+part;
    var de=language==='de';
    var rows=[];
    if(level==='B1'){
      rows.push(de
        ? row(base+'-1',part==='reading'?'Wie sollen Rückfragen gestellt werden?':'Wie sollen Hörer Rückfragen stellen?','Schriftlich','Nur persönlich','Gar nicht','Zusatztext: Rückfragen schriftlich senden.')
        : row(base+'-1',part==='reading'?'How should questions be sent?':'How should listeners send questions?','In writing','Only in person','They should not ask','The additional text requests written questions.'));
    }
    if(level==='B2'){
      rows.push(de
        ? row(base+'-1','Welcher erste Schritt wird empfohlen?','Ein begrenztes Pilotprojekt','Eine sofortige dauerhafte Ausweitung','Der Verzicht auf jede Auswertung','Der Zusatz empfiehlt zunächst einen Pilotversuch.')
        : row(base+'-1','What is recommended as the first step?','A limited pilot','Immediate permanent expansion','No evaluation at all','The additional section recommends a pilot first.'));
      rows.push(de
        ? row(base+'-2','Wann soll über eine dauerhafte Ausweitung entschieden werden?','Nach der Auswertung nach sechs Monaten','Vor Beginn des Pilotprojekts','Ohne festgelegte Kriterien','The decision follows the six-month review.')
        : row(base+'-2','When should permanent expansion be considered?','After the six-month review','Before the pilot begins','Without agreed criteria','The decision follows the review.'));
    }
    if(level==='C1'){
      rows.push(de
        ? row(base+'-1','Wann gilt eine Bewertung als belastbarer?','Wenn verschiedene Gruppen, Kriterien und Nebenfolgen berücksichtigt werden','Wenn nur eine Kennzahl veröffentlicht wird','Wenn Annahmen verborgen bleiben','Der Zusatz nennt mehrere Bedingungen belastbarer Evaluation.')
        : row(base+'-1','When does an evaluation become more persuasive?','When affected groups, criteria and unintended effects are included','When one figure is published','When assumptions remain hidden','The additional section names several conditions.'));
      rows.push(de
        ? row(base+'-2','Was bedeutet Transparenz hier zusätzlich?','Die Annahmen hinter den Zahlen zu erklären','Nur möglichst viele Zahlen zu nennen','Kritische Perspektiven auszuschließen','Transparenz umfasst die Erklärung der Annahmen.')
        : row(base+'-2','What does transparency additionally require?','Explaining the assumptions behind the figures','Publishing as many figures as possible','Excluding critical perspectives','Transparency includes assumptions.'));
    }
    if(level==='C2'){
      rows.push(de
        ? row(base+'-1','Welche Funktion haben Kennzahlen laut Zusatz?','Sie prägen auch, welche Ziele vernünftig erscheinen','Sie bilden Wirklichkeit vollständig neutral ab','Sie beseitigen jede Unsicherheit','Metrics also shape perceived goals.')
        : row(base+'-1','What function do metrics have in the additional section?','They also shape which goals appear reasonable','They describe reality with complete neutrality','They remove all uncertainty','Metrics shape perceived goals.'));
      rows.push(de
        ? row(base+'-2','Warum kann eine präzise Zahl problematisch sein?','Sie kann mehr Gewissheit suggerieren, als die Annahmen erlauben','Sie ist grundsätzlich immer falsch','Sie enthält zu wenige Dezimalstellen','Precision can overstate confidence.')
        : row(base+'-2','Why can a precise figure be problematic?','It may imply more certainty than its assumptions support','It is always false','It has too few decimal places','Precision can overstate confidence.'));
      rows.push(de
        ? row(base+'-3','Wie sollen Klassifikationen behandelt werden?','Als anfechtbare und begründungspflichtige Entscheidungen','Als natürliche Eigenschaften ohne Diskussion','Als rein technische Zufallswerte','Classifications remain contestable decisions.')
        : row(base+'-3','How should classifications be treated?','As contestable decisions that require justification','As natural properties beyond discussion','As random technical values','Classifications remain contestable decisions.'));
    }
    return rows;
  }

  function grammarRows(level,language,variant){
    level=normalizeLevel(level); language=normalizeLanguage(language);
    var base=(variant&&variant.id?variant.id:(language+'-'+level.toLowerCase()))+'-cal-g';
    var de=language==='de', out=[];
    if(level==='B1') out.push(de
      ? row(base+'1','Welche Verbindung ist korrekt?','Die Frist ist knapp; trotzdem reiche ich die Unterlagen ein.','Die Frist ist knapp, weil trotzdem Unterlagen.','Trotzdem weil die Frist knapp.','Konzessive Verbindung.')
      : row(base+'1','Which connection is correct?','The deadline is tight; nevertheless, I will submit the documents.','The deadline is tight because nevertheless documents.','Nevertheless because the deadline tight.','Concessive connection.'));
    if(level==='B2'){
      out.push(de
        ? row(base+'1','Welche Formulierung schränkt eine Aussage sachlich ein?','Die Maßnahme ist unter bestimmten Bedingungen sinnvoll.','Die Maßnahme funktioniert immer perfekt.','Die Maßnahme ist komplett nutzlos.','Kontrollierte Einschränkung.')
        : row(base+'1','Which wording qualifies a claim appropriately?','The measure is useful under specific conditions.','The measure always works perfectly.','The measure is completely useless.','Controlled qualification.'));
      out.push(de
        ? row(base+'2','Setze ein: Die Ergebnisse werden veröffentlicht, ___ die Prüfung abgeschlossen ist.','sobald','obwohl deshalb','trotz','Temporale Verbindung.')
        : row(base+'2','Complete: The results will be published ___ the review has been completed.','once','although therefore','despite','Temporal connector.'));
    }
    if(level==='C1'){
      out.push(de
        ? row(base+'1','Welche Formulierung markiert Vorläufigkeit?','Die Befunde lassen zunächst nur eine vorsichtige Schlussfolgerung zu.','Die Befunde beweisen alles endgültig.','Die Befunde sind egal.','Wissenschaftliche Vorsicht.')
        : row(base+'1','Which wording signals provisionality?','The findings initially support only a cautious conclusion.','The findings prove everything conclusively.','The findings are irrelevant.','Academic caution.'));
      out.push(de
        ? row(base+'2','Setze ein: Die Bewertung ist nur belastbar, ___ die Kriterien offengelegt werden.','sofern','dennoch weil','trotz','Bedingung mit sofern.')
        : row(base+'2','Complete: The evaluation is robust only ___ the criteria are disclosed.','provided that','nevertheless because','despite','Conditional connector.'));
    }
    if(level==='C2'){
      out.push(de
        ? row(base+'1','Welche Formulierung reflektiert Deutungsmacht?','Die Kategorie beschreibt den Gegenstand und rahmt zugleich seine Bewertung.','Die Kategorie ist nur ein neutrales Etikett.','Kategorien haben keinerlei Wirkung.','Reflexive Sprachkritik.')
        : row(base+'1','Which wording reflects interpretive power?','The category describes the subject while also framing its evaluation.','The category is only a neutral label.','Categories have no effect.','Reflexive language analysis.'));
      out.push(de
        ? row(base+'2','Setze ein: Die Kennzahl wirkt objektiv, ___ ihre Auswahl bereits normativ ist.','obgleich','deshalb weil','infolge','Konzessive Präzision.')
        : row(base+'2','Complete: The metric appears objective, ___ its selection is already normative.','although','therefore because','as a result of','Concessive precision.'));
      out.push(de
        ? row(base+'3','Welche Aussage wahrt epistemische Vorsicht?','Die Daten stützen diese Deutung, erzwingen sie jedoch nicht.','Die Daten erlauben nur diese eine Wahrheit.','Die Daten sind bedeutungslos.','Evidenz ohne Übertreibung.')
        : row(base+'3','Which statement preserves epistemic caution?','The data support this interpretation but do not compel it.','The data permit only this single truth.','The data are meaningless.','Evidence without overstatement.'));
    }
    return out;
  }

  function paddingSentence(language,level,part){
    var de=language==='de';
    if(de){
      if(level==='A2')return ' Die zusätzliche Information hilft dabei, den nächsten Schritt rechtzeitig und ohne Missverständnisse zu planen.';
      if(level==='B1')return ' Der Hinweis macht außerdem deutlich, dass eine rechtzeitige und nachvollziehbare Rückmeldung spätere Probleme vermeiden kann.';
      if(level==='B2')return ' Entscheidend ist daher nicht nur die sichtbare Wirkung, sondern auch, ob das Verfahren nachvollziehbar, überprüfbar und dauerhaft tragfähig bleibt.';
      if(level==='C1')return ' Eine solche Einordnung verlangt folglich, methodische Grenzen ausdrücklich zu benennen und konkurrierende Interpretationen nicht vorschnell auszuschließen.';
      if(level==='C2')return ' Die analytische Pointe liegt somit darin, dass selbst präzise Verfahren ihre normativen Vorentscheidungen nicht aufheben, sondern lediglich weniger sichtbar machen können.';
      return ' Dieser Hinweis gehört ebenfalls zur Aufgabe und soll aufmerksam gelesen beziehungsweise gehört werden.';
    }
    if(level==='A2')return ' This additional information helps people plan the next step in time and avoid misunderstandings.';
    if(level==='B1')return ' The notice also makes clear that an early and understandable reply can prevent further problems.';
    if(level==='B2')return ' The decisive issue is therefore not only the visible effect but also whether the process remains transparent, reviewable and sustainable.';
    if(level==='C1')return ' Such an assessment consequently requires explicit methodological limits and must not exclude competing interpretations too quickly.';
    if(level==='C2')return ' The analytical point is that even precise procedures may preserve normative assumptions while merely making those assumptions less visible.';
    return ' This information is also part of the task and should be read or heard carefully.';
  }
  function ensureMinWords(text,extra,min,language,level,part){
    var out=String(text||'').trim();
    if(words(out).length<min && extra && out.indexOf(String(extra).trim())<0) out=(out+' '+String(extra).trim()).trim();
    var pad=paddingSentence(language,level,part), guard=0;
    while(words(out).length<min && guard<3){ out=(out+' '+pad.trim()).trim(); guard++; }
    return out;
  }
  function uniqueRows(rows){
    var seen={}; return (rows||[]).filter(function(r){var id=String(r&&r[0]||''); if(!id||seen[id])return false; seen[id]=true; return true;});
  }
  function calibrateVariant(level,language,variant){
    level=normalizeLevel(level); language=normalizeLanguage(language);
    var p=profile(level), v=clone(variant||{}), ex=EXTRA[language][level];
    v.level=level; v.language=language;
    v.readingText=ensureMinWords(v.readingText,ex.reading,p.readingWords[0],language,level,'reading');
    v.listeningText=ensureMinWords(v.listeningText,ex.listening,p.listeningWords[0],language,level,'listening');
    v.readingQuestions=uniqueRows((v.readingQuestions||[]).concat(supplementalRows(level,language,'reading',v))).slice(0,p.questions.reading);
    v.listeningQuestions=uniqueRows((v.listeningQuestions||[]).concat(supplementalRows(level,language,'listening',v))).slice(0,p.questions.listening);
    v.grammarQuestions=uniqueRows((v.grammarQuestions||[]).concat(grammarRows(level,language,v))).slice(0,p.questions.grammar);
    v.calibration={schema:SCHEMA,version:VERSION,profile:level,readingWords:words(v.readingText).length,listeningWords:words(v.listeningText).length,questionCounts:{reading:v.readingQuestions.length,listening:v.listeningQuestions.length,grammar:v.grammarQuestions.length},weights:weights(level),calibrated:true};
    return v;
  }
  function calibratePool(level,language,pool){ return (pool||[]).map(function(v){return calibrateVariant(level,language,v);}); }

  function timeModel(level,blueprint){
    level=normalizeLevel(level); var parts=(blueprint&&blueprint.parts)||{}, byPart={}, total=0;
    PARTS.forEach(function(part){var m=Math.max(1,Number(parts[part]&&parts[part].durationMinutes||0)); byPart[part]=m; total+=m;});
    return {schema:SCHEMA,level:level,parts:byPart,totalMinutes:total,warningAtPercent:35,dangerAtPercent:15,graceSeconds:0,strict:true};
  }

  function weightedOverall(partScores,level){
    var w=weights(level), denom=sumWeights(w), total=0;
    PARTS.forEach(function(part){total+=Number(partScores&&partScores[part]||0)*Number(w[part]||0);});
    return denom?Math.round(total/denom):0;
  }

  function confidence(options){
    options=options||{}; var overall=Number(options.overall||0), pass=Number(options.passScore||70), minMargin=Number(options.minPartMargin||0), completed=Number(options.completedParts||0), total=Number(options.totalParts||5);
    if(completed<total) return {probability:0,label:'Unvollständig',evidence:'incomplete',cap:0};
    var passed=!!options.passed, probability;
    if(passed) probability=58+Math.max(0,overall-pass)*1.15+Math.max(0,minMargin)*0.45;
    else probability=18+Math.max(0,overall-(pass-20))*1.15;
    var evidenceCount=Math.max(1,Number(options.distinctPassedVariants||0)+(passed?1:0));
    var cap=evidenceCount>=3?90:(evidenceCount===2?84:78);
    if(options.helperMode) cap=Math.min(cap,62);
    if(options.localOnlyFreeParts) cap=Math.min(cap,68);
    probability=Math.max(5,Math.min(cap,Math.round(probability)));
    var label=!passed?(overall>=pass-8?'Unsichere Trainingsprognose':'Noch nicht prüfungsbereit'):(evidenceCount>=2&&probability>=80?'Stabilere Trainingsprognose':'Vorläufig positive Trainingsprognose');
    return {probability:probability,label:label,evidence:evidenceCount>=3?'three-variants':(evidenceCount===2?'two-variants':'single-variant'),cap:cap};
  }

  function spread(values){ values=(values||[]).map(Number).filter(function(x){return isFinite(x)&&x>0;}); if(!values.length)return 0; var min=Math.min.apply(Math,values),max=Math.max.apply(Math,values); return Math.round(((max-min)/min)*1000)/10; }
  function auditLevel(level,language,pool,blueprint){
    level=normalizeLevel(level); language=normalizeLanguage(language); var p=profile(level), calibrated=calibratePool(level,language,pool), rows=calibrated.map(function(v){return {id:v.id,readingWords:words(v.readingText).length,listeningWords:words(v.listeningText).length,readingQuestions:v.readingQuestions.length,listeningQuestions:v.listeningQuestions.length,grammarQuestions:v.grammarQuestions.length};});
    var findings=[];
    rows.forEach(function(r){
      if(r.readingWords<p.readingWords[0]||r.readingWords>p.readingWords[1])findings.push(r.id+': Lesetext außerhalb des Kalibrierungsbands.');
      if(r.listeningWords<p.listeningWords[0]||r.listeningWords>p.listeningWords[1])findings.push(r.id+': Hörtext außerhalb des Kalibrierungsbands.');
      ['reading','listening','grammar'].forEach(function(part){if(r[part+'Questions']!==p.questions[part])findings.push(r.id+': '+part+' hat falsche Fragenzahl.');});
    });
    var readingSpread=spread(rows.map(function(r){return r.readingWords;})), listeningSpread=spread(rows.map(function(r){return r.listeningWords;}));
    if(readingSpread>35)findings.push(level+' '+language+': Lesetext-Spread über 35%.');
    if(listeningSpread>35)findings.push(level+' '+language+': Hörtext-Spread über 35%.');
    var tm=timeModel(level,blueprint);
    if(tm.totalMinutes<=0)findings.push(level+' '+language+': Zeitmodell fehlt.');
    return {level:level,language:language,ok:findings.length===0,variants:rows,readingSpreadPercent:readingSpread,listeningSpreadPercent:listeningSpread,timeModel:tm,weights:weights(level),findings:findings};
  }

  window.LanguageExamCalibrationEngine=Object.freeze({
    __version:VERSION,schema:SCHEMA,levels:LEVELS.slice(),parts:PARTS.slice(),getProfile:profile,getWeights:weights,calibrateVariant:calibrateVariant,calibratePool:calibratePool,timeModel:timeModel,weightedOverall:weightedOverall,confidence:confidence,auditLevel:auditLevel,wordCount:function(t){return words(t).length;}
  });
})();
