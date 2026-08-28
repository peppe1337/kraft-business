// HeroScene — painterly recreation of the reference hero frame (2510x1440).
// Golden-hour key light from the upper right: hot cream cauliflower clouds and
// sunlit olive-gold grass/dirt against slate-teal sky, with deep near-black
// shadow masses. Inline SVG only: gradients, filters, hand-drawn + generated paths.

// ---------------------------------------------------------------- helpers
function mulberry(seed: number) {
  let s = (seed * 7919 + 13) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s % 100000) / 100000;
  };
}

// lumpy scalloped cloud mass: opaque compound outline of many small arc bumps
function scallop(
  cx: number, cy: number, rx: number, ry: number,
  n: number, seed: number, flatBottom = 0.55,
): string {
  const rand = mulberry(seed);
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const j = 0.8 + rand() * 0.32;
    const x = cx + Math.cos(a) * rx * j;
    let dy = Math.sin(a) * ry * j;
    if (dy > 0) dy *= flatBottom; // calmer underside
    pts.push([x, cy + dy]);
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i <= n; i++) {
    const [x, y] = pts[i % n];
    const [px, py] = pts[i - 1];
    const r = Math.hypot(x - px, y - py) * 0.62;
    d += ` A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d + " Z";
}

// soft irregular grass mottle blob
function blob(cx: number, cy: number, rx: number, ry: number, seed: number): string {
  const rand = mulberry(seed + 500);
  const pts: Array<[number, number]> = [];
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const j = 0.7 + rand() * 0.5;
    pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i <= n; i++) {
    const [x, y] = pts[i % n];
    const [px, py] = pts[i - 1];
    d += ` Q${((px + x) / 2 + (y - py) * 0.18).toFixed(1)},${((py + y) / 2 - (x - px) * 0.18).toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d + " Z";
}

const crestTufts: Array<[number, number, number, string, number]> = [
  // [x, y, scale, color, rotation] — serrated silhouette along the crest
  [60, 722, 2.0, "#6d8a2e", -6], [130, 712, 1.5, "#78922f", 4], [200, 694, 1.9, "#6d8a2e", -3],
  [268, 674, 1.4, "#78922f", 5], [335, 652, 2.0, "#78922f", -4], [400, 630, 1.5, "#84a038", 6],
  [465, 610, 1.9, "#84a038", -4], [530, 588, 1.4, "#84a038", 3], [598, 564, 2.0, "#84a038", -5],
  [665, 542, 1.5, "#8aa53f", 4], [730, 522, 1.9, "#8aa53f", -3], [795, 502, 1.6, "#8aa53f", 5],
  [858, 482, 2.0, "#98ab42", -2], [925, 464, 1.6, "#98ab42", 4], [990, 452, 2.1, "#a8b84a", -3],
  [1055, 444, 1.6, "#98ab42", 2], [1120, 440, 2.0, "#a8b84a", -4], [1185, 446, 1.5, "#98ab42", 3],
  [1250, 466, 1.9, "#8aa53f", -3], [1315, 496, 1.5, "#8aa53f", 5], [1385, 532, 1.8, "#84a038", -3],
  [1470, 568, 1.6, "#84a038", 4], [1560, 602, 1.8, "#84a038", -5], [1655, 638, 1.5, "#78922f", 3],
  [1750, 674, 1.8, "#78922f", -2], [1845, 716, 1.4, "#6d8a2e", 4], [1940, 768, 1.6, "#6d8a2e", -4],
  [2035, 822, 1.3, "#5f7a26", 3], [2120, 874, 1.4, "#5f7a26", -3], [2195, 924, 1.2, "#42561e", 4],
];

const fieldTufts: Array<[number, number, number, string, number]> = [
  // clustered along the dirt-terrace edges + lit slopes
  [822, 636, 1.1, "#84a038", -4], [790, 764, 1.3, "#78922f", 3], [806, 902, 1.2, "#84a038", -2],
  [858, 1042, 1.4, "#78922f", 4], [990, 1080, 1.3, "#6d8a2e", -3], [1150, 1010, 1.2, "#78922f", 2],
  [1330, 1090, 1.4, "#6d8a2e", -4], [1520, 1200, 1.2, "#78922f", 3], [1700, 1290, 1.3, "#84a038", -2],
  [1884, 1290, 1.1, "#84a038", 3], [1248, 688, 1.1, "#8aa53f", -3], [1452, 800, 1.2, "#8aa53f", 2],
  [1660, 850, 1.1, "#98ab42", -2], [1062, 560, 1.0, "#8aa53f", 3], [1176, 622, 1.0, "#98ab42", -2],
  [420, 880, 1.4, "#8aa53f", -4], [530, 934, 1.1, "#84a038", 5], [640, 990, 1.5, "#8aa53f", -2],
  [340, 1010, 1.1, "#2a3a12", -5], [220, 1090, 1.3, "#2a3a12", 4], [520, 1180, 1.1, "#33400f", -3],
  [700, 1264, 1.4, "#2a3a12", 5], [900, 1332, 1.2, "#33400f", -4], [1560, 690, 1.0, "#8aa53f", -3],
  [1960, 960, 1.2, "#98ab42", -4], [2060, 950, 1.0, "#8aa53f", 3], [1880, 1300, 1.0, "#5f7a26", -3],
];

// tiny irregular dark specks scattered over the dirt patch (+ a few sticks)
const specks: Array<[number, number, number, number]> = (() => {
  const rand = mulberry(42);
  const out: Array<[number, number, number, number]> = [];
  for (let i = 0; i < 42; i++) {
    const t = rand();
    const w = 55 + t * 240;
    let cx = 1040 + t * 900 + (rand() - 0.5) * 2 * w * 0.5;
    const cy = 600 + t * 520 + (rand() - 0.5) * 2 * (30 + t * 90);
    if (cx < 990) cx = 990 + rand() * 60;
    if (cx > 2040) cx = 2040 - rand() * 120;
    out.push([cx, cy, 4 + rand() * 6, rand() * 360]);
  }
  return out;
})();

const wireFan: string[] = [
  // fan entering the left edge, sagging catenaries converging on the front pole crossarms
  "M0,362 Q450,470 878,60",
  "M0,388 Q440,492 880,78",
  "M0,412 Q460,516 882,96",
  "M0,438 Q450,540 884,150",
  "M0,462 Q470,566 886,168",
  "M0,492 Q460,594 888,186",
  "M0,516 Q480,622 890,268",
  "M0,540 Q470,648 892,288",
  "M0,562 Q480,676 894,308",
];

const wireSpans: string[] = [
  // short spans between the two poles, plus exits up-right
  "M906,58 Q980,120 1044,112",
  "M906,96 Q982,158 1046,126",
  "M906,170 Q984,214 1046,140",
  "M906,292 Q986,330 1048,152",
  "M1050,112 Q1230,40 1400,-12",
  "M1050,128 Q1240,64 1430,-12",
];

// three tuft silhouettes so instances never read as one stamped sprite
const tuftShapes: string[] = [
  "M0,0 l3,-13 l3,9 l4,-17 l4,12 l4,-11 l4,15 l5,-14 l3,10 l4,-8 l3,12 l-37,4 z",
  "M0,0 l4,-16 l3,10 l5,-21 l4,13 l5,-11 l4,16 l4,-10 l4,12 l-33,7 z",
  "M0,0 l2,-10 l4,14 l3,-18 l5,11 l3,-14 l5,16 l4,-12 l3,9 l5,-7 l2,11 l-36,0 z",
];

// grass mottle patches: alternating warm olive and cooler green
const mottlePatches: Array<[number, number, number, number, string, number]> = [
  [300, 830, 130, 60, "#98ab42", 1], [560, 920, 150, 70, "#6d8a2e", 2],
  [180, 990, 140, 65, "#3a4a1e", 3], [700, 1080, 160, 70, "#8aa53f", 4],
  [430, 1130, 140, 60, "#5f7a26", 5], [940, 1300, 170, 70, "#3a4a1e", 6],
  [1250, 1330, 160, 65, "#4f6636", 7], [620, 700, 120, 55, "#8aa53f", 8],
  [880, 560, 110, 46, "#98ab42", 9], [1120, 500, 120, 44, "#a8b84a", 10],
  [1330, 560, 110, 48, "#78922f", 11], [1540, 700, 130, 55, "#98ab42", 12],
  [1740, 800, 140, 60, "#8aa53f", 13], [1950, 900, 130, 55, "#78922f", 14],
  [1620, 1000, 130, 55, "#6d8a2e", 15], [1840, 1310, 140, 55, "#4f6636", 16],
  [240, 720, 110, 45, "#6d8a2e", 17], [1440, 660, 100, 40, "#98ab42", 18],
];

// dirt terrace: narrow neck from the crest saddle (946,468) opening into a
// WIDE flat trapezoid (x~1040-2120, y~750-1260) whose lower-left grass edge is
// a nearly straight jittered diagonal; the right end meets the cliff lip.
const dirtPath =
  "M946,468 " +
  // right side of the crest saddle, opening wide immediately
  "C 986,486 1032,520 1068,556 " +
  "L 1096,584 L 1088,598 L 1124,622 " +
  // top boundary running down-right, shallow slope, jittered
  "L 1200,656 L 1192,670 L 1288,700 " +
  "L 1382,732 L 1374,748 L 1470,772 " +
  "L 1562,800 L 1554,814 L 1652,846 " +
  "L 1742,880 L 1734,894 L 1832,932 " +
  "L 1920,972 L 1990,1004 L 2058,1042 L 2112,1082 " +
  // down the cliff lip on the right
  "C 2140,1104 2148,1136 2134,1168 " +
  "L 2072,1210 L 2002,1250 L 1912,1292 L 1808,1322 L 1682,1334 " +
  "L 1584,1316 L 1494,1278 " +
  // straight-ish lower-left diagonal boundary, jitter nodes back up-left
  "L 1428,1230 L 1370,1170 L 1382,1158 L 1310,1092 " +
  "L 1244,1022 L 1256,1008 L 1188,940 " +
  "L 1126,872 L 1138,858 L 1072,792 " +
  "L 1022,732 L 1034,720 L 986,662 " +
  // up the left side of the neck to the saddle
  "C 958,620 944,556 946,468 Z";

// land silhouette shared by the paint pass and the texture clip
const landPath =
  "M0,728 C 80,714 170,700 260,676 C 360,648 470,610 570,572 C 680,530 790,494 880,470 " +
  "C 940,455 1000,446 1060,442 C 1130,438 1200,444 1265,462 C 1330,482 1390,510 1450,545 " +
  "C 1520,585 1600,616 1690,646 C 1780,676 1860,712 1920,756 C 2000,792 2090,828 2170,866 " +
  "C 2210,884 2240,904 2258,928 C 2276,956 2290,1010 2304,1080 C 2334,1200 2370,1320 2400,1440 " +
  "L 0,1440 Z";

export default function HeroScene() {
  return (
    <svg
      viewBox="0 0 2510 1440"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        {/* ------------------------------------------------ sky + atmosphere */}
        <linearGradient id="hscC-sky" x1="0" y1="0" x2="0.9" y2="0.55">
          <stop offset="0" stopColor="#22353a" />
          <stop offset="0.35" stopColor="#283a40" />
          <stop offset="0.62" stopColor="#2f424a" />
          <stop offset="1" stopColor="#37494f" />
        </linearGradient>
        <radialGradient id="hscC-skyWarm" cx="0.8" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#5c5a4e" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#43504e" stopOpacity="0.24" />
          <stop offset="1" stopColor="#34464b" stopOpacity="0" />
        </radialGradient>
        {/* ------------------------------------------------ terrain */}
        <radialGradient id="hscC-domeLit" cx="0.64" cy="0.16" r="0.95">
          <stop offset="0" stopColor="#b4bc48" />
          <stop offset="0.4" stopColor="#a2b040" />
          <stop offset="0.75" stopColor="#90a238" />
          <stop offset="1" stopColor="#74882c" />
        </radialGradient>
        <linearGradient id="hscC-grassBand" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b4bc48" />
          <stop offset="0.5" stopColor="#9cab3e" />
          <stop offset="1" stopColor="#7f902e" />
        </linearGradient>
        <linearGradient id="hscC-grassBase" x1="0.8" y1="0" x2="0.1" y2="1">
          <stop offset="0" stopColor="#90a238" />
          <stop offset="0.4" stopColor="#74882c" />
          <stop offset="0.75" stopColor="#46541e" />
          <stop offset="1" stopColor="#243310" />
        </linearGradient>
        <linearGradient id="hscC-dirt" x1="0.85" y1="0.1" x2="0.15" y2="0.95">
          <stop offset="0" stopColor="#c98a62" />
          <stop offset="0.45" stopColor="#c27b4c" />
          <stop offset="1" stopColor="#9a5c34" />
        </linearGradient>
        <linearGradient id="hscC-dirtTongue" x1="0.9" y1="0" x2="0.1" y2="1">
          <stop offset="0" stopColor="#c27b4c" />
          <stop offset="1" stopColor="#96552c" />
        </linearGradient>
        {/* ------------------------------------------------ rock + cliffs */}
        <linearGradient id="hscC-rockLit" x1="1" y1="0" x2="0" y2="0.9">
          <stop offset="0" stopColor="#b59a72" />
          <stop offset="0.55" stopColor="#977a58" />
          <stop offset="1" stopColor="#7c6448" />
        </linearGradient>
        <linearGradient id="hscC-cliffR" x1="0.9" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#6b4a35" />
          <stop offset="0.5" stopColor="#4f3728" />
          <stop offset="1" stopColor="#33241a" />
        </linearGradient>
        <linearGradient id="hscC-gable" x1="1" y1="0.2" x2="0" y2="0.9">
          <stop offset="0" stopColor="#4b3018" />
          <stop offset="0.6" stopColor="#3a250f" />
          <stop offset="1" stopColor="#291a0f" />
        </linearGradient>
        {/* ------------------------------------------------ figure + laptop */}
        <radialGradient id="hscC-screen" cx="0.5" cy="0.42" r="0.75">
          <stop offset="0" stopColor="#d9dcc8" />
          <stop offset="0.5" stopColor="#c2c4ae" />
          <stop offset="1" stopColor="#abac99" />
        </radialGradient>
        {/* ------------------------------------------------ grade */}
        <radialGradient id="hscC-vignette" cx="0.52" cy="0.46" r="0.78">
          <stop offset="0" stopColor="#000000" stopOpacity="0" />
          <stop offset="0.68" stopColor="#000000" stopOpacity="0" />
          <stop offset="0.88" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.24" />
        </radialGradient>
        <radialGradient id="hscC-warmGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f2d5ad" stopOpacity="0.16" />
          <stop offset="0.6" stopColor="#e0bc96" stopOpacity="0.07" />
          <stop offset="1" stopColor="#e0bc96" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hscC-coolLeft" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0" stopColor="#22353a" stopOpacity="0.07" />
          <stop offset="1" stopColor="#22353a" stopOpacity="0" />
        </linearGradient>
        {/* full-canvas golden-hour tint: warm from upper-right, clear lower-left */}
        <linearGradient id="hscC-sunTint" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.24" />
          <stop offset="0.45" stopColor="#ffd9a0" stopOpacity="0.1" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hscC-sunScreen" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe2b0" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#ffd9a0" stopOpacity="0.2" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
        {/* soft luminous cloud interiors: bright core toward upper-right */}
        <radialGradient id="hscC-cloudCore" cx="0.62" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#fdf0dc" />
          <stop offset="0.55" stopColor="#f2dcbc" />
          <stop offset="1" stopColor="#e3c4a0" />
        </radialGradient>
        <radialGradient id="hscC-cloudCoreBright" cx="0.62" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#fef5e6" />
          <stop offset="0.6" stopColor="#f8e6cc" />
          <stop offset="1" stopColor="#ecd2b0" />
        </radialGradient>
        <radialGradient id="hscC-cloudLeft" cx="0.68" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#f3dcbe" />
          <stop offset="0.55" stopColor="#e8c9a8" />
          <stop offset="1" stopColor="#d9b090" />
        </radialGradient>
        {/* ------------------------------------------------ filters */}
        <filter id="hscC-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="hscC-cloudSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
        <filter id="hscC-cloudFeather" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
        <filter id="hscC-soft3" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="hscC-haze" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="hscC-band" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        {/* whole-scene painterly grain */}
        <filter id="hscC-mottle" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.38  0 0 0 0.9 0"
          />
        </filter>
        <clipPath id="hscC-landClip">
          <path d={landPath} />
        </clipPath>
        <clipPath id="hscC-dirtClip">
          <path d={dirtPath} />
        </clipPath>
      </defs>

      {/* ============================================================ SKY */}
      <g id="sky">
        <rect x="0" y="0" width="2510" height="1440" fill="url(#hscC-sky)" />
        <rect x="0" y="0" width="2510" height="1440" fill="url(#hscC-skyWarm)" />
      </g>

      {/* ===================================================== CLOUDS FAR */}
      <g id="clouds-far">
        {/* hazy small mass in the very top-right corner (behind the tower) */}
        <g filter="url(#hscC-haze)">
          <ellipse cx="2440" cy="70" rx="300" ry="150" fill="#8a7660" opacity="0.45" />
          <ellipse cx="1560" cy="300" rx="200" ry="100" fill="#6e6152" opacity="0.22" />
        </g>
        {/* left cream bank behind the crest and wires: soft feathered lobes
            spilling past the canvas edge — no straight or sticker edges */}
        <g id="left-bank" filter="url(#hscC-cloudFeather)">
          <ellipse cx="-80" cy="600" rx="400" ry="260" fill="url(#hscC-cloudLeft)" />
          <ellipse cx="170" cy="520" rx="260" ry="175" fill="url(#hscC-cloudLeft)" />
          <ellipse cx="350" cy="590" rx="180" ry="115" fill="#e8c9a8" opacity="0.95" />
          <ellipse cx="100" cy="420" rx="175" ry="110" fill="#f3dcbe" />
          <ellipse cx="280" cy="450" rx="125" ry="82" fill="#f3dcbe" opacity="0.92" />
          <ellipse cx="30" cy="680" rx="270" ry="135" fill="#d9b090" opacity="0.85" />
          <ellipse cx="260" cy="700" rx="185" ry="92" fill="#9a7159" opacity="0.5" />
        </g>
        {/* thin wisps: near the poles + right of the summit rock */}
        <g filter="url(#hscC-cloudSoft)">
          <path d={scallop(770, 330, 160, 32, 10, 25)} fill="#e6d0b4" opacity="0.32" />
          <path d={scallop(1660, 385, 175, 50, 10, 26)} fill="#ecd6ba" opacity="0.42" />
          <path d={scallop(1600, 420, 130, 34, 9, 27)} fill="#9a7159" opacity="0.25" />
        </g>
      </g>

      {/* =================================================== CLOUDS RIGHT */}
      <g id="clouds-right">
        {/* big stacked cauliflower tower, upper right */}
        <g id="tower" filter="url(#hscC-cloudSoft)">
          {/* back warm-gray masses */}
          <path d={scallop(1940, 360, 400, 310, 16, 3)} fill="#9c8a80" />
          <path d={scallop(2330, 460, 350, 300, 15, 4)} fill="#9c8a80" opacity="0.92" />
          {/* cream mid masses with lumpy scalloped tops + luminous interiors */}
          <path d={scallop(2160, 235, 430, 290, 18, 5)} fill="url(#hscC-cloudCore)" />
          <path d={scallop(1880, 420, 290, 225, 14, 6)} fill="url(#hscC-cloudCore)" />
          <path d={scallop(2400, 360, 280, 240, 14, 33)} fill="url(#hscC-cloudCore)" opacity="0.96" />
          {/* bright rim lobes offset toward the sun (upper right) */}
          <path d={scallop(2290, 70, 225, 135, 12, 7)} fill="url(#hscC-cloudCoreBright)" />
          <path d={scallop(2030, 130, 165, 110, 10, 8)} fill="#fbeedd" opacity="0.95" />
          <path d={scallop(2465, 205, 150, 115, 10, 9)} fill="#fbeedd" opacity="0.92" />
          <path d={scallop(1790, 228, 120, 85, 9, 28)} fill="#f6e5cc" opacity="0.85" />
          {/* warm underside shade hugging the bottom-left lobes */}
          <path d={scallop(1890, 570, 265, 115, 12, 10)} fill="#9a7159" opacity="0.65" />
          <path d={scallop(2210, 610, 300, 105, 12, 11)} fill="#c9a084" opacity="0.6" />
        </g>
        {/* low band lower-right — passes BEHIND/BELOW the right cliff edge */}
        <g id="low-band" filter="url(#hscC-cloudSoft)">
          <path d={scallop(2240, 860, 330, 195, 14, 12)} fill="#9c8a80" />
          <path d={scallop(2390, 790, 300, 210, 14, 13)} fill="url(#hscC-cloudCore)" />
          <path d={scallop(2465, 690, 175, 118, 10, 14)} fill="url(#hscC-cloudCoreBright)" />
          <path d={scallop(2210, 745, 150, 100, 9, 29)} fill="#f6e5cc" opacity="0.9" />
          <path d={scallop(2220, 965, 285, 115, 12, 15)} fill="#c9a084" opacity="0.6" />
        </g>
        {/* small puffs, bottom-right corner (below the cliff overhang) */}
        <g id="corner-puffs" filter="url(#hscC-cloudSoft)">
          <path d={scallop(2420, 1245, 185, 140, 12, 16)} fill="url(#hscC-cloudCore)" />
          <path d={scallop(2485, 1165, 115, 82, 8, 17)} fill="#fbeedd" />
          <path d={scallop(2385, 1340, 190, 108, 10, 18)} fill="#c9a084" opacity="0.6" />
          <path d={scallop(2490, 1405, 175, 110, 10, 19)} fill="url(#hscC-cloudCore)" />
        </g>
      </g>

      {/* ======================================================== TERRAIN */}
      <g id="terrain">
        {/* land silhouette */}
        <path id="land-base" d={landPath} fill="url(#hscC-grassBase)" />
        {/* sunlit summit dome */}
        <path
          d="M820,560 C 870,502 940,466 1010,450 C 1070,436 1130,432 1190,440
             C 1260,450 1320,476 1380,516 C 1430,550 1470,584 1495,626
             C 1512,660 1494,692 1444,706 C 1374,726 1274,730 1174,716
             C 1074,702 970,678 900,644 C 850,618 802,596 820,560 Z"
          fill="url(#hscC-domeLit)"
        />
        <path
          d="M1000,456 C 1070,444 1150,444 1220,458 C 1170,472 1090,476 1020,470 C 990,466 986,460 1000,456 Z"
          fill="#8c762f"
          opacity="0.6"
        />
        {/* lit grass hump between the crest and the dirt top boundary */}
        <path
          d="M1430,560 C 1580,600 1730,660 1870,730 C 2000,796 2110,876 2190,960
             C 2230,1006 2222,1036 2170,1036 C 2070,1028 1950,990 1830,940
             C 1690,880 1540,800 1440,724 C 1392,682 1380,600 1430,560 Z"
          fill="url(#hscC-grassBand)"
          opacity="0.9"
        />
        {/* mid-tone slope between cabin and path */}
        <path
          d="M560,620 C 660,590 760,570 850,580 C 920,588 950,630 930,690
             C 905,760 860,830 800,880 C 720,940 620,970 520,970
             C 430,970 360,930 380,860 C 405,780 470,668 560,620 Z"
          fill="#4a5c22"
          opacity="0.5"
        />
        {/* soft grass mottling patches (warm/cool alternation) */}
        <g id="mottle-patches" filter="url(#hscC-soft)" opacity="0.32">
          {mottlePatches.map(([cx, cy, rx, ry, c, sd], i) => (
            <path key={i} d={blob(cx, cy, rx, ry, sd)} fill={c} />
          ))}
        </g>
        {/* DIRT: broad, nearly straight tapering wedge from the crest saddle
            down-right past the figure, tongue reaching the right cliff edge */}
        <path id="dirt-main" d={dirtPath} fill="url(#hscC-dirt)" />
        {/* grass bites into the dirt edges (on the terrace boundaries) */}
        <path d="M960,600 q42,-16 62,10 q-8,42 -50,38 q-32,-16 -12,-48 z" fill="#78922f" opacity="0.9" />
        <path d="M1196,648 q36,-14 54,8 q-6,34 -44,32 q-30,-12 -10,-40 z" fill="#8aa53f" opacity="0.85" />
        <path d="M1470,764 q34,-12 52,10 q-6,32 -42,28 q-28,-12 -10,-38 z" fill="#9cab3e" opacity="0.8" />
        <path d="M1740,876 q34,-10 50,14 q-6,30 -44,26 q-28,-12 -6,-40 z" fill="#9cab3e" opacity="0.8" />
        <path d="M2000,1010 q34,-10 50,14 q-6,30 -44,26 q-28,-12 -6,-40 z" fill="#8aa53f" opacity="0.8" />
        <path d="M1150,900 q42,-10 60,18 q-10,38 -52,30 q-32,-16 -8,-48 z" fill="#4f6a24" opacity="0.9" />
        <path d="M1305,1085 q40,-12 60,14 q-8,36 -50,30 q-32,-14 -10,-44 z" fill="#42561e" opacity="0.9" />
        <path d="M1440,1224 q38,-8 52,22 q-8,34 -46,28 q-30,-16 -6,-50 z" fill="#42561e" opacity="0.9" />
        {/* dirt light logic, clipped to the terrace */}
        <g clipPath="url(#hscC-dirtClip)">
          {/* bright lit dirt RIGHT of the figure, out to the cliff lip */}
          <path
            d="M1500,880 C 1680,930 1860,1000 2000,1070 C 2110,1128 2150,1180 2110,1220
               C 1970,1240 1780,1200 1620,1130 C 1480,1068 1400,980 1400,920
               C 1404,888 1440,868 1500,880 Z"
            fill="#cd9166"
            opacity="0.72"
            filter="url(#hscC-soft)"
          />
          {/* lit crest dirt at the saddle */}
          <path d="M950,470 C 1010,500 1060,560 1100,630 C 1030,590 970,530 944,486 Z" fill="#cd9166" opacity="0.5" filter="url(#hscC-soft3)" />
          {/* broad diagonal shadow band across the dirt LEFT of the figure,
              continuing the foreground grass shadow */}
          <path
            d="M900,540 C 990,630 1090,720 1200,810 C 1320,904 1400,990 1450,1090
               L 1580,1280 L 1240,1280 C 1080,1120 970,940 920,780
               C 895,700 890,610 900,540 Z"
            fill="#502e20"
            opacity="0.42"
            filter="url(#hscC-band)"
          />
          {/* shade band hugging the lower boundary of the terrace */}
          <path
            d="M1300,1120 C 1470,1200 1680,1250 1920,1266 C 2060,1272 2150,1248 2210,1206
               L 2250,1440 L 1260,1440 Z"
            fill="#502e20"
            opacity="0.28"
            filter="url(#hscC-band)"
          />
        </g>
        {/* dirt specks + sticks */}
        <g id="pebbles" opacity="0.8">
          {specks.map(([cx, cy, s, rot], i) => (
            <path
              key={i}
              d={`M${cx - s},${cy + s * 0.3} L${cx - s * 0.2},${cy - s * 0.5} L${cx + s},${cy - s * 0.2} L${cx + s * 0.5},${cy + s * 0.5} Z`}
              fill={i % 5 === 0 ? "#502e20" : "#3a2c22"}
              transform={`rotate(${rot % 70} ${cx} ${cy})`}
            />
          ))}
          <path d="M1180,880 l52,10 l-2,7 l-52,-10 z" fill="#3a2c22" transform="rotate(-14 1200 884)" />
          <path d="M1560,1100 l48,-8 l2,7 l-48,8 z" fill="#43332a" transform="rotate(8 1580 1098)" />
          <path d="M1010,760 l40,12 l-3,6 l-39,-12 z" fill="#3a2c22" transform="rotate(20 1030 766)" />
          <path d="M1760,1030 l44,6 l-1,7 l-44,-6 z" fill="#3a2c22" transform="rotate(-6 1780 1034)" />
          <path d="M1330,1150 l38,10 l-3,6 l-37,-10 z" fill="#43332a" transform="rotate(24 1348 1154)" />
        </g>
        {/* SUNLIT DIAGONAL BAND across the foreground grass */}
        <path
          id="sun-band"
          d="M340,872
             C 460,842 600,844 715,884
             C 830,924 920,986 990,1058
             C 1070,1140 1160,1212 1260,1262
             C 1320,1292 1340,1322 1300,1346
             C 1220,1392 1080,1382 955,1330
             C 825,1274 705,1188 605,1098
             C 505,1008 400,948 330,928
             C 300,916 306,888 340,872 Z"
          fill="url(#hscC-grassBand)"
          opacity="0.9"
        />
        <path
          d="M470,896 C 575,876 690,892 782,938 C 852,974 904,1028 934,1080
             C 862,1058 772,1010 690,968 C 608,928 525,906 470,896 Z"
          fill="#a8b84a"
          opacity="0.6"
        />
        {/* ONE deep near-black diagonal shadow band, lower-left corner toward
            frame center, same angle as the pole shadows, clipped to terrain */}
        <g clipPath="url(#hscC-landClip)">
          <path
            d="M0,1030 C 240,984 500,984 740,1044 C 950,1096 1100,1190 1180,1320
               L 980,1440 L 0,1440 Z"
            fill="#10160a"
            opacity="0.62"
            filter="url(#hscC-band)"
          />
          <path
            d="M0,868 L 400,806 L 760,880 L 520,972 L 0,1000 Z"
            fill="#10160a"
            opacity="0.45"
            filter="url(#hscC-band)"
          />
        </g>
        {/* residual dark shade masses */}
        <path
          id="shadow-corner"
          d="M0,1080 C 130,1096 280,1136 420,1196 C 550,1252 660,1330 730,1440 L 0,1440 Z"
          fill="#171f0f"
          opacity="0.8"
        />
        <path
          d="M1160,1310 C 1310,1350 1510,1360 1690,1344 C 1860,1330 2010,1350 2110,1400
             C 2140,1420 2130,1436 2090,1440 L 1060,1440 C 1050,1400 1100,1352 1160,1310 Z"
          fill="#171f0f"
          opacity="0.55"
        />
        {/* pole cast shadows: anchored at each pole base, tapering down-left */}
        <g filter="url(#hscC-soft3)">
          <path
            d="M872,886 L 906,886 C 840,948 748,1010 656,1058 C 628,1070 616,1064 626,1048
               C 706,996 800,936 872,886 Z"
            fill="#10160a"
            opacity="0.24"
          />
          <path
            d="M1046,544 L 1068,544 C 1020,588 950,636 890,668 C 872,676 864,670 872,658
               C 930,620 1000,576 1046,544 Z"
            fill="#1c260c"
            opacity="0.24"
          />
          {/* cabin long shadow, same down-left direction */}
          <path
            d="M450,842 L 672,830 C 600,896 480,956 360,996 C 320,1006 306,996 320,978
               C 370,930 420,880 450,842 Z"
            fill="#10160a"
            opacity="0.28"
          />
          {/* summit-rock long shadow onto the dome grass */}
          <path
            d="M1052,608 L 1240,618 C 1180,660 1080,696 990,712 C 962,714 954,704 966,692
               C 1000,660 1030,630 1052,608 Z"
            fill="#2a3a12"
            opacity="0.35"
          />
        </g>
        {/* crest + field tufts (three silhouettes, varied scale/rotation/hue) */}
        <g id="tufts">
          {crestTufts.map(([x, y, s, c, r], i) => (
            <path key={`c${i}`} d={tuftShapes[i % 3]} fill={c} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />
          ))}
          {fieldTufts.map(([x, y, s, c, r], i) => (
            <path key={`f${i}`} d={tuftShapes[(i + 1) % 3]} fill={c} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />
          ))}
        </g>
        {/* scattered painterly grass daubs */}
        <g opacity="0.4">
          <path d="M440,1050 q60,-18 122,-2 q-52,26 -118,16 z" fill="#2a3a12" transform="rotate(-10 500 1050)" />
          <path d="M700,1150 q66,-20 138,-4 q-58,28 -132,18 z" fill="#232e12" transform="rotate(-9 770 1150)" />
          <path d="M990,1272 q72,-22 152,-4 q-64,30 -146,20 z" fill="#1c260c" transform="rotate(-7 1065 1272)" />
          <path d="M1580,822 q60,-16 126,-2 q-52,24 -122,14 z" fill="#54500c" transform="rotate(13 1640 822)" />
          <path d="M1830,970 q54,-14 114,-2 q-48,22 -110,12 z" fill="#2a3a12" transform="rotate(17 1885 970)" />
          <path d="M240,760 q64,-18 132,-2 q-56,24 -128,16 z" fill="#33400f" transform="rotate(-5 305 760)" />
        </g>
        {/* foreground rocks half-sunk in grass */}
        <g id="fg-rocks">
          <path d="M800,930 l60,-22 l58,10 l24,30 l-30,26 l-70,6 l-44,-22 z" fill="#57503f" />
          <path d="M812,918 l48,-14 l50,8 l-40,20 l-52,-4 z" fill="#7a6f5c" />
          <path d="M980,1010 l40,-14 l40,8 l14,22 l-26,18 l-52,2 l-24,-20 z" fill="#4a4234" />
          <path d="M988,1002 l34,-10 l32,8 l-28,14 l-38,-2 z" fill="#6b6150" />
        </g>
      </g>

      {/* ========================================================= CLIFFS */}
      <g id="cliffs">
        {/* bottom-left face: near-black but with readable facet planes */}
        <path
          id="cliff-left"
          d="M0,1148
             C 90,1160 180,1186 270,1216
             C 370,1250 460,1298 540,1352
             C 600,1392 650,1420 690,1440
             L 0,1440 Z"
          fill="#050806"
        />
        <path d="M60,1190 L 210,1232 L 180,1310 L 40,1266 Z" fill="#241d14" opacity="0.85" />
        <path d="M280,1270 L 430,1322 L 396,1404 L 250,1352 Z" fill="#1a160d" opacity="0.95" />
        <path d="M120,1300 L 250,1352 L 216,1424 L 90,1382 Z" fill="#171310" opacity="0.85" />
        <path d="M420,1330 L 540,1390 L 510,1440 L 400,1400 Z" fill="#221c12" opacity="0.8" />
        {/* hanging grass lips over the left cliff edge */}
        <path d="M0,1140 q60,-6 120,10 q60,16 110,36 q-20,26 -70,16 q-70,-14 -120,-30 q-30,-10 -40,-32 z" fill="#2a3a12" />
        <path d="M150,1180 q70,10 130,38 q-16,30 -66,20 q-56,-12 -84,-34 q4,-18 20,-24 z" fill="#232e12" />
        <path d="M320,1250 q66,18 120,48 q-14,28 -60,18 q-52,-14 -80,-40 q4,-20 20,-26 z" fill="#171f0f" />
        {/* right cliff: faceted dark rock with warm catch-lights, clouds beyond it */}
        <path
          id="cliff-right"
          d="M1848,1044
             C 1930,1060 2010,1082 2090,1112
             C 2160,1140 2210,1112 2252,1050
             C 2270,1022 2288,1030 2300,1080
             C 2332,1200 2370,1320 2402,1440
             L 1720,1440
             C 1760,1370 1810,1280 1840,1200
             C 1858,1146 1856,1090 1848,1044 Z"
          fill="url(#hscC-cliffR)"
        />
        <path d="M1880,1080 L 2030,1110 L 2090,1160 L 1980,1150 L 1885,1115 Z" fill="#7a5640" opacity="0.9" />
        <path d="M2110,1140 L 2210,1190 L 2250,1280 L 2160,1230 L 2100,1170 Z" fill="#5c4130" opacity="0.85" />
        <path d="M1920,1160 L 2030,1190 L 2060,1260 L 1950,1230 Z" fill="#4a3423" opacity="0.9" />
        <path d="M2180,1300 L 2270,1350 L 2300,1440 L 2210,1400 Z" fill="#3a2a20" opacity="0.85" />
        <path d="M1970,1260 L 2080,1300 L 2050,1400 L 1950,1350 Z" fill="#33241a" opacity="0.9" />
        {/* crevice darks only */}
        <path d="M2038,1188 L 2062,1258 L 2048,1262 L 2026,1194 Z" fill="#171310" opacity="0.9" />
        <path d="M2158,1232 L 2196,1300 L 2182,1306 L 2148,1240 Z" fill="#171310" opacity="0.85" />
        <path d="M2230,1060 l56,26 l-10,16 l-58,-24 z" fill="#4a3423" opacity="0.7" />
        {/* grass lip hanging over the right cliff top */}
        <path d="M1836,1040 q80,-8 160,20 q70,24 120,56 q-24,26 -84,10 q-90,-22 -150,-48 q-46,-20 -46,-38 z" fill="#46541e" opacity="0.9" />
        <path d="M2110,1102 q54,14 92,42 q-14,20 -52,10 q-44,-12 -62,-36 q8,-14 22,-16 z" fill="#38470f" opacity="0.9" />
      </g>

      {/* ==================================================== SUMMIT ROCK */}
      <g id="summit-rock" transform="translate(-16 -16)">
        {/* grassy contact skirt so the slab sits INTO the dome, not on it */}
        <path
          d="M1100,540 q80,60 220,84 q140,22 236,-4 q30,26 -10,44 q-110,40 -250,18 q-140,-24 -216,-84 q-16,-36 20,-58 z"
          fill="#5a6c24"
          opacity="0.85"
          filter="url(#hscC-soft3)"
        />
        {/* main slab leaning right — warm sandstone with a hard lit/shade split */}
        <path
          id="rock-main"
          d="M1160,262
             L 1245,272 L 1330,308 L 1400,362 L 1462,428
             L 1508,492 L 1538,556 L 1528,606
             L 1440,622 L 1330,624 L 1230,604
             L 1160,566 L 1118,506 L 1094,432
             L 1090,352 L 1112,296 Z"
          fill="url(#hscC-rockLit)"
        />
        {/* shade planes left/underside */}
        <path d="M1112,296 L 1090,352 L 1094,432 L 1118,506 L 1160,566 L 1200,586 L 1170,500 L 1150,410 L 1150,320 Z" fill="#443c30" />
        <path d="M1230,604 L 1330,624 L 1440,622 L 1420,592 L 1300,586 L 1240,574 Z" fill="#6e5c4c" />
        <path d="M1160,566 L 1230,604 L 1240,574 L 1190,540 Z" fill="#443c30" />
        {/* lit right facets */}
        <path d="M1330,308 L 1400,362 L 1462,428 L 1430,440 L 1360,380 L 1310,330 Z" fill="#b09578" />
        <path d="M1462,428 L 1508,492 L 1538,556 L 1500,560 L 1458,500 L 1436,448 Z" fill="#bfa084" />
        <path d="M1250,300 L 1330,340 L 1300,400 L 1220,360 Z" fill="#9c8168" opacity="0.9" />
        {/* crack lines */}
        <path d="M1180,300 Q 1220,380 1210,470 Q 1205,530 1230,580" fill="none" stroke="#2d241c" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <path d="M1300,330 Q 1340,410 1330,500 Q 1326,550 1350,596" fill="none" stroke="#2d241c" strokeWidth="4.5" strokeLinecap="round" opacity="0.7" />
        <path d="M1400,400 Q 1430,470 1440,540" fill="none" stroke="#2d241c" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <path d="M1130,430 Q 1160,470 1200,492" fill="none" stroke="#2d241c" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        {/* shelf rocks stepping down-right */}
        <path d="M1440,520 L 1520,528 L 1568,570 L 1552,612 L 1470,616 L 1428,580 Z" fill="#846b56" />
        <path d="M1428,580 L 1470,616 L 1460,596 L 1436,566 Z" fill="#443c30" />
        <path d="M1500,560 L 1560,600 L 1540,608 L 1492,580 Z" fill="#a68a6e" opacity="0.9" />
        <path d="M1360,600 L 1430,608 L 1450,640 L 1380,648 L 1340,626 Z" fill="#6e5c4c" />
        <path d="M1340,626 L 1380,648 L 1372,632 L 1350,616 Z" fill="#443c30" />
        {/* grass MOHAWK: spiked tufts drooping over the top edge */}
        <path
          id="mohawk"
          d="M1062,352
             l14,-34 l10,22 l10,-44 l12,26 l10,-52 l14,30 l12,-46 l12,32 l12,-38 l14,28
             l12,-30 l14,24 l14,-26 l14,22 l16,-18 l14,20 l16,-12 l14,18 l16,-8 l12,16
             q10,14 2,30 l-14,34 l-12,-16 l-10,30 l-12,-18 l-10,26 l-14,-20 l-10,24
             l-14,-22 l-12,20 l-14,-24 l-12,16 l-14,-22 l-12,14 l-14,-20 l-12,10
             q-24,-8 -34,-28 q-8,-18 -4,-34 z"
          fill="#78922f"
        />
        <path
          d="M1090,320 l12,-30 l10,22 l12,-36 l12,26 l12,-32 l14,26 l14,-24 l14,22 l16,-16 l14,18 l14,-8 l10,14 q-30,26 -74,28 q-52,2 -80,-16 q0,-12 10,-24 z"
          fill="#a8b84a"
        />
        <path d="M1290,346 l12,-28 l10,20 l12,-24 l12,22 l10,-14 l10,16 q-18,24 -46,24 q-24,0 -34,-14 q6,-14 14,-22 z" fill="#6d8a2e" />
      </g>

      {/* ===================================================== PROPS BACK */}
      <g id="props-back">
        {/* --------------- A-frame cabin: upright but collapsed character */}
        <g id="cabin">
          {/* soft blurred base shadow */}
          <g filter="url(#hscC-soft)">
            <ellipse cx="565" cy="852" rx="215" ry="36" fill="#1a1207" opacity="0.5" />
          </g>
          {/* gable wall with jagged notched edge */}
          <path
            d="M462,776 L 502,706 L 490,700 L 516,662 L 556,620
               L 688,716 L 682,744 L 670,734 L 680,824 L 452,844 Z"
            fill="url(#hscC-gable)"
          />
          <path d="M556,620 L 688,716 L 680,824 L 600,834 Z" fill="#4b3018" opacity="0.7" />
          {/* irregular dark gable opening with tilted planks inside */}
          <path d="M492,792 L 528,712 L 560,662 L 656,742 L 646,816 L 502,826 Z" fill="#070503" />
          <path d="M506,814 l14,-118 l17,2 l-12,118 z" fill="#6b4a2e" transform="rotate(5 514 756)" />
          <path d="M544,820 l8,-140 l16,2 l-6,140 z" fill="#4a3320" transform="rotate(-6 552 752)" />
          <path d="M584,824 l2,-128 l16,0 l0,130 z" fill="#6b4a2e" transform="rotate(4 592 760)" />
          <path d="M618,820 l-2,-104 l15,-2 l4,106 z" fill="#4a3320" transform="rotate(-5 626 768)" />
          <path d="M498,800 l148,-26 l3,13 l-148,28 z" fill="#5c3d20" opacity="0.9" />
          {/* near-black A roof: bent ridge, right plane longer AND lower */}
          <path
            d="M544,548 C 552,545 560,550 568,560
               Q 602,594 638,648 Q 694,720 752,776 L 724,796 L 552,676
               L 412,752 L 384,722 Q 460,626 522,560
               C 528,552 536,549 544,548 Z"
            fill="#0c0e12"
          />
          <path d="M544,550 L 568,560 Q 606,602 650,664 Q 702,732 746,774 L 552,652 Z" fill="#080b0f" />
          <path d="M548,564 L 552,676 L 724,796 L 746,776 Z" fill="#04080c" />
          <path d="M536,560 L 522,568 L 412,694 L 476,646 L 536,598 Z" fill="#131e26" opacity="0.45" />
          {/* warm rim light on the bent ridge from upper right */}
          <path d="M548,550 L 592,586 L 582,594 L 542,558 Z" fill="#6b5a3a" opacity="0.75" />
          {/* support planks */}
          <path d="M462,842 L 478,732" stroke="#4b3018" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M668,830 L 656,724" stroke="#4b3018" strokeWidth="8" strokeLinecap="round" fill="none" />
          {/* loose boards scattered on the grass front/right */}
          <path d="M540,856 l120,18 l-4,16 l-120,-18 z" fill="#3a2412" />
          <path d="M645,866 l110,-8 l2,14 l-110,10 z" fill="#4b3018" />
          <path d="M585,886 l90,14 l-4,14 l-90,-14 z" fill="#241a10" />
          <path d="M705,852 l70,24 l-8,12 l-68,-24 z" fill="#33200f" />
          <path d="M420,850 l86,10 l-2,13 l-86,-10 z" fill="#33200f" transform="rotate(-6 460 856)" />
          <path d="M740,890 l84,6 l0,13 l-84,-4 z" fill="#241a10" transform="rotate(5 780 896)" />
        </g>
        {/* --------------- sheep 1: fluffy bright wool, head-down grazing */}
        <g id="sheep-1">
          <ellipse cx="242" cy="802" rx="84" ry="14" fill="#171f0f" opacity="0.55" />
          {/* leg stubs */}
          <rect x="182" y="778" width="11" height="26" rx="5" fill="#3a3122" />
          <rect x="252" y="780" width="11" height="24" rx="5" fill="#2a2318" />
          {/* overlapping wool lobes */}
          <ellipse cx="205" cy="752" rx="78" ry="44" fill="#d8c4a5" />
          <ellipse cx="268" cy="758" rx="58" ry="38" fill="#cbb693" />
          <ellipse cx="238" cy="726" rx="58" ry="32" fill="#e4d2b4" />
          <ellipse cx="172" cy="730" rx="40" ry="28" fill="#e4d2b4" />
          <ellipse cx="290" cy="736" rx="34" ry="24" fill="#d8c4a5" />
          <ellipse cx="236" cy="782" rx="82" ry="20" fill="#a8946f" opacity="0.85" />
          {/* small dark head, grazing down-left */}
          <ellipse cx="132" cy="774" rx="20" ry="26" fill="#2a2318" transform="rotate(24 132 774)" />
          <ellipse cx="126" cy="758" rx="10" ry="7" fill="#3a3122" />
        </g>
        {/* --------------- sheep 2: smaller fluffy mass by the crates */}
        <g id="sheep-2">
          <ellipse cx="188" cy="946" rx="70" ry="12" fill="#171f0f" opacity="0.55" />
          <rect x="152" y="924" width="10" height="22" rx="4" fill="#3a3122" />
          <rect x="212" y="926" width="10" height="20" rx="4" fill="#2a2318" />
          <ellipse cx="182" cy="904" rx="66" ry="40" fill="#d8c4a5" />
          <ellipse cx="146" cy="886" rx="40" ry="30" fill="#e4d2b4" />
          <ellipse cx="222" cy="886" rx="40" ry="28" fill="#cbb693" />
          <ellipse cx="185" cy="928" rx="60" ry="18" fill="#a8946f" opacity="0.85" />
          {/* small dark head, dipped right toward the grass */}
          <ellipse cx="252" cy="912" rx="16" ry="22" fill="#2a2318" transform="rotate(-20 252 912)" />
          <ellipse cx="258" cy="898" rx="8" ry="6" fill="#3a3122" />
        </g>
        {/* --------------- crates + junk lower left */}
        <g id="crates">
          <path d="M34,800 l120,-14 l16,84 l-122,16 z" fill="#241a10" />
          <path d="M34,800 l120,-14 l4,20 l-120,14 z" fill="#4b3018" />
          <path d="M50,846 l110,-12" stroke="#3a2814" strokeWidth="5" fill="none" />
          <path d="M60,700 l90,-8 l10,60 l-92,10 z" fill="#1c1208" />
          <path d="M60,700 l90,-8 l3,14 l-90,8 z" fill="#3a2814" />
          {/* slatted wooden crate */}
          <path d="M235,940 l180,-24 l18,110 l-182,26 z" fill="#241a10" />
          <path d="M240,952 l170,-22" stroke="#4b3018" strokeWidth="10" fill="none" />
          <path d="M247,986 l172,-22" stroke="#4b3018" strokeWidth="10" fill="none" />
          <path d="M254,1020 l174,-24" stroke="#4b3018" strokeWidth="10" fill="none" />
          <path d="M262,1052 l172,-22" stroke="#3a2814" strokeWidth="9" fill="none" />
          <path d="M235,940 l180,-24" stroke="#6b5136" strokeWidth="5" fill="none" />
          {/* scattered boards */}
          <path d="M320,1070 l150,26 l-4,18 l-152,-26 z" fill="#3a2814" />
          <path d="M430,1108 l170,10 l0,16 l-170,-8 z" fill="#241a10" />
          <path d="M520,1080 l130,-18 l4,14 l-130,20 z" fill="#4b3018" />
          <path d="M360,1120 l110,30 l-6,14 l-110,-30 z" fill="#1c1208" />
          {/* dark heap in the corner */}
          <path d="M0,1070 q50,-24 100,-4 q40,18 30,60 q-8,40 -60,52 q-46,10 -70,-12 z" fill="#171310" />
          <path d="M10,1080 q40,-16 76,0 q-30,14 -76,10 z" fill="#241a10" />
        </g>
        {/* --------------- broken trough: smaller, seated ON the grass hump */}
        <g id="trough">
          <ellipse cx="1902" cy="906" rx="82" ry="14" fill="#42561e" opacity="0.75" />
          <g transform="translate(866 420) scale(0.55)">
            <path d="M1756,790 L 2000,764 L 2010,806 L 1990,860 L 1800,878 L 1760,838 Z" fill="#0d0a06" />
            <path d="M1756,790 L 2000,764 L 2004,782 L 1760,808 Z" fill="#4b3018" />
            <path d="M1756,790 L 2000,764 L 1998,756 L 1754,782 Z" fill="#7a5c3a" />
            <path d="M1770,812 L 1978,790 L 1984,824 L 1970,852 L 1810,866 L 1778,840 Z" fill="#050403" />
            <path d="M1800,878 L 1990,860 L 1986,872 L 1804,890 Z" fill="#33200f" />
            <path d="M1930,772 l14,-28 l12,4 l-12,26 z" fill="#4b3018" />
          </g>
        </g>
        {/* --------------- spiky bushes on the cliff-top grass */}
        <g id="bushes">
          <path
            d="M2140,900 l10,-46 l10,30 l12,-56 l12,34 l12,-44 l14,36 l14,-30 l14,30 l16,-20 l12,26
               q16,20 8,44 q-10,30 -48,38 q-44,8 -74,-14 q-24,-20 -18,-46 q4,-16 16,-22 z"
            fill="#78922f"
          />
          <path d="M2160,864 l10,-30 l10,24 l12,-34 l12,28 l14,-26 l14,26 l14,-16 l10,18 q-30,20 -66,16 q-32,-4 -46,-18 q8,-10 16,-12 z" fill="#a8b84a" />
          <path d="M2150,930 q30,22 72,16 l-8,22 q-42,6 -72,-18 z" fill="#42561e" opacity="0.85" />
          <path
            d="M2216,1004 l8,-32 l8,22 l10,-38 l10,26 l12,-30 l12,26 l12,-18 l10,20 q12,16 4,34 q-10,24 -42,28 q-36,4 -56,-14 q-16,-16 -8,-36 z"
            fill="#6d8a2e"
          />
          <path d="M2230,980 l8,-22 l10,18 l12,-24 l12,20 l12,-14 l8,14 q-24,14 -50,12 q-20,-2 -28,-10 z" fill="#98ab42" />
          <path d="M2040,822 l6,-24 l6,16 l8,-26 l8,18 l8,-20 l8,18 l8,-12 l6,14 q8,12 2,24 q-8,16 -30,18 q-24,2 -36,-12 q-8,-12 6,-14 z" fill="#8aa53f" />
        </g>
      </g>

      {/* ==================================================== POLES WIRES */}
      <g id="poles-wires">
        {/* left-edge pole stub, leaning, with a crossarm fragment */}
        <path d="M0,420 L 26,424 L 40,880 L 0,880 Z" fill="#4a3626" />
        <path d="M22,424 L 26,424 L 40,880 L 32,880 Z" fill="#7a5b3e" />
        <path d="M0,392 L 64,400 L 62,416 L 0,410 Z" fill="#41301f" />
        <path d="M0,392 L 64,400 L 64,407 L 0,399 Z" fill="#6e523a" />
        <rect x="36" y="382" width="9" height="15" fill="#241c12" />
        {/* wire fan from the left edge to the front pole */}
        <g id="wires-fan" fill="none" stroke="#2a2622" strokeOpacity="0.85" strokeLinecap="round">
          {wireFan.map((d, i) => (
            <path key={i} d={d} strokeWidth={3} />
          ))}
          <path d="M0,375 Q448,482 879,68" strokeWidth="2" strokeOpacity="0.5" />
          <path d="M0,528 Q472,634 891,276" strokeWidth="2" strokeOpacity="0.5" />
        </g>
        {/* spans between poles + exits up-right */}
        <g id="wires-spans" fill="none" stroke="#2a2622" strokeOpacity="0.85" strokeLinecap="round">
          {wireSpans.map((d, i) => (
            <path key={i} d={d} strokeWidth={3} />
          ))}
        </g>
        {/* FRONT pole: weathered brown trunk, extends past frame top */}
        <g id="pole-front">
          <path d="M872,884 L 890,-10 L 918,-10 L 904,884 Z" fill="#7a5b3e" />
          <path d="M898,884 L 910,-10 L 918,-10 L 904,884 Z" fill="#96754e" />
          <path d="M872,884 L 890,-10 L 896,-10 L 880,884 Z" fill="#4a3626" />
          {/* crossarms with insulator/tie-bar nubs where wires meet */}
          <path d="M812,52 L 986,34 L 988,52 L 814,72 Z" fill="#4a3626" />
          <path d="M812,52 L 986,34 L 986,42 L 812,60 Z" fill="#7a5b3e" />
          <path d="M806,160 L 992,146 L 994,164 L 808,180 Z" fill="#41301f" />
          <path d="M806,160 L 992,146 L 992,154 L 806,168 Z" fill="#6e523a" />
          <rect x="822" y="30" width="10" height="18" fill="#241c12" />
          <rect x="900" y="20" width="10" height="18" fill="#241c12" />
          <rect x="964" y="16" width="10" height="18" fill="#241c12" />
          <rect x="820" y="140" width="9" height="16" fill="#241c12" />
          <rect x="906" y="132" width="9" height="16" fill="#241c12" />
          <rect x="970" y="128" width="9" height="16" fill="#241c12" />
          {/* stumps of broken hardware */}
          <path d="M884,300 l30,-8 l4,10 l-30,10 z" fill="#3a2c1c" />
          <path d="M888,420 l26,6 l-2,10 l-26,-6 z" fill="#41301f" />
        </g>
        {/* SECOND pole: weathered wood, lit edge on the right */}
        <g id="pole-second">
          <path d="M1046,542 L 1036,80 L 1054,78 L 1066,542 Z" fill="#7a5b3e" />
          <path d="M1058,542 L 1048,78 L 1054,78 L 1066,542 Z" fill="#96754e" />
          <path d="M1046,542 L 1036,80 L 1041,80 L 1052,542 Z" fill="#4a3626" />
          <path d="M980,124 L 1116,112 L 1118,128 L 982,142 Z" fill="#4a3626" />
          <path d="M980,124 L 1116,112 L 1116,119 L 980,131 Z" fill="#7a5b3e" />
          <rect x="992" y="108" width="8" height="15" fill="#241c12" />
          <rect x="1070" y="100" width="8" height="15" fill="#241c12" />
          <path d="M1044,240 l24,4 l-2,10 l-24,-4 z" fill="#41301f" />
        </g>
      </g>

      {/* ========================================================= FIGURE */}
      <g id="figure">
        {/* elongated soft cast shadow, ANCHORED at the seat, tapering down-left */}
        <g filter="url(#hscC-soft3)">
          <path
            d="M1400,1030 L 1590,1000 C 1560,1044 1440,1104 1300,1150
               C 1200,1180 1136,1184 1128,1168 C 1140,1146 1240,1090 1330,1056
               C 1360,1044 1386,1034 1400,1030 Z"
            fill="#502e20"
            fillOpacity="0.5"
          />
          <path
            d="M1400,1028 C 1360,1052 1284,1090 1226,1112 C 1276,1078 1352,1042 1408,1020
               C 1428,1014 1420,1020 1400,1028 Z"
            fill="#3a2010"
            fillOpacity="0.5"
          />
        </g>
        {/* crossed-leg wedge: angular folded legs, knee point protruding right
            of the laptop base */}
        <path
          d="M1392,1022 C 1396,1000 1416,980 1450,966 C 1490,950 1540,944 1578,952
             C 1600,958 1606,972 1592,984 C 1562,1004 1500,1020 1448,1027
             C 1418,1030 1396,1029 1392,1022 Z"
          fill="#9c7a54"
        />
        {/* shaded portion tucked under the torso / deck */}
        <path
          d="M1392,1020 C 1398,998 1418,980 1450,968 C 1436,984 1424,1002 1420,1022
             C 1408,1025 1396,1024 1392,1020 Z"
          fill="#7c5f40"
        />
        {/* bright folded shin running diagonally to the right knee */}
        <path
          d="M1420,1012 C 1452,996 1504,982 1550,974 C 1572,971 1584,975 1578,984
             C 1542,998 1482,1012 1438,1019 C 1424,1020 1414,1017 1420,1012 Z"
          fill="#c4a37c"
        />
        {/* knee bump catching the light */}
        <path d="M1560,954 q22,-6 34,6 q8,10 -6,17 q-18,7 -32,-3 q-7,-10 4,-20 z" fill="#c4a37c" />
        {/* contact shadow under the legs */}
        <path
          d="M1398,1024 C 1436,1032 1500,1026 1552,1012 C 1580,1004 1594,992 1594,984
             C 1600,996 1584,1010 1554,1020 C 1500,1036 1430,1038 1396,1030 Z"
          fill="#6e5138"
        />
        {/* small dark shoe hint */}
        <path d="M1420,1018 q13,-7 24,-2 q7,5 -2,10 q-13,4 -23,-2 q-4,-3 1,-6 z" fill="#4a3624" />
        {/* torso: pale-tan sweater, hunched, lit right / core shadow left */}
        <path
          d="M1348,1010 C 1334,958 1340,898 1364,862 Q 1382,846 1402,842
             Q 1430,844 1448,858 C 1466,884 1470,932 1458,976
             C 1450,1002 1424,1014 1392,1016 C 1372,1016 1354,1014 1348,1010 Z"
          fill="#9a8450"
        />
        {/* lit right half of the sweater */}
        <path
          d="M1402,842 C 1428,844 1448,860 1458,888 C 1468,924 1466,960 1454,988
             C 1444,1006 1424,1014 1402,1015 C 1420,1000 1432,976 1436,944
             C 1440,904 1430,864 1402,842 Z"
          fill="#b8a06a"
        />
        <path d="M1444,868 C 1458,894 1462,936 1452,974 C 1462,936 1460,896 1448,872 Z" fill="#c9b47c" opacity="0.9" />
        {/* core shadow along the left of the back */}
        <path
          d="M1398,846 C 1374,862 1360,906 1360,954 C 1362,984 1372,1002 1388,1013
             C 1364,1013 1352,1011 1348,1008 C 1335,956 1340,896 1364,862
             Q 1380,847 1398,846 Z"
          fill="#6e5a38"
        />
        <path d="M1394,858 C 1376,896 1372,952 1384,1000 C 1368,960 1368,898 1386,862 Z" fill="#5c4a2c" opacity="0.7" />
        {/* left sleeve hinted along the body */}
        <path d="M1366,884 C 1356,912 1354,944 1362,970 L 1378,964 C 1372,942 1372,912 1380,890 Z" fill="#6e5a38" />
        {/* right sleeve reaching forward under the screen to the keys */}
        <path
          d="M1428,864 C 1454,870 1472,890 1478,914 C 1482,928 1490,936 1500,940
             L 1494,956 C 1478,950 1462,936 1454,918 C 1446,898 1438,880 1424,872 Z"
          fill="#8a744a"
        />
        <path d="M1432,868 C 1454,876 1468,894 1474,912 C 1466,896 1452,878 1434,872 Z" fill="#b8a06a" opacity="0.85" />
        {/* hand on the deck */}
        <path d="M1488,940 q12,-4 22,2 q6,5 -2,10 q-12,5 -21,-1 q-4,-6 1,-11 z" fill="#c98d6b" />
        {/* collar shadow under the head */}
        <path d="M1392,856 Q 1412,864 1430,856 L 1428,868 Q 1410,874 1394,868 Z" fill="#7c6844" opacity="0.7" />
        {/* neck seated into the shoulders */}
        <path d="M1396,828 L 1426,825 L 1428,854 Q 1410,861 1398,856 Z" fill="#c98d6b" />
        <path d="M1396,842 L 1427,838 L 1428,854 Q 1410,861 1398,856 Z" fill="#9a6a4c" />
        {/* head: dark hair mass (3/4 back view), hand-wobbled, sits on the neck */}
        <path
          d="M1384,802 C 1380,778 1391,761 1410,757 C 1429,753 1443,764 1445,782
             C 1447,798 1441,814 1429,823 C 1424,833 1414,838 1404,836
             C 1394,833 1387,825 1385,814 C 1384,810 1384,806 1384,802 Z"
          fill="#241408"
        />
        <path d="M1386,806 C 1383,784 1392,765 1410,759 C 1396,768 1389,784 1390,802 C 1390,814 1394,824 1401,831 C 1392,826 1387,817 1386,806 Z" fill="#180d05" />
        {/* face sliver + ear hugging the right silhouette edge */}
        <path d="M1438,780 C 1446,790 1445,806 1435,817 C 1428,824 1419,826 1413,823 C 1425,815 1433,799 1430,783 C 1432,779 1436,777 1438,780 Z" fill="#c98d6b" />
        <path d="M1443,796 C 1444,804 1441,812 1436,817 C 1440,810 1443,803 1443,796 Z" fill="#a06a48" />
        <path d="M1424,800 q7,1 6,9 q-1,7 -8,6 q-5,-2 -4,-9 q1,-7 6,-6 z" fill="#a06a48" />
        {/* warm rim light on hair, upper right */}
        <path d="M1424,758 C 1436,764 1444,774 1446,786 C 1440,774 1432,764 1420,760 Z" fill="#6b4a2e" />
        <path d="M1410,757 C 1420,755 1430,757 1437,764 C 1429,759 1419,757 1410,758 Z" fill="#4a3018" />
        {/* --------------- laptop: compact, seated in front under his arms */}
        <g id="laptop">
          {/* faint screen glow */}
          <g filter="url(#hscC-soft)">
            <ellipse cx="1504" cy="880" rx="72" ry="62" fill="#d9dcc8" opacity="0.18" />
          </g>
          {/* lid/bezel */}
          <path d="M1448,822 L 1556,838 L 1561,932 L 1456,922 Z" fill="#222c38" />
          {/* plain glowing screen — no text lines */}
          <path d="M1455,830 L 1549,844 L 1554,925 L 1462,916 Z" fill="url(#hscC-screen)" />
          {/* steel-blue keyboard deck resting on the crossed legs */}
          <path d="M1456,922 L 1561,932 L 1579,951 L 1449,944 Z" fill="#4a5c74" />
          <path d="M1462,928 L 1554,937 L 1563,945 L 1457,940 Z" fill="#38485e" />
          <path d="M1449,944 L 1579,951 L 1577,959 L 1449,952 Z" fill="#2c3a50" />
          <path d="M1456,922 L 1561,932 L 1560,936 L 1457,926 Z" fill="#93a0ad" opacity="0.6" />
        </g>
      </g>

      {/* ========================================================== GRADE */}
      <g id="grade">
        {/* full-canvas golden-hour tint from the upper right */}
        <rect
          x="0" y="0" width="2510" height="1440"
          fill="url(#hscC-sunTint)"
          style={{ mixBlendMode: "overlay" }}
        />
        <rect x="0" y="0" width="2510" height="1440" fill="url(#hscC-sunTint)" opacity="0.5" />
        {/* soft screen-blend sun glow near the cloud tower */}
        <ellipse
          cx="2050" cy="300" rx="760" ry="580"
          fill="url(#hscC-sunScreen)"
          style={{ mixBlendMode: "screen" }}
        />
        <rect x="0" y="0" width="2510" height="1440" fill="url(#hscC-vignette)" />
        <ellipse cx="2050" cy="350" rx="640" ry="500" fill="url(#hscC-warmGlow)" />
        <rect x="0" y="0" width="560" height="1440" fill="url(#hscC-coolLeft)" />
        {/* whole-scene painterly grain */}
        <rect x="0" y="0" width="2510" height="1440" filter="url(#hscC-mottle)" opacity="0.06" />
      </g>
    </svg>
  );
}
