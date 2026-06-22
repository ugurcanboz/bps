from pathlib import Path
import json, re, sys
root=Path(__file__).resolve().parent
ui=(root/"css/ui-foundation.css").read_text(encoding="utf-8")
admin=(root/"css/admin-portal.css").read_text(encoding="utf-8")
lang=(root/"css/language-course.css").read_text(encoding="utf-8")
app=(root/"css/app.css").read_text(encoding="utf-8")
cfg=(root/"js/core/app-config.js").read_text(encoding="utf-8")
checks={
  "phase_version": "G54.39D" in cfg,
  "root_touch_tokens": "--egt-touch-min: 44px" in ui and "--egt-touch-min-comfort: 48px" in ui,
  "global_button_selector": "button," in ui and "[role=\"button\"]" in ui,
  "touch_action_manipulation": ui.count("touch-action: manipulation") >= 3,
  "tap_highlight_removed": ui.count("-webkit-tap-highlight-color: transparent") >= 3,
  "summary_min_height": "details > summary" in ui and "min-height: var(--egt-touch-min)" in ui,
  "admin_touch_normalization": "Phase 39D · Admin Touch Target Normalisierung" in admin and "min-height: 44px !important" in admin,
  "language_touch_normalization": "Phase 39D · Language Academy Touch Target Normalisierung" in lang and ".la-primary" in lang,
  "legacy_chip_normalization": "Phase 39D · legacy chips/buttons touch normalization" in app and ".qnav-page-btn" in app,
  "browser_qa_present": (root/"tests_phase39d_touch_targets.html").exists()
}
result={"phase":"39D","title":"Button/Touch Target Normalisierung","checks":checks,"passed":all(checks.values())}
(root/"phase39d_static_qa_result.json").write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(result, indent=2, ensure_ascii=False))
if not result["passed"]:
    sys.exit(1)
