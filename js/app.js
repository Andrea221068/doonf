function doonfText(lang) {
  return DOONF_TEXT[lang];
}

function doonfCodes() {
  return ["it", "en", "es", "fr", "pt", "de"];
}

function doonfPick(map, lang) {
  if (!map) return "";
  if (map[lang]) return map[lang];
  if (map.en) return map.en;
  return map.it || "";
}

function doonfContinentName(country, lang) {
  if (country.continent && country.continent[lang]) return country.continent[lang];
  var found = doonfText(lang).continents.filter(function (item) {
    return item.id === country.continentId;
  })[0];
  return found ? found.name : doonfPick(country.continent, "en");
}

function doonfOrdered(lang) {
  return DOONF_COUNTRIES.slice().sort(function (a, b) {
    return doonfPick(a.name, lang).localeCompare(doonfPick(b.name, lang), lang);
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
  return doonfContinentName(country, lang) + " · " + doonfPick(country.capital, lang) + " · " + doonfPopulation(country, lang);
}

function doonfCountryHref(country, lang, selected) {
  var code = country.slug[lang] ? lang : "en";
  var folder = code === lang ? "" : "../" + code + "/";
  return folder + country.slug[code] + ".html" + (selected ? "?c=" + selected : "");
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

function doonfChrome(lang, hrefFor, homeHref) {
  var bar = document.createElement("header");
  bar.className = "chrome top";
  var brand = document.createElement("a");
  brand.className = "brand";
  brand.href = homeHref || "index.html";
  brand.textContent = "Doonf";
  var langs = document.createElement("nav");
  langs.className = "langs";
  doonfCodes().forEach(function (code) {
    var link = document.createElement("a");
    link.href = hrefFor(code);
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
  document.documentElement.lang = text.htmlLang;
  var bar = doonfChrome(lang, function (code) {
    var base = code === lang ? "index.html" : "../" + code + "/index.html";
    return base + (location.hash || "");
  });
  document.body.appendChild(bar);

  var shelves = document.createElement("nav");
  shelves.className = "chrome filters";
  var intro = document.createElement("p");
  intro.className = "chrome intro";
  var note = document.createElement("p");
  note.className = "chrome note";
  var filters = document.createElement("nav");
  filters.className = "chrome filters";
  var empty = document.createElement("p");
  empty.className = "chrome note";
  empty.textContent = text.empty;
  var list = document.createElement("div");
  document.body.appendChild(shelves);
  document.body.appendChild(intro);
  document.body.appendChild(note);
  document.body.appendChild(filters);
  document.body.appendChild(empty);
  document.body.appendChild(list);

  function hashId() {
    return decodeURIComponent((location.hash || "").replace(/^#/, ""));
  }

  function alphabetMode() {
    return hashId() === "alfabeto";
  }

  function selectedId() {
    var id = hashId();
    if (id === "alfabeto" || id === "bandiere" || id === "all") return "";
    return doonfKnownContinent(lang, id) ? id : "";
  }

  function render() {
    var alphabet = alphabetMode();
    var selected = selectedId();
    var suffix = location.hash || "";
    document.title = alphabet ? text.alphabetTitle : text.homeTitle;
    bar.querySelectorAll(".langs a").forEach(function (link) {
      var code = link.textContent.toLowerCase();
      var base = code === lang ? "index.html" : "../" + code + "/index.html";
      link.href = base + suffix;
    });
    shelves.textContent = "";
    [{ id: "bandiere", name: text.flags, href: "#bandiere" }, { id: "alfabeto", name: text.alphabet, href: "#alfabeto" }].forEach(function (item) {
      var link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.name;
      if ((item.id === "alfabeto" && alphabet) || (item.id === "bandiere" && !alphabet)) {
        link.setAttribute("aria-current", "true");
      }
      shelves.appendChild(link);
    });
    intro.textContent = alphabet ? text.alphabetIntro : text.intro;
    note.textContent = alphabet ? text.alphabetNote : text.note;
    filters.textContent = "";
    list.textContent = "";
    filters.hidden = alphabet;
    if (alphabet) {
      list.className = "chrome letters";
      empty.hidden = true;
      DOONF_ALPHABET[lang].letters.forEach(function (letter) {
        var link = document.createElement("a");
        link.href = "alfabeto.html#" + encodeURIComponent(letter);
        link.textContent = letter;
        list.appendChild(link);
      });
      return;
    }
    list.className = "chrome catalog";
    [{ id: "all", name: text.all }].concat(text.continents).forEach(function (item) {
      var link = document.createElement("a");
      link.href = item.id === "all" ? "#bandiere" : "#" + item.id;
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
      var name = doonfPick(country.name, lang);
      var card = document.createElement("a");
      card.className = "card";
      card.href = doonfCountryHref(country, lang, selected);
      var mini = document.createElement("div");
      mini.className = "mini";
      mini.appendChild(doonfSvg(country.flag, "color", name));
      var title = document.createElement("h2");
      title.textContent = name;
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
  var query = continentId ? "?c=" + continentId : "";
  var home = "index.html" + (continentId ? "#" + continentId : "#bandiere");
  var name = doonfPick(country.name, lang);

  document.title = name + " " + text.sheetTitle;
  document.documentElement.lang = text.htmlLang;
  document.body.appendChild(doonfChrome(lang, function (code) {
    if (country.slug[code]) {
      var folder = code === lang ? "" : "../" + code + "/";
      return folder + country.slug[code] + ".html" + query;
    }
    return "../" + code + "/index.html#bandiere";
  }, home));

  var wrap = document.createElement("main");
  wrap.className = "sheet-wrap";

  var pager = document.createElement("nav");
  pager.className = "chrome pager";
  var prevLink = document.createElement("a");
  prevLink.href = doonfCountryHref(previous, lang, continentId);
  prevLink.textContent = "← " + doonfPick(previous.name, lang);
  var nextLink = document.createElement("a");
  nextLink.href = doonfCountryHref(next, lang, continentId);
  nextLink.textContent = doonfPick(next.name, lang) + " →";
  pager.appendChild(prevLink);
  pager.appendChild(nextLink);

  var sheet = document.createElement("article");
  sheet.className = "sheet";
  var heading = document.createElement("h1");
  heading.textContent = name;
  var facts = document.createElement("p");
  facts.className = "facts";
  facts.textContent = doonfFacts(country, lang);
  var frame = document.createElement("div");
  frame.className = "frame";
  frame.appendChild(doonfSvg(country.flag, "line", name));

  var compare = document.createElement("div");
  compare.className = "compare";
  var mini = document.createElement("div");
  mini.appendChild(doonfSvg(country.flag, "color", text.compare + ": " + name));
  var colors = document.createElement("ol");
  colors.className = "colors";
  (country.colors[lang] || country.colors.en).forEach(function (colorName) {
    var item = document.createElement("li");
    item.textContent = colorName;
    colors.appendChild(item);
  });
  compare.appendChild(mini);
  compare.appendChild(colors);

  var meaning = document.createElement("p");
  meaning.className = "meaning";
  meaning.textContent = doonfPick(country.sentence, lang);

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

function doonfAlphabet(lang) {
  var text = doonfText(lang);
  var pack = DOONF_ALPHABET[lang];
  document.documentElement.lang = text.htmlLang;
  var root = document.createElement("div");
  document.body.appendChild(root);

  function parts() {
    var raw = decodeURIComponent((location.hash || "#A").replace(/^#/, ""));
    var bits = raw.split("/");
    var letter = pack.letters.indexOf(bits[0]) >= 0 ? bits[0] : pack.letters[0];
    var index = bits.length > 1 ? Number(bits[1]) : -1;
    if (!(index >= 0 && index <= 3)) index = -1;
    return { letter: letter, index: index };
  }

  function render() {
    var view = parts();
    var words = pack[view.letter];
    var suffix = "#" + encodeURIComponent(view.letter) + (view.index >= 0 ? "/" + view.index : "");
    root.textContent = "";
    root.appendChild(doonfChrome(lang, function (code) {
      var base = code === lang ? "alfabeto.html" : "../" + code + "/alfabeto.html";
      return base + suffix;
    }, "index.html#alfabeto"));

    if (view.index < 0) {
      document.title = text.letterLabel + " " + view.letter + " — Doonf";
      var intro = document.createElement("p");
      intro.className = "chrome intro";
      intro.textContent = text.letterLabel + " " + view.letter;
      var note = document.createElement("p");
      note.className = "chrome note";
      note.textContent = text.letterChoose;
      var list = document.createElement("div");
      list.className = "chrome catalog";
      var choices = [{ icon: "", word: text.letterAlone }].concat(words.map(function (item) {
        return { icon: item[0], word: item[1] };
      }));
      choices.forEach(function (choice, i) {
        var card = document.createElement("a");
        card.className = "card";
        card.href = "#" + encodeURIComponent(view.letter) + "/" + i;
        var mini = document.createElement("div");
        mini.className = "mini";
        mini.innerHTML = doonfAlphabetSvg(view.letter, choice.icon, choice.word);
        var title = document.createElement("h2");
        title.textContent = choice.word;
        card.appendChild(mini);
        card.appendChild(title);
        list.appendChild(card);
      });
      root.appendChild(intro);
      root.appendChild(note);
      root.appendChild(list);
      return;
    }

    var word = view.index === 0 ? view.letter : words[view.index - 1][1];
    var icon = view.index === 0 ? "" : words[view.index - 1][0];
    document.title = word + " — Doonf";
    var at = pack.letters.indexOf(view.letter);
    var prevLetter = pack.letters[(at + pack.letters.length - 1) % pack.letters.length];
    var nextLetter = pack.letters[(at + 1) % pack.letters.length];
    var outer = document.createElement("div");
    outer.className = "sheet-wrap";
    var wrap = document.createElement("main");
    wrap.className = "sheet plain";
    var pager = document.createElement("nav");
    pager.className = "pager";
    var prevLink = document.createElement("a");
    prevLink.href = "#" + encodeURIComponent(prevLetter) + "/" + view.index;
    prevLink.textContent = "← " + prevLetter;
    var nextLink = document.createElement("a");
    nextLink.href = "#" + encodeURIComponent(nextLetter) + "/" + view.index;
    nextLink.textContent = nextLetter + " →";
    pager.appendChild(prevLink);
    pager.appendChild(nextLink);
    var heading = document.createElement("h1");
    heading.textContent = word;
    var facts = document.createElement("p");
    facts.className = "facts";
    facts.textContent = text.letterLabel + " " + view.letter;
    var frame = document.createElement("div");
    frame.className = "frame";
    frame.innerHTML = doonfAlphabetSvg(view.letter, icon, word);
    var button = document.createElement("button");
    button.type = "button";
    button.className = "print";
    button.textContent = text.print;
    button.addEventListener("click", function () {
      window.print();
    });
    wrap.appendChild(pager);
    wrap.appendChild(heading);
    wrap.appendChild(facts);
    wrap.appendChild(frame);
    wrap.appendChild(button);
    outer.appendChild(wrap);
    root.appendChild(outer);
  }

  window.addEventListener("hashchange", render);
  render();
}

var doonfApp = document.getElementById("app");
if (doonfApp) {
  var doonfLang = doonfApp.getAttribute("data-lang");
  var doonfId = doonfApp.getAttribute("data-id");
  var doonfPage = doonfApp.getAttribute("data-page");
  doonfApp.remove();
  if (doonfId) doonfSheet(doonfLang, doonfId);
  else if (doonfPage === "alphabet") doonfAlphabet(doonfLang);
  else doonfHome(doonfLang);
}
