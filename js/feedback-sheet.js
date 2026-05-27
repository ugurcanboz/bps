/* BPS-Trainer V9.0.2 · Feedback System Component
   Handles task-specific bug reporting and general app feedback.
   Saves technical context and sends it to a configurable Form endpoint.
   No file uploads. GitHub Pages compatible. */

(function () {
  'use strict';

  // CENTRAL CONFIGURATION FOR FORM SUBMISSIONS
  const FEEDBACK_ENDPOINT = "https://formspree.io/f/mykvbooq";
  const ACCESS_KEY = ""; // Not required for Formspree (form ID is in the URL)

  function $ (id) { return document.getElementById(id); }

  function esc (val) {
    return String(val == null ? '' : val).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c];
    });
  }

  // State to track if timer was running when we paused it
  let timerWasRunning = false;

  // Active form context
  let currentContext = null; // "bug" or "general"

  // Star rating state for general feedback
  let currentRating = 0;

  // Technical context data gathered at open time
  let gatheredMetadata = {};

  /* ── 1. TECHNICAL METADATA GATHERING ───────────────── */

  function getBrowserContext() {
    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString()
    };
  }

  function gatherBugMetadata() {
    try {
      if (!window.App || !window.App._test || !window.App._test.state) {
        return { error: "App core state not ready" };
      }
      const state = window.App._test.state;
      const q = state.quiz[state.current];
      if (!q) return { error: "No active question" };

      // Determine current branch
      const branch = localStorage.getItem('bps_branch') || 'unknown';

      // Find matching module
      let activeModule = 'unknown';
      if (window.BPSWordHubLayer && window.BPSWordHubLayer.modules) {
        const found = window.BPSWordHubLayer.modules.find(m => m.modes && m.modes.indexOf(state.selectedMode) !== -1);
        if (found) activeModule = found.label;
      }

      // Check if user has answered the question
      const historyItem = state.history[state.current];
      const givenAnswer = historyItem ? (historyItem.answers ? historyItem.answers[historyItem.givenIndex] : historyItem.givenIndex) : null;
      const correctAnswer = q.answers ? q.answers[q.correct] : q.correct;

      // Calculate elapsed time
      let elapsedSeconds = 0;
      if (state.testStart) {
        elapsedSeconds = Math.round((new Date() - state.testStart) / 1000);
      }

      return {
        appVersion: "9.0.2",
        branch: branch,
        module: activeModule,
        simulation: !!state.exam.enabled,
        questionId: q.id || 'unknown',
        questionNumber: state.current + 1,
        questionText: q.q || '',
        answers: q.answers || q.a || [],
        givenAnswer: givenAnswer !== null ? String(givenAnswer) : 'Noch nicht beantwortet',
        correctAnswer: String(correctAnswer),
        score: state.score || 0,
        timeLeft: state.timeLeft || 0,
        elapsedSeconds: elapsedSeconds,
        ...getBrowserContext()
      };
    } catch (e) {
      console.warn("Failed to gather bug metadata", e);
      return { error: e.message, ...getBrowserContext() };
    }
  }

  function gatherGeneralMetadata() {
    const branch = localStorage.getItem('bps_branch') || 'unknown';
    let currentScreen = 'Training';
    try {
      if (window.AppState) {
        currentScreen = window.AppState.get('activeTab') || 'Training';
      }
    } catch (e) {}

    return {
      appVersion: "9.0.2",
      branch: branch,
      currentScreen: currentScreen,
      ...getBrowserContext()
    };
  }

  /* ── 2. PAUSE / RESUME TIMER ───────────────────────── */

  function performPauseTimer() {
    try {
      if (window.App && typeof window.App.pauseTimer === 'function') {
        window.App.pauseTimer();
        timerWasRunning = true;
      }
    } catch (e) {
      console.warn("Could not pause timer", e);
    }
  }

  function performResumeTimer() {
    try {
      if (timerWasRunning && window.App && typeof window.App.resumeTimer === 'function') {
        window.App.resumeTimer();
      }
      timerWasRunning = false;
    } catch (e) {
      console.warn("Could not resume timer", e);
    }
  }

  /* ── 3. RENDER FEEDBACK SHEETS ────────────────────── */

  function openSheetContainer() {
    const backdrop = $('whSheetBackdrop');
    const sheet = $('whSheet');
    if (!backdrop || !sheet) return;

    backdrop.classList.add('show');
    sheet.offsetHeight; // Force reflow
    sheet.classList.add('show');

    // Make sure click on backdrop does NOT accidentally close the sheet during a bug report (to prevent losing form data)
    backdrop.onclick = function (e) {
      if (e.target === backdrop) {
        // Safe check: do not close if form contains text
        const descEl = $('fbDesc');
        if (descEl && descEl.value.trim() !== '') {
          if (confirm("Möchtest du das Feedback-Formular wirklich schließen? Deine Eingaben gehen verloren.")) {
            closeFeedbackSheet();
          }
        } else {
          closeFeedbackSheet();
        }
      }
    };
  }

  function closeFeedbackSheet() {
    const backdrop = $('whSheetBackdrop');
    const sheet = $('whSheet');
    if (backdrop) backdrop.classList.remove('show');
    if (sheet) sheet.classList.remove('show');
    currentContext = null;
    currentRating = 0;
  }

  // Opens Bug Report Form
  function openBugReportSheet() {
    currentContext = "bug";
    performPauseTimer();
    gatheredMetadata = gatherBugMetadata();

    const sheet = $('whSheet');
    if (!sheet) return;

    sheet.innerHTML = `
      <div class="wh-sheet-handle"></div>
      <div class="wh-sheet-header">
        <div class="wh-sheet-icon c-red">⚠️</div>
        <div class="wh-sheet-info">
          <div class="wh-sheet-name">Aufgaben-Bug melden</div>
          <div class="wh-sheet-kicker">Fehler in dieser Frage melden</div>
        </div>
        <button class="wh-sheet-close" id="fbCloseBtn" aria-label="Schließen">✕</button>
      </div>
      <div class="wh-sheet-sep"></div>
      <div class="wh-sheet-body">
        <form id="fbForm" class="wh-fb-form">
          <div class="wh-fb-form-row">
            <label class="wh-fb-switch-label">
              <input type="checkbox" id="fbAnonymToggle">
              <span class="wh-fb-switch-custom"></span>
              <span>Anonym melden</span>
            </label>
          </div>

          <div class="wh-fb-input-wrap" id="fbNameContainer">
            <label for="fbName">Name (optional)</label>
            <input type="text" id="fbName" class="wh-input" placeholder="Dein Name" autocomplete="name">
          </div>

          <div class="wh-fb-input-wrap" id="fbEmailContainer">
            <label for="fbEmail">Kontakt-E-Mail (optional)</label>
            <input type="email" id="fbEmail" class="wh-input" placeholder="name@beispiel.de" autocomplete="email">
          </div>

          <div class="wh-fb-input-wrap">
            <label for="fbSubject">Betreff</label>
            <input type="text" id="fbSubject" class="wh-input" readonly value="Bug in Aufgabe: ${esc(gatheredMetadata.questionId)}">
          </div>

          <div class="wh-fb-input-wrap">
            <label for="fbDesc">Problembeschreibung <span class="required">*</span> (mind. 10 Zeichen)</label>
            <textarea id="fbDesc" class="wh-input wh-textarea" required minlength="10" placeholder="Beschreibe kurz den Fehler (z.B. falsche Antwort, Tippfehler, Rechenfehler...)"></textarea>
          </div>

          <details class="wh-fb-meta-details">
            <summary>Technische Details anzeigen</summary>
            <div class="wh-fb-meta-grid">
              ${Object.keys(gatheredMetadata).map(key => {
                const val = gatheredMetadata[key];
                const displayVal = Array.isArray(val) ? `[${val.join(', ')}]` : String(val);
                return `<div class="wh-fb-meta-row"><span>${esc(key)}</span><strong>${esc(displayVal)}</strong></div>`;
              }).join('')}
            </div>
          </details>

          <p class="wh-fb-privacy-note">Deine Angaben werden zur Bearbeitung deines Feedbacks an den App-Betreiber gesendet.</p>
          
          <div id="fbErrorMsg" class="wh-fb-status-msg is-error hidden"></div>
          <div id="fbSuccessMsg" class="wh-fb-status-msg is-success hidden"></div>

          <div class="wh-fb-submit-row">
            <button type="submit" class="wh-btn-primary" id="fbSubmitBtn">Feedback senden</button>
          </div>
        </form>

        <div class="wh-sheet-sep" style="margin: 20px 0 15px 0;"></div>
        <div class="wh-fb-nav-choices">
          <button class="wh-fb-nav-btn wh-btn-resume" id="fbBtnResume"> Weiter üben</button>
          <button class="wh-fb-nav-btn wh-btn-skip" id="fbBtnSkip">Aufgabe überspringen ➔</button>
          <button class="wh-fb-nav-btn wh-btn-cancel wh-danger-btn" id="fbBtnCancel">Test abbrechen ✕</button>
        </div>
      </div>
    `;

    // Bind Anonym toggle
    const anonymToggle = $('fbAnonymToggle');
    const nameContainer = $('fbNameContainer');
    const emailContainer = $('fbEmailContainer');
    if (anonymToggle) {
      anonymToggle.addEventListener('change', function () {
        if (anonymToggle.checked) {
          nameContainer.classList.add('hidden');
          emailContainer.classList.add('hidden');
          $('fbName').value = '';
          $('fbEmail').value = '';
        } else {
          nameContainer.classList.remove('hidden');
          emailContainer.classList.remove('hidden');
        }
      });
    }

    // Bind form submission
    $('fbForm').addEventListener('submit', handleFeedbackSubmit);

    // Bind navigation/action buttons
    $('fbCloseBtn').onclick = function () {
      if (confirm("Timer wieder starten und weiter üben?")) {
        closeFeedbackSheet();
        performResumeTimer();
      } else {
        closeFeedbackSheet();
      }
    };
    $('fbBtnResume').onclick = function () {
      closeFeedbackSheet();
      performResumeTimer();
    };
    $('fbBtnSkip').onclick = function () {
      closeFeedbackSheet();
      try {
        if (window.App && typeof window.App.spQuestion === 'function') {
          window.App.spQuestion();
        } else if (window.App && typeof window.App.skipQuestion === 'function') {
          window.App.skipQuestion();
        }
      } catch (e) {
        console.warn("Skip question failed", e);
      }
    };
    $('fbBtnCancel').onclick = function () {
      if (confirm("Möchtest du den Test wirklich abbrechen?")) {
        closeFeedbackSheet();
        try {
          if (window.App && typeof window.App.endEarly === 'function') {
            window.App.endEarly();
          }
        } catch (e) {
          console.warn("End early failed", e);
        }
      }
    };

    openSheetContainer();
  }

  // Opens General Feedback Form
  function openGeneralFeedbackSheet() {
    currentContext = "general";
    currentRating = 0;
    gatheredMetadata = gatherGeneralMetadata();

    const sheet = $('whSheet');
    if (!sheet) return;

    sheet.innerHTML = `
      <div class="wh-sheet-handle"></div>
      <div class="wh-sheet-header">
        <div class="wh-sheet-icon c-indigo">💬</div>
        <div class="wh-sheet-info">
          <div class="wh-sheet-name">Feedback geben</div>
          <div class="wh-sheet-kicker">Hilf uns, den BPS-Trainer zu verbessern</div>
        </div>
        <button class="wh-sheet-close" id="fbCloseBtn" aria-label="Schließen">✕</button>
      </div>
      <div class="wh-sheet-sep"></div>
      <div class="wh-sheet-body">
        <form id="fbForm" class="wh-fb-form">
          <div class="wh-fb-form-row">
            <label class="wh-fb-switch-label">
              <input type="checkbox" id="fbAnonymToggle">
              <span class="wh-fb-switch-custom"></span>
              <span>Anonym melden</span>
            </label>
          </div>

          <div class="wh-fb-input-wrap" id="fbNameContainer">
            <label for="fbName">Name (optional)</label>
            <input type="text" id="fbName" class="wh-input" placeholder="Dein Name" autocomplete="name">
          </div>

          <div class="wh-fb-input-wrap" id="fbEmailContainer">
            <label for="fbEmail">Kontakt-E-Mail (optional)</label>
            <input type="email" id="fbEmail" class="wh-input" placeholder="name@beispiel.de" autocomplete="email">
          </div>

          <div class="wh-fb-input-wrap">
            <label for="fbType">Feedback-Art</label>
            <select id="fbType" class="wh-input wh-select">
              <option value="Lob">Lob 😊</option>
              <option value="Kritik">Kritik 😟</option>
              <option value="Verbesserungsvorschlag">Verbesserungsvorschlag 💡</option>
              <option value="Bedienungsproblem">Bedienungsproblem 📱</option>
              <option value="Inhaltlicher Wunsch">Inhaltlicher Wunsch 📚</option>
              <option value="Sonstiges">Sonstiges ⚙️</option>
            </select>
          </div>

          <div class="wh-fb-input-wrap">
            <label>Bewertung (optional)</label>
            <div class="wh-fb-stars" id="fbStarsContainer">
              <span class="wh-star" data-rating="1">★</span>
              <span class="wh-star" data-rating="2">★</span>
              <span class="wh-star" data-rating="3">★</span>
              <span class="wh-star" data-rating="4">★</span>
              <span class="wh-star" data-rating="5">★</span>
            </div>
          </div>

          <div class="wh-fb-input-wrap">
            <label for="fbDesc">Deine Nachricht <span class="required">*</span> (mind. 10 Zeichen)</label>
            <textarea id="fbDesc" class="wh-input wh-textarea" required minlength="10" placeholder="Lass uns wissen, was dir gefällt oder was wir besser machen können..."></textarea>
          </div>

          <details class="wh-fb-meta-details">
            <summary>Technische Details anzeigen</summary>
            <div class="wh-fb-meta-grid">
              ${Object.keys(gatheredMetadata).map(key => {
                const val = gatheredMetadata[key];
                return `<div class="wh-fb-meta-row"><span>${esc(key)}</span><strong>${esc(val)}</strong></div>`;
              }).join('')}
            </div>
          </details>

          <p class="wh-fb-privacy-note">Deine Angaben werden zur Bearbeitung deines Feedbacks an den App-Betreiber gesendet.</p>
          
          <div id="fbErrorMsg" class="wh-fb-status-msg is-error hidden"></div>
          <div id="fbSuccessMsg" class="wh-fb-status-msg is-success hidden"></div>

          <div class="wh-fb-submit-row" style="display: flex; gap: 12px; margin-top: 24px;">
            <button type="button" class="wh-btn-secondary" id="fbCancelBtn" style="flex: 1;">Schließen</button>
            <button type="submit" class="wh-btn-primary" id="fbSubmitBtn" style="flex: 2;">Feedback senden</button>
          </div>
        </form>
      </div>
    `;

    // Bind Anonym toggle
    const anonymToggle = $('fbAnonymToggle');
    const nameContainer = $('fbNameContainer');
    const emailContainer = $('fbEmailContainer');
    if (anonymToggle) {
      anonymToggle.addEventListener('change', function () {
        if (anonymToggle.checked) {
          nameContainer.classList.add('hidden');
          emailContainer.classList.add('hidden');
          $('fbName').value = '';
          $('fbEmail').value = '';
        } else {
          nameContainer.classList.remove('hidden');
          emailContainer.classList.remove('hidden');
        }
      });
    }

    // Bind Star rating clicks
    const stars = $('fbStarsContainer').querySelectorAll('.wh-star');
    stars.forEach(star => {
      star.addEventListener('click', function () {
        const rating = parseInt(star.getAttribute('data-rating'), 10);
        currentRating = rating;
        stars.forEach((s, idx) => {
          if (idx < rating) {
            s.classList.add('is-active');
          } else {
            s.classList.remove('is-active');
          }
        });
      });
    });

    // Bind form submission
    $('fbForm').addEventListener('submit', handleFeedbackSubmit);

    // Bind close/cancel buttons
    $('fbCloseBtn').onclick = closeFeedbackSheet;
    $('fbCancelBtn').onclick = closeFeedbackSheet;

    openSheetContainer();
  }

  /* ── 4. SUBMIT ACTION ──────────────────────────────── */

  async function handleFeedbackSubmit(event) {
    event.preventDefault();

    const descEl = $('fbDesc');
    const submitBtn = $('fbSubmitBtn');
    const errorEl = $('fbErrorMsg');
    const successEl = $('fbSuccessMsg');

    if (!descEl || !descEl.value.trim()) {
      showStatus(errorEl, "Bitte fülle die Nachricht bzw. Beschreibung aus.");
      return;
    }

    const descVal = descEl.value.trim();
    if (descVal.length < 10) {
      showStatus(errorEl, "Bitte beschreibe dein Anliegen etwas genauer (mindestens 10 Zeichen).");
      return;
    }

    // Check if Endpoint is configured
    if (!FEEDBACK_ENDPOINT || FEEDBACK_ENDPOINT === "HIER_FORMULAR_ENDPOINT_EINTRAGEN" || FEEDBACK_ENDPOINT.trim() === "") {
      showStatus(errorEl, "Feedback-Versand ist noch nicht eingerichtet. (FEEDBACK_ENDPOINT fehlt im Code)");
      return;
    }

    // Construct Payload
    const isAnonym = $('fbAnonymToggle') && $('fbAnonymToggle').checked;
    const nameVal = isAnonym ? "" : ($('fbName') ? $('fbName').value.trim() : "");
    const emailVal = isAnonym ? "" : ($('fbEmail') ? $('fbEmail').value.trim() : "");

    let payload = {};

    if (currentContext === "bug") {
      payload = {
        type: "Aufgaben-Bug",
        name: nameVal,
        email: emailVal,
        _subject: $('fbSubject') ? $('fbSubject').value.trim() : "Bug in Aufgabe",
        message: descVal,
        ...gatheredMetadata
      };
    } else {
      payload = {
        type: "Allgemeines App-Feedback",
        name: nameVal,
        email: emailVal,
        _subject: "App Feedback: " + ($('fbType') ? $('fbType').value : "Allgemein"),
        feedbackType: $('fbType') ? $('fbType').value : "Allgemeines Feedback",
        ratingStars: currentRating || "nicht bewertet",
        message: descVal,
        ...gatheredMetadata
      };
    }

    if (ACCESS_KEY) {
      payload.access_key = ACCESS_KEY;
    }

    // If anonym is true, delete name/email keys just in case
    if (isAnonym) {
      delete payload.name;
      delete payload.email;
    }

    // UI state loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Wird gesendet...";
    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');

    try {
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Success
        showStatus(successEl, currentContext === "bug" ? "Dein Bugreport wurde erfolgreich gesendet. Vielen Dank!" : "Danke für dein Feedback.");
        descEl.value = "";
        
        // Hide submit button to prevent double submits
        submitBtn.classList.add('hidden');
        
        // For general feedback, close sheet automatically after 1.5 seconds
        if (currentContext === "general") {
          setTimeout(closeFeedbackSheet, 1800);
        } else {
          // For bug, highlight navigation choices
          const navChoices = document.querySelector('.wh-fb-nav-choices');
          if (navChoices) {
            navChoices.classList.add('highlight-choices');
          }
        }
      } else {
        // Handle HTTP failure
        let errMsg = `Server meldete Fehler (Status ${response.status}).`;
        throw new Error(errMsg);
      }
    } catch (err) {
      console.warn("Feedback delivery failed", err);
      
      // Fallback mailto link
      const mailtoSubject = encodeURIComponent(currentContext === "bug" ? `[Bug Report] ${payload.subject}` : `[App Feedback] ${payload.feedbackType}`);
      const mailtoBody = encodeURIComponent(`Hallo App-Betreiber,\n\nIch wollte folgendes Feedback hinterlassen:\n\n${payload.message}\n\nTechnical details:\n${JSON.stringify(payload, null, 2)}`);
      const mailtoLink = `mailto:support@bps-trainer.de?subject=${mailtoSubject}&body=${mailtoBody}`;

      let errorHtml = `<b>Versand fehlgeschlagen:</b> ${esc(err.message || 'Netzwerkfehler')}.<br>` +
                      `<p class="small">Bitte sende dein Feedback manuell per E-Mail:</p>` +
                      `<a href="${mailtoLink}" class="wh-fb-mailto-link">✉ Feedback per E-Mail senden</a>`;
      
      errorEl.innerHTML = errorHtml;
      errorEl.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = "Erneut versuchen";
    }
  }

  function showStatus(element, message) {
    if (!element) return;
    element.innerHTML = esc(message);
    element.classList.remove('hidden');
  }

  /* ── Public API ───────────────────────────────────── */
  window.AppFeedback = {
    openBugReportSheet: openBugReportSheet,
    openGeneralFeedbackSheet: openGeneralFeedbackSheet,
    closeSheet: closeFeedbackSheet
  };

})();
