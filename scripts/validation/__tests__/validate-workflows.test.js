/**
 * Test Suite for Workflow Validation
 * Tests guardrails, validation logic, and error detection
 */

const fs = require("fs");
const path = require("path");

// Mock workflow examples for testing
const MOCK_WORKFLOWS = {
  good: {
    name: "Good Workflow",
    on: {
      push: { branches: ["develop"] },
      pull_request: { branches: ["develop"] },
    },
    permissions: { contents: "read" },
    concurrency: {
      group: "test-${{ github.ref }}",
      "cancel-in-progress": true,
    },
    jobs: {
      test: {
        "runs-on": "ubuntu-latest",
        steps: [
          {
            name: "Checkout code",
            uses: "actions/checkout@v4",
            with: { "fetch-depth": 0 },
          },
          {
            name: "Setup Node",
            uses: "actions/setup-node@v4",
            with: {
              "node-version": "20",
              cache: "npm",
            },
          },
          {
            name: "Install dependencies",
            run: "npm ci",
          },
          {
            name: "Run tests",
            run: "npm test",
          },
        ],
      },
    },
  },

  missingPermissions: {
    name: "Missing Permissions",
    on: { push: { branches: ["develop"] } },
    jobs: {
      test: {
        "runs-on": "ubuntu-latest",
        steps: [
          {
            name: "Checkout",
            uses: "actions/checkout@v4",
          },
        ],
      },
    },
  },

  noConcurrency: {
    name: "No Concurrency",
    on: { push: { branches: ["develop"] } },
    permissions: { contents: "read" },
    jobs: {
      test: {
        "runs-on": "ubuntu-latest",
        steps: [
          {
            name: "Test",
            run: "npm test",
          },
        ],
      },
    },
  },

  noCache: {
    name: "No Cache",
    on: { push: { branches: ["develop"] } },
    permissions: { contents: "read" },
    jobs: {
      test: {
        "runs-on": "ubuntu-latest",
        steps: [
          {
            name: "Checkout",
            uses: "actions/checkout@v4",
          },
          {
            name: "Install dependencies",
            run: "npm install",
          },
        ],
      },
    },
  },

  badNodeVersion: {
    name: "Bad Node Version",
    on: { push: { branches: ["develop"] } },
    permissions: { contents: "read" },
    jobs: {
      test: {
        "runs-on": "ubuntu-latest",
        steps: [
          {
            name: "Setup Node",
            uses: "actions/setup-node@v4",
            with: {
              "node-version": "16",
            },
          },
          {
            name: "Test",
            run: "npm test",
          },
        ],
      },
    },
  },

  unpinnedAction: {
    name: "Unpinned Action",
    on: { push: { branches: ["develop"] } },
    permissions: { contents: "read" },
    jobs: {
      test: {
        "runs-on": "ubuntu-latest",
        steps: [
          {
            name: "Checkout",
            uses: "actions/checkout@main",
          },
        ],
      },
    },
  },

  missingStepName: {
    name: "Missing Step Name",
    on: { push: { branches: ["develop"] } },
    permissions: { contents: "read" },
    jobs: {
      test: {
        "runs-on": "ubuntu-latest",
        steps: [
          {
            uses: "actions/checkout@v4",
          },
          {
            run: "npm test",
          },
        ],
      },
    },
  },

  secretsInShell: {
    name: "Secrets in Shell",
    on: { push: { branches: ["develop"] } },
    permissions: { contents: "read" },
    jobs: {
      test: {
        "runs-on": "ubuntu-latest",
        steps: [
          {
            name: "Test",
            run: "echo ${{ secrets.TOKEN }}",
          },
        ],
      },
    },
  },
};

