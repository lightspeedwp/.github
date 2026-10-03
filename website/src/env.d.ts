/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'astro:content' {
  export const defineCollection: (config: any) => any;
  export * from 'zod';
}

declare module 'marked' {
  export const marked: any;
  export class Renderer {
    heading: any;
    parser: any;
  }
}
