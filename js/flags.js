function doonfNum(n) {
  return Math.round(n * 100) / 100;
}

function doonfPts(pts) {
  return pts.map(function (p) {
    return doonfNum(p.x) + " " + doonfNum(p.y);
  }).join(" ");
}

function doonfPoly(pts) {
  return "M " + doonfPts(pts) + " Z";
}

function doonfLineAtX(p, q, x) {
  var t = (x - p.x) / (q.x - p.x);
  return { x: x, y: p.y + t * (q.y - p.y) };
}

function doonfLineAtY(p, q, y) {
  var t = (y - p.y) / (q.y - p.y);
  return { x: p.x + t * (q.x - p.x), y: y };
}

function doonfIntersect(p1, p2, p3, p4) {
  var d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  var t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
}

function doonfCircles(c0, r0, c1, r1) {
  var dx = c1.x - c0.x;
  var dy = c1.y - c0.y;
  var d = Math.hypot(dx, dy);
  var a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
  var h = Math.sqrt(Math.max(0, r0 * r0 - a * a));
  var xm = c0.x + (a * dx) / d;
  var ym = c0.y + (a * dy) / d;
  var rx = (-dy * h) / d;
  var ry = (dx * h) / d;
  return [
    { x: xm + rx, y: ym + ry },
    { x: xm - rx, y: ym - ry }
  ];
}

function doonfOffset(points, dist) {
  var lines = points.map(function (p, i) {
    var q = points[(i + 1) % points.length];
    var dx = q.x - p.x;
    var dy = q.y - p.y;
    var len = Math.hypot(dx, dy);
    var nx = (dy / len) * dist;
    var ny = (-dx / len) * dist;
    return {
      a: { x: p.x + nx, y: p.y + ny },
      b: { x: q.x + nx, y: q.y + ny }
    };
  });
  return lines.map(function (line, i) {
    var prev = lines[(i + lines.length - 1) % lines.length];
    return doonfIntersect(prev.a, prev.b, line.a, line.b);
  });
}

function doonfAng(c, p) {
  return Math.atan2(p.y - c.y, p.x - c.x);
}

function doonfWrap(a) {
  while (a <= -Math.PI) a += Math.PI * 2;
  while (a > Math.PI) a -= Math.PI * 2;
  return a;
}

function doonfArc(center, r, from, to, anchor, far) {
  var a0 = doonfAng(center, from);
  var delta = doonfWrap(doonfAng(center, to) - a0);
  var other = delta > 0 ? delta - Math.PI * 2 : delta + Math.PI * 2;
  function mid(step) {
    var a = a0 + step / 2;
    return {
      x: center.x + r * Math.cos(a),
      y: center.y + r * Math.sin(a)
    };
  }
  var m1 = mid(delta);
  var m2 = mid(other);
  var d1 = Math.hypot(m1.x - anchor.x, m1.y - anchor.y);
  var d2 = Math.hypot(m2.x - anchor.x, m2.y - anchor.y);
  var step = (d1 > d2) === far ? delta : other;
  var pts = [];
  var n = 28;
  for (var i = 0; i <= n; i++) {
    var a = a0 + (step * i) / n;
    pts.push({
      x: center.x + r * Math.cos(a),
      y: center.y + r * Math.sin(a)
    });
  }
  return pts;
}

function doonfStar(cx, cy, outer, inner, points, start) {
  var pts = [];
  for (var i = 0; i < points * 2; i++) {
    var radius = i % 2 === 0 ? outer : inner;
    var a = start + (i * Math.PI) / points;
    pts.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) });
  }
  return pts;
}

