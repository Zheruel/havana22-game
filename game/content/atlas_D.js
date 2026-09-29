// art-chars-D: gamer1 gamer2 guest1 guest2 guest3 guest4 (atlas 384x768, 4x6 cells of 96x128, feet anchor 48,124)
// NOTE: guest3 (Stari Vlado, old man) uses guest4.png art and guest4 (Klaus, tourist) uses guest3.png art - the files are swapped on purpose.
window.CHAR_ATLAS = Object.assign(window.CHAR_ATLAS || {}, {
  gamer1: {src:'assets/chars/gamer1.png', w:96, h:128, cols:4, anchor:[48,124], anims:{walk_down:[0,1,2,3],walk_left:[4,5,6,7],walk_right:[8,9,10,11],walk_up:[12,13,14,15],sit_down:[16],sit_left:[17],sit_right:[18],sit_up:[19],talk:[20],smoke:[21],special1:[22],special2:[23]}},
  gamer2: {src:'assets/chars/gamer2.png', w:96, h:128, cols:4, anchor:[48,124], anims:{walk_down:[0,1,2,3],walk_left:[4,5,6,7],walk_right:[8,9,10,11],walk_up:[12,13,14,15],sit_down:[16],sit_left:[17],sit_right:[18],sit_up:[19],talk:[20],smoke:[21],special1:[22],special2:[23]}},
  guest1: {src:'assets/chars/guest1.png', w:96, h:128, cols:4, anchor:[48,124], anims:{walk_down:[0,1,2,3],walk_left:[4,5,6,7],walk_right:[8,9,10,11],walk_up:[12,13,14,15],sit_down:[16],sit_left:[17],sit_right:[18],sit_up:[19],talk:[20],smoke:[21],special1:[22],special2:[23]}},
  guest2: {src:'assets/chars/guest2.png', w:96, h:128, cols:4, anchor:[48,124], anims:{walk_down:[0,1,2,3],walk_left:[4,5,6,7],walk_right:[8,9,10,11],walk_up:[12,13,14,15],sit_down:[16],sit_left:[17],sit_right:[18],sit_up:[19],talk:[20],smoke:[21],special1:[22],special2:[23]}},
  guest3: {src:'assets/chars/guest4.png', w:96, h:128, cols:4, anchor:[48,124], anims:{walk_down:[0,1,2,3],walk_left:[4,5,6,7],walk_right:[8,9,10,11],walk_up:[12,13,14,15],sit_down:[16],sit_left:[17],sit_right:[18],sit_up:[19],talk:[20],smoke:[21],special1:[22],special2:[23]}},
  guest4: {src:'assets/chars/guest3.png', w:96, h:128, cols:4, anchor:[48,124], anims:{walk_down:[0,1,2,3],walk_left:[4,5,6,7],walk_right:[8,9,10,11],walk_up:[12,13,14,15],sit_down:[16],sit_left:[17],sit_right:[18],sit_up:[19],talk:[20],smoke:[21],special1:[22],special2:[23]}},
});
