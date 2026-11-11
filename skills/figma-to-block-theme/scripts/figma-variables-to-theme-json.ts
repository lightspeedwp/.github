/**
 * Maps a Figma variables export to theme.json preset fragments.
 *
 * The export comes from the use_figma script in
 * references/figma-access.md. Slugs come only from each variable's WEB code
 * syntax (for example `var(--wp--preset--color--brand-500)`); variables
 * without one are reported, never guessed.
 *
 * The script prints fragments and a report. It does not edit theme.json: the
 * agent merges the fragments so unrelated settings are preserved.
 *
 * Usage:
 *   npx tsx figma-variables-to-theme-json.ts export.json
 *   npx tsx figma-variables-to-theme-json.ts export.json --out mapped.json \
 *     --base-mode Light --min-mode Mobile --max-mode Desktop
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { FluidClamp, FluidClampOptions } from './fluid-clamp';

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface VariableAlias {
  type: 'VARIABLE_ALIAS';
  id: string;
}

export type VariableValue = Rgba | number | string | boolean | VariableAlias;

export interface ExportedVariable {
  id: string;
  name: string;
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  codeSyntax?: { WEB?: string };
  /** A font family variable may carry its exact stack as `CSS stack: <stack>`. */
  description?: string;
  valuesByMode: Record<string, VariableValue>;
}

export interface ExportedCollection {
  name: string;
  modes: Array<{ id: string; name: string }>;
  variables: ExportedVariable[];
}

export interface ExportedEffect {
  type: string;
  visible?: boolean;
  color?: Rgba;
  offset?: { x: number; y: number };
  radius?: number;
  spread?: number;
}

export interface ExportedEffectStyle {
  name: string;
  description?: string;
  effects: ExportedEffect[];
}

export interface VariablesExport {
  collections: ExportedCollection[];
  effectStyles?: ExportedEffectStyle[];
}

export interface MapperOptions extends FluidClampOptions {
  /** Mode used for theme.json. Defaults to each collection's first mode. */
  baseMode?: string;
  /** Mode holding mobile (minimum) values for fluid sizes. */
  minMode?: string;
  /** Mode holding desktop (maximum) values for fluid sizes. */
  maxMode?: string;
  /** Fallback appended to font family stacks. */
  fontFallback?: string;
}

type JsonObject = Record<string, unknown>;

export interface MappingResult {
  theme: { settings: JsonObject };
  variations: Record<string, { title: string; settings: JsonObject }>;
  report: { counts: Record<string, number>; warnings: string[] };
}

interface PresetTarget {
  kind: 'preset';
  family: string;
  slug: string;
}

interface CustomTarget {
  kind: 'custom';
  path: string[];
}

/** Content and wide width, which belong in `settings.layout`. */
interface LayoutTarget {
  kind: 'layout';
  key: 'contentSize' | 'wideSize';
}

type Target = PresetTarget | CustomTarget | LayoutTarget;

/** Keys that would reach Object.prototype if written as plain properties. */
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const PRESET_PATTERN =
  /--wp--preset--(color|spacing|font-size|font-family|border-radius|shadow)--([a-z0-9-]+)/;
const CUSTOM_PATTERN = /--wp--custom--([a-z0-9-]+(?:--[a-z0-9-]+)*)/;
/** `site-to-design-tokens` writes the custom form; core's own variables are the style form. */
const LAYOUT_PATTERN = /--wp--(?:custom--layout|style--global)--(content|wide)-size(?![a-z0-9-])/;
/** CSS generic font families, which name no font of their own. */
const GENERIC_FAMILIES = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'math',
  'emoji',
  'fangsong',
]);
const MIN_MODE_PATTERN = /^(mobile|min|small|sm)$/i;
const MAX_MODE_PATTERN = /^(desktop|max|large|lg)$/i;

