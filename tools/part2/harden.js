#!/usr/bin/env node
/*
 * Difficulty pass for levels 51–100. Writes tools/part2/harden.json, which build.py applies.
 *
 *   1. Timer bells: binary-search the shortest duration the scripted solution still survives,
 *      then keep only a human-sized margin on top of it (never longer than the original).
 *   2. Moving platforms: faster (+30%) with shorter pauses, kept only if the solution still passes.
 *   3. Spikes: floor tiles that neither player nor any crate ever touches during the solution
 *      (with a one-tile safety margin around every footstep) become spikes, so missed jumps hurt.
 *
 * Run order:  python3 tools/part2/build.py --plain  →  node tools/part2/harden.js  →  python3 tools/part2/build.py
 */
'use strict';
var fs = require('fs'), path = require('path');
var V = require(path.join(__dirname, '..', 'verify.js'));
var E = V.E, T = E.T, STEP = E.STEP;
var TIMER_MIN = 2, LIFT_SPEED = 1.3, LIFT_PAUSE = 0.6;

function clone(o) { return JSON.parse(JSON.stringify(o)); }
function passes(def) {
  var r = V.solve(def, V.SOL[def.id]);
  return r.ok && r.w.coins.filter(function (c) { return c.taken; }).length === 3;
}

function objCells(def) {
  var at = {};
  def.obj.forEach(function (o) {
    if (o.t === 'sign') return;
    if (o.t === 'lift') {
      var w = o.w || 2;
      for (var x = Math.min(o.x, o.to[0]) - 1; x <= Math.max(o.x, o.to[0]) + w; x++) for (var y = Math.min(o.y, o.to[1]); y <= 14; y++) at[x + ',' + y] = 1;
      return;
    }
    for (var x2 = o.x - 1; x2 <= o.x + (o.w || 1); x2++) for (var y2 = o.y; y2 <= o.y + (o.h || 1); y2++) at[x2 + ',' + y2] = 1;
  });
  return at;
}
function withSpikes(def, cells) {
  var d = clone(def), g = d.map.map(function (r) { return r.split(''); });
  cells.forEach(function (c) { g[c[1]][c[0]] = '^'; });
  d.map = g.map(function (r) { return r.join(''); });
  return d;
}
function score(def, sol) {
  var r = V.solve(def, sol);
  var coins = r.w ? r.w.coins.filter(function (c) { return c.taken; }).length : 0;
  return { ok: r.ok && coins === 3, why: r.why || '' };
}
function posAfter(def, sol, i) { // player positions (tile units, centre) after the first i steps
  var r = V.solve(def, sol.slice(0, i));
  if (!r.w) return null;
  var o = {};
  ['S', 'B'].forEach(function (k) { var p = r.w.players[k]; o[k] = { x: (p.x + p.w / 2) / T - 0.5, ground: p.ground, row: Math.floor((p.y + p.h + 2) / T) }; });
  return o;
}
var GO = /^([SB]) go ([\d.]+)$/;
// make every single-player floor walk across the strip [c, c+1] jump it instead
function patchWalks(def, sol, c, r) { // r = row of the surface the strip is cut into
  var out = [], changed = 0;
  // split "S go a | B go b" into two steps so each walker can jump on its own
  sol = [].concat.apply([], sol.map(function (st) {
    var parts = st.split('|').map(function (x) { return x.trim(); });
    return parts.length > 1 && parts.every(function (x) { return GO.test(x); }) ? parts : [st];
  }));
  for (var i = 0; i < sol.length; i++) {
    var m = GO.exec(sol[i]);
    if (m) {
      var pos = posAfter(def, out, out.length);
      var p = pos && pos[m[1]], X = parseFloat(m[2]);
      if (p && p.row === r) {
        if (p.x < c - 1.6 && X > c + 2.6) { out.push(m[1] + ' rj R ' + (c - 1.4).toFixed(1) + ' ' + (c + 3).toFixed(1)); out.push(sol[i]); changed++; continue; }
        if (p.x > c + 2.6 && X < c - 1.6) { out.push(m[1] + ' rj L ' + (c + 2.4).toFixed(1) + ' ' + (c - 2).toFixed(1)); out.push(sol[i]); changed++; continue; }
        if ((X >= c - 1.5 && X <= c + 2.5) || (p.x >= c - 1.5 && p.x <= c + 2.5)) return null; // stops on or right next to it
      }
    }
    out.push(sol[i]);
  }
  return changed ? out : null;
}
function addStrips(def, sol) {
  var spikes = [], count = 0, at = objCells(def), map = def.map;
  var cands = [];
  for (var r = 14; r >= 4; r--) for (var c = 3; c <= 27; c++) {
    var ok = true;
    for (var x = c - 1; x <= c + 2 && ok; x++) {
      if (map[r][x] !== '#') ok = false;
      for (var y = r - 3; y <= r - 1; y++) if ('. o'.indexOf(map[y][x]) < 0) ok = false;
      if (at[x + ',' + r] || at[x + ',' + (r - 1)]) ok = false;
    }
    for (var x2 = c - 2; x2 <= c + 3; x2++) if ('12EC'.indexOf(map[r - 1][x2] || '') >= 0) ok = false;
    if (ok) cands.push([c, r]);
  }
  // floor strips first, middle of the room outwards; at most two strips, at least 6 tiles apart
  cands.sort(function (a, b) { return (b[1] - a[1]) || (Math.abs(a[0] - 15) - Math.abs(b[0] - 15)); });
  if (process.env.DBG) console.log('cands', cands.map(String).join(' '));
  for (var k = 0; k < cands.length && count < 2; k++) {
    var c3 = cands[k][0], r3 = cands[k][1];
    if (spikes.some(function (s) { return s[1] === r3 && Math.abs(s[0] - c3) < 6; })) continue;
    var cells = spikes.concat([[c3, r3], [c3 + 1, r3]]);
    var d = withSpikes(def, cells);
    var ns = patchWalks(d, sol, c3, r3);
    if (process.env.DBG) console.log('strip', c3, r3, ns ? score(d, ns).why || 'ok' : 'no patch');
    if (!ns) continue;
    if (score(d, ns).ok) { spikes = cells; sol = ns; def = d; count++; }
  }
  return { count: count, spikes: spikes, sol: sol };
}

