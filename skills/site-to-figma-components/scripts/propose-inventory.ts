/**
 * Turns a site structure crawl into a component inventory for review:
 * template parts, patterns, components (with variant properties and states)
 * and templates, each mapped to its WordPress target and bound to the
 * project's Figma variables. Writes the inventory JSON and a Markdown
 * approval report. Reviewer decisions (rename, cut, merge, promote, approve)
 * are applied from a decisions file on the next run.
 *
 * Usage:
 *   npx tsx propose-inventory.ts site-structure.json --tokens variables.json \
 *     --theme tsp-theme --out inventory.json --report inventory.md [--decisions decisions.json]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import type {
  Hint,
  PageStructure,
  SiteStructure,
  StructureNode,
  StyleSig,
} from './crawl-site-structure';
import { Colour } from './lib/color';
import { ColourRole, SizeFamily, TokenIndex, TokenMatch, VariablesExport } from './lib/tokens';

export type Kind = 'component' | 'pattern' | 'template-part' | 'template';

export interface Example {
  url: string;
  viewport: number;
  selector: string;
  label: string;
}

export interface WpTarget {
  type:
    | 'core-block'
    | 'block-style'
    | 'element-style'
    | 'pattern'
    | 'template-part'
    | 'template'
    | 'custom-block'
    | 'plugin-block';
  block?: string;
  slug?: string;
  file?: string;
  area?: string;
  styles?: string[];
  note?: string;
}

export interface Binding {
  property: string;
  value: string;
  variable?: string;
  codeSyntax?: string;
  match: 'exact' | 'near' | 'primitive' | 'none';
  /** For a size with no match: the ramp steps either side. */
  between?: string[];
}

export interface Variant {
  name: string;
  properties: Record<string, string>;
  count: number;
  example: Example;
  style: StyleSig;
  bindings: Binding[];
}

export interface Content {
  headings: string[];
  buttons: string[];
  images: { src: string; alt: string }[];
  text?: string;
}

export interface InventoryItem {
  id: string;
  kind: Kind;
  name: string;
  /** Figma layer name, following the TSP file: `Components/Buttons/Button`. */
  figmaName: string;
  hint?: Hint;
  count: number;
  pages: string[];
  templates: string[];
  examples: Example[];
  variantProperties: Record<string, string[]>;
  variants: Variant[];
  wordpress: WpTarget;
  content: Content;
  /** The 390px layout differs enough to need its own frame. */
  mobileLayoutChanges?: boolean;
  /** Region pieces that make up a template part, top to bottom. */
  pieces?: string[];
  /** Item ids for templates: what the template is built from, top to bottom. */
  composition?: string[];
  /** Near duplicates the reviewer may merge into this item. */
  mergeWith?: string[];
  oneOff?: boolean;
  status: 'proposed' | 'cut';
  /** A class name that helps recognise the item on the site. */
  aka?: string;
}

export interface UnboundValue {
  property: string;
  value: string;
  match: Binding['match'];
  nearest?: string;
  items: string[];
  /** What to add or change so the value binds, for the reviewer to approve. */
  proposal: string;
}

export interface Inventory {
  site: string;
  capturedAt: string;
  theme: string;
  tokensLoaded: boolean;
  pages: { url: string; template: string; screenshots: string[] }[];
  /** Requested pages that redirected to a page already crawled, and were left out. */
  redirects: { from: string; to: string }[];
  /** Page views the crawler could not capture. */
  failures: { url: string; viewport: number; error: string }[];
  items: InventoryItem[];
  unbound: UnboundValue[];
  decisions: string[];
  approved: boolean;
  approvedAt?: string;
  /** Item ids the reviewer approved for the Figma build: chosen items and templates with everything they are built from. */
  buildScope?: string[];
}

export interface Decisions {
  rename?: Record<string, string>;
  cut?: string[];
  merge?: [string, string][];
  promote?: string[];
  /** Templates and items to build in Figma. Templates bring their parts and patterns with them. */
  build?: string[];
  approve?: boolean;
}

const COMPONENT_HINTS: Hint[] = [
  'button',
  'link',
  'input',
  'card',
  'badge',
  'nav-item',
  'breadcrumbs',
  'pagination',
  'accordion',
  'tabs',
  'slider',
  'form',
];
/** Hints that form one component family each; cards and forms cluster by shape instead. */
const FAMILY_HINTS: Hint[] = [
  'button',
  'link',
  'input',
  'badge',
  'nav-item',
  'breadcrumbs',
  'pagination',
  'accordion',
  'tabs',
  'slider',
];

const FAMILY: Record<string, { name: string; group: string }> = {
  button: { name: 'Button', group: 'Buttons' },
  link: { name: 'Text Link', group: 'Links' },
  input: { name: 'Input Field', group: 'Forms & Inputs' },
  badge: { name: 'Badge', group: 'Badges' },
  'nav-item': { name: 'Nav Item', group: 'Navigation' },
  breadcrumbs: { name: 'Breadcrumbs', group: 'Navigation' },
  pagination: { name: 'Pagination', group: 'Navigation' },
  accordion: { name: 'Accordion', group: 'Accordions' },
  tabs: { name: 'Tabs', group: 'Tabs' },
  slider: { name: 'Slider', group: 'Sliders' },
  card: { name: 'Card', group: 'Cards' },
  form: { name: 'Form', group: 'Forms & Inputs' },
};

const PATTERN_BLOCK: Record<string, string> = {
  Hero: 'core/cover',
  Banner: 'core/cover',
  'Call to Action': 'core/group',
  'Card Grid': 'core/query',
  Testimonials: 'core/quote',
  Gallery: 'core/gallery',
  'Media and Text': 'core/media-text',
  'Feature Row': 'core/columns',
  'Form Section': 'core/group',
  'Section Heading': 'core/heading',
  'Content Section': 'core/group',
};

export const kebab = (text: string): string =>
  text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const title = (text: string): string =>
  text
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

