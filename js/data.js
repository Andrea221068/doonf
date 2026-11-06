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
,
  {
    id: "algeria",
    flag: "algeria",
    population: 48028334,
    slug: { it: "algeria", en: "algeria" },
    name: { it: "Algeria", en: "Algeria" },
    capital: { it: "Algeri", en: "Algiers" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "bianco", "rosso"], en: ["green", "white", "red"] },
    sentence: { it: "Il verde e il bianco dividono il campo, e la mezzaluna con la stella sono rosse.", en: "Green and white split the field, and the crescent and star are red." }
  },
  {
    id: "angola",
    flag: "angola",
    population: 40215179,
    slug: { it: "angola", en: "angola" },
    name: { it: "Angola", en: "Angola" },
    capital: { it: "Luanda", en: "Luanda" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "nero", "giallo"], en: ["red", "black", "yellow"] },
    sentence: { it: "La stella, il mezzo ingranaggio e il machete stanno tra il rosso e il nero.", en: "The star, the half gear and the machete sit between the red and the black." }
  },
  {
    id: "benin",
    flag: "benin",
    population: 15170419,
    slug: { it: "benin", en: "benin" },
    name: { it: "Benin", en: "Benin" },
    capital: { it: "Porto-Novo", en: "Porto-Novo" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "giallo", "rosso"], en: ["green", "yellow", "red"] },
    sentence: { it: "Il verde sta al pennone e, dall'altra parte, il giallo sta sopra il rosso.", en: "Green is at the hoist and, on the other side, yellow is above red." }
  },
  {
    id: "botswana",
    flag: "botswana",
    population: 2603388,
    slug: { it: "botswana", en: "botswana" },
    name: { it: "Botswana", en: "Botswana" },
    capital: { it: "Gaborone", en: "Gaborone" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["azzurro", "bianco", "nero"], en: ["blue", "white", "black"] },
    sentence: { it: "La striscia nera, bordata di bianco, attraversa il campo azzurro.", en: "The black stripe, edged in white, crosses the blue field." }
  },
  {
    id: "burkina-faso",
    flag: "burkinaFaso",
    population: 24601700,
    slug: { it: "burkina-faso", en: "burkina-faso" },
    name: { it: "Burkina Faso", en: "Burkina Faso" },
    capital: { it: "Ouagadougou", en: "Ouagadougou" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "verde", "giallo"], en: ["red", "green", "yellow"] },
    sentence: { it: "La stella gialla sta al centro, tra il rosso e il verde.", en: "The yellow star is in the centre, between the red and the green." }
  },
  {
    id: "burundi",
    flag: "burundi",
    population: 14729157,
    slug: { it: "burundi", en: "burundi" },
    name: { it: "Burundi", en: "Burundi" },
    capital: { it: "Gitega", en: "Gitega" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "verde", "bianco"], en: ["red", "green", "white"] },
    sentence: { it: "Le tre stelle rosse stanno nel disco bianco, tra il rosso e il verde.", en: "The three red stars sit in the white disc, between the red and the green." }
  },
  {
    id: "capo-verde",
    flag: "caboVerde",
    population: 529630,
    slug: { it: "capo-verde", en: "cabo-verde" },
    name: { it: "Capo Verde", en: "Cabo Verde" },
    capital: { it: "Praia", en: "Praia" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["blu", "bianco", "rosso", "giallo"], en: ["blue", "white", "red", "yellow"] },
    sentence: { it: "Le dieci stelle gialle, una per isola, stanno in cerchio sulla banda.", en: "The ten yellow stars, one for each island, stand in a circle on the stripe." }
  },
  {
    id: "camerun",
    flag: "cameroon",
    population: 30640817,
    slug: { it: "camerun", en: "cameroon" },
    name: { it: "Camerun", en: "Cameroon" },
    capital: { it: "Yaoundé", en: "Yaoundé" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "rosso", "giallo"], en: ["green", "red", "yellow"] },
    sentence: { it: "La stella gialla sta nella banda rossa, tra il verde e il giallo.", en: "The yellow star is on the red band, between the green and the yellow." }
  },
  {
    id: "repubblica-centrafricana",
    flag: "centralAfricanRepublic",
    population: 5698984,
    slug: { it: "repubblica-centrafricana", en: "central-african-republic" },
    name: { it: "Repubblica Centrafricana", en: "Central African Republic" },
    capital: { it: "Bangui", en: "Bangui" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["blu", "bianco", "verde", "giallo", "rosso"], en: ["blue", "white", "green", "yellow", "red"] },
    sentence: { it: "La banda rossa verticale attraversa le quattro strisce, e la stella gialla sta in alto a sinistra.", en: "The vertical red band crosses the four stripes, and the yellow star is at the upper left." }
  },
  {
    id: "ciad",
    flag: "chad",
    population: 21560380,
    slug: { it: "ciad", en: "chad" },
    name: { it: "Ciad", en: "Chad" },
    capital: { it: "N'Djamena", en: "N'Djamena" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["blu", "giallo", "rosso"], en: ["blue", "yellow", "red"] },
    sentence: { it: "Le tre bande verticali sono blu, gialla e rossa.", en: "The three vertical bands are blue, yellow and red." }
  },
  {
    id: "comore",
    flag: "comoros",
    population: 899010,
    slug: { it: "comore", en: "comoros" },
    name: { it: "Comore", en: "Comoros" },
    capital: { it: "Moroni", en: "Moroni" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["giallo", "bianco", "rosso", "blu", "verde"], en: ["yellow", "white", "red", "blue", "green"] },
    sentence: { it: "Le quattro strisce e le quattro stelle sono le quattro isole.", en: "The four stripes and the four stars are the four islands." }
  },
  {
    id: "congo",
    flag: "congo",
    population: 6637785,
    slug: { it: "congo", en: "congo" },
    name: { it: "Congo", en: "Congo" },
    capital: { it: "Brazzaville", en: "Brazzaville" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "giallo", "rosso"], en: ["green", "yellow", "red"] },
    sentence: { it: "Il giallo taglia in diagonale il verde e il rosso.", en: "Yellow cuts diagonally across the green and the red." }
  },
  {
    id: "rd-congo",
    flag: "drCongo",
    population: 116452162,
    slug: { it: "rd-congo", en: "dr-congo" },
    name: { it: "RD Congo", en: "DR Congo" },
    capital: { it: "Kinshasa", en: "Kinshasa" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["azzurro", "giallo", "rosso"], en: ["blue", "yellow", "red"] },
    sentence: { it: "La banda rossa, bordata di giallo, attraversa il campo azzurro, con la stella in alto a sinistra.", en: "The red band, edged in yellow, crosses the blue field, with the star at the upper left." }
  },
  {
    id: "costa-davorio",
    flag: "coteDivoire",
    population: 33494346,
    slug: { it: "costa-davorio", en: "cote-divoire" },
    name: { it: "Costa d'Avorio", en: "Côte d'Ivoire" },
    capital: { it: "Yamoussoukro", en: "Yamoussoukro" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["arancione", "bianco", "verde"], en: ["orange", "white", "green"] },
    sentence: { it: "L'arancione sta al pennone, poi vengono il bianco e il verde.", en: "Orange is at the hoist, then come white and green." }
  },
  {
    id: "gibuti",
    flag: "djibouti",
    population: 1199459,
    slug: { it: "gibuti", en: "djibouti" },
    name: { it: "Gibuti", en: "Djibouti" },
    capital: { it: "Gibuti", en: "Djibouti" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["azzurro", "verde", "bianco", "rosso"], en: ["blue", "green", "white", "red"] },
    sentence: { it: "Il triangolo bianco sta al pennone, con la stella rossa, tra l'azzurro e il verde.", en: "The white triangle is at the hoist, with the red star, between the blue and the green." }
  },
  {
    id: "egitto",
    flag: "egypt",
    population: 120101175,
    slug: { it: "egitto", en: "egypt" },
    name: { it: "Egitto", en: "Egypt" },
    capital: { it: "Il Cairo", en: "Cairo" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "bianco", "nero", "oro"], en: ["red", "white", "black", "gold"] },
    sentence: { it: "L'aquila di Saladino è d'oro sulla banda bianca, tra il rosso e il nero.", en: "The Eagle of Saladin is gold on the white band, between the red and the black." }
  },
  {
    id: "guinea-equatoriale",
    flag: "equatorialGuinea",
    population: 1984468,
    slug: { it: "guinea-equatoriale", en: "equatorial-guinea" },
    name: { it: "Guinea Equatoriale", en: "Equatorial Guinea" },
    capital: { it: "Malabo", en: "Malabo" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "bianco", "rosso", "blu", "giallo"], en: ["green", "white", "red", "blue", "yellow"] },
    sentence: { it: "Il triangolo blu sta al pennone e lo stemma sta sulla banda bianca.", en: "The blue triangle is at the hoist and the coat of arms is on the white band." }
  },
  {
    id: "eritrea",
    flag: "eritrea",
    population: 3682669,
    slug: { it: "eritrea", en: "eritrea" },
    name: { it: "Eritrea", en: "Eritrea" },
    capital: { it: "Asmara", en: "Asmara" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "verde", "azzurro", "giallo"], en: ["red", "green", "blue", "yellow"] },
    sentence: { it: "Il triangolo rosso sta al pennone e il ramo d'ulivo sta tra il verde e l'azzurro.", en: "The red triangle is at the hoist and the olive branch sits between the green and the blue." }
  },
  {
    id: "eswatini",
    flag: "eswatini",
    population: 1269859,
    slug: { it: "eswatini", en: "eswatini" },
    name: { it: "Eswatini", en: "Eswatini" },
    capital: { it: "Mbabane e Lobamba", en: "Mbabane and Lobamba" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["blu", "giallo", "rosso", "bianco", "nero"], en: ["blue", "yellow", "red", "white", "black"] },
    sentence: { it: "Lo scudo e le lance stanno al centro, sulla banda rossa bordata di giallo.", en: "The shield and the spears are in the centre, on the red band edged in yellow." }
  },
  {
    id: "etiopia",
    flag: "ethiopia",
    population: 138902185,
    slug: { it: "etiopia", en: "ethiopia" },
    name: { it: "Etiopia", en: "Ethiopia" },
    capital: { it: "Addis Abeba", en: "Addis Ababa" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "giallo", "rosso", "blu"], en: ["green", "yellow", "red", "blue"] },
    sentence: { it: "La stella gialla sta nel disco blu, al centro del verde, del giallo e del rosso.", en: "The yellow star is in the blue disc, at the centre of the green, the yellow and the red." }
  },
  {
    id: "gabon",
    flag: "gabon",
    population: 2647399,
    slug: { it: "gabon", en: "gabon" },
    name: { it: "Gabon", en: "Gabon" },
    capital: { it: "Libreville", en: "Libreville" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "giallo", "azzurro"], en: ["green", "yellow", "blue"] },
    sentence: { it: "Il verde, il giallo e l'azzurro sono tre bande uguali.", en: "Green, yellow and blue are three equal bands." }
  },
  {
    id: "gambia",
    flag: "gambia",
    population: 2884079,
    slug: { it: "gambia", en: "gambia" },
    name: { it: "Gambia", en: "Gambia" },
    capital: { it: "Banjul", en: "Banjul" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "bianco", "blu", "verde"], en: ["red", "white", "blue", "green"] },
    sentence: { it: "Il blu sta in mezzo, separato dal rosso e dal verde da due strisce bianche.", en: "Blue is in the middle, separated from the red and the green by two white stripes." }
  },
  {
    id: "ghana",
    flag: "ghana",
    population: 35697557,
    slug: { it: "ghana", en: "ghana" },
    name: { it: "Ghana", en: "Ghana" },
    capital: { it: "Accra", en: "Accra" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "giallo", "verde", "nero"], en: ["red", "yellow", "green", "black"] },
    sentence: { it: "La stella nera sta al centro della banda gialla.", en: "The black star is in the centre of the yellow band." }
  },
  {
    id: "guinea",
    flag: "guinea",
    population: 15441993,
    slug: { it: "guinea", en: "guinea" },
    name: { it: "Guinea", en: "Guinea" },
    capital: { it: "Conakry", en: "Conakry" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "giallo", "verde"], en: ["red", "yellow", "green"] },
    sentence: { it: "Il rosso sta al pennone, poi vengono il giallo e il verde.", en: "Red is at the hoist, then come yellow and green." }
  },
  {
    id: "guinea-bissau",
    flag: "guineaBissau",
    population: 2297808,
    slug: { it: "guinea-bissau", en: "guinea-bissau" },
    name: { it: "Guinea-Bissau", en: "Guinea-Bissau" },
    capital: { it: "Bissau", en: "Bissau" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "giallo", "verde", "nero"], en: ["red", "yellow", "green", "black"] },
    sentence: { it: "La stella nera sta nella banda rossa del pennone.", en: "The black star is on the red band at the hoist." }
  },
  {
    id: "kenya",
    flag: "kenya",
    population: 58636412,
    slug: { it: "kenya", en: "kenya" },
    name: { it: "Kenya", en: "Kenya" },
    capital: { it: "Nairobi", en: "Nairobi" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["nero", "bianco", "rosso", "verde"], en: ["black", "white", "red", "green"] },
    sentence: { it: "Lo scudo e le due lance stanno al centro, sul nero, sul rosso e sul verde.", en: "The shield and the two spears are in the centre, on the black, the red and the green." }
  },
  {
    id: "lesotho",
    flag: "lesotho",
    population: 2389336,
    slug: { it: "lesotho", en: "lesotho" },
    name: { it: "Lesotho", en: "Lesotho" },
    capital: { it: "Maseru", en: "Maseru" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["blu", "bianco", "verde", "nero"], en: ["blue", "white", "green", "black"] },
    sentence: { it: "Il mokorotlo, il cappello di paglia, è nero sulla banda bianca.", en: "The mokorotlo, the straw hat, is black on the white band." }
  },
  {
    id: "liberia",
    flag: "liberia",
    population: 5853949,
    slug: { it: "liberia", en: "liberia" },
    name: { it: "Liberia", en: "Liberia" },
    capital: { it: "Monrovia", en: "Monrovia" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "bianco", "blu"], en: ["red", "white", "blue"] },
    sentence: { it: "Le undici strisce partono dal rosso, e la stella bianca sta nel cantone blu.", en: "The eleven stripes begin with red, and the white star is in the blue canton." }
  },
  {
    id: "libia",
    flag: "libya",
    population: 7539851,
    slug: { it: "libia", en: "libya" },
    name: { it: "Libia", en: "Libya" },
    capital: { it: "Tripoli", en: "Tripoli" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "nero", "verde", "bianco"], en: ["red", "black", "green", "white"] },
    sentence: { it: "La mezzaluna e la stella bianche stanno sulla banda nera.", en: "The white crescent and star are on the black band." }
  },
  {
    id: "madagascar",
    flag: "madagascar",
    population: 33522052,
    slug: { it: "madagascar", en: "madagascar" },
    name: { it: "Madagascar", en: "Madagascar" },
    capital: { it: "Antananarivo", en: "Antananarivo" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["bianco", "rosso", "verde"], en: ["white", "red", "green"] },
    sentence: { it: "Il bianco sta al pennone e, dall'altra parte, il rosso sta sopra il verde.", en: "White is at the hoist and, on the other side, red is above green." }
  },
  {
    id: "malawi",
    flag: "malawi",
    population: 22785535,
    slug: { it: "malawi", en: "malawi" },
    name: { it: "Malawi", en: "Malawi" },
    capital: { it: "Lilongwe", en: "Lilongwe" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["nero", "rosso", "verde"], en: ["black", "red", "green"] },
    sentence: { it: "Il sole che sorge, rosso, sta al centro della banda nera.", en: "The rising sun, in red, is in the centre of the black band." }
  },
  {
    id: "mali",
    flag: "mali",
    population: 25932275,
    slug: { it: "mali", en: "mali" },
    name: { it: "Mali", en: "Mali" },
    capital: { it: "Bamako", en: "Bamako" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "giallo", "rosso"], en: ["green", "yellow", "red"] },
    sentence: { it: "Il verde sta al pennone, poi vengono il giallo e il rosso.", en: "Green is at the hoist, then come yellow and red." }
  },
  {
    id: "mauritania",
    flag: "mauritania",
    population: 5461319,
    slug: { it: "mauritania", en: "mauritania" },
    name: { it: "Mauritania", en: "Mauritania" },
    capital: { it: "Nouakchott", en: "Nouakchott" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "verde", "giallo"], en: ["red", "green", "yellow"] },
    sentence: { it: "Due bande rosse chiudono il campo verde, con la mezzaluna e la stella gialle.", en: "Two red bands close the green field, with the yellow crescent and star." }
  },
  {
    id: "mauritius",
    flag: "mauritius",
    population: 1265059,
    slug: { it: "mauritius", en: "mauritius" },
    name: { it: "Mauritius", en: "Mauritius" },
    capital: { it: "Port Louis", en: "Port Louis" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "blu", "giallo", "verde"], en: ["red", "blue", "yellow", "green"] },
    sentence: { it: "Quattro bande uguali: rosso, blu, giallo e verde.", en: "Four equal bands: red, blue, yellow and green." }
  },
  {
    id: "marocco",
    flag: "morocco",
    population: 38762441,
    slug: { it: "marocco", en: "morocco" },
    name: { it: "Marocco", en: "Morocco" },
    capital: { it: "Rabat", en: "Rabat" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "verde"], en: ["red", "green"] },
    sentence: { it: "La stella verde a cinque punte sta al centro del campo rosso.", en: "The green five-pointed star is in the centre of the red field." }
  },
  {
    id: "mozambico",
    flag: "mozambique",
    population: 36639851,
    slug: { it: "mozambico", en: "mozambique" },
    name: { it: "Mozambico", en: "Mozambique" },
    capital: { it: "Maputo", en: "Maputo" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "giallo", "nero", "bianco", "rosso"], en: ["green", "yellow", "black", "white", "red"] },
    sentence: { it: "Nel triangolo rosso ci sono la stella, il libro, la zappa e il fucile.", en: "In the red triangle are the star, the book, the hoe and the rifle." }
  },
  {
    id: "namibia",
    flag: "namibia",
    population: 3153246,
    slug: { it: "namibia", en: "namibia" },
    name: { it: "Namibia", en: "Namibia" },
    capital: { it: "Windhoek", en: "Windhoek" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["blu", "rosso", "verde", "bianco", "giallo"], en: ["blue", "red", "green", "white", "yellow"] },
    sentence: { it: "Il sole sta in alto a sinistra e la banda rossa, bordata di bianco, taglia il campo.", en: "The sun is at the upper left and the red band, edged in white, cuts across the field." }
  },
  {
    id: "niger",
    flag: "niger",
    population: 28814878,
    slug: { it: "niger", en: "niger" },
    name: { it: "Niger", en: "Niger" },
    capital: { it: "Niamey", en: "Niamey" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["arancione", "bianco", "verde"], en: ["orange", "white", "green"] },
    sentence: { it: "Il disco arancione sta al centro della banda bianca.", en: "The orange disc is in the centre of the white band." }
  },
  {
    id: "nigeria",
    flag: "nigeria",
    population: 242431832,
    slug: { it: "nigeria", en: "nigeria" },
    name: { it: "Nigeria", en: "Nigeria" },
    capital: { it: "Abuja", en: "Abuja" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "bianco"], en: ["green", "white"] },
    sentence: { it: "Il bianco sta in mezzo a due bande verdi uguali.", en: "White sits between two equal green bands." }
  },
  {
    id: "ruanda",
    flag: "rwanda",
    population: 14889693,
    slug: { it: "ruanda", en: "rwanda" },
    name: { it: "Ruanda", en: "Rwanda" },
    capital: { it: "Kigali", en: "Kigali" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["blu", "giallo", "verde"], en: ["blue", "yellow", "green"] },
    sentence: { it: "Il sole giallo sta in alto a destra, sul campo blu.", en: "The yellow sun is at the upper right, on the blue field." }
  },
  {
    id: "sao-tome",
    flag: "saoTome",
    population: 244994,
    slug: { it: "sao-tome-e-principe", en: "sao-tome-and-principe" },
    name: { it: "São Tomé e Príncipe", en: "São Tomé and Príncipe" },
    capital: { it: "São Tomé", en: "São Tomé" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "giallo", "rosso", "nero"], en: ["green", "yellow", "red", "black"] },
    sentence: { it: "Le due stelle nere stanno sulla banda gialla, e il triangolo rosso sta al pennone.", en: "The two black stars are on the yellow band, and the red triangle is at the hoist." }
  },
  {
    id: "senegal",
    flag: "senegal",
    population: 19366548,
    slug: { it: "senegal", en: "senegal" },
    name: { it: "Senegal", en: "Senegal" },
    capital: { it: "Dakar", en: "Dakar" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "giallo", "rosso"], en: ["green", "yellow", "red"] },
    sentence: { it: "La stella verde sta al centro della banda gialla.", en: "The green star is in the centre of the yellow band." }
  },
  {
    id: "seychelles",
    flag: "seychelles",
    population: 134959,
    slug: { it: "seychelles", en: "seychelles" },
    name: { it: "Seychelles", en: "Seychelles" },
    capital: { it: "Victoria", en: "Victoria" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["blu", "giallo", "rosso", "bianco", "verde"], en: ["blue", "yellow", "red", "white", "green"] },
    sentence: { it: "Le cinque bande partono dal pennone: blu, giallo, rosso, bianco e verde.", en: "The five bands start from the hoist: blue, yellow, red, white and green." }
  },
  {
    id: "sierra-leone",
    flag: "sierraLeone",
    population: 8996745,
    slug: { it: "sierra-leone", en: "sierra-leone" },
    name: { it: "Sierra Leone", en: "Sierra Leone" },
    capital: { it: "Freetown", en: "Freetown" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "bianco", "azzurro"], en: ["green", "white", "blue"] },
    sentence: { it: "Il verde, il bianco e l'azzurro sono tre bande uguali.", en: "Green, white and blue are three equal bands." }
  },
  {
    id: "somalia",
    flag: "somalia",
    population: 20305907,
    slug: { it: "somalia", en: "somalia" },
    name: { it: "Somalia", en: "Somalia" },
    capital: { it: "Mogadiscio", en: "Mogadishu" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["azzurro", "bianco"], en: ["blue", "white"] },
    sentence: { it: "La stella bianca a cinque punte sta al centro del campo azzurro.", en: "The white five-pointed star is in the centre of the blue field." }
  },
  {
    id: "sudafrica",
    flag: "southAfrica",
    population: 65453084,
    slug: { it: "sudafrica", en: "south-africa" },
    name: { it: "Sudafrica", en: "South Africa" },
    capital: { it: "Pretoria, Città del Capo e Bloemfontein", en: "Pretoria, Cape Town and Bloemfontein" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "blu", "verde", "bianco", "oro", "nero"], en: ["red", "blue", "green", "white", "gold", "black"] },
    sentence: { it: "La Y verde, bordata di bianco e d'oro, parte dal triangolo nero.", en: "The green Y, edged in white and gold, starts from the black triangle." }
  },
  {
    id: "sudan-del-sud",
    flag: "southSudan",
    population: 12436037,
    slug: { it: "sudan-del-sud", en: "south-sudan" },
    name: { it: "Sudan del Sud", en: "South Sudan" },
    capital: { it: "Giuba", en: "Juba" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["nero", "rosso", "verde", "bianco", "azzurro", "giallo"], en: ["black", "red", "green", "white", "blue", "yellow"] },
    sentence: { it: "La stella gialla sta nel triangolo blu, al pennone.", en: "The yellow star is in the blue triangle, at the hoist." }
  },
  {
    id: "sudan",
    flag: "sudan",
    population: 53282719,
    slug: { it: "sudan", en: "sudan" },
    name: { it: "Sudan", en: "Sudan" },
    capital: { it: "Khartum", en: "Khartoum" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "bianco", "nero", "verde"], en: ["red", "white", "black", "green"] },
    sentence: { it: "Il triangolo verde sta al pennone, davanti al rosso, al bianco e al nero.", en: "The green triangle is at the hoist, in front of the red, the white and the black." }
  },
  {
    id: "tanzania",
    flag: "tanzania",
    population: 72563780,
    slug: { it: "tanzania", en: "tanzania" },
    name: { it: "Tanzania", en: "Tanzania" },
    capital: { it: "Dodoma", en: "Dodoma" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "giallo", "nero", "azzurro"], en: ["green", "yellow", "black", "blue"] },
    sentence: { it: "La banda nera, bordata di giallo, separa il verde dall'azzurro.", en: "The black band, edged in yellow, separates the green from the blue." }
  },
  {
    id: "togo",
    flag: "togo",
    population: 9930918,
    slug: { it: "togo", en: "togo" },
    name: { it: "Togo", en: "Togo" },
    capital: { it: "Lomé", en: "Lomé" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "giallo", "rosso", "bianco"], en: ["green", "yellow", "red", "white"] },
    sentence: { it: "La stella bianca sta nel quadrato rosso, in alto a sinistra.", en: "The white star is in the red square, at the upper left." }
  },
  {
    id: "tunisia",
    flag: "tunisia",
    population: 12415138,
    slug: { it: "tunisia", en: "tunisia" },
    name: { it: "Tunisia", en: "Tunisia" },
    capital: { it: "Tunisi", en: "Tunis" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["rosso", "bianco"], en: ["red", "white"] },
    sentence: { it: "La mezzaluna e la stella rosse stanno nel disco bianco.", en: "The red crescent and star are in the white disc." }
  },
  {
    id: "uganda",
    flag: "uganda",
    population: 52761469,
    slug: { it: "uganda", en: "uganda" },
    name: { it: "Uganda", en: "Uganda" },
    capital: { it: "Kampala", en: "Kampala" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["nero", "giallo", "rosso", "bianco"], en: ["black", "yellow", "red", "white"] },
    sentence: { it: "La gru coronata sta nel disco bianco, al centro.", en: "The crowned crane is in the white disc, at the centre." }
  },
  {
    id: "zambia",
    flag: "zambia",
    population: 22521915,
    slug: { it: "zambia", en: "zambia" },
    name: { it: "Zambia", en: "Zambia" },
    capital: { it: "Lusaka", en: "Lusaka" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "rosso", "nero", "arancione"], en: ["green", "red", "black", "orange"] },
    sentence: { it: "L'aquila arancione sta sopra le tre bande verticali, in basso a destra.", en: "The orange eagle stands above the three vertical bands, at the lower right." }
  },
  {
    id: "zimbabwe",
    flag: "zimbabwe",
    population: 17273580,
    slug: { it: "zimbabwe", en: "zimbabwe" },
    name: { it: "Zimbabwe", en: "Zimbabwe" },
    capital: { it: "Harare", en: "Harare" },
    continentId: "africa",
    continent: { it: "Africa", en: "Africa" },
    colors: { it: ["verde", "giallo", "rosso", "nero", "bianco"], en: ["green", "yellow", "red", "black", "white"] },
    sentence: { it: "L'uccello dello Zimbabwe sta nella stella rossa, sul triangolo bianco.", en: "The Zimbabwe bird is in the red star, on the white triangle." }
  }
