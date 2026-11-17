# Level list

All 50 levels, generated from the level files by `node tools/make-levels-md.js`.
Every level is checked by `node tools/verify.js`, which plays it with a scripted solution
using the real game physics and requires both players at the exit and all 3 treats collected.

Jump limits used when designing: Seka climbs 3 blocks (about 3.4), Braco 2 (about 2.4);
Seka standing on Braco reaches 4, Braco on Seka reaches 3. A hay bale launches about 7.5 blocks.

## Chapter 1: Old Town & Tvrđa

_Red-brick towers, baroque façades and the old fortress walls. Treat: kulen slices._

| # | Level | Idea | Mechanics |
|---|---|---|---|
| 1 | Hello, Osijek | Walk, jump a stew pit and climb small steps. Both heroes must stand in the door. | moving, jumping, stew hazard, shared exit |
| 2 | Hold the Door | Pressure plates hold gates open only while someone stands on them, so the heroes take turns holding the door. | pressure plates, gates, Seka jumps higher |
| 3 | Shoulder Ride | A wall four tiles high: Seka stands on Braco’s head to get up, then works a lever to bring a lift down and back up for him. | standing on each other, levers, lifts |
| 4 | Strong Brother | Only Braco can push crates: one crate holds a plate down permanently, another becomes a step up a ledge. | crates, plates, crate as a step |
| 5 | Ribbon Bridges | Embroidered ribbons hold Seka but not Braco. She crosses first and makes solid bridges appear for him: once with a lever, once by standing on a plate. | ribbon bridges, appearing bridges, lever vs plate |
| 6 | Paprika Parasol | Seka glides over a huge stew pool with her umbrella, then rides a plate-powered ferry back for Braco. At the end Braco climbs on Seka’s head. | gliding, plate-driven ferry, Braco stands on Seka |
| 7 | Heavy Plate | A heavy plate needs Braco or a crate. Seka gets past the gate and drops a crate from a high shelf, which Braco then uses as a permanent weight. | heavy plates, trapdoors, crates |
| 8 | Cracked Walls | Two floors. Braco smashes through cracked brick to reach a plate for Seka upstairs; she pulls a lever that opens his last gate, then drops down to meet him. | cracked walls, split routes, plates, levers |
| 9 | Cathedral Climb | A vertical climb inside the red-brick tower. Plate lift, then a head-boost, then a lever lift, then a crate step to reach the top. | vertical climb, two lifts, head boost, crate step |
| 10 | Fortress Gate | Chapter finale: smash a wall to free a crate, weigh down a heavy plate, cross ribbons while holding a bridge, and build a crate step. | cracked wall, heavy plate, ribbon, appearing bridge, crate step |

## Chapter 2: Tram Lines

_Blue trams, overhead wires and busy city streets. Treat: paprika peppers._

| # | Level | Idea | Mechanics |
|---|---|---|---|
| 11 | All Aboard | Ride a self-driving tram across the stew canal together, then hop up wooden ledges you can jump through from below. | moving trams, one-way ledges |
| 12 | Bell Buttons | Tram bells keep a gate open for a few seconds after you step off. The last gate needs two bells rung at the same time. | timed bells, AND gate, quick teamwork |
| 13 | Lift Operators | Two tall lifts, each driven by a plate on the other side. Each hero runs the lift for the other. | plate-driven lifts, role swap |
| 14 | Crate Commute | Braco rides a lift up with a crate. Upstairs he holds a heavy plate so Seka can reach the stairs, then uses the crate as a step. | crate on a lift, heavy plate, one-way stairs, crate step |
| 15 | Signal Barrier | The tram passes under a barrier that only opens while someone stands on a plate, so the heroes cross one at a time and hold the barrier for each other. | moving tram, plates on both sides, riding through a gate, vertical lift |
| 16 | Overhead Wires | Seka climbs a ladder of ledges to ring a bell that runs Braco’s lift for a few seconds. Upstairs he pushes a crate onto a heavy plate to open the way. | bell-driven lift, one-way ledges, ribbon, crate on heavy plate |
| 17 | Double Line | The way out needs two plates pressed at once. One crate sits on a ledge only reachable together and drops straight onto its plate; the other hides in a closet that Seka unlocks. | AND gate, two crates, Braco stands on Seka, lever |
| 18 | Power Lever | Two trams sit still until Seka switches on the power from a high ledge. Then both hop tram, pillar, tram across the canal. | powered trams, timing hops, high lever |
| 19 | Depot Switches | Two separate lanes with levers that open each other’s gates, and one inverted gate. The order you pull them in matters. | lever logic, inverted gate, split lanes, AND gate |
| 20 | Last Tram Home | Chapter finale: a bell powers the depot lift, a slow tram ferries Braco and a crate over a gap, and the crate weighs down the heavy plate at the end. | bell-powered lift, crate on a tram, heavy plate, glide |

