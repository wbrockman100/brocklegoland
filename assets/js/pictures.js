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
  // Theme-only pictures: new scenes in the same brick style (Endor as the style reference), shown only as theme
  // banners, so they need no sky colour or treetops.
  ninjago: {
    file: 'brickland-ninjago',
    alt: 'A Japanese town built from bricks: a red pagoda with golden trim, cherry blossom trees, a snowy mountain and a golden dragon in the sky, the old white-bearded sensei in his straw hat and the green ninja standing on a red bridge over a koi pond, and ninjas in red, blue, white and black flipping through the air in swirls of wind',
  },
  castle: {
    file: 'brickland-castle',
    alt: 'A medieval castle built from bricks: grey stone towers with red and blue roofs and banners, archers on the walls and a dragon on the tallest tower, knights in silver armour riding out over the drawbridge towards big green trolls with clubs coming out of the pine forest, a catapult, and a village with thatched roofs',
  },
  turtles: {
    file: 'brickland-turtles',
    alt: "The Ninja Turtles' sewer lair built from bricks: brick arches, pipes and beams of light from the manholes, a couch, an old TV and a pizza, the four turtles in blue, red, orange and purple masks with their old rat teacher, facing an armoured villain with a bladed helmet and a purple cape and his black-clad ninjas, above a glowing green channel",
  },
  dc: {
    file: 'brickland-dc',
    alt: 'A gothic city at night built from bricks: dark skyscrapers with gargoyles and lit windows, a full moon and a bat signal in the sky, the caped hero in grey and black with his young sidekick on a rooftop, his black armoured car waiting in the street below, and a grinning villain in purple sneaking off with a bag of loot',
  },
  ideas: {
    file: 'brickland-ideas',
    alt: 'A green hilltop built from bricks: a huge tree house with cabins, rope bridges, stairs and a swing in a big leafy tree, and beside it a large world globe on a golden arm and wooden stand, with children having a picnic, flying a kite and playing by a little stream',
  },
  designer: {
    file: 'brickland-designer',
    alt: 'Three fan-designed brick models side by side: a red-spotted mushroom house with a round door in a fairy forest, a lost jungle city of temple ruins with waterfalls and explorers, and a spooky gothic castle on a crag with a horse-drawn carriage on the road below',
  },
  'middle-earth': {
    file: 'brickland-middle-earth',
    alt: 'A fantasy countryside built from bricks at sunrise: round hobbit doors in grassy hills, a stone bridge and a mill, and three big grey trolls around a campfire and cooking pot being tricked by small barefoot halflings and an old grey wizard, with dwarves peeking from the rocks and snowy mountains behind',
  },
  city: {
    file: 'brickland-city',
    alt: 'A busy town square built from bricks: a fountain in a little park between a red fire station with its fire truck and a blue police station, a town hall with a clock tower, shops and a café, a bus, a taxi and a pizza van, a train on a bridge, a crane, and a skyline behind',
  },
  icons: {
    file: 'brickland-icons',
    alt: 'Four big display models built from bricks in one landscape: a haunted mansion on a hill, a blue sports roadster with white stripes on a coast road, a winged desert flying machine over sand dunes, and a calm Japanese garden with a tea house, bonsai and a red bridge',
  },
  mario: {
    file: 'brickland-mario',
    alt: 'A platform-game world built from bricks: green pipes with biting plants, floating brick and question blocks, gold coins and rolling hills, the hero in a red cap and blue overalls jumping to hit a block while his brother in green runs behind, and a little castle with a flag in the distance',
  },
  simpsons: {
    file: 'brickland-simpsons',
    alt: 'A sunny cartoon town street built from bricks: the corner convenience store with its shopkeeper at the door, and in front of it a yellow cartoon family, the dad with a pink donut, the mom with a tall blue beehive, the boy on a skateboard and the girl with a saxophone',
  },
  seasonal: {
    file: 'brickland-seasonal',
    alt: "The holidays in one landscape built from bricks: a Halloween barn with jack-o'-lanterns, a pumpkin truck and a friendly ghost under the moon, a Thanksgiving harvest table, a snowy Christmas village with a gingerbread house, Santa and his sleigh, and a Valentine's corner with hearts and a box of chocolates",
  },
  disney: {
    file: 'brickland-disney',
    alt: 'A little pastel wooden house lifted into the sky by a huge bunch of colourful balloons, with an old man and a boy scout on the porch, floating over a jungle plateau with a giant waterfall, where a tall colourful bird and a golden dog wait below, all built from bricks',
  },
  jurassic: {
    file: 'brickland-jurassic',
    alt: 'A dinosaur park built from bricks: a T. rex roaring through the open wooden gates under flaming torches, a jeep full of tourists speeding away, rangers, raptors and a long-necked dinosaur in the jungle, a helicopter, electric fences, a visitor centre and a smoking volcano',
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
    file: 'brickland-pirates',
    alt: 'A pirate adventure built from bricks on a turquoise sea: a big pirate ship with white sails and a skull flag firing its cannons, a captain with a hook and a parrot, a treasure island with a chest of gold and a skeleton, a navy ship and a stone fort firing back, sharks and a friendly sea serpent',
  },
  'harry-potter': {
    file: 'brickland-harry-potter',
    alt: 'A castle school of magic built from bricks, on a cliff above a lake under a starry sky: tall towers with pointed roofs, snowy owls, a giant bearded groundskeeper with a lantern by his stone hut, a house elf, a blond student in a green-and-silver sweater, a pale dark wizard in black robes, a baby dragon hatching from an egg, a hairy book with teeth, a mountain troll with a club, centaurs with bows at the edge of the forest, a giant green snake in the lake and a purple triple-decker bus on the road',
  },
  minifigures: {
    file: 'brickland-minifigures',
    alt: 'A village fair built from bricks, full of quirky minifigures: a man in a chicken suit, a man in a shark suit, a mariachi with maracas, a circus ringmaster at his striped big top, a man in a lizard costume, a punk rocker playing guitar on a stage, a tribal hunter, a detective in a trench coat, a robot warrior, a goddess in golden armour, a gingerbread man, a goblin, a man in lederhosen with a pretzel, a wizard, two knights crossing swords and an island warrior in a tiki mask, with a carousel, balloons and food stalls',
  },
  bluey: {
    file: 'brickland-bluey',
    alt: 'A sunny Australian backyard built from bricks: a wooden house on stilts with a verandah, a big tree with a tyre swing, a cubby house, a playground, purple jacaranda trees, a paddling pool and an ice-cream van, and a family of cartoon dogs playing ball: a blue heeler puppy in a cape and crown, her red-orange sister, their mum and dad, and a Dalmatian puppy friend',
  },
  duplo: {
    file: 'brickland-duplo',
    alt: "A toddler's play town built from big chunky DUPLO bricks: a vet clinic with a puppy and a kitten, an ice-cream truck, a dinosaur birthday party with a cake, a little zoo with a giraffe, an elephant, a lion and a zebra, a train carrying presents and a teddy bear, a boy and a girl waving, and a tall tower of stacked bricks",
  },
  chima: {
    file: 'brickland-chima',
    alt: 'A jungle land of animal tribes built from bricks: lion, wolf and lioness warriors in armour on a mossy rock, an eagle warrior flying overhead, crocodile warriors with spears and a huge crocodile walking machine wading through a lily-pad swamp, a lizard warrior with glowing blue orbs, temples with carved lion and crocodile heads, and floating rock islands with waterfalls',
  },
  fortnite: {
    file: 'brickland-fortnite',
    alt: 'A video-game island built from bricks: a giant purple llama piñata on a pile of supply crates, a walking banana man in an explorer outfit, a muscly cat, a tomato-head mascot on a pizza restaurant, a flying bus under a hot-air balloon with players gliding down, wooden ramps and forts, golden treasure chests, a lakeside town and a purple storm on the horizon',
  },
  sonic: {
    file: 'brickland-sonic',
    alt: 'A video-game hill zone built from bricks: checkered hills, a loop-the-loop, palm trees, waterfalls and gold rings, a blue hedgehog racing through the loop, his two-tailed fox friend flying above, a red echidna running alongside, a robot copy of the hedgehog with red eyes, and a moustached scientist in a walking robot',
  },
  'monster-fighters': {
    file: 'brickland-monster-fighters',
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
  'Star Wars': 'endor',
  Ninjago: 'ninjago', Castle: 'castle', 'Teenage Mutant Ninja Turtles': 'turtles',
  'DC Comics Super Heroes': 'dc', Ideas: 'ideas', 'BrickLink Designer Program': 'designer',
  'The Lord of the Rings': 'middle-earth', 'The Hobbit': 'middle-earth', City: 'city', Icons: 'icons',
  'Super Mario': 'mario', 'The Simpsons': 'simpsons', Seasonal: 'seasonal', Holiday: 'seasonal', Disney: 'disney',
  'Jurassic World': 'jurassic', Dinosaurs: 'jurassic', 'Botanical Collection': 'botanical', Technic: 'technic',
  Art: 'art', Pirates: 'pirates', 'Pirates of the Caribbean': 'pirates',
  'Harry Potter': 'harry-potter', 'Collectible Minifigures': 'minifigures', Bluey: 'bluey', DUPLO: 'duplo', 'Legends of Chima': 'chima',
  Fortnite: 'fortnite', 'Sonic the Hedgehog': 'sonic', 'Monster Fighters': 'monster-fighters',
  Animals: 'nature', Creator: 'nature',
};
export const themePicture = name => PICTURES[THEME_PICTURES[name]] || null;
