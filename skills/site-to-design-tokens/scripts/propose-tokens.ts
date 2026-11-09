/**
 * Turns crawled site styles into a token proposal in the TSP structure:
 * colour primitives with 100-900 ramps, semantic aliases, and type, spacing,
 * radius, shadow, layout and breakpoint scales.
 *
 * Usage:
 *   npx tsx propose-tokens.ts site-styles.json --out proposal.json --report proposal.md
 *   npx tsx propose-tokens.ts site-styles.json --assign brand=#8d621f,primary=#565b3d
 *   npx tsx propose-tokens.ts site-styles.json --layout content=768,wide=1240
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { Color, RampBuilder, RAMP_STEPS, RampStep, STEP_LIGHTNESS } from './lib/color';
import type { ElementSample, PageCapture, Role, SiteStyles } from './crawl-site-styles';

export type Family = 'brand' | 'primary' | 'cta' | 'neutral';
export const CHROMATIC_FAMILIES: Family[] = ['brand', 'primary', 'cta'];

export const SYSTEM_DEFAULTS: Record<string, string> = {
  'error-foreground': '#cc0000',
  'error-background': '#fabcbc',
  'warning-foreground': '#8a5a00',
  'warning-background': '#ffeeb2',
  'success-foreground': '#127301',
  'success-background': '#e3ffe6',
  'information-foreground': '#0047d0',
  'information-background': '#b9d1ff',
};

/** Default semantic aliases, from the TSP design system. */
export const SEMANTIC_DEFAULTS: Record<string, string> = {
  'text/default': 'contrast',
  'text/muted': 'neutral-600',
  'text/inverse': 'base',
  'text/inverse-subtle': 'neutral-100',
  'text/brand': 'brand-600',
  'text/link': 'brand-600',
  'text/link-hover': 'primary-500',
  'text/disabled': 'neutral-500',
  'text/placeholder': 'neutral-600',
  'surface/default': 'base',
  'surface/subtle': 'neutral-100',
  'surface/brand': 'brand-100',
  'surface/inverse': 'contrast',
  'surface/overlay': 'overlay',
  'surface/control-checked': 'brand-600',
  'surface/control-off': 'neutral-500',
  'surface/control-disabled': 'neutral-200',
  'border/default': 'neutral-500',
  'border/subtle': 'neutral-400',
  'border/strong': 'neutral-700',
  'border/divider': 'neutral-200',
  'border/focus': 'brand-600',
  'border/focus-inverse': 'brand-500',
  'action/primary/background': 'primary-500',
  'action/primary/background-hover': 'primary-600',
  'action/primary/text': 'base',
  'action/secondary/background': 'brand-600',
  'action/secondary/background-hover': 'brand-700',
  'action/secondary/text': 'base',
  'action/cta/background': 'cta-500',
  'action/cta/background-hover': 'cta-600',
  'action/cta/text': 'base',
  'feedback/error/text': 'error-foreground',
  'feedback/error/background': 'error-background',
  'feedback/error/border': 'error-foreground',
  'feedback/warning/text': 'warning-foreground',
  'feedback/warning/background': 'warning-background',
  'feedback/warning/border': 'warning-foreground',
  'feedback/success/text': 'success-foreground',
  'feedback/success/background': 'success-background',
  'feedback/success/border': 'success-foreground',
  'feedback/info/text': 'information-foreground',
  'feedback/info/background': 'information-background',
  'feedback/info/border': 'information-foreground',
};

export const SHADOW_ALPHAS = [5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 70, 85];
/** The type ladder: slugs 100 to 900, body text at 200. Names are display names only. */
const SIZE_NAMES = [
  'Tiny',
  'Base',
  'Small',
  'Medium',
  'Large',
  'X-Large',
  'Huge',
  'Gigantic',
  'Colossal',
];
/** Numeric slug for the nth step of a ladder that counts in hundreds (100, 200, ...). */
const hundreds = (index: number) => String((index + 1) * 100);
/** The LightSpeed spacing ladder: the slug is the step, the name its T-shirt size. */
export const SPACING_STEPS = [
  { slug: '5', name: 'XXS' },
  { slug: '10', name: 'XS' },
  { slug: '20', name: 'S' },
  { slug: '30', name: 'M' },
  { slug: '40', name: 'L' },
  { slug: '50', name: 'XL' },
  { slug: '60', name: 'XXL' },
  { slug: '70', name: 'XXXL' },
  { slug: '80', name: 'XXXXL' },
  { slug: '90', name: 'Gigantic' },
  { slug: '100', name: 'Colossal' },
];
const RADIUS_NAMES = ['Small', 'Base', 'Medium', 'Large', 'X-Large', 'Huge'];
const SHADOW_NAMES = ['X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'Huge'];

export interface ColourEvidence {
  hex: string;
  weight: number;
  uses: Partial<Record<string, number>>;
}

export interface Anchor {
  family: Family;
  hex: string;
  step: RampStep;
  source: 'observed' | 'assigned' | 'generated';
  evidence: string;
}

export interface MatchRow {
  value: string;
  weight: number;
  uses: string;
  token: string;
  distance: number;
  match: 'exact' | 'near' | 'none';
}

export interface ContrastRow {
  pair: string;
  foreground: string;
  background: string;
  ratio: number;
  required: number;
  pass: boolean;
}

export interface ScaleEntry {
  name: string;
  slug: string;
  max: number;
  min: number;
  lineHeight?: number;
}

export interface ShadowEffect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW';
  color: { r: number; g: number; b: number; a: number };
  offset: { x: number; y: number };
  radius: number;
  spread: number;
}

export interface ShadowEntry {
  name: string;
  slug: string;
  css: string;
  uses: number;
  effects: ShadowEffect[];
}

export interface Proposal {
  site: string;
  generatedAt: string;
  colour: {
    primitives: Record<string, string>;
    anchors: Anchor[];
    semantic: Record<string, { token: string; source: 'observed' | 'default'; evidence?: string }>;
    overlay: string;
    shadowAlphas: number[];
  };
  matches: MatchRow[];
  contrast: ContrastRow[];
  typography: {
    families: Record<Exclude<FontRoleSlug, 'accent'>, FontRole> & { accent?: FontRole };
    sizes: ScaleEntry[];
    weights: Record<string, number>;
  };
  spacing: ScaleEntry[];
  radius: Array<{ name: string; slug: string; value: number }>;
  shadows: ShadowEntry[];
  layout: { content?: number; wide?: number };
  breakpoints: { mobile: number; tablet: number; desktop: number };
  decisions: string[];
}

export type FontRoleSlug = 'heading' | 'body' | 'accent' | 'monospace';

/** One font family role. `name` is the clean display name, `stack` the CSS stack. */
export interface FontRole {
  name: string;
  stack: string;
  source: 'live' | 'default';
  /** The name as the site's CSS writes it, when it differs from `name`. */
  raw?: string;
}

export const MONOSPACE_STACK =
  'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
const STYLE_SUFFIX =
  /(?:extralight|ultralight|semibold|demibold|extrabold|ultrabold|regular|italic|oblique|medium|light|bold|black|heavy|thin|book|roman)$/i;

