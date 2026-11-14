import { html, str, raw, img, badge, confidenceBadge, plural, fmtNum, fmtDate, fmtMoney, linkButton, shareButton, setTitle, notFound, themeTag } from '../ui.js?v=1794661478';
import { figCard } from './figs.js?v=1794661478';
import { setCard } from './sets.js?v=1794661478';
import { investFacts, valuationCard } from '../money.js?v=1794661478';

const SOURCE_LABEL = { brickset: 'Brickset', rebrickable: 'Rebrickable', bricklink: 'BrickLink', hotlink: 'BrickLink (live)', placeholder: 'no image yet' };

export function render(root, { db, route }) {
  const s = db.setById.get(route.params.id);
  if (!s) { setTitle('Set not found'); root.innerHTML = str(notFound(`Set “${route.params.id}”`)); return; }
  setTitle(`${s.num ? s.num + ' ' : ''}${s.name}`);
  const figs = (db.figsBySet.get(s.id) || []);
  const qtyFor = f => (f.inSets.find(i => i.setId === s.id) || {}).qtyPerSet || 1;
  const related = (db.setsByTheme.get(s.theme) || []).filter(x => x.id !== s.id).slice(0, 10);
  const channels = [...new Set(s.acquisitions.map(a => a.channel))];
  const priv = db.meta.private;
  const l = s.links || {};
  root.innerHTML = str(html`<article class="fade-in">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/sets">Sets</a> › <a href="#/theme/${(db.themeByName.get(s.theme) || {}).slug || ''}">${s.theme}</a>${s.subtheme ? html` › <span>${s.subtheme}</span>` : ''}</nav>
    <div class="detail">
      <div class="detail-img">
        <div class="img-well">${img({ item: s, kind: 'set', size: 'full', alt: s.name, lazy: false })}</div>
        <div class="caption">Image: ${SOURCE_LABEL[(s.image || {}).source] || '—'}${s.image && s.image.full ? ' (cached)' : ''}</div>
      </div>
      <div>
        ${themeTag(db, s.theme, `${s.num ? `Set ${s.num}` : 'No set number'} · ${s.theme}${s.subtheme ? ` / ${s.subtheme}` : ''}`)}
        <h1>${s.name}</h1>
        ${s.sheetName && s.sheetName !== s.name && priv ? html`<p class="muted" style="margin:0 0 8px">Listed in the sheet as “${s.sheetName}”</p>` : ''}
        <div class="badges">
          ${s.copies > 1 ? badge(`×${s.copies} copies`, 'accent') : ''}
          ${s.status === 'incoming' ? badge('Incoming', 'warn', 'Purchased, not yet received or invoiced') : ''}
          ${s.tags.map(t => badge(t, 'ink'))}
          ${s.conditions.map(c => badge(c))}
          ${confidenceBadge(s.idConfidence)}
        </div>
        <dl class="facts">
          <dt>Catalog ID</dt><dd class="mono">${s.id.startsWith('item-') ? 'not in the BrickLink catalog' : s.id}</dd>
          <dt>Year</dt><dd>${s.year || '—'}</dd>
          <dt>Pieces</dt><dd>${s.pieces ? fmtNum(s.pieces) : '—'}</dd>
          <dt>Minifigs</dt><dd>${s.figCount ? plural(s.figCount, 'figure') : 'none'}</dd>
          <dt>Copies owned</dt><dd>${s.copies}</dd>
          <dt>Condition</dt><dd>${s.conditions.join(', ') || '—'}</dd>
          <dt>First acquired</dt><dd>${fmtDate(s.firstAcquired)}</dd>
          <dt>Acquired via</dt><dd>${channels.join(', ') || '—'}</dd>
          ${s.isGwp ? html`<dt>Type</dt><dd>Gift with purchase</dd>` : ''}
          ${priv && s.idNote ? html`<dt>ID note</dt><dd class="muted">${s.idNote}</dd>` : ''}
          ${investFacts(s.invest)}
        </dl>
        <div class="link-row">
          ${linkButton('BrickLink catalog', l.bricklink, 'bl')}
          ${linkButton('BrickLink price guide', l.bricklinkPrices, 'bl')}
          ${linkButton('LEGO.com instructions', l.legoInstructions, 'lego')}
          ${linkButton('Brickset', l.brickset)}
          ${linkButton('Brickset instructions', l.bricksetInstructions)}
          ${linkButton('Rebrickable', l.rebrickable)}
          ${linkButton('BrickLink Designer Program', l.bdp)}
          ${linkButton('Search BrickLink', l.bricklinkSearch, 'bl')}
          ${shareButton(`set/${s.id}/`, s.name)}
        </div>
        ${priv && s.valuations ? s.valuations.map(valuationCard) : ''}
        <section class="section">
          <div class="section-head"><h2>Acquisitions</h2></div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Condition</th><th>Via</th>${priv ? html`<th>Seller</th><th>Order</th><th class="num">Unit</th><th class="num">Line total</th>` : ''}<th>Status</th></tr></thead>
          <tbody>${s.acquisitions.map(a => html`<tr><td>${fmtDate(a.date)}</td><td>${a.condition || '—'}</td><td>${a.channel}</td>${priv ? html`<td>${a.seller || '—'}</td><td class="mono">${a.orderId || '—'}</td><td class="num">${fmtMoney(a.unitPrice, a.currency)}</td><td class="num">${fmtMoney(a.lineTotal, a.currency)}</td>` : ''}<td>${a.status === 'incoming' ? badge('Incoming', 'warn') : badge('Owned', 'ok')}</td></tr>${priv && a.notes ? html`<tr><td colspan="8" class="muted" style="font-size:13px">${a.notes}</td></tr>` : ''}`)}</tbody></table></div>
        </section>
      </div>
    </div>
    ${figs.length ? html`<section class="section">
      <div class="section-head"><h2>Minifigs in this set <span class="muted" style="font-weight:500">· ${plural(s.figCount, 'figure')}, ${figs.length} distinct</span></h2><a href="#/minifigs?set=${encodeURIComponent(s.id)}">Open in minifigs →</a></div>
      <div class="grid figs">${figs.map(f => figCard(db, f, { qty: qtyFor(f) }))}</div>
    </section>` : ''}
    ${related.length ? html`<section class="section">
      <div class="section-head"><h2>More from ${s.theme}</h2><a href="#/sets?theme=${encodeURIComponent(s.theme)}">All ${s.theme} sets →</a></div>
      <div class="strip">${related.map(x => setCard(db, x))}</div>
    </section>` : ''}
  </article>`);
}

