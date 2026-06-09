/**
 * Week 13 Newsletter (Spring Break in Italy!)
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import milanDuomo from '../newsletter photos/4-6 newsletter photos/79c4f711-0867-44f6-860c-d0124c07b0c5.jpg';
import sforzescoCastle from '../newsletter photos/4-6 newsletter photos/100_0289.jpg';
import rivaDelGarda from '../newsletter photos/4-6 newsletter photos/IMG_0298.jpg';
import limoneTown from '../newsletter photos/4-6 newsletter photos/IMG_0309.jpg';
import arcoBikeTrail from '../newsletter photos/4-6 newsletter photos/IMG_0312.jpg';
import florenceDuomo from '../newsletter photos/4-6 newsletter photos/IMG_0317.jpg';
import leatherMarketPurses from '../newsletter photos/4-6 newsletter photos/IMG_0330.jpg';
import pastaClass from '../newsletter photos/4-6 newsletter photos/IMG_0349.jpg';
import tuscanWineTour from '../newsletter photos/4-6 newsletter photos/IMG_0428.jpg';
import amalfiCoastView from '../newsletter photos/4-6 newsletter photos/IMG_0482.jpg';

// Additional unique photo gallery options from the extensive list provided
import gallery1 from '../newsletter photos/4-6 newsletter photos/IMG_7384.jpg';
import gallery2 from '../newsletter photos/4-6 newsletter photos/IMG_7389.jpg';
import gallery3 from '../newsletter photos/4-6 newsletter photos/IMG_7401.jpg';
import gallery4 from '../newsletter photos/4-6 newsletter photos/IMG_7420.jpg';
import gallery5 from '../newsletter photos/4-6 newsletter photos/IMG_7492.jpg';
import gallery6 from '../newsletter photos/4-6 newsletter photos/IMG_7532.jpg';

const week13 = {
  id: 13,
  title: "Week 13: Spring Break in Italy!",
  date: "April 6, 2026",
  slug: "milan-lake-garda-florence-amalfi",

  // Used on the newsletter landing page preview card
  previewDescription: "A whirlwind Spring Break voyage across Italy! From train mishaps and family banquets in Milan, to breathtaking bike rides around Lago di Garda, leather market haggling and pasta-making in Florence, and a scenic finale on the Amalfi Coast.",

  // Filter tags shown on the landing page
  tags: ["Italy", "Milan", "Lago di Garda", "Florence", "Amalfi", "Spring Break"],

  sections: [
    {
      type: "paragraph",
      content: "Hi everyone! For my spring break, I traveled across Italy, starting in Milan and ending in Amalfi. I got to see lots of friends and family which was awesome! Of course, I loved Italy but I am so glad to be back in Madrid and not be dragging my suitcase to a new city every couple days. This is a long one (with lots of photos!!!) so let’s get into it 🫡."
    },

    // ── MILAN NIGHT 1 ────────────────────────────────────────────────
    {
      type: "callout",
      content: "Milan Night 1- Travel Day"
    },
    {
      type: "paragraph",
      content: "On Thursday night, Maya and I traveled to Milan. The flight was easy, but we struggled with the train stations. When looking at a train display, I didn’t realize that the first number was the platform and the second number was the amount of time that a train was delayed. We were walking from platform to platform as our train kept getting more delayed when an older Italian man asked us if we needed help. He kindly explained our mistake and was very intrigued by American study abroad. Maya and I eventually got to the place we were staying, and we had a yappy Italian chick at the check-in counter tell us her life story. Apparently she used to design for Italian Vogue, but I’m not sure if I exactly believe that one. Then we went to dinner and had another yappy Italian dude serving us and he was asking us if we knew of Justin Bieber. Overall, we received a warm welcome from the Italians but definitely had some interesting interactions."
    },

    // ── MILAN DAY 2 ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Milan Day 2- Roaming + Dinner with Alessandra’s Relatives"
    },
    {
      type: "photo-left",
      src: milanDuomo,
      caption: "Admiring the incredible, intricate details of the Milan Duomo",
      text: "Maya and I started our exploration by walking through the beautiful canal area and going to see the Milan Duomo. We decided breakfast was overrated so we went to this incredible pasta place a bit off of the beaten path. It only had four homemade options, so we knew it was authentic. Then we wandered around some more, got a cup of gelato, and sat on a stoop while listening to a saxophone."
    },
    {
      type: "photo-right",
      src: sforzescoCastle,
      caption: "Soaking up the sun in the Sforzesco Castle courtyard",
      text: "Then we laid in the courtyard of the Sforzesco Castle and enjoyed the beautiful day. In the evening, I went to dinner with Alessandra’s relatives (like second or third cousins that she’s met twice). The dinner attendees were Alberta, the matriarch of the family, Alberta’s daughter Louisa, Louisa’s daughter Elizabeth, and a family friend Edwardo who studied in the US and spoke English well. Dinner was at Alberta’s house, and she kept bringing out dish after dish. First the bread, then pasta, tuna in sauce, caprese salad, another salad, and finally oranges for dessert. After, Louisa and Elizabeth started with rounds of candies: gummies, licorice, rum and cherry chocolate, and finally Japanese rice flour cakes? We were seriously stuffed to the brim after all this incredible homemade food."
    },
    {
      type: "paragraph",
      content: "During dinner, I learned more about their English learning journeys. Alberta didn’t speak any English. Louisa taught herself English after attending university in Germany. I thought it was interesting when she suggested that English was more similar to German than Italian or Spanish. Elizabeth studies English in high school. And Edwardo’s English was by far the best because he studied in Rhode Island for 5 months. They shared that Italy has a problem with the smartest students leaving for university or jobs and not coming back. Kentucky also has the same problem, hence the creation of the Governor's Scholars program that awards scholarships to the smartest Kentucky students. Lastly, I loved how close their family was. For example, Louisa filmed her daughter Elizabeth’s first kiss and was there when she found out that the boy had a girlfriend. After dinner, we rode these toy horses around the house because Alessandra and her sister had ridden them in their last visit when they were kids."
    },

    // ── LAGO DI GARDA DAY 1 ──────────────────────────────────────────
    {
      type: "callout",
      content: "Lago di Garda Day 1- Roaming + Dinner with More of Alessandra’s Relatives"
    },
    {
      type: "photo-left",
      src: rivaDelGarda,
      caption: "The majestic alpine mountain backdrop of Riva del Garda",
      text: "In the morning, Alessandra and I took a two-hour train to Mori, where another relative Stefano, who spoke English well, picked us up and drove us to his house in Riva del Garda. This little lake town in Italy was definitely the highlight of my trip — it was surrounded by gorgeous mountains that made the town have a calming ambiance. Stefano and his wife Sarah, a Brit that recently earned her residency in Italy, were so kind to let us stay in their guest room for a few days. Once we arrived, we walked around the waterfront to appreciate the views of the mountains and lake. Then, we got our first pizza of the trip and they even had gluten-free crust for Alessandra!"
    },
    {
      type: "paragraph",
      content: "For dinner, Sarah prepared eggplant with lots of veggies and a Greek yogurt sauce. They gave us lots of recommendations for things to do in the area, and told us how they met through a walking group. Much of the conversation focused on sororities. Sarah was absolutely bewildered by the concept of Greek life. We explained the rounds of rush, the intensity of recruitment in the South, the effects of which sorority you join on your social life throughout college, dues, and living in the house. She was so confused about young girls paying for recruitment counseling to get into a “good” sorority. Alessandra and I almost died of laughter when we even caught Sarah watching Bama Rush videos the next day."
    },
    {
      type: "paragraph",
      content: "I was intrigued by Stefano’s way of life — he has a computer science degree, acts as a freelance project manager at medium businesses for technology upgrades, and teaches Python at a high school. Crazy enough, he was doing an AI Coursera class from a CS professor at Vanderbilt! He also spends a lot of time running marathons, hiking in the mountains, and biking around the lake. He seems like he’s living the life. Makes the idea of living in Europe seem very plausible… But yesterday on the phone my grandma vehemently told me I am not allowed to move to Europe."
    },

    // ── LAGO DI GARDA DAY 2 ──────────────────────────────────────────
    {
      type: "callout",
      content: "Lago di Garda Day 2- Limone, Biking, and Even More Meals"
    },
    {
      type: "photo-right",
      src: limoneTown,
      caption: "Exploring the picturesque, sun-drenched waterfront of Limone",
      text: "This day on Lago di Garda was by far the best day of my Italy trip, and maybe even study abroad. In the morning, Stefano drove us to Limone, a nearby town. We moseyed around town, stopping in shops, walking by the waterfront, and taking photos of the stunning scenery. Once we were ready to leave, we tried to catch the bus back to Riva, but it never came. So we tried to take the ferry, but that also never came. We tried to call an Uber, but it also never came. Two hours later, a bus came, but that meant we were going to be quite late to lunch with some more of Alessandra’s relatives. It was slightly stressful, but the town was so beautiful that public transportation difficulties couldn’t ruin the day."
    },
    {
      type: "photo-left",
      src: arcoBikeTrail,
      caption: "Cruising along the incredible cycling paths heading to Arco",
      text: "When we got back to Riva, we began our bike ride to Arco. This was definitely the most incredible bike ride of my life. We got lunch with Rosella, a woman with almost perfect English because she used to work as a translator in a bank, and her husband Mario, who only spoke Italian. The main dish of our meal was carne salada, a delicious dish that originated in the region. She served it with red wine, two salads, and chocolate-covered dates; Mario kept yelling at us to eat more. At the end, she poured us a huge shot of Grappa, an Italian liquor that I found out is disgusting but I felt obligated to finish it because I didn’t want to be rude."
    },
    {
      type: "paragraph",
      content: "Because Rosella worked as a translator, we talked significantly about learning languages. Rosella disagreed with Louisa’s statement that German, rather than Italian, is more similar to English. She also told us about the differences between formal Italian and Dialect, which I had read a bit about in My Brilliant Friend a few years ago. She also told us how she completed the Camino Portuguesa as a 70-something-year-old, which makes me aspire to have that level of fitness at that age. Lastly, Rosella sang for us her church choir songs!"
    },
    {
      type: "paragraph",
      content: "After a filling lunch, we biked to Arco city center where a summer festival was taking place. We walked up a mountain to a castle to see the sweeping views of the area. Then, we biked back to Riva, stopping at the lakeside to watch a stunning sunset behind the mountains. When we arrived back at Stefano and Sarah’s house, we ate tofu ragú with Sarah and discussed immigration and travel. When she wasn’t a resident of Italy, she had to go back to the UK every 90 days because of Brexit. We explained to her the current difficulties of flying with DHS and ICE in the US airports. She also told us the difficulties of flying to the US. Because she has a passport from a “friendly” country, she applies to travel to the US through a program called ESTA. But foreigners from countries without waivers need to apply for a travel visa every time they visit. I had no idea that this intense of a screening process existed for travel to the US, which made me feel incredibly stupid. Every time I travel to a new country I just show up and hope my US passport and Spanish student visa is good enough for entry."
    },

    // ── LAGO DI GARDA DAY 3 / FLORENCE NIGHT 1 ───────────────────────
    {
      type: "callout",
      content: "Lago di Garda Day 3 / Florence Night 1- Waterfalls & Study Abroad Takeover"
    },
    {
      type: "paragraph",
      content: "In the morning, Alessandra and I started our day by biking to the waterfall in Arco. Stefano knew the guy who ran the site, so after strolling through the gardens, the owner gave us a pastry and cappuccino. We caught the bus to Mori and trained to Florence, where we spent the next few days. For dinner, I reunited with my friend Teagan who cooked a lovely Mediterranean meal for me. In Florence, she stays in an apartment with 3 other girls in our sorority, so I got to catch up with them as well! One of the girls, Callie, had her mom visiting. So, they took all of us to a nearby bar where we met up with more friends, chatted, and played cards. Teagan also brought me to what she claims is Florence’s best gelato shop, and she wasn’t wrong! Teagan and I ended the night at a study abroad night club where we ran into so many Vanderbilt people. As I would see over the next few days, Florence has been completely taken over by tourism, specifically study abroad. Walking around on the streets, touristy area or not, I saw mostly study abroad students and heard more English than Italian."
    },

    // ── FLORENCE DAY 2 ───────────────────────────────────────────────
    {
      type: "callout",
      content: "Florence Day 2- Purses and Pasta Making"
    },
    {
      type: "photo-left",
      src: florenceDuomo,
      caption: "The majestic facade of Florence's iconic cathedral complex",
      text: "On Tuesday, Alessandra, Carly, and I woke up and got spinach omelets for breakfast. During our spring break, I made it a goal to avoid museums at all cost because that’s all we’ve done on our prior travels. But, we of course walked by the intricate Duomo and David."
    },
    {
      type: "photo-right",
      src: leatherMarketPurses,
      caption: "Haggling for high-quality leather bags in the street markets",
      text: "A highlight of the day was haggling for purses in the leather markets, where we got a decent deal because we bought 3 really niche, never-seen-before handbags. (I later found out that two of my friends had the same one and I’ve been seeing them everywhere since buying.) Afterwards, we walked to Piazza Michelangelo to see a beautiful view of the city. When I visited Florence in 2022, this was my favorite part of the trip so I was excited to see it again. We ate delectable focaccia sandwiches at Pino’s sandwich shop."
    },
    {
      type: "photo-left",
      src: pastaClass,
      caption: "Crafting fresh lemon tortellini, ravioli, and tagliatelle from scratch",
      text: "We continued exploring more, before returning to our Airbnb to get ready for our pasta making class! In the class, we made lemon tortellini, ravioli with tomatoes, and tagliatelle with bolognese sauce."
    },

    // ── FLORENCE DAY 3 ───────────────────────────────────────────────
    {
      type: "callout",
      content: "Florence Day 3- Wine Tour Dilemmas"
    },
    {
      type: "photo-right",
      src: tuscanWineTour,
      caption: "Taking in the panoramic vistas overlooking the hills of Siena",
      text: "In the morning, Alessandra, Carly, and I got breakfast at a very Americanized spot. Then we took the tram far out to meet our wine tour group. On the bus, we were seated directly in front of a group of British girls that were celebrating a 30th birthday. At the beginning of the trip, we overheard them say that it was their goal to annoy every person on the bus. And they did just that — they screamed the happy birthday song over 15 times, asked 'would you rather' questions to everyone the whole ride home, and basically just wouldn’t shut up. Between the yelling and the winding Tuscan roads, I had a major headache and stomach ache. Needless to say, it wasn’t a very enjoyable experience. As for the actual wine tasting, it was fun to learn about the regional wines and olive oils and to go to the castle town overlooking Siena. But, I didn’t like a lot of the wines that much, especially not the regional Chianti."
    },
    {
      type: "paragraph",
      content: "In the evening, we got a late dinner with some other girls in our sorority. I got an incredible prosciutto pizza. Then we went to Paige’s apartment to figure out our housing dilemma. Originally, we were supposed to leave for southern Italy on Wednesday, but after seeing the projected rain and cold temperature, we decided to switch our train to stay another night in Florence. However, we didn’t want to pay for another stay but thought it would be fine since we had friends living in apartments with couches studying in Florence. But everyone had someone staying with them. In the end, Paige realized that her roommate didn’t have as many overnight guests as originally expected, so we stayed at her place. Between the housing dilemma and budget wine tour, Wednesday in Florence wasn’t exactly what I thought it would be."
    },

    // ── FLORENCE DAY 4 / SALERNO NIGHT 1 ─────────────────────────────
    {
      type: "callout",
      content: "Florence Day 4 / Salerno Night 1- Day of Rest"
    },
    {
      type: "paragraph",
      content: "Our train to Salerno didn’t leave until 5pm, so we had a lot of time to kill before then. In the morning, Alessandra, Paige and I got breakfast at another very American restaurant. We couldn’t find any Italian places so I’ve come to the conclusion that they just drink coffee and wait until lunch to eat. Afterwards, Alessandra and I went on a quest to find the less touristy part of Florence. We crossed the Ponte Vecchio and just kept walking until we found Italian neighborhoods and delis. In the afternoon, we caught our train to Salerno. When we got there, it was quite rainy so we decided to go to the grocery store and buy pasta ingredients to cook in our Airbnb. We watched Italian cooking shows while eating our yummy pesto pasta."
    },

    // ── SALERNO DAY 2 ────────────────────────────────────────────────
    {
      type: "callout",
      content: "Salerno Day 2- Amalfi"
    },
    {
      type: "photo-right",
      src: amalfiCoastView,
      caption: "Stepping off the bus into the stunning cliffsides of Amalfi",
      text: "Our final day in Italy began with breakfast made at the Airbnb. I was staying with Maya, Sarah, and Taylor so on the way over, Alessandra and Carly stopped at the store to grab eggs, fruit, and avocado. After eating, we bussed to Amalfi for the day. Unfortunately, I was sitting in the back of the bus while we were going down very windy roads, which made me very nauseous. In the past, I haven’t been one to get motion sick on buses but studying abroad has proven this wrong."
    },
    {
      type: "paragraph",
      content: "When we arrived in Amalfi we walked around to see the shops. We had ambitions of hiking to Positano, but my plans changed because I knew I couldn’t bus back. So instead, we broke into two groups and I “hiked” with Alessandra, Maya, and Carly to a small playground at the end of a path in Amalfi. We attempted to catch a ferry to Positano, but missed it so we took some photos near the water and got a bite to eat at a cafe. We also missed the next ferry, so we had more time to kill. We got some gelato and continued walking around until the next ferry came. We went back to our Airbnb, watched movies and made dinner before packing our suitcases to leave Italy in the morning."
    },

    // ── FOOTER & GALLERY GRID ───────────────────────────────────────
    {
      type: "paragraph",
      content: "Spring break was definitely a week to remember, with lots of ups and downs. The highlight of my trip was definitely biking in Lago di Garda, spending time with so many sorority friends, and yapping with Alessandra's relatives! One of the biggest surprises was that Italians don’t eat pasta and pizza for every meal. I guess this makes sense though because if they did they would all probably be obese.\n\nI hope you all enjoyed this week's newsletter! Get ready for next week’s family edition!\n\nHere is a collection of extra snapshots captured along the way:"
    },
    {
      type: "three-photos",
      photos: [
        { src: gallery1, caption: "Strolling through the historic canals of Milan" },
        { src: gallery2, caption: "Gorgeous alpine views right from the guest window" },
        { src: gallery3, caption: "Sunny moments relaxing by the Italian lakefront" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: gallery4, caption: "A panoramic sweeping view from the castle peak" },
        { src: gallery5, caption: "Stunning golden hour reflections behind the mountains" },
        { src: gallery6, caption: "A peaceful final afternoon on the cliffs of Amalfi" }
      ]
    },
    {
      type: "paragraph",
      content: "XOXO,\nVittoria"
    }
  ]
};

export default week13;