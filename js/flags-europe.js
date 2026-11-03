function doonfBag() {
  var areas = "";
  var lines = "";
  return {
    rect: function (color, x, y, w, h) {
      areas += '<rect data-fill="' + color + '" x="' + doonfNum(x) + '" y="' + doonfNum(y) + '" width="' + doonfNum(w) + '" height="' + doonfNum(h) + '"></rect>';
    },
    paint: function (color, d) {
      areas += '<path data-fill="' + color + '" d="' + d + '"></path>';
    },
    hole: function (color, d) {
      areas += '<path data-fill="' + color + '" fill-rule="evenodd" d="' + d + '"></path>';
    },
    draw: function (color, d) {
      areas += '<path data-fill="' + color + '" d="' + d + '"></path>';
      lines += '<path d="' + d + '"></path>';
    },
    dot: function (color, cx, cy, r) {
      var c = '<circle cx="' + doonfNum(cx) + '" cy="' + doonfNum(cy) + '" r="' + doonfNum(r) + '"></circle>';
      areas += c.replace("<circle ", '<circle data-fill="' + color + '" ');
      lines += c;
    },
    edge: function (d) {
      lines += '<path d="' + d + '"></path>';
    },
    box: function (w, h) {
      lines += '<path d="M0 0 H' + doonfNum(w) + " V" + doonfNum(h) + ' H0 Z"></path>';
    },
    done: function (vb) {
      return doonfFlagRecord(vb, areas, lines);
    }
  };
}

function doonfBands(w, h, dir, fills) {
  var bag = doonfBag();
  var n = fills.length;
  for (var i = 0; i < n; i++) {
    if (dir === "h") bag.rect(fills[i], 0, (h * i) / n, w, h / n);
    else bag.rect(fills[i], (w * i) / n, 0, w / n, h);
  }
  bag.box(w, h);
  for (var k = 1; k < n; k++) {
    if (dir === "h") bag.edge("M0 " + doonfNum((h * k) / n) + " H" + doonfNum(w));
    else bag.edge("M" + doonfNum((w * k) / n) + " 0 V" + doonfNum(h));
  }
  return bag.done("0 0 " + w + " " + h);
}

function doonfCrossPath(x, y, cw, ch, w, h) {
  var x2 = x + cw;
  var y2 = y + ch;
  return "M" + doonfNum(x) + " 0 H" + doonfNum(x2) + " V" + doonfNum(y) +
    " H" + doonfNum(w) + " V" + doonfNum(y2) + " H" + doonfNum(x2) +
    " V" + doonfNum(h) + " H" + doonfNum(x) + " V" + doonfNum(y2) +
    " H0 V" + doonfNum(y) + " H" + doonfNum(x) + " Z";
}

function doonfNordic(w, h, hoist, bar, field, cross, fimbColor, fimb) {
  var bag = doonfBag();
  var total = bar + 2 * fimb;
  var x = hoist;
  var y = (h - total) / 2;
  bag.rect(field, 0, 0, w, h);
  if (fimb) bag.draw(fimbColor, doonfCrossPath(x, y, total, total, w, h));
  bag.draw(cross, doonfCrossPath(x + fimb, y + fimb, bar, bar, w, h));
  bag.box(w, h);
  return bag.done("0 0 " + w + " " + h);
}

function doonfNorm(x, y) {
  var len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
}

function doonfBandPts(x0, y0, x1, y1, width) {
  var d = doonfNorm(x1 - x0, y1 - y0);
  var px = -d.y * width;
  var py = d.x * width;
  return [
    { x: x0 + px, y: y0 + py },
    { x: x1 + px, y: y1 + py },
    { x: x1 - px, y: y1 - py },
    { x: x0 - px, y: y0 - py }
  ];
}

function doonfHalfPts(x0, y0, x1, y1, width, side) {
  var d = doonfNorm(x1 - x0, y1 - y0);
  var px = -d.y * width * side;
  var py = d.x * width * side;
  return [
    { x: x0, y: y0 },
    { x: x1, y: y1 },
    { x: x1 + px, y: y1 + py },
    { x: x0 + px, y: y0 + py }
  ];
}

function doonfHit(p, q, a, b) {
  var d = (p.x - q.x) * (a.y - b.y) - (p.y - q.y) * (a.x - b.x);
  if (Math.abs(d) < 1e-8) return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
  var t = ((p.x - a.x) * (a.y - b.y) - (p.y - a.y) * (a.x - b.x)) / d;
  return { x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) };
}

function doonfClipPoly(subject, clip) {
  function inside(p, a, b) {
    return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) >= -1e-7;
  }
  var out = subject;
  for (var i = 0; i < clip.length; i++) {
    var a = clip[i];
    var b = clip[(i + 1) % clip.length];
    var input = out;
    out = [];
    for (var j = 0; j < input.length; j++) {
      var s = input[j];
      var e = input[(j + 1) % input.length];
      var sin = inside(s, a, b);
      var ein = inside(e, a, b);
      if (ein) {
        if (!sin) out.push(doonfHit(s, e, a, b));
        out.push(e);
      } else if (sin) out.push(doonfHit(s, e, a, b));
    }
  }
  return out;
}

function doonfRectClip(x, y, w, h) {
  return [
    { x: x, y: y },
    { x: x + w, y: y },
    { x: x + w, y: y + h },
    { x: x, y: y + h }
  ];
}

