/**
 * Week 4 Newsletter
 *
 * REUSABLE SECTION TYPES:
 * { type: "three-photos", photos: [ {src, caption}, {src, caption}, {src, caption} ] }
 * { type: "photo-left", src, caption, text }
 * { type: "photo-right", src, caption, text }
 * { type: "paragraph", content }
 * { type: "callout", content }
 * { type: "image", src, caption }
 */

import churrosMadrid from '../newsletter photos/2-2 newsletter photos/IMG_0475.jpg';
import succulentRoom from '../newsletter photos/2-2 newsletter photos/IMG_0505.jpg';
import paellaDinner from '../newsletter photos/2-2 newsletter photos/IMG_0509.jpg';
import asianRestaurant from '../newsletter photos/2-2 newsletter photos/IMG_0513.jpg';
import tranenpalastMuseum from '../newsletter photos/2-2 newsletter photos/IMG_0519.jpg';
import hostelRoom from '../newsletter photos/2-2 newsletter photos/IMG_0521.jpg';
import fashionWeekParty from '../newsletter photos/2-2 newsletter photos/IMG_0524.jpg';
import brandenburgGate from '../newsletter photos/2-2 newsletter photos/IMG_0526.jpg';
import topographyMuseum from '../newsletter photos/2-2 newsletter photos/IMG_0547.jpg';
import berlinNightlife from '../newsletter photos/2-2 newsletter photos/IMG_0550.jpg';
import jewishMuseum from '../newsletter photos/2-2 newsletter photos/IMG_0559.jpg';
import checkpointCharlie from '../newsletter photos/2-2 newsletter photos/IMG_2146.jpg';
import galleryPhoto1 from '../newsletter photos/2-2 newsletter photos/IMG_2195.jpg';
import galleryPhoto2 from '../newsletter photos/2-2 newsletter photos/IMG_5933.jpg';
import galleryPhoto3 from '../newsletter photos/2-2 newsletter photos/IMG_5939.jpg';
import galleryPhoto4 from '../newsletter photos/2-2 newsletter photos/IMG_5944.jpg';
import galleryPhoto5 from '../newsletter photos/2-2 newsletter photos/IMG_5946.jpg';
import galleryPhoto6 from '../newsletter photos/2-2 newsletter photos/IMG_5958.jpg';

