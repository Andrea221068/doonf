function doonfText(lang) {
  return DOONF_TEXT[lang];
}

function doonfOrdered(lang) {
  return DOONF_COUNTRIES.slice().sort(function (a, b) {
    return a.name[lang].localeCompare(b.name[lang], lang);
  });
}

function doonfPopulation(country, lang) {
  var text = doonfText(lang);
  var rounded = Math.round(country.population / 1000000);
  var unit = rounded === 1 ? text.millionOne : text.millionMany;
  return text.about + " " + rounded + " " + unit + " (2026)";
}

function doonfFacts(country, lang) {
  return country.continent[lang] + " · " + country.capital[lang] + " · " + doonfPopulation(country, lang);
}

function doonfSvg(flagId, mode, label) {
  var holder = document.createElement("div");
  holder.innerHTML = doonfFlagSvg(flagId, mode, label);
  return holder.firstChild;
}

function doonfChrome(lang, currentHref, otherHref) {
  var bar = document.createElement("header");
  bar.className = "chrome top";
  var brand = document.createElement("a");
  brand.className = "brand";
  brand.href = "index.html";
  brand.textContent = "Doonf";
  var langs = document.createElement("nav");
  langs.className = "langs";
  ["it", "en"].forEach(function (code) {
    var link = document.createElement("a");
    link.href = code === lang ? currentHref : otherHref;
    link.textContent = code.toUpperCase();
    if (code === lang) link.setAttribute("aria-current", "true");
    langs.appendChild(link);
  });
  bar.appendChild(brand);
  bar.appendChild(langs);
  return bar;
}

function doonfHome(lang) {
  var text = doonfText(lang);
  document.title = text.homeTitle;
  document.documentElement.lang = text.htmlLang;
  var other = lang === "it" ? "../en/index.html" : "../it/index.html";
  document.body.appendChild(doonfChrome(lang, "index.html", other));

  var intro = document.createElement("p");
  intro.className = "chrome intro";
  intro.textContent = text.intro;
  var note = document.createElement("p");
  note.className = "chrome note";
  note.textContent = text.note;
  document.body.appendChild(intro);
  document.body.appendChild(note);

  var list = document.createElement("div");
  list.className = "chrome catalog";
  doonfOrdered(lang).forEach(function (country) {
    var card = document.createElement("a");
    card.className = "card";
    card.href = country.slug[lang] + ".html";
    var mini = document.createElement("div");
    mini.className = "mini";
    mini.appendChild(doonfSvg(country.flag, "color", country.name[lang]));
    var title = document.createElement("h2");
    title.textContent = country.name[lang];
    var facts = document.createElement("p");
    facts.textContent = doonfFacts(country, lang);
    card.appendChild(mini);
    card.appendChild(title);
    card.appendChild(facts);
    list.appendChild(card);
  });
  document.body.appendChild(list);
}

function doonfSheet(lang, id) {
  var text = doonfText(lang);
  var country = DOONF_COUNTRIES.filter(function (item) {
    return item.id === id;
  })[0];
  var order = doonfOrdered(lang);
  var index = order.findIndex(function (item) {
    return item.id === id;
  });
  var previous = order[(index + order.length - 1) % order.length];
  var next = order[(index + 1) % order.length];
  var otherLang = lang === "it" ? "en" : "it";

  document.title = country.name[lang] + " " + text.sheetTitle;
  document.documentElement.lang = text.htmlLang;
  document.body.appendChild(doonfChrome(
    lang,
    country.slug[lang] + ".html",
    "../" + otherLang + "/" + country.slug[otherLang] + ".html"
  ));

  var wrap = document.createElement("main");
  wrap.className = "sheet-wrap";

  var pager = document.createElement("nav");
  pager.className = "chrome pager";
  var prevLink = document.createElement("a");
  prevLink.href = previous.slug[lang] + ".html";
  prevLink.textContent = "← " + previous.name[lang];
  var nextLink = document.createElement("a");
  nextLink.href = next.slug[lang] + ".html";
  nextLink.textContent = next.name[lang] + " →";
  pager.appendChild(prevLink);
  pager.appendChild(nextLink);

  var sheet = document.createElement("article");
  sheet.className = "sheet";
  var heading = document.createElement("h1");
  heading.textContent = country.name[lang];
  var facts = document.createElement("p");
  facts.className = "facts";
  facts.textContent = doonfFacts(country, lang);
  var frame = document.createElement("div");
  frame.className = "frame";
  frame.appendChild(doonfSvg(country.flag, "line", country.name[lang]));

  var compare = document.createElement("div");
  compare.className = "compare";
  var mini = document.createElement("div");
  mini.appendChild(doonfSvg(country.flag, "color", text.compare + ": " + country.name[lang]));
  var colors = document.createElement("ol");
  colors.className = "colors";
  country.colors[lang].forEach(function (name) {
    var item = document.createElement("li");
    item.textContent = name;
    colors.appendChild(item);
  });
  compare.appendChild(mini);
  compare.appendChild(colors);

  var meaning = document.createElement("p");
  meaning.className = "meaning";
  meaning.textContent = country.sentence[lang];

  var button = document.createElement("button");
  button.type = "button";
  button.className = "print";
  button.textContent = text.print;
  button.addEventListener("click", function () {
    window.print();
  });

  sheet.appendChild(heading);
  sheet.appendChild(facts);
  sheet.appendChild(frame);
  sheet.appendChild(compare);
  sheet.appendChild(meaning);
  sheet.appendChild(button);
  wrap.appendChild(pager);
  wrap.appendChild(sheet);
  document.body.appendChild(wrap);
}

var doonfApp = document.getElementById("app");
if (doonfApp) {
  var doonfLang = doonfApp.getAttribute("data-lang");
  var doonfId = doonfApp.getAttribute("data-id");
  doonfApp.remove();
  if (doonfId) doonfSheet(doonfLang, doonfId);
  else doonfHome(doonfLang);
}
