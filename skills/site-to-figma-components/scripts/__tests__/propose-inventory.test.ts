import {
  DecisionApplier,
  Inventory,
  InventoryProposer,
  InventoryReport,
  kebab,
  runProposeCli,
  StyleBinder,
  TemplateClassifier,
} from '../propose-inventory';
import { TokenIndex } from '../lib/tokens';
import { node, page, site, variables } from './fixtures';

const propose = (withTokens = true) =>
  new InventoryProposer(
    withTokens ? new TokenIndex(variables()) : new TokenIndex(),
    'tsp-theme'
  ).propose(site());
const item = (inv: Inventory, id: string) => inv.items.find((i) => i.id === id)!;

describe('TemplateClassifier', () => {
  const url = 'https://www.example.com/x/';
  it.each([
    [['error404'], '404', '404'],
    [['search', 'search-results'], 'search', 'Search'],
    [['home', 'blog'], 'home', 'Blog Home'],
    [['home', 'page'], 'front-page', 'Front Page'],
    [['blog'], 'home', 'Blog Home'],
    [['archive', 'post-type-archive-tour'], 'archive-tour', 'Tour Archive'],
    [['archive', 'tax-travel-style'], 'taxonomy-travel-style', 'Travel Style Taxonomy'],
    [['archive', 'category'], 'category', 'Category'],
    [
      ['page', 'archive', 'page-template-template-travel-style-php'],
      'travel-style',
      'Travel Style',
    ],
    [['page', 'page-template-default'], 'page', 'Page'],
    [['archive', 'date'], 'archive', 'Archive'],
    [['single', 'tour-template-default', 'single-lsx-to-tour'], 'single-tour', 'Single Tour'],
    [['single', 'single-post', 'post-template-default'], 'single', 'Single Post'],
    [['single'], 'single', 'Single Post'],
  ])('maps %j to %s', (classes, slug, name) => {
    expect(TemplateClassifier.classify(classes as string[], url)).toEqual({ slug, name });
  });

  it('falls back to the URL', () => {
    expect(TemplateClassifier.classify([], 'https://www.example.com/').slug).toBe('front-page');
    expect(TemplateClassifier.classify([], url).slug).toBe('index');
  });
});

