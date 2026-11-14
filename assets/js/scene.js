// Brickland in bricks: side-on LEGO builds returned as SVG strings.
// A picture is a grid of studs (COLS wide) and brick rows (ROWS high). Each feature paints cells into the grid;
// neighbouring cells of one material are then merged into bricks 1 to 6 studs long, laid in a running bond, and
// every brick whose top is open to the sky or to something farther away gets its studs.
//   sceneSvg()  the whole valley: far range, mountains, hills, castle, river, forest
//   crestSvg()  only what stands above a treeline: the castle, the peaks, the sun and a cloud
//   baseSvg()   a strip of ground for a picture to stand on, with water where its rivers run off the edge
const COLS = 64, ROWS = 16, W = 20, H = 24, TOP = 40;

const MAT = {
  sun: ['#ffd500', '#ffdf3d'], cloud: ['#ffffff', '#f3f7fb'], haze: ['#c6d4e6', '#b9c9de'], rock: ['#aab3c0', '#9aa4b3'], snow: ['#ffffff', '#eef2f7'],
  hill: ['#12994a', '#0f8a42'], grass: ['#19b45a', '#28c46a'], stone: ['#eceef2', '#dde1e8'], roof: ['#e3000b', '#c9000a'],
  win: ['#ffd500'], gate: ['#3b2b20'], leaf: ['#0b7a3b', '#0e8c45'], fir: ['#075c2c', '#096a33'], trunk: ['#8a4b1c'], water: ['#0057d9', '#1a6cf0'],
  foam: ['#cfe8ff'], boat: ['#8a4b1c'], sail: ['#ffffff'],
};

// Small seeded generator so the build looks hand-laid but comes out the same every time.
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function blank(rows) {
  const grid = Array.from({ length: rows }, () => Array(COLS).fill(null));
  const put = (x, r, m, z) => { if (x >= 0 && x < COLS && r >= 0 && r < rows) grid[r][x] = { m, z }; };
  const column = (x, from, to, m, z) => { for (let r = from; r <= to; r++) put(x, r, m, z); };
  const span = (x0, x1, r, m, z) => { for (let x = x0; x <= x1; x++) put(x, r, m, z); };
  return { grid, put, column, span };
}

// `whole` paints the valley; without it only the castle, the peaks, the sun and the cloud are painted.
function paint(whole) {
  const { grid, put, column, span } = blank(ROWS);
  // Sun, in open sky beside the peaks, and one small cloud between the castle and the highest peak.
  for (let r = 10; r < ROWS; r++) for (let x = 54; x < COLS; x++) if (Math.hypot(x - 59.5, (r - 13.4) * 1.2) <= 2.7) put(x, r, 'sun', 0);
  span(45, 48, 14, 'cloud', 1); span(46, 47, 15, 'cloud', 1);

  // A pale range far away, so the valley has a far side.
  if (whole) for (let x = 0; x < COLS; x++) {
    const top = Math.max(Math.round(7 - 0.55 * Math.abs(x - 29)), Math.round(5 - 0.5 * Math.abs(x - 16)), Math.round(6 - 0.6 * Math.abs(x - 5)));
    for (let r = 0; r < top; r++) put(x, r, 'haze', 1);
  }
  // The near mountains, with snow caps.
  const peaks = [[51, 15, 0.95], [60, 10, 0.85], [43, 10, 0.9], [55.5, 11, 1.1]];
  for (let x = 0; x < COLS; x++) {
    let top = 0, cap = 0;
    for (const [c, h, slope] of peaks) { const y = Math.round(h - slope * Math.abs(x - c)); if (y > top) { top = y; cap = h; } }
    for (let r = 0; r < top; r++) put(x, r, cap >= 10 && r >= cap - 3 ? 'snow' : 'rock', 2);
  }
  // Rolling hills behind the valley floor.
  const mid = x => (x < 28 ? Math.round(2.6 + 0.9 * Math.sin(x / 3.1)) : Math.round(5 + 1.5 * Math.sin((x - 28) / 4.5)));
  if (whole) for (let x = 0; x < COLS; x++) column(x, 0, mid(x) - 1, 'hill', 3);

  // The castle on its plateau: curtain wall, two towers, a keep, red roofs.
  const G = 4, foot = whole ? G : 0;
  for (let x = 36; x <= 45; x++) { column(x, foot, G + 3, 'stone', 4); if (x % 2 === 0) put(x, G + 4, 'stone', 4); }
  for (const x0 of [35, 44]) {
    for (let x = x0; x <= x0 + 2; x++) column(x, foot, G + 6, 'stone', 4);
    span(x0, x0 + 2, G + 7, 'roof', 4); put(x0 + 1, G + 8, 'roof', 4);
    put(x0 + 1, G + 4, 'win', 4);
  }
  for (let x = 39; x <= 42; x++) column(x, foot, G + 7, 'stone', 4);
  span(39, 42, G + 8, 'roof', 4); span(40, 41, G + 9, 'roof', 4);
  put(40, G + 5, 'win', 4); put(41, G + 5, 'win', 4); put(40, G + 3, 'win', 4);
  span(40, 41, G, 'gate', 4); span(40, 41, G + 1, 'gate', 4);
  if (!whole) return grid;

  // The valley floor in front, with the river cutting through it.
  const front = x => (x < 22 ? 2 : x < 24 ? 1 : x < 30 ? 0 : x < 32 ? 2 : x < 34 ? 3 : x < 48 ? 4 : x < 52 ? 3 : x < 58 ? 2 : 3);
  for (let x = 0; x < COLS; x++) column(x, 0, front(x) - 1, 'grass', 5);
  for (let x = 24; x < 30; x++) { put(x, 0, 'water', 5); put(x, 1, x % 3 === 1 ? 'foam' : 'water', 5); }
  put(22, 1, 'water', 5); put(23, 1, 'water', 5);
  // A little boat on the river.
  span(26, 28, 2, 'boat', 6); put(27, 3, 'sail', 6); put(27, 4, 'sail', 6);

  // Pines: a trunk and a stepped crown.
  const pine = (x, tall, back) => {
    const g = back ? mid(x) : front(x), z = back ? 3.5 : 6;
    put(x, g, 'trunk', z);
    const rows = tall ? [2, 1, 1, 0] : [1, 1, 0];
    rows.forEach((half, i) => span(x - half, x + half, g + 1 + i, back ? 'fir' : 'leaf', z));
  };
  // A darker row of firs on the hills behind, then the pines down in front.
  [[3, false], [8, false], [13, false], [17, false], [31, false], [50, true], [53, false], [59, true], [62, false]].forEach(([x, tall]) => pine(x, tall, true));
  [[1, false], [5, true], [10, false], [15, false], [20, true], [32, false], [48, false], [51, true], [56, false], [60, true], [63, false]].forEach(([x, tall]) => pine(x, tall, false));
  return grid;
}

