#!/usr/bin/env node
// Validira game/content/content.js (window.CONTENT). Izlaz 0 = zeleno, 1 = greške.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const file = path.join(__dirname, '..', 'game', 'content', 'content.js');
const code = fs.readFileSync(file, 'utf8');
const sandbox = { window: {} };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);
try {
  vm.runInContext(code, sandbox, { filename: 'content.js' });
} catch (e) {
  console.error('FATAL: content.js se ne može izvršiti:', e.message);
  process.exit(1);
}
const C = sandbox.window.CONTENT;
const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

if (!C || typeof C !== 'object') { console.error('FATAL: window.CONTENT ne postoji'); process.exit(1); }

const ICONS = ['cigar_robusto', 'cigar_corona', 'cigar_cohiba', 'cigar_hoyo', 'cigar_sancho', 'cigar_cheap', 'rum_caroni', 'whisky',
  'cognac', 'beer_tap', 'beer_velebitsko', 'espresso', 'martini', 'black_chocolate'];
const CIGARS = ICONS.slice(0, 6);
const DRINKS = ICONS.slice(6);
const CHAR_IDS = ['hrvoje', 'roko', 'mislav', 'matija', 'tomislav', 'baka1', 'baka2', 'gamer1', 'gamer2', 'guest1', 'guest2', 'guest3', 'guest4'];
const BUCKETS = ['enter', 'order', 'waiting', 'served_good', 'served_bad', 'leave_happy', 'leave_angry', 'rant'];
const SOURCES = ['tap', 'spirits', 'coffee'];
const WHO_SPAWN = ['guest', 'guest1', 'guest2', 'guest3', 'guest4', 'roko', 'mislav', 'matija', 'tomislav', 'baka1', 'baka2', 'gamers', 'shopRush'];
const TREE_WHO = CHAR_IDS.concat(['narrator', 'gost']);
const FX_KEYS = ['cash', 'stars', 'smoke', 'patience', 'freeze', 'buff', 'giveCigar', 'debt', 'tipBonus', 'flag', 'seatBroken', 'rep'];
const EFFECT_KEYS = ['patienceMult', 'tipMult', 'smokeRateMult', 'moveSpeedMult', 'spawnRateMult', 'priceMult', 'rantFreezeMult', 'hotfixMult',
  'lightZone', 'ventCooldown', 'ventPower', 'carryCigar', 'carryDrink', 'bakaPatience', 'armchairProof', 'wcGuard', 'sonar', 'chocolateAuto',
  'padelProof', 'hrvojevBonus', 'smoke', 'autoLight'];
const MAXLEN = 110;

const isStr = (s) => typeof s === 'string' && s.trim().length > 0;
const isNum = (n) => typeof n === 'number' && isFinite(n);
const arr = (a) => Array.isArray(a);

/* ---- opća provjera stringova ---- */
// unutar events: ključevi čije vrijednosti smiju biti dulje od 110 znakova (uvodi, opisi, promptovi)
const EVENT_LONG_OK = new Set(['intro', 'prompt', 'announce', 'ignored', 'desc', 'banner', 'alert', 'bought']);
function walk(v, p, key) {
  if (typeof v === 'string') {
    const isLine = /^customers\.[a-z0-9]+\.lines\./.test(p) || p.startsWith('reviews.') || p.startsWith('ui.toast') ||
      (p.startsWith('events.') && !(EVENT_LONG_OK.has(key) && !/\.nodes\./.test(p)));
    if (isLine && v.length > MAXLEN) err(`predugo (${v.length} > ${MAXLEN}) @ ${p}: "${v.slice(0, 60)}..."`);
    else if (v.length > 400 && !p.startsWith('endings') && !p.startsWith('nights')) warn(`vrlo dugo (${v.length}) @ ${p}`);
    if (/\{[A-Za-z_]+\}/.test(v)) err(`placeholder u tekstu @ ${p}: ${v}`);
    const o = (v.match(/„/g) || []).length, c = (v.match(/“/g) || []).length;
    if (o !== c) warn(`nebalansirani navodnici @ ${p}: ${v}`);
    if (/\s{2,}/.test(v)) warn(`dvostruki razmak @ ${p}: "${v}"`);
    if (v.includes('\u00a0') || v.includes('\t')) warn(`neobičan razmak @ ${p}`);
    if (/[\u2018\u201A\u201B]/.test(v)) warn(`neobičan apostrof @ ${p}: ${v}`);
  } else if (Array.isArray(v)) {
    v.forEach((x, i) => walk(x, `${p}[${i}]`, key));
  } else if (v && typeof v === 'object') {
    Object.keys(v).forEach((k) => walk(v[k], p ? `${p}.${k}` : k, k));
  }
}
walk(C, '', []);

