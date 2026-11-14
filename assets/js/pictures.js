// Brickland's pictures: the same brick-built valley in different dress. The home page shows the one for the season;
// a theme's page (and a list filtered to that theme) shows the one that suits the theme.
// Each entry is one picture: its two files in assets/img (`file`.jpg and `file`.small.jpg), the sky colour of its top
// rows (the home panel is painted in it, so the picture's sky carries on upward and the headline sits in it), the
// colour its leaves are outlined in, its description, and its treetops.
// A picture stops at its top edge and cuts its two framing trees off flat. On the home page their crowns are finished
// above it with the picture's own top rows, mirrored upward and trimmed to stepped, brick-like outlines. All numbers
// are in the picture's pixels at 2200 wide and belong to that picture: `left` and `right` are the two crowns (the
// long runs of H and V follow each crown's real edge where it meets the sky), `lines` are the outlines drawn along
// the new stepped tops. The bottom four rows lie over the picture so the join cannot show.
const ENDOR_TOPS = {
  left: 'M0,104V34H130V48H225V62H320V77H436V78H437V79H438V95H437V96H436V97H434V98H430V103H429V104Z',
  right: 'M2200,104V34H2060V48H1975V62H1890V82H1827V85H1828V90H1829V91H1830V92H1846V104Z',
  lines: ['M0,34H130V48H225V62H320V77H433', 'M2200,34H2060V48H1975V62H1890V82H1830'],
};
export const PICTURES = {
  endor: {
    file: 'brickland-endor', sky: ['#6db0fa', '#8dc2fa'], outline: '#0a2a0c',
    alt: 'Brickland, built from bricks, as the forest moon of Endor: a river valley under snowy mountains with the Death Star in the sky, an Ewok treehouse village, a Rebel camp with an X-wing, the shield generator bunker, a waterfall, R2-D2 and C-3PO on a wooden bridge, an Imperial shuttle on its landing platform, an AT-ST walker, a speeder bike by the campfire and an Ewok with a spear',
    tops: ENDOR_TOPS,
  },
  fall: {
    file: 'brickland-endor-fall', sky: ['#73b4fb', '#93c5fb'], outline: '#2b1408',
    alt: 'Brickland in the fall, built from bricks, as the forest moon of Endor: orange, red and gold trees along a river valley under snowy mountains, the Death Star in the sky, an Ewok treehouse village, a Rebel camp with an X-wing, pumpkins, hay bales and corn, R2-D2 and C-3PO on a wooden bridge, an Imperial shuttle on its landing platform, an AT-ST walker, a Thanksgiving turkey laid out on a picnic blanket by the campfire, and beside it a royal family of four minifigures: a king in silver armour riding a tauntaun, a queen in a purple gown, a princess in pink and a little knight with his visor up',
    tops: {
      left: 'M0,104V34H130V48H225V62H320V77H435V78H436V79H437V94H436V96H432V98H428V102H426V104Z',
      right: 'M2200,104V34H2060V48H1975V62H1890V82H1827V84H1828V86H1829V89H1830V90H1837V91H1838V92H1844V104Z',
      lines: ['M0,34H130V48H225V62H320V77H433', 'M2200,34H2060V48H1975V62H1890V82H1830'],
    },
  },
  // Will's first valley, with the castle: the medieval one.
  valley: {
    file: 'brickland-valley', sky: ['#72b3fb', '#92c3fb'], outline: '#0a2a0c',
    alt: 'Brickland, built from bricks: a river valley under snowy mountains, with a treehouse, a timbered village with a water wheel, a gingerbread house on a snowy ledge, a waterfall, a wooden bridge, a castle with red roofs, and deer, a fox and a horse in the meadow',
    tops: {
      left: 'M0,104V10H130V32H225V54H320V77H439V79H440V82H441V87H440V98H439V99H437V100H435V101H433V104Z',
      right: 'M2200,104V14H2060V36H1975V58H1890V82H1817V83H1823V84H1824V91H1825V93H1826V94H1829V95H1841V96H1842V97H1843V98H1842V104Z',
      lines: ['M0,10H130V32H225V54H320V77H436', 'M2200,14H2060V36H1975V58H1890V82H1828'],
    },
  },
  // No buildings, only plants and animals. Its framing trees are the green Endor picture's, to the pixel.
  nature: {
    file: 'brickland-nature', sky: ['#6fb1fb', '#8fc3fb'], outline: '#0a2a0c',
    alt: "Brickland as pure nature, built from bricks: a river valley under snowy mountains with an owl's nest in the big tree, a bear and her cubs at a cave, a garden of giant flowers, a red panda crossing a mossy log bridge, a beaver dam, ducks, a wolf on a rock, deer, a fox, a hedgehog among mushrooms and a great old oak",
    tops: ENDOR_TOPS,
  },
};

// The home page. September to November is fall, through Thanksgiving; the rest of the year shows the green valley
// until other seasons get a picture of their own. "#/?season=nature" (or any other key above) shows one on purpose.
export const pictureFor = (date, forced) => (Object.keys(PICTURES).includes(forced) ? PICTURES[forced]
  : date.getMonth() >= 8 && date.getMonth() <= 10 ? PICTURES.fall : PICTURES.endor);

// Themes. A theme without an entry keeps its plain coloured banner.
const THEME_PICTURES = {
  'Star Wars': 'endor',
  Castle: 'valley', 'The Lord of the Rings': 'valley', 'The Hobbit': 'valley', Vikings: 'valley',
  'Botanical Collection': 'nature', Animals: 'nature', Creator: 'nature',
};
export const themePicture = name => PICTURES[THEME_PICTURES[name]] || null;
