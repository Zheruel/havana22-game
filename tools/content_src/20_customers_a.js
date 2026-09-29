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