var out = {}, levels = V.LV.LEVELS;
for (var n = 51; n <= 100; n++) {
  var base = levels[n - 1], cur = clone(base), notes = [];
  if (!passes(cur)) { console.log(n, 'FAILS before hardening — skipped'); continue; }
  var h = { timers: {}, lifts: {}, spikes: [] };

  // 1. timers
  cur.obj.forEach(function (o, i) {
    if (o.t !== 'timer') return;
    var orig = o.dur || 4, lo = 0.3, hi = orig;
    while (hi - lo > 0.05) {
      var mid = (lo + hi) / 2; o.dur = mid;
      if (passes(cur)) hi = mid; else lo = mid;
    }
    // humans need reaction time on top of the bot's frame-perfect run: 1.3× + 1 s, at least 2 s, and never below 55% of the original
    var d = Math.min(orig, Math.ceil(Math.max(TIMER_MIN, hi * 1.3 + 1, orig * 0.55) * 4) / 4);
    o.dur = d;
    if (!passes(cur)) { o.dur = orig; d = orig; }
    if (d < orig) { h.timers[i] = d; notes.push('bell ' + orig + 's→' + d + 's'); }
  });

  // 2. lifts
  cur.obj.forEach(function (o, i) {
    if (o.t !== 'lift') return;
    var sp = o.speed || 110, pa = o.pause == null ? 0.5 : o.pause;
    var tries = [[LIFT_SPEED, LIFT_PAUSE], [1.15, 0.8]];
    for (var k = 0; k < tries.length; k++) {
      o.speed = Math.round(sp * tries[k][0]); o.pause = Math.round(pa * tries[k][1] * 10) / 10;
      if (passes(cur)) { h.lifts[i] = { speed: o.speed, pause: o.pause }; notes.push('lift ' + sp + '→' + o.speed); break; }
      o.speed = sp; o.pause = pa;
    }
  });

  // 3. spike strips on the walking routes; the scripted solution gets a run-up jump over each one
  var res = addStrips(cur, V.SOL[n].slice());
  if (res.count) { h.spikes = res.spikes; h.sol = res.sol; notes.push(res.count + ' spike strip' + (res.count > 1 ? 's' : '')); }
  out[n] = h;
  console.log(n, base.name.padEnd(22), notes.join(', ') || '(no change)');
}
fs.writeFileSync(path.join(__dirname, 'harden.json'), JSON.stringify(out, null, 1) + '\n');
