#!/usr/bin/env node
/*
 * Headless level checker for Seka & Braco.
 *
 * Usage:  node tools/verify.js            (check every level)
 *         node tools/verify.js 7 12       (check only levels 7 and 12)
 *         node tools/verify.js 7 --trace  (print positions while solving)
 *
 * For every level it:
 *   1. validates the map/object data (sizes, spawns, exit, channels, 3 collectibles),
 *   2. drives the REAL game engine (js/engine.js) with a scripted "bot" that
 *      presses the same virtual keys a player would (tools/solutions.js),
 *   3. requires that both characters reach the exit and that all three
 *      collectibles were picked up on the way.
 * Because the bot uses the same physics, jump heights and collisions as the
 * game, a passing level is proven completable within the real movement limits.
 */
'use strict';
var path = require('path');
var E = require(path.join(__dirname, '..', 'js', 'engine.js'));
var LV = require(path.join(__dirname, '..', 'js', 'levels.js'));
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(function (c) {
  try { require(path.join(__dirname, '..', 'js', 'levels-ch' + c + '.js')); }
  catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
});
var SOL = Object.assign({}, require(path.join(__dirname, 'solutions.js')));
try { Object.assign(SOL, require(path.join(__dirname, 'solutions2.js'))); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }

var T = E.T, STEP = E.STEP;
var args = require.main === module ? process.argv.slice(2) : [];
var trace = args.indexOf('--full') >= 0 ? 'full' : args.indexOf('--trace') >= 0;
var only = args.filter(function (a) { return /^\d+$/.test(a); }).map(Number);

function parseStep(s) {
  return s.split('|').map(function (part) {
    var tk = part.trim().split(/\s+/);
    if (tk[0] === 'wait') return { op: 'wait', t: parseFloat(tk[1]) };
    if (tk[0] === 'at') return { op: 'at', i: parseInt(tk[1], 10), s: parseFloat(tk[2]) };
    var a = { who: tk[0], op: tk[1] };
    if (a.op === 'go') a.x = parseFloat(tk[2]);
    if (a.op === 'air') { a.x = parseFloat(tk[3]); a.glide = tk[4] === 'glide'; }
    if (a.op === 'jump') {
      a.dir = tk[2] === 'R' ? 1 : tk[2] === 'L' ? -1 : 0;
      for (var i = 3; i < tk.length; i++) {
        if (tk[i] === 'glide') a.glide = true;
        else if (tk[i] === 'bounce') a.untilBounce = true;
        else if (tk[i][0] === 'h') a.hold = parseFloat(tk[i].slice(1));
        else a.x = parseFloat(tk[i]);
      }
    }
    if (a.op === 'hold') { a.dir = tk[2] === 'R' ? 1 : -1; a.t = parseFloat(tk[3]); }
    if (a.op === 'rj') { // run-up jump: rj R <takeoffX> <targetX> [glide]
      a.dir = tk[2] === 'R' ? 1 : -1; a.at = parseFloat(tk[3]); a.x = parseFloat(tk[4]); a.glide = tk[5] === 'glide';
    }
    return a;
  });
}

