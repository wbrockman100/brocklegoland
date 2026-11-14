import { filterFigs, sortFigs } from '../store.js?v=1794661478';
import { html, str, raw, img, badge, confidenceBadge, kindBadge, plural, fmtNum, renderChunked, setTitle, themeDot } from '../ui.js?v=1794661478';
import { setQuery, href } from '../router.js?v=1794661478';
import { fillThemeSlot } from '../banner.js?v=1794661478';
import { priceLine, usd0 } from '../money.js?v=1794661478';

export function figCard(db, f, opts = {}) {
  const o = f.owned;
  const ownedTitle = `${o.loose} loose · ${o.inSets} in sets`;
  return html`<a class="card fig" href="#/minifig/${f.key}" style="--card-accent:${themeDot(db, f.theme)}">
    <div class="img-well">${img({ item: f, kind: 'fig', alt: f.name })}
      <div class="corner">${opts.qty > 1 ? badge(`×${opts.qty} in set`, 'ink') : o.total > 1 ? badge(`×${o.total}`, 'accent', ownedTitle) : ''}</div>
      ${f.kind !== 'catalog' ? html`<div class="corner-r">${kindBadge(f.kind) || (f.kind === 'unidentified' ? badge('No ID', '', 'BrickLink ID not confirmed yet') : '')}</div>` : ''}
      ${f.image && f.image.approx ? html`<span class="approx" title="Best-guess picture matched by name; it may show a different variant">≈ best guess</span>` : ''}
    </div>
    <div class="card-body">
      <div class="card-kicker"><i class="theme-dot"></i><span>${f.blId || f.blPart || f.type}${f.theme && f.theme !== 'Other' ? ` · ${f.theme}` : ''}</span></div>
      <h3 class="card-title">${f.name}</h3>
      ${f.variant ? html`<div class="card-meta">${f.variant}</div>` : ''}
      ${priceLine(f.invest, { est: true })}
      <div class="card-badges">${f.big ? badge('Big fig', 'ink') : ''}${f.inSets.length ? badge(plural(f.inSets.length, 'set')) : ''}${o.loose ? badge(`${o.loose} loose`) : ''}${f.type !== 'Minifig' && !(f.big && f.type === 'Big fig') ? badge(f.type) : ''}</div>
    </div></a>`;
}

const SORTS = [['name', 'Name'], ['id', 'BrickLink ID'], ['theme', 'Theme'], ['qty', 'Quantity owned'], ['sets', 'Sets containing'], ['acquired', 'Newest loose purchase']];
const MONEY_SORTS = [['paid', 'Price paid (est.)'], ['value', 'Appraised value'], ['gain', 'Gain or loss']];  // private build only
const CONF = [['', 'Any identification'], ['certain', 'ID verified'], ['likely', 'ID likely'], ['guessing', 'ID guessed'], ['none', 'Unidentified']];
const KINDS = [['', 'Any kind'], ['catalog', 'BrickLink catalog figs'], ['custom', 'Custom figs'], ['lot', 'Unsorted lots'], ['unidentified', 'Named, no ID']];
const EXTRA = { set: 'In set', noimg: 'Missing image', approx: 'Best-guess picture' };

