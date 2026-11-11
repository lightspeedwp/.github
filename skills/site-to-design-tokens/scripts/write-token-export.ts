/**
 * Turns an approved token proposal into:
 * - a variables export JSON in the figma-to-block-theme shape, so its mapper
 *   can produce theme.json presets without Figma, and
 * - a use_figma script that creates the collections, variables, code syntax
 *   and effect styles in the TSP structure.
 *
 * Usage:
 *   npx tsx write-token-export.ts proposal.json --export variables.json --figma-script create-variables.js
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { Color, RAMP_STEPS } from './lib/color';
import type { Family, FontRoleSlug, Proposal, ScaleEntry } from './propose-tokens';

type Value = { r: number; g: number; b: number; a: number } | number | string | { alias: string };

export interface PlannedVariable {
  key: string;
  name: string;
  type: 'COLOR' | 'FLOAT' | 'STRING';
  /** Absent for Figma-only variables, which the theme does not import. */
  codeSyntax?: string;
  scopes: string[];
  values: Record<string, Value>;
  description?: string;
}

export interface PlannedCollection {
  name: string;
  modes: string[];
  variables: PlannedVariable[];
}

export interface PlannedEffectStyle {
  name: string;
  description: string;
  effects: Proposal['shadows'][number]['effects'];
}

export interface TokenPlan {
  collections: PlannedCollection[];
  effectStyles: PlannedEffectStyle[];
}

const FILL = ['FRAME_FILL', 'SHAPE_FILL'];

export class TokenPlanBuilder {
  /**
   * A hand-edited proposal can alias a token that does not exist (a typo such as
   * `brand-650`), a token of another type, or itself. Catch that while planning,
   * before any script or export is written.
   */
  private assertAliasesResolve(collections: PlannedCollection[]): void {
    const types = new Map(
      collections.flatMap((c) => c.variables.map((v) => [v.key, v.type] as const))
    );
    const unknown: string[] = [];
    for (const variable of collections.flatMap((c) => c.variables)) {
      for (const value of Object.values(variable.values)) {
        if (typeof value === 'object' && value !== null && 'alias' in value) {
          const target = (value as { alias: string }).alias;
          if (!types.has(target)) {
            unknown.push(`${variable.name} -> ${target}`);
          } else if (target === variable.key) {
            unknown.push(`${variable.name} -> ${target} (itself)`);
          } else if (types.get(target) !== variable.type) {
            unknown.push(
              `${variable.name} -> ${target} (${types.get(target)}, not ${variable.type})`
            );
          }
        }
      }
    }
    if (unknown.length) {
      throw new Error(
        `Invalid semantic alias target(s): ${unknown.join(', ')}. Fix proposal.json so each token names another existing variable of the same type.`
      );
    }
  }

  /**
   * Sizing ramps are created smallest first (`None` first for spacing), so the
   * Variables panel reads as a ramp. Order is by Max value, then slug, whatever
   * order the proposal arrives in. Returns a copy.
   */
  ascending(entries: ScaleEntry[]): ScaleEntry[] {
    return [...entries].sort((a, b) => a.max - b.max || a.slug.localeCompare(b.slug));
  }

