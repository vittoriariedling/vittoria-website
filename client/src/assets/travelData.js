/*
  travelData.js
  ─────────────────────────────────────────────────────────────────
  Add your visited places here. Images are imported at the top so
  Vite can bundle them — put photos in src/assets/map-photos/.

  FIELD GUIDE
  ───────────
  Countries  (ISO 3166-1 alpha-3 codes, e.g. "ESP", "FRA"):
    id        — ISO alpha-3 code
    name      — Display name
    status    — "visited" | "lived"
    photo     — imported image (see imports below)
    description — 1-3 sentences shown in the pop-up
    newsletterSlugs — (optional) array of slugs, e.g. ["madrid-week-1", "madrid-week-4"]
                      Use an empty array [] or omit if no posts linked.

  US States  (2-letter postal codes, e.g. "TN", "NY"):
    id        — postal code
    name      — Display name
    status    — "visited" | "lived"
    photo, description, newsletterSlugs — same as above

  Continents — auto-derived from the country list; no need to edit.
  ─────────────────────────────────────────────────────────────────
*/

// ── Photo imports ──────────────────────────────────────────────────
// Uncomment and update paths as you add photos to src/assets/map-photos/
//
// import spainPhoto     from './assets/map-photos/spain.jpg';
// import francePhoto    from './assets/map-photos/france.jpg';
// import italyPhoto     from './assets/map-photos/italy.jpg';
// import moroccoPhoto   from './assets/map-photos/morocco.jpg';
// import japanPhoto     from './assets/map-photos/japan.jpg';
// import tennesseePhoto from './assets/map-photos/tennessee.jpg';
// import newYorkPhoto   from './assets/map-photos/new-york.jpg';

// ── Countries ─────────────────────────────────────────────────────

export const visitedCountries = [
  {
    id: "ESP",
    name: "Spain",
    continent: "Europe",
    status: "lived",
    photo: null, // replace null with: spainPhoto
    description:
      "Home for a whole semester — Madrid became my city. Late-night dinners with my host family, daily walks in El Retiro, and a language that started to feel familiar.",
    newsletterSlugs: ["arrival-in-madrid", "first-week-of-classes", "valencia", "barrios-de-madrid-part-1", "barrios-de-madrid-part-2", 
            "familia-en-barcelona-y-madrid", "el-escorial-and-malaga", "paris-and-last-days-madrid"],
  },
  {
    id: "FRA",
    name: "France",
    continent: "Europe",
    status: "visited",
    photo: null,
    description:
      "A quick visit to Paris — the Eiffel Tower, a brioche bun with chocolate chips, and the best reunion with friends.",
    newsletterSlugs: ["paris-and-last-days-madrid"],
  },
  {
    id: "ITA",
    name: "Italy",
    continent: "Europe",
    status: "visited",
    photo: null,
    description: "A day trip to Milan, meeting Alessandra's family in Lago di Garda, crazy nights in Florence, and a cloudy Amalfi Coast.",
    newsletterSlugs: ["milan-lake-garda-florence-amalfi"],
  },
  {
    id: "PRT",
    name: "Portugal",
    continent: "Europe",
    status: "visited",
    photo: null,
    description: "Lisbon's hills, Sintra's castles, and the best pastéis de nata I've ever had.",
    newsletterSlugs: ["lisbon-and-sintra"],
  },
  {
    id: "MAR",
    name: "Morocco",
    continent: "Africa",
    status: "visited",
    photo: null,
    description:
      "I wasn't ready for this unforgettable trip through the deserts of Morocco.",
    newsletterSlugs: ["marrakech-and-merzouga-desert"],
  },
  {
    id: "USA",
    name: "United States of America",
    continent: "North America",
    status: "lived",
    photo: null,
    description: "...",
    newsletterSlugs: [],
  },
  {
    id: "DNK",
    name: "Denmark",
    continent: "Europe",
    status: "visited",
    photo: null,
    description: "Froze my ass off so I had to return when it was warmer.",
    newsletterSlugs: ["copenhagen", ],
  },
  {
    id: "DEU",
    name: "Germany",
    continent: "Europe",
    status: "visited",
    photo: null,
    description: "Dull days and wild nights.",
    newsletterSlugs: ["berlin"],
  },
  {
    id: "HUN",
    name: "Hungary",
    continent: "Europe",
    status: "visited",
    photo: null,
    description: "Split my time between Buda, Pest, and the next plate of goulash.",
    newsletterSlugs: ["budapest-and-vienna"],
  },
  {
    id: "AUT",
    name: "Austria",
    continent: "Europe",
    status: "visited",
    photo: null,
    description: "Who knew the Spanish Horses would perform best in Vienna?",
    newsletterSlugs: ["budapest-and-vienna"],
  },
  {
    id: "TUR",
    name: "Turkey",
    continent: "Asia",
    status: "visited",
    photo: null,
    description: "Istanbul: two continents, endless Turkish coffee, and a hierarchy entirely ruled by street cats.",
    newsletterSlugs: ["istanbul"],
  },
  {
    id: "IRL",
    name: "Ireland",
    continent: "Europe",
    status: "visited",
    photo: null,
    description: "Do not, I repeat, DO NOT, put six people in a four person hotel room. Dublin, Galway, and Cliffs of Moher were fun tho!",
    newsletterSlugs: ["dublin-galway-and-cliffs-of-moher"],
  },
  {
    id: "MLT",
    name: "Malta",
    continent: "Europe",
    status: "visited",
    photo: null,
    description: "Small island, big history, and too many shananagans",
    newsletterSlugs: ["malta"],
  },
  {
    id: "GBR",
    name: "United Kingdom",
    continent: "Europe",
    status: "visited",
    photo: null,
    description: "Aunts and uncles brought me outside the country for the first time. London lfg.",
    newsletterSlugs: [],
  },
  {
    id: "DOM",
    name: "Dominican Republic",
    continent: "North America",
    status: "visited",
    photo: null,
    description: "Senior spring break trip with mission hide alcohol consumption from Mom.",
    newsletterSlugs: [],
  },
];