/* ---- top-level ---- */
['title', 'tagline'].forEach((k) => { if (!isStr(C[k])) err(`missing ${k}`); });
if (C.title !== 'HAVANA 22 — Večernja smjena') err('title mora biti točno "HAVANA 22 — Večernja smjena"');

/* ---- loadingQuotes ---- */
if (!arr(C.loadingQuotes) || C.loadingQuotes.length < 20) err('loadingQuotes < 20');
else C.loadingQuotes.forEach((q, i) => { if (!isStr(q.q) || !isStr(q.who)) err(`loadingQuotes[${i}] treba {q,who}`); });
['Liszt', 'Sinatra', 'Davidoff', 'Burns', 'Twain', 'Churchill', 'Edward', 'Collins'].forEach((n) => {
  if (!(C.loadingQuotes || []).some((q) => q.who.indexOf(n) >= 0)) err(`loadingQuotes: nema citata za ${n}`);
});

/* ---- menu ---- */
const cigarIds = new Set(), drinkIds = new Set();
if (!C.menu || !arr(C.menu.cigars) || !arr(C.menu.drinks)) err('menu.cigars/drinks missing');
else {
  if (C.menu.cigars.length < 5) err('menu.cigars < 5');
  if (C.menu.drinks.length < 7) err('menu.drinks < 7');
  C.menu.cigars.forEach((c) => {
    if (!isStr(c.id) || !isStr(c.name) || !isNum(c.price) || !isNum(c.cost) || !isStr(c.icon) || !isStr(c.desc)) err(`cigar nepotpun: ${c.id}`);
    if (!CIGARS.includes(c.icon)) err(`cigar icon nije na popisu: ${c.icon}`);
    if (cigarIds.has(c.id)) err(`dupli cigar id ${c.id}`); cigarIds.add(c.id);
    if (c.cost >= c.price) warn(`cigar ${c.id}: cost >= price`);
  });
  C.menu.drinks.forEach((d) => {
    if (!isStr(d.id) || !isStr(d.name) || !isNum(d.price) || !isNum(d.cost) || !isStr(d.icon) || !isStr(d.desc)) err(`drink nepotpun: ${d.id}`);
    if (!DRINKS.includes(d.icon)) err(`drink icon nije na popisu: ${d.icon}`);
    if (!SOURCES.includes(d.source)) err(`drink source nevaljan: ${d.id}/${d.source}`);
    if (drinkIds.has(d.id)) err(`dupli drink id ${d.id}`); drinkIds.add(d.id);
    if (d.cost >= d.price) warn(`drink ${d.id}: cost >= price`);
  });
  ['cigar_robusto', 'cigar_corona', 'cigar_cohiba', 'cigar_hoyo', 'cigar_sancho', 'cigar_cheap'].forEach((id) => { if (!cigarIds.has(id)) err(`nedostaje cigara ${id}`); });
  ['rum_caroni', 'whisky', 'cognac', 'beer_tap', 'beer_velebitsko', 'espresso', 'martini', 'black_chocolate'].forEach((id) => { if (!drinkIds.has(id)) err(`nedostaje piće ${id}`); });
}
const okCigar = (id) => cigarIds.has(id);
const okDrink = (id) => drinkIds.has(id);

