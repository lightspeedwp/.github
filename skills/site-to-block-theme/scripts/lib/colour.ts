/**
 * Colour helpers for comparing computed CSS colours with theme.json colour tokens.
 */

export interface Rgba {
  /** Channels from 0 to 1. */
  r: number;
  g: number;
  b: number;
  a: number;
}

export class Colour {
  /** Parses #rgb, #rgba, #rrggbb, #rrggbbaa, rgb(), rgba() and `transparent`. Returns null otherwise. */
  static parse(value: string | undefined): Rgba | null {
    if (!value) {
      return null;
    }
    const text = value.trim().toLowerCase();
    if (text === 'transparent') {
      return { r: 0, g: 0, b: 0, a: 0 };
    }
    const hex = text.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
    if (hex) {
      const digits =
        hex[1].length <= 4
          ? hex[1]
              .split('')
              .map((d) => d + d)
              .join('')
          : hex[1];
      const channel = (i: number) => parseInt(digits.slice(i, i + 2), 16) / 255;
      return {
        r: channel(0),
        g: channel(2),
        b: channel(4),
        a: digits.length === 8 ? channel(6) : 1,
      };
    }
    const fn = text.match(/^rgba?\(([^)]+)\)$/);
    if (!fn) {
      return null;
    }
    const parts = fn[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) {
      return null;
    }
    const [r, g, b] = parts.slice(0, 3).map(Number);
    const alpha =
      parts[3] === undefined
        ? 1
        : parts[3].endsWith('%')
          ? parseFloat(parts[3]) / 100
          : Number(parts[3]);
    if ([r, g, b, alpha].some((n) => !Number.isFinite(n))) {
      return null;
    }
    return { r: r / 255, g: g / 255, b: b / 255, a: alpha };
  }

  static hex(c: Rgba): string {
    const byte = (n: number) =>
      Math.round(Math.min(1, Math.max(0, n)) * 255)
        .toString(16)
        .padStart(2, '0');
    return `#${byte(c.r)}${byte(c.g)}${byte(c.b)}${c.a < 1 ? byte(c.a) : ''}`;
  }

  /** Distance on a 0 to 255 scale per channel, alpha included. */
  static distance(a: Rgba, b: Rgba): number {
    return Math.sqrt(
      ((a.r - b.r) * 255) ** 2 +
        ((a.g - b.g) * 255) ** 2 +
        ((a.b - b.b) * 255) ** 2 +
        ((a.a - b.a) * 255) ** 2
    );
  }
}
