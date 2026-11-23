/**
 * Compares the live and local measurements of the same named elements and
 * lists every difference: elements missing on one side, box sizes, and each
 * computed property per width and state. The Markdown output is the
 * "Differences from live" table for the pull request; fix what you can and
 * explain the rest.
 *
 * Usage:
 *   npx tsx diff-measurements.ts live.json local.json --out diff.json --report diff.md [--tolerance 1]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { Colour } from './lib/colour';
import { CssLength } from './lib/css-length';
import { TokenMatcher } from './lib/token-matcher';
import type { MeasureFile, Measurement, MeasureState } from './measure-page';

export type DifferenceKind = 'missing-local' | 'missing-live' | 'value';

export interface Difference {
  name: string;
  width: number;
  state: MeasureState;
  kind: DifferenceKind;
  property?: string;
  live?: string;
  local?: string;
}

export class MeasurementDiff {
  /**
   * @param tolerancePx Lengths within this many px count as equal. Box sizes
   *   also allow 2% so content-driven widths do not flood the report.
   */
  constructor(private readonly tolerancePx = 1) {}

  compare(live: MeasureFile, local: MeasureFile): Difference[] {
    const index = (file: MeasureFile) =>
      new Map(file.measurements.map((m) => [`${m.name}|${m.width}|${m.state}`, m]));
    const liveIndex = index(live);
    const localIndex = index(local);
    const keys = [...new Set([...liveIndex.keys(), ...localIndex.keys()])];
    const differences: Difference[] = [];

    for (const key of keys) {
      const a = liveIndex.get(key);
      const b = localIndex.get(key);
      const ref = (a ?? b) as Measurement;
      const base = { name: ref.name, width: ref.width, state: ref.state };
      if (ref.state !== 'default') {
        // Hover and focus entries hold only what changed. Compare each side's effective value:
        // its own default with its own change on top.
        const defaultKey = `${ref.name}|${ref.width}|default`;
        const liveDefault = liveIndex.get(defaultKey);
        const localDefault = localIndex.get(defaultKey);
        if (!liveDefault?.found || !localDefault?.found) {
          continue; // Already reported as missing.
        }
        const changed = [
          ...new Set([...Object.keys(a?.styles ?? {}), ...Object.keys(b?.styles ?? {})]),
        ];
        const effective = (defaults: Measurement, delta?: Measurement) =>
          Object.fromEntries(
            changed
              .map((p) => [p, delta?.styles?.[p] ?? defaults.styles?.[p]])
              .filter((entry): entry is [string, string] => entry[1] !== undefined)
          );
        differences.push(
          ...this.compareStyles(base, effective(liveDefault, a), effective(localDefault, b))
        );
        continue;
      }
      if (!a?.found || !b?.found) {
        if (a?.found || b?.found) {
          differences.push({ ...base, kind: a?.found ? 'missing-local' : 'missing-live' });
        }
        continue;
      }
      if (a.rect && b.rect) {
        for (const dimension of ['width', 'height'] as const) {
          const x = a.rect[dimension];
          const y = b.rect[dimension];
          if (Math.abs(x - y) > Math.max(this.tolerancePx * 2, Math.max(x, y) * 0.02)) {
            differences.push({
              ...base,
              kind: 'value',
              property: `box ${dimension}`,
              live: `${x}px`,
              local: `${y}px`,
            });
          }
        }
      }
      differences.push(...this.compareStyles(base, a.styles ?? {}, b.styles ?? {}));
    }
    return differences.sort(
      (x, y) => x.name.localeCompare(y.name) || x.width - y.width || x.state.localeCompare(y.state)
    );
  }

  private compareStyles(
    base: { name: string; width: number; state: MeasureState },
    live: Record<string, string>,
    local: Record<string, string>
  ): Difference[] {
    const out: Difference[] = [];
    for (const property of new Set([...Object.keys(live), ...Object.keys(local)])) {
      const x = live[property];
      const y = local[property];
      if (x === undefined || y === undefined || !this.same(property, x, y)) {
        out.push({
          ...base,
          kind: 'value',
          property,
          live: x ?? '(unchanged)',
          local: y ?? '(unchanged)',
        });
      }
    }
    return out;
  }

  same(property: string, a: string, b: string): boolean {
    const x = a.trim();
    const y = b.trim();
    if (x === y) {
      return true;
    }
    const ca = Colour.parse(x);
    const cb = Colour.parse(y);
    if (ca && cb) {
      return Colour.distance(ca, cb) <= 2;
    }
    if (property === 'font-family') {
      return TokenMatcher.fontKey(x) === TokenMatcher.fontKey(y);
    }
    const la = CssLength.pxList(x);
    const lb = CssLength.pxList(y);
    const allLengths = (s: string, list: number[]) =>
      list.length > 0 && list.length === s.split(/\s+/).length;
    if (allLengths(x, la) && allLengths(y, lb) && la.length === lb.length) {
      return la.every((n, i) => Math.abs(n - lb[i]) <= this.tolerancePx);
    }
    return x.toLowerCase() === y.toLowerCase();
  }

  /**
   * Why the two captures can't be fully compared: widths that failed on
   * either side, or widths measured on one side only. Empty when complete.
   */
  static gaps(live: MeasureFile, local: MeasureFile): string[] {
    const gaps: string[] = [];
    for (const [side, file] of [
      ['live', live],
      ['local', local],
    ] as const) {
      for (const f of file.failures ?? []) {
        gaps.push(`${side} failed at ${f.width}px (${f.error})`);
      }
    }
    const measured = (file: MeasureFile) => new Set(file.measurements.map((m) => m.width));
    const liveWidths = measured(live);
    const localWidths = measured(local);
    for (const width of [...new Set([...live.widths, ...local.widths])].sort((x, y) => x - y)) {
      if (liveWidths.has(width) !== localWidths.has(width)) {
        gaps.push(`${width}px measured on ${liveWidths.has(width) ? 'live' : 'local'} only`);
      }
    }
    if (!live.measurements.length || !local.measurements.length) {
      gaps.push(`no measurements on ${live.measurements.length ? 'local' : 'live'}`);
    }
    return gaps;
  }

  static markdown(
    live: MeasureFile,
    local: MeasureFile,
    differences: Difference[],
    gaps: string[] = []
  ): string {
    const lines = ['# Differences from live', '', `Live: ${live.url} · Local: ${local.url}`, ''];
    if (gaps.length) {
      lines.push(
        `**Incomplete comparison:** ${gaps.join('; ')}. Re-measure before relying on this report.`,
        ''
      );
    }
    lines.push(
      differences.length
        ? `${differences.length} differences. Fix each one, or keep it and say why (for example, the nearest token was used).`
        : gaps.length
          ? 'No differences in what was compared.'
          : 'No differences found within tolerance.',
      ''
    );
    if (differences.length) {
      lines.push(
        '| Element | Width | State | Property | Live | Local |',
        '| --- | --- | --- | --- | --- | --- |'
      );
      const cell = (s?: string) => (s ? `\`${s.replace(/\|/g, '\\|')}\`` : '');
      for (const d of differences) {
        const property =
          d.kind === 'value'
            ? d.property
            : d.kind === 'missing-local'
              ? 'missing on local'
              : 'missing on live';
        lines.push(
          `| ${d.name.replace(/\|/g, '\\|')} | ${d.width} | ${d.state} | ${property} | ${cell(d.live)} | ${cell(d.local)} |`
        );
      }
      lines.push('');
    }
    return lines.join('\n');
  }
}

