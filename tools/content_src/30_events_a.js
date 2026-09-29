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
