/**
 * @jest-environment jsdom
 */
import { BrowserDriver, collectPageStyles, runCrawlCli, SiteCrawler } from '../crawl-site-styles';

describe('collectPageStyles', () => {
  beforeEach(() => {
    document.head.innerHTML =
      '<style>@media (min-width: 768px) { p { color: red; } } @media (max-width: 1240px) and (min-width: 376px) { h1 { color: blue; } }</style>';
    document.body.innerHTML = `
      <section style="background-color: rgb(246, 243, 241); padding-top: 80px; padding-left: 20px">
        <h1 style="color: rgb(38, 36, 35); font-family: 'Moret', serif; font-size: 60px; font-weight: 400; line-height: 72px">Title</h1>
        <p style="color: rgb(38, 36, 35); font-family: Lora; font-size: 16px; line-height: 24px">Body text here.</p>
        <p><span>Only nested text</span></p>
        <p>Read <a href="#" style="color: rgb(141, 98, 31)">a link</a> in text.</p>
        <a href="#" style="color: rgb(0, 0, 0)">Menu item</a>
        <a href="#" style="background-color: rgb(247, 243, 241); padding-left: 16px; color: rgb(142, 98, 31)">Pill</a>
        <div style="padding-top: 40px; margin-bottom: 30px">Padded wrapper</div>
        <a href="#" class="wp-block-button__link" style="background-color: rgb(86, 91, 61); color: rgb(255, 255, 255); border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 0px">Go</a>
        <button style="color: white">Send</button>
        <input type="text" style="border: 1px solid rgb(138, 133, 128)">
        <input type="checkbox">
        <select></select>
        <div style="display: flex; gap: 20px; background-color: rgba(0, 0, 0, 0)">Flex</div>
        <div style="display: none; background-color: red"><p>Hidden</p></div>
        <div style="visibility: hidden; background-color: red">Hidden</div>
      </section>`;
  });

  it('records roles and computed styles without layout', () => {
    const { samples, mediaWidths } = collectPageStyles({ requireLayout: false });
    const byRole = (role: string) => samples.filter((s) => s.role === role);

    expect(byRole('h1')[0]).toMatchObject({
      color: 'rgb(38, 36, 35)',
      fontFamily: 'Moret',
      fontSize: 60,
      fontWeight: 400,
      lineHeight: 72,
    });
    expect(byRole('body')).toHaveLength(2);
    expect(byRole('link')[0].color).toBe('rgb(141, 98, 31)');
    expect(byRole('nav')[0].color).toBe('rgb(0, 0, 0)');
    expect(byRole('button')).toHaveLength(3);
    expect(byRole('button').some((b) => b.background === 'rgb(247, 243, 241)')).toBe(true);
    expect(samples.find((s) => s.paddingBlock === 40)).toMatchObject({
      role: 'surface',
      marginBlock: 30,
    });
    const olive = byRole('button').find((b) => b.background === 'rgb(86, 91, 61)')!;
    expect(olive.radius).toBe('8px');
    expect(olive.shadow).toContain('0px 2px 4px');
    expect(byRole('input')).toHaveLength(2);
    expect(byRole('input')[0].border).toBe('rgb(138, 133, 128)');
    expect(byRole('section')[0]).toMatchObject({
      background: 'rgb(246, 243, 241)',
      paddingBlock: 80,
      paddingInline: 20,
    });
    expect(samples.some((s) => s.gap === 20)).toBe(false);
    expect(samples.map((s) => s.key)).toContain('section:0>h1:0');
    expect(mediaWidths.sort()).toEqual([1240, 376, 768]);
  });

  it('skips elements with no layout box by default and respects the sample cap', () => {
    expect(collectPageStyles().samples).toHaveLength(0);
    expect(collectPageStyles({ requireLayout: false, maxSamples: 2 }).samples).toHaveLength(2);
  });

  it('records gaps on flex containers that have another role', () => {
    document.body.innerHTML =
      '<div style="display: flex; gap: 24px; background-color: rgb(255, 255, 255)">Row</div>';

    expect(collectPageStyles({ requireLayout: false }).samples[0]).toMatchObject({
      role: 'section',
      gap: 24,
    });
  });
});

function fakeDriver(failOn?: string) {
  const opened: string[] = [];
  let closed = 0;
  let browserClosed = false;
  const driver: BrowserDriver = {
    open: async (url, viewport) => {
      opened.push(`${url}@${viewport}`);
      return {
        collect: async () => {
          if (failOn && url.endsWith(failOn)) {
            throw new Error('page crashed');
          }
          return { samples: [{ key: 'p:0', role: 'body' }], mediaWidths: [768] };
        },
        close: async () => {
          closed++;
        },
      };
    },
    close: async () => {
      browserClosed = true;
    },
  };
  return { driver, opened, closedCount: () => closed, browserClosed: () => browserClosed };
}

