/**
 * Integration tests for milestone allocation workflow
 * Testing: MilestoneAllocator with mocked Octokit
 * @module scripts/automation/__tests__/integration-workflow-milestone.test.js
 */

const { describe, it, expect, beforeEach, jest } = require("@jest/globals");

// Mock Octokit before importing the production module
jest.mock("octokit", () => ({
  Octokit: jest.fn(),
}));

const {
  MilestoneAllocator,
  AllocationError,
} = require("../allocate-to-milestone.js");

describe("integration: milestone allocation workflow", () => {
  let mockOctokit;
  let { Octokit } = require("octokit");

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GITHUB_TOKEN = "test-token";

    mockOctokit = {
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

    Octokit.mockReturnValue(mockOctokit);
  });

  describe("milestone allocation workflow", () => {
    it("allocates milestone to a single PR", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 1,
            title: "v1.5",
            due_on: "2026-09-15",
            created_at: "2026-08-01",
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 123,
          title: "Merged PR",
          body: null,
          milestone: null,
        },
      });

      mockOctokit.rest.pulls.update.mockResolvedValue({
        data: { milestone: { number: 1, title: "v1.5" } },
      });

      const allocator = new MilestoneAllocator({ dryRun: false });
      const result = await allocator.allocate(123);

      expect(result.success).toBe(true);
      expect(result.stats.allocatedPRs).toBe(1);
      expect(mockOctokit.rest.pulls.update).toHaveBeenCalledWith(
        expect.objectContaining({
          pull_number: 123,
          milestone: 1,
        }),
      );
    });

    it("allocates milestone to a single issue", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 2,
            title: "v2.0",
            due_on: "2026-10-15",
            created_at: "2026-08-01",
          },
        ],
      });

      mockOctokit.rest.issues.get.mockResolvedValue({
        data: {
          number: 456,
          title: "Test issue",
          milestone: null,
        },
      });

      mockOctokit.rest.issues.update.mockResolvedValue({
        data: { milestone: { number: 2, title: "v2.0" } },
      });

      const allocator = new MilestoneAllocator({ dryRun: false });
      const result = await allocator.allocate(null, 456);

      expect(result.success).toBe(true);
      expect(result.stats.allocatedIssues).toBe(1);
      expect(mockOctokit.rest.issues.update).toHaveBeenCalledWith(
        expect.objectContaining({
          issue_number: 456,
          milestone: 2,
        }),
      );
    });

    it("parses and allocates linked issues from PR body", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 1,
            title: "v1.5",
            due_on: "2026-09-15",
            created_at: "2026-08-01",
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 789,
          title: "Feature PR",
          body: "Closes #100 and #200\nResolves #300",
          milestone: null,
        },
      });

      mockOctokit.rest.pulls.update.mockResolvedValue({
        data: { milestone: { number: 1 } },
      });

      mockOctokit.rest.issues.get.mockResolvedValue({
        data: { number: 100, milestone: null },
      });

      mockOctokit.rest.issues.update.mockResolvedValue({
        data: { milestone: { number: 1 } },
      });

      const allocator = new MilestoneAllocator({ dryRun: false });
      const result = await allocator.allocate(789);

      expect(result.success).toBe(true);
      expect(result.stats.allocatedPRs).toBe(1);
      expect(result.stats.allocatedIssues).toBe(3); // Linked issues
    });

    it("skips already allocated items (idempotency)", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 1,
            title: "v1.5",
            due_on: "2026-09-15",
            created_at: "2026-08-01",
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 999,
          title: "Already allocated",
          body: null,
          milestone: { number: 1, title: "v1.5" },
        },
      });

      const allocator = new MilestoneAllocator({ dryRun: false });
      const result = await allocator.allocate(999);

      expect(result.success).toBe(true);
      expect(result.stats.allocatedPRs).toBe(0);
      expect(result.stats.skipped).toBe(1);
      expect(mockOctokit.rest.pulls.update).not.toHaveBeenCalled();
    });

    it("handles deleted issues gracefully", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 1,
            title: "v1.5",
            due_on: "2026-09-15",
            created_at: "2026-08-01",
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 888,
          title: "PR with deleted issue",
          body: "Closes #404 (deleted)",
          milestone: null,
        },
      });

      mockOctokit.rest.pulls.update.mockResolvedValue({
        data: { milestone: { number: 1 } },
      });

      const notFoundError = new Error("Not Found");
      notFoundError.status = 404;
      mockOctokit.rest.issues.get.mockRejectedValue(notFoundError);

      const allocator = new MilestoneAllocator({ dryRun: false });
      const result = await allocator.allocate(888);

      expect(result.success).toBe(true);
      expect(result.stats.allocatedPRs).toBe(1);
      expect(result.stats.skipped).toBeGreaterThan(0); // Deleted issue skipped
      expect(result.stats.errors).toBe(0);
    });

    it("handles no active milestones gracefully", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [],
      });

      const allocator = new MilestoneAllocator();
      const result = await allocator.allocate(123);

      expect(result.success).toBe(false);
      expect(result.error).toContain("NO_ACTIVE_MILESTONE");
    });

    it("uses forced milestone when provided", async () => {
      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 555,
          title: "Test PR",
          body: null,
          milestone: null,
        },
      });

      mockOctokit.rest.pulls.update.mockResolvedValue({
        data: { milestone: { number: 5 } },
      });

      const allocator = new MilestoneAllocator({
        milestone: 5,
        dryRun: false,
      });
      const result = await allocator.allocate(555);

      expect(result.success).toBe(true);
      expect(mockOctokit.rest.pulls.update).toHaveBeenCalledWith(
        expect.objectContaining({
          milestone: 5,
        }),
      );
    });

    it("respects dry-run mode without making API changes", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 1,
            title: "v1.5",
            due_on: "2026-09-15",
            created_at: "2026-08-01",
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 111,
          title: "Dry run PR",
          body: null,
          milestone: null,
        },
      });

      const allocator = new MilestoneAllocator({ dryRun: true });
      const result = await allocator.allocate(111);

      expect(result.success).toBe(true);
      expect(result.stats.allocatedPRs).toBe(1);
      expect(mockOctokit.rest.pulls.update).not.toHaveBeenCalled();
    });

    it("sorts milestones by due date, then creation date", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 3,
            title: "v3.0",
            due_on: "2026-12-01",
            created_at: "2026-07-01",
          },
          {
            number: 1,
            title: "v1.5",
            due_on: "2026-09-15",
            created_at: "2026-08-01",
          },
          {
            number: 2,
            title: "v2.0",
            due_on: "2026-09-15",
            created_at: "2026-08-05", // Later created, same due date
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 222,
          title: "Test PR",
          body: null,
          milestone: null,
        },
      });

      mockOctokit.rest.pulls.update.mockResolvedValue({
        data: { milestone: { number: 2 } },
      });

      const allocator = new MilestoneAllocator({ dryRun: false });
      await allocator.allocate(222);

      // Both #1 and #2 have earliest due date (2026-09-15), so select #2 (latest created)
      expect(mockOctokit.rest.pulls.update).toHaveBeenCalledWith(
        expect.objectContaining({
          milestone: 2,
        }),
      );
    });
  });

  describe("error handling", () => {
    it("throws AllocationError without GITHUB_TOKEN", () => {
      delete process.env.GITHUB_TOKEN;
      expect(() => new MilestoneAllocator()).toThrow(AllocationError);
    });

    it("handles API errors gracefully", async () => {
      mockOctokit.rest.issues.listMilestones.mockRejectedValue(
        new Error("API Error"),
      );

      const allocator = new MilestoneAllocator();
      const result = await allocator.allocate(123);

      expect(result.success).toBe(false);
      expect(result.error).toContain("MILESTONE_FETCH_FAILED");
    });

    it("logs summary statistics after allocation", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 1,
            title: "v1.5",
            due_on: "2026-09-15",
            created_at: "2026-08-01",
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 333,
          title: "Test PR",
          body: null,
          milestone: null,
        },
      });

      mockOctokit.rest.pulls.update.mockResolvedValue({
        data: { milestone: { number: 1 } },
      });

      const allocator = new MilestoneAllocator({ dryRun: false });
      await allocator.allocate(333);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Allocation complete"),
      );
      consoleSpy.mockRestore();
    });
  });

  describe("milestone selection algorithm", () => {
    it("selects earliest due date milestone", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 2,
            title: "Later",
            due_on: "2026-12-01",
            created_at: "2026-08-01",
          },
          {
            number: 1,
            title: "Earlier",
            due_on: "2026-09-01",
            created_at: "2026-08-01",
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 444,
          title: "Test",
          body: null,
          milestone: null,
        },
      });

      mockOctokit.rest.pulls.update.mockResolvedValue({ data: {} });

      const allocator = new MilestoneAllocator({ dryRun: false });
      await allocator.allocate(444);

      expect(mockOctokit.rest.pulls.update).toHaveBeenCalledWith(
        expect.objectContaining({ milestone: 1 }),
      );
    });

    it("prioritizes milestones with due dates over those without", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 2,
            title: "No due date",
            due_on: null,
            created_at: "2026-08-05",
          },
          {
            number: 1,
            title: "Has due date",
            due_on: "2026-09-15",
            created_at: "2026-08-01",
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 555,
          title: "Test",
          body: null,
          milestone: null,
        },
      });

      mockOctokit.rest.pulls.update.mockResolvedValue({ data: {} });

      const allocator = new MilestoneAllocator({ dryRun: false });
      await allocator.allocate(555);

      expect(mockOctokit.rest.pulls.update).toHaveBeenCalledWith(
        expect.objectContaining({ milestone: 1 }),
      );
    });

    it("uses latest creation date as tiebreaker for same due date", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 1,
            title: "Created first",
            due_on: "2026-09-15",
            created_at: "2026-08-01",
          },
          {
            number: 2,
            title: "Created later",
            due_on: "2026-09-15",
            created_at: "2026-08-10",
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 666,
          title: "Test",
          body: null,
          milestone: null,
        },
      });

      mockOctokit.rest.pulls.update.mockResolvedValue({ data: {} });

      const allocator = new MilestoneAllocator({ dryRun: false });
      await allocator.allocate(666);

      // Should select milestone 2 (later created)
      expect(mockOctokit.rest.pulls.update).toHaveBeenCalledWith(
        expect.objectContaining({ milestone: 2 }),
      );
    });
  });

  describe("verbose logging", () => {
    it("logs detailed decision-making when verbose is enabled", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 1,
            title: "v1.5",
            due_on: "2026-09-15",
            created_at: "2026-08-01",
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 777,
          title: "Test PR",
          body: "Closes #100",
          milestone: null,
        },
      });

      mockOctokit.rest.pulls.update.mockResolvedValue({ data: {} });
      mockOctokit.rest.issues.get.mockResolvedValue({
        data: { number: 100, milestone: null },
      });
      mockOctokit.rest.issues.update.mockResolvedValue({ data: {} });

      const allocator = new MilestoneAllocator({
        verbose: true,
        dryRun: false,
      });
      await allocator.allocate(777);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("→"));
      consoleSpy.mockRestore();
    });
  });

  describe("linked issues detection", () => {
    it("parses various link formats correctly", () => {
      const allocator = new MilestoneAllocator();

      const formats = [
        { body: "Closes #100", expected: [100] },
        { body: "Resolves #200", expected: [200] },
        { body: "Fixes #300", expected: [300] },
        { body: "Close #400", expected: [400] },
        { body: "Resolve #500", expected: [500] },
        { body: "Fix #600", expected: [600] },
        { body: "CLOSES #700", expected: [700] },
        { body: "Closes #100 and #200", expected: [100, 200] },
        {
          body: "Closes #100\nResolves #200\nFixes #300",
          expected: [100, 200, 300],
        },
        { body: "Closes #100 and #100", expected: [100] }, // Deduplicates
      ];

      formats.forEach(({ body, expected }) => {
        const result = allocator.parseLinkedIssues(body);
        expect(result).toEqual(expected);
      });
    });

    it("returns empty array for null/undefined body", () => {
      const allocator = new MilestoneAllocator();
      expect(allocator.parseLinkedIssues(null)).toEqual([]);
      expect(allocator.parseLinkedIssues(undefined)).toEqual([]);
      expect(allocator.parseLinkedIssues("")).toEqual([]);
    });

    it("ignores issue references without keywords", () => {
      const allocator = new MilestoneAllocator();
      const body = "This PR is related to issue #999 but doesn't close it";
      const result = allocator.parseLinkedIssues(body);
      expect(result).not.toContain(999);
    });
  });

  describe("concurrent operations", () => {
    it("handles multiple allocations in one workflow", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: [
          {
            number: 1,
            title: "v1.5",
            due_on: "2026-09-15",
            created_at: "2026-08-01",
          },
        ],
      });

      mockOctokit.rest.pulls.get.mockResolvedValue({
        data: {
          number: 888,
          title: "PR with multiple issues",
          body: "Closes #10\nCloses #20\nCloses #30",
          milestone: null,
        },
      });

      mockOctokit.rest.pulls.update.mockResolvedValue({ data: {} });
      mockOctokit.rest.issues.get.mockResolvedValue({
        data: { number: 10, milestone: null },
      });
      mockOctokit.rest.issues.update.mockResolvedValue({ data: {} });

      const allocator = new MilestoneAllocator({ dryRun: false });
      const result = await allocator.allocate(888);

      expect(result.success).toBe(true);
      expect(result.stats.allocatedPRs).toBe(1);
      expect(result.stats.allocatedIssues).toBe(3);
    });
  });
});

