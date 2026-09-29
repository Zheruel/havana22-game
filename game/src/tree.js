// tree.js - shared event helpers (H.X) and the dialogue-tree runner + effect applier (H.Tree).
// Content trees: { start:'id', nodes:{ id:{ who, text, choices?:[{text,next,fx?,tag?}], next?, end?, fx?, tag?, roll?:{p,win,lose} } } }
// fx keys: cash stars smoke patience freeze buff giveCigar debt tipBonus flag seatBroken rep
(function () {
  'use strict';
  var H = window.H, G = H.G, UI = H.UI;
  var X = H.X = { jokes: [] };
  var T = H.Tree = {};

  // ------------------------------------------------------------------ content helpers
  X.EV = function (name) { return (H.C.events && H.C.events[name]) || {}; };
  X.lines = function (name, key) {
    var e = X.EV(name), l = H.lines(e[key]);
    if (!l.length) l = H.lines((e.__def || {})[key]);
    return l;
  };
  X.line = function (name, key, fb) { return H.pick(X.lines(name, key)) || fb || ''; };
  X.custLine = function (id, key, fb) { return H.C.say(id, key) || fb || ''; };
  X.joke = function (t) {
    if (t && X.jokes.indexOf(t) < 0) { X.jokes.push(t); if (X.jokes.length > 40) X.jokes.shift(); }
    return t;
  };
  X.tree = function (name, key) { var e = X.EV(name)[key]; return (e && e.nodes && e.start) ? e : null; };
  X.doorPos = function () { var L = H.Nav.L; return (L.spots && L.spots.door) || { x: 830, y: 655 }; };
  X.spawnPos = function () { var L = H.Nav.L; return (L.spawn && L.spawn.door) || { x: 830, y: 700 }; };
  // send an event character out through the door
  X.exitNow = function (c, mul) {
    var d = X.doorPos(), sp = X.spawnPos();
    c.freeSeat(); c.state = 'ev'; c.hidden = false; c.icon = null; c.barW = null; c.rant = false;
    c.walkTo(d.x + H.rnd(-15, 15), d.y, false); c.path.push({ x: sp.x, y: sp.y + 30 });
    c.ev.phase = 'out'; c.ev.mul = mul || 1;
  };
  X.seatedNear = function (c, r, pred) {
    return G.customers.filter(function (o) {
      return o !== c && !o.dead && o.isSeated() && o.role !== 'baka' && H.dist(o.x, o.y, c.x, c.y) < r && (!pred || pred(o));
    });
  };
  X.present = function (id) { return G.customers.some(function (c) { return c.id === id && !c.dead; }); };

  // ------------------------------------------------------------------ hotfix buffs (Roko)
  var DEFAULT_VARIANTS = [
    { id: 'pos_brzi', name: 'Brži POS', desc: 'Trčiš 20% brže.', effect: { moveSpeedMult: 1.2 }, sec: 45 },
    { id: 'cache_clear', name: 'Očišćen cache', desc: 'Zelena zona za paljenje je šira.', effect: { lightZone: 0.15 }, sec: 45 },
    { id: 'refaktor', name: 'Refaktoriranje', desc: 'Svi imaju 25% više strpljenja.', effect: { patienceMult: 1.25 }, sec: 45 }
  ];
  T.buff = function (id) {
    var hf = X.EV('roko').hotfix || {}, vs = (hf.variants && hf.variants.length) ? hf.variants : DEFAULT_VARIANTS;
    var v = (id && id !== 'hotfix') ? vs.filter(function (x) { return x.id === id; })[0] : null;
    if (!v) { var pool = vs.filter(function (x) { return !G.buffs.some(function (b) { return b.id === x.id; }); }); v = H.pick(pool.length ? pool : vs); }
    var sec = v.sec || hf.durationSec || 45; if (sec > 1.5) sec *= G.mod.hotfix;
    G.count('hotfixes');
    var ef = v.effect || {};
    if (ef.smoke) G.smoke = H.clamp(G.smoke + ef.smoke, 0, 125);
    if (sec > 1.5) G.addBuff(v.id, v.name, ef, sec);
    G.banner(hf.announce || H.C.toast('hotfix', 'HOTFIX aktiviran!'), { portrait: 'roko', sub: v.name + ': ' + (v.desc || ''), color: '#8affc0', dur: 5 });
    var l = H.pick(H.lines(hf.lines)); if (l) X.joke(l);
    H.Audio.buff();
  };

  // ------------------------------------------------------------------ effects
  function breakSeat(c) {
    var s = c && c.seat; if (!s) return;
    G.brokenSeats[s.id] = true; G.count('armchairsBroken'); H.Audio.crack();
    G.banner(H.C.toast('seatBroken', 'Fotelja je preminula.'), { color: '#ffb070', dur: 3.5 });
  }
  T.flag = function (name) {
    G.flags = G.flags || {}; G.flags[name] = true;
    if (name === 'humidor_theft') G.count('humidorThefts');
    else if (name === 'recipe_listened') G.count('recipeListened');
  };
  T.fx = function (fx, o) {
    if (!fx || typeof fx !== 'object') return;
    o = o || {};
    var c = o.cust, P = G.player, x = c ? c.x : P.x, y = (c ? c.y : P.y) - 118;
    if (fx.cash) {
      G.earn(fx.cash, 'tips');
      G.floater(x, y, (fx.cash > 0 ? '+' : '−') + H.money(Math.abs(fx.cash)), fx.cash > 0 ? '#ffe36a' : '#ff8a6a', 1.9);
      if (fx.cash > 0) H.Audio.cash(); else H.Audio.bad();
    }
    if (fx.stars) G.addRating(fx.stars, 'fx');
    if (fx.rep) G.addRating(fx.rep, 'rep');
    if (fx.smoke) G.smoke = H.clamp(G.smoke + fx.smoke, 0, 125);
    if (fx.patience) {
      G.customers.forEach(function (g) {
        if (g.dead || (g.state !== 'ordering' && g.state !== 'needLight') || g.role === 'baka') return;
        g.pat = H.clamp(g.pat + fx.patience, 1, g.patMax);
      });
    }
    if (fx.freeze) P.frozen = Math.max(P.frozen, fx.freeze * G.mod.rantFreeze);
    if (fx.debt) { G.rokoDebt += fx.debt; G.floater(x, y - 16, 'Na crtu: ' + H.money(fx.debt), '#ffb27a', 1.9); }
    if (fx.tipBonus) { if (c) c.tipBonus = (c.tipBonus || 0) + fx.tipBonus; else G.earn(fx.tipBonus, 'tips'); }
    if (fx.giveCigar) {
      var it = H.C.cigar(fx.giveCigar);
      if (it) { P.give('cigar', it.id); G.floater(P.x, P.y - 122, it.name, '#ffe9b8', 1.6); H.Audio.buff(); }
    }
    if (fx.buff) T.buff(fx.buff);
    if (fx.seatBroken) breakSeat(c);
    if (fx.flag) T.flag(fx.flag);
  };

  // ------------------------------------------------------------------ tree runner
  function nameOf(who) {
    if (who === 'hrvoje') return 'Hrvoje';
    if (who === 'narrator') return '';
    if (who === 'gost') return 'Gost';
    var d = H.C.customers[who]; return d ? (d.name || who) : (who || '');
  }
  function pageOf(node) {
    var who = node.who || 'narrator', mute = who === 'narrator' || who === 'gost';
    return { who: mute ? null : who, name: nameOf(who), mood: node.mood || ((node.tag === 'bad' && who !== 'hrvoje' && !mute) ? 'angry' : 'neutral'), text: node.text || '...' };
  }
  // o: { cust, onChoice(choice,res), onEnd(res) }   res: { tag, tags[], path[], choice }
  T.run = function (tree, o) {
    o = o || {};
    var res = { tag: null, tags: [], path: [], choice: null }, done = false;
    function finish() { if (done) return; done = true; if (o.onEnd) o.onEnd(res); }
    if (!tree || !tree.nodes || !tree.nodes[tree.start]) { finish(); return; }
    var nodes = tree.nodes, applied = [], lastCh = null;
    function applyFx(fx, id) {
      if (!fx || applied.indexOf(fx) >= 0) return;
      if (lastCh && lastCh.next === id && lastCh.json === JSON.stringify(fx)) { lastCh = null; return; }
      applied.push(fx); T.fx(fx, o);
    }
    function onChoice(ch) {
      if (ch.tag) { res.tags.push(ch.tag); res.tag = ch.tag; }
      res.choice = ch;
      if (o.onChoice) o.onChoice(ch, res);
      applyFx(ch.fx, '__choice');
      lastCh = ch.fx ? { next: ch.next, json: JSON.stringify(ch.fx) } : null;
      if (ch.next && nodes[ch.next]) step(ch.next); else finish();
    }
    function step(id) {
      var pages = [], choices = null, node = nodes[id], guard = 0;
      while (node && guard++ < 40) {
        res.path.push(id);
        applyFx(node.fx, id);
        if (node.tag) res.tag = node.tag;
        pages.push(pageOf(node));
        if (node.choices && node.choices.length) {
          choices = node.choices.filter(function (ch) { return ch && ch.text; }).map(function (ch) { return { text: ch.text, cb: function () { onChoice(ch); } }; });
          if (choices.length) break;
          choices = null;
        }
        if (node.roll) { id = H.chance(node.roll.p) ? node.roll.win : node.roll.lose; node = nodes[id]; continue; }
        if (node.end || !node.next) break;
        id = node.next; node = nodes[id];
      }
      if (!pages.length) { finish(); return; }
      UI.openDialog(pages, choices, finish);
    }
    step(tree.start);
  };

  // graft b's nodes into a copy of a with an id prefix; returns the merged nodes and the renamed b nodes' start
  T.graft = function (a, b, prefix) {
    var out = { start: a.start, nodes: {} };
    Object.keys(a.nodes).forEach(function (k) { out.nodes[k] = a.nodes[k]; });
    Object.keys(b.nodes).forEach(function (k) {
      var n = b.nodes[k], m = {};
      Object.keys(n).forEach(function (f) { m[f] = n[f]; });
      if (m.next) m.next = prefix + m.next;
      if (m.choices) m.choices = m.choices.map(function (ch) { var q = {}; Object.keys(ch).forEach(function (f) { q[f] = ch[f]; }); if (q.next) q.next = prefix + q.next; return q; });
      if (m.roll) m.roll = { p: m.roll.p, win: prefix + m.roll.win, lose: prefix + m.roll.lose };
      out.nodes[prefix + k] = m;
    });
    return out;
  };
})();
