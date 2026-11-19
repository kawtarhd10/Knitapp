import * as db from '../db.js';
import { t, getLang } from '../i18n.js';
import { esc, iso, uid, todayISO, toast } from '../util.js';
import { LESSONS } from '../data/lessons.js';
import { getLearned, setLearned, starterStates } from '../progress.js';

const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const SLOW = 0.6;
const YT_SLOW = 0.5; // YouTube only allows 0.25, 0.5, 0.75, 1…

// Loads YouTube's official player once (needs internet).
let ytApi = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!ytApi) {
    ytApi = new Promise((resolve, reject) => {
      const timer = setTimeout(() => { ytApi = null; reject(new Error('timeout')); }, 15000);
      window.onYouTubeIframeAPIReady = () => { clearTimeout(timer); resolve(window.YT); };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = () => { clearTimeout(timer); script.remove(); ytApi = null; reject(new Error('load')); };
      document.head.append(script);
    });
  }
  return ytApi;
}

const L = (item) => item[getLang()] || item.fr;

// ---------- Hub ----------

export async function renderLearn(el) {
  const learned = await getLearned();
  const n = LESSONS.filter((l) => learned[l.id]).length;
  const states = await starterStates();
  const doneStarters = states.filter((s) => s.done).length;

  el.innerHTML = `
    <h1>${esc(t('learn.title'))}</h1>
    <ul class="card-list hub">
      <li><a class="card" href="#/learn/lessons">
        <span class="card-thumb placeholder" aria-hidden="true">🎬</span>
        <span class="card-body">
          <span class="card-title">${esc(t('learn.lessons'))}</span>
          <span class="muted">${esc(t('learn.lessonsDesc'))}</span>
          ${progressBar(n, LESSONS.length, t('learn.progress', { n, total: LESSONS.length }))}
        </span>
      </a></li>
      <li><a class="card" href="#/learn/starters">
        <span class="card-thumb placeholder" aria-hidden="true">⭐</span>
        <span class="card-body">
          <span class="card-title">${esc(t('learn.starters'))}</span>
          <span class="muted">${esc(t('learn.startersDesc'))}</span>
          ${progressBar(doneStarters, states.length, `${doneStarters} / ${states.length}`)}
        </span>
      </a></li>
      <li><a class="card" href="#/learn/check">
        <span class="card-thumb placeholder" aria-hidden="true">🔍</span>
        <span class="card-body">
          <span class="card-title">${esc(t('learn.check'))}</span>
          <span class="muted">${esc(t('learn.checkDesc'))}</span>
        </span>
      </a></li>
    </ul>`;
}

function progressBar(n, total, label) {
  const pct = total ? Math.round((n / total) * 100) : 0;
  return `<span class="mini-progress"><span class="progress-bar"><span style="width:${pct}%"></span></span><span class="muted">${esc(label)}</span></span>`;
}

// ---------- List of lessons ----------

export async function renderLessonList(el) {
  const learned = await getLearned();
  el.innerHTML = `
    <a class="back" href="#/learn">‹ ${esc(t('back'))}</a>
    <h1>${esc(t('learn.lessons'))}</h1>
    <ol class="lesson-list">
      ${LESSONS.map((l, i) => `
        <li><a href="#/learn/lesson/${l.id}" class="${learned[l.id] ? 'is-learned' : ''}">
          <span class="lesson-num" aria-hidden="true">${learned[l.id] ? '✓' : i + 1}</span>
          <span>${esc(L(l).name)}</span>
        </a></li>`).join('')}
    </ol>`;
}

// ---------- One lesson per screen ----------

