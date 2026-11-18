# Level list

All 100 levels, generated from the level files by `node tools/make-levels-md.js`.
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

## Chapter 6: Tvrđa by Night

_Lantern-lit fortress walls under the stars. Treat: walnut-roll slices._

| # | Level | Idea | Mechanics |
|---|---|---|---|
| 51 | Lantern Walk | A night-time warm-up along the fortress: spikes, a plate-and-lever relay and a bell bridge over the moat that only stays for four seconds. | spikes, plate-and-lever relay, shoulder ride, timed bridge |
| 52 | Moat Bridges | Two moats, two bridges, and each bridge is switched from the wrong side. A heavy plate, a bell and a shoulder ride get both of you over. | bridges that appear while powered, heavy plate, timer bell, shoulder ride |
| 53 | Watchtower | Seka climbs the watchtower ledges while Braco works the cellar below: smash the wall, park the crate on the heavy plate, then ride the tower lift when Seka pulls the lever. | one-way ledges, cracked wall, crate on a heavy plate, lever-driven lift |
| 54 | Two Crates | One crate has to fill the spike pit and the other has to hold a heavy plate — and later become a step. Push them in the right order. | crate fills a pit, crate on a heavy plate, lever, crate as a step |
| 55 | Gatehouse | The gatehouse only opens when two plates are pressed at once — but there are only two of you and both need to get through. A crate, a lever and a quick bell dash solve it. | gate needing two switches, crate on a plate, heavy plate, lever, timer bell |
| 56 | Night Patrol | A long spike-lined ditch crossed only by patrolling platforms. Board together, change lifts at the right moment and grab the treats on the way. | self-moving lifts, timing jumps, spikes |
| 57 | Cracked Bastion | Two paths through the bastion: Braco smashes along the vaults below while Seka balances on the ribbons above. Each opens the way for the other. | split paths, cracked walls, ribbons, levers from above, plate opens the upper gate |
| 58 | Moonlit Toggle | One lever does two jobs: it raises the spike bridge and sends the lift up. Switching it off and on at the right moments is the whole puzzle. | lever toggles a bridge and a lift together, lever-driven lifts, spikes |
| 59 | Bell Tower | Every gate in the bell tower is opened from the wrong side, so you leapfrog: a heavy plate, a bell on a ledge, a plate and a bell, then a shoulder ride to the top lever. | heavy plate, timer bells, plate-and-bell relay, shoulder ride, spikes |
| 60 | Fortress Gate | Chapter finale: fill the pit, smash the postern, power the double gate with a plate and a lever, ring the bell for Braco and ride the looping lift up the keep. | crate fills a pit, cracked wall, gate needing two switches, shoulder ride, timer bell, looping lift |

## Chapter 7: Advent in Osijek

_Snowy squares, winter trams and twinkling lights. Treat: licitar hearts._

| # | Level | Idea | Mechanics |
|---|---|---|---|
| 61 | First Snow | The winter tram only runs while someone presses a switch. The plate is at the start and the bell is at the far stop, so you take turns riding. | looping tram, plate and bell share a channel, icy river |
| 62 | Gingerbread Steps | Giant gingerbread steps: the first is too tall for Braco, so he climbs on Seka. The second is too tall for anyone, so Seka climbs on Braco and sends a lift down for him. | Braco stands on Seka, Seka stands on Braco, lever-driven lift |
| 63 | Tram Depot | Hop off the first tram at the depot island, then switch on the second line and catch it to the far platform. | self-moving tram, lever-powered looping tram, timing jumps, icy river |
| 64 | Advent Lights | Seka walks the strings of Advent lights while Braco works below. The last gate needs both bells ringing at once, one up in the lights and one on the ground. | ribbon walkway, plate opens the upper gate, lever from above, cracked wall, gate needing two bells |
| 65 | Snow Trampolines | Snow-packed hay bales fling you up to the market roofs. One roof has the lever, the other has a bell — and Braco has to dash through before it stops ringing. | springs, lever on a roof, timer bell dash |
| 66 | Frozen Fountain | The ice bridge melts away the moment the heavy plate is pressed — but the plate is also the only way through the gate. Ferry the crate across first. | bridge that vanishes while powered, crate on a heavy plate, shoulder ride, cracked wall |
| 67 | Clock Tower | Climb the clock tower ledges while Braco holds the heavy plate, open the top gate for good, then ring the bell that runs his lift. | one-way ledges, heavy plate, lever, bell-powered looping lift |
| 68 | Cathedral Square | The cathedral gates are linked: when one opens, the other shuts. Step on and off the plate in the right order, then use a bell to let Braco through while the far gate is shut. | linked gates (one opens, one closes), plate and bell share a channel, cracked wall, crate on a heavy plate |
| 69 | Skating Line | A shuttle tram to the island, then a second tram that only runs while someone presses a switch: the heavy plate on the island or the bell at the far end. | self-moving tram, heavy plate and bell share a channel, looping tram, icy river |
| 70 | Advent Finale | Chapter finale in the Advent market: fill the icy pit, give Braco a lift up the step, cross the string lights to lower his bridge, then ring the bell on the ledge so he can dash through. | crate fills a pit, Braco stands on Seka, ribbon walkway, bridge lever, timer bell on a ledge |

