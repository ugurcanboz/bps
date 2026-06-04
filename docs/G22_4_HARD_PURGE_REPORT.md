# G22.4 Hard UI Purge Report

## Kernbefund
Die alten UI-Systeme waren nicht vollständig entfernt. Besonders kritisch waren deaktivierte Renderer-Kommentare, alte `wh*`-/WordHub-Kompatibilitätsnamen und gestapelte CSS-Versionen für Trainingsmenüs. Dadurch konnte weiterhin eine andere/alte Oberfläche dominieren oder die neue Hero-Startseite überlagern.

## Harte Entfernung
- `wordhub-layer.css` und `wordhub-layer.js` bleiben aus dem Build entfernt.
- WordHub-Kompatibilitätsobjekt `EGTWordHubLayer` wurde aus dem aktiven Code entfernt und durch `BPSSheetLayer` ersetzt.
- `whSheet`, `whSheetBackdrop`, `whNotice`, `wh-*` wurden in `bpsSheet`, `bpsSheetBackdrop`, `bpsNotice`, `bps-*` umbenannt.
- Deaktivierte Navigation in `renderAppNav()` und `renderMobileTopNav()` wurde repariert.
- Inline-`display:none` auf zentralen Home-UI-Ankern wurde aus `index.html` entfernt.
- Gestapelte alte Deep-Sheet-/Training-CSS-Blöcke wurden aus `css/app.css` entfernt und durch ein sauberes G22.4-Sheet-System ersetzt.
- Alte G21/G22-Regressionsberichte wurden in ein Archiv verschoben.

## Neuer UI-Vertrag
`app.js` ist der einzige aktive Home-Renderer.
`premiumDashboard` ist die einzige Hero/Card-Startseite.
`appNav` wird wieder durch `renderAppNav()` erzeugt.
`mobileTopNav` wird durch `renderMobileTopNav()` erzeugt.
`BPSSheetLayer` liefert nur Toast/Sheet-Infrastruktur, keine Startseite.

## Zusätzlich entfernt
- `js/core/deep-sheet-controller.js` wurde vollständig aus dem aktiven Build entfernt, weil es ein zweites Sheet-/Routing-System war und App-Funktionen überschrieben hat.
