import { html, str, img, badge, confidenceBadge, kindBadge, plural, fmtNum, fmtDate, fmtMoney, linkButton, shareButton, setTitle, notFound, themeTag } from '../ui.js?v=1794661478';
import { setCard } from './sets.js?v=1794661478';
import { figCard } from './figs.js?v=1794661478';
import { investFacts, valuationCard } from '../money.js?v=1794661478';

const SOURCE_LABEL = { bricklink: 'BrickLink', rebrickable: 'Rebrickable', hotlink: 'BrickLink (live)', placeholder: 'no image yet' };
const KIND_TEXT = {
  catalog: 'A BrickLink catalog figure.',
  custom: 'A third-party custom figure (not in the BrickLink catalog).',
  lot: 'An unsorted lot: several figures bought together and not yet identified individually.',
  unidentified: 'Named in the spreadsheet but not yet matched to a BrickLink catalog entry.',
};

export function render(root, { db, route }) {
  const f = db.figByKey.get(route.params.key);
  if (!f) { setTitle('Minifig not found'); root.innerHTML = str(notFound(`Minifig “${route.params.key}”`)); return; }
  setTitle(f.name);
  const priv = db.meta.private;
  const l = f.links || {};
  const sets = f.inSets.map(i => ({ ...i, set: db.setById.get(i.setId) })).filter(x => x.set);
  const sameTheme = (db.figsByTheme.get(f.theme) || []).filter(x => x.key !== f.key && x.image && (x.image.full || x.image.hotlink)).slice(0, 10);
  const im = f.image || {};
  root.innerHTML = str(html`<article class="fade-in">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/minifigs">Minifigs</a> › <a href="#/minifigs?theme=${encodeURIComponent(f.theme)}">${f.theme}</a></nav>
    <div class="detail">
      <div class="detail-img">
        <div class="img-well">${img({ item: f, kind: 'fig', size: 'full', alt: f.name, lazy: false })}</div>
        <div class="caption">${im.approx
          ? html`Picture is a <strong>best guess</strong> matched by name from Rebrickable${im.matchScore != null ? ` (${Math.round(im.matchScore * 100)}% name match)` : ''}. It may show a different variant.`
          : html`Image: ${SOURCE_LABEL[im.source] || '—'}${im.source === 'rebrickable' && im.matchScore != null ? ` (name match ${Math.round(im.matchScore * 100)}%)` : ''}`}</div>
      </div>
      <div>
        ${themeTag(db, f.theme, `${f.blId ? `BrickLink ${f.blId}` : f.blPart ? `BrickLink part ${f.blPart}` : f.fromSetContents ? 'Big fig' : f.kind === 'custom' ? 'Custom figure' : f.kind === 'lot' ? 'Unsorted lot' : 'Unidentified figure'} · ${f.theme}${f.themeInferred ? ' (inferred from the name)' : ''}`)}
        <h1>${f.name}</h1>
        ${f.variant ? html`<p class="muted" style="margin:0 0 6px">${f.variant}</p>` : ''}
        <div class="badges">
          ${badge(`×${f.owned.total} owned`, 'accent')}
          ${confidenceBadge(f.idConfidence)}
          ${kindBadge(f.kind)}
          ${f.big ? html`<a href="#/bigfigs">${badge('Big fig', 'ink')}</a>` : ''}
          ${f.type !== 'Minifig' && !(f.big && f.type === 'Big fig') ? badge(f.type, 'ink') : ''}
        </div>
        <dl class="facts">
          <dt>BrickLink ID</dt><dd class="mono">${f.blId || (f.blPart ? `${f.blPart} (a part)` : '—')}</dd>
          <dt>Theme</dt><dd>${f.theme}</dd>
          <dt>Type</dt><dd>${f.type}</dd>
          <dt>Owned</dt><dd>${f.owned.total} total · ${f.owned.loose} loose · ${f.owned.inSets} inside sets</dd>
          <dt>Appears in</dt><dd>${sets.length ? plural(sets.length, 'owned set') : 'no owned sets'}</dd>
          <dt>Identification</dt><dd>${f.blPart ? (f.fromSetContents ? 'Not in the spreadsheet. A dinosaur that comes inside the set, matched to BrickLink’s catalog, which files dinosaurs as parts.' : 'Matched by name and colour to BrickLink’s catalog, which files dinosaurs as parts.') : f.fromSetContents ? 'Not in the spreadsheet’s figure list. Added from the set’s contents in the Rebrickable catalog.' : KIND_TEXT[f.kind] || ''}</dd>
          ${priv && f.notes ? html`<dt>Notes</dt><dd class="muted">${f.notes}</dd>` : ''}
          ${investFacts(f.invest, { est: true })}
        </dl>
        <div class="link-row">
          ${linkButton('BrickLink catalog', l.bricklink, 'bl')}
          ${linkButton('BrickLink price guide', l.bricklinkPrices, 'bl')}
          ${linkButton('Brickset', l.brickset)}
          ${linkButton('Rebrickable', l.rebrickable)}
          ${linkButton('Search BrickLink for this name', l.bricklinkSearch, 'bl')}
          ${shareButton(`minifig/${f.key}/`, f.name)}
        </div>
        ${priv && f.valuations ? f.valuations.map(valuationCard) : ''}
        ${f.candidates && f.candidates.length ? html`<section class="section">
          <div class="section-head"><h2>Possible BrickLink matches</h2></div>
          <p class="muted" style="margin:0 0 10px">The spreadsheet lists these catalog entries as candidates. Pictures are matched by name from Rebrickable where possible, otherwise they load live from BrickLink.</p>
          <div class="cands">${f.candidates.map(c => html`<a class="cand" href="${c.link}" target="_blank" rel="noopener">
            ${img({ item: { image: { thumb: c.img || null, hotlink: `https://img.bricklink.com/ItemImage/MN/0/${c.id}.png` } }, kind: 'fig', alt: '' })}
            <div><div class="c-id">${c.id}</div><div class="c-name">${c.name || 'BrickLink entry'}</div></div></a>`)}</div>
        </section>` : ''}
        ${f.looseLots.length ? html`<section class="section">
          <div class="section-head"><h2>Loose copies</h2></div>
          <div class="table-wrap"><table class="table"><thead><tr><th class="num">Qty</th><th>Condition</th><th>Date</th><th>Via</th>${priv ? html`<th>Seller</th><th>Order</th><th class="num">Est. unit price</th>` : ''}</tr></thead>
          <tbody>${f.looseLots.map(lot => html`<tr><td class="num">${lot.qty ?? '—'}</td><td>${lot.condition || '—'}</td><td>${fmtDate(lot.date)}</td><td>${lot.channel}</td>${priv ? html`<td>${lot.seller || '—'}</td><td class="mono">${lot.orderId || '—'}</td><td class="num">${fmtMoney(lot.estPrice, lot.currency)}</td>` : ''}</tr>${priv && lot.notes ? html`<tr><td colspan="7" class="muted" style="font-size:13px">${lot.notes}</td></tr>` : ''}`)}</tbody></table></div>
        </section>` : ''}
      </div>
    </div>
    ${sets.length ? html`<section class="section">
      <div class="section-head"><h2>Comes in these sets</h2></div>
      <div class="grid">${sets.map(x => setCard(db, x.set))}</div>
      <p class="muted" style="margin:10px 0 0;font-size:13px">${sets.map(x => `${x.set.name}: ${x.qtyPerSet} per set × ${x.copies} ${x.copies === 1 ? 'copy' : 'copies'}`).join(' · ')}</p>
    </section>` : ''}
    ${sameTheme.length ? html`<section class="section">
      <div class="section-head"><h2>More ${f.theme} minifigs</h2><a href="#/minifigs?theme=${encodeURIComponent(f.theme)}">All →</a></div>
      <div class="strip">${sameTheme.map(x => figCard(db, x))}</div>
    </section>` : ''}
  </article>`);
}
