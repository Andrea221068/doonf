var DOONF_COUNTRIES = [
  {
    id: "italia",
    flag: "italy",
    population: 58926166,
    slug: { it: "italia", en: "italy" },
    name: { it: "Italia", en: "Italy" },
    capital: { it: "Roma", en: "Rome" },
    continentId: "europe",
    continent: { it: "Europa", en: "Europe" },
    colors: {
      it: ["verde", "bianco", "rosso"],
      en: ["green", "white", "red"]
    },
    sentence: {
      it: "Nella lettura più diffusa, il verde è la speranza, il bianco la fede e il rosso la carità.",
      en: "In the most common reading, green is hope, white is faith and red is charity."
    }
  },
  {
    id: "svizzera",
    flag: "switzerland",
    population: 9007798,
    slug: { it: "svizzera", en: "switzerland" },
    name: { it: "Svizzera", en: "Switzerland" },
    capital: { it: "Berna", en: "Bern" },
    continentId: "europe",
    continent: { it: "Europa", en: "Europe" },
    colors: {
      it: ["rosso", "bianco"],
      en: ["red", "white"]
    },
    sentence: {
      it: "La croce bianca in campo rosso è il segno della Confederazione, ed è una delle due bandiere nazionali quadrate: l'altra è quella del Vaticano.",
      en: "The white cross on red is the sign of the Confederation, and it is one of the two square national flags: the other is the Vatican flag."
    }
  },
  {
    id: "nepal",
    flag: "nepal",
    population: 29629410,
    slug: { it: "nepal", en: "nepal" },
    name: { it: "Nepal", en: "Nepal" },
    capital: { it: "Kathmandu", en: "Kathmandu" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: {
      it: ["rosso cremisi", "blu", "bianco"],
      en: ["crimson", "blue", "white"]
    },
    sentence: {
      it: "È l'unica bandiera nazionale che non è un rettangolo: la luna e il sole augurano che il Nepal duri quanto loro.",
      en: "It is the only national flag that is not a rectangle: the moon and the sun wish Nepal to last as long as they do."
    }
  },
  {
    id: "stati-uniti",
    flag: "usa",
    population: 349035494,
    slug: { it: "stati-uniti", en: "united-states" },
    name: { it: "Stati Uniti", en: "United States" },
    capital: { it: "Washington", en: "Washington" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: {
      it: ["rosso", "bianco", "blu"],
      en: ["red", "white", "blue"]
    },
    sentence: {
      it: "Le tredici strisce sono le prime tredici colonie e le cinquanta stelle sono gli Stati di oggi.",
      en: "The thirteen stripes are the first thirteen colonies and the fifty stars are the states of today."
    }
  },
  {
    id: "spagna",
    flag: "spain",
    population: 47850793,
    slug: { it: "spagna", en: "spain" },
    name: { it: "Spagna", en: "Spain" },
    capital: { it: "Madrid", en: "Madrid" },
    continentId: "europe",
    continent: { it: "Europa", en: "Europe" },
    colors: {
      it: ["rosso", "giallo", "oro", "blu", "bianco", "viola", "verde"],
      en: ["red", "yellow", "gold", "blue", "white", "purple", "green"]
    },
    sentence: {
      it: "La banda gialla è alta il doppio di ciascuna banda rossa, e lo stemma riunisce i regni da cui viene la Spagna.",
      en: "The yellow band is twice as tall as each red band, and the coat of arms gathers the kingdoms Spain came from."
    }
  }
];

var DOONF_TEXT = {
  it: {
    htmlLang: "it",
    homeTitle: "Doonf — bandiere da colorare",
    sheetTitle: "da colorare — Doonf",
    intro: "Bandiere da stampare e colorare",
    note: "Scegli un continente. Dentro, i Paesi sono in ordine alfabetico.",
    all: "Tutte",
    empty: "Ancora nessuna scheda.",
    continents: [
      { id: "africa", name: "Africa" },
      { id: "america", name: "America" },
      { id: "asia", name: "Asia" },
      { id: "europe", name: "Europa" },
      { id: "oceania", name: "Oceania" }
    ],
    countries: "Paesi",
    print: "Stampa",
    previous: "Precedente",
    next: "Successiva",
    compare: "Per confrontare",
    about: "circa",
    millionOne: "milione",
    millionMany: "milioni"
  },
  en: {
    htmlLang: "en",
    homeTitle: "Doonf — flags to color",
    sheetTitle: "to color — Doonf",
    intro: "Flags to print and color",
    note: "Choose a continent. Inside it, the countries are alphabetical.",
    all: "All",
    empty: "No sheets yet.",
    continents: [
      { id: "africa", name: "Africa" },
      { id: "america", name: "America" },
      { id: "asia", name: "Asia" },
      { id: "europe", name: "Europe" },
      { id: "oceania", name: "Oceania" }
    ],
    countries: "Countries",
    print: "Print",
    previous: "Previous",
    next: "Next",
    compare: "To compare",
    about: "about",
    millionOne: "million",
    millionMany: "million"
  }
};