/* ---- pairings ---- */
if (!arr(C.pairings) || C.pairings.length < 6) err('pairings < 6');
else {
  const seen = new Set();
  C.pairings.forEach((p, i) => {
    if (!okCigar(p.cigar)) err(`pairings[${i}].cigar nepoznat: ${p.cigar}`);
    if (!okDrink(p.drink)) err(`pairings[${i}].drink nepoznat: ${p.drink}`);
    if (!isNum(p.bonus) || !isStr(p.line)) err(`pairings[${i}] treba bonus, line`);
    const k = p.cigar + '+' + p.drink; if (seen.has(k)) err(`dupli pairing ${k}`); seen.add(k);
  });
  const hi = C.pairings.find((p) => p.cigar === 'cigar_hoyo' && p.drink === 'rum_caroni');
  if (!hi) err('nema Hrvojevog izbora (hoyo + rum_caroni)');
  else if (!/Hrvojev/.test(hi.name || '') || !/Hoyo/.test(hi.line)) err('Hrvojev izbor: ime/linija');
  if (!C.pairings.some((p) => p.drink === 'black_chocolate')) err('nema pairinga s crnom čokoladom');
}

/* ---- customers ---- */
if (!C.customers) err('customers missing');
else {
  CHAR_IDS.forEach((id) => {
    const c = C.customers[id];
    if (!c) return err(`customers.${id} nedostaje`);
    ['name', 'short', 'bio', 'portraitNote'].forEach((k) => { if (!isStr(c[k])) err(`customers.${id}.${k} missing`); });
    if (!isNum(c.patience) || !isNum(c.tip)) err(`customers.${id}: patience/tip`);
    if (!arr(c.orders)) err(`customers.${id}.orders nije niz`);
    else {
      c.orders.forEach((o, i) => {
        if (o.cigar == null && o.drink == null) err(`customers.${id}.orders[${i}] prazna`);
        if (o.cigar != null && !okCigar(o.cigar)) err(`customers.${id}.orders[${i}].cigar nepoznat: ${o.cigar}`);
        if (o.drink != null && !okDrink(o.drink)) err(`customers.${id}.orders[${i}].drink nepoznat: ${o.drink}`);
      });
      if (['roko', 'mislav', 'matija', 'tomislav', 'guest1', 'guest2', 'guest3', 'guest4'].includes(id) && c.orders.length < 3) err(`customers.${id}.orders < 3`);
    }
    if (!c.specials) err(`customers.${id}.specials missing`);
    else ['talk', 'smoke', 'special1', 'special2'].forEach((k) => { if (!isStr(c.specials[k])) err(`customers.${id}.specials.${k}`); });
    if (!c.lines) return err(`customers.${id}.lines missing`);
    BUCKETS.forEach((b) => {
      const L = c.lines[b];
      if (!arr(L) || L.length < 8) return err(`customers.${id}.lines.${b} treba >= 8 linija (ima ${arr(L) ? L.length : 0})`);
      const seen = new Set();
      L.forEach((s, i) => {
        if (!isStr(s)) err(`customers.${id}.lines.${b}[${i}] nije string`);
        else { if (seen.has(s)) err(`duplikat u customers.${id}.lines.${b}: ${s}`); seen.add(s); }
      });
    });
  });
  Object.keys(C.customers).forEach((id) => { if (!CHAR_IDS.includes(id)) warn(`customers.${id} nije u SPEC listi`); });
}

