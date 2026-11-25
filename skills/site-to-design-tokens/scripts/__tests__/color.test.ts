import { Color, RampBuilder, RAMP_STEPS, STEP_LIGHTNESS } from '../lib/color';

describe('Color', () => {
  it('parses hex, rgb() and rgba() values', () => {
    expect(Color.parse('#fff')?.toHex()).toBe('#ffffff');
    expect(Color.parse('#8D621F')?.toHex()).toBe('#8d621f');
    expect(Color.parse('#00000080')?.toHex()).toBe('#00000080');
    expect(Color.parse('rgb(141, 98, 31)')?.toHex()).toBe('#8d621f');
    expect(Color.parse('rgba(9, 9, 9, 0.25)')?.rgb.a).toBe(0.25);
    expect(Color.parse('rgb(9 9 9 / 50%)')?.rgb.a).toBe(0.5);
  });

  it('rejects values it cannot read', () => {
    expect(Color.parse('red')).toBeNull();
    expect(Color.parse('rgb(1, 2)')).toBeNull();
    expect(Color.parse('rgb(a, b, c)')).toBeNull();
  });

  it('round-trips through OKLCH', () => {
    for (const hex of ['#8d621f', '#565b3d', '#a31700', '#262423', '#ffffff', '#000000']) {
      const color = Color.parse(hex)!;
      expect(Color.fromOklch(color.toOklch()).toHex()).toBe(hex);
    }
    expect(Color.parse('#808080')!.toOklch().c).toBeLessThan(0.001);
  });

  it('measures WCAG contrast and perceptual distance', () => {
    const white = Color.parse('#ffffff')!;
    const black = Color.parse('#000000')!;
    expect(white.contrast(black)).toBeCloseTo(21, 1);
    expect(Color.parse('#8d621f')!.contrast(white)).toBeCloseTo(5.39, 2);
    expect(white.distance(white)).toBe(0);
    expect(white.distance(black)).toBeGreaterThan(90);
  });

  it('composites translucent colours over a background', () => {
    const overlay = Color.parse('rgba(0, 0, 0, 0.5)')!;
    expect(overlay.over(Color.parse('#ffffff')!).toHex()).toBe('#808080');
    expect(overlay.isOpaque).toBe(false);
  });

  it('reports colours outside sRGB', () => {
    expect(Color.fromOklch({ l: 0.9, c: 0.4, h: 140 }).inGamut).toBe(false);
    expect(Color.fromRgb({ r: 0.5, g: 0.5, b: 0.5, a: 1 }).inGamut).toBe(true);
  });
});

describe('RampBuilder', () => {
  const builder = new RampBuilder();

  it('keeps the anchor exactly at its nearest step', () => {
    const ramp = builder.build('#8d621f');

    expect(ramp.steps[ramp.anchorStep]).toBe('#8d621f');
    expect(ramp.anchorStep).toBe(600);
  });

  it('gets darker from 100 to 900 and stays in gamut', () => {
    for (const anchor of ['#565b3d', '#a31700', '#ce9e57', '#0047d0']) {
      const ramp = builder.build(anchor);
      const lightness = RAMP_STEPS.map((s) => Color.parse(ramp.steps[s])!.toOklch().l);
      for (let i = 1; i < lightness.length; i++) {
        expect(lightness[i]).toBeLessThan(lightness[i - 1]);
      }
      for (const step of RAMP_STEPS) {
        expect(ramp.steps[step]).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it('caps chroma for neutral ramps', () => {
    const ramp = builder.build('#8a8580', { maxChroma: 0.01 });
    expect(Color.parse(ramp.steps[100])!.toOklch().c).toBeLessThan(0.012);
  });

  it('finds the nearest step and rejects bad anchors', () => {
    expect(builder.nearestStep(STEP_LIGHTNESS[300])).toBe(300);
    expect(builder.nearestStep(1)).toBe(100);
    expect(builder.nearestStep(0)).toBe(900);
    expect(() => builder.build('olive')).toThrow('Not a colour');
  });
});
