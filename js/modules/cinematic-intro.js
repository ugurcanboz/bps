(function(){
"use strict";
// cinematic.js — durchlaufendes Vorstellungsvideo (Motion Graphics) für Eignungstest-Trainer.
//   import { mountCinematicIntro } from './startscreen-module/cinematic.js';
//   mountCinematicIntro(document.body, { duration: 24000, onSelect(a){} });
// Kacheln tragen data-ui-action ("auth-demo-start" …) -> vom UI-Router verarbeitet.
// Jede Bewegung ist Funktion der Zeit t -> deterministisch & aufnehmbar (instance.seek(f)).

const I = {
  play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
  ticket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4 2 2 0 0 1 0-4Z"/><path d="M14 6v12"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 19a5 5 0 0 0-10 0"/><circle cx="9" cy="8" r="3.2"/><path d="M18 8v6M15 11h6"/></svg>',
  login:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  brainMini:'<svg viewBox="0 0 96 96" fill="none"><path d="M35 14c-9 0-16 7-16 16v3c-7 2-12 8-12 16s5 14 12 16v1c0 9 7 16 16 16 5 0 10-3 13-7 3 4 8 7 13 7 9 0 16-7 16-16v-1c7-2 12-8 12-16s-5-14-12-16v-3c0-9-7-16-16-16-6 0-11 3-14 8-3-5-8-8-14-8Z" stroke="#7dd3fc" stroke-width="4"/><path d="M48 22v52" stroke="#7dd3fc" stroke-width="3"/></svg>',
};

const CATS = ['IT / FISI', 'Kaufmännisch', 'Sozial', 'Mathe', 'Logik', 'Wissen'];

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
const easeInOut = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a, b, t) => a + (b - a) * clamp(t);
const nf = new Intl.NumberFormat('de-DE');

const defaults = {
  duration: 36000,
  brand: { name: 'Novura', tagline: "One day, you'll thank today." },
  keepOpen: false,
  tiles: [
    { action: 'auth-demo-start',  icon: 'play',   title: 'Demo starten',           subtitle: '2 Simulationen kostenlos', primary: true },
    { action: 'auth-redeem-code', icon: 'ticket', title: 'Teilnahmecode einlösen', subtitle: 'Vollzugang freischalten' },
    { action: 'auth-redeem-code', icon: 'user',   title: 'Registrieren',           subtitle: 'Rolle & Gruppe' },
    { action: 'auth-login',       icon: 'login',  title: 'Login',                  subtitle: 'Bestehender Zugang' },
  ],
};

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

function buildHTML(cfg) {
  const cats = CATS.map((c, i) => `<span class="chip" data-i="${i}">${esc(c)}</span>`).join('') +
               CATS.map((_, i) => `<i class="link" data-i="${i}"></i>`).join('');
  const tiles = cfg.tiles.map(t => `
    <button type="button" class="cine-tile ${t.primary ? 'primary' : ''}" data-ui-action="${esc(t.action)}" data-cine-action="${esc(t.action)}">
      <span class="ic">${I[t.icon] || I.play}</span>
      <span><b>${esc(t.title)}</b><small>${esc(t.subtitle || '')}</small></span>
    </button>`).join('');

  return `
  <svg width="0" height="0" style="position:absolute"><defs>
    <linearGradient id="cineBrain" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#20D9FF"/><stop offset=".5" stop-color="#2F80FF"/><stop offset="1" stop-color="#C13CFF"/></linearGradient>
    <linearGradient id="cineRing" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#20D9FF"/><stop offset="1" stop-color="#C13CFF"/></linearGradient>
  </defs></svg>

  <div class="cine-orb a" data-orb="0"></div>
  <div class="cine-orb b" data-orb="1"></div>
  <div class="cine-orb c" data-orb="2"></div>

  <div class="cine-stage">
    <!-- 1 Logo -->
    <div class="cine-scene" data-scene="logo">
      <div class="cine-logo"><span class="glow"></span>
        <svg viewBox="0 0 96 96" fill="none"><path pathLength="1" d="M35 14c-9 0-16 7-16 16v3c-7 2-12 8-12 16s5 14 12 16v1c0 9 7 16 16 16 5 0 10-3 13-7 3 4 8 7 13 7 9 0 16-7 16-16v-1c7-2 12-8 12-16s-5-14-12-16v-3c0-9-7-16-16-16-6 0-11 3-14 8-3-5-8-8-14-8Z" stroke-width="4" fill="rgba(47,128,255,.05)"/><path pathLength="1" d="M48 22v52" stroke-width="3"/></svg>
      </div>
      <div class="cine-h" data-el="logo-h">${esc(cfg.brand.name)}</div>
      <p class="cine-p" data-el="logo-p">${esc(cfg.brand.tagline)}</p>
    </div>

    <!-- 2 Bereiche -->
    <div class="cine-scene" data-scene="areas">
      <div class="cine-net">${cats}<span class="node">${I.grid}</span></div>
      <div class="cine-h">Alles in einer App</div>
      <p class="cine-p">Alle Prüfungsbereiche – an einem Ort trainiert.</p>
    </div>

    <!-- 3 Simulation -->
    <div class="cine-scene" data-scene="sim">
      <div class="cine-phone">
        <div class="cine-ring"><svg viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="16" fill="none" stroke-width="4"/><circle class="fg" pathLength="1" cx="20" cy="20" r="16" fill="none" stroke-width="4"/></svg><b data-el="timer">10:00</b></div>
        <div class="q">Welche Zahl setzt die Reihe fort?<br>2 · 4 · 8 · 16 · ?</div>
        <div class="opt">24</div><div class="opt good">32</div><div class="opt">30</div>
      </div>
      <div class="cine-h">Prüfung wie in echt</div>
      <p class="cine-p">Simulation mit Zeitdruck – genau wie am Prüfungstag.</p>
    </div>

    <!-- 4 Coach -->
    <div class="cine-scene" data-scene="coach">
      <div class="cine-chat">
        <div class="cine-bubble them" data-b="0">Deine Schwäche: Textaufgaben.</div>
        <div class="cine-bubble me" data-b="1">Zeig mir 3 Übungen dazu.</div>
        <div class="cine-bubble them" data-b="2">Los geht's – Lernpfad erstellt ✦</div>
      </div>
      <div class="cine-coachring"><svg viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="16" fill="none" stroke-width="4"/><circle class="fg" pathLength="1" cx="20" cy="20" r="16" fill="none" stroke-width="4"/></svg><b data-el="coachpct">0%</b></div>
      <div class="cine-h">Dein KI-Lerncoach</div>
    </div>

    <!-- 5 Highscore -->
    <div class="cine-scene" data-scene="score">
      <div class="cine-counter" data-el="counter">0</div>
      <div class="cine-bars">
        <div class="cine-bar" data-bar="0" style="height:170px"><span class="rank">2</span></div>
        <div class="cine-bar gold" data-bar="1" style="height:170px"><span class="rank">1</span></div>
        <div class="cine-bar" data-bar="2" style="height:170px"><span class="rank">3</span></div>
      </div>
      <div class="cine-h">Sammle Punkte &amp; steig auf</div>
    </div>
  </div>

  <div class="cine-vignette"></div>

  <div class="cine-ui">
    <div class="cine-ui-row">
      <span class="cine-mini"><span class="lg">${I.brainMini}</span><b>${esc(cfg.brand.name)}</b></span>
      <button type="button" class="cine-skip" data-cine-skip>Überspringen</button>
    </div>
    <div class="cine-progress"><i data-el="bar"></i></div>
  </div>

  <div class="cine-pause" data-cine-pause></div>

  <div class="cine-cta" data-el="cta">
    <div class="cine-cta-h">Bereit?</div>
    <p class="cine-cta-sub">Keine Anmeldung nötig – starte direkt.</p>
    <div class="cine-tiles">${tiles}</div>
    <button type="button" class="cine-replay" data-cine-replay>Video nochmal abspielen</button>
  </div>`;
}

function mountCinematicIntro(target, opts = {}) {
  const host = typeof target === 'string' ? document.querySelector(target) : (target || document.body);
  const cfg = { ...defaults, ...opts, brand: { ...defaults.brand, ...(opts.brand || {}) }, tiles: opts.tiles || defaults.tiles };
  const TOTAL = cfg.duration;

  const root = document.createElement('div');
  root.className = 'egt-cine';
  root.setAttribute('role', 'dialog');
  root.innerHTML = buildHTML(cfg);
  host.appendChild(root);

  const q = (s) => root.querySelector(s);
  const stage = q('.cine-stage');
  const scenes = {};
  root.querySelectorAll('[data-scene]').forEach(el => scenes[el.getAttribute('data-scene')] = el);
  const orbs = [...root.querySelectorAll('[data-orb]')];
  const bar = q('[data-el="bar"]');
  const cta = q('[data-el="cta"]');

  // Szenenfenster 36s gesamt mit Atempausen (kurze Dunkel-Momente zwischen Szenen)
  const W = {
    logo:  [0,      8000],
    areas: [8500,  15500],
    sim:   [16000, 22000],
    coach: [22500, 28000],
    score: [28500, TOTAL],
  };
  const FADE = 700;
  // Sound-Callbacks
  const soundFired = {};
  function maybeSoundScene(key, tms) {
    if (soundFired[key]) return;
    var ws = W[key]; if (!ws) return;
    if (tms >= ws[0] && tms < ws[0] + 800) { soundFired[key] = true; try { if (window.EGTGateScreen && window.EGTGateScreen._sound) window.EGTGateScreen._sound('scene'); } catch(e){} }
  }

  function sceneState(tms, [s, e]) {
    const op = clamp(Math.min((tms - (s - FADE)) / FADE, ((e + FADE) - tms) / FADE));
    const enter = clamp((tms - (s - FADE)) / FADE);
    const p = clamp((tms - s) / (e - s));
    return { op, enter, p };
  }

  function setRing(scene, sel, fill, dashEl) {
    const fg = scene.querySelector(sel);
    if (fg) fg.style.strokeDasharray = '1', fg.style.strokeDashoffset = String(1 - clamp(fill));
  }

  function apply(tms) {
    tms = clamp(tms, 0, TOTAL);
    const T = tms / TOTAL;

    // Sound-Szenenübergänge
    for (const key in W) maybeSoundScene(key, tms);

    // Orbs schweben
    orbs.forEach((o, i) => {
      const ph = i * 2.1, sp = 0.00018 + i * 0.00006;
      const x = 50 + Math.sin(tms * sp + ph) * 26 + (i - 1) * 18;
      const y = 46 + Math.cos(tms * sp * 0.8 + ph) * 22 + (i - 1) * 12;
      o.style.left = x + '%'; o.style.top = y + '%';
      o.style.transform = 'translate(-50%,-50%)';
    });

    // Kamera-Push (subtil, durchgehend)
    stage.style.transform = `scale(${lerp(1.0, 1.06, easeInOut(T))})`;

    // Jede Szene
    for (const key in W) {
      const st = sceneState(tms, W[key]);
      const el = scenes[key];
      el.style.opacity = st.op.toFixed(3);
      el.style.transform = `translateY(${lerp(22, 0, st.enter)}px) scale(${lerp(.97, 1, st.enter)})`;
      if (st.op <= 0.001) continue;
      const p = st.p;

      if (key === 'logo') {
        const draw = easeOut(clamp(p / 0.5));
        el.querySelectorAll('.cine-logo path').forEach(pa => { pa.style.strokeDasharray = '1'; pa.style.strokeDashoffset = String(1 - draw); });
        const glow = el.querySelector('.glow');
        if (glow) glow.style.transform = `scale(${1 + 0.06 * Math.sin(tms / 520)})`, glow.style.opacity = String(0.6 + 0.2 * Math.sin(tms / 520));
        q('[data-el="logo-h"]').style.opacity = clamp((p - 0.34) / 0.22).toFixed(3);
        q('[data-el="logo-p"]').style.opacity = clamp((p - 0.5) / 0.22).toFixed(3);
      }
      else if (key === 'areas') {
        const R = Math.min(152, root.clientWidth * 0.37);
        el.querySelectorAll('.chip').forEach(ch => {
          const i = +ch.getAttribute('data-i'); const a = (-90 + i * 60) * Math.PI / 180;
          const rp = easeOut(clamp((p - 0.1 - i * 0.08) / 0.4));
          const r = R * rp;
          ch.style.transform = `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r}px))`;
          ch.style.opacity = rp.toFixed(3);
        });
        el.querySelectorAll('.link').forEach(ln => {
          const i = +ln.getAttribute('data-i'); const a = (-90 + i * 60);
          const rp = easeOut(clamp((p - 0.1 - i * 0.08) / 0.4));
          ln.style.width = (R * rp) + 'px'; ln.style.transform = `rotate(${a}deg)`; ln.style.opacity = (rp * 0.8).toFixed(3);
        });
        const node = el.querySelector('.node');
        if (node) node.style.transform = `translate(-50%,-50%) scale(${lerp(.4, 1, easeOut(clamp(p / 0.2)))})`;
      }
      else if (key === 'sim') {
        const phone = el.querySelector('.cine-phone');
        if (phone) phone.style.transform = `translateY(${lerp(30, 0, easeOut(clamp(p / 0.22)))}px)`, phone.style.opacity = clamp(p / 0.22).toFixed(3);
        const secs = Math.max(0, Math.round((1 - clamp((p - 0.15) / 0.8)) * 600));
        const mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0');
        const tEl = q('[data-el="timer"]'); if (tEl) tEl.textContent = `${mm}:${ss}`;
        setRing(el, '.cine-ring .fg', 1 - clamp((p - 0.15) / 0.8));
        const good = el.querySelector('.opt.good');
        if (good) good.style.boxShadow = p > 0.7 ? '0 0 0 2px rgba(34,197,94,.6)' : 'none';
      }
      else if (key === 'coach') {
        el.querySelectorAll('.cine-bubble').forEach(b => {
          const i = +b.getAttribute('data-b'); const bp = clamp((p - 0.08 - i * 0.2) / 0.18);
          b.style.opacity = bp.toFixed(3); b.style.transform = `translateY(${lerp(12, 0, easeOut(bp))}px)`;
        });
        const fill = easeOut(clamp((p - 0.3) / 0.6)) * 0.82;
        setRing(el, '.cine-coachring .fg', fill);
        const pe = q('[data-el="coachpct"]'); if (pe) pe.textContent = Math.round(fill * 100) + '%';
      }
      else if (key === 'score') {
        const fr = [0.7, 1.0, 0.55];
        el.querySelectorAll('.cine-bar').forEach(b => {
          const i = +b.getAttribute('data-bar'); const g = easeOut(clamp((p - 0.05 - i * 0.05) / 0.55));
          b.style.transform = `scaleY(${g * fr[i]})`;
        });
        const ce = q('[data-el="counter"]'); if (ce) ce.textContent = nf.format(Math.round(easeOut(clamp((p - 0.1) / 0.7)) * 8240));
      }
    }

    // Fortschritt
    bar.style.width = (T * 100).toFixed(2) + '%';

    // Finale CTA einblenden (letzte 3.4s) – Bühne tritt dabei zurück
    const ctaP = clamp((tms - (TOTAL - 3400)) / 2600);
    cta.style.opacity = ctaP.toFixed(3);
    cta.style.transform = `translateY(${lerp(40, 0, easeOut(ctaP))}px)`;
    cta.style.pointerEvents = ctaP > 0.5 ? 'auto' : 'none';
    stage.style.opacity = (1 - 0.9 * ctaP).toFixed(3);
  }

  // ── Wiedergabe ──
  let raf = null, startAt = 0, pausedAt = 0, paused = false, finished = false;
  function frame(now) {
    if (paused) return;
    const tms = now - startAt;
    apply(tms);
    if (tms >= TOTAL) { finished = true; apply(TOTAL); return; }
    raf = requestAnimationFrame(frame);
  }
  function play() {
    finished = false; paused = false;
    startAt = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }
  function pause() { if (paused || finished) return; paused = true; pausedAt = performance.now(); cancelAnimationFrame(raf); }
  function resume() { if (!paused || finished) return; paused = false; startAt += performance.now() - pausedAt; raf = requestAnimationFrame(frame); }
  function toEnd() { cancelAnimationFrame(raf); paused = true; finished = true; apply(TOTAL); }
  function replay() { cancelAnimationFrame(raf); play(); }
  function seek(f) { cancelAnimationFrame(raf); paused = true; apply(clamp(f) * TOTAL); } // für Aufnahme

  function close() {
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVis);
    root.style.transition = 'opacity .4s ease'; root.style.opacity = '0';
    setTimeout(() => root.remove(), 420);
  }
  const onVis = () => { if (document.hidden) pause(); else resume(); };
  document.addEventListener('visibilitychange', onVis);

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-cine-skip]')) { toEnd(); return; }
    if (e.target.closest('[data-cine-replay]')) { replay(); return; }
    const tile = e.target.closest('[data-cine-action]');
    if (tile) {
      const action = tile.getAttribute('data-cine-action');
      try { root.dispatchEvent(new CustomEvent('egt-start-select', { bubbles: true, detail: { action } })); } catch (_) {}
      if (typeof cfg.onSelect === 'function') cfg.onSelect(action, tile);
      if (!cfg.keepOpen) close();
      return;
    }
    if (e.target.closest('[data-cine-pause]')) { paused ? resume() : pause(); }
  });

  apply(0);
  // Delay stellt sicher dass Element im DOM sichtbar ist bevor RAF startet
  setTimeout(function(){ play(); }, 80);
  let _muted = false;
  function setMuted(m) { _muted = !!m; }
  function progressFraction() {
    if (!startAt) return 0;
    if (finished) return 1;
    return Math.min(1, (performance.now() - startAt) / TOTAL);
  }
  return { close, replay, pause, resume, toEnd, seek, setMuted, progressFraction, el: root, duration: TOTAL };
}


  try { window.EGTCinematicIntro = { mount: mountCinematicIntro }; } catch(e){}
})();