export class TemplateClassifier {
  /** Maps WordPress body classes (or, failing that, the URL) to a block theme template slug. */
  static classify(bodyClasses: string[], url: string): { slug: string; name: string } {
    const has = (c: string) => bodyClasses.includes(c);
    const find = (prefix: string) =>
      bodyClasses.find((c) => c.startsWith(prefix))?.slice(prefix.length);
    let slug: string | undefined;
    if (has('error404')) {
      slug = '404';
    } else if (has('search') || has('search-results') || has('search-no-results')) {
      slug = 'search';
    } else if (has('home') && has('blog')) {
      slug = 'home';
    } else if (has('home')) {
      slug = 'front-page';
    } else if (has('blog')) {
      slug = 'home';
    } else if (find('post-type-archive-')) {
      slug = `archive-${find('post-type-archive-')}`;
    } else if (find('tax-')) {
      slug = `taxonomy-${find('tax-')}`;
    } else if (has('category') || has('tag') || has('author')) {
      slug = ['category', 'tag', 'author'].find(has)!;
    } else if (has('page') && find('page-template-') && find('page-template-') !== 'default') {
      slug = find('page-template-')!
        .replace(/(-php|-html)$/, '')
        .replace(/^templates?-/, '');
    } else if (has('archive')) {
      slug = 'archive';
    } else if (has('single') || has('single-post')) {
      // WordPress adds `{post_type}-template-default`; plugins may add other single-* classes.
      const type = bodyClasses
        .map((c) => c.match(/^([a-z0-9_-]+)-template(-default)?$/)?.[1])
        .find((t) => t && t !== 'page');
      slug = !type || type === 'post' ? 'single' : `single-${type}`;
    } else if (has('page')) {
      slug = 'page';
    }
    if (!slug) {
      const path = new URL(url).pathname;
      slug = path === '/' ? 'front-page' : 'index';
    }
    return { slug, name: TemplateClassifier.nameOf(slug) };
  }

  static nameOf(slug: string): string {
    const archive = slug.match(/^archive-(.+)$/);
    if (archive) {
      return `${title(archive[1])} Archive`;
    }
    const tax = slug.match(/^taxonomy-(.+)$/);
    if (tax) {
      return `${title(tax[1])} Taxonomy`;
    }
    const single = slug.match(/^single-(.+)$/);
    if (single) {
      return `Single ${title(single[1])}`;
    }
    return (
      { 'front-page': 'Front Page', home: 'Blog Home', single: 'Single Post', '404': '404' }[
        slug
      ] ?? title(slug)
    );
  }
}

export class StyleBinder {
  constructor(private readonly tokens: TokenIndex) {}

  /** Binds every styled value of a node to a variable, recording what could not be bound. */
  bind(style: StyleSig, kind: Kind, hint?: Hint): Binding[] {
    const out: Binding[] = [];
    const action = hint === 'button';
    const colour = (property: string, value: string | undefined, role: ColourRole) => {
      if (!value || !Colour.parse(value)) {
        return;
      }
      out.push(
        this.result(
          property,
          Colour.hex(Colour.parse(value)!),
          this.tokens.colour(value, role, action)
        )
      );
    };
    const length = (property: string, value: number | undefined, family: SizeFamily) => {
      if (value === undefined || value <= 0) {
        return;
      }
      const binding = this.result(
        property,
        `${Math.round(value * 100) / 100}px`,
        this.tokens.length(value, family)
      );
      if (binding.match === 'none') {
        const { below, above } = this.tokens.neighbours(value, family);
        binding.between = [below, above].filter((n): n is string => !!n);
      }
      out.push(binding);
    };
    colour('fill', style.background, 'fill');
    if (kind !== 'pattern' && kind !== 'template-part') {
      colour('text', style.color, 'text');
      if (style.fontFamily) {
        out.push(this.result('fontFamily', style.fontFamily, this.tokens.font(style.fontFamily)));
      }
      length('fontSize', style.fontSize, 'font-size');
    }
    colour('stroke', style.border, 'stroke');
    length('radius', style.radius, 'radius');
    length('paddingBlock', style.paddingBlock, 'spacing');
    length('paddingInline', style.paddingInline, 'spacing');
    length('gap', style.gap, 'spacing');
    if (style.shadow) {
      out.push(this.result('effect', style.shadow, this.tokens.shadow(style.shadow)));
    }
    return out;
  }

  private result(property: string, value: string, match: TokenMatch | undefined): Binding {
    if (!match) {
      return { property, value, match: 'none' };
    }
    return {
      property,
      value,
      variable: match.variable,
      codeSyntax: match.codeSyntax,
      match: match.semantic ? match.match : 'primitive',
    };
  }
}

interface Located {
  page: PageStructure;
  node: StructureNode;
}

export class InventoryProposer {
  private readonly binder: StyleBinder;

  constructor(
    private readonly tokens: TokenIndex,
    private readonly theme: string
  ) {
    this.binder = new StyleBinder(tokens);
  }

  propose(structure: SiteStructure): Inventory {
    const desktopWidth = Math.max(...structure.viewports);
    const mobileWidth = Math.min(...structure.viewports);
    const { kept: desktop, redirects } = InventoryProposer.dedupe(
      structure.pages.filter((p) => p.viewport === desktopWidth)
    );
    const mobileByUrl = new Map(
      structure.pages
        .filter((p) => p.viewport === mobileWidth && mobileWidth !== desktopWidth)
        .map((p) => [p.url, p])
    );
    const templateOf = new Map(
      desktop.map((p) => [p.url, TemplateClassifier.classify(p.bodyClasses, p.url)])
    );
    const mobileOf = ({ page, node }: Located) =>
      mobileByUrl.get(page.url)?.nodes.find((n) => n.selector === node.selector);

    const items: InventoryItem[] = [
      ...this.parts(desktop, templateOf, mobileOf),
      ...this.components(desktop, templateOf, mobileOf),
    ];
    const { patterns, sectionOwner } = this.patterns(desktop, templateOf, mobileOf, items);
    items.push(...patterns);
    items.push(...this.templates(desktop, templateOf, sectionOwner, items));

    return {
      site: structure.site,
      capturedAt: structure.capturedAt,
      theme: this.theme,
      tokensLoaded: this.tokens.size > 0,
      pages: desktop.map((p) => ({
        url: p.url,
        template: templateOf.get(p.url)!.slug,
        screenshots: structure.pages
          .filter((q) => q.url === p.url && q.screenshot)
          .map((q) => q.screenshot!),
      })),
      redirects,
      failures: structure.failures ?? [],
      items,
      unbound: InventoryProposer.unbound(items),
      decisions: [],
      approved: false,
    };
  }