  build(p: Proposal): TokenPlan {
    const rgba = (hex: string) => {
      const { r, g, b, a } = Color.parse(hex)!.rgb;
      const round = (n: number) => Math.round(n * 10000) / 10000;
      return { r: round(r), g: round(g), b: round(b), a: round(a) };
    };
    const preset = (kind: string, slug: string) => `var(--wp--preset--${kind}--${slug})`;
    const custom = (path: string) => `var(--wp--custom--${path})`;

    const colour: PlannedVariable[] = [
      {
        key: 'base',
        name: 'Theme/base',
        type: 'COLOR',
        codeSyntax: preset('color', 'base'),
        scopes: [],
        values: { Value: rgba(p.colour.primitives.base) },
      },
      {
        key: 'contrast',
        name: 'Theme/contrast',
        type: 'COLOR',
        codeSyntax: preset('color', 'contrast'),
        scopes: [],
        values: { Value: rgba(p.colour.primitives.contrast) },
      },
    ];
    // The LightSpeed palette order: neutral, primary, brand, cta.
    for (const family of ['neutral', 'primary', 'brand', 'cta'] as Family[]) {
      for (const step of RAMP_STEPS) {
        const slug = `${family}-${step}`;
        colour.push({
          key: slug,
          name: `${family}/${step}`,
          type: 'COLOR',
          codeSyntax: preset('color', slug),
          scopes: [],
          values: { Value: rgba(p.colour.primitives[slug]) },
        });
      }
    }
    for (const kind of ['error', 'warning', 'success', 'information']) {
      for (const part of ['foreground', 'background']) {
        const slug = `${kind}-${part}`;
        colour.push({
          key: slug,
          name: `system/${kind}/${part}`,
          type: 'COLOR',
          codeSyntax: preset('color', slug),
          scopes: [],
          values: { Value: rgba(p.colour.primitives[slug]) },
        });
      }
    }
    colour.push({
      key: 'overlay',
      name: 'custom/overlay',
      type: 'COLOR',
      codeSyntax: custom('color--overlay'),
      scopes: FILL,
      values: { Value: rgba(p.colour.overlay) },
    });
    const shadowBase = Color.parse(p.colour.primitives['neutral-900'])!.rgb;
    for (const alpha of p.colour.shadowAlphas) {
      colour.push({
        key: `shadow-${alpha}`,
        name: `shadow/${alpha}`,
        type: 'COLOR',
        codeSyntax: custom(`color--shadow--${alpha}`),
        scopes: ['EFFECT_COLOR'],
        values: { Value: rgba(Color.fromRgb({ ...shadowBase, a: alpha / 100 }).toHex()) },
      });
    }

    const semantic: PlannedVariable[] = Object.entries(p.colour.semantic).map(([role, s]) => ({
      key: `semantic:${role}`,
      name: role,
      type: 'COLOR',
      codeSyntax: custom(`color--${role.replace(/\//g, '--')}`),
      scopes: this.semanticScopes(role),
      values: { Value: { alias: s.token } },
    }));

    const typography: PlannedVariable[] = [...this.fontVariables(p)];
    for (const size of this.ascending(p.typography.sizes)) {
      typography.push({
        key: `size-${size.slug}`,
        name: `Sizes/${size.name}`,
        type: 'FLOAT',
        codeSyntax: preset('font-size', size.slug),
        scopes: ['FONT_SIZE'],
        values: { Max: size.max, Min: size.min },
      });
      if (size.lineHeight) {
        const percent = Math.round(size.lineHeight * 100);
        typography.push({
          key: `line-${size.slug}`,
          name: `Line-Heights/${size.name}`,
          type: 'FLOAT',
          codeSyntax: custom(`line-height--${size.slug}`),
          scopes: [],
          values: { Max: percent, Min: percent },
          description: 'Percent of the font size (150 = 1.5).',
        });
      }
    }
    for (const [role, weight] of Object.entries(p.typography.weights)) {
      typography.push({
        key: `weight-${role}`,
        name: `Weights/${role}`,
        type: 'FLOAT',
        codeSyntax: custom(`font-weight--${role}`),
        scopes: ['FONT_WEIGHT'],
        values: { Max: weight, Min: weight },
      });
    }

    const spacing: PlannedVariable[] = this.ascending(p.spacing).map((s) => ({
      key: `spacing-${s.slug}`,
      name: `Padding/${s.name}`,
      type: 'FLOAT',
      // WordPress already offers a 0 spacing, so None stays in Figma only.
      ...(s.slug === 'none'
        ? { description: 'Figma only. WordPress has its own 0 spacing, so this is not imported.' }
        : { codeSyntax: preset('spacing', s.slug) }),
      scopes: ['GAP'],
      values: { Max: s.max, Min: s.min },
    }));

    const radius: PlannedVariable[] = p.radius.map((r) => ({
      key: `radius-${r.slug}`,
      // The collection is already Radius, so the name is the bare size.
      name: r.name,
      type: 'FLOAT',
      codeSyntax: preset('border-radius', r.slug),
      scopes: ['CORNER_RADIUS'],
      values: { 'Mode 1': r.value },
    }));

    const layout: PlannedVariable[] = [];
    if (p.layout.content) {
      layout.push({
        key: 'layout-content',
        name: 'Desktop/Desktop Content Width',
        type: 'FLOAT',
        codeSyntax: custom('layout--content-size'),
        scopes: ['WIDTH_HEIGHT'],
        values: { 'Mode 1': p.layout.content },
      });
    }
    if (p.layout.wide) {
      layout.push({
        key: 'layout-wide',
        name: 'Desktop/Desktop Wide Width',
        type: 'FLOAT',
        codeSyntax: custom('layout--wide-size'),
        scopes: ['WIDTH_HEIGHT'],
        values: { 'Mode 1': p.layout.wide },
      });
    }

    const breakpoints: PlannedVariable[] = (['desktop', 'tablet', 'mobile'] as const).map((bp) => ({
      key: `breakpoint-${bp}`,
      name: bp.charAt(0).toUpperCase() + bp.slice(1),
      type: 'FLOAT',
      codeSyntax: custom(`breakpoint--${bp}`),
      scopes: [],
      values: { 'Mode 1': p.breakpoints[bp] },
    }));

    const collections: PlannedCollection[] = [
      { name: 'Theme - Colour', modes: ['Value'], variables: colour },
      { name: 'Theme - Semantic', modes: ['Value'], variables: semantic },
      { name: 'Theme - Typography', modes: ['Max', 'Min'], variables: typography },
      { name: 'Theme - Spacing', modes: ['Max', 'Min'], variables: spacing },
      { name: 'Theme - Radius', modes: ['Mode 1'], variables: radius },
      { name: 'Theme - Layout', modes: ['Mode 1'], variables: layout },
      { name: 'Theme - Breakpoints', modes: ['Mode 1'], variables: breakpoints },
    ].filter((c) => c.variables.length);

    this.assertAliasesResolve(collections);

    const effectStyles: PlannedEffectStyle[] = p.shadows.map((s) => ({
      name: `LSX/${s.name}`,
      description: `theme.json shadow preset "${s.slug}": var(--wp--preset--shadow--${s.slug}).`,
      effects: s.effects,
    }));

    return { collections, effectStyles };
  }

