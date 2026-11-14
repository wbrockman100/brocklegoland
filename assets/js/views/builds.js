// Custom builds: one-of-one builds of our own. Ideas come from ideas.js; the builds we are already gathering parts
// for come from the wish list data (the catalog's "Wishlist Parts & MOCs" tab).
import { html, str, raw, fmtNum, setTitle, shareButton } from '../ui.js?v=1794661478';
import { IDEAS } from '../ideas.js?v=1794661478';

const ideaCard = (x, i) => html`<article class="idea" id="${x.key}">
  <figure class="idea-pic">
    <img src="assets/img/builds/${x.key}.jpg" srcset="assets/img/builds/${x.key}.small.jpg 800w, assets/img/builds/${x.key}.jpg 1600w" sizes="(max-width: 900px) 100vw, 800px"
      width="1600" height="905" alt="${x.alt}" decoding="async" ${raw(i ? 'loading="lazy"' : 'fetchpriority="high"')}>
    <figcaption>Concept picture, made with an image tool. It shows the idea, not a building plan.</figcaption>
  </figure>
  <div class="idea-copy">
    <span class="sticker">${x.stage}</span>
    <h2>${x.name}</h2>
    <p>${x.blurb}</p>
    <ul>${x.points.map(p => html`<li>${p}</li>`)}</ul>
  </div>
</article>`;

const gatherTile = b => html`<div class="tile wish-build">
  <h3>${b.name}</h3>
  <p class="muted">${b.pieces ? `${fmtNum(b.pieces)} pieces to gather` : 'Parts list in progress'}${b.lots ? ` · ${fmtNum(b.lots)} different parts` : ''}</p>
</div>`;

export function render(root, { db }) {
  setTitle('Custom builds');
  const gathering = (db.wishlist && db.wishlist.builds) || [];
  root.innerHTML = str(html`<section class="page fade-in">
    <header class="page-head"><div><h1>Custom builds</h1>
      <p class="muted">One-of-one builds of our own: ideas we want to build with bricks, and the ones we are already gathering parts for.</p></div>
      ${shareButton('builds/', 'Custom builds')}
    </header>
    <section class="section">
      <div class="section-head" style="--stud:var(--orange)"><h2>Ideas</h2></div>
      ${IDEAS.map(ideaCard)}
    </section>
    ${gathering.length ? html`<section class="section">
      <div class="section-head" style="--stud:var(--blue)"><h2>Gathering parts</h2><a href="#/wishlist">Wish list →</a></div>
      <div class="tiles">${gathering.map(gatherTile)}</div>
    </section>` : ''}
  </section>`);
}
