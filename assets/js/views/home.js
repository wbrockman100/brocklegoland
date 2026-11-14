import { html, str, raw, img, plural, fmtNum, fmtDate, setTitle } from '../ui.js?v=1794661478';
import { recentSets, sortFigs } from '../store.js?v=1794661478';
import { setCard } from './sets.js?v=1794661478';
import { figCard } from './figs.js?v=1794661478';
import { themeTile } from './themes.js?v=1794661478';
import { wishBrick } from './wishlist.js?v=1794661478';
import { pictureFor } from '../pictures.js?v=1794661478';
import { bigFigs, bigFigCard } from './bigfigs.js?v=1794661478';

const hasImg = x => x.image && (x.image.full || x.image.thumb || x.image.hotlink);
const STUDS = raw('<span class="studs" aria-hidden="true"><i></i><i></i><i></i><i></i></span>');

// One bar per release year; each bar links to the sets from that year.
function yearBars(db) {
  const counts = new Map();
  for (const s of db.sets) if (s.year) counts.set(s.year, (counts.get(s.year) || 0) + 1);
  if (!counts.size) return '';
  const lo = Math.min(...counts.keys()), hi = Math.max(...counts.keys()), max = Math.max(...counts.values());
  const bars = [];
  for (let y = lo, i = 0; y <= hi; y++, i++) {
    const n = counts.get(y) || 0;
    bars.push(n
      ? html`<a style="--h:${Math.max(14, Math.round(n / max * 100))}%;--i:${i}" href="#/sets?yearMin=${y}&yearMax=${y}&sort=pieces" title="${y}: ${plural(n, 'set')}" aria-label="${y}: ${plural(n, 'set')}"></a>`
      : html`<a class="zero" style="--i:${i}" title="${y}: none"></a>`);
  }
  return html`<div class="ybars" role="group" aria-label="Sets by release year, ${lo} to ${hi}">${bars}</div>
    <div class="axis"><span>${lo}</span><span>sets by release year</span><span>${hi}</span></div>`;
}

// How many sets fall in each size band: a four-bar chart with the count on top and the band underneath.
const BANDS = [['under 250', '<250', 0, 250], ['250–999', '<1k', 250, 1000], ['1k–2.9k', '<3k', 1000, 3000], ['3k and up', '3k+', 3000, Infinity]];
function sizeBands(db) {
  const sized = db.sets.filter(s => s.pieces);
  const rows = BANDS.map(([label, short, lo, hi]) => ({ label, short, n: sized.filter(s => s.pieces >= lo && s.pieces < hi).length }));
  const max = Math.max(...rows.map(r => r.n), 1);
  return html`<div class="bands" role="group" aria-label="Sets by number of pieces">${rows.map(r =>
    html`<div title="${r.label} pieces: ${plural(r.n, 'set')}"><b>${fmtNum(r.n)}</b><i style="height:${Math.max(4, Math.round(r.n / max * 30))}px"></i><span class="long">${r.label}</span><span class="short" aria-hidden="true">${r.short}</span></div>`)}</div>`;
}

// A running band of theme names. The second copy only exists to make the loop seamless.
function ticker(db) {
  const items = db.themes.filter(t => t.name !== 'Other').slice(0, 26);
  if (items.length < 6) return '';
  const run = copy => html`<div class="ticker-run" ${copy ? raw('aria-hidden="true"') : ''}>${items.map(t =>
    html`<a href="#/theme/${t.slug}" ${copy ? raw('tabindex="-1"') : ''}><i style="--c:${t.accent}"></i>${t.name}</a>`)}</div>`;
  return html`<nav class="ticker" aria-label="Themes in the collection">${run(false)}${run(true)}</nav>`;
}

// Numbers count up once when the board appears; they are already correct in the markup.
function countUp(root) {
  const els = [...root.querySelectorAll('[data-count]')];
  if (!els.length) return;
  const finalize = () => els.forEach(el => { el.textContent = fmtNum(+el.dataset.count); });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) { finalize(); return; }
  const t0 = performance.now(), dur = 1100;
  const step = now => {
    const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    els.forEach(el => { el.textContent = fmtNum(Math.round(+el.dataset.count * e)); });
    if (p < 1 && root.isConnected) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  setTimeout(() => { if (root.isConnected) finalize(); }, dur + 700);
}

// The catchphrases that take turns in the headline. Each is two lines; [text, color] parts become stickers.
function shouts(c, pieces) {
  return [
    [['Welcome to ', ['Brickland.', 'red']], ['Population: ', [fmtNum(c.figUnits) + '.', 'yellow']]],
    [['Built ', ['brick', 'yellow']], ['by ', ['Brock.', 'red']]],
    [[[fmtNum(pieces), 'blue'], ' bricks.'], ['Zero stepped on. ', ['Yet.', 'red']]],
    [['It’s not ', ['hoarding', 'red']], ['if it’s ', ['sorted.', 'green']]],
    [['Just one ', ['more set.', 'yellow']], ['Then I’m ', ['done.', 'red']]],
    [[['Brock', 'red'], ' solid.'], ['Brick by ', ['brick.', 'yellow']]],
    [['No instructions.'], ['No ', ['regrets.', 'green']]],
  ];
}
const shoutHtml = lines => html`${lines.map(parts => html`<span class="ln">${parts.map(p => (Array.isArray(p) ? html`<span class="hl ${p[1]}">${p[0]}</span>` : p))}</span>`)}`;

