/**
 * @jest-environment jsdom
 */
/* global Element, HTMLElement, DOMRect */
import {
  BrowserDriver,
  CollectedStructure,
  collectPageStructure,
  hideOverlays,
  PageHandle,
  readElementStyle,
  runCrawlCli,
  StructureCrawler,
  StructureNode,
  StyleSig,
  styleDiff,
} from '../crawl-site-structure';

/** jsdom has no layout, so each element's box comes from its data-rect="x,y,w,h". */
beforeAll(() => {
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const value = (this as HTMLElement).dataset?.rect;
    const [x, y, w, h] = value ? value.split(',').map(Number) : [0, 0, 0, 0];
    return {
      left: x,
      top: y,
      width: w,
      height: h,
      right: x + w,
      bottom: y + h,
      x,
      y,
      toJSON: () => ({}),
    } as DOMRect;
  };
});

const card = (name: string, x: number) => `
  <article class="lsx-to-widget-item-wrap lsx-tour" data-rect="${x},700,300,360">
    <img src="/${name}.jpg" alt="${name}" data-rect="${x},700,300,200">
    <h3 data-rect="${x},900,300,30">${name}</h3>
    <a href="#" data-rect="${x},940,60,20">View</a>
  </article>`;

const PAGE = `
  <style>
    .btn:hover { background-color: rgb(0, 0, 0); }
    a:hover { color: red; }
    .menu a:focus-visible { text-decoration: underline; }
    @media (min-width: 1px) { .badge:hover { opacity: 0.8; border-color: rgb(1, 2, 3); box-shadow: 0 0 2px red; } }
  </style>
  <div id="page" data-rect="0,0,1024,3000">
    <header class="site-header" data-rect="0,0,1024,80">
      <nav class="menu" data-rect="0,0,600,80">
        <ul data-rect="0,0,600,80">
          <li data-rect="0,0,80,20"><a href="#" data-rect="0,0,80,20" style="color: rgb(255, 255, 255)">Tours</a></li>
          <li data-rect="90,0,80,20"><a href="#" data-rect="90,0,80,20">Blog</a></li>
        </ul>
      </nav>
      <a class="btn" href="#" style="background-color: rgb(163, 23, 0); padding-left: 16px; border-radius: 8px" data-rect="900,20,100,40">Enquire</a>
    </header>
    <div class="page-banner" style="background-color: rgb(246, 243, 241)" data-rect="0,80,1024,200"><h1 data-rect="0,100,500,60">Banner</h1></div>
    <main data-rect="0,280,1024,2000">
      <div class="wrap" data-rect="0,280,1024,2000">
        <section class="wp-block-cover hero" style="background-image: url(hero.jpg); padding-top: 80px" data-rect="0,280,1024,400">
          <h2 data-rect="0,300,600,60">Hero title</h2>
          <div class="wp-block-buttons" data-rect="0,380,300,50">
            <div class="wp-block-button" data-rect="0,380,120,50"><a class="wp-block-button__link" href="#" style="background-color: rgb(86, 91, 61); box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 0px" data-rect="0,380,120,50">Go <svg></svg></a></div>
          </div>
        </section>
        <section class="cards" data-rect="0,680,1024,400">
          <h2 data-rect="0,680,600,40">Tours</h2>
          <div class="grid" style="display: grid; gap: 20px" data-rect="0,700,1024,380">${card('Tour A', 0)}${card('Tour B', 320)}${card('Tour C', 640)}</div>
        </section>
        <div class="short" data-rect="0,1080,1024,40"><p data-rect="0,1080,600,20">Read <a href="#" style="color: rgb(141, 98, 31)" data-rect="40,1080,40,20">a link</a> here.</p></div>
        <form role="search" class="search-form" data-rect="0,1200,500,200">
          <input type="search" style="border: 1px solid rgb(138, 133, 128)" data-rect="0,1200,300,40">
          <input type="checkbox" data-rect="0,1250,20,20">
          <select data-rect="0,1280,200,40"></select>
          <button disabled data-rect="320,1200,100,40">Search</button>
        </form>
        <details open data-rect="0,1420,600,60"><summary data-rect="0,1420,600,30">Question</summary></details>
        <nav aria-label="Breadcrumb" data-rect="0,1500,400,20"><a href="#" data-rect="0,1500,40,20">Home</a></nav>
        <div class="pagination" data-rect="0,1530,400,40"><a href="#" data-rect="0,1530,20,20">1</a></div>
        <div class="swiper" data-rect="0,1580,600,300"></div>
        <div role="tablist" data-rect="0,1900,600,40"></div>
        <span class="badge" style="background-color: rgb(255, 255, 255); border-radius: 4px" data-rect="0,1950,60,24">New</span>
        <div style="display: none" data-rect="0,2000,600,100"><p>Hidden</p></div>
        <div aria-hidden="true" data-rect="0,2000,600,100"><span class="badge" style="background-color: red; border-radius: 4px" data-rect="0,2000,60,24">x</span></div>
      </div>
    </main>
    <div id="footer-widgets" data-rect="0,2300,1024,300"><aside class="widget" data-rect="0,2300,300,300"><a href="#" data-rect="0,2300,60,20">Widget</a></aside></div>
    <footer data-rect="0,2600,1024,80"><nav data-rect="0,2600,300,20"><a href="#" data-rect="0,2600,60,20">Terms</a></nav></footer>
  </div>`;

