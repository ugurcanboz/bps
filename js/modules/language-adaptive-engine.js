/* Language Academy · Phase 25
   Adaptive Lernengine: Schwierigkeit, Wiederholungsbedarf, Lernpfad-Empfehlung und Coach-Context.
   Scope: nur Sprachkurs-Modul. Keine CTC/Admin/Highscore-Veränderung. */
(function(){
  'use strict';
  var VERSION='G54.7-phase25-adaptive-learning-engine';
  var STORAGE_KEY='language_academy_adaptive_state_v1';
  var BANDS=[
    {id:'support',label:'Unterstützung',min:0,max:59,desc:'Mehr Wiederholung, kleinere Schritte, klare Hinweise.'},
    {id:'standard',label:'Standard',min:60,max:84,desc:'Normale Aufgabenfolge mit gezielter Wiederholung.'},
    {id:'challenge',label:'Herausforderung',min:85,max:100,desc:'Teilnehmer ist sicher genug für schwierigere Aufgaben.'}
  ];
  function clamp(n,min,max){n=Number(n||0); return Math.max(min,Math.min(max,n));}
  function read(){try{var raw=localStorage.getItem(STORAGE_KEY); return raw?JSON.parse(raw):{};}catch(e){return {};}}
  function write(next){try{var merged=Object.assign({},read(),next||{},{schema:'language-adaptive-v1',version:VERSION,updatedAt:new Date().toISOString()}); localStorage.setItem(STORAGE_KEY,JSON.stringify(merged)); return merged;}catch(e){return next||{};}}
  function accuracyFromState(st){var attempts=Number(st&&st.attempts||0), score=Number(st&&st.score||0); return attempts?Math.round((score/attempts)*100):0;}
  function bandForAccuracy(acc){acc=clamp(acc,0,100); for(var i=0;i<BANDS.length;i++){if(acc>=BANDS[i].min&&acc<=BANDS[i].max) return BANDS[i];} return BANDS[1];}
  function mistakeWeight(st){var wrong=(st&&Array.isArray(st.wrongTaskIds))?st.wrongTaskIds.length:0; var attempts=Number(st&&st.attempts||0); return clamp((wrong*18)+(attempts>0&&accuracyFromState(st)<60?18:0),0,100);}
  function analyzeLesson(lessonId,state,taskCount){state=state||{}; var attempts=Number(state.attempts||0), score=Number(state.score||0), total=Number(state.total||0); var acc=attempts?Math.round((score/attempts)*100):0; var wrong=(Array.isArray(state.wrongTaskIds)?state.wrongTaskIds:[]); var completion=taskCount?Math.round((Math.min(taskCount,total)/taskCount)*100):0; var band=bandForAccuracy(acc); var needsReview=wrong.length>0 || (attempts>0&&acc<70); var readiness=(completion>=100 && acc>=80 && wrong.length===0)?'ready_next':(needsReview?'review_needed':'continue'); return {lessonId:lessonId,attempts:attempts,score:score,total:total,accuracy:acc,completion:completion,wrongTaskIds:wrong,wrongOpen:wrong.length,difficultyBand:band.id,difficultyLabel:band.label,difficultyDescription:band.desc,needsReview:needsReview,readiness:readiness,mistakeWeight:mistakeWeight(state)};}
  function recommendation(analysis){analysis=analysis||{}; if(analysis.readiness==='ready_next') return {type:'next_lesson',title:'Bereit für die nächste Lektion',text:'Die Trefferquote ist stabil. Die nächste Lektion kann geöffnet werden.',priority:1}; if(analysis.needsReview) return {type:'review',title:'Wiederholung empfohlen',text:'Bearbeite zuerst die markierten Fehler, bevor du weitergehst.',priority:2}; if((analysis.completion||0)<100) return {type:'continue',title:'Weiterlernen',text:'Die aktuelle Lektion ist noch nicht abgeschlossen.',priority:3}; return {type:'practice',title:'Kurz üben',text:'Eine kurze Wiederholung stabilisiert den Lernstand.',priority:4};}
  function nextDifficulty(analysis){var b=(analysis&&analysis.difficultyBand)||'standard'; if(b==='challenge') return {level:'plus',label:'Etwas schwerer',rule:'mehr Ablenkoptionen / weniger Hinweistext'}; if(b==='support') return {level:'guided',label:'Geführt',rule:'mehr Erklärung / kleinere Schritte'}; return {level:'normal',label:'Normal',rule:'regulärer Aufgabenfluss'};}
  function buildCoachContext(payload){payload=payload||{}; var a=analyzeLesson(payload.lessonId,payload.state,payload.taskCount); return {phase:'25',analysis:a,recommendation:recommendation(a),nextDifficulty:nextDifficulty(a),safeRules:['Hilfe erklärt ohne Lösung','Fehler werden zum Wiederholen markiert','Fortschritt bleibt sprachkursintern']};}
  function recordAnswer(payload){payload=payload||{}; var lessonId=payload.lessonId||'unknown'; var map=Object.assign({},read().lessonInsights||{}); map[lessonId]=Object.assign({},map[lessonId]||{}, buildCoachContext(payload), {lastAnswer:{taskId:payload.taskId||null,correct:!!payload.correct,answeredAt:new Date().toISOString()}}); return write({lessonInsights:map,lastLessonId:lessonId});}
  window.LanguageAcademyAdaptiveEngine=Object.freeze({__version:VERSION,read:read,write:write,analyzeLesson:analyzeLesson,recommendation:recommendation,nextDifficulty:nextDifficulty,buildCoachContext:buildCoachContext,recordAnswer:recordAnswer,diagnostics:function(){return {ok:true,phase:'25',version:VERSION,hasStorage:true,bands:BANDS.map(function(b){return b.id;})};}});
})();