export function render(root, { db, route }) {
  setTitle('Minifigs');
  const q = route.query;
  const themes = db.themes.filter(t => t.figs).map(t => t.name);
  const sorts = db.meta.private ? [...SORTS, ...MONEY_SORTS] : SORTS;
  root.innerHTML = str(html`<section class="page fade-in">
    <header class="page-head"><div><h1>Minifigs</h1><p class="muted" id="count"></p></div></header>
    <div id="theme-pic"></div>
    <form class="toolbar" id="tb" onsubmit="return false">
      <input type="search" name="q" value="${q.q || ''}" placeholder="Filter by name, BrickLink ID or theme" aria-label="Filter minifigs">
      <select name="theme" aria-label="Theme"><option value="">All themes</option>${themes.map(t => html`<option value="${t}" ${t === q.theme ? raw('selected') : ''}>${t}</option>`)}</select>
      <select name="source" aria-label="Source"><option value="">Loose + in sets</option><option value="loose" ${q.source === 'loose' ? raw('selected') : ''}>Loose figs</option><option value="sets" ${q.source === 'sets' ? raw('selected') : ''}>Figs inside sets</option></select>
      <select name="conf" aria-label="Identification">${CONF.map(([k, l]) => html`<option value="${k}" ${k === (q.conf || '') ? raw('selected') : ''}>${l}</option>`)}</select>
      <select name="kind" aria-label="Kind">${KINDS.map(([k, l]) => html`<option value="${k}" ${k === (q.kind || '') ? raw('selected') : ''}>${l}</option>`)}</select>
      <select name="type" aria-label="Figure type"><option value="">All types</option>${db.figTypes.map(t => html`<option value="${t}" ${t === q.type ? raw('selected') : ''}>${t}</option>`)}</select>
      <select name="sort" aria-label="Sort">${sorts.map(([k, l]) => html`<option value="${k}" ${k === (q.sort || 'name') ? raw('selected') : ''}>${l}</option>`)}</select>
      <button type="button" class="btn sm ghost" name="dirbtn" title="Reverse order" aria-label="Reverse sort order">${q.dir === 'asc' ? '↑' : q.dir === 'desc' ? '↓' : '↕'}</button>
      <span class="spacer"></span>
      <button type="button" class="btn sm ghost" name="clear">Clear</button>
    </form>
    <div class="chips" id="extra"></div>
    <div id="grid" class="grid figs"></div>
  </section>`);
  const tb = root.querySelector('#tb');
  tb.addEventListener('input', e => { const t = e.target; if (!t.name || t.tagName === 'BUTTON') return; setQuery({ [t.name]: t.value }); });
  tb.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.name === 'dirbtn') { const cur = route.query.dir; setQuery({ dir: cur === 'asc' ? 'desc' : cur === 'desc' ? '' : 'asc' }); }
    else if (b.name === 'clear') { setQuery({ q: '', theme: '', source: '', conf: '', kind: '', type: '', cond: '', set: '', noimg: '', approx: '', sort: '', dir: '' }); tb.reset(); tb.querySelector('[name=q]').value = ''; }
  });
  update(root, { db, route });
}

export function update(root, { db, route }) {
  const q = route.query;
  const list = sortFigs(filterFigs(db, q), q.sort || 'name', q.dir || undefined);
  const units = list.reduce((a, f) => a + f.owned.total, 0);
  const count = root.querySelector('#count');
  if (count) count.textContent = `${plural(list.length, 'distinct figure')}${list.length !== db.figs.length ? ` of ${db.figs.length}` : ''} · ${fmtNum(units)} units${db.meta.private ? ` · ${usd0(list.reduce((a, f) => a + ((f.invest && f.invest.paid) || 0), 0))} paid for loose ones (est.)` : ''}`;
  fillThemeSlot(root.querySelector('#theme-pic'), db, q.theme, t => html`<a class="link-btn" href="#/theme/${t.slug}">Theme page →</a>`);
  const dirbtn = root.querySelector('[name=dirbtn]');
  if (dirbtn) dirbtn.textContent = q.dir === 'asc' ? '↑' : q.dir === 'desc' ? '↓' : '↕';
  const extra = root.querySelector('#extra');
  const chips = Object.keys(EXTRA).filter(k => q[k]).map(k => {
    const label = k === 'set' ? ((db.setById.get(q[k]) || {}).name || q[k]) : 'yes';
    return html`<button type="button" class="chip active" data-k="${k}">${EXTRA[k]}: ${label} ✕</button>`;
  });
  extra.innerHTML = str(chips);
  extra.querySelectorAll('button').forEach(b => b.addEventListener('click', () => setQuery({ [b.dataset.k]: '' })));
  const grid = root.querySelector('#grid');
  if (!list.length) { grid.innerHTML = str(html`<p class="empty" style="grid-column:1/-1">No minifigs match those filters. <a href="${href('minifigs')}" style="text-decoration:underline">Clear filters</a></p>`); return; }
  renderChunked(grid, list, f => figCard(db, f), 80);
}
