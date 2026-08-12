/**
 * allocate-to-milestone.test.js - Test suite for milestone allocation script
 */

// Note: Script uses ES modules, tests use CommonJS. Mock only the Octokit dependency.

jest.mock("octokit", () => {
  return {
    Octokit: jest.fn().mockImplementation(() => ({
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
  };
});

describe("MilestoneAllocator", () => {
  let allocator;
  let mockOctokit;

  beforeEach(() => {
    process.env.GITHUB_TOKEN = "test-token";
    allocator = new MilestoneAllocator({
      owner: "test-owner",
      repo: "test-repo",
    });
    mockOctokit = allocator.octokit;
    jest.clearAllMocks();
  });

  describe("initialization", () => {
    test("throws error if GITHUB_TOKEN not set", () => {
      delete process.env.GITHUB_TOKEN;
      expect(() => new MilestoneAllocator()).toThrow(AllocationError);
    });

    test("uses environment variables for owner and repo", () => {
      process.env.GITHUB_OWNER = "org-owner";
      process.env.GITHUB_REPO = "org-repo";
      const allocatorWithEnv = new MilestoneAllocator();
      expect(allocatorWithEnv.owner).toBe("org-owner");
      expect(allocatorWithEnv.repo).toBe("org-repo");
    });
  });

  describe("FR-1: fetchActiveMilestone", () => {
    test("returns milestone with earliest due date", async () => {
      const milestones = [
        {
          number: 1,
          title: "v1.1",
          due_on: "2026-12-31T23:59:59Z",
          created_at: "2026-01-01T00:00:00Z",
        },
        {
          number: 2,
          title: "v1.0",
          due_on: "2026-08-31T23:59:59Z",
          created_at: "2026-06-01T00:00:00Z",
        },
      ];

      mockOctokit.rest.issues.listMilestones.mockResolvedValue({
        data: milestones,
      });

      const result = await allocator.fetchActiveMilestone();
      expect(result.number).toBe(2);
      expect(result.title).toBe("v1.0");
    });

    test("throws error if no open milestones", async () => {
      mockOctokit.rest.issues.listMilestones.mockResolvedValue({ data: [] });

      await expect(allocator.fetchActiveMilestone()).rejects.toThrow(
        AllocationError,
      );
    });
  });

  describe("FR-4: parseLinkedIssues", () => {
    test("extracts issue numbers from PR body", () => {
      const prBody = `
        Fixes #123
        Closes #456 and #789
        Resolves #1000
      `;

      const result = allocator.parseLinkedIssues(prBody);
      expect(result).toEqual([123, 456, 789, 1000]);
    });

    test("deduplicates issue numbers", () => {
      const prBody = `
        Fixes #100
        Closes #100
      `;

      const result = allocator.parseLinkedIssues(prBody);
      expect(result).toEqual([100]);
    });
  });

  describe("FR-2 & FR-3: allocation", () => {
    test("allocates PR to milestone", async () => {
      const prData = {
        number: 100,
        milestone: null,
      };

      mockOctokit.rest.pulls.get.mockResolvedValue({ data: prData });
      mockOctokit.rest.pulls.update.mockResolvedValue({});

      const result = await allocator.allocatePR(100, { number: 15 });
      expect(result.status).toBe("allocated");
    });

    test("allocates issue to milestone", async () => {
      const issueData = {
        number: 50,
        milestone: null,
      };

      mockOctokit.rest.issues.get.mockResolvedValue({ data: issueData });
      mockOctokit.rest.issues.update.mockResolvedValue({});

      const result = await allocator.allocateIssue(50, { number: 15 });
      expect(result.status).toBe("allocated");
    });
  });
});