describe('InventoryProposer', () => {
  const inv = propose();

  it('leaves out pages that redirect to a page already crawled', () => {
    expect(inv.pages.map((p) => new URL(p.url).pathname)).toEqual([
      '/',
      '/tour/a/',
      '/tour/b/',
      '/contact/',
      '/missing/',
    ]);
    expect(inv.redirects).toEqual([
      { from: 'https://www.example.com/destinations/', to: 'https://www.example.com/' },
    ]);
    expect(inv.pages[0]).toMatchObject({ template: 'front-page', screenshots: ['home-1440.png'] });
    expect(inv.tokensLoaded).toBe(true);
    expect(inv.approved).toBe(false);
  });

  it('proposes the header and footer as template parts', () => {
    const header = item(inv, 'part:header');
    expect(header).toMatchObject({
      kind: 'template-part',
      count: 5,
      oneOff: false,
      mobileLayoutChanges: true,
      figmaName: 'Template Parts/Header',
    });
    expect(header.wordpress).toEqual({
      type: 'template-part',
      slug: 'header',
      area: 'header',
      file: 'parts/header.html',
    });
    expect(header.variantProperties).toEqual({ Breakpoint: ['Desktop', 'Mobile'] });
    const footer = item(inv, 'part:footer');
    expect(footer.variants[0].properties).toEqual({ Mode: 'Dark' });
    expect(footer.variants[0].bindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'fill', variable: 'surface/inverse', match: 'exact' }),
        expect.objectContaining({ property: 'paddingBlock', variable: 'Padding/40' }),
      ])
    );
  });

  it('groups buttons into one set with variant properties and states', () => {
    const button = item(inv, 'component:button');
    expect(button.figmaName).toBe('Components/Buttons/Button');
    expect(button.variantProperties).toEqual({
      Style: ['Fill', 'Outline'],
      Icon: ['False', 'True'],
      Size: ['Medium', 'Small'],
      State: ['Default', 'Hover'],
      Breakpoint: ['Desktop', 'Mobile'],
    });
    expect(button.wordpress).toMatchObject({
      type: 'core-block',
      block: 'core/button',
      styles: ['outline'],
    });
    const fill = button.variants.find((v) => v.properties.Style === 'Fill')!;
    expect(fill.bindings.find((b) => b.property === 'fill')).toMatchObject({
      variable: 'action/cta/background',
      match: 'exact',
    });
    expect(fill.bindings.find((b) => b.property === 'fontFamily')).toMatchObject({
      variable: 'Font-Families/Primary',
    });
  });

  it('names cards by their distinctive class and makes layout a variant', () => {
    expect(item(inv, 'component:tour-card')).toMatchObject({
      count: 3,
      aka: 'lsx-tour',
      figmaName: 'Components/Cards/Tour Card',
    });
    const travel = item(inv, 'component:travel-style-card');
    expect(travel.count).toBe(12);
    expect(travel.variantProperties.Layout).toEqual(['A', 'B']);
    expect(travel.wordpress).toMatchObject({
      type: 'pattern',
      slug: 'tsp-theme/travel-style-card',
      file: 'patterns/travel-style-card.php',
    });
  });

  it('maps every component family to a WordPress target', () => {
    const targets = Object.fromEntries(
      inv.items
        .filter((i) => i.kind === 'component')
        .map((i) => [i.id, i.wordpress.type + ':' + (i.wordpress.block ?? '')])
    );
    expect(targets).toMatchObject({
      'component:nav-item': 'core-block:core/navigation-link',
      'component:text-link': 'element-style:core/paragraph',
      'component:search-form': 'core-block:core/search',
      'component:form': 'plugin-block:',
      'component:input-field': 'plugin-block:',
      'component:badge': 'block-style:core/post-terms',
      'component:accordion': 'core-block:core/details',
    });
    expect(item(inv, 'component:nav-item').variantProperties).toEqual({
      Mode: ['Dark', 'Light'],
      Region: ['Footer', 'Header'],
      State: ['Default', 'Hover', 'Focus'],
    });
    expect(item(inv, 'component:input-field').variantProperties).toEqual({
      Type: ['Select', 'Text'],
      Style: ['Bordered', 'Plain'],
      State: ['Default', 'Focus'],
    });
    expect(item(inv, 'component:accordion').variantProperties).toEqual({
      State: ['Default', 'Open'],
    });
    expect(item(inv, 'component:badge').oneOff).toBe(true);
  });

  it('names patterns from their content and flags one-offs and near duplicates', () => {
    const names = inv.items.filter((i) => i.kind === 'pattern').map((i) => `${i.id}:${i.count}`);
    expect(names).toEqual([
      'pattern:hero:3',
      'pattern:card-grid:1',
      'pattern:feature-row:1',
      'pattern:call-to-action:1',
      'pattern:gallery:2',
      'pattern:testimonials:2',
      'pattern:card-grid-2:2',
      'pattern:card-grid-3:2',
      'pattern:section-heading:1',
      'pattern:media-and-text:1',
      'pattern:form-section:1',
      'pattern:content-section:1',
      'pattern:content-section-2:1',
    ]);
    expect(item(inv, 'pattern:hero').wordpress).toEqual({
      type: 'pattern',
      block: 'core/cover',
      slug: 'tsp-theme/hero',
      file: 'patterns/hero.php',
    });
    expect(item(inv, 'pattern:hero').content.images[0].src).toBe(
      'https://www.example.com/hero.jpg'
    );
    expect(item(inv, 'pattern:media-and-text').mobileLayoutChanges).toBe(true);
    expect(item(inv, 'pattern:card-grid-2').mergeWith).toEqual(['pattern:card-grid-3']);
    expect(item(inv, 'pattern:feature-row').mobileLayoutChanges).toBe(true);
    expect(item(inv, 'pattern:call-to-action').variants[0].properties).toEqual({ Mode: 'Dark' });
  });

  it('composes each template from its parts and patterns, top to bottom', () => {
    expect(item(inv, 'template:front-page').composition).toEqual([
      'part:header',
      'pattern:hero',
      'pattern:card-grid',
      'pattern:feature-row',
      'pattern:call-to-action',
      'part:footer',
    ]);
    expect(item(inv, 'template:single-tour')).toMatchObject({
      count: 2,
      figmaName: 'Templates/Single Tour',
      wordpress: { file: 'templates/single-tour.html' },
    });
    expect(item(inv, 'template:page').mobileLayoutChanges).toBe(true);
    expect(item(inv, 'template:404').composition).toEqual([
      'part:header',
      'pattern:content-section-2',
      'part:footer',
    ]);
  });

  it('lists values with no token and values that only match a primitive', () => {
    const keys = inv.unbound.map((u) => `${u.property} ${u.value} ${u.match}`);
    expect(keys).toEqual(
      expect.arrayContaining([
        'fill #f5f6f0 primitive',
        'paddingBlock 13px none',
        'radius 50px none',
        'paddingInline 14px none',
      ])
    );
  });

  it('binds nothing without a variables export', () => {
    const bare = propose(false);
    expect(bare.tokensLoaded).toBe(false);
    expect(bare.unbound.every((u) => u.match === 'none')).toBe(true);
  });

  it('handles a crawl with one viewport and a sidebar', () => {
    const sidebar = node({
      hint: 'sidebar',
      region: 'sidebar',
      label: 'aside#secondary',
      rect: { x: 1000, y: 100, w: 400, h: 600 },
    });
    const structure = {
      site: 'https://www.example.com',
      capturedAt: '2026-11-05T10:00:00.000Z',
      viewports: [1440],
      pages: [
        page('/a/', 1440, ['single', 'single-post'], [sidebar]),
        page('/b/', 1440, ['page'], [{ ...sidebar }]),
      ],
    };
    const result = new InventoryProposer(new TokenIndex(), 'demo').propose(structure);
    expect(item(result, 'part:sidebar')).toMatchObject({
      oneOff: false,
      wordpress: { area: 'uncategorized' },
      mobileLayoutChanges: false,
    });
  });
});

