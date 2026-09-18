/**
 * GitHub Integration Tests
 * Test GitHub API interactions with mocking and error handling
 */

const githubClient = require("../../includes/githubClient.cjs");
const referenceLinker = require("../../includes/referenceLinker.cjs");
const releaseNotesGenerator = require("../../includes/releaseNotesGenerator.cjs");

describe("GitHub Integration Workflow", () => {
  beforeEach(() => {
    // Clear cache before each test
    githubClient.clearCache();
  });

  describe("PR Reference Validation", () => {
    test("should validate PR references", async () => {
      const result = await githubClient.validatePRReference(
        "lightspeedwp",
        "ls-flow",
        123,
      );

      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("exists");
      expect(result).toHaveProperty("url");
    });

    test("should return valid PR URL format", async () => {
      const result = await githubClient.validatePRReference(
        "lightspeedwp",
        ".github",
        456,
      );

      expect(result.url).toMatch(/^https:\/\/github\.com\//);
      expect(result.url).toContain("456");
    });

    test("should cache PR validation results", async () => {
      // First call - uncached
      const result1 = await githubClient.validatePRReference(
        "lightspeedwp",
        "ls-flow",
        789,
      );
      expect(result1.cached).toBe(false);

      // Second call - should be cached
      const result2 = await githubClient.validatePRReference(
        "lightspeedwp",
        "ls-flow",
        789,
      );
      expect(result2.cached).toBe(true);
      expect(result2.exists).toBe(result1.exists);
    });

    test("should handle invalid PR numbers gracefully", async () => {
      const result = await githubClient.validatePRReference(
        "lightspeedwp",
        "ls-flow",
        null,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("Issue Reference Validation", () => {
    test("should validate issue references", async () => {
      const result = await githubClient.validateIssueReference(
        "lightspeedwp",
        "ls-flow",
        101,
      );

      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("exists");
      expect(result).toHaveProperty("url");
    });

    test("should return valid issue URL format", async () => {
      const result = await githubClient.validateIssueReference(
        "lightspeedwp",
        ".github",
        202,
      );

      expect(result.url).toMatch(/^https:\/\/github\.com\//);
      expect(result.url).toContain("/issues/");
      expect(result.url).toContain("202");
    });

    test("should cache issue validation results", async () => {
      const result1 = await githubClient.validateIssueReference(
        "lightspeedwp",
        "ls-flow",
        303,
      );
      expect(result1.cached).toBe(false);

      const result2 = await githubClient.validateIssueReference(
        "lightspeedwp",
        "ls-flow",
        303,
      );
      expect(result2.cached).toBe(true);
    });
  });

  describe("Cache Management", () => {
    test("should track cache statistics", async () => {
      const stats1 = githubClient.getCacheStats();
      expect(stats1.total_entries).toBe(0);

      // Add some cached entries
      await githubClient.validatePRReference("lightspeedwp", "ls-flow", 123);
      await githubClient.validateIssueReference("lightspeedwp", "ls-flow", 456);

      const stats2 = githubClient.getCacheStats();
      expect(stats2.total_entries).toBe(2);
      expect(stats2.valid_entries).toBe(2);
    });

    test("should clear cache", async () => {
      await githubClient.validatePRReference("lightspeedwp", "ls-flow", 999);
      const statsBefore = githubClient.getCacheStats();
      expect(statsBefore.total_entries).toBeGreaterThan(0);

      githubClient.clearCache();
      const statsAfter = githubClient.getCacheStats();
      expect(statsAfter.total_entries).toBe(0);
    });
  });

  describe("Reference Extraction and Linking", () => {
    test("should extract PR references from text", () => {
      const text1 = "Fixed issue #123 via PR #456";
      const prs = referenceLinker.extractPRReferences(text1);
      expect(prs).toContain(456);

      const text2 = "See pull request #789 for details";
      const prs2 = referenceLinker.extractPRReferences(text2);
      expect(prs2).toContain(789);
    });

    test("should extract issue references from text", () => {
      const text = "Resolves #123 and #456";
      const issues = referenceLinker.extractIssueReferences(text);
      expect(issues).toContain(123);
      expect(issues).toContain(456);
    });

    test("should build correct GitHub URLs", () => {
      const prUrl = referenceLinker.buildPRUrl("lightspeedwp", "ls-flow", 123);
      expect(prUrl).toBe("https://github.com/lightspeedwp/ls-flow/pull/123");

      const issueUrl = referenceLinker.buildIssueUrl(
        "lightspeedwp",
        "ls-flow",
        456,
      );
      expect(issueUrl).toBe(
        "https://github.com/lightspeedwp/ls-flow/issues/456",
      );
    });

    test("should enrich entries with links", () => {
      const entry = {
        text: "Fixed bug #123 via PR #456",
        category: "Fixed",
      };

      const validationResults = [
        {
          type: "issue",
          number: 123,
          valid: true,
          url: "https://github.com/lightspeedwp/ls-flow/issues/123",
        },
        {
          type: "pr",
          number: 456,
          valid: true,
          url: "https://github.com/lightspeedwp/ls-flow/pull/456",
        },
      ];

      const enriched = referenceLinker.enrichEntryWithLinks(
        entry,
        validationResults,
      );

      expect(enriched.pr_links).toHaveLength(1);
      expect(enriched.issue_links).toHaveLength(1);
      expect(enriched.linked_text).toContain("[#123]");
      expect(enriched.linked_text).toContain("[#456]");
    });
  });

  describe("Release Notes Generation", () => {
    test("should generate Markdown release notes", () => {
      const entries = [
        {
          text: "New dashboard feature",
          category: "Added",
          pr_links: [
            {
              number: 123,
              url: "https://github.com/lightspeedwp/ls-flow/pull/123",
              valid: true,
            },
          ],
        },
        {
          text: "Fixed authentication bug",
          category: "Fixed",
          issue_links: [
            {
              number: 456,
              url: "https://github.com/lightspeedwp/ls-flow/issues/456",
              valid: true,
            },
          ],
        },
      ];

      const markdown = releaseNotesGenerator.generateMarkdownReleaseNotes(
        "1.0.0",
        "2026-09-12",
        entries,
      );

      expect(markdown).toContain("# Release Notes");
      expect(markdown).toContain("1.0.0");
      expect(markdown).toContain("## Added");
      expect(markdown).toContain("## Fixed");
      expect(markdown).toContain("New dashboard");
      expect(markdown).toContain("Fixed authentication");
    });

    test("should generate HTML release notes", () => {
      const entries = [
        {
          text: "Feature update",
          category: "Added",
        },
      ];

      const html = releaseNotesGenerator.generateHTMLReleaseNotes(
        "2.0.0",
        "2026-09-13",
        entries,
      );

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("2.0.0");
      expect(html).toContain("Feature update");
    });

    test("should generate plain text release notes", () => {
      const entries = [
        {
          text: "New feature",
          category: "Added",
        },
      ];

      const plainText = releaseNotesGenerator.generatePlainTextReleaseNotes(
        "1.5.0",
        "2026-09-14",
        entries,
      );

      expect(plainText).toContain("RELEASE 1.5.0");
      expect(plainText).toContain("New feature");
    });

    test("should group entries by category correctly", () => {
      const entries = [
        { text: "Feature A", category: "feature" },
        { text: "Feature B", category: "Feature" },
        { text: "Bug fix", category: "fix" },
        { text: "Security patch", category: "security" },
      ];

      const grouped = releaseNotesGenerator.groupByCategory(entries);

      expect(grouped.Features).toHaveLength(2);
      expect(grouped.Fixed).toHaveLength(1);
      expect(grouped.Security).toHaveLength(1);
    });

    test("should normalize category names", () => {
      expect(releaseNotesGenerator.normalizeCategory("feature")).toBe(
        "Features",
      );
      expect(releaseNotesGenerator.normalizeCategory("breaking-change")).toBe(
        "Breaking Changes",
      );
      expect(releaseNotesGenerator.normalizeCategory("FIXED")).toBe("Fixed");
      expect(releaseNotesGenerator.normalizeCategory("improvement")).toBe(
        "Improvements",
      );
    });
  });

  describe("Error Handling", () => {
    test("should handle graceful degradation when API unavailable", async () => {
      // This test verifies the fallback behavior
      const result = await githubClient.validatePRReference(
        "nonexistent",
        "repo",
        123,
      );

      // Even if API fails, should still return some result
      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("url");
    });

    test("should handle missing text in entries", () => {
      const entry = { category: "Added" };
      const validationResults = [];

      const enriched = referenceLinker.enrichEntryWithLinks(
        entry,
        validationResults,
      );

      expect(enriched).toBeDefined();
      expect(enriched.linked_text).toBeDefined();
    });
  });
});
