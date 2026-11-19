// Small helpers shared by all screens.

// Escapes user text before putting it into HTML.
export function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function uid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDate(iso, locale) {
  if (!iso) return '';
  // Date-only strings are read as local dates so the day doesn't shift.
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T12:00:00`) : new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

// Settings kept in localStorage (language, last project, last backup).
export const settings = {
  get(key) {
    try { return localStorage.getItem(`tricot.${key}`); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(`tricot.${key}`, value); } catch { /* storage unavailable */ }
  },
  remove(key) {
    try { localStorage.removeItem(`tricot.${key}`); } catch { /* storage unavailable */ }
  },
  keys(prefix) {
    try {
      return Object.keys(localStorage).filter((k) => k.startsWith(`tricot.${prefix}`)).map((k) => k.slice(7));
    } catch { return []; }
  },
};

// Shrinks a photo so it doesn't fill the phone: returns a JPEG data URL.
export function resizeImage(file, maxSize, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image'));
    };
    img.src = url;
  });
}

let toastTimer;
export function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

export function vibrate(pattern) {
  try { navigator.vibrate?.(pattern); } catch { /* not supported */ }
}

export const STATUSES = ['idea', 'inProgress', 'finished', 'given'];

// Wraps user text so a French name inside Arabic text (or the reverse) keeps its own direction.
export function iso(value) {
  return `⁨${value ?? ''}⁩`;
}
