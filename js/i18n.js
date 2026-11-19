import fr from '../lang/fr.js';
import ar from '../lang/ar.js';
import { settings } from './util.js';

const dictionaries = { fr, ar };
let lang = settings.get('lang') === 'ar' ? 'ar' : 'fr'; // French by default

export function getLang() {
  return lang;
}

export function locale() {
  return lang === 'ar' ? 'ar-MA' : 'fr-FR';
}

export function setLang(next) {
  lang = next === 'ar' ? 'ar' : 'fr';
  settings.set('lang', lang);
  applyLang();
}

// t('projects.rows', { n: 4 }) -> "Rangs : 4"
export function t(key, params = {}) {
  let s = dictionaries[lang][key] ?? dictionaries.fr[key] ?? key;
  for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

// Sets direction (Arabic is right-to-left) and fills static texts marked with data-i18n.
export function applyLang() {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('appName');
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  const toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.textContent = t('langToggle');
    toggle.setAttribute('aria-label', t('langToggleLabel'));
    toggle.lang = lang === 'ar' ? 'fr' : 'ar';
  }
}
