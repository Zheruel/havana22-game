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
