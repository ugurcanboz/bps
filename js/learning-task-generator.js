/* Eignungstest-Trainer · Lernaufgaben-Generator */
(function () {
  'use strict';

  function generateMathTask(options = {}) {
    const templates = window.EGT_LEARNING_MATH_TASK_TEMPLATES || [];
    const difficulty = options.difficulty || 'mixed';
    const topic = options.topic || 'mixed';

    let pool = templates.slice();
    if (difficulty !== 'mixed') pool = pool.filter(t => t.difficulty === difficulty);
    if (topic !== 'mixed') pool = pool.filter(t => t.topic === topic);
    if (!pool.length) pool = templates.slice();
    if (!pool.length) throw new Error('Keine Mathe-Lernaufgaben verfügbar.');

    const template = pool[Math.floor(Math.random() * pool.length)];
    return normalizeTask(template.generate());
  }

  function normalizeTask(task) {
    return {
      ...task,
      createdAt: new Date().toISOString(),
      help: {
        hint: task.hint || 'Lies die Aufgabe langsam und markiere die wichtigen Zahlen.',
        trick: task.trick || 'Überlege zuerst, was überhaupt gesucht ist.',
        steps: task.steps || [],
        explanation: task.explanation || '',
        checks: task.checks || []
      }
    };
  }

  function validateAnswer(task, rawAnswer) {
    const value = String(rawAnswer || '').trim().replace(',', '.');
    if (!value) return { isCorrect: false, normalized: '', message: 'Bitte gib eine Antwort ein.' };

    if (task.answerType === 'number') {
      const parsed = parseLocalizedNumber(value);
      const expected = Number(task.correctAnswer);
      const tolerance = Number(task.acceptedTolerance || 0);
      const isCorrect = Number.isFinite(parsed) && Math.abs(parsed - expected) <= tolerance;
      return {
        isCorrect,
        normalized: parsed,
        message: isCorrect ? 'Richtig.' : `Nicht ganz. Erwartet: ${task.correctAnswer}${task.unit ? ' ' + task.unit : ''}.`
      };
    }

    if (task.answerType === 'fraction') {
      const normalized = value.replace(/\s/g, '');
      const isCorrect = fractionEquals(normalized, String(task.correctAnswer).replace(/\s/g, ''));
      return {
        isCorrect,
        normalized,
        message: isCorrect ? 'Richtig.' : `Nicht ganz. Erwartet: ${task.correctAnswer}.`
      };
    }

    if (task.answerType === 'text') {
      const normalized = normalizeTextAnswer(value);
      const expected = normalizeTextAnswer(task.correctAnswer);
      return {
        isCorrect: normalized === expected,
        normalized: rawAnswer,
        message: normalized === expected ? 'Richtig.' : `Nicht ganz. Erwartet: ${task.correctAnswer}.`
      };
    }

    return { isCorrect: false, normalized: rawAnswer, message: 'Antworttyp noch nicht unterstützt.' };
  }


  function parseLocalizedNumber(value) {
    const cleaned = String(value || '')
      .replace(',', '.')
      .replace(/[^0-9.\-]/g, '');
    return Number(cleaned);
  }

  function normalizeTextAnswer(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/uhr/g, '')
      .replace(/\s/g, '')
      .replace(',', '.')
      .trim();
  }

  function fractionEquals(a, b) {
    if (a === b) return true;
    const parse = (value) => {
      const parts = String(value).split('/').map(Number);
      if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1]) || parts[1] === 0) return null;
      return parts;
    };
    const fa = parse(a);
    const fb = parse(b);
    if (!fa || !fb) return false;
    return fa[0] * fb[1] === fb[0] * fa[1];
  }

  window.EGTLearningTaskGenerator = {
    generateMathTask,
    validateAnswer
  };
})();
