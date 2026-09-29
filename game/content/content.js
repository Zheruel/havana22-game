/* ============================================================================
   HAVANA 22 — Večernja smjena  ·  window.CONTENT  (hrvatski)
   GENERIRANO iz tools/content_src/*.js pomoću  node tools/build_content.js
   Provjera:  node tools/validate_content.js

   --- KONVENCIJE (za engine / integratora) ---------------------------------
   * Svi tekstovi: hrvatski. Dijaloške linije <= 110 znakova (osim intro/outro/ending tekstova).
   * Nema placeholdera ({x}) u tekstovima; sve su linije gotove za prikaz.
   * Ključevi iz SPEC-a su stringovi/nizovi kako SPEC kaže. Dodatni strukturirani podaci su u
     ZASEBNIM dodatnim ključevima (npr. night.goal = string, night.goalCash = broj).

   * IDs: cigare/pića su ujedno i imena ikona: cigar_robusto cigar_corona cigar_cohiba cigar_hoyo
     cigar_sancho cigar_cheap | rum_caroni whisky cognac beer_tap beer_velebitsko espresso martini
     black_chocolate.  Customer ids: hrvoje roko mislav matija tomislav baka1 baka2 gamer1 gamer2
     guest1 guest2 guest3 guest4.

   * customers[id].lines buckets:
       enter        izgovara pri ulasku (hrvoje: početak smjene)
       order        kad se prikaže narudžba (baka/gameri: „narudžba" koja nije s menija)
       waiting      kad strpljenje padne ispod ~50% (hrvoje: idle dosjetke kad nema posla)
       served_good  točna dostava (hrvoje: komentar nakon uspješne dostave)
       served_bad   kriva dostava (hrvoje: kad zabrlja)
       leave_happy  odlazi zadovoljan (hrvoje: komentira kad gost sretno ode)
       leave_angry  odlazi ljut (hrvoje: komentira kad gost ljut ode)
       rant         karakteristični monolozi / nasumični idle bubble tekstovi (hrvoje: predavanja)
     customers[id].tip = osnovni udio napojnice (0.15 = 15% računa); patience = sekunde (real time).
     customers[id].specials = OPISI poza za row 5 atlasa (engleski, za art agente):
       talk = talk_rant poza, smoke = pušenje, special1/special2 = posebne poze (vidi opis).
     customers[id].gender 'm'|'f' (za gramatiku u linijama), orders = moguće narudžbe.

   * DIALOG STABLA (events.roko/mislav/matija/tomislav i baka varijante):
       tree = { start:'id', nodes:{ id:{ who, text, choices?:[{text,next,fx?,tag?}], next?, end?:true,
                                        fx?, tag?, roll?:{p,win:'id',lose:'id'} } } }
       - who: id lika | 'hrvoje' | 'narrator' | 'gost' (bezimeni gost)
       - čvor ima ILI choices ILI next ILI end:true ILI roll (slučajni ishod s vjerojatnošću p za win).
       - fx (primjenjuje se kad se čvor otvori odn. kad se odabere opcija):
           cash (€ ±)  stars (★ ±)  smoke (dim ±)  patience (± sekundi svim sjedećim gostima)
           freeze (sek zamrznut igrač)  buff:'hotfix'|<id>  giveCigar:'<id>'  debt (€ na crtu)
           tipBonus (€)  flag:'ime'  seatBroken:true  rep (± sitna reputacija, ~0.05 ★)
       - tag: 'best'|'ok'|'bad'|'good' (za achievemente / statistiku)
       - Tekst opcije u choices = ono što Hrvoje bira reći (kratko!).

   * Efekti globalnih modifikatora i upgradea (objekt s brojevima; *Mult = množitelj, ostalo = zbroj):
       patienceMult tipMult smokeRateMult moveSpeedMult spawnRateMult priceMult rantFreezeMult hotfixMult
       lightZone (+ udio zelene zone, npr. 0.1)  ventCooldown (+/− sekundi)  ventPower (+ dim pročišćeno)
       carryCigar carryDrink (+n)  bakaPatience (+ s)  armchairProof wcGuard sonar chocolateAuto (bool)
   * night.modifier = string (prikaz), night.modifierName, night.modifierFx = objekt (gore).
   * night.spawns[] = { t: min nakon 16:00, who, order?:{cigar,drink}, count?, note? }
       who: guest (nasumični gost) | guest1..guest4 | roko mislav matija tomislav | baka1 baka2 |
            gamers (count 2-3) | shopRush (count 4-5)
   * night.tips[] = { t, text } tutorial/upozorenja u HUD-u. night.duration = 360 (minuta 16:00-22:00).
   * easterEggs[].trigger konvencija: interact:<objekt> | time:HH:MM | event:<ime> | serve:<cigara>+<piće>
       | night:<n> | stat:<uvjet> | idle:<sek> | random | enter:<id>
   * achievements[].cond = { stat, gte } (statistika vidljiva engineu; ime stata je slobodno).
   ============================================================================ */
