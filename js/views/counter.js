import * as db from '../db.js';
import { t, getLang } from '../i18n.js';
import { esc, settings, vibrate, toast } from '../util.js';

export async function renderCounter(el, id) {
  // "#/counter" reopens the last project; "#/counter/choose" shows the list.
  const projectId = id === 'choose' ? null : (id || settings.get('lastProject'));
  const p = projectId ? await db.projects.get(projectId) : null;
  if (!p) return renderChooser(el);
  settings.set('lastProject', p.id);

  el.innerHTML = `
    <div class="counter-head">
      <a class="back" href="#/project/${esc(p.id)}">‹ <bdi>${esc(p.name)}</bdi></a>
      <a class="btn btn-small" href="#/counter/choose">${esc(t('counter.change'))}</a>
    </div>

    <div class="counter">
      <div class="counter-label">${esc(t('counter.row'))}</div>
      <output class="counter-value" aria-live="polite"></output>
      <p class="counter-repeat" hidden></p>
      <div class="progress" hidden>
        <div class="progress-bar"><span></span></div>
        <p class="progress-text"></p>
      </div>

      <button type="button" class="counter-plus" aria-label="${esc(t('counter.add'))}">+1</button>
      <div class="counter-row">
        <button type="button" class="btn counter-minus" aria-label="${esc(t('counter.remove'))}">−1</button>
        <button type="button" class="btn counter-reset">↺ ${esc(t('counter.reset'))}</button>
      </div>
      <button type="button" class="btn btn-block voice-btn" aria-pressed="false">🎤 ${esc(t('voice.start'))}</button>
      <p class="voice-help help" hidden></p>
    </div>

    <details class="counter-options">
      <summary>⚙️ ${esc(t('counter.options'))}</summary>
      <label>${esc(t('counter.repeatLabel'))}
        <input name="repeat" type="number" inputmode="numeric" min="2" max="999" value="${esc(p.repeatEvery || '')}">
      </label>
      <p class="help">${esc(t('counter.repeatHelp'))}</p>
      <label>${esc(t('counter.goalLabel'))}
        <input name="goal" type="number" inputmode="numeric" min="1" max="9999" value="${esc(p.rowGoal || '')}">
      </label>
      <p class="help">${esc(t('counter.goalHelp'))}</p>
    </details>
    <p class="help center">💡 ${esc(t('counter.screenOn'))}</p>
  `;

  const valueEl = el.querySelector('.counter-value');
  const repeatEl = el.querySelector('.counter-repeat');
  const progressEl = el.querySelector('.progress');

  function show() {
    const rows = p.rows || 0;
    valueEl.textContent = rows;

    const every = p.repeatEvery || 0;
    repeatEl.hidden = !(every >= 2 && rows > 0);
    if (!repeatEl.hidden) {
      const n = ((rows - 1) % every) + 1;
      repeatEl.textContent = t('counter.repeatRow', { n, total: every });
      repeatEl.classList.toggle('end', n === every);
    }

    const goal = p.rowGoal || 0;
    progressEl.hidden = !goal;
    if (goal) {
      const pct = Math.min(100, Math.round((rows / goal) * 100));
      progressEl.querySelector('.progress-bar span').style.width = `${pct}%`;
      progressEl.querySelector('.progress-text').textContent = rows >= goal
        ? t('counter.goalReached')
        : t('counter.goal', { n: rows, total: goal });
    }
  }

  async function save() {
    p.updatedAt = new Date().toISOString();
    await db.projects.put(p);
  }

  function change(delta) {
    const before = p.rows || 0;
    p.rows = Math.max(0, before + delta);
    if (p.rows === before) return;
    show();
    save();
    if (delta > 0) {
      const endOfRepeat = p.repeatEvery >= 2 && p.rows % p.repeatEvery === 0;
      const goalReached = p.rowGoal && p.rows === p.rowGoal;
      vibrate(endOfRepeat || goalReached ? [120, 60, 120] : 25);
      valueEl.classList.remove('bump');
      void valueEl.offsetWidth; // restart the animation
      valueEl.classList.add('bump');
    }
  }

  el.querySelector('.counter-plus').addEventListener('click', () => change(1));
  el.querySelector('.counter-minus').addEventListener('click', () => change(-1));
  el.querySelector('.counter-reset').addEventListener('click', () => {
    if (!p.rows || !confirm(t('counter.confirmReset'))) return;
    p.rows = 0;
    show();
    save();
  });

  const readNumber = (input, min) => {
    const n = parseInt(input.value, 10);
    return Number.isFinite(n) && n >= min ? n : 0;
  };
  el.querySelector('[name=repeat]').addEventListener('input', (e) => {
    p.repeatEvery = readNumber(e.target, 2);
    show();
    save();
  });
  el.querySelector('[name=goal]').addEventListener('input', (e) => {
    p.rowGoal = readNumber(e.target, 1);
    show();
    save();
  });

  const voice = setupVoice(el, () => change(1), () => change(-1), () => p.rows || 0);

  show();
  const releaseScreen = keepScreenOn();
  return () => {
    voice.stop();
    releaseScreen?.();
  };
}