describe('collectPageStructure', () => {
  let result: CollectedStructure;
  const of = (hint: string) => result.nodes.filter((n) => n.hint === hint);

  beforeEach(() => {
    document.title = 'Home';
    document.body.className = 'home page';
    document.body.innerHTML = PAGE;
    result = collectPageStructure();
  });

  it('reports the page title, body classes and final URL', () => {
    expect(result.title).toBe('Home');
    expect(result.bodyClasses).toEqual(['home', 'page']);
    expect(result.finalUrl).toBe(window.location.href);
  });

  it('finds the header and both footer pieces as regions', () => {
    expect(of('header')).toHaveLength(1);
    expect(of('footer').map((n) => n.label)).toEqual(['div#footer-widgets', 'footer']);
    expect(of('sidebar')).toHaveLength(0); // A widget inside the footer is not a sidebar.
    expect(of('nav-item').map((n) => n.region)).toEqual(['header', 'header', 'footer']);
  });

  it('finds sections inside main and full-width bands outside it', () => {
    const sections = of('section');
    expect(sections.map((n) => n.label)).toEqual([
      'section.wp-block-cover.hero',
      'section.cards',
      'div.page-banner',
    ]);
    expect(sections[0].style.backgroundImage).toBe(true);
    expect(sections[0].style.paddingBlock).toBe(80);
    expect(sections[1].shape).toContain('article(img,h3,a)*');
  });

  it('finds repeated cards with their content', () => {
    const cards = of('card');
    expect(cards).toHaveLength(3);
    expect(cards[0]).toMatchObject({
      headings: ['Tour A'],
      images: [{ src: '/Tour A.jpg', alt: 'Tour A' }],
    });
  });

  it('finds buttons, links, inputs and other components', () => {
    const buttons = of('button');
    expect(buttons.map((b) => b.label)).toEqual(['a.btn', 'a.wp-block-button__link', 'button']);
    expect(buttons[1].icon).toBe(true);
    expect(buttons[1].style.shadow).toContain('2px 4px');
    expect(of('link')).toHaveLength(1);
    expect(of('input').map((n) => n.tag)).toEqual(['input', 'select']);
    expect(of('input')[0].style.border).toBe('rgb(138, 133, 128)');
    for (const hint of [
      'form',
      'accordion',
      'breadcrumbs',
      'pagination',
      'slider',
      'tabs',
      'badge',
    ]) {
      expect(of(hint)).toHaveLength(1);
    }
    expect(of('accordion')[0].open).toBe(true);
    expect(result.nodes.some((n) => n.text === 'x')).toBe(false); // aria-hidden content is skipped.
  });

  it('reads states from CSS rules that name a class, ignoring bare element rules', () => {
    const enquire = of('button')[0];
    expect(enquire.states?.hover).toEqual({ background: 'rgb(0, 0, 0)' });
    expect(of('nav-item')[0].states?.focus).toEqual({ textDecoration: 'underline' });
    expect(of('link')[0].states).toBeUndefined();
    expect(of('badge')[0].states?.hover).toMatchObject({ opacity: 0.8, border: 'rgb(1, 2, 3)' });
    expect(of('button')[2].states?.disabled).toEqual({});
  });

  it('respects the node cap', () => {
    expect(collectPageStructure({ maxNodes: 3 }).nodes).toHaveLength(3);
  });

  it('finds a sidebar beside a narrow main and opens up tall stacked wrappers', () => {
    document.body.innerHTML = `
      <main data-rect="0,0,700,3000">
        <div class="stack" data-rect="0,0,700,3000">
          <div class="row-a" style="background-color: rgb(1, 1, 1)" data-rect="0,0,700,1500"><p data-rect="0,0,700,20">A</p></div>
          <div class="row-b" data-rect="0,1500,700,1500"><p data-rect="0,1500,700,20">B</p></div>
        </div>
        <div class="other" data-rect="0,3000,700,200"><ul data-rect="0,3000,700,200"><li data-rect="0,3000,10,10">1</li><li data-rect="0,3010,10,10">2</li></ul></div>
      </main>
      <aside id="secondary" data-rect="720,0,300,600"><div class="widget" data-rect="720,0,300,100">W</div></aside>`;
    const nodes = collectPageStructure().nodes;
    expect(nodes.filter((n) => n.hint === 'sidebar')).toHaveLength(1);
    expect(nodes.filter((n) => n.hint === 'section').map((n) => n.label)).toEqual([
      'div.row-a',
      'div.row-b',
      'div.other',
    ]);
    expect(nodes.find((n) => n.label === 'div.other')!.shape).toBe('div(ul(li*))');
  });

  it('works without a main element', () => {
    document.body.innerHTML =
      '<div class="only" data-rect="0,0,1024,300"><h2 data-rect="0,0,100,20">One</h2><p data-rect="0,40,100,20">Two</p></div>';
    expect(collectPageStructure().nodes.map((n) => n.hint)).toEqual(['section']);
  });
});

