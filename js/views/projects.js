import * as db from '../db.js';
import { t, locale } from '../i18n.js';
import { esc, iso, uid, todayISO, formatDate, resizeImage, toast, settings, STATUSES } from '../util.js';
import { getFamily, familyName, shareProject } from '../family.js';

let currentFilter = 'all';
const BACKUP_REMINDER_DAYS = 30;

function statusBadge(status) {
  return `<span class="badge badge-${esc(status)}">${esc(t(`status.${status}`))}</span>`;
}

function needsBackupReminder(projectCount) {
  if (projectCount === 0) return false;
  const last = settings.get('lastBackup');
  if (!last) return true;
  return Date.now() - new Date(last).getTime() > BACKUP_REMINDER_DAYS * 86400000;
}

// ---------- List of projects ----------

export async function renderProjectList(el) {
  const all = (await db.projects.all()).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  const shown = currentFilter === 'all' ? all : all.filter((p) => p.status === currentFilter);

  const filters = ['all', ...STATUSES].map((f) => `
    <button type="button" class="chip" data-filter="${f}" aria-pressed="${f === currentFilter}">
      ${esc(f === 'all' ? t('filter.all') : t(`status.${f}`))}
    </button>`).join('');

  const cards = shown.map((p) => `
    <li>
      <a class="card" href="#/project/${esc(p.id)}">
        ${p.cover ? `<img class="card-thumb" src="${esc(p.cover)}" alt="">` : '<span class="card-thumb placeholder" aria-hidden="true">🧶</span>'}
        <span class="card-body">
          <span class="card-title" dir="auto">${esc(p.name)}</span>
          ${p.forWhom ? `<span class="muted">${esc(t('projects.forWhom', { name: iso(p.forWhom) }))}</span>` : ''}
          <span class="card-meta">${statusBadge(p.status)} <span class="muted">${esc(t('projects.rows', { n: p.rows || 0 }))}</span></span>
        </span>
      </a>
    </li>`).join('');

  el.innerHTML = `
    <h1>${esc(t('projects.title'))}</h1>
    ${needsBackupReminder(all.length) ? `
      <div class="notice">
        <span>💾 ${esc(t('settings.backupReminder'))}</span>
        <a class="btn btn-small" href="#/settings">${esc(t('settings.backupNow'))}</a>
      </div>` : ''}
    <a class="btn btn-primary btn-block" href="#/project/new"><span aria-hidden="true">＋</span> ${esc(t('projects.new'))}</a>
    ${all.length ? `<div class="chips" role="group">${filters}</div>` : ''}
    ${shown.length
      ? `<ul class="card-list">${cards}</ul>`
      : `<p class="empty">${esc(all.length ? t('projects.emptyFilter') : t('projects.empty'))}</p>`}
  `;

  el.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    currentFilter = b.dataset.filter;
    renderProjectList(el);
  }));
}

// ---------- One project ----------

