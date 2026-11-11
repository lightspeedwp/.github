/** A small sRGB colour value with the few operations the screenshot needs. */
export class Rgb {
  constructor(
    readonly r: number,
    readonly g: number,
    readonly b: number
  ) {}

  /** Parses #rgb or #rrggbb. Returns undefined for anything else. */
  static parse(value: string | undefined): Rgb | undefined {
    const match = value?.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!match) {
      return undefined;
    }
    const hex =
      match[1].length === 3
        ? match[1]
            .split('')
            .map((c) => c + c)
            .join('')
        : match[1];
    const n = parseInt(hex, 16);
    return new Rgb((n >> 16) & 255, (n >> 8) & 255, n & 255);
  }

  /** Linear mix towards `other`: 0 is this colour, 1 is the other. */
  mix(other: Rgb, amount: number): Rgb {
    const m = (a: number, b: number) => Math.round(a + (b - a) * amount);
    return new Rgb(m(this.r, other.r), m(this.g, other.g), m(this.b, other.b));
  }

  /** WCAG relative luminance, 0 (black) to 1 (white). */
  luminance(): number {
    const channel = (v: number) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(this.r) + 0.7152 * channel(this.g) + 0.0722 * channel(this.b);
  }

  toHex(): string {
    return `#${[this.r, this.g, this.b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  }
}

export const WHITE = new Rgb(255, 255, 255);
export const BLACK = new Rgb(0, 0, 0);
