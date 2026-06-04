# G22.2 Design Regression Root Cause

## Befund
Der sichtbare Rückfall auf das alte Design wurde nicht durch den Hero selbst verursacht, sondern durch `js/wordhub-layer.js`.

Die Datei erzeugte beim Laden automatisch eine alte Shell:

- `#whShell`
- `#whTabBar`
- `#whGridWrap`

Danach wurden die neuen Startseiten-Anker in `#start` per `.wh-hidden-legacy` versteckt. Dadurch verschwand die Premium Hero/Card Startseite, obwohl der Hero-Code vorhanden war.

## Korrektur

G22.2 macht die Premium UI autoritativ:

- WordHub-Shell-Renderer deaktiviert
- `#whShell` wird nicht mehr erzeugt
- `.wh-hidden-legacy` wird aktiv von Startseiten-Ankern entfernt
- `activeAppSection` startet wieder auf `home`
- `premiumDashboard` bleibt der zentrale Startseiten-Anker
- WordHub bleibt nur noch als Hilfs-Infrastruktur für Notice/Sheet-Dialoge erhalten
- Cache-Version auf `g224-hard-ui-purge` erhöht

## Ergebnis

Die alte Shell kann die neue Hero/Card-Startseite nicht mehr überdecken.

## Nächster Schritt

Erst nach bestätigtem visuellen Test auf Handy/Desktop mit Admin Portal weitermachen.
