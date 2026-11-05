import { DecisionApplier, Inventory, InventoryProposer } from '../propose-inventory';
import { TokenIndex } from '../lib/tokens';
import { FigmaNodes, ManifestBuilder, runManifestCli } from '../write-manifest';
import { site, variables } from './fixtures';

const now = () => new Date('2026-11-07T09:00:00Z');

function approved(): Inventory {
  const inv = new InventoryProposer(new TokenIndex(variables()), 'tsp-theme').propose(site());
  return new DecisionApplier(() => new Date('2026-11-06T09:00:00Z')).apply(inv, {
    cut: ['pattern:testimonials'],
    approve: true,
  });
}

function allNodes(inv: Inventory): FigmaNodes {
  const nodes: FigmaNodes['nodes'] = {};
  inv.items
    .filter((i) => i.status !== 'cut')
    .forEach((i, n) => {
      nodes[i.id] = { nodeId: `100:${n + 1}`, page: '> Rebuild' };
      if (i.kind === 'template') {
        nodes[i.id].mobileNodeId = `200:${n + 1}`;
        nodes[i.id].composition = i.composition;
      }
    });
  return { fileKey: 'abc123', nodes };
}

describe('ManifestBuilder', () => {
  it('maps every built node to its WordPress target', () => {
    const inv = approved();
    const m = new ManifestBuilder(now).build(inv, allNodes(inv));
    expect(m).toMatchObject({
      manifestVersion: 1,
      theme: 'tsp-theme',
      figmaFileKey: 'abc123',
      inventoryApprovedAt: '2026-11-06T09:00:00.000Z',
      generatedAt: '2026-11-07T09:00:00.000Z',
      skipped: [],
      warnings: [],
    });
    expect(m.entries.map((e) => e.kind)).toEqual(
      [...m.entries.map((e) => e.kind)].sort(
        (a, b) =>
          ['component', 'template-part', 'pattern', 'template'].indexOf(a) -
          ['component', 'template-part', 'pattern', 'template'].indexOf(b)
      )
    );
    const button = m.entries.find((e) => e.id === 'component:button')!;
    expect(button.figma.url).toBe(
      `https://www.figma.com/design/abc123/?node-id=${button.figma.nodeId.replace(':', '-')}`
    );
    expect(button.variantProperties?.Style).toEqual(['Fill', 'Outline']);
    expect(button.figma.page).toBe('> Rebuild');
  });

  it('resolves template compositions, with cut sections kept local', () => {
    const inv = approved();
    const tour = new ManifestBuilder(now)
      .build(inv, allNodes(inv))
      .entries.find((e) => e.id === 'template:single-tour')!;
    expect(tour.figma.mobileNodeId).toMatch(/^200:/);
    expect(tour.composition).toEqual([
      { id: 'part:header', target: 'template-part', slug: 'header', file: 'parts/header.html' },
      { id: 'pattern:hero', target: 'pattern', slug: 'tsp-theme/hero', file: 'patterns/hero.php' },
      {
        id: 'pattern:gallery',
        target: 'pattern',
        slug: 'tsp-theme/gallery',
        file: 'patterns/gallery.php',
      },
      { id: 'pattern:testimonials', target: 'local' },
      {
        id: 'pattern:card-grid-2',
        target: 'pattern',
        slug: 'tsp-theme/card-grid-2',
        file: 'patterns/card-grid-2.php',
      },
      {
        id: 'pattern:card-grid-3',
        target: 'pattern',
        slug: 'tsp-theme/card-grid-3',
        file: 'patterns/card-grid-3.php',
      },
      { id: 'part:footer', target: 'template-part', slug: 'footer', file: 'parts/footer.html' },
    ]);
  });

  it('refuses an unapproved inventory, a missing file key, bad node IDs and missing nodes', () => {
    const inv = approved();
    const builder = new ManifestBuilder(now);
    expect(() => builder.build({ ...inv, approved: false }, allNodes(inv))).toThrow('not approved');
    expect(() => builder.build(inv, { ...allNodes(inv), fileKey: '' })).toThrow('fileKey');
    const bad = allNodes(inv);
    bad.nodes['component:button'].nodeId = '12-34';
    expect(() => builder.build(inv, bad)).toThrow('invalid node ID "12-34"');
    const missing = allNodes(inv);
    delete missing.nodes['pattern:hero'];
    expect(() => builder.build(inv, missing)).toThrow('pattern:hero has no Figma node');
  });

  it('builds a partial manifest with warnings', () => {
    const inv = approved();
    const nodes: FigmaNodes = {
      fileKey: 'abc123',
      nodes: {
        'part:header': { nodeId: '1:1' },
        'template:front-page': { nodeId: '1:2' },
        'pattern:testimonials': { nodeId: '1:3' },
        'pattern:ghost': { nodeId: '1:4' },
      },
    };
    const m = new ManifestBuilder(now).build(inv, nodes, true);
    expect(m.entries.map((e) => e.id)).toEqual(['part:header', 'template:front-page']);
    expect(m.skipped.length).toBeGreaterThan(5);
    expect(m.warnings).toEqual([
      'pattern:testimonials was cut from the inventory but has a Figma node (1:3). Archive the node or restore the item.',
      'pattern:ghost is in figma-nodes.json but not in the inventory.',
      'template:front-page changes layout at 390px but has no mobile frame.',
      "template:front-page has no built composition in figma-nodes.json; using the crawled order. Record the template frame's sections.",
    ]);
    const md = new ManifestBuilder(now).markdown(m);
    expect(md).toContain('## Not built yet');
    expect(md).toContain('## Warnings');
    expect(md).toContain('1. template-part `header`');
  });

  it('follows the built composition, numbering repeats and keeping overrides', () => {
    const inv = approved();
    const nodes = allNodes(inv);
    const front = inv.items.find((i) => i.id === 'template:front-page')!;
    const crawled = front.composition!;
    const repeated = crawled.find((id) => id.startsWith('pattern:'))!;
    nodes.nodes['template:front-page'].composition = [
      ...crawled.filter((id) => id !== repeated),
      { id: repeated, overrides: { heading: 'First' } },
      { id: repeated, overrides: { heading: 'Second' } },
      { id: repeated, overrides: {} },
    ];
    const builder = new ManifestBuilder(now);
    const m = builder.build(inv, nodes);
    const entry = m.entries.find((e) => e.id === 'template:front-page')!;
    const copies = entry.composition!.filter((c) => c.id === repeated);
    expect(copies.map((c) => c.instance)).toEqual([1, 2, 3]);
    expect(copies[0].overrides).toEqual({ heading: 'First' });
    expect(copies[2].overrides).toBeUndefined();
    expect(m.warnings).toEqual([
      `template:front-page: the Figma template has 3 × ${repeated}, the live page had ${crawled.filter((id) => id === repeated).length}. The manifest follows Figma; list the difference for the reviewer.`,
    ]);
    const md = builder.markdown(m);
    expect(md).toContain('(instance 1): heading "First"');
    expect(md).toContain('(instance 3)\n');
  });

  it('flags targets that already exist in the theme', () => {
    const inv = approved();
    const m = new ManifestBuilder(now).build(
      inv,
      allNodes(inv),
      false,
      (file) => file === 'parts/header.html'
    );
    const header = m.entries.find((e) => e.id === 'part:header')!;
    expect(header.wordpress.existsInTheme).toBe(true);
    expect(m.entries.find((e) => e.id === 'part:footer')!.wordpress.existsInTheme).toBeUndefined();
    expect(m.warnings).toEqual([
      'part:header: parts/header.html already exists in the theme. Pattern mode must replace or rename it, not reuse it as is.',
    ]);
    expect(new ManifestBuilder(now).markdown(m)).toContain('parts/header.html (exists)');
  });

  it('only requires nodes for items in the approved build scope', () => {
    const inv = new DecisionApplier().apply(approved(), { build: ['component:button'] });
    const m = new ManifestBuilder(now).build(inv, {
      fileKey: 'k',
      nodes: { 'component:button': { nodeId: '1:1' } },
    });
    expect(m.entries.map((e) => e.id)).toEqual(['component:button']);
    expect(m.skipped[0].reason).toBe('Outside the approved build scope.');
  });

  it('renders the Markdown table and composition', () => {
    const inv = approved();
    const builder = new ManifestBuilder(now);
    const m = builder.build(inv, allNodes(inv));
    const md = builder.markdown(m);
    expect(md).toContain('# Figma to WordPress manifest: www.example.com');
    expect(md).toMatch(
      /\| component \| Button \| \[100:\d+\]\(https:\/\/www\.figma\.com\/design\/abc123\/\?node-id=100-\d+\) \| core-block, core\/button, styles: outline \| {2}\|/
    );
    expect(md).toContain('(mobile 200:');
    expect(md).toContain('pattern:testimonials (local section, no pattern)');
    expect(md).not.toContain('## Not built yet');
    expect(builder.markdown({ ...m, inventoryApprovedAt: undefined, entries: [] })).toContain(
      'on an unknown date'
    );
  });
});

