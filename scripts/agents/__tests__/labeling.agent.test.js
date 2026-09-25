/**
 * Jest suite for `labeling.agent.js`.
 *
 * labeling.agent.js is genuine ESM and imports @actions/github (ESM-only), so,
 * like project-meta-sync.agent.test.js, each test runs a real Node ESM
 * subprocess that dynamically imports the module and prints a JSON result.
 *
 * @see ../labeling.agent.js
 * @see ../../../.github/specs/008-label-audit-consolidation/spec.md (FR-017, FR-022)
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const yaml = require('js-yaml');

const repoRoot = path.resolve(__dirname, '../../..');

function runNodeEsm(code, env = {}) {
  const raw = execFileSync(process.execPath, ['--input-type=module', '-e', code], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env, ...env },
    timeout: 10000,
  }).trim();
  const lines = raw.split('\n').filter(Boolean);
  return JSON.parse(lines[lines.length - 1] || '{}');
}

// A fake Octokit that records every write call instead of making it.
const FAKE_GITHUB = `
  const calls = [];
  const requests = [];
  const github = { rest: { issues: {
    addLabels: async (args) => { calls.push(['addLabels', args.labels]); requests.push(args); },
    removeLabel: async (args) => { calls.push(['removeLabel', args.name]); requests.push(args); },
    setLabels: async (args) => { calls.push(['setLabels', args.labels]); requests.push(args); },
  } } };
`;

function standardize({ labels, aliasMap = {}, dryRun = false, removeUnmapped = false }) {
  return runNodeEsm(`
    const { standardizeLabelsOnItem } = await import('./scripts/agents/labeling.agent.js');
    ${FAKE_GITHUB}
    const logs = [];
    const result = await standardizeLabelsOnItem(
      github, 'o', 'r', 1, ${JSON.stringify(labels)},
      new Set(['type:bug', 'status:needs-triage']),
      ${JSON.stringify(aliasMap)}, ${dryRun}, (message) => logs.push(message), ${removeUnmapped},
    );
    console.log(JSON.stringify({ result, calls, requests, logs }));
  `);
}

function runAgent({
  labels = ['status:needs-triage', 'priority:normal', 'type:bug', 'bug', 'area:builds'],
  env = {},
  options = {},
} = {}) {
  const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'labeling-agent-'));
  try {
    const labelsConfig = path.join(fixtureDir, 'labels.yml');
    const labelerRules = path.join(fixtureDir, 'labeler.yml');
    const summaryFile = path.join(fixtureDir, 'summary.md');
    fs.writeFileSync(
      labelsConfig,
      yaml.dump([
        { name: 'type:bug', aliases: ['bug'] },
        { name: 'status:needs-triage' },
        { name: 'priority:normal' },
      ])
    );
    fs.writeFileSync(labelerRules, '{}\n');
    fs.writeFileSync(summaryFile, '');

    return runNodeEsm(
      `
      const { runLabelingAgent } = await import('./scripts/agents/labeling.agent.js');
      ${FAKE_GITHUB}
      const context = {
        repo: { owner: 'o', repo: 'r' },
        payload: { issue: {
          number: 1, title: 'Maintenance request', body: '',
          labels: ${JSON.stringify(labels)}.map((name) => ({ name })),
        } },
      };
      const report = await runLabelingAgent({ context, github, ...${JSON.stringify(options)} });
      console.log(JSON.stringify({ report, calls, requests }));
    `,
      {
        DRY_RUN: 'false',
        LABELING_REMOVE_UNMAPPED: 'false',
        LABELS_CONFIG: labelsConfig,
        LABELER_RULES: labelerRules,
        GITHUB_STEP_SUMMARY: summaryFile,
        ...env,
      }
    );
  } finally {
    fs.rmSync(fixtureDir, { recursive: true, force: true });
  }
}

describe('labeling.agent', () => {
  it('agent module file exists', () => {
    const agentPath = path.join(__dirname, '../labeling.agent.js');
    expect(fs.existsSync(agentPath)).toBe(true);
  });

  describe('standardizeLabelsOnItem (FR-022)', () => {
    it('keeps a label that is not in labels.yml and has no mapping', () => {
      const { result, calls } = standardize({
        labels: ['type:bug', 'area:builds'],
      });
      expect(calls).toEqual([]);
      expect(result.kept).toEqual(['area:builds']);
      expect(result.removed).toEqual([]);
    });

    it('replaces a label that has a canonical mapping', () => {
      const { result, calls } = standardize({
        labels: ['bug'],
        aliasMap: { bug: 'type:bug' },
      });
      expect(calls).toEqual([
        ['addLabels', ['type:bug']],
        ['removeLabel', 'bug'],
      ]);
      expect(result.migrated).toEqual(['bug -> type:bug']);
    });

    it('removes an unmapped label only when removeUnmapped is on', () => {
      const { result, calls } = standardize({
        labels: ['area:builds'],
        removeUnmapped: true,
      });
      expect(calls).toEqual([['removeLabel', 'area:builds']]);
      expect(result.removed).toEqual(['area:builds']);
    });

    it('makes no write call in dry-run mode', () => {
      const { result, calls } = standardize({
        labels: ['bug', 'area:builds'],
        aliasMap: { bug: 'type:bug' },
        dryRun: true,
        removeUnmapped: true,
      });
      expect(calls).toEqual([]);
      expect(result).toEqual({
        migrated: ['bug -> type:bug'],
        removed: ['area:builds'],
        kept: [],
      });
    });

    it('leaves canonical labels untouched and migrates aliases before removing unmapped labels', () => {
      const { result, calls, requests } = standardize({
        labels: ['type:bug', 'bug', 'area:builds', 'status:needs-triage'],
        aliasMap: { bug: 'type:bug' },
        removeUnmapped: true,
      });
      expect(result).toEqual({
        migrated: ['bug -> type:bug'],
        removed: ['area:builds'],
        kept: [],
      });
      expect(calls).toEqual([
        ['addLabels', ['type:bug']],
        ['removeLabel', 'bug'],
        ['removeLabel', 'area:builds'],
      ]);
      expect(requests).toEqual([
        { owner: 'o', repo: 'r', issue_number: 1, labels: ['type:bug'] },
        { owner: 'o', repo: 'r', issue_number: 1, name: 'bug' },
        { owner: 'o', repo: 'r', issue_number: 1, name: 'area:builds' },
      ]);
    });

    it('keeps multiple unmapped labels and logs each one when removal is disabled', () => {
      const { result, calls, logs } = standardize({
        labels: ['area:builds', 'meta:external'],
      });
      expect(result).toEqual({
        migrated: [],
        removed: [],
        kept: ['area:builds', 'meta:external'],
      });
      expect(calls).toEqual([]);
      expect(logs).toEqual([
        '[labeling.agent] Kept non-canonical label with no mapping: area:builds on #1',
        '[labeling.agent] Kept non-canonical label with no mapping: meta:external on #1',
      ]);
    });
  });

  describe('corrected type labels (FR-017)', () => {
    it.each([
      ['documentation', 'type:docs'],
      ['dependencies', 'type:dependency'],
      ['accessibility', 'type:a11y'],
    ])('detects %s in content as %s', (keyword, expected) => {
      const { titleType, bodyType } = runNodeEsm(`
        const { detectIssueTypeFromContent } = await import('./scripts/agents/labeling.agent.js');
        console.log(JSON.stringify({
          titleType: detectIssueTypeFromContent(${JSON.stringify(keyword)}, ''),
          bodyType: detectIssueTypeFromContent('', ${JSON.stringify(keyword)}),
        }));
      `);
      expect(titleType).toBe(expected);
      expect(bodyType).toBe(expected);
    });

    it.each([
      ['docs/update-guide', 'type:docs'],
      ['deps/update-packages', 'type:dependency'],
      ['A11Y/improve-contrast', 'type:a11y'],
    ])('detects branch %s as %s', (branch, expected) => {
      const { type } = runNodeEsm(`
        const { detectTypeFromBranch } = await import('./scripts/agents/labeling.agent.js');
        console.log(JSON.stringify({ type: detectTypeFromBranch(${JSON.stringify(branch)}) }));
      `);
      expect(type).toBe(expected);
    });
  });

  it('applies only type labels that exist in labels.yml (FR-017)', () => {
    const canonical = new Set(
      yaml
        .load(fs.readFileSync(path.join(repoRoot, '.github/labels.yml'), 'utf8'))
        .map((label) => (typeof label === 'string' ? label : label.name))
    );
    const { labels } = runNodeEsm(`
      const { KEYWORD_TYPE_MAP, BRANCH_PREFIX_TYPE_MAP } = await import('./scripts/agents/labeling.agent.js');
      const labels = [...new Set([...Object.values(KEYWORD_TYPE_MAP), ...Object.values(BRANCH_PREFIX_TYPE_MAP)])];
      console.log(JSON.stringify({ labels }));
    `);
    expect(labels.length).toBeGreaterThan(0);
    expect(labels.filter((label) => !canonical.has(label))).toEqual([]);
  });

  it('honours DRY_RUN=true without an explicit option and reports planned changes (FR-022)', () => {
    const { report, calls } = runAgent({
      env: { DRY_RUN: 'true', LABELING_REMOVE_UNMAPPED: 'true' },
    });
    expect(calls).toEqual([]);
    expect(report.success).toBe(true);
    expect(report.errors).toEqual([]);
    expect(report.migrated).toEqual(['bug -> type:bug']);
    expect(report.removed).toEqual(['area:builds']);
  });

  it('migrates mapped labels and keeps unmapped labels by default in the agent report', () => {
    const { report, calls } = runAgent();
    expect(report.success).toBe(true);
    expect(report.migrated).toEqual(['bug -> type:bug']);
    expect(report.removed).toEqual([]);
    expect(calls).toEqual([
      ['addLabels', ['type:bug']],
      ['removeLabel', 'bug'],
    ]);
  });

  it('removes unmapped labels when LABELING_REMOVE_UNMAPPED=true', () => {
    const { report, calls } = runAgent({ env: { LABELING_REMOVE_UNMAPPED: 'true' } });
    expect(report.removed).toEqual(['area:builds']);
    expect(calls).toContainEqual(['removeLabel', 'area:builds']);
  });

  it('lets explicit false options override true environment settings', () => {
    const { report, calls } = runAgent({
      env: { DRY_RUN: 'true', LABELING_REMOVE_UNMAPPED: 'true' },
      options: { dryRun: false, removeUnmapped: false },
    });
    expect(report.migrated).toEqual(['bug -> type:bug']);
    expect(report.removed).toEqual([]);
    expect(calls).toEqual([
      ['addLabels', ['type:bug']],
      ['removeLabel', 'bug'],
    ]);
  });

  it('lets an explicit dry-run option suppress writes when DRY_RUN=false', () => {
    const { report, calls } = runAgent({ options: { dryRun: true } });
    expect(report.migrated).toEqual(['bug -> type:bug']);
    expect(calls).toEqual([]);
  });
});
