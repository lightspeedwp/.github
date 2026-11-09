import {
  ColorConverter,
  FigmaVariablesMapper,
  runMapperCli,
  VariablesExport,
} from '../figma-variables-to-theme-json';

/** Loose JSON shape for reading mapper output in assertions. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- test-only access to nested JSON
type Json = Record<string, any>;

const white = { r: 1, g: 1, b: 1, a: 1 };
const navy = { r: 0, g: 0.2, b: 0.4, a: 1 };
const ink = { r: 0.1, g: 0.1, b: 0.1, a: 1 };

function fixture(): VariablesExport {
  return {
    collections: [
      {
        name: 'Colour',
        modes: [
          { id: 'light', name: 'Light' },
          { id: 'dark', name: 'Dark' },
        ],
        variables: [
          {
            id: 'c-base',
            name: 'Global/base',
            type: 'COLOR',
            codeSyntax: { WEB: 'var(--wp--preset--color--base)' },
            valuesByMode: { light: white, dark: ink },
          },
          {
            id: 'c-primary',
            name: 'Global/primary-500',
            type: 'COLOR',
            codeSyntax: { WEB: 'var(--wp--preset--color--primary-500)' },
            valuesByMode: {
              light: navy,
              dark: { type: 'VARIABLE_ALIAS', id: 'c-base' },
            },
          },
          {
            id: 'c-overlay',
            name: 'Global/overlay',
            type: 'COLOR',
            codeSyntax: { WEB: '--wp--preset--color--overlay' },
            valuesByMode: {
              light: { r: 0, g: 0, b: 0, a: 0.5 },
              dark: { r: 0, g: 0, b: 0, a: 0.5 },
            },
          },
          {
            id: 'c-text',
            name: 'Semantic/text/default',
            type: 'COLOR',
            codeSyntax: { WEB: 'var(--wp--custom--color--text--default)' },
            valuesByMode: {
              light: { type: 'VARIABLE_ALIAS', id: 'c-primary' },
              dark: { type: 'VARIABLE_ALIAS', id: 'c-base' },
            },
          },
          {
            id: 'c-raw',
            name: 'Semantic/border/raw',
            type: 'COLOR',
            codeSyntax: { WEB: 'var(--wp--custom--color--border--raw)' },
            valuesByMode: { light: ink, dark: ink },
          },
          {
            id: 'c-shadow',
            name: 'shadow/20',
            type: 'COLOR',
            codeSyntax: { WEB: 'var(--wp--custom--color--shadow--20)' },
            valuesByMode: {
              light: { r: 0, g: 0, b: 0, a: 0.2 },
              dark: { r: 0, g: 0, b: 0, a: 0.2 },
            },
          },
          {
            id: 'c-nested',
            name: 'Semantic/text/strong',
            type: 'COLOR',
            codeSyntax: { WEB: 'var(--wp--custom--color--text--strong)' },
            valuesByMode: {
              light: { type: 'VARIABLE_ALIAS', id: 'c-text' },
              dark: { type: 'VARIABLE_ALIAS', id: 'c-text' },
            },
          },
          {
            id: 'c-nosyntax',
            name: 'Draft/new',
            type: 'COLOR',
            valuesByMode: { light: white, dark: white },
          },
          {
            id: 'c-other',
            name: 'Draft/other',
            type: 'COLOR',
            codeSyntax: { WEB: 'theme.colors.other' },
            valuesByMode: { light: white, dark: white },
          },
          {
            id: 'c-library',
            name: 'Global/library',
            type: 'COLOR',
            codeSyntax: { WEB: 'var(--wp--preset--color--library)' },
            valuesByMode: {
              light: { type: 'VARIABLE_ALIAS', id: 'missing' },
              dark: white,
            },
          },
        ],
      },
      {
        name: 'Fonts',
        modes: [
          { id: 'f-default', name: 'Default' },
          { id: 'f-safari', name: 'Safari Night' },
        ],
        variables: [
          {
            id: 'f-heading',
            name: 'fontFamilies/heading',
            type: 'STRING',
            codeSyntax: { WEB: 'var(--wp--preset--font-family--heading)' },
            valuesByMode: { 'f-default': 'Nunito Sans', 'f-safari': 'Lora' },
          },
          {
            id: 'f-radius',
            name: 'radius/medium',
            type: 'FLOAT',
            codeSyntax: { WEB: 'var(--wp--preset--border-radius--200)' },
            valuesByMode: { 'f-default': 8, 'f-safari': 12 },
          },
          {
            id: 'f-line',
            name: 'lineHeight/body',
            type: 'FLOAT',
            codeSyntax: { WEB: 'var(--wp--custom--line-height--body)' },
            valuesByMode: { 'f-default': 150, 'f-safari': 150 },
          },
          {
            id: 'f-weight',
            name: 'fontWeight/bold',
            type: 'FLOAT',
            codeSyntax: { WEB: 'var(--wp--custom--font-weight--bold)' },
            valuesByMode: { 'f-default': 700, 'f-safari': 700 },
          },
          {
            id: 'f-label',
            name: 'label/tone',
            type: 'STRING',
            codeSyntax: { WEB: 'var(--wp--custom--tone)' },
            valuesByMode: { 'f-default': 'warm', 'f-safari': 'warm' },
          },
        ],
      },
      {
        name: 'Sizes',
        modes: [
          { id: 'desktop', name: 'Desktop' },
          { id: 'mobile', name: 'Mobile' },
        ],
        variables: [
          {
            id: 's-10',
            name: 'Padding/XS',
            type: 'FLOAT',
            codeSyntax: { WEB: 'var(--wp--preset--spacing--10)' },
            valuesByMode: { desktop: 24, mobile: 16 },
          },
          {
            id: 's-none',
            name: 'Padding/None',
            type: 'FLOAT',
            valuesByMode: { desktop: 0, mobile: 0 },
          },
          {
            id: 's-20',
            name: 'Padding/20 S',
            type: 'FLOAT',
            codeSyntax: { WEB: 'var(--wp--preset--spacing--20)' },
            valuesByMode: { desktop: 20, mobile: 20 },
          },
          {
            id: 'fs-100',
            name: 'fontSize/Tiny',
            type: 'FLOAT',
            codeSyntax: { WEB: 'var(--wp--preset--font-size--100)' },
            valuesByMode: { desktop: 12, mobile: 11 },
          },
          {
            id: 'fs-200',
            name: 'fontSize/Base',
            type: 'FLOAT',
            codeSyntax: { WEB: 'var(--wp--preset--font-size--200)' },
            valuesByMode: { desktop: 16, mobile: 16 },
          },
          {
            id: 's-zero',
            name: 'radius/none',
            type: 'FLOAT',
            codeSyntax: { WEB: 'var(--wp--preset--border-radius--0)' },
            valuesByMode: { desktop: 0, mobile: 0 },
          },
          {
            id: 's-shadow',
            name: 'shadow/odd',
            type: 'STRING',
            codeSyntax: { WEB: 'var(--wp--preset--shadow--odd)' },
            valuesByMode: { desktop: 'x', mobile: 'x' },
          },
        ],
      },
    ],
    effectStyles: [
      {
        name: 'Elevation/Small',
        description: 'Use var(--wp--preset--shadow--100)',
        effects: [
          {
            type: 'DROP_SHADOW',
            color: { r: 0.0667, g: 0.0667, b: 0.0667, a: 0.2 },
            offset: { x: 0, y: 2 },
            radius: 4,
            spread: 0,
          },
          { type: 'LAYER_BLUR', radius: 4 },
        ],
      },
      {
        name: 'Elevation/Inset Glow',
        effects: [{ type: 'INNER_SHADOW' }],
      },
      {
        name: 'Elevation/Hidden',
        effects: [{ type: 'DROP_SHADOW', visible: false }],
      },
    ],
  };
}

describe('ColorConverter', () => {
  it('converts 0-1 colours to hex, with alpha only when needed', () => {
    expect(ColorConverter.toHex(white)).toBe('#ffffff');
    expect(ColorConverter.toHex({ r: 0, g: 0, b: 0, a: 0.5 })).toBe('#00000080');
    expect(ColorConverter.toHex({ r: 2, g: -1, b: 0 })).toBe('#ff0000');
  });

  it('converts colours to rgba()', () => {
    expect(ColorConverter.toRgba({ r: 1, g: 0, b: 0 })).toBe('rgba(255, 0, 0, 1)');
  });
});

describe('FigmaVariablesMapper', () => {
  const result = new FigmaVariablesMapper().map(fixture());
  const settings = result.theme.settings as Json;

  it('builds the palette from code syntax slugs in the base mode', () => {
    expect(settings.color.palette).toEqual([
      { slug: 'base', name: 'Base', color: '#ffffff' },
      { slug: 'primary-500', name: 'Primary 500', color: '#003366' },
      { slug: 'overlay', name: 'Overlay', color: '#00000080' },
    ]);
  });

  it('writes other colour and font modes as style variations', () => {
    // A colour mode keeps the base palette and replaces only the semantic tokens.
    expect(result.variations.dark).toEqual({
      title: 'Dark',
      settings: {
        color: { palette: settings.color.palette },
        custom: {
          color: {
            text: {
              default: 'var(--wp--preset--color--base)',
              strong: 'var(--wp--custom--color--text--default)',
            },
            border: { raw: '#1a1a1a' },
            shadow: { '20': '#00000033' },
          },
        },
      },
    });
    expect(result.variations['safari-night'].settings).toEqual({
      typography: {
        fontFamilies: [{ slug: 'heading', name: 'Lora', fontFamily: 'Lora, sans-serif' }],
      },
    });
    expect(result.report.warnings.join('\n')).toContain(
      '"Global/base" changes in mode "Dark". Colour modes keep one palette'
    );
  });

  it('maps semantic colours to palette references', () => {
    expect(settings.custom.color.text).toEqual({
      default: 'var(--wp--preset--color--primary-500)',
      strong: 'var(--wp--custom--color--text--default)',
    });
    expect(settings.custom.color.border.raw).toBe('#1a1a1a');
  });

  it('converts custom numbers, including percentage line heights', () => {
    expect(settings.custom['line-height'].body).toBe('1.5');
    expect(settings.custom['font-weight'].bold).toBe('700');
    expect(settings.custom.tone).toBe('warm');
  });

  it('turns off the core spacing sizes, whose slugs clash with the ladder', () => {
    expect(settings.spacing.defaultSpacingSizes).toBe(false);
  });

  it('uses Mobile and Desktop modes as fluid min and max', () => {
    expect(settings.spacing.spacingSizes).toEqual([
      { slug: '10', name: 'XS', size: 'clamp(1rem, calc(0.762vw + 0.814rem), 1.5rem)' },
      { slug: '20', name: 'S', size: '1.25rem' },
    ]);
    expect(settings.typography.fontSizes).toEqual([
      {
        slug: '100',
        name: 'Tiny',
        size: '0.75rem',
        fluid: { min: '0.688rem', max: '0.75rem' },
      },
      { slug: '200', name: 'Base', size: '1rem' },
    ]);
  });

  it('builds font families, radius and shadows', () => {
    expect(settings.typography.fontFamilies).toEqual([
      { slug: 'heading', name: 'Nunito Sans', fontFamily: '"Nunito Sans", sans-serif' },
    ]);
    expect(settings.border).toEqual({
      radius: true,
      radiusSizes: [
        { slug: '200', name: 'medium', size: '8px' },
        { slug: '0', name: 'none', size: '0' },
      ],
    });
    expect(settings.shadow).toEqual({
      defaultPresets: false,
      presets: [
        { slug: '100', name: 'Small', shadow: '0 2px 4px 0 rgba(17, 17, 17, 0.2)' },
        { slug: 'inset-glow', name: 'Inset Glow', shadow: 'inset 0 0 0 0 rgba(0, 0, 0, 1)' },
      ],
    });
  });

  it('reports counts', () => {
    expect(result.report.counts).toMatchObject({
      color: 3,
      spacing: 2,
      'font-size': 2,
      'font-family': 1,
      'border-radius': 2,
      shadow: 2,
      custom: 7,
      variations: 2,
    });
  });

  it('reports what it skipped instead of guessing', () => {
    const warnings = result.report.warnings.join('\n');

    expect(warnings).toContain('"Draft/new" has no WEB code syntax');
    expect(warnings).toContain('"Padding/20 S" repeats its slug in the name; rename it to "S"');
    expect(warnings).not.toContain('ramp is out of order');
    expect(warnings).not.toContain('Padding/None');
    expect(warnings).toContain('"theme.colors.other" that is not a WordPress preset');
    expect(warnings).toContain('not in the export (missing)');
    expect(warnings).toContain('Custom colour "Semantic/border/raw" is a raw value');
    expect(warnings).not.toContain('"shadow/20"');
    expect(warnings).toContain('only "Default" is used for border-radius');
    expect(warnings).toContain('come from effect styles');
    expect(warnings).toContain('"Elevation/Inset Glow" has no --wp--preset--shadow-- slug');
    expect(warnings).toContain('"Elevation/Hidden" has no visible shadows');
  });

  it('honours explicit mode names and font fallback', () => {
    const mapped = new FigmaVariablesMapper({
      baseMode: 'Dark',
      fontFallback: 'serif',
    }).map(fixture());
    const palette = (mapped.theme.settings as Json).color.palette;

    expect(palette[0]).toEqual({ slug: 'base', name: 'Base', color: '#1a1a1a' });
    expect(mapped.variations.light).toBeDefined();
    expect((mapped.theme.settings as Json).typography.fontFamilies[0].fontFamily).toBe(
      '"Nunito Sans", serif'
    );
  });

  it('keeps the exact CSS stack declared in a font variable description', () => {
    const font = (value: string, description?: string) =>
      new FigmaVariablesMapper().map({
        collections: [
          {
            name: 'Typography',
            modes: [{ id: 'm', name: 'Value' }],
            variables: [
              {
                id: 'f',
                name: 'Font-Families/Primary',
                type: 'STRING',
                codeSyntax: { WEB: 'var(--wp--preset--font-family--heading)' },
                description,
                valuesByMode: { m: value },
              },
            ],
          },
        ],
      } as never);
    const stack = (mapped: ReturnType<typeof font>) =>
      (mapped.theme.settings as Json).typography.fontFamilies[0].fontFamily;
    const description = 'Headings (live). CSS stack: moret, Georgia, serif';

    expect(stack(font('Moret', description))).toBe('moret, Georgia, serif');
    // A stack for another font is ignored.
    expect(stack(font('Lora', description))).toBe('Lora, sans-serif');
    expect(stack(font('Moret'))).toBe('Moret, sans-serif');
    expect(stack(font('Moret', 'Headings only'))).toBe('Moret, sans-serif');
  });

  it('writes only the font roles that exist, with no accent when there is none', () => {
    const role = (slug: string, value: string) => ({
      id: slug,
      name: `Font-Families/${slug}`,
      type: 'STRING',
      codeSyntax: { WEB: `var(--wp--preset--font-family--${slug})` },
      valuesByMode: { m: value },
    });
    const mapped = new FigmaVariablesMapper().map({
      collections: [
        {
          name: 'Typography',
          modes: [{ id: 'm', name: 'Value' }],
          variables: [
            role('heading', 'Moret'),
            role('body', 'Lora'),
            role('monospace', 'Monospace'),
          ],
        },
      ],
    } as never);
    const slugs = (mapped.theme.settings as Json).typography.fontFamilies.map(
      (f: { slug: string }) => f.slug
    );
    expect(slugs).toEqual(['heading', 'body', 'monospace']);
  });

  it('maps bare radius names and strips the old "Radius " prefix', () => {
    const radius = (name: string) =>
      new FigmaVariablesMapper().map({
        collections: [
          {
            name: 'Theme - Radius',
            modes: [{ id: 'm', name: 'Mode 1' }],
            variables: [
              {
                id: 'r',
                name,
                type: 'FLOAT',
                codeSyntax: { WEB: 'var(--wp--preset--border-radius--100)' },
                valuesByMode: { m: 4 },
              },
            ],
          },
        ],
      } as never);
    const names = (mapped: ReturnType<typeof radius>) =>
      (mapped.theme.settings as Json).border.radiusSizes.map((r: { name: string }) => r.name);

    expect(names(radius('Small'))).toEqual(['Small']);
    expect(names(radius('Radius Small'))).toEqual(['Small']);
    expect(names(radius('Radius'))).toEqual(['Radius']);
  });

  it('maps both spellings of the extra sizes to X-Large and X-Small', () => {
    const mapped = new FigmaVariablesMapper().map({
      collections: [
        {
          name: 'Radius',
          modes: [{ id: 'm', name: 'Mode 1' }],
          variables: ['xLarge', 'X-Large', 'x-small'].map((name, i) => ({
            id: `r${i}`,
            name,
            type: 'FLOAT',
            codeSyntax: { WEB: `var(--wp--preset--border-radius--${(i + 1) * 100})` },
            valuesByMode: { m: 4 },
          })),
        },
      ],
    } as never);
    const names = (mapped.theme.settings as Json).border.radiusSizes.map(
      (r: { name: string }) => r.name
    );
    expect(names).toEqual(['X-Large', 'X-Large', 'X-Small']);
  });

  it('warns when a sizing ramp is out of order', () => {
    const mapped = new FigmaVariablesMapper().map({
      collections: [
        {
          name: 'Spacing',
          modes: [{ id: 'm', name: 'Value' }],
          variables: [30, 10, 20].map((slug) => ({
            id: `s-${slug}`,
            name: `Padding/${slug}`,
            type: 'FLOAT',
            codeSyntax: { WEB: `var(--wp--preset--spacing--${slug})` },
            valuesByMode: { m: slug },
          })),
        },
      ],
    });
    expect(mapped.report.warnings).toContain(
      'The spacing ramp is out of order in Figma (30, 10, 20). Order it smallest first.'
    );
  });

  it('gives custom lengths a unit and refuses unsafe or clashing paths', () => {
    const variable = (id: string, syntax: string, value: number) => ({
      id,
      name: id,
      type: 'FLOAT' as const,
      codeSyntax: { WEB: `var(${syntax})` },
      valuesByMode: { m: value },
    });
    const mapped = new FigmaVariablesMapper().map({
      collections: [
        {
          name: 'Custom',
          modes: [{ id: 'm', name: 'Value' }],
          variables: [
            variable('neg', '--wp--custom--spacing--negative-80', -80),
            variable('bp', '--wp--custom--breakpoint--tablet', 768),
            variable('evil', '--wp--custom--constructor--prototype--x', 1),
            variable('leaf', '--wp--custom--tone--warm', 1),
            variable('deeper', '--wp--custom--tone--warm--deep', 2),
            variable('group', '--wp--custom--tone', 3),
          ],
        },
      ],
    });
    const custom = (mapped.theme.settings as Json).custom;
    const warnings = mapped.report.warnings.join('\n');

    expect(custom.spacing['negative-80']).toBe('-5rem');
    expect(custom.breakpoint.tablet).toBe('768px');
    expect(({} as Json).x).toBeUndefined();
    expect(warnings).toContain('"constructor--prototype--x" uses a reserved key');
    expect(warnings).toContain('"tone--warm--deep" clashes with the value already at "warm"');
    expect(warnings).toContain('"tone" would replace a group of tokens');
    expect(custom.tone).toEqual({ warm: '1' });
  });

  it('flags type mismatches, circular aliases and empty collections', () => {
    const mapped = new FigmaVariablesMapper().map({
      collections: [
        { name: 'Empty', modes: [], variables: [] },
        {
          name: 'Broken',
          modes: [{ id: 'm', name: 'Mode 1' }],
          variables: [
            {
              id: 'a',
              name: 'loop/a',
              type: 'COLOR',
              codeSyntax: { WEB: 'var(--wp--preset--color--a)' },
              valuesByMode: { m: { type: 'VARIABLE_ALIAS', id: 'b' } },
            },
            {
              id: 'b',
              name: 'loop/b',
              type: 'COLOR',
              codeSyntax: { WEB: 'var(--wp--preset--color--b)' },
              valuesByMode: { m: { type: 'VARIABLE_ALIAS', id: 'a' } },
            },
            {
              id: 'c',
              name: 'wrong/spacing',
              type: 'STRING',
              codeSyntax: { WEB: 'var(--wp--preset--spacing--30)' },
              valuesByMode: { m: 'big' },
            },
            {
              id: 'd',
              name: 'wrong/size',
              type: 'STRING',
              codeSyntax: { WEB: 'var(--wp--preset--font-size--300)' },
              valuesByMode: { m: 'big' },
            },
            {
              id: 'e',
              name: 'wrong/family',
              type: 'FLOAT',
              codeSyntax: { WEB: 'var(--wp--preset--font-family--body)' },
              valuesByMode: { m: 4 },
            },
            {
              id: 'f',
              name: 'wrong/radius',
              type: 'STRING',
              codeSyntax: { WEB: 'var(--wp--preset--border-radius--100)' },
              valuesByMode: { m: '4' },
            },
          ],
        },
      ],
    });
    const warnings = mapped.report.warnings.join('\n');

    expect(warnings).toContain('Collection "Empty" has no modes');
    expect(warnings).toContain('circular alias');
    expect(warnings).toContain('"wrong/spacing" is STRING or unresolved, but FLOAT was expected');
    expect(warnings).toContain('"wrong/family" is FLOAT or unresolved, but STRING was expected');
    expect(mapped.theme.settings).toEqual({});
    expect(mapped.report.counts.custom).toBe(0);
  });
});

describe('runMapperCli', () => {
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
          if (!(path in files)) {
            throw new Error(`ENOENT: ${path}`);
          }
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

  const exportJson = JSON.stringify(fixture());

  it('prints the mapping and the warnings', () => {
    const run = io({ 'export.json': exportJson });

    expect(runMapperCli(['export.json'], run.io)).toBe(0);
    expect(JSON.parse(run.out.join('')).theme.settings.color.palette).toHaveLength(3);
    expect(run.err.join('')).toContain('warning: "Draft/new"');
  });

  it('writes to --out and passes mode and viewport options', () => {
    const run = io({ 'export.json': exportJson });

    runMapperCli(
      [
        'export.json',
        '--out',
        'mapped.json',
        '--base-mode',
        'Dark',
        '--min-mode',
        'Mobile',
        '--max-mode',
        'Desktop',
        '--font-fallback',
        'serif',
        '--min-viewport',
        '360',
        '--max-viewport',
        '1280',
      ],
      run.io
    );

    expect(run.out.join('')).toBe('Wrote mapped.json\n');
    const mapped = JSON.parse(run.written['mapped.json']);
    expect(mapped.theme.settings.color.palette[0].color).toBe('#1a1a1a');
  });

  it('prints help', () => {
    const run = io();

    expect(runMapperCli(['-h'], run.io)).toBe(0);
    expect(run.out.join('')).toContain('Usage:');
  });

  it.each([
    [[], 'Pass the path'],
    [['--out'], '--out needs a value'],
    [['--nope'], 'Unknown option --nope'],
    [['missing.json'], 'ENOENT'],
  ])('fails cleanly for %j', (argv, message) => {
    const run = io();

    expect(runMapperCli(argv as string[], run.io)).toBe(1);
    expect(run.err.join('')).toContain(message);
  });

  it('rejects an export without collections', () => {
    const run = io({ 'bad.json': '{}' });

    expect(runMapperCli(['bad.json'], run.io)).toBe(1);
    expect(run.err.join('')).toContain('no "collections" array');
  });
});
