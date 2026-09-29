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
