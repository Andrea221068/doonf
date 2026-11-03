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
  bag.draw("cy-copper", "M371.7 385.9L371.2 371.3L368.8 364.7L364 359.7L355.8 355L340 356.9L333.2 360L319 362.4L310.7 357.3L301.7 356.5L299.2 353L295.9 350.9L282.2 346.2L271.1 344.3L258 334.2L249.4 319.1L248.6 306.1L245.8 303.9L239.3 302.3L237.7 299.7L232.8 281.2L232.6 272.8L226.3 265.7L219.5 251.4L217.1 242.7L216.5 228.8L221.1 234.4L234.5 244L244.8 247.3L253.9 247.8L259.9 246.2L263.4 243.3L271.2 233L280.3 217.2L285.6 211.7L292.9 212.6L306.3 208.3L319.9 209.7L339.5 217.1L352.1 217.6L358.4 216.1L364.1 212L366.9 208.4L369.8 200.6L370.9 191.3L373.8 186.8L373 183.2L373.7 173.7L369.4 166.5L370.8 145.8L386.4 155.1L399.4 159.3L412.9 160L473.2 170.2L512.8 165.2L522.9 162.7L534.9 162L548.4 153.1L559.9 148.1L585.5 142L600.4 136.3L627.8 119.3L637.3 117.4L677.3 95.6L682.5 95.5L687.9 93.6L709.6 76.2L719.3 74.8L743.1 62.7L741.6 75.4L731.8 89.5L717.3 94.8L709.5 100.1L707.8 107.1L705.5 110.4L692.9 115.9L679.6 126.6L658.2 138L644.8 149.9L633.1 166.6L619.6 175L607.2 178.6L600.3 187.1L595.3 200.7L598 215.9L604.8 225.9L631.2 257.4L636.2 269.4L621.5 268.9L611.9 265.2L607 265.1L599.6 267.8L589.6 275.8L584.5 277.5L563.5 267.1L539.6 271.1L536.7 273.8L532.3 282.6L530.7 294.8L532.2 296.6L532.1 300.7L527.3 312.6L516.3 313.5L503.7 323.3L487.8 327.7L469.5 338.2L457.9 340.8L449.3 345.9L424.8 344.6L404.7 349.9L397 355.3L392.2 362.5L393.1 374L396.9 382.8L393.7 384.1L382.5 383.4L372.6 386.2Z");
  bag.draw("cy-green", "M251.2 392.1L258.3 407.2L262 413.8L264.7 417.9L267.7 421.7L270.1 423.8L273.4 426L275.8 427.1L282.7 429.7L282.4 425.5L281.5 420.6L280 416.9L278 413.7L274.3 409.2L266.8 402.7L259 396.8L254.3 393.8L251.5 392.3Z");
  bag.draw("cy-green", "M648.8 392.1L641.7 407.2L638 413.8L635.3 417.9L632.3 421.7L629.9 423.8L626.6 426L624.2 427.1L617.3 429.7L617.6 425.5L618.5 420.6L620 416.9L622 413.7L625.7 409.2L633.2 402.7L641 396.8L645.7 393.8L648.5 392.3Z");
  bag.draw("cy-green", "M283.4 400.3L284 407.5L284.8 414.5L285.4 417.8L286.6 421.6L287.6 424L290 428.5L291.5 430.5L295.5 434.8L296.5 431.1L297 427.4L296.8 424.2L295.7 419.4L293.2 413.5L289.8 407.1L286.9 403.4L283.9 400.7Z");
  bag.draw("cy-green", "M616.6 400.3L616 407.5L615.2 414.5L614.6 417.8L613.4 421.6L612.4 424L610 428.5L608.5 430.5L604.5 434.8L603.5 431.1L603 427.4L603.2 424.2L604.3 419.4L606.8 413.5L610.2 407.1L613.1 403.4L616.1 400.7Z");
  bag.draw("cy-green", "M255.8 430.4L261.8 436.2L266 439.7L268 441.3L271.5 443.4L274.8 444.8L278.2 445.7L280.6 445.9L286.5 445.7L285.4 442.5L284.3 440.5L282.5 438.1L281.3 436.9L278.2 434.9L273 432.6L268.6 431.1L263.2 430.3L258.8 430.2L256.1 430.3Z");
  bag.draw("cy-green", "M644.2 430.4L638.2 436.2L634 439.7L632 441.3L628.5 443.4L625.2 444.8L621.8 445.7L619.4 445.9L613.5 445.7L614.6 442.5L615.7 440.5L617.5 438.1L618.7 436.9L621.8 434.9L627 432.6L631.4 431.1L636.8 430.3L641.2 430.2L643.9 430.3Z");
  bag.draw("cy-green", "M284.6 433.4L289 441.8L291.8 446.7L296.3 452.7L299.8 456.3L304 459.4L306.5 461L310.8 463.1L314 464.1L316.5 464.3L316 460.3L315 456.6L312.6 452.2L309.5 448.2L307.2 445.8L304.7 443.6L300.9 441L293.7 437.3L285 433.5Z");
  bag.draw("cy-green", "M615.4 433.4L611 441.8L608.2 446.7L603.7 452.7L600.2 456.3L596 459.4L593.5 461L589.2 463.1L586 464.1L583.5 464.3L584 460.3L585 456.6L587.4 452.2L590.5 448.2L592.8 445.8L595.3 443.6L599.1 441L606.3 437.3L615 433.5Z");
  bag.draw("cy-green", "M282.8 462.2L289.2 468L292.8 470.8L297.1 473.4L300.1 474.8L303.2 475.8L306.6 476.4L309.9 476.7L315.6 476.7L320.1 476L319.4 473.7L318.4 472.1L316.7 470.2L314.2 468L311.4 466.2L308.4 464.8L303.7 463.2L299.8 462.4L291.5 462L283.2 462.2Z");
  bag.draw("cy-green", "M617.2 462.2L610.8 468L607.2 470.8L602.9 473.4L599.9 474.8L596.8 475.8L593.4 476.4L590.1 476.7L584.4 476.7L579.9 476L580.6 473.7L581.6 472.1L583.3 470.2L585.8 468L588.6 466.2L591.6 464.8L596.3 463.2L600.2 462.4L608.5 462L616.8 462.2Z");
  bag.draw("cy-green", "M307.5 428.9L309.9 437.4L311.4 441.7L314.1 447.7L316.5 452L319.5 456.1L323 459.7L325 460.9L329.9 463.1L329.5 457.6L328.8 453.9L327.8 450.8L326.5 447.8L324.1 443.6L320.6 439.5L314 433.4L309.6 429.9L307.7 429Z");
  bag.draw("cy-green", "M592.5 428.9L590.1 437.4L588.6 441.7L585.9 447.7L583.5 452L580.5 456.1L577 459.7L575 460.9L570.1 463.1L570.5 457.6L571.2 453.9L572.2 450.8L573.5 447.8L575.9 443.6L579.4 439.5L586 433.4L590.4 429.9L592.3 429Z");
  bag.draw("cy-green", "M319.3 466.3L324.1 471.5L327.5 474.9L333.2 479.3L337.6 482.3L342.1 484.8L346.7 486.7L350 487.4L355.1 487.8L360.2 487.4L357.2 482.1L354.8 478.8L352.3 476.6L348.1 473.7L342 470.7L338.8 469.4L334 467.9L328.5 466.8L319.9 466.4Z");
  bag.draw("cy-green", "M580.7 466.3L575.9 471.5L572.5 474.9L566.8 479.3L562.4 482.3L557.9 484.8L553.3 486.7L550 487.4L544.9 487.8L539.8 487.4L542.8 482.1L545.2 478.8L547.7 476.6L551.9 473.7L558 470.7L561.2 469.4L566 467.9L571.5 466.8L580.1 466.4Z");
  bag.draw("cy-green", "M345.1 462.4L351.2 470.8L353.7 473.5L356.4 475.7L360.6 478.8L367.4 483.1L370.2 484.4L373.7 485.3L380.7 485.4L379.7 481.7L378.3 478.3L375.4 474.5L371.8 471.2L369.2 469.4L366.3 467.7L363.3 466.3L358.7 464.5L354.9 463.5L345.7 462.4Z");
  bag.draw("cy-green", "M554.9 462.4L548.8 470.8L546.3 473.5L543.6 475.7L539.4 478.8L532.6 483.1L529.8 484.4L526.3 485.3L519.3 485.4L520.3 481.7L521.7 478.3L524.6 474.5L528.2 471.2L530.8 469.4L533.7 467.7L536.7 466.3L541.3 464.5L545.1 463.5L554.3 462.4Z");
  bag.draw("cy-green", "M324.9 494.6L328.8 497L333.4 499.1L339.7 500.9L346.7 502L351.8 502L358.9 501.5L361.1 501L363.3 500.2L366.8 498.5L364.3 495.6L362.8 494.2L361 493.1L356.3 491.5L349.3 490.4L342.6 490.1L336.3 490.8L333.7 491.3L329.4 492.5L325.1 494.5Z");
  bag.draw("cy-green", "M575.1 494.6L571.2 497L566.6 499.1L560.3 500.9L553.3 502L548.2 502L541.1 501.5L538.9 501L536.7 500.2L533.2 498.5L535.7 495.6L537.2 494.2L539 493.1L543.7 491.5L550.7 490.4L557.4 490.1L563.7 490.8L566.3 491.3L570.6 492.5L574.9 494.5Z");
  bag.draw("cy-green", "M362.5 489.3L373.5 497.5L377.5 500L382.1 502.3L386.9 504.1L391.9 505.5L397.7 506.3L402.8 506.4L409.3 506L408.1 503.1L406.6 500.5L404.2 498.2L400.3 495.3L395.9 493L391.3 491.2L388 490.5L384.6 490L372.1 489.2L363.2 489.3Z");
  bag.draw("cy-green", "M537.5 489.3L526.5 497.5L522.5 500L517.9 502.3L513.1 504.1L508.1 505.5L502.3 506.3L497.2 506.4L490.7 506L491.9 503.1L493.4 500.5L495.8 498.2L499.7 495.3L504.1 493L508.7 491.2L512 490.5L515.4 490L527.9 489.2L536.8 489.3Z");
  bag.draw("cy-green", "M395.1 482.3L399.8 489L403.3 493.5L406.9 497.6L409.9 500.4L414.1 503.4L418.7 505.8L422.4 507.1L427.7 508L432.3 508.4L432.1 505.4L431 502.4L429.2 499.6L427 496.9L424.5 494.5L418.9 490.6L415.8 488.8L411 486.5L406.1 484.6L403.6 483.9L395.9 482.4Z");
  bag.draw("cy-green", "M504.9 482.3L500.2 489L496.7 493.5L493.1 497.6L490.1 500.4L485.9 503.4L481.3 505.8L477.6 507.1L472.3 508L467.7 508.4L467.9 505.4L469 502.4L470.8 499.6L473 496.9L475.5 494.5L481.1 490.6L484.2 488.8L489 486.5L493.9 484.6L496.4 483.9L504.1 482.4Z");
  bag.draw("cy-green", "M382.1 515.5L395.9 518.6L399.7 519.1L404.4 519.4L410.8 519.1L415.8 518.4L418.9 517.4L421.4 516.1L423.4 514.9L425.9 512.8L424.7 511.6L423.3 510.7L420.1 509.4L416.9 508.8L411.9 508.3L404.9 508.5L396.2 509.8L389.4 511.8L382.9 515.1Z");
  bag.draw("cy-green", "M517.9 515.5L504.1 518.6L500.3 519.1L495.6 519.4L489.2 519.1L484.2 518.4L481.1 517.4L478.6 516.1L476.6 514.9L474.1 512.8L475.3 511.6L476.7 510.7L479.9 509.4L483.1 508.8L488.1 508.3L495.1 508.5L503.8 509.8L510.6 511.8L517.1 515.1Z");
  bag.draw("cy-green", "M430.4 512.5L431.9 513.6L443 516.9L448 518.8L451.1 520.4L453.6 522.4L458.1 526.9L463.3 533.2L466.2 537.1L467 537.1L467.5 533.3L468.3 529.8L469.5 527.9L471.5 526.2L471.5 525L465.2 521.3L460.4 518.8L455.4 516.5L452.1 515.3L447.3 514L441 512.9L437.8 512.6L431.2 512.5Z");
  bag.draw("cy-green", "M469.6 512.5L468.1 513.6L457 516.9L452 518.8L448.9 520.4L446.4 522.4L441.9 526.9L436.7 533.2L433.8 537.1L433 537.1L432.5 533.3L431.7 529.8L430.5 527.9L428.5 526.2L428.5 525L434.8 521.3L439.6 518.8L444.6 516.5L447.9 515.3L452.7 514L459 512.9L462.2 512.6L468.8 512.5Z");
  bag.draw("cy-green", "M283.7 452.5L283.5 454.2L283.8 456L284.6 457.6L285.5 458.6L286.6 459.5L289.1 460.6L290.4 460.7L291.6 460.4L292.8 459.5L293.5 458.3L293.6 456.9L293.4 455.4L292.8 454.1L291.9 452.8L290.7 451.7L289.3 450.9L288 450.6L286.7 450.5L285.5 450.8L284.4 451.5Z");
  bag.draw("cy-green", "M616.3 452.5L616.5 454.2L616.2 456L615.4 457.6L614.5 458.6L613.4 459.5L610.9 460.6L609.6 460.7L608.4 460.4L607.2 459.5L606.5 458.3L606.4 456.9L606.6 455.4L607.2 454.1L608.1 452.8L609.3 451.7L610.7 450.9L612 450.6L613.3 450.5L614.5 450.8L615.6 451.5Z");
  bag.draw("cy-green", "M300.3 428.2L299.5 429.4L299 430.8L298.8 433.8L299.1 435.3L299.7 436.8L301.5 439.2L302.6 439.9L303.8 440.3L305.2 440L306.4 439.1L307.2 437.8L307.6 436.2L307.7 434.5L307.5 432.7L306.9 431L306 429.5L305 428.5L303.9 427.7L302.6 427.4L301.4 427.5Z");
  bag.draw("cy-green", "M599.7 428.2L600.5 429.4L601 430.8L601.2 433.8L600.9 435.3L600.3 436.8L598.5 439.2L597.4 439.9L596.2 440.3L594.8 440L593.6 439.1L592.8 437.8L592.4 436.2L592.3 434.5L592.5 432.7L593.1 431L594 429.5L595 428.5L596.1 427.7L597.4 427.4L598.6 427.5Z");
  bag.draw("cy-green", "M320.1 485L320.8 486.1L321.9 487.1L324.4 488.3L325.9 488.5L327.4 488.5L330.3 487.7L331.4 487L332.2 486L332.6 484.5L332.3 483.1L331.5 481.9L330.2 481L328.8 480.4L327.1 480L325.4 479.9L323.7 480.2L322.4 480.7L321.2 481.5L320.4 482.5L320 483.7Z");
  bag.draw("cy-green", "M579.9 485L579.2 486.1L578.1 487.1L575.6 488.3L574.1 488.5L572.6 488.5L569.7 487.7L568.6 487L567.8 486L567.4 484.5L567.7 483.1L568.5 481.9L569.8 481L571.2 480.4L572.9 480L574.6 479.9L576.3 480.2L577.6 480.7L578.8 481.5L579.6 482.5L580 483.7Z");
  bag.draw("cy-green", "M367.3 508.9L368.6 510.2L370.3 511L372.1 511.5L373.5 511.4L375 511.1L377.7 509.8L378.6 508.9L379.2 507.8L379.4 506.3L378.9 505L377.8 504L376.5 503.3L375 502.9L373.3 502.8L371.6 503L370 503.6L368.8 504.3L367.8 505.3L367.2 506.5L367 507.7Z");
  bag.draw("cy-green", "M532.7 508.9L531.4 510.2L529.7 511L527.9 511.5L526.5 511.4L525 511.1L522.3 509.8L521.4 508.9L520.8 507.8L520.6 506.3L521.1 505L522.2 504L523.5 503.3L525 502.9L526.7 502.8L528.4 503L530 503.6L531.2 504.3L532.2 505.3L532.8 506.5L533 507.7Z");
  bag.draw("cy-green", "M332.1 457.8L331.9 459.2L332 460.6L332.4 462L333.1 463.3L334 464.4L335.2 465.3L338 466.5L339.9 466.6L341.7 466.3L342.5 465.4L342.9 462.5L342.6 460.9L342 459.5L341 458.1L339.7 456.9L338.2 456.1L336.8 455.7L335.4 455.6L334 455.9L332.9 456.6Z");
  bag.draw("cy-green", "M567.9 457.8L568.1 459.2L568 460.6L567.6 462L566.9 463.3L566 464.4L564.8 465.3L562 466.5L560.1 466.6L558.3 466.3L557.5 465.4L557.1 462.5L557.4 460.9L558 459.5L559 458.1L560.3 456.9L561.8 456.1L563.2 455.7L564.6 455.6L566 455.9L567.1 456.6Z");
  bag.draw("cy-green", "M383.4 479.1L383 480.4L382.9 481.8L383.6 484.5L384.4 485.8L385.4 486.9L387.9 488.6L389.2 489L390.4 489L391.8 488.4L392.7 487.3L393 485.8L393 484.3L392.5 482.8L391.8 481.3L390.7 479.9L389.4 478.8L388.1 478.1L386.8 477.7L385.4 477.7L384.3 478.2Z");
  bag.draw("cy-green", "M516.6 479.1L517 480.4L517.1 481.8L516.4 484.5L515.6 485.8L514.6 486.9L512.1 488.6L510.8 489L509.6 489L508.2 488.4L507.3 487.3L507 485.8L507 484.3L507.5 482.8L508.2 481.3L509.3 479.9L510.6 478.8L511.9 478.1L513.2 477.7L514.6 477.7L515.7 478.2Z");
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
