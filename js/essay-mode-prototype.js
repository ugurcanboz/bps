/*
  Eignungstest-Trainer – Essay Mode Prototype
  Version: 0.2.0-stable-prototype
  Hinweis: Keine echte KI-Grammatikprüfung. Liefert lokale Basisprüfung für Länge, Großschreibung, Satzzeichen und einfache Muster.
*/
(function () {
  'use strict';

  const prompts = [
    {
      id: 'essay-social-kita-conflict',
      branch: 'sozial',
      title: 'Bildimpuls: Konflikt im Kita-Alltag',
      visualCards: ['Kind weint', 'Spielzeug liegt am Boden', 'Erzieherin kniet daneben', 'zweites Kind schaut weg'],
      task: 'Schreibe einen kurzen Text. Beschreibe zuerst, was du beobachtest. Erkläre danach, wie du pädagogisch handeln würdest.'
    },
    {
      id: 'essay-kauf-customer-office',
      branch: 'kaufmaennisch',
      title: 'Bildimpuls: Kundensituation im Büro',
      visualCards: ['Kunde wartet', 'Telefon klingelt', 'Terminkalender offen', 'Mitarbeiterin am Laptop'],
      task: 'Schreibe einen kurzen Text. Beschreibe die Situation und erkläre, welche Aufgaben du zuerst erledigen würdest.'
    },
    {
      id: 'essay-it-support-incident',
      branch: 'it',
      title: 'Bildimpuls: IT-Störung',
      visualCards: ['PC zeigt Fehlermeldung', 'Netzwerkkabel', 'Nutzer wartet', 'Router blinkt'],
      task: 'Schreibe einen kurzen Text. Beschreibe das Problem und erkläre, wie du Schritt für Schritt vorgehen würdest.'
    }
  ];

  function getRandomPrompt(branch = 'mixed') {
    const pool = branch === 'mixed' ? prompts : prompts.filter(p => p.branch === branch);
    return (pool.length ? pool : prompts)[Math.floor(Math.random() * (pool.length ? pool.length : prompts.length))];
  }

  function analyzeEssay(text) {
    const value = String(text || '').trim();
    const words = value ? value.split(/\s+/).filter(Boolean) : [];
    const sentences = value ? value.split(/[.!?]+/).map(s => s.trim()).filter(Boolean) : [];
    const issues = [];

    if (words.length < 45) issues.push('Der Text ist sehr kurz. Versuche mindestens 45–80 Wörter zu schreiben.');
    if (!/[.!?]$/.test(value)) issues.push('Der letzte Satz sollte mit Punkt, Fragezeichen oder Ausrufezeichen enden.');
    if (/\b(ich|wir|der|die|das|ein|eine)\s+\1\b/i.test(value)) issues.push('Es gibt möglicherweise ein doppeltes Wort. Lies den Text noch einmal langsam.');
    if (sentences.some(s => s.length > 150)) issues.push('Ein Satz wirkt sehr lang. Teile lange Sätze lieber in zwei kurze Sätze.');
    if (/\bweil\b/i.test(value) && !/,\s*weil\b/i.test(value)) issues.push('Bei „weil“ steht meistens ein Komma vor „weil“.');
    if (/\bdass\b/i.test(value) && !/,\s*dass\b/i.test(value)) issues.push('Bei „dass“ steht meistens ein Komma vor „dass“.');
    if (value && /^[a-zäöü]/.test(value)) issues.push('Der Text sollte mit einem Großbuchstaben beginnen.');

    const score = Math.max(0, 100 - issues.length * 12 + Math.min(15, Math.floor(words.length / 10)));
    return {
      words: words.length,
      sentences: sentences.length,
      averageSentenceLength: sentences.length ? Math.round(words.length / sentences.length) : 0,
      issues,
      score: Math.min(100, score),
      feedback: issues.length ? 'Guter Anfang. Überarbeite die markierten Punkte.' : 'Sehr sauberer erster Eindruck. Struktur und Grundform wirken gut.'
    };
  }

  window.EGTEssayModePrototype = {
    prompts,
    getRandomPrompt,
    analyzeEssay
  };
})();
