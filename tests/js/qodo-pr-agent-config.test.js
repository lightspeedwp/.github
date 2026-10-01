/**
 * Contract test for the central Qodo PR-Agent configuration (`.pr_agent.toml`).
 *
 * Source of truth: .github/specs/019-qodo-pr-agent-integration/contracts/pr-agent-config.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'smol-toml';

const repoRoot = path.resolve(__dirname, '../..');
const configPath = path.join(repoRoot, '.pr_agent.toml');

const raw = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '';
const config = raw ? parse(raw) : {};

const INSTRUCTION_SECTIONS = [
  'pr_description',
  'pr_reviewer',
  'pr_code_suggestions',
  'pr_questions',
  'pr_update_changelog',
  'pr_add_docs',
];

/**
 * The model ids, declared once.
 *
 * `.pr_agent.toml` is the authority: it is what PR-Agent actually reads. Everything
 * else — the run record, the contract, the plan, the guide, the tests — restates the
 * id for a human or for a report, and each restatement is checked here. A divergence
 * fails the suite rather than shipping a run whose record names a model that was not
 * used.
 */
const PRIMARY_MODEL = config?.config?.model;
const PRIMARY_FALLBACK = config?.config?.fallback_models?.[0];
const bareId = (id) => String(id).replace(/^anthropic\//, '');

/**
 * Every model id this repository is allowed to discuss, and why.
 *
 * The primary and the fallback come from the authority. The third is the
 * fallback's alias, which the guide cites because Anthropic documents both
 * spellings. The fourth is the documented migration target: the pinned image cannot
 * serve it yet, so the guide has to name it, and pretending otherwise would leave the
 * reader with no upgrade path. Adding a fifth name is a decision, so the list itself
 * is asserted.
 */
const EXPECTED_MODEL_IDS = [
  'claude-sonnet-5',
  'claude-haiku-4-5-20251001',
  'claude-haiku-4-5',
  'claude-sonnet-5-5',
];

describe('Qodo PR-Agent model ids are single-sourced', () => {
  const read = (relative) => fs.readFileSync(path.join(repoRoot, relative), 'utf8');

  it('the authority declares one primary and one fallback', () => {
    expect(PRIMARY_MODEL).toMatch(/^anthropic\/claude-[a-z0-9-]+$/);
    expect(PRIMARY_FALLBACK).toMatch(/^anthropic\/claude-[a-z0-9-]+$/);
    expect(PRIMARY_FALLBACK).not.toBe(PRIMARY_MODEL);
  });

  it.each([
    ['.github/workflows/qodo-pr-agent.yml', 'pilot run record'],
    ['.github/workflows/qodo-pr-agent-reusable.yml', 'shared run record'],
  ])('%s records the same model the authority declares', (file) => {
    // The record's model field is report metadata, not behaviour, so it is a
    // literal; this is what keeps it from drifting.
    expect(read(file)).toContain(`--arg model "${PRIMARY_MODEL}"`);
  });

  it('the ids in use are the newest this image can serve', () => {
    expect({ primary: bareId(PRIMARY_MODEL), fallback: bareId(PRIMARY_FALLBACK) }).toStrictEqual({
      primary: 'claude-sonnet-5',
      fallback: 'claude-haiku-4-5-20251001',
    });
  });

  it.each([
    '.github/specs/019-qodo-pr-agent-integration/contracts/pr-agent-config.md',
    '.github/specs/019-qodo-pr-agent-integration/plan.md',
    '.github/specs/019-qodo-pr-agent-integration/research.md',
    '.github/specs/019-qodo-pr-agent-integration/quickstart.md',
    'docs/QODO_PR_AGENT.md',
  ])('%s names only models this repository discusses', (file) => {
    // The id may appear with or without the litellm provider prefix, so both
    // spellings are matched. A model the repository has not adopted cannot appear.
    const named = [...read(file).matchAll(/(?:anthropic\/)?claude-[a-z0-9-]+/g)].map((m) =>
      bareId(m[0])
    );
    const undeclared = [...new Set(named)].filter((id) => !EXPECTED_MODEL_IDS.includes(id));
    expect({ file, undeclared }).toStrictEqual({ file, undeclared: [] });
  });

  it('the discussion vocabulary is exactly the ids above', () => {
    // So widening it is a deliberate edit with a reason, not a side effect of
    // mentioning a fourth model somewhere.
    expect([...EXPECTED_MODEL_IDS].sort()).toStrictEqual([
      'claude-haiku-4-5',
      'claude-haiku-4-5-20251001',
      'claude-sonnet-5',
      'claude-sonnet-5-5',
    ]);
  });

  it('the contract, the plan, the guide and the research all name the primary', () => {
    // Matched on the bare id. A document citing Anthropic's own spelling omits the
    // litellm provider prefix, and that is the correct spelling for a citation; the
    // point of the check is that it names the model in use, not the exact wrapper.
    const bare = PRIMARY_MODEL.replace(/^anthropic\//, '');
    for (const file of [
      '.github/specs/019-qodo-pr-agent-integration/contracts/pr-agent-config.md',
      '.github/specs/019-qodo-pr-agent-integration/plan.md',
      '.github/specs/019-qodo-pr-agent-integration/research.md',
      'docs/QODO_PR_AGENT.md',
    ]) {
      expect({ file, names: read(file).includes(bare) }).toStrictEqual({ file, names: true });
    }
  });

  it('the skill runner does not declare a model at all', () => {
    // It used to hardcode one, which was a second source that could disagree with
    // the repository config. It now passes no --config.model unless the operator
    // names one, so the repository config decides.
    const script = read('skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh');
    expect(script).toContain('PR_AGENT_MODEL');
    expect(script).not.toContain('"anthropic/claude-');
    // The only permitted reference is the escape hatch's usage example.
    const modelFlags = script.match(/--config\.model=/g) || [];
    expect(modelFlags).toHaveLength(1);
  });

  it('the tests that assert the model read it from the authority, not a literal', () => {
    for (const file of [
      'tests/js/qodo-pr-agent-runner.test.js',
      'tests/js/qodo-pr-agent-workflow.test.js',
    ]) {
      const body = read(file);
      expect({ file, hardCoded: body.includes("'anthropic/claude-") }).toStrictEqual({
        file,
        hardCoded: false,
      });
    }
  });
});

describe('Qodo PR-Agent central configuration (.pr_agent.toml)', () => {
  it('exists at the repository root', () => {
    expect(fs.existsSync(configPath)).toBe(true);
  });

  describe('governed keys', () => {
    it.each([
      ['config', 'max_model_tokens', 64000],
      ['config', 'large_patch_policy', 'clip'],
      ['config', 'response_language', 'en-GB'],
      ['config', 'enable_custom_labels', false],
      ['pr_description', 'publish_description_as_comment', true],
      ['pr_description', 'publish_description_as_comment_persistent', true],
      ['pr_description', 'publish_labels', false],
      ['pr_description', 'generate_ai_title', false],
      ['pr_reviewer', 'enable_review_labels_security', false],
      ['pr_reviewer', 'enable_review_labels_effort', false],
      ['pr_reviewer', 'persistent_comment', true],
      ['pr_code_suggestions', 'commitable_code_suggestions', false],
      ['pr_code_suggestions', 'persistent_comment', true],
      ['pr_update_changelog', 'push_changelog_changes', false],
    ])('%s.%s is %p', (section, key, expected) => {
      expect(config[section]).toBeDefined();
      expect(config[section][key]).toStrictEqual(expected);
    });

    it('config.fallback_models is the Haiku fallback only', () => {
      expect(config.config.fallback_models).toStrictEqual([PRIMARY_FALLBACK]);
    });

    it('ignore.glob excludes generated and archived paths', () => {
      expect(config.ignore.glob).toEqual(
        expect.arrayContaining([
          'node_modules/**',
          '.github/workflows/archived/**',
          '.github/reports/**',
          '**/*.lock',
          'package-lock.json',
        ])
      );
    });
  });

  describe('keys that must not appear', () => {
    it('has no custom_labels table', () => {
      expect(config.custom_labels).toBeUndefined();
    });

    it('has no github_action_config section (trigger policy lives in the workflow)', () => {
      expect(config.github_action_config).toBeUndefined();
    });

    it('does not enable description markers', () => {
      expect(config.pr_description?.use_description_markers).not.toBe(true);
    });

    it('contains no credential values', () => {
      expect(raw).not.toMatch(/sk-ant-/i);
      expect(raw).not.toMatch(/^\s*(api[_-]?key|key|token)\s*=/im);
    });
  });

  describe('extra_instructions', () => {
    it.each(INSTRUCTION_SECTIONS)('%s.extra_instructions follows the content rules', (section) => {
      const text = config[section]?.extra_instructions;
      expect(typeof text).toBe('string');
      expect(text.trim().length).toBeGreaterThan(0);
      expect(text).toContain('UK English');
      expect(text).toContain('AGENTS.md');
      expect(text).toMatch(/Never reproduce credentials/);
      expect(text).not.toMatch(/WordPress|PHP|React|block theme/i);
    });

    it('pr_update_changelog.extra_instructions states the changelog rules', () => {
      const text = config.pr_update_changelog.extra_instructions;
      expect(text).toMatch(/250 characters/);
      expect(text).toMatch(/Keep a Changelog/);
    });
  });
});
