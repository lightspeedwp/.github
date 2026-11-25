import { BLACK, Rgb, WHITE } from '../lib/colour';

describe('Rgb', () => {
  it('parses short and long hex and rejects anything else', () => {
    expect(Rgb.parse('#fff')).toEqual(WHITE);
    expect(Rgb.parse(' #0a0a0A ')).toEqual(new Rgb(10, 10, 10));
    expect(Rgb.parse('red')).toBeUndefined();
    expect(Rgb.parse('#12')).toBeUndefined();
    expect(Rgb.parse(undefined)).toBeUndefined();
  });

  it('mixes, measures luminance and writes hex', () => {
    expect(BLACK.mix(WHITE, 0.5).toHex()).toBe('#808080');
    expect(WHITE.luminance()).toBeCloseTo(1, 5);
    expect(BLACK.luminance()).toBe(0);
    expect(new Rgb(10, 10, 10).luminance()).toBeLessThan(0.01);
    expect(new Rgb(1, 2, 3).toHex()).toBe('#010203');
  });
});
