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
  },
  {
    id: "albania", flag: "albania", population: 2751025,
    slug: { it: "albania", en: "albania" },
    name: { it: "Albania", en: "Albania" },
    capital: { it: "Tirana", en: "Tirana" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "nero"], en: ["red", "black"] },
    sentence: {
      it: "L'aquila nera a due teste è il segno di Skanderbeg, sul rosso del suo stendardo.",
      en: "The black double-headed eagle is the sign of Skanderbeg, on the red of his banner."
    }
  },
  {
    id: "andorra", flag: "andorra", population: 83753,
    slug: { it: "andorra", en: "andorra" },
    name: { it: "Andorra", en: "Andorra" },
    capital: { it: "Andorra la Vella", en: "Andorra la Vella" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "giallo", "rosso", "oro"], en: ["blue", "yellow", "red", "gold"] },
    sentence: {
      it: "Lo stemma mette insieme il vescovo di Urgell e il conte di Foix, i due principi di Andorra.",
      en: "The coat of arms brings together the Bishop of Urgell and the Count of Foix, the two princes of Andorra."
    }
  },
  {
    id: "austria", flag: "austria", population: 9107266,
    slug: { it: "austria", en: "austria" },
    name: { it: "Austria", en: "Austria" },
    capital: { it: "Vienna", en: "Vienna" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "bianco"], en: ["red", "white"] },
    sentence: {
      it: "La leggenda dice che il bianco è la fascia rimasta pulita sulla tunica del duca in battaglia.",
      en: "The legend says the white is the band that stayed clean on the duke's tunic in battle."
    }
  },
  {
    id: "bielorussia", flag: "belarus", population: 8937018,
    slug: { it: "bielorussia", en: "belarus" },
    name: { it: "Bielorussia", en: "Belarus" },
    capital: { it: "Minsk", en: "Minsk" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "verde", "bianco"], en: ["red", "green", "white"] },
    sentence: {
      it: "La striscia verde è un terzo, il rosso due terzi, e l'ornamento è un ricamo popolare.",
      en: "The green stripe is one third, the red is two thirds, and the ornament is a folk embroidery."
    }
  },
  {
    id: "belgio", flag: "belgium", population: 11774642,
    slug: { it: "belgio", en: "belgium" },
    name: { it: "Belgio", en: "Belgium" },
    capital: { it: "Bruxelles", en: "Brussels" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["nero", "giallo", "rosso"], en: ["black", "yellow", "red"] },
    sentence: {
      it: "Nero, giallo e rosso sono i colori del Brabante, scelti nella rivoluzione del 1830.",
      en: "Black, yellow and red are the colours of Brabant, chosen in the revolution of 1830."
    }
  },
  {
    id: "bosnia", flag: "bosnia", population: 3114242,
    slug: { it: "bosnia-ed-erzegovina", en: "bosnia-and-herzegovina" },
    name: { it: "Bosnia ed Erzegovina", en: "Bosnia and Herzegovina" },
    capital: { it: "Sarajevo", en: "Sarajevo" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "giallo", "bianco"], en: ["blue", "yellow", "white"] },
    sentence: {
      it: "Il triangolo giallo ricorda la forma del Paese e le stelle sono quelle dell'Europa.",
      en: "The yellow triangle recalls the shape of the country, and the stars are those of Europe."
    }
  },
  {
    id: "bulgaria", flag: "bulgaria", population: 6667659,
    slug: { it: "bulgaria", en: "bulgaria" },
    name: { it: "Bulgaria", en: "Bulgaria" },
    capital: { it: "Sofia", en: "Sofia" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["bianco", "verde", "rosso"], en: ["white", "green", "red"] },
    sentence: {
      it: "Il bianco è la pace, il verde la terra e il rosso il coraggio.",
      en: "White is peace, green is the land and red is courage."
    }
  },
  {
    id: "croazia", flag: "croatia", population: 3822345,
    slug: { it: "croazia", en: "croatia" },
    name: { it: "Croazia", en: "Croatia" },
    capital: { it: "Zagabria", en: "Zagreb" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "bianco", "blu", "oro"], en: ["red", "white", "blue", "gold"] },
    sentence: {
      it: "Lo scudo a scacchi rossi e bianchi è lo stemma della Croazia, con le cinque terre sopra.",
      en: "The red and white checkerboard is Croatia's coat of arms, with the five lands above it."
    }
  },
  {
    id: "cipro", flag: "cyprus", population: 1382334,
    slug: { it: "cipro", en: "cyprus" },
    name: { it: "Cipro", en: "Cyprus" },
    capital: { it: "Nicosia", en: "Nicosia" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["bianco", "rame", "verde"], en: ["white", "copper", "green"] },
    sentence: {
      it: "L'isola è color rame, il metallo che dà il nome a Cipro, e i rami di ulivo sono la pace.",
      en: "The island is copper-coloured, the metal Cyprus is named for, and the olive branches are peace."
    }
  },
  {
    id: "cechia", flag: "czechia", population: 10527781,
    slug: { it: "cechia", en: "czechia" },
    name: { it: "Cechia", en: "Czechia" },
    capital: { it: "Praga", en: "Prague" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["bianco", "rosso", "blu"], en: ["white", "red", "blue"] },
    sentence: {
      it: "Il bianco e il rosso sono la Boemia, e il triangolo blu è la Moravia.",
      en: "White and red are Bohemia, and the blue triangle is Moravia."
    }
  },
  {
    id: "danimarca", flag: "denmark", population: 6023520,
    slug: { it: "danimarca", en: "denmark" },
    name: { it: "Danimarca", en: "Denmark" },
    capital: { it: "Copenaghen", en: "Copenhagen" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "bianco"], en: ["red", "white"] },
    sentence: {
      it: "La Dannebrog è una croce bianca in campo rosso, e la storia la fa scendere dal cielo nel 1219.",
      en: "The Dannebrog is a white cross on red, and the story has it coming down from the sky in 1219."
    }
  },
  {
    id: "estonia", flag: "estonia", population: 1331062,
    slug: { it: "estonia", en: "estonia" },
    name: { it: "Estonia", en: "Estonia" },
    capital: { it: "Tallinn", en: "Tallinn" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "nero", "bianco"], en: ["blue", "black", "white"] },
    sentence: {
      it: "Il blu è il cielo, il nero la terra e il bianco la neve.",
      en: "Blue is the sky, black is the land and white is the snow."
    }
  },
  {
    id: "finlandia", flag: "finland", population: 5621739,
    slug: { it: "finlandia", en: "finland" },
    name: { it: "Finlandia", en: "Finland" },
    capital: { it: "Helsinki", en: "Helsinki" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["bianco", "blu"], en: ["white", "blue"] },
    sentence: {
      it: "La croce blu sono i laghi, e il bianco è la neve.",
      en: "The blue cross is the lakes, and the white is the snow."
    }
  },
  {
    id: "francia", flag: "france", population: 66746401,
    slug: { it: "francia", en: "france" },
    name: { it: "Francia", en: "France" },
    capital: { it: "Parigi", en: "Paris" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "bianco", "rosso"], en: ["blue", "white", "red"] },
    sentence: {
      it: "Dal 1794 il blu e il rosso di Parigi stanno ai lati del bianco del re.",
      en: "Since 1794 the blue and red of Paris stand on either side of the king's white."
    }
  },
  {
    id: "germania", flag: "germany", population: 83644258,
    slug: { it: "germania", en: "germany" },
    name: { it: "Germania", en: "Germany" },
    capital: { it: "Berlino", en: "Berlin" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["nero", "rosso", "oro"], en: ["black", "red", "gold"] },
    sentence: {
      it: "Nero, rosso e oro sono i colori del 1848, e oggi quelli della Repubblica.",
      en: "Black, red and gold are the colours of 1848, and today those of the Republic."
    }
  },
  {
    id: "grecia", flag: "greece", population: 9897115,
    slug: { it: "grecia", en: "greece" },
    name: { it: "Grecia", en: "Greece" },
    capital: { it: "Atene", en: "Athens" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "bianco"], en: ["blue", "white"] },
    sentence: {
      it: "Le nove strisce sono le nove sillabe del motto «Libertà o morte», e la croce è la fede.",
      en: "The nine stripes are the nine syllables of the motto “Freedom or death”, and the cross is the faith."
    }
  },
  {
    id: "ungheria", flag: "hungary", population: 9585818,
    slug: { it: "ungheria", en: "hungary" },
    name: { it: "Ungheria", en: "Hungary" },
    capital: { it: "Budapest", en: "Budapest" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "bianco", "verde"], en: ["red", "white", "green"] },
    sentence: {
      it: "Rosso, bianco e verde sono i colori antichi dell'Ungheria: la forza, la fedeltà e la speranza.",
      en: "Red, white and green are the old colours of Hungary: strength, loyalty and hope."
    }
  },
  {
    id: "islanda", flag: "iceland", population: 402329,
    slug: { it: "islanda", en: "iceland" },
    name: { it: "Islanda", en: "Iceland" },
    capital: { it: "Reykjavík", en: "Reykjavík" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "bianco", "rosso"], en: ["blue", "white", "red"] },
    sentence: {
      it: "Il rosso è il fuoco dei vulcani, il bianco il ghiaccio e il blu il mare.",
      en: "Red is the fire of the volcanoes, white is the ice and blue is the sea."
    }
  },
  {
    id: "irlanda", flag: "ireland", population: 5356950,
    slug: { it: "irlanda", en: "ireland" },
    name: { it: "Irlanda", en: "Ireland" },
    capital: { it: "Dublino", en: "Dublin" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["verde", "bianco", "arancione"], en: ["green", "white", "orange"] },
    sentence: {
      it: "Il verde e l'arancione sono le due tradizioni, e il bianco in mezzo è la pace.",
      en: "Green and orange are the two traditions, and the white between them is peace."
    }
  },
  {
    id: "kosovo", flag: "kosovo", population: 1666992,
    slug: { it: "kosovo", en: "kosovo" },
    name: { it: "Kosovo", en: "Kosovo" },
    capital: { it: "Pristina", en: "Pristina" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "oro", "bianco"], en: ["blue", "gold", "white"] },
    sentence: {
      it: "Le sei stelle bianche sono le comunità del Kosovo, sopra la sagoma del Paese.",
      en: "The six white stars are the communities of Kosovo, above the shape of the country."
    }
  },
  {
    id: "lettonia", flag: "latvia", population: 1835935,
    slug: { it: "lettonia", en: "latvia" },
    name: { it: "Lettonia", en: "Latvia" },
    capital: { it: "Riga", en: "Riga" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "bianco"], en: ["red", "white"] },
    sentence: {
      it: "Il rosso è un carminio scuro, e la striscia bianca è un quinto dell'altezza.",
      en: "The red is a dark carmine, and the white stripe is one fifth of the height."
    }
  },
  {
    id: "liechtenstein", flag: "liechtenstein", population: 40368,
    slug: { it: "liechtenstein", en: "liechtenstein" },
    name: { it: "Liechtenstein", en: "Liechtenstein" },
    capital: { it: "Vaduz", en: "Vaduz" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "rosso", "oro"], en: ["blue", "red", "gold"] },
    sentence: {
      it: "Blu e rosso sono i colori del principe, e la corona dice che è un principato.",
      en: "Blue and red are the prince's colours, and the crown says it is a principality."
    }
  },
  {
    id: "lituania", flag: "lithuania", population: 2797338,
    slug: { it: "lituania", en: "lithuania" },
    name: { it: "Lituania", en: "Lithuania" },
    capital: { it: "Vilnius", en: "Vilnius" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["giallo", "verde", "rosso"], en: ["yellow", "green", "red"] },
    sentence: {
      it: "Il giallo è il sole e i campi, il verde le foreste e il rosso il coraggio.",
      en: "Yellow is the sun and the fields, green is the forests and red is courage."
    }
  },
  {
    id: "lussemburgo", flag: "luxembourg", population: 687448,
    slug: { it: "lussemburgo", en: "luxembourg" },
    name: { it: "Lussemburgo", en: "Luxembourg" },
    capital: { it: "Lussemburgo", en: "Luxembourg" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "bianco", "blu"], en: ["red", "white", "blue"] },
    sentence: {
      it: "I colori vengono dallo stemma del granduca, e il blu chiaro la distingue dai Paesi Bassi.",
      en: "The colours come from the grand duke's coat of arms, and the light blue sets it apart from the Netherlands."
    }
  },
  {
    id: "malta", flag: "malta", population: 549011,
    slug: { it: "malta", en: "malta" },
    name: { it: "Malta", en: "Malta" },
    capital: { it: "La Valletta", en: "Valletta" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["bianco", "rosso", "argento", "nero"], en: ["white", "red", "silver", "black"] },
    sentence: {
      it: "Bianco e rosso vengono dallo stemma normanno, e la croce fu data da re Giorgio VI nel 1942.",
      en: "White and red come from the Norman coat of arms, and the cross was given by King George VI in 1942."
    }
  },
  {
    id: "moldavia", flag: "moldova", population: 2961253,
    slug: { it: "moldavia", en: "moldova" },
    name: { it: "Moldavia", en: "Moldova" },
    capital: { it: "Chisinau", en: "Chisinau" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "giallo", "rosso", "oro", "nero", "verde"], en: ["blue", "yellow", "red", "gold", "black", "green"] },
    sentence: {
      it: "I colori sono quelli della Romania, e l'uro sullo scudo è il segno della Moldavia.",
      en: "The colours are those of Romania, and the aurochs on the shield is the sign of Moldova."
    }
  },
  {
    id: "monaco", flag: "monaco", population: 38087,
    slug: { it: "monaco", en: "monaco" },
    name: { it: "Monaco", en: "Monaco" },
    capital: { it: "Monaco", en: "Monaco" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "bianco"], en: ["red", "white"] },
    sentence: {
      it: "Rosso e bianco sono i colori dei Grimaldi, e la bandiera è quasi quadrata.",
      en: "Red and white are the colours of the Grimaldi, and the flag is nearly square."
    }
  },
  {
    id: "montenegro", flag: "montenegro", population: 626233,
    slug: { it: "montenegro", en: "montenegro" },
    name: { it: "Montenegro", en: "Montenegro" },
    capital: { it: "Podgorica", en: "Podgorica" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "oro", "blu"], en: ["red", "gold", "blue"] },
    sentence: {
      it: "Il bordo d'oro e il leone sono lo stemma del principe, in campo rosso.",
      en: "The gold border and the lion are the prince's coat of arms, on a red field."
    }
  },
  {
    id: "paesi-bassi", flag: "netherlands", population: 18448775,
    slug: { it: "paesi-bassi", en: "netherlands" },
    name: { it: "Paesi Bassi", en: "Netherlands" },
    capital: { it: "Amsterdam", en: "Amsterdam" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "bianco", "blu"], en: ["red", "white", "blue"] },
    sentence: {
      it: "Il rosso ha preso il posto dell'arancione del principe, e bianco e blu sono rimasti.",
      en: "Red took the place of the prince's orange, and white and blue stayed."
    }
  },
  {
    id: "macedonia-del-nord", flag: "northMacedonia", population: 1804063,
    slug: { it: "macedonia-del-nord", en: "north-macedonia" },
    name: { it: "Macedonia del Nord", en: "North Macedonia" },
    capital: { it: "Skopje", en: "Skopje" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "giallo"], en: ["red", "yellow"] },
    sentence: {
      it: "Il sole ha otto raggi che si allargano, e il rosso è il colore della rivolta.",
      en: "The sun has eight rays that widen, and red is the colour of the uprising."
    }
  },
  {
    id: "norvegia", flag: "norway", population: 5652989,
    slug: { it: "norvegia", en: "norway" },
    name: { it: "Norvegia", en: "Norway" },
    capital: { it: "Oslo", en: "Oslo" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "bianco", "blu"], en: ["red", "white", "blue"] },
    sentence: {
      it: "La croce unisce il rosso della Danimarca e il blu della Svezia, i due Paesi da cui la Norvegia uscì.",
      en: "The cross joins the red of Denmark and the blue of Sweden, the two countries Norway left."
    }
  },
  {
    id: "polonia", flag: "poland", population: 37843188,
    slug: { it: "polonia", en: "poland" },
    name: { it: "Polonia", en: "Poland" },
    capital: { it: "Varsavia", en: "Warsaw" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["bianco", "rosso"], en: ["white", "red"] },
    sentence: {
      it: "Il bianco e il rosso vengono dall'aquila bianca in campo rosso.",
      en: "White and red come from the white eagle on a red field."
    }
  },
  {
    id: "portogallo", flag: "portugal", population: 10395362,
    slug: { it: "portogallo", en: "portugal" },
    name: { it: "Portogallo", en: "Portugal" },
    capital: { it: "Lisbona", en: "Lisbon" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["verde", "rosso", "giallo", "bianco", "blu"], en: ["green", "red", "yellow", "white", "blue"] },
    sentence: {
      it: "Il verde e il rosso sono i colori della repubblica del 1910, e la sfera ricorda le scoperte.",
      en: "Green and red are the colours of the 1910 republic, and the sphere recalls the discoveries."
    }
  },
  {
    id: "romania", flag: "romania", population: 18800605,
    slug: { it: "romania", en: "romania" },
    name: { it: "Romania", en: "Romania" },
    capital: { it: "Bucarest", en: "Bucharest" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "giallo", "rosso"], en: ["blue", "yellow", "red"] },
    sentence: {
      it: "Blu, giallo e rosso sono i colori della Moldavia e della Valacchia, unite nel 1859.",
      en: "Blue, yellow and red are the colours of Moldavia and Wallachia, united in 1859."
    }
  },
  {
    id: "russia", flag: "russia", population: 143394458,
    slug: { it: "russia", en: "russia" },
    name: { it: "Russia", en: "Russia" },
    capital: { it: "Mosca", en: "Moscow" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["bianco", "blu", "rosso"], en: ["white", "blue", "red"] },
    sentence: {
      it: "Bianco, blu e rosso sono i colori che Pietro il Grande diede alle navi, e poi al Paese.",
      en: "White, blue and red are the colours Peter the Great gave to the ships, and then to the country."
    }
  },
  {
    id: "san-marino", flag: "sanMarino", population: 33605,
    slug: { it: "san-marino", en: "san-marino" },
    name: { it: "San Marino", en: "San Marino" },
    capital: { it: "Città di San Marino", en: "City of San Marino" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["bianco", "azzurro", "verde", "oro"], en: ["white", "azure", "green", "gold"] },
    sentence: {
      it: "Le tre torri sono le rocche del monte Titano, e i colori sono il bianco e l'azzurro.",
      en: "The three towers are the fortresses of Mount Titano, and the colours are white and azure."
    }
  },
  {
    id: "serbia", flag: "serbia", population: 6641964,
    slug: { it: "serbia", en: "serbia" },
    name: { it: "Serbia", en: "Serbia" },
    capital: { it: "Belgrado", en: "Belgrade" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["rosso", "blu", "bianco", "oro", "argento"], en: ["red", "blue", "white", "gold", "silver"] },
    sentence: {
      it: "L'aquila a due teste e la croce con i quattro acciarini sono lo stemma, sui colori panslavi.",
      en: "The double-headed eagle and the cross with four firesteels are the coat of arms, on the Pan-Slavic colours."
    }
  },
  {
    id: "slovacchia", flag: "slovakia", population: 5451342,
    slug: { it: "slovacchia", en: "slovakia" },
    name: { it: "Slovacchia", en: "Slovakia" },
    capital: { it: "Bratislava", en: "Bratislava" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["bianco", "blu", "rosso"], en: ["white", "blue", "red"] },
    sentence: {
      it: "La doppia croce sulle tre colline è lo stemma antico, sul bianco, il blu e il rosso.",
      en: "The double cross on three hills is the old coat of arms, on white, blue and red."
    }
  },
  {
    id: "slovenia", flag: "slovenia", population: 2114573,
    slug: { it: "slovenia", en: "slovenia" },
    name: { it: "Slovenia", en: "Slovenia" },
    capital: { it: "Lubiana", en: "Ljubljana" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["bianco", "blu", "rosso", "oro"], en: ["white", "blue", "red", "gold"] },
    sentence: {
      it: "Il monte disegnato è il Triglav, con tre stelle e le onde del mare.",
      en: "The mountain drawn on it is Triglav, with three stars and the waves of the sea."
    }
  },
  {
    id: "svezia", flag: "sweden", population: 10701047,
    slug: { it: "svezia", en: "sweden" },
    name: { it: "Svezia", en: "Sweden" },
    capital: { it: "Stoccolma", en: "Stockholm" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "giallo"], en: ["blue", "yellow"] },
    sentence: {
      it: "La croce gialla in campo blu viene dallo stemma reale.",
      en: "The yellow cross on blue comes from the royal coat of arms."
    }
  },
  {
    id: "ucraina", flag: "ukraine", population: 39535849,
    slug: { it: "ucraina", en: "ukraine" },
    name: { it: "Ucraina", en: "Ukraine" },
    capital: { it: "Kiev", en: "Kyiv" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "giallo"], en: ["blue", "yellow"] },
    sentence: {
      it: "Il blu è il cielo e il giallo è il grano.",
      en: "Blue is the sky and yellow is the wheat."
    }
  },
  {
    id: "regno-unito", flag: "unitedKingdom", population: 69931528,
    slug: { it: "regno-unito", en: "united-kingdom" },
    name: { it: "Regno Unito", en: "United Kingdom" },
    capital: { it: "Londra", en: "London" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["blu", "bianco", "rosso"], en: ["blue", "white", "red"] },
    sentence: {
      it: "Riunisce la croce di san Giorgio, quella di sant'Andrea e quella di san Patrizio.",
      en: "It brings together the cross of Saint George, that of Saint Andrew and that of Saint Patrick."
    }
  },
  {
    id: "vaticano", flag: "vatican", population: 506,
    slug: { it: "citta-del-vaticano", en: "vatican-city" },
    name: { it: "Città del Vaticano", en: "Vatican City" },
    capital: { it: "Città del Vaticano", en: "Vatican City" },
    continentId: "europe", continent: { it: "Europa", en: "Europe" },
    colors: { it: ["giallo", "bianco", "oro", "argento", "rosso"], en: ["yellow", "white", "gold", "silver", "red"] },
    sentence: {
      it: "Giallo e bianco sono i colori del papa, e le chiavi sono quelle di san Pietro.",
      en: "Yellow and white are the pope's colours, and the keys are Saint Peter's."
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
    millionMany: "milioni",
    thousand: "mila"
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
    millionMany: "million",
    thousand: "thousand"
  }
};
