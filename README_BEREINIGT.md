# Novura G54.50.2F

Stabilisierter Projektstand mit fortlaufendem Nova-Chatverlauf, erneut startbarer Begrüßung, entferntem Legacy-Gate, einmaligem Admin-Bootstrap und Full-App-Performance-Stabilisierung.

## Start
Die App über HTTPS oder einen lokalen HTTP-Server öffnen. `file://` unterstützt Service Worker, Firebase und PWA-Funktionen nicht vollständig.

## Firebase Functions deployen
Der einmalige Admin-Bootstrap wird ausschließlich serverseitig freigeschaltet. Nach Auswahl des richtigen Firebase-Projekts müssen die Functions deployt werden:

```bash
firebase deploy --only firestore,functions
```

Ohne dieses Deployment bleibt die bisherige Function aktiv. G54.50.2F erlaubt ausschließlich dem einmaligen `bootstrapAdmin`-Endpunkt den Erstaufruf vor einer vollständigen App-Check-Einrichtung. Alle anderen privilegierten Cloudaktionen bleiben weiterhin App-Check-pflichtig.

Der Bootstrap benötigt eine aktivierte Firestore-Datenbank. Unerwartete Serverfehler werden jetzt mit einer Diagnose-ID und der betroffenen Verarbeitungsstufe an die Oberfläche zurückgegeben. Ein bereits abgeschlossener Bootstrap desselben Firebase-Kontos kann idempotent bestätigt oder repariert werden.

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
App-Version: G54.50.2F

Lokale statische, Sicherheits- und Regressionstests sind freigegeben. Reale FPS, GPU-Darstellung und Geräteeigenheiten müssen zusätzlich auf den Zielgeräten geprüft werden.


## G54.50.2F · iPhone Nova-Chat-Scroll
Der Nova-Gesprächsverlauf ist als eigener nativer Touch-Scroller markiert. iPhone Safari erhält `touch-action: pan-y`, Momentum-Scrolling, eine echte Flex-Min-Height und die UI-Router-Kennung `data-modal-scroll`. Frühere Nachrichten können innerhalb des Chatbereichs nach oben und unten gescrollt werden.


## G54.50.2F · Bootstrap-Serverdiagnose
- rohe Serverexceptions werden in sichere Firebase `HttpsError`-Antworten übersetzt
- Firestore-, Rechte-, Timeout- und unbekannte Fehler werden getrennt behandelt
- Diagnose-ID und Fehlerstufe werden im Formular angezeigt
- ein Teilerfolg kann mit demselben Firebase-Konto wiederholt werden
- ein nachgelagerter Auditfehler macht einen erfolgreich eingerichteten Admin nicht mehr rückgängig
