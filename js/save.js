/*
 * Seka & Braco — saving.
 * Progress lives in this browser's localStorage under one key. It does NOT
 * sync between browsers or devices; use Backup → export/import for that.
 * The format is versioned and every field is validated on load, so a damaged
 * save never crashes the game: bad fields fall back to defaults, and a save
 * that cannot be read at all is copied aside and replaced with a fresh one.
 */
(function (root) {
  'use strict';
  var KEY = 'sekaBraco.save';
  var CORRUPT_KEY = 'sekaBraco.save.damaged';
  var VERSION = 1;
  var LEVELS = 100;

  var DEFAULT_KEYS = {
    S: { left: 'KeyA', right: 'KeyD', jump: 'KeyW', use: 'KeyS' },
    B: { left: 'ArrowLeft', right: 'ArrowRight', jump: 'ArrowUp', use: 'ArrowDown' }
  };

  function defaults() {
    return {
      v: VERSION,
      unlocked: 1,          // highest level that can be played
      current: 1,           // level Continue starts
      done: [],             // completed level ids
      coins: {},            // level id -> [bool, bool, bool] best collection
      settings: {
        names: { S: 'Seka', B: 'Braco' },
        keys: JSON.parse(JSON.stringify(DEFAULT_KEYS)),
        sfx: true, music: true, volume: 0.7, hints: true, reduceMotion: false,
        outfit: { S: 'classic', B: 'classic' }
      },
      won: false
    };
  }

  var available = (function () {
    try {
      var k = '__sb_test__';
      root.localStorage.setItem(k, '1');
      root.localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  })();

  function int(v, lo, hi, d) { v = Math.floor(Number(v)); return isFinite(v) && v >= lo && v <= hi ? v : d; }
  function str(v, d, max) { return typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : d; }
  function bool(v, d) { return typeof v === 'boolean' ? v : d; }
  var CODE_RE = /^[A-Za-z0-9]{1,24}$/;

  // Returns {data, repaired:bool}. Never throws.
  function sanitize(raw) {
    var d = defaults(), repaired = false;
    if (!raw || typeof raw !== 'object') return { data: d, repaired: true };
    if (raw.v !== VERSION) repaired = true; // future versions: migrate here
    d.unlocked = int(raw.unlocked, 1, LEVELS, 1);
    d.current = int(raw.current, 1, d.unlocked, Math.min(d.unlocked, 1));
    if (Array.isArray(raw.done)) {
      raw.done.forEach(function (n) { n = int(n, 1, LEVELS, 0); if (n && d.done.indexOf(n) < 0) d.done.push(n); });
      d.done.sort(function (a, b) { return a - b; });
    } else if (raw.done != null) repaired = true;
    // a completed level always unlocks the next one
    d.done.forEach(function (n) { d.unlocked = Math.max(d.unlocked, Math.min(LEVELS, n + 1)); });
    if (raw.coins && typeof raw.coins === 'object') {
      Object.keys(raw.coins).forEach(function (k) {
        var n = int(k, 1, LEVELS, 0), a = raw.coins[k];
        if (n && Array.isArray(a) && a.length === 3) d.coins[n] = a.map(function (x) { return x === true; });
        else repaired = true;
      });
    }
    var s = raw.settings || {};
    var names = s.names || {};
    d.settings.names.S = str(names.S, 'Seka', 14);
    d.settings.names.B = str(names.B, 'Braco', 14);
    var keys = s.keys || {}, used = {};
    ['S', 'B'].forEach(function (p) {
      ['left', 'right', 'jump', 'use'].forEach(function (a) {
        var code = keys[p] && keys[p][a];
        if (typeof code === 'string' && CODE_RE.test(code) && !used[code]) d.settings.keys[p][a] = code;
        else if (code != null) repaired = true;
        used[d.settings.keys[p][a]] = true;
      });
    });
    // duplicate bindings after repair? fall back to the defaults entirely
    var all = [];
    ['S', 'B'].forEach(function (p) { ['left', 'right', 'jump', 'use'].forEach(function (a) { all.push(d.settings.keys[p][a]); }); });
    if (all.some(function (c, i) { return all.indexOf(c) !== i; })) { d.settings.keys = JSON.parse(JSON.stringify(DEFAULT_KEYS)); repaired = true; }
    d.settings.sfx = bool(s.sfx, true);
    d.settings.music = bool(s.music, true);
    d.settings.volume = typeof s.volume === 'number' && s.volume >= 0 && s.volume <= 1 ? s.volume : 0.7;
    d.settings.hints = bool(s.hints, true);
    d.settings.reduceMotion = bool(s.reduceMotion, false);
    var of = s.outfit || {}, OFS = root.SB_OUTFITS;
    ['S', 'B'].forEach(function (p) {
      var id = of[p];
      if (typeof id === 'string' && (!OFS || OFS.ids(p).indexOf(id) >= 0)) d.settings.outfit[p] = id;
      else if (id != null) repaired = true;
    });
    d.won = bool(raw.won, false);
    if (d.current > d.unlocked) d.current = d.unlocked;
    return { data: d, repaired: repaired };
  }

  var state = defaults();
  var notice = null; // message for the UI after load

  function load() {
    if (!available) { notice = 'storage'; state = defaults(); return state; }
    var txt = null;
    try { txt = root.localStorage.getItem(KEY); } catch (e) { notice = 'storage'; return state; }
    if (txt == null) { state = defaults(); return state; }
    var parsed;
    try { parsed = JSON.parse(txt); } catch (e) { parsed = undefined; }
    if (parsed === undefined || parsed === null || typeof parsed !== 'object') {
      try { root.localStorage.setItem(CORRUPT_KEY, txt); } catch (e2) { /* ignore */ }
      state = defaults();
      notice = 'corrupt';
      write();
      return state;
    }
    var r = sanitize(parsed);
    state = r.data;
    if (r.repaired) { notice = 'repaired'; write(); }
    return state;
  }

  function write() {
    if (!available) return false;
    try { root.localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch (e) { notice = 'storage'; return false; }
  }

  function completeLevel(id, coins) {
    if (state.done.indexOf(id) < 0) { state.done.push(id); state.done.sort(function (a, b) { return a - b; }); }
    var best = state.coins[id] || [false, false, false];
    state.coins[id] = best.map(function (b, i) { return b || !!coins[i]; });
    if (id < LEVELS) { state.unlocked = Math.max(state.unlocked, id + 1); state.current = id + 1; }
    else { state.won = true; state.current = LEVELS; }
    return write();
  }
  function setCurrent(id) { state.current = Math.max(1, Math.min(state.unlocked, id)); write(); }
  function reset() {
    var keep = state.settings;
    state = defaults();
    state.settings = keep;
    return write();
  }
  function totalCoins() {
    var n = 0;
    Object.keys(state.coins).forEach(function (k) { state.coins[k].forEach(function (b) { if (b) n++; }); });
    return n;
  }

  // Backup codes: base64 of the JSON with a short prefix so typos are detected.
  function exportCode() {
    var json = JSON.stringify(state);
    return 'SB1-' + root.btoa(unescape(encodeURIComponent(json)));
  }
  function importCode(code) {
    code = String(code || '').trim();
    if (code.indexOf('SB1-') !== 0) return { ok: false, msg: 'That does not look like a Seka & Braco backup code.' };
    var obj;
    try { obj = JSON.parse(decodeURIComponent(escape(root.atob(code.slice(4).replace(/\s+/g, ''))))); }
    catch (e) { return { ok: false, msg: 'The backup code is damaged or incomplete. Copy the whole code and try again.' }; }
    if (!obj || typeof obj !== 'object' || obj.v !== VERSION) return { ok: false, msg: 'This backup comes from an unknown version of the game.' };
    state = sanitize(obj).data;
    var saved = write();
    return { ok: true, msg: saved ? 'Backup restored.' : 'Backup loaded for this session, but this browser cannot store it.' };
  }

  root.SB_SAVE = {
    load: load, write: write, completeLevel: completeLevel, setCurrent: setCurrent, reset: reset,
    exportCode: exportCode, importCode: importCode, totalCoins: totalCoins,
    get data() { return state; },
    get available() { return available; },
    takeNotice: function () { var n = notice; notice = null; return n; },
    DEFAULT_KEYS: DEFAULT_KEYS, LEVELS: LEVELS, KEY: KEY, sanitize: sanitize
  };
})(window);
