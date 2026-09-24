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
function createMockOctokit(initialLabels) {
  const state = { labels: [...initialLabels] };
  const calls = { added: [], removed: [] };
  const octokit = {
    state,
    calls,
    rest: {
      issues: {
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

function issueContext({ title, body = '', labels = [] }) {
  return {
    repo: { owner: 'lightspeedwp', repo: '.github' },
    payload: {
      issue: {
        number: 3545,
        title,
        body,
        labels: labels.map((name) => ({ name })),
      },
    },
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
        'area:testing': [{ 'changed-files': { 'any-glob-to-any-file': ['tests/**/*'] } }],
      });
      expect(result.status).toBe(0);
    });

    test('unknown matcher key fails validation', () => {
      const result = runValidatorWithLabeler({
        'area:testing': [{ 'changed-files': { 'fuzzy-glob': ['tests/**/*'] } }],
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
        'area:testing': [{ 'changed-files': { 'any-glob-to-any-file': ['tests/**/*'] } }],
      };
      expect(
        labelerUtils.determineLabelsFromRules(prCtx('docs/something'), rules, [
          'tests/js/a.test.js',
        ])
      ).toEqual(['area:testing']);
    });

    test('array-form objects AND together', () => {
      const rules = {
        'area:testing': [
          { 'head-branch': ['^docs/.*'] },
          { 'changed-files': { 'any-glob-to-any-file': ['tests/**/*'] } },
        ],
      };
      expect(labelerUtils.determineLabelsFromRules(prCtx('docs/x'), rules, ['src/a.js'])).toEqual(
        []
      );
      expect(labelerUtils.determineLabelsFromRules(prCtx('docs/x'), rules, ['tests/a.js'])).toEqual(
        ['area:testing']
      );
    });

    test('matchers OR within one object', () => {
      const rules = {
        'type:docs': [{ 'head-branch': ['^docs/.*', '^doc/.*'] }],
      };
      expect(labelerUtils.determineLabelsFromRules(prCtx('doc/y'), rules, [])).toEqual([
        'type:docs',
      ]);
    });

    test('legacy flat-object form still resolves', () => {
      const rules = {
        'area:testing': {
          'changed-files': { 'any-glob-to-any-file': ['tests/**/*'] },
        },
      };
      expect(
        labelerUtils.determineLabelsFromRules(prCtx('docs/y'), rules, ['tests/a.test.js'])
      ).toEqual(['area:testing']);
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

  describe('issue type is the source of type:* (#3545 section 4, #3554 case)', () => {
    // The live issue carries a GitHub issue type (issues.get); the event
    // payload may not, or may predate a type change.
    function withIssueType(octokit, typeName) {
      octokit.rest.issues.get = async () => ({
        data: { type: typeName ? { name: typeName } : null },
      });
      return octokit;
    }

    const LINEAR_BODY = [
      '## Chore Summary',
      '',
      'Add five approved conflict-resolution labels to the canonical label taxonomy.',
      'No issue-level label retirement or migration in this request.',
      'The decision and approver must be recorded.',
    ].join('\n');

    test('#3554: Chore issue whose body says "issue" gets only type:chore', async () => {
      const octokit = withIssueType(createMockOctokit([]), 'Chore');
      const report = await agent.runLabelingAgent({
        context: issueContext({
          title: '[LABEL-UPDATE-REQUEST] Add conflict-resolution labels to canonical taxonomy',
          body: LINEAR_BODY,
        }),
        github: octokit,
        dryRun: false,
      });
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:chore']);
      expect(octokit.calls.added).not.toContain('type:bug');
      expect(octokit.calls.added).not.toContain('type:task');
      expect(report.errors).toEqual([]);
    });

    test('live issue type wins over a stale payload type', async () => {
      const octokit = withIssueType(createMockOctokit([]), 'Chore');
      const context = issueContext({ title: 'Tidy labels', body: '' });
      context.payload.issue.type = { name: 'Bug' };
      await agent.runLabelingAgent({ context, github: octokit, dryRun: false });
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:chore']);
    });

    test('existing wrong type labels converge to the issue type', async () => {
      const octokit = withIssueType(createMockOctokit(['type:task', 'type:bug']), 'Chore');
      const report = await agent.runLabelingAgent({
        context: issueContext({ title: 'Tidy labels', labels: ['type:task', 'type:bug'] }),
        github: octokit,
        dryRun: false,
      });
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:chore']);
      expect(report.errors).toEqual([]);
    });

    test('a type missing from issue-types.yml falls back to its canonical slug', async () => {
      const octokit = withIssueType(createMockOctokit([]), 'Decision');
      await agent.runLabelingAgent({
        context: issueContext({ title: 'Choose a label policy', body: 'fix the process' }),
        github: octokit,
        dryRun: false,
      });
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:decision']);
    });

    test('an issue type with no canonical label falls back to content detection', async () => {
      const octokit = withIssueType(createMockOctokit([]), 'Widget');
      await agent.runLabelingAgent({
        context: issueContext({ title: 'fix: broken thing' }),
        github: octokit,
        dryRun: false,
      });
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:bug']);
    });

    test('no issue type: the word "issue" alone no longer means type:bug', async () => {
      const octokit = withIssueType(createMockOctokit([]), null);
      await agent.runLabelingAgent({
        context: issueContext({ title: 'Label taxonomy request', body: LINEAR_BODY }),
        github: octokit,
        dryRun: false,
      });
      // "Chore Summary" is the first whole-word match; "decision" no
      // longer matches `ci`, and "issue" no longer maps to type:bug.
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:chore']);
    });

    test('rerun with the same issue type mutates nothing (idempotent)', async () => {
      const first = withIssueType(createMockOctokit([]), 'Chore');
      await agent.runLabelingAgent({
        context: issueContext({ title: 'Tidy labels' }),
        github: first,
        dryRun: false,
      });
      const second = withIssueType(createMockOctokit([...first.state.labels]), 'Chore');
      await agent.runLabelingAgent({
        context: issueContext({ title: 'Tidy labels', labels: [...first.state.labels] }),
        github: second,
        dryRun: false,
      });
      expect(second.calls.added).toEqual([]);
      expect(second.calls.removed).toEqual([]);
    });

    test('removing the issue type (untyped) re-derives the type label', async () => {
      const octokit = withIssueType(createMockOctokit(['type:chore']), null);
      const context = issueContext({ title: 'Tidy labels', labels: ['type:chore'] });
      context.payload.action = 'untyped';
      const report = await agent.runLabelingAgent({ context, github: octokit, dryRun: false });
      // No title prefix or keyword: the default replaces the stale label.
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:task']);
      expect(octokit.calls.removed).toContain('type:chore');
      expect(report.errors).toEqual([]);
    });

    test('untyped re-derives from the title prefix when there is one', async () => {
      const octokit = withIssueType(createMockOctokit(['type:chore']), null);
      const context = issueContext({ title: 'fix: broken thing', labels: ['type:chore'] });
      context.payload.action = 'untyped';
      await agent.runLabelingAgent({ context, github: octokit, dryRun: false });
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:bug']);
    });

    test('other events on an issue without a type keep its existing type label', async () => {
      const octokit = withIssueType(createMockOctokit(['type:chore']), null);
      const context = issueContext({ title: 'fix: broken thing', labels: ['type:chore'] });
      context.payload.action = 'edited';
      await agent.runLabelingAgent({ context, github: octokit, dryRun: false });
      expect(octokit.state.labels.filter((l) => l.startsWith('type:'))).toEqual(['type:chore']);
      expect(octokit.calls.removed).toEqual([]);
    });

    test('keywords match whole words only', () => {
      const detect = agent.detectIssueTypeFromContent;
      expect(detect('', 'a decision was recorded')).not.toBe('type:ci');
      expect(detect('', 'update the prefix handling')).not.toBe('type:bug');
      expect(detect('', 'see the document')).not.toBe('type:docs');
      expect(detect('ci: pin actions', '')).toBe('type:ci');
      expect(detect('', 'this fixes #12')).toBe('type:bug');
      expect(detect('Report an issue', '')).toBeNull();
    });

    test('a conventional title prefix outranks body keywords', () => {
      const detect = agent.detectIssueTypeFromContent;
      const canonical = canonicalLabelSet();
      // #3541: "decision: …" with no issue type.
      expect(detect('decision: specs - pick one checklist', 'routine maintenance', canonical)).toBe(
        'type:decision'
      );
      expect(detect('fix(ci): pin actions', 'new feature', canonical)).toBe('type:bug');
      expect(detect('review: label consolidation', '', canonical)).toBe('type:review');
      // An unknown prefix falls through to keywords.
      expect(detect('wibble: tidy', 'routine maintenance', canonical)).toBe('type:chore');
    });

    test('every issue-types.yml entry maps to a canonical label', () => {
      const canonical = canonicalLabelSet();
      const map = agent.loadIssueTypeLabelMap(path.join(REPO_ROOT, '.github/issue-types.yml'));
      expect(map.size).toBeGreaterThan(0);
      for (const [name] of map) {
        expect([name, agent.labelForIssueType(name, map, canonical)]).toEqual([
          name,
          expect.stringMatching(/^type:/),
        ]);
      }
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
      expect(workflow).toMatch(/\.default_labels \| join/);
      expect(workflow).not.toMatch(/\.all_labels \| join/);
      expect(routeBranch('docs/claude-cloud-environment-spec')).toContain('type:docs');
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
