import { Fetcher, FileReader, LogoLoader, LogoLocator } from '../lib/logo';

const page = (body: string, head = '') => `<html><head>${head}</head><body>${body}</body></html>`;

describe('LogoLocator', () => {
  const locator = new LogoLocator();
  const url = 'https://example.com/shop/';

  it('prefers the custom logo, then the header logo, then og:image', () => {
    const html = page(
      `<header><img class="x" alt="Brand logo" src="/header.png"></header>
       <img src='/other.png'><img class="custom-logo wp-image-5" src="/wp-content/logo.svg">`,
      '<meta property="og:image" content="https://cdn.example.com/og.jpg">'
    );
    expect(locator.find(html, url)).toEqual({
      url: 'https://example.com/wp-content/logo.svg',
      source: 'custom-logo',
    });
    expect(
      locator.find(page('<header><img alt="Brand logo" src="header.png"></header>'), url)
    ).toEqual({
      url: 'https://example.com/shop/header.png',
      source: 'header-logo',
    });
    expect(
      locator.find(
        page('<p>hi</p>', '<meta property="og:image" content="/og.jpg?a=1&amp;b=2">'),
        url
      )
    ).toEqual({ url: 'https://example.com/og.jpg?a=1&b=2', source: 'og:image' });
  });

  it('skips header images that are not logos and unusable URLs', () => {
    expect(
      locator.find(page('<header><img src="/hero.jpg" alt="Hero"></header>'), url)
    ).toBeUndefined();
    expect(
      locator.find(page('<img class="custom-logo" src="data:image/png;base64,AAAA">'), url)
    ).toBeUndefined();
    expect(locator.find(page('<img class="custom-logo" src="http://[bad">'), url)).toBeUndefined();
    expect(locator.find(page('<img class="custom-logo">'), url)).toBeUndefined();
  });
});

describe('LogoLoader', () => {
  const files: FileReader = { read: jest.fn(() => Buffer.from('FILE')) };
  const fetcher = (html: string, type = 'image/png'): Fetcher => ({
    text: jest.fn(async () => html),
    bytes: jest.fn(async () => ({ data: Buffer.from('IMG'), type })),
  });

  it('loads a logo file as a data URI by its extension', async () => {
    const loader = new LogoLoader(fetcher(''), files);
    const logo = await loader.fromFile('logo.SVG');
    expect(logo).toEqual({
      dataUri: `data:image/svg+xml;base64,${Buffer.from('FILE').toString('base64')}`,
      source: 'file',
      origin: 'logo.SVG',
    });
    await expect(loader.fromFile('logo.bmp')).rejects.toThrow('must be PNG, JPG');
  });

  it('finds and downloads a logo from a live site', async () => {
    const f = fetcher(page('<img class="custom-logo" src="/logo.webp">'));
    const logo = await new LogoLoader(f, files).fromSite('https://example.com');
    expect(logo.dataUri.startsWith('data:image/webp;base64,')).toBe(true);
    expect(logo).toMatchObject({ source: 'custom-logo', origin: 'https://example.com/logo.webp' });
    expect(f.bytes).toHaveBeenCalledWith('https://example.com/logo.webp');
  });

  it('uses the response type when the URL has no known extension', async () => {
    const f = fetcher(
      page('<img class="custom-logo" src="/logo?id=3">'),
      'image/png; charset=binary'
    );
    const logo = await new LogoLoader(f, files).fromSite('https://example.com');
    expect(logo.dataUri.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('refuses non-http sites, missing logos and non-images', async () => {
    await expect(new LogoLoader(fetcher(''), files).fromSite('file:///etc/passwd')).rejects.toThrow(
      'http or https'
    );
    await expect(
      new LogoLoader(fetcher(page('<p>x</p>')), files).fromSite('https://example.com')
    ).rejects.toThrow('No logo found');
    await expect(
      new LogoLoader(
        fetcher(page('<img class="custom-logo" src="/x">'), 'text/html'),
        files
      ).fromSite('https://example.com')
    ).rejects.toThrow('is not an image');
    await expect(
      new LogoLoader(fetcher(page('<img class="custom-logo" src="/x">'), ''), files).fromSite(
        'https://example.com'
      )
    ).rejects.toThrow('unknown type');
  });
});
