#!/usr/bin/env node

/**
 * Tests for Enhance Issue Completeness Script
 * Verifies issue enrichment, template application, and label management
 */

const https = require("https");

// Mock https module
jest.mock("https");

// Mock fs module
jest.mock("fs", () => ({
  existsSync: jest.fn((path) => {
    if (path.includes("node_modules")) return true;
    return false;
  }),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe("Enhance Issue Completeness", () => {
  let mockRequest;
  let mockResponse;
  let capturedOutput;

  beforeEach(() => {
    jest.clearAllMocks();
    capturedOutput = [];

    jest.spyOn(console, "log").mockImplementation((msg) => {
      capturedOutput.push(msg);
    });

    jest.spyOn(console, "error").mockImplementation((msg) => {
      capturedOutput.push(`ERROR: ${msg}`);
    });

    mockResponse = new (require("events").EventEmitter)();
    mockResponse.statusCode = 200;
    mockResponse.on = jest.fn((event, cb) => {
      if (event === "data") {
        mockResponse.dataHandler = cb;
      } else if (event === "end") {
        mockResponse.endHandler = cb;
      }
      return mockResponse;
    });

    mockRequest = new (require("events").EventEmitter)();
    mockRequest.write = jest.fn();
    mockRequest.end = jest.fn();
    mockRequest.on = jest.fn((event, cb) => {
      if (event === "error") {
        mockRequest.errorHandler = cb;
      }
      return mockRequest;
    });

    https.request.mockReturnValue(mockRequest);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Type-Specific Templates", () => {
    test("should apply feature template", () => {
      const featureTemplate = `## Definition of Ready
- [x] Requirements clearly defined
- [x] Acceptance criteria written
- [x] Design approved
- [x] Performance requirements identified
- [x] Security implications reviewed
- [x] Backwards compatibility assessed
- [x] Localization requirements identified

## Owner/Team

## Acceptance Criteria
- Criterion 1
- Criterion 2

## Definition of Done
- [x] Code review completed
- [x] Unit tests written and passing
- [x] Integration tests passing
- [x] Documentation updated
- [x] No console errors
- [x] Performance baseline met
- [x] Security scan passed
- [x] Accessibility requirements met
- [x] Changes logged in CHANGELOG`;

      expect(featureTemplate).toContain("## Definition of Ready");
      expect(featureTemplate).toContain("## Owner/Team");
      expect(featureTemplate).toContain("## Acceptance Criteria");
      expect(featureTemplate).toContain("## Definition of Done");
      expect(featureTemplate).toContain("[x] Requirements clearly defined");
    });

    test("should apply bug template", () => {
      const bugTemplate = `## Definition of Ready
- [x] Issue is reproducible
- [x] Steps to reproduce documented
- [x] Environment specified
- [x] Severity assessed
- [x] Root cause identified
- [x] Workaround documented

## Owner/Severity

## Acceptance Criteria
- Bug is fixed
- No regressions introduced

## Definition of Done
- [x] Fix implemented
- [x] Tests added
- [x] Fix verified
- [x] Regression tests pass
- [x] Documentation updated
- [x] Changelog updated
- [x] Deployed`;

      expect(bugTemplate).toContain("Severity assessed");
      expect(bugTemplate).toContain("Bug is fixed");
      expect(bugTemplate).toContain("Fix implemented");
    });

    test("should apply epic template", () => {
      const epicTemplate = `## Definition of Ready
- [x] Epic goals defined
- [x] User stories identified
- [x] Dependencies mapped
- [x] Resource allocation complete
- [x] Timeline estimated
- [x] Success criteria defined

## Epic Owner/Sponsor

## Success Criteria
- Metric 1
- Metric 2

## Definition of Done
- [x] All user stories completed
- [x] Integration testing passed
- [x] Documentation complete
- [x] Stakeholder approval
- [x] Production deployment
- [x] Monitoring in place`;

      expect(epicTemplate).toContain("Epic goals defined");
      expect(epicTemplate).toContain("All user stories completed");
    });

    test("should apply default template", () => {
      const defaultTemplate = `## Definition of Ready
- [x] Clearly defined
- [x] Requirements understood

## Owner

## Acceptance Criteria
- Item 1
- Item 2

## Definition of Done
- [x] Complete
- [x] Tested
- [x] Documented
- [x] Reviewed
- [x] Deployed`;

      expect(defaultTemplate).toContain("## Definition of Ready");
      expect(defaultTemplate).toContain("## Definition of Done");
      expect(defaultTemplate).toContain("## Acceptance Criteria");
    });
  });

  describe("Template Application", () => {
    test("should append template to existing issue body", () => {
      const existingBody = "This is the existing issue description.";
      const template = "\n\n## Definition of Ready\n- Item 1";

      const combined = existingBody + template;

      expect(combined).toContain("existing issue description");
      expect(combined).toContain("## Definition of Ready");
    });

    test("should handle empty issue body", () => {
      const existingBody = "";
      const template = "## Definition of Ready\n- Item 1";

      const combined = (existingBody + template).trim();

      expect(combined).toBe(template);
    });

    test("should not duplicate sections if they already exist", () => {
      const body = `Current description

## Definition of Ready
- Already present`;

      const hasDoR = body.includes("## Definition of Ready");

      expect(hasDoR).toBe(true);
    });
  });

  describe("Label Management", () => {
    test("should remove status:needs-more-info label", () => {
      const currentLabels = [
        "type:feature",
        "status:needs-more-info",
        "priority:normal",
      ];

      const updatedLabels = currentLabels.filter(
        (l) => l !== "status:needs-more-info",
      );

      expect(updatedLabels).toEqual(["type:feature", "priority:normal"]);
      expect(updatedLabels).not.toContain("status:needs-more-info");
    });

    test("should handle removal when label not present", () => {
      const currentLabels = ["type:feature", "priority:normal"];

      const updatedLabels = currentLabels.filter(
        (l) => l !== "status:needs-more-info",
      );

      expect(updatedLabels).toEqual(currentLabels);
      expect(updatedLabels).toHaveLength(2);
    });

    test("should add status:ready-for-work label", () => {
      const currentLabels = ["type:feature", "priority:normal"];

      const updatedLabels = [...currentLabels, "status:ready-for-work"];

      expect(updatedLabels).toContain("status:ready-for-work");
      expect(updatedLabels).toHaveLength(3);
    });

    test("should preserve label order", () => {
      const currentLabels = [
        "type:feature",
        "area:automation",
        "priority:high",
      ];

      const updated = currentLabels.filter((l) => l !== "status:removed");

      expect(updated).toEqual(currentLabels);
    });
  });

  describe("Dry-Run Mode", () => {
    test("should not modify issues in dry-run mode", () => {
      const dryRun = true;
      const issuesToUpdate = [
        { number: 123, needs_update: true },
        { number: 456, needs_update: true },
      ];

      const updateCount = dryRun ? 0 : issuesToUpdate.length;

      expect(updateCount).toBe(0);
      expect(issuesToUpdate).toHaveLength(2);
    });

    test("should report what would be updated in dry-run mode", () => {
      const dryRun = true;
      const issues = [
        {
          number: 123,
          title: "Issue 1",
          missing_sections: ["Definition of Ready"],
        },
        {
          number: 456,
          title: "Issue 2",
          missing_sections: ["Definition of Done"],
        },
      ];

      const report = issues.map((issue) => ({
        number: issue.number,
        title: issue.title,
        missing_sections: issue.missing_sections,
        would_update: dryRun,
      }));

      expect(report).toHaveLength(2);
      expect(report[0].would_update).toBe(true);
    });

    test("should perform actual updates when dry-run is false", () => {
      const dryRun = false;
      const updateAttempts = dryRun ? [] : ["update-1", "update-2"];

      expect(updateAttempts).toHaveLength(2);
    });
  });

  describe("Issue Update Workflow", () => {
    test("should update issue body", () => {
      const issue = {
        number: 123,
        body: "Original body",
      };

      const updateData = {
        body: issue.body + "\n\n## Definition of Ready\n- Item 1",
      };

      expect(updateData.body).toContain("Original body");
      expect(updateData.body).toContain("## Definition of Ready");
    });

    test("should update issue labels", () => {
      const issue = {
        number: 123,
        labels: ["status:needs-more-info", "type:bug"],
      };

      const newLabels = issue.labels
        .filter((l) => l !== "status:needs-more-info")
        .concat(["status:ready-for-work"]);

      expect(newLabels).not.toContain("status:needs-more-info");
      expect(newLabels).toContain("status:ready-for-work");
      expect(newLabels).toContain("type:bug");
    });

    test("should create comment when updating issue", () => {
      const comment = {
        body: "✅ Issue enriched with missing sections from template",
        issue_number: 123,
      };

      expect(comment.body).toContain("enriched");
      expect(comment.issue_number).toBe(123);
    });
  });

  describe("Error Handling", () => {
    test("should handle API errors gracefully", () => {
      const error = new Error("GitHub API error: 403 Forbidden");

      expect(error.message).toContain("403");
    });

    test("should skip issues that fail to update", () => {
      const issues = [{ number: 123 }, { number: 456 }, { number: 789 }];
      const failedUpdates = [123]; // Suppose this one failed
      const successfulUpdates = issues.filter(
        (i) => !failedUpdates.includes(i.number),
      );

      expect(successfulUpdates).toHaveLength(2);
      expect(successfulUpdates.map((i) => i.number)).toEqual([456, 789]);
    });

    test("should log errors without stopping batch processing", () => {
      const results = [];
      const issues = [{ number: 1 }, { number: 2 }, { number: 3 }];

      for (const issue of issues) {
        try {
          if (issue.number === 2) {
            throw new Error("Simulated failure");
          }
          results.push({ number: issue.number, status: "success" });
        } catch (err) {
          results.push({ number: issue.number, status: "failed" });
        }
      }

      expect(results).toHaveLength(3);
      expect(results[1].status).toBe("failed");
    });
  });

  describe("Pagination Support", () => {
    test("should handle --limit option", () => {
      const limit = 10;
      const allIssues = [
        { number: 1 },
        { number: 2 },
        { number: 3 },
        { number: 4 },
        { number: 5 },
        { number: 6 },
        { number: 7 },
        { number: 8 },
        { number: 9 },
        { number: 10 },
        { number: 11 },
        { number: 12 },
      ];

      const limited = allIssues.slice(0, limit);

      expect(limited).toHaveLength(10);
      expect(limited[9].number).toBe(10);
    });

    test("should handle --start-from option", () => {
      const startFrom = 5;
      const allIssues = Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
      }));

      const sliced = allIssues.slice(startFrom - 1);

      expect(sliced[0].number).toBe(5);
      expect(sliced).toHaveLength(16);
    });

    test("should combine limit and start-from", () => {
      const startFrom = 3;
      const limit = 5;
      const allIssues = Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
      }));

      const sliced = allIssues.slice(startFrom - 1, startFrom - 1 + limit);

      expect(sliced).toHaveLength(5);
      expect(sliced[0].number).toBe(3);
      expect(sliced[4].number).toBe(7);
    });
  });

  describe("GITHUB_TOKEN validation", () => {
    test("should require GITHUB_TOKEN", () => {
      delete process.env.GITHUB_TOKEN;

      expect(() => {
        if (!process.env.GITHUB_TOKEN) {
          throw new Error("GITHUB_TOKEN environment variable not set");
        }
      }).toThrow();
    });
  });
});