  /** Keeps the first capture of each final URL, so redirects don't count as extra pages. */
  static dedupe(pages: PageStructure[]): {
    kept: PageStructure[];
    redirects: { from: string; to: string }[];
  } {
    const norm = (u: string) => u.replace(/#.*$/, '').replace(/\/(\?|$)/, '$1');
    const keptUrls = new Set(pages.map((p) => norm(p.url)));
    const kept: PageStructure[] = [];
    const redirects: { from: string; to: string }[] = [];
    const finals = new Set<string>();
    for (const page of pages) {
      const final = norm(page.finalUrl ?? page.url);
      const moved = final !== norm(page.url);
      if (moved && (keptUrls.has(final) || finals.has(final))) {
        redirects.push({ from: page.url, to: page.finalUrl! });
        continue;
      }
      finals.add(final);
      kept.push(page);
    }
    return { kept, redirects };
  }

  private parts(
    pages: PageStructure[],
    templateOf: Map<string, { slug: string }>,
    mobileOf: (l: Located) => StructureNode | undefined
  ): InventoryItem[] {
    const out: InventoryItem[] = [];
    for (const hint of ['header', 'footer', 'sidebar'] as Hint[]) {
      const found = pages
        .map((page) => ({ page, nodes: page.nodes.filter((n) => n.hint === hint) }))
        .filter((f) => f.nodes.length);
      if (!found.length) {
        continue;
      }
      const presence = found.length / pages.length;
      const name = title(hint);
      const located = found.map((f) => ({ page: f.page, node: f.nodes[0] }));
      const modeOf = (l: Located) => InventoryProposer.mode(l.node.style);
      const variants = this.variantsOf(located, (l) => ({ Mode: modeOf(l) }), 'template-part');
      const changes = located.some((l) => {
        const m = mobileOf(l);
        return !!m && (m.shape !== l.node.shape || m.columns !== l.node.columns);
      });
      const properties = InventoryProposer.properties(
        variants,
        changes ? { Breakpoint: ['Desktop', 'Mobile'] } : {}
      );
      const slug = kebab(hint);
      out.push({
        id: `part:${slug}`,
        kind: 'template-part',
        name,
        figmaName: `Template Parts/${name}`,
        hint,
        count: found.length,
        pages: found.map((f) => f.page.url),
        templates: [...new Set(found.map((f) => templateOf.get(f.page.url)!.slug))],
        examples: located.slice(0, 3).map((l) => InventoryProposer.example(l)),
        variantProperties: properties,
        variants,
        wordpress: {
          type: 'template-part',
          slug,
          area: hint === 'sidebar' ? 'uncategorized' : hint,
          file: `parts/${slug}.html`,
        },
        content: InventoryProposer.content(found[0].nodes),
        mobileLayoutChanges: changes,
        pieces: found[0].nodes.map((n) => n.label),
        oneOff: hint !== 'sidebar' ? presence < 0.6 : found.length < 2,
        status: 'proposed',
      });
    }
    return out;
  }

  private components(
    pages: PageStructure[],
    templateOf: Map<string, { slug: string }>,
    mobileOf: (l: Located) => StructureNode | undefined
  ): InventoryItem[] {
    const located: Located[] = pages.flatMap((page) =>
      page.nodes.filter((n) => COMPONENT_HINTS.includes(n.hint)).map((node) => ({ page, node }))
    );
    const cardClass = InventoryProposer.distinctiveClasses(
      located.filter((l) => l.node.hint === 'card').map((l) => l.node)
    );
    const groups = new Map<string, Located[]>();
    for (const l of located) {
      const { hint, label } = l.node;
      const key = FAMILY_HINTS.includes(hint)
        ? hint
        : hint === 'card'
          ? `card:${cardClass.get(l.node) ?? InventoryProposer.truncateShape(l.node.shape, 2)}`
          : `form:${/search/i.test(label + l.node.shape) ? 'search' : 'form'}`;
      groups.set(key, [...(groups.get(key) ?? []), l]);
    }

    const out: InventoryItem[] = [];
    const taken = new Set<string>();
    const membersOf = new Map<string, Located[]>();
    for (const members of groups.values()) {
      const hint = members[0].node.hint;
      const family = FAMILY[hint];
      const aka = hint === 'card' ? cardClass.get(members[0].node) : undefined;
      let name = family.name;
      if (hint === 'card' && aka) {
        const stem = aka
          .replace(/^(lsx|wp|wc|tour-operator|to)-/, '')
          .replace(/-?(card|item|wrap|post|slot)s?$/, '');
        name = stem ? `${title(stem)} Card` : 'Card';
      } else if (hint === 'form') {
        name = /search/i.test(members[0].node.label + members[0].node.shape)
          ? 'Search Form'
          : 'Form';
      }
      name = InventoryProposer.unique(name, taken);
      const layouts = [
        ...new Set(members.map((m) => InventoryProposer.truncateShape(m.node.shape, 2))),
      ];
      const variants = this.variantsOf(
        members,
        (l) => ({
          ...InventoryProposer.componentProps(l.node),
          Layout:
            hint === 'card' && layouts.length > 1
              ? String.fromCharCode(
                  65 + layouts.indexOf(InventoryProposer.truncateShape(l.node.shape, 2))
                )
              : undefined,
        }),
        'component'
      );
      const extra: Record<string, string[]> = {};
      const states = InventoryProposer.states(members.map((m) => m.node));
      if (states.length > 1) {
        extra.State = states;
      }
      const breakpoint = members.some((l) => {
        const m = mobileOf(l);
        const d = (a?: number, b?: number) => Math.abs((a ?? 0) - (b ?? 0)) > 2;
        return (
          !!m &&
          (d(m.style.fontSize, l.node.style.fontSize) ||
            d(m.style.paddingBlock, l.node.style.paddingBlock) ||
            m.columns !== l.node.columns)
        );
      });
      if (breakpoint) {
        extra.Breakpoint = ['Desktop', 'Mobile'];
      }
      const id = `component:${kebab(name)}`;
      membersOf.set(id, members);
      out.push({
        id,
        kind: 'component',
        name,
        figmaName: `Components/${family.group}/${name}`,
        hint,
        count: members.length,
        pages: [...new Set(members.map((m) => m.page.url))],
        templates: [...new Set(members.map((m) => templateOf.get(m.page.url)!.slug))],
        examples: InventoryProposer.examplesOf(members),
        variantProperties: InventoryProposer.properties(variants, extra),
        variants,
        wordpress: this.componentTarget(hint, name, variants, members[0].node),
        content: InventoryProposer.content(members.map((m) => m.node)),
        mobileLayoutChanges: breakpoint,
        oneOff: members.length === 1,
        status: 'proposed',
        aka,
      });
    }
    InventoryProposer.nearDuplicates(
      out.filter((i) => i.hint === 'card' || i.hint === 'form'),
      membersOf
    );
    return out;
  }

  private patterns(
    pages: PageStructure[],
    templateOf: Map<string, { slug: string }>,
    mobileOf: (l: Located) => StructureNode | undefined,
    existing: InventoryItem[]
  ): { patterns: InventoryItem[]; sectionOwner: Map<string, string> } {
    const groups = new Map<string, Located[]>();
    for (const page of pages) {
      const sections = page.nodes
        .filter((n) => n.hint === 'section')
        .sort((a, b) => a.rect.y - b.rect.y);
      for (const node of sections) {
        groups.set(node.shape, [...(groups.get(node.shape) ?? []), { page, node }]);
      }
    }
    const taken = new Set(existing.map((i) => i.name));
    const patterns: InventoryItem[] = [];
    const sectionOwner = new Map<string, string>();
    const shapeGroups = new Map<string, Located[]>();
    for (const members of groups.values()) {
      const first = members[0];
      const base = InventoryProposer.patternName(first);
      const name = InventoryProposer.unique(base, taken);
      const changes = members.some((l) => {
        const m = mobileOf(l);
        return !!m && l.node.columns > 1 && m.columns < l.node.columns;
      });
      const variants = this.variantsOf(
        members,
        (l) => ({ Mode: InventoryProposer.mode(l.node.style) }),
        'pattern'
      );
      const slug = kebab(name);
      const id = `pattern:${slug}`;
      members.forEach((m) => sectionOwner.set(`${m.page.url}|${m.node.selector}`, id));
      shapeGroups.set(id, members);
      patterns.push({
        id,
        kind: 'pattern',
        name,
        figmaName: `Patterns/${name}`,
        hint: 'section',
        count: members.length,
        pages: [...new Set(members.map((m) => m.page.url))],
        templates: [...new Set(members.map((m) => templateOf.get(m.page.url)!.slug))],
        examples: InventoryProposer.examplesOf(members),
        variantProperties: InventoryProposer.properties(
          variants,
          changes ? { Breakpoint: ['Desktop', 'Mobile'] } : {}
        ),
        variants,
        wordpress: {
          type: 'pattern',
          block: PATTERN_BLOCK[base.replace(/ \d+$/, '')] ?? 'core/group',
          slug: `${this.theme}/${slug}`,
          file: `patterns/${slug}.php`,
        },
        content: InventoryProposer.content(members.map((m) => m.node)),
        mobileLayoutChanges: changes,
        oneOff: members.length === 1,
        status: 'proposed',
        aka: InventoryProposer.distinctiveClass(first.node),
      });
    }
    InventoryProposer.nearDuplicates(patterns, shapeGroups);
    return { patterns, sectionOwner };
  }

  private templates(
    pages: PageStructure[],
    templateOf: Map<string, { slug: string; name: string }>,
    sectionOwner: Map<string, string>,
    items: InventoryItem[]
  ): InventoryItem[] {
    const bySlug = new Map<string, PageStructure[]>();
    for (const page of pages) {
      const slug = templateOf.get(page.url)!.slug;
      bySlug.set(slug, [...(bySlug.get(slug) ?? []), page]);
    }
    const byId = new Map(items.map((i) => [i.id, i]));
    const out: InventoryItem[] = [];
    for (const [slug, group] of bySlug) {
      const page = group[0];
      const ordered = page.nodes
        .filter((n) => ['header', 'footer', 'sidebar', 'section'].includes(n.hint))
        .sort((a, b) => a.rect.y - b.rect.y);
      const composition: string[] = [];
      for (const node of ordered) {
        const id =
          node.hint === 'section'
            ? sectionOwner.get(`${page.url}|${node.selector}`)
            : `part:${node.hint}`;
        // Repeated sections are separate instances (a home page can stack five card grids); parts appear once.
        if (id && byId.has(id) && !(id.startsWith('part:') && composition.includes(id))) {
          composition.push(id);
        }
      }
      const name = templateOf.get(page.url)!.name;
      out.push({
        id: `template:${slug}`,
        kind: 'template',
        name,
        figmaName: `Templates/${name}`,
        count: group.length,
        pages: group.map((p) => p.url),
        templates: [slug],
        examples: [{ url: page.url, viewport: page.viewport, selector: 'body', label: page.title }],
        variantProperties: {},
        variants: [],
        wordpress: { type: 'template', slug, file: `templates/${slug}.html` },
        content: { headings: [page.title], buttons: [], images: [] },
        mobileLayoutChanges: composition.some((id) => byId.get(id)?.mobileLayoutChanges),
        composition,
        status: 'proposed',
      });
    }
    return out;
  }

  private componentTarget(
    hint: Hint,
    name: string,
    variants: Variant[],
    node: StructureNode
  ): WpTarget {
    const styles = [
      ...new Set(variants.map((v) => v.properties.Style).filter((s) => s && s !== 'Fill')),
    ].map(kebab);
    switch (hint) {
      case 'button':
        return {
          type: 'core-block',
          block: 'core/button',
          styles,
          note: styles.length
            ? `Non-default styles become block styles: ${styles.map((s) => `styles/blocks/button/${s}.json`).join(', ')}.`
            : undefined,
        };
      case 'link':
        return {
          type: 'element-style',
          block: 'core/paragraph',
          note: 'theme.json styles.elements.link, with :hover and :focus.',
        };
      case 'input':
        return {
          type: 'plugin-block',
          note: 'Form plugin field. Style it through the plugin or the theme stylesheet; core/search for search inputs.',
        };
      case 'form':
        return /search/i.test(name)
          ? { type: 'core-block', block: 'core/search' }
          : { type: 'plugin-block', note: `Form plugin block (${node.label}).` };
      case 'card':
        return {
          type: 'pattern',
          block: 'core/group',
          slug: `${this.theme}/${kebab(name)}`,
          file: `patterns/${kebab(name)}.php`,
          note: 'Card layout inside core/post-template (Query Loop), as an Inserter: false pattern.',
        };
      case 'badge':
        return {
          type: 'block-style',
          block: 'core/post-terms',
          styles: ['badge'],
          note: 'styles/blocks/post-terms/badge.json',
        };
      case 'nav-item':
        return { type: 'core-block', block: 'core/navigation-link' };
      case 'pagination':
        return { type: 'core-block', block: 'core/query-pagination' };
      case 'accordion':
        return {
          type: 'core-block',
          block: 'core/details',
          note: 'Or core/accordion where the WordPress version has it.',
        };
      case 'breadcrumbs':
        return {
          type: 'custom-block',
          note: 'No core block: the SEO plugin breadcrumbs block or a custom block.',
        };
      default:
        return { type: 'custom-block', note: `No core ${hint} block: a custom or plugin block.` };
    }
  }

  private variantsOf(
    members: Located[],
    propsOf: (l: Located) => Record<string, string | undefined>,
    kind: Kind
  ): Variant[] {
    const byName = new Map<string, Variant>();
    for (const l of members) {
      const properties = Object.fromEntries(
        Object.entries(propsOf(l)).filter(([, v]) => v !== undefined)
      ) as Record<string, string>;
      const name =
        Object.entries(properties)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ') || 'Default';
      const found = byName.get(name);
      if (found) {
        found.count++;
        continue;
      }
      byName.set(name, {
        name,
        properties,
        count: 1,
        example: InventoryProposer.example(l),
        style: l.node.style,
        bindings: this.binder.bind(l.node.style, kind, l.node.hint),
      });
    }
    return [...byName.values()];
  }

  static componentProps(node: StructureNode): Record<string, string | undefined> {
    const s = node.style;
    const style = s.background ? 'Fill' : s.border ? 'Outline' : 'Text';
    switch (node.hint) {
      case 'button':
        return {
          Style: style,
          Icon: node.icon ? 'True' : 'False',
          'Has Text': node.text ? 'True' : 'False',
          Size: InventoryProposer.sizeKey(node),
        };
      case 'badge':
        return { Style: style, Icon: node.icon ? 'True' : 'False' };
      case 'input':
        return {
          Type: node.tag === 'select' ? 'Select' : node.tag === 'textarea' ? 'Textarea' : 'Text',
          Style: s.border ? 'Bordered' : s.background ? 'Filled' : 'Plain',
        };
      case 'nav-item':
      case 'breadcrumbs':
      case 'pagination':
        return {
          Mode: InventoryProposer.textMode(s.color),
          Region: node.region === 'main' ? undefined : title(node.region),
        };
      default:
        return { Mode: InventoryProposer.mode(s) };
    }
  }

  /** A size bucket from the element's height, so close sizes share a variant. */
  static sizeKey(node: StructureNode): string {
    const h = node.rect.h;
    return h < 36 ? 'Small' : h < 52 ? 'Medium' : 'Large';
  }

  static mode(style: StyleSig): string {
    if (style.backgroundImage) {
      return 'Image';
    }
    const bg = Colour.parse(style.background);
    if (!bg || bg.a < 0.1) {
      return 'Transparent';
    }
    return Colour.luminance(bg) < 0.3 ? 'Dark' : 'Light';
  }

  /** Light text means the element sits on a dark background. */
  static textMode(color: string | undefined): string {
    const c = Colour.parse(color);
    return c && Colour.luminance(c) > 0.5 ? 'Dark' : 'Light';
  }

  static states(nodes: StructureNode[]): string[] {
    const found = new Set<string>(['Default']);
    for (const n of nodes) {
      for (const state of Object.keys(n.states ?? {})) {
        found.add(title(state));
      }
      if (n.open) {
        found.add('Open');
      }
    }
    const order = ['Default', 'Hover', 'Focus', 'Active', 'Open', 'Disabled'];
    return [...found].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }

  /** Variant property definitions: only properties with more than one value. */
  static properties(
    variants: Variant[],
    extra: Record<string, string[]>
  ): Record<string, string[]> {
    const out: Record<string, string[]> = {};
    for (const v of variants) {
      for (const [k, value] of Object.entries(v.properties)) {
        out[k] = [...new Set([...(out[k] ?? []), value])];
      }
    }
    for (const k of Object.keys(out)) {
      if (out[k].length < 2) {
        delete out[k];
      } else {
        out[k].sort();
      }
    }
    return { ...out, ...extra };
  }

  static patternName({ page, node }: Located): string {
    const shape = node.shape;
    const classes = node.label;
    const sections = page.nodes
      .filter((n) => n.hint === 'section')
      .sort((a, b) => a.rect.y - b.rect.y);
    const isFirst = sections[0]?.selector === node.selector;
    const media =
      node.style.backgroundImage || /video|img|picture/.test(shape) || node.images.length > 0;
    const cards = page.nodes.filter(
      (n) =>
        n.hint === 'card' &&
        n.rect.y >= node.rect.y &&
        n.rect.y + n.rect.h <= node.rect.y + node.rect.h + 1
    );
    if (/^h[1-6](\(|$)/.test(shape)) {
      return 'Section Heading';
    }
    if (isFirst && media && (shape.includes('h1') || node.headings.length)) {
      return 'Hero';
    }
    if (/testimonial|review|quote/i.test(classes) || shape.includes('blockquote')) {
      return 'Testimonials';
    }
    if (cards.length >= 2) {
      return 'Card Grid';
    }
    if (
      shape.includes('form') ||
      page.nodes.some(
        (n) => n.hint === 'form' && n.rect.y >= node.rect.y && n.rect.y < node.rect.y + node.rect.h
      )
    ) {
      return 'Form Section';
    }
    if (/gallery/i.test(classes) || (node.images.length >= 3 && node.headings.length === 0)) {
      return 'Gallery';
    }
    if ((node.style.backgroundImage || shape.includes('video')) && node.headings.length) {
      return 'Banner';
    }
    if (node.columns === 2 && node.images.length >= 1) {
      return 'Media and Text';
    }
    if (node.columns >= 3) {
      return 'Feature Row';
    }
    if (node.buttons.length && node.rect.h < 420) {
      return 'Call to Action';
    }
    return 'Content Section';
  }

  /**
   * For each node, its rarest class that at least two nodes share: the class
   * that tells one kind of card from another (lsx-tour, not lsx-to-widget-item-wrap).
   */
  static distinctiveClasses(nodes: StructureNode[]): Map<StructureNode, string> {
    const classesOf = (n: StructureNode) =>
      n.label
        .split('.')
        .slice(1)
        .filter((c) => !/\d{2,}|^(has-|is-|col-|align)/.test(c));
    const freq = new Map<string, number>();
    nodes.forEach((n) => classesOf(n).forEach((c) => freq.set(c, (freq.get(c) ?? 0) + 1)));
    const out = new Map<StructureNode, string>();
    for (const n of nodes) {
      const best = classesOf(n)
        .filter((c) => (freq.get(c) ?? 0) >= 2)
        .sort((a, b) => freq.get(a)! - freq.get(b)!)[0];
      if (best) {
        out.set(n, best);
      }
    }
    return out;
  }

  /** Cuts a shape signature down to the given depth: `div(article(div(a)))` at 1 is `div(article)`. */
  static truncateShape(shape: string, depth: number): string {
    const open = shape.indexOf('(');
    if (open < 0) {
      return shape;
    }
    const close = shape.lastIndexOf(')');
    const suffix = shape.slice(close + 1);
    if (depth <= 0) {
      return shape.slice(0, open) + suffix;
    }
    const parts: string[] = [];
    let level = 0;
    let current = '';
    for (const ch of shape.slice(open + 1, close)) {
      if (ch === ',' && level === 0) {
        parts.push(current);
        current = '';
        continue;
      }
      level += ch === '(' ? 1 : ch === ')' ? -1 : 0;
      current += ch;
    }
    parts.push(current);
    return `${shape.slice(0, open)}(${parts.map((p) => InventoryProposer.truncateShape(p, depth - 1)).join(',')})${suffix}`;
  }

  static distinctiveClass(node: StructureNode): string | undefined {
    return node.label
      .split('.')
      .slice(1)
      .find(
        (c) =>
          !/^(wp-block-(group|columns|cover|heading|lsx-blocks-lsx-container)|align|has-|is-|col-|container|row|section|widget)/.test(
            c
          )
      );
  }

  static unique(name: string, taken: Set<string>): string {
    let candidate = name;
    for (let n = 2; taken.has(candidate); n++) {
      candidate = `${name} ${n}`;
    }
    taken.add(candidate);
    return candidate;
  }

  static example({ page, node }: Located): Example {
    return { url: page.url, viewport: page.viewport, selector: node.selector, label: node.label };
  }

  static examplesOf(members: Located[]): Example[] {
    const seen = new Set<string>();
    const out: Example[] = [];
    for (const m of members) {
      if (!seen.has(m.page.url) && out.length < 3) {
        seen.add(m.page.url);
        out.push(InventoryProposer.example(m));
      }
    }
    return out;
  }

  static content(nodes: StructureNode[]): Content {
    const uniq = (list: string[]) => [...new Set(list.filter(Boolean))].slice(0, 5);
    const images = new Map<string, { src: string; alt: string }>();
    nodes.flatMap((n) => n.images).forEach((i) => images.size < 5 && images.set(i.src, i));
    return {
      headings: uniq(nodes.flatMap((n) => n.headings)),
      buttons: uniq(nodes.flatMap((n) => n.buttons)),
      images: [...images.values()],
      text: nodes.find((n) => n.text)?.text,
    };
  }

  /** Flags items whose shapes overlap heavily (Jaccard of shape tokens of 0.75 or more). */
  static nearDuplicates(items: InventoryItem[], groups: Map<string, Located[]>): void {
    const tokens = (shape: string) => new Set(shape.split(/[^a-z0-9*]+/).filter(Boolean));
    const shapeOf = (item: InventoryItem) => groups.get(item.id)?.[0]?.node.shape ?? '';
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = tokens(shapeOf(items[i]));
        const b = tokens(shapeOf(items[j]));
        const common = [...a].filter((t) => b.has(t)).length;
        const union = new Set([...a, ...b]).size;
        const sameBase = items[i].name.replace(/ \d+$/, '') === items[j].name.replace(/ \d+$/, '');
        if (union && (common / union >= 0.75 || (sameBase && common / union >= 0.5))) {
          items[i].mergeWith = [...(items[i].mergeWith ?? []), items[j].id];
        }
      }
    }
  }

