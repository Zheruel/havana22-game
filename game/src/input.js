// input.js - keyboard + mouse. Presses are queued and handed to the next fixed-step update so no key is lost.
(function () {
  'use strict';
  var H = window.H;
  var down = {}, queue = {}, pressed = {}, clickQ = [], clicksNow = [];
  var mouse = { x: -100, y: -100, down: false };
  var lastAct = 0;
  var GAME_KEYS = { ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1, Space: 1, Tab: 1 };

  H.Input = {
    mouse: mouse,
    init: function (canvas) {
      window.addEventListener('keydown', function (e) {
        if (GAME_KEYS[e.code]) e.preventDefault();
        if (!e.repeat) queue[e.code] = true;
        down[e.code] = true; lastAct = performance.now();
        if (H.Audio) H.Audio.unlock();
      });
      window.addEventListener('keyup', function (e) { down[e.code] = false; });
      window.addEventListener('blur', function () { down = {}; mouse.down = false; if (H.Game && H.Game.onBlur) H.Game.onBlur(); });
      function pos(e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - r.left) * (H.W / r.width); mouse.y = (e.clientY - r.top) * (H.H / r.height);
      }
      canvas.addEventListener('mousemove', pos);
      canvas.addEventListener('mousedown', function (e) { pos(e); mouse.down = true; clickQ.push({ x: mouse.x, y: mouse.y }); lastAct = performance.now(); if (H.Audio) H.Audio.unlock(); });
      window.addEventListener('mouseup', function () { mouse.down = false; });
      canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    },
    beginStep: function () { pressed = queue; queue = {}; clicksNow = clickQ; clickQ = []; },
    down: function (c) { return !!down[c]; },
    pressed: function (c) { return !!pressed[c]; },
    interactDown: function () { return !!(down.KeyE || down.Space || mouse.down); },
    interactPressed: function () { return !!(pressed.KeyE || pressed.Space); },
    confirmPressed: function () { return !!(pressed.KeyE || pressed.Space || pressed.Enter || pressed.NumpadEnter); },
    escPressed: function () { return !!pressed.Escape; },
    axis: function () {
      if (H.Input.bot && H.Bot) return H.Bot.axis;
      var x = 0, y = 0;
      if (down.KeyA || down.ArrowLeft) x -= 1;
      if (down.KeyD || down.ArrowRight) x += 1;
      if (down.KeyW || down.ArrowUp) y -= 1;
      if (down.KeyS || down.ArrowDown) y += 1;
      return { x: x, y: y };
    },
    upPressed: function () { return !!(pressed.KeyW || pressed.ArrowUp); },
    downPressed: function () { return !!(pressed.KeyS || pressed.ArrowDown); },
    leftPressed: function () { return !!(pressed.KeyA || pressed.ArrowLeft); },
    rightPressed: function () { return !!(pressed.KeyD || pressed.ArrowRight); },
    num: function () {
      for (var i = 1; i <= 9; i++) if (pressed['Digit' + i] || pressed['Numpad' + i]) return i;
      return 0;
    },
    takeClicks: function () { var c = clicksNow; clicksNow = []; return c; },
    idleFor: function () { return (performance.now() - lastAct) / 1000; },
    poke: function () { lastAct = performance.now(); },
    // synthetic input for tests / bot
    fakePress: function (code) { queue[code] = true; },
    fakeDown: function (code, v) { down[code] = !!v; }
  };
})();