  /** One variable per role. The value is the clean name; the description keeps the exact CSS stack. */
  private fontVariables(p: Proposal): PlannedVariable[] {
    const roles: Array<[FontRoleSlug, string, string]> = [
      ['heading', 'Primary', 'Headings'],
      ['body', 'Secondary', 'Body text'],
      ['accent', 'Tertiary', 'Accent text'],
      ['monospace', 'Monospace', 'Code'],
    ];
    return roles.flatMap(([slug, name, use]) => {
      const font = p.typography.families[slug];
      // No accent variable unless the site uses a third family.
      if (!font) {
        return [];
      }
      return [
        {
          key: `font-${slug}`,
          name: `Font-Families/${name}`,
          type: 'STRING' as const,
          codeSyntax: `var(--wp--preset--font-family--${slug})`,
          scopes: ['FONT_FAMILY'],
          values: { Max: font.name, Min: font.name },
          description: `${use} (${font.source}). CSS stack: ${font.stack}`,
        },
      ];
    });
  }

  private semanticScopes(role: string): string[] {
    if (role === 'surface/overlay') return FILL;
    if (/^border\/|\/border$/.test(role)) return ['STROKE_COLOR'];
    if (/^text\/|\/text$/.test(role)) return ['TEXT_FILL'];
    return FILL;
  }
}

/** The figma-to-block-theme export shape. */
export class ExportWriter {
  write(plan: TokenPlan): object {
    const id = (key: string) => `site:${key}`;
    return {
      collections: plan.collections.map((c) => ({
        name: c.name,
        modes: c.modes.map((m) => ({ id: `${c.name}:${m}`, name: m })),
        variables: c.variables.map((v) => ({
          id: id(v.key),
          name: v.name,
          type: v.type,
          codeSyntax: v.codeSyntax ? { WEB: v.codeSyntax } : {},
          ...(v.description ? { description: v.description } : {}),
          valuesByMode: Object.fromEntries(
            Object.entries(v.values).map(([mode, value]) => [
              `${c.name}:${mode}`,
              typeof value === 'object' && 'alias' in value
                ? { type: 'VARIABLE_ALIAS', id: id(value.alias) }
                : value,
            ])
          ),
        })),
      })),
      effectStyles: plan.effectStyles,
    };
  }
}

/** Generates the use_figma script. It refuses to run if a collection of the same name exists. */
export class FigmaScriptWriter {
  static readonly MAX_LENGTH = 50000;