,
  {
    id: "antigua",
    flag: "antigua",
    population: 94626,
    slug: { it: "antigua-e-barbuda", en: "antigua-and-barbuda" },
    name: { it: "Antigua e Barbuda", en: "Antigua and Barbuda" },
    capital: { it: "Saint John's", en: "Saint John's" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["rosso", "nero", "azzurro", "bianco", "giallo"], en: ["red", "black", "blue", "white", "yellow"] },
    sentence: { it: "Il sole giallo sorge sul nero, nel triangolo fra il rosso.", en: "The yellow sun rises on the black, in the triangle between the red." }
  },
  {
    id: "argentina",
    flag: "argentina",
    population: 46003734,
    slug: { it: "argentina", en: "argentina" },
    name: { it: "Argentina", en: "Argentina" },
    capital: { it: "Buenos Aires", en: "Buenos Aires" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["celeste", "bianco", "giallo", "marrone"], en: ["light blue", "white", "yellow", "brown"] },
    sentence: { it: "Il Sole di Maggio sta al centro della banda bianca.", en: "The Sun of May is in the centre of the white band." }
  },
  {
    id: "bahamas",
    flag: "bahamas",
    population: 404628,
    slug: { it: "bahamas", en: "bahamas" },
    name: { it: "Bahamas", en: "Bahamas" },
    capital: { it: "Nassau", en: "Nassau" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["acquamarina", "giallo", "nero"], en: ["aquamarine", "yellow", "black"] },
    sentence: { it: "Il triangolo nero sta al pennone, fra l'acquamarina e il giallo.", en: "The black triangle is at the hoist, between the aquamarine and the yellow." }
  },
  {
    id: "barbados",
    flag: "barbados",
    population: 282724,
    slug: { it: "barbados", en: "barbados" },
    name: { it: "Barbados", en: "Barbados" },
    capital: { it: "Bridgetown", en: "Bridgetown" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["blu", "giallo", "nero"], en: ["blue", "yellow", "black"] },
    sentence: { it: "Il tridente nero, con la punta spezzata, sta sulla banda gialla.", en: "The black trident, with its head broken, is on the yellow band." }
  },
  {
    id: "belize",
    flag: "belize",
    population: 428644,
    slug: { it: "belize", en: "belize" },
    name: { it: "Belize", en: "Belize" },
    capital: { it: "Belmopan", en: "Belmopan" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["blu", "rosso", "bianco", "verde"], en: ["blue", "red", "white", "green"] },
    sentence: { it: "Le strisce rosse stanno in alto e in basso, e lo stemma sta nel blu.", en: "The red stripes are at the top and the bottom, and the coat of arms is on the blue." }
  },
  {
    id: "bolivia",
    flag: "bolivia",
    population: 12749291,
    slug: { it: "bolivia", en: "bolivia" },
    name: { it: "Bolivia", en: "Bolivia" },
    capital: { it: "Sucre e La Paz", en: "Sucre and La Paz" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["rosso", "giallo", "verde"], en: ["red", "yellow", "green"] },
    sentence: { it: "Il rosso, il giallo e il verde sono tre bande, e lo stemma sta al centro.", en: "Red, yellow and green are three bands, and the coat of arms is in the centre." }
  },
  {
    id: "brasile",
    flag: "brazil",
    population: 213562666,
    slug: { it: "brasile", en: "brazil" },
    name: { it: "Brasile", en: "Brazil" },
    capital: { it: "Brasilia", en: "Brasília" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["verde", "giallo", "blu", "bianco"], en: ["green", "yellow", "blue", "white"] },
    sentence: { it: "Il diamante giallo sta sul verde, e sulla fascia c'è scritto «Ordem e Progresso».", en: "The yellow diamond is on the green, and the band reads “Ordem e Progresso”." }
  },
  {
    id: "canada",
    flag: "canada",
    population: 40467728,
    slug: { it: "canada", en: "canada" },
    name: { it: "Canada", en: "Canada" },
    capital: { it: "Ottawa", en: "Ottawa" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["rosso", "bianco"], en: ["red", "white"] },
    sentence: { it: "La foglia d'acero rossa sta al centro, fra due bande rosse.", en: "The red maple leaf is in the centre, between two red bands." }
  },
  {
    id: "cile",
    flag: "chile",
    population: 19945850,
    slug: { it: "cile", en: "chile" },
    name: { it: "Cile", en: "Chile" },
    capital: { it: "Santiago", en: "Santiago" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["blu", "bianco", "rosso"], en: ["blue", "white", "red"] },
    sentence: { it: "La stella bianca sta nel quadrato blu, sopra il rosso.", en: "The white star is in the blue square, above the red." }
  },
  {
    id: "colombia",
    flag: "colombia",
    population: 53936226,
    slug: { it: "colombia", en: "colombia" },
    name: { it: "Colombia", en: "Colombia" },
    capital: { it: "Bogotá", en: "Bogotá" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["giallo", "blu", "rosso"], en: ["yellow", "blue", "red"] },
    sentence: { it: "Il giallo è la metà di sopra, il blu e il rosso si dividono il resto.", en: "Yellow is the top half, and blue and red share the rest." }
  },
  {
    id: "costa-rica",
    flag: "costaRica",
    population: 5174789,
    slug: { it: "costa-rica", en: "costa-rica" },
    name: { it: "Costa Rica", en: "Costa Rica" },
    capital: { it: "San José", en: "San José" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["blu", "bianco", "rosso"], en: ["blue", "white", "red"] },
    sentence: { it: "La banda rossa è alta il doppio, e lo stemma sta al centro.", en: "The red band is twice as tall, and the coat of arms is in the centre." }
  },
  {
    id: "cuba",
    flag: "cuba",
    population: 10892659,
    slug: { it: "cuba", en: "cuba" },
    name: { it: "Cuba", en: "Cuba" },
    capital: { it: "L'Avana", en: "Havana" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["blu", "bianco", "rosso"], en: ["blue", "white", "red"] },
    sentence: { it: "La stella bianca sta nel triangolo rosso, al pennone.", en: "The white star is in the red triangle, at the hoist." }
  },
  {
    id: "dominica",
    flag: "dominica",
    population: 65511,
    slug: { it: "dominica", en: "dominica" },
    name: { it: "Dominica", en: "Dominica" },
    capital: { it: "Roseau", en: "Roseau" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["verde", "giallo", "nero", "bianco", "rosso"], en: ["green", "yellow", "black", "white", "red"] },
    sentence: { it: "Il pappagallo sisserou sta nel disco rosso, al centro della croce.", en: "The sisserou parrot is in the red disc, at the centre of the cross." }
  },
  {
    id: "repubblica-dominicana",
    flag: "dominicanRepublic",
    population: 11609500,
    slug: { it: "repubblica-dominicana", en: "dominican-republic" },
    name: { it: "Repubblica Dominicana", en: "Dominican Republic" },
    capital: { it: "Santo Domingo", en: "Santo Domingo" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["blu", "rosso", "bianco"], en: ["blue", "red", "white"] },
    sentence: { it: "La croce bianca divide il blu e il rosso, e lo stemma sta al centro.", en: "The white cross divides the blue and the red, and the coat of arms is in the centre." }
  },
  {
    id: "ecuador",
    flag: "ecuador",
    population: 18444506,
    slug: { it: "ecuador", en: "ecuador" },
    name: { it: "Ecuador", en: "Ecuador" },
    capital: { it: "Quito", en: "Quito" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["giallo", "blu", "rosso"], en: ["yellow", "blue", "red"] },
    sentence: { it: "Il giallo è la metà di sopra, e il condor sta sullo stemma.", en: "Yellow is the top half, and the condor stands on the coat of arms." }
  },
  {
    id: "el-salvador",
    flag: "elSalvador",
    population: 6391253,
    slug: { it: "el-salvador", en: "el-salvador" },
    name: { it: "El Salvador", en: "El Salvador" },
    capital: { it: "San Salvador", en: "San Salvador" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["blu", "bianco"], en: ["blue", "white"] },
    sentence: { it: "Le due bande blu incorniciano il bianco, e lo stemma sta al centro.", en: "The two blue bands frame the white, and the coat of arms is in the centre." }
  },
  {
    id: "grenada",
    flag: "grenada",
    population: 117362,
    slug: { it: "grenada", en: "grenada" },
    name: { it: "Grenada", en: "Grenada" },
    capital: { it: "Saint George's", en: "Saint George's" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["rosso", "verde", "giallo"], en: ["red", "green", "yellow"] },
    sentence: { it: "La noce moscata sta nel disco rosso, e le stelle sono sette.", en: "The nutmeg is in the red disc, and there are seven stars." }
  },
  {
    id: "guatemala",
    flag: "guatemala",
    population: 18967978,
    slug: { it: "guatemala", en: "guatemala" },
    name: { it: "Guatemala", en: "Guatemala" },
    capital: { it: "Città del Guatemala", en: "Guatemala City" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["azzurro", "bianco"], en: ["blue", "white"] },
    sentence: { it: "Le due bande azzurre stanno ai lati, e lo stemma sta nel bianco.", en: "The two blue bands are at the sides, and the coat of arms is on the white." }
  },
  {
    id: "guyana",
    flag: "guyana",
    population: 840890,
    slug: { it: "guyana", en: "guyana" },
    name: { it: "Guyana", en: "Guyana" },
    capital: { it: "Georgetown", en: "Georgetown" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["verde", "giallo", "bianco", "rosso", "nero"], en: ["green", "yellow", "white", "red", "black"] },
    sentence: { it: "La punta rossa, bordata di nero, sta dentro la punta gialla.", en: "The red arrowhead, edged in black, sits inside the yellow arrowhead." }
  },
  {
    id: "haiti",
    flag: "haiti",
    population: 12037506,
    slug: { it: "haiti", en: "haiti" },
    name: { it: "Haiti", en: "Haiti" },
    capital: { it: "Port-au-Prince", en: "Port-au-Prince" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["blu", "rosso", "bianco"], en: ["blue", "red", "white"] },
    sentence: { it: "Il blu e il rosso sono due bande, e lo stemma sta nel rettangolo bianco.", en: "Blue and red are two bands, and the coat of arms is in the white rectangle." }
  },
  {
    id: "honduras",
    flag: "honduras",
    population: 11184760,
    slug: { it: "honduras", en: "honduras" },
    name: { it: "Honduras", en: "Honduras" },
    capital: { it: "Tegucigalpa", en: "Tegucigalpa" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["blu", "bianco"], en: ["blue", "white"] },
    sentence: { it: "Le cinque stelle blu stanno sulla banda bianca.", en: "The five blue stars are on the white band." }
  },
  {
    id: "giamaica",
    flag: "jamaica",
    population: 2833403,
    slug: { it: "giamaica", en: "jamaica" },
    name: { it: "Giamaica", en: "Jamaica" },
    capital: { it: "Kingston", en: "Kingston" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["verde", "nero", "giallo"], en: ["green", "black", "yellow"] },
    sentence: { it: "La croce gialla divide il verde ai lati e il nero in alto e in basso.", en: "The yellow saltire divides the green at the sides and the black at the top and the bottom." }
  },
  {
    id: "messico",
    flag: "mexico",
    population: 132997658,
    slug: { it: "messico", en: "mexico" },
    name: { it: "Messico", en: "Mexico" },
    capital: { it: "Città del Messico", en: "Mexico City" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["verde", "bianco", "rosso"], en: ["green", "white", "red"] },
    sentence: { it: "L'aquila sul cactus sta nella banda bianca.", en: "The eagle on the cactus is on the white band." }
  },
  {
    id: "nicaragua",
    flag: "nicaragua",
    population: 7097329,
    slug: { it: "nicaragua", en: "nicaragua" },
    name: { it: "Nicaragua", en: "Nicaragua" },
    capital: { it: "Managua", en: "Managua" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["blu", "bianco"], en: ["blue", "white"] },
    sentence: { it: "Il triangolo e l'arcobaleno stanno al centro della banda bianca.", en: "The triangle and the rainbow are in the centre of the white band." }
  },
  {
    id: "panama",
    flag: "panama",
    population: 4625718,
    slug: { it: "panama", en: "panama" },
    name: { it: "Panama", en: "Panama" },
    capital: { it: "Città di Panama", en: "Panama City" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["bianco", "rosso", "blu"], en: ["white", "red", "blue"] },
    sentence: { it: "Una stella blu e una stella rossa stanno nei due quarti bianchi.", en: "A blue star and a red star are in the two white quarters." }
  },
  {
    id: "paraguay",
    flag: "paraguay",
    population: 7095279,
    slug: { it: "paraguay", en: "paraguay" },
    name: { it: "Paraguay", en: "Paraguay" },
    capital: { it: "Asunción", en: "Asunción" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["rosso", "bianco", "blu", "giallo", "verde"], en: ["red", "white", "blue", "yellow", "green"] },
    sentence: { it: "La stella gialla sta nello stemma, sulla banda bianca.", en: "The yellow star is in the emblem, on the white band." }
  },
  {
    id: "peru",
    flag: "peru",
    population: 34922148,
    slug: { it: "peru", en: "peru" },
    name: { it: "Perù", en: "Peru" },
    capital: { it: "Lima", en: "Lima" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["rosso", "bianco"], en: ["red", "white"] },
    sentence: { it: "Il bianco sta in mezzo a due bande rosse uguali.", en: "White sits between two equal red bands." }
  },
  {
    id: "saint-kitts",
    flag: "saintKitts",
    population: 46992,
    slug: { it: "saint-kitts-e-nevis", en: "saint-kitts-and-nevis" },
    name: { it: "Saint Kitts e Nevis", en: "Saint Kitts and Nevis" },
    capital: { it: "Basseterre", en: "Basseterre" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["verde", "rosso", "giallo", "nero", "bianco"], en: ["green", "red", "yellow", "black", "white"] },
    sentence: { it: "Le due stelle bianche stanno sulla banda nera, fra il verde e il rosso.", en: "The two white stars are on the black band, between the green and the red." }
  },
  {
    id: "saint-lucia",
    flag: "saintLucia",
    population: 180488,
    slug: { it: "saint-lucia", en: "saint-lucia" },
    name: { it: "Saint Lucia", en: "Saint Lucia" },
    capital: { it: "Castries", en: "Castries" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["azzurro", "bianco", "nero", "giallo"], en: ["blue", "white", "black", "yellow"] },
    sentence: { it: "Il triangolo giallo e quello nero stanno sul campo azzurro.", en: "The yellow triangle and the black one are on the blue field." }
  },
  {
    id: "saint-vincent",
    flag: "saintVincent",
    population: 99245,
    slug: { it: "saint-vincent-e-grenadine", en: "saint-vincent-and-the-grenadines" },
    name: { it: "Saint Vincent e Grenadine", en: "Saint Vincent and the Grenadines" },
    capital: { it: "Kingstown", en: "Kingstown" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["blu", "giallo", "verde"], en: ["blue", "yellow", "green"] },
    sentence: { it: "I tre diamanti verdi stanno sulla banda gialla.", en: "The three green diamonds are on the yellow band." }
  },
  {
    id: "suriname",
    flag: "suriname",
    population: 645256,
    slug: { it: "suriname", en: "suriname" },
    name: { it: "Suriname", en: "Suriname" },
    capital: { it: "Paramaribo", en: "Paramaribo" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["verde", "bianco", "rosso", "giallo"], en: ["green", "white", "red", "yellow"] },
    sentence: { it: "La stella gialla sta sulla banda rossa.", en: "The yellow star is on the red band." }
  },
  {
    id: "trinidad",
    flag: "trinidad",
    population: 1513268,
    slug: { it: "trinidad-e-tobago", en: "trinidad-and-tobago" },
    name: { it: "Trinidad e Tobago", en: "Trinidad and Tobago" },
    capital: { it: "Port of Spain", en: "Port of Spain" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["rosso", "bianco", "nero"], en: ["red", "white", "black"] },
    sentence: { it: "La banda nera, bordata di bianco, taglia il rosso da un angolo all'altro.", en: "The black band, edged in white, cuts across the red from corner to corner." }
  },
  {
    id: "uruguay",
    flag: "uruguay",
    population: 3382537,
    slug: { it: "uruguay", en: "uruguay" },
    name: { it: "Uruguay", en: "Uruguay" },
    capital: { it: "Montevideo", en: "Montevideo" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["bianco", "azzurro", "giallo"], en: ["white", "blue", "yellow"] },
    sentence: { it: "Il Sole di Maggio sta nel quadrato bianco, in alto a sinistra.", en: "The Sun of May is in the white square, at the upper left." }
  },
  {
    id: "venezuela",
    flag: "venezuela",
    population: 28633711,
    slug: { it: "venezuela", en: "venezuela" },
    name: { it: "Venezuela", en: "Venezuela" },
    capital: { it: "Caracas", en: "Caracas" },
    continentId: "america",
    continent: { it: "America", en: "America" },
    colors: { it: ["giallo", "blu", "rosso", "bianco"], en: ["yellow", "blue", "red", "white"] },
    sentence: { it: "Le otto stelle bianche formano un arco sulla banda blu.", en: "The eight white stars form an arc on the blue band." }
  }
