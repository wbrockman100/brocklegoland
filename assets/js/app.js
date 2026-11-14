// Boot: load data, wire nav/search/theme, dispatch routes to views.
import { load, search } from './store.js?v=1794661478';
import { start, parseHash, href } from './router.js?v=1794661478';
import { html, str, img, esc, el, fmtDate } from './ui.js?v=1794661478';
import * as home from './views/home.js?v=1794661478';
import * as sets from './views/sets.js?v=1794661478';
import * as set from './views/set.js?v=1794661478';
import * as figs from './views/figs.js?v=1794661478';
import * as fig from './views/fig.js?v=1794661478';
import * as bigfigs from './views/bigfigs.js?v=1794661478';
import * as themes from './views/themes.js?v=1794661478';
import * as theme from './views/theme.js?v=1794661478';
import * as wishlist from './views/wishlist.js?v=1794661478';
import * as builds from './views/builds.js?v=1794661478';
import * as about from './views/about.js?v=1794661478';
import * as notfound from './views/notfound.js?v=1794661478';

const VIEWS = { home, sets, set, minifigs: figs, minifig: fig, bigfigs, themes, theme, wishlist, builds, about, notfound };
// Pages that need the private data load on demand; the public build does not ship their files at all.
const PRIVATE = {
  investment: () => import('./views/investment.js?v=1794661478'),
  spend: () => import('./views/spend.js?v=1794661478'),
  orders: () => import('./views/orders.js?v=1794661478'),
  valuations: () => import('./views/valuations.js?v=1794661478'),
};
const privateOnly = { render(root) { root.innerHTML = str(html`<section class="page empty fade-in"><h1>Private build only</h1><p class="muted">Spend, orders and valuations are only included in the local private build (<span class="kbd">python3 build.py --private</span>).</p></section>`); } };
const NAV_FOR = { set: 'sets', minifig: 'minifigs', theme: 'themes' };
const main = el('main');
let db = null;
let currentView = null;
let renderSeq = 0;

async function boot() {
  try {
    db = await load('data/collection.json');
  } catch (e) {
    main.innerHTML = str(html`<div class="empty"><h1>Could not load the collection</h1><p class="muted">${e.message}</p><p class="muted">If you opened index.html directly from disk, serve it instead: <span class="kbd">./dev.sh</span></p></div>`);
    return;
  }
  const privateNav = document.querySelector('.nav-private');
  if (privateNav) privateNav.hidden = !db.meta.private;
  el('foot-meta').innerHTML = str(footer());
  setupTheme();
  setupSearch();
  window.addEventListener('querychange', e => {
    if (currentView && currentView.update) currentView.update(main, ctx(e.detail));
    else render(e.detail);
  });
  start(route => render(route));
}

const ctx = route => ({ db, route, navigate: h => { location.hash = h; } });

async function render(route) {
  const seq = ++renderSeq;
  let view = VIEWS[route.name] || notfound;
  if (PRIVATE[route.name]) {
    if (!db.meta.private) view = privateOnly;
    else {
      try { view = await PRIVATE[route.name](); } catch (e) { view = notfound; }
      if (seq !== renderSeq) return;  // the visitor moved on while the page was loading
    }
  }
  currentView = view;
  main.innerHTML = '';
  view.render(main, ctx(route));
  window.scrollTo(0, 0);
  const navName = NAV_FOR[route.name] || route.name;
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.dataset.nav === navName));
  closeSearch();
}

function footer() {
  const m = db.meta;
  const when = m.generatedAt ? new Date(m.generatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '';
  return html`Built ${when} from <span class="mono">${m.sourceFile}</span>${m.coverage ? html` · purchases ${m.coverage}` : ''} · ${m.private ? 'Private build' : 'Public build'} ·
    Images courtesy of <a href="https://brickset.com" target="_blank" rel="noopener">Brickset</a>, <a href="https://rebrickable.com" target="_blank" rel="noopener">Rebrickable</a> and <a href="https://www.bricklink.com" target="_blank" rel="noopener">BrickLink</a>. LEGO® is a trademark of the LEGO Group, which does not sponsor or endorse this site.`;
}

// ---- dark mode -------------------------------------------------------------
function setupTheme() {
  const btn = document.querySelector('.theme-toggle');
  const apply = t => { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; };
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next === 'dark' ? 'dark' : null);  // light is the default look, so it needs no attribute
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
  });
}

// ---- global search ---------------------------------------------------------
let searchIdx = -1;
function setupSearch() {
  const input = el('q');
  const box = el('search-results');
  const form = input.closest('form');
  let timer = null;
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => showResults(input.value), 80); });
  input.addEventListener('focus', () => { if (input.value) showResults(input.value); });
  input.addEventListener('keydown', e => {
    const links = [...box.querySelectorAll('a')];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!links.length) return;
      searchIdx = (searchIdx + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links.forEach((a, i) => a.classList.toggle('focus', i === searchIdx));
      links[searchIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Escape') { closeSearch(); input.blur(); }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const links = [...box.querySelectorAll('a')];
    if (searchIdx >= 0 && links[searchIdx]) { location.hash = links[searchIdx].getAttribute('href'); }
    else if (input.value.trim()) { location.hash = href('sets', {}, { q: input.value.trim() }); }
    closeSearch();
  });
  document.addEventListener('click', e => { if (!form.contains(e.target)) closeSearch(); });
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); input.focus(); input.select(); }
  });
}
function showResults(text) {
  const box = el('search-results');
  const input = el('q');
  const { sets: s, figs: f } = search(db, text, 6);
  searchIdx = -1;
  if (!text.trim() || (!s.length && !f.length)) {
    box.innerHTML = text.trim() ? str(html`<div class="sr-group">No matches</div>`) : '';
    box.hidden = !text.trim();
    input.setAttribute('aria-expanded', String(!box.hidden));
    return;
  }
  box.innerHTML = str(html`
    ${s.length ? html`<div class="sr-group">Sets</div>${s.map(x => html`<a href="#/set/${x.id}">${img({ item: x, kind: 'set', alt: '' })}<span><div class="sr-title">${x.name}</div><div class="sr-sub">${x.num || ''} · ${x.theme}${x.year ? ` · ${x.year}` : ''}</div></span></a>`)}` : ''}
    ${f.length ? html`<div class="sr-group">Minifigs</div>${f.map(x => html`<a href="#/minifig/${x.key}">${img({ item: x, kind: 'fig', alt: '' })}<span><div class="sr-title">${x.name}</div><div class="sr-sub">${x.blId || 'no ID'} · ${x.theme} · ×${x.owned.total}</div></span></a>`)}` : ''}
    <a class="sr-all" href="${href('sets', {}, { q: text.trim() })}"><span><div class="sr-sub">See all sets matching “${text.trim()}”</div></span></a>`);
  box.hidden = false;
  input.setAttribute('aria-expanded', 'true');
}
function closeSearch() { const b = el('search-results'); if (b) { b.hidden = true; } const i = el('q'); if (i) i.setAttribute('aria-expanded', 'false'); }

boot();
