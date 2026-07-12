/* Language Academy · Phase 38C.1
   Harte Prüfungsarchitektur A1-C2.
   Keine API-Keys. Diese Datei beschreibt Prüfungsteile, Mindestgrenzen,
   Pflichtlogik und Beispiel-Pilotaufgaben für die spätere komplette Simulation. */
(function(){
  'use strict';

  function task(id, title, prompt, requiredPoints, minWords, maxWords, prepSeconds, responseSeconds){
    return Object.freeze({
      id:id,
      title:title,
      prompt:prompt,
      requiredPoints:Object.freeze(requiredPoints || []),
      minWords:minWords || 0,
      maxWords:maxWords || null,
      prepSeconds:prepSeconds || 0,
      responseSeconds:responseSeconds || 0
    });
  }

  var commonRubric = Object.freeze({
    localWeight: 0.4,
    aiWeight: 0.6,
    hardCaps: Object.freeze({
      emptyAnswer: 0,
      tooShort: 45,
      strongOffTopic: 35,
      completeOffTopic: 20,
      missingCorePoint: 68
    }),
    labels: Object.freeze({
      excellent: 'prüfungsstark',
      pass: 'prüfungsreif',
      risky: 'unsicher',
      fail: 'noch nicht prüfungsbereit'
    })
  });

  var blueprints = Object.freeze({
    A1: Object.freeze({
      level:'A1',
      passScore:65,
      safePassScore:80,
      partMinScore:50,
      description:'Elementare Prüfung: sehr einfache Alltagssituationen, kurze Nachrichten, klare Standardfragen.',
      parts:Object.freeze({
        reading:Object.freeze({ durationMinutes:8, maxScore:100, minScore:50, format:['Schilder','kurze Nachrichten','einfache Anzeigen'] }),
        listening:Object.freeze({ durationMinutes:8, maxScore:100, minScore:50, format:['klare Durchsagen','kurze Dialoge','Zahlen/Uhrzeiten'] }),
        grammar:Object.freeze({ durationMinutes:6, maxScore:100, minScore:50, format:['Artikel','einfache Satzstellung','Verbformen'] }),
        writing:Object.freeze({ durationMinutes:15, maxScore:100, minScore:50, minWords:30, format:['Formular','kurze Nachricht','einfache E-Mail'] }),
        speaking:Object.freeze({ durationMinutes:10, maxScore:100, minScore:50, minWords:15, format:['Vorstellen','einfache Fragen','kurze Bitte'] })
      }),
      speakingTasks:Object.freeze([
        task('a1-speaking-intro','Sich vorstellen','Stelle dich kurz vor. Nenne Name, Herkunft, Wohnort und was du gern machst.',['Name nennen','Herkunft nennen','Wohnort nennen','eine Vorliebe nennen'],15,60,20,60)
      ]),
      writingTasks:Object.freeze([
        task('a1-writing-message','Kurze Nachricht','Schreibe eine kurze Nachricht an einen Freund. Du kommst später. Nenne den Grund und eine neue Uhrzeit.',['Adressat ansprechen','Verspätung nennen','Grund nennen','neue Uhrzeit nennen'],30,70,0,0)
      ])
    }),
    A2: Object.freeze({
      level:'A2', passScore:65, safePassScore:80, partMinScore:52,
      description:'Grundlegende Prüfung: Alltag, Termine, Einladungen, einfache Begründungen.',
      parts:Object.freeze({
        reading:Object.freeze({ durationMinutes:10, maxScore:100, minScore:52, format:['E-Mail','Anzeige','kurzer Infotext'] }),
        listening:Object.freeze({ durationMinutes:10, maxScore:100, minScore:52, format:['Telefonat','Durchsage','kurze Alltagsdialoge'] }),
        grammar:Object.freeze({ durationMinutes:8, maxScore:100, minScore:52, format:['Konnektoren','Präpositionen','Perfekt','Satzstellung'] }),
        writing:Object.freeze({ durationMinutes:20, maxScore:100, minScore:52, minWords:60, format:['Einladung','Entschuldigung','Anfrage'] }),
        speaking:Object.freeze({ durationMinutes:12, maxScore:100, minScore:52, minWords:35, format:['Erfahrung erzählen','Wunsch äußern','Termin vereinbaren'] })
      }),
      speakingTasks:Object.freeze([
        task('a2-speaking-appointment','Termin vereinbaren','Du möchtest einen Termin in einer Praxis vereinbaren. Sage, warum du kommst, wann du Zeit hast und frage nach der Adresse.',['Terminwunsch nennen','Grund nennen','Zeitfenster nennen','Adresse erfragen'],35,100,30,90)
      ]),
      writingTasks:Object.freeze([
        task('a2-writing-invitation','Einladung beantworten','Du wurdest eingeladen, kannst aber nicht kommen. Schreibe eine Antwort mit Dank, Absage, Grund und neuem Vorschlag.',['Danken','Absage formulieren','Grund nennen','neuen Vorschlag machen'],60,110,0,0)
      ])
    }),
    B1: Object.freeze({
      level:'B1', passScore:70, safePassScore:82, partMinScore:55,
      description:'Schwellenprüfung: Alltag, Arbeit, Behörden, Begründungen, einfache Argumentation. Bestehen soll reale Chancen anzeigen.',
      parts:Object.freeze({
        reading:Object.freeze({ durationMinutes:15, maxScore:100, minScore:55, format:['E-Mail','Anzeige','Forumsbeitrag','kurzer Sachtext'] }),
        listening:Object.freeze({ durationMinutes:12, maxScore:100, minScore:55, format:['Telefonat','Durchsage','Interview','Alltagsdialog'] }),
        grammar:Object.freeze({ durationMinutes:10, maxScore:100, minScore:58, format:['Sprachbausteine','Konnektoren','Kasus/Präpositionen','Nebensätze','Satzstellung'] }),
        writing:Object.freeze({ durationMinutes:30, maxScore:100, minScore:55, minWords:100, format:['Beschwerde','Terminabsage','Bewerbung','formelle E-Mail'] }),
        speaking:Object.freeze({ durationMinutes:15, maxScore:100, minScore:55, minWords:65, format:['Vorstellen','Erfahrung berichten','gemeinsam planen','Rückfrage beantworten'] })
      }),
      speakingTasks:Object.freeze([
        task('b1-speaking-doctor-reschedule','Arzttermin verschieben','Du kannst deinen Arzttermin nicht wahrnehmen. Rufe in der Praxis an, verschiebe höflich den Termin, nenne einen Grund und schlage einen neuen Termin vor.',['höfliche Begrüßung','Termin verschieben','Grund nennen','neuen Termin vorschlagen','höflicher Abschluss'],65,180,30,120),
        task('b1-speaking-plan-event','Gemeinsam planen','Du planst mit einem Freund ein kleines Fest. Sprich über Ort, Zeit, Essen, Aufgabenverteilung und Kosten.',['Ort vorschlagen','Zeit vorschlagen','Essen/Getränke erwähnen','Aufgaben verteilen','Kosten ansprechen'],65,180,30,120)
      ]),
      writingTasks:Object.freeze([
        task('b1-writing-complaint','Beschwerde schreiben','Schreibe eine Beschwerde an einen Kursanbieter. Der Kurs ist ausgefallen. Beschreibe das Problem, fordere eine Lösung und bleibe höflich.',['Problem beschreiben','Folge nennen','Lösung fordern','höflich/formell schreiben'],100,170,0,0)
      ])
    }),
    B2: Object.freeze({
      level:'B2', passScore:70, safePassScore:82, partMinScore:58,
      description:'Selbstständige Sprachverwendung: Sachtexte, Stellungnahmen, formelle Kommunikation, differenzierte Begründungen.',
      parts:Object.freeze({
        reading:Object.freeze({ durationMinutes:18, maxScore:100, minScore:58, format:['Sachtext','Meinungsbeitrag','Argumentationsstruktur'] }),
        listening:Object.freeze({ durationMinutes:15, maxScore:100, minScore:58, format:['Interview','Diskussion','indirekte Aussagen'] }),
        grammar:Object.freeze({ durationMinutes:12, maxScore:100, minScore:60, format:['komplexe Konnektoren','Passiv','Konjunktiv II','Nominalisierung','Textkohärenz'] }),
        writing:Object.freeze({ durationMinutes:45, maxScore:100, minScore:58, minWords:180, format:['Stellungnahme','formelle E-Mail','Argumentation'] }),
        speaking:Object.freeze({ durationMinutes:18, maxScore:100, minScore:58, minWords:180, format:['Meinung äußern','Argumentieren','Vorteile/Nachteile','Diskussion'] })
      }),
      speakingTasks:Object.freeze([
        task('b2-speaking-homeoffice','Stellungnahme Homeoffice','Nimm Stellung zum Thema Homeoffice. Nenne Vorteile, Nachteile, deine Meinung und ein konkretes Beispiel.',['Thema einordnen','mindestens zwei Vorteile','mindestens zwei Nachteile','eigene Meinung','konkretes Beispiel'],180,350,60,240)
      ]),
      writingTasks:Object.freeze([
        task('b2-writing-opinion','Stellungnahme schreiben','Schreibe eine Stellungnahme zum Thema digitale Bildung. Gehe auf Chancen, Risiken und deine begründete Meinung ein.',['Einleitung','Chancen','Risiken','begründete Meinung','Schluss'],180,280,0,0)
      ])
    }),
    C1: Object.freeze({
      level:'C1', passScore:75, safePassScore:85, partMinScore:62,
      description:'Fortgeschrittene Prüfung: komplexe Argumentation, präziser Wortschatz, Register, Kohärenz.',
      parts:Object.freeze({
        reading:Object.freeze({ durationMinutes:22, maxScore:100, minScore:62, format:['komplexe Sachtexte','implizite Bedeutung','Autorabsicht'] }),
        listening:Object.freeze({ durationMinutes:18, maxScore:100, minScore:62, format:['Vortrag','Diskussion','indirekte Kritik','Detailverstehen'] }),
        grammar:Object.freeze({ durationMinutes:14, maxScore:100, minScore:64, format:['Nominalstil','Register','komplexe Satzgefüge','Textkohärenz'] }),
        writing:Object.freeze({ durationMinutes:60, maxScore:100, minScore:62, minWords:220, format:['Erörterung','Kommentar','formelle Beschwerde mit Argumentation'] }),
        speaking:Object.freeze({ durationMinutes:20, maxScore:100, minScore:62, minWords:130, format:['Präsentieren','argumentieren','differenzieren','spontan reagieren'] })
      }),
      speakingTasks:Object.freeze([
        task('c1-speaking-education-policy','Bildungspolitik bewerten','Bewerte die Aussage: Digitale Lernplattformen können klassischen Unterricht teilweise ersetzen. Argumentiere differenziert und gehe auf Grenzen ein.',['These einordnen','differenzierte Argumentation','Gegenposition berücksichtigen','konkrete Beispiele','abgewogenes Fazit'],130,320,60,180)
      ]),
      writingTasks:Object.freeze([
        task('c1-writing-comment','Kommentar verfassen','Verfasse einen Kommentar zur Frage, ob KI im Unterricht verpflichtend eingesetzt werden sollte.',['klare Position','mehrere Argumente','Gegenargument','präzise Beispiele','kohärenter Schluss'],220,340,0,0)
      ])
    }),
    C2: Object.freeze({
      level:'C2', passScore:75, safePassScore:88, partMinScore:65,
      description:'Nahezu muttersprachliche Prüfung: Nuancen, Stil, komplexe Analyse, sehr präzise Argumentation.',
      parts:Object.freeze({
        reading:Object.freeze({ durationMinutes:25, maxScore:100, minScore:65, format:['komplexe Analyse','Stilmittel','implizite Wertungen'] }),
        listening:Object.freeze({ durationMinutes:20, maxScore:100, minScore:65, format:['schnelle Diskussion','Nuancen','Ironie/Implikationen'] }),
        grammar:Object.freeze({ durationMinutes:15, maxScore:100, minScore:66, format:['Stilpräzision','Registerwechsel','Nuancen','komplexe Syntax'] }),
        writing:Object.freeze({ durationMinutes:75, maxScore:100, minScore:65, minWords:300, format:['Analyse','Essay','komplexe Stellungnahme'] }),
        speaking:Object.freeze({ durationMinutes:25, maxScore:100, minScore:65, minWords:170, format:['präzise argumentieren','abstrakt diskutieren','spontan nuancieren'] })
      }),
      speakingTasks:Object.freeze([
        task('c2-speaking-ai-society','KI und Gesellschaft','Analysiere, wie KI langfristig Bildung, Arbeit und soziale Gerechtigkeit beeinflussen kann. Argumentiere nuanciert und nenne Risiken.',['mehrdimensionale Analyse','Bildung','Arbeitswelt','soziale Gerechtigkeit','Risiken und Chancen','nuanciertes Fazit'],170,420,75,240)
      ]),
      writingTasks:Object.freeze([
        task('c2-writing-analysis','Komplexe Analyse','Schreibe eine analytische Stellungnahme über Chancen und gesellschaftliche Risiken personalisierter KI-Lernsysteme.',['analytische Struktur','mehrere Perspektiven','präzise Fachsprache','Risikoanalyse','abgewogenes Fazit'],300,520,0,0)
      ])
    })
  });

  window.LanguageExamBlueprints = Object.freeze({
    __version:'G54.45.0-exam-blueprints-honest-timing',
    rubric:commonRubric,
    levels:blueprints,
    listLevels:function(){ return Object.keys(blueprints); },
    get:function(level){ return blueprints[String(level || 'B1').toUpperCase()] || blueprints.B1; }
  });
})();