describe("AllocationError", () => {
  it("creates proper error instances", () => {
    const error = new AllocationError("TEST_CODE", "Test message");
    expect(error.code).toBe("TEST_CODE");
    expect(error.message).toBe("Test message");
    expect(error.name).toBe("AllocationError");
    expect(error instanceof Error).toBe(true);
  });
});

describe("MilestoneAllocator configuration", () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = "test-token";
  });

  it("uses environment variables for configuration", () => {
    process.env.GITHUB_OWNER = "custom-org";
    process.env.GITHUB_REPO = "custom-repo";

    const allocator = new MilestoneAllocator();
    expect(allocator.owner).toBe("custom-org");
    expect(allocator.repo).toBe("custom-repo");
  });

  it("allows options to override environment variables", () => {
    process.env.GITHUB_OWNER = "env-org";
    process.env.GITHUB_REPO = "env-repo";

    const allocator = new MilestoneAllocator({
      owner: "option-org",
      repo: "option-repo",
    });
    expect(allocator.owner).toBe("option-org");
    expect(allocator.repo).toBe("option-repo");
  });

  it("defaults to lightspeedwp/.github when no config provided", () => {
    delete process.env.GITHUB_OWNER;
    delete process.env.GITHUB_REPO;

    const allocator = new MilestoneAllocator();
    expect(allocator.owner).toBe("lightspeedwp");
    expect(allocator.repo).toBe(".github");
  });
});
