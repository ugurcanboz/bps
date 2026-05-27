# BPS-Trainer V9.1.1 · OCR Preview Stable

## Ziel
Die Scan-/OCR-Funktion wurde so überarbeitet, dass nach jedem Scan zuerst eine verpflichtende Vorschau angezeigt wird. Es wird nichts automatisch in den Fragenpool importiert oder gespeichert.

## Geändert
- OCR-Vorschau bleibt sichtbar und wird nicht mehr durch zu frühes `URL.revokeObjectURL()` beschädigt.
- Scan-Ergebnis zeigt jetzt immer:
  - Bildvorschau
  - OCR-Qualität / Confidence
  - bearbeitbaren erkannten Text
  - ehrlichen Hinweis zu Grenzen der OCR
  - Neu scannen / Kopieren / Weiter prüfen / Abbrechen
- Hinweis ergänzt: OCR erkennt zuverlässig nur klare Texte. Einfache Tabellen, Linien oder Formen werden höchstens vermutet; komplexe Matrizen, Zahnräder, Würfelrotationen und technische Skizzen müssen manuell geprüft werden.
- Ein Review-/Entwurfsformular wurde ergänzt:
  - Aufgabentyp
  - Branche
  - Modul
  - Schwierigkeit
  - Frage
  - Antwortoptionen
  - Lösung
  - Erklärung
  - Tags
- Speichern erfolgt nur explizit als lokaler Scan-Entwurf in `localStorage` unter `bps_scan_drafts`.
- Kein automatischer Import in aktive Question Banks.
- Wenn kein Text erkannt wird, kann neu gescannt oder manuell erfasst werden.
- Fehlerfälle für nicht ladbares Tesseract und Lesefehler wurden verbessert.

## Qualitätssicherung
- Node Syntax Check für alle JS-Dateien erfolgreich.
- Service Worker Cache auf `bps-trainer-v9-1-1` erhöht.
- App-Version auf `9.1.1` erhöht.

## Bekannte technische Grenze
Tesseract.js erkennt Text, aber keine komplexen Formen zuverlässig. Die integrierte Bildanalyse ist nur eine einfache Heuristik für Linien/Formen und ersetzt keine echte Computer-Vision-/KI-Bildauswertung.
