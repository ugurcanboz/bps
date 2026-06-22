import json
from pathlib import Path
root = Path(__file__).resolve().parent
shell = (root/'js/modules/language-exam-shell.js').read_text(encoding='utf-8')
css = (root/'css/language-course.css').read_text(encoding='utf-8')
update = json.loads((root/'update-check.json').read_text(encoding='utf-8'))
checks = {
  'phase_38e5': "phase:'38E.5'" in shell and update.get('phase') == '38E.5',
  'evaluateMiniTraining': 'function evaluateMiniTraining' in shell,
  'progress_key': 'language-academy-mini-training-progress-v1' in shell,
  'loadTrainingProgress_export': 'loadTrainingProgress:loadTrainingProgress' in shell,
  'trainingProgressSummaryHtml': 'trainingProgressSummaryHtml' in shell,
  'mini_answer_fields': 'data-la-mini-answer' in shell,
  'mini_check_fields': 'data-la-mini-check' in shell,
  'mini_evaluate_action': 'language-exam-mini-evaluate' in shell,
  'mini_reset_action': 'language-exam-mini-reset' in shell,
  'persist_on_finish': 'persistTrainingProgress(session, miniResult)' in shell,
  'dashboard_progress_summary': 'trainingProgressSummaryHtml((existing&&existing.level)||' in shell,
  'css_progress_blocks': '.la-mini-training-result' in css and '.la-training-progress-summary' in css,
}
result = {'ok': all(checks.values()), 'checks': checks}
(root/'phase38e5_static_qa_result.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(result, ensure_ascii=False, indent=2))
if not result['ok']:
    raise SystemExit(1)
