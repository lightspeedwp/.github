import { TokenProposer } from '../propose-tokens';
import {
  ExportWriter,
  FigmaScriptWriter,
  runExportCli,
  TokenPlanBuilder,
} from '../write-token-export';
import { tspLikeStyles } from './fixtures';

const proposal = new TokenProposer().propose(tspLikeStyles(), {
  now: () => new Date('2026-11-03T12:00:00Z'),
});
const plan = new TokenPlanBuilder().build(proposal);
const collection = (name: string) => plan.collections.find((c) => c.name === name)!;

// The code syntax patterns the figma-to-block-theme mapper reads.
const PRESET =
  /--wp--preset--(color|spacing|font-size|font-family|border-radius|shadow)--([a-z0-9-]+)/;
const CUSTOM = /--wp--custom--([a-z0-9-]+(?:--[a-z0-9-]+)*)/;

describe('TokenPlanBuilder', () => {
  it('follows the TSP collection structure', () => {
    expect(plan.collections.map((c) => [c.name, c.modes])).toEqual([
      ['Theme - Colour', ['Value']],
      ['Theme - Semantic', ['Value']],
      ['Theme - Typography', ['Max', 'Min']],
      ['Theme - Spacing', ['Max', 'Min']],
      ['Theme - Radius', ['Mode 1']],
      ['Theme - Layout', ['Mode 1']],
      ['Theme - Breakpoints', ['Mode 1']],
    ]);
    // base, contrast, 4 ramps of 9, 8 system colours, overlay and 13 shadow alphas.
    expect(collection('Theme - Colour').variables).toHaveLength(2 + 36 + 8 + 1 + 13);
    expect(collection('Theme - Semantic').variables).toHaveLength(44);
  });

  it('names and code syntax match the TSP file and the mapper', () => {
    const colour = collection('Theme - Colour').variables;
    expect(colour.find((v) => v.key === 'brand-600')).toMatchObject({
      name: 'brand/600',
      codeSyntax: 'var(--wp--preset--color--brand-600)',
      scopes: [],
    });
    expect(colour.find((v) => v.key === 'shadow-25')).toMatchObject({
      name: 'shadow/25',
      codeSyntax: 'var(--wp--custom--color--shadow--25)',
      scopes: ['EFFECT_COLOR'],
    });
    const link = collection('Theme - Semantic').variables.find((v) => v.name === 'text/link')!;
    expect(link).toMatchObject({
      codeSyntax: 'var(--wp--custom--color--text--link)',
      scopes: ['TEXT_FILL'],
      values: { Value: { alias: 'brand-600' } },
    });
    expect(
      collection('Theme - Semantic').variables.find((v) => v.name === 'border/focus')!.scopes
    ).toEqual(['STROKE_COLOR']);
    expect(
      collection('Theme - Semantic').variables.find((v) => v.name === 'surface/overlay')!.scopes
    ).toEqual(['FRAME_FILL', 'SHAPE_FILL']);
    for (const c of plan.collections) {
      for (const v of c.variables) {
        expect(PRESET.test(v.codeSyntax) || CUSTOM.test(v.codeSyntax)).toBe(true);
      }
    }
  });

  it('stores fluid sizes as Max and Min, and line heights as percentages', () => {
    const typography = collection('Theme - Typography').variables;
    expect(typography.find((v) => v.name === 'Sizes/Gigantic')).toMatchObject({
      codeSyntax: 'var(--wp--preset--font-size--gigantic)',
      values: { Max: 60, Min: 36 },
    });
    expect(typography.find((v) => v.name === 'Line-Heights/xSmall')!.values).toEqual({
      Max: 150,
      Min: 150,
    });
    expect(typography.find((v) => v.name === 'Font-Families/Primary')).toMatchObject({
      codeSyntax: 'var(--wp--preset--font-family--heading)',
      values: { Max: 'Moret' },
    });
    expect(
      collection('Theme - Spacing').variables.find((v) => v.name === 'Padding/Colossal')!.values
    ).toEqual({ Max: 100, Min: 72 });
    expect(collection('Theme - Radius').variables.map((v) => v.name)).toEqual([
      'Radius None',
      'Radius Small',
      'Radius Base',
      'Radius Round',
    ]);
    expect(plan.effectStyles[0]).toMatchObject({
      name: 'LSX/xSmall',
      description: 'theme.json shadow preset "x-small": var(--wp--preset--shadow--x-small).',
    });
  });

  it('leaves out an empty layout collection', () => {
    const noLayout = new TokenPlanBuilder().build({ ...proposal, layout: {} });
    expect(noLayout.collections.map((c) => c.name)).not.toContain('Theme - Layout');
    const wideOnly = new TokenPlanBuilder().build({ ...proposal, layout: { wide: 1200 } });
    expect(wideOnly.collections.find((c) => c.name === 'Theme - Layout')!.variables).toHaveLength(
      1
    );
  });
});

