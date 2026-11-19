// Parcours réaliste sur le site en ligne, comme une débutante pendant ses premières semaines.
// Lancer : node tests/live-journey.mjs [adresse]
//   adresse par défaut : https://kawtarhd10.github.io/Knitapp/
//   pour tester en local : python3 -m http.server 8000  puis  node tests/live-journey.mjs http://localhost:8000/
import { createRequire } from 'node:module';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');

const URL = process.argv[2] || 'https://kawtarhd10.github.io/Knitapp/';
const work = mkdtempSync(join(tmpdir(), 'tricot-'));
let failures = 0;
const ok = (cond, message) => {
  console.log(`${cond ? '  ✓' : '  ✗'} ${message}`);
  if (!cond) failures += 1;
};

// A phone photo of knitting: a small JPEG drawn in the browser.
async function makePhoto(page) {
  const b64 = await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 800; c.height = 600;
    const g = c.getContext('2d');
    g.fillStyle = '#e8dccb'; g.fillRect(0, 0, 800, 600);
    g.fillStyle = '#c0573a';
    for (let y = 40; y < 560; y += 22) for (let x = 40; x < 760; x += 24) { g.beginPath(); g.ellipse(x, y, 7, 11, 0.5, 0, 7); g.fill(); }
    return c.toDataURL('image/jpeg', 0.8).split(',')[1];
  });
  const file = join(work, 'tricot.jpg');
  writeFileSync(file, Buffer.from(b64, 'base64'));
  return file;
}

async function newPhone(browser) {
  const ctx = await browser.newContext({ ...devices['Pixel 7'], acceptDownloads: true });
  // No microphone here: a stand-in for speech recognition lets the test "speak".
  await ctx.addInitScript(() => {
    class FakeRecognition { constructor() { window.__rec = this; } start() { this.on = true; } abort() { this.on = false; } stop() {} }
    window.SpeechRecognition = FakeRecognition;
    window.webkitSpeechRecognition = FakeRecognition;
    window.__say = (text) => window.__rec.onresult({ resultIndex: 0, results: [Object.assign([{ transcript: text }], { isFinal: true })] });
    window.open = (u) => { window.__opened = u; };
  });
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  page.on('dialog', (d) => d.accept());
  return { ctx, page };
}

const go = async (page, hash) => {
  await page.goto(URL + hash);
  await page.waitForSelector('#view .screen');
};

// In a sandbox with an HTTPS proxy (like Claude's cloud sessions), the browser goes through it.
const browser = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } } : {});
const { ctx, page } = await newPhone(browser);

console.log(`Site : ${URL}\n\nJour 1 : découverte`);
await go(page, '');
ok(await page.textContent('h1') === 'Mes projets', 'l’application s’ouvre en français');
ok(await page.getAttribute('html', 'dir') === 'ltr', 'sens de lecture gauche → droite');

await go(page, '#/settings');
await page.fill('[data-form=family] [name=name]', 'Ma fille');
await page.fill('[data-form=family] [name=phone]', '06 12 34 56 78');
await page.click('[data-form=family] button[type=submit]');
await page.waitForTimeout(300);

console.log('\nJours 1-3 : les 5 premières leçons');
const lessons = ['cast-on', 'knit', 'garter', 'bind-off', 'weave-ends'];
for (const id of lessons) {
  await go(page, `#/learn/lesson/${id}`);
  const title = await page.textContent('.lesson-title');
  const locked = await page.isVisible('.term.locked');
  // Wait for the YouTube player (or the message if it can't load).
  await page.waitForFunction(() => document.querySelector('.yt-slot iframe') || !document.querySelector('.video-empty').hidden, null, { timeout: 20000 }).catch(() => {});
  const iframe = await page.$('.yt-slot iframe');
  const src = iframe ? await iframe.getAttribute('src') : '';
  ok(src.includes('youtube-nocookie.com/embed/'), `${title} : vidéo YouTube dans l’application${src ? '' : ` — ${await page.textContent('.video-empty p')}`}`);
  await page.click('[data-action=learned]');
  await page.waitForSelector('.term-word');
  ok(locked, `   mot du modèle caché avant, visible après : « ${await page.textContent('.term-word')} »`);
}
await go(page, '#/learn');
ok((await page.textContent('.hub')).includes('5 / 12'), 'progression : 5 / 12 leçons');

console.log('\nJours 3-6 : la lavette (38 mailles, environ 65 rangs)');
await go(page, '#/learn/starters');
ok(await page.locator('.is-locked').count() === 2, 'l’écharpe et le bonnet sont encore verrouillés');
await go(page, '#/learn/starter/dishcloth');
ok((await page.textContent('.steps')).includes('Montez 38 mailles'), 'instructions : « Montez 38 mailles »');
await page.click('[data-action=start]');
await page.waitForSelector('.info');
const dishclothUrl = page.url();
await page.click('text=Compter les rangs');
await page.waitForSelector('.counter-plus');
await page.click('summary');
await page.fill('[name=goal]', '65');
await page.click('summary');
// Day by day: 20 rows tapped, 25 rows by voice (one mistake undone), 20 tapped.
for (let i = 0; i < 20; i++) await page.click('.counter-plus');
await page.click('.voice-btn');
for (let i = 0; i < 25; i++) await page.evaluate(() => __say(Math.random() < 0.5 ? 'rang suivant' : 'suivant'));
await page.evaluate(() => { __say('suivant'); __say('annuler'); __say('il fait beau'); });
await page.click('.voice-btn');
for (let i = 0; i < 20; i++) await page.click('.counter-plus');
ok(await page.textContent('.counter-value') === '65', `compteur : ${await page.textContent('.counter-value')} rangs (20 au doigt + 25 à la voix + 20 au doigt)`);
ok((await page.textContent('.progress-text')).includes('Objectif atteint'), 'objectif de 65 rangs atteint');
await page.reload();
await page.waitForSelector('.counter-value');
ok(await page.textContent('.counter-value') === '65', 'après fermeture de l’application, le compteur est toujours à 65');

