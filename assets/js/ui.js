// Rendering helpers: escaping, templates, image fallback chain, badges, formatting, chunked grids.
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

class Raw { constructor(s) { this.s = s; } }
export const raw = s => new Raw(s);

function renderVal(v) {
  if (v instanceof Raw) return v.s;
  if (Array.isArray(v)) return v.map(renderVal).join('');
  if (v == null || v === false) return '';
  return esc(v);
}

// Tagged template: interpolations are escaped unless wrapped in raw(). Returns a Raw so it nests safely.
export function html(strings, ...vals) {
  return raw(strings.reduce((out, str, i) => out + str + (i < vals.length ? renderVal(vals[i]) : ''), ''));
}
export const str = v => renderVal(v);

const PLACEHOLDER = { set: 'assets/img/placeholder-set.svg', fig: 'assets/img/placeholder-fig.svg' };

// Image with a fallback chain stored on the element: cached file → hotlink → placeholder.
export function img({ item, kind, cls = '', size = 'thumb', alt = '', lazy = true }) {
  const im = (item && item.image) || {};
  const chain = [size === 'thumb' ? (im.thumb || im.full) : (im.full || im.thumb), im.hotlink, PLACEHOLDER[kind]].filter(Boolean);
  const [first, ...rest] = chain;
  return html`<img class="${cls}" src="${first}" alt="${alt}" ${lazy ? raw('loading="lazy" decoding="async"') : raw('decoding="async" fetchpriority="high"')} data-fallbacks="${rest.join('|')}" referrerpolicy="no-referrer">`;
}

document.addEventListener('error', e => {
  const el = e.target;
  if (!(el instanceof HTMLImageElement) || !el.dataset.fallbacks) return;
  const [next, ...rest] = el.dataset.fallbacks.split('|');
  if (!next) return;
  el.dataset.fallbacks = rest.join('|');
  el.src = next;
}, true);

export const badge = (text, variant = '', title = '') => html`<span class="badge ${variant}" ${title ? raw(`title="${esc(title)}"`) : ''}>${text}</span>`;
export const confidenceBadge = c => ({
  certain: badge('ID verified', 'ok', 'BrickLink ID confirmed'),
  likely: badge('ID likely', 'warn', 'BrickLink ID from a name match; probably right'),
  guessing: badge('ID guessed', 'bad', 'BrickLink ID is a guess'),
  none: badge('Unidentified', '', 'No BrickLink ID yet'),
}[c] || '');
export const kindBadge = k => ({ custom: badge('Custom', 'soft', 'Third-party custom figure'), lot: badge('Unsorted lot', 'warn'), unidentified: '' }[k] || '');

export const fmtNum = n => (n == null ? '—' : Number(n).toLocaleString('en-US'));
export const fmtMoney = (n, cur = 'USD') => {
  if (n == null) return '—';
  try { return Number(n).toLocaleString('en-US', { style: 'currency', currency: cur || 'USD' }); } catch (e) { return `${cur} ${Number(n).toFixed(2)}`; }
};
export const fmtDate = iso => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—');
export const fmtMonth = iso => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '—');
export const plural = (n, w, p = w + 's') => `${fmtNum(n)} ${n === 1 ? w : p}`;
export const setTitle = t => { document.title = t ? `${t} · Brock Brickland` : 'Brock Brickland'; };
export const linkButton = (label, url, cls = '') => (url ? html`<a class="link-btn ${cls}" href="${url}" target="_blank" rel="noopener">${label} <span class="ext" aria-hidden="true">↗</span></a>` : '');
export const themeDot = (db, theme) => { const t = db.themeByName && db.themeByName.get(theme); return t ? t.accent : '#c9c1ae'; };
// Ink or white, whichever reads better on a flat colour (WCAG relative luminance).
export function onColor(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return '#111111';
  const lin = i => { const v = parseInt(m[1].substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * lin(0) + 0.7152 * lin(2) + 0.0722 * lin(4) > 0.19 ? '#111111' : '#ffffff';
}
// A pill in the theme's colour; the text stays ink or white so it is always readable.
export const themeTag = (db, theme, text) => { const c = themeDot(db, theme); return html`<div class="tag" style="--tag:${c};--tag-ink:${onColor(c)}">${text}</div>`; };

// Render a long list in chunks; more chunks are appended as the sentinel scrolls into view.
export function renderChunked(container, items, renderItem, chunk = 60) {
  container.innerHTML = '';
  let i = 0;
  const sentinel = document.createElement('div');
  sentinel.className = 'sentinel';
  container.appendChild(sentinel);
  let obs = null;
  const more = () => {
    const tpl = document.createElement('template');
    tpl.innerHTML = items.slice(i, i + chunk).map(x => str(renderItem(x))).join('');
    i += chunk;
    container.insertBefore(tpl.content, sentinel);
    if (i >= items.length) { if (obs) obs.disconnect(); sentinel.remove(); }
  };
  more();
  if (i < items.length) {
    obs = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) more(); }, { rootMargin: '900px' });
    obs.observe(sentinel);
  }
}

export function el(id) { return document.getElementById(id); }
export const notFound = (what) => html`<section class="page empty fade-in"><h1>Not found</h1><p class="muted">${what || 'That page'} isn't in the collection.</p><p><a class="btn primary" href="#/">Back to the start</a></p></section>`;

// Share / copy-link button. `path` is the clean share address relative to the site root, e.g. "set/75192-1/".
export const shareButton = (path, title) => html`<button type="button" class="link-btn share" data-share="${path}" data-title="${title}"><span class="share-label">Share link</span> <span class="ext" aria-hidden="true">⧉</span></button>`;

document.addEventListener('click', async e => {
  const btn = e.target.closest && e.target.closest('[data-share]');
  if (!btn) return;
  const url = location.origin + location.pathname.replace(/[^/]*$/, '') + btn.dataset.share;
  const label = btn.querySelector('.share-label');
  const flash = text => { const old = label.textContent; label.textContent = text; setTimeout(() => { label.textContent = old; }, 1800); };
  try {
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      await navigator.share({ title: btn.dataset.title || document.title, url });
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      flash('Link copied ✓');
    } else {
      window.prompt('Copy this link', url);
    }
  } catch (err) {
    if (err && err.name !== 'AbortError') window.prompt('Copy this link', url);
  }
});
