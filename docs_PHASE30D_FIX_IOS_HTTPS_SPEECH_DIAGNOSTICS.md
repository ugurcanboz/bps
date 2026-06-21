# Phase 30D-FIX – iPhone/iPad HTTPS/Secure Speech Diagnostics

## Anlass
Auf Desktop funktionierte die Sprechaufgabe, auf iPhone/iPad jedoch nicht. Der Screenshot zeigte den Zugriff über eine lokale IP-Adresse (`192.168.x.x`). Auf iOS/iPadOS ist das für Web-Speech/Mikrofon kritisch, weil Browser-APIs in unsicheren Kontexten oder lokalen HTTP-Umgebungen blockiert oder nicht bereitgestellt werden können.

## Änderung
Die Sprachkurs-Speech-Diagnose erkennt jetzt zusätzlich:

- lokale/private IP-Adressen wie `192.168.x.x`, `10.x.x.x`, `172.16-31.x.x`
- fehlenden Secure Context / HTTP statt HTTPS
- iPhone/iPad + Home-Screen/PWA
- SpeechRecognition-Engine vorhanden/nicht vorhanden
- Hostname und Verbindungsstatus im Mikrofon-Check

## Neues Verhalten
Wenn die App über lokale IP oder HTTP geöffnet wird, zeigt der Mikrofon-Check nicht mehr nur generisch `unsupported`, sondern:

- Status: `insecure_context`
- Verbindung: `Nicht sicher / HTTP`
- Host: aktuelle lokale IP
- Hinweis: Auf iPhone/iPad bitte GitHub Pages / HTTPS verwenden

Die Aufgabe bleibt weiterhin nutzbar und fällt in den mobilen Übungsmodus zurück.

## Wichtig
Dieser Fix erzwingt keine automatische iOS-Spracherkennung über HTTP. Das wäre browserseitig nicht zuverlässig möglich. Er verhindert falsche Diagnose und gibt dem Tester eine klare Ursache plus Handlung.

## Testanweisung
1. iPhone/iPad über lokale IP öffnen, z. B. `http://192.168.x.x`.
2. Mikrofon prüfen öffnen.
3. Erwartet: Status `insecure_context`, Host sichtbar, Hinweis auf HTTPS.
4. Danach GitHub-Pages-HTTPS öffnen.
5. Dort erneut Mikrofon prüfen und Sprechaufgabe testen.

## Nicht verändert
CTC, Admin, Highscore, Teilnahmecode, Firebase/Supabase und Hauptnavigation wurden nicht verändert.
