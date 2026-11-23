/**
 * Evaluates CSS length expressions to pixels at a given viewport width, so a
 * fluid theme.json preset such as `clamp(1.5rem, calc(0.5vw + 1.4rem), 2rem)`
 * can be compared with the computed pixel value a browser reports.
 *
 * Supports px, rem, em, vw, vh and unitless numbers, with calc(), clamp(),
 * min(), max(), + - * / and parentheses. Anything else (%, var(), keywords)
 * returns null.
 */

export interface LengthContext {
  /** Viewport width in px. */
  viewport: number;
  /** Viewport height in px. Defaults to 900. */
  viewportHeight?: number;
  /** Root font size in px. Defaults to 16. */
  rootFontSize?: number;
  /** Element font size in px, for em. Defaults to the root font size. */
  fontSize?: number;
}

interface Value {
  n: number;
  /** True when the value is a length (px after conversion), false for a plain number. */
  length: boolean;
}

type Token =
  | { kind: 'num'; value: number; unit: string }
  | { kind: 'fn'; name: string }
  | { kind: 'op'; value: string };

export class CssLength {
  /** The pixel value of a CSS length expression, or null when it cannot be evaluated. */
  static toPx(expression: string | undefined, context: LengthContext): number | null {
    if (expression === undefined) {
      return null;
    }
    const text = expression.trim().toLowerCase();
    if (!text) {
      return null;
    }
    try {
      const tokens = CssLength.tokenize(text);
      const parser = new Parser(tokens, context);
      const result = parser.parseExpression();
      if (!parser.done()) {
        return null;
      }
      if (!result.length && result.n !== 0) {
        return null;
      }
      return Math.round(result.n * 1000) / 1000;
    } catch {
      return null;
    }
  }

  /** Splits a space-separated computed value such as `10px 20px` into its pixel numbers. */
  static pxList(value: string | undefined): number[] {
    if (!value) {
      return [];
    }
    return value
      .trim()
      .split(/\s+/)
      .map((part) => part.match(/^(-?[\d.]+)px$/))
      .filter((m): m is RegExpMatchArray => m !== null)
      .map((m) => Number(m[1]));
  }

  private static tokenize(text: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    while (i < text.length) {
      const rest = text.slice(i);
      const space = rest.match(/^\s+/);
      if (space) {
        i += space[0].length;
        continue;
      }
      const previous = tokens[tokens.length - 1];
      const signAllowed =
        !previous || (previous.kind === 'op' && previous.value !== ')') || previous.kind === 'fn';
      const number = rest.match(
        signAllowed ? /^[-+]?(\d*\.\d+|\d+\.?)([a-z%]*)/ : /^(\d*\.\d+|\d+\.?)([a-z%]*)/
      );
      if (number) {
        const value = parseFloat(number[0]);
        tokens.push({ kind: 'num', value, unit: number[2] });
        i += number[0].length;
        continue;
      }
      const fn = rest.match(/^(calc|clamp|min|max)\(/);
      if (fn) {
        tokens.push({ kind: 'fn', name: fn[1] });
        i += fn[0].length;
        continue;
      }
      if ('+-*/(),'.includes(rest[0])) {
        tokens.push({ kind: 'op', value: rest[0] });
        i += 1;
        continue;
      }
      throw new Error(`Unsupported CSS at "${rest}".`);
    }
    return tokens;
  }
}

class Parser {
  private position = 0;

  constructor(
    private readonly tokens: Token[],
    private readonly context: LengthContext
  ) {}

  done(): boolean {
    return this.position === this.tokens.length;
  }

  parseExpression(): Value {
    let left = this.parseTerm();
    for (;;) {
      const token = this.peek();
      if (token?.kind === 'op' && (token.value === '+' || token.value === '-')) {
        this.position++;
        const right = this.parseTerm();
        left = this.combineSum(left, right, token.value);
      } else {
        return left;
      }
    }
  }

  private parseTerm(): Value {
    let left = this.parseFactor();
    for (;;) {
      const token = this.peek();
      if (token?.kind === 'op' && (token.value === '*' || token.value === '/')) {
        this.position++;
        const right = this.parseFactor();
        if (token.value === '*') {
          if (left.length && right.length) {
            throw new Error('Cannot multiply two lengths.');
          }
          left = { n: left.n * right.n, length: left.length || right.length };
        } else {
          if (right.length || right.n === 0) {
            throw new Error('Can only divide by a non-zero number.');
          }
          left = { n: left.n / right.n, length: left.length };
        }
      } else {
        return left;
      }
    }
  }

  private parseFactor(): Value {
    const token = this.next();
    if (token.kind === 'num') {
      return this.convert(token.value, token.unit);
    }
    if (token.kind === 'fn') {
      const args = [this.parseExpression()];
      while (this.peekOp(',')) {
        this.position++;
        args.push(this.parseExpression());
      }
      this.expectOp(')');
      return this.applyFunction(token.name, args);
    }
    if (token.value === '(') {
      const inner = this.parseExpression();
      this.expectOp(')');
      return inner;
    }
    if (token.value === '-') {
      const inner = this.parseFactor();
      return { n: -inner.n, length: inner.length };
    }
    throw new Error(`Unexpected "${token.value}".`);
  }

  private applyFunction(name: string, args: Value[]): Value {
    const length = args.some((a) => a.length);
    const values = args.map((a) => a.n);
    if (name === 'calc') {
      if (args.length !== 1) {
        throw new Error('calc() takes one argument.');
      }
      return args[0];
    }
    if (name === 'min') {
      return { n: Math.min(...values), length };
    }
    if (name === 'max') {
      return { n: Math.max(...values), length };
    }
    if (args.length !== 3) {
      throw new Error('clamp() takes three arguments.');
    }
    return { n: Math.min(Math.max(values[1], values[0]), values[2]), length };
  }

  private convert(value: number, unit: string): Value {
    const root = this.context.rootFontSize ?? 16;
    switch (unit) {
      case '':
        return { n: value, length: false };
      case 'px':
        return { n: value, length: true };
      case 'rem':
        return { n: value * root, length: true };
      case 'em':
        return { n: value * (this.context.fontSize ?? root), length: true };
      case 'vw':
        return { n: (value * this.context.viewport) / 100, length: true };
      case 'vh':
        return { n: (value * (this.context.viewportHeight ?? 900)) / 100, length: true };
      default:
        throw new Error(`Unsupported unit ${unit}.`);
    }
  }

  private combineSum(left: Value, right: Value, op: string): Value {
    const zero = (v: Value) => !v.length && v.n === 0;
    if (left.length !== right.length && !zero(left) && !zero(right)) {
      throw new Error('Cannot add a length to a number.');
    }
    const n = op === '+' ? left.n + right.n : left.n - right.n;
    return { n, length: left.length || right.length };
  }

  private peek(): Token | undefined {
    return this.tokens[this.position];
  }

  private peekOp(value: string): boolean {
    const token = this.peek();
    return token?.kind === 'op' && token.value === value;
  }

  private next(): Token {
    const token = this.tokens[this.position++];
    if (!token) {
      throw new Error('Unexpected end of expression.');
    }
    return token;
  }

  private expectOp(value: string): void {
    if (!this.peekOp(value)) {
      throw new Error(`Expected "${value}".`);
    }
    this.position++;
  }
}
