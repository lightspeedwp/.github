import { ProposalReport, runProposeCli, SEMANTIC_DEFAULTS, TokenProposer } from '../propose-tokens';
import { Color, RAMP_STEPS, RampBuilder } from '../lib/color';
import { tspLikeStyles } from './fixtures';

const now = () => new Date('2026-11-03T12:00:00Z');

describe('TokenProposer on a TSP-like site', () => {
  const proposal = new TokenProposer().propose(tspLikeStyles(), { now });
  const anchor = (family: string) => proposal.colour.anchors.find((a) => a.family === family)!;

  it('anchors the families on the colours the site uses', () => {
    expect(anchor('primary')).toMatchObject({ hex: '#565b3d', source: 'observed' });
    expect(anchor('primary').evidence).toContain('button-background');
    expect(anchor('brand')).toMatchObject({ hex: '#8d621f', step: 600, source: 'observed' });
    expect(anchor('cta')).toMatchObject({ hex: '#a31700', source: 'observed' });
    expect(proposal.colour.primitives['brand-600']).toBe('#8d621f');
    expect(proposal.colour.primitives[`primary-${anchor('primary').step}`]).toBe('#565b3d');
  });

  it('builds base, contrast, four full ramps and the system colours', () => {
    const p = proposal.colour.primitives;
    expect(p.base).toBe('#ffffff');
    expect(p.contrast).toBe('#262423');
    for (const family of ['brand', 'primary', 'cta', 'neutral']) {
      for (const step of RAMP_STEPS) {
        expect(p[`${family}-${step}`]).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
    expect(p['error-foreground']).toBe('#cc0000');
    expect(anchor('neutral')).toMatchObject({ hex: '#8a8580', source: 'observed' });
    expect(proposal.colour.overlay).toMatch(/^#[0-9a-f]{6}40$/);
  });

  it('maps semantic roles from what elements use, falling back to the TSP defaults', () => {
    const s = proposal.colour.semantic;
    expect(Object.keys(s)).toEqual(Object.keys(SEMANTIC_DEFAULTS));
    expect(s['text/default']).toMatchObject({ token: 'contrast', source: 'observed' });
    expect(s['text/link']).toMatchObject({ token: 'brand-600', source: 'observed' });
    expect(s['action/primary/background'].token).toBe(`primary-${anchor('primary').step}`);
    expect(s['action/primary/background-hover'].token).toBe(
      `primary-${anchor('primary').step + 100}`
    );
    expect(s['action/primary/text']).toMatchObject({ token: 'base', source: 'observed' });
    expect(s['border/default'].source).toBe('observed');
    expect(s['surface/subtle'].evidence).toContain('#f6f3f1');
    expect(s['surface/inverse']).toMatchObject({ token: 'contrast', source: 'observed' });
    expect(s['text/brand']).toEqual({ token: 'brand-600', source: 'default' });
  });

  it('matches live colours to tokens', () => {
    const row = (value: string) => proposal.matches.find((m) => m.value === value)!;
    expect(row('#8d621f')).toMatchObject({ token: 'brand-600', match: 'exact' });
    expect(row('#262423')).toMatchObject({ token: 'contrast', match: 'exact' });
    expect(row('#f6f3f1').match).not.toBe('none');
  });

  it('checks contrast for the semantic pairs', () => {
    const pair = (name: string) => proposal.contrast.find((c) => c.pair === name)!;
    expect(pair('text/default on surface/default')).toMatchObject({ pass: true, required: 4.5 });
    expect(pair('text/link on surface/default').ratio).toBeCloseTo(5.39, 1);
    expect(pair('border/focus on surface/default').required).toBe(3);
    expect(proposal.contrast).toHaveLength(17);
  });

  it('builds the type scale with the body size at xSmall and mobile minimums', () => {
    const sizes = proposal.typography.sizes;
    expect(proposal.typography.families).toEqual({ heading: 'Moret', body: 'Lora' });
    expect(sizes.map((s) => s.name)).toEqual([
      'Tiny',
      'xSmall',
      'Small',
      'Medium',
      'Large',
      'xLarge',
      'Huge',
      'Gigantic',
    ]);
    expect(sizes[1]).toMatchObject({ slug: 'x-small', max: 16, min: 16, lineHeight: 1.5 });
    expect(sizes[7]).toMatchObject({ slug: 'gigantic', max: 60, min: 36, lineHeight: 1.2 });
    expect(sizes[2]).toMatchObject({ max: 20, min: 16 });
    expect(proposal.typography.weights).toMatchObject({ body: 400, button: 600, h1: 400 });
    expect(proposal.decisions.join(' ')).toContain('share the one Tiny slot');
  });

  it('builds spacing, radius, shadows, layout and breakpoints', () => {
    // Section and card spacing only; button padding is a component token.
    expect(proposal.spacing.map((s) => [s.name, s.slug, s.max, s.min])).toEqual([
      ['None', 'none', 0, 0],
      ['S', '20', 20, 20],
      ['L', '40', 40, 32],
      ['XXL', '60', 60, 48],
      ['XXXXL', '80', 80, 60],
      ['Colossal', '100', 100, 72],
    ]);
    expect(proposal.radius).toEqual([
      { name: 'None', slug: 'none', value: 0 },
      { name: 'Small', slug: 'small', value: 4 },
      { name: 'Base', slug: 'base', value: 8 },
      { name: 'Round', slug: 'round', value: 9999 },
    ]);
    expect(proposal.shadows.map((s) => s.slug)).toEqual(['x-small', 'small', 'medium']);
    expect(proposal.shadows[0].effects[0]).toMatchObject({
      type: 'DROP_SHADOW',
      offset: { x: 0, y: 1 },
      radius: 1,
    });
    expect(proposal.shadows[2].effects[0].type).toBe('INNER_SHADOW');
    expect(proposal.layout).toEqual({ content: 768, wide: 1240 });
    expect(proposal.breakpoints).toEqual({ mobile: 376, tablet: 768, desktop: 1240 });
  });

  it('keeps the default for a text colour that is unreadable on the page', () => {
    const styles = tspLikeStyles();
    // Every in-text link sits on a photo, so all of them are white.
    for (const capture of styles.captures) {
      for (const sample of capture.samples.filter((x) => x.role === 'link')) {
        sample.color = 'rgb(255, 255, 255)';
      }
    }
    const onPhoto = new TokenProposer().propose(styles, { now });
    expect(onPhoto.colour.semantic['text/link'].token).toBe('brand-600');
    expect(onPhoto.decisions.join(' ')).toContain('`text/link` kept the default `brand-600`');
  });

  it('honours assigned anchors', () => {
    const assigned = new TokenProposer().propose(tspLikeStyles(), {
      assign: { cta: '#c0392b' },
      now,
    });
    expect(assigned.colour.anchors.find((a) => a.family === 'cta')).toMatchObject({
      hex: '#c0392b',
      source: 'assigned',
    });
    expect(() =>
      new TokenProposer().propose(tspLikeStyles(), { assign: { brand: 'brown' } })
    ).toThrow('is not a colour');
  });
});

describe('TokenProposer on a sparse site', () => {
  const styles = {
    site: 'https://plain.example',
    capturedAt: '2026-11-03T00:00:00.000Z',
    viewports: [390, 1440],
    captures: [390, 1440].map((viewport) => ({
      url: 'https://plain.example/',
      viewport,
      mediaWidths: [],
      samples: [
        {
          key: 'p:0',
          role: 'body' as const,
          color: 'rgb(51, 51, 51)',
          fontFamily: 'Arial',
          fontSize: 16,
          lineHeight: 24,
        },
        {
          key: 'h:0',
          role: 'h1' as const,
          color: 'rgb(51, 51, 51)',
          fontFamily: 'Arial',
          fontSize: viewport === 1440 ? 40 : 28,
        },
        { key: 'a:0', role: 'link' as const, color: 'rgb(0, 102, 204)', fontSize: 16 },
        { key: 'r:0', role: 'surface' as const, radius: '999px', shadow: 'none-ish' },
        {
          key: 'x:0',
          role: 'surface' as const,
          background: 'rgba(0, 0, 0, 0.5)',
          containerWidth: 900,
        },
      ],
    })),
  };
  const proposal = new TokenProposer().propose(styles, { now });

  it('generates placeholders and defaults, and says so', () => {
    const decisions = proposal.decisions.join('\n');
    expect(proposal.colour.anchors.find((a) => a.family === 'brand')?.hex).toBe('#0066cc');
    expect(
      proposal.colour.anchors.filter((a) => a.source === 'generated').map((a) => a.family)
    ).toEqual(['cta', 'primary', 'neutral']);
    expect(decisions).toContain('No site colour fits `primary`');
    expect(decisions).toContain('No light page background was found');
    expect(decisions).toContain('No repeated centred container');
    expect(proposal.layout).toEqual({});
    expect(proposal.breakpoints).toEqual({ mobile: 376, tablet: 768, desktop: 1240 });
    expect(proposal.radius.map((r) => r.slug)).toEqual(['none', 'round']);
    expect(proposal.shadows).toEqual([]);
    expect(proposal.spacing).toEqual([{ name: 'None', slug: 'none', max: 0, min: 0 }]);
    expect(proposal.typography.sizes.map((s) => s.name)).toEqual(['xSmall', 'Small']);
  });

  it('puts spacing on the nearest free ladder step and drops what does not fit', () => {
    const proposer = new TokenProposer();
    proposer.propose(styles, { now });
    const samples = [12, 16, 22, 140, 200].map((paddingBlock, i) => ({
      key: `sp:${i}`,
      page: '/',
      role: 'section',
      paddingBlock,
    }));
    const spacing = proposer.proposeSpacing(samples as never, () => undefined);
    expect(spacing.map((s) => [s.name, s.slug, s.max])).toEqual([
      ['None', 'none', 0],
      ['XS', '10', 12],
      ['S', '20', 16],
      ['M', '30', 22],
      ['Colossal', '100', 140],
    ]);
  });

  it('names the spacing values left out when there are more than the ladder holds', () => {
    const proposer = new TokenProposer();
    proposer.propose(styles, { now });
    // 13 well-separated section paddings: two more than the 11 ladder steps.
    const sizes = [10, 14, 18, 24, 30, 38, 48, 60, 76, 96, 120, 150, 190];
    const samples = sizes.flatMap((paddingBlock, i) =>
      Array.from({ length: i < 2 ? 1 : 2 }, (_, n) => ({
        key: `sp:${i}:${n}`,
        page: '/',
        role: 'section',
        paddingBlock,
      }))
    );
    proposer.proposeSpacing(samples as never, () => undefined);
    expect(proposer['decisions']).toContain(
      '2 rarely used spacing values were left out of the scale: 10px, 14px.'
    );
  });

  it('merges sizes that do not fit the scale', () => {
    const many = JSON.parse(JSON.stringify(styles));
    for (const capture of many.captures) {
      [18, 19, 22, 26, 30, 34, 44, 52].forEach((size: number, i: number) =>
        capture.samples.push({
          key: `s:${i}`,
          role: 'h2',
          fontSize: size,
          color: 'rgb(51, 51, 51)',
        })
      );
    }
    const merged = new TokenProposer().propose(many, { now });
    expect(merged.typography.sizes).toHaveLength(7);
    expect(merged.decisions.join(' ')).toContain('was merged into the nearest size');
  });

  it('parses multi-layer and odd shadows', () => {
    expect(
      TokenProposer.parseShadow('rgba(0, 0, 0, 0.5) 0px 2px 4px 1px, inset 0 1px #ff0000')
    ).toHaveLength(2);
    expect(TokenProposer.parseShadow('none')).toEqual([]);
  });
});

describe('ProposalReport', () => {
  it('renders every section for review', () => {
    const report = new ProposalReport().render(
      new TokenProposer().propose(tspLikeStyles(), { now })
    );

    for (const heading of [
      '# Token proposal: https://www.example.com',
      '## Decisions for the reviewer',
      '## Colour primitives (Theme - Colour)',
      '## Semantic tokens (Theme - Semantic)',
      '## Live colours to tokens',
      '## Contrast (WCAG 2.2)',
      '## Typography (Theme - Typography)',
      '## Spacing (Theme - Spacing)',
      '## Radius, shadows and layout',
    ]) {
      expect(report).toContain(heading);
    }
    expect(report).toContain('Confirm `brand`: #8d621f at step 600');
    expect(report).toContain('| `text/link` | `brand-600` | #8d621f | site: #8d621f');
  });

  it('lists failing contrast pairs in the summary', () => {
    const proposal = new TokenProposer().propose(tspLikeStyles(), { now });
    const row = proposal.contrast.find(
      (c) => c.pair === 'action/primary/text on action/primary/background'
    )!;
    row.pass = false;
    const report = new ProposalReport().render(proposal);
    expect(report).toMatch(/failing: .*action\/primary\/text on action\/primary\/background/);
    expect(report).toContain('**fail**');
  });
});

describe('runProposeCli', () => {
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
  const styles = JSON.stringify(tspLikeStyles());

  it('writes the proposal and the report', () => {
    const run = io({ 'styles.json': styles });

    expect(
      runProposeCli(
        ['styles.json', '--out', 'p.json', '--report', 'p.md', '--assign', 'cta=#c0392b'],
        run.io
      )
    ).toBe(0);
    expect(
      JSON.parse(run.written['p.json']).colour.anchors.find(
        (a: { family: string }) => a.family === 'cta'
      ).hex
    ).toBe('#c0392b');
    expect(run.written['p.md']).toContain('# Token proposal');
    expect(run.out.join('')).toContain('Wrote p.json and p.md');
  });

  it('defaults the output path and prints help', () => {
    const run = io({ 'styles.json': styles });
    expect(runProposeCli(['styles.json'], run.io)).toBe(0);
    expect(run.written['proposal.json']).toBeDefined();
    expect(runProposeCli(['--help'], run.io)).toBe(0);
    expect(run.out.join('')).toContain('Usage: propose-tokens');
    expect(
      Color.parse(JSON.parse(run.written['proposal.json']).colour.primitives.base)
    ).not.toBeNull();
  });

  it.each([
    [[], 'Pass the path'],
    [['--out'], '--out needs a value'],
    [['--nope'], 'Unknown option --nope'],
    [['styles.json', '--assign', 'accent=#fff'], '--assign takes brand, primary or cta'],
    [['missing.json'], 'ENOENT'],
    [['empty.json'], 'has no captures'],
  ])('fails cleanly for %j', (argv, message) => {
    const run = io({ 'styles.json': styles, 'empty.json': '{"captures":[]}' });

    expect(runProposeCli(argv as string[], run.io)).toBe(1);
    expect(run.err.join('')).toContain(message);
  });
});

describe('TokenProposer.fitSiteColours', () => {
  const ramps = new RampBuilder();
  const setup = () => {
    const neutral = ramps.build('#8a8580', { maxChroma: 0.02 });
    const brand = ramps.build('#8d621f');
    const primitives: Record<string, string> = {};
    for (const step of RAMP_STEPS) {
      primitives[`neutral-${step}`] = neutral.steps[step];
      primitives[`brand-${step}`] = brand.steps[step];
    }
    const anchors = [
      { family: 'brand', hex: '#8d621f', step: brand.anchorStep, source: 'observed', evidence: '' },
      {
        family: 'neutral',
        hex: '#8a8580',
        step: neutral.anchorStep,
        source: 'observed',
        evidence: '',
      },
    ] as Parameters<TokenProposer['fitSiteColours']>[2];
    return { primitives, anchors };
  };
  const evidence = (hex: string, weight: number) => ({ hex, weight, uses: {} });
  const lightnessOf = (hex: string) => Color.parse(hex)!.toOklch().l;

  it('replaces the nearest step with a site colour of the same hue family', () => {
    const t = new TokenProposer();
    const { primitives, anchors } = setup();
    // A warm grey that sits at about neutral-700.
    t.fitSiteColours([evidence('#4a4641', 5)], primitives, anchors, []);
    expect(Object.values(primitives)).toContain('#4a4641');
    const slug = Object.entries(primitives).find(([, v]) => v === '#4a4641')![0];
    expect(slug).toMatch(/^neutral-/);
    expect(t['decisions'].some((d) => d.startsWith(`Site colour #4a4641 replaced ${slug}`))).toBe(
      true
    );
    // Lightness still falls from 100 to 900.
    const l = RAMP_STEPS.map((step) => lightnessOf(primitives[`neutral-${step}`]));
    expect(l).toEqual([...l].sort((a, b) => b - a));
  });

  it('fits a slate site grey into a warm neutral ramp, so the ramp follows the site', () => {
    const t = new TokenProposer();
    const { primitives, anchors } = setup();
    t.fitSiteColours([evidence('#374750', 5)], primitives, anchors, []);
    const slug = Object.entries(primitives).find(([, v]) => v === '#374750')?.[0];
    expect(slug).toMatch(/^neutral-/);
  });

  it('puts a warm site colour in the brand ramp', () => {
    const t = new TokenProposer();
    const { primitives, anchors } = setup();
    t.fitSiteColours([evidence('#b0792c', 3)], primitives, anchors, []);
    const slug = Object.entries(primitives).find(([, v]) => v === '#b0792c')?.[0];
    expect(slug).toMatch(/^brand-/);
  });

  it('leaves colours that do not fit where they are', () => {
    const t = new TokenProposer();
    const { primitives, anchors } = setup();
    const before = { ...primitives };
    // Strongly saturated blue: too chromatic for neutral and a different hue from brand.
    // Also pale pink: wrong hue for brand. Also near-black: no step within tolerance.
    t.fitSiteColours(
      [evidence('#0057ff', 9), evidence('#ffd6e0', 2), evidence('#0a0a0a', 1)],
      primitives,
      anchors,
      []
    );
    expect(primitives).toEqual(before);
    expect(t['decisions']).toEqual([]);
  });

  it('never overwrites an anchor step, excluded colours or existing values', () => {
    const t = new TokenProposer();
    const { primitives, anchors } = setup();
    const before = { ...primitives };
    t.fitSiteColours(
      [
        evidence('#8d621f', 9),
        evidence('#8a8580', 9),
        evidence('#898480', 8),
        evidence('#ffffff', 5),
      ],
      primitives,
      anchors,
      ['#ffffff']
    );
    expect(primitives).toEqual(before);
  });

  it('keeps the heavier colour when two claim the same step', () => {
    const t = new TokenProposer();
    const { primitives, anchors } = setup();
    t.fitSiteColours([evidence('#4b4742', 2), evidence('#4a4641', 8)], primitives, anchors, []);
    const values = Object.values(primitives);
    expect(values).toContain('#4a4641');
    expect(values).not.toContain('#4b4742');
    expect(
      t['decisions'].some((d) => d.includes('#4b4742 also fits') && d.includes('#4a4641'))
    ).toBe(true);
  });

  it('refuses a colour that would break the ramp order', () => {
    const t = new TokenProposer();
    const { primitives, anchors } = setup();
    // Make the darker neighbour lighter than the candidate, so placing it breaks the order.
    primitives['neutral-800'] = '#5a5a5a';
    primitives['neutral-700'] = '#6a6a6a';
    const before = { ...primitives };
    t.fitSiteColours([evidence('#4a4641', 4)], primitives, anchors, []);
    expect(primitives).toEqual(before);
  });
});
