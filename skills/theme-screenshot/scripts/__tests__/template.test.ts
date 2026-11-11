import { fitLogo, ScreenshotTemplate } from '../lib/template';

const colours = {
  mode: 'light' as const,
  centre: '#ffffff',
  edge: '#eeeeee',
  accent: '#8d621f',
  industry: '#111111',
  label: '#888888',
};

describe('fitLogo', () => {
  it('fits a wide logo to the 560px width and a tall one to the 300px height', () => {
    expect(fitLogo({ width: 210, height: 50 }, true)).toEqual({ width: 560, height: 133 });
    expect(fitLogo({ width: 100, height: 400 }, true)).toEqual({ width: 75, height: 300 });
  });

  it('never enlarges a raster logo', () => {
    expect(fitLogo({ width: 210, height: 50 }, false)).toEqual({ width: 210, height: 50 });
    expect(fitLogo({ width: 1400, height: 700 }, false)).toEqual({ width: 560, height: 280 });
  });

  it('falls back to the box when the size is unknown', () => {
    expect(fitLogo({ width: 0, height: 0 }, true)).toEqual({ width: 560, height: 300 });
  });
});

describe('ScreenshotTemplate', () => {
  it('renders the logo, divider, industry and year, escaping the text', () => {
    const html = new ScreenshotTemplate().render({
      logoDataUri: 'data:image/png;base64,AAAA',
      logoSize: { width: 400, height: 100 },
      colours,
      industry: 'Tours <&> "Safari"',
      label: 'WordPress block theme',
      year: 2026,
    });
    expect(html).toContain('width: 1200px; height: 900px');
    expect(html).toContain('src="data:image/png;base64,AAAA"');
    expect(html).toContain('width: 400px; height: 100px');
    expect(html).toContain('radial-gradient(ellipse at 50% 45%, #ffffff 0%, #eeeeee 100%)');
    expect(html).toContain('Tours &#60;&#38;&#62; &#34;Safari&#34;');
    expect(html).toContain('WordPress block theme &middot; 2026');
    expect(html).not.toContain('<&>');
  });
});
