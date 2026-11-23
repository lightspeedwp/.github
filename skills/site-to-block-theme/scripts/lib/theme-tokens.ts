/**
 * Reads the design tokens a block theme defines in theme.json (and any preset
 * slices merged into it) and evaluates them at a viewport width, so computed
 * values measured on a live site can be matched to them.
 *
 * Presets: palette colours, spacing sizes, font sizes (with WordPress fluid
 * typography), font families, radius sizes and shadows. Custom values under
 * settings.custom become semantic tokens (`--wp--custom--*`).
 */

import { Colour, Rgba } from './colour';
import { CssLength } from './css-length';

export type Family =
  | 'color'
  | 'spacing'
  | 'font-size'
  | 'font-family'
  | 'radius'
  | 'shadow'
  | 'font-weight'
  | 'line-height'
  | 'letter-spacing'
  | 'border-width';

export interface Token {
  family: Family;
  /** Preset slug, or the custom path joined with `--`. */
  slug: string;
  cssVar: string;
  /** Block markup reference for presets, for example `var:preset|spacing|30`. */
  preset?: string;
  raw: string;
  /** True for settings.custom tokens, which carry a role (text, surface, border). */
  semantic: boolean;
  /** Font size presets only: the preset's own `fluid` setting. */
  fluid?: boolean | { min?: string; max?: string };
}

type Json = Record<string, unknown>;

const CUSTOM_FAMILIES: Record<string, Family> = {
  color: 'color',
  spacing: 'spacing',
  'font-weight': 'font-weight',
  'line-height': 'line-height',
  'letter-spacing': 'letter-spacing',
  'border-width': 'border-width',
  radius: 'radius',
};