,
  {
    id: "afghanistan",
    flag: "afghanistan",
    population: 45047069,
    slug: { it: "afghanistan", en: "afghanistan" },
    name: { it: "Afghanistan", en: "Afghanistan" },
    capital: { it: "Kabul", en: "Kabul" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["bianco", "nero"], en: ["white", "black"] },
    sentence: { it: "La bandiera è bianca, con la scritta nera della shahada.", en: "The flag is white, with the black writing of the shahada." }
  },
  {
    id: "arabia-saudita",
    flag: "saudiArabia",
    population: 35165787,
    slug: { it: "arabia-saudita", en: "saudi-arabia" },
    name: { it: "Arabia Saudita", en: "Saudi Arabia" },
    capital: { it: "Riad", en: "Riyadh" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["verde", "bianco"], en: ["green", "white"] },
    sentence: { it: "La scritta bianca sta sopra la spada.", en: "The white writing is above the sword." }
  },
  {
    id: "armenia",
    flag: "armenia",
    population: 2930915,
    slug: { it: "armenia", en: "armenia" },
    name: { it: "Armenia", en: "Armenia" },
    capital: { it: "Erevan", en: "Yerevan" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "blu", "arancione"], en: ["red", "blue", "orange"] },
    sentence: { it: "Il rosso sta sopra, il blu in mezzo e l'arancione sotto.", en: "Red is on top, blue in the middle and orange below." }
  },
  {
    id: "azerbaigian",
    flag: "azerbaijan",
    population: 10454855,
    slug: { it: "azerbaigian", en: "azerbaijan" },
    name: { it: "Azerbaigian", en: "Azerbaijan" },
    capital: { it: "Baku", en: "Baku" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["azzurro", "rosso", "verde", "bianco"], en: ["blue", "red", "green", "white"] },
    sentence: { it: "La mezzaluna e la stella bianche stanno sulla banda rossa.", en: "The white crescent and star are on the red band." }
  },
  {
    id: "bahrein",
    flag: "bahrain",
    population: 1675572,
    slug: { it: "bahrein", en: "bahrain" },
    name: { it: "Bahrein", en: "Bahrain" },
    capital: { it: "Manama", en: "Manama" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["bianco", "rosso"], en: ["white", "red"] },
    sentence: { it: "Il bordo tra il bianco e il rosso è seghettato.", en: "The edge between the white and the red is serrated." }
  },
  {
    id: "bangladesh",
    flag: "bangladesh",
    population: 177818044,
    slug: { it: "bangladesh", en: "bangladesh" },
    name: { it: "Bangladesh", en: "Bangladesh" },
    capital: { it: "Dacca", en: "Dhaka" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["verde", "rosso"], en: ["green", "red"] },
    sentence: { it: "Il disco rosso sta un po' verso il pennone.", en: "The red disc sits a little toward the hoist." }
  },
  {
    id: "bhutan",
    flag: "bhutan",
    population: 802214,
    slug: { it: "bhutan", en: "bhutan" },
    name: { it: "Bhutan", en: "Bhutan" },
    capital: { it: "Thimphu", en: "Thimphu" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["giallo", "arancione", "bianco", "nero"], en: ["yellow", "orange", "white", "black"] },
    sentence: { it: "Il drago bianco sta tra il giallo e l'arancione.", en: "The white dragon stands between the yellow and the orange." }
  },
  {
    id: "brunei",
    flag: "brunei",
    population: 469775,
    slug: { it: "brunei", en: "brunei" },
    name: { it: "Brunei", en: "Brunei" },
    capital: { it: "Bandar Seri Begawan", en: "Bandar Seri Begawan" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["giallo", "bianco", "nero", "rosso"], en: ["yellow", "white", "black", "red"] },
    sentence: { it: "Le strisce bianca e nera tagliano il giallo, e lo stemma sta al centro.", en: "The white and black stripes cut across the yellow, and the crest is in the centre." }
  },
  {
    id: "cambogia",
    flag: "cambodia",
    population: 18051219,
    slug: { it: "cambogia", en: "cambodia" },
    name: { it: "Cambogia", en: "Cambodia" },
    capital: { it: "Phnom Penh", en: "Phnom Penh" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["blu", "rosso", "bianco"], en: ["blue", "red", "white"] },
    sentence: { it: "Il tempio di Angkor sta sulla banda rossa.", en: "The temple of Angkor is on the red band." }
  },
  {
    id: "cina",
    flag: "china",
    population: 1412914089,
    slug: { it: "cina", en: "china" },
    name: { it: "Cina", en: "China" },
    capital: { it: "Pechino", en: "Beijing" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "giallo"], en: ["red", "yellow"] },
    sentence: { it: "La stella grande e le quattro piccole stanno in alto a sinistra.", en: "The large star and the four small ones are at the upper left." }
  },
  {
    id: "corea-del-nord",
    flag: "northKorea",
    population: 26633691,
    slug: { it: "corea-del-nord", en: "north-korea" },
    name: { it: "Corea del Nord", en: "North Korea" },
    capital: { it: "Pyongyang", en: "Pyongyang" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["blu", "bianco", "rosso"], en: ["blue", "white", "red"] },
    sentence: { it: "La stella rossa sta nel disco bianco.", en: "The red star is in the white disc." }
  },
  {
    id: "corea-del-sud",
    flag: "southKorea",
    population: 51600388,
    slug: { it: "corea-del-sud", en: "south-korea" },
    name: { it: "Corea del Sud", en: "South Korea" },
    capital: { it: "Seul", en: "Seoul" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["bianco", "rosso", "blu", "nero"], en: ["white", "red", "blue", "black"] },
    sentence: { it: "Il rosso e il blu stanno al centro, con quattro segni neri intorno.", en: "Red and blue are in the centre, with four black signs around them." }
  },
  {
    id: "emirati-arabi-uniti",
    flag: "uae",
    population: 11574682,
    slug: { it: "emirati-arabi-uniti", en: "united-arab-emirates" },
    name: { it: "Emirati Arabi Uniti", en: "United Arab Emirates" },
    capital: { it: "Abu Dhabi", en: "Abu Dhabi" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "verde", "bianco", "nero"], en: ["red", "green", "white", "black"] },
    sentence: { it: "La banda rossa sta al pennone.", en: "The red band is at the hoist." }
  },
  {
    id: "filippine",
    flag: "philippines",
    population: 117724471,
    slug: { it: "filippine", en: "philippines" },
    name: { it: "Filippine", en: "Philippines" },
    capital: { it: "Manila", en: "Manila" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["blu", "rosso", "bianco", "giallo"], en: ["blue", "red", "white", "yellow"] },
    sentence: { it: "Il sole e le tre stelle stanno nel triangolo bianco.", en: "The sun and the three stars are in the white triangle." }
  },
  {
    id: "georgia",
    flag: "georgia",
    population: 3804642,
    slug: { it: "georgia", en: "georgia" },
    name: { it: "Georgia", en: "Georgia" },
    capital: { it: "Tbilisi", en: "Tbilisi" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["bianco", "rosso"], en: ["white", "red"] },
    sentence: { it: "Una grande croce rossa e quattro croci piccole.", en: "One large red cross and four small crosses." }
  },
  {
    id: "giappone",
    flag: "japan",
    population: 122427731,
    slug: { it: "giappone", en: "japan" },
    name: { it: "Giappone", en: "Japan" },
    capital: { it: "Tokyo", en: "Tokyo" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["bianco", "rosso"], en: ["white", "red"] },
    sentence: { it: "Il disco rosso sta al centro.", en: "The red disc is in the centre." }
  },
  {
    id: "giordania",
    flag: "jordan",
    population: 11589532,
    slug: { it: "giordania", en: "jordan" },
    name: { it: "Giordania", en: "Jordan" },
    capital: { it: "Amman", en: "Amman" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["nero", "bianco", "verde", "rosso"], en: ["black", "white", "green", "red"] },
    sentence: { it: "La stella bianca a sette punte sta nel triangolo rosso.", en: "The white seven-pointed star is in the red triangle." }
  },
  {
    id: "india",
    flag: "india",
    population: 1476625576,
    slug: { it: "india", en: "india" },
    name: { it: "India", en: "India" },
    capital: { it: "Nuova Delhi", en: "New Delhi" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["zafferano", "bianco", "verde", "blu"], en: ["saffron", "white", "green", "blue"] },
    sentence: { it: "La ruota blu sta al centro della banda bianca.", en: "The blue wheel is in the centre of the white band." }
  },
  {
    id: "indonesia",
    flag: "indonesia",
    population: 287886782,
    slug: { it: "indonesia", en: "indonesia" },
    name: { it: "Indonesia", en: "Indonesia" },
    capital: { it: "Giacarta", en: "Jakarta" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "bianco"], en: ["red", "white"] },
    sentence: { it: "Il rosso sta sopra il bianco.", en: "Red is above the white." }
  },
  {
    id: "iran",
    flag: "iran",
    population: 93168497,
    slug: { it: "iran", en: "iran" },
    name: { it: "Iran", en: "Iran" },
    capital: { it: "Teheran", en: "Tehran" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["verde", "bianco", "rosso"], en: ["green", "white", "red"] },
    sentence: { it: "Lo stemma rosso sta al centro della banda bianca.", en: "The red emblem is in the centre of the white band." }
  },
  {
    id: "iraq",
    flag: "iraq",
    population: 48007437,
    slug: { it: "iraq", en: "iraq" },
    name: { it: "Iraq", en: "Iraq" },
    capital: { it: "Baghdad", en: "Baghdad" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "bianco", "nero", "verde"], en: ["red", "white", "black", "green"] },
    sentence: { it: "La scritta verde sta sulla banda bianca.", en: "The green writing is on the white band." }
  },
  {
    id: "israele",
    flag: "israel",
    population: 9647689,
    slug: { it: "israele", en: "israel" },
    name: { it: "Israele", en: "Israel" },
    capital: { it: "Gerusalemme", en: "Jerusalem" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["bianco", "blu"], en: ["white", "blue"] },
    sentence: { it: "La stella di David sta tra due strisce blu.", en: "The star of David sits between two blue stripes." }
  },
  {
    id: "kazakistan",
    flag: "kazakhstan",
    population: 21083626,
    slug: { it: "kazakistan", en: "kazakhstan" },
    name: { it: "Kazakistan", en: "Kazakhstan" },
    capital: { it: "Astana", en: "Astana" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["azzurro", "giallo"], en: ["blue", "yellow"] },
    sentence: { it: "L'aquila e il sole stanno accanto al ricamo verticale.", en: "The eagle and the sun stand beside the vertical ornament." }
  },
  {
    id: "kirghizistan",
    flag: "kyrgyzstan",
    population: 7400465,
    slug: { it: "kirghizistan", en: "kyrgyzstan" },
    name: { it: "Kirghizistan", en: "Kyrgyzstan" },
    capital: { it: "Biškek", en: "Bishkek" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "giallo"], en: ["red", "yellow"] },
    sentence: { it: "Il sole giallo sta al centro.", en: "The yellow sun is in the centre." }
  },
  {
    id: "kuwait",
    flag: "kuwait",
    population: 5102773,
    slug: { it: "kuwait", en: "kuwait" },
    name: { it: "Kuwait", en: "Kuwait" },
    capital: { it: "Città del Kuwait", en: "Kuwait City" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["verde", "bianco", "rosso", "nero"], en: ["green", "white", "red", "black"] },
    sentence: { it: "Il trapezio nero sta al pennone.", en: "The black trapezoid is at the hoist." }
  },
  {
    id: "laos",
    flag: "laos",
    population: 7974017,
    slug: { it: "laos", en: "laos" },
    name: { it: "Laos", en: "Laos" },
    capital: { it: "Vientiane", en: "Vientiane" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "blu", "bianco"], en: ["red", "blue", "white"] },
    sentence: { it: "Il disco bianco sta sulla banda blu.", en: "The white disc is on the blue band." }
  },
  {
    id: "libano",
    flag: "lebanon",
    population: 5897467,
    slug: { it: "libano", en: "lebanon" },
    name: { it: "Libano", en: "Lebanon" },
    capital: { it: "Beirut", en: "Beirut" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "bianco", "verde"], en: ["red", "white", "green"] },
    sentence: { it: "Il cedro verde sta sulla banda bianca.", en: "The green cedar is on the white band." }
  },
  {
    id: "malaysia",
    flag: "malaysia",
    population: 36385115,
    slug: { it: "malaysia", en: "malaysia" },
    name: { it: "Malaysia", en: "Malaysia" },
    capital: { it: "Kuala Lumpur", en: "Kuala Lumpur" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "bianco", "blu", "giallo"], en: ["red", "white", "blue", "yellow"] },
    sentence: { it: "La mezzaluna e la stella a quattordici punte stanno nel riquadro blu.", en: "The crescent and the fourteen-pointed star are in the blue square." }
  },
  {
    id: "maldive",
    flag: "maldives",
    population: 531517,
    slug: { it: "maldive", en: "maldives" },
    name: { it: "Maldive", en: "Maldives" },
    capital: { it: "Malé", en: "Malé" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "verde", "bianco"], en: ["red", "green", "white"] },
    sentence: { it: "La mezzaluna bianca sta nel rettangolo verde.", en: "The white crescent is in the green rectangle." }
  },
  {
    id: "mongolia",
    flag: "mongolia",
    population: 3556798,
    slug: { it: "mongolia", en: "mongolia" },
    name: { it: "Mongolia", en: "Mongolia" },
    capital: { it: "Ulan Bator", en: "Ulaanbaatar" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "blu", "giallo"], en: ["red", "blue", "yellow"] },
    sentence: { it: "Il simbolo soyombo sta nella banda rossa al pennone.", en: "The soyombo symbol is on the red band at the hoist." }
  },
  {
    id: "myanmar",
    flag: "myanmar",
    population: 55184819,
    slug: { it: "myanmar", en: "myanmar" },
    name: { it: "Myanmar", en: "Myanmar" },
    capital: { it: "Naypyidaw", en: "Naypyidaw" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["giallo", "verde", "rosso", "bianco"], en: ["yellow", "green", "red", "white"] },
    sentence: { it: "La stella bianca sta al centro.", en: "The white star is in the centre." }
  },
  {
    id: "oman",
    flag: "oman",
    population: 5671458,
    slug: { it: "oman", en: "oman" },
    name: { it: "Oman", en: "Oman" },
    capital: { it: "Mascate", en: "Muscat" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["bianco", "rosso", "verde"], en: ["white", "red", "green"] },
    sentence: { it: "Lo stemma sta nel riquadro rosso, in alto a sinistra.", en: "The emblem is in the red square, at the upper left." }
  },
  {
    id: "pakistan",
    flag: "pakistan",
    population: 259299791,
    slug: { it: "pakistan", en: "pakistan" },
    name: { it: "Pakistan", en: "Pakistan" },
    capital: { it: "Islamabad", en: "Islamabad" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["verde", "bianco"], en: ["green", "white"] },
    sentence: { it: "La mezzaluna e la stella bianche stanno sul verde.", en: "The white crescent and star are on the green." }
  },
  {
    id: "palestina",
    flag: "palestine",
    population: 5692790,
    slug: { it: "palestina", en: "palestine" },
    name: { it: "Palestina", en: "Palestine" },
    capital: { it: "Gerusalemme Est e Ramallah", en: "East Jerusalem and Ramallah" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["nero", "bianco", "verde", "rosso"], en: ["black", "white", "green", "red"] },
    sentence: { it: "Il triangolo rosso sta al pennone.", en: "The red triangle is at the hoist." }
  },
  {
    id: "qatar",
    flag: "qatar",
    population: 3173559,
    slug: { it: "qatar", en: "qatar" },
    name: { it: "Qatar", en: "Qatar" },
    capital: { it: "Doha", en: "Doha" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["granata", "bianco"], en: ["maroon", "white"] },
    sentence: { it: "Il bianco al pennone ha nove punte.", en: "The white at the hoist has nine points." }
  },
  {
    id: "singapore",
    flag: "singapore",
    population: 5905748,
    slug: { it: "singapore", en: "singapore" },
    name: { it: "Singapore", en: "Singapore" },
    capital: { it: "Singapore", en: "Singapore" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "bianco"], en: ["red", "white"] },
    sentence: { it: "La mezzaluna e le cinque stelle stanno in alto a sinistra.", en: "The crescent and the five stars are at the upper left." }
  },
  {
    id: "siria",
    flag: "syria",
    population: 26472497,
    slug: { it: "siria", en: "syria" },
    name: { it: "Siria", en: "Syria" },
    capital: { it: "Damasco", en: "Damascus" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["verde", "bianco", "nero", "rosso"], en: ["green", "white", "black", "red"] },
    sentence: { it: "Le tre stelle rosse stanno sulla banda bianca.", en: "The three red stars are on the white band." }
  },
  {
    id: "sri-lanka",
    flag: "sriLanka",
    population: 23348315,
    slug: { it: "sri-lanka", en: "sri-lanka" },
    name: { it: "Sri Lanka", en: "Sri Lanka" },
    capital: { it: "Sri Jayawardenepura Kotte", en: "Sri Jayawardenepura Kotte" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["giallo", "arancione", "verde", "granata"], en: ["yellow", "orange", "green", "maroon"] },
    sentence: { it: "Il leone giallo tiene la spada, sul fondo granata.", en: "The yellow lion holds the sword, on the maroon field." }
  },
  {
    id: "tagikistan",
    flag: "tajikistan",
    population: 10978599,
    slug: { it: "tagikistan", en: "tajikistan" },
    name: { it: "Tagikistan", en: "Tajikistan" },
    capital: { it: "Dušanbe", en: "Dushanbe" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "bianco", "verde", "giallo"], en: ["red", "white", "green", "yellow"] },
    sentence: { it: "La corona sta sulla banda bianca.", en: "The crown is on the white band." }
  },
  {
    id: "thailandia",
    flag: "thailand",
    population: 71559614,
    slug: { it: "thailandia", en: "thailand" },
    name: { it: "Thailandia", en: "Thailand" },
    capital: { it: "Bangkok", en: "Bangkok" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "bianco", "blu"], en: ["red", "white", "blue"] },
    sentence: { it: "La banda blu in mezzo è larga il doppio.", en: "The blue band in the middle is twice as wide." }
  },
  {
    id: "timor-est",
    flag: "timorLeste",
    population: 1436923,
    slug: { it: "timor-est", en: "timor-leste" },
    name: { it: "Timor Est", en: "Timor-Leste" },
    capital: { it: "Dili", en: "Dili" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "giallo", "nero", "bianco"], en: ["red", "yellow", "black", "white"] },
    sentence: { it: "La stella bianca sta nel triangolo nero.", en: "The white star is in the black triangle." }
  },
  {
    id: "turchia",
    flag: "turkey",
    population: 87926082,
    slug: { it: "turchia", en: "turkey" },
    name: { it: "Turchia", en: "Turkey" },
    capital: { it: "Ankara", en: "Ankara" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "bianco"], en: ["red", "white"] },
    sentence: { it: "La mezzaluna e la stella bianche stanno sul rosso.", en: "The white crescent and star are on the red." }
  },
  {
    id: "turkmenistan",
    flag: "turkmenistan",
    population: 7736632,
    slug: { it: "turkmenistan", en: "turkmenistan" },
    name: { it: "Turkmenistan", en: "Turkmenistan" },
    capital: { it: "Aşgabat", en: "Ashgabat" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["verde", "rosso", "bianco", "giallo"], en: ["green", "red", "white", "yellow"] },
    sentence: { it: "Il disegno del tappeto sta nella striscia al pennone.", en: "The carpet pattern is on the stripe at the hoist." }
  },
  {
    id: "uzbekistan",
    flag: "uzbekistan",
    population: 37724223,
    slug: { it: "uzbekistan", en: "uzbekistan" },
    name: { it: "Uzbekistan", en: "Uzbekistan" },
    capital: { it: "Taškent", en: "Tashkent" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["azzurro", "rosso", "bianco", "verde"], en: ["blue", "red", "white", "green"] },
    sentence: { it: "Dodici stelle e la mezzaluna stanno sulla banda azzurra.", en: "Twelve stars and the crescent are on the blue band." }
  },
  {
    id: "vietnam",
    flag: "vietnam",
    population: 102177431,
    slug: { it: "vietnam", en: "vietnam" },
    name: { it: "Vietnam", en: "Vietnam" },
    capital: { it: "Hanoi", en: "Hanoi" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "giallo"], en: ["red", "yellow"] },
    sentence: { it: "La stella gialla sta al centro.", en: "The yellow star is in the centre." }
  },
  {
    id: "yemen",
    flag: "yemen",
    population: 42961653,
    slug: { it: "yemen", en: "yemen" },
    name: { it: "Yemen", en: "Yemen" },
    capital: { it: "Sana'a", en: "Sana'a" },
    continentId: "asia",
    continent: { it: "Asia", en: "Asia" },
    colors: { it: ["rosso", "bianco", "nero"], en: ["red", "white", "black"] },
    sentence: { it: "Il rosso sta sopra, il bianco in mezzo e il nero sotto.", en: "Red is on top, white in the middle and black below." }
  }
