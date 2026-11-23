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
