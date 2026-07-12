/* Eignungstest-Trainer · G52.6 Phase 20
   Question Flow Engine / Quiz-Lifecycle-Grenze
   Ziel: Fragen-Navigation, Antwortsteuerung und Question-Control zentralisieren,
   während das visuelle Legacy-Rendering in app.js vorerst als sicherer Adapter bleibt. */
(function(){
  "use strict";
  if(window.EGTQuestionFlowEngine && window.EGTQuestionFlowEngine.__ready) return;

  const VERSION = "G52.6-phase20";

  function safeObj(value){ return value && typeof value === "object" ? value : {}; }
  function call(fn, args, fallback, label){
    try { if(typeof fn === "function") return fn.apply(null, args || []); }
    catch(e){ try { console.warn(label || "QuestionFlow call failed", e); } catch(ignore){} }
    return typeof fallback === "function" ? fallback() : fallback;
  }

  function create(deps){
    deps = safeObj(deps);
    const state = safeObj(deps.state);
    const $ = typeof deps.$ === "function" ? deps.$ : function(id){ return (typeof document !== "undefined") ? document.getElementById(id) : null; };

    function diagnostics(){
      return {
        ok:true,
        provider:"js/core/question-flow-engine.js",
        version:VERSION,
        hasState:!!state,
        mode:state.selectedMode || null,
        current:Number.isFinite(Number(state.current)) ? Number(state.current) : 0,
        total:Array.isArray(state.quiz) ? state.quiz.length : 0,
        answered:Array.isArray(state.history) ? state.history.filter(Boolean).length : 0,
        timerActive:!!state.timer
      };
    }

    function clearTimer(){ try { clearInterval(state.timer); } catch(e) {} }
    function clearAllQuestionTimers(){
      clearTimer();
      call(deps.clearRouteTimers, [], null, "QuestionFlow route timer clear fallback");
    }

    function showQuestion(spIntro){
      return call(deps.showQuestionInternal, [!!spIntro], null, "QuestionFlow showQuestion fallback");
    }

    function tickTimer(){
      return call(deps.tickTimerInternal, [], null, "QuestionFlow tickTimer fallback");
    }

    function pauseTimer(){
      clearTimer();
      return {ok:true, version:VERSION, action:"pauseTimer"};
    }

    function resumeTimer(){
      clearTimer();
      state.timer = setInterval(function(){ tickTimer(); }, 1000);
      return {ok:true, version:VERSION, action:"resumeTimer"};
    }

    function nextQuestion(){
      return call(deps.nextQuestionInternal, [], null, "QuestionFlow nextQuestion fallback");
    }

    function prevQuestion(){
      return call(deps.prevQuestionInternal, [], null, "QuestionFlow prevQuestion fallback");
    }

    function jumpToQuestion(index){
      index = Number(index);
      if(!Number.isFinite(index)) return false;
      return call(deps.jumpToQuestionInternal, [index], false, "QuestionFlow jumpToQuestion fallback");
    }

    function skipQuestion(){
      return call(deps.skipQuestionInternal, [], null, "QuestionFlow skipQuestion fallback");
    }

    function spQuestion(){
      return call(deps.spQuestionInternal, [], null, "QuestionFlow spQuestion fallback");
    }

    function manualNextQuestion(){
      return call(deps.manualNextQuestionInternal, [], null, "QuestionFlow manualNextQuestion fallback");
    }

    function chooseAnswer(index, button){
      index = Number(index);
      if(!Number.isFinite(index)) return false;
      return call(deps.chooseAnswerInternal, [index, button], false, "QuestionFlow chooseAnswer fallback");
    }

    function recordAnswer(given, correct, timeout){
      return call(deps.recordAnswerInternal, [given, !!correct, !!timeout], null, "QuestionFlow recordAnswer fallback");
    }

    function toggleMarkQuestion(){
      return call(deps.toggleMarkQuestionInternal, [], null, "QuestionFlow toggleMark fallback");
    }

    function updateQuestionNav(){
      return call(deps.updateQuestionNavInternal, [], null, "QuestionFlow updateQuestionNav fallback");
    }

    function nextBlockIndex(from){
      return call(deps.nextBlockIndexInternal, [Number(from)||0], Array.isArray(state.quiz) ? state.quiz.length : 0, "QuestionFlow nextBlockIndex fallback");
    }

    function stopQuestionFlow(reason){
      clearAllQuestionTimers();
      return {ok:true, version:VERSION, action:"stop", reason:reason || "manual"};
    }

    function snapshot(){
      return {
        version:VERSION,
        mode:state.selectedMode || null,
        current:Number(state.current)||0,
        total:Array.isArray(state.quiz) ? state.quiz.length : 0,
        score:Number(state.score)||0,
        answered:Array.isArray(state.history) ? state.history.filter(Boolean).length : 0,
        marked:Array.isArray(state.markedQuestions) ? state.markedQuestions.filter(Boolean).length : 0,
        timeLeft:Number(state.timeLeft)||0
      };
    }

    return Object.freeze({
      __version:VERSION,
      diagnostics,
      snapshot,
      stopQuestionFlow,
      showQuestion,
      tickTimer,
      pauseTimer,
      resumeTimer,
      nextQuestion,
      prevQuestion,
      jumpToQuestion,
      skipQuestion,
      spQuestion,
      manualNextQuestion,
      chooseAnswer,
      recordAnswer,
      toggleMarkQuestion,
      updateQuestionNav,
      nextBlockIndex
    });
  }

  window.EGTQuestionFlowEngine = Object.freeze({__ready:true, __version:VERSION, create:create});
})();