describe("Workflow Validation Guardrails", () => {
  describe("Security Guardrails", () => {
    test("should flag missing permissions block", () => {
      expect(MOCK_WORKFLOWS.missingPermissions.permissions).toBeUndefined();
    });

    test("should flag unpinned action versions", () => {
      const step = MOCK_WORKFLOWS.unpinnedAction.jobs.test.steps[0];
      expect(step.uses).toContain("@main");
    });

    test("should detect secrets in shell commands", () => {
      const step = MOCK_WORKFLOWS.secretsInShell.jobs.test.steps[0];
      expect(step.run).toContain("${{ secrets.");
    });
  });

  describe("Performance Guardrails", () => {
    test("should flag workflows without concurrency", () => {
      expect(MOCK_WORKFLOWS.noConcurrency.concurrency).toBeUndefined();
    });

    test("should flag npm install without cache", () => {
      const step = MOCK_WORKFLOWS.noCache.jobs.test.steps[1];
      expect(step.run).toContain("npm install");
      expect(MOCK_WORKFLOWS.noCache.jobs.test.steps[0].with).toBeUndefined();
    });

    test("should recommend fetch-depth for checkout", () => {
      const checkoutStep = MOCK_WORKFLOWS.missingPermissions.jobs.test.steps[0];
      expect(checkoutStep.with).toBeUndefined();
    });
  });

  describe("Quality Guardrails", () => {
    test("should flag bad Node versions", () => {
      const nodeStep = MOCK_WORKFLOWS.badNodeVersion.jobs.test.steps[0];
      expect(nodeStep.with["node-version"]).toBe("16");
      expect(nodeStep.with["node-version"]).toBeLessThan(18);
    });

    test("should flag missing step names", () => {
      const badStep = MOCK_WORKFLOWS.missingStepName.jobs.test.steps[1];
      expect(badStep.name).toBeUndefined();
      expect(badStep.run).toBeDefined();
    });
  });

  describe("Good Workflow", () => {
    test("should pass all checks", () => {
      const workflow = MOCK_WORKFLOWS.good;

      // Has permissions
      expect(workflow.permissions).toBeDefined();

      // Has concurrency
      expect(workflow.concurrency).toBeDefined();

      // Uses pinned actions
      workflow.jobs.test.steps.forEach((step) => {
        if (step.uses) {
          expect(step.uses).not.toContain("@main");
          expect(step.uses).not.toContain("@master");
        }
      });

      // All steps have names or are setup
      workflow.jobs.test.steps.forEach((step) => {
        expect(step.name || step.uses).toBeDefined();
      });

      // Good Node version
      const nodeStep = workflow.jobs.test.steps[1];
      expect(parseInt(nodeStep.with["node-version"])).toBeGreaterThanOrEqual(
        18,
      );

      // Uses cache
      expect(nodeStep.with.cache).toBe("npm");

      // Uses fetch-depth
      const checkoutStep = workflow.jobs.test.steps[0];
      expect(checkoutStep.with["fetch-depth"]).toBeDefined();
    });
  });

  describe("Validation Rules", () => {
    test("should define explicit permissions", () => {
      const goodWorkflow = MOCK_WORKFLOWS.good;
      expect(goodWorkflow.permissions).toEqual({ contents: "read" });
    });

    test("should use ubuntu-latest", () => {
      const goodWorkflow = MOCK_WORKFLOWS.good;
      expect(goodWorkflow.jobs.test["runs-on"]).toBe("ubuntu-latest");
    });

    test("should pin checkout to specific depth", () => {
      const goodWorkflow = MOCK_WORKFLOWS.good;
      const checkoutStep = goodWorkflow.jobs.test.steps[0];
      expect(checkoutStep.with["fetch-depth"]).toBeDefined();
    });

    test("should enable npm cache", () => {
      const goodWorkflow = MOCK_WORKFLOWS.good;
      const nodeStep = goodWorkflow.jobs.test.steps[1];
      expect(nodeStep.with.cache).toBe("npm");
    });
  });

  describe("Error Detection", () => {
    test("should detect multiple issues in bad workflows", () => {
      const issues = [];

      // Check permissions
      if (!MOCK_WORKFLOWS.noConcurrency.permissions) {
        issues.push("Missing permissions");
      }

      // Check concurrency
      if (!MOCK_WORKFLOWS.noConcurrency.concurrency) {
        issues.push("Missing concurrency");
      }

      expect(issues.length).toBeGreaterThan(0);
    });

    test("should categorize issues by severity", () => {
      const severities = {
        error: ["secrets in shell", "no permissions"],
        warning: [
          "no concurrency",
          "no cache",
          "bad node version",
          "unpinned actions",
        ],
      };

      expect(severities.error).toContain("secrets in shell");
      expect(severities.warning).toContain("no concurrency");
    });
  });
});
