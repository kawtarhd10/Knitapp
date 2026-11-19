// « Est-ce juste ? » : she photographs her knitting, then compares it with drawings
// of common mistakes, one question at a time, and gets the fix.
import { t, getLang } from '../i18n.js';
import { esc } from '../util.js';
import { MISTAKES } from '../data/mistakes.js';
import { knitPicture } from './pictures.js';

const L = (item) => item[getLang()] || item.fr;

export function renderCheck(el) {
  let photoUrl = null;
  let step = -1; // -1 = intro, then one step per mistake
  let answer = null; // fix shown for the current step
  const found = [];

  const photo = () => (photoUrl ? `<img class="check-photo" src="${photoUrl}" alt="">` : '');
  const list = (items) => `<ol class="steps">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;

  function draw() {
    if (step === -1) return drawIntro();
    if (step >= MISTAKES.length) return drawSummary();
    const m = MISTAKES[step];
    const text = L(m);

    let body;
    if (answer) {
      body = `
        <h2>${esc(answer.title)}</h2>
        ${list(answer.items)}
        ${answer.lesson ? `<a class="btn btn-block" href="#/learn/lesson/${answer.lesson}">🎬 ${esc(t('check.seeLesson'))}</a>` : ''}
        <button type="button" class="btn btn-primary btn-block btn-big" data-next>${esc(t('check.next'))} ›</button>`;
    } else if (m.type === 'count') {
      body = `
        <p class="question">${esc(text.question)}</p>
        <div class="count-inputs">
          <label>${esc(t('check.countHave'))}<input name="have" type="number" inputmode="numeric" min="0"></label>
          <label>${esc(t('check.countShould'))}<input name="should" type="number" inputmode="numeric" min="0"></label>
        </div>
        <div class="actions">
          <button type="button" class="btn" data-skip>${esc(t('check.skip'))}</button>
          <button type="button" class="btn btn-primary" data-compare>${esc(t('check.countCheck'))}</button>
        </div>`;
    } else {
      body = `
        <p class="question">${esc(text.question)}</p>
        <div class="compare">
          <figure>${knitPicture('ok', t('check.good'))}<figcaption>✓ ${esc(t('check.good'))}</figcaption></figure>
          <figure class="bad">${knitPicture(m.picture, text.name)}<figcaption>✗ ${esc(text.name)}</figcaption></figure>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-big" data-no>${esc(t('check.no'))}</button>
          <button type="button" class="btn btn-big btn-primary" data-yes>${esc(t('check.yes'))}</button>
        </div>`;
    }

    el.innerHTML = `
      <a class="back" href="#/learn">‹ ${esc(t('back'))}</a>
      <p class="muted">${esc(t('check.step', { n: step + 1, total: MISTAKES.length }))}</p>
      ${photo()}
      <div class="panel check-card">${body}</div>`;

    el.querySelector('[data-next]')?.addEventListener('click', next);
    el.querySelector('[data-no]')?.addEventListener('click', next);
    el.querySelector('[data-skip]')?.addEventListener('click', next);
    el.querySelector('[data-yes]')?.addEventListener('click', () => {
      if (!m.normal) found.push(text.name);
      answer = { title: m.normal ? text.name : t('check.howToFix'), items: text.fix, lesson: m.lesson };
      draw();
    });
    el.querySelector('[data-compare]')?.addEventListener('click', () => {
      const have = parseInt(el.querySelector('[name=have]').value, 10);
      const should = parseInt(el.querySelector('[name=should]').value, 10);
      if (!Number.isFinite(have) || !Number.isFinite(should)) return;
      if (have === should) {
        answer = { title: t('check.countOk'), items: [] };
      } else {
        found.push(text.name);
        const items = have > should ? text.more : text.fewer;
        answer = { title: items[0], items: items.slice(1), lesson: have < should ? 'dropped' : null };
      }
      draw();
    });
  }

  function next() {
    step += 1;
    answer = null;
    draw();
    window.scrollTo(0, 0);
  }

  function drawIntro() {
    el.innerHTML = `
      <a class="back" href="#/learn">‹ ${esc(t('back'))}</a>
      <h1>🔍 ${esc(t('check.title'))}</h1>
      <p class="lead">${esc(t('check.intro'))}</p>
      <label class="btn btn-primary btn-block btn-big">
        <input type="file" accept="image/*" capture="environment" hidden>
        📷 ${esc(t('check.takePhoto'))}
      </label>
      <button type="button" class="btn btn-block" data-skip-photo>${esc(t('check.noPhoto'))}</button>`;
    el.querySelector('input[type=file]').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      photoUrl = URL.createObjectURL(file);
      next();
    });
    el.querySelector('[data-skip-photo]').addEventListener('click', next);
  }

  function drawSummary() {
    el.innerHTML = `
      <a class="back" href="#/learn">‹ ${esc(t('back'))}</a>
      <h1>${esc(t('check.finished'))}</h1>
      ${photo()}
      <p class="notice ${found.length ? '' : 'notice-success'}">${esc(found.length
        ? t('check.found', { list: found.join(', ') })
        : t('check.allGood'))}</p>
      <button type="button" class="btn btn-block" data-restart>↺ ${esc(t('check.restart'))}</button>`;
    el.querySelector('[data-restart]').addEventListener('click', () => {
      step = -1;
      found.length = 0;
      draw();
    });
  }

  draw();
  return () => { if (photoUrl) URL.revokeObjectURL(photoUrl); };
}