describe('Sizing ramps are in ascending order', () => {
  it('orders spacing and type sizes by Max whatever the proposal order', () => {
    const scrambled = JSON.parse(JSON.stringify(proposal)) as typeof proposal;
    // A fixed scramble: reverse, then swap the first and middle entries.
    scrambled.spacing.reverse();
    const mid = Math.floor(scrambled.spacing.length / 2);
    [scrambled.spacing[0], scrambled.spacing[mid]] = [scrambled.spacing[mid], scrambled.spacing[0]];
    scrambled.typography.sizes.reverse();
    // Equal Max values fall back to the slug.
    scrambled.typography.sizes.push({
      ...scrambled.typography.sizes[0],
      name: 'Dup',
      slug: 'a-dup',
    });

    const built = new TokenPlanBuilder().build(scrambled);
    const col = (name: string) => built.collections.find((c) => c.name === name)!;
    const spacing = col('Theme - Spacing').variables.map((v) => (v.values as { Max: number }).Max);
    expect(spacing[0]).toBe(0);
    expect(spacing).toEqual([...spacing].sort((a, b) => a - b));
    const sizes = col('Theme - Typography')
      .variables.filter((v) => v.name.startsWith('Sizes/'))
      .map((v) => v.values as { Max: number });
    expect(sizes.map((s) => s.Max)).toEqual(sizes.map((s) => s.Max).sort((a, b) => a - b));
    const names = col('Theme - Typography').variables.map((v) => v.name);
    expect(names.indexOf('Sizes/Dup')).toBeLessThan(names.indexOf('Line-Heights/Dup') + 1);
    // The input proposal is not mutated by planning.
    expect(scrambled.typography.sizes[scrambled.typography.sizes.length - 1].name).toBe('Dup');
  });

  it('writes the Figma script and export in the same ascending order', async () => {
    const reversed = JSON.parse(JSON.stringify(proposal)) as typeof proposal;
    reversed.spacing.reverse();
    const built = new TokenPlanBuilder().build(reversed);
    const names = built.collections
      .find((c) => c.name === 'Theme - Spacing')!
      .variables.map((v) => v.name);
    expect(names[0]).toBe('Padding/None');
    expect(names[names.length - 1]).toBe('Padding/Colossal');
  });
});

describe('ExportWriter', () => {
  const data = new ExportWriter().write(plan) as {
    collections: Array<{
      name: string;
      modes: Array<{ id: string; name: string }>;
      variables: Array<{
        id: string;
        codeSyntax: { WEB: string };
        valuesByMode: Record<string, unknown>;
      }>;
    }>;
    effectStyles: unknown[];
  };

  it('writes the figma-to-block-theme export shape with resolvable aliases', () => {
    const ids = new Set(data.collections.flatMap((c) => c.variables.map((v) => v.id)));
    const semantic = data.collections.find((c) => c.name === 'Theme - Semantic')!;
    for (const v of semantic.variables) {
      const value = Object.values(v.valuesByMode)[0] as { type: string; id: string };
      expect(value.type).toBe('VARIABLE_ALIAS');
      expect(ids.has(value.id)).toBe(true);
    }
    const typography = data.collections.find((c) => c.name === 'Theme - Typography')!;
    expect(typography.modes).toEqual([
      { id: 'Theme - Typography:Max', name: 'Max' },
      { id: 'Theme - Typography:Min', name: 'Min' },
    ]);
    expect(data.effectStyles).toHaveLength(plan.effectStyles.length);
  });
});

/** A small fake of the Figma Plugin API, enough to run the generated script. */
function fakeFigma(existingCollections: string[] = [], existingStyles: string[] = []) {
  const calls = {
    collections: [] as string[],
    variables: [] as string[],
    values: 0,
    aliases: 0,
    styles: [] as Array<{ name: string; effects: unknown[] }>,
  };
  let next = 0;
  const figma = {
    variables: {
      getLocalVariableCollectionsAsync: async () => existingCollections.map((name) => ({ name })),
      createVariableCollection: (name: string) => {
        calls.collections.push(name);
        const modes = [{ modeId: `m${next++}`, name: 'Mode 1' }];
        return {
          id: `c${next++}`,
          modes,
          renameMode: (id: string, modeName: string) => {
            modes.find((m) => m.modeId === id)!.name = modeName;
          },
          addMode: (modeName: string) => {
            const modeId = `m${next++}`;
            modes.push({ modeId, name: modeName });
            return modeId;
          },
        };
      },
      createVariable: (name: string) => {
        calls.variables.push(name);
        return {
          id: `v${next++}`,
          scopes: [] as string[],
          description: '',
          setVariableCodeSyntax: () => undefined,
          setValueForMode: (modeId: string) => {
            if (!modeId) throw new Error('missing mode');
            calls.values++;
          },
        };
      },
      createVariableAlias: (variable: unknown) => {
        if (!variable) throw new Error('alias to a missing variable');
        calls.aliases++;
        return { type: 'VARIABLE_ALIAS' };
      },
    },
    getLocalEffectStylesAsync: async () => existingStyles.map((name) => ({ name })),
    createEffectStyle: () => {
      const style = { id: `s${next++}`, name: '', description: '', effects: [] as unknown[] };
      calls.styles.push(style);
      return style;
    },
  };
  return { figma, calls };
}

