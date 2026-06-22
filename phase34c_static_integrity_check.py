from pathlib import Path
import json,re
root=Path(__file__).resolve().parent
module=(root/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
checks={
 'version_g5427':'G54.27-phase34c-c1-lessons-6-10-content-speaking-expansion' in module,
 'phase34c_snapshot':"phase:'34C'" in module,
 'c1_all_expanded':'var C1_PHASE34B_EXPANDED_IDS=C1_LESSON_BLUEPRINTS.map' in module,
 'lesson_6_content':'c1-social-debate' in module,
 'lesson_10_content':'c1-presentation-rhetoric' in module,
 'total_430':'total===430' in module,
 'speaking_80':'speaking===80' in module,
 'app_config_g5427':'G54.27' in (root/'js/core/app-config.js').read_text(encoding='utf-8'),
 'service_worker_cache':'egt-trainer-g54-27' in (root/'service-worker.js').read_text(encoding='utf-8'),
 'manifest_version':'"version": "G54.27"' in (root/'manifest.json').read_text(encoding='utf-8'),
 'update_check':'G54.27' in (root/'update-check.json').read_text(encoding='utf-8'),
 'test_file':(root/'tests_phase34c_c1_lessons_6_10_content_speaking_expansion.html').exists(),
 'docs_file':(root/'docs_PHASE34C_C1_LESSONS_6_10_CONTENT_SPEAKING_EXPANSION.md').exists(),
}
result={'pass':all(checks.values()),'checks':checks}
(root/'phase34c_static_integrity_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
if not result['pass']:
 print(json.dumps(result,indent=2,ensure_ascii=False)); raise SystemExit(1)
print('PASS phase34C static integrity')
