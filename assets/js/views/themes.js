import { html, str, img, plural, setTitle, onColor } from '../ui.js?v=1794661478';

export function themeTile(db, t) {
  const sets = (db.setsByTheme.get(t.name) || []).filter(s => s.image && (s.image.full || s.image.hotlink)).slice(0, 4);
  const figs = (db.figsByTheme.get(t.name) || []).filter(f => f.image && (f.image.full || f.image.hotlink));
  const pics = sets.length >= 4 ? sets.map(s => ({ item: s, kind: 'set' })) : [...sets.map(s => ({ item: s, kind: 'set' })), ...figs.slice(0, 4 - sets.length).map(f => ({ item: f, kind: 'fig' }))];
  return html`<a class="tile" href="#/theme/${t.slug}" style="--tile-accent:${t.accent};--tile-ink:${onColor(t.accent)}">
    <div class="tile-head"><h3>${t.name}</h3>
      <div class="counts">${t.sets ? plural(t.sets, 'set') : ''}${t.sets && t.figs ? ' · ' : ''}${t.figs ? plural(t.figs, 'minifig') : ''}</div></div>
    ${pics.length ? html`<div class="montage">${pics.map(p => img({ item: p.item, kind: p.kind, alt: '' }))}</div>` : ''}
  </a>`;
}

export function render(root, { db }) {
  setTitle('Themes');
  root.innerHTML = str(html`<section class="page fade-in">
    <header class="page-head"><div><h1>Themes</h1><p class="muted">${plural(db.themes.length, 'theme')} across sets and minifigs. Theme names follow Rebrickable's catalog; loose figs without a catalog ID get a theme inferred from their name.</p></div></header>
    <div class="tiles">${db.themes.map(t => themeTile(db, t))}</div>
  </section>`);
}
