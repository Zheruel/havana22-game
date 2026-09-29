// util.js - tiny helpers shared by every module. Everything hangs off window.H.
(function () {
  'use strict';
  var H = window.H = window.H || {};
  H.W = 1280; H.H = 720;
  H.debug = /[?&]debug=1/.test(location.search);
  H.stubMode = /[?&]stub=1/.test(location.search);

  // ---- RNG (seedable for tests) ----
  function mulberry(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var rng = Math.random;
  H.seed = function (n) { rng = (n == null) ? Math.random : mulberry(n); };
  H.rand = function () { return rng(); };
  H.rnd = function (a, b) { return a + rng() * (b - a); };
  H.rndi = function (a, b) { return Math.floor(a + rng() * (b - a + 1)); };
  H.chance = function (p) { return rng() < p; };
  H.pick = function (arr) { return arr && arr.length ? arr[Math.floor(rng() * arr.length)] : undefined; };
  H.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };

  // ---- math ----
  H.clamp = function (v, a, b) { return v < a ? a : (v > b ? b : v); };
  H.lerp = function (a, b, t) { return a + (b - a) * t; };
  H.dist = function (ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); };
  H.approach = function (v, target, step) {
    return v < target ? Math.min(target, v + step) : Math.max(target, v - step);
  };
  H.hash = function (s) {
    s = String(s); var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };

  // ---- formatting ----
  H.fmtClock = function (min) {
    min = Math.max(0, Math.floor(min));
    var h = 16 + Math.floor(min / 60), m = min % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  };
  H.money = function (n) {
    var r = Math.round(n * 10) / 10;
    var s = (Math.abs(r) % 1 === 0) ? String(r) : r.toFixed(1).replace('.', ',');
    return s + ' €';
  };

  // Flatten any content shape (string | array | {text|line|lines}) to an array of non-empty strings.
  H.lines = function (x) {
    var out = [];
    (function walk(v) {
      if (v == null) return;
      if (typeof v === 'string') { if (v.trim()) out.push(v); return; }
      if (Array.isArray(v)) { v.forEach(walk); return; }
      if (typeof v === 'object') {
        if (v.text != null) walk(v.text);
        else if (v.line != null) walk(v.line);
        else if (v.lines != null) walk(v.lines);
        else if (v.t != null && typeof v.t === 'string') walk(v.t);
      }
    })(x);
    return out;
  };
  H.pickLine = function (x, fallback) {
    var l = H.lines(x);
    if (l.length) return H.pick(l);
    return fallback;
  };

  // ---- canvas text helpers ----
  H.FONT = '"Trebuchet MS","Segoe UI",Verdana,Arial,sans-serif';
  H.font = function (px, weight) { return (weight || 'bold') + ' ' + px + 'px ' + H.FONT; };
  H.wrap = function (ctx, text, maxW) {
    var words = String(text).split(/\s+/), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) {
      var test = cur ? cur + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = words[i]; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
  };
  // ellipsize a single line to maxW (ctx.font must already be set)
  H.fit = function (ctx, text, maxW) {
    text = String(text); if (ctx.measureText(text).width <= maxW) return text;
    while (text.length > 1 && ctx.measureText(text + '…').width > maxW) text = text.slice(0, -1);
    return text + '…';
  };
  H.roundRect = function (ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };
  // outlined text (readable on any background)
  H.text = function (ctx, str, x, y, o) {
    o = o || {};
    ctx.font = H.font(o.size || 20, o.weight);
    ctx.textAlign = o.align || 'left';
    ctx.textBaseline = o.base || 'alphabetic';
    if (o.outline !== false) {
      ctx.lineWidth = o.lw || Math.max(3, (o.size || 20) / 5);
      ctx.strokeStyle = o.outline || 'rgba(20,10,4,0.9)';
      ctx.lineJoin = 'round';
      ctx.strokeText(str, x, y);
    }
    ctx.fillStyle = o.color || '#ffe9b8';
    ctx.fillText(str, x, y);
  };
  H.colorFor = function (s) {
    var h = H.hash(s) % 360;
    return 'hsl(' + h + ',45%,48%)';
  };
})();
