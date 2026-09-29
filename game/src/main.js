// main.js - boot: canvas, input, nav, asset loading, fixed-timestep loop.
(function () {
  'use strict';
  var H = window.H, G = H.G;

  var FALLBACK_LAYOUT = {
    width: 1280, height: 720,
    walls: [{ id: 'backwall', x: 0, y: 0, w: 1280, h: 150 }, { id: 'left_wall', x: 0, y: 150, w: 40, h: 490 }, { id: 'right_wall', x: 1240, y: 150, w: 40, h: 490 },
      { id: 'bar_counter', x: 60, y: 195, w: 560, h: 50 }, { id: 'humidor_cabinet', x: 1140, y: 190, w: 100, h: 200 },
      { id: 'front_glass_l', x: 0, y: 640, w: 760, h: 80 }, { id: 'front_glass_r', x: 900, y: 640, w: 380, h: 80 }],
    tables: [{ id: 'T1', x: 290, y: 410, r: 34 }, { id: 'T2', x: 560, y: 470, r: 34 }, { id: 'T3', x: 800, y: 400, r: 34 }, { id: 'T4', x: 1000, y: 440, r: 34 }],
    seats: [{ id: 'S1', table: 'T1', x: 235, y: 425, face: 'right', kind: 'armchair' }, { id: 'S2', table: 'T1', x: 345, y: 425, face: 'left', kind: 'armchair' },
      { id: 'S3', table: 'T2', x: 505, y: 485, face: 'right', kind: 'armchair' }, { id: 'S4', table: 'T2', x: 615, y: 485, face: 'left', kind: 'armchair' },
      { id: 'S5', table: 'T3', x: 745, y: 415, face: 'right', kind: 'armchair' }, { id: 'S6', table: 'T3', x: 855, y: 415, face: 'left', kind: 'armchair' }],
    spots: { humidor: { x: 1105, y: 290 }, tap: { x: 200, y: 172 }, spirits: { x: 340, y: 172 }, coffee: { x: 480, y: 172 }, vent: { x: 880, y: 165 }, wc_door: { x: 1000, y: 165 }, door: { x: 830, y: 655 } },
    spawn: { door: { x: 830, y: 700 }, inside: { x: 830, y: 610 } }, playerStart: { x: 340, y: 172 }, nav: { cell: 20 }
  };

  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  function fit() {
    var w = window.innerWidth, h = window.innerHeight, s = Math.min(w / 1280, h / 720);
    canvas.style.width = Math.floor(1280 * s) + 'px'; canvas.style.height = Math.floor(720 * s) + 'px';
  }
  window.addEventListener('resize', fit); fit();

  H.Input.init(canvas);
  H.Nav.init(window.LAYOUT && window.LAYOUT.walls ? window.LAYOUT : FALLBACK_LAYOUT);
  G.scene = 'loading';
  H.Assets.load(function (p) { H.Screens.loading.prog = p; }, function () { H.Screens.loading.ready = true; H.Screens.loading.prog = 1; });

  // fixed-timestep loop (60 Hz), speed multiplier for tests
  var STEP = 1 / 60, acc = 0, last = performance.now();
  function frame(now) {
    var dt = Math.min(0.25, (now - last) / 1000); last = now;
    acc += dt * (G.speed || 1);
    var n = 0;
    while (acc >= STEP && n < 600) {
      if (H.Input.bot && H.Bot) H.Bot.tick(STEP);
      H.Game.step(STEP); acc -= STEP; n++;
    }
    if (n === 600) acc = 0;
    H.Game.render(ctx, dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
