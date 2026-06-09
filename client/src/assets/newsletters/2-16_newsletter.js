/**
 * Week 6 Newsletter
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import introPhoto from '../newsletter photos/2-16 newsletter photos/IMG_2760.jpg'; // img8
import valenciaSwing from '../newsletter photos/2-16 newsletter photos/IMG_2771.jpg'; // img9
import valenciaPlayground1 from '../newsletter photos/2-16 newsletter photos/IMG_0887.jpg'; // img4
import valenciaPlayground2 from '../newsletter photos/2-16 newsletter photos/IMG_0889.jpg'; // img5
import valenciaPlayground3 from '../newsletter photos/2-16 newsletter photos/IMG_2737.jpg'; // img6
import catedralValencia from '../newsletter photos/2-16 newsletter photos/IMG_2777.jpg'; // img11
import paellaDish from '../newsletter photos/2-16 newsletter photos/IMG_0857.jpg'; // img3
import languageLearningProgress from '../newsletter photos/2-16 newsletter photos/IMG_2772.jpg'; // img10
import metroPodcast from '../newsletter photos/2-16 newsletter photos/IMG_0832.jpg'; // img2
import chatGptCorrections from '../newsletter photos/2-16 newsletter photos/IMG_0831.jpg'; // img1
import dinnerHostFamily from '../newsletter photos/2-16 newsletter photos/IMG_6715.jpg'; // img0

// Extra gallery photos from the provided list
import gallery1 from '../newsletter photos/2-16 newsletter photos/IMG_2750.jpg';
import gallery2 from '../newsletter photos/2-16 newsletter photos/IMG_6658.jpg';
import gallery3 from '../newsletter photos/2-16 newsletter photos/IMG_6660.jpg';
import gallery4 from '../newsletter photos/2-16 newsletter photos/IMG_6663.jpg';
import gallery5 from '../newsletter photos/2-16 newsletter photos/IMG_6667.jpg';
import gallery6 from '../newsletter photos/2-16 newsletter photos/IMG_6668.jpg';

const week6 = {
  id: 6,
  title: "Week 6: Mi Vida en España!",
  date: "February 16, 2026",
  slug: "valencia",

  // Used on the newsletter landing page preview card
  previewDescription: "A beautiful daytrip exploring Valencia's beaches and historic cathedrals, mixed with an honest look into the daily rhythms and challenges of Spanish language immersion.",

  // Filter tags shown on the landing page
  tags: ["Madrid", "Valencia", "Spanish", "Daytrip"],

  sections: [
    {
      type: "paragraph",
      content: "Hi all! Sorry for the late update!! Last week, I frolicked about Madrid and Valencia. Today's edition is going to be shorter and a bit different. Like usual, I'll tell you about my daytrip to Valencia. I'm also going to detail my Spanish learning process. Next week, we'll return to the regularly scheduled programming!"
    },
    {
      type: "photo-left",
      src: introPhoto,
      caption: "Strolling through the streets of Madrid",
      text: "Also, my apologies in advance I didn't take many photos of myself this week. And they are bad quality 🙁 When I travel with Jayne, she always ensures we get the best photos!"
    },

    // ── VALENCIA DAYTRIP ──────────────────────────────────────────────
    {
      type: "callout",
      content: "Valencia Daytrip!"
    },
    {
      type: "paragraph",
      content: "On Friday, I went to Valencia with Alessandra, Maya, and Eden (Maya's friend from Israel). In the morning, enjoyed coffee and shakshuka, my new second favorite style of eggs. (My all time favorite egg style is bird's nest or egg-in-a-basket. If you've ever spent a night at the Riedling house, I've most definitely cooked them for you.)"
    },
    {
      type: "photo-right",
      src: valenciaSwing,
      caption: "Yapping session on the Valencia swings",
      text: "We sat on this swing and yapped for a long time, and then wondered around the city. Valencia has so many playgrounds! Like one on every block. We also found some very fun outdoor workout equipment. We wondered around the Arts and Science Museum, then sat in the park where we read and played sudoku. Eventually, we went to the beach!! But, it was very windy and cold so we fled to a nearby lunch spot. We tried Agua de Valencia, a delicious orange flavored drink, 9.5/10 stars."
    },
    {
      type: "three-photos",
      photos: [
        { src: valenciaPlayground1, caption: "Exploring the City of Arts and Sciences" },
        { src: valenciaPlayground2, caption: "Testing out the local park equipment" },
        { src: valenciaPlayground3, caption: "Windy afternoons by the coast" }
      ]
    },
    {
      type: "photo-left",
      src: catedralValencia,
      caption: "Inside the breathtaking Catedral de Valencia",
      text: "In the afternoon, I went to Catedral de Valencia, home to what is supposedly the Holy Grail. It is unsure if this cup was actually used by Jesus at the Last Supper, but there is nothing to prove that he didn't use it. I joined the second half of a Spanish mass and walked around the museum part. The church was absolutely beautiful inside and out."
    },
    {
      type: "photo-right",
      src: paellaDish,
      caption: "Authentic Paella de Valencia with chicken and rabbit",
      text: "To end the night, we ate scrumptious Paella de Valencia, a rice dish that originated in the city that we visited. Our dish included chicken and rabbit, but it was difficult to taste the rabbit because it was mixed in the rice. I'll have to try it again another time. At the end of the night, we ate gelato and almost missed our train (a common theme when we travel)."
    },

    // ── SPANISH LANGUAGE LEARNING ─────────────────────────────────────
    {
      type: "callout",
      content: "Spanish Language Learning"
    },
    {
      type: "photo-left",
      src: languageLearningProgress,
      caption: "Embracing the challenges of full immersion",
      text: "This week, I focused immensely on my Spanish listening and speaking abilities. I'm improving, but I've noticed that traveling on the weekends significantly stifles my progress. However, this week I was able to practice a lot."
    },
    {
      type: "photo-right",
      src: metroPodcast,
      caption: "Daily commutes double as podcast study sessions",
      text: "On my metro ride home from school every day, I listen to an intermediate Spanish podcast. I understand most of it well, and am able to listen to it on 1.25x speed while still inferring the meaning of unfamiliar words. Today, I tried an advanced Spanish podcast by the same podcaster. I understood most of it, but didn't like it as much because the intermediate version explains niche vocabulary while the advance one assumes you already know it. I also listened to a podcast covering technology news for Spanish speakers, and WOW it was fast."
    },
    {
      type: "photo-left",
      src: chatGptCorrections,
      caption: "Reviewing text analysis corrections and grammar points",
      text: "Usually after I listen to an episode of a podcast, I summarize it and write a reflection in Spanish. Then, I have ChatGPT provide me with corrections and areas of improvement. From this, I'll choose one grammar concept or vocabulary set to practice for the day."
    },
    {
      type: "photo-right",
      src: dinnerHostFamily,
      caption: "Late-night dinner table conversations with the family",
      text: "I practice speaking every night at dinner with my host family. I eat every night around 10PM with my host mom and dad, their daughter-in-law Ana, Alessandra, and our two roommates Sophie and Elise. Usually, we recap our days, talk about the latest protests near the capital (the medics and conductors have been quite pissed off lately), discuss lifestyle differences between US and Spain, and share stories from our childhood. A few days ago at dinner, I taught my host mom how to hit her arm just right to pop a dollup of whipped cream up in the air and into her mouth!"
    },
    {
      type: "paragraph",
      content: "Learning a new language is very difficult and no matter how much I practice there is still so much more to learn. But learning Spanish in Spain is awesome! Next weekend is my winter break so I'll be traveling to Budapest and Vienna."
    },

    // ── BONUS PHOTO GALLERY ──────────────────────────────────────────
    {
      type: "three-photos",
      photos: [
        { src: gallery1, caption: "Bright architecture around Valencia" },
        { src: gallery2, caption: "Café stops and daily routines" },
        { src: gallery3, caption: "Catching up on reading in the park" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: gallery4, caption: "Beautiful historic facades" },
        { src: gallery5, caption: "Late-night city walk views" },
        { src: gallery6, caption: "Gelato stops before the train ride home" }
      ]
    },

    {
      type: "paragraph",
      content: "Hugs and kisses to all!\n\nVittoria"
    }
  ]
};

export default week6;