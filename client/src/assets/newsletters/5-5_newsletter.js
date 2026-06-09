/**
 * Week 17 Newsletter (Last Full Week In Madrid 🙁)
 * Note: Keeping consistent chronological numbering sequential to last week's code (Week 17 structure)
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import retiroRoseGarden1 from '../newsletter photos/5-5 newsletter photos/IMG_8814.jpg';
import retiroRoseGarden2 from '../newsletter photos/5-5 newsletter photos/IMG_8801.jpg';
import retiroRoseGarden3 from '../newsletter photos/5-5 newsletter photos/IMG_8802.jpg';
import retiroRoseGarden4 from '../newsletter photos/5-5 newsletter photos/IMG_8803.jpg';
import retiroRoseGarden5 from '../newsletter photos/5-5 newsletter photos/IMG_8804.jpg';
import retiroRoseGarden6 from '../newsletter photos/5-5 newsletter photos/IMG_8807.jpg';
import retiroRoseGarden7 from '../newsletter photos/5-5 newsletter photos/IMG_8808.jpg';

const week17 = {
  id: 17,
  title: "Week 17: Last Full Week In Madrid 🙁",
  date: "May 5, 2026",
  slug: "last-week-madrid",

  // Used on the newsletter landing page preview card
  previewDescription: "Wrapping up classes in Madrid with deep host family dinner discussions on economics and local community, nostalgic reflections on long-distance college friendships with Maya, a modern art tour at the Reina Sofía, and a sunset stroll through Retiro's fully-bloomed rose garden.",

  // Filter tags shown on the landing page
  tags: ["Madrid", "Retiro", "Reina Sofia", "Reflection"],

  sections: [
    {
      type: "paragraph",
      content: "Hi everyone!! This week was packed with last day of classes, a visit to the Reina Sofia, and more delicious host family meals. For the past 5 months, Madrid has been my home, and it feels surreal that my never-ending vacation is coming to an end. I set a record low amount of photos taken this week, the only ones in my camera roll happen to be from the rose garden in Retiro, my favorite place in Madrid."
    },

    // ── HOST FAMILY DINNER CONVERSATIONS ─────────────────────────────
    {
      type: "callout",
      content: "Host Family Dinner Conversations"
    },
    {
      type: "photo-left",
      src: retiroRoseGarden1,
      caption: "Strolling through the bright rows of climbing vines in El Retiro's La Rosaleda",
      text: "At host family dinner on Monday, my perspective on life in Madrid changed significantly. The average monthly income in Madrid is around 2000-2750 euros, but my host mom reported that the mode of 1400 euros was a better representation of one worker's monthly income. And these statistics are before taxes and social security cuts, which together equate to 27% of their monthly income. In comparison, this is significantly lower than the salary of a full time McDonald's worker in Kentucky. Ana, my host mom's niece that lives with us, works as a financial consultant at EY in Madrid and would make almost 4x in the United States. A girl from the United States teaching English in Madrid told me that she makes enough to get by with a little extra for travel, but it's difficult. And a work week here is 45 hours rather than 40. Yes, the cost of living is about 25% lower in Madrid and public healthcare is provided, but my host family reflected that this doesn't necessarily outweigh the difference in salary."
    },
    {
      type: "paragraph",
      content: "I was shocked to learn that most high school and college students don't have part-time jobs. Parents want their kids to focus on school. Colleges in Madrid are insanely difficult- my friends attending Spanish universities regularly have more than a typical Vanderbilt workload. And, multiple choice exams penalize guessing by subtracting half a point when choosing an incorrect answer, and these exams make up all of their grade, so they have to study a lot. I think students not working is also due to lack of available opportunities. I never see 'help wanted' signs in shops. At dinner, Ana told us about firefighters who start fires just so they can be employed.\n\nWe ended the dinner by discussing how youth use AI for therapy and advice in the United States, but not as much in Spain. I think this is an attribute to the communal lifestyle and work-life balance here. Although salaries may be lower, it seems that Madreleños are overall really happy because of how well their community is integrated into every day life."
    },

    // ── REFLECTIONS WITH MAYA ────────────────────────────────────────
    {
      type: "callout",
      content: "Reflections with Maya: Friendships in New Cities"
    },
    {
      type: "photo-right",
      src: retiroRoseGarden2,
      caption: "Vivid pink blossoms framing our winding paths around the park fountains",
      text: "There is one person who has not been featured enough in this newsletter and that is Maya Blanks, one of my bestest friends from Vanderbilt. Between Nashville, Madrid, and DC, she is the only person that I've been in the same city with consecutively for 2 years. And I'm genuinely so lucky because she is a phenomenal friend. For context, back at school, we are in the same 'friend group,' most of whom stayed in Nashville this semester. Hanging out with my closest friends in Nashville is honestly electric- I don't think it is possible for me to laugh that hard with anyone else."
    },
    {
      type: "paragraph",
      content: "A lot of people studying abroad come with their 'friend groups' which makes navigating a new city so much easier. Without this, you are thrown into a world of coordinating busy schedules to call, or if you are lucky, see someone that lives way too far away. You have to meet new people, which Maya and I have discovered, is incredibly easy to do but making good friends is increasingly difficult to do getting older because people are busy or have other friends or are just unreliable. We've decided that post-grad will probably be similar, because all our friends will be in different cities. While I'm excited for new friendships in new cities, I will never take for granted living in a dorm with all of my best friends and laughing every day and being surrounded by the people I love.\n\nStudying abroad has truly been some of the most exciting months of my life, but repeating my host mom's sentiments, it doesn't matter where you are it just matters who you are with. I've made great friendships abroad, but I can't wait to see my people at school and home. And I can't emphasize this enough but I'm so lucky to have such a genuine friend like Maya throughout the past 2 years living in 3 different cities. She is actually the best!"
    },

    // ── MORE HOST FAMILY DINNER CONVERSATIONS ────────────────────────
    {
      type: "callout",
      content: "More Host Family Dinner Conversations"
    },
    {
      type: "photo-left",
      src: retiroRoseGarden3,
      caption: "Delicate white rose beds catching the late afternoon spring sunlight",
      text: "On Saturday, all of my roommates, host dad, and Ana faded dinner, so it was just me and my host mom talking for an hour and a half about life. Honestly this might have been some of my best Spanish yet I was so locked in. I finally worked up the courage to ask what's going on with her husband because he never speaks to us. So, I asked if he liked having the girls every semester, and apparently he does because he grew up with 6 sisters. And then my host mom said that she would never tell him this but she thinks he is a bit autistic because he doesn't really speak to anyone."
    },
    {
      type: "photo-right",
      src: retiroRoseGarden4,
      caption: "Intricate rose configurations expanding across the park's central rotunda",
      text: "I was telling her about Maya and I's conversation about navigating friendships in new cities, and she told me a beautiful story about two of her neighbors. One was a Chinese woman and one was a Spanish woman who couldn't speak each others' languages, but they talked every day in the hall for hours despite not understanding each other. This, Valle said, shows that it is always possible to find community in a place where you don't know anyone. She also told me about the renovations in their house, and how their three boys used to live in my roommates' room in a triple bunk. We had quite the night out at Valle's son Leandro's bar in Malasaña."
    },

    // ── REINA SOFIA ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Reina Sofia"
    },
    {
      type: "photo-left",
      src: retiroRoseGarden5,
      caption: "Golden light casting tall shadows through the geometric hedges of Retiro",
      text: "On Sunday, I visited the Reina Sofia museum of modern art. Think Dali, Picasso, etc. I'm not the biggest fan of the modern art itself, at least not the super abstract pieces, but I think the history that contextualizes each work is interesting. For example, the artist George Grosz's works resonated with me because of my experience in Berlin. He painted forty or so pictures of scenes in the city, some in bright, vibrant colors and others in black and white. My time in Berlin was monochromatically frigid by day and vivaciously iridescent by night. Additionally, I was intrigued by the section on Spain's World War I neutrality increasing artists in Barcelona."
    },
    {
      type: "photo-right",
      src: retiroRoseGarden6,
      caption: "Lush botanical overhead archways leading through the heart of the garden",
      text: "Alessandra's mom, Grandma, and Grandma's friend have also arrived here, so I got to spend some time with them on Sunday walking around Retiro. Also, on another walk around Retiro with Claire, I discovered that her and Callie, another one of my sorority friends who was featured in the Italy edition, will be in DC this summer which is epic!"
    },

    // ── CLOSING & PHOTO WRAP-UP ──────────────────────────────────────
    {
      type: "paragraph",
      content: "Wow this week was a great last week in Madrid! It's been really interesting talking to my classmates about going home, because some are really excited and others never want to leave. Conversations with my host family collapsed my idealistic view of Madrid for sure. I still think it's an incredible place, but it's not without its challenges. I definitely want to come back, but I think I'm ready to go home.\n\nTomorrow, I'm off to Paris to meet up with some of my friends who stayed at Vanderbilt this semester!!!! I'm so so so excited I cannot wait!!!!!\n\nXOXO,\nVittoria"
    },
    {
      type: "image",
      src: retiroRoseGarden7,
      caption: "A final close-up of Retiro's full May blooms—my absolute favorite corner in Madrid."
    }
  ]
};

export default week17;