export async function renderProject(el, id) {
  const p = await db.projects.get(id);
  if (!p) {
    el.innerHTML = `<p class="empty">${esc(t('projects.notFound'))}</p>
      <a class="btn btn-block" href="#/projects">${esc(t('back'))}</a>`;
    return;
  }
  const pics = (await db.photos.forProject(id)).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const who = familyName(await getFamily());
  const finished = p.status === 'finished' || p.status === 'given';

  const info = [
    p.forWhom && [t('form.forWhom'), p.forWhom],
    p.yarn && [t('project.yarn'), p.yarn],
    p.needles && [t('project.needles'), t('project.needlesValue', { n: iso(p.needles) })],
    p.startDate && [t('project.startDate'), formatDate(p.startDate, locale())],
  ].filter(Boolean);

  el.innerHTML = `
    <a class="back" href="#/projects">‹ ${esc(t('back'))}</a>
    <h1 dir="auto">${esc(p.name)}</h1>
    <p>${statusBadge(p.status)}</p>

    ${finished && !p.sharedAt ? `
      <div class="celebrate">
        <p class="celebrate-title">${esc(t('family.celebrate'))}</p>
        ${pics.length
          ? `<button type="button" class="btn btn-primary btn-block btn-big" data-action="share">📤 ${esc(t('family.sendFinished', { name: iso(who) }))}</button>`
          : `<p>${esc(t('family.addPhotoFirst'))}</p>
             <button type="button" class="btn btn-primary btn-block btn-big" data-action="add-photo">📷 ${esc(t('photos.add'))}</button>`}
      </div>` : ''}

    ${p.starterId ? `<a class="btn btn-block" href="#/learn/starter/${esc(p.starterId)}">📖 ${esc(t('starters.instructions'))}</a>` : ''}

    <a class="btn btn-primary btn-block btn-big" href="#/counter/${esc(p.id)}">
      🔢 ${esc(t('project.countRows'))} <span class="pill">${esc(p.rows || 0)}</span>
    </a>

    ${info.length ? `<dl class="info">${info.map(([k, v]) => `<dt>${esc(k)}</dt><dd dir="auto">${esc(v)}</dd>`).join('')}</dl>` : ''}
    ${p.notes ? `<h2>${esc(t('project.notes'))}</h2><p class="notes" dir="auto">${esc(p.notes)}</p>` : ''}

    <h2>${esc(t('photos.title'))}</h2>
    <div class="photo-grid">
      ${pics.map((ph) => `<button type="button" class="photo" data-photo="${esc(ph.id)}"><img src="${esc(ph.data)}" alt=""></button>`).join('')}
      <label class="photo photo-add">
        <input type="file" accept="image/*" hidden>
        <span aria-hidden="true">📷</span>
        <span>${esc(t('photos.add'))}</span>
      </label>
    </div>

    <button type="button" class="btn btn-block" data-action="share">📤 ${esc(t('family.share', { name: iso(who) }))}</button>

    <div class="actions">
      <a class="btn" href="#/project/${esc(p.id)}/edit">✏️ ${esc(t('edit'))}</a>
      <button type="button" class="btn btn-danger" data-action="delete">🗑️ ${esc(t('delete'))}</button>
    </div>
  `;

  el.querySelector('input[type=file]').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const [data, thumb] = await Promise.all([resizeImage(file, 1280), resizeImage(file, 240, 0.7)]);
      await db.photos.put({ id: uid(), projectId: p.id, data, createdAt: new Date().toISOString() });
      // The first photo becomes the project's picture in the list.
      if (!p.cover) p.cover = thumb;
      p.updatedAt = new Date().toISOString();
      await db.projects.put(p);
      renderProject(el, id);
    } catch {
      toast(t('photos.error'));
    }
  });

  el.querySelectorAll('[data-action=share]').forEach((b) => b.addEventListener('click', async () => {
    const sent = await shareProject(p);
    if (sent && finished && !p.sharedAt) {
      p.sharedAt = new Date().toISOString();
      await db.projects.put(p);
      renderProject(el, id);
    }
  }));
  el.querySelector('[data-action=add-photo]')?.addEventListener('click', () => el.querySelector('.photo-add input').click());

  el.querySelectorAll('[data-photo]').forEach((b) => b.addEventListener('click', () => {
    const ph = pics.find((x) => x.id === b.dataset.photo);
    openViewer(ph, async () => {
      await db.photos.remove(ph.id);
      const rest = pics.filter((x) => x.id !== ph.id);
      p.cover = rest.length ? await resizeDataUrl(rest[0].data) : '';
      p.updatedAt = new Date().toISOString();
      await db.projects.put(p);
      renderProject(el, id);
    });
  }));

  el.querySelector('[data-action=delete]').addEventListener('click', async () => {
    if (!confirm(t('project.confirmDelete'))) return;
    await db.projects.remove(p.id);
    if (settings.get('lastProject') === p.id) settings.set('lastProject', '');
    toast(t('project.deleted'));
    location.hash = '#/projects';
  });
}

