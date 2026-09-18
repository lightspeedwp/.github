/**
 * Contract tests for the branch types shared by the validators and CLAUDE.md.
 *
 * @module scripts/validation/__tests__/validate-branch-names.test.js
 */

const fs = require('fs');
const path = require('path');
const { ALLOWED_TYPES, validateBranchName } = require('../validate-branch-name.cjs');

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

/**
 * Extract branch names from a fenced example block in a Markdown section.
 *
 * @param {string} markdown - Markdown section containing example lines.
 * @returns {string[]} Branch names in display order.
 */
function extractBranchExamples(markdown) {
  return [...markdown.matchAll(/^([a-z][a-z0-9-]*\/[a-z0-9.-]+)\s{2,}/gm)].map(
    ([, branch]) => branch
  );
}

describe('branch type contract', () => {
  const claudeMd = fs.readFileSync(path.resolve(__dirname, '../../../CLAUDE.md'), 'utf8');
  const branchInstructions = fs.readFileSync(
    path.resolve(__dirname, '../../../instructions/branch-naming.instructions.md'),
    'utf8'
  );
  const agentsMd = fs.readFileSync(path.resolve(__dirname, '../../../AGENTS.md'), 'utf8');
  const documentedTypes = extractDocumentedBranchTypes(claudeMd);
  const instructionTypes = extractInstructionBranchTypes(branchInstructions);
  const instructionExamples = extractBranchExamples(
    branchInstructions.match(
      /### ✅ Valid Branch Names([\s\S]*?)### ❌ Invalid Branch Names/
    )?.[1] ?? ''
  );
  const agentsBranchSection = agentsMd.match(
    /## Branch Naming Governance \(CRITICAL\) — Non-Negotiable([\s\S]*?)(?=\n## )/
  )?.[1];

  test('defines the exact 38 allowed types in the canonical validator', () => {
    expect(ALLOWED_TYPES).toEqual(EXPECTED_ALLOWED_TYPES);
    expect(new Set(EXPECTED_ALLOWED_TYPES).size).toBe(38);
  });

  test.each(EXPECTED_ALLOWED_TYPES)('accepts the %s type in the canonical validator', (type) => {
    const branchName = `${type}/scope-title`;

    expect(validateBranchName(branchName)).toEqual({ valid: true });
  });

  test.each(['doc', 'aiops', 'automation', 'epic'])(
    'accepts the newly documented %s prefix',
    (type) => {
      const branchName = `${type}/quality-audit`;

      expect(validateBranchName(branchName).valid).toBe(true);
    }
  );

  test.each(['docx', 'ai-ops', 'automate', 'epics'])('rejects the near-miss %s prefix', (type) => {
    const branchName = `${type}/quality-audit`;

    expect(validateBranchName(branchName).valid).toBe(false);
  });

  test('keeps the CLAUDE.md type table aligned with the canonical validator', () => {
    expect(documentedTypes.map(({ type }) => type)).toEqual(EXPECTED_ALLOWED_TYPES);
  });

  test('keeps the portable branch instructions aligned with the validators', () => {
    expect(instructionTypes).toEqual(EXPECTED_ALLOWED_TYPES);
    expect(new Set(instructionTypes).size).toBe(38);
  });

  test.each(documentedTypes)(
    'keeps the documented $type example valid: $example',
    ({ example }) => {
      expect(validateBranchName(example).valid).toBe(true);
    }
  );

  test.each(instructionExamples)(
    'keeps the portable instruction example valid: %s',
    (branchName) => {
      expect(validateBranchName(branchName).valid).toBe(true);
    }
  );

  test.each(['claude', 'copilot', 'openai', 'feature'])(
    'rejects the %s prefix forbidden by the governance files',
    (type) => {
      expect(validateBranchName(`${type}/scope-title`).valid).toBe(false);
    }
  );

  test('keeps AGENTS.md pointed at the canonical validator and portable instructions', () => {
    expect(agentsBranchSection).toBeDefined();
    expect(agentsBranchSection).toContain(
      '[scripts/validation/validate-branch-name.cjs](scripts/validation/validate-branch-name.cjs)'
    );
    expect(agentsBranchSection).toContain(
      '[instructions/branch-naming.instructions.md](instructions/branch-naming.instructions.md)'
    );

    for (const relativePath of [
      'scripts/validation/validate-branch-name.cjs',
      'instructions/branch-naming.instructions.md',
    ]) {
      expect(fs.existsSync(path.resolve(__dirname, '../../..', relativePath))).toBe(true);
    }
  });

  test('documents the mandatory validation command without a forbidden branch prefix', () => {
    expect(agentsBranchSection).toContain('npm run validate:branch-name -- --branch <your-branch>');
    expect(agentsBranchSection).not.toMatch(/✅[^\n]*`(?:claude|copilot|openai)\//);
  });
});