/**
 * Cleans a raw `@font-face` family name: drops weight and style suffixes such as
 * `regular` or `bold`, turns underscores into spaces and title-cases lower-case words.
 * `argesta_displayregular` becomes `Argesta Display`. Mixed-case words (`DM`) are kept.
 */
export function cleanFontName(raw: string): string {
  let name = raw.replace(/["']/g, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  for (let i = 0; i < 3; i++) {
    const stripped = name.replace(STYLE_SUFFIX, '').trim();
    if (stripped === name || stripped.length < 3) {
      break;
    }
    name = stripped;
  }
  return name
    .split(' ')
    .map((word) =>
      word === word.toLowerCase() ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(' ');
}

export interface ProposeOptions {
  /** Force a family's anchor colour, for example { brand: '#8d621f' }. */
  assign?: Partial<Record<Family, string>>;
  /** Force the content and wide widths in px, for example { content: 768, wide: 1240 }. */
  layout?: { content?: number; wide?: number };
  now?: () => Date;
}

export const CONTRAST_PAIRS: Array<[string, string, number]> = [
  ['text/default', 'surface/default', 4.5],
  ['text/muted', 'surface/default', 4.5],
  ['text/link', 'surface/default', 4.5],
  ['text/link-hover', 'surface/default', 4.5],
  ['text/placeholder', 'surface/default', 4.5],
  ['text/default', 'surface/subtle', 4.5],
  ['text/inverse', 'surface/inverse', 4.5],
  ['action/primary/text', 'action/primary/background', 4.5],
  ['action/primary/text', 'action/primary/background-hover', 4.5],
  ['action/secondary/text', 'action/secondary/background', 4.5],
  ['action/cta/text', 'action/cta/background', 4.5],
  ['border/focus', 'surface/default', 3],
  ['border/default', 'surface/default', 3],
  ['feedback/error/text', 'surface/default', 4.5],
  ['feedback/warning/text', 'surface/default', 4.5],
  ['feedback/success/text', 'surface/default', 4.5],
  ['feedback/info/text', 'surface/default', 4.5],
];

/** Weighted mode of a list of values. */
function mode<T>(values: Array<{ value: T; weight?: number }>): T | undefined {
  const counts = new Map<T, number>();
  for (const { value, weight } of values) {
    counts.set(value, (counts.get(value) ?? 0) + (weight ?? 1));
  }
  let best: T | undefined;
  let bestCount = -1;
  for (const [value, count] of counts) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

/** Fit test limits for site colours placed into ramps. See `fitSiteColours`. */
const FIT_HUE_TOLERANCE = 25;
const FIT_MIN_CHROMA = 0.025;
const FIT_NEUTRAL_CHROMA = 0.04;
const FIT_LIGHTNESS_TOLERANCE = 0.04;

export class TokenProposer {
  private readonly ramps = new RampBuilder();
  private decisions: string[] = [];

  propose(styles: SiteStyles, options: ProposeOptions = {}): Proposal {
    this.decisions = [];
    const desktopWidth = Math.max(...styles.viewports);
    const mobileWidth = Math.min(...styles.viewports);
    const desktop = styles.captures.filter((c) => c.viewport === desktopWidth);
    const mobile = styles.captures.filter((c) => c.viewport === mobileWidth);
    const desktopSamples = desktop.flatMap((c) => c.samples.map((s) => ({ ...s, page: c.url })));
    const mobileByKey = new Map<string, ElementSample>();
    for (const capture of mobile) {
      for (const sample of capture.samples) {
        mobileByKey.set(`${capture.url}|${sample.key}`, sample);
      }
    }
    const pair = (s: ElementSample & { page: string }) => mobileByKey.get(`${s.page}|${s.key}`);

    const evidence = this.colourEvidence(desktopSamples);
    const colour = this.proposeColour(evidence, options.assign ?? {});
    const matches = this.matchColours(evidence, colour.primitives);
    const contrast = this.checkContrast(colour.primitives, colour.semantic);
    const typography = this.proposeTypography(desktopSamples, pair);
    const spacing = this.proposeSpacing(desktopSamples, pair);
    const radius = this.proposeRadius(desktopSamples);
    const shadows = this.proposeShadows(desktopSamples);
    const layout = this.proposeLayout(desktopSamples, desktopWidth, desktop, options.layout);
    const breakpoints = this.proposeBreakpoints(styles.captures);

    return {
      site: styles.site,
      generatedAt: (options.now ?? (() => new Date()))().toISOString(),
      colour,
      matches,
      contrast,
      typography,
      spacing,
      radius,
      shadows,
      layout,
      breakpoints,
      decisions: this.decisions,
    };
  }

  /** Counts every opaque colour by where it is used. */
  colourEvidence(samples: ElementSample[]): ColourEvidence[] {
    const byHex = new Map<string, ColourEvidence>();
    const add = (value: string | undefined, use: string, weight: number) => {
      const color = value ? Color.parse(value) : null;
      if (!color || color.rgb.a < 0.05) {
        return;
      }
      const hex = color.toHex();
      const entry = byHex.get(hex) ?? { hex, weight: 0, uses: {} };
      entry.weight += weight;
      entry.uses[use] = (entry.uses[use] ?? 0) + 1;
      byHex.set(hex, entry);
    };
    for (const s of samples) {
      add(s.color, `${s.role}-text`, 1);
      add(s.background, `${s.role}-background`, s.role === 'section' ? 3 : 1);
      add(s.border, `${s.role}-border`, 0.5);
    }
    return [...byHex.values()].sort((a, b) => b.weight - a.weight);
  }

  proposeColour(
    evidence: ColourEvidence[],
    assign: Partial<Record<Family, string>>
  ): Proposal['colour'] {
    const opaque = evidence.filter((e) => Color.parse(e.hex)!.isOpaque);
    const isNeutral = (hex: string) => Color.parse(hex)!.toOklch().c < 0.025;
    const lightness = (hex: string) => Color.parse(hex)!.toOklch().l;
    const usage = (e: ColourEvidence, suffix: string) =>
      Object.entries(e.uses)
        .filter(([use]) => use.endsWith(suffix))
        .reduce((total, [, n]) => total + (n ?? 0), 0);

    const base =
      opaque.find((e) => isNeutral(e.hex) && lightness(e.hex) > 0.9 && usage(e, '-background') > 0)
        ?.hex ?? '#ffffff';
    const contrast =
      opaque.find((e) => lightness(e.hex) < 0.4 && (e.uses['body-text'] ?? 0) > 0)?.hex ??
      opaque.find((e) => lightness(e.hex) < 0.4 && usage(e, '-text') > 0)?.hex ??
      '#1a1a1a';
    if (base === '#ffffff' && !opaque.some((e) => e.hex === '#ffffff')) {
      this.decisions.push('No light page background was found, so `base` defaults to #ffffff.');
    }

    // Group chromatic colours into clusters of near-identical values.
    const clusters: ColourEvidence[] = [];
    for (const e of opaque.filter((x) => !isNeutral(x.hex))) {
      const color = Color.parse(e.hex)!;
      const home = clusters.find((c) => Color.parse(c.hex)!.distance(color) < 6);
      if (home) {
        home.weight += e.weight;
        for (const [use, n] of Object.entries(e.uses)) {
          home.uses[use] = (home.uses[use] ?? 0) + (n ?? 0);
        }
      } else {
        clusters.push({ hex: e.hex, weight: e.weight, uses: { ...e.uses } });
      }
    }
    clusters.sort((a, b) => b.weight - a.weight);

    const describe = (c: ColourEvidence) =>
      Object.entries(c.uses)
        .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
        .slice(0, 3)
        .map(([use, n]) => `${use} ×${n}`)
        .join(', ');

    const anchors: Anchor[] = [];
    const taken = new Set<string>();
    const pick = (family: Family, chooser: (c: ColourEvidence) => number, reason: string) => {
      if (assign[family]) {
        const hex = Color.parse(assign[family]!)?.toHex();
        if (!hex) {
          throw new Error(`--assign ${family}=${assign[family]} is not a colour.`);
        }
        taken.add(hex);
        anchors.push({
          family,
          hex,
          step: this.ramps.nearestStep(lightness(hex)),
          source: 'assigned',
          evidence: 'Assigned by the reviewer.',
        });
        return;
      }
      const candidates = clusters
        .filter((c) => !taken.has(c.hex))
        .map((c) => ({ c, score: chooser(c) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score);
      const chosen = candidates[0]?.c;
      if (chosen) {
        taken.add(chosen.hex);
        anchors.push({
          family,
          hex: chosen.hex,
          step: this.ramps.nearestStep(lightness(chosen.hex)),
          source: 'observed',
          evidence: `${reason}: ${describe(chosen)}`,
        });
        return;
      }
      const ref = anchors[0] ? Color.parse(anchors[0].hex)!.toOklch() : { l: 0.55, c: 0.12, h: 30 };
      const offsets: Record<string, number> = { brand: 0, primary: 120, cta: 200 };
      const generated = Color.fromOklch({
        l: 0.5,
        c: Math.max(ref.c, 0.1),
        h: (ref.h + offsets[family]) % 360,
      }).toHex();
      anchors.push({
        family,
        hex: generated,
        step: 600,
        source: 'generated',
        evidence: 'No distinct colour on the site.',
      });
      this.decisions.push(
        `No site colour fits \`${family}\`; ${generated} was generated as a placeholder. Choose one.`
      );
    };

    const chroma = (hex: string) => Color.parse(hex)!.toOklch().c;
    // The call to action is the most saturated colour that fills a button.
    pick(
      'cta',
      (c) => (usage(c, 'button-background') > 0 ? chroma(c.hex) : 0),
      'Most saturated button fill'
    );
    // The brand colour dresses buttons and in-text links.
    pick(
      'brand',
      (c) =>
        usage(c, 'button-background') * 2 +
        usage(c, 'button-border') +
        usage(c, 'button-text') +
        usage(c, 'link-text') * 2,
      'Most used on buttons and in-text links'
    );
    pick('primary', (c) => c.weight, 'Next most used colour');

    const primitives: Record<string, string> = { base, contrast };
    for (const anchor of anchors) {
      const ramp = this.ramps.build(anchor.hex);
      anchor.step = ramp.anchorStep;
      for (const step of RAMP_STEPS) {
        primitives[`${anchor.family}-${step}`] = ramp.steps[step];
      }
    }

    // Neutral ramp: the site's mid grey if it has one, else a grey tinted like its greys.
    const neutrals = opaque.filter((e) => isNeutral(e.hex) && e.hex !== base && e.hex !== contrast);
    const midGrey = neutrals
      .filter((e) => Math.abs(lightness(e.hex) - 0.62) < 0.12)
      .sort((a, b) => Math.abs(lightness(a.hex) - 0.62) - Math.abs(lightness(b.hex) - 0.62))[0];
    let neutralAnchor = midGrey?.hex;
    if (!neutralAnchor) {
      const tinted = neutrals.map((e) => Color.parse(e.hex)!.toOklch()).filter((o) => o.c > 0.003);
      const hue = tinted.length ? tinted.reduce((t, o) => t + o.h, 0) / tinted.length : 60;
      const chroma = tinted.length
        ? Math.min(0.012, tinted.reduce((t, o) => t + o.c, 0) / tinted.length)
        : 0.006;
      neutralAnchor = Color.fromOklch({ l: 0.62, c: chroma, h: hue }).toHex();
    }
    const neutral = this.ramps.build(neutralAnchor, { maxChroma: 0.02 });
    anchors.push({
      family: 'neutral',
      hex: neutralAnchor,
      step: neutral.anchorStep,
      source: midGrey ? 'observed' : 'generated',
      evidence: midGrey
        ? `Mid grey used on the site: ${describe(midGrey)}`
        : 'Tinted from the site greys.',
    });
    for (const step of RAMP_STEPS) {
      primitives[`neutral-${step}`] = neutral.steps[step];
    }
    this.fitSiteColours(opaque, primitives, anchors, [base, contrast]);
    Object.assign(primitives, SYSTEM_DEFAULTS);

    const shadowBase = Color.parse(primitives['neutral-900'])!.rgb;
    const overlay = Color.fromRgb({ ...shadowBase, a: 0.25 }).toHex();

    const semantic = this.proposeSemantic(evidence, primitives, anchors);
    return { primitives, anchors, semantic, overlay, shadowAlphas: SHADOW_ALPHAS };
  }

  /**
   * Replaces generated ramp steps with real site colours that fit the ramp.
   *
   * A site colour fits a family's ramp when all of these hold:
   * 1. Hue: chromatic families need the same hue family as the anchor (within
   *    FIT_HUE_TOLERANCE degrees) and a chroma between 0.4x and 1.6x the anchor's,
   *    and at least 0.025. The neutral family needs chroma of 0.04 or less.
   * 2. Lightness: it sits within FIT_LIGHTNESS_TOLERANCE of the target lightness
   *    of its nearest step, so it reads as that step.
   * 3. Monotonic: it is lighter than the step after it and darker than the step
   *    before it, using the ramp's current values, so lightness still falls from
   *    100 to 900.
   * The anchor step is never replaced. Colours are handled heaviest first, each
   * goes to the family whose nearest step is closest, and a step already claimed
   * by a heavier colour is not taken again. Colours that fit nowhere keep being
   * matched to the nearest token.
   */
  fitSiteColours(
    candidates: ColourEvidence[],
    primitives: Record<string, string>,
    anchors: Anchor[],
    exclude: string[]
  ): void {
    const skip = new Set([...exclude, ...anchors.map((a) => a.hex), ...Object.values(primitives)]);
    const claimed = new Map<string, string>();
    const lightnessOf = (hex: string) => Color.parse(hex)!.toOklch().l;
    const ordered = [...candidates].sort((a, b) => b.weight - a.weight);

    for (const site of ordered) {
      if (skip.has(site.hex)) {
        continue;
      }
      const color = Color.parse(site.hex)!;
      const o = color.toOklch();
      const step = this.ramps.nearestStep(o.l);
      if (Math.abs(STEP_LIGHTNESS[step] - o.l) > FIT_LIGHTNESS_TOLERANCE) {
        continue;
      }
      let best: { slug: string; family: string; distance: number } | undefined;
      for (const anchor of anchors) {
        const slug = `${anchor.family}-${step}`;
        if (step === anchor.step || !this.fitsRamp(o, anchor)) {
          continue;
        }
        if (!this.keepsRampMonotonic(anchor.family, step, o.l, primitives, lightnessOf)) {
          continue;
        }
        const distance = color.distance(Color.parse(primitives[slug])!);
        if (!best || distance < best.distance) {
          best = { slug, family: anchor.family, distance };
        }
      }
      if (!best) {
        continue;
      }
      const holder = claimed.get(best.slug);
      if (holder) {
        this.decisions.push(
          `Site colour ${site.hex} also fits ${best.slug}, but ${holder} is used more, so ${best.slug} keeps ${holder}.`
        );
        continue;
      }
      this.decisions.push(
        `Site colour ${site.hex} replaced ${best.slug} (was ${primitives[best.slug]}).`
      );
      primitives[best.slug] = site.hex;
      claimed.set(best.slug, site.hex);
    }
  }

  /** Hue and chroma part of the fits test. */
  private fitsRamp(o: { l: number; c: number; h: number }, anchor: Anchor): boolean {
    const a = Color.parse(anchor.hex)!.toOklch();
    if (anchor.family === 'neutral') {
      // Any site grey fits, whatever its tint: the ramp should match the site's own greys.
      return o.c <= FIT_NEUTRAL_CHROMA;
    }
    const hueGap = Math.min(Math.abs(o.h - a.h), 360 - Math.abs(o.h - a.h));
    return (
      o.c >= FIT_MIN_CHROMA && hueGap <= FIT_HUE_TOLERANCE && o.c >= a.c * 0.4 && o.c <= a.c * 1.6
    );
  }

  /** True when `lightness` sits strictly between the ramp's neighbours of `step`. */
  private keepsRampMonotonic(
    family: string,
    step: RampStep,
    lightness: number,
    primitives: Record<string, string>,
    lightnessOf: (hex: string) => number
  ): boolean {
    const index = RAMP_STEPS.indexOf(step);
    const lighter = RAMP_STEPS[index - 1];
    const darker = RAMP_STEPS[index + 1];
    const above = lighter ? lightnessOf(primitives[`${family}-${lighter}`]) : Infinity;
    const below = darker ? lightnessOf(primitives[`${family}-${darker}`]) : -Infinity;
    return lightness < above && lightness > below;
  }

  proposeSemantic(
    evidence: ColourEvidence[],
    primitives: Record<string, string>,
    anchors: Anchor[] = []
  ): Proposal['colour']['semantic'] {
    const semantic: Proposal['colour']['semantic'] = {};
    for (const [role, token] of Object.entries(SEMANTIC_DEFAULTS)) {
      semantic[role] = { token, source: 'default' };
    }
    const heaviest = (use: string, chromaticOnly = false) =>
      evidence
        .filter(
          (e) =>
            (e.uses[use] ?? 0) > 0 &&
            Color.parse(e.hex)!.isOpaque &&
            (!chromaticOnly || Color.parse(e.hex)!.toOklch().c >= 0.025)
        )
        .sort((a, b) => (b.uses[use] ?? 0) - (a.uses[use] ?? 0))[0];
    const page = Color.parse(primitives.base)!;
    const observe = (role: string, use: string, family?: string, chromaticOnly = false) => {
      const found = heaviest(use, chromaticOnly) ?? (chromaticOnly ? heaviest(use) : undefined);
      if (!found) {
        return;
      }
      // A text colour that can't be read on the page surface comes from photos or dark bands.
      if (role.startsWith('text/') && Color.parse(found.hex)!.contrast(page) < 3) {
        this.decisions.push(
          `\`${role}\` kept the default \`${semantic[role].token}\`: the site's most used ${use} colour (${found.hex}) is unreadable on \`base\`, so it probably sits on photos or dark sections.`
        );
        return;
      }
      const token = this.nearestPrimitive(found.hex, primitives, family);
      semantic[role] = {
        token,
        source: 'observed',
        evidence: `${found.hex} (${use} ×${found.uses[use]})`,
      };
      return token;
    };

    observe('text/default', 'body-text');
    // Prefer a coloured link: white or black links usually sit on photos or in menus.
    observe('text/link', 'link-text', undefined, true);
    if (!heaviest('link-text')) {
      observe('text/link', 'nav-text', undefined, true);
    }
    const buttonBg = observe('action/primary/background', 'button-background');
    observe('action/primary/text', 'button-text');
    observe('border/default', 'input-border');
    if (buttonBg) {
      semantic['action/primary/background-hover'] = {
        token: this.darker(buttonBg),
        source: 'observed',
        evidence: `One step darker than ${buttonBg}.`,
      };
    }

    // A family whose anchor came from button fills IS the live button colour, so the
    // action background takes the anchor step itself, and hover goes one step darker.
    const actions: Array<[string, string]> = [
      ['primary', 'primary'],
      ['secondary', 'brand'],
      ['cta', 'cta'],
    ];
    for (const [action, family] of actions) {
      const anchor = anchors.find((a) => a.family === family);
      const onButtons =
        anchor?.source === 'observed' &&
        evidence.some((e) => e.hex === anchor.hex && (e.uses['button-background'] ?? 0) > 0);
      if (!anchor || !onButtons) {
        continue;
      }
      const token = `${family}-${anchor.step}`;
      semantic[`action/${action}/background`] = {
        token,
        source: 'observed',
        evidence: `${anchor.hex}, the live button fill that anchors \`${family}\`.`,
      };
      semantic[`action/${action}/background-hover`] = {
        token: this.darker(token),
        source: 'observed',
        evidence: `One step darker than ${token}.`,
      };
    }

    const light = evidence.filter(
      (e) =>
        (e.uses['section-background'] ?? 0) > 0 &&
        Color.parse(e.hex)!.isOpaque &&
        e.hex !== primitives.base &&
        Color.parse(e.hex)!.toOklch().l > 0.85
    )[0];
    if (light) {
      semantic['surface/subtle'] = {
        token: this.nearestPrimitive(light.hex, primitives),
        source: 'observed',
        evidence: `${light.hex} (section-background ×${light.uses['section-background']})`,
      };
    }
    const dark = evidence.filter(
      (e) =>
        (e.uses['section-background'] ?? 0) > 0 &&
        Color.parse(e.hex)!.isOpaque &&
        Color.parse(e.hex)!.toOklch().l < 0.35
    )[0];
    if (dark) {
      semantic['surface/inverse'] = {
        token: this.nearestPrimitive(dark.hex, primitives),
        source: 'observed',
        evidence: `${dark.hex} (section-background ×${dark.uses['section-background']})`,
      };
    }
    this.fixFailingPairs(primitives, semantic);
    return semantic;
  }

  /**
   * Moves a default token that fails its contrast pair to the nearest step of the same
   * family that passes, darker steps first, and records the move. A failing token taken
   * from the live site is left alone and listed for the reviewer with a passing alternative.
   */
  private fixFailingPairs(
    primitives: Record<string, string>,
    semantic: Proposal['colour']['semantic']
  ): void {
    const hexOf = (role: string): string | undefined => primitives[semantic[role]?.token ?? role];
    const ratio = (fg: string, bg: string) => {
      const [f, b] = [hexOf(fg), hexOf(bg)];
      return f && b ? Color.parse(f)!.contrast(Color.parse(b)!) : Infinity;
    };
    for (const [fg, bg, required] of CONTRAST_PAIRS) {
      const current = ratio(fg, bg);
      if (current >= required) {
        continue;
      }
      // Text on a fixed surface moves the text. Text on an action moves the action.
      const role = fg.startsWith('action/') ? bg : fg;
      const other = role === fg ? bg : fg;
      const match = semantic[role]?.token.match(/^(.*)-(\d00)$/);
      if (!match || ['text/default', 'text/inverse'].includes(role)) {
        continue;
      }
      const index = RAMP_STEPS.indexOf(Number(match[2]) as RampStep);
      const rounded = (n: number) => Math.round(n * 100) / 100;
      let alternative: { token: string; ratio: number } | undefined;
      for (let distance = 1; distance < RAMP_STEPS.length && !alternative; distance++) {
        for (const i of [index + distance, index - distance]) {
          const step = RAMP_STEPS[i];
          const token = step ? `${match[1]}-${step}` : undefined;
          if (!token || !primitives[token]) {
            continue;
          }
          const r =
            role === fg
              ? Color.parse(primitives[token])!.contrast(
                  Color.parse(primitives[semantic[other].token])!
                )
              : Color.parse(primitives[semantic[other].token])!.contrast(
                  Color.parse(primitives[token])!
                );
          if (r >= required) {
            alternative = { token, ratio: rounded(r) };
            break;
          }
        }
      }
      const was = semantic[role].token;
      if (!alternative) {
        this.decisions.push(
          `\`${role}\` (\`${was}\`) fails ${required}:1 against \`${other}\` (${rounded(current)}:1) and no step of its family passes. Choose another colour.`
        );
      } else if (semantic[role].source === 'default') {
        semantic[role] = {
          token: alternative.token,
          source: 'default',
          evidence: `Default \`${was}\` failed ${required}:1 (${rounded(current)}:1), so it moved to the nearest passing step.`,
        };
        this.decisions.push(
          `\`${role}\` default \`${was}\` failed ${required}:1 against \`${other}\` (${rounded(current)}:1); moved to \`${alternative.token}\` (${alternative.ratio}:1).`
        );
      } else {
        this.decisions.push(
          `\`${role}\` (\`${was}\`, from the live site) fails ${required}:1 against \`${other}\` (${rounded(current)}:1). \`${alternative.token}\` passes (${alternative.ratio}:1). Confirm which to use.`
        );
      }
    }
  }

  nearestPrimitive(hex: string, primitives: Record<string, string>, family?: string): string {
    const color = Color.parse(hex)!;
    let best = 'contrast';
    let bestDistance = Infinity;
    for (const [slug, value] of Object.entries(primitives)) {
      if (family && !slug.startsWith(family)) {
        continue;
      }
      const d = color.distance(Color.parse(value)!);
      if (d < bestDistance) {
        best = slug;
        bestDistance = d;
      }
    }
    return best;
  }

  matchColours(evidence: ColourEvidence[], primitives: Record<string, string>): MatchRow[] {
    return evidence.slice(0, 40).map((e) => {
      const token = this.nearestPrimitive(e.hex, primitives);
      const distance =
        Math.round(Color.parse(e.hex)!.distance(Color.parse(primitives[token])!) * 10) / 10;
      return {
        value: e.hex,
        weight: Math.round(e.weight * 10) / 10,
        uses: Object.entries(e.uses)
          .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
          .slice(0, 3)
          .map(([use, n]) => `${use} ×${n}`)
          .join(', '),
        token,
        distance,
        match: distance < 0.5 ? 'exact' : distance < 6 ? 'near' : 'none',
      };
    });
  }

  checkContrast(
    primitives: Record<string, string>,
    semantic: Proposal['colour']['semantic']
  ): ContrastRow[] {
    const resolve = (role: string) => {
      const token = semantic[role]?.token ?? role;
      return primitives[token];
    };
    const pairs = CONTRAST_PAIRS;
    return pairs.map(([fg, bg, required]) => {
      const foreground = resolve(fg);
      const background = resolve(bg);
      const ratio =
        Math.round(Color.parse(foreground)!.contrast(Color.parse(background)!) * 100) / 100;
      return {
        pair: `${fg} on ${bg}`,
        foreground,
        background,
        ratio,
        required,
        pass: ratio >= required,
      };
    });
  }

  proposeTypography(
    samples: Array<ElementSample & { page: string }>,
    pair: (s: ElementSample & { page: string }) => ElementSample | undefined
  ): Proposal['typography'] {
    const textRoles: Role[] = [
      'body',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'button',
      'link',
      'nav',
      'input',
    ];
    const text = samples.filter((s) => textRoles.includes(s.role) && s.fontSize);
    const body = text.filter((s) => s.role === 'body');
    const families = this.proposeFamilies(samples, textRoles);

    const bodySize = mode(body.map((s) => ({ value: Math.round(s.fontSize!) }))) ?? 16;
    const pairs = new Map<number, { min: number; weight: number; ratios: number[] }>();
    for (const s of text) {
      const max = Math.round(s.fontSize!);
      const mobileSize = pair(s)?.fontSize;
      const entry = pairs.get(max) ?? { min: max, weight: 0, ratios: [] };
      entry.weight += /^h/.test(s.role) ? 3 : 1;
      if (mobileSize) {
        entry.min = Math.min(entry.min, Math.round(mobileSize));
      }
      const ratio = s.lineHeight ? Math.round((s.lineHeight / s.fontSize!) * 100) / 100 : 0;
      if (ratio >= 0.9 && ratio <= 2.5) {
        entry.ratios.push(ratio); // Outside this range is usually an icon or a fixed-height box.
      }
      pairs.set(max, entry);
    }

    const below = [...pairs.keys()]
      .filter((v) => v < bodySize)
      .sort((a, b) => pairs.get(b)!.weight - pairs.get(a)!.weight);
    let above = [...pairs.keys()].filter((v) => v > bodySize).sort((a, b) => a - b);
    if (below.length > 1) {
      this.decisions.push(
        `Sizes smaller than body text (${below.join(', ')}px) share the one Tiny slot; ${below[0]}px was kept.`
      );
    }
    const slots = SIZE_NAMES.length - 2;
    while (above.length > slots) {
      // Merge the two closest sizes, keeping the more used one.
      let closest = 0;
      for (let i = 1; i < above.length - 1; i++) {
        if (above[i + 1] / above[i] < above[closest + 1] / above[closest]) {
          closest = i;
        }
      }
      const [a, b] = [above[closest], above[closest + 1]];
      const drop = pairs.get(a)!.weight >= pairs.get(b)!.weight ? b : a;
      this.decisions.push(
        `The ${drop}px size was merged into the nearest size to fit the ${SIZE_NAMES.length}-step scale.`
      );
      above = above.filter((v) => v !== drop);
    }

    const scale = [...(below.length ? [below[0]] : []), bodySize, ...above];
    const firstIndex = below.length ? 0 : 1;
    const sizes: ScaleEntry[] = scale.map((max, i) => {
      const entry = pairs.get(max) ?? { min: max, weight: 0, ratios: [] };
      const name = SIZE_NAMES[firstIndex + i];
      return {
        name,
        slug: hundreds(firstIndex + i),
        max,
        min: Math.min(entry.min, max),
        lineHeight: mode(entry.ratios.map((value) => ({ value }))),
      };
    });

    const weights: Record<string, number> = {};
    for (const role of textRoles) {
      const weight = mode(
        text.filter((s) => s.role === role && s.fontWeight).map((s) => ({ value: s.fontWeight! }))
      );
      if (weight) {
        weights[role] = weight;
      }
    }
    return { families, sizes, weights };
  }

  /**
   * Heading and body come from the live site. Accent is the next most used family when
   * the site has a third one. Monospace is live only where the CSS uses a monospace stack.
   * Roles with no live evidence get a documented default, and the report says so.
   */
  proposeFamilies(
    samples: Array<ElementSample & { page: string }>,
    textRoles: string[]
  ): Proposal['typography']['families'] {
    const text = samples.filter((s) => textRoles.includes(s.role) && s.fontFamily);
    const isMono = (s: ElementSample) =>
      /\bmonospace\b/i.test(s.fontStack ?? '') ||
      /^(courier|consolas|menlo|monaco|sf mono|roboto mono|fira (code|mono)|source code)/i.test(
        s.fontFamily ?? ''
      );
    const proseText = text.filter((s) => !isMono(s));
    const stackFor = (raw: string) =>
      mode(
        text
          .filter((s) => s.fontFamily === raw && s.fontStack)
          .map((s) => ({ value: s.fontStack! }))
      ) ?? raw;
    const role = (raw: string): FontRole => {
      const name = cleanFontName(raw);
      return {
        name,
        stack: stackFor(raw),
        source: 'live',
        ...(name !== raw ? { raw } : {}),
      };
    };
    const headings = proseText.filter((s) => /^h[1-3]$/.test(s.role));
    const body = proseText.filter((s) => s.role === 'body');
    const headingRaw =
      mode(headings.map((s) => ({ value: s.fontFamily! }))) ||
      mode(proseText.map((s) => ({ value: s.fontFamily! })));
    const bodyRaw = mode(body.map((s) => ({ value: s.fontFamily! })));

    const heading: FontRole = headingRaw
      ? role(headingRaw)
      : { name: 'Serif', stack: 'serif', source: 'default' };
    const bodyRole: FontRole = bodyRaw
      ? role(bodyRaw)
      : { name: 'Sans Serif', stack: 'sans-serif', source: 'default' };
    if (heading.source === 'default') {
      this.decisions.push('No heading font was found; `heading` defaults to the generic serif.');
    }
    if (bodyRole.source === 'default') {
      this.decisions.push('No body font was found; `body` defaults to the generic sans-serif.');
    }

    const counts = new Map<string, number>();
    for (const s of proseText) {
      if (s.fontFamily !== headingRaw && s.fontFamily !== bodyRaw) {
        counts.set(s.fontFamily!, (counts.get(s.fontFamily!) ?? 0) + (/^h/.test(s.role) ? 3 : 1));
      }
    }
    const accentRaw = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    // The accent role exists only when the site really uses a third family.
    const accent = accentRaw ? role(accentRaw) : undefined;

    const monoRaw = mode(text.filter(isMono).map((s) => ({ value: s.fontFamily! })));
    const monospace: FontRole = monoRaw
      ? role(monoRaw)
      : { name: 'Monospace', stack: MONOSPACE_STACK, source: 'default' };
    return { heading, body: bodyRole, ...(accent ? { accent } : {}), monospace };
  }

  proposeSpacing(
    samples: Array<ElementSample & { page: string }>,
    pair: (s: ElementSample & { page: string }) => ElementSample | undefined
  ): ScaleEntry[] {
    const values: Array<{ max: number; min: number; weight: number }> = [];
    for (const s of samples) {
      const m = pair(s);
      if (s.paddingBlock && ['section', 'surface'].includes(s.role)) {
        values.push({
          max: Math.round(s.paddingBlock),
          min: Math.round(m?.paddingBlock ?? s.paddingBlock),
          weight: s.role === 'section' ? 2 : 1,
        });
      }
      if (s.gap) {
        values.push({ max: Math.round(s.gap), min: Math.round(m?.gap ?? s.gap), weight: 1 });
      }
      if (s.marginBlock && ['section', 'surface'].includes(s.role)) {
        values.push({
          max: Math.round(s.marginBlock),
          min: Math.round(m?.marginBlock ?? s.marginBlock),
          weight: s.role === 'section' ? 2 : 1,
        });
      }
    }
    values.sort((a, b) => a.max - b.max);
    // Values under 8px are borders and hairline offsets, not layout spacing.
    const layout = values.filter((v) => v.max >= 8);

    const clusters: Array<{ start: number; items: typeof values }> = [];
    for (const v of layout) {
      const last = clusters[clusters.length - 1];
      if (last && v.max <= last.start * 1.12 + 1) {
        last.items.push(v);
      } else {
        clusters.push({ start: v.max, items: [v] });
      }
    }
    let kept = clusters
      .map((c) => ({
        max: mode(c.items.map((i) => ({ value: i.max, weight: i.weight })))!,
        min: mode(c.items.map((i) => ({ value: i.min, weight: i.weight })))!,
        weight: c.items.reduce((t, i) => t + i.weight, 0),
      }))
      .filter((c) => c.weight >= 2);
    if (kept.length > SPACING_STEPS.length) {
      const byUse = [...kept].sort((a, b) => b.weight - a.weight);
      const dropped = byUse.slice(SPACING_STEPS.length).sort((a, b) => a.max - b.max);
      kept = byUse.slice(0, SPACING_STEPS.length).sort((a, b) => a.max - b.max);
      this.decisions.push(
        `${dropped.length} rarely used spacing values were left out of the scale: ${dropped.map((d) => `${d.max}px`).join(', ')}.`
      );
    }
    // Each value takes the ladder step nearest its desktop size, so 40px becomes
    // L (slug 40). A taken step pushes the value up to the next free step. If that
    // runs off the top of the ladder, values shift back down into free lower steps
    // (starting at 5) instead of being dropped. At most the ladder's length is kept
    // above, so every kept value always gets a step.
    const last = SPACING_STEPS.length - 1;
    const indexes: number[] = [];
    for (const c of kept) {
      const nearest = SPACING_STEPS.reduce(
        (best, step, i) =>
          Math.abs(Number(step.slug) - c.max) < Math.abs(Number(SPACING_STEPS[best].slug) - c.max)
            ? i
            : best,
        0
      );
      indexes.push(Math.max(nearest, indexes.length ? indexes[indexes.length - 1] + 1 : 0));
    }
    let shifted = false;
    for (let i = indexes.length - 1; i >= 0; i--) {
      const ceiling = i === indexes.length - 1 ? last : indexes[i + 1] - 1;
      if (indexes[i] > ceiling) {
        indexes[i] = ceiling;
        shifted = true;
      }
    }
    if (shifted) {
      this.decisions.push(
        'Some spacing values moved down to free lower steps so the whole 5 to 100 ladder is used and none is dropped.'
      );
    }
    const steps: ScaleEntry[] = kept.map((c, i) => ({
      ...SPACING_STEPS[indexes[i]],
      max: c.max,
      min: Math.min(c.min, c.max),
    }));
    return [{ name: 'None', slug: 'none', max: 0, min: 0 }, ...steps];
  }

  proposeRadius(samples: ElementSample[]): Proposal['radius'] {
    const counts = new Map<number, number>();
    for (const s of samples) {
      if (!s.radius) {
        continue;
      }
      const value = s.radius.endsWith('%') ? 9999 : Math.round(parseFloat(s.radius));
      if (value > 0) {
        counts.set(value >= 999 ? 9999 : value, (counts.get(value >= 999 ? 9999 : value) ?? 0) + 1);
      }
    }
    const values = [...counts.entries()]
      .filter(([v]) => v !== 9999)
      .sort((a, b) => b[1] - a[1])
      .slice(0, RADIUS_NAMES.length)
      .map(([v]) => v)
      .sort((a, b) => a - b);
    return [
      { name: 'None', slug: '0', value: 0 },
      ...values.map((value, i) => ({ name: RADIUS_NAMES[i], slug: hundreds(i), value })),
      { name: 'Round', slug: '700', value: 9999 },
    ];
  }

  proposeShadows(samples: ElementSample[]): ShadowEntry[] {
    const counts = new Map<string, number>();
    for (const s of samples) {
      if (s.shadow) {
        counts.set(s.shadow, (counts.get(s.shadow) ?? 0) + 1);
      }
    }
    const parsed = [...counts.entries()]
      .map(([css, uses]) => ({ css, uses, effects: TokenProposer.parseShadow(css) }))
      .filter((s) => s.effects.length)
      .sort((a, b) => b.uses - a.uses)
      .slice(0, SHADOW_NAMES.length)
      .sort(
        (a, b) =>
          a.effects.reduce((t, e) => t + e.radius, 0) - b.effects.reduce((t, e) => t + e.radius, 0)
      );
    return parsed.map((s, i) => ({ name: SHADOW_NAMES[i], slug: hundreds(i), ...s }));
  }

  /** Parses a computed box-shadow into effects. */
  static parseShadow(css: string): ShadowEffect[] {
    const layers: string[] = [];
    let depth = 0;
    let current = '';
    for (const ch of css) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        layers.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    layers.push(current);

    return layers.flatMap((layer) => {
      const colorMatch = layer.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}/i);
      const color = colorMatch ? Color.parse(colorMatch[0]) : null;
      const numbers = layer
        .replace(colorMatch?.[0] ?? '', '')
        .split(/\s+/)
        .filter((t) => /^-?[\d.]+(px)?$/.test(t))
        .map((t) => parseFloat(t));
      if (!color || numbers.length < 2) {
        return [];
      }
      const [x, y, blur = 0, spread = 0] = numbers;
      const round = (n: number) => Math.round(n * 1000) / 1000;
      return [
        {
          type: /\binset\b/.test(layer) ? 'INNER_SHADOW' : 'DROP_SHADOW',
          color: {
            r: round(color.rgb.r),
            g: round(color.rgb.g),
            b: round(color.rgb.b),
            a: round(color.rgb.a),
          },
          offset: { x, y },
          radius: blur,
          spread,
        } as ShadowEffect,
      ];
    });
  }

  /**
   * Content width is the width of running text (`p` in the main column) on single posts
   * and pages. Wide width is the widest repeated centred container. Either can be forced.
   */
  proposeLayout(
    samples: ElementSample[],
    viewport: number,
    captures: PageCapture[] = [],
    override: { content?: number; wide?: number } = {}
  ): Proposal['layout'] {
    const counts = new Map<number, number>();
    for (const s of samples) {
      if (s.containerWidth && s.containerWidth < viewport - 16) {
        const width = Math.round(s.containerWidth / 8) * 8;
        counts.set(width, (counts.get(width) ?? 0) + 1);
      }
    }
    const frequent = [...counts.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]);
    const wide =
      override.wide ?? (frequent.length ? Math.max(...frequent.map(([w]) => w)) : undefined);

    let content = override.content;
    if (content === undefined) {
      const single = captures.filter((c) => c.pageKind === 'single');
      const fromSingles = single.flatMap((c) => c.textWidths ?? []);
      const fromAny = captures.flatMap((c) => c.textWidths ?? []);
      const widths = fromSingles.length ? fromSingles : fromAny;
      if (widths.length) {
        content = mode(widths.map((w) => ({ value: Math.round(w / 8) * 8 })));
        if (!fromSingles.length) {
          this.decisions.push(
            'No single post or page was captured, so the content width was measured on listing pages and may be a card. Add a long text page, or set it with `--layout content=<px>`.'
          );
        }
      } else if (frequent.length) {
        const fallback = frequent.find(([w]) => w <= (wide ?? 0) * 0.8)?.[0];
        if (fallback) {
          content = fallback;
          this.decisions.push(
            `No running text was found, so the content width ${fallback}px comes from the most common centred container. Check it, or set it with \`--layout content=<px>\`.`
          );
        }
      }
    }
    if (content === undefined && wide === undefined) {
      this.decisions.push(
        'No running text or repeated centred container was found; set the content and wide widths with `--layout content=<px>,wide=<px>`.'
      );
      return {};
    }
    if (content !== undefined && content < 480) {
      this.decisions.push(
        `The content width is ${content}px, under 480px, which is narrower than a readable text column. Confirm it, or set it with \`--layout content=<px>\`.`
      );
    }
    return {
      ...(content !== undefined ? { content } : {}),
      ...(wide !== undefined ? { wide } : {}),
    };
  }

  proposeBreakpoints(captures: PageCapture[]): Proposal['breakpoints'] {
    const widths = captures.flatMap((c) => c.mediaWidths);
    const pick = (low: number, high: number, fallback: number) =>
      mode(widths.filter((w) => w > low && w <= high).map((value) => ({ value }))) ?? fallback;
    return {
      mobile: pick(300, 600, 376),
      tablet: pick(600, 1024, 768),
      desktop: pick(1024, 1600, 1240),
    };
  }

  private darker(token: string): string {
    const match = token.match(/^(.*)-(\d00)$/);
    if (!match || match[2] === '900') {
      return token;
    }
    return `${match[1]}-${Number(match[2]) + 100}`;
  }
}

/** Writes the proposal as a Markdown report for approval. */
export class ProposalReport {
  private fontLines(p: Proposal): string[] {
    const roles: FontRoleSlug[] = ['heading', 'body', 'accent', 'monospace'];
    return [
      '- Fonts:',
      ...roles.map((slug) => {
        const f = p.typography.families[slug];
        if (!f) {
          return `  - \`${slug}\`: none (no accent font: the site uses two families)`;
        }
        const raw = f.raw ? `, CSS name \`${f.raw}\`` : '';
        return `  - \`${slug}\`: ${f.name} (${f.source}${raw}), stack \`${f.stack}\``;
      }),
    ];
  }

  render(p: Proposal): string {
    const lines: string[] = [];
    const table = (head: string[], rows: Array<Array<string | number>>) => {
      lines.push(`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`);
      for (const row of rows) {
        lines.push(`| ${row.join(' | ')} |`);
      }
      lines.push('');
    };
    const failing = p.contrast.filter((c) => !c.pass);

    lines.push(
      `# Token proposal: ${p.site}`,
      '',
      `Generated ${p.generatedAt.slice(0, 10)}. Nothing is written to Figma or a theme until this is approved.`,
      ''
    );
    lines.push('## Summary', '');
    lines.push(
      `- Colour anchors: ${p.colour.anchors.map((a) => `${a.family} ${a.hex} at ${a.step}`).join('; ')}`
    );
    lines.push(
      `- Live colours matched: ${p.matches.filter((m) => m.match === 'exact').length} exact, ${p.matches.filter((m) => m.match === 'near').length} near, ${p.matches.filter((m) => m.match === 'none').length} no match`
    );
    lines.push(
      `- Contrast: ${p.contrast.length - failing.length} of ${p.contrast.length} pairs pass${failing.length ? ` (failing: ${failing.map((f) => f.pair).join('; ')})` : ''}`
    );
    lines.push(...this.fontLines(p), '');

    lines.push('## Decisions for the reviewer', '');
    const decisions = [...p.decisions];
    for (const anchor of p.colour.anchors) {
      if (anchor.source === 'observed') {
        decisions.push(
          `Confirm \`${anchor.family}\`: ${anchor.hex} at step ${anchor.step} (${anchor.evidence}).`
        );
      }
    }
    lines.push(...(decisions.length ? decisions.map((d) => `- ${d}`) : ['- None.']), '');

    lines.push('## Colour primitives (Theme - Colour)', '');
    table(
      ['Family', ...RAMP_STEPS.map(String)],
      (['brand', 'primary', 'cta', 'neutral'] as Family[]).map((f) => [
        f,
        ...RAMP_STEPS.map((s) => `\`${p.colour.primitives[`${f}-${s}`]}\``),
      ])
    );
    lines.push(
      `\`base\` ${p.colour.primitives.base}, \`contrast\` ${p.colour.primitives.contrast}, overlay ${p.colour.overlay}. System colours use the LightSpeed defaults.`,
      ''
    );

    lines.push('## Semantic tokens (Theme - Semantic)', '');
    table(
      ['Role', 'Token', 'Value', 'Source'],
      Object.entries(p.colour.semantic).map(([role, s]) => [
        `\`${role}\``,
        `\`${s.token}\``,
        p.colour.primitives[s.token] ?? p.colour.overlay,
        s.source === 'observed' ? `site: ${s.evidence}` : 'default',
      ])
    );

    lines.push('## Live colours to tokens', '');
    table(
      ['Live value', 'Used on', 'Token', 'Distance', 'Match'],
      p.matches.map((m) => [m.value, m.uses, `\`${m.token}\``, m.distance, m.match])
    );

    lines.push('## Contrast (WCAG 2.2)', '');
    table(
      ['Pair', 'Ratio', 'Needs', 'Result'],
      p.contrast.map((c) => [c.pair, c.ratio, `${c.required}:1`, c.pass ? 'pass' : '**fail**'])
    );

    lines.push('## Typography (Theme - Typography)', '');
    table(
      ['Size', 'Slug', 'Desktop (Max)', 'Mobile (Min)', 'Line height'],
      p.typography.sizes.map((s) => [
        s.name,
        `\`${s.slug}\``,
        `${s.max}px`,
        `${s.min}px`,
        s.lineHeight ?? '-',
      ])
    );
    lines.push(
      `Weights by role: ${
        Object.entries(p.typography.weights)
          .map(([r, w]) => `${r} ${w}`)
          .join(', ') || 'none found'
      }.`,
      ''
    );

    lines.push('## Spacing (Theme - Spacing)', '');
    table(
      ['Name', 'Slug', 'Max', 'Min'],
      p.spacing.map((s) => [s.name, `\`${s.slug}\``, `${s.max}px`, `${s.min}px`])
    );

    lines.push('## Radius, shadows and layout', '');
    table(
      ['Radius', 'Slug', 'Value'],
      p.radius.map((r) => [r.name, `\`${r.slug}\``, `${r.value}px`])
    );
    table(
      ['Shadow', 'Slug', 'Uses', 'CSS'],
      p.shadows.map((s) => [s.name, `\`${s.slug}\``, s.uses, `\`${s.css}\``])
    );
    lines.push(
      `Layout: content ${p.layout.content ?? '?'}px, wide ${p.layout.wide ?? '?'}px. Breakpoints: mobile ${p.breakpoints.mobile}px, tablet ${p.breakpoints.tablet}px, desktop ${p.breakpoints.desktop}px.`,
      ''
    );
    return `${lines.join('\n')}\n`;
  }
}

export interface ProposeCliIo {
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

export function runProposeCli(argv: string[], io: ProposeCliIo): number {
  let input: string | undefined;
  let out = 'proposal.json';
  let report: string | undefined;
  const assign: Partial<Record<Family, string>> = {};
  const layout: { content?: number; wide?: number } = {};

  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      const next = () => {
        const value = argv[++i];
        if (value === undefined) {
          throw new Error(`${arg} needs a value.`);
        }
        return value;
      };
      if (arg === '--help' || arg === '-h') {
        io.stdout(
          'Usage: propose-tokens <site-styles.json> [--out proposal.json] [--report proposal.md] [--assign brand=#hex,primary=#hex,cta=#hex] [--layout content=<px>,wide=<px>]\n'
        );
        return 0;
      } else if (arg === '--out') {
        out = next();
      } else if (arg === '--report') {
        report = next();
      } else if (arg === '--assign') {
        for (const part of next().split(',')) {
          const [family, hex] = part.split('=');
          if (!CHROMATIC_FAMILIES.includes(family as Family) || !hex) {
            throw new Error(`--assign takes brand, primary or cta, for example brand=#8d621f.`);
          }
          assign[family as Family] = hex;
        }
      } else if (arg === '--layout') {
        for (const part of next().split(',')) {
          const [key, value] = part.split('=');
          const px = Number(value);
          if (!['content', 'wide'].includes(key) || !Number.isFinite(px) || px <= 0) {
            throw new Error(
              '--layout takes content and wide in px, for example content=768,wide=1240.'
            );
          }
          layout[key as 'content' | 'wide'] = Math.round(px);
        }
      } else if (arg.startsWith('--')) {
        throw new Error(`Unknown option ${arg}.`);
      } else {
        input = arg;
      }
    }
    if (!input) {
      throw new Error('Pass the path to site-styles.json from crawl-site-styles.');
    }
    const styles = JSON.parse(io.readFile(input)) as SiteStyles;
    if (!Array.isArray(styles.captures) || !styles.captures.length) {
      throw new Error('The styles file has no captures.');
    }
    const proposal = new TokenProposer().propose(styles, { assign, layout });
    io.writeFile(out, `${JSON.stringify(proposal, null, 2)}\n`);
    if (report) {
      io.writeFile(report, new ProposalReport().render(proposal));
    }
    io.stdout(
      `Wrote ${out}${report ? ` and ${report}` : ''}. ${proposal.decisions.length} decisions need review.\n`
    );
    return 0;
  } catch (error) {
    io.stderr(`propose-tokens: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runProposeCli(process.argv.slice(2), {
    readFile: (path) => readFileSync(path, 'utf8'),
    writeFile: (path, content) => writeFileSync(path, content),
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  });
}
