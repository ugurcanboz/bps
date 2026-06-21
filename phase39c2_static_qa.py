from pathlib import Path
import json, re, subprocess, sys
root=Path(__file__).resolve().parent
home=(root/"js/ui-home-renderer.js").read_text(encoding="utf-8")
css=(root/"css/ui-foundation.css").read_text(encoding="utf-8")
emoji_re=re.compile(r"[\U0001F300-\U0001FAFF\u2600-\u27BF]")
home_dashboard=home[home.find("'<section class=\"ui-hero-ui"):home.find("'<section class=\"ui-banner")]
checks={
  "phase_version": "G54.39C.2" in (root/"js/core/app-config.js").read_text(encoding="utf-8"),
  "no_emoji_in_ui_home_renderer": not emoji_re.search(home),
  "no_emoji_in_home_dashboard_block": not emoji_re.search(home_dashboard),
  "module_registry_uses_iconName": "iconName: 'target'" in home and "iconName: 'python'" in home and "iconName: 'education'" in home,
  "start_button_uses_inline_svg": "id=\"uiSheetStart\"><span class=\"ui-inline-icon\">" in home,
  "central_svg_registry_present": "var ICON_PATHS" in home and "function iconSvg" in home,
  "module_cards_svg": "moduleIconHtml(mod)" in home,
  "deep_cards_svg": "resolveIconMarkup(icon || 'more')" in home,
  "qa_html_present": (root/"tests_phase39c2_svg_dashboard_qa.html").exists(),
  "css_39c2_present": "Phase 39C.2 · SVG-only dashboard controls" in css
}
result={"phase":"39C.2","title":"SVG Dashboard Browser QA & Rest-Emoji Cleanup","checks":checks,"passed":all(checks.values())}
(root/"phase39c2_static_qa_result.json").write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(result, indent=2, ensure_ascii=False))
if not result["passed"]:
    sys.exit(1)