describe('hideOverlays', () => {
  it('hides fixed overlays but keeps a fixed header and top bar', () => {
    document.body.innerHTML = `
      <header style="position: fixed" data-rect="0,0,1024,80"><nav>Menu</nav></header>
      <div class="topbar" style="position: fixed" data-rect="0,0,1024,40">Offer</div>
      <div class="cookie" style="position: fixed" data-rect="100,700,800,60">Cookies</div>
      <div class="chat" style="position: fixed" data-rect="800,300,200,400"><button>Ask</button></div>
      <div class="gone" style="position: fixed; display: none">x</div>
      <p>Content</p>`;
    expect(hideOverlays()).toBe(2);
    expect((document.querySelector('.cookie') as HTMLElement).style.display).toBe('none');
    expect((document.querySelector('header') as HTMLElement).style.display).toBe('');
    expect((document.querySelector('.topbar') as HTMLElement).style.display).toBe('');
  });
});

describe('readElementStyle and styleDiff', () => {
  it('reads the style of one element, or null when it is missing', () => {
    document.body.innerHTML =
      '<a id="x" style="color: rgb(1, 2, 3); background-color: rgb(4, 5, 6); border: 2px solid rgb(7, 8, 9); box-shadow: 0 0 1px red; text-decoration: underline; opacity: 0.5">x</a>';
    expect(readElementStyle('#x')).toMatchObject({
      color: 'rgb(1, 2, 3)',
      background: 'rgb(4, 5, 6)',
      border: 'rgb(7, 8, 9)',
      textDecoration: 'underline',
      opacity: 0.5,
    });
    expect(readElementStyle('#missing')).toBeNull();
  });

  it('returns only the properties that changed', () => {
    expect(
      styleDiff({ color: 'a', background: 'b' }, { color: 'a', background: 'c', shadow: 'd' })
    ).toEqual({ background: 'c', shadow: 'd' });
    expect(styleDiff({ color: 'a' }, { color: 'a' })).toBeUndefined();
  });
});

