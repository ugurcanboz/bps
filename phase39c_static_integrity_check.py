from pathlib import Path
import json
root=Path(__file__).resolve().parent
js=(root/"js/ui-home-renderer.js").read_text()
css1=(root/"css/ui-foundation.css").read_text()
css2=(root/"css/app.css").read_text()
checks={
  "icon_registry_present":'var ICON_PATHS' in js and 'function iconSvg' in js,
  "module_cards_use_svg_helper":'<div class="ui-mod-icon ' in js and "moduleIconHtml(mod)" in js,
  "nav_uses_svg_registry":"return iconSvg(name, 'egt-dock-svg');" in js,
  "simulation_profile_cards_use_svg":"resolveIconMarkup(icon || \'target\')" in js,
  "training_cards_use_svg":"resolveIconMarkup(icon || \'practice\')" in js,
  "action_cards_use_svg":"resolveIconMarkup(icon || \'more\')" in js,
  "dashboard_quick_icons_use_svg": all(token in js for token in ["iconSvg('target')","iconSvg('coach')","iconSvg('python')","iconSvg('language')","iconSvg('more')"]),
  "ui_foundation_svg_classes_present": '.ui-svg-icon{' in css1 and '.ui-inline-icon{' in css1,
  "ui_foundation_icon_size_rules_present": '.ui-area-icon img,.ui-area-icon svg' in css1 and '.ui-quick-icon img,.ui-quick-icon svg' in css1 and '.ui-mod-icon svg,.ui-mod-icon img' in css1,
  "simulation_hero_svg_rules_present": '.ui-sim-hero-icon svg{' in css2
}
result={"phase":"39C","title":"Icon-System & Dashboard Unification","checks":checks,"passed":all(checks.values())}
(root/"phase39c_static_integrity_result.json").write_text(json.dumps(result, indent=2, ensure_ascii=False))
print(json.dumps(result, indent=2, ensure_ascii=False))
