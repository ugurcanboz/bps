from pathlib import Path
import re, sys
root=Path(__file__).resolve().parents[1]
css=(root/'css/info-legal-center.css').read_text(encoding='utf-8')
js=(root/'js/modules/info-legal-center.js').read_text(encoding='utf-8')
icons=(root/'js/core/app-icons.js').read_text(encoding='utf-8')
index=(root/'index.html').read_text(encoding='utf-8')
checks={
 'version synchronized': all('G54.47.' in p.read_text(encoding='utf-8') for p in [root/'index.html',root/'js/core/app-config.js',root/'js/modules/info-legal-center.js']),
 '44px touch minimum': 'min-height:48px' in css,
 'mobile breakpoint': '@media(max-width:420px)' in css,
 'desktop content width': 'max-width:980px' in css,
 'landscape hardening': '@media(orientation:landscape)' in css,
 'dark class support': 'html[data-theme="dark"]' in css,
 'forced colors support': '@media(forced-colors:active)' in css,
 'higher contrast support': '@media(prefers-contrast:more)' in css,
 'focus visibility': ':focus-visible' in css,
 'overflow protection': 'overflow-wrap:anywhere' in css,
 'SVG status icons': all(k in icons for k in ["check:","pending:","status:","arrow:"]),
 'no roadmap emoji markers': "i<3?'✓':'○'" not in js,
 'no operator emoji markers': "x[1]?'✓':'!'" not in js,
 'action aria labels': 'aria-label="\'+esc(title)' in js,
 'stylesheet loaded': 'info-legal-center.css' in index,
}
for k,v in checks.items(): print(('PASS' if v else 'FAIL'),k)
print(f"SUMMARY {sum(checks.values())}/{len(checks)}")
sys.exit(0 if all(checks.values()) else 1)
