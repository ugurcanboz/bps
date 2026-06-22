/*
  Eignungstest-Trainer – Extended Math Task Templates
  Interner Prototyp
  Zusätzliche vollständig formulierte Textaufgaben auf Realschule 8+ bis Prüfungsniveau.
*/
(function () {
  'use strict';

  const extraTemplates = [
    {
      id: 'math-text-percent-up-down-trap', type: 'text-math', topic: 'Prozentrechnung', difficulty: 'hard', tags: ['Prozent','Preisänderung','Denkfalle'],
      generate() {
        const price = pick([80,120,150,200,250]);
        const up = pick([10,20,25]);
        const down = pick([10,20,25]);
        const afterUp = round2(price * (1 + up/100));
        const result = round2(afterUp * (1 - down/100));
        return task('percent-change', ['mathe','kaufmaennisch'], 'Prozentrechnung', 'hard',
          `Ein Händler erhöht den Preis eines Artikels zunächst von ${formatEuro(price)} um ${up} %. Eine Woche später senkt er den neuen Preis wieder um ${down} %. Wie teuer ist der Artikel danach?`,
          'number', result, '€', 0.02,
          'Rechne die Senkung nicht vom alten Preis, sondern vom neuen Preis nach der Erhöhung.',
          'Bei mehreren Prozent-Schritten ändert sich der Grundwert jedes Mal.',
          [`Erhöhung: ${up} % von ${formatEuro(price)} = ${formatEuro(round2(price*up/100))}.`, `Neuer Preis: ${formatEuro(afterUp)}.`, `Senkung: ${down} % von ${formatEuro(afterUp)} = ${formatEuro(round2(afterUp*down/100))}.`, `Endpreis: ${formatEuro(result)}.`],
          `Der zweite Prozentwert wird vom bereits erhöhten Preis berechnet. Deshalb ist das Ergebnis nicht automatisch wieder der Ausgangspreis.`,
          ['Prozentrechnung','Grundwertwechsel','Denkfalle']);
      }
    },
    {
      id:'math-text-invoice-vat-skonto', type:'text-math', topic:'Prozentrechnung', difficulty:'exam', tags:['Umsatzsteuer','Skonto','Kaufmännisch'],
      generate() {
        const net = pick([240, 360, 480, 750, 960]); const vat = 19; const skonto = pick([2,3]);
        const gross = round2(net * 1.19); const result = round2(gross * (1 - skonto/100));
        return task('invoice-skonto', ['mathe','kaufmaennisch'], 'Prozentrechnung', 'exam',
          `Ein Büro bestellt Arbeitsmaterial zum Nettopreis von ${formatEuro(net)}. Auf der Rechnung werden ${vat} % Umsatzsteuer berechnet. Bei Zahlung innerhalb von 10 Tagen darf zusätzlich ${skonto} % Skonto vom Bruttobetrag abgezogen werden. Wie viel muss bezahlt werden, wenn pünktlich gezahlt wird?`,
          'number', result, '€', 0.02,
          'Berechne zuerst brutto. Danach ziehst du Skonto vom Bruttobetrag ab.',
          'Netto + Umsatzsteuer = Brutto. Skonto wird hier vom Brutto abgezogen.',
          [`Brutto: ${formatEuro(net)} × 1,19 = ${formatEuro(gross)}.`, `Skonto: ${skonto} % von ${formatEuro(gross)} = ${formatEuro(round2(gross*skonto/100))}.`, `Zahlbetrag: ${formatEuro(gross)} - Skonto = ${formatEuro(result)}.`],
          'Die Aufgabe kombiniert Umsatzsteuer und Skonto. Wichtig ist die richtige Reihenfolge.', ['Umsatzsteuer','Skonto','Reihenfolge']);
      }
    },
    {
      id:'math-text-indirect-rule-workers', type:'text-math', topic:'Dreisatz', difficulty:'hard', tags:['indirekter Dreisatz','Arbeitszeit'],
      generate() {
        const workersA = pick([3,4,5]); const hoursA = pick([6,8,10]); const workersB = pick([6,8,10]);
        const result = round2(workersA * hoursA / workersB);
        return task('indirect-workers', ['mathe','kaufmaennisch'], 'Dreisatz', 'hard',
          `${workersA} Mitarbeiter benötigen für das Sortieren einer Lieferung ${hoursA} Stunden. Wie viele Stunden würden ${workersB} gleich schnell arbeitende Mitarbeiter für dieselbe Lieferung benötigen?`,
          'number', result, 'Stunden', 0.05,
          'Mehr Mitarbeiter brauchen für dieselbe Arbeit weniger Zeit.',
          'Das ist indirekter Dreisatz: mehr Personen → weniger Zeit.',
          [`Gesamtarbeit: ${workersA} × ${hoursA} = ${workersA*hoursA} Mitarbeiterstunden.`, `Zeit bei ${workersB} Mitarbeitern: ${workersA*hoursA} ÷ ${workersB} = ${result} Stunden.`],
          'Die Arbeit bleibt gleich. Deshalb wird die Gesamtarbeit in Mitarbeiterstunden berechnet.', ['indirekter Dreisatz','Arbeitsplanung']);
      }
    },
    {
      id:'math-text-fraction-recipe', type:'text-math', topic:'Bruchrechnung', difficulty:'hard', tags:['Brüche','Rezept','Verhältnis'],
      generate() {
        const base = pick([4,6,8]); const target = pick([10,12,14]); const flourN = pick([1,3]); const flourD = pick([2,4]);
        const exact = target/base*flourN/flourD; const result = round2(exact);
        return task('fraction-recipe', ['mathe','sozial'], 'Bruchrechnung', 'hard',
          `Für ${base} Personen werden ${flourN}/${flourD} kg Mehl benötigt. In einer Gruppe sollen ${target} Personen versorgt werden. Wie viele Kilogramm Mehl werden benötigt? Gib das Ergebnis als Dezimalzahl an.`,
          'number', result, 'kg', 0.02,
          'Rechne zuerst den Bedarf für eine Person aus.',
          'Bruch und Dreisatz können zusammen auftreten.',
          [`${flourN}/${flourD} kg für ${base} Personen.`, `Für 1 Person: ${flourN}/${flourD} ÷ ${base}.`, `Für ${target} Personen: Ergebnis × ${target} = ${result} kg.`],
          'Die Aufgabe verbindet Brüche mit Dreisatz. Wichtig ist, den Bruch als Menge zu verstehen.', ['Brüche','Dreisatz','Dezimalzahl']);
      }
    },
    {
      id:'math-text-trapezoid-garden', type:'text-math', topic:'Flächenberechnung', difficulty:'exam', tags:['Trapez','Fläche','Formel'],
      generate() {
        const a = pick([10,12,14,16]); const c = pick([6,8,10]); const h = pick([5,6,7]); const result = (a+c)*h/2;
        return task('trapezoid-area', ['mathe'], 'Flächenberechnung', 'exam',
          `Ein Beet hat die Form eines Trapezes. Die beiden parallelen Seiten sind ${a} Meter und ${c} Meter lang. Der Abstand zwischen diesen Seiten beträgt ${h} Meter. Wie groß ist die Fläche des Beetes?`,
          'number', result, 'm²', 0,
          'Beim Trapez addierst du die parallelen Seiten, multiplizierst mit der Höhe und teilst durch 2.',
          'Trapezfläche: (a + c) × h ÷ 2.',
          [`Parallele Seiten: ${a} m und ${c} m.`, `Summe: ${a+c} m.`, `Mit Höhe multiplizieren: ${a+c} × ${h} = ${(a+c)*h}.`, `Durch 2 teilen: ${result} m².`],
          'Die Höhe ist der senkrechte Abstand zwischen den parallelen Seiten, nicht die schräge Seite.', ['Trapez','Flächenformel','Einheiten']);
      }
    },
    {
      id:'math-text-circle-table', type:'text-math', topic:'Kreis', difficulty:'hard', tags:['Kreis','Umfang','Durchmesser'],
      generate() {
        const d = pick([60,80,100,120]); const result = round2(Math.PI*d);
        return task('circle-table', ['mathe'], 'Kreis', 'hard',
          `Ein runder Tisch hat einen Durchmesser von ${d} cm. Um die Tischkante soll ein Schutzband angebracht werden. Wie viele Zentimeter Schutzband werden ungefähr benötigt? Rechne mit π ≈ 3,14.`,
          'number', round2(3.14*d), 'cm', 0.5,
          'Für den Kreisumfang brauchst du den Durchmesser.',
          'Umfang Kreis = π × Durchmesser.',
          [`Durchmesser: ${d} cm.`, `Umfang: 3,14 × ${d} = ${round2(3.14*d)} cm.`],
          'Es geht um den Rand des Tisches, also um den Umfang, nicht um die Fläche.', ['Kreisumfang','Durchmesser','π']);
      }
    },
    {
      id:'math-text-volume-aquarium', type:'text-math', topic:'Volumen', difficulty:'hard', tags:['Volumen','Quader','Liter'],
      generate() {
        const l = pick([60,80,100]); const w = pick([30,40,50]); const h = pick([30,40,45]); const cm3 = l*w*h; const liters = cm3/1000;
        return task('aquarium-volume', ['mathe'], 'Volumen', 'hard',
          `Ein Aquarium ist innen ${l} cm lang, ${w} cm breit und ${h} cm hoch. Wie viele Liter Wasser passen ungefähr hinein, wenn es vollständig gefüllt wird?`,
          'number', liters, 'Liter', 0.1,
          'Berechne zuerst das Volumen in cm³. 1000 cm³ sind 1 Liter.',
          'Quader: Länge × Breite × Höhe.',
          [`Volumen: ${l} × ${w} × ${h} = ${cm3} cm³.`, `${cm3} cm³ ÷ 1000 = ${liters} Liter.`],
          'Die Umrechnung von cm³ in Liter ist die typische Falle.', ['Volumen','Quader','Umrechnung']);
      }
    },
    {
      id:'math-text-linear-equation', type:'text-math', topic:'Gleichungen', difficulty:'hard', tags:['Gleichung','Textaufgabe'],
      generate() {
        const x = pick([8,12,15,20]); const add = pick([5,7,9]); const factor = pick([2,3]); const total = factor*x + add;
        return task('equation-text', ['mathe'], 'Gleichungen', 'hard',
          `Eine Zahl wird mit ${factor} multipliziert. Danach werden ${add} addiert. Das Ergebnis ist ${total}. Wie heißt die ursprüngliche Zahl?`,
          'number', x, '', 0,
          'Stelle eine Gleichung auf: Zahl = x.',
          'Rückwärts rechnen hilft: zuerst ${add} abziehen, dann durch ${factor} teilen.'.replace('${add}', add).replace('${factor}', factor),
          [`Gleichung: ${factor}x + ${add} = ${total}.`, `${add} abziehen: ${factor}x = ${total-add}.`, `Durch ${factor} teilen: x = ${x}.`],
          'Du machst die Rechenschritte rückwärts, um zur ursprünglichen Zahl zu kommen.', ['Gleichung','Rückwärts rechnen']);
      }
    },
    {
      id:'math-text-unit-conversion-floor', type:'text-math', topic:'Maßeinheiten', difficulty:'medium', tags:['Einheiten','Fläche','cm m'],
      generate() {
        const lcm = pick([250,300,350,420]); const wm = pick([2,3,4]); const l = lcm/100; const result = round2(l*wm);
        return task('unit-floor', ['mathe'], 'Maßeinheiten', 'medium',
          `Ein schmaler Lagerraum ist ${lcm} cm lang und ${wm} m breit. Wie groß ist die Grundfläche des Lagerraums in Quadratmetern?`,
          'number', result, 'm²', 0.01,
          'Wandle zuerst Zentimeter in Meter um.',
          'Erst gleiche Einheit, dann Fläche berechnen.',
          [`${lcm} cm = ${String(l).replace('.', ',')} m.`, `Fläche: ${String(l).replace('.', ',')} m × ${wm} m = ${String(result).replace('.', ',')} m².`],
          'Die Falle ist die gemischte Einheit: cm und m dürfen nicht direkt multipliziert werden.', ['Einheiten','Fläche','Umwandlung']);
      }
    },
    {
      id:'math-text-average-sales', type:'text-math', topic:'Durchschnitt', difficulty:'medium', tags:['Durchschnitt','Tabelle','Kaufmännisch'],
      generate() {
        const values = pick([[120,150,180,210],[85,95,110,130],[240,260,280,300]]); const sum = values.reduce((a,b)=>a+b,0); const avg = round2(sum/values.length);
        return task('average-sales', ['mathe','kaufmaennisch'], 'Durchschnitt', 'medium',
          `Ein kleiner Verkaufsstand erzielt an vier Tagen folgende Umsätze: Montag ${formatEuro(values[0])}, Dienstag ${formatEuro(values[1])}, Mittwoch ${formatEuro(values[2])}, Donnerstag ${formatEuro(values[3])}. Wie hoch war der durchschnittliche Umsatz pro Tag?`,
          'number', avg, '€', 0.02,
          'Addiere alle Umsätze und teile durch die Anzahl der Tage.',
          'Durchschnitt = Summe ÷ Anzahl.',
          [`Summe: ${values.join(' + ')} = ${sum}.`, `Anzahl der Tage: 4.`, `Durchschnitt: ${sum} ÷ 4 = ${avg}.`],
          'Beim Durchschnitt musst du durch die Anzahl der Werte teilen, nicht durch irgendeine Zahl aus der Aufgabe.', ['Durchschnitt','Addition','Kaufmännisch']);
      }
    }
  ];

  function task(prefix, branch, topic, difficulty, question, answerType, correctAnswer, unit, acceptedTolerance, hint, trick, steps, explanation, checks) {
    return { id: makeId(prefix), branch, module:'lernen-mathe', topic, difficulty, question, answerType, correctAnswer, unit, acceptedTolerance, hint, trick, steps, explanation, checks };
  }
  function pick(values) { return values[Math.floor(Math.random() * values.length)]; }
  function round2(n) { return Math.round(n * 100) / 100; }
  function formatEuro(n) { return `${String(round2(n)).replace('.', ',')} €`; }
  function makeId(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }

  window.EGT_LEARNING_MATH_TASK_TEMPLATES = (window.EGT_LEARNING_MATH_TASK_TEMPLATES || []).concat(extraTemplates);
})();
