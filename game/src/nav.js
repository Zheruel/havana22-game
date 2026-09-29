// nav.js - collision + A* pathfinding on LAYOUT.nav grid. Walls are rects, tables are circles.
// Two grids: customers (cannot enter the bar-staff zone) and staff (the player).
(function () {
  'use strict';
  var H = window.H;

  var N = H.Nav = {
    L: null, cell: 20, cols: 64, rows: 36, gridC: null, gridS: null,
    rects: [], circles: [], staffRect: null, clear: 11, playerMaxY: 9999
  };

  function circRect(x, y, r, rc) {
    var nx = H.clamp(x, rc.x, rc.x + rc.w), ny = H.clamp(y, rc.y, rc.y + rc.h);
    var dx = x - nx, dy = y - ny;
    return dx * dx + dy * dy < r * r;
  }

  N.init = function (L) {
    N.L = L;
    N.cell = (L.nav && L.nav.cell) || 20;
    N.cols = Math.ceil(L.width / N.cell); N.rows = Math.ceil(L.height / N.cell);
    N.rects = (L.walls || []).map(function (w) { return { id: w.id, x: w.x, y: w.y, w: w.w, h: w.h }; });
    N.circles = (L.tables || []).map(function (t) { return { id: t.id, x: t.x, y: t.y, r: t.r }; });
    // staff-only zone: the walk-behind band + counter (customers may not enter it)
    var bar = N.rects.filter(function (r) { return r.id === 'bar_counter'; })[0];
    var back = N.rects.filter(function (r) { return r.id === 'backwall'; })[0];
    var left = N.rects.filter(function (r) { return r.id === 'left_wall'; })[0];
    if (bar) {
      var x0 = left ? left.x + left.w : 0, y0 = back ? back.y + back.h : 150;
      N.staffRect = { x: x0, y: y0, w: bar.x + bar.w + 60 - x0, h: bar.y + bar.h - y0 };
    } else N.staffRect = null;
    var door = (L.spots && L.spots.door) || { x: 830, y: 655 };
    N.playerMaxY = door.y + 16;
    // precompute grids
    N.gridC = new Uint8Array(N.cols * N.rows); N.gridS = new Uint8Array(N.cols * N.rows);
    for (var cy = 0; cy < N.rows; cy++) {
      for (var cx = 0; cx < N.cols; cx++) {
        var x = cx * N.cell + N.cell / 2, y = cy * N.cell + N.cell / 2;
        N.gridS[cy * N.cols + cx] = N.solidAt(x, y, N.clear, true) ? 1 : 0;
        N.gridC[cy * N.cols + cx] = N.solidAt(x, y, N.clear, false) ? 1 : 0;
      }
    }
  };

  // does a circle at (x,y,r) overlap any solid? staff=true ignores the staff-zone restriction
  N.solidAt = function (x, y, r, staff) {
    var i;
    for (i = 0; i < N.rects.length; i++) if (circRect(x, y, r, N.rects[i])) return true;
    for (i = 0; i < N.circles.length; i++) {
      var c = N.circles[i], dx = x - c.x, dy = y - c.y, rr = c.r + r;
      if (dx * dx + dy * dy < rr * rr) return true;
    }
    if (!staff && N.staffRect && circRect(x, y, r, N.staffRect)) return true;
    return false;
  };

  N.los = function (ax, ay, bx, by, r, staff) {
    var d = H.dist(ax, ay, bx, by), steps = Math.max(1, Math.ceil(d / 5));
    for (var i = 1; i < steps; i++) {
      var t = i / steps;
      if (N.solidAt(ax + (bx - ax) * t, ay + (by - ay) * t, r, staff)) return false;
    }
    return true;
  };

  N.cellOf = function (x, y) {
    return { cx: H.clamp(Math.floor(x / N.cell), 0, N.cols - 1), cy: H.clamp(Math.floor(y / N.cell), 0, N.rows - 1) };
  };
  N.center = function (cx, cy) { return { x: cx * N.cell + N.cell / 2, y: cy * N.cell + N.cell / 2 }; };
  N.grid = function (staff) { return staff ? N.gridS : N.gridC; };

  // nearest free cell centre to a point; pref(cellCenter) optionally adds a score penalty
  N.nearestFree = function (x, y, staff, pref, maxR) {
    var g = N.grid(staff), c = N.cellOf(x, y), best = null, bs = 1e9, R = maxR || 14;
    for (var dy = -R; dy <= R; dy++) {
      for (var dx = -R; dx <= R; dx++) {
        var cx = c.cx + dx, cy = c.cy + dy;
        if (cx < 0 || cy < 0 || cx >= N.cols || cy >= N.rows) continue;
        if (g[cy * N.cols + cx]) continue;
        var p = N.center(cx, cy), s = H.dist(x, y, p.x, p.y) + (pref ? pref(p) : 0);
        if (s < bs) { bs = s; best = p; }
      }
    }
    return best || { x: x, y: y };
  };

  // where a customer stands before sliding into a seat: free cell nearest to the seat, preferring the front side
  N.approachFor = function (seat) {
    var f = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[seat.face] || [0, 1];
    return N.nearestFree(seat.x, seat.y, false, function (p) {
      var dot = (p.x - seat.x) * f[0] + (p.y - seat.y) * f[1];
      return dot < 0 ? 45 : 0;
    }, 9);
  };

  // ---- A* (binary heap) ----
  function Heap() { this.a = []; }
  Heap.prototype.push = function (n) {
    var a = this.a; a.push(n); var i = a.length - 1;
    while (i > 0) { var p = (i - 1) >> 1; if (a[p].f <= a[i].f) break; var t = a[p]; a[p] = a[i]; a[i] = t; i = p; }
  };
  Heap.prototype.pop = function () {
    var a = this.a, top = a[0], last = a.pop();
    if (a.length) {
      a[0] = last; var i = 0, n = a.length;
      for (;;) {
        var l = 2 * i + 1, r = l + 1, m = i;
        if (l < n && a[l].f < a[m].f) m = l;
        if (r < n && a[r].f < a[m].f) m = r;
        if (m === i) break; var t = a[m]; a[m] = a[i]; a[i] = t; i = m;
      }
    }
    return top;
  };

  // returns array of {x,y} waypoints (excluding start), ending exactly at (tx,ty) if reachable; null if not
  N.path = function (sx, sy, tx, ty, staff) {
    var g = N.grid(staff), cols = N.cols, rows = N.rows, R = 10;
    if (!N.solidAt(tx, ty, R, staff) && N.los(sx, sy, tx, ty, R, staff)) return [{ x: tx, y: ty }];
    var s = N.cellOf(sx, sy), t = N.cellOf(tx, ty);
    if (g[s.cy * cols + s.cx]) { var ns = N.nearestFree(sx, sy, staff, null, 6); s = N.cellOf(ns.x, ns.y); }
    var tgtFree = !g[t.cy * cols + t.cx];
    if (!tgtFree) { var nt = N.nearestFree(tx, ty, staff, null, 8); t = N.cellOf(nt.x, nt.y); }
    var si = s.cy * cols + s.cx, ti = t.cy * cols + t.cx;
    var gs = new Float32Array(cols * rows).fill(1e9), came = new Int32Array(cols * rows).fill(-1), closed = new Uint8Array(cols * rows);
    var open = new Heap();
    function hf(i) { var dx = Math.abs((i % cols) - t.cx), dy = Math.abs(Math.floor(i / cols) - t.cy); return (dx + dy) + (1.414 - 2) * Math.min(dx, dy); }
    gs[si] = 0; open.push({ i: si, f: hf(si) });
    var found = false;
    while (open.a.length) {
      var cur = open.pop(), ci = cur.i;
      if (closed[ci]) continue; closed[ci] = 1;
      if (ci === ti) { found = true; break; }
      var cx = ci % cols, cy = (ci / cols) | 0;
      for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          var nx = cx + dx, ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          var ni = ny * cols + nx;
          if (g[ni] || closed[ni]) continue;
          if (dx && dy && (g[cy * cols + nx] || g[ny * cols + cx])) continue; // no corner cutting
          var ng = gs[ci] + (dx && dy ? 1.414 : 1);
          if (ng < gs[ni]) { gs[ni] = ng; came[ni] = ci; open.push({ i: ni, f: ng + hf(ni) }); }
        }
      }
    }
    if (!found) return null;
    var pts = [], k = ti;
    while (k !== -1 && k !== si) { pts.push(N.center(k % cols, (k / cols) | 0)); k = came[k]; }
    pts.reverse();
    if (tgtFree) pts.push({ x: tx, y: ty });
    else pts.push({ x: pts.length ? pts[pts.length - 1].x : tx, y: pts.length ? pts[pts.length - 1].y : ty });
    // string-pulling: skip waypoints we can see past
    var out = [], ax = sx, ay = sy, i = 0;
    while (i < pts.length) {
      var far = i;
      for (var j = pts.length - 1; j > i; j--) { if (N.los(ax, ay, pts[j].x, pts[j].y, R, staff)) { far = j; break; } }
      out.push(pts[far]); ax = pts[far].x; ay = pts[far].y; i = far + 1;
    }
    return out;
  };

  // outward normal of the deepest obstacle overlapping a circle at (x,y), or null
  N.normalAt = function (x, y, r, staff) {
    var best = null, bd = 0, i, nx, ny, dx, dy, d, pen, rects = N.rects.slice();
    if (!staff && N.staffRect) rects.push(N.staffRect);
    for (i = 0; i < rects.length; i++) {
      var rc = rects[i]; nx = H.clamp(x, rc.x, rc.x + rc.w); ny = H.clamp(y, rc.y, rc.y + rc.h); dx = x - nx; dy = y - ny; d = Math.sqrt(dx * dx + dy * dy);
      if (d < r) { pen = r - d; if (pen > bd) { bd = pen; best = d > 0.001 ? { x: dx / d, y: dy / d, pen: pen } : { x: 0, y: -1, pen: pen }; } }
    }
    for (i = 0; i < N.circles.length; i++) {
      var c = N.circles[i]; dx = x - c.x; dy = y - c.y; d = Math.sqrt(dx * dx + dy * dy); pen = c.r + r - d;
      if (pen > 0 && pen > bd) { bd = pen; best = d > 0.001 ? { x: dx / d, y: dy / d, pen: pen } : { x: 0, y: 1, pen: pen }; }
    }
    return best;
  };

  // move a circle: full step, else axis-separated, else slide along the obstacle surface
  N.moveCircle = function (e, dx, dy, r, staff) {
    function ok(x, y) { return x > r && x < H.W - r && y > r && y < N.playerMaxY && !N.solidAt(x, y, r, staff); }
    var ox = e.x, oy = e.y, nx = ox + dx, ny = oy + dy;
    if (ok(nx, ny)) { e.x = nx; e.y = ny; return; }
    if (ok(nx, e.y)) e.x = nx;
    if (ok(e.x, ny)) e.y = ny;
    var want = Math.sqrt(dx * dx + dy * dy), got = H.dist(ox, oy, e.x, e.y);
    if (want > 0 && got < want * 0.6) {
      var n = N.normalAt(nx, ny, r, staff);
      if (n) {
        var dot = dx * n.x + dy * n.y;
        if (dot < 0) {
          var tx = ox + (dx - dot * n.x), ty = oy + (dy - dot * n.y);
          for (var k = 0; k < 3 && N.solidAt(tx, ty, r, staff); k++) { // push back out of the surface (curvature)
            var m = N.normalAt(tx, ty, r, staff); if (!m) break; tx += m.x * (m.pen + 0.05); ty += m.y * (m.pen + 0.05);
          }
          if (ok(tx, ty)) { e.x = tx; e.y = ty; }
        }
      }
    }
  };
})();
