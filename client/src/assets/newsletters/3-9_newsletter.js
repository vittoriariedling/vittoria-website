/**
 * Week 9 Newsletter
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import madridNightlife from '../newsletter photos/3-9 newsletter photos/IMG_6658.jpg';
import istanbulArrival from '../newsletter photos/3-9 newsletter photos/IMG_6968.jpg';
import ramadanIftar from '../newsletter photos/3-9 newsletter photos/IMG_6977.jpg';
import turkishBreakfast from '../newsletter photos/3-9 newsletter photos/IMG_6980.jpg';
import hagiaSophia from '../newsletter photos/3-9 newsletter photos/IMG_6985.jpg';
import blueMosque from '../newsletter photos/3-9 newsletter photos/IMG_6986.jpg';
import grandBazaar from '../newsletter photos/3-9 newsletter photos/IMG_6989.jpg';
import bosphorusCruise from '../newsletter photos/3-9 newsletter photos/IMG_6994.jpg';
import asianSideFerry from '../newsletter photos/3-9 newsletter photos/IMG_6995.jpg';
import turkishPide from '../newsletter photos/3-9 newsletter photos/IMG_6996.jpg';
import balatNeighborhood from '../newsletter photos/3-9 newsletter photos/IMG_6999.jpg';

// Extra gallery photos from the extensive provided list
import gallery1 from '../newsletter photos/3-9 newsletter photos/IMG_7003.jpg';
import gallery2 from '../newsletter photos/3-9 newsletter photos/IMG_7006.jpg';
import gallery3 from '../newsletter photos/3-9 newsletter photos/IMG_7008.jpg';
import gallery4 from '../newsletter photos/3-9 newsletter photos/IMG_7011.jpg';
import gallery5 from '../newsletter photos/3-9 newsletter photos/IMG_7012.jpg';
import gallery6 from '../newsletter photos/3-9 newsletter photos/IMG_7023.jpg';

const week9 = {
  id: 9,
  title: "Week 9: Trip to Istanbul!",
  date: "March 9, 2026",
  slug: "istanbul",

  // Used on the newsletter landing page preview card
  previewDescription: "Reaching the halfway point of study abroad with midterm completions, VIP nights in Madrid, and an unforgettable journey exploring mosques, bazaars, and ferries across continents in Istanbul.",

  // Filter tags shown on the landing page
  tags: ["Madrid", "Istanbul", "Türkiye", "Asia", "Travel"],

  sections: [
    {
      type: "paragraph",
      content: "Hello everyone!!! In this weeks, I’m reporting from Istanbul, where I conquered the art of haggling. This week marks the halfway point of my four month European vacation, which is extremely saddening and also somewhat calming at the same time. I have adapted to this new sense of normalcy, traveling almost every weekend and living with a host family, both which I love immensely. But I definitely miss my people from home and the familiarity of life in the States."
    },
    {
      type: "paragraph",
      content: "Also, my apologies for the late newsletter!!! We decided to fly back on Monday night because it worked better with flights and we hadn't skipped any classes yet. Also, I know it may seem like I don't do any school work, which is only partially true- I have way less work here in Spain than I usually do back home!"
    },

    // ── HIGHLIGHTS FROM THE WEEK ─────────────────────────────────────
    {
      type: "callout",
      content: "Highlights from the Week"
    },
    {
      type: "photo-right",
      src: madridNightlife,
      caption: "Out and about exploring the Malasaña bar scene",
      text: "This week is representative of my typical life here in Madrid. On Monday, I took midterms for AI and Cold War. Thankfully midterm season was successfully completed, but now I have to start a couple final presentations in my political science courses. On Tuesday, Alessandra and I explored Casa de Campo after class. We discovered these lounging benches that were innovative but uncomfortable, so we laid in the grass and read by the pond. After homework time and dinner with our host family, we went to Alessandra’s class friend’s house and met her friends. Then we met up with Carly, a friend from our sorority, to go to a discoteca but the line was too long so we ditched for the Malasana bars. My favorite was Wall Street, a bar with “stock market” crashes that drop the price of drinks. My favorite part about going out is hanging out with friends, so this night became one of my favorites when we ran into friends from my Politics of the Middle East and North Africa (MENA) class and met up with Abby too!"
    },
    {
      type: "paragraph",
      content: "If I had to outline the anatomy of a perfect day in Madrid, it would be without a doubt Wednesdays. I sleep in a bit because class doesn’t start until 2. When I wake up, I shower, make breakfast, and take my coffee on our balcony while reading a book in Spanish. My host mom gave me this philosophical book with short stories, that is proving to be quite difficult to understand. Then, I finished up a bit of homework while enjoying beautiful music from Alessandra practicing the piano. Currently, she’s learning two of the best songs ever: Billy Joel’s Vienna and Bruno Mars’ When I Was Your Man. This Wednesday, my third class got canceled so I took the bus home and yapped with my other roommates. For dinner, Alessandra and I met up with some girls in our sorority and we told so many funny stories it was incredible vibes. Then, I went to a discoteca with Maya and friends. When we were waiting in the entrance line, these two Madrileñas came up to us and explained that they knew the workers well but needed more girls to get into the VIP section, so they asked if we could join them. The easy yes granted us free bottle service and a phenomenal night. Unfortunately on Thursday, I was thrown back into reality with our latest dinnertime yet, at a whopping 10:45pm."
    },

    // ── ISTANBUL: TO GO OR NOT TO GO ──────────────────────────────────
    {
      type: "callout",
      content: "Istanbul: To Go or Not To Go"
    },
    {
      type: "paragraph",
      content: "When I said I went to Istanbul this weekend, you may have been surprised considering the current conflict. Alessandra, Abby and I booked nonrefundable flights before any conflict started, so we were faced with the difficult decision of boarding our flight to the Middle East. Of course, we monitored the news closely and consulted many people in the days leading up to our departure. My mom was not the biggest fan of this trip, but Alessandra’s mom was optimistic. Some other friends advised me against it or reacted with concern when I mentioned my plans. I reached out to three friends who had visited within the last week and they said it was totally fine. When I asked my host mom at dinner, she told us the story of a girl who’s mom didn’t allow her to go on a school trip out of fear for her safety, so she stayed in Madrid but died in a shooting in her neighborhood that same weekend. My selling point to take the trip was a conversation with my MENA teacher, who repeated my host mom’s sentiments that there is danger everywhere, but he thought it would be safe."
    },

    // ── ISTANBUL DAY 1 ───────────────────────────────────────────────
    {
      type: "callout",
      content: "Istanbul Day 1: Arrival in Sultanahmet (The Old Town)"
    },
    {
      type: "photo-left",
      src: istanbulArrival,
      caption: "Catching our first views of the historical Old Town skyline",
      text: "Friday afternoon, Alessandra, Abby and I touched down in Istanbul, Türkiye and took the long ride to our stay in the oldest part of Istanbul on the European side. The ride from the airport reminded me of views from Kentucky and Tennessee, besides the (quite ugly) boars! Also, I thought it was very funny when our taxi driver called Abby and I white t-shirts. He asked if the three of us were all friends because we don’t look like each other. Alessandra has a copious amount of Arab accusations from our Morocco trip, but this weekend she consistently had her nationality correctly identified as Mexican (although she is Italian and Irish as well)."
    },
    {
      type: "photo-right",
      src: ramadanIftar,
      caption: "Families gathering for Iftar between the historic mosques",
      text: "After settling in at our hotel, we walked around our neighborhood and saw a plethora of mosques. As we were strolling between the Hagia Sophia and the Blue Mosque, we watched as many Ramadan celebrants broke their fast on picnic blankets at sundown. This meal is known as Iftar, which according to religious tradition begins with eating a date. During this ceremonial meal, all I could think about was the noise level. There were hundreds of people in this park and I could still hear the rustle of the leaves blowing in the breeze. Never in a million years would this happen in Spain- the Spanish are so goddamn loud. It was so relaxing to be in quieter, calmer country for the weekend!"
    },
    {
      type: "paragraph",
      content: "Afterwards, we ate dinner at a yummy kebab place on a very lively street. The waiters were running everywhere and bumping into people and putting dishes on our table that we hadn’t ordered! Apparently, this is a common tourist trap in Türkiye. The waiters will offer you food on your table, and if you don’t want it they will take it back. This would never fly in the US. It is against the code to re-serve food that has already been given to another patron. This was the first of many law differences that I noticed between the US and Türkiye."
    },

    // ── LISBON DAY 2 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Istanbul Day 2: Guided Walking Tour + Bosphorus Boat"
    },
    {
      type: "photo-left",
      src: turkishBreakfast,
      caption: "Fueling up with a massive, traditional Turkish breakfast spread",
      text: "Saturday morning began with Abby and I splitting a Turkish breakfast. Typically this includes meats, eggs, and bread with lots of sauces. Then, we started our guided walking tour of the old town with Yuma’s from Türkiye’s capital Ankara. During class, my MENA teacher half-jokingly noted that Türkiye officially requested their English name to be changed because of unwanted search engine results after typing in Thanksgiving’s main entree. So, I’ll use the country’s requested name in this newsletter."
    },
    {
      type: "photo-right",
      src: hagiaSophia,
      caption: "Standing before the architectural marvel of the Hagia Sophia",
      text: "We started out with a background on all those mosques that we saw the day before. First, the Hagia Sophia was originally constructed as a church in 6th century by the Greeks because they wanted to create a location for the head of the orthodox Christians. In the 16th century, it was converted to a mosque and minarets were added as a necessity for the call to prayer. Only Sultans, his mother, or his wife can make a mosque with more than one minaret. In 2020, it was converted into a museum and now it’s a mosque again."
    },
    {
      type: "photo-left",
      src: blueMosque,
      caption: "Admiring the grand interiors and blue carpets of the Blue Mosque",
      text: "After covering our hair and taking off our shoes, we were allowed inside the Blue Mosque, nick-named after the color of its carpeting. This mosque also had Christian origins, but its stain glass windows of Jesus and Mary are now covered. During my visit, I learned about some of the customs Muslims follow when praying in a mosque. Firstly, you must be clean and wash your hands before you pray. In the doorway, there was a chain hanging at eye level to force people bow down upon entry. When praying in the mosque, you must point towards the direction of Mecca, Saudi Arabia because it’s where the Muslim prophet Mohammed gained popularity. Different from the Christian Sabbath, Muslims are required to go to the mosque at noon on Fridays. Additionally, Muslims are supposed to secretly donate 2.5% of their money every year."
    },
    {
      type: "paragraph",
      content: "There are separate sections for men and women to pray in the mosques. Men and women are separated in other aspects of life in Türkiye as well, including at the hair salon. Although I guess this makes sense since because some sects of Islam don’t permit women to show their hair to men. We asked our tour guide about Muslim women covering their hair, and he discussed the different interpretations of the Quran. He also joked that his sister never used to cover, but now does when she has a bad hair day."
    },
    {
      type: "photo-right",
      src: grandBazaar,
      caption: "Navigating the vibrant, endless corridors of the Grand Bazaar",
      text: "Next we walked through the Grand Bazaar, an indoor shopping market with over 4000 stalls of sweets and spices, rugs, scarves, jewelry, purses, lamps, clothes, and more. Sounds like a college girls dream, right? Wrong. It was all dupes. This is another thing that would never be permitted at this scale in the US. In Spain, there are a lot of Moroccan street venders that sell designer dupes, but they quickly pull up their items into a sheet-bag contraption and run when the police come. Another interesting stand in the Grand Bazaar was the gold exchange. Because the value of Turkish Lira is so unstable, locals will exchange their cash for gold if they are saving for a big purchase. This way, they can exchange their gold for cash without having lost money if the currency lost value."
    },
    {
      type: "photo-left",
      src: bosphorusCruise,
      caption: "Relaxing on our sunny afternoon cruise down the river",
      text: "After all this walking and talking and learning, Alessandra and I were exhausted so we took a nap. When we woke up, we took a long, stressful walk through the Grand Bazaar to our $4 river cruise. We were on the Bosphorus boat for 2 hours playing cards, and we even got a free snack too! Afterwards, we went to dinner across the Halic river at a local Turkish spot. The server just kept bringing us tea after we ate too! The food was phenomenal and so cheap. However, we played Pictionary at this Irish Bar, and that was so expensive. At first I was shocked because beer and wine are very cheap in most European countries, but it makes sense for Türkiye because Muslims are prohibited from drinking by the Quran."
    },
    {
      type: "paragraph",
      content: "Alessandra, Abby, and I spent the entire trip stimming the word Bosphorus. We came up with alliterations and creative rhymes every time we saw the river. The word of the trip became Bosphorus and now its probably my new favorite word. Its very fun to say you should try it."
    },

    // ── ISTANBUL DAY 3 ───────────────────────────────────────────────
    {
      type: "callout",
      content: "Istanbul Day 3: Asia Day!!!"
    },
    {
      type: "photo-right",
      src: asianSideFerry,
      caption: "Taking the ferry across the continental border to Asia",
      text: "On Sunday morning, I went to Asia for the first time ever! After eating Menemen, a popular tomato egg dish, at a breakfast place near our stay, we took the ferry to Asia. We started walking around in the neighborhood Kadikoy, still touristy but less so than the old part of Istanbul on the European side. We ate ice cream and went into this used bookstore market with tons of stalls, where I haggled for books. Then, we walked up and down the streets, popping into cute stores along the way."
    },
    {
      type: "photo-left",
      src: turkishPide,
      caption: "Trying fresh almond-shaped Pide pizza in Uskudar",
      text: "Afterwards, we bussed to a new neighborhood Uskudar to explore the shops and eat Pide, a Turkish-style almond shaped pizza! Unfortunately, there were no gluten free options around, so we went to another neighborhood for Alessandra to find food. After stopping at a few restaurants including a very local restaurant where this grandma was cooking all the food and her friends kept walking into the kitchen, we gave up and went to a Hammam. This is an enjoyable Turkish bath with a scrubbing and massage (somehow also pretty cheap). Genuinely so much dead skin came off of me it was concerning. Then, we found Alessandra some food that she could eat! And we went to a couple desert stores where they gave us baklava for free and ice cream for like 30 cents it was awesome!"
    },

    // ── ISTANBUL DAY 4 ───────────────────────────────────────────────
    {
      type: "callout",
      content: "Istanbul Day 4: New Neighborhood Balat"
    },
    {
      type: "photo-right",
      src: balatNeighborhood,
      caption: "The colorful structures and dynamic streets of Balat",
      text: "Our last day began with a breakfast that wasn't really a breakfast. Abby and I shared Borek, a spinach pastry thing, and Manti, a dumpling with yogurt sauce that was recommended by my Hammam lady. We walked around the Balat neighborhood for the rest of the morning before catching our flight to our home base in Madrid. I knew immediately by the level of noise on that plane that I was back with the Spanish!"
    },
    {
      type: "paragraph",
      content: "The entire time I was in Istanbul, I felt very safe. The Turks were more than welcoming to us and no one batted an eye when we told them we were from the United States. A couple of times, we got nervous and told people we were from Canada. No one questioned us. I was a bit nervous since we were just three girls, but it was absolutely fine. Also, we always seem to find ourselves in some coincidental law enforcement run-ins, and fortunately we were quite removed from this week's incident. As we were walking down the street, we witnessed a policeman from his car window shouting at the car in front of it through a megaphone in an attempt to pull it over. It did not seem like it was going well for the policeman."
    },
    {
      type: "paragraph",
      content: "Istanbul was so so cool! I know I say this about every place I travel, but I truly love them all. However, I see the same fruit stand on like every corner of every street in every city so part of me is starting to believe that all cities are the same just with a few subtle differences. I've been daydreaming about the gorgeous day in Sintra, Portugal surrounded by gardens and trees and castles and rivers. I need to go back immediately. I can't wait to frolic in the outdoors of Ireland next weekend!\n\nAlso, I'm getting a bit exhausted from all of the travel and lowkey I keep getting sick every weekend. But, if you know me at all you know that I probably won't slow down because I want to make the most of my time here! I promise I'll take a day or two to rest while I'm in Madrid this week.\n\nToday especially I am missing my family and friends back home in the US!! I love Europe and my community here, but I would give anything to lay in Grace and Sabrina's dorm beanbag or squeeze my bigs or run into everyone I've ever met on the Local Java porch or do homework in the EBI common rooms or listen to country music at Losers or laugh endlessly with all of cliffjumpers🧗‍♀️🌊❤️ Miss you all!!!"
    },

    // ── BONUS PHOTO GALLERY ──────────────────────────────────────────
    {
      type: "three-photos",
      photos: [
        { src: gallery1, caption: "Beautiful spice colors in local markets" },
        { src: gallery2, caption: "Stunning Turkish lanterns lining the Bazaar paths" },
        { src: gallery3, caption: "Ferry crossings framing the horizon line" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: gallery4, caption: "Traditional geometric window patterns" },
        { src: gallery5, caption: "Historic structures throughout Sultanahmet" },
        { src: gallery6, caption: "Sweet stops for fresh authentic Baklava" }
      ]
    },

    {
      type: "paragraph",
      content: "XOXO,\nVittoria"
    }
  ]
};

export default week9;