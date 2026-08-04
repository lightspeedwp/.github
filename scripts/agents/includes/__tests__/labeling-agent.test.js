/**
 * Unit tests for LabelingAgent
 * Tests type detection, area routing, priority extraction, and batch processing
 */

const { LabelingAgent } = require("../labeling-agent.js");

describe("LabelingAgent", () => {
  let agent;
  let mockGithub;

  beforeEach(() => {
    mockGithub = {
      paginate: jest.fn(),
      rest: {
        issues: {
          listLabels: jest.fn(),
          update: jest.fn(),
        },
      },
    };

    agent = new LabelingAgent(mockGithub, "owner", "repo");
  });

  describe("Type Detection", () => {
    it("should detect bug type from root cause keyword", () => {
      const issue = {
        number: 100,
        title: "Bug in authentication module",
        body: "## Root Cause\nDatabase connection timeout",
        labels: [],
      };

      const result = agent.detectType(issue);
      expect(result).toBeDefined();
      expect(result.label).toBe("type:bug");
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it("should detect feature type from acceptance criteria", () => {
      const issue = {
        number: 101,
        title: "Add two-factor authentication",
        body: "## Acceptance Criteria\n- Support TOTP tokens\n- Email recovery codes",
        labels: [],
      };

      const result = agent.detectType(issue);
      expect(result).toBeDefined();
      expect(result.label).toBe("type:feature");
    });

    it("should detect task type from simple keywords", () => {
      const issue = {
        number: 102,
        title: "Update dependencies",
        body: "## Steps\n1. Run npm update\n2. Test",
        labels: [],
      };

      const result = agent.detectType(issue);
      expect(result).toBeDefined();
      expect(result.label).toBe("type:task");
    });

    it("should detect epic type from initiative keywords", () => {
      const issue = {
        number: 103,
        title: "Epic: Migrate to TypeScript",
        body: "## User Stories\n- As a developer...",
        labels: [],
      };

      const result = agent.detectType(issue);
      expect(result).toBeDefined();
      expect(result.label).toBe("type:epic");
    });

    it("should detect documentation type", () => {
      const issue = {
        number: 104,
        title: "Add API documentation",
        body: "## Documentation\nComplete API reference",
        labels: [],
      };

      const result = agent.detectType(issue);
      expect(result).toBeDefined();
      expect(result.label).toBe("type:documentation");
    });

    it("should detect design type from accessibility keywords", () => {
      const issue = {
        number: 105,
        title: "Accessibility audit for dashboard",
        body: "WCAG 2.2 AA compliance check needed",
        labels: [],
      };

      const result = agent.detectType(issue);
      expect(result).toBeDefined();
      expect(result.label).toBe("type:design");
    });

    it("should return null for unrecognized type", () => {
      const issue = {
        number: 106,
        title: "Random issue",
        body: "No specific type indicators",
        labels: [],
      };

      const result = agent.detectType(issue);
      expect(result).toBeNull();
    });

    it("should handle missing body gracefully", () => {
      const issue = {
        number: 107,
        title: "Bug in authentication",
        body: null,
        labels: [],
      };

      const result = agent.detectType(issue);
      expect(result).toBeDefined();
    });
  });

  describe("Area Detection", () => {
    it("should detect CI area from workflow keywords", () => {
      const issue = {
        number: 200,
        title: "Fix GitHub Actions workflow",
        body: "The CI/CD workflow is failing",
        labels: [],
      };

      const areas = agent.detectAreas(issue);
      expect(areas).toContainEqual(
        expect.objectContaining({ label: "area:ci" }),
      );
    });

    it("should detect scripts area from automation keywords", () => {
      const issue = {
        number: 201,
        title: "Fix automation script",
        body: "The node script is broken",
        labels: [],
      };

      const areas = agent.detectAreas(issue);
      expect(areas).toContainEqual(
        expect.objectContaining({ label: "area:scripts" }),
      );
    });

    it("should detect tests area from coverage keywords", () => {
      const issue = {
        number: 202,
        title: "Add unit tests for module",
        body: "Need to improve test coverage",
        labels: [],
      };

      const areas = agent.detectAreas(issue);
      expect(areas).toContainEqual(
        expect.objectContaining({ label: "area:tests" }),
      );
    });

    it("should detect multiple areas for single issue", () => {
      const issue = {
        number: 203,
        title: "Add test coverage to CI workflow",
        body: "Update GitHub Actions workflow with better test coverage",
        labels: [],
      };

      const areas = agent.detectAreas(issue);
      expect(areas.length).toBeGreaterThanOrEqual(2);
      expect(areas.map((a) => a.label)).toContain("area:ci");
      expect(areas.map((a) => a.label)).toContain("area:tests");
    });

    it("should detect governance area", () => {
      const issue = {
        number: 204,
        title: "Update governance policy",
        body: "Enforce new rules in AGENTS.md",
        labels: [],
      };

      const areas = agent.detectAreas(issue);
      expect(areas).toContainEqual(
        expect.objectContaining({ label: "area:governance" }),
      );
    });

    it("should return empty array when no areas match", () => {
      const issue = {
        number: 205,
        title: "Generic issue",
        body: "No area-specific keywords",
        labels: [],
      };

      const areas = agent.detectAreas(issue);
      expect(Array.isArray(areas)).toBe(true);
    });
  });

  describe("Priority Detection", () => {
    it("should detect urgent priority", () => {
      const issue = {
        number: 300,
        title: "Critical: Production database down",
        body: "Urgent - all systems affected",
        labels: [],
      };

      const result = agent.detectPriority(issue);
      expect(result).toBeDefined();
      expect(result.label).toBe("priority:urgent");
    });

    it("should detect high priority", () => {
      const issue = {
        number: 301,
        title: "High priority security patch needed",
        body: "Important security update",
        labels: [],
      };

      const result = agent.detectPriority(issue);
      expect(result).toBeDefined();
      expect(result.label).toBe("priority:high");
    });

    it("should detect low priority", () => {
      const issue = {
        number: 302,
        title: "Nice-to-have cosmetic improvement",
        body: "This would be nice in the future",
        labels: [],
      };

      const result = agent.detectPriority(issue);
      expect(result).toBeDefined();
      expect(result.label).toBe("priority:low");
    });

    it("should not override existing priority labels", () => {
      const issue = {
        number: 303,
        title: "Critical issue",
        body: "Urgent urgent urgent",
        labels: [{ name: "priority:low" }],
      };

      const result = agent.detectPriority(issue);
      expect(result).toBeNull();
    });

    it("should return null when no priority keywords found", () => {
      const issue = {
        number: 304,
        title: "Regular maintenance task",
        body: "Standard update",
        labels: [],
      };

      const result = agent.detectPriority(issue);
      expect(result).toBeNull();
    });
  });

  describe("assignLabels", () => {
    it("should collect all detected labels", async () => {
      const issue = {
        number: 400,
        title: "Critical bug in authentication - needs urgent fix",
        body: "## Root Cause\nDatabase connection issue in CI/CD pipeline",
        labels: [],
      };

      const result = await agent.assignLabels(issue, { dryRun: true });

      expect(result.number).toBe(400);
      expect(result.status).toBe("dry-run-preview");
      expect(result.labelsDetected.length).toBeGreaterThan(0);
      expect(result.labelsDetected.map((l) => l.label)).toContain("type:bug");
    });

    it("should apply labels in non-dry-run mode", async () => {
      mockGithub.rest.issues.update.mockResolvedValue({});

      const issue = {
        number: 401,
        title: "Fix workflow",
        body: "## Root Cause\nAction failed",
        labels: [],
      };

      await agent.assignLabels(issue, { dryRun: false });

      expect(mockGithub.rest.issues.update).toHaveBeenCalled();
    });

    it("should handle API errors gracefully", async () => {
      mockGithub.rest.issues.update.mockRejectedValue(new Error("API Error"));

      const issue = {
        number: 402,
        title: "Test issue",
        body: "",
        labels: [],
      };

      const result = await agent.assignLabels(issue, { dryRun: false });

      expect(result.status).toBe("error");
      expect(result.error).toContain("API Error");
    });

    it("should preserve existing labels when adding new ones", async () => {
      mockGithub.rest.issues.update.mockResolvedValue({});

      const issue = {
        number: 403,
        title: "Bug in workflow",
        body: "## Root Cause\nAction failed",
        labels: [{ name: "priority:high" }],
      };

      await agent.assignLabels(issue, { dryRun: false });

      const callArgs = mockGithub.rest.issues.update.mock.calls[0][0];
      expect(callArgs.labels).toContain("priority:high");
    });
  });

  describe("bulkAssignLabels", () => {
    it("should process multiple issues", async () => {
      const issues = [
        {
          number: 500,
          title: "Bug in feature",
          body: "## Root Cause\nIssue found",
          labels: [],
        },
        {
          number: 501,
          title: "Add new feature",
          body: "## Acceptance Criteria\nShould do X",
          labels: [],
        },
      ];

      const results = await agent.bulkAssignLabels(issues, { dryRun: true });

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe("dry-run-preview");
      expect(results[1].status).toBe("dry-run-preview");
    });

    it("should process issues in batches", async () => {
      const issues = Array.from({ length: 150 }, (_, i) => ({
        number: 600 + i,
        title: `Issue ${i}`,
        body: "Test body",
        labels: [],
      }));

      const results = await agent.bulkAssignLabels(issues, {
        dryRun: true,
        batchSize: 50,
      });

      expect(results).toHaveLength(150);
    });

    it("should collect errors from individual issues", async () => {
      mockGithub.rest.issues.update.mockRejectedValue(new Error("API Error"));

      const issues = [
        {
          number: 700,
          title: "Test",
          body: "",
          labels: [],
        },
      ];

      const results = await agent.bulkAssignLabels(issues, { dryRun: false });

      expect(results[0].status).toBe("error");
    });
  });

  describe("Report Generation", () => {
    it("should generate accurate report", () => {
      const results = [
        {
          number: 1,
          status: "applied",
          labelsDetected: [{ label: "type:bug" }, { label: "priority:high" }],
        },
        {
          number: 2,
          status: "applied",
          labelsDetected: [{ label: "type:feature" }, { label: "area:ci" }],
        },
        {
          number: 3,
          status: "error",
          error: "API failed",
          labelsDetected: [],
        },
      ];

      const report = agent.generateReport(results);

      expect(report.summary.total).toBe(3);
      expect(report.summary.succeeded).toBe(2);
      expect(report.summary.errors).toBe(1);
      expect(report.summary.typeLabelsApplied).toBe(2);
      expect(report.summary.priorityLabelsApplied).toBe(1);
    });
  });

  describe("Helper Methods", () => {
    it("should match keywords case-insensitively", () => {
      const text = "This is a BUG report";
      const keywords = ["bug", "error"];

      const result = agent.matchesKeywords(text, keywords);
      expect(result).toBe(true);
    });

    it("should not match unrelated keywords", () => {
      const text = "This is a feature request";
      const keywords = ["bug", "error", "crash"];

      const result = agent.matchesKeywords(text, keywords);
      expect(result).toBe(false);
    });
  });

  describe("Label Loading", () => {
    it("should load labels from GitHub", async () => {
      const mockLabels = [
        { name: "type:bug" },
        { name: "type:feature" },
        { name: "area:ci" },
      ];

      mockGithub.paginate.mockResolvedValueOnce(mockLabels);

      const labels = await agent.loadLabels();

      expect(labels).toEqual(["type:bug", "type:feature", "area:ci"]);
    });

    it("should cache loaded labels", async () => {
      const mockLabels = [{ name: "type:bug" }];
      mockGithub.paginate.mockResolvedValueOnce(mockLabels);

      await agent.loadLabels();
      await agent.loadLabels();

      expect(mockGithub.paginate).toHaveBeenCalledTimes(1);
    });

    it("should handle label loading errors gracefully", async () => {
      mockGithub.paginate.mockRejectedValueOnce(new Error("API Error"));

      const labels = await agent.loadLabels();

      expect(Array.isArray(labels)).toBe(true);
      expect(labels).toHaveLength(0);
    });
  });
});