## Chapter 3: Drava Riverfront

_Sunset on the promenade, boats and springy piers. Treat: bowls of fiš._

| # | Level | Idea | Mechanics |
|---|---|---|---|
| 21 | Promenade | Braco pushes a crate into the river inlet so it becomes a stepping stone, then springy hay bales launch both up the embankment. | crate fills a water gap, springs, Drava water |
| 22 | Drawbridge | The river is too wide to jump. Braco powers a lift to the top of a lookout tower; from there Seka glides all the way across and lowers the drawbridge. | lookout lift, long glide, drawbridge lever |
| 23 | Spring Islands | A chain of hay-bale islands across the river with a lock gate in the middle. One holds the gate while the other bounces across, then they swap. | spring chain, plates on both banks, gate across the air |
| 24 | Canal Lock | A boat in a lock carries Braco and a crate up to the high quay. Levers on both quays work the lock, so each hero operates it for the other. | boat lift, levers on two levels, crate on a boat, heavy plate |
| 25 | Gull’s Glide | Seka climbs three ledges and makes the longest glide yet across the whole river while Braco keeps the lock gate open; he follows by boat and rides a lift she powers. | very long glide, boat, plate-held gate, plate lift |
| 26 | Bridge Builders | Three bridge sections, each with a different switch: a crate on a plate, a lever only reachable by gliding, and a bell Braco must beat. | three bridges, crate weight, glide to lever, timed bell |
| 27 | Under the Bridge | Seka walks on the bridge deck, Braco under it. He makes a stepping stone, then bounces up through a hatch she opens, and finally climbs a wall using the crate on the deck. | split heights, hatch over a spring, crate stepping stone, crate step |
| 28 | Riverside Relay | A six-step relay between two lanes, alternating plates, levers and a bell. Each hero’s switch opens the next gate for the other. | relay, plates, levers, timed bell, split lanes |
| 29 | Fishermen’s Pier | Seka bounces and glides to a lever on a high perch to open the river gate. Braco ferries a crate across on the boat to weigh down the heavy plate at the far pier. | spring + glide, crate on a boat, gate over the river, heavy plate |
| 30 | Sunset over the Drava | Chapter finale: Seka bounces up to ring the bridge bell and holds it while Braco pushes a crate over the whole river, then glides across herself. | spring to bell, appearing bridge, long crate push, glide, crate step |

## Chapter 4: Golden Fields

_Wheat, sunflowers, hay bales and old barns. Treat: pogača loaves._

