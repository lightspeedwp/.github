/**
 * Matches one computed CSS value, measured at a viewport width, to the theme's
 * tokens. Exact matches list every token with that value, semantic tokens
 * first, so the builder picks the one whose role fits. Anything else reports
 * the nearest token and how far off it is.
 */

import { Colour, Rgba } from './colour';
import { CssLength } from './css-length';
import { Family, ThemeTokens, Token } from './theme-tokens';

export type MatchStatus = 'exact' | 'near' | 'none' | 'skip';

export interface TokenRef {
  cssVar: string;
  preset?: string;
  semantic: boolean;
}

export interface Match {
  family?: Family;
  status: MatchStatus;
  /** Matching tokens: all exact ones, or the nearest one. */
  tokens: TokenRef[];
  /** For near and none: how far the nearest token is, for example `+2px` or `distance 12`. */
  delta?: string;
  /** For values with several parts (padding shorthand, shadow layers): a match per part. */
  parts?: Match[];
}

const SKIP_VALUES = new Set(['', 'auto', 'normal', 'none', 'initial', 'inherit', 'unset']);

const PROPERTY_FAMILIES: [RegExp, Family][] = [
  [/(^|-)color$/, 'color'],
  [
    /^(padding|margin)(-(top|right|bottom|left|block|inline)(-(start|end))?)?$|(^|-)gap$/,
    'spacing',
  ],
  [/^font-size$/, 'font-size'],
  [/^font-family$/, 'font-family'],
  [/^font-weight$/, 'font-weight'],
  [/^line-height$/, 'line-height'],
  [/^letter-spacing$/, 'letter-spacing'],
  [/radius$/, 'radius'],
  [/^box-shadow$/, 'shadow'],
  [/^border(-(top|right|bottom|left))?-width$/, 'border-width'],
];

export class TokenMatcher {
  constructor(
    private readonly theme: ThemeTokens,
    private readonly colourTolerance = { exact: 1.5, near: 24 },
    private readonly lengthTolerance = { exactPx: 0.5, nearRatio: 0.12, nearMinPx: 2 }
  ) {}

  static familyFor(property: string): Family | undefined {
    return PROPERTY_FAMILIES.find(([pattern]) => pattern.test(property))?.[1];
  }

  /**
   * @param styles All computed styles of the element, for font-size-relative values.
   */
  match(
    property: string,
    value: string,
    viewport: number,
    styles: Record<string, string> = {}
  ): Match {
    const family = TokenMatcher.familyFor(property);
    const text = (value ?? '').trim();
    if (
      !family ||
      SKIP_VALUES.has(text.toLowerCase()) ||
      TokenMatcher.invisible(property, styles)
    ) {
      return { family, status: 'skip', tokens: [] };
    }
    const fontSize = CssLength.pxList(styles['font-size'])[0];
    switch (family) {
      case 'color':
        return this.matchColour(text);
      case 'font-family':
        return this.matchFontFamily(text);
      case 'shadow':
        return this.matchShadow(text);
      case 'font-weight':
        return this.matchNumber(family, Number(text), 0, (t) => Number(this.theme.resolve(t.raw)));
      case 'line-height':
        return this.matchLineHeight(text, fontSize, viewport);
      default:
        return this.matchLengths(family, text, viewport, fontSize);
    }
  }

  private matchColour(text: string): Match {
    const colour = Colour.parse(text);
    if (!colour) {
      return { family: 'color', status: 'skip', tokens: [] };
    }
    if (colour.a === 0) {
      return { family: 'color', status: 'skip', tokens: [] };
    }
    const scored = this.theme
      .list('color')
      .map((token) => ({ token, rgba: this.theme.colour(token) }))
      .filter((s): s is { token: Token; rgba: Rgba } => s.rgba !== null)
      .map((s) => ({ token: s.token, distance: Colour.distance(colour, s.rgba) }));
    return this.rank(
      'color',
      scored,
      this.colourTolerance.exact,
      this.colourTolerance.near,
      (d) => `distance ${Math.round(d)}`
    );
  }

