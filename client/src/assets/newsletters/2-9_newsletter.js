/**
 * Week 5 Newsletter
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import retiroLibrary from '../newsletter photos/2-9 newsletter photos/IMG_6635.jpg';
import corteInglesMarket from '../newsletter photos/2-9 newsletter photos/IMG_0191.jpg';
import marrakechArrival from '../newsletter photos/2-9 newsletter photos/IMG_0233.jpg';
import abdulTransfer from '../newsletter photos/2-9 newsletter photos/IMG_0302.jpg';
import arganOilCoop from '../newsletter photos/2-9 newsletter photos/IMG_0349.jpg';
import aitBenhaddouKsar from '../newsletter photos/2-9 newsletter photos/IMG_0371.jpg';
import moroccoStreetAnimals from '../newsletter photos/2-9 newsletter photos/IMG_0736.jpg';
import tinghirVillage from '../newsletter photos/2-9 newsletter photos/IMG_0750.jpg';
import moudawanaReform from '../newsletter photos/2-9 newsletter photos/IMG_2760_Original.jpg';
import cybersecuritySister from '../newsletter photos/2-9 newsletter photos/IMG_2773_Original.jpg';
import carpetWeavers from '../newsletter photos/2-9 newsletter photos/IMG_2818_Original.jpg';
import tombDonations from '../newsletter photos/2-9 newsletter photos/IMG_2841_Original.jpg';
import todraGorgeSpring from '../newsletter photos/2-9 newsletter photos/IMG_2849_Original.jpg';
import merzougaDesertCamels from '../newsletter photos/2-9 newsletter photos/IMG_2855_Original.jpg';
import longestTravelDay from '../newsletter photos/2-9 newsletter photos/IMG_2857_Original.jpg';
import chuzzSelfie1 from '../newsletter photos/2-9 newsletter photos/IMG_2864_Original.jpg';
import chuzzSelfie2 from '../newsletter photos/2-9 newsletter photos/IMG_6157.jpg';
import chuzzSelfie3 from '../newsletter photos/2-9 newsletter photos/IMG_6161.jpg';
import galleryPhoto1 from '../newsletter photos/2-9 newsletter photos/IMG_6210.jpg';
import galleryPhoto2 from '../newsletter photos/2-9 newsletter photos/IMG_6299.jpg';
import galleryPhoto3 from '../newsletter photos/2-9 newsletter photos/IMG_6301.jpg';

const week5 = {
  id: 5,
  title: "Week 5: Trip to Morocco!",
  date: "February 9, 2026",
  slug: "marrakech-and-merzouga-desert",

  // Used on the newsletter landing page preview card
  previewDescription: "A whirlwind 18-hour journey beyond Spain into Morocco! Exploring ancient ksars, desert oasis villages, historic rug weaving, and riding camels during a chaotic desert sunset.",

  // Filter tags shown on the landing page
  tags: ["Travel", "Morocco", "Desert", "Weekend"],

  sections: [
    {
      type: "paragraph",
      content: "Good morning and welcome to my weekly study abroad newsletter! I spent the first half of my week attending class in Madrid, my home base for the semester. On the weekend, I traveled to Morocco. I never thought I’d visit a country in Africa before Canada or Mexico! It was another awesome week abroad and I’m very excited to share with you all here. Thank you so much for your kind responses- it makes the 4000+ miles feel just a little bit closer to home!"
    },

    // ── WEEK HIGHLIGHTS ───────────────────────────────────────────────
    {
      type: "callout",
      content: "Highlights from the Week"
    },
    {
      type: "photo-left",
      src: retiroLibrary,
      caption: "Floor-to-ceiling park views at the El Retiro library",
      text: "During the week I was mostly focused on my studies because homework has picked up and I don’t want to do it while traveling. On Tuesday, I went to the library in El Retiro. It has floor-to-ceiling windows with a beautiful view of the park, so I’ll definitely be returning soon. (Thanks for the recommendation Kaitlyn!) Unfortunately, my Web Tech class has not gotten any more interesting, but I’ve been enjoying my Middle East and North Africa course. We’ve been learning about the origins of Islam and the Sunni-Shia divide, knowledge that was handy this weekend when I was in a predominantly Islamic country."
    },

    // ── MOROCCO DAY 1 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Morocco Day 1- Travel Day"
    },
    {
      type: "photo-right",
      src: corteInglesMarket,
      caption: "An impressive food market hunt at El Corte Inglés",
      text: "Thursday night, I left for Morocco. Alessandra and I found out our flight was delayed when we were on the metro, so we explored El Corte Ingles, a shopping center along the way. We discovered this humongous market, where we bought cheese and jamón for an airport dinner. On the flight, I listened to a history of Morocco podcast that discussed the Arab and Berber population and the presence of Islam and Judaism in the region. Historically, Morocco is a country that has treated Jews with respect and protection, recognizing Hebrew heritage as a part of the national identity and promoting coexistence between the religions. Our tour guide reinforced this perspective as well."
    },
    {
      type: "photo-left",
      src: marrakechArrival,
      caption: "Arriving under the streetlights of Marrakech",
      text: "Once we landed in Marrakech, we met up with Jayne, Baylie, and Baylie’s friend from home Olivia. I was very sad to learn that my close friend Maya missed her flight and wasn’t able to join the trip :( After we went through customs, we walked 13 minutes to our AirBnb. Immediately, I noticed many of the men wearing hooded cloaks. This was a bit off-putting at first, especially because everyone was staring at us. Our tour guide later told us that this was a common protective style for men, and also added that pointy hats indicate that the wearer is honorable and should be respected."
    },

    // ── MOROCCO DAY 2 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Morocco Day 2 - Ait Bengaddou"
    },
    {
      type: "photo-right",
      src: abdulTransfer,
      caption: "Private transit chat with our guide Abdul",
      text: "We woke up quite early on our first day, anxious because we still hadn’t directly confirmed our pickup time with our tour guide or the company. Alessandra, Jayne, and I waited at our designated pickup spot near our Airbnb, while Baylie and Liv went to the Medina for the communal meeting point. Our bus didn’t come to either spot, but Baylie and Liv talked to a guide at another company who connected us to our guide. We got a private transfer to meet up with our tour group by Abdul, a very knowledgeable guide who was born in Morocco and studied political philosophy in France."
    },
    {
      type: "photo-left",
      src: arganOilCoop,
      caption: "Learning traditional hand-pressing methods at an Argan oil cooperative",
      text: "We passed through the High Atlas Mountains while I peppered Abdul with questions about life in Morocco. Our first stop was at a women’s cooperative for a demonstration of how Argan oil is made. The argan fruit is cracked, roasted (not for cosmetic oil), grounded, and pressed. At the end, they have us samples of the edible and cosmetic oil, along with some other traditional handmade cosmetic products."
    },
    {
      type: "photo-right",
      src: aitBenhaddouKsar,
      caption: "The majestic 11th-century fortified village of Ait Benhaddou",
      text: "We met up with our tour group for lunch. I enjoyed vegetable soup with bread and chicken tagine, a traditional Moroccan dish recommended by Abdul. Then we explored Ait Benhaddou, an ancient ksar, or fortified village, built in the 11th century. We watched a demonstration of artwork made indigo, saffron, and a green tea/sugar mixture. At first, the green tea color wasn’t visible. When the artist heated the painting, a brown color appeared (through a chemical process know as polymerization, I later discovered)."
    },
    {
      type: "photo-left",
      src: moroccoStreetAnimals,
      caption: "One of the many revered neighborhood cats",
      text: "We drove by a few other lookout points in Ouarzazate, Kelaa M’gouna, and Boumalne Dades. Along the way, we saw so many dogs and cats in the street. In Morocco, dogs are regarded as unclean and impure, while cats are treated with respect and seen as a blessing. Our tour guide believes that dogs can sense when a man is crazy, and will growl at him until he leaves. Additionally, in most villages, dogs are not allowed inside the house but families can keep at most one dog in the backyard."
    },

    // ── MOROCCO DAY 3 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Morocco Day 3 - Toudra Gorges + Merzouga Desert"
    },
    {
      type: "photo-right",
      src: tinghirVillage,
      caption: "Walking through tribal garden routes in Tinghir",
      text: "We started our day in a village in Tinghir, led by Mohammed, my favorite tour guide of the trip. As we were walking through his village’s gardens, we discussed tribal relations across Morocco. During droughts and famine, tribes and even the villages within a tribe will fight over water and food. In recent years, this problem has gotten a little bit better due to intermarriage between villages/tribes."
    },
    {
      type: "photo-left",
      src: moudawanaReform,
      caption: "Discussing progressive shifts in Morocco's education system",
      text: "In 2004, Morocco established a new familial code called Moudawana. This reform raised the legal marrying age to 18 years old and granted women full legal independence from husbands/brothers. Mohammed reported that the country’s liberal party is making the most rural parts of Morocco adapt progressive ideals. In his village, women are now encouraged to go to university and travel before getting married. Today, there is a higher percentage of women than men in universities across Morocco. I think this may be causing a problem in Mohammed’s village, because he forbid us from buying crafts from the boys since it discourages dedication to school. Many boys tried to sell us crafts, but not a single girl did."
    },
    {
      type: "photo-right",
      src: cybersecuritySister,
      caption: "Connecting older traditions to 21st century tech",
      text: "Mohammad has a sister studying cybersecurity in university! She bought their mom a phone and taught her to use email, and their dad got jealous so he had to get one too. Apparently, the elders in their tribe haven’t totally adopted 21st century technology, but posting on social media is permitted at cultural festivals and ceremonies."
    },
    {
      type: "photo-left",
      src: carpetWeavers,
      caption: "Intricate symbolic patterns inside the weaving room",
      text: "Next, we met the carpet weavers. They make rectangular carpets using dye from indigo, saffron, henna, tumeric, and Alfa Alfa. Beginner weavers learn to make symmetrical carpets first, then move to more complex carpets that convey meaning and honor their ancestors. The weavers also make door runners, and when laid out in a villagers' entryway, this means they are accepting visitors."
    },
    {
      type: "photo-right",
      src: tombDonations,
      caption: "Learning the local history of communal tomb offerings",
      text: "As we were walking around his village, Mohammed showed us the tombs in the holes of the walls in some buildings. He explained a tradition his village has where they put a small donation or token in the tomb hole of the most revered religious figures as an offering for a prayer. Then, the offerings are collected and divided among the poorest in the village. Our guide explained that there is a controversy around this practice because a respected religious institution in Saudi Arabia criticized it for honoring someone other than Allah. However, Muhammed disagreed with this."
    },
    {
      type: "photo-left",
      src: todraGorgeSpring,
      caption: "Standing beneath the massive Todra Gorge canyon walls",
      text: "Afterwards, we went to Todra Gorge, a canyon and spring in Tinghir. This spring is known locally as the spring of fertility, and if you wash your hands with the water you will have children. Mohammed made my friends and I wash our hands, but we told him we needed to finish school first. When we were leaving, we saw nomadic families carrying their belongings on mules. They bring their animals down to the spring to drink clean water."
    },
    {
      type: "photo-right",
      src: merzougaDesertCamels,
      caption: "Caravan trek as the Call to Prayer sounds out",
      text: "To finish off the day, we drove with our tour group to the Marzouga desert, where we rode camels. As we were watching the sunset on the sand dunes, there was a camel uprising. At the same time, the fourth daily Call to Prayer played over the loudspeaker of all the nearby mosques. To me as an outsider, it was pure chaos with camels running everywhere and this Arabic chant seemingly coming from the sky."
    },

    // ── MOROCCO DAY 4 & PHOTO GALLERIES ────────────────────────────────
    {
      type: "callout",
      content: "Morocco Day 4- Travel Day"
    },
    {
      type: "photo-left",
      src: longestTravelDay,
      caption: "Waking up early in our desert campsite",
      text: "On Sunday, Alessandra, Jayne, Baylie, Olivia and I woke up in our desert camp tent at 5:30 for the longest travel day of our life. In all, we traveled for 18 hours by foot, camel, bus, plane, and metro. I'm absolutely exhausted from all the travel and school and socializing, so I will be staying in Spain next weekend."
    },
    {
      type: "paragraph",
      content: "Please enjoy these selfies that Alessandra has deemed chuzz nation!"
    },
    {
      type: "three-photos",
      photos: [
        { src: chuzzSelfie1, caption: "Chuzz nation selfie crew" },
        { src: chuzzSelfie2, caption: "Smiles in the Moroccan sun" },
        { src: chuzzSelfie3, caption: "Desert camp memories" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryPhoto1, caption: "Shades of the magnificent Atlas paths" },
        { src: galleryPhoto2, caption: "Stunning valley overlook vistas" },
        { src: galleryPhoto3, caption: "Deep inside the incredible canyons" }
      ]
    },

    // ── TAKEAWAYS ─────────────────────────────────────────────────────
    {
      type: "callout",
      content: "Takeaways"
    },
    {
      type: "paragraph",
      content: "Moroccan food was pretty good, but nothing beats Spain's tapas. I'm obsessed with Khobz (Moroccan bread) with honey. I also loved their dates, chicken tagine, and vegetable soup. I don't think it's common for Moroccans to use salt and pepper, because everything needed seasoning."
    },
    {
      type: "paragraph",
      content: "When I was asking our first tour guide Abdul questions about arts and traditions in Morocco, he laughed and said I had an American mindset because that wasn't a thing there. However, our entire tour was focused on traditional arts. Perhaps, they are catering to what tourists expect to see when they visit Morocco, a more traditional way of life, rather than typical day-to-day activities."
    },
    {
      type: "paragraph",
      content: "WOW the people in our tour group were strange. None of the tour guides liked the Indian guy he was so abrasive. We'd ask the Estonian guy to take a photo of us and he would get in the photo. The German father-son duo just kept laughing at us the entire time. Also, the family from Berlin told us we needed to visit a different time."
    },
    {
      type: "paragraph",
      content: "I hope you enjoyed this week’s edition of my study abroad newsletter! I love and miss you all!\n\nVittoria"
    }
  ]
};

export default week5;