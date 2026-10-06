/**
 * Tests for the spec 008 label mapping builder (T043, T046).
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { buildMappings, validateMappings, shouldWrite } = require('../label-mapping.cjs');

const root = path.resolve(__dirname, '../../..');
const audit = path.join(root, '.github/reports/audits/2026-09-14-label-audit');
const yml = yaml.load(fs.readFileSync(path.join(root, '.github/labels.yml'), 'utf8'));
const linearFile = JSON.parse(
  fs.readFileSync(path.join(audit, 'evidence/linear-labels.json'), 'utf8')
);
const refs = fs.readFileSync(path.join(audit, 'evidence/renamed-label-references.json'), 'utf8');
const openspecInFiles = [
  ...new Set([...refs.matchAll(/openspec:[a-z][a-z0-9-]*/gi)].map((m) => m[0])),
].sort();

const githubLive = JSON.parse(
  fs.readFileSync(path.join(audit, 'evidence/github-live-labels.json'), 'utf8')
).labels.map((l) => l.name);

const githubOnly = JSON.parse(
  fs.readFileSync(path.join(audit, 'evidence/github-label-coverage.json'), 'utf8')
).labels;
const bare = JSON.parse(
  fs.readFileSync(
    path.join(root, '.github/reports/label-remediation/bare-label-mapping.json'),
    'utf8'
  )
);

const build = () =>
  buildMappings({
    yml,
    linear: linearFile.sources.labels,
    openspecInFiles,
    specNumberLabels: ['spec:001'],
    githubLive,
    githubOnly,
    bare,
  });

