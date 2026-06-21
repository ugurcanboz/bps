import json, re, pathlib, sys
base=pathlib.Path(__file__).resolve().parent
errors=[]
js=(base/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
required=['G54.22-phase33b-b2-lessons-1-5-content-speaking-expansion','B2_PHASE33B_EXPANDED_IDS','B2_PHASE33B_CONTENT','function createB2ExpandedTasks','function ensurePhase33BContentExpansion','function b2ContentSnapshot','b2ContentSnapshot:b2ContentSnapshot']
for token in required:
    if token not in js: errors.append(f'missing token: {token}')
for rel in ['index.html','manifest.json','service-worker.js','update-check.json','START_HERE.md','WORKING-PLAN_1.md','tests_phase33b_b2_lessons_1_5_content_speaking_expansion.html','docs_PHASE33B_B2_LESSONS_1_5_CONTENT_SPEAKING_EXPANSION.md']:
    if not (base/rel).exists(): errors.append(f'missing file: {rel}')
uc=json.loads((base/'update-check.json').read_text(encoding='utf-8'))
if 'G54.22' not in uc.get('version',''): errors.append('update-check version not G54.22')
if 'g54-22' not in (base/'service-worker.js').read_text(encoding='utf-8'): errors.append('service worker cache not G54.22')
res={'pass':not errors,'errors':errors,'checked':'phase33B static integrity'}
(base/'phase33b_static_integrity_result.json').write_text(json.dumps(res,indent=2,ensure_ascii=False),encoding='utf-8')
if errors:
    print(json.dumps(res,indent=2,ensure_ascii=False)); sys.exit(1)
print('PASS phase33B static integrity')