describe('InventoryProposer helpers', () => {
  it('reads modes from backgrounds and text colours', () => {
    expect(InventoryProposer.mode({ backgroundImage: true })).toBe('Image');
    expect(InventoryProposer.mode({})).toBe('Transparent');
    expect(InventoryProposer.mode({ background: 'rgba(0, 0, 0, 0.05)' })).toBe('Transparent');
    expect(InventoryProposer.mode({ background: 'rgb(0, 0, 0)' })).toBe('Dark');
    expect(InventoryProposer.mode({ background: 'rgb(255, 255, 255)' })).toBe('Light');
    expect(InventoryProposer.textMode('rgb(255, 255, 255)')).toBe('Dark');
    expect(InventoryProposer.textMode(undefined)).toBe('Light');
  });

  it('sizes, truncates shapes and keeps names unique', () => {
    expect(InventoryProposer.sizeKey(node({ rect: { x: 0, y: 0, w: 10, h: 60 } }))).toBe('Large');
    expect(InventoryProposer.truncateShape('div(article(div(a),div(h4,p)))*', 2)).toBe(
      'div(article(div,div))*'
    );
    expect(InventoryProposer.truncateShape('div(a)', 0)).toBe('div');
    expect(InventoryProposer.truncateShape('img', 3)).toBe('img');
    const taken = new Set(['Hero']);
    expect(InventoryProposer.unique('Hero', taken)).toBe('Hero 2');
    expect(InventoryProposer.unique('Hero', taken)).toBe('Hero 3');
    expect(kebab('Forms & Inputs')).toBe('forms-and-inputs');
  });

  it('gives remaining hints sensible properties and targets', () => {
    expect(
      InventoryProposer.componentProps(
        node({ hint: 'slider', style: { background: 'rgb(0, 0, 0)' } })
      )
    ).toEqual({ Mode: 'Dark' });
    expect(
      InventoryProposer.componentProps(
        node({ hint: 'badge', style: { border: 'red' }, icon: true })
      )
    ).toEqual({ Style: 'Outline', Icon: 'True' });
    expect(
      InventoryProposer.componentProps(
        node({ hint: 'input', tag: 'textarea', style: { background: 'red' } })
      )
    ).toEqual({ Type: 'Textarea', Style: 'Filled' });
    expect(
      InventoryProposer.componentProps(
        node({ hint: 'button', style: {}, rect: { x: 0, y: 0, w: 1, h: 20 } })
      )
    ).toMatchObject({ Style: 'Text', 'Has Text': 'False', Size: 'Small' });
    expect(
      InventoryProposer.distinctiveClass(node({ label: 'div.wp-block-group.align-full.hero' }))
    ).toBe('hero');
    expect(InventoryProposer.distinctiveClass(node({ label: 'div' }))).toBeUndefined();
  });

  it('maps pagination, breadcrumbs, tabs and sliders', () => {
    const structure = {
      site: 'https://www.example.com',
      capturedAt: '2026-11-05T10:00:00.000Z',
      viewports: [1440],
      pages: [
        page(
          '/',
          1440,
          ['home'],
          [
            node({ hint: 'pagination', label: 'nav.pagination' }),
            node({ hint: 'breadcrumbs', label: 'nav.breadcrumbs' }),
            node({ hint: 'tabs', label: 'div.tabs' }),
            node({ hint: 'slider', label: 'div.swiper' }),
            node({ hint: 'card', label: 'article.post', shape: 'article(img,h3)' }),
            node({ hint: 'card', label: 'div', shape: 'div(img,h3)' }),
          ]
        ),
      ],
    };
    const result = new InventoryProposer(new TokenIndex(), 'demo').propose(structure);
    const target = (id: string) => item(result, id).wordpress;
    expect(target('component:pagination').block).toBe('core/query-pagination');
    expect(target('component:breadcrumbs').type).toBe('custom-block');
    expect(target('component:tabs').note).toContain('tabs');
    expect(target('component:slider').note).toContain('slider');
    expect(result.items.filter((i) => i.hint === 'card').map((i) => i.name)).toEqual([
      'Card',
      'Card 2',
    ]);
  });
});

