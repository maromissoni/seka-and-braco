/* Chapter 5 — Fiš & Fun Festival: everything you have learned, plus stew cauldrons. */
(function (L) {
  'use strict';

  // 41
  L.add({
    name: "Festival Gates",
    idea: "Welcome to the fiš festival! A warm-up lap through bubbling paprikaš cauldrons: a bell gate, a plate-and-lever gate and a shoulder ride for the last treat.",
    mech: ["paprikaš stew", "timer bell", "plate-and-lever relay", "shoulder ride"],
    hint: "Stew is hot — jump over it! The bell keeps the first gate open for 3 seconds. Use the plate and lever for the second gate.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#...........................o..#',
      '#..........................--..#',
      '#....o.......o.................#',
      '#..............................#',
      '#12..........................E.#',
      '#####~~######~~##########~~#####',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "timer", x: 8, y: 13, ch: "a", dur: 3 },
      { t: "gate", x: 10, y: 1, h: 13, ch: "a" },
      { t: "plate", x: 17, y: 13, ch: "b" },
      { t: "gate", x: 20, y: 1, h: 13, ch: "b" },
      { t: "lever", x: 23, y: 13, ch: "b" },
      { t: "sign", x: 3, y: 13, text: "Careful: hot paprikaš!" }
    ]
  });

  // 42
  L.add({
    name: "Cauldron Crossing",
    idea: "The festival terrace is too high for Braco, so a crate becomes his step stool. Up top, a second crate goes into the cauldron to make a crossing.",
    mech: ["crate as a step", "crate fills a stew pit", "plate-and-lever relay"],
    hint: "{B} pushes the low crate against the wall and climbs it. Push the top crate into the cauldron, then hold the plate so {S} can reach the lever.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..........................o...#',
      '#..............o...............#',
      '#..............................#',
      '#..o........C................E.#',
      '#.........####~~################',
      '#.........######################',
      '#12..C....######################',
      '################################',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "plate", x: 19, y: 10, ch: "a" },
      { t: "gate", x: 22, y: 1, h: 10, ch: "a" },
      { t: "lever", x: 25, y: 10, ch: "a" }
    ]
  });

  // 43
  L.add({
    name: "String Lights",
    idea: "Seka tightrope-walks the festival string lights, pulling levers for Braco’s gates below. Near the end, Braco returns the favour with a plate.",
    mech: ["ribbon walkways", "levers from above", "plate opens the upper gate", "stew"],
    hint: "Only {S} can walk on the string lights. Pull the levers up there to open {B}’s gates. {B} stands on the plate to open the last gate on the lights.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#............o.............o...#',
      '#..............................#',
      '#....========..========...====.#',
      '#..............................#',
      '#.---..........................#',
      '#...............o..............#',
      '#12..........................E.#',
      '########~~######~~######~~######',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "lever", x: 11, y: 8, ch: "a" },
      { t: "gate", x: 12, y: 10, h: 4, ch: "a" },
      { t: "lever", x: 19, y: 8, ch: "b" },
      { t: "gate", x: 20, y: 10, h: 4, ch: "b" },
      { t: "plate", x: 22, y: 13, ch: "c" },
      { t: "gate", x: 24, y: 1, h: 8, ch: "c" }
    ]
  });

  // 44
  L.add({
    name: "Stage Lift",
    idea: "The band stage is reached by a single stage lift. The plate below and the lever on stage both drive it, so the one on top must operate it for the one below.",
    mech: ["lift driven by plate OR lever", "operating a lift for your partner"],
    hint: "One stands on the plate while the other rides up. On stage: lever ON keeps the lift up, OFF sends it down. Bring it down for your partner, then switch it on again.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..........o.........o.........#',
      '#..............................#',
      '#.......................E......#',
      '#...........#####~~########....#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..o...........................#',
      '#..............................#',
      '#..............................#',
      '#12............................#',
      '################################',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "plate", x: 5, y: 13, ch: "a" },
      { t: "lever", x: 14, y: 5, ch: "a" },
      { t: "lift", x: 10, y: 14, w: 2, to: [10, 6], ch: "a", speed: 130 }
    ]
  });

  // 45
  L.add({
    name: "Fireworks",
    idea: "Hay bales float on rafts in the stew pool. Bounce from bale to bale like fireworks — but the firework gate in mid-air only opens while a partner powers it.",
    mech: ["spring chain", "gate in mid-air", "plate on one side, bell on the other"],
    hint: "Steer while you bounce. One holds the plate so the mid-air gate opens; on the far side, stand on the bell to keep it open for the other.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#.........o.........o..........#',
      '#..............................#',
      '#..............o...............#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#12.....b....b....b....b....E..#',
      '######~~~~~~~~~~~~~~~~~~~~######',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "plate", x: 2, y: 13, ch: "a" },
      { t: "timer", x: 29, y: 13, ch: "a", dur: 6 },
      { t: "gate", x: 16, y: 1, h: 12, ch: "a" }
    ]
  });

  // 46
  L.add({
    name: "Dance Floor",
    idea: "The dance floor over the stew has two sets of tiles: flipping the lever swaps which set is solid. Hop from island to island while your partner calls the beat.",
    mech: ["lever swaps two bridge sets", "safe islands", "turn-taking"],
    hint: "Wait on a stone island while your partner flips the lever, then cross the tiles that appear. Each side has a lever.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#...........................o..#',
      '#..............................#',
      '#............o.....o...........#',
      '#12..........................E.#',
      '#####~~~~~#~~~~~#~~~~~#~~~~#####',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "lever", x: 3, y: 13, ch: "a" },
      { t: "lever", x: 28, y: 13, ch: "a" },
      { t: "gate", x: 5, y: 14, w: 5, h: 1, ch: "a", inv: true },
      { t: "gate", x: 11, y: 14, w: 5, h: 1, ch: "a" },
      { t: "gate", x: 17, y: 14, w: 5, h: 1, ch: "a", inv: true },
      { t: "gate", x: 23, y: 14, w: 4, h: 1, ch: "a" }
    ]
  });

  // 47
  L.add({
    name: "Kitchen Tent",
    idea: "Inside the cooks’ tent the pantry door needs two things at once: a heavy pot (the crate) on the heavy plate, and someone on the light plate.",
    mech: ["cracked tent walls", "crate on heavy plate", "AND gate", "lever takes over"],
    hint: "{B} smashes in and pushes the crate onto the heavy plate. {S} stands on the other plate so {B} can pass, then {B} pulls the lever for {S}.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#.....#####################....#',
      '#.....X.......o...........X....#',
      '#.....X...................X....#',
      '#..o..X...................X....#',
      '#.....X................o..X....#',
      '#12...X..C................X..E.#',
      '#######################~~#######',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "plate", x: 12, y: 13, ch: "a", heavy: true },
      { t: "plate", x: 16, y: 13, ch: "b" },
      { t: "gate", x: 19, y: 9, h: 5, ch: ['a', 'b'] },
      { t: "lever", x: 22, y: 13, ch: "b" }
    ]
  });

  // 48
  L.add({
    name: "Tram to the Fair",
    idea: "Two festival trams cross the stew lake. The first runs while the depot plate is held or the platform bell rings; the second runs on its own bell.",
    mech: ["two looping trams", "plate OR bell", "timed rides"],
    hint: "Hold the plate so your partner can ride the first tram. On the island, standing on the bell keeps that tram running for the other. Then ring the second bell and hop on together.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#.............o................#',
      '#..............................#',
      '#........o...........o.........#',
      '#.21.........................E.#',
      '#####~~~~~~~~~###~~~~~~~~~~#####',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "plate", x: 1, y: 13, ch: "a" },
      { t: "timer", x: 14, y: 13, ch: "a", dur: 5 },
      { t: "timer", x: 16, y: 13, ch: "b", dur: 7 },
      { t: "lift", x: 5, y: 14, w: 3, to: [11, 14], ch: "a", loop: true, skin: "tram", speed: 120 },
      { t: "lift", x: 17, y: 14, w: 3, to: [24, 14], ch: "b", loop: true, skin: "tram", speed: 120 }
    ]
  });

  // 49
  L.add({
    name: "Ferris Wheel",
    idea: "Gondolas rise and fall in turns like a ferris wheel. Hop across where they pass each other at the same height to reach the hilltop; plate and lever share the gate.",
    mech: ["four moving gondolas in opposite phases", "timing jumps", "plate-and-lever relay"],
    hint: "Neighbouring gondolas move in opposite directions — jump across when they are level. The plate at the start holds the hilltop gate open until the lever is pulled.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#.........o.........o..........#',
      '#..............................#',
      '#............................E.#',
      '#......................#########',
      '#......................#########',
      '#......................#########',
      '#......................#########',
      '#.o....................#########',
      '#......................#########',
      '#......................#########',
      '#21....................#########',
      '###~~~~~~~~~~~~~~~~~~~~#########',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "plate", x: 1, y: 13, ch: "a" },
      { t: "gate", x: 25, y: 1, h: 5, ch: "a" },
      { t: "lever", x: 27, y: 5, ch: "a" },
      { t: "lift", x: 4, y: 12, w: 3, to: [4, 5], speed: 90, pause: 0.6, skin: "gondola" },
      { t: "lift", x: 9, y: 5, w: 3, to: [9, 12], speed: 90, pause: 0.6, skin: "gondola" },
      { t: "lift", x: 14, y: 12, w: 3, to: [14, 5], speed: 90, pause: 0.6, skin: "gondola" },
      { t: "lift", x: 19, y: 5, w: 3, to: [19, 12], speed: 90, pause: 0.6, skin: "gondola" }
    ]
  });

  // 50
  L.add({
    name: "Grand Fiš Feast",
    idea: "The grand finale: a crate into the stew, a shoulder ride to the upper terrace, string lights, a smashed wall, a heavy plate, a bell-powered lift and one last lever before the feast.",
    mech: ["crate fills a stew pit", "shoulder ride", "ribbon", "cracked wall", "spikes", "lever", "heavy plate", "bell-powered lift"],
    hint: "{B} fills the stew pit and boosts {S} onto the ledge. Upstairs, {S} opens {B}’s gate. {B} stands on the heavy plate so {S} can reach the last lever, then rings the bell next to the lift and hops on when it comes down.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#.................o............#',
      '#............................E.#',
      '#..........##~~#====#####..#####',
      '#.......o...X..................#',
      '#...........X..................#',
      '#......---..X..................#',
      '#...........X..................#',
      '#...........X...o..............#',
      '#12C........X..................#',
      '#####~~########^^###############',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "lever", x: 21, y: 6, ch: "a" },
      { t: "gate", x: 20, y: 8, h: 6, ch: "a" },
      { t: "plate", x: 22, y: 13, ch: "b", heavy: true },
      { t: "timer", x: 24, y: 13, ch: "c", dur: 6 },
      { t: "gate", x: 27, y: 1, h: 6, ch: "b" },
      { t: "lever", x: 28, y: 6, ch: "b" },
      { t: "lift", x: 25, y: 14, w: 2, to: [25, 7], ch: "c", loop: true, speed: 120, pause: 0.8 },
      { t: "sign", x: 4, y: 6, text: "Last stop: the grand fiš feast!" }
    ]
  });

})(SB_LEVELS);
