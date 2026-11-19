// Offline mode: keeps a copy of the app on the phone.
// Change VERSION whenever app files change, so phones download the new version.
const VERSION = 'v1.2.2';
const CACHE = `mon-tricot-${VERSION}`;
const VIDEO_CACHE = 'mon-tricot-videos'; // not tied to VERSION: videos survive app updates
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './js/db.js',
  './js/i18n.js',
  './js/util.js',
  './js/views/projects.js',
  './js/views/counter.js',
  './js/views/settings.js',
  './js/views/learn.js',
  './js/views/check.js',
  './js/views/pictures.js',
  './js/data/lessons.js',
  './js/data/starters.js',
  './js/data/mistakes.js',
  './js/progress.js',
  './js/family.js',
  './lang/fr.js',
  './lang/ar.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('mon-tricot-') && k !== CACHE && k !== VIDEO_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  // Lesson videos: kept on the phone after the first viewing, so they also work offline.
  // The saved copy is shown at once and refreshed in the background (in case a video was replaced).
  if (url.pathname.includes('/videos/') && url.pathname.endsWith('.mp4')) {
    event.respondWith(
      caches.open(VIDEO_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        const update = fetch(req).then((res) => {
          if (res.ok && res.status === 200) cache.put(req, res.clone());
          else if (res.status === 404) cache.delete(req);
          return res;
        });
        if (hit) {
          event.waitUntil(update.catch(() => {}));
          return hit;
        }
        return update;
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()));
    }),
  );
});