const treetops = (TOPS, outline) => `<svg class="valley-tops" viewBox="0 0 2200 104" aria-hidden="true" style="--tops-line:${outline}">
  <defs><clipPath id="valley-tops-clip"><path d="${TOPS.left}"/><path d="${TOPS.right}"/><rect y="100" width="2200" height="4"/></clipPath></defs>
  <g clip-path="url(#valley-tops-clip)"><image width="2200" height="943" preserveAspectRatio="none" transform="translate(0,108) scale(1,-1)"/></g>
  ${TOPS.lines.map(d => `<path d="${d}"/>`).join('')}</svg>`;

// Swap the headline every few seconds; the button steps through by hand. Stops when the page is left.
function runShouts(root, list) {
  const h1 = root.querySelector('#shout'), next = root.querySelector('#shout-next');
  if (!h1 || list.length < 2) return;
  let i = 0, timer = null;
  const show = n => { i = (n + list.length) % list.length; h1.innerHTML = str(shoutHtml(list[i])); };
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const arm = () => {
    clearInterval(timer);
    if (still) return;
    timer = setInterval(() => {
      if (!root.isConnected || !h1.isConnected) { clearInterval(timer); return; }
      if (document.hidden || h1.matches(':hover')) return;
      show(i + 1);
    }, 6000);
  };
  if (next) next.addEventListener('click', () => { show(i + 1); arm(); });
  arm();
}

