# UI-G16 iOS Icon & Hero Animation Fix

## Ziel

- Kaufmännisch-Icon auf iPhone/iPad kompatibel und im gleichen Stil rendern.
- Schießstand-/Hero-Grafik auf iOS wieder animieren.

## Umsetzung

- Filterloses, iOS-kompatibles Kaufmännisch-SVG ergänzt: `assets/ui/icon-kaufm-ios.svg`.
- Universelles `icon-kaufm.svg` ebenfalls filterlos ersetzt.
- Renderer nutzt für Touch-Geräte die iOS-kompatible Icon-Version.
- Mobile CSS-Regel `animation:none` für `.ui-hero-target` entfernt.
- Hero-Animation läuft wieder über `ph-float`.

## Fundament-Regel

Das ist kein Einzelkachel-Fix: Icons und Hero-Verhalten werden zentral über Renderer + Foundation-CSS gesteuert.
