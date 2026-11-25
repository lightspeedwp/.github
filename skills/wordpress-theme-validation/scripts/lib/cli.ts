/**
 * Parses arguments, runs the validator and returns the exit code.
 * 0: no errors. 1: errors found (or the allow-list debt grew). 2: usage problem.
 */
import { join, resolve } from 'node:path';
import { allChecks } from './checks';
import type { FileSystem } from './file-system';
import { type Format, Reporter } from './reporter';
import { Runner } from './runner';
import { BundledSchemaSource } from './schema-source';
import { ThemeReader } from './theme-reader';

export interface CliIo {
  fs: FileSystem;
  stdout(text: string): void;
  stderr(text: string): void;
  /** Folder of bundled schemas. */
  schemaDir: string;
}

export const USAGE = `Usage: validate-theme <theme-path> [--format text|json] [--only id,…] [--schema <file>] [--list]
  --only    Run only these checks. An id prefix ("styles") runs the whole group.
  --schema  Validate against this theme.json schema instead of the bundled copy.
  --list    List the checks and exit.
`;

export class Cli {
  constructor(private readonly io: CliIo) {}

  run(argv: string[]): number {
    let root: string | undefined;
    let format: Format = 'text';
    let only: string[] = [];
    let schema: string | undefined;
    let list = false;

    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      if (arg === '--help' || arg === '-h') {
        this.io.stdout(USAGE);
        return 0;
      }
      if (arg === '--list') {
        list = true;
        continue;
      }
      if (['--format', '--only', '--schema'].includes(arg)) {
        const value = argv[++i];
        if (value === undefined) {
          return this.usage(`${arg} needs a value.`);
        }
        if (arg === '--format') {
          if (value !== 'text' && value !== 'json') {
            return this.usage(`Unknown format "${value}".`);
          }
          format = value;
        } else if (arg === '--only') {
          only = value
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean);
        } else {
          schema = resolve(value);
        }
        continue;
      }
      if (arg.startsWith('-') || root !== undefined) {
        return this.usage(`Unexpected argument "${arg}".`);
      }
      root = arg;
    }

    const checks = allChecks(new BundledSchemaSource(this.io.fs, this.io.schemaDir, schema));
    if (list) {
      this.io.stdout(
        checks
          .map((c) => `${c.id.padEnd(30)} ${c.severity.padEnd(8)} ${c.description}`)
          .join('\n') + '\n'
      );
      return 0;
    }
    if (root === undefined) {
      return this.usage('Give the theme folder.');
    }
    const themeRoot = resolve(root);
    if (this.io.fs.readText(join(themeRoot, 'style.css')) === undefined) {
      return this.usage(`${themeRoot} has no style.css, so it is not a theme folder.`);
    }

    let theme;
    try {
      theme = new ThemeReader(this.io.fs).read(themeRoot);
    } catch (error) {
      this.io.stderr(`${(error as Error).message}\n`);
      return 2;
    }
    const result = new Runner(checks).run(theme, only);
    this.io.stdout(new Reporter(format).render(themeRoot, result));
    return result.errors > 0 || result.exceeded.length > 0 ? 1 : 0;
  }

  private usage(message: string): number {
    this.io.stderr(`${message}\n${USAGE}`);
    return 2;
  }
}
