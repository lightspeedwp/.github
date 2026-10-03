const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '../../..');
const audit = '.github/reports/audits/2026-09-14-label-audit';
const spec = '.github/specs/008-label-audit-consolidation';
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const draft = (name) => read(`${audit}/change-requests/${name}.md`);
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

// These are acceptance checks for the Stage 1 artefacts, not tests of the
// future migration/deletion tools. No remote services or repository writes.
describe('Stage 1 Linear label export (T042)', () => {
  const {
    generated_at: generatedAt,
    sources,
    mappings,
  } = JSON.parse(read(`${audit}/evidence/linear-labels.json`));
  const { labels, linear_teams: teams } = sources;

  test('records a dated, read-only export with mappings deferred to T043', () => {
    expect(new Date(generatedAt).toISOString()).toBe(generatedAt);
    expect(sources.method).toMatch(/list_issue_labels.*includeArchived.*includeGroups/);
    expect(sources.method).toMatch(/list_issues filtered by label ID with includeArchived/);
    expect(sources.method).toContain('read-only');
    expect(mappings).toEqual([]);
    const canonical = JSON.parse(read(`${audit}/evidence/canonical-labels.json`));
    expect(sources.labels_yml_count).toBe(canonical.count);
  });

  test('partitions all 294 records into 236 workspace and 58 team labels', () => {
    const workspace = labels.filter(({ scope }) => scope === 'workspace');
    const teamLabels = labels.filter(({ scope }) => scope !== 'workspace');

    expect(labels).toHaveLength(294);
    expect(workspace).toHaveLength(236);
    expect(teamLabels).toHaveLength(58);
    expect(sources.linear_workspace_count).toBe(workspace.length);
    expect(sources.linear_team_label_count).toBe(teamLabels.length);
    expect(new Set(labels.map(({ id }) => id)).size).toBe(labels.length);
  });

  test('retains eight distinct teams, including teams without label records', () => {
    expect(teams).toHaveLength(8);
    expect(new Set(teams.map(({ id }) => id)).size).toBe(teams.length);
    expect(new Set(teams.map(({ key }) => key)).size).toBe(teams.length);
    for (const team of teams) {
      expect(team.id).toMatch(uuid);
      expect(team.key).toMatch(/^[A-Z]+$/);
      expect(team.name).toEqual(expect.stringMatching(/\S/));
    }
    const scopes = new Set(labels.map(({ scope }) => scope));
    expect(
      teams
        .filter(({ key }) => !scopes.has(key))
        .map(({ key }) => key)
        .sort()
    ).toEqual(['ASD', 'LSA', 'TO', 'TOA']);
  });

  test('every label has valid metadata, a known scope and a non-negative integer count', () => {
    const scopes = ['workspace', ...teams.map(({ key }) => key)];
    for (const label of labels) {
      expect(label.id).toMatch(uuid);
      expect(label.name).toEqual(expect.stringMatching(/\S/));
      expect(scopes).toContain(label.scope);
      expect(label.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(Number.isSafeInteger(label.issue_count)).toBe(true);
      expect(label.issue_count).toBeGreaterThanOrEqual(0);
      expect(typeof label.is_group).toBe('boolean');
      expect(label).toHaveProperty('group');
      expect(label).toHaveProperty('description');
      expect(label).toHaveProperty('retired_at');
      if (label.group !== null) expect(typeof label.group).toBe('string');
      if (label.description !== null) expect(typeof label.description).toBe('string');
      if (label.retired_at !== null) {
        expect(new Date(label.retired_at).toISOString()).toBe(label.retired_at);
        expect(Date.parse(label.retired_at)).toBeLessThanOrEqual(Date.parse(generatedAt));
      }
    }
  });

  test('keeps independent ID-filtered counts for the same name in different teams', () => {
    const records = labels.filter(({ name }) => name === 'security');
    expect(records.map(({ scope, issue_count: count }) => [scope, count]).sort()).toEqual([
      ['GIT', 0],
      ['INF', 4],
      ['LS', 7],
    ]);
    expect(new Set(records.map(({ id }) => id)).size).toBe(3);
  });

  test.each([
    ['5b752149-0828-4c93-bfd7-7a932437bdb6', 'scope: website'],
    ['b73eb37e-3273-4bb1-9e2b-4e51cfefed6e', 'type: feature'],
  ])('preserves the original spaced name and retired usage for %s', (id, name) => {
    expect(labels.find((label) => label.id === id)).toEqual(
      expect.objectContaining({
        name,
        scope: 'GIT',
        description: null,
        issue_count: 1,
        retired_at: expect.any(String),
      })
    );
  });

  test('retains unused labels and high-use labels without truncating counts', () => {
    expect(labels.find(({ id }) => id === 'e94832bf-9064-49f3-ab38-290ff42314aa')).toEqual(
      expect.objectContaining({ name: 'agent-audit', issue_count: 0 })
    );
    expect(labels.find(({ name, scope }) => name === 'type:task' && scope === 'workspace')).toEqual(
      expect.objectContaining({ issue_count: 1907 })
    );
    const retired = labels.filter(({ retired_at: retiredAt }) => retiredAt !== null);
    expect(retired).toHaveLength(5);
    expect(retired.reduce((total, label) => total + label.issue_count, 0)).toBe(7);
  });
});

describe('Stage 1 template request (T046b)', () => {
  const request = draft('pr-aiops-template-request');
  // Each comment in the single YAML fence starts a separate template fragment.
  // Loading the entire fence as one document would hide duplicate labels keys.
  const blocks = [...request.matchAll(/^```yaml\n([\s\S]*?)^```/gm)];
  const proposals = blocks.flatMap(([, body]) =>
    body
      .trim()
      .split(/\n\s*\n/)
      .map((fragment) => {
        const [comment, ...lines] = fragment.split('\n');
        return { file: comment.replace(/^# /, ''), ...yaml.load(lines.join('\n')) };
      })
  );
  const canonicalNames = new Set(yaml.load(read('.github/labels.yml')).map(({ name }) => name));
  const expectedFiles = [
    'pr_aiops.md',
    'pr_chore.md',
    'pr_ci.md',
    'pr_docs.md',
    'pr_task.md',
    'pr_test.md',
  ];

  test('provides exactly one parseable frontmatter fragment for each affected template', () => {
    expect(blocks).toHaveLength(1);
    expect(proposals.map(({ file }) => file).sort()).toEqual(expectedFiles);
  });

  test.each(expectedFiles)('%s proposes canonical, unique labels and exactly one type', (file) => {
    const proposal = proposals.find((entry) => entry.file === file);
    expect(proposal).toBeDefined();
    expect(Array.isArray(proposal.labels)).toBe(true);
    expect(new Set(proposal.labels).size).toBe(proposal.labels.length);
    for (const label of proposal.labels) expect(canonicalNames.has(label)).toBe(true);
    expect(proposal.labels.filter((label) => label.startsWith('type:'))).toHaveLength(1);
    expect(proposal.labels).toContain('status:needs-review');
    expect(proposal.labels).not.toContain('meta:needs-review');
    expect(proposal.labels).not.toContain('type:ai-ops');
    expect(proposal.labels).not.toContain('type:documentation');
    expect(Object.keys(proposal).sort()).toEqual(
      ['pr_aiops.md', 'pr_docs.md'].includes(file)
        ? ['file', 'labels', 'recommended_issue_type']
        : ['file', 'labels']
    );
  });

  test.each([
    ['pr_aiops.md', 'type:aiops', 'priority:normal', 'area:ai'],
    ['pr_chore.md', 'type:chore', 'priority:minor', 'area:core'],
    ['pr_ci.md', 'type:ci', 'priority:normal', 'area:ci'],
    ['pr_docs.md', 'type:docs', 'priority:minor', 'area:documentation'],
    ['pr_task.md', 'type:task', 'priority:normal', 'area:core'],
    ['pr_test.md', 'type:test', 'priority:normal', 'area:testing'],
  ])('%s preserves its classification, priority and area', (file, type, priority, area) => {
    const { labels } = proposals.find((entry) => entry.file === file);
    expect(labels.filter((label) => /^(type|priority|area):/.test(label)).sort()).toEqual(
      [type, priority, area].sort()
    );
  });

  test.each([
    ['pr_aiops.md', 'type:aiops'],
    ['pr_docs.md', 'type:docs'],
  ])('%s agrees on its replacement type label and recommended issue type', (file, type) => {
    const proposal = proposals.find((entry) => entry.file === file);
    expect(proposal.recommended_issue_type).toBe(type);
    expect(proposal.labels).toContain(type);
  });

  test('preserves the documentation changelog exemption', () => {
    expect(proposals.find(({ file }) => file === 'pr_docs.md').labels).toContain(
      'meta:no-changelog'
    );
  });
});

describe('Stage 1 OpenSpec migration table (T048)', () => {
  const request = draft('openspec-migration');
  const rows = request
    .split('\n')
    .filter((line) => line.startsWith('| `'))
    .map((line) => {
      const [source, target, rule] = line
        .split('|')
        .slice(1, 4)
        .map((cell) => cell.trim().replace(/`/g, ''));
      return { source, target, rule };
    });

  test('accounts for all 149 paths with 116 rule-based and 33 proposed changes', () => {
    expect(rows).toHaveLength(149);
    expect(new Set(rows.map(({ source }) => source)).size).toBe(rows.length);
    expect(rows.filter(({ rule }) => rule.startsWith('T048 rule'))).toHaveLength(116);
    expect(rows.filter(({ rule }) => rule.startsWith('Proposed'))).toHaveLength(33);
  });

  test('keeps paths relative, excludes historical records and avoids target collisions', () => {
    const targets = rows.filter(({ target }) => target !== '—').map(({ target }) => target);
    expect(new Set(targets).size).toBe(targets.length);
    for (const { source, target } of rows) {
      expect(source).toMatch(/openspec/i);
      expect(target).not.toMatch(/openspec/i);
      expect(target).not.toBe(source);
      for (const file of [source, target].filter((value) => value !== '—')) {
        expect(path.posix.isAbsolute(file)).toBe(false);
        expect(file.split('/')).not.toContain('..');
        expect(file).not.toMatch(/(?:^|\/)(?:reports|archived|node_modules)(?:\/|$)/);
      }
    }
  });

  test('removes only the root symlink and applies the three agreed rename rules', () => {
    expect(rows.filter(({ target }) => target === '—').map(({ source }) => source)).toEqual([
      'openspec',
    ]);
    for (const { source, target, rule } of rows.filter((row) => row.source !== 'openspec')) {
      const ruleTarget = source
        .replace(/(^|\/)OPENSPEC([^/]*\.md)$/, '$1SPEC$2')
        .replace(/^skills\/openspec-estimate-planner\//, 'skills/speckit-estimate-planner/')
        .replace(
          /^\.github\/projects\/active\/openspec\//,
          '.github/projects/active/speckit-changes/'
        );
      if (rule.startsWith('T048 rule')) expect(target).toBe(ruleTarget);
      else {
        expect(rule).toContain('needs approval');
        expect(target).not.toBe(ruleTarget);
      }
    }
  });

  test('proposed targets follow the documented additional naming proposals', () => {
    for (const { source, target } of rows.filter(({ rule }) => rule.startsWith('Proposed'))) {
      const proposedTarget = source
        .replace(/^skills\/openspec-estimate-planner\//, 'skills/speckit-estimate-planner/')
        .replace(
          /^\.github\/projects\/active\/openspec\//,
          '.github/projects/active/speckit-changes/'
        )
        .replace(/openspec-methodology-summary\.md$/, 'speckit-methodology-summary.md')
        .replace(/openspec/g, 'spec')
        .replace(/OPENSPEC/g, 'SPEC');
      expect(target).toBe(proposedTarget);
    }
  });
});

describe('Stage 1 deletion gate draft (T049)', () => {
  const request = draft('label-deletion-gate');
  const contract = read(`${spec}/contracts/dry-run-and-drift-report-schema.md`);

  test('uses the contract approval wording with both repository and run timestamp', () => {
    const approval = request.match(/```text\s*\n\s*([^\n]+)\n\s*```/);
    expect(approval).not.toBeNull();
    expect(approval[1].trim()).toBe('Approved: lightspeedwp/{repo} dry run {generated_at}');
    expect(contract).toContain('Approved: <repo> dry run <generated_at>');
  });

  test('documents explicit apply flags and keeps global deletion disabled', () => {
    expect(request).toContain('--apply --confirm-gate <this issue number>');
    expect(request).toMatch(/`destructive_cleanup.enabled`[^\n]*stays `false`/);
    expect(request).toContain('refuses any repository whose dry-run approval is not `approved`');
    expect(request).toContain('`approved_set_commit`');
    expect(request).toContain('`executed_at`');
    expect(request).toContain('`evidence/consolidation-log.jsonl`');
  });
});