/* ---- pomoćno: provjera stabla ---- */
function checkTree(tree, p, opts) {
  opts = opts || {};
  if (!tree || !tree.nodes || !tree.start) return err(`${p}: stablo treba start+nodes`);
  const N = tree.nodes;
  if (!N[tree.start]) err(`${p}: start "${tree.start}" ne postoji`);
  const ref = (id, from) => { if (!N[id]) err(`${p}: čvor "${from}" upućuje na nepostojeći "${id}"`); };
  Object.keys(N).forEach((id) => {
    const n = N[id];
    if (!isStr(n.text)) err(`${p}.${id}: text`);
    if (!TREE_WHO.includes(n.who)) err(`${p}.${id}: who nevaljan (${n.who})`);
    const kinds = ['choices', 'next', 'end', 'roll'].filter((k) => n[k] != null && n[k] !== false);
    if (kinds.length !== 1) err(`${p}.${id}: treba točno jedno od choices/next/end/roll (ima: ${kinds.join(',') || 'ništa'})`);
    if (n.next) ref(n.next, id);
    if (n.roll) { if (!isNum(n.roll.p)) err(`${p}.${id}: roll.p`); ref(n.roll.win, id); ref(n.roll.lose, id); }
    if (n.choices) {
      if (!arr(n.choices) || n.choices.length < 2) err(`${p}.${id}: choices < 2`);
      else n.choices.forEach((ch, i) => { if (!isStr(ch.text)) err(`${p}.${id}.choices[${i}].text`); ref(ch.next, id); checkFx(ch.fx, `${p}.${id}.choices[${i}]`); });
    }
    checkFx(n.fx, `${p}.${id}`);
  });
  // dostupnost + terminalnost
  const seen = new Set(); const stack = [tree.start]; let endReached = false;
  while (stack.length) {
    const id = stack.pop(); if (seen.has(id) || !N[id]) continue; seen.add(id);
    const n = N[id];
    if (n.end) endReached = true;
    if (n.next) stack.push(n.next);
    if (n.roll) { stack.push(n.roll.win); stack.push(n.roll.lose); }
    if (n.choices) n.choices.forEach((c) => stack.push(c.next));
  }
  Object.keys(N).forEach((id) => { if (!seen.has(id)) err(`${p}: čvor "${id}" nedostižan`); });
  if (!endReached) err(`${p}: nijedan put ne završava (end:true)`);
  // ciklusi
  const color = {};
  (function dfs(id) {
    color[id] = 1; const n = N[id];
    const nxt = [].concat(n.next ? [n.next] : [], n.roll ? [n.roll.win, n.roll.lose] : [], n.choices ? n.choices.map((c) => c.next) : []);
    nxt.forEach((x) => { if (!N[x]) return; if (color[x] === 1) err(`${p}: ciklus kroz "${x}"`); else if (!color[x]) dfs(x); });
    color[id] = 2;
  })(tree.start);
  if (opts.minLines) {
    const cnt = Object.keys(N).length; if (cnt < opts.minLines) err(`${p}: manje od ${opts.minLines} čvorova (${cnt})`);
  }
}
function checkFx(fx, p) {
  if (fx == null) return;
  Object.keys(fx).forEach((k) => {
    if (!FX_KEYS.includes(k)) err(`${p}.fx: nepoznat ključ "${k}"`);
    if (k === 'giveCigar' && !okCigar(fx[k])) err(`${p}.fx.giveCigar nepoznat: ${fx[k]}`);
  });
}
function strArr(a, p, min) {
  if (!arr(a) || a.length < (min || 1)) return err(`${p}: niz treba >= ${min || 1} stringova`);
  a.forEach((s, i) => { if (!isStr(s)) err(`${p}[${i}] nije string`); });
}

