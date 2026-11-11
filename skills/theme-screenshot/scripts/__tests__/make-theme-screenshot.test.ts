import { Fetcher, FileReader, LogoLoader } from '../lib/logo';
import {
  CliDeps,
  runScreenshotCli,
  ScreenshotRenderer,
  ThemeScreenshotMaker,
} from '../make-theme-screenshot';

const themeJson = JSON.stringify({
  settings: {
    color: {
      palette: [
        { slug: 'base', color: '#faf7f2' },
        { slug: 'brand-600', color: '#8d621f' },
      ],
    },
  },
});

function setup(luminance = 0.2) {
  const files: FileReader = {
    read: jest.fn((path: string) => Buffer.from(path.endsWith('.json') ? themeJson : 'LOGO')),
  };
  const fetcher: Fetcher = {
    text: jest.fn(async () => '<img class="custom-logo" src="/logo.png">'),
    bytes: jest.fn(async () => ({ data: Buffer.from('IMG'), type: 'image/png' })),
  };
  const renderer: ScreenshotRenderer = {
    inspect: jest.fn(async () => ({ width: 300, height: 100, luminance })),
    render: jest.fn(async () => Buffer.from('PNG')),
    close: jest.fn(async () => undefined),
  };
  const maker = new ThemeScreenshotMaker(
    new LogoLoader(fetcher, files),
    files,
    renderer,
    undefined,
    () => new Date('2026-11-09T00:00:00Z')
  );
  return { files, fetcher, renderer, maker };
}

describe('ThemeScreenshotMaker', () => {
  it('renders a light screenshot from a logo file and the theme palette', async () => {
    const { maker, renderer } = setup();
    const result = await maker.make({
      logo: 'logo.svg',
      themeJson: 'theme.json',
      industry: 'Tour operator',
    });
    expect(result).toMatchObject({ mode: 'light', logo: { source: 'file' } });
    expect(result.png.toString()).toBe('PNG');
    const [html, width, height] = (renderer.render as jest.Mock).mock.calls[0];
    expect([width, height]).toEqual([1200, 900]);
    expect(html).toContain('Tour operator');
    expect(html).toContain('WordPress block theme &middot; 2026');
    expect(html).toContain('#8d621f');
    expect(html).toContain('width: 560px; height: 187px');
  });

  it('picks dark for a light logo, finds the logo on a site and honours year, label and mode', async () => {
    const { maker, renderer } = setup(0.9);
    const result = await maker.make({
      site: 'https://example.com',
      industry: 'Wine',
      year: 2030,
      label: 'Block theme',
    });
    expect(result.mode).toBe('dark');
    expect(result.logo.source).toBe('custom-logo');
    expect((renderer.render as jest.Mock).mock.calls[0][0]).toContain('Block theme &middot; 2030');
    const forced = await maker.make({
      site: 'https://example.com',
      industry: 'Wine',
      mode: 'light',
    });
    expect(forced.mode).toBe('light');
  });

  it('needs a logo file or a site', async () => {
    await expect(setup().maker.make({ industry: 'x' })).rejects.toThrow('Pass --logo');
  });
});

describe('runScreenshotCli', () => {
  function run(argv: string[], luminance = 0.2) {
    const { maker, renderer } = setup(luminance);
    const written: Record<string, Buffer> = {};
    const out: string[] = [];
    const err: string[] = [];
    const deps: CliDeps = {
      createMaker: () => ({ maker, close: () => renderer.close() }),
      writeFile: (path, data) => {
        written[path] = data;
      },
      stdout: (t) => out.push(t),
      stderr: (t) => err.push(t),
    };
    return runScreenshotCli(argv, deps).then((code) => ({ code, written, out, err, renderer }));
  }

  it('writes the screenshot and closes the browser', async () => {
    const r = await run([
      '--logo',
      'logo.png',
      '--theme-json',
      'theme.json',
      '--industry',
      'Wine',
      '--out',
      'shot.png',
      '--year',
      '2027',
      '--label',
      'Theme',
      '--mode',
      'dark',
      '--base',
      '#fff',
      '--contrast',
      '#000',
      '--accent',
      '#b08d3c',
    ]);
    expect(r.code).toBe(0);
    expect(r.written['shot.png'].toString()).toBe('PNG');
    expect(r.out.join('')).toContain('Wrote shot.png (1200x900, dark mode)');
    expect(r.renderer.close).toHaveBeenCalled();
  });

  it('defaults the output path and prints help', async () => {
    const r = await run(['--site', 'https://example.com', '--industry', 'Wine']);
    expect(r.written['screenshot.png']).toBeDefined();
    const help = await run(['-h']);
    expect(help.code).toBe(0);
    expect(help.out.join('')).toContain('Usage: make-theme-screenshot');
  });

  it.each([
    [[], 'Pass --industry'],
    [['--industry', 'x'], 'Pass --logo'],
    [['--industry'], '--industry needs a value'],
    [['--nope'], 'Unknown option --nope'],
    [['--industry', 'x', '--year', '99'], '--year takes a four digit year'],
    [['--industry', 'x', '--mode', 'blue'], '--mode takes light, dark or auto'],
    [['--industry', 'x', '--accent', 'gold'], 'is not a hex colour'],
    [['--industry', 'x', '--logo', 'logo.bmp'], 'must be PNG'],
  ])('fails cleanly for %j', async (argv, message) => {
    const r = await run(argv as string[]);
    expect(r.code).toBe(1);
    expect(r.err.join('')).toContain(message);
  });
});
