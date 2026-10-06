#!/usr/bin/env node
/**
 * Collects the label names that exist in lightspeedwp repositories but are not in
 * `labels.yml`, from a label drift report (`linear-drift-report.json`, the
 * artifact of the weekly drift check).
 *
 * Only names found in at least one PUBLIC repository are kept. A name found only
 * in private repositories is counted but never named, because this repository is
 * public (spec 008 FR-018, label-mapping schema). The per-label repository and
 * item counts use public repositories only. The one aggregate,
 * `repositories_with_unapproved_labels`, counts every qualifying repository,
 * private ones included; the privacy decision allows aggregate counts but never
 * private repository names or their labels.
 *
 * Usage: node scripts/automation/label-coverage.cjs <report.json> <private-repos.txt> [--write]
 * `private-repos.txt` holds one repository name per line (for example from
 * `gh repo list lightspeedwp --visibility private --json name -q '.[].name'`).
 * The report and the list stay local; only the aggregated result is written.
 */
const fs = require('fs');
const path = require('path');

const EVIDENCE = '.github/reports/audits/2026-09-14-label-audit/evidence';

/**
 * Aggregates unapproved labels by name, public repositories only.
 * @param {{ differences: Array<{ location: string, label: string, difference: string, items: number | string }> }} report - Drift report
 * @param {Set<string>} privateRepos - Names of private repositories (without owner)
 * @returns {{ names: Array<{ name: string, repositories: number, known_items: number }>, privateOnlyCount: number, repositoriesRead: number }} Aggregate
 */
function collectUnapprovedNames(report, privateRepos) {
  const publicBy = new Map();
  const privateNames = new Set();
  const repos = new Set();
  for (const diff of report.differences) {
    if (diff.difference !== 'unapproved' || !diff.location.startsWith('lightspeedwp/')) continue;
    const repo = diff.location.slice('lightspeedwp/'.length);
    repos.add(repo);
    if (privateRepos.has(repo)) {
      privateNames.add(diff.label);
      continue;
    }
    const entry = publicBy.get(diff.label) || { repos: new Set(), items: 0 };
    entry.repos.add(repo);
    if (diff.items !== '' && diff.items != null) entry.items += Number(diff.items) || 0;
    publicBy.set(diff.label, entry);
  }
  const names = [...publicBy.entries()]
    .map(([name, e]) => ({ name, repositories: e.repos.size, known_items: e.items }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const privateOnlyCount = [...privateNames].filter((n) => !publicBy.has(n)).length;
  return { names, privateOnlyCount, repositoriesRead: repos.size };
}

module.exports = { collectUnapprovedNames, EVIDENCE };

if (require.main === module) {
  const [reportPath, privatePath] = process.argv.slice(2);
  if (!reportPath || !privatePath) {
    console.error('Usage: label-coverage.cjs <report.json> <private-repos.txt> [--write]');
    process.exit(2);
  }
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const privateRepos = new Set(
    fs
      .readFileSync(privatePath, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  );
  const { names, privateOnlyCount, repositoriesRead } = collectUnapprovedNames(
    report,
    privateRepos
  );
  const result = {
    generated_at: String(report.generated_at).slice(0, 10),
    source: 'label drift report artifact (weekly drift check); read-only',
    note: 'Label names and per-label repository and item counts are from public lightspeedwp repositories (labels not in labels.yml). repositories_with_unapproved_labels counts all qualifying repositories, including private ones. Names found only in private repositories are counted, not named. known_items sums the item counts in the report, which caps counted rows, so it is a lower bound.',
    repositories_with_unapproved_labels: repositoriesRead,
    private_only_label_count: privateOnlyCount,
    count: names.length,
    labels: names,
  };
  console.log(JSON.stringify({ names: names.length, privateOnlyCount, repositoriesRead }, null, 2));
  if (process.argv.includes('--write')) {
    const out = path.join(process.cwd(), EVIDENCE, 'github-label-coverage.json');
    fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
    console.log(`Wrote ${out}`);
  }
}