/* ---- events ---- */
const E = C.events;
if (!E) err('events missing');
else {
  // baka
  const B = E.baka;
  if (!B) err('events.baka missing');
  else {
    if (!isStr(B.intro) || !isStr(B.ignored)) err('baka.intro/ignored');
    strArr(B.complaints, 'baka.complaints', 8);
    const chk = (choices, p) => {
      if (!arr(choices) || choices.length !== 3) return err(`${p}: točno 3 izbora`);
      const res = choices.map((c) => c.result).sort().join(',');
      if (res !== 'bad,best,ok') err(`${p}: rezultati moraju biti best/ok/bad (ima ${res})`);
      choices.forEach((c, i) => { if (!isStr(c.text) || !isStr(c.reply)) err(`${p}[${i}] text/reply`); checkFx(c.fx, `${p}[${i}]`); });
    };
    chk(B.choices, 'baka.choices');
    if (!B.variants || !B.variants.baka1 || !B.variants.baka2) err('baka.variants.baka1/baka2');
    else ['baka1', 'baka2'].forEach((v) => {
      const V = B.variants[v];
      chk(V.choices, `baka.variants.${v}.choices`);
      strArr(V.complaints, `baka.variants.${v}.complaints`, 8);
      if (!isStr(V.intro) || !isStr(V.ignored) || !isStr(V.opening)) err(`baka.variants.${v}: intro/opening/ignored`);
      checkTree(V.tree, `baka.variants.${v}.tree`, { minLines: 10 });
      strArr(V.ignoredLines, `baka.variants.${v}.ignoredLines`, 3);
    });
    strArr(B.ignoredLines, 'baka.ignoredLines', 3);
  }
  // gamers
  const G = E.gamers;
  if (!G) err('events.gamers missing');
  else ['enter', 'caught', 'reachedWC', 'espresso'].forEach((k) => strArr(G[k], `gamers.${k}`, 8));
  if (G) ['shout', 'flee', 'wcInside', 'wcLeave', 'blocked'].forEach((k) => strArr(G[k], `gamers.${k}`, 3));
  // shopRush
  if (!E.shopRush) err('events.shopRush missing'); else { strArr(E.shopRush.lines, 'shopRush.lines', 8); if (!isStr(E.shopRush.announce)) err('shopRush.announce'); }
  // regulars
  ['roko', 'mislav', 'matija', 'tomislav'].forEach((id) => {
    const R = E[id];
    if (!R) return err(`events.${id} missing`);
    strArr(R.ping, `${id}.ping`, 3);
    checkTree(R.intro, `${id}.intro`);
    strArr(R.farewell, `${id}.farewell`, 3);
  });
  if (E.roko) {
    checkTree(E.roko.tab, 'roko.tab', { minLines: 6 });
    checkTree(E.roko.comp, 'roko.comp', { minLines: 4 });
    strArr(E.roko.tabLines && E.roko.tabLines.reminder, 'roko.tabLines.reminder', 3);
    strArr(E.roko.noTip, 'roko.noTip', 3);
    strArr(E.roko.phone && E.roko.phone.girlfriend, 'roko.phone.girlfriend', 4);
    strArr(E.roko.phone && E.roko.phone.work, 'roko.phone.work', 4);
    const r = E.roko.rant;
    if (!r || !isStr(r.prompt) || !isNum(r.durationSec)) err('roko.rant prompt/durationSec');
    else {
      if (!arr(r.topics) || r.topics.length < 5) err('roko.rant.topics < 5');
      else r.topics.forEach((t, i) => { if (!isStr(t.id)) err(`roko.rant.topics[${i}].id`); strArr(t.lines, `roko.rant.topics[${i}].lines`, 3); });
      strArr(r.nodSuccess, 'roko.rant.nodSuccess', 3); strArr(r.nodFail, 'roko.rant.nodFail', 3); strArr(r.guestFrozen, 'roko.rant.guestFrozen', 3);
    }
    const h = E.roko.hotfix;
    if (!h || !arr(h.variants) || h.variants.length < 3) err('roko.hotfix.variants < 3');
    else h.variants.forEach((v, i) => { if (!isStr(v.id) || !isStr(v.name) || !isStr(v.desc) || !v.effect) err(`roko.hotfix.variants[${i}]`); else Object.keys(v.effect).forEach((k) => { if (!EFFECT_KEYS.includes(k)) err(`roko.hotfix.variants[${i}].effect: nepoznat "${k}"`); }); });
  }
  if (E.mislav) {
    checkTree(E.mislav.bondQuiz, 'mislav.bondQuiz', { minLines: 4 });
    checkTree(E.mislav.humidor && E.mislav.humidor.tree, 'mislav.humidor.tree', { minLines: 6 });
    const t = E.mislav.tirade;
    if (!t || !isStr(t.prompt)) err('mislav.tirade.prompt');
    else { strArr(t.lines, 'mislav.tirade.lines', 8); strArr(t.guestReactions, 'mislav.tirade.guestReactions', 5); strArr(t.interruptSuccess, 'mislav.tirade.interruptSuccess', 3); strArr(t.interruptFail, 'mislav.tirade.interruptFail', 2); strArr(t.guestsLeave, 'mislav.tirade.guestsLeave', 3); }
    strArr(E.mislav.humidor && E.mislav.humidor.stealSuccess, 'mislav.humidor.stealSuccess', 3);
    strArr(E.mislav.humidor && E.mislav.humidor.stealCaught, 'mislav.humidor.stealCaught', 3);
  }
  if (E.matija) {
    const m = E.matija;
    checkTree(m.progressPics && m.progressPics.tree, 'matija.progressPics.tree', { minLines: 4 });
    strArr(m.progressPics && m.progressPics.clients, 'matija.progressPics.clients', 8);
    strArr(m.recipe && m.recipe.steps, 'matija.recipe.steps', 6);
    checkTree(m.recipe && m.recipe.tree, 'matija.recipe.tree', { minLines: 4 });
    strArr(m.oldDays && m.oldDays.lines, 'matija.oldDays.lines', 6);
    strArr(m.steroids && m.steroids.lines, 'matija.steroids.lines', 6);
    ['warn', 'broke', 'reaction', 'hrvoje'].forEach((k) => strArr(m.armchair && m.armchair[k], `matija.armchair.${k}`, 3));
  }
  if (E.tomislav) {
    const t = E.tomislav;
    checkTree(t.pitch, 'tomislav.pitch', { minLines: 6 });
    checkTree(t.ivanisevic, 'tomislav.ivanisevic', { minLines: 4 });
    strArr(t.offers, 'tomislav.offers', 6);
    strArr(t.ivanisevicLines, 'tomislav.ivanisevicLines', 4);
    ['ballLines', 'glassBreak', 'apology', 'dodge'].forEach((k) => strArr(t.padel && t.padel[k], `tomislav.padel.${k}`, 3));
  }
}