  /** A border or outline colour whose width is 0 or style is none cannot be seen. */
  static invisible(property: string, styles: Record<string, string>): boolean {
    const edge = property.match(/^(border-(?:top|right|bottom|left)|outline)-color$/);
    if (!edge) {
      return false;
    }
    return styles[`${edge[1]}-width`] === '0px' || styles[`${edge[1]}-style`] === 'none';
  }

  /**
   * The first family in a stack, reduced to letters and digits, without a
   * trailing style word, so web-font aliases such as `argesta_displayregular`
   * match `"Argesta Display"`.
   */
  static fontKey(stack: string): string {
    return stack
      .split(',')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/(regular|normal|book|roman|webfont)+$/, '');
  }

  private matchFontFamily(text: string): Match {
    const wanted = TokenMatcher.fontKey(text);
    const tokens = this.theme
      .list('font-family')
      .filter((t) => TokenMatcher.fontKey(this.theme.resolve(t.raw)) === wanted);
    if (tokens.length) {
      return { family: 'font-family', status: 'exact', tokens: tokens.map(TokenMatcher.ref) };
    }
    return {
      family: 'font-family',
      status: 'none',
      tokens: [],
      delta: `no family "${text.split(',')[0].trim()}"`,
    };
  }

  private matchShadow(text: string): Match {
    const wanted = this.normaliseShadow(text);
    const tokens = this.theme
      .list('shadow')
      .filter((t) => this.normaliseShadow(this.theme.resolve(t.raw)) === wanted);
    if (tokens.length) {
      return { family: 'shadow', status: 'exact', tokens: tokens.map(TokenMatcher.ref) };
    }
    return { family: 'shadow', status: 'none', tokens: [], delta: 'no shadow with these layers' };
  }

  /** One string per layer: inset flag, lengths in px and the colour as hex. Order-insensitive within a layer. */
  normaliseShadow(text: string): string {
    return TokenMatcher.splitTopLevel(text)
      .map((layer) => {
        let rest = layer.trim().toLowerCase();
        const inset = /\binset\b/.test(rest);
        rest = rest.replace(/\binset\b/, '');
        const colourMatch = rest.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}\b|\btransparent\b/);
        const colour = colourMatch ? Colour.parse(colourMatch[0]) : null;
        if (colourMatch) {
          rest = rest.replace(colourMatch[0], '');
        }
        const lengths = rest
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((part) => CssLength.toPx(part, { viewport: 1440 }) ?? NaN);
        while (lengths.length < 4) {
          lengths.push(0);
        }
        return `${inset ? 'inset ' : ''}${lengths.map((n) => Math.round(n * 10) / 10).join(' ')} ${
          colour ? Colour.hex(colour) : '?'
        }`;
      })
      .join(', ');
  }

  private matchLineHeight(text: string, fontSize: number | undefined, viewport: number): Match {
    const px = CssLength.pxList(text)[0];
    const ratio = px !== undefined && fontSize ? px / fontSize : Number(text);
    if (!Number.isFinite(ratio)) {
      return { family: 'line-height', status: 'skip', tokens: [] };
    }
    return this.matchNumber('line-height', ratio, 0.01, (t) => {
      const raw = this.theme.resolve(t.raw);
      const n = Number(raw);
      if (Number.isFinite(n)) {
        return n;
      }
      const length = CssLength.toPx(raw, { viewport, fontSize });
      return length !== null && fontSize ? length / fontSize : NaN;
    });
  }

  private matchNumber(
    family: Family,
    wanted: number,
    tolerance: number,
    valueOf: (t: Token) => number
  ): Match {
    if (!Number.isFinite(wanted)) {
      return { family, status: 'skip', tokens: [] };
    }
    const scored = this.theme
      .list(family)
      .map((token) => ({ token, value: valueOf(token) }))
      .filter((s) => Number.isFinite(s.value))
      .map((s) => ({
        token: s.token,
        distance: Math.abs(s.value - wanted),
        signed: s.value - wanted,
      }));
    const exact = scored.filter((s) => s.distance <= tolerance + 1e-9);
    if (exact.length) {
      return { family, status: 'exact', tokens: TokenMatcher.sorted(exact.map((s) => s.token)) };
    }
    const nearest = scored.sort((a, b) => a.distance - b.distance)[0];
    if (!nearest) {
      return { family, status: 'none', tokens: [], delta: 'no tokens in this family' };
    }
    return {
      family,
      status: 'near',
      tokens: [TokenMatcher.ref(nearest.token)],
      delta: `${nearest.signed > 0 ? '+' : ''}${Math.round(nearest.signed * 1000) / 1000}`,
    };
  }

  private matchLengths(family: Family, text: string, viewport: number, fontSize?: number): Match {
    const values = CssLength.pxList(text);
    if (!values.length) {
      return { family, status: 'skip', tokens: [] };
    }
    const parts = values.map((px) => this.matchLength(family, px, viewport, fontSize));
    if (parts.length === 1) {
      return parts[0];
    }
    const order: MatchStatus[] = ['none', 'near', 'exact', 'skip'];
    const status = order.find((s) => parts.some((p) => p.status === s)) as MatchStatus;
    return { family, status, tokens: [], parts };
  }

  private matchLength(family: Family, px: number, viewport: number, fontSize?: number): Match {
    if (px === 0) {
      return { family, status: 'skip', tokens: [] };
    }
    const scored = this.theme
      .list(family)
      .map((token) => ({ token, value: this.theme.lengthPx(token, viewport, fontSize) }))
      .filter((s): s is { token: Token; value: number } => s.value !== null)
      .map((s) => ({ token: s.token, distance: Math.abs(s.value - px), signed: s.value - px }));
    const near = Math.max(this.lengthTolerance.nearMinPx, px * this.lengthTolerance.nearRatio);
    return this.rank(
      family,
      scored,
      this.lengthTolerance.exactPx,
      near,
      (_d, signed) => `${signed > 0 ? '+' : ''}${Math.round(signed * 100) / 100}px`
    );
  }

  private rank(
    family: Family,
    scored: { token: Token; distance: number; signed?: number }[],
    exactWithin: number,
    nearWithin: number,
    describe: (distance: number, signed: number) => string
  ): Match {
    const exact = scored.filter((s) => s.distance <= exactWithin);
    if (exact.length) {
      return { family, status: 'exact', tokens: TokenMatcher.sorted(exact.map((s) => s.token)) };
    }
    const nearest = [...scored].sort((a, b) => a.distance - b.distance)[0];
    if (!nearest) {
      return { family, status: 'none', tokens: [], delta: 'no tokens in this family' };
    }
    return {
      family,
      status: nearest.distance <= nearWithin ? 'near' : 'none',
      tokens: [TokenMatcher.ref(nearest.token)],
      delta: describe(nearest.distance, nearest.signed ?? nearest.distance),
    };
  }

  private static sorted(tokens: Token[]): TokenRef[] {
    return [...tokens]
      .sort((a, b) => Number(b.semantic) - Number(a.semantic))
      .map(TokenMatcher.ref);
  }

  private static ref(token: Token): TokenRef {
    return token.preset
      ? { cssVar: token.cssVar, preset: token.preset, semantic: token.semantic }
      : { cssVar: token.cssVar, semantic: token.semantic };
  }

  /** Splits on commas that are not inside parentheses. */
  static splitTopLevel(text: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';
    for (const char of text) {
      if (char === '(') {
        depth++;
      } else if (char === ')') {
        depth--;
      }
      if (char === ',' && depth === 0) {
        parts.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current);
    return parts.filter((p) => p.trim());
  }
}
