// Stockage local sur le téléphone (IndexedDB).
// "projects" : les projets (légers, avec une petite miniature)
// "photos"   : les photos en taille normale, liées à un projet
const DB_NAME = 'mon-tricot';
const DB_VERSION = 1;

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
      };
      req.onsuccess = () => resolve(req.result);
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

export async function exportAll() {
  const [p, ph] = await Promise.all([
    run('projects', 'readonly', (s) => s.getAll()),
    run('photos', 'readonly', (s) => s.getAll()),
  ]);
  return { app: 'mon-tricot', format: 1, exportedAt: new Date().toISOString(), projects: p, photos: ph };
}

export function isValidBackup(data) {
  return !!data && data.app === 'mon-tricot' && Array.isArray(data.projects) && Array.isArray(data.photos)
    && data.projects.every((p) => p && typeof p.id === 'string' && typeof p.name === 'string')
    && data.photos.every((ph) => ph && typeof ph.id === 'string' && typeof ph.projectId === 'string');
}

// Replaces everything on the phone with the backup content.
export function importAll(data) {
  return run(['projects', 'photos'], 'readwrite', ([p, ph]) => {
    p.clear();
    ph.clear();
    data.projects.forEach((x) => p.put(x));
    data.photos.forEach((x) => ph.put(x));
  });
}
