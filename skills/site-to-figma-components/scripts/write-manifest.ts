/**
 * Writes the hand-off manifest that maps each Figma node built from an
 * approved inventory to its WordPress target: template file, template part,
 * pattern slug, block or block style. figma-to-block-theme's Pattern mode
 * reads the JSON; the Markdown is for people.
 *
 * Usage:
 *   npx tsx write-manifest.ts inventory.json --nodes figma-nodes.json \
 *     --out manifest.json --markdown manifest.md [--theme-dir ../my-theme] [--partial]
 *
 * figma-nodes.json is assembled from the IDs the use_figma build calls return:
 *   { "fileKey": "abc", "nodes": { "component:button": { "nodeId": "12:34", "page": "> Components" } } }
 * A template's ref can also carry `composition`, read from the built frame's
 * children, so the manifest follows what was built rather than the crawl.
 * --theme-dir flags targets that already exist in the theme.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Inventory, InventoryItem, Kind, WpTarget } from './propose-inventory';

export interface FigmaNodeRef {
  nodeId: string;
  /** The 390px frame, for templates and patterns whose layout changes on mobile. */
  mobileNodeId?: string;
  page?: string;
  /**
   * Templates only: the built frame's sections in order, each an inventory ID
   * or `{ id, overrides }` with the instance's changed text (for example its heading).
   */
  composition?: (string | BuiltSection)[];
}

export interface BuiltSection {
  id: string;
  overrides?: Record<string, string>;
}

export interface FigmaNodes {
  fileKey: string;
  nodes: Record<string, FigmaNodeRef>;
}

export interface CompositionEntry {
  id: string;
  /** `local` when the section was cut from the inventory and lives only inside the template frame. */
  target: 'template-part' | 'pattern' | 'local';
  slug?: string;
  file?: string;
  /** 1-based count when the same pattern appears more than once in the template. */
  instance?: number;
  /** Text that differs from the pattern's own content in this instance. */
  overrides?: Record<string, string>;
}

export interface ManifestEntry {
  id: string;
  kind: Kind;
  name: string;
  figma: {
    fileKey: string;
    nodeId: string;
    mobileNodeId?: string;
    name: string;
    page?: string;
    url: string;
  };
  wordpress: WpTarget & { existsInTheme?: boolean };
  variantProperties?: Record<string, string[]>;
  composition?: CompositionEntry[];
  sourcePages: string[];
}

export interface Manifest {
  manifestVersion: 1;
  site: string;
  theme: string;
  figmaFileKey: string;
  inventoryApprovedAt?: string;
  generatedAt: string;
  entries: ManifestEntry[];
  skipped: { id: string; reason: string }[];
  warnings: string[];
}

const NODE_ID = /^\d+:\d+$/;
const ORDER: Kind[] = ['component', 'template-part', 'pattern', 'template'];

export class ManifestBuilder {
  constructor(private readonly now: () => Date = () => new Date()) {}

  build(
    inventory: Inventory,
    figma: FigmaNodes,
    partial = false,
    existsInTheme?: (file: string) => boolean
  ): Manifest {
    if (!inventory.approved) {
      throw new Error(
        'The inventory is not approved. Apply the reviewer decisions with "approve": true first.'
      );
    }
    if (!figma.fileKey) {
      throw new Error('figma-nodes.json needs the Figma fileKey.');
    }
    const live = inventory.items.filter((i) => i.status !== 'cut');
    const byId = new Map(inventory.items.map((i) => [i.id, i]));
    const errors: string[] = [];
    const warnings: string[] = [];
    const skipped: { id: string; reason: string }[] = [];

    for (const [id, ref] of Object.entries(figma.nodes)) {
      if (!byId.has(id)) {
        warnings.push(`${id} is in figma-nodes.json but not in the inventory.`);
      } else if (byId.get(id)!.status === 'cut') {
        warnings.push(
          `${id} was cut from the inventory but has a Figma node (${ref.nodeId}). Archive the node or restore the item.`
        );
      }
      for (const nodeId of [ref.nodeId, ref.mobileNodeId].filter(
        (n): n is string => n !== undefined
      )) {
        if (!NODE_ID.test(nodeId)) {
          errors.push(`${id} has an invalid node ID "${nodeId}"; expected the form 123:456.`);
        }
      }
      for (const section of ref.composition ?? []) {
        const sectionId = typeof section === 'string' ? section : section.id;
        if (!byId.has(sectionId)) {
          errors.push(
            `${id}: unresolved composition section ${sectionId}. Resolve it to an inventory item before writing the manifest.`
          );
        }
      }
    }

    const entries: ManifestEntry[] = [];
    const scope = inventory.buildScope ? new Set(inventory.buildScope) : undefined;
    for (const item of live) {
      const ref = figma.nodes[item.id];
      if (!ref && scope && !scope.has(item.id)) {
        skipped.push({ id: item.id, reason: 'Outside the approved build scope.' });
        continue;
      }
      if (!ref) {
        if (partial) {
          skipped.push({ id: item.id, reason: 'Not built in Figma yet.' });
        } else {
          errors.push(`${item.id} has no Figma node. Build it, cut it, or pass --partial.`);
        }
        continue;
      }
      if (item.kind === 'template' && item.mobileLayoutChanges && !ref.mobileNodeId) {
        warnings.push(`${item.id} changes layout at 390px but has no mobile frame.`);
      }
      const entry = this.entry(item, ref, figma.fileKey, byId, warnings);
      if (existsInTheme && entry.wordpress.file && existsInTheme(entry.wordpress.file)) {
        entry.wordpress.existsInTheme = true;
        warnings.push(
          `${item.id}: ${entry.wordpress.file} already exists in the theme. Pattern mode must replace or rename it, not reuse it as is.`
        );
      }
      entries.push(entry);
    }
    if (errors.length) {
      throw new Error(errors.join('\n'));
    }
    entries.sort(
      (a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind) || a.name.localeCompare(b.name)
    );

    return {
      manifestVersion: 1,
      site: inventory.site,
      theme: inventory.theme,
      figmaFileKey: figma.fileKey,
      inventoryApprovedAt: inventory.approvedAt,
      generatedAt: this.now().toISOString(),
      entries,
      skipped,
      warnings,
    };
  }

