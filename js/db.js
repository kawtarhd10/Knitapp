// Stockage local sur le téléphone (IndexedDB).
// "projects" : les projets (légers, avec une petite miniature)
// "photos"   : les photos en taille normale, liées à un projet
// "meta"     : petites données (leçons apprises, contact famille)
// "videos"   : vidéos ajoutées depuis ce téléphone (pas dans la sauvegarde, trop lourdes)
const DB_NAME = 'mon-tricot';
const DB_VERSION = 2;

let dbPromise;

function open() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('photos')) {
          const photos = db.createObjectStore('photos', { keyPath: 'id' });
          photos.createIndex('projectId', 'projectId');
        }
        if (!db.objectStoreNames.contains('videos')) {
          db.createObjectStore('videos', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      };
      req.onsuccess = () => {
        const db = req.result;
        // If a newer version of the app opens the database, let it upgrade.
        db.onversionchange = () => { db.close(); location.reload(); };
        resolve(db);
      };
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

// Runs fn inside a transaction; resolves with the result of the last request fn returns.
async function run(stores, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(stores, mode);
    const s = Array.isArray(stores) ? stores.map((n) => tx.objectStore(n)) : tx.objectStore(stores);
    let result;
    const req = fn(s);
    if (req) req.onsuccess = () => { result = req.result; };
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export const projects = {
  all: () => run('projects', 'readonly', (s) => s.getAll()),
  get: (id) => run('projects', 'readonly', (s) => s.get(id)),
  put: (p) => run('projects', 'readwrite', (s) => s.put(p)),
  // Deletes a project and all its photos.
  remove: (id) => run(['projects', 'photos'], 'readwrite', ([p, ph]) => {
    p.delete(id);
    const cur = ph.index('projectId').openCursor(IDBKeyRange.only(id));
    cur.onsuccess = () => {
      const c = cur.result;
      if (c) { c.delete(); c.continue(); }
    };
  }),
};

export const photos = {
  forProject: (projectId) => run('photos', 'readonly', (s) => s.index('projectId').getAll(projectId)),
  get: (id) => run('photos', 'readonly', (s) => s.get(id)),
  put: (photo) => run('photos', 'readwrite', (s) => s.put(photo)),
  remove: (id) => run('photos', 'readwrite', (s) => s.delete(id)),
};

export const videos = {
  get: (id) => run('videos', 'readonly', (s) => s.get(id)),
  put: (id, blob) => run('videos', 'readwrite', (s) => s.put({ id, blob })),
  remove: (id) => run('videos', 'readwrite', (s) => s.delete(id)),
};

export const meta = {
  async get(key, fallback) {
    const row = await run('meta', 'readonly', (s) => s.get(key));
    return row ? row.value : fallback;
  },
  set: (key, value) => run('meta', 'readwrite', (s) => s.put({ key, value })),
};

const STORES = ['projects', 'photos', 'meta'];

export async function exportAll() {
  const [p, ph, me] = await Promise.all(STORES.map((n) => run(n, 'readonly', (s) => s.getAll())));
  return { app: 'mon-tricot', format: 2, exportedAt: new Date().toISOString(), projects: p, photos: ph, meta: me };
}

const isArrayOrMissing = (v) => v === undefined || Array.isArray(v);

export function isValidBackup(data) {
  return !!data && data.app === 'mon-tricot' && Array.isArray(data.projects) && Array.isArray(data.photos)
    && isArrayOrMissing(data.meta)
    && data.projects.every((p) => p && typeof p.id === 'string' && typeof p.name === 'string')
    && data.photos.every((ph) => ph && typeof ph.id === 'string' && typeof ph.projectId === 'string')
    && (data.meta || []).every((x) => x && typeof x.key === 'string');
}

// Replaces everything on the phone with the backup content.
// Backups from version 1 have no meta: what is on the phone is kept.
export function importAll(data) {
  return run(STORES, 'readwrite', ([p, ph, me]) => {
    p.clear();
    ph.clear();
    data.projects.forEach((x) => p.put(x));
    data.photos.forEach((x) => ph.put(x));
    if (data.meta) { me.clear(); data.meta.forEach((x) => me.put(x)); }
  });
}
