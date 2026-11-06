function doonfDisk(cx, cy, r) {
  return "M" + (cx - r) + " " + cy + "a" + r + " " + r + " 0 1 0 " + (2 * r) + " 0a" + r + " " + r + " 0 1 0 " + (-2 * r) + " 0Z";
}

function doonfOval(cx, cy, rx, ry) {
  return "M" + (cx - rx) + " " + cy + "a" + rx + " " + ry + " 0 1 0 " + (2 * rx) + " 0a" + rx + " " + ry + " 0 1 0 " + (-2 * rx) + " 0Z";
}

function doonfPoly(pts) {
  return "M" + pts.map(function (p) { return p[0] + " " + p[1]; }).join("L") + "Z";
}

function doonfBox(x, y, w, h) {
  return doonfPoly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
}

var DOONF_ICONS = {
  apple: function () {
    return doonfDisk(50, 66, 26) + doonfPoly([[47, 40], [49, 16], [55, 18], [53, 40]]) + doonfPoly([[53, 38], [74, 16], [82, 28], [62, 40]]);
  },
  plane: function () {
    return doonfPoly([[8, 58], [70, 42], [92, 28], [96, 36], [78, 50], [92, 70], [84, 74], [68, 58], [48, 66], [40, 80], [32, 76], [36, 60], [8, 66]]);
  },
  tree: function () {
    return doonfPoly([[50, 6], [88, 62], [12, 62]]) + doonfPoly([[42, 62], [42, 92], [58, 92], [58, 62]]) + doonfPoly([[24, 92], [76, 92], [80, 102], [20, 102]]);
  },
  boat: function () {
    return doonfPoly([[16, 62], [84, 62], [74, 82], [26, 82]]) + doonfPoly([[48, 60], [48, 18], [76, 60]]) + doonfBox(46, 14, 4, 70);
  },
  child: function () {
    return doonfDisk(50, 24, 14) + doonfPoly([[36, 42], [64, 42], [68, 72], [32, 72]]) + doonfBox(34, 72, 12, 22) + doonfBox(54, 72, 12, 22) + doonfBox(18, 46, 16, 8) + doonfBox(66, 46, 16, 8);
  },
  marble: function () {
    return doonfDisk(50, 50, 32) + doonfPoly([[34, 36], [46, 28], [52, 40], [40, 48]]);
  },
  house: function () {
    return doonfPoly([[12, 48], [50, 14], [88, 48], [88, 90], [12, 90]]) + doonfBox(40, 58, 20, 32) + doonfBox(22, 56, 14, 14);
  },
  dog: function () {
    return doonfPoly([[16, 58], [28, 46], [62, 46], [78, 34], [86, 42], [74, 52], [80, 70], [62, 78], [58, 90], [46, 90], [46, 76], [28, 76], [24, 90], [12, 90], [16, 72]]) + doonfDisk(70, 40, 3);
  },
  heart: function () {
    return doonfPoly([[50, 86], [16, 52], [16, 36], [28, 22], [42, 22], [50, 34], [58, 22], [72, 22], [84, 36], [84, 52]]);
  },
  die: function () {
    return doonfPoly([[22, 30], [58, 14], [90, 30], [90, 74], [54, 90], [22, 74]]) + doonfDisk(40, 46, 4) + doonfDisk(58, 38, 4) + doonfDisk(52, 62, 4);
  },
  dinosaur: function () {
    return doonfPoly([[10, 70], [24, 58], [48, 58], [62, 36], [78, 28], [84, 40], [70, 48], [78, 62], [70, 78], [48, 78], [44, 92], [32, 92], [34, 78], [18, 78]]) + doonfPoly([[62, 34], [70, 18], [78, 22], [72, 36]]);
  },
  candy: function () {
    return doonfPoly([[8, 42], [28, 50], [8, 58]]) + doonfOval(50, 50, 24, 16) + doonfPoly([[92, 42], [72, 50], [92, 58]]);
  },
  elephant: function () {
    return doonfPoly([[18, 70], [18, 48], [34, 36], [58, 36], [72, 24], [86, 30], [78, 44], [86, 50], [86, 78], [70, 78], [70, 92], [56, 92], [56, 78], [40, 78], [40, 92], [26, 92]]) + doonfPoly([[34, 70], [28, 86], [36, 88], [42, 72]]);
  },
  helicopter: function () {
    return doonfPoly([[28, 48], [70, 42], [78, 50], [70, 58], [28, 58]]) + doonfBox(18, 50, 12, 8) + doonfBox(46, 28, 4, 20) + doonfBox(24, 24, 52, 6) + doonfPoly([[70, 48], [92, 40], [92, 46], [74, 52]]) + doonfBox(38, 58, 6, 16);
  },
  grass: function () {
    return doonfPoly([[20, 88], [30, 20], [40, 88]]) + doonfPoly([[40, 88], [50, 12], [60, 88]]) + doonfPoly([[60, 88], [70, 28], [80, 88]]) + doonfBox(14, 86, 72, 8);
  },
  flower: function () {
    return doonfDisk(50, 42, 10) + doonfDisk(50, 22, 12) + doonfDisk(30, 36, 12) + doonfDisk(70, 36, 12) + doonfDisk(36, 56, 12) + doonfDisk(64, 56, 12) + doonfBox(46, 60, 8, 28) + doonfPoly([[54, 74], [74, 64], [70, 74]]);
  },
  butterfly: function () {
    return doonfOval(32, 40, 18, 14) + doonfOval(68, 40, 18, 14) + doonfOval(30, 64, 16, 12) + doonfOval(70, 64, 16, 12) + doonfOval(50, 52, 6, 18) + doonfPoly([[46, 30], [40, 14], [48, 28]]) + doonfPoly([[54, 30], [60, 14], [52, 28]]);
  },
  cheese: function () {
    return doonfPoly([[16, 78], [84, 78], [70, 28], [30, 28]]) + doonfDisk(44, 48, 6) + doonfDisk(58, 60, 5);
  },
  cat: function () {
    return doonfPoly([[22, 78], [26, 48], [18, 22], [34, 36], [50, 30], [66, 36], [82, 22], [74, 48], [78, 78]]) + doonfDisk(40, 50, 3) + doonfDisk(60, 50, 3) + doonfPoly([[46, 58], [50, 64], [54, 58]]);
  },
  icecream: function () {
    return doonfDisk(50, 32, 20) + doonfPoly([[32, 40], [68, 40], [50, 92]]);
  },
  giraffe: function () {
    return doonfPoly([[34, 92], [42, 92], [44, 48], [56, 48], [58, 92], [66, 92], [62, 48], [70, 36], [62, 18], [48, 16], [44, 28], [36, 40]]) + doonfDisk(54, 24, 3) + doonfPoly([[48, 16], [44, 6], [52, 14]]) + doonfPoly([[62, 18], [70, 6], [64, 16]]);
  },
  hotel: function () {
    return doonfBox(22, 28, 56, 64) + doonfBox(40, 62, 18, 30) + doonfBox(30, 40, 12, 12) + doonfBox(58, 40, 12, 12) + doonfPoly([[18, 28], [50, 8], [82, 28]]);
  },
  burger: function () {
    return doonfPoly([[18, 40], [22, 28], [78, 28], [82, 40]]) + doonfBox(16, 42, 68, 10) + doonfBox(18, 54, 64, 8) + doonfPoly([[16, 64], [84, 64], [78, 80], [22, 80]]);
  },
  hockey: function () {
    return doonfPoly([[58, 12], [70, 12], [48, 78], [36, 78]]) + doonfPoly([[28, 74], [56, 74], [60, 86], [24, 86]]) + doonfDisk(72, 80, 8);
  },
  island: function () {
    return doonfPoly([[8, 70], [30, 58], [70, 58], [92, 70], [92, 78], [8, 78]]) + doonfBox(46, 30, 6, 30) + doonfPoly([[52, 34], [78, 40], [74, 52], [52, 46]]);
  },
  igloo: function () {
    return doonfPoly([[14, 78], [14, 58], [28, 36], [50, 24], [72, 36], [86, 58], [86, 78]]) + doonfPoly([[40, 78], [40, 52], [60, 52], [60, 78]]);
  },
  hippo: function () {
    return doonfPoly([[14, 60], [18, 40], [40, 32], [70, 32], [86, 44], [86, 70], [74, 78], [70, 90], [56, 90], [54, 78], [28, 78], [26, 90], [14, 90]]) + doonfDisk(36, 48, 3) + doonfDisk(58, 48, 3);
  },
  lion: function () {
    return doonfDisk(50, 48, 28) + doonfPoly([[30, 70], [26, 88], [40, 80], [50, 90], [60, 80], [74, 88], [70, 70]]) + doonfDisk(40, 46, 3) + doonfDisk(58, 46, 3);
  },
  moon: function () {
    return doonfPoly([[58, 16], [40, 28], [32, 50], [40, 74], [58, 86], [46, 78], [36, 50], [46, 24]]);
  },
  lemon: function () {
    return doonfOval(50, 56, 26, 32) + doonfPoly([[50, 26], [58, 10], [64, 16], [54, 28]]);
  },
  sea: function () {
    return doonfPoly([[6, 40], [22, 28], [38, 40], [54, 28], [70, 40], [86, 28], [94, 40], [94, 52], [6, 52]]) + doonfPoly([[6, 64], [22, 52], [38, 64], [54, 52], [70, 64], [86, 52], [94, 64], [94, 78], [6, 78]]);
  },
  cow: function () {
    return doonfPoly([[16, 58], [22, 44], [70, 44], [82, 34], [90, 44], [78, 52], [82, 70], [70, 78], [64, 92], [52, 92], [52, 76], [30, 76], [28, 92], [16, 92]]) + doonfDisk(74, 40, 3) + doonfPoly([[24, 44], [20, 30], [30, 40]]) + doonfPoly([[36, 42], [34, 28], [44, 40]]);
  },
  ship: function () {
    return doonfPoly([[12, 62], [88, 62], [76, 84], [24, 84]]) + doonfBox(30, 28, 40, 34) + doonfBox(46, 12, 8, 18) + doonfPoly([[54, 14], [72, 22], [54, 22]]);
  },
  cloud: function () {
    return doonfDisk(38, 58, 16) + doonfDisk(58, 50, 20) + doonfDisk(74, 60, 14) + doonfBox(28, 58, 52, 16);
  },
  nest: function () {
    return doonfPoly([[16, 48], [84, 48], [74, 78], [26, 78]]) + doonfOval(40, 46, 10, 12) + doonfOval(60, 46, 10, 12);
  },
  bear: function () {
    return doonfDisk(28, 28, 12) + doonfDisk(72, 28, 12) + doonfDisk(50, 52, 28) + doonfOval(50, 64, 10, 8);
  },
  eye: function () {
    return doonfOval(50, 50, 36, 20) + doonfDisk(50, 50, 12) + doonfDisk(50, 50, 5);
  },
  goose: function () {
    return doonfOval(48, 62, 24, 16) + doonfPoly([[60, 52], [78, 28], [88, 26], [80, 36], [70, 56]]) + doonfBox(36, 74, 6, 16) + doonfBox(52, 74, 6, 16);
  },
  fish: function () {
    return doonfOval(46, 50, 28, 16) + doonfPoly([[72, 50], [94, 32], [94, 68]]) + doonfDisk(32, 48, 3);
  },
  bread: function () {
    return doonfPoly([[16, 58], [22, 36], [78, 36], [84, 58], [78, 74], [22, 74]]);
  },
  ball: function () {
    return doonfDisk(50, 50, 32) + doonfPoly([[24, 38], [76, 38], [76, 48], [24, 48]]) + doonfPoly([[30, 62], [70, 62], [64, 74], [36, 74]]);
  },
  frame: function () {
    return doonfBox(14, 18, 72, 64) + doonfBox(26, 30, 48, 40);
  },
  notebook: function () {
    return doonfBox(22, 12, 56, 76) + doonfBox(28, 24, 40, 4) + doonfBox(28, 36, 40, 4) + doonfBox(28, 48, 40, 4) + doonfBox(28, 60, 28, 4);
  },
  clover: function () {
    return doonfDisk(50, 36, 14) + doonfDisk(34, 52, 14) + doonfDisk(66, 52, 14) + doonfBox(46, 58, 8, 28);
  },
  rose: function () {
    return doonfDisk(50, 36, 16) + doonfDisk(38, 48, 10) + doonfDisk(62, 48, 10) + doonfBox(46, 56, 8, 30) + doonfPoly([[54, 70], [72, 58], [68, 70]]);
  },
  frog: function () {
    return doonfOval(50, 60, 28, 18) + doonfDisk(32, 36, 12) + doonfDisk(68, 36, 12) + doonfDisk(32, 36, 4) + doonfDisk(68, 36, 4) + doonfPoly([[22, 62], [8, 50], [14, 70]]) + doonfPoly([[78, 62], [92, 50], [86, 70]]);
  },
  rocket: function () {
    return doonfPoly([[50, 8], [68, 40], [68, 72], [50, 64], [32, 72], [32, 40]]) + doonfPoly([[32, 52], [16, 70], [32, 66]]) + doonfPoly([[68, 52], [84, 70], [68, 66]]) + doonfPoly([[42, 72], [50, 92], [58, 72]]);
  },
  sun: function () {
    return doonfDisk(50, 50, 18) + doonfBox(46, 6, 8, 14) + doonfBox(46, 80, 8, 14) + doonfBox(6, 46, 14, 8) + doonfBox(80, 46, 14, 8) + doonfPoly([[22, 22], [30, 16], [36, 28], [24, 32]]) + doonfPoly([[78, 22], [70, 16], [64, 28], [76, 32]]) + doonfPoly([[22, 78], [30, 84], [36, 72], [24, 68]]) + doonfPoly([[78, 78], [70, 84], [64, 72], [76, 68]]);
  },
  star: function () {
    return doonfPoly([[50, 8], [60, 38], [92, 38], [66, 56], [76, 88], [50, 68], [24, 88], [34, 56], [8, 38], [40, 38]]);
  },
  snake: function () {
    return doonfPoly([[16, 70], [16, 54], [40, 40], [70, 48], [78, 36], [90, 42], [74, 62], [40, 54], [28, 64], [40, 74], [78, 70], [78, 84], [28, 88], [16, 78]]);
  },
  train: function () {
    return doonfBox(14, 36, 62, 36) + doonfPoly([[76, 46], [92, 58], [76, 58]]) + doonfBox(22, 44, 18, 14) + doonfDisk(30, 78, 8) + doonfDisk(62, 78, 8);
  },
  table: function () {
    return doonfBox(12, 28, 76, 12) + doonfBox(20, 40, 8, 40) + doonfBox(72, 40, 8, 40);
  },
  turtle: function () {
    return doonfOval(52, 52, 26, 18) + doonfDisk(82, 46, 10) + doonfBox(30, 66, 10, 8) + doonfBox(48, 68, 10, 8) + doonfBox(24, 40, 10, 8) + doonfBox(64, 36, 10, 8);
  },
  grapes: function () {
    return doonfDisk(50, 36, 10) + doonfDisk(38, 48, 10) + doonfDisk(62, 48, 10) + doonfDisk(32, 62, 10) + doonfDisk(50, 62, 10) + doonfDisk(68, 62, 10) + doonfDisk(42, 76, 10) + doonfDisk(58, 76, 10) + doonfPoly([[48, 26], [50, 8], [56, 12], [54, 26]]);
  },
  egg: function () {
    return doonfPoly([[50, 12], [68, 36], [72, 70], [50, 90], [28, 70], [32, 36]]);
  },
  bird: function () {
    return doonfOval(46, 56, 22, 16) + doonfDisk(72, 46, 10) + doonfPoly([[80, 44], [94, 40], [82, 50]]) + doonfPoly([[30, 48], [8, 36], [28, 58]]) + doonfBox(40, 70, 5, 14);
  },
  fox: function () {
    return doonfPoly([[20, 80], [28, 50], [18, 18], [36, 40], [50, 34], [64, 40], [82, 18], [72, 50], [80, 80]]) + doonfPoly([[40, 80], [50, 92], [60, 80]]);
  },
  vase: function () {
    return doonfPoly([[36, 18], [64, 18], [70, 36], [62, 48], [78, 88], [22, 88], [38, 48], [30, 36]]);
  },
  violin: function () {
    return doonfOval(50, 62, 18, 24) + doonfBox(46, 10, 8, 30) + doonfBox(40, 8, 20, 6) + doonfPoly([[42, 40], [58, 78]]);
  },
  zebra: function () {
    return doonfPoly([[14, 62], [24, 46], [58, 46], [70, 30], [84, 36], [76, 50], [84, 64], [70, 72], [64, 90], [52, 90], [50, 72], [28, 72], [24, 90], [12, 88]]) + doonfBox(30, 50, 4, 18) + doonfBox(42, 48, 4, 20) + doonfBox(54, 50, 4, 16);
  },
  backpack: function () {
    return doonfPoly([[30, 28], [70, 28], [76, 88], [24, 88]]) + doonfPoly([[30, 28], [36, 12], [64, 12], [70, 28]]) + doonfBox(42, 48, 16, 18);
  },
  pumpkin: function () {
    return doonfOval(50, 58, 16, 24) + doonfOval(32, 58, 12, 20) + doonfOval(68, 58, 12, 20) + doonfPoly([[48, 36], [50, 16], [56, 20], [54, 36]]);
  },
  jeans: function () {
    return doonfPoly([[28, 12], [72, 12], [78, 40], [58, 44], [54, 92], [40, 92], [42, 44], [22, 40]]);
  },
  jeep: function () {
    return doonfPoly([[12, 58], [28, 40], [62, 40], [78, 52], [90, 52], [90, 72], [12, 72]]) + doonfBox(34, 44, 16, 12) + doonfDisk(28, 76, 8) + doonfDisk(74, 76, 8);
  },
  joker: function () {
    return doonfBox(28, 8, 44, 84) + doonfDisk(50, 36, 12) + doonfPoly([[40, 52], [50, 64], [60, 52]]) + doonfPoly([[28, 8], [18, 20], [28, 24]]) + doonfPoly([[72, 8], [82, 20], [72, 24]]);
  },
  koala: function () {
    return doonfDisk(24, 32, 14) + doonfDisk(76, 32, 14) + doonfDisk(50, 52, 26) + doonfOval(50, 64, 12, 10) + doonfDisk(40, 50, 3) + doonfDisk(60, 50, 3);
  },
  kiwi: function () {
    return doonfOval(50, 54, 28, 34) + doonfDisk(50, 56, 10) + doonfDisk(46, 54, 2) + doonfDisk(54, 54, 2) + doonfDisk(50, 60, 2);
  },
  kayak: function () {
    return doonfPoly([[8, 58], [50, 46], [92, 58], [50, 70]]) + doonfPoly([[70, 20], [78, 18], [46, 80], [40, 76]]);
  },
  sausage: function () {
    return doonfPoly([[18, 40], [78, 40], [86, 50], [78, 60], [18, 60], [12, 50]]);
  },
  waffle: function () {
    return doonfBox(16, 16, 68, 68) + doonfBox(16, 36, 68, 4) + doonfBox(16, 56, 68, 4) + doonfBox(36, 16, 4, 68) + doonfBox(56, 16, 4, 68);
  },
  surf: function () {
    return doonfPoly([[8, 70], [30, 40], [50, 28], [70, 40], [92, 70], [70, 62], [50, 52], [30, 62]]) + doonfPoly([[58, 18], [70, 8], [66, 36], [56, 34]]);
  },
  xylophone: function () {
    return doonfBox(18, 24, 64, 10) + doonfBox(22, 40, 56, 10) + doonfBox(26, 56, 48, 10) + doonfBox(30, 72, 40, 10) + doonfPoly([[78, 16], [88, 12], [84, 36], [74, 32]]);
  },
  xenops: function () {
    return doonfOval(44, 58, 20, 14) + doonfDisk(68, 48, 9) + doonfPoly([[76, 46], [96, 50], [76, 54]]) + doonfBox(36, 70, 5, 12) + doonfPoly([[24, 50], [8, 40], [22, 58]]);
  },
  yacht: function () {
    return doonfPoly([[20, 78], [80, 70], [86, 82], [28, 88]]) + doonfBox(48, 18, 4, 56) + doonfPoly([[52, 20], [78, 58], [52, 58]]);
  },
  yak: function () {
    return doonfPoly([[18, 60], [22, 40], [48, 36], [70, 28], [82, 40], [74, 52], [80, 72], [64, 80], [58, 94], [46, 94], [46, 78], [28, 78], [24, 94], [14, 90]]) + doonfPoly([[26, 42], [18, 24], [30, 36]]) + doonfPoly([[40, 38], [36, 20], [46, 34]]);
  },
  yoyo: function () {
    return doonfDisk(32, 62, 18) + doonfDisk(68, 62, 18) + doonfBox(48, 58, 8, 8) + doonfBox(50, 8, 3, 52);
  },
  bee: function () {
    return doonfDisk(50, 22, 14) + doonfOval(50, 58, 18, 24) + "M34 38C16 30 2 36 4 46C6 52 20 50 34 46Z" + "M66 38C84 30 98 36 96 46C94 52 80 50 66 46Z" + "M32 56C16 54 4 64 8 74C12 80 24 76 32 68Z" + "M68 56C84 54 96 64 92 74C88 80 76 76 68 68Z" + "M42 10C36 2 28 2 24 4" + doonfDisk(22, 4, 3) + "M58 10C64 2 72 2 76 4" + doonfDisk(78, 4, 3) + doonfDisk(44, 20, 4) + doonfDisk(56, 20, 4) + "M44 26C47 30 53 30 56 26" + "M40 50C46 48 54 48 60 50" + "M38 60C46 58 54 58 62 60" + "M40 70C46 68 54 68 60 70" + "M44 78C47 77 53 77 56 78" + "M46 82L50 94M54 82L50 94";
  },
  ant: function () {
    return doonfOval(50, 28, 10, 8) + doonfOval(50, 48, 12, 10) + doonfOval(50, 72, 14, 12) + doonfPoly([[38, 40], [16, 28], [18, 36]]) + doonfPoly([[62, 40], [84, 28], [82, 36]]) + doonfPoly([[40, 70], [18, 84], [24, 90]]) + doonfPoly([[60, 70], [82, 84], [76, 90]]) + doonfPoly([[46, 20], [42, 8], [48, 18]]) + doonfPoly([[54, 20], [58, 8], [52, 18]]);
  },
  car: function () {
    return doonfPoly([[10, 58], [24, 42], [48, 42], [62, 54], [90, 54], [90, 74], [10, 74]]) + doonfBox(28, 46, 16, 10) + doonfDisk(28, 78, 8) + doonfDisk(72, 78, 8);
  },
  cake: function () {
    return doonfPoly([[20, 48], [80, 48], [74, 88], [26, 88]]) + doonfBox(24, 36, 52, 12) + doonfBox(46, 16, 4, 22) + doonfPoly([[48, 16], [56, 8], [52, 20]]);
  },
  duck: function () {
    return doonfOval(46, 60, 24, 16) + doonfDisk(74, 50, 12) + doonfPoly([[82, 48], [98, 52], [82, 56]]) + doonfBox(36, 74, 8, 10);
  },
  eagle: function () {
    return doonfPoly([[8, 46], [40, 40], [50, 28], [60, 40], [92, 46], [70, 52], [60, 48], [54, 70], [46, 70], [40, 48], [30, 52]]) + doonfPoly([[46, 28], [50, 16], [54, 28]]);
  },
  hat: function () {
    return doonfOval(50, 70, 36, 10) + doonfPoly([[28, 68], [32, 36], [68, 36], [72, 68]]) + doonfBox(30, 28, 40, 10);
  },
  horse: function () {
    return doonfPoly([[12, 64], [24, 50], [48, 48], [62, 28], [74, 22], [70, 40], [82, 48], [78, 66], [64, 72], [60, 90], [48, 90], [48, 72], [28, 74], [24, 90], [12, 88]]) + doonfPoly([[62, 26], [66, 10], [74, 18]]);
  },
  jar: function () {
    return doonfBox(30, 12, 40, 12) + doonfPoly([[26, 24], [74, 24], [80, 88], [20, 88]]);
  },
  juice: function () {
    return doonfPoly([[32, 18], [68, 18], [60, 88], [40, 88]]) + doonfBox(36, 8, 28, 12) + doonfPoly([[68, 28], [86, 20], [84, 32], [66, 36]]);
  },
  jacket: function () {
    return doonfPoly([[28, 22], [50, 12], [72, 22], [84, 40], [70, 46], [66, 28], [62, 88], [38, 88], [34, 28], [30, 46], [16, 40]]);
  },
  kite: function () {
    return doonfPoly([[50, 10], [82, 46], [50, 86], [18, 46]]) + doonfPoly([[50, 86], [42, 98], [58, 96], [50, 90]]);
  },
  crown: function () {
    return doonfPoly([[12, 70], [20, 36], [34, 54], [50, 24], [66, 54], [80, 36], [88, 70]]);
  },
  leaf: function () {
    return doonfPoly([[50, 90], [18, 50], [28, 24], [50, 14], [72, 24], [82, 50]]) + doonfPoly([[50, 18], [50, 84]]);
  },
  lamp: function () {
    return doonfPoly([[30, 18], [70, 18], [62, 48], [38, 48]]) + doonfBox(46, 48, 8, 24) + doonfBox(32, 72, 36, 8);
  },
  mouse: function () {
    return doonfOval(48, 58, 26, 18) + doonfDisk(78, 48, 12) + doonfDisk(20, 36, 8) + doonfDisk(34, 28, 8) + doonfPoly([[86, 46], [98, 50], [86, 54]]) + doonfPoly([[30, 72], [18, 88], [28, 78]]);
  },
  monkey: function () {
    return doonfDisk(50, 28, 16) + doonfOval(50, 62, 18, 22) + doonfDisk(22, 36, 8) + doonfDisk(78, 36, 8) + doonfPoly([[32, 58], [14, 78], [22, 82], [36, 66]]) + doonfPoly([[68, 58], [86, 78], [78, 82], [64, 66]]) + doonfPoly([[40, 82], [36, 96], [48, 88]]);
  },
  nose: function () {
    return doonfPoly([[50, 12], [70, 70], [58, 88], [42, 88], [30, 70]]) + doonfDisk(42, 74, 4) + doonfDisk(58, 74, 4);
  },
  net: function () {
    return doonfPoly([[16, 20], [84, 20], [84, 84], [16, 84]]) + doonfPoly([[16, 20], [84, 84], [72, 84], [16, 36]]) + doonfPoly([[16, 52], [52, 84], [36, 84], [16, 68]]) + doonfPoly([[40, 20], [84, 52], [84, 36], [56, 20]]);
  },
  octopus: function () {
    return doonfOval(50, 36, 24, 18) + doonfPoly([[28, 48], [18, 88], [28, 88], [34, 56]]) + doonfPoly([[40, 52], [36, 92], [46, 92], [48, 56]]) + doonfPoly([[52, 56], [54, 92], [64, 92], [60, 52]]) + doonfPoly([[66, 56], [74, 88], [84, 84], [72, 48]]);
  },
  orange: function () {
    return doonfDisk(50, 56, 28) + doonfPoly([[48, 30], [52, 14], [58, 18], [52, 30]]);
  },
  owl: function () {
    return doonfOval(50, 54, 28, 32) + doonfDisk(36, 48, 10) + doonfDisk(64, 48, 10) + doonfDisk(36, 48, 4) + doonfDisk(64, 48, 4) + doonfPoly([[46, 62], [50, 70], [54, 62]]) + doonfPoly([[34, 24], [42, 8], [46, 26]]) + doonfPoly([[66, 24], [58, 8], [54, 26]]);
  },
  pig: function () {
    return doonfOval(48, 56, 28, 20) + doonfOval(80, 56, 12, 10) + doonfDisk(76, 54, 2) + doonfDisk(84, 54, 2) + doonfPoly([[30, 40], [24, 28], [34, 36]]) + doonfPoly([[18, 62], [6, 70], [16, 72]]) + doonfPoly([[40, 74], [38, 90], [48, 78]]);
  },
  pizza: function () {
    return doonfPoly([[50, 10], [90, 84], [10, 84]]) + doonfDisk(46, 48, 5) + doonfDisk(62, 64, 5) + doonfDisk(40, 68, 4);
  },
  penguin: function () {
    return doonfOval(50, 52, 22, 32) + doonfOval(50, 58, 12, 20) + doonfPoly([[28, 40], [10, 58], [26, 58]]) + doonfPoly([[72, 40], [90, 58], [74, 58]]) + doonfPoly([[40, 82], [50, 92], [60, 82]]) + doonfDisk(42, 40, 3) + doonfDisk(58, 40, 3);
  },
  queen: function () {
    return doonfPoly([[30, 28], [40, 12], [50, 26], [60, 10], [70, 28]]) + doonfDisk(50, 48, 14) + doonfPoly([[28, 64], [72, 64], [80, 92], [20, 92]]);
  },
  quilt: function () {
    return doonfBox(12, 18, 76, 64) + doonfBox(12, 38, 76, 4) + doonfBox(12, 58, 76, 4) + doonfBox(36, 18, 4, 64) + doonfBox(60, 18, 4, 64);
  },
  quill: function () {
    return doonfPoly([[78, 12], [88, 22], [36, 86], [22, 88], [24, 74]]) + doonfPoly([[70, 28], [40, 70], [48, 76], [78, 36]]);
  },
  rabbit: function () {
    return doonfOval(50, 62, 20, 22) + doonfPoly([[36, 48], [32, 12], [42, 14], [44, 46]]) + doonfPoly([[64, 48], [68, 12], [58, 14], [56, 46]]) + doonfDisk(42, 58, 3) + doonfDisk(58, 58, 3);
  },
  rainbow: function () {
    return "M14 78 A36 36 0 0 1 86 78 L74 78 A24 24 0 0 0 26 78 Z M20 78 A30 30 0 0 1 80 78 L68 78 A18 18 0 0 0 32 78 Z";
  },
  tiger: function () {
    return doonfPoly([[16, 64], [24, 46], [60, 44], [74, 30], [86, 40], [76, 52], [82, 70], [66, 76], [60, 92], [48, 92], [48, 74], [28, 74], [24, 90], [12, 88]]) + doonfBox(32, 50, 16, 4) + doonfBox(36, 60, 14, 4);
  },
  umbrella: function () {
    return doonfPoly([[10, 48], [50, 22], [90, 48], [74, 48], [50, 34], [26, 48]]) + doonfBox(47, 28, 6, 48) + doonfPoly([[53, 74], [70, 74], [70, 84], [53, 86]]);
  },
  unicorn: function () {
    return doonfPoly([[12, 66], [24, 52], [46, 50], [58, 34], [66, 22], [74, 36], [82, 48], [76, 66], [62, 72], [58, 90], [46, 90], [46, 72], [26, 74], [22, 90], [10, 88]]) + doonfPoly([[58, 30], [78, 6], [64, 28]]);
  },
  ukulele: function () {
    return doonfOval(40, 62, 22, 18) + doonfBox(52, 18, 8, 40) + doonfBox(46, 10, 20, 8) + doonfDisk(40, 62, 6);
  },
  volcano: function () {
    return doonfPoly([[8, 88], [36, 40], [44, 40], [28, 16], [40, 28], [50, 8], [60, 26], [70, 14], [56, 40], [64, 40], [92, 88]]);
  },
  van: function () {
    return doonfPoly([[8, 48], [8, 74], [92, 74], [92, 52], [78, 52], [70, 36], [28, 36], [22, 48]]) + doonfBox(32, 42, 16, 12) + doonfBox(54, 42, 14, 12) + doonfDisk(26, 78, 8) + doonfDisk(74, 78, 8);
  },
  whale: function () {
    return doonfPoly([[8, 58], [24, 42], [70, 40], [88, 52], [80, 66], [60, 72], [40, 86], [28, 72], [12, 70]]) + doonfPoly([[40, 40], [48, 22], [56, 40]]);
  },
  watch: function () {
    return doonfBox(40, 8, 20, 16) + doonfDisk(50, 54, 24) + doonfDisk(50, 54, 16) + doonfBox(46, 40, 4, 14) + doonfBox(48, 52, 12, 4) + doonfBox(40, 78, 20, 14);
  },
  window: function () {
    return doonfBox(16, 16, 68, 68) + doonfBox(48, 16, 4, 68) + doonfBox(16, 48, 68, 4);
  },
  xray: function () {
    return doonfPoly([[46, 8], [54, 8], [52, 28], [64, 48], [58, 52], [50, 36], [42, 52], [36, 48], [48, 28]]) + doonfOval(50, 70, 16, 22);
  },
  zipper: function () {
    return doonfBox(42, 8, 16, 84) + doonfPoly([[28, 36], [42, 28], [42, 52], [28, 44]]) + doonfBox(36, 8, 4, 84);
  },
  zoo: function () {
    return doonfBox(8, 28, 10, 60) + doonfBox(82, 28, 10, 60) + doonfBox(8, 22, 84, 12) + doonfPoly([[18, 70], [36, 70], [36, 88], [18, 88]]) + doonfPoly([[64, 70], [82, 70], [82, 88], [64, 88]]);
  },
  spider: function () {
    return doonfDisk(50, 36, 10) + doonfOval(50, 58, 14, 16) + doonfPoly([[40, 40], [12, 24], [14, 32]]) + doonfPoly([[40, 48], [10, 48], [12, 56]]) + doonfPoly([[42, 58], [14, 74], [20, 80]]) + doonfPoly([[60, 40], [88, 24], [86, 32]]) + doonfPoly([[60, 48], [90, 48], [88, 56]]) + doonfPoly([[58, 58], [86, 74], [80, 80]]);
  },
  bike: function () {
    return doonfDisk(28, 68, 16) + doonfDisk(28, 68, 8) + doonfDisk(74, 68, 16) + doonfDisk(74, 68, 8) + doonfPoly([[28, 68], [48, 36], [70, 36], [74, 68], [58, 68], [56, 48], [40, 68]]);
  },
  dolphin: function () {
    return doonfPoly([[8, 58], [30, 42], [62, 40], [82, 28], [90, 40], [74, 50], [84, 62], [60, 66], [40, 80], [28, 64], [12, 68]]);
  },
  stairs: function () {
    return doonfPoly([[12, 88], [12, 70], [34, 70], [34, 52], [56, 52], [56, 34], [78, 34], [78, 16], [92, 16], [92, 88]]);
  },
  seal: function () {
    return doonfOval(48, 56, 28, 18) + doonfDisk(78, 48, 10) + doonfPoly([[20, 60], [6, 72], [18, 70]]) + doonfPoly([[36, 70], [30, 86], [42, 74]]) + doonfDisk(74, 46, 2);
  },
  strawberry: function () {
    return doonfPoly([[50, 28], [74, 46], [68, 80], [32, 80], [26, 46]]) + doonfPoly([[40, 30], [50, 14], [60, 30]]) + doonfDisk(44, 52, 2) + doonfDisk(56, 60, 2) + doonfDisk(46, 70, 2);
  },
  balloon: function () {
    return doonfOval(50, 36, 22, 26) + doonfPoly([[44, 60], [56, 60], [50, 70]]) + doonfPoly([[50, 70], [48, 92], [54, 90]]);
  },
  glasses: function () {
    return doonfDisk(30, 48, 16) + doonfDisk(30, 48, 8) + doonfDisk(70, 48, 16) + doonfDisk(70, 48, 8) + doonfBox(46, 44, 8, 4) + doonfPoly([[14, 46], [4, 40], [6, 48]]) + doonfPoly([[86, 46], [96, 40], [94, 48]]);
  },
  iguana: function () {
    return doonfPoly([[8, 62], [30, 58], [70, 50], [92, 40], [96, 48], [74, 58], [70, 72], [30, 74], [24, 88], [14, 84], [16, 70]]);
  },
  magnet: function () {
    return doonfPoly([[22, 16], [40, 16], [40, 58], [60, 58], [60, 16], [78, 16], [78, 64], [50, 88], [22, 64]]) + doonfBox(22, 16, 18, 8) + doonfBox(60, 16, 18, 8);
  },
  ham: function () {
    return doonfOval(46, 50, 24, 18) + doonfPoly([[64, 40], [92, 28], [96, 40], [70, 52]]) + doonfDisk(70, 36, 3);
  },
  cage: function () {
    return doonfPoly([[20, 30], [50, 10], [80, 30], [80, 88], [20, 88]]) + doonfBox(36, 30, 4, 58) + doonfBox(50, 24, 4, 64) + doonfBox(64, 30, 4, 58);
  },
  sheep: function () {
    return doonfDisk(36, 52, 14) + doonfDisk(54, 46, 16) + doonfDisk(68, 56, 14) + doonfDisk(50, 62, 16) + doonfOval(82, 48, 10, 8) + doonfBox(40, 74, 6, 14) + doonfBox(58, 74, 6, 14);
  },
  kiosk: function () {
    return doonfPoly([[10, 36], [90, 36], [80, 22], [20, 22]]) + doonfBox(28, 36, 44, 40) + doonfBox(44, 50, 14, 26) + doonfBox(46, 76, 8, 12);
  },
  flask: function () {
    return doonfPoly([[40, 8], [60, 8], [60, 36], [82, 88], [18, 88], [40, 36]]) + doonfBox(36, 16, 28, 6);
  },
  pineapple: function () {
    return doonfOval(50, 60, 22, 28) + doonfPoly([[36, 36], [50, 12], [44, 36]]) + doonfPoly([[50, 34], [62, 10], [58, 36]]) + doonfPoly([[58, 36], [74, 18], [66, 40]]) + doonfBox(40, 48, 20, 4) + doonfBox(38, 60, 24, 4) + doonfBox(40, 72, 20, 4);
  },
  tomato: function () {
    return doonfDisk(50, 58, 28) + doonfPoly([[40, 34], [50, 18], [60, 34]]) + doonfPoly([[46, 32], [50, 22], [54, 32]]);
  },
  uniform: function () {
    return doonfPoly([[30, 16], [70, 16], [76, 36], [64, 36], [68, 90], [32, 90], [36, 36], [24, 36]]);
  },
  wallaby: function () {
    return doonfPoly([[16, 70], [28, 48], [48, 44], [62, 28], [74, 36], [64, 50], [78, 62], [70, 74], [58, 70], [62, 90], [48, 90], [44, 72], [30, 74], [26, 90], [14, 86]]) + doonfPoly([[36, 62], [48, 78], [40, 80]]);
  },
  xenon: function () {
    return doonfBox(18, 42, 64, 16) + doonfBox(8, 46, 12, 8) + doonfBox(80, 46, 12, 8) + doonfPoly([[30, 42], [36, 24], [42, 42]]) + doonfPoly([[48, 42], [54, 20], [60, 42]]);
  },
  avocado: function () {
    return doonfPoly([[50, 12], [72, 40], [68, 78], [50, 92], [32, 78], [28, 40]]) + doonfDisk(50, 60, 12);
  },
  tooth: function () {
    return doonfPoly([[28, 16], [72, 16], [78, 48], [68, 88], [56, 70], [50, 90], [44, 70], [32, 88], [22, 48]]);
  },
  ice: function () {
    return doonfBox(16, 20, 28, 24) + doonfBox(48, 28, 30, 26) + doonfBox(30, 52, 32, 26);
  },
  church: function () {
    return doonfBox(22, 48, 56, 42) + doonfPoly([[18, 48], [50, 22], [82, 48]]) + doonfBox(46, 8, 8, 20) + doonfBox(42, 14, 16, 6) + doonfBox(40, 64, 20, 26);
  },
  alligator: function () {
    return doonfPoly([[6, 48], [70, 42], [96, 36], [96, 46], [70, 50], [64, 66], [20, 68], [16, 84], [8, 80], [12, 62]]);
  },
  ladybug: function () {
    return doonfOval(50, 56, 28, 24) + doonfDisk(50, 30, 10) + doonfPoly([[50, 34], [50, 80]]) + doonfDisk(36, 52, 5) + doonfDisk(64, 52, 5) + doonfDisk(38, 68, 4) + doonfDisk(62, 68, 4);
  },
  pencil: function () {
    return doonfPoly([[20, 70], [62, 18], [78, 30], [36, 82]]) + doonfPoly([[20, 70], [12, 86], [28, 90], [36, 82]]) + doonfPoly([[62, 18], [70, 8], [82, 22], [78, 30]]);
  },
  hand: function () {
    return doonfPoly([[28, 48], [28, 16], [38, 16], [38, 44], [40, 10], [50, 10], [50, 44], [52, 14], [62, 14], [62, 46], [64, 24], [74, 28], [70, 86], [30, 88]]);
  },
  watermelon: function () {
    return doonfPoly([[12, 58], [50, 20], [88, 58], [50, 86]]) + doonfPoly([[22, 58], [50, 32], [78, 58], [50, 76]]);
  },
  coati: function () {
    return doonfPoly([[10, 58], [28, 50], [60, 52], [78, 40], [92, 46], [80, 56], [74, 70], [40, 72], [34, 88], [22, 84], [24, 68], [12, 66]]) + doonfPoly([[18, 62], [8, 78], [16, 70]]);
  },
  bell: function () {
    return doonfPoly([[50, 10], [58, 18], [42, 18]]) + doonfPoly([[28, 28], [72, 28], [84, 70], [16, 70]]) + doonfBox(16, 70, 68, 8) + doonfDisk(50, 84, 6);
  },
  armadillo: function () {
    return doonfOval(50, 58, 30, 18) + doonfDisk(82, 50, 10) + doonfBox(24, 48, 40, 4) + doonfBox(26, 58, 38, 4) + doonfBox(28, 68, 34, 4) + doonfPoly([[20, 70], [12, 84], [22, 76]]);
  },
  candle: function () {
    return doonfBox(40, 36, 20, 48) + doonfPoly([[46, 36], [50, 14], [58, 28], [50, 24], [46, 32]]) + doonfBox(34, 84, 32, 6);
  },
  guitar: function () {
    return doonfOval(46, 66, 22, 20) + doonfBox(56, 16, 8, 42) + doonfBox(50, 8, 20, 8) + doonfDisk(46, 66, 6);
  },
  yoga: function () {
    return doonfDisk(50, 22, 10) + doonfPoly([[40, 34], [60, 34], [70, 70], [30, 70]]) + doonfPoly([[30, 70], [14, 78], [18, 86], [36, 76]]) + doonfPoly([[70, 70], [86, 78], [82, 86], [64, 76]]);
  },
  clown: function () {
    return doonfDisk(50, 50, 30) + doonfDisk(50, 58, 8) + doonfDisk(38, 46, 4) + doonfDisk(62, 46, 4) + doonfPoly([[34, 68], [50, 78], [66, 68]]) + doonfPoly([[24, 28], [34, 16], [40, 30]]) + doonfPoly([[76, 28], [66, 16], [60, 30]]);
  },
  computer: function () {
    return doonfBox(14, 16, 72, 50) + doonfBox(22, 24, 56, 34) + doonfBox(44, 66, 12, 10) + doonfBox(30, 76, 40, 8);
  },
  comic: function () {
    return doonfBox(16, 18, 68, 64) + doonfPoly([[28, 34], [50, 28], [46, 46], [62, 40], [40, 62], [44, 46], [28, 52]]);
  },
  roof: function () {
    return doonfPoly([[8, 70], [50, 18], [92, 70]]) + doonfBox(18, 70, 64, 10) + doonfBox(44, 40, 12, 20);
  },
  fork: function () {
    return doonfBox(46, 28, 8, 60) + doonfBox(24, 12, 6, 28) + doonfBox(40, 8, 6, 28) + doonfBox(56, 8, 6, 28) + doonfBox(22, 36, 42, 8);
  },
  gift: function () {
    return doonfBox(16, 40, 68, 44) + doonfBox(16, 28, 68, 14) + doonfBox(46, 28, 8, 56) + doonfPoly([[50, 28], [36, 12], [42, 28]]) + doonfPoly([[50, 28], [64, 12], [58, 28]]);
  },
  kangaroo: function () {
    return doonfPoly([[24, 78], [36, 48], [52, 40], [62, 22], [74, 30], [64, 46], [78, 58], [70, 74], [58, 70], [64, 92], [50, 92], [42, 74], [30, 92], [20, 88]]) + doonfPoly([[58, 64], [74, 78], [64, 76]]) + doonfPoly([[28, 70], [8, 60], [20, 78]]);
  },
  cap: function () {
    return doonfPoly([[18, 48], [30, 28], [70, 28], [78, 48]]) + doonfOval(48, 52, 36, 12);
  },
  rhino: function () {
    return doonfPoly([[10, 64], [20, 50], [48, 48], [70, 36], [92, 42], [84, 56], [88, 72], [70, 78], [64, 92], [52, 92], [50, 76], [24, 76], [20, 90], [8, 86]]) + doonfPoly([[70, 40], [86, 28], [78, 42]]);
  },
  ear: function () {
    return doonfPoly([[36, 16], [58, 12], [78, 36], [74, 78], [52, 90], [34, 70], [30, 40]]) + doonfPoly([[48, 28], [64, 36], [60, 70], [46, 78], [44, 40]]);
  },
  oven: function () {
    return doonfBox(16, 16, 68, 70) + doonfBox(26, 28, 48, 36) + doonfBox(58, 70, 10, 6) + doonfDisk(30, 22, 3);
  },
  palm: function () {
    return doonfBox(46, 48, 8, 40) + doonfPoly([[50, 50], [18, 30], [28, 22], [50, 42]]) + doonfPoly([[50, 48], [82, 26], [74, 18], [50, 40]]) + doonfPoly([[50, 46], [24, 58], [30, 68], [50, 52]]) + doonfPoly([[50, 46], [78, 60], [70, 70], [50, 52]]);
  },
  tub: function () {
    return doonfPoly([[28, 28], [72, 28], [80, 88], [20, 88]]) + doonfBox(24, 16, 52, 14);
  },
  spring: function () {
    return doonfPoly([[8, 70], [30, 40], [48, 58], [62, 28], [80, 48], [92, 70], [92, 88], [8, 88]]) + doonfPoly([[40, 70], [48, 78], [70, 74], [64, 84], [44, 86]]);
  },
  cup: function () {
    return doonfPoly([[28, 22], [72, 22], [64, 82], [36, 82]]) + doonfPoly([[72, 34], [88, 40], [86, 56], [70, 52]]);
  },
  tractor: function () {
    return doonfBox(28, 36, 40, 24) + doonfBox(60, 46, 22, 16) + doonfDisk(32, 72, 16) + doonfDisk(70, 70, 10) + doonfBox(40, 24, 16, 12);
  },
  ufo: function () {
    return doonfOval(50, 58, 36, 12) + doonfDisk(50, 44, 14) + doonfDisk(28, 70, 4) + doonfDisk(50, 74, 4) + doonfDisk(72, 70, 4);
  },
  submarine: function () {
    return doonfOval(50, 58, 36, 16) + doonfBox(40, 36, 16, 14) + doonfBox(44, 24, 4, 14) + doonfPoly([[14, 52], [4, 44], [4, 64], [14, 58]]);
  },
  tent: function () {
    return doonfPoly([[8, 84], [50, 16], [92, 84]]) + doonfPoly([[50, 84], [42, 60], [58, 60]]);
  },
  four: function () {
    return doonfPoly([[28, 64], [28, 18], [48, 18], [48, 64], [70, 64], [70, 18], [86, 18], [86, 82], [28, 82], [28, 70], [16, 70], [16, 52], [28, 52]]);
  },
  pin: function () {
    return doonfPoly([[40, 8], [60, 8], [66, 28], [62, 70], [54, 88], [46, 88], [38, 70], [34, 28]]);
  },
  question: function () {
    return doonfPoly([[28, 36], [32, 18], [50, 8], [70, 16], [74, 36], [60, 48], [54, 62], [40, 62], [44, 46], [58, 38], [58, 26], [48, 22], [40, 28], [36, 40]]) + doonfDisk(48, 80, 6);
  },
  squirrel: function () {
    return doonfOval(46, 58, 18, 16) + doonfDisk(66, 42, 10) + doonfPoly([[24, 50], [8, 30], [18, 28], [28, 48]]) + doonfPoly([[30, 66], [18, 88], [40, 80], [36, 70]]) + doonfDisk(18, 26, 6);
  },
  wagon: function () {
    return doonfBox(14, 28, 72, 40) + doonfBox(24, 38, 18, 16) + doonfBox(52, 38, 18, 16) + doonfDisk(30, 78, 8) + doonfDisk(70, 78, 8);
  },
  wifi: function () {
    return doonfBox(30, 60, 40, 24) + doonfDisk(50, 52, 4) + "M30 48 A28 28 0 0 1 70 48 L62 50 A16 16 0 0 0 38 50 Z M22 38 A40 40 0 0 1 78 38 L70 40 A30 30 0 0 0 30 40 Z";
  },
  factory: function () {
    return doonfPoly([[8, 88], [8, 48], [28, 48], [28, 32], [40, 48], [52, 28], [64, 48], [92, 48], [92, 88]]) + doonfBox(70, 12, 10, 28) + doonfPoly([[80, 12], [92, 8], [84, 16]]);
  },
  glove: function () {
    return doonfPoly([[30, 88], [28, 40], [22, 16], [34, 14], [38, 36], [40, 12], [50, 12], [50, 38], [54, 18], [64, 20], [58, 42], [70, 30], [78, 40], [62, 88]]);
  },
  hedgehog: function () {
    return doonfOval(52, 60, 28, 18) + doonfDisk(80, 54, 10) + doonfPoly([[30, 46], [24, 24], [34, 40]]) + doonfPoly([[44, 42], [46, 16], [54, 38]]) + doonfPoly([[58, 44], [66, 20], [70, 40]]) + doonfDisk(78, 52, 2);
  },
  snail: function () {
    return doonfDisk(58, 48, 22) + doonfDisk(58, 48, 8) + doonfPoly([[36, 58], [14, 62], [16, 74], [40, 70]]) + doonfPoly([[18, 58], [10, 46], [20, 50]]);
  },
  castle: function () {
    return doonfBox(16, 40, 68, 48) + doonfBox(16, 24, 14, 18) + doonfBox(43, 18, 14, 24) + doonfBox(70, 24, 14, 18) + doonfBox(40, 58, 20, 30);
  },
  garden: function () {
    return doonfBox(8, 70, 84, 16) + doonfDisk(28, 52, 12) + doonfDisk(50, 46, 14) + doonfDisk(72, 54, 12) + doonfBox(46, 56, 6, 16) + doonfPoly([[18, 78], [82, 78], [78, 86], [22, 86]]);
  },
  skirt: function () {
    return doonfPoly([[36, 16], [64, 16], [70, 36], [84, 88], [16, 88], [30, 36]]);
  },
  teddy: function () {
    return doonfDisk(28, 24, 12) + doonfDisk(72, 24, 12) + doonfDisk(50, 42, 20) + doonfOval(50, 74, 22, 16) + doonfDisk(40, 40, 3) + doonfDisk(58, 40, 3);
  },
  moto: function () {
    return doonfDisk(28, 70, 14) + doonfDisk(74, 68, 16) + doonfPoly([[28, 68], [46, 48], [70, 44], [78, 56], [60, 60], [48, 68]]) + doonfBox(48, 32, 6, 16);
  },
  rhea: function () {
    return doonfOval(48, 48, 16, 22) + doonfPoly([[58, 40], [86, 36], [88, 44], [62, 48]]) + doonfBox(40, 66, 5, 24) + doonfBox(52, 66, 5, 24) + doonfPoly([[36, 30], [28, 8], [36, 12], [40, 28]]);
  },
  gnu: function () {
    return doonfPoly([[14, 64], [24, 48], [60, 46], [74, 34], [88, 42], [78, 54], [84, 72], [66, 78], [60, 92], [48, 92], [48, 76], [26, 76], [22, 90], [12, 86]]) + doonfPoly([[60, 40], [70, 14], [64, 36]]) + doonfPoly([[48, 42], [40, 16], [50, 38]]);
  },
  yam: function () {
    return doonfPoly([[30, 18], [48, 14], [70, 36], [78, 70], [60, 90], [36, 80], [22, 48]]);
  },
  shoe: function () {
    return doonfPoly([[16, 48], [48, 40], [78, 46], [92, 60], [88, 74], [16, 74], [12, 60]]);
  },
  carrot: function () {
    return doonfPoly([[40, 28], [70, 20], [58, 92], [36, 88]]) + doonfPoly([[44, 30], [36, 10], [50, 22]]) + doonfPoly([[52, 26], [58, 8], [62, 24]]);
  },
  nail: function () {
    return doonfPoly([[28, 70], [36, 18], [50, 8], [64, 18], [72, 70]]) + doonfBox(24, 68, 52, 14);
  },
  bone: function () {
    return doonfDisk(28, 36, 12) + doonfDisk(28, 64, 12) + doonfDisk(72, 36, 12) + doonfDisk(72, 64, 12) + doonfBox(28, 42, 44, 16);
  },
  banana: function () {
    return doonfPoly([[22, 72], [30, 34], [52, 16], [64, 24], [48, 40], [40, 78], [28, 84]]);
  },
  spoon: function () {
    return doonfOval(50, 28, 16, 18) + doonfBox(46, 42, 8, 46);
  },
  jellyfish: function () {
    return doonfOval(50, 30, 26, 16) + doonfPoly([[26, 42], [18, 90], [30, 88], [34, 48]]) + doonfPoly([[40, 46], [38, 94], [48, 92], [50, 46]]) + doonfPoly([[58, 46], [64, 94], [74, 88], [66, 44]]) + doonfPoly([[72, 42], [86, 84], [92, 76], [78, 40]]);
  },
  robot: function () {
    return doonfBox(28, 28, 44, 36) + doonfBox(40, 12, 20, 14) + doonfDisk(42, 44, 4) + doonfDisk(58, 44, 4) + doonfBox(34, 54, 32, 6) + doonfBox(32, 64, 12, 24) + doonfBox(56, 64, 12, 24) + doonfBox(14, 36, 14, 8) + doonfBox(72, 36, 14, 8);
  },
  zigzag: function () {
    return doonfPoly([[12, 24], [46, 24], [24, 48], [58, 48], [34, 74], [78, 74], [86, 90], [30, 90], [54, 64], [20, 64], [42, 40], [8, 40]]);
  }
};