console.log('\nJour 6 : lavette terminée');
await page.goto(dishclothUrl);
await page.waitForSelector('.info');
await page.setInputFiles('.photo-add input', await makePhoto(page));
await page.waitForSelector('.photo img');
await page.click('text=Modifier');
await page.click('label.chip:has-text("Terminé")');
await page.click('button[type=submit]');
await page.waitForSelector('.celebrate');
ok(true, `« ${(await page.textContent('.celebrate-title')).trim()} »`);
await page.click('.celebrate [data-action=share]');
await page.waitForTimeout(500);
const opened = await page.evaluate(() => window.__opened || '');
ok(opened.startsWith('https://wa.me/212612345678'), `WhatsApp s’ouvre vers le +212 6 12 34 56 78 : ${decodeURIComponent(opened.split('text=')[1] || '')}`);

console.log('\nJour 7 : l’écharpe se débloque');
await go(page, '#/learn/starters');
ok(await page.locator('.is-locked').count() === 1, 'l’écharpe est débloquée, le bonnet pas encore');
await go(page, '#/learn/starter/scarf');
await page.click('[data-action=start]');
await page.waitForSelector('.info');
await page.click('text=Compter les rangs');
await page.waitForSelector('.counter-plus');
await page.click('summary');
await page.fill('[name=repeat]', '2'); // côtes : rangs 1 et 2 qui se répètent
for (let i = 0; i < 11; i++) await page.click('.counter-plus');
ok((await page.textContent('.counter-repeat')).includes('1 / 2'), `rang 11 → ${await page.textContent('.counter-repeat')} (donc « rang 1 » du modèle)`);

console.log('\nJour 8 : « Est-ce juste ? »');
await go(page, '#/learn/check');
await page.setInputFiles('input[type=file]', join(work, 'tricot.jpg'));
await page.waitForSelector('.compare');
await page.click('[data-no]'); // pas d'échelle
await page.click('[data-no]'); // pas de maille tordue
await page.click('[data-no]'); // pas de trou
await page.fill('[name=have]', '31');
await page.fill('[name=should]', '30');
await page.click('[data-compare]');
ok((await page.textContent('.check-card h2')).includes('en trop'), '31 mailles au lieu de 30 → « mailles en trop » + comment réparer');
await page.click('[data-next]');
await page.click('[data-no]');
ok((await page.textContent('.notice')).includes('Nombre de mailles'), `résumé : ${await page.textContent('.notice')}`);

console.log('\nEn arabe');
await page.click('#lang-toggle');
await go(page, '#/learn/lesson/knit');
ok(await page.getAttribute('html', 'dir') === 'rtl', 'sens de lecture droite → gauche');
ok(await page.textContent('.lesson-title') === 'الغرزة السادة', `titre : ${await page.textContent('.lesson-title')}`);
await go(page, '#/counter');
await page.click('.voice-btn');
await page.evaluate(() => __say('زيد'));
ok(await page.textContent('.counter-value') === '12', 'à la voix en darija (« زيد ») : rang 12');
ok(await page.evaluate(() => __rec.lang) === 'ar-MA', 'reconnaissance vocale en arabe du Maroc');
await page.click('.voice-btn');
await page.click('#lang-toggle');

console.log('\nNouveau téléphone : sauvegarde puis restauration');
await go(page, '#/settings');
const [download] = await Promise.all([page.waitForEvent('download'), page.click('[data-action=export]')]);
const backup = join(work, 'sauvegarde.json');
await download.saveAs(backup);
const phone2 = await newPhone(browser);
await go(phone2.page, '#/settings');
await phone2.page.setInputFiles('.panel input[type=file]', backup);
await phone2.page.waitForTimeout(800);
await go(phone2.page, '#/projects');
ok(await phone2.page.locator('.card').count() === 2, 'les 2 projets sont sur le nouveau téléphone');
await go(phone2.page, '#/learn');
ok((await phone2.page.textContent('.hub')).includes('5 / 12'), 'les leçons apprises aussi');
await go(phone2.page, '#/learn/starters');
ok(await phone2.page.locator('.is-locked').count() === 1, 'et l’écharpe reste débloquée');

console.log('\nSans internet');
await page.evaluate(() => navigator.serviceWorker.ready);
await page.reload();
await ctx.setOffline(true);
await page.reload();
await page.waitForSelector('#view .screen');
await go(page, '#/projects').catch(() => {});
ok(await page.locator('.card').count() === 2, 'l’application et les projets s’ouvrent sans internet');
await page.evaluate(() => { location.hash = '#/learn/lesson/purl'; });
await page.waitForSelector('.video-empty:not([hidden])');
ok((await page.textContent('.video-empty p')).includes('internet'), `vidéo : « ${await page.textContent('.video-empty p')} »`);

const errors = [...page.errors, ...phone2.page.errors];
ok(errors.length === 0, `aucune erreur de page${errors.length ? ` : ${errors.join(' | ')}` : ''}`);
await browser.close();
console.log(failures ? `\n${failures} problème(s).` : '\nParcours complet réussi ✓');
process.exit(failures ? 1 : 0);
