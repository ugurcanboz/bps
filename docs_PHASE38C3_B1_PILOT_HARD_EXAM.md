# Phase 38C.3 – B1 Pilotprüfung hart

## Ziel

Diese Phase baut die erste wirklich harte Pilotprüfung für B1. B1 wurde bewusst zuerst gewählt, weil dieses Niveau für Alltag, Arbeit, Umschulung, Behörden und Integration der wichtigste Schwellenwert ist.

## Eingebaut

- Neue Datei `data/language-b1-exam-pilot.js`
- B1-Leseprüfung mit drei Texten und sechs Fragen
- B1-Hörprüfung als Audio-Simulation mit zwei Hörtexten und sechs Fragen
- B1-Schreibprüfung: formelle Beschwerde an Kursanbieter
- B1-Sprechprüfung: Arzttermin verschieben
- Harte Pflichtpunkte und harte Abwertung bei Themenverfehlung, zu kurzer Antwort und fehlenden Kernpunkten
- Groq-Prüfungslehrer wird bei Schreiben und Sprechen nur gezielt nach bestätigtem Text/Transkript genutzt

## Bewertungsprinzip

- Lesen/Hören: lokal und objektiv
- Schreiben/Sprechen: lokale Vorprüfung + optionaler Groq-Mitprüfer
- Bestanden bedeutet nicht Motivation, sondern realistischere Prüfungschance

## Schutz gegen Browser-Speech-Probleme

Bei Sprechen bleibt das Textfeld für das bestätigte Transkript zentral. Die KI bewertet nicht ungeprüfte, schlechte Browser-Speech-Ausgaben, sondern nur die vom Teilnehmer bestätigte Antwort.

## Nicht enthalten

- Noch keine vollständige offizielle Zertifikatslogik
- Noch keine echten Audiodateien
- Noch kein A1/A2/B2/C1/C2 Vollausbau

## Nächster Schritt

Phase 38C.4 sollte die Ergebnisbewertung verschärfen und den B1-Bericht ausbauen: Stärken, Schwächen, Prüfungswahrscheinlichkeit und konkrete Wiederholungsempfehlungen.