function doonfShield(cx, top, w, h) {
  var x = cx - w / 2;
  var mid = top + h * 0.62;
  var bot = top + h;
  return "M" + doonfNum(x) + " " + doonfNum(top) +
    " H" + doonfNum(x + w) +
    " V" + doonfNum(mid) +
    " Q" + doonfNum(x + w) + " " + doonfNum(bot - h * 0.02) + " " + doonfNum(cx) + " " + doonfNum(bot) +
    " Q" + doonfNum(x) + " " + doonfNum(bot - h * 0.02) + " " + doonfNum(x) + " " + doonfNum(mid) +
    " Z";
}

function doonfMirror(pts) {
  var right = [];
  for (var i = pts.length - 2; i >= 1; i--) right.push({ x: -pts[i].x, y: pts[i].y });
  return pts.concat(right);
}

function doonfEagle(cx, cy, s) {
  var half = [
    [0, 0.95],
    [-0.1, 0.58],
    [-0.26, 0.82],
    [-0.42, 0.7],
    [-0.5, 0.82],
    [-0.32, 0.5],
    [-0.55, 0.4],
    [-0.4, 0.22],
    [-0.72, 0.2],
    [-0.48, 0.05],
    [-0.9, 0],
    [-0.55, -0.14],
    [-1, -0.28],
    [-0.58, -0.32],
    [-0.88, -0.55],
    [-0.42, -0.34],
    [-0.28, -0.16],
    [-0.4, -0.42],
    [-0.62, -0.5],
    [-0.74, -0.4],
    [-0.48, -0.58],
    [-0.32, -0.46],
    [-0.16, -0.28],
    [0, -0.18]
  ].map(function (p) { return { x: p[0], y: p[1] }; });
  return doonfPoly(doonfMirror(half).map(function (p) {
    return { x: cx + p.x * s, y: cy + p.y * s };
  }));
}

function doonfCrown(cx, cy, s) {
  return doonfPoly([
    { x: cx - s, y: cy + s * 0.45 },
    { x: cx - s, y: cy + s * 0.05 },
    { x: cx - s * 0.62, y: cy - s * 0.35 },
    { x: cx - s * 0.35, y: cy + s * 0.08 },
    { x: cx, y: cy - s * 0.62 },
    { x: cx + s * 0.35, y: cy + s * 0.08 },
    { x: cx + s * 0.62, y: cy - s * 0.35 },
    { x: cx + s, y: cy + s * 0.05 },
    { x: cx + s, y: cy + s * 0.45 }
  ]);
}

function doonfAnnulus(cx, cy, r, thick) {
  var a = doonfNum(r);
  var b = doonfNum(r - thick);
  return "M" + doonfNum(cx - r) + " " + doonfNum(cy) +
    " a" + a + " " + a + " 0 1 0 " + doonfNum(r * 2) + " 0 a" + a + " " + a + " 0 1 0 " + doonfNum(-r * 2) + " 0" +
    " M" + doonfNum(cx - (r - thick)) + " " + doonfNum(cy) +
    " a" + b + " " + b + " 0 1 1 " + doonfNum((r - thick) * 2) + " 0 a" + b + " " + b + " 0 1 1 " + doonfNum(-(r - thick) * 2) + " 0";
}

function doonfEllipseRing(cx, cy, rx, ry, thick, rot) {
  function ring(radx, rady) {
    var pts = [];
    var n = 40;
    for (var i = 0; i <= n; i++) {
      var a = (i / n) * Math.PI * 2;
      var x = radx * Math.cos(a);
      var y = rady * Math.sin(a);
      var c = Math.cos(rot);
      var s = Math.sin(rot);
      pts.push({ x: cx + x * c - y * s, y: cy + x * s + y * c });
    }
    return pts;
  }
  var outer = ring(rx, ry);
  var inner = ring(Math.max(1, rx - thick), Math.max(1, ry - thick)).reverse();
  return "M " + doonfPts(outer) + " Z M " + doonfPts(inner) + " Z";
}

function doonfCastle(cx, cy, s) {
  return "M" + doonfNum(cx - s) + " " + doonfNum(cy + s * 0.15) +
    " V" + doonfNum(cy - s * 0.25) +
    " H" + doonfNum(cx - s * 0.45) + " V" + doonfNum(cy - s * 0.7) +
    " H" + doonfNum(cx - s * 0.15) + " V" + doonfNum(cy - s * 0.4) +
    " H" + doonfNum(cx + s * 0.15) + " V" + doonfNum(cy - s * 0.7) +
    " H" + doonfNum(cx + s * 0.45) + " V" + doonfNum(cy - s * 0.25) +
    " H" + doonfNum(cx + s) + " V" + doonfNum(cy + s * 0.15) + " Z";
}

