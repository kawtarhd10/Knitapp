// Family mode: send a photo of a project to a family member on WhatsApp.
import * as db from './db.js';
import { t } from './i18n.js';

export async function getFamily() {
  return db.meta.get('family', { name: '', phone: '' });
}

export function setFamily(family) {
  return db.meta.set('family', family);
}

export function familyName(family) {
  return family.name || t('family.someone');
}

// WhatsApp wants the number with country code and digits only (Morocco: 212…).
export function waNumber(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0') && digits.length === 10) digits = `212${digits.slice(1)}`; // 06… -> 2126…
  return digits;
}

async function dataUrlToFile(dataUrl, name) {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], name, { type: blob.type || 'image/jpeg' });
}

// Shares the latest photo with a message. On phones this opens the share menu (she picks WhatsApp).
// Without a photo, it opens the WhatsApp chat directly with the message.
export async function shareProject(project) {
  const family = await getFamily();
  const finished = project.status === 'finished' || project.status === 'given';
  const text = finished
    ? t('family.msgFinished', { project: project.name })
    : t('family.msgProgress', { project: project.name, n: project.rows || 0 });

  const pics = (await db.photos.forProject(project.id)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (pics.length) {
    const file = await dataUrlToFile(pics[0].data, 'tricot.jpg');
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text });
        return true;
      } catch (err) {
        if (err?.name === 'AbortError') return false;
      }
    }
  }
  const number = waNumber(family.phone);
  const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');
  return true;
}
