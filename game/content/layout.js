// Layout matched to the painted plate game/assets/bg/lounge.png (art-env). Source of truth for collisions/seats/spots.
// Seat x,y = feet anchor of the seated character (bottom of the seat cushion, slightly toward the table).
window.LAYOUT = {
  width: 1280, height: 720,
  walls: [
    { id: 'backwall', x: 0, y: 0, w: 1280, h: 152 },
    { id: 'left_wall', x: 0, y: 150, w: 30, h: 440 },
    { id: 'right_wall', x: 1252, y: 150, w: 28, h: 440 },
    { id: 'bar_counter', x: 36, y: 190, w: 598, h: 87 },
    { id: 'stool1', x: 114, y: 250, w: 34, h: 54 },
    { id: 'stool2', x: 228, y: 250, w: 34, h: 54 },
    { id: 'stool3', x: 352, y: 250, w: 34, h: 54 },
    { id: 'stool4', x: 462, y: 250, w: 34, h: 54 },
    { id: 'stool5', x: 576, y: 250, w: 34, h: 54 },
    { id: 'humidor_cabinet', x: 1127, y: 152, w: 125, h: 195 },
    { id: 'front_glass_l', x: 0, y: 590, w: 770, h: 130 },
    { id: 'front_glass_r', x: 880, y: 590, w: 400, h: 130 },
    { id: 'sofa_left', x: 30, y: 287, w: 105, h: 245 },
    { id: 'banquette', x: 995, y: 504, w: 220, h: 86 },
    { id: 'plant_bl', x: 50, y: 548, w: 50, h: 44 },
    { id: 'plant_door', x: 712, y: 548, w: 48, h: 44 },
    { id: 'plant_r', x: 1205, y: 412, w: 46, h: 54 },
    // armchair footprints (collision only) so nobody walks through the chair art
    { id: 'chair1', x: 194, y: 336, w: 52, h: 80 },
    { id: 'chair2', x: 345, y: 336, w: 52, h: 80 },
    { id: 'chair3', x: 487, y: 387, w: 52, h: 80 },
    { id: 'chair4', x: 628, y: 386, w: 52, h: 80 },
    { id: 'chair5', x: 718, y: 297, w: 52, h: 80 },
    { id: 'chair6', x: 842, y: 298, w: 52, h: 80 },
    { id: 'chair7', x: 909, y: 371, w: 52, h: 80 },
    { id: 'chair8', x: 1044, y: 371, w: 52, h: 80 }
  ],
  tables: [
    { id: 'T1', x: 295, y: 385, r: 38 },
    { id: 'T2', x: 584, y: 436, r: 38 },
    { id: 'T3', x: 806, y: 356, r: 38 },
    { id: 'T4', x: 1003, y: 420, r: 38 }
  ],
  seats: [
    { id: 'S1', table: 'T1', x: 234, y: 394, face: 'right', kind: 'armchair' },
    { id: 'S2', table: 'T1', x: 357, y: 394, face: 'left', kind: 'armchair' },
    { id: 'S3', table: 'T2', x: 527, y: 445, face: 'right', kind: 'armchair' },
    { id: 'S4', table: 'T2', x: 640, y: 444, face: 'left', kind: 'armchair' },
    { id: 'S5', table: 'T3', x: 758, y: 355, face: 'right', kind: 'armchair' },
    { id: 'S6', table: 'T3', x: 854, y: 356, face: 'left', kind: 'armchair' },
    { id: 'S7', table: 'T4', x: 949, y: 429, face: 'right', kind: 'armchair' },
    { id: 'S8', table: 'T4', x: 1056, y: 429, face: 'left', kind: 'armchair' },
    { id: 'S9', table: 'sofa', x: 100, y: 362, face: 'right', kind: 'sofa' },
    { id: 'S10', table: 'sofa', x: 100, y: 424, face: 'right', kind: 'sofa' },
    { id: 'S11', table: 'sofa', x: 100, y: 486, face: 'right', kind: 'sofa' },
    { id: 'S12', table: 'banquette', x: 1052, y: 578, face: 'down', kind: 'banquette' },
    { id: 'S13', table: 'banquette', x: 1155, y: 578, face: 'down', kind: 'banquette' }
  ],
  spots: {
    humidor: { x: 1095, y: 322 },
    tap: { x: 197, y: 176 },
    spirits: { x: 340, y: 176 },
    coffee: { x: 497, y: 176 },
    vent: { x: 905, y: 182 },
    wc_door: { x: 1003, y: 182 },
    door: { x: 825, y: 612 }
  },
  spawn: { door: { x: 825, y: 690 }, inside: { x: 825, y: 572 } },
  playerStart: { x: 340, y: 176 },
  nav: { cell: 20 }
};