  private entry(
    item: InventoryItem,
    ref: FigmaNodeRef,
    fileKey: string,
    byId: Map<string, InventoryItem>,
    warnings: string[]
  ): ManifestEntry {
    const entry: ManifestEntry = {
      id: item.id,
      kind: item.kind,
      name: item.name,
      figma: {
        fileKey,
        nodeId: ref.nodeId,
        name: item.figmaName,
        url: `https://www.figma.com/design/${fileKey}/?node-id=${ref.nodeId.replace(':', '-')}`,
      },
      wordpress: { ...item.wordpress },
      sourcePages: item.pages,
    };
    if (ref.mobileNodeId) {
      entry.figma.mobileNodeId = ref.mobileNodeId;
    }
    if (ref.page) {
      entry.figma.page = ref.page;
    }
    if (Object.keys(item.variantProperties).length) {
      entry.variantProperties = item.variantProperties;
    }
    const sections = this.sections(item, ref, warnings);
    if (sections) {
      const seen = new Map<string, number>();
      const totals = new Map<string, number>();
      for (const s of sections) {
        totals.set(s.id, (totals.get(s.id) ?? 0) + 1);
      }
      entry.composition = sections.map(({ id, overrides }) => {
        // An unknown ID is already an error, and build() throws before returning.
        const part = byId.get(id);
        const out: CompositionEntry =
          !part || part.status === 'cut'
            ? { id, target: 'local' }
            : {
                id,
                target: part.kind === 'template-part' ? 'template-part' : 'pattern',
                slug: part.wordpress.slug,
                file: part.wordpress.file,
              };
        if (totals.get(id)! > 1) {
          seen.set(id, (seen.get(id) ?? 0) + 1);
          out.instance = seen.get(id);
        }
        if (overrides && Object.keys(overrides).length) {
          out.overrides = overrides;
        }
        return out;
      });
    }
    return entry;
  }

  /** The built composition when Figma recorded one, otherwise the crawled one. */
  private sections(
    item: InventoryItem,
    ref: FigmaNodeRef,
    warnings: string[]
  ): BuiltSection[] | undefined {
    const crawled = item.composition?.map((id) => ({ id }));
    if (!ref.composition) {
      if (crawled && item.kind === 'template') {
        warnings.push(
          `${item.id} has no built composition in figma-nodes.json; using the crawled order. Record the template frame's sections.`
        );
      }
      return crawled;
    }
    const built = ref.composition.map((s) => (typeof s === 'string' ? { id: s } : s));
    const count = (list: BuiltSection[]) =>
      list.reduce((m, s) => m.set(s.id, (m.get(s.id) ?? 0) + 1), new Map<string, number>());
    const want = count(crawled ?? []);
    const have = count(built);
    let countsDiffer = false;
    for (const id of new Set([...want.keys(), ...have.keys()])) {
      const w = want.get(id) ?? 0;
      const h = have.get(id) ?? 0;
      if (w !== h) {
        countsDiffer = true;
        warnings.push(
          `${item.id}: the Figma template has ${h} × ${id}, the live page had ${w}. The manifest follows Figma; list the difference for the reviewer.`
        );
      }
    }
    if (!countsDiffer && crawled && crawled.some((s, n) => s.id !== built[n].id)) {
      warnings.push(
        `${item.id}: the Figma section order differs from the live page. The manifest follows Figma; list the difference for the reviewer.`
      );
    }
    return built;
  }

