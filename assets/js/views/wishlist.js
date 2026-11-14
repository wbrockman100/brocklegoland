// The wish list: sets, minifigs, custom builds and loose parts that are still wanted, and what has been crossed off.
// The data comes from the catalog's three Wishlist tabs (build/wishlist.py). Prices and notes exist only in the
// private build, as `valuation` and `notes`; the public build never receives them.
import { html, str, raw, img, badge, plural, fmtNum, setTitle, shareButton } from '../ui.js?v=1794661478';
import { setQuery } from '../router.js?v=1794661478';
import { usd0 } from '../money.js?v=1794661478';

const OPEN = new Set(['wanted', 'partial']);
const isOpen = x => OPEN.has(x.state);
const outLink = url => raw(`href="${url}" target="_blank" rel="noopener"`);
const retiredYear = s => { const m = /\d{4}/.exec(s.retired || ''); return m ? m[0] : null; };
// Private build only: what the list's research says the thing goes for.
const moneyLine = v => (v ? html`<div class="card-price"><span>${[v.used != null ? `Used ≈ ${usd0(v.used)}` : '', v.new != null ? `New ≈ ${usd0(v.new)}` : '',
  v.zone != null ? `Aim ${usd0(v.zone)}` : '', v.max != null ? `Max ${usd0(v.max)}` : ''].filter(Boolean).join(' · ')}</span></div>` : '');

export function wishSetCard(s) {
  const meta = [s.pieces ? plural(s.pieces, 'piece') : null, s.figCount ? plural(s.figCount, 'fig') : null].filter(Boolean).join(' · ');
  const year = retiredYear(s);
  return html`<a class="card set-card wish" ${s.inCollection ? raw(`href="#/set/${s.id}"`) : outLink(s.links.bricklink)} style="--card-accent:${s.accent}"
      title="${s.inCollection ? 'Now in the collection' : 'Opens this set on BrickLink'}">
    <div class="img-well">${img({ item: s, kind: 'set', alt: s.name })}
      ${s.state === 'partial' ? html`<div class="corner-r">${badge('Partly here', 'warn', 'Some of this set is already on hand')}</div>` : ''}
      ${s.state === 'owned' ? html`<div class="corner-r">${badge('Got it', 'ok')}</div>` : ''}
    </div>
    <div class="card-body">
      <div class="card-kicker"><i class="theme-dot"></i><span>${s.num} · ${s.theme}${s.year ? ` · ${s.year}` : ''}</span></div>
      <h3 class="card-title">${s.name}</h3>
      ${meta ? html`<div class="card-meta">${meta}</div>` : ''}
      ${moneyLine(s.valuation)}
      ${year ? html`<div class="card-badges">${badge(`Retired ${year}`)}</div>` : ''}
    </div></a>`;
}

export function wishFigCard(f) {
  return html`<a class="card fig wish" ${outLink(f.links.bricklink)} style="--card-accent:${f.accent}" title="Opens this figure on BrickLink">
    <div class="img-well">${img({ item: f, kind: 'fig', alt: f.name })}
      ${f.state === 'owned' ? html`<div class="corner-r">${badge('Got it', 'ok')}</div>` : ''}
      ${f.state === 'covered' ? html`<div class="corner-r">${badge('In a pack', 'ok', 'Comes with a pack that is already bought')}</div>` : ''}
    </div>
    <div class="card-body">
      <div class="card-kicker"><i class="theme-dot"></i><span>${f.blId}${f.theme && f.theme !== 'Other' ? ` · ${f.theme}` : ''}</span></div>
      <h3 class="card-title">${f.name}</h3>
      ${moneyLine(f.valuation)}
      ${isOpen(f) && f.cond && f.cond !== 'any' ? html`<div class="card-badges">${badge(f.cond)}</div>` : ''}
    </div></a>`;
}

const buildTile = b => html`<div class="tile wish-build">
  <h3>${b.name}</h3>
  <p class="muted">${b.pieces ? `${fmtNum(b.pieces)} pieces to gather` : 'Parts list in progress'}${b.lots ? ` · ${fmtNum(b.lots)} different parts` : ''}</p>
</div>`;

