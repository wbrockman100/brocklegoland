// The picture box on a figure's own page: the figure standing in front of its theme's scene (pictures.js says which
// scene and which spot of it). The build cuts each figure out of its photo and says where in the photo the figure is
// (build/cutouts.py: image.cut = { mask, box: [x, y, w, h], size: [w, h] }); the photo is shown through that mask and
// scaled so that every figure stands on the same ground line at about the same size. A figure whose photo could not be
// cut out, or that has no photo, is shown as a framed card in front of the scene instead.
import { html, img } from './ui.js?v=1795577892';
import { figScene } from './pictures.js?v=1795577892';

// The scene is cropped to a square, so it is drawn about 2.3 times as wide as the box. Phones take the small file.
// Both pictures are decoded in step with the page (`sync`), so the figure never shows on an empty box first.
const SCENE_SIZES = '(min-width: 900px) 1073px, (min-width: 600px) 180vw, 60vw';
const whole = (list, n) => Array.isArray(list) && list.length === n && list.every(v => Number.isFinite(v));
const usable = cut => !!cut && typeof cut.mask === 'string' && cut.mask && whole(cut.box, 4) && whole(cut.size, 2)
  && cut.box[2] > 0 && cut.box[3] > 0 && cut.size[0] > 0 && cut.size[1] > 0;
const percent = n => `${Math.round(n * 1000) / 1000}%`;

export function figStage(f) {
  const { picture, x } = figScene(f);
  const im = (f && f.image) || {};
  const scene = html`<img class="fig-scene" src="assets/img/${picture.file}.small.jpg" srcset="assets/img/${picture.file}.small.jpg 1100w, assets/img/${picture.file}.jpg 2200w" sizes="${SCENE_SIZES}" alt="" decoding="sync" style="object-position:${x}% 50%">`;
  const photo = img({ item: f, kind: 'fig', cls: im.full && usable(im.cut) ? 'fig-cut' : '', size: 'full', alt: (f && f.name) || '', lazy: false, decoding: 'sync' });
  if (!(im.full && usable(im.cut))) return html`<div class="img-well fig-stage framed">${scene}<div class="fig-card">${photo}</div></div>`;
  const [bx, by, bw, bh] = im.cut.box, [iw, ih] = im.cut.size;
  const mask = `url("${encodeURI(im.cut.mask)}")`;
  return html`<div class="img-well fig-stage cut">${scene}
    <div class="fig-stand" style="--ar:${(bw / bh).toFixed(4)};--px:${bh}">
      <div class="fig-crop" data-mask="${im.cut.mask}" style="left:${percent(-bx / bw * 100)};top:${percent(-by / bh * 100)};width:${percent(iw / bw * 100)};height:${percent(ih / bh * 100)};-webkit-mask-image:${mask};mask-image:${mask}">${photo}</div>
    </div></div>`;
}

// Turn a cut-out box into the card kind: the photo, unmasked, in a white frame.
function toCard(stage) {
  const stand = stage && stage.querySelector('.fig-stand');
  const photo = stand && stand.querySelector('img');
  if (!photo) return;
  photo.classList.remove('fig-cut');
  const card = document.createElement('div');
  card.className = 'fig-card';
  card.appendChild(photo);
  stand.replaceWith(card);
  stage.classList.remove('cut');
  stage.classList.add('framed');
}

// If the photo fails to load, ui.js moves on to its fall-back picture, and that one must not be shown through this
// figure's mask.
document.addEventListener('error', e => {
  const el = e.target;
  if (el instanceof HTMLImageElement && el.classList.contains('fig-cut')) toCard(el.closest('.fig-stage'));
}, true);

// A mask that has not loaded hides the figure altogether, so make sure each one does load; if it cannot, show the
// card. Resolves when every box under `root` has been settled.
export function watchFigStages(root) {
  return Promise.all([...root.querySelectorAll('.fig-stage.cut .fig-crop')].map(crop => new Promise(done => {
    const probe = new Image();
    probe.onload = () => done();
    probe.onerror = () => { toCard(crop.closest('.fig-stage')); done(); };
    probe.src = crop.dataset.mask;
  })));
}
