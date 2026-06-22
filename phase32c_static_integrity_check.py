import json, re, pathlib
root=pathlib.Path(__file__).parent
errors=[]
for rel in ['index.html','service-worker.js','manifest.json','update-check.json','js/modules/language-course-entry-module.js','js/core/app-config.js']:
    if not (root/rel).exists(): errors.append(f'missing {rel}')
js=(root/'js/modules/language-course-entry-module.js').read_text(encoding='utf-8')
required=['G54.19-phase32c','b1ContentSnapshot','phase:\'32C\'','total===430','speaking===80','b1-education-plans','b1-future-goals']
for r in required:
    if r not in js: errors.append(f'missing marker {r}')
ids=re.findall(r"id:([a-zA-Z0-9_+'\-]+)", js)
# lightweight only; task duplication is checked by snapshot in runtime
result={'pass':not errors,'errors':errors,'checkedFiles':6,'markers':required}
(root/'phase32c_static_integrity_result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
if errors:
    raise SystemExit('\n'.join(errors))
print('PASS static integrity')
