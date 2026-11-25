// Brickland's pictures: the same brick-built valley in different dress. The home page shows the one for the season;
// a theme's page (and a list filtered to that theme) shows the one that suits the theme.
// Each entry is one picture: its two files in assets/img (`file`.jpg and `file`.small.jpg) and its description. The
// home page's pictures also have the sky colour of their top rows (the home panel is painted in it, so the picture's
// sky carries on upward and the headline sits in it), the colour their leaves are outlined in, and their treetops;
// theme-only pictures (further down) have neither.
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
    file: 'brickland-endor', spots: [0, 14, 28, 35, 72, 86, 100], sky: ['#6db0fa', '#8dc2fa'], outline: '#0a2a0c',
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
    file: 'brickland-valley', spots: [0, 14, 21, 28, 65, 86], sky: ['#72b3fb', '#92c3fb'], outline: '#0a2a0c',
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
  // Theme-only pictures: new scenes in the same brick style (Endor as the style reference), shown only as theme
  // banners, so they need no sky colour or treetops.
  ninjago: {
    file: 'brickland-ninjago', spots: [7, 14, 21, 28, 65, 72],
    alt: 'A Japanese town built from bricks in the middle of a battle: a red pagoda with golden trim, cherry blossom trees and a koi pond, the old white-bearded sensei in his straw hat beside the green ninja with a golden sword, a dark skull-faced rock fortress with horn towers, lava, a hanging cage and skeleton warriors on the left, and on the right a white four-headed dragon with spiky green and white wings carrying four ninjas, breathing green fire at a giant lime-green serpent beside a stone tower with a green flame',
  },
  castle: {
    file: 'brickland-castle', spots: [0, 7, 35, 58, 65, 72],
    alt: 'A medieval castle built from bricks: grey stone towers with red and blue roofs and banners, archers on the walls, knights in silver armour riding out over the drawbridge past a catapult, a village with thatched roofs, a troll siege tower on huge wheels with a dragon-head ram and a skull banner rolling towards the castle with big green trolls behind it, and on a lava crag a skull-faced tower with a hanging bone cage, skeleton guards and a red and black dragon breathing fire',
  },
  turtles: {
    file: 'brickland-turtles', spots: [0, 14, 28, 42, 58, 79, 93],
    alt: "The Ninja Turtles' sewer lair built from bricks: brick arches, pipes and beams of light from the manholes, a couch, an old TV and a pizza, the four turtles in blue, red, orange and purple masks with their old rat teacher, facing an armoured villain with a bladed helmet and a purple cape and his black-clad ninjas, above a glowing green channel",
  },
  dc: {
    file: 'brickland-dc', spots: [0, 14, 28, 58, 100],
    alt: 'A gothic city at night built from bricks: dark skyscrapers with gargoyles and lit windows, a full moon and a bat signal in the sky, the caped hero in grey and black with his young sidekick on a rooftop, his black armoured car waiting in the street below, and a grinning villain in purple sneaking off with a bag of loot',
  },
  ideas: {
    file: 'brickland-ideas', spots: [0, 28, 35, 58, 65, 100],
    alt: 'A green landscape built from bricks joining big fan-designed models: a Viking village with thatched longhouses, a watchtower, a forge and a longboat; a huge tree house with rope bridges and a swing; a black grand piano with a pianist on a grassy terrace; a large world globe on a golden stand; and a candy garden with a chocolate waterfall and river, a striped boat, lollipop trees and candy-makers, with children picnicking and flying a kite',
  },
  designer: {
    file: 'brickland-designer', spots: [7, 14, 50, 58, 93, 100],
    alt: 'Fan-designed brick models in one landscape: a red-spotted mushroom house with gnomes, a rainbow hot air balloon floating on white clouds with two birds, jungle temple ruins with a waterfall and explorers on a stone bridge, a pirate island with a giant skull-shaped rock, palm trees, rope bridges, red flags and a rowboat in a blue lagoon, and a spooky gothic castle on a crag with a horse-drawn carriage',
  },
  'middle-earth': {
    file: 'brickland-middle-earth', spots: [0, 14, 28, 50, 65, 79, 93],
    alt: 'A fantasy countryside built from bricks at sunrise: round hobbit doors in grassy hills, a mill and a stone bridge, three big grey trolls around a campfire and cooking pot with small barefoot halflings and an old grey wizard, and on the right a mountain cut open to show a grey stone dwarf hall with pillars, a tomb and a well, where a big blue-grey cave troll with a chain and a hammer, goblins and small adventurers fight by torchlight, with helmeted dwarves watching from the rocks',
  },
  city: {
    file: 'brickland-city', spots: [0, 14, 35, 50, 72, 86, 100],
    alt: 'A busy town square built from bricks: a fountain in a little park between a red fire station with its fire truck and a blue police station, a town hall with a clock tower, shops and a café, a bus, a taxi and a pizza van, a train on a bridge, a crane, and a skyline behind',
  },
  icons: {
    file: 'brickland-icons', spots: [7, 21, 35, 58, 72, 86, 100],
    alt: 'Four big display models built from bricks in one landscape: a haunted mansion on a hill, a blue sports roadster with white stripes on a coast road, a winged desert flying machine over sand dunes, and a calm Japanese garden with a tea house, bonsai and a red bridge',
  },
  mario: {
    file: 'brickland-mario', spots: [0, 14, 28, 58, 72, 86],
    alt: 'A platform-game world built from bricks: green pipes with biting plants, floating brick and question blocks, gold coins and rolling hills, the hero in a red cap and blue overalls jumping to hit a block while his brother in green runs behind, and a little castle with a flag in the distance',
  },
  simpsons: {
    file: 'brickland-simpsons', spots: [28, 42, 50, 65, 79, 93],
    alt: 'A sunny cartoon small town built from bricks: a striped corner convenience store with frozen-drink machines in the window, a burger stand with a giant clown on its roof, a little bar, a church, a red-brick school with a clock tower, a yellow school bus, a pink house with a pink car, and a power plant with two cooling towers on the hill, with townspeople walking, skateboarding and eating donuts',
  },
  seasonal: {
    file: 'brickland-seasonal', spots: [0, 14, 28, 58, 72, 100],
    alt: "The holidays in one landscape built from bricks: a Halloween barn with jack-o'-lanterns, a pumpkin truck and a friendly ghost under the moon, a Thanksgiving harvest table, a snowy Christmas village with a gingerbread house, Santa and his sleigh, and a Valentine's corner with hearts and a box of chocolates",
  },
  disney: {
    file: 'brickland-disney', spots: [0, 28, 35, 58, 72, 93],
    alt: 'A little pastel wooden house lifted into the sky by a huge bunch of colourful balloons, with an old man and a boy scout on the porch, floating over a jungle plateau with a giant waterfall, where a tall colourful bird and a golden dog wait below, all built from bricks',
  },
  jurassic: {
    file: 'brickland-jurassic', spots: [7, 35, 42, 79, 86],
    alt: 'A dinosaur park built from bricks at sunset: a T. rex roaring through the open wooden gates under flaming torches, a jeep full of tourists speeding away, rangers, raptors and a long-necked dinosaur in the jungle, and on the right a huge blue-grey mosasaurus leaping from a lagoon beside an orange work boat with a crane, a yellow mini submarine under the water, an orange helicopter, the visitor centre and a smoking volcano',
  },
  botanical: {
    file: 'brickland-botanical',
    alt: 'A botanical garden built from bricks: a red Japanese maple over a little wooden bridge and koi pond, succulents and cacti in pots, a bonsai, roses, sunflowers, orchids and lavender, a garden shed with a gardener on one side and a glass greenhouse on the other, with butterflies and bees',
  },
  technic: {
    file: 'brickland-technic',
    alt: 'An off-road arena built from technic bricks: a sparkly pink unicorn monster truck flying off a dirt ramp, a black muscle car doing a smoky burnout, a yellow rock crawler climbing boulders, and crowds in the grandstands under desert hills',
  },
  art: {
    file: 'brickland-art',
    alt: 'An art gallery built from bricks: mosaics made of round studs on the walls, a great blue ocean wave in the middle, a vase of sunflowers, butterflies and a colourful world map, with visitors on benches, a guard and a painter at an easel',
  },
  pirates: {
    file: 'brickland-pirates', spots: [0, 14, 28, 50, 72, 86, 100],
    alt: 'A pirate adventure built from bricks on a turquoise sea: a big pirate ship with white sails and a skull flag firing its cannons, a captain with a hook and a parrot, a treasure island with a chest of gold and a skeleton, a navy ship and a stone fort firing back, sharks and a friendly sea serpent',
  },
  'harry-potter': {
    file: 'brickland-harry-potter', spots: [0, 14, 35, 50, 72, 86, 100],
    alt: 'A school of magic built from bricks on a golden afternoon: a grand castle with many pointed towers on a cliff above a lake, a steam train crossing a stone viaduct, students on broomsticks flying around three golden hoops, snowy owls, waterfalls, a glass greenhouse, a gnarled old tree, a stone hut with a pumpkin patch, rowing boats with lanterns, and four young apprentice wizards in coloured capes walking along the path with a spellbook, a crystal staff, a lantern and a pet toad',
  },
  minifigures: {
    file: 'brickland-minifigures', spots: [0, 14, 28, 50, 65, 79, 93],
    alt: 'A village fair built from bricks, full of quirky minifigures: a man in a chicken suit, a man in a shark suit, a mariachi with maracas, a circus ringmaster at his striped big top, a man in a lizard costume, a punk rocker playing guitar on a stage, a tribal hunter, a detective in a trench coat, a robot warrior, a goddess in golden armour, a gingerbread man, a goblin, a man in lederhosen with a pretzel, a wizard, two knights crossing swords and an island warrior in a tiki mask, with a carousel, balloons and food stalls',
  },
  bluey: {
    file: 'brickland-bluey', spots: [0, 14, 35, 58, 79, 100],
    alt: 'A sunny Australian backyard built from bricks: a wooden house on stilts with a verandah, a big tree with a tyre swing, a cubby house, a playground, purple jacaranda trees, a paddling pool and an ice-cream van, and a family of cartoon dogs playing ball: a blue heeler puppy in a cape and crown, her red-orange sister, their mum and dad, and a Dalmatian puppy friend',
  },
  duplo: {
    file: 'brickland-duplo', spots: [7, 28, 50, 72, 93],
    alt: "A toddler's play town built from big chunky DUPLO bricks: a vet clinic with a puppy and a kitten, an ice-cream truck, a dinosaur birthday party with a cake, a little zoo with a giraffe, an elephant, a lion and a zebra, a train carrying presents and a teddy bear, a boy and a girl waving, and a tall tower of stacked bricks",
  },
  chima: {
    file: 'brickland-chima', spots: [0, 21, 42, 65, 79, 100],
    alt: 'A jungle land of animal tribes built from bricks: lion, wolf and lioness warriors in armour on a mossy rock, an eagle warrior flying overhead, crocodile warriors with spears and a huge crocodile walking machine wading through a lily-pad swamp, a lizard warrior with glowing blue orbs, temples with carved lion and crocodile heads, and floating rock islands with waterfalls',
  },
  fortnite: {
    file: 'brickland-fortnite', spots: [0, 21, 42, 58, 79, 100],
    alt: 'A video-game island built from bricks: a giant purple llama piñata on a pile of supply crates, a walking banana man in an explorer outfit, a muscly cat, a tomato-head mascot on a pizza restaurant, a flying bus under a hot-air balloon with players gliding down, wooden ramps and forts, golden treasure chests, a lakeside town and a purple storm on the horizon',
  },
  sonic: {
    file: 'brickland-sonic', spots: [0, 14, 35, 58, 79, 100],
    alt: 'A video-game hill zone built from bricks: checkered hills, a loop-the-loop, palm trees, waterfalls and gold rings, a blue hedgehog racing through the loop, his two-tailed fox friend flying above, a red echidna running alongside, a robot copy of the hedgehog with red eyes, and a moustached scientist in a walking robot',
  },
  // The Exclusives theme's picture, built around the 2019 employee-exclusive Christmas starfighter set.
  exclusives: {
    file: 'brickland-exclusives', spots: [0, 28, 50, 65, 79, 100],
    alt: 'Christmas on a snowy planet built from bricks: a red-and-white candy-cane starfighter flown by a pilot in a Santa hat swoops over the hills, Santa waves from a sleigh full of presents pulled by a little snow robot in a red scarf, with elves wrapping gifts, snowmen, Christmas trees, giant candy canes and glowing snow huts under a pink evening sky',
  },
  // The Star Wars theme's own picture (the home page keeps the green Endor valley): a treetop village in winter with
  // villagers of our own and Will's UCS AT-ST.
  'star-wars-winter': {
    file: 'brickland-star-wars-winter', spots: [21, 28, 35, 72, 79, 86],
    alt: 'A treetop village in a snowy forest of giant trees, built from bricks: round huts with snow-covered thatched roofs and glowing windows, rope bridges hung with icicles and lanterns, villagers in hooded winter cloaks waving, building a snowman and sledding down a slope, and a big grey two-legged walker striding through the snow by a frozen waterfall',
  },
  // The Creator theme's picture, built around two of Will's Creator sets: the green dinosaur and the shark.
  creator: {
    file: 'brickland-creator',
    alt: 'A tropical coast built from bricks: a big green brick dinosaur with a tan belly and black claws roaring on a jungle hill by a waterfall, a striped lighthouse, a wooden pier and a sailboat, and under the sea a big grey brick shark with open jaws, a red crab and an open treasure chest full of gold coins among coral and seaweed',
  },
  promotional: {
    file: 'brickland-promotional', spots: [0, 14, 28, 50, 72, 86, 100],
    alt: 'An around-the-world street built from bricks with six little buildings side by side: an Alpine chalet with heart shutters and a stack of firewood, a white Greek taverna with bougainvillea and a big fish on the roof, a blue and yellow Mediterranean townhouse with a palm tree, a Japanese sushi stand with a giant piece of sushi on its roof under cherry blossoms, a sand-coloured Moroccan house with blue tiles, and a Mexican taqueria with a giant taco on its roof, with travellers strolling past a fruit stall',
  },
  // The Marvel Super Heroes theme's picture: a space adventure with heroes of our own, no famous characters.
  marvel: {
    file: 'brickland-marvel', spots: [0, 14, 28, 50, 72, 93],
    alt: 'A space outpost on a purple moon built from bricks, under a pink nebula sky with a ringed planet: glass domes, a control tower and a teal starship on its landing pad, defended by four heroes of our own, a flying hero in teal with an orange cape, a goggled pilot on a yellow jet bike, a hero in pink holding a glowing honeycomb shield over townspeople in space helmets, and a hero in orange and navy firing a grappling line beside a robot dog, against a giant rock golem with glowing lava cracks and a crystal crown stepping out of a fiery portal with small rock monsters, among craters, crystals, a six-wheeled rover and cargo crates',
  },
  'monster-fighters': {
    file: 'brickland-monster-fighters', spots: [0, 28, 42, 65, 79, 100],
    alt: "A spooky village under a full moon built from bricks: a vampire on the balcony of his crooked castle with bats, a werewolf howling on a rock, green ghosts over a graveyard, a zombie shark leaping out of the misty moat, a zombie chef stirring a bubbling cauldron, and three monster hunters with crossbows and lanterns by their old car, among jack-o'-lanterns and gnarled trees",
  },
};

