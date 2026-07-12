# Rollback G54.49.0I

## Ziel

Zurück auf den stabilen Stand G54.49.0H wechseln, falls das finale Welcome-QA-Gate oder die aktualisierten Regressionstests unerwartete Probleme verursachen.

## Vorgehen

1. Die vorherige G54.49.0H-Release-ZIP wiederherstellen.
2. Service Worker und Browser-Cache leeren bzw. aktualisieren.
3. `novura.novaMemory.v2`, `novura.novaIntroduction.v1.seen` und `novura.novaProductTour.v1` dürfen erhalten bleiben; bei inkonsistentem Zustand können sie lokal gelöscht werden.
4. Release-, Auth- und Welcome-Regressionen erneut ausführen.

## Datenmigration

G54.49.0I führt keine neue Server- oder Datenbankmigration ein. GPS-Koordinaten, Freitexte und sensible Profile werden weiterhin nicht gespeichert.
