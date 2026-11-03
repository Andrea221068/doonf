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
  var n = country.population;
  if (n >= 1000000) {
    var millions = Math.round(n / 1000000);
    var unit = millions === 1 ? text.millionOne : text.millionMany;
    return text.about + " " + millions + " " + unit + " (2026)";
  }
  if (n >= 1000) {
    return text.about + " " + Math.round(n / 1000) + " " + text.thousand + " (2026)";
  }
  return text.about + " " + Math.round(n / 100) * 100 + " (2026)";
}

function doonfFacts(country, lang) {
  return country.continent[lang] + " · " + country.capital[lang] + " · " + doonfPopulation(country, lang);
}

function doonfSvg(flagId, mode, label) {
  var holder = document.createElement("div");
  holder.innerHTML = doonfFlagSvg(flagId, mode, label);
  return holder.firstChild;
}

function doonfKnownContinent(lang, id) {
  return doonfText(lang).continents.some(function (item) {
    return item.id === id;
  });
}

function doonfChrome(lang, currentHref, otherHref, homeHref) {
  var bar = document.createElement("header");
  bar.className = "chrome top";
  var brand = document.createElement("a");
  brand.className = "brand";
  brand.href = homeHref || "index.html";
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
  var otherBase = lang === "it" ? "../en/index.html" : "../it/index.html";
  var bar = doonfChrome(lang, "index.html", otherBase);
  document.body.appendChild(bar);

  var intro = document.createElement("p");
  intro.className = "chrome intro";
  intro.textContent = text.intro;
  var note = document.createElement("p");
  note.className = "chrome note";
  note.textContent = text.note;
  var filters = document.createElement("nav");
  filters.className = "chrome filters";
  var empty = document.createElement("p");
  empty.className = "chrome note";
  empty.textContent = text.empty;
  var list = document.createElement("div");
  list.className = "chrome catalog";
  document.body.appendChild(intro);
  document.body.appendChild(note);
  document.body.appendChild(filters);
  document.body.appendChild(empty);
  document.body.appendChild(list);

  function selectedId() {
    var id = (location.hash || "").replace(/^#/, "");
    return doonfKnownContinent(lang, id) ? id : "";
  }

  function render() {
    var selected = selectedId();
    var suffix = selected ? "#" + selected : "";
    bar.querySelectorAll(".langs a").forEach(function (link) {
      var code = link.textContent.toLowerCase();
      link.href = (code === lang ? "index.html" : otherBase) + suffix;
    });
    filters.textContent = "";
    list.textContent = "";
    [{ id: "all", name: text.all }].concat(text.continents).forEach(function (item) {
      var link = document.createElement("a");
      link.href = item.id === "all" ? "#all" : "#" + item.id;
      link.textContent = item.name;
      if ((item.id === "all" && !selected) || item.id === selected) {
        link.setAttribute("aria-current", "true");
      }
      filters.appendChild(link);
    });
    var countries = doonfOrdered(lang).filter(function (country) {
      return !selected || country.continentId === selected;
    });
    empty.hidden = countries.length > 0;
    countries.forEach(function (country) {
      var card = document.createElement("a");
      card.className = "card";
      card.href = country.slug[lang] + ".html" + (selected ? "?c=" + selected : "");
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
  }

  window.addEventListener("hashchange", render);
  render();
}

function doonfSheet(lang, id) {
  var text = doonfText(lang);
  var country = DOONF_COUNTRIES.filter(function (item) {
    return item.id === id;
  })[0];
  var continentId = new URLSearchParams(location.search).get("c") || "";
  if (!doonfKnownContinent(lang, continentId)) continentId = "";
  var order = doonfOrdered(lang);
  if (continentId) {
    var narrowed = order.filter(function (item) {
      return item.continentId === continentId;
    });
    if (narrowed.some(function (item) { return item.id === id; })) order = narrowed;
    else continentId = "";
  }
  var index = order.findIndex(function (item) {
    return item.id === id;
  });
  var previous = order[(index + order.length - 1) % order.length];
  var next = order[(index + 1) % order.length];
  var otherLang = lang === "it" ? "en" : "it";
  var query = continentId ? "?c=" + continentId : "";
  var home = "index.html" + (continentId ? "#" + continentId : "");

  document.title = country.name[lang] + " " + text.sheetTitle;
  document.documentElement.lang = text.htmlLang;
  document.body.appendChild(doonfChrome(
    lang,
    country.slug[lang] + ".html" + query,
    "../" + otherLang + "/" + country.slug[otherLang] + ".html" + query,
    home
  ));

  var wrap = document.createElement("main");
  wrap.className = "sheet-wrap";

  var pager = document.createElement("nav");
  pager.className = "chrome pager";
  var prevLink = document.createElement("a");
  prevLink.href = previous.slug[lang] + ".html" + query;
  prevLink.textContent = "← " + previous.name[lang];
  var nextLink = document.createElement("a");
  nextLink.href = next.slug[lang] + ".html" + query;
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