const week4 = {
  id: 4,
  title: "Week 4: Trip to Berlin, Germany",
  date: "February 2, 2026",
  slug: "berlin",

  // Used on the newsletter landing page preview card
  previewDescription: "Chilly explorations in Malasaña, stumbling into a bizarre Berlin Fashion Week afterparty, and navigating profound Cold War and WWII history.",

  // Filter tags shown on the landing page
  tags: ["Travel", "Berlin", "Germany", "Weekend"],

  sections: [
    {
      type: "paragraph",
      content: "Hello friends and family!! Welcome to week 4 of my study abroad newsletter! This week, I attended classes and explored the Malasaña neighborhood in Madrid. I also traveled to Berlin on the weekend. As usual, I’m very excited to share this week’s adventures with you here. Thank you again for your responses to the edition! I enjoy hearing from you all!"
    },

    // ── WEEK HIGHLIGHTS ───────────────────────────────────────────────
    {
      type: "callout",
      content: "Highlights from the Week"
    },
    {
      type: "photo-left",
      src: churrosMadrid,
      caption: "Churros and chocolate catch-up in Madrid",
      text: "My time in Madrid this week was very chill. I attended classes, including my Web Tech course where we still haven’t made much progress on our websites. Although, my other classes are picking up and I have homework now. I spent time with friends, and I was especially excited to eat churros and chocolate with Kanani, a friend from Vanderbilt who recently arrived in Madrid. My roommate Alessandra and I have been exchanging global news podcasts during our 30 minute metro to campus, and we also watched the Canadian Prime Minister’s speech from Davos. A highlight of the week was getting to FaceTime several friends from school!"
    },
    {
      type: "photo-right",
      src: succulentRoom,
      caption: "The windowless room succulent experiment",
      text: "On Tuesday, I impulsively bought a succulent for me and Alessandra’s room. I collect plants at home, so I thought this would be a nice way to brighten our room. In retrospect, this was a bad idea because we have no windows- only a translucent partition that separates us from the living room. I’ve relocated it to a windowsill and I’ll keep you updated on its growth."
    },
    {
      type: "photo-left",
      src: paellaDinner,
      caption: "A delicious plate of homemade chicken paella",
      text: "I enjoyed my host mom’s cooking every night; my favorite this week was a tuna dish with beets and peppers. Pictured here is a chicken paella, which was delicious. Also, I must have misunderstood when my host mom told me that I could study at Spain’s congressional library because I was denied entry without a reservation. I'll definitely try again next week. Overall, it’s was a great week living and learning in Madrid."
    },

    // ── BERLIN DAY 1 ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Berlin Day 1- Tränenpalast + Fashion Week Afterparty?"
    },
    {
      type: "photo-right",
      src: asianRestaurant,
      caption: "Udon noodles with a side of street action",
      text: "Early Friday morning, Alessandra and I woke up and went to the airport. We met up with Baylie, one of our friends from Vanderbilt. After taking a short catnap in the Malaga airport during our connection, we arrived at Berlin in the afternoon and headed to our hostel to drop off our backpacks. We went to an Asian restaurant for lunch, somehow one of the only open restaurants at the time. We ate udon noodles at a table by the window with a perfect view of a man getting arrested outside. Welcome to Berlin!"
    },
    {
      type: "photo-left",
      src: tranenpalastMuseum,
      caption: "Tränenpalast (Palace of Tears) in the snow",
      text: "Then, once the scene cleared, we trekked through the snow to the Tränenpalast, also know as the Palace of Tears in English. This small but impactful museum is in a spot where policemen and border patrol checked the bags of people crossing between East and West Berlin during the Cold War."
    },
    {
      type: "photo-right",
      src: hostelRoom,
      caption: "St. Christopher's Inn hostel bunk area",
      text: "We went back to our hostel, St. Christopher’s Inn, which was definitely not as nice as the Copenhagen hostel. Alessandra, Baylie, and I met our fourth roommate, a Turkish guy who was sitting on a tree stump that I guess he found in the street. He was a few years older than us, and generally kept to himself besides one night where he called after us as we were heading out. All weekend, our room smelled awful because he kept rolling his blunts in there. This will probably be the last time I stay in a hostel."
    },
    {
      type: "photo-left",
      src: fashionWeekParty,
      caption: "Stumbling into Berlin's unique music scene",
      text: "Later that night, we went to the hostel bar where Alessandra and I split a falafel salad. It was subpar. Then, we decided to check out a nearby bar. When we arrived, there was a bouncer asking for a donation for the private party. We were quite confused by this, but gave him a few euros to enter. I will try my best to describe what I saw, but words cannot explain what we walked into. We had stumbled into a Berlin Fashion Week afterparty?! Electronic music filled the small, house-like venue dj’ed by a man wearing a tie over a cropped button down. Everyone was wearing the most eccentric outfits I’ve ever seen. Men and women were covered head to toe in tattoos and piercings. People were smoking everything under the sun. I know this sounds like a typical 21st century EDM concert, but it was so much more. The most intriguing part was the dance moves. It was just odd. We were the youngest there by 20 years, so we stayed long enough to take it in but felt quite out of place so we left. We went to Bricks, a club with people our age, also for about 20 minutes because the DJ started singing and it was atrocious."
    },

    // ── BERLIN DAY 2 ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Berlin Day 2- Topography of Terror Museum"
    },
    {
      type: "photo-right",
      src: brandenburgGate,
      caption: "The snowy path to Brandenburg Gate",
      text: "Alessandra, Baylie, and I started day two of our Berlin excursion at Potsdamer Platz. They got a coffee and we went into a couple shops but didn’t buy anything. We ate Döner Kebabs, a Turkish sandwich popularized in Germany by immigrants in the 70s. Then, we trudged through the snow to the Memorial to the Murdered Jews of Europe and Brandenburg Gate. We also stopped by the Reichstag- a government building that opened when the German monarchy ended, burned down right after the Nazi’s gained power, and restored during reunification- a symbol of democracy for Berlin."
    },
    {
      type: "photo-left",
      src: topographyMuseum,
      caption: "Guided historical tour at the Topography of Terror",
      text: "It was actually frigid so we ran back to Potsdamer Platz to dethaw before our next stop. Then, we walked to the Topography of Terror museum for a public guided tour. Our guide was very knowledgeable about German history, and looking out the window he showed us the sites of government headquarters (SS and Gestapo) during the Nazi regime. However, I was shocked when he said that the Nazi party is the biggest political party in Germany today. After further research, I think he was referring to Alternative for Germany, the political party that holds the second most amount of seats in Germany’s federal parliament. They don’t officially align with Nazism but emphasize anti-immigration/nativism and it is classified as a 'right-wing extremist group' by Germany’s Federal Office for the Protection of the Constitution."
    },
    {
      type: "photo-right",
      src: berlinNightlife,
      caption: "The monochrome day vs. vibrant night shift",
      text: "After the museum, we went back to our hostel, but our Turkish roommate was napping so we went to a German pub nearby. Unfortunately they weren’t serving food so we ate dinner at a Syrian restaurant down the street. Then we returned to our hostel to get ready for the nights activities. Berlin nightlife is truly like no other. From my experience this trip, the dichotomy of day and night here makes so much sense. During the daytime, everything is monochrome- the clouds, the buildings, the streets, the snow. After the sun goes down, people need some sort of artistic expression in their lives. So I guess they resort to eccentric dancing, colorful outfits, and graffiti."
    },

    // ── BERLIN DAY 3 ──────────────────────────────────────────────────
    {
      type: "callout",
      content: "Berlin Day 3- Jewish Museum + Berlin Wall Memorial"
    },
    {
      type: "photo-left",
      src: jewishMuseum,
      caption: "Deeply reflective architecture at the Jewish Museum",
      text: "Alessandra, Baylie, and I began our last day in Berlin with a sandwich and a trip to the Jewish Museum. We started in the basement, architected with inclined floors and tilted wall to help attendees reflect upon the sense of confusion and loss during the Holocaust. We went to the temporary exhibit where we heard recorded narratives of Holocaust survivors. To finish off the museum, we went through the main exhibit which documents the history of Jews in Germany (some of which we’ve discussed in my Middle East and North Africa course). This museum was very well done, with lots of interactive and interpretive components."
    },
    {
      type: "photo-right",
      src: checkpointCharlie,
      caption: "Historic borders at Checkpoint Charlie",
      text: "Next, we stopped by Checkpoint Charlie, one of the most popular tourist attractions in Berlin. We didn’t do the museum because we had a pretty comprehensive understanding of the border control situation during the Cold War from the Tränenpalast. We also stopped by the Berlin Wall Memorial, even though we had seen the Wall in several other spots around the city."
    },

    // ── TWO SECTIONS OF THREE PHOTOS (GALLERIES) ─────────────────────
    {
      type: "paragraph",
      content: "To end the night, Alessandra and I split a pho bowl. Baylie was feeling sick after our extended outdoor time, so we went back to our hostel to prepare for bed. We woke up on Monday morning to catch our flight back to Madrid."
    },
    {
      type: "callout",
      content: "More snapshots from our chilly Berlin adventure!"
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryPhoto1, caption: "Standing along the historic wall remnants" },
        { src: galleryPhoto2, caption: "Snowy trek across the capital city" },
        { src: galleryPhoto3, caption: "Catching a quick thaw inside a cozy cafe" }
      ]
    },
    {
      type: "three-photos",
      photos: [
        { src: galleryPhoto4, caption: "Monochrome architectural views" },
        { src: galleryPhoto5, caption: "Navigating city plazas in the frost" },
        { src: galleryPhoto6, caption: "Heading back to base after a long day" }
      ]
    },

    // ── TAKEAWAYS ────────────────────────────────────────────────────
    {
      type: "callout",
      content: "Takeaways"
    },
    {
      type: "paragraph",
      content: "There are so many Middle Eastern restaurants. I wish we would have eaten at a German restaurant, but every time we tried they were not serving food anymore."
    },
    {
      type: "paragraph",
      content: "There is a plethora of WWII and Cold War sites in Germany. We barely scratched the surface of museums related to the wars, let alone other parts of German history. Many of the sites we visited were recommended by my Cold War professor."
    },
    {
      type: "paragraph",
      content: "Our waiter told us we must return in the summer when it is not below freezing. It was quite difficult to walk around the city and see outdoor sites. Most of the times, we would see the attraction for two seconds and run to the nearest coffee shop immediately. We took turns buying drinks/food just so we could warm up, and then we’d learn a bit about the sites' history."
    },
    {
      type: "paragraph",
      content: "If you asked me \"How was Berlin?\" I honestly don't know what I would say. Rich with history, the city offered plenty learning and site-seeing opportunities. However, walking around the city felt like when the Dementors took over Hogwarts. And at night I was surrounded by a bunch of dancing Luna Lovegoods and Professor Trelawneys. (Harry Potter reference alert!) It was so strange, but I kind of loved it."
    },
    {
      type: "paragraph",
      content: "I hope you enjoyed this week’s edition of my study abroad newsletter! Next week, I’ll be reporting from Morocco. I love and miss you all!\n\nLove,\nVittoria"
    }
  ]
};

export default week4;