// ---------- Voice counting ----------
// She says "suivant" (or "زيد" / "التالي") to add a row, "annuler" (or "رجع") to remove one.
const WORDS = {
  fr: {
    next: ['suivant', 'prochain', 'plus un', 'plus 1', 'encore', 'rang'],
    undo: ['annule', 'moins un', 'moins 1', 'retire', 'erreur'],
  },
  ar: {
    next: ['زيد', 'التالي', 'تالي', 'الصف', 'صف', 'زائد'],
    undo: ['رجع', 'ارجع', 'الغي', 'إلغاء', 'ناقص', 'نقص'],
  },
};

function setupVoice(el, onNext, onUndo, getRows) {
  const btn = el.querySelector('.voice-btn');
  const help = el.querySelector('.voice-help');
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let listening = false;
  let rec = null;

  const update = () => {
    btn.setAttribute('aria-pressed', String(listening));
    btn.classList.toggle('is-listening', listening);
    btn.textContent = listening ? `⏹ ${t('voice.stop')}` : `🎤 ${t('voice.start')}`;
    help.hidden = !listening;
    help.textContent = `${t('voice.listening')} ${t('voice.internet')}`;
  };

  const say = (text) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = getLang() === 'ar' ? 'ar-MA' : 'fr-FR';
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch { /* no speech synthesis */ }
  };

  const handle = (heard) => {
    const words = WORDS[getLang()];
    const text = heard.toLowerCase();
    // Both languages are accepted: many people mix French and Darija.
    const has = (list) => list.some((w) => text.includes(w));
    if (has(words.undo) || has(WORDS.fr.undo)) {
      onUndo();
      say(String(getRows()));
    } else if (has(words.next) || has(WORDS.fr.next) || has(WORDS.ar.next)) {
      onNext();
      say(String(getRows()));
    }
  };

  const start = () => {
    rec = new Recognition();
    rec.lang = getLang() === 'ar' ? 'ar-MA' : 'fr-FR';
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) handle(e.results[i][0].transcript);
      }
    };
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        listening = false;
        toast(t('voice.denied'));
        update();
      } else if (e.error === 'network') {
        listening = false;
        toast(t('voice.internet'));
        update();
      }
    };
    // Phones stop listening after a silence: start again while voice mode is on.
    rec.onend = () => {
      if (listening) setTimeout(() => { if (listening) { try { rec.start(); } catch { /* already started */ } } }, 300);
    };
    try {
      rec.start();
      listening = true;
    } catch {
      listening = false;
    }
    update();
  };

  const stop = () => {
    listening = false;
    try { rec?.abort(); } catch { /* ignore */ }
    rec = null;
    update();
  };

  btn.addEventListener('click', () => {
    if (!Recognition) {
      toast(t('voice.unsupported'));
      return;
    }
    if (listening) stop();
    else start();
  });

  update();
  return { stop };
}

async function renderChooser(el) {
  const all = (await db.projects.all()).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  if (!all.length) {
    el.innerHTML = `
      <h1>${esc(t('counter.title'))}</h1>
      <p class="empty">${esc(t('counter.noProject'))}</p>
      <a class="btn btn-primary btn-block" href="#/project/new">＋ ${esc(t('projects.new'))}</a>`;
    return;
  }
  const active = all.filter((p) => p.status === 'inProgress' || p.status === 'idea');
  const list = active.length ? active : all;
  el.innerHTML = `
    <h1>${esc(t('counter.choose'))}</h1>
    <ul class="card-list">
      ${list.map((p) => `
        <li><a class="card" href="#/counter/${esc(p.id)}">
          ${p.cover ? `<img class="card-thumb" src="${esc(p.cover)}" alt="">` : '<span class="card-thumb placeholder" aria-hidden="true">🧶</span>'}
          <span class="card-body">
            <span class="card-title" dir="auto">${esc(p.name)}</span>
            <span class="muted">${esc(t('projects.rows', { n: p.rows || 0 }))}</span>
          </span>
        </a></li>`).join('')}
    </ul>`;
}

// Keeps the phone screen on while counting; returns a function that releases it.
function keepScreenOn() {
  if (!('wakeLock' in navigator)) return null;
  let lock = null;
  let active = true;
  const request = async () => {
    try {
      if (active && document.visibilityState === 'visible') lock = await navigator.wakeLock.request('screen');
    } catch { /* refused, e.g. battery saver */ }
  };
  const onVisible = () => { if (document.visibilityState === 'visible') request(); };
  document.addEventListener('visibilitychange', onVisible);
  request();
  return () => {
    active = false;
    document.removeEventListener('visibilitychange', onVisible);
    lock?.release().catch(() => {});
  };
}
