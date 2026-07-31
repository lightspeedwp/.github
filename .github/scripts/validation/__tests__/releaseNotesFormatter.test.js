const {
  formatSectionTitle,
  formatEntry,
  buildReleaseNotes,
  formatVersionHeader,
  generateReleaseNotes,
  extractSummary,
  generateSummaryText,
} = require("../../agents/includes/releaseNotesFormatter");

describe("releaseNotesFormatter", () => {
  describe("formatSectionTitle", () => {
    test("should capitalize section title", () => {
      expect(formatSectionTitle("added")).toBe("Added");
      expect(formatSectionTitle("fixed")).toBe("Fixed");
      expect(formatSectionTitle("removed")).toBe("Removed");
    });

    test("should return null for invalid input", () => {
      expect(formatSectionTitle(null)).toBeNull();
      expect(formatSectionTitle("")).toBeNull();
    });
  });

  describe("formatEntry", () => {
    test("should format basic entry", () => {
      const entry = { description: "Fixed bug in parser" };
      expect(formatEntry(entry)).toBe("- Fixed bug in parser");
    });

    test("should format entry with scope", () => {
      const entry = { description: "Fixed parsing logic", scope: "parser" };
      expect(formatEntry(entry)).toBe("- **parser:** Fixed parsing logic");
    });

    test("should format entry with commit hash", () => {
      const entry = {
        description: "Fixed bug",
        commit: "abc123def456789",
      };

      expect(formatEntry(entry)).toContain("Fixed bug");
      expect(formatEntry(entry)).toContain("[abc123d]");
      expect(formatEntry(entry)).toContain("github.com");
    });

    test("should format entry with PR number", () => {
      const entry = { description: "Fixed bug", pr: "123" };
      expect(formatEntry(entry)).toBe("- Fixed bug (#123)");
    });

    test("should format entry with author", () => {
      const entry = { description: "Fixed bug", author: "john" };
      expect(formatEntry(entry)).toBe("- Fixed bug @john");
    });

    test("should format entry with all fields", () => {
      const entry = {
        description: "Improved performance",
        scope: "core",
        commit: "abc123def456789",
        pr: "456",
        author: "jane",
      };

      const result = formatEntry(entry);
      expect(result).toContain("**core:** Improved performance");
      expect(result).toContain("[abc123d]");
      expect(result).toContain("(#456)");
      expect(result).toContain("@jane");
    });

    test("should return null for invalid entry", () => {
      expect(formatEntry(null)).toBeNull();
      expect(formatEntry({})).toBeNull();
      expect(formatEntry({ scope: "test" })).toBeNull();
    });
  });

  describe("buildReleaseNotes", () => {
    test("should build release notes with sections", () => {
      const entries = {
        added: [{ description: "New feature" }],
        fixed: [{ description: "Bug fix" }],
      };

      const result = buildReleaseNotes(entries);

      expect(result).toContain("### Added");
      expect(result).toContain("New feature");
      expect(result).toContain("### Fixed");
      expect(result).toContain("Bug fix");
    });

    test("should respect section order", () => {
      const entries = {
        added: [{ description: "Feature" }],
        fixed: [{ description: "Fix" }],
        security: [{ description: "Security fix" }],
      };

      const options = { sectionOrder: ["security", "added", "fixed"] };
      const result = buildReleaseNotes(entries, options);

      const securityIndex = result.indexOf("### Security");
      const addedIndex = result.indexOf("### Added");
      const fixedIndex = result.indexOf("### Fixed");

      expect(securityIndex).toBeLessThan(addedIndex);
      expect(addedIndex).toBeLessThan(fixedIndex);
    });

    test("should skip empty sections when includeEmpty is false", () => {
      const entries = {
        added: [{ description: "Feature" }],
        fixed: [],
      };

      const result = buildReleaseNotes(entries, { includeEmpty: false });

      expect(result).toContain("### Added");
      expect(result).not.toContain("### Fixed");
    });

    test("should return empty string for invalid input", () => {
      expect(buildReleaseNotes(null)).toBe("");
      expect(buildReleaseNotes({})).toBe("");
    });

    test("should handle entries that are not arrays gracefully", () => {
      const entries = {
        added: "not an array",
      };

      const result = buildReleaseNotes(entries);
      expect(result).toBe("");
    });
  });

  describe("formatVersionHeader", () => {
    test("should format version header without date", () => {
      expect(formatVersionHeader("1.2.3")).toBe("## [1.2.3]");
    });

    test("should format version header with date", () => {
      expect(formatVersionHeader("1.2.3", "2024-01-15")).toBe(
        "## [1.2.3] - 2024-01-15",
      );
    });

    test("should return null for invalid version", () => {
      expect(formatVersionHeader(null)).toBeNull();
      expect(formatVersionHeader("")).toBeNull();
    });
  });

  describe("generateReleaseNotes", () => {
    test("should generate complete release notes", () => {
      const entries = {
        added: [{ description: "New feature" }],
        fixed: [{ description: "Bug fix" }],
      };

      const result = generateReleaseNotes("1.2.3", entries);

      expect(result).toContain("## [1.2.3]");
      expect(result).toContain("### Added");
      expect(result).toContain("New feature");
      expect(result).toContain("### Fixed");
      expect(result).toContain("Bug fix");
    });

    test("should include date when provided", () => {
      const entries = { added: [{ description: "Feature" }] };
      const result = generateReleaseNotes("1.0.0", entries, {
        date: "2024-01-15",
      });

      expect(result).toContain("## [1.0.0] - 2024-01-15");
    });

    test("should return null for invalid version", () => {
      const entries = { added: [{ description: "Feature" }] };
      expect(generateReleaseNotes(null, entries)).toBeNull();
      expect(generateReleaseNotes("", entries)).toBeNull();
    });

    test("should return null for invalid entries", () => {
      expect(generateReleaseNotes("1.0.0", null)).toBeNull();
      expect(generateReleaseNotes("1.0.0", undefined)).toBeNull();
    });
  });

  describe("extractSummary", () => {
    test("should extract summary counts", () => {
      const entries = {
        added: [{ description: "Feature 1" }, { description: "Feature 2" }],
        fixed: [{ description: "Fix 1" }],
        security: [
          { description: "Security 1" },
          { description: "Security 2" },
          { description: "Security 3" },
        ],
      };

      const summary = extractSummary(entries);

      expect(summary.added).toBe(2);
      expect(summary.fixed).toBe(1);
      expect(summary.security).toBe(3);
    });

    test("should return empty object for invalid input", () => {
      expect(extractSummary(null)).toEqual({});
      expect(extractSummary({})).toEqual({});
    });
  });

  describe("generateSummaryText", () => {
    test("should generate summary text", () => {
      const entries = {
        added: [{ description: "Feature" }],
        fixed: [{ description: "Fix 1" }, { description: "Fix 2" }],
      };

      const summary = generateSummaryText(entries);

      expect(summary).toContain("1 feature added");
      expect(summary).toContain("2 bugs fixed");
    });

    test("should handle singular items", () => {
      const entries = {
        added: [{ description: "Feature" }],
        fixed: [{ description: "Fix" }],
      };

      const summary = generateSummaryText(entries);

      expect(summary).toContain("1 feature added");
      expect(summary).toContain("1 bug fixed");
    });

    test("should return 'No changes' for empty entries", () => {
      expect(generateSummaryText({})).toBe("No changes");
      expect(generateSummaryText(null)).toBe("");
    });

    test("should handle all section types", () => {
      const entries = {
        added: [{ description: "Feature" }],
        fixed: [{ description: "Fix" }],
        deprecated: [{ description: "Deprecated item" }],
        removed: [{ description: "Removed item" }],
        security: [{ description: "Security fix" }],
        changed: [{ description: "Change" }],
        documentation: [{ description: "Doc update" }],
        performance: [{ description: "Performance improvement" }],
      };

      const summary = generateSummaryText(entries);

      expect(summary).toContain("feature");
      expect(summary).toContain("bug");
      expect(summary).toContain("deprecated");
      expect(summary).toContain("removed");
      expect(summary).toContain("security");
      expect(summary).toContain("change");
      expect(summary).toContain("documentation");
      expect(summary).toContain("performance");
    });
  });
});