describe('InventoryProposer.proposal', () => {
  const base = { value: 'x', match: 'none' as const, items: ['a'] };
  it('proposes a new variable by kind, following the LightSpeed rules', () => {
    expect(
      InventoryProposer.proposal({ ...base, property: 'fontFamily', value: 'argesta' })
    ).toContain('Font-Families/Alternate');
    expect(InventoryProposer.proposal({ ...base, property: 'text', value: '#333333' })).toContain(
      'Fit #333333 into a colour ramp'
    );
    expect(InventoryProposer.proposal({ ...base, property: 'text', value: '#333333' })).toContain(
      'custom/<role>'
    );
    expect(
      InventoryProposer.proposal({
        ...base,
        property: 'fill',
        match: 'primitive',
        nearest: 'neutral/900',
        items: ['a', 'b'],
      })
    ).toBe(
      'Matches the primitive neutral/900. Point the semantic role for this fill at it, or add a semantic token.'
    );
    expect(InventoryProposer.proposal({ ...base, property: 'effect', items: ['a', 'b'] })).toBe(
      'Add an effect style for this shadow, or match it to the nearest one.'
    );
    expect(
      InventoryProposer.proposal({ ...base, property: 'radius', items: ['a', 'b'] }, [
        'Radius xLarge',
        'Radius Round',
      ])
    ).toBe(
      'Add a radius step between Radius xLarge and Radius Round, keeping the ramp in order and renumbering slugs if needed.'
    );
    expect(
      InventoryProposer.proposal({ ...base, property: 'fontSize', items: ['a', 'b'] }, [])
    ).toContain('Add a type size step,');
    expect(InventoryProposer.proposal({ ...base, property: 'gap', items: ['a', 'b'] })).toContain(
      'Add a spacing step,'
    );
  });
});

describe('StyleBinder', () => {
  it('skips unparseable colours and reports shadows without a style', () => {
    const bindings = new StyleBinder(new TokenIndex(variables())).bind(
      { background: 'var(--x)', shadow: '0 9px 9px red', color: 'rgb(38, 36, 35)' },
      'component'
    );
    expect(bindings).toEqual([
      {
        property: 'text',
        value: '#262423',
        variable: 'text/default',
        codeSyntax: undefined,
        match: 'exact',
      },
      { property: 'effect', value: '0 9px 9px red', match: 'none' },
    ]);
  });
});

