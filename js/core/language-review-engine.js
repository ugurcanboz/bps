/* Eignungstest-Trainer · G54.46.7 Language Review Engine
   Einheitliche Review-Policy für Deutsch und Englisch.
   Neue, nie bearbeitete Aufgaben sind KEIN Review. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EGTLanguageReviewEngine = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = 'G54.46.7-LANGUAGE-REVIEW';
  var SCHEMA = 'egt-language-review-v1';
  var DAY_MS = 86400000;
  var INTERVALS = [1, 3, 7, 14, 30, 60];

  function finiteNumber(value, fallback) {
    var n = Number(value);
    return isFinite(n) ? n : Number(fallback || 0);
  }
  function iso(value, fallback) {
    var t = Date.parse(value || '');
    if (isFinite(t)) return new Date(t).toISOString();
    return fallback || '';
  }
  function nowIso(value) {
    return iso(value, new Date().toISOString());
  }
  function bool(value) { return value === true; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, finiteNumber(value, min))); }
  function hasInteraction(raw) {
    raw = raw || {};
    return finiteNumber(raw.attempts, 0) > 0 || !!raw.firstAnsweredAt || !!raw.lastAnsweredAt || !!raw.updatedAt || raw.correct === true || raw.correct === false;
  }
  function stateAlias(value) {
    value = String(value || '').toLowerCase();
    if (/wrong|repeat|error|falsch/.test(value)) return 'wrong';
    if (/manual|marked|markiert/.test(value)) return 'manual';
    if (/paused|pause/.test(value)) return 'paused';
    if (/mastered|secure|beherrscht/.test(value)) return 'mastered';
    if (/due|fällig/.test(value)) return 'due';
    if (/learned|ok|correct|gelernt/.test(value)) return 'learned';
    if (/new|neu/.test(value)) return 'new';
    return '';
  }
  function normalize(raw, options) {
    raw = raw && typeof raw === 'object' ? raw : {};
    options = options || {};
    var currentCorrect = options.currentCorrect;
    if (currentCorrect !== true && currentCorrect !== false && (raw.currentCorrect === true || raw.currentCorrect === false)) currentCorrect = raw.currentCorrect;
    if (currentCorrect !== true && currentCorrect !== false && (raw.correct === true || raw.correct === false)) currentCorrect = raw.correct;
    var attempts = Math.max(0, Math.round(finiteNumber(raw.attempts, hasInteraction(raw) ? 1 : 0)));
    var wrongCount = Math.max(0, Math.round(finiteNumber(raw.wrongCount, currentCorrect === false ? 1 : 0)));
    var correctCount = Math.max(0, Math.round(finiteNumber(raw.correctCount, currentCorrect === true ? 1 : 0)));
    var manual = bool(options.manualReview) || bool(raw.manualReview) || stateAlias(raw.reviewState || raw.status) === 'manual';
    var paused = bool(options.paused) || bool(raw.paused) || stateAlias(raw.reviewState || raw.status) === 'paused';
    var dueAt = iso(raw.reviewDueAt || raw.dueAt || raw.nextReviewAt || '', '');
    var firstAnsweredAt = iso(raw.firstAnsweredAt || '', '');
    var updatedAt = iso(raw.updatedAt || raw.lastAnsweredAt || '', '');
    var lastWrongAt = iso(raw.lastWrongAt || '', '');
    var status = stateAlias(raw.reviewState || raw.status);
    if (!status) {
      if (paused) status = 'paused';
      else if (manual) status = 'manual';
      else if (!hasInteraction(raw) && attempts === 0) status = 'new';
      else if (currentCorrect === false || wrongCount > correctCount && wrongCount > 0) status = 'wrong';
      else if (raw.masteredAt) status = 'mastered';
      else status = 'learned';
    }
    return {
      schema: SCHEMA,
      reviewState: status,
      attempts: attempts,
      wrongCount: wrongCount,
      correctCount: correctCount,
      correctStreak: Math.max(0, Math.round(finiteNumber(raw.correctStreak, currentCorrect === true ? 1 : 0))),
      reviewIntervalDays: Math.max(0, finiteNumber(raw.reviewIntervalDays, 0)),
      reviewDueAt: dueAt,
      manualReview: manual,
      paused: paused,
      firstAnsweredAt: firstAnsweredAt,
      lastAnsweredAt: updatedAt,
      lastWrongAt: lastWrongAt,
      resolvedAt: iso(raw.resolvedAt || '', ''),
      masteredAt: iso(raw.masteredAt || '', ''),
      currentCorrect: currentCorrect,
      source: String(raw.source || options.source || 'language-course')
    };
  }
  function classify(raw, options) {
    options = options || {};
    var now = Date.parse(nowIso(options.now));
    var n = normalize(raw, options);
    var interacted = n.attempts > 0 || !!n.firstAnsweredAt || n.currentCorrect === true || n.currentCorrect === false;
    var dueTime = Date.parse(n.reviewDueAt || '');
    var reachedDue = isFinite(dueTime) && dueTime <= now;
    var state = n.reviewState;
    var due = false;
    var eligible = false;
    var reason = 'new';

    if (n.paused || state === 'paused') {
      state = 'paused'; reason = 'paused';
    } else if (n.manualReview || state === 'manual') {
      state = 'manual'; due = true; eligible = true; reason = 'manual';
    } else if (!interacted) {
      state = 'new'; reason = 'never-answered';
    } else if (n.currentCorrect === false || state === 'wrong') {
      state = 'wrong'; due = true; eligible = true; reason = 'wrong-answer';
    } else if (reachedDue) {
      state = 'due'; due = true; eligible = true; reason = 'due-date-reached';
    } else if (state === 'mastered') {
      state = 'mastered'; reason = 'mastered';
    } else {
      state = 'learned'; reason = n.reviewDueAt ? 'scheduled-for-later' : 'answered-no-current-review';
    }

    return Object.assign({}, n, {
      state: state,
      due: due,
      eligible: eligible,
      interacted: interacted,
      reason: reason,
      reachedDue: reachedDue,
      scheduled: interacted && !due && !!n.reviewDueAt,
      daysUntilDue: isFinite(dueTime) ? Math.ceil((dueTime - now) / DAY_MS) : null
    });
  }
  function intervalFor(correctStreak, hadReviewProblem) {
    var index = Math.max(0, Math.min(INTERVALS.length - 1, Math.round(finiteNumber(correctStreak, 1)) - 1));
    if (!hadReviewProblem && index === 0) return 3;
    return INTERVALS[index];
  }
  function update(raw, outcome, options) {
    options = options || {};
    var now = nowIso(options.now);
    var before = normalize(raw, options);
    var result = Object.assign({}, before);
    outcome = String(outcome || '').toLowerCase();

    if (outcome === 'manual') {
      result.manualReview = true;
      result.paused = false;
      result.reviewState = 'manual';
      result.reviewDueAt = now;
      result.resolvedAt = '';
      return result;
    }
    if (outcome === 'unmark') {
      result.manualReview = false;
      if (result.currentCorrect === false || result.wrongCount > result.correctCount) {
        result.reviewState = 'wrong'; result.reviewDueAt = result.reviewDueAt || now;
      } else {
        result.reviewState = result.attempts > 0 ? 'learned' : 'new';
        if (result.attempts === 0) result.reviewDueAt = '';
      }
      return result;
    }
    if (outcome === 'pause') {
      result.paused = true; result.reviewState = 'paused'; return result;
    }
    if (outcome === 'resume') {
      result.paused = false;
      result.reviewState = result.manualReview ? 'manual' : (result.currentCorrect === false ? 'wrong' : (result.attempts ? 'learned' : 'new'));
      return result;
    }

    var correct = outcome === 'correct' || outcome === 'practiced' || options.correct === true;
    var wrong = outcome === 'wrong' || options.correct === false;
    if (!correct && !wrong) return result;

    var hadReviewProblem = before.manualReview || before.reviewState === 'wrong' || before.reviewState === 'manual' || before.wrongCount > 0 || classify(before, { now: now }).due;
    result.attempts = before.attempts + 1;
    result.firstAnsweredAt = before.firstAnsweredAt || now;
    result.lastAnsweredAt = now;
    result.paused = false;

    if (wrong) {
      result.currentCorrect = false;
      result.wrongCount = before.wrongCount + 1;
      result.correctStreak = 0;
      result.reviewState = 'wrong';
      result.reviewDueAt = now;
      result.reviewIntervalDays = 0;
      result.lastWrongAt = now;
      result.resolvedAt = '';
      result.masteredAt = '';
      return result;
    }

    result.currentCorrect = true;
    result.correctCount = before.correctCount + 1;
    result.correctStreak = before.currentCorrect === true ? before.correctStreak + 1 : 1;
    result.manualReview = false;
    var interval = intervalFor(result.correctStreak, hadReviewProblem);
    result.reviewIntervalDays = interval;
    result.reviewDueAt = new Date(Date.parse(now) + interval * DAY_MS).toISOString();
    result.reviewState = result.correctStreak >= 5 ? 'mastered' : 'learned';
    result.resolvedAt = now;
    if (result.reviewState === 'mastered') result.masteredAt = now;
    return result;
  }
  function stats(records, options) {
    records = Array.isArray(records) ? records : [];
    var out = { total: 0, due: 0, wrong: 0, manual: 0, scheduled: 0, learned: 0, mastered: 0, paused: 0, new: 0, interacted: 0, byState: {} };
    records.forEach(function (raw) {
      var c = classify(raw, options);
      out.byState[c.state] = (out.byState[c.state] || 0) + 1;
      if (c.interacted) out.interacted++;
      if (c.due) out.due++;
      if (c.eligible) out.total++;
      if (c.state === 'wrong') out.wrong++;
      else if (c.state === 'manual') out.manual++;
      else if (c.state === 'paused') out.paused++;
      else if (c.state === 'mastered') out.mastered++;
      else if (c.state === 'learned') out.learned++;
      else if (c.state === 'new') out.new++;
      if (c.scheduled) out.scheduled++;
    });
    out.open = out.due;
    return out;
  }

  return Object.freeze({
    version: VERSION,
    schema: SCHEMA,
    normalize: normalize,
    classify: classify,
    update: update,
    stats: stats,
    intervalFor: intervalFor,
    hasInteraction: hasInteraction
  });
});
