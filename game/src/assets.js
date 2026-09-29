// assets.js - image loading (no fetch, plain Image tags) + drawing helpers with coloured placeholders
// for anything that is missing, so a missing PNG never crashes the game.
(function () {
  'use strict';
  var H = window.H;

  var A = H.Assets = {
    imgs: {}, failed: {}, total: 0, done: 0,
    bgCanvas: null, // fallback plate
    bg: { lounge: 'assets/bg/lounge.png', street: 'assets/bg/street_strip.png', title: 'assets/bg/title.png', dark: 'assets/bg/lounge_dark.png' }
  };

  A.collect = function () {
    var urls = {};
    function add(u) { if (typeof u === 'string' && u) urls[u] = 1; }
    add(A.bg.lounge); add(A.bg.title);   // street_strip / lounge_dark are optional and unused: not requested
    var I = window.ICONS || {};
    Object.keys(I).forEach(function (k) { add(I[k]); });
    var C = window.CHAR_ATLAS || {};
    Object.keys(C).forEach(function (k) { add(C[k] && C[k].src); });
    var P = window.PORTRAITS || {};
    Object.keys(P).forEach(function (k) { var p = P[k] || {}; add(p.neutral); add(p.angry); });
    return Object.keys(urls);
  };

  A.load = function (onProgress, onDone) {
    var urls = A.collect();
    A.total = urls.length; A.done = 0;
    if (!urls.length) { onDone && onDone(); return; }
    var finished = false;
    function fin() { if (!finished) { finished = true; onDone && onDone(); } }
    urls.forEach(function (u) {
      var im = new Image();
      im.onload = function () { A.imgs[u] = im; A.done++; onProgress && onProgress(A.done / A.total); if (A.done >= A.total) fin(); };
      im.onerror = function () { A.failed[u] = true; A.done++; onProgress && onProgress(A.done / A.total); if (A.done >= A.total) fin(); };
      im.src = u;
    });
    setTimeout(fin, 6000); // never hang on a slow/missing file
  };

  A.get = function (url) { return url ? (A.imgs[url] || null) : null; };
  A.bgImage = function (key) { return A.get(A.bg[key]); };

  // ------------------------------------------------------------------ icons
  var ICON_COLORS = { cigar_cheap: '#8a6a3a', cigar_robusto: '#7a4f28', cigar_corona: '#9a6030', cigar_cohiba: '#5a3418', cigar_hoyo: '#6d4423', cigar_sancho: '#84552a' };
  function drawIconFallback(ctx, name, x, y, s) {
    var h = s / 2;
    ctx.save(); ctx.translate(x, y);
    if (/^cigar_/.test(name) || name === 'cutter') {
      ctx.fillStyle = ICON_COLORS[name] || '#7a4f28'; H.roundRect(ctx, -h * 0.85, -h * 0.22, s * 0.85, h * 0.44, h * 0.2); ctx.fill();
      ctx.fillStyle = '#e8c15a'; ctx.fillRect(-h * 0.2, -h * 0.22, h * 0.22, h * 0.44);
      ctx.fillStyle = '#ff7a2a'; ctx.fillRect(h * 0.68, -h * 0.2, h * 0.16, h * 0.4);
    } else if (name === 'espresso') {
      ctx.fillStyle = '#f3e9d6'; H.roundRect(ctx, -h * 0.55, -h * 0.2, h * 1.1, h * 0.8, h * 0.2); ctx.fill();
      ctx.fillStyle = '#3a1f0e'; ctx.fillRect(-h * 0.45, -h * 0.15, h * 0.9, h * 0.15);
      ctx.strokeStyle = '#f3e9d6'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(h * 0.6, h * 0.15, h * 0.22, -1.5, 1.5); ctx.stroke();
    } else if (/^beer/.test(name)) {
      ctx.fillStyle = name === 'beer_tap' ? '#e6a92a' : '#9a5a1c'; ctx.fillRect(-h * 0.4, -h * 0.5, h * 0.8, h * 1.1);
      ctx.fillStyle = '#fff4d0'; ctx.fillRect(-h * 0.45, -h * 0.6, h * 0.9, h * 0.25);
      ctx.strokeStyle = '#e8e0cc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(h * 0.45, 0, h * 0.25, -1.4, 1.4); ctx.stroke();
    } else if (name === 'martini') {
      ctx.fillStyle = 'rgba(200,230,240,0.9)'; ctx.beginPath(); ctx.moveTo(-h * 0.6, -h * 0.5); ctx.lineTo(h * 0.6, -h * 0.5); ctx.lineTo(0, h * 0.15); ctx.closePath(); ctx.fill();
      ctx.fillRect(-2, h * 0.1, 4, h * 0.55); ctx.fillRect(-h * 0.3, h * 0.6, h * 0.6, 4);
      ctx.fillStyle = '#5a9a3a'; ctx.beginPath(); ctx.arc(h * 0.15, -h * 0.35, h * 0.12, 0, 6.3); ctx.fill();
    } else if (name === 'whisky' || name === 'rum_caroni' || name === 'cognac') {
      ctx.fillStyle = 'rgba(210,225,235,0.55)'; ctx.fillRect(-h * 0.45, -h * 0.35, h * 0.9, h * 0.95);
      ctx.fillStyle = name === 'rum_caroni' ? '#6a2a12' : (name === 'cognac' ? '#b3651c' : '#d68a25'); ctx.fillRect(-h * 0.4, -h * 0.05, h * 0.8, h * 0.6);
    } else if (name === 'star' || name === 'star_empty') {
      ctx.beginPath();
      for (var i = 0; i < 10; i++) { var r = (i % 2 ? h * 0.42 : h * 0.95), a = -Math.PI / 2 + i * Math.PI / 5; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      ctx.closePath();
      if (name === 'star') { ctx.fillStyle = '#ffd23a'; ctx.fill(); }
      ctx.strokeStyle = '#a87a10'; ctx.lineWidth = 2; ctx.stroke();
    } else if (name === 'smoke_puff') {
      ctx.fillStyle = 'rgba(210,205,195,0.9)';[[-0.35, 0.1, 0.4], [0.2, -0.1, 0.5], [0.45, 0.2, 0.3], [-0.05, 0.3, 0.35]].forEach(function (c) { ctx.beginPath(); ctx.arc(c[0] * h, c[1] * h, c[2] * h, 0, 6.3); ctx.fill(); });
    } else if (name === 'warning') {
      ctx.fillStyle = '#ffcf1f'; ctx.beginPath(); ctx.moveTo(0, -h * 0.85); ctx.lineTo(h * 0.85, h * 0.7); ctx.lineTo(-h * 0.85, h * 0.7); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#3a2000'; ctx.font = 'bold ' + Math.round(h * 1.1) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('!', 0, h * 0.2);
    } else if (name === 'euro') {
      ctx.fillStyle = '#e6b422'; ctx.beginPath(); ctx.arc(0, 0, h * 0.8, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#5a3d00'; ctx.font = 'bold ' + Math.round(h * 1.1) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('€', 0, 1);
    } else if (name === 'speech') {
      ctx.fillStyle = '#fff'; H.roundRect(ctx, -h * 0.8, -h * 0.6, h * 1.6, h * 1.05, h * 0.25); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-h * 0.3, h * 0.4); ctx.lineTo(-h * 0.5, h * 0.85); ctx.lineTo(h * 0.05, h * 0.4); ctx.fill();
      ctx.fillStyle = '#555'; for (var d = -1; d <= 1; d++) { ctx.beginPath(); ctx.arc(d * h * 0.35, -h * 0.08, h * 0.1, 0, 6.3); ctx.fill(); }
    } else if (name === 'lighter') {
      ctx.fillStyle = '#c9c9c9'; ctx.fillRect(-h * 0.25, -h * 0.05, h * 0.5, h * 0.7);
      ctx.fillStyle = '#ff8a1f'; ctx.beginPath(); ctx.moveTo(0, -h * 0.8); ctx.quadraticCurveTo(h * 0.35, -h * 0.35, 0, -h * 0.05); ctx.quadraticCurveTo(-h * 0.35, -h * 0.35, 0, -h * 0.8); ctx.fill();
    } else if (name === 'humidor_key') {
      ctx.strokeStyle = '#e6c15a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-h * 0.35, 0, h * 0.28, 0, 6.3); ctx.moveTo(-h * 0.07, 0); ctx.lineTo(h * 0.7, 0); ctx.moveTo(h * 0.5, 0); ctx.lineTo(h * 0.5, h * 0.25); ctx.stroke();
    } else if (name === 'black_chocolate') {
      ctx.fillStyle = '#2a170e'; H.roundRect(ctx, -h * 0.6, -h * 0.4, h * 1.2, h * 0.8, 3); ctx.fill();
      ctx.strokeStyle = '#4a2c1a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-h * 0.2, -h * 0.4); ctx.lineTo(-h * 0.2, h * 0.4); ctx.moveTo(h * 0.2, -h * 0.4); ctx.lineTo(h * 0.2, h * 0.4); ctx.stroke();
    } else {
      ctx.fillStyle = H.colorFor(name); H.roundRect(ctx, -h * 0.8, -h * 0.8, s * 0.8, s * 0.8, 6); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold ' + Math.round(h) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(name).charAt(0).toUpperCase(), 0, 1);
    }
    ctx.restore();
  }

  // centre-anchored icon
  A.drawIcon = function (ctx, name, x, y, size, alpha) {
    if (!name) return;
    var im = A.get((window.ICONS || {})[name]);
    if (alpha != null && alpha < 1) { ctx.save(); ctx.globalAlpha = alpha; }
    if (im) ctx.drawImage(im, x - size / 2, y - size / 2, size, size);
    else drawIconFallback(ctx, name, x, y, size);
    if (alpha != null && alpha < 1) ctx.restore();
  };

  // ------------------------------------------------------------------ characters
  var PAL = {
    hrvoje: ['#3b2a20', '#d9b48a', '#2b2b33'], roko: ['#3a5f9a', '#e0b890', '#2a2a2a'], mislav: ['#e8e2d0', '#d8ae86', '#1f1f28'],
    matija: ['#c0362c', '#d3a074', '#3a2a1a'], tomislav: ['#f0f0f0', '#c99a72', '#2c1c10'], baka1: ['#7a4a86', '#e6c2a0', '#d8d8d8'],
    baka2: ['#4a7a5a', '#e6c2a0', '#e0e0e0'], gamer1: ['#7a1fd0', '#e0b890', '#111'], gamer2: ['#1fb0d0', '#d8a878', '#222'],
    guest1: ['#8a5a3a', '#e0b890', '#2a1a10'], guest2: ['#5a6a7a', '#c99a72', '#1a1a1a'], guest3: ['#9a3a5a', '#e8c4a0', '#5a2a10'], guest4: ['#3a7a6a', '#d0a880', '#6a3a1a']
  };
  function drawCharFallback(ctx, id, anim, frame, x, y, o) {
    var pal = PAL[id] || [H.colorFor(id), '#e0b890', '#222'];
    var sit = /^sit/.test(anim), moving = /^walk/.test(anim) && frame % 2 === 1;
    var bob = moving ? -2 : 0, bh = sit ? 40 : 58;
    var dir = /left/.test(anim) ? 'left' : (/right/.test(anim) ? 'right' : (/up/.test(anim) ? 'up' : 'down'));
    ctx.save(); ctx.translate(x, y + bob);
    if (o && o.alpha != null) ctx.globalAlpha = o.alpha;
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0, 0, 22, 8, 0, 0, 6.3); ctx.fill();
    // legs
    if (!sit) { ctx.fillStyle = pal[2]; ctx.fillRect(-12, -22, 10, 22); ctx.fillRect(2, -22, 10, 22); }
    // body
    ctx.fillStyle = pal[0]; H.roundRect(ctx, -18, -bh - (sit ? 6 : 14), 36, bh, 8); ctx.fill();
    // head
    ctx.fillStyle = pal[1]; ctx.beginPath(); ctx.arc(0, -bh - (sit ? 14 : 22), 15, 0, 6.3); ctx.fill();
    ctx.fillStyle = pal[2]; ctx.beginPath(); ctx.arc(0, -bh - (sit ? 20 : 28), 15, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#111';
    var ey = -bh - (sit ? 14 : 22);
    if (dir === 'down') { ctx.fillRect(-7, ey, 3, 3); ctx.fillRect(4, ey, 3, 3); }
    else if (dir === 'left') { ctx.fillRect(-10, ey, 3, 3); }
    else if (dir === 'right') { ctx.fillRect(7, ey, 3, 3); }
    if (anim === 'smoke' || (o && o.smoking)) { ctx.fillStyle = '#7a4f28'; ctx.fillRect(4, ey + 6, 14, 3); ctx.fillStyle = '#ff7a2a'; ctx.fillRect(17, ey + 6, 3, 3); }
    // initial
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(id.charAt(0).toUpperCase(), 0, -bh / 2 - (sit ? 6 : 14));
    ctx.restore();
  }

  A.atlas = function (id) {
    var d = (window.CHAR_ATLAS || {})[id];
    return d && A.get(d.src) ? d : null;
  };
  A.hasAtlas = function (id) { return !!A.atlas(id); };

  // Draw character at feet position (x,y). anim = atlas anim name; t = seconds (frame chooser).
  A.drawChar = function (ctx, id, anim, frame, x, y, o) {
    o = o || {};
    var d = A.atlas(id);
    if (!d) { drawCharFallback(ctx, id, anim, frame, x, y, o); return; }
    var im = A.get(d.src), list = d.anims && d.anims[anim];
    if (!list || !list.length) {
      // graceful fallbacks between anim names
      var alt = o.fallback || 'walk_down';
      list = d.anims && (d.anims[alt] || d.anims.walk_down);
      frame = 0;
      if (!list || !list.length) { drawCharFallback(ctx, id, anim, frame, x, y, o); return; }
    }
    var f = list[frame % list.length];
    var cols = d.cols || 4, w = d.w || 96, h = d.h || 128, an = d.anchor || [48, 124];
    var sx = (f % cols) * w, sy = Math.floor(f / cols) * h;
    var sc = o.scale || 1;
    if (o.alpha != null) { ctx.save(); ctx.globalAlpha = o.alpha; }
    ctx.drawImage(im, sx, sy, w, h, Math.round(x - an[0] * sc), Math.round(y - an[1] * sc), w * sc, h * sc);
    if (o.alpha != null) ctx.restore();
  };

  // ------------------------------------------------------------------ portraits
  A.portrait = function (id, mood) {
    var p = (window.PORTRAITS || {})[id];
    if (!p) return null;
    return A.get(mood === 'angry' && p.angry ? p.angry : p.neutral) || A.get(p.neutral);
  };
  A.drawPortrait = function (ctx, id, mood, x, y, w, h) {
    var im = A.portrait(id, mood);
    if (im) { ctx.drawImage(im, x, y, w, h); return; }
    // placeholder bust
    var pal = PAL[id] || [H.colorFor(id), '#e0b890', '#222'];
    ctx.save(); ctx.translate(x + w / 2, y + h);
    ctx.fillStyle = pal[0]; H.roundRect(ctx, -w * 0.38, -h * 0.34, w * 0.76, h * 0.4, 14); ctx.fill();
    ctx.fillStyle = pal[1]; ctx.beginPath(); ctx.arc(0, -h * 0.55, w * 0.24, 0, 6.3); ctx.fill();
    ctx.fillStyle = pal[2]; ctx.beginPath(); ctx.arc(0, -h * 0.62, w * 0.24, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#111'; ctx.fillRect(-w * 0.1, -h * 0.56, 5, 5); ctx.fillRect(w * 0.06, -h * 0.56, 5, 5);
    if (mood === 'angry') { ctx.strokeStyle = '#111'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w * 0.13, -h * 0.6); ctx.lineTo(-w * 0.03, -h * 0.57); ctx.moveTo(w * 0.13, -h * 0.6); ctx.lineTo(w * 0.03, -h * 0.57); ctx.stroke(); }
    ctx.restore();
  };

  // ------------------------------------------------------------------ fallback plate (drawn from LAYOUT)
  A.buildFallbackBG = function (L) {
    var c = document.createElement('canvas'); c.width = 1280; c.height = 720;
    var g = c.getContext('2d');
    var i, x, y;
    // floor
    g.fillStyle = '#3a2517'; g.fillRect(0, 0, 1280, 720);
    for (y = 150; y < 640; y += 26) {
      g.fillStyle = (y / 26) % 2 ? 'rgba(255,190,120,0.04)' : 'rgba(0,0,0,0.10)'; g.fillRect(40, y, 1200, 26);
      g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(40, y, 1200, 1);
    }
    // back wall (copper panels + rivets)
    g.fillStyle = '#5b3520'; g.fillRect(0, 0, 1280, 150);
    for (x = 0; x < 1280; x += 96) {
      g.fillStyle = (x / 96) % 2 ? '#6a3d24' : '#623820'; g.fillRect(x + 2, 30, 92, 116);
      g.fillStyle = '#c99a5a';
      [[6, 34], [86, 34], [6, 138], [86, 138]].forEach(function (p) { g.beginPath(); g.arc(x + p[0], p[1], 2.2, 0, 6.3); g.fill(); });
    }
    // ceiling beam + bulbs
    g.fillStyle = '#2a2622'; g.fillRect(0, 0, 1280, 26);
    g.fillStyle = '#4a4034'; g.fillRect(0, 22, 1280, 4);
    for (x = 70; x < 1280; x += 170) {
      var gr = g.createRadialGradient(x, 34, 2, x, 34, 60); gr.addColorStop(0, 'rgba(255,200,110,0.55)'); gr.addColorStop(1, 'rgba(255,200,110,0)');
      g.fillStyle = gr; g.fillRect(x - 60, 0, 120, 100);
      g.fillStyle = '#ffd68a'; g.beginPath(); g.arc(x, 34, 6, 0, 6.3); g.fill();
    }
    // bar back shelves
    g.fillStyle = '#231710'; g.fillRect(40, 44, 580, 100);
    for (i = 0; i < 3; i++) { g.fillStyle = '#e0a04a'; g.fillRect(40, 70 + i * 32, 580, 3); }
    for (x = 50; x < 610; x += 22) { for (i = 0; i < 3; i++) { g.fillStyle = ['#2f6a3a', '#7a3a20', '#c98a2a', '#4a5a8a', '#6a2a2a'][(x / 22 + i) % 5 | 0]; g.fillRect(x, 48 + i * 32 + (i % 2) * 2, 10, 24); } }
    // blue bubble panel
    g.fillStyle = '#0d2848'; g.fillRect(700, 34, 160, 110);
    g.strokeStyle = '#b87a3a'; g.lineWidth = 4; g.strokeRect(700, 34, 160, 110);
    for (i = 0; i < 40; i++) { g.fillStyle = 'rgba(120,200,255,' + (0.15 + (i % 5) * 0.06) + ')'; g.beginPath(); g.arc(708 + (i * 37) % 144, 42 + (i * 53) % 96, 3 + i % 5, 0, 6.3); g.fill(); }
    // gauges
    for (i = 0; i < 3; i++) {
      var gx = 890 + i * 20, gy = 60 + (i % 2) * 24;
      g.fillStyle = '#c99a5a'; g.beginPath(); g.arc(gx, gy, 12, 0, 6.3); g.fill();
      g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(gx, gy, 9, 0, 6.3); g.fill();
      g.strokeStyle = '#f0d080'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + 6, gy - 4); g.stroke();
    }
    // WC door
    var wc = L.spots && L.spots.wc_door ? L.spots.wc_door : { x: 1000, y: 165 };
    g.fillStyle = '#3a2416'; g.fillRect(wc.x - 40, 60, 80, 90);
    g.strokeStyle = '#c99a5a'; g.lineWidth = 3; g.strokeRect(wc.x - 40, 60, 80, 90);
    g.fillStyle = '#e8c890'; g.font = 'bold 22px sans-serif'; g.textAlign = 'center'; g.fillText('WC', wc.x, 98);
    // rug
    g.fillStyle = '#7a6440'; g.beginPath(); g.ellipse(640, 450, 270, 115, 0, 0, 6.3); g.fill();
    g.strokeStyle = '#a58a58'; g.lineWidth = 3; g.beginPath(); g.ellipse(640, 450, 250, 100, 0, 0, 6.3); g.stroke();
    // side walls
    g.fillStyle = '#4a2a18'; g.fillRect(0, 150, 40, 490); g.fillRect(1240, 150, 40, 490);
    // humidor arch
    (L.walls || []).forEach(function (w) {
      if (w.id === 'humidor_cabinet') {
        g.fillStyle = '#1e120a'; H.roundRect(g, w.x, w.y, w.w, w.h, 28); g.fill();
        g.strokeStyle = '#c99a5a'; g.lineWidth = 4; g.stroke();
        g.fillStyle = 'rgba(70,140,230,0.5)'; g.fillRect(w.x + 14, w.y + 30, w.w - 28, 40);
        for (i = 0; i < 4; i++) { g.fillStyle = '#7a4a26'; g.fillRect(w.x + 14, w.y + 84 + i * 26, w.w - 28, 18); g.fillStyle = '#e8c15a'; g.fillRect(w.x + 20, w.y + 88 + i * 26, 14, 4); }
      }
      if (w.id === 'bar_counter') {
        g.fillStyle = '#8a4a26'; g.fillRect(w.x, w.y, w.w, w.h);
        g.fillStyle = '#b87844'; g.fillRect(w.x, w.y, w.w, 8);
        g.fillStyle = '#5a2e16'; g.fillRect(w.x, w.y + w.h - 6, w.w, 6);
        g.fillStyle = '#d6a468';
        for (x = w.x + 12; x < w.x + w.w; x += 40) { g.beginPath(); g.arc(x, w.y + 24, 2.5, 0, 6.3); g.fill(); }
        // stools
        for (i = 0; i < 5; i++) { var sx = w.x + 60 + i * 110; g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.ellipse(sx, w.y + w.h + 34, 18, 7, 0, 0, 6.3); g.fill(); g.fillStyle = '#3a2416'; g.fillRect(sx - 3, w.y + w.h + 12, 6, 22); g.fillStyle = '#a05a2a'; g.beginPath(); g.ellipse(sx, w.y + w.h + 12, 18, 8, 0, 0, 6.3); g.fill(); }
      }
      if (w.id === 'sofa_left' || w.id === 'banquette') {
        g.fillStyle = '#8a4e28'; H.roundRect(g, w.x, w.y, w.w, w.h, 14); g.fill();
        g.fillStyle = '#a2643a';
        if (w.w < w.h) { for (i = 0; i < 3; i++) { H.roundRect(g, w.x + 30, w.y + 8 + i * (w.h / 3), w.w - 34, w.h / 3 - 6, 8); g.fill(); } }
        else { for (i = 0; i < 2; i++) { H.roundRect(g, w.x + 6 + i * (w.w / 2), w.y + 26, w.w / 2 - 10, w.h - 30, 8); g.fill(); } }
      }
    });
    // armchairs
    (L.seats || []).forEach(function (s) {
      if (s.kind !== 'armchair') return;
      var back = { left: [16, 0], right: [-16, 0], up: [0, 14], down: [0, -14] }[s.face] || [0, 0];
      g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.ellipse(s.x, s.y + 4, 30, 10, 0, 0, 6.3); g.fill();
      g.fillStyle = '#b09a7a'; H.roundRect(g, s.x - 26, s.y - 30, 52, 34, 8); g.fill();
      g.fillStyle = '#8a7658'; H.roundRect(g, s.x - 26 - back[0] * 0.5 - 4, s.y - 44, 52, 22, 8); g.fill();
      g.fillStyle = '#2a2a2a'; g.fillRect(s.x - 26, s.y + 2, 4, 8); g.fillRect(s.x + 22, s.y + 2, 4, 8);
    });
    // tables
    (L.tables || []).forEach(function (t) {
      g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.ellipse(t.x, t.y + t.r * 0.6, t.r, t.r * 0.4, 0, 0, 6.3); g.fill();
      g.fillStyle = '#5a3a20'; g.beginPath(); g.ellipse(t.x, t.y, t.r, t.r * 0.72, 0, 0, 6.3); g.fill();
      g.fillStyle = '#7a5230'; g.beginPath(); g.ellipse(t.x, t.y - 3, t.r - 4, t.r * 0.72 - 4, 0, 0, 6.3); g.fill();
      g.fillStyle = 'rgba(255,200,120,0.6)'; g.beginPath(); g.arc(t.x + 8, t.y - 6, 4, 0, 6.3); g.fill();
    });
    // glass storefront (street strip at the bottom)
    var st = A.bgImage('street');
    g.fillStyle = '#0c1220'; g.fillRect(0, 640, 1280, 80);
    if (st) g.drawImage(st, 0, 640, 1280, 80);
    else { g.fillStyle = '#151d33'; g.fillRect(0, 668, 1280, 52); for (x = 0; x < 1280; x += 130) { g.fillStyle = 'rgba(255,190,90,0.6)'; g.fillRect(x + 20, 690, 60, 26); } }
    g.strokeStyle = '#8a6a3a'; g.lineWidth = 4;
    g.strokeRect(2, 642, 758, 74); g.strokeRect(900, 642, 378, 74);
    g.fillStyle = 'rgba(180,220,255,0.10)'; g.fillRect(0, 640, 1280, 80);
    g.fillStyle = '#ffd68a'; g.font = 'bold 26px sans-serif'; g.textAlign = 'center'; g.fillText('HAVANA 22', 830, 628);
    g.fillStyle = '#ff5a5a'; g.font = 'bold 14px sans-serif'; g.fillText('GG ARENA', 250, 708);
    g.fillStyle = '#5ac8ff'; g.fillText('HAVANA SHOP', 1090, 708);
    // vignette
    var vg = g.createRadialGradient(640, 380, 250, 640, 380, 800); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.5)');
    g.fillStyle = vg; g.fillRect(0, 0, 1280, 720);
    return c;
  };

  A.getBG = function (L) {
    var im = A.bgImage('lounge');
    if (im) return im;
    if (!A.bgCanvas) A.bgCanvas = A.buildFallbackBG(L || {});
    return A.bgCanvas;
  };
  A.usingFallbackBG = function () { return !A.bgImage('lounge'); };
})();
