const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  formatEntry,
  normalizeForComparison,
  isDuplicate,
  buildSectionContent,
  insertEntries,
  updateChangelog,
} = require("../../agents/includes/changelogBuilder");

describe("changelogBuilder", () => {
  describe("formatEntry", () => {
    it("formats basic entry", () => {
      const entry = { description: "Fix login bug" };
      const result = formatEntry(entry);

      expect(result).toBe("- Fix login bug");
    });

    it("includes scope in entry", () => {
      const entry = { description: "Fix login issue", scope: "auth" };
      const result = formatEntry(entry);

      expect(result).toMatch(/^- \*\*auth:\*\*/);
    });

    it("includes commit hash", () => {
      const entry = { description: "Fix bug", commit: "abc1234567890" };
      const result = formatEntry(entry);

      expect(result).toMatch(/\[abc1234\]/);
    });

    it("includes PR number", () => {
      const entry = { description: "Fix bug", pr: "123" };
      const result = formatEntry(entry);

      expect(result).toMatch(/#123/);
    });

    it("includes author", () => {
      const entry = { description: "Fix bug", author: "john" };
      const result = formatEntry(entry);

      expect(result).toMatch(/@john/);
    });

    it("formats complete entry", () => {
      const entry = {
        description: "Fix login issue",
        scope: "auth",
        commit: "abc1234567890",
        pr: "123",
        author: "john",
      };

      const result = formatEntry(entry);

      expect(result).toContain("**auth:**");
      expect(result).toContain("Fix login issue");
      expect(result).toMatch(/\[abc1234\]/);
      expect(result).toMatch(/#123/);
      expect(result).toMatch(/@john/);
    });
  });

  describe("normalizeForComparison", () => {
    it("normalizes whitespace", () => {
      const result = normalizeForComparison("Fix   multiple   spaces");
      expect(result).toBe("fix multiple spaces");
    });

    it("converts to lowercase", () => {
      const result = normalizeForComparison("Fix Login Bug");
      expect(result).toBe("fix login bug");
    });

    it("trims whitespace", () => {
      const result = normalizeForComparison("  Fix bug  ");
      expect(result).toBe("fix bug");
    });
  });

  describe("isDuplicate", () => {
    it("detects exact duplicates", () => {
      const existing = ["Fix login bug", "Add new feature"];
      const result = isDuplicate("Fix login bug", existing);

      expect(result).toBe(true);
    });

    it("detects duplicates with different whitespace", () => {
      const existing = ["Fix   login   bug"];
      const result = isDuplicate("Fix login bug", existing);

      expect(result).toBe(true);
    });

    it("detects duplicates with different case", () => {
      const existing = ["fix login bug"];
      const result = isDuplicate("Fix Login Bug", existing);

      expect(result).toBe(true);
    });

    it("returns false for non-duplicates", () => {
      const existing = ["Fix login bug"];
      const result = isDuplicate("Add new feature", existing);

      expect(result).toBe(false);
    });
  });

  describe("buildSectionContent", () => {
    it("formats multiple entries", () => {
      const entries = [
        { description: "Fix bug 1" },
        { description: "Fix bug 2" },
      ];

      const result = buildSectionContent(entries);

      expect(result).toContain("- Fix bug 1");
      expect(result).toContain("- Fix bug 2");
    });

    it("deduplicates entries", () => {
      const entries = [
        { description: "Fix bug" },
        { description: "Fix bug" },
        { description: "Fix bug 2" },
      ];

      const result = buildSectionContent(entries);

      expect((result.match(/- Fix bug\n/g) || []).length).toBe(1);
      expect(result).toContain("- Fix bug 2");
    });
  });

  describe("insertEntries", () => {
    let tempDir;
    let changelogPath;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "changelog-test-"));
      changelogPath = path.join(tempDir, "CHANGELOG.md");

      // Create basic changelog
      const content = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-01-01

### Added
- Initial release
`;
      fs.writeFileSync(changelogPath, content, "utf8");
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true });
    });

    it("adds entries to Unreleased section", () => {
      const entries = {
        added: [{ description: "New feature" }],
      };

      const result = insertEntries(changelogPath, entries);

      expect(result).toContain("## [Unreleased]");
      expect(result).toContain("### Added");
      expect(result).toContain("- New feature");
    });

    it("creates Unreleased section if missing", () => {
      const content = `# Changelog

## [1.0.0] - 2024-01-01

### Added
- Initial release
`;
      fs.writeFileSync(changelogPath, content, "utf8");

      const entries = {
        added: [{ description: "New feature" }],
      };

      const result = insertEntries(changelogPath, entries);

      expect(result).toContain("## [Unreleased]");
    });

    it("handles multiple sections", () => {
      const entries = {
        added: [{ description: "New feature" }],
        fixed: [{ description: "Bug fix" }],
        changed: [{ description: "Breaking change" }],
      };

      const result = insertEntries(changelogPath, entries);

      expect(result).toContain("### Added");
      expect(result).toContain("### Fixed");
      expect(result).toContain("### Changed");
    });
  });

  describe("updateChangelog", () => {
    let tempDir;
    let changelogPath;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "changelog-test-"));
      changelogPath = path.join(tempDir, "CHANGELOG.md");

      const content = `# Changelog

## [Unreleased]

## [1.0.0] - 2024-01-01

### Added
- Initial release
`;
      fs.writeFileSync(changelogPath, content, "utf8");
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true });
    });

    it("updates changelog file", () => {
      const entries = {
        added: [{ description: "New feature" }],
      };

      updateChangelog(changelogPath, entries);

      const content = fs.readFileSync(changelogPath, "utf8");
      expect(content).toContain("- New feature");
    });
  });
});
