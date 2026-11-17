/* Chapter 2 — Tram Lines: moving platforms, timers, lifts and switch logic. */
(function (L) {
  'use strict';
  var EMPTY = '#..............................#';

  // 11
  L.add({
    name: 'All Aboard',
    idea: 'Ride a self-driving tram across the stew canal together, then hop up wooden ledges you can jump through from below.',
    mech: ['moving trams', 'one-way ledges'],
    hint: 'Wait for the tram at the platform edge and step on together. Wooden ledges can be jumped through from below.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#.......................E......#',
      '#......................----....#',
      '#...........................o..#',
      '#..........................---.#',
      '#..o...........................#',
      '#............o..........---....#',
      '#.12...........................#',
      '#######................#########',
      '#######................#########',
      '#######................#########',
      '#######~~~~~~~~~~~~~~~~#########',
      '################################'
    ],
    obj: [
      { t: 'lift', x: 7, y: 13, w: 3, to: [20, 13], skin: 'tram', speed: 90, pause: 0.8 },
      { t: 'sign', x: 4, y: 8, text: 'Trams move on their own — hop on!' },
      { t: 'sign', x: 26, y: 4, text: 'Jump up through wooden ledges' }
    ]
  });

  // 12
  L.add({
    name: 'Bell Buttons',
    idea: 'Tram bells keep a gate open for a few seconds after you step off. The last gate needs two bells rung at the same time.',
    mech: ['timed bells', 'AND gate', 'quick teamwork'],
    hint: 'A bell keeps its gate open for a few seconds, then it closes. The last gate shows two symbols: both bells must be ringing together.',
    map: [
      '################################',
      '#..........#.........#.....#...#',
      '#..........#.........#.....#...#',
      '#..........#.........#.....#...#',
      '#..........#.........#.....#...#',
      '#..........#.........#.....#...#',
      '#..........#.........#.....#...#',
      '#..........#.........#.....#...#',
      '#..........#.........#.....#...#',
      '#..........#.........#.....#...#',
      '#..........#.........#.....#...#',
      '#..........#.........#.....#...#',
      '#.....o....#..o......#.....#...#',
      '#.............###..............#',
      '#.......................o......#',
      '#.12.........................E.#',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'timer', x: 6, y: 15, ch: 'a', dur: 4 },
      { t: 'gate', x: 11, y: 13, w: 1, h: 3, ch: 'a' },
      { t: 'timer', x: 15, y: 12, ch: 'b', dur: 5 },
      { t: 'gate', x: 21, y: 13, w: 1, h: 3, ch: 'b' },
      { t: 'timer', x: 23, y: 15, ch: 'c', dur: 3 }, { t: 'timer', x: 25, y: 15, ch: 'd', dur: 3 },
      { t: 'gate', x: 27, y: 13, w: 1, h: 3, ch: ['c', 'd'] }
    ]
  });

  // 13
  L.add({
    name: 'Lift Operators',
    idea: 'Two tall lifts, each driven by a plate on the other side. Each hero runs the lift for the other.',
    mech: ['plate-driven lifts', 'role swap'],
    hint: '{S} stands on the plate to lift {B}. Then {B} stands on the upstairs plate to lift {S} on the right-hand lift.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#.....o........................#',
      '#...........E.........o........#',
      '#.......################.......#',
      EMPTY, EMPTY, EMPTY,
      '#..............o...............#',
      '#1...2.........................#',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 3, y: 15, ch: 'a' },
      { t: 'lift', x: 6, y: 16, w: 2, to: [6, 10], ch: 'a' },
      { t: 'plate', x: 20, y: 9, ch: 'b' },
      { t: 'lift', x: 24, y: 16, w: 2, to: [24, 10], ch: 'b' }
    ]
  });

  // 14
  L.add({
    name: 'Crate Commute',
    idea: 'Braco rides a lift up with a crate. Upstairs he holds a heavy plate so Seka can reach the stairs, then uses the crate as a step.',
    mech: ['crate on a lift', 'heavy plate', 'one-way stairs', 'crate step'],
    hint: '{B} pushes the crate onto the big lift and rides along while {S} holds the plate. Upstairs, push the crate against the tall block, then stand on the heavy plate so {S} gets through her gate.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#................E.............#',
      '#...............####...........#',
      '#...............####...........#',
      '#...............####..o........#',
      '#.......#################------#',
      '#.........................o....#',
      '#........................---...#',
      EMPTY,
      '#...................o.......---#',
      '#2.C........1..................#',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'lift', x: 5, y: 16, w: 3, to: [5, 10], ch: 'a' },
      { t: 'plate', x: 10, y: 15, ch: 'a' },
      { t: 'plate', x: 11, y: 9, ch: 'b', heavy: true },
      { t: 'gate', x: 24, y: 11, w: 1, h: 5, ch: 'b' }
    ]
  });

  // 15
  L.add({
    name: 'Signal Barrier',
    idea: 'The tram passes under a barrier that only opens while someone stands on a plate, so the heroes cross one at a time and hold the barrier for each other.',
    mech: ['moving tram', 'plates on both sides', 'riding through a gate', 'vertical lift'],
    hint: 'Stay on the plate until your partner’s tram is past the barrier — a closed barrier knocks riders off! Then cross and hold the far plate.',
    map: [
      '################################',
      '#...............#..............#',
      '#...............#..............#',
      '#...............#..............#',
      '#...............#..............#',
      '#...............#........o.....#',
      '#...............#.......E......#',
      '#...............#......#####...#',
      '#...............#..............#',
      '#...............#..............#',
      '#...............#..............#',
      '#...........o.......o..........#',
      '#.12...........................#',
      '#######..................#######',
      '#######..................#######',
      '#######..................#######',
      '#######~~~~~~~~~~~~~~~~~~#######',
      '################################'
    ],
    obj: [
      { t: 'lift', x: 7, y: 13, w: 3, to: [22, 13], skin: 'tram', speed: 100, pause: 1 },
      { t: 'gate', x: 16, y: 11, w: 1, h: 2, ch: 'a' },
      { t: 'plate', x: 4, y: 12, ch: 'a' }, { t: 'plate', x: 27, y: 12, ch: 'a' },
      { t: 'lift', x: 28, y: 13, w: 2, to: [28, 7], speed: 90, pause: 1 }
    ]
  });

  // 16
  L.add({
    name: 'Overhead Wires',
    idea: 'Seka climbs a ladder of ledges to ring a bell that runs Braco’s lift for a few seconds. Upstairs he pushes a crate onto a heavy plate to open the way.',
    mech: ['bell-driven lift', 'one-way ledges', 'ribbon', 'crate on heavy plate'],
    hint: '{B} waits on the lift. {S} climbs the ledges and rings the bell. Upstairs, {B} pushes the crate onto the heavy plate; {S} crosses the ribbon.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY,
      '#############..................#',
      EMPTY, EMPTY, EMPTY,
      '#.E........C.....o.............#',
      '#############..======..........#',
      '#....................---.......#',
      EMPTY,
      '#..................o...........#',
      '#.................---..........#',
      EMPTY,
      '#..o....2.1....................#',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'lift', x: 13, y: 16, w: 2, to: [13, 9], ch: 'a', speed: 120 },
      { t: 'timer', x: 22, y: 9, ch: 'a', dur: 6 },
      { t: 'plate', x: 8, y: 8, ch: 'b', heavy: true },
      { t: 'gate', x: 5, y: 5, w: 1, h: 4, ch: 'b' }
    ]
  });

  // 17
  L.add({
    name: 'Double Line',
    idea: 'The way out needs two plates pressed at once. One crate sits on a ledge only reachable together and drops straight onto its plate; the other hides in a closet that Seka unlocks.',
    mech: ['AND gate', 'two crates', 'Braco stands on Seka', 'lever'],
    hint: '{B} jumps on {S}’s head to reach the ledge and pushes the crate off the left edge onto the plate. {S} pulls the lever to open the closet. Afterwards the dropped crate is a handy step back up.',
    map: [
      '################################',
      '#.......................#......#',
      '#.......................#......#',
      '#.......................#......#',
      '#.......................#......#',
      '#.......................#......#',
      '#.......................#......#',
      '#.......................#......#',
      '#.......................#......#',
      '#.......................#......#',
      '#.......................#......#',
      '#...........o...........#......#',
      '#####.....C.............#......#',
      '#........#####.................#',
      '#o.......#####............o....#',
      '#..C.....#####..12..........E..#',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 8, y: 15, ch: 'a' }, { t: 'plate', x: 6, y: 15, ch: 'b' },
      { t: 'gate', x: 4, y: 13, w: 1, h: 3, ch: 'c' },
      { t: 'lever', x: 13, y: 12, ch: 'c' },
      { t: 'gate', x: 24, y: 13, w: 1, h: 3, ch: ['a', 'b'] }
    ]
  });

  // 18
  L.add({
    name: 'Power Lever',
    idea: 'Two trams sit still until Seka switches on the power from a high ledge. Then both hop tram, pillar, tram across the canal.',
    mech: ['powered trams', 'timing hops', 'high lever'],
    hint: 'Only {S} can reach the power lever. Then ride the first tram, hop onto the stone pillar and wait for the second tram.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#.............o.....o..........#',
      '####...........................#',
      '####......o...##...............#',
      '####12........##...........E...#',
      '######........##.........#######',
      '######........##.........#######',
      '######........##.........#######',
      '######~~~~~~~~##~~~~~~~~~#######',
      '################################'
    ],
    obj: [
      { t: 'lever', x: 2, y: 9, ch: 'a' },
      { t: 'lift', x: 6, y: 13, w: 3, to: [11, 13], ch: 'a', loop: true, skin: 'tram', speed: 80, pause: 0.6 },
      { t: 'lift', x: 16, y: 11, w: 3, to: [22, 11], ch: 'a', loop: true, skin: 'tram', speed: 80, pause: 0.6 }
    ]
  });

  // 19
  L.add({
    name: 'Depot Switches',
    idea: 'Two separate lanes with levers that open each other’s gates, and one inverted gate. The order you pull them in matters.',
    mech: ['lever logic', 'inverted gate', 'split lanes', 'AND gate'],
    hint: 'A gate with a crossed-out symbol is open only while that switch is OFF. {S} must get past it before {B} pulls the matching lever.',
    map: [
      '################################',
      '################################',
      '################################',
      '################################',
      '################################',
      EMPTY, EMPTY,
      '#.....................o........#',
      '#.1............................#',
      '##########################..####',
      EMPTY, EMPTY, EMPTY,
      '#..........o...................#',
      '#...............o..............#',
      '#.2.........................E..#',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'lever', x: 4, y: 8, ch: 'b' },
      { t: 'gate', x: 8, y: 5, w: 1, h: 4, ch: 'a' },
      { t: 'lever', x: 13, y: 8, ch: 'c' },
      { t: 'gate', x: 18, y: 5, w: 1, h: 4, ch: 'd', inv: true },
      { t: 'lever', x: 4, y: 15, ch: 'a' },
      { t: 'gate', x: 8, y: 10, w: 1, h: 6, ch: 'b' },
      { t: 'lever', x: 13, y: 15, ch: 'd' },
      { t: 'gate', x: 20, y: 10, w: 1, h: 6, ch: ['c', 'd'] }
    ]
  });

  // 20
  L.add({
    name: 'Last Tram Home',
    idea: 'Chapter finale: a bell powers the depot lift, a slow tram ferries Braco and a crate over a gap, and the crate weighs down the heavy plate at the end.',
    mech: ['bell-powered lift', 'crate on a tram', 'heavy plate', 'glide'],
    hint: '{S} rings the bell on the ledge so the lift runs. Upstairs, {B} pushes the crate onto the small tram and rides it across, then onto the heavy plate. {S} can glide over the gap.',
    map: [
      '################################',
      '#..........................#...#',
      '#..........................#...#',
      '#..........................#...#',
      EMPTY, EMPTY,
      '#...................o.......o..#',
      '#.............C..............E.#',
      '#...........######.....#########',
      EMPTY, EMPTY, EMPTY,
      '#..o...........................#',
      '####...........................#',
      '####...........................#',
      '####.12........................#',
      '##################~~~~~#########',
      '################################'
    ],
    obj: [
      { t: 'timer', x: 2, y: 12, ch: 'a', dur: 10 },
      { t: 'lift', x: 10, y: 16, w: 2, to: [10, 8], ch: 'a', loop: true, speed: 120, pause: 0.8 },
      { t: 'lift', x: 18, y: 8, w: 2, to: [21, 8], skin: 'tram', speed: 60, pause: 1.2 },
      { t: 'plate', x: 25, y: 7, ch: 'b', heavy: true },
      { t: 'gate', x: 27, y: 4, w: 1, h: 4, ch: 'b' }
    ]
  });
})(SB_LEVELS);
