/**
 * Week 12 Newsletter (Barrios de Madrid - Part 2)
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

// User note: Handled via mobile/borrowed computer during spring break; only one photo asset available for layout.
//import lasLetrasStreet from '../newsletter photos/3-23 newsletter photos/IMG_7230.jpg'; 

const week12 = {
  id: 12,
  title: "Week 12: Barrios de Madrid (Part 2)",
  date: "March 30, 2026",
  slug: "barrios-de-madrid-part-2",

  // Used on the newsletter landing page preview card
  previewDescription: "A continuation of the Madrid neighborhood guide sent from spring break in Italy, covering the gorgeous gardens of Retiro, the bustling Sunday markets of La Latina, and the historic charm of Barrio de las Letras.",

  // Filter tags shown on the landing page
  tags: ["Madrid", "Retiro", "La Latina", "Barrio de las Letras", "Culture"],

  sections: [
    {
      type: "paragraph",
      content: "Hi everyone! Apologies for the late newsletter- I’m currently in Italy for my spring break without my computer, so I’ve had to jump through hoops to send out this newsletter. I’m not able to use my typical formatting, I couldn't include more than one photo, I had to type out every email address, and I was temporarily without cell service. But Maya let me borrow her computer during movie night tonight, so all is well!\n\nLast week, I started my journey to Italy, but I made the artistic decision to dedicate the newsletter to more of Madrid’s neighborhoods. And I’ll dedicate next week’s edition to dissecting the entire trip, rather than breaking it into two parts.\n\nHere is a clearer map of Madrid's neighborhoods for your reference! Last email, I reviewed Sol, Universidad/Moncloa/Arguelles, Lavapies, and El Rio. This week, I discuss Retiro, La Latina, and Barrio de las Letras."
    },

    // ── RETIRO ───────────────────────────────────────────────────────
    {
      type: "callout",
      content: "Retiro (Best Park in Madrid)"
    },
    {
      type: "paragraph",
      content: "Retiro park is another one of my favorite spots in Madrid. It’s a 10 minute walk to the right of my homestay in Barrio de las Letras, so I regularly go to stroll through the beautiful gardens. Walking through the main garden gates, I am greeted with the melodious tunes of a saxophonist seated under Ahuehuete del Retiro, Madrid’s oldest tree. Then I usually walk by the massive pond with a huge monument. Rowing a boat on the lake is on my bucket list for next week! My favorite spot is La Rosaleda de La Retiro, a breathtaking rose garden with a fountain, is in full bloom. I also love Jardines de Cecilio Rodríguez, the garden with peacocks."
    },
    {
      type: "paragraph",
      content: "I enjoy running around the perimeter of the park and watching the locals jog with their dogs. It’s been a while since I’ve been to a cafe in the park or rollerbladed, but I’d like to do these again now that it’s warming up. It’s also a great spot to meet up with friends, whether that be for running, reading, or tanning. Many people say it’s similar to Central Park; I agree in the sense that it’s a big park in a big city, but I think the comparison is more likely a reflection of the Madrileños’ obsession with New York."
    },

    // ── LA LATINA ────────────────────────────────────────────────────
    {
      type: "callout",
      content: "La Latina (Home to El Rastro)"
    },
    {
      type: "paragraph",
      content: "To the left of Lavapies is La Latina, a cute neighborhood with lots of food and drink spots. Most notably, it’s home to El Rastro, the largest flea market in the city. Every Sunday, thousands of people flock to the streets of La Latina to haggle for clothes, purses, jewelry, and household trinkets. On my first weekend in Madrid, I bought a brown leather jacket at one of the stalls. One Sunday, I ran through the neighborhood forgetting about El Rastro, and I unsuccessfully played human dodgeball for 20 minutes."
    },
    {
      type: "paragraph",
      content: "La Latina is also home to Baylie and Julia’s apartment, and Shoko, the club that study abroad students go to on Monday nights. When I went last month, they played typical remixed pop music, and I ran into everyone I’ve ever met. El Chapandaz, the bar in Moncloa, takes the win for best night spot in Madrid. Lastly, the Basilica of San Francisco, a precious church with an admittedly boring pastor, is also in this neighborhood."
    },

    // ── BARRIO DE LAS LETRAS ─────────────────────────────────────────
    {
      type: "callout",
      content: "Barrio de las Letras (Literary Quarter)"
    },
    {
      type: "photo-right",
      //src: lasLetrasStreet,
      caption: "The historic literary avenues around our home base in Las Letras",
      text: "Barrio de las Letras is hands down the best neighborhood in Madrid. Located in the city center right below Sol, this neighborhood is home to the famous Spanish author Cervantes’ birthplace. Last week, I went to the Museum of the History of Madrid, and I learned that Calle de las Huertas, the street that I live on, has been around since the 1600s. It's one of the most popular streets in Madrid and has quotes of Spanish scholars inscribed on the road, memorials for prominent authors, and a lively place for tapas and drinks. Twice a month, Calle de las Huertas has its own flea market for local vendors to sell art, jewelry, fresh food, and much more. In my opinion, this pop-up market is much more authentic than El Rastro, and the vendors sell higher-quality items than El Rastro’s vendors."
    },
    {
      type: "paragraph",
      content: "On Tuesday, Alessandra and I met up with our bartender friend Lorenzo at Los Delores, a bar that I’ve been dying to visit ever since I saw its beautiful tiled walls. We originally met Lorenzo at our favorite bar, Viva Madrid, on our first weekend in Spain and have hung out with him there every time we’ve gone since. One night, we were telling him about the difficulties of learning Spanish, and he sympathized because he moved from Italy over a year ago. According to him, southern Italy is a very difficult place to live, not only because of Italy’s declining young population, but also because of the low wages and long hours. So, he moved to Madrid, without knowing anyone, where he works 40 hours a week for a livable wage. He taught us many new phrases that I’ve added to my list. Also, he was telling us about the difficulties of Italian women because they are too possessive, but the Spanish women aren’t great either, because they are all the same."
    },
    {
      type: "paragraph",
      content: "At dinner that night, we told our host mom about aperitivo with Lorenzo, and she said the best way to learn Spanish was in the bar. Because you are able to sit and chat with natives, you are getting a full linguistic immersion. Since Alessandra and I had just spent over 2 hours speaking and our Spanish was warmed up, the conversation that night flowed so smoothly. My favorite words of the night were tiquismiquis (picky) and quinqui (a slang term to describe rebellious Spanish youth; when I asked my Spanish friends, they described it as “baddies from the hood”). Usually, we have fruit with kefir for dessert every night, but this time our host mom made Torrijas, a delicious Spanish Easter dessert similar to French toast."
    },

    // ── FOOTER ───────────────────────────────────────────────────────
    {
      type: "paragraph",
      content: "I hope you guys enjoyed this week’s shorter newsletter. Next week's newsletter might be longer, detailing all of my spring break excursions!\n\nXOXO,\nVittoria"
    }
  ]
};

export default week12;