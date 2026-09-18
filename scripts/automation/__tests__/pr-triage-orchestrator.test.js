/**
 * PR Triage Orchestrator Tests
 * Tests import production helper functions instead of duplicating them
 */

import {
  parseConfig,
  extractIssuesFromBody,
  determineTriage,
  buildMetadata,
  generateSummary,
} from "../includes/pr-triage-helpers.js";

describe("pr-triage-orchestrator", () => {
  describe("parseConfig", () => {
    it("parses --dry-run flag", () => {
      const config = parseConfig(["--dry-run"]);
      expect(config.dryRun).toBe(true);
    });

    it("parses --verbose flag", () => {
      const config = parseConfig(["--verbose"]);
      expect(config.verbose).toBe(true);
    });

    it("parses --format argument", () => {
      const config = parseConfig(["--format", "csv"]);
      expect(config.format).toBe("csv");
    });

    it("parses --output argument", () => {
      const config = parseConfig(["--output", "/custom/path"]);
      expect(config.output).toBe("/custom/path");
    });

    it("handles missing argument values", () => {
      const config = parseConfig(["--format"]); // no value after --format
      expect(config.format).toBe("json"); // defaults to json
    });

    it("handles multiple flags", () => {
      const config = parseConfig([
        "--dry-run",
        "--verbose",
        "--format",
        "json",
      ]);
      expect(config.dryRun).toBe(true);
      expect(config.verbose).toBe(true);
      expect(config.format).toBe("json");
    });

    it("returns default config for empty args", () => {
      const config = parseConfig([]);
      expect(config).toEqual({
        dryRun: false,
        verbose: false,
        format: "json",
        output: ".github/reports",
      });
    });
  });

  describe("extractIssuesFromBody", () => {
    it("extracts issue from Fixes keyword", () => {
      const issues = extractIssuesFromBody("Fixes #123");
      expect(issues).toContain(123);
    });

    it("extracts issue from Closes keyword", () => {
      const issues = extractIssuesFromBody("Closes #456");
      expect(issues).toContain(456);
    });

    it("extracts issue from Resolves keyword", () => {
      const issues = extractIssuesFromBody("Resolves #789");
      expect(issues).toContain(789);
    });

    it("extracts multiple issues", () => {
      const issues = extractIssuesFromBody(
        "Fixes #123 and Closes #456 and Relates to #789",
      );
      expect(issues).toEqual(expect.arrayContaining([123, 456, 789]));
    });

    it("deduplicates issue numbers", () => {
      const issues = extractIssuesFromBody("Fixes #123, Closes #123");
      expect(issues.length).toBe(1);
      expect(issues[0]).toBe(123);
    });

    it("returns empty array for no issues", () => {
      const issues = extractIssuesFromBody("No issues here");
      expect(issues).toEqual([]);
    });

    it("handles HTML comments in body", () => {
      const issues = extractIssuesFromBody("<!-- #999 -->\nFixes #123");
      expect(issues).toContain(123);
      expect(issues).not.toContain(999); // HTML comments should be stripped
    });

    it("extracts issues with line breaks", () => {
      const body = "Title\n\nFixes #123\n\nMore content\nCloses #456";
      const issues = extractIssuesFromBody(body);
      expect(issues).toEqual(expect.arrayContaining([123, 456]));
    });
  });

  describe("determineTriage", () => {
    it("detects needs-review status", () => {
      const labels = [{ name: "status:needs-review" }];
      const triage = determineTriage(labels);
      expect(triage.needsReview).toBe(true);
    });

    it("detects needs-changelog status", () => {
      const labels = [{ name: "meta:needs-changelog" }];
      const triage = determineTriage(labels);
      expect(triage.needsChangelog).toBe(true);
    });

    it("detects bot PRs", () => {
      const labels = [{ name: "type:bot" }];
      const triage = determineTriage(labels);
      expect(triage.isBot).toBe(true);
    });

    it("handles multiple labels", () => {
      const labels = [
        { name: "status:needs-review" },
        { name: "meta:needs-changelog" },
      ];
      const triage = determineTriage(labels);
      expect(triage.needsReview).toBe(true);
      expect(triage.needsChangelog).toBe(true);
    });

    it("returns all false for empty labels", () => {
      const triage = determineTriage([]);
      expect(triage.needsReview).toBe(false);
      expect(triage.needsChangelog).toBe(false);
      expect(triage.isBot).toBe(false);
    });
  });

  describe("buildMetadata", () => {
    const mockPR = {
      number: 123,
      title: "Fix widget rendering",
      user: { login: "alice" },
      body: "Fixes #456",
    };

    it("extracts basic PR info", () => {
      const metadata = buildMetadata(mockPR, {
        needsReview: false,
        needsChangelog: false,
        isBot: false,
      });
      expect(metadata.prNumber).toBe(123);
      expect(metadata.title).toBe("Fix widget rendering");
      expect(metadata.author).toBe("alice");
    });

    it("includes triage status", () => {
      const metadata = buildMetadata(mockPR, {
        needsReview: true,
        needsChangelog: false,
        isBot: false,
      });
      expect(metadata.needsReview).toBe(true);
      expect(metadata.needsChangelog).toBe(false);
    });

    it("extracts linked issues from body", () => {
      const metadata = buildMetadata(mockPR, {
        needsReview: false,
        needsChangelog: false,
        isBot: false,
      });
      expect(metadata.linkedIssues).toContain(456);
    });

    it("suggests milestone based on triage", () => {
      const metadata = buildMetadata(mockPR, {
        needsReview: true,
        needsChangelog: false,
        isBot: false,
      });
      expect(metadata.suggestedMilestone).toBe("In Review");
    });

    it("handles PR without linked issues", () => {
      const pr = { ...mockPR, body: "No issues here" };
      const metadata = buildMetadata(pr, {
        needsReview: false,
        needsChangelog: false,
        isBot: false,
      });
      expect(metadata.linkedIssues).toEqual([]);
    });

    it("handles PR without user", () => {
      const pr = { ...mockPR, user: null };
      const metadata = buildMetadata(pr, {
        needsReview: false,
        needsChangelog: false,
        isBot: false,
      });
      expect(metadata.author).toBeUndefined();
    });
  });

  describe("generateSummary", () => {
    it("counts total PRs", () => {
      const prs = [{}, {}, {}];
      const metadata = [
        { linkedIssues: [] },
        { linkedIssues: [] },
        { linkedIssues: [] },
      ];
      const summary = generateSummary(prs, metadata);
      expect(summary.totalPRs).toBe(3);
    });

    it("counts reviewed PRs", () => {
      const prs = [{}, {}, {}];
      const metadata = [
        { needsReview: true, linkedIssues: [] },
        { needsReview: false, linkedIssues: [] },
        { needsReview: false, linkedIssues: [] },
      ];
      const summary = generateSummary(prs, metadata);
      expect(summary.reviewed).toBe(2);
    });

    it("counts PRs needing review", () => {
      const prs = [{}, {}, {}];
      const metadata = [
        { needsReview: true, linkedIssues: [] },
        { needsReview: true, linkedIssues: [] },
        { needsReview: false, linkedIssues: [] },
      ];
      const summary = generateSummary(prs, metadata);
      expect(summary.needsReview).toBe(2);
    });

    it("counts changelog needs", () => {
      const prs = [{}, {}, {}];
      const metadata = [
        { needsChangelog: true, linkedIssues: [] },
        { needsChangelog: false, linkedIssues: [] },
        { needsChangelog: true, linkedIssues: [] },
      ];
      const summary = generateSummary(prs, metadata);
      expect(summary.changelogs).toBe(2);
    });

    it("sums linked issues across PRs", () => {
      const prs = [{}, {}, {}];
      const metadata = [
        { linkedIssues: [1, 2] },
        { linkedIssues: [3] },
        { linkedIssues: [] },
      ];
      const summary = generateSummary(prs, metadata);
      expect(summary.linkedIssues).toBe(3);
    });

    it("handles empty PR list", () => {
      const summary = generateSummary([], []);
      expect(summary.totalPRs).toBe(0);
      expect(summary.reviewed).toBe(0);
      expect(summary.needsReview).toBe(0);
    });
  });

  describe("integration: PR triage workflow", () => {
    it("processes single PR through full workflow", () => {
      const pr = {
        number: 101,
        title: "Feature: New button",
        user: { login: "bob" },
        body: "Fixes #202",
      };
      const labels = [{ name: "status:needs-review" }];
      const triage = determineTriage(labels);
      const metadata = buildMetadata(pr, triage);

      expect(metadata.prNumber).toBe(101);
      expect(metadata.needsReview).toBe(true);
      expect(metadata.linkedIssues).toContain(202);
    });

    it("processes multiple PRs and generates summary", () => {
      const prs = [
        {
          number: 101,
          title: "Feature A",
          user: { login: "alice" },
          body: "Fixes #201",
        },
        {
          number: 102,
          title: "Feature B",
          user: { login: "bob" },
          body: "Fixes #202",
        },
      ];

      const metadata = prs.map((pr) =>
        buildMetadata(pr, {
          needsReview: pr.number === 101,
          needsChangelog: false,
          isBot: false,
        }),
      );

      const summary = generateSummary(prs, metadata);
      expect(summary.totalPRs).toBe(2);
      expect(summary.needsReview).toBe(1);
      expect(summary.linkedIssues).toBe(2);
    });
  });

  describe("edge cases", () => {
    it("handles PR with empty body", () => {
      const pr = {
        number: 123,
        title: "Fix",
        user: { login: "alice" },
        body: "",
      };
      const metadata = buildMetadata(pr, {
        needsReview: false,
        needsChangelog: false,
        isBot: false,
      });
      expect(metadata.linkedIssues).toEqual([]);
    });

    it("handles PR with null body", () => {
      const pr = {
        number: 123,
        title: "Fix",
        user: { login: "alice" },
        body: null,
      };
      const metadata = buildMetadata(pr, {
        needsReview: false,
        needsChangelog: false,
        isBot: false,
      });
      expect(metadata.linkedIssues).toEqual([]);
    });

    it("handles PR with no user", () => {
      const pr = {
        number: 123,
        title: "Fix",
        user: null,
        body: "Fixes #456",
      };
      const metadata = buildMetadata(pr, {
        needsReview: false,
        needsChangelog: false,
        isBot: false,
      });
      expect(metadata.author).toBeUndefined();
      expect(metadata.prNumber).toBe(123);
    });

    it("ignores invalid issue numbers", () => {
      const issues = extractIssuesFromBody("Fixes #abc and Closes #123");
      expect(issues).toEqual([123]);
    });

    it("handles very large issue numbers", () => {
      const issues = extractIssuesFromBody("Fixes #999999999");
      expect(issues).toContain(999999999);
    });
  });
});
