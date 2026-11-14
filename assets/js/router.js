// Hash router with query-string state. Routes: #/sets?theme=Star%20Wars, #/set/31058-1, ...
const ROUTES = [
  ['', 'home'], ['sets', 'sets'], ['set/:id', 'set'], ['minifigs', 'minifigs'], ['minifig/:key', 'minifig'], ['bigfigs', 'bigfigs'],
  ['themes', 'themes'], ['theme/:slug', 'theme'], ['wishlist', 'wishlist'], ['builds', 'builds'], ['about', 'about'], ['investment', 'investment'], ['orders', 'orders'], ['valuations', 'valuations'], ['spend', 'spend'],
];

export function parseHash(hash) {
  const h = (hash || '').replace(/^#\/?/, '');
  const [pathPart, queryPart = ''] = h.split('?');
  const segs = pathPart.split('/').filter(Boolean);
  const query = Object.fromEntries(new URLSearchParams(queryPart));
  for (const [pattern, name] of ROUTES) {
    const pp = pattern.split('/').filter(Boolean);
    if (pp.length !== segs.length) continue;
    const params = {};
    let ok = true;
    pp.forEach((p, i) => {
      if (p.startsWith(':')) params[p.slice(1)] = decodeURIComponent(segs[i]);
      else if (p !== segs[i]) ok = false;
    });
    if (ok) return { name, params, query };
  }
  return { name: 'notfound', params: {}, query };
}

export function href(name, params = {}, query = {}) {
  const pattern = (ROUTES.find(r => r[1] === name) || [''])[0];
  const path = pattern.split('/').map(p => (p.startsWith(':') ? encodeURIComponent(params[p.slice(1)]) : p)).join('/');
  const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v !== '' && v != null)).toString();
  return '#/' + path + (qs ? '?' + qs : '');
}

export function currentRoute() { return parseHash(location.hash); }

// Update the query part of the current route without adding a history entry; notifies listeners.
export function setQuery(patch) {
  const r = parseHash(location.hash);
  const q = { ...r.query, ...patch };
  history.replaceState(null, '', href(r.name, r.params, q));
  window.dispatchEvent(new CustomEvent('querychange', { detail: parseHash(location.hash) }));
}

export function start(onRoute) {
  const go = () => onRoute(parseHash(location.hash));
  window.addEventListener('hashchange', go);
  go();
}