describe('runManifestCli', () => {
  function io(files: Record<string, string>) {
    const written: Record<string, string> = {};
    const out: string[] = [];
    const err: string[] = [];
    return {
      io: {
        readFile: (p: string) => files[p],
        writeFile: (p: string, c: string) => {
          written[p] = c;
        },
        stdout: (t: string) => void out.push(t),
        stderr: (t: string) => void err.push(t),
        now,
      },
      written,
      out,
      err,
    };
  }
  const inv = approved();
  const files = {
    'i.json': JSON.stringify(inv),
    'n.json': JSON.stringify(allNodes(inv)),
    'p.json': JSON.stringify({ fileKey: 'k', nodes: {} }),
  };

  it('writes the manifest and its Markdown', () => {
    const t = io(files);
    expect(
      runManifestCli(['i.json', '--nodes', 'n.json', '--out', 'm.json', '--markdown', 'm.md'], t.io)
    ).toBe(0);
    expect(JSON.parse(t.written['m.json']).entries.length).toBeGreaterThan(10);
    expect(t.written['m.md']).toContain('manifest');
    expect(t.out.join('')).toMatch(/entries, 0 not built, 0 warnings/);
  });

  it('checks targets against --theme-dir', () => {
    const t = io(files);
    const seen: string[] = [];
    const exists = (p: string) => {
      seen.push(p);
      return p === 'theme/parts/footer.html';
    };
    expect(
      runManifestCli(['i.json', '--nodes', 'n.json', '--theme-dir', 'theme'], { ...t.io, exists })
    ).toBe(0);
    expect(seen).toContain('theme/parts/header.html');
    expect(t.out.join('')).toMatch(/1 warnings/);
    const noFs = io(files);
    expect(runManifestCli(['i.json', '--nodes', 'n.json', '--theme-dir', 'theme'], noFs.io)).toBe(
      0
    );
    expect(noFs.out.join('')).toMatch(/0 warnings/);
  });

  it('accepts --partial and prints usage', () => {
    const t = io(files);
    expect(runManifestCli(['i.json', '--nodes', 'p.json', '--partial'], t.io)).toBe(0);
    expect(Object.keys(t.written)).toEqual(['manifest.json', 'manifest.md']);
    expect(runManifestCli(['-h'], t.io)).toBe(0);
    expect(t.out.join('')).toContain('Usage');
  });

  it('reports errors', () => {
    for (const argv of [
      ['i.json'],
      ['i.json', '--nodes'],
      ['i.json', '--nope', 'x'],
      ['i.json', '--nodes', 'p.json'],
    ]) {
      const t = io(files);
      expect(runManifestCli(argv, t.io)).toBe(1);
      expect(t.err.join('')).toMatch(/^write-manifest: /);
    }
  });
});
