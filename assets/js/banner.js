// A theme's picture as a banner: the theme's version of the Brickland valley behind its name. Themes without a
// picture of their own (see THEME_PICTURES in pictures.js) get nothing from here and keep their plain banner.
import { html, str, onColor } from './ui.js?v=1795577892';
import { themePicture } from './pictures.js?v=1795577892';

export function themeBanner(t, { sub = '', right = '', compact = false } = {}) {
  const pic = t && themePicture(t.name);
  if (!pic) return '';
  // Names of three words or more (or long ones) get a smaller title, stacked on two lines, so it leaves the picture
  // showing.
  const long = t.name.length > 18 || t.name.trim().split(/\s+/).length >= 3 ? ' long' : '';
  return html`<div class="theme-pic ${compact ? 'compact' : ''}" style="--tile-accent:${t.accent};--tile-ink:${onColor(t.accent)}">
    <img src="assets/img/${pic.file}.jpg" srcset="assets/img/${pic.file}.small.jpg 1100w, assets/img/${pic.file}.jpg 2200w" sizes="(max-width: 1400px) 100vw, 1328px" alt="" decoding="async">
    <div class="theme-pic-bar">
      <a class="btn home-btn" href="#/" aria-label="Back to Brickland"><span aria-hidden="true">←</span> <span><span class="home-btn-more">Back to </span>Brickland</span></a>
      ${compact ? html`<p class="theme-pic-title${long}">${t.name}</p>` : html`<h1 class="theme-pic-title${long}">${t.name}</h1>`}
      ${right ? html`<div class="theme-pic-right">${right}</div>` : ''}
    </div>
    ${sub ? html`<div class="theme-pic-foot"><p class="theme-pic-sub">${sub}</p></div>` : ''}
  </div>`;
}

// For a list page: show the banner of the theme the list is filtered to, and take it away when the filter goes.
// The slot remembers which theme it shows, so typing in the other filters does not reload the picture.
export function fillThemeSlot(slot, db, themeName, right) {
  if (!slot) return;
  const t = (themeName && db.themeByName.get(themeName)) || null;
  const key = t && themePicture(t.name) ? t.name : '';
  if (slot.dataset.theme === key) return;
  slot.dataset.theme = key;
  slot.innerHTML = key ? str(themeBanner(t, { compact: true, right: right(t) })) : '';
}
