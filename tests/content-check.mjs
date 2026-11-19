// Vérifie le contenu « tricot » de l'application :
//  - les 3 projets : les nombres du modèle sont justes (simulation maille par maille)
//  - les textes français et arabe vont ensemble
//  - chaque vidéo YouTube existe et peut être lue dans l'application (en ligne)
//
// Lancer :  node tests/content-check.mjs            (avec internet, vérifie aussi YouTube)
//           node tests/content-check.mjs --offline  (sans la vérification YouTube)
import fr from '../lang/fr.js';
import ar from '../lang/ar.js';
import { LESSONS } from '../js/data/lessons.js';
import { STARTERS } from '../js/data/starters.js';
import { MISTAKES } from '../js/data/mistakes.js';

let failures = 0;
const ok = (cond, message) => {
  console.log(`${cond ? '  ✓' : '  ✗'} ${message}`);
  if (!cond) failures += 1;
};

// ---------- A tiny knitting simulator ----------
// The fabric is seen from the right side (RS). A stitch knitted on the RS shows a "V";
// purled on the RS it shows a bump "-". On wrong-side (WS) rows the needle travels the other
// way, so the instructions apply to the columns in reverse order, and a knit stitch made
// from the WS shows as a bump on the RS.
function knitRow(stitches, instructions, rightSide) {
  if (instructions.length !== stitches) throw new Error(`row has ${instructions.length} instructions for ${stitches} stitches`);
  const row = new Array(stitches);
  instructions.forEach((st, i) => {
    const col = rightSide ? i : stitches - 1 - i;
    const knitOnRS = rightSide ? st === 'k' : st === 'p';
    row[col] = knitOnRS ? 'V' : '-';
  });
  return row;
}

// "k2, p2, k2, p2 … end with k2"
function ribRow(stitches, [knit, purl], startWith) {
  const unit = startWith === 'k' ? [...Array(knit).fill('k'), ...Array(purl).fill('p')] : [...Array(purl).fill('p'), ...Array(knit).fill('k')];
  return Array.from({ length: stitches }, (_, i) => unit[i % unit.length]);
}

const columns = (fabric) => fabric[0].map((_, c) => fabric.map((row) => row[c]).join(''));

// ---------- Projects ----------
console.log('\nProjets de départ');
for (const s of STARTERS) {
  const k = s.knit;
  console.log(` ${s.emoji} ${s.fr.name}`);
  ok(s.fr.steps.join(' ').includes(String(k.castOn)) && s.ar.steps.join(' ').includes(String(k.castOn)),
    `${k.castOn} mailles à monter, écrit en français et en arabe`);

  if (s.id === 'dishcloth') {
    // Garter stitch: every row knit. Seen from the RS, rows alternate V and bumps = ridges.
    const fabric = [];
    for (let r = 0; r < k.rows; r++) fabric.push(knitRow(k.castOn, Array(k.castOn).fill('k'), r % 2 === 0));
    const ridges = fabric.filter((row) => row.every((x) => x === '-')).length;
    ok(ridges === Math.floor(k.rows / 2), `point mousse : ${ridges} côtes de mousse sur ${k.rows} rangs (une tous les 2 rangs)`);
  }

  if (k.rib) {
    const [knit, purl] = k.rib;
    const unit = knit + purl;
    // Ends with the same group as the start: multiple of (k+p), plus k.
    ok(k.castOn % unit === knit, `côtes ${knit}/${purl} : ${k.castOn} = multiple de ${unit} + ${knit} (bords identiques)`);
    // Row 1 (RS): k2, p2 … end k2. Row 2 (WS): p2, k2 … end p2. Knit 20 rows.
    const fabric = [];
    for (let r = 0; r < 20; r++) {
      const rs = r % 2 === 0;
      fabric.push(knitRow(k.castOn, ribRow(k.castOn, k.rib, rs ? 'k' : 'p'), rs));
    }
    const cols = columns(fabric);
    const straight = cols.every((c) => /^V+$/.test(c) || /^-+$/.test(c));
    ok(straight, 'en suivant les rangs 1 et 2 du texte, chaque colonne reste droite (de vraies côtes)');
    const pattern = cols.map((c) => c[0]).join('');
    ok(pattern === ribRow(k.castOn, k.rib, 'k').map((x) => (x === 'k' ? 'V' : '-')).join(''),
      `colonnes vues sur l'endroit : ${pattern}`);
  }

  if (k.decrease) {
    const { repeats, firstKnit } = k.decrease;
    let n = k.castOn;
    const counts = [];
    for (let knitBefore = firstKnit; knitBefore >= 0; knitBefore--) {
      // One decrease row: (knitBefore knit, 2 together) × repeats must use every stitch.
      const used = repeats * (knitBefore + 2);
      ok(used === n, `rang « ${knitBefore} endroit, 2 ensemble » × ${repeats} utilise bien les ${n} mailles`);
      n = repeats * (knitBefore + 1);
      counts.push(n);
    }
    ok(n === repeats, `il reste ${n} mailles à serrer à la fin`);
    const text = s.fr.steps.join(' ');
    const textAr = s.ar.steps.join(' ');
    ok(counts.every((c) => text.includes(String(c))), `les nombres ${counts.join(', ')} sont dans le texte français`);
    ok(counts.every((c) => textAr.includes(String(c))), 'et dans le texte arabe');
  }

  ok(s.lessons.every((id) => LESSONS.some((l) => l.id === id)), 'toutes les leçons citées existent');
  ok(s.fr.steps.length === s.ar.steps.length && s.fr.material.length === s.ar.material.length, 'autant d’étapes en français et en arabe');
}

// ---------- Lessons and mistakes ----------
console.log('\nLeçons et erreurs');
ok(new Set(LESSONS.map((l) => l.id)).size === LESSONS.length, `${LESSONS.length} leçons, sans doublon`);
ok(LESSONS.every((l) => l.fr.steps.length === l.ar.steps.length && l.fr.tip && l.ar.tip), 'chaque leçon a ses étapes et son astuce dans les 2 langues');
ok(LESSONS.every((l) => l.term?.fr && l.term?.en), 'chaque leçon a son mot de modèle (caché jusqu’à ce qu’elle soit apprise)');
ok(MISTAKES.every((m) => !m.lesson || LESSONS.some((l) => l.id === m.lesson)), 'les erreurs renvoient vers des leçons qui existent');
ok(MISTAKES.every((m) => (m.type === 'count' ? m.fr.more && m.ar.more && m.fr.fewer && m.ar.fewer : m.fr.fix.length === m.ar.fix.length)),
  'chaque erreur a sa réparation dans les 2 langues');

console.log('\nTextes');
const missing = Object.keys(fr).filter((key) => !(key in ar)).concat(Object.keys(ar).filter((key) => !(key in fr)));
ok(missing.length === 0, `${Object.keys(fr).length} textes en français et en arabe${missing.length ? ` (manquants : ${missing.join(', ')})` : ''}`);

// ---------- YouTube ----------
if (!process.argv.includes('--offline')) {
  console.log('\nVidéos YouTube (en ligne)');
  for (const l of LESSONS) {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${l.youtube}`)}`)
      .catch((e) => ({ ok: false, status: e.message }));
    const info = res.ok ? await res.json() : null;
    ok(res.ok, `${l.fr.name} → ${info ? `${info.author_name} : ${info.title}` : `refusée (${res.status})`}`);
  }
}

console.log(failures ? `\n${failures} problème(s) trouvé(s).` : '\nTout est juste ✓');
process.exit(failures ? 1 : 0);
