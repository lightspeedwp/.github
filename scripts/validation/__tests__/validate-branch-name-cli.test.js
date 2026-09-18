import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { AUTHORIZED_TYPES } from '../../../lib/validate-branch-name.js';

const CLI_PATH = path.join(process.cwd(), 'scripts/validation/validate-branch-name.js');
const NEW_AUTHORIZED_TYPES = [
  'doc',
  'api',
  'schema',
  'telemetry',
  'content',
  'seo',
  'migrate',
  'qa',
  'uat',
  'aiops',
  'automation',
  'epic',
];

function runCli(...args) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env, NODE_NO_WARNINGS: '1' },
  });
}

describe('validate-branch-name CLI', () => {
  test('help lists the exact 38 authorised types', () => {
    const result = runCli('--help');
    const allowedTypesMatch = result.stdout.match(
      /Allowed Types \(38\):\s*([\s\S]*?)\n\nForbidden Prefixes:/
    );

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(allowedTypesMatch).not.toBeNull();
    expect(
      allowedTypesMatch[1]
        .split(',')
        .map((type) => type.trim())
        .filter(Boolean)
    ).toEqual(AUTHORIZED_TYPES);
  });

  test.each(NEW_AUTHORIZED_TYPES)('accepts newly authorised %s branches as JSON', (type) => {
    const branch = `${type}/scope-title`;
    const result = runCli('--branch', branch, '--json');

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      branch,
      valid: true,
      type,
      scope: 'scope',
      title: 'title',
      errors: [],
      suggested_name: null,
    });
  });

  test('returns exit code 1 and structured errors for an unauthorised near-match', () => {
    const result = runCli('--branch', 'epics/scope-title', '--json');
    const output = JSON.parse(result.stdout);

    expect(result.status).toBe(1);
    expect(result.stderr).toBe('');
    expect(output).toMatchObject({
      branch: 'epics/scope-title',
      valid: false,
      type: null,
      errors: ['invalid_type'],
    });
    expect(output.suggested_name).toBe('epic/scope-title');
  });
});
