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
