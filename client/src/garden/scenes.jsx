// Page-level botanical compositions, laid out from the Figma designs.
// Each is purely decorative (aria-hidden) and positioned by its page's CSS.

import { Blob, Confetti, Flower, G, Leaf, Sprig, Stalk, Torn } from './shapes';
import './garden.css';

function Art({ className, viewBox, children, preserve = 'xMidYMid meet' }) {
  return (
    <svg className={`garden ${className}`} viewBox={viewBox} preserveAspectRatio={preserve}
         aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/* ── Landing page: garden around the tilted video frame ────────────────
   Frame occupies roughly x 100–468, y 64–544 of the 540×640 box; the art
   deliberately spills outside the box (overflow visible) so the garden
   feels bigger than the photo. Leaves, flowers and squiggly blobs only. */

export function HeroCollageBack() {
  return (
    <Art className="hero-collage-back" viewBox="0 0 540 640">
      {/* soft squiggly blobs anchoring the corners */}
      <Blob x={96} y={606} r={100} lobes={7} wobble={0.13} fill={G.sand} seed={21} stretch={1.15} />
      <Blob x={500} y={40} r={74} lobes={6} wobble={0.14} fill={G.pink} seed={4} />
      <Blob x={480} y={520} r={84} lobes={7} wobble={0.12} fill={G.coral} seed={9} />
      <Blob x={-10} y={250} r={58} lobes={6} wobble={0.14} fill={G.pink} seed={13} />

      {/* left: tall blue fern sweeping up behind the frame, big coral flower */}
      <Sprig x={90} y={660} length={520} angle={-96} bend={0.1} leaves={9} leafLen={96} leafWidth={0.46}
             fill={G.blue} stem={7} spread={58} />
      <Flower x={40} y={118} r={74} fill={G.coral} seed={5} petalWidth={0.9} />
      <Sprig x={-30} y={420} length={150} angle={-30} leaves={5} leafLen={48} fill={G.sage} stem={5} />

      {/* top: green sprigs and leaves peeking over the frame */}
      <Sprig x={190} y={92} length={170} angle={-70} leaves={6} leafLen={48} fill={G.sage} stem={5} />
      <Leaf x={300} y={70} len={92} width={0.5} angle={-82} fill={G.sage} />
      <Leaf x={410} y={74} len={96} width={0.5} angle={-48} fill={G.blue} />
      <Leaf x={418} y={78} len={70} width={0.46} angle={-10} fill={G.blue} />
      <Flower x={360} y={10} r={30} fill={G.sand} center={G.coral} seeds={G.pink} seed={7} />

      {/* right: coral flower on a stem, blue sprig */}
      <Sprig x={528} y={470} length={230} angle={-104} leaves={7} leafLen={56} fill={G.blue} stem={5} />
      <Stalk x={486} y={690} height={290} lean={-36} r={50} fill={G.coral} seed={3} leafLen={70} />

      {/* bottom: leaves tucked under the frame */}
      <Leaf x={210} y={570} len={110} width={0.5} angle={168} fill={G.sage} />
      <Leaf x={300} y={572} len={120} width={0.5} angle={14} fill={G.sage} />
      <Leaf x={250} y={576} len={86} width={0.46} angle={95} fill={G.blue} />
    </Art>
  );
}

export function HeroCollageFront() {
  return (
    <Art className="hero-collage-front" viewBox="0 0 540 640">
      {/* a few pieces overlapping the frame edges, for depth */}
      <Leaf x={112} y={430} len={96} width={0.46} angle={200} fill={G.blue} />
      <Leaf x={112} y={470} len={84} width={0.46} angle={160} fill={G.blue} />
      <Flower x={118} y={548} r={28} fill={G.coral} seed={11} />
      <Leaf x={462} y={86} len={64} width={0.5} angle={-36} fill={G.sage} />
      <Flower x={466} y={300} r={20} fill={G.pink} center={G.sage} seeds={G.sand} seed={2} />
    </Art>
  );
}

/* ── Coding projects: corner sprigs and flowers ─────────────────────── */

export function ProjectsGardenTop() {
  return (
    <Art className="projects-garden-top" viewBox="0 0 420 340">
      <Sprig x={46} y={70} length={92} angle={-18} leaves={6} leafLen={26} fill={G.blue} bend={0.1} spread={60} />
      <Sprig x={150} y={70} length={88} angle={-8} leaves={4} leafLen={30} fill={G.sage} bend={0.05} />
      <Flower x={256} y={56} r={18} fill={G.sand} center={G.sand} seeds={G.sand} seed={4} />
      <Sprig x={282} y={74} length={40} angle={-30} leaves={4} leafLen={13} fill={G.blue} stem={2} />
      <Flower x={346} y={58} r={34} fill={G.coral} seed={2} />
      <Flower x={352} y={116} r={13} fill={G.coral} seed={9} />
      <Sprig x={360} y={300} length={150} angle={-98} leaves={7} leafLen={30} fill={G.blue} bend={-0.08} />
      <Blob x={352} y={330} r={12} fill={G.pink} seed={3} />
    </Art>
  );
}

export function ProjectsGardenRight() {
  return (
    <Art className="projects-garden-right" viewBox="0 0 120 160">
      <Sprig x={50} y={150} length={130} angle={-70} leaves={4} leafLen={34} fill={G.sage} spread={50} stem={3} />
    </Art>
  );
}

export function ProjectsGardenBottom() {
  return (
    <Art className="projects-garden-bottom" viewBox="0 0 380 360">
      <Sprig x={36} y={110} length={86} angle={-72} leaves={4} leafLen={28} fill={G.sage} stem={3} />
      <Blob x={56} y={152} r={13} fill={G.pink} seed={7} />
      <Sprig x={40} y={300} length={100} angle={-96} leaves={7} leafLen={26} fill={G.blue} bend={0.1} />
      <Flower x={48} y={278} r={11} fill={G.coral} seed={5} />
      <Flower x={60} y={334} r={32} fill={G.coral} seed={11} />
      <Sprig x={100} y={330} length={40} angle={-40} leaves={4} leafLen={13} fill={G.blue} stem={2} />
      <Flower x={140} y={334} r={18} fill={G.sand} center={G.sand} seeds={G.sand} seed={6} />
      <Sprig x={160} y={340} length={86} angle={-14} leaves={4} leafLen={30} fill={G.sage} bend={0.05} />
      <Sprig x={268} y={330} length={84} angle={-34} leaves={6} leafLen={26} fill={G.blue} bend={0.12} spread={58} />
    </Art>
  );
}

/* ── Newsletter list: big garden behind the cards ───────────────────── */

export function NewsletterGarden() {
  return (
    <Art className="newsletter-garden" viewBox="0 0 1440 1000" preserve="xMidYMin slice">
      {/* right side: big coral flowers, blue and green leaves */}
      <Sprig x={1360} y={520} length={480} angle={-112} leaves={7} leafLen={150} leafWidth={0.48} fill={G.blue} stem={14} spread={58} />
      <Leaf x={1060} y={150} len={150} width={0.55} angle={-60} fill={G.sage} />
      <Leaf x={1110} y={210} len={120} width={0.5} angle={-10} fill={G.sage} />
      <Torn x={1200} y={240} w={170} h={200} fill={G.coral} seed={12} rotate={8} />
      <Flower x={990} y={190} r={170} fill={G.coral} seed={21} petalWidth={0.9} />
      <Flower x={1420} y={380} r={150} fill={G.coral} seed={14} />
      <Torn x={1250} y={500} w={120} h={140} fill={G.sand} seed={2} rotate={-10} />
      <Leaf x={1440} y={600} len={200} width={0.5} angle={160} fill={G.sage} />
      <Sprig x={940} y={760} length={300} angle={-60} leaves={5} leafLen={120} leafWidth={0.48} fill={G.blue} stem={10} />
      <Torn x={840} y={300} w={90} h={130} fill={G.sand} seed={4} rotate={6} />
      {/* middle: blue sprig peeking between the cards */}
      <Sprig x={470} y={640} length={360} angle={-70} leaves={6} leafLen={90} fill={G.blue} stem={10} leafWidth={0.46} />
      <Blob x={500} y={560} r={56} fill={G.coral} seed={8} />
      {/* left side */}
      <Torn x={-10} y={470} w={56} h={96} fill={G.sand} seed={6} rotate={-6} />
      <Confetti items={[[60, 530, 9, G.blue, 40, 4], [30, 820, 12, G.coral, 15, 4], [790, 100, 12, G.coral, 20, 4]]} />
      <Blob x={10} y={680} r={86} fill={G.blue} seed={5} stretch={1.3} />
      <Flower x={210} y={940} r={48} fill={G.coral} seed={3} />
      <Blob x={850} y={1000} r={110} fill={G.sand} seed={9} />
    </Art>
  );
}

/* ── Newsletter entry: gardens on both sides of the paper sheet ─────── */

export function EntryGardenLeft() {
  return (
    <Art className="entry-garden entry-garden-left" viewBox="0 0 260 1000" preserve="xMinYMin meet">
      <Blob x={0} y={240} r={84} fill="#aebfca" seed={4} stretch={1.2} />
      <Sprig x={20} y={720} length={240} angle={-58} leaves={7} leafLen={70} leafWidth={0.5} fill={G.blue} stem={7} spread={56} />
      <Torn x={40} y={650} w={90} h={110} fill={G.coral} seed={7} rotate={-12} />
      <Confetti items={[[160, 550, 8, G.sand, 10], [170, 640, 7, G.coral, 30, 4], [150, 950, 9, G.coral, 0, 4], [70, 975, 7, G.sage, 20]]} />
      <Torn x={80} y={850} w={80} h={70} fill={G.sand} seed={3} rotate={14} />
      <Stalk x={30} y={1000} height={230} lean={60} r={60} seed={5} leafLen={70} />
    </Art>
  );
}

export function EntryGardenRight() {
  return (
    <Art className="entry-garden entry-garden-right" viewBox="0 0 260 1000" preserve="xMaxYMin meet">
      <Torn x={150} y={140} w={110} h={130} fill={G.sand} seed={11} rotate={6} />
      <Sprig x={140} y={430} length={240} angle={-80} leaves={6} leafLen={62} leafWidth={0.5} fill={G.sage} stem={7} />
      <Torn x={30} y={180} w={120} h={110} fill={G.coral} seed={13} rotate={-8} />
      <Flower x={110} y={290} r={70} fill={G.coral} seed={8} />
      <Torn x={10} y={340} w={70} h={110} fill={G.sand} seed={5} rotate={-4} />
      <Sprig x={60} y={590} length={230} angle={-60} leaves={7} leafLen={62} leafWidth={0.5} fill={G.blue} stem={7} />
      <Torn x={200} y={460} w={70} h={130} fill={G.coral} seed={2} rotate={4} />
      <Confetti items={[[240, 400, 7, G.blue, 0, 4], [220, 610, 8, G.sand, 20]]} />
      <Blob x={190} y={860} r={86} fill={G.sand} seed={12} />
    </Art>
  );
}

/* ── Auth pages & small screens: a light corner sprig ───────────────── */

export function CornerSprig({ className = '' }) {
  return (
    <Art className={`corner-sprig ${className}`} viewBox="0 0 220 220">
      <Sprig x={30} y={200} length={150} angle={-62} leaves={6} leafLen={36} fill={G.blue} stem={4} />
      <Sprig x={90} y={210} length={110} angle={-35} leaves={4} leafLen={34} fill={G.sage} stem={4} />
      <Flower x={40} y={196} r={26} fill={G.coral} seed={3} />
      <Confetti items={[[180, 120, 6, G.sand, 10], [120, 60, 5, G.coral, 0, 4]]} />
    </Art>
  );
}

/* ── More coding-projects garden: left edge and bottom-right ────────── */

export function ProjectsGardenLeft() {
  return (
    <Art className="projects-garden-left" viewBox="0 0 160 360">
      <Blob x={10} y={190} r={46} lobes={6} wobble={0.14} fill={G.pink} seed={8} />
      <Sprig x={30} y={340} length={260} angle={-82} leaves={8} leafLen={42} fill={G.blue} stem={4} />
      <Flower x={92} y={96} r={24} fill={G.coral} seed={6} />
      <Sprig x={10} y={250} length={110} angle={-35} leaves={4} leafLen={34} fill={G.sage} stem={3} />
    </Art>
  );
}

export function ProjectsGardenBottomRight() {
  return (
    <Art className="projects-garden-bottom-right" viewBox="0 0 360 300">
      <Blob x={330} y={270} r={90} lobes={7} wobble={0.12} fill={G.sand} seed={17} />
      <Sprig x={300} y={300} length={220} angle={-118} leaves={7} leafLen={50} fill={G.sage} stem={5} />
      <Stalk x={240} y={310} height={170} lean={-30} r={34} fill={G.coral} seed={9} leafLen={46} />
      <Sprig x={360} y={240} length={150} angle={-150} leaves={5} leafLen={40} fill={G.blue} stem={4} />
      <Flower x={150} y={276} r={16} fill={G.pink} center={G.sage} seeds={G.sand} seed={4} />
    </Art>
  );
}

/* ── What I'm Reading: a tall garden that stays put beside the list ─── */

export function BooksGardenSide() {
  return (
    <Art className="books-garden-side" viewBox="0 0 320 900" preserve="xMaxYMax meet">
      <Blob x={300} y={160} r={90} lobes={7} wobble={0.13} fill={G.pink} seed={3} />
      <Blob x={250} y={880} r={130} lobes={7} wobble={0.12} fill={G.sand} seed={12} />
      <Sprig x={270} y={900} length={620} angle={-98} bend={0.08} leaves={10} leafLen={84} leafWidth={0.46}
             fill={G.blue} stem={7} spread={56} />
      <Stalk x={160} y={910} height={360} lean={-50} r={58} fill={G.coral} seed={5} leafLen={80} />
      <Sprig x={320} y={520} length={240} angle={-140} leaves={7} leafLen={56} fill={G.sage} stem={5} />
      <Flower x={210} y={250} r={40} fill={G.coral} seed={8} />
      <Flower x={290} y={380} r={20} fill={G.sand} center={G.coral} seeds={G.pink} seed={2} />
      <Leaf x={150} y={600} len={90} width={0.5} angle={-150} fill={G.sage} />
    </Art>
  );
}

/** Low band along the bottom that grows out of the right-hand garden toward
 *  the centre/left, thinning out as it goes. Peeks out between the cards. */
export function BooksGardenBottom() {
  return (
    <Art className="books-garden-bottom" viewBox="0 0 1000 220" preserve="xMaxYMax meet">
      <Blob x={980} y={230} r={120} lobes={7} wobble={0.12} fill={G.sand} seed={21} stretch={1.4} />
      <Blob x={700} y={240} r={110} lobes={6} wobble={0.14} fill={G.pink} seed={9} stretch={1.7} />
      <Blob x={400} y={250} r={90} lobes={7} wobble={0.13} fill={G.blue} seed={15} stretch={1.8} />
      <Blob x={120} y={255} r={70} lobes={6} wobble={0.12} fill={G.sand} seed={4} stretch={1.6} />

      <Sprig x={900} y={225} length={190} angle={-112} leaves={7} leafLen={46} fill={G.sage} stem={5} />
      <Stalk x={820} y={230} height={150} lean={-30} r={30} fill={G.coral} seed={11} leafLen={40} />
      <Sprig x={760} y={225} length={150} angle={-70} leaves={6} leafLen={40} fill={G.blue} stem={4} />
      <Leaf x={680} y={210} len={70} width={0.5} angle={-130} fill={G.sage} />
      <Flower x={640} y={150} r={20} fill={G.sand} center={G.coral} seeds={G.pink} seed={6} />
      <Sprig x={600} y={225} length={170} angle={-98} bend={0.12} leaves={7} leafLen={42} fill={G.sage} stem={4} />
      <Stalk x={520} y={230} height={120} lean={24} r={24} fill={G.pink} seed={3} leafLen={34} />
      <Leaf x={460} y={215} len={60} width={0.5} angle={-55} fill={G.blue} />
      <Sprig x={380} y={225} length={130} angle={-80} leaves={5} leafLen={36} fill={G.blue} stem={4} />
      <Flower x={320} y={175} r={16} fill={G.coral} seed={17} />
      <Sprig x={250} y={225} length={110} angle={-105} leaves={5} leafLen={32} fill={G.sage} stem={3} />
      <Leaf x={170} y={218} len={50} width={0.5} angle={-120} fill={G.sage} />
      <Sprig x={90} y={225} length={80} angle={-75} leaves={4} leafLen={26} fill={G.blue} stem={3} />
    </Art>
  );
}

export function BooksGardenLeft() {
  return (
    <Art className="books-garden-left" viewBox="0 0 240 320" preserve="xMinYMax meet">
      <Blob x={0} y={300} r={86} lobes={6} wobble={0.14} fill={G.blue} seed={6} stretch={1.2} />
      <Sprig x={40} y={330} length={230} angle={-72} leaves={7} leafLen={50} fill={G.sage} stem={5} />
      <Flower x={120} y={250} r={30} fill={G.coral} seed={14} />
      <Sprig x={0} y={210} length={120} angle={-40} leaves={5} leafLen={34} fill={G.blue} stem={4} />
    </Art>
  );
}

/* ── Around the World: corners around the map ────────────────────────── */

export function TravelGardenLeft() {
  return (
    <Art className="travel-garden-left" viewBox="0 0 240 340" preserve="xMinYMax meet">
      <Blob x={10} y={300} r={80} lobes={7} wobble={0.13} fill={G.sand} seed={19} />
      <Sprig x={50} y={340} length={280} angle={-80} leaves={8} leafLen={52} fill={G.blue} stem={5} />
      <Stalk x={130} y={350} height={170} lean={30} r={34} fill={G.coral} seed={6} leafLen={44} />
      <Flower x={30} y={120} r={18} fill={G.pink} center={G.sage} seeds={G.sand} seed={3} />
    </Art>
  );
}

export function TravelGardenRight() {
  return (
    <Art className="travel-garden-right" viewBox="0 0 240 340" preserve="xMaxYMax meet">
      <Blob x={230} y={290} r={86} lobes={6} wobble={0.14} fill={G.pink} seed={7} />
      <Sprig x={200} y={350} length={260} angle={-104} leaves={7} leafLen={54} fill={G.sage} stem={5} />
      <Sprig x={240} y={230} length={140} angle={-150} leaves={5} leafLen={38} fill={G.blue} stem={4} />
      <Flower x={150} y={262} r={28} fill={G.coral} seed={12} />
    </Art>
  );
}

/* ── Admin page: flowers down both sides, fixed while the forms scroll ── */

export function AdminGardenLeft() {
  return (
    <Art className="admin-garden admin-garden-left" viewBox="0 0 260 640" preserve="xMinYMax meet">
      <Blob x={10} y={600} r={110} lobes={7} wobble={0.13} fill={G.sand} seed={23} stretch={1.2} />
      <Blob x={-20} y={300} r={60} lobes={6} wobble={0.14} fill={G.pink} seed={5} />
      <Sprig x={60} y={660} length={460} angle={-84} bend={0.1} leaves={9} leafLen={70} leafWidth={0.46}
             fill={G.blue} stem={6} spread={56} />
      <Stalk x={150} y={660} height={300} lean={30} r={44} fill={G.coral} seed={7} leafLen={60} />
      <Sprig x={0} y={470} length={170} angle={-36} leaves={6} leafLen={42} fill={G.sage} stem={5} />
      <Flower x={40} y={200} r={30} fill={G.coral} seed={12} />
      <Flower x={200} y={470} r={18} fill={G.sand} center={G.coral} seeds={G.pink} seed={4} />
      <Leaf x={190} y={620} len={80} width={0.5} angle={-40} fill={G.sage} />
    </Art>
  );
}

export function AdminGardenRight() {
  return (
    <Art className="admin-garden admin-garden-right" viewBox="0 0 260 900" preserve="xMaxYMax meet">
      <Blob x={250} y={150} r={80} lobes={7} wobble={0.13} fill={G.pink} seed={31} />
      <Blob x={240} y={860} r={120} lobes={6} wobble={0.12} fill={G.blue} seed={17} stretch={1.1} />
      <Sprig x={260} y={330} length={200} angle={-150} leaves={7} leafLen={50} fill={G.sage} stem={5} />
      <Flower x={190} y={120} r={38} fill={G.coral} seed={9} />
      <Flower x={240} y={260} r={20} fill={G.sand} center={G.sage} seeds={G.coral} seed={6} />
      <Sprig x={210} y={920} length={520} angle={-100} bend={0.08} leaves={9} leafLen={72} leafWidth={0.46}
             fill={G.sage} stem={6} spread={54} />
      <Stalk x={110} y={920} height={330} lean={-40} r={48} fill={G.pink} seed={2} leafLen={66} />
      <Stalk x={170} y={920} height={190} lean={20} r={30} fill={G.coral} seed={14} leafLen={46} />
      <Leaf x={120} y={560} len={80} width={0.5} angle={-150} fill={G.blue} />
    </Art>
  );
}