export function render(root, { db, route }) {
  setTitle('Wish list');
  const w = db.wishlist || { sets: [], figs: [], builds: [], parts: [], boxes: [], counts: {} };
  const sets = w.sets.filter(isOpen), figs = w.figs.filter(isOpen);
  const found = [...w.sets.filter(s => !isOpen(s)).map(wishSetCard), ...w.figs.filter(f => !isOpen(f)).map(wishFigCard)];
  if (!sets.length && !figs.length && !w.builds.length && !found.length) {
    root.innerHTML = str(html`<section class="page empty fade-in"><h1>Wish list</h1><p class="muted">Nothing is on the wish list right now.</p></section>`);
    return;
  }
  // Theme chips, biggest group first.
  const byTheme = new Map();
  sets.forEach(s => byTheme.set(s.theme, { n: (byTheme.get(s.theme) || { n: 0 }).n + 1, accent: s.accent }));
  const themes = [...byTheme].sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0]));
  const pick = byTheme.has(route.query.theme) ? route.query.theme : '';
  const shown = sets.filter(s => !pick || s.theme === pick)
    .sort((a, b) => (byTheme.get(b.theme).n - byTheme.get(a.theme).n) || a.theme.localeCompare(b.theme) || (a.year || 0) - (b.year || 0));
  const summary = [sets.length ? plural(sets.length, 'set') : '', figs.length ? plural(figs.length, 'minifig') : '',
    w.builds.length ? plural(w.builds.length, 'custom build') : ''].filter(Boolean).join(', ');
  root.innerHTML = str(html`<section class="page fade-in">
    <header class="page-head"><div><h1>Wish list</h1>
      <p class="muted">Still looking for ${summary}.${found.length ? ` ${fmtNum(found.length)} already crossed off.` : ''}</p></div>
      ${shareButton('wishlist/', 'Wish list')}
    </header>
    ${sets.length ? html`<section class="section">
      <div class="section-head"><h2>Sets</h2></div>
      ${themes.length > 1 ? html`<div class="chips" id="wish-themes">
        <button type="button" class="chip ${pick ? '' : 'active'}" data-theme="">All <small>${fmtNum(sets.length)}</small></button>
        ${themes.map(([name, t]) => html`<button type="button" class="chip ${pick === name ? 'active' : ''}" data-theme="${name}" style="--chip-accent:${t.accent}"><i class="dot"></i>${name} <small>${fmtNum(t.n)}</small></button>`)}
      </div>` : ''}
      <div class="grid">${shown.map(wishSetCard)}</div>
    </section>` : ''}
    ${figs.length ? html`<section class="section">
      <div class="section-head" style="--stud:var(--yellow)"><h2>Minifigs</h2></div>
      <div class="grid figs">${figs.map(wishFigCard)}</div>
    </section>` : ''}
    ${w.builds.length ? html`<section class="section">
      <div class="section-head" style="--stud:var(--blue)"><h2>Custom builds</h2><a href="#/builds">Ideas and concept pictures →</a></div>
      <p class="muted wish-note">Our own builds, not sets. These are the ones we are gathering parts for.</p>
      <div class="tiles">${w.builds.map(buildTile)}</div>
    </section>` : ''}
    ${w.parts.length || w.boxes.length ? html`<section class="section">
      <div class="section-head" style="--stud:var(--green)"><h2>Loose parts and boxes</h2></div>
      <ul class="wish-parts">
        ${w.parts.map(p => html`<li><a ${outLink(p.link)}>${p.name}</a><span class="muted">${[p.color, p.qty > 1 ? `×${p.qty}` : '', p.id].filter(Boolean).join(' · ')}</span></li>`)}
        ${w.boxes.map(b => html`<li><span>${b.name}</span><span class="muted">${[b.cond, b.qty > 1 ? `×${b.qty}` : '', b.item].filter(Boolean).join(' · ')}</span></li>`)}
      </ul>
    </section>` : ''}
    ${found.length ? html`<section class="section">
      <div class="section-head" style="--stud:#111"><h2>Crossed off</h2></div>
      <div class="grid figs wish-found">${found}</div>
    </section>` : ''}
  </section>`);
  const chips = root.querySelector('#wish-themes');
  if (chips) chips.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) setQuery({ theme: b.dataset.theme });
  });
}

// The box on the home page, next to Themes. `studs` is the home page's stud strip.
export function wishBrick(db, i, studs) {
  const c = (db.wishlist && db.wishlist.counts) || {};
  if (!c.sets && !c.figs && !c.builds) return '';
  const top = (db.wishlist.sets || []).filter(isOpen).reduce((m, s) => m.set(s.theme, { n: (m.get(s.theme) || { n: 0 }).n + 1, accent: s.accent }), new Map());
  const leaders = [...top].sort((a, b) => b[1].n - a[1].n).slice(0, 4);
  return html`<div class="brick orange" style="--i:${i}">${studs}
    <a class="lbl" href="#/wishlist">Wish list</a>
    <div class="num" data-count="${c.sets || 0}">${fmtNum(c.sets || 0)}</div>
    <div class="sub">sets still wanted${c.figs ? `, plus ${plural(c.figs, 'minifig')}` : ''}${c.builds ? ` and ${plural(c.builds, 'custom build')}` : ''}</div>
    <div class="pills">${leaders.map(([name, t]) => html`<a href="#/wishlist?theme=${encodeURIComponent(name)}"><i style="--c:${t.accent}"></i>${name}</a>`)}</div>
  </div>`;
}
