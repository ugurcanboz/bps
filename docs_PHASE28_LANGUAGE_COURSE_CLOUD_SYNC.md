# Phase 28 – Cloud-Sync Sprachkursfortschritt

## Ziel
Der Sprachkurs-Fortschritt wird cloudfähig gemacht, ohne Highscore, Adminportal, CTC-Simulation oder bestehende Auth-Flows umzubauen.

## Synchronisierte Daten
- aktueller Kurs / aktuelles Niveau / aktuelle Lektion
- Lesson-Progress
- Lesson-State mit richtigen/falschen Aufgaben
- offene Fehler
- Vokabelstatus
- Wiederholungsqueue
- Lernstatistiken
- Coach-QA-Snapshot als Kontext

## Neue Datei
`js/modules/language-course-cloud-sync.js`

## Neue API
```js
LanguageCourseCloudSync.push(progress)
LanguageCourseCloudSync.pull()
LanguageCourseCloudSync.flush()
LanguageCourseCloudSync.status()
LanguageCourseCloudSync.diagnostics()
```

## Integration
`LanguageAcademyCourseEntry.saveProgress()` speichert weiterhin lokal und stößt danach automatisch `LanguageCourseCloudSync.queuePush()` an.

## Cloud-Strategie
Phase 28 nutzt bewusst eine lokale-first Strategie:

1. Fortschritt wird sofort lokal gespeichert.
2. Fortschritt wird in einem lokalen Cloud-Mirror gespiegelt.
3. Wenn ein `EGTUserDatabase` Profil verfügbar ist, wird der Fortschritt in das Profilfeld `languageCourseProgress` und `modules.languageCourse.syncEnvelope` geschrieben.
4. Wenn Cloud nicht erreichbar ist, wird der Datensatz in eine Warteschlange gelegt.
5. `flush()` kann offene Einträge später nachreichen.

## UI
Im Sprachkurs-Dashboard gibt es jetzt eine eigene Karte „Cloud Sync“ mit:
- Provider
- Warteschlange
- letzter Sync
- Button „Sync jetzt“
- Button „Cloud laden“

## Abgrenzung
Nicht verändert:
- CTC
- Adminportal
- Highscore
- Teilnahmecode
- bestehende Supabase-Highscore-Tabelle

## Status
Phase 28 ist eine Cloud-fähige Brücke. Für echten produktiven Multi-Device-Sync muss im nächsten Schritt geprüft werden, welche Firestore-/Profilstruktur final eingesetzt wird und ob RLS/Policies für Supabase/Firebase aktiv passen.