/** Colour conversion helpers. Figma colours are 0-1 floats. */
export class ColorConverter {
  static toHex(color: Rgba): string {
    const channel = (value: number) =>
      Math.round(Math.min(Math.max(value, 0), 1) * 255)
        .toString(16)
        .padStart(2, '0');
    const alpha = color.a ?? 1;
    const hex = `#${channel(color.r)}${channel(color.g)}${channel(color.b)}`;
    return alpha < 1 ? `${hex}${channel(alpha)}` : hex;
  }

  static toRgba(color: Rgba): string {
    const channel = (value: number) => Math.round(value * 255);
    const alpha = Math.round((color.a ?? 1) * 1000) / 1000;
    return `rgba(${channel(color.r)}, ${channel(color.g)}, ${channel(color.b)}, ${alpha})`;
  }
}

export class FigmaVariablesMapper {
  private readonly fluid: FluidClamp;
  private readonly options: MapperOptions;
  private readonly byId = new Map<string, ExportedVariable>();
  private warnings: string[] = [];
  /** Variation keys that come from colour modes. */
  private readonly colourModes = new Set<string>();
  /** `settings.layout` widths found while mapping. */
  private layout: JsonObject = {};

  constructor(options: MapperOptions = {}) {
    this.options = options;
    this.fluid = new FluidClamp(options);
  }

  map(data: VariablesExport): MappingResult {
    this.warnings = [];
    this.layout = {};
    this.colourModes.clear();
    this.byId.clear();
    for (const collection of data.collections) {
      for (const variable of collection.variables) {
        this.byId.set(variable.id, variable);
      }
    }

    const settings: JsonObject = {};
    const variations: MappingResult['variations'] = {};
    const counts: Record<string, number> = {};
    const presets: Record<string, JsonObject[]> = {};
    const custom: JsonObject = {};

    for (const collection of data.collections) {
      this.mapCollection(collection, presets, custom, variations);
    }

    // A colour mode keeps the theme's palette and only replaces the semantic tokens.
    for (const key of this.colourModes) {
      const variation = variations[key];
      variation.settings = {
        color: { palette: presets.color ?? [] },
        ...variation.settings,
      };
    }

    // Sizing ramps read smallest first in Figma, so theme.json lists them in order too.
    for (const family of ['spacing', 'font-size']) {
      const slugs = (presets[family] ?? []).map((entry) => Number(entry.slug));
      if (slugs.some((slug, i) => i > 0 && slug < slugs[i - 1])) {
        this.warn(
          `The ${family} ramp is out of order in Figma (${slugs.join(', ')}). Order it smallest first.`
        );
      }
    }

    const shadows = this.mapShadows(data.effectStyles ?? []);
    if (shadows.length) {
      presets.shadow = shadows;
    }

    this.assign(settings, ['color', 'palette'], presets.color);
    if (presets.spacing) {
      // Core's default sizes use slugs 20 to 80 and win over theme sizes with the same slugs.
      this.assign(settings, ['spacing', 'defaultSpacingSizes'], false);
      this.assign(settings, ['spacing', 'spacingSizes'], presets.spacing);
    }
    this.assign(settings, ['typography', 'fontSizes'], presets['font-size']);
    this.assign(settings, ['typography', 'fontFamilies'], presets['font-family']);
    if (presets['border-radius']) {
      this.assign(settings, ['border', 'radius'], true);
      this.assign(settings, ['border', 'radiusSizes'], presets['border-radius']);
    }
    if (presets.shadow) {
      this.assign(settings, ['shadow', 'defaultPresets'], false);
      this.assign(settings, ['shadow', 'presets'], presets.shadow);
    }
    if (Object.keys(this.layout).length) {
      settings.layout = this.layout;
    }
    if (Object.keys(custom).length) {
      settings.custom = custom;
    }

    for (const [family, entries] of Object.entries(presets)) {
      counts[family] = entries.length;
    }
    counts.layout = Object.keys(this.layout).length;
    counts.custom = this.countLeaves(custom);
    counts.variations = Object.keys(variations).length;

    return {
      theme: { settings },
      variations,
      report: { counts, warnings: this.warnings },
    };
  }

