const {
  syncLabelsWithCanonical,
  validateRepoLabels,
  standardizeLabelsOnRepo,
  generateSyncReport,
} = require("../label-sync.cjs");
const { findStandardLabel } = require("../label-lookup");

// Mock label-lookup module
jest.mock("../label-lookup", () => ({
  findStandardLabel: jest.fn(),
}));

describe("label-sync", () => {
  let mockOctokit;

  beforeEach(() => {
    // Create a comprehensive mock octokit instance
    mockOctokit = {
      rest: {
        issues: {
          listLabelsForRepo: jest.fn(),
          createLabel: jest.fn(),
          updateLabel: jest.fn(),
          deleteLabel: jest.fn(),
          removeLabel: jest.fn(),
          addLabels: jest.fn(),
        },
        search: {
          issuesAndPullRequests: jest.fn(),
        },
      },
    };

    // Reset mocks
    findStandardLabel.mockReset();
  });

  describe("syncLabelsWithCanonical", () => {
    test("should create missing labels", async () => {
      // Mock empty repository
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [],
      });

      const canonicalLabels = [
        { name: "bug", color: "ff0000", description: "Bug reports" },
        {
          name: "feature",
          color: "00ff00",
          description: "New features",
        },
      ];

      const result = await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.created).toEqual(["bug", "feature"]);
      expect(result.updated).toEqual([]);
      expect(result.deleted).toEqual([]);
      expect(mockOctokit.rest.issues.createLabel).toHaveBeenCalledTimes(2);
      expect(mockOctokit.rest.issues.createLabel).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        name: "bug",
        color: "ff0000",
        description: "Bug reports",
      });
    });

    test("should update existing labels with different colors/descriptions", async () => {
      // Mock repository with outdated labels
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [
          {
            name: "bug",
            color: "000000",
            description: "Old bug description",
          },
          {
            name: "feature",
            color: "00ff00",
            description: "New features",
          },
        ],
      });

      const canonicalLabels = [
        { name: "bug", color: "ff0000", description: "Bug reports" },
        {
          name: "feature",
          color: "00ff00",
          description: "New features",
        },
      ];

      const result = await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.created).toEqual([]);
      expect(result.updated).toEqual(["bug"]);
      expect(result.unchanged).toEqual(["feature"]);
      expect(mockOctokit.rest.issues.updateLabel).toHaveBeenCalledTimes(1);
      expect(mockOctokit.rest.issues.updateLabel).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        name: "bug",
        color: "ff0000",
        description: "Bug reports",
      });
    });

    test("should delete unused non-canonical labels", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [
          {
            name: "bug",
            color: "ff0000",
            description: "Bug reports",
          },
          {
            name: "old-label",
            color: "000000",
            description: "Unused label",
          },
        ],
      });

      // Mock search showing no usage of old-label
      mockOctokit.rest.search.issuesAndPullRequests.mockResolvedValue({
        data: { total_count: 0, items: [] },
      });

      const canonicalLabels = [
        { name: "bug", color: "ff0000", description: "Bug reports" },
      ];

      const result = await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
        false,
        {
          deletionMode: "approved",
          approvedDeletionSet: new Set(["old-label"]),
        },
      );

      expect(result.deleted).toEqual(["old-label"]);
      expect(mockOctokit.rest.issues.deleteLabel).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        name: "old-label",
      });
    });

    test("should not delete labels that are in use", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [
          {
            name: "bug",
            color: "ff0000",
            description: "Bug reports",
          },
          {
            name: "old-label",
            color: "000000",
            description: "Used label",
          },
        ],
      });

      // Mock search showing usage of old-label
      mockOctokit.rest.search.issuesAndPullRequests.mockResolvedValue({
        data: { total_count: 3, items: [{}, {}, {}] },
      });

      const canonicalLabels = [
        { name: "bug", color: "ff0000", description: "Bug reports" },
      ];

      const result = await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
        false,
        {
          deletionMode: "approved",
          approvedDeletionSet: new Set(["old-label"]),
        },
      );

      expect(result.deleted).toEqual([]);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].label).toBe("old-label");
      expect(result.errors[0].error).toContain(
        "Label is in use on 3 open items",
      );
      expect(mockOctokit.rest.issues.deleteLabel).not.toHaveBeenCalled();
    });

    test("should handle dry run mode", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [],
      });

      const canonicalLabels = [
        { name: "bug", color: "ff0000", description: "Bug reports" },
      ];

      const result = await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
        true, // dry run
      );

      expect(result.created).toEqual(["bug"]);
      expect(mockOctokit.rest.issues.createLabel).not.toHaveBeenCalled();
    });

    test("should handle string-only canonical labels", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [],
      });

      const canonicalLabels = ["bug", "feature"];

      const result = await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.created).toEqual(["bug", "feature"]);
      expect(mockOctokit.rest.issues.createLabel).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        name: "bug",
        color: "E1E4E8",
        description: "",
      });
    });

    test("should handle API errors gracefully", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [],
      });

      mockOctokit.rest.issues.createLabel.mockRejectedValue(
        new Error("API rate limit exceeded"),
      );

      const canonicalLabels = [
        { name: "bug", color: "ff0000", description: "Bug reports" },
      ];

      const result = await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].action).toBe("create");
      expect(result.errors[0].label).toBe("bug");
      expect(result.errors[0].error).toBe("API rate limit exceeded");
    });

    test("should handle color formatting with hash prefix", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [
          {
            name: "bug",
            color: "000000",
            description: "Bug reports",
          },
        ],
      });

      const canonicalLabels = [
        { name: "bug", color: "#ff0000", description: "Bug reports" },
      ];

      const result = await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.updated).toEqual(["bug"]);
      expect(mockOctokit.rest.issues.updateLabel).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        name: "bug",
        color: "ff0000", // hash removed
        description: "Bug reports",
      });
    });
  });

  describe("validateRepoLabels", () => {
    test("should identify missing canonical labels", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [
          {
            name: "bug",
            color: "ff0000",
            description: "Bug reports",
          },
        ],
      });

      const canonicalLabels = [
        { name: "bug", color: "ff0000", description: "Bug reports" },
        {
          name: "feature",
          color: "00ff00",
          description: "New features",
        },
      ];

      const result = await validateRepoLabels(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.valid).toBe(false);
      expect(result.missing).toEqual(["feature"]);
      expect(result.extra).toEqual([]);
      expect(result.summary.missingCount).toBe(1);
      expect(result.summary.totalCanonical).toBe(2);
      expect(result.summary.totalRepo).toBe(1);
    });

    test("should identify extra non-canonical labels", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [
          {
            name: "bug",
            color: "ff0000",
            description: "Bug reports",
          },
          {
            name: "old-label",
            color: "000000",
            description: "Deprecated",
          },
        ],
      });

      const canonicalLabels = [
        { name: "bug", color: "ff0000", description: "Bug reports" },
      ];

      const result = await validateRepoLabels(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.valid).toBe(false);
      expect(result.missing).toEqual([]);
      expect(result.extra).toEqual(["old-label"]);
      expect(result.summary.extraCount).toBe(1);
    });

    test("should identify non-compliant label properties", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [
          {
            name: "bug",
            color: "000000",
            description: "Wrong description",
          },
        ],
      });

      const canonicalLabels = [
        { name: "bug", color: "ff0000", description: "Bug reports" },
      ];

      const result = await validateRepoLabels(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.valid).toBe(false);
      expect(result.nonCompliant).toHaveLength(1);
      expect(result.nonCompliant[0].name).toBe("bug");
      expect(result.nonCompliant[0].issues).toEqual([
        "color: expected ff0000, got 000000",
        'description: expected "Bug reports", got "Wrong description"',
      ]);
      expect(result.summary.nonCompliantCount).toBe(1);
    });

    test("should handle hash-prefixed colors in validation", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [
          {
            name: "bug",
            color: "ff0000",
            description: "Bug reports",
          },
        ],
      });

      const canonicalLabels = [
        { name: "bug", color: "#ff0000", description: "Bug reports" },
      ];

      const result = await validateRepoLabels(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.valid).toBe(true);
      expect(result.nonCompliant).toEqual([]);
    });

    test("should return valid for fully compliant repository", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [
          {
            name: "bug",
            color: "ff0000",
            description: "Bug reports",
          },
          {
            name: "feature",
            color: "00ff00",
            description: "New features",
          },
        ],
      });

      const canonicalLabels = [
        { name: "bug", color: "ff0000", description: "Bug reports" },
        {
          name: "feature",
          color: "00ff00",
          description: "New features",
        },
      ];

      const result = await validateRepoLabels(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.valid).toBe(true);
      expect(result.missing).toEqual([]);
      expect(result.extra).toEqual([]);
      expect(result.nonCompliant).toEqual([]);
      expect(result.summary.missingCount).toBe(0);
      expect(result.summary.extraCount).toBe(0);
      expect(result.summary.nonCompliantCount).toBe(0);
    });

    test("should handle string-only canonical labels", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [
          {
            name: "bug",
            color: "ff0000",
            description: "Bug reports",
          },
        ],
      });

      const canonicalLabels = ["bug", "feature"];

      const result = await validateRepoLabels(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.missing).toEqual(["feature"]);
      expect(result.nonCompliant).toEqual([]); // No compliance check for string-only labels
    });

    test("should handle empty canonical labels array", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [
          {
            name: "some-label",
            color: "ff0000",
            description: "Some label",
          },
        ],
      });

      const result = await validateRepoLabels(mockOctokit, "owner", "repo", []);

      expect(result.valid).toBe(false);
      expect(result.missing).toEqual([]);
      expect(result.extra).toEqual(["some-label"]);
      expect(result.summary.totalCanonical).toBe(0);
      expect(result.summary.totalRepo).toBe(1);
    });
  });

  describe("standardizeLabelsOnRepo", () => {
    test("should migrate alias labels to canonical labels", async () => {
      // Mock search results for non-standard label
      mockOctokit.rest.search.issuesAndPullRequests.mockResolvedValue({
        data: {
          items: [
            { number: 1, pull_request: null },
            { number: 2, pull_request: {} },
          ],
        },
      });

      findStandardLabel.mockReturnValue("bug");

      const aliasMap = { "old-bug": "bug" };
      const canonicalSet = new Set(["bug", "feature"]);

      const result = await standardizeLabelsOnRepo(
        mockOctokit,
        "owner",
        "repo",
        aliasMap,
        canonicalSet,
      );

      expect(result.itemsProcessed).toBe(2);
      expect(result.labelsChanged).toBe(2);
      expect(result.migrations).toHaveLength(2);
      expect(result.migrations[0]).toEqual({
        item: "Issue #1",
        from: "old-bug",
        to: "bug",
      });
      expect(result.migrations[1]).toEqual({
        item: "PR #2",
        from: "old-bug",
        to: "bug",
      });

      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledTimes(2);
      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledTimes(2);
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        issue_number: 1,
        name: "old-bug",
      });
      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        issue_number: 1,
        labels: ["bug"],
      });
    });

    test("should handle dry run mode", async () => {
      mockOctokit.rest.search.issuesAndPullRequests.mockResolvedValue({
        data: {
          items: [{ number: 1, pull_request: null }],
        },
      });

      findStandardLabel.mockReturnValue("bug");

      const aliasMap = { "old-bug": "bug" };
      const canonicalSet = new Set(["bug"]);

      const result = await standardizeLabelsOnRepo(
        mockOctokit,
        "owner",
        "repo",
        aliasMap,
        canonicalSet,
        true, // dry run
      );

      expect(result.migrations).toHaveLength(1);
      expect(result.migrations[0]).toEqual({
        item: "Issue #1",
        from: "old-bug",
        to: "bug",
      });
      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();
      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();
    });

    test("should handle API errors gracefully", async () => {
      mockOctokit.rest.search.issuesAndPullRequests.mockResolvedValue({
        data: {
          items: [{ number: 1, pull_request: null }],
        },
      });

      findStandardLabel.mockReturnValue("bug");
      mockOctokit.rest.issues.removeLabel.mockRejectedValue(
        new Error("Label not found"),
      );

      const aliasMap = { "old-bug": "bug" };
      const canonicalSet = new Set(["bug"]);

      const result = await standardizeLabelsOnRepo(
        mockOctokit,
        "owner",
        "repo",
        aliasMap,
        canonicalSet,
      );

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        item: "Issue #1",
        from: "old-bug",
        to: "bug",
        error: "Label not found",
      });
    });

    test("should skip items when canonical label not found", async () => {
      mockOctokit.rest.search.issuesAndPullRequests.mockResolvedValue({
        data: {
          items: [{ number: 1, pull_request: null }],
        },
      });

      findStandardLabel.mockReturnValue(null); // No canonical match found

      const aliasMap = { "old-bug": "nonexistent" };
      const canonicalSet = new Set(["bug"]);

      const result = await standardizeLabelsOnRepo(
        mockOctokit,
        "owner",
        "repo",
        aliasMap,
        canonicalSet,
      );

      expect(result.migrations).toEqual([]);
      expect(result.itemsProcessed).toBe(1); // Still processed the search results
      expect(result.labelsChanged).toBe(0);
      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();
    });

    test("should handle search API errors gracefully", async () => {
      mockOctokit.rest.search.issuesAndPullRequests.mockRejectedValue(
        new Error("Search service unavailable"),
      );

      const aliasMap = { "old-bug": "bug" };
      const canonicalSet = new Set(["bug"]);

      await expect(
        standardizeLabelsOnRepo(
          mockOctokit,
          "owner",
          "repo",
          aliasMap,
          canonicalSet,
        ),
      ).rejects.toThrow(
        "Failed to standardize labels: Search service unavailable",
      );
    });

    test("should handle multiple alias labels", async () => {
      // Mock different search results for different labels
      mockOctokit.rest.search.issuesAndPullRequests
        .mockResolvedValueOnce({
          data: { items: [{ number: 1, pull_request: null }] },
        })
        .mockResolvedValueOnce({
          data: { items: [{ number: 2, pull_request: {} }] },
        });

      findStandardLabel
        .mockReturnValueOnce("bug")
        .mockReturnValueOnce("feature");

      const aliasMap = {
        "old-bug": "bug",
        enhancement: "feature",
      };
      const canonicalSet = new Set(["bug", "feature"]);

      const result = await standardizeLabelsOnRepo(
        mockOctokit,
        "owner",
        "repo",
        aliasMap,
        canonicalSet,
      );

      expect(result.itemsProcessed).toBe(2);
      expect(result.labelsChanged).toBe(2);
      expect(result.migrations).toHaveLength(2);
      expect(findStandardLabel).toHaveBeenCalledTimes(2);
      expect(findStandardLabel).toHaveBeenCalledWith(
        "old-bug",
        aliasMap,
        canonicalSet,
      );
      expect(findStandardLabel).toHaveBeenCalledWith(
        "enhancement",
        aliasMap,
        canonicalSet,
      );
    });
  });

  describe("generateSyncReport", () => {
    test("should generate comprehensive markdown report", () => {
      const syncReport = {
        created: ["new-label"],
        updated: ["updated-label"],
        deleted: ["old-label"],
        deferredDeletes: [],
        unchanged: ["existing-label"],
        errors: [
          {
            action: "create",
            label: "error-label",
            error: "API error",
          },
        ],
      };

      const validationReport = {
        valid: false,
        summary: {
          totalCanonical: 10,
          totalRepo: 8,
          missingCount: 2,
          extraCount: 1,
          nonCompliantCount: 1,
        },
      };

      const standardizationReport = {
        itemsProcessed: 5,
        labelsChanged: 3,
        migrations: [{ item: "Issue #1", from: "old-bug", to: "bug" }],
        errors: [],
      };

      const report = generateSyncReport(
        syncReport,
        validationReport,
        standardizationReport,
      );

      expect(report).toContain("# 🏷️ Label Sync Report");
      expect(report).toContain("## Repository Label Sync");
      expect(report).toContain("**Created:** 1 labels");
      expect(report).toContain("**Updated:** 1 labels");
      expect(report).toContain("**Deleted:** 1 labels");
      expect(report).toContain("**Unchanged:** 1 labels");
      expect(report).toContain("**Errors:** 1");
      expect(report).toContain("### Created Labels");
      expect(report).toContain("- `new-label`");
      expect(report).toContain("### Updated Labels");
      expect(report).toContain("- `updated-label`");
      expect(report).toContain("### Errors");
      expect(report).toContain("- **create** `error-label`: API error");
      expect(report).toContain("## Validation Results");
      expect(report).toContain("**Status:** ❌ Issues Found");
      expect(report).toContain("**Total Canonical:** 10");
      expect(report).toContain("**Total Repository:** 8");
      expect(report).toContain("**Missing:** 2");
      expect(report).toContain("**Extra:** 1");
      expect(report).toContain("**Non-compliant:** 1");
      expect(report).toContain("## Label Standardization");
      expect(report).toContain("**Items Processed:** 5");
      expect(report).toContain("**Labels Changed:** 3");
      expect(report).toContain("**Migrations:** 1");
      expect(report).toContain("### Label Migrations");
      expect(report).toContain("- Issue #1: `old-bug` → `bug`");
      expect(report).toContain("_Generated by LightSpeedWP Label Sync Agent_");
    });

    test("should handle missing reports gracefully", () => {
      const report = generateSyncReport(null, null, null);

      expect(report).toContain("# 🏷️ Label Sync Report");
      expect(report).toContain("_Generated by LightSpeedWP Label Sync Agent_");
      expect(report).not.toContain("## Repository Label Sync");
      expect(report).not.toContain("## Validation Results");
      expect(report).not.toContain("## Label Standardization");
    });

    test("should show valid status when validation passes", () => {
      const validationReport = {
        valid: true,
        summary: {
          totalCanonical: 5,
          totalRepo: 5,
          missingCount: 0,
          extraCount: 0,
          nonCompliantCount: 0,
        },
      };

      const report = generateSyncReport(null, validationReport, null);

      expect(report).toContain("**Status:** ✅ Valid");
      expect(report).toContain("**Missing:** 0");
      expect(report).toContain("**Extra:** 0");
      expect(report).toContain("**Non-compliant:** 0");
    });

    test("should handle empty arrays in reports", () => {
      const syncReport = {
        created: [],
        updated: [],
        deleted: [],
        deferredDeletes: [],
        unchanged: [],
        errors: [],
      };

      const standardizationReport = {
        itemsProcessed: 0,
        labelsChanged: 0,
        migrations: [],
        errors: [],
      };

      const report = generateSyncReport(
        syncReport,
        null,
        standardizationReport,
      );

      expect(report).toContain("**Created:** 0 labels");
      expect(report).toContain("**Updated:** 0 labels");
      expect(report).toContain("**Deleted:** 0 labels");
      expect(report).toContain("**Unchanged:** 0 labels");
      expect(report).toContain("**Errors:** 0");
      expect(report).toContain("**Items Processed:** 0");
      expect(report).toContain("**Labels Changed:** 0");
      expect(report).toContain("**Migrations:** 0");
      expect(report).not.toContain("### Created Labels");
      expect(report).not.toContain("### Updated Labels");
      expect(report).not.toContain("### Errors");
      expect(report).not.toContain("### Label Migrations");
    });
  });

  describe("error handling", () => {
    test("should throw meaningful error when GitHub API fails for sync", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockRejectedValue(
        new Error("API unavailable"),
      );

      await expect(
        syncLabelsWithCanonical(mockOctokit, "owner", "repo", []),
      ).rejects.toThrow("Failed to sync labels: API unavailable");
    });

    test("should throw meaningful error for validation failures", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockRejectedValue(
        new Error("Permission denied"),
      );

      await expect(
        validateRepoLabels(mockOctokit, "owner", "repo", []),
      ).rejects.toThrow("Failed to validate labels: Permission denied");
    });

    test("should throw meaningful error for standardization failures", async () => {
      const aliasMap = { "old-bug": "bug" };
      const canonicalSet = new Set(["bug"]);
      // Simulate failure via search API to avoid global mutation side‑effects
      mockOctokit.rest.search.issuesAndPullRequests.mockRejectedValue(
        new Error("Critical system error"),
      );
      await expect(
        standardizeLabelsOnRepo(
          mockOctokit,
          "owner",
          "repo",
          aliasMap,
          canonicalSet,
        ),
      ).rejects.toThrow("Failed to standardize labels: Critical system error");
    });

    test("should handle network timeouts gracefully", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockRejectedValue(
        new Error("Request timeout"),
      );

      await expect(
        syncLabelsWithCanonical(mockOctokit, "owner", "repo", [
          { name: "test", color: "ff0000" },
        ]),
      ).rejects.toThrow("Failed to sync labels: Request timeout");
    });

    test("should handle malformed response data", async () => {
      // Mock malformed response (missing data property)
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        // Missing data property
      });

      await expect(
        validateRepoLabels(mockOctokit, "owner", "repo", []),
      ).rejects.toThrow();
    });
  });

  describe("edge cases", () => {
    test("should handle very long label names", async () => {
      const longLabelName = "a".repeat(100);

      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [],
      });

      const canonicalLabels = [
        {
          name: longLabelName,
          color: "ff0000",
          description: "Long label",
        },
      ];

      const result = await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.created).toEqual([longLabelName]);
      expect(mockOctokit.rest.issues.createLabel).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        name: longLabelName,
        color: "ff0000",
        description: "Long label",
      });
    });

    test("should handle special characters in label names", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [],
      });

      const canonicalLabels = [
        {
          name: "bug/fix:urgent",
          color: "ff0000",
          description: "Urgent bug fix",
        },
      ];

      const result = await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(result.created).toEqual(["bug/fix:urgent"]);
    });

    test("should handle empty descriptions", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [],
      });

      const canonicalLabels = [
        { name: "bug", color: "ff0000", description: "" },
      ];

      await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(mockOctokit.rest.issues.createLabel).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        name: "bug",
        color: "ff0000",
        description: "",
      });
    });

    test("should handle missing color property", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [],
      });

      const canonicalLabels = [
        { name: "bug", description: "Bug reports" }, // Missing color
      ];

      await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(mockOctokit.rest.issues.createLabel).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        name: "bug",
        color: "E1E4E8", // Default color
        description: "Bug reports",
      });
    });

    test("should handle Unicode characters in descriptions", async () => {
      mockOctokit.rest.issues.listLabelsForRepo.mockResolvedValue({
        data: [],
      });

      const canonicalLabels = [
        {
          name: "bug",
          color: "ff0000",
          description: "🐛 Bug reports with emoji",
        },
      ];

      await syncLabelsWithCanonical(
        mockOctokit,
        "owner",
        "repo",
        canonicalLabels,
      );

      expect(mockOctokit.rest.issues.createLabel).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        name: "bug",
        color: "ff0000",
        description: "🐛 Bug reports with emoji",
      });
    });
  });
});
