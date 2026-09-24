/**
 * Contract test for the central Qodo PR-Agent configuration (`.pr_agent.toml`).
 *
 * Source of truth: .github/specs/017-qodo-pr-agent-integration/contracts/pr-agent-config.md
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

describe('Qodo PR-Agent central configuration (.pr_agent.toml)', () => {
  it('exists at the repository root', () => {
    expect(fs.existsSync(configPath)).toBe(true);
  });

  describe('governed keys', () => {
    it.each([
      ['config', 'model', 'anthropic/claude-sonnet-5'],
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
      expect(config.config.fallback_models).toStrictEqual(['anthropic/claude-haiku-4-5-20251001']);
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
