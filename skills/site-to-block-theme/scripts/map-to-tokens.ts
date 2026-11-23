/**
 * Maps every measured live value to the theme's tokens: colours to palette and
 * semantic custom colours, spacing, font sizes (fluid, per viewport), radii,
 * shadows, font families and the custom weight, line-height, letter-spacing
 * and border-width tokens.
 *
 * Writes a JSON mapping and a Markdown report. The report lists the values
 * with no exact token first: each needs a decision (use the nearest token and
 * note it under "Differences from live", or propose a new token for approval).
 *
 * Usage:
 *   npx tsx map-to-tokens.ts live.json --theme-json path/to/theme/theme.json \
 *     [--theme-json path/to/theme/styles/presets.json] --out tokens.json --report tokens.md
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { Match, MatchStatus, TokenMatcher, TokenRef } from './lib/token-matcher';
import { ThemeTokens } from './lib/theme-tokens';
import type { MeasureFile, MeasureState } from './measure-page';

export interface MappingRow {
  name: string;
  width: number;
  state: MeasureState;
  property: string;
  value: string;
  match: Match;
}

export interface Mapping {
  url: string;
  counts: Record<MatchStatus, number>;
  rows: MappingRow[];
}

export class TokenMapper {
  constructor(private readonly matcher: TokenMatcher) {}

  map(measure: MeasureFile): Mapping {
    const rows: MappingRow[] = [];
    const defaults = new Map<string, Record<string, string>>();
    for (const m of measure.measurements) {
      if (!m.found || !m.styles) {
        continue;
      }
      const key = `${m.name}|${m.width}`;
      if (m.state === 'default') {
        defaults.set(key, m.styles);
      }
      const context = { ...(defaults.get(key) ?? {}), ...m.styles };
      for (const [property, value] of Object.entries(m.styles)) {
        const match = this.matcher.match(property, value, m.width, context);
        if (match.status !== 'skip') {
          rows.push({ name: m.name, width: m.width, state: m.state, property, value, match });
        }
      }
    }
    const counts: Record<MatchStatus, number> = { exact: 0, near: 0, none: 0, skip: 0 };
    for (const row of rows) {
      counts[row.match.status]++;
    }
    return { url: measure.url, counts, rows };
  }

  static markdown(mapping: Mapping): string {
    const tokenText = (refs: TokenRef[]) =>
      refs.length ? refs.map((r) => `\`${r.preset ?? `var(${r.cssVar})`}\``).join(', ') : '-';
    const matchText = (match: Match): string =>
      match.parts
        ? match.parts
            .map((p) =>
              p.status === 'skip' ? '0' : `${tokenText(p.tokens)}${p.delta ? ` (${p.delta})` : ''}`
            )
            .join(' / ')
        : `${tokenText(match.tokens)}${match.delta ? ` (${match.delta})` : ''}`;
    const row = (r: MappingRow) =>
      `| ${r.name} | ${r.width} | ${r.state} | ${r.property} | \`${r.value.replace(/\|/g, '\\|')}\` | ${r.match.status} | ${matchText(r.match)} |`;
    const header =
      '| Element | Width | State | Property | Live value | Match | Token |\n| --- | --- | --- | --- | --- | --- | --- |';
    const open = mapping.rows.filter((r) => r.match.status !== 'exact');
    const exact = mapping.rows.filter((r) => r.match.status === 'exact');
    const lines = [
      `# Token mapping: ${mapping.url}`,
      '',
      `${mapping.counts.exact} exact, ${mapping.counts.near} near, ${mapping.counts.none} with no token.`,
      '',
      'Exact matches list every token with that value, semantic tokens first: pick the one whose role fits.',
      '',
      '## Needs a decision',
      '',
    ];
    if (open.length) {
      lines.push(
        'Use the nearest token and list it under "Differences from live", or propose a new token for approval. Never hardcode the value.',
        '',
        header,
        ...open.map(row)
      );
    } else {
      lines.push('Every value has an exact token.');
    }
    lines.push('', '## Exact', '', ...(exact.length ? [header, ...exact.map(row)] : ['None.']), '');
    return lines.join('\n');
  }
}

export interface MapCliDeps {
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

const USAGE =
  'Usage: map-to-tokens <live.json> --theme-json theme.json [--theme-json presets.json] [--out tokens.json] [--report tokens.md]\n';

export function runMapCli(argv: string[], deps: MapCliDeps): number {
  const themeFiles: string[] = [];
  let input: string | undefined;
  let out = 'tokens.json';
  let report = 'tokens.md';
  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      if (arg === '--help' || arg === '-h') {
        deps.stdout(USAGE);
        return 0;
      }
      if (!arg.startsWith('--')) {
        if (input) {
          throw new Error(`Unexpected argument ${arg}.`);
        }
        input = arg;
        continue;
      }
      const value = argv[++i];
      if (value === undefined) {
        throw new Error(`${arg} needs a value.`);
      }
      if (arg === '--theme-json') {
        themeFiles.push(value);
      } else if (arg === '--out') {
        out = value;
      } else if (arg === '--report') {
        report = value;
      } else {
        throw new Error(`Unknown argument ${arg}.`);
      }
    }
    if (!input) {
      throw new Error('Give the live measurements file.');
    }
    if (!themeFiles.length) {
      throw new Error('--theme-json is required.');
    }
    const theme = ThemeTokens.fromThemeJson(themeFiles.map((f) => JSON.parse(deps.readFile(f))));
    if (!theme.tokens.length) {
      throw new Error('No tokens found in the theme.json files given.');
    }
    const measure = JSON.parse(deps.readFile(input)) as MeasureFile;
    const mapping = new TokenMapper(new TokenMatcher(theme)).map(measure);
    deps.writeFile(out, `${JSON.stringify(mapping, null, 2)}\n`);
    deps.writeFile(report, TokenMapper.markdown(mapping));
    deps.stdout(
      `${mapping.counts.exact} exact, ${mapping.counts.near} near, ${mapping.counts.none} with no token. Wrote ${out} and ${report}\n`
    );
    return 0;
  } catch (error) {
    deps.stderr(`map-to-tokens: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(
    runMapCli(process.argv.slice(2), {
      readFile: (path) => readFileSync(path, 'utf8'),
      writeFile: (path, content) => writeFileSync(path, content),
      stdout: (text) => process.stdout.write(text),
      stderr: (text) => process.stderr.write(text),
    })
  );
}
