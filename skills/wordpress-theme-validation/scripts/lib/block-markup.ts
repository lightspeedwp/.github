/**
 * Reads serialised block markup: delimiter tokens (for balance and attribute checks, with
 * line numbers) and the block tree from WordPress's own parser (for content checks).
 */
import { parse } from '@wordpress/block-serialization-default-parser';
import { lineAt, stripPhp } from './text';
import type { ThemeFile } from './types';

export interface BlockToken {
  name: string;
  kind: 'open' | 'close' | 'void';
  /** Raw attribute JSON, if any. */
  attrs?: string;
  line: number;
}

export interface MarkupProblem {
  line: number;
  message: string;
}

export interface FlatBlock {
  name: string;
  attrs: Record<string, unknown>;
  /** The block's own HTML, without its inner blocks. */
  html: string;
}

const DELIMITER =
  /<!--\s+(\/)?wp:([a-z][a-z0-9_-]*(?:\/[a-z][a-z0-9_-]*)?)\s+(\{[\s\S]*?\}\s+)?(\/)?-->/g;

/** Block names without a namespace belong to core. */
export function fullName(name: string): string {
  return name.includes('/') ? name : `core/${name}`;
}

export class BlockMarkup {
  /** The markup with PHP replaced, so patterns read like templates. */
  readonly source: string;

  constructor(readonly file: ThemeFile) {
    this.source = file.path.endsWith('.php') ? stripPhp(file.text) : file.text;
  }

  tokens(): BlockToken[] {
    return [...this.source.matchAll(DELIMITER)].map((match) => ({
      name: fullName(match[2]),
      kind: match[1] ? 'close' : match[4] ? 'void' : 'open',
      attrs: match[3]?.trim(),
      line: lineAt(this.source, match.index ?? 0),
    }));
  }

  /** Unbalanced delimiters and attribute JSON that does not parse. */
  problems(): MarkupProblem[] {
    const problems: MarkupProblem[] = [];
    const stack: BlockToken[] = [];
    for (const token of this.tokens()) {
      if (token.attrs !== undefined) {
        try {
          JSON.parse(token.attrs);
        } catch {
          problems.push({
            line: token.line,
            message: `wp:${token.name} has attributes that are not valid JSON`,
          });
        }
      }
      if (token.kind === 'open') {
        stack.push(token);
      } else if (token.kind === 'close') {
        const open = stack.pop();
        if (!open) {
          problems.push({
            line: token.line,
            message: `closing wp:${token.name} has no opening comment`,
          });
        } else if (open.name !== token.name) {
          problems.push({
            line: token.line,
            message: `closing wp:${token.name} does not match wp:${open.name} opened on line ${open.line}`,
          });
        }
      }
    }
    for (const open of stack) {
      problems.push({ line: open.line, message: `wp:${open.name} is never closed` });
    }
    return problems;
  }

  /** Every block in document order, flattened. The parser is lenient: it never throws. */
  blocks(): FlatBlock[] {
    const tree = parse(this.source);
    const out: FlatBlock[] = [];
    const visit = (blocks: ReturnType<typeof parse>): void => {
      for (const block of blocks) {
        if (block.blockName) {
          out.push({
            name: fullName(block.blockName),
            attrs: (block.attrs ?? {}) as Record<string, unknown>,
            html: block.innerContent
              .filter((part): part is string => typeof part === 'string')
              .join(''),
          });
        }
        visit(block.innerBlocks);
      }
    };
    visit(tree);
    return out;
  }

  /** Line of the first match of `needle` at or after `from`, or undefined. */
  lineOf(needle: string | RegExp, from = 0): number | undefined {
    const index =
      typeof needle === 'string'
        ? this.source.indexOf(needle, from)
        : this.source.slice(from).search(needle);
    if (index === -1) {
      return undefined;
    }
    return lineAt(this.source, typeof needle === 'string' ? index : index + from);
  }
}