describe('label mapping', () => {
  it('passes every schema validation rule', () => {
    const { mappings, proposedNames } = build();
    expect(validateMappings(mappings, proposedNames, yml, openspecInFiles)).toEqual([]);
  });

  it('is the mapping saved in linear-labels.json', () => {
    expect(linearFile.mappings).toEqual(JSON.parse(JSON.stringify(build().mappings)));
  });

  it('ends with exactly 25 type labels', () => {
    const { proposedNames } = build();
    expect([...proposedNames].filter((n) => n.startsWith('type:'))).toHaveLength(25);
  });

  it('gives every gap entry a stated reason and never targets a spec number', () => {
    const gaps = build().mappings.filter((m) => m.gap);
    expect(gaps.length).toBeGreaterThan(0);
    for (const gap of gaps) {
      expect(gap.notes.length).toBeGreaterThan(20);
      expect(gap.target || '').not.toMatch(/^spec:\d+$/);
    }
  });

  it('names the real colour and description source in each import note', () => {
    const imports = build().mappings.filter(
      (m) => m.action === 'import' && /^Proposed/.test(m.notes)
    );
    expect(imports.length).toBeGreaterThan(0);
    for (const entry of imports) {
      expect(entry.notes).toMatch(
        /Colour is the (family default|Linear label's own|fallback EDEDED);/
      );
      const placeholder = /description to be written at approval/.test(entry.description);
      expect(entry.notes).toContain(
        placeholder ? 'description is a placeholder' : "description is Linear's own"
      );
    }
  });

  it('keeps all eight FR-015 re-prefix rows, because each exists as a live GitHub label', () => {
    const { mappings, absentSources } = build();
    const rows = mappings.filter((m) => m.action === 're-prefix');
    expect(rows).toHaveLength(8);
    expect(absentSources).toEqual([]);
    for (const row of rows) expect(row.systems).toContain('github');
  });

  it('skips and reports a re-prefix source that exists in no system', () => {
    const { mappings, absentSources } = buildMappings({
      yml,
      linear: linearFile.sources.labels,
      openspecInFiles,
      specNumberLabels: ['spec:001'],
      githubLive: [],
    });
    const skipped = absentSources.map((a) => a.source);
    expect(skipped).toHaveLength(7);
    expect(skipped).not.toContain('type:maintenance');
    for (const source of skipped) expect(mappings.some((m) => m.source === source)).toBe(false);
  });

  it('rejects a gap name that has no explicit decision instead of retiring it', () => {
    expect(() =>
      buildMappings({
        yml,
        linear: linearFile.sources.labels,
        openspecInFiles: [...openspecInFiles, 'openspec:brand-new'],
        specNumberLabels: [],
        githubLive,
      })
    ).toThrow(/openspec:brand-new has no GAP_MAP decision/);
  });

  it('gives every import a change request, and area:labels cites #3757', () => {
    const imports = build().mappings.filter((m) => m.action === 'import');
    // 49 before the 8 unprefixed names (3 merged, 5 open decisions) left the import list.
    expect(imports).toHaveLength(41);
    for (const entry of imports) expect(Number.isInteger(entry.change_request)).toBe(true);
    expect(imports.find((m) => m.source === 'area:labels').change_request).toBe(3757);
    expect(imports.find((m) => m.source === 'area:builds').change_request).toBe(3554);
  });

  it('merges the five GitHub-only labels that have a decided precedent, and retires the rest of #3832', () => {
    const rows = new Map(build().mappings.map((m) => [m.source, m]));
    const merged = {
      'component:workflows': 'area:workflows',
      'component:ci': 'area:ci',
      'meta:refactor': 'type:refactor',
      observability: 'area:observability',
      'area:accessibility': 'area:a11y',
    };
    for (const [source, target] of Object.entries(merged)) {
      expect(rows.get(source)).toMatchObject({ action: 'merge', target, change_request: 3834 });
    }
    const retired = [
      'agent-audit',
      'migrate:type:enhancement',
      'migrate:type:compatibility',
      'migrate:openspec:status/planning',
      'migrate:openspec:status/implementation',
      'migrate:openspec:status/production',
      'migrate:openspec:status/testing',
      'phase-1-critical',
      'phase-2-medium',
      'phase-3-polish',
      'phase:1',
      'ag-p14',
      'ag-phase',
      'bug-fix',
      'code-quality',
      'error-handling',
      'logging',
      'reliability',
      'reviewer',
    ];
    for (const source of retired) {
      expect(rows.get(source)).toMatchObject({ action: 'retire', target: null });
    }
    expect(rows.get('area:monorepo')).toMatchObject({ action: 'team-scope' });
  });

  it('takes area:labels colour and description from its own request, #3757 (FR-012, R16)', () => {
    const row = build().mappings.find((m) => m.source === 'area:labels');
    expect(row).toMatchObject({
      action: 'import',
      color: 'EDEDED',
      description: 'Label governance and routing',
      change_request: 3757,
    });
    expect(row.notes).toContain('#3757');
  });

  it('imports only prefixed labels, because labels.yml cannot carry any other (rule 11)', () => {
    const imports = build().mappings.filter((m) => m.action === 'import');
    expect(imports.length).toBeGreaterThan(0);
    for (const entry of imports) expect(entry.source).toMatch(/^[^:\s]+:\S/);
  });

  it('merges bug, epic and security by the earlier bare-label mapping (#2523)', () => {
    const rows = new Map(build().mappings.map((m) => [m.source, m]));
    for (const [source, target] of [
      ['bug', 'type:bug'],
      ['epic', 'type:epic'],
      ['security', 'type:security'],
    ]) {
      expect(rows.get(source)).toMatchObject({ action: 'merge', target });
      expect(rows.get(source).systems).toContain('linear');
    }
  });

  it('records the five unprefixed Linear-only labels as open decisions, not as imports', () => {
    const rows = new Map(build().mappings.map((m) => [m.source, m]));
    const open = [
      'Hosting',
      'CI/CD',
      'master-ci-red',
      'ci-runner-audit-2026-07-20',
      'harvest-parity',
    ];
    for (const source of open) {
      expect(rows.get(source)).toMatchObject({ action: 'retire', target: null, gap: true });
      expect(rows.get(source).notes).toMatch(/not decided/);
    }
    // A suggestion is only a hint to the approver.
    expect(rows.get('Hosting').notes).toContain('area:hosting');
    expect(rows.get('CI/CD').notes).toContain('area:ci');
    expect(rows.get('harvest-parity').notes).toContain('no approved label matches');
  });

  it('reports an unprefixed import (rule 11)', () => {
    const { mappings, proposedNames } = build();
    const broken = [
      ...mappings,
      {
        source: 'hosting-only',
        systems: ['linear'],
        action: 'import',
        target: null,
        issue_count: 3,
        requirement: 'FR-012',
        color: 'EDEDED',
        description: 'x',
        change_request: 3834,
        notes: 'Proposed.',
      },
    ];
    expect(validateMappings(broken, proposedNames, yml, openspecInFiles)).toContain(
      'rule 11: import hosting-only is not a prefixed label'
    );
  });

  it('reports an import that cites no change request', () => {
    const { mappings, proposedNames } = build();
    const broken = mappings.map((m) =>
      m.source === 'area:labels' ? { ...m, change_request: null } : m
    );
    expect(validateMappings(broken, proposedNames, yml, openspecInFiles).join(' ')).toMatch(
      /rule 10: import area:labels/
    );
  });

  it('writes the evidence file only when validation found no problems', () => {
    expect(shouldWrite([])).toBe(true);
    expect(shouldWrite(['rule 5: the type family has 29 labels, not 25'])).toBe(false);
  });

  it('reports a problem when a type merge is removed', () => {
    const { mappings, proposedNames } = build();
    const without = mappings.filter((m) => m.source !== 'type:build-ci');
    const next = new Set(proposedNames);
    next.add('type:build-ci');
    expect(validateMappings(without, next, yml, openspecInFiles).join(' ')).toMatch(/rule 5/);
  });
});
