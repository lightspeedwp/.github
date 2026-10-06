/**
 * Tests for the unapproved-label coverage collector and the GitHub-only rows it feeds
 * (spec 008 FR-016, FR-018).
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { collectUnapprovedNames } = require('../label-coverage.cjs');
const { buildMappings, validateMappings } = require('../label-mapping.cjs');

const root = path.resolve(__dirname, '../../..');
const audit = path.join(root, '.github/reports/audits/2026-09-14-label-audit/evidence');
const read = (file) => JSON.parse(fs.readFileSync(path.join(audit, file), 'utf8'));

const diff = (location, label, items = '', difference = 'unapproved') => ({
  location: `lightspeedwp/${location}`,
  label,
  difference,
  items,
});

describe('collectUnapprovedNames', () => {
  const report = {
    differences: [
      diff('pub-a', 'wip', 3),
      diff('pub-b', 'wip', ''),
      diff('pub-a', 'shared'),
      diff('secret-repo', 'shared', 9),
      diff('secret-repo', 'internal-only', 5),
      diff('pub-a', 'colour-only', 1, 'colour mismatch'),
    ],
  };
  const result = collectUnapprovedNames(report, new Set(['secret-repo']));

  it('keeps names found in a public repository, with public counts only', () => {
    expect(result.names).toEqual([
      { name: 'shared', repositories: 1, known_items: 0 },
      { name: 'wip', repositories: 2, known_items: 3 },
    ]);
  });

  it('counts, and never names, a label found only in private repositories', () => {
    expect(result.privateOnlyCount).toBe(1);
    expect(JSON.stringify(result)).not.toContain('internal-only');
    expect(JSON.stringify(result)).not.toContain('secret-repo');
  });

  it('ignores differences that are not unapproved labels', () => {
    expect(result.names.map((n) => n.name)).not.toContain('colour-only');
  });
});

describe('saved coverage evidence', () => {
  const coverage = read('github-label-coverage.json');

  it('names no private repository and states how many labels it withheld', () => {
    const text = JSON.stringify(coverage);
    expect(coverage.private_only_label_count).toBeGreaterThanOrEqual(0);
    expect(text).not.toMatch(/lightspeedwp\//);
    expect(coverage.count).toBe(coverage.labels.length);
    // The repository aggregate is inclusive; the note must say so.
    expect(coverage.note).toMatch(/all qualifying repositories, including private ones/);
  });
});

describe('label update request', () => {
  it('fits in a GitHub issue body (65,536 characters)', () => {
    const body = fs.readFileSync(
      path.join(audit, '../change-requests/label-update-request.md'),
      'utf8'
    );
    expect(body.length).toBeLessThan(60000);
  });
});

describe('GitHub-only rows', () => {
  const yml = yaml.load(fs.readFileSync(path.join(root, '.github/labels.yml'), 'utf8'));
  const linear = read('linear-labels.json').sources.labels;
  const refs = fs.readFileSync(path.join(audit, 'renamed-label-references.json'), 'utf8');
  const openspecInFiles = [
    ...new Set([...refs.matchAll(/openspec:[a-z][a-z0-9-]*/gi)].map((m) => m[0])),
  ].sort();
  const githubLive = read('github-live-labels.json').labels.map((l) => l.name);
  const bare = JSON.parse(
    fs.readFileSync(
      path.join(root, '.github/reports/label-remediation/bare-label-mapping.json'),
      'utf8'
    )
  );
  const build = (githubOnly) =>
    buildMappings({
      yml,
      linear,
      openspecInFiles,
      specNumberLabels: ['spec:001'],
      githubLive,
      githubOnly,
      bare,
    });
  const rowFor = (name, labels = [{ name, repositories: 1, known_items: 0 }]) =>
    build(labels).mappings.find((m) => m.source === name && m.requirement === 'FR-016');

  it('renames a name that differs only in case or separator', () => {
    expect(rowFor('priority/high')).toMatchObject({ action: 'rename', target: 'priority:high' });
  });

  it('follows a variant through the label it is merged into', () => {
    expect(rowFor('type/documentation')).toMatchObject({ action: 'merge', target: 'type:docs' });
  });

  it('uses the earlier bare-label mapping and carries the concept label', () => {
    expect(rowFor('ui')).toMatchObject({
      action: 'merge',
      target: 'type:design',
      concept_label: 'area:frontend',
    });
  });

  it('points a migrate label at the label its name points to, after renames', () => {
    expect(rowFor('migrate:area:tests')).toMatchObject({
      action: 'merge',
      target: 'area:testing',
    });
  });

  it('gives an existing migrate row the target its name points to after a rename', () => {
    const rows = build([]).mappings;
    expect(rows.find((m) => m.source === 'migrate:type:ai-ops')).toMatchObject({
      action: 'retire',
      target: 'type:aiops',
    });
    expect(rows.find((m) => m.source === 'migrate:type:maintenance')).toMatchObject({
      target: 'type:chore',
      concept_label: 'area:maintenance',
    });
  });

  it('retires an unknown label with a reason and leaves items to the dry run', () => {
    const row = rowFor('task:T999');
    expect(row).toMatchObject({ action: 'retire', target: null, systems: ['github'] });
    expect(row.notes).toMatch(/needs_decision/);
  });

  it('adds nothing for a name already approved or already mapped', () => {
    const rows = build([
      { name: 'type:bug', repositories: 1, known_items: 0 },
      { name: 'ai-ops:agents', repositories: 1, known_items: 0 },
    ]).mappings.filter((m) => m.requirement === 'FR-016');
    expect(rows).toEqual([]);
  });

  it('gives every name in the saved evidence a row or an existing mapping, and passes validation', () => {
    const labels = read('github-label-coverage.json').labels;
    const { mappings, proposedNames } = build(labels);
    const sources = new Set(mappings.map((m) => m.source));
    const proposed = new Set([...proposedNames].map((n) => n.toLowerCase()));
    for (const { name } of labels) {
      const approved = proposed.has(name.toLowerCase());
      const viaMigrate = name.startsWith('migrate:') && proposed.has(name.slice(8).toLowerCase());
      expect(approved || viaMigrate || sources.has(name)).toBe(true);
    }
    expect(validateMappings(mappings, proposedNames, yml, openspecInFiles)).toEqual([]);
  });
});
