from pathlib import Path
import json, re, sys
root = Path(__file__).resolve().parent
shell = (root/'js/modules/language-exam-shell.js').read_text(encoding='utf-8')
css = (root/'css/language-course.css').read_text(encoding='utf-8')
sw = (root/'service-worker.js').read_text(encoding='utf-8')
update = json.loads((root/'update-check.json').read_text(encoding='utf-8'))
checks = {
    'phase_38e4_in_shell': "phase:'38E.4'" in shell,
    'mini_function_present': 'function miniTrainingSetFor' in shell and 'function miniTrainingSetHtml' in shell,
    'mini_export_present': 'miniTrainingSetFor:miniTrainingSetFor' in shell and 'miniTrainingSetHtml:miniTrainingSetHtml' in shell,
    'all_parts_have_sets': all(f'{p}:[' in shell for p in ['reading','listening','grammar','writing','speaking']),
    'training_focus_contains_miniset': 'miniSet:miniTrainingSetFor' in shell,
    'banner_renders_miniset': '+miniTrainingSetHtml(session)+' in shell,
    'css_present': '.la-mini-training-set' in css and '.la-mini-training-task' in css,
    'sw_cache_38e4': "egt-g54-38e4" in sw,
    'sw_assets_include_test': 'tests_phase38e4_mini_training_sets.html' in sw,
    'update_phase': update.get('phase') == '38E.4',
    'docs_present': (root/'docs_PHASE38E4_MINI_TRAINING_SETS.md').exists(),
    'test_present': (root/'tests_phase38e4_mini_training_sets.html').exists(),
}
result = {'ok': all(checks.values()), 'checks': checks, 'phase': '38E.4'}
(root/'phase38e4_static_qa_result.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
if not result['ok']:
    print(json.dumps(result, ensure_ascii=False, indent=2))
    sys.exit(1)
print(json.dumps(result, ensure_ascii=False, indent=2))