function doonfCow(cx, cy, s) {
  return "M" + doonfNum(cx - s) + " " + doonfNum(cy) +
    " Q" + doonfNum(cx - s * 0.2) + " " + doonfNum(cy - s * 0.55) + " " + doonfNum(cx + s * 0.15) + " " + doonfNum(cy - s * 0.35) +
    " Q" + doonfNum(cx + s * 0.55) + " " + doonfNum(cy - s * 0.7) + " " + doonfNum(cx + s * 0.85) + " " + doonfNum(cy - s * 0.2) +
    " L" + doonfNum(cx + s * 0.55) + " " + doonfNum(cy) +
    " L" + doonfNum(cx + s * 0.85) + " " + doonfNum(cy + s * 0.35) +
    " Q" + doonfNum(cx + s * 0.2) + " " + doonfNum(cy + s * 0.15) + " " + doonfNum(cx - s * 0.1) + " " + doonfNum(cy + s * 0.28) +
    " L" + doonfNum(cx - s * 0.35) + " " + doonfNum(cy + s * 0.55) +
    " L" + doonfNum(cx - s * 0.15) + " " + doonfNum(cy + s * 0.15) +
    " Q" + doonfNum(cx - s * 0.7) + " " + doonfNum(cy + s * 0.2) + " " + doonfNum(cx - s) + " " + doonfNum(cy) + " Z";
}

function doonfMitre(cx, cy, s) {
  return "M" + doonfNum(cx) + " " + doonfNum(cy - s) +
    " Q" + doonfNum(cx + s * 0.15) + " " + doonfNum(cy - s * 0.2) + " " + doonfNum(cx + s * 0.55) + " " + doonfNum(cy + s * 0.15) +
    " L" + doonfNum(cx + s * 0.7) + " " + doonfNum(cy + s * 0.55) +
    " H" + doonfNum(cx - s * 0.7) +
    " L" + doonfNum(cx - s * 0.55) + " " + doonfNum(cy + s * 0.15) +
    " Q" + doonfNum(cx - s * 0.15) + " " + doonfNum(cy - s * 0.2) + " " + doonfNum(cx) + " " + doonfNum(cy - s) + " Z";
}

function doonfLion(cx, cy, s) {
  return "M" + doonfNum(cx + s * 0.15) + " " + doonfNum(cy + s * 0.85) +
    " L" + doonfNum(cx - s * 0.05) + " " + doonfNum(cy + s * 0.35) +
    " L" + doonfNum(cx - s * 0.45) + " " + doonfNum(cy + s * 0.55) +
    " L" + doonfNum(cx - s * 0.2) + " " + doonfNum(cy + s * 0.05) +
    " L" + doonfNum(cx - s * 0.7) + " " + doonfNum(cy + s * 0.15) +
    " Q" + doonfNum(cx - s * 0.2) + " " + doonfNum(cy - s * 0.35) + " " + doonfNum(cx + s * 0.05) + " " + doonfNum(cy - s * 0.55) +
    " L" + doonfNum(cx + s * 0.35) + " " + doonfNum(cy - s * 0.85) +
    " L" + doonfNum(cx + s * 0.15) + " " + doonfNum(cy - s * 0.45) +
    " Q" + doonfNum(cx + s * 0.7) + " " + doonfNum(cy - s * 0.15) + " " + doonfNum(cx + s * 0.45) + " " + doonfNum(cy + s * 0.2) +
    " L" + doonfNum(cx + s * 0.7) + " " + doonfNum(cy + s * 0.45) +
    " L" + doonfNum(cx + s * 0.25) + " " + doonfNum(cy + s * 0.15) +
    " L" + doonfNum(cx + s * 0.4) + " " + doonfNum(cy + s * 0.85) + " Z";
}

function doonfDoubleCross(cx, top, s) {
  var stem = s * 0.16;
  return "M" + doonfNum(cx - stem) + " " + doonfNum(top) +
    " H" + doonfNum(cx + stem) + " V" + doonfNum(top + s * 0.22) +
    " H" + doonfNum(cx + s * 0.42) + " V" + doonfNum(top + s * 0.42) +
    " H" + doonfNum(cx + stem) + " V" + doonfNum(top + s * 0.62) +
    " H" + doonfNum(cx + s * 0.62) + " V" + doonfNum(top + s * 0.84) +
    " H" + doonfNum(cx + stem) + " V" + doonfNum(top + s * 1.15) +
    " H" + doonfNum(cx - stem) + " V" + doonfNum(top + s * 0.84) +
    " H" + doonfNum(cx - s * 0.62) + " V" + doonfNum(top + s * 0.62) +
    " H" + doonfNum(cx - stem) + " V" + doonfNum(top + s * 0.42) +
    " H" + doonfNum(cx - s * 0.42) + " V" + doonfNum(top + s * 0.22) +
    " H" + doonfNum(cx - stem) + " Z";
}

function doonfHills(cx, base, s) {
  return "M" + doonfNum(cx - s) + " " + doonfNum(base) +
    " Q" + doonfNum(cx - s * 0.72) + " " + doonfNum(base - s * 0.45) + " " + doonfNum(cx - s * 0.46) + " " + doonfNum(base) +
    " Q" + doonfNum(cx - s * 0.1) + " " + doonfNum(base - s * 0.85) + " " + doonfNum(cx + s * 0.16) + " " + doonfNum(base - s * 0.15) +
    " Q" + doonfNum(cx + s * 0.4) + " " + doonfNum(base - s * 0.55) + " " + doonfNum(cx + s) + " " + doonfNum(base) + " Z";
}

