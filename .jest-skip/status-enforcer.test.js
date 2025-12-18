/**
 * ============================================================================
 * Tests for status-enforcer utility functions
 * Location: .github/agents/includes/__tests__/status-enforcer.test.js
 * Description:
 *   - Tests status enforcement functions: enforceOneHotStatus, applyDefaultStatus, applyDefaultPriority
 *   - Uses mocked GitHub API for testing label operations
 *   - Coverage: one-hot enforcement, default label application, dry-run mode
 * Standards:
 *   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update docblock when expanding coverage or adding new helpers
 * ============================================================================
 */

const {
  enforceOneHotLabels,
  enforceOneHotStatus, // backward compatibility alias
  applyDefaultStatus,
  applyDefaultPriority,
  applyDefaultType,
} = require("../status-enforcer");

// Mock @actions/core
jest.mock("@actions/core", () => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
}));

const core = require("@actions/core");

describe("status-enforcer.js", () => {
  let mockGithub;
  let mockOctokit;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock GitHub API
    mockOctokit = {
      rest: {
        issues: {
          removeLabel: jest.fn().mockResolvedValue({}),
          addLabels: jest.fn().mockResolvedValue({}),
        },
      },
    };

    mockGithub = mockOctokit;
  });

  describe("enforceOneHotLabels (and backward-compatible enforceOneHotStatus)", () => {
    const baseParams = {
      github: mockGithub,
      owner: "lightspeedwp",
      repo: "test-repo",
      number: 123,
      dryRun: false,
    };

    test("keeps only one status label when multiple exist", async () => {
      const currentLabels = [
        "status:needs-triage",
        "status:in-progress",
        "status:blocked",
        "type:bug",
      ];

      await enforceOneHotLabels({ ...baseParams, currentLabels });

      // Should remove all but the first status label
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledTimes(2);
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        name: "status:in-progress",
      });
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        name: "status:blocked",
      });
    });

    test("backward compatibility: enforceOneHotStatus still works", async () => {
      const currentLabels = ["status:needs-triage", "status:in-progress"];

      await enforceOneHotStatus({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledTimes(1);
    });

    test("keeps only one priority label when multiple exist", async () => {
      const currentLabels = [
        "priority:critical",
        "priority:normal",
        "priority:minor",
      ];

      await enforceOneHotLabels({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledTimes(2);
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        name: "priority:normal",
      });
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        name: "priority:minor",
      });
    });

    test("keeps only one type label when multiple exist", async () => {
      const currentLabels = ["type:bug", "type:feature", "type:task"];

      await enforceOneHotLabels({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledTimes(2);
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        name: "type:feature",
      });
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        name: "type:task",
      });
    });

    test("handles multiple categories with duplicates", async () => {
      const currentLabels = [
        "status:needs-triage",
        "status:in-progress",
        "priority:high",
        "priority:normal",
        "type:bug",
        "type:feature",
        "area:core",
      ];

      await enforceOneHotLabels({ ...baseParams, currentLabels });

      // Should remove 4 labels total (2 status + 1 priority + 1 type)
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledTimes(4);
    });

    test("does nothing when only one label per category exists", async () => {
      const currentLabels = [
        "status:in-progress",
        "priority:normal",
        "type:bug",
        "area:core",
      ];

      await enforceOneHotLabels({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();
    });

    test("handles labels with no category prefixes", async () => {
      const currentLabels = [
        "good-first-issue",
        "help-wanted",
        "documentation",
      ];

      await enforceOneHotLabels({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();
    });

    test("respects dry-run mode", async () => {
      const currentLabels = [
        "status:needs-triage",
        "status:in-progress",
        "status:blocked",
      ];

      await enforceOneHotLabels({
        ...baseParams,
        currentLabels,
        dryRun: true,
      });

      // Should not call API in dry-run mode
      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();

      // Should still log what would be done
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining("[DRY RUN]"),
      );
    });

    test("handles empty labels array", async () => {
      const currentLabels = [];

      await enforceOneHotLabels({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();
    });

    test("handles API errors gracefully", async () => {
      const currentLabels = ["status:needs-triage", "status:in-progress"];

      mockOctokit.rest.issues.removeLabel.mockRejectedValueOnce(
        new Error("API Error"),
      );

      await enforceOneHotLabels({ ...baseParams, currentLabels });

      expect(core.warning).toHaveBeenCalledWith(
        expect.stringContaining("Failed to remove label"),
      );
    });

    test("handles 404 errors silently (label already removed)", async () => {
      const currentLabels = ["status:needs-triage", "status:in-progress"];

      const error404 = new Error("Not Found");
      error404.status = 404;
      mockOctokit.rest.issues.removeLabel.mockRejectedValueOnce(error404);

      await enforceOneHotLabels({ ...baseParams, currentLabels });

      // Should not log warning for 404 errors
      expect(core.warning).not.toHaveBeenCalled();
    });
  });

  describe("applyDefaultStatus", () => {
    const baseParams = {
      github: mockGithub,
      owner: "lightspeedwp",
      repo: "test-repo",
      number: 123,
      dryRun: false,
    };

    test("applies status:needs-triage for issues without status", async () => {
      const currentLabels = ["type:bug", "priority:normal"];

      await applyDefaultStatus({
        ...baseParams,
        currentLabels,
        isPR: false,
      });

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        labels: ["status:needs-triage"],
      });
    });

    test("applies status:needs-review for PRs without status", async () => {
      const currentLabels = ["type:feature", "priority:normal"];

      await applyDefaultStatus({
        ...baseParams,
        currentLabels,
        isPR: true,
      });

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        labels: ["status:needs-review"],
      });
    });

    test("does not add status if one already exists", async () => {
      const currentLabels = ["status:in-progress", "type:bug"];

      await applyDefaultStatus({
        ...baseParams,
        currentLabels,
        isPR: false,
      });

      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();
    });

    test("handles empty labels array", async () => {
      const currentLabels = [];

      await applyDefaultStatus({
        ...baseParams,
        currentLabels,
        isPR: false,
      });

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        labels: ["status:needs-triage"],
      });
    });

    test("respects dry-run mode", async () => {
      const currentLabels = ["type:bug"];

      await applyDefaultStatus({
        ...baseParams,
        currentLabels,
        isPR: false,
        dryRun: true,
      });

      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining("[DRY RUN]"),
      );
    });

    test("handles API errors gracefully", async () => {
      const currentLabels = ["type:bug"];

      mockOctokit.rest.issues.addLabels.mockRejectedValueOnce(
        new Error("API Error"),
      );

      await applyDefaultStatus({
        ...baseParams,
        currentLabels,
        isPR: false,
      });

      expect(core.warning).toHaveBeenCalledWith(
        expect.stringContaining("Failed to add default status label"),
      );
    });

    test("defaults to issue behavior when isPR not specified", async () => {
      const currentLabels = ["type:bug"];

      await applyDefaultStatus({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        labels: ["status:needs-triage"],
      });
    });
  });

  describe("applyDefaultPriority", () => {
    const baseParams = {
      github: mockGithub,
      owner: "lightspeedwp",
      repo: "test-repo",
      number: 123,
      dryRun: false,
    };

    test("applies priority:normal when no priority exists", async () => {
      const currentLabels = ["status:in-progress", "type:bug"];

      await applyDefaultPriority({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        labels: ["priority:normal"],
      });
    });

    test("does not add priority if one already exists", async () => {
      const currentLabels = ["status:in-progress", "priority:high", "type:bug"];

      await applyDefaultPriority({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();
    });

    test("handles empty labels array", async () => {
      const currentLabels = [];

      await applyDefaultPriority({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        labels: ["priority:normal"],
      });
    });

    test("respects dry-run mode", async () => {
      const currentLabels = ["status:in-progress", "type:bug"];

      await applyDefaultPriority({
        ...baseParams,
        currentLabels,
        dryRun: true,
      });

      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining("[DRY RUN]"),
      );
    });

    test("handles API errors gracefully", async () => {
      const currentLabels = ["type:bug"];

      mockOctokit.rest.issues.addLabels.mockRejectedValueOnce(
        new Error("API Error"),
      );

      await applyDefaultPriority({ ...baseParams, currentLabels });

      expect(core.warning).toHaveBeenCalledWith(
        expect.stringContaining("Failed to add default priority label"),
      );
    });

    test("works with any existing priority level", async () => {
      const priorityLevels = [
        "priority:critical",
        "priority:important",
        "priority:normal",
        "priority:minor",
      ];

      for (const priority of priorityLevels) {
        jest.clearAllMocks();
        const currentLabels = ["status:in-progress", priority];

        await applyDefaultPriority({ ...baseParams, currentLabels });

        expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();
      }
    });
  });

  describe("applyDefaultType", () => {
    const baseParams = {
      github: mockGithub,
      owner: "lightspeedwp",
      repo: "test-repo",
      number: 123,
      dryRun: false,
    };

    test("applies type:task for issues without type", async () => {
      const currentLabels = ["status:needs-triage", "priority:normal"];

      await applyDefaultType({
        ...baseParams,
        currentLabels,
        isPR: false,
      });

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        labels: ["type:task"],
      });
    });

    test("applies type:chore for PRs without type", async () => {
      const currentLabels = ["status:needs-review", "priority:normal"];

      await applyDefaultType({
        ...baseParams,
        currentLabels,
        isPR: true,
      });

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        labels: ["type:chore"],
      });
    });

    test("does not add type if one already exists", async () => {
      const currentLabels = ["status:in-progress", "type:bug"];

      await applyDefaultType({
        ...baseParams,
        currentLabels,
        isPR: false,
      });

      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();
    });

    test("handles empty labels array", async () => {
      const currentLabels = [];

      await applyDefaultType({
        ...baseParams,
        currentLabels,
        isPR: false,
      });

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        labels: ["type:task"],
      });
    });

    test("respects dry-run mode", async () => {
      const currentLabels = ["status:needs-triage"];

      await applyDefaultType({
        ...baseParams,
        currentLabels,
        isPR: false,
        dryRun: true,
      });

      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining("[DRY RUN]"),
      );
    });

    test("handles API errors gracefully", async () => {
      const currentLabels = ["status:needs-triage"];

      mockOctokit.rest.issues.addLabels.mockRejectedValueOnce(
        new Error("API Error"),
      );

      await applyDefaultType({
        ...baseParams,
        currentLabels,
        isPR: false,
      });

      expect(core.warning).toHaveBeenCalledWith(
        expect.stringContaining("Failed to add default type label"),
      );
    });

    test("works with all type labels", async () => {
      const typeLabelsList = [
        "type:bug",
        "type:feature",
        "type:task",
        "type:chore",
        "type:documentation",
        "type:refactor",
      ];

      for (const typeLabel of typeLabelsList) {
        jest.clearAllMocks();
        const currentLabels = ["status:in-progress", typeLabel];

        await applyDefaultType({ ...baseParams, currentLabels });

        expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();
      }
    });
  });

  describe("integration scenarios", () => {
    const baseParams = {
      github: mockGithub,
      owner: "lightspeedwp",
      repo: "test-repo",
      number: 123,
      dryRun: false,
    };

    test("complete workflow: enforce one-hot, then apply defaults", async () => {
      // Start with multiple status labels and no priority
      let currentLabels = [
        "status:needs-triage",
        "status:in-progress",
        "type:bug",
      ];

      // Step 1: Enforce one-hot
      await enforceOneHotLabels({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledTimes(1);

      // Update labels after enforcement
      currentLabels = ["status:needs-triage", "type:bug"];

      // Step 2: Apply default status (should do nothing)
      await applyDefaultStatus({
        ...baseParams,
        currentLabels,
        isPR: false,
      });

      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();

      // Step 3: Apply default priority
      await applyDefaultPriority({ ...baseParams, currentLabels });

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: "test-repo",
        issue_number: 123,
        labels: ["priority:normal"],
      });
    });

    test("handles new issue with no labels", async () => {
      const currentLabels = [];

      await enforceOneHotLabels({ ...baseParams, currentLabels });
      await applyDefaultStatus({
        ...baseParams,
        currentLabels,
        isPR: false,
      });
      await applyDefaultPriority({ ...baseParams, currentLabels });
      await applyDefaultType({
        ...baseParams,
        currentLabels,
        isPR: false,
      });

      // Should add status, priority, and type
      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledTimes(3);
      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();
    });

    test("handles new PR with no labels", async () => {
      const currentLabels = [];

      await enforceOneHotLabels({ ...baseParams, currentLabels });
      await applyDefaultStatus({
        ...baseParams,
        currentLabels,
        isPR: true,
      });
      await applyDefaultPriority({ ...baseParams, currentLabels });
      await applyDefaultType({
        ...baseParams,
        currentLabels,
        isPR: true,
      });

      // Should add status:needs-review, priority:normal, and type:chore
      const calls = mockOctokit.rest.issues.addLabels.mock.calls;
      expect(calls).toHaveLength(3);
      expect(calls[0][0].labels).toEqual(["status:needs-review"]);
      expect(calls[1][0].labels).toEqual(["priority:normal"]);
      expect(calls[2][0].labels).toEqual(["type:chore"]);
    });

    test("dry-run mode for complete workflow", async () => {
      const currentLabels = ["status:needs-triage", "status:in-progress"];

      await enforceOneHotLabels({
        ...baseParams,
        currentLabels,
        dryRun: true,
      });
      await applyDefaultStatus({
        ...baseParams,
        currentLabels: ["status:needs-triage"],
        isPR: false,
        dryRun: true,
      });
      await applyDefaultPriority({
        ...baseParams,
        currentLabels: ["status:needs-triage"],
        dryRun: true,
      });

      // Should not call any API methods
      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();
      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();

      // Should log dry-run messages
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining("[DRY RUN]"),
      );
    });
  });

  describe("error handling and edge cases", () => {
    const baseParams = {
      github: mockGithub,
      owner: "lightspeedwp",
      repo: "test-repo",
      number: 123,
      dryRun: false,
    };

    test("handles network failures during enforcement", async () => {
      const currentLabels = ["status:needs-triage", "status:in-progress"];

      mockOctokit.rest.issues.removeLabel.mockRejectedValue(
        new Error("Network error"),
      );

      await enforceOneHotLabels({ ...baseParams, currentLabels });

      expect(core.warning).toHaveBeenCalled();
    });

    test("handles network failures during default application", async () => {
      const currentLabels = ["type:bug"];

      mockOctokit.rest.issues.addLabels.mockRejectedValue(
        new Error("Network error"),
      );

      await applyDefaultStatus({
        ...baseParams,
        currentLabels,
        isPR: false,
      });
      await applyDefaultPriority({ ...baseParams, currentLabels });

      expect(core.warning).toHaveBeenCalledTimes(2);
    });

    test("handles malformed label names gracefully", async () => {
      const currentLabels = ["status:", "priority:", "type:", ":malformed", ""];

      await enforceOneHotLabels({ ...baseParams, currentLabels });

      // Should handle without crashing
      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();
    });

    test("handles very long label lists", async () => {
      const currentLabels = [];

      // Add 100 status labels
      for (let i = 0; i < 100; i++) {
        currentLabels.push(`status:custom-${i}`);
      }

      const start = Date.now();
      await enforceOneHotLabels({ ...baseParams, currentLabels });
      const duration = Date.now() - start;

      // Should remove 99 labels (keep first, remove rest)
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledTimes(99);

      // Should complete reasonably quickly
      expect(duration).toBeLessThan(5000);
    });
  });
});
/**
 * Tests for status-enforcer canonical utility.
 * Moved from `tests/utility/status-enforcer.test.js` to consolidate under agents/includes.
 * TODO: Consider adding negative tests (duplicate status removal) & dry-run scenarios.
 */
// Removed unused variable path

describe("status-enforcer (canonical)", () => {
  it("loads without error", () => {
    expect(() => require("../status-enforcer")).not.toThrow();
  });

  it("exports expected functions", () => {
    const mod = require("../status-enforcer");
    expect(typeof mod.enforceOneHotStatus).toBe("function");
    expect(typeof mod.applyDefaultStatus).toBe("function");
    expect(typeof mod.applyDefaultPriority).toBe("function");
  });
});
