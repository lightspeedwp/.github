import { ColourPlanner, ThemePalette } from '../lib/palette';

const themeJson = {
  settings: {
    color: {
      palette: [
        { slug: 'base', color: '#ffffff' },
        { slug: 'contrast', color: '#0a0a0a' },
        { slug: 'brand-600', color: '#8d621f' },
        { slug: 'broken', color: 12 },
      ],
    },
  },
};

describe('ThemePalette', () => {
  it('reads palette entries from a theme.json and ignores malformed ones', () => {
    const palette = ThemePalette.fromThemeJson(themeJson);
    expect(palette.get('base')?.toHex()).toBe('#ffffff');
    expect(palette.get('broken')).toBeUndefined();
    expect(palette.firstOf(['brand-500', 'brand-600'])?.toHex()).toBe('#8d621f');
    expect(palette.firstOf(['nope'])).toBeUndefined();
  });

  it('is empty when the theme.json has no palette', () => {
    expect(ThemePalette.fromThemeJson({}).get('base')).toBeUndefined();
    expect(ThemePalette.fromThemeJson(null).get('base')).toBeUndefined();
  });
});

describe('ColourPlanner', () => {
  const palette = ThemePalette.fromThemeJson(themeJson);

  it('picks the mode from the logo unless one is requested', () => {
    const planner = new ColourPlanner(palette);
    expect(planner.chooseMode('auto', 0.9)).toBe('dark');
    expect(planner.chooseMode('auto', 0.2)).toBe('light');
    expect(planner.chooseMode('light', 0.9)).toBe('light');
  });

  it('plans light colours from base, contrast and the brand step', () => {
    const colours = new ColourPlanner(palette).plan('light');
    expect(colours).toMatchObject({ mode: 'light', accent: '#8d621f' });
    expect(colours.centre).toBe('#ffffff');
    expect(colours.edge).not.toBe(colours.centre);
  });

  it('plans dark colours on the contrast colour', () => {
    const colours = new ColourPlanner(palette).plan('dark');
    expect(colours.mode).toBe('dark');
    expect(colours.edge).toBe('#080808');
    expect(colours.label).toBe('#8d621f');
  });

  it('applies overrides and falls back to black and white without a palette', () => {
    const colours = new ColourPlanner(new ThemePalette(), {
      base: '#f0e8dc',
      accent: '#ff0000',
      contrast: 'not a colour',
    }).plan('light');
    expect(colours.accent).toBe('#ff0000');
    expect(colours.edge).not.toBe('#ffffff');
    const bare = new ColourPlanner(new ThemePalette()).plan('dark');
    expect(bare.accent).toBe('#000000');
  });
});
