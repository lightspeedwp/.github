/**
 * Pattern file checks: header fields, slugs, categories, nesting, escaping and text domain.
 */
import { lineAt, withoutHeader } from '../text';
import type { Finding, PatternFile, Theme } from '../types';
import { BaseCheck } from './base-check';

const INSERTER_VALUES = /^(true|false|yes|no)$/i;
const hidden = (p: PatternFile): boolean => /^(false|no)$/i.test(p.headers.Inserter ?? '');
const baseName = (p: PatternFile): string => p.path.replace(/^patterns\/|\.php$/g, '');

export class PatternHeaderCheck extends BaseCheck {
  readonly id = 'patterns/header';
  readonly severity = 'error' as const;
  readonly description = 'Every pattern has a Title and Slug, and a valid Inserter value.';

  run(theme: Theme): Finding[] {
    return theme.patterns.flatMap((p) => {
      const out: Finding[] = [];
      for (const field of ['Title', 'Slug']) {
        if (!p.headers[field]) {
          out.push(
            this.finding(
              p.path,
              `The header has no ${field}.`,
              `Add " * ${field}: …" to the opening docblock.`,
              { line: 1 }
            )
          );
        }
      }
      if (p.headers.Inserter !== undefined && !INSERTER_VALUES.test(p.headers.Inserter)) {
        out.push(
          this.finding(
            p.path,
            `Inserter is "${p.headers.Inserter}".`,
            'Use "Inserter: true" or "Inserter: false".',
            { line: 1 }
          )
        );
      }
      return out;
    });
  }
}

export class PatternRecommendedHeaderCheck extends BaseCheck {
  readonly id = 'patterns/header-recommended';
  readonly severity = 'warning' as const;
  readonly description =
    'Inserter patterns declare Categories and Viewport Width; every pattern states Inserter.';

  run(theme: Theme): Finding[] {
    return theme.patterns.flatMap((p) => {
      const missing = [
        ...(p.headers.Inserter === undefined ? ['Inserter'] : []),
        ...(hidden(p) ? [] : ['Categories', 'Viewport Width'].filter((f) => !p.headers[f])),
      ];
      return missing.length
        ? [
            this.finding(
              p.path,
              `The header has no ${missing.join(', ')}.`,
              'Add the missing fields (see wp-pattern-audit for the full header).',
              { line: 1 }
            ),
          ]
        : [];
    });
  }
}

export class PatternSlugCheck extends BaseCheck {
  readonly id = 'patterns/slug';
  readonly severity = 'error' as const;
  readonly description = 'Pattern slugs sit in the theme namespace and are unique.';

  run(theme: Theme): Finding[] {
    const seen = new Map<string, string>();
    return theme.patterns.flatMap((p) => {
      const slug = p.headers.Slug;
      if (!slug) {
        return [];
      }
      const out: Finding[] = [];
      if (!slug.startsWith(`${theme.namespace}/`)) {
        out.push(
          this.finding(
            p.path,
            `Slug "${slug}" is outside the "${theme.namespace}/" namespace.`,
            `Use "${theme.namespace}/${baseName(p)}".`,
            { line: 1 }
          )
        );
      }
      if (seen.has(slug)) {
        out.push(
          this.finding(
            p.path,
            `Slug "${slug}" is also used by ${seen.get(slug)}.`,
            'Give each pattern its own slug; WordPress keeps only one.',
            { line: 1 }
          )
        );
      }
      seen.set(slug, p.path);
      return out;
    });
  }
}

export class PatternSlugFilenameCheck extends BaseCheck {
  readonly id = 'patterns/slug-filename';
  readonly severity = 'warning' as const;
  readonly description = 'A pattern slug is "<namespace>/<file name>", so files are easy to find.';

  run(theme: Theme): Finding[] {
    return theme.patterns
      .filter(
        (p) =>
          p.headers.Slug?.startsWith(`${theme.namespace}/`) &&
          p.headers.Slug !== `${theme.namespace}/${baseName(p)}`
      )
      .map((p) =>
        this.finding(
          p.path,
          `Slug "${p.headers.Slug}" does not match the file name.`,
          `Rename the file to ${p.headers.Slug!.split('/')[1]}.php or the slug to ${theme.namespace}/${baseName(p)}.`,
          { line: 1 }
        )
      );
  }
}

export class PatternCategoryCheck extends BaseCheck {
  readonly id = 'patterns/category';
  readonly severity = 'error' as const;
  readonly description = 'Categories in the theme namespace are registered by the theme.';