  private mapCollection(
    collection: ExportedCollection,
    presets: Record<string, JsonObject[]>,
    custom: JsonObject,
    variations: MappingResult['variations']
  ): void {
    if (!collection.modes.length) {
      this.warn(`Collection "${collection.name}" has no modes; skipped.`);
      return;
    }

    const minMode = this.findMode(collection, this.options.minMode, MIN_MODE_PATTERN);
    const maxMode = this.findMode(collection, this.options.maxMode, MAX_MODE_PATTERN);
    const isFluid = Boolean(minMode && maxMode && minMode !== maxMode);
    const baseMode =
      this.findMode(collection, this.options.baseMode) ??
      (isFluid ? maxMode : undefined) ??
      collection.modes[0];
    const variationModes = isFluid
      ? []
      : collection.modes.filter((mode) => mode.id !== baseMode.id);

    for (const variable of collection.variables) {
      const target = this.parseTarget(variable);
      if (!target) {
        continue;
      }

      if (target.kind === 'layout') {
        this.mapLayout(variable, target, baseMode.id);
        continue;
      }

      if (target.kind === 'custom') {
        this.assign(custom, target.path, this.customValue(variable, baseMode.id, target.path));
        if (target.path[0] === 'color') {
          for (const mode of variationModes) {
            const variation = this.variation(variations, mode.name);
            this.colourModes.add(this.slugify(mode.name));
            this.assign(
              variation.settings,
              ['custom', ...target.path],
              this.customValue(variable, mode.id, target.path)
            );
          }
        }
        continue;
      }

      const entry = this.presetEntry(
        variable,
        target,
        baseMode.id,
        isFluid ? { min: minMode!.id, max: maxMode!.id } : undefined
      );
      if (!entry) {
        continue;
      }
      (presets[target.family] ??= []).push(entry);

      if (target.family === 'color') {
        for (const mode of variationModes) {
          const modeEntry = this.presetEntry(variable, target, mode.id);
          if (modeEntry && modeEntry.color !== entry.color) {
            this.warn(
              `"${variable.name}" changes in mode "${mode.name}". Colour modes keep one palette; set the ${mode.name} value on the semantic tokens instead.`
            );
          }
        }
      } else if (target.family === 'font-family') {
        for (const mode of variationModes) {
          const modeEntry = this.presetEntry(variable, target, mode.id);
          if (modeEntry) {
            this.addVariationEntry(variations, mode.name, target.family, modeEntry);
          }
        }
      } else if (variationModes.length) {
        this.warn(
          `"${variable.name}" has ${collection.modes.length} modes but only "${baseMode.name}" is used for ${target.family}.`
        );
      }
    }
  }

