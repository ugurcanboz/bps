# Novura G54.50.2C

Bereinigter und stabilisierter Projektstand mit Nova Guided Welcome, entferntem Legacy-Gate, einmaligem Admin-Bootstrap und Full-App-Performance-Stabilisierung.

## Start
Die App über HTTPS oder einen lokalen HTTP-Server öffnen. `file://` unterstützt Service Worker, Firebase und PWA-Funktionen nicht vollständig.

## Firebase Functions deployen
Der einmalige Admin-Bootstrap wird ausschließlich serverseitig freigeschaltet. Nach Auswahl des richtigen Firebase-Projekts müssen die Functions deployt werden:

```bash
firebase deploy --only functions
```

Ohne dieses Deployment kann die Web-App den sicheren `bootstrapAdmin`-Endpunkt nicht aufrufen.

## Zentrale Prüfung

```bash
node tools/release-gate.mjs
```

Das Release-Gate führt die lokalen QA-Suiten, Functions-/Worker-Tests und den Secret-Scan aus. Eine lokale Freigabe ist nur gültig, wenn das Gate `LOCALLY_APPROVED` meldet.

## Wichtige Sicherheitsregel
Der Bootstrap-Code ist nur für die erste Admin-Einrichtung vorgesehen. Nach erfolgreicher Vergabe sperrt der serverseitige Firestore-Lock `system/bootstrapAdmin` jeden weiteren Bootstrap dauerhaft. Normale Teilnahmecodes können keine Adminrechte vergeben.

## PWA-Aktualisierung
Nach dem Deployment die installierte App vollständig schließen und neu öffnen. Bei weiterhin sichtbarem Altstand den Website-/PWA-Cache beziehungsweise den alten Service Worker einmal entfernen.

## Status
App-Version: G54.50.2C

Lokale statische, Sicherheits- und Regressionstests sind freigegeben. Reale FPS, GPU-Darstellung und Geräteeigenheiten müssen zusätzlich auf den Zielgeräten geprüft werden.
