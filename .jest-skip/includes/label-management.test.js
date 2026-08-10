/**
 * Unit Tests: Label Management
 */

import { LabelManager } from "../../includes/label-management.js";

describe("LabelManager", () => {
  let manager;

  beforeEach(() => {
    // Mock token
    process.env.GITHUB_TOKEN = "test-token";
    manager = new LabelManager({
      owner: "lightspeedwp",
      repo: ".github",
      verbose: false,
    });
  });

  describe("constructor", () => {
    it("should create instance with default options", () => {
      expect(manager.owner).toBe("lightspeedwp");
      expect(manager.repo).toBe(".github");
      expect(manager.token).toBe("test-token");
    });

    it("should throw without GitHub token", () => {
      delete process.env.GITHUB_TOKEN;
      expect(() => {
        new LabelManager();
      }).toThrow("GitHub token required");
    });

    it("should accept custom rate limit", () => {
      const custom = new LabelManager({ rateLimitMs: 200 });
      expect(custom.rateLimitMs).toBe(200);
    });
  });

  describe("rateLimit", () => {
    it("should enforce rate limiting between requests", async () => {
      const m = new LabelManager({ rateLimitMs: 50 });
      const start = Date.now();
      await m.rateLimit();
      await m.rateLimit();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(50);
    });
  });

  describe("hasLabel", () => {
    it("should return true if label exists", async () => {
      manager.octokit.rest.issues.listLabelsOnIssue = jest
        .fn()
        .mockResolvedValue({
          data: [{ name: "meta:needs-changelog" }, { name: "type:bug" }],
        });

      const result = await manager.hasLabel(1, "meta:needs-changelog");
      expect(result).toBe(true);
    });

    it("should return false if label does not exist", async () => {
      manager.octokit.rest.issues.listLabelsOnIssue = jest
        .fn()
        .mockResolvedValue({
          data: [{ name: "type:bug" }],
        });

      const result = await manager.hasLabel(1, "meta:needs-changelog");
      expect(result).toBe(false);
    });

    it("should return false for empty label list", async () => {
      manager.octokit.rest.issues.listLabelsOnIssue = jest
        .fn()
        .mockResolvedValue({
          data: [],
        });

      const result = await manager.hasLabel(1, "meta:needs-changelog");
      expect(result).toBe(false);
    });
  });

  describe("getLabels", () => {
    it("should return array of label names", async () => {
      manager.octokit.rest.issues.listLabelsOnIssue = jest
        .fn()
        .mockResolvedValue({
          data: [
            { name: "meta:needs-changelog" },
            { name: "type:bug" },
            { name: "priority:high" },
          ],
        });

      const result = await manager.getLabels(1);
      expect(result).toEqual([
        "meta:needs-changelog",
        "type:bug",
        "priority:high",
      ]);
    });

    it("should return empty array if no labels", async () => {
      manager.octokit.rest.issues.listLabelsOnIssue = jest
        .fn()
        .mockResolvedValue({
          data: [],
        });

      const result = await manager.getLabels(1);
      expect(result).toEqual([]);
    });
  });

  describe("addLabel", () => {
    it("should add label to issue", async () => {
      manager.octokit.rest.issues.addLabels = jest.fn().mockResolvedValue({});

      const result = await manager.addLabel(1, "meta:needs-changelog");
      expect(result).toBe(true);
      expect(manager.octokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: ".github",
        issue_number: 1,
        labels: ["meta:needs-changelog"],
      });
    });

    it("should handle API errors", async () => {
      manager.octokit.rest.issues.addLabels = jest
        .fn()
        .mockRejectedValue(new Error("API Error"));

      await expect(manager.addLabel(1, "meta:needs-changelog")).rejects.toThrow(
        "API Error",
      );
    });
  });

  describe("removeLabel", () => {
    it("should remove label from issue", async () => {
      manager.octokit.rest.issues.removeLabel = jest.fn().mockResolvedValue({});

      const result = await manager.removeLabel(1, "meta:needs-changelog");
      expect(result).toBe(true);
      expect(manager.octokit.rest.issues.removeLabel).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: ".github",
        issue_number: 1,
        name: "meta:needs-changelog",
      });
    });

    it("should return false if label not found (404)", async () => {
      const error = new Error("Not Found");
      error.status = 404;
      manager.octokit.rest.issues.removeLabel = jest
        .fn()
        .mockRejectedValue(error);

      const result = await manager.removeLabel(1, "meta:needs-changelog");
      expect(result).toBe(false);
    });
  });

  describe("syncLabels", () => {
    it("should add missing labels and remove extra labels", async () => {
      manager.octokit.rest.issues.listLabelsOnIssue = jest
        .fn()
        .mockResolvedValue({
          data: [{ name: "type:bug" }, { name: "meta:stale" }],
        });
      manager.octokit.rest.issues.addLabels = jest.fn().mockResolvedValue({});
      manager.octokit.rest.issues.removeLabel = jest.fn().mockResolvedValue({});

      const result = await manager.syncLabels(1, [
        "type:bug",
        "meta:needs-changelog",
      ]);

      expect(result.added).toContain("meta:needs-changelog");
      expect(result.removed).toContain("meta:stale");
    });

    it("should return empty arrays if already in sync", async () => {
      manager.octokit.rest.issues.listLabelsOnIssue = jest
        .fn()
        .mockResolvedValue({
          data: [{ name: "type:bug" }, { name: "meta:needs-changelog" }],
        });

      const result = await manager.syncLabels(1, [
        "type:bug",
        "meta:needs-changelog",
      ]);

      expect(result.added).toEqual([]);
      expect(result.removed).toEqual([]);
    });
  });

  describe("fetchIssuesWithLabel", () => {
    it("should fetch issues with specific label", async () => {
      manager.octokit.rest.issues.listForRepo = jest.fn().mockResolvedValue({
        data: [
          { number: 1, title: "Issue 1" },
          { number: 2, title: "Issue 2" },
        ],
      });

      const result = await manager.fetchIssuesWithLabel("meta:needs-changelog");

      expect(result.length).toBe(2);
      expect(result[0].number).toBe(1);
      expect(manager.octokit.rest.issues.listForRepo).toHaveBeenCalled();
    });

    it("should handle pagination", async () => {
      manager.octokit.rest.issues.listForRepo = jest
        .fn()
        .mockResolvedValueOnce({
          data: Array(100)
            .fill(0)
            .map((_, i) => ({ number: i + 1, title: `Issue ${i + 1}` })),
        })
        .mockResolvedValueOnce({
          data: [{ number: 101, title: "Issue 101" }],
        });

      const result = await manager.fetchIssuesWithLabel(
        "meta:needs-changelog",
        {
          limit: 120,
        },
      );

      expect(result.length).toBe(101); // Limited to 101
      expect(manager.octokit.rest.issues.listForRepo).toHaveBeenCalledTimes(2);
    });
  });

  describe("fetchAllIssues", () => {
    it("should fetch all open issues", async () => {
      manager.octokit.rest.issues.listForRepo = jest.fn().mockResolvedValue({
        data: [
          { number: 1, title: "Issue 1" },
          { number: 2, title: "Issue 2" },
        ],
      });

      const result = await manager.fetchAllIssues();

      expect(Array.isArray(result)).toBe(true);
      expect(manager.octokit.rest.issues.listForRepo).toHaveBeenCalled();
    });

    it("should respect limit parameter", async () => {
      const mockIssues = Array(50)
        .fill(0)
        .map((_, i) => ({ number: i + 1, title: `Issue ${i + 1}` }));
      manager.octokit.rest.issues.listForRepo = jest.fn().mockResolvedValue({
        data: mockIssues,
      });

      const result = await manager.fetchAllIssues({ limit: 50 });

      expect(result.length).toBeLessThanOrEqual(50);
    });
  });

  describe("getIssue", () => {
    it("should fetch single issue details", async () => {
      manager.octokit.rest.issues.get = jest.fn().mockResolvedValue({
        data: { number: 1, title: "Test Issue", labels: [] },
      });

      const result = await manager.getIssue(1);

      expect(result.number).toBe(1);
      expect(result.title).toBe("Test Issue");
    });
  });
});
