/**
 * Shared test data: a small theme.json in the LightSpeed structure and a
 * measurements file factory.
 */
import type { MeasureFile, Measurement } from '../measure-page';

export const themeJson = {
  version: 3,
  settings: {
    layout: { contentSize: '800px', wideSize: '1440px' },
    color: {
      palette: [
        { slug: 'base', color: '#ffffff' },
        { slug: 'contrast', color: '#0a0a0a' },
        { slug: 'brand-500', color: '#c8964f' },
        { slug: 'broken', color: 'var(--nope)' },
        { color: '#123456' },
      ],
    },
    spacing: {
      spacingSizes: [
        { slug: '10', size: '0.625rem' },
        { slug: '20', size: 'clamp(1.125rem, calc(0.19vw + 1.079rem), 1.25rem)' },
        { slug: '40', size: '2.5rem' },
      ],
    },
    typography: {
      fluid: true,
      fontSizes: [
        { slug: '100', size: '0.875rem' },
        { slug: '200', size: '1rem', fluid: false },
        { slug: '500', size: '2rem' },
        { slug: '600', size: '2.5rem', fluid: { min: '1.75rem', max: '2.5rem' } },
        { slug: '700', size: 'clamp(2rem, 4vw, 3rem)' },
      ],
      fontFamilies: [
        { slug: 'heading', fontFamily: 'Moret, Georgia, serif' },
        { slug: 'body', fontFamily: '"Argesta Display", Georgia, serif' },
      ],
    },
    border: {
      radiusSizes: [
        { slug: '0', size: '0' },
        { slug: '200', size: '8px' },
      ],
    },
    shadow: {
      presets: [
        { slug: '100', shadow: '0 2px 4px 0 var(--wp--custom--color--shadow--20)' },
        { slug: '200', shadow: 'inset 0 1px 2px #00000033, 0 0 1px 0 rgba(0, 0, 0, 0.1)' },
      ],
    },
    custom: {
      color: {
        text: {
          default: 'var(--wp--preset--color--contrast)',
          inverse: 'var(--wp--preset--color--base)',
        },
        surface: { accent: 'var(--wp--preset--color--brand-500)' },
        shadow: { 20: '#09090933' },
      },
      fontWeight: { regular: 400, bold: 700 },
      lineHeight: { tight: 1.1, normal: '1.5', loose: '2rem' },
      letterSpacing: { wide: '0.05em' },
      borderWidth: { thin: '1px' },
      motion: { fast: '150ms' },
      flag: true,
    },
  },
};

export function measurement(partial: Partial<Measurement> & { name: string }): Measurement {
  return {
    selector: `.${partial.name.replace(/\s+/g, '-')}`,
    width: 1440,
    state: 'default',
    found: true,
    rect: { width: 300, height: 40 },
    styles: {},
    ...partial,
  };
}

export function measureFile(
  measurements: Measurement[],
  partial: Partial<MeasureFile> = {}
): MeasureFile {
  return {
    url: 'https://www.example.com/',
    side: 'live',
    measuredAt: '2026-11-23T10:00:00.000Z',
    widths: [1440],
    properties: [],
    measurements,
    screenshots: [],
    failures: [],
    ...partial,
  };
}

export function memoryDeps(files: Record<string, string> = {}) {
  const written: Record<string, string> = {};
  const out: string[] = [];
  const err: string[] = [];
  return {
    written,
    out,
    err,
    deps: {
      readFile: (path: string) => {
        if (!(path in files)) {
          throw new Error(`ENOENT ${path}`);
        }
        return files[path];
      },
      writeFile: (path: string, content: string) => {
        written[path] = content;
      },
      stdout: (text: string) => {
        out.push(text);
      },
      stderr: (text: string) => {
        err.push(text);
      },
    },
  };
}
