/**
 * Indexes a Figma variables export (the shape figma-to-block-theme reads, and
 * site-to-design-tokens writes) so live values can be bound to variables.
 *
 * Semantic tokens win over primitives. A value that only matches a primitive
 * is returned with `semantic: false`, so the report can list it for review.
 */

import { Colour, Rgba } from './color';

export interface ExportVariable {
  id: string;
  name: string;
  type: string;
  codeSyntax?: { WEB?: string };
  valuesByMode: Record<string, unknown>;
}

export interface ExportCollection {
  name: string;
  modes: { id: string; name: string }[];
  variables: ExportVariable[];
}

export interface ExportEffect {
  type: string;
  color?: Partial<Rgba>;
  offset?: { x: number; y: number };
  radius?: number;
  spread?: number;
}

export interface VariablesExport {
  collections: ExportCollection[];
  effectStyles?: { name: string; description?: string; effects: ExportEffect[] }[];
}

export type ColourRole = 'text' | 'fill' | 'stroke';
export type SizeFamily = 'spacing' | 'radius' | 'font-size';

export interface TokenMatch {
  variable: string;
  collection: string;
  codeSyntax?: string;
  match: 'exact' | 'near';
  semantic: boolean;
}

interface Entry<T> {
  variable: ExportVariable;
  collection: string;
  value: T;
  semantic: boolean;
}

const ROLE_PREFIX: Record<ColourRole, RegExp> = {
  text: /^text\//i,
  fill: /^surface\//i,
  stroke: /^border\//i,
};
const ACTION_PREFIX: Record<ColourRole, RegExp> = {
  text: /^action\/[^/]+\/text$/i,
  fill: /^action\/[^/]+\/background$/i,
  stroke: /^border\/focus/i,
};

export class TokenIndex {
  private readonly colours: Entry<Rgba>[] = [];
  private readonly sizes: Record<SizeFamily, Entry<number>[]> = {
    spacing: [],
    radius: [],
    'font-size': [],
  };
  private readonly fonts: Entry<string>[] = [];
  private readonly shadows: { name: string; effect: ExportEffect }[] = [];

  /**
   * @param exclude Collections to ignore, by name. Prototype-only collections are skipped by default.
   */
  constructor(data: VariablesExport = { collections: [] }, exclude: RegExp = /^proto(type)?\b/i) {
    const byId = new Map<string, { variable: ExportVariable; collection: ExportCollection }>();
    for (const collection of data.collections) {
      for (const variable of collection.variables) {
        byId.set(variable.id, { variable, collection });
      }
    }
    const resolve = (
      variable: ExportVariable,
      collection: ExportCollection,
      depth = 0
    ): unknown => {
      const mode = collection.modes.find((m) => /^max$/i.test(m.name)) ?? collection.modes[0];
      const value = mode ? variable.valuesByMode[mode.id] : Object.values(variable.valuesByMode)[0];
      if (
        value &&
        typeof value === 'object' &&
        (value as { type?: string }).type === 'VARIABLE_ALIAS'
      ) {
        const target = byId.get((value as { id: string }).id);
        return target && depth < 10
          ? resolve(target.variable, target.collection, depth + 1)
          : undefined;
      }
      return value;
    };

    for (const collection of data.collections) {
      if (!collection.modes.length || exclude.test(collection.name)) {
        continue; // Library alias holders and prototype collections are not bound to.
      }
      for (const variable of collection.variables) {
        const value = resolve(variable, collection);
        // Only colours have a primitive and a semantic tier.
        const semantic = variable.type !== 'COLOR' || /semantic/i.test(collection.name);
        const entry = { variable, collection: collection.name, semantic };
        if (variable.type === 'COLOR') {
          const rgba = Colour.fromFigma(value);
          if (rgba) {
            this.colours.push({ ...entry, value: rgba });
          }
        } else if (variable.type === 'FLOAT' && typeof value === 'number') {
          const family = TokenIndex.familyOf(collection.name, variable.name);
          if (family) {
            this.sizes[family].push({ ...entry, value });
          }
        } else if (
          variable.type === 'STRING' &&
          typeof value === 'string' &&
          /famil/i.test(variable.name)
        ) {
          this.fonts.push({ ...entry, value });
        }
      }
    }
    for (const style of data.effectStyles ?? []) {
      const effect = style.effects.find((e) => e.type === 'DROP_SHADOW');
      if (effect) {
        this.shadows.push({ name: style.name, effect });
      }
    }
  }

