/**
 * Week 16 Newsletter (Madrid, El Escorial, Malaga)
 * Note: Keeping consistent chronological numbering sequential to last week's code (Week 16 structure)
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import alfonsoRetiroStatue from '../newsletter photos/4-28 newsletter photos/IMG_8712.jpg';
import elEscorialCourtyard from '../newsletter photos/4-28 newsletter photos/IMG_8702.jpg';
import escorialLibrary from '../newsletter photos/4-28 newsletter photos/IMG_8729.jpg';
import escorialPantheon from '../newsletter photos/4-28 newsletter photos/IMG_8731.jpg';
import escorialBasilica from '../newsletter photos/4-28 newsletter photos/IMG_8732.jpg';
import malagaRunningGreenMan from '../newsletter photos/4-28 newsletter photos/IMG_8725.jpg';
import malagaPalmTreesPark from '../newsletter photos/4-28 newsletter photos/IMG_8726.jpg';
import retiroRoseGardenBloom from '../newsletter photos/4-28 newsletter photos/IMG_8748.jpg';
import malagaItalianPizza from '../newsletter photos/4-28 newsletter photos/IMG_8770.jpg';
import andenNightclubClubbing from '../newsletter photos/4-28 newsletter photos/IMG_8758.jpg';
import alcazabaMoorishFortress from '../newsletter photos/4-28 newsletter photos/IMG_8762.jpg';
import caminitoOldDangerousPath from '../newsletter photos/4-28 newsletter photos/IMG_8724.jpg';
import malagaOvercastBeach from '../newsletter photos/4-28 newsletter photos/IMG_8812.jpg';
import gambasAlPipiBeachDinner from '../newsletter photos/4-28 newsletter photos/IMG_8830.jpg';
import retiroTanningRead from '../newsletter photos/4-28 newsletter photos/IMG_8865.jpg';

// Photo Guide specific picture attachments
import malaguenaSignFail from '../newsletter photos/4-28 newsletter photos/IMG_9042.jpg';
import notReadyPhotoFail from '../newsletter photos/4-28 newsletter photos/IMG_8671.jpg';

// Extra scenery and structural snippets for the bottom gallery grid
import galleryScenery1 from '../newsletter photos/4-28 newsletter photos/IMG_8722.jpg';
import galleryScenery2 from '../newsletter photos/4-28 newsletter photos/IMG_8895.jpg';
import galleryScenery3 from '../newsletter photos/4-28 newsletter photos/IMG_9011.jpg';
import galleryScenery4 from '../newsletter photos/4-28 newsletter photos/IMG_9012.jpg';
import galleryScenery5 from '../newsletter photos/4-28 newsletter photos/IMG_9013.jpg';
import galleryScenery6 from '../newsletter photos/4-28 newsletter photos/IMG_9024.jpg';

const week16 = {
  id: 16,
  title: "Week 16: Madrid, El Escorial, Malaga",
  date: "April 28, 2026",
  slug: "el-escorial-and-malaga",

  // Used on the newsletter landing page preview card
  previewDescription: "Finishing up final papers in Madrid before a packed itinerary! Touring the historic grandeur of El Escorial with family, checking out the hilarious running pedestrian lights of Malaga, hiking the narrow gorges of El Caminito del Rey, and a satirical guide to public photo failures.",

  // Filter tags shown on the landing page
  tags: ["Madrid", "El Escorial", "Malaga", "El Caminito del Rey", "Retiro", "Travel"],

  sections: [
    {
      type: "paragraph",
      content: "Hi everyone!! This week I finished up a final paper in my Middle East class, met Uncle Greg and Aunt Kay in El Escorial, and went to Malaga with Jayne for the weekend. A highlight of the week was doing El Caminito del Rey, a popular trail in Andalucia, the beautiful countryside region outside Malaga. I've also kindly included my guide to taking photos of people at the end of this newsletter, if you are interested."
    },

    // ── HIGHLIGHTS FROM THE WEEK ─────────────────────────────────────
    {
      type: "callout",
      content: "Highlights from the Week"
    },
    {
      type: "photo-left",
      src: alfonsoRetiroStatue,
      caption: "Meeting up under the sun at the majestic Alfonso XII monument in Retiro",
      text: "On Tuesday after class, I reunited with Crosby, one of my friends from GSP (a Kentucky summer program), who is also studying in Madrid and living with a host family for the semester. We met at the Alfonso XII statue in Retiro, and then walked over to Plaza Santa Ana, my favorite plaza in my neighborhood. Of course we had to catch up on all things Kentucky and our friends, but the most interesting part was hearing about his study abroad experience. Crosby went to one of the only Spanish immersion schools in Kentucky, so growing up he took his math lessons in Spanish. He told me that when he was in grade school, he spoke 75% of the time in Spanish, but as he got older, he only spoke Spanish 25% of the time because the school wanted to prepare students for standardized testing and university in the United States. His host mom really likes him because of his fluency, so she doesn't have to put in a lot of work. However, her only complaint is that his speaking is too formal- I guess Crosby's school didn't teach him street Spanish."
    },
    {
      type: "paragraph",
      content: "I think growing up bilingual is so cool, especially with Spanish because its one of the world's most popular languages and it opens the doors to conversations with so many people. When I think of bilinguals, I always think of my childhood best friend Isabela. She once told me that because she only spoke Spanish in the house, as a child she didn't know any household objects in English. I think bilingualism would be super confusing as a child but it's such a superpower and I'd love to raise my kids this way. (Idrk how this will work logistically, either my husband is going to have to speak Spanish or I'm going to need to lock in and learn more because I make way too many mistakes at host family dinner.)"
    },

    // ── EL ESCORIAL ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "El Escorial"
    },
    {
      type: "photo-right",
      src: elEscorialCourtyard,
      caption: "Peering across the immense Renaissance stone courtyards of San Lorenzo de El Escorial",
      text: "Early Wednesday morning, I went to meet my Uncle Greg and Aunt Kay at El Real Monasterio de San Lorenzo de El Escorial, a former royal palace and monastery. When we arrived, there were hundreds of school children running all around the courtyard, playing games, laying on the floor, and boisterously shouting to their friends. It's the largest Renaissance building in the world, so we spent all morning walking through the basilica, dining hall, pantheon, library, and copious amounts of other rooms."
    },
    {
      type: "three-photos",
      photos: [
        { src: escorialLibrary, caption: "Marveling at the intricate frescoed ceilings of the monastery library" },
        { src: escorialPantheon, caption: "The gold and marble details down in the crypt of Royal Pantheons" },
        { src: escorialBasilica, caption: "Standing beneath the towering, solemn dome architecture of the Basilica" }
      ]
    },
    {
      type: "paragraph",
      content: "Uncle Greg couldn't stop laughing at the oxymoron of King Philip II's bedroom- he was living in this massive, gorgeous marble palace but his bedroom was tiny and all scuffed up. We tried to go into the palace gardens, but we made a wrong turn so we saw them by putting one foot into a hole in the wall and peering over the tall edge. After our tour, Uncle Greg and Aunt Kay dropped me off for my classes, but we met up later for tapas in my neighborhood. I was very happy to hear that Uncle Greg loves Nocilla (Spanish Nutella) just as much as I do!!"
    },

    // ── MALAGA DAY 1 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Malaga Day 1- Travel Day"
    },
    {
      type: "photo-left",
      src: malagaRunningGreenMan,
      caption: "Catching the signature Malaga pedestrian light where the green man literally sprints",
      text: "Thursday morning, I woke up early in the morning to pack (my dad kept me up on the phone late the night before) and train to Malaga, a beach town 5 hours south of Madrid. I was planning to take my classes over zoom that day, but my professor forgot to send me the zoom link. So, as I was passing through the beautiful Andalusian countryside, I decided to work on an assignment for my Cold War class and start my final paper for my Middle East politics class on the leadership in Saudi Arabia. When I arrived in Malaga, I was unfortunately greeted with gray skies and a cool breeze. I checked in to my Airbnb, but had a bit of time to kill until Jayne arrived from Paris, so I went to a local cafe to finish my paper. Then, I took a walk around downtown Malaga. The first thing I noticed were the pedestrian traffic lights. In Madrid, you can go when the man is green, but when the man starts to blink you have exactly enough time to walk comfortably across the street; if you start to cross after the man starts blinking you likely need to run. In Malaga, they used the same green man, except instead of a blinking warning signal, the man starts running! Jayne and I had lots of fun with the running man this weekend."
    },
    {
      type: "photo-right",
      src: malagaPalmTreesPark,
      caption: "Strolling through the dense, tropical palm canopies inside Malaga Park",
      text: "On my walk, I passed through the beautiful Malaga park along the water, filled with luscious green palm trees. I stopped in a rose garden, where I sat to read Cuentos para Pensar by Jorge Bucay, a collection of short stories that my host mom gave me. So far, my favorites have been El Temido Enemigo (The Timid Enemy), Sueños Semilla (Seed Dreams), and Obituario para un Hombre Singular (Obituary of a Single Man). Although these are not my favorites because the story's deeper meaning resonated with me, rather they are my favorites because I understood most of the words! Many of the other stories, particularly the poems, are exhausting to read because I have to look up every other word or I have no idea what is going on. But when reading the stories where I don't understand a few words, I'll look up repeated words and infer the rest. I hope to finish this one soon because I want to read another book (in English) that I found in the house about the history of Spain!"
    },
    {
      type: "image",
      src: retiroRoseGardenBloom,
      caption: "Important note: the photo above is of the rose garden in Retiro (my favorite place in Madrid) which is currently in full bloom, not Malaga, which had beautiful gardens but not as beautiful as Madrid."
    },
    {
      type: "photo-left",
      src: malagaItalianPizza,
      caption: "Fueling up on fireside Italian slices and carbonara in downtown Malaga",
      text: "Eventually, Jayne arrived later that evening. We went to the grocery store to pick up food for the weekend. I honestly used to be such a lunch sandwich hater but I've definitely opened up to them abroad. Afterwards, we went to dinner at an Italian restaurant in downtown Malaga. Jayne and I split a pizza with jamon (better than Italy) and a spicy carbonara (not better than Italy). When the clock struck midnight, we went back to the city center to explore."
    },
    {
      type: "photo-right",
      src: andenNightclubClubbing,
      caption: "Peeking inside the neon lights of Anden Nightclub for University night",
      text: "I had found this nightclub called Anden, which according to their Instagram posts, was having a University night. There was a decent amount of people, but a lot of them looked younger than us. We went to the bathroom where I started talking to this girl who went to one of the universities in Malaga. She told us that her classmates always come to Anden on Thursdays, but this week most of them were in Sevilla for Feria de Abril. After she told me this, I remembered my host family mentioning it, and once I looked it up online I was determined to go. There is a long story about swapping trains and no available trains and bus sickness that I could tell, but I'll spare you all the details. However, all of this led me to momentarily decide that I was going to detour to Sevilla. However, this plan didn't end up working out either because it became way too complicated and expensive. In retrospect, I should have gone to Sevilla this weekend and skipped Malaga, but, hopefully life will bring me to a Feria de Abril in Sevilla eventually."
    },

    // ── MALAGA DAY 2 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Malaga Day 2- El Caminito del Rey"
    },
    {
      type: "photo-left",
      src: alcazabaMoorishFortress,
      caption: "Hiking up the ancient stone walls of the Alcazaba fortress before the downpour",
      text: "Friday marks the day of my highest step count of abroad at over 30,000 steps (we slept so well after this). We started off with a lazy morning, cooked breakfast, walked around downtown Malaga for a bit, and then hiked up to see the Moorish fortress Alcazaba. It was still raining pretty hard on our way back down, and poor Jayne took a tumble right down the slick pathway."
    },
    {
      type: "photo-right",
      src: caminitoOldDangerousPath,
      caption: "The crumbling, narrow remnants of the original historic cliff path suspended over the canyon",
      text: "When we arrived by bus, it was still raining when we received our helmets and began our trek on 'The King's Little Path' through the narrow gorges. Originally, this walkway was built for King Alfonso XIII in 1905, but he only completed 700 meters of it. Understandably so, because the original path (pictured in the photo on the left) was quite skinny and like 100 meters above the stream below. After completing it, we found out from Jayne's mom that El Caminito used to be regarded as 'the world's most dangerous walkway' and 5 people died doing it in 2000. But, its very safe now because they built a second path that's up to par with safety regulations."
    },

    // ── MALAGA DAY 3 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Malaga Day 3- Beach (finally)!"
    },
    {
      type: "photo-left",
      src: malagaOvercastBeach,
      caption: "An elusive beach hour under deceptively overcast skies",
      text: "On Friday, Jayne and I woke up ready to go to the beach and sunbathe all morning. Unfortunately for us, it was raining. Did you know that Malaga typically gets 4 rainy days every April, and it seems like we got all of them! This is especially ironic because Jayne and I picked Malaga because it was our warmest option of the locations we were considering. But on Saturday, it wasn't raining anymore, so we headed right to the beach. We experienced the 'it's overcast so you think you don't need to use sunscreen but you really probably should have because now you are burnt to a crisp' phenomenon."
    },
    {
      type: "photo-right",
      src: gambasAlPipiBeachDinner,
      caption: "Savoring bubbling sizzling hot garlic shrimp (gambas al pilipi) right on the waterfront",
      text: "After our beach day, we wandered in and out of stores along the main shopping strip. Then we went back to our Airbnb to rinse off, and I got distracted watching this YouTube video of this guy who tried all the different dishes of Malaga's cuisine. He started off by saying that Boquerón is a slang term used to refer to people from Malaga and also one of their most popular fish dishes. He went on to list all of these other dishes we should try while we were there, but most importantly the Sardines that are eaten off the bones. Unfortunately, we didn't find them on our last night, but we got to try gambas al pipi, a spicy shrimp dish, at a restaurant on the beach when the sky finally cleared up!"
    },

    // ── MALAGA DAY 4 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Malaga Day 4- Travel Day"
    },
    {
      type: "photo-left",
      src: retiroTanningRead,
      caption: "Back to the absolute tranquility of checking my books inside Retiro's meadows",
      text: "I woke up super early on Sunday to catch the bus back to Madrid. Honestly, it wasn't that bad considering some of the bus experiences I've had recently. I got back to Madrid mid-day, so I went to Retiro to walk, tan, and read. In the afternoon, I got to catch up with a lot of my friends from home and school. I also heard from Haley, one of my closest friends from Vanderbilt who is graduating next week, about our research lab's demo of what we've been working on all year. At school, I'm a part of the Wicked Problems Lab's Project Sentinel. We are building an automated assessment of AI models to test if they pose risks in different domains, such as cybersecurity, weapons, and data privacy. I was on the fence about staying with the research lab while studying abroad because of time constraints, but I'm glad I did because the project is pretty cool."
    },
    {
      type: "paragraph",
      content: "I can't decide if I'm more sad or excited to go home. If you asked me last week, I would have said that I never wanted to leave. But this week all I've wanted is to squeeze my friends from home and Vanderbilt. But, this week is my last full week here and I'm determined to make the most of it! If there is anything that I haven't done in Madrid yet that you think I should do, please let me know!!\n\nXOXO,\nVittoria"
    },

    // ── PHOTO GUIDE SPECIAL P.S. ─────────────────────────────────────
    {
      type: "callout",
      content: "P.S. Vittoria's Guide to Street Photography Public Service Announcement"
    },
    {
      type: "paragraph",
      content: "It is absolutely impossible to get a good photo of two people on a two person vacation. Every single time we ask someone to take a photo, there is always an issue. So, I've decided to include this PSA to anyone above the age of knowing how to use a phone camera properly. Please keep reading if this applies to you."
    },
    {
      type: "photo-left",
      src: malaguenaSignFail,
      caption: "Exhibit A: Cut off signs and terrible scale spacing from a photographer laying on the concrete",
      text: "1. **If you do not know how to properly take photos, pass the camera along to someone else.** This is a non-negotiable. The people being photographed appreciate your honesty so so much.\n\n2. **If there is a specific sign, building, or monument that the person would like to be photographed with, please include the whole thing!!!** Or let the person know if this is not possible. For example, in this first photo, Jayne and I wanted a photo with the Malaguena sign. The person could have easily captured the whole thing by backing up or taking the photo in 0.5 mode."
    },
    {
      type: "photo-right",
      src: notReadyPhotoFail,
      caption: "Exhibit B: Unprepared mid-sentence snapshot complete with mid-blink eye alignments",
      text: "3. **Make sure the people being photographed are ready!** For example, in this second photo, it is obvious that we are not ready to be photographed.\n\n4. **You don't need to get 'all the angles.'** Of course some people prefer to take the photo from slightly above or slightly below, but please, for your sake and mine, please do not lay on the floor to take the photos (like the guy taking the Malaguena sign ones). Please just take the photo straight on.\n\n5. **Take like 2-4 photos.** I need more than one to make sure that everyone's eyes are open, but I don't need you to fill up all the space in my storage.\n\nAlright if you made it this far you are a trooper thank you for tuning in and see you next week!"
    },

    // ── SIDE-GALLERY SNAPSHOT ARCHIVE ───────────────────────────────
    {
      type: "paragraph",
      content: "Here is a final archive collection of historic arches, Andalusian horizons, and structural snaps from our weekend adventures:"
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryScenery1, caption: "Massive stone columns inside El Escorial interiors" },
        { src: galleryScenery2, caption: "Rolling mountain fields across the sweeping Andalusian countryside" },
        { src: galleryScenery3, caption: "Looking out over red-tiled roofs nestled into Malaga hillside" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryScenery4, caption: "Bright pathways climbing high up toward the ramparts of Alcazaba" },
        { src: galleryScenery5, caption: "Suspended steel bridges spanning deep across Caminito canyon depths" },
        { src: galleryScenery6, caption: "Dusk setting over the bustling docks and waterfront boardwalk lines" }
      ]
    }
  ]
};

export default week16;