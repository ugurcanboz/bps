# Update V9.3.0 · KI Coach V2 Premium

## Ziel
Der bestehende Lerncoach wurde nicht ersetzt, sondern zur Premium-Coach-Engine erweitert. Ziel war ein spürbarer Wow-Effekt: persönliche Interaktion, adaptive Coach-Runden, lokale Erinnerung und Aufgaben, die natürlicher und abwechslungsreicher wirken.

## Eingebaut
- Andockbarer Coach-Dock unten rechts mit Live-Hinweis
- Premium Deep-Sheet UI mit Coach-Dashboard
- Lokaler Memory-Layer für Quote, Streak, Kategorien, Schwächen, Stärken und Fehlerarten
- Adaptive Task-DNA-Engine für neue Aufgabenvarianten
- Session Director für 5-Minuten-Coachrunden
- Dopamin-Feedback nach Lösungen: Streak, Tempo, schwere Aufgabe, Fehlerart
- Mikrofon-Transkription per SpeechRecognition / webkitSpeechRecognition, falls vom Browser unterstützt
- Coach-Hooks in `app.js`: echte Testergebnisse fließen in den Coach-Memory
- Keine zweite Coach-Struktur: bestehende Dateien `learning-coach-engine.js`, `learning-coach-ui.js`, `learning-coach.css` wurden erweitert

## Architektur
- `BPSLearningCoachEngine`: Wissen, Memory, Generator, Sessionlogik
- `BPSLearningCoach`: UI, Bubble, Sheet, Transkription, App-Hooks
- `localStorage`: offline-first Speicher für Coach-Memory und aktive Coach-Runde

## Qualitätsregeln
- Kein externer KI-Zugriff
- Wissensfragen bleiben No-Hallucination: keine erfundenen Fakten
- Generierte Trainingsaufgaben sind klar als Coach-Training und haben Lösung, Falle, Skill und Schwierigkeit
- Recent-Signatures verhindern unmittelbare Wiederholungen

## Tests
- `node --check js/learning-coach-engine.js`
- `node --check js/learning-coach-ui.js`
- `node --check js/app.js`
- `node scratch/test-coach-v2.js`

Hinweis: `scratch/validate_all_banks.py` enthält weiterhin lokale Windows-Absolutpfade aus der Ursprungsversion und ist deshalb in der Sandbox nicht lauffähig. Das betrifft nicht den Coach-V2-Code.
