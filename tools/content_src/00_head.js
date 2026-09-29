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
