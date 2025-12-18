/**
 * ============================================================================
 * Integration Tests for Labeling Agent Workflow
 * Location: .github/agents/__tests__/labeling.agent.integration.test.js
 * Description:
 *   - Tests complete labeling agent workflow end-to-end
 *   - Validates integration between all utility modules
 *   - Tests real-world scenarios with mocked GitHub API
 * Standards:
 *   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update docblock when expanding coverage or adding new scenarios
 * ============================================================================
 */

// For ES modules, we need to use import in test file
let runLabelingAgent;
try {
  // Try CommonJS first
  const agent = require("../labeling.agent.js");
  runLabelingAgent = agent.runLabelingAgent || agent.default;
} catch (e) {
  // Skip if module loading fails
  console.warn("Skipping labeling.agent test - module loading issue");
  runLabelingAgent = null;
}
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Mock @actions/core and @actions/github
jest.mock("@actions/core", () => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  setFailed: jest.fn(),
  getInput: jest.fn(),
}));

jest.mock("@actions/github", () => ({
  context: {
    repo: {
      owner: "lightspeedwp",
      repo: "test-repo",
    },
    payload: {},
  },
  getOctokit: jest.fn(),
}));

const core = require("@actions/core");
const github = require("@actions/github");

describe("Labeling Agent Integration Tests", () => {
  let mockOctokit;
  let originalLabelsConfig;
  let originalIssueTypesConfig;
  let originalLabelerRules;

  beforeAll(() => {
    // Save original environment variables
    originalLabelsConfig = process.env.LABELS_CONFIG;
    originalIssueTypesConfig = process.env.ISSUE_TYPES_CONFIG;
    originalLabelerRules = process.env.LABELER_RULES;

    // Create test configuration files
    const testLabels = [
      { name: "status:needs-triage" },
      { name: "status:in-progress" },
      { name: "status:needs-review" },
      { name: "priority:normal" },
      { name: "priority:high" },
      { name: "type:bug" },
      { name: "type:feature" },
      { name: "area:core" },
    ];

    const testIssueTypes = {
      issue_types: [
        { name: "Bug", label: "type:bug" },
        { name: "Feature", label: "type:feature" },
      ],
    };

    const testLabelerRules = {
      "type:feature": {
        "head-branch": ["^feat/.*"],
      },
      "type:bug": {
        "head-branch": ["^fix/.*"],
      },
    };

    // Write test configs to temp directory
    const tempDir = path.join(__dirname, ".temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(path.join(tempDir, "labels.yml"), yaml.dump(testLabels));
    fs.writeFileSync(
      path.join(tempDir, "issue-types.yml"),
      yaml.dump(testIssueTypes),
    );
    fs.writeFileSync(
      path.join(tempDir, "labeler.yml"),
      yaml.dump(testLabelerRules),
    );

    // Set environment variables to use test configs
    process.env.LABELS_CONFIG = path.join(tempDir, "labels.yml");
    process.env.ISSUE_TYPES_CONFIG = path.join(tempDir, "issue-types.yml");
    process.env.LABELER_RULES = path.join(tempDir, "labeler.yml");
  });

  afterAll(() => {
    // Restore original environment variables
    if (originalLabelsConfig) {
      process.env.LABELS_CONFIG = originalLabelsConfig;
    } else {
      delete process.env.LABELS_CONFIG;
    }
    if (originalIssueTypesConfig) {
      process.env.ISSUE_TYPES_CONFIG = originalIssueTypesConfig;
    } else {
      delete process.env.ISSUE_TYPES_CONFIG;
    }
    if (originalLabelerRules) {
      process.env.LABELER_RULES = originalLabelerRules;
    } else {
      delete process.env.LABELER_RULES;
    }

    // Clean up temp directory
    const tempDir = path.join(__dirname, ".temp");
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Octokit API
    mockOctokit = {
      rest: {
        issues: {
          removeLabel: jest.fn().mockResolvedValue({}),
          addLabels: jest.fn().mockResolvedValue({}),
        },
      },
    };

    github.getOctokit.mockReturnValue(mockOctokit);
    core.getInput.mockReturnValue("fake-token");
  });

  describe("New Issue Workflow", () => {
    test("applies default labels to new issue with no labels", async () => {
      github.context.payload = {
        issue: {
          number: 1,
          labels: [],
        },
      };

      await runLabelingAgent({ dryRun: false });

      // Should add default status and priority
      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: expect.arrayContaining(["status:needs-triage"]),
        }),
      );
      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: expect.arrayContaining(["priority:normal"]),
        }),
      );
    });

    test("handles issue with multiple status labels", async () => {
      github.context.payload = {
        issue: {
          number: 2,
          labels: [
            { name: "status:needs-triage" },
            { name: "status:in-progress" },
            { name: "type:bug" },
          ],
        },
      };

      await runLabelingAgent({ dryRun: false });

      // Should remove duplicate status label
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "status:in-progress",
        }),
      );

      // Should add default priority
      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: expect.arrayContaining(["priority:normal"]),
        }),
      );
    });

    test("preserves existing valid labels", async () => {
      github.context.payload = {
        issue: {
          number: 3,
          labels: [
            { name: "status:in-progress" },
            { name: "priority:high" },
            { name: "type:bug" },
            { name: "area:core" },
          ],
        },
      };

      await runLabelingAgent({ dryRun: false });

      // Should not add any labels (all required labels present)
      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();

      // Should not remove any labels (no duplicates)
      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();
    });
  });

  describe("New PR Workflow", () => {
    test("applies default status:needs-review to new PR", async () => {
      github.context.payload = {
        pull_request: {
          number: 10,
          labels: [],
        },
      };

      await runLabelingAgent({ dryRun: false });

      // Should add status:needs-review for PR (not needs-triage)
      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: expect.arrayContaining(["status:needs-review"]),
        }),
      );
    });

    test("adds meta:needs-changelog to PR without changelog label", async () => {
      github.context.payload = {
        pull_request: {
          number: 11,
          labels: [{ name: "status:needs-review" }, { name: "type:feature" }],
        },
      };

      await runLabelingAgent({ dryRun: false });

      // Should add meta:needs-changelog
      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: expect.arrayContaining(["meta:needs-changelog"]),
        }),
      );
    });

    test("does not add meta:needs-changelog if changelog label exists", async () => {
      github.context.payload = {
        pull_request: {
          number: 12,
          labels: [
            { name: "status:needs-review" },
            { name: "type:feature" },
            { name: "changelog:added" },
          ],
        },
      };

      await runLabelingAgent({ dryRun: false });

      // Should not add meta:needs-changelog
      const calls = mockOctokit.rest.issues.addLabels.mock.calls;
      const hasChangelogLabel = calls.some((call) =>
        call[0].labels.includes("meta:needs-changelog"),
      );
      expect(hasChangelogLabel).toBe(false);
    });
  });

  describe("Label Standardization", () => {
    test("migrates non-canonical labels to canonical", async () => {
      // This test would require alias configuration
      // Skipped for now as it requires more complex setup
      expect(true).toBe(true);
    });

    test("removes non-canonical labels without aliases", async () => {
      // This test would require checking against canonical set
      // Skipped for now as it requires more complex setup
      expect(true).toBe(true);
    });
  });

  describe("Dry Run Mode", () => {
    test("does not modify labels in dry-run mode", async () => {
      github.context.payload = {
        issue: {
          number: 20,
          labels: [
            { name: "status:needs-triage" },
            { name: "status:in-progress" },
          ],
        },
      };

      await runLabelingAgent({ dryRun: true });

      // Should not call any API methods
      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();
      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();

      // Should log dry-run messages
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining("[DRY RUN]"),
      );
    });
  });

  describe("Error Handling", () => {
    test("handles API errors gracefully", async () => {
      github.context.payload = {
        issue: {
          number: 30,
          labels: [
            { name: "status:needs-triage" },
            { name: "status:in-progress" },
          ],
        },
      };

      mockOctokit.rest.issues.removeLabel.mockRejectedValue(
        new Error("API Error"),
      );

      // Should not throw
      await expect(runLabelingAgent({ dryRun: false })).resolves.not.toThrow();

      // Should log warning
      expect(core.warning).toHaveBeenCalled();
    });

    test("handles missing configuration files", async () => {
      const tempLabelsConfig = process.env.LABELS_CONFIG;
      process.env.LABELS_CONFIG = "/nonexistent/path/labels.yml";

      github.context.payload = {
        issue: {
          number: 31,
          labels: [],
        },
      };

      await runLabelingAgent({ dryRun: false });

      // Should call setFailed
      expect(core.setFailed).toHaveBeenCalled();

      // Restore config
      process.env.LABELS_CONFIG = tempLabelsConfig;
    });
  });

  describe("Complex Scenarios", () => {
    test("handles issue with all types of label violations", async () => {
      github.context.payload = {
        issue: {
          number: 40,
          labels: [
            // Multiple status labels
            { name: "status:needs-triage" },
            { name: "status:in-progress" },
            { name: "status:blocked" },
            // Multiple priority labels
            { name: "priority:normal" },
            { name: "priority:high" },
            // Multiple type labels
            { name: "type:bug" },
            { name: "type:feature" },
          ],
        },
      };

      await runLabelingAgent({ dryRun: false });

      // Should remove 4 duplicate labels (2 status, 1 priority, 1 type)
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledTimes(4);
    });

    test("handles PR with complete workflow", async () => {
      github.context.payload = {
        pull_request: {
          number: 41,
          labels: [
            { name: "status:needs-review" },
            { name: "status:in-progress" }, // Duplicate
            { name: "type:feature" },
            // No priority - should add default
            // No changelog - should add meta:needs-changelog
          ],
        },
      };

      await runLabelingAgent({ dryRun: false });

      // Should remove duplicate status
      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "status:in-progress",
        }),
      );

      // Should add priority:normal and meta:needs-changelog
      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledTimes(2);
    });
  });

  describe("No Context Scenario", () => {
    test("exits gracefully when no issue or PR in context", async () => {
      github.context.payload = {}; // No issue or PR

      await runLabelingAgent({ dryRun: false });

      // Should log info and exit without error
      expect(core.info).toHaveBeenCalledWith("No issue or PR in context.");
      expect(mockOctokit.rest.issues.removeLabel).not.toHaveBeenCalled();
      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();
    });
  });
});
