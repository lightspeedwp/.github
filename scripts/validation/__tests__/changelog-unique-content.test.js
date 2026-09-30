const path = require('node:path');

const ComplianceChecker = require(
  path.resolve(__dirname, '../../../.github/validation/changelog/lib/compliance-checker.js')
).default;

function entry(id, content) {
  return { id, content };
}

describe('CHK_UNIQUE_CONTENT (#3574)', () => {
  let checker;

  beforeEach(() => {
    checker = new ComplianceChecker();
  });

  // This rule is the safety net for CHANGELOG.md being union-merged: if two
  // pull requests contribute the same entry, git keeps both and something has
  // to report it. It did not, because findSimilarEntries skipped every entry
  // whose content equalled the one being checked, which is also what an exact
  // duplicate looks like.
  it('reports an entry that duplicates another entry exactly', async () => {
    const content = 'Fixed the metrics duration assertion so it stops flaking under load. (#3572)';
    const entries = [entry('unreleased-0', content), entry('unreleased-1', content)];

    const result = await checker.checkUniqueContent(entries[1], { allEntries: entries });

    expect(result.passed).toBe(false);
    expect(result.details.count).toBe(1);
    expect(result.details.similarEntries[0].content).toBe(content);
  });

  it('reports near-identical entries above the similarity threshold', async () => {
    const entries = [
      entry('unreleased-0', 'Fixed the metrics duration assertion so it stops flaking. (#3572)'),
      entry('unreleased-1', 'Fixed the metrics duration assertion so it stops flaking! (#3572)'),
    ];

    const result = await checker.checkUniqueContent(entries[1], { allEntries: entries });

    expect(result.passed).toBe(false);
  });

  it('does not report an entry as similar to itself', async () => {
    const entries = [
      entry('unreleased-0', 'Added a workflow reachability guard. (#3570)'),
      entry('unreleased-1', 'Documented the composite action contracts. (#3570)'),
    ];

    for (const candidate of entries) {
      const result = await checker.checkUniqueContent(candidate, { allEntries: entries });

      expect(result.passed).toBe(true);
    }
  });

  it('passes when there is nothing to compare against', async () => {
    const result = await checker.checkUniqueContent(entry('unreleased-0', 'Anything.'), {
      allEntries: [],
    });

    expect(result.passed).toBe(true);
  });

  it('treats three copies as two reported duplicates for the entry under test', async () => {
    const content = 'Stabilised two timing assertions. (#3572)';
    const entries = [
      entry('unreleased-0', content),
      entry('unreleased-1', content),
      entry('unreleased-2', content),
    ];

    const result = await checker.checkUniqueContent(entries[2], { allEntries: entries });

    expect(result.passed).toBe(false);
    expect(result.details.count).toBe(2);
  });
});