export interface DiffCliDeps {
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

const USAGE =
  'Usage: diff-measurements <live.json> <local.json> [--out diff.json] [--report diff.md] [--tolerance 1]\n';

export function runDiffCli(argv: string[], deps: DiffCliDeps): number {
  const files: string[] = [];
  const values: Record<string, string> = { out: 'diff.json', report: 'diff.md', tolerance: '1' };
  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      if (arg === '--help' || arg === '-h') {
        deps.stdout(USAGE);
        return 0;
      }
      if (!arg.startsWith('--')) {
        files.push(arg);
        continue;
      }
      const key = arg.slice(2);
      const value = argv[++i];
      if (!(key in values)) {
        throw new Error(`Unknown argument ${arg}.`);
      }
      if (value === undefined) {
        throw new Error(`${arg} needs a value.`);
      }
      values[key] = value;
    }
    if (files.length !== 2) {
      throw new Error('Give the live and the local measurements files.');
    }
    const tolerance = Number(values.tolerance);
    if (!Number.isFinite(tolerance) || tolerance < 0) {
      throw new Error('--tolerance must be a number of px, 0 or more.');
    }
    const [live, local] = files.map((f) => JSON.parse(deps.readFile(f)) as MeasureFile);
    const differences = new MeasurementDiff(tolerance).compare(live, local);
    const gaps = MeasurementDiff.gaps(live, local);
    deps.writeFile(values.out, `${JSON.stringify({ gaps, differences }, null, 2)}\n`);
    deps.writeFile(values.report, MeasurementDiff.markdown(live, local, differences, gaps));
    if (gaps.length) {
      deps.stderr(`diff-measurements: incomplete comparison: ${gaps.join('; ')}. Re-measure.\n`);
      return 1;
    }
    deps.stdout(`${differences.length} differences. Wrote ${values.out} and ${values.report}\n`);
    return 0;
  } catch (error) {
    deps.stderr(`diff-measurements: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(
    runDiffCli(process.argv.slice(2), {
      readFile: (path) => readFileSync(path, 'utf8'),
      writeFile: (path, content) => writeFileSync(path, content),
      stdout: (text) => process.stdout.write(text),
      stderr: (text) => process.stderr.write(text),
    })
  );
}