async function resizeDataUrl(dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  return resizeImage(blob, 240, 0.7);
}

function openViewer(photo, onDelete) {
  const dialog = document.createElement('dialog');
  dialog.className = 'viewer';
  dialog.innerHTML = `
    <img src="${esc(photo.data)}" alt="">
    <div class="actions">
      <button type="button" class="btn" data-close>${esc(t('close'))}</button>
      <button type="button" class="btn btn-danger" data-del>🗑️ ${esc(t('delete'))}</button>
    </div>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-del]').addEventListener('click', async () => {
    if (!confirm(t('photos.confirmDelete'))) return;
    dialog.close();
    await onDelete();
  });
  dialog.showModal();
}

// ---------- Create / edit form ----------

export async function renderProjectForm(el, id) {
  const existing = id ? await db.projects.get(id) : null;
  if (id && !existing) {
    el.innerHTML = `<p class="empty">${esc(t('projects.notFound'))}</p>`;
    return;
  }
  const p = existing || { status: 'inProgress', startDate: todayISO() };
  const backHref = existing ? `#/project/${esc(existing.id)}` : '#/projects';

  el.innerHTML = `
    <a class="back" href="${backHref}">‹ ${esc(t('back'))}</a>
    <h1>${esc(t(existing ? 'form.editTitle' : 'form.newTitle'))}</h1>
    <form class="form" novalidate>
      <label>${esc(t('form.name'))}
        <input name="name" required maxlength="80" value="${esc(p.name)}" placeholder="${esc(t('form.namePh'))}">
      </label>
      <p class="error" hidden>${esc(t('form.nameRequired'))}</p>

      <label>${esc(t('form.forWhom'))}
        <input name="forWhom" maxlength="80" value="${esc(p.forWhom)}" placeholder="${esc(t('form.forWhomPh'))}">
      </label>

      <fieldset>
        <legend>${esc(t('form.status'))}</legend>
        <div class="chips">
          ${STATUSES.map((s) => `
            <label class="chip">
              <input type="radio" name="status" value="${s}" ${p.status === s ? 'checked' : ''}>
              ${esc(t(`status.${s}`))}
            </label>`).join('')}
        </div>
      </fieldset>

      <label>${esc(t('form.yarn'))}
        <input name="yarn" maxlength="120" value="${esc(p.yarn)}" placeholder="${esc(t('form.yarnPh'))}">
      </label>

      <label>${esc(t('form.needles'))}
        <input name="needles" inputmode="decimal" maxlength="10" value="${esc(p.needles)}" placeholder="${esc(t('form.needlesPh'))}">
      </label>

      <label>${esc(t('form.startDate'))}
        <input name="startDate" type="date" value="${esc(p.startDate)}">
      </label>

      <label>${esc(t('form.notes'))}
        <textarea name="notes" rows="4" placeholder="${esc(t('form.notesPh'))}">${esc(p.notes)}</textarea>
      </label>

      <div class="actions">
        <a class="btn" href="${backHref}">${esc(t('cancel'))}</a>
        <button type="submit" class="btn btn-primary">✓ ${esc(t('save'))}</button>
      </div>
    </form>
  `;

  const form = el.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const name = String(f.get('name')).trim();
    if (!name) {
      el.querySelector('.error').hidden = false;
      form.elements.name.focus();
      return;
    }
    const now = new Date().toISOString();
    const project = {
      rows: 0,
      cover: '',
      createdAt: now,
      ...existing,
      id: existing?.id || uid(),
      name,
      forWhom: String(f.get('forWhom')).trim(),
      status: STATUSES.includes(f.get('status')) ? f.get('status') : 'inProgress',
      yarn: String(f.get('yarn')).trim(),
      needles: String(f.get('needles')).trim().replace(',', '.'),
      startDate: String(f.get('startDate')),
      notes: String(f.get('notes')).trim(),
      updatedAt: now,
    };
    await db.projects.put(project);
    location.hash = `#/project/${project.id}`;
  });
}