const node = (over: Partial<StructureNode>): StructureNode => ({
  selector: 'body > a:nth-child(1)',
  label: 'a.btn',
  hint: 'button',
  region: 'main',
  tag: 'a',
  rect: { x: 0, y: 0, w: 100, h: 40 },
  shape: 'a',
  columns: 1,
  style: {},
  headings: [],
  buttons: [],
  images: [],
  ...over,
});

function fakeDriver(
  options: {
    nodes?: StructureNode[];
    styles?: Record<string, StyleSig | null>;
    failShot?: boolean;
  } = {}
) {
  const opened: string[] = [];
  const shots: string[] = [];
  let closed = 0;
  let browserClosed = false;
  const page: PageHandle = {
    collect: async () => ({
      finalUrl: '',
      title: 'T',
      bodyClasses: [],
      docHeight: 100,
      nodes: (options.nodes ?? []).map((n) => ({ ...n })),
    }),
    styleIn: async (selector, state) =>
      options.styles ? (options.styles[`${selector}|${state}`] ?? null) : null,
    screenshot: async (path) => {
      shots.push(path);
      return !options.failShot;
    },
    close: async () => {
      closed++;
    },
  };
  const driver: BrowserDriver = {
    open: async (url, viewport) => {
      opened.push(`${url}@${viewport}`);
      return page;
    },
    close: async () => {
      browserClosed = true;
    },
  };
  return { driver, opened, shots, closed: () => closed, browserClosed: () => browserClosed };
}

