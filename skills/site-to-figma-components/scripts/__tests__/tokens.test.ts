import { Colour } from '../lib/color';
import { TokenIndex } from '../lib/tokens';
import { variables } from './fixtures';

describe('Colour', () => {
  it('parses hex, rgb and rgba in comma and space syntax', () => {
    expect(Colour.hex(Colour.parse('#abc')!)).toBe('#aabbcc');
    expect(Colour.parse('#11223380')!.a).toBeCloseTo(0.5, 2);
    expect(Colour.hex(Colour.parse('rgb(141, 98, 31)')!)).toBe('#8d621f');
    expect(Colour.parse('rgba(0, 0, 0, 0.25)')!.a).toBe(0.25);
    expect(Colour.parse('rgb(0 0 0 / 50%)')!.a).toBe(0.5);
    expect(Colour.hex({ r: 0, g: 0, b: 0, a: 0.5 })).toBe('#00000080');
  });

  it('returns null for anything else', () => {
    for (const value of [undefined, '', 'red', 'var(--x)', 'rgb(1, 2)', 'rgb(a, b, c)']) {
      expect(Colour.parse(value)).toBeNull();
    }
    expect(Colour.fromFigma(null)).toBeNull();
    expect(Colour.fromFigma({ r: 1 })).toBeNull();
    expect(Colour.fromFigma({ r: 1, g: 0, b: 0 })).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });

  it('measures distance and luminance', () => {
    const black = Colour.parse('#000')!;
    const white = Colour.parse('#fff')!;
    expect(Colour.distance(black, black)).toBe(0);
    expect(Colour.distance(black, white)).toBeCloseTo(441.67, 1);
    expect(Colour.luminance(white)).toBeCloseTo(1);
    expect(Colour.luminance(black)).toBe(0);
  });
});

describe('TokenIndex', () => {
  const index = new TokenIndex(variables());

  it('prefers semantic colour tokens by role', () => {
    expect(index.colour('rgb(141, 98, 31)', 'text')).toMatchObject({
      variable: 'text/link',
      match: 'exact',
      semantic: true,
      codeSyntax: 'var(--wp--custom--color--text--link)',
    });
    expect(index.colour('rgb(163, 23, 0)', 'fill')).toMatchObject({
      variable: 'action/cta/background',
    });
    expect(index.colour('rgb(255, 255, 255)', 'text')!.variable).toBe('text/inverse');
    expect(index.colour('rgb(255, 255, 255)', 'fill')!.variable).toBe('surface/default');
    expect(index.colour('rgb(138, 133, 128)', 'stroke')!.variable).toBe('border/default');
  });

  it('marks near matches and primitive-only matches, and skips prototype collections', () => {
    expect(index.colour('rgb(145, 100, 31)', 'text')!.match).toBe('near');
    expect(index.colour('rgb(245, 246, 240)', 'fill')).toMatchObject({
      variable: 'primary/100',
      semantic: false,
    });
    expect(index.colour('rgb(1, 2, 3)', 'fill')).toBeUndefined();
    expect(index.colour('not a colour', 'fill')).toBeUndefined();
  });

  it('matches sizes in the Max mode, within a tolerance', () => {
    expect(index.length(40, 'spacing')).toMatchObject({
      variable: 'Padding/40',
      match: 'exact',
      semantic: true,
    });
    expect(index.length(41, 'spacing')!.match).toBe('near');
    expect(index.length(30, 'spacing')).toBeUndefined();
    expect(index.length(0, 'spacing')).toBeUndefined();
    expect(index.length(undefined, 'radius')).toBeUndefined();
    expect(index.length(8, 'radius')!.variable).toBe('Radius Base');
    expect(index.length(16, 'font-size')!.codeSyntax).toBe('var(--wp--preset--font-size--200)');
    expect(new TokenIndex().length(16, 'font-size')).toBeUndefined();
  });

  it('matches font families by name, loosely', () => {
    expect(index.font('Moret')).toMatchObject({
      variable: 'Font-Families/Primary',
      match: 'exact',
    });
    expect(index.font('moret_regular')!.match).toBe('near');
    expect(index.font('Lora')).toBeUndefined();
    expect(index.font(undefined)).toBeUndefined();
  });

  it('matches box shadows to drop shadow effect styles', () => {
    expect(index.shadow('rgba(0, 0, 0, 0.2) 0px 2px 4px 0px')!.variable).toBe('LSX/xSmall');
    expect(index.shadow('0px 2px 4px rgba(0, 0, 0, 0.2), 0 0 1px red')!.variable).toBe(
      'LSX/xSmall'
    );
    expect(index.shadow('0px 9px 9px red')).toBeUndefined();
    expect(index.shadow('none')).toBeUndefined();
    expect(index.shadow(undefined)).toBeUndefined();
    expect(TokenIndex.parseShadow('inset red')).toBeNull();
    expect(TokenIndex.parseShadow('1px 2px')).toEqual({ x: 1, y: 2, blur: 0, spread: 0 });
  });

  it('counts what it indexed and recognises size families', () => {
    expect(index.size).toBeGreaterThan(15);
    expect(new TokenIndex().size).toBe(0);
    expect(TokenIndex.familyOf('Theme - Typography', 'Line-Heights/Body')).toBeUndefined();
    expect(TokenIndex.familyOf('Theme - Custom', 'Spacing/Button/Medium/Gap')).toBe('spacing');
  });

  it('can include collections that are skipped by default', () => {
    expect(new TokenIndex(variables(), /^none$/).colour('rgb(1, 2, 3)', 'fill')!.variable).toBe(
      'card/bg'
    );
  });
});