  private presetEntry(
    variable: ExportedVariable,
    target: PresetTarget,
    modeId: string,
    fluidModes?: { min: string; max: string }
  ): JsonObject | undefined {
    const value = this.resolve(variable, modeId);
    const name = this.lastSegment(variable.name);

    switch (target.family) {
      case 'color':
        if (!this.isColor(value)) {
          return this.typeMismatch(variable, 'COLOR');
        }
        return {
          slug: target.slug,
          name: this.titleCase(target.slug),
          color: ColorConverter.toHex(value),
        };
      case 'spacing': {
        const sizes = this.fluidPair(variable, modeId, fluidModes);
        if (!sizes) {
          return this.typeMismatch(variable, 'FLOAT');
        }
        // The slug belongs in the code syntax, not the name: "10 XS" becomes "XS".
        const prefix = `${target.slug} `;
        if (name.startsWith(prefix)) {
          this.warn(
            `"${variable.name}" repeats its slug in the name; rename it to "${name.slice(prefix.length)}" in Figma.`
          );
        }
        return {
          slug: target.slug,
          name: name.startsWith(prefix) ? name.slice(prefix.length) : name,
          size: this.fluid.clamp(sizes.min, sizes.max),
        };
      }
      case 'font-size': {
        const sizes = this.fluidPair(variable, modeId, fluidModes);
        if (!sizes) {
          return this.typeMismatch(variable, 'FLOAT');
        }
        const entry: JsonObject = {
          slug: target.slug,
          name: this.sizeName(name),
          size: this.fluid.toRem(sizes.max),
        };
        if (sizes.min !== sizes.max) {
          entry.fluid = {
            min: this.fluid.toRem(sizes.min),
            max: this.fluid.toRem(sizes.max),
          };
        }
        return entry;
      }
      case 'font-family':
        if (typeof value !== 'string') {
          return this.typeMismatch(variable, 'STRING');
        }
        return {
          slug: target.slug,
          name: value,
          fontFamily: this.declaredStack(variable, value) ?? this.fontStack(value, target.slug),
        };
      case 'border-radius':
        if (typeof value !== 'number') {
          return this.typeMismatch(variable, 'FLOAT');
        }
        return {
          slug: target.slug,
          // The collection is Radius, so names are bare sizes. Old files wrote "Radius Small".
          name: this.sizeName(name.replace(/^Radius\s+/i, '') || name),
          size: value === 0 ? '0' : `${value}px`,
        };
      default:
        this.warn(
          `"${variable.name}" targets ${target.family} presets, which come from effect styles, not variables; skipped.`
        );
        return undefined;
    }
  }

  /** Content and wide width go to `settings.layout` as CSS lengths. */
  private mapLayout(variable: ExportedVariable, target: LayoutTarget, modeId: string): void {
    const value = this.resolve(variable, modeId);
    if (typeof value === 'number') {
      this.layout[target.key] = this.px(value);
    } else if (typeof value === 'string' && value.trim()) {
      // A string such as "48rem" already has its unit; a bare number gets px.
      this.layout[target.key] = /^\d+(\.\d+)?$/.test(value.trim()) ? `${value.trim()}px` : value;
    } else {
      this.typeMismatch(variable, 'FLOAT');
    }
  }

  private customValue(variable: ExportedVariable, modeId: string, path: string[]): unknown {
    const raw = variable.valuesByMode[modeId];

    if (this.isAlias(raw)) {
      const target = this.byId.get(raw.id);
      const presetTarget = target && this.parseTarget(target, false);
      if (presetTarget && presetTarget.kind === 'preset') {
        return `var(--wp--preset--${presetTarget.family}--${presetTarget.slug})`;
      }
      if (presetTarget && presetTarget.kind === 'custom') {
        return `var(--wp--custom--${presetTarget.path.join('--')})`;
      }
      if (presetTarget && presetTarget.kind === 'layout') {
        const width = presetTarget.key === 'contentSize' ? 'content' : 'wide';
        return `var(--wp--style--global--${width}-size)`;
      }
    }

    const value = this.resolve(variable, modeId);
    if (this.isColor(value)) {
      // Translucent tokens (overlays, shadow colours) can't alias an opaque palette colour.
      if (path[0] === 'color' && (value.a ?? 1) >= 1) {
        this.warn(
          `Custom colour "${variable.name}" is a raw value, not an alias to a palette colour.`
        );
      }
      return ColorConverter.toHex(value);
    }
    // Custom spacing and breakpoints are CSS lengths, so they need a unit.
    if (typeof value === 'number' && path[0] === 'spacing') {
      return this.fluid.toRem(value);
    }
    if (typeof value === 'number' && path[0] === 'breakpoint') {
      return this.px(value);
    }
    if (typeof value === 'number' && path[0] === 'line-height' && value > 10) {
      // Figma line heights are often percentages (150 = 1.5).
      return String(value / 100);
    }
    return typeof value === 'number' ? String(value) : value;
  }