describe('SiteCrawler', () => {
  it('visits each page at each viewport with a pause between requests', async () => {
    const fake = fakeDriver();
    const sleeps: number[] = [];
    const crawler = new SiteCrawler(
      fake.driver,
      async (ms) => {
        sleeps.push(ms);
      },
      () => new Date('2026-11-03T10:00:00Z')
    );

    const result = await crawler.crawl({
      site: 'https://www.example.com',
      pages: ['/', '/about', '/about'],
      delayMs: 500,
    });

    expect(fake.opened).toEqual([
      'https://www.example.com/@390',
      'https://www.example.com/@1440',
      'https://www.example.com/about@390',
      'https://www.example.com/about@1440',
    ]);
    expect(sleeps).toEqual([500, 500, 500]);
    expect(result).toMatchObject({
      site: 'https://www.example.com',
      capturedAt: '2026-11-03T10:00:00.000Z',
      viewports: [390, 1440],
    });
    expect(result.captures).toHaveLength(4);
    expect(fake.closedCount()).toBe(4);
    expect(fake.browserClosed()).toBe(true);
  });

  it('closes pages and the browser when a page fails', async () => {
    const fake = fakeDriver('/broken');
    const crawler = new SiteCrawler(fake.driver, async () => undefined);

    await expect(
      crawler.crawl({ site: 'https://www.example.com', pages: ['/broken'] })
    ).rejects.toThrow('page crashed');
    expect(fake.closedCount()).toBe(1);
    expect(fake.browserClosed()).toBe(true);
  });

  it('refuses other origins and too many pages', () => {
    const crawler = new SiteCrawler(fakeDriver().driver, async () => undefined);
    const site = new URL('https://www.example.com');

    expect(() => crawler.resolvePages(site, ['https://other.com/'], 10)).toThrow(
      'is not on https://www.example.com'
    );
    expect(() => crawler.resolvePages(site, ['/a', '/b', '/c'], 2)).toThrow('the limit is 2');
    expect(crawler.resolvePages(site, [], 10)).toEqual(['https://www.example.com/']);
  });
});

describe('runCrawlCli', () => {
  function deps() {
    const out: string[] = [];
    const err: string[] = [];
    const written: Record<string, string> = {};
    return {
      out,
      err,
      written,
      deps: {
        createDriver: async () => fakeDriver().driver,
        sleep: async () => undefined,
        writeFile: (path: string, content: string) => {
          written[path] = content;
        },
        stdout: (text: string) => out.push(text),
        stderr: (text: string) => err.push(text),
      },
    };
  }

  it('crawls and writes the styles file', async () => {
    const run = deps();

    const code = await runCrawlCli(
      [
        '--url',
        'https://www.example.com',
        '--pages',
        '/, /tours',
        '--out',
        'styles.json',
        '--delay',
        '0',
        '--max-pages',
        '5',
        '--viewports',
        '390,1440',
      ],
      run.deps
    );

    expect(code).toBe(0);
    expect(JSON.parse(run.written['styles.json']).captures).toHaveLength(4);
    expect(run.out.join('')).toContain('Captured 4 page views and 4 elements into styles.json');
  });

  it('prints help', async () => {
    const run = deps();

    expect(await runCrawlCli(['-h'], run.deps)).toBe(0);
    expect(run.out.join('')).toContain('Usage: crawl-site-styles');
  });

  it.each([
    [['--colour', 'red'], 'Unknown argument --colour'],
    [['https://x.com'], 'Unknown argument https://x.com'],
    [['--url'], '--url needs a value'],
    [['--pages', '/'], '--url is required'],
    [['--url', 'https://www.example.com', '--pages', 'https://other.com/'], 'is not on'],
  ])('fails cleanly for %j', async (argv, message) => {
    const run = deps();

    expect(await runCrawlCli(argv as string[], run.deps)).toBe(1);
    expect(run.err.join('')).toContain(message);
  });

  it.each([
    [['--max-pages', 'abc'], '--max-pages must be a positive integer'],
    [['--max-pages', '0'], '--max-pages must be a positive integer'],
    [['--max-pages', '2.5'], '--max-pages must be a positive integer'],
    [['--delay', 'abc'], '--delay must be a number'],
    [['--delay', ''], '--delay must be a number'],
    [['--delay', '-1'], '--delay must be a number'],
    [['--viewports', '390,,1440'], '--viewports must be comma-separated positive integers'],
    [['--viewports', '390,0'], '--viewports must be comma-separated positive integers'],
    [['--viewports', 'wide'], '--viewports must be comma-separated positive integers'],
  ])('rejects invalid numeric option %j before launching a browser', async (extra, message) => {
    const run = deps();
    let launched = false;
    run.deps.createDriver = async () => {
      launched = true;
      return fakeDriver().driver;
    };

    const code = await runCrawlCli(['--url', 'https://www.example.com', ...extra], run.deps);

    expect(code).toBe(1);
    expect(run.err.join('')).toContain(message);
    expect(launched).toBe(false);
  });
});
