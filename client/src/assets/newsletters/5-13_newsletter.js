/**
 * Week 18 Newsletter (Trip to Paris + Last Days in Madrid 🙁)
 *
 * NEW HEADER FIELDS (used by the redesigned template):
 *   heroImage     → wide full-bleed image at the very top of the page
 *   heroAlt       → alt text for the hero (optional)
 *   coverPhoto    → portrait photo shown beside the title + intro
 *   coverCaption  → caption under the cover photo (optional)
 *   coverAlt      → alt text for the cover photo (optional)
 *
 * The FIRST `paragraph` section is automatically pulled out and shown as the
 * intro next to the cover photo, so keep your opening paragraph first.
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import madridHipodromoTrack from '../newsletter photos/5-13 newsletter photos/IMG_9185.jpg';
import computerVisionFinalCode from '../newsletter photos/5-13 newsletter photos/IMG_5929.jpg';
import plazaSantaAnaDrinks from '../newsletter photos/5-13 newsletter photos/IMG_0346.jpg';
import botanicalGardensWalk from '../newsletter photos/5-13 newsletter photos/IMG_8267.jpg';
import preparingTortillaKitchen from '../newsletter photos/5-13 newsletter photos/IMG_8273.jpg';
import flippingTortillaGift from '../newsletter photos/5-13 newsletter photos/IMG_8303.jpg';
import cafeCojeanParis from '../newsletter photos/5-13 newsletter photos/IMG_8818.jpg';
import saintGermainNotreDame from '../newsletter photos/5-13 newsletter photos/IMG_8819.jpg';
import psgChampionsLeagueBar from '../newsletter photos/5-13 newsletter photos/IMG_8821.jpg';
import vandyReunionBreakfast from '../newsletter photos/5-13 newsletter photos/IMG_8869.jpg';
import arcDeTriompheShopping from '../newsletter photos/5-13 newsletter photos/IMG_8873.jpg';
import parisOperaHousePerform from '../newsletter photos/5-13 newsletter photos/IMG_8879.jpg';
import tuileriesLouvreWalk from '../newsletter photos/5-13 newsletter photos/IMG_8880.jpg';
import titanicPoseLouvre from '../newsletter photos/5-13 newsletter photos/IMG_8881.jpg';
import cheeseArmPrank from '../newsletter photos/5-13 newsletter photos/IMG_8882.jpg';
import eiffelTowerSummitViews from '../newsletter photos/5-13 newsletter photos/IMG_8885.jpg';
import tabernaElSurLunch from '../newsletter photos/5-13 newsletter photos/IMG_8886.jpg';
import vivaMadridWineLorenzo from '../newsletter photos/5-13 newsletter photos/IMG_8889.jpg';
import rainyRetiroLastLap from '../newsletter photos/5-13 newsletter photos/IMG_8892.jpg';
import littleDragonDumplings from '../newsletter photos/5-13 newsletter photos/IMG_8922.jpg';
import stradivariusMayaGoodbye from '../newsletter photos/5-13 newsletter photos/IMG_8925.jpg';
import creakyHuertasStairs from '../newsletter photos/5-13 newsletter photos/IMG_8948.jpg';
import barajasAirportDistraught from '../newsletter photos/5-13 newsletter photos/IMG_9029.jpg';

// Host Mom Special Bonus Reveal Attachments
import hostMomPhotoReveal1 from '../newsletter photos/5-13 newsletter photos/20260503_174818.jpg';
import hostMomPhotoReveal2 from '../newsletter photos/5-13 newsletter photos/IMG_9049.jpg';

// Extra structural snippets for the comprehensive bottom gallery grid
import galleryParis1 from '../newsletter photos/5-13 newsletter photos/IMG_0486.jpg';
import galleryParis2 from '../newsletter photos/5-13 newsletter photos/IMG_0499.jpg';
import galleryParis3 from '../newsletter photos/5-13 newsletter photos/IMG_0519.jpg';
import galleryParis4 from '../newsletter photos/5-13 newsletter photos/IMG_0546.jpg';
import galleryParis5 from '../newsletter photos/5-13 newsletter photos/IMG_0552-1.jpg';
import galleryParis6 from '../newsletter photos/5-13 newsletter photos/IMG_0554.jpg';
import galleryMadrid1 from '../newsletter photos/5-13 newsletter photos/IMG_0561.jpg';
import galleryMadrid2 from '../newsletter photos/5-13 newsletter photos/IMG_0571.jpg';
import galleryMadrid3 from '../newsletter photos/5-13 newsletter photos/IMG_9040.jpg';
import galleryMadrid4 from '../newsletter photos/5-13 newsletter photos/IMG_9041.jpg';
import galleryMadrid5 from '../newsletter photos/5-13 newsletter photos/IMG_9042.jpg';
import galleryMadrid6 from '../newsletter photos/5-13 newsletter photos/IMG_9043.jpg';
import galleryMadrid7 from '../newsletter photos/5-13 newsletter photos/IMG_9044.jpg';
import galleryMadrid8 from '../newsletter photos/5-13 newsletter photos/IMG_9045.jpg';
import galleryMadrid9 from '../newsletter photos/5-13 newsletter photos/IMG_9046.jpg';
import galleryMadrid10 from '../newsletter photos/5-13 newsletter photos/IMG_9047.jpg';
import galleryMadrid11 from '../newsletter photos/5-13 newsletter photos/IMG_9048.jpg';

const week18 = {
  id: 18,
  title: "Week 18: Trip to Paris + Last Days in Madrid🙁",
  date: "May 13, 2026",
  slug: "paris-and-last-days-madrid",

  // ── NEW: header media ────────────────────────────────────────────
  // Wide full-bleed banner at the very top (Retiro rose garden looks great here)
  heroImage: parisOperaHousePerform,
  heroAlt: "The Rose Garden in Retiro Park, Madrid",
  // Portrait cover photo shown next to the title + intro
  coverPhoto: botanicalGardensWalk,
  coverCaption: "Outside a Parisian café-pâtisserie on day one",
  coverAlt: "Vittoria standing outside a café in Paris",

  // Used on the newsletter landing page preview card
  previewDescription: "Squeezing every drop out of my final days! Celebrating Derby Day at Madrid's hipódromo, locking in for computer vision and AI finals, learning the ancestral art of flipping a Spanish tortilla, and jetting off to Paris for an electric Vanderbilt reunion before a tearful goodbye to Calle de las Huertas.",

  // Filter tags shown on the landing page
  tags: ["Madrid", "Paris", "Retiro", "Reunion", "Finals", "Travel"],

  sections: [
    {
      type: "paragraph",
      content: "Hi guys! This week, I traveled to Paris to reunite with some friends from Vanderbilt that I hadn’t seen in like 6 months!!! I know I say this every week, but this was a top 3 trip of abroad. I also finished finals, had my last host family dinner where we learned how to prepare Spanish tortilla, and said my last goodbyes to friends around Madrid. Also, get excited for host mom photo reveal at the end of the newsletter!!"
    },

    // ── HIGHLIGHTS FROM THE WEEK ─────────────────────────────────────
    {
      type: "callout",
      content: "Highlights from the Week"
    },
    {
      type: "photo-left",
      src: madridHipodromoTrack,
      caption: "Saddling up for a makeshift Kentucky Derby celebration at Madrid's local Hipódromo",
      text: "I forgot to include this in my last newsletter, but I spent last Friday at the horse track in honor of my first Kentucky Derby away from home!!! Usually, I celebrate with friends in the infield or at a family party, eating, drinking, betting, and taking the annual Ciliberti family Derby quiz put on by Uncle Greg. I was explaining the festivities to my host family, and they informed me that there was a hipodromo (horse racing track) in Madrid. Of course, I knew I had to celebrate there. So, I dragged poor Alessandra an hour outside the city to watch horses run in a circle. I was very surprised because the betting was a bit different than what I’m used to. For example, at the horse track in Madrid, you can bet to show, but not to place, if there are 11 or more horses racing. I won the first, second, lost the third, and ended with another win for the fourth race. Alessandra refused to bet on the horse races out of fear of losing (fair, I used to be like that) but once I gave her a 2 euro coin she placed a bet or two. Overall, it was a great way to satisfy my horse race craving abroad and it was cool to learn niche betting vocabulary in Spanish."
    },
    {
      type: "photo-right",
      src: hostMomPhotoReveal1,
      caption: "Surviving data builds and matrix filters for my facial recognition computer vision code",
      text: "During the day, I spent time with Alessandra's mom, grandma, and grandma's friend Maria. They were a great time. I spent Sunday night developing a facial recognition technology for my computer vision final project, Monday morning studying for my AI final, Monday afternoon taking my AI final, and Monday night finishing up an online shoe store for my Web Technologies final project. On Monday, I hung around SLU for a bit longer to say goodbye to Katie and Elizabeth, the two girls I met at orientation. Monday night, I met up with Sarah B who was visiting Madrid and other friends. I ended up playing Spanish drinking games at an apartment on Plaza Santa Ana before going to my last Mondays of abroad."
    },
    {
      type: "photo-left",
      src: computerVisionFinalCode,
      caption: "Sipping our final street drinks around Plaza Santa Ana with the school crew",
      text: "Tuesday, I went on a walk in Retiro with Sarah, then met up with Alessandra’s family in the restful Botanical Gardens. Afterwards, we walked to Malasaña and I got lunch with Maya before her finals."
    },
    {
      type: "three-photos",
      photos: [
        { src: botanicalGardensWalk, caption: "Stepping into the lush calm paths of the Botanical Gardens" },
        { src: preparingTortillaKitchen, caption: "Slicing potatoes under the expert supervision of Valle" },
        { src: flippingTortillaGift, caption: "Flipping our final masterpieces using our brand new custom tools" }
      ]
    },
    {
      type: "paragraph",
      content: "Tuesday night was my last host family dinner with everyone. This was a very special dinner because we all helped our host mom, Valle, prepare the Spanish tortilla beforehand. First, Elise, Sophie, and I were instructed to thinly slice potatoes. Usually, Valle does it with only her hands and a knife but we were struggling so she gave us cutting boards. We cooked them in a pan full of boiling oil, then poured the oil out and put the potatoes in a separate bowl. For every person at the table, we added one potato and one to the bowl, plus an additional egg at the end. Then, we poured it all back on the scorching pan. Every 15-30 seconds, we flipped the Spanish tortilla, letting the inner juices seep out and onto the pan, using this tortilla flipping tool that kinda looks like a pan lid. At the end, Valle gave my roommates and I each a tortilla flipping tool to take home! This was so so sweet and a great way to remember our time in Spain!"
    },

    // ── PARIS DAY 1 ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Paris Day 1- French Futbol!"
    },
    {
      type: "photo-left",
      src: cafeCojeanParis,
      caption: "Dumping suitcases and grabbing post-flight iced coffees at Cojean",
      text: "I arrived in Paris Wednesday morning, got lost in Orly for an hour and was perpetually bullied by Jayne because apparently it’s the easiest airport ever. Eventually, I found my way to her apartment a bit outside the city center. Once I settled in, we got coffee at the Cojean, and then Jayne was off to study for her finals the next morning. I met up with Alessandra M (not to be confused with my roommate Alessandra S) for lunch in the park. We practically spent all day catching up while she showed me around Paris. We walked all around Le Marais, Saint Germain, and saw the Notre Dame. We tried the highly recommended brioche bread with chocolate chips that reminded me of the discontinued chocolate chip Panera bagels from my childhood. 😢 While we were sitting on a bench by the river, we saw all the kids on the boat doing the 67 trend that will never ever go out of style."
    },
    {
      type: "photo-right",
      src: saintGermainNotreDame,
      caption: "Soaking up the iconic Gothic river banks right outside Notre Dame Cathedral",
      text: "I decided to do the hour walk from the river to the bar where I was meeting with Jayne and friends to watch PSG play in the Champions League semifinals against Munich. There was one street (the one connected to the arc de triumph) that was lined with so many police officers. Apparently, when PSG won the year before, there were huge riots in the street afterward."
    },
    {
      type: "photo-left",
      src: psgChampionsLeagueBar,
      caption: "An absolutely electric atmosphere inside the crowded French sports bar",
      text: "When we arrived, it was jam packed with some of the nicest dressed people I’ve seen in a sports bar. Then, I caught up with my sorority friend Isabella while watching the very intense game. The crowd of the bar was absolutely fixated on the game- everyone’s eyes moved in sync to follow the ball and the crowd erupted in cheers with every score. It was definitely fun pretending to be a PSG fan for the night, especially because the semifinals ended with them winning."
    },

    // ── PARIS DAY 2 ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Paris Day 2- REUNION DAYYY"
    },
    {
      type: "photo-right",
      src: vandyReunionBreakfast,
      caption: "The long-awaited 6-month breakfast reunion with Anabel, Jess, and Keep!",
      text: "On my second day in Paris, I woke up to a text saying that three of my good friends from Vanderbilt had just arrived at the airport. Fortunately, Anabel, Jess, and Keep had less trouble navigating the airport than I did and made it to Jayne’s apartment quickly. Because Jayne was taking finals, I got put in charge of guiding them around the city. First, we hunted for a boulangerie which took a few tries before we found one to our liking. We ate breakfast and caught up because I hadn’t seen them for 6 months!!"
    },
    {
      type: "photo-left",
      src: arcDeTriompheShopping,
      caption: "Standing beneath the massive stone foundations of the Arc de Triomphe",
      text: "Then, we went to see the Arc de Triomphe and walked into stores on a street that reminded me of Gran Via in Madrid. Honestly, for the rest of the day we didn’t really do anything interesting besides walk around. It was interesting to see all of the chairs at the outdoor coffee tables facing the streets rather than each other. Due to her lack of sleep on the plane, Anabel entered an uncontainable state of delirium, so no one stopped laughing the rest of the night."
    },

    // ── PARIS DAY 3 ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Paris Day 3- Eiffel Tower + Grand Palais"
    },
    {
      type: "photo-right",
      src: parisOperaHousePerform,
      caption: "Belting out mock opera numbers on the grand marble staircases",
      text: "My last day in France began with breakfast and a visit to Paris’ opera house. Unfortunately, I’m all museum’ed out right now so I didn’t really learn anything but Keep and I role played Opera singers getting ready to perform. Afterwards, we went to a few stores to try to find Keep a skirt. Next, we strolled through the beautiful Tuileries in front of the Louvre. (But of course not as beautiful as the ones in the Rose Garden in Retiro park.) While meandering, Anabel updated me on the state of the US right now. At the beginning of abroad, I was good about reading and listening to the news. I stopped sometime after Istanbul but before my family came to visit, likely during spring break. I’ll get caught up soon when I return home."
    },
    {
      type: "three-photos",
      photos: [
        { src: titanicPoseLouvre, caption: "Recreating the legendary Titanic bow pose in front of the glass Louvre pyramids" },
        { src: cheeseArmPrank, caption: "Anabel's chaotic reaction to Jayne throwing chunks of brie cheese directly at her arm" },
        { src: tuileriesLouvreWalk, caption: "Meandering through the expansive sculpted pathways of the Tuileries gardens" }
      ]
    },
    {
      type: "photo-left",
      src: eiffelTowerSummitViews,
      caption: "Taking in the endless sea of classic zinc roofs from the top of the Eiffel Tower",
      text: "I ended my visit to Paris by climbing the Eiffel tower. There was such a beautiful view of the city- I couldn’t believe it when Jayne told me that there are more people living in Madrid. I reluctantly left my friends and Paris after deliberating for way too long if I should change my flight to the next day. According to Jayne, I’m the most indecisive person on the planet (she’s right) and I just need to make a decision. Ultimately, I decided I wanted another host family dinner before I left, so I returned to Madrid. Unfortunately, my flight was delayed and my phone died and I couldn’t physically board the line 1 metro to get home, so I missed dinner :( But, I did get to say bye to my roommate Sophie who was leaving at the crack of dawn."
    },

    // ── LAST 48 HOURS IN MADRID ──────────────────────────────────────
    {
      type: "callout",
      content: "Last 48 Hours in Madrid"
    },
    {
      type: "photo-right",
      src: tabernaElSurLunch,
      caption: "Grabbing a final round of shared garlic prawns and croquetas at Taberna el Sur",
      text: "With all of the Paris travel and finals and visitors I totally forgot that I was moving out of my homestay in 2 days. I woke up on Saturday morning to Elise lugging her suitcases down the stairs. I threw on my glasses and ran barefoot down our stairwell to give her a hug goodbye. At first, I wasn’t super close to the girls that lived across the hall, but by the end of abroad we were sitting in each other’s beds debriefing our days. Hopefully, I’ll get to see Elise again this summer if I venture to Charlotte! Alessandra and her mom came over to move all of her stuff out, and then we went to lunch at Taberna el Sur, a tapas place down the street from us. We talked about their travels to Sevilla, a place I’m dying to return to for Feria de Abril. Then, we met up with Carly for churros at Chocolat, a place right across the street from my homestay that I’d never been to. Afterwards, Maya came over to catch up per usual. Recently, every conversation we’ve been having is like honestly crazy our lives just need to calm down."
    },
    {
      type: "photo-left",
      src: vivaMadridWineLorenzo,
      caption: "Checking off the final table completion goal at Viva Madrid with Lorenzo",
      text: "Before dinner, I met up with Alessandra again for one last glass of wine at Viva Madrid! We said bye to Lorenzo, our Italian bartender friend, and realized that we accomplished our goal of sitting at every single table in the place. Because my host mom knew I was sad about missing the last host family dinner, she offered to have another one tonight. Of course I accepted, so it was just me, Valle, and Josecho (who still didn’t say anything). Dinner was unsettlingly normal. She asked about my day, explained the meal, and told about how essential Masters programs are in Spain. Apparently, my “host sister\" Ana might get a masters in AI applications to finance. She also told me about Paris because she spent 2 months there when she was younger. After dinner, I was supposed to meet up with Alessandra again, but unfortunately there was bad cell connection or just shitty luck so we didn’t get to say goodbye. But it’s ok because that just means we have to come back to Madrid together one day. (And also I text her all the time and I’ll see her in the fall at school.)"
    },
    {
      type: "photo-right",
      src: rainyRetiroLastLap,
      caption: "A poetic final morning jog through a misty, overcast Retiro Rose Garden",
      text: "My last morning in Madrid began with one last run in Retiro park. Every time I’ve run in Retiro, it’s been beautiful and sunny; I think it made perfect sense that my last lap was one in the rain. When I got to the rose gardens, I let myself linger a bit before continuing around the park and back home. Ugh Retiro park is going to be one of the things I'll miss about Madrid. I showered, cooked my last breakfast in Madrid, and packed up a bit more. Then, I wondered around the streets of my neighborhood and Sol a bit more before meeting Kanani for lunch. We ate soup and dumplings at Little Dragon, a cheap Michelin-endorsed restaurant near Malasaña."
    },
    {
      type: "three-photos",
      photos: [
        { src: littleDragonDumplings, caption: "Savoring steaming baskets of dim sum pork dumplings at Little Dragon" },
        { src: stradivariusMayaGoodbye, caption: "Squeezing Maya tight at Stradivarius for our final departure hug" },
        { src: creakyHuertasStairs, caption: "Climbing down the creaky vintage steps of Calle de las Huertas one last time" }
      ]
    },
    {
      type: "photo-left",
      src: barajasAirportDistraught,
      caption: "Sitting on the terminal linoleum floor at Barajas, officially a college senior",
      text: "I walked back home in a trance that made me feel like I was taking that walk around the neighborhood with my host mom on the very first day, and simultaneously every day after that. I saw myself laughing with friends at Plaza Santa Ana, eating at González with Alessandra on our first week, waiting in line at Dubliners, laying on the ground next to the Puerta del Sol metro stop with Maya when we were having a bad day, buying wine and airport snacks from Dia, and even getting stopped by the police who were searching for a Moroccan man on our walk home one night. I finally walked up the creaky steps to my host family’s perfect quaint apartment on Calle de las Huertas, finished packing my stuff, and said a tearful goodbye to my host mom. She squeezed my hand and said “veo pronto.” She’s right, I will see her again someday, but right now that’s just a hope for the distant future. I’m currently writing this while sitting in the Madrid airport for the last time abroad and I’m actually distraught. I love the people, the streets, the lifestyle, the vibes, the music, the public transportation, the parks and everything about this city so so much. I’m debating on missing my flight so I can stay a bit longer. It’s actually surreal that study abroad is over. And it’s even worse that I’m officially a senior in college.\n\nXOXO,\nVittoria"
    },

    // ── HOST MOM BONUS REVEAL SECTION ────────────────────────────────
    {
      type: "callout",
      content: "P.S. The Long-Awaited Host Mom Photo Reveal! 🌸"
    },
    {
      type: "paragraph",
      content: "As promised, after months of talking about her incredible cooking, dinner table lectures on demographics, and hilarious interior decorating choices (yes, including the iconic peacock collage from week two), here is the official visual tribute to the absolute legend herself, Valle!"
    },
    {
      type: "three-photos",
      photos: [
        { src: hostMomPhotoReveal1, caption: "Valle flashing her signature smile right from our Huertas dinner table" },
        { src: hostMomPhotoReveal2, caption: "The incredible collage masterpiece framed and hanging proudly in the hallway" },
        { src: preparingTortillaKitchen, caption: "Ruling over her boiling oil skillet kingdom with culinary genius" }
      ]
    },

    // ── LANDSCAPE & MEMORY REPOSITORY ────────────────────────────────
    {
      type: "paragraph",
      content: "Here is one final compilation grid of street architecture corners, Parisian structural spires, and terminal memories archiving an unforgettable 5 months in Europe:"
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryParis1, caption: "Classic Parisian apartments towering high over stone alley ways" },
        { src: galleryParis2, caption: "Gilded architectural trim and grand windows overlooking city traffic" },
        { src: galleryParis3, caption: "Wrought iron cafe balconies framing historical district lanes" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryParis4, caption: "Sunny plazas surrounded by pristine limestone building blocks" },
        { src: galleryParis5, caption: "Winding Seine riversides catching early morning commuter light" },
        { src: galleryParis6, caption: "Symmetry lines down historical manicured garden walkways" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryMadrid1, caption: "Bustling evening crowds gathering inside Plaza de Santa Ana bars" },
        { src: galleryMadrid2, caption: "Ornate tiles and timber fixtures deep in traditional tapas cellars" },
        { src: galleryMadrid3, caption: "Washed pastel facades lighting up historic Sol neighborhoods" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryMadrid4, caption: "The majestic crystal clear fountain rims in Central Retiro Park" },
        { src: galleryMadrid5, caption: "Iron gate arches entry pathways into the Royal Botanical preserves" },
        { src: galleryMadrid6, caption: "Churros and thick hot chocolate bowls loading tables at Chocolat" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryMadrid7, caption: "Vintage wooden door frames charting generations on Huertas street" },
        { src: galleryMadrid8, caption: "Subway tiles highlighting neon platform guides down Metro Line 1" },
        { src: galleryMadrid9, caption: "The sprawling green grass track boundaries out at the Hipódromo" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryMadrid10, caption: "Stuffed luggage mountains sitting packed by the front entryway" },
        { src: galleryMadrid11, caption: "A final look out the vintage glass windows into Madrid streets" },
        { src: barajasAirportDistraught, caption: "Closing the final chapter and heading back to the States" }
      ]
    }
  ]
};

export default week18;