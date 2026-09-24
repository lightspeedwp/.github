/**
 * Tests for scripts/babel/transform-import-meta-url.cjs (#3472).
 *
 * @babel/core 8 is ESM-only, so the transform runs in a child Node process
 * rather than being required under Jest's CommonJS runtime.
 */
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..', '..', '..');
const plugin = path.join(__dirname, '..', 'transform-import-meta-url.cjs');

function transform(code) {
  const script = `
    import { transformSync } from "@babel/core";
    const { code } = transformSync(process.env.CODE, {
      babelrc: false,
      configFile: false,
      filename: "/repo/example.js",
      plugins: [process.env.PLUGIN],
    });
    process.stdout.write(code);
  `;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, CODE: code, PLUGIN: plugin },
  });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout;
}

describe('transform-import-meta-url', () => {
  test('rewrites import.meta.url to the CommonJS equivalent', () => {
    expect(transform('const u = import.meta.url;')).toBe(
      'const u = require("node:url").pathToFileURL(__filename).href;'
    );
  });

  test('rewrites import.meta.url inside new URL()', () => {
    expect(transform('new URL("./a.json", import.meta.url);')).toContain(
      'new URL("./a.json", require("node:url").pathToFileURL(__filename).href)'
    );
  });

  test('leaves other import.meta properties untouched', () => {
    expect(transform('const d = import.meta.dirname;')).toContain('import.meta.dirname');
  });

  test('an ESM source that uses import.meta.url loads under Jest', () => {
    const {
      validateBranchName,
    } = require('../../../agents/pr-agent/skills/validate-branch-name/scripts/validate-branch-name.js');
    expect(typeof validateBranchName).toBe('function');
  });
});
