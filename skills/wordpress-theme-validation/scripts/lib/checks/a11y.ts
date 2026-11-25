/**
 * Accessibility basics that can be read from files: h1 count, heading order, image alt text.
 */
import type { BlockMarkup, FlatBlock } from '../block-markup';
import type { Finding, Theme } from '../types';
import { BaseCheck } from './base-check';

/** Heading level of a block, or undefined when it is not a heading. */
function headingLevel(block: FlatBlock): number | undefined {
  const level = typeof block.attrs.level === 'number' ? block.attrs.level : undefined;
  switch (block.name) {
    case 'core/heading':
    case 'core/post-title':
      return level ?? 2;
    case 'core/query-title':
      return level ?? 1;
    default:
      return undefined;
  }
}

/** Templates and page starters (patterns for post content): each is a whole page. */
function pages(theme: Theme, markup: BlockMarkup[]): BlockMarkup[] {
  return markup.filter(
    (m) =>
      m.file.path.startsWith('templates/') ||
      theme.patterns.some(
        (p) => p.path === m.file.path && /core\/post-content/.test(p.headers['Block Types'] ?? '')
      )
  );
}

export class SingleH1Check extends BaseCheck {
  readonly id = 'a11y/single-h1';
  readonly severity = 'warning' as const;
  readonly description = 'A template or page starter has at most one h1.';

  run(theme: Theme): Finding[] {
    return pages(theme, this.markup(theme)).flatMap((m) => {
      const count = m.blocks().filter((b) => headingLevel(b) === 1).length;
      return count > 1
        ? [
            this.finding(
              m.file.path,
              `${count} h1 headings.`,
              'Keep one h1 (the page title); make the rest h2.'
            ),
          ]
        : [];
    });
  }
}

export class HeadingOrderCheck extends BaseCheck {
  readonly id = 'a11y/heading-order';
  readonly severity = 'warning' as const;
  readonly description = 'Heading levels do not skip (h2 → h4) within a file.';

  run(theme: Theme): Finding[] {
    return this.markup(theme).flatMap((m) => {
      const levels = m
        .blocks()
        .map(headingLevel)
        .filter((l): l is number => l !== undefined);
      const out: Finding[] = [];
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] > levels[i - 1] + 1) {
          out.push(
            this.finding(
              m.file.path,
              `h${levels[i - 1]} is followed by h${levels[i]}.`,
              `Use h${levels[i - 1] + 1}, and style it with a font-size preset if it must look smaller.`
            )
          );
        }
      }
      return out;
    });
  }
}

export class ImageAltCheck extends BaseCheck {
  readonly id = 'a11y/image-alt';
  readonly severity = 'error' as const;
  readonly description = 'Every <img> has an alt attribute (empty for decorative images).';

  run(theme: Theme): Finding[] {
    return this.markup(theme).flatMap((m) =>
      m
        .blocks()
        .flatMap((b) =>
          [...b.html.matchAll(/<img\b[^>]*>/g)]
            .filter(([img]) => !/\salt=/.test(img))
            .map(([img]) => ({ b, img }))
        )
        .map(({ b, img }) =>
          this.finding(
            m.file.path,
            `${b.name} has an image with no alt attribute.`,
            'Add alt text, or alt="" if the image is decorative.',
            { line: m.lineOf(img) }
          )
        )
    );
  }
}
