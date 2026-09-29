// screens.js - non-play scenes: loading, title, night intro, summary, upgrade shop, fail, finale cutscene, pause.
(function () {
  'use strict';
  var H = window.H, G = H.G, UI = H.UI, S = H.Screens = {};

  // ---------------------------------------------------------------- tiny vertical menu helper
  function Menu(items, x, y, w, h, gap) { this.items = items; this.sel = 0; this.x = x; this.y = y; this.w = w; this.h = h; this.gap = gap; }
  Menu.prototype.update = function () {
    var n = this.items.length, I = H.Input;
    if (!n) return;
    if (I.upPressed()) { this.sel = (this.sel + n - 1) % n; H.Audio.click(); }
    if (I.downPressed()) { this.sel = (this.sel + 1) % n; H.Audio.click(); }
    var k = I.num(); if (k && k <= n) { this.sel = k - 1; this.fire(); return; }
    if (I.confirmPressed()) this.fire();
  };
  Menu.prototype.fire = function () { var it = this.items[this.sel]; if (it && !it.disabled) { H.Audio.select(); it.cb(); } };
  Menu.prototype.draw = function (ctx) {
    var self = this;
    this.items.forEach(function (it, i) {
      var by = self.y + i * (self.h + self.gap);
      if (UI.hit(self.x, by, self.w, self.h) && H.Input.mouse.x > 0) self.sel = i;
      UI.button(ctx, self.x, by, self.w, self.h, it.label, (function (idx) { return function () { self.sel = idx; if (!it.disabled) { H.Audio.select(); it.cb(); } }; })(i), { selected: self.sel === i, disabled: it.disabled, size: it.size || 22 });
    });
  };

  function bgGradient(ctx, c1, c2) {
    var g = ctx.createLinearGradient(0, 0, 0, 720); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, 1280, 720);
  }
  function drawBgLounge(ctx, dim) {
    ctx.drawImage(H.Assets.getBG(H.Nav.L), 0, 0, 1280, 720);
    ctx.fillStyle = 'rgba(8,4,2,' + dim + ')'; ctx.fillRect(0, 0, 1280, 720);
  }
  function wrapDraw(ctx, text, x, y, w, size, lh, color, align) {
    ctx.font = H.font(size, 'normal');
    var ls = H.wrap(ctx, text, w);
    ls.forEach(function (l, i) { H.text(ctx, l, x, y + i * lh, { size: size, weight: 'normal', color: color || '#f2dfbd', align: align || 'left', outline: false }); });
    return ls.length;
  }

  // ---------------------------------------------------------------- loading
  S.loading = {
    prog: 0, t: 0, quote: null, ready: false,
    update: function (dt) {
      this.t += dt;
      if (this.ready && this.t > 0.5) { G.scene = 'title'; S.title.enter(); }
    },
    draw: function (ctx) {
      if (!this.quote) this.quote = H.pick(H.C.loadingQuotes) || { q: '', who: '' };
      bgGradient(ctx, '#1a0e07', '#3a2010');
      H.text(ctx, 'HAVANA 22', 640, 300, { size: 72, align: 'center', color: '#ffd58a' });
      H.text(ctx, H.C.title.replace(/^HAVANA 22\s*[—-]\s*/, ''), 640, 350, { size: 30, align: 'center', color: '#d9a55a' });
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; H.roundRect(ctx, 440, 410, 400, 18, 8); ctx.fill();
      ctx.fillStyle = '#e8a040'; H.roundRect(ctx, 442, 412, 396 * this.prog, 14, 6); ctx.fill();
      ctx.font = H.font(20, 'normal');
      wrapDraw(ctx, (/[„“"]/.test(this.quote.q) ? this.quote.q : '„' + this.quote.q + '“'), 640, 490, 760, 20, 28, '#f2dfbd', 'center');
      H.text(ctx, '— ' + (this.quote.who || ''), 640, 560, { size: 16, align: 'center', color: '#b89c78', outline: false });
    }
  };

  // ---------------------------------------------------------------- title
  S.title = {
    menu: null, quote: null, t: 0,
    enter: function () {
      var self = this; this.t = 0; this.quote = H.pick(H.C.loadingQuotes) || null;
      var hasSave = H.Game.hasSave(), sv = H.Save.load() || {};
      var items = [];
      this.confirmNew = false; this.confirmIdx = -1;
      // with a save present, "Nova igra" needs a second press: it wipes the saved run
      items.push({ label: hasSave ? 'Nova igra' : 'Igraj', cb: function () {
        if (!hasSave || self.confirmNew) { H.Game.newGame(); return; }
        self.confirmNew = true; self.confirmT = 4.5; self.confirmIdx = self.menu.sel;
        self.menu.items[self.confirmIdx].label = 'Sigurno? Briše spremljenu igru'; self.menu.items[self.confirmIdx].size = 18;
      } });
      if (hasSave) items.unshift({ label: 'Nastavi (Noć ' + (sv.night > 5 ? 'Petak #' + (sv.night - 5) : sv.night) + ')', cb: function () { H.Game.continueGame(); } });
      if (G.finaleSeen || (sv.finaleSeen)) items.push({ label: 'Petak navečer (beskonačno)', cb: function () {
        var s = H.Save.load() || {}; G.cash = s.cash || G.cash; G.upgrades = s.upgrades || G.upgrades; G.recalcMods(); G.rating = 4.5; H.Game.startNight(Math.max(6, (s.night > 5 ? s.night : 6))); } });
      items.push({ label: H.Audio.isMuted() ? 'Zvuk: isključen' : 'Zvuk: uključen', cb: function () { H.Audio.toggleMute(); self.enter(); } });
      this.menu = new Menu(items, 470, 430, 340, 50, 12);
      if (!H.Audio.isMuted()) H.Audio.startMusic();
    },
    update: function (dt) {
      this.t += dt;
      if (this.menu) this.menu.update();
      UI.processClicks();
      if (this.confirmNew) {   // the confirm expires after a few seconds or when the selection moves away
        this.confirmT -= dt;
        if (this.confirmT <= 0 || (this.menu && this.menu.sel !== this.confirmIdx)) {
          this.confirmNew = false;
          var it = this.menu && this.menu.items[this.confirmIdx]; if (it) { it.label = 'Nova igra'; it.size = 22; }
          this.confirmIdx = -1;
        }
      }
    },
    draw: function (ctx) {
      var im = H.Assets.bgImage('title');
      if (im) { ctx.drawImage(im, 0, 0, 1280, 720); }
      else {
        drawBgLounge(ctx, 0.55);
        H.text(ctx, 'HAVANA 22', 640, 210, { size: 96, align: 'center', color: '#ffd58a', lw: 10 });
        H.text(ctx, '— Večernja smjena —', 640, 270, { size: 40, align: 'center', color: '#f2c27a', lw: 8 });
        H.text(ctx, H.C.tagline, 640, 320, { size: 20, align: 'center', color: '#d9c0a0', weight: 'normal', outline: true });
      }
      // menu panel
      UI.panel(ctx, 440, 400, 400, this.menu ? this.menu.items.length * 62 + 34 : 200, { fill: 'rgba(18,9,4,0.72)' });
      if (this.menu) this.menu.draw(ctx);
      if (this.quote) {
        ctx.font = H.font(16, 'normal');
        H.text(ctx, '„' + this.quote.q + '“ — ' + this.quote.who, 640, 700, { size: 16, align: 'center', color: '#e0c8a0', weight: 'normal', lw: 4 });
      }
      H.text(ctx, 'WASD/strelice: hodanje   E/Space: interakcija   Q: viči   Esc: pauza   M: zvuk', 640, 676, { size: 14, align: 'center', color: '#c8a878', weight: 'normal', lw: 4 });
      if (G.endlessBest) H.text(ctx, 'Rekord Petak navečer: ' + G.endlessBest, 1260, 30, { size: 16, align: 'right', color: '#ffd58a' });
    }
  };

  // ---------------------------------------------------------------- night intro
  S.intro = {
    n: 1, nd: null, t: 0, menu: null,
    enter: function (n, nd) { this.n = n; this.nd = nd; this.t = 0; },
    update: function (dt) {
      this.t += dt;
      if (this.t > 0.4 && (H.Input.confirmPressed())) { H.Audio.select(); H.Game.beginPlay(); }
      if (H.Input.escPressed()) H.Game.toTitle();
      UI.processClicks();
    },
    draw: function (ctx) {
      var nd = this.nd, a = H.clamp(this.t / 0.6, 0, 1);
      drawBgLounge(ctx, 0.78);
      ctx.save(); ctx.globalAlpha = a;
      var endless = this.n > 5;
      H.text(ctx, endless ? 'PETAK NAVEČER #' + (this.n - 5) : 'NOĆ ' + this.n, 640, 190, { size: 26, align: 'center', color: '#d9a55a' });
      H.text(ctx, nd.title, 640, 260, { size: 60, align: 'center', color: '#ffe9b8', lw: 9 });
      wrapDraw(ctx, nd.intro, 640, 330, 800, 24, 32, '#f2dfbd', 'center');
      UI.panel(ctx, 320, 424, 640, 180, { fill: 'rgba(18,9,4,0.7)' });
      H.text(ctx, 'Radno vrijeme 16:00 – 22:00', 640, 458, { size: 19, align: 'center', color: '#ffe9b8', outline: false });
      var gy = 494;
      if (endless || !(G.goal > 0)) {
        H.text(ctx, 'Nema cilja', 640, gy, { size: 26, align: 'center', color: '#ffe36a', outline: false });
        if (nd.goalText) { ctx.font = H.font(15, 'normal'); H.wrap(ctx, nd.goalText, 600).slice(0, 2).forEach(function (l, i) { H.text(ctx, l, 640, gy + 24 + i * 19, { size: 15, align: 'center', color: '#d9c0a0', outline: false, weight: 'normal' }); }); }
      } else {
        H.text(ctx, 'Cilj: ' + H.money(G.goal) + ' zarade', 640, gy, { size: 26, align: 'center', color: '#ffe36a', outline: false });
        if (nd.goalText) H.text(ctx, nd.goalText, 640, gy + 24, { size: 15, align: 'center', color: '#d9c0a0', outline: false, weight: 'normal' });
      }
      var mt = nd.modifier || '';
      if (nd.modifierName || mt) {
        ctx.font = H.font(16, 'normal');
        var ml = H.wrap(ctx, (nd.modifierName && mt.toLowerCase().indexOf(nd.modifierName.toLowerCase()) !== 0 ? nd.modifierName + ': ' : '') + mt, 600).slice(0, 2);
        ml.forEach(function (l, i) { H.text(ctx, l, 640, 552 + i * 19, { size: 16, align: 'center', color: '#8affc0', outline: false, weight: 'normal' }); });
      }
      if (nd.bonusGoal && nd.bonusGoal.text) {
        ctx.font = H.font(15, 'normal');
        var bt = (/^bonus/i.test(nd.bonusGoal.text) ? '' : 'Bonus: ') + nd.bonusGoal.text + (nd.bonusGoal.reward && nd.bonusGoal.reward.cash ? ' (+' + H.money(nd.bonusGoal.reward.cash) + ')' : '');
        H.text(ctx, H.wrap(ctx, bt, 600)[0], 640, 594, { size: 15, align: 'center', color: '#d9a55a', outline: false, weight: 'normal' });
      }
      var pulse = 0.6 + 0.4 * Math.sin(this.t * 4);
      ctx.fillStyle = 'rgba(8,4,2,0.62)'; H.roundRect(ctx, 400, 634, 480, 40, 12); ctx.fill();
      ctx.globalAlpha = a * pulse; H.text(ctx, 'Pritisni E / Space za početak smjene', 640, 660, { size: 22, align: 'center', color: '#fff0cf' });
      ctx.restore();
      UI.regions.push({ x: 0, y: 0, w: 1280, h: 720, cb: function () { if (S.intro.t > 0.4) H.Game.beginPlay(); } });
    }
  };

  // ---------------------------------------------------------------- summary
  S.summary = {
    menu: null, t: 0,
    enter: function () {
      var s = G.summary; this.t = 0;
      this.menu = new Menu([{ label: s.passed ? 'Dalje ▶' : 'Ponovi noć', cb: function () { H.Game.afterSummary(); } }], 490, 646, 300, 50, 10);
    },
    update: function (dt) { this.t += dt; this.menu.update(); UI.processClicks(); },
    draw: function (ctx) {
      var s = G.summary; if (!s) return;
      drawBgLounge(ctx, 0.85);
      UI.panel(ctx, 300, 14, 680, 692);
      H.text(ctx, s.endless ? 'PETAK #' + (s.night - 5) + ' — kraj smjene' : 'NOĆ ' + s.night + ' — kraj smjene', 640, 62, { size: 30, align: 'center', color: '#ffd58a' });
      H.text(ctx, s.endless ? 'Petak preživljen' : (s.passed ? 'CILJ OSTVAREN' : (s.ratingFail ? 'Ocjena pala ispod ' + s.goalStars.toFixed(1).replace('.', ',') + ' — ponovi noć' : 'Cilj nije ostvaren — ponovi noć')), 640, 92, { size: 17, align: 'center', color: s.passed ? '#8aff9a' : '#ff8a7a', outline: false });
      var y = 138, st = s.stats;
      function row(label, val, col) {
        H.text(ctx, label, 350, y, { size: 20, color: '#e8d4b0', outline: false, weight: 'normal' });
        H.text(ctx, val, 930, y, { size: 20, align: 'right', color: col || '#ffe9b8', outline: false }); y += 27;
      }
      row('Prodaja', H.money(st.sales)); row('Napojnice i bonusi', H.money(st.tips)); row('Trošak robe', '−' + H.money(st.costs), '#ff9a7a');
      ctx.fillStyle = '#9a6030'; ctx.fillRect(350, y - 20, 580, 2); y += 4;
      row('ZARADA', H.money(s.profit), s.passed ? '#8aff9a' : '#ff8a7a');
      if (s.goal > 0) row('Cilj', H.money(s.goal), '#d9a55a');
      if (s.bonus) {
        ctx.font = H.font(16, 'normal');
        var bl = H.wrap(ctx, (/^bonus/i.test(s.bonus.text) ? '' : 'Bonus: ') + s.bonus.text, 400)[0];
        H.text(ctx, bl, 350, y, { size: 16, color: s.bonus.got ? '#8affc0' : '#8a7a6a', outline: false, weight: 'normal' });
        H.text(ctx, s.bonus.got ? '+' + H.money(s.bonus.cash) : 'nije', 930, y, { size: 18, align: 'right', color: s.bonus.got ? '#8aff9a' : '#8a7a6a', outline: false }); y += 27;
      }
      y += 4;
      row('Posluženi gosti', String(st.served)); row('Savršeno zapaljeno', String(st.perfect)); row('Spojevi cigara + pića', String(st.pairings));
      row('Ljuti gosti', String(st.angry), st.angry ? '#ff9a7a' : '#ffe9b8');
      row('Ocjena' + (s.goalStars > 0 && !s.endless ? ' (treba ≥ ' + s.goalStars.toFixed(1).replace('.', ',') + ')' : ''), s.ratingStart.toFixed(1).replace('.', ',') + ' → ' + s.ratingEnd.toFixed(1).replace('.', ',') + ' ★', s.ratingFail ? '#ff8a7a' : null);
      y += 2;
      var lh = 22;
      if (s.joke) { var n1 = wrapDraw(ctx, (/[„“"]/.test(s.joke) ? s.joke : '„' + s.joke + '“'), 640, y + 6, 580, 17, lh, '#d9c0a0', 'center'); y += n1 * lh + 12; }
      if (s.outro) { var n2 = wrapDraw(ctx, s.outro, 640, y + 6, 580, 17, lh, '#c8a878', 'center'); y += n2 * lh + 6; }
      if (s.outro2) { var n3 = wrapDraw(ctx, s.outro2, 640, y + 6, 580, 17, lh, s.passed ? '#a8d8a8' : '#d8a898', 'center'); y += n3 * lh + 6; }
      if (s.newAch && s.newAch.length) {
        ctx.font = H.font(15, 'normal');
        var al = H.wrap(ctx, 'Postignuća: ' + s.newAch.join(' · '), 600).slice(0, 3);
        var ay = Math.min(y + 12, 646 - al.length * 20 - 6);
        al.forEach(function (l, i) { H.text(ctx, l, 640, ay + i * 20, { size: 15, weight: 'normal', align: 'center', color: '#8affc0', outline: false }); });
      }
      this.menu.draw(ctx);
    }
  };

  // ---------------------------------------------------------------- upgrade shop
  var ROWS = 8;
  S.shop = {
    menu: null, sel: 0, t: 0, msg: '',
    enter: function () { this.t = 0; this.msg = ''; this.sel = 0; },
    list: function () {
      var nn = G.night + 1;
      return H.C.upgrades.filter(function (u) { return !(u.minNight > nn) || G.upgrades[u.id]; });
    },
    buy: function (u) {
      if (G.upgrades[u.id]) { this.msg = 'Već imaš: ' + u.name; return; }
      if (G.cash < u.cost) { this.msg = 'Nemaš dovoljno novca.'; H.Audio.bad(); return; }
      G.cash -= u.cost; G.upgrades[u.id] = true; G.recalcMods(); H.Audio.cash(); this.msg = 'Kupljeno: ' + u.name;
      G.count('upgradesBought');
      try { if (H.Events && H.Events.trigger) H.Events.trigger('upgrade', u.id); } catch (e) { }
      G.save(G.night + 1, true);
    },
    update: function (dt) {
      this.t += dt; var I = H.Input, ups = this.list(), n = ups.length;
      if (this.sel > n) this.sel = n;
      if (I.upPressed()) { this.sel = (this.sel + n) % (n + 1); H.Audio.click(); }
      if (I.downPressed()) { this.sel = (this.sel + 1) % (n + 1); H.Audio.click(); }
      if (I.leftPressed() && this.sel < n && this.sel >= ROWS) { this.sel -= ROWS; H.Audio.click(); }
      else if (I.rightPressed() && this.sel < n - ROWS) { this.sel += ROWS; H.Audio.click(); }
      var k = I.num(); if (k && k <= n && k <= 9) { this.sel = k - 1; this.buy(ups[k - 1]); }
      if (I.confirmPressed()) { if (this.sel < n) this.buy(ups[this.sel]); else { H.Game.nextNight(); } }
      UI.processClicks();
    },
    draw: function (ctx) {
      drawBgLounge(ctx, 0.85);
      UI.panel(ctx, 100, 24, 1080, 672);
      H.text(ctx, 'Nadogradnje', 640, 72, { size: 32, align: 'center', color: '#ffd58a' });
      H.text(ctx, 'Novac: ' + H.money(G.cash), 640, 104, { size: 21, align: 'center', color: '#ffe36a', outline: false });
      var ups = this.list(), self = this, rw = 500, rh = 60, gx = 30, x0 = 640 - rw - gx / 2, y0 = 126;
      ups.forEach(function (u, i) {
        var col = Math.floor(i / ROWS), row = i % ROWS, x = x0 + col * (rw + gx), y = y0 + row * rh;
        var owned = !!G.upgrades[u.id], can = G.cash >= u.cost, hov = UI.hit(x, y, rw, rh - 6) || self.sel === i;
        ctx.fillStyle = owned ? 'rgba(80,160,90,0.25)' : (hov ? 'rgba(200,120,50,0.35)' : 'rgba(255,255,255,0.06)'); H.roundRect(ctx, x, y, rw, rh - 6, 8); ctx.fill();
        if (hov) { ctx.strokeStyle = '#ffd58a'; ctx.lineWidth = 2; ctx.stroke(); }
        if (i < 9) H.text(ctx, String(i + 1), x + 20, y + 33, { size: 20, align: 'center', color: '#ffd58a', outline: false });
        H.text(ctx, u.name, x + 42, y + 21, { size: 18, color: '#fff0cf', outline: false });
        H.text(ctx, owned ? 'KUPLJENO' : H.money(u.cost), x + rw - 12, y + 21, { size: 18, align: 'right', color: owned ? '#8aff9a' : (can ? '#ffe36a' : '#8a7a6a'), outline: false });
        ctx.font = H.font(13, 'normal');
        H.wrap(ctx, u.desc || '', rw - 58).slice(0, 2).forEach(function (l, j) { H.text(ctx, l, x + 42, y + 38 + j * 14, { size: 13, color: '#b89c78', outline: false, weight: 'normal' }); });
        UI.regions.push({ x: x, y: y, w: rw, h: rh - 6, cb: function () { self.sel = i; self.buy(u); } });
      });
      H.text(ctx, this.msg, 640, 636, { size: 18, align: 'center', color: '#ffd58a', outline: false });
      var sel = this.sel === ups.length;
      UI.button(ctx, 470, 646, 340, 40, 'Sljedeća noć ▶', function () { H.Game.nextNight(); }, { selected: sel, size: 20 });
    }
  };

  // ---------------------------------------------------------------- fail
  S.fail = {
    menu: null, t: 0, kind: 'smoke',
    enter: function (kind) {
      this.kind = kind; this.t = 0;
      var items = [];
      if (!G.endless) items.push({ label: 'Ponovi noć', cb: function () { H.Game.retryNight(); } });
      items.push({ label: 'Naslovnica', cb: function () { H.Game.toTitle(); } });
      this.menu = new Menu(items, 490, 500, 300, 52, 12);
      H.Audio.stopMusic(); setTimeout(function () { if (G.scene === 'fail') H.Audio.startMusic(); }, 2500);
    },
    update: function (dt) { this.t += dt; if (this.t > 0.6) this.menu.update(); UI.processClicks(); },
    draw: function (ctx) {
      drawBgLounge(ctx, 0.88);
      ctx.fillStyle = 'rgba(120,10,0,' + (0.25 + 0.12 * Math.sin(this.t * 6)) + ')'; ctx.fillRect(0, 0, 1280, 720);
      var smoke = this.kind === 'smoke';
      H.text(ctx, (smoke ? H.C.endings.fail_smokeTitle : H.C.endings.fail_starsTitle) || (smoke ? 'INSPEKCIJA' : 'NULA ZVJEZDICA'), 640, 190, { size: 70, align: 'center', color: '#ff8a70', lw: 10 });
      wrapDraw(ctx, smoke ? H.C.endings.fail_smoke : H.C.endings.fail_stars, 640, 260, 760, 26, 34, '#f2dfbd', 'center');
      if (G.endless) H.text(ctx, 'Petaka preživljeno: ' + Math.max(0, G.night - 6) + '   Rekord: ' + G.endlessBest, 640, 420, { size: 22, align: 'center', color: '#ffd58a' });
      this.menu.draw(ctx);
    }
  };

  // ---------------------------------------------------------------- finale cutscene (HOW - The Hospitality Spark)
  S.finale = {
    t: 0, page: 0, chars: 0, lines: [], phase: 'talk', ct: 0,
    enter: function () {
      var E = H.C.endings;
      this.t = 0; this.page = 0; this.chars = 0; this.phase = 'talk'; this.ct = 0;
      this.lines = E.finaleScript.length ? E.finaleScript.slice() : E.finale.map(function (l) { return { who: 'hrvoje', text: l }; });
      this.lines.push({ who: 'narrator', text: E.win });
      H.Audio.applause();
    },
    update: function (dt) {
      this.t += dt; this.chars += dt * 45;
      if (this.phase === 'credits') {
        this.ct += dt;
        if (this.ct > 0.8 && (H.Input.confirmPressed() || UI.processClicks())) { G.finaleSeen = true; G.stats.nightsPassed = 5; G.count('finale'); H.Achv.check('finale'); H.Game.goShop(); }
        UI.regions.push({ x: 0, y: 0, w: 1280, h: 720, cb: function () { H.Input.fakePress('KeyE'); } });
        return;
      }
      var cur = (this.lines[this.page] || {}).text || '';
      if (H.Input.confirmPressed() || UI.processClicks()) {
        if (this.chars < cur.length) this.chars = cur.length;
        else if (this.page < this.lines.length - 1) { this.page++; this.chars = 0; if (this.page === this.lines.length - 1) H.Audio.applause(); }
        else { this.phase = 'credits'; this.ct = 0; }
      }
      UI.regions.push({ x: 0, y: 0, w: 1280, h: 720, cb: function () { H.Input.fakePress('KeyE'); } });
    },
    draw: function (ctx) {
      var t = this.t;
      bgGradient(ctx, '#0a0710', '#1c1020');
      // stage
      ctx.fillStyle = '#2a1a12'; ctx.fillRect(160, 420, 960, 120);
      ctx.fillStyle = '#4a2e1c'; ctx.fillRect(160, 420, 960, 14);
      // backdrop screen
      ctx.fillStyle = '#10182c'; ctx.fillRect(300, 90, 680, 300);
      ctx.strokeStyle = '#b87a3a'; ctx.lineWidth = 6; ctx.strokeRect(300, 90, 680, 300);
      var g2 = ctx.createLinearGradient(300, 90, 980, 390); g2.addColorStop(0, '#173a6a'); g2.addColorStop(1, '#0c1830');
      ctx.fillStyle = g2; ctx.fillRect(306, 96, 668, 288);
      H.text(ctx, 'HOW', 640, 220, { size: 90, align: 'center', color: '#ffd58a', lw: 8 });
      H.text(ctx, 'The Hospitality Spark', 640, 275, { size: 34, align: 'center', color: '#f2c27a', lw: 6 });
      H.text(ctx, 'Hrvoje Koštić • Havana 22 Cigar Lounge', 640, 330, { size: 18, align: 'center', color: '#b89c78', weight: 'normal', lw: 4 });
      // spotlight cone
      var sg = ctx.createRadialGradient(640, 380, 10, 640, 470, 200); sg.addColorStop(0, 'rgba(255,230,170,0.55)'); sg.addColorStop(1, 'rgba(255,230,170,0)');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(600, 40); ctx.lineTo(680, 40); ctx.lineTo(820, 540); ctx.lineTo(460, 540); ctx.closePath(); ctx.fill();
      // podium + Hrvoje
      ctx.fillStyle = '#3a2416'; ctx.fillRect(740, 440, 70, 70); ctx.fillStyle = '#c99a5a'; ctx.fillRect(740, 440, 70, 6);
      H.Assets.drawChar(ctx, 'hrvoje', Math.floor(t / 2.4) % 2 === 0 ? 'smoke' : 'walk_down', 0, 640, 505, { scale: 1.6 });
      // smoke wisps
      for (var i = 0; i < 6; i++) { var k = ((t * 0.3 + i / 6) % 1); ctx.fillStyle = 'rgba(220,210,200,' + (0.25 * (1 - k)) + ')'; ctx.beginPath(); ctx.arc(660 + Math.sin(t + i) * 14 + k * 20, 400 - k * 90, 8 + k * 14, 0, 6.3); ctx.fill(); }
      // audience (the regulars, seen from behind)
      var cast = ['roko', 'mislav', 'matija', 'tomislav', 'guest1', 'guest2', 'guest3', 'guest4'];
      cast.forEach(function (id, idx) {
        var ax = (idx < 4 ? 130 + idx * 140 : 730 + (idx - 4) * 140), ay = 562 + ((idx % 2) ? 0 : 6) + Math.sin(t * 3 + idx) * 2;   // above the caption panel (y 580+), gap in the middle so nobody hides Hrvoje
        H.Assets.drawChar(ctx, id, 'sit_up', 0, ax, ay, { scale: 1.25 });
        if (idx % 3 === 1) { ctx.fillStyle = 'rgba(255,255,255,' + (0.5 + 0.4 * Math.sin(t * 5 + idx)) + ')'; ctx.fillRect(ax + 14, ay - 52, 8, 12); } // phone light
      });
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 618, 1280, 102);
      if (this.phase === 'credits') { this.drawCredits(ctx); return; }
      // caption
      var pg = this.lines[this.page] || { who: 'narrator', text: '' }, cur = pg.text, talk = pg.who !== 'narrator';
      UI.panel(ctx, 120, 580, 1040, 128, { fill: 'rgba(14,7,3,0.94)' });
      var tx = 160, tw = 960;
      if (talk) { H.Assets.drawPortrait(ctx, pg.who === 'hrvoje' ? 'hrvoje' : pg.who, 'neutral', 132, 588, 112, 112); tx = 270; tw = 860; }
      ctx.font = H.font(22, 'normal');
      var shown = cur.substr(0, Math.floor(this.chars));
      H.wrap(ctx, shown, tw).slice(0, 3).forEach(function (l, i) { H.text(ctx, l, tx, 622 + i * 29, { size: 22, weight: 'normal', color: talk ? '#fff0cf' : '#b8c8e8', outline: false }); });
      H.text(ctx, 'E / Space ▶', 1140, 698, { size: 14, align: 'right', color: '#b89c78', outline: false });
    },
    drawCredits: function (ctx) {
      var E = H.C.endings, t = this.ct;
      ctx.fillStyle = 'rgba(6,3,10,' + Math.min(1, t * 1.2) + ')'; ctx.fillRect(0, 0, 1280, 720);
      var a = Math.min(1, t * 0.8);
      ctx.globalAlpha = a;
      H.text(ctx, E.winTitle || 'Kraj', 640, 200, { size: 54, align: 'center', color: '#ffd58a', lw: 8 });
      var lines = E.credits.length ? E.credits : ['HAVANA 22 — Večernja smjena'];
      lines.forEach(function (l, i) { H.text(ctx, l, 640, 290 + i * 42, { size: i === 0 ? 30 : 21, weight: i === 0 ? 'bold' : 'normal', align: 'center', color: i === 0 ? '#f2c27a' : '#d9c0a0', outline: false }); });
      H.text(ctx, 'E / Space ▶', 640, 660, { size: 15, align: 'center', color: '#b89c78', outline: false });
      ctx.globalAlpha = 1;
    }
  };

  // ---------------------------------------------------------------- pause
  S.pause = {
    menu: null,
    enter: function () {
      var self = this;
      this.menu = new Menu([
        { label: 'Nastavi', cb: function () { G.paused = false; } },
        { label: H.Audio.isMuted() ? 'Zvuk: isključen' : 'Zvuk: uključen', cb: function () { H.Audio.toggleMute(); self.enter(); self.menu.sel = 1; } },
        { label: 'Ponovi noć', cb: function () { G.paused = false; H.Game.retryNight(); } },
        { label: 'Naslovnica', cb: function () { G.paused = false; H.Game.toTitle(); } }
      ], 490, 260, 300, 52, 12);
    },
    update: function (dt) {
      if (H.Input.escPressed()) { G.paused = false; return; }
      this.menu.update(); UI.processClicks();
    },
    draw: function (ctx) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, 1280, 720);
      UI.panel(ctx, 440, 150, 400, 420);
      H.text(ctx, 'PAUZA', 640, 210, { size: 36, align: 'center', color: '#ffd58a' });
      this.menu.draw(ctx);
      H.text(ctx, 'Esc = nastavi', 640, 545, { size: 14, align: 'center', color: '#a89070', outline: false });
    }
  };
})();
