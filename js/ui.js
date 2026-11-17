/*
 * Seka & Braco — menus, game loop and glue between engine, renderer,
 * input, audio and saving.
 */
(function (root) {
  'use strict';
  var E = root.SB_ENGINE, R = root.SB_RENDER, A = root.SB_AUDIO, S = root.SB_SAVE, I = root.SB_INPUT, LV = root.SB_LEVELS;
  var canvas = document.getElementById('game'), ctx = canvas.getContext('2d');
  var ui = document.getElementById('ui'), wrap = document.getElementById('wrap');
  var save = S.load();
  var notice = S.takeNotice();

  var mode = 'menu';      // menu | play | paused | complete | win
  var world = null, levelId = 1, deaths = 0, showHint = false, banner = null, bannerT = 0, completing = false;
  var lastTime = 0, acc = 0, clock = 0;
  var screenStack = [];

  // ---------- helpers ----------
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function names() { return save.settings.names; }
  function kn(p, a) { return I.keyName(save.settings.keys[p][a]); }
  function fmt(text) {
    var n = names();
    return String(text)
      .replace(/\{S\.move\}/g, kn('S', 'left') + '/' + kn('S', 'right'))
      .replace(/\{B\.move\}/g, kn('B', 'left') + '/' + kn('B', 'right'))
      .replace(/\{S\.jump\}/g, kn('S', 'jump')).replace(/\{B\.jump\}/g, kn('B', 'jump'))
      .replace(/\{S\.use\}/g, kn('S', 'use')).replace(/\{B\.use\}/g, kn('B', 'use'))
      .replace(/\{S\}/g, n.S).replace(/\{B\}/g, n.B);
  }
  function applySettings() {
    I.setKeys(save.settings.keys);
    A.setSfx(save.settings.sfx); A.setMusic(save.settings.music); A.setVolume(save.settings.volume);
  }
  applySettings();
  function persist() { if (!S.write() && !S.available) { /* storage notice already shown */ } }

  function fit() {
    var s = Math.min(root.innerWidth / E.W, root.innerHeight / E.H);
    wrap.style.transform = 'translate(-50%, -50%) scale(' + s + ')';
  }
  root.addEventListener('resize', fit); fit();

  // ---------- screens ----------
  function show(html, cls) {
    ui.innerHTML = '<div class="screen ' + (cls || '') + '">' + html + '</div>';
    ui.className = 'visible';
    var first = ui.querySelector('[data-focus]') || ui.querySelector('button:not([disabled])');
    if (first) first.focus({ preventScroll: true });
  }
  function hideUI() { ui.innerHTML = ''; ui.className = ''; }
  function on(sel, fn) { var el = ui.querySelector(sel); if (el) el.addEventListener('click', function (e) { A.play('click'); fn(e); }); }

  function noticeHTML() {
    var msg = {
      storage: 'Saving isn’t available in this browser (private window or blocked storage). You can play, but progress is lost when the page closes — use <b>Backup</b> to copy a code.',
      corrupt: 'Your saved progress was damaged and couldn’t be read, so a fresh save was started. A copy of the damaged data was kept in this browser.',
      repaired: 'Some saved settings were invalid and have been reset to their defaults.'
    }[notice];
    return msg ? '<div class="notice" role="status">' + msg + ' <button class="link" id="dismiss">OK</button></div>' : '';
  }

  function title() {
    mode = 'menu'; screenStack = []; I.setGameActive(false);
    var hasProgress = save.done.length > 0 || save.current > 1;
    show(
      '<h1 class="logo"><span class="s">' + esc(names().S) + '</span> <span class="amp">&amp;</span> <span class="b">' + esc(names().B) + '</span><small>A Slavonian Escape</small></h1>' +
      '<div class="menu">' +
      (hasProgress ? '<button class="btn big" id="cont" data-focus>Continue <span class="sub">Level ' + save.current + '</span></button>' : '') +
      '<button class="btn big" id="new"' + (hasProgress ? '' : ' data-focus') + '>New Game</button>' +
      '<button class="btn" id="sel">Level Select</button>' +
      '<button class="btn" id="how">How to Play</button>' +
      '<button class="btn" id="set">Settings</button>' +
      '<button class="btn" id="bak">Backup</button>' +
      '</div>' + noticeHTML() +
      '<p class="foot">Two players, one keyboard · ' + S.totalCoins() + ' / 150 treats found</p>', 'title');
    on('#cont', function () { startLevel(save.current); });
    on('#new', function () {
      if (!hasProgress) { startLevel(1); return; }
      confirmBox('Start again from Level 1?', 'Your unlocked levels and collected treats are kept. To erase everything, use Settings → Reset progress.', 'Start Level 1', function () { S.setCurrent(1); startLevel(1); }, title);
    });
    on('#sel', function () { levelSelect(title); });
    on('#how', function () { howTo(title); });
    on('#set', function () { settings(title); });
    on('#bak', function () { backup(title); });
    on('#dismiss', function () { notice = null; title(); });
  }

  function confirmBox(head, text, okLabel, ok, cancel) {
    show('<div class="panel small"><h2>' + esc(head) + '</h2><p>' + esc(text) + '</p><div class="row">' +
      '<button class="btn" id="no" data-focus>Cancel</button><button class="btn warn" id="yes">' + esc(okLabel) + '</button></div></div>', 'modal');
    on('#yes', ok); on('#no', cancel);
    back = cancel;
  }

  var back = null; // what Escape does in menus

  function levelSelect(ret) {
    back = ret;
    var html = '<div class="panel wide"><h2>Level Select</h2><div class="chapters">';
    LV.CHAPTERS.forEach(function (c, ci) {
      html += '<div class="chapter"><div class="chname"><b>' + (ci + 1) + '. ' + esc(c.name) + '</b><span>' + esc(c.blurb) + '</span></div><div class="lvls">';
      for (var i = 1; i <= 10; i++) {
        var id = ci * 10 + i, locked = id > save.unlocked, done = save.done.indexOf(id) >= 0;
        var got = (save.coins[id] || []).filter(Boolean).length;
        html += '<button class="lvl' + (locked ? ' locked' : '') + (done ? ' done' : '') + '" data-id="' + id + '"' + (locked ? ' disabled aria-label="Level ' + id + ' locked"' : ' aria-label="Level ' + id + ': ' + esc(LV.LEVELS[id - 1].name) + '"') + ' title="' + (locked ? 'Locked' : esc(LV.LEVELS[id - 1].name)) + '">' +
          (locked ? '<span class="lock">🔒</span>' : '<span class="num">' + id + '</span>') +
          (locked ? '' : '<span class="dots">' + [0, 1, 2].map(function (k) { return '<i class="' + ((save.coins[id] || [])[k] ? 'on' : '') + '"></i>'; }).join('') + '</span>') +
          (done ? '<span class="tick">✓</span>' : '') + '</button>';
        void got;
      }
      html += '</div></div>';
    });
    html += '</div><div class="row"><button class="btn" id="back">Back</button></div></div>';
    show(html, 'modal');
    ui.querySelectorAll('.lvl:not(.locked)').forEach(function (b) {
      b.addEventListener('click', function () { A.play('click'); startLevel(+b.dataset.id); });
    });
    var cur = ui.querySelector('.lvl[data-id="' + Math.min(save.current, save.unlocked) + '"]'); if (cur) cur.focus();
    on('#back', ret);
  }

  function keyRow(p) {
    return '<kbd>' + esc(kn(p, 'left')) + '</kbd><kbd>' + esc(kn(p, 'right')) + '</kbd> move · <kbd>' + esc(kn(p, 'jump')) + '</kbd> jump · <kbd>' + esc(kn(p, 'use')) + '</kbd> use lever';
  }
  function portraitCanvas(kind, opts) { return '<canvas class="portrait" data-kind="' + kind + '" data-opts=\'' + JSON.stringify(opts || {}) + '\' width="120" height="150"></canvas>'; }
  function paintPortraits() {
    ui.querySelectorAll('canvas.portrait').forEach(function (cv) {
      var c = cv.getContext('2d'); c.clearRect(0, 0, cv.width, cv.height);
      R.drawPortrait(c, cv.dataset.kind, cv.width / 2, cv.height - 6, 1.4, clock, JSON.parse(cv.dataset.opts || '{}'));
    });
  }

  function howTo(ret) {
    back = ret;
    var n = names();
    show('<div class="panel wide how"><h2>How to Play</h2>' +
      '<p class="lead">Both of you must reach the door together. Help each other — nobody can finish alone!</p>' +
      '<div class="two">' +
      '<div class="card s">' + portraitCanvas('S', { glide: true }) + '<h3>' + esc(n.S) + ' <span class="tagS">●</span></h3><p>' + keyRow('S') + '</p><ul>' +
      '<li>Jumps higher (3 blocks)</li><li>Holds jump in the air to glide with the paprika parasol</li><li>Can walk on red ribbon bridges</li></ul></div>' +
      '<div class="card b">' + portraitCanvas('B', { push: true }) + '<h3>' + esc(n.B) + ' <span class="tagB">■</span></h3><p>' + keyRow('B') + '</p><ul>' +
      '<li>Pushes crates</li><li>Smashes cracked walls by walking into them</li><li>Is heavy enough for <b>kg</b> plates</li></ul></div></div>' +
      '<div class="legend"><p><b>Teamwork:</b> stand on each other’s heads to reach higher. Plates, levers and bells open gates, move lifts and raise bridges — the matching <b>colour and shape</b> shows what each switch controls. A crossed symbol means a bridge that appears while powered.</p>' +
      '<p><b>Danger:</b> hot paprikaš stew, the Drava river and iron spikes send you back to the start of the level — instantly, no lives lost.</p>' +
      '<p><b>Keys:</b> <kbd>Esc</kbd>/<kbd>P</kbd> pause · <kbd>R</kbd> restart level · <kbd>H</kbd> show a hint. Each level has 3 treats to find.</p>' +
      '<p class="small"><b>Keyboard ghosting:</b> many keyboards can’t register more than a few keys at once, especially letters near the arrows. If a jump sometimes “doesn’t work” while both of you hold keys, that’s the keyboard, not the game — try remapping in Settings (for example move one player to I/J/K/L).</p></div>' +
      '<div class="row"><button class="btn" id="back" data-focus>Back</button></div></div>', 'modal');
    paintPortraits();
    on('#back', ret);
  }

  var ACTIONS = [['left', 'Left'], ['right', 'Right'], ['jump', 'Jump / glide'], ['use', 'Use lever']];
  function settings(ret, msg) {
    back = ret;
    var st = save.settings, n = st.names;
    var html = '<div class="panel wide settings"><h2>Settings</h2>' + (msg ? '<p class="msg" role="status">' + esc(msg) + '</p>' : '') +
      '<div class="two"><div><h3>Names</h3>' +
      '<label>Player 1 <input id="nameS" maxlength="14" value="' + esc(n.S) + '"></label>' +
      '<label>Player 2 <input id="nameB" maxlength="14" value="' + esc(n.B) + '"></label>' +
      '<h3>Sound &amp; display</h3>' +
      '<label class="chk"><input type="checkbox" id="sfx"' + (st.sfx ? ' checked' : '') + '> Sound effects</label>' +
      '<label class="chk"><input type="checkbox" id="music"' + (st.music ? ' checked' : '') + '> Music</label>' +
      '<label>Volume <input type="range" id="vol" min="0" max="1" step="0.05" value="' + st.volume + '"></label>' +
      '<label class="chk"><input type="checkbox" id="hints"' + (st.hints ? ' checked' : '') + '> Allow hints (H key)</label>' +
      '<label class="chk"><input type="checkbox" id="rm"' + (st.reduceMotion ? ' checked' : '') + '> Reduce motion</label>' +
      '</div><div><h3>Controls <small>click, then press a key</small></h3><table class="keys"><tr><th></th><th>' + esc(n.S) + '</th><th>' + esc(n.B) + '</th></tr>';
    ACTIONS.forEach(function (a) {
      html += '<tr><td>' + a[1] + '</td>' + ['S', 'B'].map(function (p) { return '<td><button class="key" data-p="' + p + '" data-a="' + a[0] + '">' + esc(kn(p, a[0])) + '</button></td>'; }).join('') + '</tr>';
    });
    html += '</table><button class="btn small" id="defkeys">Default keys</button>' +
      '<h3>Progress</h3><p class="small">Progress is saved in this browser only. It doesn’t sync between devices or browsers — use Backup to move it.</p>' +
      '<button class="btn warn small" id="reset">Reset progress…</button></div></div>' +
      '<div class="row"><button class="btn" id="back" data-focus>Back</button></div></div>';
    show(html, 'modal');
    function saveNames() {
      n.S = (ui.querySelector('#nameS').value.trim() || 'Seka').slice(0, 14);
      n.B = (ui.querySelector('#nameB').value.trim() || 'Braco').slice(0, 14);
      persist();
    }
    ui.querySelector('#nameS').addEventListener('change', saveNames);
    ui.querySelector('#nameB').addEventListener('change', saveNames);
    function chk(id, key, fn) { ui.querySelector(id).addEventListener('change', function (e) { st[key] = e.target.checked; persist(); applySettings(); if (fn) fn(); }); }
    chk('#sfx', 'sfx'); chk('#music', 'music'); chk('#hints', 'hints'); chk('#rm', 'reduceMotion');
    ui.querySelector('#vol').addEventListener('change', function (e) { st.volume = +e.target.value; persist(); applySettings(); A.play('coin'); });
    ui.querySelectorAll('.key').forEach(function (b) {
      b.addEventListener('click', function () {
        b.textContent = 'press a key…'; b.classList.add('wait');
        I.captureNext(function (code) {
          if (code === 'Escape') { settings(ret); return; }
          if (I.isReserved(code)) { settings(ret, I.keyName(code) + ' is reserved for pause / restart / hint.'); return; }
          var p = b.dataset.p, a = b.dataset.a, old = st.keys[p][a];
          ['S', 'B'].forEach(function (q) { ACTIONS.forEach(function (x) { if (st.keys[q][x[0]] === code) st.keys[q][x[0]] = old; }); });
          st.keys[p][a] = code;
          persist(); applySettings();
          settings(ret, 'Saved: ' + (p === 'S' ? n.S : n.B) + ' ' + a + ' = ' + I.keyName(code));
        });
      });
    });
    on('#defkeys', function () { st.keys = JSON.parse(JSON.stringify(S.DEFAULT_KEYS)); persist(); applySettings(); settings(ret, 'Keys reset to A/D/W/S and the arrow keys.'); });
    on('#reset', function () {
      confirmBox('Reset all progress?', 'This locks every level except Level 1 and forgets all collected treats. Your names, keys and sound settings stay. This cannot be undone (unless you have a Backup code).', 'Reset progress',
        function () { S.reset(); save = S.data; settings(ret, 'Progress reset.'); }, function () { settings(ret); });
    });
    on('#back', function () { saveNames(); ret(); });
  }

  function backup(ret, msg) {
    back = ret;
    show('<div class="panel wide"><h2>Backup</h2>' + (msg ? '<p class="msg" role="status">' + esc(msg) + '</p>' : '') +
      '<p>Saves stay in this browser on this device. To move progress to another browser or computer, copy this code and paste it there.</p>' +
      '<textarea id="code" readonly rows="3"></textarea>' +
      '<div class="row"><button class="btn small" id="copy" data-focus>Copy code</button><button class="btn small" id="dl">Download as file</button></div>' +
      '<h3>Restore a backup</h3><textarea id="paste" rows="3" placeholder="Paste a code that starts with SB1-"></textarea>' +
      '<div class="row"><button class="btn small" id="imp">Restore</button></div>' +
      '<div class="row"><button class="btn" id="back">Back</button></div></div>', 'modal');
    var code = S.exportCode();
    ui.querySelector('#code').value = code;
    on('#copy', function () {
      var ta = ui.querySelector('#code'); ta.select();
      var done = function () { backup(ret, 'Code copied.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, function () { document.execCommand('copy'); done(); });
      else { document.execCommand('copy'); done(); }
    });
    on('#dl', function () {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([code], { type: 'text/plain' }));
      a.download = 'seka-and-braco-backup.txt';
      document.body.appendChild(a); a.click(); a.remove();
    });
    on('#imp', function () {
      var val = ui.querySelector('#paste').value;
      if (!val.trim()) { backup(ret, 'Paste a backup code first.'); return; }
      confirmBox('Replace current progress?', 'The progress and settings in the code will replace what is saved in this browser now.', 'Restore', function () {
        var r = S.importCode(val); save = S.data; applySettings(); backup(ret, r.msg);
      }, function () { backup(ret); });
    });
    on('#back', ret);
  }

  // ---------- playing ----------
  function startLevel(id) {
    A.init();
    levelId = id;
    var def = LV.LEVELS[id - 1];
    world = new E.World(def);
    R.invalidate(); R.clearParticles();
    deaths = 0; showHint = false; banner = null; completing = false;
    S.setCurrent(id);
    mode = 'play'; hideUI(); I.setGameActive(true); I.takePresses();
    canvas.focus();
  }
  function restart() { world.reset(); R.invalidate(); R.clearParticles(); I.takePresses(); }

  function pause() {
    if (mode !== 'play') return;
    mode = 'paused'; I.setGameActive(false);
    var def = world.def;
    back = resume;
    show('<div class="panel small"><h2>Paused</h2><p class="lvlname">Level ' + levelId + ' · ' + esc(def.name) + '</p>' +
      (save.settings.hints ? '<p class="hint">💡 ' + esc(fmt(def.hint)) + '</p>' : '') +
      '<div class="menu"><button class="btn" id="res" data-focus>Resume</button><button class="btn" id="rst">Restart level</button>' +
      '<button class="btn" id="how">How to Play</button><button class="btn" id="set">Settings</button>' +
      '<button class="btn" id="sel">Level Select</button><button class="btn" id="main">Main Menu</button></div></div>', 'modal');
    on('#res', resume); on('#rst', function () { restart(); resume(); });
    on('#how', function () { howTo(pause2); }); on('#set', function () { settings(pause2); });
    on('#sel', function () { levelSelect(pause2); }); on('#main', title);
  }
  function pause2() { mode = 'play'; pause(); }
  function resume() { mode = 'play'; hideUI(); I.setGameActive(true); I.takePresses(); canvas.focus(); }

  function complete() {
    var coins = world.coinsTaken(), got = coins.filter(Boolean).length;
    var saved = S.completeLevel(levelId, coins);
    save = S.data;
    I.setGameActive(false);
    if (levelId === LV.LEVELS.length) { winScreen(); return; }
    mode = 'complete';
    var best = (save.coins[levelId] || []).filter(Boolean).length;
    back = function () { levelSelect(title); };
    show('<div class="panel small"><h2>Level complete!</h2><p class="lvlname">' + esc(world.def.name) + '</p>' +
      '<div class="treats">' + [0, 1, 2].map(function (i) { return '<canvas class="food" data-on="' + (coins[i] ? 1 : 0) + '" width="60" height="60"></canvas>'; }).join('') + '</div>' +
      '<p>' + got + ' of 3 treats this time' + (best > got ? ' · best ' + best + '/3' : '') + '</p>' +
      (levelId % 10 === 0 ? '<p class="small">Chapter complete! Next: <b>' + esc(LV.CHAPTERS[levelId / 10].name) + '</b></p>' : '') +
      (saved ? '' : '<p class="small warnText">Progress could not be saved in this browser.</p>') +
      '<div class="menu"><button class="btn big" id="next" data-focus>Next level</button><button class="btn" id="again">Play again</button><button class="btn" id="sel">Level Select</button></div></div>', 'modal');
    var food = LV.CHAPTERS[world.def.chapter].food;
    ui.querySelectorAll('canvas.food').forEach(function (cv) {
      var c = cv.getContext('2d'); c.globalAlpha = cv.dataset.on === '1' ? 1 : 0.25; R.drawFood(c, food, 30, 30, 1.6);
    });
    on('#next', function () { startLevel(levelId + 1); });
    on('#again', function () { startLevel(levelId); });
    on('#sel', function () { levelSelect(title); });
  }

  function winScreen() {
    mode = 'win';
    var n = names(), total = S.totalCoins();
    back = title;
    show('<div class="panel win"><h2>Živjeli! You did it!</h2>' +
      '<div class="pair">' + portraitCanvas('S', { surprised: true }) + portraitCanvas('B', { facing: -1 }) + '</div>' +
      '<p class="lead">' + esc(n.S) + ' &amp; ' + esc(n.B) + ' made it through all 50 levels — from the old town to the grand fiš feast.</p>' +
      '<p>Treats found: <b>' + total + ' / 150</b>' + (total < 150 ? ' — some are still hiding in earlier levels!' : ' — every single one. Legendary!') + '</p>' +
      '<p class="small">Thanks for playing together.</p>' +
      '<div class="menu"><button class="btn" id="sel" data-focus>Level Select</button><button class="btn" id="main">Main Menu</button></div></div>', 'modal');
    paintPortraits();
    on('#sel', function () { levelSelect(title); }); on('#main', title);
  }

  // ---------- main loop ----------
  var fireworks = 0;
  function frame(now) {
    var dt = Math.min(0.1, (now - (lastTime || now)) / 1000);
    lastTime = now; clock += dt;
    var presses = I.takePresses();

    if (mode === 'play' && world) {
      for (var k = 0; k < presses.length; k++) {
        var p = presses[k];
        if (p === 'Escape' || p === 'KeyP') { pause(); break; }
        if (p === 'KeyR') restart();
        if (p === 'KeyH' && save.settings.hints) showHint = !showHint;
      }
    } else if (mode !== 'play') {
      for (var j = 0; j < presses.length; j++) {
        var q = presses[j];
        if (q === 'Escape' && back) { var b = back; b(); break; }
        if (q === 'ArrowDown' || q === 'ArrowUp' || q === 'ArrowLeft' || q === 'ArrowRight') moveFocus(q);
      }
    }

    if (mode === 'play' && world) {
      acc += dt;
      var inp = I.state(), steps = 0;
      while (acc >= E.STEP && steps < 12) {
        world.step(E.STEP, inp);
        acc -= E.STEP; steps++;
        if (world.state !== 'play' && world.state !== 'dying') break;
      }
      if (steps >= 12) acc = 0;
      if (world.events.length) {
        R.onEvents(world, world.events); A.onEvents(world.events);
        world.events.forEach(function (e) { if (e.type === 'break') R.invalidate(); if (e.type === 'die') deaths++; });
        world.events.length = 0;
      }
      if (world.state === 'failed') {
        restart();
        if (deaths === 3 && save.settings.hints && !showHint) { banner = 'Stuck? Press H for a hint'; bannerT = 4; }
      } else if (world.state === 'won' && !completing) {
        completing = true;
        setTimeout(function () { completing = false; if (mode === 'play') complete(); }, 450);
      }
    } else acc = 0;

    // draw
    if (world && mode !== 'menu') {
      R.drawWorld(ctx, world, { t: clock, dt: mode === 'play' ? dt : 0, names: names(), fmt: fmt, reduceMotion: save.settings.reduceMotion });
      var def = world.def, tut = null;
      if (levelId <= 3 && mode === 'play' && world.t < 12) tut = fmt('{S}: {S.move} move, {S.jump} jump, {S.use} lever   ·   {B}: {B.move} move, {B.jump} jump, {B.use} lever');
      if (bannerT > 0) bannerT -= dt; else banner = null;
      R.drawHUD(ctx, {
        label: 'Level ' + levelId + ' · ' + def.name, coins: world.coinsTaken(),
        food: LV.CHAPTERS[def.chapter].food,
        help: 'Esc pause · R restart' + (save.settings.hints ? ' · H hint' : ''),
        hint: showHint ? '💡 ' + fmt(def.hint) : tut, banner: banner
      });
      if (mode !== 'play') { ctx.fillStyle = 'rgba(30,18,12,0.45)'; ctx.fillRect(0, 0, E.W, E.H); }
    } else {
      // menu backdrop: cycle through the chapters' scenery
      var ch = Math.floor(clock / 8) % 5;
      ctx.drawImage(R.background(ch), 0, 0);
      R.drawPortrait(ctx, 'S', 470, 650, 2.6, clock, { glide: Math.sin(clock) > 0.6 });
      R.drawPortrait(ctx, 'B', 810, 650, 2.6, clock, { facing: -1 });
      ctx.fillStyle = 'rgba(30,18,12,0.2)'; ctx.fillRect(0, 0, E.W, E.H);
    }
    if (ui.querySelector('canvas.portrait') && Math.floor(clock * 10) !== fireworks) { fireworks = Math.floor(clock * 10); paintPortraits(); }
    requestAnimationFrame(frame);
  }

  function moveFocus(code) {
    var items = Array.prototype.slice.call(ui.querySelectorAll('button:not([disabled]), input, textarea'));
    if (!items.length) return;
    var a = document.activeElement;
    if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA') && (code === 'ArrowLeft' || code === 'ArrowRight')) return;
    var i = items.indexOf(a);
    var d = (code === 'ArrowDown' || code === 'ArrowRight') ? 1 : -1;
    if (a && a.classList.contains('lvl') && (code === 'ArrowDown' || code === 'ArrowUp')) {
      var id = +a.dataset.id + (code === 'ArrowDown' ? 10 : -10);
      var t = ui.querySelector('.lvl[data-id="' + id + '"]:not([disabled])'); if (t) { t.focus(); return; }
    }
    var n = items[(i + d + items.length) % items.length]; if (n) n.focus();
  }

  // pause automatically if the window loses focus mid-level
  root.addEventListener('blur', function () { if (mode === 'play') pause(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) { if (mode === 'play') pause(); A.suspend(); } else A.resume(); });
  // first interaction unlocks audio
  ['keydown', 'pointerdown'].forEach(function (ev) { root.addEventListener(ev, function () { A.init(); }, { once: false, passive: true }); });

  // Debug/testing hook (used by the automated browser check; harmless for players).
  root.SB_DEBUG = { get world() { return world; }, get mode() { return mode; }, startLevel: startLevel, title: title };

  title();
  requestAnimationFrame(frame);
})(window);
