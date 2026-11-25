// Parts: the loose parts bought outside any set, one entry per part and colour (build/parts.py reads the catalog's
// Raw Parts tab). A card shows Rebrickable's photo when the part's name is an exact match, and otherwise a brick drawn
// in the part's own colour. The public data has nothing about prices or sellers; the private build adds `invest`.
import { html, str, raw, img, badge, plural, fmtNum, renderChunked, setTitle, shareButton } from '../ui.js?v=1795577892';
import { setQuery, href } from '../router.js?v=1795577892';
import { priceLine } from '../money.js?v=1795577892';

const KINDS = [['', 'Everything'], ['part', 'LEGO parts'], ['fig', 'Minifig parts'], ['custom', 'Custom prints'], ['bulk', 'Bulk lots']];
const KIND_LABEL = { part: 'LEGO part', fig: 'Minifig part', custom: 'Custom print', bulk: 'Bulk lot' };
// The default keeps the build's order: LEGO parts, minifig parts, custom prints, then bulk lots, each by most pieces.
const SORTS = [['', 'LEGO parts first'], ['qty', 'Most pieces'], ['name', 'Name'], ['color', 'Colour']];
const BL_SEARCH = 'https://www.bricklink.com/v2/search.page?type=P&q=';

const parts = db => (db.parts && db.parts.items) || [];
const label = p => [p.color, p.name].filter(Boolean).join(' ');

// A 2 x 4 brick in the part's colour; see-through colours are drawn see-through.
function brick(rgb, trans, x = 0, y = 0, scale = 1) {
  const fill = `#${rgb}`, op = trans ? '.55' : '1';
  return `<g transform="translate(${x} ${y}) scale(${scale})" stroke="#111" stroke-width="4" stroke-linejoin="round">
    ${[16, 40, 64, 88].map(sx => `<rect x="${sx}" y="18" width="18" height="12" rx="3" fill="${fill}" fill-opacity="${op}"/>`).join('')}
    <rect x="8" y="28" width="112" height="56" rx="7" fill="${fill}" fill-opacity="${op}"/>
    <rect x="16" y="36" width="34" height="7" rx="3.5" fill="#fff" fill-opacity=".35" stroke="none"/>
  </g>`;
}
// A printed tile for custom prints that have no colour of their own.
const tile = () => `<g stroke="#111" stroke-width="4" stroke-linejoin="round">
  <rect x="10" y="34" width="108" height="44" rx="7" fill="#fff8e7"/>
  <rect x="26" y="44" width="24" height="24" rx="4" fill="#e3000b"/><circle cx="72" cy="56" r="11" fill="#ffd500"/>
  <path d="M90 66 L100 46 L110 66 Z" fill="#0057d9"/></g>`;
export function partArt(p) {
  let body;
  if (p.kind === 'bulk') body = brick('C91A09', false, 0, 44, .62) + brick('FFD500', false, 48, 44, .62) + brick('0057D9', false, 24, 6, .62);
  else if (p.rgb) body = brick(p.rgb, p.trans);
  else body = p.kind === 'custom' ? tile() : brick('E9E1CC', false);
  return `<svg class="part-art" viewBox="0 0 128 100" role="img" aria-label="${p.color ? `${p.color} ` : ''}${KIND_LABEL[p.kind]}">${body}</svg>`;
}

export function partCard(p) {
  const linked = p.kind === 'part' || p.kind === 'fig';
  const open = linked
    ? raw(`<a class="card part ${p.kind}" href="${BL_SEARCH}${encodeURIComponent(label(p))}" target="_blank" rel="noopener" title="Find this part on BrickLink">`)
    : raw(`<div class="card part ${p.kind}">`);
  return html`${open}
    <div class="img-well">${p.image ? img({ item: p, kind: 'fig', alt: label(p) }) : raw(partArt(p))}
      ${p.qty > 1 ? html`<div class="corner">${badge(`×${fmtNum(p.qty)}`, 'accent', plural(p.qty, 'piece'))}</div>` : ''}
      ${p.kind === 'custom' ? html`<div class="corner-r">${badge('Custom', 'soft', 'Printed or made by a custom maker, not LEGO')}</div>` : ''}
    </div>
    <div class="card-body">
      <div class="card-kicker">${p.rgb ? html`<i class="color-dot" style="--dot:#${p.rgb}"></i>` : ''}<span>${p.color || KIND_LABEL[p.kind]}</span></div>
      <h3 class="card-title" title="${p.name}">${p.name}</h3>
      ${priceLine(p.invest)}
      <div class="card-badges">${p.cond ? badge(p.cond) : ''}${p.kind === 'fig' ? badge('Minifig part') : ''}${p.lots > 1 ? badge(`${p.lots} purchases`, '', 'Bought in more than one order') : ''}</div>
    </div>${raw(linked ? '</a>' : '</div>')}`;
}