// Turn a painted grid into bricks and studs. `x0` and `r0` crop away the left columns and the bottom rows.
function draw(grid, { x0 = 0, r0 = 0, top = TOP, seed = 11, label, cls = 'scene', flags = '' } = {}) {
  const rows = grid.length;
  const vh = rows * H + top;
  const rand = rng(seed);
  const y = r => vh - (r + 1) * H;
  const bricks = [], studs = [];
  for (let r = 0; r < rows; r++) {
    let x = 0;
    while (x < COLS) {
      const c = grid[r][x];
      if (!c) { x++; continue; }
      let end = x;
      while (end + 1 < COLS && grid[r][end + 1] && grid[r][end + 1].m === c.m && grid[r][end + 1].z === c.z) end++;
      let at = x, first = true;
      while (at <= end) {
        const left = end - at + 1;
        let len = Math.min(left, [2, 3, 4, 4, 6][Math.floor(rand() * 5)]);
        if (first && r % 2 && left > 2) len = Math.min(len, 1 + (r % 4 === 1 ? 0 : 2));  // stagger the joints row to row
        if (left - len === 1 && len > 1) len--;  // avoid leaving a lone stud at the end of a run when it can be shared
        first = false;
        const tones = MAT[c.m];
        const fill = tones[tones.length > 1 && rand() < 0.28 ? 1 : 0];
        const extra = c.m === 'cloud' ? ' cloud' : '';
        if (r >= r0 && at + len > x0) {
          bricks.push(`<rect class="bk${extra}" style="--d:${(r - r0) * 55 + Math.max(at - x0, 0) * 3}" x="${at * W}" y="${y(r)}" width="${len * W}" height="${H}" rx="2.5" fill="${fill}"/>`);
          for (let s = at; s < at + len; s++) {
            const above = r + 1 < rows ? grid[r + 1][s] : null;
            if (!above || above.z < c.z) studs.push(`<rect class="st${extra}" style="--d:${(r - r0) * 55 + Math.max(s - x0, 0) * 3}" x="${s * W + 4}" y="${y(r) - 6}" width="${W - 8}" height="7" rx="2" fill="${fill}"/>`);
          }
        }
        at += len;
      }
      x = end + 1;
    }
  }
  const box = `${x0 * W} 0 ${(COLS - x0) * W} ${vh - r0 * H}`;
  return `<svg class="${cls}" viewBox="${box}" preserveAspectRatio="xMaxYMax meet" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><g>${bricks.join('')}</g><g>${studs.join('')}</g><g class="flags">${flags}</g></svg>`;
}

// Flags on the keep and both towers (plain shapes, not bricks, so they can wave).
function castleFlags() {
  const vh = ROWS * H + TOP;
  const flag = (col, row, color) => {
    const px = col * W + W / 2, py = vh - (row + 1) * H - 6;
    return `<line x1="${px}" y1="${py}" x2="${px}" y2="${py - 30}" stroke="#111" stroke-width="3" stroke-linecap="round"/><path class="flag" d="M${px + 1} ${py - 30}h20l-6 7 6 7h-20z" fill="${color}" stroke="#111" stroke-width="2" stroke-linejoin="round"/>`;
  };
  return flag(36, 12, '#ffd500') + flag(45, 12, '#ffd500') + flag(40.5, 13, '#0057d9');
}

export function sceneSvg() {
  return draw(paint(true), { flags: castleFlags(), label: 'Brickland, built from bricks: snowy mountains, a forest, a river with a boat, and a castle on a hill' });
}

export function crestSvg() {
  return draw(paint(false), { x0: 33, r0: 2, flags: castleFlags(), cls: 'scene crest' });
}

// `rivers` are [from, to] stretches of the 64-stud width that are water instead of grass.
export function baseSvg(rivers = []) {
  const { grid, put } = blank(2);
  const wet = x => rivers.some(([a, b]) => x >= a && x <= b);
  for (let x = 0; x < COLS; x++) {
    put(x, 0, wet(x) ? 'water' : 'grass', 1);
    if (!wet(x) && (x * 7) % 11 > 3) put(x, 1, 'grass', 1);
    else if (wet(x) && x % 4 === 1) put(x, 1, 'foam', 1);
  }
  return draw(grid, { top: 8, seed: 5, cls: 'scene base' });
}
