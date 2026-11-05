/**
 * Crawls pages of a live site and records the computed styles of its
 * elements at the mobile (390px) and desktop (1440px) frame widths.
 *
 * Reads public pages only, one at a time, with a pause between requests.
 * The output feeds propose-tokens.ts.
 *
 * Usage:
 *   npx tsx crawl-site-styles.ts --url https://www.example.com \
 *     --pages /,/about,/contact --out site-styles.json
 */

/* global Element, ChildNode, HTMLElement, CSSRuleList, CSSMediaRule -- collectPageStyles runs in the browser */

import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export type Role =
  | 'body'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'link'
  | 'nav'
  | 'button'
  | 'input'
  | 'section'
  | 'surface';

export interface ElementSample {
  /** Stable DOM path, used to pair the same element across viewports. */
  key: string;
  role: Role;
  color?: string;
  background?: string;
  border?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  paddingBlock?: number;
  paddingInline?: number;
  marginBlock?: number;
  gap?: number;
  radius?: string;
  shadow?: string;
  /** Width of a horizontally centred container, in px. */
  containerWidth?: number;
}

export interface CollectedPage {
  samples: ElementSample[];
  mediaWidths: number[];
}

export interface PageCapture extends CollectedPage {
  url: string;
  viewport: number;
}

export interface SiteStyles {
  site: string;
  capturedAt: string;
  viewports: number[];
  captures: PageCapture[];
}

export interface CollectOptions {
  /** Skip elements with no layout box. Turn off only where layout isn't computed (tests). */
  requireLayout?: boolean;
  maxSamples?: number;
}

/**
 * Runs inside the page. Must stay self-contained: no imports or outer
 * variables, because the browser receives only this function's source.
 */
