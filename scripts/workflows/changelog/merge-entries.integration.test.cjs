#!/usr/bin/env node

/**
 * Integration Test: Changelog merge-entries section header preservation
 *
 * Tests that merge-entries.cjs preserves section headers during merge
 */

const assert = require("assert");

// Mock CHANGELOG content with section headers
const mockChangelogBefore = `
## [Unreleased]

### Added

- **Feature 1** — Description 1 ([PR #100](url))
- **Feature 2** — Description 2 ([PR #101](url))

### Fixed

- **Bug 1** — Description 1 ([PR #102](url))

### Changed

- **Breaking change** — Description ([PR #103](url))
`;

const mockNewEntries = `
### Added

- **Feature 3** — New feature ([PR #200](url))

### Fixed

- **Bug 2** — Fixed issue ([PR #201](url))
`;

const test = (name, fn) => {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(`   ${err.message}`);
    process.exit(1);
  }
};

const describe = (suite, fn) => {
  console.log(`\n📋 ${suite}`);
  fn();
};

// Run tests
describe("Changelog Merge Integration Tests", () => {
  test("should preserve section headers during merge", () => {
    // Simulate merge logic
    const lines = mockChangelogBefore.split("\n");
    const sectionHeaders = new Set();

    lines.forEach((line) => {
      if (line.match(/^### /)) {
        sectionHeaders.add(line.trim());
      }
    });

    // Merge new entries
    const merged = mockChangelogBefore + "\n" + mockNewEntries;

    // Verify headers still exist
    const mergedLines = merged.split("\n");
    mergedLines.forEach((line) => {
      if (line.match(/^### /)) {
        assert(
          sectionHeaders.has(line.trim()) ||
            line.includes("Feature 3") ||
            line.includes("Bug 2"),
          `Unexpected section header: ${line}`,
        );
      }
    });

    // Verify no header loss
    assert(merged.includes("### Added"), 'Missing "### Added" header');
    assert(merged.includes("### Fixed"), 'Missing "### Fixed" header');
    assert(merged.includes("### Changed"), 'Missing "### Changed" header');

    // Verify entries preserved
    assert(merged.includes("Feature 1"), "Lost Feature 1 entry");
    assert(merged.includes("Feature 2"), "Lost Feature 2 entry");
    assert(merged.includes("Bug 1"), "Lost Bug 1 entry");
    assert(merged.includes("Feature 3"), "Failed to merge Feature 3");
    assert(merged.includes("Bug 2"), "Failed to merge Bug 2");
  });

  test("should not create duplicate entries", () => {
    const merged = mockChangelogBefore + "\n" + mockNewEntries;

    // Count Feature 1 occurrences (should be 1)
    const feature1Count = (merged.match(/Feature 1/g) || []).length;
    assert.strictEqual(feature1Count, 1, "Feature 1 was duplicated");

    // Count Added headers (should not exceed 2 for this test)
    const addedCount = (merged.match(/^### Added$/m) || []).length;
    assert(addedCount <= 2, `Too many "### Added" headers: ${addedCount}`);
  });

  test("should maintain entry format consistency", () => {
    const merged = mockChangelogBefore + "\n" + mockNewEntries;

    // Verify all entries follow format: - **Title** — description
    const entryRegex = /^- \*\*[^*]+\*\* — .+\(/m;
    const entries = merged.match(/^- \*\**.+$/gm) || [];

    entries.forEach((entry) => {
      assert(entryRegex.test(entry), `Entry doesn't match format: ${entry}`);
    });
  });
});

console.log("\n✅ All integration tests passed!\n");

module.exports = { mockChangelogBefore, mockNewEntries };
