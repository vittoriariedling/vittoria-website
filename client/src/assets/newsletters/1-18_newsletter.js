/**
 * Week 2 Newsletter
 *
 * NEW REUSABLE SECTION TYPES:
 *
 *  { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 *    → Three images displayed side-by-side in a horizontal row.
 *
 *  { type: "photo-left", src, caption, text }
 *    → One photo on the LEFT, a text block on the RIGHT.
 *
 *  { type: "photo-right", src, caption, text }
 *    → One photo on the RIGHT, a text block on the LEFT.
 *
 *  { type: "paragraph", content }
 *    → Standard body paragraph.
 *
 *  { type: "callout", content }
 *    → Highlighted section header / pull quote.
 *
 *  { type: "image", src, caption }
 *    → Single full-width centered image.
 */

import subwayNight from '../newsletter photos/1-18 newsletter photos/IMG_5744.jpg';
import sites from '../newsletter photos/1-18 newsletter photos/IMG_5714.jpg';
import calle from '../newsletter photos/1-18 newsletter photos/IMG_5700.jpg';
import brushTeeth from '../newsletter photos/1-18 newsletter photos/IMG_5747.jpg';
import packedMetro from '../newsletter photos/1-18 newsletter photos/IMG_5695.jpg';
import coffee from '../newsletter photos/1-18 newsletter photos/IMG_5702.jpg';
import abbyAla from '../newsletter photos/1-18 newsletter photos/IMG_5712.jpg';
import food from '../newsletter photos/1-18 newsletter photos/IMG_5716.jpg';
import houseParty from '../newsletter photos/1-18 newsletter photos/IMG_5721.jpg';
import honestGreens from '../newsletter photos/1-18 newsletter photos/IMG_5709.jpg';
import hostFamDin from '../newsletter photos/1-18 newsletter photos/IMG_0077.jpg';
import caracordada from '../newsletter photos/1-18 newsletter photos/IMG_5752.jpg';
import tomatoToast from '../newsletter photos/1-18 newsletter photos/IMG_5724.jpg';
import tkoTaco from '../newsletter photos/1-18 newsletter photos/IMG_0104.jpg';
import cerroTioPio from '../newsletter photos/1-18 newsletter photos/IMG_0064.jpg';
import streetDancing from '../newsletter photos/1-18 newsletter photos/IMG_5755.jpg';
import peacockHunt from '../newsletter photos/1-18 newsletter photos/IMG_5759.jpg';

const week2 = {
  id: 2,
  title: "Week 2: First Week of Class + More Madrid Exploration",
  date: "January 18, 2026",
  slug: "first-week-of-classes",

  // Used on the newsletter landing page preview card
  previewDescription: "Classes began, the nightlife got chaotic, and I walked into an active police chase. Just another week in Madrid.",

  // Filter tags shown on the landing page
  tags: ["Classes", "Nightlife", "Weekend"],

  sections: [
    {
      type: "paragraph",
      content: "Hi all and welcome to week 2 of my study abroad newsletter! I had my first week of classes and I explored Madrid more on the weekend. Overall, it was a great week, my Spanish is definitely improving through dinners with my host family, and I'm becoming more accustomed to the Madrid lifestyle."
    },

    // ── CLASSES ───────────────────────────────────────────────────────
    {
      type: "callout",
      content: "Classes!"
    },
    {
      type: "paragraph",
      content: "Happy first week of classes! Because I'm majoring in Computer Science and Political Science, I still have lots of requirements to fulfill. I'm taking 3 computer science 'depth' courses and 2 political science elective courses."
    },

    // Photo LEFT example — subway photo with descriptive text on the right
    {
      type: "photo-left",
      src: subwayNight,
      caption: "The Madrid subway at 1 AM on a Thursday",
      text: "On Mondays and Wednesdays, I begin with my Artificial Intelligence course at 2pm. Next is Cold War and its Legacy — a very politically charged course. My last course is Politics of the Middle East and North Africa, which I'm excited about for the international perspectives it brings."
    },

    // ── NIGHTLIFE ─────────────────────────────────────────────────────
    {
      type: "callout",
      content: "Nightlife Adventures"
    },

    // Photo RIGHT example — party photo with text on the left
    {
      type: "photo-right",
      src: houseParty,
      caption: "The apartment party with 23 international students",
      text: "Wednesday night was by far the most memorable. Alessandra and I went to Dubliners, known for its 1 euro shots on Wednesdays. Afterwards, we walked home straight into an active police chase — 20 cop cars and an interrogation about a man on the run. We sprinted the rest of the way home."
    },

    // Three photos in a row example
    {
      type: "three-photos",
      photos: [
        { src: honestGreens, caption: "Honest Greens lunch" },
        { src: coffee, caption: "Morning café con leche" },
        { src: abbyAla, caption: "Alessandra and Abby" }
      ]
    },

    // ── WEEKEND ───────────────────────────────────────────────────────
    {
      type: "callout",
      content: "Restful Weekend Activities"
    },
    {
      type: "paragraph",
      content: "Saturday I stayed in while Alessandra went to snowy Segovia. I finished my second book of the year at Cafeteria Esparteros over jamon with tomato sauce on a toasted baguette. Spanish ham is the best thing ever."
    },

    {
      type: "photo-left",
      src: cerroTioPio,
      caption: "Sunset at Parque Cerro del Tio Pio",
      text: "My friend Baylie just arrived in Madrid, so we took a cloudy sunset walk in Parque Cerro del Tio Pio. We had salmon kebabs for dinner with my host family — my favorite dish of the week."
    },

    // Three photos — Sunday adventures
    {
      type: "three-photos",
      photos: [
        { src: tkoTaco, caption: "1€ tacos at TKO" },
        { src: peacockHunt, caption: "Peacock hunting in El Retiro" },
        { src: streetDancing, caption: "Mad for Swing dancers" }
      ]
    },

    {
      type: "paragraph",
      content: "Sunday was also a chill day. We grabbed 1 euro tacos at TKO taco and went peacock hunting in El Retiro. After mass at Basílica de Jesús de Medinaceli (the pastor spoke way too fast), we went home to discover a photo collage our host mom hung — featuring a nude peacock costume photo of herself. What a curious surprise!"
    },

    {
      type: "paragraph",
      content: "I hope you enjoyed week two. I'm settling into the Madrid lifestyle and aim to avoid future police encounters. I'll be traveling to Copenhagen next weekend — send recommendations! 🌸"
    }
  ]
};

export default week2;
