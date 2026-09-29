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
