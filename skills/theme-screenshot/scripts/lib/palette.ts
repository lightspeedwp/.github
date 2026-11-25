import { BLACK, Rgb, WHITE } from './colour';

export type Mode = 'light' | 'dark';

export interface ColourOverrides {
  base?: string;
  contrast?: string;
  accent?: string;
}

/** Every colour the screenshot template paints with. */
export interface ScreenshotColours {
  mode: Mode;
  /** Gradient centre and edge. */
  centre: string;
  edge: string;
  /** The divider and, in dark mode, the tagline. */
  accent: string;
  /** The industry line. */
  industry: string;
  /** The "WordPress block theme" line. */
  label: string;
}

/** The accent is the first of these ramp steps the palette has. */
const ACCENT_SLUGS = ['brand-600', 'brand-500', 'primary-600', 'primary-500', 'cta-600', 'cta-500'];

/** Reads the colour palette from a theme.json and answers by slug. */
export class ThemePalette {
  private readonly colours = new Map<string, string>();

  constructor(entries: Array<{ slug: string; color: string }> = []) {
    for (const entry of entries) {
      this.colours.set(entry.slug, entry.color);
    }
  }

  static fromThemeJson(json: unknown): ThemePalette {
    const palette = (json as { settings?: { color?: { palette?: unknown } } })?.settings?.color
      ?.palette;
    if (!Array.isArray(palette)) {
      return new ThemePalette();
    }
    return new ThemePalette(
      palette.filter(
        (e): e is { slug: string; color: string } =>
          typeof e?.slug === 'string' && typeof e?.color === 'string'
      )
    );
  }

  get(slug: string): Rgb | undefined {
    return Rgb.parse(this.colours.get(slug));
  }

  firstOf(slugs: string[]): Rgb | undefined {
    for (const slug of slugs) {
      const found = this.get(slug);
      if (found) {
        return found;
      }
    }
    return undefined;
  }
}

/**
 * Chooses the screenshot colours from a theme palette, with overrides.
 *
 * Light mode paints the `base` colour with a soft gradient and dark text. Dark mode paints
 * the `contrast` colour with light text. In `auto` mode a light logo gets the dark
 * background and a dark logo the light one.
 */
export class ColourPlanner {
  constructor(
    private readonly palette: ThemePalette,
    private readonly overrides: ColourOverrides = {}
  ) {}

  chooseMode(requested: Mode | 'auto', logoLuminance: number): Mode {
    if (requested !== 'auto') {
      return requested;
    }
    return logoLuminance > 0.55 ? 'dark' : 'light';
  }

  plan(mode: Mode): ScreenshotColours {
    const base = Rgb.parse(this.overrides.base) ?? this.palette.get('base') ?? WHITE;
    const contrast = Rgb.parse(this.overrides.contrast) ?? this.palette.get('contrast') ?? BLACK;
    const accent =
      Rgb.parse(this.overrides.accent) ?? this.palette.firstOf(ACCENT_SLUGS) ?? contrast;

    if (mode === 'light') {
      return {
        mode,
        centre: base.mix(WHITE, 0.6).toHex(),
        edge: base.mix(contrast, 0.05).toHex(),
        accent: accent.toHex(),
        industry: contrast.mix(base, 0.1).toHex(),
        label: contrast.mix(base, 0.55).toHex(),
      };
    }
    return {
      mode,
      centre: contrast.mix(WHITE, 0.07).toHex(),
      edge: contrast.mix(BLACK, 0.25).toHex(),
      accent: accent.toHex(),
      industry: accent.mix(WHITE, 0.55).toHex(),
      label: accent.toHex(),
    };
  }
}
