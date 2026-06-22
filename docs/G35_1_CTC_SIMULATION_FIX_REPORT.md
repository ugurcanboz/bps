# G35.1 · CTC-Simulation Fix-Report (2026-06-10)

Ziel: Aufgabendatenbank und Simulation für das Lernen auf den CTC Lohr / Robert Bosch Eignungstest korrigieren und optimieren. Alle Fixes wurden headless mit einem Node-Testharness verifiziert (10 Simulationsläufe, 500 Iterationen pro Generator, Smoke-Test aller Trainingsmodi).

## Behobene Bugs

### 1. 72 Aufgaben wurden beim App-Start stillschweigend verworfen (js/app.js)
Die Gruppen "Kaufmännisch" (52 Aufgaben) und "Sozialpädagogik" (20 Aufgaben) fehlten in
QUESTION_BANK_SCHEMA.groups. validate() lehnte sie mit "unknown group" ab, die Modi
30–33 (Kaufm. Rechnen, Büro & Verwaltung, Pädagogik, Praxissituationen) liefen nur auf
generischen Fallback-Generatoren.
Fix: Gruppen in die Whitelist aufgenommen. Verifiziert: alle 4 Modi liefern jetzt
20/20 bzw. 10/10 echte Bank-Aufgaben (IDs km_*/sz_*).

### 2. Bildaufgaben: Antwortbuchstaben wurden gemischt (js/app.js, fromQuestionBank)
Aufgaben wie "Gemeinsamkeiten finden" haben Antworten "A"–"E", die sich auf Optionen
IM BILD beziehen. shuffleWithCorrect() mischte sie, sodass Button "A" z. B. den Text "D"
zeigte – die Zuordnung Bild ↔ Button war zerstört.
Fix: Für Aufgaben mit imageSrc wird die Originalreihenfolge beibehalten.

### 3. Doppelte Antwortbuttons bei Zählaufgaben (js/app.js, 5 Generatoren)
attention, pqStrike, focusScanner, symbolSearch und numberScan bauten Optionen mit
[n, n+1, Math.max(0, n−1), n+2]. Bei n=0 ergab das zweimal "0" – zwei identische
Buttons, von denen nur einer als richtig gewertet wurde.
Fix: Neuer Helper distinctCountOpts(n) garantiert 4 verschiedene, nicht-negative
Optionen. Stresstest: 0 Duplikate in 500 Läufen pro Generator.

### 4. CTC-Regel-Generator (Block 4 der Simulation) doppelt defekt (js/app.js)
a) fractionRuleEignungstest war ZWEIMAL im Generators-Objekt definiert; die erste
   Definition war toter Code und wurde entfernt.
b) Die aktive Version erzeugte in praktisch jeder Frage ein Antwort-Duplikat:
   correct (a−b bzw. a+b) kollidierte immer mit einem der Distraktoren
   Math.abs(a−b) bzw. a+b. Klick auf den "falschen Zwilling" wurde als Fehler gewertet.
c) Bei a===b widersprachen sich Beispielrechnung, gespeichertes Ergebnis und Erklärung.
Fix: Gleiche Paare werden vermieden (in der CTC-Regel nicht definiert), Distraktoren
werden aus einem Pool gezogen und sind garantiert paarweise verschieden, Beispiel-
anzeige nutzt das gespeicherte Ergebnis.

### 5. CTC-Simulation Block 1 hatte einen leeren Aufgabenpool (data/question-bank.js)
Alle 134 Allgemeinwissen-Aufgaben waren ausschließlich examTarget "bps" markiert.
Die ctcLohr-Simulation fand 0 passende Aufgaben und lief nur über einen stillen
Fallback, der den examTarget-Filter verwarf – inklusive 600–780 Zeichen langer
Textverständnis-Passagen, die bei ~12 s/Frage in Block 1 unrealistisch sind.
Fix: 119 kurze Allgemeinwissen-Aufgaben (Satzergänzung, Politik, Geografie,
Geschichte, Wirtschaft, Wissenschaft, …) auf examTarget "both" gesetzt.
Textverständnis bleibt bewusst bps-only. Zusätzlich wurden die 12 Logik-Bildaufgaben
(Gemeinsamkeiten finden, Zugehörigkeiten identifizieren) auf "both" gesetzt, damit
Block 3 die "Formen"-Aufgaben des echten Tests enthält.
BPS-Simulation unverändert: Pool weiterhin 134 Aufgaben.

