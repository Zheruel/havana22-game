// game.js - global state (H.G), night flow, the play-scene update/render, interaction targeting.
(function () {
  'use strict';
  var H = window.H;

  var G = H.G = {
    scene: 'loading', t: 0, paused: false, speed: 1, godMode: false,
    night: 1, endless: false, clock: 0, dur: 360, goal: 80,
    cash: 0, cashStart: 0, rating: 4.5, ratingStart: 4.5,
    smoke: 0, smokeIn: 0, smokeOver: 0, ventCd: 0, ventFx: 0,
    player: null, customers: [], seatOcc: {}, brokenSeats: {}, props: [], timers: [], floaters: [], banners: [],
    prompt: null, hint: '', hintOverride: '', wcBusyT: 0, streak: 0,
    upgrades: {}, mod: null, stats: {}, nightStats: {}, ach: {}, eggsSeen: {}, endlessBest: 0, finaleSeen: false,
    summary: null, snap: null, target: null, fx: null, shoutFx: 0, sched: [], lastNightPassed: false,
    nightFx: null, buffs: [], autoLight: 0, flags: {}, pendingEggs: [], peakHit: false, newAch: [], rokoDebt: 0, seen: {}, tipMsg: '', tipT: 0, tipsDone: {}, reviewCd: 0
  };

  function freshStats() {
    return { served: 0, perfect: 0, pairings: 0, angry: 0, itemsServed: 0, bakaBest: 0, bakaIgnored: 0, gamersCaught: 0, gamersEspresso: 0,
      eggs: 0, humidorThefts: 0, nightsPassed: 0, nightsDone: 0, maxStreak: 0, hotfixes: 0, ballCatches: 0, armchairsBroken: 0, tirades: 0, tiradeStopped: 0, pitches: 0, vents: 0,
      totalCash: 0, pings: 0, hrvojevIzbor: 0, chocolatePairings: 0, mislavPerfect: 0, progressPicsSeen: 0, ivaniseviBest: 0, padelGlasses: 0, smokePeak99: 0, rushDone: 0,
      nightStars45: 0, nightNoWrong: 0, endlessNights: 0, finale: 0, recipeListened: 0, rushHappy: 0 };
  }
  function freshNightStats() { return { sales: 0, tips: 0, costs: 0, served: 0, angry: 0, pairings: 0, perfect: 0, wrong: 0, vents: 0 }; }
  // one counter feeds both the lifetime stats (achievements) and the per-night stats (bonus goals)
  G.count = function (k, n) { n = n == null ? 1 : n; G.stats[k] = (G.stats[k] || 0) + n; if (G.nightStats) G.nightStats[k] = (G.nightStats[k] || 0) + n; };
  // money that comes in from events (tips, gambles); goes through here so totals stay honest
  G.earn = function (v, kind) {
    G.cash += v;
    if (v > 0) { G.stats.totalCash = (G.stats.totalCash || 0) + v; if (G.nightStats) G.nightStats[kind === 'sales' ? 'sales' : 'tips'] += v; }
    else if (G.nightStats) G.nightStats.costs += -v;
  };
  G.stats = freshStats();

  // ------------------------------------------------------------------ helpers used all over
  G.floater = function (x, y, text, color, life) {
    G.floaters.push({ x: x, y: y, text: text, color: color || '#fff', t: life || 1.4, life: life || 1.4 });
  };
  G.banner = function (text, o) {
    o = o || {};
    // one banner is on screen at a time (bottom strip, ui.js); the rest queue. prio 0 = flavour (reviews, eggs, achievements), 1 = default, 2 = urgent
    var prio = o.prio != null ? o.prio : 1, f = G.banners[0];
    G.banners.push({ text: text, sub: o.sub, color: o.color, portrait: o.portrait, mood: o.mood, size: o.size, t: o.dur || 3.6, life: o.dur || 3.6, prio: prio, wait: 0 });
    if (f && prio > f.prio) f.t = Math.min(f.t, Math.max(0.4, 2.6 - (f.life - f.t)));   // urgent news cuts a flavour banner short once it has been readable
    while (G.banners.length > 5) {
      var di = 1; for (var k = 1; k < G.banners.length; k++) if (G.banners[k].prio < G.banners[di].prio) di = k;
      G.banners.splice(di, 1);
    }
  };
  G.updateBanners = function (dt) {
    var b = G.banners;
    if (!b.length) return;
    b[0].t -= dt;
    for (var i = b.length - 1; i >= 1; i--) { b[i].wait += dt; if (b[i].prio < 1 && b[i].wait > 9) b.splice(i, 1); }   // stale flavour banners are dropped
    if (b[0].t <= 0) {
      b.shift();
      var bi = 0; for (var j = 1; j < b.length; j++) if (b[j].prio > b[bi].prio) bi = j;
      if (bi > 0) b.unshift(b.splice(bi, 1)[0]);
    }
  };
  G.addRating = function (d, why) {
    var before = G.rating;
    G.rating = H.clamp(G.rating + d, 0, 5);
    if (G.godMode && G.rating < 1) G.rating = 1;
    if (Math.abs(G.rating - before) >= 0.01) {
      var txt = (d > 0 ? '+' : '') + d.toFixed(2).replace('.', ',') + '★';
      G.floater(H.G.player ? G.player.x : 640, (G.player ? G.player.y : 300) - 130, txt, d > 0 ? '#ffe36a' : '#ff6a5a', 1.6);
    }
    H.Achv && H.Achv.check('rating');
    // a Google review pops up now and then (content: reviews.good / bad / gamers)
    if (G.scene === 'play' && G.reviewCd <= 0 && G.reviews !== false) {
      var R = H.C.reviews || {}, pool = null;
      if (why === 'wc') pool = R.gamers;
      else if (d <= -0.2) pool = R.bad;
      else if (d >= 0.06 && H.chance(0.22)) pool = R.good;
      if (pool && pool.length) {
        G.reviewCd = 35;
        G.banner(H.pick(pool), { sub: 'Nova Google recenzija', color: d > 0 ? '#ffe36a' : '#ff9a7a', size: 17, dur: 4.2, prio: 0 });
      }
    }
  };
  G.after = function (sec, fn) { G.timers.push({ t: sec, fn: fn }); };
  G.difficultyDrain = function () { return 1; };

  // particles (smoke puffs, sparks)
  G.fx = {
    list: [],
    puff: function (x, y) {
      if (G.fx.list.length > 140) return;
      G.fx.list.push({ x: x, y: y, vx: H.rnd(-6, 6), vy: H.rnd(-22, -12), r: H.rnd(5, 9), t: 0, life: H.rnd(2.2, 3.4) });
    },
    ring: function (x, y, color, maxR) { G.fx.list.push({ ring: true, x: x, y: y, t: 0, life: 1.2, color: color || '#8ad4ff', maxR: maxR || 90 }); },
    update: function (dt) {
      var l = G.fx.list;
      for (var i = l.length - 1; i >= 0; i--) {
        var p = l[i]; p.t += dt;
        if (!p.ring) { p.x += p.vx * dt; p.y += p.vy * dt; p.r += dt * 4; }
        if (p.t >= p.life) l.splice(i, 1);
      }
    },
    draw: function (ctx) {
      var l = G.fx.list;
      for (var i = 0; i < l.length; i++) {
        var p = l[i], k = p.t / p.life;
        if (p.ring) {
          ctx.strokeStyle = p.color; ctx.globalAlpha = 1 - k; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.ellipse(p.x, p.y, p.maxR * k, p.maxR * k * 0.5, 0, 0, 6.3); ctx.stroke(); ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = 'rgba(215,205,190,' + (0.32 * (1 - k)) + ')';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.fill();
        }
      }
    }
  };

  // ------------------------------------------------------------------ upgrades / night modifiers / buffs -> G.mod
  // content effect keys: *Mult multiply, other numbers add, booleans switch on. Legacy keys (speed, patience, ...) add to a 1.0 multiplier.
  var MUL = { movespeedmult: 'speed', patiencemult: 'patience', tipmult: 'tip', smokeratemult: 'smokeMul', spawnratemult: 'spawn', pricemult: 'sales', rantfreezemult: 'rantFreeze', hotfixmult: 'hotfix' };
  var ADD = { lightzone: 'green', ventcooldown: 'ventCd', ventcd: 'ventCd', ventpower: 'ventPower', carrycigar: 'carryCigar', carrydrink: 'carryDrink', bakapatience: 'bakaPatience', hrvojevbonus: 'hrvojevBonus', green: 'green' };
  var LEG = { speed: 'speed', move: 'speed', patience: 'patience', smokedecay: 'smokeDecay', decay: 'smokeDecay', tip: 'tip', tips: 'tip', sales: 'sales', price: 'sales', smokemul: 'smokeMul', smoke: 'smokeMul' };
  var BOOL = { armchairproof: 'armchairProof', wcguard: 'wcGuard', chocolateauto: 'chocolateAuto', sonar: 'sonar', padelproof: 'padelProof' };
  function applyEffect(mod, eff) {
    var pairs = [];
    if (eff && typeof eff === 'object') Object.keys(eff).forEach(function (k) { pairs.push([k, eff[k]]); });
    else if (typeof eff === 'string') { var re = /([a-zA-Z_]+)\s*[:=]?\s*([+-]?\d+(?:\.\d+)?)/g, m; while ((m = re.exec(eff))) pairs.push([m[1], parseFloat(m[2])]); }
    pairs.forEach(function (p) {
      var k = String(p[0]).toLowerCase(), v = p[1];
      if (BOOL[k]) { if (v) mod[BOOL[k]] = true; }
      else if (typeof v !== 'number') return;
      else if (MUL[k]) mod[MUL[k]] *= v;
      else if (ADD[k]) mod[ADD[k]] += v;
      else if (LEG[k]) mod[LEG[k]] += v;
    });
  }
  G.recalcMods = function () {
    var m = { speed: 1, ventCd: 20, ventPower: 38, green: 0, patience: 1, smokeDecay: 1, tip: 1, sales: 1, smokeMul: 1, spawn: 1, rantFreeze: 1, hotfix: 1,
      carryCigar: 1, carryDrink: 1, bakaPatience: 0, hrvojevBonus: 0, armchairProof: false, wcGuard: false, chocolateAuto: false, sonar: false, padelProof: false, patLive: 1 };
    H.C.upgrades.forEach(function (u) { if (G.upgrades[u.id]) applyEffect(m, u.effect); });
    if (G.nightFx) applyEffect(m, G.nightFx);
    (G.buffs || []).forEach(function (b) {
      var fx = {}; Object.keys(b.fx || {}).forEach(function (k) { if (!/^(smoke|autoLight)$/i.test(k)) fx[k] = b.fx[k]; });
      if (fx.patienceMult) { m.patLive *= fx.patienceMult; delete fx.patienceMult; }
      applyEffect(m, fx);
    });
    m.ventCd = Math.max(6, m.ventCd);
    m.carryCigar = Math.max(1, Math.round(m.carryCigar)); m.carryDrink = Math.max(1, Math.round(m.carryDrink));
    G.mod = m;
  };
  // temporary buff (Roko's hotfix); fx uses the same keys as upgrades
  G.addBuff = function (id, name, fx, sec) {
    G.buffs = G.buffs.filter(function (b) { return b.id !== id; });
    G.buffs.push({ id: id, name: name, fx: fx, t: sec, total: sec });
    if (fx && fx.autoLight) G.autoLight += fx.autoLight;
    G.recalcMods();
  };
  G.recalcMods();

  // ------------------------------------------------------------------ persistence
  G.save = function (nextNight, inShop) {
    H.Save.write({ v: 2, shop: !!inShop, night: nextNight || G.night, cash: G.cash, rating: G.rating, upgrades: G.upgrades, ach: G.ach, eggs: G.eggsSeen, stats: G.stats, endlessBest: G.endlessBest, finaleSeen: G.finaleSeen, rokoDebt: G.rokoDebt, seen: G.seen });
  };
  G.loadSave = function () {
    var s = H.Save.load(); if (!s) return null;
    return s;
  };

  var Game = H.Game = {};

  // ------------------------------------------------------------------ new game / continue
  Game.newGame = function () {
    G.cash = 0; G.rating = 4.5; G.upgrades = {}; G.stats = freshStats(); G.ach = {}; G.eggsSeen = {}; G.finaleSeen = false; G.rokoDebt = 0; G.seen = {}; G.buffs = []; G.nightFx = null; G.pendingEggs = [];
    G.recalcMods();
    H.Save.clear();
    Game.startNight(1);
  };
  Game.continueGame = function () {
    var s = G.loadSave(); if (!s) return Game.newGame();
    G.cash = s.cash || 0; G.rating = H.clamp(s.rating || 4.5, 0.5, 5); G.upgrades = s.upgrades || {}; G.ach = s.ach || {}; G.eggsSeen = s.eggs || {};
    G.stats = Object.assign(freshStats(), s.stats || {}); G.endlessBest = s.endlessBest || 0; G.finaleSeen = !!s.finaleSeen; G.rokoDebt = s.rokoDebt || 0; G.seen = s.seen || {};
    G.recalcMods();
    if (s.shop && (s.night || 1) > 1) {   // quit from the upgrade shop: reopen it so the unspent cash is not lost track of
      G.night = s.night - 1; G.endless = G.night > 5; G.scene = 'shop'; G.paused = false; UIreset();
      H.Screens.shop.enter(); H.Audio.startMusic(); return;
    }
    Game.startNight(Math.max(1, s.night || 1));
  };
  Game.hasSave = function () { var s = G.loadSave(); return !!(s && s.night); };

  Game.startNight = function (n) {
    var sv = H.Save.load(); if (sv && sv.shop) { sv.shop = false; H.Save.write(sv); }   // leaving the shop: Nastavi must not reopen it
    G.night = n; G.endless = n > 5;
    var nd = H.C.night(n);
    G.dur = nd.duration; G.goal = nd.goal; G.goalStars = nd.goalStars || 0;
    G.nightFx = nd.modifierFx || null; G.buffs = []; G.autoLight = 0; G.recalcMods();
    G.snap = { cash: G.cash, rating: G.rating, upgrades: JSON.parse(JSON.stringify(G.upgrades)), rokoDebt: G.rokoDebt, seen: JSON.parse(JSON.stringify(G.seen)) };
    if (n > 1) G.rating = Math.max(G.rating, 4.2, Math.min(4.5, G.rating + 0.25));   // rating carries over, but never worse than 4,2 (so 4,0 is fair)
    G.ratingStart = G.rating;
    G.scene = 'intro'; G.paused = false; UIreset();
    H.Screens.intro.enter(n, nd);
    H.Audio.startMusic();
  };
  function UIreset() { H.UI.modal = null; H.UI.lightingFor = null; }

  Game.beginPlay = function () {
    var n = G.night;
    G.scene = 'play'; G.clock = 0; G.cashStart = G.cash;
    G.smoke = 0; G.smokeOver = 0; G.ventCd = 0; G.ventFx = 0; G.streak = 0; G.wcBusyT = 0;
    G.customers = []; G.seatOcc = {}; G.brokenSeats = {}; G.props = []; G.timers = []; G.floaters = []; G.banners = [];
    G.fx.list = []; G.prompt = null; G.hint = ''; G.hintOverride = ''; G.nightStats = freshNightStats(); G.summary = null;
    G.tipMsg = ''; G.tipT = 0; G.tipsDone = {}; G.reviewCd = 12; G.buffs = []; G.autoLight = 0; G.flags = {}; G.peakHit = false; G.recalcMods(); G.smokeHigh = false;
    G.player = new H.Player();
    var nf = H.Nav.nearestFree(G.player.x, G.player.y, true); G.player.x = nf.x; G.player.y = nf.y;
    H.Events.startNight(n);
    H.Input.poke();
  };

  Game.retryNight = function () {
    if (G.snap) { G.cash = G.snap.cash; G.rating = G.snap.rating; G.upgrades = G.snap.upgrades; G.rokoDebt = G.snap.rokoDebt || 0; G.seen = G.snap.seen || {}; G.recalcMods(); }
    Game.startNight(G.night);
  };

  // ------------------------------------------------------------------ night end
  Game.endNight = function (why) {
    if (G.scene !== 'play') return;
    UIreset();
    // whoever is smoking pays; everyone else just leaves quietly
    G.customers.slice().forEach(function (c) {
      if (c.role === 'guest' || c.role === 'roko' || c.role === 'mislav' || c.role === 'matija' || c.role === 'tomislav') {
        if (c.state === 'smoking') { c.hold = null; c.pay(); }
      }
    });
    var nd = H.C.night(G.night), profit = G.cash - G.cashStart, ns = G.nightStats;
    // bonus goal (content: night.bonusGoal = {text, stat, gte, reward:{cash}})
    var bonus = null;
    if (nd.bonusGoal) {
      var got = (ns[nd.bonusGoal.stat] || 0) >= nd.bonusGoal.gte;
      bonus = { text: nd.bonusGoal.text, got: got, cash: got ? (nd.bonusGoal.reward.cash || 0) : 0 };
      if (got && bonus.cash) { G.cash += bonus.cash; profit += bonus.cash; G.stats.totalCash += bonus.cash; ns.tips += bonus.cash; }
    }
    // pass = goal cash (bonus included, as the summary shows it) AND the rating rule the night text promises (rating shown with one decimal)
    var ratingOk = !(G.goalStars > 0) || Math.round(G.rating * 10) / 10 >= G.goalStars, cashOk = G.goal > 0 ? profit >= G.goal : true, passed = cashOk && ratingOk;
    if (G.rating >= 4.5) G.stats.nightStars45++;
    if (ns.wrong === 0 && ns.served > 0) G.stats.nightNoWrong++;
    if (passed) {
      if (G.endless) G.stats.endlessNights++; else G.stats.nightsDone = Math.max(G.stats.nightsDone, G.night);
      G.stats.nightsPassed = Math.max(G.stats.nightsPassed, G.endless ? 5 : G.night);
    }
    if (G.endless && passed) G.endlessBest = Math.max(G.endlessBest, G.night - 5);
    if (G.night === 5 && !G.endless && passed) G.stats.nightsDone = Math.max(G.stats.nightsDone, 5);
    H.Achv.check('night');
    var jokes = H.Events.jokesSeen || [], endEgg = H.Events.nightEnd ? H.Events.nightEnd() : null;
    G.summary = {
      night: G.night, endless: G.endless, goal: G.goal, profit: profit, passed: passed, ratingFail: cashOk && !ratingOk, stats: ns, bonus: bonus,
      goalStars: G.goalStars, ratingStart: G.ratingStart, ratingEnd: G.rating,
      joke: endEgg || (jokes.length ? H.pick(jokes) : (H.pick(H.C.loadingQuotes) || {}).q || ''),
      outro: nd.outro, outro2: nd.endless ? '' : (passed ? nd.outroGood : nd.outroBad), newAch: G.newAch || []
    };
    G.newAch = [];
    G.scene = 'summary'; H.Screens.summary.enter();
    if (passed) H.Audio.perfect(); else H.Audio.bad();
  };
  Game.fail = function (kind) {
    if (G.scene !== 'play' || G.godMode) return;
    UIreset();
    G.scene = 'fail'; G.failKind = kind;
    if (G.endless) G.endlessBest = Math.max(G.endlessBest, G.night - 6);
    H.Audio.alarm();
    H.Screens.fail.enter(kind);
  };
  Game.afterSummary = function () {
    var s = G.summary;
    if (!s.passed) { Game.retryNight(); return; }
    if (!G.endless && G.night === 5 && !G.finaleSeen) { G.scene = 'finale'; H.Screens.finale.enter(); return; }
    Game.goShop();
  };
  Game.goShop = function () {
    G.scene = 'shop'; G.save(G.night + 1, true); H.Screens.shop.enter();
  };
  Game.nextNight = function () { G.save(G.night + 1, false); Game.startNight(G.night + 1); };
  Game.toTitle = function () { UIreset(); G.scene = 'title'; G.paused = false; H.Screens.title.enter(); };

  // ------------------------------------------------------------------ interactions
  function spotPos(k) { var s = H.Nav.L.spots && H.Nav.L.spots[k]; return s || null; }
  var SPOT_LABEL = { humidor: 'Humidor', tap: 'Točeno pivo', spirits: 'Žestice', coffee: 'Kava', vent: 'Ventilacija' };
  function drinksFor(src) {
    var l = H.C.drinks.filter(function (d) { return d.source === src; });
    return l.length ? l : H.C.drinks;
  }
  function defaultLabel(c, P) {
    if (c.frozen > 0) return 'Zamrznut...';
    if (c.state === 'ordering') {
      var n = c.needs(), can = (n.cigar && P.carry.cigars.length) || (n.drink && P.carry.drinks.length) || (!c.choc && P.has('black_chocolate') && c.order.cigar);
      if (can) return 'E — Posluži';
      var names = []; if (n.cigar) names.push(H.C.itemById[n.cigar].name); if (n.drink) names.push(H.C.itemById[n.drink].name);
      return 'Treba: ' + names.join(' + ');
    }
    if (c.state === 'needLight') return 'E — Zapali cigaru';
    if (c.state === 'smoking' && !c.choc && c.order.cigar && P.has('black_chocolate')) return 'E — Daj crnu čokoladu';
    return null;
  }
  function defaultInteract(c, P) {
    if (c.frozen > 0) { P.say('Ne čuje me, sluša nekoga...', 1.6); return; }
    if (c.state === 'ordering') {
      var d = c.serve(P);
      if (!d) {
        var n = c.needs(), names = [];
        if (n.cigar) names.push(H.C.itemById[n.cigar].name); if (n.drink) names.push(H.C.itemById[n.drink].name);
        P.say('Trebam: ' + names.join(' + '), 2.6);
      }
    } else if (c.state === 'needLight') {
      H.UI.openLighting(c);
    } else if (c.state === 'smoking') c.serve(P);
  }

  function findTarget() {
    var P = G.player, L = H.Nav.L, best = null, bd = 1e9;
    function consider(t, d, range) {
      if (d > range) return;
      var s = d - (t.pri || 0);
      if (s < bd) { bd = s; best = t; }
    }
    ['humidor', 'tap', 'spirits', 'coffee', 'vent', 'wc_door'].forEach(function (k) {
      var s = spotPos(k); if (!s) return;
      var d = H.dist(P.x, P.y, s.x, s.y), t = { x: s.x, y: s.y - 30, kind: 'spot', key: k };
      if (k === 'humidor') { t.label = 'E — Humidor (cigare)'; t.act = function () { H.UI.openMenu('cigar', 'Humidor', H.C.cigars); H.Events.trigger('interact', 'humidor'); }; }
      else if (k === 'vent') { t.label = G.ventCd > 0 ? 'Ventilacija se hladi (' + Math.ceil(G.ventCd) + ' s)' : 'E — Ventilacija (pročišći dim)'; t.act = Game.useVent; }
      else if (k === 'wc_door') { t.label = G.wcBusyT > 0 ? 'WC je zauzet' : 'WC (samo za goste)'; t.act = function () { P.say('WC je samo za goste!', 2); }; }
      else { t.label = 'E — ' + SPOT_LABEL[k]; t.act = function () { H.UI.openMenu('drink', SPOT_LABEL[k], drinksFor(k)); }; }
      consider(t, d, 62);
    });
    (H.Events.spotList ? H.Events.spotList() : []).forEach(function (sp) {
      consider({ x: sp.x, y: sp.y - 30, kind: 'egg', label: 'E — ' + sp.label, act: function () { H.Events.trigger('interact', sp.id); } }, H.dist(P.x, P.y, sp.x, sp.y), 60);
    });
    G.customers.forEach(function (c) {
      if (c.dead || c.hidden) return;
      var cx = c.x, cy = c.y, d = H.dist(P.x, P.y, cx, cy - 30);
      var lab = H.Events.labelFor(c, P);
      if (lab === undefined) lab = defaultLabel(c, P);
      if (!lab) return;
      var isAct = /^E /.test(lab) || /^Q/.test(lab) ? 0 : 0;
      consider({ x: cx, y: UI_top(c), kind: 'cust', c: c, label: lab, pri: c.pri || 0, act: function () { if (!H.Events.interact(c, P)) defaultInteract(c, P); } }, d, c.range || 92);
    });
    (G.props || []).forEach(function (p) {
      if (p.dead) return;
      var lab = p.label && p.label(P); if (!lab) return;
      consider({ x: p.x, y: p.y - 26, kind: 'prop', p: p, label: lab, act: function () { p.act(P); } }, H.dist(P.x, P.y, p.x, p.y), p.range || 60);
    });
    return best;
  }
  function UI_top(c) { return H.UI.orderBubbleTop(c) - (c.state === 'ordering' ? 54 : 6); }

  Game.useVent = function () {
    if (G.ventCd > 0) { G.player.say('Ventilacija se hladi.', 1.5); return; }
    G.ventCd = G.mod.ventCd; G.ventFx = 3; G.count('vents');
    H.Audio.vent(); G.player.say('Ventilacija!', 1.4);
    H.Events.trigger('interact', 'vent'); H.Achv.check('vent');
  };

  // ------------------------------------------------------------------ play update
  function updatePlay(dt) {
    var P = G.player, Ui = H.UI, Inp = H.Input;
    // modal handling
    if (Ui.modal) {
      Ui.updateModal(dt, G);
      if (Ui.modal && Ui.modal.pauses) { G.prompt = null; return; }
    } else if (Inp.escPressed()) { G.paused = true; H.Screens.pause.enter(); return; }
    if (Inp.pressed('KeyM')) H.Audio.toggleMute();

    // timers
    for (var ti = G.timers.length - 1; ti >= 0; ti--) { G.timers[ti].t -= dt; if (G.timers[ti].t <= 0) { var f = G.timers[ti].fn; G.timers.splice(ti, 1); f(); } }

    // buffs (Roko's hotfixes) + review cooldown
    if (G.reviewCd > 0) G.reviewCd -= dt;
    if (G.buffs.length) {
      var exp = false;
      for (var bi = G.buffs.length - 1; bi >= 0; bi--) {
        G.buffs[bi].t -= dt;
        if (G.buffs[bi].t <= 0) { if (G.buffs[bi].fx && G.buffs[bi].fx.autoLight) G.autoLight = 0; G.buffs.splice(bi, 1); exp = true; }
      }
      if (exp) G.recalcMods();
    }
    // clock
    G.clock += dt * (G.timeScale || 1);
    if (G.clock >= G.dur) { G.clock = G.dur; Game.endNight('time'); return; }

    // player
    var blockMove = Ui.modal && Ui.modal.blocksMove;
    var ax = blockMove ? { x: 0, y: 0 } : Inp.axis();
    P.update(dt, G, ax.x, ax.y);

    // events (spawning etc.)
    H.Events.update(dt);

    // customers
    G.smokeIn = 0;
    for (var i = 0; i < G.customers.length; i++) G.customers[i].update(dt, G);
    for (i = G.customers.length - 1; i >= 0; i--) if (G.customers[i].dead) { G.customers[i].freeSeat(); if (G.customers[i].onRemove) G.customers[i].onRemove(); G.customers.splice(i, 1); }

    // smoke
    updateSmoke(dt);

    // interaction
    G.prompt = null; G.target = null;
    if (!Ui.modal) {
      var t = findTarget(); G.target = t;
      if (t) G.prompt = { text: t.label, x: t.x, y: t.y };
      if (t && Inp.interactPressed()) t.act();
      if (Inp.pressed('KeyQ') && P.shoutCd <= 0) Game.shout();
    }

    // fx / floaters / banners
    G.fx.update(dt);
    for (i = G.floaters.length - 1; i >= 0; i--) { G.floaters[i].t -= dt; if (G.floaters[i].t <= 0) G.floaters.splice(i, 1); }
    G.updateBanners(dt);
    if (G.shoutFx > 0) G.shoutFx -= dt;
    if (G.wcBusyT > 0) G.wcBusyT -= dt;
    updateHints();
    H.Achv.tick(dt);

    // fail conditions
    if (G.rating <= 0.001 && !G.godMode) Game.fail('stars');
  }

  Game.shout = function () {
    var P = G.player;
    P.shoutCd = 1.2; H.Audio.shout();
    P.say(H.pick(['Stani!', 'Izlazite!', 'WC je samo za goste!']), 1.5);
    G.fx.ring(P.x, P.y - 40, '#ffb060', 200); G.shoutFx = 0.5;
    H.Events.onShout(P);
  };

  function updateSmoke(dt) {
    var decay = 0.45 * G.mod.smokeDecay;
    G.smoke += (G.smokeIn - decay) * dt;
    if (G.ventFx > 0) { G.ventFx -= dt; G.smoke -= (G.mod.ventPower / 3) * dt; }
    if (G.ventCd > 0) G.ventCd -= dt;
    G.smoke = H.clamp(G.smoke, 0, 130);
    if (G.smoke > 100) { G.smokeOver += dt; if (G.smokeOver >= 10) Game.fail('smoke'); }
    else G.smokeOver = Math.max(0, G.smokeOver - dt * 2);
    if (G.godMode) { G.smokeOver = 0; }
    if (G.smoke >= 99) G.peakHit = true;
    else if (G.peakHit && G.smoke < 80) { G.peakHit = false; G.count('smokePeak99'); }
  }

  function updateHints() {
    var h = '', P = G.player, nd = H.C.night(G.night);
    // scripted tips (content: night.tips[{t,text}]) stay on the hint bar for 9 s
    if (G.tipT > 0) G.tipT -= 1 / 60;
    (nd.tips || []).forEach(function (tp, i) {
      if (!G.tipsDone[i] && G.clock >= tp.t) { G.tipsDone[i] = true; G.tipMsg = tp.text; G.tipT = 9; }
    });
    if (G.hintOverride) h = G.hintOverride;
    else if (G.night === 1 && !G.endless && !(nd.tips && nd.tips.length)) {
      var ord = G.customers.filter(function (c) { return c.state === 'ordering'; })[0];
      var lit = G.customers.filter(function (c) { return c.state === 'needLight'; })[0];
      if (lit) h = 'Drži E i pusti u zelenom polju.';
      else if (ord && !P.any()) h = 'Gost naručuje: E na Humidoru (desno) za cigaru, na šanku za piće.';
      else if (ord && P.any() && (ord.needsCount() > 0)) h = 'Nosi ono što piše u oblačiću do gosta pa pritisni E.';
      else if (G.smoke > 35) h = 'Dim raste! E na ventilaciji (mjerač na zidu).';
      else if (G.clock < 8) h = 'WASD - hodanje, E - interakcija, Q - viči, Esc - pauza.';
    }
    G.hint = h;
  }

  // ------------------------------------------------------------------ render
  var frameTime = 0;
  function drawWorld(ctx) {
    var bg = H.Assets.getBG(H.Nav.L);
    ctx.drawImage(bg, 0, 0, 1280, 720);
    for (var bs = 0; bs < H.Nav.L.seats.length; bs++) if (G.brokenSeats[H.Nav.L.seats[bs].id]) H.UI.drawBrokenSeat(ctx, H.Nav.L.seats[bs], G, false);
    // draw list y-sorted
    var list = [], i;
    for (i = 0; i < G.customers.length; i++) if (!G.customers[i].hidden) list.push({ y: G.customers[i].sortY(), d: G.customers[i] });
    for (i = 0; i < G.props.length; i++) if (!G.props[i].dead) list.push({ y: G.props[i].y, d: G.props[i] });
    list.push({ y: G.player.y, d: G.player });
    list.sort(function (a, b) { return a.y - b.y; });
    for (i = 0; i < list.length; i++) {
      list[i].d.draw(ctx);
    }
    G.fx.draw(ctx);
    // smoke haze
    var a = H.clamp((G.smoke - 25) / 150, 0, 0.48);
    if (a > 0.01) {
      ctx.fillStyle = 'rgba(190,178,158,' + a + ')'; ctx.fillRect(0, 52, 1280, 668);
    }
    if (G.smoke > 100) { ctx.fillStyle = 'rgba(200,30,10,' + (0.12 + 0.1 * Math.sin(G.t * 8)) + ')'; ctx.fillRect(0, 52, 1280, 668); }
    // evening tint (a touch darker towards 22:00)
    var k = G.clock / G.dur; if (k > 0.5) { ctx.fillStyle = 'rgba(10,15,40,' + ((k - 0.5) * 0.28) + ')'; ctx.fillRect(0, 52, 1280, 668); }
    H.UI.drawWorldOverlays(ctx, G);
    if (G.target && G.target.kind === 'cust') { // subtle ring under the targeted guest
      var c = G.target.c; ctx.strokeStyle = 'rgba(255,220,140,' + (0.5 + 0.3 * Math.sin(G.t * 8)) + ')'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(c.x, c.y, 30, 11, 0, 0, 6.3); ctx.stroke();
    }
    if (G.shoutFx > 0) { ctx.fillStyle = 'rgba(255,180,90,' + G.shoutFx * 0.15 + ')'; ctx.fillRect(0, 52, 1280, 668); }
  }

  function drawDebug(ctx) {
    var N = H.Nav, L = N.L, i;
    ctx.save();
    // nav grid
    ctx.fillStyle = 'rgba(255,0,0,0.15)';
    for (var cy = 0; cy < N.rows; cy++) for (var cx = 0; cx < N.cols; cx++) if (N.gridC[cy * N.cols + cx]) ctx.fillRect(cx * N.cell + 1, cy * N.cell + 1, N.cell - 2, N.cell - 2);
    ctx.strokeStyle = 'rgba(255,60,60,0.9)'; ctx.lineWidth = 1;
    N.rects.forEach(function (r) { ctx.strokeRect(r.x, r.y, r.w, r.h); });
    ctx.strokeStyle = 'rgba(255,160,0,0.9)';
    N.circles.forEach(function (c) { ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 6.3); ctx.stroke(); });
    if (N.staffRect) { ctx.strokeStyle = 'rgba(80,160,255,0.9)'; ctx.strokeRect(N.staffRect.x, N.staffRect.y, N.staffRect.w, N.staffRect.h); }
    ctx.fillStyle = '#5f5';
    (L.seats || []).forEach(function (s) { ctx.fillRect(s.x - 3, s.y - 3, 6, 6); ctx.fillStyle = G.seatOcc[s.id] ? '#f55' : '#5f5'; ctx.fillText(s.id, s.x + 5, s.y - 5); });
    ctx.fillStyle = '#5cf'; Object.keys(L.spots || {}).forEach(function (k) { var s = L.spots[k]; ctx.beginPath(); ctx.arc(s.x, s.y, 6, 0, 6.3); ctx.fill(); ctx.fillText(k, s.x + 8, s.y); });
    ctx.strokeStyle = '#ff0'; ctx.beginPath(); ctx.arc(G.player.x, G.player.y, G.player.r, 0, 6.3); ctx.stroke();
    G.customers.forEach(function (c) {
      ctx.strokeStyle = '#0ff'; ctx.beginPath(); ctx.moveTo(c.x, c.y); (c.path || []).forEach(function (p) { ctx.lineTo(p.x, p.y); }); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = '11px monospace'; ctx.fillText(c.id + ':' + c.state + (c.ev && c.ev.phase ? '/' + c.ev.phase : ''), c.x - 20, c.y + 30);
    });
    ctx.fillStyle = '#fff'; ctx.font = '12px monospace';
    ctx.fillText('fps ' + Math.round(1 / Math.max(0.001, frameTime)) + '  scene=' + G.scene + '  smoke=' + G.smoke.toFixed(1) + ' cust=' + G.customers.length + ' clock=' + G.clock.toFixed(0), 10, 715);
    ctx.restore();
  }

  Game.render = function (ctx, ft) {
    frameTime = ft || 0.016;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1280, 720);
    H.UI.beginFrame();
    switch (G.scene) {
      case 'loading': H.Screens.loading.draw(ctx); break;
      case 'title': H.Screens.title.draw(ctx); break;
      case 'intro': H.Screens.intro.draw(ctx); break;
      case 'summary': H.Screens.summary.draw(ctx); break;
      case 'shop': H.Screens.shop.draw(ctx); break;
      case 'fail': H.Screens.fail.draw(ctx); break;
      case 'finale': H.Screens.finale.draw(ctx); break;
      case 'play':
        drawWorld(ctx);
        H.UI.drawHUD(ctx, G);
        H.UI.drawBanners(ctx, G);
        H.UI.drawModal(ctx, G);
        if (G.paused) H.Screens.pause.draw(ctx);
        break;
    }
    if (H.debug && G.scene === 'play') drawDebug(ctx);
  };

  Game.step = function (dt) {
    G.t += dt;
    H.Input.beginStep();
    switch (G.scene) {
      case 'loading': H.Screens.loading.update(dt); break;
      case 'title': H.Screens.title.update(dt); break;
      case 'intro': H.Screens.intro.update(dt); break;
      case 'summary': H.Screens.summary.update(dt); break;
      case 'shop': H.Screens.shop.update(dt); break;
      case 'fail': H.Screens.fail.update(dt); break;
      case 'finale': H.Screens.finale.update(dt); break;
      case 'play':
        if (G.paused) H.Screens.pause.update(dt);
        else updatePlay(dt);
        break;
    }
    if (G.scene !== 'play' || G.paused) { if (H.Input.pressed('KeyM')) H.Audio.toggleMute(); }
  };
  Game.onBlur = function () { if (H.debug) return; if (G.scene === 'play' && !G.paused && !(H.UI.modal && H.UI.modal.pauses)) { G.paused = true; H.Screens.pause.enter(); } };
})();