  markdown(m: Manifest): string {
    const lines = [
      `# Figma to WordPress manifest: ${new URL(m.site).host}`,
      '',
      `Theme \`${m.theme}\`, Figma file \`${m.figmaFileKey}\`. Generated ${m.generatedAt.slice(0, 10)} from the inventory approved ${m.inventoryApprovedAt?.slice(0, 10) ?? 'on an unknown date'}.`,
      '',
      '| Kind | Name | Figma node | WordPress target | File |',
      '| --- | --- | --- | --- | --- |',
      ...m.entries.map((e) => {
        const target = [
          e.wordpress.type,
          e.wordpress.block,
          e.wordpress.slug,
          e.wordpress.styles?.length ? `styles: ${e.wordpress.styles.join(', ')}` : '',
        ]
          .filter(Boolean)
          .join(', ');
        const node = `[${e.figma.nodeId}](${e.figma.url})${e.figma.mobileNodeId ? ` (mobile ${e.figma.mobileNodeId})` : ''}`;
        const file = `${e.wordpress.file ?? ''}${e.wordpress.existsInTheme ? ' (exists)' : ''}`;
        return `| ${e.kind} | ${e.name} | ${node} | ${target} | ${file} |`;
      }),
      '',
    ];
    const templates = m.entries.filter((e) => e.composition);
    if (templates.length) {
      lines.push('## Template composition', '');
      for (const t of templates) {
        lines.push(`### ${t.name} (\`${t.wordpress.file}\`)`, '');
        lines.push(
          ...t.composition!.map((c, n) => {
            const what =
              c.target === 'local'
                ? `${c.id} (local section, no pattern)`
                : `${c.target} \`${c.slug}\`${c.instance ? ` (instance ${c.instance})` : ''}`;
            const text = c.overrides
              ? `: ${Object.entries(c.overrides)
                  .map(([k, v]) => `${k} "${v}"`)
                  .join(', ')}`
              : '';
            return `${n + 1}. ${what}${text}`;
          }),
          ''
        );
      }
    }
    if (m.skipped.length) {
      lines.push('## Not built yet', '', ...m.skipped.map((s) => `- ${s.id}: ${s.reason}`), '');
    }
    if (m.warnings.length) {
      lines.push('## Warnings', '', ...m.warnings.map((w) => `- ${w}`), '');
    }
    return `${lines.join('\n')}\n`;
  }
}

export interface ManifestCliIo {
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
  now?: () => Date;
  exists?: (path: string) => boolean;
}

export function runManifestCli(argv: string[], io: ManifestCliIo): number {
  const values: Record<string, string> = { out: 'manifest.json', markdown: 'manifest.md' };
  let input: string | undefined;
  let nodes: string | undefined;
  let themeDir: string | undefined;
  let partial = false;
  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      if (arg === '--help' || arg === '-h') {
        io.stdout(
          'Usage: write-manifest inventory.json --nodes figma-nodes.json [--out manifest.json] [--markdown manifest.md] [--theme-dir path] [--partial]\n'
        );
        return 0;
      }
      if (arg === '--partial') {
        partial = true;
        continue;
      }
      if (!arg.startsWith('--')) {
        input = arg;
        continue;
      }
      const key = arg.slice(2);
      if (key !== 'nodes' && key !== 'theme-dir' && !(key in values)) {
        throw new Error(`Unknown argument ${arg}.`);
      }
      const value = argv[++i];
      if (value === undefined) {
        throw new Error(`${arg} needs a value.`);
      }
      if (key === 'nodes') {
        nodes = value;
      } else if (key === 'theme-dir') {
        themeDir = value;
      } else {
        values[key] = value;
      }
    }
    if (!input || !nodes) {
      throw new Error('Pass the approved inventory.json and --nodes figma-nodes.json.');
    }
    const builder = new ManifestBuilder(io.now);
    const manifest = builder.build(
      JSON.parse(io.readFile(input)) as Inventory,
      JSON.parse(io.readFile(nodes)) as FigmaNodes,
      partial,
      themeDir && io.exists ? (file) => io.exists!(join(themeDir!, file)) : undefined
    );
    io.writeFile(values.out, `${JSON.stringify(manifest, null, 2)}\n`);
    io.writeFile(values.markdown, builder.markdown(manifest));
    io.stdout(
      `${manifest.entries.length} entries, ${manifest.skipped.length} not built, ${manifest.warnings.length} warnings. Wrote ${values.out} and ${values.markdown}.\n`
    );
    return 0;
  } catch (error) {
    io.stderr(`write-manifest: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runManifestCli(process.argv.slice(2), {
    readFile: (path) => readFileSync(path, 'utf8'),
    writeFile: (path, content) => writeFileSync(path, content),
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
    exists: existsSync,
  });
}
