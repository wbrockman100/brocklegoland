// Money formatting and the small price/value fragments shared by cards and detail pages.
// Every function here reads `item.invest`, which only the private build's data carries.
import { html, fmtMoney } from './ui.js?v=1794661478';

export const usd0 = n => (n == null ? '—' : Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));
export const signed = (n, fmt = usd0) => (n == null ? '—' : (n > 0 ? '+' : n < 0 ? '−' : '') + fmt(Math.abs(n)));
export const pct = n => (n == null ? '' : `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(Math.abs(n) < 10 ? 1 : 0)}%`);
export const perPiece = n => (n ? (n < 0.005 ? 'under $0.01' : '$' + n.toFixed(2)) : '');
export const range = (low, high, fmt = usd0) => (low == null ? '—' : low === high ? fmt(low) : `${fmt(low)} – ${fmt(high)}`);

// Gain or loss: the arrow carries the colour, the figures stay in ordinary text colour.
export function delta(inv, { withPct = true } = {}) {
  if (!inv || inv.gain == null) return '';
  const dir = inv.gain > 0 ? 'up' : inv.gain < 0 ? 'down' : 'flat';
  return html`<span class="delta ${dir}"><i aria-hidden="true">${dir === 'up' ? '▲' : dir === 'down' ? '▼' : '■'}</i>${signed(inv.gain)}${withPct && inv.gainPct != null ? html` <small>${pct(inv.gainPct)}</small>` : ''}</span>`;
}

// One line under a card title: what it cost, and how the appraisal compares when there is one.
export function priceLine(inv, { est = false } = {}) {
  if (!inv) return '';
  const each = inv.pricedQty > 1 ? ' each' : '';
  const paid = inv.free ? 'Free with purchase' : inv.paidEach != null ? `${est ? '≈ ' : ''}${fmtMoney(inv.paidEach)}${each}` : 'No price yet';
  return html`<div class="card-price"><span class="${inv.paidEach == null ? 'muted' : ''}">${paid}</span>${inv.gain != null ? delta(inv) : ''}</div>`;
}

// Rows for the facts list on a set or minifig page.
export function investFacts(inv, { est = false } = {}) {
  if (!inv) return '';
  const partly = inv.pricedQty && inv.pricedQty < inv.qty ? ` (${inv.pricedQty} of ${inv.qty} priced)` : '';
  return html`
    <dt>Paid${est ? ' (est.)' : ''}</dt><dd>${inv.free ? 'Free with purchase' : inv.paid == null ? html`<span class="muted">no price in the sheet</span>` : html`${fmtMoney(inv.paid)}${inv.pricedQty > 1 ? ` · ${fmtMoney(inv.paidEach)} each` : ''}${partly}${inv.perPiece ? html` <span class="muted">· ${perPiece(inv.perPiece)} a piece</span>` : ''}`}</dd>
    ${inv.mid != null ? html`<dt>Appraised</dt><dd>${range(inv.low, inv.high)}${inv.valuedQty > 1 ? ` for ${inv.valuedQty}` : ''}</dd>` : ''}
    ${inv.gain != null ? html`<dt>Gain or loss</dt><dd>${delta(inv)} <span class="muted">at the middle of the range</span></dd>` : ''}`;
}

export function valuationCard(v) {
  return html`<section class="panel" style="margin-top:18px">
    <h2>Valuation <span class="muted" style="font-weight:500;font-size:14px">· ${v.item}${v.confidence ? ` · ${v.confidence}` : ''}</span></h2>
    <dl class="facts" style="padding:0;border:0;background:transparent">
      <dt>Own copies value</dt><dd>${v.own_low != null ? `${fmtMoney(v.own_low)} – ${fmtMoney(v.own_high)}` : '—'}</dd>
      <dt>Paid</dt><dd>${v.paid || '—'}</dd>
      <dt>Used market</dt><dd>${v.used_detail || '—'}</dd>
      <dt>Sealed market</dt><dd>${v.new_detail || '—'}</dd>
      <dt>Basis</dt><dd class="muted">${v.basis || '—'}</dd>
      ${v.comp_counts ? html`<dt>Comps</dt><dd class="muted">${v.comp_counts}${v.comp_window ? ` · ${v.comp_window}` : ''}</dd>` : ''}
      ${v.notes ? html`<dt>Notes</dt><dd class="muted">${v.notes}</dd>` : ''}
      ${v.sources ? html`<dt>Sources</dt><dd class="muted" style="font-size:13px">${v.sources}</dd>` : ''}
    </dl></section>`;
}