describe('StructureCrawler', () => {
  const now = () => new Date('2026-11-05T10:00:00Z');

  it('visits each page at each viewport with a pause, and takes full-page screenshots', async () => {
    const fake = fakeDriver();
    const sleeps: number[] = [];
    const crawler = new StructureCrawler(fake.driver, async (ms) => void sleeps.push(ms), now);
    const result = await crawler.crawl({
      site: 'https://www.example.com',
      pages: ['/', '/about/'],
      shotsDir: 'shots',
    });

    expect(fake.opened).toEqual([
      'https://www.example.com/@390',
      'https://www.example.com/@1440',
      'https://www.example.com/about/@390',
      'https://www.example.com/about/@1440',
    ]);
    expect(sleeps).toEqual([1500, 1500, 1500]);
    expect(fake.shots).toEqual([
      'shots/home-390.png',
      'shots/home-1440.png',
      'shots/about-390.png',
      'shots/about-1440.png',
    ]);
    expect(result).toMatchObject({
      site: 'https://www.example.com',
      capturedAt: '2026-11-05T10:00:00.000Z',
      viewports: [390, 1440],
    });
    expect(result.pages[0].screenshot).toBe('home-390.png');
    expect(fake.closed()).toBe(4);
    expect(fake.browserClosed()).toBe(true);
  });

  it('leaves out screenshots that fail and crawls the home page by default', async () => {
    const fake = fakeDriver({ failShot: true });
    const result = await new StructureCrawler(fake.driver, async () => undefined).crawl({
      site: 'https://www.example.com',
      pages: [],
      viewports: [1440],
      shotsDir: 'shots',
      maxStateSamples: 0,
    });
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].screenshot).toBeUndefined();
  });

  it('records a page that fails and carries on', async () => {
    const fake = fakeDriver();
    const open = fake.driver.open;
    fake.driver.open = async (url, viewport) => {
      if (url.endsWith('/slow/')) {
        throw new Error('Navigation timeout');
      }
      return open(url, viewport);
    };
    const result = await new StructureCrawler(fake.driver, async () => undefined).crawl({
      site: 'https://www.example.com',
      pages: ['/slow/', '/'],
      viewports: [1440],
      maxStateSamples: 0,
    });
    expect(result.pages.map((p) => p.url)).toEqual(['https://www.example.com/']);
    expect(result.failures).toEqual([
      { url: 'https://www.example.com/slow/', viewport: 1440, error: 'Navigation timeout' },
    ]);
    expect(fake.browserClosed()).toBe(true);
  });

  it('records triggered hover and focus states, replacing CSS guesses', async () => {
    const a = node({
      selector: 'a1',
      states: { hover: { color: 'css-guess' }, active: { color: 'x' } },
    });
    const twin = node({ selector: 'a2' }); // Same label: sampled once.
    const badge = node({ selector: 'b1', hint: 'badge', label: 'span.badge' });
    const gone = node({ selector: 'g1', label: 'a.gone' });
    const section = node({ selector: 's1', hint: 'section', label: 'div' });
    const styles = {
      'a1|none': { color: 'black' },
      'a1|hover': { color: 'red' },
      'a1|focus': { color: 'black' },
      'b1|none': { color: 'black' },
      'b1|hover': null,
    };
    const page = fakeDriver({ styles });
    const crawler = new StructureCrawler(page.driver, async () => undefined);
    const collected: CollectedStructure = {
      finalUrl: '',
      title: '',
      bodyClasses: [],
      docHeight: 0,
      nodes: [a, twin, badge, gone, section],
    };
    const handle = await page.driver.open('x', 1);
    await crawler.triggerStates(handle, collected, 10);

    expect(a.states).toEqual({ hover: { color: 'red' }, active: { color: 'x' } });
    expect(a.stateSource).toBe('browser');
    expect(twin.stateSource).toBeUndefined();
    expect(badge.states).toBeUndefined();
    expect(badge.stateSource).toBe('browser');
    expect(gone.stateSource).toBeUndefined();

    const capped = node({ selector: 'a1' });
    await crawler.triggerStates(handle, { ...collected, nodes: [capped] }, 0);
    expect(capped.stateSource).toBeUndefined();
  });

  it('refuses other origins, private pages and too many pages', () => {
    const crawler = new StructureCrawler(fakeDriver().driver, async () => undefined);
    const site = new URL('https://www.example.com');
    expect(() => crawler.resolvePages(site, ['https://other.example.com/'], 10)).toThrow(
      'Crawl one site at a time'
    );
    for (const path of [
      '/wp-admin/',
      '/cart/',
      '/my-account/orders',
      '/checkout',
      '/wp-login.php',
    ]) {
      expect(() => crawler.resolvePages(site, [path], 10)).toThrow('public pages only');
    }
    expect(() => crawler.resolvePages(site, ['/a', '/b'], 1)).toThrow('the limit is 1');
    expect(crawler.resolvePages(site, ['/a', '/a', '/?s=kenya'], 5)).toEqual([
      'https://www.example.com/a',
      'https://www.example.com/?s=kenya',
    ]);
    expect(StructureCrawler.slugOf('https://www.example.com/tour/a-b/')).toBe('tour-a-b');
    expect(StructureCrawler.slugOf('https://www.example.com/?s=kenya')).toBe('s-kenya');
  });

  it('shoots one example per target, opening each page once', async () => {
    const fake = fakeDriver();
    const sleeps: number[] = [];
    const written = await new StructureCrawler(
      fake.driver,
      async (ms) => void sleeps.push(ms)
    ).shoot(
      'https://www.example.com',
      [
        { id: 'component:button', url: 'https://www.example.com/', viewport: 1440, selector: 'a' },
        {
          id: 'pattern:hero',
          url: 'https://www.example.com/',
          viewport: 1440,
          selector: 'section',
        },
        {
          id: 'part:footer',
          url: 'https://www.example.com/about/',
          viewport: 1440,
          selector: 'footer',
        },
      ],
      'shots',
      10
    );
    expect(fake.opened).toEqual([
      'https://www.example.com/@1440',
      'https://www.example.com/about/@1440',
    ]);
    expect(sleeps).toEqual([10]);
    expect(written).toEqual([
      'component-button-1440.png',
      'pattern-hero-1440.png',
      'part-footer-1440.png',
    ]);

    const failing = fakeDriver({ failShot: true });
    expect(
      await new StructureCrawler(failing.driver, async () => undefined).shoot(
        'https://www.example.com',
        [{ id: 'x', url: 'https://www.example.com/', viewport: 390, selector: 'a' }],
        'shots'
      )
    ).toEqual([]);
    await expect(
      new StructureCrawler(fake.driver, async () => undefined).shoot(
        'https://www.example.com',
        [{ id: 'x', url: 'https://evil.example.com/', viewport: 390, selector: 'a' }],
        'shots'
      )
    ).rejects.toThrow('one site at a time');
  });
});

