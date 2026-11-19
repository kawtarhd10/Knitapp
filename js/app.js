import { applyLang, getLang, setLang } from './i18n.js';
import { renderProjectList, renderProject, renderProjectForm } from './views/projects.js';
import { renderCounter, savePendingCounts } from './views/counter.js';
import { renderSettings } from './views/settings.js';
import { renderLearn, renderLessonList, renderLesson, renderStarters, renderStarter } from './views/learn.js';
import { renderCheck } from './views/check.js';

const routes = [
  { re: /^#\/(projects)?$/, tab: 'projects', view: () => renderProjectList },
  { re: /^#\/project\/new$/, tab: 'projects', view: () => (main) => renderProjectForm(main, null) },
  { re: /^#\/project\/([\w-]+)\/edit$/, tab: 'projects', view: (m) => (main) => renderProjectForm(main, m[1]) },
  { re: /^#\/project\/([\w-]+)$/, tab: 'projects', view: (m) => (main) => renderProject(main, m[1]) },
  { re: /^#\/counter(?:\/([\w-]+))?$/, tab: 'counter', view: (m) => (main) => renderCounter(main, m[1]) },
  { re: /^#\/learn$/, tab: 'learn', view: () => renderLearn },
  { re: /^#\/learn\/lessons$/, tab: 'learn', view: () => renderLessonList },
  { re: /^#\/learn\/lesson\/([\w-]+)$/, tab: 'learn', view: (m) => (main) => renderLesson(main, m[1]) },
  { re: /^#\/learn\/starters$/, tab: 'learn', view: () => renderStarters },
  { re: /^#\/learn\/starter\/([\w-]+)$/, tab: 'learn', view: (m) => (main) => renderStarter(main, m[1]) },
  { re: /^#\/learn\/check$/, tab: 'learn', view: () => renderCheck },
  { re: /^#\/settings$/, tab: 'settings', view: () => renderSettings },
];

const main = document.getElementById('view');
let cleanup = null;
let renderId = 0;

async function render({ keepScroll = false } = {}) {
  const hash = location.hash || '#/projects';
  let match = null;
  const route = routes.find((r) => (match = hash.match(r.re))) || routes[0];
  if (!match) match = [];

  if (typeof cleanup === 'function') cleanup();
  cleanup = null;

  document.querySelectorAll('.tabbar a').forEach((a) => {
    if (a.dataset.tab === route.tab) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  const id = ++renderId;
  const fresh = document.createElement('div');
  fresh.className = 'screen';
  const result = await route.view(match)(fresh);
  if (id !== renderId) {
    if (typeof result === 'function') result();
    return; // a newer navigation happened while loading
  }
  cleanup = result;
  const y = window.scrollY;
  main.replaceChildren(fresh);
  window.scrollTo(0, keepScroll ? y : 0);
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  setLang(getLang() === 'ar' ? 'fr' : 'ar');
  render({ keepScroll: true });
});
document.addEventListener('langchange', () => render({ keepScroll: true }));
document.addEventListener('refresh', () => render({ keepScroll: true }));

window.addEventListener('hashchange', () => render());

applyLang();
savePendingCounts().catch(() => {}).finally(() => render());

// Ask the browser to keep our data even if the phone runs low on space.
navigator.storage?.persist?.().catch(() => {});

// Offline mode.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// Remember the browser's "install app" prompt so the Settings screen can show a button.
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredInstallPrompt = e;
  document.dispatchEvent(new Event('installready'));
});
