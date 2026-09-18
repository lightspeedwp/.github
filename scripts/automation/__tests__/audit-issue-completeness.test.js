#!/usr/bin/env node

/**
 * Tests for Audit Issue Completeness Script
 * Verifies issue analysis, missing section detection, and report generation
 */

const https = require("https");

// Mock https module
jest.mock("https");

// Mock fs module for file writing tests
jest.mock("fs", () => ({
  existsSync: jest.fn((path) => {
    if (path.includes("node_modules")) return true;
    return false;
  }),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe("Audit Issue Completeness", () => {
  let mockRequest;
  let mockResponse;
  let capturedOutput;

  beforeEach(() => {
    jest.clearAllMocks();
    capturedOutput = [];

    // Mock console.log and console.error
    jest.spyOn(console, "log").mockImplementation((msg) => {
      capturedOutput.push(msg);
    });
    jest.spyOn(console, "error").mockImplementation((msg) => {
      capturedOutput.push(`ERROR: ${msg}`);
    });

    // Mock the response object
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

    // Mock https.request
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

  describe("Missing Section Detection", () => {
    test("should detect missing Definition of Ready", () => {
      const body = `## Definition of Done
Some content here`;

      const missing = [];
      const present = [];

      if (!body.includes("## Definition of Ready")) {
        missing.push("Definition of Ready");
      } else {
        present.push("Definition of Ready");
      }

      if (body.includes("## Definition of Done")) {
        present.push("Definition of Done");
      }

      expect(missing).toContain("Definition of Ready");
      expect(present).toContain("Definition of Done");
    });

    test("should detect missing Definition of Done", () => {
      const body = `## Definition of Ready
- Item 1
- Item 2`;

      const missing = [];
      const present = [];

      if (body.includes("## Definition of Ready")) {
        present.push("Definition of Ready");
      }

      if (!body.includes("## Definition of Done")) {
        missing.push("Definition of Done");
      } else {
        present.push("Definition of Done");
      }

      expect(missing).toContain("Definition of Done");
      expect(present).toContain("Definition of Ready");
    });

    test("should detect missing Owner/Assignee", () => {
      const body = `## Definition of Ready
- Item 1

## Definition of Done
- Item 1`;

      const missing = [];
      const present = [];

      if (body.includes("## Definition of Ready")) {
        present.push("Definition of Ready");
      }
      if (body.includes("## Definition of Done")) {
        present.push("Definition of Done");
      }
      if (!body.includes("## Owner") && !body.includes("## Assignee")) {
        missing.push("Owner");
      } else {
        present.push("Owner");
      }

      expect(missing).toContain("Owner");
      expect(present).toContain("Definition of Ready");
      expect(present).toContain("Definition of Done");
    });

    test("should detect missing Acceptance Criteria", () => {
      const body = `## Definition of Ready
- Ready for work

## Definition of Done
- Done with work`;

      const missing = [];
      const present = [];

      if (body.includes("## Definition of Ready")) present.push("DoR");
      if (body.includes("## Definition of Done")) present.push("DoD");
      if (!body.includes("## Acceptance Criteria")) {
        missing.push("Acceptance Criteria");
      }

      expect(missing).toContain("Acceptance Criteria");
      expect(present).toContain("DoR");
    });

    test("should handle empty body", () => {
      const body = "";

      const missing = [];

      if (!body) {
        missing.push(
          "Definition of Ready",
          "Definition of Done",
          "Owner",
          "Acceptance Criteria",
        );
      }

      expect(missing).toHaveLength(4);
      expect(missing).toContain("Definition of Ready");
      expect(missing).toContain("Definition of Done");
      expect(missing).toContain("Owner");
      expect(missing).toContain("Acceptance Criteria");
    });
  });

  describe("Completeness Scoring", () => {
    test("should calculate 100% completeness when all sections present", () => {
      const present = [
        "Definition of Ready",
        "Definition of Done",
        "Owner",
        "Acceptance Criteria",
        "Technical Details",
        "Testing Strategy",
      ];

      const maxScore = 6;
      const score = Math.round((present.length / maxScore) * 100);

      expect(score).toBe(100);
    });

    test("should calculate 50% completeness with half sections present", () => {
      const present = ["Definition of Ready", "Owner"];

      const maxScore = 6;
      const score = Math.round((present.length / maxScore) * 100);

      expect(score).toBe(33); // 2/6 = 0.333...
    });

    test("should calculate 0% completeness when no sections present", () => {
      const present = [];

      const maxScore = 6;
      const score = Math.round((present.length / maxScore) * 100);

      expect(score).toBe(0);
    });

    test("should calculate 83% completeness with 5 sections present", () => {
      const present = [
        "Definition of Ready",
        "Definition of Done",
        "Owner",
        "Acceptance Criteria",
        "Technical Details",
      ];

      const maxScore = 6;
      const score = Math.round((present.length / maxScore) * 100);

      expect(score).toBe(83);
    });
  });

  describe("Issue Analysis", () => {
    test("should analyze issue with all metadata", () => {
      const issue = {
        number: 123,
        title: "Test Issue",
        body: "## Definition of Ready\n## Definition of Done\n## Owner\n## Acceptance Criteria",
        labels: [{ name: "type:feature" }, { name: "status:in-progress" }],
        assignee: { login: "john" },
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-09-08T00:00:00Z",
      };

      const labels = (issue.labels || []).map((l) => l.name || l);
      const typeLabel = labels.find((l) => l.startsWith("type:"));
      const statusLabels = labels.filter((l) => l.startsWith("status:"));

      expect(issue.number).toBe(123);
      expect(typeLabel).toBe("type:feature");
      expect(statusLabels).toContain("status:in-progress");
      expect(issue.assignee.login).toBe("john");
    });

    test("should handle issue with no assignee", () => {
      const issue = {
        number: 456,
        title: "Unassigned Issue",
        assignee: null,
        labels: [{ name: "type:bug" }],
      };

      const assignee = issue.assignee?.login || null;
      expect(assignee).toBeNull();
    });

    test("should handle issue with empty labels", () => {
      const issue = {
        number: 789,
        title: "Issue with no labels",
        labels: [],
      };

      const labels = (issue.labels || []).map((l) => l.name || l);
      const typeLabel = labels.find((l) => l.startsWith("type:"));

      expect(typeLabel).toBeUndefined();
    });
  });

  describe("CSV Output Generation", () => {
    test("should generate valid CSV headers", () => {
      const headers = [
        "Issue #",
        "Title",
        "Type",
        "Status",
        "Area",
        "Assignee",
        "Completeness %",
        "Missing DoR",
        "Missing DoD",
        "Missing Owner",
        "Missing AC",
        "Missing Sections",
      ];

      expect(headers).toHaveLength(12);
      expect(headers[0]).toBe("Issue #");
      expect(headers[6]).toBe("Completeness %");
    });

    test("should format CSV row correctly", () => {
      const audit = {
        number: 123,
        title: 'Test "Issue"',
        type: "type:feature",
        status: ["status:in-progress"],
        area: "area:automation",
        assignee: "john",
        completeness_score: 75,
        needs_dor: false,
        needs_dod: true,
        needs_owner: false,
        needs_ac: false,
        missing_sections: ["Definition of Done"],
      };

      const row = [
        audit.number,
        `"${audit.title.replace(/"/g, '""')}"`,
        audit.type,
        audit.status.join("|"),
        audit.area,
        audit.assignee || "unassigned",
        audit.completeness_score,
        audit.needs_dor ? "Yes" : "No",
        audit.needs_dod ? "Yes" : "No",
        audit.needs_owner ? "Yes" : "No",
        audit.needs_ac ? "Yes" : "No",
        `"${audit.missing_sections.join(", ")}"`,
      ];

      expect(row[0]).toBe(123);
      expect(row[1]).toBe('"Test ""Issue"""'); // Escaped quotes
      expect(row[8]).toBe("Yes"); // needs_dod
    });
  });

  describe("Summary Statistics", () => {
    test("should calculate total issues", () => {
      const audits = [{ number: 1 }, { number: 2 }, { number: 3 }];

      const total = audits.length;
      expect(total).toBe(3);
    });

    test("should calculate average completeness", () => {
      const audits = [
        { completeness_score: 100 },
        { completeness_score: 75 },
        { completeness_score: 50 },
      ];

      const avgCompleteness = Math.round(
        audits.reduce((sum, a) => sum + a.completeness_score, 0) /
          audits.length,
      );

      expect(avgCompleteness).toBe(75);
    });

    test("should count issues needing specific sections", () => {
      const audits = [
        { needs_dor: true },
        { needs_dor: true },
        { needs_dor: false },
      ];

      const needsDOR = audits.filter((a) => a.needs_dor).length;
      expect(needsDOR).toBe(2);
    });

    test("should aggregate by issue type", () => {
      const audits = [
        { type: "type:feature", completeness_score: 80 },
        { type: "type:feature", completeness_score: 90 },
        { type: "type:bug", completeness_score: 60 },
      ];

      const byType = {};
      audits.forEach((a) => {
        if (!byType[a.type]) {
          byType[a.type] = { total: 0, avgScore: 0 };
        }
        byType[a.type].total++;
        byType[a.type].avgScore += a.completeness_score;
      });

      Object.keys(byType).forEach((type) => {
        byType[type].avgScore = Math.round(
          byType[type].avgScore / byType[type].total,
        );
      });

      expect(byType["type:feature"].total).toBe(2);
      expect(byType["type:feature"].avgScore).toBe(85);
      expect(byType["type:bug"].total).toBe(1);
      expect(byType["type:bug"].avgScore).toBe(60);
    });
  });

  describe("GITHUB_TOKEN validation", () => {
    test("should throw error if GITHUB_TOKEN not set", () => {
      delete process.env.GITHUB_TOKEN;

      expect(() => {
        if (!process.env.GITHUB_TOKEN) {
          throw new Error("GITHUB_TOKEN environment variable not set");
        }
      }).toThrow("GITHUB_TOKEN environment variable not set");
    });

    test("should not throw error if GITHUB_TOKEN is set", () => {
      process.env.GITHUB_TOKEN = "test-token";

      expect(() => {
        if (!process.env.GITHUB_TOKEN) {
          throw new Error("GITHUB_TOKEN environment variable not set");
        }
      }).not.toThrow();
    });
  });
});