  static familyOf(collection: string, name: string): SizeFamily | undefined {
    // Spacing collections, and component spacing kept elsewhere (Spacing/Button/Medium/Gap).
    if (/spacing/i.test(collection) || /(^|\/)(spacing|padding|gap)(\/|$)/i.test(name)) {
      return 'spacing';
    }
    if (/radius/i.test(collection)) {
      return 'radius';
    }
    if (/typograph/i.test(collection) && /^sizes?\//i.test(name)) {
      return 'font-size';
    }
    return undefined;
  }

  get size(): number {
    return (
      this.colours.length +
      Object.values(this.sizes).reduce((n, list) => n + list.length, 0) +
      this.fonts.length
    );
  }

  /**
   * @param action Prefer action tokens (buttons), otherwise text, surface and border tokens come first.
   */
  colour(value: string | undefined, role: ColourRole, action = false): TokenMatch | undefined {
    const rgba = Colour.parse(value);
    if (!rgba) {
      return undefined;
    }
    const fit = (name: string) => {
      const plain = ROLE_PREFIX[role].test(name);
      const act = ACTION_PREFIX[role].test(name);
      return action ? (act ? 2 : plain ? 1 : 0) : plain ? 2 : act ? 1 : 0;
    };
    const ranked = this.colours
      .map((entry) => ({ entry, distance: Colour.distance(rgba, entry.value) }))
      .filter((c) => c.distance <= 12)
      .sort(
        (a, b) =>
          Number(b.entry.semantic) - Number(a.entry.semantic) ||
          Math.round(a.distance / 3) - Math.round(b.distance / 3) ||
          fit(b.entry.variable.name) - fit(a.entry.variable.name) ||
          a.distance - b.distance
      );
    const best = ranked[0];
    return best ? this.matchOf(best.entry, best.distance <= 2) : undefined;
  }

  length(px: number | undefined, family: SizeFamily): TokenMatch | undefined {
    if (px === undefined || px <= 0) {
      return undefined;
    }
    const best = this.sizes[family]
      .map((entry) => ({ entry, distance: Math.abs(entry.value - px) }))
      .sort((a, b) => a.distance - b.distance)[0];
    if (!best || best.distance > Math.max(2, px * 0.08)) {
      return undefined;
    }
    return this.matchOf(best.entry, best.distance <= 0.5);
  }

  /** The variables either side of a size with no match, for proposing a new ramp step. */
  neighbours(px: number, family: SizeFamily): { below?: string; above?: string } {
    const sorted = [...this.sizes[family]].sort((a, b) => a.value - b.value);
    return {
      below: [...sorted].reverse().find((e) => e.value < px)?.variable.name,
      above: sorted.find((e) => e.value > px)?.variable.name,
    };
  }

  font(family: string | undefined): TokenMatch | undefined {
    if (!family) {
      return undefined;
    }
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const target = norm(family);
    const entry =
      this.fonts.find((f) => norm(f.value) === target) ??
      this.fonts.find((f) => target.includes(norm(f.value)) || norm(f.value).includes(target));
    return entry ? this.matchOf(entry, norm(entry.value) === target) : undefined;
  }

  /** Matches the first layer of a CSS box-shadow to a drop shadow effect style. */
  shadow(css: string | undefined): TokenMatch | undefined {
    const parsed = TokenIndex.parseShadow(css);
    if (!parsed) {
      return undefined;
    }
    const near = (a = 0, b = 0) => Math.abs(a - b) <= 1;
    const found = this.shadows.find(
      ({ effect }) =>
        near(effect.offset?.x, parsed.x) &&
        near(effect.offset?.y, parsed.y) &&
        near(effect.radius, parsed.blur) &&
        near(effect.spread, parsed.spread)
    );
    return found
      ? { variable: found.name, collection: 'Effect styles', match: 'exact', semantic: true }
      : undefined;
  }

  static parseShadow(
    css: string | undefined
  ): { x: number; y: number; blur: number; spread: number } | null {
    if (!css || css === 'none') {
      return null;
    }
    const first = css.split(/,(?![^(]*\))/)[0];
    const lengths = first
      .replace(/rgba?\([^)]*\)|#[0-9a-f]+|inset/gi, ' ')
      .trim()
      .split(/\s+/)
      .map((n) => parseFloat(n))
      .filter((n) => Number.isFinite(n));
    if (lengths.length < 2) {
      return null;
    }
    const [x, y, blur = 0, spread = 0] = lengths;
    return { x, y, blur, spread };
  }

  private matchOf<T>(entry: Entry<T>, exact: boolean): TokenMatch {
    return {
      variable: entry.variable.name,
      collection: entry.collection,
      codeSyntax: entry.variable.codeSyntax?.WEB,
      match: exact ? 'exact' : 'near',
      semantic: entry.semantic,
    };
  }
}
