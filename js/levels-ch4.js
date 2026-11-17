/* Chapter 4 — Golden Fields: spikes, barns, hay bales, wagons and long glides. */
(function (L) {
  'use strict';

  // 31
  L.add({
    name: "Harvest Path",
    idea: "Welcome to the fields — and to iron harrow spikes. Hop the small pits and let Braco shove a crate into the wide one so it becomes a safe step.",
    mech: ["spikes", "crate fills a spike pit"],
    hint: "Spikes are only dangerous if you touch them. {B} can push the crate into the wide pit — then it is a safe stepping stone.",
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
      '#..........................o...#',
      '#.........................---..#',
      '#......o............o..........#',
      '#12.......C.................E..#',
      '######^^#####^^^###^^###########',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "sign", x: 4, y: 13, text: "Mind the harrow spikes!" },
      { t: "sign", x: 11, y: 13, text: "Fill the wide pit" }
    ]
  });

  // 32
  L.add({
    name: "Barn Doors",
    idea: "The old barn is boarded up. Braco smashes in, stands on the threshing plate to open the fence, and Seka runs ahead to pin the fence open with a lever.",
    mech: ["cracked barn walls", "plate-and-lever relay", "spikes"],
    hint: "{B} breaks the boards by walking into them. While {B} stands on the plate inside, {S} runs through the fence and pulls the lever so it stays open.",
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
      '#.......#########..............#',
      '#.......X...o...X.............o#',
      '#.......X.......X............--#',
      '#.......X.......X..o...........#',
      '#12.....X.......X...........E..#',
      '##################^^############',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "plate", x: 12, y: 13, ch: "a" },
      { t: "gate", x: 22, y: 1, h: 13, ch: "a" },
      { t: "lever", x: 25, y: 13, ch: "a" }
    ]
  });

  // 33
  L.add({
    name: "Combine Lift",
    idea: "A hay wagon rolls across a field of spikes, but only while someone keeps the brake plate pressed. Ride it in turns.",
    mech: ["wagon moves while powered", "lever takes over from a plate", "cracked wall"],
    hint: "Stand on the plate to roll the wagon. The rider pulls the lever on the far side so the wagon keeps rolling for the other one.",
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
      '#.o........................X..o#',
      '#..........................X...#',
      '#..............o...........X...#',
      '#12........................X.E.#',
      '#######^^^^^^^^^^^^^^^^^^#######',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "plate", x: 4, y: 13, ch: "a" },
      { t: "lever", x: 26, y: 13, ch: "a" },
      { t: "lift", x: 7, y: 14, w: 3, to: [22, 14], ch: "a", loop: true, skin: "wagon", speed: 120 }
    ]
  });

  // 34
  L.add({
    name: "Silo",
    idea: "Seka climbs on Braco’s shoulders to reach the silo loft and pull the lever that opens the bale pen. One springy bale launches both onto the silo roof.",
    mech: ["shoulder ride (4 tiles)", "lever opens a pen", "spring to the roof", "cracked wall"],
    hint: "{S} jumps onto {B}’s head, then onto the loft, and pulls the lever. The hay bale bounces you onto the roof — steer right!",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#.....................##########',
      '#........................X.....#',
      '#........................X..o..#',
      '#........................X...E.#',
      '#...................o.##########',
      '#.....o...............##########',
      '#.....................##########',
      '#.....................##########',
      '#############.........##########',
      '#.....................##########',
      '#.....................##########',
      '#12.................b.##########',
      '################################',
      '################################'
    ],
    obj: [
      { t: "lever", x: 3, y: 11, ch: "a" },
      { t: "gate", x: 18, y: 11, h: 5, ch: "a" }
    ]
  });

  // 35
  L.add({
    name: "Scarecrow Switches",
    idea: "The fence opens only while the scarecrow bell rings AND the heavy plate is held. Braco parks a crate on the plate, Seka rings the bell, and both dash through.",
    mech: ["timer bell", "AND gate (two channels)", "crate on heavy plate"],
    hint: "Push the crate onto the heavy plate first. Then {S} rings the bell on the ledge — the fence stays open for 4 seconds, so both of you run!",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#............o.................#',
      '#..............................#',
      '#..............................#',
      '#...........---................#',
      '#.....................o.......o#',
      '#12..C......................E..#',
      '#####################^^#########',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "plate", x: 9, y: 13, ch: "b", heavy: true },
      { t: "timer", x: 13, y: 10, ch: "a", dur: 4 },
      { t: "gate", x: 18, y: 1, h: 13, ch: ['a', 'b'] },
      { t: "sign", x: 3, y: 13, text: "Heavy plate: only {B} or a crate" }
    ]
  });

  // 36
  L.add({
    name: "Bale Bridge",
    idea: "Two folding hay-cart bridges cross the spikes, each held up by plates on both ends. Leapfrog: one holds, the other crosses, then swap.",
    mech: ["solid bridges while powered", "plates on both ends", "leapfrog teamwork"],
    hint: "A bridge stays up while someone stands on one of its plates. Take turns: hold, cross, hold from the other side.",
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
      '#..............o...............#',
      '#.........o...........o........#',
      '#..............................#',
      '#12..........................E.#',
      '######^^^^^^^^####^^^^^^^^######',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "plate", x: 3, y: 13, ch: "a" },
      { t: "plate", x: 15, y: 13, ch: "a" },
      { t: "plate", x: 16, y: 13, ch: "b" },
      { t: "plate", x: 27, y: 13, ch: "b" },
      { t: "gate", x: 6, y: 14, w: 8, h: 1, ch: "a", inv: true },
      { t: "gate", x: 18, y: 14, w: 8, h: 1, ch: "b", inv: true }
    ]
  });

  // 37
  L.add({
    name: "Windy Field",
    idea: "Seka climbs the hay hill on Braco’s shoulders and rides the wind on her paprika umbrella all the way across the spike field to start the hay wagon for him.",
    mech: ["shoulder ride", "very long glide", "wagon powered by a lever"],
    hint: "{S} stands on {B}, hops onto the hill, then jumps and holds jump to glide across. The lever on the far side starts the wagon for {B}.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#.o..........o.................#',
      '#..............................#',
      '#####..........................#',
      '#####..........................#',
      '#####.........o................#',
      '#####.12....................E..#',
      '########^^^^^^^^^^^^^^##########',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "lever", x: 24, y: 13, ch: "a" },
      { t: "lift", x: 8, y: 14, w: 3, to: [19, 14], ch: "a", loop: true, skin: "wagon", speed: 120 }
    ]
  });

  // 38
  L.add({
    name: "Sunflower Maze",
    idea: "Two paths through the sunflowers: Seka takes the high road over a ribbon bridge, Braco smashes through the low road. Each opens the other’s gate.",
    mech: ["split paths", "ribbon bridge", "cracked wall", "lever + plate exchange"],
    hint: "{S} climbs the ledges to the upper path and pulls the lever for {B}’s gate. {B} then stands on the plate past his gate to open {S}’s.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..........................o...#',
      '#.............o................#',
      '###----#####=====########......#',
      '#.......X......................#',
      '#..----.X......................#',
      '#.......X.....o................#',
      '#12.....X....................E.#',
      '#############^^#################',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "lever", x: 19, y: 8, ch: "a" },
      { t: "gate", x: 21, y: 10, h: 4, ch: "a" },
      { t: "plate", x: 23, y: 13, ch: "b" },
      { t: "gate", x: 22, y: 1, h: 8, ch: "b" }
    ]
  });

  // 39
  L.add({
    name: "Tractor Trailer",
    idea: "Braco loads a crate onto the tractor trailer and rides it across the spikes. On the far side he shoves the crate onto the heavy plate that opens the farm gate. Seka starts the tractor from the hayloft.",
    mech: ["crate rides a moving platform", "heavy plate", "lever-powered trailer"],
    hint: "{B} pushes the crate onto the trailer and climbs on too. {S} pulls the hayloft lever to start it. On the far side, push the crate onto the heavy plate.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#.o............................#',
      '#..............................#',
      '#.............................o#',
      '#---...........................#',
      '#.............o................#',
      '#12.C........................E.#',
      '######^^^^^^^^^^^^^^^^^^########',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "lever", x: 2, y: 10, ch: "a" },
      { t: "plate", x: 26, y: 13, ch: "b", heavy: true },
      { t: "gate", x: 28, y: 1, h: 13, ch: "b" },
      { t: "lift", x: 6, y: 14, w: 3, to: [21, 14], ch: "a", loop: true, skin: "wagon", speed: 110, pause: 1.5 }
    ]
  });

  // 40
  L.add({
    name: "Golden Hour",
    idea: "Chapter finale at sunset: fill a spike pit, smash into the barn, hold the heavy plate, ring the bell to start the wagon, pin the gate open and bounce up to the hilltop exit.",
    mech: ["crate fills a pit", "cracked wall", "heavy plate", "timer-powered wagon", "lever", "spring"],
    hint: "Crate into the pit, then {B} smashes into the barn and holds the heavy plate. {S} rings the bell, rides the wagon and pulls the lever so {B} can follow. The hay bale bounces you up to the exit.",
    map: [
      '################################',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#...........................o..#',
      '#..............................#',
      '#..............................#',
      '#..............................#',
      '#.........######.............E.#',
      '#.........X..o...............###',
      '#.........X..................###',
      '#.........X..........o.......###',
      '#12C......X................b.###',
      '######^^##########^^^^^^^#######',
      '################################',
      '################################',
      '################################'
    ],
    obj: [
      { t: "plate", x: 13, y: 13, ch: "a", heavy: true },
      { t: "gate", x: 16, y: 1, h: 13, ch: "a" },
      { t: "timer", x: 17, y: 13, ch: "b", dur: 5 },
      { t: "lever", x: 25, y: 13, ch: "a" },
      { t: "lift", x: 18, y: 14, w: 3, to: [22, 14], ch: "b", loop: true, skin: "wagon", speed: 120 }
    ]
  });

})(SB_LEVELS);