### 6. Bruchrechnen-Generator: 32 % Duplikatrate (js/app.js, Generators.fraction)
Der Distraktor fracHTML(sn,lcm) war bei nicht kürzbaren Brüchen (gcd=1, sehr häufig)
IDENTISCH mit der richtigen Antwort → zwei gleiche Antwortbuttons in ~1/3 aller
Bruchaufgaben (betrifft BPS-Sim, CTC-Elite, Mathe Sprint).
Fix: Distraktoren werden jetzt nach mathematischem WERT dedupliziert – das verhindert
auch wertgleiche Optionen wie 1/2 neben 2/4. Stresstest: 0 Duplikate in 2000 Läufen.

### 7. Aussagenlogik-Generator: Farbkollision (js/app.js, Generators.statementLogic)
Der fest codierte Distraktor "Es ist weiß" kollidierte mit der Option "Es ist weiß",
sobald die Farbe weiß gezogen wurde (~4 % Duplikatrate, betrifft CTC-Sim Block 3
Fallback, Logik Sprint, Aussagenlogik-Block).
Fix: Distraktor nutzt jetzt die zweite gezogene Farbe statt fest "weiß".

### 8. Tabellenvergleich: zufällig doppelte IDs (js/app.js, Generators.tableComparePro)
Die Zeilen-IDs (Buchstabe + Zufallszahl 100–999) waren nicht eindeutig. Bei Kollision
erschienen doppelte Antwortbuttons UND die Aufgabe selbst wurde mehrdeutig (zwei
identische IDs in der Tabelle). Fix: IDs werden jetzt eindeutig erzeugt.
Stresstest: 0 Duplikate in 15.000 Läufen über alle Schwierigkeitsgrade.

## Optimierung: Realistischere Block-Mischung in der Simulation

### Block 1 quotiert (28 Wissensfragen + 12 Satzergänzung)
Vorher zog Block 1 rein zufällig aus dem Pool, in dem Satzergänzung mit 65 von 119
Aufgaben überrepräsentiert war (~21 von 40 Fragen). Jetzt: feste Quote von 12
Satzergänzungen, der Rest sind kurze Wissensfragen (Politik, Geografie, Geschichte,
Wirtschaft, Kunst, …) – wie im echten Test. Dafür wurde QuestionBankEngine.filter um
excludeCategory erweitert (abwärtskompatibel).

### Block 3 mit festen Matrizen- und Meinung/Tatsache-Anteilen
Der echte Block 3 enthält laut Blockbeschreibung Zahlenreihen, Matrizen (3x3),
Formen, Aussagenlogik und Meinung/Tatsache. Matrizen und Meinung/Tatsache kamen
vorher nur zufällig über Fallback-Generatoren vor. Jetzt garantiert: 3 Matrizen-
Bildaufgaben (aus dem PDF) + 2 Meinung/Tatsache + 13 gemischte Logik aus der Bank
(inkl. der Formen-Bildaufgaben).

### 9. Service-Worker-Cache (service-worker.js)
CACHE_NAME auf 'bps-trainer-g351-ctc-fix' erhöht, damit die PWA die korrigierten
Dateien lädt statt der alten aus dem Cache.

## Verifikation (Testharness)
- Bootstrap: 517/517 Aufgaben geladen (vorher 445)
- ctcLohr 10× gebaut: je 93 Fragen, Blockstruktur 40/9/18/15/11, 0 Issues
- Block 1 ohne Textverständnis, Block 3 mit Bildaufgaben
- 12 Konzentrations-Generatoren × 500 Läufe: 0 Duplikate, 0 Index-Fehler
- fraction / statementLogic / math × 2000 Läufe: 0 Duplikate
- Alle 33 Trainingsmodi gebaut: 0 Duplikate, 0 Guard-Fehler

## Verifikation der Block-Quoten
- 10 Simulationsläufe: Block 1 exakt 12/40 Satzergänzung, Block 3 exakt
  3 Matrizen + 2 Meinung/Tatsache, 5 Bildaufgaben pro Lauf
- Alle 34 Trainingsmodi × 3 Läufe nach allen Änderungen: 0 Duplikate, 0 Guard-Fehler
