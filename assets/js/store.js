// Loads collection.json once and builds indexes; filter/sort helpers are pure functions.
export async function load(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Could not load ' + url + ' (' + res.status + ')');
  const data = await res.json();
  const db = { ...data, setById: new Map(), figByKey: new Map(), figsBySet: new Map(), setsByTheme: new Map(), figsByTheme: new Map(), years: [], figTypes: [] };
  for (const s of db.sets) {
    db.setById.set(s.id, s);
    push(db.setsByTheme, s.theme, s);
    if (s.year) db.years.push(s.year);
  }
  for (const f of db.figs) {
    db.figByKey.set(f.key, f);
    push(db.figsByTheme, f.theme, f);
    for (const i of f.inSets) push(db.figsBySet, i.setId, f);
  }
  db.years = [...new Set(db.years)].sort((a, b) => a - b);
  db.figTypes = [...new Set(db.figs.map(f => f.type))].sort();
  db.themeByName = new Map(db.themes.map(t => [t.name, t]));
  db.themeBySlug = new Map(db.themes.map(t => [t.slug, t]));
  return db;
}

function push(map, k, v) {
  if (!map.has(k)) map.set(k, []);
  map.get(k).push(v);
}

const norm = s => (s || '').toString().toLowerCase();

export function filterSets(db, q) {
  const text = norm(q.q).trim();
  return db.sets.filter(s =>
    (!q.theme || s.theme === q.theme)
    && (!q.cond || s.conditions.some(c => norm(c).startsWith(norm(q.cond))))
    && (!q.yearMin || (s.year || 0) >= +q.yearMin)
    && (!q.yearMax || (s.year || 9999) <= +q.yearMax)
    && (!q.figs || s.figCount > 0)
    && (!q.gwp || s.isGwp)
    && (!q.tag || s.tags.includes(q.tag))
    && (!q.status || s.status === q.status)
    && (!q.conf || s.idConfidence === q.conf)
    && (!q.noimg || !(s.image && (s.image.full || s.image.hotlink)))
    && (!text || norm(s.name).includes(text) || (s.num || '').includes(text) || norm(s.theme).includes(text) || norm(s.subtheme).includes(text)));
}

// Compare by a value, with blanks (no price, not appraised) always at the end whichever way the list runs.
function byValue(val, m) {
  return (a, b) => {
    const va = val(a), vb = val(b);
    if (va == null || vb == null) return (va == null) - (vb == null) || a.name.localeCompare(b.name);
    return (va > vb ? 1 : va < vb ? -1 : 0) * m || a.name.localeCompare(b.name);
  };
}
const inv = (x, k) => (x.invest && x.invest[k] != null ? x.invest[k] : null);
const worthEach = x => (inv(x, 'mid') == null ? null : x.invest.mid / (x.invest.valuedQty || 1));
const HIGH_FIRST = new Set(['acquired', 'year', 'pieces', 'figs', 'qty', 'sets', 'paid', 'value', 'gain']);

export function sortSets(list, key = 'acquired', dir) {
  const d = dir || (HIGH_FIRST.has(key) ? 'desc' : 'asc');
  const val = {
    name: s => s.name, number: s => +(s.num || 0), year: s => s.year || 0, pieces: s => s.pieces || 0,
    figs: s => s.figCount, acquired: s => s.firstAcquired || '', copies: s => s.copies,
    paid: s => inv(s, 'paidEach'), value: worthEach, gain: s => inv(s, 'gain'),
  }[key] || (s => s.name);
  return [...list].sort(byValue(val, d === 'asc' ? 1 : -1));
}

export function filterFigs(db, q) {
  const text = norm(q.q).trim();
  return db.figs.filter(f =>
    (!q.theme || f.theme === q.theme)
    && (!q.type || f.type === q.type)
    && (!q.kind || f.kind === q.kind)
    && (!q.source || (q.source === 'loose' ? f.owned.loose > 0 : q.source === 'sets' ? f.owned.inSets > 0 : true))
    && (!q.conf || f.idConfidence === q.conf)
    && (!q.cond || f.looseLots.some(l => norm(l.condition).startsWith(norm(q.cond))))
    && (!q.set || f.inSets.some(i => i.setId === q.set))
    && (!q.noimg || !(f.image && (f.image.full || f.image.hotlink)))
    && (!q.approx || !!(f.image && f.image.approx))
    && (!text || norm(f.name).includes(text) || norm(f.blId || f.blPart).includes(text) || norm(f.variant).includes(text) || norm(f.theme).includes(text)));
}

export function sortFigs(list, key = 'name', dir) {
  const d = dir || (HIGH_FIRST.has(key) ? 'desc' : 'asc');
  const val = {
    name: f => f.name, id: f => f.blId || '\uffff', theme: f => f.theme, qty: f => f.owned.total, sets: f => f.inSets.length,
    acquired: f => f.looseLots.map(l => l.date || '').sort().pop() || '',
    paid: f => inv(f, 'paidEach'), value: worthEach, gain: f => inv(f, 'gain'),
  }[key] || (f => f.name);
  return [...list].sort(byValue(val, d === 'asc' ? 1 : -1));
}

export function search(db, text, limit = 6) {
  const t = norm(text).trim();
  if (!t) return { sets: [], figs: [] };
  const score = (hay, prefixBonus) => {
    const h = norm(hay);
    if (!h.includes(t)) return 0;
    return (h.startsWith(t) ? 2 : 1) + (prefixBonus ? 1 : 0);
  };
  const sets = db.sets.map(s => [Math.max(score(s.name), score(s.num, true)), s]).filter(x => x[0]).sort((a, b) => b[0] - a[0]).slice(0, limit).map(x => x[1]);
  const figs = db.figs.map(f => [Math.max(score(f.name), score(f.blId || f.blPart, true)), f]).filter(x => x[0]).sort((a, b) => b[0] - a[0]).slice(0, limit).map(x => x[1]);
  return { sets, figs };
}

export function recentSets(db, n = 12) {
  return sortSets(db.sets.filter(s => s.firstAcquired), 'acquired', 'desc').slice(0, n);
}