describe('DecisionApplier', () => {
  const now = () => new Date('2026-11-06T09:00:00Z');

  it('merges, cuts, promotes, renames and approves', () => {
    const inv = propose();
    const out = new DecisionApplier(now).apply(inv, {
      merge: [['pattern:card-grid-2', 'pattern:card-grid-3']],
      cut: ['pattern:section-heading', 'pattern:section-heading'],
      promote: ['pattern:media-and-text'],
      rename: { 'pattern:gallery': 'Tour Gallery', 'component:tour-card': 'Safari Card' },
      approve: true,
    });
    expect(out.items.find((i) => i.id === 'pattern:card-grid-3')).toBeUndefined();
    expect(item(out, 'pattern:card-grid-2')).toMatchObject({ count: 4, oneOff: false });
    expect(item(out, 'template:single-tour').composition).toEqual([
      'part:header',
      'pattern:hero',
      'pattern:gallery',
      'pattern:testimonials',
      'pattern:card-grid-2',
      'pattern:card-grid-2',
      'part:footer',
    ]);
    expect(item(out, 'pattern:section-heading').status).toBe('cut');
    expect(item(out, 'pattern:media-and-text').oneOff).toBe(false);
    expect(item(out, 'pattern:gallery')).toMatchObject({
      name: 'Tour Gallery',
      figmaName: 'Patterns/Tour Gallery',
      wordpress: { slug: 'tsp-theme/tour-gallery', file: 'patterns/tour-gallery.php' },
    });
    expect(item(out, 'component:tour-card').figmaName).toBe('Components/Cards/Safari Card');
    expect(out).toMatchObject({ approved: true, approvedAt: '2026-11-06T09:00:00.000Z' });
    expect(out.decisions).toContain('Merged pattern:card-grid-3 into pattern:card-grid-2.');
    expect(inv.approved).toBe(false); // The input is not changed.
  });

  it('records the approved build scope, with what each template is built from', () => {
    const out = new DecisionApplier(now).apply(propose(), {
      cut: ['pattern:testimonials'],
      build: ['template:single-tour', 'component:button'],
    });
    expect(out.buildScope).toEqual([
      'part:header',
      'part:footer',
      'component:button',
      'pattern:hero',
      'pattern:gallery',
      'pattern:card-grid-2',
      'pattern:card-grid-3',
      'template:single-tour',
    ]);
    expect(new InventoryReport().render(out)).toContain(
      'Approved for the Figma build: part:header'
    );
  });

  it('rewrites template compositions after a merge', () => {
    const out = new DecisionApplier(now).apply(propose(), {
      merge: [['pattern:gallery', 'pattern:testimonials']],
    });
    expect(item(out, 'template:single-tour').composition).toEqual([
      'part:header',
      'pattern:hero',
      'pattern:gallery',
      'pattern:gallery',
      'pattern:card-grid-2',
      'pattern:card-grid-3',
      'part:footer',
    ]);
  });

  it('refuses unknown ids and merges across kinds', () => {
    expect(() => new DecisionApplier().apply(propose(), { cut: ['pattern:nope'] })).toThrow(
      'Unknown item ids in decisions: pattern:nope.'
    );
    expect(() =>
      new DecisionApplier().apply(propose(), { merge: [['pattern:hero', 'part:header']] })
    ).toThrow("Can't merge part:header");
  });

  it('renames a pattern in an inventory without a theme prefix', () => {
    const inv = propose();
    delete item(inv, 'pattern:hero').wordpress.slug;
    expect(
      item(
        new DecisionApplier().apply(inv, { rename: { 'pattern:hero': 'Big Hero' } }),
        'pattern:hero'
      ).wordpress.slug
    ).toBe('tsp-theme/big-hero');
  });
});