/* ---- nights ---- */
if (!arr(C.nights) || C.nights.length !== 5) err('nights: točno 5 skriptiranih');
else C.nights.forEach((n, i) => {
  const p = `nights[${i}]`;
  if (n.n !== i + 1) err(`${p}.n treba biti ${i + 1}`);
  ['title', 'intro', 'goal', 'modifier', 'outro', 'modifierName', 'outroGood', 'outroBad'].forEach((k) => { if (!isStr(n[k])) err(`${p}.${k}`); });
  if (n.duration !== 360) err(`${p}.duration treba biti 360`);
  if (!isNum(n.goalCash) || !isNum(n.goalStars)) err(`${p}.goalCash/goalStars`);
  if (!n.modifierFx) err(`${p}.modifierFx`); else Object.keys(n.modifierFx).forEach((k) => { if (!EFFECT_KEYS.includes(k)) err(`${p}.modifierFx: nepoznat "${k}"`); });
  if (!arr(n.spawns) || n.spawns.length < 10) return err(`${p}.spawns < 10`);
  let last = -1;
  const whoSeen = {};
  n.spawns.forEach((s, j) => {
    if (!isNum(s.t) || s.t < 0 || s.t > 330) err(`${p}.spawns[${j}].t izvan 0..330`);
    if (s.t < last) err(`${p}.spawns[${j}] nije sortirano po t`);
    last = s.t;
    if (!WHO_SPAWN.includes(s.who)) err(`${p}.spawns[${j}].who nepoznat: ${s.who}`);
    whoSeen[s.who] = (whoSeen[s.who] || 0) + 1;
    if (s.order) { if (s.order.cigar != null && !okCigar(s.order.cigar)) err(`${p}.spawns[${j}].order.cigar`); if (s.order.drink != null && !okDrink(s.order.drink)) err(`${p}.spawns[${j}].order.drink`); }
    if ((s.who === 'gamers' && !(s.count >= 2 && s.count <= 3)) || (s.who === 'shopRush' && !(s.count >= 4 && s.count <= 5))) err(`${p}.spawns[${j}].count`);
  });
  if (!arr(n.tips) || n.tips.length < 2) err(`${p}.tips`); else n.tips.forEach((t, j) => { if (!isNum(t.t) || !isStr(t.text) || t.text.length > MAXLEN) err(`${p}.tips[${j}]`); });
  // sadržaj po noćima
  const need = { 1: ['roko'], 2: ['baka1', 'baka2', 'gamers'], 3: ['mislav'], 4: ['matija'], 5: ['tomislav', 'shopRush', 'roko', 'mislav', 'matija', 'baka1', 'baka2', 'gamers'] }[n.n];
  need.forEach((w) => { if (!whoSeen[w]) err(`${p}: očekuje se spawn za ${w}`); });
  if (n.n === 5) { const rush = n.spawns.find((s) => s.who === 'shopRush'); if (!rush || rush.t !== 240) err(`${p}: shopRush mora biti u t=240 (20:00)`); }
});
if (!C.endless || !arr(C.endless.pool) || !arr(C.endless.modifiers)) err('endless.pool/modifiers');
else {
  C.endless.pool.forEach((p, i) => { if (!WHO_SPAWN.includes(p.who) || !isNum(p.weight)) err(`endless.pool[${i}]`); });
  C.endless.modifiers.forEach((m, i) => { if (!isStr(m.id) || !isStr(m.name) || !m.fx) err(`endless.modifiers[${i}]`); });
}

