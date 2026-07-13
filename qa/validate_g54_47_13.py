from pathlib import Path
import re, json, subprocess, sys
root=Path(__file__).resolve().parents[1]
css=(root/'css/global-device-a11y-qa.css').read_text()
idx=(root/'index.html').read_text()
admin=(root/'admin-portal.html').read_text()
sw=(root/'service-worker.js').read_text()
checks={
'version': (lambda v: all(v in (root/f).read_text() for f in ['index.html','js/core/app-config.js','service-worker.js','manifest.json','update-check.json']))(re.search(r"var VERSION = '([^']+)'", (root/'js/core/app-config.js').read_text()).group(1)),
'global css loaded main':'global-device-a11y-qa.css' in idx,
'global css loaded admin':'global-device-a11y-qa.css' in admin,
'offline cached':'global-device-a11y-qa.css' in sw,
'touch targets':'--egt-touch-min:48px' in css,
'keyboard focus':':focus-visible' in css,
'reduced motion':'prefers-reduced-motion:reduce' in css,
'forced colors':'forced-colors:active' in css,
'high contrast':'prefers-contrast:more' in css,
'small phone':'max-width:420px' in css,
'landscape':'orientation:landscape' in css,
'coarse pointer':'pointer:coarse' in css,
'safe area':'safe-area-inset' in css,
'overflow hardening':'overflow-wrap:anywhere' in css,
'media responsive':'img,svg,video,canvas,audio' in css,
}
for k,v in checks.items(): print(('PASS' if v else 'FAIL'),k)
print('SUMMARY',sum(checks.values()),'/',len(checks))
sys.exit(0 if all(checks.values()) else 1)