  write(plan: TokenPlan): string {
    const data = JSON.stringify(plan);
    const script = `// Generated by site-to-design-tokens. Creates the token collections and effect styles.
const DATA = ${data};
const existing = await figma.variables.getLocalVariableCollectionsAsync();
const clash = existing.map((c) => c.name).filter((name) => DATA.collections.some((d) => d.name === name));
const styles = await figma.getLocalEffectStylesAsync();
const styleClash = styles.map((s) => s.name).filter((name) => DATA.effectStyles.some((d) => d.name === name));
if (clash.length || styleClash.length) {
  throw new Error('Already in this file: ' + clash.concat(styleClash).join(', ') + '. Remove or rename them first, or update them by hand.');
}
const byKey = {};
const modeIds = {};
const collectionIds = [];
for (const col of DATA.collections) {
  const collection = figma.variables.createVariableCollection(col.name);
  collectionIds.push(collection.id);
  modeIds[col.name] = {};
  collection.renameMode(collection.modes[0].modeId, col.modes[0]);
  modeIds[col.name][col.modes[0]] = collection.modes[0].modeId;
  for (const mode of col.modes.slice(1)) {
    modeIds[col.name][mode] = collection.addMode(mode);
  }
  for (const v of col.variables) {
    const variable = figma.variables.createVariable(v.name, collection, v.type);
    variable.scopes = v.scopes;
    if (v.codeSyntax) variable.setVariableCodeSyntax('WEB', v.codeSyntax);
    if (v.description) variable.description = v.description;
    byKey[v.key] = variable;
  }
}
let values = 0;
for (const col of DATA.collections) {
  for (const v of col.variables) {
    for (const [mode, value] of Object.entries(v.values)) {
      const resolved = value && typeof value === 'object' && 'alias' in value
        ? figma.variables.createVariableAlias(byKey[value.alias])
        : value;
      byKey[v.key].setValueForMode(modeIds[col.name][mode], resolved);
      values++;
    }
  }
}
const effectStyleIds = [];
for (const s of DATA.effectStyles) {
  const style = figma.createEffectStyle();
  style.name = s.name;
  style.description = s.description;
  style.effects = s.effects.map((e) =>
    e.type === 'DROP_SHADOW'
      ? { ...e, visible: true, blendMode: 'NORMAL', showShadowBehindNode: false }
      : { ...e, visible: true, blendMode: 'NORMAL' }
  );
  effectStyleIds.push(style.id);
}
return { collectionIds, variableCount: Object.keys(byKey).length, values, effectStyleIds };
`;
    if (script.length > FigmaScriptWriter.MAX_LENGTH) {
      throw new Error(
        `The script is ${script.length} characters; use_figma accepts ${FigmaScriptWriter.MAX_LENGTH}. Split the plan.`
      );
    }
    return script;
  }
}

export interface ExportCliIo {
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

export function runExportCli(argv: string[], io: ExportCliIo): number {
  let input: string | undefined;
  let exportPath: string | undefined;
  let scriptPath: string | undefined;

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
          'Usage: write-token-export <proposal.json> [--export variables.json] [--figma-script create-variables.js]\n'
        );
        return 0;
      } else if (arg === '--export') {
        exportPath = next();
      } else if (arg === '--figma-script') {
        scriptPath = next();
      } else if (arg.startsWith('--')) {
        throw new Error(`Unknown option ${arg}.`);
      } else {
        input = arg;
      }
    }
    if (!input) {
      throw new Error('Pass the path to an approved proposal.json.');
    }
    if (!exportPath && !scriptPath) {
      throw new Error('Pass --export, --figma-script or both.');
    }
    const proposal = JSON.parse(io.readFile(input)) as Proposal;
    if (!proposal.colour?.primitives) {
      throw new Error('That file is not a proposal from propose-tokens.');
    }
    const plan = new TokenPlanBuilder().build(proposal);
    if (exportPath) {
      io.writeFile(exportPath, `${JSON.stringify(new ExportWriter().write(plan), null, 2)}\n`);
    }
    if (scriptPath) {
      io.writeFile(scriptPath, new FigmaScriptWriter().write(plan));
    }
    const count = plan.collections.reduce((t, c) => t + c.variables.length, 0);
    io.stdout(
      `Planned ${plan.collections.length} collections, ${count} variables and ${plan.effectStyles.length} effect styles.\n`
    );
    return 0;
  } catch (error) {
    io.stderr(`write-token-export: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runExportCli(process.argv.slice(2), {
    readFile: (path) => readFileSync(path, 'utf8'),
    writeFile: (path, content) => writeFileSync(path, content),
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  });
}
