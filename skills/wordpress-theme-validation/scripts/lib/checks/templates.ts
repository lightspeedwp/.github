/**
 * Template checks: hierarchy names, template-part references and pattern references.
 */
import { basename } from 'node:path';
import type { Finding, Theme } from '../types';
import { BaseCheck } from './base-check';

/** Template hierarchy names, including WooCommerce's block templates. */
const HIERARCHY =
  /^(index|home|front-page|singular|single|page|archive|author|category|tag|taxonomy|date|search|404|attachment|embed|privacy-policy|blank|(single|page|archive|author|category|tag|taxonomy)-[a-z0-9_-]+|single-product|archive-product|product-search-results|order-confirmation|checkout-header|coming-soon|page-(cart|checkout))$/;

export class TemplateNameCheck extends BaseCheck {
  readonly id = 'templates/name';
  readonly severity = 'warning' as const;
  readonly description =
    'Template files follow the template hierarchy or are declared in customTemplates.';

  run(theme: Theme): Finding[] {
    const custom =
      ((theme.themeJson?.json ?? {}) as { customTemplates?: { name?: string }[] })
        .customTemplates ?? [];
    const declared = new Set(custom.map((t) => t?.name));
    return theme.templates
      .map((t) => t.path.replace(/^templates\/|\.html$/g, ''))
      .filter((name) => !HIERARCHY.test(name) && !declared.has(name))
      .map((name) =>
        this.finding(
          `templates/${name}.html`,
          `"${name}" is not a template hierarchy name and is not in customTemplates.`,
          'Rename it to a hierarchy name, or declare it in theme.json customTemplates.'
        )
      );
  }
}

export class TemplatePartRefCheck extends BaseCheck {
  readonly id = 'templates/part-ref';
  readonly severity = 'error' as const;
  readonly description = 'Every wp:template-part slug exists in parts/.';

  run(theme: Theme): Finding[] {
    const parts = new Set(theme.parts.map((p) => p.path.replace(/^parts\/|\.html$/g, '')));
    const themeSlug = basename(theme.root);
    return this.markup(theme).flatMap((markup) =>
      markup
        .tokens()
        .filter((t) => t.name === 'core/template-part' && t.kind !== 'close')
        .flatMap((t) => {
          const attrs = this.attrs(t.attrs);
          const slug = attrs.slug;
          const other = typeof attrs.theme === 'string' && attrs.theme !== themeSlug;
          return typeof slug === 'string' && !other && !parts.has(slug)
            ? [
                this.finding(
                  markup.file.path,
                  `Template part "${slug}" does not exist.`,
                  `Add parts/${slug}.html or fix the slug.`,
                  { line: t.line }
                ),
              ]
            : [];
        })
    );
  }

  private attrs(json: string | undefined): Record<string, unknown> {
    try {
      return json ? (JSON.parse(json) as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
}

export class PatternRefCheck extends BaseCheck {
  readonly id = 'templates/pattern-ref';
  readonly severity = 'error' as const;
  readonly description = 'Every wp:pattern slug in the theme namespace has a pattern file.';

  run(theme: Theme): Finding[] {
    const slugs = new Set(theme.patterns.map((p) => p.headers.Slug));
    return this.markup(theme).flatMap((markup) =>
      markup
        .tokens()
        .filter((t) => t.name === 'core/pattern' && t.kind !== 'close')
        .flatMap((t) => {
          const slug = t.attrs?.match(/"slug"\s*:\s*"([^"]+)"/)?.[1];
          return slug?.startsWith(`${theme.namespace}/`) && !slugs.has(slug)
            ? [
                this.finding(
                  markup.file.path,
                  `Pattern "${slug}" does not exist.`,
                  'Add the pattern file or fix the slug.',
                  { line: t.line }
                ),
              ]
            : [];
        })
    );
  }
}