// returns true when the part is finished; otherwise writes inputs
function control(a, w, inp, st, dt) {
  st.t = (st.t || 0) + dt;
  if (a.op === 'wait') return st.t >= a.t;
  if (a.op === 'at') { // wait until lift i reaches position s (0 = start, 1 = end)
    var L = w.lifts[a.i];
    if (st.t > 30) return 'stuck';
    if (a.s >= 1) return L.s >= 0.999;
    if (a.s <= 0) return L.s <= 0.001;
    return Math.abs(L.s - a.s) < 0.03;
  }
  var p = w.players[a.who], I = inp[a.who], cx = p.x + p.w / 2;
  if (a.op === 'use') {
    st.n = (st.n || 0) + 1;
    if (st.n <= 2) { I.use = true; return false; }
    return st.n > 4;
  }
  if (a.op === 'hold') { I[a.dir > 0 ? 'right' : 'left'] = true; return st.t >= a.t; }
  if (a.op === 'air') { // keep steering toward x (holding jump if glide) until landing or the next spring bounce
    var da = a.x * T + T / 2 - cx;
    if (Math.abs(da) > 5) I[da > 0 ? 'right' : 'left'] = true;
    if (a.glide) I.jump = true;
    if (st.lastVy > 200 && p.vy < -900) return true;
    st.lastVy = p.vy;
    if (p.ground && st.t > 0.05) return true;
    return st.t > 6 ? 'stuck' : false;
  }
  if (a.op === 'go') {
    var tx = a.x * T + T / 2, dx = tx - cx;
    var stop = (p.vx * p.vx) / (2 * p.P.decG) + 1.5;
    if (Math.abs(dx) > Math.max(3, stop)) { if (dx > 0) I.right = true; else I.left = true; }
    return Math.abs(dx) <= 7 && !!p.ground && Math.abs(p.vx) < 5;
  }
  if (a.op === 'rj' && !st.ran) {
    var ax = a.at * T + T / 2;
    if ((cx - ax) * a.dir < 0) { I[a.dir > 0 ? 'right' : 'left'] = true; return st.t > 8 ? 'stuck' : false; }
    st.ran = true; st.t = 0;
  }
  if (a.op === 'jump' || a.op === 'rj') {
    if (!st.phase) {
      if (!st.rel && p.prevJump) { st.rel = true; return false; } // release a held jump key first
      st.rel = true;
      I.jump = true;
      if (a.x != null) { var d0 = a.x * T + T / 2 - cx; if (Math.abs(d0) > 6) I[d0 > 0 ? 'right' : 'left'] = true; }
      else if (a.dir) I[a.dir > 0 ? 'right' : 'left'] = true;
      if (!p.ground && p.vy < 0) st.phase = 1;
      if (st.t > 0.5) return 'stuck';
      return false;
    }
    st.air = (st.air || 0) + dt;
    if (a.untilBounce && st.lastVy > 200 && p.vy < -900) return true;
    st.lastVy = p.vy;
    var holdJ = a.glide ? true : (a.hold != null ? st.air < a.hold : p.vy < 0);
    if (holdJ) I.jump = true;
    if (a.x != null) {
      var d = a.x * T + T / 2 - cx;
      if (Math.abs(d) > 5) I[d > 0 ? 'right' : 'left'] = true;
    } else if (a.dir) I[a.dir > 0 ? 'right' : 'left'] = true;
    if (p.ground && st.air > 0.03) {
      // landed: settle on target
      if (a.x != null) {
        var d2 = a.x * T + T / 2 - cx;
        if (Math.abs(d2) > 7) { st.settle = (st.settle || 0) + dt; return st.settle > 1.2 ? true : false; }
      }
      return Math.abs(p.vx) < 30 || st.air > 4;
    }
    return st.air > 6 ? 'stuck' : false;
  }
  throw new Error('unknown op ' + a.op);
}

