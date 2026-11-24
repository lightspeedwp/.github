import { Colour } from '../lib/colour';
import { CssLength } from '../lib/css-length';

describe('CssLength.toPx', () => {
  const at = (expression: string | undefined, viewport = 1440, extra = {}) =>
    CssLength.toPx(expression, { viewport, ...extra });

  it('converts units', () => {
    expect(at('12px')).toBe(12);
    expect(at('1.5rem')).toBe(24);
    expect(at('2em', 1440, { fontSize: 20 })).toBe(40);
    expect(at('2em')).toBe(32);
    expect(at('10vw', 390)).toBe(39);
    expect(at('10vh')).toBe(90);
    expect(at('1rem', 1440, { rootFontSize: 10 })).toBe(10);
    expect(at('0')).toBe(0);
    expect(at('.5rem')).toBe(8);
  });

  it('evaluates calc, clamp, min and max', () => {
    const fluid = 'clamp(1.125rem, calc(0.19vw + 1.079rem), 1.25rem)';
    expect(at(fluid, 390)).toBeCloseTo(18, 1);
    expect(at(fluid, 1440)).toBe(20);
    expect(at('calc(100px - 2 * 10px)')).toBe(80);
    expect(at('calc((100px + 20px) / 2)')).toBe(60);
    expect(at('calc(-1 * 10px)')).toBe(-10);
    expect(at('calc(-(10px))')).toBe(-10);
    expect(at('min(10px, 2rem)')).toBe(10);
    expect(at('max(10px, 2rem)')).toBe(32);
    expect(at('calc(0 + 4px)')).toBe(4);
    // Reversed bounds: the minimum wins.
    expect(at('clamp(32px, 24px, 16px)')).toBe(32);
  });

  it('returns null for what it cannot evaluate', () => {
    for (const bad of [
      undefined,
      '',
      '50%',
      'var(--x)',
      'auto',
      '2',
      'calc(10px * 2px)',
      'calc(10px / 2px)',
      'calc(10px / 0)',
      'calc(10px + 2)',
      'clamp(1px, 2px)',
      'calc(1px, 2px)',
      'calc(10px',
      '10px)',
      'calc()',
      '* 2',
      '10px 20px',
    ]) {
      expect(at(bad)).toBeNull();
    }
  });

  it('splits computed pixel lists', () => {
    expect(CssLength.pxList('10px 20.5px -1px')).toEqual([10, 20.5, -1]);
    expect(CssLength.pxList(undefined)).toEqual([]);
    expect(CssLength.pxList('auto 10px')).toEqual([10]);
  });
});

describe('Colour', () => {
  it('parses hex, rgb, rgba and transparent', () => {
    expect(Colour.hex(Colour.parse('#abc')!)).toBe('#aabbcc');
    expect(Colour.hex(Colour.parse('#ffffff80')!)).toBe('#ffffff80');
    expect(Colour.hex(Colour.parse('#0000')!)).toBe('#00000000');
    expect(Colour.hex(Colour.parse('rgb(10, 20, 30)')!)).toBe('#0a141e');
    expect(Colour.parse('rgba(0 0 0 / 50%)')!.a).toBe(0.5);
    expect(Colour.parse('rgba(0, 0, 0, 0.2)')!.a).toBe(0.2);
    expect(Colour.hex(Colour.parse('rgb(100%, 0%, 50%)')!)).toBe('#ff0080');
    expect(Colour.hex(Colour.parse('rgb(100% 0% 0% / 50%)')!)).toBe('#ff000080');
    expect(Colour.parse('transparent')!.a).toBe(0);
  });

  it('rejects anything else', () => {
    for (const bad of [undefined, '', 'red', 'rgb(1, 2)', 'rgb(a, b, c)', '#12']) {
      expect(Colour.parse(bad)).toBeNull();
    }
  });

  it('measures distance', () => {
    expect(Colour.distance(Colour.parse('#000')!, Colour.parse('#000')!)).toBe(0);
    expect(Math.round(Colour.distance(Colour.parse('#000')!, Colour.parse('#030000')!))).toBe(3);
  });
});
