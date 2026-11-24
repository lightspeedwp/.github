import { ThemeTokens } from '../lib/theme-tokens';
import { themeJson } from './fixtures';

describe('ThemeTokens', () => {
  const theme = ThemeTokens.fromThemeJson([themeJson]);
  const token = (cssVar: string) => theme.tokens.find((t) => t.cssVar === cssVar)!;

  it('collects presets with block markup references', () => {
    expect(token('--wp--preset--spacing--20')).toMatchObject({
      family: 'spacing',
      preset: 'var:preset|spacing|20',
      semantic: false,
    });
    expect(token('--wp--preset--border-radius--200').preset).toBe('var:preset|border-radius|200');
    expect(token('--wp--preset--shadow--100').family).toBe('shadow');
    expect(token('--wp--preset--font-family--body').family).toBe('font-family');
    expect(theme.list('color').some((t) => t.raw === '#123456')).toBe(false);
  });

  it('flattens custom values into semantic tokens in kebab case', () => {
    expect(token('--wp--custom--color--text--default')).toMatchObject({
      family: 'color',
      semantic: true,
    });
    expect(token('--wp--custom--font-weight--bold').raw).toBe('700');
    expect(token('--wp--custom--line-height--normal').family).toBe('line-height');
    expect(theme.tokens.some((t) => t.cssVar.includes('motion'))).toBe(false);
    expect(ThemeTokens.kebab('scrollArrowSize')).toBe('scroll-arrow-size');
    expect(ThemeTokens.kebab('3xl')).toBe('3-xl');
    expect(ThemeTokens.kebab('brand-500')).toBe('brand-500');
    expect(ThemeTokens.kebab('h1')).toBe('h-1');
    expect(ThemeTokens.kebab('XLHeading')).toBe('xl-heading');
  });

  it('resolves var() chains and fallbacks', () => {
    expect(theme.resolve('var(--wp--custom--color--text--default)')).toBe('#0a0a0a');
    expect(theme.resolve('var(--missing, 4px)')).toBe('4px');
    expect(theme.resolve('var(--missing)')).toBe('var(--missing)');
    expect(theme.colour(token('--wp--custom--color--surface--accent'))).not.toBeNull();
    expect(theme.colour(token('--wp--preset--color--broken'))).toBeNull();
  });

  it('stops resolving a reference loop', () => {
    const looped = ThemeTokens.fromThemeJson([
      {
        settings: {
          custom: { color: { a: 'var(--wp--custom--color--b)', b: 'var(--wp--custom--color--a)' } },
        },
      },
    ]);
    expect(looped.resolve('var(--wp--custom--color--a)')).toMatch(/var\(/);
  });

  it('evaluates lengths at the viewport', () => {
    expect(theme.lengthPx(token('--wp--preset--spacing--20'), 390)).toBeCloseTo(18, 1);
    expect(theme.lengthPx(token('--wp--preset--spacing--20'), 1440)).toBe(20);
    expect(theme.lengthPx(token('--wp--custom--letter-spacing--wide'), 1440, 20)).toBe(1);
  });

  it('follows WordPress fluid typography', () => {
    const size = (slug: string, viewport: number) =>
      theme.fontSizePx(token(`--wp--preset--font-size--${slug}`), viewport);
    // 14px is at the minimum font size limit, so it stays static.
    expect(size('100', 390)).toBe(14);
    // fluid: false stays static.
    expect(size('200', 390)).toBe(16);
    // 32px: factor 1 - 0.075 * log2(32) = 0.625, so 20px at 320px rising to 32px at the 1440px wide size.
    expect(size('500', 320)).toBe(20);
    expect(size('500', 1440)).toBe(32);
    expect(size('500', 880)).toBe(26);
    // Explicit min and max.
    expect(size('600', 320)).toBe(28);
    expect(size('600', 1600)).toBe(40);
    // A preset that is already a clamp() is evaluated as written.
    expect(size('700', 390)).toBe(32);
    expect(size('700', 1440)).toBe(48);
  });

  it('uses the fluid settings and limits', () => {
    const custom = ThemeTokens.fromThemeJson([
      {
        settings: {
          typography: {
            fluid: { minViewportWidth: '400px', maxViewportWidth: '1200px', minFontSize: '18px' },
            fontSizes: [
              { slug: 'a', size: '20px' },
              { slug: 'b', size: 'oops' },
            ],
          },
        },
      },
    ]);
    const a = custom.list('font-size')[0];
    // 20px * (1 - 0.075 * log2(20)) = 13.5, below the 18px limit, so the minimum is 18px.
    expect(custom.fontSizePx(a, 400)).toBe(18);
    expect(custom.fontSizePx(a, 1200)).toBe(20);
    expect(custom.fontSizePx(custom.list('font-size')[1], 800)).toBeNull();
  });

  it('keeps font sizes static without fluid typography', () => {
    const plain = ThemeTokens.fromThemeJson([
      { settings: { typography: { fontSizes: [{ slug: 'x', size: '2rem' }] } } },
    ]);
    expect(plain.fontSizePx(plain.list('font-size')[0], 390)).toBe(32);
    expect(plain.lengthPx(plain.list('font-size')[0], 390)).toBe(32);
  });

  it('names preset variables the way core does', () => {
    const named = ThemeTokens.fromThemeJson([
      { settings: { typography: { fontSizes: [{ slug: '3xl', size: '3rem' }] } } },
    ]);
    expect(named.list('font-size')[0]).toMatchObject({
      cssVar: '--wp--preset--font-size--3-xl',
      preset: 'var:preset|font-size|3xl',
    });
  });

  it('resolves references to custom values outside the token families', () => {
    const custom = ThemeTokens.fromThemeJson([
      {
        settings: {
          custom: { sizes: { gutter: '24px' } },
          spacing: { spacingSizes: [{ slug: 'g', size: 'var(--wp--custom--sizes--gutter)' }] },
        },
      },
    ]);
    expect(custom.tokens.some((t) => t.cssVar.includes('sizes'))).toBe(false);
    expect(custom.lengthPx(custom.list('spacing')[0], 1440)).toBe(24);
  });

  it('honours preset fluid settings when global fluid typography is off', () => {
    const preset = ThemeTokens.fromThemeJson([
      {
        settings: {
          typography: {
            fontSizes: [
              { slug: 'a', size: '32px', fluid: { min: '20px', max: '32px' } },
              { slug: 'b', size: '12px', fluid: { max: '16px' } },
              { slug: 'c', size: '32px', fluid: {} },
            ],
          },
        },
      },
    ]);
    const [a, b, c] = preset.list('font-size');
    expect(preset.fontSizePx(a, 320)).toBe(20);
    expect(preset.fontSizePx(a, 1600)).toBe(32);
    // An explicit max skips the 14px minimum font size limit; the calculated minimum is floored at 14px.
    expect(preset.fontSizePx(b, 1600)).toBe(16);
    expect(preset.fontSizePx(b, 320)).toBe(14);
    // An empty fluid object does not turn fluid typography on.
    expect(preset.fontSizePx(c, 320)).toBe(32);
  });

  it('merges several documents, later ones replacing presets by slug', () => {
    const merged = ThemeTokens.fromThemeJson([
      themeJson,
      {
        settings: {
          spacing: {
            spacingSizes: [
              { slug: '10', size: '12px' },
              { slug: '90', size: '90px' },
            ],
          },
        },
      },
      'not json',
      { nope: true },
    ]);
    const spacing = merged.list('spacing').filter((t) => !t.semantic);
    expect(spacing.map((t) => t.slug)).toEqual(['20', '40', '10', '90']);
    expect(spacing.find((t) => t.slug === '10')!.raw).toBe('12px');
  });
});
