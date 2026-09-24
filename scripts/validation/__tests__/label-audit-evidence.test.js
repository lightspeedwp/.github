const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '../../..');
const audit = '.github/reports/audits/2026-09-14-label-audit';
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const evidence = (name) => JSON.parse(read(`${audit}/evidence/${name}.json`));
const names = (labels) => labels.map((label) => label.name);
const sorted = (labels) => [...labels].sort();

describe('Label audit evidence', () => {
  const canonical = evidence('canonical-labels');
  const families = evidence('label-families');
  const issueTypes = evidence('issue-types');
  const policy = evidence('governance-policy');
  const findings = evidence('all-findings');
  const inventory = JSON.parse(read(`${audit}/label-inventory.json`));
  // The evidence is a snapshot of the configuration on the audit date
  // (2026-09-14). Consolidation changes the live files afterwards, so these
  // checks compare the evidence with itself, not with the live files.

  test('canonical snapshot contains 169 unique labels', () => {
    const canonicalNames = names(canonical.labels);

    expect(new Set(canonicalNames).size).toBe(canonicalNames.length);
    expect(canonical.count).toBe(canonicalNames.length);
    expect(canonical.count).toBe(169);
  });

  test('families partition the canonical labels without omissions or duplicates', () => {
    const groups = Object.entries(families.families);
    const familyLabels = groups.flatMap(([family, labels]) => {
      expect(labels.every((label) => label.startsWith(`${family}:`))).toBe(true);
      return labels;
    });

    expect(groups.map(([family]) => family).sort()).toEqual(sorted(canonical.families));
    expect(families.family_count).toBe(groups.length);
    expect(canonical.family_count).toBe(groups.length);
    expect(families.total_labels).toBe(canonical.count);
    expect(familyLabels.length).toBe(new Set(familyLabels).size);
    expect(sorted(familyLabels)).toEqual(sorted(names(canonical.labels)));
  });

  test('issue-type snapshot records only the unmapped exception', () => {
    const mapped = issueTypes.type_labels;
    const canonicalTypes = names(canonical.labels).filter((label) => label.startsWith('type:'));
    const unmapped = canonicalTypes.filter((label) => !mapped.includes(label));

    expect(issueTypes.count).toBe(mapped.length);
    expect(new Set(mapped).size).toBe(mapped.length);
    expect(mapped.every((label) => canonicalTypes.includes(label))).toBe(true);
    expect(unmapped).toEqual(['type:decision']);
    expect(findings.type_label_gaps).toEqual(unmapped);
  });

  test('missing-label findings match the policy snapshot', () => {
    const protectedLabels = policy.never_delete_labels;
    const canonicalNames = new Set(names(canonical.labels));
    const missing = protectedLabels.filter((label) => !canonicalNames.has(label));

    expect(policy.count).toBe(protectedLabels.length);
    expect(new Set(protectedLabels).size).toBe(protectedLabels.length);
    expect(sorted(findings.governance_gaps.map(({ label }) => label))).toEqual(sorted(missing));
    expect(findings.governance_gaps).toEqual(
      expect.arrayContaining(
        missing.map((label) => ({
          label,
          found_in: 'governance_policy',
          finding_type: 'missing_from_canonical',
        }))
      )
    );
    expect(missing).toHaveLength(12);
  });

  test('live never-delete list only protects labels in labels.yml (T055)', () => {
    const live = new Set(names(yaml.load(read('.github/labels.yml'))));
    const livePolicy = yaml.load(read('.github/label-governance-policy.yml'));
    const protectedLabels = livePolicy.destructive_cleanup.never_delete_labels;

    expect(protectedLabels.filter((label) => !live.has(label))).toEqual([]);
    expect(protectedLabels).not.toContain('type:question');
  });

  test('findings and summary reflect the two independent sources of gaps', () => {
    const canonicalTypes = names(canonical.labels).filter((label) => label.startsWith('type:'));

    expect(findings.all_findings).toEqual([
      ...findings.governance_gaps,
      ...findings.type_label_gaps.map((label) => ({
        label,
        found_in: 'canonical_labels',
        finding_type: 'issue_type_mapping_exception',
        severity: 'HIGH',
      })),
    ]);
    expect(findings.summary).toEqual({
      total_canonical: canonical.count,
      total_type_mappings: issueTypes.count,
      total_canonical_type_labels: canonicalTypes.length,
      total_policy_labels: policy.count,
      governance_gaps: findings.governance_gaps.length,
      type_label_gaps: findings.type_label_gaps.length,
    });
  });

  test('JSON and CSV inventory classify every canonical label consistently', () => {
    const rows = read(`${audit}/label-inventory.csv`).trimEnd().split('\n');
    const mapped = new Set(issueTypes.type_labels);
    const protectedLabels = new Set(policy.never_delete_labels);

    expect(rows.shift()).toBe('Family,Label,In_Canonical,In_Issue_Types,In_Policy,Status');
    expect(inventory.labels).toEqual(canonical.labels);
    expect(inventory.total_labels).toBe(canonical.count);
    expect(inventory.families).toBe(canonical.family_count);
    expect(inventory.summary).toEqual({
      total: canonical.count,
      families: canonical.family_count,
      type_labels: findings.summary.total_canonical_type_labels,
      type_unmapped: findings.type_label_gaps.length,
    });
    expect(rows).toHaveLength(canonical.count);
    expect(rows).toEqual(
      names(canonical.labels).map((label) =>
        [
          label.split(':')[0],
          label,
          'YES',
          mapped.has(label) ? 'YES' : 'NO',
          protectedLabels.has(label) ? 'YES' : 'NO',
          findings.type_label_gaps.includes(label) ? 'TYPE_UNMAPPED' : 'OK',
        ].join(',')
      )
    );
  });

  test('referenced documentation and archived workflows exist locally', () => {
    const documentation = evidence('documentation-references');
    const workflows = evidence('archived-workflows');

    expect(documentation.count).toBe(documentation.documentation_files.length);
    expect(workflows.count).toBe(workflows.archived_workflows.length);
    expect(documentation.count).toBe(18);
    expect(workflows.count).toBe(11);
    for (const file of documentation.documentation_files) {
      expect(fs.existsSync(path.join(root, file))).toBe(true);
    }
    for (const file of workflows.archived_workflows) {
      expect(
        fs.existsSync(path.join(root, `.github/workflows/archived/2026-09-11/labeling/${file}`))
      ).toBe(true);
    }
  });

  test('report totals reflect the audited evidence, not the unavailable GitHub API', () => {
    const report = read(`${audit}/007-audit-report.md`);
    const api = evidence('github-api-labels');

    expect(api.count).toBe(api.labels.length);
    expect(report).toContain(`| **Total Labels Audited** | ${canonical.count} |`);
    expect(report).toContain(`| **Type Labels (Issue-Types Mapped)** | ${issueTypes.count} |`);
    expect(report).toContain(`| **Governance Policy Labels** | ${policy.count} |`);
    expect(report).toContain(
      `| **Affected Labels in Governance Gaps** | ${findings.all_findings.length} |`
    );
  });
});
