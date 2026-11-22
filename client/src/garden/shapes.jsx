/* eslint-disable react-refresh/only-export-components -- shared palette/helpers live next to the shape components; only affects hot-reload granularity */
// Cut-paper botanical primitives (SVG), recreated from the Figma designs.
// All shapes are deterministic (seeded), so they render identically every time.

export const G = {
  blue: '#859eb5',
  sage: '#647759',
  coral: '#d69c85',
  sand: '#e2bc93',
  pink: '#e4c1ca',
  ink: '#344b3f',
};

const r1 = (n) => Math.round(n * 10) / 10;
const rad = (deg) => (deg * Math.PI) / 180;

/** Small seeded PRNG (mulberry32). */
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth closed path through points (Catmull-Rom -> cubic Bezier). */
function closedCurve(pts) {
  const n = pts.length;
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return `${d}Z`;
}

/** Almond leaf pointing along +x from the origin. */
export function leafPath(len, width = 0.42) {
  const w = (len * width) / 2;
  return `M0 0C${r1(len * 0.22)} ${r1(-w * 1.35)} ${r1(len * 0.72)} ${r1(-w * 1.15)} ${r1(len)} 0`
    + `C${r1(len * 0.72)} ${r1(w * 1.15)} ${r1(len * 0.22)} ${r1(w * 1.35)} 0 0Z`;
}

export function Leaf({ x = 0, y = 0, len = 40, width = 0.42, angle = 0, fill = G.sage }) {
  return <path d={leafPath(len, width)} fill={fill} transform={`translate(${x} ${y}) rotate(${angle})`} />;
}

/**
 * A stem with alternating leaves (the blue/green sprigs in the designs).
 * Grows from (x, y) in direction `angle` (degrees, 0 = right, -90 = up).
 */
export function Sprig({
  x = 0, y = 0, length = 120, angle = -90, bend = 0.18, leaves = 6, leafLen = 30,
  leafWidth = 0.42, spread = 52, fill = G.blue, stem = 3, tip = true, startAt = 0.2,
}) {
  const ctrl = [length / 2, length * bend];
  const at = (t) => [2 * (1 - t) * t * ctrl[0] + t * t * length, 2 * (1 - t) * t * ctrl[1]];
  const tangent = (t) => {
    const dx = 2 * (1 - t) * ctrl[0] + 2 * t * (length - ctrl[0]);
    const dy = 2 * (1 - t) * ctrl[1] - 2 * t * ctrl[1];
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };
  const items = [];
  for (let i = 0; i < leaves; i++) {
    const t = startAt + (i * (0.92 - startAt)) / Math.max(1, leaves - 1);
    const [px, py] = at(t);
    const side = i % 2 === 0 ? -1 : 1;
    const len = leafLen * (1.05 - 0.35 * t);
    items.push(<Leaf key={i} x={px} y={py} len={len} width={leafWidth} angle={tangent(t) + side * spread} fill={fill} />);
  }
  if (tip) {
    items.push(<Leaf key="tip" x={length} y={0} len={leafLen * 0.75} width={leafWidth} angle={tangent(1)} fill={fill} />);
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={`M0 0Q${r1(ctrl[0])} ${r1(ctrl[1])} ${length} 0`} stroke={fill} strokeWidth={stem}
            strokeLinecap="round" fill="none" />
      {items}
    </g>
  );
}

/** Regular polygon points around (0,0). */
function polygon(sides, radius, rot = 0) {
  return Array.from({ length: sides }, (_, i) => {
    const a = rad(rot + (360 / sides) * i);
    return [Math.cos(a) * radius, Math.sin(a) * radius];
  });
}

const pts = (list) => list.map(([a, b]) => `${r1(a)},${r1(b)}`).join(' ');

