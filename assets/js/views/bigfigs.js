// Big figs: the oversized figures (Hulk, Thanos, Wampa, the trolls...) and the Jurassic dinosaurs, loose or still boxed
// inside a set. The build marks them with `big: true` and the dinosaurs with type 'Dinosaur' (build/bigfigs.py).
import { html, str, img, badge, plural, fmtNum, setTitle, themeDot } from '../ui.js?v=1794661478';
import { setQuery } from '../router.js?v=1794661478';
import { priceLine } from '../money.js?v=1794661478';

// Ones with a picture come first, then by name.
const pictured = f => (f.image && (f.image.full || f.image.thumb || f.image.hotlink) ? 0 : 1);
export const bigFigs = db => db.figs.filter(f => f.big).sort((a, b) => pictured(a) - pictured(b) || a.name.localeCompare(b.name));

export function bigFigCard(db, f) {
  const o = f.owned;
  const sets = f.inSets.map(i => ({ ...i, set: db.setById.get(i.setId) })).filter(x => x.set);
  return html`<a class="card fig big" href="#/minifig/${f.key}" style="--card-accent:${themeDot(db, f.theme)}">
    <div class="img-well">${img({ item: f, kind: 'fig', alt: f.name })}
      ${o.total > 1 ? html`<div class="corner">${badge(`×${o.total}`, 'accent', `${o.loose} loose · ${o.inSets} in sets`)}</div>` : ''}
      ${f.kind === 'custom' ? html`<div class="corner-r">${badge('Custom', 'soft', 'Third-party custom figure')}</div>` : ''}
      ${f.image && f.image.approx ? html`<span class="approx" title="Best-guess picture matched by name; it may show a different variant">≈ best guess</span>` : ''}
    </div>
    <div class="card-body">
      <div class="card-kicker"><i class="theme-dot"></i><span>${f.blId || f.blPart || 'Big fig'}${f.theme && f.theme !== 'Other' ? ` · ${f.theme}` : ''}</span></div>
      <h3 class="card-title">${f.name}</h3>
      ${priceLine(f.invest, { est: true })}
      <ul class="where">
        ${o.loose ? html`<li class="loose"><b>Loose</b><span>${o.loose > 1 ? `${o.loose} of them` : 'out of the box'}</span></li>` : ''}
        ${sets.map(x => html`<li class="boxed"><b>In a set</b><span>${x.set.num ? `${x.set.num} ` : ''}${x.set.name}${x.qtyPerSet * x.copies > 1 ? ` ×${x.qtyPerSet * x.copies}` : ''}</span></li>`)}
      </ul>
    </div></a>`;
}

const WHERE = [['', 'All'], ['loose', 'Loose'], ['sets', 'In a set']];
const KINDS = [['', 'Everything'], ['figs', 'Figures'], ['dinos', 'Dinosaurs']];
const isDino = f => f.type === 'Dinosaur';
const pick = (list, where) => list.filter(f => (where === 'loose' ? f.owned.loose > 0 : where === 'sets' ? f.owned.inSets > 0 : true));
const pickKind = (list, kind) => list.filter(f => (kind === 'dinos' ? isDino(f) : kind === 'figs' ? !isDino(f) : true));

export function render(root, { db, route }) {
  setTitle('Big figs');
  const all = bigFigs(db);
  const loose = all.reduce((a, f) => a + f.owned.loose, 0), boxed = all.reduce((a, f) => a + f.owned.inSets, 0);
  const dinos = all.filter(isDino).reduce((a, f) => a + f.owned.total, 0);
  root.innerHTML = str(html`<section class="page fade-in">
    <header class="page-head"><div><h1>Big figs</h1>
      <p class="muted">The oversized ones: Hulk, Thanos, the Wampa, the trolls, and the Jurassic dinosaurs. ${fmtNum(loose + boxed)} in all${dinos ? ` (${fmtNum(dinos)} of them dinosaurs)` : ''}, ${fmtNum(loose)} loose and ${fmtNum(boxed)} still inside a set.</p></div>
      <div class="bigs-filters">
        <div class="seg" role="group" aria-label="Figures or dinosaurs">${KINDS.map(([k, l]) => html`<button type="button" data-kind="${k}">${l} <small>${fmtNum(pickKind(all, k).length)}</small></button>`)}</div>
        <div class="seg" role="group" aria-label="Where they are">${WHERE.map(([k, l]) => html`<button type="button" data-where="${k}">${l}</button>`)}</div>
      </div>
    </header>
    <div id="grid" class="grid bigs"></div>
  </section>`);
  root.querySelector('.bigs-filters').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b && 'kind' in b.dataset) setQuery({ kind: b.dataset.kind });
    else if (b) setQuery({ where: b.dataset.where });
  });
  update(root, { db, route });
}

export function update(root, { db, route }) {
  const where = route.query.where || '', kind = route.query.kind || '';
  root.querySelectorAll('.seg button[data-where]').forEach(b => b.classList.toggle('active', b.dataset.where === where));
  root.querySelectorAll('.seg button[data-kind]').forEach(b => b.classList.toggle('active', b.dataset.kind === kind));
  const list = pick(pickKind(bigFigs(db), kind), where);
  const grid = root.querySelector('#grid');
  grid.innerHTML = list.length ? str(list.map(f => bigFigCard(db, f))) : str(html`<p class="empty" style="grid-column:1/-1">No big figs here yet.</p>`);
}
