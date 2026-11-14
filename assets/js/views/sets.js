import { filterSets, sortSets } from '../store.js?v=1794661478';
import { html, str, raw, img, badge, plural, fmtNum, renderChunked, setTitle, themeDot } from '../ui.js?v=1794661478';
import { setQuery, href } from '../router.js?v=1794661478';
import { fillThemeSlot } from '../banner.js?v=1794661478';
import { priceLine, usd0 } from '../money.js?v=1794661478';

export function setCard(db, s) {
  const meta = [s.pieces ? plural(s.pieces, 'piece') : null, s.figCount ? plural(s.figCount, 'fig') : null].filter(Boolean).join(' · ');
  return html`<a class="card set-card" href="#/set/${s.id}" style="--card-accent:${themeDot(db, s.theme)}">
    <div class="img-well">${img({ item: s, kind: 'set', alt: s.name })}
      ${s.copies > 1 ? html`<div class="corner">${badge(`×${s.copies}`, 'accent', `${s.copies} copies owned`)}</div>` : ''}
      ${s.status === 'incoming' ? html`<div class="corner-r">${badge('Incoming', 'warn')}</div>` : ''}
    </div>
    <div class="card-body">
      <div class="card-kicker"><i class="theme-dot"></i><span>${s.num || 'No number'} · ${s.theme}${s.year ? ` · ${s.year}` : ''}</span></div>
      <h3 class="card-title">${s.name}</h3>
      ${meta ? html`<div class="card-meta">${meta}</div>` : ''}
      ${priceLine(s.invest)}
      ${s.tags.length || s.conditions.length ? html`<div class="card-badges">${s.tags.map(t => badge(t))}${s.conditions.slice(0, 2).map(c => badge(c))}</div>` : ''}
    </div></a>`;
}

export function setRow(db, s) {
  return html`<a class="row" href="#/set/${s.id}">${img({ item: s, kind: 'set', alt: '' })}
    <div><div class="r-title">${s.name}</div><div class="r-sub">${s.num || '—'} · ${s.theme}${s.subtheme ? ` / ${s.subtheme}` : ''}${s.year ? ` · ${s.year}` : ''}${s.tags.length ? ` · ${s.tags.join(', ')}` : ''}</div></div>
    <div class="r-right">${s.pieces ? fmtNum(s.pieces) + ' pcs' : ''}${s.figCount ? html`<br>${plural(s.figCount, 'fig')}` : ''}${s.copies > 1 ? html`<br>×${s.copies}` : ''}${s.invest && s.invest.paidEach != null ? html`<br><strong>${s.invest.free ? 'free' : usd0(s.invest.paidEach)}</strong>` : ''}</div></a>`;
}

const SORTS = [['acquired', 'Newest acquired'], ['name', 'Name'], ['number', 'Set number'], ['year', 'Year'], ['pieces', 'Pieces'], ['figs', 'Minifigs'], ['copies', 'Copies']];
// Only offered in the private build, where the data carries prices.
const MONEY_SORTS = [['paid', 'Price paid'], ['value', 'Appraised value'], ['gain', 'Gain or loss']];
const EXTRA = { tag: 'Tag', status: 'Status', conf: 'ID confidence', noimg: 'Missing image', yearMin: 'From', yearMax: 'To' };

function compute(db, q) {
  return sortSets(filterSets(db, q), q.sort || 'acquired', q.dir || undefined);
}

