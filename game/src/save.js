// save.js - localStorage persistence. Every access is try/catch'd; the game works without storage.
(function () {
  'use strict';
  var H = window.H;
  var KEY = 'havana22_save_v1';
  var mem = null; // in-memory fallback

  H.Save = {
    load: function () {
      try {
        var raw = window.localStorage.getItem(KEY);
        if (raw) { var o = JSON.parse(raw); if (o && typeof o === 'object') { mem = o; return o; } }
      } catch (e) { /* storage unavailable */ }
      return mem;
    },
    write: function (data) {
      mem = data;
      try { window.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
    },
    clear: function () {
      mem = null;
      try { window.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    },
    // small settings blob kept separately from progress
    getSetting: function (k, d) {
      try { var v = window.localStorage.getItem('havana22_' + k); if (v != null) return JSON.parse(v); } catch (e) { /* ignore */ }
      return d;
    },
    setSetting: function (k, v) {
      try { window.localStorage.setItem('havana22_' + k, JSON.stringify(v)); } catch (e) { /* ignore */ }
    }
  };
})();
