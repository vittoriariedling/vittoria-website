/**
 * Week 14 Newsletter (Familia en España!)
 * Note: Keeping consistent numbering sequential to last week's code (Week 14 structure)
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import sagradaFamiliaMass from '../newsletter photos/4-14 newsletter photos/IMG_1876.jpg';
import barcelonaPaella from '../newsletter photos/4-14 newsletter photos/IMG_1920.jpg';
import hotelRooftopPool from '../newsletter photos/4-14 newsletter photos/IMG_2220.jpg';
import flamencoShow from '../newsletter photos/4-14 newsletter photos/IMG_2237.jpg';
import plazaOlavideTinto from '../newsletter photos/4-14 newsletter photos/IMG_2316.jpg';
import bernabeuMarketFood from '../newsletter photos/4-14 newsletter photos/IMG_2346.jpg';
import realMadridGame from '../newsletter photos/4-14 newsletter photos/IMG_2377.jpg';
import churrosSelfie from '../newsletter photos/4-14 newsletter photos/IMG_2380.jpg';
import royalPalaceTour from '../newsletter photos/4-14 newsletter photos/IMG_4406.jpg';
import elRastroShopping from '../newsletter photos/4-14 newsletter photos/IMG_4417.jpg';

// Additional family selfie variations and moments for the bottom gallery grids
import familySelfie1 from '../newsletter photos/4-14 newsletter photos/IMG_8245.jpg';
import familySelfie2 from '../newsletter photos/4-14 newsletter photos/IMG_8246.jpg';
import familySelfie3 from '../newsletter photos/4-14 newsletter photos/IMG_8249.jpg';
import familySelfie4 from '../newsletter photos/4-14 newsletter photos/IMG_8252.jpg';
import familySelfie5 from '../newsletter photos/4-14 newsletter photos/IMG_8263.jpg';
import familySelfie6 from '../newsletter photos/4-14 newsletter photos/IMG_8278.jpg';

const week14 = {
  id: 14,
  title: "Week 14: Familia en España!",
  date: "April 14, 2026",
  slug: "familia-en-barcelona-y-madrid",

  // Used on the newsletter landing page preview card
  previewDescription: "A massive, very special family edition newsletter! Reuniting with family across Barcelona for Easter weekend—complete with flamenco and Sagrada Família trips—followed by a crowded family tour hosting everyone back home in Madrid with Real Madrid matches and palace strolls.",

  // Filter tags shown on the landing page
  tags: ["Barcelona", "Madrid", "Family", "Sagrada Familia", "Real Madrid", "Easter"],

  sections: [
    {
      type: "paragraph",
      content: "Welcome back!! This week is a very special edition because I got to visit with many family members! At the end of my spring break, I in Barcelona met my mom, Aunt Libby, cousin Nicole, her husband Jochen, and their kids Emily and Juliette. On Wednesday, my mom and Aunt Libby came to Madrid, and we were joined by Uncle Greg and Aunt Kay on Friday. Overall it was a great week visiting with family in the best country ever! Get ready for a lot of very derp family selfies!!!"
    },

    // ── BARCELONA DAY 1 ──────────────────────────────────────────────
    {
      type: "callout",
      content: "Barcelona Day 1- Easter Vigil at the Sagrada Família"
    },
    {
      type: "photo-left",
      src: barcelonaPaella,
      caption: "Sharing traditional waterfront seafood paella with the family crew",
      text: "Alessandra and I arrived around midday in Barcelona, dropped our stuff at the hotel and went to meet my mom, Aunt Libby, Nicole, Jochen, Emily, and Juliette for lunch. We went to an outdoor restaurant near the water and enjoyed delicious paella. We explained about the Spanish tradition of sobremesa, where you sit and talk after eating a meal. My mom and Aunt Libby were surprised when we told them that you have to ask for the check in Spain- they don't rush you out of the restaurant like they do back in the US. I absolutely love the way slow Spanish lifestyle is designed to make each meal a celebration of food and relationships. I would love to take this beautiful tradition back home with me, but I know it would be so difficult with the go go go of life back home."
    },
    {
      type: "photo-right",
      src: hotelRooftopPool,
      caption: "Making the absolute most of our hotel's gorgeous rooftop pool setup",
      text: "At lunch, Alessandra and I told stories of our travels, and learned about Nicole and her family’s life in Germany. Afterwards, we went to the rooftop pool at our hotel. It was by far the nicest place I’ve stayed at while abroad, so we had to make the most of it. It was my mom’s dream to go to Easter mass at the Sagrada Familia. I thought it would be crowded with long lines, so I tried to convince her otherwise. We settled on Easter Vigil mass on Saturday, with the hopes that there would be shorter lines."
    },
    {
      type: "photo-left",
      src: sagradaFamiliaMass,
      caption: "Inside the beautiful stained glass and stone architectural marvel",
      text: "We got there around 6:45 for the 8pm mass. Per usual Spanish culture, mass didn’t begin until after 9pm with no announcements about what was happening. We finally made it into church, which was had beautiful stone walls and stained glass windows. We ended up leaving early though because an hour in they still hadn't started the preparation of the gifts and we'd already listened to like 5 readings in Catalan, a language that none of us spoke."
    },
    {
      type: "paragraph",
      content: "For dinner, my mom, Aunt Libby, Alessandra and I went to a restaurant recommended by the head of my research lab. It was incredible, maybe even the best food of the entire trip. We especially loved the olives, jamón, and croquettes. At the end, they filled up Aunt Libby’s wine and brought us a homemade cheesecake because my professor was friends with the owner. Afterwards, we went back to my mom and Aunt Libby's room to chat before bed."
    },

    // ── BARCELONA DAY 2 ──────────────────────────────────────────────
    {
      type: "callout",
      content: "Barcelona Day 2- Lengthy Meals and Pool!"
    },
    {
      type: "photo-right",
      src: flamencoShow,
      caption: "Mesmerized by the fiery, passionate performers at Tablao Flamenco Cordobes",
      text: "In the morning my mom, Aunt Libby, Nicole, Jochen, Emily, Juliette, Alessandra and I went out for Easter brunch. I got avocado toast and split an acai bowl. Of course, Alessandra and I were dying to lay under the beautiful UV8 sun, so we went back to the pool after walking down Las Ramblas, a famous street in Barcelona. In the evening, we all got dressed up and went to a Flamenco show at Tablao Flamenco Cordobes."
    },
    {
      type: "paragraph",
      content: "Going in, I knew that there would be girls dancing in long beautiful dresses, but I really had no idea what Flamenco was. It was absolutely not what I was expecting. The entire show is generally mapped out, but mostly improvised by the dancers, singers, and guitarists, who performed with such passion. I loved the fast parts, where the dancers spun with fire in their eyes, and the slow parts where the singers poetically belted about love and life. I was completely mesmerized by the intensity of the Spanish performers, and how the septet complimented each other so perfectly. This beautiful experience is just another reason why I love Spanish culture so much."
    },
    {
      type: "paragraph",
      content: "We went to another tapas restaurant for dinner, sharing dishes between the eight of us. Juliette and Emily attempted to teach us some of their favorite games, but, evident from the girls' laughter every time I tried to say \"hase karotte schießgewehr\", my German needs a lot of work. I ended the night skipping through the streets with Juliette, and Alessandra with Emily. I loved getting to spend so much time with Nicole, Emily and Juliette. When the girls left for the night, they gave me the biggest bear hug ever. It was a perfect way to end a great weekend in Barcelona."
    },

    // ── HOMESTAY HIGHLIGHTS ──────────────────────────────────────────
    {
      type: "callout",
      content: "Highlights from the Week"
    },
    {
      type: "paragraph",
      content: "Only a couple notable things from the homestay this week. First, on Monday, my host mom made a traditional Easter soup with cheese that is typical in Galicia. Her and my host dad went to their place in Galicia for the break, so they brought back some food, including delicious oranges and lemons from their trees. At Tuesday night's dinner, I complimented them, and then my host dad started yelling at my host mom debating which country has the best lemons. This was quite awkward because I was the only one at dinner that night- Alessandra had left to meet with Carly, my roommates were in Paris on an engineering school sewage trip, and Ana (my host mom's niece) ate dinner elsewhere. Also, this was like the 3rd time my host dad has ever spoken at the dinner table, which made this ten minute argument over lemons even stranger."
    },
    {
      type: "paragraph",
      content: "The second notable event from the week was during a walk in Retiro. I was having my lovely leisurely Wednesday morning, sitting on a bench in the beautiful rose gardens, when this 70 year old man comes up to me and started telling me about the difficulties of married life. It was a bit of a strange conversation because I was so caught off guard and was fumbling with my Spanish. But, he was very kind and it seemed he was kind of lonely because he squeezed my hand for a very long time when he left."
    },

    // ── MADRID DAY 1 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Madrid Day 1 - Mom and Aunt Libby Arrive"
    },
    {
      type: "paragraph",
      content: "On Wednesday, my mom and Aunt Libby trained from Barcelona to Madrid while I was in class. I met up with them afterwards, and we went to Ten Con Ten, a tapas restaurant recommended by some friends. Of course, following Spanish culture, we shared all of the incredible food- risotto, burrata salad, duck rice, and spinach croquettes. It was an incredible meal, but surprisingly not traditional Spanish tapas. In retrospect, this might have been a good thing because I think Aunt Libby already had enough jamon for one trip. (I could never get tired of Spanish tapas. Jamon is like my favorite food ever.)"
    },

    // ── MADRID DAY 2 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Madrid Day 2 - Eating and Drinking and Eating and Drinking"
    },
    {
      type: "photo-left",
      src: plazaOlavideTinto,
      caption: "Introducing Mom and Aunt Libby to the perfection of tinto de verano in Plaza Olavide",
      text: "After my classes on Thursday morning, Alessandra and I walked to meet my mom and Aunt Libby at a tapas place in our favorite plaza. (Sorry Aunt Libby, we are in Spain after all!) We took them to Plaza Olavide, also known as the circle-square, coined by Alessandra's best friend from home Abby because of its round shape. I taught them about tinto de verano, a delicious Spanish drink with red wine and lemon soda. Alessandra left because she had more class, and then Aunt Libby started peppering me about my desired qualities in my future husband. I told her I'm not getting married until minimum 27, so I don't need to worry about that now."
    },
    {
      type: "paragraph",
      content: "Before leaving the plaza, we ran into Abby, who told my mom and Aunt Libby about our adventures on the Bosphorus in Istanbul. Then, I had to take my research meeting call so they went shopping on Calle de Fuencarral. Afterwards, I went to my homestay to take a nap and finish a bit of homework, before meeting them again for dinner. I chose an elevated board game restaurant because Aunt Libby loves playing games. We played Scrabble for a long time. It wasn't really a restaurant, rather it had a very small unique tapas menu, so we got a couple. We were still hungry when we were done, so we decided to go to TKO Taco, my favorite Mexican joint that Aunt Libby had been dying to try since she heard they were one euro."
    },

    // ── MADRID DAY 3 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Madrid Day 3- Retiro + Real Madrid Game!!!"
    },
    {
      type: "paragraph",
      content: "In the morning, my mom came to my host family's house to meet Valle, my host mom. Valle told my mom about her family and life in Spain. She kindly told my mom that my Spanish speaking is perfect (it's far from that). I think my mom really liked my host mom, and the slight language barrier wasn't that big of an issue. Next, we got a small breakfast at a cafe, then met Aunt Libby to go to Retiro, the best park ever! First, we walked to the large man-made lake in the middle of the park, where we sat while Aunt Libby got a drink. Then, we walked to the peacock garden, where we saw so many peacocks. Afterwards, we went to an even prettier garden, the rose garden, that according to the man from earlier in the week, is going to be in full bloom in about 20 days. Our last stop of Retiro was another little cafe for a late lunch with Uncle Greg and Aunt Kay who had just arrived that morning!"
    },
    {
      type: "photo-right",
      src: bernabeuMarketFood,
      caption: "Basking in the endless unlimited high-end options at the Bernabéu Market",
      text: "In the evening, I went to a Real Madrid game with Uncle Greg and Aunt Kay, which was definitely a highlight of the weekend. Our tickets to the game included entry to the Bernabéu Market, a food hall with unlimited food. We tried small portions of jamón, gildas, empanadas, seafood paella, Divorare focaccia ham pesto sandwiches, Beata Pasta, churros with chocolate, and gelato. I was stuffed before the game, but it was worth it because all of the food was incredible."
    },
    {
      type: "photo-left",
      src: realMadridGame,
      caption: "The electric atmosphere inside the stadium watching Real Madrid match Girona",
      text: "Then, we watched Real Madrid tie Girona in a fairly close game."
    },
    {
      type: "image",
      src: churrosSelfie,
      caption: "Uncle Greg, Aunt Kay, and I chomping down on our churros and sandwiches!"
    },

    // ── MADRID DAY 4 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Madrid Day 4- Royal Palace"
    },
    {
      type: "photo-right",
      src: royalPalaceTour,
      caption: "Taking in the incredible historical architecture outside Madrid's Royal Palace",
      text: "On Saturday, my family and I went to Madrid's Royal Palace for a guided tour. The palace was beautiful, rich with art and history. Honestly, throughout the tour I was really hungry so I didn't take good notes for this newsletter. However, I thought it was interesting that Uncle Greg and Aunt Kay saw the former King of Spain in Cordoba many years ago. Afterwards, we ate a late lunch at Plaza de Santa Ana, before I left to do a little bit more homework. We met up later for dinner at a beautiful Italian restaurant called Circolo Popolare, another recommendation from my friend with a food account. We talked for a while about artificial intelligence and its implications on society, followed by the US presidency and foreign affairs. We continued the conversation at Uncle Greg and Aunt Kay's apartment."
    },

    // ── MADRID DAY 5 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Madrid Day 5- El Rastro"
    },
    {
      type: "photo-left",
      src: elRastroShopping,
      caption: "Hunting down deals at the bustling El Rastro market",
      text: "On Sunday morning, I brought the whole Ciliberti crew to the El Rastro flea market. We scoured the stalls for hours looking for leather jackets, futbol jerseys, suitcases and beach coverups. My mom and Uncle Greg went to mass and Aunt Libby brought her newly purchased suitcase back to her apartment. Aunt Kay and I stayed and shopped around for even longer. Eventually, we all met up again at a delicious brunch restaurant in La Latina."
    },
    {
      type: "paragraph",
      content: "After eating, I met up with Alessandra who just returned from Mallorca! I was supposed to go back to my homestay to do homework, but she wanted a friend to go shopping at Zara for her birthday!!! on Monday. Also, we needed to debrief the weekend of course. Then, I met up with my family for dinner at El Barril de Las Letras, a seafood restaurant recommended by my host mom. I decided to be adventurous and try monkfish! It was delicious I just had to get over the bone. After dinner, I said sad goodbyes to my mom and Aunt Libby."
    },

    // ── FOOTER & EXTRA DERP GALLERY ─────────────────────────────────
    {
      type: "paragraph",
      content: "Getting to see so many of my family members was so fun and incredible! I'm so thankful Nicole, Jochen, Emily and Juliette were able to join us from Germany for Easter in Barcelona. I loved getting to spend the week with my mom and Aunt Libby, and I'm sure they enjoyed their sister time as well. And I'm so excited to see Uncle Greg and Aunt Kay again next week when they return to Madrid!\n\nOf course, next week's newsletter will be action packed as well! Alessandra celebrated her 21st birthday yesterday, and we will be traveling to Malta this weekend!\n\nAs promised, here is the official roundup of deep family selfies and snapshots around Spain from this week:"
    },
    {
      type: "three-photos",
      photos: [
        { src: familySelfie1, caption: "Laughing through city walks in Barcelona" },
        { src: familySelfie2, caption: "Big group smiles out at our outdoor paella lunch" },
        { src: familySelfie3, caption: "Sunny afternoons chilling on the hotel rooftop" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: familySelfie4, caption: "Dressed up and ready for the flamenco show" },
        { src: familySelfie5, caption: "Catching up with Abby in the middle of Plaza Olavide" },
        { src: familySelfie6, caption: "Final family dinner smiles in Las Letras" }
      ]
    },
    {
      type: "paragraph",
      content: "XOXO,\nVittoria"
    }
  ]
};

export default week14;