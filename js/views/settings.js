import * as db from '../db.js';
import { t, getLang, setLang, locale } from '../i18n.js';
import { esc, settings, toast, formatDate, todayISO } from '../util.js';
import { getFamily, setFamily } from '../family.js';

export const APP_VERSION = '1.1.0';

export async function renderSettings(el) {
  const family = await getFamily();
  const last = settings.get('lastBackup');
  const installed = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const lang = getLang();

  el.innerHTML = `
    <h1>${esc(t('settings.title'))}</h1>

    <section class="panel">
      <h2>🌐 ${esc(t('settings.language'))}</h2>
      <div class="chips">
        <button type="button" class="chip chip-big" data-lang="fr" lang="fr" aria-pressed="${lang === 'fr'}">Français</button>
        <button type="button" class="chip chip-big" data-lang="ar" lang="ar" aria-pressed="${lang === 'ar'}">العربية</button>
      </div>
    </section>

    <section class="panel">
      <h2>👨‍👩‍👧 ${esc(t('settings.family'))}</h2>
      <p>${esc(t('settings.familyHelp'))}</p>
      <form class="form" data-form="family">
        <label>${esc(t('settings.familyName'))}
          <input name="name" maxlength="40" value="${esc(family.name)}" placeholder="${esc(t('settings.familyNamePh'))}">
        </label>
        <label>${esc(t('settings.familyPhone'))}
          <input name="phone" type="tel" inputmode="tel" maxlength="20" dir="ltr" value="${esc(family.phone)}" placeholder="+212 6 12 34 56 78">
        </label>
        <button type="submit" class="btn btn-primary">✓ ${esc(t('save'))}</button>
      </form>
    </section>

    <section class="panel">
      <h2>💾 ${esc(t('settings.backup'))}</h2>
      <p>${esc(t('settings.backupHelp'))}</p>
      <p class="muted">${esc(last ? t('settings.lastBackup', { date: formatDate(last, locale()) }) : t('settings.neverBackup'))}</p>
      <button type="button" class="btn btn-primary btn-block" data-action="export">⬆️ ${esc(t('settings.export'))}</button>
      <label class="btn btn-block">
        <input type="file" accept="application/json,.json" hidden>
        ⬇️ ${esc(t('settings.import'))}
      </label>
    </section>

    <section class="panel">
      <h2>📲 ${esc(t('settings.install'))}</h2>
      ${installed
        ? `<p>${esc(t('settings.installed'))}</p>`
        : `<button type="button" class="btn btn-block" data-action="install" hidden>${esc(t('settings.installButton'))}</button>
           <p class="help">${esc(t('settings.installHelp'))}</p>`}
    </section>

    <section class="panel">
      <h2>🧶 ${esc(t('settings.about'))}</h2>
      <p>${esc(t('settings.aboutText'))}</p>
      <p class="muted">${esc(t('settings.version', { v: APP_VERSION }))}</p>
    </section>
  `;

  el.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
    setLang(b.dataset.lang);
    document.dispatchEvent(new Event('langchange'));
  }));

  el.querySelector('[data-form=family]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    await setFamily({ name: String(f.get('name')).trim(), phone: String(f.get('phone')).trim() });
    toast(t('settings.familySaved'));
  });

  el.querySelector('[data-action=export]').addEventListener('click', () => exportBackup(el));

  el.querySelector('input[type=file]').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    let data;
    try {
      data = JSON.parse(await file.text());
    } catch {
      data = null;
    }
    if (!db.isValidBackup(data)) {
      toast(t('settings.importError'));
      return;
    }
    if (!confirm(t('settings.importConfirm'))) return;
    await db.importAll(data);
    settings.set('lastProject', '');
    toast(t('settings.importOk', { n: data.projects.length }));
  });

  const installBtn = el.querySelector('[data-action=install]');
  if (installBtn) {
    const showInstall = () => { installBtn.hidden = !window.deferredInstallPrompt; };
    showInstall();
    document.addEventListener('installready', showInstall);
    installBtn.addEventListener('click', async () => {
      const prompt = window.deferredInstallPrompt;
      if (!prompt) return;
      prompt.prompt();
      await prompt.userChoice.catch(() => {});
      window.deferredInstallPrompt = null;
      installBtn.hidden = true;
    });
    return () => document.removeEventListener('installready', showInstall);
  }
  return null;
}

async function exportBackup(el) {
  const data = await db.exportAll();
  const name = `mon-tricot-sauvegarde-${todayISO()}.json`;
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const file = new File([blob], name, { type: 'application/json' });

  let done = false;
  // On phones, open the share menu so she can send the file to WhatsApp or Drive.
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      done = true;
    } catch (err) {
      if (err?.name === 'AbortError') return; // she closed the share menu
    }
  }
  if (!done) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  settings.set('lastBackup', new Date().toISOString());
  toast(t('settings.exportOk'));
  renderSettings(el);
}
