/**
 * @jest-environment jsdom
 */
/* global Element, DOMRect */
import {
  BrowserDriver,
  ElementReading,
  MeasureState,
  PageHandle,
  PageMeasurer,
  readElement,
  runMeasureCli,
} from '../measure-page';
import { memoryDeps } from './fixtures';

describe('readElement (in the browser)', () => {
  beforeAll(() => {
    Element.prototype.getBoundingClientRect = function () {
      return {
        width: 120.04,
        height: 40,
        top: 0,
        left: 0,
        right: 120,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect;
    };
  });

  it('reads the first match, its box and the count', () => {
    document.body.innerHTML =
      '<h2 class="t" style="color: rgb(1, 2, 3); padding-top: 10px">A</h2><h2 class="t">B</h2>';
    const reading = readElement({ selector: '.t', properties: ['color', 'padding-top'] })!;
    expect(reading.count).toBe(2);
    expect(reading.rect).toEqual({ width: 120, height: 40 });
    expect(reading.styles).toEqual({ color: 'rgb(1, 2, 3)', 'padding-top': '10px' });
  });

  it('returns null when nothing matches', () => {
    document.body.innerHTML = '';
    expect(readElement({ selector: '.t', properties: ['color'] })).toBeNull();
  });
});

class FakePage implements PageHandle {
  closed = false;
  constructor(
    private readonly width: number,
    private readonly fail: boolean
  ) {}

  async read(
    selector: string,
    _properties: string[],
    state: MeasureState
  ): Promise<ElementReading | null> {
    if (selector === '.missing') {
      return null;
    }
    if (selector === '.no-focus' && state === 'focus') {
      return null;
    }
    const colour = state === 'hover' ? 'rgb(255, 0, 0)' : 'rgb(0, 0, 0)';
    return {
      count: 1,
      rect: { width: this.width / 2, height: 40 },
      styles: { color: colour, 'font-size': '16px' },
    };
  }

  async screenshot(): Promise<boolean> {
    return !this.fail;
  }

  async close(): Promise<void> {
    this.closed = true;
  }
}

class FakeDriver implements BrowserDriver {
  opened: string[] = [];
  closed = false;
  constructor(private readonly failWidth?: number) {}

  async open(url: string, width: number): Promise<PageHandle> {
    if (width === this.failWidth) {
      throw new Error('timeout');
    }
    this.opened.push(`${url}@${width}`);
    return new FakePage(width, width === 768);
  }

  async close(): Promise<void> {
    this.closed = true;
  }
}

const noSleep = jest.fn(async () => undefined);
const fixedNow = () => new Date('2026-11-23T10:00:00Z');

describe('PageMeasurer', () => {
  it('measures each element per width, keeping only changed state values', async () => {
    const driver = new FakeDriver();
    const result = await new PageMeasurer(driver, noSleep, fixedNow).measure({
      url: 'https://www.example.com/tours/',
      side: 'live',
      selectors: [
        { name: 'title', selector: '.title' },
        { name: 'missing', selector: '.missing' },
        { name: 'link', selector: '.no-focus' },
      ],
      shotsDir: 'shots',
    });
    expect(driver.opened).toEqual([
      'https://www.example.com/tours/@390',
      'https://www.example.com/tours/@768',
      'https://www.example.com/tours/@1440',
    ]);
    expect(driver.closed).toBe(true);
    expect(noSleep).toHaveBeenCalledTimes(2);
    const at390 = result.measurements.filter((m) => m.width === 390);
    expect(at390.map((m) => `${m.name}:${m.state}:${m.found}`)).toEqual([
      'title:default:true',
      'title:hover:true',
      'missing:default:false',
      'link:default:true',
      'link:hover:true',
    ]);
    expect(at390[1].styles).toEqual({ color: 'rgb(255, 0, 0)' });
    expect(result.screenshots).toEqual(['shots/live-tours-390.png', 'shots/live-tours-1440.png']);
    expect(result.measuredAt).toBe('2026-11-23T10:00:00.000Z');
  });

  it('records a failed width and carries on', async () => {
    const result = await new PageMeasurer(new FakeDriver(390), noSleep).measure({
      url: 'https://www.example.com/',
      side: 'local',
      selectors: [{ name: 'title', selector: '.title' }],
      widths: [390, 1440],
      states: ['default'],
      properties: ['color'],
    });
    expect(result.failures).toEqual([{ width: 390, error: 'timeout' }]);
    expect(result.measurements).toHaveLength(1);
  });

  it('refuses wp-admin and login pages', async () => {
    const measurer = new PageMeasurer(new FakeDriver(), noSleep);
    for (const url of ['https://example.com/wp-admin/', 'https://example.com/wp-login.php?x=1']) {
      await expect(measurer.measure({ url, side: 'live', selectors: [] })).rejects.toThrow(
        'Refusing'
      );
    }
  });

  it('names screenshots from the path', () => {
    expect(PageMeasurer.slug(new URL('https://example.com/'))).toBe('home');
    expect(PageMeasurer.slug(new URL('https://example.com/a/B_c/'))).toBe('a-b-c');
  });

  it('reads selectors for one side', () => {
    const file = {
      hero: '.hero',
      card: { live: '.old-card', local: '.new-card' },
      liveOnly: { live: '.x' },
    };
    expect(PageMeasurer.selectorsFrom(file, 'local')).toEqual([
      { name: 'hero', selector: '.hero' },
      { name: 'card', selector: '.new-card' },
    ]);
    expect(() => PageMeasurer.selectorsFrom([], 'live')).toThrow('must be an object');
    expect(() => PageMeasurer.selectorsFrom({ a: 1 }, 'live')).toThrow('must be a string');
    expect(() => PageMeasurer.selectorsFrom({ a: { local: '.a' } }, 'live')).toThrow(
      'No selectors'
    );
  });
});

describe('runMeasureCli', () => {
  const run = async (
    argv: string[],
    files: Record<string, string> = {},
    driver = new FakeDriver()
  ) => {
    const io = memoryDeps(files);
    const dirs: string[] = [];
    const code = await runMeasureCli(argv, {
      ...io.deps,
      createDriver: async () => driver,
      sleep: noSleep,
      makeDir: (path) => {
        dirs.push(path);
      },
    });
    return { code, io, dirs };
  };

  it('measures from a selectors file and single selectors', async () => {
    const { code, io, dirs } = await run(
      [
        '--url',
        'http://localhost:8881/',
        '--selectors',
        'sel.json',
        '--selector',
        '.missing',
        '--side',
        'local',
        '--widths',
        '1440',
        '--states',
        'default,hover',
        '--props',
        'color, font-size',
        '--shots',
        'shots',
        '--out',
        'local.json',
      ],
      { 'sel.json': JSON.stringify({ card: { live: '.a', local: '.b' } }) }
    );
    expect(code).toBe(0);
    expect(dirs).toEqual(['shots']);
    const result = JSON.parse(io.written['local.json']);
    expect(result.side).toBe('local');
    expect(result.properties).toEqual(['color', 'font-size']);
    expect(result.measurements.map((m: { name: string }) => m.name)).toEqual([
      'card',
      'card',
      '.missing',
    ]);
    expect(io.out.join('')).toContain('Measured 2 elements at 1440px');
    expect(io.err.join('')).toContain('Not found at 1440px: .missing');
  });

  it('exits 1 when a width fails', async () => {
    const { code, io } = await run(
      ['--url', 'https://example.com/', '--selector', '.a', '--widths', '390'],
      {},
      new FakeDriver(390)
    );
    expect(code).toBe(1);
    expect(io.err.join('')).toContain('Failed at 390px: timeout');
  });

  it('prints help', async () => {
    const { code, io } = await run(['--help']);
    expect(code).toBe(0);
    expect(io.out.join('')).toContain('Usage');
  });

  it.each([
    [['--selector', '.a'], '--url is required.'],
    [['--url', 'https://e.com/'], 'Give --selectors'],
    [
      ['--url', 'https://e.com/', '--selector', '.a', '--side', 'staging'],
      '--side must be live or local.',
    ],
    [
      ['--url', 'https://e.com/', '--selector', '.a', '--states', 'active'],
      'Unknown state active.',
    ],
    [['--url', 'https://e.com/', '--nope', 'x'], 'Unknown argument --nope.'],
    [['url'], 'Unknown argument url.'],
    [['--url'], '--url needs a value.'],
    [['--url', 'https://e.com/wp-admin/', '--selector', '.a'], 'Refusing'],
  ])('fails clearly for %j', async (argv, message) => {
    const { code, io } = await run(argv as string[]);
    expect(code).toBe(1);
    expect(io.err.join('')).toContain(message);
  });
});