function solve(def, steps) {
  var w = new E.World(def);
  var log = [];
  for (var si = 0; si < steps.length; si++) {
    var parts = parseStep(steps[si]), sts = parts.map(function () { return {}; }), done = parts.map(function () { return false; });
    var t = 0;
    for (;;) {
      var inp = { S: {}, B: {} }, all = true;
      for (var k = 0; k < parts.length; k++) {
        if (done[k]) continue;
        var r = control(parts[k], w, inp, sts[k], STEP);
        if (r === 'stuck') return { ok: false, why: 'step ' + (si + 1) + ' "' + steps[si] + '" could not start/finish', w: w };
        if (r) done[k] = true; else all = false;
      }
      if (all) {
        if (trace) { var S0 = w.players.S, B0 = w.players.B; log.push('  done ' + (si + 1) + ' "' + steps[si] + '"  S(' + (S0.x / T + 0.3).toFixed(1) + ',' + ((S0.y + S0.h) / T - 1).toFixed(1) + ') B(' + (B0.x / T + 0.375).toFixed(1) + ',' + ((B0.y + B0.h) / T - 1).toFixed(1) + ')' + w.crates.map(function (c) { return ' C(' + (c.x / T).toFixed(2) + ',' + (c.y / T).toFixed(2) + ')'; }).join('')); }
        break;
      }
      w.step(STEP, inp);
      t += STEP;
      if (trace === 'full' && Math.round(t * 120) % 12 === 0) {
        var S = w.players.S, B = w.players.B;
        log.push('  [' + (si + 1) + '] S(' + (S.x / T).toFixed(2) + ',' + (S.y / T).toFixed(2) + (S.ground ? ' g' : '') + ') B(' + (B.x / T).toFixed(2) + ',' + (B.y / T).toFixed(2) + (B.ground ? ' g' : '') + ')' + w.crates.map(function (c) { return ' C' + (c.x / T).toFixed(2) + ',' + (c.y / T).toFixed(2); }).join(''));
      }
      if (w.state === 'dying' || w.state === 'failed') {
        var dead = w.players.S.dead ? 'Seka' : 'Braco';
        return { ok: false, why: dead + ' died during step ' + (si + 1) + ' "' + steps[si] + '"', w: w, log: log };
      }
      if (w.state === 'won') return { ok: true, w: w, step: si + 1, of: steps.length, log: log };
      if (t > 20) return { ok: false, why: 'timeout in step ' + (si + 1) + ' "' + steps[si] + '"', w: w, log: log };
    }
  }
  for (var f = 0; f < 240; f++) { w.step(STEP, { S: {}, B: {} }); if (w.state === 'won') return { ok: true, w: w, log: log }; }
  return { ok: false, why: 'script ended but level not complete', w: w, log: log };
}

if (require.main !== module) { module.exports = { solve: solve, SOL: SOL, E: E, LV: LV }; return; }
var levels = LV.LEVELS, failures = 0, report = [];
levels.forEach(function (def, i) {
  var n = i + 1;
  if (only.length && only.indexOf(n) < 0) return;
  var errs = E.validateLevel(def);
  if (def.id !== n) errs.push('id mismatch');
  var sol = SOL[n];
  var res = errs.length ? null : (sol ? solve(def, sol) : { ok: false, why: 'no solution script' });
  var coins = res && res.w ? res.w.coins.filter(function (c) { return c.taken; }).length : 0;
  var ok = !errs.length && res.ok && coins === 3;
  if (!ok) failures++;
  var S = res && res.w ? res.w.players.S : null, B = res && res.w ? res.w.players.B : null;
  var line = (ok ? 'PASS' : 'FAIL') + ' ' + String(n).padStart(2) + ' ' + def.name.padEnd(28) +
    (errs.length ? ' data: ' + errs.join('; ') : (res.ok ? ' solved, collectibles ' + coins + '/3' + (res.w ? ', ' + res.w.t.toFixed(1) + 's sim' : '') : ' ' + res.why +
      (S ? ' | S at (' + (S.x / T).toFixed(1) + ',' + (S.y / T).toFixed(1) + ') B at (' + (B.x / T).toFixed(1) + ',' + (B.y / T).toFixed(1) + ')' : '')));
  if (res && res.w && coins < 3) line += ' | missing coins at ' + res.w.coins.filter(function (c) { return !c.taken; }).map(function (c) { return '(' + Math.floor(c.x / T) + ',' + Math.floor(c.y / T) + ')'; }).join(' ');
  report.push(line);
  console.log(line);
  if (trace && res && res.log) console.log(res.log.join('\n'));
});
console.log('\n' + (report.length - failures) + '/' + report.length + ' levels verified');
process.exit(failures ? 1 : 0);
