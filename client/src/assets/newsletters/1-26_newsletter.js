/**
 * Week 3 Newsletter
 *
 * NEW REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import canal from '../newsletter photos/1-26 newsletter photos/IMG_5832.jpg';
import rollerblades from '../newsletter photos/1-26 newsletter photos/IMG_5767.jpg';
import apartmentHangout from '../newsletter photos/1-26 newsletter photos/IMG_2520_Original.jpg';
//import webTechEvidence from '../newsletter photos/1-26 newsletter photos/Screenshot 2026-01-20 website.jpg';
import canalTour from '../newsletter photos/1-26 newsletter photos/IMG_0181.jpg';
import hoppyHouse from '../newsletter photos/1-26 newsletter photos/IMG_5840.jpg';
import nextHouseHostel from '../newsletter photos/1-26 newsletter photos/IMG_5889.jpg';
import nyhavnCanal from '../newsletter photos/1-26 newsletter photos/IMG_0294.jpg';
import oldIrishPub from '../newsletter photos/1-26 newsletter photos/IMG_5845.jpg';
import nationalMuseum from '../newsletter photos/1-26 newsletter photos/IMG_5919.jpg';
import vikingExhibit from '../newsletter photos/1-26 newsletter photos/IMG_5914.jpg';
import kachingExhibit from '../newsletter photos/1-26 newsletter photos/View recent photos.jpg';
import slotPhoto1 from '../newsletter photos/1-26 newsletter photos/IMG_5865.jpg';
import slotPhoto2 from '../newsletter photos/1-26 newsletter photos/IMG_0041.jpg';
import slotPhoto3 from '../newsletter photos/1-26 newsletter photos/IMG_5848.jpg';
import slotPhoto4 from '../newsletter photos/1-26 newsletter photos/IMG_0128.jpg';
import slotPhoto5 from '../newsletter photos/1-26 newsletter photos/IMG_0108.jpg';
import slotPhoto6 from '../newsletter photos/1-26 newsletter photos/IMG_0091.jpg';

const week3 = {
  id: 3,
  title: "Week 3: Trip to Copenhagen, Denmark",
  date: "January 26, 2026",
  slug: "copenhagen",

  // Used on the newsletter landing page preview card
  previewDescription: "A wild morning on rollerblades, a playground hostel, and dodging hamster wheels at the National Museum. Welcome to Copenhagen.",

  // Filter tags shown on the landing page
  tags: ["Travel", "Copenhagen", "Weekend"],

  sections: [
    {
      type: "paragraph",
      content: "Welcome back to week 3 of my study abroad newsletter! During the week, I attended class and spent time with friends out and about in Madrid. On the weekend, I went to Copenhagen where I had my first hostel experience. Thank you all for your kind responses- this newsletter has been a great way to stay connected to my family and friends back home. I hope you enjoy this week’s edition!"
    },

    // ── WEEK HIGHLIGHTS ───────────────────────────────────────────────
    {
      type: "callout",
      content: "Highlights from the Week"
    },
    {
      type: "photo-left",
      src: rollerblades,
      caption: "Trying out the closet rollerblades in El Retiro",
      text: "Late Sunday night, my roommate Alessandra and I found rollerblades in our host family’s closet. Of course, we went to El Retiro that next morning before our classes to try them out. It was pretty obvious to that I’d never been rollerblading before. I haven’t learned to stop yet, so I fell down to avoid hitting a man as I was skating down a hill. Nevertheless, I had a great time."
    },
    {
      type: "photo-right",
      src: apartmentHangout,
      caption: "Hanging out at Baylie and Julia's apartment",
      text: "On Monday, Alessandra, Baylie, Julia and I went to the most notable study abroad bar crawl in the city. The lines were long so we went ditched it and hung out at Baylie and Julia’s apartment. On Tuesday and Thursday, I got lunch with Maya, one of my close friends from school. I spent Wednesday night at Dubliners with many friends from Vanderbilt. Throughout the week, I ate dinner with my host family while discussing in Spanish everything from favorite TV shows to European politics to international travel."
    },
    {
      type: "photo-left",
      src: nationalMuseum,
      caption: "Web Technologies 'photo evidence'",
      text: "My favorite class this week is my Middle East and North Africa course. We learned about the origins of Islam and the Sunni/Shiite conflict. Our teacher makes is a good storyteller and my classmates have lots of differing opinions. I just sit back and watch. My least favorite class is Web Technologies. It’s so boring. I used to teach webdev workshops to middle and high school students who were first-time coders, and they could create a better website in 30 minutes than what we’ve put together in four 1.5 hour classes. Photo evidence to the left."
    },

    // ── COPENHAGEN DAY 1 ──────────────────────────────────────────────
    {
      type: "callout",
      content: "Copenhagen Day 1- Canal Cruise!"
    },
    {
      type: "photo-right",
      src: canalTour,
      caption: "Cruising past the Royal Danish Navy site",
      text: "Before the sun rose on Friday, Alessandra and I took the metro to the airport. We met up with Abby, Alessandra’s best friend from home, and after a short connection in Munich, we arrived in Copenhagen. We met up with Jayne, a close friend from Vanderbilt, got a quick bite to eat at a cafe, and started our canal tour. Thankfully, it was an indoor boat because it was frigid. We rode past the National Library, Copenhagen Opera House and Amalienborg Palace. We saw the Little Mermaid, the second most disappointing tourist attraction in the world. The tour took us past the Peder Skram at the Royal Danish Navy's site."
    },
    {
      type: "photo-left",
      src: hoppyHouse,
      caption: "Euchre happy hour at Hoppy House",
      text: "After the tour, the sun set so our site seeing for the day was complete. Alessandra, Abby, Jayne and I stumbled upon Hoppy House, a small pub with playing cards. We enjoyed happy hour while I taught them how to play Euchere, a Riedling family favorite introduced to us by cousin Tony during the Covid-19 pandemic. We enjoyed a late dinner at a pizza place. We said good night to Alessandra and Abby because they slept in their friend’s dorm room."
    },
    {
      type: "photo-right",
      src: nextHouseHostel,
      caption: "Lobby vibes at Next House hostel",
      text: "Jayne and I stayed in Next House, a hostel near the city center. This was not a normal hostel- it was more like a playground for young adults. The hostel was cheap, very clean with lots of amenities, and there was a lively lobby for hanging out. Jayne and I met two girls from New Zealand who provided lots of Europe recommendations. We slept in a room with 4 others who we never spoke to. Overall it was a great experience, but I don’t expect other hostels to be this nice."
    },

    // ── COPENHAGEN DAY 2 ──────────────────────────────────────────────
    {
      type: "callout",
      content: "Copenhagen Day 2- Frederiksborg Slot"
    },
    {
      type: "photo-left",
      src: nyhavnCanal,
      caption: "The stunning Renaissance architecture of Frederiksborg Slot",
      text: "In the morning, Jayne and I ate a hearty breakfast at Cafe Apropos before training to Frederiksborg Slot. This castle was built in the early 17th century and housed the Danish royalty. It was gorgeous. I instantly fell in love with the Renaissance architecture and craftmanship of the great room."
    },
    {
      type: "photo-right",
      src: nyhavnCanal,
      caption: "The iconic colorful buildings of Nyhavn",
      text: "We trained back into the city center, and met up with Alessandra and Abby on Nyhavn, the most Instagramed canal in Copenhagen. Following a recommendation from my friend Addi, we ate the most delicious cardamom buns at the bakery Juno. We wondered around the city for a bit longer and tried to go to the Happiness Museum, but they closed early. So we headed to the meat packing district for dinner at Magasa Chinese tapas. Jayne and I took a quick nap at our hostel, and then invited Alessandra and Abby over to pregame in the lobby. Denmark’s Somersby apple cider is phenomenal, but nothing beats an Angry Orchard on the Kid Rocks rooftop."
    },
    {
      type: "photo-left",
      src: oldIrishPub,
      caption: "Late night discussions at The Old Irish Pub",
      text: "To end the night, Alessandra, Abby, Jayne and I went to The Old Irish Pub. We met four guys from Faroe Islands, a colony of Denmark. They spoke Faroese, Danish, Norwegian, and English. It was very interesting to talk to them because they shared their opinions on US/Greenland/Denmark relations. Apparently, they are worried that President Trump will target the Faroe Islands next. At the same time, they want freedom from Denmark so they can be an independent nation."
    },

    // ── COPENHAGEN DAY 3 ──────────────────────────────────────────────
    {
      type: "callout",
      content: "Copenhagen Day 3- National Museum of Denmark"
    },
    {
      type: "photo-right",
      src: nationalMuseum,
      caption: "Exploring colonization exhibits at the Nationalmuseet",
      text: "On our final day in Copenhagen, Jayne and I packed our stuff and ate breakfast at a cafe nearby. Then, we headed to the Nationalmuseet where we met up with Alessandra, Abby, and their friend from home Madeline. This museum was definitely the highlight of the trip. I paid special attention to the section about Denmark’s colonization because Greenland is quite prevalent in the news right now and we’ve been talking about it in my Cold War course. I didn’t realize that Denmark had so many colonies."
    },
    {
      type: "photo-left",
      src: vikingExhibit,
      caption: "The innovative wireless audio setup in the Viking exhibit",
      text: "I loved the Viking section of the museum, especially the temporary exhibit about the Viking sorceresses. They are called Völva, which means staff bearer, and were feared but respected back in the Viking Age. The exhibit required special wireless headphones that used orange glowing cables in the exhibit to wirelessly connect to headphones that auto-play audio when you walk into the next room. I think this is such an innovative way to share history."
    },
    {
      type: "photo-right",
      src: kachingExhibit,
      caption: "Running the hamster wheel to earn pizza delivery cash",
      text: "The highlight of the museum was the “Ka-ching” exhibit, where we tried to earn 1 million DKK. We were given cards and a randomly allocated “inheritance” to wager on a game show about the Denmark economy or to invest in the Denmark stock market. If you lost all of your money, you could earn more by delivering pizzas by running in a hamster wheel. We were having so much fun we almost forgot about our flight. I’m not sure how much I ended with, but I made a lot in the stock market and lost even more on the game show."
    },

    // ── BONUS GALLERY ────────────────────────────────────────────────
    {
      type: "callout",
      content: "More photos of Frederiksborg Slot because it is so pretty!"
    },
    {
      type: "three-photos",
      photos: [
        { src: slotPhoto1, caption: "Frederiksborg view 1" },
        { src: slotPhoto2, caption: "Frederiksborg view 2" },
        { src: slotPhoto3, caption: "Frederiksborg view 3" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: slotPhoto4, caption: "Frederiksborg view 4" },
        { src: slotPhoto5, caption: "Frederiksborg view 5" },
        { src: slotPhoto6, caption: "Frederiksborg view 6" }
      ]
    },

    // ── WRAP UP ──────────────────────────────────────────────────────
    {
      type: "paragraph",
      content: "Overall, Copenhagen was a great first trip of my study abroad experience. It is very prevalent because of Greenland’s presence in the news, and we even heard a protest in the street, so It was an interesting time to visit. However, it was cold and expensive, which limited the amount of things we could do. I was surprised how nice everything was, even the streets and public facilities, compared to Madrid. And I was shocked that tap water isn’t always free in Copenhagen!"
    },
    {
      type: "paragraph",
      content: "I hope you enjoyed this week's edition of my study abroad newsletter!! Next weekend, Alessandra and I are traveling to Berlin for a trip inspired by the WWII discussions in our Cold War course. If you have any recommendations, please let me know!\n\nLove,\n\nVittoria"
    }
  ]
};

export default week3;