function doonfKey(cx, cy, len, side) {
  var bow = 11;
  return "M" + doonfNum(cx) + " " + doonfNum(cy) +
    " m" + doonfNum(-bow) + " 0 a" + bow + " " + bow + " 0 1 0 " + (bow * 2) + " 0 a" + bow + " " + bow + " 0 1 0 " + (-bow * 2) + " 0" +
    " M" + doonfNum(cx + side * 8) + " " + doonfNum(cy - 3) +
    " L" + doonfNum(cx + side * len) + " " + doonfNum(cy - 3) +
    " L" + doonfNum(cx + side * len) + " " + doonfNum(cy + 8) +
    " L" + doonfNum(cx + side * (len - 7)) + " " + doonfNum(cy + 8) +
    " L" + doonfNum(cx + side * (len - 7)) + " " + doonfNum(cy + 3) +
    " L" + doonfNum(cx + side * (len - 16)) + " " + doonfNum(cy + 3) +
    " L" + doonfNum(cx + side * (len - 16)) + " " + doonfNum(cy + 10) +
    " L" + doonfNum(cx + side * (len - 23)) + " " + doonfNum(cy + 10) +
    " L" + doonfNum(cx + side * (len - 23)) + " " + doonfNum(cy + 3) +
    " L" + doonfNum(cx + side * 8) + " " + doonfNum(cy + 3) + " Z";
}

function doonfEasyFlags() {
  var flags = {};
  [
    ["france", "v", 3, 2, ["fr-blue", "white", "fr-red"]],
    ["belgium", "v", 15, 13, ["black", "be-yellow", "be-red"]],
    ["ireland", "v", 2, 1, ["ie-green", "white", "ie-orange"]],
    ["romania", "v", 3, 2, ["ro-blue", "ro-yellow", "ro-red"]],
    ["germany", "h", 5, 3, ["black", "de-red", "de-gold"]],
    ["netherlands", "h", 3, 2, ["nl-red", "white", "nl-blue"]],
    ["luxembourg", "h", 5, 3, ["lu-red", "white", "lu-blue"]],
    ["russia", "h", 3, 2, ["white", "ru-blue", "ru-red"]],
    ["hungary", "h", 3, 2, ["hu-red", "white", "hu-green"]],
    ["bulgaria", "h", 5, 3, ["white", "bg-green", "bg-red"]],
    ["estonia", "h", 11, 7, ["ee-blue", "black", "white"]],
    ["lithuania", "h", 5, 3, ["lt-yellow", "lt-green", "lt-red"]],
    ["austria", "h", 3, 2, ["at-red", "white", "at-red"]],
    ["poland", "h", 8, 5, ["white", "pl-red"]],
    ["ukraine", "h", 3, 2, ["ua-blue", "ua-yellow"]],
    ["monaco", "h", 5, 4, ["mc-red", "white"]]
  ].forEach(function (item) {
    flags[item[0]] = doonfBands(item[2], item[3], item[1], item[4]);
  });
  flags.denmark = doonfNordic(37, 28, 12, 4, "dk-red", "white", "", 0);
  flags.sweden = doonfNordic(16, 10, 5, 2, "se-blue", "se-yellow", "", 0);
  flags.finland = doonfNordic(18, 11, 5, 3, "white", "fi-blue", "", 0);
  flags.iceland = doonfNordic(25, 18, 7, 2, "is-blue", "is-red", "white", 1);
  flags.norway = doonfNordic(22, 16, 6, 2, "no-red", "no-blue", "white", 1);
  return flags;
}

function doonfLatvia() {
  var bag = doonfBag();
  bag.rect("lv-red", 0, 0, 2, 0.4);
  bag.rect("white", 0, 0.4, 2, 0.2);
  bag.rect("lv-red", 0, 0.6, 2, 0.4);
  bag.box(2, 1);
  bag.edge("M0 0.4 H2");
  bag.edge("M0 0.6 H2");
  return bag.done("0 0 2 1");
}

function doonfCzechia() {
  var bag = doonfBag();
  bag.rect("white", 0, 0, 6, 2);
  bag.rect("cz-red", 0, 2, 6, 2);
  bag.draw("cz-blue", "M0 0 L3 2 L0 4 Z");
  bag.box(6, 4);
  bag.edge("M3 2 H6");
  return bag.done("0 0 6 4");
}

function doonfGreece() {
  var bag = doonfBag();
  var stripe = 2;
  for (var i = 0; i < 9; i++) {
    var y = i * stripe;
    var x = i < 5 ? 10 : 0;
    bag.rect(i % 2 === 0 ? "gr-blue" : "white", x, y, 27 - x, stripe);
  }
  bag.rect("gr-blue", 0, 0, 10, 10);
  bag.draw("white", doonfCrossPath(4, 4, 2, 2, 10, 10));
  bag.box(27, 18);
  bag.edge("M10 0 V10 H0");
  for (var k = 1; k < 9; k++) {
    var yy = k * stripe;
    bag.edge("M" + (k < 5 ? 10 : 0) + " " + yy + " H27");
  }
  return bag.done("0 0 27 18");
}

function doonfBosnia() {
  var bag = doonfBag();
  bag.rect("ba-blue", 0, 0, 16, 8);
  bag.draw("ba-yellow", "M4.24 0 H12.24 V8 Z");
  for (var i = 0; i < 9; i++) {
    bag.draw("white", doonfPoly(doonfStar(2.8 + i, i, 0.72, 0.28, 5, -Math.PI / 2)));
  }
  bag.box(16, 8);
  return bag.done("0 0 16 8");
}

