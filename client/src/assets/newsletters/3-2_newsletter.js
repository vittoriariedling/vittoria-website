/**
 * Week 8 Newsletter (Revised with March 2nd Photo Assets)
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import volunteerCenter from '../newsletter photos/3-2 newsletter photos/IMG_6818.jpg';
import madridTrainRegional from '../newsletter photos/3-2 newsletter photos/IMG_6832.jpg';
import volunteerClassroom from '../newsletter photos/3-2 newsletter photos/IMG_6859.jpg';
import jayneBirthdayDinner from '../newsletter photos/3-2 newsletter photos/IMG_0183.jpg';
import lisbonBridgeDupe from '../newsletter photos/3-2 newsletter photos/IMG_6881.jpg'; // Hilly Lisbon views & Golden Gate dupe
import oldestBookstore from '../newsletter photos/3-2 newsletter photos/IMG_6897.jpg';
import fadoGuitarDinner from '../newsletter photos/3-2 newsletter photos/IMG_6913.jpg';
import sintraCastleWalls from '../newsletter photos/3-2 newsletter photos/IMG_6924.jpg';
import sintraGardensPath from '../newsletter photos/3-2 newsletter photos/IMG_6942.jpg';

// Sintra Photo Journal Gallery Imports
import sintraJournal1 from '../newsletter photos/3-2 newsletter photos/IMG_3076_Original.jpg';
import sintraJournal2 from '../newsletter photos/3-2 newsletter photos/IMG_3086_Original.jpg';
import sintraJournal3 from '../newsletter photos/3-2 newsletter photos/IMG_3160_Original.jpg';
import sintraJournal4 from '../newsletter photos/3-2 newsletter photos/IMG_3171_Original.jpg';
import sintraJournal5 from '../newsletter photos/3-2 newsletter photos/IMG_3234_Original.jpg';
import sintraJournal6 from '../newsletter photos/3-2 newsletter photos/IMG_3256_Original.jpg';

const week8 = {
  id: 8,
  title: "Week 8: Trip to Lisbon!",
  date: "March 2, 2026",
  slug: "lisbon-and-sintra",

  // Used on the newsletter landing page preview card
  previewDescription: "Volunteering with a coding workshop in Madrid, celebrating Jayne's 21st birthday, exploring the hilly streets of Lisbon, and scaling the medieval castle walls of Sintra.",

  // Filter tags shown on the landing page
  tags: ["Portugal", "Lisbon", "Sintra", "Volunteering"],

  sections: [
    {
      type: "paragraph",
      content: "Good afternoon and welcome to week eight of my study abroad newsletter! During the week, I took two midterms and volunteered with students at a Madrid community center. On the weekend, I travelled to Lisbon and took a day trip to the nearby town Sintra. The sun was shining all week in Madrid and Lisbon, which makes me appreciate everything 1000x more. This was my favorite week in Europe so far, but if you ask me next Monday I’ll probably revise this statement for the ninth week in a row."
    },

    // ── HIGHLIGHTS FROM THE WEEK ─────────────────────────────────────
    {
      type: "callout",
      content: "Highlights from the Week"
    },
    {
      type: "photo-left",
      src: volunteerCenter,
      caption: "Arriving for my first day of volunteering in Spain",
      text: "On Tuesday, I had my first day of volunteering. When I decided to study abroad in Spain, I knew I wanted a culturally immersive experience so I decided I was going to do some sort of volunteering where I’d be able to speak with the locals. I chose Fundación Sanders, a non-profit that teaches grade school students how to code and be safe online. After 2 months of emailing and a video call with the organizers, I was volunteering at a Madrid community center that hosts an after school program and invites Sanders volunteers to teach workshops."
    },
    {
      type: "photo-right",
      src: madridTrainRegional,
      caption: "Taking the regional train out to Fuencalabras",
      text: "I was scheduled to teach a workshop about self esteem in Fuencalabras, a town that was an hour outside the city center. It kind of reminded me of downtown Louisville and seemed to have a lot of immigrants. I entered the community center. The man who was in charge asks me where my guitar is. I told him that I don’t play the guitar but I was here to volunteer for the self esteem workshop. I asked him if he was Pablo, the man I’d been emailing with, and he said no. Needless to say, the man was very confused. I showed him the address I was given and he told me I needed to go to the trauma center. And at this point, I was very confused. I had reviewed the workshop beforehand but I am not qualified to teach kids at a trauma center about self esteem in English, much less in Spanish. I had originally signed up to teach kids how to code. But I had already taken the hour ride on the regional train to this town in the middle of nowhere, so I was committed."
    },
    {
      type: "paragraph",
      content: "Eventually, I found Pablo and the ten 13-year-olds. Pablo did most of the talking during the workshop. I contributed here and there. The students and instructors were very intrigued by the United States; most hadn’t heard of Kentucky before. The second most boisterous boy told me he really wanted to learn English so I asked him if he knew any and he said no, but he said thank you in English at the end. The whole time, the kids made classic middle school jokes and the most boisterous boy kept singing the rick roll song. I truly felt like I was back in fifth grade. I just couldn’t help myself from associating their personalities with my middle school classmates. As they were completing a NAME worksheet, I noticed that several indicated that they weren’t happy with their life and didn’t believe they could reach their goals. This broke my heart. I started chatting with the two boisterous boys and they made fun of my accent when I asked them if they used social media. Ten minutes later, Rick Roll got sent out for being disruptive."
    },
    {
      type: "photo-left",
      src: volunteerClassroom,
      caption: "Getting to know the local middle school students",
      text: "Everyone was appalled when I said I hadn’t heard of Karol G, a famous Colombian pop singer. I was appalled when many students said they hadn’t heard of Justine Bieber. (Am I old? Or is this a culture difference?) All of the kids call each other tío or tía, which literally translates to uncle or aunt. At first, I was confused because in the US if you are called “unc” you are being called old, which didn’t make sense in their context. Eventually, I concluded that Spaniards use tío similar to how we use dude. Overall, I enjoyed talking with the kids and I’ll definitely be returning."
    },

    // ── LISBON NIGHT 1 ───────────────────────────────────────────────
    {
      type: "callout",
      content: "Lisbon Night 1 - Jayne 21st Birthday!!!!!"
    },
    {
      type: "photo-right",
      src: jayneBirthdayDinner,
      caption: "Scusa Italian restaurant birthday celebrations for Jayne",
      text: "On Thursday, I left for Lisbon, Portugal with three of my close friends from Vanderbilt, Baylie, Jayne, and Maya. This weekend was truly the most magical, whimsical weekend yet. The sun was shining and I was with a phenomenal group of people; I couldn't stop laughing and smiling all weekend. Thursday was Jayne's 21st birthday so of course we had to celebrate. She was visiting Madrid for her spring break so we had a small birthday party for her on Wednesday night. Unfortunately, I had two midterms on Thursday so my night ended quite early. My midterms went well, but I had a stressful post-exam extension debacle in both of my classes because no one in my class finished their projects. Regardless, I submitted my midterms and caught my flight to Lisbon! We had a birthday dinner for Jayne at Scusa, a very delicious Italian restaurant."
    },

    // ── LISBON DAY 2 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Lisbon Day 2- Walking Tour + Fado Music"
    },
    {
      type: "photo-right",
      src: lisbonBridgeDupe,
      caption: "The stunning San Francisco lookalike bridge framing Lisbon",
      text: "My second day in Lisbon began with a walking tour of the city. As we were strolling around, all we could notice is the resemblance between Lisbon and San Francisco. First off, it was SO hilly. Both cities are built upon exactly seven hills! Lisbon's trams reminded me of the cable cars that chauffeur tourists around SF. Lastly, in the background of the photo to the right, you might notice something familiar- a Golden Gate bridge dupe!"
    },
    {
      type: "paragraph",
      content: "At some point during the tour, we started discussing Portuguese colonization in Brazil. My favorite quote of the trip was when Baylie explained \"Portugal was sneaky making moves on Brazil before they told the rest of the world.\" She was referring to Portugal's ploy to secure Brazil before Spain discovered it. A couple centuries later, Portugal's capital was even in Brazil."
    },
    {
      type: "photo-left",
      src: oldestBookstore,
      caption: "Browsing the shelves at the world's oldest bookstore",
      text: "During the tour, we stopped at the world's oldest bookstore! Of course I had to buy a book and they gave me a stamp confirming where I bought it. This will definitely go in my home library one day. We tried Ginginga, a Portuguese cherry liquor in a mini chocolate cup, and Pastel de Nata, a warm custard tart."
    },
    {
      type: "photo-right",
      src: fadoGuitarDinner,
      caption: "An emotional Fado performance accompanied by traditional guitars",
      text: "Our tour guide Maria has a PhD in Fado music, which is Portugal's traditional music that originated in Lisbon in the 19th century. Originally, singers explored themes of freedom, love, and life's hardships during their songs. During the 20th century, Portugal's dictator censored Fado lyrics to control the expression of anti-regime sentiments. At dinner, we heard the Portuguese guitarists play their double stringed instruments designed specifically for Fado music while a passionate female sang Portuguese words I tried to understood (but couldn't- only some words are similar to Spanish)."
    },

    // ── LISBON DAY 3 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Lisbon Day 3- Castles + Gardens in Sintra"
    },
    {
      type: "photo-left",
      src: sintraCastleWalls,
      caption: "Joking around on top of the ancient Moorish castle walls",
      text: "On my last day in Lisbon, I frolicked about in the wooded hills of Sintra, a beautiful town nearby. We made it our mission to not use any vehicles for transportation, so we walked absolutely everywhere. As we were hiking to our first destination of the day, we somehow left the path and ended up jumping the walls of the Moorish castle? Honestly all the medieval armies should take a page out of my book because besieging castles is very simple."
    },
    {
      type: "photo-right",
      src: sintraGardensPath,
      caption: "The lush, mossy canal pathways running through Sintra's estates",
      text: "After exploring this castle, we hiked (this far!) through a canal like path through a stream to these beautiful gardens. The chapel, winding staircase, benches, and fountains were ornately crafted with tiles and carvings. To end our day, we sat on some steps at the bottom of the town and listened to the birds chirp as we appreciated the vivacious colors of the building and scenic views of Portugal's rolling hills. As we were resting, Jayne declared \"this was probably the best birthday weekend ever.\" And honestly that made me so happy."
    },
    {
      type: "paragraph",
      content: "Here's a quick photo journal of Sintra!"
    },
    {
      type: "three-photos",
      photos: [
        { src: sintraJournal1, caption: "Bold colors of Pena Palace architecture" },
        { src: sintraJournal2, caption: "Looking out from high lookout towers" },
        { src: sintraJournal3, caption: "Deep stonework inside Quinta da Regaleira" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: sintraJournal4, caption: "The historic ornate tile structures" },
        { src: sintraJournal5, caption: "Winding forest steps along the trail" },
        { src: sintraJournal6, caption: "A breathtaking view of Portugal's rolling hills" }
      ]
    },
    {
      type: "paragraph",
      content: "Lisbon was a restful, incredible weekend trip with lots of adventuring and exploration. I loved reconnecting with the outdoors  Sadly, I had to leave Saturday night to study for more midterms. I had them today and they went well, thankfully with no post-exam extension debacles. See you same time next week!"
    },
    {
      type: "paragraph",
      content: "XOXO,\nVittoria"
    }
  ]
};

export default week8;