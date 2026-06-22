# Phase 38C.12A.2 – Deep Contrast + Listening Text Fallback QA

Ziel: alle hellen Karten im Academy-Hartmodus dunkel/lesbar machen und verhindern, dass der Hörplayer bei fehlendem Pilotdatensatz „Kein Hörtext vorhanden“ vorliest.

Änderungen:
- Zusätzliche Dark-Mode-Kontrast-Overrides für Prüfungs-Sheet, Auswahlkarten, Statistikfelder, Hörstatus, Transkriptbox, Schreib-/Sprechboxen, Antwortoptionen.
- Robuste Hörtext-Fallbacks für A1/A2 oder fehlende Pilotdaten.
- Keine TTS-Ausgabe „Kein Hörtext vorhanden“ mehr.
- B1/B2 Pilot-Hörtexte bleiben bevorzugt.
- Browser-QA über Chromium-Screenshots vorbereitet.

Prüfziel: Der Modus bleibt ausschließlich Academy-Hartmodus. Keine Standard-Simulation.
