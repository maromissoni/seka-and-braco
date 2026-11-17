/* Chapter 1 — Old Town & Tvrđa: learning every basic rule, one at a time. */
(function (L) {
  'use strict';
  var EMPTY = '#..............................#';

  // 1
  L.add({
    name: 'Hello, Osijek',
    idea: 'Walk, jump a stew pit and climb small steps. Both heroes must stand in the door.',
    mech: ['moving', 'jumping', 'stew hazard', 'shared exit'],
    hint: 'Jump over the bubbling paprikaš. The level ends only when BOTH of you stand in the doorway.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#........o..........o..........#',
      '#..................####..o.....#',
      '#.12.............######.....E..#',
      '########~~######################',
      '################################'
    ],
    obj: [
      { t: 'sign', x: 4, y: 9, text: '{S}: {S.move} to walk, {S.jump} to jump' },
      { t: 'sign', x: 4, y: 11, text: '{B}: {B.move} to walk, {B.jump} to jump' },
      { t: 'sign', x: 13, y: 12, text: 'Hot paprikaš! Jump over it.' },
      { t: 'sign', x: 26, y: 11, text: 'Both of you into the door!' }
    ]
  });

  // 2
  L.add({
    name: 'Hold the Door',
    idea: 'Pressure plates hold gates open only while someone stands on them, so the heroes take turns holding the door.',
    mech: ['pressure plates', 'gates', 'Seka jumps higher'],
    hint: 'Stand on a plate to open the gate with the same symbol. On the far side there is another plate, so the one who went first can hold the gate for the other.',
    map: [
      '################################',
      '#...........#.........#........#',
      '#...........#.........#........#',
      '#...........#.........#........#',
      '#...........#.........#........#',
      '#...........#.........#........#',
      '#...........#.........#........#',
      '#...........#.........#........#',
      '#...........#.........#........#',
      '#...........#.........#........#',
      '#...........#.........#........#',
      '#...........#.........#........#',
      '#...........#...o.....#........#',
      '#.....o.....#...###...#........#',
      '#..........................o...#',
      '#.12........................E..#',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 10, y: 15, ch: 'a' }, { t: 'plate', x: 14, y: 15, ch: 'a' },
      { t: 'gate', x: 12, y: 14, w: 1, h: 2, ch: 'a' },
      { t: 'plate', x: 17, y: 12, ch: 'b' }, { t: 'plate', x: 25, y: 15, ch: 'b' },
      { t: 'gate', x: 22, y: 14, w: 1, h: 2, ch: 'b' },
      { t: 'sign', x: 6, y: 10, text: 'Plates open gates with the same symbol' },
      { t: 'sign', x: 17, y: 9, text: 'Only {S} can jump this high' }
    ]
  });

  // 3
  L.add({
    name: 'Shoulder Ride',
    idea: 'A wall four tiles high: Seka stands on Braco’s head to get up, then works a lever to bring a lift down and back up for him.',
    mech: ['standing on each other', 'levers', 'lifts'],
    hint: '{B} waits beside the tall wall. {S} jumps onto his head and then up. Pull the lever with {S.use} to bring the lift down; pull it again to lift {B} up.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#................o......o......#',
      '#..........................E...#',
      '#.................##############',
      '#.................##############',
      '#.................##############',
      '#.12.....o........##############',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'lift', x: 16, y: 12, w: 2, to: [16, 16], ch: 'a' },
      { t: 'lever', x: 21, y: 11, ch: 'a' },
      { t: 'sign', x: 9, y: 11, text: 'Too high? Stand on each other’s head!' },
      { t: 'sign', x: 23, y: 8, text: 'Levers: {S.use} / {B.use}' }
    ]
  });

  // 4
  L.add({
    name: 'Strong Brother',
    idea: 'Only Braco can push crates: one crate holds a plate down permanently, another becomes a step up a ledge.',
    mech: ['crates', 'plates', 'crate as a step'],
    hint: 'Push the first crate onto the plate so the gate stays open for both of you. Push the second crate against the high ledge so {B} can climb it.',
    map: [
      '################################',
      '#..............#...............#',
      '#..............#...............#',
      '#..............#...............#',
      '#..............#...............#',
      '#..............#...............#',
      '#..............#...............#',
      '#..............#...............#',
      '#..............#...............#',
      '#..............#...............#',
      '#..............#...............#',
      '#..............#...............#',
      '#..............#..........o.E..#',
      '#....o.........#........########',
      '#.................o.....########',
      '#.12...C............C...########',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 11, y: 15, ch: 'a' },
      { t: 'gate', x: 15, y: 14, w: 1, h: 2, ch: 'a' },
      { t: 'sign', x: 7, y: 11, text: 'Only {B} is strong enough to push crates' }
    ]
  });

  // 5
  L.add({
    name: 'Ribbon Bridges',
    idea: 'Embroidered ribbons hold Seka but not Braco. She crosses first and makes solid bridges appear for him: once with a lever, once by standing on a plate.',
    mech: ['ribbon bridges', 'appearing bridges', 'lever vs plate'],
    hint: 'Ribbons only hold {S}. A lever stays switched; a plate works only while someone stands on it — so stay on the second plate until {B} is across.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#...........o..........o.......#',
      '#.12..............o..........E.#',
      '#########=======####=======#####',
      '#########~~~~~~~####~~~~~~~#####',
      '#########~~~~~~~####~~~~~~~#####',
      '################################'
    ],
    obj: [
      { t: 'lever', x: 17, y: 13, ch: 'a' },
      { t: 'gate', x: 9, y: 14, w: 7, h: 1, ch: 'a', inv: true },
      { t: 'plate', x: 27, y: 13, ch: 'b' },
      { t: 'gate', x: 20, y: 14, w: 7, h: 1, ch: 'b', inv: true },
      { t: 'sign', x: 4, y: 10, text: 'Ribbon bridges hold only {S}' }
    ]
  });

  // 6
  L.add({
    name: 'Paprika Parasol',
    idea: 'Seka glides over a huge stew pool with her umbrella, then rides a plate-powered ferry back for Braco. At the end Braco climbs on Seka’s head.',
    mech: ['gliding', 'plate-driven ferry', 'Braco stands on Seka'],
    hint: 'Hold {S.jump} while falling to glide. {B} waits on the little ferry; {S} lands across and stands on the plate. At the end, {B} can jump on {S}’s head to reach the ledge.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      '#............o.................#',
      EMPTY,
      '#.12................o.......E..#',
      '#######...................######',
      '#######.................o.######',
      '#######...................######',
      '#######~~~~~~~~~~~~~~###########',
      '################################'
    ],
    obj: [
      { t: 'lift', x: 7, y: 13, w: 2, to: [19, 13], ch: 'a', skin: 'raft' },
      { t: 'plate', x: 23, y: 15, ch: 'a' },
      { t: 'sign', x: 4, y: 9, text: 'Hold {S.jump} while falling to glide' }
    ]
  });

  // 7
  L.add({
    name: 'Heavy Plate',
    idea: 'A heavy plate needs Braco or a crate. Seka gets past the gate and drops a crate from a high shelf, which Braco then uses as a permanent weight.',
    mech: ['heavy plates', 'trapdoors', 'crates'],
    hint: 'Heavy plates (with the weight symbol) need {B} or a crate. {S} pulls the lever on the ledge to drop the crate; {B} pushes it onto the heavy plate.',
    map: [
      '################################',
      '#.............#................#',
      '#.............#................#',
      '#.............#................#',
      '#.............#................#',
      '#.............#................#',
      '#.............#................#',
      '#.............#................#',
      '#.............#................#',
      '#.........C...#................#',
      '#........#.#..#................#',
      '#.............#................#',
      '#.........................E..o.#',
      '#....o..................########',
      '#..................o....########',
      '#.12...................#########',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 8, y: 15, ch: 'a', heavy: true },
      { t: 'gate', x: 14, y: 12, w: 1, h: 4, ch: 'a' },
      { t: 'lever', x: 28, y: 12, ch: 'b' },
      { t: 'gate', x: 10, y: 10, w: 1, h: 1, ch: 'b' },
      { t: 'sign', x: 5, y: 10, text: 'Heavy plate: {B} or a crate' }
    ]
  });

  // 8
  L.add({
    name: 'Cracked Walls',
    idea: 'Two floors. Braco smashes through cracked brick to reach a plate for Seka upstairs; she pulls a lever that opens his last gate, then drops down to meet him.',
    mech: ['cracked walls', 'split routes', 'plates', 'levers'],
    hint: '{B} can smash cracked walls by walking into them. His plate opens {S}’s gate upstairs; her lever opens his gate downstairs.',
    map: [
      '################################',
      '################################',
      '################################',
      '################################',
      '################################',
      '#..............................#',
      '#..............................#',
      '#.................o............#',
      '#.1............................#',
      '##########################..####',
      '#........X......X..............#',
      '#........X......X..............#',
      '#........X......X..............#',
      '#.....o..X......X..............#',
      '#........X......X........o.....#',
      '#.2......X......X...........E..#',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 12, y: 15, ch: 'a' },
      { t: 'gate', x: 14, y: 5, w: 1, h: 4, ch: 'a' },
      { t: 'lever', x: 20, y: 8, ch: 'b' },
      { t: 'gate', x: 24, y: 10, w: 1, h: 6, ch: 'b' },
      { t: 'sign', x: 5, y: 11, text: '{B}: walk into cracks to smash them' }
    ]
  });

  // 9
  L.add({
    name: 'Cathedral Climb',
    idea: 'A vertical climb inside the red-brick tower. Plate lift, then a head-boost, then a lever lift, then a crate step to reach the top.',
    mech: ['vertical climb', 'two lifts', 'head boost', 'crate step'],
    hint: 'Climb floor by floor: {S} rides up first and works the plate or lever, {B} rides the lifts. On the third floor {B} pushes the crate against the wall to use as a step.',
    map: [
      '################################',
      EMPTY, EMPTY, EMPTY, EMPTY,
      '#.........E..o.................#',
      '#........#######...............#',
      '#........#######...............#',
      '#........#######...C...........#',
      '#........##############........#',
      EMPTY, EMPTY,
      '#..........................o...#',
      '#.....o.........################',
      '#...............################',
      '#..12...........################',
      '################################',
      '################################'
    ],
    obj: [
      { t: 'lift', x: 14, y: 16, w: 2, to: [14, 13], ch: 'a' },
      { t: 'plate', x: 20, y: 12, ch: 'a' },
      { t: 'lift', x: 23, y: 13, w: 2, to: [23, 9], ch: 'b' },
      { t: 'lever', x: 17, y: 8, ch: 'b' }
    ]
  });

  // 10
  L.add({
    name: 'Fortress Gate',
    idea: 'Chapter finale: smash a wall to free a crate, weigh down a heavy plate, cross ribbons while holding a bridge, and build a crate step.',
    mech: ['cracked wall', 'heavy plate', 'ribbon', 'appearing bridge', 'crate step'],
    hint: '{B} smashes the cracked wall and pushes the crate onto the heavy plate. {S} crosses the ribbon and stands on the plate so a bridge appears for {B}. Use the last crate as a step.',
    map: [
      '################################',
      '#..........#...................#',
      '#..........#...................#',
      '#..........#...................#',
      '#..........#...................#',
      '#..........#...................#',
      '#..........#...................#',
      '#..........#...................#',
      '#..........#...................#',
      '#..........#...................#',
      '#..........#...................#',
      '#..........#................o..#',
      '#..o.#######.................E.#',
      '#....X..........o..........#####',
      '#....X.....................#####',
      '#.12.XC......========...C..#####',
      '#############~~~~~~~~###########',
      '################################'
    ],
    obj: [
      { t: 'plate', x: 9, y: 15, ch: 'a', heavy: true },
      { t: 'gate', x: 11, y: 13, w: 1, h: 3, ch: 'a' },
      { t: 'plate', x: 22, y: 15, ch: 'b' },
      { t: 'gate', x: 13, y: 15, w: 8, h: 1, ch: 'b', inv: true }
    ]
  });
})(SB_LEVELS);
