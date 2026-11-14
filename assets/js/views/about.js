import { html, str, plural, fmtNum, setTitle } from '../ui.js?v=1794661478';

export function render(root, { db }) {
  setTitle('About');
  const m = db.meta;
  const count = (arr, fn) => arr.filter(fn).length;
  const figConf = ['certain', 'likely', 'guessing', 'none'].map(c => [c, count(db.figs, f => f.idConfidence === c)]);
  const setConf = ['certain', 'likely', 'guessing', 'none'].map(c => [c, count(db.sets, s => s.idConfidence === c)]);
  const noSetImg = count(db.sets, s => !(s.image && (s.image.full || s.image.hotlink)));
  const noFigImg = count(db.figs, f => !(f.image && (f.image.full || f.image.hotlink)));
  const hotFig = count(db.figs, f => f.image && !f.image.full && f.image.hotlink);
  const hotSet = count(db.sets, s => s.image && !s.image.full && s.image.hotlink);
  const incoming = count(db.sets, s => s.status === 'incoming');
  const inferred = count(db.figs, f => f.themeInferred);
  const approxImg = count(db.figs, f => f.image && f.image.approx);
  const customs = count(db.figs, f => f.kind === 'custom');
  const lots = db.figs.filter(f => f.kind === 'lot');
  const lotUnits = lots.reduce((a, f) => a + f.owned.loose, 0);
  const label = { certain: 'ID verified', likely: 'ID likely', guessing: 'ID guessed', none: 'Unidentified' };
  const row = (what, n, link) => html`<tr><td>${what}</td><td class="num">${fmtNum(n)}</td><td>${link && n ? html`<a href="${link}" style="text-decoration:underline">open</a>` : ''}</td></tr>`;
  root.innerHTML = str(html`<section class="page fade-in prose">
    <header class="page-head"><div><h1>About this site</h1><p class="muted">How Brock Brickland is built, and how clean the data is.</p></div></header>
    <div class="two-col">
      <div class="panel">
        <h2>Source</h2>
        <p>Everything here is generated from Will's master spreadsheet <span class="mono">${m.sourceFile}</span> (${m.sourceVersion}${m.coverage ? `, purchases ${m.coverage}` : ''}). The site was built on ${m.generatedAt ? new Date(m.generatedAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }) : '—'} as the <strong>${m.private ? 'private' : 'public'}</strong> build.</p>
        <p>Sets come from the Sets tab, figures from both the Minifigs tab (loose purchases) and the Set Minifigs tab (figures that came inside sets). Canceled, refunded and returned rows are excluded.</p>
        <p>Set facts (year, piece count, theme) and many figure pictures come from <a href="https://rebrickable.com/downloads/" target="_blank" rel="noopener">Rebrickable's open catalog data</a>; set images from <a href="https://brickset.com" target="_blank" rel="noopener">Brickset</a>; figure images and all catalog links point at <a href="https://www.bricklink.com" target="_blank" rel="noopener">BrickLink</a>. Building-instruction links go to LEGO.com and Brickset.</p>
        <p class="muted" style="font-size:13px">LEGO® is a trademark of the LEGO Group of companies which does not sponsor, authorize or endorse this site.</p>
      </div>
      <div class="panel">
        <h2>Data quality</h2>
        <div class="table-wrap" style="box-shadow:none"><table class="table"><thead><tr><th>Check</th><th class="num">Count</th><th></th></tr></thead><tbody>
          ${setConf.map(([c, n]) => row(`Sets · ${label[c]}`, n, `#/sets?conf=${c}`))}
          ${figConf.map(([c, n]) => row(`Figures · ${label[c]}`, n, `#/minifigs?conf=${c}`))}
          ${row('Custom (non-catalog) figures', customs, '#/minifigs?kind=custom')}
          ${row('Big figs', count(db.figs, f => f.big), '#/bigfigs')}
          ${row('Big figs added from set contents (not in the sheet)', count(db.figs, f => f.fromSetContents))}
          ${row(`Unsorted lots (${fmtNum(lotUnits)} figures inside)`, lots.length, '#/minifigs?kind=lot')}
          ${row('Figure themes inferred from the name', inferred)}
          ${row('Sets without any image', noSetImg, '#/sets?noimg=1')}
          ${row('Figures without any image', noFigImg, '#/minifigs?noimg=1')}
          ${row('Figure pictures that are a best guess by name', approxImg, '#/minifigs?approx=1')}
          ${row('Figure images loading live from BrickLink', hotFig)}
          ${row('Set images loading live from BrickLink', hotSet)}
          ${row('Incoming purchases (not yet received)', incoming, '#/sets?status=incoming')}
        </tbody></table></div>
        ${m.warnings && m.warnings.length ? html`<div class="notice" style="margin-top:12px">${m.warnings.map(w => html`<div>${w}</div>`)}</div>` : ''}
      </div>
    </div>
    <div class="panel" style="margin-top:14px">
      <h2>Tips</h2>
      <p>Press <span class="kbd">/</span> to search from anywhere. Every gallery keeps its filters in the address bar, so a filtered view can be bookmarked or shared. Cards show the BrickLink ID and theme; detail pages carry the outbound links.</p>
    </div>
  </section>`);
}
