/**
 * Contract tests for the branch types shared by the validators and CLAUDE.md.
 *
 * @module scripts/validation/__tests__/validate-branch-names.test.js
 */

const fs = require('fs');
const path = require('path');
const { ALLOWED_TYPES, validateBranchName } = require('../validate-branch-name.cjs');
const { ALLOWED_PREFIXES, isAllowed } = require('../validate-branch-name.js');

const EXPECTED_ALLOWED_TYPES = [
  'feat',
  'fix',
  'hotfix',
  'release',
  'refactor',
  'chore',
  'task',
  'doc',
  'docs',
  'test',
  'perf',
  'ci',
  'build',
  'deps',
  'security',
  'revert',
  'research',
  'design',
  'a11y',
  'ux',
  'i18n',
  'ops',
  'proto',
  'ds',
  'api',
  'schema',
  'telemetry',
  'content',
  'seo',
  'config',
  'migrate',
  'qa',
  'uat',
  'audit',
  'codex',
  'aiops',
  'automation',
  'epic',
];

/**
 * Extract the branch-type table from the canonical repository guidance.
 *
 * @param {string} markdown - CLAUDE.md contents.
 * @returns {{ type: string, example: string }[]} Documented table rows.
 */
function extractDocumentedBranchTypes(markdown) {
  const section = markdown.match(
    /### Allowed Type Values \(Use Exactly\)([\s\S]*?)### FORBIDDEN Prefixes/
  );

  if (!section) {
    throw new Error('CLAUDE.md is missing the allowed branch-type section');
  }

  return [...section[1].matchAll(/^\| `([a-z0-9]+)` .* \| `([^`]+)` \|$/gm)].map(
    ([, type, example]) => ({ type, example })
  );
}

/**
 * Extract the branch types from the portable branch-naming instructions.
 *
 * @param {string} markdown - branch-naming.instructions.md contents.
 * @returns {string[]} Documented branch types in display order.
 */
function extractInstructionBranchTypes(markdown) {
  const section = markdown.match(
    /## Allowed Branch Prefixes \(38 Types\)([\s\S]*?)## Pattern Breakdown/
  );

  if (!section) {
    throw new Error('branch-naming.instructions.md is missing the 38-type prefix section');
  }

  return [...section[1].matchAll(/`([a-z0-9]+)`/g)].map(([, type]) => type);
}

describe('branch type contract', () => {
  const claudeMd = fs.readFileSync(path.resolve(__dirname, '../../../CLAUDE.md'), 'utf8');
  const branchInstructions = fs.readFileSync(
    path.resolve(__dirname, '../../../instructions/branch-naming.instructions.md'),
    'utf8'
  );
  const documentedTypes = extractDocumentedBranchTypes(claudeMd);
  const instructionTypes = extractInstructionBranchTypes(branchInstructions);

  test('defines the exact 38 allowed types in both validators', () => {
    expect(ALLOWED_PREFIXES).toEqual(EXPECTED_ALLOWED_TYPES);
    expect(ALLOWED_TYPES).toEqual(EXPECTED_ALLOWED_TYPES);
    expect(new Set(EXPECTED_ALLOWED_TYPES).size).toBe(38);
  });

  test.each(EXPECTED_ALLOWED_TYPES)('accepts the %s type in both validators', (type) => {
    const branchName = `${type}/scope-title`;

    expect(isAllowed(branchName)).toBe(true);
    expect(validateBranchName(branchName)).toEqual({ valid: true });
  });

  test.each(['doc', 'aiops', 'automation', 'epic'])(
    'accepts the newly documented %s prefix',
    (type) => {
      const branchName = `${type}/quality-audit`;

      expect(isAllowed(branchName)).toBe(true);
      expect(validateBranchName(branchName).valid).toBe(true);
    }
  );

  test.each(['docx', 'ai-ops', 'automate', 'epics'])('rejects the near-miss %s prefix', (type) => {
    const branchName = `${type}/quality-audit`;

    expect(isAllowed(branchName)).toBe(false);
    expect(validateBranchName(branchName).valid).toBe(false);
  });

  test('keeps the CLAUDE.md type table aligned with both validators', () => {
    expect(documentedTypes.map(({ type }) => type)).toEqual(EXPECTED_ALLOWED_TYPES);
  });

  test('keeps the portable branch instructions aligned with the validators', () => {
    expect(instructionTypes).toEqual(EXPECTED_ALLOWED_TYPES);
    expect(new Set(instructionTypes).size).toBe(38);
  });

  test.each(documentedTypes)(
    'keeps the documented $type example valid: $example',
    ({ example }) => {
      expect(isAllowed(example)).toBe(true);
      expect(validateBranchName(example).valid).toBe(true);
    }
  );
});
