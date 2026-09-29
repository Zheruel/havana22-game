# HAVANA 22 — "Večernja smjena" (Night Shift)

Browser game about the Havana 22 Cigar Lounge, Frankopanska 22, Zagreb. Player = **Hrvoje Koštić**, manager. Croatian UI/text only. Tone: affectionate roast among friends, absurd, fast, funny. Shift = 16:00–22:00 (real opening hours per owner).

Everything runs from `game/index.html` by double-click (file://): **classic `<script>` tags, no ES modules, no fetch/XHR**. Data files are JS assigning `window.*` globals. Canvas 1280×720, scaled to fit window, `image-rendering: pixelated`.

## Ownership (no agent edits another's files)
| Owner | Files |
|---|---|
| engine | `game/index.html`, `game/style.css`, `game/src/*.js` |
| content | `game/content/content.js` |
| art-env | `game/assets/bg/*`, `game/assets/icons/*`, `game/content/layout.js`, `game/content/icons.js`, `tools/env_*` |
| art-chars-A/B/C/D | `game/assets/chars/<id>.png`, `game/assets/portraits/<id>_*.png`, `game/content/atlas_<A|B|C|D>.js`, `tools/chars_<A|B|C|D>/*` (A: hrvoje roko · B: mislav matija · C: tomislav baka1 baka2 · D: gamer1 gamer2 guest1-4) |
| integrator | anything, last |

Shared: `reference/` (read-only), `tools/.venv` (Python with Pillow+numpy; use `tools/.venv/bin/python`). Scratch/prompt files go in the session scratchpad, finals in the project.

## Look
Pixel-art / pixel-painting, warm and moody. **Submarine-steampunk lounge** (reviewers literally call it "Podmornica"): riveted copper/rust panels, exposed steel beams & ducts, gauges, pipes, Edison bulbs, blue-lit bubble-panel screens, brown leather sofas, mid-century armchairs, round jute rug, plants. Palette: copper/amber/brown with electric-blue accents. Reference photos: `reference/lounge/A9060.jpg`, `A9142.jpg`, `A9286.jpg` (official lounge photos — match materials, colours, furniture). View: 3/4 top-down RPG (Stardew-like): back wall visible on top, floor, glass shop-front at bottom.

## World layout (1280×720) — best inference from photos, `layout.js` is the source of truth
Real facts: glass shop-front with "HAVANA 22" sign + chandelier at the entrance end; long back bar with lit shelves, rusty-copper bar front, stools; blue bubble-panel screens; arched alcove on the right wall = "neobičan humidor" that armchairs overlook; leather sofas + mid-century armchairs + low tables on a round rug; wall gauges/clocks. Toilet position is unknown → back wall top-right.

- Back wall y 0–150: bar shelves (x40–620) with bottles, blue bubble panel (x700–860), **WC door** (x960–1040), wall gauge panel (x~880, "Ventilacija").
- Bar: walk-behind band y150–195, counter y195–245 (x60–620), 5 stools y~270. Open gap x620–680 to walk behind the bar.
- Humidor arch on right wall x1140–1240, y190–390.
- Seating: left sofa (3 seats, x40–150,y330–530), tables T1(290,410) T2(560,470) T3(800,400) T4(1000,440) each with 2 armchairs left/right, front-right leather banquette (2 seats) y~570. Round rug ~(640,450).
- Entrance: glass door bottom, x760–900 gap, street visible through glass strip at bottom (y640–720). NPCs spawn at (830,700).
- Across the street (visible through glass / referenced in text): gaming-tournament venue "GG ARENA", and the sister **Havana Shop** (closes 20:00 → rush of customers "prelazi preko ceste").

`layout.js` schema (`window.LAYOUT`): `{width,height, walls:[{id,x,y,w,h}], tables:[{id,x,y,r}], seats:[{id,table,x,y,face:'left|right|up|down',kind}], spots:{humidor,tap,spirits,coffee,vent,wc_door,door,...:{x,y}}, spawn:{door:{x,y},inside:{x,y}}, playerStart:{x,y}, nav:{cell:20}}`. Seat x,y = where the seated character's feet/anchor go. Art-env adjusts coordinates to match the final painted plate (within reason) and keeps the schema.

## Gameplay — night-shift sim
Controls: WASD/arrows move, **E/Space** interact, **Q** shout ("Stani! / Izlazite!"), **Esc** pause, **M** mute. `?debug=1` draws layout/nav/hitboxes.

Clock: 16:00→22:00, 1 game-minute ≈ 1.0 real second (≈6 min/night). HUD: clock, € cash, ★ Google rating (start 4.5, real listing is 4.5★/805 reviews), smoke meter, carried items, night goal.

Carry: max 1 cigar + 1 drink. Pick cigar at **humidor** (menu popup 1–5), drinks at **tap/spirits/coffee** spots behind the bar.
Customer loop: enters via door → walks (A* on nav grid, walls+tables blocked) to a free seat → order bubble (icons: cigar + drink, patience bar) → player delivers matching items → **lighting mini-game** (hold E, release in green zone; perfect = tip) → guest smokes N sec (adds smoke) → pays + tip → leaves. **Pairing bonus** for combos in `content.pairings` (e.g. Hoyo de Monterrey Double Corona + Caroni rum = "Hrvojeov izbor", crna čokolada bonus).
Smoke: each smoking guest raises it; interact with **vent** gauge to purge (cooldown 20 s; upgradable). >70 guests cough + patience drains faster; >100 for 10 s = "Inspekcija" → night failed. Stars drop on angry leaves, rise on happy ones; stars 0 = game over.
Night ends 22:00: summary (money, stars, stats, best joke), then **upgrade shop** (money → upgrades from `content.upgrades`), then next night. 5 scripted nights + endless "Petak navečer". Save progress in localStorage (try/catch, works without).

Events (all in `content.events`, engine implements generic runners):
1. **Baka (old lady) complains about smoke** — enters, walks to table, complains; you must walk to her + E → 3-choice dialogue (one best, one ok, one bad) → escorted out ("Ovo je cigar lounge, gospođo!"). Ignored 15 s → she "zove komunalce": −★ and smoke penalty. Variants baka1/baka2.
2. **GG Arena gamers sneak to the WC** — 2–3 teens in esports jerseys enter and beeline to the WC door. Stand in their way / press **Q** in range ("WC je samo za goste!") → they bolt out laughing. If one reaches WC he occupies it 15 s and leaves −★ ("nisu ni espresso kupili"). Option: sell them an espresso first → allowed, +€.
3. **20:00 Shop rush** — Havana Shop closes, 4–5 customers arrive at once.
4. **Regulars** (each has an entrance sonar "ping", portrait dialogue, unique quirk):
   - **Roko** (PMF software engineer, broke, complains about girlfriend + job): orders cheapest, asks for "na crtu" (tab). Quirk: whining rant freezes a nearby guest's patience unless you nod (E) — pays with pity: if you comp him you get a random "hotfix" buff (he fixes the POS = speed buff). Never tips.
   - **Mislav** (controversial knee surgeon, sexist/sex jokes, Bond fan, always brings a leather travel humidor): orders Bond-ish (martini/whisky + premium cigar); leaves his humidor on the table (collectible — steal one cigar for free "kirurška intervencija"). His **tirade** drives nearby guests away unless you interrupt by serving him a Cohiba (game satirises him; jokes are cheeky, never hateful — keep sex jokes innuendo-level; the *joke is on him*).
   - **Matija** (old bodybuilder, "on huge amounts of steroids" as a running gag, misses the old days, loves cooking, always on phone with clients' progress pics): sits, shows you progress pics (freezes you ~3 s "Pogledaj ovog klijenta!") — skip with E for a small rep loss; loves espresso + steak talk (recipe rant = bonus tip if you listen). Crushes armchairs (an armchair breaks → seat unavailable rest of night).
   - **Tomislav** (highly controversial tennis player turned real-estate mogul, loves padel, claims he was better than Ivanišević): pitches you real estate ("stan 40 m² samo 900k"); accept/decline → gamble (big tip or a fee). Padel ball bounces around the lounge and breaks glasses. Insists he was better than Ivanišević — dialogue trivia mini-choice.
5. Random Easter eggs from `content.easterEggs`.

Nights: N1 tutorial + Roko · N2 baka + gamers · N3 Mislav · N4 Matija · N5 Tomislav + Shop rush + everyone (finale: "HOW – The Hospitality Spark" speaker gig cutscene, Hrvoje on stage with a cigar — from the poster) · then endless.

## Easter eggs / lore to weave in (real)
Hrvoje: 48, kinesiologist, professional sailor, golf-fitness instructor, grew up in Germany ("Ordnung muss sein"), cigar consultant, runs cigar schools/workshops; "final choice": Hoyo de Monterrey Double Corona + Caroni rum; black chocolate pairs well; once smoked Sancho Panza Coronas Gigantes at winemaker Mladen Rožanić's dinner. Wall quote (Franz Liszt): "Dobra cigara zatvara vrata podlostima života." Site quotes: Sinatra, Zino Davidoff, George Burns, Mark Twain, Churchill, King Edward, Joan Collins. Menu seen: Velebitsko pivo, točeno pivo (Laško), Fax? beer cans on menu; Google 4.5★ (805), "Podmornica", "Hrvoje je car za cigare", "cigare možete zapaliti, družiti se s ugodnim ljudima i dobro nasmijati" (review), shop across the street closes at 20:00 and the lounge sells cigars when shop is closed, Havana Club membership, private club rental, "Cigar Talk" interview, Cuban/Dominican/Nicaraguan (icons), monthly events.

## Asset contract
World characters: **atlas PNG 384×768** = 4 cols × 6 rows of **96×128** cells, transparent, feet bottom-centre (anchor 48,124), same scale per character (~56×88 visible).
Rows: 0 walk_down · 1 walk_left · 2 walk_right · 3 walk_up (4 frames each; frame 0 = idle) · 4 `sit_down, sit_left, sit_right, sit_up` · 5 = special poses `[talk_rant, smoke, special1, special2]` (character-specific: see `content.customers[id].specials`).
`atlas_<X>.js` (A..D): `window.CHAR_ATLAS = Object.assign(window.CHAR_ATLAS||{}, { hrvoje:{src:'assets/chars/hrvoje.png', w:96,h:128,cols:4, anchor:[48,124], anims:{walk_down:[0,1,2,3],walk_left:[4,5,6,7],walk_right:[8,9,10,11],walk_up:[12,13,14,15], sit_down:[16],sit_left:[17],sit_right:[18],sit_up:[19], talk:[20], smoke:[21], special1:[22], special2:[23]}} })` (frame index = row*4+col).
Portraits: `assets/portraits/<id>_neutral.png` and `<id>_angry.png` 256×256 bust, transparent, pixel-art caricature. `window.PORTRAITS = Object.assign(window.PORTRAITS||{}, {id:{neutral:'assets/portraits/..',angry:'..'}})` — put it in the same atlas_<X>.js.
Char ids: `hrvoje roko mislav matija tomislav baka1 baka2 gamer1 gamer2 guest1 guest2 guest3 guest4` (extras: same atlas format, portraits optional — baka1/2 need portraits).
Icons: `assets/icons/<name>.png` 64×64 transparent + `game/content/icons.js` → `window.ICONS = {name:'assets/icons/<name>.png'}`. Required names: `cigar_robusto cigar_corona cigar_cohiba cigar_hoyo cigar_sancho cigar_cheap rum_caroni whisky cognac beer_tap beer_velebitsko espresso martini black_chocolate star star_empty smoke_puff warning euro speech lighter cutter humidor_key`.
Background: `assets/bg/lounge.png` exactly 1280×720 (also `lounge_dark.png` optional night tint not required), `assets/bg/street_strip.png` optional 1280×80 for glass view, `assets/bg/title.png` 1280×720 title screen art (game logo "HAVANA 22 — Večernja smjena" verbatim).
Missing assets must never crash the engine: draw coloured placeholder boxes.

## Content contract — `window.CONTENT` (Croatian)
`{title, tagline, loadingQuotes:[{q,who}], menu:{cigars:[{id,name,price,cost,icon,desc}], drinks:[{id,name,price,cost,icon,source:'tap|spirits|coffee',desc}]}, pairings:[{cigar,drink,bonus,line}], customers:{<id>:{name,short,bio,orders:[{cigar,drink}],patience,tip,lines:{enter[],order[],waiting[],served_good[],served_bad[],leave_happy[],leave_angry[],rant[]},specials:{talk,smoke,special1,special2},portraitNote}}, events:{baka:{intro,complaints[],choices:[{text,result:'best|ok|bad',reply}],ignored},gamers:{enter[],caught[],reachedWC[],espresso[]},shopRush:{lines[]}, roko,mislav,matija,tomislav:{...beats/dialogue trees...}}, nights:[{n,title,intro,goal,duration,spawns:[{t:minutesSince1600,who}],modifier,outro}], upgrades:[{id,name,cost,desc,effect}], easterEggs:[{id,trigger,text}], achievements:[{id,name,desc}], endings:{win,fail_smoke,fail_stars,finale}}`. Engine treats unknown keys gracefully. Ids referenced (icons, cigars, drinks) must exist in the icon list above.
