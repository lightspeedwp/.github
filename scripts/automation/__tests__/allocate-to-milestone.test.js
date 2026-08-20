/**
 * Unit tests for allocate-to-milestone.js
 * Tests milestone allocation logic, argument parsing, and error handling
 * @module scripts/automation/__tests__/allocate-to-milestone.test.js
 */

const { describe, it, expect, beforeAll, beforeEach, jest } = require("@jest/globals");

// Mock Octokit before importing the allocate-to-milestone module
jest.mock("octokit", () => ({
  Octokit: jest.fn(() => ({
    rest: {
      issues: {
        listMilestones: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
      },
      pulls: {
        get: jest.fn(),
        update: jest.fn(),
      },
    },
  })),
}));

const { MilestoneAllocator, AllocationError } = require("../allocate-to-milestone.js");

describe("allocate-to-milestone", () => {
  const mockOctokit = {
    rest: {
      issues: {
        listMilestones: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
      },
      pulls: {
        get: jest.fn(),
        update: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GITHUB_TOKEN = "mock-token";
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GITHUB_TOKEN = "mock-token";
  });

  describe("AllocationError", () => {
    it("should create error with code and message", () => {
      const error = new AllocationError("NO_TOKEN", "Token is missing");
      expect(error.code).toBe("NO_TOKEN");
      expect(error.message).toBe("Token is missing");
      expect(error.name).toBe("AllocationError");
    });

    it("should be instanceof Error", () => {
      const error = new AllocationError("TEST", "test message");
      expect(error instanceof Error).toBe(true);
    });
  });

  describe("MilestoneAllocator constructor", () => {
    it("should throw AllocationError if GITHUB_TOKEN not set", () => {
      delete process.env.GITHUB_TOKEN;
      expect(() => new MilestoneAllocator()).toThrow(AllocationError);
    });

    it("should initialize with default owner and repo", () => {
      const allocator = new MilestoneAllocator();
      expect(allocator.owner).toBe("lightspeedwp");
      expect(allocator.repo).toBe(".github");
    });

    it("should override owner from options", () => {
      const allocator = new MilestoneAllocator({ owner: "custom-owner" });
      expect(allocator.owner).toBe("custom-owner");
    });

    it("should override repo from options", () => {
      const allocator = new MilestoneAllocator({ repo: "custom-repo" });
      expect(allocator.repo).toBe("custom-repo");
    });

    it("should set dryRun flag", () => {
      const allocator = new MilestoneAllocator({ dryRun: true });
      expect(allocator.dryRun).toBe(true);
    });

    it("should set verbose flag", () => {
      const allocator = new MilestoneAllocator({ verbose: true });
      expect(allocator.verbose).toBe(true);
    });

    it("should initialize stats with zero counts", () => {
      const allocator = new MilestoneAllocator();
      expect(allocator.stats.allocatedPRs).toBe(0);
      expect(allocator.stats.allocatedIssues).toBe(0);
      expect(allocator.stats.skipped).toBe(0);
      expect(allocator.stats.errors).toBe(0);
    });

    it("should set forced milestone", () => {
      const allocator = new MilestoneAllocator({ milestone: 5 });
      expect(allocator.forcedMilestone).toBe(5);
    });
  });

  describe("parseLinkedIssues", () => {
    let allocator;

    beforeEach(() => {
      allocator = new MilestoneAllocator();
    });

    it("should parse 'Closes #123'", () => {
      const issues = allocator.parseLinkedIssues("Closes #123");
      expect(issues).toContain(123);
    });

    it("should parse 'Resolves #456'", () => {
      const issues = allocator.parseLinkedIssues("Resolves #456");
      expect(issues).toContain(456);
    });

    it("should parse 'Fixes #789'", () => {
      const issues = allocator.parseLinkedIssues("Fixes #789");
      expect(issues).toContain(789);
    });

    it("should parse multiple linked issues", () => {
      const body = "Closes #100\nResolves #200\nFixes #300";
      const issues = allocator.parseLinkedIssues(body);
      expect(issues).toHaveLength(3);
      expect(issues).toContain(100);
      expect(issues).toContain(200);
      expect(issues).toContain(300);
    });

    it("should be case-insensitive", () => {
      const issues = allocator.parseLinkedIssues("CLOSES #111");
      expect(issues).toContain(111);
    });

    it("should deduplicate issue numbers", () => {
      const body = "Fixes #999 and Closes #999";
      const issues = allocator.parseLinkedIssues(body);
      expect(issues).toHaveLength(1);
      expect(issues[0]).toBe(999);
    });

    it("should return empty array for null body", () => {
      const issues = allocator.parseLinkedIssues(null);
      expect(issues).toEqual([]);
    });

    it("should return empty array for undefined body", () => {
      const issues = allocator.parseLinkedIssues(undefined);
      expect(issues).toEqual([]);
    });

    it("should return empty array for body with no linked issues", () => {
      const issues = allocator.parseLinkedIssues("This PR does something");
      expect(issues).toEqual([]);
    });
  });

  describe("isAlreadyAllocated", () => {
    let allocator;
    const targetMilestone = { number: 1 };

    beforeEach(() => {
      allocator = new MilestoneAllocator();
    });

    it("should return false if item has no milestone", () => {
      const item = { title: "PR", milestone: null };
      expect(allocator.isAlreadyAllocated(item, targetMilestone)).toBe(false);
    });

    it("should return true if milestone matches", () => {
      const item = { title: "PR", milestone: { number: 1 } };
      expect(allocator.isAlreadyAllocated(item, targetMilestone)).toBe(true);
    });

    it("should return false if milestone differs", () => {
      const item = { title: "PR", milestone: { number: 2 } };
      expect(allocator.isAlreadyAllocated(item, targetMilestone)).toBe(false);
    });
  });

  describe("allocatePR", () => {
    let allocator;
    const milestone = { number: 1, title: "v1.0" };
    const prResponse = { data: { number: 123, milestone: null, body: "" } };

    beforeEach(() => {
      allocator = new MilestoneAllocator();
      allocator.octokit = mockOctokit;
    });

    it("should allocate PR successfully", async () => {
      mockOctokit.rest.pulls.get.mockResolvedValueOnce(prResponse);
      mockOctokit.rest.pulls.update.mockResolvedValueOnce({});

      const result = await allocator.allocatePR(123, milestone);
      expect(result.status).toBe("allocated");
      expect(allocator.stats.allocatedPRs).toBe(1);
      expect(mockOctokit.rest.pulls.update).toHaveBeenCalledWith(
        expect.objectContaining({ milestone: 1 }),
      );
    });

    it("should skip already-allocated PR", async () => {
      const prWithMilestone = {
        data: { number: 123, milestone: { number: 1 }, body: "" },
      };
      mockOctokit.rest.pulls.get.mockResolvedValueOnce(prWithMilestone);

      const result = await allocator.allocatePR(123, milestone);
      expect(result.status).toBe("skipped");
      expect(result.reason).toBe("already-allocated");
      expect(allocator.stats.skipped).toBe(1);
      expect(mockOctokit.rest.pulls.update).not.toHaveBeenCalled();
    });

    it("should respect dry-run mode", async () => {
      allocator.dryRun = true;
      mockOctokit.rest.pulls.get.mockResolvedValueOnce(prResponse);

      const result = await allocator.allocatePR(123, milestone);
      expect(result.status).toBe("dry-run");
      expect(allocator.stats.allocatedPRs).toBe(1);
      expect(mockOctokit.rest.pulls.update).not.toHaveBeenCalled();
    });

    it("should handle API errors", async () => {
      mockOctokit.rest.pulls.get.mockRejectedValueOnce(
        new Error("API Error"),
      );

      const result = await allocator.allocatePR(123, milestone);
      expect(result.status).toBe("error");
      expect(allocator.stats.errors).toBe(1);
      expect(allocator.errors).toHaveLength(1);
    });
  });

  describe("allocateIssue", () => {
    let allocator;
    const milestone = { number: 1 };
    const issueResponse = { data: { number: 456, milestone: null } };

    beforeEach(() => {
      allocator = new MilestoneAllocator();
      allocator.octokit = mockOctokit;
    });

    it("should allocate issue successfully", async () => {
      mockOctokit.rest.issues.get.mockResolvedValueOnce(issueResponse);
      mockOctokit.rest.issues.update.mockResolvedValueOnce({});

      const result = await allocator.allocateIssue(456, milestone);
      expect(result.status).toBe("allocated");
      expect(allocator.stats.allocatedIssues).toBe(1);
      expect(mockOctokit.rest.issues.update).toHaveBeenCalledWith(
        expect.objectContaining({ milestone: 1 }),
      );
    });

    it("should skip already-allocated issue", async () => {
      const issueWithMilestone = {
        data: { number: 456, milestone: { number: 1 } },
      };
      mockOctokit.rest.issues.get.mockResolvedValueOnce(issueWithMilestone);

      const result = await allocator.allocateIssue(456, milestone);
      expect(result.status).toBe("skipped");
      expect(allocator.stats.skipped).toBe(1);
      expect(mockOctokit.rest.issues.update).not.toHaveBeenCalled();
    });

    it("should respect dry-run mode", async () => {
      allocator.dryRun = true;
      mockOctokit.rest.issues.get.mockResolvedValueOnce(issueResponse);

      const result = await allocator.allocateIssue(456, milestone);
      expect(result.status).toBe("dry-run");
      expect(allocator.stats.allocatedIssues).toBe(1);
      expect(mockOctokit.rest.issues.update).not.toHaveBeenCalled();
    });

    it("should handle 404 as 'not-found' (deleted issue)", async () => {
      const notFoundError = new Error("Not Found");
      notFoundError.status = 404;
      mockOctokit.rest.issues.get.mockRejectedValueOnce(notFoundError);

      const result = await allocator.allocateIssue(456, milestone);
      expect(result.status).toBe("not-found");
      expect(allocator.stats.skipped).toBe(1);
      expect(allocator.stats.errors).toBe(0);
    });

    it("should handle non-404 API errors", async () => {
      mockOctokit.rest.issues.get.mockRejectedValueOnce(
        new Error("Server Error"),
      );

      const result = await allocator.allocateIssue(456, milestone);
      expect(result.status).toBe("error");
      expect(allocator.stats.errors).toBe(1);
    });
  });

  describe("fetchActiveMilestone", () => {
    let allocator;

    beforeEach(() => {
      allocator = new MilestoneAllocator();
      allocator.octokit = mockOctokit;
    });

    it("should fetch and return first milestone", async () => {
      const milestones = [
        {
          number: 1,
          title: "v1.0",
          due_on: "2026-09-01",
          created_at: "2026-08-01",
        },
      ];
      mockOctokit.rest.issues.listMilestones.mockResolvedValueOnce({
        data: milestones,
      });

      const result = await allocator.fetchActiveMilestone();
      expect(result.number).toBe(1);
    });

    it("should sort by due_on date (earliest first)", async () => {
      const milestones = [
        {
          number: 2,
          title: "v2.0",
          due_on: "2026-09-15",
          created_at: "2026-08-01",
        },
        {
          number: 1,
          title: "v1.0",
          due_on: "2026-09-01",
          created_at: "2026-08-01",
        },
      ];
      mockOctokit.rest.issues.listMilestones.mockResolvedValueOnce({
        data: milestones,
      });

      const result = await allocator.fetchActiveMilestone();
      expect(result.number).toBe(1);
    });

    it("should sort milestones with due dates before those without", async () => {
      const milestones = [
        { number: 2, title: "v2.0", due_on: null, created_at: "2026-08-01" },
        {
          number: 1,
          title: "v1.0",
          due_on: "2026-09-01",
          created_at: "2026-08-01",
        },
      ];
      mockOctokit.rest.issues.listMilestones.mockResolvedValueOnce({
        data: milestones,
      });

      const result = await allocator.fetchActiveMilestone();
      expect(result.number).toBe(1);
    });

    it("should use created_at as tiebreaker (latest first)", async () => {
      const milestones = [
        {
          number: 1,
          title: "v1.0",
          due_on: "2026-09-01",
          created_at: "2026-08-01",
        },
        {
          number: 2,
          title: "v1.1",
          due_on: "2026-09-01",
          created_at: "2026-08-15",
        },
      ];
      mockOctokit.rest.issues.listMilestones.mockResolvedValueOnce({
        data: milestones,
      });

      const result = await allocator.fetchActiveMilestone();
      expect(result.number).toBe(2);
    });

    it("should throw error if no milestones found", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValueOnce({
        data: [],
      });

      await expect(allocator.fetchActiveMilestone()).rejects.toThrow(
        AllocationError,
      );
    });

    it("should wrap API errors in AllocationError", async () => {
      mockOctokit.rest.issues.listMilestones.mockRejectedValueOnce(
        new Error("API Error"),
      );

      await expect(allocator.fetchActiveMilestone()).rejects.toThrow(
        "MILESTONE_FETCH_FAILED",
      );
    });
  });

  describe("allocate (main orchestration)", () => {
    let allocator;
    const milestone = {
      number: 1,
      title: "v1.0",
      due_on: "2026-09-01",
    };

    beforeEach(() => {
      allocator = new MilestoneAllocator();
      allocator.octokit = mockOctokit;
    });

    it("should allocate PR with dry-run", async () => {
      allocator.dryRun = true;
      mockOctokit.rest.issues.listMilestones.mockResolvedValueOnce({
        data: [milestone],
      });
      mockOctokit.rest.pulls.get.mockResolvedValueOnce({
        data: { number: 123, body: "Closes #456", milestone: null },
      });
      mockOctokit.rest.pulls.get.mockResolvedValueOnce({
        data: { number: 123, body: "Closes #456", milestone: null },
      });
      mockOctokit.rest.issues.get.mockResolvedValueOnce({
        data: { number: 456, milestone: null },
      });

      const result = await allocator.allocate(123, null);
      expect(result.success).toBe(true);
      expect(result.stats.allocatedPRs).toBe(1);
      expect(result.stats.allocatedIssues).toBe(1);
    });

    it("should handle forced milestone override", async () => {
      const allocatorWithForced = new MilestoneAllocator({
        milestone: 5,
        dryRun: true,
      });
      allocatorWithForced.octokit = mockOctokit;

      mockOctokit.rest.pulls.get.mockResolvedValueOnce({
        data: { number: 123, body: "", milestone: null },
      });
      mockOctokit.rest.pulls.get.mockResolvedValueOnce({
        data: { number: 123, body: "", milestone: null },
      });
      mockOctokit.rest.pulls.update.mockResolvedValueOnce({});

      const result = await allocatorWithForced.allocate(123, null);
      expect(result.success).toBe(true);
      expect(mockOctokit.rest.issues.listMilestones).not.toHaveBeenCalled();
    });

    it("should return failure on no active milestone", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValueOnce({
        data: [],
      });

      const result = await allocator.allocate(123, null);
      expect(result.success).toBe(false);
      expect(result.error).toContain("NO_ACTIVE_MILESTONE");
    });

    it("should allocate standalone issue", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValueOnce({
        data: [milestone],
      });
      mockOctokit.rest.issues.get.mockResolvedValueOnce({
        data: { number: 789, milestone: null },
      });
      mockOctokit.rest.issues.update.mockResolvedValueOnce({});

      const result = await allocator.allocate(null, 789);
      expect(result.success).toBe(true);
      expect(result.stats.allocatedIssues).toBe(1);
    });

    it("should allocate both PR and issue", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValueOnce({
        data: [milestone],
      });
      mockOctokit.rest.pulls.get.mockResolvedValueOnce({
        data: { number: 123, body: "", milestone: null },
      });
      mockOctokit.rest.pulls.get.mockResolvedValueOnce({
        data: { number: 123, body: "", milestone: null },
      });
      mockOctokit.rest.pulls.update.mockResolvedValueOnce({});
      mockOctokit.rest.issues.get.mockResolvedValueOnce({
        data: { number: 456, milestone: null },
      });
      mockOctokit.rest.issues.update.mockResolvedValueOnce({});

      const result = await allocator.allocate(123, 456);
      expect(result.success).toBe(true);
      expect(result.stats.allocatedPRs).toBe(1);
      expect(result.stats.allocatedIssues).toBe(1);
    });
  });
});