function doonfMacedonia() {
  var bag = doonfBag();
  var w = 200;
  var h = 100;
  var cx = 100;
  var cy = 50;
  bag.rect("mk-red", 0, 0, w, h);
  for (var i = 0; i < 8; i++) {
    var angle = -Math.PI / 2 + (i * Math.PI) / 4;
    var dx = Math.cos(angle);
    var dy = Math.sin(angle);
    var tx = dx > 0 ? (w - cx) / dx : dx < 0 ? -cx / dx : 1e9;
    var ty = dy > 0 ? (h - cy) / dy : dy < 0 ? -cy / dy : 1e9;
    var outer = Math.min(tx, ty) - 7;
    var inner = 16;
    var spread = 0.22;
    var pinch = 0.05;
    var tip = [
      { x: cx + inner * Math.cos(angle - pinch), y: cy + inner * Math.sin(angle - pinch) },
      { x: cx + outer * Math.cos(angle - spread), y: cy + outer * Math.sin(angle - spread) },
      { x: cx + outer * Math.cos(angle + spread), y: cy + outer * Math.sin(angle + spread) },
      { x: cx + inner * Math.cos(angle + pinch), y: cy + inner * Math.sin(angle + pinch) }
    ];
    bag.draw("mk-yellow", doonfPoly(tip));
  }
  bag.draw("mk-yellow", doonfAnnulus(cx, cy, 15, 14.2).split(" M")[0] + " Z");
  bag.box(w, h);
  return bag.done("0 0 " + w + " " + h);
}

function doonfAlbania() {
  var bag = doonfBag();
  bag.rect("al-red", 0, 0, 700, 500);
  bag.draw("black", doonfEagle(350, 250, 200));
  bag.box(700, 500);
  return bag.done("0 0 700 500");
}

function doonfUnionJack() {
  var bag = doonfBag();
  var w = 50;
  var h = 30;
  bag.rect("gb-blue", 0, 0, w, h);
  var corners = [
    [0, 0, 20, 10],
    [30, 0, 20, 10],
    [0, 20, 20, 10],
    [30, 20, 20, 10]
  ];
  var whiteA = doonfBandPts(0, 0, 50, 30, 3);
  var whiteB = doonfBandPts(50, 0, 0, 30, 3);
  var redA = [
    { pts: doonfHalfPts(0, 0, 50, 30, 2, 1), corners: [0] },
    { pts: doonfHalfPts(0, 0, 50, 30, 2, -1), corners: [3] }
  ];
  var redB = [
    { pts: doonfHalfPts(50, 0, 0, 30, 2, 1), corners: [1] },
    { pts: doonfHalfPts(50, 0, 0, 30, 2, -1), corners: [2] }
  ];
  function place(pts, indexes, color) {
    indexes.forEach(function (index) {
      var box = corners[index];
      var clipped = doonfClipPoly(pts, doonfRectClip(box[0], box[1], box[2], box[3]));
      if (clipped.length > 2) bag.draw(color, doonfPoly(clipped));
    });
  }
  corners.forEach(function (box, index) {
    place(whiteA, [index], "white");
    place(whiteB, [index], "white");
  });
  redA.concat(redB).forEach(function (piece) {
    place(piece.pts, piece.corners, "gb-red");
  });
  bag.draw("white", doonfCrossPath(20, 10, 10, 10, w, h));
  bag.draw("gb-red", doonfCrossPath(22, 12, 6, 6, w, h));
  bag.box(w, h);
  return bag.done("0 0 50 30");
}

function doonfBelarus() {
  var bag = doonfBag();
  bag.rect("by-red", 0, 0, 900, 300);
  bag.rect("by-green", 0, 300, 900, 150);
  bag.rect("white", 0, 0, 110, 450);
  var motif = "";
  for (var i = -3; i <= 3; i++) {
    var cy = 225 + i * 58;
    motif += doonfPoly([
      { x: 55, y: cy - 22 },
      { x: 78, y: cy },
      { x: 55, y: cy + 22 },
      { x: 32, y: cy }
    ]);
    motif += " M40 " + doonfNum(cy - 10) + " H70 V" + doonfNum(cy - 4) + " H40 Z";
    motif += " M18 " + doonfNum(cy - 8) + " H30 V" + doonfNum(cy + 8) + " H18 Z";
    motif += " M80 " + doonfNum(cy - 8) + " H92 V" + doonfNum(cy + 8) + " H80 Z";
  }
  bag.draw("by-red", motif);
  bag.box(900, 450);
  bag.edge("M110 0 V450");
  bag.edge("M110 300 H900");
  return bag.done("0 0 900 450");
}

function doonfAndorra() {
  var bag = doonfBag();
  bag.rect("ad-blue", 0, 0, 320, 700);
  bag.rect("ad-yellow", 320, 0, 360, 700);
  bag.rect("ad-red", 680, 0, 320, 700);
  var shield = doonfShield(500, 230, 210, 250);
  bag.draw("white", shield);
  bag.paint("ad-red", "M408 248 H500 V360 H408 Z");
  bag.draw("gold", doonfMitre(454, 285, 28));
  bag.edge("M454 268 V330");
  bag.paint("ad-yellow", "M500 248 H592 V360 H500 Z");
  [524, 548, 572].forEach(function (x) {
    bag.draw("ad-red", "M" + x + " 248 H" + (x + 14) + " V360 H" + x + " Z");
  });
  bag.paint("ad-yellow", "M408 360 H500 V470 H408 Z");
  [418, 440, 462, 484].forEach(function (x) {
    bag.draw("ad-red", "M" + x + " 360 H" + (x + 12) + " V455 H" + x + " Z");
  });
  bag.paint("ad-yellow", "M500 360 H592 V490 Q546 500 500 455 Z");
  bag.draw("ad-red", doonfCow(530, 400, 22));
  bag.draw("ad-red", doonfCow(562, 445, 20));
  bag.edge("M500 248 V455");
  bag.edge("M408 360 H592");
  bag.box(1000, 700);
  bag.edge("M320 0 V700");
  bag.edge("M680 0 V700");
  return bag.done("0 0 1000 700");
}

