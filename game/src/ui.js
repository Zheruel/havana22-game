// ui.js - HUD, speech/order bubbles, banners, and the modal windows (menus, dialogue, lighting minigame, photo).
(function () {
  'use strict';
  var H = window.H;

  var UI = H.UI = { regions: [], modal: null, lightingFor: null, hoverCb: null };

  // ---------------------------------------------------------------- generic widgets
  UI.beginFrame = function () { UI.regions = []; };
  UI.processClicks = function () {
    var cl = H.Input.takeClicks(), used = false;
    for (var i = 0; i < cl.length; i++) {
      for (var j = UI.regions.length - 1; j >= 0; j--) {
        var r = UI.regions[j];
        if (cl[i].x >= r.x && cl[i].x <= r.x + r.w && cl[i].y >= r.y && cl[i].y <= r.y + r.h) { H.Audio.click(); r.cb(); used = true; break; }
      }
    }
    return used;
  };
  UI.hit = function (x, y, w, h) { var m = H.Input.mouse; return m.x >= x && m.x <= x + w && m.y >= y && m.y <= y + h; };
  UI.panel = function (ctx, x, y, w, h, o) {
    o = o || {};
    ctx.save();
    ctx.fillStyle = o.fill || 'rgba(26,14,7,0.92)'; H.roundRect(ctx, x, y, w, h, o.r || 12); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = o.stroke || '#b87a3a'; ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,214,150,0.25)'; H.roundRect(ctx, x + 4, y + 4, w - 8, h - 8, (o.r || 12) - 3); ctx.stroke();
    ctx.restore();
  };
  UI.button = function (ctx, x, y, w, h, label, cb, o) {
    o = o || {};
    var hov = UI.hit(x, y, w, h) || o.selected;
    ctx.save();
    ctx.fillStyle = o.disabled ? '#3a2a20' : (hov ? '#9a5a2a' : '#6b3a1e'); H.roundRect(ctx, x, y, w, h, 9); ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = hov ? '#ffd58a' : '#b87a3a'; ctx.stroke();
    ctx.restore();
    H.text(ctx, label, x + w / 2, y + h / 2 + (o.size || 20) * 0.35, { size: o.size || 20, align: 'center', color: o.disabled ? '#8a7a6a' : '#ffe9b8', outline: false });
    if (cb && !o.disabled) UI.regions.push({ x: x, y: y, w: w, h: h, cb: cb });
  };

  // ---------------------------------------------------------------- bubbles
  UI.speech = function (ctx, text, x, y, o) {
    o = o || {};
    ctx.save();
    ctx.font = H.font(o.size || 15);
    var lines = H.wrap(ctx, text, o.maxW || 230), lh = (o.size || 15) + 4, w = 0;
    lines.forEach(function (l) { w = Math.max(w, ctx.measureText(l).width); });
    var bw = w + 18, bh = lines.length * lh + 12;
    var bx = H.clamp(x - bw / 2, 8, H.W - bw - 8), by = Math.max(58, y - bh - 10);
    // keep speech bubbles from stacking on top of each other (nudge up past any bubble already drawn this frame)
    var placed = UI.bubRects || (UI.bubRects = []);
    for (var pass = 0; pass < 5; pass++) {
      var hit = null;
      for (var pi = 0; pi < placed.length; pi++) { var q = placed[pi]; if (bx < q.x + q.w && bx + bw > q.x && by < q.y + q.h && by + bh > q.y) { hit = q; break; } }
      if (!hit) break;
      by = hit.y - bh - 5; if (by < 58) { by = 58; break; }
    }
    placed.push({ x: bx, y: by, w: bw, h: bh });
    ctx.fillStyle = o.fill || 'rgba(255,246,226,0.96)'; H.roundRect(ctx, bx, by, bw, bh, 9); ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = o.stroke || '#3a2210'; ctx.stroke();
    var tx = H.clamp(x, bx + 12, bx + bw - 12);
    ctx.fillStyle = o.fill || 'rgba(255,246,226,0.96)';
    ctx.beginPath(); ctx.moveTo(tx - 6, by + bh - 1); ctx.lineTo(tx + 6, by + bh - 1); ctx.lineTo(tx, by + bh + 8); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = o.stroke || '#3a2210'; ctx.beginPath(); ctx.moveTo(tx - 6, by + bh); ctx.lineTo(tx, by + bh + 8); ctx.lineTo(tx + 6, by + bh); ctx.stroke();
    ctx.fillStyle = o.color || '#2a1608'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    lines.forEach(function (l, i) { ctx.fillText(l, bx + 9, by + 6 + (i + 1) * lh - 4); });
    ctx.restore();
    return by;
  };

  function iconOf(id) { var it = H.C.itemById[id]; return it ? it.icon : id; }
  UI.orderBubbleTop = function (c) { return c.y - (c.isSeated() ? 106 : 118); };

  UI.drawOrderBubble = function (ctx, c, G) {
    var st = c.state, x = c.x, y = UI.orderBubbleTop(c);
    if (st === 'ordering') {
      var items = [];
      if (c.order.cigar) items.push({ id: c.order.cigar, done: c.got.cigar });
      if (c.order.drink) items.push({ id: c.order.drink, done: c.got.drink });
      var w = items.length * 34 + 12, h = 46;
      var bx = x - w / 2, by = y - h;
      ctx.save();
      ctx.fillStyle = 'rgba(255,246,226,0.95)'; H.roundRect(ctx, bx, by, w, h, 9); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#3a2210'; ctx.stroke();
      ctx.restore();
      items.forEach(function (it, i) {
        var ix = bx + 6 + 17 + i * 34;
        H.Assets.drawIcon(ctx, iconOf(it.id), ix, by + 20, 30, it.done ? 0.28 : 1);
        if (it.done) H.text(ctx, '✓', ix, by + 28, { size: 22, align: 'center', color: '#5aff7a' });
      });
      // patience bar
      var pf = H.clamp(c.pat / c.patMax, 0, 1);
      ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(bx + 5, by + h - 8, w - 10, 5);
      ctx.fillStyle = pf > 0.5 ? '#6adf5a' : (pf > 0.25 ? '#e8c030' : '#e84a30'); ctx.fillRect(bx + 5, by + h - 8, (w - 10) * pf, 5);
      if (c.frozen > 0) H.text(ctx, 'Zzz', x, by - 4, { size: 16, align: 'center', color: '#9ad0ff' });
    } else if (st === 'needLight') {
      var pulse = 1 + Math.sin(G.t * 8) * 0.12;
      ctx.save();
      ctx.fillStyle = 'rgba(255,246,226,0.95)'; H.roundRect(ctx, x - 24, y - 44, 48, 44, 9); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#3a2210'; ctx.stroke(); ctx.restore();
      H.Assets.drawIcon(ctx, 'lighter', x, y - 22, 34 * pulse);
      var pf2 = H.clamp(c.pat / c.patMax, 0, 1);
      ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(x - 20, y - 8, 40, 4);
      ctx.fillStyle = pf2 > 0.5 ? '#6adf5a' : (pf2 > 0.25 ? '#e8c030' : '#e84a30'); ctx.fillRect(x - 20, y - 8, 40 * pf2, 4);
    } else if (st === 'smoking' && !c.noSmoke) {
      var k = H.clamp(c.smokeLeft / Math.max(1, c.smokeTotal), 0, 1);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x - 22, y - 8, 44, 6);
      ctx.fillStyle = '#e8a040'; ctx.fillRect(x - 22, y - 8, 44 * k, 6);
    }
  };

  // a broken armchair: darkened seat, slanted splintered planks, hazard tape and a 'KRAK' tag (so it reads as out of order at a glance)
  UI.drawBrokenSeat = function (ctx, s, G, over) {   // over=false: the seat itself (drawn under the guests); over=true: the tag above everything
    var cx = s.x, cy = s.y - 22, wob = Math.sin(G.t * 2 + s.x) * 0.02;
    if (over) { H.text(ctx, 'KRAK', cx, cy + 58, { size: 15, align: 'center', color: '#ff8a5a', lw: 4 }); H.Assets.drawIcon(ctx, 'warning', cx, cy - 44, 24); return; }
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(18,8,4,0.5)'; H.roundRect(ctx, -40, -30, 80, 60, 10); ctx.fill();
    // debris planks
    ctx.rotate(-0.28 + wob);
    ctx.fillStyle = '#5a3418'; ctx.fillRect(-32, -6, 46, 10); ctx.fillStyle = '#8a5a2a'; ctx.fillRect(-32, -6, 46, 3);
    ctx.fillStyle = '#3a200e'; ctx.fillRect(-14, 6, 34, 8);
    ctx.rotate(0.28 - wob);
    ctx.save(); ctx.rotate(0.6); ctx.fillStyle = '#6a4222'; ctx.fillRect(-4, -26, 8, 34); ctx.fillStyle = '#c9a070'; ctx.fillRect(-4, -26, 8, 3); ctx.restore();
    ctx.fillStyle = '#c9a070'; [[-22, 14], [18, -14], [26, 10], [-8, -18]].forEach(function (p) { ctx.fillRect(p[0], p[1], 5, 3); });
    // hazard tape
    ctx.save(); ctx.rotate(-0.5); ctx.beginPath(); ctx.rect(-46, -5, 92, 10); ctx.clip();
    ctx.fillStyle = '#f2c230'; ctx.fillRect(-46, -5, 92, 10); ctx.fillStyle = '#20140a';
    for (var k = -48; k < 48; k += 14) { ctx.beginPath(); ctx.moveTo(k, -5); ctx.lineTo(k + 7, -5); ctx.lineTo(k + 2, 5); ctx.lineTo(k - 5, 5); ctx.closePath(); ctx.fill(); }
    ctx.restore(); ctx.restore();
  };

  // ---------------------------------------------------------------- world overlays (bubbles, prompts, labels)
  UI.drawWorldOverlays = function (ctx, G) {
    var i, c;
    UI.bubRects = [];
    // spot labels
    var L = H.Nav.L, P = G.player;
    var labels = { humidor: 'Humidor', tap: 'Točeno', spirits: 'Žestice', coffee: 'Kava', vent: 'Ventilacija', wc_door: 'WC' };
    Object.keys(labels).forEach(function (k) {
      var s = L.spots && L.spots[k]; if (!s) return;
      var d = H.dist(P.x, P.y, s.x, s.y);
      var a = G.night === 1 && !G.endless ? 0.85 : H.clamp((190 - d) / 90, 0, 0.8);
      if (a <= 0.02) return;
      ctx.save(); ctx.globalAlpha = a;
      H.text(ctx, labels[k], s.x, s.y - 32 - (k === 'humidor' ? 10 : 0), { size: 14, align: 'center', color: '#ffe0a0' });
      ctx.restore();
    });
    // hidden-thing sparkles (only where an unseen easter egg is still waiting)
    if (H.Events.spotList) H.Events.spotList().forEach(function (sp) {
      var k = 0.5 + 0.5 * Math.sin(G.t * 3 + sp.x), r = 5 + 3 * k;
      ctx.save(); ctx.globalAlpha = 0.45 + 0.4 * k; ctx.fillStyle = '#bfe4ff';
      ctx.beginPath(); ctx.moveTo(sp.x, sp.y - 30 - r); ctx.lineTo(sp.x + 2, sp.y - 30 - 2); ctx.lineTo(sp.x + r, sp.y - 30); ctx.lineTo(sp.x + 2, sp.y - 30 + 2);
      ctx.lineTo(sp.x, sp.y - 30 + r); ctx.lineTo(sp.x - 2, sp.y - 30 + 2); ctx.lineTo(sp.x - r, sp.y - 30); ctx.lineTo(sp.x - 2, sp.y - 30 - 2); ctx.closePath(); ctx.fill(); ctx.restore();
    });
    // vent ring
    if (L.spots && L.spots.vent) {
      var v = L.spots.vent, cd = G.ventCd / G.mod.ventCd;
      if (G.ventFx > 0) { ctx.strokeStyle = 'rgba(160,220,255,' + (0.4 + 0.4 * Math.sin(G.t * 12)) + ')'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(v.x, v.y - 14, 26, 0, 6.3); ctx.stroke(); }
      else if (G.ventCd > 0) { ctx.strokeStyle = 'rgba(255,120,80,0.8)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(v.x, v.y - 14, 22, -Math.PI / 2, -Math.PI / 2 + 6.283 * cd); ctx.stroke(); }
      else if (G.smoke > 40) { ctx.strokeStyle = 'rgba(120,255,140,' + (0.4 + 0.4 * Math.sin(G.t * 6)) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(v.x, v.y - 14, 24, 0, 6.3); ctx.stroke(); }
    }
    // WC occupancy sign
    if (G.wcBusyT > 0 && L.spots && L.spots.wc_door) {
      var w = L.spots.wc_door;
      UI.panel(ctx, w.x - 46, w.y + 6, 92, 26, { fill: 'rgba(120,20,10,0.9)', stroke: '#ff8a70', r: 6 });
      H.text(ctx, 'ZAUZETO ' + Math.ceil(G.wcBusyT), w.x, w.y + 25, { size: 14, align: 'center', color: '#ffd0c0', outline: false });
    }
    // table items
    for (i = 0; i < G.customers.length; i++) {
      c = G.customers[i];
      if (!c.seat || !c.isSeated() || c.state === 'ordering' && !c.got.cigar && !c.got.drink) continue;
      var f = H.FVEC[c.seat.face] || [0, 1], bx = c.seat.x + f[0] * 34, by = c.seat.y - 6 + f[1] * 12;
      if (c.got.drink && c.state !== 'walkOut') H.Assets.drawIcon(ctx, iconOf(c.order.drink), bx + 8, by, 22);
      if (c.got.cigar && c.state !== 'walkOut') H.Assets.drawIcon(ctx, iconOf(c.order.cigar), bx - 8, by + 6, 22);
    }
    // broken seats
    for (i = 0; i < L.seats.length; i++) {
      var s = L.seats[i];
      if (G.brokenSeats[s.id]) UI.drawBrokenSeat(ctx, s, G, true);
    }
    // customers: name tags + bubbles
    for (i = 0; i < G.customers.length; i++) {
      c = G.customers[i]; if (c.hidden) continue;
      if (c.role !== 'guest' && c.role !== 'gamer' && !c.hideTag) H.text(ctx, c.name, c.x, c.y + 18, { size: 12, align: 'center', color: '#ffd9a0', lw: 3 });
      UI.drawOrderBubble(ctx, c, G);
      if (c.icon) { H.Assets.drawIcon(ctx, c.icon, c.x, UI.orderBubbleTop(c) - (c.state === 'ordering' ? 52 : 4), 30 + Math.sin(G.t * 9) * 3); }
      if (c.bubble) {
        var top = UI.orderBubbleTop(c) - ((c.state === 'ordering' || c.state === 'needLight') ? 54 : 0);
        UI.speech(ctx, c.bubble.text, c.x, top, { fill: c.bubbleFill });
      }
      if (c.barW != null) { // event countdown bar (baka / tirade)
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(c.x - 32, c.y - 110, 64, 15);
        ctx.fillStyle = c.barColor || '#ff6a4a'; ctx.fillRect(c.x - 30, c.y - 108, 60 * H.clamp(c.barW, 0, 1), 11);
        ctx.strokeStyle = 'rgba(255,230,190,0.85)'; ctx.lineWidth = 1.5; ctx.strokeRect(c.x - 32, c.y - 110, 64, 15);
      }
    }
    // player carry + bubble
    var items = P.carry.cigars.concat(P.carry.drinks);
    items.forEach(function (id, k) { H.Assets.drawIcon(ctx, iconOf(id), P.x + (k - (items.length - 1) / 2) * 26, P.y - 104, 28); });
    if (P.bubble) UI.speech(ctx, P.bubble.text, P.x, P.y - 116 - (items.length ? 20 : 0), { fill: 'rgba(214,236,255,0.96)' });
    // interaction prompt
    if (G.prompt && !UI.modal) {
      var pr = G.prompt, tx = pr.x, ty = pr.y;
      ctx.save(); ctx.font = H.font(15);
      var tw = ctx.measureText(pr.text).width + 22;
      var px = H.clamp(tx - tw / 2, 6, H.W - tw - 6);
      ctx.fillStyle = 'rgba(28,16,8,0.9)'; H.roundRect(ctx, px, ty - 26, tw, 26, 8); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#ffd58a'; ctx.stroke();
      ctx.fillStyle = '#fff0cf'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(pr.text, px + tw / 2, ty - 12);
      ctx.restore();
    }
    // floaters
    for (i = 0; i < G.floaters.length; i++) {
      var fl = G.floaters[i];
      ctx.save(); ctx.globalAlpha = H.clamp(fl.t / 0.5, 0, 1);
      H.text(ctx, fl.text, fl.x, fl.y - (fl.life - fl.t) * 34, { size: fl.size || 22, align: 'center', color: fl.color });
      ctx.restore();
    }
  };

  // ---------------------------------------------------------------- HUD
  var DROP = { fill: 'rgba(18,9,4,0.82)', stroke: '#9a6030' };
  UI.drawHUD = function (ctx, G) {
    var i;
    ctx.save();
    ctx.fillStyle = 'rgba(18,9,4,0.86)'; ctx.fillRect(0, 0, H.W, 52);
    ctx.fillStyle = '#9a6030'; ctx.fillRect(0, 52, H.W, 3);
    ctx.fillStyle = 'rgba(255,200,120,0.15)'; ctx.fillRect(0, 55, H.W, 1);
    // clock
    H.text(ctx, H.fmtClock(G.clock), 20, 36, { size: 32, color: '#ffe9b8' });
    H.text(ctx, G.endless ? 'PETAK #' + (G.night - 5) : 'NOĆ ' + G.night, 138, 22, { size: 13, color: '#d9a55a', outline: false });
    // clock progress
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(138, 30, 70, 5);
    ctx.fillStyle = '#e8a040'; ctx.fillRect(138, 30, 70 * H.clamp(G.clock / G.dur, 0, 1), 5);
    // cash
    H.Assets.drawIcon(ctx, 'euro', 238, 27, 26);
    H.text(ctx, H.money(G.cash), 256, 35, { size: 24, color: '#ffe36a' });
    // rating
    var sx = 380;
    for (i = 0; i < 5; i++) {
      H.Assets.drawIcon(ctx, 'star_empty', sx + i * 27, 26, 25);
      var frac = H.clamp(G.rating - i, 0, 1);
      if (frac > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(sx + i * 27 - 13, 0, 26 * frac, 60); ctx.clip();
        H.Assets.drawIcon(ctx, 'star', sx + i * 27, 26, 25); ctx.restore();
      }
    }
    var ratingLow = G.goalStars > 0 && Math.round(G.rating * 10) / 10 < G.goalStars;
    H.text(ctx, G.rating.toFixed(1).replace('.', ','), sx + 5 * 27 + 4, 34, { size: 18, color: ratingLow ? '#ff8a7a' : '#ffe9b8' });
    if (G.goalStars > 0 && !G.endless) H.text(ctx, 'treba ≥ ' + G.goalStars.toFixed(1).replace('.', ','), sx + 5 * 27 + 4, 49, { size: 11, color: ratingLow ? '#ff8a7a' : '#b89c78', outline: false });
    // smoke meter
    var mx = 636, mw = 226, ratio = H.clamp(G.smoke / 120, 0, 1);
    H.text(ctx, 'DIM', mx - 46, 33, { size: 16, color: G.smoke > 70 ? '#ff9a7a' : '#cfc0a8' });
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; H.roundRect(ctx, mx, 15, mw, 22, 6); ctx.fill();
    var gr = ctx.createLinearGradient(mx, 0, mx + mw, 0); gr.addColorStop(0, '#5ac86a'); gr.addColorStop(0.55, '#e8c030'); gr.addColorStop(1, '#e84a30');
    ctx.fillStyle = gr; H.roundRect(ctx, mx + 2, 17, Math.max(0, (mw - 4) * ratio), 18, 5); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2;
    [70, 100].forEach(function (t) { var tx = mx + mw * (t / 120); ctx.beginPath(); ctx.moveTo(tx, 12); ctx.lineTo(tx, 40); ctx.stroke(); });
    ctx.strokeStyle = G.smoke > 100 ? '#ff4a30' : '#9a6030'; ctx.lineWidth = 2; H.roundRect(ctx, mx, 15, mw, 22, 6); ctx.stroke();
    if (G.smoke > 100) H.text(ctx, 'INSPEKCIJA ' + Math.max(0, Math.ceil(10 - G.smokeOver)) + ' s', mx + mw / 2, 33, { size: 15, align: 'center', color: '#fff' });
    // vent status
    var vtxt = G.ventCd > 0 ? 'Ventilacija ' + Math.ceil(G.ventCd) + 's' : 'Ventilacija SPREMNA';
    H.text(ctx, vtxt, mx, 49, { size: 11, color: G.ventCd > 0 ? '#c08a6a' : '#8affa0', outline: false });
    // goal (endless nights have none: show the night's profit instead)
    var gx = 896, prof = G.cash - G.cashStart, goal = G.goal;
    if (goal > 0) {
      H.text(ctx, 'Cilj: ' + H.money(goal), gx, 22, { size: 14, color: prof >= goal ? '#8aff9a' : '#d9a55a', outline: false });
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; H.roundRect(ctx, gx, 28, 150, 12, 5); ctx.fill();
      ctx.fillStyle = prof >= goal ? '#5ac86a' : '#e8a040'; H.roundRect(ctx, gx + 1, 29, Math.max(0, 148 * H.clamp(prof / goal, 0, 1)), 10, 4); ctx.fill();
      H.text(ctx, H.money(Math.max(0, prof)), gx + 156, 39, { size: 13, color: '#ffe9b8', outline: false });
    } else {
      H.text(ctx, 'Zarada večeras', gx, 22, { size: 14, color: '#d9a55a', outline: false });
      H.text(ctx, H.money(prof), gx, 42, { size: 18, color: prof >= 0 ? '#ffe36a' : '#ff9a7a', outline: false });
    }
    var bg = H.C.night(G.night).bonusGoal;
    if (bg) {
      var bv = G.nightStats[bg.stat] || 0, got = bv >= bg.gte;
      H.text(ctx, 'Bonus ' + Math.min(bv, bg.gte) + '/' + bg.gte + (got ? ' ✓' : ''), gx, 51, { size: 11, color: got ? '#8aff9a' : '#b89c78', outline: false, weight: 'normal' });
    }
    // mute / pause hints
    H.text(ctx, H.Audio.isMuted() ? 'M: zvuk isklj.' : 'M: zvuk', 1272, 22, { size: 12, align: 'right', color: '#a89070', outline: false });
    H.text(ctx, 'Esc: pauza', 1272, 40, { size: 12, align: 'right', color: '#a89070', outline: false });
    ctx.restore();

    // carry panel (bottom-left): one slot per carry capacity
    var P = G.player, ncg = G.mod.carryCigar, ndr = G.mod.carryDrink, cx = 16, cy = 640, slot = 56;
    var pw = 22 + (ncg + ndr) * slot + 22;
    UI.panel(ctx, cx, cy, pw, 70, { fill: 'rgba(18,9,4,0.8)', r: 10 });
    [['cigars', 'CIGARA', ncg, cx + 12], ['drinks', 'PIĆE', ndr, cx + 22 + ncg * slot]].forEach(function (k) {
      var list = P.carry[k[0]];
      for (var si = 0; si < k[2]; si++) {
        var ix = k[3] + si * slot;
        ctx.fillStyle = 'rgba(255,255,255,0.08)'; H.roundRect(ctx, ix, cy + 8, slot - 6, 46, 8); ctx.fill();
        if (list[si]) H.Assets.drawIcon(ctx, iconOf(list[si]), ix + (slot - 6) / 2, cy + 31, 38);
      }
      H.text(ctx, k[1], k[3] + k[2] * slot / 2 - 3, cy + 66, { size: 11, align: 'center', color: '#c8a878', outline: false });
    });
    // buffs / Roko's tab
    var chx = 916, chy = 690;   // right of the entrance (the banner strip is on the left)
    (G.buffs || []).forEach(function (b) {
      var txt = b.name + ' ' + Math.ceil(b.t) + 's';
      ctx.font = H.font(14); var bw = ctx.measureText(txt).width + 18;
      ctx.fillStyle = 'rgba(20,50,36,0.85)'; H.roundRect(ctx, chx, chy - 18, bw, 24, 8); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#5adf9a'; ctx.stroke();
      H.text(ctx, txt, chx + 9, chy, { size: 14, color: '#b8ffd8', outline: false });
      chx += bw + 8;
    });
    if (G.rokoDebt > 0) {
      var dt2 = 'Roko dužan: ' + H.money(G.rokoDebt);
      ctx.font = H.font(14); var dw = ctx.measureText(dt2).width + 18;
      ctx.fillStyle = 'rgba(60,34,16,0.85)'; H.roundRect(ctx, chx, chy - 18, dw, 24, 8); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#d9a55a'; ctx.stroke();
      H.text(ctx, dt2, chx + 9, chy, { size: 14, color: '#ffd9a0', outline: false });
    }
    var hint = G.hintOverride || G.hint || (G.tipT > 0 ? G.tipMsg : '');
    if (hint) {
      ctx.save();
      var hs = 17; ctx.font = H.font(hs);
      while (ctx.measureText(hint).width > 1000 && hs > 12) { hs--; ctx.font = H.font(hs); }
      var hw = Math.min(1040, ctx.measureText(hint).width + 36);
      UI.panel(ctx, 640 - hw / 2, 596, hw, 34, { fill: 'rgba(18,9,4,0.86)', r: 9 });
      ctx.fillStyle = '#ffe9b8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(hint, 640, 613);
      ctx.restore();
    }
  };

  // ---------------------------------------------------------------- banners
  UI.drawBanners = function (ctx, G) {
    // one banner at a time (G.banners[0]; the rest wait in the queue), in the bottom strip left of the entrance:
    // the player can never walk there, so it never covers the bar, Hrvoje, the vent or the WC door
    var b = G.banners[0]; if (!b) return;
    var BX = Math.max(176, 16 + 44 + (G.mod.carryCigar + G.mod.carryDrink) * 56 + 12), BW = 752 - BX, BY = 634, BH = 82;   // starts right of the carry panel, ends before the door
    var inK = H.clamp((b.life - b.t) / 0.25, 0, 1), outK = H.clamp(b.t / 0.4, 0, 1), a = Math.min(inK, outK);
    var picW = b.portrait ? 78 : 0, textW = BW - 36 - picW, sub = b.sub || '', subH = sub ? 19 : 0;
    var size = Math.min(b.size || 20, 20), lines, lh;
    for (;; size--) {   // shrink the text until it fits the strip
      ctx.font = H.font(size); lines = H.wrap(ctx, b.text, textW); lh = size + 3;
      if (lines.length * lh + subH + 14 <= BH || size <= 12) break;
    }
    var maxLines = Math.max(1, Math.floor((BH - 14 - subH) / lh));
    if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…'; }
    ctx.font = H.font(14); if (sub && ctx.measureText(sub).width > textW) sub = H.wrap(ctx, sub, textW)[0].replace(/\s*\S*$/, '') + '…';
    ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - inK) * 22);
    UI.panel(ctx, BX, BY, BW, BH, { fill: 'rgba(22,11,5,0.95)', stroke: b.color || '#d9a55a' });
    var tx = BX + picW + (BW - picW) / 2;
    if (b.portrait) {
      ctx.save(); ctx.beginPath(); ctx.rect(BX + 8, BY + 6, 68, BH - 12); ctx.clip();
      H.Assets.drawPortrait(ctx, b.portrait, b.mood || 'neutral', BX + 8, BY + BH / 2 - 34, 68, 68); ctx.restore();
    }
    var top = BY + (BH - (lines.length * lh + subH)) / 2;
    lines.forEach(function (l, li) { H.text(ctx, l, tx, top + size + li * lh - 2, { size: size, align: 'center', color: b.color || '#ffe9b8', outline: false }); });
    if (sub) H.text(ctx, sub, tx, top + lines.length * lh + 14, { size: 14, align: 'center', color: '#d9a55a', outline: false });
    if (G.banners.length > 1) H.text(ctx, '+' + (G.banners.length - 1), BX + BW - 12, BY + 18, { size: 12, align: 'right', color: '#a89070', outline: false });
    ctx.restore();
  };

  // ---------------------------------------------------------------- modals
  UI.closeModal = function () { var m = UI.modal; UI.modal = null; UI.lightingFor = null; if (m && m.onClose) m.onClose(); };
  UI.isBlocking = function () { return !!(UI.modal && UI.modal.pauses); };

  UI.updateModal = function (dt, G) {
    var m = UI.modal; if (!m) return;
    m.t += dt;
    m.update(dt, G);
  };
  UI.drawModal = function (ctx, G) { if (UI.modal) UI.modal.draw(ctx, G); };

  // ---- shopping menu (humidor / bar) ----
  UI.openMenu = function (kind, title, items) {
    var G = H.G;
    if (!items.length) return;
    var m = { type: 'menu', pauses: false, blocksMove: false, t: 0, sel: 0 };
    function pick(i) {
      var it = items[i]; if (!it) return;
      var full = G.player.give(kind, it.id);
      H.Audio.select();
      G.floater(G.player.x, G.player.y - 120, it.name, '#ffe9b8', 1.2);
      if (full) G.player.say('Zamijenio sam.', 1.2);
      UI.closeModal();
      H.Events.onPick && H.Events.onPick(kind, it);
    }
    m.update = function () {
      var n = H.Input.num();
      if (n && n <= items.length) { pick(n - 1); return; }
      if (H.Input.upPressed()) m.sel = (m.sel + items.length - 1) % items.length;
      if (H.Input.downPressed()) m.sel = (m.sel + 1) % items.length;
      if (H.Input.pressed('Enter') || H.Input.pressed('NumpadEnter')) pick(m.sel);
      if (H.Input.escPressed()) { UI.closeModal(); H.Input.fakeDown('Escape', false); }
      else if (m.t > 0.3) { var ax = H.Input.axis(); if (ax.x || ax.y) { if (Math.abs(ax.x) + Math.abs(ax.y)) UI.closeModal(); } }
    };
    m.draw = function (ctx) {
      var rh = 56, w = 700, h = 100 + items.length * rh, x = 640 - w / 2, y = Math.max(64, 360 - h / 2);
      UI.panel(ctx, x, y, w, h);
      H.text(ctx, title, 640, y + 38, { size: 26, align: 'center', color: '#ffd58a' });
      items.forEach(function (it, i) {
        var ry = y + 58 + i * rh, hov = UI.hit(x + 12, ry, w - 24, rh - 6) || m.sel === i;
        ctx.fillStyle = hov ? 'rgba(200,120,50,0.35)' : 'rgba(255,255,255,0.05)'; H.roundRect(ctx, x + 12, ry, w - 24, rh - 6, 8); ctx.fill();
        if (hov) { ctx.strokeStyle = '#ffd58a'; ctx.lineWidth = 2; ctx.stroke(); }
        H.text(ctx, String(i + 1), x + 34, ry + 34, { size: 24, align: 'center', color: '#ffd58a', outline: false });
        H.Assets.drawIcon(ctx, it.icon, x + 82, ry + 25, 42);
        H.text(ctx, it.name, x + 116, ry + 24, { size: 19, color: '#fff0cf', outline: false });
        var dsz = 13, dmax = w - 116 - 30 - 84; ctx.font = H.font(dsz, 'normal');
        while (dsz > 11 && ctx.measureText(it.desc || '').width > dmax) { dsz--; ctx.font = H.font(dsz, 'normal'); }
        H.text(ctx, H.fit ? H.fit(ctx, it.desc || '', dmax) : (it.desc || ''), x + 116, ry + 42, { size: dsz, color: '#b89c78', outline: false, weight: 'normal' });
        H.text(ctx, H.money(it.price), x + w - 30, ry + 32, { size: 19, align: 'right', color: '#ffe36a', outline: false });
        UI.regions.push({ x: x + 12, y: ry, w: w - 24, h: rh - 6, cb: (function (idx) { return function () { pick(idx); }; })(i) });
      });
      H.text(ctx, 'Broj / klik za odabir • Esc zatvara', 640, y + h - 16, { size: 13, align: 'center', color: '#a89070', outline: false, weight: 'normal' });
    };
    UI.modal = m;
  };

  // ---- dialogue with portrait ----
  // pages: [{who (portrait id or null), name, mood, text}]; choices (shown on last page): [{text, cb}]; onDone after everything
  UI.openDialog = function (pages, choices, onDone) {
    pages = pages.filter(function (p) { return p && p.text; });
    if (!pages.length) { onDone && onDone(); return; }
    var m = { type: 'dialog', pauses: true, blocksMove: true, t: 0, page: 0, chars: 0, choices: choices && choices.length ? choices : null, done: false };
    function cur() { return pages[m.page]; }
    function choose(i) {
      var c = m.choices && m.choices[i]; if (!c) return;
      H.Audio.select();
      m.choices = null;
      UI.modal = null;
      if (c.cb) c.cb(c, i);
      // a choice may open a follow-up dialogue itself; otherwise finish
      if (!UI.modal) { onDone && onDone(c, i); }
    }
    m.update = function (dt) {
      var p = cur(); m.chars += dt * 62;
      var full = m.chars >= p.text.length;
      var last = m.page === pages.length - 1;
      if (H.Input.confirmPressed() && !(m.choices && last && full)) {
        if (!full) m.chars = p.text.length;
        else if (!last) { m.page++; m.chars = 0; H.Audio.click(); }
        else { UI.modal = null; onDone && onDone(); }
      }
      if (m.choices && last && full) {
        var n = H.Input.num(); if (n && n <= m.choices.length) choose(n - 1);
      }
    };
    m.draw = function (ctx) {
      var p = cur(), px = 70, pw = 1140, pic = !!p.who;
      var last = m.page === pages.length - 1, full = m.chars >= p.text.length;
      var tx = pic ? px + 270 : px + 44, tw = pic ? 820 : 1050;
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, H.W, H.H);
      ctx.font = H.font(22, 'normal');
      var lines = H.wrap(ctx, p.text, tw), textH = lines.length * 28;
      var chLines = [], chH = 0;
      if (m.choices && last && full) {
        ctx.font = H.font(18, 'normal');
        chLines = m.choices.map(function (c) { var l = H.wrap(ctx, c.text, tw - 62); if (l.length > 2) { l = l.slice(0, 2); l[1] += '…'; } return l; });
        chLines.forEach(function (l) { chH += l.length * 22 + 12 + 6; });
      }
      var top = 84 + textH + 12 + chH + 26, ph = Math.max(216, top), py = 708 - ph;
      UI.panel(ctx, px, py, pw, ph, { fill: 'rgba(24,12,6,0.96)' });
      if (pic) H.Assets.drawPortrait(ctx, p.who, p.mood || 'neutral', px + 14, py - 34, 230, 230);
      if (p.name) H.text(ctx, p.name, tx, py + 40, { size: 24, color: '#ffd58a' });
      var shown = p.text.substr(0, Math.floor(m.chars)), shownLines = H.wrap(ctx, shown, tw);
      ctx.font = H.font(22, 'normal');
      shownLines = H.wrap(ctx, shown, tw);
      shownLines.forEach(function (l, i) { H.text(ctx, l, tx, py + 78 + i * 28, { size: 22, weight: 'normal', color: p.who || p.name ? '#fff0cf' : '#e6d8b8', outline: false }); });
      var ty = py + 84 + textH + 8;
      if (m.choices && last && full) {
        m.choices.forEach(function (c, i) {
          var hh = chLines[i].length * 22 + 12, w = tw + 12, bx = tx - 8;
          var hov = UI.hit(bx, ty, w, hh);
          ctx.fillStyle = hov ? 'rgba(200,120,50,0.45)' : 'rgba(255,255,255,0.07)'; H.roundRect(ctx, bx, ty, w, hh, 8); ctx.fill();
          if (hov) { ctx.strokeStyle = '#ffd58a'; ctx.lineWidth = 2; ctx.stroke(); }
          H.text(ctx, (i + 1) + '.', bx + 22, ty + 23, { size: 19, color: '#ffd58a', outline: false, align: 'center' });
          chLines[i].forEach(function (l, li) { H.text(ctx, l, bx + 44, ty + 22 + li * 22 - (chLines[i].length > 1 ? 2 : 0), { size: 18, weight: 'normal', color: '#fff0cf', outline: false }); });
          UI.regions.push({ x: bx, y: ty, w: w, h: hh, cb: (function (ii) { return function () { choose(ii); }; })(i) });
          ty += hh + 6;
        });
      } else if (full) {
        H.text(ctx, (last ? 'E / Space  ▶' : 'E  ▶'), px + pw - 30, py + ph - 14, { size: 16, align: 'right', color: '#c8a878', outline: false });
        UI.regions.push({ x: 0, y: 0, w: H.W, h: H.H, cb: function () { H.Input.fakePress('KeyE'); } });
      } else {
        UI.regions.push({ x: 0, y: 0, w: H.W, h: H.H, cb: function () { m.chars = 9999; } });
      }
    };
    UI.modal = m;
  };

  // ---- lighting minigame ----
  UI.openLighting = function (cust) {
    var G = H.G;
    if (G.autoLight > 0) {   // Roko's "spaghetti fix": next lightings are perfect without the minigame
      G.autoLight--; G.floater(cust.x, cust.y - 128, 'Spaghetti fix!', '#8affc0', 1.4);
      if (G.autoLight <= 0) G.buffs = G.buffs.filter(function (b) { return !(b.fx && b.fx.autoLight); });
      G.recalcMods(); cust.lightResult('perfect'); return;
    }
    var m = { type: 'light', pauses: false, blocksMove: true, t: 0, cust: cust, p: 0, dir: 1, holding: false, armed: false, result: null, resT: 0, tries: 0 };
    UI.lightingFor = cust;
    function newZone() {
      var cg = H.C.cigar(cust.order.cigar), base = (cg && cg.light) ? cg.light : 0.25;
      var w = (base + G.mod.green) * (cust.rush ? 0.92 : 1); w = H.clamp(w, 0.1, 0.55);
      m.zw = w; m.z0 = H.rnd(0.28, 0.72 - w);
      m.spd = 0.95 + H.rand() * 0.3 + (G.endless ? 0.05 * (G.night - 6) : 0.06 * (G.night - 1));
      m.p = 0; m.dir = 1;
    }
    newZone();
    m.update = function (dt) {
      if (m.result) {
        m.resT -= dt;
        if (m.resT <= 0) {
          var r = m.result;
          if (r === 'retry') { m.result = null; newZone(); m.armed = false; }
          else { UI.modal = null; UI.lightingFor = null; cust.lightResult(r); }
        }
        return;
      }
      if (H.Input.escPressed()) { UI.closeModal(); return; }
      if (cust.state !== 'needLight') { UI.closeModal(); return; }
      var down = H.Input.interactDown();
      if (!down) m.armed = true;
      if (m.armed && down) {
        if (!m.holding) { m.holding = true; H.Audio.lighter(); }
        m.p += m.dir * m.spd * dt;
        if (m.p >= 1) { m.p = 1; m.dir = -1; } else if (m.p <= 0) { m.p = 0; m.dir = 1; }
      } else if (m.holding) {
        m.holding = false;
        var inZone = m.p >= m.z0 && m.p <= m.z0 + m.zw, mid = m.z0 + m.zw / 2, perfect = Math.abs(m.p - mid) < m.zw * 0.2;
        m.tries++;
        if (inZone) { m.result = perfect ? 'perfect' : 'good'; m.resT = 0.55; }
        else if (m.tries < 2) { m.result = 'retry'; m.resT = 0.6; H.Audio.bad(); }
        else { m.result = 'bad'; m.resT = 0.55; }
      }
    };
    m.draw = function (ctx) {
      var w = 380, h = 96, x = H.clamp(cust.x - w / 2, 12, H.W - w - 12), y = cust.y - 200;
      if (y < 70) y = cust.y + 30;
      UI.panel(ctx, x, y, w, h, { fill: 'rgba(24,12,6,0.94)' });
      H.Assets.drawIcon(ctx, 'lighter', x + 28, y + 28, 34);
      H.text(ctx, m.result === 'retry' ? 'Promašeno! Još jednom...' : (m.result ? { perfect: 'SAVRŠENO!', good: 'Zapaljeno!', bad: 'Loše...' }[m.result] : 'Drži E, pusti u zelenom'), x + 58, y + 34, { size: 17, color: '#ffe9b8', outline: false });
      var bx = x + 20, by = y + 50, bw = w - 40, bh = 26;
      ctx.fillStyle = '#1a0e06'; H.roundRect(ctx, bx, by, bw, bh, 6); ctx.fill();
      ctx.fillStyle = 'rgba(80,220,100,0.85)'; ctx.fillRect(bx + bw * m.z0, by + 2, bw * m.zw, bh - 4);
      ctx.fillStyle = 'rgba(200,255,200,0.9)'; ctx.fillRect(bx + bw * (m.z0 + m.zw * 0.3), by + 2, bw * m.zw * 0.4, bh - 4);
      var cx = bx + bw * m.p;
      ctx.fillStyle = m.result === 'bad' || m.result === 'retry' ? '#ff5a3a' : '#fff'; ctx.fillRect(cx - 3, by - 5, 6, bh + 10);
      ctx.strokeStyle = '#9a6030'; ctx.lineWidth = 2; H.roundRect(ctx, bx, by, bw, bh, 6); ctx.stroke();
      H.text(ctx, 'Esc = odustani', x + w - 14, y + h - 6, { size: 11, align: 'right', color: '#8a7050', outline: false, weight: 'normal' });
    };
    UI.modal = m;
    H.Audio.lighter();
  };

  // ---- Matija's progress photo ----
  UI.openPhoto = function (text, onEnd, sec, penaltyTxt) {
    var G = H.G; sec = sec || 3;
    var m = { type: 'photo', pauses: false, blocksMove: true, t: 0 };
    G.player.frozen = sec + 0.2;
    m.update = function () {
      if (m.t > 0.5 && H.Input.interactPressed()) { UI.modal = null; G.player.frozen = 0; onEnd && onEnd(true); return; }
      if (m.t > sec) { UI.modal = null; onEnd && onEnd(false); }
    };
    m.draw = function (ctx) {
      var x = 430, y = 90, w = 420, h = 540;
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, H.W, H.H);
      ctx.fillStyle = '#0c0c10'; H.roundRect(ctx, x, y, w, h, 34); ctx.fill();
      ctx.strokeStyle = '#6a6a78'; ctx.lineWidth = 5; ctx.stroke();
      var sx = x + 20, sy = y + 40, sw = w - 40, sh = h - 130;
      var g2 = ctx.createLinearGradient(0, sy, 0, sy + sh); g2.addColorStop(0, '#3a5a8a'); g2.addColorStop(1, '#1e2a44');
      ctx.fillStyle = g2; ctx.fillRect(sx, sy, sw, sh);
      // before / after: skinny "before" next to the flexing Matija sprite as "after"
      var cx = x + w / 2, by = sy + sh - 26, pn = Math.floor(m.t / 0.9) % 3;
      var befores = ['gamer2', 'roko', 'gamer1'], bid = befores[(Math.floor(G.t / 7)) % befores.length];
      ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fillRect(cx - 1, sy + 44, 2, sh - 60);
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx - 96, by + 2, 46, 8, 0, 0, 6.3); ctx.ellipse(cx + 96, by + 2, 60, 9, 0, 0, 6.3); ctx.fill();
      if (H.Assets.hasAtlas(bid)) H.Assets.drawChar(ctx, bid, 'walk_down', 0, cx - 96, by, { scale: 2 });
      if (H.Assets.hasAtlas('matija')) H.Assets.drawChar(ctx, 'matija', 'special1', 0, cx + 96, by, { scale: 2 });
      else { ctx.fillStyle = '#c98a5a'; ctx.beginPath(); ctx.arc(cx + 96, sy + 150, 34, 0, 6.3); ctx.fill(); ctx.fillRect(cx + 40, sy + 190, 112, 120); }
      H.text(ctx, 'PRIJE', cx - 96, sy + 64, { size: 16, align: 'center', color: '#cfe0ff' });
      H.text(ctx, 'POSLIJE', cx + 96, sy + 64, { size: 16, align: 'center', color: '#ffe36a' });
      H.text(ctx, 'KLIJENT #' + (12 + Math.floor(G.t) % 88), x + w / 2, sy + 24, { size: 15, align: 'center', color: '#fff' });
      ctx.save(); ctx.font = H.font(17, 'normal');
      H.wrap(ctx, text, w - 50).slice(0, 3).forEach(function (l, i) { H.text(ctx, l, x + w / 2, y + h - 74 + i * 22, { size: 17, weight: 'normal', align: 'center', color: '#e8e0d0', outline: false }); });
      ctx.restore();
      H.text(ctx, 'E = preskoči' + (penaltyTxt ? ' (' + penaltyTxt + ')' : ''), x + w / 2, y + h - 12, { size: 13, align: 'center', color: '#8a8a98', outline: false });
    };
    UI.modal = m;
  };

  // generic multi-choice popup that doesn't need a portrait (used rarely)
})();