export function collectPageStyles(options: CollectOptions = {}): CollectedPage {
  const requireLayout = options.requireLayout !== false;
  const maxSamples = options.maxSamples ?? 4000;
  const viewport = window.innerWidth;
  const samples: ElementSample[] = [];
  const buttonClass = /(^|\s|-)(btn|button)(\s|-|_|$)|wp-block-button__link|wp-element-button/i;
  const textTags = ['P', 'LI', 'BLOCKQUOTE', 'FIGCAPTION', 'TD', 'DD', 'LABEL'];
  const transparent = (value: string) =>
    !value || value === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(value.replace(/\s+/g, ''));
  const px = (value: string) => {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : undefined;
  };
  const pathOf = (el: Element) => {
    const parts: string[] = [];
    let node: Element | null = el;
    while (node && node !== document.body && parts.length < 12) {
      const parent: Element | null = node.parentElement;
      const index = parent ? Array.prototype.indexOf.call(parent.children, node) : 0;
      parts.unshift(`${node.tagName.toLowerCase()}:${index}`);
      node = parent;
    }
    return parts.join('>');
  };
  const hasOwnText = (el: Element) =>
    Array.prototype.some.call(
      el.childNodes,
      (child: ChildNode) => child.nodeType === 3 && (child.textContent ?? '').trim().length > 1
    );

  const elements = document.body ? document.body.querySelectorAll('*') : [];
  for (let i = 0; i < elements.length && samples.length < maxSamples; i++) {
    const el = elements[i] as HTMLElement;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') {
      continue;
    }
    let hiddenAncestor = false;
    for (let up = el.parentElement; up && up !== document.body; up = up.parentElement) {
      if (window.getComputedStyle(up).display === 'none') {
        hiddenAncestor = true;
        break;
      }
    }
    if (hiddenAncestor) {
      continue;
    }
    const rect = el.getBoundingClientRect();
    if (requireLayout && (rect.width < 1 || rect.height < 1)) {
      continue;
    }

    const tag = el.tagName;
    const type = (el.getAttribute('type') || '').toLowerCase();
    let role: Role | undefined;
    if (/^H[1-6]$/.test(tag)) {
      role = tag.toLowerCase() as Role;
    } else if (
      tag === 'BUTTON' ||
      (tag === 'INPUT' && ['submit', 'button'].includes(type)) ||
      buttonClass.test(el.className && typeof el.className === 'string' ? el.className : '')
    ) {
      role = 'button';
    } else if (tag === 'A') {
      const filled = !transparent(style.backgroundColor) || (px(style.borderTopWidth) ?? 0) > 0;
      if (filled && (px(style.paddingLeft) ?? 0) >= 8) {
        role = 'button'; // A link styled as a button.
      } else {
        // Links inside running text set the link colour; others are navigation.
        role = el.closest('p, li p, td, dd, blockquote, figcaption') ? 'link' : 'nav';
      }
    } else if (tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'INPUT') {
      role = ['checkbox', 'radio', 'hidden', 'image'].includes(type) ? undefined : 'input';
    } else if (textTags.includes(tag) && hasOwnText(el)) {
      role = 'body';
    } else if (!transparent(style.backgroundColor)) {
      role = !requireLayout || rect.width >= viewport * 0.5 ? 'section' : 'surface';
    }

    const centred =
      requireLayout &&
      rect.left > 4 &&
      rect.width < viewport - 16 &&
      Math.abs(rect.left - (viewport - rect.right)) < 2;

    // Padded wrappers with no background still set the section spacing.
    const padded = (px(style.paddingTop) ?? 0) >= 24;
    if (!role && !centred && !padded) {
      continue;
    }

    const sample: ElementSample = { key: pathOf(el), role: role ?? 'surface' };
    if (role && role !== 'section' && role !== 'surface') {
      sample.color = style.color;
      sample.fontFamily = style.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      sample.fontSize = px(style.fontSize);
      sample.fontWeight = Number(style.fontWeight) || undefined;
      sample.lineHeight = px(style.lineHeight);
    }
    if (!transparent(style.backgroundColor)) {
      sample.background = style.backgroundColor;
    }
    if ((px(style.borderTopWidth) ?? 0) > 0 && style.borderTopStyle !== 'none') {
      sample.border = style.borderTopColor;
    }
    const paddingBlock = px(style.paddingTop);
    const paddingInline = px(style.paddingLeft);
    if (paddingBlock) {
      sample.paddingBlock = paddingBlock;
    }
    if (paddingInline) {
      sample.paddingInline = paddingInline;
    }
    const marginBlock = px(style.marginBottom);
    if (marginBlock && marginBlock > 0) {
      sample.marginBlock = marginBlock;
    }
    const gap = px(style.rowGap || style.gap);
    if (gap && (style.display.includes('flex') || style.display.includes('grid'))) {
      sample.gap = gap;
    }
    const radius = style.borderTopLeftRadius || style.borderRadius.split(' ')[0];
    if (radius && radius !== '0px') {
      sample.radius = radius;
    }
    if (style.boxShadow && style.boxShadow !== 'none') {
      sample.shadow = style.boxShadow;
    }
    if (centred) {
      sample.containerWidth = Math.round(rect.width);
    }
    if (!role) {
      // Layout-only element: keep its spacing and width, not its colours.
      delete sample.background;
      delete sample.border;
      delete sample.shadow;
    }
    samples.push(sample);
  }

  const mediaWidths: number[] = [];
  for (let s = 0; s < document.styleSheets.length; s++) {
    let rules: CSSRuleList | undefined;
    try {
      rules = document.styleSheets[s].cssRules;
    } catch {
      continue; // Cross-origin stylesheet.
    }
    for (let r = 0; r < rules.length; r++) {
      const rule = rules[r] as CSSMediaRule;
      const condition = rule.media ? rule.media.mediaText : '';
      const matches = condition.match(/(?:min|max)-width:\s*(\d+(?:\.\d+)?)px/g) ?? [];
      for (const m of matches) {
        mediaWidths.push(Math.round(parseFloat(m.split(':')[1])));
      }
    }
  }

  return { samples, mediaWidths };
}

export interface PageHandle {
  collect: () => Promise<CollectedPage>;
  close: () => Promise<void>;
}

export interface BrowserDriver {
  open: (url: string, viewport: number) => Promise<PageHandle>;
  close: () => Promise<void>;
}

export interface CrawlOptions {
  site: string;
  pages: string[];
  viewports?: number[];
  delayMs?: number;
  maxPages?: number;
}

export class SiteCrawler {
  constructor(
    private readonly driver: BrowserDriver,
    private readonly sleep: (ms: number) => Promise<void>,
    private readonly now: () => Date = () => new Date()
  ) {}

  async crawl(options: CrawlOptions): Promise<SiteStyles> {
    const site = new URL(options.site);
    const viewports = options.viewports ?? [390, 1440];
    const urls = this.resolvePages(site, options.pages, options.maxPages ?? 10);
    const captures: PageCapture[] = [];
    let first = true;

    try {
      for (const url of urls) {
        for (const viewport of viewports) {
          if (!first) {
            await this.sleep(options.delayMs ?? 1500);
          }
          first = false;
          const page = await this.driver.open(url, viewport);
          try {
            captures.push({ url, viewport, ...(await page.collect()) });
          } finally {
            await page.close();
          }
        }
      }
    } finally {
      await this.driver.close();
    }

    return {
      site: site.origin,
      capturedAt: this.now().toISOString(),
      viewports,
      captures,
    };
  }