function filtered(db, q) {
  const words = (q.q || '').toLowerCase().split(/\s+/).filter(Boolean);
  const list = parts(db).filter(p => (!q.kind || p.kind === q.kind) && (!q.color || p.color === q.color)
    && words.every(w => label(p).toLowerCase().includes(w)));
  const by = q.sort || '';
  const name = (a, b) => a.name.localeCompare(b.name);
  if (by === 'name') list.sort(name);
  else if (by === '') return list;
  else if (by === 'color') list.sort((a, b) => (a.color || '~').localeCompare(b.color || '~') || b.qty - a.qty || name(a, b));
  else if (by === 'qty') list.sort((a, b) => b.qty - a.qty || name(a, b));
  return list;
}

export function render(root, { db, route }) {
  setTitle('Parts');
  const all = parts(db), c = (db.parts && db.parts.counts) || {};
  if (!all.length) {
    root.innerHTML = str(html`<section class="page empty fade-in"><h1>Parts</h1><p class="muted">No loose parts are listed yet.</p></section>`);
    return;
  }
  const q = route.query;
  const colors = [...all.reduce((m, p) => (p.color ? m.set(p.color, (m.get(p.color) || 0) + p.qty) : m), new Map())].sort((a, b) => b[1] - a[1]);
  const kindCount = k => all.filter(p => !k || p.kind === k).length;
  root.innerHTML = str(html`<section class="page fade-in">
    <header class="page-head"><div><h1>Parts</h1>
      <p class="muted">Loose parts bought on their own, outside any set: ${fmtNum(c.pieces)} pieces in ${plural(c.entries, 'different part or lot', 'different parts and lots')}, in ${plural(c.colors, 'colour')}.</p></div>
      ${shareButton('parts/', 'Parts')}
    </header>
    <form class="toolbar" id="tb" onsubmit="return false">
      <input type="search" name="q" value="${q.q || ''}" placeholder="Filter by part or colour" aria-label="Filter parts">
      <div class="seg" role="group" aria-label="Kind of part">${KINDS.filter(([k]) => !k || kindCount(k)).map(([k, l]) => html`<button type="button" data-kind="${k}">${l} <small>${fmtNum(kindCount(k))}</small></button>`)}</div>
      <select name="color" aria-label="Colour"><option value="">All colours</option>${colors.map(([n, pcs]) => html`<option value="${n}" ${n === q.color ? raw('selected') : ''}>${n} (${fmtNum(pcs)})</option>`)}</select>
      <select name="sort" aria-label="Sort">${SORTS.map(([k, l]) => html`<option value="${k}" ${k === (q.sort || '') ? raw('selected') : ''}>${l}</option>`)}</select>
      <span class="spacer"></span>
      <span class="count" id="count"></span>
    </form>
    <div id="grid" class="grid parts"></div>
  </section>`);
  const tb = root.querySelector('#tb');
  tb.addEventListener('input', e => { const t = e.target; if (t.name) setQuery({ [t.name]: t.value }); });
  tb.addEventListener('click', e => { const b = e.target.closest('button[data-kind]'); if (b) setQuery({ kind: b.dataset.kind }); });
  update(root, { db, route });
}

export function update(root, { db, route }) {
  const q = route.query;
  root.querySelectorAll('.seg button[data-kind]').forEach(b => b.classList.toggle('active', b.dataset.kind === (q.kind || '')));
  const list = filtered(db, q);
  const count = root.querySelector('#count');
  if (count) count.textContent = `${plural(list.length, 'entry', 'entries')} · ${fmtNum(list.reduce((a, p) => a + p.qty, 0))} pieces`;
  const grid = root.querySelector('#grid');
  if (!list.length) { grid.innerHTML = str(html`<p class="empty" style="grid-column:1/-1">No parts match that. <a href="${href('parts')}" style="text-decoration:underline">Show them all</a></p>`); return; }
  renderChunked(grid, list, partCard, 90);
}
