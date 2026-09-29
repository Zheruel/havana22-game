// regulars.js - the four regulars: Roko, Mislav, Matija, Tomislav. Each is { ai, label, interact, onSeated, onLit, onPaid, onLeave }.
//
// CONTENT KEYS READ (window.CONTENT.events.<id>), all optional:
//   roko     ping intro{tree} tab{tree} tabLines{reminder,repaid,overdue} rant{prompt,durationSec,topics[{lines}],guestFrozen,nodSuccess,nodFail}
//            comp{tree} hotfix{durationSec,announce,lines,variants[{id,name,desc,effect,sec}]} noTip phone{girlfriend,work} farewell
//   mislav   ping intro bondQuiz tirade{prompt,durationSec,lines,guestReactions,interruptSuccess,interruptFail,guestsLeave,penaltyLeave}
//            humidor{desc,tree,stealSuccess,stealCaught,leftBehind} kneeOffer{lines,guestFlees} farewell
//   matija   ping intro progressPics{prompt,freezeSec,skipPenalty,tree,clients,skipLines,watchLines} recipe{prompt,steps,tree}
//            oldDays{lines} steroids{lines,hrvoje,others} armchair{warn,broke,reaction,hrvoje} farewell
//   tomislav ping intro pitch offers ivanisevic ivanisevicLines padel{announce,ballLines,glassBreak,apology,dodge,penalty} farewell
(function () {
  'use strict';
  var H = window.H, G = H.G, UI = H.UI, X = H.X, T = H.Tree;
  var R = H.Regs = { ball: null };

  function seatedActive(c) { return c.isSeated() && c.state !== 'settle' && c.state !== 'sitTrans'; }
  function S(name, obj, key) { var o = X.EV(name)[obj]; return H.pick(H.lines(o && o[key])) || ''; }   // random line from events.<name>.<obj>.<key>
  function copy(o) { var q = {}; Object.keys(o).forEach(function (k) { q[k] = o[k]; }); return q; }
  function nearestFirst(c) { return function (a, b) { return H.dist(a.x, a.y, c.x, c.y) - H.dist(b.x, b.y, c.x, c.y); }; }
  function farewell(c, name) { var l = X.line(name, 'farewell'); if (l && H.chance(0.7)) c.say(l, 3.6); }
  function tick(e, key, dt) { e[key] -= dt; if (e[key] <= 0) return true; return false; }

  R.reset = function () { R.ball = null; };
  R.update = function (dt) { updateBall(dt); };

  // ==================================================================================== ROKO
  var DEFAULT_TOPICS = [
    { lines: ['Kaže da nikad nemam vremena za nju.', 'A telefon je moj šef. U džepu.', 'Jučer sam popravio bug. Danas popravak. Sutra opet bug.'] },
    { lines: ['Šef je rekao: mali hotfix. Radim ga šesti dan.', 'Stand-up traje sat i pol.', 'Deployao sam u petak. Znam.'] }
  ];
  function startRant(c) {
    var e = c.ev, cfg = X.EV('roko').rant || {}, topics = (cfg.topics && cfg.topics.length) ? cfg.topics : DEFAULT_TOPICS;
    if (!e.bag || !e.bag.length) e.bag = H.shuffle(topics.slice());
    var topic = e.bag.pop(), lines = H.lines(topic.lines).slice(0, 3);
    var vs = X.seatedNear(c, 430, function (o) { return o.frozen <= 0 && (o.state === 'ordering' || o.state === 'needLight' || o.state === 'smoking'); }).sort(nearestFirst(c));
    var dur = (cfg.durationSec || 8) * G.mod.rantFreeze;
    if (!vs.length) dur = Math.min(dur, 4);   // nobody to annoy: pure flavour
    e.ranting = e.rantDur = dur; e.lines = lines; e.lineI = 0; e.lineDur = dur / Math.max(1, lines.length); e.lineT = e.lineDur;
    c.rant = true; c.barColor = '#7ac0ff'; c.say(lines[0] || '...', e.lineDur + 0.8); X.joke(lines[0]); H.Audio.pop();
    if (vs.length) {
      e.victim = vs[0]; e.victim.frozen = 999; e.victim.icon = 'speech';
      var gf = S('roko', 'rant', 'guestFrozen'); if (gf) e.victim.say(gf, 3.6);
      G.hintOverride = cfg.prompt || 'Roko jadikuje! Klimni glavom (E) prije nego gost izgubi volju!';
    }
  }
  function endRant(c, nodded) {   // nodded: true = success, false = timed out, null = silent cleanup
    var e = c.ev; c.rant = false; c.barW = null; e.ranting = 0; e.rantT = H.rnd(18, 28);
    if (nodded !== null) G.hintOverride = '';
    if (e.victim) { e.victim.frozen = 0; e.victim.icon = null; if (nodded === false) e.victim.pat -= e.victim.patMax * 0.18; e.victim = null; }
    if (nodded === true) { c.say(S('roko', 'rant', 'nodSuccess') || 'Hvala što slušaš...', 3); G.floater(c.x, c.y - 120, 'Klimnuo si', '#bfe6ff', 1.2); G.count('nods'); }
    else if (nodded === false) c.say(S('roko', 'rant', 'nodFail') || 'Nitko me ne sluša.', 3);
  }
  function tabTree() {
    var tab = X.tree('roko', 'tab'), comp = X.tree('roko', 'comp');
    if (!tab) return null;
    if (!comp || !comp.nodes.b) return tab;
    var g = T.graft(tab, comp, 'c_');
    var a = copy(g.nodes[g.start]);
    a.choices = (a.choices || []).concat([{ text: (comp.nodes.a && comp.nodes.a.text) || 'Na račun kuće, Roko.', next: 'c_b', tag: 'good', comp: true }]);
    g.nodes[g.start] = a;
    return g;
  }
  function holdRoko() {
    var c = this, e = c.ev;
    if (e.tabDone) return false;
    if (UI.modal) return true;
    e.tabDone = true;
    if (e.ranting) endRant(c, null);
    var before = G.rokoDebt, tree = tabTree();
    if (!tree) { c.pay(); return true; }
    T.run(tree, {
      cust: c,
      onChoice: function (ch) { if (ch.comp) { c.comp = true; G.count('comps'); } },
      onEnd: function () { if (G.rokoDebt > before) c.tabbed = true; c.pay(); }
    });
    return true;
  }
  R.roko = {
    onSeated: function (c) {
      if (G.rokoDebt >= 60 && !G.flags.overdue) { G.flags.overdue = true; var ov = S('roko', 'tabLines', 'overdue'); if (ov) G.banner(ov, { portrait: 'roko', color: '#ffb27a', dur: 4.5 }); }
      else if (G.rokoDebt > 0) { var rm = S('roko', 'tabLines', 'reminder'); if (rm) G.after(1.5, function () { if (!c.dead) c.say(rm, 4); }); }
    },
    ai: function (c, dt) {
      var e = c.ev;
      if (!e.init) { e.init = true; e.rantT = H.rnd(12, 18); e.phoneT = H.rnd(20, 30); c.hold = holdRoko; }
      if (!seatedActive(c)) return;
      if (!e.ranting) {
        e.rantT -= dt;
        if (e.rantT <= 0) startRant(c);
        else if (c.state === 'smoking' || c.state === 'ordering') {
          e.phoneT -= dt;
          if (e.phoneT <= 0) { e.phoneT = H.rnd(28, 42); var ph = X.EV('roko').phone || {}; var l = H.pick(H.lines(H.chance(0.5) ? ph.girlfriend : ph.work)); if (l) c.say(l, 4.6); }
        }
      } else {
        e.ranting -= dt; c.barW = e.ranting / e.rantDur;
        e.lineT -= dt;
        if (e.lineT <= 0) { e.lineI++; e.lineT = e.lineDur; if (e.lines && e.lineI < e.lines.length) { c.say(e.lines[e.lineI], e.lineDur + 0.8); X.joke(e.lines[e.lineI]); } }
        if (e.ranting <= 0) endRant(c, false);
      }
    },
    label: function (c, P) { var e = c.ev; if (e.ranting && e.victim) return 'E — Klimni glavom'; },
    interact: function (c, P) { var e = c.ev; if (e.ranting && e.victim) { endRant(c, true); return true; } return false; },
    onPaid: function (c) {
      if (c.comp) return;
      if (!c.tabbed && G.rokoDebt > 0 && H.chance(0.55)) {
        var amt = Math.min(G.rokoDebt, H.rndi(10, 25)); G.rokoDebt -= amt; G.earn(amt, 'tips');
        G.floater(c.x, c.y - 132, 'Roko vraća +' + H.money(amt), '#8aff9a', 2);
        var rp = S('roko', 'tabLines', 'repaid'); if (rp) c.say(rp, 4);
      } else {
        var nt = X.line('roko', 'noTip');
        if (nt && !c.tabbed && H.chance(0.6)) c.say(nt, 3.6); else farewell(c, 'roko');
      }
    },
    onLeave: function (c) { if (c.ev.ranting) endRant(c, null); }
  };

  // ==================================================================================== MISLAV
  function makeProp(c) {
    var e = c.ev, tbl = H.Nav.L.tables.filter(function (t) { return t.id === (c.seat && c.seat.table); })[0];
    var px = tbl ? tbl.x : c.seat.x + 30, py = tbl ? tbl.y - 4 : c.seat.y;
    var hd = X.EV('mislav').humidor || {};
    e.prop = {
      x: px + 8, y: py, range: 66, dead: false, used: false,
      label: function () { return this.used ? null : 'E — Mislavov humidor (kirurška intervencija?)'; },
      act: function (P) {
        var pr = this; if (pr.used || UI.modal) return; pr.used = true;
        var tree = X.tree('mislav', 'humidor') || (hd.tree && hd.tree.nodes ? hd.tree : null);
        if (!tree) { P.give('cigar', 'cigar_cohiba'); G.count('humidorThefts'); return; }
        T.run(tree.nodes ? tree : hd.tree, {
          cust: c,
          onEnd: function (res) {
            if (res.tag === 'good') { var sl = H.pick(H.lines(hd.stealSuccess)); if (sl) G.banner(sl, { color: '#8affc0', dur: 4 }); }
            else if (res.tag === 'bad') { var cl = H.pick(H.lines(hd.stealCaught)); if (cl) c.say(cl, 3.4); }
            else pr.used = false;   // decided not to touch it: may change mind later
          }
        });
      },
      draw: function (ctx) {
        if (this.used) ctx.globalAlpha = 0.45;
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(this.x, this.y + 2, 16, 6, 0, 0, 6.3); ctx.fill();
        ctx.fillStyle = '#5a3418'; H.roundRect(ctx, this.x - 14, this.y - 16, 28, 18, 4); ctx.fill(); ctx.strokeStyle = '#d9a55a'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#d9a55a'; ctx.fillRect(this.x - 3, this.y - 10, 6, 5);
        ctx.globalAlpha = 1;
      }
    };
    G.props.push(e.prop); c.onRemove = function () { if (e.prop) e.prop.dead = true; };
  }
  function startTirade(c) {
    var e = c.ev, cfg = X.EV('mislav').tirade || {};
    var vs = X.seatedNear(c, 470, function (o) { return o.role !== "mislav" && o.state !== "walkOut"; });
    if (!vs.length) { e.tirT = 8; return; }
    var dur = cfg.durationSec || 20, lines = H.shuffle(H.lines(cfg.lines)).slice(0, 4);
    if (!lines.length) lines = [X.custLine('mislav', 'rant', 'Znate, kao kirurg...')];
    e.victims = vs; vs.forEach(function (v) { v.icon = 'warning'; });
    c.rant = true; e.tirDur = e.tirade = dur; c.barColor = '#ff5a4a';
    e.lines = lines; e.lineI = 0; e.lineDur = dur / lines.length; e.lineT = e.lineDur; e.leaveT = dur * 0.3;
    c.say(lines[0], e.lineDur + 0.6); X.joke(lines[0]); H.Audio.pop();
    var rx = H.pick(H.lines(cfg.guestReactions)); if (rx && vs[0]) G.after(1.5, function () { if (!vs[0].dead) vs[0].say(rx, 3); });
    G.count('tirades'); G.hintOverride = cfg.prompt || 'Mislav drži tiradu! Posluži mu Cohibu da ga utišaš!';
  }
  function endTirade(c, silenced) {
    var e = c.ev; e.tirade = 0; c.rant = false; c.barW = null; G.hintOverride = '';
    (e.victims || []).forEach(function (v) { v.icon = null; });
    e.victims = null;
    if (!silenced) { c.say(H.pick(['Ja sam samo iskren.', 'Publika nije spremna.', 'Nikad ne čekam odobrenje.']), 2.6); e.tirT = H.rnd(20, 30); }
    else { e.silence = 45; e.tirT = H.rnd(24, 34); }
  }
  function holdMislav() {
    var c = this, e = c.ev;
    if (e.quizDone) return false;
    if (UI.modal) return true;
    e.quizDone = true;
    if (e.tirade > 0) endTirade(c, false);
    var tr = X.tree('mislav', 'bondQuiz');
    if (!tr) { c.pay(); return true; }
    T.run(tr, { cust: c, onEnd: function () { c.pay(); } });
    return true;
  }
  R.mislav = {
    onSeated: function (c) { var lb = S('mislav', 'humidor', 'leftBehind'); if (lb) G.after(2.5, function () { if (!c.dead && !c.ev.tirade) c.say(lb, 4); }); },
    ai: function (c, dt) {
      var e = c.ev;
      if (!e.init) { e.init = true; e.tirT = H.rnd(16, 24); e.kneeT = H.rnd(24, 34); c.hold = holdMislav; }
      if (!e.prop && c.isSeated()) makeProp(c);
      if (!seatedActive(c)) return;
      if (!(e.tirade > 0)) {
        if (e.silence > 0) e.silence -= dt;
        else { e.tirT -= dt; if (e.tirT <= 0) startTirade(c); }
        e.kneeT -= dt;
        if (e.kneeT <= 0) {
          e.kneeT = H.rnd(34, 50);
          var ko = X.EV('mislav').kneeOffer || {}, near = X.seatedNear(c, 320, function (o) { return o.role !== 'mislav'; }).sort(nearestFirst(c))[0];
          var kl = H.pick(H.lines(ko.lines));
          if (kl && near) {
            c.say(kl, 4.5);
            var fl = H.pick(H.lines(ko.guestFlees)); if (fl) G.after(2.2, function () { if (!near.dead) { near.say(fl, 2.8); if (near.state === 'ordering' || near.state === 'needLight') near.pat -= near.patMax * 0.06; } });
          }
        }
      } else {
        e.tirade -= dt; c.barW = e.tirade / e.tirDur;
        e.lineT -= dt;
        if (e.lineT <= 0) { e.lineI++; e.lineT = e.lineDur; if (e.lineI < e.lines.length) { c.say(e.lines[e.lineI], e.lineDur + 0.6); X.joke(e.lines[e.lineI]); } }
        e.leaveT -= dt;
        if (e.leaveT <= 0) {
          e.leaveT = e.tirDur * 0.28;
          var vs = (e.victims || []).filter(function (v) { return !v.dead && v.isSeated() && v.state !== 'walkOut' && v.state !== 'sitTrans'; }).sort(nearestFirst(c));
          if (vs.length) { vs[0].icon = null; vs[0].leave(true, 'tirade'); }
        }
        if (e.tirade <= 0) endTirade(c, false);
      }
    },
    label: function (c, P) {
      var e = c.ev;
      if (e.tirade > 0) return P.has('cigar_cohiba') ? 'E — Daj Cohibu (ušutkaj ga)' : 'Treba Cohiba da ga ušutkaš!';
    },
    interact: function (c, P) {
      var e = c.ev;
      if (!(e.tirade > 0)) return false;
      var cfg = X.EV('mislav').tirade || {};
      if (P.has('cigar_cohiba')) {
        if (c.state === 'ordering' && c.needs().cigar === 'cigar_cohiba') c.serve(P); else P.drop('cigar_cohiba');
        G.count('tiradeStopped'); c.tipBonus += 8;
        endTirade(c, true); H.Audio.buff();
        c.say(H.pick(H.lines(cfg.interruptSuccess)) || 'Cohiba... Tihašina.', 3.4);
        G.banner('Mislav ušutkan!', { portrait: 'mislav', sub: 'Napojnica +' + H.money(8), color: '#8affc0', dur: 3.2 });
      } else {
        c.say(H.pick(H.lines(cfg.interruptFail)) || 'Gdje je Cohiba?', 3); P.say('Treba mi Cohiba za njega!', 2);
      }
      return true;
    },
    onPaid: function (c) { farewell(c, 'mislav'); },
    onLeave: function (c) { if (c.ev.tirade > 0) endTirade(c, false); if (c.ev.prop) c.ev.prop.dead = true; }
  };

  // ==================================================================================== MATIJA
  function pickClient(e) {
    var pp = X.EV('matija').progressPics || {}, list = H.lines(pp.clients);
    if (!list.length) return 'Klijent: minus 14 kila za 8 tjedana. „I tek je počeo!“';
    if (!e.clientBag || !e.clientBag.length) e.clientBag = H.shuffle(list.slice());
    return e.clientBag.pop();
  }
  function recipeTree() {
    var rc = X.EV('matija').recipe || {}, tr = rc.tree;
    if (!tr || !tr.nodes) return null;
    var steps = H.shuffle(H.lines(rc.steps)).slice(0, 3);
    if (!steps.length || !tr.nodes.listen) return tr;
    var out = { start: tr.start, nodes: {} };
    Object.keys(tr.nodes).forEach(function (k) { out.nodes[k] = tr.nodes[k]; });
    steps.forEach(function (t, i) { out.nodes['rs' + i] = { who: 'matija', text: t, next: i < steps.length - 1 ? 'rs' + (i + 1) : 'listen' }; });
    var a = copy(out.nodes[out.start]);
    a.choices = (a.choices || []).map(function (ch) { if (ch.next !== 'listen') return ch; var q = copy(ch); q.next = 'rs0'; return q; });
    out.nodes[out.start] = a;
    return out;
  }
  function breakChair(c) {
    var e = c.ev, ar = X.EV('matija').armchair || {};
    e.crushed = true;
    if (G.mod.armchairProof) { c.say('Fotelja izdržava. Pomalo sam tužan.', 3.4); return; }
    G.brokenSeats[c.seat.id] = true; G.count('armchairsBroken'); H.Audio.crack();
    G.banner(H.pick(H.lines(ar.broke)) || 'KRC! Fotelja je puknula.', { portrait: 'matija', sub: H.C.toast('seatBroken', 'Sjedalo je van uporabe do kraja noći'), color: '#ffb070', dur: 5 });
    var rx = H.pick(H.lines(ar.reaction)); if (rx) G.after(1.2, function () { if (!c.dead) c.say(rx, 3.4); });
    var hl = H.pick(H.lines(ar.hrvoje)); if (hl) G.after(3.4, function () { if (G.player) G.player.say(hl, 3.2); });
    H.Achv.check('chair');
  }
  function photoAmbush(c) {
    var e = c.ev, pp = X.EV('matija').progressPics || {};
    e.pic = 0; e.picT = H.rnd(26, 38); c.icon = null; G.hintOverride = '';
    var sec = Math.max(1.2, (pp.freezeSec || 3) * G.mod.rantFreeze), pen = pp.skipPenalty || { rep: -0.05 };
    var txt = pickClient(e); X.joke(txt);
    UI.openPhoto(txt, function (skipped) {
      if (skipped) {
        if (pen.rep) G.addRating(pen.rep, 'photo');
        G.floater(G.player.x, G.player.y - 130, 'Preskočio si', '#ff8a7a');
        var sk = H.pick(H.lines(pp.skipLines)); if (sk) c.say(sk, 3.4);
      } else {
        G.count('progressPicsSeen');
        var wl = H.pick(H.lines(pp.watchLines)); if (wl) c.say(wl, 3.2);
        if (pp.tree && pp.tree.nodes) T.run(pp.tree, { cust: c });
      }
    }, sec, pen.rep ? String(pen.rep).replace('.', ',') + '★' : '');
  }
  R.matija = {
    ai: function (c, dt) {
      var e = c.ev;
      if (!e.init) { e.init = true; e.crushT = H.rnd(9, 13); e.picT = H.rnd(18, 26); e.talkT = H.rnd(12, 20); }
      if (!seatedActive(c)) return;
      // the armchair
      if (!e.crushed && c.seat && c.seat.kind === 'armchair') {
        e.crushT -= dt;
        if (!e.warned && e.crushT < 8) { e.warned = true; if (!G.mod.armchairProof) { var wl = S('matija', 'armchair', 'warn'); if (wl) { c.say(wl, 3.4); G.floater(c.x, c.y - 96, '*škrip*', '#ffb070', 1.6); } } }
        if (e.crushT <= 0) breakChair(c);
      }
      // progress photos
      var pp = X.EV('matija').progressPics || {};
      if (!e.pic) {
        e.picT -= dt;
        if (e.picT <= 0) { e.pic = 10; c.icon = 'speech'; c.say('Hrvoje! Dođi vidi klijenta!', 3.5); H.Audio.ping(); G.hintOverride = pp.prompt || 'Matija te zove — priđi mu ili ga zaobiđi.'; }
      } else {
        e.pic -= dt;
        if (H.dist(G.player.x, G.player.y, c.x, c.y) < 130 && !UI.modal) photoAmbush(c);
        else if (e.pic <= 0) { e.pic = 0; e.picT = H.rnd(20, 28); c.icon = null; G.hintOverride = ''; c.say('Pa dobro...', 2); }
      }
      // ambient old-days / steroid chatter
      if (!e.pic) {
        e.talkT -= dt;
        if (e.talkT <= 0) {
          e.talkT = H.rnd(20, 32);
          if (H.chance(0.5)) { var od = S('matija', 'oldDays', 'lines'); if (od) c.say(od, 5); }
          else {
            var st = S('matija', 'steroids', 'lines'); if (st) c.say(st, 5);
            if (H.chance(0.5)) { var hs = S('matija', 'steroids', 'hrvoje'); if (hs) G.after(3.2, function () { if (G.player) G.player.say(hs, 3.6); }); }
            else if (H.chance(0.4)) {
              var oth = H.lines((X.EV('matija').steroids || {}).others).filter(function (t) { var m = t.match(/^(Roko|Mislav|Tomislav):/); return m && X.present(m[1].toLowerCase()); });
              if (oth.length) G.after(3.5, function () { G.banner(H.pick(oth), { size: 16, dur: 4, color: '#ffe9b8' }); });
            }
          }
        }
      }
    },
    onLit: function (c) {
      var e = c.ev;
      if (!e.recipeDone) { e.recipeReady = true; c.icon = 'speech'; var rp = (X.EV('matija').recipe || {}).prompt; if (rp && !G.hintOverride) { G.hintOverride = rp; G.after(7, function () { if (G.hintOverride === rp) G.hintOverride = ''; }); } }
    },
    label: function (c, P) {
      var e = c.ev; if (c.state === 'smoking' && e.recipeReady && !e.recipeDone) return 'E — Slušaj recept';
    },
    interact: function (c, P) {
      var e = c.ev;
      if (c.state === 'smoking' && e.recipeReady && !e.recipeDone) {
        e.recipeDone = true; c.icon = null; G.hintOverride = '';
        var tr = recipeTree();
        if (tr) T.run(tr, { cust: c, onEnd: function (res) { var rr = S('matija', 'recipe', 'reaction'); if (rr && res.tag === 'good') c.say(rr, 3.2); } });
        return true;
      }
      return false;
    },
    onPaid: function (c) { farewell(c, 'matija'); },
    onLeave: function (c) { c.icon = null; }
  };

  // ==================================================================================== TOMISLAV
  function holdTom() {
    var c = this, e = c.ev;
    if (e.triviaDone) return false;
    if (UI.modal) return true;
    e.triviaDone = true; c.icon = null; e.pitchReady = false;
    var tr = X.tree('tomislav', 'ivanisevic');
    if (!tr) { c.pay(); return true; }
    T.run(tr, { cust: c, onEnd: function (res) { if (res.tag === 'best') G.count('ivaniseviBest'); c.pay(); } });
    return true;
  }
  R.tomislav = {
    ai: function (c, dt) {
      var e = c.ev;
      if (!e.init) { e.init = true; e.ballT = H.rnd(10, 14); e.talkT = H.rnd(14, 22); c.hold = holdTom; }
      if (!seatedActive(c)) return;
      if (!R.ball) { e.ballT -= dt; if (e.ballT <= 0) { e.ballT = H.rnd(16, 24); spawnBall(c); } }
      e.talkT -= dt;
      if (e.talkT <= 0 && !UI.modal) {
        e.talkT = H.rnd(24, 36);
        var l = H.chance(0.5) ? X.line('tomislav', 'offers') : X.line('tomislav', 'ivanisevicLines');
        if (l) { c.say(l, 5); X.joke(l); }
      }
    },
    onLit: function (c) {
      var e = c.ev;
      if (!e.pitchDone && X.tree('tomislav', 'pitch')) { e.pitchReady = true; c.icon = 'speech'; c.say('Hrvoje, imam ponudu za tebe!', 3); H.Audio.ping(); }
    },
    label: function (c, P) { var e = c.ev; if (e.pitchReady && !e.pitchDone && c.state === 'smoking') return 'E — Ponuda za stan'; },
    interact: function (c, P) {
      var e = c.ev;
      if (e.pitchReady && !e.pitchDone && c.state === 'smoking') {
        e.pitchDone = true; e.pitchReady = false; c.icon = null; G.count('pitches');
        T.run(X.tree('tomislav', 'pitch'), { cust: c });
        return true;
      }
      return false;
    },
    onPaid: function (c) { farewell(c, 'tomislav'); },
    onLeave: function (c) { c.icon = null; }
  };

  // padel ball
  function spawnBall(c) {
    var a = H.rnd(0, 6.28), sp = H.rnd(220, 300);
    var fr = H.Nav.nearestFree(c.x, c.y + 24, true, null, 6);   // Tomislav sits inside a chair collider: start the ball on free floor or it never leaves the chair
    R.ball = {
      x: fr.x, y: fr.y, z: 44, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.6, vz: 240, life: 11, bounces: 0, breaks: 0, dead: false, range: 0, isBall: true,
      label: function () { return null; },
      act: function () { },
      trail: [],
      draw: function (ctx) {
        var bz = this.y - this.z - 8, sh = H.clamp(1 - this.z / 140, 0.4, 1);
        // motion trail (older points smaller and fainter)
        for (var ti = 0; ti < this.trail.length; ti++) {
          var tp = this.trail[ti], k = (ti + 1) / (this.trail.length + 1);
          ctx.fillStyle = 'rgba(214,240,58,' + (0.34 * k) + ')'; ctx.beginPath(); ctx.arc(tp.x, tp.y - tp.z - 8, 3 + 7 * k, 0, 6.3); ctx.fill();
        }
        ctx.fillStyle = 'rgba(0,0,0,' + (0.38 * sh) + ')'; ctx.beginPath(); ctx.ellipse(this.x, this.y, 13 * sh, 5 * sh, 0, 0, 6.3); ctx.fill();
        ctx.fillStyle = '#d6f03a'; ctx.beginPath(); ctx.arc(this.x, bz, 11, 0, 6.3); ctx.fill();
        ctx.strokeStyle = '#3a4a08'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(this.x, bz, 11, 0, 6.3); ctx.stroke();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(this.x, bz, 7.5, 0.5, 2.6); ctx.stroke();
      }
    };
    G.props.push(R.ball);
    var bl = S('tomislav', 'padel', 'ballLines'); c.say(bl || 'Bekhend!', 2.4); c.forceAnim = null;
    G.banner(H.pick(H.lines((X.EV('tomislav').padel || {}).announce)) || 'Padel loptica leti po lounge-u!', { portrait: 'tomislav', sub: 'Uhvati je prije nego razbije čašu', color: '#e0f070', dur: 3.6 });
  }
  function updateBall(dt) {
    var b = R.ball; if (!b) return;
    if (b.dead) { var bi = G.props.indexOf(b); if (bi >= 0) G.props.splice(bi, 1); R.ball = null; return; }
    b.life -= dt;
    if (H.Nav.solidAt(b.x, b.y, 5, true)) { var fr = H.Nav.nearestFree(b.x, b.y, true, null, 6); b.x = fr.x; b.y = fr.y; }   // never stay stuck inside furniture
    b.vz -= 700 * dt; b.z += b.vz * dt;
    var N = H.Nav, nx = b.x + b.vx * dt, ny = b.y + b.vy * dt;
    if (N.solidAt(nx, b.y, 5, true) || nx < 50 || nx > 1230) { b.vx = -b.vx; nx = b.x; H.Audio.bounce(); ballHit(b); }
    if (N.solidAt(b.x, ny, 5, true) || ny < 165 || ny > 630) { b.vy = -b.vy; ny = b.y; H.Audio.bounce(); ballHit(b); }
    b.x = nx; b.y = ny;
    b.trailT = (b.trailT || 0) - dt; if (b.trailT <= 0) { b.trailT = 0.04; b.trail.push({ x: b.x, y: b.y, z: b.z }); if (b.trail.length > 6) b.trail.shift(); }
    if (b.z <= 0) { b.z = 0; b.vz = Math.max(180, -b.vz * 0.8); b.bounces++; H.Audio.bounce(); ballHit(b); }
    var P = G.player;
    if (H.dist(P.x, P.y, b.x, b.y) < 34 && b.z < 46) {
      b.dead = true; G.count('ballCatches'); G.earn(5, 'tips'); G.floater(P.x, P.y - 120, 'Dobar hvat! +' + H.money(5), '#e0f070', 1.4);
      P.say(S('tomislav', 'padel', 'dodge') || 'Ace!', 2); H.Audio.good(); H.Achv.check('ball');
      return;
    }
    if (b.life <= 0) b.dead = true;
  }
  function ballHit(b) {
    if ((b.hitCd && b.hitCd > G.t) || b.breaks >= 1) return; b.hitCd = G.t + 0.6;
    var cs = G.customers.filter(function (c) { return c.isSeated() && (c.got.drink || c.state === 'smoking') && H.dist(c.x, c.y, b.x, b.y) < 62; });
    if (cs.length && H.chance(G.mod.padelProof ? 0.15 : 0.4)) {
      b.breaks++;
      var c = H.pick(cs), pen = (X.EV('tomislav').padel || {}).penalty || { cash: -8, stars: -0.02 };
      H.Audio.glass(); G.count('padelGlasses');
      T.fx({ cash: pen.cash || -8, stars: pen.stars || 0 }, { cust: c });
      c.say(H.pick(['Moja čaša!', 'Hej!', 'Tko je to bacio?']), 2); c.pat -= c.patMax * 0.1;
      if (!G.flags.glassBanner || G.t - G.flags.glassBanner > 12) { G.flags.glassBanner = G.t; G.banner(S('tomislav', 'padel', 'glassBreak') || H.C.toast('glassBroken', 'Čaša razbijena.'), { color: '#ff9a7a', size: 17, dur: 3.4 }); }
      var tom = G.customers.filter(function (x) { return x.role === 'tomislav' && !x.dead; })[0];
      var ap = S('tomislav', 'padel', 'apology'); if (tom && ap) G.after(1.6, function () { if (!tom.dead) tom.say(ap, 3.2); });
    }
  }
})();