function doonfCroatia() {
  var bag = doonfBag();
  bag.rect("hr-red", 0, 0, 2400, 400);
  bag.rect("white", 0, 400, 2400, 400);
  bag.rect("hr-blue", 0, 800, 2400, 400);
  var x0 = 1100;
  var y0 = 250;
  var cell = 40;
  for (var row = 0; row < 5; row++) {
    for (var col = 0; col < 5; col++) {
      bag.rect((row + col) % 2 === 0 ? "hr-red" : "white", x0 + col * cell, y0 + row * cell, cell, cell);
    }
  }
  for (var g = 0; g <= 5; g++) {
    bag.edge("M" + (x0 + g * cell) + " " + y0 + " V" + (y0 + 5 * cell));
    bag.edge("M" + x0 + " " + (y0 + g * cell) + " H" + (x0 + 5 * cell));
  }
  bag.draw("hr-red", "M1100 450 H1300 L1200 560 Z");
  bag.edge(doonfShield(1200, 250, 200, 310));
  [[1030, 150], [1115, 110], [1200, 90], [1285, 110], [1370, 150]].forEach(function (crown, index) {
    bag.draw(index === 1 ? "hr-red" : "hr-blue", doonfShield(crown[0], crown[1], 70, 90));
  });
  bag.draw("gold", doonfPoly(doonfStar(1030, 185, 14, 6, 6, -Math.PI / 2)));
  bag.rect("white", 1128, 130, 44, 10);
  bag.rect("hr-blue", 1128, 150, 44, 10);
  bag.rect("white", 1128, 170, 44, 10);
  bag.dot("gold", 1175, 145, 5);
  bag.dot("gold", 1200, 145, 5);
  bag.dot("gold", 1225, 145, 5);
  bag.draw("gold", doonfCow(1285, 155, 16));
  bag.draw("gold", doonfPoly(doonfStar(1370, 140, 8, 3, 6, -Math.PI / 2)));
  bag.rect("hr-red", 1348, 165, 44, 12);
  bag.box(2400, 1200);
  bag.edge("M0 400 H2400");
  bag.edge("M0 800 H2400");
  return bag.done("0 0 2400 1200");
}

function doonfSlovakia() {
  var bag = doonfBag();
  bag.rect("white", 0, 0, 300, 66.67);
  bag.rect("sk-blue", 0, 66.67, 300, 66.67);
  bag.rect("sk-red", 0, 133.34, 300, 66.66);
  bag.draw("sk-red", doonfShield(70, 28, 86, 140));
  bag.draw("sk-blue", doonfHills(70, 150, 34));
  bag.draw("white", doonfDoubleCross(70, 40, 48));
  bag.box(300, 200);
  bag.edge("M0 66.67 H300");
  bag.edge("M0 133.34 H300");
  return bag.done("0 0 300 200");
}

function doonfSlovenia() {
  var bag = doonfBag();
  bag.rect("white", 0, 0, 400, 66.67);
  bag.rect("si-blue", 0, 66.67, 400, 66.67);
  bag.rect("si-red", 0, 133.34, 400, 66.66);
  bag.draw("white", doonfShield(62, 36, 78, 120));
  bag.draw("si-blue", "M30 52 H94 V78 H30 Z");
  bag.draw("gold", doonfPoly(doonfStar(48, 64, 8, 3.2, 6, -Math.PI / 2)));
  bag.draw("gold", doonfPoly(doonfStar(62, 56, 8, 3.2, 6, -Math.PI / 2)));
  bag.draw("gold", doonfPoly(doonfStar(76, 64, 8, 3.2, 6, -Math.PI / 2)));
  bag.draw("white", "M32 86 L48 68 L62 96 L76 70 L92 86 L84 140 L40 140 Z");
  bag.draw("si-blue", "M36 118 H88 V126 H36 Z M36 132 H88 V140 H36 Z");
  bag.box(400, 200);
  bag.edge("M0 66.67 H400");
  bag.edge("M0 133.34 H400");
  return bag.done("0 0 400 200");
}

function doonfPlus(cx, cy, arm, thick) {
  var t = thick / 2;
  return "M" + doonfNum(cx - t) + " " + doonfNum(cy - arm) +
    " H" + doonfNum(cx + t) + " V" + doonfNum(cy - t) +
    " H" + doonfNum(cx + arm) + " V" + doonfNum(cy + t) +
    " H" + doonfNum(cx + t) + " V" + doonfNum(cy + arm) +
    " H" + doonfNum(cx - t) + " V" + doonfNum(cy + t) +
    " H" + doonfNum(cx - arm) + " V" + doonfNum(cy - t) +
    " H" + doonfNum(cx - t) + " Z";
}

