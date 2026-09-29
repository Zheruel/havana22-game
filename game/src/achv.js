// achv.js - achievements are data-driven: content achievements[] = { id, name, desc, cond:{ stat, gte } }.
// `stat` is looked up in the lifetime stats (G.stats, filled through G.count) plus a few live values below.
(function () {
  'use strict';
  var H = window.H, G = H.G;
  var A = H.Achv = {};

  function val(stat) {
    switch (stat) {
      case 'rokoDebt': return G.rokoDebt || 0;
      case 'ventsInNight': return (G.nightStats && G.nightStats.vents) || 0;
      case 'stars': case 'rating': return G.rating;
      case 'cash': return G.cash;
      case 'streak': return Math.max(G.streak || 0, G.stats.maxStreak || 0);
    }
    return G.stats[stat] || 0;
  }
  A.value = val;
  A.newNight = function () { G.newAch = G.newAch || []; };
  A.check = function () {
    var l = H.C.achievements || [];
    for (var i = 0; i < l.length; i++) {
      var a = l[i]; if (!a || G.ach[a.id] || !a.cond) continue;
      if (val(a.cond.stat) >= (typeof a.cond.gte === 'number' ? a.cond.gte : 1)) {
        G.ach[a.id] = true; (G.newAch = G.newAch || []).push(a.name || a.id);
        if (G.scene === 'play') { G.banner('Postignuće: ' + (a.name || a.id), { sub: a.desc || '', color: '#8affc0', size: 20, dur: 4.2, prio: 0 }); H.Audio.buff(); }
      }
    }
  };
  var tk = 0;
  A.tick = function (dt) { tk += dt; if (tk > 2) { tk = 0; G.stats.maxStreak = Math.max(G.stats.maxStreak || 0, G.streak || 0); A.check(); } };
})();
