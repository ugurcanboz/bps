from pathlib import Path
import json, re, sys
root=Path(__file__).resolve().parent
auth=(root/"js/modules/egt-auth-engine.js").read_text(encoding="utf-8")
gate=(root/"js/modules/egt-gate-enforce.js").read_text(encoding="utf-8")
idx=(root/"index.html").read_text(encoding="utf-8")
runner=(root/"js/qa-smoke-runner.js").read_text(encoding="utf-8")
cfg=(root/"js/core/app-config.js").read_text(encoding="utf-8")
sw=(root/"service-worker.js").read_text(encoding="utf-8")
checks={
  "phase_version": "G54.39E" in cfg,
  "qa_bypass_key_auth": "egt_qa_bypass_v1" in auth and "qaBypassEnabled" in auth,
  "qa_session_auth": "QA-BYPASS-39E" in auth and "enableQaBypass" in auth,
  "gate_bypass": "qaBypassEnabled" in gate and "Phase 39E QA bypass" in gate,
  "runner_present": (root/"js/qa-smoke-runner.js").exists() and "Phase39ESmokeRunner" in runner,
  "runner_checks_actions": "simulation-center" in runner and "language-course-open" in runner and "admin-open" in runner,
  "runner_checks_touch": "collectTouchIssues" in runner and "overflowX" in runner,
  "index_loads_runner": "./js/qa-smoke-runner.js" in idx,
  "browser_smoke_page": (root/"tests_phase39e_full_app_smoke.html").exists(),
  "sw_includes_runner": "./js/qa-smoke-runner.js" in sw,
  "sw_includes_smoke_test": "./tests_phase39e_full_app_smoke.html" in sw
}
result={"phase":"39E","title":"Full App Smoke Test mit QA-Bypass","checks":checks,"passed":all(checks.values())}
(root/"phase39e_static_qa_result.json").write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(result, indent=2, ensure_ascii=False))
if not result["passed"]:
    sys.exit(1)