export async function renderLesson(el, id) {
  const index = LESSONS.findIndex((l) => l.id === id);
  if (index < 0) {
    location.hash = '#/learn/lessons';
    return null;
  }
  const lesson = LESSONS[index];
  const text = L(lesson);
  const learned = await getLearned();
  const isLearned = !!learned[lesson.id];
  const prev = LESSONS[index - 1];
  const next = LESSONS[index + 1];

  el.innerHTML = `
    <div class="lesson-head">
      <a class="back" href="#/learn/lessons">‹ ${esc(t('lesson.list'))}</a>
      <span class="muted">${esc(t('lesson.of', { n: index + 1, total: LESSONS.length }))}</span>
    </div>
    <h1 class="lesson-title">${esc(text.name)}</h1>

    <div class="video-box">
      <video muted loop playsinline preload="auto" hidden></video>
      <div class="yt-slot" hidden><div></div></div>
      <div class="video-empty" hidden>
        <span aria-hidden="true">🎬</span>
        <p></p>
        ${lesson.youtube ? `<a class="btn btn-small" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${esc(lesson.youtube)}" hidden>▶ ${esc(t('lesson.openYoutube'))}</a>` : ''}
      </div>
    </div>
    <div class="video-controls">
      <button type="button" class="btn btn-primary" data-action="again">↺ ${esc(t('lesson.again'))}</button>
      <button type="button" class="btn" data-action="speed"></button>
    </div>

    <ol class="steps">
      ${text.steps.map((s) => `<li>${esc(s)}</li>`).join('')}
    </ol>
    <p class="tip">💡 <strong>${esc(t('lesson.tip'))} :</strong> ${esc(text.tip)}</p>

    <div class="term ${isLearned ? '' : 'locked'}">
      ${isLearned
        ? `<p>${esc(t('lesson.termTitle'))}</p>
           <p class="term-word" dir="ltr">${esc(lesson.term.fr)}</p>
           <p class="muted">${esc(t('lesson.termEn', { term: iso(lesson.term.en) }))}</p>`
        : `<p>🔒 ${esc(t('lesson.termLocked'))}</p>`}
    </div>

    ${isLearned
      ? `<p class="learned-badge">${esc(t('lesson.learned'))}</p>
         <button type="button" class="btn btn-block btn-quiet" data-action="unlearn">${esc(t('lesson.unlearn'))}</button>`
      : `<button type="button" class="btn btn-primary btn-block btn-big" data-action="learned">${esc(t('lesson.learnedBtn'))}</button>`}

    <div class="actions">
      ${prev ? `<a class="btn" href="#/learn/lesson/${prev.id}">‹ ${esc(t('lesson.prev'))}</a>` : '<span></span>'}
      ${next ? `<a class="btn" href="#/learn/lesson/${next.id}">${esc(t('lesson.next'))} ›</a>` : '<span></span>'}
    </div>

    <details class="more">
      <summary>⋯</summary>
      <a class="btn btn-block" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(text.search)}">▶ ${esc(t('lesson.youtube'))}</a>
      <label class="btn btn-block">
        <input type="file" accept="video/*" hidden>
        📹 ${esc(t('lesson.addVideo'))}
      </label>
      <button type="button" class="btn btn-block btn-danger" data-action="remove-video" hidden>${esc(t('lesson.removeVideo'))}</button>
    </details>
  `;

  const video = el.querySelector('video');
  const ytSlot = el.querySelector('.yt-slot');
  const empty = el.querySelector('.video-empty');
  const emptyText = empty.querySelector('p');
  const emptyLink = empty.querySelector('a');
  const speedBtn = el.querySelector('[data-action=speed]');
  const removeBtn = el.querySelector('[data-action=remove-video]');
  let slow = true;
  let objectUrl = null;
  let yt = null; // YouTube player, when the lesson uses a YouTube video
  let gone = false; // the screen was left

  const showSpeed = () => {
    speedBtn.textContent = slow ? `🐇 ${t('lesson.normalSpeed')}` : `🐢 ${t('lesson.slower')}`;
    video.playbackRate = slow ? SLOW : 1;
    try { yt?.setPlaybackRate(slow ? YT_SLOW : 1); } catch { /* player not ready */ }
  };

  const showMessage = (message, withLink = false) => {
    video.hidden = true;
    ytSlot.hidden = true;
    empty.hidden = false;
    emptyText.textContent = message;
    if (emptyLink) emptyLink.hidden = !withLink;
  };

  function stopYouTube() {
    try { yt?.destroy(); } catch { /* ignore */ }
    yt = null;
    ytSlot.replaceChildren(document.createElement('div'));
  }

  async function showYouTube() {
    if (!navigator.onLine) {
      showMessage(t('lesson.needInternet'), false);
      return;
    }
    let YT;
    try {
      YT = await loadYouTubeApi();
    } catch {
      showMessage(t('lesson.needInternet'), false);
      return;
    }
    if (gone) return;
    video.hidden = true;
    empty.hidden = true;
    ytSlot.hidden = false;
    yt = new YT.Player(ytSlot.firstElementChild, {
      videoId: lesson.youtube,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        autoplay: 1, mute: 1, loop: 1, playlist: lesson.youtube, playsinline: 1, rel: 0, controls: 1,
        hl: getLang(), cc_lang_pref: 'fr',
      },
      events: {
        onReady: (e) => {
          showSpeed();
          e.target.playVideo();
        },
        // The video was removed or its owner does not allow it inside other apps.
        onError: () => {
          stopYouTube();
          showMessage(t('lesson.videoUnavailable'), true);
        },
      },
    });
  }

  async function loadVideo() {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
    stopYouTube();
    // 1. A video added on this phone; 2. the video shipped with the app (videos/<id>.mp4);
    // 3. the YouTube video chosen for this lesson.
    const local = await db.videos.get(lesson.id).catch(() => null);
    removeBtn.hidden = !local;
    let blob = local?.blob;
    if (!blob) {
      try {
        const res = await fetch(`videos/${lesson.id}.mp4`);
        if (res.ok && (res.headers.get('content-type') || '').startsWith('video')) blob = await res.blob();
      } catch { /* offline and not cached yet */ }
    }
    if (gone) return;
    if (!blob) {
      if (lesson.youtube) showYouTube();
      else showMessage(t('lesson.noVideo'));
      return;
    }
    objectUrl = URL.createObjectURL(blob);
    video.src = objectUrl;
    video.hidden = false;
    ytSlot.hidden = true;
    empty.hidden = true;
    showSpeed();
    video.play().catch(() => {});
  }

  video.addEventListener('loadedmetadata', showSpeed);
  el.querySelector('[data-action=again]').addEventListener('click', () => {
    if (yt) {
      try { yt.seekTo(0, true); yt.playVideo(); } catch { /* not ready */ }
      return;
    }
    video.currentTime = 0;
    video.play().catch(() => {});
  });
  speedBtn.addEventListener('click', () => { slow = !slow; showSpeed(); });

  el.querySelector('input[type=file]').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_VIDEO_BYTES) {
      toast(t('lesson.videoTooBig'));
      return;
    }
    await db.videos.put(lesson.id, file);
    loadVideo();
  });
  removeBtn.addEventListener('click', async () => {
    await db.videos.remove(lesson.id);
    loadVideo();
  });

  const refresh = async (value) => {
    await setLearned(lesson.id, value);
    document.dispatchEvent(new Event('refresh'));
  };
  el.querySelector('[data-action=learned]')?.addEventListener('click', () => refresh(true));
  el.querySelector('[data-action=unlearn]')?.addEventListener('click', () => refresh(false));

  showSpeed();
  loadVideo();
  return () => {
    gone = true;
    video.pause();
    stopYouTube();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  };
}

// ---------- Starter projects ----------

export async function renderStarters(el) {
  const states = await starterStates();
  const allDone = states.every((s) => s.done);
  el.innerHTML = `
    <a class="back" href="#/learn">‹ ${esc(t('back'))}</a>
    <h1>${esc(t('starters.title'))}</h1>
    ${allDone ? `<p class="notice notice-success">${esc(t('starters.allDone'))}</p>` : ''}
    <ol class="starter-list">
      ${states.map((st, i) => {
        const s = L(st.starter);
        const status = st.done ? t('starters.done')
          : !st.unlocked ? t('starters.locked', { name: L(states[i - 1].starter).name })
          : st.project ? t('starters.started') : '';
        const inner = `
          <span class="starter-emoji" aria-hidden="true">${st.unlocked ? st.starter.emoji : '🔒'}</span>
          <span class="card-body">
            <span class="card-title">${i + 1}. ${esc(s.name)}</span>
            ${status ? `<span class="muted">${esc(status)}</span>` : `<span class="muted">${esc(s.intro)}</span>`}
          </span>`;
        return `<li>${st.unlocked
          ? `<a class="card ${st.done ? 'is-done' : ''}" href="#/learn/starter/${st.starter.id}">${inner}</a>`
          : `<div class="card is-locked" aria-disabled="true">${inner}</div>`}</li>`;
      }).join('')}
    </ol>`;
}

export async function renderStarter(el, id) {
  const states = await starterStates();
  const st = states.find((s) => s.starter.id === id);
  if (!st || !st.unlocked) {
    location.hash = '#/learn/starters';
    return;
  }
  const s = L(st.starter);
  const learned = await getLearned();
  const lessons = st.starter.lessons.map((lid) => LESSONS.find((l) => l.id === lid)).filter(Boolean);

  el.innerHTML = `
    <a class="back" href="#/learn/starters">‹ ${esc(t('back'))}</a>
    <h1>${st.starter.emoji} ${esc(s.name)}</h1>
    <p class="lead">${esc(s.intro)}</p>
    ${st.done ? `<p class="notice notice-success">${esc(t('starters.done'))}</p>` : ''}

    ${st.project
      ? `<a class="btn btn-primary btn-block btn-big" href="#/project/${esc(st.project.id)}">🧶 ${esc(t('starters.open'))}</a>`
      : `<button type="button" class="btn btn-primary btn-block btn-big" data-action="start">▶ ${esc(t('starters.start'))}</button>`}

    <h2>${esc(t('starters.lessons'))}</h2>
    <ul class="lesson-list compact">
      ${lessons.map((l) => `
        <li><a href="#/learn/lesson/${l.id}" class="${learned[l.id] ? 'is-learned' : ''}">
          <span class="lesson-num" aria-hidden="true">${learned[l.id] ? '✓' : '🎬'}</span>
          <span>${esc(L(l).name)}</span>
        </a></li>`).join('')}
    </ul>

    <h2>${esc(t('starters.material'))}</h2>
    <ul class="material">${s.material.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>

    <h2>${esc(t('starters.steps'))}</h2>
    <ol class="steps">${s.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>

    <p class="tip">💡 ${esc(t('starters.howToFinish'))}</p>
  `;

  el.querySelector('[data-action=start]')?.addEventListener('click', async () => {
    const now = new Date().toISOString();
    const project = {
      id: uid(),
      starterId: st.starter.id,
      name: s.name,
      forWhom: '',
      status: 'inProgress',
      yarn: s.material[0],
      needles: st.starter.needles,
      startDate: todayISO(),
      notes: '',
      rows: 0,
      cover: '',
      createdAt: now,
      updatedAt: now,
    };
    await db.projects.put(project);
    location.hash = `#/project/${project.id}`;
  });
}
