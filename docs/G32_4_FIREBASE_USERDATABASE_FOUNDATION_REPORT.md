# G32.4 Firebase UserDatabase Foundation

## Ziel

Die bisher lokale Teilnehmerdatenbank wurde technisch auf Firebase/Firestore vorbereitet. Die App kann Teilnehmerprofile, Zugangsdaten, Fortschrittsdaten, Versuche und Coach-Kontext remote in Firebase speichern, sobald `data/admin-sync-config.js` mit einer echten Firebase-Web-App-Konfiguration befüllt ist.

## Geändert

- `data/admin-sync-config.js`: Firebase/Firestore als UserDatabase-Provider vorbereitet.
- `js/admin-participant-engine.js`: dynamischer Firebase SDK Import, anonyme Firebase Auth, Firestore `courses/{courseId}` Struktur, Remote-Speichern von Teilnehmerprofilen, Versuchen, Fortschritt und Coach-Kontext.
- `EGTUserDatabase`: neue globale Schnittstelle für Profil, Fortschritt und Coach-Kontext.
- `EGTAdminPortal.loadCoachContext()`: Coach kann nutzerbezogene Daten laden.
- Systemdiagnose zeigt Firebase-Konfiguration und Verbindungsstatus.
- Version, Cache, Manifest und Doku auf G32.4 aktualisiert.

## Firebase Collection-Struktur

```txt
courses/{courseId}
courses/{courseId}/learners/{learnerId}
courses/{courseId}/accessCodes/{learnerId}
courses/{courseId}/learners/{learnerId}/attempts/{attemptId}
courses/{courseId}/learners/{learnerId}/progress/{moduleId}
courses/{courseId}/learners/{learnerId}/events/{eventId}
courses/{courseId}/learners/{learnerId}/coach/context
```

## Wichtig

Ohne echte Firebase-Konfiguration bleibt die PWA kontrolliert im lokalen Cache. Das ist kein Zielzustand, sondern ein Schutz, damit die App nicht komplett blockiert, solange Firebase noch nicht konfiguriert ist.
