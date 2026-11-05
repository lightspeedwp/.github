/**
 * Colour helpers: parsing, OKLCH conversion, WCAG contrast and ramp building.
 *
 * Ramps are built in OKLCH so lightness steps look even. The live colour is
 * kept exactly at the step whose target lightness it is closest to.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export const RAMP_STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type RampStep = (typeof RAMP_STEPS)[number];

/** Target OKLCH lightness per step, 100 lightest. */
export const STEP_LIGHTNESS: Record<RampStep, number> = {
  100: 0.97,
  200: 0.91,
  300: 0.83,
  400: 0.74,
  500: 0.64,
  600: 0.52,
  700: 0.42,
  800: 0.31,
  900: 0.2,
};

export class Color {
  private constructor(readonly rgb: Rgb) {}

  /** Parses #rgb, #rrggbb, #rrggbbaa, rgb() and rgba(). Returns null for anything else. */
  static parse(value: string): Color | null {
    const text = value.trim().toLowerCase();
    const hex = text.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/);
    if (hex) {
      let digits = hex[1];
      if (digits.length === 3) {
        digits = digits
          .split('')
          .map((d) => d + d)
          .join('');
      }
      const channel = (i: number) => parseInt(digits.slice(i, i + 2), 16) / 255;
      return new Color({
        r: channel(0),
        g: channel(2),
        b: channel(4),
        a: digits.length === 8 ? channel(6) : 1,
      });
    }
    const fn = text.match(/^rgba?\(([^)]+)\)$/);
    if (fn) {
      const parts = fn[1].split(/[\s,/]+/).filter(Boolean);
      if (parts.length < 3) {
        return null;
      }
      const [r, g, b] = parts.slice(0, 3).map((p) => Number(p) / 255);
      const alphaPart = parts[3];
      const a =
        alphaPart === undefined
          ? 1
          : alphaPart.endsWith('%')
            ? Number(alphaPart.slice(0, -1)) / 100
            : Number(alphaPart);
      if ([r, g, b, a].some((n) => Number.isNaN(n))) {
        return null;
      }
      return new Color({ r, g, b, a });
    }
    return null;
  }

  static fromRgb(rgb: Rgb): Color {
    return new Color(rgb);
  }

  static fromOklch({ l, c, h }: Oklch, alpha = 1): Color {
    const rad = (h * Math.PI) / 180;
    const a = c * Math.cos(rad);
    const b = c * Math.sin(rad);
    const l1 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m1 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s1 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const linear = {
      r: 4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1,
      g: -1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1,
      b: -0.0041960863 * l1 - 0.7034186147 * m1 + 1.707614701 * s1,
    };
    return new Color({
      r: Color.gammaEncode(linear.r),
      g: Color.gammaEncode(linear.g),
      b: Color.gammaEncode(linear.b),
      a: alpha,
    });
  }

  get isOpaque(): boolean {
    return this.rgb.a >= 0.999;
  }

  /** True when every channel is inside sRGB (with a little tolerance). */
  get inGamut(): boolean {
    return [this.rgb.r, this.rgb.g, this.rgb.b].every((v) => v >= -0.0005 && v <= 1.0005);
  }

  toHex(): string {
    const channel = (v: number) =>
      Math.round(Math.min(Math.max(v, 0), 1) * 255)
        .toString(16)
        .padStart(2, '0');
    const hex = `#${channel(this.rgb.r)}${channel(this.rgb.g)}${channel(this.rgb.b)}`;
    return this.isOpaque ? hex : `${hex}${channel(this.rgb.a)}`;
  }

  toOklch(): Oklch {
    const lr = Color.gammaDecode(this.rgb.r);
    const lg = Color.gammaDecode(this.rgb.g);
    const lb = Color.gammaDecode(this.rgb.b);
    const l1 = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
    const m1 = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
    const s1 = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
    const L = 0.2104542553 * l1 + 0.793617785 * m1 - 0.0040720468 * s1;
    const A = 1.9779984951 * l1 - 2.428592205 * m1 + 0.4505937099 * s1;
    const B = 0.0259040371 * l1 + 0.7827717662 * m1 - 0.808675766 * s1;
    const c = Math.sqrt(A * A + B * B);
    const h = c < 1e-6 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
    return { l: L, c, h };
  }

  /** WCAG 2.x relative luminance. */
  luminance(): number {
    const f = (v: number) => Color.gammaDecode(v);
    return 0.2126 * f(this.rgb.r) + 0.7152 * f(this.rgb.g) + 0.0722 * f(this.rgb.b);
  }

  /** WCAG contrast ratio with another opaque colour. */
  contrast(other: Color): number {
    const [hi, lo] = [this.luminance(), other.luminance()].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  }

  /** Perceptual distance in OKLab, scaled so about 2 is a just-noticeable difference. */
  distance(other: Color): number {
    const toLab = (c: Color) => {
      const { l, c: ch, h } = c.toOklch();
      const rad = (h * Math.PI) / 180;
      return [l, ch * Math.cos(rad), ch * Math.sin(rad)];
    };
    const [l1, a1, b1] = toLab(this);
    const [l2, a2, b2] = toLab(other);
    const alpha = Math.abs(this.rgb.a - other.rgb.a);
    return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2 + alpha ** 2) * 100;
  }

  /** Composites a translucent colour over an opaque background. */
  over(background: Color): Color {
    const a = this.rgb.a;
    const mix = (fg: number, bg: number) => fg * a + bg * (1 - a);
    return new Color({
      r: mix(this.rgb.r, background.rgb.r),
      g: mix(this.rgb.g, background.rgb.g),
      b: mix(this.rgb.b, background.rgb.b),
      a: 1,
    });
  }

  private static gammaDecode(v: number): number {
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }

  private static gammaEncode(v: number): number {
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.sign(v) * Math.abs(v) ** (1 / 2.4) - 0.055;
  }
}

export interface Ramp {
  anchorStep: RampStep;
  steps: Record<RampStep, string>;
}

/**
 * Builds a 100-900 ramp around an anchor colour.
 *
 * The anchor keeps its exact value at the step nearest its lightness. Other
 * steps use the target lightness, the anchor's hue, and a chroma that tapers
 * towards the light and dark ends, reduced further until it fits in sRGB.
 */
export class RampBuilder {
  build(anchorHex: string, options: { maxChroma?: number } = {}): Ramp {
    const anchor = Color.parse(anchorHex);
    if (!anchor) {
      throw new Error(`Not a colour: ${anchorHex}`);
    }
    const base = anchor.toOklch();
    const anchorStep = this.nearestStep(base.l);
    const chroma = Math.min(base.c, options.maxChroma ?? Infinity);
    const steps = {} as Record<RampStep, string>;

    for (const step of RAMP_STEPS) {
      if (step === anchorStep) {
        steps[step] = anchor.toHex();
        continue;
      }
      const l = STEP_LIGHTNESS[step];
      // Chroma peaks near the anchor and tapers to 25% at the ends.
      const spread = Math.abs(l - base.l) / 0.8;
      let c = chroma * Math.max(0.25, 1 - spread);
      let color = Color.fromOklch({ l, c, h: base.h });
      while (!color.inGamut && c > 0.0005) {
        c *= 0.92;
        color = Color.fromOklch({ l, c, h: base.h });
      }
      steps[step] = color.toHex();
    }

    return { anchorStep, steps };
  }

  nearestStep(lightness: number): RampStep {
    return RAMP_STEPS.reduce((best, step) =>
      Math.abs(STEP_LIGHTNESS[step] - lightness) < Math.abs(STEP_LIGHTNESS[best] - lightness)
        ? step
        : best
    );
  }
}
