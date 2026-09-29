// events.js - spawn schedule, easter eggs (formal triggers), baka / GG Arena gamers / shop rush, and the hooks
// that connect the four regulars (regulars.js) to the customer loop.
//
// CONTENT KEYS READ (all optional; built-in Croatian defaults are used when missing), window.CONTENT:
//   events.baka      timer penaltyIgnored intro complaints[] choices[] ignored ignoredLines[] escortShout[] variants{baka1,baka2:{name,intro,complaints,ignored,ignoredLines,tree}}
//   events.gamers    alert enter[] shout[] caught[] reachedWC[] espresso[] flee[] wcInside[] wcLeave[] bought blocked[]
//   events.shopRush  announce banner lines[] hrvoje[] crowd[] end[]
//   events.<regular> see regulars.js
//   easterEggs[]     { id, trigger, text }  trigger: interact:<obj> idle:<s> random serve:<cigar>+<drink> time:HH:MM event:<name>
//                    night:<n>|night:end stat:<name><op><n> enter:<id>|enter:any upgrade:<id>
//   nights[].spawns  { t, who, order?, count? }   endless { pool, fixed }
(function () {
  'use strict';
  var H = window.H, G = H.G, UI = H.UI, Customer = H.Customer, X = H.X, T = H.Tree;
  var E = H.Events = { jokesSeen: X.jokes, sched: [], rushGuests: [], gamersOn: 0, eggCd: 0, ambT: 60, statT: 2 };

  // ------------------------------------------------------------------ easter eggs
  var LEGACY = { liszt: 'interact:wall_quote', pairing_hrvoje: 'serve:cigar_hoyo+rum_caroni', sancho: 'serve:cigar_sancho', idle: 'idle:30' };
  var KNOWN = { interact: 1, idle: 1, random: 1, serve: 1, time: 1, event: 1, night: 1, stat: 1, enter: 1, upgrade: 1 };
  var SPOTS = [
    { id: 'wall_quote', x: 72, y: 170, label: 'Pogledaj citat' },
    { id: 'bubble_panel', x: 770, y: 168, label: 'Pogledaj plavi zid' },
    { id: 'lightbulb', x: 592, y: 170, label: 'Edisonova žarulja' },
    { id: 'poster', x: 1146, y: 172, label: 'Pogledaj plakat' },
    { id: 'chandelier', x: 495, y: 610, label: 'Pogledaj luster' },
    { id: 'rug', x: 690, y: 484, label: 'Poravnaj tepih' }
  ];
  function eggId(e) { return e.id || e.text; }
  function parseEgg(e) {
    if (e._p) return e._p;
    var t = String(e.trigger || 'random').trim(); t = LEGACY[t] || t;
    var i = t.indexOf(':'), type = i < 0 ? t : t.slice(0, i), arg = i < 0 ? '' : t.slice(i + 1), p;
    if (!KNOWN[type]) { type = 'random'; arg = ''; }
    p = { type: type, arg: arg };
    if (type === 'serve') { var parts = arg.split('+'); p.cig = parts[0] || '*'; p.dr = parts[1] || '*'; }
    if (type === 'time') { var m = arg.match(/(\d+):(\d+)/); p.min = m ? (parseInt(m[1], 10) - 16) * 60 + parseInt(m[2], 10) : 0; }
    if (type === 'stat') { var m2 = arg.match(/^([a-zA-Z_]+)\s*(>=|<=|==|>|<|=)\s*(-?[\d.]+)$/); p.stat = m2 ? m2[1] : ''; p.op = m2 ? m2[2] : '>='; p.val = m2 ? parseFloat(m2[3]) : 0; }
    if (type === 'idle') p.sec = parseFloat(arg) || 30;
    e._p = p; return p;
  }
  function unseen(e) { return !G.eggsSeen[eggId(e)]; }
  function eggs(type) { return H.C.eggs.filter(function (e) { return parseEgg(e).type === type && unseen(e); }); }
  function showEgg(e) {
    var id = eggId(e); if (G.eggsSeen[id]) return;
    G.eggsSeen[id] = true; G.count('eggs');
    var txt = e.text || e.id;
    X.joke(txt);
    G.pendingEggs.push(txt);   // shown one at a time by updateEggs
    H.Achv.check('egg');
  }
  function matches(e, type, arg) {
    var p = parseEgg(e); if (p.type !== type) return false;
    switch (type) {
      case 'interact': case 'event': case 'upgrade': return p.arg === arg;
      case 'enter': return p.arg === arg || p.arg === 'any';
      case 'night': return String(p.arg) === String(arg);
      case 'serve':
        if (p.cig === '*' && p.dr === '*') return false;
        return (p.cig === '*' || p.cig === arg.cigar) && (p.dr === '*' || p.dr === arg.drink);
    }
    return false;
  }
  E.trigger = function (type, arg) {
    var n = 0;
    H.C.eggs.forEach(function (e) { if (unseen(e) && matches(e, type, arg)) { showEgg(e); n++; } });
    return n;
  };
  E.nightEnd = function () {   // an easter egg text for the summary screen (trigger night:end)
    var l = eggs('night').filter(function (e) { return parseEgg(e).arg === 'end'; });
    if (!l.length) return null;
    var e = H.pick(l); G.eggsSeen[eggId(e)] = true; G.count('eggs'); X.joke(e.text); H.Achv.check('egg');
    return e.text;
  };
  E.spotList = function () {
    if (G.scene !== 'play') return [];
    var ids = {}; eggs('interact').forEach(function (e) { ids[parseEgg(e).arg] = 1; });
    return SPOTS.filter(function (s) { return ids[s.id]; });
  };
  function evalStat(p) {
    var v = p.stat === 'stars' || p.stat === 'rating' ? G.rating : (p.stat === 'night' ? G.night : (G.stats[p.stat] || 0));
    switch (p.op) { case '>': return v > p.val; case '<': return v < p.val; case '<=': return v <= p.val; case '==': case '=': return v === p.val; default: return v >= p.val; }
  }
  function updateEggs(dt) {
    if (G.clock < 1.5) return;
    E.ambT -= dt;
    if (E.ambT <= 0 && !UI.modal) { E.ambT = H.rnd(70, 110); var r = eggs('random'); if (r.length) showEgg(H.pick(r)); }
    var idle = H.Input.idleFor();
    if (idle > 4 && !UI.modal) eggs('idle').forEach(function (e) { if (idle >= parseEgg(e).sec) showEgg(e); });
    eggs('time').forEach(function (e) { var m = parseEgg(e).min; if (G.clock >= Math.min(m, G.dur - 4)) showEgg(e); });
    E.statT -= dt;
    if (E.statT <= 0) { E.statT = 2; eggs('stat').forEach(function (e) { if (evalStat(parseEgg(e))) showEgg(e); }); }
    E.eggCd -= dt;
    if (E.eggCd <= 0 && G.pendingEggs.length && !UI.modal) {
      G.banner(G.pendingEggs.shift(), { sub: 'Skriveno u Podmornici', color: '#9ad0ff', size: 17, dur: 7, prio: 0 }); H.Audio.buff(); E.eggCd = 10;
    }
  }

  // ------------------------------------------------------------------ seats & orders
  function freeSeats(pred) {
    return H.Nav.L.seats.filter(function (s) { return !G.seatOcc[s.id] && !G.brokenSeats[s.id] && (!pred || pred(s)); });
  }
  E.freeSeats = freeSeats;
  function randomOrder(id) {
    var C = H.C, def = C.cust(id);
    if (def && def.orders && def.orders.length && (id.indexOf('guest') < 0 || H.chance(0.6))) {
      var o = H.pick(def.orders); if (o && (o.cigar || o.drink)) return { cigar: o.cigar || null, drink: o.drink || null };
    }
    var n = G.night, tier = G.endless ? 1 : H.clamp(0.5 + 0.1 * n, 0.6, 1);
    var cigs = C.cigars.slice().sort(function (a, b) { return a.price - b.price; }), drs = C.drinks.slice().sort(function (a, b) { return a.price - b.price; });
    cigs = cigs.slice(0, Math.max(2, Math.ceil(cigs.length * tier))); drs = drs.slice(0, Math.max(2, Math.ceil(drs.length * tier)));
    var r = H.rand(), o2 = { cigar: H.pick(cigs).id, drink: H.pick(drs).id };
    if (r >= 0.72 && r < 0.9) o2.cigar = null; else if (r >= 0.9) o2.drink = null;
    return o2;
  }
  E.randomOrder = randomOrder;

  E.spawnGuest = function (opts) {
    opts = opts || {};
    var seats = freeSeats(opts.seatPred);
    if (!seats.length) return null;
    var id = opts.id;
    if (!id) {   // variety: avoid repeating the last two random guests
      var all = ['guest1', 'guest2', 'guest3', 'guest4'], rec = E.recentGuests || (E.recentGuests = []);
      var pool = all.filter(function (g) { return rec.indexOf(g) < 0; });
      id = H.pick(pool.length ? pool : all); rec.push(id); if (rec.length > 2) rec.shift();
    }
    var c = new Customer(id, opts);
    c.setOrder(opts.order || randomOrder(id));
    c.assignSeat(H.pick(seats));
    G.customers.push(c);
    G.after(2.5, function () { E.trigger('enter', 'any'); });
    return c;
  };

  // ------------------------------------------------------------------ night setup / schedule
  function gapFor(n) { return [30, 27, 24, 21, 19][H.clamp(n, 1, 5) - 1]; }
  function weighted(pool) {
    var tot = 0; pool.forEach(function (p) { tot += p.weight || 1; });
    var r = H.rand() * tot;
    for (var i = 0; i < pool.length; i++) { r -= pool[i].weight || 1; if (r <= 0) return pool[i]; }
    return pool[pool.length - 1];
  }
  function endlessSchedule(nd) {
    var EC = H.C.endless, list = [], t = 3, gap = Math.max(8, 19 / Math.max(0.6, G.mod.spawn)), used = {}, nb = 0, ng = 0;
    while (t < G.dur - 18) {
      var w = weighted(EC.pool).who, key = String(w);
      if (/^(roko|mislav|matija|tomislav)$/.test(key)) { if (used[key]) key = 'guest'; else used[key] = 1; }
      else if (/^baka/.test(key)) { if (nb >= 3) key = 'guest'; else nb++; }
      else if (/^gam/.test(key)) { if (ng >= 3) key = 'guest'; else ng++; }
      list.push({ t: t, who: key });
      t += gap * H.rnd(0.75, 1.25);
    }
    (EC.fixed || []).forEach(function (f) { list.push({ t: +f.t || 240, who: f.who, count: f.count }); });
    return list;
  }
  E.startNight = function (n) {
    var nd = H.C.night(n), spawns = [], guestCount = 0;
    E.sched = []; E.rushGuests = []; E.rushLeft = 0; E.rushCounted = true; E.ambT = H.rnd(45, 75); E.statT = 2; E.eggCd = 6;
    if (nd.endless) spawns = endlessSchedule(nd); else spawns = nd.spawns || [];
    spawns.forEach(function (sp) {
      if (!sp) return;
      var whos = Array.isArray(sp.who) ? sp.who : [sp.who];
      whos.forEach(function (w) {
        w = String(w || 'guest');
        E.sched.push({ t: (+sp.t) || 0, who: w, order: sp.order || null, count: sp.count || 0 });
        if (/^guest/i.test(w)) guestCount++;
      });
    });
    if (guestCount < 4) {   // content without guests: fill the night ourselves
      var t = 4 + H.rnd(0, 4), gap = gapFor(n);
      while (t < G.dur - 25) { E.sched.push({ t: t, who: 'guest' }); t += gap * H.rnd(0.7, 1.3); }
    } else if (!nd.endless && G.mod.spawn > 1.01) {   // night modifier: "gostiju ima 10% više"
      var extra = Math.round(guestCount * (G.mod.spawn - 1));
      for (var i = 0; i < extra; i++) E.sched.push({ t: H.rnd(10, G.dur - 40), who: 'guest' });
    }
    E.sched.sort(function (a, b) { return a.t - b.t; });
    if (H.Regs && H.Regs.reset) H.Regs.reset();
    G.props = [];
    H.Achv.newNight();
    E.trigger('night', n);
  };

  // ------------------------------------------------------------------ dispatch
  function fireWho(s) {
    var who = typeof s === 'string' ? s : s.who, w = String(who).toLowerCase().replace(/[\s_-]/g, ''), order = s.order || null, count = s.count || 0;
    if (/^baka/.test(w)) return spawnBaka(w === 'baka1' || w === 'baka2' ? w : null);
    if (/^gam|^gg|gejm/.test(w)) return spawnGamers(count);
    if (/rush|shop/.test(w)) return spawnRush(count);
    if (w === 'roko' || w === 'mislav' || w === 'matija' || w === 'tomislav') return spawnRegular(w, order);
    if (/^guest[1-4]$/.test(w)) return !!E.spawnGuest({ id: w, order: order });
    return !!E.spawnGuest({ order: order });
  }
  E.spawn = function (who) { return fireWho(String(who)); };
  E.forceEvent = function (name) { return fireWho(String(name)); };

  E.update = function (dt) {
    while (E.sched.length && E.sched[0].t <= G.clock) {
      var s = E.sched.shift();
      var alive = G.customers.filter(function (c) { return c.seat; }).length;
      var isGuest = /^guest/i.test(s.who);
      if (isGuest && alive >= 11) { s.t = G.clock + 5; E.sched.push(s); E.sched.sort(function (a, b) { return a.t - b.t; }); continue; }
      if (!fireWho(s) && !/^(gam|gg|rush|shop|baka)/i.test(s.who)) {
        if (s.tries == null) s.tries = 0;
        if (++s.tries < 14) { s.t = G.clock + 4; E.sched.push(s); E.sched.sort(function (a, b) { return a.t - b.t; }); }
      }
    }
    updateEggs(dt);
    if (E.rushGuests.length && !E.rushCounted && E.rushLeft <= 0 && E.rushGuests.every(function (c) { return c.dead; })) {
      E.rushCounted = true; G.count('rushDone');
      var el = X.line('shopRush', 'end'); if (el) G.banner(el, { color: '#ffd58a', dur: 4 });
    }
    if (H.Regs && H.Regs.update) H.Regs.update(dt);
  };

  // ------------------------------------------------------------------ BAKA
  function bakaVariant(id) { var v = (X.EV('baka').variants || {})[id]; return (v && typeof v === 'object') ? v : null; }
  var DEF_FX = { best: { stars: 0.1, cash: 5, smoke: -5 }, ok: { smoke: 3 }, bad: { stars: -0.2, smoke: 12 } };
  function bakaTree(c) {
    var v = bakaVariant(c.id), ev = X.EV('baka'), tree = v && v.tree && v.tree.nodes ? v.tree : null, i;
    if (!tree) {
      var ch = (Array.isArray(ev.choices) ? ev.choices : ((ev.__def || {}).choices || [])).filter(function (x) { return x && x.text; });
      if (!ch.length) ch = [
        { text: 'Gospođo, sjednite do prozora. Kamilica je na račun kuće.', result: 'best', reply: 'Eto, to je pristojan mladić.' },
        { text: 'Otvorit ću prozor, pa će biti bolje.', result: 'ok', reply: 'Hm. Vidjet ćemo.' },
        { text: 'Ako vam smeta, vrata su tamo.', result: 'bad', reply: 'Bezobrazluk! Zvat ću komunalce!' }
      ];
      var nodes = { a: { who: c.id, text: (v && v.opening) || X.line('baka', 'intro', 'Guši me taj dim!'), choices: [] } };
      ch.forEach(function (o, k) {
        var res = String(o.result || 'ok').toLowerCase();
        nodes.a.choices.push({ text: o.text, next: 'r' + k, tag: res, fx: o.fx || DEF_FX[res] });
        nodes['r' + k] = { who: c.id, text: o.reply || 'Hm.', end: true, tag: res };
      });
      tree = { start: 'a', nodes: nodes };
    }
    // shuffle the choice order so the best answer is not always first
    var copy = { start: tree.start, nodes: {} };
    Object.keys(tree.nodes).forEach(function (k) { copy.nodes[k] = tree.nodes[k]; });
    var a = copy.nodes[copy.start];
    if (a && a.choices) { var na = {}; Object.keys(a).forEach(function (f) { na[f] = a[f]; }); na.choices = H.shuffle(a.choices.slice()); copy.nodes[copy.start] = na; }
    return copy;
  }
  function spawnBaka(id) {
    id = id || H.pick(['baka1', 'baka2']);
    var ev = X.EV('baka'), v = bakaVariant(id);
    var c = new Customer(id, { role: 'baka', speed: 78 });
    c.name = (v && v.name) || 'Baka'; c.state = 'ev'; c.silentEntry = true; c.range = 84; c.pri = 3;
    G.customers.push(c);
    var tbl = H.Nav.L.tables.slice().sort(function (a, b) { return smokersAt(b) - smokersAt(a) + H.rnd(-0.5, 0.5); })[0];
    var tgt = H.Nav.nearestFree(tbl.x, tbl.y + tbl.r + 30, false);
    c.walkTo(tgt.x, tgt.y, false);
    var total = (typeof ev.timer === 'number' ? ev.timer : 15) + G.mod.bakaPatience;
    c.ev = { phase: 'walk', table: tbl, ignoreT: total, total: total };
    c.ai = bakaAI;
    H.Audio.alert(); E.trigger('event', 'baka');
    G.banner((v && v.intro) || X.line('baka', 'intro', 'Baka se žali na dim!'), { portrait: id, mood: 'angry', sub: 'Priđi joj i pritisni E (Q je grubo)', color: '#ffb0a0', dur: 5 });
    return true;
  }
  function smokersAt(t) { return G.customers.filter(function (c) { return c.state === 'smoking' && H.dist(c.x, c.y, t.x, t.y) < 120; }).length; }
  function bakaLine(c, key) {
    var v = bakaVariant(c.id), l = v && H.lines(v[key]);
    return H.pick(l && l.length ? l : X.lines('baka', key)) || '';
  }
  function bakaAI(c, dt) {
    var e = c.ev;
    if (e.phase === 'walk') {
      if (!c.chimed && c.y < X.doorPos().y + 8) { c.chimed = true; H.Audio.doorChime(); }
      if (c.moveAlong(dt)) { e.phase = 'complain'; e.talkT = 0; c.face = 'right'; c.icon = 'smoke_puff'; c.say(bakaLine(c, 'complaints') || 'Ovo je nezdravo!', 3.6); H.Audio.alert(); }
    } else if (e.phase === 'complain') {
      c.moving = false;
      if (!G.godMode) e.ignoreT -= dt;
      c.barW = e.ignoreT / e.total; c.barColor = e.ignoreT < 5 ? '#ff3a2a' : '#ffb04a';
      e.talkT += dt;
      if (e.talkT > 5) { e.talkT = 0; c.say(bakaLine(c, 'complaints') || 'Zovem komunalne!', 3.2); }
      if (e.ignoreT <= 0) {
        var v = bakaVariant(c.id), pen = X.EV('baka').penaltyIgnored || { stars: -0.3, smoke: 15 };
        G.banner((v && v.ignored) || X.line('baka', 'ignored', 'Baka zove komunalce!'), { portrait: c.id, mood: 'angry', sub: (pen.stars ? String(pen.stars).replace('.', ',') + '★  ' : '') + (pen.smoke ? 'dim +' + pen.smoke : ''), color: '#ff8a70', dur: 5 });
        G.addRating(pen.stars || -0.3, 'baka'); G.smoke = Math.min(125, G.smoke + (pen.smoke || 15)); G.count('bakaIgnored'); H.Audio.alarm();
        c.icon = null; c.barW = null; c.say(bakaLine(c, 'ignoredLines') || 'Vidjet ćete vi!', 4); X.exitNow(c, 1.3);
      }
    } else if (e.phase === 'out') {
      c.barW = null; c.icon = null;
      if (c.moveAlong(dt, e.mul || 1)) c.dead = true;
    }
  }
  function bakaDialog(c, P) {
    var e = c.ev; e.phase = 'talk'; c.icon = null; c.barW = null;
    T.run(bakaTree(c), {
      cust: c,
      onEnd: function (res) {
        var tag = String(res.tag || 'ok').toLowerCase();
        if (tag === 'best') { G.count('bakaBest'); G.banner('Baka je pomirena!', { sub: 'Hrvoje, diplomat', color: '#8aff9a', dur: 3 }); }
        else if (tag === 'bad') G.banner('Baka je bijesna!', { color: '#ff8a70', dur: 3 });
        P.say(H.pick(X.lines('baka', 'escortShout')) || 'Ovo je cigar lounge, gospođo!', 2.6);
        X.exitNow(c, 1); H.Achv.check('baka');
      }
    });
  }
  function bakaShout(c) {
    G.addRating(-0.15, 'baka'); G.smoke = Math.min(125, G.smoke + 8); c.icon = null; c.barW = null;
    c.say('Bezobrazluk!', 2.5); G.player.say(H.pick(X.lines('baka', 'escortShout')) || 'Ovo je cigar lounge, gospođo!', 2.2); X.exitNow(c, 1.3);
  }

  // ------------------------------------------------------------------ GG ARENA GAMERS
  function gamerRange(base) { return G.mod.wcGuard ? base * 1.5 : base; }
  function spawnGamers(count) {
    var n = count || H.rndi(2, 3);
    G.banner(X.line('gamers', 'alert', 'GG Arena gejmeri idu prema WC-u!'), { sub: 'Q: viči · E: zaustavi ili prodaj espresso', color: '#b0c8ff', dur: 4.5 });
    H.Audio.alert(); E.trigger('event', 'gamers');
    G.hintOverride = 'Gejmeri idu na WC! Q = viči, E = zaustavi / prodaj espresso.'; G.after(9, function () { G.hintOverride = ''; });
    for (var i = 0; i < n; i++) (function (i) {
      G.after(i * 1.15, function () {
        var c = new Customer(i % 2 ? 'gamer2' : 'gamer1', { role: 'gamer', speed: (66 + H.rnd(0, 8)) * (G.mod.wcGuard ? 0.8 : 1) });
        c.state = 'ev'; c.silentEntry = true; c.range = 78; c.pri = 4; c.name = 'Gejmer';
        var w = (H.Nav.L.spots && H.Nav.L.spots.wc_door) || { x: 1000, y: 165 };
        c.walkTo(w.x, w.y + 8, false); c.ev = { phase: 'run' };
        c.ai = gamerAI; G.customers.push(c);
        c.say(X.line('gamers', 'enter', 'Gdje je WC?'), 2.8); H.Audio.doorChime(); c.chimed = true;
      });
    })(i);
    return true;
  }
  function gamerFlee(c) {
    var e = c.ev; if (e.phase === 'flee' || e.phase === 'out') return;
    e.phase = 'flee'; c.shake = false; c.say(X.line('gamers', 'caught', 'GG!'), 2.2); G.count('gamersCaught');
    var d = X.doorPos(), sp = X.spawnPos();
    c.walkTo(d.x, d.y, false); c.path.push({ x: sp.x, y: sp.y + 30 });
    H.Achv.check('gamers');
  }
  function gamerEnterWC(c) {
    var e = c.ev; e.phase = 'wc'; e.t = e.allowed ? 8 : 15; e.inT = 0; c.hidden = true; G.wcBusyT = Math.max(G.wcBusyT, e.t); H.Audio.wc();
    if (!e.allowed) G.banner('Gejmer je zauzeo WC!', { sub: X.line('gamers', 'reachedWC', 'Nisu ni espresso kupili...'), color: '#ffb0a0', dur: 3.6 });
  }
  function gamerAI(c, dt) {
    var e = c.ev, P = G.player;
    if (e.phase === 'run' || e.phase === 'queue') {
      c.moveAlong(dt);
      if (!UI.modal && H.dist(P.x, P.y, c.x, c.y) < 46 && !e.allowed) {
        e.phase = 'block'; e.t = 0.7; c.path = []; c.moving = false; c.say(X.line('gamers', 'caught', 'Stani!'), 1.6);
        P.say(X.line('gamers', 'blocked', 'Stani!'), 1.8); return;
      }
      if (!c.path.length) {
        if (G.wcBusyT > 0) {
          if (e.phase !== 'queue') {   // join the queue: each waiting gamer gets his own slot next to the door so they do not draw on top of each other
            e.phase = 'queue';
            var qi = G.customers.filter(function (o) { return o !== c && !o.dead && o.role === 'gamer' && o.ev && o.ev.phase === 'queue'; }).length;
            if (qi) { var w1 = H.Nav.L.spots.wc_door; c.walkTo(w1.x + qi * 22, w1.y + 8 + qi * 6, false); }
          }
          if (!c.path.length) c.face = 'up';
        } else gamerEnterWC(c);
      }
    } else if (e.phase === 'block') {
      e.t -= dt; c.shake = true;
      if (e.t <= 0) gamerFlee(c);
    } else if (e.phase === 'flee') {
      if (c.moveAlong(dt, 1.6)) c.dead = true;
    } else if (e.phase === 'wc') {
      e.t -= dt; e.inT += dt; c.moving = false;
      if (e.inT > 4) { e.inT = 0; var w0 = H.Nav.L.spots.wc_door; G.floater(w0.x, w0.y + 46, X.line('gamers', 'wcInside', '*šum vode*'), '#bfe6ff', 2.6); }
      if (e.t <= 0) {
        c.hidden = false; var w = H.Nav.L.spots.wc_door; c.x = w.x; c.y = w.y + 10;
        if (!e.allowed) {
          G.addRating(-0.4, 'wc');
          G.banner(X.line('gamers', 'wcLeave', 'Nisu ni espresso kupili!'), { sub: '−0,4★', color: '#ff9a7a', dur: 4 });
          c.say('hehe', 1.6); H.Audio.bad();
        } else { c.say('Hvala!', 1.6); G.addRating(0.03, 'wc'); }
        X.exitNow(c, 1);
      }
    } else if (e.phase === 'out') {
      if (c.moveAlong(dt, e.mul || 1)) c.dead = true;
    }
  }
  function gamerSell(c, P) {
    var e = c.ev, esp = H.C.drink('espresso'), price = esp ? esp.price : 2.5;
    P.drop('espresso');
    G.earn(price + 4, 'sales'); G.earn(-(esp ? esp.cost : 0.5));
    G.floater(c.x, c.y - 100, '+' + H.money(price + 4), '#ffe36a', 1.6); H.Audio.cash();
    e.allowed = true; G.count('gamersEspresso');
    c.say(X.line('gamers', 'espresso', 'Hvala za kavu!'), 2.8);
    G.banner(X.EV('gamers').bought || 'Gejmeri su platili espresso.', { color: '#8aff9a', dur: 3 });
    if (e.phase === 'block') e.phase = 'run';
    if (e.phase === 'queue' || e.phase === 'run') { var w = H.Nav.L.spots.wc_door; c.walkTo(w.x, w.y + 8, false); e.phase = 'run'; }
    H.Achv.check('gamers');
  }

  // ------------------------------------------------------------------ SHOP RUSH (20:00)
  function spawnRush(count) {
    var n = count || H.rndi(4, 5), ev = X.EV('shopRush');
    G.banner(ev.banner || 'PRELAZAK PREKO CESTE', { sub: ev.announce || '20:00 — Havana Shop zatvara', color: '#ffd58a', dur: 5 });
    H.Audio.doorChime(); E.trigger('event', 'shopRush');
    E.rushGuests = []; E.rushCounted = false; E.rushLeft = n;
    G.after(2.2, function () { var l = X.line('shopRush', 'hrvoje'); if (l && G.player) G.player.say(l, 3.4); });
    var lines = X.lines('shopRush', 'lines').concat(X.lines('shopRush', 'crowd'));
    for (var i = 0; i < n; i++) (function (i) {
      G.after(i * 0.9, function () {
        var c = E.spawnGuest({ rush: true }); E.rushLeft--;
        if (c) { E.rushGuests.push(c); if (H.chance(0.6)) c.say(H.pick(lines) || 'Shop je zatvorio!', 3); }
      });
    })(i);
    return true;
  }

  // ------------------------------------------------------------------ REGULARS (per-character logic in regulars.js)
  function spawnRegular(id, order) {
    if (X.present(id)) return false;
    if (!(freeSeats().length)) return false;
    var delay = G.mod.sonar ? 5 : 0, def = H.C.cust(id);
    var line = X.line(id, 'ping', 'PING! ' + (def.name || id) + ' na vratima.');
    var bio = String(def.bio || def.short || '').split('. ')[0].slice(0, 90);
    G.count('pings'); H.Audio.ping(); G.fx.ring(X.doorPos().x, X.doorPos().y, '#8ad4ff', delay ? 150 : 110);
    G.banner(line, { portrait: id, sub: (def.short ? def.short : '') + (delay ? ' · sonar: stiže za 5 s' : ''), color: '#8ad4ff', dur: delay ? 5.2 : 4.6 });
    X.joke(line);
    function make() {
      var seat = H.pick(freeSeats(id === 'matija' ? function (s) { return s.kind === 'armchair'; } : null)) || H.pick(freeSeats());
      if (!seat) return;
      var c = new Customer(id, { role: id, noTip: id === 'roko' });
      c.setOrder(order || randomOrder(id));
      c.pri = 1; c.range = 90; c.ev = {}; c.reg = H.Regs && H.Regs[id];
      c.ai = function (cc, dt) { if (cc.reg && cc.reg.ai) cc.reg.ai(cc, dt); };
      c.assignSeat(seat); G.customers.push(c);
      E.trigger('enter', id);
    }
    if (delay) G.after(delay, make); else make();
    return true;
  }

  // ------------------------------------------------------------------ hooks called by entities / game
  E.onSeated = function (c) { if (c.reg && c.reg.onSeated) c.reg.onSeated(c); };
  E.onOrdering = function (c) { };
  E.onLit = function (c, res) { if (c.reg && c.reg.onLit) c.reg.onLit(c, res); };
  E.onPaid = function (c, r) {
    c.icon = null;
    if (c.rush) G.count('rushHappy');
    if (c.reg && c.reg.onPaid) c.reg.onPaid(c, r);
  };
  E.onLeave = function (c, angry) { c.icon = null; c.barW = null; if (c.reg && c.reg.onLeave) c.reg.onLeave(c, angry); };
  E.onPick = function (kind, it) { };
  E.onShout = function (P) {
    var rng = gamerRange(430);
    G.customers.forEach(function (c) {
      if (c.dead) return; var d = H.dist(P.x, P.y, c.x, c.y);
      if (c.role === 'gamer' && d < rng && (c.ev.phase === 'run' || c.ev.phase === 'queue' || c.ev.phase === 'block') && !c.ev.allowed) {
        gamerFlee(c); P.say(X.line('gamers', 'shout', 'WC je samo za goste!'), 2);
      }
      if (c.role === 'baka' && d < 260 && c.ev.phase === 'complain') bakaShout(c);
    });
  };

  // returns string label, null (not targetable) or undefined (use default)
  E.labelFor = function (c, P) {
    var e = c.ev || {}, l, sp = false;
    if (c.role === 'baka') l = (e.phase === 'complain') ? 'E — Smiri baku' : null;
    else if (c.role === 'gamer') {
      if (c.dead || c.hidden || !(e.phase === 'run' || e.phase === 'queue' || e.phase === 'block') || e.allowed) l = null;
      else l = P.has('espresso') ? 'E — Prodaj espresso (smije na WC)' : 'E — Zaustavi! (WC samo za goste)';
      sp = l !== null;
    } else if (c.reg) {
      l = c.reg.label ? c.reg.label(c, P) : undefined;
      if (typeof l === 'string') sp = true;
      else if (l === undefined && !G.seen[c.id] && !e.introDone && c.isSeated() && c.state !== 'settle' && c.state !== 'sitTrans' && X.tree(c.id, 'intro')) {
        var n = c.needs();
        if (!((n.cigar && P.has(n.cigar)) || (n.drink && P.has(n.drink)))) { l = 'E — Pozdravi (' + c.name + ')'; sp = true; }
      }
    }
    if (l === undefined && (c.state === 'walkOut' || c.state === 'ev' || c.state === 'walkIn' || c.state === 'sitTrans' || c.state === 'settle')) l = null;
    if (c.role !== 'guest') c.pri = sp ? 70 : (c.role === 'baka' ? 3 : 0);
    return l;
  };
  E.interact = function (c, P) {
    var e = c.ev || {};
    if (c.role === 'baka') { if (e.phase === 'complain') bakaDialog(c, P); return true; }
    if (c.role === 'gamer') {
      if (P.has('espresso')) gamerSell(c, P);
      else if (e.phase !== 'block') { e.phase = 'block'; e.t = 0.5; c.path = []; c.say(X.line('gamers', 'caught', 'Stani!'), 1.6); P.say(X.line('gamers', 'shout', 'WC je samo za goste!'), 2); }
      return true;
    }
    if (c.reg) {
      if (c.reg.interact && c.reg.interact(c, P)) return true;
      if (!G.seen[c.id] && !e.introDone && c.isSeated() && c.state !== 'settle' && c.state !== 'sitTrans') {
        var n = c.needs(), tr = X.tree(c.id, 'intro');
        if (tr && !((n.cigar && P.has(n.cigar)) || (n.drink && P.has(n.drink)))) {
          e.introDone = true;
          T.run(tr, { cust: c, onEnd: function () { G.seen[c.id] = true; } });
          return true;
        }
      }
    }
    return false;
  };
})();