const AsyncFunction = Object.getPrototypeOf(async () => undefined).constructor;

describe('FigmaScriptWriter', () => {
  const script = new FigmaScriptWriter().write(plan);

  it('creates every collection, variable, alias and effect style', async () => {
    const { figma, calls } = fakeFigma();
    const result = await new AsyncFunction('figma', script)(figma);

    expect(calls.collections).toEqual(plan.collections.map((c) => c.name));
    expect(calls.variables).toHaveLength(
      plan.collections.reduce((t, c) => t + c.variables.length, 0)
    );
    expect(calls.aliases).toBe(44);
    expect(result.variableCount).toBe(calls.variables.length);
    expect(result.effectStyleIds).toHaveLength(plan.effectStyles.length);
    expect(calls.styles[0].name).toBe('LSX/xSmall');
    const inner = calls.styles
      .flatMap((s) => s.effects as Array<{ type: string; showShadowBehindNode?: boolean }>)
      .find((e) => e.type === 'INNER_SHADOW');
    expect(inner && 'showShadowBehindNode' in inner).toBe(false);
    expect(script.length).toBeLessThan(FigmaScriptWriter.MAX_LENGTH);
  });

  it('refuses to overwrite existing collections or styles', async () => {
    await expect(
      new AsyncFunction('figma', script)(fakeFigma(['Theme - Colour']).figma)
    ).rejects.toThrow('Already in this file: Theme - Colour');
    await expect(
      new AsyncFunction('figma', script)(fakeFigma([], ['LSX/Small']).figma)
    ).rejects.toThrow('LSX/Small');
  });

  it('refuses a plan that is too big for use_figma', () => {
    const huge = {
      ...plan,
      effectStyles: Array.from({ length: 400 }, (_, i) => ({
        name: `LSX/${i}`,
        description: 'x'.repeat(100),
        effects: [],
      })),
    };
    expect(() => new FigmaScriptWriter().write(huge)).toThrow('Split the plan');
  });
});

describe('runExportCli', () => {
  function io(files: Record<string, string> = {}) {
    const out: string[] = [];
    const err: string[] = [];
    const written: Record<string, string> = {};
    return {
      out,
      err,
      written,
      io: {
        readFile: (path: string) => {
          if (!(path in files)) throw new Error(`ENOENT: ${path}`);
          return files[path];
        },
        writeFile: (path: string, content: string) => {
          written[path] = content;
        },
        stdout: (text: string) => out.push(text),
        stderr: (text: string) => err.push(text),
      },
    };
  }

  it('writes the export and the Figma script', () => {
    const run = io({ 'p.json': JSON.stringify(proposal) });

    expect(runExportCli(['p.json', '--export', 'v.json', '--figma-script', 'f.js'], run.io)).toBe(
      0
    );
    expect(JSON.parse(run.written['v.json']).collections).toHaveLength(7);
    expect(run.written['f.js']).toContain('createVariableCollection');
    expect(run.out.join('')).toMatch(/Planned 7 collections, \d+ variables and 3 effect styles/);
  });

  it('prints help', () => {
    const run = io();
    expect(runExportCli(['--help'], run.io)).toBe(0);
    expect(run.out.join('')).toContain('Usage: write-token-export');
  });

  it.each([
    [[], 'Pass the path'],
    [['p.json'], 'Pass --export, --figma-script or both'],
    [['--export'], '--export needs a value'],
    [['--nope'], 'Unknown option --nope'],
    [['bad.json', '--export', 'v.json'], 'not a proposal'],
    [['missing.json', '--export', 'v.json'], 'ENOENT'],
  ])('fails cleanly for %j', (argv, message) => {
    const run = io({ 'p.json': JSON.stringify(proposal), 'bad.json': '{}' });

    expect(runExportCli(argv as string[], run.io)).toBe(1);
    expect(run.err.join('')).toContain(message);
  });
});
