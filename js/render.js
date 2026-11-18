/*
 * Seka & Braco — renderer.
 * All art is drawn procedurally with canvas paths (no image files), in a
 * flat vector-cartoon style: warm palette, thick dark outlines, one shade tone.
 * See ART_GUIDE.md for the palette and rules.
 */
(function (root) {
  'use strict';
  var E = root.SB_ENGINE, T = E.T, W = E.W, H = E.H;
  var OUT = '#2b1d16';            // universal outline colour
  var FONT = '"Fredoka", "Baloo 2", "Trebuchet MS", "Segoe UI", sans-serif';

  // Channel colours + shapes (shape is the colour-blind-safe marker).
  var CHANNELS = {
    a: { c: '#e5484d', d: '#a8262b', shape: 'circle' },
    b: { c: '#3b82e0', d: '#1f4f99', shape: 'triangle' },
    c: { c: '#36b37e', d: '#1d7a52', shape: 'square' },
    d: { c: '#a463f2', d: '#6b34ad', shape: 'diamond' },
    e: { c: '#f2a516', d: '#a86d00', shape: 'star' }
  };
  function chInfo(ch) { return CHANNELS[ch] || CHANNELS.a; }

  var PLAYER = {
    S: { c: '#e2557a', tag: 'circle' },
    B: { c: '#1f9e8f', tag: 'square' }
  };

  var THEMES = [
    { key: 'oldtown', tile: { base: '#b85a40', dark: '#8c3d2b', light: '#cf7558', cap: '#ead7b5', capD: '#c7aa80', style: 'brick' } },
    { key: 'tram', tile: { base: '#8f949c', dark: '#6a7078', light: '#aab0b7', cap: '#d4d1c8', capD: '#a7a49b', style: 'cobble' } },
    { key: 'drava', tile: { base: '#9a8064', dark: '#735c45', light: '#b39a7c', cap: '#c78a4f', capD: '#94612f', style: 'stone' } },
    { key: 'fields', tile: { base: '#8f5d37', dark: '#6b4224', light: '#a8734a', cap: '#8bbb46', capD: '#5f8c2c', style: 'earth' } },
    { key: 'festival', tile: { base: '#7c4c2f', dark: '#5a331d', light: '#97613f', cap: '#d29a5c', capD: '#a46d36', style: 'boards' } },
    { key: 'night', tile: { base: '#7d3f33', dark: '#5a2a21', light: '#9a5545', cap: '#a7acc4', capD: '#767c98', style: 'brick' } },
    { key: 'advent', tile: { base: '#8f949c', dark: '#6a7078', light: '#aab0b7', cap: '#f4f8fc', capD: '#c3d2e2', style: 'cobble' } },
    { key: 'wetland', tile: { base: '#6b5a3a', dark: '#4d3f27', light: '#86734d', cap: '#6fa34a', capD: '#4d7a30', style: 'earth' } },
    { key: 'vineyard', tile: { base: '#c9b48a', dark: '#9c875e', light: '#dccaa3', cap: '#7aa33c', capD: '#557a24', style: 'stone' } },
    { key: 'finale', tile: { base: '#4a3b5c', dark: '#30253f', light: '#5f4d75', cap: '#c9a85a', capD: '#9a7b37', style: 'stone' } }
  ];

  // ---------- small drawing helpers ----------
  function rr(c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
  function fs(c, fill, stroke, lw) {
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 3; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); }
  }
  function ell(c, x, y, rx, ry, rot) { c.beginPath(); c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot || 0, 0, Math.PI * 2); }
  function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2); }
  function rand(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }
  function mk(w, h) { var cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; }

  function shapePath(c, shape, x, y, r) {
    c.beginPath();
    if (shape === 'circle') c.arc(x, y, r, 0, Math.PI * 2);
    else if (shape === 'square') c.rect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7);
    else if (shape === 'triangle') { c.moveTo(x, y - r * 1.05); c.lineTo(x + r, y + r * 0.8); c.lineTo(x - r, y + r * 0.8); c.closePath(); }
    else if (shape === 'diamond') { c.moveTo(x, y - r * 1.1); c.lineTo(x + r, y); c.lineTo(x, y + r * 1.1); c.lineTo(x - r, y); c.closePath(); }
    else { // star
      for (var i = 0; i < 10; i++) {
        var a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.45 : r * 1.05;
        if (i) c.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); else c.moveTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2);
      }
      c.closePath();
    }
  }
  function chIcon(c, ch, x, y, r, crossed) {
    var info = chInfo(ch);
    shapePath(c, info.shape, x, y, r);
    fs(c, info.c, OUT, 2);
    if (crossed) { // inverted (bridge) marker: a white bar through the symbol
      c.beginPath(); c.moveTo(x - r * 0.75, y + r * 0.75); c.lineTo(x + r * 0.75, y - r * 0.75);
      c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.stroke();
    }
  }
  function chIcons(c, ch, x, y, r, crossed) {
    var l = E.chList(ch), w = (l.length - 1) * r * 2.4;
    for (var i = 0; i < l.length; i++) chIcon(c, l[i], x - w / 2 + i * r * 2.4, y, r, crossed);
  }

  // ---------- backgrounds (pre-rendered once per chapter) ----------
  var bgCache = {};
  function skyGrad(c, stops) {
    var g = c.createLinearGradient(0, 0, 0, H);
    for (var i = 0; i < stops.length; i++) g.addColorStop(i / (stops.length - 1), stops[i]);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  function cloud(c, x, y, s, col) {
    c.fillStyle = col;
    circ(c, x, y, 22 * s); c.fill(); circ(c, x + 26 * s, y - 10 * s, 28 * s); c.fill();
    circ(c, x + 56 * s, y, 22 * s); c.fill(); rr(c, x - 10 * s, y, 80 * s, 20 * s, 10 * s); c.fill();
  }
  function facade(c, x, base, w, h, col, trim, rnd, win) {
    rr(c, x, base - h, w, h, 3); fs(c, col, 'rgba(43,29,22,0.35)', 2);
    c.fillStyle = trim; c.fillRect(x - 3, base - h - 6, w + 6, 8);
    // ornamental gable
    c.beginPath(); c.moveTo(x + w * 0.25, base - h - 6);
    c.quadraticCurveTo(x + w * 0.5, base - h - 34 - rnd() * 12, x + w * 0.75, base - h - 6); c.closePath();
    fs(c, col, 'rgba(43,29,22,0.35)', 2);
    circ(c, x + w * 0.5, base - h - 16, 5); fs(c, trim);
    var rows = Math.floor((h - 30) / 40), cols = Math.max(2, Math.floor(w / 30));
    for (var r = 0; r < rows; r++) for (var k = 0; k < cols; k++) {
      var wx = x + (k + 0.5) * (w / cols) - 7, wy = base - h + 18 + r * 40;
      rr(c, wx - 3, wy - 3, 20, 28, 4); fs(c, trim);
      rr(c, wx, wy, 14, 22, 3); fs(c, win ? (rnd() < 0.65 ? win : '#3a3550') : '#5b6f85');
      c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(wx + 2, wy + 2, 4, 9);
    }
  }
  function brickTower(c, x, base, w, h, spire) {
    var brick = '#b4523a', dark = '#8a3a27';
    rr(c, x, base - h, w, h, 2); fs(c, brick, OUT, 3);
    c.strokeStyle = 'rgba(90,35,22,0.35)'; c.lineWidth = 1;
    for (var yy = base - h + 8; yy < base; yy += 9) { c.beginPath(); c.moveTo(x + 2, yy); c.lineTo(x + w - 2, yy); c.stroke(); }
    // lancet windows
    for (var i = 0; i < 3; i++) {
      var wy = base - h + 50 + i * 90, wx = x + w / 2 - 9;
      c.beginPath(); c.moveTo(wx, wy + 50); c.lineTo(wx, wy + 12); c.quadraticCurveTo(wx + 9, wy - 6, wx + 18, wy + 12); c.lineTo(wx + 18, wy + 50); c.closePath();
      fs(c, '#3d2f3a', OUT, 2);
    }
    // clock
    circ(c, x + w / 2, base - h + 24, 13); fs(c, '#f4e6c8', OUT, 2.5);
    c.beginPath(); c.moveTo(x + w / 2, base - h + 24); c.lineTo(x + w / 2, base - h + 15); c.moveTo(x + w / 2, base - h + 24); c.lineTo(x + w / 2 + 7, base - h + 26);
    c.strokeStyle = OUT; c.lineWidth = 2; c.stroke();
    // pinnacles + spire
    for (var p = 0; p < 2; p++) {
      var px = p ? x + w - 6 : x - 6;
      c.beginPath(); c.moveTo(px, base - h); c.lineTo(px + 6, base - h - 30); c.lineTo(px + 12, base - h); c.closePath(); fs(c, dark, OUT, 2);
    }
    c.beginPath(); c.moveTo(x - 4, base - h); c.lineTo(x + w / 2, base - h - spire); c.lineTo(x + w + 4, base - h); c.closePath();
    fs(c, '#5d4a4a', OUT, 3);
    c.beginPath(); c.moveTo(x + w / 2, base - h - spire); c.lineTo(x + w / 2, base - h - spire - 22);
    c.moveTo(x + w / 2 - 7, base - h - spire - 14); c.lineTo(x + w / 2 + 7, base - h - spire - 14);
    c.strokeStyle = OUT; c.lineWidth = 3; c.stroke();
  }
  function tramCar(c, x, y, s) {
    rr(c, x, y, 150 * s, 56 * s, 10 * s); fs(c, '#2f4f8f', OUT, 3);
    c.fillStyle = '#f1ede2'; c.fillRect(x + 4 * s, y + 34 * s, 142 * s, 8 * s);
    for (var i = 0; i < 4; i++) { rr(c, x + (10 + i * 34) * s, y + 8 * s, 26 * s, 20 * s, 3 * s); fs(c, '#a9cbe6', OUT, 2); }
    c.beginPath(); c.moveTo(x + 75 * s, y); c.lineTo(x + 60 * s, y - 22 * s); c.lineTo(x + 90 * s, y - 34 * s);
    c.strokeStyle = OUT; c.lineWidth = 2.5; c.stroke();
    circ(c, x + 28 * s, y + 58 * s, 7 * s); fs(c, '#333', OUT, 2); circ(c, x + 122 * s, y + 58 * s, 7 * s); fs(c, '#333', OUT, 2);
  }
  function sunflower(c, x, y, s) {
    c.strokeStyle = '#4f7d2b'; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 60 * s); c.stroke();
    ell(c, x + 8 * s, y + 30 * s, 8 * s, 4 * s, -0.5); fs(c, '#6a9c35');
    for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; ell(c, x + Math.cos(a) * 10 * s, y + Math.sin(a) * 10 * s, 7 * s, 3.5 * s, a); fs(c, '#f6c22b'); }
    circ(c, x, y, 7 * s); fs(c, '#6b3f1d');
  }
  function tent(c, x, base, w, h, a, b) {
    c.beginPath(); c.moveTo(x, base); c.lineTo(x + w / 2, base - h); c.lineTo(x + w, base); c.closePath(); fs(c, a, OUT, 3);
    c.save(); c.clip();
    for (var i = 0; i < 8; i += 2) { c.fillStyle = b; c.beginPath(); c.moveTo(x + w / 2, base - h); c.lineTo(x + i * w / 8, base); c.lineTo(x + (i + 1) * w / 8, base); c.closePath(); c.fill(); }
    c.restore();
    c.beginPath(); c.moveTo(x, base); c.lineTo(x + w / 2, base - h); c.lineTo(x + w, base); c.closePath(); fs(c, null, OUT, 3);
    c.beginPath(); c.moveTo(x + w / 2, base - h); c.lineTo(x + w / 2, base - h - 16); c.strokeStyle = OUT; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.moveTo(x + w / 2, base - h - 16); c.lineTo(x + w / 2 + 14, base - h - 11); c.lineTo(x + w / 2, base - h - 6); fs(c, '#f2c14e', OUT, 1.5);
  }
  function cauldron(c, x, base, s) {
    // fire
    for (var i = 0; i < 3; i++) { c.beginPath(); c.moveTo(x - 14 * s + i * 14 * s, base); c.quadraticCurveTo(x - 20 * s + i * 14 * s, base - 22 * s, x - 7 * s + i * 14 * s, base - 30 * s); c.quadraticCurveTo(x + 2 * s + i * 14 * s, base - 14 * s, x - 2 * s + i * 14 * s, base); fs(c, i === 1 ? '#ffb32c' : '#f26b1d'); }
    // tripod
    c.strokeStyle = OUT; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(x - 36 * s, base); c.lineTo(x, base - 80 * s); c.lineTo(x + 36 * s, base); c.stroke();
    c.beginPath(); c.moveTo(x, base - 80 * s); c.lineTo(x, base - 58 * s); c.stroke();
    ell(c, x, base - 36 * s, 30 * s, 22 * s); fs(c, '#2c2a2e', OUT, 3);
    ell(c, x, base - 52 * s, 27 * s, 7 * s); fs(c, '#c9381f', OUT, 2);
    ell(c, x - 6 * s, base - 53 * s, 8 * s, 2.5 * s); fs(c, '#f07a3a');
  }
  function bunting(c, x1, y1, x2, y2, sag, cols) {
    c.strokeStyle = 'rgba(43,29,22,0.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo((x1 + x2) / 2, Math.max(y1, y2) + sag, x2, y2); c.stroke();
    var n = Math.floor(Math.abs(x2 - x1) / 34);
    for (var i = 1; i < n; i++) {
      var t = i / n, px = x1 + (x2 - x1) * t, py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * (Math.max(y1, y2) + sag) + t * t * y2;
      c.beginPath(); c.moveTo(px - 9, py); c.lineTo(px + 9, py); c.lineTo(px, py + 18); c.closePath(); fs(c, cols[i % cols.length], 'rgba(43,29,22,0.6)', 1.5);
    }
  }

  function buildBackground(ch) {
    var cv = mk(W, H), c = cv.getContext('2d'), rnd = rand(97 + ch * 31), i;
    if (ch === 0) { // Old Town & Tvrđa
      skyGrad(c, ['#fbe9cf', '#f7d2a6', '#f0bf8f']);
      circ(c, 980, 170, 70); fs(c, 'rgba(255,240,200,0.8)');
      cloud(c, 140, 120, 1.2, 'rgba(255,255,255,0.7)'); cloud(c, 620, 80, 0.9, 'rgba(255,255,255,0.6)');
      var cols = ['#f3d27a', '#eab5a8', '#bcd8c1', '#f0e2c0', '#d9b8d6'];
      for (i = 0; i < 9; i++) facade(c, -20 + i * 150, 560, 130, 170 + rnd() * 90, cols[i % 5], '#fbf5e8', rnd);
      brickTower(c, 760, 560, 110, 330, 120);
      // Tvrđa wall in front
      c.fillStyle = '#c9a77a'; c.fillRect(0, 520, W, 50);
      for (i = 0; i < W; i += 64) { rr(c, i, 500, 36, 24, 3); fs(c, '#c9a77a', 'rgba(43,29,22,0.4)', 2); }
      c.fillStyle = 'rgba(43,29,22,0.25)'; c.fillRect(0, 520, W, 3);
    } else if (ch === 1) { // Tram lines
      skyGrad(c, ['#e3eff7', '#c7dcec', '#efe3d2']);
      cloud(c, 300, 110, 1.1, 'rgba(255,255,255,0.8)'); cloud(c, 900, 150, 1.3, 'rgba(255,255,255,0.7)');
      var cols2 = ['#e9c46a', '#e8a598', '#f4ead5', '#a8c5b5', '#f2c9a1'];
      for (i = 0; i < 9; i++) facade(c, -30 + i * 152, 560, 140, 200 + rnd() * 120, cols2[(i + 2) % 5], '#fffaf0', rnd);
      c.fillStyle = '#9aa2aa'; c.fillRect(0, 548, W, 30);
      tramCar(c, 520, 470, 1.1);
      // overhead wires + poles
      c.strokeStyle = 'rgba(43,29,22,0.65)'; c.lineWidth = 2;
      for (i = 0; i < 3; i++) { c.beginPath(); c.moveTo(0, 360 + i * 14); c.quadraticCurveTo(W / 2, 380 + i * 14, W, 360 + i * 14); c.stroke(); }
      for (i = 0; i < 4; i++) { var px = 120 + i * 350; rr(c, px, 330, 8, 230, 3); fs(c, '#5a6068', OUT, 2); }
    } else if (ch === 2) { // Drava sunset
      skyGrad(c, ['#ffd99b', '#f8a46c', '#d9708a', '#7d5a9a']);
      circ(c, 640, 400, 90); fs(c, '#ffe07a');
      cloud(c, 200, 150, 1.4, 'rgba(255,214,170,0.55)'); cloud(c, 960, 110, 1.1, 'rgba(255,200,170,0.5)');
      // far shore trees
      c.fillStyle = '#5b3c5e';
      for (i = 0; i < 40; i++) { circ(c, i * 34, 420 + rnd() * 10, 26 + rnd() * 16); c.fill(); }
      c.fillRect(0, 420, W, 40);
      // pedestrian suspension bridge silhouette
      c.strokeStyle = '#3e2a44'; c.lineWidth = 5;
      c.beginPath(); c.moveTo(150, 452); c.lineTo(1130, 452); c.stroke();
      rr(c, 380, 300, 12, 152, 3); fs(c, '#3e2a44'); rr(c, 890, 300, 12, 152, 3); fs(c, '#3e2a44');
      c.lineWidth = 3; c.beginPath(); c.moveTo(150, 452); c.quadraticCurveTo(270, 330, 386, 302); c.quadraticCurveTo(640, 430, 896, 302); c.quadraticCurveTo(1010, 330, 1130, 452); c.stroke();
      c.lineWidth = 1.5;
      for (i = 0; i < 26; i++) { var bx = 400 + i * 19; var by = 302 + Math.sin((i + 1) / 27 * Math.PI) * 140; c.beginPath(); c.moveTo(bx, by > 452 ? 452 : by); c.lineTo(bx, 452); c.stroke(); }
      // water with reflections
      var g = c.createLinearGradient(0, 460, 0, H); g.addColorStop(0, '#c9768a'); g.addColorStop(1, '#4b4f86');
      c.fillStyle = g; c.fillRect(0, 460, W, H - 460);
      for (i = 0; i < 18; i++) { c.fillStyle = 'rgba(255,224,122,' + (0.5 - i * 0.025) + ')'; c.fillRect(640 - 70 + rnd() * 20 - i * 2, 470 + i * 14, 140 - rnd() * 40 + i * 4, 4); }
      for (i = 0; i < 30; i++) { c.fillStyle = 'rgba(255,255,255,0.18)'; c.fillRect(rnd() * W, 470 + rnd() * 240, 30 + rnd() * 50, 2); }
    } else if (ch === 3) { // Golden fields
      skyGrad(c, ['#a9d8f2', '#d7eef7', '#fbf1cc']);
      circ(c, 1080, 130, 60); fs(c, '#fff3b0');
      cloud(c, 160, 110, 1.3, '#ffffff'); cloud(c, 560, 70, 1, '#ffffff'); cloud(c, 860, 160, 0.9, 'rgba(255,255,255,0.9)');
      // distant village tower + barn
      rr(c, 300, 330, 26, 90, 2); fs(c, '#e9e1d0', OUT, 2);
      c.beginPath(); c.moveTo(296, 330); c.lineTo(313, 285); c.lineTo(330, 330); c.closePath(); fs(c, '#b45437', OUT, 2);
      c.beginPath(); c.moveTo(900, 420); c.lineTo(900, 360); c.lineTo(945, 330); c.lineTo(990, 360); c.lineTo(990, 420); c.closePath(); fs(c, '#b8432f', OUT, 3);
      rr(c, 932, 380, 26, 40, 2); fs(c, '#7a2a1d', OUT, 2);
      // rolling golden hills with wheat stripes
      var hills = [['#e8c25a', 410], ['#dcae3f', 470], ['#cf9b2e', 540]];
      for (var hI = 0; hI < 3; hI++) {
        c.beginPath(); c.moveTo(0, H);
        for (var x = 0; x <= W; x += 40) c.lineTo(x, hills[hI][1] + Math.sin(x / 180 + hI * 2) * 18);
        c.lineTo(W, H); c.closePath(); fs(c, hills[hI][0]);
        c.strokeStyle = 'rgba(140,90,20,0.25)'; c.lineWidth = 1.5;
        for (i = 0; i < 60; i++) { var sx = rnd() * W, sy = hills[hI][1] + 20 + rnd() * 120; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 3, sy - 10); c.stroke(); }
      }
      for (i = 0; i < 4; i++) { ell(c, 120 + i * 300, 500, 32, 24); fs(c, '#e9c766', OUT, 2.5); ell(c, 120 + i * 300, 500, 12, 9); fs(c, '#d4a93f', OUT, 1.5); }
      for (i = 0; i < 14; i++) sunflower(c, 40 + i * 95 + rnd() * 30, 470 + rnd() * 30, 0.9);
    } else if (ch === 5) { // Tvrđa by night
      skyGrad(c, ['#141a3a', '#2b2f5e', '#4b3f6e']);
      for (i = 0; i < 90; i++) { circ(c, rnd() * W, rnd() * 380, rnd() * 1.5 + 0.4); fs(c, 'rgba(255,255,235,' + (0.4 + rnd() * 0.5) + ')'); }
      circ(c, 1040, 130, 46); fs(c, '#f6efd2'); circ(c, 1058, 118, 40); fs(c, '#222755');
      var ncols = ['#8c7a6a', '#7f6f86', '#6f7f7a', '#8a7a5e', '#7a6a80'];
      for (i = 0; i < 9; i++) facade(c, -20 + i * 150, 560, 130, 170 + rnd() * 90, ncols[i % 5], '#b9b0a3', rnd, '#f6d27a');
      brickTower(c, 300, 560, 110, 330, 120);
      c.fillStyle = '#6f5a48'; c.fillRect(0, 520, W, 50);
      for (i = 0; i < W; i += 64) { rr(c, i, 500, 36, 24, 3); fs(c, '#6f5a48', 'rgba(0,0,0,0.4)', 2); }
      for (i = 0; i < 5; i++) { var lx = 120 + i * 270; rr(c, lx - 3, 430, 6, 90, 2); fs(c, '#2b2a33'); circ(c, lx, 426, 26); fs(c, 'rgba(255,210,120,0.25)'); rr(c, lx - 8, 412, 16, 18, 4); fs(c, '#ffd77a', OUT, 2); }
    } else if (ch === 6) { // Advent in Osijek
      skyGrad(c, ['#9fb3cf', '#c9d6e6', '#eef2f7']);
      var acols = ['#e9c46a', '#e8a598', '#f4ead5', '#a8c5b5', '#f2c9a1'];
      for (i = 0; i < 9; i++) {
        var fh = 200 + rnd() * 110, fx = -30 + i * 152;
        facade(c, fx, 560, 140, fh, acols[(i + 1) % 5], '#fffaf0', rnd, '#ffe7a3');
        rr(c, fx - 4, 560 - fh - 12, 148, 10, 5); fs(c, '#ffffff', 'rgba(43,29,22,0.25)', 1.5);
      }
      // advent tree with lights
      c.beginPath(); c.moveTo(640, 250); c.lineTo(720, 540); c.lineTo(560, 540); c.closePath(); fs(c, '#2f6b4f', OUT, 3);
      for (i = 0; i < 26; i++) { var ty = 290 + rnd() * 240, tw = (ty - 250) / 290 * 75; circ(c, 640 + (rnd() * 2 - 1) * tw, ty, 4); fs(c, ['#e5484d', '#f2c14e', '#fbf3e4', '#3b82e0'][i % 4]); }
      c.beginPath(); for (i = 0; i < 10; i++) { var sa = -Math.PI / 2 + i * Math.PI / 5, sr = i % 2 ? 8 : 18; c.lineTo(640 + Math.cos(sa) * sr, 246 + Math.sin(sa) * sr); } c.closePath(); fs(c, '#f2c14e', OUT, 2);
      c.fillStyle = '#e9eef4'; c.fillRect(0, 540, W, 40);
      tramCar(c, 900, 478, 1.0);
      for (i = 0; i < 140; i++) { circ(c, rnd() * W, rnd() * H, rnd() * 2.2 + 0.8); fs(c, 'rgba(255,255,255,0.85)'); }
    } else if (ch === 7) { // Kopački rit wetlands
      skyGrad(c, ['#cfe6e0', '#e8efd6', '#f4ecd0']);
      cloud(c, 220, 120, 1.2, 'rgba(255,255,255,0.8)'); cloud(c, 820, 90, 1, 'rgba(255,255,255,0.7)');
      c.fillStyle = '#7f9a6a';
      for (i = 0; i < 30; i++) { ell(c, i * 46, 430 + rnd() * 10, 40 + rnd() * 20, 50 + rnd() * 30); c.fill(); }
      c.fillRect(0, 430, W, 40);
      var wg = c.createLinearGradient(0, 460, 0, H); wg.addColorStop(0, '#8fb9b4'); wg.addColorStop(1, '#4f7f86');
      c.fillStyle = wg; c.fillRect(0, 460, W, H - 460);
      for (i = 0; i < 40; i++) { c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(rnd() * W, 470 + rnd() * 240, 30 + rnd() * 60, 2); }
      // reeds
      for (i = 0; i < 70; i++) {
        var rx = rnd() * W, rh = 50 + rnd() * 70, rb = 480 + rnd() * 60;
        c.strokeStyle = '#6b8a3a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(rx, rb); c.quadraticCurveTo(rx + 6, rb - rh / 2, rx + 3, rb - rh); c.stroke();
        if (i % 3 === 0) { ell(c, rx + 3, rb - rh, 3.5, 11); fs(c, '#7a4f2a', OUT, 1.5); }
      }
      // heron
      c.save(); c.translate(980, 470);
      c.strokeStyle = OUT; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-4, 0); c.lineTo(-2, 40); c.moveTo(4, 0); c.lineTo(6, 40); c.stroke();
      ell(c, 0, -6, 22, 12, -0.2); fs(c, '#d8dde3', OUT, 2.5);
      c.beginPath(); c.moveTo(-16, -10); c.quadraticCurveTo(-26, -30, -16, -44); c.lineWidth = 5; c.strokeStyle = '#d8dde3'; c.stroke();
      circ(c, -16, -46, 6); fs(c, '#d8dde3', OUT, 2); c.beginPath(); c.moveTo(-21, -46); c.lineTo(-38, -42); c.lineTo(-21, -43); fs(c, '#e8b84a', OUT, 1.5);
      c.restore();
      // boardwalk
      c.fillStyle = '#9b7a52'; c.fillRect(0, 548, W, 12);
      for (i = 0; i < W; i += 60) { rr(c, i, 548, 8, 60, 2); fs(c, '#7a5c3a', OUT, 1.5); }
    } else if (ch === 8) { // Baranja vineyards
      skyGrad(c, ['#f7d9a6', '#f8e8c4', '#f3efd8']);
      circ(c, 260, 150, 60); fs(c, 'rgba(255,236,170,0.9)');
      cloud(c, 700, 100, 1.1, 'rgba(255,255,255,0.7)');
      var vh = [['#a8b86a', 380], ['#8fa452', 440], ['#7a9145', 520]];
      for (var vi = 0; vi < 3; vi++) {
        c.beginPath(); c.moveTo(0, H);
        for (var vx = 0; vx <= W; vx += 40) c.lineTo(vx, vh[vi][1] + Math.sin(vx / 220 + vi * 1.7) * 26);
        c.lineTo(W, H); c.closePath(); fs(c, vh[vi][0]);
        for (var row = 0; row < 5; row++) for (var col = 0; col < 34; col++) {
          var gx = col * 40 + (row % 2) * 20, gy = vh[vi][1] + 22 + row * 18 + Math.sin(gx / 220 + vi * 1.7) * 26;
          circ(c, gx, gy, 5 - vi); fs(c, vi === 2 ? '#55702c' : '#66833a');
        }
      }
      // wine cellar (white house with arched door)
      c.beginPath(); c.moveTo(860, 430); c.lineTo(860, 360); c.lineTo(930, 318); c.lineTo(1000, 360); c.lineTo(1000, 430); c.closePath(); fs(c, '#f3eee2', OUT, 3);
      c.beginPath(); c.moveTo(850, 362); c.lineTo(930, 310); c.lineTo(1010, 362); c.strokeStyle = '#b4523a'; c.lineWidth = 8; c.stroke();
      c.beginPath(); c.moveTo(912, 430); c.lineTo(912, 395); c.quadraticCurveTo(930, 375, 948, 395); c.lineTo(948, 430); c.closePath(); fs(c, '#7a4a2a', OUT, 2);
      for (i = 0; i < 3; i++) { ell(c, 1080 + i * 50, 520, 22, 26); fs(c, '#8a5a33', OUT, 2.5); c.fillStyle = '#4b4f57'; c.fillRect(1060 + i * 50, 508, 40, 4); c.fillRect(1060 + i * 50, 530, 40, 4); }
    } else if (ch === 9) { // Pannonian finale: fireworks over the Drava
      skyGrad(c, ['#0f1230', '#26245a', '#4a2d62', '#7b3d5e']);
      for (i = 0; i < 60; i++) { circ(c, rnd() * W, rnd() * 300, rnd() * 1.4 + 0.3); fs(c, 'rgba(255,255,235,0.7)'); }
      var fcols = ['#e5484d', '#f2c14e', '#36b37e', '#3b82e0', '#a463f2'];
      for (var fwk = 0; fwk < 6; fwk++) {
        var fxx = 120 + fwk * 210 + rnd() * 60, fyy = 100 + rnd() * 140, fc = fcols[fwk % 5];
        for (i = 0; i < 18; i++) { var fa = i * Math.PI / 9, fr = 36 + rnd() * 22; c.strokeStyle = fc; c.lineWidth = 2.5; c.beginPath(); c.moveTo(fxx + Math.cos(fa) * 10, fyy + Math.sin(fa) * 10); c.lineTo(fxx + Math.cos(fa) * fr, fyy + Math.sin(fa) * fr); c.stroke(); circ(c, fxx + Math.cos(fa) * (fr + 4), fyy + Math.sin(fa) * (fr + 4), 2.2); fs(c, '#fffaf0'); }
      }
      // skyline silhouette with the church spire
      c.fillStyle = '#1d1838';
      for (i = 0; i < 22; i++) { var bw = 50 + rnd() * 40, bh = 60 + rnd() * 90; c.fillRect(i * 60, 440 - bh, bw, bh + 10); }
      c.beginPath(); c.moveTo(600, 440); c.lineTo(600, 230); c.lineTo(628, 160); c.lineTo(656, 230); c.lineTo(656, 440); c.closePath(); c.fill();
      c.strokeStyle = '#1d1838'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 452); c.lineTo(W, 452); c.stroke();
      c.lineWidth = 3; c.beginPath(); c.moveTo(150, 452); c.quadraticCurveTo(270, 340, 386, 312); c.quadraticCurveTo(640, 430, 896, 312); c.quadraticCurveTo(1010, 340, 1130, 452); c.stroke();
      var fg = c.createLinearGradient(0, 456, 0, H); fg.addColorStop(0, '#3a2a55'); fg.addColorStop(1, '#151433');
      c.fillStyle = fg; c.fillRect(0, 456, W, H - 456);
      for (i = 0; i < 40; i++) { c.fillStyle = 'rgba(' + ['229,72,77', '242,193,78', '59,130,224'][i % 3] + ',0.35)'; c.fillRect(rnd() * W, 470 + rnd() * 240, 20 + rnd() * 50, 2); }
    } else { // Festival
      skyGrad(c, ['#2e2554', '#5d3b72', '#b45f6d', '#f0a165']);
      for (i = 0; i < 40; i++) { circ(c, rnd() * W, rnd() * 260, rnd() * 1.6 + 0.4); fs(c, 'rgba(255,255,230,0.8)'); }
      circ(c, 180, 120, 34); fs(c, '#fff1c7');
      tent(c, 60, 520, 220, 150, '#e45a4f', '#fbf3e4');
      tent(c, 440, 520, 260, 180, '#3c7fd0', '#fbf3e4');
      tent(c, 900, 520, 230, 160, '#e9b23f', '#fbf3e4');
      cauldron(c, 350, 560, 1.1); cauldron(c, 790, 560, 1.2); cauldron(c, 1180, 560, 1);
      bunting(c, 0, 210, 640, 230, 70, ['#e5484d', '#f2c14e', '#36b37e', '#3b82e0', '#fbf3e4']);
      bunting(c, 640, 230, W, 200, 70, ['#3b82e0', '#fbf3e4', '#e5484d', '#f2c14e', '#36b37e']);
      c.fillStyle = 'rgba(43,29,22,0.35)'; c.fillRect(0, 556, W, 6);
    }
    // soft haze pushes the scenery back behind the play area
    c.fillStyle = (ch === 4 || ch === 5 || ch === 9) ? 'rgba(30,20,60,0.28)' : 'rgba(255,248,235,0.18)'; c.fillRect(0, 0, W, H);
    // gentle vignette so the play area pops
    var vg = c.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H * 0.95);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(30,15,10,0.22)');
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
    return cv;
  }
  function background(ch) { if (!bgCache[ch]) bgCache[ch] = buildBackground(ch); return bgCache[ch]; }

  // ---------- static tile layer ----------
  function solidAt(g, x, y) {
    if (x < 0 || x >= E.COLS || y < 0) return true;
    if (y >= E.ROWS) return false;
    var c = g[y][x]; return c === '#' || c === 'X';
  }
  function drawSolid(c, g, x, y, th) {
    var px = x * T, py = y * T, t = th.tile, rnd = rand(x * 7919 + y * 104729 + 13);
    c.fillStyle = t.base; c.fillRect(px, py, T, T);
    c.strokeStyle = t.dark; c.lineWidth = 1.5;
    if (t.style === 'brick') {
      for (var r = 0; r < 4; r++) {
        c.beginPath(); c.moveTo(px, py + r * 10); c.lineTo(px + T, py + r * 10); c.stroke();
        var off = (r + y) % 2 ? 0 : 20;
        c.beginPath(); c.moveTo(px + off + 10, py + r * 10); c.lineTo(px + off + 10, py + r * 10 + 10); c.stroke();
      }
      c.fillStyle = t.light; c.fillRect(px + 3 + rnd() * 20, py + 2 + Math.floor(rnd() * 3) * 10, 12, 3);
    } else if (t.style === 'cobble') {
      for (var k = 0; k < 4; k++) { rr(c, px + (k % 2) * 20 + 2 + rnd() * 2, py + Math.floor(k / 2) * 20 + 2 + rnd() * 2, 16, 16, 5); fs(c, k % 3 ? t.light : t.base, t.dark, 1.5); }
    } else if (t.style === 'stone') {
      rr(c, px + 2, py + 2, 36, 17, 4); fs(c, t.light, t.dark, 1.5);
      rr(c, px + 2 + (y % 2) * 8, py + 21, 28, 17, 4); fs(c, t.base, t.dark, 1.5);
    } else if (t.style === 'earth') {
      for (var d = 0; d < 4; d++) { circ(c, px + 5 + rnd() * 30, py + 5 + rnd() * 30, 2 + rnd() * 3); fs(c, d % 2 ? t.dark : t.light); }
    } else { // boards
      for (var b = 0; b < 2; b++) { rr(c, px + 1, py + b * 20 + 1, 38, 18, 3); fs(c, b ? t.base : t.light, t.dark, 1.5); circ(c, px + 6, py + b * 20 + 10, 1.5); fs(c, t.dark); circ(c, px + 34, py + b * 20 + 10, 1.5); fs(c, t.dark); }
    }
    var top = !solidAt(g, x, y - 1), bot = !solidAt(g, x, y + 1), lft = !solidAt(g, x - 1, y), rgt = !solidAt(g, x + 1, y);
    if (top) {
      c.fillStyle = t.cap; c.fillRect(px, py, T, 10);
      c.fillStyle = t.capD; c.fillRect(px, py + 8, T, 3);
      if (t.style === 'earth') { // grass tufts
        c.fillStyle = t.cap;
        for (var q = 0; q < 4; q++) { c.beginPath(); c.moveTo(px + q * 10, py + 2); c.lineTo(px + q * 10 + 4, py - 5 - rnd() * 3); c.lineTo(px + q * 10 + 8, py + 2); c.fill(); }
      }
    }
    c.strokeStyle = OUT; c.lineWidth = 3; c.beginPath();
    if (top) { c.moveTo(px, py + 1.5); c.lineTo(px + T, py + 1.5); }
    if (bot) { c.moveTo(px, py + T - 1.5); c.lineTo(px + T, py + T - 1.5); }
    if (lft) { c.moveTo(px + 1.5, py); c.lineTo(px + 1.5, py + T); }
    if (rgt) { c.moveTo(px + T - 1.5, py); c.lineTo(px + T - 1.5, py + T); }
    c.stroke();
  }
  function drawCracked(c, x, y, th) {
    var px = x * T, py = y * T, t = th.tile;
    if (th.key === 'fields') { // barn planks
      for (var i = 0; i < 3; i++) { rr(c, px + 1 + i * 13, py, 12, T, 2); fs(c, i % 2 ? '#b8452f' : '#c9553c', OUT, 1.5); }
    } else {
      rr(c, px + 1, py + 1, T - 2, T - 2, 3); fs(c, t.light, OUT, 2);
    }
    c.strokeStyle = OUT; c.lineWidth = 2.2; c.beginPath();
    c.moveTo(px + 8, py + 4); c.lineTo(px + 16, py + 15); c.lineTo(px + 11, py + 22); c.lineTo(px + 22, py + 34);
    c.moveTo(px + 16, py + 15); c.lineTo(px + 30, py + 12); c.lineTo(px + 34, py + 22);
    c.moveTo(px + 22, py + 34); c.lineTo(px + 31, py + 31);
    c.stroke();
  }
  function drawLedge(c, x, y) {
    var px = x * T, py = y * T;
    rr(c, px, py + 1, T, 11, 3); fs(c, '#b07a45', OUT, 2.5);
    c.fillStyle = '#d19a5e'; c.fillRect(px + 3, py + 3, T - 6, 3);
    circ(c, px + 6, py + 7, 1.6); fs(c, OUT); circ(c, px + 34, py + 7, 1.6); fs(c, OUT);
  }
  function drawRibbon(c, x, y, festival) {
    var px = x * T, py = y * T;
    rr(c, px, py + 1, T, 9, 2); fs(c, '#d83a3a', OUT, 2);
    c.fillStyle = '#fbf3e4';
    for (var i = 0; i < 4; i++) { c.beginPath(); c.moveTo(px + i * 10 + 1, py + 5.5); c.lineTo(px + i * 10 + 5, py + 2.5); c.lineTo(px + i * 10 + 9, py + 5.5); c.lineTo(px + i * 10 + 5, py + 8.5); c.closePath(); c.fill(); }
    c.strokeStyle = '#d83a3a'; c.lineWidth = 1.5;
    for (var f = 0; f < 5; f++) { c.beginPath(); c.moveTo(px + 4 + f * 8, py + 10); c.lineTo(px + 4 + f * 8, py + 15); c.stroke(); }
    if (festival) { /* bulbs are drawn live in drawWorld */ }
  }
  function drawSpring(c, x, y) {
    var px = x * T, py = y * T;
    rr(c, px + 1, py + 3, T - 2, T - 4, 8); fs(c, '#efcf6a', OUT, 3);
    c.strokeStyle = '#c99b2f'; c.lineWidth = 1.5;
    for (var i = 0; i < 6; i++) { c.beginPath(); c.moveTo(px + 5 + i * 6, py + 8); c.lineTo(px + 3 + i * 6, py + T - 6); c.stroke(); }
    c.fillStyle = '#9b5b2a'; c.fillRect(px + 9, py + 4, 4, T - 6); c.fillRect(px + 27, py + 4, 4, T - 6);
    c.fillStyle = 'rgba(255,255,255,0.45)'; c.fillRect(px + 6, py + 6, T - 14, 3);
  }
  function drawSpikes(c, x, y) {
    var px = x * T, py = y * T;
    rr(c, px + 1, py + T - 8, T - 2, 8, 2); fs(c, '#4b4f57', OUT, 2);
    for (var i = 0; i < 3; i++) {
      c.beginPath(); c.moveTo(px + 3 + i * 12, py + T - 7); c.lineTo(px + 9 + i * 12, py + 16); c.lineTo(px + 15 + i * 12, py + T - 7); c.closePath();
      fs(c, '#b9c0c9', OUT, 2.2);
      c.beginPath(); c.moveTo(px + 9 + i * 12, py + 17); c.lineTo(px + 11 + i * 12, py + T - 9); c.strokeStyle = '#fff'; c.lineWidth = 1.2; c.stroke();
    }
  }

  function buildTiles(world, ch) {
    var cv = mk(W, H), c = cv.getContext('2d'), g = world.grid, th = THEMES[ch], x, y;
    var live = [];
    for (y = 0; y < E.ROWS; y++) for (x = 0; x < E.COLS; x++) {
      var t = g[y][x];
      if (t === '#') drawSolid(c, g, x, y, th);
      else if (t === 'X') drawCracked(c, x, y, th);
      else if (t === '-') drawLedge(c, x, y);
      else if (t === '=') drawRibbon(c, x, y, ch === 4 || ch === 6 || ch === 9);
      else if (t === 'b') drawSpring(c, x, y);
      else if (t === '^') drawSpikes(c, x, y);
      else if (t === '~' || t === 'w') live.push({ x: x, y: y, t: t, top: g[y - 1] && g[y - 1][x] !== t });
    }
    return { canvas: cv, live: live };
  }

  // ---------- characters ----------
  var OF = root.SB_OUTFITS;
  // fill the current path with a small repeating pattern (clipped to that path)
  function pattern(c, p, x, y, w, h) {
    if (!p) return;
    c.save(); c.clip();
    var i, j;
    if (p.kind === 'dots') { for (i = x; i < x + w; i += 6) for (j = y; j < y + h; j += 6) { circ(c, i + ((j / 6) % 2) * 3, j, 1.2); fs(c, p.c); } }
    else if (p.kind === 'flowers') {
      for (i = x + 3; i < x + w; i += 9) for (j = y + 3; j < y + h; j += 9) {
        var ox = i + ((Math.round((j - y) / 9)) % 2) * 4.5;
        for (var k = 0; k < 5; k++) { var a = k * 1.2566; circ(c, ox + Math.cos(a) * 1.8, j + Math.sin(a) * 1.8, 1.2); fs(c, p.c); }
        circ(c, ox, j, 0.9); fs(c, '#6b3f1d');
      }
    } else if (p.kind === 'stripes') { c.fillStyle = p.c; for (i = x + 2; i < x + w; i += 7) c.fillRect(i, y, 2.5, h); }
    else if (p.kind === 'plaid') {
      c.globalAlpha = 0.55; c.fillStyle = p.c;
      for (i = x + 2; i < x + w; i += 8) c.fillRect(i, y, 2.5, h);
      for (j = y + 2; j < y + h; j += 8) c.fillRect(x, j, w, 2.5);
      c.globalAlpha = 1;
    } else if (p.kind === 'embroid') {
      c.strokeStyle = p.c; c.lineWidth = 1.4;
      for (j = y + 4; j < y + h; j += 7) { c.beginPath(); for (i = x; i <= x + w; i += 4) c.lineTo(i, j + ((i - x) / 4 % 2 ? -1.6 : 1.6)); c.stroke(); }
      for (i = x + 4; i < x + w; i += 8) for (j = y + 7.5; j < y + h; j += 14) { circ(c, i, j, 1.1); fs(c, '#fffaf0'); }
    }
    c.restore();
  }
  function hat(c, kind, hy, top, big) {
    var s = big ? 1.12 : 1;
    if (!kind) return;
    if (kind === 'beanie') {
      c.beginPath(); c.moveTo(-13 * s, hy - 5); c.quadraticCurveTo(-13 * s, top - 6, 0, top - 6); c.quadraticCurveTo(13 * s, top - 6, 13 * s, hy - 5); c.closePath();
      fs(c, '#c8282e', OUT, 2.5);
      rr(c, -14 * s, hy - 9, 28 * s, 6, 3); fs(c, '#a81f24', OUT, 2);
      circ(c, 0, top - 8, 4.5); fs(c, '#fbf7ee', OUT, 2);
    } else if (kind === 'chef') {
      rr(c, -10 * s, top - 2, 20 * s, 8, 2); fs(c, '#fbf7ee', OUT, 2);
      c.beginPath(); c.moveTo(-10 * s, top - 1);
      c.quadraticCurveTo(-19 * s, top - 14, -8 * s, top - 18); c.quadraticCurveTo(0, top - 28, 8 * s, top - 18);
      c.quadraticCurveTo(19 * s, top - 14, 10 * s, top - 1); c.closePath(); fs(c, '#fbf7ee', OUT, 2.5);
      c.beginPath(); c.moveTo(-4, top - 4); c.lineTo(-4, top - 12); c.moveTo(4, top - 4); c.lineTo(4, top - 12); c.strokeStyle = 'rgba(43,29,22,0.25)'; c.lineWidth = 1.2; c.stroke();
    } else if (kind === 'sunhat') {
      ell(c, 0, top + 3, 22, 4.5); fs(c, '#e8c47a', OUT, 2.5);
      c.beginPath(); c.moveTo(-10, top + 2); c.quadraticCurveTo(-10, top - 10, 0, top - 10); c.quadraticCurveTo(10, top - 10, 10, top + 2); c.closePath(); fs(c, '#e8c47a', OUT, 2.5);
      c.fillStyle = '#de2f24'; c.fillRect(-10, top - 2, 20, 3.5);
      circ(c, 8, top - 1, 3); fs(c, '#f6c22b', OUT, 1.2);
    } else if (kind === 'flowers') {
      var cols = ['#de2f24', '#f2c14e', '#3b82e0', '#de2f24', '#f6c22b', '#36b37e', '#de2f24'];
      for (var i = 0; i < 7; i++) {
        var a = Math.PI * (1.05 + i * 0.15), fx = Math.cos(a) * 13, fy = hy - 2 + Math.sin(a) * 14;
        circ(c, fx, fy, 3.4); fs(c, cols[i], OUT, 1.3); circ(c, fx, fy, 1.1); fs(c, '#fffaf0');
      }
      c.beginPath(); c.moveTo(-11, hy - 6); c.quadraticCurveTo(-17, hy + 6, -15, hy + 16); c.strokeStyle = '#de2f24'; c.lineWidth = 2; c.stroke();
    } else if (kind === 'tiara') {
      c.beginPath(); c.moveTo(-8, top + 3); c.lineTo(-7, top - 3); c.lineTo(-3.5, top + 0.5); c.lineTo(0, top - 6); c.lineTo(3.5, top + 0.5); c.lineTo(7, top - 3); c.lineTo(8, top + 3); c.closePath();
      fs(c, '#f2c94c', OUT, 1.6); circ(c, 0, top - 1, 1.5); fs(c, '#e2557a');
    } else if (kind === 'folkhat') {
      ell(c, 0, top + 4, 19, 4); fs(c, '#1f1d24', OUT, 2.5);
      rr(c, -11, top - 9, 22, 13, 4); fs(c, '#1f1d24', OUT, 2.5);
      c.fillStyle = '#c8282e'; c.fillRect(-11, top - 1, 22, 3.5);
      circ(c, 9, top - 4, 2.5); fs(c, '#f2c14e', OUT, 1);
    } else if (kind === 'souwester') {
      c.beginPath(); c.moveTo(-21, top + 8); c.quadraticCurveTo(0, top - 2, 21, top + 8); c.quadraticCurveTo(0, top + 3, -21, top + 8); fs(c, '#f2c14e', OUT, 2.5);
      c.beginPath(); c.moveTo(-12, top + 4); c.quadraticCurveTo(-12, top - 10, 0, top - 10); c.quadraticCurveTo(12, top - 10, 12, top + 4); c.closePath(); fs(c, '#f2c14e', OUT, 2.5);
    }
  }
  function neckwear(c, kind, y, big) {
    if (!kind) return;
    if (kind === 'bow') {
      c.beginPath(); c.moveTo(0, y); c.lineTo(-6, y - 3.5); c.lineTo(-6, y + 3.5); c.closePath(); fs(c, '#141318', OUT, 1.3);
      c.beginPath(); c.moveTo(0, y); c.lineTo(6, y - 3.5); c.lineTo(6, y + 3.5); c.closePath(); fs(c, '#141318', OUT, 1.3);
      circ(c, 0, y, 1.6); fs(c, '#141318');
    } else if (kind === 'tie') {
      c.beginPath(); c.moveTo(-2.5, y - 1); c.lineTo(2.5, y - 1); c.lineTo(3.5, y + 15); c.lineTo(0, y + 19); c.lineTo(-3.5, y + 15); c.closePath(); fs(c, '#c8282e', OUT, 1.5);
    } else if (kind === 'scarf') {
      rr(c, -10, y - 3, 20, 7, 3.5); fs(c, '#c8282e', OUT, 2);
      rr(c, 3, y + 1, 6, 13, 2); fs(c, '#c8282e', OUT, 2);
      c.fillStyle = '#fbf7ee'; c.fillRect(3.5, y + 8, 5, 2);
    } else if (kind === 'pearls') {
      for (var i = -4; i <= 4; i++) { circ(c, i * 1.4, y + 2 - Math.abs(i) * 0.1 + (4 - Math.abs(i)) * 0.5, 1.2); fs(c, '#fffaf0', 'rgba(43,29,22,0.5)', 0.6); }
    } else if (kind === 'cords') {
      c.strokeStyle = '#fbf7ee'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-3, y); c.lineTo(-3.5, y + 10); c.moveTo(3, y); c.lineTo(3.5, y + 10); c.stroke();
    }
  }

  function drawSeka(c, o) {
    var t = o.t, f = o.face, air = o.air, walk = o.walk, sw = Math.sin(walk) * (o.moving ? 1 : 0);
    var fit = o.fit || OF.S[0];
    var skin = '#f2c8a8', hair = '#6b3f25', hairD = '#4b2a17';
    c.save();
    c.scale(o.facing, 1);
    // legs
    var lg = air ? 0.35 : sw * 0.55;
    [[-1, lg], [1, -lg]].forEach(function (L) {
      c.save(); c.translate(L[0] * 4.5, -20); c.rotate(L[1]);
      rr(c, -3.5, 0, 7, 19, 3); fs(c, fit.legs, OUT, 2.5);
      if (fit.stripe) { c.fillStyle = fit.stripe; c.fillRect(1.2, 1, 1.8, 16); }
      ell(c, 2.5, 19.5, 5.5, 3); fs(c, fit.shoes, OUT, 2);
      c.restore();
    });
    // back arm
    c.save(); c.translate(-6, -37); c.rotate(o.push ? -1.2 : (air ? -2.4 : -sw * 0.6));
    rr(c, -3, 0, 6, 17, 3); fs(c, fit.sleeve, OUT, 2.5); circ(c, 0, 18, 3.2); fs(c, skin, OUT, 2); c.restore();
    // skirt / coat tails
    if (fit.skirt) {
      var sk = fit.skirt, flare = air ? 2 : Math.abs(sw) * 2;
      c.beginPath(); c.moveTo(-9, -24); c.lineTo(9, -24); c.lineTo(sk.w + flare, sk.len); c.quadraticCurveTo(0, sk.len + 3, -sk.w - flare, sk.len); c.closePath();
      fs(c, sk.c, OUT, 3);
      if (fit.pattern) { c.beginPath(); c.moveTo(-9, -24); c.lineTo(9, -24); c.lineTo(sk.w + flare, sk.len); c.quadraticCurveTo(0, sk.len + 3, -sk.w - flare, sk.len); c.closePath(); pattern(c, fit.pattern, -sk.w - 3, -24, sk.w * 2 + 6, sk.len + 28); }
      if (sk.band) { c.beginPath(); c.moveTo(-sk.w - flare + 1.5, sk.len - 3); c.quadraticCurveTo(0, sk.len, sk.w + flare - 1.5, sk.len - 3); c.strokeStyle = sk.band; c.lineWidth = 3; c.stroke(); }
    }
    // torso
    rr(c, -10, -42, 20, 24, 7); fs(c, fit.top, OUT, 3);
    if (fit.pattern && !fit.skirt) { rr(c, -10, -42, 20, 24, 7); pattern(c, fit.pattern, -10, -42, 20, 24); }
    if (fit.pattern && fit.pattern.kind === 'embroid') { rr(c, -10, -42, 20, 24, 7); pattern(c, fit.pattern, -10, -42, 20, 24); }
    if (fit.apron) { rr(c, -7, -34, 14, 24, 3); fs(c, fit.apron, OUT, 2); c.beginPath(); c.moveTo(-5, -34); c.lineTo(-4, -42); c.moveTo(5, -34); c.lineTo(4, -42); c.strokeStyle = fit.apron; c.lineWidth = 1.6; c.stroke(); }
    if (fit.inner) { c.beginPath(); c.moveTo(-4, -42); c.lineTo(0, -30); c.lineTo(4, -42); c.closePath(); fs(c, fit.inner); }
    if (fit.lapel) { c.beginPath(); c.moveTo(-4, -40); c.lineTo(-7, -30); c.moveTo(4, -40); c.lineTo(7, -30); c.strokeStyle = fit.lapel; c.lineWidth = 1.5; c.stroke(); }
    if (fit.buttons) { circ(c, 0, -27, 1.3); fs(c, fit.buttons); circ(c, 0, -22, 1.3); fs(c, fit.buttons); }
    if (fit.stripe) { c.fillStyle = fit.stripe; c.fillRect(-0.8, -30, 1.6, 11); }
    if (fit.neck === 'necklace') {
      c.beginPath(); c.moveTo(-5, -41); c.quadraticCurveTo(0, -32, 5, -41); c.strokeStyle = '#e8b84a'; c.lineWidth = 1.3; c.stroke();
      circ(c, 0, -33.5, 1.6); fs(c, '#f2c94c');
    } else neckwear(c, fit.neck, -40);
    // head: back hair (bob)
    var hy = -54 + (o.squash || 0);
    c.beginPath(); c.moveTo(-14, hy - 2); c.quadraticCurveTo(-16, hy + 12, -12, hy + 15); c.lineTo(12, hy + 15); c.quadraticCurveTo(16, hy + 12, 14, hy - 2); c.closePath();
    fs(c, hairD, OUT, 3);
    ell(c, 0, hy, 11.5, 13); fs(c, skin, OUT, 3);
    [-1, 1].forEach(function (sd) {
      c.beginPath(); c.moveTo(-1, hy - 14);
      c.quadraticCurveTo(sd * 13 - 1, hy - 14, sd * 14, hy + 1);
      c.lineTo(sd * 13.5, hy + 11);
      c.quadraticCurveTo(sd * 10.5, hy + 2, sd * 9, hy - 6);
      c.quadraticCurveTo(sd * 5 - 1, hy - 10, -1, hy - 14);
      c.closePath(); fs(c, hair, OUT, 2.5);
    });
    c.beginPath(); c.moveTo(-1, hy - 14); c.lineTo(-0.5, hy - 9); c.strokeStyle = hairD; c.lineWidth = 1.5; c.stroke();
    if (fit.neck === 'scarf') neckwear(c, 'scarf', -41);
    // eyes, brows, mouth
    var blink = ((t + 1) % 3.7) < 0.12 && !f.surprised;
    var ey = hy + 1;
    [-5, 5].forEach(function (ex) {
      if (blink) { c.beginPath(); c.moveTo(ex - 3, ey); c.lineTo(ex + 3, ey); c.strokeStyle = OUT; c.lineWidth = 2; c.stroke(); return; }
      ell(c, ex, ey, 3.6, f.surprised ? 4.8 : 4.2); fs(c, '#fff', OUT, 1.6);
      circ(c, ex + 0.8, ey + 0.6, 2.3); fs(c, '#4a2c1c');
      circ(c, ex + 1.4, ey - 0.6, 0.9); fs(c, '#fff');
    });
    var by = f.surprised ? ey - 9 : ey - 7;
    if (fit.hat !== 'beanie' || true) {
      c.strokeStyle = '#3a2214'; c.lineWidth = 2.2;
      c.beginPath(); c.moveTo(-8.5, by + 1.2); c.quadraticCurveTo(-5, by - 1.5, -2, by + 0.5); c.stroke();
      c.beginPath(); c.moveTo(8.5, by + 1.2); c.quadraticCurveTo(5, by - 1.5, 2, by + 0.5); c.stroke();
    }
    ell(c, -8, hy + 6, 2.4, 1.4); fs(c, 'rgba(232,110,110,0.35)'); ell(c, 8, hy + 6, 2.4, 1.4); fs(c, 'rgba(232,110,110,0.35)');
    if (f.surprised) { ell(c, 1, hy + 8, 2.4, 3); fs(c, '#7a2f2f', OUT, 1.5); }
    else { c.beginPath(); c.moveTo(-2.5, hy + 7.5); c.quadraticCurveTo(1, hy + 10.5, 4, hy + 7.2); c.strokeStyle = OUT; c.lineWidth = 1.8; c.stroke(); }
    hat(c, fit.hat, hy, hy - 14, false);
    // front arm (holds umbrella when gliding)
    c.save(); c.translate(6, -37);
    c.rotate(o.glide ? -2.9 : (air ? -2.2 : sw * 0.6));
    rr(c, -3, 0, 6, 17, 3); fs(c, fit.sleeve, OUT, 2.5);
    if (fit.stripe) { c.fillStyle = fit.stripe; c.fillRect(-0.8, 1, 1.6, 14); }
    circ(c, 0, 18, 3.2); fs(c, skin, OUT, 2); c.restore();
    if (o.glide) { // paprika parasol
      c.save(); c.translate(4, -64 - (fit.hat === 'chef' ? 10 : 0));
      c.beginPath(); c.moveTo(0, 26); c.lineTo(0, -6); c.strokeStyle = OUT; c.lineWidth = 2.5; c.stroke();
      c.beginPath(); c.moveTo(-24, 0); c.quadraticCurveTo(-22, -22, 0, -24); c.quadraticCurveTo(22, -22, 24, 0);
      c.quadraticCurveTo(18, -5, 12, 0); c.quadraticCurveTo(6, -5, 0, 0); c.quadraticCurveTo(-6, -5, -12, 0); c.quadraticCurveTo(-18, -5, -24, 0);
      fs(c, '#d92f2a', OUT, 3);
      c.beginPath(); c.moveTo(-10, -18); c.quadraticCurveTo(-6, -22, 2, -21); c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 2.5; c.stroke();
      c.beginPath(); c.moveTo(0, -24); c.quadraticCurveTo(3, -32, 9, -33); c.strokeStyle = '#3f8c2f'; c.lineWidth = 4; c.stroke();
      c.restore();
    }
    c.restore();
  }

  function drawBraco(c, o) {
    var t = o.t, f = o.face, air = o.air, walk = o.walk, sw = Math.sin(walk) * (o.moving ? 1 : 0);
    var fit = o.fit || OF.B[0];
    var skin = '#e8b791', hair = '#17161b';
    c.save();
    c.scale(o.facing, 1);
    if (o.push) c.rotate(0.12);
    var lg = air ? 0.35 : sw * 0.55;
    [[-1, lg], [1, -lg]].forEach(function (L) {
      c.save(); c.translate(L[0] * 6, -21); c.rotate(L[1]);
      if (fit.shorts) {
        rr(c, -4, 0, 8, 20, 3.5); fs(c, skin, OUT, 2.5);
        rr(c, -5, -1, 10, 9, 3); fs(c, fit.pants, OUT, 2.5);
        if (fit.number) { rr(c, -4, 13, 8, 5, 2); fs(c, fit.shirt, OUT, 1.5); }
      } else { rr(c, -4.5, 0, 9, 20, 3.5); fs(c, fit.pants, OUT, 2.5); }
      ell(c, 3, 20.5, 6.5, 3.2); fs(c, fit.shoes, OUT, 2);
      c.restore();
    });
    var armA = o.push ? -1.45 : (air ? -2.3 : -sw * 0.6);
    function arm(x, rot) {
      c.save(); c.translate(x, -40); c.rotate(rot);
      rr(c, -3.5, 0, 7, 18, 3.5); fs(c, fit.sleeve, OUT, 2.5);
      if (fit.pattern && !fit.vest && fit.pattern.kind !== 'stripes') { rr(c, -3.5, 0, 7, 18, 3.5); pattern(c, fit.pattern, -4, 0, 8, 18); rr(c, -3.5, 0, 7, 18, 3.5); fs(c, null, OUT, 2.5); }
      circ(c, 0, 19, 3.6); fs(c, skin, OUT, 2); c.restore();
    }
    arm(-9, armA);
    rr(c, -13, -45, 26, 26, 8); fs(c, fit.shirt, OUT, 3);
    if (fit.pattern) { rr(c, -13, -45, 26, 26, 8); pattern(c, fit.pattern, -13, -45, 26, 26); rr(c, -13, -45, 26, 26, 8); fs(c, null, OUT, 3); }
    if (fit.pocket) { rr(c, -7, -30, 14, 7, 3); fs(c, fit.pocket, OUT, 1.5); }
    if (fit.apron) { rr(c, -9, -36, 18, 24, 3); fs(c, fit.apron, OUT, 2); }
    if (fit.vest) {
      var vp = fit.pattern && fit.pattern.kind === 'embroid';
      [-1, 1].forEach(function (sd) {
        c.beginPath(); c.moveTo(sd * 13, -38); c.lineTo(sd * 4, -45); c.lineTo(sd * 3, -22); c.lineTo(sd * 12, -20); c.closePath(); fs(c, fit.vest, OUT, 2);
        if (vp) { c.beginPath(); c.moveTo(sd * 13, -38); c.lineTo(sd * 4, -45); c.lineTo(sd * 3, -22); c.lineTo(sd * 12, -20); c.closePath(); pattern(c, fit.pattern, sd > 0 ? 3 : -13, -45, 10, 25); }
      });
      if (fit.lapel) { c.beginPath(); c.moveTo(-4, -45); c.lineTo(-8, -34); c.moveTo(4, -45); c.lineTo(8, -34); c.strokeStyle = fit.lapel; c.lineWidth = 2; c.stroke(); }
    }
    if (fit.sash) { rr(c, -13, -26, 26, 6, 2); fs(c, fit.sash, OUT, 2); }
    if (fit.buttons) { circ(c, 7, -33, 1.4); fs(c, fit.buttons); circ(c, 7, -27, 1.4); fs(c, fit.buttons); }
    if (fit.number) { c.fillStyle = '#fbf7ee'; c.font = '700 10px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(fit.number, 0, -31); c.lineWidth = 0.8; c.strokeStyle = OUT; c.strokeText(fit.number, 0, -31); }
    neckwear(c, fit.neck, -43, true);
    var hy = -58 + (o.squash || 0);
    ell(c, 0, hy, 13, 14); fs(c, skin, OUT, 3);
    ell(c, -12.5, hy + 2, 3, 4); fs(c, skin, OUT, 2); ell(c, 12.5, hy + 2, 3, 4); fs(c, skin, OUT, 2);
    // black hair with a quiff and sideburns
    c.beginPath(); c.moveTo(-13, hy + 2); c.quadraticCurveTo(-15, hy - 16, 0, hy - 16); c.quadraticCurveTo(10, hy - 22, 12, hy - 15);
    c.quadraticCurveTo(16, hy - 8, 13, hy + 2); c.quadraticCurveTo(10, hy - 8, 2, hy - 8); c.quadraticCurveTo(-8, hy - 8, -13, hy + 2); c.closePath();
    fs(c, hair, OUT, 2.5);
    c.beginPath(); c.moveTo(4, hy - 16); c.quadraticCurveTo(9, hy - 19, 11, hy - 14); c.strokeStyle = '#4a4a55'; c.lineWidth = 1.5; c.stroke();
    var blink = ((t + 2) % 4.3) < 0.12 && !f.surprised;
    var ey = hy - 0.5;
    [-5.5, 5.5].forEach(function (ex) {
      if (blink) { c.beginPath(); c.moveTo(ex - 3.5, ey); c.lineTo(ex + 3.5, ey); c.strokeStyle = OUT; c.lineWidth = 2; c.stroke(); return; }
      ell(c, ex, ey, 4.4, f.surprised ? 5.6 : 5); fs(c, '#fff', OUT, 1.7);
      circ(c, ex + 0.9, ey + 0.6, 2.8); fs(c, '#2b1a12');
      circ(c, ex + 1.6, ey - 0.8, 1.1); fs(c, '#fff');
    });
    var by = f.surprised ? ey - 10 : ey - 8;
    c.strokeStyle = hair; c.lineWidth = 3;
    c.beginPath(); c.moveTo(-9.5, by + 1); c.lineTo(-2.5, by - 0.5); c.stroke();
    c.beginPath(); c.moveTo(9.5, by + 1); c.lineTo(2.5, by - 0.5); c.stroke();
    // mustache + small goatee
    c.beginPath(); c.moveTo(0, hy + 6); c.quadraticCurveTo(-5, hy + 4, -8, hy + 8.5); c.quadraticCurveTo(-4, hy + 8, 0, hy + 7.5);
    c.quadraticCurveTo(4, hy + 8, 8, hy + 8.5); c.quadraticCurveTo(5, hy + 4, 0, hy + 6); fs(c, hair, OUT, 1);
    if (f.surprised) { ell(c, 0, hy + 10.5, 2.2, 2.4); fs(c, '#6e2a2a', OUT, 1.4); }
    else { c.beginPath(); c.moveTo(-3, hy + 10); c.quadraticCurveTo(0, hy + 11.5, 3, hy + 10); c.strokeStyle = OUT; c.lineWidth = 1.6; c.stroke(); }
    c.beginPath(); c.moveTo(-4, hy + 12); c.quadraticCurveTo(0, hy + 13.5, 4, hy + 12); c.lineTo(0, hy + 18.5); c.closePath(); fs(c, hair, OUT, 1.2);
    hat(c, fit.hat, hy, hy - 15, true);
    arm(9, o.push ? -1.45 : (air ? -2.3 : sw * 0.6));
    c.restore();
  }

  // Name tag above each character: colour + shape + initial, so they read without colour.
  function drawTag(c, kind, x, y, label) {
    var p = PLAYER[kind];
    c.save(); c.translate(x, y);
    c.beginPath(); c.moveTo(-5, 8); c.lineTo(0, 14); c.lineTo(5, 8); c.closePath(); fs(c, p.c, OUT, 2);
    if (p.tag === 'circle') { circ(c, 0, 0, 10); } else { rr(c, -10, -10, 20, 20, 4); }
    fs(c, p.c, OUT, 2.5);
    c.fillStyle = '#fff'; c.font = '700 13px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(label, 0, 1);
    c.restore();
  }

  var anim = { S: { walk: 0, squash: 0, wasGround: true }, B: { walk: 0, squash: 0, wasGround: true } };
  function drawPlayer(c, p, t, dt, names, opts) {
    var a = anim[p.kind];
    var moving = Math.abs(p.vx) > 20 && !!p.ground;
    a.walk += Math.abs(p.vx) * dt * 0.075;
    if (p.ground && !a.wasGround) a.squash = 4;
    a.wasGround = !!p.ground;
    a.squash = Math.max(0, a.squash - dt * 30);
    var cx = p.x + p.w / 2, by = p.y + p.h;
    var o = {
      t: t + (p.kind === 'B' ? 1.3 : 0), facing: p.facing || 1, walk: a.walk, moving: moving, air: !p.ground,
      glide: !!p.gliding, push: !!p.pushing, squash: a.squash,
      face: { surprised: p.dead || (!p.ground && (p.vy > 250 || p.vy < -500)) },
      fit: OF.get(p.kind, (opts.outfits || {})[p.kind])
    };
    c.save();
    c.translate(cx, by + (opts.reduceMotion ? 0 : 0));
    if (p.dead) { c.globalAlpha = 0.85; c.rotate(Math.sin(t * 30) * 0.15); }
    if (!opts.reduceMotion && a.squash > 0) c.scale(1 + a.squash * 0.02, 1 - a.squash * 0.025);
    // soft shadow
    if (p.ground) { ell(c, 0, 1, p.w * 0.7, 4); fs(c, 'rgba(0,0,0,0.18)'); }
    if (p.kind === 'S') drawSeka(c, o); else drawBraco(c, o);
    c.restore();
    var hk = o.fit.hat, hatUp = hk === 'chef' ? 16 : (hk === 'souwester' || hk === 'folkhat' || hk === 'sunhat' || hk === 'beanie') ? 6 : 0;
    drawTag(c, p.kind, cx, p.y - (p.kind === 'S' ? 32 : 30) - (p.gliding ? 30 : hatUp), (names[p.kind] || p.kind).charAt(0).toUpperCase());
  }

  // ---------- collectibles ----------
  function drawFood(c, kind, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s);
    if (kind === 'kulen') { // slice of paprika sausage
      circ(c, 0, 0, 13); fs(c, '#a8322a', OUT, 3);
      circ(c, 0, 0, 9.5); fs(c, '#c8463a');
      [[-4, -3], [3, -5], [5, 3], [-3, 5], [0, 0], [-6, 2]].forEach(function (d) { circ(c, d[0], d[1], 1.6); fs(c, '#f6e1cf'); });
    } else if (kind === 'paprika') {
      c.beginPath(); c.moveTo(-2, -10); c.quadraticCurveTo(-13, -8, -10, 4); c.quadraticCurveTo(-6, 15, 2, 14); c.quadraticCurveTo(12, 10, 10, -2); c.quadraticCurveTo(8, -11, -2, -10);
      fs(c, '#de2f24', OUT, 3);
      c.beginPath(); c.moveTo(-5, -5); c.quadraticCurveTo(-7, 2, -4, 8); c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 2.5; c.stroke();
      c.beginPath(); c.moveTo(0, -10); c.quadraticCurveTo(1, -16, 6, -17); c.strokeStyle = '#3f8c2f'; c.lineWidth = 4; c.stroke();
    } else if (kind === 'fis') { // bowl of fiš paprikaš
      c.beginPath(); c.moveTo(-14, -3); c.quadraticCurveTo(-13, 12, 0, 12); c.quadraticCurveTo(13, 12, 14, -3); c.closePath(); fs(c, '#f4efe4', OUT, 3);
      ell(c, 0, -3, 14, 4.5); fs(c, '#d23f1f', OUT, 2);
      ell(c, -4, -4, 3.5, 1.4); fs(c, '#f0a05a'); ell(c, 5, -3, 2.5, 1.1); fs(c, '#f0a05a');
      c.strokeStyle = '#2f6fb0'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-11, 4); c.lineTo(11, 4); c.stroke();
    } else if (kind === 'pogaca') { // round bread
      ell(c, 0, 2, 14, 10); fs(c, '#d9a35a', OUT, 3);
      ell(c, 0, -1, 11, 6); fs(c, '#e8ba73');
      c.strokeStyle = '#a8702f'; c.lineWidth = 1.8;
      c.beginPath(); c.moveTo(-7, -3); c.lineTo(7, 3); c.moveTo(-7, 3); c.lineTo(7, -3); c.stroke();
    } else if (kind === 'orahnjaca') { // walnut roll slice
      circ(c, 0, 0, 13); fs(c, '#e2b878', OUT, 3);
      c.beginPath(); for (var sp = 0; sp < 40; sp++) { var sa2 = sp * 0.42, sr2 = 1 + sp * 0.26; c.lineTo(Math.cos(sa2) * sr2, Math.sin(sa2) * sr2); }
      c.strokeStyle = '#6b3f1d'; c.lineWidth = 2.6; c.stroke();
    } else if (kind === 'licitar') { // red gingerbread heart
      c.beginPath(); c.moveTo(0, 13); c.bezierCurveTo(-18, 0, -12, -16, 0, -7); c.bezierCurveTo(12, -16, 18, 0, 0, 13); c.closePath(); fs(c, '#d8262c', OUT, 3);
      c.beginPath(); c.moveTo(0, 9); c.bezierCurveTo(-13, 0, -9, -11, 0, -4); c.bezierCurveTo(9, -11, 13, 0, 0, 9); c.closePath();
      c.setLineDash([2, 2.5]); c.strokeStyle = '#fffaf0'; c.lineWidth = 1.8; c.stroke(); c.setLineDash([]);
      circ(c, 0, 0, 3); fs(c, '#bfe3f2', OUT, 1);
    } else if (kind === 'saran') { // grilled carp on a stick
      c.strokeStyle = '#8a5a33'; c.lineWidth = 3; c.beginPath(); c.moveTo(-15, 13); c.lineTo(14, -12); c.stroke();
      ell(c, 0, 0, 13, 7, -0.7); fs(c, '#c8742e', OUT, 2.5);
      c.beginPath(); c.moveTo(-9, 8); c.lineTo(-15, 15); c.lineTo(-7, 13); c.closePath(); fs(c, '#c8742e', OUT, 2);
      circ(c, 7, -6, 1.6); fs(c, OUT);
      c.strokeStyle = '#8a3f1a'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-3, -2); c.lineTo(1, 3); c.moveTo(1, -5); c.lineTo(5, 0); c.stroke();
    } else if (kind === 'grozde') { // bunch of grapes
      [[-6, -6], [0, -7], [6, -6], [-3, 0], [3, 0], [-6, 1], [6, 1], [0, 6], [-3, 11], [3, 7]].forEach(function (g) { circ(c, g[0], g[1], 4.4); fs(c, '#7b3fa0', OUT, 1.8); });
      circ(c, -1.5, -8, 1.3); fs(c, 'rgba(255,255,255,0.6)');
      c.beginPath(); c.moveTo(0, -10); c.quadraticCurveTo(10, -18, 13, -12); c.quadraticCurveTo(8, -9, 0, -10); fs(c, '#5f9a35', OUT, 1.5);
    } else if (kind === 'krafna') { // doughnut with jam and sugar
      circ(c, 0, 1, 13); fs(c, '#d99a4e', OUT, 3);
      c.fillStyle = '#e9b56c'; c.fillRect(-13, -1, 26, 3);
      for (var sg = 0; sg < 12; sg++) { circ(c, Math.cos(sg * 2.1) * (3 + sg % 4 * 2.4), -4 + Math.sin(sg * 2.1) * (2 + sg % 3 * 2), 1); fs(c, '#fffaf0'); }
      circ(c, 4, 6, 2.6); fs(c, '#b8262a', OUT, 1);
    } else { // čobanac pot
      c.beginPath(); c.moveTo(-12, -4); c.lineTo(-10, 10); c.quadraticCurveTo(0, 15, 10, 10); c.lineTo(12, -4); c.closePath(); fs(c, '#2f2b30', OUT, 3);
      ell(c, 0, -4, 12, 4); fs(c, '#b8361d', OUT, 2);
      c.strokeStyle = OUT; c.lineWidth = 2.5; c.beginPath(); c.arc(0, -6, 13, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
      ell(c, -3, -5, 3, 1.2); fs(c, '#ef7b3d');
    }
    c.restore();
  }

  // ---------- objects ----------
  function drawPlate(c, p) {
    var info = chInfo(p.ch), down = p.on ? 4 : 0;
    rr(c, p.x - 2, p.y + 3, p.w + 4, 6, 2); fs(c, '#4d4a52', OUT, 2);
    rr(c, p.x + 2, p.y - 2 + down, p.w - 4, 7, 2.5); fs(c, p.on ? info.d : info.c, OUT, 2.2);
    if (p.heavy) { // kettlebell sign behind
      var sx = p.x + p.w / 2, sy = p.y - 22;
      c.strokeStyle = OUT; c.lineWidth = 2; c.beginPath(); c.moveTo(sx, sy + 10); c.lineTo(sx, p.y - 2); c.stroke();
      circ(c, sx, sy, 9); fs(c, '#5b5560', OUT, 2.2);
      c.beginPath(); c.arc(sx, sy - 9, 5, Math.PI, 0); c.strokeStyle = OUT; c.lineWidth = 2.5; c.stroke();
      c.fillStyle = '#fff'; c.font = '700 8px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('kg', sx, sy + 1);
      chIcon(c, p.ch, p.x + p.w / 2, p.y + 1 + down, 3.5);
    } else chIcon(c, p.ch, p.x + p.w / 2, p.y + 1.5 + down, 3.5);
  }
  function drawLever(c, l) {
    var info = chInfo(l.ch), bx = l.x + T / 2, by = l.y + T;
    l.flip += ((l.on ? 1 : 0) - l.flip) * 0.25;
    var ang = -0.7 + l.flip * 1.4;
    c.save(); c.translate(bx, by - 8); c.rotate(ang);
    rr(c, -2.5, -26, 5, 26, 2); fs(c, '#6e6a72', OUT, 2);
    circ(c, 0, -28, 6); fs(c, info.c, OUT, 2.5);
    c.restore();
    rr(c, bx - 14, by - 10, 28, 10, 4); fs(c, '#7b5a3a', OUT, 2.5);
    chIcon(c, l.ch, bx, by - 5, 3.2);
  }
  function drawTimer(c, tm, t) {
    var info = chInfo(tm.ch), bx = tm.x + tm.w / 2, by = tm.y + tm.h;
    rr(c, bx - 2.5, by - 34, 5, 34, 2); fs(c, '#6b4a2f', OUT, 2);
    rr(c, bx - 16, by - 36, 32, 5, 2); fs(c, '#6b4a2f', OUT, 2);
    var swing = tm.left > 0 ? Math.sin(t * 14) * 0.35 * Math.min(1, tm.left / tm.dur + 0.3) : 0;
    c.save(); c.translate(bx, by - 33); c.rotate(swing);
    c.beginPath(); c.moveTo(-9, 16); c.quadraticCurveTo(-9, 2, 0, 2); c.quadraticCurveTo(9, 2, 9, 16); c.closePath(); fs(c, '#e9b941', OUT, 2.5);
    circ(c, 0, 17, 2.5); fs(c, OUT);
    c.restore();
    rr(c, tm.x, tm.y + 2, tm.w, 6, 2); fs(c, tm.pressed ? info.d : info.c, OUT, 2);
    if (tm.left > 0) {
      c.beginPath(); c.arc(bx, by - 22, 17, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * tm.left / tm.dur);
      c.strokeStyle = info.c; c.lineWidth = 4; c.stroke();
    }
    chIcon(c, tm.ch, bx + 13, by - 4, 3.2);
  }
  function drawGate(c, g, t) {
    var l = E.chList(g.ch), info = chInfo(l[0]);
    var X = g.X, Y = g.Y, Wd = g.W, Hd = g.H;
    if (g.inv) { // bridge that appears while powered
      if (g.w > 1 && g.h > 1) {
        c.save(); rr(c, g.x, g.y, g.w, g.h, 4); c.clip();
        c.fillStyle = '#c08a52'; c.fillRect(g.x, g.y, g.w, g.h);
        c.strokeStyle = '#8a5a2c'; c.lineWidth = 2;
        for (var bx = X; bx < X + Wd; bx += 20) { c.beginPath(); c.moveTo(bx, g.y); c.lineTo(bx, g.y + g.h); c.stroke(); }
        c.fillStyle = info.c; c.fillRect(g.x, g.y + g.h - 5, g.w, 5);
        c.restore();
        rr(c, g.x, g.y, g.w, g.h, 4); fs(c, null, OUT, 2.5);
      }
      c.setLineDash([6, 6]); rr(c, X + 1, Y + 1, Wd - 2, Hd - 2, 4); fs(c, null, 'rgba(43,29,22,' + (g.open > 0.5 ? 0.45 : 0.15) + ')', 2); c.setLineDash([]);
      chIcons(c, g.ch, X + Wd / 2, Y + Hd / 2, 5, true);
      return;
    }
    // fence/portcullis gate
    if (g.w > 1 && g.h > 1) {
      c.save(); c.beginPath(); c.rect(g.x, g.y, g.w, g.h); c.clip();
      var horiz = g.horiz;
      c.fillStyle = 'rgba(60,40,30,0.25)'; c.fillRect(g.x, g.y, g.w, g.h);
      c.strokeStyle = OUT; c.lineWidth = 2;
      if (!horiz) {
        for (var yy = Y + 6; yy < Y + Hd; yy += 30) { rr(c, X + 3, yy, Wd - 6, 22, 3); fs(c, info.c, OUT, 2); }
        rr(c, X + 4, g.y + g.h - 10, Wd - 8, 8, 2); fs(c, info.d, OUT, 2);
      } else {
        for (var xx = X + 6; xx < X + Wd; xx += 30) { rr(c, xx, Y + 3, 22, Hd - 6, 3); fs(c, info.c, OUT, 2); }
      }
      c.restore();
      c.beginPath(); c.rect(g.x, g.y, g.w, g.h); fs(c, null, OUT, 2.5);
    }
    // posts / frame
    if (!g.horiz) { rr(c, X - 3, Y - 6, Wd + 6, 8, 3); fs(c, '#5b4636', OUT, 2.5); }
    else { rr(c, X - 6, Y - 3, 8, Hd + 6, 3); fs(c, '#5b4636', OUT, 2.5); }
    chIcons(c, g.ch, g.horiz ? X - 2 : X + Wd / 2, g.horiz ? Y + Hd / 2 : Y - 2, 5.5, false);
  }
  function drawLift(c, L, t) {
    var x = L.x, y = L.y, w = L.w, s = L.skin;
    if (s === 'tram') {
      rr(c, x, y, w, 30, 6); fs(c, '#2f4f8f', OUT, 3);
      c.fillStyle = '#f1ede2'; c.fillRect(x + 3, y + 4, w - 6, 5);
      for (var i = 0; i < Math.floor(w / 30); i++) { rr(c, x + 8 + i * 30, y + 12, 20, 11, 2); fs(c, '#a9cbe6', OUT, 1.5); }
      circ(c, x + 14, y + 33, 6); fs(c, '#333', OUT, 2); circ(c, x + w - 14, y + 33, 6); fs(c, '#333', OUT, 2);
      c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2 - 10, y - 18); c.lineTo(x + w / 2 + 8, y - 26); c.strokeStyle = OUT; c.lineWidth = 2; c.stroke();
    } else if (s === 'boat') {
      c.beginPath(); c.moveTo(x - 6, y); c.lineTo(x + w + 6, y); c.quadraticCurveTo(x + w, y + 24, x + w - 12, y + 26); c.lineTo(x + 12, y + 26); c.quadraticCurveTo(x, y + 24, x - 6, y); c.closePath();
      fs(c, '#3b6fb0', OUT, 3);
      c.fillStyle = '#fbf3e4'; c.fillRect(x, y + 4, w, 5);
      rr(c, x - 4, y - 2, w + 8, 7, 3); fs(c, '#b07a45', OUT, 2.5);
    } else if (s === 'raft') {
      for (var r = 0; r < Math.ceil(w / 14); r++) { rr(c, x + r * 14, y, 14, 16, 6); fs(c, '#a8743f', OUT, 2); }
    } else if (s === 'wagon') {
      rr(c, x, y, w, 18, 4); fs(c, '#b8452f', OUT, 3);
      c.fillStyle = '#efcf6a'; rr(c, x + 4, y - 4, w - 8, 6, 3); fs(c, '#efcf6a', OUT, 1.5);
      var spin = (x / 12);
      [x + 16, x + w - 16].forEach(function (wx) {
        circ(c, wx, y + 20, 10); fs(c, '#6b4a2f', OUT, 2.5);
        c.save(); c.translate(wx, y + 20); c.rotate(spin); c.strokeStyle = OUT; c.lineWidth = 2;
        c.beginPath(); c.moveTo(-8, 0); c.lineTo(8, 0); c.moveTo(0, -8); c.lineTo(0, 8); c.stroke(); c.restore();
      });
    } else if (s === 'gondola') {
      c.strokeStyle = OUT; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y - 40); c.stroke();
      c.beginPath(); c.moveTo(x - 4, y - 40); c.quadraticCurveTo(x + w / 2, y - 60, x + w + 4, y - 40); c.closePath(); fs(c, '#e45a4f', OUT, 2.5);
      rr(c, x, y, w, 22, 6); fs(c, '#f2c14e', OUT, 3);
      c.fillStyle = '#e45a4f'; c.fillRect(x + 4, y + 8, w - 8, 5);
    } else { // wooden lift on chains
      c.strokeStyle = 'rgba(43,29,22,0.6)'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(x + 8, y); c.lineTo(x + 8, 0); c.moveTo(x + w - 8, y); c.lineTo(x + w - 8, 0); c.stroke();
      rr(c, x, y, w, L.h + 4, 4); fs(c, '#b07a45', OUT, 3);
      c.fillStyle = '#d19a5e'; c.fillRect(x + 3, y + 3, w - 6, 3);
    }
    if (L.ch != null) chIcons(c, L.ch, x + w / 2, y + (s === 'tram' ? 17 : s === 'wagon' ? 10 : 8), 4.5, false);
  }
  function drawCrate(c, k) {
    rr(c, k.x, k.y, k.w, k.h, 3); fs(c, '#c08a52', OUT, 3);
    c.strokeStyle = '#8a5a2c'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(k.x + 4, k.y + 4); c.lineTo(k.x + k.w - 4, k.y + k.h - 4); c.moveTo(k.x + k.w - 4, k.y + 4); c.lineTo(k.x + 4, k.y + k.h - 4); c.stroke();
    rr(c, k.x + 2, k.y + 2, k.w - 4, k.h - 4, 2); fs(c, null, '#8a5a2c', 2);
  }
  function drawExit(c, ex, world, t) {
    var x = ex.x, y = ex.y, w = ex.w, h = ex.h;
    var S = world.players.S, B = world.players.B, both = S.inDoor && B.inDoor;
    if (both) { var gl = c.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, 90); gl.addColorStop(0, 'rgba(255,220,120,0.6)'); gl.addColorStop(1, 'rgba(255,220,120,0)'); c.fillStyle = gl; c.fillRect(x - 60, y - 60, w + 120, h + 120); }
    c.beginPath(); c.moveTo(x - 6, y + h); c.lineTo(x - 6, y + 28); c.quadraticCurveTo(x + w / 2, y - 18, x + w + 6, y + 28); c.lineTo(x + w + 6, y + h); c.closePath();
    fs(c, '#9a6a3c', OUT, 3);
    c.beginPath(); c.moveTo(x + 6, y + h); c.lineTo(x + 6, y + 32); c.quadraticCurveTo(x + w / 2, y + 2, x + w - 6, y + 32); c.lineTo(x + w - 6, y + h); c.closePath();
    fs(c, both ? '#ffe39a' : '#5b3a22', OUT, 2.5);
    if (!both) { c.strokeStyle = '#3f2614'; c.lineWidth = 2; for (var i = 1; i < 4; i++) { c.beginPath(); c.moveTo(x + 6 + i * (w - 12) / 4, y + 22); c.lineTo(x + 6 + i * (w - 12) / 4, y + h); c.stroke(); } circ(c, x + w - 16, y + h / 2 + 8, 3); fs(c, '#f2c94c', OUT, 1.5); }
    // two lamps show who has arrived
    [['S', x - 2], ['B', x + w + 2]].forEach(function (q) {
      var on = world.players[q[0]].inDoor, p = PLAYER[q[0]];
      c.save(); c.translate(q[1], y + 30);
      if (p.tag === 'circle') circ(c, 0, 0, 8); else rr(c, -8, -8, 16, 16, 3);
      fs(c, on ? p.c : '#6b5a4e', OUT, 2.5);
      if (on) { c.fillStyle = 'rgba(255,255,255,0.7)'; circ(c, -2, -2, 2.5); c.fill(); }
      c.restore();
    });
    // little garland on top
    for (var k = 0; k < 5; k++) { circ(c, x + 4 + k * (w - 8) / 4, y + 8 + Math.abs(k - 2) * 4, 4); fs(c, ['#e5484d', '#f2c14e', '#36b37e', '#3b82e0', '#e5484d'][k], OUT, 1.5); }
  }
  // Signs stand on the first floor below their tile, so they never float.
  function signBase(world, s) {
    if (s.gy == null) {
      var y = s.ty;
      while (y < E.ROWS - 1 && '#X-=b'.indexOf(world.grid[y + 1][s.tx]) < 0) y++;
      s.gy = y;
    }
    return (s.gy + 1) * T;
  }
  function drawSignPost(c, s, world) {
    var x = s.tx * T + T / 2, y = signBase(world, s);
    rr(c, x - 2, y - 26, 4, 26, 2); fs(c, '#6b4a2f', OUT, 2);
    rr(c, x - 13, y - 34, 26, 16, 3); fs(c, '#d6a868', OUT, 2.5);
    c.fillStyle = OUT; c.font = '700 12px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('!', x, y - 26);
  }
  function wrapText(c, text, maxW) {
    var words = text.split(' '), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) {
      var tryL = cur ? cur + ' ' + words[i] : words[i];
      if (c.measureText(tryL).width > maxW && cur) { lines.push(cur); cur = words[i]; } else cur = tryL;
    }
    if (cur) lines.push(cur);
    return lines;
  }
  function bubble(c, text, x, y, maxW) {
    c.font = '600 16px ' + FONT;
    var lines = wrapText(c, text, maxW), w = 0;
    lines.forEach(function (l) { w = Math.max(w, c.measureText(l).width); });
    var bw = w + 24, bh = lines.length * 20 + 16;
    var bx = Math.max(8, Math.min(W - bw - 8, x - bw / 2)), by = Math.max(8, y - bh - 12);
    rr(c, bx, by, bw, bh, 10); fs(c, '#fffaf0', OUT, 3);
    c.beginPath(); c.moveTo(x - 8, by + bh - 1); c.lineTo(x, by + bh + 10); c.lineTo(x + 8, by + bh - 1); fs(c, '#fffaf0');
    c.beginPath(); c.moveTo(x - 8, by + bh); c.lineTo(x, by + bh + 10); c.lineTo(x + 8, by + bh); fs(c, null, OUT, 3);
    c.fillStyle = OUT; c.textAlign = 'left'; c.textBaseline = 'top';
    lines.forEach(function (l, i) { c.fillText(l, bx + 12, by + 9 + i * 20); });
  }

  // ---------- live liquids ----------
  function drawLiquids(c, live, t, reduce) {
    for (var i = 0; i < live.length; i++) {
      var q = live[i], px = q.x * T, py = q.y * T, stew = q.t === '~';
      c.fillStyle = stew ? '#a92c1a' : '#2c6aa0';
      c.fillRect(px, py + (q.top ? 12 : 0), T, T - (q.top ? 12 : 0));
      if (!q.top) continue;
      var ph = reduce ? 0 : t * (stew ? 2.5 : 3);
      c.beginPath(); c.moveTo(px, py + T);
      for (var k = 0; k <= 8; k++) { var xx = px + k * 5; c.lineTo(xx, py + 12 + Math.sin(ph + (q.x * 8 + k) * 0.8) * 3); }
      c.lineTo(px + T, py + T); c.closePath();
      c.fillStyle = stew ? '#d9431f' : '#4f9bd3'; c.fill();
      c.beginPath();
      for (var k2 = 0; k2 <= 8; k2++) { var x2 = px + k2 * 5, y2 = py + 12 + Math.sin(ph + (q.x * 8 + k2) * 0.8) * 3; if (k2) c.lineTo(x2, y2); else c.moveTo(x2, y2); }
      c.strokeStyle = stew ? '#f39a4c' : '#cfe9f7'; c.lineWidth = 2.5; c.stroke();
      if (stew && !reduce) {
        var bt = (t * 0.9 + q.x * 0.37) % 1;
        circ(c, px + 10 + (q.x * 13) % 20, py + 30 - bt * 18, 3 * (1 - bt) + 1); fs(c, '#f6a35a');
        if ((q.x + q.y) % 3 === 0) { c.fillStyle = 'rgba(255,240,220,' + (0.25 * (1 - bt)) + ')'; ell(c, px + 20, py + 2 - bt * 18, 6, 3); c.fill(); }
      }
    }
  }

  // ---------- particles ----------
  var parts = [];
  function puff(x, y, n, col, spread, up) {
    for (var i = 0; i < n; i++) parts.push({ x: x, y: y, vx: (Math.random() - 0.5) * spread, vy: -Math.random() * (up || 60), life: 0.5 + Math.random() * 0.3, max: 0.8, col: col, r: 2 + Math.random() * 3 });
  }
  function onEvents(world, events) {
    for (var i = 0; i < events.length; i++) {
      var e = events[i], P = world.players;
      if (e.type === 'land' || e.type === 'jump') {
        var p = e.who ? P[e.who] : null;
        if (p) puff(p.x + p.w / 2, p.y + p.h, 5, 'rgba(230,220,200,0.9)', 120, 40);
      } else if (e.type === 'coin') {
        var cn = world.coins[e.idx]; if (cn) puff(cn.x, cn.y, 14, '#ffd84d', 260, 160);
      } else if (e.type === 'break') {
        (e.tiles || []).forEach(function (tl) { puff(tl[0] * T + 20, tl[1] * T + 20, 5, '#a0705a', 300, 200); });
      } else if (e.type === 'die') {
        var d = P[e.who]; if (d) puff(d.x + d.w / 2, d.y + d.h / 2, 18, e.cause === 'w' ? '#9fd3f2' : e.cause === '~' ? '#f39a4c' : '#ffffff', 300, 220);
      } else if (e.type === 'bounce') {
        var b = e.who ? P[e.who] : null; if (b) puff(b.x + b.w / 2, b.y + b.h, 8, '#efcf6a', 200, 80);
      } else if (e.type === 'win') {
        var ex = world.exit; for (var k = 0; k < 4; k++) puff(ex.x + ex.w / 2, ex.y + 10, 10, ['#e5484d', '#f2c14e', '#36b37e', '#3b82e0'][k], 360, 260);
      }
    }
  }
  function drawParticles(c, dt) {
    for (var i = parts.length - 1; i >= 0; i--) {
      var q = parts[i];
      q.life -= dt; if (q.life <= 0) { parts.splice(i, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 300 * dt;
      c.globalAlpha = Math.max(0, q.life / q.max);
      circ(c, q.x, q.y, q.r); c.fillStyle = q.col; c.fill();
    }
    c.globalAlpha = 1;
  }

  // ---------- main draw ----------
  var tileCache = null, tileWorld = null, tileDirty = true;
  function invalidate() { tileDirty = true; }

  function drawWorld(c, world, o) {
    var ch = world.def.chapter, t = o.t, dt = o.dt || 0;
    if (tileWorld !== world || tileDirty) { tileCache = buildTiles(world, ch); tileWorld = world; tileDirty = false; }
    c.drawImage(background(ch), 0, 0);
    drawLiquids(c, tileCache.live, t, o.reduceMotion);
    c.drawImage(tileCache.canvas, 0, 0);
    var i;
    if (ch === 4 || ch === 6 || ch === 9) { // twinkling bulbs on festival string lights
      for (var y = 0; y < E.ROWS; y++) for (var x = 0; x < E.COLS; x++) if (world.grid[y][x] === '=') {
        var on = o.reduceMotion ? 1 : (Math.sin(t * 3 + x * 1.7) > -0.3 ? 1 : 0.4);
        circ(c, x * T + 20, y * T + 16, 4); fs(c, 'rgba(' + ['255,214,90', '255,120,120', '140,220,170'][x % 3] + ',' + on + ')', OUT, 1.5);
      }
    }
    for (i = 0; i < world.signs.length; i++) drawSignPost(c, world.signs[i], world);
    drawExit(c, world.exit, world, t);
    for (i = 0; i < world.gates.length; i++) drawGate(c, world.gates[i], t);
    for (i = 0; i < world.plates.length; i++) drawPlate(c, world.plates[i]);
    for (i = 0; i < world.levers.length; i++) drawLever(c, world.levers[i]);
    for (i = 0; i < world.timers.length; i++) drawTimer(c, world.timers[i], t);
    for (i = 0; i < world.lifts.length; i++) drawLift(c, world.lifts[i], t);
    for (i = 0; i < world.crates.length; i++) drawCrate(c, world.crates[i]);
    var food = (root.SB_LEVELS.CHAPTERS[ch] || {}).food;
    for (i = 0; i < world.coins.length; i++) {
      var cn = world.coins[i]; if (cn.taken) continue;
      var bob = o.reduceMotion ? 0 : Math.sin(t * 3 + i) * 3;
      var gl = c.createRadialGradient(cn.x, cn.y + bob, 4, cn.x, cn.y + bob, 24);
      gl.addColorStop(0, 'rgba(255,246,190,0.95)'); gl.addColorStop(1, 'rgba(255,246,190,0)');
      c.fillStyle = gl; circ(c, cn.x, cn.y + bob, 24); c.fill();
      if (!o.reduceMotion) { c.save(); c.translate(cn.x, cn.y + bob); c.rotate(t * 1.5 + i); c.strokeStyle = 'rgba(255,215,80,0.9)'; c.lineWidth = 2;
        for (var sp = 0; sp < 4; sp++) { c.rotate(Math.PI / 2); c.beginPath(); c.moveTo(19, 0); c.lineTo(24, 0); c.stroke(); } c.restore(); }
      drawFood(c, food, cn.x, cn.y + bob, 1);
    }
    var P = world.players;
    drawPlayer(c, P.B, t, dt, o.names, o);
    drawPlayer(c, P.S, t, dt, o.names, o);
    drawParticles(c, dt);
    // sign bubbles when a player is close
    for (i = 0; i < world.signs.length; i++) {
      var s = world.signs[i], sx = s.tx * T + T / 2, sy = signBase(world, s);
      var near = ['S', 'B'].some(function (k) { var p = P[k]; return Math.abs(p.x + p.w / 2 - sx) < 70 && Math.abs(p.y + p.h - sy) < 90; });
      if (near) bubble(c, o.fmt ? o.fmt(s.text) : s.text, sx, sy - 40, 300);
    }
  }

  function drawHUD(c, info) {
    // level badge
    c.font = '700 20px ' + FONT;
    var label = info.label, lw = c.measureText(label).width;
    rr(c, 12, 10, lw + 28, 38, 12); fs(c, 'rgba(255,250,240,0.92)', OUT, 3);
    c.fillStyle = OUT; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(label, 26, 30);
    // collectibles
    var bx = W - 150;
    rr(c, bx, 10, 138, 38, 12); fs(c, 'rgba(255,250,240,0.92)', OUT, 3);
    for (var i = 0; i < 3; i++) {
      c.save(); c.globalAlpha = info.coins[i] ? 1 : 0.28;
      drawFood(c, info.food, bx + 26 + i * 43, 29, 0.85);
      c.restore();
    }
    // key reminders
    c.font = '600 14px ' + FONT;
    var help = info.help;
    var hw = c.measureText(help).width;
    rr(c, W / 2 - hw / 2 - 14, 12, hw + 28, 30, 10); fs(c, 'rgba(43,29,22,0.55)');
    c.fillStyle = '#fffaf0'; c.textAlign = 'center'; c.fillText(help, W / 2, 28);
    if (info.hint) {
      c.font = '600 18px ' + FONT;
      var lines = wrapText(c, info.hint, 900), bh = lines.length * 24 + 20;
      rr(c, W / 2 - 480, H - bh - 18, 960, bh, 14); fs(c, 'rgba(255,250,240,0.96)', OUT, 3);
      c.fillStyle = OUT; c.textAlign = 'center'; c.textBaseline = 'top';
      lines.forEach(function (l, k) { c.fillText(l, W / 2, H - bh - 8 + k * 24); });
    }
    if (info.banner) {
      c.font = '700 26px ' + FONT;
      var bw2 = c.measureText(info.banner).width + 40;
      rr(c, W / 2 - bw2 / 2, 70, bw2, 46, 14); fs(c, 'rgba(255,250,240,0.95)', OUT, 3);
      c.fillStyle = OUT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(info.banner, W / 2, 94);
    }
  }

  // Portrait used by menus (title screen, win screen, how-to-play).
  function drawPortrait(c, kind, x, y, scale, t, opts) {
    opts = opts || {};
    c.save(); c.translate(x, y); c.scale(scale, scale);
    var o = { t: t || 0, facing: opts.facing || 1, walk: 0, moving: false, air: !!opts.air, glide: !!opts.glide, push: !!opts.push, squash: 0, face: { surprised: !!opts.surprised }, fit: OF.get(kind, opts.outfit) };
    ell(c, 0, 1, 18, 4); fs(c, 'rgba(0,0,0,0.18)');
    if (kind === 'S') drawSeka(c, o); else drawBraco(c, o);
    c.restore();
  }

  root.SB_RENDER = {
    drawWorld: drawWorld, drawHUD: drawHUD, drawPortrait: drawPortrait, drawFood: drawFood, background: background,
    onEvents: onEvents, invalidate: invalidate, clearParticles: function () { parts.length = 0; },
    CHANNELS: CHANNELS, PLAYER: PLAYER, FONT: FONT, chIcon: chIcon, shapePath: shapePath
  };
})(window);
