/**
 * Loads a block theme's files into a Theme model through an injected FileSystem.
 */
import { basename, join } from 'node:path';
import type { FileSystem } from './file-system';
import type { JsonFile, PatternFile, Theme, ThemeFile, ValidationConfig } from './types';

/** Folders never entered: dependencies, builds and tooling hold other projects' files. */
const SKIP_DIRS = new Set([
  'node_modules',
  'vendor',
  'build',
  'dist',
  'coverage',
  '.git',
  'test',
  'tests',
]);

export const CONFIG_FILE = '.theme-validation.json';

export class ThemeReader {
  constructor(private readonly fs: FileSystem) {}

  read(root: string): Theme {
    const config = this.config(root);
    const styleCss = this.file(root, 'style.css');
    const textDomain =
      config.textDomain ??
      styleCss?.text.match(/^\s*\*?\s*Text Domain:\s*([\w-]+)/im)?.[1] ??
      basename(root);
    const themeJsonText = this.fs.readText(join(root, 'theme.json'));

    return {
      root,
      config,
      textDomain,
      namespace: config.namespace ?? textDomain,
      styleCss,
      themeJson: themeJsonText === undefined ? undefined : this.json('theme.json', themeJsonText),
      partials: this.walk(root, 'styles', /\.json$/).map((file) => this.json(file.path, file.text)),
      templates: this.walk(root, 'templates', /\.html$/),
      parts: this.walk(root, 'parts', /\.html$/),
      patterns: this.walk(root, 'patterns', /\.php$/).map((file) => this.pattern(file)),
      php: [
        ...['functions.php'].flatMap((name) => this.file(root, name) ?? []),
        ...this.walk(root, 'inc', /\.php$/),
      ],
    };
  }

  private config(root: string): ValidationConfig {
    const text = this.fs.readText(join(root, CONFIG_FILE));
    if (text === undefined) {
      return {};
    }
    try {
      return JSON.parse(text) as ValidationConfig;
    } catch (error) {
      throw new Error(`${CONFIG_FILE} is not valid JSON: ${(error as Error).message}`, {
        cause: error,
      });
    }
  }

  private file(root: string, path: string): ThemeFile | undefined {
    const text = this.fs.readText(join(root, path));
    return text === undefined ? undefined : { path, text };
  }

  private json(path: string, text: string): JsonFile {
    try {
      return { path, text, json: JSON.parse(text) };
    } catch (error) {
      return { path, text, json: undefined, parseError: (error as Error).message };
    }
  }

  private pattern(file: ThemeFile): PatternFile {
    const headers: Record<string, string> = {};
    const docblock = file.text.match(/^<\?php\s*\/\*\*([\s\S]*?)\*\//)?.[1] ?? '';
    for (const [, key, value] of docblock.matchAll(/^\s*\*\s*([A-Z][A-Za-z ]+?):\s*(.*?)\s*$/gm)) {
      headers[key] = value;
    }
    return { ...file, headers };
  }

  /** Theme-relative files under `dir` whose name matches, in path order. */
  private walk(root: string, dir: string, pattern: RegExp): ThemeFile[] {
    const found: ThemeFile[] = [];
    const visit = (relative: string): void => {
      for (const entry of this.fs.listDir(join(root, relative))) {
        const path = `${relative}/${entry.name}`;
        if (entry.isDirectory) {
          if (!SKIP_DIRS.has(entry.name)) {
            visit(path);
          }
        } else if (pattern.test(entry.name)) {
          const text = this.fs.readText(join(root, path));
          if (text !== undefined) {
            found.push({ path, text });
          }
        }
      }
    };
    visit(dir);
    return found.sort((a, b) => a.path.localeCompare(b.path));
  }
}