export function render(root, { db, route }) {
  setTitle('Sets');
  const q = route.query;
  const themes = db.themes.filter(t => t.sets).map(t => t.name);
  const conds = ['New', 'Used'];
  const sorts = db.meta.private ? [...SORTS, ...MONEY_SORTS] : SORTS;
  root.innerHTML = str(html`<section class="page fade-in">
    <header class="page-head"><div><h1>Sets</h1><p class="muted" id="count"></p></div></header>
    <div id="theme-pic"></div>
    <form class="toolbar" id="tb" onsubmit="return false">
      <input type="search" name="q" value="${q.q || ''}" placeholder="Filter by name, number or theme" aria-label="Filter sets">
      <select name="theme" aria-label="Theme"><option value="">All themes</option>${themes.map(t => html`<option value="${t}" ${t === q.theme ? raw('selected') : ''}>${t}</option>`)}</select>
      <select name="cond" aria-label="Condition"><option value="">Any condition</option>${conds.map(c => html`<option value="${c}" ${c === q.cond ? raw('selected') : ''}>${c}</option>`)}</select>
      <select name="sort" aria-label="Sort">${sorts.map(([k, l]) => html`<option value="${k}" ${k === (q.sort || 'acquired') ? raw('selected') : ''}>${l}</option>`)}</select>
      <button type="button" class="btn sm ghost" name="dirbtn" title="Reverse order" aria-label="Reverse sort order">${q.dir === 'asc' ? '↑' : q.dir === 'desc' ? '↓' : '↕'}</button>
      <label class="check"><input type="checkbox" name="figs" ${q.figs ? raw('checked') : ''}> Has minifigs</label>
      <label class="check"><input type="checkbox" name="gwp" ${q.gwp ? raw('checked') : ''}> GWP only</label>
      <span class="spacer"></span>
      <div class="seg" role="group" aria-label="View"><button type="button" data-view="grid" class="${q.view !== 'list' ? 'active' : ''}">Grid</button><button type="button" data-view="list" class="${q.view === 'list' ? 'active' : ''}">List</button></div>
      <button type="button" class="btn sm ghost" name="clear">Clear</button>
    </form>
    <div class="chips" id="extra"></div>
    <div id="grid"></div>
  </section>`);
  const tb = root.querySelector('#tb');
  tb.addEventListener('input', e => {
    const t = e.target;
    if (!t.name || t.name === 'dirbtn' || t.name === 'clear') return;
    setQuery({ [t.name]: t.type === 'checkbox' ? (t.checked ? '1' : '') : t.value });
  });
  tb.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.name === 'dirbtn') { const cur = route.query.dir; setQuery({ dir: cur === 'asc' ? 'desc' : cur === 'desc' ? '' : 'asc' }); }
    else if (b.name === 'clear') { setQuery({ q: '', theme: '', cond: '', figs: '', gwp: '', tag: '', status: '', conf: '', noimg: '', yearMin: '', yearMax: '', sort: '', dir: '' }); tb.reset(); tb.querySelector('[name=q]').value = ''; }
    else if (b.dataset.view) setQuery({ view: b.dataset.view === 'grid' ? '' : b.dataset.view });
  });
  update(root, { db, route });
}

export function update(root, { db, route }) {
  const q = route.query;
  const list = compute(db, q);
  const count = root.querySelector('#count');
  if (count) count.textContent = `${plural(list.length, 'set')}${list.length !== db.sets.length ? ` of ${db.sets.length}` : ''} · ${fmtNum(list.reduce((a, s) => a + s.copies, 0))} copies${db.meta.private ? ` · ${usd0(list.reduce((a, s) => a + ((s.invest && s.invest.paid) || 0), 0))} paid` : ''}`;
  fillThemeSlot(root.querySelector('#theme-pic'), db, q.theme, t => html`<a class="link-btn" href="#/theme/${t.slug}">Theme page →</a>`);
  const dirbtn = root.querySelector('[name=dirbtn]');
  if (dirbtn) dirbtn.textContent = q.dir === 'asc' ? '↑' : q.dir === 'desc' ? '↓' : '↕';
  root.querySelectorAll('.seg button').forEach(b => b.classList.toggle('active', (b.dataset.view === 'list') === (q.view === 'list')));
  const extra = root.querySelector('#extra');
  const chips = Object.keys(EXTRA).filter(k => q[k]).map(k => html`<button type="button" class="chip active" data-k="${k}">${EXTRA[k]}: ${q[k]} ✕</button>`);
  extra.innerHTML = str(chips);
  extra.querySelectorAll('button').forEach(b => b.addEventListener('click', () => setQuery({ [b.dataset.k]: '' })));
  const grid = root.querySelector('#grid');
  grid.className = q.view === 'list' ? 'list' : 'grid';
  if (!list.length) { grid.innerHTML = str(html`<p class="empty">No sets match those filters. <a href="${href('sets')}" style="text-decoration:underline">Clear filters</a></p>`); return; }
  renderChunked(grid, list, s => (q.view === 'list' ? setRow(db, s) : setCard(db, s)), 60);
}
