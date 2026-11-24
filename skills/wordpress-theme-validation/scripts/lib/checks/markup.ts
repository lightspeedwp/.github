/**
 * Block markup checks: balanced delimiters, known block namespaces, no database IDs.
 */
import { lineAt } from '../text';
import type { Finding, Theme } from '../types';
import { BaseCheck } from './base-check';

export class MarkupParseCheck extends BaseCheck {
  readonly id = 'markup/parse';
  readonly severity = 'error' as const;
  readonly description = 'Block comments are balanced and their attributes are valid JSON.';

  run(theme: Theme): Finding[] {
    return this.markup(theme).flatMap((markup) =>
      markup
        .problems()
        .map((p) =>
          this.finding(
            markup.file.path,
            p.message,
            'Fix the block comment; the editor will show "This block contains unexpected or invalid content".',
            { line: p.line }
          )
        )
    );
  }
}

export class UnknownBlockCheck extends BaseCheck {
  readonly id = 'markup/unknown-block';
  readonly severity = 'warning' as const;
  readonly description =
    'Blocks come from core, the theme or a namespace the theme declares it depends on.';

  run(theme: Theme): Finding[] {
    const known = new Set(['core', theme.namespace, ...(theme.config.blockNamespaces ?? [])]);
    return this.markup(theme).flatMap((markup) =>
      markup
        .tokens()
        .filter((t) => t.kind !== 'close' && !known.has(t.name.split('/')[0]))
        .map((t) =>
          this.finding(
            markup.file.path,
            `${t.name} is not from core or a declared dependency.`,
            `Add "${t.name.split('/')[0]}" to blockNamespaces in .theme-validation.json if the theme relies on that plugin.`,
            { line: t.line }
          )
        )
    );
  }
}

/** Database IDs differ between local, staging and live: the same number is a different post. */
const DATABASE_IDS: [RegExp, string][] = [
  [/"(id|mediaId)":\s*(\d+|<\?php)/g, 'attachment ID in block attributes'],
  [/wp-image-[0-9<]/g, 'wp-image-{id} class'],
  [/"ref":\s*(\d+|<\?php)/g, 'navigation or synced-pattern post ID ("ref")'],
];

export class DatabaseIdCheck extends BaseCheck {
  readonly id = 'markup/database-id';
  readonly severity = 'error' as const;
  readonly description = 'Markup holds no attachment, menu or synced-pattern IDs.';

  run(theme: Theme): Finding[] {
    return [...theme.templates, ...theme.parts, ...theme.patterns].flatMap((file) =>
      DATABASE_IDS.flatMap(([pattern, label]) =>
        [...file.text.matchAll(pattern)].map((m) =>
          this.finding(
            file.path,
            `${label}: ${m[0]}`,
            'Reference media by its /wp-content/uploads/ path and navigation by its inner links; IDs do not match between environments.',
            {
              line: lineAt(file.text, m.index ?? 0),
            }
          )
        )
      )
    );
  }
}