function doonfNepalParts() {
  var ab = 3;
  var s2 = Math.SQRT2;
  var A = { x: 0, y: 0 };
  var B = { x: ab, y: 0 };
  var C = { x: 0, y: ab + ab / 3 };
  var F = { x: 0, y: ab / s2 };
  var G = { x: ab, y: ab / s2 };
  var E = { x: ab - ab / s2, y: ab / s2 };
  var Hx = ab / 4;
  var J = { x: 0, y: (C.y + F.y) / 2 };
  var L = { x: Hx, y: J.y };
  var M = doonfLineAtX(J, G, Hx);
  var dist = Math.abs(M.x + M.y - ab) / s2;
  var N = { x: Hx, y: M.y - dist };
  var ln = Math.hypot(L.x - N.x, L.y - N.y);
  var hits = doonfCircles(L, ln, N, dist);
  var R = hits[0];
  var S = hits[1];
  var T = doonfLineAtX(R, S, Hx);
  var border = Math.hypot(T.x - N.x, T.y - N.y);
  var W = { x: 1.15, y: 1.05 };
  var inner = [A, B, E, G, C];
  var outer = doonfOffset(inner, border);
  var moon = { x: 0.92, y: 2.72 };
  var moonOuter = { x: moon.x, y: moon.y };
  var moonInner = { x: moon.x, y: moon.y + 0.2 };
  var moonHits = doonfCircles(moonOuter, 0.46, moonInner, 0.36);
  var moonLeft = moonHits[0].x < moonHits[1].x ? moonHits[0] : moonHits[1];
  var moonRight = moonHits[0].x < moonHits[1].x ? moonHits[1] : moonHits[0];
  var crescent = doonfArc(moonOuter, 0.46, moonLeft, moonRight, moonInner, true).concat(
    doonfArc(moonInner, 0.36, moonRight, moonLeft, moonOuter, false)
  );
  var rayHub = { x: moon.x, y: moon.y + 0.16 };
  var rays = [];
  for (var i = 0; i < 8; i++) {
    var a0 = Math.PI * (0.16 + 0.68 * i / 8);
    var a1 = Math.PI * (0.16 + 0.68 * (i + 0.5) / 8);
    var a2 = Math.PI * (0.16 + 0.68 * (i + 1) / 8);
    rays.push([
      { x: rayHub.x + 0.2 * Math.cos(a0), y: rayHub.y + 0.2 * Math.sin(a0) },
      { x: rayHub.x + 0.48 * Math.cos(a1), y: rayHub.y + 0.48 * Math.sin(a1) },
      { x: rayHub.x + 0.2 * Math.cos(a2), y: rayHub.y + 0.2 * Math.sin(a2) }
    ]);
  }
  var sun = doonfStar(W.x, W.y, 0.58, 0.26, 12, Math.PI / 2);
  var bounds = outer.concat(rays.reduce(function (all, tri) {
    return all.concat(tri);
  }, [])).concat(sun);
  var minX = Math.min.apply(null, bounds.map(function (p) { return p.x; }));
  var minY = Math.min.apply(null, bounds.map(function (p) { return p.y; }));
  var maxX = Math.max.apply(null, bounds.map(function (p) { return p.x; }));
  var maxY = Math.max.apply(null, bounds.map(function (p) { return p.y; }));
  return {
    viewBox: [minX, minY, maxX - minX, maxY - minY].map(doonfNum).join(" "),
    flip: "translate(0 " + doonfNum(maxY + minY) + ") scale(1 -1)",
    outer: doonfPoly(outer),
    inner: doonfPoly(inner),
    crescent: doonfPoly(crescent),
    rays: rays.map(doonfPoly),
    sun: doonfPoly(sun)
  };
}

function doonfUsaStar(cx, cy, r) {
  return doonfPoly(doonfStar(cx, cy, r, r * 0.382, 5, -Math.PI / 2));
}

function doonfFleur(cx, cy, s) {
  var petal = doonfPoly([
    { x: cx, y: cy - s },
    { x: cx + s * 0.22, y: cy - s * 0.42 },
    { x: cx + s * 0.62, y: cy - s * 0.72 },
    { x: cx + s * 0.48, y: cy - s * 0.28 },
    { x: cx + s * 0.16, y: cy - s * 0.08 },
    { x: cx, y: cy + s * 0.08 },
    { x: cx - s * 0.16, y: cy - s * 0.08 },
    { x: cx - s * 0.48, y: cy - s * 0.28 },
    { x: cx - s * 0.62, y: cy - s * 0.72 },
    { x: cx - s * 0.22, y: cy - s * 0.42 }
  ]);
  var stem = doonfPoly([
    { x: cx - s * 0.08, y: cy },
    { x: cx + s * 0.08, y: cy },
    { x: cx + s * 0.08, y: cy + s * 0.72 },
    { x: cx + s * 0.28, y: cy + s * 0.72 },
    { x: cx + s * 0.28, y: cy + s * 0.88 },
    { x: cx - s * 0.28, y: cy + s * 0.88 },
    { x: cx - s * 0.28, y: cy + s * 0.72 },
    { x: cx - s * 0.08, y: cy + s * 0.72 }
  ]);
  return petal + " " + stem;
}

function doonfFlagRecord(viewBox, areas, lines) {
  return {
    viewBox: viewBox,
    body:
      '<g class="areas">' + areas + "</g>" +
      '<g class="lines">' + lines + "</g>"
  };
}

function doonfItaly() {
  var areas =
    '<rect data-fill="green" x="0" y="0" width="1" height="2"></rect>' +
    '<rect data-fill="white" x="1" y="0" width="1" height="2"></rect>' +
    '<rect data-fill="red" x="2" y="0" width="1" height="2"></rect>';
  var lines =
    '<path d="M0 0 H3 V2 H0 Z"></path>' +
    '<path d="M1 0 V2"></path>' +
    '<path d="M2 0 V2"></path>';
  return doonfFlagRecord("0 0 3 2", areas, lines);
}

