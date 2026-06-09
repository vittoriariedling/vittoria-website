/**
 * Week 15 Newsletter (Trip to Malta)
 * Note: Keeping consistent chronological numbering sequential to last week's code (Week 15 structure)
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import alessandraBirthdayBar from '../newsletter photos/4-21 newsletter photos/IMG_4931.jpg';
import tkoBirthdayTacos from '../newsletter photos/4-21 newsletter photos/IMG_0963.jpg';
import rooftopDrinksGroup from '../newsletter photos/4-21 newsletter photos/IMG_5094.jpg';
import mondaysChampagneTable from '../newsletter photos/4-21 newsletter photos/IMG_5101.jpg';
import sliemaAirbnbBalcony from '../newsletter photos/4-21 newsletter photos/IMG_8714.jpg';
import havanaClubSliema from '../newsletter photos/4-21 newsletter photos/IMG_4617.jpg';
import boatLowerDeck from '../newsletter photos/4-21 newsletter photos/IMG_0851.jpg';
import boatTopDeckViews1 from '../newsletter photos/4-21 newsletter photos/IMG_0868.jpg';
import boatTopDeckViews2 from '../newsletter photos/4-21 newsletter photos/IMG_0909.jpg';
import sunburntLagoonHiding from '../newsletter photos/4-21 newsletter photos/IMG_0955.jpg';
import taKolinaPasta from '../newsletter photos/4-21 newsletter photos/IMG_5140.jpg';
import vallettaCapitalWalk from '../newsletter photos/4-21 newsletter photos/IMG_5124.jpg';
import rockyBeachTanning from '../newsletter photos/4-21 newsletter photos/IMG_4636.jpg';
import sliemaPromenadeWalk from '../newsletter photos/4-21 newsletter photos/IMG_0997.jpg';

// Extra miscellaneous beach, architecture, and flight snapshots for the bottom gallery grid
import galleryBeach1 from '../newsletter photos/4-21 newsletter photos/IMG_5157.jpg';
import galleryBeach2 from '../newsletter photos/4-21 newsletter photos/IMG_5159.jpg';
import galleryCity1 from '../newsletter photos/4-21 newsletter photos/IMG_7530.jpg';
import galleryCity2 from '../newsletter photos/4-21 newsletter photos/IMG_8398.jpg';
import galleryGroup1 from '../newsletter photos/4-21 newsletter photos/IMG_8411.jpg';
import galleryGroup2 from '../newsletter photos/4-21 newsletter photos/IMG_8465.jpg';

const week15 = {
  id: 15,
  title: "Week 15: Trip to Malta",
  date: "April 21, 2026",
  slug: "malta",

  // Used on the newsletter landing page preview card
  previewDescription: "Ringing in Alessandra's 21st birthday with a packed week in Madrid, followed by a serene, sun-drenched escape to Malta. Complete with homemade meals, island boat tours to the Blue Lagoon, and exploring the cultural melting pot of Valletta.",

  // Filter tags shown on the landing page
  tags: ["Madrid", "Malta", "Sliema", "Valletta", "Blue Lagoon", "Travel"],

  sections: [
    {
      type: "paragraph",
      content: "Welcome back!! This week was another epic week in Spain and traveling in Europe. On Monday, I celebrated Alessandra’s 21st birthday! My week was filled with lots of assignments, exams, and papers, which hindered my ability to do anything during the week, but I finished everything in time to leave for Malta on Friday. The weekend was so relaxing and serene. This provided a lot of time for reflection, and I am truly so grateful to have the privilege to study abroad this semester."
    },

    // ── HIGHLIGHTS FROM THE WEEK ─────────────────────────────────────
    {
      type: "callout",
      content: "Highlights from the Week"
    },
    {
      type: "photo-left",
      src: alessandraBirthdayBar,
      caption: "Lorenzo celebrating Alessandra with a custom 21 cocktail presentation",
      text: "Sunday night, after saying goodbyes to my family, Alessandra and I ventured to our favorite bar in Madrid to ring in her 21st. When we arrived, we were greeted by Lorenzo, our Italian bartender friend that’s helping us learn Spanish. Alessandra and I talked for hours (per usual) telling stories from our childhood, gossiping, sharing our goals, and deciding that in 20 years together we will bring our own families back and tell them about our incredible times running around Madrid. One of my favorite things to do on my friends birthday is to ask them my “birthday questions”, a tradition that I started a few years ago to get to know my family, friends, and occasionally a rando on Broadway. So of course, I had to ask Alessandra those questions and I even came up with some more that I asked her throughout the next day too. At midnight, Lorenzo played “Birthday Bitch”, the song that began Alessandra and I’s friendship exactly two years before when I begged the frat formal DJ to play it for her birthday. He also brought out one of Alessandra’s favorite drinks and drew a 21💜 on it."
    },
    {
      type: "photo-right",
      src: tkoBirthdayTacos,
      caption: "Grabbing our mandatory birthday 1€ tacos and spicy margs at TKO Taco",
      text: "In the morning, we went on a walk around Retiro park, continuing the birthday questions as we saw the peacocks and beautiful rose garden. I went to class, took an exam, and hurried back home for the evening’s festivities. Alessandra and I got dinner at TKO taco, the best one euro taco place, and shared a spicy marg. Then we met up with a group of her closest friends for drinks at an indoor rooftop bar."
    },
    {
      type: "photo-left",
      src: rooftopDrinksGroup,
      caption: "Rooftop birthday cheers with the absolute best sorority crew in Madrid",
      text: "A lot of the attendees were girls in our sorority, who are some of the most supportive and funny people I know. Going into college I was quite nervous about rushing, but I’m so lucky to have joined a sorority with girls that I enjoy spending time with. Also, the waiters that night were hilarious, played great music, and gave us great Madrid recs."
    },
    {
      type: "photo-right",
      src: mondaysChampagneTable,
      caption: "Skipping lines and celebrating with VIP champagne tables at Mondays",
      text: "Afterwards, Alessandra, Carly, Abby, and I went to Mondays, the go-to club for study abroad students on the day of its namesake. Abby’s friend knew someone at the club, so we skipped the line and received a table and a bottle of champagne. We danced all night, and I surprisingly had a lot of fun. (I had been to Mondays once before and didn’t really enjoy it.) Unfortunately, our night took a turn for the worse when we realized Carly’s phone got stolen. There wasn’t really much we could do, so we made sure Carly made it home safe and then we went home as well."
    },

    // ── MALTA DAY 1 ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Malta Day 1- Sliema!"
    },
    {
      type: "photo-left",
      src: sliemaAirbnbBalcony,
      caption: "Taking in the coastal views right from our cozy Sliema balcony setup",
      text: "Friday morning, Alessandra and I flew to Malta. When we arrived at our Airbnb, we were greeted by a sweet Maltese lady who showed us around the place. She informed us that she was renting out this unit for the first time since a messy Spanish boy destroyed the place a couple years ago. She was kind enough to direct us to the nearest beach, and even gave us some fruit and water to start out our stay. Equipped with a gorgeous balcony and modest kitchen, the place was perfect for two girls on a beach vacation. The only downside was the pigeons that surrounded us every time we entered and moths that flew in when we opened the balcony door. Honestly, I can’t complain because at least we weren’t staying in a hostel in Berlin with that Turkish roommate who was constantly smoking on his tree stump."
    },
    {
      type: "photo-right",
      src: havanaClubSliema,
      caption: "Wandering through the streets before a wild night out at Havana Club",
      text: "In the afternoon, we went to the store to buy groceries for the weekend. We decided we’ve been eating out a lot, and we had this fully stocked new kitchen, so we wanted to cook all meals besides one or two at the place. After, we meandered around town to the promenade along the beach. We saw this gorgeous bar that has the cheapest happy hour drinks we have seen all abroad, so we watched the sunset on their balcony. At night, we rallied and went to Havana Club, where we saw a bunch of the KA boys and a lot of creepy dudes. This one 35-year-old guy was dressed up as a Queen and I could have sworn he was grabbing at my purse. It was such weird vibes."
    },

    // ── MALTA DAY 2 ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Malta Day 2- Comino and Blue Lagoon"
    },
    {
      type: "photo-left",
      src: boatLowerDeck,
      caption: "The chaotic, crowded middle tier of our island commuter ferry",
      text: "On Saturday, I mean Friday, Alessandra and I loaded up on a boat with all of these tourists. Unfortunately, we didn’t board early, so we were stuck on the middle level, which was very tumultuous. One Michigan girl started having a panic attack, and when an Indian baby started throwing up, we knew we had to move up to the top level. So we sat in an opening on the floor, where we got to see all of the towns alongside the coast of Malta as we were cruising to our first stop of the day."
    },
    {
      type: "three-photos",
      photos: [
        { src: boatTopDeckViews1, caption: "Escaping to the open air on the top floor floor space" },
        { src: boatTopDeckViews2, caption: "Watching the spectacular historic towns glide by along the cliffs" },
        { src: sunburntLagoonHiding, caption: "Desperately hiding away from the scorching sun at the Lagoon" }
      ]
    },
    {
      type: "paragraph",
      content: "First we stopped in the water at Comino, where we laid in the sun and began our three day tanning bender. After an hour, we went to the famous Blue Lagoon, an area with spectacular (but admittedly uncomfortable) rocky beaches. We stayed there for a while, then wandered around the kiosks before returning to Sliema for the night. The first two photos above were taken after Alessandra and I moved to the top level of the boat. The last one is a photo of me hiding from the sun at the Lagoon- I unfortunately got a sunburnt :("
    },
    {
      type: "photo-right",
      src: taKolinaPasta,
      caption: "Splurging on a delectable seafood pasta banquet at Ta' Kolina",
      text: "Alessandra and I decided that our one meal out would be at a Maltese restaurant called Ta' Kolina. I ate a seafood pasta which was delicious. The entire time, we were trying to figure out the countries that have the greatest influence on the Maltese culture and population. Malta was a British colony, so they spoke English well, used the British wall sockets, and drove on the left side of the road. Geographically, Malta is south of Sicily, north of Libya, west of Tunisia, and east of Greece. With Arabic foundations and grammar structure, Maltese is a language that uses the Latin script and blends vocabulary influences from Sicilian/Italian, English, and French. When I was walking around, I heard so many different languages. I think Malta may be more of a melting pot than the United States!"
    },

    // ── MALTA DAY 3 ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Malta Day 3- Valletta"
    },
    {
      type: "photo-left",
      src: vallettaCapitalWalk,
      caption: "Marching towards the majestic historic entrance gates of Valletta",
      text: "Saturday morning began with a pepper and cheese omelette, some fruit, and a walk to Malta’s capital. The stretch between Sliema and Valletta reminded me a bit of St. Pete Beach, an area that the Riedling family frequents because my grandparents' beach condo is there. When we arrived in Valletta, we walked through an area where locals filled pubs along the Easter decorated streets for a soccer game. Then, we made our way to the old town, which was beautiful but filled with my least favorite crowd, the tourists. (I’m a hypocrite I know.) We wandered around parks, walked by the shore, and saw a lot of statues."
    },
    {
      type: "photo-right",
      src: rockyBeachTanning,
      caption: "Basking on the flat limestone rocky shores back in Sliema",
      text: "When we got back to Sliema, we went to our Airbnb to make lunch. Alessandra picked out this phenomenal paprika cheddar cheese that we put on ham sandwiches, which complimented the spicy hummus and peppers well. In the afternoon, we tanned at the rocky beaches again. In the evening, we went to some beach club, which again had so many nationalities represented. We bopped around to killer house music and made some friends."
    },

    // ── MALTA DAY 4 ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Malta Day 4- More Beach Walks in Sliema"
    },
    {
      type: "photo-left",
      src: sliemaPromenadeWalk,
      caption: "Enjoying an early morning breeze along the endless coastal promenade",
      text: "On Monday, we decided to skip class because we hadn't used our built in \"free skips\" and the flights were significantly cheaper. We woke up, made breakfast, and went for a long walk on the promenade. We found a seat, sat in chairs and talked about life. Then, we went on a hunt for a postcard to add to Alessandra's collection. Then, we went back to our Airbnb with the goal of finishing everything in our fridge. We packed our typical airport sandwich, and time got away from us so we had to run with our stuffed backpacks to catch the bus."
    },

    // ── FOOTER & GALLERY GRID ───────────────────────────────────────
    {
      type: "paragraph",
      content: "Wow this week was full of more adventures around town and on the beach. Alessandra's favorite phrase of the trip, \"I'm built for the island life\", is so so true. I'm glad we are in the sunny part of the semester because it makes me appreciate everything so much more. I can't believe study abroad is real and Vanderbilt is literally funding my weekend trips. (I recently ran out of my stipend though, so I have to use my own money now.) As always, thank you for tuning into what is probably the most interesting 5 months of my life! I'll be reporting next weekend from Malaga, Spain- let me know if you have any recommendations!\n\nXOXO,\nVittoria\n\nHere is a compilation of extra beach views, historical corners, and travel snaps from our weekend in Malta:"
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryBeach1, caption: "Crystal blue ocean horizons spanning out from Sliema" },
        { src: galleryBeach2, caption: "Watching waves crash against the flat limestone coast" },
        { src: galleryCity1, caption: "Steep alleys and signature enclosed balconies of Valletta" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryCity2, caption: "Historic stone statues and monuments in the capital gardens" },
        { src: galleryGroup1, caption: "Grabbing pre-flight morning coffee on our final island day" },
        { src: galleryGroup2, caption: "Stuffed backpacks in tow, sprinting towards our airport shuttle" }
      ]
    }
  ]
};

export default week15;