/*
 * Level registry. Chapter files (levels-ch1.js … levels-ch5.js) call SB_LEVELS.add().
 *
 * Map legend (32 columns × 18 rows, '.' or ' ' = empty):
 *   #  solid ground          X  cracked wall (Braco smashes it by pushing)
 *   -  wooden ledge (jump up through, stand on top)
 *   =  embroidered ribbon bridge (holds Seka only)
 *   ~  hot paprikaš stew      w  Drava water      ^  iron spikes
 *   b  springy hay bale       C  wooden crate (Braco pushes)
 *   o  collectible            E  exit door        1 Seka start   2 Braco start
 * Objects (tile coordinates):
 *   plate {x,y,ch,heavy}  lever {x,y,ch}  timer {x,y,ch,dur}
 *   gate  {x,y,w,h,ch,inv}  — ch may be an array: opens only when ALL are on
 *   lift  {x,y,w,to:[x,y],ch,loop,skin,speed,pause}
 *         no ch        = shuttles back and forth by itself
 *         ch           = moves to `to` while the channel is on, returns when off
 *         ch + loop    = shuttles back and forth only while the channel is on
 *         skin: lift | tram | boat | raft | wagon | gondola (looks only)
 *   sign  {x,y,text}
 */
(function (root) {
  'use strict';
  var CHAPTERS = [
    { key: 'oldtown', name: 'Old Town & Tvrđa', blurb: 'Red-brick towers, baroque façades and the old fortress walls.', food: 'kulen', foodName: 'Kulen slices' },
    { key: 'tram', name: 'Tram Lines', blurb: 'Blue trams, overhead wires and busy city streets.', food: 'paprika', foodName: 'Paprika peppers' },
    { key: 'drava', name: 'Drava Riverfront', blurb: 'Sunset on the promenade, boats and springy piers.', food: 'fis', foodName: 'Bowls of fiš' },
    { key: 'fields', name: 'Golden Fields', blurb: 'Wheat, sunflowers, hay bales and old barns.', food: 'pogaca', foodName: 'Pogača loaves' },
    { key: 'festival', name: 'Fiš & Fun Festival', blurb: 'Cauldrons, string lights and everything you have learned.', food: 'cobanac', foodName: 'Čobanac pots' }
  ];
  var LEVELS = [];
  function add(def) {
    def.id = LEVELS.length + 1;
    def.chapter = Math.floor((def.id - 1) / 10);
    def.map = def.map.map(function (r) { return r.replace(/\./g, ' '); });
    LEVELS.push(def);
  }
  root.SB_LEVELS = { CHAPTERS: CHAPTERS, LEVELS: LEVELS, add: add };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.SB_LEVELS;
})(typeof window !== 'undefined' ? window : globalThis);