  private mapShadows(styles: ExportedEffectStyle[]): JsonObject[] {
    const presets: JsonObject[] = [];

    for (const style of styles) {
      const shadows = style.effects
        .filter(
          (effect) =>
            effect.visible !== false &&
            (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW')
        )
        .map((effect) => {
          const offset = effect.offset ?? { x: 0, y: 0 };
          const parts = [
            effect.type === 'INNER_SHADOW' ? 'inset' : '',
            this.px(offset.x),
            this.px(offset.y),
            this.px(effect.radius ?? 0),
            this.px(effect.spread ?? 0),
            ColorConverter.toRgba(effect.color ?? { r: 0, g: 0, b: 0, a: 1 }),
          ];
          return parts.filter(Boolean).join(' ');
        });

      if (!shadows.length) {
        this.warn(`Effect style "${style.name}" has no visible shadows; skipped.`);
        continue;
      }

      const syntax = style.description?.match(/--wp--preset--shadow--([a-z0-9-]+)/);
      const name = this.lastSegment(style.name);
      if (!syntax) {
        this.warn(
          `Effect style "${style.name}" has no --wp--preset--shadow-- slug in its description; slug taken from its name.`
        );
      }
      presets.push({
        slug: syntax ? syntax[1] : this.slugify(name),
        name: this.sizeName(name),
        shadow: shadows.join(', '),
      });
    }

    return presets;
  }

  private parseTarget(variable: ExportedVariable, report = true): Target | undefined {
    const syntax = variable.codeSyntax?.WEB;
    const preset = syntax?.match(PRESET_PATTERN);
    if (preset) {
      return { kind: 'preset', family: preset[1], slug: preset[2] };
    }
    const layout = syntax?.match(LAYOUT_PATTERN);
    if (layout) {
      return { kind: 'layout', key: layout[1] === 'content' ? 'contentSize' : 'wideSize' };
    }
    const customMatch = syntax?.match(CUSTOM_PATTERN);
    if (customMatch) {
      return { kind: 'custom', path: customMatch[1].split('--') };
    }
    // A zero size with no code syntax, such as Padding/None, is for Figma only:
    // WordPress already offers a 0 value, so importing one adds a duplicate.
    const figmaOnlyZero =
      !syntax && Object.values(variable.valuesByMode).every((value) => value === 0);
    if (report && !figmaOnlyZero) {
      this.warn(
        syntax
          ? `"${variable.name}" has code syntax "${syntax}" that is not a WordPress preset or custom property; skipped.`
          : `"${variable.name}" has no WEB code syntax; skipped. Add one in Figma rather than guessing a slug.`
      );
    }
    return undefined;
  }

  /** Follows alias chains to a final value. */
  private resolve(variable: ExportedVariable, modeId: string): VariableValue | undefined {
    let value: VariableValue | undefined = variable.valuesByMode[modeId];
    const seen = new Set<string>([variable.id]);

    while (this.isAlias(value)) {
      const target = this.byId.get(value.id);
      if (!target) {
        this.warn(
          `"${variable.name}" aliases a variable that is not in the export (${value.id}), probably from a library. Export that library too.`
        );
        return undefined;
      }
      if (seen.has(target.id)) {
        this.warn(`"${variable.name}" has a circular alias; skipped.`);
        return undefined;
      }
      seen.add(target.id);
      value = target.valuesByMode[modeId] ?? Object.values(target.valuesByMode)[0];
    }

    return value;
  }

  private fluidPair(
    variable: ExportedVariable,
    modeId: string,
    fluidModes?: { min: string; max: string }
  ): { min: number; max: number } | undefined {
    const min = this.resolve(variable, fluidModes?.min ?? modeId);
    const max = this.resolve(variable, fluidModes?.max ?? modeId);
    return typeof min === 'number' && typeof max === 'number' ? { min, max } : undefined;
  }

  private findMode(
    collection: ExportedCollection,
    name?: string,
    pattern?: RegExp
  ): { id: string; name: string } | undefined {
    if (name) {
      const wanted = name.toLowerCase();
      const named = collection.modes.find((mode) => mode.name.toLowerCase() === wanted);
      if (named) {
        return named;
      }
    }
    return pattern ? collection.modes.find((mode) => pattern.test(mode.name.trim())) : undefined;
  }

  private addVariationEntry(
    variations: MappingResult['variations'],
    modeName: string,
    family: string,
    entry: JsonObject
  ): void {
    const variation = this.variation(variations, modeName);
    const path = family === 'color' ? ['color', 'palette'] : ['typography', 'fontFamilies'];
    const existing = this.get(variation.settings, path) as JsonObject[] | undefined;
    this.assign(variation.settings, path, [...(existing ?? []), entry]);
  }

  private variation(
    variations: MappingResult['variations'],
    modeName: string
  ): MappingResult['variations'][string] {
    return (variations[this.slugify(modeName)] ??= { title: modeName, settings: {} });
  }

  /**
   * The exact CSS stack from a `CSS stack: ...` line in the variable description, used
   * only when its first family is the font the mode's value names (other modes differ).
   */
  /**
   * Uses the fallbacks from a "CSS stack: …" description. The declared stack starts
   * with the live site's own `@font-face` name (such as `argesta_displayregular`),
   * which the new theme's `fontFace` entries won't declare, so the clean family name
   * replaces it.
   */
  private declaredStack(variable: ExportedVariable, name: string): string | undefined {
    const stack = variable.description?.match(/CSS stack:\s*(.+)$/m)?.[1].trim();
    if (!stack) {
      return undefined;
    }
    // A generic name such as "Monospace" has no font of its own: the declared system stack is the font.
    if (GENERIC_FAMILIES.has(name.trim().toLowerCase())) {
      return stack;
    }
    const [first, ...fallbacks] = stack.split(',').map((part) => part.trim());
    const plain = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
    const face = plain(first);
    const wanted = plain(name);
    if (!face.startsWith(wanted) && !wanted.startsWith(face)) {
      return undefined;
    }
    return [this.quoteFamily(name), ...fallbacks.filter(Boolean)].join(', ');
  }

  /** A stack with no declaration: the family, then the generic family for its role. */
  private fontStack(family: string, slug: string): string {
    const generic = family.trim().toLowerCase();
    if (GENERIC_FAMILIES.has(generic)) {
      return generic;
    }
    const fallback =
      slug === 'monospace' ? 'monospace' : (this.options.fontFallback ?? 'sans-serif');
    return `${this.quoteFamily(family)}, ${fallback}`;
  }

  private quoteFamily(family: string): string {
    return /\s/.test(family) ? `"${family}"` : family;
  }

  private typeMismatch(variable: ExportedVariable, expected: string): undefined {
    this.warn(
      `"${variable.name}" is ${variable.type} or unresolved, but ${expected} was expected; skipped.`
    );
    return undefined;
  }

  private isAlias(value: unknown): value is VariableAlias {
    return (
      typeof value === 'object' &&
      value !== null &&
      (value as VariableAlias).type === 'VARIABLE_ALIAS'
    );
  }

  private isColor(value: unknown): value is Rgba {
    return typeof value === 'object' && value !== null && 'r' in value && 'g' in value;
  }

  private assign(target: JsonObject, path: string[], value: unknown): void {
    if (value === undefined) {
      return;
    }
    const where = path.join('--');
    if (path.some((key) => UNSAFE_KEYS.has(key))) {
      this.warn(`"${where}" uses a reserved key; skipped.`);
      return;
    }
    let node = target;
    for (const key of path.slice(0, -1)) {
      if (!Object.hasOwn(node, key)) {
        node[key] = {};
      }
      const next = node[key];
      if (!this.isObject(next)) {
        this.warn(`"${where}" clashes with the value already at "${key}"; skipped.`);
        return;
      }
      node = next;
    }
    const leaf = path[path.length - 1];
    if (this.isObject(node[leaf]) && !this.isObject(value)) {
      this.warn(`"${where}" would replace a group of tokens; skipped.`);
      return;
    }
    node[leaf] = value;
  }

  private isObject(value: unknown): value is JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private get(target: JsonObject, path: string[]): unknown {
    return path.reduce<unknown>((node, key) => (node as JsonObject | undefined)?.[key], target);
  }

  private countLeaves(node: unknown): number {
    if (typeof node !== 'object' || node === null) {
      return 1;
    }
    return Object.values(node).reduce<number>((total, child) => total + this.countLeaves(child), 0);
  }

  private lastSegment(name: string): string {
    return name.split('/').pop()!.trim();
  }

  /** Both spellings of the extra sizes map to one: xLarge, x-large and X-Large become X-Large. */
  private sizeName(name: string): string {
    return name.replace(
      /^x[\s-]?(small|large)$/i,
      (_m, size: string) => `X-${size[0].toUpperCase()}${size.slice(1).toLowerCase()}`
    );
  }

  private titleCase(slug: string): string {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private px(value: number): string {
    return value === 0 ? '0' : `${value}px`;
  }

  private warn(message: string): void {
    if (!this.warnings.includes(message)) {
      this.warnings.push(message);
    }
  }
}

export interface MapperCliIo {
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

/** Parses CLI arguments, runs the mapper and returns the exit code. */
export function runMapperCli(argv: string[], io: MapperCliIo): number {
  const options: MapperOptions = {};
  let input: string | undefined;
  let out: string | undefined;

  const flags: Record<string, (value: string) => void> = {
    '--out': (value) => (out = value),
    '--base-mode': (value) => (options.baseMode = value),
    '--min-mode': (value) => (options.minMode = value),
    '--max-mode': (value) => (options.maxMode = value),
    '--font-fallback': (value) => (options.fontFallback = value),
    '--min-viewport': (value) => (options.minViewport = Number(value)),
    '--max-viewport': (value) => (options.maxViewport = Number(value)),
  };

  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      if (arg === '--help' || arg === '-h') {
        io.stdout(
          'Usage: figma-variables-to-theme-json <export.json> [--out mapped.json] [--base-mode Light] [--min-mode Mobile] [--max-mode Desktop] [--font-fallback sans-serif] [--min-viewport 390] [--max-viewport 1440]\n'
        );
        return 0;
      }
      if (flags[arg]) {
        const value = argv[++i];
        if (value === undefined) {
          throw new Error(`${arg} needs a value.`);
        }
        flags[arg](value);
      } else if (arg.startsWith('--')) {
        throw new Error(`Unknown option ${arg}.`);
      } else {
        input = arg;
      }
    }

    if (!input) {
      throw new Error('Pass the path to a Figma variables export.');
    }

    const data = JSON.parse(io.readFile(input)) as VariablesExport;
    if (!Array.isArray(data.collections)) {
      throw new Error('The export has no "collections" array.');
    }

    const result = new FigmaVariablesMapper(options).map(data);
    const json = `${JSON.stringify(result, null, '\t')}\n`;

    if (out) {
      io.writeFile(out, json);
      io.stdout(`Wrote ${out}\n`);
    } else {
      io.stdout(json);
    }
    for (const warning of result.report.warnings) {
      io.stderr(`warning: ${warning}\n`);
    }
    return 0;
  } catch (error) {
    io.stderr(`figma-variables-to-theme-json: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runMapperCli(process.argv.slice(2), {
    readFile: (path) => readFileSync(path, 'utf8'),
    writeFile: (path, content) => writeFileSync(path, content),
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  });
}
