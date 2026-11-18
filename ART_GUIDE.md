# Art guide

Everything is drawn in code (`js/render.js`) as flat vector shapes. There are no image files, so the art stays sharp at any size and the repository holds no photos.

## Style rules
- **Flat cartoon fills** with at most **one shade tone** per shape. There are no gradients on characters or objects. Skies and liquids may use soft gradients.
- **Outlines:** everything in the play layer gets a dark brown outline, `#2b1d16`, never pure black.
  - 3 px on characters, tiles and big objects; 2 px on small details.
  - Joins and caps are round.
- **Depth:** backgrounds sit behind a soft haze and vignette and use thinner, lighter outlines. Anything you can touch has full outlines.
- **No text in the world** except signs and the HUD. No logos, brands or advertising.
- **Motifs are drawn from scratch**, not traced from photos or posters: the red-brick church tower, baroque façades, trams and wires, the Drava sunset and suspension bridge, golden fields, cured meats, paprika stew and cauldrons.

## Palette
| Use | Colour |
|---|---|
| Outline / ink | `#2b1d16` |
| Cream (panels, highlights) | `#fffaf0`, `#f7ecd8` |
| Brick | `#b85a40`, dark `#8c3d2b` |
| Paprika red | `#de2f24` |
| Wheat gold | `#f2c14e`, `#e8c25a` |
| Stew | `#a92c1a` base, `#d9431f` surface, `#f39a4c` foam |
| Drava water | `#2c6aa0` base, `#4f9bd3` surface |
| Spikes | steel `#b9c0c9` on iron `#4b4f57` |
| Seka marker | rose `#e2557a`, **circle** tag |
| Braco marker | teal `#1f9e8f`, **square** tag |

### Switch channels
Every channel uses a colour **and** a shape, so the game is readable without colour vision. A crossed shape means a bridge that appears while powered.

| Channel | Colour | Shape |
|---|---|---|
| a | red `#e5484d` | circle |
| b | blue `#3b82e0` | triangle |
| c | green `#36b37e` | square |
| d | purple `#a463f2` | diamond |
| e | amber `#f2a516` | star |

## Characters
Both are drawn at the same scale and with the same outline weight and face style. Neither is more detailed than the other.

**Seka (player 1)**
- Brown bob (`#6b3f25`, shadow `#4b2a17`) with a near-centre part.
- Big expressive eyes and defined brows.
- Black top and black jacket with a thin gold necklace.
- When surprised (jumping high, falling or getting hurt) her brows lift, her eyes widen and her mouth becomes an "o".
- Prop: a red paprika-shaped parasol with a green stem, which opens when she glides.
- Silhouette: slim and narrow, with the rounded bob.

**Braco (player 2)**
- Short black hair with a quiff and sideburns.
- Large eyes and a thick black mustache with a small goatee.
- White shirt, teal vest and blue trousers.
- When pushing, he leans forward with his arms out.
- Silhouette: wider shoulders, a square head outline and the quiff.

Beyond colour, the two always differ in **silhouette** (bob vs quiff, slim vs broad), **tag shape** (circle vs square, with the name's initial) and **exit lamp** (circle vs square).

### Wardrobe outfits
Outfits (`js/outfits.js`) are plain colour data that `render.js` applies to the same body. Rules:
- Only clothes, shoes, hats and neckwear change. Faces, hair, the mustache, proportions and collision boxes never change.
- Every outfit keeps the silhouettes apart: Seka's skirts and dresses widen her lower half but she stays narrower than Braco; hats sit on top of the bob or quiff without hiding them.
- Patterns (folk embroidery, flowers, stripes, plaid) are drawn as a few simple marks, not textures, so they read at game scale.
- No logos, brand marks or crests; the football kit is a generic blue-and-white stripe with the number 10.
- The name tag moves up when a hat is worn so it never covers the hat.

## Part 2 backdrops (levels 51–100)
- **Tvrđa by Night:** dark-blue sky with stars and a crescent moon, façades with lit windows, a brick tower, the fortress wall and glowing street lamps.
- **Advent in Osijek:** pale winter sky, snow-capped façades with warm windows, a decorated advent tree with a star, a tram and falling snow.
- **Kopački Rit:** soft green-and-cream sky, marsh water with reeds and cattails, a heron and a boardwalk.
- **Baranja Vineyards:** warm golden sky, three rolling hills of vine rows, a white wine cellar with an arched door and barrels.
- **Pannonian Finale:** night sky with fireworks over a dark city skyline with a church spire and a bridge over the river.
- Chapters 5, 6 and 10 (by night and festival) get a dark haze; Advent and the finale also get twinkling string lights.
Each chapter has its own treat: orahnjača, licitar heart, šaran, grozd and krafna.

## Proportions
- About 2.5 heads tall: a big head (radius 12–14 px) on a short body.
- Seka: 24 × 54 px collision box, drawn about 62 px tall.
- Braco: 30 × 58 px box, drawn about 66 px tall.
- The world grid is 40 px tiles on a 1280 × 720 canvas (32 × 18 tiles).

## Typography
- **Fredoka** (rounded, friendly) for the logo, menus and HUD.
- Fallbacks: Baloo 2, Trebuchet MS, Segoe UI.
- The logo uses a cream fill, a thick ink stroke and a 6 px drop shadow.

## UI
- Panels: cream `#f7ecd8` with a 4 px ink border, 22 px corner radius and a solid 8 px drop shadow (no blur).
- Buttons: cream fill (gold for the main action) with a 3 px border and a 5 px drop shadow. They lift on hover and focus and press down on click.
- The HUD has three parts:
  - top-left: the level badge
  - top-centre: a key reminder
  - top-right: three treat slots that light up when found
  - Hints appear in a speech-bubble panel at the bottom.

## Animation
- **Walking:** legs and arms swing from a walk phase driven by speed.
- **Landing:** a quick squash.
- **Blinking:** every few seconds, at different times for each character.
- **Objects:**
  - levers ease between positions
  - bells swing while ringing, with a countdown ring
  - gates slide
  - stew bubbles and water waves move
  - treats bob and sparkle
- **Particles:** dust on jumps and landings, sparkles on treats, debris when walls break, splashes on hazards and confetti at the exit.
- **Reduce motion** (in Settings) stops bobbing, waves, squash and twinkling.
