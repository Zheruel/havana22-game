// data.js - merges window.CONTENT (written by the content agent) with built-in defaults so the
// game always has *something* to show. Everything reads through H.C, never window.CONTENT directly.
(function () {
  'use strict';
  var H = window.H;

  var D = {
    title: 'HAVANA 22 — Večernja smjena',
    tagline: 'Podmornica ti je pod nogama, dim ti je iznad glave.',
    loadingQuotes: [
      { q: 'Dobra cigara zatvara vrata podlostima života.', who: 'Franz Liszt' },
      { q: 'Ordnung muss sein.', who: 'Hrvoje, Njemačka škola' }
    ],
    menu: {
      cigars: [
        { id: 'cigar_cheap', name: 'Cigarillo', price: 6, cost: 2, icon: 'cigar_cheap', desc: 'Za brzu pauzu.' },
        { id: 'cigar_robusto', name: 'Robusto', price: 14, cost: 5, icon: 'cigar_robusto', desc: 'Pouzdan izbor.' },
        { id: 'cigar_corona', name: 'Corona', price: 18, cost: 7, icon: 'cigar_corona', desc: 'Klasik.' },
        { id: 'cigar_hoyo', name: 'Hoyo de Monterrey Double Corona', price: 24, cost: 10, icon: 'cigar_hoyo', desc: 'Hrvojeov izbor.' },
        { id: 'cigar_cohiba', name: 'Cohiba Siglo', price: 32, cost: 14, icon: 'cigar_cohiba', desc: 'Za velike riječi.' },
        { id: 'cigar_sancho', name: 'Sancho Panza Gigantes', price: 28, cost: 12, icon: 'cigar_sancho', desc: 'Za dugu večer.' }
      ],
      drinks: [
        { id: 'espresso', name: 'Espresso', price: 2.5, cost: 0.5, icon: 'espresso', source: 'coffee', desc: 'Crn kao noć.' },
        { id: 'beer_tap', name: 'Topčeno pivo', price: 3.5, cost: 1, icon: 'beer_tap', source: 'tap', desc: 'Laško.' },
        { id: 'beer_velebitsko', name: 'Velebitsko', price: 4, cost: 1.5, icon: 'beer_velebitsko', source: 'tap', desc: 'Domaće.' },
        { id: 'martini', name: 'Martini', price: 9, cost: 3, icon: 'martini', source: 'spirits', desc: 'Protresen, ne miješan.' },
        { id: 'whisky', name: 'Viski', price: 8, cost: 3, icon: 'whisky', source: 'spirits', desc: 'Single malt.' },
        { id: 'rum_caroni', name: 'Caroni rum', price: 12, cost: 5, icon: 'rum_caroni', source: 'spirits', desc: 'Hrvojeov izbor.' },
        { id: 'cognac', name: 'Konjak', price: 10, cost: 4, icon: 'cognac', source: 'spirits', desc: 'Za kraj večeri.' }
      ]
    },
    pairings: [
      { cigar: 'cigar_hoyo', drink: 'rum_caroni', bonus: 14, line: 'Hrvojeov izbor! Crna čokolada ide uz to.' },
      { cigar: 'cigar_cohiba', drink: 'cognac', bonus: 10, line: 'Klasičan par.' },
      { cigar: 'cigar_robusto', drink: 'whisky', bonus: 6, line: 'Dobar spoj.' },
      { cigar: 'cigar_corona', drink: 'espresso', bonus: 4, line: 'Crna kava + Corona.' }
    ],
    customers: {},
    events: {},
    nights: [],
    upgrades: [
      { id: 'fan', name: 'Jači ventilator', cost: 70, desc: 'Ventilacija se hladi 6 s brže i čišći više.', effect: { ventCd: -6, ventPower: 8 } },
      { id: 'lighter', name: 'Zlatni upaljač', cost: 60, desc: 'Zelena zona pri paljenju je 30% veća.', effect: { green: 0.07 } },
      { id: 'shoes', name: 'Udobne cipele', cost: 50, desc: 'Hodaš 15% brže.', effect: { speed: 0.15 } },
      { id: 'music', name: 'Bolji jazz', cost: 80, desc: 'Gosti su 15% strpljiviji.', effect: { patience: 0.15 } },
      { id: 'filter', name: 'Filter zraka', cost: 90, desc: 'Dim nestaje 50% brže.', effect: { smokeDecay: 0.5 } },
      { id: 'chocolate', name: 'Crna čokolada uz račun', cost: 100, desc: 'Napojnice +20%.', effect: { tip: 0.2 } },
      { id: 'pos', name: 'Novi POS', cost: 120, desc: 'Sve cijene +5%.', effect: { sales: 0.05 } }
    ],
    easterEggs: [
      { id: 'liszt', trigger: 'liszt', text: '„Dobra cigara zatvara vrata podlostima života.“ — Franz Liszt (zid iznad šanka)' },
      { id: 'hrvojeov_izbor', trigger: 'pairing_hrvoje', text: 'Hoyo Double Corona + Caroni. Hrvojeov „zadnji izbor“.' },
      { id: 'sancho', trigger: 'sancho', text: 'Sancho Panza Gigantes: Hrvoje ih je jednom pušio na večeri kod vinara Mladena Rožića.' },
      { id: 'idle', trigger: 'idle', text: 'Ordnung muss sein. (Netko je odrastao u Njemačkoj.)' }
    ],
    achievements: [],
    endings: {
      win: 'Preživio si pet noći. Podmornica je isplivala.',
      fail_smoke: 'INSPEKCIJA! Dim se može rezati nožem. Lokal je zatvoren za večeras.',
      fail_stars: 'Ocjena pala na nulu. Google više ne zna gdje je Frankopanska 22.',
      finale: [
        'HOW – The Hospitality Spark. Pozornica. Reflektor. Hrvoje s cigarom.',
        '„Gosti“, počinje Hrvoje, „ugostiteljstvo je iskra. A dim je samo pratnja.“',
        'Publika aplaudira. Roko fotografira. Tomislav tvrdi da bi bolje.'
      ]
    }
  };

  D.customers = {
    hrvoje: { name: 'Hrvoje', short: 'Hrvoje' },
    roko: { name: 'Roko', short: 'Roko', orders: [{ cigar: 'cigar_cheap', drink: 'beer_tap' }], patience: 70, tip: 0,
      lines: { enter: ['Hrvoje, kolika je opet gužva?'], order: ['Nešto jeftino. Na crtu.'], waiting: ['Moja cura kaže da traćim vrijeme...'], served_good: ['Barem nešto danas radi.'], served_bad: ['Ni ovo nije ono što sam naručio.'], leave_happy: ['Hvala. Vraćam se. Na crtu.'], leave_angry: ['Idem popraviti nešto što radi.'], rant: ['Na poslu nešto opet ne radi! Deploy u petak!', 'Cura kaže da više pušim nego što kodiram.'] },
      specials: { talk: 'rant', smoke: 'smoke', special1: 'phone', special2: 'laptop' } },
    mislav: { name: 'Mislav', short: 'Dr. Mislav', orders: [{ cigar: 'cigar_cohiba', drink: 'whisky' }, { cigar: 'cigar_hoyo', drink: 'martini' }], patience: 80, tip: 0.25,
      lines: { enter: ['Dobra večer. Ime je Mislav. Dr. Mislav.'], order: ['Martini. Protresen. Kao i uvijek.'], waiting: ['Bond nikad ne čeka.'], served_good: ['Solidno. Skoro kao operacija.'], served_bad: ['Ovo nije Bond materijal.'], leave_happy: ['Kirurški precizno.'], leave_angry: ['Zvat ću svog odvjetnika. I svog odvjetnika za odvjetnike.'], rant: ['Znate, u operacijskoj sali sve je pitanje... tehnike.', 'Koljeno nije jedino što znam popraviti, dame!'] },
      specials: { talk: 'rant', smoke: 'smoke', special1: 'martini', special2: 'humidor' } },
    matija: { name: 'Matija', short: 'Matija', orders: [{ cigar: 'cigar_robusto', drink: 'espresso' }], patience: 90, tip: 0.2,
      lines: { enter: ['Ovdje se još nisam slomio nijedan stolac. Danas ću.'], order: ['Espresso. Dupli. Bez šećera, protein je slatki.'], waiting: ['Nekad sam bio veći.'], served_good: ['Ovo je ugljikohidrati... nemoj ni gledati.'], served_bad: ['Nije ovo moj recept.'], leave_happy: ['Pronaći ću ti klijenta.'], leave_angry: ['Ni za šest lopatica.'], rant: ['Znaš li koliko ide u dobar biftek? Sve!'] },
      specials: { talk: 'rant', smoke: 'smoke', special1: 'phone', special2: 'flex' } },
    tomislav: { name: 'Tomislav', short: 'Tomislav', orders: [{ cigar: 'cigar_sancho', drink: 'cognac' }, { cigar: 'cigar_cohiba', drink: 'rum_caroni' }], patience: 80, tip: 0.3,
      lines: { enter: ['Padel, stanovi, tenis. Redom.'], order: ['Nešto premium. Kao moji stanovi.'], waiting: ['Ivanišević nije imao moj bekhend.'], served_good: ['Ace!'], served_bad: ['Fault. Dvostruka greška.'], leave_happy: ['Nazovi me za stan.'], leave_angry: ['Vidimo se na terenu.'], rant: ['Stan 40 m² samo 900k. To je poklon!'] },
      specials: { talk: 'rant', smoke: 'smoke', special1: 'racket', special2: 'serve' } },
    baka1: { name: 'Baka Mira', short: 'Baka', lines: { enter: ['Je li ovo kafić?'], rant: ['Guši me! Svi se guše!'] }, specials: {} },
    baka2: { name: 'Baka Ruža', short: 'Baka', lines: { enter: ['Idem se samo pogledati.'], rant: ['Ne mogu disati!'] }, specials: {} },
    gamer1: { name: 'Gejmer', short: 'Gejmer', lines: { enter: ['Gdje je WC, brate?'] }, specials: {} },
    gamer2: { name: 'Gejmer', short: 'Gejmer', lines: { enter: ['GG Arena nema WC...'] }, specials: {} },
    guest1: { name: 'Gost', short: 'Gost', specials: {} },
    guest2: { name: 'Gost', short: 'Gost', specials: {} },
    guest3: { name: 'Gostja', short: 'Gostja', specials: {} },
    guest4: { name: 'Gostja', short: 'Gostja', specials: {} }
  };

  // generic guest barks used when a customer has no lines of their own
  D.genericLines = {
    enter: ['Dobra večer!', 'Ima li mjesta?', 'Mmm, miris cigara.', 'Podmornica, opet.'],
    order: ['Jednu cigaru i nešto za piti, molim.', 'Nešto lijepo za večeras.', 'Preporuči mi nešto, Hrvoje.'],
    waiting: ['Hrvoje...?', 'Ovdje smo!', 'Još čekam...', 'Gdje je konobar?'],
    served_good: ['Odlično!', 'To je to!', 'Bravo, Hrvoje!'],
    served_bad: ['Ovo nisam naručio.', 'Pažljivo, molim.'],
    leave_happy: ['Vidimo se uskoro!', 'Odlično večeras!', 'Pet zvjezdica!'],
    leave_angry: ['Nikad više!', 'Jedna zvjezdica!', 'Idem u Havana Shop.'],
    rant: ['...']
  };

  D.events = {
    baka: {
      intro: 'Mladiću, guši me taj dim! Ovo je zdravstveni problem!',
      complaints: ['Ovo je nezdravo!', 'Zovem komunalne!', 'Gospode, kakav dim!', 'Kako se ovdje diše?!'],
      choices: [
        { text: 'Gospođo, ovo je cigar lounge. Ali vi ste dragocjena. Espresso je na kuću?', result: 'best', reply: 'Pa... dobro. Samo jedan.' },
        { text: 'Otvorit ću prozor. Malo.', result: 'ok', reply: 'Hm. Vidjet ćemo.' },
        { text: 'Pa nitko vas nije zvao.', result: 'bad', reply: 'Nezasluženo! Ja ću...' }
      ],
      ignored: 'Zovem komunalce!'
    },
    gamers: {
      enter: ['Gdje je WC, brate?', 'GG, ovdje smo!', 'Samo na WC, kratko.'],
      caught: ['WC je samo za goste!', 'Stani!'],
      reachedWC: ['Nisu ni espresso kupili...'],
      espresso: ['Dva espressa, molim!']
    },
    shopRush: { lines: ['Havana Shop zatvara! Prelaze preko ceste!'] }
  };

  D.nights = [
    { n: 1, title: 'Prva smjena', intro: 'Roko dolazi. Nauči sve: humidor, šank, paljenje.', goal: 60, duration: 360,
      spawns: [{ t: 40, who: 'roko' }], outro: 'Prva noć je prošla.' },
    { n: 2, title: 'Baka i gejmeri', intro: 'Baka se žali na dim, gejmeri idu na WC.', goal: 100, duration: 360,
      spawns: [{ t: 60, who: 'baka' }, { t: 160, who: 'gamers' }, { t: 270, who: 'baka' }], outro: 'Preživio si drugu.' },
    { n: 3, title: 'Dr. Mislav', intro: 'Koljeni kirurg s putnim humidorom.', goal: 140, duration: 360,
      spawns: [{ t: 40, who: 'mislav' }, { t: 180, who: 'gamers' }, { t: 260, who: 'baka' }], outro: 'Kirurški uspješno.' },
    { n: 4, title: 'Matija', intro: 'Stolci strepe.', goal: 190, duration: 360,
      spawns: [{ t: 30, who: 'matija' }, { t: 130, who: 'gamers' }, { t: 210, who: 'baka' }, { t: 290, who: 'roko' }], outro: 'Stolci su podnijeli.' },
    { n: 5, title: 'Veliki petak', intro: 'Svi su tu. I Tomislav.', goal: 250, duration: 360,
      spawns: [{ t: 20, who: 'roko' }, { t: 55, who: 'mislav' }, { t: 100, who: 'matija' }, { t: 140, who: 'tomislav' }, { t: 175, who: 'baka' }, { t: 215, who: 'gamers' }, { t: 240, who: 'shopRush' }, { t: 300, who: 'baka' }], outro: 'Sve je prošlo.' }
  ];
  D.endless = {
    title: 'Petak navečer', intro: 'Petak navečer, opet. Svaka večer je malo gušća. Koliko izdržiš?', goal: 'Nema cilja. Samo dim, ocjena i preživljavanje.',
    scaling: { spawnRatePerNight: 0.08, smokeRatePerNight: 0.04, patiencePerNight: -0.02 },
    pool: [{ who: 'guest', weight: 12 }, { who: 'guest1', weight: 4 }, { who: 'guest2', weight: 4 }, { who: 'guest3', weight: 4 }, { who: 'guest4', weight: 4 },
      { who: 'roko', weight: 2 }, { who: 'mislav', weight: 1.5 }, { who: 'matija', weight: 1.5 }, { who: 'tomislav', weight: 1.5 }, { who: 'baka1', weight: 1 }, { who: 'baka2', weight: 1 }, { who: 'gamers', weight: 1 }],
    fixed: [{ t: 240, who: 'shopRush', count: 5 }],
    modifiers: [{ id: 'kisa', name: 'Kišni petak', desc: 'Prozori zatvoreni, dim raste 15% brže.', fx: { smokeRateMult: 1.15 } }],
    outro: ['Još jedan petak iza tebe.']
  };
  D.achievements = [
    { id: 'prvi_dim', name: 'Prvi dim', desc: 'Posluži prvog gosta.', cond: { stat: 'served', gte: 1 } },
    { id: 'savrsena_vatra', name: 'Savršena vatra', desc: 'Prvo savršeno paljenje.', cond: { stat: 'perfect', gte: 1 } },
    { id: 'car_za_cigare', name: 'Car za cigare', desc: 'Prođi svih pet noći.', cond: { stat: 'nightsDone', gte: 5 } }
  ];

  // ---------------------------------------------------------------------------------------------
  function isArr(x) { return Array.isArray(x) && x.length > 0; }
  function num(x, d) { x = typeof x === 'string' ? parseFloat(x.replace(',', '.')) : x; return (typeof x === 'number' && isFinite(x)) ? x : d; }

  H.Data = {
    build: function () {
      var S = window.CONTENT || {};
      var C = { raw: S };
      C.title = S.title || D.title;
      C.tagline = S.tagline || D.tagline;
      C.loadingQuotes = isArr(S.loadingQuotes) ? S.loadingQuotes : D.loadingQuotes;

      // menu ---------------------------------------------------------------
      var m = S.menu || {};
      function normItems(arr, def, kind) {
        var src = isArr(arr) ? arr : def;
        return src.filter(function (x) { return x && x.id; }).map(function (x) {
          return {
            id: x.id, name: x.name || x.id, price: num(x.price, 8), cost: num(x.cost, 2),
            icon: x.icon || x.id, desc: x.desc || '', source: x.source || (kind === 'drink' ? 'tap' : 'humidor'),
            smoke: num(x.smoke || x.smokeSec, 0), smokeLoad: num(x.smokeLoad, 1), light: num(x.light, 0.25), say: x.say || x.name || x.id, origin: x.origin || ''
          };
        });
      }
      C.cigars = normItems(m.cigars, D.menu.cigars, 'cigar');
      C.drinks = normItems(m.drinks, D.menu.drinks, 'drink');
      if (!C.cigars.length) C.cigars = normItems(null, D.menu.cigars, 'cigar');
      if (!C.drinks.length) C.drinks = normItems(null, D.menu.drinks, 'drink');
      C.pairings = isArr(S.pairings) ? S.pairings : D.pairings;
      C.itemById = {};
      C.cigars.forEach(function (x) { x.kind = 'cigar'; C.itemById[x.id] = x; });
      C.drinks.forEach(function (x) { x.kind = 'drink'; C.itemById[x.id] = x; });
      C.cigar = function (id) { return C.cigars.filter(function (x) { return x.id === id; })[0]; };
      C.drink = function (id) { return C.drinks.filter(function (x) { return x.id === id; })[0]; };
      C.cheapestCigar = C.cigars.slice().sort(function (a, b) { return a.price - b.price; })[0];
      C.priciestCigar = C.cigars.slice().sort(function (a, b) { return b.price - a.price; })[0];
      C.pairing = function (cig, dr) {
        for (var i = 0; i < C.pairings.length; i++) {
          var p = C.pairings[i];
          if (p && p.cigar === cig && p.drink === dr) return p;
        }
        return null;
      };

      // customers ----------------------------------------------------------
      C.customers = {};
      var ids = {};
      Object.keys(D.customers).forEach(function (k) { ids[k] = 1; });
      Object.keys(S.customers || {}).forEach(function (k) { ids[k] = 1; });
      Object.keys(ids).forEach(function (id) {
        var d = D.customers[id] || {}, s = (S.customers || {})[id] || {};
        var c = {};
        c.id = id;
        c.name = s.name || d.name || id;
        c.short = s.short || d.short || c.name;
        c.bio = s.bio || d.bio || '';
        c.orders = isArr(s.orders) ? s.orders : (d.orders || []);
        c.patience = num(s.patience, num(d.patience, 75));
        c.tip = num(s.tip, num(d.tip, 0.12));
        c.specials = Object.assign({}, d.specials || {}, s.specials || {});
        c.portraitNote = s.portraitNote || '';
        c.lines = {};
        var keys = {};
        Object.keys(D.genericLines).forEach(function (k) { keys[k] = 1; });
        Object.keys(d.lines || {}).forEach(function (k) { keys[k] = 1; });
        Object.keys(s.lines || {}).forEach(function (k) { keys[k] = 1; });
        Object.keys(keys).forEach(function (k) {
          var l = H.lines((s.lines || {})[k]);
          if (!l.length) l = H.lines((d.lines || {})[k]);
          // only guests fall back to generic lines; named characters stay silent instead of saying guest lines
          if (!l.length && /^guest/.test(id)) l = D.genericLines[k] || [];
          c.lines[k] = l;
        });
        C.customers[id] = c;
      });
      C.cust = function (id) { return C.customers[id] || C.customers.guest1; };
      C.say = function (id, key) {
        var c = C.customers[id];
        var l = c && c.lines[key];
        if (l && l.length) return H.pick(l);
        return null;
      };
      C.generic = function (key) { return H.pick(D.genericLines[key] || []) || ''; };

      // events (kept raw; events.js reads tolerantly) ----------------------
      C.events = {};
      var evKeys = {};
      Object.keys(D.events).forEach(function (k) { evKeys[k] = 1; });
      Object.keys(S.events || {}).forEach(function (k) { evKeys[k] = 1; });
      Object.keys(evKeys).forEach(function (k) {
        var s = (S.events || {})[k], d = D.events[k];
        C.events[k] = (s && typeof s === 'object') ? s : (d || {});
        C.events[k].__def = d || {};
      });

      // nights -------------------------------------------------------------
      var sn = isArr(S.nights) ? S.nights : [];
      function obj(x) { return (x && typeof x === 'object' && !Array.isArray(x)) ? x : null; }
      C.nights = D.nights.map(function (d, i) {
        var s = sn.filter(function (x) { return x && x.n === d.n; })[0] || sn[i] || {};
        var n = { n: d.n };
        n.title = s.title || d.title; n.day = s.day || '';
        n.intro = H.lines(s.intro).join(' ') || d.intro;
        n.outro = H.lines(s.outro).join(' ') || d.outro;
        n.outroGood = H.lines(s.outroGood).join(' '); n.outroBad = H.lines(s.outroBad).join(' ');
        n.duration = num(s.duration, d.duration);
        if (n.duration < 60 || n.duration > 1000) n.duration = d.duration;
        n.spawns = isArr(s.spawns) ? s.spawns : d.spawns;
        n.modifierName = s.modifierName || '';
        n.modifier = typeof s.modifier === 'string' ? s.modifier : (obj(s.modifier) ? (s.modifier.text || s.modifier.desc || s.modifier.name || '') : '');
        n.modifierFx = obj(s.modifierFx) || (obj(s.modifier) && obj(s.modifier.fx)) || null;
        // goal: goalCash (number) > number > "... 130 € ..." string > {money,text}
        var g = s.goal, gm = d.goal, gt = '';
        if (typeof g === 'number') gm = g;
        else if (typeof g === 'string') { gt = g; var mm = g.match(/(\d+(?:[.,]\d+)?)\s*(?:€|eur|EUR)/); if (mm) gm = num(mm[1], gm); }
        else if (obj(g)) { gm = num(g.money != null ? g.money : g.cash, gm); gt = g.text || g.desc || ''; }
        if (typeof s.goalCash === 'number') gm = s.goalCash;
        n.goal = gm; n.goalText = gt; n.goalStars = num(s.goalStars, 0);
        var bg = obj(s.bonusGoal);
        n.bonusGoal = bg && bg.stat ? { text: bg.text || '', stat: bg.stat, gte: num(bg.gte, 1), reward: obj(bg.reward) || { cash: 15 } } : null;
        n.tips = isArr(s.tips) ? s.tips.filter(function (x) { return x && x.text; }).map(function (x) { return { t: num(x.t, 0), text: x.text }; }) : [];
        n.finale = s.finale || '';
        return n;
      });
      // endless mode ("Petak navečer")
      var se = obj(S.endless) || {}, de = D.endless;
      C.endless = {
        title: se.title || de.title, intro: H.lines(se.intro).join(' ') || de.intro, goal: se.goal || de.goal,
        scaling: obj(se.scaling) || de.scaling,
        pool: isArr(se.pool) ? se.pool.filter(function (x) { return x && x.who; }) : de.pool,
        fixed: isArr(se.fixed) ? se.fixed : de.fixed,
        modifiers: isArr(se.modifiers) ? se.modifiers.filter(function (x) { return x && x.name; }) : de.modifiers,
        outro: isArr(se.outro) ? se.outro : de.outro
      };
      var endCache = {};
      C.night = function (n) {
        if (n <= C.nights.length) return C.nights[Math.max(1, n) - 1];
        if (endCache[n]) return endCache[n];
        var k = n - C.nights.length, E = C.endless, sc = E.scaling || {}, mod = E.modifiers[(k - 1) % Math.max(1, E.modifiers.length)] || null;
        var fx = {}; if (mod && mod.fx) Object.keys(mod.fx).forEach(function (a) { fx[a] = mod.fx[a]; });
        function mul(key, f) { fx[key] = (fx[key] != null ? fx[key] : 1) * f; }
        mul('spawnRateMult', 1 + num(sc.spawnRatePerNight, 0.08) * k); mul('smokeRateMult', 1 + num(sc.smokeRatePerNight, 0.04) * k); mul('patienceMult', Math.max(0.5, 1 + num(sc.patiencePerNight, -0.02) * k));
        var last = C.nights[C.nights.length - 1];
        endCache[n] = { n: n, endless: true, k: k, title: E.title + ' #' + k, day: 'Petak', intro: E.intro, outro: H.pick(E.outro) || '', outroGood: '', outroBad: '', duration: last.duration, spawns: null,
          modifierName: mod ? mod.name : '', modifier: mod ? mod.desc : '', modifierFx: fx, goal: 0, goalText: E.goal, goalStars: 0, bonusGoal: null, tips: [], finale: '' };
        return endCache[n];
      };

      // upgrades / eggs / achievements / endings ---------------------------
      C.upgrades = (isArr(S.upgrades) ? S.upgrades : D.upgrades).filter(function (u) { return u && u.id; }).map(function (u) {
        var dd = D.upgrades.filter(function (x) { return x.id === u.id; })[0] || {};
        return { id: u.id, name: u.name || dd.name || u.id, cost: num(u.cost, dd.cost || 80), desc: u.desc || dd.desc || '', effect: u.effect != null ? u.effect : dd.effect, minNight: num(u.minNight, 1) };
      });
      C.eggs = (isArr(S.easterEggs) ? S.easterEggs : D.easterEggs).filter(function (e) { return e && (e.text || e.id); });
      C.achievements = (isArr(S.achievements) ? S.achievements : D.achievements).filter(function (a) { return a && a.id && a.cond && a.cond.stat; });
      C.ui = obj(S.ui) || {}; C.reviews = obj(S.reviews) || {};
      C.toast = function (key, fb) { var t = C.ui.toast && C.ui.toast[key]; return t || fb || ''; };
      var e = S.endings || {};
      C.endings = {
        win: H.lines(e.win).join(' ') || D.endings.win,
        fail_smoke: H.lines(e.fail_smoke).join(' ') || D.endings.fail_smoke,
        fail_stars: H.lines(e.fail_stars).join(' ') || D.endings.fail_stars,
        finale: H.lines(e.finale).length ? H.lines(e.finale) : D.endings.finale,
        winTitle: (typeof e.winTitle === 'string' && e.winTitle) || '',
        fail_smokeTitle: (typeof e.fail_smokeTitle === 'string' && e.fail_smokeTitle) || '',
        fail_starsTitle: (typeof e.fail_starsTitle === 'string' && e.fail_starsTitle) || '',
        finaleTitle: (typeof e.finaleTitle === 'string' && e.finaleTitle) || 'HOW',
        finaleScript: isArr(e.finaleScript) ? e.finaleScript.filter(function (x) { return x && (x.text || typeof x === 'string'); }).map(function (x) { return typeof x === 'string' ? { who: 'narrator', text: x } : { who: x.who || 'narrator', text: x.text }; }) : [],
        credits: isArr(e.credits) ? e.credits.filter(function (x) { return typeof x === 'string'; }) : []
      };
      H.C = C;
      return C;
    }
  };
  H.Data.build();
})();
