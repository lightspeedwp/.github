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
  }).trim();
  const lines = raw.split('\n').filter(Boolean);
  return JSON.parse(lines[lines.length - 1] || '{}');
}

// A fake Octokit that records every write call instead of making it.
const FAKE_GITHUB = `
  const calls = [];
  const github = { rest: { issues: {
    addLabels: async (args) => { calls.push(['addLabels', args.labels]); },
    removeLabel: async (args) => { calls.push(['removeLabel', args.name]); },
    setLabels: async (args) => { calls.push(['setLabels', args.labels]); },
  } } };
`;

function standardize({ labels, aliasMap = {}, dryRun = false, removeUnmapped = false }) {
  return runNodeEsm(`
    const { standardizeLabelsOnItem } = await import('./scripts/agents/labeling.agent.js');
    ${FAKE_GITHUB}
    const result = await standardizeLabelsOnItem(
      github, 'o', 'r', 1, ${JSON.stringify(labels)},
      new Set(['type:bug', 'status:needs-triage']),
      ${JSON.stringify(aliasMap)}, ${dryRun}, () => {}, ${removeUnmapped},
    );
    console.log(JSON.stringify({ result, calls }));
  `);
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
      const { calls } = standardize({
        labels: ['bug', 'area:builds'],
        aliasMap: { bug: 'type:bug' },
        dryRun: true,
        removeUnmapped: true,
      });
      expect(calls).toEqual([]);
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

  it('honours DRY_RUN=true when run without options (FR-022)', () => {
    const summaryFile = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'labeling-agent-')),
      'summary.md'
    );
    fs.writeFileSync(summaryFile, '');
    const { calls } = runNodeEsm(
      `
      const { runLabelingAgent } = await import('./scripts/agents/labeling.agent.js');
      ${FAKE_GITHUB}
      const context = {
        repo: { owner: 'o', repo: 'r' },
        payload: { issue: {
          number: 1, title: 'fix: broken link', body: '',
          labels: [{ name: 'area:builds' }, { name: 'bug' }],
        } },
      };
      await runLabelingAgent({ context, github });
      console.log(JSON.stringify({ calls }));
    `,
      { DRY_RUN: 'true', GITHUB_STEP_SUMMARY: summaryFile }
    );
    expect(calls).toEqual([]);
  });
});
