/**
 * Week 10 Newsletter (Ireland)
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import oldPhotoHelen from '../newsletter photos/3-16 newsletter photos/IMG_7189.jpg';
import cliffsOfMoher from '../newsletter photos/3-16 newsletter photos/IMG_0032.jpg';
import irishPubLunch from '../newsletter photos/3-16 newsletter photos/IMG_0037.jpg';
import galwayStreets from '../newsletter photos/3-16 newsletter photos/IMG_0039.jpg';
import templeBarDistrict from '../newsletter photos/3-16 newsletter photos/IMG_0042.jpg';
import trinityCollege from '../newsletter photos/3-16 newsletter photos/IMG_1665.jpg';
import spiceBagQuest from '../newsletter photos/3-16 newsletter photos/IMG_1666.jpg';
import belgiumAirportWaffle from '../newsletter photos/3-16 newsletter photos/IMG_1679.jpg';

// Extra gallery photos from the extensive provided list
import gallery1 from '../newsletter photos/3-16 newsletter photos/IMG_3349_Original.jpg';
import gallery2 from '../newsletter photos/3-16 newsletter photos/IMG_3374_Original.jpg';
import gallery3 from '../newsletter photos/3-16 newsletter photos/IMG_3419_Original.jpg';
import gallery4 from '../newsletter photos/3-16 newsletter photos/IMG_3432_Original.jpg';
import gallery5 from '../newsletter photos/3-16 newsletter photos/IMG_3441_Original.jpg';
import gallery6 from '../newsletter photos/3-16 newsletter photos/IMG_4017.jpg';

const week10 = {
  id: 10,
  title: "Week 10: Trip to Ireland!",
  date: "March 16, 2026",
  slug: "dublin-galway-and-cliffs-of-moher",

  // Used on the newsletter landing page preview card
  previewDescription: "Celebrating my 21st birthday with hometown reunions in Madrid, followed by a wild St. Patrick's Eve weekend traversing the breathtaking Cliffs of Moher, Galway, and the packed streets of Dublin.",

  // Filter tags shown on the landing page
  tags: ["Ireland", "Dublin", "Galway", "Cliffs of Moher", "Birthday", "Travel"],

  sections: [
    {
      type: "paragraph",
      content: "Happy Saint Patrick’s Day eve! This weekend I traveled to Ireland for all the festivities. I loved the town feel of Dublin and their genuinely kind locals. Every Irish person we met went out of their way to help us. During the week, I celebrated my 21st birthday and got to reunite with two incredible visitors as well!! It was a very memorable week for sure, but once again I did an awful job documenting with photos. Thanks Baylie, Jayne, and Alessandra for the flicks!"
    },

    // ── HIGHLIGHTS FROM THE WEEK ─────────────────────────────────────
    {
      type: "callout",
      content: "Highlights from the Week"
    },
    {
      type: "paragraph",
      content: "By far my favorite part of this week was seeing two of my friends that were visiting Madrid. On Monday night, I saw Helen, a friend in the grade below me at Vanderbilt who I have a lot of my CS classes with, and is my grand little in my tech frat. On Sunday, I walked around Madrid with Grace, my closest friend from DC last summer, and some of her friends from Clemson. I love reuniting with friends from the States because it makes me feel more connected to my community back home!"
    },
    {
      type: "photo-left",
      src: oldPhotoHelen,
      caption: "An old throwback photo with Helen (new pics still in transit!)",
      text: "My birthday festivities began with a reunion with a very special visitor Helen! She was staying at Vandy friends Tess and Izzy's apartment for the weekend, so they invited Alessandra and I over for dinner Monday night. Any late night activities are difficult to coordinate with my host family’s dinner time, so this was a perfect resolution. After the dinner, I was surprised with a cake from my friends right before the clock struck midnight! Then we went back to the same discoteca from last week. There were lots of Vanderbilt people there (a crazy haphazard mix, especially with the spring break visitors). Unfortunately, it was way too crowded with lots of shoving so it wasn’t super enjoyable but I liked seeing everyone."
    },
    {
      type: "paragraph",
      content: "I am a huge believer in birthdays. I love celebrating my birthday, and I love celebrating other people’s birthdays even more. I love calling my people that are too far away on their birthday. I love celebrating through acts of service, like making someone breakfast or running errands for them. I love when people are surrounded by the people who love them most on their birthday. I love traditions surrounding birthdays, especially the Riedling family birthday donuts. I love watching other people light up after giving them a thoughtful gift. Most of all I love writing birthday cards for my loved ones, a trait I inherited from my dad (aka Preacher Shawn) and his mile long birthday cards."
    },
    {
      type: "paragraph",
      content: "On my birthday this year, I was lucky enough to receive all of of these things. Thank you for all of the birthday texts, FaceTimes, and calls! And shoutout to my roommate Alessandra who made my bday extra special!! During the day, I went to school and did some work. I really wanted to go biking, but I unfortunately didn’t have time :/ At night, I celebrated with some friends at dinner and went to grab a drink at our favorite bar afterwards. It was a very enjoyable birthday! But, it would have looked a lot different if I was celebrating back at school. Jayne and I decided when we are reunited with all our friends from school, we are going to have a huge joint birthday party for everyone who didn’t get to celebrate their 21st in Nashville."
    },

    // ── IRELAND DAY 1 ────────────────────────────────────────────────
    {
      type: "callout",
      content: "Ireland Day 1- Cliffs of Moher + Galway"
    },
    {
      type: "photo-right",
      src: cliffsOfMoher,
      caption: "Breathtaking (and freezing!) views at the Cliffs of Moher",
      text: "This weekend was filled with a lot of fun and frolicking intertwined with no more than four hours of sleep at a time. On Thursday night, Maya, Baylie, Taylor and I arrived at our Dublin hotel around 2AM and needed to be with our cliffs tour group by 6AM. Almost immediately after getting on the bus in the morning, a guy in the back started vomiting everywhere. Our driver Bo Bo didn’t really know what to do, so he offered his hat and tried to arrange a bus switch. Once we eventually got on the road, Bo Bo lightened the mood by teaching us some Irish slang. Apparently, “what’s the craic?” means “what’s happening?” and paradoxically “gezesus she’s massive” means “she’s beautiful.”"
    },
    {
      type: "photo-left",
      src: irishPubLunch,
      caption: "Escaping the rain to split a comforting Irish beef stew",
      text: "Our first stop on the tour with Baylie, Alessandra, and Jayne was the Cliffs of Moher. Thankfully, the breathtaking cliffs were visible on the day we visited! Regardless, it was still rainy, foggy, and the wind nearly blew me away. So we went inside the visitor center where we ran into girls from my sorority. Next, we bussed to an Irish pub for lunch, where Jayne and I split a beef stew. I always underestimate soup and stews - they are always incredible but usually not my first choice. The Irish stew and Hungarian goulash have inspired me to choose it more frequently."
    },
    {
      type: "photo-right",
      src: galwayStreets,
      caption: "Wandering through the colorful, lively streets of Galway",
      text: "Our last stop of the day was in Galway. I loved the feel of Galway because it reminded me of the small town Stars Hollow. We wandered around and found a pub that had live country music. We boarded our bus, and before I drifted off to sleep again, Bo Bo sang us the best rendition of Rattlin' Bog I’ve ever heard. Throughout the tour, we discovered that Bo Bo likes to RAMBLE stream of consciousness style. Reminiscent of Riedling family Florida trips with Preacher Shawn, Bo Bo was sure to highlight every single thing we passed adding personal advice and anecdotes from his family friend’s cousin’s coworker’s sister-in-law. Despite this, he might have been my favorite guide yet because his dry sense of humor was feckin' hilarious."
    },
    {
      type: "photo-left",
      src: templeBarDistrict,
      caption: "The festive crowds swarming the legendary Temple Bar district",
      text: "Once we arrived back in Dublin, we grabbed a quick dinner before heading to the bars for the night. Paddy’s day is probably the biggest study abroad destination - everyone flocks to Temple Bar for the weekend. I spent most of the night in the Temple Bar area, watching streams of American students dressed in green rush to greet their friends studying in different European cities. The excitement of the reunions moved through the crowd like the twinkling lights zigzagging across the streets. My friends and I once again found ourselves bar hopping with all of the ATOs. I eventually left with Alessandra and Paige for a Mexican restaurant across the street. They went to their hotel, and I went back to find my roommates for the weekend. Eventually we made it back to our hotel where we were hoping to end the night, but this is where our weekend took a turn for the worse."
    },
    {
      type: "paragraph",
      content: "If I have one piece of advice for the sophomores going to Dublin next year it’s this: DO NOT PUT SIX PEOPLE IN A FOUR PERSON HOTEL ROOM. When we returned to our room at night, the hotel had a list of room numbers and the amount of guests staying in each room. It turns out, we were not the first group to minimize the exorbitant cost of Paddy’s weekend hotels by shoving into one room. When we came back as a group of six, the staff kicked the last two out of the hotel. Stranded on the side of the street in cold weather, Maya and Taylor were understandably quite upset. The six of us started calling everyone we knew to find them a place to crash for the night. Eventually, a very inebriated ATO answered his phone. So, they spent their night unable to sleep, laying in between two towels on the kitchen floor of their Airbnb, using their backpacks as pillows, and listening to a guy with food poisoning throw up all night. Once the sun rose, we got them back into the hotel so they could sleep. To my sophomore friends reading this, please do not try to squeeze into hotel rooms, or at least be a little bit more discrete about it than we were."
    },

    // ── IRELAND DAY 2 ────────────────────────────────────────────────
    {
      type: "callout",
      content: "Ireland Day 2: Dublin"
    },
    {
      type: "photo-right",
      src: trinityCollege,
      caption: "Admiring the gorgeous campus of Trinity College Dublin",
      text: "My second day in Ireland began with a cranberry scone and a stroll around Dublin’s neighborhoods with Baylie, Jayne and Sarah. Streets swarmed with green study abroad Americans, we made our way to the beautiful Trinity College. My friends and I decided that it would be an incredible academic opportunity to go there, but we love the college experience at Vanderbilt. Then, we headed to a courtyard to watch the rugby game. I couldn’t tell you who was playing because we sat underneath the TV and played Euchre."
    },
    {
      type: "photo-left",
      src: spiceBagQuest,
      caption: "Finally securing Dublin's notorious late-night spice bag",
      text: "Afterwards, we found spice bags to complete Baylie’s quest of the trip. A spice bag is composed of fries, veggies, and fried chicken mixed with a bunch of Chinese spices. According to Baylie’s friend who studied in Dublin last semester, you can only find it here. Afterwards, we ran into some other ATOs and hung out with them for a bit. Right after we left, my compounding stress from the night before, copious travel, drinking frequency, and extreme lack of sleep hit its peak."
    },
    {
      type: "photo-right",
      src: belgiumAirportWaffle,
      caption: "A essential Belgian waffle pit stop during our airport connection",
      text: "Some may consider it a sin to tap out of the iconic study abroad Dicey’s Beer Garden day in Dublin, but I did it anyway. I went to my hotel and showered and slept, intermittently because my six roommates kept coming back, but it was the best decision I could have made. We got up in the middle of the morning to catch our flight, ate the notorious Belgium waffle during an airport connection in the city it's named after, and finally made it home to Madrid. I can’t wait to catch up on sleep and do absolutely nothing besides attending class, reading books, and walking in El Retiro park."
    },
    {
      type: "paragraph",
      content: "I hope you all enjoyed this week’s edition. This trip was very different from the other ones I’ve taken so far, filled with lots of drama and new characters to this newsletter, so I hope I didn’t lose you all along the way. Also, as I’m rereading this newsletter it seems like I don’t study at all. I promise I do. I received the highest score for my AI and Computer Vision midterms. I always finish my assignments and readings during the week, which enables me to travel on the weekends!\n\nNext weekend, I'll be reporting from Spain! I'm so excited to be taking a much needed weekend off from traveling."
    },

    // ── BONUS PHOTO GALLERY ──────────────────────────────────────────
    {
      type: "three-photos",
      photos: [
        { src: gallery1, caption: "Lush green rolling hills along the coast" },
        { src: gallery2, caption: "Classic architecture lining the Dublin streets" },
        { src: gallery3, caption: "Catching up with old friends over pints" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: gallery4, caption: "Cliffsides fading into the Irish sea fog" },
        { src: gallery5, caption: "Cozy local pubs filled with traditional music" },
        { src: gallery6, caption: "The incredible lively vibes of Temple Bar" }
      ]
    },

    {
      type: "paragraph",
      content: "XOXO,\nVittoria"
    }
  ]
};

export default week10;