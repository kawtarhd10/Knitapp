// Small drawings of knitted stitches (rows of "V"), to compare with her own knitting.
const YARN = '#d98d68';
const YARN_DARK = '#9c4f2c';
const W = 26; // stitch width
const H = 20; // row height

function leg(x, y, angle) {
  return `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="10" transform="rotate(${angle} ${x} ${y})" fill="${YARN}" stroke="${YARN_DARK}" stroke-width="1.5"/>`;
}

function v(cx, cy) {
  return leg(cx - 5.5, cy, -28) + leg(cx + 5.5, cy, 28);
}

function x(cx, cy) {
  // Twisted stitch: the two legs cross.
  return leg(cx + 1, cy, -28) + leg(cx - 1, cy, 28);
}

function grid(cols, rows, draw, offsetX = 0) {
  let out = '';
  for (let r = 0; r < rows; r++) {
    const n = typeof cols === 'function' ? cols(r) : cols;
    const startX = offsetX + (7 - n) * (W / 2);
    for (let c = 0; c < n; c++) {
      out += draw(c, r, startX + W / 2 + c * W, 16 + r * H);
    }
  }
  return out;
}

function svg(content, label) {
  return `<svg viewBox="0 0 ${7 * W} ${6 * H + 12}" role="img" aria-label="${label}" class="knit-pic">${content}</svg>`;
}

const drawings = {
  ok: () => grid(7, 6, (c, r, cx, cy) => v(cx, cy)),

  ladder: () => {
    const col = 3;
    let out = grid(7, 6, (c, r, cx, cy) => (c === col && r < 5 ? '' : v(cx, cy)));
    // Horizontal bars where the stitch fell, and the loose stitch at the bottom.
    const cx = W / 2 + col * W;
    for (let r = 0; r < 5; r++) {
      out += `<line x1="${cx - 11}" y1="${12 + r * H}" x2="${cx + 11}" y2="${12 + r * H}" stroke="${YARN_DARK}" stroke-width="3" stroke-linecap="round"/>`;
    }
    return out;
  },

  twisted: () => grid(7, 6, (c, r, cx, cy) => (c === 3 && r >= 1 && r <= 4 ? x(cx, cy) : v(cx, cy))),

  hole: () => {
    let out = grid(7, 6, (c, r, cx, cy) => (c === 3 && r === 2 ? '' : v(cx, cy)));
    const cx = W / 2 + 3 * W;
    const cy = 16 + 2 * H;
    out += `<circle cx="${cx}" cy="${cy}" r="8" fill="#3a2a22" opacity="0.85"/>`;
    return out;
  },

  // Rows get wider towards the top (extra stitches).
  extra: () => {
    const narrowW = 0.82;
    let out = '';
    for (let r = 0; r < 6; r++) {
      const n = r < 2 ? 8 : r < 4 ? 7 : 6; // top rows have more stitches
      const w = W * narrowW;
      const startX = (7 * W - n * w) / 2;
      for (let c = 0; c < n; c++) {
        const cx = startX + w / 2 + c * w;
        const cy = 16 + r * H;
        out += `<g transform="translate(${cx} ${cy}) scale(${narrowW} 1) translate(${-cx} ${-cy})">${v(cx, cy)}</g>`;
      }
    }
    return out;
  },

  // Edges rolling towards the back.
  curl: () => {
    let out = grid(5, 6, (c, r, cx, cy) => v(cx, cy), 0);
    const roll = (x0) => `<rect x="${x0}" y="4" width="22" height="${6 * H}" rx="11" fill="${YARN}" stroke="${YARN_DARK}" stroke-width="1.5"/>`
      + `<rect x="${x0 + 6}" y="8" width="5" height="${6 * H - 8}" rx="2.5" fill="#fff" opacity="0.35"/>`;
    out += roll(4) + roll(7 * W - 26);
    return out;
  },
};

export function knitPicture(name, label = '') {
  return svg((drawings[name] || drawings.ok)(), label);
}
