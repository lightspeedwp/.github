// Declarations for modules the root typecheck cannot resolve. The website's own
// dependencies (Astro, marked 18) are installed under `website/`, not at the
// repository root, so only the exports the website source uses are declared here,
// with their real signatures, rather than as `any`. Anything else imported from
// these modules fails the typecheck until it is declared.

declare module 'astro:content' {
  import type { ZodType } from 'zod';

  export * from 'zod';

  interface CollectionConfig<Schema extends ZodType | undefined> {
    type?: 'content' | 'data' | 'content_layer';
    loader?: unknown;
    schema?: Schema | ((context: { image: () => ZodType }) => Schema);
  }

  export function defineCollection<Schema extends ZodType | undefined = undefined>(
    config: CollectionConfig<Schema>
  ): CollectionConfig<Schema>;
}

declare module 'marked' {
  export interface Token {
    type: string;
    raw: string;
    [key: string]: unknown;
  }

  /**
   * Options marked 18 accepts. `mangle` and `headerIds` are not listed: marked
   * 8 removed them, so passing either is an error.
   */
  export interface MarkedOptions {
    renderer?: Renderer;
    gfm?: boolean;
    breaks?: boolean;
    pedantic?: boolean;
    async?: boolean;
    silent?: boolean;
  }

  export class Renderer {
    constructor(options?: MarkedOptions);
    parser: {
      parse(tokens: unknown[]): string;
      parseInline(tokens: unknown[]): string;
    };
    heading(token: { text: string; depth: number; tokens: unknown[] }): string;
  }

  export const marked: {
    parse(src: string, options?: MarkedOptions): string | Promise<string>;
    lexer(src: string, options?: MarkedOptions): Token[];
  };
}