describe('runCrawlCli', () => {
  function io(files: Record<string, string> = {}) {
    const written: Record<string, string> = {};
    const out: string[] = [];
    const err: string[] = [];
    const dirs: string[] = [];
    const fake = fakeDriver({ nodes: [node({})] });
    return {
      deps: {
        createDriver: async () => fake.driver,
        sleep: async () => undefined,
        readFile: (path: string) => files[path],
        writeFile: (path: string, content: string) => {
          written[path] = content;
        },
        makeDir: (path: string) => void dirs.push(path),
        stdout: (text: string) => void out.push(text),
        stderr: (text: string) => void err.push(text),
      },
      written,
      out,
      err,
      dirs,
      fake,
    };
  }

  it('prints usage', async () => {
    const t = io();
    expect(await runCrawlCli(['--help'], t.deps)).toBe(0);
    expect(t.out.join('')).toContain('Usage');
  });

  it('rejects bad arguments', async () => {
    for (const argv of [['--nope', 'x'], ['stray'], ['--url'], ['--pages', '/']]) {
      const t = io();
      expect(await runCrawlCli(argv, t.deps)).toBe(1);
      expect(t.err.join('')).toMatch(/Unknown argument|needs a value|--url is required/);
    }
  });

  it('reports skipped pages on stderr', async () => {
    const t = io();
    t.fake.driver.open = async () => {
      throw new Error('timeout');
    };
    expect(
      await runCrawlCli(['--url', 'https://www.example.com', '--viewports', '1440'], t.deps)
    ).toBe(0);
    expect(t.err.join('')).toContain('Skipped https://www.example.com/ at 1440px: timeout');
  });

  it('crawls and writes the structure', async () => {
    const t = io();
    const code = await runCrawlCli(
      [
        '--url',
        'https://www.example.com',
        '--pages',
        '/, /about/',
        '--viewports',
        '1440',
        '--out',
        'o.json',
        '--shots',
        'shots',
        '--states',
        '0',
      ],
      t.deps
    );
    expect(code).toBe(0);
    expect(t.dirs).toEqual(['shots']);
    expect(JSON.parse(t.written['o.json']).pages).toHaveLength(2);
    expect(t.out.join('')).toContain('Captured 2 page views and 2 building blocks');
  });

  it('shoots examples from an inventory, skipping cut items', async () => {
    const inventory = {
      items: [
        {
          id: 'component:button',
          examples: [{ url: 'https://www.example.com/', viewport: 1440, selector: 'a' }],
        },
        {
          id: 'pattern:gone',
          status: 'cut',
          examples: [{ url: 'https://www.example.com/', viewport: 1440, selector: 'b' }],
        },
      ],
    };
    const t = io({ 'inv.json': JSON.stringify(inventory) });
    expect(
      await runCrawlCli(
        ['--url', 'https://www.example.com', '--shoot', 'inv.json', '--shots', 'shots'],
        t.deps
      )
    ).toBe(0);
    expect(t.out.join('')).toContain('Wrote 1 of 1 example screenshots');

    const noShots = io({ 'inv.json': JSON.stringify(inventory) });
    expect(
      await runCrawlCli(['--url', 'https://www.example.com', '--shoot', 'inv.json'], noShots.deps)
    ).toBe(1);
    expect(noShots.err.join('')).toContain('--shoot needs --shots');
  });
});