// The home page. September to November is fall, through Thanksgiving; the rest of the year shows the green valley
// until other seasons get a picture of their own. "#/?season=nature" (or endor, fall, valley) shows one on purpose;
// only a picture with a sky colour and treetops can be shown there, never a theme-only one.
const homePicture = key => (Object.prototype.hasOwnProperty.call(PICTURES, key) && PICTURES[key].tops ? PICTURES[key] : null);
export const pictureFor = (date, forced) => homePicture(forced)
  || (date.getMonth() >= 8 && date.getMonth() <= 10 ? PICTURES.fall : PICTURES.endor);

// Themes. A theme without an entry keeps its plain coloured banner.
const THEME_PICTURES = {
  'Star Wars': 'star-wars-winter',
  Ninjago: 'ninjago', Castle: 'castle', 'Teenage Mutant Ninja Turtles': 'turtles',
  'DC Comics Super Heroes': 'dc', Ideas: 'ideas', 'BrickLink Designer Program': 'designer',
  'The Lord of the Rings': 'middle-earth', 'The Hobbit': 'middle-earth', City: 'city', Icons: 'icons',
  'Super Mario': 'mario', 'The Simpsons': 'simpsons', Seasonal: 'seasonal', Holiday: 'seasonal', Disney: 'disney',
  'Jurassic World': 'jurassic', Dinosaurs: 'jurassic', 'Botanical Collection': 'botanical', Technic: 'technic',
  Art: 'art', Pirates: 'pirates', 'Pirates of the Caribbean': 'pirates',
  'Harry Potter': 'harry-potter', 'Collectible Minifigures': 'minifigures', Bluey: 'bluey', DUPLO: 'duplo', 'Legends of Chima': 'chima',
  Fortnite: 'fortnite', 'Sonic the Hedgehog': 'sonic', 'Monster Fighters': 'monster-fighters',
  Promotional: 'promotional', Exclusives: 'exclusives',
  Animals: 'nature', Creator: 'creator', 'Marvel Super Heroes': 'marvel',
};
export const themePicture = name => PICTURES[THEME_PICTURES[name]] || null;

// The scene behind a figure on its own page (figstage.js): its theme's picture, with the box panned to a spot of its
// own so that the figures of one theme do not all stand in front of the same patch. Star Wars is by far the biggest
// theme, so its figures are shared out over both Star Wars pictures. A theme without a picture of its own stands in the
// first Brickland valley. Everything is worked out from the figure's key alone, so a figure never moves.
const FIG_SCENES = { 'Star Wars': ['star-wars-winter', 'endor'] };
const FIG_SCENE_FALLBACK = 'valley';
const FIG_SPOTS = [0, 14, 28, 42, 58, 72, 86, 100]; // how far across the picture the box looks, in percent: used by a picture that names no `spots` of its own
const keyNumber = key => { // FNV-1a: the same number for the same key, in every browser
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};
export function figScene(fig) {
  const theme = fig && fig.theme, n = keyNumber(String((fig && fig.key) || ''));
  const names = FIG_SCENES[theme] || [THEME_PICTURES[theme] || FIG_SCENE_FALLBACK];
  const picture = PICTURES[names[n % names.length]] || PICTURES[FIG_SCENE_FALLBACK];
  const spots = picture.spots || FIG_SPOTS;
  return { picture, x: spots[(n >>> 8) % spots.length] };
}
