/**
 * Week 11 Newsletter (Barrios de Madrid - Part 1)
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import lavapiesSquare from '../newsletter photos/3-23 newsletter photos/IMG_7246.jpg'; // img5.jpeg
import elTigreTapas from '../newsletter photos/3-23 newsletter photos/IMG_7203.jpg';   // img4.jpeg
import elChapandazCave from '../newsletter photos/3-23 newsletter photos/IMG_7223.jpg'; // img3.jpeg
import palaceGardensRun from '../newsletter photos/3-23 newsletter photos/IMG_7228.jpg';// img0.jpeg
import madridRioConcrete from '../newsletter photos/3-23 newsletter photos/IMG_7232.jpg';// img1.jpeg

// Additional assets for the gallery grid
import neighborhoodView1 from '../newsletter photos/3-23 newsletter photos/IMG_2619.jpg';
import neighborhoodView2 from '../newsletter photos/3-23 newsletter photos/IMG_2661.jpg';
import streetArtLavapies from '../newsletter photos/3-23 newsletter photos/IMG_7229.jpg';
import localVibeCafe from '../newsletter photos/3-23 newsletter photos/IMG_7230.jpg';
import campusSpot from '../newsletter photos/3-23 newsletter photos/IMG_7236.jpg';
import madridRioBridge from '../newsletter photos/3-23 newsletter photos/IMG_7242.jpg';

const week11 = {
  id: 11,
  title: "Week 11: Barrios de Madrid (Part 1)",
  date: "March 23, 2026",
  slug: "barrios-de-madrid-part-1",

  // Used on the newsletter landing page preview card
  previewDescription: "An in-depth cultural exploration of Madrid's distinct neighborhoods: from interactive volunteering workshops in international Lavapiés, to navigating massive marathon crowds in Sol, diving into local student politics in Universidad, and scouting running trails along Madrid Río.",

  // Filter tags shown on the landing page
  tags: ["Madrid", "Lavapies", "Sol", "Universidad", "Madrid Rio", "Volunteering"],

  sections: [
    {
      type: "paragraph",
      content: "Hey guys! I'm back again with this week's edition of my study abroad newsletter. I stayed here in the home base this week, exploring as many of Madrid's \"barrios\" as possible. So this week's newsletter is going to look a little bit different (and a bit longer). Instead of a chronological retelling of this week's adventures, I'll be giving an overview of some of Madrid's neighborhoods and weaving stories throughout. More parts to come! I truly felt like I got to experience authentic Spanish culture this week, so I'm excited to share them here."
    },

    // ── LAVAPIES ─────────────────────────────────────────────────────
    {
      type: "callout",
      content: "Lavapiés - The International Neighborhood"
    },
    {
      type: "photo-left",
      src: lavapiesSquare,
      caption: "The colorful and bustling streets of the Lavapiés neighborhood",
      text: "Lavapies is home to mostly Arab and African immigrants. On Tuesday, I ventured to Lavapies' community center for my volunteering. I didn't know a lot about this area before going, but I got the vibe once I saw some men shooting up in the neighborhood's main plaza and other men staring from their stoops. Once I got to the volunteer center, I was greeted by Nieves, the woman leading the Social Pressure workshop, and the other instructors. Before the workshop, a group of ten year old girls told me about their schools and playing in the plaza. The students were intrigued by life in the United States and peppered me with questions. During the workshop, we discussed how others can influence decision making by playing a version of the floor is lava. I think the kids enjoyed it even though they rolled their eyes when Nieves first told them what the workshop was about (I would have too)."
    },
    {
      type: "paragraph",
      content: "I sat with the sweetest girl who was telling me about her favorite music and her plans to grow her hair long. Later, a boy with glasses sat down with us and the two taught me their favorite games, including the tie-breaking go-to Piedra, Papel y Tijera. When I left, the little girl gave me a big hug and gifted me a sticker.\n\nThen, Nieves invited me to grab a drink. Intrigued by Madrileños and their way of life, I quickly accepted. After walking north towards Sol, we stopped at a bar and sat outside. Nieves worked as a freelancer after studying computers in university, but didn't like the lifestyle because she thought it was too professional. This was interesting to me because in the United States, software developers are very casual. She much prefers working with the kids and believes she is making a greater impact on their lives. Halfway through, Nieves' friend from university joined. They were planning a 25 year reunion with university classmates. They told me stories from when they were in college, gaped at friends they could no longer recognize, and shared differences between Spanish and American universities. Towards the end, the friend asked me what I thought of Madrid and its inhabitants. I repeated the sentiments I've shared in this newsletter: the people of Spain are very laid back; I mostly love the culture but sometimes it really gets to me when nothing is on time. I honestly told them I think the Spanish are some of the loudest people I've met, especially living on a popular street in a small apartment with six other people. In response, the friend, a hiking enthusiast, recommended some quiet trails right outside the city."
    },
    {
      type: "paragraph",
      content: "My experience in Lavapies this week felt so authentically Spanish. This group of students was much more welcoming than the group in Fuenlabrada, patiently listening to my American accent and inviting me to join into their games. Despite the language barrier and age gap, Nieves and her friend went out of their way to get to know me beyond scheduled workshop time. I think this is a testament to her character and also to Spanish culture more broadly. Grabbing drinks or sharing a tapa during aperitivo hour is integral to the lifestyle here. In my opinion, this way of building community emphasizes the person first and the worker second, which is such a different set of values than what I grew up with. In the United States, people work all day to meet deadlines and then go home to their families. However, everyday starting around 7pm, the streets of Madrid are packed with friends catching up or coworkers bonding outside of the office. This realization and appreciation for aperitivo hour has made me a bit more understanding of our late dinner times."
    },

    // ── SOL ──────────────────────────────────────────────────────────
    {
      type: "callout",
      content: "Sol - Tourist Central"
    },
    {
      type: "photo-right",
      src: elTigreTapas,
      caption: "Piles of traditional tapas accompanying cider at El Tigre",
      text: "The Sol area is Madrid's most touristy neighborhood. Gran Via, the most famous street in Sol, is frequently compared to Times Square and has lots of shopping chains. A popular stop along Gran Via is Zara, the clothing chain that every young Madrileña obsesses over. I don't spend a lot of time here because it's always PACKED. However, this weekend Alessandra and I maneuvered through the crowds to the electric El Tigre Sidra for 7 euro drinks that come with unlimited (but admittedly mid) tapas."
    },
    {
      type: "paragraph",
      content: "On Sunday, I ran through Sol in an attempt to reach some new neighborhoods, but it was absolutely PACKED. I accidentally ran into a lively half marathon with over 26,000 participants. In Puerta del Sol, home of the iconic El Oso y el Madroño statue, there was a marching band and police cars blasting music to cheer on the runners. My host mom and Ana, a 25 year old cousin that lives with us during the week, said it was a perfect day to run because it was beautiful outside and the streets were lined with supportive loved ones."
    },

    // ── UNIVERSIDAD ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Universidad - The Young People Area"
    },
    {
      type: "photo-left",
      src: elChapandazCave,
      caption: "Deep inside the cavernous depths of El Chapandaz bar",
      text: "Moncloa and Arguelles, full of university campuses and student housing, are in the north-west part of Madrid. Every week, I take the 35 minute metro to Saint Louis University - Madrid for my classes. On Tuesdays and Thursdays, I explore Universidad's best lunch spots and parks after class. Last Friday, I went to El Chapandaz, a cave bar that served surprisingly good milk-based cocktails called leche de pantera from the ceiling. Because we were coming from separate dinners, Alessandra and Paige arrived earlier than I did, so I was stuck waiting in a very long line alone."
    },
    {
      type: "paragraph",
      content: "I was about to go home when a Spanish girl offered me a piece of gum and introduced me to her friends. They all went to Universidad Complutense and most studied Law. Maria was the kindest of the group, explaining their friend group boy drama and stereotypes of the North and South of Madrid. All but one boy was from the South, a poorer area that she explained to me as \"in the hood.\" The North, they reported, is \"preppy\" and rich. It seems there is an intense rivalry between the North and South because these girls thought they were a lot better than the boring Northerners. One of the most fun parts of the night was when the craziest girl started dancing flamenco in the street."
    },
    {
      type: "paragraph",
      content: "Eventually, I made it into the bar. Besides Alessandra, Paige, and I, there was not an American in sight. I talked to one of the boys from the South about Clavicular, an internet sensation obsessed with looksmaxxing. (If you don't know who this is, please look him up.) Then, I talked to the boy from the North and he was very well versed in Spanish and international politics. In my Cold War class, we discussed the rising Franco movement amongst young people in Spain. He told me he didn't think that Franco was that bad and said that there's people out there that agree with him, but it's not that deep. He asked about my thoughts on President Trump and I asked him about Spanish perception of the United States. He said he's generally pretty moderate and agrees with some of his policies but not other ones. Everyone in the group said Spaniards have a good perception of the US with a little dissatisfaction in recent weeks. In general, Spaniards have been welcoming towards me but there's been a pretty divided attitude towards Trump."
    },
    {
      type: "paragraph",
      content: "The last group I talked to that night was a group of Mexican boys studying abroad in Madrid. I spoke to two, one that was studying law and another that was studying finance. I was telling them about the social competition between the North and South of Spain, so they started telling us about the economic divisions in Mexico. They reported that there is a huge hierarchy and division between the working class and the upper class, which aligns with what I've read about an almost non-existent middle class. One of the boys said his dad was on the Supreme Court and he gets a private transfer in an armored vehicle when he's in Mexico. I wasn't totally convinced of his story, but when we asked our host family, they said it was possible because you had to have a lot of money to study abroad from Mexico. I also asked my host mom and Ana if they would ever live in Latin America. They both winced, gave each other a look, and said they would like to visit Brazil, Argentina, or Chile on vacation."
    },
    {
      type: "paragraph",
      content: "The Universidad neighborhood is my new favorite area to go out. I loved El Chapandaz, the reggaeton, and talking to people from around the world. Although discussing the political and economic state of the world isn't typical bar discussion, this night was my favorite in Madrid thus far. The girls that I met in the line recommended some other spots nearby that I'd never heard of, which means they are local spots and I can meet more Spaniards. I exchanged contact information with Maria, so hopefully I'll be able to meet up with them again in the future!"
    },

    // ── MADRID RIO ───────────────────────────────────────────────────
    {
      type: "callout",
      content: "Madrid Río - The River"
    },
    {
      type: "photo-right",
      src: palaceGardensRun,
      caption: "Passing by the grand historic Palace gardens early in my run",
      text: "The Rio neighborhood is less of a neighborhood and more like a long park that borders the southwest corner of Madrid. When I asked my host mom what her favorite running routes are, she said \"el rio\" without hesitation. She claimed it was a precious area of town, very tranquil and surrounded by natural beauty. I was envisioning a dense tree awning over a dirt trail near the river, so I decided I would explore during my next run."
    },
    {
      type: "photo-left",
      src: madridRioConcrete,
      caption: "The structured concrete multi-use running trail bordering Madrid Río",
      text: "On Friday morning, I ran to the river, first through Sol and then around the Palace gardens. When I arrived, I was confused by the industrial-like concrete running path next to a drained “river” and bordered by an expressway! This was absolutely not the relaxing run that I had imagined. And it was quite boring too; I just wanted to yap with my favorite running buddy Isabella (hope Wake is treating you well). Nevertheless, I continued along the path, hopeful that the park would have a bit more greenery. Along the way, I found a ropes course that I took a break to complete, before making my way to the park. Once I arrived, I was let down again because most plants were still dead from the cold winter. Maybe I'll return later in spring, or perhaps I'll just stick to the luscious Retiro park."
    },

    // ── FOOTER & EXTRA GALLERY ───────────────────────────────────────
    {
      type: "paragraph",
      content: "I hope you enjoyed reading my internal monologue of the neighborhoods I went to this week! Sorry for the lack of visuals I forgot to take photos whoops. Also, I didn't give details about my day-to-day activities, but I got to hangout with a lot of girls from my sorority this week!! I definitely miss my friends from home and at school, but I've loved branching out as well!\n\nHere are a few additional snapshots captured around our beautiful home base this week:"
    },
    {
      type: "three-photos",
      photos: [
        { src: neighborhoodView1, caption: "Quiet side-alleys hidden throughout the city" },
        { src: neighborhoodView2, caption: "Charming old-world facades looking over classic plazas" },
        { src: streetArtLavapies, caption: "Intricate urban murals decorating Lavapiés" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: localVibeCafe, caption: "Stopping at local cafes during aperitivo hour" },
        { src: campusSpot, caption: "Strolling through student hubs around Universidad" },
        { src: madridRioBridge, caption: "Modern architecture stepping across the park trails" }
      ]
    },
    {
      type: "paragraph",
      content: "XOXO,\nVittoria"
    }
  ]
};

export default week11;