/* ---- upgrades ---- */
if (!arr(C.upgrades) || C.upgrades.length < 8) err('upgrades < 8');
else {
  const ids = new Set();
  C.upgrades.forEach((u, i) => {
    if (!isStr(u.id) || !isStr(u.name) || !isNum(u.cost) || !isStr(u.desc) || !u.effect) err(`upgrades[${i}] nepotpun`);
    if (ids.has(u.id)) err(`dupli upgrade ${u.id}`); ids.add(u.id);
    Object.keys(u.effect || {}).forEach((k) => { if (!EFFECT_KEYS.includes(k)) err(`upgrades[${i}].effect nepoznat "${k}"`); });
  });
}

/* ---- easter eggs / achievements ---- */
if (!arr(C.easterEggs) || C.easterEggs.length < 25) err(`easterEggs < 25 (ima ${arr(C.easterEggs) ? C.easterEggs.length : 0})`);
else {
  const ids = new Set();
  C.easterEggs.forEach((e, i) => { if (!isStr(e.id) || !isStr(e.trigger) || !isStr(e.text)) err(`easterEggs[${i}]`); if (ids.has(e.id)) err(`dupli egg ${e.id}`); ids.add(e.id); });
  const all = C.easterEggs.map((e) => e.text).join(' ') + JSON.stringify(C.loadingQuotes);
  ['Liszt', 'Rožanić', 'Ordnung', 'Podmornica', '805', 'car za cigare', 'HOW', 'Hospitality Spark', 'Havana Shop', 'Cigar', 'Havana Club', 'kineziolog', 'jedrilič', 'golf', 'Sancho Panza', 'Caroni', 'crna čokolada'].forEach((k) => { if (!all.includes(k) && !all.toLowerCase().includes(k.toLowerCase())) err(`lore: nedostaje "${k}"`); });
}
if (!arr(C.achievements) || C.achievements.length < 15) err('achievements < 15');
else { const ids = new Set(); C.achievements.forEach((a, i) => { if (!isStr(a.id) || !isStr(a.name) || !isStr(a.desc)) err(`achievements[${i}]`); if (ids.has(a.id)) err(`dupli ach ${a.id}`); ids.add(a.id); }); }

/* ---- endings ---- */
if (!C.endings) err('endings missing');
else ['win', 'fail_smoke', 'fail_stars', 'finale'].forEach((k) => { if (!isStr(C.endings[k])) err(`endings.${k}`); });
if (C.endings && !arr(C.endings.finaleScript)) err('endings.finaleScript'); else if (C.endings) C.endings.finaleScript.forEach((s, i) => { if (!isStr(s.text) || !TREE_WHO.includes(s.who)) err(`endings.finaleScript[${i}]`); else if (s.text.length > 130) warn(`finaleScript[${i}] dugačak (${s.text.length})`); });

/* ---- ishod ---- */
let lineCount = 0;
CHAR_IDS.forEach((id) => { const c = C.customers && C.customers[id]; if (c && c.lines) BUCKETS.forEach((b) => (lineCount += (c.lines[b] || []).length)); });
console.log(`customers linija: ${lineCount}, easterEggs: ${(C.easterEggs || []).length}, achievements: ${(C.achievements || []).length}, upgrades: ${(C.upgrades || []).length}, pairings: ${(C.pairings || []).length}, loadingQuotes: ${(C.loadingQuotes || []).length}`);
if (warns.length) { console.log(`\nUPOZORENJA (${warns.length}):`); warns.forEach((w) => console.log('  ! ' + w)); }
if (errors.length) { console.log(`\nGREŠKE (${errors.length}):`); errors.forEach((e) => console.log('  X ' + e)); process.exit(1); }
console.log('\nOK: content.js je valjan.');
