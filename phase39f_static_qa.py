from pathlib import Path
import json, sys
root=Path(__file__).resolve().parent
observer=(root/"js/qa-visual-observer.js").read_text(encoding="utf-8")
cockpit=(root/"tests_phase39f_visual_observer.html").read_text(encoding="utf-8")
idx=(root/"index.html").read_text(encoding="utf-8")
cfg=(root/"js/core/app-config.js").read_text(encoding="utf-8")
sw=(root/"service-worker.js").read_text(encoding="utf-8")
checks={
  "phase_version": "G54.39F" in cfg,
  "observer_exists": (root/"js/qa-visual-observer.js").exists(),
  "observer_global_api": "window.Phase39FVisualObserver" in observer,
  "observer_full_run": "runFullObservation" in observer and "runAction" in observer and "runTab" in observer,
  "observer_layout_audit": "collectLayoutIssues" in observer and "horizontal-overflow" in observer and "small-touch-target" in observer,
  "observer_icon_audit": "collectIcons" in observer and "emoji-icon-visible" in observer,
  "observer_scroll_audit": "collectScrollContainers" in observer and "many-scroll-containers" in observer,
  "observer_visual_map": "visualMapSvg" in observer and "cyan=buttons" in observer,
  "cockpit_exists": (root/"tests_phase39f_visual_observer.html").exists(),
  "cockpit_viewports": "Desktop 1440" in cockpit and "iPad 820" in cockpit and "iPhone 390" in cockpit,
  "cockpit_exports": "phase39f_visual_observer_result.json" in cockpit and "phase39f_visual_observer_report.html" in cockpit,
  "index_loads_observer": "./js/qa-visual-observer.js" in idx,
  "sw_includes_observer": "./js/qa-visual-observer.js" in sw,
  "sw_includes_cockpit": "./tests_phase39f_visual_observer.html" in sw
}
result={"phase":"39F","title":"Visual Observer QA Cockpit","checks":checks,"passed":all(checks.values())}
(root/"phase39f_static_qa_result.json").write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(result, indent=2, ensure_ascii=False))
if not result["passed"]:
    sys.exit(1)
