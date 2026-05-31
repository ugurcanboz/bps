/*
  BPS Trainer – Learning Math Tasks / Generator Seeds
  Version: 0.2.0-stable-prototype
  Voll formulierte Aufgaben auf Realschule 8+ Niveau mit Hilfe-Daten.
*/
(function () {
  'use strict';

  const taskTemplates = [
    {
      id: 'math-text-percent-discount-voucher',
      type: 'text-math',
      topic: 'Prozentrechnung',
      difficulty: 'medium',
      tags: ['Prozent', 'Rabatt', 'Gutschein', 'Denkfalle'],
      generate() {
        const price = pick([249, 399, 599, 749, 899, 1199]);
        const percent = pick([10, 12, 15, 20]);
        const voucher = pick([20, 30, 50, 75]);
        const discount = round2(price * percent / 100);
        const result = round2(price - discount - voucher);
        return {
          id: makeId('percent-voucher'),
          branch: ['mathe', 'kaufmaennisch'],
          module: 'lernen-mathe',
          topic: 'Prozentrechnung',
          difficulty: 'medium',
          question: `Ein Elektrofachmarkt bietet einen Laptop für ${formatEuro(price)} an. Im Rahmen einer Aktion erhält jede Kundin und jeder Kunde zuerst ${percent} % Rabatt auf den ursprünglichen Preis. Zusätzlich gibt es an der Kasse noch einen Gutschein über ${formatEuro(voucher)}. Wie viel muss am Ende bezahlt werden?`,
          answerType: 'number',
          unit: '€',
          correctAnswer: result,
          acceptedTolerance: 0.02,
          hint: 'Berechne zuerst den prozentualen Rabatt. Ziehe danach den Gutschein ab.',
          trick: 'Rabatt und Gutschein sind nicht dasselbe. Der Prozent-Rabatt wird zuerst vom ursprünglichen Preis berechnet.',
          steps: [
            `${percent} % von ${formatEuro(price)} berechnen.`,
            `${formatEuro(price)} - Rabatt = neuer Preis nach Rabatt.`,
            `Danach den Gutschein über ${formatEuro(voucher)} abziehen.`,
            `Ergebnis: ${formatEuro(result)}.`
          ],
          explanation: `Der Rabatt beträgt ${formatEuro(discount)}. Nach dem Rabatt bleiben ${formatEuro(price - discount)}. Davon wird noch der Gutschein abgezogen. Der Endpreis ist ${formatEuro(result)}.`,
          checks: ['Prozentrechnung', 'Reihenfolge beachten', 'Geldbeträge sicher rechnen']
        };
      }
    },
    {
      id: 'math-text-area-path-around-yard',
      type: 'text-math',
      topic: 'Flächenberechnung',
      difficulty: 'hard',
      tags: ['Fläche', 'zusammengesetzte Fläche', 'Denkfalle'],
      generate() {
        const innerL = pick([12, 14, 16, 18, 20]);
        const innerW = pick([7, 8, 9, 10, 11]);
        const path = pick([1, 2]);
        const outerL = innerL + 2 * path;
        const outerW = innerW + 2 * path;
        const result = outerL * outerW - innerL * innerW;
        return {
          id: makeId('area-path'),
          branch: ['mathe'],
          module: 'lernen-mathe',
          topic: 'Flächenberechnung',
          difficulty: 'hard',
          question: `Ein rechteckiger Schulhof ist ${innerL} Meter lang und ${innerW} Meter breit. Außen herum wird ein gepflasterter Weg gebaut, der überall ${path} Meter breit ist. Wie groß ist nur die Fläche des Weges?`,
          answerType: 'number',
          unit: 'm²',
          correctAnswer: result,
          acceptedTolerance: 0,
          hint: 'Berechne erst die große Außenfläche und ziehe dann die innere Schulhoffläche ab.',
          trick: 'Der Weg liegt außen herum. Deshalb werden Länge und Breite jeweils auf beiden Seiten größer.',
          steps: [
            `Außenlänge: ${innerL} + 2 × ${path} = ${outerL} m.`,
            `Außenbreite: ${innerW} + 2 × ${path} = ${outerW} m.`,
            `Außenfläche: ${outerL} × ${outerW} = ${outerL * outerW} m².`,
            `Innenfläche: ${innerL} × ${innerW} = ${innerL * innerW} m².`,
            `Wegfläche: ${outerL * outerW} - ${innerL * innerW} = ${result} m².`
          ],
          explanation: `Die Falle ist, dass der Weg nicht nur einmal zur Länge und Breite addiert wird, sondern auf beiden Seiten. Deshalb wird zweimal die Wegbreite addiert.`,
          checks: ['Flächenberechnung', 'genaues Lesen', 'zusammengesetzte Fläche']
        };
      }
    },
    {
      id: 'math-text-ratio-drinks',
      type: 'text-math',
      topic: 'Dreisatz',
      difficulty: 'medium',
      tags: ['Dreisatz', 'Verhältnis', 'Aufrunden'],
      generate() {
        const personsBase = pick([6, 8, 10]);
        const litersBase = pick([2, 3, 4]);
        const persons = pick([26, 34, 38, 45, 52]);
        const exact = persons * litersBase / personsBase;
        const result = Math.ceil(exact);
        return {
          id: makeId('ratio-drinks'),
          branch: ['mathe', 'sozial', 'kaufmaennisch'],
          module: 'lernen-mathe',
          topic: 'Dreisatz',
          difficulty: 'medium',
          question: `Für ein Sommerfest werden Getränke vorbereitet. Für jeweils ${personsBase} Personen werden ${litersBase} Liter Apfelschorle eingeplant. Wie viele Liter müssen mindestens bereitgestellt werden, wenn insgesamt ${persons} Personen teilnehmen? Runde sinnvoll auf volle Liter auf.`,
          answerType: 'number',
          unit: 'Liter',
          correctAnswer: result,
          acceptedTolerance: 0,
          hint: 'Rechne zuerst aus, wie viel Liter für 1 Person geplant sind.',
          trick: 'Bei „mindestens“ und Getränken musst du sinnvoll aufrunden, nicht abrunden.',
          steps: [
            `${litersBase} Liter für ${personsBase} Personen.`,
            `Für 1 Person: ${litersBase} ÷ ${personsBase} = ${round2(litersBase / personsBase)} Liter.`,
            `Für ${persons} Personen: ${persons} × ${round2(litersBase / personsBase)} = ${round2(exact)} Liter.`,
            `Auf volle Liter aufrunden: ${result} Liter.`
          ],
          explanation: `Man darf hier nicht abrunden, weil dann nicht genug Getränke vorhanden wären. Deshalb lautet die Mindestmenge ${result} Liter.`,
          checks: ['Dreisatz', 'Aufrunden', 'Alltagssituation']
        };
      }
    },
    {
      id: 'math-text-time-planning',
      type: 'text-math',
      topic: 'Zeitrechnung',
      difficulty: 'medium',
      tags: ['Zeit', 'Planung', 'Textverständnis'],
      generate() {
        const startH = pick([7, 8, 9]);
        const startM = pick([0, 15, 30]);
        const first = pick([25, 35, 45]);
        const second = pick([40, 50, 55]);
        const pause = pick([10, 15, 20]);
        const startTotal = startH * 60 + startM;
        const end = startTotal + first + second + pause;
        return {
          id: makeId('time-plan'),
          branch: ['mathe', 'kaufmaennisch', 'sozial'],
          module: 'lernen-mathe',
          topic: 'Zeitrechnung',
          difficulty: 'medium',
          question: `Eine Mitarbeiterin beginnt ihre Frühschicht um ${formatTime(startTotal)} Uhr. Zuerst nimmt sie an einer Besprechung teil, die ${first} Minuten dauert. Danach bearbeitet sie ${second} Minuten lang E-Mails. Anschließend macht sie eine Pause von ${pause} Minuten. Um wie viel Uhr beginnt ihre nächste Aufgabe?`,
          answerType: 'text',
          correctAnswer: formatTime(end),
          hint: 'Addiere alle Zeitabschnitte zur Startzeit.',
          trick: 'Die Pause gehört ebenfalls zur vergangenen Zeit. Sie wird nicht übersprungen.',
          steps: [
            `Start: ${formatTime(startTotal)} Uhr.`,
            `Besprechung: +${first} Minuten.`,
            `E-Mails: +${second} Minuten.`,
            `Pause: +${pause} Minuten.`,
            `Insgesamt: ${first + second + pause} Minuten später.`,
            `Nächste Aufgabe beginnt um ${formatTime(end)} Uhr.`
          ],
          explanation: `Alle genannten Zeitabschnitte finden nacheinander statt. Deshalb werden sie zur Startzeit addiert.`,
          checks: ['Zeitrechnung', 'Reihenfolge', 'Planung']
        };
      }
    },
    {
      id: 'math-text-fractions-pizza',
      type: 'text-math',
      topic: 'Bruchrechnung',
      difficulty: 'medium',
      tags: ['Brüche', 'Addition', 'Alltag'],
      generate() {
        const a = pick([[1, 2], [1, 3], [1, 4]]);
        const b = pick([[1, 4], [1, 6], [1, 8]]);
        const common = lcm(a[1], b[1]);
        const numerator = a[0] * (common / a[1]) + b[0] * (common / b[1]);
        const g = gcd(numerator, common);
        const simpleN = numerator / g;
        const simpleD = common / g;
        const answer = `${simpleN}/${simpleD}`;
        return {
          id: makeId('fraction-food'),
          branch: ['mathe'],
          module: 'lernen-mathe',
          topic: 'Bruchrechnung',
          difficulty: 'medium',
          question: `Bei einem gemeinsamen Essen wird zuerst ${a[0]}/${a[1]} einer großen Pizza gegessen. Später werden noch einmal ${b[0]}/${b[1]} derselben Pizza gegessen. Welcher Anteil der Pizza wurde insgesamt gegessen? Gib den Bruch gekürzt an.`,
          answerType: 'fraction',
          correctAnswer: answer,
          hint: 'Brüche kannst du nur addieren, wenn sie denselben Nenner haben.',
          trick: 'Suche einen gemeinsamen Nenner. Danach addierst du nur die Zähler.',
          steps: [
            `Gemeinsamer Nenner von ${a[1]} und ${b[1]} ist ${common}.`,
            `${a[0]}/${a[1]} = ${a[0] * (common / a[1])}/${common}.`,
            `${b[0]}/${b[1]} = ${b[0] * (common / b[1])}/${common}.`,
            `Zusammen: ${numerator}/${common}.`,
            `Gekürzt: ${answer}.`
          ],
          explanation: `Bei Brüchen mit unterschiedlichen Nennern musst du erst auf denselben Nenner bringen. Danach addierst du die oberen Zahlen.`,
          checks: ['Bruchrechnung', 'gemeinsamer Nenner', 'Kürzen']
        };
      }
    },
    {
      id: 'math-text-number-series',
      type: 'logic-math',
      topic: 'Zahlenreihen',
      difficulty: 'hard',
      tags: ['Zahlenreihe', 'Muster', 'abwechselnde Regel'],
      generate() {
        const start = pick([2, 3, 4, 5]);
        const plus = pick([3, 4, 5]);
        const times = pick([2, 3]);
        const seq = [start];
        for (let i = 1; i < 6; i++) {
          if (i % 2 === 1) seq.push(seq[i - 1] + plus);
          else seq.push(seq[i - 1] * times);
        }
        const next = seq[5] + plus;
        return {
          id: makeId('number-series'),
          branch: ['mathe', 'logik', 'it'],
          module: 'lernen-mathe',
          topic: 'Zahlenreihen',
          difficulty: 'hard',
          question: `Setze die Zahlenreihe sinnvoll fort: ${seq.join(' – ')} – ?`,
          answerType: 'number',
          correctAnswer: next,
          hint: 'Prüfe, ob sich zwei verschiedene Regeln abwechseln.',
          trick: `Hier wechseln sich „+${plus}“ und „×${times}“ ab.`,
          steps: [
            `${seq[0]} + ${plus} = ${seq[1]}`,
            `${seq[1]} × ${times} = ${seq[2]}`,
            `${seq[2]} + ${plus} = ${seq[3]}`,
            `${seq[3]} × ${times} = ${seq[4]}`,
            `${seq[4]} + ${plus} = ${seq[5]}`,
            `Nächster Schritt: ${seq[5]} + ${plus} = ${next}`
          ],
          explanation: `Die Reihe hat keine einzelne Regel, sondern zwei Regeln im Wechsel. Deshalb ist die nächste Zahl ${next}.`,
          checks: ['Zahlenreihen', 'Mustererkennung', 'abwechselnde Regeln']
        };
      }
    },
    {
      id: 'math-text-perimeter-fence',
      type: 'text-math',
      topic: 'Umfangberechnung',
      difficulty: 'medium',
      tags: ['Umfang', 'Rechteck', 'Alltag'],
      generate() {
        const l = pick([14, 16, 18, 22, 25]);
        const w = pick([6, 8, 9, 11, 12]);
        const gate = pick([1, 2, 3]);
        const result = 2 * l + 2 * w - gate;
        return {
          id: makeId('perimeter-fence'),
          branch: ['mathe'],
          module: 'lernen-mathe',
          topic: 'Umfangberechnung',
          difficulty: 'medium',
          question: `Ein rechteckiger Garten ist ${l} Meter lang und ${w} Meter breit. Um den Garten soll ein Zaun gebaut werden. An einer Seite bleibt ein ${gate} Meter breites Tor frei. Wie viele Meter Zaun werden benötigt?`,
          answerType: 'number',
          unit: 'm',
          correctAnswer: result,
          hint: 'Berechne zuerst den gesamten Umfang des Gartens.',
          trick: 'Das Tor wird nicht eingezäunt. Deshalb musst du die Torbreite abziehen.',
          steps: [
            `Umfang Rechteck: 2 × ${l} + 2 × ${w}.`,
            `Das ergibt ${2 * l + 2 * w} m.`,
            `Tor abziehen: ${2 * l + 2 * w} - ${gate} = ${result} m.`
          ],
          explanation: `Der Zaun verläuft außen herum, aber an der Torstelle wird kein Zaun gebaut. Deshalb werden ${result} Meter Zaun benötigt.`,
          checks: ['Umfang', 'Textfalle', 'Alltagsrechnung']
        };
      }
    }
  ];

  function pick(values) { return values[Math.floor(Math.random() * values.length)]; }
  function round2(n) { return Math.round(n * 100) / 100; }
  function formatEuro(n) { return `${String(round2(n)).replace('.', ',')} €`; }
  function formatTime(minutes) {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  function makeId(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }
  function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }

  window.BPS_LEARNING_MATH_TASK_TEMPLATES = taskTemplates;
})();
