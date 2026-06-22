import json, re, pathlib, sys
root = pathlib.Path(__file__).resolve().parent
shell = (root/'js/modules/language-exam-shell.js').read_text(encoding='utf-8')
css = (root/'css/language-course.css').read_text(encoding='utf-8')
update = json.loads((root/'update-check.json').read_text(encoding='utf-8'))
sw = (root/'service-worker.js').read_text(encoding='utf-8')
checks = {
  'phase_marker': "phase:'38E.3'" in shell,
  'version_marker': 'G54.38E.3-training-mode-from-weakness-profile' in shell,
  'training_start_function': 'function startTraining(level, part)' in shell,
  'training_banner_function': 'function trainingModeBanner(session)' in shell,
  'training_finish_function': 'function finishTraining()' in shell,
  'training_action_handler': "language-exam-training-start" in shell and "language-exam-training-finish" in shell,
  'weakness_buttons': 'data-la-training-part' in shell and 'Training starten' in shell,
  'training_exports': 'startTraining:startTraining' in shell and 'trainingModeBanner:trainingModeBanner' in shell,
  'training_css': '.la-training-mode-banner' in css and '.la-training-target-grid' in css,
  'update_phase': update.get('phase') == '38E.3',
  'sw_cache': 'egt-g54-38e3' in sw,
  'docs_present': (root/'docs_PHASE38E3_TRAINING_MODE.md').exists(),
  'test_present': (root/'tests_phase38e3_training_mode.html').exists(),
}
# basic service worker asset check
assets = re.findall(r"['\"](\./[^'\"]+)['\"]", sw)
missing = []
for a in assets:
  p = root / a[2:]
  if not p.exists():
    missing.append(a)
checks['service_worker_assets_exist'] = not missing
result = {'ok': all(checks.values()), 'checks': checks, 'missing_assets': missing}
(root/'phase38e3_static_qa_result.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(result, ensure_ascii=False, indent=2))
sys.exit(0 if result['ok'] else 1)
