/**
 * @jest-environment node
 */

/**
 * Label governance contracts for #3545.
 *
 * Proves, against the real configuration files (not reimplemented
 * constants), that the labelling pipeline converges instead of fighting:
 * canonical emitters, branch-mapping parity, labeler schema, deterministic
 * one-type reconciliation, idempotence and router/agent convergence.
 *
 * Fixtures mirror the #3525 incident (docs/ branch, tests/ change) and the
 * #3545 type:task + type:bug double-add.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const yaml = require('js-yaml');

const REPO_ROOT = path.resolve(__dirname, '../../..');

// The labelling sources import ESM-only @actions/* packages, which Jest
// cannot require on this Node version. Mock them virtually: every test
// below injects its own context and octokit, so the mocks only need to
// absorb logging/summary calls.
jest.mock(
  '@actions/core',
  () => ({
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    startGroup: jest.fn(),
    endGroup: jest.fn(),
    setFailed: jest.fn(),
    getInput: jest.fn(() => ''),
    summary: { addRaw: jest.fn().mockReturnThis(), write: jest.fn() },
  }),
  { virtual: true }
);

jest.mock(
  '@actions/github',
  () => ({
    context: { repo: { owner: 'lightspeedwp', repo: '.github' }, payload: {} },
    getOctokit: jest.fn(() => {
      throw new Error('getOctokit must be injected in tests');
    }),
  }),
  { virtual: true }
);

function repoYaml(relativePath) {
  return yaml.load(fs.readFileSync(path.join(REPO_ROOT, relativePath), 'utf8'));
}

function canonicalLabelSet() {
  return new Set(repoYaml('.github/labels.yml').map((l) => (typeof l === 'string' ? l : l.name)));
}

// ---------------------------------------------------------------------------
// Live-API mock: behaves like the issues labels endpoints against an
// in-memory label set, including 404 on removing an absent label.
// ---------------------------------------------------------------------------
function createMockOctokit(initialLabels, { nativeType = null } = {}) {
  const state = { labels: [...initialLabels] };
  const calls = { added: [], removed: [] };
  const octokit = {
    state,
    calls,
    rest: {
      issues: {
        get: async () => ({
          data: { type: nativeType ? { name: nativeType } : null },
        }),
        listLabelsOnIssue: async () => ({
          data: state.labels.map((name) => ({ name })),
        }),
        addLabels: async ({ labels }) => {
          for (const label of labels || []) {
            calls.added.push(label);
            if (!state.labels.includes(label)) state.labels.push(label);
          }
          return { data: [] };
        },
        removeLabel: async ({ name }) => {
          const index = state.labels.indexOf(name);
          if (index < 0) {
            const error = new Error('Label does not exist');
            error.status = 404;
            throw error;
          }
          calls.removed.push(name);
          state.labels.splice(index, 1);
          return {};
        },
      },
      pulls: {
        listFiles: async () => ({ data: [] }),
      },
    },
  };
  return octokit;
}

function issueContext({ title, body = '', labels = [], action = null }) {
  const payload = {
    issue: {
      number: 3545,
      title,
      body,
      labels: labels.map((name) => ({ name })),
    },
  };
  if (action) payload.action = action;
  return {
    repo: { owner: 'lightspeedwp', repo: '.github' },
    payload,
  };
}

function prContext({ branch, title, labels = [] }) {
  return {
    repo: { owner: 'lightspeedwp', repo: '.github' },
    payload: {
      pull_request: {
        number: 3525,
        title,
        body: 'body',
        head: { ref: branch },
        base: { ref: 'develop' },
        labels: labels.map((name) => ({ name })),
      },
    },
  };
}

function routeBranch(branchName) {
  const result = spawnSync(
    'node',
    [path.join(REPO_ROOT, 'scripts/pr-template-router.js'), branchName],
    { encoding: 'utf8' }
  );
  expect(result.status).toBe(0);
  return JSON.parse(result.stdout).default_labels;
}

describe('label governance contracts (#3545)', () => {
  let agent;
  let labelerUtils;
  let summaryFile;

  beforeAll(async () => {
    agent = await import('../labeling.agent.js');
    labelerUtils = await import('../includes/labeler-utils.js');
    summaryFile = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'label-contracts-')),
      'summary.md'
    );
    fs.writeFileSync(summaryFile, '');
    process.env.GITHUB_STEP_SUMMARY = summaryFile;
  });

  describe('canonical-label contract', () => {
    test('agent keyword map emits only canonical labels', () => {
      const canonical = canonicalLabelSet();
      const bad = Object.entries(agent.KEYWORD_TYPE_MAP).filter(
        ([, label]) => !canonical.has(label)
      );
      expect(bad).toEqual([]);
    });

    test('agent branch map emits only canonical labels', () => {
      const canonical = canonicalLabelSet();
      const bad = Object.entries(agent.BRANCH_PREFIX_TYPE_MAP).filter(
        ([, label]) => !canonical.has(label)
      );
      expect(bad).toEqual([]);
    });

    test('labeler.yml emits only canonical labels', () => {
      const canonical = canonicalLabelSet();
      const labeler = repoYaml('.github/labeler.yml');
      const bad = Object.keys(labeler).filter((l) => !canonical.has(l));
      expect(bad).toEqual([]);
    });

    test('branch-labels.yml default_labels are canonical', () => {
      const canonical = canonicalLabelSet();
      const mapping = repoYaml('.github/branch-labels.yml').branch_labels;
      const bad = [];
      for (const [branchType, config] of Object.entries(mapping)) {
        for (const label of config.default_labels || []) {
          if (!canonical.has(label)) bad.push(`${branchType} -> ${label}`);
        }
      }
      expect(bad).toEqual([]);
    });
  });

  describe('mapping parity contract', () => {
    const PREFIX_ALIAS = { doc: 'docs', tests: 'test', feature: 'feat', bugfix: 'fix' };

    test('agent branch prefixes agree with branch-labels.yml', () => {
      const mapping = repoYaml('.github/branch-labels.yml').branch_labels;
      const mismatches = [];
      for (const [prefix, agentType] of Object.entries(agent.BRANCH_PREFIX_TYPE_MAP)) {
        const branchType = PREFIX_ALIAS[prefix.slice(0, -1)] || prefix.slice(0, -1);
        const expected = (mapping[branchType] || {}).default_labels || [];
        const routerType = expected.find((l) => l.startsWith('type:'));
        if (routerType && routerType !== agentType) {
          mismatches.push(`${prefix}: agent=${agentType} router=${routerType}`);
        }
      }
      expect(mismatches).toEqual([]);
    });

    test('labeler type branch-rules agree with branch-labels.yml', () => {
      const mapping = repoYaml('.github/branch-labels.yml').branch_labels;
      const labeler = repoYaml('.github/labeler.yml');
      const mismatches = [];
      for (const [label, rules] of Object.entries(labeler)) {
        if (!label.startsWith('type:')) continue;
        const ruleList = Array.isArray(rules) ? rules : [rules];
        for (const rule of ruleList) {
          for (const pattern of rule['head-branch'] || []) {
            const prefix = String(pattern)
              .replace(/^\^/, '')
              .replace(/\/\.\*$/, '')
              .replace(/\?.*$/, '');
            if (!prefix || /[.*+?^${}()|[\]\\]/.test(prefix)) continue;
            const routerType = ((mapping[prefix] || {}).default_labels || []).find((l) =>
              l.startsWith('type:')
            );
            if (routerType && routerType !== label) {
              mismatches.push(`${label} matches ${prefix}/ but router says ${routerType}`);
            }
          }
        }
      }
      expect(mismatches).toEqual([]);
    });

    test('hotfix type remains synchronized with the router', () => {
      const mapping = repoYaml('.github/branch-labels.yml').branch_labels;
      const labeler = repoYaml('.github/labeler.yml');
      const routerType = mapping.hotfix.default_labels.find((label) => label.startsWith('type:'));
      const rules = Array.isArray(labeler[routerType])
        ? labeler[routerType]
        : [labeler[routerType]];
      const patterns = rules.filter(Boolean).flatMap((rule) => rule['head-branch'] || []);
      const releaseRules = Array.isArray(labeler['type:release'])
        ? labeler['type:release']
        : [labeler['type:release']];
      const releasePatterns = releaseRules
        .filter(Boolean)
        .flatMap((rule) => rule['head-branch'] || []);

      expect(patterns.some((pattern) => new RegExp(pattern).test('hotfix/example'))).toBe(true);
      expect(releasePatterns.some((pattern) => new RegExp(pattern).test('hotfix/example'))).toBe(
        false
      );
    });
  });

  describe('workflow trigger contract', () => {
    test('labeling workflow observes native issue type transitions', () => {
      const workflow = fs.readFileSync(
        path.join(REPO_ROOT, '.github/workflows/labeling-unified.yml'),
        'utf8'
      );

      expect(workflow).toMatch(
        /issues:\s*\n\s*types:\s*\[[^\]]*\btyped\b[^\]]*\buntyped\b[^\]]*\]/s
      );
    });
  });

  describe('labeler schema contract', () => {
    function runValidatorWithLabeler(labelerObject) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'labeler-schema-'));
      fs.mkdirSync(path.join(dir, '.github'), { recursive: true });
      for (const file of [
        'labels.yml',
        'issue-types.yml',
        'label-governance-policy.yml',
        'branch-labels.yml',
      ]) {
        fs.copyFileSync(path.join(REPO_ROOT, '.github', file), path.join(dir, '.github', file));
      }
      fs.writeFileSync(path.join(dir, '.github', 'labeler.yml'), yaml.dump(labelerObject));
      return spawnSync(
        'node',
        [path.join(REPO_ROOT, 'scripts/validation/validate-labeling-configs.cjs')],
        { cwd: dir, encoding: 'utf8' }
      );
    }

    test('mapping-form changed-files fails validation', () => {
      const result = runValidatorWithLabeler({
        'area:testing': {
          'changed-files': { 'any-glob-to-any-file': ['tests/**/*'] },
        },
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toMatch(/changed-files/);
    });

    test('list-form changed-files passes validation', () => {
      const result = runValidatorWithLabeler({
        'area:testing': [{ 'changed-files': [{ 'any-glob-to-any-file': ['tests/**/*'] }] }],
      });
      expect(result.status).toBe(0);
    });

    test('all and any groups pass validation with valid members', () => {
      const result = runValidatorWithLabeler({
        'area:testing': [
          {
            all: [
              { 'head-branch': ['^test/.*'] },
              { 'changed-files': [{ 'any-glob-to-any-file': ['tests/**/*'] }] },
            ],
          },
        ],
        'area:documentation': [
          {
            any: [
              { 'head-branch': ['^docs/.*'] },
              { 'changed-files': [{ 'any-glob-to-any-file': ['docs/**/*'] }] },
            ],
          },
        ],
      });
      expect(result.status).toBe(0);
    });

    test('invalid all or any members fail validation', () => {
      const result = runValidatorWithLabeler({
        'area:testing': [{ all: [{ 'head-branch': [] }] }],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toMatch(/head-branch/);
    });

    test('repository changed-files rules use the action list form', () => {
      const labeler = repoYaml('.github/labeler.yml');
      const invalid = [];
      for (const [label, rules] of Object.entries(labeler)) {
        for (const rule of rules) {
          if (rule['changed-files'] && !Array.isArray(rule['changed-files'])) {
            invalid.push(label);
          }
        }
      }
      expect(invalid).toEqual([]);
    });

    test('unknown matcher key fails validation', () => {
      const result = runValidatorWithLabeler({
        'area:testing': [{ 'changed-files': [{ 'fuzzy-glob': ['tests/**/*'] }] }],
      });
      expect(result.status).not.toBe(0);
    });
  });

  describe('labeler-utils semantics (v5+ array form)', () => {
    const prCtx = (branch) => ({
      payload: { pull_request: { head: { ref: branch }, number: 1 } },
      ref: 'refs/heads/develop',
    });

    test('array-form file rule matches', () => {
      const rules = {
        'area:testing': [{ 'changed-files': [{ 'any-glob-to-any-file': ['tests/**/*'] }] }],
      };
      expect(
        labelerUtils.determineLabelsFromRules(prCtx('docs/something'), rules, [
          'tests/js/a.test.js',
        ])
      ).toEqual(['area:testing']);
    });

    test('file matcher arrays apply area labels from changed files', () => {
      const rules = {
        'area:ci': [
          {
            'changed-files': [{ 'any-glob-to-any-file': ['.github/workflows/**', 'ci/**/*'] }],
          },
        ],
      };
      expect(
        labelerUtils.determineLabelsFromRules(prCtx('ci/update'), rules, [
          '.github/workflows/tests.yml',
        ])
      ).toEqual(['area:ci']);
    });

    test('array-form objects AND together', () => {
      const rules = {
        'area:testing': [
          { 'head-branch': ['^docs/.*'] },
          { 'changed-files': [{ 'any-glob-to-any-file': ['tests/**/*'] }] },
        ],
      };
      expect(labelerUtils.determineLabelsFromRules(prCtx('docs/x'), rules, ['src/a.js'])).toEqual(
        []
      );
      expect(labelerUtils.determineLabelsFromRules(prCtx('docs/x'), rules, ['tests/a.js'])).toEqual(
        ['area:testing']
      );
    });

    test('all group requires every nested rule to match', () => {
      const rules = {
        'area:testing': [
          {
            all: [
              { 'head-branch': ['^test/.*'] },
              { 'changed-files': [{ 'any-glob-to-any-file': ['tests/**/*'] }] },
            ],
          },
        ],
      };
      expect(
        labelerUtils.determineLabelsFromRules(prCtx('test/contracts'), rules, ['tests/a.js'])
      ).toEqual(['area:testing']);
      expect(
        labelerUtils.determineLabelsFromRules(prCtx('docs/contracts'), rules, ['tests/a.js'])
      ).toEqual([]);
    });

    test('any group matches when one nested rule matches', () => {
      const rules = {
        'area:docs': [
          {
            any: [
              { 'head-branch': ['^docs/.*'] },
              { 'changed-files': [{ 'any-glob-to-any-file': ['docs/**/*'] }] },
            ],
          },
        ],
      };
      expect(
        labelerUtils.determineLabelsFromRules(prCtx('feature/contracts'), rules, ['docs/a.md'])
      ).toEqual(['area:docs']);
      expect(
        labelerUtils.determineLabelsFromRules(prCtx('feature/contracts'), rules, ['src/a.js'])
      ).toEqual([]);
    });

    test('all-globs-to-all-files requires every changed file to match', () => {
      const rules = {
        'area:testing': [
          {
            'changed-files': [{ 'all-globs-to-all-files': ['**/*.js', '**/*.test.js'] }],
          },
        ],
      };
      expect(
        labelerUtils.determineLabelsFromRules(prCtx('test/contracts'), rules, [
          'src/a.js',
          'tests/a.test.js',
        ])
      ).toEqual([]);
    });

    test('matchers OR within one object', () => {
      const rules = {
        'type:docs': [{ 'head-branch': ['^docs/.*', '^doc/.*'] }],
      };
      expect(labelerUtils.determineLabelsFromRules(prCtx('doc/y'), rules, [])).toEqual([
        'type:docs',
      ]);
    });

    test('mapping-form changed-files does not match', () => {
      const rules = {
        'area:testing': {
          'changed-files': { 'any-glob-to-any-file': ['tests/**/*'] },
        },
      };
      expect(
        labelerUtils.determineLabelsFromRules(prCtx('docs/y'), rules, ['tests/a.test.js'])
      ).toEqual([]);
    });

    test('skipFamilies suppresses caller-owned families', async () => {
      const added = [];
      const octokit = {
        rest: {
          issues: {
            addLabels: async ({ labels }) => {
              added.push(...labels);
              return {};
            },
          },
          pulls: { listFiles: async () => ({ data: [] }) },
        },
      };
      const applied = await labelerUtils.applyLabelerRules({
        github: octokit,
        context: {
          ...prCtx('docs/y'),
          repo: { owner: 'o', repo: 'r' },
        },
        labelerRules: {
          'type:docs': [{ 'head-branch': ['^docs/.*'] }],
        },
        currentLabels: [],
        dryRun: false,
        skipFamilies: ['type:'],
      });
      expect(applied).toEqual([]);
      expect(added).toEqual([]);
    });
  });

  describe('one-type reconciliation (#3545 regression)', () => {
    test('empty issue with fix: title gets exactly type:bug, never task+bug', async () => {
      const octokit = createMockOctokit([]);
      const report = await agent.runLabelingAgent({
        context: issueContext({ title: 'fix: labeling fights over PR labels' }),
        github: octokit,
        dryRun: false,
      });
      const types = octokit.state.labels.filter((l) => l.startsWith('type:'));
      expect(types).toEqual(['type:bug']);
      expect(report.errors).toEqual([]);
    });

    test('native issue type wins over conflicting content and defaults', async () => {
      const octokit = createMockOctokit([], { nativeType: 'Chore' });
      const report = await agent.runLabelingAgent({
        context: issueContext({ title: 'fix: this looks like a bug', body: 'issue details' }),
        github: octokit,
        dryRun: false,
      });
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:chore']);
      expect(octokit.calls.added).not.toContain('type:bug');
      expect(octokit.calls.added).not.toContain('type:task');
      expect(report.rulesApplied).toContain('Native issue type: type:chore');
    });

    test('native issue type replaces a stale conflicting live label', async () => {
      const octokit = createMockOctokit(['type:bug'], { nativeType: 'Chore' });
      await agent.runLabelingAgent({
        context: issueContext({ title: 'fix: stale payload', labels: ['type:bug'] }),
        github: octokit,
        dryRun: false,
      });
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:chore']);
      expect(octokit.calls.removed).toContain('type:bug');
    });

    test('untyped issue clears the stale native type before content fallback', async () => {
      const octokit = createMockOctokit(['type:docs']);
      const report = await agent.runLabelingAgent({
        context: issueContext({
          title: 'fix: untyped issue needs a fresh type',
          labels: ['type:docs'],
          action: 'untyped',
        }),
        github: octokit,
        dryRun: false,
      });

      expect(octokit.state.labels.filter((label) => label.startsWith('type:'))).toEqual([
        'type:bug',
      ]);
      expect(octokit.calls.removed).toContain('type:docs');
      expect(report.rulesApplied).toContain('Content-based type detection: type:bug');
    });

    test('native type write failure is contained and does not add a default', async () => {
      const octokit = createMockOctokit([], { nativeType: 'Chore' });
      const addLabels = octokit.rest.issues.addLabels;
      octokit.rest.issues.addLabels = async (params) => {
        if (params.labels.includes('type:chore')) throw new Error('temporary write failure');
        return addLabels(params);
      };
      const report = await agent.runLabelingAgent({
        context: issueContext({ title: 'Tidy labels' }),
        github: octokit,
        dryRun: false,
      });
      expect(report.errors.some((error) => error.includes('Native type label error'))).toBe(true);
      expect(octokit.calls.added).not.toContain('type:task');
    });

    test('native lookup failure suppresses content and default type writes', async () => {
      const octokit = createMockOctokit([]);
      octokit.rest.issues.get = async () => {
        throw new Error('native lookup unavailable');
      };
      const report = await agent.runLabelingAgent({
        context: issueContext({ title: 'fix: content fallback must not run' }),
        github: octokit,
        dryRun: false,
      });
      expect(octokit.state.labels.filter((label) => label.startsWith('type:'))).toEqual([]);
      expect(octokit.calls.added).not.toContain('type:bug');
      expect(octokit.calls.added).not.toContain('type:task');
      expect(report.errors.some((error) => error.includes('Native issue type lookup error'))).toBe(
        true
      );
    });

    test('whole-word fallback does not classify substrings', () => {
      expect(agent.detectIssueTypeFromContent('decision', '')).toBeNull();
      expect(agent.detectIssueTypeFromContent('specific', '')).toBeNull();
      expect(agent.detectIssueTypeFromContent('prefix', '')).toBeNull();
      expect(agent.detectIssueTypeFromContent('fix: deliberate', '')).toBe('type:bug');
      expect(agent.detectIssueTypeFromContent('', 'fix:123')).toBe('type:bug');
      expect(agent.detectIssueTypeFromContent('', 'fixes #123')).toBe('type:bug');
    });

    test('live type suppresses content double-add on stale payload', async () => {
      // Payload predates the router; live API already has the type.
      const octokit = createMockOctokit(['type:docs']);
      const report = await agent.runLabelingAgent({
        context: issueContext({ title: 'fix: something', labels: [] }),
        github: octokit,
        dryRun: false,
      });
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:docs']);
      expect(report.errors).toEqual([]);
    });

    test('duplicate live types resolve deterministically, no 404 abort', async () => {
      const octokit = createMockOctokit(['type:docs', 'type:documentation']);
      const report = await agent.runLabelingAgent({
        context: prContext({ branch: 'docs/x', title: 'docs: x', labels: [] }),
        github: octokit,
        dryRun: false,
      });
      // type:documentation is non-canonical (standardized away); exactly
      // one canonical type remains and no error was recorded.
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:docs']);
      expect(report.errors.filter((e) => /does not exist|404/.test(e))).toEqual([]);
    });

    test('absent-label removal is harmless', async () => {
      const calls = [];
      const octokit = createMockOctokit([]);
      const throwing = {
        ...octokit,
        rest: {
          ...octokit.rest,
          issues: {
            ...octokit.rest.issues,
            removeLabel: async ({ name }) => {
              calls.push(name);
              const error = new Error('Label does not exist');
              error.status = 404;
              throw error;
            },
          },
        },
      };
      await expect(agent.removeLabelSafe(throwing, 'o', 'r', 1, 'type:ghost')).resolves.toBe(false);
      expect(calls).toEqual(['type:ghost']);
    });

    test('rerun with unchanged inputs mutates nothing (idempotent)', async () => {
      const first = createMockOctokit([]);
      await agent.runLabelingAgent({
        context: issueContext({ title: 'fix: something' }),
        github: first,
        dryRun: false,
      });
      const second = createMockOctokit([...first.state.labels]);
      await agent.runLabelingAgent({
        context: issueContext({
          title: 'fix: something',
          labels: [...first.state.labels],
        }),
        github: second,
        dryRun: false,
      });
      expect(second.calls.added).toEqual([]);
      expect(second.calls.removed).toEqual([]);
    });
  });

  describe('router/agent convergence (#3525 case)', () => {
    test('docs/ PR converges to type:docs regardless of order', async () => {
      // Router-first: router applied type:docs, agent must keep exactly it.
      const routerFirst = createMockOctokit(routeBranch('docs/spec-x'));
      const report = await agent.runLabelingAgent({
        context: prContext({
          branch: 'docs/spec-x',
          title: 'docs: x',
          labels: [...routerFirst.state.labels],
        }),
        github: routerFirst,
        dryRun: false,
      });
      expect(routerFirst.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:docs']);
      expect(report.errors).toEqual([]);

      // Agent-first: the agent must not write PR types at all (router
      // owns them); the router result applied afterwards is the final
      // state, identical to the router-first order.
      const agentFirst = createMockOctokit([]);
      await agent.runLabelingAgent({
        context: prContext({ branch: 'docs/spec-x', title: 'docs: x' }),
        github: agentFirst,
        dryRun: false,
      });
      expect(agentFirst.state.labels.filter((l) => l.startsWith('type:'))).toEqual([]);
      expect(routeBranch('docs/spec-x')).toContain('type:docs');
    });

    test('routing workflow applies type labels only, not scope areas', () => {
      // Regression for the area:testing ping-pong: the workflow must
      // apply .default_labels (type:*) while area:* stays owned by
      // actions/labeler. 'spec' in the scope must not reach GitHub.
      const workflow = fs.readFileSync(
        path.join(REPO_ROOT, '.github/workflows/pr-template-routing.yml'),
        'utf8'
      );
      expect(workflow).toContain('.default_labels | map(select');
      expect(workflow).not.toContain('.all_labels | join');
      expect(routeBranch('docs/claude-cloud-environment-spec')).toContain('type:docs');
    });
  });

  describe('area ownership contract', () => {
    test('router defaults contain no area labels', () => {
      const mapping = repoYaml('.github/branch-labels.yml').branch_labels;
      const areaDefaults = Object.entries(mapping).flatMap(([branchType, config]) =>
        (config.default_labels || [])
          .filter((label) => label.startsWith('area:'))
          .map((label) => `${branchType}:${label}`)
      );
      expect(areaDefaults).toEqual([]);
    });

    test('ci, build and audit branches leave area ownership to the file labeler', () => {
      for (const branch of ['ci/update', 'build/bundle', 'audit/labels']) {
        expect(routeBranch(branch).some((label) => label.startsWith('area:'))).toBe(false);
      }
      const rules = repoYaml('.github/labeler.yml');
      expect(
        labelerUtils.determineLabelsFromRules(
          {
            payload: { pull_request: { head: { ref: 'ci/update' }, number: 1 } },
            ref: 'refs/heads/develop',
          },
          rules,
          ['.github/workflows/tests.yml']
        )
      ).toContain('area:ci');
    });

    test('router filters area labels before applying defaults', () => {
      const workflow = fs.readFileSync(
        path.join(REPO_ROOT, '.github/workflows/pr-template-routing.yml'),
        'utf8'
      );
      expect(workflow).toMatch(/map\(select\(startswith\("type:"\) or startswith\("priority:"\)\)/);
    });
  });
  describe('template-frontmatter contract', () => {
    function runGuardrail() {
      return spawnSync(
        'node',
        [
          path.join(REPO_ROOT, 'scripts/validation/validate-labels-before-creation.cjs'),
          '--scan-templates',
        ],
        { cwd: REPO_ROOT, encoding: 'utf8' }
      );
    }

    test('current templates pass (grandfathered violations warn only)', () => {
      const result = runGuardrail();
      expect(result.status).toBe(0);
      expect(result.stdout).toMatch(/pr_docs\.md/);
    });

    test('ignores labels in template body outside frontmatter', () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-frontmatter-'));
      const templatesDir = path.join(dir, '.github/PULL_REQUEST_TEMPLATE');
      fs.mkdirSync(templatesDir, { recursive: true });
      fs.copyFileSync(
        path.join(REPO_ROOT, '.github/labels.yml'),
        path.join(dir, '.github/labels.yml')
      );
      fs.writeFileSync(
        path.join(templatesDir, 'pr_body.md'),
        '---\nlabels:\n  - type:bug\n---\n# Body\nlabels: ["type:bogus"]\n'
      );
      const result = spawnSync(
        'node',
        [
          path.join(REPO_ROOT, 'scripts/validation/validate-labels-before-creation.cjs'),
          '--scan-templates',
          '--templates-dir',
          templatesDir,
          '--canonical-file',
          path.join(dir, '.github/labels.yml'),
        ],
        { encoding: 'utf8' }
      );
      expect(result.status).toBe(0);
    });

    test('malformed frontmatter fails the gate', () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-malformed-'));
      const templatesDir = path.join(dir, '.github/PULL_REQUEST_TEMPLATE');
      fs.mkdirSync(templatesDir, { recursive: true });
      fs.copyFileSync(
        path.join(REPO_ROOT, '.github/labels.yml'),
        path.join(dir, '.github/labels.yml')
      );
      fs.writeFileSync(
        path.join(templatesDir, 'pr_malformed.md'),
        '---\nlabels: [type:bug\n---\n# Malformed\n'
      );
      const result = spawnSync(
        'node',
        [
          path.join(REPO_ROOT, 'scripts/validation/validate-labels-before-creation.cjs'),
          '--scan-templates',
          '--templates-dir',
          templatesDir,
          '--canonical-file',
          path.join(dir, '.github/labels.yml'),
        ],
        { encoding: 'utf8' }
      );
      expect(result.status).not.toBe(0);
      expect(result.stdout).toMatch(/invalid YAML frontmatter|malformed frontmatter/);
    });

    test('unsupported frontmatter labels values fail the gate', () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-labels-shape-'));
      const templatesDir = path.join(dir, '.github/PULL_REQUEST_TEMPLATE');
      fs.mkdirSync(templatesDir, { recursive: true });
      fs.copyFileSync(
        path.join(REPO_ROOT, '.github/labels.yml'),
        path.join(dir, '.github/labels.yml')
      );
      fs.writeFileSync(
        path.join(templatesDir, 'pr_shape.md'),
        '---\nlabels:\n  bug: true\n---\n# Shape\n'
      );
      const result = spawnSync(
        'node',
        [
          path.join(REPO_ROOT, 'scripts/validation/validate-labels-before-creation.cjs'),
          '--scan-templates',
          '--templates-dir',
          templatesDir,
          '--canonical-file',
          path.join(dir, '.github/labels.yml'),
        ],
        { encoding: 'utf8' }
      );
      expect(result.status).not.toBe(0);
      expect(result.stdout).toMatch(/labels must be a list|labels must be non-empty/);
    });

    test('a new non-canonical template label fails the gate', () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-gate-'));
      fs.mkdirSync(path.join(dir, '.github/PULL_REQUEST_TEMPLATE'), {
        recursive: true,
      });
      fs.copyFileSync(
        path.join(REPO_ROOT, '.github/labels.yml'),
        path.join(dir, '.github/labels.yml')
      );
      fs.writeFileSync(
        path.join(dir, '.github/PULL_REQUEST_TEMPLATE/pr_evil.md'),
        '---\nlabels: ["type:bogus"]\n---\n# Evil\n'
      );
      const result = spawnSync(
        'node',
        [
          path.join(REPO_ROOT, 'scripts/validation/validate-labels-before-creation.cjs'),
          '--scan-templates',
          '--templates-dir',
          path.join(dir, '.github/PULL_REQUEST_TEMPLATE'),
          '--canonical-file',
          path.join(dir, '.github/labels.yml'),
        ],
        { encoding: 'utf8' }
      );
      expect(result.status).not.toBe(0);
      expect(result.stdout).toMatch(/type:bogus/);
    });
  });
});
