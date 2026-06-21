from pathlib import Path
import json, sys
root=Path(__file__).resolve().parent
cfg=(root/'js/core/app-config.js').read_text(encoding='utf-8')
sw=(root/'service-worker.js').read_text(encoding='utf-8')
report=root/'docs/PHASE39G_VISUAL_OBSERVER_REPORT.md'
raw=root/'phase39g_visual_observer_result.json'
runner=root/'phase39g_visual_observer_report.py'
checks={
  'version_g54_39g': 'G54.39G' in cfg,
  'report_exists': report.exists() and 'Phase 39G' in report.read_text(encoding='utf-8'),
  'raw_result_exists': raw.exists() and json.loads(raw.read_text(encoding='utf-8')).get('phase')=='39G',
  'runner_exists': runner.exists() and 'sync_playwright' in runner.read_text(encoding='utf-8'),
  'sw_cache_includes_39g': 'phase39g_visual_observer_result.json' in sw and 'PHASE39G_VISUAL_OBSERVER_REPORT.md' in sw,
  'working_plan_updated': 'Phase 39G' in (root/'WORKING-PLAN_1.md').read_text(encoding='utf-8')
}
result={'phase':'39G','title':'Visual Observer Report QA','checks':checks,'passed':all(checks.values())}
(root/'phase39g_static_qa_result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
if not result['passed']:
    sys.exit(1)
