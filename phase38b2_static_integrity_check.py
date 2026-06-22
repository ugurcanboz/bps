import json
from pathlib import Path
root = Path(__file__).resolve().parent
checks = []
def exists(rel):
    p = root / rel
    checks.append({"check": f"exists:{rel}", "ok": p.exists()})
    return p
for rel in [
    'data/language-ai-config.js',
    'js/modules/language-ai-client.js',
    'js/learning-coach-ui.js',
    'tests_phase38b2_groq_frontend_integration.html',
    'docs_PHASE38B2_GROQ_FRONTEND_INTEGRATION.md'
]:
    exists(rel)
index = (root/'index.html').read_text(encoding='utf-8')
checks.append({"check":"index loads language-ai-config", "ok":"./data/language-ai-config.js" in index})
checks.append({"check":"index loads language-ai-client", "ok":"./js/modules/language-ai-client.js" in index})
coach = (root/'js/learning-coach-ui.js').read_text(encoding='utf-8')
for needle in ['runRemoteCoach', 'renderAiStatusCard', 'ai-health', 'ai-demo', 'remoteCoachEnabled']:
    checks.append({"check":f"coach contains {needle}", "ok":needle in coach})
config = (root/'data/language-ai-config.js').read_text(encoding='utf-8')
checks.append({"check":"worker url configured", "ok":"https://bps.ugurcan-boz.workers.dev" in config})
checks.append({"check":"no groq key in config", "ok":"gsk_" not in config})
client = (root/'js/modules/language-ai-client.js').read_text(encoding='utf-8')
checks.append({"check":"no groq key in client", "ok":"gsk_" not in client})
result = {"phase":"38B.2", "ok": all(c['ok'] for c in checks), "checks": checks}
(root/'phase38b2_static_integrity_result.json').write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps(result, indent=2, ensure_ascii=False))