/** Five-petal cut-paper flower with an octagon center and little square "seeds". */
export function Flower({
  x = 0, y = 0, r = 40, petals = 5, fill = G.coral, center = G.sage, seeds = G.sand,
  rotate = 0, seed = 1, petalWidth = 0.82,
}) {
  const rand = rng(seed);
  const items = [];
  for (let i = 0; i < petals; i++) {
    const len = r * (0.92 + rand() * 0.16);
    const w = (len * petalWidth) / 2;
    // Broad, slightly squared petal (cut paper), widest near the tip.
    const d = `M0 0C${r1(len * 0.18)} ${r1(-w * 0.9)} ${r1(len * 0.8)} ${r1(-w * 1.15)} ${r1(len)} ${r1(-w * 0.25)}`
      + `L${r1(len * 0.98)} ${r1(w * 0.3)}C${r1(len * 0.78)} ${r1(w * 1.1)} ${r1(len * 0.18)} ${r1(w * 0.9)} 0 0Z`;
    items.push(<path key={i} d={d} fill={fill} transform={`rotate(${rotate + (360 / petals) * i + (rand() - 0.5) * 8})`} />);
  }
  const cr = r * 0.3;
  const sq = cr * 0.3;
  return (
    <g transform={`translate(${x} ${y})`}>
      {items}
      <polygon points={pts(polygon(8, cr, 22.5 + rotate))} fill={center} />
      {[[-0.38, -0.3], [0.32, -0.36], [0.05, 0.32], [-0.4, 0.38]].map(([dx, dy], i) => (
        <rect key={i} x={dx * cr - sq / 2} y={dy * cr - sq / 2} width={sq} height={sq} fill={seeds}
              transform={`rotate(${15 + i * 20} ${dx * cr} ${dy * cr})`} />
      ))}
    </g>
  );
}

/** Organic squiggly blob (the pastel puddles in the designs): each point's
 *  radius varies irregularly, then a smooth curve runs through them. */
export function Blob({ x = 0, y = 0, r = 60, lobes = 5, wobble = 0.07, fill = G.blue, seed = 1, stretch = 1 }) {
  const rand = rng(seed);
  const n = Math.max(5, lobes);
  const amount = Math.min(0.32, wobble * 1.8);
  const phase = rand() * Math.PI;
  const list = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + (rand() - 0.5) * (Math.PI / n);
    const k = 1 + (rand() * 2 - 1) * amount;
    return [Math.cos(a + phase) * r * k * stretch, Math.sin(a + phase) * r * k];
  });
  return <path d={closedCurve(list)} fill={fill} transform={`translate(${x} ${y})`} />;
}

/** Torn-paper rectangle with jagged edges. */
export function Torn({ x = 0, y = 0, w = 100, h = 140, fill = G.sand, seed = 1, jag = 0.03, rotate = 0, steps = 4 }) {
  const rand = rng(seed);
  const j = () => (rand() - 0.5) * jag * Math.max(w, h) * 2;
  const list = [];
  for (let i = 0; i < steps; i++) list.push([(w * i) / steps + j() * 0.4, j()]);
  for (let i = 0; i < steps; i++) list.push([w + j(), (h * i) / steps + j() * 0.4]);
  for (let i = steps; i > 0; i--) list.push([(w * i) / steps + j() * 0.4, h + j()]);
  for (let i = steps; i > 0; i--) list.push([j(), (h * i) / steps + j() * 0.4]);
  return <polygon points={pts(list)} fill={fill} transform={`translate(${x} ${y}) rotate(${rotate} ${w / 2} ${h / 2})`} />;
}

/** Scattered paper confetti: [x, y, size, color, rotation, sides]. */
export function Confetti({ items }) {
  return (
    <g>
      {items.map(([x, y, s, fill, rot = 0, sides = 5], i) => (
        <polygon key={i} points={pts(polygon(sides, s, rot))} fill={fill} transform={`translate(${x} ${y})`} />
      ))}
    </g>
  );
}

/** A flower on a curved stem with a couple of leaves. */
export function Stalk({
  x = 0, y = 0, height = 260, lean = 30, r = 42, fill = G.coral, stemColor = G.sage, leafLen = 60, seed = 1,
}) {
  const top = [lean, -height];
  const c = [lean * 0.2 - 10, -height * 0.55];
  const at = (t) => [2 * (1 - t) * t * c[0] + t * t * top[0], 2 * (1 - t) * t * c[1] + t * t * top[1]];
  const [l1x, l1y] = at(0.35);
  const [l2x, l2y] = at(0.6);
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0 0Q${r1(c[0])} ${r1(c[1])} ${r1(top[0])} ${r1(top[1])}`} stroke={stemColor} strokeWidth={r * 0.16}
            strokeLinecap="round" fill="none" />
      <Leaf x={l1x} y={l1y} len={leafLen} width={0.5} angle={200} fill={stemColor} />
      <Leaf x={l2x} y={l2y} len={leafLen * 0.85} width={0.5} angle={-20} fill={stemColor} />
      <Flower x={top[0]} y={top[1]} r={r} fill={fill} seed={seed} rotate={seed * 17} />
    </g>
  );
}
