import { Platform } from 'react-native';

// Gradient pairs: [lighter/top, darker/bottom]
// All complement or harmonize with brand teal #237490 and purple #8F52E0
export const GRADIENT_PAIRS: [string, string][] = [
  ['#237490', '#0D4F65'],  // teal (brand)
  ['#8F52E0', '#5C2BB5'],  // purple (brand)
  ['#C8714E', '#8A3C20'],  // warm terracotta
  ['#4D9B76', '#1E6449'],  // sage / forest green
  ['#B85A85', '#7A2250'],  // mauve / dusty rose
  ['#3A5CB8', '#1A2E85'],  // slate navy
  ['#C4952A', '#7A5810'],  // amber / gold
  ['#8AB040', '#4A6814'],  // warm olive
];

export function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getGradient(seed: string): [string, string] {
  return GRADIENT_PAIRS[hashStr(seed) % GRADIENT_PAIRS.length];
}

// SVG fractal noise for texture overlay — web only
const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(#n)' opacity='0.07'/></svg>`;

export const noiseStyle: object = Platform.OS === 'web'
  ? { backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")` }
  : {};