,
  {
    id: "australia",
    flag: "australia",
    population: 27227096,
    slug: { it: "australia", en: "australia" },
    name: { it: "Australia", en: "Australia" },
    capital: { it: "Canberra", en: "Canberra" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["blu", "bianco", "rosso"], en: ["blue", "white", "red"] },
    sentence: { it: "La stella grande ha sette punte e la più piccola della Croce del Sud ne ha cinque.", en: "The big star has seven points and the smallest star of the Southern Cross has five." }
  },
  {
    id: "figi",
    flag: "fiji",
    population: 937282,
    slug: { it: "figi", en: "fiji" },
    name: { it: "Figi", en: "Fiji" },
    capital: { it: "Suva", en: "Suva" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["azzurro", "blu", "bianco", "rosso", "giallo", "verde", "granata", "nero"], en: ["light blue", "blue", "white", "red", "yellow", "green", "maroon", "black"] },
    sentence: { it: "Lo scudo ha un leone, una croce rossa, una palma e una colomba.", en: "The shield has a lion, a red cross, a palm and a dove." }
  },
  {
    id: "kiribati",
    flag: "kiribati",
    population: 138445,
    slug: { it: "kiribati", en: "kiribati" },
    name: { it: "Kiribati", en: "Kiribati" },
    capital: { it: "Tarawa Sud", en: "South Tarawa" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["rosso", "giallo", "nero", "blu", "bianco"], en: ["red", "yellow", "black", "blue", "white"] },
    sentence: { it: "Il sole sorge dal mare e sopra vola una fregata.", en: "The sun rises from the sea and a frigatebird flies above it." }
  },
  {
    id: "isole-marshall",
    flag: "marshallIslands",
    population: 35075,
    slug: { it: "isole-marshall", en: "marshall-islands" },
    name: { it: "Isole Marshall", en: "Marshall Islands" },
    capital: { it: "Majuro", en: "Majuro" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["blu", "arancione", "bianco"], en: ["blue", "orange", "white"] },
    sentence: { it: "La stella bianca ha ventiquattro punte.", en: "The white star has twenty-four points." }
  },
  {
    id: "micronesia",
    flag: "micronesia",
    population: 114183,
    slug: { it: "micronesia", en: "micronesia" },
    name: { it: "Micronesia", en: "Micronesia" },
    capital: { it: "Palikir", en: "Palikir" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["azzurro", "bianco"], en: ["light blue", "white"] },
    sentence: { it: "Le quattro stelle stanno una per lato, con una punta verso l'esterno.", en: "The four stars sit one on each side, with a point facing outward." }
  },
  {
    id: "nauru",
    flag: "nauru",
    population: 12101,
    slug: { it: "nauru", en: "nauru" },
    name: { it: "Nauru", en: "Nauru" },
    capital: { it: "Yaren", en: "Yaren" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["blu", "giallo", "bianco"], en: ["blue", "yellow", "white"] },
    sentence: { it: "La stella bianca ha dodici punte e sta sotto la riga gialla.", en: "The white star has twelve points and sits below the yellow stripe." }
  },
  {
    id: "nuova-zelanda",
    flag: "newZealand",
    population: 5287479,
    slug: { it: "nuova-zelanda", en: "new-zealand" },
    name: { it: "Nuova Zelanda", en: "New Zealand" },
    capital: { it: "Wellington", en: "Wellington" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["blu", "bianco", "rosso"], en: ["blue", "white", "red"] },
    sentence: { it: "Le quattro stelle rosse sono la Croce del Sud.", en: "The four red stars are the Southern Cross." }
  },
  {
    id: "palau",
    flag: "palau",
    population: 17614,
    slug: { it: "palau", en: "palau" },
    name: { it: "Palau", en: "Palau" },
    capital: { it: "Ngerulmud", en: "Ngerulmud" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["azzurro", "giallo"], en: ["light blue", "yellow"] },
    sentence: { it: "Il disco giallo non sta al centro: è spostato verso l'asta.", en: "The yellow disc is not in the centre: it sits toward the hoist." }
  },
  {
    id: "papua-nuova-guinea",
    flag: "papuaNewGuinea",
    population: 10947848,
    slug: { it: "papua-nuova-guinea", en: "papua-new-guinea" },
    name: { it: "Papua Nuova Guinea", en: "Papua New Guinea" },
    capital: { it: "Port Moresby", en: "Port Moresby" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["nero", "rosso", "giallo", "bianco"], en: ["black", "red", "yellow", "white"] },
    sentence: { it: "L'uccello del paradiso è giallo e le cinque stelle sono la Croce del Sud.", en: "The bird-of-paradise is yellow and the five stars are the Southern Cross." }
  },
  {
    id: "samoa",
    flag: "samoa",
    population: 220528,
    slug: { it: "samoa", en: "samoa" },
    name: { it: "Samoa", en: "Samoa" },
    capital: { it: "Apia", en: "Apia" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["rosso", "blu", "bianco"], en: ["red", "blue", "white"] },
    sentence: { it: "Le cinque stelle bianche sono la Croce del Sud.", en: "The five white stars are the Southern Cross." }
  },
  {
    id: "isole-salomone",
    flag: "solomonIslands",
    population: 858288,
    slug: { it: "isole-salomone", en: "solomon-islands" },
    name: { it: "Isole Salomone", en: "Solomon Islands" },
    capital: { it: "Honiara", en: "Honiara" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["verde", "blu", "giallo", "bianco"], en: ["green", "blue", "yellow", "white"] },
    sentence: { it: "Le cinque stelle bianche stanno sul triangolo blu.", en: "The five white stars are on the blue triangle." }
  },
  {
    id: "tonga",
    flag: "tonga",
    population: 103291,
    slug: { it: "tonga", en: "tonga" },
    name: { it: "Tonga", en: "Tonga" },
    capital: { it: "Nuku'alofa", en: "Nuku'alofa" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["rosso", "bianco"], en: ["red", "white"] },
    sentence: { it: "La croce rossa sta nel riquadro bianco.", en: "The red cross is in the white rectangle." }
  },
  {
    id: "tuvalu",
    flag: "tuvalu",
    population: 9362,
    slug: { it: "tuvalu", en: "tuvalu" },
    name: { it: "Tuvalu", en: "Tuvalu" },
    capital: { it: "Funafuti", en: "Funafuti" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["blu", "bianco", "rosso", "azzurro", "giallo"], en: ["blue", "white", "red", "light blue", "yellow"] },
    sentence: { it: "Le nove stelle gialle sono le isole di Tuvalu.", en: "The nine yellow stars are the islands of Tuvalu." }
  },
  {
    id: "vanuatu",
    flag: "vanuatu",
    population: 342564,
    slug: { it: "vanuatu", en: "vanuatu" },
    name: { it: "Vanuatu", en: "Vanuatu" },
    capital: { it: "Port Vila", en: "Port Vila" },
    continentId: "oceania",
    continent: { it: "Oceania", en: "Oceania" },
    colors: { it: ["rosso", "verde", "nero", "giallo"], en: ["red", "green", "black", "yellow"] },
    sentence: { it: "Nel triangolo nero ci sono una zanna e due foglie incrociate.", en: "In the black triangle there is a tusk and two crossed leaves." }
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
