import json
from pathlib import Path
root=Path(__file__).resolve().parent
module=(root/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
checks={
 'version_g5426':'G54.26-phase34b-c1-lessons-1-5-content-speaking-expansion' in module,
 'c1_content_snapshot':'function c1ContentSnapshot()' in module and 'c1ContentSnapshot:c1ContentSnapshot' in module,
 'phase34b_expansion_ids':'C1_PHASE34B_EXPANDED_IDS' in module,
 'phase34b_expanded_tasks':'function createC1ExpandedTasks' in module,
 'phase34b_ensure':'function ensurePhase34BContentExpansion' in module,
 'app_config_g5426':'G54.26' in (root/'js/core/app-config.js').read_text(encoding='utf-8'),
 'service_worker_cache':'egt-trainer-g54-26' in (root/'service-worker.js').read_text(encoding='utf-8'),
 'manifest_version':'"version": "G54.26"' in (root/'manifest.json').read_text(encoding='utf-8'),
 'update_check':'G54.26' in (root/'update-check.json').read_text(encoding='utf-8'),
 'test_file':(root/'tests_phase34b_c1_lessons_1_5_content_speaking_expansion.html').exists(),
 'docs_file':(root/'docs_PHASE34B_C1_LESSONS_1_5_CONTENT_SPEAKING_EXPANSION.md').exists(),
}
result={'pass':all(checks.values()),'checks':checks}
(root/'phase34b_static_integrity_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
if not result['pass']:
    print(json.dumps(result,indent=2,ensure_ascii=False))
    raise SystemExit(1)
print('PASS phase34B static integrity')
