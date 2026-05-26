# BPS-Trainer v8.4.4 WORDHUB UI LAYER

Quelle: Eignungstest trainer.zip

Was gemacht wurde:
- Bestehende App-Struktur erhalten.
- js/app.js nicht überschrieben.
- data/question-bank.js erhalten.
- WordHub als reine UI-Schicht ergänzt: css/wordhub-layer.css + js/wordhub-layer.js.
- index.html lädt den UI-Layer zusätzlich.
- Startlogik nutzt vorhandene App.selectMode() + App.prepareTest(), falls verfügbar.
- Alte Start-Dashboard-Elemente bleiben im DOM, werden nur visuell versteckt.

Kontrolle:
- erkannte Aufgaben in data/question-bank.js: 355
