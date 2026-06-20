import json, pathlib, re
root=pathlib.Path('.')
js=(root/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
checks={
 'version':'G54.33-phase37a-placement-test-a1-c2' in js,
 'placementSnapshot':'placementTestSnapshot' in js,
 'phase37Qa':'phase37aQaSnapshot' in js,
 'route':'language-course-placement-test' in js,
 'testFile':(root/'tests_phase37a_placement_test_a1_c2.html').exists(),
 'docFile':(root/'docs_PHASE37A_PLACEMENT_TEST_A1_C2.md').exists(),
}
ok=all(checks.values())
(root/'phase37a_static_integrity_result.json').write_text(json.dumps({'ok':ok,'checks':checks},indent=2),encoding='utf-8')
print('PASS phase37A static integrity' if ok else 'FAIL phase37A static integrity', checks)
raise SystemExit(0 if ok else 1)
