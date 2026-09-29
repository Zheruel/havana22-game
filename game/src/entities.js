// entities.js - the Player and Customer actors (movement, ordering, serving, smoking, paying).
(function () {
  'use strict';
  var H = window.H;

  function faceFrom(dx, dy, prev) {
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return prev || 'down';
    return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
  }
  H.faceFrom = faceFrom;
  var FVEC = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
  H.FVEC = FVEC;

  // ============================================================================ Player
  function Player() {
    var L = H.Nav.L;
    this.id = 'hrvoje';
    var st = L.playerStart || { x: 340, y: 172 };
    this.x = st.x; this.y = st.y; this.face = 'down';
    this.animT = 0; this.moving = false; this.r = 11;
    this.carry = { cigars: [], drinks: [] };   // capacity 1 each, more with upgrades (G.mod.carryCigar / carryDrink)
    Object.defineProperty(this.carry, 'cigar', { get: function () { return this.cigars[0] || null; } });
    Object.defineProperty(this.carry, 'drink', { get: function () { return this.drinks[0] || null; } });
    this.frozen = 0;        // seconds of forced immobility (Matija's photos etc.)
    this.bubble = null;
    this.shoutCd = 0;
  }
  Player.prototype.say = function (text, dur) { this.bubble = { text: text, t: dur || 2.4 }; };
  Player.prototype.list = function (kind) { return kind === 'cigar' ? this.carry.cigars : this.carry.drinks; };
  Player.prototype.cap = function (kind) { return kind === 'cigar' ? H.G.mod.carryCigar : H.G.mod.carryDrink; };
  Player.prototype.has = function (id) { return this.carry.cigars.indexOf(id) >= 0 || this.carry.drinks.indexOf(id) >= 0; };
  Player.prototype.any = function () { return this.carry.cigars.length + this.carry.drinks.length > 0; };
  // returns true when the oldest item had to be dropped to make room
  Player.prototype.give = function (kind, id) {
    var l = this.list(kind), full = l.length >= this.cap(kind);
    if (full) l.shift();
    l.push(id); return full;
  };
  Player.prototype.drop = function (id) {
    var l = this.carry.cigars, i = l.indexOf(id);
    if (i < 0) { l = this.carry.drinks; i = l.indexOf(id); }
    if (i < 0) return false;
    l.splice(i, 1); return true;
  };
  Player.prototype.update = function (dt, G, mx, my) {
    if (this.bubble) { this.bubble.t -= dt; if (this.bubble.t <= 0) this.bubble = null; }
    if (this.shoutCd > 0) this.shoutCd -= dt;
    if (this.frozen > 0) { this.frozen -= dt; mx = 0; my = 0; }
    this.moving = false;
    if (mx || my) {
      var l = Math.sqrt(mx * mx + my * my); mx /= l; my /= l;
      var sp = 178 * G.mod.speed;
      H.Nav.moveCircle(this, mx * sp * dt, my * sp * dt, this.r, true);
      this.face = faceFrom(mx, my, this.face);
      this.moving = true; this.animT += dt;
    } else this.animT = 0;
  };
  Player.prototype.draw = function (ctx) {
    var frame = this.moving ? Math.floor(this.animT * 9) % 4 : 0;
    H.Assets.drawChar(ctx, 'hrvoje', 'walk_' + this.face, frame, this.x, this.y, {});
  };
  H.Player = Player;

  // ============================================================================ Customer
  var uid = 1;
  function Customer(id, opts) {
    opts = opts || {};
    var G = H.G, L = H.Nav.L;
    this.uid = uid++;
    this.id = id;
    this.role = opts.role || (/^baka/.test(id) ? 'baka' : (/^gamer/.test(id) ? 'gamer' : (/^guest/.test(id) ? 'guest' : id)));
    this.def = H.C.cust(id);
    this.name = this.def.name || this.def.short || id;
    var sp = (L.spawn && L.spawn.door) || { x: 830, y: 700 };
    this.x = opts.x != null ? opts.x : sp.x + H.rnd(-12, 12); this.y = opts.y != null ? opts.y : sp.y;
    this.face = 'up';
    this.path = []; this.speed = opts.speed || H.rnd(86, 104);
    this.state = 'walkIn'; this.t = 0; this.animT = 0; this.moving = false;
    this.seat = null; this.order = { cigar: null, drink: null }; this.got = { cigar: false, drink: false };
    this.patMax = (opts.patience || this.patienceFor()); this.pat = this.patMax;
    this.tipFrac = this.def.tip <= 1 ? this.def.tip : this.def.tip / 25;
    this.noTip = opts.noTip || false;
    this.bubble = null; this.smokeLeft = 0; this.smokeTotal = 0; this.quality = 'good';
    this.frozen = 0; this.coughT = H.rnd(3, 8); this.chimed = false;
    this.rush = !!opts.rush; this.comp = false; this.angry = false;
    this.flags = {}; this.ai = null; this.ev = {}; this.lightTries = 0;
    this.hidden = false; this.dead = false; this.waitBarkT = H.rnd(10, 18);
    this.payMul = 1; this.tipBonus = 0; this.choc = false; this.tabbed = false; this.smokeLoad = 1;
  }
  Customer.prototype.patienceFor = function () {
    var G = H.G, base = this.def.patience || 75;
    if (base <= 5) base = base * 75;
    var nightF = G.endless ? 1 : [1.05, 1.0, 0.97, 0.94, 0.9][H.clamp(G.night, 1, 5) - 1];
    return base * nightF * G.mod.patience * (this.rush ? 0.8 : 1);
  };
  Customer.prototype.say = function (text, dur) {
    if (!text) return;
    this.bubble = { text: text, t: dur || (2.4 + Math.min(2.5, text.length / 30)) };
    if (H.Audio) H.Audio.pop();
  };
  Customer.prototype.bark = function (key, dur) {
    var l = H.C.say(this.id, key);
    if (l) this.say(l, dur);
    return l;
  };
  Customer.prototype.walkTo = function (x, y, staff) {
    var p = H.Nav.path(this.x, this.y, x, y, staff);
    this.path = p || [{ x: x, y: y }];
    return !!p;
  };
  // follow path; returns true when arrived (path empty)
  Customer.prototype.moveAlong = function (dt, speedMul) {
    this.moving = false;
    if (!this.path.length) return true;
    var tg = this.path[0], dx = tg.x - this.x, dy = tg.y - this.y, d = Math.sqrt(dx * dx + dy * dy);
    var step = this.speed * (speedMul || 1) * dt;
    if (d <= step) { this.x = tg.x; this.y = tg.y; this.path.shift(); }
    else { this.x += dx / d * step; this.y += dy / d * step; }
    if (d > 0.5) this.face = faceFrom(dx, dy, this.face);
    this.moving = true; this.animT += dt;
    return this.path.length === 0;
  };

  Customer.prototype.assignSeat = function (seat) {
    this.seat = seat; H.G.seatOcc[seat.id] = this;
    this.approach = H.Nav.approachFor(seat);
    this.walkTo(this.approach.x, this.approach.y, false);
    this.state = 'walkIn';
  };
  Customer.prototype.freeSeat = function () {
    if (this.seat && H.G.seatOcc[this.seat.id] === this) delete H.G.seatOcc[this.seat.id];
  };
  Customer.prototype.isSeated = function () {
    return this.state === 'settle' || this.state === 'ordering' || this.state === 'needLight' || this.state === 'smoking' || this.state === 'sitTrans';
  };
  Customer.prototype.needs = function () {
    return { cigar: (this.order.cigar && !this.got.cigar) ? this.order.cigar : null, drink: (this.order.drink && !this.got.drink) ? this.order.drink : null };
  };
  Customer.prototype.needsCount = function () { var n = this.needs(); return (n.cigar ? 1 : 0) + (n.drink ? 1 : 0); };
  Customer.prototype.wantsItem = function (id) { var n = this.needs(); return n.cigar === id || n.drink === id; };

  Customer.prototype.setOrder = function (o) {
    this.order = { cigar: o.cigar || null, drink: o.drink || null };
    if (this.order.cigar && !H.C.cigar(this.order.cigar)) this.order.cigar = H.C.cheapestCigar.id;
    if (this.order.drink && !H.C.drink(this.order.drink)) this.order.drink = H.C.drinks[0].id;
    this.got = { cigar: false, drink: false };
  };

  // Called by the player pressing E in range. Returns the number of things handed over.
  Customer.prototype.serve = function (player) {
    var G = H.G, delivered = 0, wrong = 0, needs = this.needs(), self = this;
    if (this.state === 'ordering') {
      ['cigar', 'drink'].forEach(function (k) {
        var want = needs[k]; if (!want) return;
        if (player.has(want)) {
          player.drop(want); self.got[k] = true; delivered++;
          G.stats.itemsServed++;
          if (want === 'cigar_cohiba') self.gotCohiba = true;
        } else if (player.list(k).length) wrong++;
      });
    }
    // black chocolate on the side: extra bonus for the pairing (also while smoking)
    if (!this.choc && this.order.cigar && this.order.drink !== 'black_chocolate' && player.has('black_chocolate') &&
        (this.state === 'ordering' || this.state === 'needLight' || this.state === 'smoking')) {
      player.drop('black_chocolate'); this.choc = true; delivered++;
      G.floater(this.x, this.y - 130, 'crna čokolada', '#d9a070', 1.3);
      H.Events.trigger('serve', { cigar: this.order.cigar, drink: 'black_chocolate' });
    }
    if (delivered) {
      H.Audio.select();
      this.bark('served_good', 2.2);
      G.floater(this.x, this.y - 90, '✓', '#8cff9a');
      if (this.needsCount() === 0 && this.state === 'ordering') this.onAllDelivered();
    } else if (wrong) {
      this.pat -= this.patMax * 0.12; H.Audio.bad(); G.count('wrong');
      this.bark('served_bad', 2.2); G.floater(this.x, this.y - 90, H.C.toast('wrongItem', 'Krivo!').length < 24 ? H.C.toast('wrongItem', 'Krivo!') : 'Krivo!', '#ff7a6a');
    }
    if (H.Events.onServe) H.Events.onServe(this, delivered, wrong);
    return delivered;
  };
  Customer.prototype.onAllDelivered = function () {
    var G = H.G;
    H.Events.trigger('serve', { cigar: this.order.cigar, drink: this.order.drink });
    if (this.order.cigar) {
      this.state = 'needLight'; this.lightTries = 0;
      H.UI.openLighting(this);
    } else {
      this.state = 'smoking'; this.quality = 'good';
      this.smokeTotal = this.smokeLeft = H.rnd(9, 14); this.noSmoke = true;
    }
  };
  Customer.prototype.lightResult = function (res) {
    // res: 'perfect' | 'good' | 'bad'
    var G = H.G;
    this.quality = res;
    var cig = H.C.cigar(this.order.cigar);
    var dur = cig && cig.smoke ? cig.smoke : H.clamp(15 + (cig ? cig.price : 10) * 0.75, 18, 40);
    this.smokeLoad = cig && cig.smokeLoad ? cig.smokeLoad : 1;
    this.smokeTotal = this.smokeLeft = dur * H.rnd(0.9, 1.1);
    this.state = 'smoking'; this.noSmoke = false;
    if (res === 'perfect') {
      G.count('perfect'); if (this.role === 'mislav') G.count('mislavPerfect');
      G.floater(this.x, this.y - 100, 'SAVRŠENO!', '#ffe36a'); H.Audio.perfect(); G.streak++;
    }
    else if (res === 'good') { H.Audio.good(); G.floater(this.x, this.y - 100, 'Dobro', '#bfffb0'); G.streak = 0; }
    else { H.Audio.bad(); G.floater(this.x, this.y - 100, 'Nekako zapaljena...', '#ffb27a'); G.streak = 0; }
    if (H.Events.onLit) H.Events.onLit(this, res);
    H.Achv.check('light');
  };

  Customer.prototype.revenue = function () {
    var G = H.G, rev = 0, cost = 0;
    var c = H.C.cigar(this.order.cigar), d = H.C.drink(this.order.drink);
    if (c) { rev += c.price; cost += c.cost; }
    if (d) { rev += d.price; cost += d.cost; }
    if (this.choc) { var ch = H.C.drink('black_chocolate'); if (ch) { rev += ch.price; cost += ch.cost; } }
    rev *= G.mod.sales;
    var pair = H.C.pairing(this.order.cigar, this.order.drink);
    var bonus = pair ? (typeof pair.bonus === 'number' ? pair.bonus : 8) : 0;
    var isHrv = !!pair && pair.id === 'hrvojev_izbor';
    if (isHrv) bonus += G.mod.hrvojevBonus;
    var choc = !!this.order.cigar && (this.choc || G.mod.chocolateAuto) && this.order.drink !== 'black_chocolate';
    if (choc) bonus += (pair && pair.chocolateBonus) ? pair.chocolateBonus : 2;
    var qm = { perfect: 1.7, good: 1, bad: 0.25 }[this.quality] || 1;
    var pm = 0.55 + 0.85 * H.clamp(this.pat / this.patMax, 0, 1);
    var tip = this.noTip ? 0 : rev * this.tipFrac * qm * pm * G.mod.tip * (this.rush ? 1.25 : 1) * this.payMul;
    if (this.tipBonus) tip = Math.max(0, tip + this.tipBonus * (this.noTip ? 0 : 1));
    if (this.quality === 'bad') bonus *= 0.3;
    return { rev: rev, cost: cost, tip: tip, bonus: bonus, pair: pair, hrv: isHrv, choc: choc || this.order.drink === 'black_chocolate' };
  };

  Customer.prototype.pay = function () {
    var G = H.G, r = this.revenue();
    var free = this.comp || this.tabbed;
    var gain = free ? 0 : (r.rev + r.tip + r.bonus);
    var net = gain - r.cost;
    G.cash += net;
    G.nightStats.sales += free ? 0 : r.rev; G.nightStats.tips += free ? 0 : r.tip + r.bonus; G.nightStats.costs += r.cost;
    G.count('served');
    if (gain > 0) G.stats.totalCash += gain;
    G.floater(this.x, this.y - 110, (this.tabbed ? 'na crtu' : ((net >= 0 ? '+' : '') + H.money(net))), net >= 0 || this.tabbed ? '#ffe36a' : '#ff8a6a', 1.6);
    if (net > 0) H.Audio.cash();
    if (r.pair && !free) {
      G.count('pairings');
      if (r.hrv) G.count('hrvojevIzbor');
      if (r.choc) G.count('chocolatePairings');
      G.banner(r.hrv ? H.C.toast('hrvojevIzbor', 'HRVOJEV IZBOR!') : (r.pair.line || H.C.toast('pairing', 'Sparivanje!')), { sub: (r.hrv ? (r.pair.line || '') + ' · ' : '') + 'Bonus ' + H.money(r.bonus), color: '#ffd77a', dur: 4.2, prio: 0 });
      if (r.pair.stars) G.addRating(r.pair.stars, 'pairing');
    }
    var happyFrac = this.pat / this.patMax;
    var dr = (this.quality === 'bad' ? 0.01 : (happyFrac > 0.5 ? 0.07 : 0.035)) + (this.quality === 'perfect' ? 0.04 : 0);
    if (this.comp) dr = 0.02;
    G.addRating(dr, 'happy');
    this.bark('leave_happy', 2.2);
    if (H.Events.onPaid) H.Events.onPaid(this, r);
    H.Achv.check('paid');
    this.leave(false);
  };

  Customer.prototype.leave = function (angry, reason) {
    var G = H.G, L = H.Nav.L;
    if (this.state === 'walkOut' || this.dead) return;
    this.freeSeat(); this.angry = !!angry;
    this.state = 'walkOut'; this.t = 0;
    if (H.UI.lightingFor === this) H.UI.closeModal();
    var d = (L.spots && L.spots.door) || { x: 830, y: 655 }, sp = (L.spawn && L.spawn.door) || { x: 830, y: 700 };
    this.walkTo(d.x + H.rnd(-15, 15), d.y, false);
    this.path.push({ x: sp.x, y: sp.y + 30 });
    this.speed *= angry ? 1.35 : 1;
    if (angry) {
      if (reason === 'tirade') { this.say(H.pick(H.lines(H.X.EV('mislav').tirade && H.X.EV('mislav').tirade.guestsLeave)) || 'Idem!', 2.6); }
      else this.bark('leave_angry', 2.6);
      G.count('angry');
      G.addRating(reason === 'tirade' ? (((H.X.EV('mislav').tirade || {}).penaltyLeave || {}).stars || -0.1) : (reason === 'smoke' ? -0.22 : -0.35), 'angry');
      H.Audio.bad();
      H.Achv.check('angry');
    }
    if (H.Events.onLeave) H.Events.onLeave(this, angry, reason);
  };

  Customer.prototype.update = function (dt, G) {
    var self = this;
    this.t += dt;
    if (this.bubble) { this.bubble.t -= dt; if (this.bubble.t <= 0) this.bubble = null; }
    var st = this.state;
    if (this.frozen > 0) this.frozen -= dt;
    var drain = (G.smoke > 70 ? 1.6 : 1) * (this.frozen > 0 ? 1.6 : 1) * (G.godMode ? 0 : 1) / G.mod.patLive;

    if (!this.chimed && st === 'walkIn' && this.y < (H.Nav.L.spots.door ? H.Nav.L.spots.door.y + 8 : 660)) { this.chimed = true; H.Audio.doorChime();
      if (!this.silentEntry) {   // stagger arrival bubbles (>= 0.6 s apart) so a rush does not pile them up
        var at = Math.max(G.t, Customer.nextEnterBark || 0); Customer.nextEnterBark = at + 0.6;
        if (at - G.t < 0.05) this.bark('enter', 2.6); else G.after(at - G.t, function () { if (!self.dead && self.state === 'walkIn') self.bark('enter', 2.6); });
      }
    }
    if (st === 'walkIn') {
      if (this.moveAlong(dt) && this.seat) {
        this.state = 'sitTrans'; this.t = 0; this.fromX = this.x; this.fromY = this.y; this.face = this.seat.face;
      }
    } else if (st === 'sitTrans') {
      var k = H.clamp(this.t / 0.45, 0, 1);
      this.x = H.lerp(this.fromX, this.seat.x, k); this.y = H.lerp(this.fromY, this.seat.y, k);
      this.moving = false;
      if (k >= 1) { this.state = 'settle'; this.t = 0; if (H.Events.onSeated) H.Events.onSeated(this); }
    } else if (st === 'settle') {
      if (this.t > (this.settleDelay || 1.1)) { this.state = 'ordering'; this.t = 0; this.bark('order', 3); H.Audio.pop(); if (H.Events.onOrdering) H.Events.onOrdering(this); }
    } else if (st === 'ordering' || st === 'needLight') {
      var mult = (st === 'needLight') ? 0.55 : 1;
      if (this.frozen > 0) mult *= 1;
      this.pat -= dt * drain * mult;
      this.waitBarkT -= dt;
      if (this.waitBarkT <= 0) { this.waitBarkT = H.rnd(14, 24); if (this.pat / this.patMax < 0.6) this.bark('waiting', 2.4); }
      if (this.pat <= 0) this.leave(true, 'patience');
      else this.coughCheck(dt, G);
    } else if (st === 'smoking') {
      if (this.frozen <= 0) this.smokeLeft -= dt;
      if (!this.noSmoke) {
        G.smokeIn += 0.55 * this.smokeLoad * G.mod.smokeMul;
        this.puffT = (this.puffT || 0) - dt;
        if (this.puffT <= 0) { this.puffT = H.rnd(0.35, 0.6); G.fx.puff(this.x + (FVEC[this.face] ? FVEC[this.face][0] * 12 : 0), this.y - 62); }
      }
      this.coughCheck(dt, G);
      if (this.smokeLeft <= 0) { if (this.hold && this.hold()) { /* event may hold payment */ } else this.pay(); }
    } else if (st === 'walkOut') {
      if (this.moveAlong(dt)) this.dead = true;
      if (this.y > 690 && this.path.length === 0) this.dead = true;
    }
    if (this.ai) this.ai(this, dt, G);
  };
  Customer.prototype.coughCheck = function (dt, G) {
    if (G.smoke <= 70) return;
    this.coughT -= dt;
    if (this.coughT <= 0) {
      this.coughT = H.rnd(4, 9) * (G.smoke > 90 ? 0.6 : 1);
      this.say(H.pick(['*kha kha*', '*kaše*', 'Uf, dim!', '*kašlje*']), 1.6);
      H.Audio.cough(); if (this.state === 'ordering' || this.state === 'needLight') this.pat -= 2.5;
    }
  };

  Customer.prototype.animName = function () {
    var st = this.state;
    if (this.moving || st === 'walkIn' || st === 'walkOut') return ['walk_' + this.face, Math.floor(this.animT * 8) % 4];
    if (this.forceAnim) return [this.forceAnim, 0];
    if (st === 'sitTrans') return ['walk_' + this.face, 0];
    if (this.isSeated()) {
      if (this.rant) return ['talk', 0];
      if (st === 'smoking' && !this.noSmoke) {
        var ph = (this.t + this.uid * 1.7) % 5;
        if (ph > 3.3) return ['smoke', 0];
      }
      return ['sit_' + (this.seat ? this.seat.face : 'down'), 0];
    }
    return ['walk_' + this.face, 0];
  };
  Customer.prototype.sortY = function () { return this.y + (this.isSeated() ? 3 : 0); };
  Customer.prototype.draw = function (ctx) {
    if (this.hidden) return;
    var a = this.animName();
    var alpha = this.alpha != null ? this.alpha : null;
    // shadow (helps placeholders + atlas alike)
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(this.x, this.y - 1, 24, 8, 0, 0, 6.3); ctx.fill();
    H.Assets.drawChar(ctx, this.id, a[0], a[1], this.x + (this.shake ? Math.sin(H.G.t * 60) * 2 : 0), this.y, { alpha: alpha, smoking: this.state === 'smoking', fallback: this.isSeated() ? 'sit_' + (this.seat ? this.seat.face : 'down') : 'walk_' + this.face });
  };
  H.Customer = Customer;
})();