export function render(root, { db }) {
  setTitle('');
  const c = db.meta.counts;
  const recent = recentSets(db, 12);
  const topThemes = db.themes.filter(t => t.sets || t.figs > 5).slice(0, 8);
  const biggest = [...db.sets].filter(s => s.pieces).sort((a, b) => b.pieces - a.pieces)[0];
  const newest = recent[0];
  const withImg = db.figs.filter(f => hasImg(f) && f.kind === 'catalog');
  const highlights = sortFigs(withImg, 'qty', 'desc').slice(0, 14);
  const pieces = db.sets.reduce((a, s) => a + (s.pieces || 0) * s.copies, 0);
  const leaders = db.themes.filter(t => t.name !== 'Other').slice(0, 5);
  const bigs = bigFigs(db);
  const bigUnits = bigs.reduce((a, f) => a + f.owned.total, 0);
  const bigStar = bigs.find(f => f.image && f.image.thumb && !f.image.approx) || bigs.find(hasImg);
  const lines = shouts(c, pieces);
  const wish = wishBrick(db, 4, STUDS);
  const pic = pictureFor(new Date(), new URLSearchParams(location.hash.split('?')[1] || '').get('season'));
  root.innerHTML = str(html`
    <section class="land valley" style="--sky-top:${pic.sky[0]};--sky:${pic.sky[1]}">
      <div class="land-copy">
        <div class="flex"><div class="tag"><i></i><span>Will's LEGO collection${db.meta.coverage ? html`<span class="more"> · ${db.meta.coverage}</span>` : ''}</span></div>
          <button type="button" class="chip" id="shout-next" title="Show another catchphrase">Another one ↻</button></div>
        <h1 class="shout" id="shout">${shoutHtml(lines[0])}</h1>
        <div class="hero-actions">
          <a class="btn lg primary" href="#/sets">Browse sets</a>
          <a class="btn lg yellow" href="#/minifigs">Browse minifigs</a>
          <a class="btn lg blue" href="#/bigfigs">Big figs</a>
          <a class="btn lg" href="#/themes">Themes</a>
        </div>
      </div>
      <figure class="valley-pic" id="pano">
        <div class="valley-art">
          ${raw(treetops(pic.tops, pic.outline))}
          <img id="valley-img" src="assets/img/${pic.file}.jpg" srcset="assets/img/${pic.file}.small.jpg 1100w, assets/img/${pic.file}.jpg 2200w" sizes="(max-width: 760px) 750px, (max-width: 1400px) 100vw, 1328px"
            width="2200" height="943" decoding="async" fetchpriority="high"
            alt="${pic.alt}">
        </div>
      </figure>
    </section>
    <div class="board ${wish ? 'five' : ''}" id="board">
      <div class="brick red" style="--i:0">${STUDS}
        <a class="lbl" href="#/sets">Sets</a>
        <div class="num" data-count="${c.sets}">${fmtNum(c.sets)}</div>
        <div class="sub">${fmtNum(c.setCopies)} boxes counting duplicates</div>
        ${yearBars(db)}
      </div>
      <div class="brick yellow" style="--i:1">${STUDS}
        <a class="lbl" href="#/minifigs">Minifigures</a>
        <div class="num" data-count="${c.figUnits}">${fmtNum(c.figUnits)}</div>
        <div class="sub">${fmtNum(c.figs)} different figures</div>
        <div class="split" role="img" aria-label="${fmtNum(c.looseFigUnits)} loose, ${fmtNum(c.inSetFigUnits)} inside sets"><i style="--w:${c.looseFigUnits}"></i><i style="--w:${c.inSetFigUnits}"></i></div>
        <div class="legend">
          <a href="#/minifigs?source=loose"><i style="--c:#111"></i>${fmtNum(c.looseFigUnits)} loose</a>
          <a href="#/minifigs?source=sets"><i style="--c:#fff"></i>${fmtNum(c.inSetFigUnits)} inside sets</a>
        </div>
      </div>
      <div class="brick blue" style="--i:2">${STUDS}
        <a class="lbl" href="#/sets?sort=pieces">Pieces</a>
        <div class="num" data-count="${pieces}">${fmtNum(pieces)}</div>
        <div class="sub">${c.setCopies ? `about ${fmtNum(Math.round(pieces / c.setCopies))} a box` : ''} · sets by size:</div>
        ${sizeBands(db)}
      </div>
      <div class="brick green" style="--i:3">${STUDS}
        <a class="lbl" href="#/themes">Themes</a>
        <div class="num" data-count="${c.themes}">${fmtNum(c.themes)}</div>
        <div class="sub">${leaders[0] ? `${leaders[0].name} leads` : ''}</div>
        <div class="pills">${leaders.map(t => html`<a href="#/theme/${t.slug}"><i style="--c:${t.accent}"></i>${t.name}</a>`)}</div>
      </div>
      ${wish}
    </div>
    <div class="snaps">
      ${biggest ? html`<a class="snap" style="--i:4" href="#/set/${biggest.id}">
        <span class="sticker">Biggest build</span>
        <div class="ph">${img({ item: biggest, kind: 'set', alt: biggest.name })}</div>
        <div class="cap"><div class="num">${fmtNum(biggest.pieces)} pieces</div><div class="sub">${biggest.name}</div></div>
      </a>` : ''}
      ${newest ? html`<a class="snap" style="--i:5" href="#/set/${newest.id}">
        <span class="sticker green">Newest</span>
        <div class="ph">${img({ item: newest, kind: 'set', alt: newest.name })}</div>
        <div class="cap"><div class="num">${fmtDate(newest.firstAcquired)}</div><div class="sub">${newest.name}</div></div>
      </a>` : ''}
      ${bigStar ? html`<a class="snap" style="--i:6" href="#/bigfigs">
        <span class="sticker red">Big figs</span>
        <div class="ph">${img({ item: bigStar, kind: 'fig', alt: bigStar.name })}</div>
        <div class="cap"><div class="num">${plural(bigUnits, 'big fig')}</div><div class="sub">Hulk, Thanos, the Wampa and friends</div></div>
      </a>` : ''}
    </div>
    ${ticker(db)}
    <section class="section fade-in">
      <div class="section-head"><h2>Recently added</h2><a href="#/sets?sort=acquired">All sets →</a></div>
      <div class="strip">${recent.map(s => setCard(db, s))}</div>
    </section>
    ${bigs.length ? html`<section class="section fade-in">
      <div class="section-head"><h2>Big figs</h2><a href="#/bigfigs">All ${bigs.length} big figs →</a></div>
      <div class="strip bigs">${[...bigs].sort((a, b) => (hasImg(b) ? 1 : 0) - (hasImg(a) ? 1 : 0)).slice(0, 14).map(f => bigFigCard(db, f))}</div>
    </section>` : ''}
    <section class="section fade-in">
      <div class="section-head"><h2>Themes</h2><a href="#/themes">All ${db.themes.length} themes →</a></div>
      <div class="tiles">${topThemes.map(t => themeTile(db, t))}</div>
    </section>
    ${highlights.length ? html`<section class="section fade-in">
      <div class="section-head"><h2>Most-owned minifigs</h2><a href="#/minifigs?sort=qty">All minifigs →</a></div>
      <div class="strip">${highlights.map(f => figCard(db, f))}</div>
    </section>` : ''}
  `);
  countUp(root.querySelector('#board'));
  runShouts(root, lines);
  // The treetops are the picture's own top rows, mirrored: give them whichever file the picture ended up using.
  const picEl = root.querySelector('#valley-img'), tops = root.querySelector('.valley-tops image');
  if (picEl && tops) {
    const mirror = () => tops.setAttribute('href', picEl.currentSrc || picEl.src);
    picEl.addEventListener('load', mirror);
    if (picEl.complete && picEl.naturalWidth) mirror();
  }
  // On a narrow screen the picture scrolls sideways; start it on the middle of the valley.
  const pano = root.querySelector('#pano');
  if (pano && pano.scrollWidth > pano.clientWidth) pano.scrollLeft = (pano.scrollWidth - pano.clientWidth) * 0.3;
}
