# G33.2 Firebase Configured Report

## Zweck
Firebase-Web-App-Konfiguration wurde in `data/admin-sync-config.js` eingetragen.

## Eingetragen
- projectId: `bbq-userdatabase`
- authDomain: `bbq-userdatabase.firebaseapp.com`
- databaseURL: Realtime Database URL vorhanden, aktuell primär Firestore-Konzept
- storageBucket: vorhanden
- messagingSenderId: vorhanden
- appId: vorhanden
- measurementId: vorhanden

## Wichtig
Die App nutzt für die UserDatabase weiterhin Firestore. Firebase Realtime Database ist zwar in der Konfiguration vorhanden, wird aber durch den aktuellen UserDatabase-Service nicht als primäre Datenbank verwendet.

## Nächste manuelle Firebase-Schritte
1. Authentication → Anonymous sign-in aktivieren.
2. Firestore Database erstellen.
3. Firestore Rules anhand der Projektregeln setzen.
4. Danach Admin-Codegenerator testen.
