// audio.js - 100% procedural WebAudio: lounge-jazz loop + sfx. No external audio files.
(function () {
  'use strict';
  var H = window.H;

  var ctx = null, master = null, musicBus = null, sfxBus = null;
  var muted = false, musicWanted = false, musicRunning = false;
  var timer = null, nextT = 0, stepIdx = 0, bpm = 86;
  var noiseBuf = null;

  function ensure() {
    if (!ctx) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9; master.connect(ctx.destination);
        musicBus = ctx.createGain(); musicBus.gain.value = 0.55; musicBus.connect(master);
        sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(master);
        var len = ctx.sampleRate * 2, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        noiseBuf = b;
      } catch (e) { ctx = null; return null; }
    }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* ignore */ } }
    return ctx;
  }

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  // one enveloped oscillator
  function tone(freq, t0, dur, type, vol, opts) {
    if (!ctx) return;
    opts = opts || {};
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (opts.slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, opts.slide), t0 + dur);
    var a = opts.attack || 0.005;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    var node = o;
    if (opts.lp) {
      var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = opts.lp;
      o.connect(f); node = f;
    }
    node.connect(g); g.connect(opts.bus || sfxBus);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function noise(t0, dur, vol, ftype, ffreq, q, opts) {
    if (!ctx || !noiseBuf) return;
    opts = opts || {};
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var f = ctx.createBiquadFilter(); f.type = ftype || 'bandpass'; f.frequency.setValueAtTime(ffreq || 1000, t0); f.Q.value = q || 1;
    if (opts.sweep) f.frequency.exponentialRampToValueAtTime(opts.sweep, t0 + dur);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + (opts.attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(opts.bus || sfxBus);
    s.start(t0, Math.random()); s.stop(t0 + dur + 0.05);
  }

  // ---------------- music: ii-V-I-vi lounge loop ----------------
  var CH = [
    { root: 38, tones: [53, 57, 60, 64], scale: [62, 64, 65, 67, 69, 72, 74] },       // Dm9-ish
    { root: 43, tones: [53, 59, 62, 65], scale: [62, 65, 67, 69, 71, 74, 77] },       // G13
    { root: 36, tones: [52, 55, 59, 62], scale: [64, 67, 69, 71, 72, 74, 76] },       // Cmaj9
    { root: 45, tones: [55, 60, 64, 67], scale: [60, 64, 67, 69, 72, 76] }            // Am7
  ];
  var lastMel = 72;
  function scheduleStep(i, t) {
    var bar = Math.floor(i / 8) % 4, s = i % 8, ch = CH[bar], sw = (s % 2 === 1) ? 0.06 : 0;
    var st = t + sw * (60 / bpm);
    // walking bass on quarter notes
    if (s % 2 === 0) {
      var q = s / 2, bn = [ch.root, ch.root + 7, ch.root + 12 - (q === 2 ? 2 : 0), ch.root + 5 + (bar === 3 ? 2 : 0)][q];
      tone(mtof(bn), t, 0.42, 'triangle', 0.28, { bus: musicBus, lp: 500, attack: 0.01 });
    }
    // rhodes-like comping on the "and" of 2 and the "and" of 4 (plus bar-start voicing)
    if (s === 3 || s === 7 || (s === 0 && bar % 2 === 0)) {
      for (var k = 0; k < ch.tones.length; k++) {
        tone(mtof(ch.tones[k]), st, 0.7, 'sine', 0.045, { bus: musicBus, attack: 0.01 });
        tone(mtof(ch.tones[k]) * 2.005, st, 0.35, 'triangle', 0.012, { bus: musicBus, attack: 0.008, lp: 2500 });
      }
    }
    // brushes
    noise(st, 0.05, s % 2 === 0 ? 0.05 : 0.028, 'highpass', 6500, 0.7, { bus: musicBus });
    if (s === 2 || s === 6) noise(t, 0.09, 0.05, 'bandpass', 1800, 0.8, { bus: musicBus });
    // sparse vibraphone-ish melody
    if (Math.random() < (s % 2 === 0 ? 0.42 : 0.3)) {
      var sc = ch.scale, idx = 0, best = 1e9;
      for (var j = 0; j < sc.length; j++) { var dd = Math.abs(sc[j] - lastMel) + Math.random() * 3; if (dd < best && sc[j] !== lastMel) { best = dd; idx = j; } }
      lastMel = sc[idx];
      var dur = 0.25 + Math.random() * 0.5;
      tone(mtof(lastMel), st, dur + 0.3, 'sine', 0.07, { bus: musicBus, attack: 0.008 });
      tone(mtof(lastMel) * 4, st, 0.12, 'sine', 0.012, { bus: musicBus });
    }
  }
  function pump() {
    if (!ctx || !musicRunning) return;
    var stepDur = 60 / bpm / 2;
    while (nextT < ctx.currentTime + 0.35) {
      if (nextT < ctx.currentTime - 0.1) nextT = ctx.currentTime + 0.05;
      scheduleStep(stepIdx, nextT);
      nextT += stepDur; stepIdx++;
    }
  }

  H.Audio = {
    unlock: function () { ensure(); if (musicWanted && !musicRunning) this.startMusic(); },
    isMuted: function () { return muted; },
    setMuted: function (m) {
      muted = !!m; H.Save.setSetting('muted', muted);
      if (master) master.gain.value = muted ? 0 : 0.9;
    },
    toggleMute: function () { this.setMuted(!muted); return muted; },
    startMusic: function () {
      musicWanted = true;
      if (!ensure() || musicRunning) return;
      musicRunning = true; nextT = ctx.currentTime + 0.1; stepIdx = 0;
      timer = setInterval(pump, 60);
    },
    stopMusic: function () {
      musicWanted = false; musicRunning = false;
      if (timer) { clearInterval(timer); timer = null; }
    },
    setMusicLevel: function (v) { if (musicBus) musicBus.gain.value = v; },

    // ---- sfx ----
    click: function () { if (!ensure()) return; tone(760, ctx.currentTime, 0.05, 'square', 0.06); },
    select: function () { if (!ensure()) return; var t = ctx.currentTime; tone(520, t, 0.06, 'triangle', 0.12); tone(780, t + 0.05, 0.09, 'triangle', 0.12); },
    pop: function () {
      if (!ensure()) return; var t = ctx.currentTime, f = 250 + Math.random() * 350;
      tone(f, t, 0.09, 'sine', 0.11, { slide: f * 2.4 });
    },
    doorChime: function () {
      if (!ensure()) return; var t = ctx.currentTime;
      [[988, 0], [1319, 0.18]].forEach(function (p) {
        tone(p[0], t + p[1], 1.1, 'sine', 0.16); tone(p[0] * 2.76, t + p[1], 0.5, 'sine', 0.04);
      });
    },
    ping: function () { // sonar
      if (!ensure()) return; var t = ctx.currentTime;
      [0, 0.42, 0.85].forEach(function (d, i) { tone(1180, t + d, 1.2, 'sine', 0.2 / (1 + i * 1.6), { slide: 1150 }); });
    },
    cash: function () {
      if (!ensure()) return; var t = ctx.currentTime;
      noise(t, 0.04, 0.12, 'highpass', 3000, 1);
      tone(2093, t + 0.05, 0.18, 'square', 0.07); tone(2637, t + 0.13, 0.5, 'square', 0.07);
      noise(t + 0.03, 0.12, 0.05, 'bandpass', 4200, 4);
    },
    cough: function () {
      if (!ensure()) return; var t = ctx.currentTime;
      for (var i = 0; i < 2; i++) { noise(t + i * 0.17, 0.11, 0.2, 'bandpass', 700 - i * 150, 2.5); tone(180 - i * 30, t + i * 0.17, 0.1, 'sawtooth', 0.05, { slide: 90, lp: 700 }); }
    },
    lighter: function () {
      if (!ensure()) return; var t = ctx.currentTime;
      noise(t, 0.03, 0.15, 'highpass', 2500, 1); noise(t + 0.06, 0.35, 0.07, 'bandpass', 900, 0.6, { sweep: 2200 });
    },
    good: function () { if (!ensure()) return; var t = ctx.currentTime;[523, 659, 784].forEach(function (f, i) { tone(f, t + i * 0.07, 0.25, 'triangle', 0.13); }); },
    perfect: function () { if (!ensure()) return; var t = ctx.currentTime;[659, 784, 988, 1319].forEach(function (f, i) { tone(f, t + i * 0.07, 0.4, 'triangle', 0.13); tone(f * 2, t + i * 0.07, 0.2, 'sine', 0.04); }); },
    bad: function () { if (!ensure()) return; var t = ctx.currentTime; tone(160, t, 0.35, 'sawtooth', 0.13, { slide: 80, lp: 900 }); },
    vent: function () { if (!ensure()) return; var t = ctx.currentTime; noise(t, 2.6, 0.22, 'bandpass', 250, 0.8, { sweep: 1500, attack: 0.4 }); },
    alarm: function () { if (!ensure()) return; var t = ctx.currentTime; for (var i = 0; i < 6; i++) tone(i % 2 ? 620 : 880, t + i * 0.28, 0.26, 'square', 0.09); },
    crack: function () { if (!ensure()) return; var t = ctx.currentTime; noise(t, 0.25, 0.3, 'lowpass', 900, 0.7); tone(90, t, 0.3, 'sawtooth', 0.15, { slide: 40 }); noise(t + 0.05, 0.08, 0.2, 'highpass', 3000, 1); },
    glass: function () { if (!ensure()) return; var t = ctx.currentTime; noise(t, 0.35, 0.2, 'highpass', 4500, 1.5); tone(3100, t, 0.2, 'sine', 0.05); tone(2400, t + 0.04, 0.25, 'sine', 0.05); },
    shout: function () { if (!ensure()) return; var t = ctx.currentTime; tone(300, t, 0.22, 'sawtooth', 0.12, { slide: 200, lp: 1400 }); tone(450, t + 0.02, 0.2, 'square', 0.05, { slide: 320, lp: 1500 }); },
    alert: function () { if (!ensure()) return; var t = ctx.currentTime; tone(880, t, 0.1, 'square', 0.09); tone(660, t + 0.12, 0.16, 'square', 0.09); },
    buff: function () { if (!ensure()) return; var t = ctx.currentTime;[392, 523, 659, 784, 1047].forEach(function (f, i) { tone(f, t + i * 0.05, 0.18, 'square', 0.06); }); },
    applause: function () { if (!ensure()) return; var t = ctx.currentTime; noise(t, 2.4, 0.12, 'bandpass', 2400, 0.5, { attack: 0.3 }); noise(t + 0.2, 1.8, 0.1, 'highpass', 4000, 0.5, { attack: 0.3 }); },
    bounce: function () { if (!ensure()) return; var t = ctx.currentTime; tone(330, t, 0.07, 'sine', 0.1, { slide: 180 }); },
    wc: function () { if (!ensure()) return; var t = ctx.currentTime; tone(200, t, 0.08, 'square', 0.06); tone(150, t + 0.09, 0.1, 'square', 0.06); }
  };
  H.Audio.setMuted(H.Save.getSetting('muted', false));
})();