function doonfSerbia() {
  var bag = doonfBag();
  bag.rect("rs-red", 0, 0, 300, 66.67);
  bag.rect("rs-blue", 0, 66.67, 300, 66.67);
  bag.rect("white", 0, 133.34, 300, 66.66);
  bag.draw("gold", doonfEagle(92, 108, 52));
  bag.draw("gold", doonfCrown(92, 42, 16));
  bag.draw("rs-red", doonfShield(92, 86, 28, 36));
  bag.draw("white", doonfPlus(92, 102, 10, 3));
  [[80, 94], [104, 94], [80, 112], [104, 112]].forEach(function (fire) {
    bag.draw("silver", "M" + fire[0] + " " + fire[1] + " h8 v6 h-5 v-3 h-3 z");
  });
  bag.box(300, 200);
  bag.edge("M0 66.67 H300");
  bag.edge("M0 133.34 H300");
  return bag.done("0 0 300 200");
}

function doonfPortugal() {
  var bag = doonfBag();
  bag.rect("pt-green", 0, 0, 240, 400);
  bag.rect("pt-red", 240, 0, 360, 400);
  bag.hole("pt-yellow", doonfAnnulus(250, 200, 108, 10));
  bag.hole("pt-yellow", doonfEllipseRing(250, 200, 96, 36, 8, 0.5));
  bag.hole("pt-yellow", doonfEllipseRing(250, 200, 96, 36, 8, -0.6));
  bag.draw("pt-yellow", "M244 100 H256 V300 H244 Z");
  bag.draw("pt-red", doonfShield(250, 145, 92, 130));
  bag.draw("white", doonfShield(250, 160, 68, 100));
  [[250, 195], [226, 214], [274, 214], [232, 242], [268, 242]].forEach(function (quina) {
    bag.draw("pt-blue", doonfShield(quina[0], quina[1], 22, 28));
    [[0, -4], [-5, 1], [5, 1], [-3, 7], [3, 7]].forEach(function (dot) {
      bag.dot("white", quina[0] + dot[0], quina[1] + 12 + dot[1], 1.6);
    });
  });
  [[210, 155], [250, 148], [290, 155], [198, 200], [302, 200], [214, 255], [286, 255]].forEach(function (castle) {
    bag.draw("pt-yellow", doonfCastle(castle[0], castle[1], 10));
  });
  bag.box(600, 400);
  bag.edge("M240 0 V400");
  return bag.done("0 0 600 400");
}

function doonfVatican() {
  var bag = doonfBag();
  bag.rect("va-yellow", 0, 0, 100, 200);
  bag.rect("white", 100, 0, 100, 200);
  bag.draw("gold", doonfKey(145, 115, 48, 1));
  bag.draw("silver", doonfKey(155, 115, 48, -1));
  bag.draw("va-red", "M140 108 H160 V122 H140 Z");
  bag.draw("gold", "M150 42 H162 V58 H174 V70 H162 V86 H150 V70 H138 V58 H150 Z");
  bag.draw("gold", "M132 86 H168 V98 H132 Z M128 98 H172 V112 H128 Z M124 112 H176 V128 H124 Z");
  bag.box(200, 200);
  bag.edge("M100 0 V200");
  return bag.done("0 0 200 200");
}

function doonfMalta() {
  var bag = doonfBag();
  bag.rect("white", 0, 0, 150, 200);
  bag.rect("mt-red", 150, 0, 150, 200);
  bag.draw("silver", "M28 18 H44 L52 34 H68 V50 L52 58 V78 H44 L36 62 H16 V46 L28 38 Z");
  bag.draw("black", "M40 36 H48 V58 H40 Z M30 44 H58 V50 H30 Z");
  bag.box(300, 200);
  bag.edge("M150 0 V200");
  return bag.done("0 0 300 200");
}

function doonfLiechtenstein() {
  var bag = doonfBag();
  bag.rect("li-blue", 0, 0, 500, 150);
  bag.rect("li-red", 0, 150, 500, 150);
  bag.draw("gold", doonfCrown(70, 48, 28));
  bag.dot("gold", 52, 28, 4);
  bag.dot("gold", 70, 18, 4);
  bag.dot("gold", 88, 28, 4);
  bag.box(500, 300);
  bag.edge("M0 150 H500");
  return bag.done("0 0 500 300");
}

function doonfCyprus() {
  var bag = doonfBag();
  bag.rect("white", 0, 0, 900, 600);
  bag.draw("cy-copper", "M250 250 C280 180 340 160 390 175 C430 150 500 145 560 170 C640 150 700 175 760 230 C700 250 660 300 620 330 C560 370 480 390 420 360 C360 390 300 370 270 330 C230 340 210 300 250 250 Z");
  bag.draw("cy-green", "M300 430 Q450 390 600 430");
  bag.draw("cy-green", "M320 455 Q450 415 580 455");
  for (var i = 0; i < 7; i++) {
    var t = i / 6;
    var x = 310 + t * 280;
    var y = 430 - Math.sin(t * Math.PI) * 28;
    bag.draw("cy-green", "M" + doonfNum(x) + " " + doonfNum(y) + " l8 -14 l8 14 Z");
    bag.draw("cy-green", "M" + doonfNum(x) + " " + doonfNum(y + 24) + " l8 14 l8 -14 Z");
  }
  bag.box(900, 600);
  return bag.done("0 0 900 600");
}