  /** Resolves page paths against the site and refuses other origins. */
  resolvePages(site: URL, pages: string[], maxPages: number): string[] {
    const urls = [...new Set((pages.length ? pages : ['/']).map((p) => new URL(p, site).href))];
    for (const url of urls) {
      if (new URL(url).origin !== site.origin) {
        throw new Error(`${url} is not on ${site.origin}. Crawl one site at a time.`);
      }
    }
    if (urls.length > maxPages) {
      throw new Error(
        `${urls.length} pages requested; the limit is ${maxPages}. Raise --max-pages if needed.`
      );
    }
    return urls;
  }
}

/** Validates the numeric CLI options before any browser starts. */
export class CrawlOptionsParser {
  parse(values: Record<string, string>): {
    viewports: number[];
    delayMs: number;
    maxPages: number;
  } {
    const maxPages = Number(values['max-pages']);
    if (!Number.isInteger(maxPages) || maxPages < 1) {
      throw new Error(`--max-pages must be a positive integer, got "${values['max-pages']}".`);
    }
    const delayMs = values.delay.trim() === '' ? NaN : Number(values.delay);
    if (!Number.isFinite(delayMs) || delayMs < 0) {
      throw new Error(
        `--delay must be a number of milliseconds, 0 or more, got "${values.delay}".`
      );
    }
    const viewports = values.viewports.split(',').map((v) => (v.trim() === '' ? NaN : Number(v)));
    if (!viewports.length || viewports.some((v) => !Number.isInteger(v) || v < 1)) {
      throw new Error(
        `--viewports must be comma-separated positive integers, got "${values.viewports}".`
      );
    }
    return { viewports, delayMs, maxPages };
  }
}

export interface CrawlCliDeps {
  createDriver: () => Promise<BrowserDriver>;
  sleep: (ms: number) => Promise<void>;
  writeFile: (path: string, content: string) => void;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

export async function runCrawlCli(argv: string[], deps: CrawlCliDeps): Promise<number> {
  const values: Record<string, string> = {
    pages: '/',
    out: 'site-styles.json',
    delay: '1500',
    'max-pages': '10',
    viewports: '390,1440',
  };

  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      if (arg === '--help' || arg === '-h') {
        deps.stdout(
          'Usage: crawl-site-styles --url https://www.example.com [--pages /,/about] [--out site-styles.json] [--delay 1500] [--max-pages 10] [--viewports 390,1440]\n'
        );
        return 0;
      }
      const key = arg.replace(/^--/, '');
      if (!arg.startsWith('--') || !['url', ...Object.keys(values)].includes(key)) {
        throw new Error(`Unknown argument ${arg}.`);
      }
      const value = argv[++i];
      if (value === undefined) {
        throw new Error(`${arg} needs a value.`);
      }
      values[key] = value;
    }
    if (!values.url) {
      throw new Error('--url is required.');
    }

    const options = new CrawlOptionsParser().parse(values);
    const crawler = new SiteCrawler(await deps.createDriver(), deps.sleep);
    const result = await crawler.crawl({
      site: values.url,
      pages: values.pages
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      ...options,
    });
    deps.writeFile(values.out, `${JSON.stringify(result, null, 2)}\n`);
    const samples = result.captures.reduce((total, c) => total + c.samples.length, 0);
    deps.stdout(
      `Captured ${result.captures.length} page views and ${samples} elements into ${values.out}\n`
    );
    return 0;
  } catch (error) {
    deps.stderr(`crawl-site-styles: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- Puppeteer driver and CLI entry point, exercised by live runs */
export async function createPuppeteerDriver(): Promise<BrowserDriver> {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ headless: true });
  return {
    open: async (url, viewport) => {
      const page = await browser.newPage();
      // Same-origin pages only: refuse a redirect of the page itself to another origin.
      const origin = new URL(url).origin;
      const sameOrigin = (request: import('puppeteer').HTTPRequest) => {
        if (
          request.isNavigationRequest() &&
          request.frame() === page.mainFrame() &&
          new URL(request.url()).origin !== origin
        ) {
          return request.abort();
        }
        return request.continue();
      };
      try {
        await page.setViewport({ width: viewport, height: 900 });
        await page.setRequestInterception(true);
        page.on('request', sameOrigin);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      } catch (error) {
        page.off('request', sameOrigin);
        await page.close();
        throw error;
      }
      return {
        collect: async () => {
          // tsx (esbuild) can add __name() helpers to function source; define it in the page.
          await page.evaluate('globalThis.__name = (f) => f');
          return page.evaluate(collectPageStyles, {});
        },
        close: async () => {
          page.off('request', sameOrigin);
          await page.close();
        },
      };
    },
    close: () => browser.close(),
  };
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCrawlCli(process.argv.slice(2), {
    createDriver: createPuppeteerDriver,
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    writeFile: (path, content) => writeFileSync(path, content),
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  }).then((code) => {
    process.exitCode = code;
  });
}
