/*
 * Seka & Braco — simulation engine.
 * Pure game logic with no DOM access, so the same code runs in the browser
 * and in the headless level checker (tools/verify.js).
 * The world advances in fixed 1/120 s steps for consistent physics.
 */
(function (root) {
  'use strict';

  var T = 40, COLS = 32, ROWS = 18;
  var STEP = 1 / 120;

  var PHYS = {
    g: 2000, maxFall: 950, coyote: 0.1, buffer: 0.13, cut: 0.45,
    padV: 1100, pushSpeed: 130, breakTime: 0.3, gateSpeed: 2.6,
    S: { w: 24, h: 54, run: 225, jump: 740, accG: 2600, decG: 3000, accA: 1700, decA: 900, glide: 85, push: false, heavy: false },
    B: { w: 30, h: 58, run: 215, jump: 620, accG: 2400, decG: 3000, accA: 1500, decA: 900, glide: 0, push: true, heavy: true }
  };

  var EPS = 1e-4;
  var CRATE_W = 36, CRATE_H = 40;
  var LIFT_H = 14;

  function overlap(a, b) {
    return a.x < b.x + b.w - EPS && a.x + a.w > b.x + EPS && a.y < b.y + b.h - EPS && a.y + a.h > b.y + EPS;
  }
  function chList(ch) { return ch == null ? [] : (Array.isArray(ch) ? ch : [ch]); }

  function World(def) {
    this.def = def;
    this.reset();
  }

  World.prototype.reset = function () {
    var def = this.def, y, x;
    this.grid = def.map.map(function (r) { return r.split(''); });
    this.players = {};
    this.crates = [];
    this.coins = [];
    this.exit = null;
    for (y = 0; y < ROWS; y++) {
      for (x = 0; x < COLS; x++) {
        var c = this.grid[y][x];
        if (c === '1' || c === '2') {
          var kind = c === '1' ? 'S' : 'B';
          this.players[kind] = this.mkPlayer(kind, x, y);
          this.grid[y][x] = ' ';
        } else if (c === 'C') {
          this.crates.push({ isCrate: true, kind: 'crate', x: x * T + (T - CRATE_W) / 2, y: (y + 1) * T - CRATE_H, w: CRATE_W, h: CRATE_H, vy: 0, ground: null });
          this.grid[y][x] = ' ';
        } else if (c === 'o') {
          this.coins.push({ x: x * T + T / 2, y: y * T + T / 2, taken: false, idx: this.coins.length });
          this.grid[y][x] = ' ';
        } else if (c === 'E') {
          this.exit = { tx: x, ty: y, x: x * T + T / 2 - 34, y: (y + 1) * T - 84, w: 68, h: 84 };
          this.grid[y][x] = ' ';
        }
      }
    }
    this.plates = []; this.levers = []; this.timers = []; this.gates = []; this.lifts = []; this.signs = [];
    var objs = def.obj || [];
    for (var i = 0; i < objs.length; i++) {
      var o = objs[i];
      if (o.t === 'plate') this.plates.push({ tx: o.x, ty: o.y, ch: o.ch, heavy: !!o.heavy, x: o.x * T + 3, y: (o.y + 1) * T - 8, w: T - 6, h: 8, on: false });
      else if (o.t === 'timer') this.timers.push({ tx: o.x, ty: o.y, ch: o.ch, dur: o.dur || 4, x: o.x * T + 3, y: (o.y + 1) * T - 8, w: T - 6, h: 8, left: 0, pressed: false });
      else if (o.t === 'lever') this.levers.push({ tx: o.x, ty: o.y, ch: o.ch, on: !!o.on, x: o.x * T, y: o.y * T, w: T, h: T, flip: 0 });
      else if (o.t === 'gate') this.gates.push({ tx: o.x, ty: o.y, ch: o.ch, inv: !!o.inv, X: o.x * T, Y: o.y * T, W: (o.w || 1) * T, H: (o.h || 1) * T, horiz: (o.w || 1) > (o.h || 1), open: 0 });
      else if (o.t === 'lift') {
        var lf = {
          ch: o.ch, skin: o.skin || 'lift', speed: o.speed || 110, pause: o.pause == null ? 0.5 : o.pause,
          ax: o.x * T, ay: o.y * T, bx: o.to[0] * T, by: o.to[1] * T, w: (o.w || 2) * T, h: LIFT_H,
          loop: !!o.loop, s: 0, dir: 1, wait: 0, x: o.x * T, y: o.y * T, dx: 0, dy: 0, isLift: true
        };
        lf.len = Math.max(1, Math.hypot(lf.bx - lf.ax, lf.by - lf.ay));
        this.lifts.push(lf);
      } else if (o.t === 'sign') this.signs.push({ tx: o.x, ty: o.y, text: o.text });
    }
    this.t = 0;
    this.state = 'play';
    this.failT = 0;
    this.winT = 0;
    this.events = [];
    this.active = {};
    this.computeChannels();
    for (i = 0; i < this.gates.length; i++) {
      var g = this.gates[i];
      g.open = this.gateTarget(g);
      this.gateRect(g);
    }
    for (i = 0; i < this.lifts.length; i++) {
      var L = this.lifts[i];
      if (L.ch != null && !L.loop && this.isOn(L.ch)) L.s = 1;
      L.x = L.ax + (L.bx - L.ax) * L.s;
      L.y = L.ay + (L.by - L.ay) * L.s;
    }
  };

  World.prototype.mkPlayer = function (kind, tx, ty) {
    var P = PHYS[kind];
    return {
      kind: kind, isPlayer: true, P: P, w: P.w, h: P.h,
      x: tx * T + (T - P.w) / 2, y: (ty + 1) * T - P.h,
      vx: 0, vy: 0, ground: null, coyote: 0, buffer: 0, jumping: false,
      prevJump: false, prevUse: false, facing: kind === 'S' ? 1 : -1,
      dead: false, breakT: 0, gliding: false, pushing: false, inDoor: false,
      lastDx: 0, lastDy: 0, airT: 0
    };
  };

  World.prototype.emit = function (type, data) {
    var e = data || {};
    e.type = type;
    this.events.push(e);
  };

  // ---------- tiles ----------
  World.prototype.tile = function (tx, ty) {
    if (tx < 0 || tx >= COLS || ty < 0) return '#';
    if (ty >= ROWS) return ' ';
    return this.grid[ty][tx];
  };

  // ---------- logic ----------
  World.prototype.isOn = function (ch) {
    var l = chList(ch);
    for (var i = 0; i < l.length; i++) if (!this.active[l[i]]) return false;
    return l.length > 0;
  };

  World.prototype.gateTarget = function (g) {
    var on = this.isOn(g.ch);
    return (on !== g.inv) ? 1 : 0;
  };

  World.prototype.gateRect = function (g) {
    var k = 1 - g.open;
    if (g.horiz) { g.x = g.X; g.y = g.Y; g.w = g.W * k; g.h = g.H; }
    else { g.x = g.X; g.y = g.Y; g.w = g.W; g.h = g.H * k; }
    return g;
  };

  World.prototype.onTrigger = function (e, p) {
    if (e.dead) return false;
    if (!(e.x < p.x + p.w && e.x + e.w > p.x)) return false;
    var b = e.y + e.h;
    return b >= p.y - 3 && b <= p.y + p.h + 3;
  };

  World.prototype.computeChannels = function () {
    var a = {}, i, k;
    for (i = 0; i < this.plates.length; i++) if (this.plates[i].on) a[this.plates[i].ch] = true;
    for (i = 0; i < this.timers.length; i++) if (this.timers[i].left > 0) a[this.timers[i].ch] = true;
    for (i = 0; i < this.levers.length; i++) if (this.levers[i].on) a[this.levers[i].ch] = true;
    this.active = a;
  };

  World.prototype.updateLogic = function (dt, inp) {
    var i, j, k, ents = this.weighted();
    for (i = 0; i < this.plates.length; i++) {
      var p = this.plates[i], on = false;
      for (j = 0; j < ents.length; j++) {
        var e = ents[j];
        if (p.heavy && !(e.isCrate || e.kind === 'B')) continue;
        if (this.onTrigger(e, p)) { on = true; break; }
      }
      if (on && !p.on) this.emit('plate', { on: true });
      if (!on && p.on) this.emit('plate', { on: false });
      p.on = on;
    }
    for (i = 0; i < this.timers.length; i++) {
      var tm = this.timers[i], pr = false;
      for (j = 0; j < ents.length; j++) if (this.onTrigger(ents[j], tm)) { pr = true; break; }
      if (pr) { if (tm.left <= 0) this.emit('bell'); tm.left = tm.dur; }
      else if (tm.left > 0) { tm.left -= dt; if (tm.left <= 0) { tm.left = 0; this.emit('timeout'); } }
      tm.pressed = pr;
    }
    var kinds = ['S', 'B'];
    for (k = 0; k < 2; k++) {
      var pl = this.players[kinds[k]], pin = inp[kinds[k]] || {};
      var useEdge = pin.use && !pl.prevUse;
      pl.prevUse = !!pin.use;
      if (!useEdge || pl.dead) continue;
      for (i = 0; i < this.levers.length; i++) {
        var lv = this.levers[i];
        var zone = { x: lv.x - 10, y: lv.y - 10, w: lv.w + 20, h: lv.h + 14 };
        if (overlap(pl, zone)) { lv.on = !lv.on; this.emit('lever', { on: lv.on }); break; }
      }
    }
    this.computeChannels();
  };

  World.prototype.weighted = function () {
    var a = [];
    if (!this.players.S.dead) a.push(this.players.S);
    if (!this.players.B.dead) a.push(this.players.B);
    return a.concat(this.crates);
  };

  World.prototype.updateGates = function (dt) {
    var bodies = this.weighted();
    for (var i = 0; i < this.gates.length; i++) {
      var g = this.gates[i], tgt = this.gateTarget(g);
      if (g.open === tgt) { this.gateRect(g); continue; }
      var prev = g.open;
      if (tgt > g.open) g.open = Math.min(1, g.open + PHYS.gateSpeed * dt);
      else {
        g.open = Math.max(0, g.open - PHYS.gateSpeed * dt);
        this.gateRect(g);
        var blocked = false;
        for (var j = 0; j < bodies.length; j++) if (overlap(bodies[j], g)) { blocked = true; break; }
        if (blocked) g.open = prev;
      }
      if ((prev === 0 && g.open > 0) || (prev === 1 && g.open < 1)) this.emit('gate');
      this.gateRect(g);
    }
  };

  World.prototype.updateLifts = function (dt) {
    for (var i = 0; i < this.lifts.length; i++) {
      var L = this.lifts[i];
      var ox = L.x, oy = L.y, ds = L.speed * dt / L.len;
      if (L.ch != null && !L.loop) {
        var tg = this.isOn(L.ch) ? 1 : 0;
        if (L.s < tg) L.s = Math.min(tg, L.s + ds);
        else if (L.s > tg) L.s = Math.max(tg, L.s - ds);
      } else if (L.ch == null || this.isOn(L.ch)) {
        if (L.wait > 0) L.wait -= dt;
        else {
          L.s += ds * L.dir;
          if (L.s >= 1) { L.s = 1; L.dir = -1; L.wait = L.pause; }
          else if (L.s <= 0) { L.s = 0; L.dir = 1; L.wait = L.pause; }
        }
      }
      L.x = L.ax + (L.bx - L.ax) * L.s;
      L.y = L.ay + (L.by - L.ay) * L.s;
      L.dx = L.x - ox; L.dy = L.y - oy;
      if (L.dx || L.dy) this.carry(L, L.dx, L.dy, 0);
    }
  };

  // Move everything standing on `base` along with it.
  World.prototype.carry = function (base, dx, dy, depth) {
    if (depth > 4) return;
    var ents = [this.players.S, this.players.B].concat(this.crates);
    for (var i = 0; i < ents.length; i++) {
      var e = ents[i];
      if (e === base || e.ground !== base || e.dead) continue;
      var ox = e.x, oy = e.y;
      if (dx) this.moveX(e, dx, false);
      if (dy) this.moveY(e, dy);
      e.ground = base;
      var mx = e.x - ox, my = e.y - oy;
      if (mx || my) this.carry(e, mx, my, depth + 1);
    }
  };

  // ---------- collision ----------
  World.prototype.blockers = function (e) {
    var out = [], i;
    var x0 = Math.floor((e.x - 2) / T), x1 = Math.floor((e.x + e.w + 2) / T);
    var y0 = Math.floor((e.y - 2) / T), y1 = Math.floor((e.y + e.h + 2) / T);
    for (var ty = y0; ty <= y1; ty++) {
      for (var tx = x0; tx <= x1; tx++) {
        var c = this.tile(tx, ty);
        if (c === '#' || c === 'X' || c === 'b') out.push({ x: tx * T, y: ty * T, w: T, h: T, tile: c, tx: tx, ty: ty });
        else if (c === '-' && e.kind !== 'never') out.push({ x: tx * T, y: ty * T, w: T, h: 12, oneway: true, tile: c });
        else if (c === '=' && e.kind === 'S') out.push({ x: tx * T, y: ty * T, w: T, h: 12, oneway: true, tile: c });
      }
    }
    for (i = 0; i < this.gates.length; i++) {
      var g = this.gates[i];
      if (g.w > 0.5 && g.h > 0.5) out.push({ x: g.x, y: g.y, w: g.w, h: g.h, ref: g });
    }
    for (i = 0; i < this.crates.length; i++) {
      var c2 = this.crates[i];
      if (c2 !== e) out.push({ x: c2.x, y: c2.y, w: c2.w, h: c2.h, ref: c2 });
    }
    for (i = 0; i < this.lifts.length; i++) {
      var L = this.lifts[i];
      out.push({ x: L.x, y: L.y, w: L.w, h: L.h, oneway: true, ref: L });
    }
    var ps = ['S', 'B'];
    for (i = 0; i < 2; i++) {
      var p = this.players[ps[i]];
      if (p === e || p.dead) continue;
      if (e.isCrate) out.push({ x: p.x, y: p.y, w: p.w, h: p.h, ref: p });
      else out.push({ x: p.x, y: p.y, w: p.w, h: 8, oneway: true, ref: p });
    }
    return out;
  };

  World.prototype.moveX = function (e, dx, canPush) {
    if (!dx) return null;
    e.x += dx;
    var hit = null, bl = this.blockers(e);
    for (var i = 0; i < bl.length; i++) {
      var b = bl[i];
      if (b.oneway || !overlap(e, b)) continue;
      if (canPush && b.ref && b.ref.isCrate) {
        var need = dx > 0 ? (e.x + e.w) - b.x : -((b.x + b.w) - e.x);
        this._pusher = e;
        this.pushCrate(b.ref, need, 0);
        this._pusher = null;
        b.x = b.ref.x;
        e.pushing = true;
        if (!overlap(e, b)) continue;
      }
      if (dx > 0) e.x = Math.min(e.x, b.x - e.w);
      else e.x = Math.max(e.x, b.x + b.w);
      hit = b;
      if (b.tile === 'X') this._hitX = b;
    }
    return hit;
  };

  World.prototype.pushCrate = function (c, dx, depth) {
    if (depth > 3) return 0;
    var ox = c.x;
    c.x += dx;
    var bl = this.blockers(c);
    for (var i = 0; i < bl.length; i++) {
      var b = bl[i];
      if (b.oneway || !overlap(c, b)) continue;
      if (b.ref && b.ref === this._pusher) continue;
      if (b.ref && b.ref.isCrate) {
        var need = dx > 0 ? (c.x + c.w) - b.x : -((b.x + b.w) - c.x);
        this.pushCrate(b.ref, need, depth + 1);
        b.x = b.ref.x;
        if (!overlap(c, b)) continue;
      }
      if (dx > 0) c.x = Math.min(c.x, b.x - c.w);
      else c.x = Math.max(c.x, b.x + b.w);
    }
    var moved = c.x - ox;
    if (Math.abs(moved) < 1e-6) { c.x = ox; return 0; }
    this.carry(c, moved, 0, depth + 1);
    return moved;
  };

  World.prototype.moveY = function (e, dy) {
    var res = { landed: null, ceil: false };
    if (!dy) return res;
    var pb = e.y + e.h, oy = e.y;
    e.y += dy;
    var probe = { x: e.x, y: e.y, w: e.w, h: e.h };
    var bl = this.blockers(e), bestY = Infinity, ceilY = -Infinity;
    for (var i = 0; i < bl.length; i++) {
      var b = bl[i];
      if (!overlap(probe, b)) continue;
      if (dy > 0) {
        if (b.oneway && pb > b.y + 0.75) continue;
        if (b.y < bestY - 1e-6 || (b.y < bestY + 1e-6 && b.ref && b.ref.isLift)) { bestY = Math.min(bestY, b.y); res.landed = b; }
      } else if (!b.oneway) {
        if (b.y + b.h > ceilY) { ceilY = b.y + b.h; res.ceil = true; }
      }
    }
    if (res.landed) e.y = Math.max(Math.min(e.y, bestY - e.h), Math.min(oy, bestY - e.h));
    if (res.ceil) e.y = Math.max(e.y, ceilY);
    return res;
  };

  // ---------- players ----------
  World.prototype.updatePlayer = function (p, pin, dt) {
    var P = p.P;
    p.pushing = false;
    if (p.dead) return;
    var dir = (pin.right ? 1 : 0) - (pin.left ? 1 : 0);
    if (dir) p.facing = dir;
    var grounded = !!p.ground;
    if (grounded) { p.coyote = PHYS.coyote; p.airT = 0; } else { p.coyote -= dt; p.airT += dt; }
    if (pin.jump && !p.prevJump) p.buffer = PHYS.buffer; else p.buffer -= dt;
    p.prevJump = !!pin.jump;

    var run = P.run;
    if (p.wasPushing) run = Math.min(run, PHYS.pushSpeed);
    var target = dir * run;
    var acc = grounded ? (dir ? P.accG : P.decG) : (dir ? P.accA : P.decA);
    if (dir && p.vx * dir < 0) acc *= 1.6;
    if (p.vx < target) p.vx = Math.min(target, p.vx + acc * dt);
    else if (p.vx > target) p.vx = Math.max(target, p.vx - acc * dt);

    if (p.buffer > 0 && p.coyote > 0) {
      p.vy = -P.jump;
      p.buffer = 0; p.coyote = 0; p.jumping = true;
      p.ground = null;
      this.emit('jump', { who: p.kind });
    }
    if (!pin.jump && p.jumping && p.vy < 0) { p.vy *= PHYS.cut; p.jumping = false; }
    if (p.vy >= 0) p.jumping = false;
    p.vy += PHYS.g * dt;
    p.gliding = false;
    if (P.glide && pin.jump && p.vy > P.glide && !p.ground && p.airT > 0.05) { p.vy = P.glide; p.gliding = true; }
    if (p.vy > PHYS.maxFall) p.vy = PHYS.maxFall;

    var ox = p.x, oy = p.y;
    this._hitX = null;
    var hit = this.moveX(p, p.vx * dt, P.push && grounded);
    if (hit) {
      var hx = this._hitX;
      if (P.push && hx && dir === Math.sign(p.vx || dir)) {
        p.breakT += dt;
        if (p.breakT >= PHYS.breakTime) { this.breakWall(hx.tx, hx.ty); p.breakT = 0; }
      } else p.breakT = 0;
      p.vx = 0;
    } else p.breakT = 0;
    p.wasPushing = p.pushing;

    var wasGround = p.ground;
    p.ground = null;
    var r = this.moveY(p, p.vy * dt);
    if (r.landed) {
      if (r.landed.tile === 'b') {
        p.vy = -PHYS.padV; p.jumping = false; p.ground = null;
        this.emit('bounce', { who: p.kind });
      } else {
        if (!wasGround && p.vy > 300) this.emit('land', { who: p.kind });
        p.vy = 0;
        p.ground = r.landed.ref || r.landed;
      }
    } else if (r.ceil && p.vy < 0) { p.vy = 0; }
    p.lastDx = p.x - ox; p.lastDy = p.y - oy;
  };

  World.prototype.breakWall = function (tx, ty) {
    var stack = [[tx, ty]], tiles = [];
    while (stack.length) {
      var q = stack.pop(), x = q[0], y = q[1];
      if (this.tile(x, y) !== 'X' || x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
      this.grid[y][x] = ' ';
      tiles.push([x, y]);
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    this.emit('break', { tiles: tiles });
  };

  World.prototype.updateCrate = function (c, dt) {
    c.vy = Math.min(PHYS.maxFall, c.vy + PHYS.g * dt);
    var was = c.ground;
    c.ground = null;
    var r = this.moveY(c, c.vy * dt);
    if (r.landed) {
      if (!was && c.vy > 400) this.emit('thud');
      c.vy = 0; c.ground = r.landed.ref || r.landed;
    } else if (r.ceil) c.vy = 0;
  };

  // ---------- hazards, pickups, exit ----------
  World.prototype.hazardHit = function (p) {
    var hb = { x: p.x + 4, y: p.y + 6, w: p.w - 8, h: p.h - 7 };
    var x0 = Math.floor(hb.x / T), x1 = Math.floor((hb.x + hb.w) / T);
    var y0 = Math.floor(hb.y / T), y1 = Math.floor((hb.y + hb.h) / T);
    for (var ty = y0; ty <= y1; ty++) for (var tx = x0; tx <= x1; tx++) {
      var c = this.tile(tx, ty), r = null;
      if (c === '~' || c === 'w') r = { x: tx * T, y: ty * T + 14, w: T, h: T - 14 };
      else if (c === '^') r = { x: tx * T + 5, y: ty * T + 18, w: T - 10, h: T - 18 };
      if (r && overlap(hb, r)) return c;
    }
    return null;
  };

  World.prototype.kill = function (p, cause) {
    if (p.dead) return;
    p.dead = true;
    this.state = 'dying';
    this.failT = 0.85;
    this.emit('die', { who: p.kind, cause: cause });
  };

  World.prototype.step = function (dt, inp) {
    if (this.state === 'won' || this.state === 'failed') return;
    if (this.state === 'dying') {
      this.failT -= dt;
      if (this.failT <= 0) this.state = 'failed';
      return;
    }
    this.t += dt;
    inp = inp || {};
    this.updateLogic(dt, inp);
    this.updateGates(dt);
    this.updateLifts(dt);

    var S = this.players.S, B = this.players.B, i;
    var order = (S.ground === B) ? [B, S] : [S, B];
    for (i = 0; i < 2; i++) {
      var p = order[i];
      var bx = p.x, by = p.y;
      this.updatePlayer(p, inp[p.kind] || {}, dt);
      var o = order[1 - i];
      if (i === 0 && o.ground === p && (p.x !== bx || p.y !== by)) this.carry(p, p.x - bx, p.y - by, 1);
    }
    // carried rider processed first: keep it on its base if the base moved afterwards
    var second = order[1], first = order[0];
    if (first.ground === second && (second.lastDx || second.lastDy)) this.carry(second, second.lastDx, second.lastDy, 1);

    for (i = 0; i < this.crates.length; i++) this.updateCrate(this.crates[i], dt);

    // hazards / falling out
    var ps = [S, B];
    for (i = 0; i < 2; i++) {
      var pl = ps[i];
      if (pl.dead) continue;
      if (pl.y > ROWS * T + 40) { this.kill(pl, 'fall'); continue; }
      var hz = this.hazardHit(pl);
      if (hz) this.kill(pl, hz);
    }
    if (this.state !== 'play') return;

    for (i = 0; i < this.coins.length; i++) {
      var cn = this.coins[i];
      if (cn.taken) continue;
      var box = { x: cn.x - 15, y: cn.y - 15, w: 30, h: 30 };
      if (overlap(S, box) || overlap(B, box)) { cn.taken = true; this.emit('coin', { idx: i }); }
    }

    var ex = this.exit, both = true;
    for (i = 0; i < 2; i++) {
      var q = ps[i], cx = q.x + q.w / 2, bot = q.y + q.h;
      q.inDoor = cx > ex.x + 6 && cx < ex.x + ex.w - 6 && bot > ex.y + 20 && bot <= ex.y + ex.h + 2 && !!q.ground;
      if (!q.inDoor) both = false;
    }
    if (both) {
      this.winT += dt;
      if (this.winT >= 0.35) { this.state = 'won'; this.emit('win'); }
    } else this.winT = 0;
  };

  World.prototype.coinsTaken = function () {
    return this.coins.map(function (c) { return c.taken; });
  };

  // ---------- level validation ----------
  function validateLevel(def) {
    var err = [];
    if (!def.map || def.map.length !== ROWS) err.push('map must have ' + ROWS + ' rows');
    var counts = {};
    (def.map || []).forEach(function (r, i) {
      if (r.length !== COLS) err.push('row ' + i + ' has width ' + r.length);
      for (var j = 0; j < r.length; j++) {
        var c = r[j];
        if ('#X-=~w^b 12CoE'.indexOf(c) < 0) err.push('bad char "' + c + '" at ' + j + ',' + i);
        counts[c] = (counts[c] || 0) + 1;
      }
    });
    if (counts['1'] !== 1) err.push('need exactly one Seka spawn');
    if (counts['2'] !== 1) err.push('need exactly one Braco spawn');
    if (counts.E !== 1) err.push('need exactly one exit');
    if ((counts.o || 0) !== 3) err.push('need 3 collectibles, found ' + (counts.o || 0));
    var sources = {}, users = {};
    (def.obj || []).forEach(function (o) {
      if (o.x < 0 || o.x >= COLS || o.y < 0 || o.y >= ROWS) err.push('object out of range ' + JSON.stringify(o));
      if (o.t === 'plate' || o.t === 'lever' || o.t === 'timer') sources[o.ch] = 1;
      if ((o.t === 'gate' || o.t === 'lift') && o.ch != null) chList(o.ch).forEach(function (c) { users[c] = 1; });
      if (o.t === 'lift' && !o.to) err.push('lift without destination');
    });
    Object.keys(users).forEach(function (c) { if (!sources[c]) err.push('channel ' + c + ' has no switch'); });
    Object.keys(sources).forEach(function (c) { if (!users[c]) err.push('channel ' + c + ' switch controls nothing'); });
    if (!def.name) err.push('missing name');
    if (!def.hint) err.push('missing hint');
    return err;
  }

  var api = {
    T: T, COLS: COLS, ROWS: ROWS, W: COLS * T, H: ROWS * T, STEP: STEP,
    PHYS: PHYS, World: World, validateLevel: validateLevel, overlap: overlap, chList: chList
  };
  root.SB_ENGINE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
