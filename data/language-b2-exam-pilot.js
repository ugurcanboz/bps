/* Language Academy · Phase 38D.7
   B2 Gesamt-QA bestätigt: 8 Lesen × 8 Hören × 8 Grammatik × 8 Schreiben × 8 Sprechen.
   Keine API-Keys. Groq bleibt nur Mitprüfer für Schreiben/Sprechen. */
(function(){
  'use strict';
  var VERSION = 'G54.38D.7-b2-total-qa-pool';
  function freezeList(list){ return Object.freeze(list.map(function(x){ return Object.freeze(x); })); }
  function pick(pool, seed, offset){
    var s = String(seed || 'b2');
    var n = offset || 0;
    for(var i=0;i<s.length;i++){ n = (n * 31 + s.charCodeAt(i)) >>> 0; }
    return pool[n % pool.length];
  }
  var readingPool = freezeList([
  {
    "id": "b2-reading-digital-work-hard",
    "variantTitle": "B2 Lesen A · Digitale Weiterbildung/Arbeitswelt",
    "title": "Lesen · B2 Hardmode · Digitale Weiterbildung",
    "durationMinutes": 50,
    "intro": "Lies die Texte prüfungsnah. B2-Hardmode prüft Hauptaussage, indirekte Bedeutung, Autorabsicht, Argumentationsstruktur und plausible Ablenker.",
    "difficulty": "B2-hard",
    "readingSkills": [
      "Hauptaussage",
      "Detailverständnis",
      "indirekte Aussage",
      "Autorabsicht",
      "Argumentationsstruktur",
      "Wortbedeutung im Kontext"
    ],
    "texts": [
      {
        "title": "Sachtext: Weiterbildung im Betrieb",
        "body": "Viele Unternehmen setzen inzwischen digitale Lernplattformen ein. Sie versprechen flexible Lernzeiten, schnelle Aktualisierung von Inhalten und bessere Vergleichbarkeit von Lernfortschritten. In der Praxis zeigt sich jedoch, dass technische Lösungen nur dann wirksam sind, wenn Beschäftigte feste Lernfenster, Rückmeldung und eine klare Verbindung zu realen Arbeitsaufgaben erhalten. Besonders Mitarbeitende mit hoher Arbeitsbelastung brechen reine Selbstlernangebote häufiger ab."
      },
      {
        "title": "Kommentar: Plattform ist nicht gleich Lernkultur",
        "body": "Eine Lernplattform kann Weiterbildung erleichtern, aber sie ersetzt keine Lernkultur. Wer nur Software kauft, ohne Zeit, Betreuung und realistische Ziele zu schaffen, verwechselt Ausstattung mit Bildung. Gleichzeitig wäre es falsch, digitale Angebote pauschal abzulehnen: Richtig eingesetzt können sie Präsenzlernen ergänzen und Beschäftigte unabhängiger machen."
      }
    ],
    "questions": [
      {
        "id": "b2rdw1",
        "question": "Welche Hauptaussage passt am besten zum Sachtext?",
        "options": [
          [
            "a",
            "Digitale Plattformen lösen Weiterbildungsprobleme automatisch."
          ],
          [
            "b",
            "Digitale Weiterbildung kann wirken, braucht aber organisatorische Rahmenbedingungen."
          ],
          [
            "c",
            "Selbstlernangebote sind grundsätzlich besser als Präsenzunterricht."
          ],
          [
            "d",
            "Beschäftigte mit hoher Arbeitsbelastung lernen immer schneller."
          ]
        ],
        "correct": "b",
        "explanation": "Der Text nennt Chancen, aber betont klare Bedingungen.",
        "skill": "Hauptaussage"
      },
      {
        "id": "b2rdw2",
        "question": "Was kritisiert der Kommentar ausdrücklich?",
        "options": [
          [
            "a",
            "Dass digitale Angebote überhaupt existieren."
          ],
          [
            "b",
            "Dass Betriebe Ausstattung mit echter Bildung verwechseln können."
          ],
          [
            "c",
            "Dass Präsenzlernen immer unnötig ist."
          ],
          [
            "d",
            "Dass Lernziele grundsätzlich nicht messbar sind."
          ]
        ],
        "correct": "b",
        "explanation": "Die Formulierung „verwechselt Ausstattung mit Bildung“ ist zentral.",
        "skill": "Autorabsicht"
      },
      {
        "id": "b2rdw3",
        "question": "Welche Gruppe hat laut Sachtext ein besonderes Risiko?",
        "options": [
          [
            "a",
            "Beschäftigte mit hoher Arbeitsbelastung."
          ],
          [
            "b",
            "Nur Führungskräfte."
          ],
          [
            "c",
            "Nur Auszubildende im ersten Jahr."
          ],
          [
            "d",
            "Menschen, die ausschließlich im Homeoffice arbeiten."
          ]
        ],
        "correct": "a",
        "explanation": "Der Sachtext nennt Mitarbeitende mit hoher Arbeitsbelastung.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rdw4",
        "question": "Welche Maßnahme entspricht der Argumentation beider Texte?",
        "options": [
          [
            "a",
            "Eine Plattform einführen und Lernzeit dem Zufall überlassen."
          ],
          [
            "b",
            "Feste Lernfenster und Rückmeldung organisieren."
          ],
          [
            "c",
            "Präsenzlernen vollständig verbieten."
          ],
          [
            "d",
            "Lernfortschritte nicht überprüfen."
          ]
        ],
        "correct": "b",
        "explanation": "Beide Texte betonen Rahmen, Betreuung und Ziele.",
        "skill": "Schlussfolgerung"
      },
      {
        "id": "b2rdw5",
        "question": "Was bedeutet „Ausstattung mit Bildung verwechseln“ im Kontext?",
        "options": [
          [
            "a",
            "Technik wird fälschlich als ausreichende Bildungsmaßnahme betrachtet."
          ],
          [
            "b",
            "Bildung soll ohne Geräte stattfinden."
          ],
          [
            "c",
            "Ausstattung ist wichtiger als Lernziele."
          ],
          [
            "d",
            "Software kann keine Inhalte enthalten."
          ]
        ],
        "correct": "a",
        "explanation": "Es geht um den Irrtum, dass Technik allein Lernen schafft.",
        "skill": "Wortbedeutung"
      },
      {
        "id": "b2rdw6",
        "question": "Welche Haltung nimmt der Kommentar ein?",
        "options": [
          [
            "a",
            "Pauschal ablehnend."
          ],
          [
            "b",
            "Differenziert abwägend."
          ],
          [
            "c",
            "Rein werbend."
          ],
          [
            "d",
            "Ironisch ohne Argument."
          ]
        ],
        "correct": "b",
        "explanation": "Er kritisiert falschen Einsatz, lehnt digitale Angebote aber nicht pauschal ab.",
        "skill": "Ton/Haltung"
      },
      {
        "id": "b2rdw7",
        "question": "Welche indirekte Aussage ist zutreffend?",
        "options": [
          [
            "a",
            "Lernerfolg hängt auch von Arbeitsorganisation ab."
          ],
          [
            "b",
            "Lernplattformen sollten nur privat genutzt werden."
          ],
          [
            "c",
            "Beschäftigte brauchen keine Rückmeldung."
          ],
          [
            "d",
            "Digitale Inhalte dürfen nie aktualisiert werden."
          ]
        ],
        "correct": "a",
        "explanation": "Die Bedeutung von Lernfenstern und Rückmeldung zeigt organisatorische Abhängigkeit.",
        "skill": "Indirekte Aussage"
      },
      {
        "id": "b2rdw8",
        "question": "Welche Überschrift passt am besten?",
        "options": [
          [
            "a",
            "Digitale Weiterbildung: Chance mit Bedingungen"
          ],
          [
            "b",
            "Warum Weiterbildung abgeschafft werden sollte"
          ],
          [
            "c",
            "Software ersetzt jede Lehrkraft"
          ],
          [
            "d",
            "Arbeitsbelastung ist kein Thema beim Lernen"
          ]
        ],
        "correct": "a",
        "explanation": "Sie fasst Chancen und Bedingungen zusammen.",
        "skill": "Zusammenfassung"
      }
    ],
    "passScore": 76,
    "hardFailHints": [
      "Nur Einzelwörter erkennen reicht nicht.",
      "Plausible Ablenker sind bewusst nah am Text.",
      "Unter 70 % im Lesen ist für den Academy-Hartmodus kritisch."
    ]
  },
  {
    "id": "b2-reading-city-mobility-hard",
    "variantTitle": "B2 Lesen B · Mobilität/Stadtentwicklung",
    "title": "Lesen · B2 Hardmode · Stadt und Mobilität",
    "durationMinutes": 50,
    "intro": "Lies die Texte prüfungsnah. B2-Hardmode prüft Hauptaussage, indirekte Bedeutung, Autorabsicht, Argumentationsstruktur und plausible Ablenker.",
    "difficulty": "B2-hard",
    "readingSkills": [
      "Hauptaussage",
      "Detailverständnis",
      "indirekte Aussage",
      "Autorabsicht",
      "Argumentationsstruktur",
      "Wortbedeutung im Kontext"
    ],
    "texts": [
      {
        "title": "Informationsartikel: Neue Verkehrskonzepte",
        "body": "Mehrere Städte erproben Konzepte, die den Autoverkehr in Innenstädten reduzieren sollen. Dazu zählen Fahrradstraßen, dichtere Busverbindungen und höhere Parkgebühren. Die Verwaltungen versprechen sich weniger Lärm, bessere Luft und attraktivere Aufenthaltsräume. Kritikerinnen und Kritiker befürchten jedoch, dass Menschen aus dem Umland sowie körperlich eingeschränkte Personen benachteiligt werden, wenn Alternativen nicht zuverlässig funktionieren."
      },
      {
        "title": "Kommentar: Mobilität braucht Ausgleich",
        "body": "Eine lebenswerte Stadt entsteht nicht durch möglichst viele Parkplätze, sondern durch sichere und zugängliche Wege. Trotzdem darf Verkehrspolitik nicht moralisch bequem werden. Wer auf dem Land wohnt, Schicht arbeitet oder körperlich eingeschränkt ist, kann nicht einfach auf das Fahrrad verwiesen werden. Eine faire Mobilitätswende muss deshalb Angebote schaffen, bevor sie Verbote verschärft."
      }
    ],
    "questions": [
      {
        "id": "b2rcm1",
        "question": "Welches Ziel nennen die Verwaltungen?",
        "options": [
          [
            "a",
            "Mehr Autoverkehr in Wohngebieten."
          ],
          [
            "b",
            "Weniger Lärm, bessere Luft und attraktivere Räume."
          ],
          [
            "c",
            "Abschaffung aller Buslinien."
          ],
          [
            "d",
            "Kostenlose Parkplätze in Innenstädten."
          ]
        ],
        "correct": "b",
        "explanation": "Diese Ziele stehen im Informationsartikel.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rcm2",
        "question": "Was kritisiert der Kommentar am ehesten?",
        "options": [
          [
            "a",
            "Dass Verkehrspolitik soziale Unterschiede ignorieren kann."
          ],
          [
            "b",
            "Dass sichere Wege unwichtig sind."
          ],
          [
            "c",
            "Dass Fahrradstraßen immer verboten sein sollten."
          ],
          [
            "d",
            "Dass Parkplätze grundsätzlich keine Rolle spielen."
          ]
        ],
        "correct": "a",
        "explanation": "Der Kommentar warnt vor moralisch bequemer Politik ohne Alternativen.",
        "skill": "Autorabsicht"
      },
      {
        "id": "b2rcm3",
        "question": "Welche Aussage ist eine passende Schlussfolgerung?",
        "options": [
          [
            "a",
            "Maßnahmen sollten mit zuverlässigen Alternativen verbunden werden."
          ],
          [
            "b",
            "Verbote sollten immer vor Angeboten kommen."
          ],
          [
            "c",
            "Menschen aus dem Umland sind irrelevant."
          ],
          [
            "d",
            "Schichtarbeit erleichtert Fahrradfahren grundsätzlich."
          ]
        ],
        "correct": "a",
        "explanation": "Der Text fordert Angebote, bevor Verbote verschärft werden.",
        "skill": "Schlussfolgerung"
      },
      {
        "id": "b2rcm4",
        "question": "Was bedeutet „moralisch bequem“ im Kontext?",
        "options": [
          [
            "a",
            "Eine Haltung, die sich richtig anfühlt, aber praktische Probleme anderer ausblendet."
          ],
          [
            "b",
            "Eine besonders genaue Kostenrechnung."
          ],
          [
            "c",
            "Eine neutrale Beschreibung ohne Wertung."
          ],
          [
            "d",
            "Ein Verbot von moralischen Argumenten."
          ]
        ],
        "correct": "a",
        "explanation": "Gemeint ist eine scheinbar richtige, aber vereinfachende Haltung.",
        "skill": "Wortbedeutung"
      },
      {
        "id": "b2rcm5",
        "question": "Welche Gruppe wird in beiden Texten als gefährdet genannt?",
        "options": [
          [
            "a",
            "Körperlich eingeschränkte Personen."
          ],
          [
            "b",
            "Nur Touristinnen und Touristen."
          ],
          [
            "c",
            "Nur Autofirmen."
          ],
          [
            "d",
            "Menschen ohne Führerschein."
          ]
        ],
        "correct": "a",
        "explanation": "Beide Texte nennen körperlich eingeschränkte Personen.",
        "skill": "Detailvergleich"
      },
      {
        "id": "b2rcm6",
        "question": "Welche Position vertritt der Kommentar?",
        "options": [
          [
            "a",
            "Mobilitätswende ja, aber sozial und praktisch abgesichert."
          ],
          [
            "b",
            "Innenstädte sollten nur für Autos geplant werden."
          ],
          [
            "c",
            "Alle Menschen sollen ohne Ausnahme Fahrrad fahren."
          ],
          [
            "d",
            "Busverbindungen spielen keine Rolle."
          ]
        ],
        "correct": "a",
        "explanation": "Der Kommentar unterstützt sichere Wege, fordert aber Ausgleich.",
        "skill": "Hauptaussage"
      },
      {
        "id": "b2rcm7",
        "question": "Welche Maßnahme wäre laut Kommentar problematisch?",
        "options": [
          [
            "a",
            "Parkplätze streichen, ohne Busse oder Alternativen zu verbessern."
          ],
          [
            "b",
            "Busverbindungen ausbauen."
          ],
          [
            "c",
            "Zugängliche Wege schaffen."
          ],
          [
            "d",
            "Betroffene Gruppen berücksichtigen."
          ]
        ],
        "correct": "a",
        "explanation": "Verbote ohne vorherige Angebote werden kritisiert.",
        "skill": "Anwendung"
      },
      {
        "id": "b2rcm8",
        "question": "Welche Textsorte hat der zweite Text?",
        "options": [
          [
            "a",
            "Kommentar mit wertender Argumentation."
          ],
          [
            "b",
            "Gebrauchsanweisung."
          ],
          [
            "c",
            "Privater Brief."
          ],
          [
            "d",
            "Statistische Tabelle ohne Meinung."
          ]
        ],
        "correct": "a",
        "explanation": "Er bewertet und argumentiert.",
        "skill": "Textsorte"
      }
    ],
    "passScore": 76,
    "hardFailHints": [
      "Nur Einzelwörter erkennen reicht nicht.",
      "Plausible Ablenker sind bewusst nah am Text.",
      "Unter 70 % im Lesen ist für den Academy-Hartmodus kritisch."
    ]
  },
  {
    "id": "b2-reading-ai-education-hard",
    "variantTitle": "B2 Lesen C · KI/Bildung",
    "title": "Lesen · B2 Hardmode · KI im Lernen",
    "durationMinutes": 50,
    "intro": "Lies die Texte prüfungsnah. B2-Hardmode prüft Hauptaussage, indirekte Bedeutung, Autorabsicht, Argumentationsstruktur und plausible Ablenker.",
    "difficulty": "B2-hard",
    "readingSkills": [
      "Hauptaussage",
      "Detailverständnis",
      "indirekte Aussage",
      "Autorabsicht",
      "Argumentationsstruktur",
      "Wortbedeutung im Kontext"
    ],
    "texts": [
      {
        "title": "Bericht: Adaptive Lernsysteme",
        "body": "Künstliche Intelligenz wird zunehmend in Lernprogrammen eingesetzt. Sie kann Aufgaben an den Leistungsstand anpassen, Fehler schneller sichtbar machen und Lernende gezielt wiederholen lassen. Gleichzeitig besteht die Gefahr, dass Lernende Rückmeldungen akzeptieren, ohne sie zu verstehen. Pädagogische Verantwortung bleibt deshalb wichtig: Ziele, Datenschutz und Bewertung dürfen nicht allein durch Systeme bestimmt werden."
      },
      {
        "title": "Kritische Einschätzung",
        "body": "KI im Unterricht ist weder Heilsversprechen noch Katastrophe. Entscheidend ist die Transparenz. Wenn Lernende wissen, warum sie eine bestimmte Rückmeldung erhalten, kann KI Selbstständigkeit fördern. Wenn Bewertung dagegen undurchsichtig bleibt, entsteht Abhängigkeit von automatischen Urteilen. Lehrkräfte werden nicht ersetzt, sondern müssen neue Kontroll- und Erklärrollen übernehmen."
      }
    ],
    "questions": [
      {
        "id": "b2rai1",
        "question": "Welche Chance nennt der Bericht?",
        "options": [
          [
            "a",
            "Aufgaben können an den Leistungsstand angepasst werden."
          ],
          [
            "b",
            "Bewertung muss nie erklärt werden."
          ],
          [
            "c",
            "Datenschutz wird unwichtig."
          ],
          [
            "d",
            "Lehrkräfte verschwinden vollständig."
          ]
        ],
        "correct": "a",
        "explanation": "Adaptive Aufgaben werden direkt genannt.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rai2",
        "question": "Was ist laut beiden Texten besonders wichtig?",
        "options": [
          [
            "a",
            "Transparenz und pädagogische Verantwortung."
          ],
          [
            "b",
            "Blindes Vertrauen in automatische Urteile."
          ],
          [
            "c",
            "Abschaffung aller Lernziele."
          ],
          [
            "d",
            "Nur technische Geschwindigkeit."
          ]
        ],
        "correct": "a",
        "explanation": "Beide Texte betonen Verantwortung und Transparenz.",
        "skill": "Synthese"
      },
      {
        "id": "b2rai3",
        "question": "Welche Gefahr beschreibt der Bericht?",
        "options": [
          [
            "a",
            "Lernende akzeptieren Rückmeldungen, ohne sie zu verstehen."
          ],
          [
            "b",
            "Lernende bekommen zu wenig Aufgaben."
          ],
          [
            "c",
            "KI kann keine Fehler erkennen."
          ],
          [
            "d",
            "Wiederholung ist immer schädlich."
          ]
        ],
        "correct": "a",
        "explanation": "Das steht ausdrücklich im Bericht.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rai4",
        "question": "Welche Haltung zeigt die kritische Einschätzung?",
        "options": [
          [
            "a",
            "Ausgewogen und bedingungsorientiert."
          ],
          [
            "b",
            "Nur euphorisch."
          ],
          [
            "c",
            "Nur ablehnend."
          ],
          [
            "d",
            "Völlig themenfremd."
          ]
        ],
        "correct": "a",
        "explanation": "„weder Heilsversprechen noch Katastrophe“ ist abwägend.",
        "skill": "Haltung"
      },
      {
        "id": "b2rai5",
        "question": "Was bedeutet „undurchsichtig“ im Kontext?",
        "options": [
          [
            "a",
            "Nicht nachvollziehbar oder nicht erklärbar."
          ],
          [
            "b",
            "Besonders langsam."
          ],
          [
            "c",
            "Völlig kostenlos."
          ],
          [
            "d",
            "Für alle sichtbar."
          ]
        ],
        "correct": "a",
        "explanation": "Es geht um fehlende Nachvollziehbarkeit von Bewertung.",
        "skill": "Wortbedeutung"
      },
      {
        "id": "b2rai6",
        "question": "Welche neue Rolle von Lehrkräften wird genannt?",
        "options": [
          [
            "a",
            "Kontroll- und Erklärrollen."
          ],
          [
            "b",
            "Nur technische Reparatur."
          ],
          [
            "c",
            "Keine Rolle mehr."
          ],
          [
            "d",
            "Ausschließlich Verwaltung von Noten."
          ]
        ],
        "correct": "a",
        "explanation": "Der zweite Text nennt Kontroll- und Erklärrollen.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rai7",
        "question": "Welche Aussage wäre eine unzulässige Vereinfachung?",
        "options": [
          [
            "a",
            "KI ersetzt Lehrkräfte vollständig."
          ],
          [
            "b",
            "KI kann Selbstständigkeit fördern."
          ],
          [
            "c",
            "Bewertung braucht Transparenz."
          ],
          [
            "d",
            "Datenschutz bleibt relevant."
          ]
        ],
        "correct": "a",
        "explanation": "Diese pauschale Aussage widerspricht dem Text.",
        "skill": "Ablenkererkennung"
      },
      {
        "id": "b2rai8",
        "question": "Was ist die Kernaussage beider Texte zusammen?",
        "options": [
          [
            "a",
            "KI kann Lernen unterstützen, braucht aber klare pädagogische Kontrolle."
          ],
          [
            "b",
            "KI ist grundsätzlich gefährlich und nutzlos."
          ],
          [
            "c",
            "Lernen soll nur automatisch bewertet werden."
          ],
          [
            "d",
            "Datenschutz ist bei Lernprogrammen kein Thema."
          ]
        ],
        "correct": "a",
        "explanation": "Das ist die beste Zusammenfassung.",
        "skill": "Zusammenfassung"
      }
    ],
    "passScore": 76,
    "hardFailHints": [
      "Nur Einzelwörter erkennen reicht nicht.",
      "Plausible Ablenker sind bewusst nah am Text.",
      "Unter 70 % im Lesen ist für den Academy-Hartmodus kritisch."
    ]
  },
  {
    "id": "b2-reading-health-work-hard",
    "variantTitle": "B2 Lesen D · Gesundheit/Arbeitswelt",
    "title": "Lesen · B2 Hardmode · Gesundheit am Arbeitsplatz",
    "durationMinutes": 50,
    "intro": "Lies die Texte prüfungsnah. B2-Hardmode prüft Hauptaussage, indirekte Bedeutung, Autorabsicht, Argumentationsstruktur und plausible Ablenker.",
    "difficulty": "B2-hard",
    "readingSkills": [
      "Hauptaussage",
      "Detailverständnis",
      "indirekte Aussage",
      "Autorabsicht",
      "Argumentationsstruktur",
      "Wortbedeutung im Kontext"
    ],
    "texts": [
      {
        "title": "Sachtext: Betriebliche Gesundheit",
        "body": "Immer mehr Betriebe bieten Programme zur Gesundheitsförderung an: Sportkurse, Stressberatung oder ergonomische Arbeitsplätze. Solche Angebote können Fehlzeiten reduzieren und die Zufriedenheit erhöhen. Kritisch wird es jedoch, wenn Verantwortung einseitig auf Beschäftigte verlagert wird. Wer dauerhaft unter Personalmangel, Zeitdruck oder schlechter Planung leidet, profitiert nur begrenzt von einem Yogakurs in der Mittagspause."
      },
      {
        "title": "Kommentar: Mehr als Symbolpolitik",
        "body": "Gesundheitsangebote sind sinnvoll, solange sie strukturelle Probleme nicht verdecken. Ein Unternehmen, das Überlastung organisiert und anschließend Entspannungsseminare anbietet, bekämpft Symptome statt Ursachen. Glaubwürdige Gesundheitsförderung beginnt bei Arbeitsbedingungen: realistische Planung, ausreichendes Personal und eine Kultur, in der Überlastung ausgesprochen werden darf."
      }
    ],
    "questions": [
      {
        "id": "b2rhw1",
        "question": "Was nennt der Sachtext als möglichen Vorteil von Gesundheitsprogrammen?",
        "options": [
          [
            "a",
            "Weniger Fehlzeiten und höhere Zufriedenheit."
          ],
          [
            "b",
            "Mehr unbezahlte Überstunden."
          ],
          [
            "c",
            "Abschaffung ergonomischer Arbeitsplätze."
          ],
          [
            "d",
            "Weniger Planung."
          ]
        ],
        "correct": "a",
        "explanation": "Diese Vorteile werden genannt.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rhw2",
        "question": "Wann werden Gesundheitsangebote laut Text problematisch?",
        "options": [
          [
            "a",
            "Wenn sie strukturelle Probleme ersetzen oder verdecken."
          ],
          [
            "b",
            "Wenn sie ergonomische Möbel enthalten."
          ],
          [
            "c",
            "Wenn Beschäftigte Beratung erhalten."
          ],
          [
            "d",
            "Wenn Sportkurse freiwillig sind."
          ]
        ],
        "correct": "a",
        "explanation": "Beide Texte kritisieren Symbolpolitik und Ursachenverdrängung.",
        "skill": "Hauptaussage"
      },
      {
        "id": "b2rhw3",
        "question": "Was bedeutet „Symptome statt Ursachen“?",
        "options": [
          [
            "a",
            "Man behandelt Folgen, aber nicht die eigentlichen Probleme."
          ],
          [
            "b",
            "Man löst die Grundprobleme direkt."
          ],
          [
            "c",
            "Man vermeidet jede Gesundheitsmaßnahme."
          ],
          [
            "d",
            "Man schafft Arbeitsbedingungen ab."
          ]
        ],
        "correct": "a",
        "explanation": "Der Kommentar unterscheidet Folgen und Ursachen.",
        "skill": "Wortbedeutung"
      },
      {
        "id": "b2rhw4",
        "question": "Welche Ursache wird ausdrücklich genannt?",
        "options": [
          [
            "a",
            "Personalmangel und Zeitdruck."
          ],
          [
            "b",
            "Zu viele Pausen."
          ],
          [
            "c",
            "Zu hohe Zufriedenheit."
          ],
          [
            "d",
            "Zu wenig Sportwerbung."
          ]
        ],
        "correct": "a",
        "explanation": "Personalmangel und Zeitdruck stehen im Sachtext.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rhw5",
        "question": "Welche Maßnahme wäre laut Kommentar glaubwürdig?",
        "options": [
          [
            "a",
            "Realistische Planung und ausreichend Personal."
          ],
          [
            "b",
            "Nur ein Entspannungsseminar trotz Überlastung."
          ],
          [
            "c",
            "Mehr Druck ohne Mitsprache."
          ],
          [
            "d",
            "Überlastung verschweigen."
          ]
        ],
        "correct": "a",
        "explanation": "Diese Punkte nennt der Kommentar als Grundlage.",
        "skill": "Anwendung"
      },
      {
        "id": "b2rhw6",
        "question": "Welche Kritik steckt in „Yogakurs in der Mittagspause“?",
        "options": [
          [
            "a",
            "Ein kleines Angebot kann strukturelle Überlastung nicht ausgleichen."
          ],
          [
            "b",
            "Yoga ist grundsätzlich verboten."
          ],
          [
            "c",
            "Mittagspausen sollen abgeschafft werden."
          ],
          [
            "d",
            "Sport ist immer schädlich."
          ]
        ],
        "correct": "a",
        "explanation": "Es geht um begrenzte Wirkung bei strukturellen Problemen.",
        "skill": "Indirekte Aussage"
      },
      {
        "id": "b2rhw7",
        "question": "Welche Haltung zeigen die Texte gegenüber Gesundheitsangeboten?",
        "options": [
          [
            "a",
            "Grundsätzlich offen, aber kritisch bei falschem Einsatz."
          ],
          [
            "b",
            "Völlig ablehnend."
          ],
          [
            "c",
            "Uneingeschränkt begeistert."
          ],
          [
            "d",
            "Nur wirtschaftlich ohne Menschenbezug."
          ]
        ],
        "correct": "a",
        "explanation": "Angebote sind sinnvoll, aber nicht als Ersatz für bessere Bedingungen.",
        "skill": "Haltung"
      },
      {
        "id": "b2rhw8",
        "question": "Welche Überschrift passt am besten?",
        "options": [
          [
            "a",
            "Gesundheit im Betrieb: Angebote reichen nicht aus"
          ],
          [
            "b",
            "Warum Betriebe keinen Arbeitsschutz brauchen"
          ],
          [
            "c",
            "Sport ersetzt Personalplanung"
          ],
          [
            "d",
            "Stressberatung löst alle Probleme"
          ]
        ],
        "correct": "a",
        "explanation": "Die Überschrift trifft Kern und Kritik.",
        "skill": "Zusammenfassung"
      }
    ],
    "passScore": 76,
    "hardFailHints": [
      "Nur Einzelwörter erkennen reicht nicht.",
      "Plausible Ablenker sind bewusst nah am Text.",
      "Unter 70 % im Lesen ist für den Academy-Hartmodus kritisch."
    ]
  },
  {
    "id": "b2-reading-housing-hard",
    "variantTitle": "B2 Lesen E · Wohnen/Mietmarkt",
    "title": "Lesen · B2 Hardmode · Wohnen und soziale Folgen",
    "durationMinutes": 50,
    "intro": "Lies die Texte prüfungsnah. B2-Hardmode prüft Hauptaussage, indirekte Bedeutung, Autorabsicht, Argumentationsstruktur und plausible Ablenker.",
    "difficulty": "B2-hard",
    "readingSkills": [
      "Hauptaussage",
      "Detailverständnis",
      "indirekte Aussage",
      "Autorabsicht",
      "Argumentationsstruktur",
      "Wortbedeutung im Kontext"
    ],
    "texts": [
      {
        "title": "Bericht: Wohnraummangel",
        "body": "In vielen Städten steigen Mieten schneller als Einkommen. Besonders betroffen sind Studierende, Alleinerziehende und Menschen mit befristeten Arbeitsverträgen. Neubau allein löst das Problem nicht sofort, weil Planungsverfahren lange dauern und neue Wohnungen häufig im höheren Preissegment entstehen. Kommunen setzen deshalb auf Sozialwohnungen, Zweckentfremdungsverbote und Unterstützung für genossenschaftliche Modelle."
      },
      {
        "title": "Meinungsbeitrag",
        "body": "Wohnen darf nicht ausschließlich als Marktfrage behandelt werden. Wer keine stabile Wohnung findet, hat schlechtere Chancen auf Ausbildung, Arbeit und soziale Teilhabe. Gleichzeitig greifen einfache Schuldzuweisungen zu kurz: Auch Baukosten, Flächenknappheit und Bürokratie spielen eine Rolle. Entscheidend ist eine Kombination aus schnellerem Bauen, sozialer Bindung und Schutz vor spekulativem Leerstand."
      }
    ],
    "questions": [
      {
        "id": "b2rh1",
        "question": "Welche Gruppe wird im Bericht als besonders betroffen genannt?",
        "options": [
          [
            "a",
            "Alleinerziehende."
          ],
          [
            "b",
            "Nur Eigentümerinnen."
          ],
          [
            "c",
            "Nur Rentner mit Eigentum."
          ],
          [
            "d",
            "Menschen ohne Interesse an Städten."
          ]
        ],
        "correct": "a",
        "explanation": "Alleinerziehende werden direkt genannt.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rh2",
        "question": "Warum löst Neubau das Problem nicht sofort?",
        "options": [
          [
            "a",
            "Planungsverfahren dauern lange und neue Wohnungen sind oft teuer."
          ],
          [
            "b",
            "Weil niemand Wohnungen braucht."
          ],
          [
            "c",
            "Weil Kommunen keine Instrumente haben."
          ],
          [
            "d",
            "Weil Einkommen schneller steigen als Mieten."
          ]
        ],
        "correct": "a",
        "explanation": "Das steht im Bericht.",
        "skill": "Kausalität"
      },
      {
        "id": "b2rh3",
        "question": "Welche Position vertritt der Meinungsbeitrag?",
        "options": [
          [
            "a",
            "Wohnen hat soziale Bedeutung und braucht mehrere Lösungsansätze."
          ],
          [
            "b",
            "Wohnen ist nur eine private Luxusfrage."
          ],
          [
            "c",
            "Baukosten spielen keine Rolle."
          ],
          [
            "d",
            "Nur ein einzelnes Verbot genügt immer."
          ]
        ],
        "correct": "a",
        "explanation": "Der Text verbindet soziale Folgen mit mehreren Ursachen/Lösungen.",
        "skill": "Hauptaussage"
      },
      {
        "id": "b2rh4",
        "question": "Was bedeutet „soziale Teilhabe“ im Kontext?",
        "options": [
          [
            "a",
            "Am gesellschaftlichen Leben teilnehmen können."
          ],
          [
            "b",
            "Nur Miete bezahlen."
          ],
          [
            "c",
            "Ein Haus besitzen."
          ],
          [
            "d",
            "Bürokratie erhöhen."
          ]
        ],
        "correct": "a",
        "explanation": "Der Begriff meint Beteiligung am gesellschaftlichen Leben.",
        "skill": "Wortbedeutung"
      },
      {
        "id": "b2rh5",
        "question": "Welche Lösung wird NICHT genannt?",
        "options": [
          [
            "a",
            "Abschaffung aller Mietverträge."
          ],
          [
            "b",
            "Sozialwohnungen."
          ],
          [
            "c",
            "Zweckentfremdungsverbote."
          ],
          [
            "d",
            "Genossenschaftliche Modelle."
          ]
        ],
        "correct": "a",
        "explanation": "Diese radikale Maßnahme wird nicht genannt.",
        "skill": "Detailvergleich"
      },
      {
        "id": "b2rh6",
        "question": "Welche Aussage zeigt Differenzierung?",
        "options": [
          [
            "a",
            "Baukosten, Flächenknappheit und Bürokratie spielen ebenfalls eine Rolle."
          ],
          [
            "b",
            "Nur Vermieter sind immer schuld."
          ],
          [
            "c",
            "Neubau ist völlig sinnlos."
          ],
          [
            "d",
            "Wohnen hat keinen Einfluss auf Arbeit."
          ]
        ],
        "correct": "a",
        "explanation": "Der Meinungsbeitrag vermeidet einfache Schuldzuweisungen.",
        "skill": "Differenzierung"
      },
      {
        "id": "b2rh7",
        "question": "Welche indirekte Folge instabilen Wohnens wird genannt?",
        "options": [
          [
            "a",
            "Schlechtere Chancen auf Ausbildung und Arbeit."
          ],
          [
            "b",
            "Bessere Kreditbedingungen."
          ],
          [
            "c",
            "Mehr Freizeit."
          ],
          [
            "d",
            "Automatisch höhere Einkommen."
          ]
        ],
        "correct": "a",
        "explanation": "Der Meinungsbeitrag nennt Ausbildung, Arbeit und Teilhabe.",
        "skill": "Indirekte Aussage"
      },
      {
        "id": "b2rh8",
        "question": "Welche Überschrift passt am besten?",
        "options": [
          [
            "a",
            "Wohnraummangel braucht soziale und praktische Lösungen"
          ],
          [
            "b",
            "Mieten steigen nie schneller als Einkommen"
          ],
          [
            "c",
            "Neubau löst alles sofort"
          ],
          [
            "d",
            "Bürokratie ist das einzige Problem"
          ]
        ],
        "correct": "a",
        "explanation": "Sie fasst die differenzierte Lösungslogik zusammen.",
        "skill": "Zusammenfassung"
      }
    ],
    "passScore": 76,
    "hardFailHints": [
      "Nur Einzelwörter erkennen reicht nicht.",
      "Plausible Ablenker sind bewusst nah am Text.",
      "Unter 70 % im Lesen ist für den Academy-Hartmodus kritisch."
    ]
  },
  {
    "id": "b2-reading-work-life-hard",
    "variantTitle": "B2 Lesen F · Arbeit/Flexibilität",
    "title": "Lesen · B2 Hardmode · Flexible Arbeit",
    "durationMinutes": 50,
    "intro": "Lies die Texte prüfungsnah. B2-Hardmode prüft Hauptaussage, indirekte Bedeutung, Autorabsicht, Argumentationsstruktur und plausible Ablenker.",
    "difficulty": "B2-hard",
    "readingSkills": [
      "Hauptaussage",
      "Detailverständnis",
      "indirekte Aussage",
      "Autorabsicht",
      "Argumentationsstruktur",
      "Wortbedeutung im Kontext"
    ],
    "texts": [
      {
        "title": "Analyse: Vier-Tage-Woche",
        "body": "Die Vier-Tage-Woche wird häufig als Antwort auf Fachkräftemangel und Stress diskutiert. Studien aus einzelnen Pilotprojekten zeigen, dass Produktivität stabil bleiben kann, wenn Prozesse verbessert und Prioritäten klarer gesetzt werden. Übertragbar ist das Modell jedoch nicht automatisch: In Pflege, Logistik oder Gastronomie entstehen andere organisatorische Probleme als in Bürojobs."
      },
      {
        "title": "Kommentar",
        "body": "Die Debatte über kürzere Arbeitszeiten wird oft zu einfach geführt. Wer nur weniger Tage fordert, ohne Arbeitsverdichtung zu beachten, riskiert zusätzlichen Druck. Wer das Modell pauschal ablehnt, übersieht Chancen für Motivation und Gesundheit. Entscheidend ist nicht die Zahl der Tage allein, sondern die Frage, wie Arbeit verteilt, bezahlt und personell abgesichert wird."
      }
    ],
    "questions": [
      {
        "id": "b2rwl1",
        "question": "Welche Bedingung nennt die Analyse für stabile Produktivität?",
        "options": [
          [
            "a",
            "Verbesserte Prozesse und klare Prioritäten."
          ],
          [
            "b",
            "Mehr ungeplante Aufgaben."
          ],
          [
            "c",
            "Weniger Personal in allen Bereichen."
          ],
          [
            "d",
            "Keine Veränderung der Abläufe."
          ]
        ],
        "correct": "a",
        "explanation": "Diese Bedingungen werden genannt.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rwl2",
        "question": "Warum ist das Modell nicht automatisch übertragbar?",
        "options": [
          [
            "a",
            "Branchen haben unterschiedliche organisatorische Bedingungen."
          ],
          [
            "b",
            "Alle Berufe sind identisch."
          ],
          [
            "c",
            "Bürojobs sind immer unproduktiv."
          ],
          [
            "d",
            "Pflege und Logistik brauchen keine Planung."
          ]
        ],
        "correct": "a",
        "explanation": "Der Text nennt Branchenunterschiede.",
        "skill": "Kausalität"
      },
      {
        "id": "b2rwl3",
        "question": "Was kritisiert der Kommentar an einfachen Forderungen?",
        "options": [
          [
            "a",
            "Arbeitsverdichtung kann übersehen werden."
          ],
          [
            "b",
            "Motivation spielt keine Rolle."
          ],
          [
            "c",
            "Gesundheit ist unwichtig."
          ],
          [
            "d",
            "Bezahlung soll ignoriert werden."
          ]
        ],
        "correct": "a",
        "explanation": "Der Kommentar warnt vor zusätzlichem Druck durch Verdichtung.",
        "skill": "Autorabsicht"
      },
      {
        "id": "b2rwl4",
        "question": "Welche Aussage entspricht der Haltung des Kommentars?",
        "options": [
          [
            "a",
            "Abwägen statt pauschal zustimmen oder ablehnen."
          ],
          [
            "b",
            "Vollständige Ablehnung jeder Arbeitszeitreform."
          ],
          [
            "c",
            "Kürzere Arbeitstage lösen alles automatisch."
          ],
          [
            "d",
            "Nur die Zahl der Tage ist relevant."
          ]
        ],
        "correct": "a",
        "explanation": "Der Kommentar ist differenziert.",
        "skill": "Haltung"
      },
      {
        "id": "b2rwl5",
        "question": "Was bedeutet „Arbeitsverdichtung“ im Kontext?",
        "options": [
          [
            "a",
            "Mehr Aufgaben oder Druck in kürzerer Zeit."
          ],
          [
            "b",
            "Entspannung während der Arbeitszeit."
          ],
          [
            "c",
            "Mehr freie Stellen."
          ],
          [
            "d",
            "Weniger Verantwortung."
          ]
        ],
        "correct": "a",
        "explanation": "Der Begriff beschreibt verdichtete Aufgabenlast.",
        "skill": "Wortbedeutung"
      },
      {
        "id": "b2rwl6",
        "question": "Welche Branchen werden als schwierigere Beispiele genannt?",
        "options": [
          [
            "a",
            "Pflege, Logistik und Gastronomie."
          ],
          [
            "b",
            "Nur Banken."
          ],
          [
            "c",
            "Nur Schulen."
          ],
          [
            "d",
            "Nur IT-Berufe."
          ]
        ],
        "correct": "a",
        "explanation": "Diese drei Bereiche werden genannt.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rwl7",
        "question": "Welche Frage ist laut Kommentar entscheidend?",
        "options": [
          [
            "a",
            "Wie Arbeit verteilt, bezahlt und personell abgesichert wird."
          ],
          [
            "b",
            "Wie viele Logos die Kampagne hat."
          ],
          [
            "c",
            "Ob alle Büros geschlossen werden."
          ],
          [
            "d",
            "Ob Pausen abgeschafft werden."
          ]
        ],
        "correct": "a",
        "explanation": "Der letzte Satz nennt diese Entscheidungsfrage.",
        "skill": "Hauptaussage"
      },
      {
        "id": "b2rwl8",
        "question": "Welche Überschrift passt am besten?",
        "options": [
          [
            "a",
            "Vier-Tage-Woche: Chance mit Grenzen"
          ],
          [
            "b",
            "Warum alle Branchen gleich funktionieren"
          ],
          [
            "c",
            "Kürzere Arbeitszeit ohne Planung"
          ],
          [
            "d",
            "Produktivität ist nicht messbar"
          ]
        ],
        "correct": "a",
        "explanation": "Sie trifft Chance und Einschränkung.",
        "skill": "Zusammenfassung"
      }
    ],
    "passScore": 76,
    "hardFailHints": [
      "Nur Einzelwörter erkennen reicht nicht.",
      "Plausible Ablenker sind bewusst nah am Text.",
      "Unter 70 % im Lesen ist für den Academy-Hartmodus kritisch."
    ]
  },
  {
    "id": "b2-reading-climate-consumption-hard",
    "variantTitle": "B2 Lesen G · Klima/Konsum",
    "title": "Lesen · B2 Hardmode · Nachhaltiger Konsum",
    "durationMinutes": 50,
    "intro": "Lies die Texte prüfungsnah. B2-Hardmode prüft Hauptaussage, indirekte Bedeutung, Autorabsicht, Argumentationsstruktur und plausible Ablenker.",
    "difficulty": "B2-hard",
    "readingSkills": [
      "Hauptaussage",
      "Detailverständnis",
      "indirekte Aussage",
      "Autorabsicht",
      "Argumentationsstruktur",
      "Wortbedeutung im Kontext"
    ],
    "texts": [
      {
        "title": "Bericht: Nachhaltige Kaufentscheidungen",
        "body": "Viele Verbraucherinnen und Verbraucher geben an, nachhaltiger einkaufen zu wollen. Im Alltag entscheiden jedoch Preis, Verfügbarkeit und Gewohnheit oft stärker als ökologische Überzeugungen. Unternehmen reagieren mit umweltfreundlich wirkenden Verpackungen und Siegeln. Kritisch bleibt, dass nicht jedes grüne Versprechen überprüfbar ist und manche Produkte nur minimal verbessert werden."
      },
      {
        "title": "Kommentar: Verantwortung teilen",
        "body": "Nachhaltiger Konsum ist wichtig, aber er darf nicht zur bequemen Ausrede für Politik und Wirtschaft werden. Einzelne Kaufentscheidungen ersetzen keine klaren Regeln, transparente Lieferketten und bezahlbare Alternativen. Wer Nachhaltigkeit ernst nimmt, muss Verbraucher entlasten statt ihnen die gesamte Verantwortung zuzuschieben."
      }
    ],
    "questions": [
      {
        "id": "b2rcc1",
        "question": "Was beeinflusst Kaufentscheidungen im Alltag oft stärker als Überzeugungen?",
        "options": [
          [
            "a",
            "Preis, Verfügbarkeit und Gewohnheit."
          ],
          [
            "b",
            "Nur politische Programme."
          ],
          [
            "c",
            "Nur wissenschaftliche Studien."
          ],
          [
            "d",
            "Ausschließlich Verpackungsfarbe."
          ]
        ],
        "correct": "a",
        "explanation": "Diese Faktoren nennt der Bericht.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rcc2",
        "question": "Was wird an grünen Versprechen kritisiert?",
        "options": [
          [
            "a",
            "Sie sind nicht immer überprüfbar."
          ],
          [
            "b",
            "Sie sind immer gesetzlich verboten."
          ],
          [
            "c",
            "Sie machen Produkte automatisch billiger."
          ],
          [
            "d",
            "Sie verhindern jede Werbung."
          ]
        ],
        "correct": "a",
        "explanation": "Der Bericht nennt fehlende Überprüfbarkeit.",
        "skill": "Kritik erkennen"
      },
      {
        "id": "b2rcc3",
        "question": "Welche Hauptaussage vertritt der Kommentar?",
        "options": [
          [
            "a",
            "Verantwortung darf nicht allein auf Verbraucher abgewälzt werden."
          ],
          [
            "b",
            "Konsum hat nie Auswirkungen."
          ],
          [
            "c",
            "Politik und Wirtschaft spielen keine Rolle."
          ],
          [
            "d",
            "Alle Siegel sind immer zuverlässig."
          ]
        ],
        "correct": "a",
        "explanation": "Der Kommentar fordert geteilte Verantwortung.",
        "skill": "Hauptaussage"
      },
      {
        "id": "b2rcc4",
        "question": "Was bedeutet „bequeme Ausrede“ im Kontext?",
        "options": [
          [
            "a",
            "Andere Akteure vermeiden Verantwortung, indem sie auf Verbraucher verweisen."
          ],
          [
            "b",
            "Verbraucher kaufen immer bewusst."
          ],
          [
            "c",
            "Nachhaltigkeit ist unmöglich."
          ],
          [
            "d",
            "Regeln sind grundsätzlich unnötig."
          ]
        ],
        "correct": "a",
        "explanation": "Gemeint ist Verantwortungsverschiebung.",
        "skill": "Wortbedeutung"
      },
      {
        "id": "b2rcc5",
        "question": "Welche Maßnahme fordert der Kommentar?",
        "options": [
          [
            "a",
            "Klare Regeln und transparente Lieferketten."
          ],
          [
            "b",
            "Mehr unklare Werbung."
          ],
          [
            "c",
            "Weniger bezahlbare Alternativen."
          ],
          [
            "d",
            "Keine Informationen über Produkte."
          ]
        ],
        "correct": "a",
        "explanation": "Diese Maßnahmen werden genannt.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rcc6",
        "question": "Welche Aussage verbindet beide Texte?",
        "options": [
          [
            "a",
            "Nachhaltigkeit braucht mehr als gute Absichten einzelner Käufer."
          ],
          [
            "b",
            "Verpackungen lösen alle Umweltprobleme."
          ],
          [
            "c",
            "Preis spielt keine Rolle."
          ],
          [
            "d",
            "Alle grünen Produkte sind gleich gut."
          ]
        ],
        "correct": "a",
        "explanation": "Beide Texte zeigen Grenzen individueller Kaufentscheidung.",
        "skill": "Synthese"
      },
      {
        "id": "b2rcc7",
        "question": "Was ist ein plausibler B2-Schluss aus dem Bericht?",
        "options": [
          [
            "a",
            "Man sollte Umweltversprechen kritisch prüfen."
          ],
          [
            "b",
            "Man sollte nie nachhaltig einkaufen."
          ],
          [
            "c",
            "Verfügbarkeit ist unwichtig."
          ],
          [
            "d",
            "Gewohnheiten verändern sich ohne Bedingungen."
          ]
        ],
        "correct": "a",
        "explanation": "Der Bericht warnt vor nicht überprüfbaren Versprechen.",
        "skill": "Schlussfolgerung"
      },
      {
        "id": "b2rcc8",
        "question": "Welche Überschrift passt am besten?",
        "options": [
          [
            "a",
            "Nachhaltigkeit: Zwischen Wunsch, Werbung und Verantwortung"
          ],
          [
            "b",
            "Warum grüne Verpackung immer genügt"
          ],
          [
            "c",
            "Konsum ohne Einfluss"
          ],
          [
            "d",
            "Verbraucher tragen allein die gesamte Verantwortung"
          ]
        ],
        "correct": "a",
        "explanation": "Sie fasst die Spannung beider Texte zusammen.",
        "skill": "Zusammenfassung"
      }
    ],
    "passScore": 76,
    "hardFailHints": [
      "Nur Einzelwörter erkennen reicht nicht.",
      "Plausible Ablenker sind bewusst nah am Text.",
      "Unter 70 % im Lesen ist für den Academy-Hartmodus kritisch."
    ]
  },
  {
    "id": "b2-reading-data-privacy-hard",
    "variantTitle": "B2 Lesen H · Datenschutz/Digitalisierung",
    "title": "Lesen · B2 Hardmode · Datenschutz im Alltag",
    "durationMinutes": 50,
    "intro": "Lies die Texte prüfungsnah. B2-Hardmode prüft Hauptaussage, indirekte Bedeutung, Autorabsicht, Argumentationsstruktur und plausible Ablenker.",
    "difficulty": "B2-hard",
    "readingSkills": [
      "Hauptaussage",
      "Detailverständnis",
      "indirekte Aussage",
      "Autorabsicht",
      "Argumentationsstruktur",
      "Wortbedeutung im Kontext"
    ],
    "texts": [
      {
        "title": "Sachtext: Daten im Alltag",
        "body": "Viele digitale Dienste sammeln Daten, um Angebote zu personalisieren, Betrug zu verhindern oder Werbung gezielter auszuspielen. Nutzerinnen und Nutzer stimmen häufig zu, ohne die Bedingungen vollständig zu lesen. Transparenzberichte und einfachere Einstellungen sollen Kontrolle erleichtern. Dennoch bleibt das Machtverhältnis ungleich, weil viele Dienste im Alltag kaum vermeidbar sind."
      },
      {
        "title": "Kommentar: Zustimmung ist nicht immer freiwillig",
        "body": "Formal betrachtet klicken Nutzer auf „Einverstanden“. Praktisch ist diese Zustimmung oft begrenzt freiwillig, wenn Kommunikation, Arbeit oder Behördenkontakte ohne bestimmte Plattformen kaum möglich sind. Datenschutz darf deshalb nicht nur als individuelle Entscheidung verstanden werden. Er braucht klare Grenzen, verständliche Informationen und unabhängige Kontrolle."
      }
    ],
    "questions": [
      {
        "id": "b2rdp1",
        "question": "Welche Gründe für Datensammlung nennt der Sachtext?",
        "options": [
          [
            "a",
            "Personalisierung, Betrugsverhinderung und Werbung."
          ],
          [
            "b",
            "Nur künstlerische Experimente."
          ],
          [
            "c",
            "Ausschließlich Spendenverwaltung."
          ],
          [
            "d",
            "Keine Gründe."
          ]
        ],
        "correct": "a",
        "explanation": "Diese drei Zwecke werden genannt.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rdp2",
        "question": "Was erschwert echte Kontrolle laut Sachtext?",
        "options": [
          [
            "a",
            "Viele Dienste sind im Alltag kaum vermeidbar."
          ],
          [
            "b",
            "Alle lesen Bedingungen vollständig."
          ],
          [
            "c",
            "Einstellungen sind immer perfekt verständlich."
          ],
          [
            "d",
            "Es gibt keine digitalen Dienste."
          ]
        ],
        "correct": "a",
        "explanation": "Das ungleiche Machtverhältnis wird so begründet.",
        "skill": "Kausalität"
      },
      {
        "id": "b2rdp3",
        "question": "Welche Kritik übt der Kommentar?",
        "options": [
          [
            "a",
            "Zustimmung ist oft nur formal freiwillig."
          ],
          [
            "b",
            "Datenschutz ist immer überflüssig."
          ],
          [
            "c",
            "Plattformen sollten nie kontrolliert werden."
          ],
          [
            "d",
            "Informationen sollten komplizierter werden."
          ]
        ],
        "correct": "a",
        "explanation": "Der Kommentar unterscheidet formal und praktisch.",
        "skill": "Autorabsicht"
      },
      {
        "id": "b2rdp4",
        "question": "Was bedeutet „Machtverhältnis ungleich“ im Kontext?",
        "options": [
          [
            "a",
            "Anbieter haben mehr Einfluss und Optionen als einzelne Nutzer."
          ],
          [
            "b",
            "Alle Beteiligten haben exakt gleiche Möglichkeiten."
          ],
          [
            "c",
            "Nutzer kontrollieren immer alles."
          ],
          [
            "d",
            "Datensammlung ist unmöglich."
          ]
        ],
        "correct": "a",
        "explanation": "Gemeint ist strukturelle Ungleichheit.",
        "skill": "Wortbedeutung"
      },
      {
        "id": "b2rdp5",
        "question": "Welche Lösung fordert der Kommentar?",
        "options": [
          [
            "a",
            "Klare Grenzen, verständliche Informationen und unabhängige Kontrolle."
          ],
          [
            "b",
            "Nur längere AGB."
          ],
          [
            "c",
            "Keine Regeln."
          ],
          [
            "d",
            "Mehr versteckte Einstellungen."
          ]
        ],
        "correct": "a",
        "explanation": "Diese drei Punkte werden genannt.",
        "skill": "Detailverständnis"
      },
      {
        "id": "b2rdp6",
        "question": "Welche indirekte Aussage passt?",
        "options": [
          [
            "a",
            "Individuelle Zustimmung reicht als Schutz nicht aus."
          ],
          [
            "b",
            "Niemand nutzt digitale Dienste."
          ],
          [
            "c",
            "Werbung ist der einzige Zweck von Daten."
          ],
          [
            "d",
            "Behördenkontakte sind immer analog."
          ]
        ],
        "correct": "a",
        "explanation": "Beide Texte zeigen Grenzen individueller Zustimmung.",
        "skill": "Indirekte Aussage"
      },
      {
        "id": "b2rdp7",
        "question": "Welche Aussage wäre ein falscher Schluss?",
        "options": [
          [
            "a",
            "Wenn jemand klickt, ist Datenschutz automatisch vollständig gelöst."
          ],
          [
            "b",
            "Dienste können schwer vermeidbar sein."
          ],
          [
            "c",
            "Einstellungen können Kontrolle erleichtern."
          ],
          [
            "d",
            "Unabhängige Kontrolle kann sinnvoll sein."
          ]
        ],
        "correct": "a",
        "explanation": "Der Kommentar widerspricht genau dieser Vereinfachung.",
        "skill": "Ablenkererkennung"
      },
      {
        "id": "b2rdp8",
        "question": "Welche Überschrift passt am besten?",
        "options": [
          [
            "a",
            "Datenschutz: Zustimmung allein reicht nicht"
          ],
          [
            "b",
            "Warum niemand Daten sammelt"
          ],
          [
            "c",
            "Werbung ohne Daten"
          ],
          [
            "d",
            "Digitale Dienste ohne Verantwortung"
          ]
        ],
        "correct": "a",
        "explanation": "Sie trifft den Kern der Texte.",
        "skill": "Zusammenfassung"
      }
    ],
    "passScore": 76,
    "hardFailHints": [
      "Nur Einzelwörter erkennen reicht nicht.",
      "Plausible Ablenker sind bewusst nah am Text.",
      "Unter 70 % im Lesen ist für den Academy-Hartmodus kritisch."
    ]
  }
]);
  var listeningPool = freezeList([
    {
      id:'b2-listening-workplace-learning-hard', variantTitle:'B2 Hören A · Arbeitswelt/Weiterbildung', title:'Hören · B2 Hardmode · Interview Weiterbildung', durationMinutes:38,
      intro:'Höre das Interview zweimal maximal. B2-Hardmode prüft nicht nur Fakten, sondern Einschränkungen, indirekte Kritik und die Haltung der Sprecherin.', audioSimulationNote:'Browser-Stimme, Transkript verborgen, maximal zwei Hörvorgänge. Transkript ist Hilfsmodus.', listeningMode:'browser-tts', maxPlays:2, showTranscriptAfterPlays:2, speed:'normal', audioInstruction:'Achte auf Positionen, Bedingungen, indirekte Kritik und konkrete Forderungen.',
      listeningSkills:['Position erkennen','Einschränkung verstehen','indirekte Kritik','Detailverständnis','Schlussfolgerung','Wortbedeutung im Kontext'],
      texts:[{title:'Interview', body:'Moderatorin: Viele Betriebe bieten inzwischen Onlineweiterbildungen an. Reicht das aus? Expertin: Es ist ein wichtiger Schritt, aber kein Selbstläufer. Manche Mitarbeitende profitieren sehr, andere brauchen feste Lernzeiten, Rückmeldung und eine Verbindung zu echten Aufgaben im Betrieb. Wenn ein Unternehmen nur eine Plattform kauft, aber keine Lernkultur schafft, bleiben die Ergebnisse oft schwach. Moderatorin: Was wäre also notwendig? Expertin: Klare Ziele, Zeit im Arbeitsplan und eine Person, die den Lernfortschritt begleitet. Sonst wirkt das Angebot modern, ohne wirklich etwas zu verändern.'}],
      questions:[
        {id:'b2lhw1', skill:'Hauptaussage', question:'Wie bewertet die Expertin Onlineweiterbildungen insgesamt?', options:[['a','Als wichtigen Schritt, der aber aktiv gestaltet werden muss.'],['b','Als vollständig nutzloses Angebot.'],['c','Als automatischen Ersatz für jede Betreuung.'],['d','Als Thema, das nur für Führungskräfte relevant ist.']], correct:'a', explanation:'Sie nennt Onlineweiterbildung einen wichtigen Schritt, aber keinen Selbstläufer.'},
        {id:'b2lhw2', skill:'Indirekte Kritik', question:'Was kritisiert die Expertin indirekt an manchen Unternehmen?', options:[['a','Sie investieren in Technik, aber nicht in echte Lernbedingungen.'],['b','Sie bieten zu viel persönliche Begleitung an.'],['c','Sie planen zu viele Präsenzseminare.'],['d','Sie verbieten digitale Angebote grundsätzlich.']], correct:'a', explanation:'Die Kritik richtet sich gegen Plattformen ohne Lernkultur.'},
        {id:'b2lhw3', skill:'Detailverständnis', question:'Was brauchen laut Expertin manche Mitarbeitende zusätzlich?', options:[['a','Feste Lernzeiten und Rückmeldung.'],['b','Nur mehr Werbung für die Plattform.'],['c','Keine Ziele, damit sie frei lernen können.'],['d','Ausschließlich private Lernzeit am Wochenende.']], correct:'a', explanation:'Feste Lernzeiten und Rückmeldung werden direkt genannt.'},
        {id:'b2lhw4', skill:'Bedingung', question:'Welche Bedingung macht digitale Weiterbildung wirksamer?', options:[['a','Verbindung zu echten Aufgaben im Betrieb.'],['b','Vollständige Trennung von Arbeitsaufgaben.'],['c','Keine Begleitung des Lernfortschritts.'],['d','Nur kurze Werbevideos.']], correct:'a', explanation:'Die Verbindung zu realen Arbeitsaufgaben ist ausdrücklich genannt.'},
        {id:'b2lhw5', skill:'Wortbedeutung', question:'Was bedeutet „kein Selbstläufer“ im Kontext?', options:[['a','Der Erfolg entsteht nicht automatisch.'],['b','Das Angebot ist technisch unmöglich.'],['c','Die Plattform läuft ohne Internet.'],['d','Alle Mitarbeitenden lehnen Weiterbildung ab.']], correct:'a', explanation:'Gemeint ist: Ohne Gestaltung funktioniert es nicht zuverlässig.'},
        {id:'b2lhw6', skill:'Schlussfolgerung', question:'Welche Maßnahme passt am besten zur Aussage der Expertin?', options:[['a','Lernzeiten im Arbeitsplan einbauen und Fortschritt begleiten.'],['b','Nur Zugangsdaten verschicken und abwarten.'],['c','Lernen ausschließlich in die Freizeit verlagern.'],['d','Rückmeldungen vermeiden, damit niemand gestört wird.']], correct:'a', explanation:'Klare Ziele, Arbeitszeit und Begleitung entsprechen ihrer Forderung.'},
        {id:'b2lhw7', skill:'Haltung', question:'Welche Haltung nimmt die Expertin ein?', options:[['a','Differenziert: offen für digitale Angebote, aber kritisch bei schlechter Umsetzung.'],['b','Völlig ablehnend gegenüber jeder Digitalisierung.'],['c','Werbend ohne Einschränkungen.'],['d','Ironisch und ohne konkrete Vorschläge.']], correct:'a', explanation:'Sie erkennt Chancen an und benennt Bedingungen.'},
        {id:'b2lhw8', skill:'Indirekte Aussage', question:'Was meint die Expertin mit „modern, ohne wirklich etwas zu verändern“?', options:[['a','Ein Angebot kann fortschrittlich aussehen, ohne Lernqualität zu verbessern.'],['b','Moderne Plattformen verändern immer automatisch die Lernkultur.'],['c','Lernfortschritt ist nicht messbar.'],['d','Weiterbildung ist in Betrieben nicht nötig.']], correct:'a', explanation:'Die Formulierung kritisiert oberflächliche Modernisierung.'}
      ], passScore:76, hardFailHints:['Nur einzelne Wörter aus dem Hörtext reichen nicht.','B2 verlangt Erkennen von Bedingungen und Haltung.','Transkript-Nutzung zählt als Hilfsmodus.']
    },
    {
      id:'b2-listening-mobility-debate-hard', variantTitle:'B2 Hören B · Mobilität/Stadt', title:'Hören · B2 Hardmode · Radiodiskussion Mobilität', durationMinutes:38,
      intro:'Höre die Diskussion und achte auf Gegenpositionen, Zugeständnisse und Bedingungen.', audioSimulationNote:'Realistische Hörsimulation mit zwei Abspielvorgängen.', listeningMode:'browser-tts', maxPlays:2, showTranscriptAfterPlays:2, speed:'normal', audioInstruction:'Achte darauf, wer welche Position vertritt und wo eingeschränkt wird.',
      listeningSkills:['Sprecherpositionen','Gegenargument','Zugeständnis','Bedingung','Schlussfolgerung','Haltung'],
      texts:[{title:'Radiosendung', body:'Moderator: In unserer Stadt sollen Parkplätze reduziert und Buslinien ausgebaut werden. Eine Hörerin sagt, die Innenstadt werde dadurch für Familien und ältere Menschen unattraktiver. Der Verkehrsplaner widerspricht teilweise: Entscheidend sei nicht die Zahl der Parkplätze, sondern die Erreichbarkeit insgesamt. Er räumt aber ein, dass Menschen aus dem Umland bessere Verbindungen brauchen, bevor Parkplätze wegfallen. Eine Ladenbesitzerin ergänzt, sie unterstütze weniger Verkehr, solange Lieferzonen und kurze Wege für Kundinnen erhalten bleiben. Sonst entstehe Frust statt Akzeptanz.'}],
      questions:[
        {id:'b2lmb1', skill:'Detailverständnis', question:'Welche Veränderung wird diskutiert?', options:[['a','Parkplätze reduzieren und Buslinien ausbauen.'],['b','Buslinien reduzieren und Parkplätze erhöhen.'],['c','Innenstadtgeschäfte schließen.'],['d','Fahrradwege komplett entfernen.']], correct:'a', explanation:'Das wird zu Beginn genannt.'},
        {id:'b2lmb2', skill:'Sprecherposition', question:'Was befürchtet die Hörerin?', options:[['a','Die Innenstadt könnte für bestimmte Gruppen unattraktiver werden.'],['b','Busse würden zu häufig fahren.'],['c','Parkplätze würden zu billig.'],['d','Lieferzonen würden zu groß.']], correct:'a', explanation:'Sie nennt Familien und ältere Menschen.'},
        {id:'b2lmb3', skill:'Differenzierung', question:'Wie reagiert der Verkehrsplaner?', options:[['a','Er widerspricht teilweise und betont die Erreichbarkeit insgesamt.'],['b','Er stimmt vollständig und ohne Einschränkung zu.'],['c','Er ignoriert Menschen aus dem Umland.'],['d','Er fordert, alle Busse abzuschaffen.']], correct:'a', explanation:'Er widerspricht teilweise, aber macht eine Einschränkung.'},
        {id:'b2lmb4', skill:'Bedingung', question:'Welche Voraussetzung nennt der Verkehrsplaner?', options:[['a','Bessere Verbindungen für Menschen aus dem Umland.'],['b','Weniger Busse in den Vororten.'],['c','Keine Lieferzonen mehr.'],['d','Parkplätze nur für Touristen.']], correct:'a', explanation:'Diese Bedingung nennt er ausdrücklich.'},
        {id:'b2lmb5', skill:'Sprecherposition', question:'Unter welcher Bedingung unterstützt die Ladenbesitzerin weniger Verkehr?', options:[['a','Wenn Lieferzonen und kurze Wege erhalten bleiben.'],['b','Wenn alle Kundinnen zu Hause bleiben.'],['c','Wenn Geschäfte keine Lieferungen bekommen.'],['d','Wenn Parkplätze sofort ersatzlos verschwinden.']], correct:'a', explanation:'Sie nennt Lieferzonen und kurze Wege.'},
        {id:'b2lmb6', skill:'Folge', question:'Was kann ohne ausreichende Alternativen entstehen?', options:[['a','Frust statt Akzeptanz.'],['b','Automatische Zustimmung.'],['c','Mehr Parkplätze durch weniger Verkehr.'],['d','Keine Diskussion mehr.']], correct:'a', explanation:'Diese Formulierung steht am Ende.'},
        {id:'b2lmb7', skill:'Haltung', question:'Welche Haltung beschreibt die Diskussion am besten?', options:[['a','Abwägend: Veränderung ja, aber mit praktischen Bedingungen.'],['b','Radikal einseitig gegen jede Mobilitätsänderung.'],['c','Nur werbend für Autos.'],['d','Unklar, weil niemand Argumente nennt.']], correct:'a', explanation:'Alle Positionen enthalten Bedingungen und Abwägungen.'},
        {id:'b2lmb8', skill:'Indirekte Aussage', question:'Welche indirekte Aussage ist zutreffend?', options:[['a','Akzeptanz hängt davon ab, ob Alternativen alltagstauglich sind.'],['b','Parkplätze sind immer wichtiger als Erreichbarkeit.'],['c','Lieferverkehr spielt keine Rolle.'],['d','Familien und ältere Menschen werden nicht berücksichtigt.']], correct:'a', explanation:'Die Bedingungen zeigen die Bedeutung praktischer Alternativen.'}
      ], passScore:76, hardFailHints:['Positionen der Sprecher müssen getrennt erkannt werden.','B2-Hören prüft Bedingungen, nicht nur Schlagwörter.','Plausible Antworten sind bewusst nah an der Diskussion.']
    },
    {
      id:'b2-listening-ai-learning-hard', variantTitle:'B2 Hören C · Bildung/KI', title:'Hören · B2 Hardmode · Podcast KI im Lernen', durationMinutes:38,
      intro:'Höre den Podcast. Erkenne Nutzen, Risiko und die begründete Schlussfolgerung.', audioSimulationNote:'Browser-TTS, verborgenes Transkript, zwei Hörvorgänge.', listeningMode:'browser-tts', maxPlays:2, showTranscriptAfterPlays:2, speed:'normal', audioInstruction:'Achte auf Chancen, Risiken, Transparenz und menschliche Rückmeldung.',
      listeningSkills:['Nutzen erkennen','Risiko erkennen','Begründung','Schlussfolgerung','Haltung','Begriff im Kontext'],
      texts:[{title:'Podcast', body:'Sprecherin: KI-gestützte Lernprogramme können Aufgaben passend zum Lernstand auswählen und schnelle Rückmeldungen geben. Das klingt effizient und kann besonders bei großen Lerngruppen helfen. Trotzdem warnen Pädagoginnen davor, Entscheidungen über Lernziele vollständig an Systeme abzugeben. Besonders kritisch wird es, wenn Lernende nicht verstehen, warum sie eine bestimmte Bewertung erhalten. Transparenz und menschliche Rückmeldung bleiben deshalb zentral. KI kann Lehrkräfte entlasten, aber sie sollte pädagogische Verantwortung nicht ersetzen.'}],
      questions:[
        {id:'b2lai1', skill:'Chance', question:'Welche Chance bietet KI laut Podcast?', options:[['a','Passende Aufgaben und schnelle Rückmeldungen.'],['b','Keine Bewertung mehr.'],['c','Weniger Transparenz.'],['d','Vollständiger Ersatz für Lernziele.']], correct:'a', explanation:'Das wird direkt genannt.'},
        {id:'b2lai2', skill:'Kontext', question:'Wann kann KI besonders helfen?', options:[['a','Bei großen Lerngruppen.'],['b','Wenn niemand Rückmeldung braucht.'],['c','Wenn Lernziele unklar bleiben.'],['d','Wenn Bewertungen nicht erklärt werden.']], correct:'a', explanation:'Große Lerngruppen werden als Beispiel genannt.'},
        {id:'b2lai3', skill:'Warnung', question:'Wovor warnen Pädagoginnen?', options:[['a','Lernziele vollständig an Systeme abzugeben.'],['b','Vor menschlicher Rückmeldung.'],['c','Vor passenden Aufgaben.'],['d','Vor transparenten Bewertungen.']], correct:'a', explanation:'Die Warnung bezieht sich auf Entscheidungen über Lernziele.'},
        {id:'b2lai4', skill:'Risiko', question:'Wann wird der Einsatz besonders kritisch?', options:[['a','Wenn Lernende Bewertungen nicht nachvollziehen können.'],['b','Wenn Aufgaben zum Lernstand passen.'],['c','Wenn Lehrkräfte Rückmeldung geben.'],['d','Wenn Systeme transparent sind.']], correct:'a', explanation:'Nicht nachvollziehbare Bewertung wird kritisiert.'},
        {id:'b2lai5', skill:'Schlussfolgerung', question:'Was bleibt laut Sprecherin zentral?', options:[['a','Transparenz und menschliche Rückmeldung.'],['b','Nur automatische Tests.'],['c','Bewertung ohne Erklärung.'],['d','Ausschließlich selbstständiges Lernen.']], correct:'a', explanation:'Das wird ausdrücklich genannt.'},
        {id:'b2lai6', skill:'Haltung', question:'Welche Haltung nimmt die Sprecherin ein?', options:[['a','Differenziert: Nutzen anerkennen, Grenzen benennen.'],['b','Nur begeistert und unkritisch.'],['c','Vollständig ablehnend.'],['d','Unentschlossen ohne Begründung.']], correct:'a', explanation:'Sie nennt Chancen und Risiken.'},
        {id:'b2lai7', skill:'Indirekte Aussage', question:'Welche Aussage ist indirekt gemeint?', options:[['a','Pädagogische Entscheidungen brauchen mehr als automatische Berechnung.'],['b','Lehrkräfte werden überflüssig.'],['c','KI sollte alle Prüfungen allein durchführen.'],['d','Lernende müssen Bewertungen nicht verstehen.']], correct:'a', explanation:'Verantwortung und Transparenz bleiben menschlich/pädagogisch gebunden.'},
        {id:'b2lai8', skill:'Begriff', question:'Was bedeutet „entlasten“ im Kontext?', options:[['a','Arbeit erleichtern, ohne Verantwortung vollständig zu übernehmen.'],['b','Alle Aufgaben übernehmen.'],['c','Lernen verhindern.'],['d','Bewertung verschlechtern.']], correct:'a', explanation:'KI kann helfen, aber nicht ersetzen.'}
      ], passScore:76, hardFailHints:['B2 verlangt Risiko/Nutzen-Abwägung.','Wer nur den Vorteil erkennt, besteht nicht sicher.','Transkript-Fallback wird markiert.']
    },
    {
      id:'b2-listening-health-work-hard', variantTitle:'B2 Hören D · Gesundheit/Arbeit', title:'Hören · B2 Hardmode · Gespräch über Gesundheit im Betrieb', durationMinutes:38,
      intro:'Höre das Gespräch. Entscheidend sind Ursachen, Scheinlösungen und strukturelle Bedingungen.', audioSimulationNote:'Browser-TTS, zwei Hörvorgänge, Transkript als Hilfsmodus.', listeningMode:'browser-tts', maxPlays:2, showTranscriptAfterPlays:2, speed:'normal', audioInstruction:'Achte auf den Unterschied zwischen individuellen Angeboten und strukturellen Ursachen.',
      listeningSkills:['Ursache/Wirkung','Kritik','Schlussfolgerung','Detail','Haltung','Argumentationslogik'],
      texts:[{title:'Gespräch', body:'Moderator: Viele Firmen bieten inzwischen Yoga-Kurse oder Stress-Apps an. Reicht das aus? Arbeitspsychologe: Solche Angebote können sinnvoll sein, aber sie lösen keine strukturellen Probleme. Wenn ständig Überstunden anfallen, Aufgaben unklar verteilt sind und Beschäftigte kaum Einfluss auf Abläufe haben, hilft eine App nur begrenzt. Entscheidend sind realistische Personalplanung, klare Zuständigkeiten und Führungskräfte, die Belastungen ernst nehmen. Sonst wird Verantwortung auf einzelne Beschäftigte verschoben.'}],
      questions:[
        {id:'b2lhth1', skill:'Detail', question:'Welche Angebote werden als Beispiele genannt?', options:[['a','Yoga-Kurse und Stress-Apps.'],['b','Sprachkurse und Mathebücher.'],['c','Parkplätze und Kantinenessen.'],['d','Nur Gehaltserhöhungen.']], correct:'a', explanation:'Diese Beispiele stehen am Anfang.'},
        {id:'b2lhth2', skill:'Hauptaussage', question:'Wie bewertet der Arbeitspsychologe solche Angebote?', options:[['a','Sie können sinnvoll sein, reichen aber allein nicht aus.'],['b','Sie lösen alle Probleme automatisch.'],['c','Sie sind immer schädlich.'],['d','Sie ersetzen Personalplanung.']], correct:'a', explanation:'Er nennt Nutzen, aber auch Grenzen.'},
        {id:'b2lhth3', skill:'Ursache', question:'Welche strukturelle Ursache wird genannt?', options:[['a','Ständige Überstunden und unklare Aufgabenverteilung.'],['b','Zu viele Pausen.'],['c','Zu klare Zuständigkeiten.'],['d','Zu viel Einfluss auf Abläufe.']], correct:'a', explanation:'Überstunden und unklare Aufgaben werden genannt.'},
        {id:'b2lhth4', skill:'Kritik', question:'Was kritisiert der Psychologe indirekt?', options:[['a','Gesundheitsangebote können echte Arbeitsprobleme verdecken.'],['b','Beschäftigte sollten keine Unterstützung bekommen.'],['c','Führungskräfte haben nie Einfluss.'],['d','Apps sind immer verboten.']], correct:'a', explanation:'Er warnt vor begrenzter Wirkung bei strukturellen Problemen.'},
        {id:'b2lhth5', skill:'Bedingung', question:'Was ist laut ihm entscheidend?', options:[['a','Realistische Personalplanung und klare Zuständigkeiten.'],['b','Nur freiwillige Apps.'],['c','Mehr Aufgaben ohne Planung.'],['d','Keine Gespräche über Belastung.']], correct:'a', explanation:'Diese Maßnahmen werden direkt genannt.'},
        {id:'b2lhth6', skill:'Rolle', question:'Welche Rolle haben Führungskräfte laut Gespräch?', options:[['a','Sie sollen Belastungen ernst nehmen.'],['b','Sie sollen Belastungen ignorieren.'],['c','Sie sollen nur Apps empfehlen.'],['d','Sie haben keine Verantwortung.']], correct:'a', explanation:'Führungskräfte werden ausdrücklich erwähnt.'},
        {id:'b2lhth7', skill:'Indirekte Aussage', question:'Was bedeutet „Verantwortung wird auf einzelne Beschäftigte verschoben“?', options:[['a','Das Problem wird individualisiert, obwohl Ursachen im System liegen.'],['b','Beschäftigte bekommen mehr Entscheidungsmacht.'],['c','Die Firma übernimmt mehr Verantwortung.'],['d','Alle Probleme sind privat.']], correct:'a', explanation:'Die strukturelle Verantwortung wird auf Einzelne verlagert.'},
        {id:'b2lhth8', skill:'Haltung', question:'Welche Haltung ist passend?', options:[['a','Kritisch-differenziert gegenüber reinen Zusatzangeboten.'],['b','Reine Werbung für Apps.'],['c','Ablehnung jeder Gesundheitsförderung.'],['d','Nur persönliche Schuldzuweisung.']], correct:'a', explanation:'Er erkennt Nutzen an, fordert aber strukturelle Änderungen.'}
      ], passScore:76, hardFailHints:['B2-Hören verlangt strukturelles Verstehen.','Reine Detailtreffer reichen nicht.','Kritik und indirekte Aussage müssen erkannt werden.']
    },
    {
      id:'b2-listening-housing-market-hard', variantTitle:'B2 Hören E · Wohnen/Mietmarkt', title:'Hören · B2 Hardmode · Experteninterview Wohnen', durationMinutes:38,
      intro:'Höre das Interview. Achte auf Ursachenbündel, soziale Folgen und differenzierte Lösungen.', audioSimulationNote:'Browser-TTS, maximal zwei Wiedergaben.', listeningMode:'browser-tts', maxPlays:2, showTranscriptAfterPlays:2, speed:'normal', audioInstruction:'Achte auf direkte Fakten und indirekte soziale Folgen.',
      listeningSkills:['Ursachen erkennen','soziale Folge','Lösungen','Differenzierung','indirekte Aussage','Zusammenfassung'],
      texts:[{title:'Experteninterview', body:'Moderatorin: Warum ist bezahlbares Wohnen in vielen Städten so schwierig geworden? Stadtforscher: Es gibt nicht nur eine Ursache. Steigende Baukosten, knappe Flächen, lange Genehmigungsverfahren und spekulativer Leerstand wirken zusammen. Besonders problematisch ist, dass instabiles Wohnen Bildung, Arbeit und soziale Teilhabe erschwert. Nur mehr Neubau zu fordern, greift zu kurz, wenn die Wohnungen anschließend für viele nicht bezahlbar sind. Notwendig sind schnellere Verfahren, soziale Bindungen und ein besserer Schutz vor Zweckentfremdung.'}],
      questions:[
        {id:'b2lhm1', skill:'Hauptaussage', question:'Welche Hauptaussage vertritt der Stadtforscher?', options:[['a','Wohnprobleme haben mehrere Ursachen und brauchen kombinierte Lösungen.'],['b','Es gibt genau eine Ursache.'],['c','Neubau ist immer sofort ausreichend.'],['d','Soziale Folgen spielen keine Rolle.']], correct:'a', explanation:'Er nennt mehrere Ursachen und mehrere Lösungen.'},
        {id:'b2lhm2', skill:'Detail', question:'Welche Ursache wird genannt?', options:[['a','Steigende Baukosten.'],['b','Zu viele günstige Wohnungen.'],['c','Zu kurze Genehmigungen.'],['d','Zu viele freie Flächen.']], correct:'a', explanation:'Steigende Baukosten stehen in der Aufzählung.'},
        {id:'b2lhm3', skill:'Ursachenbündel', question:'Was bedeutet „wirken zusammen“ im Kontext?', options:[['a','Mehrere Faktoren verstärken das Problem gemeinsam.'],['b','Nur ein Faktor ist verantwortlich.'],['c','Die Faktoren widersprechen sich vollständig.'],['d','Das Problem existiert nicht.']], correct:'a', explanation:'Mehrere Ursachen beeinflussen sich.'},
        {id:'b2lhm4', skill:'Soziale Folge', question:'Welche soziale Folge instabilen Wohnens wird genannt?', options:[['a','Erschwerte Bildung, Arbeit und Teilhabe.'],['b','Automatisch höhere Einkommen.'],['c','Mehr Freizeit.'],['d','Weniger Bürokratie.']], correct:'a', explanation:'Diese drei Bereiche werden genannt.'},
        {id:'b2lhm5', skill:'Kritik', question:'Was kritisiert der Experte an der Forderung nach mehr Neubau?', options:[['a','Sie greift zu kurz, wenn Wohnungen nicht bezahlbar sind.'],['b','Neubau soll vollständig verboten werden.'],['c','Alle Neubauten sind immer günstig.'],['d','Genehmigungsverfahren sind nie ein Problem.']], correct:'a', explanation:'Bezahlbarkeit wird als Grenze genannt.'},
        {id:'b2lhm6', skill:'Lösung', question:'Welche Lösung wird vorgeschlagen?', options:[['a','Schnellere Verfahren und soziale Bindungen.'],['b','Weniger Schutz vor Zweckentfremdung.'],['c','Nur teure Wohnungen.'],['d','Keine kommunale Steuerung.']], correct:'a', explanation:'Diese Lösungen nennt er direkt.'},
        {id:'b2lhm7', skill:'Indirekte Aussage', question:'Welche indirekte Aussage ist zutreffend?', options:[['a','Wohnen ist auch eine Voraussetzung für gesellschaftliche Chancen.'],['b','Wohnen ist nur eine private Konsumentscheidung.'],['c','Leerstand ist nie problematisch.'],['d','Sozialwohnungen verschärfen alle Probleme.']], correct:'a', explanation:'Die genannten Folgen zeigen die gesellschaftliche Bedeutung.'},
        {id:'b2lhm8', skill:'Differenzierung', question:'Warum ist die Antwort des Experten B2-typisch differenziert?', options:[['a','Er vermeidet einfache Schuldzuweisungen und nennt mehrere Ursachen.'],['b','Er nennt nur eine Lösung.'],['c','Er ignoriert Kosten und Flächen.'],['d','Er spricht nur über private Wünsche.']], correct:'a', explanation:'Mehrere Ursachen und Lösungen zeigen Differenzierung.'}
      ], passScore:76, hardFailHints:['Mehrere Ursachen müssen auseinandergehalten werden.','Soziale Folgen sind zentral.','Einzelne Schlagwörter reichen nicht.']
    },
    {
      id:'b2-listening-worktime-hard', variantTitle:'B2 Hören F · Arbeitszeit/Flexibilität', title:'Hören · B2 Hardmode · Beitrag zur Vier-Tage-Woche', durationMinutes:38,
      intro:'Höre den Beitrag. Erkenne Abwägung, Bedingungen und Risiken der Arbeitsverdichtung.', audioSimulationNote:'Zwei Hörvorgänge, Transkript verborgen.', listeningMode:'browser-tts', maxPlays:2, showTranscriptAfterPlays:2, speed:'normal', audioInstruction:'Achte auf Unterschied zwischen Chance, Risiko und Bedingung.',
      listeningSkills:['Chance/Risiko','Arbeitsverdichtung','Übertragbarkeit','Bedingung','Haltung','Schlussfolgerung'],
      texts:[{title:'Radiobeitrag', body:'Sprecher: Die Vier-Tage-Woche wird oft als Lösung gegen Stress und Fachkräftemangel genannt. Pilotprojekte zeigen, dass Produktivität stabil bleiben kann, wenn Prozesse verbessert und Prioritäten klarer gesetzt werden. Gleichzeitig ist das Modell nicht automatisch auf alle Branchen übertragbar. In Pflege, Gastronomie oder Logistik kann eine kürzere Woche zusätzlichen Druck erzeugen, wenn nicht mehr Personal zur Verfügung steht. Entscheidend ist daher nicht nur die Zahl der Arbeitstage, sondern die Frage, wie Aufgaben verteilt und bezahlt werden.'}],
      questions:[
        {id:'b2lwt1', skill:'Thema', question:'Wofür wird die Vier-Tage-Woche oft genannt?', options:[['a','Als Lösung gegen Stress und Fachkräftemangel.'],['b','Als Grund für mehr Bürokratie.'],['c','Als Verbot von Teilzeit.'],['d','Als reines Freizeitprojekt ohne Arbeitsbezug.']], correct:'a', explanation:'Das steht im ersten Satz.'},
        {id:'b2lwt2', skill:'Bedingung', question:'Wann kann Produktivität stabil bleiben?', options:[['a','Wenn Prozesse verbessert und Prioritäten klar gesetzt werden.'],['b','Wenn Aufgaben ungeplant bleiben.'],['c','Wenn niemand Zuständigkeiten kennt.'],['d','Wenn Pausen gestrichen werden.']], correct:'a', explanation:'Diese Bedingungen nennt der Beitrag.'},
        {id:'b2lwt3', skill:'Übertragbarkeit', question:'Warum ist das Modell nicht automatisch übertragbar?', options:[['a','Branchen haben unterschiedliche organisatorische Bedingungen.'],['b','Alle Branchen funktionieren gleich.'],['c','Pflege und Logistik haben keine Schichten.'],['d','Gastronomie braucht keine Planung.']], correct:'a', explanation:'Der Beitrag nennt verschiedene Branchen als Problemfälle.'},
        {id:'b2lwt4', skill:'Risiko', question:'Was kann in manchen Branchen entstehen?', options:[['a','Zusätzlicher Druck, wenn kein Personal vorhanden ist.'],['b','Automatisch weniger Arbeit bei gleichem Personal.'],['c','Keine Veränderung der Aufgaben.'],['d','Mehr Freizeit ohne Folgen.']], correct:'a', explanation:'Zusätzlicher Druck wird genannt.'},
        {id:'b2lwt5', skill:'Begriff', question:'Was meint „Arbeitsverdichtung“ sinngemäß?', options:[['a','Mehr Aufgaben oder Druck in kürzerer Zeit.'],['b','Weniger Aufgaben bei mehr Personal.'],['c','Mehr Pausen ohne Aufgaben.'],['d','Vollständige Abschaffung der Arbeit.']], correct:'a', explanation:'Der Beitrag beschreibt Druck bei kürzerer Woche ohne mehr Personal.'},
        {id:'b2lwt6', skill:'Schlussfolgerung', question:'Was ist laut Beitrag entscheidend?', options:[['a','Wie Aufgaben verteilt und bezahlt werden.'],['b','Nur die Zahl der Arbeitstage.'],['c','Nur die Werbung für das Modell.'],['d','Dass alle Branchen gleich behandelt werden.']], correct:'a', explanation:'Der Schluss nennt Verteilung und Bezahlung.'},
        {id:'b2lwt7', skill:'Haltung', question:'Welche Haltung nimmt der Beitrag ein?', options:[['a','Abwägend: Chancen ja, aber nur unter Bedingungen.'],['b','Uneingeschränkt begeistert.'],['c','Völlig ablehnend ohne Begründung.'],['d','Thematisch unklar.']], correct:'a', explanation:'Der Beitrag nennt Chancen und Risiken.'},
        {id:'b2lwt8', skill:'Indirekte Aussage', question:'Welche Aussage passt indirekt?', options:[['a','Eine Arbeitszeitreform muss organisatorisch abgesichert werden.'],['b','Kürzere Arbeitszeit löst jedes Problem automatisch.'],['c','Personalplanung ist irrelevant.'],['d','Bezahlung spielt keine Rolle.']], correct:'a', explanation:'Die genannten Bedingungen zeigen organisatorische Absicherung.'}
      ], passScore:76, hardFailHints:['B2-Hören verlangt Abwägung.','Übertragbarkeit und Bedingungen sind zentrale Punkte.','Nicht jede positiv klingende Antwort ist richtig.']
    },
    {
      id:'b2-listening-consumption-hard', variantTitle:'B2 Hören G · Konsum/Nachhaltigkeit', title:'Hören · B2 Hardmode · Nachhaltiger Konsum', durationMinutes:38,
      intro:'Höre den Beitrag. Achte auf individuelle Verantwortung, strukturelle Grenzen und realistische Maßnahmen.', audioSimulationNote:'Browser-TTS, zwei Hörvorgänge, Hilfsmodus markiert.', listeningMode:'browser-tts', maxPlays:2, showTranscriptAfterPlays:2, speed:'normal', audioInstruction:'Achte auf das Verhältnis zwischen Konsumentscheidungen und politischen/unternehmerischen Rahmenbedingungen.',
      listeningSkills:['Argumentationsstruktur','Grenze individueller Verantwortung','Maßnahme','Haltung','indirekte Aussage','Detail'],
      texts:[{title:'Magazinbeitrag', body:'Sprecherin: Nachhaltiger Konsum wird oft als Frage persönlicher Entscheidungen dargestellt: regional kaufen, weniger Verpackung nutzen oder Geräte länger verwenden. Das ist sinnvoll, stößt aber an Grenzen, wenn nachhaltige Produkte deutlich teurer sind oder Reparaturen kaum angeboten werden. Verbraucherschützer fordern deshalb klare Informationen, längere Garantiezeiten und Regeln gegen geplante Kurzlebigkeit. Wer Verantwortung nur auf Einzelne schiebt, entlastet Unternehmen und Politik zu stark.'}],
      questions:[
        {id:'b2lnc1', skill:'Detail', question:'Welche persönliche Maßnahme wird genannt?', options:[['a','Geräte länger verwenden.'],['b','Mehr Verpackung nutzen.'],['c','Reparaturen verhindern.'],['d','Informationen verstecken.']], correct:'a', explanation:'Geräte länger verwenden wird direkt genannt.'},
        {id:'b2lnc2', skill:'Grenze', question:'Wann stößt nachhaltiger Konsum an Grenzen?', options:[['a','Wenn nachhaltige Produkte teurer sind oder Reparaturen fehlen.'],['b','Wenn Informationen klar sind.'],['c','Wenn Garantiezeiten länger werden.'],['d','Wenn Unternehmen Verantwortung übernehmen.']], correct:'a', explanation:'Teure Produkte und fehlende Reparaturen werden genannt.'},
        {id:'b2lnc3', skill:'Forderung', question:'Was fordern Verbraucherschützer?', options:[['a','Klare Informationen und längere Garantiezeiten.'],['b','Weniger Transparenz.'],['c','Kürzere Lebensdauer von Geräten.'],['d','Keine Reparaturmöglichkeiten.']], correct:'a', explanation:'Das steht im Beitrag.'},
        {id:'b2lnc4', skill:'Begriff', question:'Was bedeutet „geplante Kurzlebigkeit“ im Kontext?', options:[['a','Produkte halten absichtlich nicht lange genug.'],['b','Produkte werden kostenlos repariert.'],['c','Produkte haben sehr lange Garantie.'],['d','Konsum wird vollständig abgeschafft.']], correct:'a', explanation:'Gemeint ist absichtlich kurze Nutzungsdauer.'},
        {id:'b2lnc5', skill:'Indirekte Kritik', question:'Was kritisiert die Sprecherin indirekt?', options:[['a','Verantwortung wird zu stark auf einzelne Konsumenten verlagert.'],['b','Nachhaltige Entscheidungen seien grundsätzlich falsch.'],['c','Unternehmen hätten zu viele Pflichten.'],['d','Politik habe keinen Einfluss.']], correct:'a', explanation:'Der letzte Satz macht diese Kritik deutlich.'},
        {id:'b2lnc6', skill:'Haltung', question:'Welche Haltung passt?', options:[['a','Individuelle Beiträge sind sinnvoll, aber strukturelle Regeln sind nötig.'],['b','Nur Einzelne tragen Verantwortung.'],['c','Nachhaltigkeit ist vollständig sinnlos.'],['d','Unternehmen sollen gar nichts ändern.']], correct:'a', explanation:'Der Beitrag kombiniert individuelle und strukturelle Ebene.'},
        {id:'b2lnc7', skill:'Schlussfolgerung', question:'Welche Maßnahme entspricht der Logik des Beitrags?', options:[['a','Reparaturmöglichkeiten ausbauen und Informationen verbessern.'],['b','Garantien verkürzen.'],['c','Nachhaltige Produkte verstecken.'],['d','Verpackungspflichten erhöhen.']], correct:'a', explanation:'Das entspricht den Forderungen.'},
        {id:'b2lnc8', skill:'Argumentationsstruktur', question:'Wie ist der Beitrag aufgebaut?', options:[['a','Er nennt persönliche Maßnahmen, zeigt Grenzen und fordert Regeln.'],['b','Er erzählt nur eine private Geschichte.'],['c','Er lehnt alle Maßnahmen ab.'],['d','Er nennt nur Vorteile ohne Problem.']], correct:'a', explanation:'Das ist die Struktur des Hörtexts.'}
      ], passScore:76, hardFailHints:['B2 verlangt Erkennen der Argumentationsstruktur.','Einzelne Beispiele reichen nicht.','Strukturelle Kritik ist zentral.']
    },
    {
      id:'b2-listening-data-privacy-hard', variantTitle:'B2 Hören H · Datenschutz/Digitalisierung', title:'Hören · B2 Hardmode · Datenschutz im Alltag', durationMinutes:38,
      intro:'Höre den Beitrag. Achte auf Zielkonflikte zwischen Komfort, Sicherheit und Kontrolle.', audioSimulationNote:'Browser-TTS, Transkript verborgen, maximal zwei Hörvorgänge.', listeningMode:'browser-tts', maxPlays:2, showTranscriptAfterPlays:2, speed:'normal', audioInstruction:'Achte auf Zielkonflikte, nicht nur auf einzelne Begriffe wie Datenschutz oder App.',
      listeningSkills:['Zielkonflikt','Begründung','Begriff im Kontext','indirekte Aussage','Haltung','Detail'],
      texts:[{title:'Radiobeitrag', body:'Sprecher: Viele Menschen nutzen digitale Dienste, weil sie bequem sind: Navigation, Online-Banking oder Gesundheitsapps. Gleichzeitig geben sie dabei Daten preis, deren spätere Nutzung nicht immer nachvollziehbar ist. Datenschützer kritisieren nicht die Technik an sich, sondern unklare Einwilligungen und schwer verständliche Einstellungen. Anbieter argumentieren, personalisierte Dienste seien ohne Daten kaum möglich. Der zentrale Konflikt besteht also zwischen Komfort, wirtschaftlichen Interessen und dem Recht auf Kontrolle über persönliche Informationen.'}],
      questions:[
        {id:'b2ldp1', skill:'Detail', question:'Warum nutzen viele Menschen digitale Dienste?', options:[['a','Weil sie bequem sind.'],['b','Weil sie immer anonym sind.'],['c','Weil sie keine Daten brauchen.'],['d','Weil Einstellungen immer einfach sind.']], correct:'a', explanation:'Bequemlichkeit wird direkt genannt.'},
        {id:'b2ldp2', skill:'Risiko', question:'Was ist laut Beitrag problematisch?', options:[['a','Die spätere Nutzung von Daten ist nicht immer nachvollziehbar.'],['b','Navigation funktioniert nie.'],['c','Online-Banking ist grundsätzlich verboten.'],['d','Gesundheitsapps enthalten keine Daten.']], correct:'a', explanation:'Nicht nachvollziehbare Datennutzung wird kritisiert.'},
        {id:'b2ldp3', skill:'Kritik', question:'Was kritisieren Datenschützer vor allem?', options:[['a','Unklare Einwilligungen und schwer verständliche Einstellungen.'],['b','Technik an sich in jeder Form.'],['c','Dass Menschen überhaupt Apps nutzen.'],['d','Dass Dienste komfortabel sind.']], correct:'a', explanation:'Der Beitrag sagt ausdrücklich: nicht die Technik an sich.'},
        {id:'b2ldp4', skill:'Gegenposition', question:'Wie argumentieren Anbieter?', options:[['a','Personalisierte Dienste seien ohne Daten kaum möglich.'],['b','Daten spielten keine Rolle.'],['c','Einwilligungen müssten nie erklärt werden.'],['d','Kontrolle sei immer unnötig.']], correct:'a', explanation:'Das ist die Gegenposition.'},
        {id:'b2ldp5', skill:'Zielkonflikt', question:'Worin besteht der zentrale Konflikt?', options:[['a','Komfort, wirtschaftliche Interessen und Kontrolle über persönliche Informationen.'],['b','Nur zwischen Handy und Computer.'],['c','Zwischen Navigation und Wetter.'],['d','Nur zwischen Banken und Supermärkten.']], correct:'a', explanation:'Der Konflikt wird am Ende zusammengefasst.'},
        {id:'b2ldp6', skill:'Begriff', question:'Was bedeutet „Einwilligung“ im Kontext?', options:[['a','Zustimmung zur Datennutzung.'],['b','Verbot jeder App.'],['c','Automatische Löschung aller Daten.'],['d','Navigation ohne Internet.']], correct:'a', explanation:'Einwilligung meint Zustimmung.'},
        {id:'b2ldp7', skill:'Haltung', question:'Welche Haltung nimmt der Beitrag ein?', options:[['a','Differenziert: Nutzen und Risiken werden gegeneinander abgewogen.'],['b','Nur technikfeindlich.'],['c','Nur Werbung für Datensammlung.'],['d','Ohne klare Argumente.']], correct:'a', explanation:'Komfort und Datenschutz werden gegeneinander gestellt.'},
        {id:'b2ldp8', skill:'Indirekte Aussage', question:'Welche Aussage ist indirekt zutreffend?', options:[['a','Verständliche Einstellungen sind Voraussetzung für echte Kontrolle.'],['b','Komfort macht Datenschutz überflüssig.'],['c','Alle Daten werden immer transparent genutzt.'],['d','Personalisierte Dienste brauchen nie Daten.']], correct:'a', explanation:'Die Kritik an schwer verständlichen Einstellungen zeigt diese Aussage.'}
      ], passScore:76, hardFailHints:['Zielkonflikte müssen verstanden werden.','Nicht jede Datenschutz-Kritik ist Technikfeindlichkeit.','B2 verlangt Differenzierung zwischen Positionen.']
    }
  ]);

  var grammarPool = freezeList([
  {
    "id": "b2-grammar-connectors-nominal-a",
    "variantTitle": "B2 Grammatik A · Konnektoren/Nominalstil",
    "title": "Grammatik & Sprachbausteine · B2 Hardmode · Argumentation",
    "durationMinutes": 24,
    "intro": "Wähle die präziseste und grammatisch richtige Lösung. B2 verlangt formelle, kohärente und differenzierte Sprache.",
    "passScore": 78,
    "focus": [
      "Konnektoren",
      "Nominalstil",
      "Passiv",
      "Präpositionen",
      "Register"
    ],
    "hardFailHints": [
      "Umgangssprache wird im B2-Hardmode deutlich abgewertet.",
      "Nur einfache weil-Sätze reichen für B2 nicht.",
      "Nominalstil und formelle Konnektoren müssen sicher erkannt werden."
    ],
    "questions": [
      {
        "id": "b2ga1",
        "skill": "Konnektor",
        "question": "___ steigender Kosten bleibt die Nachfrage nach Weiterbildung hoch.",
        "options": [
          [
            "a",
            "Trotz"
          ],
          [
            "b",
            "Weil"
          ],
          [
            "c",
            "Damit"
          ],
          [
            "d",
            "Obwohl"
          ]
        ],
        "correct": "a",
        "explanation": "Trotz + Genitiv/Nomen passt hier präzise."
      },
      {
        "id": "b2ga2",
        "skill": "Konnektor",
        "question": "Die Maßnahme ist sinnvoll, ___ sie sozial abgefedert wird.",
        "options": [
          [
            "a",
            "vorausgesetzt, dass"
          ],
          [
            "b",
            "trotzdem"
          ],
          [
            "c",
            "anstatt"
          ],
          [
            "d",
            "je nachdem"
          ]
        ],
        "correct": "a",
        "explanation": "vorausgesetzt, dass drückt eine Bedingung aus."
      },
      {
        "id": "b2ga3",
        "skill": "Nominalstil",
        "question": "Welche Formulierung ist am formellsten?",
        "options": [
          [
            "a",
            "Weil die Kosten steigen, diskutieren viele darüber."
          ],
          [
            "b",
            "Aufgrund steigender Kosten wird eine Anpassung diskutiert."
          ],
          [
            "c",
            "Die Kosten sind halt hoch."
          ],
          [
            "d",
            "Kosten steigen und man redet."
          ]
        ],
        "correct": "b",
        "explanation": "Aufgrund + Genitiv und Passiv wirken formell."
      },
      {
        "id": "b2ga4",
        "skill": "Passiv",
        "question": "Der Antrag ___ bis Freitag eingereicht werden.",
        "options": [
          [
            "a",
            "muss"
          ],
          [
            "b",
            "muss werden"
          ],
          [
            "c",
            "wird müssen"
          ],
          [
            "d",
            "hat müssen"
          ]
        ],
        "correct": "a",
        "explanation": "Modalverb + Infinitiv Passiv: muss eingereicht werden."
      },
      {
        "id": "b2ga5",
        "skill": "Präposition",
        "question": "Viele Teilnehmende profitieren ___ einer klaren Rückmeldung.",
        "options": [
          [
            "a",
            "von"
          ],
          [
            "b",
            "an"
          ],
          [
            "c",
            "über"
          ],
          [
            "d",
            "für"
          ]
        ],
        "correct": "a",
        "explanation": "profitieren von + Dativ."
      },
      {
        "id": "b2ga6",
        "skill": "Register",
        "question": "Welche Aussage ist B2-prüfungsnah?",
        "options": [
          [
            "a",
            "Das ist voll schlecht."
          ],
          [
            "b",
            "Diese Entwicklung ist problematisch, weil sie einzelne Gruppen benachteiligen kann."
          ],
          [
            "c",
            "Alle sollen einfach klarkommen."
          ],
          [
            "d",
            "Ist halt so."
          ]
        ],
        "correct": "b",
        "explanation": "Sachlich, differenziert, begründet."
      },
      {
        "id": "b2ga7",
        "skill": "Kohärenz",
        "question": "Welche Verbindung passt zu einem zusätzlichen Argument?",
        "options": [
          [
            "a",
            "Darüber hinaus"
          ],
          [
            "b",
            "Naja"
          ],
          [
            "c",
            "Egal"
          ],
          [
            "d",
            "Krass"
          ]
        ],
        "correct": "a",
        "explanation": "Darüber hinaus ist ein formeller additiver Konnektor."
      },
      {
        "id": "b2ga8",
        "skill": "Relativsatz",
        "question": "Die Personen, ___ beruflich stark belastet sind, brauchen flexible Lernzeiten.",
        "options": [
          [
            "a",
            "die"
          ],
          [
            "b",
            "denen"
          ],
          [
            "c",
            "deren"
          ],
          [
            "d",
            "welchen der"
          ]
        ],
        "correct": "a",
        "explanation": "Subjekt im Relativsatz: die."
      }
    ]
  },
  {
    "id": "b2-grammar-passive-reported-b",
    "variantTitle": "B2 Grammatik B · Passiv/indirekte Rede",
    "title": "Grammatik & Sprachbausteine · B2 Hardmode · Berichtssprache",
    "durationMinutes": 24,
    "intro": "Prüfe Passivformen, indirekte Rede und sachliche Berichtssprache.",
    "passScore": 78,
    "focus": [
      "Passiv",
      "indirekte Rede",
      "Konjunktiv I/II",
      "Berichtssprache"
    ],
    "hardFailHints": [
      "B2 verlangt Distanzierung von fremden Aussagen.",
      "Aktiv/Passiv-Verwechslungen senken die Punktzahl stark.",
      "Unklare Quellenangaben wirken nicht prüfungsreif."
    ],
    "questions": [
      {
        "id": "b2gb1",
        "skill": "Passiv Präsens",
        "question": "Die Ergebnisse ___ regelmäßig überprüft.",
        "options": [
          [
            "a",
            "werden"
          ],
          [
            "b",
            "wurden"
          ],
          [
            "c",
            "sind"
          ],
          [
            "d",
            "haben"
          ]
        ],
        "correct": "a",
        "explanation": "Passiv Präsens: werden überprüft."
      },
      {
        "id": "b2gb2",
        "skill": "Passiv Präteritum",
        "question": "Im letzten Jahr ___ neue Regeln eingeführt.",
        "options": [
          [
            "a",
            "wurden"
          ],
          [
            "b",
            "werden"
          ],
          [
            "c",
            "haben"
          ],
          [
            "d",
            "sind geworden"
          ]
        ],
        "correct": "a",
        "explanation": "Passiv Präteritum: wurden eingeführt."
      },
      {
        "id": "b2gb3",
        "skill": "Indirekte Rede",
        "question": "Der Sprecher sagte, die Maßnahme ___ notwendig.",
        "options": [
          [
            "a",
            "sei"
          ],
          [
            "b",
            "ist"
          ],
          [
            "c",
            "war gewesen"
          ],
          [
            "d",
            "wäre gewesen sein"
          ]
        ],
        "correct": "a",
        "explanation": "Konjunktiv I für indirekte Rede: sei."
      },
      {
        "id": "b2gb4",
        "skill": "Indirekte Rede Plural",
        "question": "Die Expertinnen erklärten, die Kosten ___ langfristig sinken.",
        "options": [
          [
            "a",
            "würden"
          ],
          [
            "b",
            "werden"
          ],
          [
            "c",
            "sind"
          ],
          [
            "d",
            "haben"
          ]
        ],
        "correct": "a",
        "explanation": "würden + Infinitiv als Ersatzform in indirekter Rede."
      },
      {
        "id": "b2gb5",
        "skill": "Berichtssprache",
        "question": "Welche Formulierung ist am neutralsten?",
        "options": [
          [
            "a",
            "Die Firma behauptet frech."
          ],
          [
            "b",
            "Das Unternehmen teilte mit, dass ..."
          ],
          [
            "c",
            "Die sagen halt."
          ],
          [
            "d",
            "Alle lügen wahrscheinlich."
          ]
        ],
        "correct": "b",
        "explanation": "Neutraler Berichtsstil ohne Wertung."
      },
      {
        "id": "b2gb6",
        "skill": "Passiv mit Modalverb",
        "question": "Die Daten ___ transparent erklärt werden.",
        "options": [
          [
            "a",
            "müssen"
          ],
          [
            "b",
            "müssen werden"
          ],
          [
            "c",
            "werden müssen erklärt"
          ],
          [
            "d",
            "haben erklärt"
          ]
        ],
        "correct": "a",
        "explanation": "müssen + Partizip II + werden."
      },
      {
        "id": "b2gb7",
        "skill": "Partizipialstil",
        "question": "Welche Formulierung ist korrekt?",
        "options": [
          [
            "a",
            "die im Bericht genannten Maßnahmen"
          ],
          [
            "b",
            "die im Bericht nennen Maßnahmen"
          ],
          [
            "c",
            "die genannt im Bericht Maßnahmen"
          ],
          [
            "d",
            "die Maßnahmen genennt im Bericht"
          ]
        ],
        "correct": "a",
        "explanation": "Partizip II vor dem Nomen mit korrekter Endung."
      },
      {
        "id": "b2gb8",
        "skill": "Konjunktiv II",
        "question": "Eine Verbesserung ___ möglich, wenn mehr Personal eingestellt würde.",
        "options": [
          [
            "a",
            "wäre"
          ],
          [
            "b",
            "ist"
          ],
          [
            "c",
            "war"
          ],
          [
            "d",
            "hat"
          ]
        ],
        "correct": "a",
        "explanation": "Konjunktiv II für hypothetische Aussage: wäre."
      }
    ]
  },
  {
    "id": "b2-grammar-text-cohesion-c",
    "variantTitle": "B2 Grammatik C · Textkohärenz/Konnektoren",
    "title": "Grammatik & Sprachbausteine · B2 Hardmode · Textaufbau",
    "durationMinutes": 24,
    "intro": "Wähle die Verbindung, die den Gedankengang logisch und stilistisch passend macht.",
    "passScore": 78,
    "focus": [
      "Textkohärenz",
      "Konnektoren",
      "Argumentationslogik",
      "Satzverknüpfung"
    ],
    "hardFailHints": [
      "B2 verlangt logische Übergänge, nicht nur richtige Einzelwörter.",
      "Falsche Konnektoren können die Argumentation kippen.",
      "Umgangssprachliche Übergänge sind nicht ausreichend."
    ],
    "questions": [
      {
        "id": "b2gc1",
        "skill": "Konzession",
        "question": "___ die Vorteile offensichtlich sind, bleiben einige Risiken bestehen.",
        "options": [
          [
            "a",
            "Obwohl"
          ],
          [
            "b",
            "Weil"
          ],
          [
            "c",
            "Damit"
          ],
          [
            "d",
            "Sobald"
          ]
        ],
        "correct": "a",
        "explanation": "Obwohl leitet einen Gegengrund ein."
      },
      {
        "id": "b2gc2",
        "skill": "Folge",
        "question": "Die Nachfrage steigt deutlich; ___ müssen Anbieter ihre Kapazitäten erweitern.",
        "options": [
          [
            "a",
            "deshalb"
          ],
          [
            "b",
            "trotzdem"
          ],
          [
            "c",
            "anstatt"
          ],
          [
            "d",
            "während"
          ]
        ],
        "correct": "a",
        "explanation": "deshalb zeigt die Folge."
      },
      {
        "id": "b2gc3",
        "skill": "Gegensatz",
        "question": "Viele profitieren vom Homeoffice. ___ fehlt manchen der direkte Austausch.",
        "options": [
          [
            "a",
            "Allerdings"
          ],
          [
            "b",
            "Außerdem"
          ],
          [
            "c",
            "Zunächst"
          ],
          [
            "d",
            "Beispielsweise"
          ]
        ],
        "correct": "a",
        "explanation": "Allerdings markiert einen Gegensatz/Einschränkung."
      },
      {
        "id": "b2gc4",
        "skill": "Beispiel",
        "question": "Digitale Angebote können flexibel sein. ___ lassen sich Kurse abends besuchen.",
        "options": [
          [
            "a",
            "Beispielsweise"
          ],
          [
            "b",
            "Dennoch"
          ],
          [
            "c",
            "Folglich nicht"
          ],
          [
            "d",
            "Trotzdem dass"
          ]
        ],
        "correct": "a",
        "explanation": "Beispielsweise führt ein Beispiel ein."
      },
      {
        "id": "b2gc5",
        "skill": "Bedingung",
        "question": "Das Modell funktioniert nur, ___ die technische Ausstattung zuverlässig ist.",
        "options": [
          [
            "a",
            "wenn"
          ],
          [
            "b",
            "weil"
          ],
          [
            "c",
            "obwohl"
          ],
          [
            "d",
            "trotz"
          ]
        ],
        "correct": "a",
        "explanation": "wenn drückt die Bedingung aus."
      },
      {
        "id": "b2gc6",
        "skill": "Ziel",
        "question": "Viele Betriebe investieren in Weiterbildung, ___ Fachkräfte langfristig zu halten.",
        "options": [
          [
            "a",
            "um"
          ],
          [
            "b",
            "trotz"
          ],
          [
            "c",
            "obwohl"
          ],
          [
            "d",
            "während"
          ]
        ],
        "correct": "a",
        "explanation": "um ... zu drückt ein Ziel aus."
      },
      {
        "id": "b2gc7",
        "skill": "Abwägung",
        "question": "Welche Formulierung leitet eine ausgewogene Schlussfolgerung ein?",
        "options": [
          [
            "a",
            "Zusammenfassend lässt sich sagen, dass ..."
          ],
          [
            "b",
            "Ist halt so."
          ],
          [
            "c",
            "Egal was passiert."
          ],
          [
            "d",
            "Keiner weiß irgendwas."
          ]
        ],
        "correct": "a",
        "explanation": "Sachliche Schlussformel für B2."
      },
      {
        "id": "b2gc8",
        "skill": "Satzstellung",
        "question": "Nur wenn Alternativen zuverlässig sind, ___ Verbote akzeptiert.",
        "options": [
          [
            "a",
            "werden"
          ],
          [
            "b",
            "Verbote werden"
          ],
          [
            "c",
            "akzeptiert werden"
          ],
          [
            "d",
            "werden akzeptieren"
          ]
        ],
        "correct": "a",
        "explanation": "Inversion nach vorangestelltem Nebensatz: werden Verbote akzeptiert."
      }
    ]
  },
  {
    "id": "b2-grammar-prepositions-case-d",
    "variantTitle": "B2 Grammatik D · Präpositionen/Kasus",
    "title": "Grammatik & Sprachbausteine · B2 Hardmode · Präzision",
    "durationMinutes": 24,
    "intro": "B2 verlangt sichere Präpositionen und Kasus in formellen Kontexten.",
    "passScore": 78,
    "focus": [
      "Präpositionen",
      "Kasus",
      "Verb-Nomen-Verbindungen",
      "formelle Genauigkeit"
    ],
    "hardFailHints": [
      "Falsche Präpositionen verändern oft die Bedeutung.",
      "B2 erwartet sichere feste Verbindungen.",
      "Kasusfehler werden im Hardmode strenger bewertet."
    ],
    "questions": [
      {
        "id": "b2gd1",
        "skill": "Präposition",
        "question": "Viele Menschen zweifeln ___ der Wirksamkeit der Reform.",
        "options": [
          [
            "a",
            "an"
          ],
          [
            "b",
            "auf"
          ],
          [
            "c",
            "für"
          ],
          [
            "d",
            "über"
          ]
        ],
        "correct": "a",
        "explanation": "zweifeln an + Dativ."
      },
      {
        "id": "b2gd2",
        "skill": "Präposition",
        "question": "Die Entscheidung hängt ___ mehreren Faktoren ab.",
        "options": [
          [
            "a",
            "von"
          ],
          [
            "b",
            "mit"
          ],
          [
            "c",
            "an"
          ],
          [
            "d",
            "gegen"
          ]
        ],
        "correct": "a",
        "explanation": "abhängen von + Dativ."
      },
      {
        "id": "b2gd3",
        "skill": "Präposition",
        "question": "Es mangelt ___ bezahlbarem Wohnraum.",
        "options": [
          [
            "a",
            "an"
          ],
          [
            "b",
            "auf"
          ],
          [
            "c",
            "über"
          ],
          [
            "d",
            "für"
          ]
        ],
        "correct": "a",
        "explanation": "mangeln an + Dativ."
      },
      {
        "id": "b2gd4",
        "skill": "Präposition",
        "question": "Die Kritik richtet sich ___ die fehlende Transparenz.",
        "options": [
          [
            "a",
            "gegen"
          ],
          [
            "b",
            "an"
          ],
          [
            "c",
            "mit"
          ],
          [
            "d",
            "aus"
          ]
        ],
        "correct": "a",
        "explanation": "sich richten gegen + Akkusativ."
      },
      {
        "id": "b2gd5",
        "skill": "Kasus",
        "question": "Trotz ___ Nachfrage bleiben die Preise stabil.",
        "options": [
          [
            "a",
            "hoher"
          ],
          [
            "b",
            "hohe"
          ],
          [
            "c",
            "hohen"
          ],
          [
            "d",
            "hohem"
          ]
        ],
        "correct": "a",
        "explanation": "Trotz + Genitiv: hoher Nachfrage."
      },
      {
        "id": "b2gd6",
        "skill": "Kasus",
        "question": "Wegen ___ technischen Probleme wurde der Termin verschoben.",
        "options": [
          [
            "a",
            "der"
          ],
          [
            "b",
            "die"
          ],
          [
            "c",
            "den"
          ],
          [
            "d",
            "dem"
          ]
        ],
        "correct": "a",
        "explanation": "Wegen + Genitiv/Dativ; hier korrekt und standardsprachlich: der technischen Probleme."
      },
      {
        "id": "b2gd7",
        "skill": "Verbindung",
        "question": "Die Studie weist ___ mehrere Risiken hin.",
        "options": [
          [
            "a",
            "auf"
          ],
          [
            "b",
            "an"
          ],
          [
            "c",
            "über"
          ],
          [
            "d",
            "von"
          ]
        ],
        "correct": "a",
        "explanation": "hinweisen auf + Akkusativ."
      },
      {
        "id": "b2gd8",
        "skill": "Verbindung",
        "question": "Die Maßnahme trägt ___ Verbesserung der Situation bei.",
        "options": [
          [
            "a",
            "zur"
          ],
          [
            "b",
            "auf die"
          ],
          [
            "c",
            "über die"
          ],
          [
            "d",
            "von der"
          ]
        ],
        "correct": "a",
        "explanation": "beitragen zu + Dativ: zur Verbesserung."
      }
    ]
  },
  {
    "id": "b2-grammar-nominalization-e",
    "variantTitle": "B2 Grammatik E · Nominalisierung/Umformung",
    "title": "Grammatik & Sprachbausteine · B2 Hardmode · Nominalstil",
    "durationMinutes": 24,
    "intro": "Formuliere komplexe Sachverhalte nominal und präzise.",
    "passScore": 78,
    "focus": [
      "Nominalisierung",
      "formeller Stil",
      "Satzumformung",
      "Präzision"
    ],
    "hardFailHints": [
      "B2 verlangt auch formelle Alternativen zu einfachen Nebensätzen.",
      "Nominalisierungen dürfen die Bedeutung nicht verfälschen.",
      "Zu lockere Alltagssprache ist nicht ausreichend."
    ],
    "questions": [
      {
        "id": "b2ge1",
        "skill": "Nominalisierung",
        "question": "Welche Umformung passt? „Weil die Preise steigen, sparen viele Haushalte.“",
        "options": [
          [
            "a",
            "Aufgrund steigender Preise sparen viele Haushalte."
          ],
          [
            "b",
            "Trotz Preise sparen viele."
          ],
          [
            "c",
            "Preise steigen, darum halt sparen."
          ],
          [
            "d",
            "Durch die steigen Preise sparen Haushalte."
          ]
        ],
        "correct": "a",
        "explanation": "Aufgrund + Genitiv/Nominalisierung ist korrekt."
      },
      {
        "id": "b2ge2",
        "skill": "Nominalisierung",
        "question": "Welche Form ist korrekt? „Wenn der Antrag geprüft wird ...“",
        "options": [
          [
            "a",
            "Nach Prüfung des Antrags ..."
          ],
          [
            "b",
            "Nach prüfen den Antrag ..."
          ],
          [
            "c",
            "Nachdem Prüfung Antrag ..."
          ],
          [
            "d",
            "Bei der Antrag prüft ..."
          ]
        ],
        "correct": "a",
        "explanation": "Nach Prüfung des Antrags ist formeller Nominalstil."
      },
      {
        "id": "b2ge3",
        "skill": "Nominalstil",
        "question": "Welche Formulierung ist B2-typisch?",
        "options": [
          [
            "a",
            "Die Einführung flexibler Arbeitszeiten kann die Vereinbarkeit verbessern."
          ],
          [
            "b",
            "Man macht Zeiten anders und es ist besser."
          ],
          [
            "c",
            "Arbeitszeiten flexibel gut."
          ],
          [
            "d",
            "Alle haben dann easy Zeit."
          ]
        ],
        "correct": "a",
        "explanation": "Nominalisierung und präzise Aussage."
      },
      {
        "id": "b2ge4",
        "skill": "Umformung",
        "question": "„Obwohl die Maßnahme teuer ist ...“ → nominal:",
        "options": [
          [
            "a",
            "Trotz der hohen Kosten ..."
          ],
          [
            "b",
            "Weil hohe Kosten ..."
          ],
          [
            "c",
            "Trotzdem teuer Maßnahme ..."
          ],
          [
            "d",
            "Mit teuer Kosten ..."
          ]
        ],
        "correct": "a",
        "explanation": "Trotz + Genitiv drückt Konzession nominal aus."
      },
      {
        "id": "b2ge5",
        "skill": "Nominalisierung",
        "question": "Welche Wendung passt in einen formellen Text?",
        "options": [
          [
            "a",
            "die Verbesserung der Infrastruktur"
          ],
          [
            "b",
            "Infrastruktur besser machen halt"
          ],
          [
            "c",
            "besser Infrastruktur tun"
          ],
          [
            "d",
            "alles besser Straße"
          ]
        ],
        "correct": "a",
        "explanation": "Formell und nominal."
      },
      {
        "id": "b2ge6",
        "skill": "Satzbau",
        "question": "Welche Variante ist korrekt?",
        "options": [
          [
            "a",
            "Die zunehmende Digitalisierung verändert die Arbeitswelt."
          ],
          [
            "b",
            "Die zunehmen Digitalisierung verändert."
          ],
          [
            "c",
            "Digitalisierung zunehmend die Arbeitswelt verändert."
          ],
          [
            "d",
            "Die Digitalisierung zunehmend verändert Arbeitswelt die."
          ]
        ],
        "correct": "a",
        "explanation": "Korrekte Adjektivendung und Satzstellung."
      },
      {
        "id": "b2ge7",
        "skill": "Präzision",
        "question": "Welche Formulierung ist am präzisesten?",
        "options": [
          [
            "a",
            "eine deutliche Verringerung der Wartezeiten"
          ],
          [
            "b",
            "weniger warten und so"
          ],
          [
            "c",
            "Wartezeit bisschen besser"
          ],
          [
            "d",
            "alles schneller irgendwie"
          ]
        ],
        "correct": "a",
        "explanation": "Präzise nominale Formulierung."
      },
      {
        "id": "b2ge8",
        "skill": "Register",
        "question": "Welche Formulierung passt zu einer Stellungnahme?",
        "options": [
          [
            "a",
            "Aus diesem Grund sollte die Maßnahme schrittweise eingeführt werden."
          ],
          [
            "b",
            "Darum mach das einfach."
          ],
          [
            "c",
            "Ich sag mal, los jetzt."
          ],
          [
            "d",
            "Das ist eh egal."
          ]
        ],
        "correct": "a",
        "explanation": "Sachlich, begründet, formell."
      }
    ]
  },
  {
    "id": "b2-grammar-sentence-order-f",
    "variantTitle": "B2 Grammatik F · Satzstellung/Komplexe Sätze",
    "title": "Grammatik & Sprachbausteine · B2 Hardmode · Satzbau",
    "durationMinutes": 24,
    "intro": "Achte auf Verbposition, Nebensatzstruktur und komplexe Satzverbindungen.",
    "passScore": 78,
    "focus": [
      "Satzstellung",
      "Nebensätze",
      "Inversion",
      "Infinitivgruppen"
    ],
    "hardFailHints": [
      "B2-Sätze müssen auch bei komplexer Struktur korrekt bleiben.",
      "Verbposition ist ein Kernkriterium.",
      "Unverbundene Hauptsätze wirken unter Niveau."
    ],
    "questions": [
      {
        "id": "b2gf1",
        "skill": "Satzstellung",
        "question": "Welche Satzstellung ist korrekt?",
        "options": [
          [
            "a",
            "Weil die Nachfrage steigt, müssen mehr Kurse angeboten werden."
          ],
          [
            "b",
            "Weil steigt die Nachfrage, mehr Kurse müssen."
          ],
          [
            "c",
            "Weil die Nachfrage steigt, mehr Kurse müssen angeboten werden."
          ],
          [
            "d",
            "Die Nachfrage weil steigt, müssen Kurse."
          ]
        ],
        "correct": "a",
        "explanation": "Verb am Ende im Nebensatz, Inversion im Hauptsatz."
      },
      {
        "id": "b2gf2",
        "skill": "Inversion",
        "question": "Nach der Einführung der App ___ viele Prozesse schneller.",
        "options": [
          [
            "a",
            "wurden"
          ],
          [
            "b",
            "viele Prozesse wurden"
          ],
          [
            "c",
            "schneller wurden"
          ],
          [
            "d",
            "haben wurden"
          ]
        ],
        "correct": "a",
        "explanation": "Nach vorangestellter Angabe steht das finite Verb an Position 2."
      },
      {
        "id": "b2gf3",
        "skill": "Infinitivgruppe",
        "question": "Welche Form ist korrekt?",
        "options": [
          [
            "a",
            "Es ist wichtig, die Regeln transparent zu erklären."
          ],
          [
            "b",
            "Es ist wichtig die Regeln transparent erklären."
          ],
          [
            "c",
            "Wichtig ist, erklären transparent Regeln."
          ],
          [
            "d",
            "Es wichtig zu die Regeln erklärt."
          ]
        ],
        "correct": "a",
        "explanation": "Infinitivgruppe mit zu."
      },
      {
        "id": "b2gf4",
        "skill": "Nebensatz",
        "question": "Die Stadt plant Maßnahmen, ___ der Verkehr reduziert wird.",
        "options": [
          [
            "a",
            "damit"
          ],
          [
            "b",
            "weil"
          ],
          [
            "c",
            "obwohl"
          ],
          [
            "d",
            "denn"
          ]
        ],
        "correct": "a",
        "explanation": "damit drückt Ziel aus."
      },
      {
        "id": "b2gf5",
        "skill": "Relativsatz",
        "question": "Das Konzept, ___ im Bericht vorgestellt wurde, ist umstritten.",
        "options": [
          [
            "a",
            "das"
          ],
          [
            "b",
            "der"
          ],
          [
            "c",
            "den"
          ],
          [
            "d",
            "dem"
          ]
        ],
        "correct": "a",
        "explanation": "Neutrum: das Konzept, das ..."
      },
      {
        "id": "b2gf6",
        "skill": "Korrelat",
        "question": "Je zuverlässiger der Nahverkehr ist, ___ Menschen steigen um.",
        "options": [
          [
            "a",
            "desto mehr"
          ],
          [
            "b",
            "weil mehr"
          ],
          [
            "c",
            "trotzdem mehr"
          ],
          [
            "d",
            "obwohl mehr"
          ]
        ],
        "correct": "a",
        "explanation": "Je ... desto ..."
      },
      {
        "id": "b2gf7",
        "skill": "Zweiteiliger Konnektor",
        "question": "Nicht nur die Kosten, ___ auch die Qualität spielt eine Rolle.",
        "options": [
          [
            "a",
            "sondern"
          ],
          [
            "b",
            "aber"
          ],
          [
            "c",
            "weil"
          ],
          [
            "d",
            "damit"
          ]
        ],
        "correct": "a",
        "explanation": "Nicht nur ..., sondern auch ..."
      },
      {
        "id": "b2gf8",
        "skill": "Satzverbindung",
        "question": "Welche Verbindung ist korrekt?",
        "options": [
          [
            "a",
            "Einerseits spart Homeoffice Zeit, andererseits kann der Austausch leiden."
          ],
          [
            "b",
            "Einerseits spart Homeoffice, weil andererseits Austausch."
          ],
          [
            "c",
            "Homeoffice spart einerseits andererseits leidet."
          ],
          [
            "d",
            "Einerseits und andererseits aber weil."
          ]
        ],
        "correct": "a",
        "explanation": "Korrekte zweiteilige Struktur."
      }
    ]
  },
  {
    "id": "b2-grammar-adjective-participle-g",
    "variantTitle": "B2 Grammatik G · Adjektive/Partizipien",
    "title": "Grammatik & Sprachbausteine · B2 Hardmode · Beschreibungsgenauigkeit",
    "durationMinutes": 24,
    "intro": "Prüfe Adjektivendungen, Partizipialattribute und präzise Beschreibung.",
    "passScore": 78,
    "focus": [
      "Adjektivendungen",
      "Partizipialattribute",
      "Nomenbegleiter",
      "Genauigkeit"
    ],
    "hardFailHints": [
      "B2 erwartet sichere Endungen in häufigen formellen Strukturen.",
      "Partizipialattribute müssen grammatisch stimmen.",
      "Falsche Endungen können Verständlichkeit und Niveau senken."
    ],
    "questions": [
      {
        "id": "b2gg1",
        "skill": "Adjektivendung",
        "question": "Die ___ Entwicklung stellt viele Betriebe vor Herausforderungen.",
        "options": [
          [
            "a",
            "digitale"
          ],
          [
            "b",
            "digitaler"
          ],
          [
            "c",
            "digitalen"
          ],
          [
            "d",
            "digitales"
          ]
        ],
        "correct": "a",
        "explanation": "Nominativ feminin: die digitale Entwicklung."
      },
      {
        "id": "b2gg2",
        "skill": "Adjektivendung",
        "question": "Mit ___ Angeboten können mehr Menschen erreicht werden.",
        "options": [
          [
            "a",
            "flexiblen"
          ],
          [
            "b",
            "flexible"
          ],
          [
            "c",
            "flexibler"
          ],
          [
            "d",
            "flexibles"
          ]
        ],
        "correct": "a",
        "explanation": "Mit + Dativ Plural: flexiblen Angeboten."
      },
      {
        "id": "b2gg3",
        "skill": "Partizip",
        "question": "Die im Bericht ___ Zahlen zeigen einen Trend.",
        "options": [
          [
            "a",
            "genannten"
          ],
          [
            "b",
            "genannte"
          ],
          [
            "c",
            "nennenden"
          ],
          [
            "d",
            "genanntes"
          ]
        ],
        "correct": "a",
        "explanation": "Plural mit Artikel: genannten Zahlen."
      },
      {
        "id": "b2gg4",
        "skill": "Partizip",
        "question": "Die zunehmend ___ Mieten belasten Haushalte.",
        "options": [
          [
            "a",
            "steigenden"
          ],
          [
            "b",
            "gestiegen"
          ],
          [
            "c",
            "steigen"
          ],
          [
            "d",
            "stiegenden"
          ]
        ],
        "correct": "a",
        "explanation": "Partizip I als Attribut: steigenden Mieten."
      },
      {
        "id": "b2gg5",
        "skill": "Adjektivendung",
        "question": "Trotz ___ Kritik wurde das Projekt fortgesetzt.",
        "options": [
          [
            "a",
            "starker"
          ],
          [
            "b",
            "starke"
          ],
          [
            "c",
            "starkem"
          ],
          [
            "d",
            "starken"
          ]
        ],
        "correct": "a",
        "explanation": "Trotz + Genitiv feminin: starker Kritik."
      },
      {
        "id": "b2gg6",
        "skill": "Adjektivendung",
        "question": "Für ___ Beschäftigte ist Weiterbildung besonders wichtig.",
        "options": [
          [
            "a",
            "viele"
          ],
          [
            "b",
            "vielen"
          ],
          [
            "c",
            "vieler"
          ],
          [
            "d",
            "vielem"
          ]
        ],
        "correct": "a",
        "explanation": "Akkusativ Plural ohne Artikel: viele Beschäftigte."
      },
      {
        "id": "b2gg7",
        "skill": "Partizipialattribut",
        "question": "Welche Form ist korrekt?",
        "options": [
          [
            "a",
            "die von Experten empfohlene Maßnahme"
          ],
          [
            "b",
            "die von Experten empfehlen Maßnahme"
          ],
          [
            "c",
            "die empfohlen von Experten Maßnahme"
          ],
          [
            "d",
            "die Experte empfohlene Maßnahme"
          ]
        ],
        "correct": "a",
        "explanation": "Korrektes Partizipialattribut."
      },
      {
        "id": "b2gg8",
        "skill": "Präzision",
        "question": "Welche Formulierung ist genauer?",
        "options": [
          [
            "a",
            "eine langfristig tragfähige Lösung"
          ],
          [
            "b",
            "eine gute Sache"
          ],
          [
            "c",
            "irgendwie besser"
          ],
          [
            "d",
            "passt schon"
          ]
        ],
        "correct": "a",
        "explanation": "B2 braucht präzise Beschreibung."
      }
    ]
  },
  {
    "id": "b2-grammar-register-error-h",
    "variantTitle": "B2 Grammatik H · Register/Fehlerkorrektur",
    "title": "Grammatik & Sprachbausteine · B2 Hardmode · Korrektur",
    "durationMinutes": 24,
    "intro": "Erkenne formell angemessene Varianten und typische Fehler in B2-Texten.",
    "passScore": 78,
    "focus": [
      "Register",
      "Fehlerkorrektur",
      "Wortwahl",
      "Satzpräzision"
    ],
    "hardFailHints": [
      "B2-Hardmode akzeptiert keine durchgehend umgangssprachliche Prüfungssprache.",
      "Gute Grammatik allein reicht ohne Register nicht.",
      "Fehler müssen nicht nur erkannt, sondern passend korrigiert werden."
    ],
    "questions": [
      {
        "id": "b2gh1",
        "skill": "Register",
        "question": "Welche Formulierung passt in eine formelle Beschwerde?",
        "options": [
          [
            "a",
            "Ich bitte Sie daher um eine zeitnahe Rückmeldung."
          ],
          [
            "b",
            "Meldet euch mal schnell."
          ],
          [
            "c",
            "Das war mega nervig."
          ],
          [
            "d",
            "Ich will sofort mein Geld, sonst Stress."
          ]
        ],
        "correct": "a",
        "explanation": "Höflich, formell, klar."
      },
      {
        "id": "b2gh2",
        "skill": "Fehlerkorrektur",
        "question": "Welche Variante korrigiert den Satz? „Ich interessiere mich für an dem Kurs.“",
        "options": [
          [
            "a",
            "Ich interessiere mich für den Kurs."
          ],
          [
            "b",
            "Ich interessiere mich an den Kurs."
          ],
          [
            "c",
            "Ich interessiere für dem Kurs."
          ],
          [
            "d",
            "Ich interessiere mich wegen Kurs."
          ]
        ],
        "correct": "a",
        "explanation": "sich interessieren für + Akkusativ."
      },
      {
        "id": "b2gh3",
        "skill": "Register",
        "question": "Welche Wendung ist für eine Stellungnahme geeignet?",
        "options": [
          [
            "a",
            "Aus meiner Sicht überwiegen die Vorteile, sofern klare Regeln gelten."
          ],
          [
            "b",
            "Ich find das halt nice."
          ],
          [
            "c",
            "Das ist voll okay."
          ],
          [
            "d",
            "Man kann machen, egal."
          ]
        ],
        "correct": "a",
        "explanation": "Differenziert und begründet."
      },
      {
        "id": "b2gh4",
        "skill": "Fehlerkorrektur",
        "question": "Welche Korrektur ist richtig? „Die Maßnahme hat viele Vorteile, trotzdem sie teuer ist.“",
        "options": [
          [
            "a",
            "Die Maßnahme hat viele Vorteile, obwohl sie teuer ist."
          ],
          [
            "b",
            "Die Maßnahme hat viele Vorteile, trotzdem teuer ist sie."
          ],
          [
            "c",
            "Die Maßnahme hat Vorteile, weil teuer."
          ],
          [
            "d",
            "Trotzdem die Maßnahme teuer."
          ]
        ],
        "correct": "a",
        "explanation": "Obwohl leitet den Nebensatz korrekt ein."
      },
      {
        "id": "b2gh5",
        "skill": "Wortwahl",
        "question": "Welche Formulierung ist am sachlichsten?",
        "options": [
          [
            "a",
            "Die Umsetzung erscheint unter bestimmten Bedingungen realistisch."
          ],
          [
            "b",
            "Das klappt easy."
          ],
          [
            "c",
            "Das ist kompletter Müll."
          ],
          [
            "d",
            "Jeder weiß doch."
          ]
        ],
        "correct": "a",
        "explanation": "Sachlich und differenziert."
      },
      {
        "id": "b2gh6",
        "skill": "Fehlerkorrektur",
        "question": "Welche Variante ist korrekt? „Es gibt viele Menschen, die braucht mehr Hilfe.“",
        "options": [
          [
            "a",
            "Es gibt viele Menschen, die mehr Hilfe brauchen."
          ],
          [
            "b",
            "Es gibt viele Menschen, die braucht Hilfe mehr."
          ],
          [
            "c",
            "Viele Menschen, brauchen die Hilfe."
          ],
          [
            "d",
            "Es gibt viele Mensch, die Hilfe brauchen."
          ]
        ],
        "correct": "a",
        "explanation": "Korrekte Relativsatzstruktur und Plural."
      },
      {
        "id": "b2gh7",
        "skill": "Register",
        "question": "Welche Schlussformel passt zu einem formellen Schreiben?",
        "options": [
          [
            "a",
            "Für eine Rückmeldung bis Ende der Woche wäre ich Ihnen dankbar."
          ],
          [
            "b",
            "Schreib schnell zurück."
          ],
          [
            "c",
            "Bis dann halt."
          ],
          [
            "d",
            "Mach mal."
          ]
        ],
        "correct": "a",
        "explanation": "Höfliche formelle Schlussformel."
      },
      {
        "id": "b2gh8",
        "skill": "Fehlerkorrektur",
        "question": "Welche Variante ist korrekt? „Aufgrund die Probleme wurde der Kurs abgebrochen.“",
        "options": [
          [
            "a",
            "Aufgrund der Probleme wurde der Kurs abgebrochen."
          ],
          [
            "b",
            "Aufgrund die Probleme ist abgebrochen."
          ],
          [
            "c",
            "Wegen die Probleme wurde Kurs."
          ],
          [
            "d",
            "Aufgrund dem Probleme wurde."
          ]
        ],
        "correct": "a",
        "explanation": "Aufgrund + Genitiv: der Probleme."
      }
    ]
  }
]
  );


  var writingPool = freezeList([
    {
      id:'b2-writing-digital-education',
      variantTitle:'B2 Schreiben A · Stellungnahme digitale Bildung',
      title:'Schreiben · Stellungnahme digitale Bildung',
      prompt:'Schreibe eine strukturierte B2-Stellungnahme zum Thema digitale Bildung. Gehe auf Chancen und Risiken ein, begründe deine eigene Position und nenne ein konkretes Beispiel aus Alltag, Arbeit oder Schule.',
      taskType:'argumentative-opinion',
      register:'halbformell bis sachlich',
      durationMinutes:55,
      requiredPoints:['Thema einführen','mindestens zwei Chancen darstellen','mindestens zwei Risiken darstellen','eigene Position klar begründen','konkretes Beispiel einbauen','differenzierten Schluss formulieren'],
      minWords:180,
      maxWords:280,
      requiredStructure:['Einleitung','Chancen','Risiken','eigene Position','Beispiel','Schluss'],
      assessmentRubric:{ level:'B2', requiredStructure:['Einleitung','Chancen','Risiken','eigene Position','Beispiel','Schluss'], groqInstruction:'Bewerte als sehr strenger B2-Schreibprüfer. Erwartet werden klare Argumentationsstruktur, Pro/Contra, konkrete Beispiele, Kohärenz, passende Konnektoren und niveauangemessener Wortschatz. Eine einfache B1-Alltagsantwort darf nicht als B2 bestehen.' },
      hardFailHints:['Unter 150 Wörtern ist die Antwort für B2 normalerweise nicht ausreichend.','Ohne Pro/Contra maximal eingeschränkt prüfungsreif.','Ohne konkrete eigene Position darf nicht bestanden werden.','Nur allgemeine Sätze ohne Beispiel werden gedeckelt.']
    },
    {
      id:'b2-writing-formal-complaint',
      variantTitle:'B2 Schreiben B · formelle Beschwerde',
      title:'Schreiben · Formelle Beschwerde Online-Seminar',
      prompt:'Du hast an einem beruflichen Online-Seminar teilgenommen. Die Inhalte waren anders angekündigt, technische Probleme wurden nicht gelöst und du möchtest eine teilweise Rückerstattung. Schreibe eine formelle Beschwerde mit Begründung und Lösungsvorschlag.',
      taskType:'formal-complaint',
      register:'formell',
      durationMinutes:55,
      requiredPoints:['formelle Anrede und Anlass','Abweichung zwischen Ankündigung und Realität beschreiben','technisches Problem und Folge erklären','konkrete Forderung nennen','sachlichen höflichen Ton halten','Abschluss mit Erwartung formulieren'],
      minWords:180,
      maxWords:280,
      requiredStructure:['Betreff/Anlass','formelle Anrede','Sachverhalt','Folge','Forderung/Lösung','höflicher Abschluss'],
      assessmentRubric:{ level:'B2', requiredStructure:['Betreff/Anlass','formelle Anrede','Sachverhalt','Folge','Forderung/Lösung','höflicher Abschluss'], groqInstruction:'Bewerte als strenger B2-Prüfer für formelle Kommunikation. Gute Grammatik reicht nicht, wenn Forderung, Sachverhalt, Folge oder sachliches Register fehlen. Aggressive oder informelle Sprache hart deckeln.' },
      hardFailHints:['Aggressiver Ton wird stark gedeckelt.','Ohne konkrete Forderung nicht B2-prüfungsreif.','Ohne nachvollziehbare Begründung maximal mittelmäßig.','Ohne formelle Struktur maximal eingeschränkt.']
    },
    {
      id:'b2-writing-mobility-opinion',
      variantTitle:'B2 Schreiben C · Mobilität/Stadt',
      title:'Schreiben · Argumentativer Beitrag Mobilität',
      prompt:'Schreibe einen argumentativen Beitrag: Sollten Innenstädte stärker autofrei werden? Stelle Vorteile und Nachteile dar, berücksichtige verschiedene Gruppen und formuliere ein begründetes Fazit.',
      taskType:'argumentative-essay',
      register:'sachlich',
      durationMinutes:55,
      requiredPoints:['Thema einführen','Vorteile darstellen','Nachteile darstellen','verschiedene Gruppen berücksichtigen','eigene Position begründen','Fazit formulieren'],
      minWords:180,
      maxWords:280,
      requiredStructure:['Einleitung','Vorteile','Nachteile','Perspektiven verschiedener Gruppen','eigene Meinung','Fazit'],
      assessmentRubric:{ level:'B2', requiredStructure:['Einleitung','Vorteile','Nachteile','Perspektiven verschiedener Gruppen','eigene Meinung','Fazit'], groqInstruction:'Bewerte als strenger B2-Schreibprüfer. Achte auf differenzierte Argumentation, Konnektoren, klare Struktur, angemessenen Wortschatz und einen echten Kompromiss oder begründetes Fazit.' },
      hardFailHints:['Nur eine Seite ohne Gegenargumente reicht nicht.','Ohne Fazit bleibt die Aufgabe unvollständig.','Reine Stichpunkte werden hart abgewertet.','Ohne betroffene Gruppen maximal eingeschränkt.']
    },
    {
      id:'b2-writing-work-four-day-week',
      variantTitle:'B2 Schreiben D · Vier-Tage-Woche',
      title:'Schreiben · Stellungnahme Arbeitszeit',
      prompt:'In einem Kursforum wird diskutiert, ob eine Vier-Tage-Woche bei gleichem Gehalt eingeführt werden sollte. Schreibe eine Stellungnahme. Gehe auf Produktivität, Belastung, Unternehmen und Beschäftigte ein. Begründe deine eigene Meinung.',
      taskType:'forum-opinion',
      register:'sachlich argumentierend',
      durationMinutes:55,
      requiredPoints:['Thema und Diskussion einführen','Vorteile für Beschäftigte erklären','mögliche Nachteile für Betriebe nennen','Produktivität oder Belastung abwägen','eigene Meinung begründen','Schluss/Fazit formulieren'],
      minWords:180,
      maxWords:280,
      requiredStructure:['Einleitung','Pro','Contra','Abwägung','eigene Position','Schluss'],
      assessmentRubric:{ level:'B2', requiredStructure:['Einleitung','Pro','Contra','Abwägung','eigene Position','Schluss'], groqInstruction:'Bewerte streng auf B2-Niveau: Die Antwort muss Arbeitswelt, Produktivität und Belastung differenziert verbinden. Einfache Zustimmung ohne Abwägung darf nicht bestehen.' },
      hardFailHints:['Ohne Abwägung zwischen Beschäftigten und Unternehmen maximal 65 %.','Ohne eigene Meinung maximal 60 %.','Zu kurze Alltagsantworten werden hart gedeckelt.']
    },
    {
      id:'b2-writing-housing-letter',
      variantTitle:'B2 Schreiben E · Wohnen/Miete',
      title:'Schreiben · Formeller Brief an Vermieter',
      prompt:'In deiner Wohnung gibt es seit mehreren Wochen Lärm und Feuchtigkeitsschäden. Der Vermieter hat bisher kaum reagiert. Schreibe einen formellen Brief: Beschreibe die Situation, erkläre die Folgen, fordere eine Lösung und schlage einen Termin vor.',
      taskType:'formal-letter',
      register:'formell',
      durationMinutes:55,
      requiredPoints:['formelle Anrede','Situation genau beschreiben','Folgen für Alltag/Gesundheit erklären','konkrete Forderung stellen','Termin oder Frist vorschlagen','höflichen Abschluss formulieren'],
      minWords:180,
      maxWords:280,
      requiredStructure:['Anrede','Anlass','Beschreibung','Folgen','Forderung/Frist','Abschluss'],
      assessmentRubric:{ level:'B2', requiredStructure:['Anrede','Anlass','Beschreibung','Folgen','Forderung/Frist','Abschluss'], groqInstruction:'Bewerte als strenger B2-Prüfer für formelle Briefe. Inhaltliche Vollständigkeit, sachlicher Ton, konkrete Forderung und strukturierte Darstellung sind Pflicht.' },
      hardFailHints:['Ohne konkrete Forderung nicht B2-prüfungsreif.','Ohne Folgenbeschreibung maximal eingeschränkt.','Informelle oder aggressive Sprache stark deckeln.']
    },
    {
      id:'b2-writing-ai-ethics',
      variantTitle:'B2 Schreiben F · KI und Datenschutz',
      title:'Schreiben · Argumentativer Beitrag KI',
      prompt:'Viele Lernende nutzen KI-Programme für Hausaufgaben und Bewerbungen. Schreibe einen argumentativen Beitrag: Welche Chancen bietet KI, welche Risiken entstehen für Selbstständigkeit und Datenschutz, und unter welchen Bedingungen ist der Einsatz sinnvoll?',
      taskType:'argumentative-essay',
      register:'sachlich',
      durationMinutes:55,
      requiredPoints:['Thema einführen','Chancen von KI erklären','Risiken für Selbstständigkeit nennen','Datenschutz berücksichtigen','Bedingungen für sinnvollen Einsatz formulieren','eigene Position mit Beispiel begründen'],
      minWords:180,
      maxWords:280,
      requiredStructure:['Einleitung','Chancen','Risiken','Datenschutz','Bedingungen','eigene Position'],
      assessmentRubric:{ level:'B2', requiredStructure:['Einleitung','Chancen','Risiken','Datenschutz','Bedingungen','eigene Position'], groqInstruction:'Bewerte streng auf B2: Erwartet werden differenzierte Bedingungen, Datenschutzaspekt und ein konkretes Beispiel. Reines Pro/Kontra ohne Bedingungen reicht nicht.' },
      hardFailHints:['Ohne Datenschutzaspekt maximal 70 %.','Ohne Bedingungen für sinnvollen Einsatz maximal 65 %.','Nur „KI ist gut/schlecht“ reicht nicht.']
    },
    {
      id:'b2-writing-health-workplace',
      variantTitle:'B2 Schreiben G · Gesundheit am Arbeitsplatz',
      title:'Schreiben · Stellungnahme Gesundheit/Arbeit',
      prompt:'In deinem Betrieb wird diskutiert, ob Arbeitgeber stärker für die Gesundheit der Mitarbeitenden verantwortlich sein sollten. Schreibe eine Stellungnahme. Gehe auf Stress, Eigenverantwortung, Kosten und konkrete Maßnahmen ein.',
      taskType:'opinion-with-measures',
      register:'sachlich argumentierend',
      durationMinutes:55,
      requiredPoints:['Thema einordnen','Stress/Belastung erläutern','Eigenverantwortung berücksichtigen','Kosten oder Grenzen nennen','konkrete Maßnahmen vorschlagen','eigene Position begründen'],
      minWords:180,
      maxWords:280,
      requiredStructure:['Einleitung','Problem','Gegenposition/Grenzen','Maßnahmen','eigene Position','Schluss'],
      assessmentRubric:{ level:'B2', requiredStructure:['Einleitung','Problem','Gegenposition/Grenzen','Maßnahmen','eigene Position','Schluss'], groqInstruction:'Bewerte als strenger B2-Schreibprüfer. Gute Antwort braucht konkrete Maßnahmen und eine Abwägung zwischen Arbeitgeberverantwortung und Eigenverantwortung.' },
      hardFailHints:['Ohne konkrete Maßnahmen maximal 65 %.','Ohne Gegenposition/Grenzen maximal 70 %.','Reine Beschwerde ohne Argumentation reicht nicht.']
    },
    {
      id:'b2-writing-sustainable-consumption',
      variantTitle:'B2 Schreiben H · nachhaltiger Konsum',
      title:'Schreiben · Forumbeitrag Nachhaltigkeit',
      prompt:'Schreibe einen Beitrag für ein Online-Forum: Sollten Verbraucher stärker verpflichtet werden, nachhaltiger einzukaufen? Diskutiere persönliche Freiheit, Preise, Verantwortung von Unternehmen und Wirkung auf die Umwelt. Begründe deine Position.',
      taskType:'forum-argumentation',
      register:'sachlich, forumgeeignet',
      durationMinutes:55,
      requiredPoints:['Thema einführen','persönliche Freiheit berücksichtigen','Preis-/Alltagsproblem nennen','Unternehmensverantwortung einbeziehen','Umweltwirkung erklären','eigene Position begründen'],
      minWords:180,
      maxWords:280,
      requiredStructure:['Einleitung','Argumente dafür','Argumente dagegen','weitere Akteure','eigene Position','Fazit'],
      assessmentRubric:{ level:'B2', requiredStructure:['Einleitung','Argumente dafür','Argumente dagegen','weitere Akteure','eigene Position','Fazit'], groqInstruction:'Bewerte streng auf B2-Niveau: Die Antwort muss mehrere Perspektiven verbinden, nicht nur moralisch appellieren. Unternehmensverantwortung und Verbraucherperspektive müssen vorkommen.' },
      hardFailHints:['Ohne mehrere Perspektiven maximal 65 %.','Ohne eigene Position maximal 60 %.','Ohne Begründung und Beispiel nicht B2-reif.']
    }
  ]);
  var speakingPool = freezeList([
    {
      id:'b2-speaking-homeoffice-hard', level:'B2',
      variantTitle:'B2 Sprechen A · Homeoffice dauerhaft',
      title:'Sprechen · Stellungnahme Homeoffice',
      prompt:'Sollte Homeoffice dauerhaft stärker ausgebaut werden? Sprich zusammenhängend wie in einer mündlichen B2-Prüfung. Ordne das Thema ein, stelle Vorteile und Nachteile dar, nenne deine eigene Position, ein konkretes Beispiel und eine abschließende Empfehlung.',
      taskType:'argumentative-speaking', register:'sachlich argumentierend', durationMinutes:12,
      prepSeconds:60, responseSeconds:240, minWords:180, maxWords:350,
      requiredPoints:['Thema einordnen','mindestens zwei Vorteile nennen','mindestens zwei Nachteile oder Grenzen nennen','eigene Position klar begründen','konkretes Beispiel aus Arbeit/Alltag einbauen','Empfehlung oder Fazit formulieren'],
      requiredSpeechStructure:['Einleitung/Themenbezug','Argumente dafür','Argumente dagegen','eigene Position','konkretes Beispiel','Fazit/Empfehlung'],
      assessmentRubric:{ level:'B2', requiredSpeechStructure:['Einleitung/Themenbezug','Argumente dafür','Argumente dagegen','eigene Position','konkretes Beispiel','Fazit/Empfehlung'], groqInstruction:'Bewerte als sehr strenger B2-Sprechprüfer im Academy-Hartmodus. Erwartet werden 2–4 Minuten zusammenhängende Argumentation, Pro/Contra, eigene Position, Begründung, Beispiel, Konnektoren und klare Schlussfolgerung. Kurze B1-Alltagssätze, Stichpunkte oder bloße Zustimmung dürfen nicht bestehen.' },
      hardFailHints:['Unter 135 Wörtern wird die Antwort hart gedeckelt; unter 100 Wörtern normalerweise nicht prüfungsreif.','Ohne eigene Position maximal 60 %.','Ohne Begründung maximal 55 %.','Ohne konkretes Beispiel maximal 70 %.','Nur Stichpunkte maximal 40 %.']
    },
    {
      id:'b2-speaking-ai-learning-hard', level:'B2',
      variantTitle:'B2 Sprechen B · KI im Lernen',
      title:'Sprechen · KI im Unterricht und Lernen',
      prompt:'Viele Lernende nutzen KI-Programme für Hausaufgaben, Bewerbungen und Prüfungsvorbereitung. Sprich darüber, welche Chancen und Risiken entstehen, wie Datenschutz und Selbstständigkeit betroffen sind und unter welchen Bedingungen KI sinnvoll eingesetzt werden kann.',
      taskType:'argumentative-speaking', register:'sachlich reflektierend', durationMinutes:12,
      prepSeconds:60, responseSeconds:240, minWords:180, maxWords:350,
      requiredPoints:['Thema einordnen','Chancen für Lernende erklären','Risiken für Selbstständigkeit nennen','Datenschutz berücksichtigen','eigene Position begründen','Bedingungen für sinnvollen Einsatz formulieren'],
      requiredSpeechStructure:['Einleitung','Chancen','Risiken','Datenschutz/Selbstständigkeit','eigene Position mit Beispiel','Bedingungen/Fazit'],
      assessmentRubric:{ level:'B2', requiredSpeechStructure:['Einleitung','Chancen','Risiken','Datenschutz/Selbstständigkeit','eigene Position mit Beispiel','Bedingungen/Fazit'], groqInstruction:'Bewerte streng auf B2: Die Antwort muss KI differenziert betrachten, Datenschutz und Selbstständigkeit erwähnen, Bedingungen formulieren und ein Beispiel liefern. Einfache Sätze wie „KI ist gut“ oder „KI ist schlecht“ dürfen nicht bestehen.' },
      hardFailHints:['Ohne Datenschutz- oder Selbstständigkeitsaspekt maximal 70 %.','Ohne Bedingung für sinnvollen Einsatz maximal 65 %.','Ohne Begründung maximal 55 %.','Ohne Beispiel maximal 70 %.','Zu einfache Sprache wird auf maximal 65 % gedeckelt.']
    },
    {
      id:'b2-speaking-car-free-city-hard', level:'B2',
      variantTitle:'B2 Sprechen C · autofreie Innenstadt',
      title:'Sprechen · Stadtentwicklung und Mobilität',
      prompt:'Sollten Innenstädte stärker autofrei werden? Wäge Vorteile und Nachteile ab, berücksichtige verschiedene Gruppen wie Anwohner, Geschäfte, Pendler und Familien und formuliere einen realistischen Kompromiss.',
      taskType:'argumentative-speaking', register:'sachlich abwägend', durationMinutes:12,
      prepSeconds:60, responseSeconds:240, minWords:180, maxWords:350,
      requiredPoints:['Thema einordnen','Vorteile einer autofreien Innenstadt nennen','Nachteile oder Risiken darstellen','verschiedene betroffene Gruppen berücksichtigen','eigene Position begründen','Kompromiss oder Lösungsvorschlag formulieren'],
      requiredSpeechStructure:['Einleitung','Argumente dafür','Argumente dagegen','betroffene Gruppen','eigene Position','Kompromiss/Fazit'],
      assessmentRubric:{ level:'B2', requiredSpeechStructure:['Einleitung','Argumente dafür','Argumente dagegen','betroffene Gruppen','eigene Position','Kompromiss/Fazit'], groqInstruction:'Bewerte als strenger B2-Sprechprüfer. Gute Antwort braucht Abwägung, mehrere Perspektiven, konkrete Gruppen, Kompromiss und klare Struktur. Reine Autofahrer- oder Fahrradfahrer-Meinung ohne Differenzierung reicht nicht.' },
      hardFailHints:['Ohne Abwägung maximal 58 %.','Ohne betroffene Gruppen maximal 65 %.','Ohne Kompromiss/Lösung maximal 70 %.','Ohne eigene Position maximal 60 %.','Thema verfehlt maximal 30–40 %.']
    },
    {
      id:'b2-speaking-four-day-week-hard', level:'B2',
      variantTitle:'B2 Sprechen D · Vier-Tage-Woche',
      title:'Sprechen · Arbeitszeitmodell bewerten',
      prompt:'Sollte die Vier-Tage-Woche bei gleichem Gehalt eingeführt werden? Sprich über Produktivität, Belastung, Kosten für Unternehmen und Folgen für Beschäftigte. Begründe am Ende, welches Modell du für realistisch hältst.',
      taskType:'argumentative-speaking', register:'sachlich arbeitsweltbezogen', durationMinutes:12,
      prepSeconds:60, responseSeconds:240, minWords:180, maxWords:350,
      requiredPoints:['Thema und aktuelle Diskussion einordnen','Vorteile für Beschäftigte erklären','Nachteile oder Kosten für Betriebe nennen','Produktivität oder Belastung abwägen','eigene Position mit Begründung formulieren','realistisches Modell oder Empfehlung nennen'],
      requiredSpeechStructure:['Einleitung','Pro Beschäftigte','Contra/Betriebe','Abwägung Produktivität/Belastung','eigene Position','realistische Empfehlung'],
      assessmentRubric:{ level:'B2', requiredSpeechStructure:['Einleitung','Pro Beschäftigte','Contra/Betriebe','Abwägung Produktivität/Belastung','eigene Position','realistische Empfehlung'], groqInstruction:'Bewerte streng auf B2-Niveau: Die Antwort muss Arbeitswelt, Produktivität, Belastung und Unternehmensperspektive verbinden. Einfache Zustimmung ohne Abwägung darf nicht bestehen.' },
      hardFailHints:['Ohne Unternehmensperspektive maximal 70 %.','Ohne Abwägung maximal 58 %.','Ohne Begründung maximal 55 %.','Ohne eigene Position maximal 60 %.','Nur B1-Wortschatz maximal 65 %.']
    },
    {
      id:'b2-speaking-data-privacy-hard', level:'B2',
      variantTitle:'B2 Sprechen E · Datenschutz im Alltag',
      title:'Sprechen · Datenschutz und Komfort',
      prompt:'Im Alltag geben Menschen viele Daten an Apps, Plattformen und Behörden weiter. Sprich darüber, wie man Datenschutz und Komfort abwägen sollte. Nenne Risiken, Vorteile digitaler Dienste, ein Beispiel und eine Empfehlung für Verbraucher.',
      taskType:'argumentative-speaking', register:'sachlich reflektierend', durationMinutes:12,
      prepSeconds:60, responseSeconds:240, minWords:180, maxWords:350,
      requiredPoints:['Thema Datenschutz im Alltag einordnen','Vorteile digitaler Dienste nennen','Risiken des Datensammelns erklären','konkretes Beispiel nennen','eigene Position begründen','Empfehlung für Verbraucher formulieren'],
      requiredSpeechStructure:['Einleitung','Vorteile Komfort','Risiken Datenschutz','Beispiel','eigene Position','Empfehlung/Fazit'],
      assessmentRubric:{ level:'B2', requiredSpeechStructure:['Einleitung','Vorteile Komfort','Risiken Datenschutz','Beispiel','eigene Position','Empfehlung/Fazit'], groqInstruction:'Bewerte als strenger B2-Prüfer. Erwartet wird eine differenzierte Abwägung zwischen Komfort und Datenschutz, nicht nur Angst vor Technik oder pauschale Zustimmung.' },
      hardFailHints:['Ohne Risikoanalyse maximal 65 %.','Ohne Beispiel maximal 70 %.','Ohne Empfehlung maximal 70 %.','Ohne eigene Position maximal 60 %.','Pauschale Aussagen werden hart abgewertet.']
    },
    {
      id:'b2-speaking-affordable-housing-hard', level:'B2',
      variantTitle:'B2 Sprechen F · bezahlbarer Wohnraum',
      title:'Sprechen · Wohnen und soziale Verantwortung',
      prompt:'In vielen Städten wird bezahlbarer Wohnraum knapp. Sprich über Ursachen, Folgen für verschiedene Bevölkerungsgruppen und mögliche Maßnahmen von Staat, Vermietern und Bürgern. Begründe deine eigene Meinung.',
      taskType:'argumentative-speaking', register:'sachlich gesellschaftlich', durationMinutes:12,
      prepSeconds:60, responseSeconds:240, minWords:180, maxWords:350,
      requiredPoints:['Problem bezahlbarer Wohnraum einordnen','mindestens zwei Ursachen nennen','Folgen für verschiedene Gruppen erklären','mögliche Maßnahmen darstellen','eigene Position begründen','konkretes Beispiel oder Erfahrung einbauen'],
      requiredSpeechStructure:['Einleitung/Problem','Ursachen','Folgen für Gruppen','Maßnahmen','eigene Position','Beispiel/Fazit'],
      assessmentRubric:{ level:'B2', requiredSpeechStructure:['Einleitung/Problem','Ursachen','Folgen für Gruppen','Maßnahmen','eigene Position','Beispiel/Fazit'], groqInstruction:'Bewerte streng auf B2: Die Antwort braucht Ursachen, Folgen, mehrere Akteure, Maßnahmen und eigene Position. Reine Beschwerde ohne Lösungsansatz reicht nicht.' },
      hardFailHints:['Ohne Ursachenanalyse maximal 65 %.','Ohne verschiedene Gruppen maximal 65 %.','Ohne Maßnahmen maximal 60 %.','Ohne Begründung maximal 55 %.','Nur Beschwerde ohne Struktur nicht prüfungsreif.']
    },
    {
      id:'b2-speaking-health-workplace-hard', level:'B2',
      variantTitle:'B2 Sprechen G · Gesundheit am Arbeitsplatz',
      title:'Sprechen · Verantwortung für Gesundheit',
      prompt:'Sollten Arbeitgeber stärker für die Gesundheit ihrer Mitarbeitenden verantwortlich sein? Sprich über Stress, Eigenverantwortung, Kosten, Grenzen und konkrete Maßnahmen. Formuliere am Ende eine begründete Empfehlung.',
      taskType:'argumentative-speaking', register:'sachlich arbeitsweltbezogen', durationMinutes:12,
      prepSeconds:60, responseSeconds:240, minWords:180, maxWords:350,
      requiredPoints:['Thema und Problem einordnen','Stress oder Belastung erklären','Eigenverantwortung berücksichtigen','Kosten oder Grenzen nennen','konkrete Maßnahmen vorschlagen','begründete Empfehlung formulieren'],
      requiredSpeechStructure:['Einleitung','Problem/Belastung','Eigenverantwortung','Grenzen/Kosten','Maßnahmen','Empfehlung/Fazit'],
      assessmentRubric:{ level:'B2', requiredSpeechStructure:['Einleitung','Problem/Belastung','Eigenverantwortung','Grenzen/Kosten','Maßnahmen','Empfehlung/Fazit'], groqInstruction:'Bewerte als strenger B2-Sprechprüfer. Gute Antwort braucht konkrete Maßnahmen und eine Abwägung zwischen Arbeitgeberverantwortung und Eigenverantwortung.' },
      hardFailHints:['Ohne konkrete Maßnahmen maximal 65 %.','Ohne Gegenposition/Grenzen maximal 70 %.','Ohne Begründung maximal 55 %.','Ohne Empfehlung maximal 70 %.','Reine Beschwerde ohne Argumentation reicht nicht.']
    },
    {
      id:'b2-speaking-sustainable-consumption-hard', level:'B2',
      variantTitle:'B2 Sprechen H · nachhaltiger Konsum',
      title:'Sprechen · Nachhaltigkeit und Konsum',
      prompt:'Sollten Verbraucher stärker verpflichtet werden, nachhaltiger einzukaufen? Sprich über persönliche Freiheit, Preise, Verantwortung von Unternehmen und Wirkung auf die Umwelt. Begründe deine Position und nenne ein konkretes Beispiel.',
      taskType:'argumentative-speaking', register:'sachlich forumgeeignet', durationMinutes:12,
      prepSeconds:60, responseSeconds:240, minWords:180, maxWords:350,
      requiredPoints:['Thema einordnen','Argumente für stärkere Verpflichtung nennen','Argumente gegen stärkere Verpflichtung nennen','Unternehmensverantwortung einbeziehen','eigene Position begründen','konkretes Beispiel und Fazit nennen'],
      requiredSpeechStructure:['Einleitung','Argumente dafür','Argumente dagegen','weitere Akteure','eigene Position','Beispiel/Fazit'],
      assessmentRubric:{ level:'B2', requiredSpeechStructure:['Einleitung','Argumente dafür','Argumente dagegen','weitere Akteure','eigene Position','Beispiel/Fazit'], groqInstruction:'Bewerte streng auf B2-Niveau: Die Antwort muss mehrere Perspektiven verbinden, nicht nur moralisch appellieren. Unternehmensverantwortung und Verbraucherperspektive müssen vorkommen.' },
      hardFailHints:['Ohne mehrere Perspektiven maximal 65 %.','Ohne Unternehmensperspektive maximal 70 %.','Ohne eigene Position maximal 60 %.','Ohne Begründung und Beispiel nicht B2-reif.','Nur Stichpunkte maximal 40 %.']
    }
  ]);
  function selectedAttempt(seed){
    seed = String(seed || Date.now());
    return Object.freeze({ level:'B2', seed:seed, reading:pick(readingPool,seed,11).id, listening:pick(listeningPool,seed,23).id, grammar:pick(grammarPool,seed,31).id, writing:pick(writingPool,seed,37).id, speaking:pick(speakingPool,seed,53).id, createdAt:new Date().toISOString() });
  }
  function byId(pool,id){ return pool.filter(function(x){return x.id===id;})[0] || pool[0]; }
  function getAttemptPart(attempt, part){ attempt = attempt || selectedAttempt('fallback'); if(part==='reading') return byId(readingPool, attempt.reading); if(part==='listening') return byId(listeningPool, attempt.listening); if(part==='grammar') return byId(grammarPool, attempt.grammar); if(part==='writing') return byId(writingPool, attempt.writing); if(part==='speaking') return byId(speakingPool, attempt.speaking); return null; }
  function get(part){ return getAttemptPart(selectedAttempt('default-b2'), part); }
  function listObjective(part, attempt){ var p=getAttemptPart(attempt,part); return p && Array.isArray(p.questions) ? p.questions.slice() : []; }
  function getFreeTask(part, attempt){ return part==='writing'||part==='speaking' ? getAttemptPart(attempt, part) : null; }
  function poolInfo(){ return { version:VERSION, level:'B2', reading:readingPool.length, listening:listeningPool.length, grammar:grammarPool.length, writing:writingPool.length, speaking:speakingPool.length, combinations:readingPool.length*listeningPool.length*grammarPool.length*writingPool.length*speakingPool.length, focus:'B2 Hardmode vollständig endvalidiert: 8×8×8×8×8 Kombinationen, alle fünf Prüfungsteile, B2-Gesamt-QA und Regressionsmatrix' }; }
  window.LanguageB2ExamPilot = Object.freeze({ __version:VERSION, level:'B2', poolInfo:poolInfo, buildAttempt:selectedAttempt, getAttemptPart:getAttemptPart, get:get, listObjective:listObjective, getFreeTask:getFreeTask });
})();