window.CONTENT = window.CONTENT || {};
(function (C) {
'use strict';

/* ---------- CORE: naslov, UI, citati, meni, sparivanja, recenzije ---------- */
C.title = 'HAVANA 22 — Večernja smjena';
C.tagline = 'Šest sati. Jedan humidor. Nula komunalaca.';
C.subtitle = 'Podmornica na Frankopanskoj 22. Ti si Hrvoje. Smjena traje od 16 do 22.';

C.ui = {
  newGame: 'Nova igra',
  continueGame: 'Nastavi smjenu',
  startShift: 'Otvori Podmornicu',
  nextNight: 'Sljedeća večer',
  pause: 'Pauza',
  resume: 'Nastavi',
  mute: 'Zvuk (M)',
  controls: 'WASD / strelice: hodaj · E / Razmak: uzmi, posluži, razgovaraj · Q: „Izlazite!“ · Esc: pauza · M: zvuk',
  hud: { clock: 'Sat', cash: 'Novac', rating: 'Google', smoke: 'Dim', goal: 'Cilj večeri', carry: 'U rukama' },
  prompts: {
    humidor: 'E: humidor (odaberi cigaru 1–6)',
    tap: 'E: točionik',
    spirits: 'E: žestice',
    coffee: 'E: aparat za kavu',
    vent: 'E: ventilacija (gauge)',
    table: 'E: posluži',
    talk: 'E: razgovaraj',
    nod: 'E: klimni glavom',
    skip: 'E: preskoči',
    shout: 'Q: „WC je samo za goste!“',
    wc: 'WC',
    door: 'Ulaz'
  },
  toast: {
    ventReady: 'Ventilacija spremna.',
    ventCooldown: 'Ventilator se još hladi...',
    handsFull: 'Ruke su ti pune. Ordnung!',
    wrongItem: 'To nije ono što je naručio!',
    perfectLight: 'Savršeno paljenje! Napojnica!',
    pairing: 'Sparivanje! Bonus!',
    hrvojevIzbor: 'HRVOJEV IZBOR! Bonus!',
    smokeWarn: 'Dim je preko 70. Ljudi kašlju.',
    smokeCritical: 'Dim je preko 100! Inspekcija na vratima!',
    seatBroken: 'Fotelja je preminula. Matija je bio ovdje.',
    glassBroken: 'Čaša razbijena. Padel loptica strikes again.',
    tabAdded: 'Zapisano na crtu.',
    hotfix: 'HOTFIX aktiviran!'
  },
  summary: {
    title: 'Kraj smjene: 22:00',
    money: 'Zarada',
    stars: 'Google ocjena',
    served: 'Posluženo gostiju',
    perfect: 'Savršenih paljenja',
    angry: 'Ljutitih odlazaka',
    bestJoke: 'Šala večeri',
    goalReached: 'Cilj ostvaren!',
    goalMissed: 'Cilj promašen, ali Podmornica ipak pluta.',
    shop: 'Nadogradnje',
    keepPlaying: 'Idemo dalje'
  },
  hints: [
    'Nabavi cigaru u humidoru, piće za šankom, i pronađi gosta.',
    'Drži E pa pusti u zelenoj zoni: savršeno paljenje daje napojnicu.',
    'Ventiliraj prije nego što dim pređe 70.',
    'Sparivanje cigare i pića donosi bonus. Hoyo i Caroni? Hrvojev izbor.',
    'Crna čokolada gotovo uvijek pomaže.',
    'Kad Roko počne, klimni glavom (E). Gost pored njega će ti biti zahvalan.',
    'Baka s maramom? Ne ignoriraj je. Komunalci imaju brz broj.',
    'Gejmeri i WC: Q je tvoj najbolji prijatelj.'
  ]
};

/* ---------- CITATI NA LOADING EKRANU ---------- */
C.loadingQuotes = [
  { q: 'Dobra cigara zatvara vrata podlostima života.', who: 'Franz Liszt (citat s zida Podmornice)' },
  { q: 'Ako u raju ne smiju pušiti, ja ne idem.', who: 'Mark Twain (pripisuje se)' },
  { q: 'Prestati pušiti je najlakše na svijetu. Ja sam to napravio tisuću puta.', who: 'Mark Twain (pripisuje se)' },
  { q: 'Pušim deset do petnaest cigara dnevno. U mojim godinama moram se za nešto držati.', who: 'George Burns' },
  { q: 'Moj recept za dugovječnost: cigare, viski i nikakav sport.', who: 'Winston Churchill (pripisuje se)' },
  { q: 'Gospodo, možete pušiti.', who: 'Kralj Edward VII.' },
  { q: 'Alkohol je možda čovjekov najgori neprijatelj, ali Biblija kaže: ljubi svog neprijatelja.', who: 'Frank Sinatra (pripisuje se)' },
  { q: 'Godine su samo broj. Potpuno nebitan, osim ako niste boca vina.', who: 'Joan Collins' },
  { q: 'Cigaru se ne požuruje. Ona bira svoje vrijeme, a mi joj ga dajemo.', who: 'u duhu Zina Davidoffa (slobodna parafraza)' },
  { q: 'Ponekad je cigara samo cigara.', who: 'Sigmund Freud (pripisuje se)' },
  { q: 'Ordnung muss sein. Čak i u dimu.', who: 'Hrvoje, odgojen u Njemačkoj' },
  { q: 'Podmornica: 22 metra ispod razine problema.', who: 'Havana 22, Frankopanska' },
  { q: 'Google kaže 4,5 zvjezdice na 805 recenzija. Nemoj to pokvariti.', who: 'Sonar' },
  { q: 'Hrvoje je car za cigare.', who: 'jedna Google recenzija' },
  { q: 'Cigare možete zapaliti, družiti se s ugodnim ljudima i dobro nasmijati.', who: 'jedna druga recenzija' },
  { q: 'Šest sati. Jedan humidor. Nula komunalaca.', who: 'Hrvoje, pred smjenu' },
  { q: 'Vjetar u leđa, dim u ventilator.', who: 'Kapetan Hrvoje' },
  { q: 'Hoyo de Monterrey, Caroni rum, crna čokolada. Ne raspravljaj.', who: 'Hrvoje, kineziolog i jedriličar' },
  { q: 'Preko puta je Havana Shop. Zatvaraju u 20:00. Ti si tu do 22:00.', who: 'Podmornica' },
  { q: 'Nemoj deployati u petak.', who: 'Roko, u suzama' },
  { q: 'Bolji sam bio od Ivaniševića.', who: 'Tomislav, uvijek' },
  { q: 'Ne, nije na steroidima. Samo jako voli proteine.', who: 'Matija (o sebi)' },
  { q: 'Protresen, ne miješan.', who: 'Mislav, dr. Mislav' },
  { q: 'Kad Roko počne pričati, klimni glavom. Gost pored njega će ti biti zahvalan.', who: 'Priručnik za konobare' },
  { q: 'WC je samo za goste. Ili za one koji kupe espresso.', who: 'Pravilo kuće' },
  { q: 'Ako vidiš baku s maramom, kreni prema njoj. Ne trči. Trči.', who: 'Priručnik za konobare' },
  { q: 'Leđa ravno, ramena dolje, cigara gore.', who: 'Hrvoje, kineziolog' },
  { q: 'Zamah počinje iz kukova. Cigara iz srca.', who: 'Hrvoje, golf-fitness instruktor' },
  { q: 'Sancho Panza Coronas Gigantes: večera za vinara.', who: 'Podmornica, po sjećanju na večeru kod Mladena Rožanića' },
  { q: 'Petak navečer: cigara, dobro društvo i ventilator.', who: 'Havana 22' },
  { q: 'Hrvoje Koštić. Cigar lounge, Havana 22 manager. Uskoro na pozornici.', who: 'HOW – The Hospitality Spark' }
];

/* ---------- MENI ---------- */
C.menu = {
  cigars: [
    { id: 'cigar_robusto', name: 'Robusto', price: 12, cost: 5, icon: 'cigar_robusto', say: 'Robusto',
      origin: 'Nikaragva', smokeSec: 30, smokeLoad: 1.0, light: 0.28,
      desc: 'Kratak, debeo i pouzdan. Nikaragva, četrdeset minuta mira.' },
    { id: 'cigar_corona', name: 'Corona', price: 16, cost: 7, icon: 'cigar_corona', say: 'Coronu',
      origin: 'Dominikana', smokeSec: 34, smokeLoad: 1.0, light: 0.26,
      desc: 'Klasična Dominikana. Fina, uglađena, ne diže glas.' },
    { id: 'cigar_cohiba', name: 'Cohiba Siglo', price: 34, cost: 16, icon: 'cigar_cohiba', say: 'Cohibu',
      origin: 'Kuba', smokeSec: 40, smokeLoad: 1.2, light: 0.20,
      desc: 'Kuba, legenda. Onakva koju bi Bond zapalio pred eksplozijom.' },
    { id: 'cigar_hoyo', name: 'Hoyo de Monterrey Double Corona', price: 28, cost: 13, icon: 'cigar_hoyo', say: 'Hoyo',
      origin: 'Kuba', smokeSec: 48, smokeLoad: 1.4, light: 0.18,
      desc: 'Hrvojev posljednji izbor. Dugačka, elegantna, ne žuri nikamo.' },
    { id: 'cigar_sancho', name: 'Sancho Panza Coronas Gigantes', price: 42, cost: 20, icon: 'cigar_sancho', say: 'Sancho Panzu',
      origin: 'Kuba', smokeSec: 55, smokeLoad: 1.6, light: 0.16,
      desc: 'Gigantska. Večera za vinara. Zahtijeva vrijeme i dobru ventilaciju.' },
    { id: 'cigar_cheap', name: 'Cigarillo Studentski', price: 6, cost: 2, icon: 'cigar_cheap', say: 'ono jeftino',
      origin: 'Nekamo', smokeSec: 18, smokeLoad: 0.6, light: 0.40,
      desc: 'Za Roku i njegov budžet. Kratko, jeftino, gotovo prije nego što stigneš požaliti.' }
  ],
  drinks: [
    { id: 'rum_caroni', name: 'Caroni rum', price: 14, cost: 6, icon: 'rum_caroni', source: 'spirits', say: 'Caroni rum',
      desc: 'Gust, tamni rum. Hrvojev posljednji izbor uz Hoyo.' },
    { id: 'whisky', name: 'Viski', price: 10, cost: 4, icon: 'whisky', source: 'spirits', say: 'viski',
      desc: 'Single malt, bez leda. Kao moj brak, kaže Mislav.' },
    { id: 'cognac', name: 'Konjak', price: 12, cost: 5, icon: 'cognac', source: 'spirits', say: 'konjak',
      desc: 'Okrugao i topao. Za razgovor koji ne staje.' },
    { id: 'martini', name: 'Martini (protresen)', price: 11, cost: 4.5, icon: 'martini', source: 'spirits', say: 'martini',
      desc: 'Protresen, ne miješan. Ako to ne kažeš, netko će ti ispričati što je Bond.' },
    { id: 'beer_tap', name: 'Točeno pivo (Laško)', price: 4, cost: 1.5, icon: 'beer_tap', source: 'tap', say: 'točeno',
      desc: 'Hladno, pjenasto, pošteno.' },
    { id: 'beer_velebitsko', name: 'Velebitsko pivo', price: 5, cost: 2, icon: 'beer_velebitsko', source: 'tap', say: 'Velebitsko',
      desc: 'Domaće, s planine. Ide uz robusto kao domaći teren.' },
    { id: 'espresso', name: 'Espresso', price: 2.2, cost: 0.5, icon: 'espresso', source: 'coffee', say: 'espresso',
      desc: 'Jak, kratak, jeftin. Gejmeri ga kupuju kao ulaznicu za WC.' },
    { id: 'black_chocolate', name: 'Crna čokolada', price: 3, cost: 1, icon: 'black_chocolate', source: 'coffee', say: 'crnu čokoladu',
      desc: 'Hrvojev savjet: crna čokolada uz cigaru drži sve na mjestu, kao sidro.' }
  ]
};

/* ---------- SPARIVANJA (bonus = € dodatno; stars = ★ dodatno) ---------- */
C.pairings = [
  { id: 'hrvojev_izbor', name: 'Hrvojev izbor', cigar: 'cigar_hoyo', drink: 'rum_caroni', bonus: 18, stars: 0.1, chocolateBonus: 6,
    line: 'Hrvojev izbor: Hoyo de Monterrey Double Corona i Caroni. Klasik. Uz crnu čokoladu — savršenstvo.' },
  { id: 'hoyo_cokolada', name: 'Hoyo i crna', cigar: 'cigar_hoyo', drink: 'black_chocolate', bonus: 6, stars: 0.02,
    line: 'Crna čokolada i Hoyo: kad ti je pola večeri iza sebe, a druga polovica ispred.' },
  { id: 'kraljevski', name: 'Kraljevski par', cigar: 'cigar_cohiba', drink: 'cognac', bonus: 12, stars: 0.05,
    line: 'Cohiba i konjak: onaj mir koji se ne kupuje ni po kvadratu.' },
  { id: 'bond', name: 'Bond, James Bond', cigar: 'cigar_cohiba', drink: 'martini', bonus: 15, stars: 0.05,
    line: 'Cohiba i martini, protresen. Mislav bi prvi zaplakao od sreće.' },
  { id: 'cohiba_cokolada', name: 'Cohiba i tama', cigar: 'cigar_cohiba', drink: 'black_chocolate', bonus: 7, stars: 0.02,
    line: 'Cohiba uz crnu čokoladu. Mala pobjeda, velika Kuba.' },
  { id: 'viteski', name: 'Viteški par', cigar: 'cigar_sancho', drink: 'whisky', bonus: 14, stars: 0.05,
    line: 'Sancho Panza i viski. Don Quijote bi rekao: mlinovi su tamo, a ja ću ovdje.' },
  { id: 'vinarov_stol', name: 'Vinarov stol', cigar: 'cigar_sancho', drink: 'rum_caroni', bonus: 16, stars: 0.06,
    line: 'Sancho Panza i rum. Ne baš vino, ali Mladen Rožanić bi kimnuo.' },
  { id: 'digestiv', name: 'Digestiv', cigar: 'cigar_corona', drink: 'cognac', bonus: 7, stars: 0.03,
    line: 'Corona i konjak. Večera je gotova, život tek počinje.' },
  { id: 'jutarnji', name: 'Kava u sumrak', cigar: 'cigar_corona', drink: 'espresso', bonus: 5, stars: 0.02,
    line: 'Corona i espresso. Nema zore, ali ima energije.' },
  { id: 'domaci_teren', name: 'Domaći teren', cigar: 'cigar_robusto', drink: 'beer_velebitsko', bonus: 4, stars: 0.02,
    line: 'Robusto i Velebitsko: planina i dim. Domaći teren.' },
  { id: 'robusto_cokolada', name: 'Robusto na tamnom', cigar: 'cigar_robusto', drink: 'black_chocolate', bonus: 4, stars: 0.02,
    line: 'Robusto i crna čokolada. Matija bi to zvao doručkom.' },
  { id: 'studentski', name: 'Studentski paket', cigar: 'cigar_cheap', drink: 'beer_tap', bonus: 2, stars: 0.01,
    line: 'Cigarillo i točeno. Roko plaća u nadi da će uskoro plaćati više.' },
  { id: 'hoyo_viski', name: 'Duga večer', cigar: 'cigar_hoyo', drink: 'whisky', bonus: 9, stars: 0.03,
    line: 'Hoyo i viski. Dugo, mirno i nepogrešivo.' }
];

/* ---------- GOOGLE RECENZIJE (popup flavor pri promjeni ocjene) ---------- */
C.reviews = {
  good: [
    '★★★★★ „Hrvoje je car za cigare.“',
    '★★★★★ „Podmornica na kopnu. Ne pitajte kako, samo dođite.“',
    '★★★★★ „Cigare možete zapaliti, družiti se s ugodnim ljudima i dobro nasmijati.“',
    '★★★★★ „Fotelje mekane, ventilacija tiha, Hrvoje ozbiljan.“',
    '★★★★★ „Otkrio sam Hoyo i Caroni. Sad nema natrag.“',
    '★★★★☆ „Odlično, samo bih volio da Roko više ne priča.“',
    '★★★★★ „Netko je klimnuo glavom baš kad sam trebao. Hvala.“',
    '★★★★★ „Steampunk kao u filmu, a cigare kao u Havani.“',
    '★★★★★ „Bond bi ostao do zatvaranja. Mislav je ostao i poslije.“',
    '★★★★★ „Čokolada uz cigaru — kako to prije nisam znao?“'
  ],
  bad: [
    '★☆☆☆☆ „Predugo čekanje. Cigara je dogorjela prije nego je stigla.“',
    '★★☆☆☆ „Dim! Dim! Dim!“',
    '★☆☆☆☆ „Nisu mi dali WC. A tražio sam samo pet minuta.“',
    '★★☆☆☆ „Netko je razbio čašu loptom. Nisu mi ni ponudili ručnik.“',
    '★☆☆☆☆ „Fotelja mi se raspala pod onim tipom. Ni ispričao se nije.“',
    '★★☆☆☆ „Sasvim ok, ali konobar predugo priča o sidru i čokoladi.“',
    '★☆☆☆☆ „Ne dolazim više. Ili dolazim sutra.“',
    '★★☆☆☆ „Čuo sam da je Hoyo dobar. Nisu mi ga donijeli.“',
    '★☆☆☆☆ „Baka je zvala komunalce, a ja sam samo pio kavu.“',
    '★★★☆☆ „Fino, ali ovaj tjedan mi je bilo dosta dima.“'
  ],
  gamers: [
    '★☆☆☆☆ „Nisu ni espresso kupili.“ (vlasnik)',
    '★☆☆☆☆ „WC zauzet 15 minuta. Netko je igrao na mobitelu.“',
    '★★☆☆☆ „Gejmeri su nas napali. Bez kartica, bez mira.“'
  ]
};

/* ---------- LIKOVI A: hrvoje, roko, mislav, matija, tomislav ---------- */
C.customers = C.customers || {};

C.customers.hrvoje = {
  name: 'Hrvoje Koštić',
  short: 'Manager, kineziolog, kapetan',
  gender: 'm',
  bio: 'Hrvoje Koštić (48), voditelj Havane 22. Kineziolog, profesionalni jedriličar i golf-fitness instruktor. ' +
    'Odrastao u Njemačkoj pa vjeruje: Ordnung muss sein. Cigar consultant, drži škole i radionice o cigarama. ' +
    'Posljednji izbor: Hoyo de Monterrey Double Corona i Caroni rum. Uz crnu čokoladu, naravno.',
  orders: [],
  patience: 0,
  tip: 0,
  lines: {
    enter: [
      'Šest sati. Ordnung muss sein: čaše sjaje, humidor diše.',
      'Podmornica spremna za zaron. Otvaramo!',
      'Dobra večer, Havana 22. Ili kako se u Njemačkoj kaže: pünktlich.',
      'Dan je bio dug, a večer je moja. Palim svjetla.',
      'Humidor 70 posto, ventilator radi. Savršeno. Do prvog gosta.',
      'Još jedna smjena. Još jedna mirna, tiha... ma tko to lažem.',
      'Kineziolog u meni kaže: leđa ravno. Barmen u meni kaže: kava.',
      'Vjetar u leđa, momci. Ovo je najbolja luka na Frankopanskoj.',
      'Edison žarulje upaljene, kožna sofa spremna. Neka počne večer.'
    ],
    order: [
      'Razumijem, odmah stižem!',
      'Cigara plus piće. Kao po knjizi.',
      'Jedan humidor, jedna čaša. Ništa kaotično.',
      'Primljeno. Kapetan preuzima.',
      'Zabilježeno. Njemačka točnost aktivirana.',
      'Ide! Prvo cigara, pa piće, pa čudo.',
      'Narudžba je narudžba. Nema improvizacije.',
      'Za jednog gosta: cigara po mjeri i piće po vjetru.',
      'U redu. Sve ide kroz humidor, pa preko šanka.'
    ],
    waiting: [
      'Nema nikoga? Idealno vrijeme za brisanje šanka.',
      'Tišina. Čuje se samo ventilacija.',
      'Malo istezanja. Rotacija ramena, deset puta.',
      'Ovo je trenutak za sonar. PING. Nema kontakta.',
      'Sjedni ravno! ... Nitko ne sjedi. Vježbam.',
      'Kad bih sad bio na jedrilici. Ali ne, tu je humidor.',
      'Dok čekam: 45 sekundi planka. Tko voli, nek izvoli.',
      'Provjeravam hidrometar. Kao i uvijek, savršen.',
      'Prije je bilo mirnije. Ali prije nisam imao Roka.'
    ],
    served_good: [
      'Savršeno! Ovako se radi u Podmornici.',
      'Cigara u ruci, osmijeh na licu. Ordnung!',
      'Tako! Gost sretan, kapetan miran.',
      'Pun pogodak. Ni milimetar pored.',
      'Još jedna zadovoljna duša. Google će dobiti peticu.',
      'Kineziološki savršeno: ruka, cigara, usta.',
      'Točno po narudžbi. Njemačka škola.',
      'Zapamti, kaže kapetan: sve se može, kad je humidor pod kontrolom.'
    ],
    served_bad: [
      'Ups. To nije ono što je naručio.',
      'Hrvoje, koncentracija! Ovo nije regata u magli.',
      'Krivo sam poslužio... pravim se da nisam.',
      'Krivi humidor, kriva čaša. Krivi dan.',
      'Ordnung muss sein. A ovo nije Ordnung.',
      'Hm. Pogrešan ključ, pogrešna brava.',
      'Kapetan je promašio luku. Kružim ponovo.',
      'To je sad neka avangarda. Nije ono što je htio.'
    ],
    leave_happy: [
      'Doviđenja! Dođite opet, u Podmornici je uvijek zaron.',
      'Hvala vam. I ne zaboravite ostaviti recenziju.',
      'Ugodna večer. Petica vam ne bježi.',
      'Vratite se. Humidor vas već pamti.',
      'Do sljedećeg puta! Petak je naš.',
      'Lijep gost, lijep dim. Nastavljamo.',
      'Sretan put! Ako vidite Havana Shop, pozdravite ih.',
      'Još jedan koji je odnio dobar dim.'
    ],
    leave_angry: [
      'Auč. To će ostaviti trag, ne samo na recenziji.',
      'Nemojte nikoga tužiti, molim vas. Samo ne komunalce.',
      'Gost odlazi ljut. Sonar bilježi minus.',
      'Eh. Sutra ćemo bolje. Ordnung.',
      'Pa dobro, nije svaka regata pobjeda.',
      'Da je bar rekao što ga smeta. Ali dobro.',
      'Još jedna zvjezdica manje na Googleu. Boli.',
      'Molim vas, samo ne recenziju od jedne zvjezdice.'
    ],
    rant: [
      'Cigara nije nagon, cigara je ritual. Prvo miris, pa dodir, pa vatra.',
      'Kao kineziolog kažem: leđa ravno, ramena dolje, cigara gore.',
      'U Njemačkoj sam naučio jedno: Ordnung muss sein. Čak i u dimu.',
      'Jedrenje i cigare imaju isto: ne žuri se, jer vjetar odlučuje.',
      'Golf-fitness: zamah kreće iz kukova. Cigara iz srca.',
      'Hoyo de Monterrey i Caroni. Moj posljednji izbor. Ne pitaj zašto.',
      'Crna čokolada uz cigaru je kao sidro uz brod: drži stvar na mjestu.',
      'Dobra cigara zatvara vrata podlostima života. Liszt je to znao.',
      'Sancho Panza Coronas Gigantes: to ti je večera za vinara. Pitaj Mladena.',
      'Podmornica nije nadimak. To je zaron u dobro raspoloženje.'
    ]
  },
  specials: {
    talk: 'lecturing pose: one hand holding a cigar up, other hand open, mouth open mid-speech',
    smoke: 'relaxed, cigar in mouth corner, one hand in pocket, small smoke puff',
    special1: 'triumphant: cigar held high like on the HOW poster, chin up, half smile',
    special2: 'stern manager: pointing at wall gauge / wagging finger, brow furrowed (Ordnung muss sein)'
  },
  portraitNote: 'bald, dark full beard, cream guayabera shirt or black work shirt, calm cool expression, cigar in hand (see reference/people/hrvoje-*).'
};

C.customers.roko = {
  name: 'Roko',
  short: 'PMF-ovac, programer, vječno švorc',
  gender: 'm',
  bio: 'Roko je programer sa PMF-a. Radi previše, plaćen premalo, a cura mu kaže da radi previše. ' +
    'Uvijek naruči najjeftinije, pita za crtu i ne ostavlja napojnicu. Ali kad ga počastiš, popravi ti POS.',
  orders: [
    { cigar: 'cigar_cheap', drink: 'beer_tap' },
    { cigar: 'cigar_cheap', drink: 'espresso' },
    { cigar: 'cigar_cheap', drink: 'beer_velebitsko' },
    { cigar: 'cigar_robusto', drink: 'beer_tap' }
  ],
  patience: 75,
  tip: 0,
  lines: {
    enter: [
      'Bok Hrvoje. Samo pet minuta, moram na prod.',
      'Ej, evo me. Pobjegao sam iz stand-upa. Doslovno.',
      'Nemoj me ništa pitati o poslu. Ni o curi. Ni o novcu.',
      'Uf, ovaj tjedan... ma sjest ću pa ću ti pričati.',
      'Dobra večer. Dolazim iz ureda gdje mi je laptop vidio više nego cura.',
      'Ej, ima li dana u kojem se ne deploja u petak? Ne? OK.',
      'Evo me. Zadnji put sam bio ovdje kad je plaća stigla. Dakle prije tjedan dana.',
      'Ne, ne, ne trebam razgovor. Trebam cigaru. I malo tišine. Uglavnom tišine.',
      'Bok! Šef mi je poslao još jedan mail. Ignoriram ga. Ne, ne ignoriram.'
    ],
    order: [
      'Daj mi ovu najjeftiniju. Ne pitaj zašto.',
      'Može ona akcija? Ona sa studentskim popustom, a nisam student.',
      'Jedno točeno i onu... ono što stoji na dnu cjenika.',
      'Pivo i cigaru. Ovu jeftinu. Ne, nemoj mi pokazati cijenu.',
      'Nešto što ne ostavlja rupu u novčaniku, ali ostavlja miris.',
      'Espresso i cigarillo. To je moj budžet ovaj tjedan.',
      'Jednu za Roka. A može i na crtu? Šalim se. Ne šalim se.',
      'Nešto jeftino i dugotrajno. Kao moja veza.',
      'Dat ćeš mi popust za redovite goste? Redovan sam.'
    ],
    waiting: [
      'Hrvoje, još čekam. Ili si me zaboravio ili je moj order u backlogu.',
      'Ovo je sporije od našeg CI/CD-a, a to nešto znači.',
      'Ej... jesi li vidio moj zahtjev? Označio sam ga kao urgentno.',
      'Čekam kao na odgovor od curinog oca.',
      'Ping. Ping. Sonar mi javlja da nitko ne dolazi.',
      'Još malo i moram javiti šefu da sam bolestan.',
      'Ako još malo čekam, dobit ću mail da mi je istekla vjera.',
      'Nema veze, imam cijelu večer. I cijeli život u dugovanjima.'
    ],
    served_good: [
      'Legendo! Ovo mi je spasilo tjedan. Ne i račun.',
      'Ah. Prvi mirni trenutak od ponedjeljka.',
      'Ovo je bolje od bilo kojeg pull requesta.',
      'Hvala, Hrvoje. Ti si jedini koji me razumije. Osim Stack Overflowa.',
      'Točno to! Bez bugova! Rijetko.',
      'Dim ide gore, stres ide dolje. Zakon fizike.',
      'Sad mogu pola sata ne razmišljati o prod okolini.',
      'Znaš što je najbolje? Nitko me ne zove. Još.'
    ],
    served_bad: [
      'Ovo nisam naručio. Ali nemam snage žaliti se.',
      'Ma ništa, popit ću. Ionako mi je sve krivo.',
      'Hm. Zapravo sam... nema veze. Ionako sam skrhan.',
      'Ovo je kao moj kod: radi, ali nije ono što treba.',
      'Krivo?! Slijedi još jedan dan bez pobjede.',
      'Je li to bug ili feature? Ne, ovo je bug.',
      'Hrvoje, molim te, nemoj mi trošiti živce. Imam ih još jedan.',
      'Ovo će ići u ticket. Naslov: Roko ima krivu cigaru.'
    ],
    leave_happy: [
      'Hvala ti, Hrvoje. Bit ću brzo natrag. Kad platu dobijem.',
      'Bok! I hvala na razumijevanju. Za sve.',
      'Idem doma. Cura me čeka. Ili prijeti. Ne znam.',
      'Bilo je super. Sutra opet u ured, ali ovo pamtim.',
      'Vidimo se! Ako me otpuste, ovdje sam cijeli dan.',
      'Šef mi je poslao poruku. Ignoriram. Doviđenja.',
      'Bok! I ne brini, kad postanem CTO, plaćam za sve.',
      'Bilo je prekrasno. Nemoj mi slati račun, samo mi ga pokaži.'
    ],
    leave_angry: [
      'Ovo ide u reklamacijski ticket. Bok.',
      'Otići ću. Sve se raspalo: posao, cura, a sad još i cigara.',
      'Nema veze. Razloga za nezadovoljstvo ionako imam napretek.',
      'Eto, dan mi je bio savršen. Savršeno loš.',
      'Ovo idem napisati na Redditu. Zagreb, ugostiteljstvo, minus jedan.',
      'Ne mogu vjerovati. Ni ovdje nemam mir. Idem doma ugasiti telefon.',
      'Nema više kreditiranja. Ja sam kriv. Uvijek sam ja kriv.',
      'Idem. Nemoj ni pitati što će cura reći.'
    ],
    rant: [
      'Cura kaže da previše radim. Šef kaže da premalo. Ja kažem: platite me.',
      'Prijavio sam se na tečaj Kubernetesa. Nitko mi ne kaže što je to.',
      'Stan? Ja mogu kupiti kvadrat. Jedan. Ne stan, kvadrat.',
      'Deployao sam u petak u 17:59. Sad znam zašto se to ne radi.',
      'Ona traži da razgovaramo o budućnosti. Ja imam budućnost do petnaestog u mjesecu.',
      'Šef je rekao malo ćemo pritisnuti. Pritisnuli su me do zida.',
      'Moja plaća i moja veza imaju isto: obje idu u minus.',
      'Radim na projektu koji nitko ne razumije. Uključujući mene.',
      'Zna li netko što znači legacy? To je kad nitko ne zna tko je kriv, ali svi znaju da si ti.',
      'Prošli tjedan je na poslu bio pizza party. Rekli su da je to povišica. Bila je pizza.'
    ]
  },
  specials: {
    talk: 'whining rant pose: both hands raised in frustration, eyes closed, mouth wide open',
    smoke: 'hunched, small cheap cigarillo between fingers, tired eyes, tiny smoke puff',
    special1: 'facepalm / head in both hands (broke, tired)',
    special2: 'holding a phone in one hand, staring at it in dread (girlfriend texting)'
  },
  portraitNote: 'young man, short brown hair, clean-shaven, black crewneck sweater, tired but polite eyes (see reference/people/roko.png). Laptop bag optional.'
};

C.customers.mislav = {
  name: 'Mislav',
  short: 'Kirurg koljena, lažni Bond',
  gender: 'm',
  bio: 'Dr. Mislav, ortoped specijaliziran za koljena. Obožava Jamesa Bonda i sebe, tim redoslijedom. ' +
    'Uvijek nosi kožni putni humidor koji ostavlja na stolu. Šarmantan, u vlastitim očima.',
  orders: [
    { cigar: 'cigar_cohiba', drink: 'martini' },
    { cigar: 'cigar_cohiba', drink: 'whisky' },
    { cigar: 'cigar_hoyo', drink: 'martini' },
    { cigar: 'cigar_sancho', drink: 'cognac' }
  ],
  patience: 55,
  tip: 0.3,
  lines: {
    enter: [
      'Ime mi je Mislav. Dr. Mislav. Za prijatelje: Mislav.',
      'Dobra večer. Martini me čeka, a ja sam ipak pola sata kasnio.',
      'Pozdrav! Ostavio sam Aston Martin vani. Točnije, tramvaj broj šest.',
      'Nemojte ustajati. Ovo nije reanimacija. Još.',
      'Čujem da ovdje služe najbolje. Znam, jer ja to tražim.',
      'Koljena dolje, ljudi! Doktor je stigao.',
      'Pripremite kožnu fotelju. I nekoga da mi drži humidor.',
      'Večeras sam slobodan. Cijeli život, zapravo, ali to je druga priča.',
      'Dobra večer, Hrvoje. Kažu da si dobar. Ja sam bolji. U svemu, kažu kolege. Ne pitaj.'
    ],
    order: [
      'Martini. Protresen, ne miješan. I neka to bude jasno, kao rez.',
      'Cohibu, molim. Onu koju bi Bond zapalio pred eksplozijom.',
      'Viski, bez leda, kao moj brak. I cigaru jaču od moje reputacije.',
      'Dajte mi nešto što izaziva bol, ali u dobrom smislu. Cigaru.',
      'Jedan Hoyo za muškarca kakav jesam. I ne pitajte kakav sam.',
      'Konjak i Sancho Panza. Da, i ime mi je Mislav.',
      'Za gospodina u kutu... to sam ja: nešto skupo, neka se osjeća važno.',
      'Trebam nešto čvrsto, gusto i dugotrajno. Cigaru, dakako.',
      'Martini. Jedan. Ili dva. Bond je uvijek uzimao dva. A ja nikad ne brojim.'
    ],
    waiting: [
      'Dr. Mislav ne čeka. Dr. Mislav se strpljivo dosađuje.',
      'U operacijskoj nikad ne čekam. Ovdje očito da.',
      'Bez brzine nema uspjeha. Ni u kirurgiji, ni u... ma znate već.',
      'Brzo, molim. Ujutro imam ACL. Ne moj.',
      'Ovaj martini bi trebao doći prije nego mi se pozornost preseli na nešto drugo.',
      'Minuta zaostatka i pacijent je mrtav. Ali dobro, ja sam samo gost.',
      'Čekam. Kao Bond u zasjedi. Samo bez pištolja i bez dame.',
      'Hrvoje, trebam piće. Ili barem ljudski kontakt.'
    ],
    served_good: [
      'Savršeno. Kao dobro postavljen implantat.',
      'Ovo je kvaliteta, dragi Hrvoje. Tako i ja radim posao. Uvijek.',
      'Bond bi bio ponosan. Ili bar dužan platiti.',
      'Tako. Sad se osjećam kao čovjek s licencom. Za sve.',
      'Prvi put večeras nisam morao nikome objašnjavati kirurgiju. Hvala.',
      'Točno kako volim. Kao na operacijskom stolu: glatko i bez komplikacija.',
      'Bravo! I dalje mislim da bi trebao postati moj asistent.',
      'Pun pogodak. Pucaj, ali ne u koljeno.'
    ],
    served_bad: [
      'Ovo nije to! Rekao sam protresen! A ovo nije ni jedno ni drugo.',
      'Hrvoje, Hrvoje. U mojoj struci ovakva greška znači amputaciju.',
      'Nemoguće! Bond nikad ne primi krivo piće. Nikad.',
      'Ovo bi moj pacijent vratio. Ali ja sam previše dobre volje.',
      'Ah, sabotaža. Sigurno je SPECTRE.',
      'Pogrešna cigara. To me boli više od pogrešnog reza.',
      'Naručio sam jedno, a ti si mi donio umjetnost. Apstraktnu.',
      'Ne, ne, ne. Ponovo. I neka bude bez komplikacija.'
    ],
    leave_happy: [
      'Doviđenja. Ali ne zauvijek. Samo se dva puta živi, a ja ću doći i treći.',
      'Hrvoje, odlično. Sutra opet, i pripremi ledenu čašu za moj ego.',
      'Bilo mi je zadovoljstvo. Kao uvijek. Ni ne pitajte što to znači.',
      'Idem. Trebam još jedan zahvat. Na svojoj reputaciji.',
      'Fantastično. Ovo je moj drugi dom. Prvi je klinika.',
      'Bok, momci. Čuvajte koljena. Ako ne, znate gdje me naći.',
      'Odlazim uz lijep završetak. Kao Bond. Samo bez dame.',
      'Pozdravi Havana Shop. Reci im da je Doktor pozdravio.'
    ],
    leave_angry: [
      'Ovo je skandal! Nikad se više ne vraćam. Osim sutra.',
      'Idem. Ovakvu uslugu ne dopuštam ni u sestrinskoj sobi.',
      'Moje koljeno drhti. Od ljutnje. Ne od straha.',
      'Bond bi ovo riješio pištoljem. Ja ću običnom recenzijom.',
      'Nezamislivo! Idem naći bolji lounge. Nema ga. Vratit ću se.',
      'Dovraga! Bez pardona. Ili s pardonom, ali jako, jako ljut.',
      'Ne zaboravi: znam čovjeka koji zna čovjeka koji zna operirati.',
      'Uznemiren sam. Mora da je SPECTRE. Ili ti.'
    ],
    rant: [
      'Bond je imao 25 filmova i još više dama. Ja imam pretplatu na Netflix.',
      'Koljeno popravim za sat vremena. Damu ne znam osvojiti ni za tjedan.',
      'Kažu da sam šarmantan. Kažu i da sam pijan. Uvijek ista dvojica.',
      'Volim mlade dame. Mislim, mlada vina. Rioja. Da. Vina.',
      'Moj humidor je poput mene: kožni, luksuzan i uvijek pod kontrolom vlage.',
      'Licenca za operaciju: imam. Licenca za flertovanje: povučena zbog pritužbi.',
      'Q daje Bondu spravice, a ja pacijentima vraćam koljena. Ista stvar.',
      'Dama u kutu me pogledala. Kasnije se ispostavilo da gleda iza mene. U zrcalo.',
      'Goldfinger? Ja sam Zlatnokoljenac. Ne pitajte.',
      'Samo se dva puta živi, ali koljeno se operira jednom. Ako sam ja operirao.'
    ]
  },
  specials: {
    talk: 'suave lecture pose: chin up, one finger raised, other hand adjusting cufflink, smug smile',
    smoke: 'leaning back, Cohiba in one hand, martini glass in the other, smug half-smile',
    special1: 'Bond pose: finger-gun pointing forward, eyebrow raised',
    special2: 'surgeon pose: holding open a small leather travel humidor like a patient chart, glasses on nose tip'
  },
  portraitNote: 'middle-aged man, grey wavy hair, dark round glasses, smug half-smile; blue surgical scrubs with mask hanging (see reference/people/mislav.png); on visits maybe a tux jacket over scrubs.'
};

C.customers.matija = {
  name: 'Matija',
  short: 'Bodybuilder, kuhar, „prirodan“',
  gender: 'm',
  bio: 'Matija, bivši i sadašnji bodybuilder. Strastveno tvrdi da je prirodan. Voli espresso, crnu čokoladu, ' +
    'kuhanje odrezaka i stara vremena kad je u Zagrebu bilo pet teretana. Stalno na mobitelu: klijenti, progress slike.',
  orders: [
    { cigar: 'cigar_corona', drink: 'espresso' },
    { cigar: 'cigar_robusto', drink: 'espresso' },
    { cigar: 'cigar_robusto', drink: 'black_chocolate' },
    { cigar: 'cigar_cohiba', drink: 'espresso' }
  ],
  patience: 90,
  tip: 0.15,
  lines: {
    enter: [
      'Bok, ekipa! Nemojte gledati moj vrat. Sve je prirodno.',
      'Idem odmah na Dan nogu. Zato ću sjesti. Vrlo pažljivo.',
      'Čujte, u moje vrijeme ovdje bi bila teretana. I bila bi bolja.',
      'Bio sam kod klijenta. On je izgubio 12 kila, ja sam dobio 3. Mišića.',
      'Ne, ne, nisam na ničemu. Samo proteini, čaj i vjera.',
      'Kaj ima, Hrvoje? Jesi li mi sačuvao najjaču fotelju? Onu što se još drži?',
      'Ulazim! Molim sve da se malo pomaknu. Ramena, znate.',
      'Hladno je vani. A ja sam u majici. Šalim se, u uskoj majici. Nema druge.',
      'Ne pitaj kako sam. Pitaj koliko sam podigao. Ha. Ne pitaj ni to.'
    ],
    order: [
      'Jedan espresso, dupli. I cigaru, onu debelu, kao moj biceps.',
      'Espresso, bez šećera, kao moj dijetalni plan. Kojeg se ne držim.',
      'Crnu čokoladu 90 posto i robusto. To je moj doručak.',
      'Daj mi kavu i coronu. Ne, ne pivo. Pivo je ugljikohidrat.',
      'Espresso i nešto malo deblje. Cigaru, mislim. Ne opet!',
      'Kavu, dupla doza. Pa cigaru. Pa priča o odresku.',
      'Dupli espresso i Cohiba. Danas sam pojeo samo šest jaja.',
      'Daj mi ono što dobiva klijent koji je dobio 5 kila mišića.'
    ],
    waiting: [
      'Hrvoje, čekam. A čekati je kao pauza između serija. Nepodnošljivo.',
      'Ako se ne pojavi kava, moram pojesti protein bar. A to nitko ne želi.',
      'Nekad sam čekao u redu za dodatke prehrani. Ha, šalim se. Ili ne.',
      'Brzo, molim. Metabolizam mi gori, kao kad sam bio mlad i glup.',
      'Još malo, i moram fotografirati sebe. Za progress.',
      'Ovo je gore od kardija. Mrzim kardio.',
      'Čekam. Odmaram mišiće. Ne, ne pomičem se: stolac ne bi izdržao.',
      'Hrvoje, sat je 18:00, a ja nisam jeo cijeli sat!'
    ],
    served_good: [
      'Tako! Ovo je kao dobar trening: bolno, ali korisno.',
      'Aaah! Kava i cigara. Nema bolje kombinacije nakon nogu.',
      'Savršeno! Stavit ću ovo u story. Progress pic: ja i cigara.',
      'Točno kako treba. Kao moj recept za odrezak.',
      'Bravo, Hrvoje! Mogao bi mi biti trener. Ali ne mogu ti platiti.',
      'Ovo je zlatno! Kao 1998. kad je teretana bila puna.',
      'Aha! Sad ću ti pokazati sliku klijenta koji je ovo pio prije treninga.',
      'Hrvoje, ovo je magija. Prirodna. Baš kao ja.'
    ],
    served_bad: [
      'Ovo nije to! Naručio sam jedan protein, ne kaos.',
      'Što je ovo?! Ja ovo ne mogu ni pojesti, ni popiti, ni preskočiti.',
      'Ma daj! U moje vrijeme konobari nisu griješili. Ni voda.',
      'Hrvoje, kalorije ne odgovaraju. To je sabotaža, čovječe.',
      'Ovo bi moj klijent vratio. Ali ja sam previše dobre volje. I gladan.',
      'Ne, ne, molim te, ovo je pogrešno. Kao čučanj bez dubine.',
      'Sad bih plakao, ali mišići mi to ne dopuštaju.',
      'Pogrešno! Kao kad zamijeniš uteg od 20 kila s onim od 2.'
    ],
    leave_happy: [
      'Bilo je odlično! Vratit ću se sutra, kad noge prestanu boljeti.',
      'Doviđenja, momci! I zapamtite: nema rasta bez boli.',
      'Idem kuhati! Večeras je rib-eye. Ne pitaj koliko komada.',
      'Sve najbolje! Javit ću ti ako i dalje budem prirodan. Šalim se.',
      'Bok, Hrvoje! Pozdravi Roka. Ako još ima novca za pivo.',
      'Odlazim! Ovo je bilo dobro. Kao dobar set od 12.',
      'Vidimo se sutra. Dan ruku. Ili leđa. Ne sjećam se.',
      'Ostavljam ti napojnicu. Nemoj je potrošiti na proteine. Ili potroši.'
    ],
    leave_angry: [
      'Ovo je nedopustivo! Idem doma. Sam ću skuhati bolji odrezak.',
      'Ako ovo ne popravite, javit ću svojim klijentima. To je 5000 ljudi.',
      'Idem, ali samo zato što moram jesti. Ne zato što sam ljut.',
      'Ne mogu ovako. Tlak mi skače. A ionako mi je visok.',
      'Ne dolazi u obzir. Ovo nije ni usluga, ni cigara, ni kava.',
      'Hrvoje, razočaran sam. Kao kad sam saznao da je ponedjeljak dan prsa.',
      'Prekidam Dan nogu. Idem naći lounge koji me razumije.',
      'Idem. Ali znajte: velik sam pa se moje razočaranje čuje.'
    ],
    rant: [
      'U moje vrijeme u Zagrebu je bilo pet teretana. Sad ih je pedeset, a nitko ne diže.',
      'Ja sam na prirodnoj prehrani. Samo proteini, čaj, i tri liječnika koje ne smijem spominjati.',
      'Moj hematokrit? Odličan. Liječnik kaže da tako nešto još nije vidio.',
      'Rib-eye, cast iron tava, puter, češnjak, timijan. Sve ostalo je grijeh.',
      'Klijent mi je poslao sliku: minus 14 kila. Ja sam dobio 2. Mišića. Ne masti.',
      'Kad sam ja počeo trenirati, nije bilo YouTubea. Bio je samo bol.',
      'Prije se znalo: kad si velik, sve ti se sklanja s puta. Sad svi rade selfie.',
      'Danas je Dan nogu. Zato ne mogu sjesti. Zato stojim. Ali sjedam.',
      'Moje ruke imaju 52 centimetra. Ne pitajte što je to 52. Centimetara, naravno.',
      'Ja sam prirodan. Prirodan kao fotelja koja puca pod mnom.'
    ]
  },
  specials: {
    talk: 'excited storytelling pose: one hand holding up a phone toward viewer, other arm gesturing wide',
    smoke: 'huge arms crossed, thick cigar in mouth, smoke puff, smug confidence',
    special1: 'double-biceps flex pose',
    special2: 'holding phone up showing a progress pic to camera, thumbs-up with other hand'
  },
  portraitNote: 'bald muscular man, huge arms and traps, big friendly grin, olive/khaki tight t-shirt, smartwatch (see reference/people/matija-*). Comically wide.'
};

C.customers.tomislav = {
  name: 'Tomislav',
  short: 'Bivši tenisač, nekretninski mogul',
  gender: 'm',
  bio: 'Tomislav, bivši tenisač i sadašnji nekretninski mogul. Tvrdi da je bio bolji od Ivaniševića. ' +
    'Obožava padel, prodaje stanove od 40 kvadrata za 900 tisuća i uvijek ima „jedan super projekt“.',
  orders: [
    { cigar: 'cigar_cohiba', drink: 'cognac' },
    { cigar: 'cigar_hoyo', drink: 'whisky' },
    { cigar: 'cigar_sancho', drink: 'rum_caroni' },
    { cigar: 'cigar_cohiba', drink: 'whisky' }
  ],
  patience: 60,
  tip: 0.3,
  lines: {
    enter: [
      'Dobra večer. Netko traži stan? Ili tenis? Ja sam obojica.',
      'Bok, Hrvoje. Jesi li čuo? Cijena kvadrata opet je narasla. Kao moj ego.',
      'Evo me! Ostavio sam auto u garaži... koja je moja. I susjedna. I ona iza.',
      'Dobra večer svima. Ako netko kupuje nekretninu, ja sam tu.',
      'Čuo sam da je vani padel turnir. Ja sam se javio kao sudac. Ali prvo cigara.',
      'Znaš što je bilo prije 15 godina? Ja sam bio bolji od Gorana. Vjeruj mi.',
      'Bok, ekipa. Pazite na lopticu. Padel je opasan. Za čaše.',
      'Evo mene. Nemam vremena. Zato dvije cigare.'
    ],
    order: [
      'Konjak i najbolja Cohiba. Novac nije problem, samo kvadrat je.',
      'Viski, dupli. I Hoyo. Trebam razmisliti o jednoj garsonijeri.',
      'Donesi mi nešto što košta. Ali ne više od 900 tisuća.',
      'Daj Sancho Panzu! Danas sam prodao stan od 28 kvadrata.',
      'Cigaru, a uz nju konjak. Ili obrnuto. Bitno da je skupo.',
      'Nešto jako. Kao moj bekhend iz 2003.',
      'Pivo. Ne, ipak viski. Ne, dupli. Ali tiho, klijent sluša.',
      'Cohiba, molim. I ono što najviše košta. Račun potpisujem sutra.'
    ],
    waiting: [
      'Vrijeme je novac, Hrvoje. A ja ga imam. Ali ne za čekanje.',
      'Ja sam nekad čekao samo lopticu za drugi servis. Ovo je gore.',
      'Znaš koliko košta ovaj kvadrat u kojem čekam? 6800 eura. Čekanje je luksuz.',
      'Dok čekam, mogu ti prodati onaj lokal na uglu.',
      'Ivanišević je čekao petnaest godina na Wimbledon. Ja neću petnaest minuta.',
      'Hrvoje, radim na tri klijenta u glavi. Molim te, brže.',
      'Padel je brz. Ova usluga nije. Samo primjećujem.',
      'Bit ću iskren: očekivao sam bolje. Kao kad sam bio bolji od Gorana.'
    ],
    served_good: [
      'Ace! Točno u polje. Kao moj servis 2004.',
      'Odlično! Ovo je premium. Kao moje nekretnine.',
      'Bravo, Hrvoje! Zaslužio si proviziju. Šalim se, ne dajem proviziju.',
      'Ovo je kvalitetno. Kao stan na Tuškancu. Nikad se ne pokvari.',
      'Točno! Nula grešaka. Kao moj nekadašnji bekhend.',
      'Hrvoje, ako te ikad zatreba posao, ja sam u nekretninama.',
      'Ovo je bolje nego pobjeda protiv Gorana. Ne pitaj, nikad se nismo igrali.',
      'Solidno. Šest ključeva, sedam prozora. Isporučeno.'
    ],
    served_bad: [
      'Ovo je aut! Ja sam naručio drugo. Aut je aut.',
      'Pogrešno. Kao kad je Goran imao sreće na Wimbledonu.',
      'Hrvoje, ovo je nekretnina bez lokacije. Nema vrijednosti.',
      'Ne! Vrati to. Naručio sam skuplje. Ili jeftinije. Ne znam.',
      'To je dupla greška. Kao moj servis u petom setu.',
      'Nula bodova. I još minus na poziciji.',
      'Ma daj... i ja sam griješio. Ali samo u svojoj glavi.',
      'Ovo je fault. Nema prve šanse, samo druga. Hajde, ponovo.'
    ],
    leave_happy: [
      'Odlično, Hrvoje. Ostavljam ti napojnicu. I posjetnicu.',
      'Doviđenja! I zapamti: kvadrat je novo zlato, a zlato je nova cigara.',
      'Idem na padel. Nemoj mi ništa reći, znam da ću pobijediti.',
      'Bilo je super! Čujemo se za stan. Ili tenis. Ili obje.',
      'Vidimo se, ekipa. Goran je još uvijek malo lošiji od mene. U svemu.',
      'Idem. Sutra otvaram novi projekt: luksuzni apartmani u Španskom.',
      'Sjajno. Ostavio sam napojnicu i posjetnicu. Obje vrijede.',
      'Vidimo se, Hrvoje. Kad budeš imao milijun, javi se. Nađem ti stan.'
    ],
    leave_angry: [
      'Ovo je sramota! Jedan lošiji servis i idem na drugu adresu.',
      'Nikad više! Osim ako dobijem popust.',
      'Ja to ne trpim. Ja sam bio top 10. Ili top 100. U regiji.',
      'Idem. Ovo je nula bodova. Meč izgubljen.',
      'Ne mogu vjerovati. Ovaj lounge više nije u mojoj ligi.',
      'Sve ću ti tužiti, Hrvoje. Samo čekaj moje odvjetnike.',
      'Ovo ću ispričati Goranu. Nasmijat će se.',
      'Idem sagraditi vlastiti lounge. S bazenom. I padel terenom.'
    ],
    rant: [
      'Bolji sam bio od Ivaniševića. Nije lako to priznati, ali tako je.',
      'Stan od 40 kvadrata, samo 900 tisuća. Praktički poklon.',
      'Padel je budućnost. Tenis je prošlost. Ali ja sam prošlost dobro prošao.',
      'Kad sam igrao tenis, publika je vrištala. Sad vrište samo dužnici.',
      'Nekretnine su kao tenis: bitan je servis, a onda cijena.',
      'Garsonijera na Cvjetnom trgu? Za cijenu bubrega. Ali ja vam nudim popust.',
      'Ma nije problem što je skupo. Problem je što je jeftino.',
      'Znate koliko sam osvojio turnira? Nekoliko. Onih u glavi.',
      'Goran je imao servis. Ja sam imao stil. I stan u centru.',
      'Padel je ovdje da ostane. A ja sam ovdje da prodam zid uz teren.'
    ]
  },
  specials: {
    talk: 'salesman pose: one palm open presenting an invisible flat, other hand pointing at viewer, confident grin',
    smoke: 'relaxed with cigar, one hand holding a padel racket over shoulder, smug smile',
    special1: 'tennis forehand swing with racket mid-motion',
    special2: 'padel pose: racket up, tiny yellow ball hovering above (about to smash)'
  },
  portraitNote: 'good-looking man late 30s/40s, short messy dark-brown hair, stubble, blue eyes, wide confident smile, dark polo/t-shirt with thin chain (see reference/people/tomislav-*). Racket prop optional.'
};

/* ---------- LIKOVI B: baka1, baka2, gamer1, gamer2, guest1-4 ---------- */
C.customers = C.customers || {};

C.customers.baka1 = {
  name: 'Baka Štefica',
  short: 'Susjeda s maramom i torbom',
  gender: 'f',
  bio: 'Baka Štefica živi u susjednoj zgradi i uporno vjeruje da je Havana 22 kotlovnica. ' +
    'Ima maramu, torbu veličine kofera i broj komunalaca na brzom biranju.',
  orders: [],
  patience: 45,
  tip: 0.05,
  lines: {
    enter: [
      'Dobra večer! Kaj je ovo, dimnjak?! Gdje je tramvaj?',
      'Ježešmarija, dima kao u ložionici! U što sam ja uopće ušla?',
      'Tražim ljekarnu. Ne, ne trebam cigar lounge. Ali bum ostala.',
      'Bum samo pogledala, sine. Ne bum ništa naručila.',
      'Pa kaj je ovo? Kao u podmornici! I još svi puše!',
      'Dobra večer. Kaj je vam ovo, dimnica za šunku?',
      'Ne mogu disati! A došla sam samo po sol!',
      'Sinko, jel ovdje smiju svi pušiti? Pa jel to zakonito?',
      'Gospon, otvorte prozor! Ja bum se ugušila!'
    ],
    order: [
      'Imate čaj od kamilice? Ne? Onda samo vodu. Iz slavine.',
      'Ja bum samo malo špricera. Ili čaja. Ili da se prestanete dimiti.',
      'Daj mi nešto bez alkohola i bez dima. Ako toga imate.',
      'Bum espresso. Bez cigare. Bez dima. Bez ičega.',
      'Kaj imate za grlo? Za pluća? Za živce?',
      'Mogu li dobiti samo čašu vode? I da otvorite prozor?',
      'Imate kolač? Ne? Onda samo mir.',
      'Samo kavu. Bez ičega. Kao što sam bila u mladosti.'
    ],
    waiting: [
      'Sinko, kaj je s mojom kavom? Ili je i ona otišla u dim?',
      'Ja sam čekala i na vlak. Ali vlak barem nije zadimljen.',
      'Bum ja tu čekala, ali bum i kašljala. Pa bum vas tužila.',
      'Pa kaj je ovo, kolektivna zaboravnost?',
      'Čekam. I kašljem. Vidite kaj vi radite?',
      'Za koga je ova cigara? Za medvjeda?',
      'Ja bum polako zvala komunalce. Jer čekam.',
      'Dok čekam, molim se. Za pluća. Za sve.'
    ],
    served_good: [
      'E, vidiš, sinko, to je usluga. Hvala.',
      'Ovo je dobro. A dim? Nisam ni primijetila. Hvala Bogu.',
      'Hvala, dušo. Bum samo malo posjedila.',
      'Aha, ovo je fino. Al i dalje ne razumijem kaj ovi rade s cigarama.',
      'Kaj je ovo? Kamilica? Baš dobro. Ti si dobar dečko.',
      'Dobro je. Sad bum ostala još pet minuta. Samo pet.',
      'Oh, ovo je lijepo. Kao kod moje mame. Bez dima.',
      'Hvala. Reći ću susjedi da si pristojan.'
    ],
    served_bad: [
      'Kaj je ovo?! Ja nisam naručila ovo! Ja imam srce!',
      'Pa kaj bum s tim? Tražila sam kamilicu, a ti mi daješ ovo!',
      'Ovo nije za mene! Bum ovo vratila. I još zvala.',
      'Sinko, jesi ti čuo kaj sam rekla? Ili si i ti gluh od dima?',
      'Bože sačuvaj! Ovo je jače od ljekarne!',
      'Fuj! Kaj je ovo? Ja ne pijem takve stvari.',
      'Gospon! Ovo je bila greška. Bum to prijavila!',
      'Pa nisam ja došla ovdje da me trujete!'
    ],
    leave_happy: [
      'Bok, dušo, hvala! A ti se čuvaj tog dima.',
      'Lijepo je ovdje, ali ne dolazim više. Ali lijepo je.',
      'Doviđenja, sinko. I nemoj puno pušiti. Ni ti ni oni.',
      'Bum se vratila. Ne zbog cigara. Zbog tebe.',
      'Hvala na strpljenju. Ti si dobar čovjek. Pozdravi mamu.',
      'Idem. Ali reći ću susjedi da ti je ovdje ipak lijepo.',
      'Bok, dečki. I ne zaboravite jesti nešto zdravo.',
      'Bum vam poslala kolač. Ako se sjetim.'
    ],
    leave_angry: [
      'Ovo je skandal! Ja bum zvala komunalce!',
      'Idem! Idem! I nikad više! Ovdje se ne more disati!',
      'Bum vas prijavila! Sve ću ispričati u župi!',
      'Ovo ne more ostati tak! Vi ste zagadili cijelu Frankopansku!',
      'Ježešmarija! Kakav dim! Ja idem, a vi ostajte s tim!',
      'Zovem inspekciju! I ministra! I sina, kad se javi!',
      'Fuj! Fuj! Fuj! I još jednom fuj! Ja ovamo više ne ulazim!',
      'Pa kaj mislite, da sam ja glupa? Ovo je otrov! Zovem policiju!'
    ],
    rant: [
      'Dima kao u tvornici! A ja imam pluća iz 1958.!',
      'Kaj je ovo, kotlovnica?! Ja ovdje ne mogu disati!',
      'U moje vrijeme cigare su se pušile na balkonu, a ne sred sobe!',
      'Ja sam ovdje ušla po adresu, a izaći ću s upalom pluća!',
      'Pa gdje su ovi gasilci kad ih trebaš?!',
      'Meni je doktor rekel: ne diši dim! A ovdje sve diše dim!',
      'Ovo je zdravstvena opasnost! Bum zvala ministarstvo!',
      'Znate li vi koliko ja imam kaputa koji zaudaraju?!'
    ]
  },
  specials: {
    talk: 'scolding pose: index finger wagging, other hand gripping big handbag, mouth open, angry frown',
    smoke: 'coughing: one hand fanning the air, other hand over mouth, eyes squeezed shut',
    special1: 'swinging handbag overhead threateningly',
    special2: 'holding an old brick-sized phone to ear, dialing komunalci (city inspectors)'
  },
  portraitNote: 'elderly Croatian grandma, grey bun under a floral headscarf, round glasses, plaid shawl, huge handbag, deep frown (neutral = stern, angry = furious).'
};

C.customers.baka2 = {
  name: 'Gospođa Mira',
  short: 'Dama s bundom i psićem Bimbom',
  gender: 'f',
  bio: 'Gospođa Mira nosi bundu iz 1974., drži psića Bimba u torbi i tvrdi da ona ništa nema protiv cigara. ' +
    'Ima nešto protiv oblaka.',
  orders: [],
  patience: 45,
  tip: 0.1,
  lines: {
    enter: [
      'Dobra večer! Ovo bi trebala biti slastičarnica. Ili... što je ovo?',
      'Molim lijepo, je li ovo galerija? Ne? A što je ovaj dim?',
      'Ja sam tražila mir. A dobila... dimnjak.',
      'Oprostite, gospodine, gdje se ovdje smije disati?',
      'Ušla sam slučajno. Moj Bimbo je pobjegao. I ja za njim.',
      'Ježeš, kakav miris! U moje vrijeme ovo se zvalo ložionica.',
      'Dobra večer, gospodo. Tražim posljednje slobodno mjesto bez dima.',
      'Gospodine, znate li vi tko sam ja? Ja sam Mira. Iz bloka do vas.'
    ],
    order: [
      'Čaj od mente, molim. S malo limuna. Ali bez dima.',
      'Imate li kekse? Ne? Onda samo čašu vode. Iz čiste boce.',
      'Espresso, ali bez cigare. I bez dima. Može?',
      'Nešto lagano. Kao moje raspoloženje. I bez alkohola.',
      'Gospodine, jednu kavicu. Ali bez mirisa cigare u šalici.',
      'Ja bih žličicu tišine. I šalicu čaja.',
      'Imate li nešto za pluća? Dupli espresso? Ne, to je gore.',
      'Ja bih vodu. Ali sa šarmom. Ako imate.'
    ],
    waiting: [
      'Molim lijepo, čekam. Već sam prošla tri kruga kroz svoje brige.',
      'Gospodine, moj Bimbo bi već dobio kost. A ja još ni čaj.',
      'Čekam, ali ne dugo. Imam ja svoje dostojanstvo.',
      'U mojoj mladosti konobari su letjeli. Sad plutaju.',
      'Gospodine, ovdje je predimno za čekanje.',
      'Ako uskoro ne dobijem čaj, morat ću se onesvijestiti. Elegantno.',
      'Pa ja ne mogu čekati vječno. Ja sam već pola vječnosti čekala.',
      'Znate, vrijeme leti. A ja sjedim u dimu.'
    ],
    served_good: [
      'Vrlo fino. Vidim da ovdje ipak ima odgoja.',
      'Hvala, gospodine. Ovo je pravi čaj. Za pravu damu.',
      'Ah, to je bolje. Sad se osjećam kao kod kuće.',
      'Preporučit ću vas prijateljici Vesni. Ali neću spominjati dim.',
      'Vrlo dobro. Vidim da niste sasvim propali.',
      'Ovo je lijepo. Kao nekad u kavani.',
      'Hvala, dragi. Vi ste pravi gospodin.',
      'Prihvaćam. I dopuštam da ostanem još malo.'
    ],
    served_bad: [
      'Ovo nije čaj! Ovo je... ne znam što je ovo!',
      'Gospodine, molim vas, pa to je pogrešno. Ja sam dama.',
      'Ovo ne smijem piti. Ja imam tlak, gospodine!',
      'Ovo je nedopustivo. Tražila sam nešto sasvim drugo.',
      'Vratite to odmah. Moj Bimbo bi to odbio.',
      'Nije to to. I još s dimom! Užas.',
      'Ah, to nije za mene. Ni za Bimba.',
      'Ne mogu vjerovati. U kavani bi vas otpustili.'
    ],
    leave_happy: [
      'Bilo je ugodno, gospodine. Šarmantni ste. Idem.',
      'Doviđenja. I zapamtite: zdravlje je najvažnije. I ventilacija.',
      'Lijepo mjesto, iako malo dimno. Ali lijepo.',
      'Hvala. Reći ću Vesni da ovdje postoji jedan pristojan čovjek.',
      'Vidimo se. Možda. Ako se dim smanji.',
      'Hvala na čaju. I na strpljenju. Bimbo šalje pozdrav.',
      'Doviđenja, dragi. Leđa ravno, kaže moj liječnik. I vi.',
      'Odlazim zadovoljna. I s plućima. Uglavnom.'
    ],
    leave_angry: [
      'Ovo je neprihvatljivo! Idem! I nikad više!',
      'Zovem kćer! I njezinog odvjetnika!',
      'Kakav skandal! Cigare, dim i nikakav bonton!',
      'Bimbo se onesvijestio od dima. Sad ćete vi vidjeti!',
      'Ja idem! Ali vratit ću se s petnaest susjeda!',
      'Nikad u životu! Ovo nije lounge, ovo je kotlovnica!',
      'Objavit ću to na Facebooku! Vesna ima 200 prijatelja!',
      'Doviđenja, gospodine. Nadam se da ćete ostati bez cigare.'
    ],
    rant: [
      'Ja sam u mladosti plesala valcer. Sad plešem kašalj.',
      'Moj pokojni Josip pušio je cigare. Ali na balkonu. U kaputu. Kao gospodin.',
      'Znate li vi koliko košta čišćenje bunde od dima? Ne? Ja znam.',
      'Kakav je to dim! Vidite li da mi se kosa uvija sama od sebe?',
      'Sve smo mi nekad pušili. Ali u pristojnim okolnostima.',
      'Ja nemam ništa protiv cigara. Imam nešto protiv oblaka.',
      'Da je ovo kavana, konobar bi već bio otpušten.',
      'Gospodine, moja bunda je iz 1974. Njezine uspomene ne smiju zaudarati!'
    ]
  },
  specials: {
    talk: 'haughty pose: chin up, one hand pressing a pearl necklace, small dog head peeking from handbag',
    smoke: 'covering nose and mouth with a lace handkerchief, eyes wide in horror',
    special1: 'dramatic faint: back of hand to forehead, swaying',
    special2: 'stomping cane on floor, furious'
  },
  portraitNote: 'elegant elderly lady, lavender-tinted permed hair, pearl necklace, fur collar coat, tiny dog in handbag, painted lips; neutral = haughty, angry = outraged.'
};

C.customers.gamer1 = {
  name: 'Ante (GG Arena)',
  short: 'Gejmer, vođa akcije',
  gender: 'm',
  bio: 'Ante igra za GG Arenu preko puta. Vođa je akcije „Idemo na WC kod Podmornice“ jer je onaj kod Arene navodno zauzet.',
  orders: [{ cigar: null, drink: 'espresso' }],
  patience: 30,
  tip: 0,
  lines: {
    enter: [
      'Samo gledamo, brate. Ne diramo ništa.',
      'Ovaj lounge je tako zadimljen. Gdje je WC?',
      'Ej, ekipa, tu je bar. Ne, ne idemo na bar.',
      'GG Arena je preko puta. Mi smo samo u prolazu.',
      'Nije nam bitno što se tu radi. Samo trebamo pet minuta.',
      'Ovo je Podmornica? Vau. Ali gdje je toalet?',
      'Bok, mi smo samo turisti. Iz Zagreba.',
      'Šuti, ne gledaj u bar. Idemo ravno.'
    ],
    order: [
      'Imate li Wi-Fi? Ne za WC. Za život.',
      'Može čaša vode? Iz slavine, naravno.',
      'Imate li Red Bull? Ne? Onda nemamo interesa.',
      'Jedan espresso, ali samo ako uključuje WC.',
      'Koliko košta najjeftinije? Ne pitamo jer nemamo. Samo pitamo.',
      'Možemo li platiti karticom? Ne? Onda kešom, u WC-u.',
      'Daj nam nešto što ne izgleda kao pivo.',
      'Cijena espressa? Dva eura? Uzet ćemo jedan. Za obojicu.'
    ],
    waiting: [
      'Brate, čekamo, a trebamo hitno. Ne pitaj.',
      'Je li ovo lag ili je stvarno spor servis?',
      'Ja više ne mogu. Ovo je clutch moment.',
      'Ping tristo. Nama treba WC, ne sonar.',
      'Hoće li konobar doći ili će ovo završiti AFK?',
      'Gdje je Hrvoje? Igra je pauzirana.',
      'Ovo je gore od respawn timera.',
      'Ako se ne pojavi espresso, ide plan B. WC.'
    ],
    served_good: [
      'GG! Espresso stiže. Možemo li sad na WC?',
      'Bravo, brate! Ez pobjeda. Hvala.',
      'Ovo je bolje od lootboxa! Hvala!',
      'Legendo! Sad smo pravi gosti. Službeno.',
      'Espresso! Napokon smo na mapi.',
      'Jesmo li sad VIP? Dobili smo i WC.',
      'Hvala, Hrvoje! Ti si kao pravi support igrač.',
      'Top usluga. Pet zvjezdica. Ili tri. Ovisi o WC-u.'
    ],
    served_bad: [
      'Ovo nije ono što smo tražili! Bug u sistemu!',
      'Brate, ovo je noob greška.',
      'Ovo nije espresso! Ovo je voda? Ili razočaranje?',
      'Nemoj to, ovo je lag. Ponovo.',
      'Ovo je nerf. Vrati stari meni.',
      'Hej! Ovo je pogrešno! Hoćemo refund!',
      'Što je ovo? Novi patch? Ne sviđa mi se.',
      'Ovo je jače od moje sposobnosti da se suzdržim.'
    ],
    leave_happy: [
      'Hvala, brate! Vidimo se u Areni!',
      'GG, Hrvoje! Ti si najbolji. WC je super.',
      'Bilo je ludo! Preporučit ću te cijeloj ekipi. Bez cigara.',
      'Doviđenja! Sljedeći put dovodimo cijeli tim.',
      'Idemo natrag. Turnir čeka. Hvala za sve!',
      'Nemoj nam zamjeriti. Ovo je bio hitan slučaj.',
      'Ostavit ćemo ti pet zvjezdica. Ili barem ulaznicu za turnir.',
      'Peace! Ne pušimo, ali poštujemo.'
    ],
    leave_angry: [
      'Ovo je bezobrazno! Idemo natrag u Arenu!',
      'Ne trebamo vaš WC! Imamo svoj. Preko puta.',
      'Brate, ovo je toksično. Idemo!',
      'Bježimo! Baka nas gleda!',
      'GG. Izgubili smo. Idemo.',
      'Ovo ćemo napisati na Redditu. Naslov: Havana 22 ne daje WC.',
      'Mi smo samo pitali. A vi ste nas gledali kao da smo ukrali humidor.',
      'Hajdemo. Ovdje nas nitko ne razumije.'
    ],
    rant: [
      'Onaj tip s cigarom izgleda kao boss iz igre. Onaj zadnji level.',
      'Kad bi Hrvoje igrao Fortnite, bio bi tenk. Samo s ventilacijom.',
      'Prošao sam 200 sati u Elden Ringu. Ovdje sam prvi put vidio pravi dim.',
      'Ping kod nas je 12. Ovdje je 300. Kao da je sonar.',
      'Turnir počinje u devet. Ali moj mjehur je počeo u osam.',
      'Cool je ovdje. Kao u Bioshocku. Samo bez Big Daddyja.',
      'Brate, imaš tri života i nula WC-a. To je dizajn igre.',
      'Mi smo tu samo na loot. Ne, ne na WC. Na atmosferu.'
    ]
  },
  specials: {
    talk: 'sly whisper pose: hand cupped next to mouth, sideways glance, esports jersey',
    smoke: 'coughing awkwardly, waving the air with jersey sleeve (not smoking, just in the smoke)',
    special1: 'sprinting away, arms pumping, looking back over shoulder laughing',
    special2: 'crossed-legs desperate dance, bouncing, one hand pressing stomach'
  },
  portraitNote: 'young esports guy, messy hair, black-teal GG Arena jersey with gamer tag, headset around neck, cheeky grin; angry = trolling smirk/laugh.'
};

C.customers.gamer2 = {
  name: 'Luka (GG Arena)',
  short: 'Gejmer, hitan slučaj',
  gender: 'm',
  bio: 'Luka je Antin suigrač. Popio je tri energetska pića prije turnira i sad je za njega WC pitanje života i smrti.',
  orders: [{ cigar: null, drink: 'espresso' }],
  patience: 25,
  tip: 0,
  lines: {
    enter: [
      'Ja stvarno moram. Molim vas, samo pet minuta.',
      'Brate, brže hodaj! Ja ne mogu više čekati!',
      'Tu je toalet? Ja ću... ja ću samo proći.',
      'Nisam ja došao pušiti. Došao sam preživjeti.',
      'Ne gledaj me tako! Ja sam samo... u prolazu.',
      'Šuti, Ante, ja imam plan. Idemo ravno, pa desno, pa lijevo.',
      'Bok! Divno je ovdje! Gdje je WC?',
      'Ovaj miris! Ali nema veze, ja se moram žuriti.'
    ],
    order: [
      'Nešto malo. Jeftino. Što god. Samo da smijem na WC.',
      'Imate li vodu? Ne, ne, ne pijem vodu. To je dio problema.',
      'Espresso? Da! Dva! Ne, jedan! Ne znam! Brže!',
      'Ja platim što god. Samo pokažite gdje je WC.',
      'Nemam novaca, ali imam loptu od padela. Može?',
      'Imate li energetsko? Ne? Onda ništa. Već sam popio tri.',
      'Ja ne pijem kavu. Ali danas ću piti. Za WC.',
      'Recite mi cijenu. Ne, ne recite. Idem.'
    ],
    waiting: [
      'Ja ću puknuti. Doslovno. Ne šalim se.',
      'Molim vas... Ne znam koliko još mogu.',
      'Ovo je gore od finala. Ovo je nula kontrole.',
      'Brate, ako ne stigne kava, ostavljam vam poklon u WC-u.',
      'Svaka sekunda je bol. Svaka. Jedna. Sekunda.',
      'Skačem s noge na nogu. Smeta li vam to?',
      'Nemoj me gledati u oči. Ne mogu održavati fokus.',
      'Ja idem. Zapravo ne idem. Ali bih.'
    ],
    served_good: [
      'Hvala, hvala, hvala! Sad smijemo na WC? Molim?',
      'Ti si moj heroj! Prvi put danas!',
      'Espresso! Ali ja ću sad trčati. Hvala!',
      'Vi ste najbolji! Ostavit ću... ne, nemam ništa. Hvala!',
      'Fantastično! Znao sam da ste dobra duša.',
      'To je to! Sad sam službeni gost. Idem!',
      'Pet zvjezdica! I ja sam pet zvjezdica! Zbog ovoga!',
      'Kava je super! Ali mjehur je još bolji. Idem!'
    ],
    served_bad: [
      'Ne! Ovo nije to! Ja nemam vremena za greške!',
      'Zašto? Zašto sada? Ja imam hitan slučaj!',
      'Ovo je nemoguće! Jesu li vam ovo namjerno?',
      'To nije espresso. To je moje razočaranje.',
      'Nemamo vremena za ovo! Brate, idemo drugdje!',
      'Ah! Ne mogu vjerovati! U ovom trenutku?',
      'Samo mi dajte kavu. Ili WC. Ili oboje.',
      'Zar je to pravi izbor? Ja imam mjehur, ne strpljenje.'
    ],
    leave_happy: [
      'Hvala vam! Hvala! Preporučit ću vas svima. Osim baki.',
      'Bili ste divni! Ostavit ću pozitivnu recenziju. I ručnik.',
      'Olakšanje! Doslovno! Doviđenja!',
      'Idem natrag. Turnir čeka. A ja sam novi čovjek.',
      'Hvala, i oprostite ako sam bio glasan.',
      'Ovo je bio najbolji WC u mom životu. Doslovno.',
      'Doviđenja! I ne brinite, nisam ništa dirao. Osim slavine.',
      'Sve najbolje! Vratit ću se kad opet popijem tri energetska.'
    ],
    leave_angry: [
      'Ovo je nehumano! Idem tražiti drugi WC!',
      'Vi ste okrutni! Ja ću ovo objaviti!',
      'Nikad više! Nikad! Osim ako trebam WC!',
      'Bježim! Ali pamtim ovo!',
      'Ne mogu vjerovati... Ovo je bio moj zadnji izbor!',
      'Idem u Arenu. Tamo imaju čak i papir!',
      'Zbogom, hladni ljudi! Nadam se da vam se cijevi zaguše!',
      'Ovo je sramota! Ali moram trčati, doviđenja!'
    ],
    rant: [
      'Znate li kako je kad moraš, a ne možeš? Ja znam.',
      'Ne znam tko je izumio energetska pića, ali znam tko će platiti račun.',
      'Ante kaže: budi miran. Ja kažem: budi ti miran, ti nemaš tri Redbulla.',
      'Igrao sam finale s prekrižnim nogama. Bilo je bolje od ovoga.',
      'Kad odem u mirovinu, gradim WC pored svake igre.',
      'Ja u životu imam dvije stvari: mrežu i mjehur. Obje su preopterećene.',
      'Moja mama kaže: idi prije nego kreneš. Nisam je slušao.',
      'Ovaj lounge ima najljepši WC u Zagrebu. Rekao sam to javno.'
    ]
  },
  specials: {
    talk: 'panicked pleading pose: both hands clasped, eyebrows up, knees pressed together',
    smoke: 'holding nose with two fingers, eyes teary from smoke',
    special1: 'sprinting, frantic arms, jersey flapping',
    special2: 'crossed-legs desperate hop, both hands on belly'
  },
  portraitNote: 'young esports guy, blond/light hair, oversized GG Arena jersey, wide panicked eyes, sweat drop; angry = comedic red-face.'
};

C.customers.guest1 = {
  name: 'Ivica',
  short: 'Menadžer u odijelu',
  gender: 'm',
  bio: 'Ivica je srednji menadžer koji je jučer imao sedam sastanaka koji su mogli biti mail. Ovdje dolazi po dvije stvari: cigaru i tišinu.',
  orders: [
    { cigar: 'cigar_robusto', drink: 'whisky' },
    { cigar: 'cigar_corona', drink: 'cognac' },
    { cigar: 'cigar_robusto', drink: 'beer_velebitsko' },
    { cigar: 'cigar_cohiba', drink: 'whisky' }
  ],
  patience: 70,
  tip: 0.15,
  lines: {
    enter: [
      'Dobra večer. Imam sastanak za deset minuta. Ovdje. S cigarom.',
      'Bok! Samo jedna cigara i idemo dalje. Kaže moj kalendar.',
      'Dobra večer. Rezerviran sam do 20 sati. Ili sam možda samo umoran.',
      'Pozdrav. Molim najtiši stol. Moram zatvoriti jedan posao. I jedan Robusto.',
      'Bok! Tko vodi ovaj lounge? Ah, Hrvoje. Znam ga s LinkedIna.',
      'Ulazim. Telefon ostavljam u džepu. Ne, vadim ga. Ne mogu bez njega.',
      'Šef mi kaže: idi na pauzu. Došao sam ovdje. Pauza je pauza.',
      'Dobra večer. Trebam nešto za smirenje. I račun na firmu. Može?'
    ],
    order: [
      'Viski i Robusto. Neka bude ozbiljno, kao naš budžet.',
      'Konjak. Corona. I da, nemojte me ništa pitati o Excelu.',
      'Velebitsko i robusto. Neka bude domaće, kao naši porezi.',
      'Nešto srednje jako i srednje skupo. Kao moj menadžment.',
      'Cohibu i viski. Večeras potpisujem ugovor. Ili ga zapalim.',
      'Cigaru koja izgleda skupo i piće koje izgleda još skuplje.',
      'Daj mi ono što piju direktori. Ne pitaj koga.',
      'Cigaru za pregovore i viski za posljedice.'
    ],
    waiting: [
      'Oprostite, imam sastanak za deset minuta. To je sastanak s mojom cigarom.',
      'Vrijeme je novac. Ali vaše vrijeme je očito besplatno.',
      'Nisam došao ovamo čekati. Čekam cijeli dan na mailove.',
      'Kad ćete? Moj kalendar plače.',
      'Ako naručim preko aplikacije, hoće li biti brže? Ah, nema aplikacije.',
      'Već čekam. Već bilježim. Već šaljem povratnu informaciju.',
      'Kako kažu naši klijenti: rok je rok. Vaš rok je prošao.',
      'Znate, imam još tri sastanka. Ovaj je moj najkraći.'
    ],
    served_good: [
      'Odlično. Preporučit ću vas kolegama. Nikad im neću reći gdje ste.',
      'Kvaliteta. Točno onako kako piše u prezentaciji.',
      'Hvala. Ovo je konačno nešto što radi bez upitnika.',
      'U redu. Jedini sastanak danas koji je ispao dobro.',
      'Dobro. Napisat ću recenziju. Vjerojatno. Ako se sjetim.',
      'Savršeno. Bez prekovremenih, bez CC-a.',
      'Prava kvaliteta. Kao dobar KPI.',
      'Zadovoljan sam. Ostavit ću dobar dojam. I napojnicu.'
    ],
    served_bad: [
      'Ovo nije ono što sam naručio. Molim da se ispravi. Odmah.',
      'Ovo je greška. Bilježim za sastanak.',
      'Pa to je klasičan propust u komunikaciji.',
      'Molim vas, ovo je sad pogrešno. Tražim povratnu informaciju.',
      'Zamijenite to, molim vas. Nemam vremena za pogreške.',
      'Ovo bi kod nas bio eskalacijski ticket.',
      'Ne, hvala. Ovo nisam tražio. A nije ni u budžetu.',
      'Hm. Ovo će ići u zapisnik.'
    ],
    leave_happy: [
      'Hvala, doviđenja. Sutra imam još jedan sastanak. Ali ovo je bilo najbolje.',
      'Odlično. Ostavljam napojnicu. I posjetnicu, za svaki slučaj.',
      'Vidimo se! Možda čak i bez laptopa.',
      'Bilo je ugodno. Poslat ću mail. Ne, bit ću ljudski. Doći ću.',
      'Doviđenja. Ostavite mi mjesto do prozora. Za sljedeći put.',
      'Sjajna usluga. Uvijek se vraćam kad mi je stres.',
      'Idem doma. Jedva čekam odmor. Ne, lažem, idem na još jedan poziv.',
      'Vidimo se. Ako budem imao slobodan dan. A neću.'
    ],
    leave_angry: [
      'Ovo je neprihvatljivo. Poslat ću službenu pritužbu.',
      'Ne mogu ovako raditi. Ni pušiti.',
      'Nisam ovdje došao trošiti vrijeme. Ni novac.',
      'Doviđenja. Ovo ide u moj izvještaj. Loše poglavlje.',
      'Tražim upravitelja! Ah, to je Hrvoje. Onda tražim drugu večer.',
      'Ovo je sramota za Zagreb. I za moje živce.',
      'Idem. Više neću trošiti novac firme ovdje.',
      'Sad razumijem zašto ljudi rade od kuće.'
    ],
    rant: [
      'Još jedan poziv u 22:00. Pitam se kad ljudi spavaju.',
      'Danas sam imao sedam sastanaka koji su mogli biti mail.',
      'Za promociju mi treba još samo godinu dana i tri života.',
      'Znate što je najbolje na cigari? Nitko mi ne šalje CC.',
      'Idealan radni dan: bez telefona, bez Teamsa, s cigarom.',
      'Šef kaže: budi proaktivan. Ja sam proaktivno došao u lounge.',
      'Sinergija je kad se sastanak može zamijeniti šetnjom.',
      'Kad odem u mirovinu, ovdje ću imati vlastiti humidor. Ako mirovine ikad bude.'
    ]
  },
  specials: {
    talk: 'phone-call pose: phone to ear, other hand making a chopping gesture, tie loosened',
    smoke: 'leaning back in armchair, jacket open, cigar in hand, eyes closed relieved',
    special1: 'checking wristwatch with impatient look',
    special2: 'holding up a finger: one second please, while typing on phone with other hand'
  },
  portraitNote: 'middle-aged man in a grey suit, tie loosened, thinning hair, tired eyes, phone in hand; angry = eyebrow twitch.'
};

C.customers.guest2 = {
  name: 'Lana',
  short: 'Influencerica za tri cigare',
  gender: 'f',
  bio: 'Lana ima 3000 pratitelja i nijedan ne zna gdje je ova Podmornica. Sretna je. Fotografira sve, uključujući dim.',
  orders: [
    { cigar: 'cigar_corona', drink: 'martini' },
    { cigar: 'cigar_robusto', drink: 'espresso' },
    { cigar: 'cigar_corona', drink: 'black_chocolate' },
    { cigar: 'cigar_cohiba', drink: 'martini' }
  ],
  patience: 75,
  tip: 0.2,
  lines: {
    enter: [
      'Bok! Ovo je tako aesthetic. Mogu li slikati bar?',
      'Bok, Hrvoje! Prijateljica mi je rekla da je ovdje kao Podmornica. I jest.',
      'Ooo, Edison žarulje! Svjetlo je savršeno za story.',
      'Bok! Samo jedan quick shot za Instagram. Pa cigara.',
      'Dobra večer! Imate li vegan cigaru? Šalim se. Ili ne.',
      'Ulazim! Ovo je vibe, ljudi. Pravi vibe.',
      'Došla sam na preporuku i s mapom. Preporuka je bila bolja.',
      'Pozdrav! Nikad nisam bila. Sve mi je novo i lijepo i malo dimno.'
    ],
    order: [
      'Martini i coronu. Protresen ili miješan, kako god izgleda bolje na slici.',
      'Espresso i robusto. Danas sam preskočila ručak. I doručak.',
      'Crnu čokoladu i coronu. Netko mi je rekao da to paše.',
      'Cohiba i martini. Znam da je Bond. Ne, ne pitajte.',
      'Nešto što izgleda skupo na fotografiji. I što mi neće pokvariti šminku.',
      'Ono što preporučuješ. Ali neka bude fotogenično.',
      'Jednu lijepu cigaru. I piće s nekom pričom.',
      'Espresso, molim. I cigaru. Za content.'
    ],
    waiting: [
      'Jesam li već objavila story? Da. Čekam reakcije. I cigaru.',
      'Hrvoje, baterija mi je na 12 posto. Kao i strpljenje.',
      'Čekam. Uz ovakvo svjetlo izgledam kao film. Ali film je predug.',
      'Znaš, ne mogu vječno pozirati bez cigare.',
      'Je li moja cigara zapela u drugoj vremenskoj zoni? Ne stiže.',
      'Čekanje je toksično. Kao i to što moja frendica objavljuje prije mene.',
      'Malo sam se izgubila u mislima. I u čekanju.',
      'Još malo pa ću početi snimati vlog o čekanju.'
    ],
    served_good: [
      'Ovo je savršeno! I kako lijepo izgleda! Odmah objavljujem.',
      'Hrvoje, ti si genij. Označit ću te. Ako imaš Instagram.',
      'Ovo je točno ono što sam željela. Kao da si mi čitao misli.',
      'Bravo! Ovo je bolje od filtera.',
      'Fantastično! Sad imam sadržaj za tjedan dana.',
      'Odlično! Snimila sam pet fotki. Jedna je dobra.',
      'Mmm, ovo miriše kao film. Baš kao iz podmornice.',
      'Hvala! Ovo je moj novi omiljeni lounge.'
    ],
    served_bad: [
      'Ovo nije ono što sam naručila. I nije fotogenično.',
      'Hrvoje, ovo ne ide uz moj outfit. Ni uz narudžbu.',
      'Ovo neću objaviti. Jednostavno ne mogu.',
      'Ups. Ovo je pogrešno. I još je ružno.',
      'Molim te, zamijeni. Ne stane u kadar.',
      'Ovo je kao loš filter: sve pokvari.',
      'Hm. To nije moj vibe. Ni moja narudžba.',
      'Nije to to! Ali dobro. Objavit ću kao cringe.'
    ],
    leave_happy: [
      'Bilo je predivno! Objavit ću sve. I označiti Podmornicu.',
      'Vidimo se! Ostavljam ti pet zvjezdica. I emoji.',
      'Hvala, Hrvoje! Ovo je najbolji lounge u kojem sam bila.',
      'Doviđenja! Poslat ću ti link kad postavim sve na Insta.',
      'Idem. Ali samo zato što mi se telefon ugasio.',
      'Bilo je epski! Vraćam se s prijateljicama.',
      'Hvala, super je bilo. Preporučit ću te cijelom Zagrebu.',
      'Vidimo se! Mikrofon, svjetlo i cigara. To je moj recept.'
    ],
    leave_angry: [
      'Ovo je bilo užasno. Nijedna fotka ne valja.',
      'Idem. Izbrisat ću sve fotografije. I recenziju.',
      'Ovo je toksično. Ne mogu više.',
      'Zaboravi. Objavit ću recenziju od jedne zvjezdice. S emojijem koji plače.',
      'Idem. Izgubila sam pratitelje. I živce.',
      'Ovo ne odgovara mom brendu. Ni mom raspoloženju.',
      'Ne. Ne. Ne. Ovo ne ide u story.',
      'Ovo ću zapamtiti. I ispričati. U trideset sekundi.'
    ],
    rant: [
      'Ne znam gdje bih objavila prvo: story, reel ili recenziju.',
      'Znaš što je najbolje kod cigara? Dobar kadar. I dim.',
      'Sve što danas radimo je za content. I malo za život.',
      'Moja frendica kaže da je pušenje toksično. Ali dim izgleda tako artistic.',
      'Volim ovaj lounge. Svjetlo je bolje od većine filtera.',
      'Imam 3000 pratitelja i nijedan ne zna gdje je ovaj bar. Sretna sam.',
      'Ako slikam cigaru, izgleda kao film. Ako je pušim, kao dokumentarac.',
      'Ovaj vibe je kao podmornica, ali s boljim Wi-Fijem.'
    ]
  },
  specials: {
    talk: 'excited pose: holding phone up taking a selfie, other hand peace sign',
    smoke: 'elegant pose, thin cigar held with two fingers, chin up, other hand adjusting hair, small smoke puff',
    special1: 'taking a photo of the cigar with phone held out',
    special2: 'blowing a kiss to the camera / duck-face selfie'
  },
  portraitNote: 'young woman, long wavy dark hair, oversized round sunglasses pushed up on head, colourful jacket, phone in hand, big smile; angry = dramatic eye-roll.'
};

C.customers.guest3 = {
  name: 'Stari Vlado',
  short: 'Znalac starog kova',
  gender: 'm',
  bio: 'Stari Vlado pali cigare otkad se ne prodaju u dućanu. Sjedi u istoj fotelji i priča o Havani 1978. Uz to uvijek ostavi dobru napojnicu.',
  orders: [
    { cigar: 'cigar_hoyo', drink: 'rum_caroni' },
    { cigar: 'cigar_cohiba', drink: 'cognac' },
    { cigar: 'cigar_sancho', drink: 'whisky' },
    { cigar: 'cigar_hoyo', drink: 'black_chocolate' }
  ],
  patience: 100,
  tip: 0.25,
  lines: {
    enter: [
      'Dobra večer, Hrvoje. Isto kao i prošli put. Samo starije.',
      'Dobra večer, mladiću. Moje mjesto je slobodno? Kao i uvijek?',
      'Kad sam ja prvi put zapalio pravu havansku, Tito je još bio živ.',
      'Pozdrav. Otvorite ventilaciju. Ali polako, kao što se uvijek radilo.',
      'Bok, Hrvoje. Imaš li onaj humidor iz kuta? Onaj s dušom?',
      'Dobra večer. Došao sam popiti nešto i zapaliti sjećanje.',
      'Ah, Podmornica. Ovdje se još zna što je cigara.',
      'Dobra večer. Bez žurbe. Imam cijelu noć. I pola života.'
    ],
    order: [
      'Jedan Hoyo i Caroni. Po starom, ako smijem.',
      'Cohibu i konjak. Kao u dobra stara vremena u Havani.',
      'Sancho Panza i viski. Ne tražim puno. Samo dobro.',
      'Hoyo i crnu čokoladu. Mladi ne znaju, ali ti znaš.',
      'Nešto što ne žuri. Kao ja. Hoyo, ako imaš.',
      'Ono što mi uvijek daješ, Hrvoje. Ne pitam.',
      'Konjak, cigara i tišina. Redoslijedom kojim ti odgovara.',
      'Rum i cigaru. Ako ti nije teško. A nije, znam.'
    ],
    waiting: [
      'Nema žurbe, sinko. Ali ni ja nisam vječan.',
      'Znaš, ja sam nekad čekao tri sata na jednu cigaru. Vrijedilo je.',
      'Ah, strpljenje. Naučio sam ga na Kubi. Trebat će mi opet.',
      'Hrvoje, dok čekam, ispričat ću ti o Havani 1978.',
      'Ako se cigara ne pojavi, morat ću zapaliti uspomenu.',
      'Znam da radiš najbolje što možeš. Ali i dalje čekam.',
      'Čekanje je dio užitka. Ali ne cijela večer.',
      'Ne mogu ustati, koljena. Pa čekam. Ionako je udobno.'
    ],
    served_good: [
      'Ah. Točno tako. Ovako je nekad bilo.',
      'Hvala, Hrvoje. Ovo je prava stvar.',
      'Mladiću, ti imaš dar. Cigara i piće kao iz sna.',
      'Bravo. Znao sam da ću ovdje dobiti dobru večer.',
      'Ovaj miris me vraća u Havanu. Hvala ti.',
      'Savršeno. Ne treba mi više ništa. Osim vremena.',
      'Eto, dobro je. Mogu zatvoriti oči. Nakratko.',
      'Pravi majstor. Reći ću svima. Ali ne mnogima.'
    ],
    served_bad: [
      'Hm. Ovo nisam tražio. Ali dobro, strpljiv sam.',
      'Mladiću, i ja sam nekad griješio. Ali nikad s cigarom.',
      'Nije to to. Ali oprostit ću ti. Ovaj put.',
      'Molim te, provjeri. Moje oko je staro, ali ne krivo.',
      'Nije pogrešno... ali nije ni ispravno. Kao život.',
      'Ovo bi moj otac vratio. Ali ja sam blaži.',
      'Ne brini. Svi griješe. Ali cigara ne oprašta.',
      'Ne, ne. Ovo nije moje. Ali mogu ga pogledati.'
    ],
    leave_happy: [
      'Hvala, Hrvoje. Vidimo se sutra. Ili opet, kad bude vrijeme.',
      'Lijepa večer. Ovako je nekad bilo u Havani.',
      'Bilo je odlično. Vratit ću se. Uvijek se vraćam.',
      'Doviđenja. Čuvaj humidor kao što čuvaš svoju dušu.',
      'Dobro je bilo. Poslat ću ti jednu iz Havane. Ako doživim.',
      'Vidimo se, mladiću. Ostavljam napojnicu za dobro raspoloženje.',
      'Odlična večer. Zapiši je u knjigu. Ali u onu dobru.',
      'Idem doma. S mirom u srcu i mirisom u kaputu.'
    ],
    leave_angry: [
      'Ovo nije za mene. Idem. Vratit ću se kad se nauči.',
      'Razočaran sam. Ali još više sam tužan.',
      'Stariji sam od ovoga, ali ne dovoljno da trpim.',
      'Nekad je usluga bila umjetnost. Danas nije.',
      'Doviđenja, mladiću. Ali ovo neću zaboraviti.',
      'Ja sam ovdje došao uživati, ne razmišljati.',
      'Idem. Ali nisam ljut. Samo sam dugo živio.',
      'Neće mi se ni čudo dogoditi. Zbogom.'
    ],
    rant: [
      'Nekad se cigara pušila sat vremena. Danas je sve fast food.',
      'Kad sam bio u Havani, cigare su se motale pred tobom. Sad ih motaju strojevi.',
      'Zagreb je nekad imao pet dućana s cigarama. Sad ima dva i jedan lounge.',
      'Mladi žure. Stari uživaju. Ja sam još negdje između.',
      'Rum, cigara, razgovor. Sve ostalo su sitnice.',
      'Znaš, Hrvoje, ovaj lounge me podsjeća na brod. Samo bez ljuljanja.',
      'Pušio sam kad si ti još bio u pelenama. Ne ovdje. Ali negdje.',
      'Ja sam vidio sve. Osim dobrog espressa u kafiću do banke.'
    ]
  },
  specials: {
    talk: 'storytelling pose: one hand raised holding a cigar, other hand resting on cane, nostalgic smile',
    smoke: 'deeply relaxed, eyes closed, cigar held between two fingers, slow smoke puff',
    special1: 'raising a glass in a toast, eyes twinkling',
    special2: 'tapping cane and nodding along to imaginary Cuban music'
  },
  portraitNote: 'old distinguished man, white moustache and swept-back silver hair, brown tweed jacket and waistcoat, walking cane; neutral = serene, angry = sad disappointed.'
};

C.customers.guest4 = {
  name: 'Klaus',
  short: 'Njemački turist',
  gender: 'm',
  bio: 'Klaus iz Münchena je našao Podmornicu preko Googlea i prvi put u životu vidi bakrene cijevi bez poreza. Hrvoje s njim govori njemački. Ordnung!',
  orders: [
    { cigar: 'cigar_robusto', drink: 'beer_tap' },
    { cigar: 'cigar_corona', drink: 'beer_velebitsko' },
    { cigar: 'cigar_robusto', drink: 'beer_velebitsko' },
    { cigar: 'cigar_cheap', drink: 'beer_tap' }
  ],
  patience: 80,
  tip: 0.12,
  lines: {
    enter: [
      'Guten Abend! Ovo je ta Podmornica, ja?',
      'Hallo! Ich bin Klaus. Ja sam Klaus. Njemačka, München.',
      'Ooh! Kupfer, Dampf, Ordnung! Kao u Hamburgu, samo bolje.',
      'Guten Abend, prijatelju! Jedno pivo i cigara, bitte.',
      'Hallo! Tražio sam najbolji cigar lounge. Google je rekao: Podmornica.',
      'Aha! Edison žarulje! Ich fühle mich wie zu Hause.',
      'Guten Abend! Hrvoje? Šef? Čuo sam za tebe. Dobre stvari.',
      'Entschuldigung, smije li se ovdje pušiti? Ja? Wunderbar!'
    ],
    order: [
      'Ein Bier, bitte! Točeno. Und eine Zigarre. Robusto.',
      'Velebitsko pivo! Ich habe es im Reiseführer gelesen.',
      'Bitte ein Bier und eine Zigarre. Danke, Prost!',
      'Nešto lokalno! Ich möchte das echte Zagreb probieren.',
      'Pivo, Zigarre und gute Laune. Das ist alles.',
      'Hrvoje, preporuči mi nešto. Ali ne prejako. Sonst kann ich nicht gehen.',
      'Jedno pivo, jedna cigara. Einfach. Ordentlich.',
      'Bitte: najjeftinije, ali fein. Reise ist teuer.'
    ],
    waiting: [
      'Entschuldigung... Ich warte schon lange. Čekam.',
      'In Deutschland ist alles pünktlich. Ovdje: romantično.',
      'Das ist... wie soll ich sagen... sporo. Aber ugodno.',
      'Hrvoje, du bist Deutscher? Onda razumiješ. Pünktlichkeit!',
      'Ich schaue auf meine Uhr. Nichts. Nur dim.',
      'Nema problema! Ich habe Zeit. Na godišnjem sam.',
      'Prost ohne Bier ist schwierig. Bitte!',
      'Ist mein Bier verloren gegangen? U dimu?'
    ],
    served_good: [
      'Wunderbar! Točno kako treba! Ordnung!',
      'Danke, mein Freund! Das ist perfekt.',
      'Sehr gut! Bolje nego u Münchenu!',
      'Prost! Und danke! Sve je super.',
      'Ha! Das ist es! Točno to. Hvala.',
      'Hrvoje, du bist ein Meister. Majstor.',
      'Hervorragend! Sve funkcionira. Kao Mercedes.',
      'Ausgezeichnet. Gut gemacht.'
    ],
    served_bad: [
      'Nein, nein. Das ist nicht mein Bier. Nije to.',
      'Hm. Das ist... anders. Nije ono što sam tražio.',
      'Entschuldigung, das ist falsch. Krivo je.',
      'Ich wollte ein Bier. Ne ovo. Ovo je... što je ovo?',
      'Hrvoje, du bist Deutscher. Du weißt: Ordnung! Ovo nije Ordnung.',
      'Das ist keine Zigarre. To je nešto drugo.',
      'Nein danke. Ich möchte das, was ich bestellt habe.',
      'Hm... nema veze. Ali nije dobro.'
    ],
    leave_happy: [
      'Auf Wiedersehen! Bilo je wunderbar!',
      'Danke, Hrvoje! Vratit ću se. Sigurno.',
      'Tschüss! Preporučit ću te u Münchenu.',
      'Sehr schön! Ich komme wieder. Doći ću opet.',
      'Gute Nacht, Freund. Prost auf Zagreb!',
      'Danke für alles! Ostavljam napojnicu. Und ein Lächeln.',
      'Idem u hotel. Aber ich denke immer an Podmornica.',
      'Fantastisch! Reći ću cijeloj Njemačkoj.'
    ],
    leave_angry: [
      'Das ist nicht in Ordnung! Nema reda!',
      'Ich gehe. Ovo nije ono što sam očekivao.',
      'Schade. Ich hatte mehr erwartet. Očekivao sam više.',
      'Nein. Nein. Ich komme nicht wieder.',
      'Hrvoje, du bist Deutscher? Sram te bilo. Ordnung!',
      'Ich schreibe eine Bewertung. Auf Deutsch. Und dugu.',
      'Auf Wiedersehen. Ali ne s radošću.',
      'Ich gehe zu Havana Shop. Preko ceste. Tamo je Ordnung.'
    ],
    rant: [
      'In Deutschland: Rauchverbot überall. Hier: Freiheit! Wunderbar!',
      'Ihr habt hier so schöne Kupferrohre. U Hamburgu plaćamo porez za to.',
      'Dobar dan, dobra večer, gute Nacht. Kroatisch ist schwierig.',
      'Zagreb je fantastičan. Ali tramvaji... zu viele Kurven.',
      'Ich habe gehört: Hrvoje ist ein Kapitän. Und Kinesiologe? Interessant!',
      'Bier und Zigarre. Das ist mein Urlaub. Mehr brauche ich nicht.',
      'Preise? U Njemačkoj skuplje. Hvala Bogu na Hrvatskoj.',
      'Ich liebe diese Podmornica. Ist das ein U-Boot? Ich habe Angst und Freude.'
    ]
  },
  specials: {
    talk: 'cheerful tourist pose: pointing at something with a map in hand, big grin',
    smoke: 'proud posture, cigar in mouth, beer in the other hand, cheeks a bit red',
    special1: 'raising a beer mug: Prost!',
    special2: 'taking a photo with a big camera hanging from the neck'
  },
  portraitNote: 'stocky middle-aged German tourist, blond thinning hair, red cheeks, beige safari vest or Bavarian jacket, big camera around neck; angry = stern Teutonic frown.'
};

/* ---------- EVENTI A: baka, gamers, shopRush ---------- */
C.events = C.events || {};

/* pomoćna funkcija: gradi variants[id] (flat choices + tree) iz jedne definicije */
function bakaVariant(v) {
  var nodes = {};
  var choices = [];
  nodes.a = { who: v.id, text: v.opening, choices: [] };
  v.options.forEach(function (o, i) {
    var id = o.result;
    nodes.a.choices.push({ text: o.text, next: id + '_1', tag: o.result, fx: o.fx });
    nodes[id + '_1'] = { who: v.id, text: o.reply, next: id + '_2', tag: o.result };
    nodes[id + '_2'] = { who: 'hrvoje', text: o.escort, next: id + '_3' };
    nodes[id + '_3'] = { who: v.id, text: o.exit, end: true, tag: o.result, fx: o.fx };
    choices.push({ text: o.text, result: o.result, reply: o.reply, escort: o.escort, exit: o.exit, fx: o.fx });
  });
  return {
    id: v.id, name: v.name, intro: v.intro, complaints: v.complaints, opening: v.opening,
    choices: choices, ignored: v.ignored, ignoredLines: v.ignoredLines,
    tree: { start: 'a', nodes: nodes }
  };
}

C.events.baka = {
  timer: 15,                              // sekundi prije nego baka zove komunalce
  penaltyIgnored: { stars: -0.3, smoke: 15 },
  intro: 'Vrata se otvaraju i unutra ulazi baka s torbom veličine kofera. Nos joj se već mršti od dima. ' +
    'Priđi joj (E) prije nego nazove komunalce!',
  complaints: [
    'Dima kao u tvornici!',
    'Kaj je ovo, kotlovnica?!',
    'Ne mogu disati! A došla sam samo po sol!',
    'Ovdje ljudi puše kao lokomotive!',
    'Gospon! Otvorite prozor!',
    'Pa ovo je zdravstvena opasnost!',
    'Ja bum zvala komunalce!',
    'U moje vrijeme se cigara pušila na balkonu!',
    'Kaj radite s ovim dimom? Pa to je opasno!'
  ],
  choices: [
    { text: 'Gospođo, evo čaja i mjesta do ventilacije. Na račun kuće.', result: 'best',
      reply: 'Čaj? Za mene? Ti si dobar dečko. Al dim...', escort: 'Ovo je cigar lounge, gospođo, ali za vas otvaram prozor. Izvolite.',
      exit: 'Hvala, sine. Bum ipak otišla.', fx: { stars: 0.1, cash: 3, smoke: -5 } },
    { text: 'Ovo je cigar lounge, gospođo. Evo vam mjesto do prozora.', result: 'ok',
      reply: 'Do prozora? Pa dobro. Ali ovo nije normalno.', escort: 'Ovo je cigar lounge, gospođo. Izvolite ovuda.',
      exit: 'Idem. Ali to još nije kraj.', fx: { smoke: 5 } },
    { text: 'Ako vam smeta, vrata su tamo.', result: 'bad',
      reply: 'Kaj?! Vrata?! Ja bum vam pokazala vrata!', escort: 'Ovo je cigar lounge, gospođo!',
      exit: 'Bum vas prijavila! Sve ću ispričati u župi!', fx: { stars: -0.2, smoke: 15 } }
  ],
  ignored: 'Baka je izvadila mobitel: „Halo, komunalci?“ Inspekcija je na putu, a ocjena pada.',
  ignoredLines: [
    'Halo? Komunalci? Ovdje baka iz Frankopanske. Dima kao u kotlovnici!',
    'Ja sam vas upozorila! Sad bum zvala i ministra!',
    'Bum ja vas prijavila! Sve imam zapisano u bilježnici!',
    'Zovem policiju! I vatrogasce! I župnika!',
    'Nitko me ne sluša! Onda bum ja sama nazvala!'
  ],
  calling: [
    'Bip. Bip. Bip. Baka bira broj.',
    'Ovdje zvoni... komunalci se javljaju.',
    'Baka: „Halo? Da, ja sam. Dim!“'
  ],
  escortShout: [
    'Ovo je cigar lounge, gospođo!',
    'Izlazite, gospođo, ali s poštovanjem!',
    'Gospođo, pratimo vas do vrata. Bez dima!'
  ],
  variants: {
    baka1: bakaVariant({
      id: 'baka1', name: 'Baka Štefica',
      intro: 'Baka Štefica ulazi s maramom i torbom. Prvo mirisa, pa bijes. Priđi joj!',
      opening: 'Sine, ja bum ti nekaj rekla: ovo je sramota! Dima kak u kotlovnici!',
      complaints: [
        'Dima kak u ložionici!',
        'Ovo ne more biti zakonito!',
        'Kaj mi to puhate u lice?',
        'Ja imam pluća iz 1958.!',
        'Otvorte prozor! Ali odmah!',
        'Ja bum vas prijavila, sine!',
        'Kak se to more dozvoliti?!',
        'Ovo je otrov, a ne zabava!'
      ],
      options: [
        { text: 'Gospođo Štefice, sjednite kod ventilacije. Kamilica je na račun kuće.', result: 'best',
          reply: 'Kamilica? Za mene? Ti si dobar dečko. Al dim...',
          escort: 'Ovo je cigar lounge, gospođo, ali za vas otvaram prozor. Do vrata, molim.',
          exit: 'Hvala, sine. Al bum ipak otišla. Al ti si dobar.',
          fx: { stars: 0.1, cash: 3, smoke: -5 } },
        { text: 'Gospođo, ovo je cigar lounge. Ali evo, sjednite do prozora.', result: 'ok',
          reply: 'Do prozora? A kaj je s dimom? Dobro, idem, ali samo zato što je hladno vani.',
          escort: 'Ovo je cigar lounge, gospođo. Izvolite ovuda.',
          exit: 'Idem, idem. Ali reći ću susjedi kaj se tu događa.',
          fx: { smoke: 5 } },
        { text: 'Ako vam smeta, vrata su tamo.', result: 'bad',
          reply: 'Kaj?! Vrata?! Ja bum vam pokazala vrata! Bum zvala komunalce!',
          escort: 'Ovo je cigar lounge, gospođo!',
          exit: 'Ne bum se ja vratila! Al bum vas prijavila!',
          fx: { stars: -0.2, smoke: 15 } }
      ],
      ignored: 'Baka Štefica zvoni komunalcima: „Halo, ovdje Štefica! Zadimili su cijelu Frankopansku!“',
      ignoredLines: [
        'Halo, komunalci? Ovdje Štefica. Zadimili su Frankopansku!',
        'Pa ja sam vam rekla! Sad bum zvala i župnika!',
        'Ovi su me ignorirali! Ja bum vas prijavila, sve!'
      ]
    }),
    baka2: bakaVariant({
      id: 'baka2', name: 'Gospođa Mira',
      intro: 'Gospođa Mira stiže s bundom i psićem Bimbom u torbi. Već drži rupčić na nosu. Priđi joj!',
      opening: 'Gospodine! Moja bunda! Moj Bimbo! Ovo je nedopustivo!',
      complaints: [
        'Moja bunda će zaudarati tjednima!',
        'Bimbo se guši! Bimbo, dišite!',
        'Ovo je nedopustivo!',
        'Ja sam dama, a ne dimnjak!',
        'Molim lijepo, gdje je ovdje izlaz?!',
        'Ja ovo neću tolerirati!',
        'Kakav bonton!',
        'Sve me štipa u očima! I u principu!'
      ],
      options: [
        { text: 'Gospođo Mira, vaša bunda je prelijepa za ovakav dim. Dopustite da vas pratim do taksija.', result: 'best',
          reply: 'Ah, pa vi ste pravi gospodin! Dobro, ali samo zbog Bimba.',
          escort: 'Ovo je cigar lounge, gospođo. Ali vi ste dama. Izvolite.',
          exit: 'Reći ću Vesni da imate ukusa. Bimbo šalje pusu.',
          fx: { stars: 0.1, cash: 5, smoke: -5 } },
        { text: 'Evo vam lepeza, gospođo. Ventilacija je upravo pokrenuta.', result: 'ok',
          reply: 'Lepeza? Vrlo pažljivo. Ali ipak idem. Bimbo se guši.',
          escort: 'Ovo je cigar lounge, gospođo. Izvolite ovuda.',
          exit: 'Vidimo se. Možda. Ako se dim smanji.',
          fx: { smoke: 3 } },
        { text: 'Gospođo, u vašim godinama malo dima neće škoditi.', result: 'bad',
          reply: 'U MOJIM GODINAMA?! Ja sam mlada dama! Bimbo, idemo! Zvat ću komunalce!',
          escort: 'Ovo je cigar lounge, gospođo!',
          exit: 'Jao! Nećete više vidjeti ni mene ni moj kaput!',
          fx: { stars: -0.25, smoke: 15 } }
      ],
      ignored: 'Gospođa Mira je nazvala komunalce i kćerinog odvjetnika: „Bimbo je pao u nesvijest!“',
      ignoredLines: [
        'Molim lijepo, komunalce! Ovdje gospođa Mira. Bimbo je pao u nesvijest!',
        'Bit će skandal! Ja poznajem gradonačelnikovu ženu!',
        'Zovem kćer. I njezinog odvjetnika. I njezinog frizera!'
      ]
    })
  }
};

C.events.gamers = {
  alert: 'GG Arena upada! Gejmeri idu ravno na WC!',
  enter: [
    'Samo gledamo, brate. Ne diramo ništa.',
    'Ne pogledaj u bar. Idemo ravno na WC.',
    'Mi smo turisti. Iz Arene. Preko puta.',
    'Ovo je Podmornica? Gdje je toalet?',
    'Ne gledaj konobara. Hodaj kao da nam je normalno.',
    'Čini se da nas nitko ne vidi. Pravi stealth level.',
    'Ekipa, imamo pet minuta do meča. Idemo!',
    'Nemoj se smijati! Ako se nasmiješ, izgubili smo.'
  ],
  shout: [
    'WC je samo za goste!',
    'Stani! Ovo je cigar lounge, ne Arena!',
    'Nema WC-a za one koji ne naruče!',
    'Izlazite! Ovdje se plaća prije olakšanja!',
    'Espresso je dva eura! WC je uz espresso!'
  ],
  caught: [
    'Ha! Uhvaćeni smo! Bježi!',
    'Brate, Hrvoje nas je vidio! Kreće plan B!',
    'GG! Vrijeme je za retreat!',
    'Bježimo! Hrvoje je ozbiljan kao baka!',
    'Pobjegli smo, ali smijemo se. Ovo će biti meme.',
    'Nemoj se ljutiti! Mi smo samo... zalutali!',
    'Aut, brate! Idemo preko ceste!',
    'Ne ide. Idemo koristiti WC u Areni. Barem ima papira.'
  ],
  reachedWC: [
    'Ha! Dosegnuli smo cilj! WC je naš!',
    'Zaključano! Sad nas nitko ne može dirati!',
    'Ovo je najbolji level! Bonus stage!',
    'Ahhh. Napokon. Čovjek živi za ovakve trenutke.',
    'Ne izlazim dok mi netko ne pošalje tim za spašavanje.',
    'Brate, ovaj WC ima ambijentalno osvjetljenje! Bakreno!',
    'Nemoj me požurivati! Ovo je tek boss fight.',
    'Ako netko pita: nismo nikad bili ovdje.'
  ],
  espresso: [
    'Jedan espresso za dvojicu! I WC, molim.',
    'Evo dva eura. Sad smo pravi gosti!',
    'Espresso! Onda smijemo, zar ne?',
    'Kupujemo espresso! Službeno smo klijenti!',
    'Uzimam kavu. Ne pijem kavu, ali danas pijem.',
    'Dobro, dobro, plaćamo. Ali WC ide uz cijenu!',
    'Ovaj espresso je najskuplji u mom životu. Uz WC.',
    'Hvala, Hrvoje! Ti si najbolji konobar u Frankopanskoj.'
  ],
  flee: [
    'Trči, trči!',
    'Bježimo, GG!',
    'Ha ha ha, uhvatite nas ako možete!',
    'Bježi, ovaj lounge je preopasan!',
    'Ne gledaj natrag!'
  ],
  wcInside: [
    '*šum vode*',
    '*netko pjeva u WC-u*',
    '*lupa na vrata* Hej! Ima li koga?',
    '*klik-klik* Ovo je najduži WC red u Zagrebu.',
    '*Wi-Fi ping iz kabine*'
  ],
  wcLeave: [
    'Nisu ni espresso kupili! Ostavili su samo miris.',
    'WC je zauzet petnaest sekundi. Vaša ocjena pada.',
    'Gejmeri odlaze prepuni zadovoljstva i praznih džepova.',
    'Vrata WC-a se otvaraju: „Hvala! Bilo je epski!“'
  ],
  bought: 'Gejmeri su platili espresso. WC je dopušten, ocjena raste.',
  blocked: [
    'Stani! Nećete kroz mene!',
    'Ne ovuda! Ovo je tunel za goste!',
    'Ovaj koridor je zatvoren! Pokušajte s kartom.'
  ]
};

C.events.shopRush = {
  announce: '20:00 — Havana Shop preko ceste zatvara! Guste kolone stižu ravno u Podmornicu!',
  banner: 'PRELAZAK PREKO CESTE',
  lines: [
    'Shop je zatvoren! Zato smo došli ovamo.',
    'Preko puta su zatvorili. A ja trebam cigaru. Odmah.',
    'Rekli su: idi u Havanu 22. Evo me.',
    'Pola Zagreba je preko puta. Sad je ovdje.',
    'Čujem da ovdje prodajete cigare i kad je shop zatvoren!',
    'Uf, jedva sam stigao prije 20:00. A opet sam kasnio.',
    'Dvadeset sati, shop zatvara, mi smo ovdje. Tako to ide.',
    'Preko ceste je bilo pusto. Ovdje je gužva. Znači dobro mjesto.',
    'Ekipa, brzo! Sve slobodne fotelje idu prve!',
    'Imamo li rezervaciju? Ne? Onda ćemo stajati. Ili sjesti. Ili viknuti.'
  ],
  hrvoje: [
    'Havana Shop je zatvorio. Ordnung! Ovdje smo otvoreni.',
    'Dobrodošli u Podmornicu. Sjednite, a ja stižem sa cigarom.',
    'Petak, 20:00. Ovo je moja liga.',
    'Svi na palubu! Ali polako, jedan po jedan.',
    'Sonar bilježi jaku aktivnost preko ceste. Spremni!'
  ],
  crowd: [
    'Hoće li netko doći do nas?',
    'Ja sam stigao prvi! Stoga ja idem prvi!',
    'Ovo je gužva kao u tramvaju!',
    'Imate li mjesta za pet ljudi? Ili za tri i pol?',
    'Guranje! Molim vas, malo pristojnosti!',
    'Tko je naručio sve ove cigare? Ah, ja.'
  ],
  waves: [
    'Prvi val stiže. Držite se.',
    'Drugi val! Ne otvaraj vrata sasvim!',
    'Ovo je još uvijek prvi val. Nema veze, ide sljedeći.',
    'Zadnji val. Sad ćemo vidjeti tko je pravi kapetan.'
  ],
  end: [
    'Rush je prošao. Podmornica plovi dalje.',
    'Bilo je gusto, ali smo preživjeli.',
    'Preko puta je mrak, a ovdje je svjetlo. To je Havana 22.'
  ]
};

/* ---------- EVENTI B: roko, mislav ---------- */
C.events = C.events || {};

/* ===================== ROKO ===================== */
C.events.roko = {
  ping: [
    'PING! Sonar: kontakt na vratima. Oznaka: Roko. Brzina: umorna.',
    'PING! Podmornica javlja: programer na palubi, ramena spuštena.',
    'PING! Kontakt na šest sati: Roko. Ponavljam: Roko.',
    'PING! Otkriven je signal niskog budžeta i visoke tjeskobe.',
    'PING! Ronilac s laptop torbom priplovio je do površine.'
  ],
  intro: {
    start: 'a',
    nodes: {
      a: { who: 'roko', text: 'Bok, Hrvoje. Samo da znaš: ne, nemam vremena. Da, moram na prod.', next: 'b' },
      b: { who: 'hrvoje', text: 'Roko. Sjedni. Diši. Što ti se dogodilo?', next: 'c' },
      c: { who: 'roko', text: 'Cura, posao, plaća. Redoslijedom kojim me uništavaju.', next: 'd' },
      d: { who: 'hrvoje', text: 'Ordnung muss sein. Prvo cigara, pa problemi.', end: true }
    }
  },

  /* „Na crtu“ */
  tab: {
    start: 'a',
    nodes: {
      a: { who: 'roko', text: 'Hrvoje... imam problem. Plaća stiže petnaestog, a danas je treći. Može na crtu?',
        choices: [
          { text: 'Može, ali samo do 20 eura.', next: 'yes', tag: 'ok' },
          { text: 'Roko, ovo nije Tinder. Ovdje se ne swipea na kredit.', next: 'no', tag: 'ok' },
          { text: 'Prvo mi reci što je s curom.', next: 'ask', tag: 'good' }
        ] },
      yes: { who: 'roko', text: 'Ti si legenda! Vratit ću. Za tjedan dana. Ili mjesec. Ili kad prođem probni rad.',
        end: true, tag: 'ok', fx: { debt: 20, flag: 'tab_open' } },
      no: { who: 'roko', text: 'Ma razumijem. Pojest ću samo dim iz zraka.', next: 'no2', fx: { patience: -5 } },
      no2: { who: 'hrvoje', text: 'Ne dramatiziraj. Cigarillo ćeš ipak dobiti. Ali platiš odmah.', end: true, tag: 'ok' },
      ask: { who: 'roko', text: 'Kaže da previše radim. A onda kaže da premalo zarađujem. Kako oboje?!', next: 'ask2' },
      ask2: { who: 'hrvoje', text: 'Roko, to zvuči kao bug u specifikaciji.', next: 'ask3' },
      ask3: { who: 'roko', text: 'To je feature, ne bug! Ali hvala što slušaš. Ovaj put ću platiti... na crtu.',
        end: true, tag: 'good', fx: { debt: 10, rep: 0.05, flag: 'roko_pity' } }
    }
  },
  tabLines: {
    reminder: [
      'Hrvoje, koliko sam ti dužan? Ne, ne govori. Ne mogu podnijeti broj.',
      'Crta je duga kao moj backlog. Ali barem je vidljiva.',
      'Kad dobijem plaću, prvi ćeš ti dobiti svoje. Nakon najma. I režija. I cure.',
      'Znam da sam ti dužan. Nikad ne bi rekao. Zato ti vjerujem.'
    ],
    repaid: [
      'Evo, vraćam dio! Ne cijeli. Ali dio je dio.',
      'Hvala što si strpljiv. Plaća je stigla. Sad je nema.',
      'Uplatio sam sve. Sad sam čist. I švorc.'
    ],
    overdue: [
      'Crta je prešla 60 eura. Roko je službeno tvoj najskuplji stalni gost.',
      'Roko duguje toliko da bi mu se mogla otvoriti podružnica.'
    ]
  },

  /* Jadikovanje: zamrzava strpljenje gosta u blizini dok ne klimneš (E) */
  rant: {
    prompt: 'Roko počinje jadikovati. Klimni glavom (E) prije nego gost pored njega izgubi volju!',
    durationSec: 8,
    topics: [
      { id: 'cura', lines: [
        'Kaže da nikad nemam vremena za nju.',
        'A kad imam vremena, kaže da mi je telefon važniji.',
        'A telefon je moj šef. U džepu. Zove me i kad spavam.'
      ] },
      { id: 'posao', lines: [
        'Šef je rekao: mali hotfix. Radim ga već šesti dan.',
        'Stand-up traje sat i pol. Stojimo samo simbolično.',
        'Jučer sam popravio bug. Danas sam popravio popravak. Sutra je opet bug.'
      ] },
      { id: 'novac', lines: [
        'Plaća mi je stigla. I već je otišla.',
        'Najam, režije, cigare i crta kod Hrvoja.',
        'Imam budućnost do petnaestog. Nakon toga ne znam.'
      ] },
      { id: 'mama_od_cure', lines: [
        'Zvala je mama od cure. Pitala što radim. Rekao sam: programer.',
        'Pitala je: a pravo zanimanje? Rekao sam: stabilno. Rekla je: stabilno nisko?',
        'Sad se spremam za nedjeljni ručak s rodbinom. Ili za deložaciju. Nisam siguran.'
      ] },
      { id: 'laptop', lines: [
        'Laptop mi je star. Dok se upali, prođe sastanak.',
        'Tražio sam novi. Šef kaže: ima budžeta za pizzu, ne za hardver.',
        'Kad se laptop upali, tek onda počne moj dan. Do tada spavam.'
      ] },
      { id: 'kubernetes', lines: [
        'Novi projekt: Kubernetes. Nitko ne zna što je, ali moramo ga imati.',
        'Ja nisam siguran je li to alat ili dijagnoza.',
        'Kad kažem pod i node, cura misli da pričam o vrtlarstvu.'
      ] },
      { id: 'praznik', lines: [
        'Svi idu na godišnji. Ja idem na godišnji čekanje.',
        'Zadnji put sam bio na moru kad je Hrvoje bio na regati.',
        'Ovo ljeto planiram: dva tjedna deploya i tri dana u bolovanju.'
      ] }
    ],
    guestFrozen: [
      'Ne mogu se pomaknuti. Ova priča je toksična.',
      'Molim te, netko ga isključi.',
      'Ja samo želim popiti kavu u miru...',
      'Sad znam više o Jiri nego o svojoj obitelji.',
      'Hrvoje, molim te! Reci mu nešto!'
    ],
    nodSuccess: [
      'Hvala što me slušaš. Već mi je bolje.',
      'Ti si jedini koji me razumije.',
      'Hvala, Hrvoje. Ti si kao terapeut. Samo jeftiniji.',
      'Mislim da sam dobio malo mira. Ili barem tišine.'
    ],
    nodFail: [
      'Nitko me ne sluša. Ni ti. Ni cura. Ni šef.',
      'Eto, čak ni Hrvoje ne klima. Sve je gotovo.',
      'Idem u Excel. Barem tamo znam gdje je greška.',
      'Ja sam nevidljiv. Kao logovi u produkciji.'
    ]
  },

  /* Česti popusi: nakon jadikovanja Hrvoje počasti Roka */
  comp: {
    start: 'a',
    nodes: {
      a: { who: 'hrvoje', text: 'Roko, ovaj je na račun kuće. Ali samo jer si ti.', next: 'b' },
      b: { who: 'roko', text: 'Ozbiljno?! Čekaj... daj mi POS na pet minuta. Ja ću ti to popraviti.',
        choices: [
          { text: 'Samo naprijed. Ali pazi na cijene.', next: 'c', tag: 'good', fx: { buff: 'hotfix' } },
          { text: 'Ne diraj sistem. Ionako radi. Uglavnom.', next: 'd', tag: 'ok' }
        ] },
      c: { who: 'roko', text: 'Root pristup... nisam ni pipnuo... Gotovo! Radi dvostruko brže. Ne pitaj me kako.',
        end: true, tag: 'good', fx: { buff: 'hotfix' } },
      d: { who: 'roko', text: 'Ma dobro. Ionako je sve zaključano, kao moj Jira board.', end: true, tag: 'ok' }
    }
  },
  hotfix: {
    durationSec: 45,
    announce: 'HOTFIX u produkciji! Roko drži palčeve.',
    lines: [
      'Roko: „Ne diraj ništa. Radi. Ne znam zašto.“',
      'Roko: „Deployano u petak. Znam, znam.“',
      'Roko: „Ako se sve sruši, ja sam već otišao.“',
      'Roko: „Radi na mojoj mašini.“'
    ],
    variants: [
      { id: 'pos_brzi', name: 'Brži POS', desc: 'Roko je pojačao POS. Trčiš 20% brže.', effect: { moveSpeedMult: 1.2 }, sec: 45 },
      { id: 'cache_clear', name: 'Očišćen cache', desc: 'Zelena zona za paljenje je šira.', effect: { lightZone: 0.15 }, sec: 45 },
      { id: 'refaktor', name: 'Refaktoriranje', desc: 'Svi imaju 25% više strpljenja. Nitko ne zna zašto.', effect: { patienceMult: 1.25 }, sec: 45 },
      { id: 'rollback', name: 'Rollback dima', desc: 'Roko je vratio prethodnu verziju zraka. Dim pada za 20.', effect: { smoke: -20 }, sec: 1 },
      { id: 'spaghetti', name: 'Spaghetti fix', desc: 'Sljedeća tri paljenja su automatski savršena.', effect: { autoLight: 3 }, sec: 60 }
    ]
  },

  noTip: [
    'Evo točno: bez napojnice. Znaš zašto.',
    'Napojnica? Ja sam napojnica. Hvala što me trpiš.',
    'Ne ostavljam napojnicu. Ostavljam sjećanje na sebe.',
    'Napojnica je bila u planu. Onda je došao najam.',
    'Kad postanem CTO, ostavljat ću napojnice za cijeli lounge.'
  ],
  phone: {
    girlfriend: [
      'Cura: „Gdje si?“',
      'Cura: „Rekao si da si tu za sat vremena. Prošla su tri.“',
      'Cura: „Ne trebaš dolaziti. Ostani na poslu. Kao i uvijek.“',
      'Cura: „Kupi kruh.“',
      'Cura: „Moramo razgovarati.“ (Roko: uh.)',
      'Cura: „Ma dobro, i ja tebe volim. Dođi kući.“'
    ],
    work: [
      'Slack: @Roko hitno! Prod je pao.',
      'Jira: „Roko, ticket 4732 čeka od utorka.“',
      'Mail: „Malo brže, molim, ovo je ASAP.“',
      'Šef: „Jesi li online?“ (Roko: ne. Hrvoje: da.)',
      'Sprint retro u petak u 17:45. Obavezno prisustvo.',
      'Novi zahtjev: „Može li se dodati jedan mali gumb?“ (mali je 2 mjeseca posla.)'
    ]
  },
  farewell: [
    'Hvala, Hrvoje. Ti si moj drugi terapeut. Prvi je Stack Overflow.',
    'Idem kući. Ako me netko pita, nisam bio ovdje.',
    'Vidimo se sljedeći put kad me otpuste. Ili kad dobijem plaću.'
  ]
};

/* ===================== MISLAV ===================== */
C.events.mislav = {
  ping: [
    'PING! Sonar: kontakt u bijelom kaputu. Oznaka: Mislav. Miris: parfem i ego.',
    'PING! Podmornica javlja: netko misli da je Bond. Ponavljam: misli.',
    'PING! Kožni humidor na horizontu. Mislav ga nosi kao pehar.',
    'PING! Ronilac u smokingu priplovio je do površine. Zaboravio je ronilačko odijelo.',
    'PING! Otkriven potpisni miris. Ime mi je Mislav. Dr. Mislav.'
  ],
  intro: {
    start: 'a',
    nodes: {
      a: { who: 'mislav', text: 'Ime mi je Mislav. Dr. Mislav. Ali za tebe, Hrvoje, samo Doktor.', next: 'b' },
      b: { who: 'hrvoje', text: 'Doktore, dobro došli. Znate gdje je vaš humidor.', next: 'c' },
      c: { who: 'mislav', text: 'Uvijek. Kao što znam gdje je meniskus. U koljenu.', next: 'd' },
      d: { who: 'hrvoje', text: 'Ordnung muss sein. Sjedite. Martini je na putu.', end: true }
    }
  },

  /* Bond kviz (mini izbor) */
  bondQuiz: {
    start: 'a',
    nodes: {
      a: { who: 'mislav', text: 'Hrvoje, pitanje za stručnjaka: tko je najbolji Bond?',
        choices: [
          { text: 'Sean Connery. Klasik.', next: 'connery', tag: 'ok' },
          { text: 'Daniel Craig. Vidim se u njemu.', next: 'craig', tag: 'best' },
          { text: 'Pierce Brosnan. Bez zadrške.', next: 'brosnan', tag: 'bad' }
        ] },
      connery: { who: 'mislav', text: 'Klasičan izbor. Ali ja sam više Craig. Uz malo Moorea. I još više mene.',
        end: true, tag: 'ok', fx: { tipBonus: 3 } },
      craig: { who: 'mislav', text: 'Konačno netko s ukusom! Craig je operirao koljeno poslije Spectrea. Ne kod mene, nažalost.',
        end: true, tag: 'best', fx: { tipBonus: 8, stars: 0.03 } },
      brosnan: { who: 'mislav', text: 'Brosnan? Ma daj. Ne vjerujem da to ozbiljno misliš. Kao ni ja za svoju frizuru.',
        end: true, tag: 'bad', fx: { tipBonus: -3 } }
    }
  },

  /* Tirada: tjera goste u blizini dok ne poslužiš Cohibu */
  tirade: {
    prompt: 'Mislav drži tiradu. Gosti oko njega bježe! Posluži mu Cohibu da ga utišaš!',
    durationSec: 20,
    lines: [
      'Dame i gospodo, dopustite da objasnim što je ACL. Prednja ukrižena sveza. Zvuči skandalozno, a nije.',
      'U operacijskoj sam kao Bond u kasinu: miran, elegantan i uvijek imam pravi instrument.',
      'Žene vole kad muškarac zna što radi. I koliko dugo. Operacija, naravno. Operacija.',
      'Jednom mi je sestra rekla: doktore, vi ste tako precizni. Ja: to je dar. Ona: mislila sam na račun.',
      'Bond ima Q. Ja imam Ž, instrumentarku Željku. Ne pitajte što je s njom.',
      'Koliko je koljenu potrebno? Puno pažnje. Ja sam stručnjak. Ne znam što ste vi mislili.',
      'Kad uđem u sobu, svi se okrenu. Nažalost, obično zato što sam se spotaknuo. Meniskus, znate.',
      'Zato pamtite: čvrsta cigara, čvrsto koljeno, čvrst stav. To je sve što imam za reći. Za sada.'
    ],
    guestReactions: [
      'Ovo je previše informacija.',
      'Idem ja na drugi kraj lounga.',
      'Ne gledaj me, ja samo pijem.',
      'Hrvoje, molim te, učini nešto!',
      'Doktore, ovdje se puši, ne operira.',
      'Mama je rekla da ne razgovaram sa strancima. Osobito s kirurzima.',
      'Ja idem. Sam. Bez meniskusa.'
    ],
    interruptSuccess: [
      'Ah... Cohiba. Sad se ne govori. Sad se uživa.',
      'Hrvoje, ti znaš zatvoriti operativno polje. Ovo je kao anestezija.',
      'Nemam riječi. A to je rijetkost.',
      'Bond bi bio ponosan. Ili bar tih.'
    ],
    interruptFail: [
      'Nije to Cohiba! Sad ću govoriti još glasnije!',
      'Ovo nije ono što mi treba! Nastavljam. Dakle: koljena.',
      'Tišina nije moj lijek. Ali cigara jest. Gdje je?'
    ],
    guestsLeave: [
      'Idem doma. Ovo je previše.',
      'Vratit ću se kad ovaj završi.',
      'Ja idem na WC. Ne, ja idem doma.',
      'Neću više. Dosta mi je i koljena i Bonda.'
    ],
    penaltyLeave: { stars: -0.1 }
  },

  /* Putni humidor */
  humidor: {
    desc: 'Mislavov kožni putni humidor stoji na stolu. Unutra: tri Cohibe i nula skrupula.',
    tree: {
      start: 'a',
      nodes: {
        a: { who: 'narrator', text: 'Mislav je otišao do šanka. Humidor stoji sam. Kirurška intervencija?',
          choices: [
            { text: 'Diskretan rez. Uzmi jednu cigaru.', next: 'go', tag: 'ok' },
            { text: 'Ne diraj. Ordnung muss sein.', next: 'no', tag: 'ok' }
          ] },
        go: { who: 'narrator', text: 'Ruka tiho klizi... a onda se čuje kašalj iza tebe.', roll: { p: 0.75, win: 'win', lose: 'caught' } },
        win: { who: 'narrator', text: 'Sterilno, bez krvi. Cigara je tvoja. Mislav ništa ne sluti.',
          end: true, tag: 'good', fx: { giveCigar: 'cigar_cohiba', flag: 'humidor_theft' } },
        caught: { who: 'mislav', text: 'Ja sam kirurg! Ja primijetim svaki rez!', next: 'c2' },
        c2: { who: 'hrvoje', text: 'Doktore, samo sam... brojao. Inventura.', next: 'c3' },
        c3: { who: 'mislav', text: 'Onda ćeš mi to i platiti. Kao pacijent.', end: true, tag: 'bad', fx: { cash: -15, stars: -0.05 } },
        no: { who: 'hrvoje', text: 'Ordnung muss sein. Humidor ostaje netaknut.', end: true, tag: 'ok', fx: { rep: 0.05 } }
      }
    },
    stealSuccess: [
      'Cohiba u džepu. Mislav ne primjećuje ni da mu je humidor lakši.',
      'Kirurška intervencija uspjela. Pacijent nije osjetio ništa.',
      'Jedna Cohiba manje, jedna zadovoljna savjest više. Otprilike.',
      'Bond bi rekao: misija ispunjena. Hrvoje kaže: inventura.'
    ],
    stealCaught: [
      'Ja sam kirurg! Ja primijetim svaki rez!',
      'Hrvoje! Ovo je humidor, a ne izložba!',
      'Znao sam! Moje instrumente uvijek znam brojati!',
      'Ovo ću zapisati u operacijski protokol: zabilježen pokušaj krađe.'
    ],
    leftBehind: [
      'Moj humidor! Gdje je moj humidor? Ah, tu je.',
      'Ostavio sam humidor. Hrvoje, čuvaj ga kao moje koljeno.',
      'Nemoj ga dirati. Ili diraj, ali samo pogledom.'
    ]
  },

  /* Besplatni „konzultacije“ za koljena: lova za gošću u blizini */
  kneeOffer: {
    lines: [
      'Gospodine, vi hodate malo nagnuto. To je lijevo koljeno. Mogu ga pogledati.',
      'Gospođo, vaše koljeno mi šapće. Treba mi samo pet minuta i dobro svjetlo.',
      'Ovdje je previše dima za dijagnozu. Ali ću pokušati.',
      'Ne brinite. Operativni zahvat je samo mala rupica. Kao ova rupa u zidu.'
    ],
    guestFlees: [
      'Ne, hvala! Ja se dobro osjećam!',
      'Hrvoje, gdje je WC?',
      'Ne treba mi pregled. Ja se bavim isključivo cigarama, hvala.',
      'Mislim da idem kući. Ili u bolnicu. Ili oboje.'
    ]
  },

  farewell: [
    'Doviđenja, Hrvoje. Zapamti: martini je protresen, a život je operiran.',
    'Odlazim. I neka bude jasno: ja sam ovdje bio, a Bond nije.',
    'Sutra imam ACL. Ne moj. Ali ja sam dobar. Kažu.'
  ]
};

/* ---------- EVENTI C: matija, tomislav ---------- */
C.events = C.events || {};

/* ===================== MATIJA ===================== */
C.events.matija = {
  ping: [
    'PING! Sonar: veliki objekt na vratima. Očekivati potres.',
    'PING! Podmornica javlja: kontakt širine dva vrata. Oznaka: Matija.',
    'PING! Otkriveno: rame. Pa još jedno rame. Pa Matija.',
    'PING! Tlak na vratima raste. Dovratnik se savija. Matija ulazi.',
    'PING! Vaga u prizemlju javlja neispravnost. Matija je stigao.'
  ],
  intro: {
    start: 'a',
    nodes: {
      a: { who: 'matija', text: 'Bok, Hrvoje! Ne, nisam na ničemu. Samo proteini, čaj i vjera.', next: 'b' },
      b: { who: 'hrvoje', text: 'Matija, nitko te nije pitao. Ali dobro. Sjedni. Pažljivo.', next: 'c' },
      c: { who: 'matija', text: 'Uvijek sjedam pažljivo. Fotelje koje ne pucaju su moj ljubavni jezik.', next: 'd' },
      d: { who: 'hrvoje', text: 'Ordnung muss sein. Espresso stiže.', end: true }
    }
  },

  /* Progress slike klijenata: zamrzava te ~3 s */
  progressPics: {
    prompt: 'Matija je izvadio mobitel: „Pogledaj ovog klijenta!“ Zamrznut si tri sekunde. Preskoči (E) uz malu cijenu.',
    freezeSec: 3,
    skipPenalty: { rep: -0.05 },
    tree: {
      start: 'a',
      nodes: {
        a: { who: 'matija', text: 'Hrvoje! Gledaj ovog klijenta! Minus 14 kila u osam tjedana! A tek je počeo!', freeze: 3,
          choices: [
            { text: 'Bravo, vidi se rad!', next: 'praise', tag: 'good' },
            { text: 'Matija, gost čeka narudžbu.', next: 'skip', tag: 'ok' },
            { text: 'A koliko je on na vitaminima?', next: 'joke', tag: 'bad' }
          ] },
        praise: { who: 'matija', text: 'Rad, znoj i vjera! Evo ti malo za kavu!', end: true, tag: 'good', fx: { tipBonus: 5 } },
        skip: { who: 'matija', text: 'Ništa, ništa. Nitko me ne cijeni. Osim pratitelja.', end: true, tag: 'ok', fx: { rep: -0.05 } },
        joke: { who: 'matija', text: 'Kakvi vitamini! Samo proteini, čaj i vjera! I još nekoliko stvari koje ne smijem spominjati.',
          end: true, tag: 'bad', fx: { tipBonus: -2 } }
      }
    },
    clients: [
      'Klijent A: minus 14 kila za 8 tjedana. „I tek je počeo!“',
      'Klijent B: plus 6 kila mišića. „A i ja sam ga pratio!“',
      'Klijent C: prije i poslije. „Prije je bio ovaj. Poslije sam ja.“',
      'Klijent D: „Došao je s bolovima u leđima, otišao je s bolovima u svim ostalim.“',
      'Klijent E: prije: 120 kila. Poslije: 75 kila. Ne pitajte gdje je otišlo 45.',
      'Klijent F: nema fotke. „Ne vjeruje u pozitivne reakcije.“',
      'Klijent G: „Ovaj mi je poslao sliku. Ne znam tko je. Ali izgleda sjajno.“',
      'Klijent H: „Ovaj je ja. Ali pod drugim imenom. Klijentom.“'
    ],
    skipLines: [
      'Baš si zaposlen. Poštujem. Ali boli.',
      'Nema veze. Slike će još biti tu. Kao moji mišići.',
      'Znaš, u moje vrijeme ljudi su gledali slike. Bez preskakanja.'
    ],
    watchLines: [
      'Vidiš kako je počeo ravno? Sad je kao kockica.',
      'Ovo su čisti geni. I malo mene.',
      'Ovo je rezultat dobrog trenera. Trenera, ne čarobnjaka.',
      'Pogledaj dobro. Ovo je budućnost. Moja.'
    ]
  },

  /* Recept za odrezak: slušaš do kraja = bonus napojnica */
  recipe: {
    prompt: 'Matija priča recept za odrezak. Sluša li se do kraja, napojnica je veća. Ili skoči (E).',
    tipBonusListen: 12,
    steps: [
      'Dakle, rib-eye. Ne iz hladnjaka: sat vremena na sobnoj temperaturi.',
      'Sol, samo sol. Papar tek nakon. Papar izgori. Kao moji živci.',
      'Tava od lijevanog željeza, 220 stupnjeva, malo ulja, ne maslinovog.',
      'Četiri minute s jedne strane. Ne diraj. Ne miči. Ne gledaj. Čekaj.',
      'Okreni. Puter, češnjak, timijan. Prelij. Kao da ga krstiš.',
      'Odmori meso koliko si ga pekao. Kao ja nakon nogu.',
      'Reži preko vlakna. Nikad uz. Ovo je nauka, ne umjetnost.',
      'Odrezak se ne kuha. Odrezak se doživljava. Kao cigara. Hrvoje to zna.'
    ],
    tree: {
      start: 'a',
      nodes: {
        a: { who: 'matija', text: 'Hrvoje, jesi li ikad pravio pravi odrezak? Sjedni, objasnit ću ti.',
          choices: [
            { text: 'Slušam. Do kraja.', next: 'listen', tag: 'good' },
            { text: 'Matija, gosti čekaju.', next: 'skip', tag: 'ok' }
          ] },
        listen: { who: 'matija', text: 'Rib-eye, sat na sobnoj, lijevano željezo, četiri minute i puter, puter, puter.', next: 'listen2' },
        listen2: { who: 'hrvoje', text: 'Kao cigara. Bez žurbe.', next: 'listen3' },
        listen3: { who: 'matija', text: 'Točno! Ti si jedini koji razumije! Evo napojnice!',
          end: true, tag: 'good', fx: { tipBonus: 12, flag: 'recipe_listened' } },
        skip: { who: 'matija', text: 'Dobro, dobro. Odrezak će čekati. Kao i moja tuga.', end: true, tag: 'ok', fx: { rep: -0.05 } }
      }
    },
    reaction: [
      'Da, da, znam. Ovo je najbolji recept u Zagrebu.',
      'Ne, ne, nema tajni. Sve je u puteru.',
      'Kaže moja majka: Matija, ti bi i vodu ispekao.'
    ],
    interrupted: [
      'Ne slušaš me. Nikad me nitko ne sluša. Osim mojih pratitelja.',
      'Dobro, dobro. Ali odrezak je već hladan.'
    ]
  },

  /* Nostalgija: „u moje vrijeme...“ */
  oldDays: {
    lines: [
      'Prije je u Zagrebu bila jedna teretana, i to u podrumu. Znoj, bez wifija.',
      'Kad smo mi trenirali, nije bilo shakeova. Bilo je jaje. Sirovo. I nada.',
      'Ma tko je ono bio... Tomo. Divljak. Dizao je bez remena i bez zdravog razuma.',
      'Prije je muškarac bio broj: koliko podiže. Sad je broj: koliko pratitelja.',
      'Imali smo jednu šipku za sve. Dijelili smo je. Kao život.',
      'Danas su svi u teretani u parovima. Mi smo bili sami. S boli.',
      'U moje vrijeme cigare nisu bile moda. Bile su... cigare.',
      'Kad sam bio mlad, majka mi je rekla: Matija, ti ćeš biti velik. Nije mislila samo na mišiće.'
    ]
  },

  /* Steroidni gag */
  steroids: {
    lines: [
      'Ja sam prirodan! Nikad ništa nisam uzeo. Osim kave. I nekoliko vitamina.',
      'To je genetika! Moj otac je imao sličan vrat. Ne, nije, ali bi imao.',
      'Moj hematokrit je bio 62. Doktor je rekao: to je normalno. Za medvjeda.',
      'Jedem šest obroka dnevno. Ne pitajte što jedem između njih.',
      'Prirodan je moje drugo ime. Prvo je Matija.',
      'Ako itko kaže steroidi, tužit ću ga. Ako itko kaže vitamin T, hoću i njega.',
      'Ja sam čist. Toliko čist da me kontrole ne pronalaze. Zato ih ne idem.',
      'Moj liječnik kaže da nikad nije vidio nešto ovakvo. Ne znam je li to kompliment.'
    ],
    hrvoje: [
      'Matija, tvoj vrat je veći od mog struka. To kineziologija ne preporučuje.',
      'Matija, prirodno ne ide uz vrat od 52 centimetra.',
      'Ordnung muss sein. A ovo nije Ordnung, ovo je farmakologija.'
    ],
    others: [
      'Roko: „Matija, tvoja fotelja moli za milost.“',
      'Mislav: „Ja bih to koljeno pregledao. Ali se bojim.“',
      'Tomislav: „Matija, ako ti dosadi bodybuilding, mogu ti prodati stan.“'
    ]
  },

  /* Fotelja pukne */
  armchair: {
    warn: [
      '*fotelja zaškripi*',
      'Fotelja ispušta zvuk koji nijedna fotelja ne smije ispuštati.',
      'Metal se savija. Koža stenje. Matija se smiješi.',
      'Proizvođač fotelja ovo nije predvidio u testu opterećenja.'
    ],
    broke: [
      'KRA-KRA-KRAK! Fotelja je preminula. Matija ostaje sjediti u zraku kao da se ništa nije dogodilo.',
      'Fotelja je pukla. Matija: „Bila je neispravna.“',
      'Još jedna fotelja pala u borbi. Protivnik: Matija.',
      'Fotelja se raspala. Ostao je samo miris kože i nečije ponosno rame.'
    ],
    reaction: [
      'To se događa i drugima! Fotelje danas nisu kao nekad!',
      'Ne brini, kupit ću ti novu. Kad se sjetim.',
      'Ma to je skladištenje energije! Fotelja je sad slobodna!',
      'Hrvoje, treća ovaj mjesec? Ja se ne sjećam.'
    ],
    hrvoje: [
      'Matija, treća ovaj mjesec. Ordnung.',
      'Zapisujem: fotelja broj sedam. Uz komentar: Matija.',
      'Fotelja je bila naša. Sada je uspomena.',
      'Nema problema. Ionako smo htjeli manje tapeciranog namještaja.'
    ]
  },

  farewell: [
    'Hvala, Hrvoje! Idem kuhati. Rib-eye. Dva. Ili tri.',
    'Sutra je Dan ruku. Ili leđa. Ili nogu. Ionako sve boli.',
    'Ostavi mi mjesto. I fotelju. Popravi je dok me nema.'
  ]
};

/* ===================== TOMISLAV ===================== */
C.events.tomislav = {
  ping: [
    'PING! Sonar: kontakt u polo majici. Oznaka: Tomislav. Miris: gel i kvadratura.',
    'PING! Podmornica javlja: otkrivena nekretnina na nogama. Ponavljam: nekretnina.',
    'PING! Signal: bekhend. Signal: lokacija, lokacija, lokacija. Tomislav.',
    'PING! Netko je izgovorio riječ padel. Tomislav je u blizini.',
    'PING! Zabilježen ego u rangu Wimbledona. Oznaka: Tomislav.'
  ],
  intro: {
    start: 'a',
    nodes: {
      a: { who: 'tomislav', text: 'Hrvoje! Dobra večer. Netko traži stan? Ili tenis? Ja sam obojica.', next: 'b' },
      b: { who: 'hrvoje', text: 'Tomislave, dobro došao. Konjak ili viski?', next: 'c' },
      c: { who: 'tomislav', text: 'Što god košta. Ali ne više od 900 tisuća.', next: 'd' },
      d: { who: 'hrvoje', text: 'Ordnung muss sein. Sjedni, sve je pod kontrolom.', end: true }
    }
  },

  /* Prodaja nekretnine: klađenje */
  pitch: {
    start: 'a',
    nodes: {
      a: { who: 'tomislav', text: 'Hrvoje, imam nešto samo za tebe. Stan od 40 kvadrata, samo 900 tisuća. Praktički poklon.',
        choices: [
          { text: 'Uzimam! Ali samo ako dobijem parking.', next: 'take', tag: 'ok' },
          { text: 'A može li se malo spustiti cijena?', next: 'haggle', tag: 'ok' },
          { text: 'Tomislave, ja imam Podmornicu. To je moj stan.', next: 'decline', tag: 'good' }
        ] },
      take: { who: 'tomislav', text: 'Odlično! Potpisujemo napojnicom. Uh, ugovorom!', roll: { p: 0.5, win: 'win', lose: 'lose' } },
      win: { who: 'tomislav', text: 'Ha! Provizija! Za tebe napojnica: 60 eura. Jer te volim.',
        end: true, tag: 'good', fx: { cash: 60 } },
      lose: { who: 'tomislav', text: 'Ups. Kupac je odustao. A provizija je... 40 eura. Ti plaćaš. Šalim se. Ne šalim se.',
        end: true, tag: 'bad', fx: { cash: -40 } },
      haggle: { who: 'tomislav', text: 'Pogađanje! To poštujem. Spuštam na 899 tisuća. Niže ne mogu: kvadrat je kvadrat.',
        roll: { p: 0.7, win: 'hwin', lose: 'hlose' } },
      hwin: { who: 'tomislav', text: 'Sjajno pogađanje! Za to ti dajem 25 eura napojnice. Bez provizije.',
        end: true, tag: 'good', fx: { cash: 25 } },
      hlose: { who: 'tomislav', text: 'Mmm, kupac je kratak s novcem. Naplaćujem ti 10 eura za trud.',
        end: true, tag: 'bad', fx: { cash: -10 } },
      decline: { who: 'tomislav', text: 'Ma razumijem. Ali ostavljam ti posjetnicu. Za dan kad shvatiš da si kupio krivo.',
        end: true, tag: 'good', fx: { tipBonus: 5 } }
    }
  },
  offers: [
    'Stan 40 m², Tkalčićeva, 900 000 €. Uključeno: buka.',
    'Garsonijera 22 m², Trešnjevka, 320 000 €. Pogled na susjeda.',
    'Podrum s potencijalom, 180 000 €. Potencijal: vlaga.',
    'Ured u centru, 12 m², 250 000 €. Prozor je nacrtan.',
    'Parking mjesto, Gornji grad, 65 000 €. Uz auto ide susjedova kletva.',
    'Vila s bazenom, Šestine, 2 400 000 €. Bazen je fontana.',
    'Ormar u Ilici, 18 000 €. Ali sa sobnom temperaturom.',
    'Terasa s pogledom na tuđu terasu, 95 000 €.'
  ],

  /* Tko je bio bolji: ja ili Ivanišević? */
  ivanisevic: {
    start: 'a',
    nodes: {
      a: { who: 'tomislav', text: 'Hrvoje, moraš biti iskren. Tko je bio bolji: ja ili Ivanišević?',
        choices: [
          { text: 'Ti, Tomislave. Nema šanse da je Goran bolji.', next: 'flatter', tag: 'ok' },
          { text: 'Goran je osvojio Wimbledon 2001.', next: 'truth', tag: 'best' },
          { text: 'A koliko si ti turnira osvojio?', next: 'nitpick', tag: 'bad' }
        ] },
      flatter: { who: 'tomislav', text: 'Znao sam da si čovjek od ukusa! Evo napojnica. I posjetnica.',
        end: true, tag: 'ok', fx: { tipBonus: 12 } },
      truth: { who: 'tomislav', text: 'Wimbledon? Bio je wild card! To je sreća! ... Ali dobro. Poštujem istinu. Uglavnom.',
        end: true, tag: 'best', fx: { stars: 0.05 } },
      nitpick: { who: 'tomislav', text: 'Turnira? Pa... nekoliko. Onih u glavi. Tvoja greška što pitaš.',
        end: true, tag: 'bad', fx: { tipBonus: -5 } }
    }
  },
  ivanisevicLines: [
    'Goran je imao servis. Ja sam imao stil. I bolje cipele.',
    'Wimbledon 2001? Netko je morao pobijediti. Što nije bio ja, to je zla sreća.',
    'Da sam ja igrao protiv Gorana, bio bi to najbolji meč u povijesti. Ali on nije htio.',
    'Goran je pjevao tijekom mečeva. Ja sam samo pobjeđivao. U glavi.',
    'Ne kažem da sam bolji. Kažem samo da sam bio bolji.'
  ],

  /* Padel: loptica leti po lounge-u, čaše pucaju */
  padel: {
    announce: 'Tomislav vadi padel lopticu iz džepa. Čuvaj čaše!',
    ballLines: [
      'Bum! Loptica odskače od šanka.',
      'Žuta loptica leti kroz Podmornicu. Dimne se maglice razmiču.',
      'Tomislav: „Zid je moj prijatelj! Udri o zid!“',
      'Bum! Bum! Bum! Loptica drži ritam.',
      'Loptica se zabila u bubble-panel. Plavi mjehurići se uznemirili.'
    ],
    glassBreak: [
      'ŠKLJOC! Čaša razbijena. Padel: 1, Hrvoje: 0.',
      'Još jedna čaša u prah. Tomislav pretvara lounge u teren.',
      'Čaša je bila skupa. Ali Tomislav ima kvadrate.',
      'Zvuk stakla. Gost pored: „Nadam se da to nije moja Cohiba.“'
    ],
    apology: [
      'Ups. Platit ću. Ne, neću. Ali svejedno ups.',
      'Znao sam da neće izdržati. Padel je nemilosrdan.',
      'Kad postanem vlasnik ovog lounga, čaše će biti od titana.',
      'Nemoj se ljutiti! To je za dobru stvar. Za sport.'
    ],
    dodge: [
      'Uh! Hrvoje se izmakao.',
      'Loptica je prošla pored uha. Kineziologija spašava.',
      'Skok ulijevo! Ordnung muss sein, čak i pod paljbom.'
    ],
    penalty: { cash: -8, stars: -0.02 }
  },

  farewell: [
    'Doviđenja, Hrvoje. Ne zaboravi: kvadrat je novo zlato.',
    'Idem na padel. Nemoj mi ništa reći, znam da ću pobijediti.',
    'Javi mi ako trebaš stan. Ili tenis. Ili oboje. Ali prvo stan.'
  ]
};

/* ---------- NOĆI: 5 scripted + endless ---------- */
/* t = minute nakon 16:00 (0..360). 22:00 = t 360. Shop rush = t 240 (20:00). */
C.nights = [
  /* ===== NOĆ 1: tutorial + Roko ===== */
  {
    n: 1,
    title: 'Ponedjeljak: Prvi zaron',
    day: 'Ponedjeljak',
    intro: 'Ponedjeljak, 16:00. Preuzimaš smjenu u Podmornici. Humidor je pun, ventilacija diše, a sonar na vratima ' +
      'će uskoro piskati. Ordnung muss sein: posluži goste, ne daj da dim pređe 70 i drži ocjenu od najmanje 4,0.',
    goal: 'Zaradi 70 € i zadrži ocjenu od najmanje 4,0.',
    goalCash: 70,
    goalStars: 4.0,
    bonusGoal: { text: 'Bonus: tri savršena paljenja.', stat: 'perfect', gte: 3, reward: { cash: 15 } },
    duration: 360,
    modifierName: 'Mirna večer',
    modifier: 'Mirna večer: gosti su strpljiviji, dim raste sporije. Idealno za učenje.',
    modifierFx: { patienceMult: 1.4, smokeRateMult: 0.8 },
    tips: [
      { t: 1, text: 'WASD ili strelice: hodaj. E ili razmak: uzmi i posluži.' },
      { t: 6, text: 'Gost stiže! Uzmi cigaru u humidoru (desno) i piće za šankom (lijevo).' },
      { t: 20, text: 'Nosiš najviše jednu cigaru i jedno piće. Odnesi ih gostu i pritisni E.' },
      { t: 34, text: 'Drži E i pusti u zelenoj zoni. Savršeno paljenje donosi napojnicu.' },
      { t: 48, text: 'Dim raste dok gosti puše. Ventilacija (gauge na zidu): E.' },
      { t: 92, text: 'Roko dolazi. Ima najjeftinije želje i najskuplje probleme.' },
      { t: 120, text: 'Hoyo i Caroni: Hrvojev izbor. Sparivanje donosi bonus.' },
      { t: 200, text: 'Kad dim pređe 70, gosti kašlju. Preko 100 dolazi inspekcija.' }
    ],
    spawns: [
      { t: 4, who: 'guest4', order: { cigar: 'cigar_robusto', drink: 'beer_tap' }, note: 'Prvi gost: pivo i robusto.' },
      { t: 30, who: 'guest2', order: { cigar: 'cigar_corona', drink: 'espresso' }, note: 'Espresso: aparat za kavu.' },
      { t: 58, who: 'guest1', order: { cigar: 'cigar_robusto', drink: 'whisky' }, note: 'Viski: žestice.' },
      { t: 88, who: 'roko', order: { cigar: 'cigar_cheap', drink: 'beer_tap' }, note: 'Roko prvi put u smjeni.' },
      { t: 118, who: 'guest3', order: { cigar: 'cigar_hoyo', drink: 'rum_caroni' }, note: 'Hrvojev izbor.' },
      { t: 150, who: 'guest4' },
      { t: 178, who: 'guest2' },
      { t: 205, who: 'guest1' },
      { t: 232, who: 'guest3' },
      { t: 258, who: 'guest4' },
      { t: 285, who: 'guest2' },
      { t: 312, who: 'guest1' }
    ],
    outro: 'Prva smjena iza tebe. Hrvoje briše šank i kaže: „Nije loše za prvi zaron.“ Roko je otišao s obećanjem da će platiti. ' +
      'Sutra dolaze komunalci.',
    outroGood: 'Google već bilježi prvu peticu. Ordnung muss sein.',
    outroBad: 'Nije ispalo idealno, ali Podmornica pluta. Humidor je preživio, a Roko je već u svom dugu.'
  },

  /* ===== NOĆ 2: baka + gejmeri ===== */
  {
    n: 2,
    title: 'Utorak: Komunalci i Arena',
    day: 'Utorak',
    intro: 'Utorak. Kiša udara po staklu, prozori su zatvoreni, dim se zadržava. Danas: baka koja zove komunalce ' +
      'i gejmeri iz GG Arene koji ne kupuju espresso. Baku smiri (E), gejmere zaustavi (Q).',
    goal: 'Zaradi 130 € i zadrži ocjenu od najmanje 4,0.',
    goalCash: 130,
    goalStars: 4.0,
    bonusGoal: { text: 'Bonus: zaustavi barem dva gejmera prije WC-a.', stat: 'gamersCaught', gte: 2, reward: { cash: 20 } },
    duration: 360,
    modifierName: 'Kišni utorak',
    modifier: 'Kišni utorak: prozori zatvoreni, dim raste 10% brže, ali svi ostaju duže.',
    modifierFx: { smokeRateMult: 1.1, patienceMult: 1.05 },
    tips: [
      { t: 45, text: 'Uskoro: baka. Priđi joj (E) i odaberi što joj kažeš.' },
      { t: 125, text: 'GG Arena upada! Q: „WC je samo za goste!“ Ili im prodaj espresso.' },
      { t: 190, text: 'Druga baka stiže. Ova nosi bundu i psića.' }
    ],
    spawns: [
      { t: 5, who: 'guest' }, { t: 18, who: 'guest2' }, { t: 32, who: 'guest1' }, { t: 46, who: 'guest4' },
      { t: 55, who: 'baka1', note: 'Baka Štefica. Priđi joj.' },
      { t: 70, who: 'guest3' }, { t: 85, who: 'guest' }, { t: 100, who: 'guest2' }, { t: 120, who: 'guest1' },
      { t: 135, who: 'gamers', count: 2, note: 'GG Arena upada.' },
      { t: 150, who: 'guest4' }, { t: 165, who: 'guest' }, { t: 180, who: 'guest3' },
      { t: 195, who: 'baka2', note: 'Gospođa Mira s bundom.' },
      { t: 210, who: 'guest2' }, { t: 225, who: 'guest' }, { t: 240, who: 'guest1' },
      { t: 255, who: 'gamers', count: 3, note: 'Drugi val gejmera.' },
      { t: 262, who: 'guest4' }, { t: 280, who: 'roko' }, { t: 290, who: 'guest3' }, { t: 305, who: 'guest2' },
      { t: 318, who: 'guest' }
    ],
    outro: 'Baka Štefica u župi priča kako je preživjela. Gejmeri su na Redditu objavili WC-review od tri zvjezdice. ' +
      'Hrvoje je proveo pola večeri između dima i toaleta.',
    outroGood: 'Komunalci nisu stigli, WC je čist, a gejmeri su platili espresso. Nikad ne reci nikad.',
    outroBad: 'Komunalci su bili tu. Netko je u WC-u ostavio tragove. Sutra ćeš trebati ventilaciju i strpljenje.'
  },

  /* ===== NOĆ 3: Mislav ===== */
  {
    n: 3,
    title: 'Srijeda: Bond večer',
    day: 'Srijeda',
    intro: 'Srijeda. Netko je u podne rezervirao stol: „Dr. Mislav, martini, protresen.“ Imaj Cohibu spremnu. ' +
      'Kad počne tirada, posluži mu cigaru. Ili kreni bježati. Ili kreni nešto između.',
    goal: 'Zaradi 260 € i zadrži ocjenu od najmanje 4,0.',
    goalCash: 260,
    goalStars: 4.0,
    bonusGoal: { text: 'Bonus: utišaj Mislavovu tiradu Cohibom.', stat: 'tiradeStopped', gte: 1, reward: { cash: 25 } },
    duration: 360,
    modifierName: 'Bond večer',
    modifier: 'Bond večer: napojnice veće 20%, ali gosti su nervozniji. Mislav ulazi kao da je Bond, a ne kao da je na sastanku.',
    modifierFx: { tipMult: 1.2, patienceMult: 0.9 },
    tips: [
      { t: 38, text: 'Mislav dolazi. Ostavlja humidor na stolu. Kirurška intervencija?' },
      { t: 110, text: 'Kad Mislav drži tiradu, gosti bježe. Posluži mu Cohibu da ga utišaš.' },
      { t: 250, text: 'Gejmeri opet dolaze. Q u pripravnosti.' }
    ],
    spawns: [
      { t: 6, who: 'guest1' }, { t: 20, who: 'guest3' }, { t: 34, who: 'guest' },
      { t: 40, who: 'mislav', order: { cigar: 'cigar_cohiba', drink: 'martini' }, note: 'Ime mi je Mislav. Dr. Mislav.' },
      { t: 55, who: 'guest2' }, { t: 70, who: 'guest4' }, { t: 84, who: 'guest' },
      { t: 100, who: 'roko' },
      { t: 115, who: 'guest3' }, { t: 130, who: 'guest1' }, { t: 145, who: 'guest2' },
      { t: 160, who: 'baka1', note: 'Baka Štefica se vraća.' },
      { t: 175, who: 'guest' }, { t: 200, who: 'guest4' }, { t: 215, who: 'guest3' },
      { t: 230, who: 'guest1' }, { t: 245, who: 'guest' },
      { t: 258, who: 'gamers', count: 2 },
      { t: 270, who: 'guest2' }, { t: 285, who: 'guest' }, { t: 300, who: 'guest4' }, { t: 315, who: 'guest3' }
    ],
    outro: 'Mislav je otišao s praznim humidorom i punim ponosom. Ostavio je napojnicu i stotinu bondovskih dosjetki. ' +
      'Nekoliko gostiju traži terapiju.',
    outroGood: 'Doktor je otišao zadovoljan. Protresen, ne miješan. Bond bi bio ponosan. Ili bar dužan.',
    outroBad: 'Doktor je otišao ljut. Sutra će napisati recenziju na tri stranice. S dvije fusnote.'
  },

  /* ===== NOĆ 4: Matija ===== */
  {
    n: 4,
    title: 'Četvrtak: Dan nogu',
    day: 'Četvrtak',
    intro: 'Četvrtak, Dan nogu. Matija ulazi, a fotelje se hvataju za naslone. Sjedne li pažljivo, dobit ćeš priču o odresku. ' +
      'Ne slušaš li, dobit ćeš progress sliku. Pazi na fotelje: jedna od njih neće preživjeti.',
    goal: 'Zaradi 320 € i zadrži ocjenu od najmanje 4,0.',
    goalCash: 320,
    goalStars: 4.0,
    bonusGoal: { text: 'Bonus: saslušaj Matijin recept do kraja.', stat: 'recipeListened', gte: 1, reward: { cash: 15 } },
    duration: 360,
    modifierName: 'Dan nogu',
    modifier: 'Dan nogu: teretane su prazne, lounge je pun. Gostiju ima 10% više.',
    modifierFx: { spawnRateMult: 1.1 },
    tips: [
      { t: 33, text: 'Matija dolazi. Fotelje mu nisu prijatelji. Ostavi mu sofu ako možeš.' },
      { t: 60, text: 'Kad izvadi mobitel: „Pogledaj ovog klijenta!“ E te oslobađa, ali košta ugleda.' },
      { t: 118, text: 'Gospođa Mira se vraća. S Bimbom.' }
    ],
    spawns: [
      { t: 5, who: 'guest' }, { t: 18, who: 'guest2' }, { t: 30, who: 'guest3' },
      { t: 35, who: 'matija', order: { cigar: 'cigar_robusto', drink: 'espresso' }, note: 'Matija: pazi na fotelju.' },
      { t: 50, who: 'guest2' },
      { t: 60, who: 'roko' },
      { t: 72, who: 'guest1' }, { t: 85, who: 'guest4' }, { t: 98, who: 'guest' }, { t: 110, who: 'guest3' },
      { t: 120, who: 'baka2', note: 'Gospođa Mira.' },
      { t: 132, who: 'guest2' }, { t: 145, who: 'guest' },
      { t: 150, who: 'gamers', count: 2 },
      { t: 165, who: 'guest1' }, { t: 178, who: 'guest4' }, { t: 190, who: 'guest3' }, { t: 205, who: 'guest' },
      { t: 210, who: 'mislav', note: 'Mislav dolazi na drugu rundu Bonda.' },
      { t: 222, who: 'guest2' }, { t: 235, who: 'guest1' }, { t: 248, who: 'guest' }, { t: 260, who: 'guest4' },
      { t: 275, who: 'guest3' }, { t: 288, who: 'guest2' }, { t: 300, who: 'guest' }, { t: 312, who: 'guest1' },
      { t: 322, who: 'guest4' }
    ],
    outro: 'Matija je otišao kuhati. Fotelja broj sedam traži odštetu. Progress slike su pregledane, recept je izdiktiran, ' +
      'a hematokrit je i dalje tajna.',
    outroGood: 'Preživio si Dan nogu bez više od jedne razbijene fotelje. To se zove menadžment.',
    outroBad: 'Fotelje su padale kao čunjevi. Matija je otišao zadovoljan. Ti si zapisao trošak na crtu.'
  },

  /* ===== NOĆ 5: finale — svi + shop rush + HOW gig ===== */
  {
    n: 5,
    title: 'Petak: Velika večer',
    day: 'Petak',
    intro: 'Petak. Nitko ne zna kako je pola Zagreba saznalo da je Podmornica otvorena, ali svi dolaze. ' +
      'U 20:00 zatvara Havana Shop preko ceste. U 22:00 čeka te pozornica: „HOW: The Hospitality Spark.“ ' +
      'Izdrži do kraja, a na govoru te čeka cigara.',
    goal: 'Zaradi 440 € i zadrži ocjenu od najmanje 4,0 do govora.',
    goalCash: 440,
    goalStars: 4.0,
    bonusGoal: { text: 'Bonus: posluži petero gostiju iz rusha bez ljutitog odlaska.', stat: 'rushHappy', gte: 5, reward: { cash: 40 } },
    duration: 360,
    modifierName: 'Petak, pun lokal',
    modifier: 'Petak, pun lokal: 15% više gostiju, napojnice 10% veće. Svi su došli. Doslovno svi.',
    modifierFx: { spawnRateMult: 1.15, tipMult: 1.1 },
    finale: 'how_gig',
    tips: [
      { t: 30, text: 'Tomislav dolazi. Ako izvadi lopticu za padel, sklanjaj čaše.' },
      { t: 235, text: 'Za pet minuta: Havana Shop zatvara. Očekuj gusto.' },
      { t: 240, text: 'PRELAZAK PREKO CESTE! Pet gostiju stiže odjednom.' },
      { t: 330, text: 'Još 30 minuta do govora. Dim pod kontrolom, ocjena visoko.' }
    ],
    spawns: [
      { t: 3, who: 'guest1' }, { t: 10, who: 'guest2' }, { t: 20, who: 'guest3' }, { t: 28, who: 'guest4' },
      { t: 36, who: 'tomislav', order: { cigar: 'cigar_cohiba', drink: 'cognac' }, note: 'Tomislav i padel.' },
      { t: 44, who: 'guest' }, { t: 55, who: 'guest2' },
      { t: 62, who: 'baka1', note: 'Baka Štefica: finale sezone.' },
      { t: 70, who: 'guest3' },
      { t: 80, who: 'roko' },
      { t: 90, who: 'guest1' }, { t: 100, who: 'guest4' },
      { t: 110, who: 'matija' },
      { t: 118, who: 'guest2' }, { t: 126, who: 'guest' },
      { t: 135, who: 'gamers', count: 2 },
      { t: 145, who: 'guest3' }, { t: 155, who: 'guest1' },
      { t: 165, who: 'mislav' },
      { t: 175, who: 'guest4' }, { t: 185, who: 'guest' },
      { t: 195, who: 'baka2' },
      { t: 205, who: 'guest2' }, { t: 215, who: 'guest3' }, { t: 225, who: 'guest1' },
      { t: 240, who: 'shopRush', count: 5, note: 'Havana Shop zatvara. Guste kolone.' },
      { t: 252, who: 'guest' },
      { t: 262, who: 'gamers', count: 3, note: 'Finalni napad GG Arene.' },
      { t: 270, who: 'guest4' }, { t: 278, who: 'guest2' }, { t: 290, who: 'guest3' },
      { t: 300, who: 'guest1' }, { t: 308, who: 'guest' }, { t: 316, who: 'guest2' }, { t: 324, who: 'guest4' }
    ],
    outro: 'Zadnji gost je otišao. Hrvoje skida pregaču, navlači bež guayaberu i izlazi u svjetlo pozornice. ' +
      'Sonar tiho pinga. Dim se razilazi. Ovo je bila najduža smjena. I najbolja.',
    outroGood: 'Petak preživljen. Sad, na pozornicu s cigarom.',
    outroBad: 'Petak je bio težak. Ali Hrvoje je Hrvoje: ide na pozornicu s cigarom i lijepim leđima.'
  }
];

/* ===== ENDLESS: Petak navečer ===== */
C.endless = {
  title: 'Petak navečer',
  intro: 'Petak navečer, opet. Podmornica se ne zatvara, komunalci ne spavaju, a Roko ima novi problem. ' +
    'Svaka večer bude malo gušća. Koliko izdržiš?',
  goal: 'Nema cilja. Samo dim, ocjena i preživljavanje.',
  scaling: { spawnRatePerNight: 0.08, smokeRatePerNight: 0.04, patiencePerNight: -0.02 },
  pool: [
    { who: 'guest', weight: 12 },
    { who: 'guest1', weight: 4 }, { who: 'guest2', weight: 4 }, { who: 'guest3', weight: 4 }, { who: 'guest4', weight: 4 },
    { who: 'roko', weight: 2 }, { who: 'mislav', weight: 1.5 }, { who: 'matija', weight: 1.5 }, { who: 'tomislav', weight: 1.5 },
    { who: 'baka1', weight: 1 }, { who: 'baka2', weight: 1 }, { who: 'gamers', weight: 1 }
  ],
  fixed: [{ t: 240, who: 'shopRush', count: 5 }],
  modifiers: [
    { id: 'kisa', name: 'Kišni petak', desc: 'Prozori zatvoreni, dim raste 15% brže.', fx: { smokeRateMult: 1.15 } },
    { id: 'placa', name: 'Dan plaće', desc: 'Gosti troše više, napojnice 20% veće.', fx: { tipMult: 1.2, patienceMult: 0.95 } },
    { id: 'turnir', name: 'Turnir u Areni', desc: 'GG Arena šalje dodatne gejmere. WC pod opsadom.', fx: { spawnRateMult: 1.1 } },
    { id: 'jesen', name: 'Jesenska sparina', desc: 'Nitko ne želi izaći. Svi puše duže.', fx: { smokeRateMult: 1.1, patienceMult: 1.1 } },
    { id: 'sezona', name: 'Sezona koncerata', desc: 'Gužva do zadnjeg trenutka. 20% više gostiju.', fx: { spawnRateMult: 1.2 } },
    { id: 'hladno', name: 'Zagrebačka zima', desc: 'Vani je hladno, unutra su svi. Fotelje su popunjene.', fx: { spawnRateMult: 1.15, tipMult: 1.1 } }
  ],
  outro: [
    'Još jedan petak iza tebe. Sonar pinga u snu.',
    'Podmornica je preživjela. Ti si preživio. Roko nije ništa platio.',
    'Sutra je subota. Ali ti si i dalje na smjeni.',
    'Havana 22: kad misliš da je gotovo, ono što je preostalo je ventilacija.'
  ]
};

/* ---------- UPGRADEI, EASTER EGGOVI, ACHIEVEMENTI, KRAJEVI ---------- */

/* effect: brojevi (*Mult = množitelj, ostalo = zbroj) ili bool. Vidi header. */
C.upgrades = [
  { id: 'zlatni_upaljac', name: 'Zlatni upaljač (Bond edition)', cost: 90, minNight: 1,
    desc: 'Zelena zona pri paljenju je veća. Zvuči kao Bond, radi kao upaljač.',
    effect: { lightZone: 0.12 } },
  { id: 'roko_pos', name: 'Rokov POS (radi, uglavnom)', cost: 80, minNight: 1,
    desc: 'Hotfix buffovi traju 50% dulje. Roko traži samo kavu za uzvrat.',
    effect: { hotfixMult: 1.5 } },
  { id: 'kamilica_za_bake', name: 'Čaj od kamilice za bake', cost: 90, minNight: 2,
    desc: 'Bake čekaju 8 sekundi dulje prije nego zovu komunalce.',
    effect: { bakaPatience: 8 } },
  { id: 'ortopedski_donovi', name: 'Kineziološki đonovi', cost: 100, minNight: 1,
    desc: 'Hodaš 12% brže. Kineziolog u tebi je ponosan.',
    effect: { moveSpeedMult: 1.12 } },
  { id: 'anc_slusalice', name: 'Slušalice s poništavanjem buke', cost: 100, minNight: 1,
    desc: 'Rokova jadikovanja i Matijini klijenti zamrzavaju te upola kraće.',
    effect: { rantFreezeMult: 0.5 } },
  { id: 'sonar_vrata', name: 'Sonar na vratima', cost: 110, minNight: 1,
    desc: 'Vidiš tko dolazi prije nego uđe. Gosti imaju 10% više strpljenja.',
    effect: { sonar: true, patienceMult: 1.1 } },
  { id: 'vent_mk2', name: 'Ventilacija Mk II', cost: 120, minNight: 1,
    desc: 'Jači ventilator: pročišćava više dima i hladi se šest sekundi brže.',
    effect: { ventCooldown: -6, ventPower: 15 } },
  { id: 'padel_mreza', name: 'Zaštitna mreža protiv padela', cost: 120, minNight: 5,
    desc: 'Tomislavljeva loptica razbija manje čaša. Malo manje. Ne puno.',
    effect: { padelProof: true } },
  { id: 'ojacane_fotelje', name: 'Ojačane fotelje (za Matiju)', cost: 130, minNight: 4,
    desc: 'Fotelje više ne pucaju pod Matijom. Matija je pomalo tužan.',
    effect: { armchairProof: true } },
  { id: 'wc_brava', name: 'Ploča „WC samo za goste“', cost: 140, minNight: 2,
    desc: 'Gejmeri se plaše. Q ima veći domet, a gejmeri sporije trče.',
    effect: { wcGuard: true } },
  { id: 'tanjur_cokolade', name: 'Tanjurić crne čokolade', cost: 150, minNight: 1,
    desc: 'Svako sparivanje automatski dobiva bonus od crne čokolade.',
    effect: { chocolateAuto: true } },
  { id: 'caroni_zaliha', name: 'Zaliha Caronija', cost: 160, minNight: 1,
    desc: 'Hrvojev izbor donosi dodatnih 8 € bonusa. Kapetan je zadovoljan.',
    effect: { hrvojevBonus: 8 } },
  { id: 'havana_club_kartica', name: 'Havana Club članska kartica', cost: 180, minNight: 2,
    desc: 'Članovi ostavljaju veće napojnice. 15% više.',
    effect: { tipMult: 1.15 } },
  { id: 'njemacki_filter', name: 'Njemački filter zraka', cost: 200, minNight: 2,
    desc: 'Ordnung muss sein, čak i u zraku. Dim raste 15% sporije.',
    effect: { smokeRateMult: 0.85 } },
  { id: 'humidor_hidrometar', name: 'Humidor s hidrometrom', cost: 250, minNight: 3,
    desc: 'Nosiš dvije cigare odjednom. Hidrometar drži 70 posto. Ti držiš tempo.',
    effect: { carryCigar: 1 } },
  { id: 'posluzavnik', name: 'Poslužavnik (Ordnung!)', cost: 250, minNight: 3,
    desc: 'Nosiš dva pića odjednom. Ravno, uspravno, bez prolijevanja.',
    effect: { carryDrink: 1 } }
];

/* ---------- EASTER EGGOVI ---------- */
C.easterEggs = [
  { id: 'liszt', trigger: 'interact:wall_quote',
    text: 'Na zidu piše: „Dobra cigara zatvara vrata podlostima života.“ Franz Liszt. Hrvoje je to pročitao tisuću puta i još se osjeća bolje.' },
  { id: 'kineziolog', trigger: 'idle:30',
    text: 'Hrvoje se ispravlja: leđa ravno, ramena dolje. Kineziolog ne spava nikad.' },
  { id: 'jedrilicar', trigger: 'random',
    text: 'Iz ventilacije dopire šum kao od jedara. Profesionalni jedriličar Hrvoje: „Vjetar 4 Bf, jugo. Savršeno za regatu. Ne za dim.“' },
  { id: 'golf', trigger: 'random',
    text: 'Hrvoje pokazuje gostu zamah: „Kukovi, kukovi, kukovi!“ Golf-fitness instruktor i za pauzu.' },
  { id: 'njemacka', trigger: 'interact:vent',
    text: 'Ordnung muss sein. Hrvoje se sjeća Njemačke: „Tamo bi ovaj ventilator imao TÜV certifikat.“' },
  { id: 'hrvojev_izbor', trigger: 'serve:cigar_hoyo+rum_caroni',
    text: 'Hoyo de Monterrey Double Corona i Caroni rum. Hrvojev posljednji izbor. Kad bi smio izabrati samo jedno za zadnji dim, bilo bi to.' },
  { id: 'crna_cokolada', trigger: 'serve:*+black_chocolate',
    text: 'Crna čokolada uz cigaru: Hrvojev savjet. Kao sidro za brod. Ne pitaj.' },
  { id: 'sancho_rozanic', trigger: 'serve:cigar_sancho',
    text: 'Sancho Panza Coronas Gigantes. Hrvoje se sjeća večere kod vinara Mladena Rožanića: cigara duža od zdravice.' },
  { id: 'podmornica_sonar', trigger: 'enter:any',
    text: 'Sonar pinga: kontakt na vratima. Recenzije kažu da je ovo Podmornica. Recenzije su u pravu.' },
  { id: 'podmornica_22', trigger: 'random',
    text: 'Adresa: Frankopanska 22. Dvadeset i dva metra ispod razine problema.' },
  { id: 'google', trigger: 'stat:stars>=4.5',
    text: 'Google: 4,5 zvjezdica na 805 recenzija. Ne pokvari to.' },
  { id: 'car_za_cigare', trigger: 'night:end',
    text: 'Nova recenzija: „Hrvoje je car za cigare.“ Hrvoje: „Skromno. Ali točno.“' },
  { id: 'recenzija_druzenje', trigger: 'night:end',
    text: 'Recenzija: „Cigare možete zapaliti, družiti se s ugodnim ljudima i dobro nasmijati.“ To radimo.' },
  { id: 'shop_20h', trigger: 'time:20:00',
    text: '20:00. Havana Shop preko ceste zatvara. Lounge prodaje cigare i kad je shop zatvoren, pa znaš što slijedi.' },
  { id: 'how_poster', trigger: 'interact:poster',
    text: 'Plakat: HOW — The Hospitality Spark. Meet the speaker: Hrvoje Koštić, Havana 22 manager. Hrvoje odmah namješta pozu s cigarom.' },
  { id: 'cigar_talk', trigger: 'random',
    text: 'Cigar Talk: Hrvoje je gostovao u intervjuu. Nitko ne zna što je rekao, ali svi klimaju.' },
  { id: 'havana_club', trigger: 'upgrade:havana_club_kartica',
    text: 'Havana Club članstvo: ekskluzivni klub unutar lounga. Pravila: nema pravila. Osim ventilacije.' },
  { id: 'privatni_najam', trigger: 'random',
    text: 'Lounge se može iznajmiti za privatne večeri. Mislav je već pitao. Roko još ne može platiti.' },
  { id: 'mjesecni_dogadjaji', trigger: 'random',
    text: 'Na oglasnoj ploči: mjesečni događaj. Ovaj mjesec: „Cigara i rum: sve što niste znali.“' },
  { id: 'humidor_zemlje', trigger: 'interact:humidor',
    text: 'Humidor: Kuba, Dominikana, Nikaragva. Kao putovanje oko svijeta bez putovnice.' },
  { id: 'skola_cigara', trigger: 'random',
    text: 'Hrvoje vodi škole i radionice o cigarama. Danas: kako se drži cigara. Nitko ne zna. Svi slušaju.' },
  { id: 'edison', trigger: 'interact:lightbulb',
    text: 'Edison žarulja trepće. Netko je rekao da je ovo najljepše svjetlo u Zagrebu. Slažemo se.' },
  { id: 'bubble_panel', trigger: 'interact:bubble_panel',
    text: 'Plavi zid s mjehurićima. Kad ga dugo gledaš, počneš vidjeti ribe. Ili Rokove brige.' },
  { id: 'lustar', trigger: 'interact:chandelier',
    text: 'Luster pri ulazu. Bakar i staklo. Svaki put kad sonar pingne, malo zatitra.' },
  { id: 'konzultant', trigger: 'random',
    text: 'Hrvoje je cigar consultant. Jedini savjetnik koji ne naplaćuje savjet, samo cigaru.' },
  { id: 'velebitsko', trigger: 'serve:*+beer_velebitsko',
    text: 'Velebitsko pivo i cigara. Nema ljepšeg domaćeg kombiniranja.' },
  { id: 'tepih', trigger: 'interact:rug',
    text: 'Okrugli jute tepih. Hrvoje ga poravnava svaki put kad netko preskoči rub.' },
  { id: 'zatvaranje', trigger: 'time:22:00',
    text: '22:00. Zatvaramo. Sonar utihne. Ventilator još diše.' },
  { id: 'osam_i_cetrdeset', trigger: 'stat:night>=3',
    text: 'Hrvoje ima 48 godina. Kineziolog tvrdi da su mu koljena stara 35. Mislav se nudi da ih pregleda. Hrvoje odbija.' },
  { id: 'regata', trigger: 'random',
    text: 'Hrvoje zamišlja regatu. Ventilator zvuči kao jedra. Roko zvuči kao oluja.' },
  { id: 'sinatra', trigger: 'random',
    text: 'Sinatra bi rekao: „Alkohol je čovjekov najgori neprijatelj, ali Biblija kaže: ljubi svog neprijatelja.“ Konjak se slaže.' },
  { id: 'edward', trigger: 'random',
    text: 'Kralj Edward VII. je jednom rekao: „Gospodo, možete pušiti.“ Hrvoje to svakoj večeri kaže na vratima.' },
  { id: 'churchill', trigger: 'random',
    text: 'Churchillu se pripisuje recept za dugovječnost: cigare, viski i nikakav sport. Hrvoje, kineziolog, uzima samo dva od tri.' },
  { id: 'roko_petak', trigger: 'enter:roko',
    text: 'Roko: „Deployao sam u petak.“ Hrvoje: „Zato si ovdje?“ Roko: „Da.“' },
  { id: 'davidoff', trigger: 'random',
    text: 'Zino Davidoff bi rekao da se cigara ne požuruje. Hrvoje kaže da se ni gost ne požuruje. Ali ventilacija, ona ne čeka.' }
];

/* ---------- ACHIEVEMENTI ---------- */
C.achievements = [
  { id: 'prvi_dim', name: 'Prvi dim', desc: 'Posluži prvog gosta.', cond: { stat: 'served', gte: 1 } },
  { id: 'savrsena_vatra', name: 'Savršena vatra', desc: 'Prvo savršeno paljenje.', cond: { stat: 'perfect', gte: 1 } },
  { id: 'zlatna_ruka', name: 'Zlatna ruka', desc: 'Deset savršenih paljenja.', cond: { stat: 'perfect', gte: 10 } },
  { id: 'hrvojev_izbor', name: 'Hrvojev izbor', desc: 'Posluži Hoyo de Monterrey Double Corona i Caroni rum.', cond: { stat: 'hrvojevIzbor', gte: 1 } },
  { id: 'crna_kao_noc', name: 'Crna kao noć', desc: 'Pet sparivanja s crnom čokoladom.', cond: { stat: 'chocolatePairings', gte: 5 } },
  { id: 'baka_diplomat', name: 'Diplomat', desc: 'Obje bake izađu bez skandala.', cond: { stat: 'bakaBest', gte: 2 } },
  { id: 'komunalci', name: 'Komunalci su stigli', desc: 'Ignoriraj baku dok ne nazove komunalce.', cond: { stat: 'bakaIgnored', gte: 1 } },
  { id: 'wc_cuvar', name: 'Čuvar WC-a', desc: 'Zaustavi pet gejmera prije WC-a.', cond: { stat: 'gamersCaught', gte: 5 } },
  { id: 'espresso_biznis', name: 'Espresso biznis', desc: 'Prodaj espresso gejmerima prije WC-a.', cond: { stat: 'gamersEspresso', gte: 1 } },
  { id: 'hotfix', name: 'Hotfix u produkciji', desc: 'Počasti Roka i dobij hotfix.', cond: { stat: 'hotfixes', gte: 1 } },
  { id: 'na_crtu', name: 'Na crtu', desc: 'Roko duguje 60 € ili više.', cond: { stat: 'rokoDebt', gte: 60 } },
  { id: 'kirurska_intervencija', name: 'Kirurška intervencija', desc: 'Uzmi cigaru iz Mislavova humidora.', cond: { stat: 'humidorThefts', gte: 1 } },
  { id: 'licenca_za_posluzivanje', name: 'Licenca za posluživanje', desc: 'Pet savršenih dostava Mislavu.', cond: { stat: 'mislavPerfect', gte: 5 } },
  { id: 'utisana_tirada', name: 'Cohiba na kraju tirade', desc: 'Utišaj Mislava Cohibom.', cond: { stat: 'tiradeStopped', gte: 1 } },
  { id: 'dan_nogu', name: 'Dan nogu', desc: 'Matija razbije prvu fotelju.', cond: { stat: 'armchairsBroken', gte: 1 } },
  { id: 'pogledaj_klijenta', name: 'Pogledaj ovog klijenta!', desc: 'Pogledaj sve Matijine progress slike.', cond: { stat: 'progressPicsSeen', gte: 8 } },
  { id: 'bolji_od_ivanisevica', name: 'Bolji od Ivaniševića?', desc: 'Odgovori Tomislavu istinom o Wimbledonu.', cond: { stat: 'ivaniseviBest', gte: 1 } },
  { id: 'padel_stete', name: 'Padel štete', desc: 'Padel loptica razbije tri čaše.', cond: { stat: 'padelGlasses', gte: 3 } },
  { id: 'zaron_99', name: 'Zaron na 99', desc: 'Dim dosegne 99, a ti izdržiš.', cond: { stat: 'smokePeak99', gte: 1 } },
  { id: 'ventilacijski_majstor', name: 'Ventilacijski majstor', desc: 'Pročisti zrak deset puta u jednoj večeri.', cond: { stat: 'ventsInNight', gte: 10 } },
  { id: 'preko_ceste', name: 'Prelazak preko ceste', desc: 'Preživi Havana Shop rush u 20:00.', cond: { stat: 'rushDone', gte: 1 } },
  { id: 'cetiri_pet_od_805', name: '4,5 od 805', desc: 'Završi večer s ocjenom 4,5 ili više.', cond: { stat: 'nightStars45', gte: 1 } },
  { id: 'ordnung', name: 'Ordnung muss sein', desc: 'Završi večer bez ijedne krive dostave.', cond: { stat: 'nightNoWrong', gte: 1 } },
  { id: 'sonar_aktivan', name: 'Sonar aktivan', desc: 'Deset PING-ova na vratima.', cond: { stat: 'pings', gte: 10 } },
  { id: 'car_za_cigare', name: 'Car za cigare', desc: 'Prođi svih pet noći.', cond: { stat: 'nightsDone', gte: 5 } },
  { id: 'how_spark', name: 'The Hospitality Spark', desc: 'Održi govor na pozornici s cigarom.', cond: { stat: 'finale', gte: 1 } },
  { id: 'petak_navecer', name: 'Petak navečer', desc: 'Preživi prvu večer u beskonačnom načinu.', cond: { stat: 'endlessNights', gte: 1 } },
  { id: 'skoro_milijunas', name: 'Skoro milijunaš', desc: 'Ukupno zaradi 1000 €.', cond: { stat: 'totalCash', gte: 1000 } }
];

/* ---------- KRAJEVI ---------- */
C.endings = {
  win: 'Pet noći iza tebe. Podmornica pluta, Google drži 4,5 zvjezdica, a Hrvoje je car za cigare. ' +
    'Roko još nije platio crtu, Mislav je ostavio humidor, a Matija je platio fotelje. Nastavljaš u Petak navečer?',
  winTitle: 'Kapetan Podmornice',
  fail_smoke: 'INSPEKCIJA! Dim je predugo bio iznad 100. Komunalci ulaze s mjeračima, baka Štefica maše u pozadini, ' +
    'a Hrvoje šapće: „Ordnung muss sein.“ Sonar pinga po zadnji put.',
  fail_smokeTitle: 'Komunalci su stigli',
  fail_stars: 'Google ocjena je pala na nulu. Recenzije: „Dim“, „Predugo čekanje“, „Nisu ni espresso kupili.“ ' +
    'Ali Hrvoje se ne predaje. Sutra je novi dan, a humidor je još pun.',
  fail_starsTitle: 'Nula zvjezdica',
  finale: 'Petak, 22:00. Pozornica, reflektor i plakat: HOW — The Hospitality Spark. Hrvoje Koštić, manager Havane 22, ' +
    'drži govor s cigarom u ruci. Sonar tiho pinga u pozadini.',
  finaleTitle: 'HOW — The Hospitality Spark',
  finaleScript: [
    { who: 'narrator', text: 'Petak, 22:00. Svjetla u dvorani se gase. Na plakatu piše: HOW — The Hospitality Spark.' },
    { who: 'narrator', text: 'Meet the speaker: Hrvoje Koštić. Cigar lounge, Havana 22 manager.' },
    { who: 'hrvoje', text: 'Dobra večer. Ja sam Hrvoje. Kineziolog, jedriličar, golf-fitness instruktor i, evo, manager jednog lounga.' },
    { who: 'hrvoje', text: 'Odrastao sam u Njemačkoj. Tamo sam naučio jedno: Ordnung muss sein.' },
    { who: 'hrvoje', text: 'Gostoprimstvo je kao ventilacija: znaš kad pustiti dim, a kad zadržati mir.' },
    { who: 'hrvoje', text: 'Mislav je tvrdio da je Bond. Matija je slomio ovu stolicu. Tomislav mi je prodao stan. U mašti.' },
    { who: 'hrvoje', text: 'Roko je rekao da će platiti crtu. Vjerujem mu. Vrijeme će pokazati.' },
    { who: 'hrvoje', text: 'Hoyo de Monterrey Double Corona i Caroni rum. Moj posljednji izbor. Crna čokolada je sidro.' },
    { who: 'hrvoje', text: 'Dobra cigara zatvara vrata podlostima života. To nije moje. To je Liszt. Ali potpisujem.' },
    { who: 'narrator', text: 'Dvorana pljeska. Negdje u zadnjem redu netko šapće: „Hrvoje je car za cigare.“' },
    { who: 'narrator', text: 'Sonar pinga. Podmornica čeka. Sutra je nova smjena.' }
  ],
  credits: [
    'HAVANA 22 — Večernja smjena',
    'Igra za prijatelje. Bez ozbiljnih namjera.',
    'Hvala Hrvoji, Roku, Mislavu, Matiji i Tomislavu na inspiraciji i strpljenju.',
    'Hvala Podmornici na Frankopanskoj 22.',
    'Ordnung muss sein.'
  ]
};


})(window.CONTENT);
