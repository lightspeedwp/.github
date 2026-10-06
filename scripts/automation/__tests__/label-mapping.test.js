/**
 * Tests for the spec 008 label mapping builder (T043, T046).
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { buildMappings, validateMappings } = require('../label-mapping.cjs');

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

const build = () =>
  buildMappings({
    yml,
    linear: linearFile.sources.labels,
    openspecInFiles,
    specNumberLabels: ['spec:001'],
    githubLive,
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

  it('reports a problem when a type merge is removed', () => {
    const { mappings, proposedNames } = build();
    const without = mappings.filter((m) => m.source !== 'type:build-ci');
    const next = new Set(proposedNames);
    next.add('type:build-ci');
    expect(validateMappings(without, next, yml, openspecInFiles).join(' ')).toMatch(/rule 5/);
  });
});
