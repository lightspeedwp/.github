/**
 * Fluid clamp() calculator for theme.json spacing and size presets.
 *
 * Turns a min and max pixel value into a rem-based clamp() that scales
 * linearly between a mobile and a desktop viewport (390px and 1440px by
 * default, the LightSpeed Figma frame widths).
 *
 * Usage:
 *   npx tsx fluid-clamp.ts 16 24
 *   npx tsx fluid-clamp.ts 16 24 --min-viewport 360 --max-viewport 1280
 *   npx tsx fluid-clamp.ts --json '[{"slug":"10","name":"XS","min":8,"max":12}]'
 */

import { pathToFileURL } from 'node:url';

export interface FluidClampOptions {
  minViewport?: number;
  maxViewport?: number;
  rootSize?: number;
  precision?: number;
}

export interface FluidSizeInput {
  slug: string;
  name: string;
  min: number;
  max: number;
}

export interface SpacingSize {
  slug: string;
  name: string;
  size: string;
}

export class FluidClamp {
  private readonly minViewport: number;
  private readonly maxViewport: number;
  private readonly rootSize: number;
  private readonly precision: number;

  constructor(options: FluidClampOptions = {}) {
    this.minViewport = options.minViewport ?? 390;
    this.maxViewport = options.maxViewport ?? 1440;
    this.rootSize = options.rootSize ?? 16;
    this.precision = options.precision ?? 3;

    if (this.maxViewport <= this.minViewport) {
      throw new Error('maxViewport must be larger than minViewport.');
    }
    if (this.rootSize <= 0) {
      throw new Error('rootSize must be a positive number.');
    }
  }

  /** Converts pixels to a rem string, for example 12 -> "0.75rem". */
  toRem(px: number): string {
    return `${this.round(px / this.rootSize)}rem`;
  }

  /**
   * Builds clamp(min, calc(intercept + slope vw), max).
   *
   * The slope is the growth per 1vw, in px, so the vw term is not divided by
   * the root size. Only the intercept and the bounds are rem values.
   */
  clamp(minPx: number, maxPx: number): string {
    this.assertFinite(minPx, 'min');
    this.assertFinite(maxPx, 'max');

    if (minPx === maxPx) {
      return this.toRem(minPx);
    }

    const low = Math.min(minPx, maxPx);
    const high = Math.max(minPx, maxPx);
    const slopePerVw = ((maxPx - minPx) / (this.maxViewport - this.minViewport)) * 100;
    const interceptPx = minPx - (slopePerVw * this.minViewport) / 100;
    const sign = interceptPx < 0 ? '-' : '+';
    const intercept = this.toRem(Math.abs(interceptPx));
    const slope = this.round(slopePerVw);

    // calc() puts the vw term first so a negative intercept reads naturally.
    return `clamp(${this.toRem(low)}, calc(${slope}vw ${sign} ${intercept}), ${this.toRem(high)})`;
  }

  /** Maps a list of Figma rows to theme.json spacingSizes entries. */
  spacingSizes(rows: FluidSizeInput[]): SpacingSize[] {
    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      size: this.clamp(row.min, row.max),
    }));
  }

  private round(value: number): number {
    const factor = 10 ** this.precision;
    const rounded = Math.round(value * factor) / factor;
    return Object.is(rounded, -0) ? 0 : rounded;
  }

  private assertFinite(value: number, label: string): void {
    if (!Number.isFinite(value)) {
      throw new Error(`${label} must be a finite number of pixels.`);
    }
  }
}

export interface CliIo {
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

/** Parses CLI arguments and prints the result. Returns the exit code. */
export function runFluidClampCli(argv: string[], io: CliIo): number {
  const options: FluidClampOptions = {};
  const positional: string[] = [];
  let json: string | undefined;

  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      const next = (): string => {
        const value = argv[++i];
        if (value === undefined) {
          throw new Error(`${arg} needs a value.`);
        }
        return value;
      };

      if (arg === '--min-viewport') {
        options.minViewport = Number(next());
      } else if (arg === '--max-viewport') {
        options.maxViewport = Number(next());
      } else if (arg === '--root-size') {
        options.rootSize = Number(next());
      } else if (arg === '--precision') {
        options.precision = Number(next());
      } else if (arg === '--json') {
        json = next();
      } else if (arg === '--help' || arg === '-h') {
        io.stdout(
          'Usage: fluid-clamp <minPx> <maxPx> [--min-viewport 390] [--max-viewport 1440] [--root-size 16] [--precision 3]\n' +
            '       fluid-clamp --json \'[{"slug":"10","name":"XS","min":8,"max":12}]\'\n'
        );
        return 0;
      } else {
        positional.push(arg);
      }
    }

    const calculator = new FluidClamp(options);

    if (json !== undefined) {
      const rows = JSON.parse(json) as FluidSizeInput[];
      io.stdout(`${JSON.stringify(calculator.spacingSizes(rows), null, '\t')}\n`);
      return 0;
    }

    if (positional.length !== 2) {
      throw new Error('Pass a min and a max pixel value, or --json.');
    }

    io.stdout(`${calculator.clamp(Number(positional[0]), Number(positional[1]))}\n`);
    return 0;
  } catch (error) {
    io.stderr(`fluid-clamp: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runFluidClampCli(process.argv.slice(2), {
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  });
}
