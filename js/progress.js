// What she has learned and which starter projects are unlocked.
import * as db from './db.js';
import { STARTERS } from './data/starters.js';

export async function getLearned() {
  return db.meta.get('learned', {});
}

export async function setLearned(id, learned) {
  const all = await getLearned();
  if (learned) all[id] = new Date().toISOString();
  else delete all[id];
  await db.meta.set('learned', all);
}

const isDone = (p) => p && (p.status === 'finished' || p.status === 'given');

// For each starter: its project (if started), done, unlocked.
export async function starterStates() {
  const projects = await db.projects.all();
  let previousDone = true;
  return STARTERS.map((s) => {
    const project = projects
      .filter((p) => p.starterId === s.id)
      .sort((a, b) => Number(isDone(b)) - Number(isDone(a)) || (b.updatedAt || '').localeCompare(a.updatedAt || ''))[0];
    const state = { starter: s, project, done: isDone(project), unlocked: previousDone };
    previousDone = state.done;
    return state;
  });
}
