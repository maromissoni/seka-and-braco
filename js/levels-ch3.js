/* Chapter 3 — Drava Riverfront: water, springs, boats, drawbridges, long glides. */
(function (L) {
  'use strict';
  var EMPTY = '#..............................#';

  // 21
  L.add({
    name: 'Promenade',
    idea: 'Braco pushes a crate into the river inlet so it becomes a stepping stone, then springy hay bales launch both up the embankment.',
    mech: ['crate fills a water gap', 'springs', 'Drava water'],
    hint: 'The Drava is cold and deep — don’t fall in! Push the crate into the water to make a stepping stone for {B}. Hay bales bounce you high.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#.......................o..E...#',
      '#.................##############',
      '#...............o.##############',
      '#.................##############',
      '#.................##############',
      '#........o........##############',
      '#.12.C..........b.##############',
      '########www#####################',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'sign', x: 6, y: 10, text: 'Crates make good stepping stones' },
      { t: 'sign', x: 13, y: 9, text: 'Hay bales are springy!' }
    ]
  });

  // 22
  L.add({
    name: 'Drawbridge',
    idea: 'The river is too wide to jump. Braco powers a lift to the top of a lookout tower; from there Seka glides all the way across and lowers the drawbridge.',
    mech: ['lookout lift', 'long glide', 'drawbridge lever'],
    hint: '{S} rides the tower lift while {B} holds the plate. From the very top, glide across and pull the lever to lower the drawbridge.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#..o...........................#',
      EMPTY, EMPTY, EMPTY,
      '#.1..2...........o..........Eo.#',
      '#########................#######',
      '#########................#######',
      '#########wwwwwwwwwwwwwwww#######',
      '#########wwwwwwwwwwwwwwww#######',
      '################################'
    ],
    obj: [
      { t: 'lift', x: 2, y: 13, w: 2, to: [2, 6], ch: 'b' },
      { t: 'plate', x: 6, y: 12, ch: 'b' },
      { t: 'lever', x: 27, y: 12, ch: 'a' },
      { t: 'gate', x: 9, y: 13, w: 16, h: 1, ch: 'a', inv: true }
    ]
  });

  // 23
  L.add({
    name: 'Spring Islands',
    idea: 'A chain of hay-bale islands across the river with a lock gate in the middle. One holds the gate while the other bounces across, then they swap.',
    mech: ['spring chain', 'plates on both banks', 'gate across the air'],
    hint: 'Keep steering while you bounce from bale to bale. Stand on the plate so your partner can pass the lock gate, then they hold the far plate for you.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#...........o....o.............#',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#12.........................Eo.#',
      '#####.....................######',
      '#####..bb...bb...bb...bb..######',
      '#####ww##www##www##www##ww######',
      '#####ww##www##www##www##ww######',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 3, y: 12, ch: 'a' }, { t: 'plate', x: 27, y: 12, ch: 'a' },
      { t: 'gate', x: 20, y: 1, w: 1, h: 13, ch: 'a' }
    ]
  });

  // 24
  L.add({
    name: 'Canal Lock',
    idea: 'A boat in a lock carries Braco and a crate up to the high quay. Levers on both quays work the lock, so each hero operates it for the other.',
    mech: ['boat lift', 'levers on two levels', 'crate on a boat', 'heavy plate'],
    hint: 'The boat rises while EITHER lever is on. {B} loads the crate and {S} pulls the lower lever. Afterwards, switch the lower lever off so the boat comes back for {S}, and {B} switches the upper one on.',
    map: [
      '################################',
      '#........................#.....#',
      '#........................#.....#',
      '#........................#.....#',
      '#........................#.....#',
      '#........................#.....#',
      EMPTY, EMPTY,
      '#...........o..................#',
      '#.....................o.....E..#',
      '#.............##################',
      '#.............##################',
      '#...o.........##################',
      '#.............##################',
      '#.12.C........##################',
      '###########www##################',
      '###########www##################',
      '################################'
    ],
    obj: [
      { t: 'lift', x: 11, y: 15, w: 3, to: [11, 10], ch: 'a', skin: 'boat' },
      { t: 'lever', x: 9, y: 14, ch: 'a' }, { t: 'lever', x: 16, y: 9, ch: 'a' },
      { t: 'plate', x: 20, y: 9, ch: 'b', heavy: true },
      { t: 'gate', x: 25, y: 6, w: 1, h: 4, ch: 'b' }
    ]
  });

  // 25
  L.add({
    name: 'Gull’s Glide',
    idea: 'Seka climbs three ledges and makes the longest glide yet across the whole river while Braco keeps the lock gate open; he follows by boat and rides a lift she powers.',
    mech: ['very long glide', 'boat', 'plate-held gate', 'plate lift'],
    hint: '{B} holds the plate so the tall gate opens. {S} climbs to the highest ledge and glides to the little ledge on the far right. Then {B} rides the boat and {S} lifts him up.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY,
      '#...o..........................#',
      '#..---.........................#',
      EMPTY, EMPTY,
      '#---...........................#',
      '#........................o.....#',
      '#...........................E..#',
      '#..---....................######',
      EMPTY,
      '#.1.2..........o...............#',
      '#######' + '.'.repeat(14) + '###########',
      '#######' + 'w'.repeat(14) + '###########',
      '#######' + 'w'.repeat(14) + '###########',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 5, y: 13, ch: 'a' },
      { t: 'gate', x: 16, y: 1, w: 1, h: 11, ch: 'a' },
      { t: 'lift', x: 7, y: 14, w: 3, to: [18, 14], skin: 'boat', speed: 90, pause: 0.8 },
      { t: 'lift', x: 24, y: 14, w: 2, to: [24, 11], ch: 'b' },
      { t: 'plate', x: 29, y: 10, ch: 'b' }
    ]
  });

  // 26
  L.add({
    name: 'Bridge Builders',
    idea: 'Three bridge sections, each with a different switch: a crate on a plate, a lever only reachable by gliding, and a bell Braco must beat.',
    mech: ['three bridges', 'crate weight', 'glide to lever', 'timed bell'],
    hint: 'Section 1: {B} parks the crate on the plate. Section 2: {S} glides to the island and pulls the lever. Section 3: {B} rings the bell and runs.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#........o......o......o.......#',
      '#12.C........................E.#',
      '######......##.....##.....######',
      '######wwwwww##wwwww##wwwww######',
      '######wwwwww##wwwww##wwwww######',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 5, y: 13, ch: 'a' },
      { t: 'gate', x: 6, y: 14, w: 6, h: 1, ch: 'a', inv: true },
      { t: 'lever', x: 19, y: 13, ch: 'b' },
      { t: 'gate', x: 14, y: 14, w: 5, h: 1, ch: 'b', inv: true },
      { t: 'timer', x: 20, y: 13, ch: 'c', dur: 3 },
      { t: 'gate', x: 21, y: 14, w: 5, h: 1, ch: 'c', inv: true }
    ]
  });

  // 27
  L.add({
    name: 'Under the Bridge',
    idea: 'Seka walks on the bridge deck, Braco under it. He makes a stepping stone, then bounces up through a hatch she opens, and finally climbs a wall using the crate on the deck.',
    mech: ['split heights', 'hatch over a spring', 'crate stepping stone', 'crate step'],
    hint: '{B}: push the crate into the water, then hop to the hay bale. {S}: stand on the deck plate to open the hatch above it. Up top, the second crate helps {B} over the wall.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY,
      '#...................#..........#',
      '#...................#..........#',
      '#.1..............C..#...o..E...#',
      '#########.....##################',
      EMPTY,
      '#..........o...................#',
      EMPTY, EMPTY,
      '#.....o........................#',
      '#.2C.......b...................#',
      '#####www########################',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 6, y: 7, ch: 'a' },
      { t: 'gate', x: 9, y: 8, w: 5, h: 1, ch: 'a' }
    ]
  });

  // 28
  L.add({
    name: 'Riverside Relay',
    idea: 'A six-step relay between two lanes, alternating plates, levers and a bell. Each hero’s switch opens the next gate for the other.',
    mech: ['relay', 'plates', 'levers', 'timed bell', 'split lanes'],
    hint: 'Work your way along together: every switch in one lane opens the next gate in the other lane. Plates must be held until your partner is through.',
    map: [
      '################################',
      '################################',
      '################################',
      '################################',
      EMPTY, EMPTY,
      '#.............o................#',
      '#.1............................#',
      '###########################..###',
      EMPTY, EMPTY, EMPTY, EMPTY,
      '#................o.............#',
      '#.........................o....#',
      '#.2..........................E.#',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 4, y: 7, ch: 'b' },
      { t: 'gate', x: 8, y: 4, w: 1, h: 4, ch: 'a' },
      { t: 'lever', x: 12, y: 7, ch: 'd' },
      { t: 'gate', x: 16, y: 4, w: 1, h: 4, ch: 'c' },
      { t: 'plate', x: 20, y: 7, ch: 'f' },
      { t: 'gate', x: 24, y: 4, w: 1, h: 4, ch: 'e' },
      { t: 'gate', x: 6, y: 9, w: 1, h: 7, ch: 'b' },
      { t: 'lever', x: 10, y: 15, ch: 'a' },
      { t: 'gate', x: 13, y: 9, w: 1, h: 7, ch: 'd' },
      { t: 'timer', x: 15, y: 15, ch: 'c', dur: 4 },
      { t: 'gate', x: 21, y: 9, w: 1, h: 7, ch: 'f' },
      { t: 'lever', x: 23, y: 15, ch: 'e' }
    ]
  });

  // 29
  L.add({
    name: 'Fishermen’s Pier',
    idea: 'Seka bounces and glides to a lever on a high perch to open the river gate. Braco ferries a crate across on the boat to weigh down the heavy plate at the far pier.',
    mech: ['spring + glide', 'crate on a boat', 'gate over the river', 'heavy plate'],
    hint: 'Until {S} opens the tall gate, the boat would knock its riders into the river. Load the crate when the boat is docked, then push it onto the heavy plate across the river.',
    map: [
      '################################',
      '#...........................#..#',
      '#...........................#..#',
      '#...........................#..#',
      '#...........................#..#',
      '#...........................#..#',
      '#........o..................#..#',
      '#.......###.................#..#',
      '#...........................#..#',
      '#.o.........................#..#',
      EMPTY, EMPTY,
      '#...............o..............#',
      '#.b12.C......................E.#',
      '########................########',
      '########wwwwwwwwwwwwwwww########',
      '########wwwwwwwwwwwwwwww########',
      '################################'
    ],
    obj: [
      { t: 'lever', x: 9, y: 6, ch: 'a' },
      { t: 'gate', x: 15, y: 1, w: 1, h: 12, ch: 'a' },
      { t: 'lift', x: 8, y: 14, w: 3, to: [21, 14], skin: 'boat', speed: 90, pause: 1.2 },
      { t: 'plate', x: 26, y: 13, ch: 'b', heavy: true },
      { t: 'gate', x: 28, y: 10, w: 1, h: 4, ch: 'b' }
    ]
  });

  // 30
  L.add({
    name: 'Sunset over the Drava',
    idea: 'Chapter finale: Seka bounces up to ring the bridge bell and holds it while Braco pushes a crate over the whole river, then glides across herself.',
    mech: ['spring to bell', 'appearing bridge', 'long crate push', 'glide', 'crate step'],
    hint: '{S} bounces up to the bell and STAYS on it while {B} pushes the crate all the way across. The crate becomes {B}’s step up to the exit; {S} glides over.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#....o.........................#',
      EMPTY,
      '#...###.....................o..#',
      '#............................E.#',
      '#..........................#####',
      '#...............o..........#####',
      '#.b12.....C................#####',
      '#######ww##............#########',
      '###########wwwwwwwwwwww#########',
      '###########wwwwwwwwwwww#########',
      '################################'
    ],
    obj: [
      { t: 'timer', x: 5, y: 8, ch: 'a', dur: 8 },
      { t: 'gate', x: 11, y: 14, w: 12, h: 1, ch: 'a', inv: true }
    ]
  });
})(SB_LEVELS);
