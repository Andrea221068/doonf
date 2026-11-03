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
    cut: function (color, d) {
      areas += '<path data-fill="' + color + '" fill-rule="evenodd" d="' + d + '"></path>';
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
  bag.draw("ba-blue", "M0 0L16 0L16 8L0 8Z");
  bag.draw("ba-yellow", "M4.2 0L12.2 0L12.2 8Z");
  bag.draw("white", "M2.4 0.5L2.8 -0.8L3.2 0.5L2.1 -0.3L3.5 -0.3Z");
  bag.draw("white", "M3.4 1.5L3.8 0.2L4.2 1.5L3.1 0.7L4.5 0.7Z");
  bag.draw("white", "M4.4 2.5L4.8 1.2L5.2 2.5L4.1 1.7L5.5 1.7Z");
  bag.draw("white", "M5.4 3.5L5.8 2.2L6.2 3.5L5.1 2.7L6.5 2.7Z");
  bag.draw("white", "M6.4 4.5L6.8 3.2L7.2 4.5L6.1 3.7L7.5 3.7Z");
  bag.draw("white", "M7.4 5.5L7.8 4.2L8.2 5.5L7.1 4.7L8.5 4.7Z");
  bag.draw("white", "M8.4 6.5L8.8 5.2L9.2 6.5L8.1 5.7L9.5 5.7Z");
  bag.draw("white", "M9.4 7.5L9.8 6.2L10.2 7.5L9.1 6.7L10.5 6.7Z");
  bag.draw("white", "M10.4 8.5L10.8 7.2L11.2 8.5L10.1 7.7L11.5 7.7Z");
  bag.box(16, 8);
  return bag.done("0 0 16 8");
}


function doonfMacedonia() {
  var bag = doonfBag();
  bag.draw("mk-red", "M0 0L280 0L280 140L0 140Z");
  bag.draw("mk-yellow", "M0 84L0 56L280 84L280 56ZM126 0L154 0L140 55ZM154 140L126 140L140 85ZM0 0L42 0L152.9 77.7ZM0 140L42 140L152.9 62.3ZM280 0L238 0L127.1 77.7ZM280 140L238 140L127.1 62.3Z");
  bag.draw("mk-yellow", "M160 70L159.5 74.5L158 78.7L155.6 82.5L152.5 85.6L148.7 88L144.5 89.5L140 90L135.5 89.5L131.3 88L127.5 85.6L124.4 82.5L122 78.7L120.5 74.5L120 70L120.5 65.5L122 61.3L124.4 57.5L127.5 54.4L131.3 52L135.5 50.5L140 50L144.5 50.5L148.7 52L152.5 54.4L155.6 57.5L158 61.3L159.5 65.5Z");
  bag.cut("mk-red", "M165 70L164.4 75.6L162.5 80.8L159.5 85.6L155.6 89.5L150.8 92.5L145.6 94.4L140 95L134.4 94.4L129.2 92.5L124.4 89.5L120.5 85.6L117.5 80.8L115.6 75.6L115 70L115.6 64.4L117.5 59.2L120.5 54.4L124.4 50.5L129.2 47.5L134.4 45.6L140 45L145.6 45.6L150.8 47.5L155.6 50.5L159.5 54.4L162.5 59.2L164.4 64.4ZM159.5 65.5L158 61.3L155.6 57.5L152.5 54.4L148.7 52L144.5 50.5L140 50L135.5 50.5L131.3 52L127.5 54.4L124.4 57.5L122 61.3L120.5 65.5L120 70L120.5 74.5L122 78.7L124.4 82.5L127.5 85.6L131.3 88L135.5 89.5L140 90L144.5 89.5L148.7 88L152.5 85.6L155.6 82.5L158 78.7L159.5 74.5L160 70Z");
  bag.box(280, 140);
  return bag.done("0 0 280 140");
}


function doonfAlbania() {
  var bag = doonfBag();
  bag.draw("al-ff0000", "M0 0L700 0L700 500L0 500Z");
  bag.draw("black", "M300.1 97.2L274.4 104.4L273.2 110.7L279.1 107.5L287.9 113.2L273.6 112.4L263.1 104.5L260.3 108.4L268.5 114.8L290.2 116.4L284.2 119.3L273.4 116.8L275.2 119.6L303.7 128.1L316 136.7L322.1 145.6L323.6 152.9L322 161.2L315.3 166.3L308.6 165.6L303.1 160.5L302.6 140.9L269 125.2L263.4 129.1L248 124.5L235 115.7L222.3 101.3L215.9 106.6L216.7 116.1L226 127.2L241.3 135.5L259.1 139.2L262.9 142.5L258 148.4L244.8 147.9L235 145.3L220.6 136.5L216.2 142.7L220.6 151.8L234.4 158.6L259.4 157.8L263.7 159.7L257 167L244.1 171.4L234.3 170.5L219.2 162.8L216 167.5L218.7 174.9L225 180.6L233.4 182.7L245.4 181.3L262.3 175.3L264.4 179.4L254.7 187.3L240.8 193.2L218 190.9L217.2 198.6L225.3 203.8L242.3 202L261 193.6L262.9 195.8L242.7 212.8L218.2 215.9L217.5 224.1L222.6 228.6L232 228.9L245.8 223.2L259.7 213.5L262.4 212.6L264.8 215.1L263.3 221.1L248 236L233.6 241.6L219 240.1L216.3 242.5L216.8 247.5L222.7 253.1L234 252.7L248.9 245.5L265.1 230.6L266.8 233.1L260.1 245.8L247.7 259.1L234.5 265.4L220.6 266L217 270.5L219.5 275.5L227.3 279.6L241.8 277.9L278.3 242L281.3 242.9L281.5 252.2L276.4 260.5L264.1 268.4L263.8 272.4L267.5 275.2L273.5 274.7L282.7 267.6L293.8 244.8L298 244.9L300.1 249.4L289.5 269.3L294.3 270.2L300.1 266.7L311.8 248.6L315.9 251.8L313.4 260.4L300.8 276.8L279 285.2L278.3 288.2L285.5 295.5L254.1 303.8L238.7 293.6L234.4 287.6L222 287.2L217.4 289.6L223.1 291L229.7 297.9L238.2 297.8L246.9 305.8L229.6 305.3L220.4 300.4L207.1 308.9L213.2 307.7L222.8 311.1L228.5 308.6L246.8 309.7L239 314.7L226.6 316.2L221.6 333L226.7 325.7L235.7 325.2L238.8 319.4L253 312L264.8 315.9L269.9 321.7L281.5 322.8L283.3 327.5L284.2 321.4L278.4 313.9L270.5 313.5L260.2 309.1L291.3 301L299.3 308L303.2 308L319 283L327.8 274.7L333.4 274.3L336.7 278.7L336.2 288.2L325.9 305.8L311.8 316.3L296.7 317.7L293.5 321.5L296.6 325.5L306.6 328.1L324.2 320.5L324.1 325.6L317.3 332.4L298.7 341L303.1 345.3L312.1 346L329.6 334.5L330.7 338.9L325.2 349.3L312.4 354L310.6 356.9L315.9 362.3L322.1 362.8L328.8 357.9L335.9 346.1L339.1 346L339.6 358.2L329.1 371.1L350 402.8L370 180L350 144.8L338.4 132.5L343.6 130.8L327.7 122.9L337.3 122.2L323.3 111.6L332.9 104.7L301.7 97.3ZM300.8 105.9L307.2 108.9L300.8 112L294.8 110L297.4 106.3Z");
  bag.draw("black", "M399.9 97.2L425.6 104.4L426.8 110.7L420.9 107.5L412.1 113.2L426.4 112.4L436.9 104.5L439.7 108.4L431.5 114.8L409.8 116.4L415.8 119.3L426.6 116.8L424.8 119.6L396.3 128.1L384 136.7L377.9 145.6L376.4 152.9L378 161.2L384.7 166.3L391.4 165.6L396.9 160.5L397.4 140.9L431 125.2L436.6 129.1L452 124.5L465 115.7L477.7 101.3L484.1 106.6L483.3 116.1L474 127.2L458.7 135.5L440.9 139.2L437.1 142.5L442 148.4L455.2 147.9L465 145.3L479.4 136.5L483.8 142.7L479.4 151.8L465.6 158.6L440.6 157.8L436.3 159.7L443 167L455.9 171.4L465.7 170.5L480.8 162.8L484 167.5L481.3 174.9L475 180.6L466.6 182.7L454.6 181.3L437.7 175.3L435.6 179.4L445.3 187.3L459.2 193.2L482 190.9L482.8 198.6L474.7 203.8L457.7 202L439 193.6L437.1 195.8L457.3 212.8L481.8 215.9L482.5 224.1L477.4 228.6L468 228.9L454.2 223.2L440.3 213.5L437.6 212.6L435.2 215.1L436.7 221.1L452 236L466.4 241.6L481 240.1L483.7 242.5L483.2 247.5L477.3 253.1L466 252.7L451.1 245.5L434.9 230.6L433.2 233.1L439.9 245.8L452.3 259.1L465.5 265.4L479.4 266L483 270.5L480.5 275.5L472.7 279.6L458.2 277.9L421.7 242L418.7 242.9L418.5 252.2L423.6 260.5L435.9 268.4L436.2 272.4L432.5 275.2L426.5 274.7L417.3 267.6L406.2 244.8L402 244.9L399.9 249.4L410.5 269.3L405.7 270.2L399.9 266.7L388.2 248.6L384.1 251.8L386.6 260.4L399.2 276.8L421 285.2L421.7 288.2L414.5 295.5L445.9 303.8L461.3 293.6L465.6 287.6L478 287.2L482.6 289.6L476.9 291L470.3 297.9L461.8 297.8L453.1 305.8L470.4 305.3L479.6 300.4L492.9 308.9L486.8 307.7L477.2 311.1L471.5 308.6L453.2 309.7L461 314.7L473.4 316.2L478.4 333L473.3 325.7L464.3 325.2L461.2 319.4L447 312L435.2 315.9L430.1 321.7L418.5 322.8L416.7 327.5L415.8 321.4L421.6 313.9L429.5 313.5L439.8 309.1L408.7 301L400.7 308L396.8 308L381 283L372.2 274.7L366.6 274.3L363.3 278.7L363.8 288.2L374.1 305.8L388.2 316.3L403.3 317.7L406.5 321.5L403.4 325.5L393.4 328.1L375.8 320.5L375.9 325.6L382.7 332.4L401.3 341L396.9 345.3L387.9 346L370.4 334.5L369.3 338.9L374.8 349.3L387.6 354L389.4 356.9L384.1 362.3L377.9 362.8L371.2 357.9L364.1 346.1L360.9 346L360.4 358.2L370.9 371.1L350 402.8L330 180L350 144.8L361.6 132.5L356.4 130.8L372.3 122.9L362.7 122.2L376.7 111.6L367.1 104.7L398.3 97.3ZM399.2 105.9L392.8 108.9L399.2 112L405.2 110L402.6 106.3Z");
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
  bag.draw("by-ce1720", "M0 0L378 0L378 189L0 189Z");
  bag.draw("white", "M9.6 0L9.6 2.9L7.7 2.9L7.7 5.9L5.4 5.9L3.7 12L0.3 12L0.3 5L3.7 5L3.7 1.3L0.3 1.3L0.3 0ZM15 16.2L13.3 21.8L11.7 21.8L10 16.2L8.3 16.2L8.3 12L10 12L11.7 6.3L13.3 6.3L15 12L16.7 12L16.7 16.2ZM11.5 16L13.6 16L13.6 12.2L11.5 12.2ZM6 38.4L7.7 38.4L7.7 34.7L6 34.7ZM17.3 38.4L19 38.4L19 34.7L17.3 34.7ZM0.3 64.1L3.3 64.1L4.5 70.1L6.4 70.1L6.4 73.3L8.9 73.3L8.9 70.1L10.8 70.1L10.8 66.8L12.5 66.8L12.5 64.1L10 64.1L10 60.9L14.4 60.9L14.4 63L17.1 63L17.1 66.6L19.4 66.6L19.4 70.6L17.8 70.6L17.8 73.5L16.3 73.5L15 79.2L13.1 79.2L11.7 84L9.8 84L9.8 86.9L7 86.9L7 83.8L5.2 83.8L3.7 79L0.3 79L0.3 74.1L3.7 74.1L3.7 69.9L0.3 69.9Z");
  bag.draw("white", "M36.4 0L36.4 2.9L38.3 2.9L38.3 5.9L40.6 5.9L42.3 12L45.7 12L45.7 5L42.3 5L42.3 1.3L45.7 1.3L45.7 0ZM31 16.2L32.7 21.8L34.3 21.8L36 16.2L37.7 16.2L37.7 12L36 12L34.3 6.3L32.7 6.3L31 12L29.3 12L29.3 16.2ZM34.6 16L32.5 16L32.5 12.2L34.6 12.2ZM40 38.4L38.3 38.4L38.3 34.7L40 34.7ZM28.7 38.4L27 38.4L27 34.7L28.7 34.7ZM45.7 64.1L42.7 64.1L41.5 70.1L39.6 70.1L39.6 73.3L37.1 73.3L37.1 70.1L35.2 70.1L35.2 66.8L33.5 66.8L33.5 64.1L36 64.1L36 60.9L31.6 60.9L31.6 63L28.9 63L28.9 66.6L26.6 66.6L26.6 70.6L28.3 70.6L28.3 73.5L29.7 73.5L31 79.2L32.9 79.2L34.3 84L36.2 84L36.2 86.9L39 86.9L39 83.8L40.9 83.8L42.3 79L45.7 79L45.7 74.1L42.3 74.1L42.3 69.9L45.7 69.9Z");
  bag.draw("white", "M22.2 0L22.2 6.7L23.8 6.7L23.8 0L30.6 0L30.6 2.9L28.9 2.9L28.9 5.9L26.4 5.9L24.7 12L21.3 12L19.6 5.9L17.1 5.9L17.1 2.9L15.4 2.9L15.4 0ZM21.7 57.5L20.5 52.5L19 52.5L19 49.6L17.3 49.6L17.3 46.6L15.7 46.6L15.7 44.5L13.8 44.5L13.8 41.6L11.2 41.6L11.2 44.5L9.4 44.5L7.9 49.6L6.2 49.6L6.2 52.5L4.9 52.5L4.9 55.2L3.7 55.2L3.7 58.8L0.3 58.8L0.3 49.6L3.7 49.6L3.7 45.4L0.3 45.4L0.3 38.4L3.7 38.4L3.7 41.4L5.8 41.4L5.8 44.3L7.9 44.3L7.9 41.4L10 41.4L10 38.4L11.7 38.4L11.7 34.7L10 34.7L10 31.7L7.9 31.7L7.9 28.8L5.8 28.8L5.8 31.7L3.7 31.7L3.7 34.7L0.3 34.7L0.3 26L3.7 26L3.7 22.1L0.3 22.1L0.3 16.2L3.7 16.2L5.4 22.3L7.7 22.3L7.7 25L9.6 25L11 30.7L14 30.7L15.4 25L17.3 25L17.3 22.3L19.6 22.3L21.3 16.2L24.7 16.2L26.4 22.3L28.7 22.3L28.7 25L30.6 25L32 30.7L35 30.7L36.4 25L38.3 25L38.3 22.3L40.6 22.3L42.3 16.2L45.7 16.2L45.7 22.1L42.3 22.1L42.3 26L45.7 26L45.7 34.7L42.3 34.7L42.3 31.7L40.2 31.7L40.2 28.8L38.1 28.8L38.1 31.7L36 31.7L36 34.7L34.3 34.7L34.3 38.4L36 38.4L36 41.4L38.1 41.4L38.1 44.3L40.2 44.3L40.2 41.4L42.3 41.4L42.3 38.4L45.7 38.4L45.7 45.4L42.3 45.4L42.3 49.6L45.7 49.6L45.7 58.8L42.3 58.8L42.3 55.2L41.1 55.2L41.1 52.5L39.8 52.5L39.8 49.6L38.1 49.6L36.7 44.5L34.8 44.5L34.8 41.6L32.2 41.6L32.2 44.5L30.4 44.5L30.4 46.6L28.7 46.6L28.7 49.6L27 49.6L27 52.5L25.5 52.5L24.3 57.5ZM22.2 22.5L22.2 28.1L23.8 28.1L23.8 22.5ZM21.3 34.7L21.3 31.7L19.2 31.7L19.2 28.8L17.1 28.8L17.1 31.7L15 31.7L15 34.7L13.3 34.7L13.3 38.4L15 38.4L15 41.4L17.1 41.4L17.1 44.3L19.2 44.3L19.2 41.4L21.3 41.4L21.3 38.4L24.7 38.4L24.7 41.4L26.8 41.4L26.8 44.3L28.9 44.3L28.9 41.4L31 41.4L31 38.4L32.7 38.4L32.7 34.7L31 34.7L31 31.7L28.9 31.7L28.9 28.8L26.8 28.8L26.8 31.7L24.7 31.7L24.7 34.7ZM22.2 44.3L22.2 50L23.8 50L23.8 44.3Z");
  bag.draw("white", "M9.6 189L9.6 186.1L7.7 186.1L7.7 183.1L5.4 183.1L3.7 177L0.3 177L0.3 184L3.7 184L3.7 187.7L0.3 187.7L0.3 189ZM15 172.8L13.3 167.2L11.7 167.2L10 172.8L8.3 172.8L8.3 177L10 177L11.7 182.7L13.3 182.7L15 177L16.7 177L16.7 172.8ZM11.5 173L13.6 173L13.6 176.8L11.5 176.8ZM6 150.6L7.7 150.6L7.7 154.4L6 154.4ZM17.3 150.6L19 150.6L19 154.4L17.3 154.4ZM0.3 125L3.3 125L4.5 118.9L6.4 118.9L6.4 115.7L8.9 115.7L8.9 118.9L10.8 118.9L10.8 122.2L12.5 122.2L12.5 125L10 125L10 128.1L14.4 128.1L14.4 126L17.1 126L17.1 122.4L19.4 122.4L19.4 118.4L17.8 118.4L17.8 115.5L16.3 115.5L15 109.8L13.1 109.8L11.7 105L9.8 105L9.8 102.1L7 102.1L7 105.2L5.2 105.2L3.7 110L0.3 110L0.3 114.9L3.7 114.9L3.7 119.1L0.3 119.1Z");
  bag.draw("white", "M36.4 189L36.4 186.1L38.3 186.1L38.3 183.1L40.6 183.1L42.3 177L45.7 177L45.7 184L42.3 184L42.3 187.7L45.7 187.7L45.7 189ZM31 172.8L32.7 167.2L34.3 167.2L36 172.8L37.7 172.8L37.7 177L36 177L34.3 182.7L32.7 182.7L31 177L29.3 177L29.3 172.8ZM34.6 173L32.5 173L32.5 176.8L34.6 176.8ZM40 150.6L38.3 150.6L38.3 154.4L40 154.4ZM28.7 150.6L27 150.6L27 154.4L28.7 154.4ZM45.7 125L42.7 125L41.5 118.9L39.6 118.9L39.6 115.7L37.1 115.7L37.1 118.9L35.2 118.9L35.2 122.2L33.5 122.2L33.5 125L36 125L36 128.1L31.6 128.1L31.6 126L28.9 126L28.9 122.4L26.6 122.4L26.6 118.4L28.3 118.4L28.3 115.5L29.7 115.5L31 109.8L32.9 109.8L34.3 105L36.2 105L36.2 102.1L39 102.1L39 105.2L40.9 105.2L42.3 110L45.7 110L45.7 114.9L42.3 114.9L42.3 119.1L45.7 119.1Z");
  bag.draw("white", "M22.2 189L22.2 182.3L23.8 182.3L23.8 189L30.6 189L30.6 186.1L28.9 186.1L28.9 183.1L26.4 183.1L24.7 177L21.3 177L19.6 183.1L17.1 183.1L17.1 186.1L15.4 186.1L15.4 189ZM21.7 131.5L20.5 136.5L19 136.5L19 139.4L17.3 139.4L17.3 142.4L15.7 142.4L15.7 144.5L13.8 144.5L13.8 147.4L11.2 147.4L11.2 144.5L9.4 144.5L7.9 139.4L6.2 139.4L6.2 136.5L4.9 136.5L4.9 133.8L3.7 133.8L3.7 130.2L0.3 130.2L0.3 139.4L3.7 139.4L3.7 143.6L0.3 143.6L0.3 150.6L3.7 150.6L3.7 147.6L5.8 147.6L5.8 144.7L7.9 144.7L7.9 147.6L10 147.6L10 150.6L11.7 150.6L11.7 154.4L10 154.4L10 157.3L7.9 157.3L7.9 160.2L5.8 160.2L5.8 157.3L3.7 157.3L3.7 154.4L0.3 154.4L0.3 163L3.7 163L3.7 167L0.3 167L0.3 172.8L3.7 172.8L5.4 166.7L7.7 166.7L7.7 164L9.6 164L11 158.3L14 158.3L15.4 164L17.3 164L17.3 166.7L19.6 166.7L21.3 172.8L24.7 172.8L26.4 166.7L28.7 166.7L28.7 164L30.6 164L32 158.3L35 158.3L36.4 164L38.3 164L38.3 166.7L40.6 166.7L42.3 172.8L45.7 172.8L45.7 167L42.3 167L42.3 163L45.7 163L45.7 154.4L42.3 154.4L42.3 157.3L40.2 157.3L40.2 160.2L38.1 160.2L38.1 157.3L36 157.3L36 154.4L34.3 154.4L34.3 150.6L36 150.6L36 147.6L38.1 147.6L38.1 144.7L40.2 144.7L40.2 147.6L42.3 147.6L42.3 150.6L45.7 150.6L45.7 143.6L42.3 143.6L42.3 139.4L45.7 139.4L45.7 130.2L42.3 130.2L42.3 133.8L41.1 133.8L41.1 136.5L39.8 136.5L39.8 139.4L38.1 139.4L36.7 144.5L34.8 144.5L34.8 147.4L32.2 147.4L32.2 144.5L30.4 144.5L30.4 142.4L28.7 142.4L28.7 139.4L27 139.4L27 136.5L25.5 136.5L24.3 131.5ZM22.2 166.5L22.2 160.9L23.8 160.9L23.8 166.5ZM21.3 154.4L21.3 157.3L19.2 157.3L19.2 160.2L17.1 160.2L17.1 157.3L15 157.3L15 154.4L13.3 154.4L13.3 150.6L15 150.6L15 147.6L17.1 147.6L17.1 144.7L19.2 144.7L19.2 147.6L21.3 147.6L21.3 150.6L24.7 150.6L24.7 147.6L26.8 147.6L26.8 144.7L28.9 144.7L28.9 147.6L31 147.6L31 150.6L32.7 150.6L32.7 154.4L31 154.4L31 157.3L28.9 157.3L28.9 160.2L26.8 160.2L26.8 157.3L24.7 157.3L24.7 154.4ZM22.2 144.7L22.2 139L23.8 139L23.8 144.7Z");
  bag.draw("white", "M0.3 85.7L3.7 85.7L3.7 88.6L6.8 90.3L6.8 93.2L8.3 93.2L6.8 98.7L3.7 100.4L3.7 103.3L0.3 103.3ZM45.7 85.7L45.7 103.3L42.3 103.3L42.3 100.4L40.9 100.4L40.9 98.7L39.2 98.7L39.2 95.8L37.7 95.8L39.2 90.3L42.3 88.6L42.3 85.7ZM15 96.4L16.7 96.4L16.7 92.6L15 92.6ZM31 96.4L31 92.6L29.3 92.6L29.3 96.4ZM22.2 84L23.8 84L23.8 80.2L22.2 80.2ZM22.2 105L22.2 108.8L23.8 108.8L23.8 105ZM11.7 89.3L14.6 89.3L14.6 86.9L16.7 86.9L17.8 82.7L19 82.7L19 79.8L20.7 79.8L21.5 74.1L24.5 74.1L25.3 79.8L27 79.8L27 82.7L28.3 82.7L29.3 86.9L31.4 86.9L31.4 89.3L34.3 89.3L34.3 99.8L31.4 99.8L31.4 102.1L29.3 102.1L28.3 106.3L27 106.3L27 109.2L25.3 109.2L24.5 114.9L21.5 114.9L20.7 109.2L19 109.2L19 106.3L17.8 106.3L16.7 102.1L14.6 102.1L14.6 99.8L11.7 99.8ZM22.2 91.1L22.2 88L18.8 85.9L18.8 91.1L20.5 91.1L20.5 93L21.5 93L20.5 97.9L18.8 97.9L18.8 103.1L22.2 101L22.2 97.9L23.8 97.9L23.8 101L25.5 101L25.5 103.1L27.2 103.1L27.2 97.9L25.5 97.9L25.5 96L24.5 96L25.5 91.1L27.2 91.1L27.2 85.9L23.8 88L23.8 91.1Z");
  bag.draw("by-green", "M44 126L378 126L378 189L44 189Z");
  bag.box(378, 189);
  return bag.done("0 0 378 189");
}


function doonfAndorra() {
  var bag = doonfBag();
  bag.draw("ad-red", "M0 0L1000 0L1000 700L0 700Z");
  bag.draw("ad-yellow", "M0 0L680 0L680 700L0 700Z");
  bag.draw("ad-blue", "M0 0L320 0L320 700L0 700Z");
  bag.draw("ad-c6aa76", "M469.4 188.5L498.4 198.8L525.3 189.1L536.7 190.6L542.9 203.5L536.8 227.2L546.3 233.2L567.2 229.4L569.9 227.1L563.8 224.4L562.5 218.3L576.5 208.1L604.3 211.8L622.9 226.4L625.5 232.6L621 243.7L603.9 263.7L603.2 272.1L604.4 274.1L609.5 269.2L613.2 277.4L624.4 275.2L635.6 280L643.7 289L648.4 302.5L643.2 326L626.9 336.4L632.2 340.6L632.6 348.2L627.7 351.7L621.1 349.8L616.1 360.5L621.1 379.3L623.9 382.3L633.7 378.9L641.7 394.2L639.2 402.2L629.3 404L637.2 413L640.6 425.9L633 450.6L608.9 466L542.8 475.3L534.2 481.6L540.3 489.6L537 499.3L524.1 506.1L512 502.3L500.1 511.6L488 502.4L476 506.1L462.6 499L458.6 488.4L465.3 481.2L455.1 474.3L395.7 467.3L380.4 461.3L365.6 448.3L358.6 429.5L359.9 416.8L368.5 404.5L359.2 400.8L357.3 393.4L364.6 379.7L377.4 379.6L383.1 362.6L378.8 349.8L371.3 351.5L366.5 347.7L365.8 341.2L370.2 336.3L353.7 321.2L351.2 297.1L364.4 278.2L373.9 274.7L385.3 276.6L388.2 268.8L394.9 272.4L396.1 268.9L375.4 240L374.2 227.9L394.4 211.4L419.9 207.5L435.9 217.2L436.6 222.9L432 229.3L441.3 233L455.3 232.3L462.4 224.2L456.8 197.8L467.3 188.6Z");
  bag.draw("ad-713f2a", "M425.1 223.7L434 227L437.2 220.9L434.5 215.4L425.1 223.4L433.9 215.7L435 224.7L429.5 226.8L426.1 223.2Z");
  bag.draw("ad-713f2a", "M627 343.6L622.5 340.8L619.2 346.6L625.7 351.2L632.3 346.7L631.2 338.8L623.5 335.7L610.6 343.3L604.1 357L603.7 376.1L608.8 388.6L617.3 397.5L629.8 403.4L639.6 401L641.4 394.3L637 388.3L630 388.5L627.7 394.8L631.3 398.2L635.2 396.6L635.7 394.1L631.5 397.1L628.5 393.9L634.5 388.5L639.5 392.2L639.9 398.6L629 402.2L613.7 393.2L605.2 378L604.4 361.4L610 345.8L621.6 336.9L628.5 337.6L631.8 344.5L627.4 350L621 348.1L620.9 342.6L626.2 344.3Z");
  bag.draw("ad-713f2a", "M600.1 403.5L608.2 398.4L616.5 398.4L633.9 410.4L638.9 429.4L630.8 450.3L608.6 464.4L549.6 471.3L532.1 481.3L552 472.1L608.9 465.6L631.8 451.1L640.2 429.5L635 409.6L614.6 396.8L599.2 402.6Z");
  bag.draw("ad-713f2a", "M604.3 421.4L606.7 415.4L612 414.5L621.2 424.6L621.3 438.2L612.8 450.4L593.6 457.2L544.4 459.2L519.4 465.2L508 471.8L499.5 482.3L500 491L507.6 495.5L501 490.4L500.5 482.7L519.8 466.3L544.5 460.3L593.8 458.3L613.5 451.3L622.3 438.6L622 423.6L612.3 413.5L606.1 414.5L603.2 421.5Z");
  bag.draw("ad-713f2a", "M515.9 229.4L517.1 235.1L512.1 239L505.2 234.1L508.2 224.9L515.2 223.7L528.6 228.5L528.2 220.4L535.8 202.9L531.7 195.9L499.3 205.4L466.9 195.9L462.8 202.9L470.5 220.4L470 228.5L485.5 223.3L493.1 227.8L492.3 236.1L486.5 239L482.3 236.7L481.1 229.7L481.4 237.3L486.5 240.2L493.2 236.7L494.1 227.3L485.5 222.2L470.4 227.5L471.6 220.1L464.2 204.7L465.7 198L471 196.5L499.3 206.5L531.3 196.9L534.7 202.8L527.1 220.1L528.2 227.5L513.3 222.4L504.5 227.3L505.4 236.7L512.1 240.2L518.2 235.4L516.9 228.9Z");
  bag.draw("ad-713f2a", "M491.1 225.2L494.8 232.5L490.6 239.2L494.2 237.7L495.7 229.9L491.9 224.4Z");
  bag.draw("ad-713f2a", "M494.1 233.6L491.4 239.1L495.2 233.8Z");
  bag.draw("ad-c6aa76", "M432.4 214.5L435.8 219.4L433.7 225.5L429.2 226.9L424.8 221.7Z");
  bag.draw("ad-713f2a", "M430.5 220.3L424.9 218.6L425.9 225.5L432.5 226.5L436.3 219.7L432.9 214.1L424 212.6L418.8 217.3L418.6 224.2L426.3 232.8L438.7 238.8L460.2 239L484.5 228.7L487.1 233.5L484.3 227.7L462.1 237.5L441 238.3L420.5 225.6L422.5 214.4L433.4 215.9L434.1 223.9L426.6 224.7L425.7 219.3L429.6 220.8Z");
  bag.draw("ad-713f2a", "M387.4 413.9L379.3 419.7L375.7 430.4L381.5 418.4L387.8 414.8Z");
  bag.draw("ad-713f2a", "M405.4 414.6L403.4 422.5L395.3 429.4L402.1 426L406.5 414.7Z");
  bag.draw("ad-713f2a", "M499 489L490.4 496.6L500.2 489.4Z");
  bag.draw("ad-713f2a", "M631.1 407L638.4 418.9L639.3 432.5L634.2 447.1L624.6 457.3L602.8 466.7L548.5 472.4L533.1 481.4L552.9 472.8L607.5 466.9L630.6 453.9L638.6 441.2L641.1 427.7L639 416.5L632.1 406.1Z");
  bag.draw("ad-713f2a", "M605.8 417.3L611.7 414.9L618 417.5L611.8 414L605.1 416.6Z");
  bag.draw("ad-713f2a", "M627.3 403.4L636.1 404.3L641.5 400.1L638.6 389L639.2 401L627.7 402.1Z");
  bag.draw("ad-713f2a", "M375.2 286.7L367.5 291.8L363.3 302.6L368.4 292.4L375.7 287.6Z");
  bag.draw("ad-713f2a", "M435.4 221.9L431.4 227.4L436.4 222.1Z");
  bag.draw("ad-713f2a", "M620.5 275.5L640.6 284L648.8 301.7L644.9 324.3L628 337L643.4 328.2L649.9 309.4L643.3 285.5L632.2 277.2L620.5 274.5Z");
  bag.draw("ad-713f2a", "M622.4 275.5L639.1 281.7L647.8 300.4L645.2 322.1L630.3 336L645 324.5L649.4 307.3L641.4 282.7L632.5 276.3L622.4 274.5Z");
  bag.draw("ad-713f2a", "M615.8 363.2L620.2 348.7L614.9 363.1Z");
  bag.draw("ad-713f2a", "M632.3 343.6L625.9 351.6L631.1 349.7L633.2 343.7Z");
  bag.draw("ad-713f2a", "M602.8 268.5L623.2 240.9L625 229L622.4 240.5L601.9 268.3Z");
  bag.draw("ad-713f2a", "M605.5 429.9L612.6 422.4L605.4 429Z");
  bag.draw("ad-713f2a", "M364.9 403.8L371.8 402.9L365 402.9Z");
  bag.draw("ad-713f2a", "M379 345.3L373.3 351.5L379.9 345.4Z");
  bag.draw("ad-713f2a", "M388.3 326.6L385.8 333.1L379 337L386.5 333.7L389.2 326.7Z");
  bag.draw("ad-713f2a", "M402.3 274.3L393.8 282.8L403.2 274.6Z");
  bag.draw("ad-713f2a", "M397 324.7L394.2 327.6L397.6 325.5Z");
  bag.draw("ad-713f2a", "M629 397.6L635.8 396.1L634.8 393.7L629.5 396.7Z");
  bag.draw("ad-713f2a", "M621.2 349.7L631.7 350L633.6 343.4L629.2 336.9L631.9 348.1L626.6 351.1L621.9 349Z");
  bag.draw("ad-713f2a", "M639.5 390.5L636 383.1L638.5 390.4Z");
  bag.draw("ad-713f2a", "M637 384.1L631.2 378.3L636 384.4Z");
  bag.draw("ad-713f2a", "M624.8 382.8L616.5 367.8L619.9 350L615.5 367.9L624.2 383.6Z");
  bag.draw("ad-713f2a", "M533.4 481.8L557.6 470.5L544.7 473L532.7 481.1Z");
  bag.draw("ad-713f2a", "M511.2 500.9L499.7 510.3L488.2 500.9L493.2 507.6L499.7 511.3L512 501.5Z");
  bag.draw("ad-713f2a", "M490.8 494.6L488.2 501.5L491.7 494.9Z");
  bag.draw("ad-713f2a", "M491.3 491.4L490.6 494.8L492.3 491.6Z");
  bag.draw("ad-713f2a", "M487.1 501.1L480.4 505.8L487.8 501.8Z");
  bag.draw("ad-713f2a", "M471.9 227.6L471.7 218.9L465.1 205.6L466.5 198.9L471.9 197.3L500.2 207.3L472.1 196.3L465.6 197.8L464.1 205.8L471.5 227.6L471.5 218.9L465 205.6L466.3 198.6L471.8 197.3L490.4 205.8L500.3 206.3L472.1 196.4L465.9 198.2L464.1 205.8L471 227.3Z");
  bag.draw("ad-713f2a", "M500.2 206.9L527 197.1L533.7 197.9L528.2 196.4L500.2 207.3L528.4 197.3L534.2 198.8L526.8 196.1L500.1 205.9Z");
  bag.draw("ad-713f2a", "M624.9 382.8L615.8 368.3L619 349.1L614.8 368.5L624.3 383.6Z");
  bag.draw("ad-713f2a", "M510.8 500.5L499.3 509.9L487.8 500.5L492.8 507.2L499.3 510.9L511.6 501.1Z");
  bag.draw("ad-713f2a", "M479.4 231.2L486 228.8L487.4 233.8L488 229.2L478.9 230.3Z");
  bag.draw("ad-713f2a", "M460.6 240L481.6 231.3L460.4 239Z");
  bag.draw("ad-713f2a", "M531.5 487.8L530.7 493.8L524.5 491.4L532.8 493.8L532.1 487.1Z");
  bag.draw("ad-713f2a", "M460.2 239.5L481.2 230.9L459.9 238.6Z");
  bag.draw("ad-713f2a", "M633.3 397L619.9 390.4L610.2 372.6L613 352.2L623.3 340.8L612.1 351.8L609.6 374.5L619.2 391.1L633.5 398Z");
  bag.draw("ad-713f2a", "M398.5 280.2L402.5 288.8L398.5 298L388.8 303.9L378.9 303.6L389.1 304.8L399.3 298.7L403.4 288.8L399.2 279.5Z");
  bag.draw("ad-713f2a", "M400.2 296.7L401.2 304.9L388.8 312.7L378.9 311.3L370.4 302.5L376.6 311.2L389 313.7L402 305.4L400.8 295.9Z");
  bag.draw("ad-713f2a", "M399.9 307L402.3 315.8L393.9 326.7L397.5 325.3L403.3 316L400.7 306.4Z");
  bag.draw("ad-713f2a", "M595.9 292.6L595.9 298.1L596.9 292.6Z");
  bag.draw("ad-713f2a", "M595.5 291.3L595.5 299L596.5 291.3Z");
  bag.draw("ad-713f2a", "M595.9 274.4L595.9 284.6L596.9 274.4Z");
  bag.draw("ad-713f2a", "M595.5 272.2L595.5 286.1L596.5 272.2Z");
  bag.draw("ad-713f2a", "M592.6 413.9L583.4 425.1L570.5 431.5L519.9 432L500.2 440.5L480.7 432L431.2 431.9L413.3 421.7L421.1 429L441.8 434.6L482 433.2L500.1 441.5L520 433L570.8 432.5L584 425.9L593.4 414.4Z");
  bag.draw("ad-713f2a", "M478.9 506L481.7 505.6L478.7 505Z");
  bag.draw("ad-713f2a", "M528.9 501.9L536.6 499.3L540.4 491L536 498.6L528.9 500.9Z");
  bag.draw("ad-713f2a", "M613.7 277.4L612.9 270.4L609.1 268.5L612.7 277.3Z");
  bag.draw("ad-713f2a", "M402.3 341.6L397.5 349.4L403.3 341.9Z");
  bag.draw("ad-713f2a", "M402.4 275.8L397 281.9L390.5 282.4L397.3 282.8L403.3 276.3Z");
  bag.draw("ad-713f2a", "M380.9 291.7L385.8 287.5L381.4 283.6L384.8 287.5L381 290.7Z");
  bag.draw("ad-713f2a", "M390.5 423.2L395.5 423.6L395.9 419L386.2 414.8L376.7 427.5L377.2 439L383.9 450.2L378.1 438.7L377.6 427.8L386.5 415.7L394 417.5L394.7 423L391.3 422.6Z");
  bag.draw("ad-713f2a", "M531.2 487.6L530.3 493.4L524.2 490.9L532.4 493.4L531.9 486.9Z");
  bag.draw("ad-713f2a", "M608.4 217.3L615.7 221.7L617.4 232.2L598.2 258.3L595.3 270.7L602.2 281.9L609.4 281.3L613.5 275.6L611.1 269.4L605.6 269.3L604.9 275L607.7 276.1L605.1 272.2L609 269.5L612.5 275.5L609 280.5L602.5 281L596.3 270.6L599.1 258.8L618.3 232.4L616.5 221.1L608.6 216.3Z");
  bag.draw("ad-713f2a", "M636.2 383.4L628.5 378.3L624.2 382.5L625.6 388.8L627.9 379.6L635.2 383.6Z");
  bag.draw("ad-713f2a", "M599.5 279.5L595.2 288.8L599.4 298.7L609.5 304.8L619.6 304.4L609.8 303.9L600.1 298L596.2 288.8L600.1 280.2Z");
  bag.draw("ad-713f2a", "M375.4 287.3L365.7 296.6L365.1 316.3L372 324.8L366 316L364.7 304.5L368.5 293.5L375.8 288.3Z");
  bag.draw("ad-713f2a", "M471.5 469.5L485.1 477.6L490.9 489.9L484.1 502.8L469.9 502.6L480.4 505.3L490.5 496.7L490 482.1L471.9 468.6Z");
  bag.draw("ad-713f2a", "M396.6 325.6L402.5 336.9L396.4 348.2L400.6 345.8L403.3 334.8L397.2 324.8Z");
  bag.draw("ad-713f2a", "M392.6 344.7L402.3 364.3L395.4 388.1L403.4 366.5L393.4 344.1Z");
  bag.draw("ad-713f2a", "M515.5 240L517.1 230.5L515.7 239.3L519 236.3L517.4 229.5L514.9 239.2Z");
  bag.draw("ad-713f2a", "M595.9 374.2L596.3 406.1L596.9 374.2Z");
  bag.draw("ad-713f2a", "M595.5 371.8L595.6 407.1L596.5 371.8Z");
  bag.draw("ad-713f2a", "M595.5 339.9L595.5 362.6L596.5 339.9Z");
  bag.draw("ad-713f2a", "M595.9 341.7L595.9 360.2L596.9 341.7Z");
  bag.draw("ad-713f2a", "M595.9 318.3L595.9 332.1L596.9 318.3Z");
  bag.draw("ad-713f2a", "M595.5 316.6L595.5 333.7L596.5 316.6Z");
  bag.draw("ad-713f2a", "M595.9 304.1L595.9 309.5L596.9 304.1Z");
  bag.draw("ad-713f2a", "M595.5 303L595.5 310.8L596.5 303Z");
  bag.draw("ad-713f2a", "M592.6 412.4L582.9 424.7L570 431.1L519.5 431.6L499.8 440.1L480.3 431.6L430.8 431.5L410 417.9L422.3 429.4L441.7 434.1L480.1 432.6L499.7 441L519.6 432.5L570.3 432.1L583.6 425.5L593.5 412.9Z");
  bag.draw("ad-713f2a", "M405.9 413.3L399.6 427.4L392.6 428.7L386.6 424.6L395.1 429.9L404.6 423.8L406.9 413.2Z");
  bag.draw("ad-713f2a", "M399 411L402.1 425.3L403.4 416.4L399.8 410.4Z");
  bag.draw("ad-713f2a", "M369.7 453.5L392.9 466.7L448.1 472.7L466.5 481L448.3 471.7L391.1 465.2L370.4 452.9Z");
  bag.draw("ad-713f2a", "M492.9 475.4L500.1 483.6L493.6 474.7Z");
  bag.draw("ad-713f2a", "M487.8 501.3L480.8 505.3L471 503.8L478.8 506.5L488.5 502.1Z");
  bag.draw("ad-713f2a", "M461.2 497.6L470 502.2L462 497.1Z");
  bag.draw("ad-713f2a", "M511.7 501.3L500.2 510.8L488.2 500.6L493.7 508.1L500.2 511.8L512.4 501.9Z");
  bag.draw("ad-713f2a", "M511.8 502L519.9 506.4L529.2 503.8L530.3 500.5L521.8 505.5L512.5 501.3Z");
  bag.draw("ad-713f2a", "M529.3 500.7L521.7 506L530.2 501.3Z");
  bag.draw("ad-713f2a", "M535.7 483.6L539.5 494.7L529 502.3L538.6 498.3L540.8 490.1L536.3 482.8Z");
  bag.draw("ad-713f2a", "M529.3 500.9L520.9 498.3L529.3 501.8Z");
  bag.draw("ad-713f2a", "M621.1 391.6L610.3 369.6L618.8 343L611.6 354.7L609.3 369.7L620.4 392.3Z");
  bag.draw("ad-713f2a", "M618.1 224.3L624.3 228.8L624.9 236.5L604.1 263.2L603.6 273.9L605 263.7L625.8 236.7L625.2 228.3L618.3 223.4Z");
  bag.draw("ad-713f2a", "M599.3 280.1L609.6 281.9L599.9 279.3Z");
  bag.draw("ad-713f2a", "M576.1 214.3L579.9 220.3L577.4 227.8L557.5 238.9L566.7 237L578.1 228.4L580.9 220.2L576.7 213.5Z");
  bag.draw("ad-713f2a", "M569.7 226.9L563.2 223.8L569.6 227.9Z");
  bag.draw("ad-713f2a", "M540.7 230.8L537.2 224.7L543.3 200.4L535 189.4L542.3 200.6L536.2 224.6L540.2 231.6Z");
  bag.draw("ad-713f2a", "M542.2 203.8L535.9 226.2L543.2 203.9Z");
  bag.draw("ad-713f2a", "M595.4 423.6L602.4 429.4L610.7 428.4L613.4 422.1L609.8 417L606.6 417.5L611.5 419.4L612.2 424.4L608.2 428.5L596.2 423.2Z");
  bag.draw("ad-713f2a", "M370.1 403.2L360.8 401.1L358.8 393L357.6 397.9L362.1 403.2L370.3 404.2Z");
  bag.draw("ad-713f2a", "M378.8 343.4L378.5 349L373.8 351L365.8 344.2L373.8 352L379.3 349.5L379.6 342.9Z");
  bag.draw("ad-713f2a", "M400.4 307.5L403.1 309.7L401.1 306.8Z");
  bag.draw("ad-713f2a", "M400.6 297L403.1 298.4L401.2 296.2Z");
  bag.draw("ad-713f2a", "M402.5 303.7L395 311.3L385.1 313.4L370.5 302.6L380.1 313.2L393.4 313.1L403.4 304.1Z");
  bag.draw("ad-713f2a", "M398.8 280.5L403.3 285.2L399.4 279.8Z");
  bag.draw("ad-713f2a", "M402.4 292.4L395 302L380.2 304.4L392.6 304.3L403.3 292.8Z");
  bag.draw("ad-713f2a", "M374.6 291.6L378.8 298.2L385.9 298.9L392.1 291.5L389.2 280.4L391.4 288.8L387.6 297L379.3 297.3L375.5 291.4Z");
  bag.draw("ad-713f2a", "M358.1 327.7L371.3 336.6L358.9 327.1Z");
  bag.draw("ad-713f2a", "M379.8 337.4L387.6 333.4L389.7 325.5L382 317.1L388.8 327.6L385.5 334.1L379.6 336.5Z");
  bag.draw("ad-713f2a", "M390.3 269.4L395.3 273.6L390.5 268.4Z");
  bag.draw("ad-713f2a", "M389.3 230L397.3 239.3L390.2 229.6Z");
  bag.draw("ad-713f2a", "M622.4 287.5L619.5 297.3L609.2 294.7L619.9 298.2L623.9 294.4L623.3 287.1Z");
  bag.draw("ad-713f2a", "M595.9 239.3L595.9 263.9L596.9 239.3Z");
  bag.draw("ad-713f2a", "M380.8 291.6L385.3 290L382.5 284.2L375.5 287L376.9 296.3L385.1 298L390.4 293.1L388.2 279.5L380.3 274.9L368.7 276.2L357.3 285.1L350.5 302.3L351.8 316L359.4 329L370.5 335.8L382.7 335.5L388.9 326.9L385.4 318.5L377.5 318.2L375.2 324.5L381.5 327.6L382.4 323L378.9 327.1L376.8 320.4L384.8 319.3L387.8 324.7L385.6 332.2L377.6 335.7L368.7 334.1L356.7 324.3L351.2 306.3L356.1 288.7L366.9 278.1L378 275.6L385.9 278.6L390.2 285.3L389.5 292.7L379.6 296.9L375.6 289.4L382.2 285.1L384.4 289.6L380.9 290.7Z");
  bag.draw("ad-713f2a", "M584.6 211.1L590.8 210L595.6 215.8L591.6 232.8L597.2 223.5L595.7 213.6L591.1 209.1L584.2 210.2Z");
  bag.draw("ad-713f2a", "M594.8 213L604.3 212.5L609.3 220.5L607.9 230.7L601.3 239.3L609.7 229L609 216.6L602.9 210.8L594.4 212.1Z");
  bag.draw("ad-713f2a", "M617.2 224.1L623.6 229.5L623.2 237.3L603.2 262.4L601.9 271.6L606.9 276.1L603.1 264.9L624.1 237.6L623.5 227L617.4 223.2Z");
  bag.draw("ad-713f2a", "M617.7 290.7L614.3 289.8L616.6 285.2L623 289.4L619 296.9L608.9 292.8L608.2 285.4L612.8 278.6L620.9 275.6L632.3 277.9L644.3 290.5L647.7 307.2L643.7 324.2L632.2 333.8L614.5 333.6L610.7 326.8L612.4 320.8L617.1 318.3L622.4 320.7L619.7 327.1L616.2 323L619.8 328.1L624.2 322.6L619.1 317.4L611.6 320.2L610.1 329.1L618.3 336.3L632.6 334.7L643.2 326.6L648.3 313.9L648 298.5L640.9 283.6L628.1 275.3L616.3 275.6L608.4 282.3L609.5 295.3L616.1 298.4L623.3 294.2L623.1 287L616.2 284.3L613.4 290.1L617.8 291.6Z");
  bag.draw("ad-713f2a", "M614.3 287.5L619.7 282.2L629.4 283.5L636.9 291.4L640.4 303.1L635.6 323.6L623.8 329.3L616.5 324.9L618.7 329.2L628.1 329.6L636.4 324.2L641.4 303L637.8 290.9L629.9 282.6L619.5 281.2L613.4 287.2Z");
  bag.draw("ad-713f2a", "M620.1 285.4L630.6 292.5L634.4 308.4L631.1 320.4L619.4 328.6L630.3 322.9L634.6 314.7L632.6 293.8L620.3 284.4Z");
  bag.draw("ad-713f2a", "M638.6 389.6L636.9 383.9L631.2 381.9L626.3 385.3L626.4 391.8L628.7 392.9L626.6 387.4L631.3 382.9L637.6 389.6Z");
  bag.draw("ad-713f2a", "M615.9 380.6L625.8 390L616.7 380.1Z");
  bag.draw("ad-713f2a", "M624.4 405.6L608.5 400.3L594.2 407.4L593.5 420L604.4 429L611.2 426L612.3 420.7L604.8 417.1L603.6 422.5L608.6 417.6L610.5 425.4L604.4 428L598.2 425.3L593.7 417.2L596.1 406.4L608.5 401.3L623.9 406.5Z");
  bag.draw("ad-713f2a", "M531.5 488.3L531.8 491.7L527.4 492.8L525.2 485.5L534.6 482.9L539 492.3L528.9 500.4L520.9 496.9L517.6 488.7L520.8 480.5L532.7 472.2L603.7 461.4L624.4 447.8L630.6 433.7L628.6 419.3L617.3 408.2L604.4 406.8L595.6 416L599.8 427.5L607.5 428.6L612.3 423.6L607.1 416.5L603.2 421.4L609.6 418.1L609.2 426.7L603 427.8L597.3 423.6L597.2 414.4L604.7 407.7L616.9 409.1L627.7 419.8L629.6 433.5L623.6 447.2L603.5 460.4L532.3 471.3L520 479.9L516.6 488.7L520.2 497.6L528.9 501.4L537.7 497.4L539.4 487.3L531 480.9L523.9 486.3L527.1 493.7L532.6 492.2L532.5 488Z");
  bag.draw("ad-713f2a", "M526.7 468.6L508.6 482.1L508.1 496.7L518.2 505.3L528.7 502.6L514.5 502.8L507.7 489.9L513.5 477.6L527.1 469.5Z");
  bag.draw("ad-713f2a", "M601.5 324.8L596 331.7L596.8 343.8L602.2 348.2L596.2 336.9L602 325.6Z");
  bag.draw("ad-713f2a", "M605.2 344.1L595.2 366.5L603.2 388.1L596.3 364.3L606 344.7Z");
  bag.draw("ad-713f2a", "M572 212.9L579.2 208.5L586.1 214.7L586.5 223.3L580.9 232.4L587.4 223.5L586.1 212.3L579.2 207.5L571.2 212.3Z");
  bag.draw("ad-713f2a", "M414.4 210.2L407.6 209.3L401.8 215.8L402 225.8L407 232.8L402.8 216.1L407.9 210.3L414.1 211.1Z");
  bag.draw("ad-713f2a", "M404.3 212.1L395.7 210.8L389.6 216.6L389 229L397.3 239.3L390.7 230.7L389.3 220.5L394.4 212.5L403.8 213Z");
  bag.draw("ad-713f2a", "M390 216.3L381.6 222.1L381 233.8L399.5 258.8L402.4 270.6L396.1 281L389.7 280.5L386.1 275.5L389.7 269.5L393.5 272.2L390.9 276.1L393.8 275L393 269.3L387.5 269.4L385.1 275.6L389.2 281.3L396.4 281.9L403.4 270.7L400.4 258.3L381.9 233.5L382.4 222.6L390.2 217.3Z");
  bag.draw("ad-713f2a", "M381.2 223.2L374.2 227.5L373.4 235.7L393.9 262.7L395.2 271.3L391.5 275.2L395 274L394.8 262.2L374.4 235.4L375 228L381.4 224.2Z");
  bag.draw("ad-713f2a", "M372.4 344.3L377.7 342.6L377.6 348.1L371.2 350L366.8 344.5L370.1 337.6L377 336.8L388.6 345.8L393.9 359.3L393.9 375.9L386.4 391.6L371.8 401.5L360.2 400.3L358.4 394.6L361.9 389.1L369.9 391.8L367.1 397.2L362.9 394.1L365.1 398L371.1 393.4L368.5 388.5L361.5 388.3L357.4 394.5L359.5 401L367.8 403.6L381.3 397.5L389.8 388.6L394.9 376.1L394.5 357L388 343.3L375.1 335.7L367.5 338.7L366.3 346.7L372.9 351.2L379.4 346.6L376.1 340.8L371.6 343.6Z");
  bag.draw("ad-713f2a", "M365.1 398L379.5 391.1L388.7 375.8L386.9 352.9L375.3 340.8L386 353.2L388.4 372.6L378.8 390.4L365.4 397Z");
  bag.draw("ad-713f2a", "M361 389.6L367.3 382.9L372 387.4L369.9 392.9L372.2 391.8L372.3 385.3L367.4 381.9L361.7 383.9L360 389.6Z");
  bag.draw("ad-713f2a", "M363.4 383.6L370.7 379.6L373.1 388.8L374.5 382.5L370.1 378.3L362.4 383.4Z");
  bag.draw("ad-713f2a", "M374.3 383.6L383.8 368.5L379.6 349.1L382.8 368.3L373.7 382.8Z");
  bag.draw("ad-713f2a", "M381.9 380.1L372.8 390L382.7 380.6Z");
  bag.draw("ad-713f2a", "M398.2 402.4L391.5 397.1L382.1 397.1L364 409.5L358.8 429.3L367.1 450.8L389.9 465.2L449 472.2L465.9 481.8L449.2 471.2L390.2 464.3L367.9 450.1L359.7 429.2L363.7 411.8L382.3 398.1L391.3 398.1L397.4 402.9Z");
  bag.draw("ad-713f2a", "M374.8 406.5L390.1 401.3L402.5 406.4L404.9 417.2L400.4 425.3L394.2 428L388.2 425.4L390 417.6L395 422.5L393.8 417.1L386.3 420.7L387.4 426L394.2 429L405.1 420L404.4 407.4L390.1 400.3L374.2 405.6Z");
  bag.draw("ad-713f2a", "M395.3 421.6L393.9 415.9L386.1 413.7L376.4 424.3L376.4 438.5L385.2 451.2L402.8 458.1L454.1 460.2L478.8 466.2L498.2 482.7L497.7 490.4L491 495.4L498.5 491L499.1 482.3L490.6 471.9L479.2 465.3L454.2 459.3L403 457.1L385.8 450.4L377.3 438.2L377.4 424.6L386.4 414.7L393.2 416.6L394.4 421.3Z");
  bag.draw("ad-713f2a", "M466.1 488L466 492.2L471.5 493.7L474.7 486.3L467.6 480.9L459.4 486.7L459.9 495.9L469.7 501.4L478.4 497.6L482 488.7L478.6 479.9L466.3 471.3L395.1 460.4L375 447.2L369 433.5L370.9 419.8L381.7 409.1L393.9 407.7L401.4 414.4L401.3 423.6L396.3 427.6L389.4 426.7L389 418.1L395.4 421.4L391.5 416.5L386.3 423.6L391.1 428.6L398.8 427.5L403 416L394.2 406.8L381.3 408.2L370 419.3L368 433.7L374.3 447.8L394.9 461.4L465.9 472.2L477.8 480.5L481 488.7L477.7 496.9L469.7 500.4L459.6 492.3L464 482.9L473.4 485.5L471.2 492.8L466.8 491.7L467.1 488.3Z");
  bag.draw("ad-713f2a", "M427.4 212.3L419.4 207.5L412.5 212.3L411.2 223.5L417.7 232.4L412.1 223.3L412.5 214.7L419.4 208.5L426.6 212.9Z");
  bag.draw("ad-713f2a", "M572.7 224L555.4 232.9L538 228.8L536.7 222.1L542.7 202.1L540.1 193.5L534.1 189L524.7 188.9L498 198.5L469.6 188.2L460.8 191L456.3 199L462.3 224.4L460.3 229.1L445.3 233.1L426.8 226.3L443.1 233.9L461 229.8L463.3 224.4L457.3 199.2L461.4 191.8L469.6 189.2L498 199.5L533.8 189.9L541.7 202.2L535.8 221.9L537.3 229.4L555.6 233.9L573.4 224.7Z");
  bag.draw("ad-713f2a", "M464.4 466.7L486.1 478.4L492.3 494.8L491.7 484.8L486.8 477.7L464.7 465.8Z");
  bag.draw("ad-713f2a", "M464.9 500.5L475 500.9L481.5 493.9L481.6 484.8L476.5 477.8L481.2 487.1L479.5 495.6L472.5 500.7L465.3 499.6Z");
  bag.draw("ad-713f2a", "M466 488L467.6 493.8L474 492.7L471.9 482.3L473.3 492L468.1 492.9L467 488.3Z");
  bag.draw("ad-713f2a", "M609.5 217.4L616.4 221.6L618.3 230.5L605.5 248.9L619.3 230.6L617.2 221.1L609.6 216.4Z");
  bag.draw("ad-713f2a", "M603.3 212L609.9 224.9L600.9 238.5L608.9 231.8L610.7 220.7L603.8 211.2Z");
  bag.draw("ad-713f2a", "M593.4 211.9L596.9 222.3L591 232L594.9 229.9L597.9 220.4L594 211.2Z");
  bag.draw("ad-713f2a", "M583 210.2L587.3 221.5L580.5 231.7L584.5 229.9L588.4 219.2L583.7 209.5Z");
  bag.draw("ad-713f2a", "M597.7 296.5L608.2 304.7L620.2 303.9L608.5 303.8L598.6 296Z");
  bag.draw("ad-713f2a", "M365.2 388.4L370.2 395.5L365.7 397.2L363.9 393.9L363.5 396.7L369.7 397.6L371.5 393.8L365.4 387.4Z");
  bag.draw("ad-713f2a", "M377.2 336.9L389.2 345.8L395.4 363.5L392.9 382.3L380.9 397.2L388.7 391.5L394.9 379.5L393.7 352.1L386.8 341.4L377.5 335.9Z");
  bag.draw("ad-713f2a", "M368.6 379.2L373.8 382.8L372.7 388.8L374.7 387.3L374.7 382.4L368.9 378.2Z");
  bag.draw("ad-713f2a", "M366.6 382.8L372.1 386.9L371.1 394L373.5 389.9L366.7 381.9Z");
  bag.draw("ad-713f2a", "M396.4 349.5L403.3 361.2L397.2 348.9Z");
  bag.draw("ad-713f2a", "M402.2 374.4L395.2 388.5L403.2 374.6Z");
  bag.draw("ad-713f2a", "M397 325.9L403.3 332.8L397.6 325.1Z");
  bag.draw("ad-713f2a", "M402.4 317.7L398 325.5L403.4 318.1Z");
  bag.draw("ad-713f2a", "M383.5 298.7L389 296.2L392 289L383.2 297.8Z");
  bag.draw("ad-713f2a", "M376.4 285.9L364.8 295.7L363.8 314.2L368.7 323.5L376.1 326.2L366.9 319.1L363.8 305.3L367.6 292.6L376.6 286.9Z");
  bag.draw("ad-713f2a", "M394.9 271.4L390.7 276.3L395.8 271.8Z");
  bag.draw("ad-713f2a", "M384.2 284.8L376 282.3L366.9 285.7L358.2 303.6L360.1 316.9L366.3 326.6L374.7 330.3L382.1 327.7L382.1 325L377.1 329.2L366.9 325.8L359.2 305.6L366.3 287.4L376 283.3L383.6 285.6Z");
  bag.draw("ad-713f2a", "M568.8 220.7L573.4 220.9L569.9 225.9L563.9 223L566 215.1L576.2 214.4L578.2 225.6L559.6 237.9L538.7 238L514.3 227.7L511.6 233.5L514.1 228.7L538.5 239L559.9 238.8L572.3 232.8L580 224.1L579.8 217.3L574.6 212.6L565.7 214.1L562.4 219.7L566.1 226.4L572.7 225.4L573.5 218.5L568 220.2Z");
  bag.draw("ad-713f2a", "M571.2 218.5L573.9 221.3L570.7 227.2L574.6 223.7L571.4 217.5Z");
  bag.draw("ad-713f2a", "M597.9 307.1L595.8 316.8L601.7 326.2L605.3 326.4L597.5 318.9L598.7 307.6Z");
  bag.draw("ad-713f2a", "M598.3 295.6L596.6 305.7L607.8 313L620.7 311.9L628.6 302.2L620.2 311L608.1 312.1L597.5 305.2L599 296.4Z");
  bag.draw("ad-713f2a", "M595.1 398.6L592.6 410.9L585.2 421.8L561.9 432.3L519 431.1L499.3 439.6L479.5 431.1L434.5 431.9L414.9 423.3L406.8 412.9L403.5 400.5L403.3 240L595.2 240L595.6 399.1L595.8 239.2L402.6 239.2L402.5 398.6L408.2 417.3L423.5 429.8L440.9 433.7L479.4 432.1L499.2 440.6L519.2 432.1L557.7 433.7L575 429.8L590.3 417.3L596.1 398.6Z");
  bag.draw("ad-c6aa76", "M387.4 421.3L391.3 417.4L395.2 421.3L392 425.2L387.5 422ZM363.4 393.7L368.1 391.2L367.6 396.7L364.2 396.2Z");
  bag.draw("ad-c6aa76", "M377.1 324.4L381.7 322.8L381.5 326.5L377.8 326.3ZM424.9 221.8L429.9 221.7L427.7 224.4L425 222.3Z");
  bag.draw("ad-c6aa76", "M373.6 340.1L370.9 344.6L374.2 340.9Z");
  bag.draw("ad-c6aa76", "M379.2 386.7L383.5 380L378.4 386.1Z");
  bag.draw("ad-c6aa76", "M380.9 401.1L372.9 406.1L381.3 402Z");
  bag.draw("ad-c6aa76", "M396.9 346.9L392.7 343.1L396.2 347.6Z");
  bag.draw("ad-c6aa76", "M397 326L393 328.3L397.4 326.9Z");
  bag.draw("ad-c6aa76", "M370.5 300.8L379.4 311.5L371.5 300.6Z");
  bag.draw("ad-c6aa76", "M377.8 302.4L387.6 304.2L378.3 301.5Z");
  bag.draw("ad-c6aa76", "M398.9 239.7L389.1 232.1L398.4 240.6Z");
  bag.draw("ad-c6aa76", "M400.7 224.9L408.4 234.3L401.7 224.6Z");
  bag.draw("ad-c6aa76", "M410.5 224.8L418.1 233.2L411.4 224.4Z");
  bag.draw("ad-713f2a", "M520.8 211.9L517.1 209L497.2 215.6L481.8 209L478.2 213.1L483.9 210.9L500.1 217.4L516.6 210.7L520.8 212.2Z");
  bag.draw("ad-713f2a", "M413.1 434.4L410.8 432.1L406 440.9L407.6 430.6L403 429.1L404.9 443.3Z");
  bag.draw("ad-713f2a", "M418 436.2L414.7 433.4L411.5 445.9L416.3 447.4L415.3 444.7ZM423.7 437.9L426.8 441L422.7 441.5ZM419.3 445.6L417.4 447.8L422 449.1L423 443L428.4 450L428.4 438.1L420.9 435.1L421.6 437.8ZM432.5 449.5L430.2 451.4L435.8 452.8L436.8 440.8L440.9 443.2L441 440.5L431 438.1L429.8 441.4L434.5 441.1ZM452.3 444.4L449.6 442.5L446.5 452.1L446.2 441.6L441.4 441L445.8 454.6ZM453.2 454.9L459.8 455.5L455.8 445.9L457.9 444.3L460.8 448.3L461.6 444.7L454.2 446.6L458.5 455.6L453.1 452.3ZM477.9 448L475.1 446.3L472.9 456.2L471.6 445.8L466.8 445.7L472.5 458.8Z");
  bag.draw("ad-713f2a", "M480.6 457L479.2 459.5L483.6 459.3L481.6 449.5L490.5 459.6L492.1 446.7L487.8 446.5L489.6 455.6L482.2 446.5L478.9 446.4L480.7 449.9ZM496.9 448.6L492.9 446.8L493.5 459.7L498.5 459.8L496.8 457.5ZM503.9 457.3L502.2 459.7L507.9 459.7L506.1 447.8L510.5 449.2L510 446.5L499.7 446.5L499.4 450.1L503.8 448.6ZM513.7 453.7L514.5 449.3L516 453.6ZM516.6 454.5L517.2 459.1L522.2 458.4L514.8 445.7L509.6 459.5L514 459.1L513.3 454.8ZM529.5 446.8L534.7 446.7L533.9 444L525.4 445.4L527.6 458L532.6 457.5L530.2 451.5L534.1 452.8L533.7 448.6L529.9 449.4ZM535.7 451L542.4 456.2L547.5 449.7L542.4 442.7L535.5 448.7ZM537.5 449.6L540.2 443.7L545.4 449.1L542.7 455.3L538.1 451.7ZM550.5 443.1L554.7 444.3L551.4 446.8ZM550.5 452L550 454.8L554.7 453.6L552.5 447.9L560.6 451.3L554.6 440.9L546.7 442.1L548.6 444ZM564 449L562.9 451.7L568.5 450.3L563.8 439.2L568.5 439.5L567.3 437L557.3 439.6L557.9 443.1L561.8 440.6ZM572.6 437.5L568.3 436.9L572.5 449.1L577.3 447.8L575 446.1ZM576.2 441.7L583.5 445.9L587.7 438.8L581.7 432.5L575.7 439.4ZM577.8 440L579.6 433.8L585.6 438.4L583.7 445L578.7 442ZM589.7 431.6L594 432.1L591.1 435.1ZM591 440.4L590.8 443.2L595.3 441.4L592.3 436L600.8 438.3L593.5 428.8L585.7 431.1L588 432.7Z");
  bag.draw("ad-da291c", "M412.7 249.3L494.8 249.3L494.8 331.3L412.7 331.3Z");
  bag.draw("white", "M451.2 313.8L448.5 323.2L440.9 328.6L433.2 325.6L425.3 311.3L421 314.3L425.8 318.9L422.9 322.6L419 321L415.3 313.5L420.3 306.7L428.4 308.7L437.6 323.1L441.8 322.2L447.4 312.6L451.1 313.8ZM456.3 313.8L459 323.2L466.6 328.6L474.3 325.6L482.2 311.3L486.5 314.3L481.7 318.9L484.6 322.6L488.5 321L492.2 313.5L487.3 306.7L479.2 308.7L469.9 323.1L465.7 322.2L460.1 312.6L456.4 313.8Z");
  bag.draw("ad-yellow", "M461.1 279L473 265.8L471.6 256.4L480.2 252.6L491.2 257L489.7 267.1L481 267.1L487.7 260L484.2 256.4L479.8 257.6L475.6 269.8L421.1 328.7L417.9 325.7Z");
  bag.draw("white", "M429.5 283L441.4 316.5L453.7 313.7L466.1 316.5L478 283L453.7 251.9Z");
  bag.draw("ad-yellow", "M456.1 262.4L472.9 284L463.9 310.4L456.1 309.1ZM451.4 262.4L434.6 284L443.6 310.4L451.4 309.1ZM503.6 249.3L585.8 249.3L585.8 331.3L503.6 331.3Z");
  bag.draw("ad-da291c", "M515.1 249.3L527.4 249.3L527.4 331.3L515.1 331.3ZM538.6 249.3L550.8 249.3L550.8 331.3L538.6 331.3ZM562.1 249.3L574.3 249.3L574.3 331.3L562.1 331.3Z");
  bag.draw("ad-yellow", "M413 402.4L419.4 415L430.7 421.6L476.6 421.5L494.8 425.7L494.8 340.1L412.7 340.1L412.8 400.1Z");
  bag.draw("ad-da291c", "M422.5 417.4L431.6 421.6L431.6 340L422.5 340ZM468.2 421.1L468.2 340L459 340L459 422.4L468.2 421.4ZM486.4 340L477.3 340L477.3 421.4L486.4 423.1ZM449.9 340L449.9 423.4L446.3 423.5L440.7 423.4L440.7 340.1Z");
  bag.draw("ad-yellow", "M585.5 402.4L579 415L567.2 421.7L521.9 421.5L503.5 425.7L503.6 340.1L585.8 340L585.7 400.1Z");
  bag.draw("ad-da291c", "M524.6 346.9L516.9 354.8L528.2 360.2L530.8 377.3L533.6 373.6L531.4 370.3L537.6 368.5L539.1 381.1L542.1 368.2L552.2 367.6L555.5 371.2L560.5 369L554.2 377.2L556.7 379L565.7 368.7L563.8 380.3L566.5 381.1L570.8 353.5L561.1 350.2L533.1 352.3L533.6 348.4L526.2 347.2Z");
  bag.draw("ad-yellow", "M568.6 359L549 358.9L567.7 357.7L566.7 352.8L566.2 357.1L548.5 358L554.2 361.6L568.9 360Z");
  bag.draw("ad-yellow", "M535.6 364L537.7 369.7L536.5 363.6Z");
  bag.draw("ad-yellow", "M543.6 362.6L542.2 368.1L544.5 362.8Z");
  bag.draw("ad-yellow", "M531.3 364.4L533.1 368.5L532.2 364Z");
  bag.draw("ad-yellow", "M560.4 370.2L563.5 368.1L559.9 369.4Z");
  bag.draw("ad-yellow", "M552.4 368.5L560.1 365.6L552.4 367.5Z");
  bag.draw("ad-yellow", "M556 364.1L565.2 368.3L556 363.1Z");
  bag.draw("ad-005eb8", "M525.1 364.2L526.4 360L525.5 364.3ZM522.4 348.6L520.8 342.9L522.9 348.4ZM526 359.3L531.3 357.1L530.9 351.5L526.7 358.8ZM530.9 377.4L533.6 375L531.4 378.3ZM563.9 379.2L566.9 381.2L563.2 379.9ZM554.2 377.2L557.2 379.1L553.4 377.9ZM536.8 379.3L539.8 381.3L536.1 380ZM527.9 349.5L528.7 342.5L527.9 349.6Z");
  bag.draw("ad-da291c", "M524.6 383.5L516.9 391.4L528.2 396.8L530.8 413.9L533.6 410.2L531.4 406.9L537.6 405.1L539.1 417.7L542.1 404.8L552.2 404.2L555.5 407.8L560.5 405.6L554.2 413.8L556.7 415.6L565.7 405.3L563.8 416.9L566.5 417.7L570.8 390L561.1 386.8L533.1 388.9L533.6 385L526.2 383.8Z");
  bag.draw("ad-yellow", "M568.6 395.6L549 395.4L567.7 394.3L566.7 389.3L566.2 393.7L548.5 394.6L554.2 398.2L568.9 396.6Z");
  bag.draw("ad-yellow", "M535.6 400.6L537.7 406.3L536.5 400.2Z");
  bag.draw("ad-yellow", "M543.6 399.2L542.2 404.7L544.5 399.4Z");
  bag.draw("ad-yellow", "M531.3 400.9L533.1 405.1L532.2 400.6Z");
  bag.draw("ad-yellow", "M560.4 406.8L563.5 404.7L559.9 406Z");
  bag.draw("ad-yellow", "M552.4 405.1L560.1 402.2L552.4 404.1Z");
  bag.draw("ad-yellow", "M556 400.7L565.2 404.9L556 399.7Z");
  bag.draw("ad-005eb8", "M525.1 400.8L526.4 396.6L525.5 400.8ZM522.4 385.2L520.8 379.5L522.9 384.9ZM526 395.8L531.3 393.7L530.9 388.1L526.7 395.4ZM530.9 414L533.6 411.6L531.4 414.9ZM563.9 415.8L566.9 417.8L563.2 416.5ZM554.2 413.8L557.2 415.7L553.4 414.5ZM536.8 415.9L539.8 417.9L536.1 416.6ZM527.9 386.1L528.7 379.1L527.9 386.1Z");
  bag.draw("ad-713f2a", "M412.7 249.6L494.6 249.5L494.6 331L412.9 331L412.3 249.3L412.4 331.6L495.1 331.6L495.1 249L412.7 248.9Z");
  bag.draw("ad-713f2a", "M503.6 249.6L585.5 249.5L585.5 331L503.9 331L503.2 249.3L503.3 331.6L586.1 331.6L586.1 249L503.6 248.9Z");
  bag.draw("ad-713f2a", "M412.6 402.5L419.1 415.3L430.6 421.9L476.5 421.9L495.2 425.7L495.1 339.8L412.4 339.7L412.6 402.4L412.9 340.4L494.6 340.4L494.4 425.7L476.6 421.1L430.8 421.2L419.7 414.7L413.4 402.3Z");
  bag.draw("ad-713f2a", "M585.1 402.3L578.8 414.7L567.1 421.3L521.9 421.1L503.9 425.7L503.9 340.3L585.6 340.4L585.7 402.7L586 339.7L503.3 339.8L503.1 425.7L521.9 421.9L567.3 422.1L579.3 415.3L585.9 402.5Z");
  bag.box(1000, 700);
  return bag.done("0 0 1000 700");
}


function doonfCroatia() {
  var bag = doonfBag();
  bag.draw("hr-blue", "M0 0L1200 0L1200 600L0 600Z");
  bag.draw("white", "M0 0L1200 0L1200 400L0 400Z");
  bag.draw("hr-red", "M0 0L1200 0L1200 200L0 200Z");
  bag.draw("hr-red", "M600 455.2L632.8 450.5L663 436.6L688.2 414.7L706.2 386.7L716.5 345.1L716.7 200L483.4 200L483.6 345.1L493.9 386.7L511.9 414.7L537.1 436.6L567.2 450.5L600 455.2Z");
  bag.draw("white", "M600 453.3L632.2 448.7L661.8 435.1L686.6 413.6L704.2 386L714.3 345.3L714.4 202.2L485.6 202.2L485.8 345.3L495.8 386L513.5 413.5L538.2 435.1L567.8 448.7L600 453.3Z");
  bag.draw("hr-red", "M533.9 206.5L489.9 206.5L489.9 254.9L533.9 254.9Z");
  bag.draw("hr-red", "M533.9 303.2L577.9 303.2L577.9 254.9L533.9 254.9Z");
  bag.draw("hr-red", "M489.9 338.6L490.7 351.6L533.9 351.6L533.9 303.2L489.9 303.2Z");
  bag.draw("hr-red", "M622 303.2L577.9 303.2L577.9 351.6L622 351.6Z");
  bag.draw("hr-red", "M622 400L666 400L666 351.6L622 351.6Z");
  bag.draw("hr-red", "M666 426.5L691.1 400L666 400Z");
  bag.draw("hr-red", "M533.9 400L577.9 400L577.9 351.6L533.9 351.6Z");
  bag.draw("hr-red", "M508.7 400L533.9 426.5L533.9 400Z");
  bag.draw("hr-red", "M607.6 448.4L622 446.4L622 400L577.9 400L577.9 446.4L607.6 448.4Z");
  bag.draw("hr-red", "M709.2 351.6L710 303.3L666 303.3L666 351.6Z");
  bag.draw("hr-red", "M622 303.2L666 303.2L666 254.9L622 254.9Z");
  bag.draw("hr-red", "M622 206.5L577.9 206.5L577.9 254.9L622 254.9Z");
  bag.draw("hr-red", "M710 254.9L710 206.5L666 206.5L666 254.9Z");
  bag.draw("white", "M712.5 198.5L739.8 136.6L719 103.1L684.5 115.8L660.3 88.2L628.4 106.4L600 83.2L571.6 106.4L539.7 88.2L515.5 115.8L481 103.1L460.2 136.7L487.5 198.6L542.4 180.4L600 174.3L657.5 180.4L712.4 198.5Z");
  bag.draw("hr-0093dd", "M516.3 118.6L482 106L462.9 136.8L488.8 195.6L532 180.7Z");
  bag.draw("black", "M514.1 149.2L514.9 162.9L504.9 172.4L491.5 171.3L483 160.1L491.8 167.7L503.3 167.8L512.3 160.4L514.5 149L511.9 160.4L503.2 167.5L492 167.4L482.9 160.1L492.2 172.1L507.3 171.8L515.6 161.8L514.4 149Z");
  bag.draw("white", "M514.3 149.1L515.1 162.9L505 172.6L491.2 171.3L483.1 160L491.8 167.5L503.2 167.7L512.2 160.4L514.3 149.1Z");
  bag.draw("black", "M499 126L497.8 132.2L502.6 136.4L496.5 138.5L495.3 144.8L490.5 140.6L484.4 142.7L485.6 136.4L480.8 132.2L486.9 130.1L488.1 123.8L492.9 128L498.7 126.1Z");
  bag.draw("hr-f7db17", "M492 134.5L496.4 138.2L501.8 136.4Z");
  bag.draw("hr-f7db17", "M492.1 134.3L501.8 136.2L497.5 132.4Z");
  bag.draw("hr-f7db17", "M481.7 132.3L491.4 134.2L487.1 130.4Z");
  bag.draw("hr-f7db17", "M491.3 134.3L481.6 132.4L485.9 136.2Z");
  bag.draw("hr-f7db17", "M491.9 134L498.4 126.5L493 128.4Z");
  bag.draw("hr-f7db17", "M484.9 142L491.4 134.5L486 136.4Z");
  bag.draw("hr-f7db17", "M491.5 134.7L485 142.1L490.4 140.3Z");
  bag.draw("hr-f7db17", "M498.5 126.7L492 134.1L497.4 132.3Z");
  bag.draw("hr-f7db17", "M491.5 134L488.3 124.7L487.2 130.3Z");
  bag.draw("hr-f7db17", "M494.9 144.1L491.7 134.7L490.6 140.3Z");
  bag.draw("hr-f7db17", "M491.9 134.6L495.1 144L496.2 138.4Z");
  bag.draw("hr-f7db17", "M488.5 124.6L491.7 133.9L492.8 128.3Z");
  bag.draw("hr-blue", "M571.9 109.3L540.2 91.2L516.3 118.6L532 180.7L577.2 173.1Z");
  bag.draw("hr-red", "M528.1 165.2L575.9 157.3L574.5 141.1L524.1 149.5Z");
  bag.draw("hr-red", "M520.2 134L573.2 125.2L571.9 109.3L516.3 118.6Z");
  bag.draw("hr-0093dd", "M628.3 109.3L600 86.2L571.9 109.3L577.2 173.1L622.9 173.1Z");
  bag.draw("black", "M599.9 138L596.7 142.6L590.7 139.7L593.8 145.6L589.8 150L593.9 160.5L599.9 163.1L606.3 160.5L610.3 150L606.4 145.6L609.5 139.7L603.5 142.6L600 138Z");
  bag.draw("hr-f7db17", "M606.8 143.9L593.4 144.1L606.9 143.9Z");
  bag.draw("hr-f7db17", "M593.3 143.6L606.8 143.7L609 140.1L603.4 143.3L599.9 138.4L596.9 143.3L591.1 140.1L593 143.2Z");
  bag.draw("hr-f7db17", "M606.3 146.3L590.8 145.7L593.4 148.8L590.7 145.8L594.3 160.3L603 162.3L602.3 158.7L607.2 158.2L605.1 155L609.2 155.5L606.6 153.3L609.9 150.2L606.4 151.3L609.5 145.9L606.4 146.3Z");
  bag.cut("hr-f7db17", "M594.1 145.6L606.6 144.3L594 145.3Z");
  bag.draw("black", "M598.2 158L601.2 154.4L601.7 158.2L598.1 158Z");
  bag.draw("black", "M599.6 147.5L598.8 151.7L595.4 148.9L599.6 147.4ZM600.8 147.6L604.9 148.9L601.5 151.7L600.9 147.6Z");
  bag.draw("black", "M587.1 109.2L584 113.9L577.9 111.3L581.2 117.1L577.4 121.7L581.9 132L587.9 134.3L594.3 131.5L597.9 120.9L593.8 116.6L596.7 110.6L590.8 113.7L587.1 109.2Z");
  bag.draw("hr-f7db17", "M594.2 114.9L580.8 115.6L594.2 114.9Z");
  bag.draw("hr-f7db17", "M580.7 115.1L594.2 114.7L596.2 111L590.7 114.4L587.1 109.6L584.2 114.7L578.4 111.6L580.4 114.7Z");
  bag.draw("hr-f7db17", "M593.8 117.3L578.3 117.2L580.9 120.3L578.1 117.4L582.3 131.7L591.1 133.4L590.2 129.8L595.1 129.2L592.9 126L597 126.4L594.4 124.3L597.5 121.1L594 122.3L596.9 116.7L593.8 117.3Z");
  bag.cut("hr-f7db17", "M581.5 117.1L593.9 115.3L581.4 116.8Z");
  bag.draw("black", "M586 129.3L588.9 125.6L589.6 129.3L586 129.3Z");
  bag.draw("black", "M587.1 118.7L586.4 123L582.9 120.3L587.1 118.7ZM588.3 118.8L592.5 119.9L589.2 122.9L588.4 118.8Z");
  bag.draw("black", "M612.9 109.2L609.5 113.7L603.6 110.6L606.4 116.6L602.3 120.9L605.9 131.5L611.8 134.3L618.3 132L622.8 121.7L619.1 117.1L622.3 111.3L616.2 113.9L612.9 109.2Z");
  bag.draw("hr-f7db17", "M619.5 115.4L606.1 115L619.5 115.4Z");
  bag.draw("hr-f7db17", "M606.1 114.6L619.5 115.2L621.8 111.6L616.1 114.7L612.8 109.6L609.6 114.4L604 111L605.8 114.1Z");
  bag.draw("hr-f7db17", "M618.9 117.8L603.5 116.5L605.9 119.8L603.3 116.7L606.4 131.3L615 133.7L614.4 130L619.4 129.7L617.4 126.4L621.5 127.1L619 124.8L622.4 121.8L618.8 122.8L622.1 117.5L619 117.8Z");
  bag.cut("hr-f7db17", "M606.7 116.6L619.2 115.8L606.6 116.3Z");
  bag.draw("black", "M610.3 129.1L613.5 125.7L613.9 129.5L610.3 129.1Z");
  bag.draw("black", "M612.2 118.7L611.2 122.9L607.9 120L612.2 118.7ZM613.4 118.9L617.4 120.3L613.9 123L613.4 118.8Z");
  bag.draw("hr-blue", "M683.9 118.6L659.8 91.2L628.3 109.3L622.9 173.1L668.1 180.7Z");
  bag.draw("black", "M634.5 122.5L649.3 120.1L663.6 124L653.2 123.8L665.5 131.2L647.9 124.9L644.2 130.5L648.7 136L670.8 138.9L656.4 162.6L652.2 161L656.7 152.5L648.5 160.3L644.7 159L650.3 150.7L644.7 151L638.6 160.6L641.3 148.9L637.2 156.6L633.1 155.5L637.8 148.3L634.5 122.6Z");
  bag.draw("hr-f7db17", "M655.5 152.4L645.7 159.8L650.8 150.2L655.5 152.4Z");
  bag.draw("hr-f7db17", "M636.2 141.2L638.2 149.6L633.4 155.5L637.3 156.1L642 144.2L640 160.3L644.7 148.3L650.7 148.2L649.3 150.8L654.3 145.6L651.9 150.5L654.5 148.2L659.4 153.5L652.5 161.1L654.9 162.8L670.5 138.2L649 138.7L641.2 129.1L648.1 123.3L639.7 124.7L642.6 121.6L634 129.6L638.9 130.2L637.4 134.5L641.4 130.9L636.1 141.2Z");
  bag.draw("black", "M660.8 140.8L660 146.1L660.7 140.8Z");
  bag.draw("black", "M653.7 142.1L652.3 146.2L653.7 142Z");
  bag.draw("black", "M640.5 134.6L639.3 137.9L640.5 134.6Z");
  bag.draw("black", "M642.9 134.1L642 139L643 134Z");
  bag.draw("black", "M640.4 145.3L641.6 139.8L640.4 145.3Z");
  bag.draw("hr-red", "M652.4 126.1L647.6 122.3L652.4 126Z");
  bag.draw("hr-red", "M642.4 125.1L647.2 122.3L642.3 125.1ZM639.5 124.6L643.8 121.9L639.5 124.5Z");
  bag.draw("hr-0093dd", "M711.2 195.6L737.1 136.8L718 106L683.9 118.6L668.1 180.7L711.1 195.6Z");
  bag.draw("white", "M678.1 141.2L727.6 158.4L717.6 181.1L672 165.3Z");
  bag.draw("hr-red", "M719.2 177.4L725.9 162.3L677.1 145.4L673.1 160.9L719.4 176.9Z");
  bag.draw("black", "M681.9 157.2L685.4 156.4L679.7 151.5L683.5 149.7L719.1 162.9L718.8 165.9L709.6 162.2L714 169.7L711.2 171.4L707.1 165.8L688 162.7L685.8 160.7L690.6 160.4L681.8 157.2Z");
  bag.draw("black", "M703.5 118.4L704.8 124.7L699.9 128.9L706 131L707.2 137.3L712.1 133.1L718.2 135.2L717 128.9L721.8 124.7L715.7 122.6L714.5 116.2L709.6 120.5L703.8 118.5Z");
  bag.draw("hr-f7db17", "M700.7 128.7L705 124.9L710.5 126.8Z");
  bag.draw("hr-f7db17", "M711.2 126.6L715.6 122.8L721 124.7Z");
  bag.draw("hr-f7db17", "M721 124.9L716.7 128.7L711.2 126.8Z");
  bag.draw("hr-f7db17", "M710.5 127L706.2 130.7L700.7 128.9Z");
  bag.draw("hr-f7db17", "M704.2 118.9L709.6 120.8L710.7 126.5Z");
  bag.draw("hr-f7db17", "M711.2 127L716.6 128.9L717.7 134.5Z");
  bag.draw("hr-f7db17", "M717.6 134.7L712.1 132.8L711 127.1Z");
  bag.draw("hr-f7db17", "M710.6 126.6L705.1 124.7L704 119.1Z");
  bag.draw("hr-f7db17", "M714.3 117L715.4 122.7L711.1 126.5Z");
  bag.draw("hr-f7db17", "M710.8 127.2L711.9 132.8L707.6 136.6Z");
  bag.draw("hr-f7db17", "M707.4 136.5L706.3 130.9L710.7 127.1Z");
  bag.draw("hr-f7db17", "M710.9 126.4L709.8 120.8L714.1 117Z");
  bag.box(1200, 600);
  return bag.done("0 0 1200 600");
}


function doonfSlovakia() {
  var bag = doonfBag();
  bag.draw("sk-254aa5", "M0 400L900 400L900 200L0 200Z");
  bag.draw("white", "M0 200L900 200L900 0L0 0Z");
  bag.draw("sk-ed1c24", "M0 600L900 600L900 400L0 400Z");
  bag.draw("white", "M270 460L228.3 436.9L195.6 411L169.2 380L151.8 346.5L144.1 319.1L141.1 291.1L146.4 141L393.6 141L398.9 290.8L395.9 319.2L388.1 346.8L370.9 379.8L346.8 408.7L314.6 434.9L273.9 458.1Z");
  bag.draw("sk-ed1c24", "M270 450L231.8 428.4L200.8 403.6L176.9 375.4L160.1 343.1L150.1 292.1L154.5 150L385.5 150L389.9 291.3L387.1 317.7L379.7 343.6L364 374.1L340.4 402.4L310 427.2L271.5 449.3Z");
  bag.draw("white", "M280.6 261.3L316.1 260L343.2 254.2L343.2 290.2L315.4 284.5L280.6 283.1L280.6 334.7L259.4 334.7L259.4 283.1L224.2 284.5L196.8 290.2L196.8 254.2L225 260.1L259.4 261.3L259.4 228.9L233.9 230.4L209.8 236L209.8 200.1L233.2 205.6L259.4 207.2L252.8 160.8L287.2 160.8L280.6 207.2L306.2 205.7L330.2 200.1L330.2 236L306.8 230.5L280.6 228.9Z");
  bag.draw("sk-254aa5", "M270 329.1L259.3 331.3L248.4 338.6L231.8 363.6L218 350.2L201.9 347.3L188 353.3L173.9 370.7L191.1 393.5L212.6 414L270 450L327.9 413.6L349.2 393.1L366.1 370.7L352 353.3L338.1 347.3L321.8 350.3L308.2 363.6L293.7 340.7L274 329.4Z");
  bag.box(900, 600);
  return bag.done("0 0 900 600");
}


function doonfSlovenia() {
  var bag = doonfBag();
  bag.draw("si-ff0000", "M0 0L240 0L240 120L0 120Z");
  bag.draw("si-0000ff", "M0 0L240 0L240 80L0 80Z");
  bag.draw("white", "M0 0L240 0L240 40L0 40Z");
  bag.draw("si-0000ff", "M45.4 23.1L50.1 21.4L60 20L65 20.3L74.6 23.1L74.7 34.4L73.5 43.7L70.1 52.2L64.7 57.6L60 59.6L58.7 59.2L52.3 55.3L47.9 48.3L45.6 38.4L45.3 25.5Z");
  bag.draw("si-ffff00", "M60 26.9L60.4 27.9L61.5 27.8L60.9 28.7L61.5 29.6L60.4 29.5L60 30.4L59.6 29.5L58.5 29.6L59.1 28.7L58.5 27.8L59.6 27.9Z");
  bag.draw("si-ffff00", "M55.9 21.4L56.3 22.4L57.4 22.3L56.8 23.2L57.4 24.1L56.3 24L55.9 25L55.4 24L54.4 24.1L55 23.2L54.4 22.3L55.4 22.4Z");
  bag.draw("si-ffff00", "M64.1 21.4L64.6 22.4L65.6 22.3L65 23.2L65.6 24.1L64.6 24L64.1 25L63.7 24L62.6 24.1L63.2 23.2L62.6 22.3L63.7 22.4Z");
  bag.draw("white", "M60 32.6L63.5 39.6L65.9 36.5L71.7 44.3L70.6 48.1L67.3 52.9L62.7 56.5L60 57.6L57.3 56.5L50.9 50.7L48.3 44.5L54.1 36.5L56.5 39.6Z");
  bag.draw("si-0000ff", "M48.4 45.4L49.9 47.5L52.3 48.3L55.8 47.2L59.7 48.2L63.6 47.2L68.4 48.2L70.1 47.5L71.6 45.4L71.7 48.3L68.1 49.4L64.2 48.3L60.3 49.4L55.8 48.3L51.9 49.4L48.3 48.3L48.3 45.5Z");
  bag.draw("si-0000ff", "M48.4 47.7L49.9 49.8L52.3 50.5L55.8 49.5L59.7 50.5L63.6 49.5L68.4 50.5L70.1 49.8L71.6 47.7L71.7 50.6L68.1 51.6L64.2 50.6L60.3 51.6L56.4 50.6L51.9 51.6L48.3 50.6L48.3 47.7Z");
  bag.draw("si-ff0000", "M44.3 23.6L45.4 23.1L46.6 41.6L48.1 48L51.7 53.6L60 58.8L65.8 55.8L71.9 48L73.4 41.6L74.6 23.1L75.7 23.6L74.5 41.7L72.9 48.6L69 54.5L63.3 58.7L60 60L56.7 58.7L51 54.5L47.1 48.6L45.5 41.7Z");
  bag.box(240, 120);
  return bag.done("0 0 240 120");
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
  bag.draw("white", "M0 0L1350 0L1350 900L0 900Z");
  bag.draw("rs-blue", "M0 0L1350 0L1350 600L0 600Z");
  bag.draw("rs-red", "M0 0L1350 0L1350 300L0 300Z");
  bag.draw("rs-blue", "M498.6 122L498.2 125.7L497 129.2L495 132.3L492.4 134.9L489.3 136.9L485.8 138.1L482.1 138.5L478.5 138.1L475 136.9L471.9 134.9L469.2 132.3L467.3 129.2L466.1 125.7L465.6 122L466.1 118.3L467.3 114.8L469.2 111.7L471.9 109.1L475 107.1L478.5 105.9L482.1 105.5L485.8 105.9L489.3 107.1L492.4 109.1L495 111.7L497 114.8L498.2 118.3Z");
  bag.cut("rs-21231e", "M499.6 122L499.2 125.9L497.9 129.6L495.8 132.9L493.1 135.7L489.7 137.8L486 139.1L482.1 139.5L478.2 139.1L474.6 137.8L471.2 135.7L468.5 132.9L466.4 129.6L465.1 125.9L464.6 122L465.1 118.1L466.4 114.4L468.5 111.1L471.2 108.3L474.6 106.2L478.2 104.9L482.1 104.5L486 104.9L489.7 106.2L493.1 108.3L495.8 111.1L497.9 114.4L499.2 118.1ZM498.2 118.3L497 114.8L495 111.7L492.4 109.1L489.3 107.1L485.8 105.9L482.1 105.5L478.5 105.9L475 107.1L471.9 109.1L469.2 111.7L467.3 114.8L466.1 118.3L465.6 122L466.1 125.7L467.3 129.2L469.2 132.3L471.9 134.9L475 136.9L478.5 138.1L482.1 138.5L485.8 138.1L489.3 136.9L492.4 134.9L495 132.3L497 129.2L498.2 125.7L498.6 122Z");
  bag.draw("rs-edb92e", "M485.1 85L488 81L481.1 76.2L476.2 81.5L479.1 91.5L470.1 88.5L464.6 94.5L470.1 100.5L479.1 97.5L479.1 119L485.1 119L485.1 97.5L494.2 100.5L499.6 94.5L494.2 88.5L485.1 91.5Z");
  bag.draw("rs-edb92e", "M485.1 105.2L479.1 105.2L479.1 122.2L485.1 122.2Z");
  bag.draw("rs-edb92e", "M498.9 119L498.9 125L465.3 125L465.3 119L495.2 118.8Z");
  bag.draw("rs-edb92e", "M583.1 264L594.1 246L583.1 251.3L576.1 240L563.3 250L549.1 236L531.9 249L518.1 234L499.1 246L482.1 232L465.1 246L446.1 234L432.4 249L415.1 236L404.8 249.5L388.1 240L381.2 251.3L370.1 246L381.1 264Z");
  bag.draw("rs-edb92e", "M381.1 264.7L387.1 295.7L577.1 295.7L583.1 264.7L482.1 259.7Z");
  bag.draw("rs-edb92e", "M593.1 235.7L582.7 249.2L579.1 237.7L583.1 233.1L572.1 230.7L574.1 235.7L561.8 246.6L557.1 228.7L547.1 226.7L530.3 244.3L521.1 229.7L524.9 224.7L513.6 222.8L512.6 236L499.5 244.2L489.9 237.3L488.6 221.7L475.6 221.7L474.1 238L464 244.2L452.6 237.4L449.1 229.7L453.2 225.4L448.8 222.9L439.3 224.7L443.1 229.7L434 244.3L417.1 226.7L407.1 228.7L402.5 246.6L390.1 235.7L392.1 230.7L381.1 233.1L385.1 237.7L381.1 249.4L371.1 235.7L367.1 236.7L370 247L380.3 256.1L386.8 254.3L389.6 243.7L408.9 254.1L416.1 240.7L423.9 250.5L434.3 253L446.6 238.7L454.8 249.7L469.4 252L477.9 246.7L482.1 235.7L486.1 246.3L496.2 252.3L510.1 249.3L517.6 238.7L527.7 252.4L538.1 251.8L548.1 240.7L554.4 253.7L564.5 252.7L574.6 243.7L582.1 256.5L593.1 248.7L597.1 236.7Z");
  bag.draw("rs-edb92e", "M381.1 267.5L377.4 265.4L381.1 262.5L480.2 257.5L579.2 262.1L586 263.6L583.1 267.5L484.1 262.5L385.1 267.1Z");
  bag.draw("rs-edb92e", "M472.1 199.5L465.1 190.5L466 132.6L480.3 136.7L499.6 133.9L499.1 190.5L492.1 199.5Z");
  bag.draw("rs-edb92e", "M505.1 276L482.1 287.5L459.1 276L482.1 264.5Z");
  bag.draw("rs-edb92e", "M581.8 159L609.4 172L612.4 184L601.5 201L602.5 215L611.4 215L626.2 175L607.4 159L564 144Z");
  bag.draw("rs-edb92e", "M603.4 213.6L614 175L595.9 161.3L567.6 153.3L609.9 176.9L599.6 199.5L601.9 213.7Z");
  bag.draw("rs-edb92e", "M520 202.2L519.5 210.8L521.7 203.2Z");
  bag.draw("rs-edb92e", "M584.5 210.8L581.9 219.1L585.9 212.3Z");
  bag.draw("white", "M575 145L574.9 146.3L574.5 147.6L573.8 148.7L572.8 149.6L571.7 150.3L570.5 150.8L569.1 150.9L567.8 150.8L566.6 150.3L565.5 149.6L564.5 148.7L563.8 147.6L563.4 146.3L563.2 145L563.4 143.7L563.8 142.4L564.5 141.3L565.5 140.4L566.6 139.7L567.8 139.2L569.1 139.1L570.5 139.2L571.7 139.7L572.8 140.4L573.8 141.3L574.5 142.4L574.9 143.7Z");
  bag.cut("rs-21231e", "M576 145L575.9 146.5L575.4 148L574.5 149.3L573.4 150.4L572.1 151.2L570.7 151.7L569.1 151.9L567.6 151.7L566.1 151.2L564.8 150.4L563.7 149.3L562.9 148L562.4 146.5L562.2 145L562.4 143.5L562.9 142L563.7 140.7L564.8 139.6L566.1 138.8L567.6 138.3L569.1 138.1L570.7 138.3L572.1 138.8L573.4 139.6L574.5 140.7L575.4 142L575.9 143.5ZM574.9 143.7L574.5 142.4L573.8 141.3L572.8 140.4L571.7 139.7L570.5 139.2L569.1 139.1L567.8 139.2L566.6 139.7L565.5 140.4L564.5 141.3L563.8 142.4L563.4 143.7L563.2 145L563.4 146.3L563.8 147.6L564.5 148.7L565.5 149.6L566.6 150.3L567.8 150.8L569.1 150.9L570.5 150.8L571.7 150.3L572.8 149.6L573.8 148.7L574.5 147.6L574.9 146.3L575 145Z");
  bag.draw("white", "M587 149L586.9 150.3L586.5 151.6L585.8 152.7L584.8 153.6L583.7 154.3L582.5 154.8L581.1 154.9L579.8 154.8L578.6 154.3L577.5 153.6L576.5 152.7L575.8 151.6L575.4 150.3L575.2 149L575.4 147.7L575.8 146.4L576.5 145.3L577.5 144.4L578.6 143.7L579.8 143.2L581.1 143.1L582.5 143.2L583.7 143.7L584.8 144.4L585.8 145.3L586.5 146.4L586.9 147.7Z");
  bag.cut("rs-21231e", "M588 149L587.9 150.5L587.4 152L586.5 153.3L585.4 154.4L584.1 155.2L582.7 155.7L581.1 155.9L579.6 155.7L578.1 155.2L576.8 154.4L575.7 153.3L574.9 152L574.4 150.5L574.2 149L574.4 147.5L574.9 146L575.7 144.7L576.8 143.6L578.1 142.8L579.6 142.3L581.1 142.1L582.7 142.3L584.1 142.8L585.4 143.6L586.5 144.7L587.4 146L587.9 147.5ZM586.9 147.7L586.5 146.4L585.8 145.3L584.8 144.4L583.7 143.7L582.5 143.2L581.1 143.1L579.8 143.2L578.6 143.7L577.5 144.4L576.5 145.3L575.8 146.4L575.4 147.7L575.2 149L575.4 150.3L575.8 151.6L576.5 152.7L577.5 153.6L578.6 154.3L579.8 154.8L581.1 154.9L582.5 154.8L583.7 154.3L584.8 153.6L585.8 152.7L586.5 151.6L586.9 150.3L587 149Z");
  bag.draw("white", "M599 153L598.9 154.3L598.5 155.6L597.8 156.7L596.8 157.6L595.7 158.3L594.5 158.8L593.1 158.9L591.8 158.8L590.6 158.3L589.5 157.6L588.5 156.7L587.8 155.6L587.4 154.3L587.2 153L587.4 151.7L587.8 150.4L588.5 149.3L589.5 148.4L590.6 147.7L591.8 147.2L593.1 147.1L594.5 147.2L595.7 147.7L596.8 148.4L597.8 149.3L598.5 150.4L598.9 151.7Z");
  bag.cut("rs-21231e", "M600 153L599.9 154.5L599.4 156L598.5 157.3L597.4 158.4L596.1 159.2L594.7 159.7L593.1 159.9L591.6 159.7L590.1 159.2L588.8 158.4L587.7 157.3L586.9 156L586.4 154.5L586.2 153L586.4 151.5L586.9 150L587.7 148.7L588.8 147.6L590.1 146.8L591.6 146.3L593.1 146.1L594.7 146.3L596.1 146.8L597.4 147.6L598.5 148.7L599.4 150L599.9 151.5ZM598.9 151.7L598.5 150.4L597.8 149.3L596.8 148.4L595.7 147.7L594.5 147.2L593.1 147.1L591.8 147.2L590.6 147.7L589.5 148.4L588.5 149.3L587.8 150.4L587.4 151.7L587.2 153L587.4 154.3L587.8 155.6L588.5 156.7L589.5 157.6L590.6 158.3L591.8 158.8L593.1 158.9L594.5 158.8L595.7 158.3L596.8 157.6L597.8 156.7L598.5 155.6L598.9 154.3L599 153Z");
  bag.draw("white", "M611 158.5L610.9 159.8L610.5 161.1L609.8 162.2L608.8 163.1L607.7 163.8L606.5 164.3L605.1 164.4L603.8 164.3L602.6 163.8L601.5 163.1L600.5 162.2L599.8 161.1L599.4 159.8L599.2 158.5L599.4 157.2L599.8 155.9L600.5 154.8L601.5 153.9L602.6 153.2L603.8 152.7L605.1 152.6L606.5 152.7L607.7 153.2L608.8 153.9L609.8 154.8L610.5 155.9L610.9 157.2Z");
  bag.cut("rs-21231e", "M612 158.5L611.9 160L611.4 161.5L610.5 162.8L609.4 163.9L608.1 164.7L606.7 165.2L605.1 165.4L603.6 165.2L602.1 164.7L600.8 163.9L599.7 162.8L598.9 161.5L598.4 160L598.2 158.5L598.4 157L598.9 155.5L599.7 154.2L600.8 153.1L602.1 152.3L603.6 151.8L605.1 151.6L606.7 151.8L608.1 152.3L609.4 153.1L610.5 154.2L611.4 155.5L611.9 157ZM610.9 157.2L610.5 155.9L609.8 154.8L608.8 153.9L607.7 153.2L606.5 152.7L605.1 152.6L603.8 152.7L602.6 153.2L601.5 153.9L600.5 154.8L599.8 155.9L599.4 157.2L599.2 158.5L599.4 159.8L599.8 161.1L600.5 162.2L601.5 163.1L602.6 163.8L603.8 164.3L605.1 164.4L606.5 164.3L607.7 163.8L608.8 163.1L609.8 162.2L610.5 161.1L610.9 159.8L611 158.5Z");
  bag.draw("white", "M622 165L621.9 166.3L621.5 167.6L620.8 168.7L619.8 169.6L618.7 170.3L617.5 170.8L616.1 170.9L614.8 170.8L613.6 170.3L612.5 169.6L611.5 168.7L610.8 167.6L610.4 166.3L610.2 165L610.4 163.7L610.8 162.4L611.5 161.3L612.5 160.4L613.6 159.7L614.8 159.2L616.1 159.1L617.5 159.2L618.7 159.7L619.8 160.4L620.8 161.3L621.5 162.4L621.9 163.7Z");
  bag.cut("rs-21231e", "M623 165L622.9 166.5L622.4 168L621.5 169.3L620.4 170.4L619.1 171.2L617.7 171.7L616.1 171.9L614.6 171.7L613.1 171.2L611.8 170.4L610.7 169.3L609.9 168L609.4 166.5L609.2 165L609.4 163.5L609.9 162L610.7 160.7L611.8 159.6L613.1 158.8L614.6 158.3L616.1 158.1L617.7 158.3L619.1 158.8L620.4 159.6L621.5 160.7L622.4 162L622.9 163.5ZM621.9 163.7L621.5 162.4L620.8 161.3L619.8 160.4L618.7 159.7L617.5 159.2L616.1 159.1L614.8 159.2L613.6 159.7L612.5 160.4L611.5 161.3L610.8 162.4L610.4 163.7L610.2 165L610.4 166.3L610.8 167.6L611.5 168.7L612.5 169.6L613.6 170.3L614.8 170.8L616.1 170.9L617.5 170.8L618.7 170.3L619.8 169.6L620.8 168.7L621.5 167.6L621.9 166.3L622 165Z");
  bag.draw("white", "M617 210L616.9 211.3L616.5 212.6L615.8 213.7L614.8 214.6L613.7 215.3L612.5 215.8L611.1 215.9L609.8 215.8L608.6 215.3L607.5 214.6L606.5 213.7L605.8 212.6L605.4 211.3L605.2 210L605.4 208.7L605.8 207.4L606.5 206.3L607.5 205.4L608.6 204.7L609.8 204.2L611.1 204.1L612.5 204.2L613.7 204.7L614.8 205.4L615.8 206.3L616.5 207.4L616.9 208.7Z");
  bag.cut("rs-21231e", "M618 210L617.9 211.5L617.4 213L616.5 214.3L615.4 215.4L614.1 216.2L612.7 216.7L611.1 216.9L609.6 216.7L608.1 216.2L606.8 215.4L605.7 214.3L604.9 213L604.4 211.5L604.2 210L604.4 208.5L604.9 207L605.7 205.7L606.8 204.6L608.1 203.8L609.6 203.3L611.1 203.1L612.7 203.3L614.1 203.8L615.4 204.6L616.5 205.7L617.4 207L617.9 208.5ZM616.9 208.7L616.5 207.4L615.8 206.3L614.8 205.4L613.7 204.7L612.5 204.2L611.1 204.1L609.8 204.2L608.6 204.7L607.5 205.4L606.5 206.3L605.8 207.4L605.4 208.7L605.2 210L605.4 211.3L605.8 212.6L606.5 213.7L607.5 214.6L608.6 215.3L609.8 215.8L611.1 215.9L612.5 215.8L613.7 215.3L614.8 214.6L615.8 213.7L616.5 212.6L616.9 211.3L617 210Z");
  bag.draw("white", "M623 199L622.9 200.3L622.5 201.6L621.8 202.7L620.8 203.6L619.7 204.3L618.5 204.8L617.1 204.9L615.8 204.8L614.6 204.3L613.5 203.6L612.5 202.7L611.8 201.6L611.4 200.3L611.2 199L611.4 197.7L611.8 196.4L612.5 195.3L613.5 194.4L614.6 193.7L615.8 193.2L617.1 193.1L618.5 193.2L619.7 193.7L620.8 194.4L621.8 195.3L622.5 196.4L622.9 197.7Z");
  bag.cut("rs-21231e", "M624 199L623.9 200.5L623.4 202L622.5 203.3L621.4 204.4L620.1 205.2L618.7 205.7L617.1 205.9L615.6 205.7L614.1 205.2L612.8 204.4L611.7 203.3L610.9 202L610.4 200.5L610.2 199L610.4 197.5L610.9 196L611.7 194.7L612.8 193.6L614.1 192.8L615.6 192.3L617.1 192.1L618.7 192.3L620.1 192.8L621.4 193.6L622.5 194.7L623.4 196L623.9 197.5ZM622.9 197.7L622.5 196.4L621.8 195.3L620.8 194.4L619.7 193.7L618.5 193.2L617.1 193.1L615.8 193.2L614.6 193.7L613.5 194.4L612.5 195.3L611.8 196.4L611.4 197.7L611.2 199L611.4 200.3L611.8 201.6L612.5 202.7L613.5 203.6L614.6 204.3L615.8 204.8L617.1 204.9L618.5 204.8L619.7 204.3L620.8 203.6L621.8 202.7L622.5 201.6L622.9 200.3L623 199Z");
  bag.draw("white", "M628 188L627.9 189.3L627.5 190.6L626.8 191.7L625.8 192.6L624.7 193.3L623.5 193.8L622.1 193.9L620.8 193.8L619.6 193.3L618.5 192.6L617.5 191.7L616.8 190.6L616.4 189.3L616.2 188L616.4 186.7L616.8 185.4L617.5 184.3L618.5 183.4L619.6 182.7L620.8 182.2L622.1 182.1L623.5 182.2L624.7 182.7L625.8 183.4L626.8 184.3L627.5 185.4L627.9 186.7Z");
  bag.cut("rs-21231e", "M629 188L628.9 189.5L628.4 191L627.5 192.3L626.4 193.4L625.1 194.2L623.7 194.7L622.1 194.9L620.6 194.7L619.1 194.2L617.8 193.4L616.7 192.3L615.9 191L615.4 189.5L615.2 188L615.4 186.5L615.9 185L616.7 183.7L617.8 182.6L619.1 181.8L620.6 181.3L622.1 181.1L623.7 181.3L625.1 181.8L626.4 182.6L627.5 183.7L628.4 185L628.9 186.5ZM627.9 186.7L627.5 185.4L626.8 184.3L625.8 183.4L624.7 182.7L623.5 182.2L622.1 182.1L620.8 182.2L619.6 182.7L618.5 183.4L617.5 184.3L616.8 185.4L616.4 186.7L616.2 188L616.4 189.3L616.8 190.6L617.5 191.7L618.5 192.6L619.6 193.3L620.8 193.8L622.1 193.9L623.5 193.8L624.7 193.3L625.8 192.6L626.8 191.7L627.5 190.6L627.9 189.3L628 188Z");
  bag.draw("white", "M630 175L629.9 176.3L629.5 177.6L628.8 178.7L627.8 179.6L626.7 180.3L625.5 180.8L624.1 180.9L622.8 180.8L621.6 180.3L620.5 179.6L619.5 178.7L618.8 177.6L618.4 176.3L618.2 175L618.4 173.7L618.8 172.4L619.5 171.3L620.5 170.4L621.6 169.7L622.8 169.2L624.1 169.1L625.5 169.2L626.7 169.7L627.8 170.4L628.8 171.3L629.5 172.4L629.9 173.7Z");
  bag.cut("rs-21231e", "M631 175L630.9 176.5L630.4 178L629.5 179.3L628.4 180.4L627.1 181.2L625.7 181.7L624.1 181.9L622.6 181.7L621.1 181.2L619.8 180.4L618.7 179.3L617.9 178L617.4 176.5L617.2 175L617.4 173.5L617.9 172L618.7 170.7L619.8 169.6L621.1 168.8L622.6 168.3L624.1 168.1L625.7 168.3L627.1 168.8L628.4 169.6L629.5 170.7L630.4 172L630.9 173.5ZM629.9 173.7L629.5 172.4L628.8 171.3L627.8 170.4L626.7 169.7L625.5 169.2L624.1 169.1L622.8 169.2L621.6 169.7L620.5 170.4L619.5 171.3L618.8 172.4L618.4 173.7L618.2 175L618.4 176.3L618.8 177.6L619.5 178.7L620.5 179.6L621.6 180.3L622.8 180.8L624.1 180.9L625.5 180.8L626.7 180.3L627.8 179.6L628.8 178.7L629.5 177.6L629.9 176.3L630 175Z");
  bag.draw("white", "M508.8 284L508.8 284.6L508.6 285.2L508.3 285.7L507.8 286.1L507.3 286.4L506.7 286.6L506.1 286.7L505.5 286.6L505 286.4L504.5 286.1L504 285.7L503.7 285.2L503.5 284.6L503.4 284L503.5 283.4L503.7 282.8L504 282.3L504.5 281.9L505 281.6L505.5 281.4L506.1 281.3L506.7 281.4L507.3 281.6L507.8 281.9L508.3 282.3L508.6 282.8L508.8 283.4Z");
  bag.cut("rs-21231e", "M509.8 284L509.8 284.8L509.5 285.6L509 286.3L508.4 286.9L507.7 287.3L507 287.6L506.1 287.7L505.3 287.6L504.5 287.3L503.8 286.9L503.3 286.3L502.8 285.6L502.5 284.8L502.4 284L502.5 283.2L502.8 282.4L503.3 281.7L503.8 281.1L504.5 280.7L505.3 280.4L506.1 280.3L507 280.4L507.7 280.7L508.4 281.1L509 281.7L509.5 282.4L509.8 283.2ZM508.8 283.4L508.6 282.8L508.3 282.3L507.8 281.9L507.3 281.6L506.7 281.4L506.1 281.3L505.5 281.4L505 281.6L504.5 281.9L504 282.3L503.7 282.8L503.5 283.4L503.4 284L503.5 284.6L503.7 285.2L504 285.7L504.5 286.1L505 286.4L505.5 286.6L506.1 286.7L506.7 286.6L507.3 286.4L507.8 286.1L508.3 285.7L508.6 285.2L508.8 284.6L508.8 284Z");
  bag.draw("white", "M557.8 287L557.8 287.6L557.6 288.2L557.3 288.7L556.8 289.1L556.3 289.4L555.7 289.6L555.1 289.7L554.5 289.6L554 289.4L553.5 289.1L553 288.7L552.7 288.2L552.5 287.6L552.4 287L552.5 286.4L552.7 285.8L553 285.3L553.5 284.9L554 284.6L554.5 284.4L555.1 284.3L555.7 284.4L556.3 284.6L556.8 284.9L557.3 285.3L557.6 285.8L557.8 286.4Z");
  bag.cut("rs-21231e", "M558.8 287L558.8 287.8L558.5 288.6L558 289.3L557.4 289.9L556.7 290.3L556 290.6L555.1 290.7L554.3 290.6L553.5 290.3L552.8 289.9L552.3 289.3L551.8 288.6L551.5 287.8L551.4 287L551.5 286.2L551.8 285.4L552.3 284.7L552.8 284.1L553.5 283.7L554.3 283.4L555.1 283.3L556 283.4L556.7 283.7L557.4 284.1L558 284.7L558.5 285.4L558.8 286.2ZM557.8 286.4L557.6 285.8L557.3 285.3L556.8 284.9L556.3 284.6L555.7 284.4L555.1 284.3L554.5 284.4L554 284.6L553.5 284.9L553 285.3L552.7 285.8L552.5 286.4L552.4 287L552.5 287.6L552.7 288.2L553 288.7L553.5 289.1L554 289.4L554.5 289.6L555.1 289.7L555.7 289.6L556.3 289.4L556.8 289.1L557.3 288.7L557.6 288.2L557.8 287.6L557.8 287Z");
  bag.draw("white", "M559.8 272L559.8 272.6L559.6 273.2L559.3 273.7L558.8 274.1L558.3 274.4L557.7 274.6L557.1 274.7L556.5 274.6L556 274.4L555.5 274.1L555 273.7L554.7 273.2L554.5 272.6L554.4 272L554.5 271.4L554.7 270.8L555 270.3L555.5 269.9L556 269.6L556.5 269.4L557.1 269.3L557.7 269.4L558.3 269.6L558.8 269.9L559.3 270.3L559.6 270.8L559.8 271.4Z");
  bag.cut("rs-21231e", "M560.8 272L560.8 272.8L560.5 273.6L560 274.3L559.4 274.9L558.7 275.3L558 275.6L557.1 275.7L556.3 275.6L555.5 275.3L554.8 274.9L554.3 274.3L553.8 273.6L553.5 272.8L553.4 272L553.5 271.2L553.8 270.4L554.3 269.7L554.8 269.1L555.5 268.7L556.3 268.4L557.1 268.3L558 268.4L558.7 268.7L559.4 269.1L560 269.7L560.5 270.4L560.8 271.2ZM559.8 271.4L559.6 270.8L559.3 270.3L558.8 269.9L558.3 269.6L557.7 269.4L557.1 269.3L556.5 269.4L556 269.6L555.5 269.9L555 270.3L554.7 270.8L554.5 271.4L554.4 272L554.5 272.6L554.7 273.2L555 273.7L555.5 274.1L556 274.4L556.5 274.6L557.1 274.7L557.7 274.6L558.3 274.4L558.8 274.1L559.3 273.7L559.6 273.2L559.8 272.6L559.8 272Z");
  bag.draw("white", "M509.8 269L509.8 269.6L509.6 270.2L509.3 270.7L508.8 271.1L508.3 271.4L507.7 271.6L507.1 271.7L506.5 271.6L506 271.4L505.5 271.1L505 270.7L504.7 270.2L504.5 269.6L504.4 269L504.5 268.4L504.7 267.8L505 267.3L505.5 266.9L506 266.6L506.5 266.4L507.1 266.3L507.7 266.4L508.3 266.6L508.8 266.9L509.3 267.3L509.6 267.8L509.8 268.4Z");
  bag.cut("rs-21231e", "M510.8 269L510.8 269.8L510.5 270.6L510 271.3L509.4 271.9L508.7 272.3L508 272.6L507.1 272.7L506.3 272.6L505.5 272.3L504.8 271.9L504.3 271.3L503.8 270.6L503.5 269.8L503.4 269L503.5 268.2L503.8 267.4L504.3 266.7L504.8 266.1L505.5 265.7L506.3 265.4L507.1 265.3L508 265.4L508.7 265.7L509.4 266.1L510 266.7L510.5 267.4L510.8 268.2ZM509.8 268.4L509.6 267.8L509.3 267.3L508.8 266.9L508.3 266.6L507.7 266.4L507.1 266.3L506.5 266.4L506 266.6L505.5 266.9L505 267.3L504.7 267.8L504.5 268.4L504.4 269L504.5 269.6L504.7 270.2L505 270.7L505.5 271.1L506 271.4L506.5 271.6L507.1 271.7L507.7 271.6L508.3 271.4L508.8 271.1L509.3 270.7L509.6 270.2L509.8 269.6L509.8 269Z");
  bag.draw("white", "M521.9 223L523.7 208L515.8 207.1L514.7 221.1L520.1 225.1Z");
  bag.draw("white", "M575.2 229.5L581.5 231.4L586.9 217.4L579.3 214.5L575.1 227.9Z");
  bag.draw("rs-edb92e", "M498.1 140L533.1 141L555.1 148L561.1 162L545.1 193L552.1 213L573.1 195L583.1 158L556.1 135L499.1 131Z");
  bag.draw("rs-edb92e", "M499.9 137.8L532.6 139.2L558.9 149.5L562 162.8L547.6 191.9L550.3 203L545.4 202.9L542.7 192.4L557 167.3L555.6 152.4L538.8 143.9L499.8 138Z");
  bag.draw("rs-edb92e", "M569.9 144L580.9 163.2L571.2 194.7L561.2 206.5L574.2 197.3L584.9 163.5L582.9 153.9L572.4 145.2Z");
  bag.draw("white", "M510 130L509.9 131.3L509.5 132.6L508.8 133.7L507.8 134.6L506.7 135.3L505.5 135.8L504.1 135.9L502.8 135.8L501.6 135.3L500.5 134.6L499.5 133.7L498.8 132.6L498.4 131.3L498.2 130L498.4 128.7L498.8 127.4L499.5 126.3L500.5 125.4L501.6 124.7L502.8 124.2L504.1 124.1L505.5 124.2L506.7 124.7L507.8 125.4L508.8 126.3L509.5 127.4L509.9 128.7Z");
  bag.cut("rs-21231e", "M511 130L510.9 131.5L510.4 133L509.5 134.3L508.4 135.4L507.1 136.2L505.7 136.7L504.1 136.9L502.6 136.7L501.1 136.2L499.8 135.4L498.7 134.3L497.9 133L497.4 131.5L497.2 130L497.4 128.5L497.9 127L498.7 125.7L499.8 124.6L501.1 123.8L502.6 123.3L504.1 123.1L505.7 123.3L507.1 123.8L508.4 124.6L509.5 125.7L510.4 127L510.9 128.5ZM509.9 128.7L509.5 127.4L508.8 126.3L507.8 125.4L506.7 124.7L505.5 124.2L504.1 124.1L502.8 124.2L501.6 124.7L500.5 125.4L499.5 126.3L498.8 127.4L498.4 128.7L498.2 130L498.4 131.3L498.8 132.6L499.5 133.7L500.5 134.6L501.6 135.3L502.8 135.8L504.1 135.9L505.5 135.8L506.7 135.3L507.8 134.6L508.8 133.7L509.5 132.6L509.9 131.3L510 130Z");
  bag.draw("white", "M522.5 130L522.4 131.3L522 132.6L521.3 133.7L520.3 134.6L519.2 135.3L518 135.8L516.6 135.9L515.3 135.8L514.1 135.3L513 134.6L512 133.7L511.3 132.6L510.9 131.3L510.7 130L510.9 128.7L511.3 127.4L512 126.3L513 125.4L514.1 124.7L515.3 124.2L516.6 124.1L518 124.2L519.2 124.7L520.3 125.4L521.3 126.3L522 127.4L522.4 128.7Z");
  bag.cut("rs-21231e", "M523.5 130L523.4 131.5L522.9 133L522 134.3L520.9 135.4L519.6 136.2L518.2 136.7L516.6 136.9L515.1 136.7L513.6 136.2L512.3 135.4L511.2 134.3L510.4 133L509.9 131.5L509.7 130L509.9 128.5L510.4 127L511.2 125.7L512.3 124.6L513.6 123.8L515.1 123.3L516.6 123.1L518.2 123.3L519.6 123.8L520.9 124.6L522 125.7L522.9 127L523.4 128.5ZM522.4 128.7L522 127.4L521.3 126.3L520.3 125.4L519.2 124.7L518 124.2L516.6 124.1L515.3 124.2L514.1 124.7L513 125.4L512 126.3L511.3 127.4L510.9 128.7L510.7 130L510.9 131.3L511.3 132.6L512 133.7L513 134.6L514.1 135.3L515.3 135.8L516.6 135.9L518 135.8L519.2 135.3L520.3 134.6L521.3 133.7L522 132.6L522.4 131.3L522.5 130Z");
  bag.draw("white", "M535 131.5L534.9 132.8L534.5 134.1L533.8 135.2L532.8 136.1L531.7 136.8L530.5 137.3L529.1 137.4L527.8 137.3L526.6 136.8L525.5 136.1L524.5 135.2L523.8 134.1L523.4 132.8L523.2 131.5L523.4 130.2L523.8 128.9L524.5 127.8L525.5 126.9L526.6 126.2L527.8 125.7L529.1 125.6L530.5 125.7L531.7 126.2L532.8 126.9L533.8 127.8L534.5 128.9L534.9 130.2Z");
  bag.cut("rs-21231e", "M536 131.5L535.9 133L535.4 134.5L534.5 135.8L533.4 136.9L532.1 137.7L530.7 138.2L529.1 138.4L527.6 138.2L526.1 137.7L524.8 136.9L523.7 135.8L522.9 134.5L522.4 133L522.2 131.5L522.4 130L522.9 128.5L523.7 127.2L524.8 126.1L526.1 125.3L527.6 124.8L529.1 124.6L530.7 124.8L532.1 125.3L533.4 126.1L534.5 127.2L535.4 128.5L535.9 130ZM534.9 130.2L534.5 128.9L533.8 127.8L532.8 126.9L531.7 126.2L530.5 125.7L529.1 125.6L527.8 125.7L526.6 126.2L525.5 126.9L524.5 127.8L523.8 128.9L523.4 130.2L523.2 131.5L523.4 132.8L523.8 134.1L524.5 135.2L525.5 136.1L526.6 136.8L527.8 137.3L529.1 137.4L530.5 137.3L531.7 136.8L532.8 136.1L533.8 135.2L534.5 134.1L534.9 132.8L535 131.5Z");
  bag.draw("white", "M547 134L546.9 135.3L546.5 136.6L545.8 137.7L544.8 138.6L543.7 139.3L542.5 139.8L541.1 139.9L539.8 139.8L538.6 139.3L537.5 138.6L536.5 137.7L535.8 136.6L535.4 135.3L535.2 134L535.4 132.7L535.8 131.4L536.5 130.3L537.5 129.4L538.6 128.7L539.8 128.2L541.1 128.1L542.5 128.2L543.7 128.7L544.8 129.4L545.8 130.3L546.5 131.4L546.9 132.7Z");
  bag.cut("rs-21231e", "M548 134L547.9 135.5L547.4 137L546.5 138.3L545.4 139.4L544.1 140.2L542.7 140.7L541.1 140.9L539.6 140.7L538.1 140.2L536.8 139.4L535.7 138.3L534.9 137L534.4 135.5L534.2 134L534.4 132.5L534.9 131L535.7 129.7L536.8 128.6L538.1 127.8L539.6 127.3L541.1 127.1L542.7 127.3L544.1 127.8L545.4 128.6L546.5 129.7L547.4 131L547.9 132.5ZM546.9 132.7L546.5 131.4L545.8 130.3L544.8 129.4L543.7 128.7L542.5 128.2L541.1 128.1L539.8 128.2L538.6 128.7L537.5 129.4L536.5 130.3L535.8 131.4L535.4 132.7L535.2 134L535.4 135.3L535.8 136.6L536.5 137.7L537.5 138.6L538.6 139.3L539.8 139.8L541.1 139.9L542.5 139.8L543.7 139.3L544.8 138.6L545.8 137.7L546.5 136.6L546.9 135.3L547 134Z");
  bag.draw("white", "M559 138L558.9 139.3L558.5 140.6L557.8 141.7L556.8 142.6L555.7 143.3L554.5 143.8L553.1 143.9L551.8 143.8L550.6 143.3L549.5 142.6L548.5 141.7L547.8 140.6L547.4 139.3L547.2 138L547.4 136.7L547.8 135.4L548.5 134.3L549.5 133.4L550.6 132.7L551.8 132.2L553.1 132.1L554.5 132.2L555.7 132.7L556.8 133.4L557.8 134.3L558.5 135.4L558.9 136.7Z");
  bag.cut("rs-21231e", "M560 138L559.9 139.5L559.4 141L558.5 142.3L557.4 143.4L556.1 144.2L554.7 144.7L553.1 144.9L551.6 144.7L550.1 144.2L548.8 143.4L547.7 142.3L546.9 141L546.4 139.5L546.2 138L546.4 136.5L546.9 135L547.7 133.7L548.8 132.6L550.1 131.8L551.6 131.3L553.1 131.1L554.7 131.3L556.1 131.8L557.4 132.6L558.5 133.7L559.4 135L559.9 136.5ZM558.9 136.7L558.5 135.4L557.8 134.3L556.8 133.4L555.7 132.7L554.5 132.2L553.1 132.1L551.8 132.2L550.6 132.7L549.5 133.4L548.5 134.3L547.8 135.4L547.4 136.7L547.2 138L547.4 139.3L547.8 140.6L548.5 141.7L549.5 142.6L550.6 143.3L551.8 143.8L553.1 143.9L554.5 143.8L555.7 143.3L556.8 142.6L557.8 141.7L558.5 140.6L558.9 139.3L559 138Z");
  bag.draw("white", "M570 143L569.9 144.3L569.5 145.6L568.8 146.7L567.8 147.6L566.7 148.3L565.5 148.8L564.1 148.9L562.8 148.8L561.6 148.3L560.5 147.6L559.5 146.7L558.8 145.6L558.4 144.3L558.2 143L558.4 141.7L558.8 140.4L559.5 139.3L560.5 138.4L561.6 137.7L562.8 137.2L564.1 137.1L565.5 137.2L566.7 137.7L567.8 138.4L568.8 139.3L569.5 140.4L569.9 141.7Z");
  bag.cut("rs-21231e", "M571 143L570.9 144.5L570.4 146L569.5 147.3L568.4 148.4L567.1 149.2L565.7 149.7L564.1 149.9L562.6 149.7L561.1 149.2L559.8 148.4L558.7 147.3L557.9 146L557.4 144.5L557.2 143L557.4 141.5L557.9 140L558.7 138.7L559.8 137.6L561.1 136.8L562.6 136.3L564.1 136.1L565.7 136.3L567.1 136.8L568.4 137.6L569.5 138.7L570.4 140L570.9 141.5ZM569.9 141.7L569.5 140.4L568.8 139.3L567.8 138.4L566.7 137.7L565.5 137.2L564.1 137.1L562.8 137.2L561.6 137.7L560.5 138.4L559.5 139.3L558.8 140.4L558.4 141.7L558.2 143L558.4 144.3L558.8 145.6L559.5 146.7L560.5 147.6L561.6 148.3L562.8 148.8L564.1 148.9L565.5 148.8L566.7 148.3L567.8 147.6L568.8 146.7L569.5 145.6L569.9 144.3L570 143Z");
  bag.draw("white", "M577 151L576.9 152.3L576.5 153.6L575.8 154.7L574.8 155.6L573.7 156.3L572.5 156.8L571.1 156.9L569.8 156.8L568.6 156.3L567.5 155.6L566.5 154.7L565.8 153.6L565.4 152.3L565.2 151L565.4 149.7L565.8 148.4L566.5 147.3L567.5 146.4L568.6 145.7L569.8 145.2L571.1 145.1L572.5 145.2L573.7 145.7L574.8 146.4L575.8 147.3L576.5 148.4L576.9 149.7Z");
  bag.cut("rs-21231e", "M578 151L577.9 152.5L577.4 154L576.5 155.3L575.4 156.4L574.1 157.2L572.7 157.7L571.1 157.9L569.6 157.7L568.1 157.2L566.8 156.4L565.7 155.3L564.9 154L564.4 152.5L564.2 151L564.4 149.5L564.9 148L565.7 146.7L566.8 145.6L568.1 144.8L569.6 144.3L571.1 144.1L572.7 144.3L574.1 144.8L575.4 145.6L576.5 146.7L577.4 148L577.9 149.5ZM576.9 149.7L576.5 148.4L575.8 147.3L574.8 146.4L573.7 145.7L572.5 145.2L571.1 145.1L569.8 145.2L568.6 145.7L567.5 146.4L566.5 147.3L565.8 148.4L565.4 149.7L565.2 151L565.4 152.3L565.8 153.6L566.5 154.7L567.5 155.6L568.6 156.3L569.8 156.8L571.1 156.9L572.5 156.8L573.7 156.3L574.8 155.6L575.8 154.7L576.5 153.6L576.9 152.3L577 151Z");
  bag.draw("white", "M564 197L563.9 198.3L563.5 199.6L562.8 200.7L561.8 201.6L560.7 202.3L559.5 202.8L558.1 202.9L556.8 202.8L555.6 202.3L554.5 201.6L553.5 200.7L552.8 199.6L552.4 198.3L552.2 197L552.4 195.7L552.8 194.4L553.5 193.3L554.5 192.4L555.6 191.7L556.8 191.2L558.1 191.1L559.5 191.2L560.7 191.7L561.8 192.4L562.8 193.3L563.5 194.4L563.9 195.7Z");
  bag.cut("rs-21231e", "M565 197L564.9 198.5L564.4 200L563.5 201.3L562.4 202.4L561.1 203.2L559.7 203.7L558.1 203.9L556.6 203.7L555.1 203.2L553.8 202.4L552.7 201.3L551.9 200L551.4 198.5L551.2 197L551.4 195.5L551.9 194L552.7 192.7L553.8 191.6L555.1 190.8L556.6 190.3L558.1 190.1L559.7 190.3L561.1 190.8L562.4 191.6L563.5 192.7L564.4 194L564.9 195.5ZM563.9 195.7L563.5 194.4L562.8 193.3L561.8 192.4L560.7 191.7L559.5 191.2L558.1 191.1L556.8 191.2L555.6 191.7L554.5 192.4L553.5 193.3L552.8 194.4L552.4 195.7L552.2 197L552.4 198.3L552.8 199.6L553.5 200.7L554.5 201.6L555.6 202.3L556.8 202.8L558.1 202.9L559.5 202.8L560.7 202.3L561.8 201.6L562.8 200.7L563.5 199.6L563.9 198.3L564 197Z");
  bag.draw("white", "M569 186L568.9 187.3L568.5 188.6L567.8 189.7L566.8 190.6L565.7 191.3L564.5 191.8L563.1 191.9L561.8 191.8L560.6 191.3L559.5 190.6L558.5 189.7L557.8 188.6L557.4 187.3L557.2 186L557.4 184.7L557.8 183.4L558.5 182.3L559.5 181.4L560.6 180.7L561.8 180.2L563.1 180.1L564.5 180.2L565.7 180.7L566.8 181.4L567.8 182.3L568.5 183.4L568.9 184.7Z");
  bag.cut("rs-21231e", "M570 186L569.9 187.5L569.4 189L568.5 190.3L567.4 191.4L566.1 192.2L564.7 192.7L563.1 192.9L561.6 192.7L560.1 192.2L558.8 191.4L557.7 190.3L556.9 189L556.4 187.5L556.2 186L556.4 184.5L556.9 183L557.7 181.7L558.8 180.6L560.1 179.8L561.6 179.3L563.1 179.1L564.7 179.3L566.1 179.8L567.4 180.6L568.5 181.7L569.4 183L569.9 184.5ZM568.9 184.7L568.5 183.4L567.8 182.3L566.8 181.4L565.7 180.7L564.5 180.2L563.1 180.1L561.8 180.2L560.6 180.7L559.5 181.4L558.5 182.3L557.8 183.4L557.4 184.7L557.2 186L557.4 187.3L557.8 188.6L558.5 189.7L559.5 190.6L560.6 191.3L561.8 191.8L563.1 191.9L564.5 191.8L565.7 191.3L566.8 190.6L567.8 189.7L568.5 188.6L568.9 187.3L569 186Z");
  bag.draw("white", "M574 175L573.9 176.3L573.5 177.6L572.8 178.7L571.8 179.6L570.7 180.3L569.5 180.8L568.1 180.9L566.8 180.8L565.6 180.3L564.5 179.6L563.5 178.7L562.8 177.6L562.4 176.3L562.2 175L562.4 173.7L562.8 172.4L563.5 171.3L564.5 170.4L565.6 169.7L566.8 169.2L568.1 169.1L569.5 169.2L570.7 169.7L571.8 170.4L572.8 171.3L573.5 172.4L573.9 173.7Z");
  bag.cut("rs-21231e", "M575 175L574.9 176.5L574.4 178L573.5 179.3L572.4 180.4L571.1 181.2L569.7 181.7L568.1 181.9L566.6 181.7L565.1 181.2L563.8 180.4L562.7 179.3L561.9 178L561.4 176.5L561.2 175L561.4 173.5L561.9 172L562.7 170.7L563.8 169.6L565.1 168.8L566.6 168.3L568.1 168.1L569.7 168.3L571.1 168.8L572.4 169.6L573.5 170.7L574.4 172L574.9 173.5ZM573.9 173.7L573.5 172.4L572.8 171.3L571.8 170.4L570.7 169.7L569.5 169.2L568.1 169.1L566.8 169.2L565.6 169.7L564.5 170.4L563.5 171.3L562.8 172.4L562.4 173.7L562.2 175L562.4 176.3L562.8 177.6L563.5 178.7L564.5 179.6L565.6 180.3L566.8 180.8L568.1 180.9L569.5 180.8L570.7 180.3L571.8 179.6L572.8 178.7L573.5 177.6L573.9 176.3L574 175Z");
  bag.draw("white", "M578 163L577.9 164.3L577.5 165.6L576.8 166.7L575.8 167.6L574.7 168.3L573.5 168.8L572.1 168.9L570.8 168.8L569.6 168.3L568.5 167.6L567.5 166.7L566.8 165.6L566.4 164.3L566.2 163L566.4 161.7L566.8 160.4L567.5 159.3L568.5 158.4L569.6 157.7L570.8 157.2L572.1 157.1L573.5 157.2L574.7 157.7L575.8 158.4L576.8 159.3L577.5 160.4L577.9 161.7Z");
  bag.cut("rs-21231e", "M579 163L578.9 164.5L578.4 166L577.5 167.3L576.4 168.4L575.1 169.2L573.7 169.7L572.1 169.9L570.6 169.7L569.1 169.2L567.8 168.4L566.7 167.3L565.9 166L565.4 164.5L565.2 163L565.4 161.5L565.9 160L566.7 158.7L567.8 157.6L569.1 156.8L570.6 156.3L572.1 156.1L573.7 156.3L575.1 156.8L576.4 157.6L577.5 158.7L578.4 160L578.9 161.5ZM577.9 161.7L577.5 160.4L576.8 159.3L575.8 158.4L574.7 157.7L573.5 157.2L572.1 157.1L570.8 157.2L569.6 157.7L568.5 158.4L567.5 159.3L566.8 160.4L566.4 161.7L566.2 163L566.4 164.3L566.8 165.6L567.5 166.7L568.5 167.6L569.6 168.3L570.8 168.8L572.1 168.9L573.5 168.8L574.7 168.3L575.8 167.6L576.8 166.7L577.5 165.6L577.9 164.3L578 163Z");
  bag.draw("rs-edb92e", "M606.1 217L613.7 219.5L607.3 216.4Z");
  bag.draw("rs-edb92e", "M607.1 212.3L597.9 212.9L602.6 230.4L610.7 213.4Z");
  bag.draw("rs-edb92e", "M605.1 212.5L599.2 211.9L601.7 217.9L614.9 219.1L616 213.6L607.3 212Z");
  bag.draw("rs-edb92e", "M593.3 237.4L586 240.4L595.6 218.5L598.8 228.3L593.4 235.1Z");
  bag.draw("rs-edb92e", "M595.5 218.5L587.3 241L583.9 242L585.8 228.2L594.9 219.4Z");
  bag.draw("rs-edb92e", "M604.3 227.1L596.2 227L593.2 236.3L597.7 239.6L604.7 228.2Z");
  bag.draw("rs-edb92e", "M601.5 227.7L595.5 231.3L597.2 237.9L603.8 229.6Z");
  bag.draw("rs-edb92e", "M489.8 198L498.4 188.3L494.4 158.5L498.9 133.4L502.7 190.3L490.1 198.5Z");
  bag.draw("rs-edb92e", "M505.8 214.6L501.7 205.8L488.9 214.9L488.9 224L497.1 231.4L502.9 232.1L507.2 215.6Z");
  bag.draw("rs-edb92e", "M503.1 207.3L499 210.6L499 228.3L503.1 231.6L508.5 220.8L503.2 208.4Z");
  bag.draw("rs-edb92e", "M553.5 200L544 204.2L549.6 218.8L557.5 219.9L566 212.3L568.3 206.1L554.9 198.6Z");
  bag.draw("rs-edb92e", "M545.9 202L548.5 207.5L557 205.1L563.8 209.9L567.9 205.8L560 197.9L547 202.1Z");
  bag.draw("rs-edb92e", "M572.5 221.2L572.6 213.2L559.9 220.5L556.7 228.9L560.6 235.7L565.1 237L573.1 222.2Z");
  bag.draw("rs-edb92e", "M572.9 213.8L562.9 234.8L564.4 238L572.8 227.4L572.8 214.8Z");
  bag.draw("rs-edb92e", "M530.2 226.2L532.6 234.8L545.3 227.6L547.2 218.9L541.2 210.3L535.9 208.7L529.2 225Z");
  bag.draw("rs-edb92e", "M531.6 233.3L539 213.4L535.7 209.3L528.8 219.8L531.7 232.3Z");
  bag.draw("rs-edb92e", "M555.4 279.1L533.4 266.2L510 276.3L532 289.1Z");
  bag.draw("rs-edb92e", "M581.9 269.9L558.1 279.3L577.8 292.1L583.6 281.6L581.9 269.8Z");
  bag.draw("rs-21231e", "M488.8 221.1L498.4 225.4L488.7 220.2Z");
  bag.draw("rs-21231e", "M488.8 217.7L498.4 213.4L488.7 218.6Z");
  bag.draw("rs-21231e", "M601.8 225.8L603.1 219.5L602.5 226.1Z");
  bag.draw("rs-21231e", "M555 219.4L561.3 209.8L554.2 219.4Z");
  bag.draw("rs-21231e", "M552.1 219L550.5 208.1L552.8 219.2Z");
  bag.draw("rs-21231e", "M557.5 227L563.5 231.9L557.7 226.1Z");
  bag.draw("rs-21231e", "M558.7 223.6L567.9 219.7L558.3 224.5Z");
  bag.draw("rs-21231e", "M546.4 221.7L538.6 216.3L546.3 222.6Z");
  bag.draw("rs-21231e", "M545.7 224.9L536.5 228.1L546 224.1Z");
  bag.draw("rs-red", "M542.6 278.2L534.1 284.5L522.8 278.2L531.2 270.5L542.5 276.8Z");
  bag.draw("rs-edb92e", "M553.7 216.5L545.8 222.1L549.2 231.4L558.8 226.9L556 217Z");
  bag.draw("rs-edb92e", "M553.4 218.6L548 222L549.7 229.4L557 226.6L555.4 219.1Z");
  bag.draw("rs-blue", "M600.9 229.3L598 235.8L602.4 230.3Z");
  bag.draw("rs-blue", "M581.1 274L570.7 278.3L577.1 287.1L585.7 283.9L583.2 274.6Z");
  bag.draw("rs-blue", "M553.1 220.7L550.5 227.3L554.7 221.3Z");
  bag.draw("rs-edb92e", "M382.4 159L354.8 172L351.8 184L362.7 201L361.7 215L352.8 215L338 175L356.8 159L400.2 144Z");
  bag.draw("rs-edb92e", "M360.8 213.6L350.3 175L368.4 161.3L396.7 153.3L354.3 176.9L364.7 199.5L362.4 213.7Z");
  bag.draw("rs-edb92e", "M444.2 202.2L444.8 210.8L442.5 203.2Z");
  bag.draw("rs-edb92e", "M379.7 210.8L382.3 219.1L378.3 212.3Z");
  bag.draw("white", "M389.2 145L389.4 146.3L389.8 147.6L390.5 148.7L391.5 149.6L392.6 150.3L393.8 150.8L395.1 150.9L396.5 150.8L397.7 150.3L398.8 149.6L399.8 148.7L400.5 147.6L400.9 146.3L401 145L400.9 143.7L400.5 142.4L399.8 141.3L398.8 140.4L397.7 139.7L396.5 139.2L395.1 139.1L393.8 139.2L392.6 139.7L391.5 140.4L390.5 141.3L389.8 142.4L389.4 143.7Z");
  bag.cut("rs-21231e", "M388.2 145L388.4 146.5L388.9 148L389.7 149.3L390.8 150.4L392.1 151.2L393.6 151.7L395.1 151.9L396.7 151.7L398.1 151.2L399.4 150.4L400.5 149.3L401.4 148L401.9 146.5L402 145L401.9 143.5L401.4 142L400.5 140.7L399.4 139.6L398.1 138.8L396.7 138.3L395.1 138.1L393.6 138.3L392.1 138.8L390.8 139.6L389.7 140.7L388.9 142L388.4 143.5ZM389.4 143.7L389.8 142.4L390.5 141.3L391.5 140.4L392.6 139.7L393.8 139.2L395.1 139.1L396.5 139.2L397.7 139.7L398.8 140.4L399.8 141.3L400.5 142.4L400.9 143.7L401 145L400.9 146.3L400.5 147.6L399.8 148.7L398.8 149.6L397.7 150.3L396.5 150.8L395.1 150.9L393.8 150.8L392.6 150.3L391.5 149.6L390.5 148.7L389.8 147.6L389.4 146.3L389.2 145Z");
  bag.draw("white", "M377.2 149L377.4 150.3L377.8 151.6L378.5 152.7L379.5 153.6L380.6 154.3L381.8 154.8L383.1 154.9L384.5 154.8L385.7 154.3L386.8 153.6L387.8 152.7L388.5 151.6L388.9 150.3L389 149L388.9 147.7L388.5 146.4L387.8 145.3L386.8 144.4L385.7 143.7L384.5 143.2L383.1 143.1L381.8 143.2L380.6 143.7L379.5 144.4L378.5 145.3L377.8 146.4L377.4 147.7Z");
  bag.cut("rs-21231e", "M376.2 149L376.4 150.5L376.9 152L377.7 153.3L378.8 154.4L380.1 155.2L381.6 155.7L383.1 155.9L384.7 155.7L386.1 155.2L387.4 154.4L388.5 153.3L389.4 152L389.9 150.5L390 149L389.9 147.5L389.4 146L388.5 144.7L387.4 143.6L386.1 142.8L384.7 142.3L383.1 142.1L381.6 142.3L380.1 142.8L378.8 143.6L377.7 144.7L376.9 146L376.4 147.5ZM377.4 147.7L377.8 146.4L378.5 145.3L379.5 144.4L380.6 143.7L381.8 143.2L383.1 143.1L384.5 143.2L385.7 143.7L386.8 144.4L387.8 145.3L388.5 146.4L388.9 147.7L389 149L388.9 150.3L388.5 151.6L387.8 152.7L386.8 153.6L385.7 154.3L384.5 154.8L383.1 154.9L381.8 154.8L380.6 154.3L379.5 153.6L378.5 152.7L377.8 151.6L377.4 150.3L377.2 149Z");
  bag.draw("white", "M365.2 153L365.4 154.3L365.8 155.6L366.5 156.7L367.5 157.6L368.6 158.3L369.8 158.8L371.1 158.9L372.5 158.8L373.7 158.3L374.8 157.6L375.8 156.7L376.5 155.6L376.9 154.3L377 153L376.9 151.7L376.5 150.4L375.8 149.3L374.8 148.4L373.7 147.7L372.5 147.2L371.1 147.1L369.8 147.2L368.6 147.7L367.5 148.4L366.5 149.3L365.8 150.4L365.4 151.7Z");
  bag.cut("rs-21231e", "M364.2 153L364.4 154.5L364.9 156L365.7 157.3L366.8 158.4L368.1 159.2L369.6 159.7L371.1 159.9L372.7 159.7L374.1 159.2L375.4 158.4L376.5 157.3L377.4 156L377.9 154.5L378 153L377.9 151.5L377.4 150L376.5 148.7L375.4 147.6L374.1 146.8L372.7 146.3L371.1 146.1L369.6 146.3L368.1 146.8L366.8 147.6L365.7 148.7L364.9 150L364.4 151.5ZM365.4 151.7L365.8 150.4L366.5 149.3L367.5 148.4L368.6 147.7L369.8 147.2L371.1 147.1L372.5 147.2L373.7 147.7L374.8 148.4L375.8 149.3L376.5 150.4L376.9 151.7L377 153L376.9 154.3L376.5 155.6L375.8 156.7L374.8 157.6L373.7 158.3L372.5 158.8L371.1 158.9L369.8 158.8L368.6 158.3L367.5 157.6L366.5 156.7L365.8 155.6L365.4 154.3L365.2 153Z");
  bag.draw("white", "M353.2 158.5L353.4 159.8L353.8 161.1L354.5 162.2L355.5 163.1L356.6 163.8L357.8 164.3L359.1 164.4L360.5 164.3L361.7 163.8L362.8 163.1L363.8 162.2L364.5 161.1L364.9 159.8L365 158.5L364.9 157.2L364.5 155.9L363.8 154.8L362.8 153.9L361.7 153.2L360.5 152.7L359.1 152.6L357.8 152.7L356.6 153.2L355.5 153.9L354.5 154.8L353.8 155.9L353.4 157.2Z");
  bag.cut("rs-21231e", "M352.2 158.5L352.4 160L352.9 161.5L353.7 162.8L354.8 163.9L356.1 164.7L357.6 165.2L359.1 165.4L360.7 165.2L362.1 164.7L363.4 163.9L364.5 162.8L365.4 161.5L365.9 160L366 158.5L365.9 157L365.4 155.5L364.5 154.2L363.4 153.1L362.1 152.3L360.7 151.8L359.1 151.6L357.6 151.8L356.1 152.3L354.8 153.1L353.7 154.2L352.9 155.5L352.4 157ZM353.4 157.2L353.8 155.9L354.5 154.8L355.5 153.9L356.6 153.2L357.8 152.7L359.1 152.6L360.5 152.7L361.7 153.2L362.8 153.9L363.8 154.8L364.5 155.9L364.9 157.2L365 158.5L364.9 159.8L364.5 161.1L363.8 162.2L362.8 163.1L361.7 163.8L360.5 164.3L359.1 164.4L357.8 164.3L356.6 163.8L355.5 163.1L354.5 162.2L353.8 161.1L353.4 159.8L353.2 158.5Z");
  bag.draw("white", "M342.2 165L342.4 166.3L342.8 167.6L343.5 168.7L344.5 169.6L345.6 170.3L346.8 170.8L348.1 170.9L349.5 170.8L350.7 170.3L351.8 169.6L352.8 168.7L353.5 167.6L353.9 166.3L354 165L353.9 163.7L353.5 162.4L352.8 161.3L351.8 160.4L350.7 159.7L349.5 159.2L348.1 159.1L346.8 159.2L345.6 159.7L344.5 160.4L343.5 161.3L342.8 162.4L342.4 163.7Z");
  bag.cut("rs-21231e", "M341.2 165L341.4 166.5L341.9 168L342.7 169.3L343.8 170.4L345.1 171.2L346.6 171.7L348.1 171.9L349.7 171.7L351.1 171.2L352.4 170.4L353.5 169.3L354.4 168L354.9 166.5L355 165L354.9 163.5L354.4 162L353.5 160.7L352.4 159.6L351.1 158.8L349.7 158.3L348.1 158.1L346.6 158.3L345.1 158.8L343.8 159.6L342.7 160.7L341.9 162L341.4 163.5ZM342.4 163.7L342.8 162.4L343.5 161.3L344.5 160.4L345.6 159.7L346.8 159.2L348.1 159.1L349.5 159.2L350.7 159.7L351.8 160.4L352.8 161.3L353.5 162.4L353.9 163.7L354 165L353.9 166.3L353.5 167.6L352.8 168.7L351.8 169.6L350.7 170.3L349.5 170.8L348.1 170.9L346.8 170.8L345.6 170.3L344.5 169.6L343.5 168.7L342.8 167.6L342.4 166.3L342.2 165Z");
  bag.draw("white", "M347.2 210L347.4 211.3L347.8 212.6L348.5 213.7L349.5 214.6L350.6 215.3L351.8 215.8L353.1 215.9L354.5 215.8L355.7 215.3L356.8 214.6L357.8 213.7L358.5 212.6L358.9 211.3L359 210L358.9 208.7L358.5 207.4L357.8 206.3L356.8 205.4L355.7 204.7L354.5 204.2L353.1 204.1L351.8 204.2L350.6 204.7L349.5 205.4L348.5 206.3L347.8 207.4L347.4 208.7Z");
  bag.cut("rs-21231e", "M346.2 210L346.4 211.5L346.9 213L347.7 214.3L348.8 215.4L350.1 216.2L351.6 216.7L353.1 216.9L354.7 216.7L356.1 216.2L357.4 215.4L358.5 214.3L359.4 213L359.9 211.5L360 210L359.9 208.5L359.4 207L358.5 205.7L357.4 204.6L356.1 203.8L354.7 203.3L353.1 203.1L351.6 203.3L350.1 203.8L348.8 204.6L347.7 205.7L346.9 207L346.4 208.5ZM347.4 208.7L347.8 207.4L348.5 206.3L349.5 205.4L350.6 204.7L351.8 204.2L353.1 204.1L354.5 204.2L355.7 204.7L356.8 205.4L357.8 206.3L358.5 207.4L358.9 208.7L359 210L358.9 211.3L358.5 212.6L357.8 213.7L356.8 214.6L355.7 215.3L354.5 215.8L353.1 215.9L351.8 215.8L350.6 215.3L349.5 214.6L348.5 213.7L347.8 212.6L347.4 211.3L347.2 210Z");
  bag.draw("white", "M341.2 199L341.4 200.3L341.8 201.6L342.5 202.7L343.5 203.6L344.6 204.3L345.8 204.8L347.1 204.9L348.5 204.8L349.7 204.3L350.8 203.6L351.8 202.7L352.5 201.6L352.9 200.3L353 199L352.9 197.7L352.5 196.4L351.8 195.3L350.8 194.4L349.7 193.7L348.5 193.2L347.1 193.1L345.8 193.2L344.6 193.7L343.5 194.4L342.5 195.3L341.8 196.4L341.4 197.7Z");
  bag.cut("rs-21231e", "M340.2 199L340.4 200.5L340.9 202L341.7 203.3L342.8 204.4L344.1 205.2L345.6 205.7L347.1 205.9L348.7 205.7L350.1 205.2L351.4 204.4L352.5 203.3L353.4 202L353.9 200.5L354 199L353.9 197.5L353.4 196L352.5 194.7L351.4 193.6L350.1 192.8L348.7 192.3L347.1 192.1L345.6 192.3L344.1 192.8L342.8 193.6L341.7 194.7L340.9 196L340.4 197.5ZM341.4 197.7L341.8 196.4L342.5 195.3L343.5 194.4L344.6 193.7L345.8 193.2L347.1 193.1L348.5 193.2L349.7 193.7L350.8 194.4L351.8 195.3L352.5 196.4L352.9 197.7L353 199L352.9 200.3L352.5 201.6L351.8 202.7L350.8 203.6L349.7 204.3L348.5 204.8L347.1 204.9L345.8 204.8L344.6 204.3L343.5 203.6L342.5 202.7L341.8 201.6L341.4 200.3L341.2 199Z");
  bag.draw("white", "M336.2 188L336.4 189.3L336.8 190.6L337.5 191.7L338.5 192.6L339.6 193.3L340.8 193.8L342.1 193.9L343.5 193.8L344.7 193.3L345.8 192.6L346.8 191.7L347.5 190.6L347.9 189.3L348 188L347.9 186.7L347.5 185.4L346.8 184.3L345.8 183.4L344.7 182.7L343.5 182.2L342.1 182.1L340.8 182.2L339.6 182.7L338.5 183.4L337.5 184.3L336.8 185.4L336.4 186.7Z");
  bag.cut("rs-21231e", "M335.2 188L335.4 189.5L335.9 191L336.7 192.3L337.8 193.4L339.1 194.2L340.6 194.7L342.1 194.9L343.7 194.7L345.1 194.2L346.4 193.4L347.5 192.3L348.4 191L348.9 189.5L349 188L348.9 186.5L348.4 185L347.5 183.7L346.4 182.6L345.1 181.8L343.7 181.3L342.1 181.1L340.6 181.3L339.1 181.8L337.8 182.6L336.7 183.7L335.9 185L335.4 186.5ZM336.4 186.7L336.8 185.4L337.5 184.3L338.5 183.4L339.6 182.7L340.8 182.2L342.1 182.1L343.5 182.2L344.7 182.7L345.8 183.4L346.8 184.3L347.5 185.4L347.9 186.7L348 188L347.9 189.3L347.5 190.6L346.8 191.7L345.8 192.6L344.7 193.3L343.5 193.8L342.1 193.9L340.8 193.8L339.6 193.3L338.5 192.6L337.5 191.7L336.8 190.6L336.4 189.3L336.2 188Z");
  bag.draw("white", "M334.2 175L334.4 176.3L334.8 177.6L335.5 178.7L336.5 179.6L337.6 180.3L338.8 180.8L340.1 180.9L341.5 180.8L342.7 180.3L343.8 179.6L344.8 178.7L345.5 177.6L345.9 176.3L346 175L345.9 173.7L345.5 172.4L344.8 171.3L343.8 170.4L342.7 169.7L341.5 169.2L340.1 169.1L338.8 169.2L337.6 169.7L336.5 170.4L335.5 171.3L334.8 172.4L334.4 173.7Z");
  bag.cut("rs-21231e", "M333.2 175L333.4 176.5L333.9 178L334.7 179.3L335.8 180.4L337.1 181.2L338.6 181.7L340.1 181.9L341.7 181.7L343.1 181.2L344.4 180.4L345.5 179.3L346.4 178L346.9 176.5L347 175L346.9 173.5L346.4 172L345.5 170.7L344.4 169.6L343.1 168.8L341.7 168.3L340.1 168.1L338.6 168.3L337.1 168.8L335.8 169.6L334.7 170.7L333.9 172L333.4 173.5ZM334.4 173.7L334.8 172.4L335.5 171.3L336.5 170.4L337.6 169.7L338.8 169.2L340.1 169.1L341.5 169.2L342.7 169.7L343.8 170.4L344.8 171.3L345.5 172.4L345.9 173.7L346 175L345.9 176.3L345.5 177.6L344.8 178.7L343.8 179.6L342.7 180.3L341.5 180.8L340.1 180.9L338.8 180.8L337.6 180.3L336.5 179.6L335.5 178.7L334.8 177.6L334.4 176.3L334.2 175Z");
  bag.draw("white", "M455.4 284L455.5 284.6L455.7 285.2L456 285.7L456.5 286.1L457 286.4L457.5 286.6L458.1 286.7L458.7 286.6L459.3 286.4L459.8 286.1L460.3 285.7L460.6 285.2L460.8 284.6L460.8 284L460.8 283.4L460.6 282.8L460.3 282.3L459.8 281.9L459.3 281.6L458.7 281.4L458.1 281.3L457.5 281.4L457 281.6L456.5 281.9L456 282.3L455.7 282.8L455.5 283.4Z");
  bag.cut("rs-21231e", "M454.4 284L454.5 284.8L454.8 285.6L455.3 286.3L455.8 286.9L456.5 287.3L457.3 287.6L458.1 287.7L459 287.6L459.7 287.3L460.4 286.9L461 286.3L461.5 285.6L461.8 284.8L461.8 284L461.8 283.2L461.5 282.4L461 281.7L460.4 281.1L459.7 280.7L459 280.4L458.1 280.3L457.3 280.4L456.5 280.7L455.8 281.1L455.3 281.7L454.8 282.4L454.5 283.2ZM455.5 283.4L455.7 282.8L456 282.3L456.5 281.9L457 281.6L457.5 281.4L458.1 281.3L458.7 281.4L459.3 281.6L459.8 281.9L460.3 282.3L460.6 282.8L460.8 283.4L460.8 284L460.8 284.6L460.6 285.2L460.3 285.7L459.8 286.1L459.3 286.4L458.7 286.6L458.1 286.7L457.5 286.6L457 286.4L456.5 286.1L456 285.7L455.7 285.2L455.5 284.6L455.4 284Z");
  bag.draw("white", "M406.4 287L406.5 287.6L406.7 288.2L407 288.7L407.5 289.1L408 289.4L408.5 289.6L409.1 289.7L409.7 289.6L410.3 289.4L410.8 289.1L411.3 288.7L411.6 288.2L411.8 287.6L411.8 287L411.8 286.4L411.6 285.8L411.3 285.3L410.8 284.9L410.3 284.6L409.7 284.4L409.1 284.3L408.5 284.4L408 284.6L407.5 284.9L407 285.3L406.7 285.8L406.5 286.4Z");
  bag.cut("rs-21231e", "M405.4 287L405.5 287.8L405.8 288.6L406.3 289.3L406.8 289.9L407.5 290.3L408.3 290.6L409.1 290.7L410 290.6L410.7 290.3L411.4 289.9L412 289.3L412.5 288.6L412.8 287.8L412.8 287L412.8 286.2L412.5 285.4L412 284.7L411.4 284.1L410.7 283.7L410 283.4L409.1 283.3L408.3 283.4L407.5 283.7L406.8 284.1L406.3 284.7L405.8 285.4L405.5 286.2ZM406.5 286.4L406.7 285.8L407 285.3L407.5 284.9L408 284.6L408.5 284.4L409.1 284.3L409.7 284.4L410.3 284.6L410.8 284.9L411.3 285.3L411.6 285.8L411.8 286.4L411.8 287L411.8 287.6L411.6 288.2L411.3 288.7L410.8 289.1L410.3 289.4L409.7 289.6L409.1 289.7L408.5 289.6L408 289.4L407.5 289.1L407 288.7L406.7 288.2L406.5 287.6L406.4 287Z");
  bag.draw("white", "M404.4 272L404.5 272.6L404.7 273.2L405 273.7L405.5 274.1L406 274.4L406.5 274.6L407.1 274.7L407.7 274.6L408.3 274.4L408.8 274.1L409.3 273.7L409.6 273.2L409.8 272.6L409.8 272L409.8 271.4L409.6 270.8L409.3 270.3L408.8 269.9L408.3 269.6L407.7 269.4L407.1 269.3L406.5 269.4L406 269.6L405.5 269.9L405 270.3L404.7 270.8L404.5 271.4Z");
  bag.cut("rs-21231e", "M403.4 272L403.5 272.8L403.8 273.6L404.3 274.3L404.8 274.9L405.5 275.3L406.3 275.6L407.1 275.7L408 275.6L408.7 275.3L409.4 274.9L410 274.3L410.5 273.6L410.8 272.8L410.8 272L410.8 271.2L410.5 270.4L410 269.7L409.4 269.1L408.7 268.7L408 268.4L407.1 268.3L406.3 268.4L405.5 268.7L404.8 269.1L404.3 269.7L403.8 270.4L403.5 271.2ZM404.5 271.4L404.7 270.8L405 270.3L405.5 269.9L406 269.6L406.5 269.4L407.1 269.3L407.7 269.4L408.3 269.6L408.8 269.9L409.3 270.3L409.6 270.8L409.8 271.4L409.8 272L409.8 272.6L409.6 273.2L409.3 273.7L408.8 274.1L408.3 274.4L407.7 274.6L407.1 274.7L406.5 274.6L406 274.4L405.5 274.1L405 273.7L404.7 273.2L404.5 272.6L404.4 272Z");
  bag.draw("white", "M454.4 269L454.5 269.6L454.7 270.2L455 270.7L455.5 271.1L456 271.4L456.5 271.6L457.1 271.7L457.7 271.6L458.3 271.4L458.8 271.1L459.3 270.7L459.6 270.2L459.8 269.6L459.8 269L459.8 268.4L459.6 267.8L459.3 267.3L458.8 266.9L458.3 266.6L457.7 266.4L457.1 266.3L456.5 266.4L456 266.6L455.5 266.9L455 267.3L454.7 267.8L454.5 268.4Z");
  bag.cut("rs-21231e", "M453.4 269L453.5 269.8L453.8 270.6L454.3 271.3L454.8 271.9L455.5 272.3L456.3 272.6L457.1 272.7L458 272.6L458.7 272.3L459.4 271.9L460 271.3L460.5 270.6L460.8 269.8L460.8 269L460.8 268.2L460.5 267.4L460 266.7L459.4 266.1L458.7 265.7L458 265.4L457.1 265.3L456.3 265.4L455.5 265.7L454.8 266.1L454.3 266.7L453.8 267.4L453.5 268.2ZM454.5 268.4L454.7 267.8L455 267.3L455.5 266.9L456 266.6L456.5 266.4L457.1 266.3L457.7 266.4L458.3 266.6L458.8 266.9L459.3 267.3L459.6 267.8L459.8 268.4L459.8 269L459.8 269.6L459.6 270.2L459.3 270.7L458.8 271.1L458.3 271.4L457.7 271.6L457.1 271.7L456.5 271.6L456 271.4L455.5 271.1L455 270.7L454.7 270.2L454.5 269.6L454.4 269Z");
  bag.draw("white", "M442.3 223L440.5 208L448.5 207.1L449.5 221.1L444.2 225.1Z");
  bag.draw("white", "M389 229.5L382.7 231.4L377.4 217.4L385 214.5L389.2 227.9Z");
  bag.draw("rs-edb92e", "M466.1 140L431.1 141L409.1 148L403.1 162L419.1 193L412.1 213L391.1 195L381.1 158L408.1 135L465.1 131Z");
  bag.draw("rs-edb92e", "M464.3 137.8L431.7 139.2L405.4 149.5L402.3 162.8L416.7 191.9L414 203L418.9 202.9L421.6 192.4L407.3 167.3L408.7 152.4L425.5 143.9L464.5 138Z");
  bag.draw("rs-edb92e", "M394.3 144L383.4 163.2L393.1 194.7L403.1 206.5L390.1 197.3L379.4 163.5L381.4 153.9L391.9 145.2Z");
  bag.draw("white", "M454.2 130L454.4 131.3L454.8 132.6L455.5 133.7L456.5 134.6L457.6 135.3L458.8 135.8L460.1 135.9L461.5 135.8L462.7 135.3L463.8 134.6L464.8 133.7L465.5 132.6L465.9 131.3L466 130L465.9 128.7L465.5 127.4L464.8 126.3L463.8 125.4L462.7 124.7L461.5 124.2L460.1 124.1L458.8 124.2L457.6 124.7L456.5 125.4L455.5 126.3L454.8 127.4L454.4 128.7Z");
  bag.cut("rs-21231e", "M453.2 130L453.4 131.5L453.9 133L454.7 134.3L455.8 135.4L457.1 136.2L458.6 136.7L460.1 136.9L461.7 136.7L463.1 136.2L464.4 135.4L465.5 134.3L466.4 133L466.9 131.5L467 130L466.9 128.5L466.4 127L465.5 125.7L464.4 124.6L463.1 123.8L461.7 123.3L460.1 123.1L458.6 123.3L457.1 123.8L455.8 124.6L454.7 125.7L453.9 127L453.4 128.5ZM454.4 128.7L454.8 127.4L455.5 126.3L456.5 125.4L457.6 124.7L458.8 124.2L460.1 124.1L461.5 124.2L462.7 124.7L463.8 125.4L464.8 126.3L465.5 127.4L465.9 128.7L466 130L465.9 131.3L465.5 132.6L464.8 133.7L463.8 134.6L462.7 135.3L461.5 135.8L460.1 135.9L458.8 135.8L457.6 135.3L456.5 134.6L455.5 133.7L454.8 132.6L454.4 131.3L454.2 130Z");
  bag.draw("white", "M441.7 130L441.9 131.3L442.3 132.6L443 133.7L444 134.6L445.1 135.3L446.3 135.8L447.6 135.9L449 135.8L450.2 135.3L451.3 134.6L452.3 133.7L453 132.6L453.4 131.3L453.5 130L453.4 128.7L453 127.4L452.3 126.3L451.3 125.4L450.2 124.7L449 124.2L447.6 124.1L446.3 124.2L445.1 124.7L444 125.4L443 126.3L442.3 127.4L441.9 128.7Z");
  bag.cut("rs-21231e", "M440.7 130L440.9 131.5L441.4 133L442.2 134.3L443.3 135.4L444.6 136.2L446.1 136.7L447.6 136.9L449.2 136.7L450.6 136.2L451.9 135.4L453 134.3L453.9 133L454.4 131.5L454.5 130L454.4 128.5L453.9 127L453 125.7L451.9 124.6L450.6 123.8L449.2 123.3L447.6 123.1L446.1 123.3L444.6 123.8L443.3 124.6L442.2 125.7L441.4 127L440.9 128.5ZM441.9 128.7L442.3 127.4L443 126.3L444 125.4L445.1 124.7L446.3 124.2L447.6 124.1L449 124.2L450.2 124.7L451.3 125.4L452.3 126.3L453 127.4L453.4 128.7L453.5 130L453.4 131.3L453 132.6L452.3 133.7L451.3 134.6L450.2 135.3L449 135.8L447.6 135.9L446.3 135.8L445.1 135.3L444 134.6L443 133.7L442.3 132.6L441.9 131.3L441.7 130Z");
  bag.draw("white", "M429.2 131.5L429.4 132.8L429.8 134.1L430.5 135.2L431.5 136.1L432.6 136.8L433.8 137.3L435.1 137.4L436.5 137.3L437.7 136.8L438.8 136.1L439.8 135.2L440.5 134.1L440.9 132.8L441 131.5L440.9 130.2L440.5 128.9L439.8 127.8L438.8 126.9L437.7 126.2L436.5 125.7L435.1 125.6L433.8 125.7L432.6 126.2L431.5 126.9L430.5 127.8L429.8 128.9L429.4 130.2Z");
  bag.cut("rs-21231e", "M428.2 131.5L428.4 133L428.9 134.5L429.7 135.8L430.8 136.9L432.1 137.7L433.6 138.2L435.1 138.4L436.7 138.2L438.1 137.7L439.4 136.9L440.5 135.8L441.4 134.5L441.9 133L442 131.5L441.9 130L441.4 128.5L440.5 127.2L439.4 126.1L438.1 125.3L436.7 124.8L435.1 124.6L433.6 124.8L432.1 125.3L430.8 126.1L429.7 127.2L428.9 128.5L428.4 130ZM429.4 130.2L429.8 128.9L430.5 127.8L431.5 126.9L432.6 126.2L433.8 125.7L435.1 125.6L436.5 125.7L437.7 126.2L438.8 126.9L439.8 127.8L440.5 128.9L440.9 130.2L441 131.5L440.9 132.8L440.5 134.1L439.8 135.2L438.8 136.1L437.7 136.8L436.5 137.3L435.1 137.4L433.8 137.3L432.6 136.8L431.5 136.1L430.5 135.2L429.8 134.1L429.4 132.8L429.2 131.5Z");
  bag.draw("white", "M417.2 134L417.4 135.3L417.8 136.6L418.5 137.7L419.5 138.6L420.6 139.3L421.8 139.8L423.1 139.9L424.5 139.8L425.7 139.3L426.8 138.6L427.8 137.7L428.5 136.6L428.9 135.3L429 134L428.9 132.7L428.5 131.4L427.8 130.3L426.8 129.4L425.7 128.7L424.5 128.2L423.1 128.1L421.8 128.2L420.6 128.7L419.5 129.4L418.5 130.3L417.8 131.4L417.4 132.7Z");
  bag.cut("rs-21231e", "M416.2 134L416.4 135.5L416.9 137L417.7 138.3L418.8 139.4L420.1 140.2L421.6 140.7L423.1 140.9L424.7 140.7L426.1 140.2L427.4 139.4L428.5 138.3L429.4 137L429.9 135.5L430 134L429.9 132.5L429.4 131L428.5 129.7L427.4 128.6L426.1 127.8L424.7 127.3L423.1 127.1L421.6 127.3L420.1 127.8L418.8 128.6L417.7 129.7L416.9 131L416.4 132.5ZM417.4 132.7L417.8 131.4L418.5 130.3L419.5 129.4L420.6 128.7L421.8 128.2L423.1 128.1L424.5 128.2L425.7 128.7L426.8 129.4L427.8 130.3L428.5 131.4L428.9 132.7L429 134L428.9 135.3L428.5 136.6L427.8 137.7L426.8 138.6L425.7 139.3L424.5 139.8L423.1 139.9L421.8 139.8L420.6 139.3L419.5 138.6L418.5 137.7L417.8 136.6L417.4 135.3L417.2 134Z");
  bag.draw("white", "M405.2 138L405.4 139.3L405.8 140.6L406.5 141.7L407.5 142.6L408.6 143.3L409.8 143.8L411.1 143.9L412.5 143.8L413.7 143.3L414.8 142.6L415.8 141.7L416.5 140.6L416.9 139.3L417 138L416.9 136.7L416.5 135.4L415.8 134.3L414.8 133.4L413.7 132.7L412.5 132.2L411.1 132.1L409.8 132.2L408.6 132.7L407.5 133.4L406.5 134.3L405.8 135.4L405.4 136.7Z");
  bag.cut("rs-21231e", "M404.2 138L404.4 139.5L404.9 141L405.7 142.3L406.8 143.4L408.1 144.2L409.6 144.7L411.1 144.9L412.7 144.7L414.1 144.2L415.4 143.4L416.5 142.3L417.4 141L417.9 139.5L418 138L417.9 136.5L417.4 135L416.5 133.7L415.4 132.6L414.1 131.8L412.7 131.3L411.1 131.1L409.6 131.3L408.1 131.8L406.8 132.6L405.7 133.7L404.9 135L404.4 136.5ZM405.4 136.7L405.8 135.4L406.5 134.3L407.5 133.4L408.6 132.7L409.8 132.2L411.1 132.1L412.5 132.2L413.7 132.7L414.8 133.4L415.8 134.3L416.5 135.4L416.9 136.7L417 138L416.9 139.3L416.5 140.6L415.8 141.7L414.8 142.6L413.7 143.3L412.5 143.8L411.1 143.9L409.8 143.8L408.6 143.3L407.5 142.6L406.5 141.7L405.8 140.6L405.4 139.3L405.2 138Z");
  bag.draw("white", "M394.2 143L394.4 144.3L394.8 145.6L395.5 146.7L396.5 147.6L397.6 148.3L398.8 148.8L400.1 148.9L401.5 148.8L402.7 148.3L403.8 147.6L404.8 146.7L405.5 145.6L405.9 144.3L406 143L405.9 141.7L405.5 140.4L404.8 139.3L403.8 138.4L402.7 137.7L401.5 137.2L400.1 137.1L398.8 137.2L397.6 137.7L396.5 138.4L395.5 139.3L394.8 140.4L394.4 141.7Z");
  bag.cut("rs-21231e", "M393.2 143L393.4 144.5L393.9 146L394.7 147.3L395.8 148.4L397.1 149.2L398.6 149.7L400.1 149.9L401.7 149.7L403.1 149.2L404.4 148.4L405.5 147.3L406.4 146L406.9 144.5L407 143L406.9 141.5L406.4 140L405.5 138.7L404.4 137.6L403.1 136.8L401.7 136.3L400.1 136.1L398.6 136.3L397.1 136.8L395.8 137.6L394.7 138.7L393.9 140L393.4 141.5ZM394.4 141.7L394.8 140.4L395.5 139.3L396.5 138.4L397.6 137.7L398.8 137.2L400.1 137.1L401.5 137.2L402.7 137.7L403.8 138.4L404.8 139.3L405.5 140.4L405.9 141.7L406 143L405.9 144.3L405.5 145.6L404.8 146.7L403.8 147.6L402.7 148.3L401.5 148.8L400.1 148.9L398.8 148.8L397.6 148.3L396.5 147.6L395.5 146.7L394.8 145.6L394.4 144.3L394.2 143Z");
  bag.draw("white", "M387.2 151L387.4 152.3L387.8 153.6L388.5 154.7L389.5 155.6L390.6 156.3L391.8 156.8L393.1 156.9L394.5 156.8L395.7 156.3L396.8 155.6L397.8 154.7L398.5 153.6L398.9 152.3L399 151L398.9 149.7L398.5 148.4L397.8 147.3L396.8 146.4L395.7 145.7L394.5 145.2L393.1 145.1L391.8 145.2L390.6 145.7L389.5 146.4L388.5 147.3L387.8 148.4L387.4 149.7Z");
  bag.cut("rs-21231e", "M386.2 151L386.4 152.5L386.9 154L387.7 155.3L388.8 156.4L390.1 157.2L391.6 157.7L393.1 157.9L394.7 157.7L396.1 157.2L397.4 156.4L398.5 155.3L399.4 154L399.9 152.5L400 151L399.9 149.5L399.4 148L398.5 146.7L397.4 145.6L396.1 144.8L394.7 144.3L393.1 144.1L391.6 144.3L390.1 144.8L388.8 145.6L387.7 146.7L386.9 148L386.4 149.5ZM387.4 149.7L387.8 148.4L388.5 147.3L389.5 146.4L390.6 145.7L391.8 145.2L393.1 145.1L394.5 145.2L395.7 145.7L396.8 146.4L397.8 147.3L398.5 148.4L398.9 149.7L399 151L398.9 152.3L398.5 153.6L397.8 154.7L396.8 155.6L395.7 156.3L394.5 156.8L393.1 156.9L391.8 156.8L390.6 156.3L389.5 155.6L388.5 154.7L387.8 153.6L387.4 152.3L387.2 151Z");
  bag.draw("white", "M400.2 197L400.4 198.3L400.8 199.6L401.5 200.7L402.5 201.6L403.6 202.3L404.8 202.8L406.1 202.9L407.5 202.8L408.7 202.3L409.8 201.6L410.8 200.7L411.5 199.6L411.9 198.3L412 197L411.9 195.7L411.5 194.4L410.8 193.3L409.8 192.4L408.7 191.7L407.5 191.2L406.1 191.1L404.8 191.2L403.6 191.7L402.5 192.4L401.5 193.3L400.8 194.4L400.4 195.7Z");
  bag.cut("rs-21231e", "M399.2 197L399.4 198.5L399.9 200L400.7 201.3L401.8 202.4L403.1 203.2L404.6 203.7L406.1 203.9L407.7 203.7L409.1 203.2L410.4 202.4L411.5 201.3L412.4 200L412.9 198.5L413 197L412.9 195.5L412.4 194L411.5 192.7L410.4 191.6L409.1 190.8L407.7 190.3L406.1 190.1L404.6 190.3L403.1 190.8L401.8 191.6L400.7 192.7L399.9 194L399.4 195.5ZM400.4 195.7L400.8 194.4L401.5 193.3L402.5 192.4L403.6 191.7L404.8 191.2L406.1 191.1L407.5 191.2L408.7 191.7L409.8 192.4L410.8 193.3L411.5 194.4L411.9 195.7L412 197L411.9 198.3L411.5 199.6L410.8 200.7L409.8 201.6L408.7 202.3L407.5 202.8L406.1 202.9L404.8 202.8L403.6 202.3L402.5 201.6L401.5 200.7L400.8 199.6L400.4 198.3L400.2 197Z");
  bag.draw("white", "M395.2 186L395.4 187.3L395.8 188.6L396.5 189.7L397.5 190.6L398.6 191.3L399.8 191.8L401.1 191.9L402.5 191.8L403.7 191.3L404.8 190.6L405.8 189.7L406.5 188.6L406.9 187.3L407 186L406.9 184.7L406.5 183.4L405.8 182.3L404.8 181.4L403.7 180.7L402.5 180.2L401.1 180.1L399.8 180.2L398.6 180.7L397.5 181.4L396.5 182.3L395.8 183.4L395.4 184.7Z");
  bag.cut("rs-21231e", "M394.2 186L394.4 187.5L394.9 189L395.7 190.3L396.8 191.4L398.1 192.2L399.6 192.7L401.1 192.9L402.7 192.7L404.1 192.2L405.4 191.4L406.5 190.3L407.4 189L407.9 187.5L408 186L407.9 184.5L407.4 183L406.5 181.7L405.4 180.6L404.1 179.8L402.7 179.3L401.1 179.1L399.6 179.3L398.1 179.8L396.8 180.6L395.7 181.7L394.9 183L394.4 184.5ZM395.4 184.7L395.8 183.4L396.5 182.3L397.5 181.4L398.6 180.7L399.8 180.2L401.1 180.1L402.5 180.2L403.7 180.7L404.8 181.4L405.8 182.3L406.5 183.4L406.9 184.7L407 186L406.9 187.3L406.5 188.6L405.8 189.7L404.8 190.6L403.7 191.3L402.5 191.8L401.1 191.9L399.8 191.8L398.6 191.3L397.5 190.6L396.5 189.7L395.8 188.6L395.4 187.3L395.2 186Z");
  bag.draw("white", "M390.2 175L390.4 176.3L390.8 177.6L391.5 178.7L392.5 179.6L393.6 180.3L394.8 180.8L396.1 180.9L397.5 180.8L398.7 180.3L399.8 179.6L400.8 178.7L401.5 177.6L401.9 176.3L402 175L401.9 173.7L401.5 172.4L400.8 171.3L399.8 170.4L398.7 169.7L397.5 169.2L396.1 169.1L394.8 169.2L393.6 169.7L392.5 170.4L391.5 171.3L390.8 172.4L390.4 173.7Z");
  bag.cut("rs-21231e", "M389.2 175L389.4 176.5L389.9 178L390.7 179.3L391.8 180.4L393.1 181.2L394.6 181.7L396.1 181.9L397.7 181.7L399.1 181.2L400.4 180.4L401.5 179.3L402.4 178L402.9 176.5L403 175L402.9 173.5L402.4 172L401.5 170.7L400.4 169.6L399.1 168.8L397.7 168.3L396.1 168.1L394.6 168.3L393.1 168.8L391.8 169.6L390.7 170.7L389.9 172L389.4 173.5ZM390.4 173.7L390.8 172.4L391.5 171.3L392.5 170.4L393.6 169.7L394.8 169.2L396.1 169.1L397.5 169.2L398.7 169.7L399.8 170.4L400.8 171.3L401.5 172.4L401.9 173.7L402 175L401.9 176.3L401.5 177.6L400.8 178.7L399.8 179.6L398.7 180.3L397.5 180.8L396.1 180.9L394.8 180.8L393.6 180.3L392.5 179.6L391.5 178.7L390.8 177.6L390.4 176.3L390.2 175Z");
  bag.draw("white", "M386.2 163L386.4 164.3L386.8 165.6L387.5 166.7L388.5 167.6L389.6 168.3L390.8 168.8L392.1 168.9L393.5 168.8L394.7 168.3L395.8 167.6L396.8 166.7L397.5 165.6L397.9 164.3L398 163L397.9 161.7L397.5 160.4L396.8 159.3L395.8 158.4L394.7 157.7L393.5 157.2L392.1 157.1L390.8 157.2L389.6 157.7L388.5 158.4L387.5 159.3L386.8 160.4L386.4 161.7Z");
  bag.cut("rs-21231e", "M385.2 163L385.4 164.5L385.9 166L386.7 167.3L387.8 168.4L389.1 169.2L390.6 169.7L392.1 169.9L393.7 169.7L395.1 169.2L396.4 168.4L397.5 167.3L398.4 166L398.9 164.5L399 163L398.9 161.5L398.4 160L397.5 158.7L396.4 157.6L395.1 156.8L393.7 156.3L392.1 156.1L390.6 156.3L389.1 156.8L387.8 157.6L386.7 158.7L385.9 160L385.4 161.5ZM386.4 161.7L386.8 160.4L387.5 159.3L388.5 158.4L389.6 157.7L390.8 157.2L392.1 157.1L393.5 157.2L394.7 157.7L395.8 158.4L396.8 159.3L397.5 160.4L397.9 161.7L398 163L397.9 164.3L397.5 165.6L396.8 166.7L395.8 167.6L394.7 168.3L393.5 168.8L392.1 168.9L390.8 168.8L389.6 168.3L388.5 167.6L387.5 166.7L386.8 165.6L386.4 164.3L386.2 163Z");
  bag.draw("rs-edb92e", "M358.1 217L350.6 219.5L357 216.4Z");
  bag.draw("rs-edb92e", "M357.1 212.3L366.4 212.9L361.6 230.4L353.6 213.4Z");
  bag.draw("rs-edb92e", "M359.1 212.5L365.1 211.9L362.5 217.9L349.4 219.1L348.3 213.6L357 212Z");
  bag.draw("rs-edb92e", "M370.9 237.4L378.3 240.4L368.7 218.5L365.5 228.3L370.9 235.1Z");
  bag.draw("rs-edb92e", "M368.7 218.5L377 241L380.4 242L378.5 228.2L369.4 219.4Z");
  bag.draw("rs-edb92e", "M359.9 227.1L368.1 227L371.1 236.3L366.6 239.6L359.6 228.2Z");
  bag.draw("rs-edb92e", "M362.7 227.7L368.8 231.3L367.1 237.9L360.5 229.6Z");
  bag.draw("rs-edb92e", "M474.4 198L465.8 188.3L469.9 158.5L465.4 133.4L461.6 190.3L474.2 198.5Z");
  bag.draw("rs-edb92e", "M458.4 214.6L462.6 205.8L475.4 214.9L475.4 224L467.2 231.4L461.3 232.1L457.1 215.6Z");
  bag.draw("rs-edb92e", "M461.1 207.3L465.3 210.6L465.3 228.3L461.1 231.6L455.8 220.8L461.1 208.4Z");
  bag.draw("rs-edb92e", "M410.7 200L420.3 204.2L414.7 218.8L406.8 219.9L398.3 212.3L396 206.1L409.4 198.6Z");
  bag.draw("rs-edb92e", "M418.3 202L415.7 207.5L407.3 205.1L400.5 209.9L396.4 205.8L404.3 197.9L417.3 202.1Z");
  bag.draw("rs-edb92e", "M391.7 221.2L391.7 213.2L404.4 220.5L407.6 228.9L403.7 235.7L399.2 237L391.2 222.2Z");
  bag.draw("rs-edb92e", "M391.3 213.8L401.4 234.8L399.9 238L391.4 227.4L391.5 214.8Z");
  bag.draw("rs-edb92e", "M434 226.2L431.7 234.8L418.9 227.6L417.1 218.9L423.1 210.3L428.4 208.7L435.1 225Z");
  bag.draw("rs-edb92e", "M432.6 233.3L425.3 213.4L428.6 209.3L435.5 219.8L432.5 232.3Z");
  bag.draw("rs-edb92e", "M408.8 279.1L430.8 266.2L454.2 276.3L432.2 289.1Z");
  bag.draw("rs-edb92e", "M382.3 269.9L406.1 279.3L386.5 292.1L380.6 281.6L382.3 269.8Z");
  bag.draw("rs-21231e", "M475.4 221.1L465.8 225.4L475.5 220.2Z");
  bag.draw("rs-21231e", "M475.4 217.7L465.8 213.4L475.5 218.6Z");
  bag.draw("rs-21231e", "M362.4 225.8L361.1 219.5L361.7 226.1Z");
  bag.draw("rs-21231e", "M409.2 219.4L402.9 209.8L410 219.4Z");
  bag.draw("rs-21231e", "M412.1 219L413.7 208.1L411.4 219.2Z");
  bag.draw("rs-21231e", "M406.7 227L400.7 231.9L406.5 226.1Z");
  bag.draw("rs-21231e", "M405.5 223.6L396.3 219.7L405.9 224.5Z");
  bag.draw("rs-21231e", "M417.8 221.7L425.6 216.3L417.9 222.6Z");
  bag.draw("rs-21231e", "M418.5 224.9L427.7 228.1L418.2 224.1Z");
  bag.draw("rs-red", "M421.7 278.2L430.2 284.5L441.5 278.2L433.1 270.5L421.8 276.8Z");
  bag.draw("rs-edb92e", "M410.5 216.5L418.5 222.1L415.1 231.4L405.5 226.9L408.3 217Z");
  bag.draw("rs-edb92e", "M410.8 218.6L416.3 222L414.6 229.4L407.3 226.6L408.9 219.1Z");
  bag.draw("rs-blue", "M363.3 229.3L366.3 235.8L361.9 230.3Z");
  bag.draw("rs-blue", "M383.1 274L393.6 278.3L387.2 287.1L378.6 283.9L381.1 274.6Z");
  bag.draw("rs-blue", "M411.1 220.7L413.8 227.3L409.5 221.3Z");
  bag.draw("white", "M488 189L487.9 190.3L487.5 191.6L486.8 192.7L485.8 193.6L484.7 194.3L483.5 194.8L482.1 194.9L480.8 194.8L479.6 194.3L478.5 193.6L477.5 192.7L476.8 191.6L476.4 190.3L476.2 189L476.4 187.7L476.8 186.4L477.5 185.3L478.5 184.4L479.6 183.7L480.8 183.2L482.1 183.1L483.5 183.2L484.7 183.7L485.8 184.4L486.8 185.3L487.5 186.4L487.9 187.7Z");
  bag.cut("rs-21231e", "M489 189L488.9 190.5L488.4 192L487.5 193.3L486.4 194.4L485.1 195.2L483.7 195.7L482.1 195.9L480.6 195.7L479.1 195.2L477.8 194.4L476.7 193.3L475.9 192L475.4 190.5L475.2 189L475.4 187.5L475.9 186L476.7 184.7L477.8 183.6L479.1 182.8L480.6 182.3L482.1 182.1L483.7 182.3L485.1 182.8L486.4 183.6L487.5 184.7L488.4 186L488.9 187.5ZM487.9 187.7L487.5 186.4L486.8 185.3L485.8 184.4L484.7 183.7L483.5 183.2L482.1 183.1L480.8 183.2L479.6 183.7L478.5 184.4L477.5 185.3L476.8 186.4L476.4 187.7L476.2 189L476.4 190.3L476.8 191.6L477.5 192.7L478.5 193.6L479.6 194.3L480.8 194.8L482.1 194.9L483.5 194.8L484.7 194.3L485.8 193.6L486.8 192.7L487.5 191.6L487.9 190.3L488 189Z");
  bag.draw("white", "M488 177L487.9 178.3L487.5 179.6L486.8 180.7L485.8 181.6L484.7 182.3L483.5 182.8L482.1 182.9L480.8 182.8L479.6 182.3L478.5 181.6L477.5 180.7L476.8 179.6L476.4 178.3L476.2 177L476.4 175.7L476.8 174.4L477.5 173.3L478.5 172.4L479.6 171.7L480.8 171.2L482.1 171.1L483.5 171.2L484.7 171.7L485.8 172.4L486.8 173.3L487.5 174.4L487.9 175.7Z");
  bag.cut("rs-21231e", "M489 177L488.9 178.5L488.4 180L487.5 181.3L486.4 182.4L485.1 183.2L483.7 183.7L482.1 183.9L480.6 183.7L479.1 183.2L477.8 182.4L476.7 181.3L475.9 180L475.4 178.5L475.2 177L475.4 175.5L475.9 174L476.7 172.7L477.8 171.6L479.1 170.8L480.6 170.3L482.1 170.1L483.7 170.3L485.1 170.8L486.4 171.6L487.5 172.7L488.4 174L488.9 175.5ZM487.9 175.7L487.5 174.4L486.8 173.3L485.8 172.4L484.7 171.7L483.5 171.2L482.1 171.1L480.8 171.2L479.6 171.7L478.5 172.4L477.5 173.3L476.8 174.4L476.4 175.7L476.2 177L476.4 178.3L476.8 179.6L477.5 180.7L478.5 181.6L479.6 182.3L480.8 182.8L482.1 182.9L483.5 182.8L484.7 182.3L485.8 181.6L486.8 180.7L487.5 179.6L487.9 178.3L488 177Z");
  bag.draw("white", "M488 165.5L487.9 166.8L487.5 168.1L486.8 169.2L485.8 170.1L484.7 170.8L483.5 171.3L482.1 171.4L480.8 171.3L479.6 170.8L478.5 170.1L477.5 169.2L476.8 168.1L476.4 166.8L476.2 165.5L476.4 164.2L476.8 162.9L477.5 161.8L478.5 160.9L479.6 160.2L480.8 159.7L482.1 159.6L483.5 159.7L484.7 160.2L485.8 160.9L486.8 161.8L487.5 162.9L487.9 164.2Z");
  bag.cut("rs-21231e", "M489 165.5L488.9 167L488.4 168.5L487.5 169.8L486.4 170.9L485.1 171.7L483.7 172.2L482.1 172.4L480.6 172.2L479.1 171.7L477.8 170.9L476.7 169.8L475.9 168.5L475.4 167L475.2 165.5L475.4 164L475.9 162.5L476.7 161.2L477.8 160.1L479.1 159.3L480.6 158.8L482.1 158.6L483.7 158.8L485.1 159.3L486.4 160.1L487.5 161.2L488.4 162.5L488.9 164ZM487.9 164.2L487.5 162.9L486.8 161.8L485.8 160.9L484.7 160.2L483.5 159.7L482.1 159.6L480.8 159.7L479.6 160.2L478.5 160.9L477.5 161.8L476.8 162.9L476.4 164.2L476.2 165.5L476.4 166.8L476.8 168.1L477.5 169.2L478.5 170.1L479.6 170.8L480.8 171.3L482.1 171.4L483.5 171.3L484.7 170.8L485.8 170.1L486.8 169.2L487.5 168.1L487.9 166.8L488 165.5Z");
  bag.draw("white", "M488 133L487.9 134.3L487.5 135.6L486.8 136.7L485.8 137.6L484.7 138.3L483.5 138.8L482.1 138.9L480.8 138.8L479.6 138.3L478.5 137.6L477.5 136.7L476.8 135.6L476.4 134.3L476.2 133L476.4 131.7L476.8 130.4L477.5 129.3L478.5 128.4L479.6 127.7L480.8 127.2L482.1 127.1L483.5 127.2L484.7 127.7L485.8 128.4L486.8 129.3L487.5 130.4L487.9 131.7Z");
  bag.cut("rs-21231e", "M489 133L488.9 134.5L488.4 136L487.5 137.3L486.4 138.4L485.1 139.2L483.7 139.7L482.1 139.9L480.6 139.7L479.1 139.2L477.8 138.4L476.7 137.3L475.9 136L475.4 134.5L475.2 133L475.4 131.5L475.9 130L476.7 128.7L477.8 127.6L479.1 126.8L480.6 126.3L482.1 126.1L483.7 126.3L485.1 126.8L486.4 127.6L487.5 128.7L488.4 130L488.9 131.5ZM487.9 131.7L487.5 130.4L486.8 129.3L485.8 128.4L484.7 127.7L483.5 127.2L482.1 127.1L480.8 127.2L479.6 127.7L478.5 128.4L477.5 129.3L476.8 130.4L476.4 131.7L476.2 133L476.4 134.3L476.8 135.6L477.5 136.7L478.5 137.6L479.6 138.3L480.8 138.8L482.1 138.9L483.5 138.8L484.7 138.3L485.8 137.6L486.8 136.7L487.5 135.6L487.9 134.3L488 133Z");
  bag.draw("white", "M488 143L487.9 144.3L487.5 145.6L486.8 146.7L485.8 147.6L484.7 148.3L483.5 148.8L482.1 148.9L480.8 148.8L479.6 148.3L478.5 147.6L477.5 146.7L476.8 145.6L476.4 144.3L476.2 143L476.4 141.7L476.8 140.4L477.5 139.3L478.5 138.4L479.6 137.7L480.8 137.2L482.1 137.1L483.5 137.2L484.7 137.7L485.8 138.4L486.8 139.3L487.5 140.4L487.9 141.7Z");
  bag.cut("rs-21231e", "M489 143L488.9 144.5L488.4 146L487.5 147.3L486.4 148.4L485.1 149.2L483.7 149.7L482.1 149.9L480.6 149.7L479.1 149.2L477.8 148.4L476.7 147.3L475.9 146L475.4 144.5L475.2 143L475.4 141.5L475.9 140L476.7 138.7L477.8 137.6L479.1 136.8L480.6 136.3L482.1 136.1L483.7 136.3L485.1 136.8L486.4 137.6L487.5 138.7L488.4 140L488.9 141.5ZM487.9 141.7L487.5 140.4L486.8 139.3L485.8 138.4L484.7 137.7L483.5 137.2L482.1 137.1L480.8 137.2L479.6 137.7L478.5 138.4L477.5 139.3L476.8 140.4L476.4 141.7L476.2 143L476.4 144.3L476.8 145.6L477.5 146.7L478.5 147.6L479.6 148.3L480.8 148.8L482.1 148.9L483.5 148.8L484.7 148.3L485.8 147.6L486.8 146.7L487.5 145.6L487.9 144.3L488 143Z");
  bag.draw("white", "M488 154L487.9 155.3L487.5 156.6L486.8 157.7L485.8 158.6L484.7 159.3L483.5 159.8L482.1 159.9L480.8 159.8L479.6 159.3L478.5 158.6L477.5 157.7L476.8 156.6L476.4 155.3L476.2 154L476.4 152.7L476.8 151.4L477.5 150.3L478.5 149.4L479.6 148.7L480.8 148.2L482.1 148.1L483.5 148.2L484.7 148.7L485.8 149.4L486.8 150.3L487.5 151.4L487.9 152.7Z");
  bag.cut("rs-21231e", "M489 154L488.9 155.5L488.4 157L487.5 158.3L486.4 159.4L485.1 160.2L483.7 160.7L482.1 160.9L480.6 160.7L479.1 160.2L477.8 159.4L476.7 158.3L475.9 157L475.4 155.5L475.2 154L475.4 152.5L475.9 151L476.7 149.7L477.8 148.6L479.1 147.8L480.6 147.3L482.1 147.1L483.7 147.3L485.1 147.8L486.4 148.6L487.5 149.7L488.4 151L488.9 152.5ZM487.9 152.7L487.5 151.4L486.8 150.3L485.8 149.4L484.7 148.7L483.5 148.2L482.1 148.1L480.8 148.2L479.6 148.7L478.5 149.4L477.5 150.3L476.8 151.4L476.4 152.7L476.2 154L476.4 155.3L476.8 156.6L477.5 157.7L478.5 158.6L479.6 159.3L480.8 159.8L482.1 159.9L483.5 159.8L484.7 159.3L485.8 158.6L486.8 157.7L487.5 156.6L487.9 155.3L488 154Z");
  bag.draw("rs-edb92e", "M482.1 193L495.4 201.7L486.6 212.6L477.6 212.6L468.5 199.7L480.8 192.9Z");
  bag.draw("rs-21231e", "M483.7 212.6L488.1 203L482.8 212.8Z");
  bag.draw("rs-21231e", "M480.5 212.6L476.1 203L481.4 212.8Z");
  bag.draw("rs-edb92e", "M482.1 193L494.2 198.3L492.2 201.8L473.3 202.5L470 198.3L480.8 192.9Z");
  bag.draw("rs-edb92e", "M482.1 211.7L489.6 217.4L484.2 227L474.7 221.5L480.1 211.9Z");
  bag.draw("rs-edb92e", "M580.1 296.5L492 289.6L384.7 295L389 299.6L464.3 303.3L579.6 298Z");
  bag.draw("rs-edb92e", "M489.3 219.4L489.2 221L488.6 222.5L487.8 223.9L486.6 225L485.3 225.9L483.7 226.4L482.1 226.6L480.5 226.4L479 225.9L477.7 225L476.5 223.9L475.7 222.5L475.1 221L474.9 219.4L475.1 217.8L475.7 216.3L476.5 214.9L477.7 213.8L479 212.9L480.5 212.4L482.1 212.2L483.7 212.4L485.3 212.9L486.6 213.8L487.8 214.9L488.6 216.3L489.2 217.8Z");
  bag.cut("rs-21231e", "M490.3 219.4L490.1 221.2L489.5 223L488.6 224.5L487.3 225.8L485.7 226.8L484 227.4L482.1 227.6L480.3 227.4L478.6 226.8L477 225.8L475.7 224.5L474.8 223L474.1 221.2L473.9 219.4L474.1 217.6L474.8 215.8L475.7 214.3L477 213L478.6 212L480.3 211.4L482.1 211.2L484 211.4L485.7 212L487.3 213L488.6 214.3L489.5 215.8L490.1 217.6ZM489.2 217.8L488.6 216.3L487.8 214.9L486.6 213.8L485.3 212.9L483.7 212.4L482.1 212.2L480.5 212.4L479 212.9L477.7 213.8L476.5 214.9L475.7 216.3L475.1 217.8L474.9 219.4L475.1 221L475.7 222.5L476.5 223.9L477.7 225L479 225.9L480.5 226.4L482.1 226.6L483.7 226.4L485.3 225.9L486.6 225L487.8 223.9L488.6 222.5L489.2 221L489.3 219.4Z");
  bag.draw("rs-edb92e", "M487.3 219.4L487.2 220.6L486.8 221.7L486.2 222.6L485.4 223.5L484.4 224.1L483.3 224.5L482.1 224.6L481 224.5L479.9 224.1L478.9 223.5L478.1 222.6L477.5 221.7L477.1 220.6L476.9 219.4L477.1 218.2L477.5 217.1L478.1 216.2L478.9 215.3L479.9 214.7L481 214.3L482.1 214.2L483.3 214.3L484.4 214.7L485.4 215.3L486.2 216.2L486.8 217.1L487.2 218.2Z");
  bag.cut("rs-21231e", "M488.3 219.4L488.2 220.8L487.7 222.1L487 223.3L486 224.2L484.8 225L483.5 225.4L482.1 225.6L480.8 225.4L479.5 225L478.3 224.2L477.3 223.3L476.6 222.1L476.1 220.8L475.9 219.4L476.1 218L476.6 216.7L477.3 215.5L478.3 214.6L479.5 213.8L480.8 213.4L482.1 213.2L483.5 213.4L484.8 213.8L486 214.6L487 215.5L487.7 216.7L488.2 218ZM487.2 218.2L486.8 217.1L486.2 216.2L485.4 215.3L484.4 214.7L483.3 214.3L482.1 214.2L481 214.3L479.9 214.7L478.9 215.3L478.1 216.2L477.5 217.1L477.1 218.2L476.9 219.4L477.1 220.6L477.5 221.7L478.1 222.6L478.9 223.5L479.9 224.1L481 224.5L482.1 224.6L483.3 224.5L484.4 224.1L485.4 223.5L486.2 222.6L486.8 221.7L487.2 220.6L487.3 219.4Z");
  bag.draw("rs-blue", "M492.1 276L484.1 282.9L472.3 277.4L480.2 269.1L492 274.6Z");
  bag.draw("rs-blue", "M485.3 219.4L485.3 220.1L485 220.8L484.6 221.4L484.1 221.9L483.5 222.3L482.9 222.5L482.1 222.6L481.4 222.5L480.8 222.3L480.1 221.9L479.6 221.4L479.3 220.8L479 220.1L478.9 219.4L479 218.7L479.3 218L479.6 217.4L480.1 216.9L480.8 216.5L481.4 216.3L482.1 216.2L482.9 216.3L483.5 216.5L484.1 216.9L484.6 217.4L485 218L485.3 218.7Z");
  bag.cut("rs-21231e", "M486.3 219.4L486.2 220.3L485.9 221.2L485.4 222L484.8 222.7L484 223.2L483.1 223.5L482.1 223.6L481.2 223.5L480.3 223.2L479.5 222.7L478.9 222L478.4 221.2L478 220.3L477.9 219.4L478 218.5L478.4 217.6L478.9 216.8L479.5 216.1L480.3 215.6L481.2 215.3L482.1 215.2L483.1 215.3L484 215.6L484.8 216.1L485.4 216.8L485.9 217.6L486.2 218.5ZM485.3 218.7L485 218L484.6 217.4L484.1 216.9L483.5 216.5L482.9 216.3L482.1 216.2L481.4 216.3L480.8 216.5L480.1 216.9L479.6 217.4L479.3 218L479 218.7L478.9 219.4L479 220.1L479.3 220.8L479.6 221.4L480.1 221.9L480.8 222.3L481.4 222.5L482.1 222.6L482.9 222.5L483.5 222.3L484.1 221.9L484.6 221.4L485 220.8L485.3 220.1L485.3 219.4Z");
  bag.draw("rs-red", "M650.9 301.3L650.8 580.6L640.1 634L613.9 681.6L575.8 719.3L529.9 743.2L482.1 751L433 742.7L388 718.9L350.4 681.6L324.2 634L313.5 580.6L313.4 301.3Z");
  bag.draw("white", "M480.6 734.8L473.2 727.2L477 590.7L485.3 590.5L491.1 725.9L489.4 733.4L483.7 734.8Z");
  bag.draw("white", "M464.7 734.1L470.6 733.2L473.2 725.8L479.4 590.5L475.6 590.3L454.7 723.3L456.1 731.9L461.7 733.8Z");
  bag.draw("white", "M446 731.4L452 731.1L454.5 725.2L475.5 590.3L470.5 589.4L437.2 719.3L437.8 728.5L446.3 731.5Z");
  bag.draw("white", "M427.3 726.1L435.4 724.2L447.7 686.8L470.5 588.6L464.3 586.5L435.5 679.6L419.2 714.4L419.2 722.3L424.4 725.2Z");
  bag.draw("white", "M499.5 734.1L493.7 733.2L491.1 725.8L484.9 590.5L488.7 590.3L509.6 723.3L508.2 731.9L502.6 733.8Z");
  bag.draw("white", "M518.2 731.4L512.3 731.1L509.8 725.2L488.8 590.3L493.8 589.4L527.1 719.3L526.5 728.5L518 731.5Z");
  bag.draw("white", "M537 726.1L528.9 724.2L516.5 686.8L493.7 588.6L499.9 586.5L528.8 679.6L545 714.4L545.1 722.3L539.9 725.2Z");
  bag.draw("white", "M437.2 682.8L444.9 680.2L457.5 648.3L487.8 544.8L480.6 543.2L452 631.7L431.6 669.3L429.7 678.3L434.6 682.2Z");
  bag.draw("white", "M452.4 685.8L461 678.2L486.9 544.4L479.6 543.4L458.4 639.7L445.3 672.8L444.4 681.9L449.8 685.4Z");
  bag.draw("white", "M467.9 687.6L475.4 680.5L486 544.1L478.5 543.6L459.4 678L460.2 685.6L465.2 687.4Z");
  bag.draw("white", "M527 682.8L519.4 680.2L506.8 648.3L476.4 544.8L483.6 543.2L512.3 631.7L532.6 669.3L534.6 678.3L529.7 682.2Z");
  bag.draw("white", "M511.8 685.8L503.3 678.2L477.4 544.4L484.7 543.4L505.9 639.7L518.9 672.8L519.9 681.9L514.5 685.4Z");
  bag.draw("white", "M496.4 687.6L488.8 680.5L478.3 544.1L485.7 543.6L504.8 678L504.1 685.6L499.1 687.4Z");
  bag.draw("white", "M480.8 688.1L474.1 680.5L479.3 543.8L486.7 544L490.2 681.6L483.5 688.1Z");
  bag.draw("white", "M447.7 648L452.9 646.7L462.5 616.2L487.7 510.5L481 508.4L458.7 597.9L442.7 636.8L446.7 647.6Z");
  bag.draw("white", "M459.4 651L465.7 644.5L487.1 510L480.2 508.5L453.5 640.5L458.4 650.7Z");
  bag.draw("white", "M471.2 652.7L477 645.7L486.4 509.5L479.4 508.8L464.6 645.5L470.2 652.6Z");
  bag.draw("white", "M516.5 648L511.3 646.7L501.8 616.2L476.5 510.5L483.3 508.4L505.6 597.9L521.5 636.8L517.5 647.6Z");
  bag.draw("white", "M504.9 651L498.5 644.5L477.2 510L484.1 508.5L510.8 640.5L505.9 650.7Z");
  bag.draw("white", "M493 652.7L487.3 645.7L477.9 509.5L484.9 508.8L499.7 645.5L494.1 652.6Z");
  bag.draw("white", "M481.1 653.2L476 645.6L478.6 509.1L485.7 509.1L488.3 646.8L483.2 653.2Z");
  bag.draw("white", "M500.2 575.2L482.1 630.6L464 575.2Z");
  bag.draw("rs-edb92e", "M564.1 638L575.8 658.3L566.6 683.4L571.7 703.4L565.1 711L556.5 702.9L561.6 682.6L552.5 658.3L563.7 638.4Z");
  bag.draw("rs-edb92e", "M576.8 701.2L570 701.4L566 692.7L570.4 670.4L581.7 665.7L589.6 672.5L585.2 684.1L580.9 678.1L571.5 683.6L571.6 694.2L578.7 699Z");
  bag.draw("rs-edb92e", "M551.4 701.2L558.2 701.4L562.3 692.7L557.9 670.4L546.6 665.7L538.7 672.5L543 684.1L547.4 678.1L556.8 683.6L556.7 694.2L549.6 699Z");
  bag.draw("rs-edb92e", "M558.1 685.5L554.6 689L558.1 692.5L571.9 692L570.1 685.5Z");
  bag.draw("rs-edb92e", "M570.2 596L587.2 626L619.9 629.8L616.6 637.5L598.2 636L619.1 642.9L614.7 654.8L592.2 640L606.5 662.1L604.2 667L592.8 667.3L583.5 638.1L559.7 630.2L562.8 619.4L577.8 626.7L558.3 602.2L558.2 593.1L565.8 593.6Z");
  bag.draw("rs-edb92e", "M619.1 634.5L628.2 634.4L625.6 628.9L619.2 627.8L614.7 631.5L617.8 633.6Z");
  bag.draw("rs-edb92e", "M561.6 628.9L549.7 627.3L555 621.2L563.3 622.8L562.5 628.5Z");
  bag.draw("rs-edb92e", "M595.2 664.6L597.9 657.5L604.5 664.7L599.7 677.7L596.6 667.5Z");
  bag.draw("rs-edb92e", "M611.7 650.9L617.4 658.7L619.9 648.2L611 644.7L611.4 649.7Z");
  bag.draw("white", "M558.8 469L560.9 546.4L568.6 560.6L574.7 541.5L573.9 471.5Z");
  bag.draw("white", "M596.4 454.8L598.9 537L585.4 591.8L577.4 582.9L573.1 566.8L570.4 473.4Z");
  bag.draw("white", "M611.2 467.9L609.3 550.2L593.1 604L583.5 572.5L586.8 485.5Z");
  bag.draw("white", "M622.1 486.7L601.2 486.2L595.1 568.4L598 605L609.9 623.7L616.1 601.3L619.1 548.7Z");
  bag.draw("white", "M542.1 454.4L546.6 531.6L554.7 545.6L560.2 526.3L557.3 456.4Z");
  bag.draw("white", "M579.3 407.2L579.9 471.9L573.3 492.4L564.9 475.8L564 419.9Z");
  bag.draw("white", "M564.4 419.3L564.3 475.9L558.9 492.9L550.5 479L548.1 433.2Z");
  bag.draw("white", "M577.2 405.6L592 387.4L595.4 462.7L587.3 493.1L579.1 482L577.4 406.7Z");
  bag.draw("white", "M606.4 451.2L604.5 488.5L601.8 493.4L593.4 479.7L587.9 387.2L600.4 379.6Z");
  bag.draw("white", "M620.6 471.8L608.3 505.6L602.4 497.3L604.7 429.7L595.8 374.4L610.3 389.2L619.6 410.9L621.1 468.3Z");
  bag.draw("white", "M619.5 486.2L639.7 479.5L640.5 490.7L630.5 581.4L634.3 624.7L618.2 615.1L610.4 591.5L619.6 489.2Z");
  bag.draw("white", "M611.7 392.8L617.7 454.6L608.7 505.5L622.8 498.3L630.5 480.8L628.1 395.6Z");
  bag.draw("white", "M622.2 395.9L629.4 447.4L622.4 498.8L630.1 496.5L638.6 485.6L642.2 466.3L637.8 386.5Z");
  bag.draw("white", "M592 390L605.4 388.4L610 412.4L605.4 437.7L596 419Z");
  bag.draw("white", "M557.1 418.6L569.1 418.7L569.6 439.9L565 458.3L560.2 455.4L557.1 420.9Z");
  bag.draw("white", "M556.2 424.8L551.7 462.6L549.8 465.6L546.1 461.1L542.8 449.1Z");
  bag.draw("white", "M569.3 412.4L581.2 411.6L583.4 432.7L580.3 451.3L575.3 448.8L569.4 414.7Z");
  bag.draw("white", "M593.5 394.2L593.4 444.3L583.8 429.9L580.4 399.6Z");
  bag.draw("white", "M546.8 568.3L566.5 578.4L584.4 603.6L565.3 600.7L547.2 579.2Z");
  bag.draw("white", "M550.9 575.7L563.1 611.8L562.6 615.3L557 613L548.5 603.7Z");
  bag.draw("white", "M548.4 578.7L553 604.9L550 620L540.1 608L535.7 580.6Z");
  bag.draw("white", "M522.6 585.3L532.1 614.6L539.1 605.6L541.1 595.5L533.9 563.4Z");
  bag.draw("white", "M542.5 553.9L552 578.8L551.9 594.1L539.3 584.9L530.5 558.2Z");
  bag.draw("white", "M541.3 533.3L555 547.4L570.2 581.2L552.1 574.5L538.7 549.7Z");
  bag.draw("white", "M511.3 597.4L497.3 624.9L491.8 614.8L492 602.6L500.4 592L506.9 587.7L510.5 594.7Z");
  bag.draw("white", "M508.9 589.5L489.5 617.3L483.3 605.2L484.6 592.9Z");
  bag.draw("white", "M524.5 586L510.4 613.5L504.5 601.4L506.1 589.1Z");
  bag.draw("rs-edb92e", "M400.1 638L388.5 658.3L397.7 683.4L392.6 703.4L399.1 711L407.8 702.9L402.7 682.6L411.8 658.3L400.6 638.4Z");
  bag.draw("rs-edb92e", "M387.4 701.2L394.2 701.4L398.3 692.7L393.9 670.4L382.6 665.7L374.7 672.5L379 684.1L383.4 678.1L392.8 683.6L392.7 694.2L385.6 699Z");
  bag.draw("rs-edb92e", "M412.8 701.2L406 701.4L402 692.7L406.4 670.4L417.7 665.7L425.6 672.5L421.2 684.1L416.9 678.1L407.5 683.6L407.6 694.2L414.7 699Z");
  bag.draw("rs-edb92e", "M406.1 685.5L409.6 689L406.1 692.5L392.4 692L394.1 685.5Z");
  bag.draw("rs-edb92e", "M394 596L377 626L344.3 629.8L347.7 637.5L366 636L345.2 642.9L349.6 654.8L372 640L357.8 662.1L360 667L371.5 667.3L380.7 638.1L404.5 630.2L401.4 619.4L386.5 626.7L406 602.2L406.1 593.1L398.4 593.6Z");
  bag.draw("rs-edb92e", "M345.2 634.5L336.1 634.4L338.7 628.9L345.1 627.8L349.6 631.5L346.4 633.6Z");
  bag.draw("rs-edb92e", "M402.7 628.9L414.6 627.3L409.3 621.2L401 622.8L401.7 628.5Z");
  bag.draw("rs-edb92e", "M369.1 664.6L366.4 657.5L359.8 664.7L364.5 677.7L367.7 667.5Z");
  bag.draw("rs-edb92e", "M352.5 650.9L346.9 658.7L344.3 648.2L353.3 644.7L352.9 649.7Z");
  bag.draw("white", "M405.5 469L403.4 546.4L395.7 560.6L389.6 541.5L390.4 471.5Z");
  bag.draw("white", "M367.9 454.8L365.4 537L378.9 591.8L386.9 582.9L391.2 566.8L393.9 473.4Z");
  bag.draw("white", "M353.1 467.9L355 550.2L371.2 604L380.8 572.5L377.5 485.5Z");
  bag.draw("white", "M342.2 486.7L363.1 486.2L369.2 568.4L366.3 605L354.4 623.7L348.2 601.3L345.2 548.7Z");
  bag.draw("white", "M422.1 454.4L417.7 531.6L409.6 545.6L404 526.3L406.9 456.4Z");
  bag.draw("white", "M385 407.2L384.4 471.9L390.9 492.4L399.4 475.8L400.3 419.9Z");
  bag.draw("white", "M399.9 419.3L400 475.9L405.4 492.9L413.8 479L416.2 433.2Z");
  bag.draw("white", "M387.1 405.6L372.3 387.4L368.9 462.7L377 493.1L385.2 482L386.9 406.7Z");
  bag.draw("white", "M357.9 451.2L359.8 488.5L362.5 493.4L370.9 479.7L376.4 387.2L363.9 379.6Z");
  bag.draw("white", "M343.6 471.8L355.9 505.6L361.9 497.3L359.6 429.7L368.5 374.4L354 389.2L344.7 410.9L343.2 468.3Z");
  bag.draw("white", "M344.8 486.2L324.5 479.5L323.8 490.7L333.8 581.4L330 624.7L346.1 615.1L353.9 591.5L344.7 489.2Z");
  bag.draw("white", "M352.6 392.8L346.6 454.6L355.6 505.5L341.5 498.3L333.8 480.8L336.2 395.6Z");
  bag.draw("white", "M342 395.9L334.9 447.4L341.8 498.8L334.2 496.5L325.7 485.6L322.1 466.3L326.5 386.5Z");
  bag.draw("white", "M372.3 390L358.9 388.4L354.3 412.4L358.9 437.7L368.3 419Z");
  bag.draw("white", "M407.1 418.6L395.2 418.7L394.7 439.9L399.3 458.3L404.1 455.4L407.2 420.9Z");
  bag.draw("white", "M408.1 424.8L412.6 462.6L414.5 465.6L418.2 461.1L421.5 449.1Z");
  bag.draw("white", "M395 412.4L383.1 411.6L380.8 432.7L384 451.3L389 448.8L394.9 414.7Z");
  bag.draw("white", "M370.8 394.2L370.9 444.3L380.5 429.9L383.9 399.6Z");
  bag.draw("white", "M417.5 568.3L397.8 578.4L379.9 603.6L399 600.7L417.1 579.2Z");
  bag.draw("white", "M413.4 575.7L401.2 611.8L401.7 615.3L407.3 613L415.8 603.7Z");
  bag.draw("white", "M415.9 578.7L411.3 604.9L414.3 620L424.2 608L428.6 580.6Z");
  bag.draw("white", "M441.7 585.3L432.2 614.6L425.2 605.6L423.2 595.5L430.4 563.4Z");
  bag.draw("white", "M421.7 553.9L412.3 578.8L412.4 594.1L425 584.9L433.8 558.2Z");
  bag.draw("white", "M423 533.3L409.3 547.4L394.1 581.2L412.2 574.5L425.6 549.7Z");
  bag.draw("white", "M453 597.4L467 624.9L472.5 614.8L472.3 602.6L463.9 592L457.3 587.7L453.8 594.7Z");
  bag.draw("white", "M455.4 589.5L474.8 617.3L481 605.2L479.7 592.9Z");
  bag.draw("white", "M439.8 586L453.8 613.5L459.8 601.4L458.2 589.1Z");
  bag.draw("white", "M482.1 387.5L477.4 359.3L467 336L472.8 334.7L473.7 325.2L417.7 312.7L418 324.9L436.6 347.2L447.1 382.8L438.7 399.5L423 413.4L427.9 414.8L415.7 418.6L371.1 358.8L369.8 345.2L379.8 318.7L365.8 317.7L351.9 325.6L329.7 362.1L319.2 418.7L339.4 405L336.2 419.1L344.9 416.3L359 395.1L370.5 395L399.4 433.6L417 447.3L548.3 447L565.4 433L593.7 395L605.2 395.1L619.4 416.3L628 419.1L624.8 405L645 418.7L629.2 348.9L614.6 327.6L596.5 317.3L584 320.1L594.6 345.5L590.8 364.5L548.5 418.6L536.3 414.8L541.2 413.4L524.5 398L517.1 381L527.6 347.2L546.1 325.3L547.1 312.8L490.5 325.2L490.6 333.3L497.2 336L482.4 384.8Z");
  bag.draw("rs-edb92e", "M522.5 356.4L547.2 359.2L562.8 353.6L566.9 345.7L553.7 354.1L528.5 349.8Z");
  bag.draw("rs-edb92e", "M558.3 317.8L570.5 325.7L561.5 342.8L555.4 348.1L545.6 339.8L525 354.3L546.4 359.3L544.4 363L520.5 362L547.7 317.6L556.1 315.3Z");
  bag.draw("rs-21231e", "M534.6 330.9L535 323.3L530.6 325.2L533.4 330.1Z");
  bag.draw("rs-21231e", "M561.5 326L561.5 326.3L561.4 326.6L561.2 326.9L561 327.1L560.8 327.3L560.5 327.4L560.1 327.4L559.8 327.4L559.5 327.3L559.3 327.1L559 326.9L558.9 326.6L558.8 326.3L558.7 326L558.8 325.7L558.9 325.4L559 325.1L559.3 324.9L559.5 324.7L559.8 324.6L560.1 324.6L560.5 324.6L560.8 324.7L561 324.9L561.2 325.1L561.4 325.4L561.5 325.7Z");
  bag.draw("rs-edb92e", "M441.7 356.4L417.1 359.2L401.5 353.6L397.3 345.7L410.6 354.1L435.7 349.8Z");
  bag.draw("rs-edb92e", "M405.9 317.8L393.8 325.7L402.7 342.8L408.8 348.1L418.7 339.8L439.3 354.3L417.8 359.3L419.8 363L443.8 362L416.5 317.6L408.2 315.3Z");
  bag.draw("rs-21231e", "M429.6 330.9L429.3 323.3L433.7 325.2L430.9 330.1Z");
  bag.draw("rs-21231e", "M402.7 326L402.8 326.3L402.9 326.6L403 326.9L403.3 327.1L403.5 327.3L403.8 327.4L404.1 327.4L404.5 327.4L404.8 327.3L405 327.1L405.2 326.9L405.4 326.6L405.5 326.3L405.5 326L405.5 325.7L405.4 325.4L405.2 325.1L405 324.9L404.8 324.7L404.5 324.6L404.1 324.6L403.8 324.6L403.5 324.7L403.3 324.9L403 325.1L402.9 325.4L402.8 325.7Z");
  bag.draw("white", "M473.2 398.7L482.1 420.9L491 398.7Z");
  bag.draw("rs-red", "M549.6 422L549.6 532.8L545.3 554.8L519.7 589L482.1 602L444.6 589L419.3 555.8L414.7 532.9L414.6 422Z");
  bag.draw("white", "M549.1 488.5L549.1 516.5L495.6 516.5L495.6 599.5L480.2 601L468.6 599.5L468.6 516.5L415.1 516.5L415.1 488.5L468.6 488.5L468.6 422.5L495.6 422.5L495.6 488.5Z");
  bag.draw("white", "M505.1 528L528.4 524.8L535.1 535.5L527.5 545.4L521.6 539.5L524.3 535.1L530.2 537.1L527.7 532L518.5 531.7L512.2 538.9L516.3 547.5L512.6 557.9L527.5 563.1L529.9 557.6L524.3 559.9L521.6 555.5L529.7 550.3L535.1 559.5L532 568.2L505.1 567Z");
  bag.draw("white", "M459.1 438L435.9 434.8L429.1 445.5L436.8 455.4L442.7 449.5L439.9 445.1L434.1 447.1L436.6 442L445.8 441.7L452.1 448.9L447.9 457.5L451.6 467.9L436.8 473.1L434.4 467.6L439.9 469.9L442.7 465.5L434.6 460.3L429.1 469.5L432.3 478.2L459.1 477Z");
  bag.draw("white", "M505.1 438L528.4 434.8L535.1 445.5L527.5 455.4L521.6 449.5L524.3 445.1L530.2 447.1L527.7 442L518.5 441.7L512.2 448.9L516.3 457.5L512.6 467.9L527.5 473.1L529.9 467.6L524.3 469.9L521.6 465.5L529.7 460.3L535.1 469.5L532 478.2L505.1 477Z");
  bag.draw("white", "M459.1 528L435.9 524.8L429.1 535.5L436.8 545.4L442.7 539.5L439.9 535.1L434.1 537.1L436.6 532L445.8 531.7L452.1 538.9L447.9 547.5L451.6 557.9L436.8 563.1L434.4 557.6L439.9 559.9L442.7 555.5L434.6 550.3L429.1 559.5L432.3 568.2L459.1 567Z");
  bag.box(1350, 900);
  return bag.done("0 0 1350 900");
}


function doonfPortugal() {
  var bag = doonfBag();
  bag.draw("pt-red", "M0 0L600 0L600 400L0 400Z");
  bag.draw("pt-green", "M0 0L240 0L240 400L0 400Z");
  bag.cut("pt-ffff00", "M318.2 262L284.5 250.4L228.5 220L171.2 182.4L154.3 168.6L148.6 160.9L156.2 148.1L182.8 170.2L240.8 207.3L298.8 239.3L325.5 249.2Z");
  bag.cut("pt-ffff00", "M154.6 146.4L158.3 153.4L173.9 165.9L248.2 212.5L304.3 242L323.6 249.4L328.3 248.2L295.8 235.5L248.2 209.9L184.3 169.8L162.4 153.3L156.1 144L154.8 146.1ZM319 262.4L309.7 261.8L286 251.9L213.8 211.5L158 174.1L148 163.9L148.7 158.2L154.4 167.6L171.1 181.1L241.3 225.3L293.5 252.9L312.4 260L320.2 260.3Z");
  bag.cut("pt-ffff00", "M240.2 169.2L279.8 167L313 161.5L329.2 156.5L324.6 149L293.1 157.2L239.9 161.4L186.1 157.6L168.7 153.5L156 147.5L151.7 155.5L171.7 162.4L201.6 167.6L237.6 169.2Z");
  bag.cut("pt-ffff00", "M330.4 156.7L295.1 166.3L240.1 170.3L187.4 166.9L150.4 157.1L151.4 155.1L172.3 161.7L195.4 165.6L245.1 168L294.6 164L317.3 159.1L328.9 154.1ZM326.4 149.1L292.6 158.2L240.3 161.9L186.7 158.2L154.6 149.7L155.8 147.7L173.8 153.5L199.4 157.6L247.9 159.5L298.3 154.9L324.9 146.6Z");
  bag.cut("pt-ffff00", "M140.9 205.7L156.1 211.5L178.9 216.4L239.9 221.1L298.7 216.8L322.3 212.3L339.2 206.4L338.7 196.3L325.6 203L295.8 209L257.5 212.3L220.9 212.1L171.5 206.5L140.8 196.7Z");
  bag.cut("pt-ffff00", "M340.1 204.2L339.5 207.2L333.9 209.9L304.5 217.1L239.4 221.9L204.8 220.6L172.5 216.5L144.4 208.9L139.7 206.7L139.7 203.9L154.4 209.9L181.6 215.7L236.6 219.7L298.7 215.8L323 210.8L339.3 204.8ZM340.1 195.7L339.5 198.7L334 201.4L304.5 208.6L239.4 213.4L204.9 212.1L172.5 208L144.4 200.4L139.7 198.2L139.7 195.4L154.5 201.4L181.6 207.2L236.6 211.2L298.7 207.3L323 202.3L339.3 196.3Z");
  bag.cut("pt-ffff00", "M239.8 260.3L199.1 257L152.6 246.8L158.3 255.6L173.9 260.7L204.7 266.8L234.3 269.1L273.4 267.1L300.4 262.9L321.1 255.8L326.9 246.6L289.8 255.6L242.2 260.3Z");
  bag.cut("pt-ffff00", "M323.3 253.7L320.7 257.5L293.3 264.8L239.8 270L188.3 264.8L162.4 258L155.4 253.4L193.7 263.5L240 267.8L285.6 263.9L322.6 254.1ZM328.3 245.4L325.3 249.2L299 255.6L240.3 261.4L185.5 256.1L156 249.4L150.9 246.1L196.5 255.5L240.3 259.2L287.4 255.1L325.8 246.4Z");
  bag.cut("pt-ffff00", "M328.8 197.8L327.1 215.2L322.5 231.2L314.9 246.9L305.1 260.1L292.9 270.8L277.6 279.8L260.6 285.9L244.3 288.4L228.9 288L211.5 283.6L194.3 275.6L180.7 266L161 239.3L152 209.8L151.7 194.1L155.2 175.2L161.5 159L171.5 143.7L184.4 131L198.1 122.1L215.1 115.2L234.5 111.5L251 111.9L268 116L284.8 123.8L298.6 133.8L310.5 146.2L319.2 160.1L325 176L328.5 195.1ZM239.6 101.4L259.3 103.4L277.6 109L294.3 117.8L308.9 129.6L321.1 143.8L330.4 160.1L336.5 178.2L338.9 197.6L337.4 217.3L332.2 235.7L323.7 252.5L312.2 267.3L296.2 281.1L279.8 290.3L261.6 296.4L242.2 298.8L222.4 297.3L204 292.2L187.1 283.7L172.3 272.3L158.5 256.4L149.2 240.1L143.2 222L140.8 202.6L142.2 182.9L147.4 164.5L155.9 147.7L167.3 132.9L183.2 119.1L199.6 109.9L217.7 103.9L237.1 101.4Z");
  bag.cut("pt-ffff00", "M239.9 101.1L259.5 103L277.8 108.7L294.5 117.5L309 129.3L321.1 143.6L330.4 160L336.5 178.1L338.9 197.6L337.4 217.3L332.2 235.8L323.7 252.7L312.3 267.5L296.4 281.3L280 290.6L261.9 296.7L242.4 299.1L222.7 297.6L204.2 292.4L187.3 283.9L172.5 272.5L158.7 256.6L149.4 240.2L143.4 222.1L140.9 202.6L142.4 182.9L147.6 164.4L156.1 147.5L167.5 132.7L183.4 118.9L199.8 109.6L217.9 103.5L237.4 101.1ZM143.1 200.1L145.1 219.6L150.7 237.7L159.7 254.1L171.6 268.5L185.9 280.3L202.4 289.3L220.5 295L239.9 296.9L259.3 295L277.4 289.3L293.9 280.3L308.2 268.5L320.1 254.1L329.1 237.7L334.8 219.6L336.7 200.1L335.2 183L330 164.7L321.4 148L309.9 133.4L295.8 121.2L279.6 111.8L261.7 105.7L242.4 103.3L222.9 104.8L204.6 110L187.9 118.6L173.2 130.1L161 144.1L151.7 160.3L145.6 178.3L143.1 197.6Z");
  bag.cut("pt-ffff00", "M240 109.3L257 110.9L275.1 116.5L289.6 124.2L304 136L315.7 150.4L323.5 164.8L329.1 183L330.7 200L329.1 217.1L324.4 233L317 247.7L305.6 262.4L291.5 274.5L277.3 282.6L259.3 288.6L242.5 290.7L225.4 289.5L207 284.5L192.4 277.1L177.7 265.7L165.5 251.6L157.4 237.4L151.4 219.4L149.3 202.5L150.5 185.4L155.6 167L163 152.3L174.4 137.6L188.5 125.5L202.7 117.4L220.6 111.4L237.5 109.3ZM151.5 200L153.2 217.2L158 233.3L165.7 247.9L177.5 262.5L192.1 274.3L206.8 282L222.8 286.9L240 288.5L257.1 286.9L273.2 282L287.9 274.3L302.4 262.5L314.3 247.9L322 233.3L326.8 217.2L328.5 200L326.8 182.8L322 166.7L314.3 152.1L304.1 139.2L289.8 127L275.4 118.9L259.5 113.7L242.5 111.5L225.2 112.7L209 117.1L194.1 124.4L179.2 135.9L167 150.1L159 164.6L153.7 180.5L151.5 197.5Z");
  bag.cut("pt-ffff00", "M244 100.7L235.5 100.7L235.5 299.6L244 299.6Z");
  bag.cut("pt-ffff00", "M243.1 99.5L245.3 99.5L245.3 300.8L243.1 300.8ZM234.7 99.5L236.9 99.5L236.9 300.8L234.7 300.8Z");
  bag.cut("pt-ffff00", "M339 203.9L339 196.6L333 191L299 182L250 177L191 180L149 190L140.5 196.3L140.5 203.6L162 194L213 186L262 186L298 190L323 196Z");
  bag.cut("pt-ffff00", "M240 184.8L276.2 186.5L309.4 191.6L332.4 198.8L339.4 203.3L340.1 206.6L327.4 199.1L303.6 192.7L273.8 188.5L240 187L207.1 188.4L175 192.8L150.7 199.5L139.7 206.7L140.1 203.1L145.6 199.3L170.5 191.4L202.3 186.6L237.3 184.8ZM240 176.3L276.2 178L309.4 183.1L332.4 190.3L339.4 194.8L340.1 198.2L327.4 190.7L303.6 184.2L273.8 180L240 178.5L207.1 179.9L175.1 184.3L150.9 191L139.7 198.2L140.1 194.6L145.7 190.8L170.6 182.9L202.4 178.1L237.3 176.3Z");
  bag.cut("pt-ffff00", "M239.5 133L275.1 134.6L306.1 139.7L323.2 145.6L328.5 154.9L293.5 145.2L246.6 141.8L187.3 145.4L167.1 149.4L151.4 155.4L157.8 144.6L171.3 139.8L200.2 135L236.7 133Z");
  bag.cut("pt-ffff00", "M240 140.6L297.4 144.7L324.2 151.5L330.5 156.7L293.2 146.1L242.4 142.9L187.1 146L166.3 150.5L150.8 156.5L152.3 153.6L158.5 150.8L181.5 144.6L237.3 140.6ZM240 132.1L295.4 136L319.1 142.7L326.4 149.1L316.3 143.7L294.5 138.2L242.5 134.3L189.6 137.5L156.5 147L163.7 141.6L183.9 136.2L237.3 132.1Z");
  bag.cut("pt-ffff00", "M289.2 241.3L250.9 237.6L207.3 239.2L175.2 244.8L156.3 253.7L151.7 246.2L174.2 236.2L209.8 230.2L254.6 229.6L293.4 233.8Z");
  bag.cut("pt-ffff00", "M239.6 236.5L279 238.8L289.6 240.4L288.4 242.5L251.5 238.9L208.1 240.1L171.9 247.1L156.3 255.6L155.6 252.8L160.1 249.5L182.3 242L208 237.9L237.5 236.5ZM240.4 227.9L280.7 230.4L294.1 232.5L292.9 234.7L253.4 230.4L206.9 231.6L171.7 238.2L157.1 243.7L152 248.2L151.3 245L156.3 241.5L179.8 233.7L206.6 229.4L238.1 227.9Z");
  bag.cut("pt-ffff00", "M327.6 247.4L320.2 258.8L299 240L244 203L182 169L149.8 158L159 144L179 149L245 183L283 207L315 230L328 245Z");
  bag.cut("pt-ffff00", "M148.7 158.3L159.1 159.4L179.8 167.5L235.6 197L298.2 238.3L315.9 253L320.1 260.6L318.4 263L317.7 258.9L313.1 253.6L286 232.1L230.3 196.4L174.7 167.7L155.5 160.7L147.4 160.7ZM329.1 247.2L325 238.8L309.3 224.8L250.2 185.2L185.4 151.2L166 144L156 143.9L154.6 146.4L166.2 146.3L192.5 156.8L254.5 190.4L311 229.2L324.3 241.5L327.5 249.6Z");
  bag.draw("white", "M180.6 211L182.7 226.7L188.7 240.8L198.1 252.8L212 263.2L226.3 268.7L242.2 270.3L257.8 267.6L273.5 259.9L290 242.8L298.2 222.4L299.3 131.9L180.6 131.7Z");
  bag.draw("pt-red", "M182.8 211.1L187.3 233.1L199.6 251.2L217.7 263.4L239.8 267.9L261.9 263.4L280 251.3L292.2 233.2L296.7 211.2L296.7 134.4L182.9 134.4ZM273.8 157.4L273.7 213.6L271.2 224.4L258.8 239.5L248.8 244.1L239.8 245.3L230.8 244.1L221 239.4L208.5 224.2L206 213.5L205.9 157.2Z");
  bag.draw("pt-ffff00", "M190.2 154.4L194.3 147.6L198.5 154.5Z");
  bag.draw("pt-ffff00", "M186.8 147.7L186.1 154L190.3 154L194.3 147.9L198.4 154L202.6 154L201.8 147.7Z");
  bag.draw("pt-ffff00", "M185.9 154.1L203.3 155.4L185.4 154.3Z");
  bag.draw("pt-ffff00", "M192 154L194.3 149.8L196.6 154Z");
  bag.draw("pt-ffff00", "M186.2 145.1L202.9 146.3L185.8 145.3Z");
  bag.draw("pt-ffff00", "M186.6 146.5L202.1 147.9L186.1 146.7Z");
  bag.draw("pt-ffff00", "M191.6 135.9L197.1 135.9L196.6 138.4L191.6 137.9Z");
  bag.draw("pt-ffff00", "M196.2 138.6L196.5 145L192.2 145L192.4 138.6Z");
  bag.draw("pt-ffff00", "M190.9 141.6L191.1 145L186.9 145L187.1 141.6Z");
  bag.draw("pt-ffff00", "M201.5 141.6L201.7 145L197.6 145L197.7 141.6Z");
  bag.draw("pt-ffff00", "M186.3 139L191.7 139L191.2 141.6L186.3 141Z");
  bag.draw("pt-ffff00", "M196.9 139L202.3 139L201.8 141.6L196.9 141Z");
  bag.draw("pt-ffff00", "M190.2 200.7L194.3 193.9L198.5 200.8Z");
  bag.draw("pt-ffff00", "M186.8 194L186.1 200.4L190.3 200.4L194.3 194.3L198.4 200.4L202.6 200.4L201.8 194Z");
  bag.draw("pt-ffff00", "M185.9 200.4L203.3 201.7L185.4 200.6Z");
  bag.draw("pt-ffff00", "M192 200.3L194.3 196.1L196.6 200.3Z");
  bag.draw("pt-ffff00", "M186.2 191.4L202.9 192.6L185.8 191.6Z");
  bag.draw("pt-ffff00", "M186.6 192.8L202.1 194.2L186.1 193Z");
  bag.draw("pt-ffff00", "M191.6 182.2L197.1 182.2L196.6 184.7L191.6 184.2Z");
  bag.draw("pt-ffff00", "M196.2 184.9L196.5 191.3L192.2 191.3L192.4 184.9Z");
  bag.draw("pt-ffff00", "M190.9 187.9L191.1 191.4L186.9 191.4L187.1 187.9Z");
  bag.draw("pt-ffff00", "M201.5 187.9L201.7 191.4L197.6 191.4L197.7 187.9Z");
  bag.draw("pt-ffff00", "M186.3 185.4L191.7 185.3L191.2 187.9L186.3 187.3Z");
  bag.draw("pt-ffff00", "M196.9 185.4L202.3 185.3L201.8 187.9L196.9 187.3Z");
  bag.draw("pt-ffff00", "M208.3 249L206.3 241.2L214.1 243.1Z");
  bag.draw("pt-ffff00", "M201.1 246.6L205.1 251.6L208 248.6L206.6 241.4L213.8 242.8L216.7 239.9L211.6 235.9Z");
  bag.draw("pt-ffff00", "M204.9 251.8L218.1 240.4L204.8 252.3Z");
  bag.draw("pt-ffff00", "M209.2 247.4L207.8 242.8L212.5 244.1Z");
  bag.draw("pt-ffff00", "M198.8 245.2L211.4 234.2L198.6 245.6Z");
  bag.draw("pt-ffff00", "M200 245.9L212 235.9L199.9 246.4Z");
  bag.draw("pt-ffff00", "M196.1 234.9L199.9 231L201.4 233.1L197.5 236.3Z");
  bag.draw("pt-ffff00", "M201.2 233.5L206 237.9L203 240.9L198.6 236.2Z");
  bag.draw("pt-ffff00", "M199.6 239.4L202.2 241.7L199.3 244.6L196.9 242.1Z");
  bag.draw("pt-ffff00", "M207.1 231.8L209.7 234.2L206.8 237.1L204.4 234.6Z");
  bag.draw("pt-ffff00", "M194.6 240.9L198.4 237L199.8 239.2L196 242.3Z");
  bag.draw("pt-ffff00", "M202.1 233.4L205.9 229.5L207.3 231.7L203.5 234.8Z");
  bag.draw("pt-ffff00", "M235.9 154.4L240 147.6L244.2 154.5Z");
  bag.draw("pt-ffff00", "M232.5 147.7L231.8 154L236 154L240.1 147.9L244.1 154L248.3 154L247.5 147.7Z");
  bag.draw("pt-ffff00", "M231.6 154.1L249 155.4L231.1 154.3Z");
  bag.draw("pt-ffff00", "M237.7 154L240 149.8L242.4 154Z");
  bag.draw("pt-ffff00", "M231.9 145.1L248.6 146.3L231.5 145.3Z");
  bag.draw("pt-ffff00", "M232.3 146.5L247.8 147.9L231.8 146.7Z");
  bag.draw("pt-ffff00", "M237.3 135.9L242.8 135.9L242.3 138.4L237.3 137.9Z");
  bag.draw("pt-ffff00", "M241.9 138.6L242.2 145L237.9 145L238.2 138.6Z");
  bag.draw("pt-ffff00", "M236.7 141.6L236.8 145L232.7 145L232.8 141.6Z");
  bag.draw("pt-ffff00", "M247.3 141.6L247.4 145L243.3 145L243.4 141.6Z");
  bag.draw("pt-ffff00", "M232 139L237.4 139L236.9 141.6L232 141Z");
  bag.draw("pt-ffff00", "M242.6 139L248 139L247.5 141.6L242.6 141Z");
  bag.draw("pt-ffff00", "M289.6 154.4L285.5 147.6L281.3 154.5Z");
  bag.draw("pt-ffff00", "M293 147.7L293.7 154L289.5 154L285.5 147.9L281.4 154L277.2 154L278 147.7Z");
  bag.draw("pt-ffff00", "M293.9 154.1L276.5 155.4L294.4 154.3Z");
  bag.draw("pt-ffff00", "M287.8 154L285.5 149.8L283.1 154Z");
  bag.draw("pt-ffff00", "M293.6 145.1L276.9 146.3L294 145.3Z");
  bag.draw("pt-ffff00", "M293.2 146.5L277.7 147.9L293.7 146.7Z");
  bag.draw("pt-ffff00", "M288.2 135.9L282.7 135.9L283.2 138.4L288.2 137.9Z");
  bag.draw("pt-ffff00", "M283.6 138.6L283.3 145L287.6 145L287.3 138.6Z");
  bag.draw("pt-ffff00", "M288.9 141.6L288.7 145L292.8 145L292.7 141.6Z");
  bag.draw("pt-ffff00", "M278.2 141.6L278.1 145L282.2 145L282.1 141.6Z");
  bag.draw("pt-ffff00", "M293.5 139L288.1 139L288.6 141.6L293.5 141Z");
  bag.draw("pt-ffff00", "M282.9 139L277.5 139L278 141.6L282.9 141Z");
  bag.draw("pt-ffff00", "M289.6 200.7L285.5 193.9L281.3 200.8Z");
  bag.draw("pt-ffff00", "M293 194L293.7 200.4L289.5 200.4L285.5 194.3L281.4 200.4L277.2 200.4L278 194Z");
  bag.draw("pt-ffff00", "M293.9 200.4L276.5 201.7L294.4 200.6Z");
  bag.draw("pt-ffff00", "M287.8 200.3L285.5 196.1L283.1 200.3Z");
  bag.draw("pt-ffff00", "M293.6 191.4L276.9 192.6L294 191.6Z");
  bag.draw("pt-ffff00", "M293.2 192.8L277.7 194.2L293.7 193Z");
  bag.draw("pt-ffff00", "M288.2 182.2L282.7 182.2L283.2 184.7L288.2 184.2Z");
  bag.draw("pt-ffff00", "M283.6 184.9L283.3 191.3L287.6 191.3L287.3 184.9Z");
  bag.draw("pt-ffff00", "M288.9 187.9L288.7 191.4L292.8 191.4L292.7 187.9Z");
  bag.draw("pt-ffff00", "M278.2 187.9L278.1 191.4L282.2 191.4L282.1 187.9Z");
  bag.draw("pt-ffff00", "M293.5 185.4L288.1 185.3L288.6 187.9L293.5 187.3Z");
  bag.draw("pt-ffff00", "M282.9 185.4L277.5 185.3L278 187.9L282.9 187.3Z");
  bag.draw("pt-ffff00", "M271.5 249L273.5 241.2L265.7 243.1Z");
  bag.draw("pt-ffff00", "M278.7 246.6L274.7 251.6L271.8 248.6L273.2 241.4L266 242.8L263.1 239.9L268.1 235.9Z");
  bag.draw("pt-ffff00", "M274.9 251.8L261.7 240.4L275 252.3Z");
  bag.draw("pt-ffff00", "M270.5 247.4L272 242.8L267.3 244.1Z");
  bag.draw("pt-ffff00", "M281 245.2L268.4 234.2L281.2 245.6Z");
  bag.draw("pt-ffff00", "M279.8 245.9L267.8 235.9L279.9 246.4Z");
  bag.draw("pt-ffff00", "M283.7 234.9L279.8 231L278.4 233.1L282.3 236.3Z");
  bag.draw("pt-ffff00", "M278.6 233.5L273.8 237.9L276.8 240.9L281.2 236.2Z");
  bag.draw("pt-ffff00", "M280.1 239.4L277.6 241.7L280.5 244.6L282.9 242.1Z");
  bag.draw("pt-ffff00", "M272.7 231.8L270.1 234.2L273 237.1L275.4 234.6Z");
  bag.draw("pt-ffff00", "M285.2 240.9L281.4 237L280 239.2L283.8 242.3Z");
  bag.draw("pt-ffff00", "M277.7 233.4L273.9 229.5L272.5 231.7L276.3 234.8Z");
  bag.draw("pt-blue", "M232.6 202.4L234.8 208.1L240.1 210.5L245.5 208.1L247.7 202.4L247.7 191.7L232.7 191.6Z");
  bag.draw("pt-blue", "M232.6 176.4L234.8 182.1L240.1 184.5L245.5 182.1L247.7 176.4L247.7 165.6L232.7 165.6Z");
  bag.draw("pt-blue", "M211.8 202.4L214 208.1L219.4 210.5L224.7 208.1L226.9 202.4L226.9 191.7L211.9 191.6Z");
  bag.draw("pt-blue", "M253.4 202.4L255.6 208.1L260.9 210.5L266.2 208.1L268.4 202.4L268.4 191.7L253.4 191.6Z");
  bag.draw("pt-blue", "M232.6 228.2L234.8 233.9L240.1 236.3L245.5 233.9L247.7 228.2L247.7 217.4L232.7 217.4Z");
  bag.box(600, 400);
  return bag.done("0 0 600 400");
}


function doonfVatican() {
  var bag = doonfBag();
  bag.draw("white", "M0 0L1000 0L1000 1000L0 1000Z");
  bag.draw("va-fff200", "M0 0L500 0L500 1000L0 1000Z");
  bag.draw("white", "M777.1 409L760.1 411.4L770.5 439.7L783.9 460.4L798.4 448.4L778 411Z");
  bag.draw("white", "M813.7 461.6L799.2 473L808.5 479.7L818.5 478.5L825 472.2L826.5 463L815.6 462.4Z");
  bag.draw("white", "M688.6 462.5L675.1 464L680.3 477.2L688.2 479.4L702.2 474Z");
  bag.draw("white", "M724.4 408.8L703.1 448.7L717.5 461L732.4 436.2L741.2 411.2L726.3 409.3Z");
  bag.draw("white", "M752.4 395L726.4 396.6L717.1 400.6L727.3 405.4L752.2 407.3L773.6 405.9L784.1 401.5L776.9 396.8L756.8 395ZM754.2 355.6L762.1 362.8L752.9 370.6L760.9 373.7L770.5 369L772.2 361.4L776.4 363.2L774.8 370.7L780.7 374.6L785.5 366.1L796.8 367.1L793.4 362L757 355.7ZM747.6 355.8L709.3 361.3L705.5 366.9L717.1 365.8L722.2 374.2L727.5 370L726.3 362.4L730.4 361.1L734.9 371.6L745.3 372.7L748.9 370.6L739.6 362.8L747.8 356.7ZM744.2 324.5L718.6 326.3L705.3 331.4L708.1 334.6L715.7 331.5L720 341.3L727.1 337.3L726.1 328.3L730.3 327L732.6 335.9L740.6 340.3L746.2 336.5L740.1 329.4L743.5 325.9ZM757.4 324.5L761.2 328.9L754.9 337.3L756.9 339L767.3 337.8L772.9 327.6L773.8 336.5L781.5 340.5L785.1 331.5L793.1 334.7L796.8 330.9L760.3 324.5ZM750.9 273.2L738.4 276.7L724.4 288.8L721.7 292.8L725.2 305.7L730.3 302.8L730 291.9L736 302.7L746.9 302.3L740.5 293.8L748.9 289.8L750 278.4L752 289.5L761 293.8L754.3 302L763.3 303.9L770.7 292.2L770.8 302.1L777.8 306L778.3 290.8L765.8 278.3L753.2 273.4Z");
  bag.cut("va-ffcc20", "M756.3 482.6L739.5 498.6L702.8 517.9L686.1 537.4L702.1 555.3L713.1 554.6L723 549L771.1 498.2L757.1 484.4Z");
  bag.cut("va-bdbec0", "M675.8 542.5L695.7 566.8L694.3 572.8L686.4 572L666.4 547.8L667.9 541.6L673.9 541.1Z");
  bag.cut("va-ffcc20", "M779.9 472.1L767.8 479.3L770.9 463.5L763.5 459.1L764.3 467.8L757.1 484.4L771 498.2L782.5 490.6L792.6 493.7L794.8 489.7L789.5 484.1L777 487.8L785.7 476.1L781.8 471.1Z");
  bag.cut("va-ffcc20", "M642.3 545.1L624.8 548.3L609.5 557.9L599.6 571.4L594.9 589.3L597.5 607.7L605.9 622.4L621 634.2L639 638.9L657.4 636.3L672 627.8L683.8 612.7L688.5 594.8L685.9 576.4L677.5 561.7L663.7 550.6L644.5 545.2ZM642.4 570.6L654.3 563.8L667.6 570L670.4 581.3L664.6 591.5L670.6 602.2L669.1 613.1L655.5 621.2L642.1 612.5L628.5 619.6L614.7 612L613.4 600L619.2 591.7L613.7 582.9L615.9 570.9L627.1 563.4L641.7 569.4Z");
  bag.cut("va-ffcc20", "M614.3 545.8L618.9 546.1L619 550L608.3 559.2L603.7 558.9L604.1 554.4Z");
  bag.cut("va-a88d37", "M677.5 561.7L685.9 576.4L688.6 592.4L685.7 608.4L677.3 622.7L661.8 634.5L641.3 639L621 634.2L605.9 622.4L614.5 632.9L630.1 643.1L646.7 646L665.2 642L681.2 632L690.7 614.8L693.2 595.6L689.2 578L680.1 564.3Z");
  bag.cut("va-a88d37", "M676.9 578.9L670.7 591.5L676.8 604.5L677.6 580.8ZM654.5 554.3L632.5 553.1L628.4 555L641.5 560.9L652.5 554.9ZM607.5 579.2L604.2 592.7L607.2 604.7L614.3 592L607.8 581.6ZM654.9 628L642.9 620.3L629.4 627.1L653 628.6Z");
  bag.draw("va-ffcc20", "M605.5 631.2L606.4 632.5L606.9 633.8L607.1 635.3L607 636.8L606.5 638.2L605.8 639.4L604.8 640.5L603.5 641.3L602.2 641.9L600.7 642.1L599.2 641.9L597.8 641.5L596.6 640.8L595.5 639.7L594.7 638.5L594.1 637.1L593.9 635.7L594.1 634.2L594.5 632.8L595.2 631.5L596.3 630.5L597.5 629.6L598.9 629.1L600.3 628.9L601.8 629L603.2 629.5L604.5 630.2Z");
  bag.cut("black", "M606.5 630.4L607.5 631.9L608.1 633.5L608.4 635.3L608.2 637L607.7 638.7L606.8 640.2L605.6 641.5L604.1 642.5L602.5 643.1L600.7 643.4L599 643.2L597.3 642.7L595.8 641.8L594.5 640.6L593.5 639.1L592.9 637.5L592.6 635.7L592.8 634L593.3 632.3L594.2 630.8L595.4 629.5L596.9 628.5L598.5 627.9L600.3 627.6L602 627.8L603.7 628.3L605.2 629.2ZM604.5 630.2L603.2 629.5L601.8 629L600.3 628.9L598.9 629.1L597.5 629.6L596.3 630.5L595.2 631.5L594.5 632.8L594.1 634.2L593.9 635.7L594.1 637.1L594.7 638.5L595.5 639.7L596.6 640.8L597.8 641.5L599.2 641.9L600.7 642.1L602.2 641.9L603.5 641.3L604.8 640.5L605.8 639.4L606.5 638.2L607 636.8L607.1 635.3L606.9 633.8L606.4 632.5L605.5 631.2Z");
  bag.cut("va-ffcc20", "M601.2 625.6L601.5 621L605.4 620.8L614.7 631.5L614.5 636.1L609.9 635.7Z");
  bag.draw("va-ffcc20", "M682.2 632.1L683.4 631.3L684.8 630.7L686.3 630.5L687.7 630.6L689.2 631.1L690.4 631.8L691.5 632.8L692.3 634.1L692.8 635.4L693 636.9L692.9 638.4L692.5 639.8L691.7 641.1L690.7 642.1L689.5 642.9L688.1 643.5L686.7 643.7L685.2 643.6L683.8 643.1L682.5 642.4L681.4 641.4L680.6 640.1L680.1 638.8L679.9 637.3L680 635.8L680.5 634.4L681.2 633.1Z");
  bag.cut("black", "M681.4 631.1L682.8 630.1L684.5 629.5L686.2 629.2L688 629.4L689.7 629.9L691.2 630.8L692.5 632L693.5 633.5L694.1 635.1L694.3 636.9L694.2 638.6L693.7 640.3L692.8 641.8L691.6 643.1L690.1 644.1L688.4 644.7L686.7 645L684.9 644.8L683.3 644.3L681.7 643.4L680.5 642.2L679.5 640.7L678.8 639.1L678.6 637.3L678.7 635.6L679.3 633.9L680.2 632.4ZM681.2 633.1L680.5 634.4L680 635.8L679.9 637.3L680.1 638.8L680.6 640.1L681.4 641.4L682.5 642.4L683.8 643.1L685.2 643.6L686.7 643.7L688.1 643.5L689.5 642.9L690.7 642.1L691.7 641.1L692.5 639.8L692.9 638.4L693 636.9L692.8 635.4L692.3 634.1L691.5 632.8L690.4 631.8L689.2 631.1L687.7 630.6L686.3 630.5L684.8 630.7L683.4 631.3L682.2 632.1Z");
  bag.cut("va-ffcc20", "M676 637.2L671.4 637L671.7 632.4L683 622.7L685.8 628.2Z");
  bag.cut("va-ffcc20", "M642.4 570.9L649 578.7L641.2 585.3L634.6 578.6L641.3 570.9Z");
  bag.cut("va-ffcc20", "M658.1 584.7L664.7 592.5L656.9 599.1L650.2 592.4L656.9 584.7Z");
  bag.cut("va-ffcc20", "M642.8 598L649.4 605.8L641.6 612.4L635 605.7L641.7 598Z");
  bag.cut("va-ffcc20", "M626.6 585L633.2 592.8L625.4 599.4L618.8 592.7L625.5 585Z");
  bag.cut("va-a88d37", "M719.1 523.4L711.9 534.7L700.7 539.6L697.3 536.3L700.9 528.4L717.2 523.1Z");
  bag.draw("va-ffcc20", "M772.7 464.3L770.4 471.8L777.4 475.4L784.9 471.9L781.4 479.9L783.5 484.4L793.2 486.1L787.9 473.5L775 464.6Z");
  bag.draw("va-a88d37", "M767.8 479.3L777.1 476.1L770.4 471.8L768.5 477.9ZM781.4 479.9L777 487.8L783.5 484.4L782.6 481.5Z");
  bag.cut("va-ffcc20", "M577.5 356.7L576.8 364.7L584.6 367.3L589.4 361.7L588.4 357.4L579.1 355.3Z");
  bag.cut("va-bdbec0", "M586 364.2L584.7 371.3L589 376.1L598.6 364L593.3 361L587.5 362.8Z");
  bag.cut("va-ffcc20", "M592.6 369L588.7 379.2L593.7 382.5L596 371.9L606 367.4L603.3 362.7L594.6 366.9Z");
  bag.cut("va-bdbec0", "M782.4 523.4L796.6 524.9L804.1 534.4L802 539.1L796.6 539.1L782.7 524.7Z");
  bag.cut("va-bdbec0", "M744.5 483.2L730.4 499.5L749.9 516.2L773.2 544.5L786.4 553.7L799.5 555.3L815.5 537.4L796.7 516.3L762 498.6Z");
  bag.cut("va-bdbec0", "M686.4 460.7L709.6 480.2L723 465.8L697.5 444.7L688.9 449.4L685.9 459.7Z");
  bag.cut("va-bdbec0", "M675.7 451.7L681.5 456.7L685.3 446.6L693.2 440.6L678.9 428.6L676 449.6Z");
  bag.cut("va-ffcc20", "M682.2 460.2L686.1 460.2L690.5 447.7L698.6 445L697.7 440.5L685.3 446.6L681.7 459.6Z");
  bag.cut("va-ffcc20", "M815.6 537.1L799.5 555.5L800.9 561.9L809.1 562L824.7 542.9L823.6 536.4L817 536.2Z");
  bag.cut("va-ffcc20", "M825.7 542.4L805.9 566.8L807.3 572.8L815.2 571.9L835.2 547.7L833.6 541.5L827.7 541Z");
  bag.cut("va-bdbec0", "M722.2 473.8L733.9 480.8L730.6 466L737.5 460.9L737.1 470.1L743.6 484.8L730.4 499.5L717.3 491.8L709.3 495.3L707.2 491.1L710.6 486L725.1 489.8L716.4 477.8L720.3 472.8Z");
  bag.cut("va-bdbec0", "M859.3 545L876.8 548.1L892 557.7L902 571.2L906.7 589.1L904.2 607.5L895.8 622.2L880.6 634L862.7 638.7L844.3 636.2L829.6 627.8L817.8 612.6L813.1 594.7L815.6 576.3L824.1 561.6L837.9 550.5L857 545.1ZM859.2 570.5L847.2 563.7L834 569.9L831.2 581.2L837 591.3L831 602.1L832.6 613L846.1 621.1L859.5 612.3L873.1 619.4L886.9 611.9L888.2 599.8L882.4 591.5L888 582.8L885.7 570.7L874.5 563.2L859.9 569.2Z");
  bag.draw("va-bdbec0", "M891.9 549.1L893.2 550L894.5 550.5L896 550.7L897.5 550.6L898.9 550.1L900.1 549.4L901.2 548.4L902 547.1L902.5 545.8L902.8 544.3L902.6 542.8L902.2 541.4L901.4 540.2L900.4 539.1L899.2 538.3L897.8 537.7L896.4 537.5L894.9 537.7L893.5 538.1L892.2 538.9L891.1 539.9L890.3 541.1L889.8 542.5L889.6 543.9L889.7 545.4L890.2 546.8L890.9 548.1Z");
  bag.cut("black", "M891.1 550.1L892.6 551.1L894.2 551.7L896 552L897.7 551.8L899.4 551.3L900.9 550.4L902.2 549.2L903.2 547.7L903.8 546.1L904.1 544.3L903.9 542.6L903.4 540.9L902.5 539.4L901.3 538.1L899.8 537.1L898.1 536.5L896.4 536.2L894.6 536.4L893 536.9L891.4 537.8L890.2 539L889.2 540.5L888.5 542.2L888.3 543.9L888.4 545.7L889 547.3L889.9 548.9ZM890.9 548.1L890.2 546.8L889.7 545.4L889.6 543.9L889.8 542.5L890.3 541.1L891.1 539.9L892.2 538.9L893.5 538.1L894.9 537.7L896.4 537.5L897.8 537.7L899.2 538.3L900.4 539.1L901.4 540.2L902.2 541.4L902.6 542.8L902.8 544.3L902.5 545.8L902 547.1L901.2 548.4L900.1 549.4L898.9 550.1L897.5 550.6L896 550.7L894.5 550.5L893.2 550L891.9 549.1Z");
  bag.cut("va-bdbec0", "M887.2 545.6L882.7 545.9L882.5 549.8L893.3 559.1L897.9 558.7L897.4 554.2Z");
  bag.cut("va-515356", "M824.1 561.6L815.6 576.3L813 592.4L815.9 608.3L824.4 622.6L839.9 634.3L860.4 638.8L880.6 634L895.8 622.2L887.2 632.7L871.6 642.9L854.9 645.9L836.5 641.9L820.5 631.9L811 614.7L808.5 595.6L812.4 578L821.5 564.2Z");
  bag.cut("va-515356", "M824.7 578.8L830.9 591.4L824.8 604.5L824 580.7ZM847.1 554.2L869 553L873.1 554.8L860 560.7L849 554.7ZM894.1 579L897.4 592.5L894.5 604.5L887.4 591.8L893.8 581.4ZM846.8 627.8L858.7 620.1L872.2 626.9L848.7 628.5Z");
  bag.draw("va-bdbec0", "M896.1 631L895.3 632.3L894.8 633.6L894.6 635.1L894.7 636.6L895.1 638L895.9 639.2L896.9 640.3L898.1 641.1L899.5 641.7L901 641.9L902.4 641.7L903.8 641.3L905.1 640.5L906.2 639.5L907 638.3L907.5 636.9L907.7 635.5L907.6 634L907.2 632.6L906.4 631.3L905.4 630.3L904.2 629.4L902.8 628.9L901.3 628.7L899.9 628.8L898.5 629.3L897.2 630Z");
  bag.cut("black", "M895.1 630.2L894.1 631.7L893.5 633.3L893.3 635.1L893.4 636.8L894 638.5L894.8 640L896.1 641.3L897.5 642.3L899.2 642.9L900.9 643.2L902.7 643L904.4 642.5L905.9 641.6L907.2 640.4L908.1 638.9L908.8 637.3L909 635.5L908.9 633.7L908.3 632.1L907.4 630.5L906.2 629.3L904.8 628.3L903.1 627.7L901.4 627.4L899.6 627.6L897.9 628.1L896.4 629ZM897.2 630L898.5 629.3L899.9 628.8L901.3 628.7L902.8 628.9L904.2 629.4L905.4 630.3L906.4 631.3L907.2 632.6L907.6 634L907.7 635.5L907.5 636.9L907 638.3L906.2 639.5L905.1 640.5L903.8 641.3L902.4 641.7L901 641.9L899.5 641.7L898.1 641.1L896.9 640.3L895.9 639.2L895.1 638L894.7 636.6L894.6 635.1L894.8 633.6L895.3 632.3L896.1 631Z");
  bag.cut("va-bdbec0", "M900.5 625.4L900.2 620.8L896.3 620.7L886.9 631.3L887.2 635.9L891.8 635.5Z");
  bag.draw("va-bdbec0", "M819.5 632L818.3 631.2L816.9 630.7L815.4 630.5L814 630.6L812.6 631.1L811.3 631.8L810.2 632.8L809.4 634L808.9 635.4L808.7 636.9L808.8 638.3L809.2 639.8L810 641L811 642.1L812.2 642.9L813.6 643.4L815.1 643.6L816.5 643.5L817.9 643.1L819.2 642.3L820.3 641.3L821.1 640.1L821.6 638.7L821.8 637.2L821.7 635.8L821.2 634.4L820.5 633.1Z");
  bag.cut("black", "M820.3 631L818.9 630.1L817.2 629.4L815.5 629.2L813.7 629.3L812 629.9L810.5 630.8L809.2 632L808.2 633.4L807.6 635.1L807.4 636.8L807.5 638.6L808 640.3L808.9 641.8L810.2 643.1L811.6 644.1L813.3 644.7L815 644.9L816.8 644.8L818.5 644.3L820 643.4L821.3 642.1L822.2 640.7L822.9 639L823.1 637.3L823 635.5L822.4 633.8L821.5 632.3ZM820.5 633.1L821.2 634.4L821.7 635.8L821.8 637.2L821.6 638.7L821.1 640.1L820.3 641.3L819.2 642.3L817.9 643.1L816.5 643.5L815.1 643.6L813.6 643.4L812.2 642.9L811 642.1L810 641L809.2 639.8L808.8 638.3L808.7 636.9L808.9 635.4L809.4 634L810.2 632.8L811.3 631.8L812.6 631.1L814 630.6L815.4 630.5L816.9 630.7L818.3 631.2L819.5 632Z");
  bag.cut("va-bdbec0", "M825.7 637.1L830.3 636.9L830 632.3L818.6 622.6L815.8 628.1Z");
  bag.cut("va-bdbec0", "M602.4 401.1L610.4 407.4L605.4 413.2L598 407.6L587 420.7L593.7 426.2L588.5 432.9L582.3 427.9L576.2 436.8L597.3 454.9L601.7 454L615.1 438.5L603.3 432.9L615.5 417.8L620.8 421.2L618.6 424.4L621.9 428.6L627.6 416.4L643.2 428.9L632.9 431.4L630.7 437.5L644 440.7L630.2 456.7L621.3 444.1L604.8 463L626.2 479.2L630.4 478.9L637.6 472.1L631.2 467.3L637.4 461.2L642.8 465.3L649.5 457.8L650.2 431L616.3 402L604.1 398Z");
  bag.draw("black", "M782.9 522.9L760.8 508L782.1 523.9Z");
  bag.cut("va-bdbec0", "M859.2 570.8L852.6 578.6L860.4 585.2L867 577.4L860.3 570.8Z");
  bag.cut("va-bdbec0", "M843.5 584.6L836.9 592.4L844.8 599L851.4 591.2L844.7 584.6Z");
  bag.cut("va-bdbec0", "M858.8 597.9L852.2 605.7L860 612.3L866.6 604.5L860 597.9Z");
  bag.cut("va-bdbec0", "M875 584.8L868.4 592.7L876.2 599.3L882.8 591.4L876.1 584.8Z");
  bag.cut("va-515356", "M782.4 523.4L789.6 534.7L800.8 539.6L804.2 536.2L800.6 528.4L784.3 523Z");
  bag.draw("va-515356", "M719.4 480.7L716.9 485.8L725.1 489.8L720.7 481.2ZM723.7 475.8L733.9 480.8L730.7 471.4L725.2 474.4Z");
  bag.draw("va-bdbec0", "M714.8 471.9L707.8 488.7L716.9 485.8L719.4 480.7L717 473.8L723.7 475.8L730.7 471.4L731.1 464.2L715.9 470.8Z");
  bag.draw("va-bdbec0", "M606.4 367.6L653.2 407L650.2 431L593.9 382.8L596 371.9L605.5 367.3Z");
  bag.draw("va-ffcc20", "M599.1 379.3L596.9 393.3L637.9 408.4L644.8 426.4L650.2 430.9L646.3 411L652.6 411.6L653.2 407L641.9 403L637.6 393.9L617.7 395L605.1 391L603.7 383.3L613.7 373.7L609.3 370.1L600.5 377.7Z");
  bag.draw("va-515356", "M637.7 473L631.2 467.3L637.4 461.2L642.8 465.3L649.5 457.8L651.5 465.6L642.7 476.4ZM637.6 472.1L637.9 482.6L626.2 489.2L604.8 472.5L604.8 463L626.2 479.2L630.4 478.9ZM602.4 401.1L601.7 410.4L605.3 413.2L610.4 407.4ZM587 420.7L587.5 432.1L593.7 426.2ZM626.1 425.3L626.5 436.4L622.8 440.9L618.7 430.4L614.6 429.5L607.2 436.4L603.3 432.9L615.5 417.8L620.8 421.2L618.6 424.4L621.9 428.6ZM626.2 428.8L632.9 431.4L643.2 428.9L627.6 416.4L626.1 425.3ZM630.7 437.5L630.6 448.7L636.5 449.4L644 440.7L639.7 437.3L635.8 440ZM615.1 438.5L614.9 449.8L602.2 464.2L597.8 464.6L576.4 446.7L576.2 436.8L597.3 454.9L601.7 454Z");
  bag.draw("black", "M596.7 454.9L597.2 464.6L598 454.9Z");
  bag.draw("black", "M601.1 454L601.6 464.2L602.4 454Z");
  bag.draw("black", "M614.8 417.8L614 429.4L616.1 417.9Z");
  bag.draw("black", "M618 424.4L618 430.4L619.3 424.4Z");
  bag.draw("black", "M621.3 428.6L622.1 440.9L622.6 428.5Z");
  bag.draw("black", "M627 416.5L628.5 428.3L628.3 416.3Z");
  bag.draw("black", "M635.1 439.9L634.8 449.2L636.4 440Z");
  bag.draw("black", "M642.2 465.3L642 476.4L643.5 465.3Z");
  bag.draw("black", "M636.7 461.2L636.5 471.8L638 461.2Z");
  bag.draw("black", "M629.8 478.9L629.9 489L631.1 478.8Z");
  bag.draw("black", "M625.5 479.2L625.5 489.2L626.8 479.2Z");
  bag.cut("va-bdbec0", "M923.2 366.3L916.9 367.6L912.2 362.1L913.2 357.8L922.6 355.3L924.9 364Z");
  bag.cut("va-ffcc20", "M908.9 361.3L903.2 364L912.6 376.5L917.1 369.1L910.7 361.6Z");
  bag.cut("va-bdbec0", "M908.7 368.7L912.6 379L907.7 382.3L905.3 371.7L895.3 367.2L898 362.5L906.7 366.7Z");
  bag.cut("va-ffcc20", "M803.8 444.6L777.7 465.5L791.6 479L815.2 459.7L812.6 449.3L805.3 444.8Z");
  bag.cut("va-ffcc20", "M825.9 451.4L819.9 456.6L816.1 446.5L808.2 440.5L823 428.1L825.7 449.3Z");
  bag.cut("va-bdbec0", "M814.9 460.5L812.6 449.3L802.8 444.9L804.7 439.8L817.6 448.9L819.9 458.1L817 460.6Z");
  bag.cut("va-bdbec0", "M685.9 537.2L702.1 555.6L700.7 561.9L692.4 562L676.8 543L677.9 536.5L684.5 536.3Z");
  bag.draw("va-ffcc20", "M609.6 549.3L608.4 550.2L607 550.7L605.5 550.9L604.1 550.8L602.7 550.3L601.4 549.6L600.3 548.6L599.5 547.3L599 546L598.8 544.5L598.9 543L599.3 541.6L600.1 540.4L601.1 539.3L602.3 538.5L603.7 537.9L605.1 537.7L606.6 537.9L608 538.3L609.3 539.1L610.4 540.1L611.2 541.3L611.7 542.7L611.9 544.1L611.8 545.6L611.4 547L610.6 548.3Z");
  bag.cut("black", "M610.4 550.3L609 551.3L607.3 551.9L605.6 552.2L603.8 552.1L602.1 551.5L600.6 550.6L599.3 549.4L598.3 547.9L597.7 546.3L597.5 544.5L597.6 542.8L598.1 541.1L599 539.6L600.2 538.3L601.7 537.3L603.4 536.7L605.1 536.4L606.9 536.6L608.6 537.1L610.1 538L611.4 539.2L612.3 540.7L613 542.3L613.2 544.1L613.1 545.8L612.5 547.5L611.6 549.1ZM610.6 548.3L611.4 547L611.8 545.6L611.9 544.1L611.7 542.7L611.2 541.3L610.4 540.1L609.3 539.1L608 538.3L606.6 537.9L605.1 537.7L603.7 537.9L602.3 538.5L601.1 539.3L600.1 540.4L599.3 541.6L598.9 543L598.8 544.5L599 546L599.5 547.3L600.3 548.6L601.4 549.6L602.7 550.3L604.1 550.8L605.5 550.9L607 550.7L608.4 550.2L609.6 549.3Z");
  bag.cut("va-ffcc20", "M898.9 400.9L891 407.2L896 413L903.4 407.4L914.3 420.5L907.7 425.9L912.9 432.6L919.1 427.6L925.2 436.5L904.1 454.7L899.7 453.8L886.3 438.3L898.1 432.6L885.9 417.6L880.6 421L882.8 424.2L879.4 428.3L873.7 416.2L858.2 428.7L868.5 431.2L870.7 437.3L857.4 440.5L871.2 456.5L879.6 443.9L896.5 462.8L875.3 479L871 478.7L863.8 471.9L870.2 467.1L864 461L858.6 465.1L851.6 457.1L850.9 430.9L885.1 401.8L897.2 397.7Z");
  bag.draw("black", "M719.4 524L741.4 509.1L718.7 522.9Z");
  bag.draw("va-ffcc20", "M894.9 367.4L847.7 407.2L850.9 430.9L907.4 382.6L905.3 371.7L895.8 367Z");
  bag.draw("va-bdbec0", "M902.3 379L904.4 393.1L863.5 408.3L856.5 426.2L850.9 430.9L855 410.8L848.4 411.5L847.7 407.2L859.4 402.8L863.7 393.7L883.6 394.8L896.2 390.8L897.6 383L887.6 373.5L891.9 369.9L900.8 377.4Z");
  bag.draw("va-a88d37", "M863.8 472.8L870.2 467.1L864 461L858.6 465.1L851.6 457.1L850 465.4L858.8 476.2ZM863.8 471.9L863.5 482.5L875.3 489L896.6 472.2L896.5 462.8L875.3 479L871 478.7ZM898.9 400.9L899.7 410.2L896 413L891 407.2ZM914.3 420.5L913.9 431.8L907.7 425.9ZM875.3 425.1L874.9 436.2L878.6 440.6L882.7 430.2L886.8 429.3L894.2 436.2L898.1 432.6L885.9 417.6L880.6 421L882.8 424.2L879.4 428.3ZM875.2 428.6L868.5 431.2L858.2 428.7L873.7 416.2L875.3 425.1ZM870.7 437.3L870.8 448.5L864.9 449.2L857.4 440.5L861.7 437.1L865.6 439.8ZM886.3 438.3L886.5 449.6L899.2 463.9L903.6 464.3L925 446.4L925.2 436.5L904.1 454.7L899.7 453.8Z");
  bag.draw("black", "M903.4 454.6L902.9 464.3L904.7 454.7Z");
  bag.draw("black", "M899 453.7L898.6 463.9L900.3 453.8Z");
  bag.draw("black", "M885.2 417.6L886.1 429.3L886.5 417.5Z");
  bag.draw("black", "M882.1 424.1L882.1 430.2L883.4 424.2Z");
  bag.draw("black", "M878.8 428.3L878 440.6L880.1 428.4Z");
  bag.draw("black", "M873.1 416.1L871.6 428L874.4 416.3Z");
  bag.draw("black", "M864.9 439.8L865.3 449.1L866.2 439.8Z");
  bag.draw("black", "M857.9 465.2L858.1 476.2L859.2 465.1Z");
  bag.draw("black", "M863.4 461L863.7 471.6L864.7 461Z");
  bag.draw("black", "M870.4 478.6L870.3 488.8L871.7 478.7Z");
  bag.draw("black", "M874.6 479L874.6 489L875.9 479Z");
  bag.draw("white", "M679.2 341.6L665 348.8L653.7 443.9L656.9 468.4L672.5 481.7L696.9 480.2L677.7 477.7L670.5 464.1L685.1 355.5L680.8 342Z");
  bag.draw("white", "M664.8 319.7L650.4 325L632.3 342.2L647.7 356.8L674.6 337.9L682 336.8L687.5 340.4L666.8 320.5Z");
  bag.draw("white", "M837.6 320L815.4 338.9L826.5 338.2L853.8 356.6L869 342.2L852.7 325.9L839.5 320.2Z");
  bag.draw("white", "M822.6 340.9L817.5 345.8L816 357.5L831 460.8L823.6 477.5L802.4 480L815 482.4L828.9 481.9L839 477L847.7 454.1L836.5 348.6L823.6 341Z");
  bag.cut("va-ffcc20", "M830.8 454L816.8 348.1L822.8 340.9L850.7 359.5L853.8 356.6L829.6 339.7L817.5 337.3L810.9 355.3L826.2 467.8L823.6 474.7L816.2 479.4L809.9 480.2L799.2 473L795 476.3L806.5 480.8L821.1 478.9L828 472.7L831 459ZM826.5 463L826.5 460.5L814.8 460.5L824.1 463.3ZM781.3 407.6L777.1 409L798.4 448.4L801.5 445.8L782.1 409.4ZM760.1 411.4L755.4 411.6L767.4 444L780.3 463.4L783.9 460.4L771.3 441.4L760.7 413.2Z");
  bag.cut("va-ffcc20", "M629.3 339.4L652.2 361L650.8 365.5L625.9 342.9L627.3 338.7Z");
  bag.cut("va-ffcc20", "M643.9 359.9L630.2 376.9L647.2 363ZM641.5 357.6L627.8 374.2L643.9 359.9ZM638.9 355.2L626.4 371L641.5 357.6ZM636.8 353.2L623.4 368.1L638.9 355.2ZM634.6 351.2L620.6 364.5L636.8 353.2ZM632.5 349.2L619.4 361.7L634.6 351.2ZM630.6 347.4L632.5 349.2L620 358.3L616.3 358.5L617.9 355.1ZM628.7 345.5L613.3 354.7L630.6 347.4ZM627 343.9L613.3 348.3L611.6 351.9L628.7 345.5Z");
  bag.cut("va-ffcc20", "M705.3 476.5L702.3 474L685.1 479.5L676.5 470.7L675.6 452.6L690.6 351.9L683.6 337.2L667.2 342.1L647.7 356.8L650.6 359.5L677.9 341.6L684.7 347.8L671.4 444.9L671.5 469L681.6 479.6L703 477.9ZM741.2 411.2L731.9 437.3L717.4 461L721.1 464.2L738 434.9L743.2 411.4Z");
  bag.cut("va-ffcc20", "M629.2 339.3L632.3 342.2L650.4 324.9L664.8 319.7L648.8 321.8L631.1 337.1Z");
  bag.cut("va-ffcc20", "M660.6 351.9L649.4 438.4L650.6 463L656.8 475.4L667.6 482.9L679.8 484.3L696.9 480.2L670 481L661.2 474.7L655.1 463.5L654.4 434.6L665 348.7L662.1 350.8Z");
  bag.cut("va-ffcc20", "M720.3 407.6L700.1 446.1L703.1 448.7L718.9 421.8L722.3 408.2ZM674.9 460.2L675.1 464L688.6 462.5L675.9 460.4Z");
  bag.cut("va-ffcc20", "M872.7 338.8L849.5 360.7L851.2 365L876.5 342L874.8 338.1Z");
  bag.cut("va-ffcc20", "M858.2 359.3L871.5 377.4L854.9 362.4ZM860.6 357L873.8 374.4L858.2 359.3ZM863.2 354.5L875.5 371.5L860.6 357ZM865.3 352.5L878.7 368.5L863.2 354.5ZM867.5 350.5L881 364.8L865.3 352.5ZM869.5 348.5L883 361.7L867.5 350.5ZM871.5 346.7L869.5 348.5L881.4 358.3L886.1 358.4L883.2 354.7ZM873.4 344.9L888.4 354.7L871.5 346.7ZM875.1 343.3L890.1 351.4L873.4 344.9Z");
  bag.cut("va-ffcc20", "M836.3 392L835.4 397.9L841.1 396.3L842 403.5L836.1 402.9L837.8 409.9L830.6 410.2L831.4 403.2L825.9 404.7L825.1 397.9L830.9 398.9L828.6 392.5Z");
  bag.cut("va-ffcc20", "M779.1 427.5L780.4 433.5L784.2 429.7L787.5 435.6L782.4 437.4L786.6 441.9L780.9 445.8L779.1 438.8L774.9 443L771.8 437.3L776.7 435.5L772.7 431.7Z");
  bag.cut("va-ffcc20", "M843 329.2L846.4 334.1L849.7 328.8L854.4 332.9L849.8 336.7L856.5 340.7L851.8 346.3L846.9 340L843.5 345.3L838.6 340.8L843.3 337.3L838.1 334.3Z");
  bag.cut("va-ffcc20", "M872.1 339.4L869 342.2L850.6 324.5L835.3 320.2L849.7 320.6L870.7 337.8Z");
  bag.cut("va-ffcc20", "M840.7 351.5L851.8 440.2L849.7 466.4L843.3 477.3L833.2 482.9L802.4 480L832.2 481L840.2 475.9L846.1 464.6L847.3 436.4L836.5 348.5Z");
  bag.draw("black", "M824.2 340.5L813.2 341.1L823.8 341.7Z");
  bag.draw("black", "M835 319.6L814.9 338.5L835.7 320.7Z");
  bag.draw("black", "M676.1 342.8L688.7 341.1L675.6 341.6Z");
  bag.draw("black", "M664.5 320.3L688.1 340.1L665.1 319.1Z");
  bag.cut("va-ffcc20", "M659.2 328.9L655.3 333.9L652.1 328.3L647.3 332.3L651.8 336.6L644.8 340.5L649.7 346.2L655 339.9L658.5 345L663.4 341L658.6 337L663.8 334Z");
  bag.cut("va-ffcc20", "M665 391.9L666 397.7L660.9 396.6L660.4 403L665.9 402.9L664 409.9L671.1 410.1L670.8 403.5L676.4 404.3L676.5 397.1L670.8 398.3L672.6 392.6Z");
  bag.cut("va-ffcc20", "M722.3 427.5L721.2 433.7L717.5 430L714.4 435.6L719.4 437.5L715.1 441.9L720.7 445.7L722.8 439.4L726.8 442.9L729.3 437.5L724.1 435.4L728.3 431.2Z");
  bag.cut("va-ffcc21", "M751.1 307.9L720.5 310.4L712.3 312.8L711.2 316.4L756.9 311.8L790.2 317.3L779.7 310.4L754.1 307.9Z");
  bag.cut("va-ffcc21", "M754.3 311.8L716.5 314.7L709.4 317.5L707.6 323.5L747.2 318.6L750.7 313.1L754 318.7L793.2 324L788 316.6L757.4 311.8Z");
  bag.cut("va-ffcc21", "M753.4 342.2L713.8 346.1L707.3 347.7L704.4 353.1L748.2 345.8L796.2 351.4L788.3 346L755.9 342.2Z");
  bag.cut("va-ffcc21", "M750 278.4L748.9 289.8L740.5 293.8L747.1 301.6L742.9 304.6L734.7 301.5L733.9 294.1L730 291.9L730.3 302.8L723.9 305.6L725.2 298L720.5 290.7L708.6 284.5L712.3 312.8L753.7 307.9L788.7 313.8L792.9 284.3L789.4 289.2L780.3 291.1L776.1 299.9L777.8 305.9L771.1 302.8L770.7 292.2L765.7 302.5L758.4 304.5L754.1 301.4L761 293.8L752 289.5L750.8 279.8Z");
  bag.cut("va-ffcc21", "M747.2 244.7L747.7 252.4L739 251.8L739 258.9L747.3 258.4L746.7 266.7L754.4 266.5L753.8 258.1L761.9 259L761.9 251.9L753.7 252.4L754.4 244.7Z");
  bag.draw("black", "M750.9 272.6L735.9 277.4L721 292.8L724.6 298.3L723.3 305.9L730.8 303.2L730.2 292.5L735.6 303.2L745.1 304.6L747.5 302.5L741.1 294L749.3 290.3L749.9 279.1L751.4 289.8L760.4 294L753.7 302.3L763.6 304.5L770.5 292.8L770.1 302.2L778 306.6L780.1 292.3L777.5 288.7L764.2 276.6L750.9 272.6L765.4 278.9L775.1 287.9L778.8 292.6L775.5 299.9L777.5 305.4L771.4 302L773.7 295.2L770.9 291.6L765.3 302L754.8 301.8L761.6 293.6L752.6 289.3L750.1 277.8L748.5 289.3L739.9 293.5L746.3 302.1L736.4 302.2L734 293L729.8 291.3L727.4 295L729.7 302.4L724.4 305.2L725.8 297.8L722.3 292.8L726.1 287.7L738.7 277.3L750.9 273.9Z");
  bag.cut("va-ffcc21", "M750.7 313.1L747.5 325.1L744.4 324.1L740.1 329.4L746.2 336.5L743.6 339.5L733.9 337.4L728.4 326.8L727.4 336.6L718.8 341.6L715.7 331.5L707.1 334.4L703.3 328.4L702 332.6L696.9 331.3L699.2 344.1L707.3 347.7L744.7 342.3L794.3 347.5L795.8 344.4L801.9 344.8L804.9 330.6L800 332.2L798.6 328.2L794.5 334.5L785.1 331.5L782.4 340.4L774.1 337.2L772.9 327.6L767.3 337.8L756.9 339L754.9 337.3L761.2 328.9L757.2 324.1L753.3 325.1L751.6 314.6Z");
  bag.cut("va-ffcc21", "M750.7 345.8L713.2 350L703.3 353.7L702.1 358.2L750.9 347L799.3 357L797.2 351.8L791.9 350.3L753.2 345.8Z");
  bag.cut("va-ffcc21", "M748.8 349.7L719.9 352.1L702.1 358.2L704.4 362.7L747.6 355.8L748.2 350.7ZM753 349.8L754.2 355.6L796.9 363.1L799.3 357L794.4 355.1L756 349.9Z");
  bag.cut("va-ffcc21", "M751.2 381.3L713.4 385.5L707.8 393.7L749.3 386.9L776.2 388.3L793.5 393.4L792.4 387.5L787 385.5L754.1 381.3Z");
  bag.cut("va-ffcc21", "M751.7 386.9L724.9 388.6L707.8 393.7L716.4 397L712.3 402L719 407L752.4 411.6L780.9 407.7L788.5 403.9L785.3 397.5L791.4 397.5L793.5 393.4L754.1 386.9ZM752.4 395L775.6 396.5L784.2 400.9L774.2 405.7L752.2 407.3L717.2 401.2L724.8 396.8L748.3 395Z");
  bag.cut("va-ffcc21", "M750.9 347L748 357.6L739.6 362.8L748.9 370.6L745.3 372.7L734.9 371.6L730 361L725.9 363L727.5 370L722.9 374L717.1 365.8L703 365.9L710.6 383L751 376.2L791.9 383.1L799.8 365.7L793.9 368.6L785.5 366.1L781.3 374.7L774.8 370.7L776.5 364L773.5 361.2L767.5 371.5L756.5 373L752.9 370.6L762.1 362.8L753.8 357.6L751.6 348Z");
  bag.cut("va-ffcc21", "M751 376.2L719.8 379.3L710.6 383L710.1 386.6L753.9 381.3L792.4 387.5L791.9 383.1L783.4 379.6L753.7 376.2Z");
  bag.draw("black", "M794.3 362.5L796.2 367.4L795.5 362.2Z");
  bag.cut("va-ffcc21", "M754.3 266.5L746.9 266.7L744.6 274L756.3 274L755.4 268Z");
  bag.draw("black", "M705.9 362.1L706.2 367.1L707.2 362.1Z");
  bag.draw("va-ffcc21", "M753.8 364.1L753.7 364.7L753.5 365.3L753.2 365.8L752.7 366.3L752.2 366.6L751.6 366.8L751 366.9L750.3 366.8L749.7 366.6L749.2 366.3L748.7 365.8L748.4 365.3L748.2 364.7L748.1 364.1L748.2 363.4L748.4 362.8L748.7 362.3L749.2 361.8L749.7 361.5L750.3 361.3L751 361.2L751.6 361.3L752.2 361.5L752.7 361.8L753.2 362.3L753.5 362.8L753.7 363.4Z");
  bag.cut("black", "M755.1 364.1L755 365L754.7 365.9L754.2 366.7L753.5 367.3L752.8 367.8L751.9 368.1L751 368.2L750 368.1L749.2 367.8L748.4 367.3L747.7 366.7L747.2 365.9L746.9 365L746.8 364.1L746.9 363.1L747.2 362.3L747.7 361.5L748.4 360.8L749.2 360.3L750 360L751 359.9L751.9 360L752.8 360.3L753.5 360.8L754.2 361.5L754.7 362.3L755 363.1ZM753.7 363.4L753.5 362.8L753.2 362.3L752.7 361.8L752.2 361.5L751.6 361.3L751 361.2L750.3 361.3L749.7 361.5L749.2 361.8L748.7 362.3L748.4 362.8L748.2 363.4L748.1 364.1L748.2 364.7L748.4 365.3L748.7 365.8L749.2 366.3L749.7 366.6L750.3 366.8L751 366.9L751.6 366.8L752.2 366.6L752.7 366.3L753.2 365.8L753.5 365.3L753.7 364.7L753.8 364.1Z");
  bag.draw("va-ffcc21", "M710.3 374.5L710.3 375.1L710 375.7L709.7 376.2L709.3 376.7L708.7 377L708.1 377.2L707.5 377.3L706.8 377.2L706.2 377L705.7 376.7L705.3 376.2L704.9 375.7L704.7 375.1L704.6 374.5L704.7 373.8L704.9 373.2L705.3 372.7L705.7 372.2L706.2 371.9L706.8 371.7L707.5 371.6L708.1 371.7L708.7 371.9L709.3 372.2L709.7 372.7L710 373.2L710.3 373.8Z");
  bag.cut("black", "M711.6 374.5L711.5 375.4L711.2 376.2L710.7 377L710.1 377.7L709.3 378.2L708.4 378.5L707.5 378.6L706.6 378.5L705.7 378.2L704.9 377.7L704.2 377L703.7 376.2L703.4 375.4L703.3 374.5L703.4 373.5L703.7 372.7L704.2 371.9L704.9 371.2L705.7 370.7L706.6 370.4L707.5 370.3L708.4 370.4L709.3 370.7L710.1 371.2L710.7 371.9L711.2 372.7L711.5 373.5ZM710.3 373.8L710 373.2L709.7 372.7L709.3 372.2L708.7 371.9L708.1 371.7L707.5 371.6L706.8 371.7L706.2 371.9L705.7 372.2L705.3 372.7L704.9 373.2L704.7 373.8L704.6 374.5L704.7 375.1L704.9 375.7L705.3 376.2L705.7 376.7L706.2 377L706.8 377.2L707.5 377.3L708.1 377.2L708.7 377L709.3 376.7L709.7 376.2L710 375.7L710.3 375.1L710.3 374.5Z");
  bag.draw("va-ffcc21", "M792.4 374.7L792.5 375.3L792.7 375.9L793 376.5L793.5 376.9L794 377.3L794.6 377.5L795.2 377.6L795.9 377.5L796.5 377.3L797 376.9L797.5 376.5L797.8 375.9L798 375.3L798.1 374.7L798 374.1L797.8 373.5L797.5 372.9L797 372.5L796.5 372.1L795.9 371.9L795.2 371.9L794.6 371.9L794 372.1L793.5 372.5L793 372.9L792.7 373.5L792.5 374.1Z");
  bag.cut("black", "M791.1 374.7L791.2 375.6L791.5 376.5L792 377.3L792.7 377.9L793.4 378.4L794.3 378.7L795.2 378.9L796.2 378.7L797 378.4L797.8 377.9L798.5 377.3L799 376.5L799.3 375.6L799.4 374.7L799.3 373.8L799 372.9L798.5 372.1L797.8 371.5L797 371L796.2 370.7L795.2 370.6L794.3 370.7L793.4 371L792.7 371.5L792 372.1L791.5 372.9L791.2 373.8ZM792.5 374.1L792.7 373.5L793 372.9L793.5 372.5L794 372.1L794.6 371.9L795.2 371.9L795.9 371.9L796.5 372.1L797 372.5L797.5 372.9L797.8 373.5L798 374.1L798.1 374.7L798 375.3L797.8 375.9L797.5 376.5L797 376.9L796.5 377.3L795.9 377.5L795.2 377.6L794.6 377.5L794 377.3L793.5 376.9L793 376.5L792.7 375.9L792.5 375.3L792.4 374.7Z");
  bag.draw("va-ffcc21", "M709 340L708.9 340.6L708.7 341.2L708.4 341.7L707.9 342.2L707.4 342.5L706.8 342.7L706.2 342.8L705.5 342.7L704.9 342.5L704.4 342.2L703.9 341.7L703.6 341.2L703.4 340.6L703.3 340L703.4 339.3L703.6 338.7L703.9 338.2L704.4 337.7L704.9 337.4L705.5 337.2L706.2 337.1L706.8 337.2L707.4 337.4L707.9 337.7L708.4 338.2L708.7 338.7L708.9 339.3Z");
  bag.cut("black", "M710.3 340L710.2 340.9L709.9 341.7L709.4 342.5L708.8 343.2L708 343.7L707.1 344L706.2 344.1L705.2 344L704.4 343.7L703.6 343.2L702.9 342.5L702.4 341.7L702.1 340.9L702 340L702.1 339L702.4 338.2L702.9 337.4L703.6 336.7L704.4 336.2L705.2 335.9L706.2 335.8L707.1 335.9L708 336.2L708.8 336.7L709.4 337.4L709.9 338.2L710.2 339ZM708.9 339.3L708.7 338.7L708.4 338.2L707.9 337.7L707.4 337.4L706.8 337.2L706.2 337.1L705.5 337.2L704.9 337.4L704.4 337.7L703.9 338.2L703.6 338.7L703.4 339.3L703.3 340L703.4 340.6L703.6 341.2L703.9 341.7L704.4 342.2L704.9 342.5L705.5 342.7L706.2 342.8L706.8 342.7L707.4 342.5L707.9 342.2L708.4 341.7L708.7 341.2L708.9 340.6L709 340Z");
  bag.draw("va-ffcc21", "M753.4 329.8L753.4 330.4L753.1 331L752.8 331.6L752.4 332L751.8 332.4L751.2 332.6L750.6 332.7L749.9 332.6L749.3 332.4L748.8 332L748.4 331.6L748 331L747.8 330.4L747.7 329.8L747.8 329.2L748 328.6L748.4 328L748.8 327.6L749.3 327.2L749.9 327L750.6 327L751.2 327L751.8 327.2L752.4 327.6L752.8 328L753.1 328.6L753.4 329.2Z");
  bag.cut("black", "M754.7 329.8L754.6 330.7L754.3 331.6L753.8 332.4L753.2 333L752.4 333.5L751.5 333.8L750.6 334L749.7 333.8L748.8 333.5L748 333L747.3 332.4L746.8 331.6L746.5 330.7L746.4 329.8L746.5 328.9L746.8 328L747.3 327.2L748 326.6L748.8 326.1L749.7 325.8L750.6 325.7L751.5 325.8L752.4 326.1L753.2 326.6L753.8 327.2L754.3 328L754.6 328.9ZM753.4 329.2L753.1 328.6L752.8 328L752.4 327.6L751.8 327.2L751.2 327L750.6 327L749.9 327L749.3 327.2L748.8 327.6L748.4 328L748 328.6L747.8 329.2L747.7 329.8L747.8 330.4L748 331L748.4 331.6L748.8 332L749.3 332.4L749.9 332.6L750.6 332.7L751.2 332.6L751.8 332.4L752.4 332L752.8 331.6L753.1 331L753.4 330.4L753.4 329.8Z");
  bag.draw("va-ffcc21", "M791.9 339.9L791.9 340.5L792.1 341.1L792.5 341.6L792.9 342.1L793.5 342.4L794.1 342.6L794.7 342.7L795.3 342.6L795.9 342.4L796.5 342.1L796.9 341.6L797.3 341.1L797.5 340.5L797.6 339.9L797.5 339.2L797.3 338.6L796.9 338.1L796.5 337.6L795.9 337.3L795.3 337.1L794.7 337L794.1 337.1L793.5 337.3L792.9 337.6L792.5 338.1L792.1 338.6L791.9 339.2Z");
  bag.cut("black", "M790.6 339.9L790.7 340.8L791 341.7L791.5 342.5L792.1 343.1L792.9 343.6L793.8 343.9L794.7 344L795.6 343.9L796.5 343.6L797.3 343.1L797.9 342.5L798.4 341.7L798.7 340.8L798.9 339.9L798.7 338.9L798.4 338.1L797.9 337.3L797.3 336.6L796.5 336.1L795.6 335.8L794.7 335.7L793.8 335.8L792.9 336.1L792.1 336.6L791.5 337.3L791 338.1L790.7 338.9ZM791.9 339.2L792.1 338.6L792.5 338.1L792.9 337.6L793.5 337.3L794.1 337.1L794.7 337L795.3 337.1L795.9 337.3L796.5 337.6L796.9 338.1L797.3 338.6L797.5 339.2L797.6 339.9L797.5 340.5L797.3 341.1L796.9 341.6L796.5 342.1L795.9 342.4L795.3 342.6L794.7 342.7L794.1 342.6L793.5 342.4L792.9 342.1L792.5 341.6L792.1 341.1L791.9 340.5L791.9 339.9Z");
  bag.draw("va-ffcc21", "M728.1 319.1L707.7 323.5L705.3 331.4L721.1 325.9L747.5 325.1L747.3 318.6L729.3 319ZM754 318.7L753.3 325.1L779 325.7L796.8 330.9L793.3 324L786.8 321.9L756.7 318.7Z");
  bag.draw("va-ffcc21", "M715.2 300.7L715.2 301.4L715 302L714.6 302.5L714.2 302.9L713.6 303.3L713 303.5L712.4 303.6L711.8 303.5L711.2 303.3L710.6 302.9L710.2 302.5L709.8 302L709.6 301.4L709.5 300.7L709.6 300.1L709.8 299.5L710.2 298.9L710.6 298.5L711.2 298.2L711.8 297.9L712.4 297.9L713 297.9L713.6 298.2L714.2 298.5L714.6 298.9L715 299.5L715.2 300.1Z");
  bag.cut("black", "M716.5 300.7L716.4 301.6L716.1 302.5L715.6 303.3L715 304L714.2 304.5L713.3 304.8L712.4 304.9L711.5 304.8L710.6 304.5L709.8 304L709.2 303.3L708.7 302.5L708.4 301.6L708.2 300.7L708.4 299.8L708.7 298.9L709.2 298.1L709.8 297.5L710.6 297L711.5 296.7L712.4 296.6L713.3 296.7L714.2 297L715 297.5L715.6 298.1L716.1 298.9L716.4 299.8ZM715.2 300.1L715 299.5L714.6 298.9L714.2 298.5L713.6 298.2L713 297.9L712.4 297.9L711.8 297.9L711.2 298.2L710.6 298.5L710.2 298.9L709.8 299.5L709.6 300.1L709.5 300.7L709.6 301.4L709.8 302L710.2 302.5L710.6 302.9L711.2 303.3L711.8 303.5L712.4 303.6L713 303.5L713.6 303.3L714.2 302.9L714.6 302.5L715 302L715.2 301.4L715.2 300.7Z");
  bag.draw("va-ffcc21", "M753.6 295L753.5 295.7L753.3 296.3L752.9 296.8L752.5 297.2L752 297.6L751.4 297.8L750.7 297.9L750.1 297.8L749.5 297.6L748.9 297.2L748.5 296.8L748.2 296.3L747.9 295.7L747.9 295L747.9 294.4L748.2 293.8L748.5 293.2L748.9 292.8L749.5 292.5L750.1 292.2L750.7 292.2L751.4 292.2L752 292.5L752.5 292.8L752.9 293.2L753.3 293.8L753.5 294.4Z");
  bag.cut("black", "M754.9 295L754.8 295.9L754.5 296.8L754 297.6L753.3 298.3L752.5 298.8L751.6 299.1L750.7 299.2L749.8 299.1L748.9 298.8L748.1 298.3L747.5 297.6L747 296.8L746.7 295.9L746.6 295L746.7 294.1L747 293.2L747.5 292.4L748.1 291.8L748.9 291.3L749.8 291L750.7 290.9L751.6 291L752.5 291.3L753.3 291.8L754 292.4L754.5 293.2L754.8 294.1ZM753.5 294.4L753.3 293.8L752.9 293.2L752.5 292.8L752 292.5L751.4 292.2L750.7 292.2L750.1 292.2L749.5 292.5L748.9 292.8L748.5 293.2L748.2 293.8L747.9 294.4L747.9 295L747.9 295.7L748.2 296.3L748.5 296.8L748.9 297.2L749.5 297.6L750.1 297.8L750.7 297.9L751.4 297.8L752 297.6L752.5 297.2L752.9 296.8L753.3 296.3L753.5 295.7L753.6 295Z");
  bag.draw("va-ffcc21", "M786.4 300.9L786.5 301.5L786.7 302.1L787 302.6L787.5 303.1L788 303.4L788.6 303.6L789.2 303.7L789.9 303.6L790.5 303.4L791 303.1L791.5 302.6L791.8 302.1L792 301.5L792.1 300.9L792 300.2L791.8 299.6L791.5 299.1L791 298.6L790.5 298.3L789.9 298.1L789.2 298L788.6 298.1L788 298.3L787.5 298.6L787 299.1L786.7 299.6L786.5 300.2Z");
  bag.cut("black", "M785.1 300.9L785.2 301.8L785.5 302.7L786 303.4L786.7 304.1L787.4 304.6L788.3 304.9L789.2 305L790.2 304.9L791 304.6L791.8 304.1L792.5 303.4L793 302.7L793.3 301.8L793.4 300.9L793.3 299.9L793 299.1L792.5 298.3L791.8 297.6L791 297.1L790.2 296.8L789.2 296.7L788.3 296.8L787.4 297.1L786.7 297.6L786 298.3L785.5 299.1L785.2 299.9ZM786.5 300.2L786.7 299.6L787 299.1L787.5 298.6L788 298.3L788.6 298.1L789.2 298L789.9 298.1L790.5 298.3L791 298.6L791.5 299.1L791.8 299.6L792 300.2L792.1 300.9L792 301.5L791.8 302.1L791.5 302.6L791 303.1L790.5 303.4L789.9 303.6L789.2 303.7L788.6 303.6L788 303.4L787.5 303.1L787 302.6L786.7 302.1L786.5 301.5L786.4 300.9Z");
  bag.draw("va-c9252c", "M761.6 665L759.6 667.8L761.6 665.1Z");
  bag.draw("va-c9252c", "M754.6 482.5L752.1 490.2L756.1 489.5L755.4 482.7Z");
  bag.draw("va-c9252c", "M765.7 500.4L769.7 508.1L773.7 507.3L774.1 502.4L768.1 502.2Z");
  bag.draw("va-c9252c", "M752.7 694.6L744.8 703.7L751.8 703L753.5 695.8Z");
  bag.draw("va-c9252c", "M749.2 482.5L744.4 488.9L748.2 490.3L751.4 482.9Z");
  bag.cut("va-c9252c", "M761.2 710.7L753.1 713.4L756.2 725.4L762.4 734.2L765.3 748.5L777.3 752.1L774.5 723.5L763.7 711Z");
  bag.draw("black", "M768.9 748.4L766.6 728.1L767.4 748.5Z");
  bag.cut("va-c9252c", "M761 698.5L753.7 698.5L753.1 713.3L766.2 711.9L762.2 699.9Z");
  bag.draw("black", "M772.8 748.8L771.9 731.9L771.3 748.8Z");
  bag.cut("va-c9252c", "M765.3 748.5L765.7 756.3L777.4 751.9L767.8 748.6Z");
  bag.cut("va-c9252c", "M741.7 490L737.6 500.5L744 500.9L748.2 490.3L743.8 488.9Z");
  bag.cut("va-c9252c", "M745 711.2L740.1 725.4L756.2 725.4L752 711.5L745 711.2Z");
  bag.cut("va-c9252c", "M747.8 723.1L739.2 726L734.1 733.2L730.9 764.9L748.7 760.7L765.6 764.3L762.9 735.5L757.5 726.5L750.7 723.2Z");
  bag.cut("va-c9252c", "M765.6 764.7L748.6 768.9L730.9 764.7L748.7 760.7L765.3 764Z");
  bag.draw("black", "M741.3 761L741.2 740L739.8 761Z");
  bag.draw("black", "M736 761.9L735.4 745.2L734.5 761.9Z");
  bag.draw("va-c9252c", "M733.7 493.5L729.8 502.8L737.5 500.6L741.4 490.8L735.5 491.8Z");
  bag.draw("va-c9252c", "M724.6 497.9L717.4 500.4L716.3 508.8L724.1 499.1Z");
  bag.draw("va-c9252c", "M752.3 490.5L756.3 499.2L765.8 500.5L759.9 491.6L752.6 489.3Z");
  bag.draw("va-c9252c", "M765.4 499.8L773.8 503.5L769.8 495.1L759.9 490.5L764.5 498.5Z");
  bag.draw("va-c9252c", "M773.9 502.2L780.8 506.1L775.4 495.9L770.2 493.5L772.9 500.3Z");
  bag.draw("va-c9252c", "M745.7 499.4L756 498.5L750.3 489.1L746.1 498.1Z");
  bag.draw("va-c9252c", "M755.4 499.6L745.6 499.7L745.1 506.3L746.9 508.5L755.4 500.8Z");
  bag.draw("va-c9252c", "M747.3 508.2L747.3 516.9L755.5 505.8L754.4 502.5L748.3 507.4Z");
  bag.draw("va-c9252c", "M747.5 516.6L748.1 525.4L755.7 514.3L753.8 511.5L748.4 515.9Z");
  bag.draw("va-c9252c", "M748.6 525L748 534.3L754.8 525.2L754 520.4L750 523.8Z");
  bag.draw("va-c9252c", "M748.1 543L754.7 535.7L753 529.9L747.5 534.7L746.3 543.3Z");
  bag.draw("va-c9252c", "M748.1 543.1L746.3 552.3L753.1 547.6L753.2 538.3Z");
  bag.draw("va-c9252c", "M748.1 551.8L747.3 560.8L754.4 553.4L754.4 547.7L749.4 550.7Z");
  bag.draw("va-c9252c", "M747.5 569.2L754 562.5L754.2 555.7L746.2 561.5L746 569.1Z");
  bag.draw("va-c9252c", "M748.3 568.4L745.3 576.4L749 576.4L754.9 566.6L754.6 564.1L749.4 567.4Z");
  bag.draw("va-c9252c", "M747.5 577.7L746.1 586.5L753.1 581.1L754.4 572.7L748.9 576.4Z");
  bag.draw("va-c9252c", "M747.7 586L746.3 594.5L752.6 589.7L754.2 580.9L749 584.7Z");
  bag.draw("va-c9252c", "M747.8 594L745.9 602.5L753 597.5L754.1 589.5L749 592.9Z");
  bag.draw("va-c9252c", "M747.1 602L747.2 609.6L753.8 603L752.7 597.7Z");
  bag.draw("va-c9252c", "M747.9 608.9L745.3 617.4L748.6 616L754.6 607.3L750.2 607.1Z");
  bag.draw("va-c9252c", "M747.2 617.2L745.5 624.9L752.7 620.3L754 612.8L748.5 616.1Z");
  bag.draw("va-c9252c", "M747.3 624.6L745.6 632.1L752.2 628L754 620.4L748.7 623.5Z");
  bag.draw("va-c9252c", "M747.5 631.8L744.9 636.5L747.3 639.2L753.7 632.5L753.7 627.7L748.7 630.8Z");
  bag.draw("va-c9252c", "M747.2 639.4L747.3 647.6L754.3 636.7L752.5 634.7L748.6 638.2Z");
  bag.draw("va-c9252c", "M747.3 647.4L745.4 654.9L751.9 650.2L752.5 642.2Z");
  bag.draw("va-c9252c", "M747.2 654.5L745.4 662.7L752.6 657.7L751.9 650.1Z");
  bag.draw("va-c9252c", "M746.7 662.2L746.7 669.5L753.4 663.1L752.2 658Z");
  bag.draw("va-c9252c", "M747.5 668.8L744.6 674.4L747.6 675.9L753 670.3L752 665.4Z");
  bag.draw("va-c9252c", "M746.7 684.4L752.2 680L753.1 672.7L746.2 676.9L745.3 684.3Z");
  bag.draw("va-c9252c", "M746.7 684.3L745.2 691.9L751.8 687.9L752.1 680.1Z");
  bag.cut("va-c9252c", "M757.4 689.2L752 694.9L756.7 699.9L762.6 695.5L758.3 689.3Z");
  bag.draw("va-c9252c", "M747 691.6L744.5 696.3L746.9 699.2L753.4 692.6L751.9 687.8Z");
  bag.draw("va-c9252c", "M755.3 533.7L754.7 543.1L756.6 534.7Z");
  bag.draw("va-c9252c", "M756.6 541.8L754.6 552L757.3 542.6Z");
  bag.draw("va-c9252c", "M756.8 550.6L754.2 561.6L757.8 551.4Z");
  bag.draw("va-c9252c", "M758 559L752.6 564.6L754.1 570.4L758.6 559.8Z");
  bag.draw("va-c9252c", "M757.5 567.9L752.8 572.8L754 579.4L758.4 568.7Z");
  bag.draw("va-c9252c", "M757.7 576.7L752.9 581.2L753.7 587.8L758.7 577.4Z");
  bag.draw("va-c9252c", "M757.9 584.7L752.7 589.6L754 595.7L758.7 585.7Z");
  bag.draw("va-c9252c", "M758.5 591.9L752.8 597.6L753 604.7L759.5 593Z");
  bag.draw("va-c9252c", "M759.4 599.3L752.3 605.5L752.9 612.3L760.4 600.2Z");
  bag.draw("va-c9252c", "M759.2 607.1L752.5 612.9L753.4 619.3L760.1 608Z");
  bag.draw("va-c9252c", "M759.2 614.7L752.6 620.4L752.8 627.3L758.3 623.1L760.1 615.7Z");
  bag.draw("va-c9252c", "M759.4 622.5L752.3 627.9L753 634.2L760.2 623.4Z");
  bag.draw("va-c9252c", "M759.1 630.3L753 634.3L752.6 642.1L760.2 636.1L760.4 631.2Z");
  bag.draw("va-c9252c", "M760.2 637.4L753.6 641.9L751.9 650.1L758.9 645.6L761.1 638Z");
  bag.draw("va-c9252c", "M761 644L753.1 649.7L752.6 657.7L759.6 652.4L761.7 645.1Z");
  bag.draw("va-c9252c", "M760.4 652.2L752.4 657.9L751.8 665.5L759.5 660.2L761.4 653.1Z");
  bag.draw("va-c9252c", "M761.2 659L753.1 664.9L751.9 672.1L760.2 667.3L762.1 659.9Z");
  bag.draw("va-c9252c", "M761.1 666.9L751.5 672.6L753.1 678.5L759.9 675.1L761.8 667.9Z");
  bag.draw("va-c9252c", "M759.8 675.2L752.1 680.1L753.9 686L761.5 681.8L761.1 675.3Z");
  bag.draw("va-c9252c", "M761.5 681.8L751.9 687.8L761.5 691.2L762.4 684.1Z");
  bag.draw("va-c9252c", "M762.5 508.2L767.8 513.5L769.7 508.1L765.4 502.6L762.3 505.2Z");
  bag.draw("va-c9252c", "M761.4 507.3L758.3 512.8L762.1 518.8L766.2 515L762 507.4Z");
  bag.draw("va-c9252c", "M757.7 512.5L755.1 518.2L758.7 523.3L762.6 521.7L758.2 512.7Z");
  bag.draw("va-c9252c", "M754.4 527.3L755 533.5L755.7 528.9Z");
  bag.draw("va-c9252c", "M745.3 516.7L742.2 512.2L738.7 518.9L742 522.5Z");
  bag.draw("va-c9252c", "M742.1 512.4L740.7 507.4L738.4 508.4L735 517.6L738.8 518.7Z");
  bag.draw("va-c9252c", "M738.4 508.4L735 504.6L731.1 512L735.1 514.9Z");
  bag.draw("va-c9252c", "M734.3 502.6L729.9 502.8L727.3 510.8L731.2 511.8L735 503.7Z");
  bag.draw("va-c9252c", "M723.5 506.4L727.1 508L729.8 502.8L725.3 505.4Z");
  bag.draw("va-c9252c", "M755.3 518.7L754.4 527.3L756.1 529.9L759.2 525.7L755.6 519.6Z");
  bag.draw("va-c9252c", "M762.2 532.5L760.9 527L756.4 529.6L760.2 535.4Z");
  bag.draw("va-c9252c", "M765.4 537.7L763.7 531.7L760.2 535.3L763.6 540.6Z");
  bag.draw("va-c9252c", "M768.6 542.8L765.4 537.7L763.1 542.9L766.7 545.7Z");
  bag.draw("va-c9252c", "M772.6 546.5L770.8 541.5L766.6 545.9L769.9 551.2Z");
  bag.draw("va-c9252c", "M775.4 552.6L774.1 545.5L769.9 551.2L772.8 557.2Z");
  bag.draw("va-c9252c", "M778.6 558.4L778.5 553.2L775.4 552.6L772.3 559.4L776 562.5Z");
  bag.draw("va-c9252c", "M738.4 530.6L742 524.6L745.4 529.8L741.3 535Z");
  bag.draw("va-c9252c", "M745.9 516L742 524.6L746.3 529.5L746.4 517Z");
  bag.draw("va-c9252c", "M738.5 530.7L734.6 532.3L738.3 540.6L741.2 534.8Z");
  bag.draw("va-c9252c", "M735.6 536.3L731.9 537.6L734.9 545.8L738.1 540.4Z");
  bag.draw("va-c9252c", "M732.3 541.3L728.6 542.9L731.4 550.9L734.6 550.2L734.6 545.3Z");
  bag.draw("va-c9252c", "M729.5 547.6L725.2 549.5L728.1 556.5L731.2 556.1L731.2 550.6Z");
  bag.draw("va-c9252c", "M726 552.6L723 558.4L727.1 563.3L728.2 556.5Z");
  bag.draw("va-c9252c", "M723 558.3L719.9 558.3L719.8 563.4L724.1 568.6L725.2 562.1Z");
  bag.draw("va-c9252c", "M720.1 563.8L716 564L716.8 568.6L721 573.4L722.3 567.2Z");
  bag.draw("va-c9252c", "M716.8 568.5L712.4 569.4L715.7 577.1L719 576.7L719 571.6Z");
  bag.draw("va-c9252c", "M713.1 573.1L709.9 578.4L714.3 583L715.8 577Z");
  bag.draw("va-c9252c", "M709.9 578.3L706.5 578.3L706.4 583L711.1 587.8L712.2 581.8Z");
  bag.draw("va-c9252c", "M706.7 583.4L702 583.7L704.6 591.1L708.7 591.4L709.1 586.5Z");
  bag.draw("va-c9252c", "M702.3 587L698.3 588.6L701.3 595.9L704.4 596L704.5 590.8Z");
  bag.draw("va-c9252c", "M698.9 591.5L695.6 591.3L694.8 595.9L699 601.3L701.1 595.5Z");
  bag.draw("va-c9252c", "M694.9 595.9L693.1 604.3L696.7 604.6L697.2 600.1Z");
  bag.draw("va-c9252c", "M660.4 618.7L652.6 615.3L649.3 617.7L661 620.7Z");
  bag.draw("va-c9252c", "M658.9 613L655.4 612.5L655.1 615.8L663.3 619.2L659 613Z");
  bag.draw("va-c9252c", "M662.7 609.7L658.5 612.7L666.9 616.1L662.7 609.8Z");
  bag.draw("va-c9252c", "M669.6 607.5L664.5 605.9L662.3 609.5L669.2 612.9L670.3 608.2Z");
  bag.draw("va-c9252c", "M669 602.7L665.9 604.7L670.4 607.6L669.8 602.8Z");
  bag.draw("va-c9252c", "M650.8 619.4L645.5 620.1L646.5 623.1L655.4 624.4L657.3 622.1L652.6 620Z");
  bag.draw("va-c9252c", "M646.8 623.2L641.6 625L642.5 627.9L651.3 628L652.3 624.5Z");
  bag.draw("va-c9252c", "M642.6 628L638.2 629.6L638.6 633.8L646.9 632.9L647.8 628.7Z");
  bag.draw("va-c9252c", "M636.5 640.2L645.2 636.1L644.5 633.7L636.8 635.1L635 639.9Z");
  bag.draw("va-c9252c", "M637.2 639.9L635.1 643.7L637.6 645.3L645.1 640.4L643.1 637.6Z");
  bag.draw("va-c9252c", "M638.1 645L636.9 649.2L640.6 650.3L647.6 644.4L643.5 642.4Z");
  bag.draw("va-c9252c", "M641.2 649.9L642 653.9L647.3 654.1L651.5 648.1L646.9 646.6Z");
  bag.draw("va-c9252c", "M647.4 653.9L654.8 655.9L657.7 650.7L651.1 650.5Z");
  bag.draw("va-c9252c", "M655.3 655.3L656.9 658.8L661.6 658.5L663.7 652.9L657.6 652.2Z");
  bag.draw("va-c9252c", "M662.1 657.8L666.6 660.5L670.7 655.8L668.9 652.5L663.9 654.8Z");
  bag.draw("va-c9252c", "M668.8 658.7L670.4 662L675.4 660.1L677.3 654L670.8 655.5Z");
  bag.draw("va-c9252c", "M675.7 659.5L680 662L683.7 656.8L681.7 654L677.3 656Z");
  bag.draw("va-c9252c", "M682 660.3L683.7 663.5L687.7 661.8L689.5 655.7L683.7 656.6Z");
  bag.draw("va-c9252c", "M688.1 661.3L694.1 662.8L695.9 656.3L689.7 657.5Z");
  bag.draw("va-c9252c", "M712.2 663.2L716 665.3L719.1 659.7L713.5 659.5Z");
  bag.draw("va-c9252c", "M717.7 663.2L719.3 666.4L722.9 664.5L723.7 657.8L719.1 659.4Z");
  bag.draw("va-c9252c", "M723.2 664L728.7 665.3L729.9 658.7L724.5 660.1Z");
  bag.draw("va-c9252c", "M694.5 662L698.8 664.3L702 658.8L700.1 656.2L695.9 658.4Z");
  bag.draw("va-c9252c", "M700.5 662.4L702.2 665.4L706 663.5L707.5 657.3L702.1 658.6Z");
  bag.draw("va-c9252c", "M706.3 663L711.9 664L713.4 657.4L707.8 659.1Z");
  bag.draw("va-c9252c", "M728.8 665.2L733.6 666.1L735.9 660.5L730.2 660.5Z");
  bag.draw("va-c9252c", "M733.8 665.5L740.1 666.2L741.8 659L735.7 660.8Z");
  bag.draw("va-c9252c", "M744.7 659L740.2 665.8L744.7 667.7L744.7 661.9Z");
  bag.draw("va-c9252c", "M865.3 639.6L856.7 635.4L857.7 632.9L865.4 634.3L866.8 639.3Z");
  bag.draw("va-c9252c", "M864.6 639.3L864.3 645.3L856.8 640.1L858.7 636.9Z");
  bag.draw("va-c9252c", "M863.8 644.9L864.8 649.3L861.5 650.7L854.4 644.5L858.4 642.3Z");
  bag.draw("va-c9252c", "M860.8 650.3L859.9 654L854.7 654.2L850.5 648.1L855.2 646.8Z");
  bag.draw("va-c9252c", "M854.6 654L846.9 656.1L844.1 650.7L850.9 650.5Z");
  bag.draw("va-c9252c", "M846.4 655.4L844.7 659.1L840 658.8L838 653L844.1 652.3Z");
  bag.draw("va-c9252c", "M839.6 657.9L835.1 661L831 656.1L832.7 652.6L837.8 654.9Z");
  bag.draw("va-c9252c", "M832.8 659.1L831.1 662.3L826.3 660.3L824.4 654.1L830.9 655.8Z");
  bag.draw("va-c9252c", "M826 659.8L821.6 662.5L818 657.1L819.9 654.1L824.4 656.1Z");
  bag.draw("va-c9252c", "M819.7 660.7L818.1 663.9L814.2 662.1L812.4 655.7L817.9 656.8Z");
  bag.draw("va-c9252c", "M813.9 661.5L807.8 663.2L806 656.4L812.2 657.6Z");
  bag.draw("va-c9252c", "M790.4 663.4L786.3 665.7L783.3 659.9L785.1 657.1L789 659.6Z");
  bag.draw("va-c9252c", "M784.6 663.6L783 666.8L779.4 664.9L778 658.1L783.2 659.6Z");
  bag.draw("va-c9252c", "M779.1 664.3L775 666.8L771.8 660.8L774 658.1L777.8 660.3Z");
  bag.draw("va-c9252c", "M807.4 662.4L803.3 664.6L800 659L801.9 656.3L806 658.7Z");
  bag.draw("va-c9252c", "M801.5 662.6L799.7 665.6L795.9 663.8L794.5 657.4L800 658.7Z");
  bag.draw("va-c9252c", "M795.6 663.3L790.6 664.2L789.4 657L794.1 659.3Z");
  bag.draw("va-c9252c", "M773.5 665.5L768 666.4L765.8 660.6L771.9 660.7Z");
  bag.draw("va-c9252c", "M762.1 658.5L764.3 668.1L767.8 665.9L763.5 658.7Z");
  bag.draw("va-c9252c", "M778.7 558.3L782 559.4L779.6 567.6L776.4 567.4L776.3 562.2Z");
  bag.draw("va-c9252c", "M781.3 564L785.4 564.5L783.2 572.5L780.1 572.6L779.8 567.2Z");
  bag.draw("va-c9252c", "M785 568.5L788.5 573.5L784.6 579L783.2 572.5Z");
  bag.draw("va-c9252c", "M788.5 573.4L791.6 573.1L792 578.2L788 583.8L786.4 577.7Z");
  bag.draw("va-c9252c", "M791.7 578.7L795.8 579.1L793.3 587.3L790 587.7L789.7 582.2Z");
  bag.draw("va-c9252c", "M793.3 587.3L796.8 591.6L799.7 583.4L798 581.1L793.8 586.4Z");
  bag.draw("va-c9252c", "M796.9 591.4L798.4 597L800.5 595.7L803 587.8L799.7 586.1Z");
  bag.draw("va-c9252c", "M800.7 595.3L804.3 600.4L806.7 592L803 590.8Z");
  bag.draw("va-c9252c", "M808.1 593.9L804.4 600L806.2 604.7L808.3 593.9Z");
  bag.draw("va-c9252c", "M841 618.4L848.6 615.2L851.5 619L839.8 619.6Z");
  bag.draw("va-c9252c", "M842.8 612.8L847.5 613.9L840.6 618.5L836.1 617.5L842.7 612.8Z");
  bag.draw("va-c9252c", "M839 609.9L843.2 612.6L834.9 615.9L838.9 609.9Z");
  bag.draw("va-c9252c", "M832.1 607.6L837.2 605.9L839.4 609.6L832.5 612.9L831.4 608.3Z");
  bag.draw("va-c9252c", "M832.6 602.7L835.7 604.7L831.2 607.7L831.8 602.8Z");
  bag.draw("va-c9252c", "M850.9 619.2L855.9 619.9L855.3 622.8L846.9 624.3L846 620.9Z");
  bag.draw("va-c9252c", "M855 622.9L860.3 624.7L859.4 627.6L851 627.8L850.1 624.4Z");
  bag.draw("va-c9252c", "M859.4 627.7L863.7 629.3L863.4 633.4L855.1 632.7L854.4 628.5Z");
  bag.draw("va-c9252c", "M733.3 493.8L725.4 496.6L722.7 506.7L732.7 494.9Z");
  bag.draw("va-c9252c", "M753.3 707.3L753.2 708.4L752.8 709.3L752.3 710.2L751.6 710.9L750.7 711.5L749.7 711.8L748.7 711.9L747.7 711.8L746.7 711.5L745.9 710.9L745.1 710.2L744.6 709.3L744.2 708.4L744.1 707.3L744.2 706.3L744.6 705.4L745.1 704.5L745.9 703.8L746.7 703.2L747.7 702.9L748.7 702.8L749.7 702.9L750.7 703.2L751.6 703.8L752.3 704.5L752.8 705.4L753.2 706.3Z");
  bag.cut("black", "M754.8 707.3L754.6 708.7L754.2 710L753.5 711.1L752.5 712.1L751.3 712.8L750.1 713.3L748.7 713.4L747.4 713.3L746.1 712.8L744.9 712.1L744 711.1L743.2 710L742.8 708.7L742.6 707.3L742.8 706L743.2 704.7L744 703.5L744.9 702.6L746.1 701.9L747.4 701.4L748.7 701.3L750.1 701.4L751.3 701.9L752.5 702.6L753.5 703.5L754.2 704.7L754.6 706ZM753.2 706.3L752.8 705.4L752.3 704.5L751.6 703.8L750.7 703.2L749.7 702.9L748.7 702.8L747.7 702.9L746.7 703.2L745.9 703.8L745.1 704.5L744.6 705.4L744.2 706.3L744.1 707.3L744.2 708.4L744.6 709.3L745.1 710.2L745.9 710.9L746.7 711.5L747.7 711.8L748.7 711.9L749.7 711.8L750.7 711.5L751.6 710.9L752.3 710.2L752.8 709.3L753.2 708.4L753.3 707.3Z");
  bag.draw("va-c9252c", "M752.7 694.6L744.8 703.7L751.8 703L753.5 695.8Z");
  bag.box(1000, 1000);
  return bag.done("0 0 1000 1000");
}


function doonfMalta() {
  var bag = doonfBag();
  bag.draw("white", "M0 0L1000 0L1000 666.7L0 666.7Z");
  bag.draw("mt-red", "M500 0L1000 0L1000 666.7L500 666.7Z");
  bag.draw("mt-red", "M100.3 41.7L147.6 40.8L146.6 85.6L157.5 91.3L164.4 103.4L209.2 102.4L209.2 147.6L164.4 146.6L158.7 157.5L146.6 164.4L147.6 209.2L102.4 209.2L103.4 164.4L92.5 158.7L85.6 146.6L40.8 147.6L40.8 102.4L85.6 103.4L91.3 92.5L103.4 85.6L103.4 38.6L97.2 38.6L98 82.4L86.6 88.5L82.4 98L85.4 97.2L36.3 98.2L36.3 151.8L85.4 152.8L82.4 152L86.6 161.5L98 167.6L98.2 213.7L151.8 213.7L152.8 164.6L152 167.6L161.5 163.4L167.6 152L213.7 151.8L213.7 98.2L164.6 97.2L167.6 98L163.4 88.5L152 82.4L151.8 36.3L100.3 35.5Z");
  bag.draw("white", "M149.4 85.5L159.5 88.9L164.5 98.5L164.2 153.6L159.5 161.1L151.5 164.5L98.5 164.5L87.6 157.7L85.8 96.4L90.5 88.9L100.6 85.5Z");
  bag.draw("black", "M100.6 39.2L149.1 38.9L149.1 211.1L100.9 211.1L100.3 38.9L100.3 211.2L149.7 211.2L149.7 38.8L100.6 38.6Z");
  bag.draw("black", "M38.9 100.9L211.1 100.9L211.1 149.1L38.9 149.1L38.6 100.6L38.8 149.7L211.2 149.7L211.2 100.3L38.9 100.3Z");
  bag.draw("white", "M100.6 38.9L149.4 38.9L149.4 211.1L100.6 211.1ZM38.9 100.6L211.1 100.6L211.1 149.4L38.9 149.4Z");
  bag.draw("black", "M103.4 42.2L146 41.8L146 208.2L104 208.2L102.8 41.7L102.8 208.5L147.2 208.5L147.2 41.5L103.4 41.1Z");
  bag.draw("black", "M41.7 104L208.2 104L208.2 146L41.8 146L41.1 103.4L41.5 147.2L208.5 147.2L208.5 102.8L41.7 102.8Z");
  bag.draw("white", "M103.4 41.7L146.6 41.7L146.6 208.3L103.4 208.3ZM41.7 103.4L208.3 103.4L208.3 146.6L41.7 146.6Z");
  bag.draw("white", "M163 125L162 133.5L159.2 141.5L154.7 148.7L148.7 154.7L141.5 159.2L133.5 162L125 163L116.5 162L108.5 159.2L101.3 154.7L95.3 148.7L90.8 141.5L88 133.5L87 125L88 116.5L90.8 108.5L95.3 101.3L101.3 95.3L108.5 90.8L116.5 88L125 87L133.5 88L141.5 90.8L148.7 95.3L154.7 101.3L159.2 108.5L162 116.5Z");
  bag.cut("black", "M164.2 125L163.2 133.7L160.3 142L155.6 149.4L149.4 155.6L142 160.3L133.7 163.2L125 164.2L116.3 163.2L108 160.3L100.6 155.6L94.4 149.4L89.7 142L86.8 133.7L85.8 125L86.8 116.3L89.7 108L94.4 100.6L100.6 94.4L108 89.7L116.3 86.8L125 85.8L133.7 86.8L142 89.7L149.4 94.4L155.6 100.6L160.3 108L163.2 116.3ZM162 116.5L159.2 108.5L154.7 101.3L148.7 95.3L141.5 90.8L133.5 88L125 87L116.5 88L108.5 90.8L101.3 95.3L95.3 101.3L90.8 108.5L88 116.5L87 125L88 133.5L90.8 141.5L95.3 148.7L101.3 154.7L108.5 159.2L116.5 162L125 163L133.5 162L141.5 159.2L148.7 154.7L154.7 148.7L159.2 141.5L162 133.5L163 125Z");
  bag.draw("white", "M153 125L152.3 131.2L150.2 137.1L146.9 142.4L142.4 146.9L137.1 150.2L131.2 152.3L125 153L118.8 152.3L112.9 150.2L107.6 146.9L103.1 142.4L99.8 137.1L97.7 131.2L97 125L97.7 118.8L99.8 112.9L103.1 107.6L107.6 103.1L112.9 99.8L118.8 97.7L125 97L131.2 97.7L137.1 99.8L142.4 103.1L146.9 107.6L150.2 112.9L152.3 118.8Z");
  bag.cut("black", "M154.1 125L153.4 131.5L151.2 137.6L147.8 143.2L143.2 147.8L137.6 151.2L131.5 153.4L125 154.1L118.5 153.4L112.4 151.2L106.8 147.8L102.2 143.2L98.8 137.6L96.6 131.5L95.9 125L96.6 118.5L98.8 112.4L102.2 106.8L106.8 102.2L112.4 98.8L118.5 96.6L125 95.9L131.5 96.6L137.6 98.8L143.2 102.2L147.8 106.8L151.2 112.4L153.4 118.5ZM152.3 118.8L150.2 112.9L146.9 107.6L142.4 103.1L137.1 99.8L131.2 97.7L125 97L118.8 97.7L112.9 99.8L107.6 103.1L103.1 107.6L99.8 112.9L97.7 118.8L97 125L97.7 131.2L99.8 137.1L103.1 142.4L107.6 146.9L112.9 150.2L118.8 152.3L125 153L131.2 152.3L137.1 150.2L142.4 146.9L146.9 142.4L150.2 137.1L152.3 131.2L153 125Z");
  bag.draw("black", "M162 93.8L155.2 99L162.4 94.3Z");
  bag.draw("black", "M160.9 91.6L151.8 94.9L153.5 87.1L153.4 93L161.2 91.7L153.9 92.8L153.3 86.8L151.3 94.7L161 92.1Z");
  bag.draw("white", "M162.2 94.1L155.3 98.7L161.5 92.7ZM161 91.8L151.9 95.2L153.2 87L153.6 92.8L159.9 90.6Z");
  bag.draw("black", "M164.1 97.1L158.4 89.7L151.7 87.8L152.4 95.6L162 99.5L156.5 99.8L150.4 93.9L148.9 86.1L158.3 88.7L163.8 97.4L161.8 91.4L152.7 85.7L148.2 87.9L154.3 99.2L162.5 99.5L152.9 95.2L152.6 88.1L164.1 97.7Z");
  bag.draw("white", "M164.1 97.4L158.2 89.9L151.8 88.1L153.5 96.3L162.3 99.5L156.3 100.1L148.7 90L148.6 85.9L154.7 86.5L163.6 95.3Z");
  bag.draw("black", "M156.2 162L151 155.2L155.7 162.4Z");
  bag.draw("black", "M158.4 160.9L155.1 151.8L162.9 153.5L157 153.4L158.3 161.2L157.2 153.9L163.2 153.3L155.3 151.3L157.9 161Z");
  bag.draw("white", "M155.9 162.2L151.3 155.3L157.3 161.5ZM158.2 161L154.8 151.9L163 153.2L157.2 153.6L159.4 159.9Z");
  bag.draw("black", "M152.9 164.1L160.3 158.4L162.2 151.7L154.4 152.4L150.5 162L150.2 156.5L156.1 150.4L163.9 148.9L161.3 158.3L152.6 163.8L158.6 161.8L164.3 152.7L162.1 148.2L150.8 154.3L150.5 162.5L154.8 152.9L161.9 152.6L152.3 164.1Z");
  bag.draw("white", "M152.6 164.1L160.1 158.2L161.9 151.8L153.7 153.5L150.5 162.3L149.9 156.3L160 148.7L164.1 148.6L163.5 154.7L154.7 163.6Z");
  bag.draw("black", "M88 156.2L94.8 151L87.6 155.7Z");
  bag.draw("black", "M89.1 158.4L98.2 155.1L96.5 162.9L96.6 157L88.8 158.3L96.1 157.2L96.7 163.2L98.7 155.3L89 157.9Z");
  bag.draw("white", "M87.8 155.9L94.7 151.3L88.5 157.3ZM89 158.2L98.1 154.8L96.8 163L96.4 157.2L90.1 159.4Z");
  bag.draw("black", "M85.9 152.9L91.6 160.3L98.3 162.2L97.6 154.4L88 150.5L93.5 150.2L99.6 156.1L101.1 163.9L91.7 161.3L86.2 152.6L88.2 158.6L97.3 164.3L101.8 162.1L95.7 150.8L87.5 150.5L97.1 154.8L97.4 161.9L85.9 152.3Z");
  bag.draw("white", "M85.9 152.6L91.8 160.1L98.2 161.9L96.5 153.7L87.7 150.5L93.7 149.9L101.3 160L101.4 164.1L95.3 163.5L86.4 154.7Z");
  bag.draw("black", "M93.8 88L99 94.8L94.3 87.6Z");
  bag.draw("black", "M91.6 89.1L94.9 98.2L87.1 96.5L93 96.6L91.7 88.8L92.8 96.1L86.8 96.7L94.7 98.7L92.1 89Z");
  bag.draw("white", "M94.1 87.8L98.7 94.7L92.7 88.5ZM91.8 89L95.2 98.1L87 96.8L92.8 96.4L90.6 90.1Z");
  bag.draw("black", "M97.1 85.9L89.7 91.6L87.8 98.3L95.6 97.6L99.5 88L99.8 93.5L93.9 99.6L86.1 101.1L88.7 91.7L97.4 86.2L91.4 88.2L85.7 97.3L87.9 101.8L99.2 95.7L99.5 87.5L95.2 97.1L88.1 97.4L97.7 85.9Z");
  bag.draw("white", "M97.4 85.9L89.9 91.8L88.1 98.2L96.3 96.5L99.5 87.7L100.1 93.7L90 101.3L85.9 101.4L86.5 95.3L95.3 86.4Z");
  bag.draw("black", "M94.4 146.6L91.7 142.6L94.3 144.9L95.2 141.3L99.9 141.1L94.4 146.6ZM91.4 128.3L88.4 132.8L92.9 136.1L95.8 131.4L91.4 128.3ZM91.7 129.6L95.3 131.5L92.6 134.7L89.1 132.7L91.7 129.6ZM96.1 116.3L88.4 118.9L87.8 122.8L95.2 123.5L92.4 121L96.1 116.3ZM91.8 121.6L88.6 121.3L91.8 121.6ZM100 100.3L96.7 104.7L101.2 105.9L101.3 101.1L102.6 105.3L96 106.1L98.9 99.1ZM107.7 92.2L107.6 100.8L111.6 96L115.1 96.9L112 95.1ZM108.6 93.9L111.1 95.5L108.6 96.8ZM120.8 88.2L121.4 94.3L125.1 95.1L119.9 95.5L119 88.4ZM133.6 89L131.8 94.9L135 97L130 95.5L131.8 88.5ZM146.5 94.8L138.8 98.6L144.9 100L145.6 103.5L145.8 100ZM145.4 96.4L145 99.4L142.7 97.8ZM149.1 107.6L154.9 102.8L153.6 110.6L158.7 109.8L152 112.3L153.2 104.9L149.1 107.6ZM160.3 118.1L161.9 121.7L154.5 120.7L160.2 118.1ZM153.8 134.1L161.5 131.6L162.2 127.7L154.8 126.9L157.6 129.4L153.8 134.1ZM158.2 128.8L161.3 129.1L158.2 128.8ZM151.4 138.9L154.8 147.2L154.4 141.8L159.6 139L151.4 138.9Z");
  bag.draw("black", "M144.3 153.5L144.3 153.8L144.1 154.1L144 154.4L143.7 154.6L143.4 154.8L143.1 154.9L142.8 155L142.4 154.9L142.1 154.8L141.8 154.6L141.6 154.4L141.4 154.1L141.3 153.8L141.3 153.5L141.3 153.1L141.4 152.8L141.6 152.5L141.8 152.3L142.1 152.1L142.4 152L142.8 152L143.1 152L143.4 152.1L143.7 152.3L144 152.5L144.1 152.8L144.3 153.1Z");
  bag.draw("black", "M108.7 153.5L108.7 153.8L108.6 154.1L108.4 154.4L108.2 154.6L107.9 154.8L107.6 154.9L107.2 155L106.9 154.9L106.6 154.8L106.3 154.6L106 154.4L105.9 154.1L105.7 153.8L105.7 153.5L105.7 153.1L105.9 152.8L106 152.5L106.3 152.3L106.6 152.1L106.9 152L107.2 152L107.6 152L107.9 152.1L108.2 152.3L108.4 152.5L108.6 152.8L108.7 153.1Z");
  bag.draw("black", "M127.4 161.8L122.6 161.8L122.2 156L127.9 156.1L127.4 161.8ZM123.9 160.1L127.7 160.2L126.4 155.7L122.5 156.6L123.9 160.1Z");
  bag.draw("black", "M125 161L124.5 156.3L127.3 158.4L125 161ZM125 159.6L124.6 156.9L125 159.6Z");
  bag.draw("black", "M125.6 158.6L125.6 158.7L125.5 158.8L125.5 158.9L125.4 159L125.3 159.1L125.1 159.1L125 159.1L124.9 159.1L124.7 159.1L124.6 159L124.5 158.9L124.5 158.8L124.4 158.7L124.4 158.6L124.4 158.4L124.5 158.3L124.5 158.2L124.6 158.1L124.7 158L124.9 158L125 158L125.1 158L125.3 158L125.4 158.1L125.5 158.2L125.5 158.3L125.6 158.4Z");
  bag.draw("black", "M105.4 146L144.7 145.4L105.3 145.4Z");
  bag.draw("black", "M126 127.8L126.2 130.5L126.3 127.8Z");
  bag.draw("black", "M123.6 128.1L124.7 130.4L123.8 127.9Z");
  bag.draw("black", "M131.8 145.3L123.6 146.5L125.6 142.7L119.6 141.2L114.7 145.6L118 149.3L114.2 150.6L116.4 148.3L112.9 145L117.3 140.4L138.3 137.1L144.5 127.8L150.5 134.9L140.1 135.3L142.8 140.2L149.8 137.2L145.8 143.2L131.5 145.1L144.4 145.1L149.9 136.7L142.9 140L140.5 135.5L150.9 134.8L144.5 127.4L137.9 137.1L117.1 140L112.5 144.9L116 148.4L114 150.8L118.4 149.6L114.8 145.6L119.7 141.6L125.3 142.5L123.4 146.9L131.9 145.8Z");
  bag.draw("white", "M131.8 145.6L123.5 146.7L125.4 142.6L119.6 141.4L114.8 145.8L118.2 149.4L114.2 150.6L116.2 148.3L113 144.4L117.9 139.9L138.1 137L144.6 127.6L150.7 134.9L140.3 135.4L142.7 140L149.7 136.7L146 143.3L131.5 145.4Z");
  bag.draw("black", "M136 133.9L136.3 140.9L124.2 130.6L135.6 132.7L124 130.6L136.4 141.1L138.8 138.5L136.3 133.9Z");
  bag.draw("white", "M136.2 133.9L136.5 141L124.1 130.6L136.2 133.8Z");
  bag.draw("black", "M142.3 143.3L145.7 140.9L142.1 142.9Z");
  bag.draw("black", "M124.5 140.1L128.5 142L125.1 144.6L131.8 143.9L125.1 144.6L129 141.9L124.6 139.7Z");
  bag.draw("black", "M135.7 142.6L140 143.8L135.8 142.2Z");
  bag.draw("black", "M140.7 130.2L143.9 132L140.9 130Z");
  bag.draw("black", "M130.2 137.1L135.2 136.3L130.1 136.9Z");
  bag.draw("black", "M128.3 135.5L134.9 134.9L128.2 135.2Z");
  bag.draw("black", "M134.6 140.3L136.6 138.1L134.4 140.2Z");
  bag.draw("black", "M132.3 138.3L135.5 137.1L132.2 138.1Z");
  bag.draw("black", "M132.2 131.1L141.2 126.3L138.8 132.6L141.4 126.2L132 130.9Z");
  bag.draw("black", "M125.5 133.3L134.7 133.6L125.5 133Z");
  bag.draw("black", "M146.2 138.6L148.7 136.3L146.1 138.5Z");
  bag.draw("black", "M143.3 143.9L145.8 142.1L143.2 143.7Z");
  bag.draw("black", "M146.7 133.2L144 133.6L146.7 133.4Z");
  bag.draw("black", "M125.7 116.8L127.6 102.7L125.8 117Z");
  bag.draw("black", "M134 108.5L131.7 111L137.1 119.5L143.3 117.2L150.3 122L142.2 118.8L138.5 122.7L150.5 131.2L140.6 125.1L123.5 128.5L120.5 134.9L130.4 138.3L117.8 137.1L116.7 133.2L114.8 137.4L122.7 145.1L118.7 145.4L111.6 136.4L113.5 131.6L104 125.9L106.2 132.3L102.9 138.9L101.2 124.9L108.8 125.1L126 117L129.9 101.8L138.3 106.5L134 109L138 109.6L138.7 106.2L130 101.6L125.7 116.7L100.6 124.9L101.4 135.3L102.8 139.3L105.3 137.6L103.2 127.1L108.8 126.8L113.2 132L111.3 136.7L118.5 145.5L122.7 145.5L115 136.2L116.7 133.4L117.6 137.5L130.4 138.7L120.8 134.7L123.8 128.8L142.2 125.7L150.5 131.6L138.8 122.7L142.1 119.3L148.2 123.8L151.2 124.5L150.7 121.8L143.4 116.8L137.1 119.1L132.1 110.8L134.1 109Z");
  bag.draw("white", "M134.1 108.7L131.9 110.9L137.2 119.3L143.3 117L150.5 121.9L142.2 119.1L138.7 122.7L150.5 131.4L140.5 125.3L123.5 128.7L120.6 134.8L130.4 138.5L117.7 137.3L116.9 133.3L115 137.2L122.7 145.3L118.5 145.3L108.7 126.6L103 126.8L106.4 132.3L102.8 139L100.2 125.9L125.8 116.8L130.1 101.7L138.8 106.8L134.1 108.8Z");
  bag.draw("black", "M129.3 105.8L131.8 111.1L129.7 105.8Z");
  bag.draw("black", "M137 119.3L137.4 122.7L137.4 119.2Z");
  bag.draw("black", "M117 133.5L120.8 127.6L118.2 126.1L120.5 128.9L116.8 133.1Z");
  bag.draw("black", "M120.7 128.7L123.5 128.9L120.8 128.3Z");
  bag.draw("black", "M133.9 122.2L138.8 123.1L133.9 121.7Z");
  bag.draw("black", "M133.1 125.4L137.4 126.2L133.2 125Z");
  bag.draw("black", "M132.4 116.2L136 117.2L132.5 115.8Z");
  bag.draw("black", "M120.5 129.9L123 128.7L120.5 129.7Z");
  bag.draw("black", "M129.4 105.8L132.1 109.1L129.6 105.8Z");
  bag.draw("black", "M116.6 120L118.3 126.3L116.7 119.8Z");
  bag.draw("black", "M136.2 107.8L127.4 114.4L124.3 111.4L127.5 113.9L136.3 107.8L127.2 113.8L124.3 111.2L124.7 114.7L136.3 107.9Z");
  bag.draw("white", "M136.3 107.9L124.7 114.6L124.3 111.3L127.9 113.7L135.7 107.6Z");
  bag.draw("black", "M128.9 104.2L136.7 108.3L129.1 104Z");
  bag.draw("black", "M119.2 104.3L106.9 105.2L104.3 112.5L101.5 111.4L101.7 117.5L98.2 117L107.9 119.6L119.3 111.1L119.3 104.4L119.1 110.9L107.7 119.4L98.5 117L101.9 117.6L104.1 108.2L119.2 104.5Z");
  bag.draw("white", "M119.2 104.4L107 105.3L104.4 112.6L101.6 111.5L101.8 117.5L98.3 117L107.8 119.5L119.2 111.1Z");
  bag.draw("black", "M107.2 105.4L112.4 105.2L107.2 105.1Z");
  bag.draw("black", "M104.2 108.2L106.7 107.3L104.1 107.9Z");
  bag.draw("black", "M101.8 111.4L104.1 110.4L101.7 111.2Z");
  bag.draw("black", "M98.5 116.9L101.7 114L98.3 116.7Z");
  bag.draw("black", "M104.2 119L110.4 112.4L104 118.9Z");
  bag.draw("black", "M101.9 117.7L111 111L101.7 117.5Z");
  bag.draw("black", "M106.6 109L114.8 107.3L106.5 108.7Z");
  bag.draw("black", "M110.3 106.9L116.3 106.2L110.3 106.7Z");
  bag.draw("black", "M104.4 112.8L113.8 108.2L104.3 112.5Z");
  bag.draw("black", "M130.2 150.3L105.4 143L130.3 150Z");
  bag.draw("black", "M109.4 117.2L107.4 119.9L109.6 117.5Z");
  bag.draw("black", "M108.4 119.4L116.2 126.1L108.6 119.1Z");
  bag.draw("white", "M108.5 119.3L116.1 126L109.4 118.4Z");
  bag.draw("black", "M115.2 125L109 118.8L115.1 125.1Z");
  bag.draw("black", "M123.7 106.9L129.3 101.8L127.3 99.5L114.3 101.8L121.7 104.8L113.5 107.9L105.9 117.9L107.7 119.4L116.1 109.1L117.8 120.5L126.5 122L131.6 130.4L137.7 131.7L129.1 119.1L123.4 117.4L123.7 106.9L123.1 117.6L128.8 119.4L137.8 131.3L131.9 130.1L126.7 121.6L118.1 120.2L116.5 109L106.3 117.6L114.4 107.8L122 105L114.6 102.1L127.1 99.9L129.2 101.4L123.3 107Z");
  bag.draw("white", "M123.5 107L129.2 101.6L127.2 99.7L114.4 101.9L121.8 104.9L114.2 107.7L106 117.6L116.4 109.1L117.9 120.4L126.6 121.8L131.8 130.2L137.9 131.5L129 119.3L123.3 117.5L123.5 107Z");
  bag.draw("black", "M121.8 104.3L126.9 104.2L122 104Z");
  bag.draw("black", "M127.7 102.2L124.3 100.2L121.4 103.8L124.6 100.6L127.9 102.6Z");
  bag.draw("black", "M117.9 108.4L119.4 111L118.1 108.3Z");
  bag.draw("black", "M118.2 119.3L127.4 121.5L118.2 119.1Z");
  bag.draw("black", "M119.6 116.3L123.1 117.8L119.7 116.1Z");
  bag.draw("black", "M120.9 105L123.7 109L121 104.9Z");
  bag.draw("black", "M120.2 104.8L123.7 109L120.4 104.8Z");
  bag.draw("black", "M119.5 104.5L123.7 109L119.7 104.4Z");
  bag.draw("black", "M133.2 129.1L130.9 125.5L133.1 129.3Z");
  bag.draw("black", "M129.3 126.1L131.9 124.8L129.3 125.9Z");
  bag.draw("black", "M128.9 125.7L131.6 124.3L128.9 125.5Z");
  bag.box(1000, 666.7);
  return bag.done("0 0 1000 666.7");
}


function doonfLiechtenstein() {
  var bag = doonfBag();
  bag.draw("li-002b7f", "M0 0L1000 0L1000 300L0 300Z");
  bag.draw("li-ce1126", "M0 300L1000 300L1000 600L0 600Z");
  bag.cut("black", "M270.6 220L129.4 220L109 180.4L100 171.7L113.9 164.1L110.8 143.3L114.9 126.7L125.5 115.7L148 109L200 115.9L248.1 108.8L264.6 111.6L279.5 118.9L286.6 130.3L289.2 146.6L286.1 164.1L300 171.7L289.7 182.8Z");
  bag.cut("li-ffd83d", "M269.6 216.7L268.1 211.4L265.7 215.9L264.2 210.6L262.4 215.3L259.9 209.9L258.2 214.5L256 209.2L254.3 213.8L251.3 208.4L248 212.8L246.3 207.6L244.8 212.4L240.7 206.9L239.2 211.7L235.4 206.3L232.3 210.9L230.4 205.8L227.7 210.4L225.8 205.3L222.7 210L220.8 204.8L218.1 209.6L216.2 204.5L213.3 209.3L211.4 204.2L207.6 208.9L205.7 203.9L201.8 208.6L201 203.7L198.6 208.5L194.3 203.9L190 209L188.6 204.2L185.2 209.4L183.8 204.5L180.5 209.7L179.2 204.8L175.6 210.1L174.2 205.3L170.9 210.6L169.6 205.8L166 211.1L164.6 206.3L160.8 211.7L159.3 206.9L155.2 212.4L153.7 207.6L150.4 213.1L148.7 208.4L145.7 213.8L144 209.2L141.8 214.5L140.1 209.9L137.6 215.3L135.8 210.6L134.2 215.9L131.9 211.4L130.4 216.7L105.6 172.1L114.5 167.2L124.6 168.1L140.3 184.6L143.1 164.6L153.9 159.6L167.5 167L179.2 182L184.9 164.6L201.1 157.6L215.8 165.4L220.8 182L234.2 165.7L249.3 159.4L257.8 166.4L259.7 184.6L268.7 172.3L281.6 166.8L294.4 172.1L286.1 183.3Z");
  bag.cut("li-ffd83d", "M151.5 124.6L172.2 127.5L184.2 136.4L184.3 154.9L175.2 165.8L151.9 156.3L136 164.6L128.6 156.5L125.2 144.6L128.4 132.9L137.5 126.6L150.6 124.6Z");
  bag.cut("li-ffd83d", "M248.5 124.6L227.8 127.5L215.8 136.4L215.7 154.9L224.8 165.8L248.1 156.3L264 164.6L271.4 156.5L274.8 144.6L271.6 132.9L262.5 126.6L249.4 124.6Z");
  bag.cut("li-ffd83d", "M200 148.4L196.9 151.2L199.7 154.6L203.1 151.9L200.3 148.4Z");
  bag.cut("li-ffd83d", "M200 139.4L197 142.4L199.7 145.4L203 142.7L200.3 139.4Z");
  bag.cut("li-ffd83d", "M200 130.9L197.2 133.4L199.7 136.5L202.8 134L200.3 130.9Z");
  bag.cut("li-ffd83d", "M200 123.1L199.7 127.9L202.4 125.8L200.2 123.1Z");
  bag.cut("li-ffd83d", "M200 116.6L199.6 120.4L200.2 116.6Z");
  bag.cut("black", "M150.5 183.9L164.7 205L165 179.8L161.7 183.1L155.2 174.8L155.8 184.2L151.2 184Z");
  bag.cut("black", "M249.5 183.9L235.3 205L235 179.8L238.3 183.1L244.8 174.8L244.1 184.2L248.8 184Z");
  bag.cut("black", "M119.3 189.7L124.9 190.3L122.1 181.9L131.3 188.7L134.3 185.1L136.2 207.6L121.5 191.8Z");
  bag.cut("black", "M280.7 189.7L275.1 190.3L277.9 181.9L268.7 188.7L265.7 185.1L263.8 207.6L278.5 191.8Z");
  bag.cut("black", "M211 175.5L203.3 178.2L200 170L196.7 178.2L189 175.5L200 202.8L210.5 176.2Z");
  bag.cut("black", "M139.9 105.7L133.9 111.3L139.6 117.6L145.9 112L140.2 105.7Z");
  bag.cut("li-ffd83d", "M139.9 108.1L136.4 111.3L139.6 115.2L143.5 112L140.3 108.1Z");
  bag.cut("black", "M129.1 108.2L123.2 114.2L128.8 120.2L135.1 114.5L129.5 108.2Z");
  bag.cut("li-ffd83d", "M129.1 110.6L125.6 114.2L129.1 117.7L132.7 114.5L129.5 110.6Z");
  bag.cut("black", "M119.7 114.3L113.7 120.2L119.4 126.2L125.7 120.6L120 114.3Z");
  bag.cut("li-ffd83d", "M119.7 116.7L116.2 120.2L119.7 123.8L123.3 120.6L120.1 116.7Z");
  bag.cut("black", "M114 122.9L108.1 128.6L113.4 134.8L120 129.2L114.3 122.9Z");
  bag.cut("li-ffd83d", "M114 125.3L110.5 128.9L113.7 132.4L117.6 129.2L114.4 125.3Z");
  bag.cut("black", "M111.3 133.7L105.3 139.4L111 145.7L117.3 139.7L111.6 133.7Z");
  bag.cut("li-ffd83d", "M111.3 136.1L107.8 139.3L110.9 143.2L114.8 140.1L111.7 136.2Z");
  bag.cut("black", "M111.4 144.5L105.4 150.1L111.1 156.4L117.3 150.8L111.7 144.5Z");
  bag.cut("li-ffd83d", "M111.4 146.9L107.8 150.1L111 154L114.9 150.8L111.7 146.9Z");
  bag.cut("black", "M113.5 154.7L107.6 160.6L113.5 166.6L119.5 160.6L113.9 154.7Z");
  bag.cut("li-ffd83d", "M113.5 157.1L110 160.6L113.5 164.2L117.1 161L113.9 157.1Z");
  bag.cut("black", "M150.5 105L144.5 110.9L150.2 116.9L156.5 111.2L150.8 105Z");
  bag.cut("li-ffd83d", "M150.5 107.4L146.9 110.9L150.5 114.5L154 111.3L150.9 107.4Z");
  bag.cut("black", "M160.8 105.9L154.8 111.5L160.8 117.8L166.8 111.8L161.1 105.9Z");
  bag.cut("li-ffd83d", "M160.8 108.3L157.2 111.5L160.4 115.4L164.3 112.2L161.1 108.3Z");
  bag.cut("black", "M171.8 107.7L165.8 113.3L171.2 119.6L177.7 114.2L172.1 107.7Z");
  bag.cut("li-ffd83d", "M171.8 110.1L168.3 113.3L171.4 117.2L175.3 114L172.2 110.1Z");
  bag.cut("black", "M181.8 109.2L175.8 115.1L181.5 121.1L187.8 115.1L182.1 109.2Z");
  bag.cut("li-ffd83d", "M181.8 111.6L178.2 115.1L181.8 118.7L185.3 115.5L182.2 111.6Z");
  bag.cut("black", "M191 111.2L185.1 116.9L190.4 123.2L197 117.5L191.3 111.3Z");
  bag.cut("li-ffd83d", "M191 113.7L187.5 116.9L190.7 120.8L194.6 117.6L191.4 113.7Z");
  bag.cut("li-ffd83d", "M121.1 163.8L117.3 139.7L126.6 122.8L151.2 117.1L188.5 122.9L187.8 127.3L151.9 122L129.8 127.6L122.5 140.9L127.2 165.4Z");
  bag.cut("li-ffd83d", "M187 158.5L191.1 123.8L194.1 123.8L191.4 156.7Z");
  bag.cut("li-ffd83d", "M278.9 163.8L282.6 139.7L273.4 122.8L248 117.1L211.5 122.9L212.2 127.3L248.1 122L270.2 127.6L277.5 140.9L272.8 165.4Z");
  bag.cut("li-ffd83d", "M213 158.5L208.9 123.8L205.9 123.8L208.6 156.7Z");
  bag.cut("black", "M260.1 105.7L266.1 111.3L260.4 117.6L254.1 111.7L259.8 105.7Z");
  bag.cut("li-ffd83d", "M260.1 108.1L263.6 111.3L260.4 115.2L256.5 112L259.7 108.1Z");
  bag.cut("black", "M270.9 108.2L276.8 113.9L270.9 120.2L264.9 114.5L270.6 108.2Z");
  bag.cut("li-ffd83d", "M270.9 110.6L274.4 113.8L271.2 117.7L267.3 114.5L270.5 110.6Z");
  bag.cut("black", "M280.3 114.3L286.2 119.9L280.6 126.2L274.3 120.6L280 114.3Z");
  bag.cut("li-ffd83d", "M280.3 116.7L283.8 120.2L280.6 123.8L276.7 120.6L279.9 116.7Z");
  bag.cut("black", "M285.9 122.9L291.9 128.9L286.6 134.8L280 129.5L285.6 122.9Z");
  bag.cut("li-ffd83d", "M285.9 125.3L289.5 128.5L286.3 132.4L282.4 129.2L285.6 125.3Z");
  bag.cut("black", "M288.7 133.7L294.7 139.7L289 145.7L282.7 139.7L288.4 133.7Z");
  bag.cut("li-ffd83d", "M288.7 136.1L292.3 139.7L288.7 143.3L285.2 140.1L288.3 136.2Z");
  bag.cut("black", "M288.6 144.5L294.6 150.1L288.9 156.4L282.6 150.5L288.3 144.5Z");
  bag.cut("li-ffd83d", "M288.6 146.9L292.2 150.1L289 154L285.1 150.8L288.3 146.9Z");
  bag.cut("black", "M286.5 154.6L292.4 160.3L286.5 166.6L280.5 160.9L286.2 154.7Z");
  bag.cut("li-ffd83d", "M286.5 157.1L290 160.6L286.5 164.2L282.9 160.6L286.1 157.1Z");
  bag.cut("black", "M249.5 105L255.5 110.6L250.1 116.9L243.5 111.2L249.2 105Z");
  bag.cut("li-ffd83d", "M249.5 107.4L253 110.6L249.9 114.5L246 111.3L249.1 107.4Z");
  bag.cut("black", "M239.2 105.9L245.2 111.8L239.2 117.8L233.2 111.8L238.9 105.9Z");
  bag.cut("li-ffd83d", "M239.2 108.3L242.8 111.8L239.2 115.4L235.7 112.2L238.9 108.3Z");
  bag.cut("black", "M228.2 107.7L234.2 113.6L228.5 119.6L222.2 113.9L227.9 107.7Z");
  bag.cut("li-ffd83d", "M228.2 110.1L231.8 113.6L228.2 117.2L224.7 114L227.8 110.1Z");
  bag.cut("black", "M218.2 109.2L224.2 114.8L218.5 121.1L212.2 115.4L217.9 109.2Z");
  bag.cut("li-ffd83d", "M218.2 111.6L221.8 115.1L218.6 118.7L214.7 115.5L217.9 111.6Z");
  bag.cut("black", "M208.9 111.2L214.9 116.9L209.3 123.2L203 117.2L208.6 111.2Z");
  bag.cut("li-ffd83d", "M208.9 113.7L212.5 116.9L209.3 120.8L205.4 117.6L208.6 113.7Z");
  bag.cut("black", "M200 60L193.8 69.8L197.7 76.2L195.8 79.1L189.8 75.5L180 81.5L189.6 87.3L195.5 83.4L196.5 95.5L203.4 95.6L206.2 91.1L202.5 85.3L204.5 83.4L210.4 87.3L220 81.5L210.2 75.5L204.2 79.1L202.3 76.2L206.2 69.8Z");
  bag.cut("li-ffd83d", "M184.7 81.3L193.5 80L189.5 84.3Z");
  bag.cut("li-ffd83d", "M215.3 81.3L206.5 80L210.5 84.3Z");
  bag.cut("li-ffd83d", "M200 64.3L196.6 69.1L200.9 73.8L203.3 69.1L200 64.4Z");
  bag.cut("li-ffd83d", "M199.4 77.6L196.8 80.9L199.3 84.3L203.2 81.9L200.6 77.6Z");
  bag.cut("li-ffd83d", "M199 86.7L198 94.5L203.8 90.8L200 86.7Z");
  bag.cut("li-ffd83d", "M200 96.9L191.5 105L193.7 111.2L199.6 114L205.7 111.8L208.5 105.9L206.3 99.7L200.4 96.9Z");
  bag.cut("black", "M191.4 106.3L208.5 106.3L191.4 108.5Z");
  bag.cut("black", "M191.2 100.9L195.7 100.9L197.9 96L197.9 103.1L191.2 103.1Z");
  bag.cut("black", "M204.3 100.9L208.8 100.9L202 103.1L204.3 96Z");
  bag.cut("black", "M200 94.3L192.5 97.2L188.8 104.9L191.7 113L199.4 116.6L207.5 113.7L211.2 106L208.6 98.3L200.6 94.3ZM200 96.9L191.5 105L193.7 111.2L199.6 114L205.7 111.8L208.5 105.9L206.3 99.7L200.4 96.9Z");
  bag.box(1000, 600);
  return bag.done("0 0 1000 600");
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
  bag.draw("xk-blue", "M0 0L840 0L840 600L0 600Z");
  bag.draw("xk-gold", "M424.5 190.1L430.4 203.3L421 208L429.7 209.2L445.3 217.7L455 216.5L458.8 220.2L462.6 215.3L466.5 216.3L475.7 223.7L481.4 244.6L488.4 240.5L492.2 245.3L493.7 261.4L498.4 268.4L511.9 270.4L514.1 276L528.3 276L522.4 304.7L544.7 309.7L557 307.6L558.7 316.7L565 317.8L567.5 322L584.4 316.8L592.1 326.4L585.7 348.6L575.1 360.6L572.4 371.4L564.8 376.9L566.8 383L562.8 394.3L544.7 397.9L546.4 407.5L552.1 409.6L562.2 422.2L541.7 424.2L538.4 418.9L531.8 417.5L528.3 427.7L520 425.7L515.4 433.7L511.3 434.8L505.4 446.8L508.9 457.9L503.3 460.6L486.6 458.1L484.9 448.8L477.9 439.7L469.1 434.5L453.6 446.3L439.2 450.3L429.5 459.4L411.2 463L404.9 475.5L405.2 483.5L410.2 492L405.5 506L392.9 514.4L385.3 510.9L383 514.6L376.6 515.5L371.5 510.1L369.5 499.9L378 491L378.2 486.6L372.7 470.5L366.2 462L367.4 451L360.7 431L349.4 417.8L327.6 405.5L311.2 406L309.5 391.6L304.1 387L305.9 379.8L299.5 366.8L278.9 349.5L282.2 343.6L280.1 332.5L284.5 327.2L261.3 315L264.7 302.9L278.1 296.2L297.1 302.6L306.2 302L309 294L318.5 285.9L342.2 281.9L348.1 283.9L359.3 278.3L361 273.9L355.2 267.3L355.5 259.8L358.6 255.2L367.7 252.4L372.4 241.9L378 242.6L378.2 246.1L381.6 244.5L385.3 240.2L386 229.7L391.7 225.6L387.3 218.6L382.6 219.4L377.8 207.8L380.1 199.6L411.9 184.3L418.4 184.3L424 188.5Z");
  bag.draw("white", "M469.9 110.7L461.8 85.8L453.8 110.7L427.6 110.7L448.8 126.1L440.7 151L461.8 135.6L483 151L474.9 126.1L496.1 110.7Z");
  bag.draw("white", "M552.3 125.2L544.2 100.4L536.2 125.2L510 125.2L531.2 140.6L523.1 165.5L544.2 150.1L565.4 165.5L557.3 140.6L578.5 125.2Z");
  bag.draw("white", "M630.9 153.8L622.9 129L614.8 153.8L588.6 153.8L609.8 169.2L601.7 194.1L622.9 178.7L644 194.1L635.9 169.2L657.1 153.8Z");
  bag.draw("white", "M386.2 110.7L378.2 85.8L370.1 110.7L343.9 110.7L365.1 126.1L357 151L378.2 135.6L399.3 151L391.2 126.1L412.4 110.7Z");
  bag.draw("white", "M303.8 125.2L295.8 100.4L287.7 125.2L261.5 125.2L282.7 140.6L274.6 165.5L295.8 150.1L316.9 165.5L308.8 140.6L330 125.2Z");
  bag.draw("white", "M225.2 153.8L217.1 129L209.1 153.8L182.9 153.8L204.1 169.2L196 194.1L217.1 178.7L238.3 194.1L230.2 169.2L251.4 153.8Z");
  bag.box(840, 600);
  return bag.done("0 0 840 600");
}


function doonfMoldova() {
  var bag = doonfBag();
  bag.draw("md-red", "M0 0L1000 0L1000 500L0 500Z");
  bag.draw("md-yellow", "M0 0L666.7 0L666.7 500L0 500Z");
  bag.draw("md-0046ae", "M0 0L333.3 0L333.3 500L0 500Z");
  bag.draw("black", "M473.1 101.8L468.8 103L471.3 110.5L463.8 108L462.6 112.9L463.8 116.5L471.3 114L469 137.2L473.1 141.5L477.2 137.2L474.8 114L482.4 116.5L483.5 112.9L482.4 108L474.8 110.5L477.3 103L474.2 101.8Z");
  bag.draw("md-yellow", "M473.1 102.7L470.6 103.1L472.1 111.3L463.9 109.8L463.5 112.3L463.9 114.7L472.1 113.2L473.1 139.9L474 113.2L482.2 114.7L482.7 112.2L482.3 109.8L474 111.3L473.5 102.7Z");
  bag.draw("black", "M524.7 174.4L517.4 166.2L513.7 152.3L516.6 133.9L519.9 136.2L517.9 129L521.5 128.1L516.8 123.7L521.2 121.7L499.8 113.8L487.9 113.4L472.3 124.2L480 123.1L486.2 126.7L474.4 125.2L484.2 133.5L486.6 144.8L484 163L475.4 174.4L500 178.9Z");
  bag.draw("black", "M500 168.9L475.4 174.4L447.6 162.8L448.8 147.9L428.1 131.1L408.7 151.1L404.7 338.5L435.2 307.5L447 273.2L459.9 285.8L445.9 312.2L431.7 318.3L431.1 326.4L442.4 334L464.8 304.2L477.1 294L487.4 298.8L468.5 333L451 349.9L471.7 360L486.1 339.7L475.6 362.2L500 381.8L501.1 173.5Z");
  bag.draw("md-b07e5b", "M500 370.7L482.6 359.1L491.8 334.7L494.1 311.9L486.8 331.2L471.4 353.7L459.8 349.5L474.7 330.9L490.2 299.6L474.4 292.2L466.5 300.5L465.2 295.8L456.8 294.5L461.8 286.8L446.6 266.6L435.2 297.5L435.2 187.2L440 191.6L447.3 184.8L447.3 179.6L440.9 185.7L440.9 170.1L443 166.6L451.4 177.5L456.3 172.3L460.2 177.5L466 172.8L460 175L458.2 168.9L450.9 174.1L447.1 167.2L451 166.9L475.2 174.6L470 177.6L488.2 171.1L484.6 177.5L497.2 171L502.8 176.3L502.8 365.1ZM443.4 148.5L443.5 162.4L435.2 149.6L428.9 159L424 145.6L416.7 156.8L413.8 150.6L428.1 136.7L442.3 148ZM414.4 158.6L414.4 167.1L410.4 170.8L411.8 153.8ZM426.8 161.9L422.2 171.5L422.2 154.9ZM420.6 171.4L416 167.2L416 161L420.6 156.2ZM441.5 165L434.7 171.8L434.7 157.3L440.4 164.3ZM433 158L433 171.4L428.5 162.4ZM414.4 172.3L414.4 185.7L410.4 176ZM420.6 176.6L416 185.7L416 172.3ZM426.8 172.3L426.8 185.7L422.2 176.6ZM433 176.6L428.4 185.7L428.4 172.3ZM439.2 185.7L434.6 181.4L439.2 172.3ZM427.6 191.6L432.5 187.1L433 306.5L422.8 316.9L422.8 187.1ZM420 312.7L410.4 326.5L410.4 187.2L415.2 191.6L420 187.1Z");
  bag.draw("md-red", "M460.2 300.8L463.7 298.4L464.3 301.1L447.8 325.9L446.4 320.9L443.2 322.3L446.5 316.6L433.8 319.9L446.8 314.2L458.1 296.8L459.5 299.1ZM437.5 320.3L435.2 322.3L437.3 320.1ZM439.9 321.9L434.2 326.8L439.4 321.6ZM442.1 324.5L436.4 329.5L441.6 324.2ZM443.5 326.6L440 332.5L443.4 326.6Z");
  bag.draw("black", "M500 168.9L524.6 174.4L552.4 162.8L551.2 147.9L571.9 131.1L591.3 151.1L595.3 338.5L564.8 307.5L553 273.2L540.1 285.8L554.1 312.2L568.3 318.3L568.9 326.4L557.6 334L535.2 304.2L522.9 294L512.6 298.8L531.5 333L549 349.9L528.3 360L513.9 339.7L524.4 362.2L500 381.8L498.9 173.5Z");
  bag.draw("md-b07e5b", "M500 370.7L517.4 359.1L508.2 334.7L505.9 311.9L513.2 331.2L528.6 353.7L540.2 349.5L525.3 330.9L509.8 299.6L525.6 292.2L533.5 300.5L534.8 295.8L543.2 294.5L538.2 286.8L553.4 266.6L564.8 297.5L564.8 187.2L560 191.6L552.7 184.8L552.7 179.6L559.1 185.7L559.1 170.1L557 166.6L548.6 177.5L543.7 172.3L539.8 177.5L534 172.8L540 175L541.8 168.9L549.1 174.1L552.9 167.2L549 166.9L524.8 174.6L530 177.6L511.8 171.1L515.4 177.5L502.8 171L497.2 176.3L497.2 365.1ZM556.6 148.5L556.5 162.4L564.8 149.6L571.1 159L576 145.6L583.3 156.8L586.2 150.6L571.9 136.7L557.7 148ZM585.6 158.6L585.6 167.1L589.6 170.8L588.2 153.8ZM573.2 161.9L577.8 171.5L577.8 154.9ZM579.4 171.4L584 167.2L584 161L579.4 156.2ZM558.5 165L565.3 171.8L565.3 157.3L559.6 164.3ZM567 158L567 171.4L571.5 162.4ZM585.6 172.3L585.6 185.7L589.6 176ZM579.4 176.6L584 185.7L584 172.3ZM573.2 172.3L573.2 185.7L577.8 176.6ZM567 176.6L571.6 185.7L571.6 172.3ZM560.8 185.7L565.4 181.4L560.8 172.3ZM572.4 191.6L567.5 187.1L567 306.5L577.2 316.9L577.2 187.1ZM580 312.7L589.6 326.5L589.6 187.2L584.8 191.6L580 187.1Z");
  bag.draw("md-red", "M539.8 300.8L536.3 298.4L535.7 301.1L552.2 325.9L553.6 320.9L556.8 322.3L553.5 316.6L566.2 319.9L553.2 314.2L541.9 296.8L540.5 299.1ZM562.5 320.3L564.8 322.3L562.7 320.1ZM560.1 321.9L565.8 326.8L560.6 321.6ZM557.9 324.5L563.6 329.5L558.4 324.2ZM556.5 326.6L560 332.5L556.6 326.6Z");
  bag.draw("md-b07e5b", "M494.3 114.8L515.5 122.1L517.8 126.9L514.8 128.7L517.7 132.3L514 131.2L511.7 151.9L519.8 173.4L509.6 164.6L508.9 147.5L507.4 163.6L512.2 175.9L503.6 167.9L503.5 147.5L502.2 169.2L499.3 171.3L496.5 147.5L496.4 168.1L487.9 175.9L492.6 164.4L492.7 147.5L490.3 165L480.3 173.4L487.9 155.2L485.9 131.8L494.2 132.9L492.7 125.4L485.9 120.6L502 121.5L511 126.1L503.5 120.5L485.2 118L492.6 114.8Z");
  bag.draw("md-red", "M473.6 122.6L484.5 120L487.9 127.1L474.7 122.2ZM486.7 128.1L484.7 130.9L480 127.2L484.4 128.2Z");
  bag.draw("black", "M497.4 124.4L494.1 127.5L489.2 125L492.5 121.4L497.3 123.8Z");
  bag.draw("md-yellow", "M496.1 124.4L496 125L495.8 125.6L495.5 126.2L495 126.6L494.5 127L493.9 127.2L493.3 127.2L492.6 127.2L492 127L491.5 126.6L491 126.2L490.7 125.6L490.5 125L490.4 124.4L490.5 123.8L490.7 123.2L491 122.6L491.5 122.2L492 121.8L492.6 121.6L493.3 121.6L493.9 121.6L494.5 121.8L495 122.2L495.5 122.6L495.8 123.2L496 123.8Z");
  bag.draw("black", "M494.6 124.4L494.5 124.7L494.4 125L494.3 125.2L494.1 125.4L493.8 125.6L493.6 125.7L493.3 125.7L493 125.7L492.7 125.6L492.5 125.4L492.2 125.2L492.1 125L492 124.7L492 124.4L492 124.1L492.1 123.8L492.2 123.6L492.5 123.4L492.7 123.2L493 123.1L493.3 123.1L493.6 123.1L493.8 123.2L494.1 123.4L494.3 123.6L494.4 123.8L494.5 124.1Z");
  bag.draw("black", "M447.3 328.9L456.3 333.8L454.1 343.8L445.1 338.9Z");
  bag.draw("black", "M405.4 232.6L402.1 234.1L438.8 314.3L442.7 314.3ZM448.6 327.3L447.6 333.6L450.8 332.1Z");
  bag.draw("black", "M416.8 295.9L422.2 303.1L417 304.3L429.9 310.9L437.3 308.7L436.3 303.4L416.9 295.9ZM440 284.5L434.2 295.2L438.9 308L447.4 296L447.3 292.2L442.9 294.3L440.1 284.7ZM426.3 282.8L415.3 283.9L408.6 280.1L414.1 277.9L410.9 271.8L423.9 277.7ZM428 259.1L429.8 265.9L433.4 262.9L434.2 269.7L429.1 281.7L426.9 283L421.2 270.6L427.8 259.2ZM396.5 245.8L411.4 251.3L413.7 257.2L403.5 257.7L395.7 250.7L400 249.9L396.7 246.2ZM412.9 236L415.3 242.3L418.8 238.5L421 246.7L416.7 258.4L409.9 245.4L412.7 236.2ZM394.8 216.8L397.8 228.8L390.9 226.9L397.2 236.3L404.9 237.6L408.3 227.7L403.9 217L402.2 222.9L395.1 216.9ZM437.6 308.5L444.4 312.1L446.1 307.3L438.1 308.5Z");
  bag.draw("black", "M437.3 307L436.8 314.6L431.8 313.6L437 307.4ZM426.2 283.7L433 287.3L434.7 282.5L426.8 283.7Z");
  bag.draw("black", "M426.9 284.3L425.2 291.9L420.5 290L426.6 284.7ZM415.2 260.4L421.9 264L423.7 259.2L415.8 260.4Z");
  bag.draw("black", "M416.2 260L414.4 267.5L409.7 265.6L415.8 260.4ZM403.5 235.9L410.2 239.5L412 234.7L404.1 235.9Z");
  bag.draw("black", "M404.4 235.4L402.7 243L398 241.1L404.1 235.8Z");
  bag.draw("md-yellow", "M448.6 331.7L454.2 334.7L452.8 341L447.2 337.9ZM424.2 277.8L416.8 262.8L424.4 277.5ZM412.1 251L406.4 240.4L412.4 250.5ZM439.9 311.8L426.8 283.6L440 311.7Z");
  bag.draw("md-yellow", "M445.9 309.4L445.8 309.8L445.7 310.1L445.6 310.3L445.3 310.6L445.1 310.7L444.8 310.8L444.4 310.9L444.1 310.8L443.8 310.7L443.5 310.6L443.3 310.3L443.1 310.1L443 309.8L443 309.4L443 309.1L443.1 308.8L443.3 308.5L443.5 308.3L443.8 308.1L444.1 308L444.4 308L444.8 308L445.1 308.1L445.3 308.3L445.6 308.5L445.7 308.8L445.8 309.1Z");
  bag.draw("md-yellow", "M435.9 313.3L435.9 313.6L435.8 313.9L435.6 314.2L435.4 314.4L435.1 314.6L434.8 314.7L434.5 314.7L434.1 314.7L433.8 314.6L433.6 314.4L433.3 314.2L433.2 313.9L433.1 313.6L433 313.3L433.1 313L433.2 312.7L433.3 312.4L433.6 312.2L433.8 312L434.1 311.9L434.5 311.8L434.8 311.9L435.1 312L435.4 312.2L435.6 312.4L435.8 312.7L435.9 313Z");
  bag.draw("md-yellow", "M434.5 284.6L434.5 284.9L434.4 285.2L434.2 285.5L434 285.7L433.7 285.9L433.4 286L433.1 286L432.8 286L432.5 285.9L432.2 285.7L432 285.5L431.8 285.2L431.7 284.9L431.6 284.6L431.7 284.3L431.8 284L432 283.7L432.2 283.5L432.5 283.3L432.8 283.2L433.1 283.1L433.4 283.2L433.7 283.3L434 283.5L434.2 283.7L434.4 284L434.5 284.3Z");
  bag.draw("md-yellow", "M424.6 290.1L424.5 290.5L424.4 290.8L424.3 291L424 291.3L423.8 291.4L423.4 291.5L423.1 291.6L422.8 291.5L422.5 291.4L422.2 291.3L422 291L421.8 290.8L421.7 290.5L421.7 290.1L421.7 289.8L421.8 289.5L422 289.2L422.2 289L422.5 288.8L422.8 288.7L423.1 288.7L423.4 288.7L423.8 288.8L424 289L424.3 289.2L424.4 289.5L424.5 289.8Z");
  bag.draw("md-yellow", "M423.5 261.3L423.5 261.7L423.4 262L423.2 262.2L423 262.5L422.7 262.6L422.4 262.8L422.1 262.8L421.8 262.8L421.5 262.6L421.2 262.5L421 262.2L420.8 262L420.7 261.7L420.7 261.3L420.7 261L420.8 260.7L421 260.4L421.2 260.2L421.5 260L421.8 259.9L422.1 259.9L422.4 259.9L422.7 260L423 260.2L423.2 260.4L423.4 260.7L423.5 261Z");
  bag.draw("md-yellow", "M413.8 265.8L413.8 266.1L413.7 266.4L413.5 266.7L413.3 266.9L413 267.1L412.7 267.2L412.4 267.2L412.1 267.2L411.7 267.1L411.5 266.9L411.2 266.7L411.1 266.4L411 266.1L410.9 265.8L411 265.5L411.1 265.2L411.2 264.9L411.5 264.6L411.7 264.5L412.1 264.4L412.4 264.3L412.7 264.4L413 264.5L413.3 264.6L413.5 264.9L413.7 265.2L413.8 265.5Z");
  bag.draw("md-yellow", "M411.8 236.8L411.8 237.1L411.7 237.4L411.5 237.7L411.3 237.9L411 238.1L410.7 238.2L410.4 238.2L410.1 238.2L409.8 238.1L409.5 237.9L409.3 237.7L409.1 237.4L409 237.1L408.9 236.8L409 236.5L409.1 236.2L409.3 235.9L409.5 235.7L409.8 235.5L410.1 235.4L410.4 235.4L410.7 235.4L411 235.5L411.3 235.7L411.5 235.9L411.7 236.2L411.8 236.5Z");
  bag.draw("md-yellow", "M402.1 241.2L402.1 241.6L402 241.9L401.8 242.1L401.6 242.4L401.3 242.5L401 242.6L400.7 242.7L400.4 242.6L400 242.5L399.8 242.4L399.5 242.1L399.4 241.9L399.3 241.6L399.2 241.2L399.3 240.9L399.4 240.6L399.5 240.3L399.8 240.1L400 239.9L400.4 239.8L400.7 239.8L401 239.8L401.3 239.9L401.6 240.1L401.8 240.3L402 240.6L402.1 240.9Z");
  bag.draw("md-007a50", "M396.4 220.1L401.6 229.4L396.7 220.2ZM393.6 229.2L401 233.2L401.9 235.6L398.6 234.9L393.8 229.4ZM404.5 221.1L405.3 232.7L404.8 221.6ZM398.7 246.8L409.6 251.9L399 246.8ZM399.5 252.4L408.8 256.8L399.9 252.4ZM412.7 239.3L413.3 249.4L413.2 239.9ZM417.9 242.5L416.5 255.6L419.7 249.4L418 242.7ZM411.3 272.7L423.7 279.9L412.4 272.6ZM411 280.2L423.6 281.7L412 281ZM427 262.7L423.9 272.2L426.1 275.2L427.3 263.3ZM431.8 266.8L427.9 278.7L432.1 274.7L431.8 267ZM439.6 287.3L441.6 295.4L438.3 301.5L435.8 293.9L439.4 287.5ZM445.9 294.2L439.7 301.8L439.9 304.4L443.6 302.4L445.8 294.5ZM421 304.8L434.2 307.9L427.2 309L421.1 304.9ZM420.1 298.3L432.7 304.7L430.8 300.7L420.3 298.3Z");
  bag.draw("black", "M607 223.3L606.3 228.7L599.4 228.8L595.6 248.7L564.5 303.9L562.2 313.2L568.2 314.9L599.4 250.7L613.1 236.2L609.3 230.2L613.3 226.5L613.3 218.7ZM552.4 332.2L549.8 343.4L557 338.3L556.9 332.8L553.1 331.6Z");
  bag.draw("md-yellow", "M608.4 223.6L612.2 225.5L612.1 221ZM606.9 226.3L610.6 228.7L607.6 225.6ZM600.5 229.8L598.4 243.9L602.5 230.9L606.2 229.8L600.7 229.8ZM600.8 245.4L608.7 234.3L607.3 230.5L603.3 231.6L599 244.5ZM609.7 234.6L601.7 245.6L611.8 235.6L609.4 233.6ZM596.3 254.8L600.4 247.2L596.9 246.7L587.7 266.1L590.1 267.1ZM585.3 268.8L589.2 270.8L585.7 268.4ZM583 272.3L586.9 275.3L583.7 271.7ZM581.6 276.2L585.4 278.1L581.7 276ZM580.6 279.9L565.4 304.5L567.2 309.1L571.8 308L583 280.9L581 279.4ZM563.1 311.5L567.7 313.8L563.9 310.7ZM550.7 334.8L550.7 341.5L556.1 337.6L551.6 334.8ZM554.1 185.3L559 178L441 178L445.9 185.3L445.9 274.2L450.7 281.5L500 309.1L546.2 283.8L554.1 273.1Z");
  bag.draw("md-red", "M448.7 235L447.2 180.8L552.8 180.8L551.4 235L500 250.5Z");
  bag.draw("md-0046ae", "M551.4 235L448.7 235L450 276.4L500 304.4L542.6 282.6L551.3 273.1Z");
  bag.draw("black", "M518.8 233L532.8 223.2L537.1 208.8L532.9 196.6L518.2 182.2L524.1 211.4L519.8 219.3L510.4 223.3L505.6 220.6L489.7 223.3L478.6 217.7L475.7 206.2L481.8 182.2L466.3 197.9L463 206.7L464.8 218.8L471.1 227.5L481.2 233L476 242.5L487.6 246.3L491.4 253.8L491.2 273.5L483.5 286.7L500 295.8L516.2 287.2L516.6 282.7L508.7 272.9L508.6 253.8L512.4 246.3L524 242.5ZM500 183.6L496.8 192.6L488.1 188.5L492.3 197.2L483.2 200.4L492.3 203.6L488.1 212.2L496.8 208.1L500 217.2L503.2 208.1L511.9 212.2L507.8 203.6L516.8 200.4L507.8 197.2L511.9 188.5L503.2 192.6ZM480.5 234.4L464.9 226L448.7 235L464.9 244.5L480.3 234.5Z");
  bag.draw("black", "M519.6 234.4L535.1 244.5L551.4 235L535.1 226L519.7 234.4ZM485.1 246.5L480.7 250.9L485.1 255.3L489.5 250.9ZM514.9 246.5L510.5 250.9L514.9 255.3L519.3 250.9ZM484 272.2L483.4 280.7L488.9 276.9L491.4 264.3L489.1 256.9L481 255.3L483.9 269.3ZM510.9 256.9L509.1 272.6L516.6 280.7L519 255.3ZM464.9 257.2L454.7 269.8L460.8 274.8L460.9 281.1L465.8 283.1L470.2 278.6L478.5 279L476.7 270.9L480.3 265.7L478 261.5L471.4 262.3L465.5 257.1ZM520.3 272.4L530.6 283.4L530.8 271.4L542.8 267.4L529.8 261L523 264.3L520.3 271Z");
  bag.draw("md-yellow", "M473 207.6L475.6 218L482.3 223.2L500 225.7L519.2 222.7L527 209.3L520.9 187.8L532 200.2L534.3 210.6L529.3 223.2L515.8 231.6L520 241L510.7 244.7L507.3 250.7L506.5 274.7L514.4 285.6L498.6 293.1L485.4 284.6L493.7 274.1L492.3 249.1L480.1 241L484.2 231.6L471.9 224.4L466.3 214.4L467.4 201.4L479.1 187.8L473.1 205.8ZM493 283.2L487 285.1L493 287L493 283.2ZM507.1 283.2L507.1 287L512.8 285.6L509.1 283.3ZM500 189.7L502.1 195.4L507.6 192.8L505 198.3L510.7 200.4L505 202.4L507.6 207.9L502.1 205.3L500 211.1L498 205.3L492.4 207.9L495.1 202.4L489.3 200.4L495.1 198.3L492.4 192.8L498 195.4ZM454.1 235.2L464.8 241.9L474.4 234.7L464.7 228.8L454.2 235.1ZM546 235.2L535.2 241.9L525.6 234.7L535.3 228.8L545.8 235.1ZM485.1 248.6L485.1 253.2L482.8 250.9ZM514.9 248.6L514.9 253.2L512.6 250.9ZM488.2 258.6L489.5 270.6L485.8 276.4L483.9 257.7ZM516.2 257.7L514.2 276.4L510.5 270.6L511.8 258.6ZM470.3 262.3L462.5 264.5L464.8 259.6L470.1 261.6ZM476.4 269.9L472.1 263L477.7 264.3L477 269.5ZM471.1 278L476.3 271.8L477.2 276.9L471.6 278.4ZM461.7 275.4L469.3 278.3L464.6 280.9L461.5 276.1ZM461.2 265.7L460.9 273.8L456.9 270.2L460.5 265.7Z");
  bag.draw("md-yellow", "M472.1 270.3L472 271.1L471.7 272L471.2 272.7L470.6 273.3L469.9 273.8L469 274.1L468.1 274.2L467.3 274.1L466.4 273.8L465.7 273.3L465.1 272.7L464.6 272L464.3 271.1L464.2 270.3L464.3 269.4L464.6 268.6L465.1 267.8L465.7 267.2L466.4 266.7L467.3 266.4L468.1 266.3L469 266.4L469.9 266.7L470.6 267.2L471.2 267.8L471.7 268.6L472 269.4Z");
  bag.draw("md-yellow", "M537.1 265L528.7 270.3L526.5 278.7L523.6 267.2L528.4 263.6L536.2 264.5Z");
  bag.draw("black", "M556.7 178.9L443.3 178.9L446.8 185.3L447.3 276.1L456 284.2L500 307.7L544 284.1L552.6 276.1L553.2 185.3L555.9 179.7ZM555 185.3L554.3 276.8L545.8 285.1L500 310.4L445.9 277.3L445 185.3L440.5 177.1L559.5 177.1L555.5 183.4ZM552.3 179.9L551.6 275.4L542.6 283.6L500 305.8L458.1 284.1L448.3 275.3L445.4 179.9L550.8 179.9ZM550.8 181.7L448.8 181.7L450 274.7L500 303.1L550 274.7L551.2 181.7Z");
  bag.box(1000, 500);
  return bag.done("0 0 1000 500");
}


function doonfSanMarino() {
  var bag = doonfBag();
  bag.draw("sm-blue", "M0 0L800 0L800 600L0 600Z");
  bag.draw("white", "M0 0L800 0L800 300L0 300Z");
  bag.draw("white", "M463 171.2L462.9 172L462.7 172.8L462.2 173.5L461.7 174L461 174.5L460.2 174.7L459.4 174.8L458.6 174.7L457.9 174.5L457.2 174L456.6 173.5L456.2 172.8L456 172L455.9 171.2L456 170.4L456.2 169.7L456.6 169L457.2 168.4L457.9 168L458.6 167.7L459.4 167.7L460.2 167.7L461 168L461.7 168.4L462.2 169L462.7 169.7L462.9 170.4Z");
  bag.cut("black", "M463.9 171.2L463.8 172.2L463.5 173.2L463 174L462.3 174.8L461.4 175.3L460.4 175.6L459.4 175.7L458.4 175.6L457.5 175.3L456.6 174.8L455.9 174L455.4 173.2L455 172.2L454.9 171.2L455 170.2L455.4 169.3L455.9 168.4L456.6 167.7L457.5 167.2L458.4 166.8L459.4 166.7L460.4 166.8L461.4 167.2L462.3 167.7L463 168.4L463.5 169.3L463.8 170.2ZM462.9 170.4L462.7 169.7L462.2 169L461.7 168.4L461 168L460.2 167.7L459.4 167.7L458.6 167.7L457.9 168L457.2 168.4L456.6 169L456.2 169.7L456 170.4L455.9 171.2L456 172L456.2 172.8L456.6 173.5L457.2 174L457.9 174.5L458.6 174.7L459.4 174.8L460.2 174.7L461 174.5L461.7 174L462.2 173.5L462.7 172.8L462.9 172L463 171.2Z");
  bag.draw("white", "M466.3 157L466.2 158.1L465.8 159L465.3 159.9L464.6 160.6L463.7 161.2L462.7 161.5L461.7 161.6L460.7 161.5L459.7 161.2L458.8 160.6L458.1 159.9L457.5 159L457.2 158.1L457.1 157L457.2 156L457.5 155L458.1 154.1L458.8 153.4L459.7 152.9L460.7 152.5L461.7 152.4L462.7 152.5L463.7 152.9L464.6 153.4L465.3 154.1L465.8 155L466.2 156Z");
  bag.cut("black", "M467.2 157L467.1 158.3L466.7 159.4L466 160.5L465.1 161.4L464.1 162L462.9 162.4L461.7 162.6L460.5 162.4L459.3 162L458.2 161.4L457.4 160.5L456.7 159.4L456.3 158.3L456.1 157L456.3 155.8L456.7 154.6L457.4 153.6L458.2 152.7L459.3 152L460.5 151.6L461.7 151.5L462.9 151.6L464.1 152L465.1 152.7L466 153.6L466.7 154.6L467.1 155.8ZM466.2 156L465.8 155L465.3 154.1L464.6 153.4L463.7 152.9L462.7 152.5L461.7 152.4L460.7 152.5L459.7 152.9L458.8 153.4L458.1 154.1L457.5 155L457.2 156L457.1 157L457.2 158.1L457.5 159L458.1 159.9L458.8 160.6L459.7 161.2L460.7 161.5L461.7 161.6L462.7 161.5L463.7 161.2L464.6 160.6L465.3 159.9L465.8 159L466.2 158.1L466.3 157Z");
  bag.draw("white", "M379.8 141.7L379.7 142.5L379.5 143.2L379.1 143.9L378.5 144.4L377.9 144.8L377.2 145.1L376.4 145.2L375.6 145.1L374.9 144.8L374.2 144.4L373.7 143.9L373.3 143.2L373 142.5L372.9 141.7L373 141L373.3 140.2L373.7 139.6L374.2 139L374.9 138.6L375.6 138.4L376.4 138.3L377.2 138.4L377.9 138.6L378.5 139L379.1 139.6L379.5 140.2L379.7 141Z");
  bag.cut("black", "M380.8 141.7L380.7 142.7L380.3 143.6L379.8 144.4L379.1 145.1L378.3 145.7L377.4 146L376.4 146.1L375.4 146L374.5 145.7L373.7 145.1L373 144.4L372.4 143.6L372.1 142.7L372 141.7L372.1 140.7L372.4 139.8L373 139L373.7 138.3L374.5 137.8L375.4 137.5L376.4 137.3L377.4 137.5L378.3 137.8L379.1 138.3L379.8 139L380.3 139.8L380.7 140.7ZM379.7 141L379.5 140.2L379.1 139.6L378.5 139L377.9 138.6L377.2 138.4L376.4 138.3L375.6 138.4L374.9 138.6L374.2 139L373.7 139.6L373.3 140.2L373 141L372.9 141.7L373 142.5L373.3 143.2L373.7 143.9L374.2 144.4L374.9 144.8L375.6 145.1L376.4 145.2L377.2 145.1L377.9 144.8L378.5 144.4L379.1 143.9L379.5 143.2L379.7 142.5L379.8 141.7Z");
  bag.draw("white", "M343.1 157L343 158.1L342.6 159L342.1 159.9L341.3 160.6L340.5 161.2L339.5 161.5L338.5 161.6L337.4 161.5L336.5 161.2L335.6 160.6L334.9 159.9L334.3 159L334 158.1L333.9 157L334 156L334.3 155L334.9 154.1L335.6 153.4L336.5 152.9L337.4 152.5L338.5 152.4L339.5 152.5L340.5 152.9L341.3 153.4L342.1 154.1L342.6 155L343 156Z");
  bag.cut("black", "M344 157L343.9 158.3L343.5 159.4L342.8 160.5L341.9 161.4L340.9 162L339.7 162.4L338.5 162.6L337.2 162.4L336.1 162L335 161.4L334.1 160.5L333.5 159.4L333.1 158.3L332.9 157L333.1 155.8L333.5 154.6L334.1 153.6L335 152.7L336.1 152L337.2 151.6L338.5 151.5L339.7 151.6L340.9 152L341.9 152.7L342.8 153.6L343.5 154.6L343.9 155.8ZM343 156L342.6 155L342.1 154.1L341.3 153.4L340.5 152.9L339.5 152.5L338.5 152.4L337.4 152.5L336.5 152.9L335.6 153.4L334.9 154.1L334.3 155L334 156L333.9 157L334 158.1L334.3 159L334.9 159.9L335.6 160.6L336.5 161.2L337.4 161.5L338.5 161.6L339.5 161.5L340.5 161.2L341.3 160.6L342.1 159.9L342.6 159L343 158.1L343.1 157Z");
  bag.draw("white", "M365.4 143.4L365.3 144.2L365 145L364.6 145.7L364 146.3L363.3 146.7L362.5 147L361.7 147.1L360.8 147L360 146.7L359.3 146.3L358.7 145.7L358.3 145L358 144.2L357.9 143.4L358 142.5L358.3 141.7L358.7 141L359.3 140.4L360 140L360.8 139.7L361.7 139.6L362.5 139.7L363.3 140L364 140.4L364.6 141L365 141.7L365.3 142.5Z");
  bag.cut("black", "M366.4 143.4L366.2 144.4L365.9 145.4L365.3 146.3L364.6 147L363.7 147.6L362.7 147.9L361.7 148.1L360.6 147.9L359.6 147.6L358.7 147L358 146.3L357.4 145.4L357.1 144.4L357 143.4L357.1 142.3L357.4 141.3L358 140.4L358.7 139.7L359.6 139.1L360.6 138.8L361.7 138.7L362.7 138.8L363.7 139.1L364.6 139.7L365.3 140.4L365.9 141.3L366.2 142.3ZM365.3 142.5L365 141.7L364.6 141L364 140.4L363.3 140L362.5 139.7L361.7 139.6L360.8 139.7L360 140L359.3 140.4L358.7 141L358.3 141.7L358 142.5L357.9 143.4L358 144.2L358.3 145L358.7 145.7L359.3 146.3L360 146.7L360.8 147L361.7 147.1L362.5 147L363.3 146.7L364 146.3L364.6 145.7L365 145L365.3 144.2L365.4 143.4Z");
  bag.draw("white", "M344.3 171.2L344.2 172L343.9 172.8L343.5 173.5L343 174L342.3 174.5L341.5 174.7L340.7 174.8L339.9 174.7L339.2 174.5L338.5 174L337.9 173.5L337.5 172.8L337.2 172L337.1 171.2L337.2 170.4L337.5 169.7L337.9 169L338.5 168.4L339.2 168L339.9 167.7L340.7 167.7L341.5 167.7L342.3 168L343 168.4L343.5 169L343.9 169.7L344.2 170.4Z");
  bag.cut("black", "M345.2 171.2L345.1 172.2L344.8 173.2L344.2 174L343.5 174.8L342.7 175.3L341.7 175.6L340.7 175.7L339.7 175.6L338.8 175.3L337.9 174.8L337.2 174L336.7 173.2L336.3 172.2L336.2 171.2L336.3 170.2L336.7 169.3L337.2 168.4L337.9 167.7L338.8 167.2L339.7 166.8L340.7 166.7L341.7 166.8L342.7 167.2L343.5 167.7L344.2 168.4L344.8 169.3L345.1 170.2ZM344.2 170.4L343.9 169.7L343.5 169L343 168.4L342.3 168L341.5 167.7L340.7 167.7L339.9 167.7L339.2 168L338.5 168.4L337.9 169L337.5 169.7L337.2 170.4L337.1 171.2L337.2 172L337.5 172.8L337.9 173.5L338.5 174L339.2 174.5L339.9 174.7L340.7 174.8L341.5 174.7L342.3 174.5L343 174L343.5 173.5L343.9 172.8L344.2 172L344.3 171.2Z");
  bag.draw("white", "M351.3 147.1L351.2 148.1L350.9 149L350.3 149.9L349.6 150.6L348.8 151.1L347.9 151.4L346.9 151.5L345.9 151.4L345 151.1L344.1 150.6L343.4 149.9L342.9 149L342.6 148.1L342.5 147.1L342.6 146.1L342.9 145.2L343.4 144.4L344.1 143.7L345 143.1L345.9 142.8L346.9 142.7L347.9 142.8L348.8 143.1L349.6 143.7L350.3 144.4L350.9 145.2L351.2 146.1Z");
  bag.cut("black", "M352.2 147.1L352.1 148.3L351.7 149.4L351.1 150.5L350.2 151.3L349.2 151.9L348.1 152.3L346.9 152.5L345.7 152.3L344.5 151.9L343.5 151.3L342.7 150.5L342 149.4L341.7 148.3L341.5 147.1L341.7 145.9L342 144.8L342.7 143.8L343.5 142.9L344.5 142.3L345.7 141.9L346.9 141.8L348.1 141.9L349.2 142.3L350.2 142.9L351.1 143.8L351.7 144.8L352.1 145.9ZM351.2 146.1L350.9 145.2L350.3 144.4L349.6 143.7L348.8 143.1L347.9 142.8L346.9 142.7L345.9 142.8L345 143.1L344.1 143.7L343.4 144.4L342.9 145.2L342.6 146.1L342.5 147.1L342.6 148.1L342.9 149L343.4 149.9L344.1 150.6L345 151.1L345.9 151.4L346.9 151.5L347.9 151.4L348.8 151.1L349.6 150.6L350.3 149.9L350.9 149L351.2 148.1L351.3 147.1Z");
  bag.draw("white", "M427.2 141.7L427.1 142.5L426.9 143.2L426.5 143.9L425.9 144.4L425.3 144.8L424.5 145.1L423.8 145.2L423 145.1L422.3 144.8L421.6 144.4L421.1 143.9L420.7 143.2L420.4 142.5L420.3 141.7L420.4 141L420.7 140.2L421.1 139.6L421.6 139L422.3 138.6L423 138.4L423.8 138.3L424.5 138.4L425.3 138.6L425.9 139L426.5 139.6L426.9 140.2L427.1 141Z");
  bag.cut("black", "M428.1 141.7L428 142.7L427.7 143.6L427.2 144.4L426.5 145.1L425.7 145.7L424.7 146L423.8 146.1L422.8 146L421.9 145.7L421 145.1L420.3 144.4L419.8 143.6L419.5 142.7L419.4 141.7L419.5 140.7L419.8 139.8L420.3 139L421 138.3L421.9 137.8L422.8 137.5L423.8 137.3L424.7 137.5L425.7 137.8L426.5 138.3L427.2 139L427.7 139.8L428 140.7ZM427.1 141L426.9 140.2L426.5 139.6L425.9 139L425.3 138.6L424.5 138.4L423.8 138.3L423 138.4L422.3 138.6L421.6 139L421.1 139.6L420.7 140.2L420.4 141L420.3 141.7L420.4 142.5L420.7 143.2L421.1 143.9L421.6 144.4L422.3 144.8L423 145.1L423.8 145.2L424.5 145.1L425.3 144.8L425.9 144.4L426.5 143.9L426.9 143.2L427.1 142.5L427.2 141.7Z");
  bag.draw("white", "M442.2 143.4L442.1 144.2L441.9 145L441.4 145.7L440.8 146.3L440.1 146.7L439.3 147L438.5 147.1L437.7 147L436.9 146.7L436.2 146.3L435.6 145.7L435.1 145L434.8 144.2L434.7 143.4L434.8 142.5L435.1 141.7L435.6 141L436.2 140.4L436.9 140L437.7 139.7L438.5 139.6L439.3 139.7L440.1 140L440.8 140.4L441.4 141L441.9 141.7L442.1 142.5Z");
  bag.cut("black", "M443.2 143.4L443.1 144.4L442.7 145.4L442.2 146.3L441.4 147L440.5 147.6L439.5 147.9L438.5 148.1L437.4 147.9L436.5 147.6L435.6 147L434.8 146.3L434.3 145.4L433.9 144.4L433.8 143.4L433.9 142.3L434.3 141.3L434.8 140.4L435.6 139.7L436.5 139.1L437.4 138.8L438.5 138.7L439.5 138.8L440.5 139.1L441.4 139.7L442.2 140.4L442.7 141.3L443.1 142.3ZM442.1 142.5L441.9 141.7L441.4 141L440.8 140.4L440.1 140L439.3 139.7L438.5 139.6L437.7 139.7L436.9 140L436.2 140.4L435.6 141L435.1 141.7L434.8 142.5L434.7 143.4L434.8 144.2L435.1 145L435.6 145.7L436.2 146.3L436.9 146.7L437.7 147L438.5 147.1L439.3 147L440.1 146.7L440.8 146.3L441.4 145.7L441.9 145L442.1 144.2L442.2 143.4Z");
  bag.draw("white", "M457.7 147.1L457.6 148.1L457.3 149L456.7 149.9L456 150.6L455.2 151.1L454.3 151.4L453.3 151.5L452.3 151.4L451.4 151.1L450.5 150.6L449.8 149.9L449.3 149L449 148.1L448.9 147.1L449 146.1L449.3 145.2L449.8 144.4L450.5 143.7L451.4 143.1L452.3 142.8L453.3 142.7L454.3 142.8L455.2 143.1L456 143.7L456.7 144.4L457.3 145.2L457.6 146.1Z");
  bag.cut("black", "M458.6 147.1L458.5 148.3L458.1 149.4L457.5 150.5L456.6 151.3L455.6 151.9L454.5 152.3L453.3 152.5L452.1 152.3L451 151.9L450 151.3L449.1 150.5L448.5 149.4L448.1 148.3L447.9 147.1L448.1 145.9L448.5 144.8L449.1 143.8L450 142.9L451 142.3L452.1 141.9L453.3 141.8L454.5 141.9L455.6 142.3L456.6 142.9L457.5 143.8L458.1 144.8L458.5 145.9ZM457.6 146.1L457.3 145.2L456.7 144.4L456 143.7L455.2 143.1L454.3 142.8L453.3 142.7L452.3 142.8L451.4 143.1L450.5 143.7L449.8 144.4L449.3 145.2L449 146.1L448.9 147.1L449 148.1L449.3 149L449.8 149.9L450.5 150.6L451.4 151.1L452.3 151.4L453.3 151.5L454.3 151.4L455.2 151.1L456 150.6L456.7 149.9L457.3 149L457.6 148.1L457.7 147.1Z");
  bag.cut("black", "M464.4 171.2L464.3 172.3L463.9 173.4L463.4 174.4L462.6 175.1L461.6 175.7L460.6 176.1L459.4 176.2L458.3 176.1L457.3 175.7L456.3 175.1L455.5 174.4L454.9 173.4L454.6 172.3L454.4 171.2L454.6 170.1L454.9 169.1L455.5 168.1L456.3 167.3L457.3 166.7L458.3 166.4L459.4 166.2L460.6 166.4L461.6 166.7L462.6 167.3L463.4 168.1L463.9 169.1L464.3 170.1ZM463.3 170.4L463 169.5L462.5 168.8L461.9 168.2L461.1 167.7L460.3 167.4L459.4 167.3L458.6 167.4L457.7 167.7L457 168.2L456.4 168.8L455.9 169.5L455.6 170.4L455.5 171.2L455.6 172.1L455.9 172.9L456.4 173.7L457 174.3L457.7 174.8L458.6 175L459.4 175.1L460.3 175L461.1 174.8L461.9 174.3L462.5 173.7L463 172.9L463.3 172.1L463.4 171.2Z");
  bag.cut("black", "M467.8 157L467.7 158.4L467.2 159.7L466.5 160.9L465.5 161.8L464.4 162.6L463.1 163L461.7 163.2L460.3 163L459 162.6L457.9 161.8L456.9 160.9L456.2 159.7L455.7 158.4L455.5 157L455.7 155.7L456.2 154.4L456.9 153.2L457.9 152.2L459 151.5L460.3 151L461.7 150.9L463.1 151L464.4 151.5L465.5 152.2L466.5 153.2L467.2 154.4L467.7 155.7ZM466.6 155.9L466.2 154.8L465.6 153.9L464.8 153.1L463.9 152.5L462.8 152.1L461.7 152L460.6 152.1L459.5 152.5L458.5 153.1L457.7 153.9L457.1 154.8L456.8 155.9L456.6 157L456.8 158.2L457.1 159.2L457.7 160.2L458.5 161L459.5 161.6L460.6 162L461.7 162.1L462.8 162L463.9 161.6L464.8 161L465.6 160.2L466.2 159.2L466.6 158.2L466.7 157Z");
  bag.cut("black", "M381.2 141.7L381.1 142.8L380.8 143.8L380.2 144.7L379.4 145.5L378.5 146.1L377.5 146.5L376.4 146.6L375.3 146.5L374.3 146.1L373.4 145.5L372.6 144.7L372 143.8L371.7 142.8L371.5 141.7L371.7 140.6L372 139.6L372.6 138.7L373.4 137.9L374.3 137.3L375.3 137L376.4 136.9L377.5 137L378.5 137.3L379.4 137.9L380.2 138.7L380.8 139.6L381.1 140.6ZM380.1 140.9L379.8 140.1L379.3 139.4L378.7 138.8L378 138.3L377.2 138.1L376.4 138L375.6 138.1L374.8 138.3L374 138.8L373.4 139.4L373 140.1L372.7 140.9L372.6 141.7L372.7 142.6L373 143.4L373.4 144.1L374 144.7L374.8 145.1L375.6 145.4L376.4 145.5L377.2 145.4L378 145.1L378.7 144.7L379.3 144.1L379.8 143.4L380.1 142.6L380.2 141.7Z");
  bag.cut("black", "M344.6 157L344.5 158.4L344 159.7L343.3 160.9L342.3 161.8L341.1 162.6L339.8 163L338.5 163.2L337.1 163L335.8 162.6L334.6 161.8L333.7 160.9L332.9 159.7L332.5 158.4L332.3 157L332.5 155.7L332.9 154.4L333.7 153.2L334.6 152.2L335.8 151.5L337.1 151L338.5 150.9L339.8 151L341.1 151.5L342.3 152.2L343.3 153.2L344 154.4L344.5 155.7ZM343.4 155.9L343 154.8L342.4 153.9L341.6 153.1L340.7 152.5L339.6 152.1L338.5 152L337.3 152.1L336.3 152.5L335.3 153.1L334.5 153.9L333.9 154.8L333.5 155.9L333.4 157L333.5 158.2L333.9 159.2L334.5 160.2L335.3 161L336.3 161.6L337.3 162L338.5 162.1L339.6 162L340.7 161.6L341.6 161L342.4 160.2L343 159.2L343.4 158.2L343.5 157Z");
  bag.cut("black", "M366.9 143.4L366.7 144.5L366.3 145.6L365.7 146.6L364.9 147.4L363.9 148L362.8 148.4L361.7 148.6L360.5 148.4L359.4 148L358.4 147.4L357.6 146.6L357 145.6L356.6 144.5L356.5 143.4L356.6 142.2L357 141.1L357.6 140.1L358.4 139.3L359.4 138.7L360.5 138.3L361.7 138.2L362.8 138.3L363.9 138.7L364.9 139.3L365.7 140.1L366.3 141.1L366.7 142.2ZM365.7 142.5L365.4 141.6L364.9 140.8L364.2 140.2L363.4 139.7L362.6 139.4L361.7 139.3L360.8 139.4L359.9 139.7L359.1 140.2L358.5 140.8L358 141.6L357.7 142.5L357.6 143.4L357.7 144.3L358 145.1L358.5 145.9L359.1 146.6L359.9 147.1L360.8 147.4L361.7 147.5L362.6 147.4L363.4 147.1L364.2 146.6L364.9 145.9L365.4 145.1L365.7 144.3L365.8 143.4Z");
  bag.cut("black", "M345.7 171.2L345.6 172.3L345.2 173.4L344.6 174.4L343.8 175.1L342.9 175.7L341.8 176.1L340.7 176.2L339.6 176.1L338.5 175.7L337.6 175.1L336.8 174.4L336.2 173.4L335.8 172.3L335.7 171.2L335.8 170.1L336.2 169.1L336.8 168.1L337.6 167.3L338.5 166.7L339.6 166.4L340.7 166.2L341.8 166.4L342.9 166.7L343.8 167.3L344.6 168.1L345.2 169.1L345.6 170.1ZM344.5 170.4L344.2 169.5L343.8 168.8L343.2 168.2L342.4 167.7L341.6 167.4L340.7 167.3L339.8 167.4L339 167.7L338.3 168.2L337.7 168.8L337.2 169.5L336.9 170.4L336.8 171.2L336.9 172.1L337.2 172.9L337.7 173.7L338.3 174.3L339 174.8L339.8 175L340.7 175.1L341.6 175L342.4 174.8L343.2 174.3L343.8 173.7L344.2 172.9L344.5 172.1L344.6 171.2Z");
  bag.cut("black", "M352.8 147.1L352.7 148.4L352.2 149.7L351.5 150.8L350.6 151.8L349.4 152.5L348.2 152.9L346.9 153.1L345.6 152.9L344.3 152.5L343.2 151.8L342.2 150.8L341.5 149.7L341.1 148.4L340.9 147.1L341.1 145.8L341.5 144.5L342.2 143.4L343.2 142.5L344.3 141.8L345.6 141.3L346.9 141.2L348.2 141.3L349.4 141.8L350.6 142.5L351.5 143.4L352.2 144.5L352.7 145.8ZM351.6 146L351.2 145L350.7 144.1L349.9 143.3L349 142.8L347.9 142.4L346.9 142.3L345.8 142.4L344.8 142.8L343.9 143.3L343.1 144.1L342.5 145L342.2 146L342 147.1L342.2 148.2L342.5 149.2L343.1 150.1L343.9 150.9L344.8 151.5L345.8 151.8L346.9 152L347.9 151.8L349 151.5L349.9 150.9L350.7 150.1L351.2 149.2L351.6 148.2L351.7 147.1Z");
  bag.cut("black", "M428.6 141.7L428.5 142.8L428.1 143.8L427.6 144.7L426.8 145.5L425.9 146.1L424.8 146.5L423.8 146.6L422.7 146.5L421.7 146.1L420.7 145.5L420 144.7L419.4 143.8L419 142.8L418.9 141.7L419 140.6L419.4 139.6L420 138.7L420.7 137.9L421.7 137.3L422.7 137L423.8 136.9L424.8 137L425.9 137.3L426.8 137.9L427.6 138.7L428.1 139.6L428.5 140.6ZM427.4 140.9L427.2 140.1L426.7 139.4L426.1 138.8L425.4 138.3L424.6 138.1L423.8 138L422.9 138.1L422.1 138.3L421.4 138.8L420.8 139.4L420.4 140.1L420.1 140.9L420 141.7L420.1 142.6L420.4 143.4L420.8 144.1L421.4 144.7L422.1 145.1L422.9 145.4L423.8 145.5L424.6 145.4L425.4 145.1L426.1 144.7L426.7 144.1L427.2 143.4L427.4 142.6L427.5 141.7Z");
  bag.cut("black", "M443.7 143.4L443.6 144.5L443.2 145.6L442.6 146.6L441.7 147.4L440.7 148L439.6 148.4L438.5 148.6L437.3 148.4L436.2 148L435.3 147.4L434.4 146.6L433.8 145.6L433.4 144.5L433.3 143.4L433.4 142.2L433.8 141.1L434.4 140.1L435.3 139.3L436.2 138.7L437.3 138.3L438.5 138.2L439.6 138.3L440.7 138.7L441.7 139.3L442.6 140.1L443.2 141.1L443.6 142.2ZM442.5 142.5L442.2 141.6L441.7 140.8L441.1 140.2L440.3 139.7L439.4 139.4L438.5 139.3L437.6 139.4L436.7 139.7L435.9 140.2L435.3 140.8L434.8 141.6L434.5 142.5L434.4 143.4L434.5 144.3L434.8 145.1L435.3 145.9L435.9 146.6L436.7 147.1L437.6 147.4L438.5 147.5L439.4 147.4L440.3 147.1L441.1 146.6L441.7 145.9L442.2 145.1L442.5 144.3L442.6 143.4Z");
  bag.cut("black", "M459.2 147.1L459.1 148.4L458.6 149.7L457.9 150.8L457 151.8L455.9 152.5L454.6 152.9L453.3 153.1L452 152.9L450.7 152.5L449.6 151.8L448.6 150.8L447.9 149.7L447.5 148.4L447.4 147.1L447.5 145.8L447.9 144.5L448.6 143.4L449.6 142.5L450.7 141.8L452 141.3L453.3 141.2L454.6 141.3L455.9 141.8L457 142.5L457.9 143.4L458.6 144.5L459.1 145.8ZM458 146L457.6 145L457.1 144.1L456.3 143.3L455.4 142.8L454.4 142.4L453.3 142.3L452.2 142.4L451.2 142.8L450.3 143.3L449.5 144.1L448.9 145L448.6 146L448.4 147.1L448.6 148.2L448.9 149.2L449.5 150.1L450.3 150.9L451.2 151.5L452.2 151.8L453.3 152L454.4 151.8L455.4 151.5L456.3 150.9L457.1 150.1L457.6 149.2L458 148.2L458.1 147.1Z");
  bag.draw("black", "M392.5 132L380.8 139.9L349.1 144.3L340.2 149.4L337 155.5L337.6 164.8L350 186.3L370.5 180.9L353.9 165.8L351.6 160.1L353.4 155.1L383.7 147L392.6 138.4L393.1 132.1Z");
  bag.draw("sm-f1bf31", "M392.5 132.5L380.9 140.4L349.9 144.9L341 150L337.9 156L338.7 165.1L351.6 186.3L369.3 180.9L353.2 165.5L352.9 154.9L384.2 146.2L392.6 137.9L393.1 132.5Z");
  bag.draw("black", "M393.7 133.7L380.2 144.3L349 150.3L344.3 160.5L350.7 173.5L361.3 183.3L346.4 164.8L346.7 153.1L353.3 149.1L379.5 145L393.8 134.1Z");
  bag.draw("sm-d99f31", "M357.8 171.3L356.6 174.6L349.1 162.5L351.8 151.9L379.4 145.3L392.2 136.5L389.1 142.3L381 147.7L352.4 155L351.2 161.7L356 169.4Z");
  bag.draw("black", "M350.8 159.4L345.3 156.6L350.9 158.9ZM352.6 154.8L349.2 151.1L353 154.5ZM356.6 148.7L357.7 152.4L356.2 148.8ZM363.7 148.1L364.9 151.2L362.8 148.1ZM370.6 147.4L372.1 150.2L370.2 147.5ZM376.8 146.1L378.8 148.5L376.3 146.3ZM383.1 143.7L385 145.6L382.6 144ZM387.7 140.8L389.1 142.3L387.3 141.1Z");
  bag.draw("black", "M393.5 134.4L383.7 146L351.4 156L352.6 165.6L368.6 180.6L361.5 183L355 176.4L346.8 164.8L346 155.5L351.8 150.1L382.2 144.5L394 134.6L379.4 145L353.3 149L346.7 153.1L346.3 165L361.4 183.6L369.2 180.7L354.4 167.1L352 156.2L384 146.5L394.1 134.5Z");
  bag.draw("black", "M407.5 132L419.2 139.9L450.9 144.3L459.8 149.4L463 155.5L462.4 164.8L450 186.3L429.5 180.9L446.2 165.8L448.4 160.1L446.6 155.1L416.3 147L407.4 138.4L406.9 132.1Z");
  bag.draw("sm-f1bf31", "M407.7 132.5L419.2 140.4L450.3 144.9L459.2 150L462.2 156L461.5 165.1L448.6 186.3L430.9 180.9L447 165.5L447.3 154.9L415.9 146.2L407.5 137.9L407 132.5Z");
  bag.draw("black", "M438.9 183.3L453.7 164.8L453.4 153.1L446.9 149.1L420.7 145L406.4 133.7L420 144.3L448.5 149L455.1 154.5L455.4 162.6L439.9 183.7Z");
  bag.draw("sm-d99f31", "M442.3 171.3L443.6 174.6L451.1 162.5L448.3 151.9L420.7 145.3L408 136.5L411 142.3L419.1 147.7L447.7 155L449 161.7L444.1 169.4Z");
  bag.draw("black", "M449.3 159.4L454.8 156.6L449.3 158.9ZM447.5 154.8L451 151.1L447.1 154.5ZM443.5 148.7L442.5 152.4L444 148.8ZM436.4 148.1L435.3 151.2L437.4 148.1ZM429.5 147.4L428.1 150.2L430 147.5ZM423.3 146.1L421.4 148.5L423.8 146.3ZM417.1 143.7L415.2 145.6L417.5 144ZM412.5 140.8L411 142.3L412.9 141.1Z");
  bag.draw("black", "M406.1 134.5L416.1 146.5L448.2 156.2L445.7 167.1L430.9 180.7L438.8 183.6L453.9 165L453.5 153.1L446.8 149L420.7 145L406.1 134.5L418 144.5L448.4 150.1L454.2 155.5L453.3 164.8L445.1 176.4L438.7 183L431.5 180.6L447.5 165.6L448.7 156L416.4 146L406.7 134.4Z");
  bag.draw("black", "M400.1 166.7L393.2 166.7L389.5 145.1L392.8 133.6L407.4 133.6L410.5 145.1L406.9 166.7Z");
  bag.draw("sm-f1bf31", "M400.1 166.7L393.2 166.7L390 145.7L394 133.6L406.1 133.6L408.8 139.2L406.9 166.7Z");
  bag.draw("sm-d99f31", "M390 144.4L410 145L406.5 162.8L400.1 165.9L393.7 162.8L390 145.1Z");
  bag.draw("black", "M407.1 146.8L406 166.7L403.7 154.8L406.4 143.1L403 133.6L407.6 144.3ZM393.8 166.7L392.8 142.4L395.8 133.6L394.1 166.7Z");
  bag.draw("black", "M400.1 166.2L393.3 166.2L391.3 140.4L394.1 134.1L406.1 134.1L409.5 145.7L406.3 155.7L406.9 166.2L400.1 167.2L407 167.2L410.5 145.7L408 136.2L406.2 133.2L394 133.2L389.5 145.7L393.2 167.2L400.1 167.2Z");
  bag.draw("white", "M403.4 140.6L400.7 143.1L396.7 141.1L399.3 138.2L403.3 140.2Z");
  bag.draw("black", "M403.3 140.4L398.7 142.5L398.1 138.7L404.3 139.8L397 138.1L395.7 141.2L399.2 143.7L404.3 140.6Z");
  bag.draw("white", "M403.2 148.2L403.1 148.9L402.9 149.6L402.5 150.2L402 150.8L401.4 151.1L400.7 151.4L400 151.5L399.3 151.4L398.6 151.1L398 150.8L397.5 150.2L397.1 149.6L396.9 148.9L396.8 148.2L396.9 147.5L397.1 146.8L397.5 146.2L398 145.7L398.6 145.3L399.3 145.1L400 145L400.7 145.1L401.4 145.3L402 145.7L402.5 146.2L402.9 146.8L403.1 147.5Z");
  bag.cut("black", "M404.1 148.2L404 149.2L403.7 150L403.2 150.8L402.6 151.5L401.8 152L400.9 152.3L400 152.4L399.1 152.3L398.2 152L397.4 151.5L396.8 150.8L396.3 150L396 149.2L395.9 148.2L396 147.3L396.3 146.4L396.8 145.6L397.4 145L398.2 144.5L399.1 144.2L400 144.1L400.9 144.2L401.8 144.5L402.6 145L403.2 145.6L403.7 146.4L404 147.3ZM403.1 147.5L402.9 146.8L402.5 146.2L402 145.7L401.4 145.3L400.7 145.1L400 145L399.3 145.1L398.6 145.3L398 145.7L397.5 146.2L397.1 146.8L396.9 147.5L396.8 148.2L396.9 148.9L397.1 149.6L397.5 150.2L398 150.8L398.6 151.1L399.3 151.4L400 151.5L400.7 151.4L401.4 151.1L402 150.8L402.5 150.2L402.9 149.6L403.1 148.9L403.2 148.2Z");
  bag.cut("black", "M404.7 148.2L404.5 149.3L404.2 150.3L403.6 151.1L402.9 151.9L402 152.4L401 152.8L400 152.9L399 152.8L398 152.4L397.1 151.9L396.4 151.1L395.8 150.3L395.5 149.3L395.3 148.2L395.5 147.2L395.8 146.2L396.4 145.3L397.1 144.6L398 144L399 143.7L400 143.6L401 143.7L402 144L402.9 144.6L403.6 145.3L404.2 146.2L404.5 147.2ZM403.5 147.4L403.3 146.7L402.8 146L402.3 145.4L401.6 145L400.8 144.7L400 144.6L399.2 144.7L398.4 145L397.7 145.4L397.2 146L396.7 146.7L396.5 147.4L396.4 148.2L396.5 149L396.7 149.8L397.2 150.5L397.7 151.1L398.4 151.5L399.2 151.8L400 151.9L400.8 151.8L401.6 151.5L402.3 151.1L402.8 150.5L403.3 149.8L403.5 149L403.6 148.2Z");
  bag.draw("black", "M360.8 204L355.4 194.6L363.7 186.7L400 180.7L436.4 186.7L444.7 194.6L439.8 203.8L420.8 197.4L400.1 196.5L379.3 197.4L360.4 204.7L379.5 198.3L400.1 197.4L420.7 198.3L440.7 203.9L445.6 194.3L436.9 185.9L420.6 181.2L400 179.8L379.6 181.2L363.3 185.9L354.5 194.3L360.1 204.6Z");
  bag.draw("sm-f1bf31", "M360.9 203.6L355 194.4L363.5 186.3L379.7 181.7L400.1 180.2L420.5 181.7L436.7 186.3L445.2 194.4L439.3 203.6L420.8 197.9L379.4 197.9Z");
  bag.draw("black", "M358.8 207.3L368.5 199.1L392.9 194.7L420.6 196.2L440.5 205.1L440.5 209.2L435.7 212.7L407.1 217.9L379.4 216.7L359.5 209.2Z");
  bag.draw("sm-f1bf31", "M360.2 207.3L368.6 199.7L396.7 195L421.8 197L439.2 205.3L439.2 209L435 212.3L409.8 217.5L378.2 216.1L360.8 209Z");
  bag.draw("sm-d99f31", "M436.8 208.4L430.6 213.6L407.2 217.6L379.6 216.2L363.9 210.2L363.9 206.6L369.4 203.2L392.8 199.2L420.4 200.6L436.1 206.6Z");
  bag.draw("black", "M436.3 209.2L403.2 213.6L363.4 210.2L400 214.7L436.7 210.2Z");
  bag.draw("black", "M435.7 205.8L403.1 209.8L364 206.7L400.1 210.8L436.1 206.7Z");
  bag.draw("black", "M432.3 203.4L402.9 206.8L367.5 204.3L400.1 207.8L432.6 204.3Z");
  bag.draw("black", "M427.4 201.6L372.5 202.5L400.1 204.7L427.6 202.5Z");
  bag.draw("black", "M419 199.9L381 200.8L419.1 200.8Z");
  bag.draw("black", "M436 208.2L430.2 213L413.9 216.4L379.8 215.5L366.5 211.5L364.6 206.9L386.1 200.5L420.2 201.3L436.9 208.2L433.9 204.5L420.3 200.4L386 199.6L363.9 206.4L363.9 210.5L369.5 213.9L386 217.3L414 217.3L430.5 213.9L436.9 208.6Z");
  bag.draw("black", "M354.8 192.8L340.1 181.9L352.9 180.5L354.3 169.4L364 173.1L366.1 163.2L376.4 168.5L381.1 157.8L390.9 166.3L400.1 153.1L409.2 166.3L419 157.8L423.8 168.5L434 163.2L436.2 173.1L446.3 170.6L447.3 180.5L460.1 181.9L445.2 192.8L437.9 186.3L423.5 180.9L388.7 178.9L367.9 183.6L355.3 191.9Z");
  bag.draw("sm-f1bf31", "M354.8 192L342.6 181.8L353.5 181.4L354.5 170.2L364.3 174.1L366.6 164.1L376.5 169.8L381.3 158.9L391.1 167.4L400.1 154.5L409.1 167.4L418.9 158.9L423.6 169.8L433.6 164.1L435.9 174.1L446.3 171.3L446.7 181.4L457.6 181.8L445.4 192L438.1 185.7L423.6 180.6L388.7 178.7L367.9 183.1L355.3 191.1Z");
  bag.draw("black", "M353 194.2L356.7 187.9L366.7 182.8L396.2 178L427.6 181.2L440.6 186.2L446 191.5L442.6 198.2L440.5 191.5L431.3 186.6L393.7 182.6L368.8 186.6L359.3 191.8L357.5 198.2L353.7 195.7Z");
  bag.draw("sm-f1bf31", "M354.2 193.4L366.1 183.9L396 178.5L427.5 181.8L445.1 190.9L443.6 194.8L438.8 189.5L428.3 185.2L393.7 182.3L369.3 186L355.3 195Z");
  bag.draw("black", "M438 185.6L441.4 178.6L437 185.1ZM425.2 181L430.2 172.1L425.8 181.1ZM413.6 178.9L416.8 168.3L415 179.1ZM374.3 181.2L370 172.1L374.9 181ZM385.2 179.1L383.4 168.3L386.5 178.9ZM362 185.7L358.6 178.6L363.1 185.2Z");
  bag.draw("sm-d99f31", "M361.6 197.4L358.3 194.2L355.9 196.4L358.1 201L361.2 200Z");
  bag.draw("sm-f1bf31", "M359.5 195.1L359.4 198.3L356.5 198.7L359.1 194.9Z");
  bag.draw("black", "M361.3 197.3L358.3 194.4L357.3 200.5L361.3 197.5L359.4 200.4L357.2 196.2L360.6 197.6Z");
  bag.draw("sm-d99f31", "M375.4 192.8L372.4 188L363.4 192.1L365.5 197.4L374.5 194.7Z");
  bag.draw("sm-f1bf31", "M365.5 195.4L372.7 193.2L372.5 188.7L364.2 191.3L364.8 194.7Z");
  bag.draw("black", "M365.6 196L372.9 193.7L373.2 189.3L372.5 192.6L365.3 194.9Z");
  bag.draw("black", "M375.3 192.3L373.3 191.9L375.1 193.4Z");
  bag.draw("sm-f1bf31", "M385.7 189L388.2 187.7L386.3 190ZM382.2 192.3L384.7 191L382.8 193.3ZM378.7 189.7L381.1 188.4L379.2 190.7ZM381.7 186.3L384.2 185.1L382.3 187.4Z");
  bag.draw("sm-d99f31", "M385.8 189.4L388 188.7L386.4 190.1ZM381.8 186.7L384.1 187.4L382.3 186.1ZM378.8 190.1L381.1 190.7L379.3 189.4ZM382.3 192.7L384.7 193.4L382.8 192.1Z");
  bag.draw("black", "M386.2 189.1L388.7 190.1L388.5 187.4L385.3 188.9Z");
  bag.draw("black", "M382.7 192.5L385.3 193.5L385 190.7L381.8 192.2Z");
  bag.draw("black", "M379.1 189.8L381.6 190.8L380 187.6L378.2 189.5Z");
  bag.draw("black", "M382.2 186.5L384.7 187.5L384.5 184.7L381.3 186.2Z");
  bag.draw("sm-d99f31", "M392.9 190.4L395.1 184.4L405 184.4L407.3 190.4L405 192.4L395.1 192.4Z");
  bag.draw("sm-f1bf31", "M405.2 184.8L403.8 190L396.3 189.9L395 184.8Z");
  bag.draw("black", "M393.2 190.4L395.2 184.8L405 184.8L406.9 190.3L405 192L392.6 190.7L405.1 192.7L407.7 190.5L405.1 184L395.1 184L392.5 190.4Z");
  bag.draw("black", "M393.7 190.7L395.9 189.9L393.3 189.7Z");
  bag.draw("black", "M406.9 189.8L404.6 188.9L406.5 190.8Z");
  bag.draw("black", "M395.9 192.3L396.8 190.2L394.9 191.9Z");
  bag.draw("black", "M405.2 191.9L404.3 189.8L404.2 192.3Z");
  bag.draw("black", "M403.9 185.7L403.8 189.5L396.3 189.4L395.1 185.6L396.3 190.5L403.8 190.5L405 185.7Z");
  bag.draw("sm-f1bf31", "M414.4 189L411.9 187.7L413.8 190ZM417.9 192.3L414.9 192.1L417.3 193.3ZM421.4 189.7L419 188.4L420.9 190.7ZM418.4 186.3L415.9 185.1L417.8 187.4Z");
  bag.draw("sm-d99f31", "M414.3 189.4L411.5 189.4L413.7 190.1ZM415.5 186.7L417.7 187.5L416.1 186ZM418.6 190.1L421.3 190.1L419.1 189.3ZM414.9 192.7L417.2 193.5L415.5 192Z");
  bag.draw("black", "M414.8 188.9L411.6 187.4L411.4 190.1L413.9 189.1Z");
  bag.draw("black", "M418.3 192.2L415.1 190.7L414.9 193.5L417.4 192.5Z");
  bag.draw("black", "M421.9 189.5L420.1 187.6L418.5 190.8L421 189.8Z");
  bag.draw("black", "M418.8 186.2L415.6 184.7L415.4 187.5L417.9 186.5Z");
  bag.draw("sm-d99f31", "M424.7 192.8L427.7 188L436.7 192.1L434.6 197.4L425.6 194.7Z");
  bag.draw("sm-f1bf31", "M434.6 195.4L427.4 193.2L427.6 188.7L435.9 191.3L435.3 194.7Z");
  bag.draw("black", "M434.8 194.9L427.6 192.6L426.9 189.3L427.2 193.7L434.5 196Z");
  bag.draw("black", "M425.8 194.8L427.7 193.6L425.3 193.9Z");
  bag.draw("sm-d99f31", "M438.4 197.4L441.7 194.2L444.1 196.4L441.9 201L438.8 200Z");
  bag.draw("sm-f1bf31", "M440 196.6L443.2 196L443.5 198.7L440.7 198.3Z");
  bag.draw("black", "M439.5 197.6L442.9 196.2L440.6 200.4L438.7 197.5L442.7 200.5L441.7 194.4L438.8 197.3Z");
  bag.draw("black", "M424.7 192.9L427.6 188.1L436.2 191.2L436 196.3L424.7 192.7L425.1 195.2L436.7 196.6L436.8 190.6L427.4 187.3L423.9 192.8Z");
  bag.draw("black", "M392.7 186.7L405.3 184.5L407.4 190.4L405.3 192.2L394.8 192.2L392.4 185.9L392 190.7L405.5 193.1L408.2 186.2L405.5 183.7L392.1 186Z");
  bag.draw("black", "M376.2 192.8L372.7 187.3L363.3 190.6L363.4 196.6L375 195.2L375.8 192.5L364.1 196.3L363.9 191.2L372.5 188.1L375.4 192.9Z");
  bag.draw("sm-d99f31", "M408.1 95.9L410.8 100.9L402.6 102.2L403.5 113.8L396.6 113.8L397.6 102.2L390.4 102.2L389 99.2L390.4 96.3L397 96.7L397.1 89.4L400.1 87.8L403.1 89.4L403.2 96.7L406.3 96.2Z");
  bag.draw("sm-f1bf31", "M397.5 91.5L400.1 88.3L398.7 91.5ZM398 96.6L394 99.2L389.9 97.7L397.8 96.8ZM401.3 96.8L410.3 97.7L401.9 98.1Z");
  bag.draw("black", "M407.5 96.7L409.9 98L408.9 101.5L401.5 101.4L402.2 112.6L397.9 112.6L398.6 101.4L389.9 99.3L397.9 97.3L397.4 91.5L400.1 88.8L402.8 91.5L402.3 97.3L407.7 96.7L402.9 96.6L403.2 89.7L398.3 88.4L397.3 96.6L390.8 96.3L388.9 99.3L390.8 102.3L397.8 101.8L397 112.6L402 113.5L402.4 101.8L410.7 101.1L407.7 95.8Z");
  bag.draw("sm-f1f1f2", "M407 116.3L406.9 117.9L406.4 119.3L405.5 120.7L404.4 121.8L403.1 122.6L401.6 123.2L400 123.3L398.4 123.2L396.9 122.6L395.6 121.8L394.5 120.7L393.6 119.3L393.1 117.9L393 116.3L393.1 114.7L393.6 113.2L394.5 111.9L395.6 110.8L396.9 109.9L398.4 109.4L400 109.2L401.6 109.4L403.1 109.9L404.4 110.8L405.5 111.9L406.4 113.2L406.9 114.7Z");
  bag.cut("black", "M408.8 116.3L408.5 118.2L407.9 120.1L406.8 121.7L405.5 123.1L403.8 124.2L401.9 124.8L400 125L398.1 124.8L396.2 124.2L394.5 123.1L393.2 121.7L392.1 120.1L391.5 118.2L391.2 116.3L391.5 114.3L392.1 112.5L393.2 110.8L394.5 109.4L396.2 108.4L398.1 107.8L400 107.5L401.9 107.8L403.8 108.4L405.5 109.4L406.8 110.8L407.9 112.5L408.5 114.3ZM406.9 114.7L406.4 113.2L405.5 111.9L404.4 110.8L403.1 109.9L401.6 109.4L400 109.2L398.4 109.4L396.9 109.9L395.6 110.8L394.5 111.9L393.6 113.2L393.1 114.7L393 116.3L393.1 117.9L393.6 119.3L394.5 120.7L395.6 121.8L396.9 122.6L398.4 123.2L400 123.3L401.6 123.2L403.1 122.6L404.4 121.8L405.5 120.7L406.4 119.3L406.9 117.9L407 116.3Z");
  bag.draw("black", "M401.5 121.3L403.3 118.7L402.2 121.6ZM404.1 120.9L405.4 118.8L404.7 121.3ZM398 121.7L401.1 117.9L398.7 122.2ZM395.8 120.3L398.4 118.1L396.6 120.6Z");
  bag.draw("sm-d99f31", "M406.1 133.6L385.7 133.9L392.5 121.6L403.8 120.6L407.7 121.6L411 130.2L415.3 131.9L413 135.1L407.2 134.8Z");
  bag.draw("sm-d99f31", "M406.1 133.6L400.1 136.3L386.8 134.4L385.5 132.4L389.3 130.9L391.7 123.4L396.3 121.2L407.9 122.7L410.4 130.3L414.7 132.4L411 135.2L406.8 134.1Z");
  bag.draw("sm-f1bf31", "M390.7 125L386.3 133.4L390.2 131.8L391.6 125Z");
  bag.draw("sm-f1bf31", "M408.5 125L410 131.8L413.8 133.4L409.5 125Z");
  bag.draw("sm-f1bf31", "M400 135.9L393 130.6L400.1 135L407.1 130.6L400.2 135.9ZM392.2 124.7L398.2 121.6L407.9 124.7L402.3 129.9L392.7 126.7Z");
  bag.draw("black", "M406.1 133.2L400.1 135.9L385.8 132.8L389.6 131.2L393.2 122.5L403.8 121.7L414.3 132.7L405.9 134L413.6 134.8L415 132.1L410.8 130L408.3 122.4L403.8 120.7L392.6 121.8L388.9 130.6L385.2 132L386.6 134.8L400.1 136.8L406.1 134.1Z");
  bag.draw("black", "M407.6 130.6L400.1 137.2L392.5 130.6L400.1 136.3L407.5 130.9Z");
  bag.draw("sm-a0cfeb", "M398.8 227.5L430.9 229.3L452.8 241.7L465.6 263L470.6 298.4L465.8 331.9L452.3 360.8L430 386.4L400 406.5L370.6 386.7L347.8 359.5L334.1 328L329.5 292.6L334.1 263L347.5 242.3L370.5 229.7L398.7 227.5Z");
  bag.draw("sm-94bb79", "M421.7 348.4L440 345.1L456.5 353.8L439 377.6L417.2 396.4L400.1 406.5L369 385.1L349.4 362L344.4 353.6L347.4 350.9L362.9 344.9L380.5 349.3L388.9 343L399.3 340.2L410.5 341.6L420.1 346.9Z");
  bag.draw("sm-658d5c", "M434 345.2L446.7 353.4L437.4 366.8L421.4 348.7L432.7 345.1ZM409.8 395.9L400 400.6L390.3 395.9L367.8 373.5L351 348.5L364.8 344.9L374.8 350.3L383 361.7L372 365L409.8 395.5ZM427.1 388.9L380.6 349.2L383.6 346.4L399.2 340.2L411.3 346.2L415.4 353.5L404 356.3L434.5 382.3L428.5 387.7Z");
  bag.draw("black", "M422.1 347.9L424.2 351.7L408.5 341.4L418.8 345.2Z");
  bag.draw("black", "M422 348.9L440 345.3L457 353.2L440.2 344L421.4 347.8Z");
  bag.draw("black", "M344.7 353.9L352.9 347.7L362.9 344.9L380.6 349.9L399.4 340.2L410.3 341.7L422.1 347.9L410.7 340.6L399.2 339L388.6 342.2L380.5 348.7L369.4 343.9L358.5 344.3L343.8 353Z");
  bag.draw("sm-4c819a", "M367.9 230.9L434.9 230.9L367.9 230.1Z");
  bag.draw("sm-4c819a", "M359 234.6L443.1 234.6L359 233.8Z");
  bag.draw("sm-4c819a", "M352.8 238.3L448.6 238.3L352.8 237.6Z");
  bag.draw("sm-4c819a", "M348.2 242L452.8 242L348.2 241.3Z");
  bag.draw("sm-4c819a", "M344.5 245.8L456.1 245.8L344.5 245Z");
  bag.draw("sm-4c819a", "M341.5 249.5L458.8 249.5L341.5 248.7Z");
  bag.draw("sm-4c819a", "M339 253.2L461.1 253.2L339 252.4Z");
  bag.draw("sm-4c819a", "M336.9 256.9L463 256.9L336.9 256.1Z");
  bag.draw("sm-4c819a", "M335.2 260.6L464.6 260.6L335.2 259.8Z");
  bag.draw("sm-4c819a", "M333.8 264.3L465.9 264.3L333.8 263.5Z");
  bag.draw("sm-4c819a", "M332.6 268L467 268L332.6 267.3Z");
  bag.draw("sm-4c819a", "M331.7 271.7L467.9 271.7L331.7 271Z");
  bag.draw("sm-4c819a", "M417.7 275.5L468.7 275.5L417.7 274.7Z");
  bag.draw("sm-4c819a", "M330.9 275.5L382.3 275.5L330.9 274.7Z");
  bag.draw("sm-4c819a", "M434.3 279.2L469.3 279.2L434.3 278.4Z");
  bag.draw("sm-4c819a", "M330.4 279.2L365.8 279.2L330.4 278.4Z");
  bag.draw("sm-4c819a", "M440.7 282.9L469.8 282.9L440.7 282.1Z");
  bag.draw("sm-4c819a", "M329.9 282.9L359.2 282.9L329.9 282.1Z");
  bag.draw("sm-4c819a", "M447 286.6L470.1 286.6L447 285.8Z");
  bag.draw("sm-4c819a", "M329.7 286.6L352.7 286.6L329.7 285.8Z");
  bag.draw("sm-4c819a", "M453.3 290.3L470.4 290.3L453.3 289.5Z");
  bag.draw("sm-4c819a", "M329.5 290.3L346.6 290.3L329.5 289.5Z");
  bag.draw("sm-4c819a", "M457.7 294L470.5 294L457.7 293.2Z");
  bag.draw("sm-4c819a", "M329.5 294L342.5 294L329.5 293.2Z");
  bag.draw("sm-4c819a", "M461.8 297.7L470.6 297.7L461.8 297Z");
  bag.draw("sm-4c819a", "M329.6 297.7L338.1 297.7L329.6 297Z");
  bag.draw("black", "M356.7 300.4L356.6 293.2L364.4 290.1L372.1 292.2L372.2 300.4Z");
  bag.draw("white", "M373.2 333.2L376.6 347.2L365.1 344.8L364.4 287.2L367.5 288.1L367.5 294.1L371.4 295.1L371.4 289.1L376.6 290.5L376.6 300.4L373.2 305.4Z");
  bag.draw("sm-bdbfc1", "M364.4 332.1L364.4 287.2L361.3 288.6L361.3 294.5L357.4 296.1L357.4 290.1L352.1 292.3L352.1 301.8L355.9 306.4L356 333.8L352.1 347.9L364.4 344.7Z");
  bag.draw("black", "M364.1 331.5L355.9 333.3L364.4 332.6Z");
  bag.draw("black", "M354.4 343L375.2 341L354.2 341.9Z");
  bag.draw("black", "M363.9 335.7L355 337.5L364.1 336.8Z");
  bag.draw("black", "M372.9 312.9L364.4 311.1L355.7 313.7L372.6 313.9Z");
  bag.draw("black", "M372.9 316.8L364.4 315.2L355.8 317.7L372.6 317.9Z");
  bag.draw("black", "M356.1 310.9L372.9 308.8L364.4 307.1L355.7 309.8Z");
  bag.draw("black", "M356 322.6L372.8 320.8L355.8 321.6Z");
  bag.draw("black", "M356.1 326.5L372.9 324.7L355.9 325.5Z");
  bag.draw("black", "M356.1 330.4L373 328.7L355.9 329.4Z");
  bag.draw("black", "M369.3 304.9L369.3 308.7L370.4 304.9Z");
  bag.draw("black", "M366.2 308.1L366.2 312L367.3 308.1Z");
  bag.draw("black", "M369.3 312.9L369.3 316.8L370.4 312.9Z");
  bag.draw("black", "M361.4 312.5L361.4 316.4L362.5 312.5Z");
  bag.draw("black", "M361.4 320.5L361.4 324.4L362.5 320.5Z");
  bag.draw("black", "M357.6 325.8L357.6 329.4L358.7 325.8Z");
  bag.draw("black", "M357.6 310L357.6 313.6L358.7 310Z");
  bag.draw("black", "M361.4 304.5L361.4 308.4L362.5 304.5Z");
  bag.draw("black", "M364.3 297.9L376.5 300.9L364.5 296.9Z");
  bag.draw("black", "M364.2 296.9L352 301.3L364.6 297.9Z");
  bag.draw("black", "M365 344.8L365 287.2L363.8 344.8Z");
  bag.draw("black", "M370.6 334.7L366.9 334.2L367.4 320.7L370.6 323Z");
  bag.draw("black", "M372.8 333.3L376.2 347.2L365.1 344.3L352.6 347.9L356.5 333.8L356.4 306.3L352.6 301.7L352.6 292.5L357.1 290.5L357.1 296.4L361.7 294.7L361.7 288.7L364.4 287.7L367.1 288.3L367.1 294.4L371.7 295.4L371.7 289.5L376.2 290.7L376.2 300.3L372.8 305.4L373.7 333.2L373.7 305.5L377.1 300.5L377.1 290.3L371.1 288.8L371 294.9L367.9 293.9L367.9 287.9L364.4 286.7L357.8 295.8L357.7 289.7L351.7 292.1L351.7 302L355.5 306.4L355.6 333.7L351.7 347.8L365.1 345.2L377.1 347.1L373.7 333.1Z");
  bag.draw("black", "M376.5 346.2L362.9 344.1L352.9 347.4L356.8 333.9L356.7 306.4L352.9 301.6L352.9 292.7L356.8 290.9L357 296.7L361.6 295.2L364.4 288L366.7 288.5L366.9 294.6L371.2 295.9L372 289.9L375.9 291L375.9 300.2L372.5 305.4L372.5 333.3L376.8 346.9L373.4 333.2L373.4 305.5L376.8 300.4L376.7 290.6L371.4 289.2L371.4 295L367.6 294.1L367.6 288.1L364.4 287.1L361.2 288.6L361.1 294.5L357.6 296.1L357.4 290.2L352 292.3L352 301.9L355.8 306.5L355.9 333.8L352 347.2L365.1 344.9L376.2 347.1Z");
  bag.draw("black", "M377.4 346.7L365.1 344.1L351.6 347.4L356.2 333.8L356.1 306.4L352.3 301.7L352.2 292.5L357.3 290.1L357.4 295.9L361.4 294.5L361.4 288.7L364.4 287.3L367.4 288.2L367.4 294.1L371.4 295L371.5 289.2L376.6 290.7L376.5 300.3L373.1 305.5L373.1 333.2L378 347.3L374 333.1L374 305.6L377.4 300.6L377.4 290.5L370.9 288.5L370.7 294.5L368.2 293.7L368.1 287.6L364.3 286.4L360.7 288.1L360.6 294.1L358.1 295.3L357.9 289.4L351.4 292.3L351.4 302.1L355.2 306.6L355.2 333.7L350.8 347.7L365.1 345.1L377.7 347.5Z");
  bag.draw("black", "M364.3 304L372.7 305.9L364.5 303.1Z");
  bag.draw("black", "M364.3 303.1L355.8 306L364.6 304Z");
  bag.draw("black", "M391.5 295L391.5 287.6L399.3 284.8L407 287.2L407 295Z");
  bag.draw("white", "M408.1 328.1L411.5 341.9L399.1 340.2L399.3 281.8L402.4 282.8L402.4 288.9L406.2 290L406.2 284L411.5 285.7L411.5 295.5L408.1 300.4Z");
  bag.draw("sm-bdbfc1", "M399.3 340.2L399.3 281.8L396.2 283L396.2 289L392.3 290.4L392.3 284.4L387 286.5L387 296.1L390.8 300.8L390.9 328.4L387 344.1L397.1 340.5Z");
  bag.draw("black", "M398.7 330.3L390.1 331.9L398.9 331.4Z");
  bag.draw("black", "M409.8 335.8L388.7 336.5L409.6 336.9Z");
  bag.draw("black", "M392.5 316L392.5 319.7L393.6 316Z");
  bag.draw("black", "M396.2 323.1L396.2 327.1L397.3 323.1Z");
  bag.draw("black", "M396.2 298.9L396.2 302.8L397.3 298.9Z");
  bag.draw("black", "M392.5 304.2L392.5 308L393.6 304.2Z");
  bag.draw("black", "M396.2 307L396.2 310.9L397.3 307Z");
  bag.draw("black", "M404.2 307.6L404.2 311.5L405.2 307.6Z");
  bag.draw("black", "M401.1 302.8L401.1 306.8L402.1 302.8Z");
  bag.draw("black", "M404.2 299.7L404.2 303.5L405.2 299.7Z");
  bag.draw("black", "M391 324.9L407.9 323.6L390.8 323.9Z");
  bag.draw("black", "M390.9 317L407.8 315.7L399.3 313.9L390.7 316Z");
  bag.draw("black", "M390.9 313.1L407.8 311.7L399.3 309.8L390.7 312.1Z");
  bag.draw("black", "M390.9 309.2L407.8 307.8L399.3 305.7L390.6 308.1Z");
  bag.draw("black", "M390.9 305.2L407.8 303.8L399.3 301.6L390.6 304.2Z");
  bag.draw("black", "M407.8 319.6L390.7 319.9L407.6 320.7Z");
  bag.draw("black", "M399.1 326.1L390.8 327.8L399.4 327.2Z");
  bag.draw("black", "M411.7 295L399.2 291.4L386.8 295.6L399.3 292.5L411.4 296.1Z");
  bag.draw("black", "M407.8 299.8L399.3 297.6L390.6 300.3L399.3 298.7L407.5 300.9Z");
  bag.draw("black", "M399.9 340.2L399.9 281.8L398.6 340.2Z");
  bag.draw("black", "M405.5 329.4L401.7 328.8L401.7 317L403.4 314.8L405.5 317Z");
  bag.draw("black", "M411.4 341L399.3 339.4L387.8 343.5L391.7 328.5L391.6 300.8L387.8 295.9L387.8 286.9L391.7 285.2L391.8 291.1L396.4 289.7L396.9 283.4L399.3 282.6L401.6 283.2L401.7 289.3L406 290.7L406.8 284.8L410.8 286.1L410.7 295.3L407.3 300.4L407.3 328.1L411.7 341.6L408.3 328.1L408.2 300.5L411.6 295.5L411.6 285.8L406.2 284.1L406.3 289.8L402.5 288.9L402.5 282.9L399.3 281.6L396 283L396 289L392.2 290.3L392.3 284.5L386.9 286.5L386.9 296.2L390.7 300.9L390.7 328.4L386.9 343.4L399.4 340.4L411.1 341.9Z");
  bag.draw("black", "M412.3 341.4L399.3 339.6L386.4 343.7L391 328.4L391 300.8L387.1 296L387.1 286.6L392.1 284.4L392.2 290.2L396.3 289L396.2 283.1L399.2 281.9L402.3 283L402.2 288.8L406.3 289.8L406.4 284L411.4 285.9L411.4 295.5L408 300.4L408 328.1L412.9 341.7L408.9 328L408.9 300.5L412.2 295.8L412.3 285.7L405.8 283.4L405.5 289.3L403.1 288.4L403 282.4L399.2 281L395.5 282.5L395.4 288.6L393 289.7L392.7 283.8L386.2 286.5L386.3 296.4L390 300.9L390.1 328.3L385.6 343.9L399.3 340.5L412.5 342.3Z");
  bag.draw("black", "M407.7 328.2L411 342L399.3 339.7L387.5 344.1L391.4 328.4L391.3 300.7L387.5 296L387.4 286.7L392 284.8L391.9 290.7L396.6 289.2L396.6 283.2L399.3 282.2L401.9 283L401.9 289.1L406.6 290.2L406.5 284.4L411.1 285.9L411 295.4L407.6 300.3L408.6 328.1L408.6 300.4L412 295.6L411.9 285.5L405.9 283.7L405.9 289.7L402.8 288.7L402.8 282.6L399.2 281.3L395.7 282.8L395.7 288.8L392.6 290.1L392.6 284L386.6 286.3L386.6 296.3L390.3 300.8L390.4 328.3L386.6 344L399.3 340.7L412 341.8L408.6 328Z");
  bag.draw("black", "M426.4 300.6L426.4 292.4L434.1 290.2L441.9 292.8L441.9 300.6Z");
  bag.draw("white", "M443 333.5L446.4 346.8L434 344.8L434.1 287.2L437.2 288.2L437.2 294.3L441.1 295.6L441.1 289.7L446.4 291.5L446.4 301.2L443 306Z");
  bag.draw("sm-bdbfc1", "M434.1 332.1L434.1 287.2L431 288.2L431 294.2L427.2 295.4L427.2 289.4L421.9 291.1L421.9 300.8L425.7 305.7L425.8 333.2L421.9 348.3L434.1 344.7Z");
  bag.draw("black", "M423.7 342.5L444.8 341.2L423.5 341.5Z");
  bag.draw("black", "M433.6 335.7L424.7 337L433.8 336.8Z");
  bag.draw("black", "M431.1 304.2L431.1 308.1L432.2 304.2Z");
  bag.draw("black", "M427.4 309.3L427.4 313.1L428.5 309.3Z");
  bag.draw("black", "M427.4 325.2L427.4 329L428.5 325.2Z");
  bag.draw("black", "M431.1 320.4L431.1 324.3L432.2 320.4Z");
  bag.draw("black", "M431.1 312.3L431.1 316.2L432.2 312.3Z");
  bag.draw("black", "M439 313.1L439 317L440.1 313.1Z");
  bag.draw("black", "M435.9 308.3L435.9 312.2L437 308.3Z");
  bag.draw("black", "M439 305.2L439 309L440.1 305.2Z");
  bag.draw("black", "M425.8 330L442.7 329L425.6 328.9Z");
  bag.draw("black", "M425.8 318.1L442.6 317.2L434.1 315.2L425.5 317Z");
  bag.draw("black", "M442.6 321.2L425.5 321L442.4 322.2Z");
  bag.draw("black", "M442.6 313.3L434.1 311.1L425.5 313.1L442.4 314.3Z");
  bag.draw("black", "M442.6 309.3L434.1 307L425.5 309.1L442.4 310.3Z");
  bag.draw("black", "M442.7 305.4L434.2 303L425.5 305.2L442.4 306.5Z");
  bag.draw("black", "M422 301.4L434.1 297.9L446.5 300.6L434.2 296.9L421.7 300.3Z");
  bag.draw("black", "M434.1 331.5L425.7 332.9L434.2 332.6Z");
  bag.draw("black", "M425.8 326.1L442.7 325.1L425.6 325Z");
  bag.draw("black", "M434.8 344.8L434.8 287.2L433.5 344.8Z");
  bag.draw("black", "M440.3 334.9L436.6 334.3L436.6 322.5L438.3 320.3L440.3 322.5Z");
  bag.draw("black", "M446.2 345.9L433.6 344.1L422.7 347.7L426.5 333.4L426.4 305.7L422.6 300.6L422.6 291.5L426.5 290.2L426.7 296L431.3 295L431.8 288.6L434.1 288L436.5 288.6L436.6 294.7L440.9 296.3L441.7 290.5L445.6 291.9L445.6 300.9L442.2 306L442.2 333.6L445.7 346.6L443.1 306L446.5 301.2L446.5 291.5L441.1 289.8L440.9 295.6L437.4 294.3L437.3 288.3L434.1 287.1L430.9 288.2L430.9 294.2L427.1 295.2L427.2 289.5L421.8 291.1L421.7 300.9L425.5 305.8L425.6 333.3L421.7 347.6L435.6 344.9L445.9 346.8Z");
  bag.draw("black", "M442.5 333.6L445.9 346.9L433.5 344.4L422.3 348.3L426.2 333.3L426.1 305.6L422.3 300.7L422.3 291.3L426.9 289.7L426.8 295.7L431.4 294.4L431.5 288.4L434.1 287.7L436.8 288.4L436.8 294.5L441.5 295.9L441.4 290.1L445.9 291.7L445.9 301L442.5 305.9L443.4 333.5L443.4 306L446.8 301.3L446.8 291.3L440.8 289.3L440.7 295.3L437.6 294.1L437.7 288.1L434.1 286.7L430.6 288L430.6 294L427.5 295.1L427.4 289L421.5 290.9L421.4 301L425.2 305.7L425.3 333.2L421.4 348.2L433.6 345.3L446.8 346.8L443.4 333.4Z");
  bag.draw("black", "M447.2 346.3L433.5 344.2L421.6 347.7L425.9 333.2L425.8 305.7L422 300.7L421.9 291.2L427 289.4L427.1 295.2L431.1 294.2L431.1 288.3L434.1 287.4L437.2 288.4L437.1 294.3L441.2 295.5L441.3 289.7L446.3 291.6L446.2 301.1L442.8 306L442.8 333.5L447.7 346.6L443.8 333.5L443.8 306.1L447.1 301.4L447.1 291.5L440.6 289L440.4 294.9L438 293.9L437.8 287.8L434.1 286.4L430.4 287.7L430.3 293.8L427.8 294.7L427.6 288.7L421.1 291.1L421.2 301.1L424.9 305.9L425 333.2L420.7 347.5L435.6 345.1L447.4 347.2Z");
  bag.draw("black", "M369.4 268.7L364.7 262.5L367.2 279.6L364.1 285L357.8 265.9L358.5 260.1L364.4 255.5L371.2 257L373.4 263L369.8 268.9Z");
  bag.draw("white", "M369.9 267.5L368 263.2L363.8 261.9L366.7 278.1L364.2 283.9L358.3 266.3L361.7 257.5L371.3 257.6L371.9 265.6Z");
  bag.draw("black", "M359.6 264.7L364.9 261.8L359.6 265.5Z");
  bag.draw("black", "M369.1 259.6L365.3 257.8L359.1 260L364.4 256.9L369.4 259.8Z");
  bag.draw("black", "M404.8 263.3L400 257.1L402.5 274.2L399.4 279.5L393.1 260.5L393.8 254.7L399.7 250.1L406.6 251.5L408.8 257.6L405.1 263.4Z");
  bag.draw("white", "M405.2 262.1L403.4 257.8L399.1 256.4L402 272.7L399.6 278.4L393.6 260.9L397.1 252.1L406.7 252.2L407.2 260.2Z");
  bag.draw("black", "M394.9 259.3L400.2 256.4L394.9 260.1Z");
  bag.draw("black", "M404.5 254.2L400.7 252.4L394.4 254.6L399.8 251.4L404.8 254.4Z");
  bag.draw("black", "M440.1 268.7L435.4 262.5L437.8 279.6L434.7 285L428.4 265.9L429.1 260.1L435.1 255.5L441.9 257L444.1 263L440.4 268.9Z");
  bag.draw("white", "M440.5 267.5L438.7 263.2L434.4 261.9L437.4 278.1L434.9 283.9L428.9 266.3L432.4 257.5L442 257.6L442.5 265.6Z");
  bag.draw("black", "M430.2 264.7L435.5 261.8L430.2 265.5Z");
  bag.draw("black", "M439.8 259.6L436 257.8L429.8 260L435.1 256.9L440.1 259.8Z");
  bag.draw("black", "M446.3 240.5L455.1 250.3L461.2 270.1L462.8 295.7L459.1 321.9L451.8 342.4L439.7 363.9L423.8 383.4L404.8 400.3L427.9 386.6L447.3 370L463.7 349.6L474.9 327.5L480.8 305.8L482.1 278.2L477.9 252.5L469.5 232.7L458.4 220.3L445.9 215.2L427.1 215L405.6 225L400.3 222.4L394.9 225L373.4 215L351.9 215.6L340.9 220.9L330.8 232.5L319.2 266.7L319.7 307.9L332.9 343.9L359.7 376.6L395.3 400.3L366.1 371.6L346.9 339.2L337.5 300.8L340 264.3L345.4 249.6L353.8 240.5L372 246.6L394.9 233.2L400.3 235.9L405.7 233.2L428.4 246.7Z");
  bag.draw("sm-d99f31", "M431.5 214.1L400.3 227.7L369.1 214.1L348 216.8L330.8 232.5L320.1 261.2L318.7 301.9L323.2 321.9L331.7 341.7L358.1 375.1L395.3 400.3L365.7 371.6L344.7 335.4L336.8 300.8L339.9 261.8L345.5 247.9L353.4 239.6L373.3 245.2L400.3 229.2L427.2 245.2L446.7 239.6L456.9 252.2L461.9 270L463.7 292.5L457.4 329.9L437.4 367.6L405.7 399.9L432.6 383.1L454.6 362L469.8 339.1L479.9 310.4L482 275.5L474.7 243.1L460 221.5L441.9 214.9Z");
  bag.draw("black", "M437.3 228.9L431.3 233.5L433.2 242L429.7 237.6L431.8 230.3L437.2 227.8ZM362.8 227.8L368.3 230.3L370.3 237.6L366.8 242L368.8 233.5L362.7 228.9ZM354.1 235.3L340.2 252.3L353.8 233.7ZM361.3 222.4L344 229.2L330.9 249.3L338.9 233.1L349.8 223.9L365.7 221.6L377.2 227.7L363.6 222.5ZM361.3 226L346 232.6L334.4 250.4L342.3 235L353.6 226.4L367.8 225.7L376.9 232.5L363.5 226.1ZM374.5 238.6L369.7 231.3L359.1 229.2L348.1 235.1L338 251.5L341.9 241.5L350.4 231.4L359.2 227.8L369.4 229.6L375.1 237.5ZM425.6 238.7L432.3 228.8L446.3 229.5L457.2 239.9L465.8 260.5L456.9 241.5L447.2 231.4L434.1 229.6L426.5 236.3ZM468.9 260.4L460 240.2L449.1 229.1L434.4 226.6L423.2 232.3L434.4 225.5L448.8 227.6L460 238L468.3 257.6ZM472.8 261L464.2 239.9L453.3 227.2L438.6 222.5L422.9 228.2L436.4 221.4L452.8 225.4L464.8 238.6L472.2 258.2ZM441.1 232.8L454.9 242.2L462.8 260.3L452.4 240.8L441 234.2Z");
  bag.draw("black", "M419.7 240.2L416 230.3L419 240.8Z");
  bag.draw("black", "M416.5 238.4L413.3 230.3L415.7 238.9Z");
  bag.draw("black", "M413.4 236.5L410.7 230.3L412.5 236.9Z");
  bag.draw("black", "M410.3 234.7L408.3 230.3L409.4 235.1Z");
  bag.draw("black", "M381.6 240.8L384.6 230.3L380.8 240.2Z");
  bag.draw("black", "M384.8 238.9L387.2 230.3L384 238.4Z");
  bag.draw("black", "M388 236.9L389.8 230.3L387.2 236.5Z");
  bag.draw("black", "M391.2 235.1L392.3 230.3L390.3 234.7Z");
  bag.draw("sm-d99f31", "M406.5 229.2L406.3 230.6L405.9 231.9L405.1 233.1L404.1 234.1L403 234.8L401.7 235.3L400.3 235.4L398.9 235.3L397.6 234.8L396.4 234.1L395.4 233.1L394.7 231.9L394.2 230.6L394.1 229.2L394.2 227.9L394.7 226.6L395.4 225.4L396.4 224.4L397.6 223.7L398.9 223.2L400.3 223L401.7 223.2L403 223.7L404.1 224.4L405.1 225.4L405.9 226.6L406.3 227.9Z");
  bag.draw("black", "M394.6 228L400.3 223.4L406.5 226.5L402.3 222.7L396 223.9L393.7 227.6Z");
  bag.draw("black", "M406 230.6L400.3 235.1L393.9 231.7L398.2 235.7L402.5 235.7L406.9 231Z");
  bag.draw("black", "M401.8 232.7L395.6 229.5L398 233.3L402.1 233.6Z");
  bag.draw("black", "M403.6 231.1L402.2 233.5L404.3 231.7Z");
  bag.draw("black", "M400.6 230.8L397.8 229.7L400.8 231.7Z");
  bag.draw("black", "M394.6 227.9L400.3 222.9L406.6 226.6L402.5 222.3L395.6 223.7L393.7 227.7Z");
  bag.draw("black", "M406 230.7L400.3 235.4L393.9 231.7L398.1 236L404.8 234.7L406.9 230.9Z");
  bag.draw("black", "M423.3 242.2L437.3 249.3L448.6 243.7L450 235.3L444.1 229L435.3 232L435.7 241.8L427.3 235.5L428.2 224.5L435.2 219.6L449.9 220.9L461.6 229.4L469.2 241.5L475.4 260.1L478.4 284L477.4 305.3L469.5 333.4L455.1 358.1L431.6 381.8L400.1 401.1L400 407.4L434.4 388.4L458.7 365.6L476.4 336.5L485.2 304.6L486.1 282.1L482.5 256.4L475.4 236.8L465.9 223.2L448.9 213.1L430.2 214L420.3 224.2L419.3 232.9L422.2 240.6ZM376.8 242.2L362.8 249.3L351.5 243.7L350.1 235.3L356 229L364.8 232L364.4 241.8L372.8 235.5L371.9 224.5L364.9 219.6L350.2 220.9L338.5 229.4L330.9 241.5L324.7 260.1L321.7 284L322.7 305.3L330.6 333.4L345 358.1L368.5 381.8L400 401.1L400 407.4L365.7 388.4L341.4 365.6L323.7 336.5L314.9 304.6L314 282.1L317.6 256.4L324.7 236.8L334.2 223.2L351.2 213.1L369.9 214L379.8 224.2L380.8 232.9L377.9 240.6Z");
  bag.draw("sm-f1bf31", "M400 407L371.4 391.4L346.9 370.7L329.4 346.2L319 319.4L315.3 284.6L320.3 251L331.9 227.4L349.5 214.6L361.5 212.8L373.4 216.9L379.4 224.6L379.8 235.6L369.6 247.3L360.4 248.5L354.3 245.3L351 236.6L354.1 230.9L360.6 229.9L364.2 232.6L365.6 236.9L362.6 242.6L369 240.5L374 233.1L370.9 222.4L360.3 218.3L346.9 221.8L334.7 233.5L327 249.5L321.9 272.6L321.3 296L325.1 318.8L335.2 343.7L351.9 367.1L373.9 386.4L400 401.1L430.1 383.5L453 361.4L469.5 334.5L478.1 303.4L477.1 265L465.5 233.6L450.1 220.3L433.4 219.5L426.5 226.7L427.9 237.3L437.5 242.6L434.8 234.6L441.8 229.6L447.6 232.4L449.1 238.9L443.3 247.1L432.7 248L421 237.8L422.1 221.8L435.4 213.2L454.5 216.3L470.1 229.9L480.2 252.4L484.2 275.4L484.2 301.7L479.6 324.6L471.6 344.5L459.8 362.9L444.6 379.1L422.7 395.3L402.1 406.2Z");
  bag.draw("black", "M302.4 357.8L281 342.7L255.3 335.9L260.6 347.5L271.1 356.3L302.6 359.9Z");
  bag.draw("black", "M267.2 369L294 364.4L317.3 374.5L290.3 381.7L278.4 378.4L268.7 370.7Z");
  bag.draw("sm-658d5c", "M316.3 374.3L293 381.3L275.5 375.5L268.9 369.8L289.3 364.7L314.9 373.2Z");
  bag.draw("black", "M309.9 372.9L292.5 374.4L271.9 370.7L291.5 374.8L309.9 373.9Z");
  bag.draw("black", "M284.9 262.7L282.5 256.9L285.8 260.3L284.5 263.4L286.6 260.6L283.8 255.9L284.1 262.7Z");
  bag.draw("black", "M289.2 254.9L283.7 278.3L282.7 306.3L288.3 328.3L299.4 349.9L312.6 366.5L329.6 380.5L370.4 395.3L389.3 406.9L410.7 431.4L418.4 443.5L418.1 448.4L386 409L368.6 398.6L328.2 384L311.5 370.3L298.3 354.4L286.9 333.4L280.8 311.5L281.2 283L287.1 255.8Z");
  bag.draw("black", "M330.3 387.3L311 402.6L291.8 402.1L289.8 400.4L307.5 388L328.3 386.3Z");
  bag.draw("black", "M314.3 323.3L320.6 346.8L315.8 366.2L318.6 372.2L310.2 359.3L306.1 346L307 335.1L312.6 325.1Z");
  bag.draw("black", "M354.6 390L347.5 385.2L340.4 368.1L323.8 353L323.7 365.7L327.5 374.8L349.1 388.8Z");
  bag.draw("sm-658d5c", "M349.2 388.5L328.1 375.1L324 365.9L324 354.8L340.1 368.1L351.3 389Z");
  bag.draw("black", "M300.4 347.4L300 350.6L301.1 348.3Z");
  bag.draw("sm-658d5c", "M302.4 357.8L281 343L256.7 337.2L262.6 349.2L271.2 355.8L302.6 359.6Z");
  bag.draw("sm-466343", "M315.5 368.9L306.2 344L307.8 333.8L313.9 324.7L320.2 348.4L315.7 366.2L317.1 370.3Z");
  bag.draw("black", "M291.9 343.1L285.9 337.5L259 327.5L253 318.2L250 302.4L250.7 298.3L268.4 312L282.8 333.8L291.8 341.3Z");
  bag.draw("black", "M312.9 328.1L311.1 346.5L314.7 365.1L310.5 346.5L312.8 328.5Z");
  bag.draw("sm-658d5c", "M282 336L265.9 331.7L257.6 325.5L252.4 314.5L251.2 299.7L269.6 313.7L282.1 333.9Z");
  bag.draw("sm-a48253", "M282.1 333.9L289.2 337.4L290.7 341.3L282 336Z");
  bag.draw("sm-d99f31", "M275.9 304.8L275.8 305.7L275.5 306.5L275 307.3L274.4 307.9L273.7 308.3L272.8 308.6L272 308.7L271.1 308.6L270.2 308.3L269.5 307.9L268.9 307.3L268.4 306.5L268.1 305.7L268 304.8L268.1 303.9L268.4 303.1L268.9 302.3L269.5 301.7L270.2 301.2L271.1 300.9L272 300.8L272.8 300.9L273.7 301.2L274.4 301.7L275 302.3L275.5 303.1L275.8 303.9Z");
  bag.cut("black", "M276.8 304.8L276.7 305.9L276.4 306.9L275.8 307.8L275 308.6L274.1 309.2L273 309.6L272 309.7L270.9 309.6L269.8 309.2L268.9 308.6L268.1 307.8L267.6 306.9L267.2 305.9L267.1 304.8L267.2 303.7L267.6 302.7L268.1 301.7L268.9 301L269.8 300.4L270.9 300L272 299.9L273 300L274.1 300.4L275 301L275.8 301.7L276.4 302.7L276.7 303.7ZM275.8 303.9L275.5 303.1L275 302.3L274.4 301.7L273.7 301.2L272.8 300.9L272 300.8L271.1 300.9L270.2 301.2L269.5 301.7L268.9 302.3L268.4 303.1L268.1 303.9L268 304.8L268.1 305.7L268.4 306.5L268.9 307.3L269.5 307.9L270.2 308.3L271.1 308.6L272 308.7L272.8 308.6L273.7 308.3L274.4 307.9L275 307.3L275.5 306.5L275.8 305.7L275.9 304.8Z");
  bag.draw("sm-f1bf31", "M272.5 300.9L273.4 305.7L275.9 305.3L274.2 301.6Z");
  bag.cut("black", "M277.3 304.8L277.2 306L276.8 307.1L276.1 308.1L275.3 309L274.3 309.6L273.1 310L272 310.1L270.8 310L269.6 309.6L268.6 309L267.8 308.1L267.1 307.1L266.8 306L266.6 304.8L266.8 303.6L267.1 302.5L267.8 301.5L268.6 300.6L269.6 300L270.8 299.6L272 299.4L273.1 299.6L274.3 300L275.3 300.6L276.1 301.5L276.8 302.5L277.2 303.6ZM276 303.9L275.7 303L275.2 302.2L274.5 301.6L273.7 301.1L272.9 300.8L272 300.7L271 300.8L270.2 301.1L269.4 301.6L268.8 302.2L268.3 303L268 303.9L267.9 304.8L268 305.7L268.3 306.6L268.8 307.3L269.4 308L270.2 308.5L271 308.8L272 308.9L272.9 308.8L273.7 308.5L274.5 308L275.2 307.3L275.7 306.6L276 305.7L276.1 304.8Z");
  bag.draw("black", "M285 302.8L291.3 285.9L305.6 269.8L308.1 282.3L305.7 292.2L289.1 308.1Z");
  bag.draw("sm-466343", "M305.6 271.8L307.6 283.3L304.1 294.8L289.2 308L285.3 302.8L290.8 287.7L304.5 273.6Z");
  bag.draw("sm-a48253", "M288.7 255.7L283.1 281.5L282.8 308.2L289.1 330.7L300.6 352L314.1 368.3L329.5 380.8L370.2 395.6L389 407.1L407.4 427.3L416.9 446L384 406.9L368.5 397.8L328.4 383.4L311.8 369.9L298.8 354.1L287.5 333.2L281.4 311.4L281.6 282.1L286.5 257.3Z");
  bag.draw("black", "M285.7 329.9L277.5 320.7L274.7 307.5L278.2 294.1L286 285L292.1 310.6L289.9 332.2Z");
  bag.draw("black", "M324.6 379.2L310 375.3L302.8 369.5L298 359L298.4 346.9L318.3 362.2L324.8 376L332.4 382.2Z");
  bag.draw("sm-658d5c", "M330.1 382.1L304.5 370.9L299.4 361.8L298.4 348.9L316.2 360.8L323.7 375.3L331.4 382Z");
  bag.draw("black", "M294.9 341.9L294.9 317.9L306.3 297.7L309.2 320.8L296.5 345.1Z");
  bag.draw("black", "M283.9 277.8L302.3 247.5L311.7 239.2L311.9 251.6L306.3 265L283.3 281.8Z");
  bag.draw("black", "M282.4 278.8L279.9 273.9L281.4 254.1L273.6 229.8L265.5 246.5L266.3 260.6L279.5 277.6L281.2 284.2Z");
  bag.draw("black", "M289 255.2L308.1 234.1L311.2 211.5L293.6 229.7L286.7 256.9Z");
  bag.draw("sm-658d5c", "M284 280L297.1 253.7L311.1 240.8L311 253.7L307.2 263.6L285.1 278.4Z");
  bag.draw("black", "M261.1 266.5L270.5 276.4L280.8 302.5L262.5 291.4L254 275.3L255.1 259.7L259.8 265.3Z");
  bag.draw("sm-658d5c", "M280 299.4L265.3 293.1L257.6 285.1L254.3 274.7L255.3 261.4L269.8 275.9L278.7 298.3Z");
  bag.draw("sm-658d5c", "M295.4 342.1L295.4 317.4L306.1 299.5L308.6 322.8L296.4 343.9Z");
  bag.draw("sm-a48253", "M331.3 385.5L329.5 387.5L335 387.5Z");
  bag.draw("sm-466343", "M328.3 386.3L309.4 387.4L291.2 401.1L309.5 402.8L329.5 387.5Z");
  bag.draw("black", "M405.8 431.1L408.8 428.8L405 430.9Z");
  bag.draw("sm-a48253", "M340.5 388.9L336.9 390.8L338.4 388Z");
  bag.draw("sm-658d5c", "M287.6 255.6L291.9 233.7L297.9 224.2L310.3 213.6L309.4 229.1L304.2 238.8L288.8 254.2Z");
  bag.draw("black", "M288 255.7L292.3 233.9L298.2 224.5L310.1 214L308.3 230.9L287.2 255.9L307.6 234.7L310.5 213.2L293 230L287.1 255.4Z");
  bag.draw("sm-658d5c", "M282.1 279L281.3 281.5L271 267.9L265.8 256.7L266.2 244.1L273 231.6L280.9 252.9L281.5 278.5Z");
  bag.draw("black", "M281.6 278.8L271.3 267.6L266.3 256.6L266.7 244.3L272.9 232.1L280.1 251.1L279.3 274.3L282.5 279.2L280.2 274.2L281 250.9L273 231.1L265.8 244L265.3 256.8L270.6 268.1L281.4 281.9L282.5 279.1Z");
  bag.draw("sm-a48253", "M285.9 260.3L282.5 256.7L285.7 261.5Z");
  bag.draw("black", "M286.2 260L282.6 255L284.5 262.8L283 255.7L285.7 260.6Z");
  bag.draw("sm-d99f31", "M285.9 253.5L285.7 254.5L285.4 255.4L284.9 256.3L284.2 257L283.4 257.5L282.4 257.8L281.4 257.9L280.5 257.8L279.5 257.5L278.7 257L278 256.3L277.5 255.4L277.1 254.5L277 253.5L277.1 252.5L277.5 251.6L278 250.8L278.7 250.1L279.5 249.5L280.5 249.2L281.4 249.1L282.4 249.2L283.4 249.5L284.2 250.1L284.9 250.8L285.4 251.6L285.7 252.5Z");
  bag.draw("sm-f1bf31", "M281.7 253.1L281.9 249.6L284.9 251.7L283.5 253.7Z");
  bag.cut("black", "M286.7 253.6L286.5 254.8L286.1 255.9L285.5 256.9L284.7 257.8L283.7 258.4L282.6 258.8L281.4 258.9L280.2 258.8L279.1 258.4L278.1 257.8L277.3 256.9L276.7 255.9L276.3 254.8L276.1 253.6L276.3 252.5L276.7 251.4L277.3 250.4L278.1 249.5L279.1 248.9L280.2 248.5L281.4 248.4L282.6 248.5L283.7 248.9L284.7 249.5L285.5 250.4L286.1 251.4L286.5 252.5ZM285.3 252.8L285 251.9L284.5 251.2L283.9 250.6L283.1 250.1L282.3 249.8L281.4 249.7L280.5 249.8L279.7 250.1L278.9 250.6L278.3 251.2L277.8 251.9L277.6 252.8L277.5 253.6L277.6 254.5L277.8 255.4L278.3 256.1L278.9 256.7L279.7 257.2L280.5 257.5L281.4 257.6L282.3 257.5L283.1 257.2L283.9 256.7L284.5 256.1L285 255.4L285.3 254.5L285.4 253.6Z");
  bag.draw("sm-d99f31", "M308.5 344.4L308.4 345.4L308.1 346.4L307.5 347.3L306.8 348L305.9 348.5L305 348.9L304 349L302.9 348.9L302 348.5L301.1 348L300.4 347.3L299.8 346.4L299.5 345.4L299.4 344.4L299.5 343.4L299.8 342.4L300.4 341.6L301.1 340.8L302 340.3L302.9 340L304 339.8L305 340L305.9 340.3L306.8 340.8L307.5 341.6L308.1 342.4L308.4 343.4Z");
  bag.draw("sm-f1bf31", "M303.4 344L303.4 340.3L306.8 341.5L305.2 345.3Z");
  bag.cut("black", "M309.5 344.4L309.3 345.6L308.9 346.8L308.3 347.9L307.4 348.7L306.4 349.4L305.2 349.8L304 349.9L302.7 349.8L301.6 349.4L300.5 348.7L299.7 347.9L299 346.8L298.6 345.6L298.5 344.4L298.6 343.2L299 342L299.7 341L300.5 340.1L301.6 339.5L302.7 339.1L304 338.9L305.2 339.1L306.4 339.5L307.4 340.1L308.3 341L308.9 342L309.3 343.2ZM308 343.5L307.7 342.6L307.2 341.9L306.5 341.2L305.7 340.7L304.9 340.4L304 340.3L303 340.4L302.2 340.7L301.4 341.2L300.8 341.9L300.3 342.6L300 343.5L299.9 344.4L300 345.3L300.3 346.2L300.8 347L301.4 347.6L302.2 348.1L303 348.4L304 348.5L304.9 348.4L305.7 348.1L306.5 347.6L307.2 347L307.7 346.2L308 345.3L308.1 344.4Z");
  bag.draw("black", "M407.2 432.7L410.3 430.7L406.4 432.4Z");
  bag.draw("black", "M417.9 446.9L414.3 444.7L417.3 443.8L418.1 447.7L417.8 443L413.7 443L417.7 447.8Z");
  bag.draw("sm-a48253", "M417.8 447.3L414 443.9L418.7 446.5Z");
  bag.draw("black", "M417.9 446.9L414.4 444.1L418.1 447.7L417.3 443.3L413.6 443.6L417.7 447.8Z");
  bag.draw("black", "M287.4 256.2L295.4 235.6L308 216.9L296 235.9L288.4 255.4Z");
  bag.draw("black", "M272.5 235.8L273.2 259.1L280.5 278.7L274 259.1L272.5 236.2Z");
  bag.draw("black", "M259.1 273.2L268.2 289.7L278.8 298.2L268.2 288.4L259.4 273.7Z");
  bag.draw("black", "M286.5 276.5L300.3 261.5L309.4 245.3L300.9 261.6L287.7 276.5Z");
  bag.draw("black", "M295.5 342.8L306 304.2L297 341.7Z");
  bag.draw("black", "M290.2 300.7L300.2 289.2L305 276.4L300.8 289.3L290.5 301.6Z");
  bag.draw("black", "M282.4 334.9L266.9 322.5L252.6 303.3L266.2 322.9L282.4 335.7Z");
  bag.draw("black", "M328.6 380L302.2 357.3L327.9 380.4Z");
  bag.draw("black", "M348 386.7L335.1 375.4L327.2 362.8L335.1 374.4L348 385.8Z");
  bag.draw("black", "M296 400.2L328.2 386.8L298.4 399.7Z");
  bag.draw("sm-d99f31", "M319.4 382.2L319.3 383.2L318.9 384.2L318.4 385.1L317.6 385.8L316.8 386.3L315.8 386.7L314.8 386.8L313.8 386.7L312.8 386.3L311.9 385.8L311.2 385.1L310.7 384.2L310.3 383.2L310.2 382.2L310.3 381.2L310.7 380.2L311.2 379.4L311.9 378.6L312.8 378.1L313.8 377.8L314.8 377.6L315.8 377.8L316.8 378.1L317.6 378.6L318.4 379.4L318.9 380.2L319.3 381.2Z");
  bag.draw("sm-f1bf31", "M319.3 381.3L313.3 380.4L314.2 377.7L318.4 379.4Z");
  bag.cut("black", "M320.3 382.2L320.2 383.4L319.8 384.6L319.1 385.6L318.2 386.5L317.2 387.2L316 387.6L314.8 387.7L313.6 387.6L312.4 387.2L311.4 386.5L310.5 385.6L309.8 384.6L309.4 383.4L309.3 382.2L309.4 381L309.8 379.8L310.5 378.8L311.4 377.9L312.4 377.2L313.6 376.8L314.8 376.7L316 376.8L317.2 377.2L318.2 377.9L319.1 378.8L319.8 379.8L320.2 381ZM318.8 381.3L318.5 380.4L318 379.6L317.4 379L316.6 378.5L315.7 378.2L314.8 378.1L313.9 378.2L313 378.5L312.2 379L311.6 379.6L311.1 380.4L310.8 381.3L310.7 382.2L310.8 383.1L311.1 384L311.6 384.8L312.2 385.4L313 385.9L313.9 386.2L314.8 386.3L315.7 386.2L316.6 385.9L317.4 385.4L318 384.8L318.5 384L318.8 383.1L318.9 382.2Z");
  bag.draw("black", "M297.8 357.5L275.5 350.1L260.1 340.4L273.9 348.8L297.8 356.6Z");
  bag.draw("sm-d99f31", "M338.9 395L338.8 395.9L338.5 396.8L338 397.6L337.3 398.3L336.5 398.8L335.6 399.1L334.7 399.2L333.7 399.1L332.8 398.8L332 398.3L331.4 397.6L330.8 396.8L330.5 395.9L330.4 395L330.5 394L330.8 393.1L331.4 392.3L332 391.6L332.8 391.1L333.7 390.8L334.7 390.7L335.6 390.8L336.5 391.1L337.3 391.6L338 392.3L338.5 393.1L338.8 394Z");
  bag.cut("black", "M340.2 395L340.1 396.2L339.6 397.4L339 398.4L338.1 399.3L337.1 399.9L335.9 400.3L334.7 400.5L333.5 400.3L332.3 399.9L331.3 399.3L330.4 398.4L329.7 397.4L329.3 396.2L329.2 395L329.3 393.7L329.7 392.6L330.4 391.5L331.3 390.7L332.3 390L333.5 389.6L334.7 389.5L335.9 389.6L337.1 390L338.1 390.7L339 391.5L339.6 392.6L340.1 393.7ZM338.8 394L338.5 393.1L338 392.3L337.3 391.6L336.5 391.1L335.6 390.8L334.7 390.7L333.7 390.8L332.8 391.1L332 391.6L331.4 392.3L330.8 393.1L330.5 394L330.4 395L330.5 395.9L330.8 396.8L331.4 397.6L332 398.3L332.8 398.8L333.7 399.1L334.7 399.2L335.6 399.1L336.5 398.8L337.3 398.3L338 397.6L338.5 396.8L338.8 395.9L338.9 395Z");
  bag.draw("sm-f1bf31", "M338.2 398L333.7 395.7L333.2 391.7L337 391L339 396.6Z");
  bag.cut("black", "M339.7 395L339.6 396.1L339.2 397.2L338.6 398.1L337.8 398.9L336.9 399.5L335.8 399.9L334.7 400L333.6 399.9L332.5 399.5L331.5 398.9L330.7 398.1L330.1 397.2L329.8 396.1L329.6 395L329.8 393.9L330.1 392.8L330.7 391.8L331.5 391L332.5 390.4L333.6 390.1L334.7 389.9L335.8 390.1L336.9 390.4L337.8 391L338.6 391.8L339.2 392.8L339.6 393.9ZM338.7 394.1L338.4 393.2L337.9 392.4L337.2 391.8L336.5 391.3L335.6 391L334.7 390.9L333.8 391L332.9 391.3L332.1 391.8L331.5 392.4L331 393.2L330.7 394.1L330.6 395L330.7 395.9L331 396.8L331.5 397.5L332.1 398.2L332.9 398.7L333.8 399L334.7 399.1L335.6 399L336.5 398.7L337.2 398.2L337.9 397.5L338.4 396.8L338.7 395.9L338.8 395Z");
  bag.draw("sm-a48253", "M289.6 332.6L290.8 337.1L289.4 332.6Z");
  bag.draw("sm-658d5c", "M289 333.5L278.2 321.2L275.2 311.2L276.7 298.6L285.5 286.5L291.6 309.4L289 326.1L290.8 334.5Z");
  bag.draw("sm-a48253", "M287.9 331.2L290.5 334.3L289.7 331.7Z");
  bag.draw("black", "M289.4 333.2L278.6 321L275.7 311.1L277.1 298.8L285.4 286.9L291.2 309.4L288.5 327.9L291.2 334.3L289.5 326.1L292.1 309.3L285.6 286L277 296.6L274.6 308.9L277.8 321.4L288.6 333.8Z");
  bag.draw("black", "M289 331.1L282.1 311.4L283.4 292.4L281.8 312.9L288.4 331.9Z");
  bag.draw("black", "M514.7 257.7L517.6 253.8L515.6 260.5Z");
  bag.draw("black", "M519.1 275.3L520.4 260.5L517.5 252.7L520.7 243.5L528.9 233.8L534.3 242.2L538.4 243.7L536 250.5L539.4 252.5L535.5 257.6L537.8 260.8L522.8 272.3L519.8 280.8Z");
  bag.draw("sm-658d5c", "M519.8 279.1L520.7 260.6L518 252.8L521.1 243.7L525.2 241.8L527.2 236.1L530.8 235.6L537.9 244.4L536 250.7L538.3 252.4L536.3 261.3L520.1 276.7Z");
  bag.draw("black", "M519.4 275.9L526.9 259.2L529.7 241L527.7 258.4L519.8 277Z");
  bag.draw("black", "M519.6 286.9L522.6 282.6L525.3 283.5L520 289.5Z");
  bag.draw("sm-a48253", "M520.3 289.4L524.9 283.6L519.9 286.8Z");
  bag.draw("black", "M511.7 247.4L519.3 272.5L521.1 304.2L516.5 327.1L505.7 349.1L490.7 368.1L473.3 382.6L430.9 398.4L415.5 407.6L400 423.6L387.9 445L381.3 447.4L393.1 425.7L410 407L429.1 395.2L471.2 379.5L487.9 365.8L500.9 350.1L512.1 329.5L518.3 306.3L518 278.1L512.3 253.3Z");
  bag.draw("black", "M497.3 240.3L492.4 238.3L493.1 233.9L487.8 229.5L489.7 226.1L485.8 212.7L497.6 213L499.3 217.1L504.7 218.2L505.5 223.8L509.5 223.8L509.5 232.5L512.9 234.9L511 247.3L497 242Z");
  bag.draw("black", "M496.3 264.5L491.1 262.6L492.6 259.5L487.6 255.9L487 247.6L495 246.9L498.6 250.2L502.2 249.1L504.9 253.4L507.7 252.3L519.5 282.1L513.9 275.2L504.8 273.5L504.4 270.1L497.9 269.6L495.8 266.7Z");
  bag.draw("sm-658d5c", "M518.5 278.2L518.9 280.6L513.2 275L505.1 273.1L504.5 270.1L498.1 269.1L488.2 255.6L489.2 247.6L507.5 252.7L516.9 277.1Z");
  bag.draw("black", "M520.1 307.8L527.1 288.8L533 283.1L546.7 276.3L549.9 284.1L543.8 301.8L535.7 303.3L532.8 307.4L523.3 307.5L519.6 313.2Z");
  bag.draw("sm-658d5c", "M520.5 308L524 294.9L532.8 283.8L547 277.2L548.8 285.8L543.1 301.5L532.6 306.8L523 307.8L520.2 312.3Z");
  bag.draw("black", "M521.7 307L545.1 282.4L521.5 307.8Z");
  bag.draw("black", "M523.7 284.4L522.6 278.5L526.9 273.4L532.8 279.4L525.8 284.8Z");
  bag.draw("black", "M532.5 280.5L526.7 278.7L525.3 274.2L533.7 271.3L533.3 279.4Z");
  bag.draw("sm-a48253", "M532.1 281.4L523.9 283.9L522.9 279.7L526.9 273.9L532.4 279.4Z");
  bag.draw("sm-d99f31", "M533.2 271.8L530.8 280.4L525.3 275.4L531.5 271.3Z");
  bag.draw("sm-f1bf31", "M531.9 271.8L532.9 277.5L532.4 272Z");
  bag.draw("black", "M493.8 286.8L489.2 273.2L498.9 272.7L506.5 276.8L508.9 282.9L512 283.5L518.1 301.9L512.8 298.3L500.6 298.6L493 288.7Z");
  bag.draw("sm-658d5c", "M517.6 301.9L513.3 298L501.6 298.2L495 292.5L490.2 273.6L498.9 273.5L506.7 277.7L517.9 300.3Z");
  bag.draw("black", "M517.3 301.7L506.7 286.7L493.7 275.4L506 286.6L515.9 301.7Z");
  bag.draw("black", "M509.9 319.3L512.3 320.8L509.3 337.1L508.7 332.3L494.9 326.8L494.4 321.9L490 318.6L488.8 309.3L489.9 302.1L499.8 302.8L502.2 306.3L506.1 306.1L509.9 317.4Z");
  bag.draw("black", "M530.1 327L528.8 329.7L520.2 328.9L513.8 332L514.9 329.1L528.1 312L542.3 304.9L544.7 314L542.9 321.5L537.6 326.3L531.2 327.2Z");
  bag.draw("black", "M477.6 346.9L476.4 342.4L482.2 335.8L492.5 346.9L491.3 361.4L483.9 367.4L481.9 373.3L474.1 356L476.4 353.1L473.9 349L476.7 347.2Z");
  bag.draw("sm-658d5c", "M481.8 372.9L474.8 356.1L476.7 342.6L480.6 337.7L482.3 336.3L488.5 340.8L493.1 353.3L483.5 371.4Z");
  bag.draw("black", "M531.1 337.1L537 337.9L533.2 344.6L534.6 347.1L529.2 350.2L529.2 353.3L521.8 354.7L519.8 357.9L510.1 357.3L516.3 338.4L529 335.1Z");
  bag.draw("black", "M499.8 340.1L498.2 341.7L501.3 343Z");
  bag.draw("black", "M498.2 332.5L495.2 337.9L491 338.8L489.1 328.7L496.7 331Z");
  bag.draw("black", "M490.6 336L498.9 332.4L500.6 339.5L495.5 342.3L490 337.3Z");
  bag.draw("sm-a48253", "M493.3 334.2L498.3 332.8L499.1 341L493.1 340.6L491 336.5Z");
  bag.draw("sm-d99f31", "M497.6 332.3L491 338.3L489.2 329.5L496.2 330.9Z");
  bag.draw("sm-f1bf31", "M490.6 329.5L497.1 333.2L490.9 329.5Z");
  bag.draw("sm-466343", "M512 356.9L519.4 357.4L532.7 348.9L536.3 338.7L529.2 335.3L516.6 338.5L510.9 357Z");
  bag.draw("black", "M515.2 349.9L532.7 339.9L515 349.3Z");
  bag.draw("black", "M515.2 349.9L532.7 339.9L515 349.3Z");
  bag.draw("black", "M477.3 379L482.1 378.9L483.1 377L479 377.3Z");
  bag.draw("black", "M463.6 400L469.5 394L471.5 401.1L462.7 399.9L472.2 401.7L471.4 394.8L467.9 392.9L462.7 400.1Z");
  bag.draw("black", "M460.3 392.6L456.2 389.6L461.6 391.4Z");
  bag.draw("black", "M460.1 391.6L466.4 391.3L469.7 394.3L462.4 399.5L459.4 391.1L459.2 396.2L463.8 400.7L469.9 396.5L469.6 392L459.6 390.8Z");
  bag.draw("sm-658d5c", "M513.1 333.1L520.1 328.7L536.8 326.4L542.7 320.1L541.8 305.6L528.4 312.1L514.7 329.3Z");
  bag.draw("sm-a48253", "M455.2 390L460.7 390.6L458 389Z");
  bag.draw("sm-a48253", "M460.4 391.6L466.7 391.3L469.3 396.2L462.9 399.7L460 392.7Z");
  bag.draw("sm-d99f31", "M463.5 399.9L469.3 393.9L471.5 400.9L465.2 401.1Z");
  bag.draw("sm-f1bf31", "M469.1 394.5L468.2 401.2L471.1 400.6L470.2 396Z");
  bag.draw("sm-a48253", "M515.8 260.5L518.2 252.3L515.6 252L515 257.6Z");
  bag.draw("sm-658d5c", "M513 255.1L508.3 246.9L493.2 238.3L493.2 233.4L488.4 228.6L487.5 213.1L496.8 213.5L499 217.2L503 217.5L505.2 223.9L508.7 224.1L509.1 232.5L512.2 234.6L511.9 247.7Z");
  bag.draw("black", "M496.9 399.1L499.4 404.5L488.8 406.5L485.3 402.3L480.2 402.6L471 387.8L464.4 387.1L482.5 386.1L491.6 389.6L491.7 393.2L497.4 397.5Z");
  bag.draw("sm-466343", "M467.2 386.2L482.7 386.4L491.9 389.9L498.9 404.2L490 406.3L485.5 402.2L481.9 403L471.8 388.4L465.4 387.1Z");
  bag.draw("black", "M466.3 386.4L481.5 391.2L493.4 399.6L481.6 390.7L467 386.1Z");
  bag.draw("black", "M491.1 376.2L490.4 383.3L484.5 384.8L480.8 377.7L489.1 375.2Z");
  bag.draw("black", "M487 384.8L487.4 379.1L490.5 376.7L495.3 383.8L486.5 385.4L496.1 384.3L494.5 378.4L489.2 376L486.2 385.2Z");
  bag.draw("sm-a48253", "M490.9 376.4L490.1 382.9L484.8 384.3L481.7 378.1L488.5 375.4Z");
  bag.draw("black", "M505.9 381.7L501.5 382.7L491.2 372.4L484.2 373.8L496.6 366L508.4 365.4L516.2 369.4L522.3 382.1L507.5 383.7Z");
  bag.draw("sm-658d5c", "M491.5 372.4L501 381.3L516 383.9L522 380.3L515.9 369.7L508.1 365.6L496.6 366.4L490.5 371.2Z");
  bag.draw("black", "M490.5 371L505.8 372.4L517.1 379.3L505 372.7L490.1 371.9Z");
  bag.draw("black", "M481.9 371.7L482.6 339.4L482.7 370.7Z");
  bag.draw("black", "M472.6 371.2L474.4 374.3L468.8 377.1L468.9 380.6L462.7 381.8L462 386L440.9 391.2L449.9 386.5L455.6 369.9L460.4 368.5L462.6 362.6L466.8 363.9L471.6 360.7L474 369.4Z");
  bag.draw("sm-658d5c", "M441.4 390.9L450.3 385.7L454.8 372.4L462.8 363.2L466.9 364.4L471.6 361.2L474 374L462.3 381.5L461.4 385.3L446.8 388.5Z");
  bag.draw("black", "M450.2 386L469.6 365.8L450.4 387.1Z");
  bag.draw("black", "M517.3 328.6L530.1 320.6L540 309.9L530.3 320.9L516.8 329.7Z");
  bag.draw("sm-466343", "M509.9 333.3L509.1 335.9L507.2 331L495.6 326.6L490.1 316.9L490.6 302.8L505.9 306.3L512.1 321.2L509.7 331.4Z");
  bag.draw("black", "M509.8 332.8L503.2 316L492.9 305.2L502.7 316L509 332.8Z");
  bag.draw("black", "M515.8 275.7L503.7 259.7L490.7 249.7L503.1 259.8L514.6 275.7Z");
  bag.draw("sm-a48253", "M513 250.5L519.5 275.4L520.7 306.2L515.4 329.3L504.1 350.9L490.4 367.7L473.1 382.1L432.8 397L415.2 407.2L399.3 423.6L386.5 445L382 445.3L396.2 422.4L410.9 407L428.5 396.1L469.5 381.3L486.4 368L501.2 350.4L512.4 329.7L518.6 306.5L518.5 280.4L512.3 252.8Z");
  bag.draw("black", "M511.8 248.2L503 231.3L490.8 216.4L503.6 233.2L512.7 253.7Z");
  bag.draw("sm-a48253", "M513.2 254.1L512 249.3L513.8 254.1Z");
  bag.draw("black", "M514.4 317L508.2 310.3L510.9 306.1L508.5 299.8L512.6 297.9L512.8 289.2L517.8 283.6L525.6 288L526 295.8L529.2 297.2L525.5 312L520.5 317.3Z");
  bag.draw("sm-658d5c", "M515.3 324L515.1 318.1L508.3 308.6L511.2 306.2L508.9 300.2L512.7 298.2L513.1 289.5L517.8 284.5L525.1 288.2L525.7 296L528.5 297.7L525.4 311.7L517.6 323.3Z");
  bag.draw("black", "M518 321.9L519.6 291.4L516.7 324.5Z");
  bag.draw("black", "M492.1 364.4L491.6 354.4L495.6 352.5L497.6 343.2L502.2 342.2L506 336.7L510.3 337.7L519.1 333L520 352.4L514.5 355.2L514.4 360L506.9 361L505.9 366.2L492.6 367.2L487.7 370.6Z");
  bag.draw("sm-658d5c", "M487.7 368.5L492.1 364.1L491.9 355.4L496 352.6L497.7 343.3L502.5 342.4L506 337L519.6 334.8L519.9 351.1L513.9 355.4L513.5 359.7L506.7 360.6L504.2 366.2L488.2 370Z");
  bag.draw("black", "M488 368.8L516.8 337.1L490.1 368.1Z");
  bag.draw("sm-d99f31", "M486.9 384.8L487.3 379.1L490.7 376.7L495.3 383.9L488.6 385.3Z");
  bag.draw("sm-f1bf31", "M491.4 377.7L491.7 382.9L494.8 383.7L492.7 378.9Z");
  bag.draw("black", "M516.6 254.6L513.7 245.6L517.8 243.4L523.3 247.8L518 254.5Z");
  bag.draw("black", "M523.1 246.5L518.3 248.7L514.3 245L520.2 238.1L523.2 243.6Z");
  bag.draw("sm-a48253", "M516.8 253.8L514 248.5L515.6 244.3L522.7 247.7L518.1 253.7Z");
  bag.draw("sm-d99f31", "M520.1 238.7L523 243.7L520.2 248L514.5 245L519 238.9Z");
  bag.draw("sm-f1bf31", "M519.9 239.3L521.5 245.7L520 239.3Z");
  bag.draw("black", "M382.7 446.7L386.8 443L382.1 447.1L386.1 446.8L387.1 442.1L381.8 446.7Z");
  bag.draw("sm-a48253", "M382.3 446.7L386.3 443L383.8 447.4Z");
  bag.draw("black", "M395.4 430.9L391.5 428.7L394.5 431.1Z");
  bag.draw("black", "M393.8 432.7L389.9 431L392.9 433Z");
  bag.draw("white", "M401.7 427.2L421.8 425L420.4 434.7L425.5 439.9L450.9 437.8L479.5 444.4L492.6 439.7L505.4 428.7L486.8 430.3L494.6 416.3L476 421.7L457.7 416.6L459.4 403.1L452.7 398.5L401.9 405.1L350.4 398.3L341.4 401.4L342.4 416.6L324.1 421.7L305.5 416.3L313.3 430.3L294.7 428.7L306.9 439.3L323.2 444.6L349.2 437.8L373.9 440.1L379.7 434.7L378.3 425L399.4 427.2Z");
  bag.draw("black", "M370.5 435.6L351.3 433L338.5 435.9L353.2 432L376.1 433L372.8 435.7ZM370.5 430.6L361.9 428.2L372.3 430.6ZM356.7 435.9L339.1 438.6L352.2 434.6L369.8 438.1L358.9 436.2ZM370.5 432.9L352.5 429.4L375.5 430.7L372.6 432.9Z");
  bag.draw("black", "M429.6 435.6L448.8 433L461.6 435.9L446.9 432L424 433L427.3 435.7ZM429.6 430.6L438.2 428.2L427.8 430.6ZM443.4 435.9L461 438.6L447.9 434.6L430.3 438.1L441.2 436.2ZM429.6 432.9L447.6 429.4L424.6 430.7L427.5 432.9Z");
  bag.draw("black", "M400 427.3L358.8 422.3L350.7 423.1L347.5 426.9L357.1 423.2L400 427.8ZM400.1 427.3L441.3 422.3L449.4 423.1L452.6 426.9L443 423.2L400 427.8Z");
  bag.draw("black", "M342.4 416.8L321.3 421.9L306.2 417.1L313.7 430.4L296.1 429.7L305.2 437.9L322.5 444.3L348.7 437.6L373.7 439.8L379.2 434.7L377.8 425.4L380.3 435.5L374.7 440.9L349.5 438.2L331.6 444.3L319.4 444.9L307.4 440.2L294.3 429L311.6 429.6L305.3 415.9L324.1 421.2L342.2 416.2Z");
  bag.draw("black", "M457.7 416.8L478.8 421.9L493.9 417.1L486.4 430.4L504 429.7L494.9 437.9L477.6 444.3L451.4 437.6L426.4 439.8L420.9 434.7L422.3 425.4L419.8 435.5L425.4 440.9L450.6 438.2L468.5 444.3L480.7 444.9L492.7 440.2L505.8 429L488.5 429.6L494.8 415.9L476 421.2L457.9 416.2Z");
  bag.draw("black", "M399.5 405.2L353.9 398.6L341.9 401.2L345 428.6L373.7 428.9L376.3 434.6L370.4 437.7L375.9 434.6L371.9 428.7L348.5 431.1L344.1 428.7L339.4 404.2L341.8 399.4L347.9 397.6L400 404.8L444.6 397.9L456.6 398.6L460.6 403.7L454.8 430.2L427.7 428.8L424.1 434.6L429.6 437.7L424.9 436.2L423.6 432.5L430.2 427.9L455 428.6L459.2 404.6L456.8 400.1L443.8 398.8L400.5 405.2Z");
  bag.draw("black", "M361.5 417.2L357.3 416.9L356.4 404.1L359.5 404.4L360.1 414.5L365.6 415.1L364.3 417.5Z");
  bag.draw("black", "M368.3 417.9L367.6 405.5L370.7 406L371.4 418.4Z");
  bag.draw("black", "M377.8 412.2L380.6 411.4L377.8 409.7ZM377.9 417.1L381.6 416.5L377.9 414.4ZM379.8 419.9L374.8 419L374.5 406.8L383.5 410.2L382.7 419.9Z");
  bag.draw("black", "M391.5 421.6L387.2 421L386.9 408.6L394.1 409.4L390.2 414L394.4 414.4L394.4 416.7L390.2 416.3L390.3 418.9L395.8 419.4L394.3 421.8Z");
  bag.draw("black", "M401.9 415.2L404.3 413.4L402.2 411.7L400.9 415.2ZM408.9 421.6L402.4 417.3L401.1 421.7L398 421.8L397.8 409.4L406.7 411L405.5 416.5L409.5 419.3Z");
  bag.draw("black", "M409 411.7L409 409.2L419.9 407.7L419.9 410.2L416 410.7L416.1 420.6L413 421L412.9 411.1Z");
  bag.draw("black", "M426.6 409.2L426.7 413L427 409.1ZM430 418.2L428.8 414.9L424.6 415.6L420.1 420L422.6 407.2L431 405.7L433.3 417.6Z");
  bag.draw("black", "M438.3 417.4L434.3 416.6L435.1 414.3L440.3 413.1L434.3 408.2L439.3 404.4L443.3 405.2L437.4 408.1L443.2 411.8L440.2 417.2Z");
  bag.box(800, 600);
  return bag.done("0 0 800 600");
}


function doonfMontenegro() {
  var bag = doonfBag();
  bag.draw("me-ffc000", "M15 30L1178.4 28.5L1178.4 571.5L21.6 571.5L30 15L0 15L8.4 598.5L1191.6 598.5L1191.6 1.5L15 0Z");
  bag.draw("me-e30000", "M15 15L1185 15L1185 585L15 585Z");
  bag.draw("me-d17624", "M629.2 201.5L622.9 204.4L625.2 209.6L612.9 217.5L617.2 223.6L603.3 235.1L607.5 243.7L601.4 252.9L595.3 244.2L599.5 235.1L585.6 223.6L590.1 217.8L568 196.3L576.2 185.2L601.4 188.8L626.6 185.2L634.8 196.3L631.9 199.8ZM572.6 160.7L564.1 159.3L567.4 142.1L573.8 137.6L569.4 150.1L573.7 159.4ZM587.9 137.1L595.1 132.5L593.3 149.8L597.6 157.3L583.3 156.7L586.3 138.7ZM608.7 153.5L607.7 132.5L620.1 146.9L619.5 156.7L612 159.8L607.4 155.5ZM630.5 140.3L637.5 145.4L638.7 159.3L629.3 159.8L633.4 152L630.9 141ZM544.7 370.4L523.4 382.1L524.5 387.8L511.5 391.8L516.1 396.2L508.5 402L516.1 405.1L512 408.2L479.4 410.9L465 377.7L461.8 358.9L449.1 335L447.2 314.6L456.3 320.8L476 324.1L454.9 322.8L455.6 328.5L465.2 336.9L481.4 337.5L469.3 341.3L475.1 349.6L495.4 350.2L483.9 354L489.4 359.5L511.1 361.3L507.4 366.7L517.7 369.3L535.2 361.3L530.5 368.4L534.3 371.5L547.4 363L545.4 368.9ZM445.5 312.3L442.3 314.2L440.9 309.6L445.6 312.3ZM736.4 293.7L763 280.5L773.4 261.9L742.8 277L759 268L770 252.4L771 240.6L740.9 264.8L761.9 243.7L768.6 216.6L744.5 245.9L758.1 222.3L760.8 196.8L757 187.5L738.5 231.1L747.5 202.2L747.9 175.1L741.4 160.1L738.3 186.8L730.6 207.4L734.4 170.5L724.5 146.2L720.4 185.3L709.5 212.4L698.2 230.7L694.4 225.3L670.2 260.9L671 270.7L682.4 281.9L682.3 287.6L664.6 291.9L656.2 299.7L662.6 274.5L638.1 249.4L636.9 242.9L642.3 242.5L641.2 227.2L646.8 229.7L651.4 218.2L662.9 219.5L673.1 211.4L693.4 212.9L699.1 200.5L695.8 195.7L689.2 205.6L666.3 204.9L675.8 199.1L684.1 203.7L685.3 195L680.7 188.7L669.4 188.6L661.1 181.8L641 186.3L629.2 182.2L634.1 176L633.3 168.5L646.2 161.8L648.6 147.3L641.7 135.8L630.3 128.7L608.3 123.2L610.3 116.7L604.6 108.7L608.3 109.1L608.6 103.2L598.1 100L594.5 123.3L572.5 128.7L561.1 135.8L554.4 146.9L556.6 161.8L570 169L568.8 176L573.6 182.2L561.5 186.3L541.7 181.8L533.4 188.6L521.6 189L518.5 203.6L526.8 199.1L536.6 204.9L513.6 205.6L507 195.7L503.5 201.5L509.4 212.9L529.7 211.4L539.3 219.3L551.4 218.2L556.2 229.9L561.6 227.2L560.5 242.5L565.9 242.9L564.7 249.4L540.4 274.5L546.8 299.8L538.2 291.9L520.6 287.6L520.8 281.4L531.7 271.1L532.5 260.4L508.4 225.3L505 230.9L493.8 213.4L482.6 185.6L478.3 146.2L468.5 170.5L472.5 207.3L464.8 187.9L461.5 160.1L455.1 174.3L455.4 202.4L464.4 231.1L445.9 187.5L441.9 197.8L444.7 222.1L458.5 245.8L434.2 216.6L440.5 242.9L462 264.8L432.1 240.7L433 252.9L443.5 267.7L460 277L429.5 261.9L441.4 281.8L468.4 294.5L434.4 282L440.1 296.8L469.9 308.2L437.7 302.2L436.5 296.6L429.6 299.2L432 305.7L426.6 307.6L430.2 315.3L434.3 313L431.4 322L441.2 331.4L447.3 365.4L458.4 381.6L463.3 404.9L470.3 416.3L463.4 422.8L463.6 430.2L475.6 447.5L487 450.9L487 462.9L499.3 464.7L500.5 456.8L507.7 453.8L497 446L513.4 423.8L526.1 416L528.9 421.3L548.3 409.1L553.7 413.5L579.7 383.3L569.1 404.1L569.9 416.8L563 432.1L542.1 451.7L556.1 458L553.7 469.8L565.7 467.6L566.1 477.9L579.5 472.7L579 482.2L583.9 488.6L590.9 481.4L601.4 500L611.9 481.4L618.9 488.6L623.8 482.2L623.3 472.7L636.7 477.9L637.1 467.6L648.8 470L646.8 458.5L660.8 451.4L639.8 432.1L632.9 416.8L633.7 404.1L621.4 384.1L650.2 413.7L655.2 408.9L674.5 421.1L677 417.4L682.4 419.1L707.6 432.1L757.3 416.3L760.1 409L755.2 388.8L743 375.3L749.6 365.1L745.5 362.9L747.3 358.6L739.8 356.3L738.1 361.6L734.1 359.8L734.6 372.2L720 375.8L706.4 389.7L701 401.4L706.8 416.7L690.5 404.5L695 401.8L687.3 397L692 391.8L663.5 375.6L655.4 363.2L663.9 371.3L672.4 369.7L667.7 361.3L677.9 368.6L691.3 368.5L695.8 366.1L691.8 361.3L708 361.7L717.6 356.4L707.5 350.2L730.4 347.9L733.6 341.3L721.5 337.5L739.3 336.1L748.1 323.1L726.9 324.1L751.2 318.6L759.8 303.9L732.8 308L757.2 301.5L768.7 284.9L734.5 294.6Z");
  bag.draw("me-e30000", "M543.3 208.3L513 206.6L506.1 199L507.2 208.4L544.3 209.2Z");
  bag.draw("me-e30000", "M696.7 199L689.8 206.6L670.3 205L658.8 210.1L691.1 211.1L697.5 205.7L696.8 199.2Z");
  bag.draw("me-ffc000", "M654.7 295.9L660.7 274.4L644.3 255.6L621.1 260.2L601.4 255.5L581.1 260.2L558.6 255.6L542.2 274.4L548.2 295.9L542.7 339.3L553.9 366.4L589.6 384.6L601.4 395.1L613.4 384.5L645.2 369.3L654.9 358.7L660.2 338.5L654.7 297.9Z");
  bag.draw("me-ffc000", "M528.5 400.8L506.6 411.8L477.5 413L471 419.6L475.6 426.3L480.3 418.6L495.9 421.3L485 419.8L486.7 426.3L487.9 422L491.4 424.1L493.4 435.6L496.5 428.7L499.9 433.4L524.8 412.6L528.4 401.1Z");
  bag.draw("me-ffc000", "M524.3 398.9L511.9 401.4L524.1 399.2Z");
  bag.draw("me-ffc000", "M546.4 397.5L545.4 394.5L537.2 403.2L542.9 393.6L527.3 388L517.3 391.9L533.1 396.8L527.7 417.5L547 404.7L546.5 398.6Z");
  bag.draw("me-ffc000", "M569.9 378.8L560.4 385.5L566.6 377.3L557.1 371.9L550.9 377.6L555 370.3L548.8 364.4L542.2 375.1L527.5 382.3L546 382.8L529.8 385.4L549.3 389.3L550.9 409L555.7 395.2L553.5 406.6L575.7 381.4L571.1 379.4Z");
  bag.draw("me-ffc000", "M443.5 305.6L437.2 303.9L435.2 297.9L429.2 308.4L431.3 311.9L435.3 309.6L438.1 317.3L442 315L438.6 308L443.5 306.4Z");
  bag.draw("me-ffc000", "M472.3 430.4L468.6 420L464.9 426L472.4 431.1Z");
  bag.draw("me-ffc000", "M475.8 429.2L477.9 434.2L476.6 429.3Z");
  bag.draw("me-ffc000", "M480 440.9L490.1 436.5L489 431.2L468.4 434.5L469.7 439.6L479.4 441.6Z");
  bag.draw("me-ffc000", "M495.7 442.4L491.7 437.9L476.3 444.2L482.3 447.6L494.6 443Z");
  bag.draw("me-ffc000", "M495.7 436.5L497 431.3L495.3 435.9Z");
  bag.draw("me-ffc000", "M490.5 427.6L489.3 423.8L486.8 428.8L490.1 429Z");
  bag.draw("me-ffc000", "M480.8 431.1L485 428.4L482.7 424.2L479.2 430.7Z");
  bag.draw("me-ffc000", "M484.5 422.9L482.7 419.6L484 423.4Z");
  bag.draw("me-ffc000", "M462.1 376.8L462.5 364.9L447.4 332.2L445.3 313.3L441.8 319L433.6 319.8L441 325.8L450.5 363.4L460.7 377Z");
  bag.draw("me-ffc000", "M466.8 390.3L466.3 403.7L474.3 412.5L477.2 403.9L467.5 390Z");
  bag.draw("me-ffc000", "M468.8 384.4L464.4 380.3L460.5 384L464.2 388.6L468.7 385.5Z");
  bag.draw("me-ffc000", "M503 452.5L495.6 446.4L489.7 447L491.7 459.3L496.1 453.8L504 453.2Z");
  bag.draw("me-ffc000", "M497.1 456.4L497.4 461.2L498 456.7Z");
  bag.draw("me-ffc000", "M480.1 212L489.9 233.7L474.2 208.6L471.7 222L484 241.2L468.1 222.1L467.3 233.9L478.6 248.7L463.9 235.6L462.1 240.9L476.1 260.4L461.9 252.2L463.6 261.1L477.9 274.5L464.1 270.1L464.7 276.8L480.4 285.9L468.1 290.6L485.5 299.3L475.2 305.5L481.2 310L495.7 310.7L485 316.1L490.2 320.8L505.9 320.9L498.6 328.8L514.9 328.6L505.9 334.7L506.2 338.7L528.1 336L520.2 341.7L521 347.2L537.6 345.2L540.8 332.2L520.7 324L516.7 315.3L507.3 313.3L487.7 292.6L488.7 283.3L481.7 276.9L484.6 269.4L477.8 262.3L483.6 256.1L481.2 247.1L491.1 244.2L493.1 234.3L504.8 233.2L485.9 193L480 210.8Z");
  bag.draw("me-ffc000", "M545.3 300.6L517.1 286.6L517.3 278.6L528.9 269.6L531.5 261.7L508.7 227.5L506.9 237.7L497.9 234L492.7 237.1L498.5 249.5L489.1 244.8L482.4 247.6L490.2 257.6L482.4 257.7L479.4 262.1L491.5 269L484.6 270.4L482.7 275.2L495 281.2L487.9 289.4L500.4 292.9L496.3 298.3L499 301.9L510.8 301.3L506.3 309.7L520.3 311.3L520.3 322.1L534 319.6L533.6 326L538.1 329.1L541.5 329.1L546.8 300.6Z");
  bag.draw("me-ffc000", "M450.1 231.1L462.1 246.8L450.7 219.2L461.2 237.7L465.6 235.9L454.3 216.9L445.8 189.7L442.9 206.6L449.3 229.3Z");
  bag.draw("me-ffc000", "M456.6 258.2L461.1 261.4L460.1 255.5L447.4 242.1L460.4 254.3L461.6 250.1L435.6 215.8L439.3 237.1L456.2 258Z");
  bag.draw("me-ffc000", "M493.4 330.9L496.2 325.6L480 329.3L493.9 324.5L489.7 322.3L456.3 324.5L459.6 331.1L470 335.3L492.5 331.3Z");
  bag.draw("me-ffc000", "M476.1 321.7L485.3 319.8L483.7 314.3L467.6 314.7L480.5 313.2L475.9 309.2L446.3 306.3L454.2 317.6L474.4 321.7Z");
  bag.draw("me-ffc000", "M474.4 306L474.4 301.8L454.4 297.1L478.3 299.5L435.4 283.9L446.6 299.5L474.3 306Z");
  bag.draw("me-ffc000", "M446.7 283.2L466.7 291.4L471.1 285.9L449.4 278.4L468.8 284L463.6 279.1L430.9 263.5L444.7 281.7Z");
  bag.draw("me-ffc000", "M445.4 266.8L462.7 275.8L445.5 261.1L462.2 271.1L463.5 266.7L432.6 242.4L434.8 253.9L443.7 265.4Z");
  bag.draw("me-ffc000", "M474.2 205.8L478.7 213.1L475.4 177.9L479.5 202.4L483.2 192.1L477.5 148.3L469.7 174L473.8 204.9Z");
  bag.draw("me-ffc000", "M464.9 227.4L467.8 221.3L461 194.9L470.3 223.3L471.1 208.5L460.7 162.4L455.4 192.2L464.8 227.2Z");
  bag.draw("me-ffc000", "M507.9 341.9L504.1 335.5L492.7 341.2L504.8 333.3L497 332L471.4 341.9L483.2 349L507.8 341.9Z");
  bag.draw("me-ffc000", "M518.7 350.3L517.4 344.4L506 351.8L513.8 343.1L487.2 354.9L504.7 359.5L518.6 351Z");
  bag.draw("me-ffc000", "M540.1 346.3L521.3 359.7L528.8 351.5L521.6 351.5L511.7 363.9L527.6 364.1L540.1 346.4Z");
  bag.draw("me-ffc000", "M542.8 359.9L541.6 350.5L533.3 367.2L542.9 366.6L543.7 358.9Z");
  bag.draw("me-ffc000", "M731.7 269.6L741.1 252.4L726.8 260.4L740.7 238.6L738.7 235.7L724.3 248.7L735.4 234.3L734.8 222.1L718.9 241.2L731.1 222.5L728.7 208.6L713 233.7L722.8 212L717.3 192.8L698 235L709.2 234L711.7 244.2L721.7 247.1L719.3 256.1L725.1 262.3L718.3 269.4L720.7 278.2L714.2 283.3L715.4 292.2L695.6 313.3L686.2 315.3L681.2 324.7L662.1 332.2L662.5 342.5L671.8 348.2L681.2 347.6L682.7 341.7L674.8 336L696.2 339L697 334.7L688 328.6L702.4 329.7L705.1 325.5L697 320.9L716.4 318.6L717.3 314.2L707.1 311L727.4 306.1L727.4 302.5L717.5 299.1L734.8 290.8L733.9 287.3L722.5 285.9L738.6 275.9L737.2 270.1L725 274.5L730 270.8Z");
  bag.draw("me-ffc000", "M720.5 257.7L712.7 257.5L720 251.7L719.8 246.3L704.4 249.5L710.2 237.1L705 234L696 237.7L694.2 227.5L671.3 261.9L673.6 269.1L685.6 278.7L685.7 286.7L656.1 300.6L661.4 329.1L668.8 326.6L668.8 319.6L682.4 322.3L682.5 311.3L696.6 309.7L692.1 301.3L703.9 301.9L706.6 298.3L702.5 292.9L714.4 290.5L714.3 284.7L707.9 281.2L719.7 276.2L719.4 271.3L711.4 269L722.5 263.9L721.5 258.2Z");
  bag.draw("me-ffc000", "M740.8 246.8L757.4 219.4L758 190.3L737.3 235.9L741.7 237.7L752.2 219.2L740.9 246.4Z");
  bag.draw("me-ffc000", "M767.3 215.8L741.4 250L742.4 254.3L755.4 242.3L741.7 261.4L762.1 240.1L767.3 215.9Z");
  bag.draw("me-ffc000", "M733.2 174L725.3 148.3L719.7 192.3L723.4 202.4L727.3 177.9L724.3 213.6L730.6 200L733.3 176.2Z");
  bag.draw("me-ffc000", "M742.9 215.2L747.7 186.4L742.2 162.4L731.8 208.5L732.6 223.3L741.9 194.8L735.1 221.3L738 227.4L742 217.6Z");
  bag.draw("me-ffc000", "M745.8 324.4L708.5 323.9L723 329L706.7 325.6L709.5 330.9L727.8 336L741.2 332.5L746.2 324.3Z");
  bag.draw("me-ffc000", "M756.6 306.3L727 309.2L722.4 313.2L735.3 314.7L719.2 314.3L717.6 319.8L723.3 321.5L747.8 318L757.9 306.4Z");
  bag.draw("me-ffc000", "M766.3 284.3L724.6 299.5L748.1 297L728.5 301.8L728.5 306L748.3 303L760.5 296.4L767.5 283.9Z");
  bag.draw("me-ffc000", "M770.8 264L739.3 279.1L735.3 283.9L752.3 279.5L731.8 285.9L736.1 291.4L746.5 288.4L764.1 277.1L772 263.5Z");
  bag.draw("me-ffc000", "M739.8 269.3L757.4 261.1L740.7 272L741.2 275.8L758.9 265.7L768.1 253.8L770.3 242.4L738.4 268.8Z");
  bag.draw("me-ffc000", "M705.9 332L698 333.3L710.2 341.2L698.8 335.5L695 341.9L715.1 348.7L729.4 345.8L731.5 341.9L706 332Z");
  bag.draw("me-ffc000", "M688.1 343.2L696.9 351.8L685.4 344.4L688.2 356.1L709.2 358.6L715.7 354.9L688.4 343.1Z");
  bag.draw("me-ffc000", "M684.8 356.2L681.1 351.3L674.1 351.5L679.3 358.8L662.8 346.3L668.5 358.3L684.1 366.3L691.2 364.3L685.7 357.1Z");
  bag.draw("me-ffc000", "M661.3 350.5L662 362.2L658.4 358.3L657.1 362.1L663 368.2L669.6 367L661.6 351.3Z");
  bag.draw("me-ffc000", "M658.5 193.7L662.8 194.7L658.8 192.6Z");
  bag.draw("me-ffc000", "M632.7 192.5L644.4 194.6L666.6 189.6L666 185.5L654.8 183.1L639.4 190.6L642.3 187.4L628.5 183.3L630.5 190.7Z");
  bag.draw("me-ffc000", "M680 189.7L666.8 191.1L661.2 197.8L656.5 194L636.6 196.7L615.3 217.7L619 222.9L604.3 236.1L614.6 240L625.4 232.8L626.7 257.5L634.8 238.5L640 240.1L641.3 222.8L646.3 227.9L652 215.5L668.3 214.6L670.4 211.3L657.4 208.8L673 197L683.7 200.6L681.3 190.4Z");
  bag.draw("me-ffc000", "M638.4 252.7L636.2 248.5L632.2 256.8L639.2 253.7Z");
  bag.draw("me-ffc000", "M622.6 240.7L614.5 249.1L620.2 241.8L609.7 243.9L604.3 254.3L624.5 257.9L622.6 240.9Z");
  bag.draw("me-ffc000", "M539.7 193.7L544.3 193.7L540 192.6Z");
  bag.draw("me-ffc000", "M537.2 189.7L564.9 194.6L572.9 190.1L574.3 183.3L560.5 187.4L563.5 190.6L545.1 182.8L537.1 185.3L536.2 189.6Z");
  bag.draw("me-ffc000", "M596.9 234.5L583.8 222.9L587.6 217.7L566.2 196.7L546.3 194L542 197.9L531.4 189.4L520.5 191.5L518.6 200.4L530.3 197.2L545.6 209L532.5 211.3L535.5 215.4L550.8 215.5L556.6 227.9L561.5 222.8L562.8 240.1L567.8 238.3L576.1 257.5L577.5 232.8L589.5 240.2L597.7 234.8Z");
  bag.draw("me-ffc000", "M566.6 248.5L563.3 254L570.6 256.8L566.6 248.8Z");
  bag.draw("me-ffc000", "M594.2 246.7L582.6 241.8L586.9 248.6L580.2 240.7L578.3 257.9L598 254.7L594.8 247.8Z");
  bag.draw("me-ffc000", "M570.7 414.6L580.5 404.5L578.4 420.5L582.9 421.8L589.2 411.1L588.5 429.7L596.7 417.2L599.4 431.5L604.1 430.5L606.2 417.2L614.4 429.7L613.5 412.9L622 422.5L622.9 405.3L627.7 413.3L633.3 413L619.2 385.1L601.5 400.4L583.7 385.1L571.3 403.1L570.2 414.3Z");
  bag.draw("me-ffc000", "M570.6 430.6L573.9 427.8L575 440L582.2 435.1L583 447.4L592.8 436.5L595.4 449.7L601.5 455.7L607.6 449.7L610.1 436.5L619.9 447.4L620.7 435.1L627.6 440L629 427.8L636.7 432.3L635.2 421.9L626.5 414.9L631.7 424L626.5 420.5L621.7 425.1L623.8 432.7L617.8 423.7L616.5 438.7L607.5 428.2L601.5 445.2L595.4 428.2L586.5 438.7L585.1 423.7L579.2 432.7L581.2 425.1L576.5 420.5L571.2 424L576.5 414.9L566.9 423.5L568.6 431.7Z");
  bag.draw("me-ffc000", "M563.2 452.7L575 442.8L572.3 431.3L564.3 432.3L544 450.6L552.7 455.1L562.6 453Z");
  bag.draw("me-ffc000", "M584.3 450.3L580.6 439.6L556.3 460.2L556 466.6L565.1 465.4L584.2 450.5Z");
  bag.draw("me-ffc000", "M595 453.9L591.1 442.5L566.7 469.3L567.9 473.9L585.4 466.7L595 454Z");
  bag.draw("me-ffc000", "M598.2 470.2L600.5 459.9L596 454.8L581.5 472L583 483.9L597.4 471.3Z");
  bag.draw("me-ffc000", "M657.6 449.7L638.6 432.3L630.7 431.3L630.6 446.2L645.8 455.2L659 451Z");
  bag.draw("me-ffc000", "M643.1 456.8L622.4 439.6L618.6 450.3L633 462.9L646.9 466.6L644.1 457.4Z");
  bag.draw("me-ffc000", "M626.5 459.9L611.9 442.5L607.9 453.9L617.6 466.7L635.3 473.9L635.8 468.2L627.6 460.5Z");
  bag.draw("me-ffc000", "M614.1 465.4L607 454.8L602.4 459.9L609.8 475.6L621.8 482.8L622.7 474.3L615.2 466.3Z");
  bag.draw("me-ffc000", "M603.8 473.8L601.5 470.7L593.3 479.1L598.6 491.3L601.5 493.8L608.1 486L609.7 479.1L605.1 475.1Z");
  bag.draw("me-0071bc", "M749.9 407.5L741.4 410.9L741.5 414.9L751.2 408Z");
  bag.draw("me-0071bc", "M754.5 391.5L745 378.8L741.9 390L754.4 393.3Z");
  bag.draw("me-0071bc", "M728 387.3L732.4 374.7L721.4 376.9L714 383.9L727.2 387.2Z");
  bag.draw("me-0071bc", "M714.4 399.5L711.5 398.9L713.8 404.8L720.6 410.5L729.7 409.5L733.9 403.2L715.3 399.7Z");
  bag.draw("me-d17624", "M649.5 301.3L654.7 277.7L640.6 261.2L622.7 265.4L601.5 260.4L579.7 265.4L562.4 261.2L548.3 277.7L553.8 295.6L548.3 343.2L560.8 364.2L601.5 388.4L638.6 366.9L650.3 354.2L655.1 338.6L649.8 302.8Z");
  bag.draw("me-d17624", "M629.5 235.1L629.3 248.2L629.9 234Z");
  bag.draw("me-d17624", "M645.2 211.3L637.4 215.2L641.6 205.2L633.7 222.3L646.6 211.4Z");
  bag.draw("me-d17624", "M561.2 205.2L565.5 215.2L557.2 213.5L569.1 222.3L561.6 205.6Z");
  bag.draw("me-d17624", "M601.3 422.9L601.9 414.8L601 422.7Z");
  bag.draw("me-d17624", "M567.5 442.2L556.7 449.8L567.2 442.6Z");
  bag.draw("me-d17624", "M576.3 452.7L565.6 458.8L575.5 453.4Z");
  bag.draw("me-d17624", "M586.4 459.7L575.5 466L585.8 460.6Z");
  bag.draw("me-d17624", "M637.4 458.8L625.6 451.6L637.8 459.3Z");
  bag.draw("me-d17624", "M611.8 469L617.8 477.1L613 469.8Z");
  bag.draw("me-0071bc", "M648.1 302.8L652.2 278.3L639.5 264.2L623.3 267.7L601.5 263.3L579.8 267.7L563.4 264.2L550.7 278.3L555.2 296.8L550.4 342.6L562 342.6L576 327.8L574.7 312.5L567.5 310.9L557.3 291.9L558.1 288.6L562.2 290.8L560.1 281.1L564.1 282.1L564.8 278.2L570.6 280.4L570.3 295.3L576.4 301.8L586.9 295.1L575.4 286.9L575.6 281.8L580.2 285.2L581.3 279.4L602.3 275.5L608.3 279.5L605.9 284.3L609.3 288.2L604.7 292.1L609.8 298.5L603.5 301.4L608.5 305.9L636.7 305.5L635.7 300.9L616.9 296.9L613.6 289.3L627.5 281.7L642.6 282.1L637.3 288L618 290.7L644.8 300.9L642.8 308.7L632.3 311.5L634.2 318L642.5 321.6L640.2 342.6L652.5 342.6L648.4 304.4Z");
  bag.draw("me-39b54a", "M551.9 348.6L563.1 364.5L601.5 386.7L639.8 364.5L651 348.6Z");
  bag.draw("me-ffc000", "M560.5 295.2L573.6 309.7L569.5 283.6L561.9 285.4L564.3 292.8L559.8 293.9Z");
  bag.draw("me-ffc000", "M577 312.3L583.5 307.3L585.1 315.8L589.2 310.9L592.7 316.3L594.7 309.7L598.9 311.9L599.7 306.2L604.3 307.7L600.5 299L607.2 296.6L602.2 292.4L595.1 294L597.4 288.9L592.9 287.9L600.9 279.1L595.8 282.5L593.7 277.2L581.1 280.6L586.6 287.9L582.4 291L591 294.5L576.8 303.6L584.6 299.9L584.4 303.1L589.2 301.1L589.1 305.8L592.9 303.2L589.3 308.1L581.3 303.2L576.2 310.7Z");
  bag.draw("me-ffc000", "M602.1 283.2L604.5 279.5L601.4 283.1Z");
  bag.draw("me-ffc000", "M601.7 284.4L598.9 291.3L607 288.4L602.9 284.5Z");
  bag.draw("me-ffc000", "M583.6 289.1L576 282.5L582.9 289.1Z");
  bag.draw("me-ffc000", "M572.2 342L578.7 341.9L580.6 321.9L567.1 339.2L571.6 341Z");
  bag.draw("me-ffc000", "M600.3 340.2L598.2 342.6L600.9 340.4Z");
  bag.draw("me-ffc000", "M617.3 325.1L617.1 321.5L608.8 321.9L611.2 333.4L602 338.5L610.7 342.6L616.1 335.8L616.1 325.9Z");
  bag.draw("me-ffc000", "M606.3 308.4L593.3 319L588.1 315.6L585.5 318.7L581.2 313.6L575.1 319.5L581.5 318.2L585.2 325.3L588.8 320L593 323.7L596.4 319.4L620.1 315L622.6 325.7L635.2 329L627 342.6L637.3 342.6L640.4 322.2L632.3 317.5L629.5 308.9L605.8 307.2Z");
  bag.draw("me-ffc000", "M550.6 343.7L551.3 346.7L651.6 346.7L652.3 343.7Z");
  bag.draw("me-ffc000", "M618.2 295.8L639.1 300.3L639.1 305.4L631.4 309.5L640.8 307.5L641.2 298.4L616.7 290.5L641.3 283L617.2 286.4L616.7 294.8Z");
  bag.draw("me-d17624", "M591.8 278.8L590.5 282L593.2 279.3Z");
  bag.draw("me-ffc000", "M713 396.3L735.2 400.7L741.1 393.3L745.2 402.2L752.4 403.7L754.8 395.4L740 391.2L743.6 377.3L738.6 375.3L733.8 374.4L730.1 388.4L712.9 385.3L711.4 395.9Z");
  bag.draw("me-ffc000", "M756.9 406.4L739.7 418.2L737.2 413.9L744.4 404.5L739.1 400.5L731.2 412L719.6 414.4L706.2 395.8L702.4 402.2L709.5 418.3L674.5 400.5L677.5 411.7L712.6 429.3L751.3 418.1L758 413.3L757.7 407.1Z");
  bag.draw("me-ffc000", "M734.6 366.5L738.6 366.4L736.5 373.3L740.4 374.5L742.7 367.5L747.1 368.4L747.8 364.9L742.9 364.1L745.3 359.7L740.2 358.3L733.8 366.5Z");
  bag.draw("me-ffc000", "M670.3 397.8L685.9 392.1L675.9 388.2L660.4 393.8L666.3 403.5L656.8 397L656 404.6L675.6 417.7L670.9 398.5Z");
  bag.draw("me-ffc000", "M656 389.3L673.4 385.8L657.2 383L676 382.7L661.6 375.8L654.5 364.6L648.2 370.5L652.4 377.8L646.1 372.1L636.6 377.5L642.8 385.7L634.4 378.5L627.5 381.6L649.6 406.9L647.5 395.4L652.3 409.3L654.3 389.3Z");
  bag.draw("me-ffc000", "M683.9 397.9L681.1 401L691.3 401.6L684.9 397.7Z");
  bag.draw("me-ffc000", "M740.8 394.5L740.6 399.8L741.5 395.3Z");
  bag.draw("me-ffc000", "M707 394.4L709.6 388.9L706.5 394.1Z");
  bag.draw("me-d17624", "M479.5 279.6L474.9 278.4L479.3 280Z");
  bag.draw("me-d17624", "M495 306.1L485.2 306.9L494.9 306.6Z");
  bag.draw("me-d17624", "M489.1 239.6L483.4 232.1L488.6 239.5Z");
  bag.draw("me-d17624", "M494.6 263.4L486.4 261.9L493.9 263.8Z");
  bag.draw("me-d17624", "M686.6 335.1L681.1 331.5L687.1 335.1Z");
  bag.draw("me-d17624", "M730.6 263.7L723.7 268.3L729.9 264.7Z");
  bag.draw("me-d17624", "M719.5 232.1L713.8 239.2L719.3 232.7Z");
  bag.draw("me-d17624", "M708.3 263.4L716.2 262.3L708.9 262.9Z");
  bag.draw("me-d17624", "M699.4 244.3L704 240.1L699.3 243.7Z");
  bag.draw("me-d17624", "M675.4 314L669.7 310.3L675.8 314.7Z");
  bag.draw("me-ffc000", "M628 178.1L622.8 173.8L628.4 168.6L592.7 166.9L572.3 169.5L580.1 173.8L574.5 178.9L628.4 178.9Z");
  bag.draw("me-ffc000", "M572.7 171.5L569.4 174.1L573.5 175.9L577.9 172.8Z");
  bag.draw("me-ffc000", "M630.1 171.5L624.9 172.8L633.4 174.1Z");
  bag.draw("me-ffc000", "M619.4 181.3L583.5 181.3L618.7 181.6Z");
  bag.draw("me-0071bc", "M608.7 330.5L606.2 322.1L588.1 325L581.2 342.6L596.9 342.6L609.5 331.6Z");
  bag.draw("me-0071bc", "M633.9 331L619.1 326.1L614.5 342.6L622.1 342.6L634.2 332Z");
  bag.draw("me-ffc000", "M599.9 110.6L607.6 107.4L604.2 100.8L595.8 104.1L600.1 107Z");
  bag.draw("me-ffc000", "M608.4 116.2L600.2 111.6L594.5 118.8L608.6 117.1Z");
  bag.draw("me-0071bc", "M601.6 124.5L608.3 120L594.8 120L600.1 124.3Z");
  bag.draw("me-0071bc", "M598.7 112.1L595.2 115.2L598.7 115.2Z");
  bag.draw("me-d17624", "M605.6 169.6L601.4 167.7L596.1 173.2L601.5 175.9L607.2 170.4Z");
  bag.draw("me-d17624", "M615.3 168.3L619.3 171L616.7 176.1L611.4 173.6L614 168.5Z");
  bag.draw("me-d17624", "M587.5 168.3L591.4 171L588.8 176.1L583.5 173.6L586.1 168.5Z");
  bag.draw("me-ffc000", "M596.9 171L601.5 173.3L606.1 171L601.4 168.7Z");
  bag.draw("me-ffc000", "M615.3 169L615.3 173.8L616.6 169.4Z");
  bag.draw("me-ffc000", "M587.5 169L586.2 173.5L588.7 169.4Z");
  bag.draw("me-ffc000", "M578.8 158.5L577.4 153.1L577.9 157.8Z");
  bag.draw("me-ffc000", "M575.3 159.8L579.1 161.7L575.9 159.1Z");
  bag.draw("me-ffc000", "M578.2 164.6L572.2 162L568.2 165.9L572.9 167.4L580.6 163.5Z");
  bag.draw("me-ffc000", "M559.9 157.6L557.9 160.7L560.8 158.3Z");
  bag.draw("me-ffc000", "M563.4 153.2L566.1 141.3L582.5 127.9L560.5 140.4L556.8 153.3L563.7 156.2Z");
  bag.draw("me-ffc000", "M558.1 147.9L554.7 147.9L557.6 149Z");
  bag.draw("me-ffc000", "M592.8 124.4L587.9 126.4L589.3 131.4L585.1 128L572.8 141.2L570.8 152.5L576.5 157.2L576.3 151.4L582.1 155.2L582.7 141.5L594.5 129.6L594.1 124.3Z");
  bag.draw("me-ffc000", "M587.5 130.2L588.8 127.5L586.3 129.6Z");
  bag.draw("me-ffc000", "M595.5 161.7L599 159.2L594.1 160.9Z");
  bag.draw("me-ffc000", "M599.6 163.1L582.4 162.2L587.2 165.7L600.1 162.3Z");
  bag.draw("me-ffc000", "M583.9 161.4L587.6 160L582.7 159.7Z");
  bag.draw("me-ffc000", "M603.8 159.2L607.4 161.7L605.2 158.6Z");
  bag.draw("me-ffc000", "M618.2 163.9L602.3 162.2L604.8 165.7L619.7 162.7Z");
  bag.draw("me-ffc000", "M625.5 155.6L621.6 157.1L625.4 156.7Z");
  bag.draw("me-ffc000", "M624.6 162.3L626.9 159.1L623.7 161.7Z");
  bag.draw("me-ffc000", "M630.7 162L621.7 163.8L630 167.4L634.6 165.9L631 163.2Z");
  bag.draw("me-ffc000", "M638.1 160.8L633.9 162.5L636.9 163.7L639.2 160.8Z");
  bag.draw("me-ffc000", "M643 157.6L644.1 161.2L644.5 156.7Z");
  bag.draw("me-ffc000", "M643.5 148.4L638.4 136.2L620.3 127.9L636.7 141.3L639.9 158.8L645.8 154.2L643.8 149.9Z");
  bag.draw("me-ffc000", "M646.4 146.2L646.4 149.5L647.6 146.7Z");
  bag.draw("me-ffc000", "M607.7 128.1L619.5 140.1L621.2 156L626 151.4L626.4 157.2L630.5 155.3L632.1 148L623.6 132.1L617.7 128L613.9 131.5L614.9 126.4L610.6 124.6L607.6 127.5Z");
  bag.draw("me-ffc000", "M601.4 152.8L599.7 157.3L603.1 157.3L601.7 153.7Z");
  bag.draw("me-ffc000", "M598.3 155.9L601.4 151.1L604.5 155.9L607.9 150.7L606 125L596.8 125L594.5 148.2L598.2 155.8Z");
  bag.draw("me-ffc000", "M613.5 128.5L616.5 129.6L614 127.5Z");
  bag.draw("me-d17624", "M576.5 142.8L577.8 149.3L573.3 147.5L575.1 143Z");
  bag.draw("me-d17624", "M582.4 134.4L577.6 138.5L581.9 139.4L583.2 135.2Z");
  bag.draw("me-ffc000", "M576.3 143.8L576.3 147.6L577.7 144.4Z");
  bag.draw("me-ffc000", "M581 134.7L578.5 136.8L582 135.8Z");
  bag.draw("me-d17624", "M601.4 143.1L598 145.3L600 150L604.8 148.1L602.8 143.4Z");
  bag.draw("me-d17624", "M601.4 135L604.9 138.4L601.4 141.8L600 135.2Z");
  bag.draw("me-d17624", "M601.4 127.2L604.8 130.4L601.4 133.7L600.1 127.4Z");
  bag.draw("me-d17624", "M626.4 142.8L625 149.3L629.5 147.5L627.7 143Z");
  bag.draw("me-d17624", "M624.9 135.2L619.3 137.4L623.3 139.8L625.5 136.3Z");
  bag.draw("me-ffc000", "M626.5 143.8L626.5 147.6L627.9 144.4Z");
  bag.draw("me-ffc000", "M601.4 144.2L600 147.4L602.8 144.7Z");
  bag.draw("me-ffc000", "M601.4 139.6L601.4 136L600.1 139.1Z");
  bag.draw("me-ffc000", "M601.4 131.4L601.4 128.3L600.2 131Z");
  bag.draw("me-d17624", "M716.3 387.7L713.3 390.7L716.3 393.8L717.5 388Z");
  bag.draw("me-d17624", "M724.8 389.7L721.7 392.8L724.8 395.9L726 390Z");
  bag.draw("me-d17624", "M749.5 395L748.3 400.9L752.4 399.3L750.7 395.2Z");
  bag.draw("me-d17624", "M733.3 391.7L730.2 394.8L733.3 397.9L734.5 392Z");
  bag.draw("me-d17624", "M735.5 384.3L732.4 387.4L735.5 390.5L736.7 384.6Z");
  bag.draw("me-d17624", "M737.7 376.9L734.6 380L737.7 383.1L738.9 377.1Z");
  bag.draw("me-ffc000", "M725 391L725 394.1L726.1 391.4Z");
  bag.box(1200, 600);
  return bag.done("0 0 1200 600");
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