  static unbound(items: InventoryItem[]): UnboundValue[] {
    const map = new Map<string, UnboundValue>();
    const between = new Map<string, string[] | undefined>();
    for (const item of items) {
      for (const v of item.variants) {
        for (const b of v.bindings) {
          if (b.match === 'exact' || b.match === 'near') {
            continue;
          }
          const key = `${b.property}|${b.value}|${b.match}`;
          const entry = map.get(key) ?? {
            property: b.property,
            value: b.value,
            match: b.match,
            nearest: b.variable,
            items: [],
            proposal: '',
          };
          if (!entry.items.includes(item.id)) {
            entry.items.push(item.id);
          }
          between.set(key, b.between);
          map.set(key, entry);
        }
      }
    }
    for (const [key, entry] of map) {
      entry.proposal = InventoryProposer.proposal(entry, between.get(key));
    }
    return [...map.values()].sort(
      (a, b) => b.items.length - a.items.length || a.property.localeCompare(b.property)
    );
  }

  /**
   * What to add so a value binds, following the LightSpeed rules: fonts match
   * the live site, colours fit into the ramps, sizes get a new step in order,
   * and one-offs become semantically named custom variables.
   */
  static proposal(u: Omit<UnboundValue, 'proposal'>, between?: string[]): string {
    const oneOff =
      u.items.length === 1
        ? ' If it is a one-off, add a semantically named custom variable (custom/<role>) to the semantic collection instead.'
        : '';
    if (u.property === 'fontFamily') {
      return `Fonts match the live site: add a family variable for "${u.value}" (Font-Families/Alternate, var(--wp--preset--font-family--alternate)) under its licensed name.`;
    }
    if (['fill', 'text', 'stroke'].includes(u.property)) {
      return u.match === 'primitive'
        ? `Matches the primitive ${u.nearest}. Point the semantic role for this ${u.property} at it, or add a semantic token.`
        : `Fit ${u.value} into a colour ramp (it replaces the nearest step when it fits) or match it to the nearest existing colour, then bind the semantic token for its role.${oneOff}`;
    }
    if (u.property === 'effect') {
      return `Add an effect style for this shadow, or match it to the nearest one.${oneOff}`;
    }
    const range =
      between?.length === 2
        ? ` between ${between[0]} and ${between[1]}`
        : between?.length === 1
          ? ` next to ${between[0]}`
          : '';
    return `Add a ${u.property === 'radius' ? 'radius' : u.property === 'fontSize' ? 'type size' : 'spacing'} step${range}, keeping the ramp in order and renumbering slugs if needed.${oneOff}`;
  }
}