describe('InventoryReport', () => {
  it('renders the summary, decisions and every section', () => {
    const md = new InventoryReport('shots').render(propose());
    expect(md).toContain('# Component inventory: www.example.com');
    expect(md).toContain('Token bindings:');
    expect(md).toContain('**Redirected:** /destinations/ redirects to https://www.example.com/');
    expect(md).toContain(
      '**Merge?** These look alike: pattern:card-grid, pattern:card-grid-2, pattern:card-grid-3.'
    );
    expect(md).toContain('**One-off:** component:badge appears once (/)');
    expect(md).toContain(
      '**Primitive only:** fill #f5f6f0. Proposed: Matches the primitive primary/100.'
    );
    expect(md).toContain(
      '**No token:** radius 50px. Proposed: Add a radius step next to Radius Base'
    );
    expect(md).toContain('## Build scope');
    expect(md).toContain('Not chosen yet.');
    expect(md).toContain('**Template not crawled:** `search`');
    expect(md).toContain('![pattern:hero](shots/pattern-hero-1440.png)');
    expect(md).toContain('### Single Tour (`templates/single-tour.html`)');
    expect(md).toContain('Frames: 1440 and 390.');
    expect(md).not.toContain('—'); // No em dashes in document text.
  });

  it('says when no tokens were loaded, when everything is bound, and lists applied decisions', () => {
    const bare = propose(false);
    bare.unbound = [];
    bare.redirects = [];
    bare.items = bare.items
      .filter((i) => i.kind === 'template')
      .map((i) => ({ ...i, mergeWith: undefined }));
    bare.items.push({
      ...bare.items[0],
      id: 'template:search',
      wordpress: { type: 'template', slug: 'search' },
    });
    bare.items.push({
      ...bare.items[0],
      id: 'template:single',
      wordpress: { type: 'template', slug: 'single' },
    });
    bare.items.push({
      ...bare.items[0],
      id: 'template:page',
      wordpress: { type: 'template', slug: 'page' },
    });
    bare.decisions = ['Approved by the reviewer.'];
    bare.approved = true;
    bare.approvedAt = '2026-11-06T09:00:00.000Z';
    const md = new InventoryReport().render(bare);
    expect(md).toContain('No variables export was loaded');
    expect(md).toContain('Every value binds to a token.');
    expect(md).toContain('- Nothing to decide.');
    expect(md).toContain('## Decisions applied');
    expect(md).toContain('Status: approved 2026-11-06');
  });

  it('lists pages the crawler could not capture', () => {
    const inv = propose();
    inv.failures = [{ url: 'https://www.example.com/slow/', viewport: 390, error: 'timeout' }];
    expect(new InventoryReport().render(inv)).toContain(
      '**Not captured:** /slow/ at 390px (timeout).'
    );
  });

  it('caps the decisions list for long lists of unbound values', () => {
    const inv = propose();
    inv.unbound = Array.from({ length: 30 }, (_, n) => ({
      property: 'fill',
      value: `#00000${n}`,
      match: 'none' as const,
      items: ['x'],
      proposal: 'Fit it.',
    }));
    expect(new InventoryReport().render(inv)).toContain('5 more values without a token');
  });
});

describe('runProposeCli', () => {
  function io(files: Record<string, string>) {
    const written: Record<string, string> = {};
    const out: string[] = [];
    const err: string[] = [];
    return {
      io: {
        readFile: (p: string) => {
          if (!(p in files)) {
            throw new Error(`ENOENT ${p}`);
          }
          return files[p];
        },
        writeFile: (p: string, c: string) => {
          written[p] = c;
        },
        stdout: (t: string) => void out.push(t),
        stderr: (t: string) => void err.push(t),
        now: () => new Date('2026-11-06T09:00:00Z'),
      },
      written,
      out,
      err,
    };
  }
  const files = {
    's.json': JSON.stringify(site()),
    'v.json': JSON.stringify(variables()),
    'd.json': JSON.stringify({ approve: true }),
  };

  it('proposes, applies decisions and writes both files', () => {
    const t = io(files);
    expect(
      runProposeCli(
        [
          's.json',
          '--tokens',
          'v.json',
          '--theme',
          'tsp-theme',
          '--decisions',
          'd.json',
          '--out',
          'i.json',
          '--report',
          'i.md',
          '--shots',
          'shots',
        ],
        t.io
      )
    ).toBe(0);
    expect(JSON.parse(t.written['i.json']).approved).toBe(true);
    expect(t.written['i.md']).toContain('Status: approved');
    expect(t.out.join('')).toMatch(
      /items \(2 template-part, \d+ component, \d+ pattern, 4 template\)/
    );
  });

  it('works without tokens and prints usage', () => {
    const t = io(files);
    expect(runProposeCli(['s.json'], t.io)).toBe(0);
    expect(Object.keys(t.written)).toEqual(['inventory.json', 'inventory.md']);
    expect(runProposeCli(['--help'], t.io)).toBe(0);
    expect(t.out.join('')).toContain('Usage');
  });

  it('reports errors', () => {
    for (const argv of [[], ['s.json', '--nope', 'x'], ['s.json', '--out'], ['missing.json']]) {
      const t = io(files);
      expect(runProposeCli(argv, t.io)).toBe(1);
      expect(t.err.join('')).toMatch(/^propose-inventory: /);
    }
  });
});
