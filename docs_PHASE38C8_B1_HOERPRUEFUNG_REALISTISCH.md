# Phase 38C.8 – B1 Hörprüfung realistischer

## Ziel
Die B1-Hörprüfung soll nicht mehr wie ein Lesetext wirken. Der Hörteil wurde deshalb zu einer realistischeren Browser-Prüfungssimulation erweitert.

## Eingebaut

- Browser-Stimme über `speechSynthesis` für B1-Hörtexte
- maximal zwei Hörvorgänge pro Hörteil
- Antwortbuttons sind vor dem ersten Hören gesperrt
- Transkript ist zuerst verborgen
- Transkript kann nach dem ersten Hören bewusst angezeigt werden
- Hörstatus mit Zähler `0/2`, `1/2`, `2/2`
- strenger Hinweis: Reines Lesen vor dem Hören ist kein echter Hörtest
- iPhone/iPad-Fallback: Wenn Browser-Stimme nicht verfügbar ist, kann nach dem Anzeigen des Transkripts weiter getestet werden

## Bewertungslogik

Lesen und Hören bleiben objektiv und lokal auswertbar. Beim Hören gilt zusätzlich:

- ohne mindestens einen Hörvorgang keine prüfungsnahe Bewertung
- Antworten werden erst nach dem Hören freigeschaltet
- das Hörlimit verhindert beliebig häufiges Wiederholen

## Kein Freigabesystem

Wie besprochen wurde keine Prüfungsfreigabe eingebaut. Die App bleibt bei:

- Ergebnisbericht
- Prüfungsreife-Prognose
- Stärken und Schwächen
- konkrete Empfehlung

## Testseite

`tests_phase38c8_b1_hoerpruefung_realistisch.html`

Prüfen:

1. Diagnose starten
2. B1 Hören öffnen
3. Antwortbuttons vor dem Hören gesperrt
4. Hörtext abspielen
5. Antworten freigeschaltet
6. Transkript anzeigen
7. Hörlimit maximal zweimal
