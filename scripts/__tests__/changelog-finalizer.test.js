/**
 * Tests for Changelog Finalizer
 * Validates state finalization, entry validation, and idempotent updates
 */

const {
  verifyIssueFinalized,
  validateChangelogEntry,
  isEntryOutdated,
  findExistingEntry,
  updateChangelogIdempotent,
  isStateConsistent,
} = require("../changelog/changelog-finalizer");

describe("Changelog Finalizer", () => {
  let mockOctokit;

  beforeEach(() => {
    mockOctokit = {
      rest: {
        issues: {
          get: jest.fn(),
        },
      },
    };
  });

  describe("isStateConsistent", () => {
    test("should detect consistent states", () => {
      const state1 = {
        labels: [{ name: "type:bug" }, { name: "area:ci" }],
      };

      const state2 = {
        labels: [{ name: "type:bug" }, { name: "area:ci" }],
      };

      const result = isStateConsistent(state1, state2);
      expect(result).toBe(true);
    });

    test("should detect label count changes", () => {
      const state1 = {
        labels: [{ name: "type:bug" }],
      };

      const state2 = {
        labels: [{ name: "type:bug" }, { name: "area:ci" }],
      };

      const result = isStateConsistent(state1, state2);
      expect(result).toBe(false);
    });

    test("should detect label content changes", () => {
      const state1 = {
        labels: [{ name: "type:bug" }],
      };

      const state2 = {
        labels: [{ name: "type:feature" }],
      };

      const result = isStateConsistent(state1, state2);
      expect(result).toBe(false);
    });
  });

  describe("verifyIssueFinalized", () => {
    test("should return issue when state is stable", async () => {
      const stableState = {
        number: 123,
        labels: [{ name: "type:bug" }],
      };

      mockOctokit.rest.issues.get.mockResolvedValue({ data: stableState });

      const result = await verifyIssueFinalized(
        mockOctokit,
        { owner: "org", repo: "repo", number: 123 },
        2,
      );

      expect(result).toEqual(stableState);
    });

    test("should retry when state changes", async () => {
      const state1 = {
        number: 123,
        labels: [{ name: "type:bug" }],
      };

      const state2 = {
        number: 123,
        labels: [{ name: "type:bug" }, { name: "area:ci" }],
      };

      const finalState = {
        number: 123,
        labels: [{ name: "type:bug" }, { name: "area:ci" }],
      };

      mockOctokit.rest.issues.get
        .mockResolvedValueOnce({ data: state1 })
        .mockResolvedValueOnce({ data: state2 })
        .mockResolvedValueOnce({ data: finalState });

      const result = await verifyIssueFinalized(
        mockOctokit,
        { owner: "org", repo: "repo", number: 123 },
        5,
      );

      expect(result).toEqual(finalState);
      expect(mockOctokit.rest.issues.get).toHaveBeenCalledTimes(3);
    });

    test("should throw when state not finalized after max retries", async () => {
      mockOctokit.rest.issues.get.mockResolvedValue({
        data: { number: 123, labels: [] },
      });

      // Always return different states (never stabilize)
      mockOctokit.rest.issues.get
        .mockResolvedValueOnce({
          data: { number: 123, labels: [{ name: "a" }] },
        })
        .mockResolvedValueOnce({
          data: { number: 123, labels: [{ name: "b" }] },
        })
        .mockResolvedValueOnce({
          data: { number: 123, labels: [{ name: "c" }] },
        });

      await expect(
        verifyIssueFinalized(
          mockOctokit,
          { owner: "org", repo: "repo", number: 123 },
          3,
        ),
      ).rejects.toThrow("not finalized");
    });

    test("should handle API errors gracefully", async () => {
      mockOctokit.rest.issues.get
        .mockRejectedValueOnce(new Error("API error"))
        .mockResolvedValueOnce({
          data: { number: 123, labels: [{ name: "type:bug" }] },
        })
        .mockResolvedValueOnce({
          data: { number: 123, labels: [{ name: "type:bug" }] },
        });

      const result = await verifyIssueFinalized(
        mockOctokit,
        { owner: "org", repo: "repo", number: 123 },
        5,
      );

      expect(result).toBeDefined();
    });
  });

  describe("validateChangelogEntry", () => {
    test("should validate correct entry", () => {
      const entry = {
        labels: ["type:bug", "area:ci"],
        title: "Test issue",
        description: "Test description",
      };

      const issueData = {
        labels: [{ name: "type:bug" }, { name: "area:ci" }],
      };

      const result = validateChangelogEntry(entry, issueData);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    test("should detect missing labels", () => {
      const entry = {
        labels: ["type:bug"],
        title: "Test issue",
      };

      const issueData = {
        labels: [{ name: "type:bug" }, { name: "area:ci" }],
      };

      const result = validateChangelogEntry(entry, issueData);
      expect(result.isValid).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test("should detect stale labels", () => {
      const entry = {
        labels: ["type:bug", "area:ci", "priority:high"],
        title: "Test issue",
      };

      const issueData = {
        labels: [{ name: "type:bug" }, { name: "area:ci" }],
      };

      const result = validateChangelogEntry(entry, issueData);
      expect(result.isValid).toBe(false);
      expect(result.warnings.some((w) => w.includes("Stale label"))).toBe(true);
    });
  });

  describe("isEntryOutdated", () => {
    test("should detect outdated labels", () => {
      const existing = {
        labels: ["type:bug"],
        title: "Issue",
      };

      const updated = {
        labels: ["type:bug", "area:ci"],
        title: "Issue",
      };

      const result = isEntryOutdated(existing, updated);
      expect(result).toBe(true);
    });

    test("should detect title changes", () => {
      const existing = {
        labels: ["type:bug"],
        title: "Old title",
      };

      const updated = {
        labels: ["type:bug"],
        title: "New title",
      };

      const result = isEntryOutdated(existing, updated);
      expect(result).toBe(true);
    });

    test("should detect description changes", () => {
      const existing = {
        labels: ["type:bug"],
        title: "Issue",
        description: "Old description",
      };

      const updated = {
        labels: ["type:bug"],
        title: "Issue",
        description: "New description",
      };

      const result = isEntryOutdated(existing, updated);
      expect(result).toBe(true);
    });

    test("should return false for identical entries", () => {
      const existing = {
        labels: ["type:bug"],
        title: "Issue",
        description: "Description",
      };

      const updated = {
        labels: ["type:bug"],
        title: "Issue",
        description: "Description",
      };

      const result = isEntryOutdated(existing, updated);
      expect(result).toBe(false);
    });
  });

  describe("findExistingEntry", () => {
    test("should find entry by issue number", () => {
      const changelog = [
        { issueNumber: 1, title: "Issue 1" },
        { issueNumber: 2, title: "Issue 2" },
        { issueNumber: 3, title: "Issue 3" },
      ];

      const result = findExistingEntry(changelog, 2);
      expect(result).toEqual({ issueNumber: 2, title: "Issue 2" });
    });

    test("should return null when entry not found", () => {
      const changelog = [{ issueNumber: 1, title: "Issue 1" }];

      const result = findExistingEntry(changelog, 999);
      expect(result).toBeNull();
    });
  });

  describe("updateChangelogIdempotent", () => {
    test("should add new entry when not exists", () => {
      const changelog = [];
      const newEntry = {
        issueNumber: 123,
        title: "New Issue",
        labels: [],
      };

      const result = updateChangelogIdempotent(changelog, newEntry);

      expect(result).toHaveLength(1);
      expect(result[0].issueNumber).toBe(123);
      expect(result[0].createdAt).toBeDefined();
    });

    test("should update existing entry when outdated", () => {
      const changelog = [
        {
          issueNumber: 123,
          title: "Old Title",
          labels: ["type:bug"],
          createdAt: "2026-08-30T10:00:00Z",
        },
      ];

      const updatedEntry = {
        issueNumber: 123,
        title: "New Title",
        labels: ["type:bug", "area:ci"],
      };

      const result = updateChangelogIdempotent(changelog, updatedEntry);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("New Title");
      expect(result[0].labels).toHaveLength(2);
      expect(result[0].updatedAt).toBeDefined();
    });

    test("should not duplicate entry when current", () => {
      const changelog = [
        {
          issueNumber: 123,
          title: "Title",
          labels: ["type:bug"],
          createdAt: "2026-08-30T10:00:00Z",
        },
      ];

      const sameEntry = {
        issueNumber: 123,
        title: "Title",
        labels: ["type:bug"],
      };

      const result = updateChangelogIdempotent(changelog, sameEntry);

      expect(result).toHaveLength(1);
      expect(result[0].updatedAt).toBeUndefined(); // Not updated
    });
  });
});