## Chapter 8: Kopački Rit

_Reeds, marsh water and boardwalks in the nature park. Treat: grilled carp._

| # | Level | Idea | Mechanics |
|---|---|---|---|
| 71 | Boardwalk | Welcome to the marshes of Kopački rit. The boardwalk has a gap too wide to jump — Seka glides over and starts the reed raft for Braco. | one-way boardwalk, long glide, lever-powered looping raft, marsh water |
| 72 | Raft Ferry | The far gate needs a heavy weight on its plate, but nobody can stay behind. Load the crate onto the ferry raft and bring it across. | self-moving raft, crate rides the raft, crate on a heavy plate, marsh water |
| 73 | Lily Pads | Giant lily-pad rafts bob up and down in turns. Seka hops across first to open the gate on the far bank while Braco keeps the plate pressed. | bobbing rafts in opposite phases, timing jumps, plate-and-lever relay, marsh water |
| 74 | Fishing Huts | Three rafts link the fishing huts. Two of them share one switch, so turning it on to ferry Braco also sends the last raft away — switch it off again in time. | lever-driven rafts, two rafts on one switch, long glides, marsh water |
| 75 | Reed Labyrinth | The reed beds split into an upper and a lower path, and every gate is controlled from the other one — with a crate to keep the third gate open for good. | split paths, cracked reed wall, plate opens the upper gate, levers from above, crate on a heavy plate |
| 76 | Heron Watch | The bird-watching tower has three tall steps. Twice Seka climbs on Braco and sends a lift down for him; at the last step it is Braco’s turn to stand on Seka. | Seka stands on Braco, Braco stands on Seka, lever-driven lifts |
| 77 | Beaver Lodge | The heavy plate is deep inside the beaver lodge and the only crate is jammed at the back. Braco smashes in, hops over the crate and shoves it back to the plate while Seka works the lever on the roof. | cracked walls, lever from the roof, pushing a crate backwards, crate on a heavy plate |
| 78 | Spring Marsh | Springy tussocks are the only way over the marsh. Seka bounces up to a hidden roost to pull the gate lever; then Braco follows the same springs all the way to the far bank. | spring chains, steering in mid-air, lever on a high roost, marsh water |
| 79 | Bird Hide | The heavy plate is on the ground but the only crate is up in the bird hide. Seka rings the lift bell, dashes to hold the hide’s gate open, and Braco drops the crate onto the plate below. | bell-powered looping lift, plate opens a gate up high, dropping a crate onto a heavy plate |
| 80 | Rit Finale | Marsh finale: start the raft, ferry the crate to the island’s heavy plate, then bounce up to the heron roost for the last lever. | lever-powered looping raft, crate rides the raft, crate on a heavy plate, spring, lever on a high roost |

## Chapter 9: Baranja Vineyards

_Terraced vines, old wine cellars and harvest carts. Treat: grape bunches._

