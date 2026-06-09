/**
 * Week 7 Newsletter (Budapest + Vienna)
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import paellaDinner from '../newsletter photos/2-24 newsletter photos/IMG_6711.jpg';
import stJosephAshWednesday from '../newsletter photos/2-24 newsletter photos/IMG_6735.jpg';
import shoesDanube from '../newsletter photos/2-24 newsletter photos/IMG_1473.jpg';
import fishermanBastion from '../newsletter photos/2-24 newsletter photos/IMG_1482.jpg';
import ruinBarSzimpla from '../newsletter photos/2-24 newsletter photos/IMG_1511.jpg';
import nationalMuseumPiano from '../newsletter photos/2-24 newsletter photos/IMG_1549.jpg';
import chimneyCakes from '../newsletter photos/2-24 newsletter photos/IMG_1563.jpg';
import hofburgPalace from '../newsletter photos/2-24 newsletter photos/IMG_1596.jpg';
import sachertorteCafe from '../newsletter photos/2-24 newsletter photos/IMG_1642.jpg';
import spanishRidingSchool from '../newsletter photos/2-24 newsletter photos/IMG_1675.jpg';
import austrianLibrary from '../newsletter photos/2-24 newsletter photos/IMG_1692.jpg';
import stStephensCathedral from '../newsletter photos/2-24 newsletter photos/IMG_1715.jpg';

// Extra gallery photos from the extensive provided list
import gallery1 from '../newsletter photos/2-24 newsletter photos/IMG_2963_Original.jpg';
import gallery2 from '../newsletter photos/2-24 newsletter photos/IMG_2985_Original.jpg';
import gallery3 from '../newsletter photos/2-24 newsletter photos/IMG_3000_Original.jpg';
import gallery4 from '../newsletter photos/2-24 newsletter photos/IMG_3013_Original.jpg';
import gallery5 from '../newsletter photos/2-24 newsletter photos/IMG_3033_Original.jpg';
import gallery6 from '../newsletter photos/2-24 newsletter photos/IMG_3052_Original.jpg';

const week7 = {
  id: 7,
  title: "Week 7: Trip to Budapest + Vienna!",
  date: "February 24, 2026",
  slug: "budapest-and-vienna",

  // Used on the newsletter landing page preview card
  previewDescription: "A winter break tour through Eastern Europe exploring the largest synagogue in Europe, moving memorials along the Danube, interactive ruin bars, historic musical artifacts, and dancing Spanish horses.",

  // Filter tags shown on the landing page
  tags: ["Madrid", "Budapest", "Hungary", "Vienna", "Austria", "Travel"],

  sections: [
    {
      type: "paragraph",
      content: "Hi everyone!!! This week was another busy but phenomenal week here in Europe. Of course, the first half of my week was spent focused on my classes and learning Spanish. It was winter break, so I went on a longer weekend trip to Budapest, Hungary and Vienna, Austria. I think these two have been my favorite European cities so far because of the breathtaking architecture, charming neighborhoods, and rich history. As always, I love hearing from you all every week! Thank you for sweet responses!"
    },

    // ── HIGHLIGHTS FROM THE WEEK ─────────────────────────────────────
    {
      type: "callout",
      content: "Highlights from the Week"
    },
    {
      type: "photo-right",
      src: paellaDinner,
      caption: "Homemade paella de Valencia by our host mom",
      text: "During the week, my host mom cooked the best meals I’ve had thus far. One night, she made paella de Valencia, and I ate a rabbit rib! Another night, she served mussels, artichoke, and baked potatoes. She also cooked meatballs with a delicious zucchini and carrot salad on the side. Her dinners are always phenomenal, but the most interesting part of dinner is the conversation. First of all, I live so close to Congress and the Bank of Spain, so between the train conductors, bus drivers, medics, and political advocates, there is always a protest to discuss at the dinner table."
    },
    {
      type: "paragraph",
      content: "On Sunday night, I was telling my host family about how I got lost during my morning run, ended up by a metro station far away, and couldn’t find my way back because my phone was dead. My host mom said when she travels to new cities, she loves getting lost on runs because it’s the best way to explore. I totally agree - I stumbled across many bookstores, a shopping area, and a bagel restaurant that I want to visit in the future! Another night, we discussed social media addiction among young people because Spain recently announced plans to restrict social media usage for kids under 15 years old to combat addiction. I’m intrigued if this will get passed and how they are planning to enforce it, especially because I completed a project on this topic for my Internet Law course last semester. Also, this was a great conversation to practice the subjunctive, a Spanish mood that is used to convey beliefs and doubts."
    },
    {
      type: "photo-left",
      src: stJosephAshWednesday,
      caption: "St. Joseph's Church on Gran Vía",
      text: "I attended Ash Wednesday mass at St Joseph’s Church on Gran Via. I always enjoy Spanish masses because I know them so well in English that it’s pretty easy to understand them here. Also, they capture my attention better than the English ones since I’m focused on the translations. However, I was very upset when the pastor took a big scoop of ashes and dropped them right on my head instead of making a cross on my forehead like normal. I had ash in my hair for days!"
    },

    // ── BUDAPEST DAY 1 ───────────────────────────────────────────────
    {
      type: "callout",
      content: "Budapest Day 1 - Sightseeing, Freaking Goulash + Ruin Bars!"
    },
    {
      type: "paragraph",
      content: "On Thursday night, I woke up in Budapest, Hungary after getting in late Wednesday night. For this trip, I traveled with my roommate Alessandra, my friend from Vanderbilt Baylie, and two girls that go to SLU-Madrid with us. It’s a crazy coincidence that Katie and Elizabeth go to Marquette, the university that my brother attends, so I’ll get to see all three when I make the trip next year!"
    },
    {
      type: "photo-right",
      src: shoesDanube,
      caption: "The moving Shoes on the Danube Bank WWII memorial",
      text: "We stayed in the Jewish Quarter on the Pest side, so the first stop on our self-guided walking tour was the Dohány Street Synagogue, the largest synagogue in Europe. On our way to the Hungarian Parliament, we stumbled across a bunch of metal feet walking into the Danube River. Turns out it was a monument commemorating the lives lost in WWII. Afterwards, we walked across the river to the Buda Castle District, where we ate a leisurely lunch at this quaint cobblestone restaurant."
    },
    {
      type: "photo-left",
      src: fishermanBastion,
      caption: "Taking in the panoramic views from Fisherman's Bastion",
      text: "Then, we continued on our walk to see the Fisherman's Bastion, Mary Magdalene tower, and Buda Castle. We crossed back over to the Pest side on the Szechenyi Chain Bridge. For dinner, we ate the most delicious goulash ever at Kisharang Étkezde. Baylie and I also split a Hungarian Langos, or a potato flatbread with chicken inside. This restaurant is my number one recommendation for people visiting Budapest in the future because it was heavenly. After dinner, we were distraught when we discovered that we didn't book the highly reviewed Buda Castle Window Symmetry Analysis Cruise and instead booked the unlimited prosecco cruise!!! Oh no! I will not be taking glass count inquiries."
    },
    {
      type: "photo-right",
      src: ruinBarSzimpla,
      caption: "The chaotic, mismatched, interactive rooms of Szimpla Kert",
      text: "Afterwards, we went to the famous ruin bar Szimpla Kert, a bar that resembled a cave because of its gray walls, dim lighting, and little connected rooms that made me feel like I was back at Kentucky’s most famous natural wonder. To me, this Budapest nightlife was the inverse of Berlin’s. In Berlin, the venues I went to were plain, while the people wore multicolored unique outfits and danced eccentrically. In Budapest, the ruin bars had graffitied walls and multicolored lights, but the attendees wore darker colors and kinda just stood around. The lights on the wall were also interactive - if you hit some buttons, a different pattern of light would show up. I had a blast with this. We were convinced to go to a club to end the night."
    },

    // ── BUDAPEST DAY 2 ───────────────────────────────────────────────
    {
      type: "callout",
      content: "Budapest Day 2 - Hungarian National Museum"
    },
    {
      type: "photo-left",
      src: nationalMuseumPiano,
      caption: "Beethoven's actual historic piano on display",
      text: "Our second day in Budapest started at the Hungarian National Museum. Compared to the other museums we’ve been to, this one was quite boring because it didn’t have any interactive components. But, the highlight of this museum was seeing Beethoven’s piano and Mozart’s portable clavichord. I also thought it was interesting to learn about Hungary’s defeat of communism and the unification of Buda and Pest."
    },
    {
      type: "photo-right",
      src: chimneyCakes,
      caption: "Grabbing a warm, fresh chimney cake dessert",
      text: "We checked out the Great Market Hall and then got chimney cakes down the street. This warm traditional Hungarian dessert pulls apart in a swirl formation and usually contains ice cream or Nutella. Afterwards, we played cards and wandered around Budapest some more. We ate goulash and some sort of chicken dumplings for dinner. We ended the night back at the ruin bars, where we saw Teagan, one of Alessandra's and my sorority sisters."
    },
    {
      type: "paragraph",
      content: "The most interesting part of the night was the uber ride to dinner because we had a yappy English-speaking driver. Alessandra was sitting in the front seat, so she tested the waters with small talk before jumping into other topics about life in Hungary. He’s a native, so he had some typical insights into the culture of the city. Interestingly, he remarked that Hungarians over 40 tend to be more reserved because they grew up before the defeat of its dictator. We ate dinner that night at a less touristy restaurant outside the city center, and despite being a big restaurant filled with lots of Hungarians, it was very quiet. (This would most definitely not happen in Madrid - they are always yelling about something.) It could have just been a coincidence or maybe that was just the vibe of the restaurant, but it was interesting that we experienced that right after our driver mentioned it."
    },
    {
      type: "paragraph",
      content: "On our way home from dinner, we stopped at a Lidl. As I was leaving the grocery store, I heard two customers yelling at each other. I was shocked so I was looking around, and next thing I know I’m being pushed against the wall because a store worker fell trying to grab a lady who was stealing a bag of food. I feel like I’m experiencing a significant amount of tense moments between people or law enforcement since I’ve been here (Madrid police asking about the Moroccan man during week two, arrest with seven police outside a lunch stop in Berlin, etc). I’m always in touristy areas and with friends, so I’ve felt safe. But I’m definitely experiencing these encounters more frequently than I have back in the States."
    },

    // ── VIENNA DAY 1 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Vienna Day 1 - Roaming Around the First District"
    },
    {
      type: "photo-left",
      src: hofburgPalace,
      caption: "Stepping through the grand gates of the Hofburg Imperial Palace",
      text: "Our first day in Vienna, Austria began later in the day after a train ride from Budapest. We dropped our stuff at our stay, got a late lunch (best salad I’ve ever eaten), and met up with my friend Krish. Then, we started our self guided walking tour around the first district. We wandered all around the Hofburg Palace, Opera, Parliament, Theater, and University. We navigated the streets and shopping areas, dodging other tourists and horse drawn carriages."
    },
    {
      type: "photo-right",
      src: sachertorteCafe,
      caption: "Indulging in classic rich Sachertorte at Cafe Central",
      text: "Once our feet ached and our tummies were rumbling, we stopped for a Schnitzel dinner. Then, we went to Central Cafe where we ate Sachertorte, a very delicious chocolate cake. We ended the night by meeting my friend Ben and some other Vanderbilt friends at a bar."
    },

    // ── VIENNA DAY 2 ─────────────────────────────────────────────────
    {
      type: "callout",
      content: "Vienna Day 2 - Performance of Spanish Horses + National Library + Jazz"
    },
    {
      type: "photo-left",
      src: spanishRidingSchool,
      caption: "Watching the elegant white stallions at the Spanish Riding School",
      text: "Our second day in Vienna began at the Spanish Riding School for a performance of the Spanish horses. I've definitely seen a horse race before, but I wasn't sure what to expect when my Aunt Maria and Uncle Dale told me they would be dancing. The show exceeded my expectations. These horses performed three different types of jumps into the air, and also prance diagonally! Very different than the Kentucky Derby!"
    },
    {
      type: "photo-right",
      src: austrianLibrary,
      caption: "The majestic grand hall of the Austrian National Library",
      text: "After the performance concluded, we went to the exquisite Austrian National Library. With wood paneled walls and bookcases, this library is the most beautiful library I've seen to date. Currently, they are displaying an exhibit about medical practices throughout the ages. There were articles and images on many historical practices, from blood-letting, a healing method used until the 19th century, to record setting doctors. I thought it was particularly interesting that surgeons weren't originally academically trained. Historically, surgeons were seen as purely operational while academics studied the theoretics and were better regarded in society."
    },
    {
      type: "photo-left",
      src: stStephensCathedral,
      caption: "The majestic soaring Gothic spires of St. Stephen's",
      text: "We continued on to the stunning St. Stephen's Cathedral and Belvedere Palace. Both were incredibly ornate and calming. I could stare at Gothic churches and Baroque palaces in Vienna forever. We wrapped up the night by taking a very long stroll around the city, eating a quick dinner, then ending the night early after watching a charming jazz performance. Unfortunately, the lead pianist spoke German to the crowd, so I'm not exactly sure what he said. Thankfully, the sound of music transcends the language barrier so we could all enjoy the relaxing band."
    },
    {
      type: "paragraph",
      content: "Honestly, the Spanish horses are more graceful than the Spaniards on an airplane. In every flight I’ve been on that’s arriving or departing from Madrid, the locals are causing a ruckus by walking up and down the aisle to have shouting conversations with all their friends and family. I’ve decided it’s an integral aspect of Spanish culture so I’m reporting about it here. But let's be so for real, what could they possibly need to talk about at 5am?\n\nIf I haven't been obvious enough, I loved Budapest and Vienna. Unfortunately, I only got to spend a day and a half in Vienna, and there is so much more I want to do. I pray that I'm lucky enough to return when I'm older!\n\nAs always, thank you for reading this week's edition of my study abroad newsletter. This was probably my longest one yet, so if you made it this far you're a trooper. I'm going into hiding for the week because I have midterms, but I'll emerge just in time to deliver another newsletter next week! See you soon!"
    },

    // ── BONUS PHOTO GALLERY ──────────────────────────────────────────
    {
      type: "three-photos",
      photos: [
        { src: gallery1, caption: "Stunning classical architecture framing Vienna" },
        { src: gallery2, caption: "Looking across the river towards the Buda skyline" },
        { src: gallery3, caption: "Ornate detail on historical city facades" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: gallery4, caption: "Vibrant city colors on a crisp winter afternoon" },
        { src: gallery5, caption: "Beautiful architectural arches around town" },
        { src: gallery6, caption: "Exploring the grand halls and landmarks" }
      ]
    },

    {
      type: "paragraph",
      content: "XOXO,\nVittoria"
    }
  ]
};

export default week7;