import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
checks = []

def check(name, ok, detail=""):
    checks.append({"name": name, "passed": bool(ok), "detail": detail})

css_path = ROOT / "css" / "phase39i-pixel-polish.css"
index_path = ROOT / "index.html"
sw_path = ROOT / "service-worker.js"
report_path = ROOT / "docs" / "PHASE39I_PIXEL_POLISH_REPORT.md"
test_path = ROOT / "tests_phase39i_pixel_polish.html"

css = css_path.read_text(encoding="utf-8") if css_path.exists() else ""
index = index_path.read_text(encoding="utf-8") if index_path.exists() else ""
sw = sw_path.read_text(encoding="utf-8") if sw_path.exists() else ""

check("phase39i css exists", css_path.exists(), str(css_path))
check("phase39i css linked", './css/phase39i-pixel-polish.css' in index)
check("build version 39I", 'G54.39I-2026-06-20' in index)
check("service worker cache 39I", "egt-trainer-g54-39i" in sw)
check("service worker caches phase39i css", './css/phase39i-pixel-polish.css' in sw)
check("service worker caches phase39i report", './docs/PHASE39I_PIXEL_POLISH_REPORT.md' in sw)
check("mobile header polish", '@media (max-width: 520px)' in css and '.egt-gate-top .brand b' in css)
check("tablet footer polish", '.egt-gate-copyright' in css and '@media (min-width: 769px) and (max-width: 1180px)' in css)
check("performance fallback", 'prefers-reduced-motion' in css and 'backdrop-filter: none' in css)
check("icon stabilization", '.ui-quick-icon' in css and ':is(svg, img, picture)' in css)
check("qa html exists", test_path.exists(), str(test_path))
check("report exists", report_path.exists(), str(report_path))

result = {
    "phase": "39I",
    "title": "LOW-/Pixel-Polish",
    "passed": all(c["passed"] for c in checks),
    "checks": checks,
    "summary": {
        "total": len(checks),
        "passed": sum(1 for c in checks if c["passed"]),
        "failed": sum(1 for c in checks if not c["passed"]),
    }
}
(ROOT / "phase39i_static_qa_result.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(result, ensure_ascii=False, indent=2))
raise SystemExit(0 if result["passed"] else 1)