| # | Level | Idea | Mechanics |
|---|---|---|---|
| 81 | Vine Terraces | Three tall vineyard terraces. Braco climbs on Seka at each one — but at the top Seka has to come back down to help him after opening the gate. | Braco stands on Seka, heavy plate, lever, coming back to help |
| 82 | Wine Cellar | Two barrels, two heavy press plates and one gate that needs both. Braco sorts the barrels in the low cellar while Seka walks the roof to the exit lever. | Seka stands on Braco, two crates on two heavy plates, gate needing two switches, lever on the roof |
| 83 | Harvest Wagon | The harvest wagon runs along its track while a lever is on. Send Braco and the barrel to the far end, bring the wagon back for Seka, and let Braco call it over again. | lever-driven wagon, two levers on one channel, crate rides the wagon, crate on a heavy plate, spikes |
| 84 | Grape Stomp | The heavy grape press sits on a high shelf. Braco bounces up to stomp it, which opens the gate for Seka; later Seka bounces up to the lever that opens the last gate. | springs, heavy plate on a high shelf, lever, lever on a high shelf |
| 85 | Oak Barrels | The heavy plate is up on the cellar roof. The barrel lift goes up while any of its two levers is on — use that to send Braco and the barrel up first, then Seka. | lever-driven lift, two levers on one channel, crate rides the lift, crate on a heavy plate |
| 86 | Press House | A short timer opens the press-house door. Seka hops the spike trough in time, then holds the door open for Braco from the inside with a plate. | timer, plate and timer on one channel, spikes, Braco stands on Seka |
| 87 | Barrel Stairs | One barrel makes a step up to the press terrace; on top, Braco boosts Seka to the upper lever and she sends the lift up for him. | crate as a step, Seka stands on Braco, lever-driven lift |
| 88 | Cork Springs | A long spiky ditch between the rows of vines. Seka bounces off the hay bale and glides all the way across; the wagon only crosses back while she keeps off its plate. | spring, long glide, plate-driven wagon, Braco stands on Seka |
| 89 | Tasting Room | The tasting-room door needs the heavy barrel on the scale AND a bell rung on the high shelf — and the bell only rings for a few seconds. | crate on a heavy plate, spring, timer on a high shelf, gate needing two switches |
| 90 | Vineyard Finale | Everything from the vineyards at once: the barrel opens the cellar door, Seka bounces up to ring the bell, and the bell sends Braco’s lift up — but only for a few seconds. | crate on a heavy plate, spring, timer-driven lift, long glide |

## Chapter 10: Pannonian Finale

_Fireworks over the Drava and the hardest puzzles of all. Treat: krafne._

| # | Level | Idea | Mechanics |
|---|---|---|---|
| 91 | Harvest Road | The last journey across the plain. One lever swaps two barn doors: when the front one opens, the back one shuts. | lever, inverted gate, gates on one channel, Braco stands on Seka |
| 92 | Crate Relay | Two crates, two heavy scales and two doors in a row. Braco rolls each crate home; at the end he lifts Seka to the loft lever. | crates on heavy plates, two gates in a row, Seka stands on Braco, lever in a loft |
| 93 | Sunflower Wagons | The hay wagon shuttles over a spiky ditch on its own and waits only a moment at each end. Then the grain lift — up, down and up again. | looping wagon, jumping on together, lever-driven lift, two levers on one channel |
| 94 | Windmill Climb | Seka climbs the windmill’s inner floors; Braco can’t, so he rolls a sack onto the scale to open her trapdoor and waits on the grain lift. | crate on a heavy plate, climbing floating platforms, gate in the air, lever-driven lift |
| 95 | Three Bells | The festival gate needs three things at once: the sack on the scale, the lever in the loft — and the bell, which only rings for a moment. | gate needing three switches, crate on a heavy plate, Seka stands on Braco, timer |
| 96 | Plum Orchard | Two paths through the orchard: Seka along the high walkway, Braco along the ground. Each one opens the door on the other’s path. | Seka stands on Braco, split paths, lever for the partner, plate for the partner |
| 97 | Storm Bridge | The bridge over the flooded ditch is a drawbridge that only stays down while it has power: first from a short timer, then from a plate on the far side. | bridge gate (solid only while powered), timer, plate and timer on one channel, Braco stands on Seka |
| 98 | Twin Timers | The gate to the last field needs two bells ringing together, one on the ground and one on a hayloft. Ring them at the same moment and race! | crate as a step, two timers on one AND gate, acting at the same time |
| 99 | Starry Glide | A last flight under the stars: Seka bounces and glides to the windmill loft and starts the wagon, which ferries Braco across a long spiky ditch. | spring, long glide, lever-powered looping wagon, jumping on a moving wagon, Braco stands on Seka |
| 100 | Pannonian Finale | The very last level: the sack opens the barn, the bale throws Seka up to the bell, the bell lifts Braco — and one last boost brings them both home to the festival. | crate on a heavy plate, spring, timer-driven lift, long glide, Braco stands on Seka |
