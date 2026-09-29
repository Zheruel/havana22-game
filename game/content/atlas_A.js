// art-chars-A: hrvoje, roko. Frame index = row*4+col (96x128 cells, anchor 48,124).
window.CHAR_ATLAS = Object.assign(window.CHAR_ATLAS || {}, {
  hrvoje: { src: 'assets/chars/hrvoje.png', w: 96, h: 128, cols: 4, anchor: [48, 124],
    anims: { walk_down: [0,1,2,3], walk_left: [4,5,6,7], walk_right: [8,9,10,11], walk_up: [12,13,14,15],
             sit_down: [16], sit_left: [17], sit_right: [18], sit_up: [19],
             talk: [20], smoke: [21], special1: [22], special2: [23] } },
  roko: { src: 'assets/chars/roko.png', w: 96, h: 128, cols: 4, anchor: [48, 124],
    anims: { walk_down: [0,1,2,3], walk_left: [4,5,6,7], walk_right: [8,9,10,11], walk_up: [12,13,14,15],
             sit_down: [16], sit_left: [17], sit_right: [18], sit_up: [19],
             talk: [20], smoke: [21], special1: [22], special2: [23] } }
});
window.PORTRAITS = Object.assign(window.PORTRAITS || {}, {
  hrvoje: { neutral: 'assets/portraits/hrvoje_neutral.png', angry: 'assets/portraits/hrvoje_angry.png' },
  roko: { neutral: 'assets/portraits/roko_neutral.png', angry: 'assets/portraits/roko_angry.png' }
});
