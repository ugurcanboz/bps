/* Language Academy · Phase 38C.10
   B1 Aufgabenpool: Sprechprüfung härter und prüfungsnäher.
   Ziel: bestätigtes Transkript, Gesprächsstruktur, Pflichtpunkte und Groq-Sprechprüfer-Rubrik deutlich strenger. */
(function(){
  'use strict';

  var VERSION = 'G54.38C.10-b1-speaking-hard-rubric';

  function freezeDeep(obj){
    Object.keys(obj || {}).forEach(function(k){
      if(obj[k] && typeof obj[k] === 'object' && !Object.isFrozen(obj[k])) freezeDeep(obj[k]);
    });
    return Object.freeze(obj);
  }
  function hashSeed(seed){
    var s = String(seed || 'b1-default');
    var h = 0;
    for(var i=0;i<s.length;i++){ h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
    return Math.abs(h || 1);
  }
  function pick(list, seed, offset){
    list = Array.isArray(list) ? list : [];
    if(!list.length) return null;
    return list[(hashSeed(seed) + (offset || 0)) % list.length];
  }

  var strictRules = [
    'Jeder Prüfungsteil muss mindestens die B1-Mindestleistung erreichen.',
    'Themenverfehlung führt zu harter Abwertung.',
    'Zu kurze Antworten können trotz guter Einzelwörter nicht bestehen.',
    'Groq bewertet nur bestätigte Texte/Transkripte und nicht rohe fehlerhafte Spracherkennung.',
    'Phase 38C.10 härtet zusätzlich die B1-Sprechprüfung: Gesprächsstruktur, bestätigtes Transkript, Pflichtpunkte, zusammenhängende Antwort, Höflichkeit, klare Lösung/Vorschlag und harte Punktdeckelung.'
  ];

  var readingPool = [
    {
      id:'b1-reading-course-office',
      variantTitle:'Variante A · Kursorganisation/Beschwerde',
      title:'Lesen · Kursorganisation und Beschwerde',
      durationMinutes:35,
      intro:'Lies die Texte genau. Es geht nicht nur um einzelne Wörter, sondern um konkrete Informationen, Absicht und passende Schlussfolgerungen.',
      texts:[
        { title:'E-Mail vom Kursbüro', body:'Sehr geehrte Teilnehmerinnen und Teilnehmer, der Deutschkurs B1 findet ab nächster Woche nicht mehr im Raum 204, sondern im Raum 318 statt. Die Uhrzeit bleibt unverändert: montags und mittwochs von 18:00 bis 20:15 Uhr. Bitte bringen Sie zur nächsten Stunde Ihren Ausweis und die unterschriebene Teilnahmebestätigung mit. Wer an diesem Termin verhindert ist, soll das Kursbüro bis Freitag per E-Mail informieren.' },
        { title:'Anzeige im Stadtteilzentrum', body:'Für unser Sommerfest suchen wir freiwillige Helferinnen und Helfer. Aufgaben: Aufbau ab 10 Uhr, Getränkeausgabe am Nachmittag und Aufräumen ab 18 Uhr. Wer helfen möchte, trägt sich bis Mittwoch in die Liste am Empfang ein. Essen und Getränke für Helfer sind kostenlos.' },
        { title:'Forenbeitrag', body:'Ich habe letzte Woche einen Online-Sprachkurs gebucht. Leider funktionierte der Zugang am ersten Abend nicht. Die Hotline war nicht erreichbar. Am nächsten Tag bekam ich zwar eine Entschuldigung, aber keinen Ersatztermin. Ich finde, der Anbieter sollte mindestens eine zusätzliche Stunde anbieten oder einen Teil der Gebühr zurückzahlen.' }
      ],
      questions:[
        { id:'r1', question:'Was ändert sich beim Deutschkurs?', options:[['a','Nur der Raum ändert sich.'],['b','Die Uhrzeit ändert sich auf Freitag.'],['c','Der Kurs fällt nächste Woche aus.']], correct:'a', explanation:'Im Text steht: Raum 318 statt 204, die Uhrzeit bleibt unverändert.' },
        { id:'r2', question:'Was müssen Teilnehmer zur nächsten Stunde mitbringen?', options:[['a','Nur Geld für die Kursgebühr.'],['b','Ausweis und unterschriebene Teilnahmebestätigung.'],['c','Essen und Getränke für die Pause.']], correct:'b', explanation:'Beides wird ausdrücklich genannt.' },
        { id:'r3', question:'Bis wann sollen verhinderte Teilnehmer das Kursbüro informieren?', options:[['a','Bis Mittwoch.'],['b','Bis Freitag.'],['c','Erst nach der nächsten Stunde.']], correct:'b', explanation:'Im Text steht: bis Freitag per E-Mail informieren.' },
        { id:'r4', question:'Welche Hilfe wird für das Sommerfest NICHT ausdrücklich genannt?', options:[['a','Aufbau.'],['b','Getränkeausgabe.'],['c','Kinderbetreuung.']], correct:'c', explanation:'Kinderbetreuung wird nicht erwähnt.' },
        { id:'r5', question:'Was möchte die Person im Forenbeitrag erreichen?', options:[['a','Sie möchte den Kurs kostenlos weiterempfehlen.'],['b','Sie fordert eine Lösung, weil der Zugang nicht funktionierte.'],['c','Sie möchte sich für die gute Hotline bedanken.']], correct:'b', explanation:'Sie kritisiert den Ausfall und erwartet Ersatz oder Rückzahlung.' },
        { id:'r6', question:'Welche Aussage passt am besten zum Forenbeitrag?', options:[['a','Die Person ist mit dem Anbieter vollständig zufrieden.'],['b','Die Person beschreibt ein Problem und begründet eine Beschwerde.'],['c','Die Person sucht freiwillige Helfer.']], correct:'b', explanation:'Der Beitrag enthält Problem, Folge und Forderung.' }
      ],
      passScore:70
    },
    {
      id:'b1-reading-work-neighbourhood',
      variantTitle:'Variante B · Arbeit/Nachbarschaft',
      title:'Lesen · Arbeitsplan und Hausmitteilung',
      durationMinutes:35,
      intro:'Lies alle drei Texte. Achte auf Fristen, Bedingungen, indirekte Aussagen und den Zweck der Mitteilungen.',
      texts:[
        { title:'Aushang im Betrieb', body:'Am kommenden Montag beginnt die neue Schichtplanung. Beschäftigte, die ihre Schicht tauschen möchten, müssen den Wunsch spätestens bis Donnerstag 14 Uhr schriftlich an die Teamleitung senden. Ein Tausch ist nur möglich, wenn beide Personen zustimmen und die Qualifikation für den Arbeitsplatz passt.' },
        { title:'Mitteilung der Hausverwaltung', body:'Wegen Wartungsarbeiten am Aufzug kann dieser am Dienstag zwischen 8 und 13 Uhr nicht benutzt werden. Bewohnerinnen und Bewohner, die in dieser Zeit Hilfe benötigen, sollen sich bis Montagvormittag telefonisch melden. Paketzustellungen werden in dieser Zeit im Eingangsbereich abgelegt.' },
        { title:'E-Mail an einen Kollegen', body:'Hallo Murat, ich habe gesehen, dass du nächste Woche die Frühschicht hast. Könntest du eventuell mit mir tauschen? Ich habe am Mittwochvormittag einen wichtigen Termin bei der Ausländerbehörde. Falls es für dich nicht passt, frage ich Frau Seidel aus der anderen Abteilung. Viele Grüße, Jana' }
      ],
      questions:[
        { id:'rb1', question:'Bis wann muss ein Schichttausch beantragt werden?', options:[['a','Bis Donnerstag 14 Uhr.'],['b','Erst am Montagmorgen.'],['c','Bis Dienstag 13 Uhr.']], correct:'a', explanation:'Der Aushang nennt Donnerstag 14 Uhr.' },
        { id:'rb2', question:'Wann ist der Aufzug nicht nutzbar?', options:[['a','Montagvormittag.'],['b','Dienstag von 8 bis 13 Uhr.'],['c','Die ganze Woche.']], correct:'b', explanation:'Die Wartungszeit wird genau genannt.' },
        { id:'rb3', question:'Was sollen Bewohner tun, wenn sie Hilfe brauchen?', options:[['a','Bis Montagvormittag telefonisch melden.'],['b','Einen Brief an alle Nachbarn schreiben.'],['c','Im Eingangsbereich warten.']], correct:'a', explanation:'Die Hausverwaltung bittet um telefonische Meldung bis Montagvormittag.' },
        { id:'rb4', question:'Warum möchte Jana die Schicht tauschen?', options:[['a','Wegen eines Arzttermins.'],['b','Wegen eines Termins bei der Ausländerbehörde.'],['c','Weil sie Urlaub macht.']], correct:'b', explanation:'Sie nennt einen Termin bei der Ausländerbehörde.' },
        { id:'rb5', question:'Welche Bedingung gilt für einen Schichttausch?', options:[['a','Nur die Teamleitung muss zustimmen.'],['b','Beide Personen müssen zustimmen und qualifiziert sein.'],['c','Ein Tausch ist immer möglich.']], correct:'b', explanation:'Beide Zustimmung und passende Qualifikation werden genannt.' },
        { id:'rb6', question:'Was macht Jana, wenn Murat nicht tauschen kann?', options:[['a','Sie fragt Frau Seidel.'],['b','Sie kündigt ihre Stelle.'],['c','Sie wartet bis Montag.']], correct:'a', explanation:'Jana nennt Frau Seidel als Alternative.' }
      ],
      passScore:70
    },
    {
      id:'b1-reading-school-health',
      variantTitle:'Variante C · Schule/Gesundheit',
      title:'Lesen · Elterninformation und Apothekenhinweis',
      durationMinutes:35,
      intro:'Bearbeite die Texte prüfungsnah. Es zählt, ob du wichtige Informationen sicher herausfiltern kannst.',
      texts:[
        { title:'Nachricht der Schule', body:'Liebe Eltern, der Elternabend der Klasse 7b wird wegen Krankheit der Klassenlehrerin auf den 12. Mai verschoben. Beginn ist weiterhin 19 Uhr. Bitte geben Sie Ihrem Kind den unterschriebenen Abschnitt bis spätestens Freitag mit, damit wir besser planen können.' },
        { title:'Hinweis der Apotheke', body:'Das bestellte Medikament kann ab morgen Nachmittag abgeholt werden. Bitte bringen Sie die Versichertenkarte und das Rezept mit. Falls Sie das Medikament nicht innerhalb von sieben Tagen abholen, wird die Bestellung automatisch storniert.' },
        { title:'Kurze Beschwerde', body:'Ich war gestern beim Informationsabend im Sprachzentrum. Leider begann die Veranstaltung 40 Minuten später als angekündigt. Außerdem fehlten wichtige Unterlagen zu den Prüfungsgebühren. Ich wünsche mir, dass diese Informationen künftig vorher per E-Mail verschickt werden.' }
      ],
      questions:[
        { id:'rc1', question:'Warum wird der Elternabend verschoben?', options:[['a','Wegen Krankheit der Klassenlehrerin.'],['b','Wegen Ferien.'],['c','Wegen fehlender Räume.']], correct:'a', explanation:'Die Krankheit der Klassenlehrerin wird genannt.' },
        { id:'rc2', question:'Was bleibt beim Elternabend gleich?', options:[['a','Das Datum.'],['b','Die Uhrzeit.'],['c','Die Lehrerin.']], correct:'b', explanation:'Beginn ist weiterhin 19 Uhr.' },
        { id:'rc3', question:'Was muss zur Apotheke mitgebracht werden?', options:[['a','Nur Bargeld.'],['b','Versichertenkarte und Rezept.'],['c','Eine Teilnahmebestätigung.']], correct:'b', explanation:'Beide Dinge werden genannt.' },
        { id:'rc4', question:'Wann wird die Medikamentenbestellung storniert?', options:[['a','Nach sieben Tagen ohne Abholung.'],['b','Sofort morgen Nachmittag.'],['c','Nach einem Monat.']], correct:'a', explanation:'Der Hinweis nennt sieben Tage.' },
        { id:'rc5', question:'Was kritisiert die Person am Informationsabend?', options:[['a','Er begann zu früh.'],['b','Er begann verspätet und Unterlagen fehlten.'],['c','Die Prüfungsgebühren waren zu niedrig.']], correct:'b', explanation:'Verspätung und fehlende Unterlagen sind die Kritikpunkte.' },
        { id:'rc6', question:'Was wünscht sich die Person künftig?', options:[['a','Informationen vorher per E-Mail.'],['b','Gar keine Veranstaltungen mehr.'],['c','Nur telefonische Anmeldung.']], correct:'a', explanation:'Sie möchte die Informationen vorher per E-Mail erhalten.' }
      ],
      passScore:70
    }
  ];

  var listeningPool = [
    {
      id:'b1-listening-announcements',
      variantTitle:'Variante A · Bürgerbüro/Arztpraxis',
      title:'Hören · Durchsage und Telefonnotiz',
      durationMinutes:30,
      intro:'In der echten Prüfung hörst du solche Informationen meist nur ein- oder zweimal. Lies die Hörtexte hier als Simulation und beantworte danach die Fragen.',
      audioSimulationNote:'Realistische Hörsimulation: Text wird per Browser-Stimme vorgelesen, Transkript bleibt im Prüfungsmodus zuerst verborgen. Maximal zwei Hörvorgänge.',
      listeningMode:'browser-tts',
      maxPlays:2,
      showTranscriptAfterPlays:2,
      speed:'normal',
      audioInstruction:'Höre die beiden Situationen aufmerksam. Beantworte die Fragen erst nach dem Hören.',
      texts:[
        { title:'Durchsage im Bürgerbüro', body:'Achtung, eine kurze Information: Wegen einer technischen Störung können heute keine neuen Ausweise beantragt werden. Bereits fertige Ausweise können aber am Schalter 3 abgeholt werden. Personen mit Termin für eine Neubeantragung erhalten automatisch einen Ersatztermin per E-Mail. Bitte warten Sie nicht im Gebäude, wenn Sie nur einen neuen Antrag stellen wollten.' },
        { title:'Telefonnotiz von der Arztpraxis', body:'Guten Tag, hier ist die Praxis Dr. Keller. Ihr Termin am Dienstag um 9 Uhr muss leider verschoben werden, weil die Ärztin an diesem Vormittag nicht da ist. Wir können Ihnen Freitag um 15 Uhr anbieten. Bitte rufen Sie uns bis morgen 12 Uhr zurück, wenn der Termin nicht passt.' }
      ],
      questions:[
        { id:'l1', question:'Was ist heute im Bürgerbüro NICHT möglich?', options:[['a','Neue Ausweise beantragen.'],['b','Fertige Ausweise abholen.'],['c','Zum Schalter 3 gehen.']], correct:'a', explanation:'Neue Anträge sind wegen technischer Störung nicht möglich.' },
        { id:'l2', question:'Wo können fertige Ausweise abgeholt werden?', options:[['a','Am Empfang.'],['b','Am Schalter 3.'],['c','Im Raum 318.']], correct:'b', explanation:'Die Durchsage nennt Schalter 3.' },
        { id:'l3', question:'Wie erhalten Personen mit Termin für eine Neubeantragung einen Ersatztermin?', options:[['a','Automatisch per E-Mail.'],['b','Durch einen Brief in zwei Wochen.'],['c','Sie müssen im Gebäude warten.']], correct:'a', explanation:'Der Ersatztermin kommt automatisch per E-Mail.' },
        { id:'l4', question:'Warum wird der Arzttermin verschoben?', options:[['a','Der Patient kommt zu spät.'],['b','Die Ärztin ist am Vormittag nicht da.'],['c','Die Praxis ist dauerhaft geschlossen.']], correct:'b', explanation:'Das wird in der Telefonnotiz ausdrücklich genannt.' },
        { id:'l5', question:'Welcher neue Termin wird angeboten?', options:[['a','Freitag um 15 Uhr.'],['b','Dienstag um 15 Uhr.'],['c','Morgen um 12 Uhr.']], correct:'a', explanation:'Freitag um 15 Uhr ist der neue Vorschlag.' },
        { id:'l6', question:'Bis wann soll man zurückrufen, wenn der neue Termin nicht passt?', options:[['a','Bis heute 18 Uhr.'],['b','Bis morgen 12 Uhr.'],['c','Gar nicht, der Termin ist fest.']], correct:'b', explanation:'Die Praxis bittet um Rückruf bis morgen 12 Uhr.' }
      ],
      passScore:70
    },
    {
      id:'b1-listening-work-transport',
      variantTitle:'Variante B · Arbeit/Verkehr',
      title:'Hören · Teamleitung und Busdurchsage',
      durationMinutes:30,
      intro:'Konzentriere dich auf Zeiten, Gründe, Aufforderungen und Konsequenzen.',
      audioSimulationNote:'Realistische Hörsimulation mit begrenzten Wiederholungen. Der Text wird vorgelesen und ist erst nach dem Hören sichtbar.',
      listeningMode:'browser-tts',
      maxPlays:2,
      showTranscriptAfterPlays:2,
      speed:'normal',
      audioInstruction:'Achte auf Uhrzeiten, Orte, Gründe und konkrete Aufforderungen.',
      texts:[
        { title:'Sprachnachricht der Teamleitung', body:'Guten Morgen, hier ist Frau Weber. Wegen einer kurzfristigen Lieferung beginnt die Besprechung heute nicht um 8:30 Uhr, sondern erst um 9:15 Uhr im großen Raum. Bitte bringen Sie die Liste mit den offenen Kundenaufträgen mit. Wer im Homeoffice ist, soll sich über den bekannten Videolink zuschalten.' },
        { title:'Durchsage am Bahnhof', body:'Der Bus 12 Richtung Eselsberg fährt heute wegen Bauarbeiten nicht von Haltestelle Hauptbahnhof, sondern von der Ersatzhaltestelle in der Olgastraße. Die Abfahrt ist zehn Minuten später als üblich. Fahrgäste mit Kinderwagen oder Rollstuhl können den Aufzug am Südausgang benutzen.' }
      ],
      questions:[
        { id:'lb1', question:'Wann beginnt die Besprechung heute?', options:[['a','Um 8:30 Uhr.'],['b','Um 9:15 Uhr.'],['c','Um 10:00 Uhr.']], correct:'b', explanation:'Die Besprechung beginnt erst um 9:15 Uhr.' },
        { id:'lb2', question:'Was sollen die Beschäftigten mitbringen?', options:[['a','Die Liste mit offenen Kundenaufträgen.'],['b','Eine Teilnahmebestätigung.'],['c','Eine Fahrkarte.']], correct:'a', explanation:'Die Liste wird ausdrücklich verlangt.' },
        { id:'lb3', question:'Was sollen Personen im Homeoffice tun?', options:[['a','Später kommen.'],['b','Sich per Videolink zuschalten.'],['c','Den Termin absagen.']], correct:'b', explanation:'Sie sollen den bekannten Videolink nutzen.' },
        { id:'lb4', question:'Warum fährt der Bus von einer Ersatzhaltestelle?', options:[['a','Wegen Bauarbeiten.'],['b','Wegen eines Streiks.'],['c','Wegen schlechtem Wetter.']], correct:'a', explanation:'Bauarbeiten sind der Grund.' },
        { id:'lb5', question:'Wo fährt der Bus heute ab?', options:[['a','Am Hauptbahnhof wie immer.'],['b','In der Olgastraße.'],['c','Im Stadtteilzentrum.']], correct:'b', explanation:'Die Ersatzhaltestelle ist in der Olgastraße.' },
        { id:'lb6', question:'Welche Hilfe wird für Fahrgäste mit Kinderwagen oder Rollstuhl genannt?', options:[['a','Der Aufzug am Südausgang.'],['b','Ein Taxi.'],['c','Ein kostenloser Ersatzbus.']], correct:'a', explanation:'Der Aufzug am Südausgang wird genannt.' }
      ],
      passScore:70
    },
    {
      id:'b1-listening-school-course',
      variantTitle:'Variante C · Schule/Kursanbieter',
      title:'Hören · Kursänderung und Elternanruf',
      durationMinutes:30,
      intro:'Diese Hörsimulation prüft, ob du Termine, Gründe und erforderliche Reaktionen erkennst.',
      audioSimulationNote:'Realistische Hörsimulation: Antwortauswahl wird erst nach dem ersten Hören freigeschaltet.',
      listeningMode:'browser-tts',
      maxPlays:2,
      showTranscriptAfterPlays:2,
      speed:'normal',
      audioInstruction:'Du darfst höchstens zweimal hören. Notiere dir gedanklich Zeiten, Orte und notwendige Reaktionen.',
      texts:[
        { title:'Anruf des Kursanbieters', body:'Guten Tag, hier ist das Sprachzentrum Mitte. Der Prüfungsvorbereitungskurs am Samstag beginnt wegen einer Raumänderung erst um 10 Uhr. Der neue Raum ist 2.14 im zweiten Stock. Bitte bringen Sie Ihr Übungsheft und einen Ausweis mit. Wenn Sie nicht kommen können, melden Sie sich bitte bis Freitagmittag.' },
        { title:'Nachricht aus der Schule', body:'Hallo, hier spricht Frau Klein von der Grundschule. Ihr Kind hat seine Sporttasche in der Halle vergessen. Sie können die Tasche heute bis 16 Uhr im Sekretariat abholen. Morgen ist das Sekretariat wegen einer Fortbildung geschlossen.' }
      ],
      questions:[
        { id:'lc1', question:'Wann beginnt der Prüfungsvorbereitungskurs?', options:[['a','Um 10 Uhr.'],['b','Um 9 Uhr.'],['c','Um 16 Uhr.']], correct:'a', explanation:'Der Kurs beginnt erst um 10 Uhr.' },
        { id:'lc2', question:'Warum ändert sich der Beginn?', options:[['a','Wegen einer Raumänderung.'],['b','Wegen Krankheit.'],['c','Wegen einer Prüfung.']], correct:'a', explanation:'Die Raumänderung ist der Grund.' },
        { id:'lc3', question:'Was soll man zum Kurs mitbringen?', options:[['a','Übungsheft und Ausweis.'],['b','Sporttasche.'],['c','Nur Bargeld.']], correct:'a', explanation:'Übungsheft und Ausweis werden genannt.' },
        { id:'lc4', question:'Was hat das Kind vergessen?', options:[['a','Eine Sporttasche.'],['b','Ein Übungsheft.'],['c','Einen Ausweis.']], correct:'a', explanation:'Die Sporttasche wurde in der Halle vergessen.' },
        { id:'lc5', question:'Bis wann kann die Tasche heute abgeholt werden?', options:[['a','Bis 16 Uhr.'],['b','Bis Freitagmittag.'],['c','Bis 10 Uhr.']], correct:'a', explanation:'Abholung heute bis 16 Uhr.' },
        { id:'lc6', question:'Warum ist das Sekretariat morgen geschlossen?', options:[['a','Wegen einer Fortbildung.'],['b','Wegen Bauarbeiten.'],['c','Wegen einer technischen Störung.']], correct:'a', explanation:'Morgen findet eine Fortbildung statt.' }
      ],
      passScore:70
    }
  ];

  var writingPool = [
    {
      id:'b1-writing-provider-complaint-hard',
      variantTitle:'Variante A · Onlinekurs-Beschwerde',
      title:'Schreiben · formelle Beschwerde',
      durationMinutes:30,
      minWords:110,
      maxWords:180,
      prompt:'Du hast einen B1-Onlinekurs gebucht. Am ersten Abend funktionierte der Zugang nicht. Die Hotline war nicht erreichbar. Schreibe eine formelle Beschwerde an den Kursanbieter. Beschreibe das Problem, erkläre die Folge für dich, fordere eine konkrete Lösung und bleibe höflich.',
      requiredPoints:['formelle Anrede','Problem klar beschreiben','Folge/Nachteil erklären','konkrete Lösung fordern','höflicher Abschluss'],
      hardFailHints:['Unter 70 Wörtern ist die Antwort für B1 normalerweise nicht ausreichend.','Ohne konkrete Forderung maximal eingeschränkt prüfungsreif.','Unhöflicher Ton wird abgewertet.']
    },
    {
      id:'b1-writing-work-schedule-request-hard',
      variantTitle:'Variante B · Schichttausch-Anfrage',
      title:'Schreiben · formelle Anfrage an Teamleitung',
      durationMinutes:30,
      minWords:110,
      maxWords:180,
      prompt:'Du kannst nächste Woche an einem Vormittag nicht arbeiten, weil du einen wichtigen Behördentermin hast. Schreibe eine formelle E-Mail an deine Teamleitung. Erkläre die Situation, bitte um einen Schichttausch oder eine andere Lösung und schlage konkret vor, wie die Arbeit trotzdem erledigt werden kann.',
      requiredPoints:['formelle Anrede','Grund nachvollziehbar nennen','konkreten Zeitraum nennen','Lösung oder Schichttausch vorschlagen','höflich um Rückmeldung bitten','höflicher Abschluss'],
      hardFailHints:['Ohne konkrete Zeitangabe ist die Aufgabe unvollständig.','Nur Entschuldigung ohne Lösungsvorschlag reicht nicht.','Zu informeller Ton wird abgewertet.']
    },
    {
      id:'b1-writing-neighbour-noise-complaint-hard',
      variantTitle:'Variante C · Hausverwaltung-Beschwerde',
      title:'Schreiben · Beschwerde an Hausverwaltung',
      durationMinutes:30,
      minWords:110,
      maxWords:180,
      prompt:'In deinem Haus gibt es seit zwei Wochen abends häufig starken Lärm im Treppenhaus. Schreibe eine sachliche Beschwerde an die Hausverwaltung. Beschreibe das Problem, erkläre die Folgen für dich, bitte um eine konkrete Maßnahme und bleibe höflich.',
      requiredPoints:['formelle Anrede','Problem mit Zeitraum beschreiben','Folge/Nachteil erklären','konkrete Maßnahme erbitten','sachlicher höflicher Ton','höflicher Abschluss'],
      hardFailHints:['Aggressiver Ton wird hart abgewertet.','Ohne konkrete Maßnahme ist die Beschwerde schwach.','Zu kurze Texte sind nicht B1-prüfungsreif.']
    }
  ];

  var speakingPool = [
    {
      id:'b1-speaking-doctor-reschedule-hard',
      variantTitle:'Variante A · Arzttermin verschieben',
      title:'Sprechen · Arzttermin verschieben',
      durationMinutes:15,
      prepSeconds:30,
      responseSeconds:120,
      minWords:70,
      maxWords:180,
      prompt:'Du rufst in einer Arztpraxis an. Du kannst deinen Termin morgen nicht wahrnehmen. Verschiebe den Termin höflich, nenne einen nachvollziehbaren Grund und schlage mindestens einen neuen Termin vor. Reagiere so, als würdest du wirklich mit der Praxis sprechen.',
      requiredPoints:['höfliche Begrüßung','Termin verschieben','nachvollziehbaren Grund nennen','neuen Termin vorschlagen','Rückfrage oder Bestätigung einbauen','höflicher Abschluss'],
      hardFailHints:['Nur einzelne Stichwörter reichen nicht.','Wenn kein neuer Termin vorgeschlagen wird, ist die Aufgabe unvollständig.','Wenn die Antwort über ein anderes Thema spricht, wird hart abgewertet.']
    },
    {
      id:'b1-speaking-course-info-hard',
      variantTitle:'Variante B · Kursinformation erfragen',
      title:'Sprechen · Informationen zum Kurs erfragen',
      durationMinutes:15,
      prepSeconds:30,
      responseSeconds:120,
      minWords:70,
      maxWords:180,
      prompt:'Du interessierst dich für einen Deutschkurs und rufst im Sprachzentrum an. Frage nach Kursbeginn, Uhrzeit, Kosten und Anmeldung. Erkläre kurz, warum du den Kurs brauchst, und bitte um eine Bestätigung per E-Mail.',
      requiredPoints:['höfliche Begrüßung','Grund des Anrufs nennen','nach Kursbeginn fragen','nach Uhrzeit oder Dauer fragen','nach Kosten oder Anmeldung fragen','um Bestätigung bitten','höflicher Abschluss'],
      hardFailHints:['Nur eine einzelne Frage reicht nicht.','Mindestens mehrere Informationen müssen aktiv erfragt werden.','Ohne Abschluss wirkt das Gespräch unvollständig.']
    },
    {
      id:'b1-speaking-work-delay-hard',
      variantTitle:'Variante C · Verspätung am Arbeitsplatz',
      title:'Sprechen · Verspätung erklären',
      durationMinutes:15,
      prepSeconds:30,
      responseSeconds:120,
      minWords:70,
      maxWords:180,
      prompt:'Du rufst deine Arbeitsstelle an, weil du dich wegen einer Zugstörung um etwa 30 Minuten verspätest. Entschuldige dich, erkläre den Grund, sage wann du ungefähr ankommst und biete eine Lösung für eine dringende Aufgabe an.',
      requiredPoints:['höfliche Begrüßung','Verspätung nennen','Grund erklären','ungefähre Ankunftszeit nennen','Lösung oder Ersatz vorschlagen','Entschuldigung und Abschluss'],
      hardFailHints:['Ohne Ankunftszeit ist die Information unvollständig.','Ohne Entschuldigung wirkt die Antwort kommunikativ schwach.','Off-Topic-Antworten werden hart begrenzt.']
    }
  ];

  function clone(obj){ return JSON.parse(JSON.stringify(obj)); }
  function selectedAttempt(seed){
    seed = String(seed || Date.now());
    var attempt = {
      id:'b1-hard-pool-' + seed,
      version:VERSION,
      level:'B1',
      title:'B1 Prüfungssimulation · Aufgabenpool hart',
      description:'B1-Simulation mit wechselnden Aufgabenvarianten. Bestehen soll nicht durch Auswendiglernen entstehen.',
      strictRules:strictRules.slice(),
      reading:clone(pick(readingPool, seed, 11)),
      listening:clone(pick(listeningPool, seed, 29)),
      grammar:clone(pick(grammarPool, seed, 37)),
      writing:clone(pick(writingPool, seed, 43)),
      speaking:clone(pick(speakingPool, seed, 71)),
      poolMeta:{
        seed:seed,
        readingVariants:readingPool.length,
        listeningVariants:listeningPool.length,
        grammarVariants:grammarPool.length,
        writingVariants:writingPool.length,
        speakingVariants:speakingPool.length,
        generatedAt:new Date().toISOString()
      }
    };
    return freezeDeep(attempt);
  }


  /* Phase 38C.6 · Erweiterter Aufgabenpool + harte Grenzfallabdeckung */
  readingPool = readingPool.concat([
    {
      id:'b1-reading-authority-workshop',
      variantTitle:'Variante D · Behörde/Weiterbildung',
      title:'Lesen · Bürgerbüro und Weiterbildung',
      durationMinutes:38,
      intro:'Lies die Texte prüfungsnah. Achte auf Fristen, Bedingungen, Zuständigkeiten und den Zweck der Nachricht.',
      texts:[
        { title:'Information des Bürgerbüros', body:'Wegen einer technischen Umstellung können am Donnerstag keine neuen Ausweise beantragt werden. Bereits fertiggestellte Dokumente können jedoch zwischen 9 und 12 Uhr abgeholt werden. Wer dringend einen vorläufigen Ausweis benötigt, muss vorher telefonisch einen Termin vereinbaren und einen Nachweis über die Dringlichkeit mitbringen.' },
        { title:'Weiterbildungsangebot', body:'Das Bildungszentrum bietet ab September einen berufsbegleitenden Kurs „Deutsch am Arbeitsplatz B1/B2“ an. Der Kurs findet dienstags und donnerstags von 17:30 bis 20:00 Uhr statt. Voraussetzung ist ein abgeschlossenes A2-Niveau. Eine Beratung ist vor der Anmeldung Pflicht.' },
        { title:'E-Mail einer Teilnehmerin', body:'Sehr geehrte Frau Keller, ich interessiere mich für den Kurs Deutsch am Arbeitsplatz. Leider arbeite ich donnerstags bis 19 Uhr. Gibt es eine Möglichkeit, einzelne Termine online nachzuholen? Außerdem möchte ich wissen, ob die Beratung auch telefonisch stattfinden kann. Mit freundlichen Grüßen Aylin Demir' }
      ],
      questions:[
        { id:'rd1', question:'Was ist am Donnerstag im Bürgerbüro nicht möglich?', options:[['a','Neue Ausweise beantragen.'],['b','Fertige Dokumente abholen.'],['c','Telefonisch einen Termin vereinbaren.']], correct:'a', explanation:'Neue Ausweise können wegen technischer Umstellung nicht beantragt werden.' },
        { id:'rd2', question:'Wann können fertige Dokumente abgeholt werden?', options:[['a','Zwischen 9 und 12 Uhr.'],['b','Nur nach 17:30 Uhr.'],['c','Gar nicht am Donnerstag.']], correct:'a', explanation:'Die Abholung ist ausdrücklich zwischen 9 und 12 Uhr möglich.' },
        { id:'rd3', question:'Was braucht man für einen vorläufigen Ausweis?', options:[['a','Einen Nachweis über die Dringlichkeit.'],['b','Eine Kursanmeldung.'],['c','Eine schriftliche Beschwerde.']], correct:'a', explanation:'Telefonischer Termin und Dringlichkeitsnachweis werden genannt.' },
        { id:'rd4', question:'Welche Voraussetzung hat der Kurs?', options:[['a','Abgeschlossenes A2-Niveau.'],['b','Mindestens C1.'],['c','Keine Vorkenntnisse.']], correct:'a', explanation:'A2 wird als Voraussetzung genannt.' },
        { id:'rd5', question:'Was fragt Aylin Demir?', options:[['a','Ob sie den Kurs komplett kostenlos bekommt.'],['b','Ob Termine online nachgeholt und die Beratung telefonisch gemacht werden kann.'],['c','Ob das Bürgerbüro am Donnerstag geöffnet ist.']], correct:'b', explanation:'Beide Fragen stehen in der E-Mail.' },
        { id:'rd6', question:'Warum kann Aylin donnerstags wahrscheinlich nicht vollständig teilnehmen?', options:[['a','Sie arbeitet bis 19 Uhr.'],['b','Sie hat keinen Ausweis.'],['c','Sie wohnt nicht in der Stadt.']], correct:'a', explanation:'Sie nennt ihre Arbeitszeit bis 19 Uhr.' }
      ],
      passScore:72
    },
    {
      id:'b1-reading-transport-complaint',
      variantTitle:'Variante E · Verkehr/Reklamation',
      title:'Lesen · Fahrplanänderung und Reklamation',
      durationMinutes:38,
      intro:'Diese Variante prüft, ob du Informationen vergleichen und Beschwerden richtig einordnen kannst.',
      texts:[
        { title:'Hinweis des Verkehrsverbunds', body:'Auf der Linie 4 kommt es wegen Bauarbeiten bis Ende des Monats zu Verspätungen. Die Haltestelle Rathaus wird in dieser Zeit nicht bedient. Fahrgäste können ersatzweise die Haltestellen Marktplatz oder Stadtbibliothek nutzen. Monatskarten bleiben auch für den Ersatzbus gültig.' },
        { title:'Antwort eines Kundendienstes', body:'Sehr geehrter Herr Yilmaz, vielen Dank für Ihre Nachricht. Wir bedauern, dass Ihr bestellter Rucksack beschädigt angekommen ist. Bitte senden Sie uns innerhalb von 14 Tagen ein Foto des Schadens und die Bestellnummer. Danach erhalten Sie entweder Ersatz oder eine Rückerstattung.' },
        { title:'Kurze Bewertung', body:'Der Kundenservice hat schnell geantwortet, aber die Lösung war umständlich. Ich musste mehrere Fotos schicken und zweimal nachfragen. Am Ende bekam ich mein Geld zurück. Trotzdem würde ich dort nicht noch einmal bestellen.' }
      ],
      questions:[
        { id:'re1', question:'Warum kommt es auf Linie 4 zu Verspätungen?', options:[['a','Wegen Bauarbeiten.'],['b','Wegen eines Streiks.'],['c','Wegen schlechtem Wetter.']], correct:'a', explanation:'Die Bauarbeiten werden direkt genannt.' },
        { id:'re2', question:'Welche Haltestelle wird nicht bedient?', options:[['a','Rathaus.'],['b','Stadtbibliothek.'],['c','Marktplatz.']], correct:'a', explanation:'Die Haltestelle Rathaus wird nicht bedient.' },
        { id:'re3', question:'Was gilt für Monatskarten?', options:[['a','Sie gelten auch für den Ersatzbus.'],['b','Sie müssen neu gekauft werden.'],['c','Sie gelten nur am Wochenende.']], correct:'a', explanation:'Monatskarten bleiben auch für den Ersatzbus gültig.' },
        { id:'re4', question:'Was soll Herr Yilmaz schicken?', options:[['a','Foto des Schadens und Bestellnummer.'],['b','Seinen Ausweis und eine Teilnahmebestätigung.'],['c','Nur eine neue Bestellung.']], correct:'a', explanation:'Kundendienst fordert Foto und Bestellnummer.' },
        { id:'re5', question:'Welche Lösung wird angeboten?', options:[['a','Ersatz oder Rückerstattung.'],['b','Nur ein Gutschein für Busfahrten.'],['c','Keine Lösung.']], correct:'a', explanation:'Beides wird genannt.' },
        { id:'re6', question:'Wie bewertet die Person den Kundenservice insgesamt?', options:[['a','Schnelle Antwort, aber umständliche Lösung.'],['b','Perfekt und ohne Probleme.'],['c','Keine Rückmeldung erhalten.']], correct:'a', explanation:'Genau diese gemischte Bewertung steht im Text.' }
      ],
      passScore:72
    }
  ]);

  listeningPool = listeningPool.concat([
    {
      id:'b1-listening-job-phone',
      variantTitle:'Variante D · Arbeit/Telefonnotiz',
      title:'Hören · Schichtänderung und Rückruf',
      durationMinutes:25,
      intro:'Audio-Simulation: Lies die Hörtexte nur einmal wie eine Durchsage. Beantworte danach die Fragen.',
      situations:[
        { title:'Telefonnotiz der Teamleitung', body:'Hallo Frau Özkan, hier ist Herr Maier aus der Frühschicht. Ihre Schicht am Freitag beginnt ausnahmsweise erst um 10 Uhr, weil die Warenlieferung später kommt. Bitte bringen Sie trotzdem die Schlüsselkarte mit. Wenn Sie nicht können, melden Sie sich bis heute 16 Uhr.' },
        { title:'Mailbox einer Praxis', body:'Guten Tag, Praxis Dr. Neumann. Ihr Kontrolltermin wurde vom 6. Juni auf den 8. Juni um 11:30 Uhr verschoben. Bitte rufen Sie nur zurück, wenn der neue Termin für Sie nicht möglich ist.' }
      ],
      questions:[
        { id:'ld1', question:'Wann beginnt Frau Özkans Schicht am Freitag?', options:[['a','Um 10 Uhr.'],['b','Um 6 Uhr.'],['c','Um 16 Uhr.']], correct:'a', explanation:'Die Schicht beginnt ausnahmsweise um 10 Uhr.' },
        { id:'ld2', question:'Warum beginnt die Schicht später?', options:[['a','Die Warenlieferung kommt später.'],['b','Die Praxis ist geschlossen.'],['c','Frau Özkan hat Urlaub.']], correct:'a', explanation:'Die spätere Warenlieferung ist der Grund.' },
        { id:'ld3', question:'Bis wann soll sie sich melden, wenn sie nicht kann?', options:[['a','Bis heute 16 Uhr.'],['b','Bis morgen 10 Uhr.'],['c','Gar nicht.']], correct:'a', explanation:'Die Teamleitung nennt heute 16 Uhr.' },
        { id:'ld4', question:'Auf welchen Tag wurde der Kontrolltermin verschoben?', options:[['a','Auf den 8. Juni.'],['b','Auf den 6. Juni.'],['c','Auf Freitag 10 Uhr.']], correct:'a', explanation:'Der neue Termin ist am 8. Juni.' },
        { id:'ld5', question:'Wann soll der Patient zurückrufen?', options:[['a','Nur wenn der neue Termin nicht möglich ist.'],['b','Immer sofort.'],['c','Wenn er die Schlüsselkarte vergessen hat.']], correct:'a', explanation:'Rückruf nur bei Unmöglichkeit.' },
        { id:'ld6', question:'Welche Uhrzeit nennt die Praxis?', options:[['a','11:30 Uhr.'],['b','16:00 Uhr.'],['c','10:00 Uhr.']], correct:'a', explanation:'Der Kontrolltermin ist um 11:30 Uhr.' }
      ],
      passScore:72
    },
    {
      id:'b1-listening-school-event',
      variantTitle:'Variante E · Schule/Veranstaltung',
      title:'Hören · Elternabend und Veranstaltung',
      durationMinutes:25,
      intro:'Diese Hörvariante prüft Details, Gründe und Bedingungen.',
      situations:[
        { title:'Durchsage im Schulsekretariat', body:'Der Elternabend der Klasse 8a beginnt heute nicht im Musikraum, sondern in der Aula. Grund ist ein Wasserschaden im zweiten Stock. Der Beginn bleibt bei 19 Uhr. Bitte nutzen Sie den Eingang am Pausenhof.' },
        { title:'Nachricht des Sportvereins', body:'Das Training am Samstag fällt nicht aus, findet aber wegen eines Turniers eine Stunde früher statt. Treffpunkt ist um 8:45 Uhr vor der Halle. Bitte bringt Hallenschuhe und eine gefüllte Trinkflasche mit.' }
      ],
      questions:[
        { id:'le1', question:'Wo findet der Elternabend statt?', options:[['a','In der Aula.'],['b','Im Musikraum.'],['c','In der Sporthalle.']], correct:'a', explanation:'Wegen Wasserschaden findet er in der Aula statt.' },
        { id:'le2', question:'Warum wurde der Raum geändert?', options:[['a','Wegen eines Wasserschadens.'],['b','Wegen eines Turniers.'],['c','Weil der Elternabend ausfällt.']], correct:'a', explanation:'Wasserschaden im zweiten Stock.' },
        { id:'le3', question:'Was bleibt gleich?', options:[['a','Der Beginn um 19 Uhr.'],['b','Der Raum Musikraum.'],['c','Der Eingang am Haupteingang.']], correct:'a', explanation:'Der Beginn bleibt bei 19 Uhr.' },
        { id:'le4', question:'Was passiert mit dem Training am Samstag?', options:[['a','Es findet eine Stunde früher statt.'],['b','Es fällt komplett aus.'],['c','Es wird auf Sonntag verschoben.']], correct:'a', explanation:'Es findet wegen Turnier eine Stunde früher statt.' },
        { id:'le5', question:'Wann ist Treffpunkt?', options:[['a','Um 8:45 Uhr.'],['b','Um 19 Uhr.'],['c','Eine Stunde später.']], correct:'a', explanation:'Treffpunkt ist 8:45 Uhr.' },
        { id:'le6', question:'Was soll mitgebracht werden?', options:[['a','Hallenschuhe und Trinkflasche.'],['b','Versichertenkarte und Rezept.'],['c','Ausweis und Teilnahmebestätigung.']], correct:'a', explanation:'Beides wird genannt.' }
      ],
      passScore:72
    }
  ]);

  writingPool = writingPool.concat([
    {
      id:'b1-writing-landlord-heating',
      variantTitle:'Variante D · Wohnung/Heizung',
      title:'Schreiben · Beschwerde an die Hausverwaltung',
      durationMinutes:30,
      minWords:115,
      maxWords:190,
      prompt:'In deiner Wohnung funktioniert seit drei Tagen die Heizung nicht richtig. Schreibe eine formelle E-Mail an die Hausverwaltung. Beschreibe das Problem, erkläre die Folgen und fordere eine schnelle Lösung mit Terminvorschlag.',
      requiredPoints:['formelle Anrede','Problem mit der Heizung klar beschreiben','Dauer oder konkrete Situation nennen','Folge/Nachteil erklären','schnelle Reparatur oder Termin fordern','höflicher Abschluss'],
      hardHints:['Nur „Heizung kaputt“ reicht nicht.','Ohne Forderung nach Lösung maximal stark begrenzte Punktzahl.','Private Plauderei ohne formelle Struktur gilt als nicht prüfungsreif.']
    },
    {
      id:'b1-writing-employer-absence',
      variantTitle:'Variante E · Arbeit/Abwesenheit',
      title:'Schreiben · Nachricht an Arbeitgeber',
      durationMinutes:30,
      minWords:110,
      maxWords:180,
      prompt:'Du kannst morgen nicht zur Arbeit kommen, weil du einen dringenden Termin hast. Schreibe eine höfliche Nachricht an deine Teamleitung. Erkläre den Grund, nenne die Dauer deiner Abwesenheit, schlage eine Lösung vor und bitte um Bestätigung.',
      requiredPoints:['höfliche Anrede','Abwesenheit klar mitteilen','Grund nachvollziehbar nennen','Dauer oder Zeitraum nennen','Lösung oder Ersatz vorschlagen','um Bestätigung bitten','höflicher Abschluss'],
      hardHints:['Ohne Zeitraum gilt die Aufgabe als unvollständig.','Ohne Lösungsvorschlag bleibt die Antwort unter B1-Erwartung.','Umgangssprache ohne höfliche Struktur wird hart abgewertet.']
    }
  ]);

  speakingPool = speakingPool.concat([
    {
      id:'b1-speaking-neighbour-noise',
      variantTitle:'Variante D · Nachbarschaft/Lärm',
      title:'Sprechen · Nachbarn höflich ansprechen',
      durationMinutes:4,
      prepSeconds:30,
      answerSeconds:120,
      minWords:75,
      maxWords:190,
      prompt:'Dein Nachbar ist abends oft sehr laut. Sprich ihn höflich an. Beschreibe das Problem, erkläre die Folge für dich und schlage eine Lösung vor.',
      requiredPoints:['höfliche Begrüßung','Lärmproblem konkret beschreiben','Folge für dich nennen','ruhig und respektvoll bleiben','konkrete Lösung vorschlagen','höflicher Abschluss'],
      hardHints:['Nur Beschwerde ohne Lösung ist nicht ausreichend.','Aggressive Sprache wird als kommunikativ schwach bewertet.','Zu kurze Antwort gilt als nicht prüfungsreif.']
    },
    {
      id:'b1-speaking-course-planning',
      variantTitle:'Variante E · Kurs/Planung',
      title:'Sprechen · Lerngruppe organisieren',
      durationMinutes:4,
      prepSeconds:30,
      answerSeconds:120,
      minWords:75,
      maxWords:190,
      prompt:'Du möchtest mit anderen Teilnehmenden eine Lerngruppe organisieren. Erkläre dein Ziel, schlage einen Ort und eine Uhrzeit vor und bitte um Rückmeldung.',
      requiredPoints:['Begrüßung oder Einstieg','Ziel der Lerngruppe erklären','Ort vorschlagen','Uhrzeit oder Termin vorschlagen','Vorteil der Lerngruppe nennen','um Rückmeldung bitten','höflicher Abschluss'],
      hardHints:['Ohne Ort und Zeit ist die Planung unvollständig.','Nur „wir lernen zusammen“ reicht nicht.','Die Antwort muss zusammenhängend gesprochen oder geschrieben sein.']
    }
  ]);

  /* Phase 38C.9 · B1 Schreibprüfung: zusätzliche harte Schreibvarianten */
  writingPool = writingPool.concat([
    {
      id:'b1-writing-school-cancellation-formal',
      variantTitle:'Variante F · Schule/Entschuldigung',
      title:'Schreiben · formelle Entschuldigung an Schule',
      durationMinutes:30,
      minWords:120,
      maxWords:190,
      prompt:'Dein Kind konnte an einem wichtigen Schulausflug nicht teilnehmen, weil es kurzfristig krank wurde. Schreibe eine formelle Entschuldigung an die Klassenleitung. Nenne den Anlass, erkläre den Grund, bitte um Informationen zu verpassten Aufgaben und frage höflich nach, ob Unterlagen nachgereicht werden müssen.',
      requiredPoints:['formelle Anrede','Anlass oder Betreff klar machen','Grund nachvollziehbar nennen','verpasste Aufgaben oder Unterlagen ansprechen','konkrete Rückfrage stellen','höflicher Abschluss'],
      hardFailHints:['Ohne konkrete Rückfrage ist die Aufgabe nur teilweise erfüllt.','Nur „mein Kind war krank“ reicht für B1 nicht.','Die Nachricht muss höflich und vollständig aufgebaut sein.']
    },
    {
      id:'b1-writing-apartment-repair-request-formal',
      variantTitle:'Variante G · Wohnung/Reparatur',
      title:'Schreiben · Reparaturanfrage an Vermieter',
      durationMinutes:30,
      minWords:120,
      maxWords:190,
      prompt:'In deiner Wohnung funktioniert seit mehreren Tagen die Heizung nicht richtig. Schreibe eine formelle Nachricht an den Vermieter. Beschreibe das Problem, nenne seit wann es besteht, erkläre die Folgen und bitte um einen konkreten Reparaturtermin.',
      requiredPoints:['formelle Anrede','Problem konkret beschreiben','Zeitraum nennen','Folge/Nachteil erklären','konkreten Reparaturtermin erbitten','höflicher Abschluss'],
      hardFailHints:['Ohne Zeitraum und Reparaturwunsch ist die Anfrage unvollständig.','Aggressiver Ton wird hart abgewertet.','Ein Satz oder Stichpunkte reichen nicht.']
    },
    {
      id:'b1-writing-course-refund-request-formal',
      variantTitle:'Variante H · Kurs/Rückerstattung',
      title:'Schreiben · Antrag auf teilweise Rückerstattung',
      durationMinutes:30,
      minWords:125,
      maxWords:200,
      prompt:'Du hast einen Prüfungsvorbereitungskurs bezahlt. Zwei Termine sind ohne Ersatz ausgefallen. Schreibe eine formelle E-Mail an den Kursanbieter. Beschreibe den Sachverhalt, erkläre warum das für dich problematisch ist, fordere eine angemessene Lösung und bitte um schriftliche Antwort.',
      requiredPoints:['formelle Anrede','Sachverhalt mit ausgefallenen Terminen nennen','Folge/Nachteil erklären','angemessene Lösung oder Rückerstattung fordern','schriftliche Antwort erbitten','höflicher Abschluss'],
      hardFailHints:['Ohne konkrete Lösung/Forderung maximal kritisch.','Nur Lob oder allgemeine Höflichkeit erfüllt die Aufgabe nicht.','Der Text muss klar wie eine formelle E-Mail wirken.']
    }
  ]);

  var b1WritingStrictRubric = freezeDeep({
    label:'B1-Schreibprüfung hart · Phase 38C.9',
    requiredStructure:['Betreff/Anlass klar erkennbar','formelle Anrede','Problem/Sachverhalt','Folge oder Begründung','konkrete Bitte/Forderung','Rückfrage oder Erwartung','höflicher Abschluss'],
    scoring:['Aufgabenbezug 25%','Pflichtpunkte 30%','Länge 15%','Textstruktur 15%','formeller Aufbau/Register 15%'],
    hardCaps:['Thema verfehlt: maximal 40%','zu kurz: maximal 45%','mehrere zentrale Pflichtpunkte fehlen: maximal 68%','unformeller oder aggressiver Ton: maximal 58%','Anrede/Abschluss/Struktur fehlen: maximal 72%'],
    groqInstruction:'Bewerte als strenger B1-Schreibprüfer. Kein Schönreden. Gute Grammatik darf nicht bestehen, wenn Inhalt, Pflichtpunkte oder formeller Aufbau fehlen.'
  });
  writingPool = writingPool.map(function(task){
    task = Object.assign({}, task);
    task.assessmentRubric = b1WritingStrictRubric;
    task.requiresFormalStructure = true;
    task.requiresSubjectOrClearReason = true;
    task.requiredStructure = b1WritingStrictRubric.requiredStructure.slice();
    return task;
  });


  /* Phase 38C.10 · B1 Sprechprüfung: zusätzliche harte Sprechvarianten + Prüfer-Rubrik */
  speakingPool = speakingPool.concat([
    {
      id:'b1-speaking-parent-teacher-call-hard',
      variantTitle:'Variante F · Schule/Rückfrage',
      title:'Sprechen · Rückfrage bei Klassenleitung',
      durationMinutes:4,
      prepSeconds:30,
      responseSeconds:120,
      answerSeconds:120,
      minWords:80,
      maxWords:190,
      prompt:'Du rufst die Klassenleitung deines Kindes an, weil du eine Nachricht zum Ausflug nicht richtig verstanden hast. Begrüße höflich, erkläre kurz dein Problem, frage nach Treffpunkt und Uhrzeit, bitte um Informationen zu Kosten oder Essen und bedanke dich am Ende.',
      requiredPoints:['höfliche Begrüßung','Grund des Anrufs nennen','Problem/Unklarheit erklären','nach Treffpunkt oder Uhrzeit fragen','nach Kosten oder Essen fragen','um kurze Bestätigung bitten','höflicher Abschluss'],
      hardFailHints:['Nur „Ich habe eine Frage“ reicht nicht.','Mindestens zwei konkrete Informationen müssen erfragt werden.','Ohne höflichen Abschluss wirkt das Gespräch unvollständig.']
    },
    {
      id:'b1-speaking-complaint-delivery-hard',
      variantTitle:'Variante G · Lieferung/Reklamation',
      title:'Sprechen · beschädigte Lieferung reklamieren',
      durationMinutes:4,
      prepSeconds:30,
      responseSeconds:120,
      answerSeconds:120,
      minWords:80,
      maxWords:190,
      prompt:'Du rufst beim Kundenservice an, weil ein bestellter Rucksack beschädigt angekommen ist. Begrüße höflich, nenne Bestellnummer oder Lieferdatum, beschreibe den Schaden, erkläre was du möchtest und bitte um eine konkrete Lösung.',
      requiredPoints:['höfliche Begrüßung','Bestellung oder Lieferdatum nennen','Schaden konkret beschreiben','Folge/Problem erklären','Ersatz oder Rückerstattung verlangen','um konkrete Rückmeldung bitten','höflicher Abschluss'],
      hardFailHints:['Aggressive Sprache wird hart abgewertet.','Ohne konkrete Lösung/Forderung ist die Reklamation unvollständig.','Gute Grammatik ohne Inhalt reicht nicht.']
    },
    {
      id:'b1-speaking-work-shift-swap-hard',
      variantTitle:'Variante H · Arbeit/Schichttausch',
      title:'Sprechen · Schichttausch mit Kollegin',
      durationMinutes:4,
      prepSeconds:30,
      responseSeconds:120,
      answerSeconds:120,
      minWords:80,
      maxWords:190,
      prompt:'Du sprichst mit einer Kollegin, weil du nächste Woche wegen eines wichtigen Termins deine Schicht tauschen möchtest. Erkläre die Situation, nenne den konkreten Tag oder Zeitraum, mache einen fairen Vorschlag und frage, ob das für sie möglich ist.',
      requiredPoints:['freundlicher Einstieg','Schichttausch-Wunsch erklären','Grund nennen','konkreten Tag oder Zeitraum nennen','fairen Gegenvorschlag machen','nach Zustimmung fragen','danken oder höflich abschließen'],
      hardFailHints:['Ohne konkreten Zeitraum ist die Aufgabe nicht vollständig.','Nur eine Bitte ohne Begründung ist zu schwach.','Die Antwort muss als Gespräch wirken, nicht als Stichpunktliste.']
    }
  ]);

  var b1SpeakingStrictRubric = freezeDeep({
    label:'B1-Sprechprüfung hart · Phase 38C.10',
    requiredStructure:['Begrüßung/Einstieg','Situation oder Grund erklären','mindestens zwei konkrete Informationen','Vorschlag/Lösung/Rückfrage','höflicher Abschluss','zusammenhängende Antwort statt Stichwörter'],
    scoring:['Aufgabenbezug 30%','Pflichtpunkte 30%','Länge/Antwortumfang 15%','Gesprächsstruktur 15%','kommunikative Wirkung 10%'],
    hardCaps:['Thema verfehlt: maximal 35%','zu kurz: maximal 40%','nur Stichwörter: maximal 35%','mehrere Pflichtpunkte fehlen: maximal 62%','unhöflich/aggressiv: maximal 55%','kein Gesprächsrahmen: maximal 72%'],
    groqInstruction:'Bewerte als strenger B1-Sprechprüfer. Kein Schönreden. Die Antwort muss als Gespräch funktionieren, mehrere Pflichtpunkte erfüllen, höflich bleiben und mindestens 1–2 Minuten zusammenhängend möglich sein. Gute Wörter allein reichen nicht.'
  });
  speakingPool = speakingPool.map(function(task){
    task = Object.assign({}, task);
    task.assessmentRubric = b1SpeakingStrictRubric;
    task.requiresConfirmedTranscript = true;
    task.requiredSpeechStructure = b1SpeakingStrictRubric.requiredStructure.slice();
    return task;
  });



  var grammarPool = freezeDeep([
    {
      id:'b1-grammar-konnektoren-kasus-a',
      variantTitle:'Grammatik A · Konnektoren, Kasus, Satzstellung',
      title:'Grammatik & Sprachbausteine · Alltag und Arbeit',
      durationMinutes:20,
      intro:'Academy-Hartmodus: Grammatik zählt direkt. Wähle die Lösung, die grammatisch korrekt ist und zur Situation passt.',
      passScore:75,
      questions:[
        { id:'g1', type:'cloze', skill:'Konnektor', question:'Ich kann morgen nicht zum Termin kommen, ___ ich einen wichtigen Behördentermin habe.', options:[['a','weil'],['b','obwohl'],['c','trotzdem']], correct:'a', explanation:'Nach „weil“ folgt ein Nebensatz mit Verb am Ende.' },
        { id:'g2', type:'case', skill:'Dativ-Präposition', question:'Ich warte seit einer Woche auf ___ Antwort des Kursanbieters.', options:[['a','die'],['b','der'],['c','dem']], correct:'a', explanation:'Warten auf + Akkusativ: auf die Antwort.' },
        { id:'g3', type:'word-order', skill:'Satzstellung', question:'Welche Satzstellung ist korrekt?', options:[['a','Ich morgen kann nicht kommen.'],['b','Ich kann morgen nicht kommen.'],['c','Morgen ich kann nicht kommen.']], correct:'b', explanation:'Im Hauptsatz steht das finite Verb auf Position 2.' },
        { id:'g4', type:'polite', skill:'Konjunktiv II', question:'Welche Form ist höflich und passend?', options:[['a','Ich will sofort einen neuen Termin.'],['b','Könnten Sie mir bitte einen neuen Termin anbieten?'],['c','Du gibst mir neuen Termin.']], correct:'b', explanation:'Konjunktiv II mit „könnten“ ist höflich und prüfungsnah.' },
        { id:'g5', type:'preposition', skill:'Präposition', question:'Ich interessiere mich ___ einen B1-Kurs am Abend.', options:[['a','für'],['b','an'],['c','über']], correct:'a', explanation:'Sich interessieren für + Akkusativ.' },
        { id:'g6', type:'verb-form', skill:'Perfekt', question:'Gestern ___ der Onlinezugang nicht funktioniert.', options:[['a','hat'],['b','ist'],['c','wird']], correct:'a', explanation:'„funktionieren“ bildet das Perfekt mit „hat“.' },
        { id:'g7', type:'cloze', skill:'Nebensatz', question:'Ich bitte um Rückmeldung, ___ der Ersatztermin möglich ist.', options:[['a','ob'],['b','weil'],['c','trotzdem']], correct:'a', explanation:'Indirekte Ja/Nein-Frage mit „ob“.' },
        { id:'g8', type:'article', skill:'Artikel/Kasus', question:'Bitte schicken Sie mir ___ neue Teilnahmebestätigung per E-Mail.', options:[['a','der'],['b','die'],['c','das']], correct:'b', explanation:'„die Teilnahmebestätigung“ im Akkusativ feminin bleibt „die“.' }
      ],
      hardFailHints:['Unter 75% ist der Grammatikblock im Academy-Hartmodus kritisch.','Nur Lesen/Hören gut reicht nicht: Satzstellung, Kasus und Konnektoren werden separat geprüft.']
    },
    {
      id:'b1-grammar-nebensatz-register-b',
      variantTitle:'Grammatik B · Nebensätze, Register, Präpositionen',
      title:'Grammatik & Sprachbausteine · formelle Kommunikation',
      durationMinutes:20,
      intro:'Wähle die sprachlich saubere Lösung. Im Hardmode reicht ungefähres Verstehen nicht aus.',
      passScore:75,
      questions:[
        { id:'gb1', type:'word-order', skill:'Nebensatz', question:'Welche Form ist korrekt?', options:[['a','Ich schreibe Ihnen, weil der Zugang nicht funktioniert hat.'],['b','Ich schreibe Ihnen, weil hat der Zugang nicht funktioniert.'],['c','Ich schreibe Ihnen, weil nicht funktioniert der Zugang.']], correct:'a', explanation:'Im Nebensatz steht das finite Verb am Ende.' },
        { id:'gb2', type:'connector', skill:'Konnektor', question:'Der Kurs wurde verschoben. ___ konnte ich nicht teilnehmen.', options:[['a','Deshalb'],['b','Weil'],['c','Obwohl']], correct:'a', explanation:'„Deshalb“ verbindet die Folge im Hauptsatz.' },
        { id:'gb3', type:'register', skill:'Register', question:'Welche Formulierung passt in eine formelle Beschwerde?', options:[['a','Das war voll nervig.'],['b','Ich möchte mich über die Situation beschweren.'],['c','Ey, was soll das?']], correct:'b', explanation:'Sachliches formelles Register ist nötig.' },
        { id:'gb4', type:'preposition', skill:'Präposition', question:'Ich habe mich ___ dem Kursbüro gemeldet.', options:[['a','bei'],['b','mit'],['c','zu']], correct:'a', explanation:'Sich bei jemandem melden.' },
        { id:'gb5', type:'case', skill:'Dativ', question:'Ich habe ___ Teamleitung eine E-Mail geschrieben.', options:[['a','die'],['b','der'],['c','dem']], correct:'b', explanation:'Schreiben an/der? Hier: jemandem schreiben → Dativ: der Teamleitung.' },
        { id:'gb6', type:'modal', skill:'Modalverb', question:'Ich ___ den Termin leider verschieben.', options:[['a','muss'],['b','bin'],['c','habe']], correct:'a', explanation:'Modalverb + Infinitiv: muss verschieben.' },
        { id:'gb7', type:'relative', skill:'Relativsatz', question:'Der Kurs, ___ ich gebucht habe, ist ausgefallen.', options:[['a','den'],['b','der'],['c','dem']], correct:'a', explanation:'„Kurs“ maskulin, Akkusativ: den.' },
        { id:'gb8', type:'polite', skill:'Höfliche Bitte', question:'Welche Bitte ist am passendsten?', options:[['a','Schicken Sie das sofort.'],['b','Könnten Sie mir die Unterlagen bitte erneut zusenden?'],['c','Du sendest mir Unterlagen.']], correct:'b', explanation:'Höfliche Frageform mit Konjunktiv II.' }
      ],
      hardFailHints:['Formelle Sprache wird direkt geprüft.','B1-Hardmode erwartet sichere Basissatzstellung und passende Präpositionen.']
    },
    {
      id:'b1-grammar-mixed-hard-c',
      variantTitle:'Grammatik C · gemischte Hardmode-Prüfung',
      title:'Grammatik & Sprachbausteine · gemischter B1-Test',
      durationMinutes:20,
      intro:'Gemischte B1-Grammatik: Zeitformen, Satzstellung, Wortwahl, Präpositionen und Register.',
      passScore:75,
      questions:[
        { id:'gc1', type:'tense', skill:'Präteritum/Perfekt', question:'Letzte Woche ___ ich beim Kursbüro angerufen.', options:[['a','habe'],['b','bin'],['c','werde']], correct:'a', explanation:'Perfekt mit „haben“.' },
        { id:'gc2', type:'connector', skill:'obwohl', question:'___ ich pünktlich war, begann die Veranstaltung später.', options:[['a','Obwohl'],['b','Weil'],['c','Deshalb']], correct:'a', explanation:'„Obwohl“ drückt einen Gegensatz aus.' },
        { id:'gc3', type:'word-order', skill:'Verbposition', question:'Welche Antwort ist korrekt?', options:[['a','Morgen habe ich einen Termin.'],['b','Morgen ich habe einen Termin.'],['c','Ich morgen einen Termin habe.']], correct:'a', explanation:'Bei Vorfeld „Morgen“ steht das finite Verb direkt danach.' },
        { id:'gc4', type:'preposition', skill:'wegen + Genitiv/Dativ Umgang', question:'Formell am besten:', options:[['a','wegen dem Termin'],['b','wegen des Termins'],['c','wegen die Termin']], correct:'b', explanation:'Formell: wegen + Genitiv.' },
        { id:'gc5', type:'article', skill:'Kasus', question:'Ich bitte um ___ schnelle Rückmeldung.', options:[['a','eine'],['b','einer'],['c','einen']], correct:'a', explanation:'„um“ + Akkusativ; Rückmeldung feminin: eine.' },
        { id:'gc6', type:'connector', skill:'dass-Satz', question:'Ich hoffe, ___ Sie mir weiterhelfen können.', options:[['a','dass'],['b','weil'],['c','denn']], correct:'a', explanation:'„Ich hoffe, dass ...“ mit Verb am Ende.' },
        { id:'gc7', type:'vocabulary', skill:'passender Ausdruck', question:'Was passt am besten in eine sachliche Beschwerde?', options:[['a','Ich finde das absolut lächerlich.'],['b','Ich bitte um eine nachvollziehbare Lösung.'],['c','Macht mal schneller.']], correct:'b', explanation:'Sachlich, höflich und konkret.' },
        { id:'gc8', type:'modal', skill:'Infinitiv mit zu', question:'Ich versuche, den Termin rechtzeitig ___ verschieben.', options:[['a','zu'],['b','für'],['c','mit']], correct:'a', explanation:'„versuchen, etwas zu tun“.' }
      ],
      hardFailHints:['Gemischte Fehler zeigen echte Prüfungsrisiken.','Der Hardmode verlangt nicht Perfektion, aber sichere B1-Grundstrukturen.']
    }
  ]);


  var hardEdgeCases = freezeDeep([
    { id:'edge-too-short', title:'Zu kurz', input:'Termin geht nicht. Freitag?', expected:'nicht bestanden', reason:'zu wenige Wörter und Pflichtpunkte fehlen' },
    { id:'edge-off-topic', title:'Thema verfehlt', input:'Ich esse gerne Pizza und spiele Fußball mit meinen Freunden.', expected:'nicht bestanden', reason:'kaum Bezug zur Aufgabe' },
    { id:'edge-good-language-wrong-content', title:'Gute Sprache, falscher Inhalt', input:'Sehr geehrte Damen und Herren, vielen Dank für Ihre freundliche Nachricht. Ich wünsche Ihnen einen schönen Tag und freue mich über Ihre Arbeit.', expected:'nicht bestanden', reason:'höfliche Sprache, aber Aufgabe nicht erfüllt' },
    { id:'edge-keywords-only', title:'Nur Stichwörter', input:'Arzt. Termin. Freitag. Problem. Danke.', expected:'nicht bestanden', reason:'keine zusammenhängende B1-Antwort' },
    { id:'edge-missing-solution', title:'Pflichtpunkt Lösung fehlt', input:'Guten Tag, ich kann morgen leider nicht kommen, weil ich einen Termin habe. Das ist sehr unangenehm. Vielen Dank für Ihr Verständnis.', expected:'kritisch', reason:'Grund vorhanden, aber Lösung/Alternative fehlt' }
  ]);


  var defaultAttempt = selectedAttempt('default-phase38c5');

  function get(part){ return defaultAttempt[part] || null; }
  function getAttemptPart(attempt, part){ return (attempt && attempt[part]) || get(part); }
  function listObjective(part, attempt){
    var p = getAttemptPart(attempt, part);
    return p && Array.isArray(p.questions) ? p.questions.slice() : [];
  }
  function getFreeTask(part, attempt){
    if(part === 'writing') return getAttemptPart(attempt, 'writing');
    if(part === 'speaking') return getAttemptPart(attempt, 'speaking');
    return null;
  }
  function poolInfo(){
    return { version:VERSION, reading:readingPool.length, listening:listeningPool.length, grammar:grammarPool.length, writing:writingPool.length, speaking:speakingPool.length, combinations:readingPool.length * listeningPool.length * grammarPool.length * writingPool.length * speakingPool.length, edgeCases:hardEdgeCases.length, grammarRubric:'38C.13 strict language elements', writingRubric:'38C.9 strict formal writing', speakingRubric:'38C.10 strict speaking examiner' };
  }

  window.LanguageB1ExamPilot = Object.freeze({
    __version:VERSION,
    level:'B1',
    data:defaultAttempt,
    poolInfo:poolInfo,
    buildAttempt:selectedAttempt,
    getAttemptPart:getAttemptPart,
    get:get,
    listObjective:listObjective,
    getFreeTask:getFreeTask,
    getGrammarTask:function(attempt){ return getAttemptPart(attempt || defaultAttempt, 'grammar'); },
    getEdgeCases:function(){ return hardEdgeCases.slice(); }
  });
})();
