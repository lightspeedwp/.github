/**
 * Small text helpers shared by the checks: line numbers, JSON walking, PHP stripping.
 */

/** 1-based line of a character offset. */
export function lineAt(text: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) {
      line++;
    }
  }
  return line;
}

/**
 * Best-effort line of a JSON path: finds each key in turn, after the previous one.
 * Returns undefined when a key cannot be found (for example an array index).
 */
export function lineOfPath(text: string, path: readonly string[]): number | undefined {
  let from = 0;
  let found = -1;
  for (const key of path) {
    if (/^\d+$/.test(key)) {
      continue;
    }
    const at = text.indexOf(JSON.stringify(key), from);
    if (at === -1) {
      return found === -1 ? undefined : lineAt(text, found);
    }
    found = at;
    from = at + 1;
  }
  return found === -1 ? undefined : lineAt(text, found);
}

export type JsonVisitor = (key: string, value: unknown, path: string[]) => void;

/** Calls `visit` for every property of every object in the tree (arrays use index keys). */
export function walkJson(value: unknown, visit: JsonVisitor, path: string[] = []): void {
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      visit(key, child, [...path, key]);
      walkJson(child, visit, [...path, key]);
    }
  }
}

export interface CssField {
  /** Path from the file root, for example ["styles", "blocks", "core/button", "css"]. */
  path: string[];
  css: string;
}

/** Every `css` string in a styles tree. */
export function cssFields(styles: unknown, prefix: string[] = ['styles']): CssField[] {
  const out: CssField[] = [];
  walkJson(styles, (key, value, path) => {
    if (key === 'css' && typeof value === 'string') {
      out.push({ path: [...prefix, ...path], css: value });
    }
  });
  return out;
}

/** The `styles` object of a parsed theme.json or partial, or undefined. */
export function stylesOf(json: unknown): unknown {
  return json && typeof json === 'object' ? (json as Record<string, unknown>).styles : undefined;
}

/**
 * Replaces every PHP block with `0` plus the newlines it held, so block markup inside a
 * pattern parses and lines still match. `0` is valid both inside a JSON string (a translated
 * label) and as a bare JSON value (`[<?php echo (int) $id; ?>]`).
 */
export function stripPhp(text: string): string {
  return text.replace(
    /<\?php[\s\S]*?(?:\?>|$)/g,
    (php) => '0' + '\n'.repeat(php.split('\n').length - 1)
  );
}

/** The file without its opening PHP docblock, so header prose is not tested as code. */
export function withoutHeader(text: string): string {
  return text.replace(
    /^(<\?php\s*)\/\*\*[\s\S]*?\*\//,
    (match, open: string) => open + '\n'.repeat(match.split('\n').length - open.split('\n').length)
  );
}

/** Converts a `*` wildcard pattern to an anchored regular expression. */
export function wildcard(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`);
}