export class DecisionApplier {
  constructor(private readonly now: () => Date = () => new Date()) {}

  apply(inventory: Inventory, decisions: Decisions): Inventory {
    const out: Inventory = JSON.parse(JSON.stringify(inventory));
    const byId = new Map(out.items.map((i) => [i.id, i]));
    const ids = [
      ...Object.keys(decisions.rename ?? {}),
      ...(decisions.cut ?? []),
      ...(decisions.merge ?? []).flat(),
      ...(decisions.promote ?? []),
      ...(decisions.build ?? []),
    ];
    const unknown = [...new Set(ids.filter((id) => !byId.has(id)))];
    if (unknown.length) {
      throw new Error(`Unknown item ids in decisions: ${unknown.join(', ')}.`);
    }
    const log = out.decisions;

    for (const [keep, drop] of decisions.merge ?? []) {
      const a = byId.get(keep)!;
      const b = byId.get(drop)!;
      if (a.kind !== b.kind) {
        throw new Error(`Can't merge ${drop} (${b.kind}) into ${keep} (${a.kind}).`);
      }
      a.count += b.count;
      a.pages = [...new Set([...a.pages, ...b.pages])];
      a.templates = [...new Set([...a.templates, ...b.templates])];
      a.examples = [...a.examples, ...b.examples].slice(0, 3);
      const names = new Set(a.variants.map((v) => v.name));
      a.variants.push(...b.variants.filter((v) => !names.has(v.name)));
      for (const [k, values] of Object.entries(b.variantProperties)) {
        a.variantProperties[k] = [...new Set([...(a.variantProperties[k] ?? []), ...values])];
      }
      a.mobileLayoutChanges = a.mobileLayoutChanges || b.mobileLayoutChanges;
      a.oneOff = false;
      a.mergeWith = a.mergeWith?.filter((id) => id !== drop);
      out.items = out.items.filter((i) => i.id !== drop);
      byId.delete(drop);
      for (const item of out.items) {
        if (item.composition) {
          item.composition = item.composition.map((id) => (id === drop ? keep : id));
        }
        item.mergeWith = item.mergeWith?.filter((id) => id !== drop);
      }
      log.push(`Merged ${drop} into ${keep}.`);
    }
    for (const id of decisions.cut ?? []) {
      if (byId.has(id)) {
        byId.get(id)!.status = 'cut';
        log.push(`Cut ${id}.`);
      }
    }
    for (const id of decisions.promote ?? []) {
      byId.get(id)!.oneOff = false;
      log.push(`Kept ${id} although it appears once.`);
    }
    for (const [id, name] of Object.entries(decisions.rename ?? {})) {
      const item = byId.get(id)!;
      const prefix = item.figmaName.split('/').slice(0, -1).join('/');
      item.name = name;
      item.figmaName = `${prefix}/${name}`;
      if (item.wordpress.type === 'pattern') {
        const theme = item.wordpress.slug?.split('/')[0] ?? out.theme;
        item.wordpress.slug = `${theme}/${kebab(name)}`;
        item.wordpress.file = `patterns/${kebab(name)}.php`;
      }
      log.push(`Renamed ${id} to "${name}".`);
    }
    if (decisions.build) {
      const scope = new Set<string>();
      for (const id of decisions.build) {
        const chosen = byId.get(id)!;
        scope.add(id);
        (chosen.composition ?? [])
          .filter((c) => byId.get(c)?.status !== 'cut')
          .forEach((c) => scope.add(c));
      }
      out.buildScope = out.items.map((i) => i.id).filter((id) => scope.has(id));
      log.push(`Build scope: ${out.buildScope.length} items (${decisions.build.join(', ')}).`);
    }
    if (decisions.approve) {
      out.approved = true;
      out.approvedAt = this.now().toISOString();
      log.push('Approved by the reviewer.');
    }
    out.unbound = InventoryProposer.unbound(out.items.filter((i) => i.status !== 'cut'));
    return out;
  }
}