function doonfSwitzerland() {
  var cross =
    "M13 6 H19 V13 H26 V19 H19 V26 H13 V19 H6 V13 H13 Z";
  var areas =
    '<rect data-fill="swiss" x="0" y="0" width="32" height="32"></rect>' +
    '<path data-fill="white" d="' + cross + '"></path>';
  var lines =
    '<path d="M0 0 H32 V32 H0 Z"></path>' +
    '<path d="' + cross + '"></path>';
  return doonfFlagRecord("0 0 32 32", areas, lines);
}

function doonfNepal() {
  var n = doonfNepalParts();
  var areas =
    '<path data-fill="blue" d="' + n.outer + '"></path>' +
    '<path data-fill="crimson" d="' + n.inner + '"></path>' +
    '<path data-fill="white" d="' + n.crescent + '"></path>' +
    n.rays.map(function (d) {
      return '<path data-fill="white" d="' + d + '"></path>';
    }).join("") +
    '<path data-fill="white" d="' + n.sun + '"></path>';
  var lines =
    '<path d="' + n.outer + '"></path>' +
    '<path d="' + n.inner + '"></path>' +
    '<path d="' + n.crescent + '"></path>' +
    n.rays.map(function (d) {
      return '<path d="' + d + '"></path>';
    }).join("") +
    '<path d="' + n.sun + '"></path>';
  var body =
    '<g class="areas" transform="' + n.flip + '">' + areas + "</g>" +
    '<g class="lines" transform="' + n.flip + '">' + lines + "</g>";
  return { viewBox: n.viewBox, body: body };
}

function doonfUsa() {
  var height = 100;
  var width = 190;
  var stripe = height / 13;
  var areas = "";
  var lines = '<path d="M0 0 H190 V100 H0 Z"></path>';
  for (var i = 0; i < 13; i++) {
    areas += '<rect data-fill="' + (i % 2 === 0 ? "us-red" : "white") +
      '" x="0" y="' + doonfNum(i * stripe) + '" width="190" height="' + doonfNum(stripe) + '"></rect>';
    if (i > 0) {
      lines += '<path d="M0 ' + doonfNum(i * stripe) + ' H190"></path>';
    }
  }
  var cantonH = 7 * stripe;
  var cantonW = 76;
  areas += '<rect data-fill="navy" x="0" y="0" width="' + cantonW + '" height="' + doonfNum(cantonH) + '"></rect>';
  lines += '<path d="M0 0 H' + cantonW + " V" + doonfNum(cantonH) + ' H0 Z"></path>';
  var rows = [6, 5, 6, 5, 6, 5, 6, 5, 6];
  var starR = 2.45;
  rows.forEach(function (count, row) {
    for (var col = 0; col < count; col++) {
      var x = count === 6
        ? (col * 2 + 1) * cantonW / 12
        : (col + 1) * cantonW / 6;
      var y = ((row + 1) * cantonH) / 10;
      var d = doonfUsaStar(x, y, starR);
      areas += '<path data-fill="white" d="' + d + '"></path>';
      lines += '<path d="' + d + '"></path>';
    }
  });
  return doonfFlagRecord("0 0 " + width + " " + height, areas, lines);
}