// ── US States ──────────────────────────────────────────────────────
export const visitedStates = [
  {
    id: "TN",
    name: "Tennessee",
    status: "lived",
    photo: null, // replace null with: tennesseePhoto
    description:
      "Nashville — four years of the best community at Vandy, country music on Broadway, and hitting the books!",
    newsletterSlugs: [],
  },
  {
    id: "VA",
    name: "Virginia",
    status: "lived",
    photo: null,
    description: "Northern Virginia, just outside DC — a summer with my aunt and uncle.",
    newsletterSlugs: [],
  },
  {
    id: "NY",
    name: "New York",
    status: "visited",
    photo: null,
    description: "I still don't understand the hype.",
    newsletterSlugs: [],
  },
  {
    id: "FL",
    name: "Florida",
    status: "visited",
    photo: null,
    description: "Annual family beach vacations down at the grandparent's condo and many memorable spring breaks.",
    newsletterSlugs: [],
  },
  {
    id: "CA",
    name: "California",
    status: "visited",
    photo: null,
    description: "San Francisco, a weekend in Figma HQ, and the magnificant redwoods.",
    newsletterSlugs: [],
  },
  {
    id: "AL",
    name: "Alabama",
    status: "visited",
    photo: null,
    description: "I sadly watched Vandy loose to Bama in Tuscalusa.",
    newsletterSlugs: [],
  },
  {
    id: "CO",
    name: "Colorado",
    status: "visited",
    photo: null,
    description: "Aunt's wedding!",
    newsletterSlugs: [],
  },
  {
    id: "CT",
    name: "Connecticut",
    status: "visited",
    photo: null,
    description: "College visits per usual",
    newsletterSlugs: [],
  },
  {
    id: "DC",
    name: "Washington, D.C.",
    status: "lived",
    photo: null,
    description: "A summer in the cleanest city ever",
    newsletterSlugs: [],
  },
  {
    id: "DE",
    name: "Delaware",
    status: "visited",
    photo: null,
    description: "Quick visit to some family friends",
    newsletterSlugs: [],
  },
  {
    id: "GA",
    name: "Georgia",
    status: "visited",
    photo: null,
    description: "Cousin's wedding in Milledgeville",
    newsletterSlugs: [],
  },
  {
    id: "IL",
    name: "Illinois",
    status: "visited",
    photo: null,
    description: "Chicago! Frat formal, visiting friends, and another cousin wedding!",
    newsletterSlugs: [],
  },
  {
    id: "IN",
    name: "Indiana",
    status: "visited",
    photo: null,
    description: "Right across the border!",
    newsletterSlugs: [],
  },
  {
    id: "KY",
    name: "Kentucky",
    status: "lived",
    photo: null,
    description: "Childhood home in the 502!",
    newsletterSlugs: [],
  },
  {
    id: "LA",
    name: "Louisiana",
    status: "visited",
    photo: null,
    description: "Baton Rouge and New Orleans wow what a weekend.",
    newsletterSlugs: [],
  },
  {
    id: "MD",
    name: "Maryland",
    status: "visited",
    photo: null,
    description: "MAYA BLANKSSSS",
    newsletterSlugs: [],
  },
  {
    id: "MA",
    name: "Massachusetts",
    status: "visited",
    photo: null,
    description: "...",
    newsletterSlugs: [],
  },
    {
    id: "MO",
    name: "Missouri",
    status: "visited",
    photo: null,
    description: "Saint Louis Kids Science Center stays on top!",
    newsletterSlugs: [],
  },
  {
    id: "MI",
    name: "Michigan",
    status: "visited",
    photo: null,
    description: "Cousins yay!",
    newsletterSlugs: [],
  },
  {
    id: "NV",
    name: "Nevada",
    status: "visited",
    photo: null,
    description: "Vegas for DEFCON and Senior trip ",
    newsletterSlugs: [],
  },
  {
    id: "NJ",
    name: "New Jersey",
    status: "visited",
    photo: null,
    description: "Home to the second cousins and Sabrina Miller beach house!",
    newsletterSlugs: [],
  },
  {
    id: "NC",
    name: "North Carolina",
    status: "visited",
    photo: null,
    description: "More college visits ofc",
    newsletterSlugs: [],
  },
  {
    id: "OH",
    name: "Ohio",
    status: "visited",
    photo: null,
    description: "Cinci NYE trip was too much for me to handle",
    newsletterSlugs: [],
  },
  {
    id: "PA",
    name: "Pennsylvania",
    status: "visited",
    photo: null,
    description: "College visits yet again!",
    newsletterSlugs: [],
  },
  {
    id: "SC",
    name: "South Carolina",
    status: "visited",
    photo: null,
    description: "...",
    newsletterSlugs: [],
  },
  {
    id: "VT",
    name: "Vermont",
    status: "visited",
    photo: null,
    description: "Hackathon in the woods???!",
    newsletterSlugs: [],
  },
  {
    id: "WV",
    name: "West Virginia",
    status: "visited",
    photo: null,
    description: "Cabin weekend!",
    newsletterSlugs: [],
  },
];