const isObject = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export class ThemeTokens {
  private readonly byVar = new Map<string, Token>();

  private constructor(
    private readonly settings: Json,
    readonly tokens: Token[]
  ) {
    for (const token of tokens) {
      this.byVar.set(token.cssVar, token);
    }
  }

  /** Builds the tokens from one or more theme.json documents. Later documents win. */
  static fromThemeJson(documents: unknown[]): ThemeTokens {
    let settings: Json = {};
    for (const doc of documents) {
      if (isObject(doc) && isObject(doc.settings)) {
        settings = ThemeTokens.merge(settings, doc.settings);
      }
    }
    return new ThemeTokens(settings, ThemeTokens.collect(settings));
  }

  static kebab(key: string): string {
    return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  list(family: Family): Token[] {
    return this.tokens.filter((t) => t.family === family);
  }

  /** Replaces var() references with the values they point to, recursively. */
  resolve(raw: string, depth = 0): string {
    if (depth > 10) {
      return raw;
    }
    const replaced = raw.replace(
      /var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/gi,
      (match, name: string, fallback?: string) => {
        const token = this.byVar.get(name.toLowerCase());
        if (token) {
          return token.raw;
        }
        return fallback !== undefined ? fallback.trim() : match;
      }
    );
    return replaced === raw ? raw : this.resolve(replaced, depth + 1);
  }

  colour(token: Token): Rgba | null {
    return Colour.parse(this.resolve(token.raw));
  }

  /**
   * The token's size in px at the viewport width, or null for values that
   * are not lengths. Font sizes follow WordPress fluid typography.
   */
  lengthPx(token: Token, viewport: number, fontSizePx?: number): number | null {
    if (token.family === 'font-size') {
      return this.fontSizePx(token, viewport);
    }
    return CssLength.toPx(this.resolve(token.raw), { viewport, fontSize: fontSizePx });
  }

  /**
   * A font size preset at a viewport width, following WordPress core's
   * wp_get_typography_font_size_value() and wp_get_computed_fluid_typography_value().
   */
  fontSizePx(token: Token, viewport: number): number | null {
    const size = CssLength.toPx(this.resolve(token.raw), { viewport });
    if (size === null) {
      return null;
    }
    const typography = isObject(this.settings.typography) ? this.settings.typography : {};
    const fluid = typography.fluid;
    if (!fluid || token.fluid === false || /clamp|calc|min\(|max\(|vw/.test(token.raw)) {
      return size;
    }
    const fluidSettings = isObject(fluid) ? fluid : {};
    const layout = isObject(this.settings.layout) ? this.settings.layout : {};
    const px = (value: unknown, fallback: number) =>
      typeof value === 'string' ? (CssLength.toPx(value, { viewport }) ?? fallback) : fallback;

    const maxViewport = px(fluidSettings.maxViewportWidth ?? layout.wideSize, 1600);
    const minViewport = px(fluidSettings.minViewportWidth, 320);
    const limit = px(fluidSettings.minFontSize, 14);
    const own = isObject(token.fluid) ? token.fluid : {};

    const max = own.max ? px(own.max, size) : size;
    let min: number;
    if (own.min) {
      min = px(own.min, size);
    } else {
      if (size <= limit) {
        return size;
      }
      const factor = Math.min(Math.max(1 - 0.075 * Math.log2(size), 0.25), 0.75);
      const calculated = Math.round(size * factor * 1000) / 1000;
      min = calculated <= limit ? limit : calculated;
    }
    if (viewport <= minViewport) {
      return min;
    }
    if (viewport >= maxViewport) {
      return max;
    }
    const ratio = (viewport - minViewport) / (maxViewport - minViewport);
    return Math.round((min + (max - min) * ratio) * 1000) / 1000;
  }

  private static merge(base: Json, extra: Json): Json {
    const out: Json = { ...base };
    for (const [key, value] of Object.entries(extra)) {
      const current = out[key];
      if (isObject(current) && isObject(value)) {
        out[key] = ThemeTokens.merge(current, value);
      } else if (Array.isArray(current) && Array.isArray(value)) {
        const slugOf = (item: unknown) => (isObject(item) ? item.slug : undefined);
        const replaced = new Set<unknown>(value.map(slugOf).filter((s) => s !== undefined));
        out[key] = [...current.filter((item) => !replaced.has(slugOf(item))), ...value];
      } else {
        out[key] = value;
      }
    }
    return out;
  }

  private static collect(settings: Json): Token[] {
    const tokens: Token[] = [];
    const section = (key: string): Json => (isObject(settings[key]) ? settings[key] : {});
    const presets = (
      items: unknown,
      family: Family,
      cssGroup: string,
      valueKey: string,
      withFluid = false
    ) => {
      if (!Array.isArray(items)) {
        return;
      }
      for (const item of items) {
        if (!isObject(item) || typeof item.slug !== 'string') {
          continue;
        }
        const raw = item[valueKey];
        if (typeof raw !== 'string' && typeof raw !== 'number') {
          continue;
        }
        const token: Token = {
          family,
          slug: item.slug,
          cssVar: `--wp--preset--${cssGroup}--${item.slug}`,
          preset: `var:preset|${cssGroup}|${item.slug}`,
          raw: String(raw),
          semantic: false,
        };
        if (withFluid && (typeof item.fluid === 'boolean' || isObject(item.fluid))) {
          token.fluid = item.fluid as Token['fluid'];
        }
        tokens.push(token);
      }
    };

    presets(section('color').palette, 'color', 'color', 'color');
    presets(section('spacing').spacingSizes, 'spacing', 'spacing', 'size');
    presets(section('typography').fontSizes, 'font-size', 'font-size', 'size', true);
    presets(section('typography').fontFamilies, 'font-family', 'font-family', 'fontFamily');
    presets(section('border').radiusSizes, 'radius', 'border-radius', 'size');
    presets(section('shadow').presets, 'shadow', 'shadow', 'shadow');

    const walk = (node: unknown, path: string[], family: Family) => {
      if (isObject(node)) {
        for (const [key, value] of Object.entries(node)) {
          walk(value, [...path, ThemeTokens.kebab(key)], family);
        }
        return;
      }
      if (typeof node !== 'string' && typeof node !== 'number') {
        return;
      }
      tokens.push({
        family,
        slug: path.slice(1).join('--'),
        cssVar: `--wp--custom--${path.join('--')}`,
        raw: String(node),
        semantic: true,
      });
    };
    for (const [key, value] of Object.entries(section('custom'))) {
      const name = ThemeTokens.kebab(key);
      const family = CUSTOM_FAMILIES[name];
      if (family) {
        walk(value, [name], family);
      }
    }
    return tokens;
  }
}