  run(theme: Theme): Finding[] {
    const registered = this.registered(theme);
    return theme.patterns.flatMap((p) =>
      (p.headers.Categories ?? '')
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.startsWith(`${theme.namespace}/`) && !registered.has(c))
        .map((c) =>
          this.finding(
            p.path,
            `Category "${c}" is not registered.`,
            'Register it with register_block_pattern_category() on init (before priority 10), or the pattern lands in Uncategorised.',
            { line: 1 }
          )
        )
    );
  }

  /** Every "ns/slug" string in theme PHP that registers pattern categories. */
  private registered(theme: Theme): Set<string> {
    const out = new Set<string>();
    for (const file of theme.php.filter((f) =>
      f.text.includes('register_block_pattern_category')
    )) {
      for (const [, slug] of file.text.matchAll(/['"]([a-z0-9-]+\/[a-z0-9-]+)['"]/g)) {
        out.add(slug);
      }
    }
    return out;
  }
}

export class NestedPatternCheck extends BaseCheck {
  readonly id = 'patterns/nested-pattern';
  /*
   * A warning, not an error: nested references have been seen dropping on the front end
   * (wp-pattern-runtime-pitfalls), but a template → pattern → wp:pattern chain rendered
   * correctly on WordPress 7.1.5 (tas-theme /blog/, 2026-11-24). Verify, don't fail.
   */
  readonly severity = 'warning' as const;
  readonly description =
    'Pattern files avoid nested wp:pattern blocks, which can be dropped on the front end.';

  run(theme: Theme): Finding[] {
    return theme.patterns.flatMap((p) =>
      [...p.text.matchAll(/<!--\s+wp:pattern\s/g)].map((m) =>
        this.finding(
          p.path,
          'A wp:pattern block inside a pattern. It can be dropped on the front end in some render paths.',
          "Check the rendered page (not a WP-CLI do_blocks() test). Prefer require __DIR__ . '/<pattern>.php' to stack patterns.",
          {
            line: lineAt(p.text, m.index ?? 0),
          }
        )
      )
    );
  }
}

const I18N_CALL =
  /\b(__|_e|_x|_ex|_n|esc_html__|esc_html_e|esc_html_x|esc_attr__|esc_attr_e|esc_attr_x)\(/g;

export class PatternEscapingCheck extends BaseCheck {
  readonly id = 'patterns/escaping';
  readonly severity = 'error' as const;
  readonly description =
    'Patterns escape everything they echo, and only escape literal strings inside block JSON.';

  run(theme: Theme): Finding[] {
    return theme.patterns.flatMap((p) => {
      const src = withoutHeader(p.text);
      const out: Finding[] = [];
      for (const m of src.matchAll(/\becho\s+[^;]+;/g)) {
        if (!/^echo\s+(esc_(html|attr|url)\w*\(|wp_kses(_post)?\(|\(int\)|absint\()/.test(m[0])) {
          out.push(
            this.finding(
              p.path,
              `Unescaped output: ${m[0].slice(0, 60)}`,
              'Wrap it in esc_html(), esc_attr(), esc_url() or wp_kses_post().',
              { line: lineAt(src, m.index ?? 0) }
            )
          );
        }
      }
      for (const comment of src.matchAll(/<!-- \/?wp:[\s\S]*?-->/g)) {
        for (const call of comment[0].matchAll(/\besc_\w+\(\s*\S/g)) {
          if (!/^esc_(attr|html)(__|_x)\(\s*'$/.test(call[0])) {
            out.push(
              this.finding(
                p.path,
                `${call[0].replace(/\(\s*\S$/, '()')} inside block-comment JSON.`,
                'Only esc_attr__() / esc_html__() of a literal string belong there; esc_url() turns & into &#038; in the JSON.',
                {
                  line: lineAt(src, (comment.index ?? 0) + (call.index ?? 0)),
                }
              )
            );
          }
        }
      }
      return out;
    });
  }
}

export class PatternTextDomainCheck extends BaseCheck {
  readonly id = 'patterns/text-domain';
  readonly severity = 'error' as const;
  readonly description = 'Every translatable string in a pattern uses the theme text domain.';

  run(theme: Theme): Finding[] {
    return theme.patterns.flatMap((p) => {
      const src = withoutHeader(p.text);
      const out: Finding[] = [];
      for (const call of src.matchAll(I18N_CALL)) {
        const args = this.args(src, (call.index ?? 0) + call[0].length);
        const domain = args.at(-1);
        const expected = /_x$|_ex$/.test(call[1]) ? 3 : call[1] === '_n' ? 4 : 2;
        if (
          args.length < expected ||
          (domain !== `'${theme.textDomain}'` && domain !== `"${theme.textDomain}"`)
        ) {
          out.push(
            this.finding(
              p.path,
              `${call[1]}() ${args.length < expected ? 'has no text domain' : `uses ${domain}`}.`,
              `Pass '${theme.textDomain}' as the text domain.`,
              {
                line: lineAt(src, call.index ?? 0),
              }
            )
          );
        }
      }
      return out;
    });
  }

  /** The top-level arguments of a call, as raw trimmed source. */
  private args(src: string, start: number): string[] {
    const args: string[] = [];
    let depth = 0;
    let quote = '';
    let current = '';
    for (let i = start; i < src.length; i++) {
      const ch = src[i];
      if (quote) {
        current += ch;
        if (ch === '\\') {
          current += src[++i] ?? '';
        } else if (ch === quote) {
          quote = '';
        }
        continue;
      }
      if (ch === "'" || ch === '"') {
        quote = ch;
      } else if (ch === '(') {
        depth++;
      } else if (ch === ')') {
        if (depth === 0) {
          break;
        }
        depth--;
      } else if (ch === ',' && depth === 0) {
        args.push(current.trim());
        current = '';
        continue;
      }
      current += ch;
    }
    if (current.trim()) {
      args.push(current.trim());
    }
    return args;
  }
}
