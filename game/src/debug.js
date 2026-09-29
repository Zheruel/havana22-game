// debug.js - window.__game test hooks + a tiny autoplay bot (used to verify a whole night plays and to eyeball balance).
(function () {
  'use strict';
  var H = window.H, G = H.G;
  var STEP = 1 / 60;

  // ------------------------------------------------------------------ bot
  var Bot = {
    on: false, path: [], pathT: 0, goal: null, wantMenu: null, eCd: 0, lightHold: false,
    axis: { x: 0, y: 0 },
    tick: function (dt) {
      var I = H.Input, P = G.player, UI = H.UI, m = UI.modal;
      this.axis = { x: 0, y: 0 }; this.eCd -= dt;
      if (G.scene !== 'play' || G.paused) {
        if (G.scene === 'intro' || G.scene === 'summary' || G.scene === 'finale') { if (this.eCd <= 0) { I.fakePress('KeyE'); this.eCd = 0.6; } }
        if (G.scene === 'shop' && this.eCd <= 0) {
          this.eCd = 0.5; this.shopDone = (this.shopDone || 0) + 1;
          if (this.shopDone <= 3) I.fakePress('Digit' + this.shopDone);
          else { H.Screens.shop.sel = 999; I.fakePress('KeyE'); this.shopDone = 0; }
        }
        return;
      }
      if (m) {
        if (m.type === 'light') {
          var inZone = m.p > m.z0 + m.zw * 0.32 && m.p < m.z0 + m.zw * 0.68;
          if (!m.armed) I.fakeDown('KeyE', false);
          else if (!m.holding) I.fakeDown('KeyE', true);
          else I.fakeDown('KeyE', !inZone);
          return;
        }
        if (m.type === 'dialog') { if (this.eCd <= 0) { I.fakePress('Digit1'); I.fakePress('KeyE'); this.eCd = 0.35; } return; }
        if (m.type === 'menu' && this.wantMenu) { var idx = this.wantMenu.idx; this.wantMenu = null; I.fakePress('Digit' + (idx + 1)); return; }
        if (m.type === 'photo') { return; }
      }
      I.fakeDown('KeyE', false);
      var goal = this.decide(P);
      if (!goal) return;
      // walk
      var d = H.dist(P.x, P.y, goal.x, goal.y);
      this.pathT -= dt;
      if (this.pathT <= 0 || !this.path.length || this.goalKey !== goal.key) {
        this.path = H.Nav.path(P.x, P.y, goal.x, goal.y, true) || [{ x: goal.x, y: goal.y }]; this.pathT = 0.4; this.goalKey = goal.key;
      }
      while (this.path.length && H.dist(P.x, P.y, this.path[0].x, this.path[0].y) < 8) this.path.shift();
      if (d > (goal.reach || 30) && this.path.length) {
        var t = this.path[0], dx = t.x - P.x, dy = t.y - P.y, l = Math.sqrt(dx * dx + dy * dy) || 1;
        this.axis = { x: dx / l, y: dy / l };
      } else if (goal.act && this.eCd <= 0) {
        goal.act(); this.eCd = 0.3;
      }
    },
    spot: function (k) { var s = H.Nav.L.spots[k]; return { x: s.x, y: s.y, key: k }; },
    decide: function (P) {
      var self = this, C = H.C;
      // emergencies
      if (G.smoke > 62 && G.ventCd <= 0) { var v = this.spot('vent'); v.reach = 40; v.act = function () { H.Input.fakePress('KeyE'); }; return v; }
      var gam = G.customers.filter(function (c) { return c.role === 'gamer' && c.ev && (c.ev.phase === 'run' || c.ev.phase === 'queue') && !c.ev.allowed; })[0];
      if (gam && P.shoutCd <= 0) { H.Input.fakePress('KeyQ'); }
      var baka = G.customers.filter(function (c) { return c.role === 'baka' && c.ev && c.ev.phase === 'complain'; })[0];
      if (baka) { return { x: baka.x - 20, y: baka.y + 10, key: 'baka' + baka.uid, reach: 50, act: function () { H.Input.fakePress('KeyE'); } }; }
      var rk = G.customers.filter(function (c) { return c.role === 'roko' && c.ev && c.ev.ranting; })[0];
      if (rk) { return { x: rk.x, y: rk.y + 40, key: 'roko', reach: 55, act: function () { H.Input.fakePress('KeyE'); } }; }
      // serve
      var cur = this.cur;
      if (!cur || cur.dead || G.customers.indexOf(cur) < 0 || !(cur.state === 'ordering' || cur.state === 'needLight') || cur.frozen > 0) {
        cur = G.customers.filter(function (c) { return (c.state === 'ordering' || c.state === 'needLight') && c.frozen <= 0; })
          .sort(function (a, b) { return a.pat / a.patMax - b.pat / b.patMax; })[0];
        this.cur = cur;
      }
      var need = cur;
      if (!need) { var mid = { x: 620, y: 300, key: 'idle', reach: 60 }; return mid; }
      if (need.state === 'needLight') return this.custGoal(need);
      var n = need.needs();
      if (n.cigar && !P.has(n.cigar)) { var h = this.spot('humidor'); h.reach = 40; h.act = function () { self.wantMenu = { idx: C.cigars.map(function (x) { return x.id; }).indexOf(n.cigar) }; H.Input.fakePress('KeyE'); }; return h; }
      if (n.drink && !P.has(n.drink)) {
        var it = C.itemById[n.drink], src = it.source || 'tap', s = this.spot(src); s.reach = 40;
        var list = C.drinks.filter(function (d) { return d.source === src; }); if (!list.length) list = C.drinks;
        s.act = function () { self.wantMenu = { idx: list.map(function (x) { return x.id; }).indexOf(n.drink) }; H.Input.fakePress('KeyE'); }; return s;
      }
      return this.custGoal(need);
    },
    custGoal: function (c) {
      // closest reachable free cell to the customer's body centre
      var N = H.Nav, P = G.player, cands = [], cell = N.cell, cc = N.cellOf(c.x, c.y - 30);
      for (var dy = -5; dy <= 5; dy++) for (var dx = -5; dx <= 5; dx++) {
        var cx = cc.cx + dx, cy = cc.cy + dy; if (cx < 0 || cy < 0 || cx >= N.cols || cy >= N.rows || N.gridS[cy * N.cols + cx]) continue;
        var p = N.center(cx, cy); cands.push({ x: p.x, y: p.y, d: H.dist(p.x, p.y, c.x, c.y - 30) });
      }
      cands.sort(function (a, b) { return a.d - b.d; });
      var pick = null;
      for (var i = 0; i < cands.length && i < 25; i++) { if (cands[i].d < 22) continue; if (N.path(P.x, P.y, cands[i].x, cands[i].y, true)) { pick = cands[i]; break; } }
      pick = pick || { x: c.x, y: c.y + 40 };
      return { x: pick.x, y: pick.y, key: 'c' + c.uid + ':' + Math.round(pick.x), reach: 20, act: function () { H.Input.fakePress('KeyE'); } };
    }
  };
  H.Bot = Bot;

  // ------------------------------------------------------------------ hooks
  function advance(sec) { for (var i = 0; i < Math.round(sec / STEP); i++) { if (H.Input.bot) Bot.tick(STEP); H.Game.step(STEP); } }
  var hooks = window.__game = {
    H: H, G: G, Bot: Bot,
    get state() { return G; },
    startGame: function () { H.Game.newGame(); H.Game.beginPlay(); },
    skipToNight: function (n, intro) {
      if (G.scene === 'loading') G.scene = 'title';
      H.Game.startNight(n || 1); if (!intro) H.Game.beginPlay();
    },
    setClock: function (min, fire) {
      G.clock = min; if (!fire) H.Events.sched = H.Events.sched.filter(function (s) { return s.t >= min; });
    },
    spawn: function (id) { return H.Events.spawn(id); },
    forceEvent: function (name) { return H.Events.forceEvent(name); },
    giveMoney: function (n) { G.cash += n; },
    godMode: function (b) { G.godMode = b !== false; return G.godMode; },
    setSpeed: function (s) { G.speed = s; },
    seed: function (n) { H.seed(n); },
    setSmoke: function (v) { G.smoke = v; },
    setStars: function (v) { G.rating = v; },
    endNight: function () { H.Game.endNight('debug'); },
    advance: advance,
    press: function (code) { H.Input.fakePress(code); },
    hold: function (code, v) { H.Input.fakeDown(code, v); },
    teleport: function (x, y) { G.player.x = x; G.player.y = y; },
    carry: function (cigar, drink) { if (cigar !== undefined) G.player.carry.cigars = cigar ? [].concat(cigar) : []; if (drink !== undefined) G.player.carry.drinks = drink ? [].concat(drink) : []; },
    bot: function (on) { Bot.on = on !== false; H.Input.bot = Bot.on; if (!Bot.on) H.Input.fakeDown('KeyE', false); return Bot.on; },
    shot: function () { return document.getElementById('game').toDataURL('image/png'); },
    dump: function () {
      return { scene: G.scene, night: G.night, clock: Math.round(G.clock), cash: Math.round(G.cash * 10) / 10, goal: G.goal, rating: +G.rating.toFixed(2), smoke: Math.round(G.smoke),
        customers: G.customers.map(function (c) { return c.id + ':' + c.state + (c.ev && c.ev.phase ? '/' + c.ev.phase : ''); }), stats: G.nightStats, modal: H.UI.modal && H.UI.modal.type };
    }
  };

  // ------------------------------------------------------------------ scenario helpers for manual/scripted testing
  var T = hooks.T = {
    fresh: function (n, seed, god) { H.Game.newGame(); hooks.seed(seed || 1); hooks.skipToNight(n || 1, false); hooks.setSpeed(0); hooks.bot(false); hooks.godMode(god !== false); T.errs.length = 0; },
    errs: [],
    find: function (id) { return G.customers.filter(function (x) { return x.id === id && !x.dead; })[0]; },
    near: function (id) {
      var c = T.find(id), best = null, bd = 1e9;
      for (var x = c.x - 85; x <= c.x + 85; x += 5) for (var y = c.y - 85; y <= c.y + 85; y += 5) {
        var d = H.dist(x, y, c.x, c.y); if (d < 34 || d > 84 || d >= bd) continue;
        if (!H.Nav.solidAt(x, y, 13, true)) { best = { x: x, y: y }; bd = d; }
      }
      best = best || { x: c.x, y: c.y + 40 };
      hooks.teleport(best.x, best.y); advance(0.1); return c;
    },
    st: function () {
      return JSON.stringify({ sc: G.scene, clock: Math.round(G.clock), cash: +G.cash.toFixed(1), rating: +G.rating.toFixed(2), smoke: Math.round(G.smoke), modal: H.UI.modal && H.UI.modal.type, prompt: G.prompt && G.prompt.text,
        cust: G.customers.map(function (c) { return c.id + ':' + c.state + (c.ev && c.ev.phase ? '/' + c.ev.phase : ''); }), carry: G.player.carry, errs: T.errs });
    },
    serve: function (id) { var c = T.near(id), n = c.needs(); hooks.carry(n.cigar, n.drink); G.autoLight = 1; hooks.press('KeyE'); advance(0.6); hooks.press('KeyE'); advance(0.6); return c; },
    skipDlg: function (pick) {
      var out = [];
      for (var i = 0; i < 30 && H.UI.modal && H.UI.modal.type === 'dialog'; i++) {
        advance(2); var m = H.UI.modal; if (!m) break;
        if (m.choices && m.choices.length) { out.push('CH:' + m.choices.map(function (c) { return c.text; }).join(' | ')); hooks.press('Digit' + (pick || 1)); } else hooks.press('KeyE');
        advance(0.3);
      }
      return out;
    },
    until: function (fn, max) { for (var i = 0; i < (max || 120); i++) { advance(0.5); if (fn()) return i * 0.5; } return -1; }
  };
  window.addEventListener('error', function (e) { T.errs.push(e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno); });
})();
