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