function doonfSpain() {
  var areas = "";
  var lines = "";
  areas += '<rect data-fill="spain-red" x="0" y="0" width="450" height="75"></rect>';
  areas += '<rect data-fill="spain-yellow" x="0" y="75" width="450" height="150"></rect>';
  areas += '<rect data-fill="spain-red" x="0" y="225" width="450" height="75"></rect>';
  lines += '<path d="M0 0 H450 V300 H0 Z"></path>';
  lines += '<path d="M0 75 H450"></path>';
  lines += '<path d="M0 225 H450"></path>';

  function add(fill, d) {
    areas += '<path data-fill="' + fill + '" d="' + d + '"></path>';
    lines += '<path d="' + d + '"></path>';
  }
  function ink(d) {
    lines += '<path d="' + d + '"></path>';
  }
  function pillar(cx) {
    add("white",
      "M" + (cx - 18) + " 214 H" + (cx + 18) + " V230 H" + (cx - 18) + " Z " +
      "M" + (cx - 10) + " 92 H" + (cx + 10) + " V214 H" + (cx - 10) + " Z " +
      "M" + (cx - 18) + " 74 H" + (cx + 18) + " V98 H" + (cx - 18) + " Z"
    );
  }
  function ribbon(x0, x1, y) {
    add("spain-red",
      "M" + x0 + " " + (y - 6) +
      " C" + (x0 + 24) + " " + (y - 24) + " " + (x1 - 28) + " " + (y + 10) + " " + x1 + " " + (y - 8) +
      " L" + x1 + " " + (y + 8) +
      " C" + (x1 - 24) + " " + (y + 22) + " " + (x0 + 22) + " " + (y - 8) + " " + x0 + " " + (y + 10) +
      " Z"
    );
  }

  pillar(112);
  pillar(338);
  ribbon(62, 158, 154);
  ribbon(292, 388, 154);

  add("spain-red", "M164 84 H286 V168 H164 Z");
  add("white", "M225 84 H286 V168 H225 Z");
  add("white", "M164 196 H286 Q286 232 225 262 Q164 232 164 196 Z");
  add("gold", "M164 168 H225 V200 H164 Z");
  add("spain-red", "M225 168 H286 V200 H225 Z");
  ink("M164 84 H286 V176 Q286 232 225 262 Q164 232 164 176 Z");
  ink("M225 84 V196");
  ink("M164 168 H286");

  add("gold",
    "M176 160 V132 H170 V124 H178 V132 H186 V112 H180 V104 H188 V112 H196 V92 H190 V84 H206 V92 H214 V104 H208 V112 H216 V132 H224 V124 H232 V132 H226 V160 Z " +
    "M196 160 V142 H208 V160 Z " +
    "M198 118 H206 V128 H198 Z " +
    "M176 140 H184 V150 H176 Z " +
    "M216 140 H224 V150 H216 Z"
  );
  add("purple",
    "M268 162 L262 146 L274 150 L258 132 L278 116 " +
    "C288 102 276 88 264 96 L272 84 L258 98 L252 112 " +
    "L236 100 L246 114 L230 108 L248 122 L236 116 " +
    "C228 108 238 96 250 102 L232 92 L226 98 L238 104 " +
    "L246 96 L252 86 L260 98 L266 90 L258 108 L268 116 " +
    "L260 132 L270 140 L262 162 Z"
  );
  [172, 184, 196, 208].forEach(function (x) {
    add("spain-red", "M" + x + " 172 H" + (x + 8) + " V196 H" + x + " Z");
  });
  add("gold", (function () {
    var cx = 255;
    var cy = 184;
    var d = "M" + (cx - 4) + " " + cy + " a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0 ";
    for (var i = 0; i < 8; i++) {
      var a = (i * Math.PI) / 4;
      var x = cx + 14 * Math.cos(a);
      var y = cy + 12 * Math.sin(a);
      d += "M" + doonfNum(x) + " " + doonfNum(y) + " m -4 0 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0 ";
      d += "M" + doonfNum(cx + 5 * Math.cos(a)) + " " + doonfNum(cy + 5 * Math.sin(a));
      d += " L" + doonfNum(x) + " " + doonfNum(y) + " ";
    }
    return d;
  })());
  add("leaf", "M214 214 Q225 198 236 214 Q230 206 225 204 Q220 206 214 214 Z");
  add("spain-red", "M213 230 a 12 14 0 1 0 24 0 a 12 14 0 1 0 -24 0");
  add("gold", "M221 214 H229 V206 H221 Z");
  add("azure", "M225 158 m -22 0 a 22 30 0 1 0 44 0 a 22 30 0 1 0 -44 0");
  add("gold", doonfFleur(225, 142, 11));
  add("gold", doonfFleur(214, 166, 9));
  add("gold", doonfFleur(236, 166, 9));

  add("gold",
    "M184 84 H266 V72 L258 66 Q250 46 240 44 L246 36 L236 30 L246 24 L225 12 L204 24 L214 30 L204 36 L210 44 Q200 46 192 66 L184 72 Z"
  );
  add("gold", "M217 2 H233 V12 H243 V22 H233 V30 H217 V22 H207 V12 H217 Z");
  ink("M196 74 Q212 44 225 38");
  ink("M254 74 Q238 44 225 38");
  ink("M225 76 V38");
  [198, 212, 225, 238, 252].forEach(function (x) {
    add("spain-red", "M" + (x - 3) + " 73 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0");
  });

  return doonfFlagRecord("0 0 450 300", areas, lines);
}

var DOONF_FLAG_SHAPES = {
  italy: doonfItaly(),
  switzerland: doonfSwitzerland(),
  nepal: doonfNepal(),
  usa: doonfUsa(),
  spain: doonfSpain()
};

function doonfFlagSvg(id, mode, label) {
  var shape = DOONF_FLAG_SHAPES[id];
  return '<svg class="flag flag-' + mode + '" viewBox="' + shape.viewBox + '" role="img" aria-label="' + label + '">' +
    shape.body + "</svg>";
}
