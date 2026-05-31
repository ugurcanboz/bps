/* BPS-Trainer V10.1.0 · Python Quest Academy DB
   Separate Python-Aufgabendatenbank: kein BPS/CTC-Simulationscontent, sondern Kurs-DNA. */
(function(){
  'use strict';

  function level(id, title, band, summary, concepts, examTitle, locked){
    return {
      id: 'py_level_' + String(id).padStart(2,'0'),
      level: id,
      title: title,
      band: band,
      lockedByDefault: id > 1,
      summary: summary,
      pdf: 'docs/python-levels/python-level-' + String(id).padStart(2,'0') + '.pdf',
      concepts: concepts,
      xpReward: id <= 2 ? 180 : 120 + id * 15,
      requiredScore: id <= 2 ? 86 : 87,
      unlockAfter: id === 1 ? null : 'py_level_' + String(id-1).padStart(2,'0'),
      status: locked ? 'roadmap' : 'buildable',
      lessons: [],
      checks: [],
      practiceTasks: [],
      midExam: {
        id: 'py_level_' + String(id).padStart(2,'0') + '_mid',
        title: 'Zwischenprüfung · ' + title,
        purpose: 'Fortschritt innerhalb des Levels prüfen, bevor die Abschlussprüfung freigeschaltet wird.',
        requiredScore: 75,
        requiredConcepts: concepts,
        tasks: [],
        testCases: [],
        rubric: []
      },
      finalExam: {
        id: 'py_level_' + String(id).padStart(2,'0') + '_final',
        title: examTitle || ('Abschlussprüfung · ' + title),
        uploadTypes: ['.py','.txt'],
        requiredScore: id <= 2 ? 86 : 87,
        task: 'Reiche eine Python-Datei ein, die alle Pflichtkonzepte dieses Levels praktisch zeigt.',
        requiredConcepts: concepts,
        requiredTokens: [],
        forbiddenTokens: ['eval(','exec(','__import__(','subprocess','os.system'],
        knockoutErrors: ['kein Code vorhanden','Aufgabe komplett verfehlt'],
        testCases: [],
        rubric: [
          {key:'syntax', label:'Syntax', points:20},
          {key:'concepts', label:'Pflichtkonzepte', points:25},
          {key:'logic', label:'Aufgabe erfüllt', points:20},
          {key:'structure', label:'Programmstruktur', points:20},
          {key:'readability', label:'Lesbarkeit', points:10},
          {key:'reflection', label:'sinnvolle Kommentare', points:5}
        ]
      },
      coachRules: {
        mode:'python_exam',
        noHallucination:true,
        feedbackStyle:'konkret, anfängerfreundlich, prüfungsnah',
        classifyErrors:['Syntaxfehler','Einrückungsfehler','Datentypfehler','Logikfehler','Aufgabenverfehlung','Lesbarkeitsproblem','Formatierungsproblem'],
        unlockOnlyOnFinalPass:true,
        finalRequiresMidPass:true,
        phase:'v10.5.0-phase-10-quiz-mastery'
      }
    };
  }

  var levels = [
    level(1,'Hallo Welt, Kommentare & Variablen','Beginner','Erster echter Einstieg: Text ausgeben, Werte speichern und Code lesbar kommentieren.',['print','comment','variable'],'Abschlussprüfung · Vorstellungsprogramm',false),
    level(2,'Ausgabe gestalten, f-Strings & Terminalfarben','Beginner','Ausgaben sauber formatieren, Variablen mit f-Strings einbauen und einfache ANSI-Farben bewusst nutzen.',['print','variable','f_string','formatting','ansi_color'],'Abschlussprüfung · Profilkarte mit Farbe',false),
    level(3,'Eingaben mit input()','Beginner','Nutzereingaben entgegennehmen und in Ausgaben verwenden.',['input','variable','print','f_string'],'Abschlussprüfung · Dialogprogramm',true),
    level(4,'Zahlen, Rechnen & Datentypen','Beginner','Zahlen verarbeiten, umwandeln und einfache Rechnungen durchführen.',['int','float','operators','type_conversion'],'Abschlussprüfung · Mini-Rechner',true),
    level(5,'if / else Entscheidungen','Beginner','Bedingungen formulieren und Grenzfälle sauber lösen.',['if','else','comparison','indentation'],'Abschlussprüfung · Altersprüfer',true),
    level(6,'while-Schleifen','Basic Programmer','Wiederholen, bis eine Bedingung erfüllt ist.',['while','condition','counter','loop_exit'],'Abschlussprüfung · Wiederholungsdialog',true),
    level(7,'for-Schleifen','Basic Programmer','Geordnete Wiederholungen und Zählbereiche anwenden.',['for','range','iteration'],'Abschlussprüfung · Zahlen-Generator',true),
    level(8,'Listen Grundlagen','Basic Programmer','Mehrere Werte speichern, ausgeben und verändern.',['list','append','index','len'],'Abschlussprüfung · Einkaufsliste',true),
    level(9,'Listen durchlaufen','Basic Programmer','Listen mit Schleifen auswerten und einfache Statistiken bilden.',['list_loop','for','accumulator'],'Abschlussprüfung · Punkteliste',true),
    level(10,'Mini-Quiz mit Punktestand','Basic Programmer','Mehrere Fragen stellen, Antworten prüfen und Punkte zählen.',['input','if','list','score'],'Abschlussprüfung · Quiz v1',true),
    level(11,'Funktionen mit def','Intermediate','Code in eigene Bausteine zerlegen.',['def','call','function_name'],'Abschlussprüfung · Funktionssammlung',true),
    level(12,'Parameter','Intermediate','Funktionen flexibel machen.',['parameter','argument','def'],'Abschlussprüfung · Begrüßungsfunktion',true),
    level(13,'Rückgabewerte','Intermediate','Ergebnisse aus Funktionen zurückgeben.',['return','function','variable'],'Abschlussprüfung · Rechner-Funktionen',true),
    level(14,'Dictionaries','Intermediate','Daten mit Schlüssel-Wert-Paaren strukturieren.',['dict','key','value','lookup'],'Abschlussprüfung · Kontaktkarte',true),
    level(15,'Code-Struktur & kleine Tools','Intermediate','Programme lesbarer planen und in Abschnitte gliedern.',['functions','structure','main_flow'],'Abschlussprüfung · Tool-Menü',true),
    level(16,'Dateien lesen','Project Builder','Textdateien öffnen und Inhalte lesen.',['open','read','with'],'Abschlussprüfung · Datei-Anzeige',true),
    level(17,'Dateien schreiben','Project Builder','Ergebnisse dauerhaft speichern.',['write','append','with'],'Abschlussprüfung · Notizspeicher',true),
    level(18,'JSON Grundlagen','Project Builder','Strukturierte Daten speichern und laden.',['json','load','dump'],'Abschlussprüfung · JSON-Profil',true),
    level(19,'Module importieren','Project Builder','Python-Bibliotheken gezielt nutzen.',['import','module','random'],'Abschlussprüfung · Zufallsgenerator',true),
    level(20,'Debugging & robuste Programme','Project Builder','Fehler systematisch finden und Code stabilisieren.',['debugging','traceback','test_inputs'],'Abschlussprüfung · stabiler Mini-Rechner',true),
    level(21,'try / except','Advanced Basics','Fehler abfangen, ohne dass das Programm abstürzt.',['try','except','ValueError'],'Abschlussprüfung · sichere Eingabe',true),
    level(22,'Klassen verstehen','Advanced Basics','Objektorientiertes Denken einführen.',['class','object','attribute'],'Abschlussprüfung · Spielerklasse',true),
    level(23,'Methoden','Advanced Basics','Verhalten in Klassen einbauen.',['method','self','class'],'Abschlussprüfung · Konto-Objekt',true),
    level(24,'Projektstruktur','Advanced Basics','Dateien, Funktionen und Ablauf sauber organisieren.',['project_structure','main','module'],'Abschlussprüfung · kleines Paket',true),
    level(25,'APIs einfach verstehen','Advanced Basics','Schnittstellen und Datenfluss begreifen.',['api','request','response'],'Abschlussprüfung · API-Denkmodell',true),
    level(26,'SQLite Einstieg','Practical Developer','Datenbank öffnen, Tabelle verstehen und erste Abfragen schreiben.',['sqlite3','connect','cursor'],'Abschlussprüfung · Datenbankverbindung',true),
    level(27,'CRUD mit SQLite','Practical Developer','Daten anlegen, lesen, ändern und löschen.',['create','read','update','delete','sql'],'Abschlussprüfung · Kontakt-Datenbank',true),
    level(28,'Login-Logik einfach','Practical Developer','Benutzername/Passwort-Prüfung sicherer denken.',['login','hashing_concept','validation'],'Abschlussprüfung · Login-Simulation',true),
    level(29,'Mini-App planen','Practical Developer','Ein größeres Programm in Komponenten planen.',['planning','requirements','modules'],'Abschlussprüfung · Projektplan + Codegerüst',true),
    level(30,'Abschlussprojekt Python Trainer','Practical Developer','Eigenes Python-Projekt mit Daten, Logik, Funktionen und Auswertung.',['project','database','functions','testing'],'Finale Abschlussprüfung · Eigener Python-Trainer',true)
  ];

  levels[0].lessons = [
    {id:'l1_intro', title:'Was macht print()? ', goal:'Du kannst Text sichtbar ausgeben.', content:['Python führt Befehle von oben nach unten aus.','print() zeigt Text oder Werte auf dem Bildschirm an.','Text steht in Anführungszeichen: "Hallo Welt".','Jede Klammer, jedes Anführungszeichen und jede Einrückung zählt.'], example:'print("Hallo Welt")', explanation:'Der Text in den Anführungszeichen wird ausgegeben.'},
    {id:'l1_variables', title:'Variablen speichern Werte', goal:'Du kannst einen Wert speichern und später wiederverwenden.', content:['Eine Variable ist ein Name für einen Wert.','name = "Aylin" speichert Text in der Variable name.','print(name) gibt den gespeicherten Wert aus.','Variablennamen sollten kurz, klar und sinnvoll sein.'], example:'name = "Aylin"\nprint(name)', explanation:'Python merkt sich den Wert und nutzt ihn beim Ausgeben.'},
    {id:'l1_comments', title:'Kommentare erklären Code', goal:'Du kannst Code für dich und andere verständlicher machen.', content:['Ein Kommentar beginnt mit #.','Python führt Kommentare nicht aus.','Kommentare erklären den Zweck einer Stelle.','Ein guter Kommentar sagt warum etwas passiert, nicht nur was sichtbar ist.'], example:'# Das Programm begrüßt den Nutzer\nprint("Willkommen")', explanation:'Der Kommentar hilft beim Verstehen, ohne das Programm zu beeinflussen.'}
  ];
  levels[0].checks = [
    {id:'l1_q1', type:'mc', question:'Was macht print("Hallo")?', answers:['Es gibt Hallo aus','Es speichert Hallo dauerhaft','Es löscht eine Datei','Es startet eine Schleife'], correct:0, explain:'print() ist der Ausgabebefehl.'},
    {id:'l1_q2', type:'mc', question:'Welche Schreibweise speichert einen Namen korrekt?', answers:['name = "Mira"','name == "Mira"','print = name "Mira"','"Mira" = name'], correct:0, explain:'Mit einem einfachen = weist du einer Variable einen Wert zu.'},
    {id:'l1_q3', type:'mc', question:'Woran erkennt Python einen Kommentar?', answers:['#','//','<!--','§'], correct:0, explain:'In Python beginnt ein Kommentar mit #.'},
    {id:'l1_q4', type:'mc', question:'Was ist der häufigste Fehler bei Textausgabe?', answers:['Anführungszeichen vergessen','zu viele Variablen','zu kurze Kommentare','zu viele Leerzeilen'], correct:0, explain:'Text muss in Anführungszeichen stehen.'}
  ];
  levels[0].practiceTasks = [
    {id:'l1_p1', title:'Erste Ausgabe', prompt:'Schreibe ein Programm, das Hallo Python ausgibt.', expected:'print("Hallo Python")', concept:'print'},
    {id:'l1_p2', title:'Variable verwenden', prompt:'Speichere deinen Namen in einer Variable und gib ihn aus.', expected:'name = "..."\nprint(name)', concept:'variable'},
    {id:'l1_p3', title:'Kommentar ergänzen', prompt:'Füge einen sinnvollen Kommentar über deinem Code ein.', expected:'# Dieses Programm ...', concept:'comment'}
  ];
  levels[0].midExam = {
    id:'py_level_01_mid', title:'Zwischenprüfung · Mini-Vorstellung', purpose:'Prüft, ob print(), Variable und Kommentar wirklich praktisch sitzen.', requiredScore:75, requiredConcepts:['print','variable','comment'],
    tasks:['Erstelle mindestens zwei Variablen: name und ziel.','Gib beide Werte mit print() aus.','Schreibe mindestens einen Kommentar, der den Zweck erklärt.'],
    testCases:[{name:'mindestens zwei Zuweisungen', type:'count_assignment', min:2},{name:'mindestens zwei Ausgaben', type:'count_print', min:2},{name:'Kommentar vorhanden', type:'concept', concept:'comment'}],
    rubric:[{key:'print', label:'print() korrekt genutzt', points:25},{key:'variable', label:'Variablen sinnvoll genutzt', points:35},{key:'comment', label:'Kommentar vorhanden', points:20},{key:'readability', label:'lesbarer Aufbau', points:20}]
  };
  levels[0].finalExam = {
    id:'py_level_01_final', title:'Abschlussprüfung · Vorstellungsprogramm', uploadTypes:['.py','.txt'], requiredScore:86,
    task:'Erstelle ein kleines Vorstellungsprogramm. Es soll mindestens deinen Namen, dein Lernziel und eine kurze Begrüßung ausgeben. Nutze mindestens zwei Variablen, mindestens drei print()-Ausgaben und mindestens einen sinnvollen Kommentar.',
    requiredConcepts:['print','comment','variable'], requiredTokens:['print','=','#'], forbiddenTokens:['eval(','exec(','__import__(','subprocess','os.system'], knockoutErrors:['kein Code vorhanden','keine print-Ausgabe','keine Variable','Aufgabe komplett verfehlt'],
    testCases:[{name:'print vorhanden', type:'static', pattern:'print\\s*\\(', expected:true},{name:'Kommentar vorhanden', type:'concept', concept:'comment'},{name:'mindestens zwei Zuweisungen', type:'count_assignment', min:2},{name:'mindestens drei Ausgaben', type:'count_print', min:3}],
    rubric:[{key:'syntax', label:'Syntax/Struktur', points:20},{key:'concepts', label:'Pflichtkonzepte', points:30},{key:'logic', label:'Aufgabe erfüllt', points:25},{key:'readability', label:'Lesbarkeit', points:15},{key:'reflection', label:'Lerntransfer', points:10}]
  };

  levels[1].lessons = [
    {id:'l2_fstrings', title:'f-Strings: Variablen im Satz', goal:'Du kannst Variablen sauber in Texte einsetzen.', content:['Ein f-String beginnt mit f direkt vor dem Anführungszeichen.','Variablen stehen im Text in geschweiften Klammern.','Das macht Ausgaben klarer als viele Kommas oder Pluszeichen.','f-Strings sind ab Python 3.6 Standard für lesbare Ausgaben.'], example:'name = "Mira"\nziel = "Python lernen"\nprint(f"Hallo {name}, dein Ziel ist: {ziel}")', explanation:'{name} und {ziel} werden beim Ausführen durch die gespeicherten Werte ersetzt.'},
    {id:'l2_layout', title:'Ausgaben strukturieren', goal:'Du kannst Konsolenausgaben lesbar aufbauen.', content:['Trennlinien helfen, Informationen als Block zu erkennen.','Mehrere print()-Zeilen sind oft lesbarer als eine lange Zeile.','Eine Profilkarte braucht klare Labels wie Name, Stadt, Ziel.','Saubere Ausgabe ist Teil von guter Nutzerführung.'], example:'print("====================")\nprint(f"Name: {name}")\nprint(f"Ziel: {ziel}")\nprint("====================")', explanation:'Die Konsole wird dadurch nicht nur funktional, sondern verständlich.'},
    {id:'l2_ansi', title:'Einfache Terminalfarben', goal:'Du nutzt Farbe bewusst, ohne die Ausgabe unleserlich zu machen.', content:['ANSI-Codes sind Zeichenfolgen, die manche Terminals farbig darstellen.','\\033[32m steht zum Beispiel für grün.','\\033[0m setzt die Farbe wieder zurück.','Farbe ist Bonus: Struktur und Verständlichkeit bleiben wichtiger.'], example:'print("\\033[32mBestanden!\\033[0m")', explanation:'Der Text wird in kompatiblen Terminals grün angezeigt; das Reset verhindert, dass danach alles grün bleibt.'}
  ];
  levels[1].checks = [
    {id:'l2_q1', type:'mc', question:'Was macht ein f vor dem String?', answers:['Es erlaubt Variablen im Text','Es färbt automatisch rot','Es beendet das Programm','Es startet eine Funktion'], correct:0, explain:'f-Strings können Variablen direkt im Text einsetzen.'},
    {id:'l2_q2', type:'mc', question:'Welche Schreibweise ist ein f-String?', answers:['print(f"Hallo {name}")','print("Hallo {name}")','f = print("Hallo")','print(f = name)'], correct:0, explain:'Das f steht direkt vor dem String, Variablen stehen in {}.'},
    {id:'l2_q3', type:'mc', question:'Warum braucht man oft \\033[0m?', answers:['Zum Zurücksetzen der Farbe','Zum Speichern einer Datei','Zum Starten einer Schleife','Zum Löschen einer Variable'], correct:0, explain:'Ohne Reset kann die Terminalfarbe weiterwirken.'},
    {id:'l2_q4', type:'mc', question:'Was ist bei einer Profilkarte wichtiger als bunte Farbe?', answers:['Klarer Aufbau und verständliche Labels','Möglichst viele Sonderzeichen','Nur eine lange print-Zeile','Kein Kommentar'], correct:0, explain:'Design dient der Verständlichkeit, nicht umgekehrt.'}
  ];
  levels[1].practiceTasks = [
    {id:'l2_p1', title:'Profilzeile mit f-String', prompt:'Nutze einen f-String, um Name und Ziel in einem Satz auszugeben.', expected:'print(f"Ich heiße {name} und lerne {ziel}.")', concept:'f_string'},
    {id:'l2_p2', title:'Profilkarte strukturieren', prompt:'Erstelle eine Ausgabe mit oberer und unterer Trennlinie.', expected:'print("====================")\nprint(f"Name: {name}")\nprint("====================")', concept:'formatting'},
    {id:'l2_p3', title:'Farbige Erfolgsmeldung', prompt:'Gib eine grüne Erfolgsmeldung aus und setze danach die Farbe zurück.', expected:'print("\\033[32mBestanden!\\033[0m")', concept:'ansi_color'},
    {id:'l2_p4', title:'Kommentar zur Gestaltung', prompt:'Kommentiere kurz, warum deine Ausgabe strukturiert ist.', expected:'# Die Trennlinien machen die Profilkarte lesbarer.', concept:'comment'}
  ];
  levels[1].midExam = {
    id:'py_level_02_mid', title:'Zwischenprüfung · Profilzeile', purpose:'Prüft, ob f-Strings und lesbare Ausgabe praktisch verstanden wurden.', requiredScore:78, requiredConcepts:['print','variable','f_string','formatting'],
    tasks:['Erstelle mindestens zwei Variablen: name und ziel.','Gib beide Werte mit mindestens einem f-String aus.','Nutze eine Trennlinie oder klare Labels, damit die Ausgabe lesbar wird.'],
    testCases:[{name:'mindestens zwei Zuweisungen', type:'count_assignment', min:2},{name:'mindestens zwei Ausgaben', type:'count_print', min:2},{name:'f-String vorhanden', type:'concept', concept:'f_string'},{name:'Formatierung sichtbar', type:'concept', concept:'formatting'}],
    rubric:[{key:'syntax', label:'Syntax/Struktur', points:20},{key:'concepts', label:'f-String und Variablen', points:35},{key:'logic', label:'lesbare Profilzeile', points:25},{key:'readability', label:'klare Ausgabe', points:20}]
  };
  levels[1].finalExam = {
    id:'py_level_02_final', title:'Abschlussprüfung · Profilkarte mit Farbe', uploadTypes:['.py','.txt'], requiredScore:86,
    task:'Erstelle eine Profilkarte in der Konsole. Pflicht: mindestens drei Variablen, mindestens vier print()-Ausgaben, mindestens zwei f-Strings, klare Trennlinien/Labels und mindestens eine ANSI-Farbe mit Reset \\033[0m. Kommentiere kurz, warum deine Ausgabe so aufgebaut ist.',
    requiredConcepts:['print','variable','f_string','formatting','ansi_color','comment'], requiredTokens:['print','f"','\\033[','\\033[0m'], forbiddenTokens:['eval(','exec(','__import__(','subprocess','os.system'], knockoutErrors:['kein Code vorhanden','keine f-String-Ausgabe','keine ANSI-Farbe','keine Variable'],
    testCases:[{name:'mindestens drei Zuweisungen', type:'count_assignment', min:3},{name:'mindestens vier Ausgaben', type:'count_print', min:4},{name:'mindestens zwei f-Strings', type:'count_f_string', min:2},{name:'ANSI-Farbe vorhanden', type:'concept', concept:'ansi_color'},{name:'ANSI-Reset vorhanden', type:'static', pattern:'\\\\033\\[0m|\\x1b\\[0m|\\u001b\\[0m', expected:true},{name:'Kommentar vorhanden', type:'concept', concept:'comment'}],
    rubric:[{key:'syntax', label:'Syntax/Struktur', points:20},{key:'concepts', label:'f-Strings/Farbe/Pflichtkonzepte', points:30},{key:'logic', label:'Profilkarte vollständig', points:25},{key:'readability', label:'Gestaltung/Lesbarkeit', points:15},{key:'reflection', label:'Kommentar/Lerntransfer', points:10}]
  };


  levels[2].lessons = [
    {id:'l3_input_intro', title:'input() fragt den Nutzer', goal:'Du kannst Eingaben entgegennehmen.', content:['input() zeigt eine Frage und wartet auf eine Antwort.','Die Antwort wird zuerst immer als Text gespeichert.','Du speicherst die Antwort meistens in einer Variable.','Danach kannst du die Eingabe mit print() oder f-Strings wieder ausgeben.'], example:'name = input("Wie heißt du? ")\nprint(f"Hallo {name}!")', explanation:'Der Nutzer tippt etwas ein, Python speichert es in name und gibt es danach aus.'},
    {id:'l3_prompt_quality', title:'Gute Fragen stellen', goal:'Du formulierst Eingabeaufforderungen verständlich.', content:['Eine gute input()-Frage sagt klar, was erwartet wird.','Leerzeichen am Ende der Frage machen die Eingabe lesbarer.','Variablennamen sollen zum Inhalt passen: name, stadt, ziel.','Unklare Prompts führen zu verwirrenden Programmen.'], example:'stadt = input("Aus welcher Stadt kommst du? ")\nprint(f"Stadt: {stadt}")', explanation:'Der Prompt erklärt dem Nutzer, welche Eingabe gebraucht wird.'},
    {id:'l3_dialog_flow', title:'Vom einzelnen Input zum Dialog', goal:'Du kannst mehrere Eingaben zu einem kleinen Dialog verbinden.', content:['Mehrere input()-Zeilen ergeben einen einfachen Dialog.','Jede Eingabe sollte in einer eigenen Variable landen.','Am Ende fasst das Programm die Angaben sauber zusammen.','So entsteht aus Einzelbefehlen ein kleines nutzbares Programm.'], example:'name = input("Name: ")\nziel = input("Ziel: ")\nprint(f"{name} lernt {ziel}.")', explanation:'Das Programm sammelt Informationen und nutzt sie in einer strukturierten Ausgabe.'}
  ];
  levels[2].checks = [
    {id:'l3_q1', type:'mc', question:'Was liefert input() in Python zuerst zurück?', answers:['Text/String','immer eine Zahl','eine Liste','gar nichts'], correct:0, explain:'input() gibt immer zunächst Text zurück. Zahlenumwandlung kommt erst später.'},
    {id:'l3_q2', type:'mc', question:'Welche Schreibweise speichert eine Eingabe korrekt?', answers:['name = input("Name: ")','input = name("Name")','print(input = name)','name == input("Name")'], correct:0, explain:'Links steht die Variable, rechts die Eingabe mit input().' },
    {id:'l3_q3', type:'mc', question:'Warum ist ein klarer Prompt wichtig?', answers:['Damit der Nutzer weiß, was er eingeben soll','Damit Python schneller wird','Damit Variablen automatisch farbig werden','Damit keine Klammern nötig sind'], correct:0, explain:'Gute Nutzerführung beginnt bei verständlichen Eingabefragen.'},
    {id:'l3_q4', type:'mc', question:'Was ist bei mehreren Eingaben sinnvoll?', answers:['jede Eingabe in eine passende Variable speichern','alles in eine einzige print-Zeile schreiben','keine Variablennamen verwenden','input() nur am Ende verwenden'], correct:0, explain:'Passende Variablen machen den Dialog verständlich und prüfbar.'}
  ];
  levels[2].practiceTasks = [
    {id:'l3_p1', title:'Name abfragen', prompt:'Frage den Nutzer nach seinem Namen und begrüße ihn mit einem f-String.', expected:'name = input("Wie heißt du? ")\nprint(f"Hallo {name}!")', concept:'input'},
    {id:'l3_p2', title:'Ziel abfragen', prompt:'Frage nach einem Lernziel und gib es sauber beschriftet aus.', expected:'ziel = input("Was möchtest du lernen? ")\nprint(f"Ziel: {ziel}")', concept:'f_string'},
    {id:'l3_p3', title:'Drei Eingaben sammeln', prompt:'Sammle Name, Stadt und Ziel in drei Variablen.', expected:'name = input("Name: ")\nstadt = input("Stadt: ")\nziel = input("Ziel: ")', concept:'variable'},
    {id:'l3_p4', title:'Dialog kommentieren', prompt:'Kommentiere kurz, warum dein Programm mehrere Eingaben sammelt.', expected:'# Das Programm sammelt Nutzerdaten für eine kurze Profil-Ausgabe.', concept:'comment'}
  ];
  levels[2].midExam = {
    id:'py_level_03_mid', title:'Zwischenprüfung · Eingabe einsetzen', purpose:'Prüft, ob input() nicht nur erkannt, sondern in einer Ausgabe genutzt wird.', requiredScore:78, requiredConcepts:['input','variable','print','f_string'],
    tasks:['Frage den Nutzer nach Name und Ziel.','Speichere beide Antworten in Variablen.','Gib beide Werte mit mindestens einem f-String wieder aus.'],
    testCases:[{name:'mindestens zwei Eingaben', type:'count_input', min:2},{name:'mindestens zwei Zuweisungen', type:'count_assignment', min:2},{name:'mindestens zwei Ausgaben', type:'count_print', min:2},{name:'f-String vorhanden', type:'concept', concept:'f_string'}],
    rubric:[{key:'syntax', label:'Syntax/Struktur', points:20},{key:'concepts', label:'input/Variablen/f-String', points:35},{key:'logic', label:'Eingaben werden sichtbar genutzt', points:25},{key:'readability', label:'klare Nutzerführung', points:20}]
  };
  levels[2].finalExam = {
    id:'py_level_03_final', title:'Abschlussprüfung · Dialogprogramm', uploadTypes:['.py','.txt'], requiredScore:86,
    task:'Erstelle ein kleines Dialogprogramm. Pflicht: mindestens drei input()-Fragen, drei passende Variablen, mindestens vier print()-Ausgaben, mindestens zwei f-Strings, klare Labels/Trennlinien und ein Kommentar. Das Programm soll Name, Stadt und Python-Ziel abfragen und am Ende übersichtlich zusammenfassen.',
    requiredConcepts:['input','variable','print','f_string','formatting','comment'], requiredTokens:['input','print','f"'], forbiddenTokens:['eval(','exec(','__import__(','subprocess','os.system'], knockoutErrors:['kein Code vorhanden','keine Eingabe','keine Variable'],
    testCases:[{name:'mindestens drei Eingaben', type:'count_input', min:3},{name:'mindestens drei Zuweisungen', type:'count_assignment', min:3},{name:'mindestens vier Ausgaben', type:'count_print', min:4},{name:'mindestens zwei f-Strings', type:'count_f_string', min:2},{name:'Formatierung/Labels sichtbar', type:'concept', concept:'formatting'},{name:'Kommentar vorhanden', type:'concept', concept:'comment'}],
    rubric:[{key:'syntax', label:'Syntax/Struktur', points:20},{key:'concepts', label:'input/f-Strings/Pflichtkonzepte', points:30},{key:'logic', label:'Dialog vollständig', points:25},{key:'readability', label:'Nutzerführung/Lesbarkeit', points:15},{key:'reflection', label:'Kommentar/Lerntransfer', points:10}]
  };


  levels[3].lessons = [
    {id:'l4_types_intro', title:'input() liefert zuerst Text', goal:'Du verstehst, warum Eingaben vor dem Rechnen umgewandelt werden müssen.', content:['input() gibt immer einen String zurück - also Text.','Text plus Text wird verbunden, nicht gerechnet.','"5" + "3" ergibt "53" und nicht 8.','Zum Rechnen brauchst du int() oder float().'], example:'zahl = input("Zahl: ")\nprint(zahl + zahl)', explanation:'Ohne Umwandlung behandelt Python die Eingabe als Text.'},
    {id:'l4_int_float', title:'int() und float()', goal:'Du kannst Eingaben in Zahlen umwandeln.', content:['int() macht aus passendem Text eine ganze Zahl.','float() macht aus passendem Text eine Kommazahl.','int(input(...)) ist ein typisches Anfänger-Muster.','Bei falscher Eingabe kann später try/except helfen - hier lernen wir zuerst die Umwandlung.'], example:'alter = int(input("Alter: "))\npreis = float(input("Preis: "))', explanation:'Jetzt kann Python mit den Werten rechnen.'},
    {id:'l4_operators', title:'Rechenoperatoren', goal:'Du kannst Addition, Subtraktion, Multiplikation und Division nutzen.', content:['+ addiert Zahlen.','- subtrahiert Zahlen.','* multipliziert Zahlen.','/ dividiert Zahlen und liefert meistens eine Kommazahl.'], example:'a = int(input("Zahl 1: "))\nb = int(input("Zahl 2: "))\nprint(f"Summe: {a + b}")', explanation:'Die Eingaben werden in Zahlen umgewandelt und anschließend berechnet.'},
    {id:'l4_calculator_flow', title:'Vom Rechnen zum Mini-Rechner', goal:'Du baust aus mehreren Rechnungen ein kleines Programm.', content:['Frage zuerst zwei Zahlen ab.','Wandle beide Eingaben um.','Berechne mehrere Ergebnisse.','Gib jedes Ergebnis sauber beschriftet aus.'], example:'zahl1 = float(input("Erste Zahl: "))\nzahl2 = float(input("Zweite Zahl: "))\nprint(f"Addition: {zahl1 + zahl2}")\nprint(f"Division: {zahl1 / zahl2}")', explanation:'So entsteht ein nutzbarer Mini-Rechner statt einzelner Testzeilen.'}
  ];
  levels[3].checks = [
    {id:'l4_q1', type:'mc', question:'Was liefert input() zuerst zurück?', answers:['Text/String','automatisch int','automatisch float','eine fertige Rechnung'], correct:0, explain:'input() liefert zuerst Text. Für Rechnungen brauchst du eine Umwandlung.'},
    {id:'l4_q2', type:'mc', question:'Was passiert bei input("5") + input("3"), wenn beide Werte nicht umgewandelt werden?', answers:['Es entsteht wahrscheinlich "53"','Es entsteht 8','Python erstellt automatisch eine Liste','Das ist immer Division'], correct:0, explain:'Zwei Texte werden verbunden. Erst int() oder float() macht echte Zahlen daraus.'},
    {id:'l4_q3', type:'mc', question:'Welche Schreibweise ist für ganze Zahlen sinnvoll?', answers:['zahl = int(input("Zahl: "))','zahl = input(int("Zahl: "))','int = input("Zahl")','zahl == int(input)'], correct:0, explain:'input() fragt ab, int() wandelt die Eingabe in eine ganze Zahl um.'},
    {id:'l4_q4', type:'mc', question:'Welcher Operator multipliziert in Python?', answers:['*','x','·','mul'], correct:0, explain:'In Python steht * für Multiplikation.'},
    {id:'l4_q5', type:'mc', question:'Wann ist float() sinnvoller als int()?', answers:['Bei Kommazahlen wie 3.5','Bei Kommentaren','Bei Variablennamen','Bei Farben im Terminal'], correct:0, explain:'float() erlaubt Dezimalzahlen.'}
  ];
  levels[3].practiceTasks = [
    {id:'l4_p1', title:'Zwei Zahlen addieren', prompt:'Frage zwei ganze Zahlen ab, wandle sie mit int() um und gib die Summe aus.', expected:'zahl1 = int(input("Erste Zahl: "))\nzahl2 = int(input("Zweite Zahl: "))\nprint(f"Summe: {zahl1 + zahl2}")', concept:'int'},
    {id:'l4_p2', title:'Mit Kommazahlen rechnen', prompt:'Frage zwei Preise ab, nutze float() und gib die Summe aus.', expected:'preis1 = float(input("Preis 1: "))\npreis2 = float(input("Preis 2: "))\nprint(f"Gesamt: {preis1 + preis2}")', concept:'float'},
    {id:'l4_p3', title:'Vier Grundrechenarten', prompt:'Baue mit zwei Zahlen Addition, Subtraktion, Multiplikation und Division.', expected:'a = float(input("A: "))\nb = float(input("B: "))\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a / b)', concept:'operators'},
    {id:'l4_p4', title:'Fehler bewusst erkennen', prompt:'Erkläre mit einem Kommentar, warum input() ohne int()/float() nicht zum Rechnen reicht.', expected:'# input() liefert Text. Zum Rechnen muss ich mit int() oder float() umwandeln.', concept:'comment'}
  ];
  levels[3].midExam = {
    id:'py_level_04_mid', title:'Zwischenprüfung · Zahlen wirklich berechnen', purpose:'Prüft, ob du Eingaben nicht nur abfragst, sondern korrekt in Zahlen umwandelst und damit rechnest.', requiredScore:78, requiredConcepts:['input','type_conversion','operators','print','f_string'],
    tasks:['Frage zwei Zahlen ab.','Wandle beide Eingaben mit int() oder float() um.','Gib mindestens Summe und Differenz sauber beschriftet aus.','Nutze mindestens einen f-String.'],
    testCases:[{name:'mindestens zwei Eingaben', type:'count_input', min:2},{name:'beide Eingaben werden umgewandelt', type:'count_conversion', min:2},{name:'mindestens zwei Rechenoperatoren', type:'count_math_operator', min:2},{name:'mindestens zwei Ausgaben', type:'count_print', min:2},{name:'f-String vorhanden', type:'concept', concept:'f_string'}],
    rubric:[{key:'syntax', label:'Syntax/Struktur', points:20},{key:'concepts', label:'input/Umwandlung/Rechnen', points:35},{key:'logic', label:'Summe und Differenz funktionieren logisch', points:25},{key:'readability', label:'klare Ergebnis-Ausgabe', points:20}]
  };
  levels[3].finalExam = {
    id:'py_level_04_final', title:'Abschlussprüfung · Mini-Rechner', uploadTypes:['.py','.txt'], requiredScore:87,
    task:'Erstelle einen Mini-Rechner. Pflicht: zwei Zahlen abfragen, beide Eingaben mit int() oder float() in Zahlen umwandeln, Addition, Subtraktion, Multiplikation und Division berechnen, mindestens fünf print()-Ausgaben, mindestens zwei f-Strings, klare Ergebnislabels und ein Kommentar. Wichtig: Das Programm soll wirklich rechnen - keine reine Textverkettung.',
    requiredConcepts:['input','type_conversion','operators','print','f_string','comment'], requiredTokens:['input','print'], forbiddenTokens:['eval(','exec(','__import__(','subprocess','os.system'], knockoutErrors:['kein Code vorhanden','keine Eingabe','keine Zahlenumwandlung','keine Rechnung'],
    testCases:[{name:'mindestens zwei Eingaben', type:'count_input', min:2},{name:'beide Eingaben werden umgewandelt', type:'count_conversion', min:2},{name:'Addition vorhanden', type:'static', pattern:'\\+', expected:true},{name:'Subtraktion vorhanden', type:'static', pattern:'-', expected:true},{name:'Multiplikation vorhanden', type:'static', pattern:'\\*', expected:true},{name:'Division vorhanden', type:'static', pattern:'/', expected:true},{name:'mindestens fünf Ausgaben', type:'count_print', min:5},{name:'mindestens zwei f-Strings', type:'count_f_string', min:2},{name:'Kommentar vorhanden', type:'concept', concept:'comment'}],
    rubric:[{key:'syntax', label:'Syntax/Struktur', points:20},{key:'concepts', label:'Datentypen/Operatoren/Pflichtkonzepte', points:30},{key:'logic', label:'Mini-Rechner vollständig', points:25},{key:'readability', label:'Ergebnislabels/Lesbarkeit', points:15},{key:'reflection', label:'Kommentar/Lerntransfer', points:10}]
  };


  levels[4].lessons = [
    {id:'l5_if_intro', title:'if entscheidet', goal:'Du kannst eine Bedingung formulieren.', content:['Mit if prüft Python, ob eine Bedingung wahr ist.','Nach der Bedingung kommt ein Doppelpunkt.','Der eingerückte Block läuft nur, wenn die Bedingung stimmt.','Einrückung ist in Python nicht Deko, sondern Programmstruktur.'], example:'alter = int(input("Alter: "))\nif alter >= 18:\n    print("volljährig")', explanation:'Python prüft den Vergleich und führt den eingerückten print()-Block nur bei wahrer Bedingung aus.'},
    {id:'l5_else_elif', title:'else und elif', goal:'Du kannst mehrere Fälle unterscheiden.', content:['else bedeutet: sonst.','elif bedeutet: sonst wenn.','Damit kann ein Programm mehr als zwei Fälle unterscheiden.','Die Reihenfolge der Bedingungen ist wichtig.'], example:'punkte = int(input("Punkte: "))\nif punkte >= 70:\n    print("bestanden")\nelse:\n    print("nicht bestanden")', explanation:'Eine Entscheidung erzeugt je nach Eingabe unterschiedliche Ausgaben.'},
    {id:'l5_comparisons', title:'Vergleiche und Grenzwerte', goal:'Du erkennst typische Grenzwertfehler.', content:['== prüft Gleichheit, = weist einen Wert zu.','>= bedeutet größer oder gleich.','> bedeutet strikt größer.','Wenn 18 bereits volljährig ist, brauchst du >= 18 und nicht > 18.'], example:'if alter >= 18:\n    print("volljährig")\nelse:\n    print("minderjährig")', explanation:'Der Grenzwert 18 wird korrekt eingeschlossen.'},
    {id:'l5_structure_comments', title:'Entscheidungen sauber kommentieren', goal:'Du kommentierst inhaltlich passend, auch mit Alltagssprache.', content:['Ein Kommentar muss zum Code passen.','Umgangssprache ist okay, wenn der Sinn stimmt.','Beispiel: # checkt ob die Person alt genug ist.','Falsche Kommentare sind schlimmer als keine, weil sie später verwirren.'], example:'# checkt, ob der Nutzer volljährig ist\nif alter >= 18:\n    print("volljährig")', explanation:'Der Kommentar ist nicht perfekt fachlich, aber inhaltlich passend.'}
  ];
  levels[4].checks = [
    {id:'l5_q1', type:'mc', question:'Was bedeutet if?', answers:['Python prüft eine Bedingung','Python speichert automatisch eine Datei','Python macht Text farbig','Python beendet immer das Programm'], correct:0, explain:'if ist eine Entscheidung im Code.'},
    {id:'l5_q2', type:'mc', question:'Welche Bedingung ist richtig, wenn 18 bereits volljährig ist?', answers:['alter >= 18','alter > 18','alter = 18','alter < 18'], correct:0, explain:'>= schließt den Grenzwert 18 mit ein.'},
    {id:'l5_q3', type:'mc', question:'Was ist in Python nach if alter >= 18 notwendig?', answers:['ein Doppelpunkt und ein eingerückter Block','ein Semikolon','immer eine Farbe','immer eine Liste'], correct:0, explain:'Python braucht den Doppelpunkt und die Einrückung für den if-Block.'},
    {id:'l5_q4', type:'mc', question:'Welcher Kommentar ist passend zu if alter >= 18?', answers:['# prüft ob die Person volljährig ist','# hier wird eine Datei gelöscht','# macht den Text blau','# rechnet zwei Preise zusammen'], correct:0, explain:'Der Kommentar darf einfach sein, muss aber zum Code passen.'},
    {id:'l5_q5', type:'mc', question:'Was ist der Unterschied zwischen = und ==?', answers:['= weist zu, == vergleicht','= vergleicht, == druckt aus','beides ist exakt gleich','== ist nur für Farben'], correct:0, explain:'Das ist ein klassischer Anfängerfehler.'}
  ];
  levels[4].practiceTasks = [
    {id:'l5_p1', title:'Altersprüfung', prompt:'Frage das Alter ab und prüfe: ab 18 volljährig, sonst minderjährig.', expected:'alter = int(input("Alter: "))\nif alter >= 18:\n    print("volljährig")\nelse:\n    print("minderjährig")', concept:'if'},
    {id:'l5_p2', title:'Punkteprüfung', prompt:'Frage Punkte ab und gib ab 70 Punkten bestanden aus.', expected:'punkte = int(input("Punkte: "))\nif punkte >= 70:\n    print("bestanden")\nelse:\n    print("nicht bestanden")', concept:'comparison'},
    {id:'l5_p3', title:'elif nutzen', prompt:'Unterscheide drei Fälle: sehr gut ab 90, bestanden ab 70, sonst üben.', expected:'if punkte >= 90:\n    print("sehr gut")\nelif punkte >= 70:\n    print("bestanden")\nelse:\n    print("weiter üben")', concept:'elif'},
    {id:'l5_p4', title:'Sinnvoll kommentieren', prompt:'Kommentiere deine if-Abfrage in eigenen Worten. Umgangssprache ist okay, der Inhalt muss passen.', expected:'# checkt, ob die Punkte zum Bestehen reichen', concept:'comment'}
  ];
  levels[4].midExam = {
    id:'py_level_05_mid', title:'Zwischenprüfung · Altersentscheidung', purpose:'Prüft, ob if/else, Grenzwert und Einrückung praktisch sitzen.', requiredScore:80, requiredConcepts:['input','int','if','else','comparison','comment'],
    tasks:['Frage das Alter per input() ab.','Wandle das Alter mit int() um.','Prüfe mit if/else: unter 18 minderjährig, ab 18 volljährig.','Kommentiere die Entscheidung sinnvoll.'],
    testCases:[{name:'mindestens eine Eingabe', type:'count_input', min:1},{name:'Zahlenumwandlung vorhanden', type:'count_conversion', min:1},{name:'if vorhanden', type:'concept', concept:'if'},{name:'else vorhanden', type:'concept', concept:'else'},{name:'Grenzwert 18 korrekt sichtbar', type:'static', pattern:'>=\\s*18|<\\s*18', expected:true},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:5},{name:'Struktur mindestens gelb', type:'structure_min', min:10}],
    rubric:[{key:'syntax', label:'Syntax', points:20},{key:'concepts', label:'if/else/Grenzwert', points:25},{key:'logic', label:'Alterslogik', points:20},{key:'structure', label:'Programmstruktur', points:20},{key:'readability', label:'Lesbarkeit', points:10},{key:'reflection', label:'sinnvolle Kommentare', points:5}]
  };
  levels[4].finalExam = {
    id:'py_level_05_final', title:'Abschlussprüfung · Entscheidungsprogramm', uploadTypes:['.py','.txt'], requiredScore:88,
    task:'Erstelle ein Entscheidungsprogramm. Pflicht: Alter und Punktzahl abfragen, beide Werte mit int() umwandeln, if/elif/else oder sinnvoll verschachtelte if/else-Logik nutzen. Logik: unter 18 = nicht zugelassen; ab 18 und Punktzahl ab 70 = bestanden; ab 18 und Punktzahl unter 70 = nicht bestanden. Nutze mindestens drei Vergleichsoperatoren, klare Ausgaben, mindestens einen f-String und sinnvolle Kommentare. Struktur ist Pflicht: Eingabe -> Verarbeitung/Entscheidung -> Ausgabe.',
    requiredConcepts:['input','int','if','else','comparison','f_string','comment'], requiredTokens:['input','int','if','else','print'], forbiddenTokens:['eval(','exec(','__import__(','subprocess','os.system'], knockoutErrors:['kein Code vorhanden','keine Eingabe','keine Entscheidung','Grenzwert falsch'],
    testCases:[{name:'mindestens zwei Eingaben', type:'count_input', min:2},{name:'beide Eingaben werden umgewandelt', type:'count_conversion', min:2},{name:'if vorhanden', type:'concept', concept:'if'},{name:'else vorhanden', type:'concept', concept:'else'},{name:'Grenzwert 18 korrekt sichtbar', type:'static', pattern:'>=\\s*18|<\\s*18', expected:true},{name:'Bestehensgrenze >= 70 sichtbar', type:'static', pattern:'>=\\s*70', expected:true},{name:'mindestens drei Ausgaben', type:'count_print', min:3},{name:'f-String vorhanden', type:'concept', concept:'f_string'},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:6},{name:'Struktur mindestens gelb', type:'structure_min', min:12}],
    rubric:[{key:'syntax', label:'Syntax', points:20},{key:'concepts', label:'if/else/Vergleiche/Pflichtkonzepte', points:25},{key:'logic', label:'Entscheidungslogik + Grenzwerte', points:20},{key:'structure', label:'Programmstruktur', points:20},{key:'readability', label:'Lesbarkeit/Nutzerführung', points:10},{key:'reflection', label:'sinnvolle Kommentare', points:5}]
  };


  levels[5].lessons = [
    {id:'l6_while_intro', title:'while wiederholt solange etwas stimmt', goal:'Du verstehst, warum eine while-Schleife mehrere Durchläufe macht.', content:['Eine while-Schleife läuft, solange ihre Bedingung wahr ist.','Nach while kommt eine Bedingung und ein Doppelpunkt.','Der eingerückte Block gehört zur Schleife.','Ohne sauberen Ausstieg kann eine Endlosschleife entstehen.'], example:'zaehler = 1\nwhile zaehler <= 3:\n    print(f"Runde {zaehler}")\n    zaehler = zaehler + 1', explanation:'Der Zähler startet bei 1. Nach jeder Runde wird er erhöht. Bei 4 stoppt die Schleife.'},
    {id:'l6_counter_exit', title:'Zähler und Ausstieg', goal:'Du kannst eine Schleife kontrolliert beenden.', content:['Ein Zähler merkt sich, wie oft etwas passiert ist.','Der Zähler muss sich in der Schleife verändern.','Die Bedingung muss irgendwann falsch werden.','Das ist die wichtigste Sicherheitsregel gegen Endlosschleifen.'], example:'versuche = 0\nwhile versuche < 3:\n    print("Versuch läuft")\n    versuche += 1', explanation:'versuche += 1 erhöht den Zähler. Nach 3 Durchläufen endet die Schleife.'},
    {id:'l6_input_loop', title:'Wiederholen mit Nutzereingabe', goal:'Du kannst den Nutzer mehrfach fragen, bis eine Bedingung erfüllt ist.', content:['while eignet sich für Dialoge.','Das Programm kann nach einer Antwort erneut fragen.','Eine Abbruchbedingung macht den Ablauf kontrollierbar.','Benutze klare Ausgaben, damit der Nutzer weiß, was passiert.'], example:'antwort = ""\nwhile antwort != "stop":\n    antwort = input("Schreibe stop zum Beenden: ")\n    print(f"Du hast {antwort} eingegeben")', explanation:'Solange die Antwort nicht stop ist, fragt das Programm weiter.'},
    {id:'l6_structure_loop', title:'Schleifen sauber strukturieren', goal:'Du vermeidest Chaos und kommentierst den Zweck der Schleife sinnvoll.', content:['Vor der Schleife stehen Startwerte.','In der Schleife passiert die Wiederholung.','Nach der Schleife kommt die Abschlussausgabe.','Kommentare dürfen umgangssprachlich sein, müssen aber den Zweck erklären.'], example:'# wiederholt die Frage, bis der User stop eingibt\nantwort = ""\nwhile antwort != "stop":\n    antwort = input("Eingabe: ")\nprint("Programm beendet")', explanation:'Der Kommentar passt zum Code und erklärt den Sinn der Schleife.'}
  ];
  levels[5].checks = [
    {id:'l6_q1', type:'mc', question:'Wann läuft eine while-Schleife?', answers:['Solange die Bedingung wahr ist','Immer nur einmal','Nur wenn eine Farbe gesetzt ist','Nur bei Listen'], correct:0, explain:'while wiederholt den eingerückten Block, solange die Bedingung stimmt.'},
    {id:'l6_q2', type:'mc', question:'Was ist ein großes Risiko bei while?', answers:['Endlosschleife','Automatisches Löschen der Datei','Python wird zu HTML','Kommentare funktionieren nicht mehr'], correct:0, explain:'Wenn die Bedingung nie falsch wird, läuft die Schleife endlos.'},
    {id:'l6_q3', type:'mc', question:'Welche Zeile hilft, eine Zählschleife zu beenden?', answers:['zaehler += 1','print = stop','while = false','input + print'], correct:0, explain:'Der Zähler muss sich verändern, damit die Bedingung irgendwann nicht mehr erfüllt ist.'},
    {id:'l6_q4', type:'mc', question:'Welche Struktur ist bei Schleifen sauber?', answers:['Startwert -> while -> Veränderung/Ausstieg -> Abschlussausgabe','Erst Ausgabe, dann zufällig Eingabe, dann Code irgendwo','Alles in eine Zeile','Keine Variablen benutzen'], correct:0, explain:'Schleifen brauchen eine klare Reihenfolge.'},
    {id:'l6_q5', type:'mc', question:'Welcher Kommentar passt zu einer while-Schleife mit stop-Abbruch?', answers:['# fragt weiter, bis der User stop schreibt','# hier wird eine Datenbank gelöscht','# macht Text dicker','# rechnet zwei Preise zusammen'], correct:0, explain:'Der Kommentar ist umgangssprachlich, aber inhaltlich passend.'}
  ];
  levels[5].practiceTasks = [
    {id:'l6_p1', title:'Dreimal ausgeben', prompt:'Nutze while und einen Zähler, um drei Runden auszugeben.', expected:'zaehler = 1\nwhile zaehler <= 3:\n    print(f"Runde {zaehler}")\n    zaehler += 1', concept:'while'},
    {id:'l6_p2', title:'Stop-Dialog', prompt:'Frage den Nutzer so lange nach einer Eingabe, bis er stop schreibt.', expected:'antwort = ""\nwhile antwort != "stop":\n    antwort = input("Schreibe stop: ")\n    print(f"Eingabe: {antwort}")', concept:'loop_exit'},
    {id:'l6_p3', title:'Versuche zählen', prompt:'Zähle mit, wie viele Versuche der Nutzer hatte.', expected:'versuche = 0\nwhile versuche < 3:\n    print("Versuch")\n    versuche += 1\nprint(f"Versuche: {versuche}")', concept:'counter'},
    {id:'l6_p4', title:'Schleife sinnvoll kommentieren', prompt:'Kommentiere in eigenen Worten, warum die Schleife wiederholt wird. Umgangssprache ist okay.', expected:'# ballert die Frage so lange raus, bis der User stop eingibt', concept:'comment'}
  ];
  levels[5].midExam = {
    id:'py_level_06_mid', title:'Zwischenprüfung · Kontrollierte while-Schleife', purpose:'Prüft, ob while, Zähler, Ausstieg und klare Ausgabe praktisch sitzen.', requiredScore:81, requiredConcepts:['while','condition','counter','loop_exit','print','comment'],
    tasks:['Erstelle eine while-Schleife mit einem Zähler.','Die Schleife soll mindestens drei Runden laufen und dann sicher stoppen.','Gib jede Runde verständlich aus.','Kommentiere in eigenen Worten, warum die Schleife endet.'],
    testCases:[{name:'while-Schleife vorhanden', type:'count_while', min:1},{name:'Zähler oder Update vorhanden', type:'counter_update', min:1},{name:'Ausstiegsbedingung sichtbar', type:'loop_exit', min:1},{name:'mindestens zwei Ausgaben', type:'count_print', min:2},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:6},{name:'Struktur mindestens gelb', type:'structure_min', min:12}],
    rubric:[{key:'syntax', label:'Syntax/Einrückung/Doppelpunkt', points:20},{key:'concepts', label:'while/Zähler/Ausstieg', points:30},{key:'logic', label:'keine Endlosschleife', points:25},{key:'structure', label:'Startwert -> Schleife -> Abschluss', points:15},{key:'reflection', label:'sinnvoller Kommentar', points:10}]
  };
  levels[5].finalExam = {
    id:'py_level_06_final', title:'Abschlussprüfung · Wiederholungsdialog', uploadTypes:['.py','.txt'], requiredScore:88,
    task:'Erstelle einen Wiederholungsdialog mit while. Pflicht: Startwert vor der Schleife, mindestens eine input()-Frage oder ein Zähler-System, while-Bedingung mit sicherem Ausstieg, Veränderung der Bedingung innerhalb der Schleife, mindestens drei print()-Ausgaben, mindestens ein f-String, sinnvolle Kommentare und klare Struktur: Eingabe/Startwerte -> Schleife/Verarbeitung -> Abschlussausgabe. Chaos-Code oder Endlosschleifen-Logik fallen durch.',
    requiredConcepts:['while','condition','counter','loop_exit','input','print','f_string','comment'], requiredTokens:['while','print'], forbiddenTokens:['eval(','exec(','__import__(','subprocess','os.system'], knockoutErrors:['kein Code vorhanden','keine while-Schleife','keine Ausstiegslogik','Endlosschleife wahrscheinlich'],
    testCases:[{name:'while-Schleife vorhanden', type:'count_while', min:1},{name:'Bedingung wird in der Schleife verändert', type:'counter_update', min:1},{name:'Ausstiegsbedingung sichtbar', type:'loop_exit', min:1},{name:'mindestens eine Eingabe oder Zählerlogik', type:'input_or_counter', min:1},{name:'mindestens drei Ausgaben', type:'count_print', min:3},{name:'mindestens ein f-String', type:'count_f_string', min:1},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:6},{name:'Struktur mindestens gelb', type:'structure_min', min:13}],
    rubric:[{key:'syntax', label:'Syntax/Einrückung/Doppelpunkt', points:20},{key:'concepts', label:'while/Bedingung/Zähler/Ausstieg', points:25},{key:'logic', label:'Wiederholung endet kontrolliert', points:20},{key:'structure', label:'Programmstruktur', points:20},{key:'readability', label:'Lesbarkeit/Nutzerführung', points:10},{key:'reflection', label:'sinnvolle Kommentare', points:5}]
  };

  levels[6].lessons = [
    {id:'l7_for_intro', title:'for-Schleifen: feste Wiederholungen', goal:'Du kannst einen Block mehrfach ausführen, wenn die Anzahl der Wiederholungen bekannt ist.', content:['Eine for-Schleife läuft über eine Folge von Werten.','range(5) erzeugt die Werte 0 bis 4.','Der eingerückte Block gehört zur Schleife.','for eignet sich besonders für feste Runden, Zählbereiche und später Listen.'], example:'# gibt fünf Runden aus\nfor runde in range(1, 6):\n    print(f"Runde {runde}")', explanation:'Python setzt runde nacheinander auf 1, 2, 3, 4 und 5.'},
    {id:'l7_range', title:'range() verstehen', goal:'Du kannst Start, Ende und Schrittweite bewusst nutzen.', content:['range(1, 6) läuft von 1 bis 5.','Der Endwert ist nicht dabei.','range(2, 11, 2) erzeugt 2, 4, 6, 8, 10.','Gute Variablennamen wie runde oder zahl machen Schleifen lesbarer.'], example:'for zahl in range(2, 11, 2):\n    print(f"Gerade Zahl: {zahl}")', explanation:'Der dritte Wert ist die Schrittweite. Hier wird immer um 2 erhöht.'},
    {id:'l7_while_vs_for', title:'for oder while?', goal:'Du entscheidest, welche Schleife besser passt.', content:['for: wenn klar ist, wie oft etwas laufen soll.','while: wenn eine Bedingung so lange geprüft wird, bis sie falsch wird.','for braucht meistens keinen manuellen Zähler.','Dadurch ist for oft sicherer als while, wenn es nur ums Zählen geht.'], example:'# for ist sauberer, wenn es genau drei Runden sein sollen\nfor versuch in range(1, 4):\n    print(f"Versuch {versuch}")', explanation:'Du brauchst kein versuch += 1, weil for den Wert automatisch weiterführt.'},
    {id:'l7_structure', title:'Schleifen lesbar ausgeben', goal:'Du baust for-Schleifen mit klarer Nutzerführung.', content:['Kommentare dürfen einfach formuliert sein, müssen aber zum Code passen.','Eine for-Schleife braucht eine klare Aufgabe.','Ausgaben sollten erklären, welche Runde oder Zahl gerade gemeint ist.','Struktur bleibt Pflicht: Daten/Start -> Schleife -> Ergebnis.'], example:'# läuft die Zahlen von 1 bis 5 durch und zeigt jede Zahl\nfor zahl in range(1, 6):\n    print(f"Zahl: {zahl}")', explanation:'Der Kommentar ist umgangssprachlich möglich, aber inhaltlich passend.'}
  ];
  levels[6].checks = [
    {id:'l7_q1', type:'mc', question:'Wann ist for meistens besser als while?', answers:['Wenn die Anzahl der Durchläufe feststeht','Wenn man gar keine Schleife braucht','Wenn man eine Datei löschen will','Wenn Python HTML schreiben soll'], correct:0, explain:'for ist ideal für feste Runden, Zahlenbereiche und Listen.'},
    {id:'l7_q2', type:'mc', question:'Welche Werte erzeugt range(1, 4)?', answers:['1, 2, 3','1, 2, 3, 4','0, 1, 2, 3','4, 3, 2, 1'], correct:0, explain:'Der Endwert ist bei range nicht enthalten.'},
    {id:'l7_q3', type:'mc', question:'Welche Schreibweise ist eine gültige for-Schleife?', answers:['for zahl in range(1, 6):','for zahl range(1, 6)','while for zahl:','range = for zahl'], correct:0, explain:'for Variable in Bereich: ist die Grundform.'},
    {id:'l7_q4', type:'mc', question:'Was ist bei for-Schleifen wichtig?', answers:['Der eingerückte Block gehört zur Schleife','Alles muss in eine Zeile','Man braucht immer break','Kommentare sind verboten'], correct:0, explain:'Einrückung entscheidet, was wiederholt wird.'},
    {id:'l7_q5', type:'mc', question:'Welcher Kommentar passt zu for zahl in range(1, 6)?', answers:['# läuft die Zahlen 1 bis 5 durch','# löscht alle Daten','# fragt bis stop geschrieben wird','# macht Terminal blau'], correct:0, explain:'Der Kommentar beschreibt sinnvoll, was die Schleife macht.'}
  ];
  levels[6].practiceTasks = [
    {id:'l7_p1', title:'Fünf Runden', prompt:'Gib mit for die Runden 1 bis 5 aus.', expected:'for runde in range(1, 6):\n    print(f"Runde {runde}")', concept:'for'},
    {id:'l7_p2', title:'Gerade Zahlen', prompt:'Gib mit range() die geraden Zahlen von 2 bis 10 aus.', expected:'for zahl in range(2, 11, 2):\n    print(f"Gerade Zahl: {zahl}")', concept:'range'},
    {id:'l7_p3', title:'Summe aufbauen', prompt:'Nutze eine for-Schleife und einen Akkumulator, um 1 bis 5 zu addieren.', expected:'summe = 0\nfor zahl in range(1, 6):\n    summe += zahl\nprint(f"Summe: {summe}")', concept:'accumulator'},
    {id:'l7_p4', title:'for sinnvoll kommentieren', prompt:'Kommentiere in eigenen Worten, was deine for-Schleife macht. Umgangssprache ist okay.', expected:'# geht jede Zahl durch und rechnet sie zur Summe dazu', concept:'comment'}
  ];
  levels[6].midExam = {
    id:'py_level_07_mid', title:'Zwischenprüfung · for und range()', purpose:'Prüft, ob feste Wiederholungen mit for und range() praktisch verstanden wurden.', requiredScore:82, requiredConcepts:['for','range','print','f_string','comment'],
    tasks:['Nutze eine for-Schleife mit range().','Gib mindestens fünf Runden oder Zahlen verständlich aus.','Nutze mindestens einen f-String.','Kommentiere in eigenen Worten, was die Schleife macht.'],
    testCases:[{name:'for-Schleife vorhanden', type:'count_for', min:1},{name:'range() vorhanden', type:'count_range', min:1},{name:'mindestens drei Ausgaben/Schleifenausgaben', type:'count_print', min:1},{name:'f-String vorhanden', type:'count_f_string', min:1},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:6},{name:'Struktur mindestens gelb', type:'structure_min', min:13}],
    rubric:[{key:'syntax', label:'Syntax/Einrückung/Doppelpunkt', points:20},{key:'concepts', label:'for/range/f-String', points:30},{key:'logic', label:'feste Wiederholung nachvollziehbar', points:25},{key:'structure', label:'Programmstruktur', points:15},{key:'reflection', label:'sinnvoller Kommentar', points:10}]
  };
  levels[6].finalExam = {
    id:'py_level_07_final', title:'Abschlussprüfung · Zahlen-Generator', uploadTypes:['.py','.txt'], requiredScore:88,
    task:'Erstelle einen Zahlen-Generator mit for und range(). Pflicht: Startwert, Endwert und Schrittweite als Variablen oder klar erkennbare Werte; mindestens eine for-Schleife mit range(); mindestens fünf erzeugte Werte; mindestens ein f-String; optional eine Summe oder einen Zähler; sinnvolle Kommentare; klare Struktur: Startwerte -> Schleife/Verarbeitung -> Ergebnis. Chaos-Code oder while statt for allein reicht nicht.',
    requiredConcepts:['for','range','iteration','print','f_string','comment'], requiredTokens:['for','range','print'], forbiddenTokens:['eval(','exec(','__import__(','subprocess','os.system'], knockoutErrors:['kein Code vorhanden','keine for-Schleife','range() fehlt','Aufgabe komplett verfehlt'],
    testCases:[{name:'for-Schleife vorhanden', type:'count_for', min:1},{name:'range() vorhanden', type:'count_range', min:1},{name:'mindestens ein f-String', type:'count_f_string', min:1},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:6},{name:'Struktur mindestens gelb', type:'structure_min', min:13},{name:'keine reine while-Lösung', type:'concept', concept:'for'}],
    rubric:[{key:'syntax', label:'Syntax/Einrückung/Doppelpunkt', points:20},{key:'concepts', label:'for/range/Iteration', points:25},{key:'logic', label:'Zahlenfolge korrekt geplant', points:20},{key:'structure', label:'Programmstruktur', points:20},{key:'readability', label:'Lesbarkeit/Nutzerführung', points:10},{key:'reflection', label:'sinnvolle Kommentare', points:5}]
  };

  levels[7].lessons = [
    {id:'l8_list_intro', title:'Listen speichern mehrere Werte', goal:'Du kannst mehrere Werte in einer Liste sammeln.', content:['Eine Liste steht in eckigen Klammern.','Beispiel: namen = ["Mira", "Ali", "Lia"].','Listen sind sinnvoll, wenn mehrere zusammengehörige Werte gespeichert werden.','Ein einzelner Wert wird über seinen Index angesprochen.'], example:'namen = ["Mira", "Ali", "Lia"]\nprint(namen)', explanation:'Die Liste speichert mehrere Namen in einer einzigen Variable.'},
    {id:'l8_append_len', title:'append() und len()', goal:'Du kannst Werte hinzufügen und die Länge einer Liste prüfen.', content:['append() hängt einen neuen Wert ans Ende der Liste.','len(liste) zählt, wie viele Elemente enthalten sind.','So kann ein Programm wachsen, ohne viele einzelne Variablen zu brauchen.','Sprechende Listennamen enden oft mit Mehrzahl: namen, punkte, produkte.'], example:'einkauf = []\neinkauf.append("Milch")\neinkauf.append("Brot")\nprint(f"Anzahl: {len(einkauf)}")', explanation:'Die Liste startet leer, danach werden zwei Einträge ergänzt.'},
    {id:'l8_index', title:'Index verstehen', goal:'Du verstehst, dass Listen bei 0 anfangen.', content:['Das erste Element hat Index 0.','liste[0] greift auf das erste Element zu.','liste[1] greift auf das zweite Element zu.','Indexfehler passieren, wenn man außerhalb der Liste zugreift.'], example:'farben = ["rot", "blau", "grün"]\nprint(farben[0])', explanation:'Python gibt rot aus, weil der erste Listenplatz 0 heißt.'},
    {id:'l8_list_structure', title:'Listen sauber ausgeben', goal:'Du strukturierst Listenprogramme lesbar.', content:['Listen sollten nicht durch viele Einzelvariablen ersetzt werden.','Eine gute Ausgabe zeigt klar, was in der Liste steckt.','Kommentare dürfen Alltagssprache nutzen, müssen aber zum Code passen.','Ab jetzt wird Struktur wichtiger: Daten -> Änderung -> Ausgabe.'], example:'# merkt sich mehrere Produkte in einer Einkaufsliste\neinkauf = []\neinkauf.append("Milch")\nprint(f"Liste: {einkauf}")', explanation:'Der Kommentar beschreibt sinnvoll, warum eine Liste genutzt wird.'}
  ];
  levels[7].checks = [
    {id:'l8_q1', type:'mc', question:'Wie erstellt man eine Liste?', answers:['namen = ["Mira", "Ali"]','namen = "Mira", "Ali" ohne Variable','list = print()','namen == [Mira]'], correct:0, explain:'Listen stehen in eckigen Klammern.'},
    {id:'l8_q2', type:'mc', question:'Was macht append()? ', answers:['Es fügt einen Wert ans Ende der Liste an','Es löscht Python','Es färbt Text','Es startet eine if-Abfrage'], correct:0, explain:'append() erweitert eine Liste um ein Element.'},
    {id:'l8_q3', type:'mc', question:'Was liefert len(einkauf)?', answers:['Die Anzahl der Elemente','Immer den ersten Wert','Die Farbe der Liste','Eine Zufallszahl'], correct:0, explain:'len() zählt die Elemente.'},
    {id:'l8_q4', type:'mc', question:'Welchen Index hat das erste Listenelement?', answers:['0','1','- immer 5','gar keinen'], correct:0, explain:'Python-Listen beginnen bei Index 0.'},
    {id:'l8_q5', type:'mc', question:'Welcher Kommentar passt zu einkauf.append("Milch")?', answers:['# packt Milch in die Einkaufsliste','# prüft ob jemand volljährig ist','# startet eine Endlosschleife','# wandelt Text zu Zahl um'], correct:0, explain:'Umgangssprache ist okay, wenn der Inhalt passt.'}
  ];
  levels[7].practiceTasks = [
    {id:'l8_p1', title:'Liste erstellen', prompt:'Erstelle eine Liste mit drei Produkten und gib sie aus.', expected:'produkte = ["Milch", "Brot", "Äpfel"]\nprint(produkte)', concept:'list'},
    {id:'l8_p2', title:'Eintrag hinzufügen', prompt:'Starte mit einer leeren Liste und füge zwei Einträge mit append() hinzu.', expected:'einkauf = []\neinkauf.append("Milch")\neinkauf.append("Brot")\nprint(einkauf)', concept:'append'},
    {id:'l8_p3', title:'Länge anzeigen', prompt:'Gib mit len() aus, wie viele Einträge in deiner Liste sind.', expected:'print(f"Anzahl: {len(einkauf)}")', concept:'len'},
    {id:'l8_p4', title:'Erstes Element', prompt:'Gib das erste Element einer Liste mit Index 0 aus.', expected:'print(einkauf[0])', concept:'index'}
  ];
  levels[7].midExam = {
    id:'py_level_08_mid', title:'Zwischenprüfung · Liste aufbauen', purpose:'Prüft, ob Listen, append() und len() praktisch sitzen.', requiredScore:82, requiredConcepts:['list','append','len','print','comment'],
    tasks:['Erstelle eine Liste.','Füge mindestens zwei Werte mit append() hinzu.','Gib die Liste und ihre Länge aus.','Kommentiere sinnvoll, wofür die Liste genutzt wird.'],
    testCases:[{name:'Liste vorhanden', type:'count_list_literal', min:1},{name:'append() mindestens zweimal', type:'count_append', min:2},{name:'len() vorhanden', type:'count_len', min:1},{name:'mindestens zwei Ausgaben', type:'count_print', min:2},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:6},{name:'Struktur mindestens gelb', type:'structure_min', min:13}],
    rubric:[{key:'syntax', label:'Syntax/Klammern', points:20},{key:'concepts', label:'Liste/append/len', points:30},{key:'logic', label:'Liste sinnvoll aufgebaut', points:25},{key:'structure', label:'Programmstruktur', points:15},{key:'reflection', label:'sinnvoller Kommentar', points:10}]
  };
  levels[7].finalExam = {
    id:'py_level_08_final', title:'Abschlussprüfung · Einkaufsliste', uploadTypes:['.py','.txt'], requiredScore:88,
    task:'Erstelle eine kleine Einkaufsliste. Pflicht: Liste erstellen, mindestens drei Einträge hinzufügen oder direkt speichern, mindestens zweimal append() nutzen oder klar mehrere Listenelemente anlegen, len() verwenden, mindestens ein Element über Index ausgeben, mindestens drei print()-Ausgaben, mindestens ein f-String, sinnvolle Kommentare und klare Struktur: Daten/Liste -> Änderungen -> Ausgabe. Unklare Einzelvariablen statt Liste zählen nicht als saubere Lösung.',
    requiredConcepts:['list','append','index','len','print','f_string','comment'], requiredTokens:['[','append','len','print'], forbiddenTokens:['eval(','exec(','__import__(','subprocess','os.system'], knockoutErrors:['kein Code vorhanden','keine Liste','append/Listenaufbau fehlt','Aufgabe komplett verfehlt'],
    testCases:[{name:'Liste vorhanden', type:'count_list_literal', min:1},{name:'append() oder mehrere Listenelemente', type:'append_or_multi_list', min:1},{name:'len() vorhanden', type:'count_len', min:1},{name:'Indexzugriff vorhanden', type:'count_index_access', min:1},{name:'mindestens drei Ausgaben', type:'count_print', min:3},{name:'mindestens ein f-String', type:'count_f_string', min:1},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:6},{name:'Struktur mindestens gelb', type:'structure_min', min:13}],
    rubric:[{key:'syntax', label:'Syntax/Klammern', points:20},{key:'concepts', label:'Liste/append/index/len', points:25},{key:'logic', label:'Einkaufsliste funktioniert', points:20},{key:'structure', label:'Programmstruktur', points:20},{key:'readability', label:'Lesbarkeit/Nutzerführung', points:10},{key:'reflection', label:'sinnvolle Kommentare', points:5}]
  };


  levels[8].lessons = [
    {id:'l9_list_loop_intro', title:'Listen mit for durchlaufen', goal:'Du kannst jedes Element einer Liste einzeln verarbeiten.', content:['Eine Liste speichert mehrere Werte.','Mit for kannst du jeden Eintrag nacheinander ansehen.','Der Schleifenname sollte zum Inhalt passen: punkt, produkt, name.','So vermeidest du viele einzelne print()-Zeilen.'], example:'# geht alle Punkte in der Liste durch\npunkte = [8, 10, 6, 9]\nfor punkt in punkte:\n    print(f"Punktzahl: {punkt}")', explanation:'Python nimmt jeden Wert aus punkte und legt ihn kurz in punkt.'},
    {id:'l9_accumulator', title:'Akkumulator: Summe aufbauen', goal:'Du kannst während einer Schleife ein Ergebnis sammeln.', content:['Ein Akkumulator startet oft bei 0.','In der Schleife wird immer etwas dazu gerechnet.','summe += punkt bedeutet: neue Summe = alte Summe + punkt.','Am Ende wird das Ergebnis ausgegeben.'], example:'summe = 0\npunkte = [8, 10, 6]\nfor punkt in punkte:\n    summe += punkt\nprint(f"Gesamt: {summe}")', explanation:'Die Summe wächst mit jedem Durchlauf.'},
    {id:'l9_average', title:'Durchschnitt berechnen', goal:'Du kannst aus einer Liste einfache Statistik bilden.', content:['Der Durchschnitt ist Summe geteilt durch Anzahl.','len(punkte) liefert die Anzahl der Werte.','Vor dem Teilen muss die Liste Werte enthalten.','Eine gute Ausgabe beschriftet Ergebnis und Bedeutung.'], example:'punkte = [8, 10, 6]\ndurchschnitt = sum(punkte) / len(punkte)\nprint(f"Durchschnitt: {durchschnitt}")', explanation:'sum() addiert alle Werte, len() zählt die Werte.'},
    {id:'l9_structure', title:'Auswertung sauber strukturieren', goal:'Du trennst Daten, Schleife/Auswertung und Ausgabe.', content:['Daten zuerst definieren.','Dann Verarbeitung mit Schleife oder sum().','Ausgabe am Ende klar beschriften.','Kommentare dürfen einfach sein, müssen aber erklären, was passiert.'], example:'# Liste wird ausgewertet und die Punkte werden zusammengerechnet\npunkte = [4, 7, 9]\ngesamt = 0\nfor punkt in punkte:\n    gesamt += punkt\nprint(f"Gesamtpunkte: {gesamt}")', explanation:'Der Kommentar passt zum Listen- und Auswertungskontext.'}
  ];
  levels[8].checks = [
    {id:'l9_q1', type:'mc', question:'Was macht for punkt in punkte?', answers:['Es nimmt jeden Wert aus der Liste nacheinander','Es löscht die Liste','Es erstellt automatisch eine Datenbank','Es beendet Python'], correct:0, explain:'Die for-Schleife läuft über jedes Element der Liste.'},
    {id:'l9_q2', type:'mc', question:'Was bedeutet summe += punkt?', answers:['Der aktuelle Punkt wird zur Summe addiert','Die Summe wird gelöscht','Der Punkt wird in Text umgewandelt','Die Liste wird sortiert'], correct:0, explain:'+= erhöht den bisherigen Wert.'},
    {id:'l9_q3', type:'mc', question:'Wie berechnet man einen Durchschnitt aus einer Punkteliste sinnvoll?', answers:['sum(punkte) / len(punkte)','punkte + len','print / input','for = durchschnitt'], correct:0, explain:'Summe geteilt durch Anzahl ergibt den Durchschnitt.'},
    {id:'l9_q4', type:'mc', question:'Welche Struktur ist sauber?', answers:['Liste/Daten -> Auswertung -> Ausgabe','Ausgabe -> Eingabe -> zufällig weiter','Alles in eine riesige print-Zeile','Nur Kommentare ohne Code'], correct:0, explain:'Erst Daten, dann Verarbeitung, dann Ergebnis.'},
    {id:'l9_q5', type:'mc', question:'Welcher Kommentar passt zu einer Punkteliste?', answers:['# rechnet die Punkte zusammen','# macht den Text blau','# fragt Alter ab','# startet Login'], correct:0, explain:'Der Kommentar beschreibt den Auswertungssinn.'}
  ];
  levels[8].practiceTasks = [
    {id:'l9_p1', title:'Liste ausgeben', prompt:'Erstelle eine Punkteliste und gib jeden Wert mit for aus.', expected:'punkte = [8, 10, 6]\nfor punkt in punkte:\n    print(f"Punkt: {punkt}")', concept:'list_loop'},
    {id:'l9_p2', title:'Summe sammeln', prompt:'Baue mit einer for-Schleife eine Summe aus einer Liste auf.', expected:'gesamt = 0\nfor punkt in punkte:\n    gesamt += punkt\nprint(f"Gesamt: {gesamt}")', concept:'accumulator'},
    {id:'l9_p3', title:'Durchschnitt', prompt:'Berechne den Durchschnitt einer Punkteliste mit sum() und len().', expected:'durchschnitt = sum(punkte) / len(punkte)', concept:'average'},
    {id:'l9_p4', title:'Auswertung erklären', prompt:'Kommentiere in eigenen Worten, was deine Auswertung macht.', expected:'# geht alle Punkte durch und rechnet sie zusammen', concept:'comment'}
  ];
  levels[8].midExam = {
    id:'py_level_09_mid', title:'Zwischenprüfung · Liste durchlaufen', purpose:'Prüft, ob du Listen mit for durchlaufen und Ergebnisse sammeln kannst.', requiredScore:83, requiredConcepts:['list','for','list_loop','print','comment'],
    tasks:['Erstelle eine Liste mit mindestens drei Zahlen.','Durchlaufe die Liste mit for.','Gib jeden Wert verständlich aus.','Kommentiere sinnvoll, was die Schleife macht.'],
    testCases:[{name:'Liste vorhanden', type:'count_list_literal', min:1},{name:'for-Schleife vorhanden', type:'count_for', min:1},{name:'for läuft über Liste', type:'count_list_loop', min:1},{name:'mindestens eine Ausgabe', type:'count_print', min:1},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:6},{name:'Struktur mindestens gelb', type:'structure_min', min:13}],
    rubric:[{key:'syntax', label:'Syntax/Einrückung', points:20},{key:'concepts', label:'Liste + for', points:30},{key:'logic', label:'Listendurchlauf nachvollziehbar', points:25},{key:'structure', label:'Programmstruktur', points:15},{key:'reflection', label:'sinnvoller Kommentar', points:10}]
  };
  levels[8].finalExam = {
    id:'py_level_09_final', title:'Abschlussprüfung · Punkteliste auswerten', uploadTypes:['.py','.txt'], requiredScore:89,
    task:'Erstelle eine Punkteliste-Auswertung. Pflicht: Liste mit mindestens fünf Punktzahlen, for-Schleife über diese Liste, Summe oder Durchschnitt berechnen, len() oder sum() sinnvoll nutzen, mindestens drei print()-Ausgaben, mindestens ein f-String, sinnvolle Kommentare und klare Struktur: Daten -> Auswertung -> Ergebnis. Einzelvariablen statt Liste zählen nicht.',
    requiredConcepts:['list','for','list_loop','accumulator','len','print','f_string','comment'], requiredTokens:['[','for','print'], forbiddenTokens:['eval(','exec(','__import__(','subprocess','os.system'], knockoutErrors:['kein Code vorhanden','keine Liste','keine for-Schleife über Liste','Aufgabe komplett verfehlt'],
    testCases:[{name:'Liste vorhanden', type:'count_list_literal', min:1},{name:'for-Schleife vorhanden', type:'count_for', min:1},{name:'for läuft über Liste', type:'count_list_loop', min:1},{name:'Akkumulator oder sum() vorhanden', type:'accumulator_or_sum', min:1},{name:'len() oder sum() vorhanden', type:'len_or_sum', min:1},{name:'mindestens drei Ausgaben', type:'count_print', min:3},{name:'mindestens ein f-String', type:'count_f_string', min:1},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:6},{name:'Struktur mindestens gelb', type:'structure_min', min:13}],
    rubric:[{key:'syntax', label:'Syntax/Einrückung', points:20},{key:'concepts', label:'Liste/for/Auswertung', points:25},{key:'logic', label:'Punkteauswertung funktioniert', points:20},{key:'structure', label:'Programmstruktur', points:20},{key:'readability', label:'Lesbarkeit/Nutzerführung', points:10},{key:'reflection', label:'sinnvolle Kommentare', points:5}]
  };

  levels[9].lessons = [
    {id:'l10_quiz_plan', title:'Quiz planen', goal:'Du kannst Fragen, Antworten und Punktestand sinnvoll verbinden.', content:['Ein Quiz braucht Fragen, erwartete Antworten und einen Punktestand.','Der Punktestand startet bei 0.','Bei richtiger Antwort wird der Punktestand erhöht.','Klare Ausgaben zeigen dem Nutzer, was passiert.'], example:'punkte = 0\nantwort = input("Wie heißt die Python-Ausgabe? ")\nif antwort == "print":\n    punkte += 1\nprint(f"Punkte: {punkte}")', explanation:'Die Antwort wird geprüft und bei richtiger Lösung gibt es einen Punkt.'},
    {id:'l10_score', title:'Punktestand sauber führen', goal:'Du kannst score/punkte als Akkumulator nutzen.', content:['punkte += 1 erhöht den Punktestand.','Der Score sollte klar benannt werden.','Nach jeder Frage kann optional Feedback ausgegeben werden.','Am Ende steht eine Ergebnisbewertung.'], example:'punkte = 0\n# richtige Antwort gibt einen Punkt\nif antwort == "b":\n    punkte += 1', explanation:'Der Punktestand sammelt die richtigen Antworten.'},
    {id:'l10_lists_for_quiz', title:'Quiz mit Listen vorbereiten', goal:'Du erkennst, wie Listen beim Quiz helfen.', content:['Fragen können in einer Liste gespeichert werden.','Antworten können ebenfalls in einer Liste stehen.','Für Level 10 reicht ein einfaches Quiz, aber Struktur bleibt Pflicht.','Später wird daraus ein richtiges Quiz-System.'], example:'fragen = ["Was macht print()?", "Wofür steht int()?"]\nantworten = ["ausgabe", "zahl"]', explanation:'Listen helfen, mehrere Fragen zusammenzuhalten.'},
    {id:'l10_final_output', title:'Ergebnis ausgeben', goal:'Du gibst am Ende eine verständliche Bewertung aus.', content:['Am Ende sollte der Nutzer seine Punktzahl sehen.','Eine Bewertung macht das Ergebnis verständlicher.','if/else kann bestimmen, ob das Ergebnis gut genug ist.','Kommentare sollen erklären, warum geprüft wird.'], example:'print(f"Du hast {punkte} Punkte erreicht.")\nif punkte >= 2:\n    print("Stark gemacht!")\nelse:\n    print("Weiter üben.")', explanation:'Das Quiz endet mit Ergebnis und Rückmeldung.'}
  ];
  levels[9].checks = [
    {id:'l10_q1', type:'mc', question:'Was braucht ein Mini-Quiz mindestens?', answers:['Frage, Antwortprüfung und Punktestand','Nur Farbe','Nur eine Liste ohne Logik','Nur einen Kommentar'], correct:0, explain:'Ein Quiz muss Eingabe prüfen und Punkte zählen.'},
    {id:'l10_q2', type:'mc', question:'Was macht punkte += 1?', answers:['Es erhöht den Punktestand um 1','Es löscht die Punkte','Es startet eine Schleife','Es wandelt Text in Zahl um'], correct:0, explain:'+= addiert zum vorhandenen Wert.'},
    {id:'l10_q3', type:'mc', question:'Welche Struktur ist für ein Quiz sinnvoll?', answers:['Startwert -> Fragen -> Prüfung -> Ergebnis','Ergebnis -> Fragen -> Startwert','Alles in eine print-Ausgabe','Nur input ohne Prüfung'], correct:0, explain:'Der Ablauf muss logisch und lesbar bleiben.'},
    {id:'l10_q4', type:'mc', question:'Was prüft if antwort == "print"?', answers:['Ob die Antwort genau print ist','Ob print gelöscht wird','Ob eine Liste leer ist','Ob Python online ist'], correct:0, explain:'== vergleicht zwei Werte.'},
    {id:'l10_q5', type:'mc', question:'Welcher Kommentar passt zum Punktestand?', answers:['# erhöht den Score bei richtiger Antwort','# macht die Schrift fett','# öffnet eine Datenbank','# fragt das Alter ab'], correct:0, explain:'Der Kommentar erklärt die Score-Logik.'}
  ];
  levels[9].practiceTasks = [
    {id:'l10_p1', title:'Eine Frage prüfen', prompt:'Stelle eine Frage mit input() und prüfe die Antwort mit if.', expected:'antwort = input("Befehl für Ausgabe? ")\nif antwort == "print":\n    print("Richtig")', concept:'quiz_check'},
    {id:'l10_p2', title:'Punkte zählen', prompt:'Erhöhe den Punktestand bei richtiger Antwort.', expected:'punkte = 0\nif antwort == "print":\n    punkte += 1', concept:'score'},
    {id:'l10_p3', title:'Zwei Fragen', prompt:'Baue zwei Fragen und gib am Ende den Punktestand aus.', expected:'print(f"Punkte: {punkte}")', concept:'multiple_questions'},
    {id:'l10_p4', title:'Quiz erklären', prompt:'Kommentiere in eigenen Worten, warum der Score erhöht wird.', expected:'# gibt einen Punkt wenn die Antwort stimmt', concept:'comment'}
  ];
  levels[9].midExam = {
    id:'py_level_10_mid', title:'Zwischenprüfung · Mini-Quiz mit Score', purpose:'Prüft, ob du Frage, Prüfung und Punktestand verbinden kannst.', requiredScore:84, requiredConcepts:['input','if','score','print','comment'],
    tasks:['Frage mindestens eine Quizfrage ab.','Prüfe die Antwort mit if.','Erhöhe einen Punktestand.','Gib den Punktestand aus.','Kommentiere die Score-Logik sinnvoll.'],
    testCases:[{name:'input() vorhanden', type:'count_input', min:1},{name:'if-Abfrage vorhanden', type:'concept', concept:'if'},{name:'Score/Punkte werden erhöht', type:'score_update', min:1},{name:'mindestens zwei Ausgaben', type:'count_print', min:2},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:6},{name:'Struktur mindestens gelb', type:'structure_min', min:13}],
    rubric:[{key:'syntax', label:'Syntax/Einrückung', points:20},{key:'concepts', label:'input/if/Score', points:30},{key:'logic', label:'Antwortprüfung nachvollziehbar', points:25},{key:'structure', label:'Programmstruktur', points:15},{key:'reflection', label:'sinnvoller Kommentar', points:10}]
  };
  levels[9].finalExam = {
    id:'py_level_10_final', title:'Abschlussprüfung · Quiz v1', uploadTypes:['.py','.txt'], requiredScore:90,
    task:'Erstelle ein Mini-Quiz. Pflicht: mindestens drei Fragen oder klar erkennbare Frage-Liste, Eingaben mit input(), Antwortprüfung mit if/elif/else, Punktestand startet bei 0 und wird bei richtigen Antworten erhöht, am Ende Ergebnis mit f-String ausgeben, sinnvolle Kommentare und klare Struktur: Startdaten -> Fragen/Prüfung -> Ergebnis. Stumpfes Kopieren ohne eigene Erklärung oder Chaos-Code reicht nicht.',
    requiredConcepts:['input','if','score','comparison','print','f_string','comment'], requiredTokens:['input','if','print'], forbiddenTokens:['eval(','exec(','__import__(','subprocess','os.system'], knockoutErrors:['kein Code vorhanden','keine Eingabe','keine Antwortprüfung','kein Punktestand','Aufgabe komplett verfehlt'],
    testCases:[{name:'mindestens drei Eingaben oder Fragenliste', type:'quiz_questions', min:3},{name:'if-Abfrage vorhanden', type:'concept', concept:'if'},{name:'Score/Punkte werden erhöht', type:'score_update', min:1},{name:'mindestens drei Ausgaben', type:'count_print', min:3},{name:'mindestens ein f-String', type:'count_f_string', min:1},{name:'Kommentar inhaltlich sinnvoll', type:'comment_quality', min:6},{name:'Struktur mindestens gelb', type:'structure_min', min:14}],
    rubric:[{key:'syntax', label:'Syntax/Einrückung', points:20},{key:'concepts', label:'Quizlogik/input/if/Score', points:25},{key:'logic', label:'Quiz funktioniert nachvollziehbar', points:20},{key:'structure', label:'Programmstruktur', points:20},{key:'readability', label:'Lesbarkeit/Nutzerführung', points:10},{key:'reflection', label:'sinnvolle Kommentare', points:5}]
  };


  var roadmapNote = 'Dieses Level ist als gesperrte Roadmap-DNA enthalten. Nach stabiler Prüfung der vorherigen Level wird es nach derselben Struktur vollständig ausgebaut.';
  levels.slice(10).forEach(function(l){
    l.lessons = [{id:l.id+'_roadmap', title:'Roadmap-DNA', goal:l.summary, content:[roadmapNote,'Pflichtkonzepte: '+l.concepts.join(', '),'Freischaltung erst nach bestandener Vorstufe.'], example:'# wird im nächsten Ausbau konkretisiert', explanation:'Die Struktur ist vorbereitet, damit der Kurs später bis Level 30 sauber skaliert.'}];
    l.checks = [{id:l.id+'_q1', type:'mc', question:'Was wird in diesem Level schwerpunktmäßig aufgebaut?', answers:[l.summary,'BPS-Zeitdruck','Nur Allgemeinwissen','Nur Highscore'], correct:0, explain:'Dieses Python-Level ist ein eigenständiger Lernpfad.'}];
    l.practiceTasks = [{id:l.id+'_p1', title:'Roadmap-Praxis', prompt:'Praktische Aufgabe wird nach Level-2-Validierung freigegeben.', expected:'', concept:l.concepts[0] || 'python'}];
  });

  window.PYTHON_QUEST_DB = {
    version:'10.5.0',
    name:'Python Quest Academy',
    storageKey:'bps_python_quest_progress_v1',
    description:'Separate Kursdatenbank für Python-Lernen mit Leveln, Zwischenprüfungen, Abschlussprüfungen und Code-Coach-Regeln.',

    commentSynonymPolicy:{
      active:true,
      rule:'Umgangssprache ist erlaubt. Bewertet wird, ob Kommentarinhalt und Code-Kontext zusammenpassen.',
      acceptedGroups:['Eingabe/abfragen/holen/reinholen/eintippen/User/Nutzer','Ausgabe/anzeigen/rausgeben/spuckt aus/print/Terminal','Speichern/merken/Variable/Wert/Daten','Umwandeln/konvertieren/Text zu Zahl/int/float','Rechnen/ausrechnen/plus/minus/mal/geteilt/Operator','Entscheidung/checken/prüfen/wenn/sonst/Grenzwert','Struktur/erst-dann-am Ende/Eingabe-Verarbeitung-Ausgabe']
    },

    philosophy:['Kein Levelsprung ohne Abschlussprüfung.','Zwischenprüfungen messen Können innerhalb des Levels.','Praktische Übungen sind Pflicht vor der Prüfung.','Der Code-Coach bewertet regelbasiert, transparent und anfängerfreundlich.','Python-Inhalte bleiben getrennt von BPS/CTC-Simulationen.'],
    xpRules:{ lesson:10, mcCorrect:8, practiceDone:15, midExamPass:45, finalExamPass:120, perfectFinalBonus:40 },
    phase2:{ title:'Prüfungsqualität + Level 2', includes:['Level-2-Vollausbau','Gating: Praxis vor Zwischenprüfung','Gating: Zwischenprüfung vor Abschlussprüfung','Testfall-Tabelle','Rubrik-Scores','Fehlerkategorien','einheitlicher Apple/Silver-Look'] },
    phase3:{ title:'Lernkurve + Level 3', includes:['Level-3-Vollausbau input()','doppelte Gating-Absicherung vor Analyse','Prüfungsprotokoll erweitert','Fehlerstatistik für Wiederholungsbedarf','gezieltere Reparaturübungen','Dashboard-Lernkurve'] },
    phase4:{ title:'Datentypen + PDF-Lernmaterial', includes:['Level-4-Vollausbau Zahlen/Rechnen/Datentypen','PDF-Lernmaterial pro Level 1-4','PDF-Link in der Levelansicht','Coach-Diagnose für int/float/operatoren','Testfälle gegen Textverkettung statt echter Rechnung'] },
    phase5:{ title:'Decision + Structure + Comment Intelligence', includes:['Level-5-Vollausbau if/else/elif','Struktur als Notenschlüssel-Pflicht','Chaos-Code kann trotz Funktion durchfallen','Kommentarqualität statt Kommentar-vorhanden','Synonym- und Umgangssprachen-Akzeptanz','PDF-Lernmaterial Level 5'] },
    phase6:{ title:'Loops + Endlosschleifen-Schutz', includes:['Level-6-Vollausbau while-Schleifen','Coach-Diagnose für Zähler und Ausstiegsbedingungen','Endlosschleifen-Risiko als K.O.-Logik','Kommentar-Synonyme für Wiederholen/Stoppen/Schleife','PDF-Lernmaterial Level 6'] },
    phase9:{ title:'for + Listen Grundlagen', includes:['Level-7-Vollausbau for/range','Level-8-Vollausbau Listen/append/len/index','Coach-Diagnose für for/range und Listenstruktur','PDF-Lernmaterial Level 7 und 8','Roadmap-Ansicht bis Level 8 direkt testbar'] },
    phase10:{ title:'Listen auswerten + Mini-Quiz', includes:['Level-9-Vollausbau Listen durchlaufen und Statistik','Level-10-Vollausbau Quiz mit Punktestand','Coach-Diagnose für list_loop, accumulator und score','PDF-Lernmaterial Level 9 und 10','Roadmap-Ansicht bis Level 10 direkt testbar'] },
    levels:levels
  };
})();
