import { FluidClamp, runFluidClampCli } from '../fluid-clamp';

/** Evaluates the preferred calc() value of a clamp at a viewport width. */
function preferredPx(clamp: string, viewport: number): number {
  const match = clamp.match(/calc\((-?[\d.]+)vw ([+-]) ([\d.]+)rem\)/) as RegExpMatchArray;
  const slope = Number(match[1]);
  const intercept = Number(match[3]) * 16 * (match[2] === '-' ? -1 : 1);
  return (slope * viewport) / 100 + intercept;
}

function captureIo() {
  const out: string[] = [];
  const err: string[] = [];
  return {
    out,
    err,
    io: {
      stdout: (text: string) => out.push(text),
      stderr: (text: string) => err.push(text),
    },
  };
}

describe('FluidClamp', () => {
  const calculator = new FluidClamp();

  it('converts pixels to rem', () => {
    expect(calculator.toRem(12)).toBe('0.75rem');
    expect(calculator.toRem(0)).toBe('0rem');
  });

  it('hits the min and max at the mobile and desktop viewports', () => {
    const value = calculator.clamp(16, 24);

    expect(value).toBe('clamp(1rem, calc(0.762vw + 0.814rem), 1.5rem)');
    expect(preferredPx(value, 390)).toBeCloseTo(16, 1);
    expect(preferredPx(value, 1440)).toBeCloseTo(24, 1);
  });

  it('does not divide the vw slope by the root size', () => {
    // 40px to 120px grows 80px over 1050px: about 7.6vw, not 0.476vw.
    expect(calculator.clamp(40, 120)).toContain('7.619vw');
  });

  it('writes a negative intercept as a subtraction', () => {
    const value = calculator.clamp(8, 120);

    expect(value).toMatch(/calc\([\d.]+vw - [\d.]+rem\)/);
    expect(preferredPx(value, 390)).toBeCloseTo(8, 1);
  });

  it('returns a plain rem value when min and max match', () => {
    expect(calculator.clamp(24, 24)).toBe('1.5rem');
  });

  it('orders the bounds when a value shrinks on larger screens', () => {
    expect(calculator.clamp(24, 16)).toMatch(
      /^clamp\(1rem, calc\(-[\d.]+vw \+ [\d.]+rem\), 1\.5rem\)$/
    );
  });

  it('respects custom viewports, root size and precision', () => {
    const custom = new FluidClamp({
      minViewport: 320,
      maxViewport: 1280,
      rootSize: 10,
      precision: 1,
    });

    expect(custom.clamp(10, 20)).toBe('clamp(1rem, calc(1vw + 0.7rem), 2rem)');
  });

  it('maps rows to spacingSizes entries', () => {
    expect(calculator.spacingSizes([{ slug: '10', name: 'XS', min: 8, max: 8 }])).toEqual([
      { slug: '10', name: 'XS', size: '0.5rem' },
    ]);
  });

  it('rejects invalid options and values', () => {
    expect(() => new FluidClamp({ minViewport: 1440, maxViewport: 390 })).toThrow('maxViewport');
    expect(() => new FluidClamp({ rootSize: 0 })).toThrow('rootSize');
    expect(() => calculator.clamp(Number.NaN, 4)).toThrow('min');
    expect(() => calculator.clamp(4, Infinity)).toThrow('max');
  });
});

describe('runFluidClampCli', () => {
  it('prints a clamp for two values', () => {
    const { out, io } = captureIo();

    expect(runFluidClampCli(['16', '24'], io)).toBe(0);
    expect(out.join('')).toBe('clamp(1rem, calc(0.762vw + 0.814rem), 1.5rem)\n');
  });

  it('accepts viewport, root size and precision flags', () => {
    const { out, io } = captureIo();

    runFluidClampCli(
      [
        '10',
        '20',
        '--min-viewport',
        '320',
        '--max-viewport',
        '1280',
        '--root-size',
        '10',
        '--precision',
        '1',
      ],
      io
    );

    expect(out.join('')).toBe('clamp(1rem, calc(1vw + 0.7rem), 2rem)\n');
  });

  it('prints spacingSizes JSON for --json input', () => {
    const { out, io } = captureIo();

    runFluidClampCli(['--json', '[{"slug":"10","name":"XS","min":8,"max":8}]'], io);

    expect(JSON.parse(out.join(''))).toEqual([{ slug: '10', name: 'XS', size: '0.5rem' }]);
  });

  it('prints help', () => {
    const { out, io } = captureIo();

    expect(runFluidClampCli(['--help'], io)).toBe(0);
    expect(out.join('')).toContain('Usage: fluid-clamp');
  });

  it('reports usage errors', () => {
    const missingValue = captureIo();
    expect(runFluidClampCli(['--json'], missingValue.io)).toBe(1);
    expect(missingValue.err.join('')).toContain('--json needs a value');

    const wrongCount = captureIo();
    expect(runFluidClampCli(['16'], wrongCount.io)).toBe(1);
    expect(wrongCount.err.join('')).toContain('Pass a min and a max');
  });
});