function doonfKosovo() {
  var bag = doonfBag();
  bag.rect("xk-blue", 0, 0, 210, 150);
  bag.draw("xk-gold", "M78 78 L92 62 L112 58 L128 68 L136 86 L124 108 L100 116 L82 108 L70 90 Z");
  for (var i = 0; i < 6; i++) {
    var a = Math.PI + (Math.PI * (i + 0.5)) / 6;
    var x = 105 + Math.cos(a) * 48;
    var y = 78 + Math.sin(a) * 28;
    bag.draw("white", doonfPoly(doonfStar(x, y, 7, 2.8, 5, -Math.PI / 2)));
  }
  bag.box(210, 150);
  return bag.done("0 0 210 150");
}

function doonfMoldova() {
  var bag = doonfBag();
  bag.rect("md-blue", 0, 0, 200, 300);
  bag.rect("md-yellow", 200, 0, 200, 300);
  bag.rect("md-red", 400, 0, 200, 300);
  bag.draw("gold", doonfEagle(300, 160, 70));
  bag.draw("gold", "M300 78 H308 V108 H300 Z M292 86 H316 V94 H292 Z");
  bag.draw("md-red", doonfShield(300, 130, 48, 62));
  bag.draw("black", "M300 148 m-10 8 a10 8 0 1 0 20 0 a10 8 0 1 0 -20 0 M286 146 L292 138 M314 146 L308 138");
  bag.draw("leaf", "M250 200 Q270 230 300 210");
  bag.draw("gold", "M350 150 V230");
  bag.box(600, 300);
  bag.edge("M200 0 V300");
  bag.edge("M400 0 V300");
  return bag.done("0 0 600 300");
}

function doonfSanMarino() {
  var bag = doonfBag();
  bag.rect("white", 0, 0, 400, 150);
  bag.rect("sm-blue", 0, 150, 400, 150);
  bag.draw("white", doonfShield(200, 70, 120, 160));
  bag.draw("sm-blue", doonfShield(200, 78, 104, 144));
  bag.draw("leaf", "M150 190 Q170 150 200 175 Q230 145 250 190 Q220 175 200 190 Q180 175 150 190 Z");
  bag.draw("white", doonfCastle(168, 150, 14));
  bag.draw("white", doonfCastle(200, 132, 16));
  bag.draw("white", doonfCastle(232, 150, 14));
  bag.draw("gold", doonfCrown(200, 48, 26));
  bag.draw("leaf", "M120 150 Q150 210 200 230 Q250 210 280 150");
  bag.box(400, 300);
  bag.edge("M0 150 H400");
  return bag.done("0 0 400 300");
}

function doonfMontenegro() {
  var bag = doonfBag();
  bag.rect("me-red", 0, 0, 200, 400);
  bag.draw("gold", "M18 18 H182 V382 H18 Z");
  bag.rect("me-red", 28, 28, 144, 344);
  bag.draw("gold", doonfEagle(100, 210, 70));
  bag.draw("gold", doonfCrown(100, 95, 24));
  bag.draw("azure", doonfShield(100, 175, 40, 52));
  bag.draw("gold", doonfLion(100, 185, 16));
  bag.box(200, 400);
  return bag.done("0 0 200 400");
}

var DOONF_EUROPE_FLAGS = doonfEasyFlags();
DOONF_EUROPE_FLAGS.latvia = doonfLatvia();
DOONF_EUROPE_FLAGS.czechia = doonfCzechia();
DOONF_EUROPE_FLAGS.greece = doonfGreece();
DOONF_EUROPE_FLAGS.bosnia = doonfBosnia();
DOONF_EUROPE_FLAGS.northMacedonia = doonfMacedonia();
DOONF_EUROPE_FLAGS.albania = doonfAlbania();
DOONF_EUROPE_FLAGS.unitedKingdom = doonfUnionJack();
DOONF_EUROPE_FLAGS.belarus = doonfBelarus();
DOONF_EUROPE_FLAGS.andorra = doonfAndorra();
DOONF_EUROPE_FLAGS.croatia = doonfCroatia();
DOONF_EUROPE_FLAGS.slovakia = doonfSlovakia();
DOONF_EUROPE_FLAGS.slovenia = doonfSlovenia();
DOONF_EUROPE_FLAGS.serbia = doonfSerbia();
DOONF_EUROPE_FLAGS.portugal = doonfPortugal();
DOONF_EUROPE_FLAGS.vatican = doonfVatican();
DOONF_EUROPE_FLAGS.malta = doonfMalta();
DOONF_EUROPE_FLAGS.liechtenstein = doonfLiechtenstein();
DOONF_EUROPE_FLAGS.cyprus = doonfCyprus();
DOONF_EUROPE_FLAGS.kosovo = doonfKosovo();
DOONF_EUROPE_FLAGS.moldova = doonfMoldova();
DOONF_EUROPE_FLAGS.sanMarino = doonfSanMarino();
DOONF_EUROPE_FLAGS.montenegro = doonfMontenegro();

Object.keys(DOONF_EUROPE_FLAGS).forEach(function (id) {
  DOONF_FLAG_SHAPES[id] = DOONF_EUROPE_FLAGS[id];
});
