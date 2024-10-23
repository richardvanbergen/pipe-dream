export const color1 = 0b0000;
export const color2 = 0b0001;
export const color3 = 0b0010;
export const color4 = 0b0011;
export const color5 = 0b0100;
export const color6 = 0b0101;
export const color7 = 0b0110;
export const color8 = 0b0111;

type HSL = { h: number; s: number; l: number };

export type Color =
  | typeof color1
  | typeof color2
  | typeof color3
  | typeof color4
  | typeof color5
  | typeof color6
  | typeof color7
  | typeof color8;

function mapWarmthToHue(warmth: number): number {
  const warmHue = 0;
  const coldHue = 240;

  return coldHue - (coldHue - warmHue) * (warmth / 10);
}

export function generateColorWithWarmth(warmth: number): HSL {
  const hue = mapWarmthToHue(warmth);
  const saturation = 60 + (40 * warmth) / 10;
  const lightness = 50;

  return { h: hue, s: saturation, l: lightness };
}

export function hslToString(hsl: HSL): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export function generateMultipleColorsWithWarmth(
  warmth: number,
  numColors: number,
): string[] {
  const colors: string[] = [];
  const baseColor = generateColorWithWarmth(warmth);
  const angleStep = 120 / numColors; // Reduce the angle range to 120 degrees for closer colors

  for (let i = 0; i < numColors; i++) {
    const hue = (baseColor.h + i * angleStep) % 360; // Ensure hue wraps around the color wheel
    const saturation = baseColor.s + (i - numColors / 2) * 5; // Vary saturation slightly
    const lightness = baseColor.l + (i - numColors / 2) * 3; // Vary lightness slightly
    const color = {
      h: hue,
      s: Math.max(0, Math.min(100, saturation)),
      l: Math.max(0, Math.min(100, lightness)),
    };
    colors.push(hslToString(color));
  }

  return colors;
}
