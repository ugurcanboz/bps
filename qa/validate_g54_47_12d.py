from pathlib import Path
root=Path(__file__).resolve().parents[1]
checks={
 'privacy module': (root/'js/core/privacy-data-center.js').exists(),
 'module loaded': 'privacy-data-center.js' in (root/'index.html').read_text(),
 'service worker cache': 'privacy-data-center.js' in (root/'service-worker.js').read_text(),
 'privacy center action': 'info-privacy-tools' in (root/'js/modules/info-legal-center.js').read_text(),
 'data export': 'privacy-export' in (root/'js/modules/info-legal-center.js').read_text(),
 'learning delete': 'privacy-clear-learning' in (root/'js/modules/info-legal-center.js').read_text(),
 'ai delete': 'privacy-clear-ai' in (root/'js/modules/info-legal-center.js').read_text(),
 'cache delete': 'privacy-clear-cache' in (root/'js/modules/info-legal-center.js').read_text(),
 'account request': 'privacy-account-request' in (root/'js/modules/info-legal-center.js').read_text(),
 'version': 'G54.47.' in (root/'index.html').read_text(),
}
for k,v in checks.items(): print(('PASS' if v else 'FAIL'),k)
raise SystemExit(0 if all(checks.values()) else 1)