| # | Level | Idea | Mechanics |
|---|---|---|---|
| 31 | Harvest Path | Welcome to the fields — and to iron harrow spikes. Hop the small pits and let Braco shove a crate into the wide one so it becomes a safe step. | spikes, crate fills a spike pit |
| 32 | Barn Doors | The old barn is boarded up. Braco smashes in, stands on the threshing plate to open the fence, and Seka runs ahead to pin the fence open with a lever. | cracked barn walls, plate-and-lever relay, spikes |
| 33 | Combine Lift | A hay wagon rolls across a field of spikes, but only while someone keeps the brake plate pressed. Ride it in turns. | wagon moves while powered, lever takes over from a plate, cracked wall |
| 34 | Silo | Seka climbs on Braco’s shoulders to reach the silo loft and pull the lever that opens the bale pen. One springy bale launches both onto the silo roof. | shoulder ride (4 tiles), lever opens a pen, spring to the roof, cracked wall |
| 35 | Scarecrow Switches | The fence opens only while the scarecrow bell rings AND the heavy plate is held. Braco parks a crate on the plate, Seka rings the bell, and both dash through. | timer bell, AND gate (two channels), crate on heavy plate |
| 36 | Bale Bridge | Two folding hay-cart bridges cross the spikes, each held up by plates on both ends. Leapfrog: one holds, the other crosses, then swap. | solid bridges while powered, plates on both ends, leapfrog teamwork |
| 37 | Windy Field | Seka climbs the hay hill on Braco’s shoulders and rides the wind on her paprika umbrella all the way across the spike field to start the hay wagon for him. | shoulder ride, very long glide, wagon powered by a lever |
| 38 | Sunflower Maze | Two paths through the sunflowers: Seka takes the high road over a ribbon bridge, Braco smashes through the low road. Each opens the other’s gate. | split paths, ribbon bridge, cracked wall, lever + plate exchange |
| 39 | Tractor Trailer | Braco loads a crate onto the tractor trailer and rides it across the spikes. On the far side he shoves the crate onto the heavy plate that opens the farm gate. Seka starts the tractor from the hayloft. | crate rides a moving platform, heavy plate, lever-powered trailer |
| 40 | Golden Hour | Chapter finale at sunset: fill a spike pit, smash into the barn, hold the heavy plate, ring the bell to start the wagon, pin the gate open and bounce up to the hilltop exit. | crate fills a pit, cracked wall, heavy plate, timer-powered wagon, lever, spring |

## Chapter 5: Fiš & Fun Festival

_Cauldrons, string lights and everything you have learned. Treat: čobanac pots._

| # | Level | Idea | Mechanics |
|---|---|---|---|
| 41 | Festival Gates | Welcome to the fiš festival! A warm-up lap through bubbling paprikaš cauldrons: a bell gate, a plate-and-lever gate and a shoulder ride for the last treat. | paprikaš stew, timer bell, plate-and-lever relay, shoulder ride |
| 42 | Cauldron Crossing | The festival terrace is too high for Braco, so a crate becomes his step stool. Up top, a second crate goes into the cauldron to make a crossing. | crate as a step, crate fills a stew pit, plate-and-lever relay |
| 43 | String Lights | Seka tightrope-walks the festival string lights, pulling levers for Braco’s gates below. Near the end, Braco returns the favour with a plate. | ribbon walkways, levers from above, plate opens the upper gate, stew |
| 44 | Stage Lift | The band stage is reached by a single stage lift. The plate below and the lever on stage both drive it, so the one on top must operate it for the one below. | lift driven by plate OR lever, operating a lift for your partner |
| 45 | Fireworks | Hay bales float on rafts in the stew pool. Bounce from bale to bale like fireworks — but the firework gate in mid-air only opens while a partner powers it. | spring chain, gate in mid-air, plate on one side, bell on the other |
| 46 | Dance Floor | The dance floor over the stew has two sets of tiles: flipping the lever swaps which set is solid. Hop from island to island while your partner calls the beat. | lever swaps two bridge sets, safe islands, turn-taking |
| 47 | Kitchen Tent | Inside the cooks’ tent the pantry door needs two things at once: a heavy pot (the crate) on the heavy plate, and someone on the light plate. | cracked tent walls, crate on heavy plate, AND gate, lever takes over |
| 48 | Tram to the Fair | Two festival trams cross the stew lake. The first runs while the depot plate is held or the platform bell rings; the second runs on its own bell. | two looping trams, plate OR bell, timed rides |
| 49 | Ferris Wheel | Gondolas rise and fall in turns like a ferris wheel. Hop across where they pass each other at the same height to reach the hilltop; plate and lever share the gate. | four moving gondolas in opposite phases, timing jumps, plate-and-lever relay |
| 50 | Grand Fiš Feast | The grand finale: a crate into the stew, a shoulder ride to the upper terrace, string lights, a smashed wall, a heavy plate, a bell-powered lift and one last lever before the feast. | crate fills a stew pit, shoulder ride, ribbon, cracked wall, spikes, lever, heavy plate, bell-powered lift |
