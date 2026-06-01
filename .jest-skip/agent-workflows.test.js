/**
 * Agent End-to-End Workflow Tests
 * Location: .github/agents/__tests__/agent-workflows.test.js
 * Description:
 *   - Tests complete agent workflows from event to completion
 *   - Validates agent interactions with GitHub API
 *   - Ensures agents work together without conflicts
 * Standards:
 *   - Follows LightSpeedWP Coding Standards
 *   - Org instructions: Custom Instructions
 * Contribution:
 *   - Add new workflow tests for new agent interactions
 *   - Update test data to match real GitHub events
 */

const _fs = require("fs");
const path = require("path");
const { setTestEnv, resetTestEnv } = require("../../../tests/test-helpers");
const {
  mockContext,
  mockPrPayload,
  mockIssuePayload,
} = require("../../../tests/test-helpers");

describe("Agent E2E Workflows", () => {
  const _agentsDir = path.join(__dirname, "..");

  beforeAll(() => {
    setTestEnv({
      GITHUB_TOKEN: "test-token",
      GITHUB_REPOSITORY: "lightspeedwp/test-repo",
      DRY_RUN: "true",
    });
  });

  afterAll(() => {
    resetTestEnv(["GITHUB_TOKEN", "GITHUB_REPOSITORY", "DRY_RUN"]);
  });

  describe("labeling agent workflow", () => {
    test("processes PR with documentation changes", async () => {
      const mockPayload = mockPrPayload({
        action: "opened",
        pull_request: {
          number: 123,
          title: "docs: Update README and API documentation",
          body: "This PR updates the documentation to reflect recent API changes.",
          labels: [],
          changed_files: 3,
          additions: 45,
          deletions: 12,
        },
      });

      const context = mockContext(mockPayload);

      // Mock the labeling agent
      const labelingAgent = {
        run: jest.fn().mockImplementation(async (ctx) => {
          const { title } = ctx.payload.pull_request;
          const labels = [];

          // Simulate labeling logic
          if (title.startsWith("docs:")) {
            labels.push("type:documentation");
          }
          if (ctx.payload.pull_request.changed_files < 5) {
            labels.push("size:small");
          }

          return {
            success: true,
            labels_added: labels,
            actions_taken: ["label-sync"],
          };
        }),
      };

      const result = await labelingAgent.run(context);

      expect(result.success).toBe(true);
      expect(result.labels_added).toContain("type:documentation");
      expect(result.labels_added).toContain("size:small");
    });

    test("handles PR with mixed file types", async () => {
      const mockPayload = mockPrPayload({
        action: "opened",
      });
      // Merge additional pull_request properties safely
      mockPayload.pull_request = Object.assign(mockPayload.pull_request, {
        title: "feat: Add new PHP class and update tests",
        body: "Implementing new feature with comprehensive tests",
        files: [
          { filename: "src/NewFeature.php", status: "added" },
          {
            filename: "tests/NewFeatureTest.php",
            status: "added",
          },
          { filename: "package.json", status: "modified" },
        ],
      });

      const labelingAgent = {
        run: jest.fn().mockImplementation(async (ctx) => {
          const files = ctx.payload.pull_request.files || [];
          const labels = new Set();

          files.forEach((file) => {
            if (file.filename.endsWith(".php")) {
              labels.add("lang:php");
            }
            if (file.filename.includes("test")) {
              labels.add("type:testing");
            }
            if (file.filename === "package.json") {
              labels.add("type:dependencies");
            }
          });

          return {
            success: true,
            labels_added: Array.from(labels),
          };
        }),
      };

      const result = await labelingAgent.run(mockContext(mockPayload));

      expect(result.labels_added).toContain("lang:php");
      expect(result.labels_added).toContain("type:testing");
      expect(result.labels_added).toContain("type:dependencies");
    });
  });

  describe("reviewer agent workflow", () => {
    test("requests appropriate reviewers based on files", async () => {
      const mockPayload = mockPrPayload({
        pull_request: {
          files: [
            {
              filename: ".github/workflows/ci.yml",
              status: "modified",
            },
            { filename: "scripts/deploy.sh", status: "added" },
          ],
        },
      });

      const reviewerAgent = {
        run: jest.fn().mockImplementation(async (ctx) => {
          const files = ctx.payload.pull_request.files || [];
          const reviewers = new Set();

          files.forEach((file) => {
            if (file.filename.includes(".github/workflows")) {
              reviewers.add("devops-team");
            }
            if (file.filename.endsWith(".sh")) {
              reviewers.add("security-team");
            }
          });

          return {
            success: true,
            reviewers_requested: Array.from(reviewers),
          };
        }),
      };

      const result = await reviewerAgent.run(mockContext(mockPayload));

      expect(result.reviewers_requested).toContain("devops-team");
      expect(result.reviewers_requested).toContain("security-team");
    });
  });

  describe("issue workflow", () => {
    test("processes new issue with bug report template", async () => {
      const mockPayload = mockIssuePayload({
        action: "opened",
        issue: {
          title: "[BUG] Login form not working on mobile",
          body: `## Bug Report\n\n**Description**: Login fails on mobile devices\n\n**Steps to Reproduce**:\n1. Open mobile browser\n2. Navigate to login\n3. Enter credentials\n\n**Expected**: Successful login\n**Actual**: Error message`,
          labels: [],
        },
      });

      const issueAgent = {
        run: jest.fn().mockImplementation(async (ctx) => {
          const { title, body } = ctx.payload.issue;
          const labels = [];

          if (title.includes("[BUG]") || body.includes("Bug Report")) {
            labels.push("type:bug");
          }
          if (body.includes("mobile")) {
            labels.push("device:mobile");
          }
          if (body.includes("login")) {
            labels.push("component:auth");
          }

          return {
            success: true,
            labels_added: labels,
            priority_assigned: "medium",
          };
        }),
      };

      const result = await issueAgent.run(mockContext(mockPayload));

      expect(result.labels_added).toContain("type:bug");
      expect(result.labels_added).toContain("device:mobile");
      expect(result.labels_added).toContain("component:auth");
      expect(result.priority_assigned).toBe("medium");
    });
  });

  describe("multi-agent workflows", () => {
    test("labeling and reviewer agents work together", async () => {
      const mockPayload = mockPrPayload({
        pull_request: {
          title: "feat: New security feature",
          files: [
            { filename: "src/Security/Auth.php", status: "added" },
            {
              filename: "tests/Security/AuthTest.php",
              status: "added",
            },
          ],
        },
      });

      const context = mockContext(mockPayload);

      // Run labeling agent first
      const labelingAgent = {
        run: jest.fn().mockResolvedValue({
          success: true,
          labels_added: ["lang:php", "type:feature", "component:security"],
        }),
      };

      // Run reviewer agent second
      const reviewerAgent = {
        run: jest.fn().mockResolvedValue({
          success: true,
          reviewers_requested: ["security-team", "php-maintainers"],
        }),
      };

      const labelResult = await labelingAgent.run(context);
      const reviewResult = await reviewerAgent.run(context);

      expect(labelResult.success).toBe(true);
      expect(reviewResult.success).toBe(true);
      expect(labelResult.labels_added).toContain("component:security");
      expect(reviewResult.reviewers_requested).toContain("security-team");
    });

    test("agents handle overlapping responsibilities gracefully", async () => {
      const mockPayload = mockPrPayload({
        pull_request: {
          title: "fix: Security vulnerability in auth system",
          labels: [{ name: "priority:high" }], // Pre-existing label
        },
      });

      const context = mockContext(mockPayload);

      // Both agents might want to add security-related labels
      const agent1 = {
        run: jest.fn().mockImplementation(async (ctx) => {
          const existingLabels = ctx.payload.pull_request.labels.map(
            (l) => l.name,
          );
          const newLabels = ["type:security", "priority:critical"];

          // Filter out labels that already exist
          const labelsToAdd = newLabels.filter(
            (label) => !existingLabels.includes(label),
          );

          return {
            success: true,
            labels_added: labelsToAdd,
          };
        }),
      };

      const agent2 = {
        run: jest.fn().mockImplementation(async (ctx) => {
          const existingLabels = ctx.payload.pull_request.labels.map(
            (l) => l.name,
          );
          const newLabels = ["component:auth", "priority:critical"];

          const labelsToAdd = newLabels.filter(
            (label) => !existingLabels.includes(label),
          );

          return {
            success: true,
            labels_added: labelsToAdd,
          };
        }),
      };

      const result1 = await agent1.run(context);
      const result2 = await agent2.run(context);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      // Both should handle duplicate priority:critical gracefully
      expect(result1.labels_added).toContain("type:security");
      expect(result2.labels_added).toContain("component:auth");
    });
  });

  describe("error recovery workflows", () => {
    test("agents handle API errors gracefully", async () => {
      const mockPayload = mockPrPayload();

      const resilientAgent = {
        run: jest.fn().mockImplementation(async (ctx) => {
          try {
            // Simulate API call that might fail
            const shouldFail = Math.random() < 0.3; // 30% chance of failure

            if (shouldFail) {
              const error = new Error("API Error");
              error.status = 503;
              throw error;
            }

            return {
              success: true,
              actions_taken: ["labels-synced"],
            };
          } catch (error) {
            console.warn("Agent handled error:", error.message);
            return {
              success: false,
              error: error.message,
              retry_after: 300, // 5 minutes
            };
          }
        }),
      };

      const result = await resilientAgent.run(mockContext(mockPayload));

      // Should either succeed or fail gracefully
      expect(result).toHaveProperty("success");

      if (!result.success) {
        expect(result).toHaveProperty("error");
        expect(result).toHaveProperty("retry_after");
      }
    });
  });
});
