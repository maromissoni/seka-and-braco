/*
 * Seka & Braco — keyboard input for two players on one keyboard.
 * Keys are tracked by physical position (event.code), so the default
 * WASD / arrow layout works on any keyboard language.
 * Held keys are cleared when the page loses focus so nobody keeps running.
 */
(function (root) {
  'use strict';
  var held = {};
  var pressed = [];          // one-shot presses for menu/global shortcuts
  var keys = null;           // { S:{left,right,jump,use}, B:{...} }
  var capture = null;        // callback while waiting for a new binding
  var RESERVED = { Escape: 1, KeyP: 1, KeyR: 1, KeyH: 1, Tab: 1, F5: 1, F11: 1, F12: 1, MetaLeft: 1, MetaRight: 1 };
  var gameActive = false;    // only swallow keys while the game itself is focused

  function isGameKey(code) {
    if (!keys) return false;
    for (var p in keys) for (var a in keys[p]) if (keys[p][a] === code) return true;
    return false;
  }
  function typing(e) {
    var t = e.target;
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }

  root.addEventListener('keydown', function (e) {
    if (capture) {
      e.preventDefault();
      var cb = capture; capture = null;
      cb(e.code);
      return;
    }
    if (typing(e)) return;
    if (gameActive && (isGameKey(e.code) || e.code === 'Space' || /^Arrow/.test(e.code))) e.preventDefault();
    if (!held[e.code]) pressed.push(e.code);
    held[e.code] = true;
  }, { passive: false });
  root.addEventListener('keyup', function (e) { held[e.code] = false; });
  function clear() { held = {}; pressed = []; }
  root.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', function () { if (document.hidden) clear(); });

  function state() {
    var out = {};
    ['S', 'B'].forEach(function (p) {
      var k = keys[p];
      out[p] = { left: !!held[k.left], right: !!held[k.right], jump: !!held[k.jump], use: !!held[k.use] };
    });
    return out;
  }

  var NAMES = {
    ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓', Space: 'Space', Enter: 'Enter',
    ShiftLeft: 'L-Shift', ShiftRight: 'R-Shift', ControlLeft: 'L-Ctrl', ControlRight: 'R-Ctrl',
    AltLeft: 'L-Alt', AltRight: 'R-Alt', Backspace: 'Backspace', Slash: '/', Period: '.', Comma: ',',
    Semicolon: ';', Quote: "'", BracketLeft: '[', BracketRight: ']', Minus: '-', Equal: '=', Backquote: '`', Backslash: '\\'
  };
  function keyName(code) {
    if (!code) return '?';
    if (NAMES[code]) return NAMES[code];
    if (/^Key[A-Z]$/.test(code)) return code.slice(3);
    if (/^Digit\d$/.test(code)) return code.slice(5);
    if (/^Numpad/.test(code)) return 'Num ' + code.slice(6);
    return code;
  }

  root.SB_INPUT = {
    setKeys: function (k) { keys = k; },
    state: state,
    clear: clear,
    takePresses: function () { var p = pressed; pressed = []; return p; },
    setGameActive: function (on) { gameActive = !!on; if (!on) clear(); },
    // Ask for the next key press; cb(code) receives it. Returns a cancel function.
    captureNext: function (cb) { capture = cb; return function () { capture = null; }; },
    isReserved: function (code) { return !!RESERVED[code]; },
    keyName: keyName
  };
})(window);