export class InventoryReport {
  constructor(private readonly shotsDir?: string) {}

  /** Connected groups of items flagged as near duplicates, each in inventory order. */
  static mergeGroups(items: InventoryItem[]): string[][] {
    const ids = new Set(items.map((i) => i.id));
    const links = new Map<string, Set<string>>();
    const link = (a: string, b: string) => links.set(a, (links.get(a) ?? new Set()).add(b));
    for (const item of items) {
      for (const other of (item.mergeWith ?? []).filter((id) => ids.has(id))) {
        link(item.id, other);
        link(other, item.id);
      }
    }
    const seen = new Set<string>();
    const groups: string[][] = [];
    for (const item of items) {
      if (seen.has(item.id) || !links.has(item.id)) {
        continue;
      }
      const group: string[] = [];
      const stack = [item.id];
      while (stack.length) {
        const id = stack.pop()!;
        if (!seen.has(id)) {
          seen.add(id);
          group.push(id);
          stack.push(...links.get(id)!);
        }
      }
      groups.push(items.map((i) => i.id).filter((id) => group.includes(id)));
    }
    return groups;
  }

  render(inv: Inventory): string {
    const live = inv.items.filter((i) => i.status !== 'cut');
    const of = (kind: Kind) => live.filter((i) => i.kind === kind);
    const lines: string[] = [];
    const push = (...l: string[]) => lines.push(...l);
    const list = (values: string[]) => values.join(', ') || 'none';
    const pathOf = (u: string) => {
      const url = new URL(u);
      return url.pathname + url.search;
    };
    const pageList = (urls: string[]) => urls.map(pathOf).join(', ');
    const shot = (id: string) =>
      this.shotsDir
        ? ` ![${id}](${this.shotsDir}/${id.replace(/[^a-z0-9-]+/gi, '-')}-1440.png)`
        : '';
    const wp = (t: WpTarget) =>
      [
        t.type,
        t.block,
        t.slug,
        t.file,
        t.styles?.length ? `styles: ${t.styles.join(', ')}` : '',
        t.note,
      ]
        .filter(Boolean)
        .join('; ');
    const props = (p: Record<string, string[]>) =>
      Object.entries(p)
        .map(([k, v]) => `${k} (${v.join(' | ')})`)
        .join('; ') || 'none';

    push(`# Component inventory: ${new URL(inv.site).host}`, '');
    push(
      `Captured ${inv.capturedAt.slice(0, 10)} from ${inv.pages.length} pages. Theme: \`${inv.theme}\`. Status: ${inv.approved ? `approved ${inv.approvedAt?.slice(0, 10)}` : 'awaiting approval'}.`,
      ''
    );

    push('## Summary', '');
    push('| Kind | Items | One-offs |', '| --- | --- | --- |');
    for (const kind of ['template-part', 'component', 'pattern', 'template'] as Kind[]) {
      push(`| ${kind} | ${of(kind).length} | ${of(kind).filter((i) => i.oneOff).length} |`);
    }
    push('');
    const bindings = live.flatMap((i) => i.variants.flatMap((v) => v.bindings));
    const bound = bindings.filter((b) => b.match === 'exact' || b.match === 'near').length;
    push(
      inv.tokensLoaded
        ? `Token bindings: ${bound} of ${bindings.length} values bind to a semantic token or theme variable.`
        : 'No variables export was loaded, so nothing is bound yet. Re-run with `--tokens variables.json` from site-to-design-tokens.',
      ''
    );

    push('## Decisions for the reviewer', '');
    const decisions: string[] = [];
    for (const group of InventoryReport.mergeGroups(live)) {
      const pairs = group
        .slice(1)
        .map((id) => `["${group[0]}", "${id}"]`)
        .join(', ');
      decisions.push(
        `**Merge?** These look alike: ${group.join(', ')}. To merge, add \`"merge": [${pairs}]\`.`
      );
    }
    for (const f of inv.failures ?? []) {
      decisions.push(
        `**Not captured:** ${pathOf(f.url)} at ${f.viewport}px (${f.error}). Re-run the crawl for that page, or choose another of the same type.`
      );
    }
    for (const r of inv.redirects) {
      decisions.push(
        `**Redirected:** ${pathOf(r.from)} redirects to ${r.to}, so it was left out. Choose another page of that type if one exists.`
      );
    }
    for (const item of live.filter((i) => i.oneOff && i.kind !== 'template')) {
      decisions.push(
        `**One-off:** ${item.id} appears once (${pageList(item.pages)}). Leave it out with \`cut\`, or keep it with \`promote\`.`
      );
    }
    for (const u of inv.unbound.slice(0, 25)) {
      const label = u.match === 'primitive' ? 'Primitive only' : 'No token';
      decisions.push(
        `**${label}:** ${u.property} ${u.value}. Proposed: ${u.proposal} Used by ${u.items.join(', ')}.`
      );
    }
    if (inv.unbound.length > 25) {
      decisions.push(
        `${inv.unbound.length - 25} more values without a token are listed under "Values with no token".`
      );
    }
    const covered = new Set(of('template').map((t) => t.wordpress.slug));
    for (const missing of ['404', 'search', 'single', 'page'].filter((s) => !covered.has(s))) {
      decisions.push(
        `**Template not crawled:** \`${missing}\`. Add a page of that type to the crawl, or confirm it isn't needed.`
      );
    }
    push(...(decisions.length ? decisions.map((d) => `- ${d}`) : ['- Nothing to decide.']), '');

    push('## Template parts', '');
    push(
      '| Id | Name | On pages | Variant properties | Pieces | WordPress |',
      '| --- | --- | --- | --- | --- | --- |'
    );
    for (const i of of('template-part')) {
      push(
        `| ${i.id} | ${i.name}${shot(i.id)} | ${i.count} of ${inv.pages.length} | ${props(i.variantProperties)} | ${list(i.pieces ?? [])} | ${wp(i.wordpress)} |`
      );
    }
    push('', '## Components', '');
    push(
      '| Id | Figma name | Count | Pages | Variant properties | WordPress |',
      '| --- | --- | --- | --- | --- | --- |'
    );
    for (const i of of('component')) {
      push(
        `| ${i.id} | ${i.figmaName}${shot(i.id)} | ${i.count} | ${i.pages.length} | ${props(i.variantProperties)} | ${wp(i.wordpress)} |`
      );
    }
    push('', '## Patterns', '');
    push(
      '| Id | Name | Count | Source pages | Mobile layout changes | WordPress |',
      '| --- | --- | --- | --- | --- | --- |'
    );
    for (const i of of('pattern')) {
      const heading = i.content.headings[0] ? ` ("${i.content.headings[0]}")` : '';
      push(
        `| ${i.id} | ${i.name}${heading}${shot(i.id)} | ${i.count} | ${pageList(i.pages)} | ${i.mobileLayoutChanges ? 'yes' : 'no'} | ${wp(i.wordpress)} |`
      );
    }
    push('', '## Templates', '');
    for (const i of of('template')) {
      push(`### ${i.name} (\`${i.wordpress.file}\`)`, '');
      push(
        `Pages: ${pageList(i.pages)}. Frames: 1440${i.mobileLayoutChanges ? ' and 390' : ''}.`,
        ''
      );
      push(...(i.composition ?? []).map((id, n) => `${n + 1}. ${id}`), '');
    }
    push('## Values with no token', '');
    if (!inv.unbound.length) {
      push('Every value binds to a token.', '');
    } else {
      push('| Property | Value | Nearest | Proposed | Items |', '| --- | --- | --- | --- | --- |');
      inv.unbound.forEach((u) =>
        push(
          `| ${u.property} | ${u.value} | ${u.nearest ?? 'none'} | ${u.proposal} | ${u.items.join(', ')} |`
        )
      );
      push('');
    }
    push('## Build scope', '');
    push(
      inv.buildScope?.length
        ? `Approved for the Figma build: ${inv.buildScope.join(', ')}.`
        : 'Not chosen yet. Before any import, the reviewer approves which templates (and any extra items) to build, with `"build": [...]` in decisions.json.',
      ''
    );
    if (inv.decisions.length) {
      push('## Decisions applied', '', ...inv.decisions.map((d) => `- ${d}`), '');
    }
    push('## Next step', '');
    push(
      'Record the answers in `decisions.json` and re-run with `--decisions decisions.json`:',
      '',
      '```json',
      '{ "rename": { "component:card": "Tour Card" }, "cut": ["pattern:content-section-3"], "merge": [["pattern:hero", "pattern:hero-2"]], "promote": [], "build": ["template:front-page", "component:button"], "approve": true }',
      '```',
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
  now?: () => Date;
}

export function runProposeCli(argv: string[], io: ProposeCliIo): number {
  const values: Record<string, string> = {
    out: 'inventory.json',
    report: 'inventory.md',
    theme: 'theme',
  };
  const optional = ['tokens', 'decisions', 'shots'];
  let input: string | undefined;
  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      if (arg === '--help' || arg === '-h') {
        io.stdout(
          'Usage: propose-inventory site-structure.json [--tokens variables.json] [--theme slug] [--out inventory.json] [--report inventory.md] [--decisions decisions.json] [--shots shots]\n'
        );
        return 0;
      }
      if (!arg.startsWith('--')) {
        input = arg;
        continue;
      }
      const key = arg.slice(2);
      if (![...optional, ...Object.keys(values)].includes(key)) {
        throw new Error(`Unknown argument ${arg}.`);
      }
      const value = argv[++i];
      if (value === undefined) {
        throw new Error(`${arg} needs a value.`);
      }
      values[key] = value;
    }
    if (!input) {
      throw new Error('Pass the site-structure.json from crawl-site-structure.');
    }
    const structure = JSON.parse(io.readFile(input)) as SiteStructure;
    const tokens = values.tokens
      ? new TokenIndex(JSON.parse(io.readFile(values.tokens)) as VariablesExport)
      : new TokenIndex();
    let inventory = new InventoryProposer(tokens, values.theme).propose(structure);
    if (values.decisions) {
      inventory = new DecisionApplier(io.now).apply(
        inventory,
        JSON.parse(io.readFile(values.decisions)) as Decisions
      );
    }
    io.writeFile(values.out, `${JSON.stringify(inventory, null, 2)}\n`);
    io.writeFile(values.report, new InventoryReport(values.shots).render(inventory));
    const live = inventory.items.filter((i) => i.status !== 'cut');
    io.stdout(
      `${live.length} items (${['template-part', 'component', 'pattern', 'template'].map((k) => `${live.filter((i) => i.kind === k).length} ${k}`).join(', ')}), ${inventory.unbound.length} values with no token. Wrote ${values.out} and ${values.report}.\n`
    );
    return 0;
  } catch (error) {
    io.stderr(`propose-inventory: ${(error as Error).message}\n`);
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
