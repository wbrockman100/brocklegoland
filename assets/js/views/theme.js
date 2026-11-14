import { html, str, plural, fmtNum, setTitle, notFound, renderChunked, shareButton, onColor } from '../ui.js?v=1794661478';
import { sortSets, sortFigs } from '../store.js?v=1794661478';
import { setCard } from './sets.js?v=1794661478';
import { figCard } from './figs.js?v=1794661478';
import { themeBanner } from '../banner.js?v=1794661478';

export function render(root, { db, route }) {
  const t = db.themeBySlug.get(route.params.slug);
  if (!t) { setTitle('Theme not found'); root.innerHTML = str(notFound(`Theme “${route.params.slug}”`)); return; }
  setTitle(t.name);
  const sets = sortSets(db.setsByTheme.get(t.name) || [], 'year', 'desc');
  const figs = sortFigs(db.figsByTheme.get(t.name) || [], 'qty', 'desc');
  const units = figs.reduce((a, f) => a + f.owned.total, 0);
  const pieces = sets.reduce((a, s) => a + (s.pieces || 0) * s.copies, 0);
  const years = sets.filter(s => s.year).map(s => s.year);
  const facts = `${sets.length ? plural(sets.length, 'set') : 'No sets'}${pieces ? ` · ${fmtNum(pieces)} pieces` : ''}${years.length ? ` · ${Math.min(...years)}–${Math.max(...years)}` : ''}${figs.length ? ` · ${plural(figs.length, 'distinct minifig')} (${fmtNum(units)} units)` : ''}`;
  root.innerHTML = str(html`<article class="fade-in" style="--tile-accent:${t.accent};--tile-ink:${onColor(t.accent)}">
    <nav class="crumbs"><a href="#/themes">Themes</a> › <span>${t.name}</span></nav>
    ${themeBanner(t, { sub: facts, right: shareButton(`theme/${t.slug}/`, t.name) }) || html`<div class="theme-banner">
      <div class="flex"><h1>${t.name}</h1><span class="right">${shareButton(`theme/${t.slug}/`, t.name)}</span></div>
      <p class="muted" style="margin:12px 0 0">${facts}</p>
    </div>`}
    ${sets.length ? html`<section class="section"><div class="section-head"><h2>Sets</h2><a href="#/sets?theme=${encodeURIComponent(t.name)}">Filter & sort →</a></div><div class="grid">${sets.map(s => setCard(db, s))}</div></section>` : ''}
    ${figs.length ? html`<section class="section"><div class="section-head"><h2>Minifigs</h2><a href="#/minifigs?theme=${encodeURIComponent(t.name)}">Filter & sort →</a></div><div class="grid figs" id="tfigs"></div></section>` : ''}
  </article>`);
  const grid = root.querySelector('#tfigs');
  if (grid) renderChunked(grid, figs, f => figCard(db, f), 80);
}
