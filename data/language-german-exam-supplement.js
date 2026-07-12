/* Eignungstest-Trainer · G54.45.0
   Deutsches Vollprüfungs-Supplement: erweitert jede der 18 bestehenden
   Varianten um einen zusätzlichen Textsatz und je eine weitere Lese- und
   Hörfrage (Umfang 3→4 Fragen pro objektivem Textteil).
   Zeilenformat wie qrow: [id, frage, korrekt, falsch1, falsch2, 'a', erklärung] */
(function(){
  'use strict';
  function r(id,q,c,w1,w2,e){ return [id,q,c,w1,w2,'a',e||'Die Antwort steht im Text.']; }

  window.LanguageGermanExamSupplement = {
    'a1-v1':{ readingExtra:'Der Kurs dauert neunzig Minuten und endet um 19:30 Uhr.', listeningExtra:'Die Pause ist um neunzehn Uhr.',
      readingQ:r('a1v1r4','Wie lange dauert der Kurs?','Neunzig Minuten','Zehn Minuten','Vier Stunden'),
      listeningQ:r('a1v1l4','Wann ist die Pause?','Um neunzehn Uhr','Um sechs Uhr','Es gibt keine Pause') },
    'a1-v2':{ readingExtra:'Die Bäckerei im Supermarkt schließt schon um 18 Uhr.', listeningExtra:'Der Parkplatz hinter dem Markt ist heute kostenlos.',
      readingQ:r('a1v2r4','Wann schließt die Bäckerei?','Um 18 Uhr','Um 20 Uhr','Um 9 Uhr'),
      listeningQ:r('a1v2l4','Was ist heute kostenlos?','Der Parkplatz','Das Brot','Die Milch') },
    'a1-v3':{ readingExtra:'Man kann ein Buch vier Wochen ausleihen.', listeningExtra:'Im Lesesaal bitte leise sein.',
      readingQ:r('a1v3r4','Wie lange kann man ein Buch ausleihen?','Vier Wochen','Einen Tag','Ein Jahr'),
      listeningQ:r('a1v3l4','Wo soll man leise sein?','Im Lesesaal','Auf der Straße','Im Bus') },
    'a2-v1':{ readingExtra:'Bitte bringen Sie zum Termin Ihre Versichertenkarte mit.', listeningExtra:'Denken Sie bitte an Ihre Versichertenkarte.',
      readingQ:r('a2v1r4','Was soll man zum Termin mitbringen?','Die Versichertenkarte','Ein Wörterbuch','Sportkleidung'),
      listeningQ:r('a2v1l4','Woran soll man denken?','An die Versichertenkarte','An den Regenschirm','An das Frühstück') },
    'a2-v2':{ readingExtra:'Frau Kaya kann mit dem Auto fahren und schlägt den neuen Markt am Bahnhof vor.', listeningExtra:'Ich kann uns mit dem Auto zum Markt am Bahnhof fahren.',
      readingQ:r('a2v2r4','Wie wollen die Nachbarinnen zum Markt kommen?','Mit dem Auto von Frau Kaya','Mit dem Flugzeug','Zu Fuß über zwei Stunden'),
      listeningQ:r('a2v2l4','Wo ist der Markt?','Am Bahnhof','Neben der Schule','In einer anderen Stadt') },
    'a2-v3':{ readingExtra:'Am Informationsschalter gibt es eine Bestätigung über die Verspätung für den Arbeitgeber.', listeningExtra:'Eine Verspätungsbestätigung erhalten Sie am Informationsschalter in der Haupthalle.',
      readingQ:r('a2v3r4','Was bekommt man am Informationsschalter?','Eine Verspätungsbestätigung','Ein kostenloses Essen','Eine neue Fahrkarte'),
      listeningQ:r('a2v3l4','Wo bekommt man die Bestätigung?','Am Informationsschalter in der Haupthalle','Im Zug','In der Bibliothek') },
    'b1-v1':{ readingExtra:'Die Kursgebühr ändert sich durch den Ausfall nicht.', listeningExtra:'Wer bis Mittwoch schreibt, dessen Fehlzeit gilt als entschuldigt.',
      readingQ:r('b1v1r4','Was passiert mit der Kursgebühr?','Sie bleibt gleich.','Sie wird verdoppelt.','Sie wird komplett erstattet.'),
      listeningQ:r('b1v1l4','Was gilt, wenn man bis Mittwoch schreibt?','Die Fehlzeit gilt als entschuldigt.','Man bekommt einen neuen Ausweis.','Man verliert den Kursplatz.') },
    'b1-v2':{ readingExtra:'Auch der Aufzug ist bis zwölf Uhr außer Betrieb.', listeningExtra:'Der Aufzug funktioniert bis zwölf Uhr nicht.',
      readingQ:r('b1v2r4','Was ist außerdem bis zwölf Uhr außer Betrieb?','Der Aufzug','Die Haustür','Die Heizung im Sommer'),
      listeningQ:r('b1v2l4','Was funktioniert bis zwölf Uhr nicht?','Der Aufzug','Das Licht im Keller nie wieder','Die Klingel für immer') },
    'b1-v3':{ readingExtra:'Überstunden aus dieser Woche werden mit dem nächsten Gehalt ausgezahlt oder können im August als freie Tage genommen werden.', listeningExtra:'Überstunden zahlen wir mit dem nächsten Gehalt aus.',
      readingQ:r('b1v3r4','Welche zwei Möglichkeiten gibt es für Überstunden?','Auszahlung oder freie Tage im August','Ein neues Auto oder Urlaub','Es gibt keine Regelung'),
      listeningQ:r('b1v3l4','Wie werden Überstunden behandelt?','Sie werden mit dem nächsten Gehalt ausgezahlt.','Sie verfallen sofort.','Sie werden nie erwähnt.') },
    'b2-v1':{ readingExtra:'Der Autor nennt digitale Werkzeuge deshalb einen Verstärker: Sie stärken gute Strukturen ebenso wie bestehende Ungleichheit.', listeningExtra:'Die Technik war am Ende der kleinste Teil der Veränderung.',
      readingQ:r('b2v1r4','Was bedeutet das Bild vom Verstärker?','Digitale Werkzeuge verstärken gute Strukturen und Ungleichheit gleichermaßen.','Digitale Werkzeuge machen den Unterricht lauter.','Digitale Werkzeuge ersetzen Lehrkräfte vollständig.'),
      listeningQ:r('b2v1l4','Was war laut Hörtext der kleinste Teil der Veränderung?','Die Technik','Die Lernzeiten','Die Rückmeldungen') },
    'b2-v2':{ readingExtra:'Die Verwaltung kündigt nach sechs Monaten eine Auswertung mit Daten zu Luftqualität, Pünktlichkeit und Umsätzen an.', listeningExtra:'Nach sechs Monaten wird das Konzept mit Daten zu Luft und Umsätzen ausgewertet.',
      readingQ:r('b2v2r4','Was enthält die Auswertung nach sechs Monaten?','Daten zu Luftqualität, Pünktlichkeit und Umsätzen','Nur das Wetter','Die Zahl der Museumsbesucher'),
      listeningQ:r('b2v2l4','Wann wird das Konzept ausgewertet?','Nach sechs Monaten','Nach zehn Jahren','Nie') },
    'b2-v3':{ readingExtra:'Als dritter Erfolgsfaktor gilt strukturiertes Feedback innerhalb von zwei Wochen nach jedem Modul.', listeningExtra:'Am wirksamsten war Feedback der Vorgesetzten innerhalb von zwei Wochen.',
      readingQ:r('b2v3r4','Innerhalb welcher Frist soll Feedback erfolgen?','Innerhalb von zwei Wochen','Innerhalb von zwei Jahren','Es gibt keine Frist'),
      listeningQ:r('b2v3l4','Wessen Feedback war besonders wirksam?','Das der Vorgesetzten','Das der Kundschaft','Das der Nachbarn') },
    'c1-v1':{ readingExtra:'Der Text fordert, Verantwortlichkeiten zu klären, bevor solche Systeme eingeführt werden — nicht danach.', listeningExtra:'Schulen sollten Zuständigkeiten festlegen, bevor sie adaptive Systeme einführen.',
      readingQ:r('c1v1r4','Wann sollen Verantwortlichkeiten geklärt werden?','Vor der Einführung der Systeme','Erst nach mehreren Jahren','Gar nicht'),
      listeningQ:r('c1v1l4','Was sollen Schulen vor der Einführung tun?','Zuständigkeiten festlegen','Mehr Geräte kaufen','Alle Prüfungen abschaffen') },
    'c1-v2':{ readingExtra:'Hybride Modelle gelingen der Analyse zufolge dort, wo Teams explizite Regeln zu Kernzeiten und Antwortfristen aushandeln.', listeningExtra:'Ohne explizite Regeln berichteten Beschäftigte trotz flexibler Zeiten von Erschöpfung.',
      readingQ:r('c1v2r4','Wo gelingen hybride Modelle?','Wo Teams explizite Regeln aushandeln','Wo niemand über Regeln spricht','Wo alle dauerhaft erreichbar sind'),
      listeningQ:r('c1v2l4','Wovon berichteten Beschäftigte ohne explizite Regeln?','Von Erschöpfung trotz flexibler Zeiten','Von höheren Gehältern','Von kürzeren Wegen') },
    'c1-v3':{ readingExtra:'Faktenprüfung gilt als notwendig, aber unzureichend: Eine korrekte Aussage kann durch ihre Rahmung dennoch irreführen.', listeningExtra:'Als Beispiel nennt der Podcast einen Wohnbericht, der Investoren zitierte, aber keine Mieter befragte.',
      readingQ:r('c1v3r4','Warum ist Faktenprüfung allein unzureichend?','Weil korrekte Aussagen durch ihre Rahmung irreführen können','Weil Fakten nie prüfbar sind','Weil Prüfen zu lange dauert'),
      listeningQ:r('c1v3l4','Was fehlte in dem Wohnbericht aus dem Beispiel?','Die Perspektive der Mieter','Aktuelle Zahlen','Fotos der Gebäude') },
    'c2-v1':{ readingExtra:'Die Rhetorik der Unvermeidlichkeit leistet dabei politische Arbeit: Sie macht eine anfechtbare Entscheidung zur scheinbar natürlichen Entwicklung.', listeningExtra:'Wer die Kennzahlen definiert, definiert leise auch die Ziele der Bildung.',
      readingQ:r('c2v1r4','Was leistet die Rhetorik der Unvermeidlichkeit?','Sie macht eine anfechtbare Entscheidung zur scheinbar natürlichen Entwicklung.','Sie erhöht Schulbudgets.','Sie verbietet Kritik per Gesetz.'),
      listeningQ:r('c2v1l4','Was folgt daraus, wer die Kennzahlen definiert?','Er definiert leise auch die Bildungsziele.','Er bekommt automatisch recht.','Er muss nichts mehr begründen dürfen niemals.') },
    'c2-v2':{ readingExtra:'Positionen werden dann nicht mehr anhand besserer Argumente revidiert, sondern als Zeichen von Gruppenloyalität verteidigt.', listeningExtra:'Ihr Schluss ist doppelbödig: Das Publikum belohnt Empörung mit Aufmerksamkeit — das Anreizsystem selbst ist Teil des Problems.',
      readingQ:r('c2v2r4','Wie werden Positionen unter diesen Bedingungen verteidigt?','Als Zeichen von Gruppenloyalität','Als mathematische Beweise','Als private Hobbys'),
      listeningQ:r('c2v2l4','Was ist an ihrem Schluss doppelbödig?','Das Anreizsystem des Publikums wird als Teil des Problems benannt.','Sie widerruft ihre gesamte Analyse.','Sie verweigert jede Schlussfolgerung.') },
    'c2-v3':{ readingExtra:'Wer diese Rahmung kontrolliert, verschiebt zugleich die Begründungslast: Betroffene müssen sich aus einer Kategorie herausargumentieren, der sie nie zugestimmt haben.', listeningExtra:'Ihr Rat an Verfasser: Jede Klassifikation in einem Richtlinientext ist ein argumentativer Zug, der selbst begründet werden muss.',
      readingQ:r('c2v3r4','In welcher Lage sind die Betroffenen?','Sie müssen sich aus einer nie gewählten Kategorie herausargumentieren.','Sie erhalten automatische Vorteile.','Sie sind schlicht nicht betroffen.'),
      listeningQ:r('c2v3l4','Welchen Rat gibt die Juristin den Verfassern?','Jede Klassifikation als begründungspflichtigen argumentativen Zug behandeln','Alle Klassifikationen für immer vermeiden','Mehr Fachjargon verwenden') }
  };
})();
