import json, pathlib, re
root=pathlib.Path(__file__).resolve().parent
module=(root/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
checks={
 'version_g5425':'G54.25-phase34a-c1-course-speaking-structure' in module,
 'c1_blueprints':'C1_LESSON_BLUEPRINTS' in module,
 'c1_ensure':'ensurePhase34AC1Structure' in module,
 'c1_snapshot_export':'c1StructureSnapshot:c1StructureSnapshot' in module,
 'phase34a_markers':module.count("phase:'34A'")>=6,
 'parallel_content':'parallelContent:true,c1Starter:true' in module,
 'speaking_practice':module.count("type:'speaking_practice'")>=1,
 'app_config_g5425':"G54.25" in (root/'js/core/app-config.js').read_text(encoding='utf-8'),
 'service_worker_cache':'egt-trainer-g54-25' in (root/'service-worker.js').read_text(encoding='utf-8'),
 'manifest_version':'"version": "G54.25"' in (root/'manifest.json').read_text(encoding='utf-8'),
 'update_check':'G54.25' in (root/'update-check.json').read_text(encoding='utf-8')
}
result={'pass':all(checks.values()),'checks':checks}
(root/'phase34a_static_integrity_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
if not result['pass']:
    print(json.dumps(result,indent=2,ensure_ascii=False)); raise SystemExit(1)
print('PASS phase34A static integrity')
