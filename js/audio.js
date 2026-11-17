/*
 * Seka & Braco — sound. Every sound is synthesised with the Web Audio API,
 * so there are no audio files to download. The music is a short plucked,
 * tamburica-flavoured loop. Browsers only allow audio after the first key
 * press or click, so init() is called from the first user input.
 */
(function (root) {
  'use strict';
  var ctx = null, master = null, sfxBus = null, musicBus = null;
  var sfxOn = true, musicOn = true, volume = 0.7;
  var musicTimer = null, nextNote = 0, step = 0;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    var AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return;
    try { ctx = new AC(); } catch (e) { ctx = null; return; }
    master = ctx.createGain(); master.gain.value = volume; master.connect(ctx.destination);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.22; musicBus.connect(master);
    if (musicOn) startMusic();
  }

  function tone(freq, dur, type, vol, slideTo, delay, bus) {
    if (!ctx) return;
    var t0 = ctx.currentTime + (delay || 0);
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(bus || sfxBus);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function noise(dur, vol, lp) {
    if (!ctx) return;
    var len = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; f.type = 'lowpass'; f.frequency.value = lp || 1200; g.gain.value = vol || 0.3;
    s.connect(f); f.connect(g); g.connect(sfxBus); s.start();
  }

  var SFX = {
    jumpS: function () { tone(520, 0.14, 'square', 0.09, 880); },
    jumpB: function () { tone(300, 0.16, 'square', 0.1, 520); },
    land: function () { noise(0.06, 0.12, 600); },
    bounce: function () { tone(260, 0.25, 'triangle', 0.25, 900); },
    coin: function () { tone(880, 0.09, 'square', 0.08); tone(1320, 0.16, 'square', 0.08, null, 0.07); },
    plate: function () { tone(180, 0.08, 'triangle', 0.2); },
    lever: function () { tone(240, 0.05, 'square', 0.12); tone(360, 0.07, 'square', 0.1, null, 0.05); },
    bell: function () { tone(1046, 0.6, 'sine', 0.2); tone(1568, 0.5, 'sine', 0.08); },
    timeout: function () { tone(420, 0.2, 'triangle', 0.12, 260); },
    gate: function () { noise(0.18, 0.08, 400); },
    break: function () { noise(0.35, 0.4, 900); tone(120, 0.25, 'sawtooth', 0.12, 60); },
    thud: function () { noise(0.1, 0.25, 300); },
    die: function () { tone(500, 0.35, 'sawtooth', 0.12, 120); },
    win: function () { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.25, 'square', 0.08, null, i * 0.09); }); },
    click: function () { tone(660, 0.05, 'square', 0.06); }
  };

  function play(name) {
    if (!ctx || !sfxOn) return;
    var f = SFX[name]; if (f) f();
  }
  function onEvents(events) {
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      if (e.type === 'jump') play(e.who === 'S' ? 'jumpS' : 'jumpB');
      else if (e.type === 'plate') { if (e.on) play('plate'); }
      else play(e.type);
    }
  }

  // --- music: plucked melody over a bass, D major, loops every 32 steps ---
  var MEL = [74, 0, 78, 81, 0, 78, 76, 74, 76, 0, 78, 76, 74, 0, 69, 0, 71, 0, 74, 78, 0, 76, 74, 71, 69, 0, 71, 74, 76, 0, 74, 0];
  var BASS = [50, 0, 0, 0, 57, 0, 0, 0, 55, 0, 0, 0, 57, 0, 0, 0, 47, 0, 0, 0, 54, 0, 0, 0, 55, 0, 0, 0, 57, 0, 0, 0];
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function pluck(m, t0, vol, dur) {
    var o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.value = mtof(m);
    f.type = 'lowpass'; f.frequency.setValueAtTime(3000, t0); f.frequency.exponentialRampToValueAtTime(500, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(f); f.connect(g); g.connect(musicBus); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function schedule() {
    var spb = 0.19;
    while (nextNote < ctx.currentTime + 0.3) {
      var i = step % 32;
      if (MEL[i]) { pluck(MEL[i], nextNote, 0.5, 0.35); pluck(MEL[i], nextNote + 0.012, 0.25, 0.3); }
      if (BASS[i]) pluck(BASS[i], nextNote, 0.7, 0.7);
      if (i % 2 === 0 && !MEL[i]) pluck(BASS[(i - i % 4)] ? BASS[i - i % 4] + 12 : 62, nextNote, 0.12, 0.15);
      nextNote += spb; step++;
    }
  }
  function startMusic() {
    if (!ctx || musicTimer) return;
    nextNote = ctx.currentTime + 0.1;
    musicTimer = setInterval(schedule, 80);
  }
  function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }

  root.SB_AUDIO = {
    init: init, play: play, onEvents: onEvents,
    setSfx: function (on) { sfxOn = !!on; },
    setMusic: function (on) { musicOn = !!on; if (!ctx) return; if (musicOn) startMusic(); else stopMusic(); },
    setVolume: function (v) { volume = v; if (master) master.gain.value = v; },
    suspend: function () { if (ctx && ctx.state === 'running') ctx.suspend(); },
    resume: function () { if (ctx && ctx.state === 'suspended') ctx.resume(); }
  };
})(window);
