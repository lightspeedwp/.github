/**
 * @jest-environment node
 *
 * Uses the Node environment: eslint's flat-config Linter needs
 * structuredClone, which the repo-default jsdom environment does not
 * expose. This file has no DOM usage.
 */
import { describe, expect, it } from '@jest/globals';
import { Linter } from 'eslint';

import config from '../eslint.config.js';

const lint = (source) =>
  new Linter({ configType: 'flat' }).verify(source, config, {
    filename: 'fixture.js',
  });

describe('ESLint flat configuration', () => {
  it('accepts supported Node and Jest globals in modern ES modules', () => {
    const messages = lint(`
      describe('runtime', () => {
        it('uses Node globals', () => {
          const cwd = process.cwd();
          const payload = Buffer.from(cwd);
          expect(payload.length).toBeGreaterThan(0);
        });
      });

      export const readValue = (input) => input?.value ?? null;
      console.warn('warning');
      console.error('error');
    `);

    expect(messages).toEqual([]);
  });

  it('parses top-level await as modern module syntax', () => {
    const messages = lint(`
      const value = await Promise.resolve('ready');
      export { value };
    `);

    expect(messages).toEqual([]);
  });

  it('applies the recommended rules to undefined identifiers', () => {
    const messages = lint('missingApi();');

    expect(messages).toEqual([
      expect.objectContaining({
        ruleId: 'no-undef',
        severity: 2,
      }),
    ]);
  });

  it('warns for unapproved console methods while allowing warn and error', () => {
    const messages = lint(`
      console.log('debug');
      console.info('information');
      console.debug('diagnostic');
      console.warn('warning');
      console.error('error');
    `);

    expect(messages.map(({ ruleId, severity }) => ({ ruleId, severity }))).toEqual([
      { ruleId: 'no-console', severity: 1 },
      { ruleId: 'no-console', severity: 1 },
      { ruleId: 'no-console', severity: 1 },
    ]);
  });

  it('reports unused local variables even when prefixed with an underscore', () => {
    const messages = lint('const _unused = true;');

    expect(messages).toEqual([
      expect.objectContaining({
        ruleId: 'no-unused-vars',
        severity: 2,
        message: expect.stringContaining('_unused'),
      }),
    ]);
  });

  it('requires const and rejects var declarations', () => {
    const ruleIds = lint(`
      let fixed = 1;
      var count = 0;
      count += fixed;
      console.error(count);
    `).map(({ ruleId }) => ruleId);

    expect(ruleIds).toEqual(expect.arrayContaining(['no-var', 'prefer-const']));
  });

  it('ignores intentionally unused arguments prefixed with an underscore', () => {
    const messages = lint(`
      const handler = (payload, _context) => payload;
      handler(null, 'value');
    `);

    expect(messages).toEqual([]);
  });

  it('reports unused arguments without the underscore convention', () => {
    const messages = lint(`
      const handler = (payload, context) => payload;
      handler(null, 'value');
    `);

    expect(messages).toEqual([
      expect.objectContaining({
        ruleId: 'no-unused-vars',
        severity: 2,
        message: expect.stringContaining('context'),
      }),
    ]);
  });
});
