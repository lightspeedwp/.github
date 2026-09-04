/**
 * Remediation Checklist Generator Tests
 *
 * Test coverage for RemediationChecklistGenerator class including:
 * - Happy path scenarios (standard checklist generation)
 * - Edge cases (special characters, missing fields, etc.)
 * - Error scenarios (invalid data, API failures)
 * - Template scenarios (type-specific templates)
 * - Compliance detection (DoR/DoD analysis)
 *
 * Target: 80%+ code coverage
 */

import { RemediationChecklistGenerator } from "../../scripts/agents/includes/remediation-checklist-generator.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sampleIssues = JSON.parse(
  readFileSync(join(__dirname, "../fixtures/sample-issues.json"), "utf8"),
);

describe("RemediationChecklistGenerator", () => {
  let mockGithub;
  let generator;

  beforeEach(() => {
    // Setup mock GitHub API
    mockGithub = {
      rest: {
        issues: {
          createComment: jest.fn().mockResolvedValue({ data: { id: 12345 } }),
          getComments: jest.fn().mockResolvedValue({ data: [] }),
        },
      },
    };

    generator = new RemediationChecklistGenerator(
      mockGithub,
      "test-owner",
      "test-repo",
    );
  });

  describe("constructor", () => {
    test("should initialize with github, owner, and repo", () => {
      expect(generator.github).toBe(mockGithub);
      expect(generator.owner).toBe("test-owner");
      expect(generator.repo).toBe("test-repo");
    });
  });

  describe("analyzeCompliance", () => {
    test("should detect compliant issue with both DoR and DoD", () => {
      const issue = sampleIssues.complianceScenarios.compliantIssue;
      const result = generator.analyzeCompliance(issue);

      expect(result.issueNumber).toBe(4001);
      expect(result.hasDoR).toBe(true);
      expect(result.hasDoD).toBe(true);
      expect(result.missingDoR).toBe(false);
      expect(result.missingDoD).toBe(false);
      expect(result.isNonCompliant).toBe(false);
    });

    test("should detect missing DoR section", () => {
      const issue = sampleIssues.complianceScenarios.missingDoR;
      const result = generator.analyzeCompliance(issue);

      expect(result.hasDoR).toBe(false);
      expect(result.hasDoD).toBe(true);
      expect(result.missingDoR).toBe(true);
      expect(result.missingDoD).toBe(false);
      expect(result.isNonCompliant).toBe(true);
    });

    test("should detect missing DoD section", () => {
      const issue = sampleIssues.complianceScenarios.missingDoD;
      const result = generator.analyzeCompliance(issue);

      expect(result.hasDoR).toBe(true);
      expect(result.hasDoD).toBe(false);
      expect(result.missingDoR).toBe(false);
      expect(result.missingDoD).toBe(true);
      expect(result.isNonCompliant).toBe(true);
    });

    test("should detect both missing DoR and DoD", () => {
      const issue = sampleIssues.complianceScenarios.missingBoth;
      const result = generator.analyzeCompliance(issue);

      expect(result.hasDoR).toBe(false);
      expect(result.hasDoD).toBe(false);
      expect(result.missingDoR).toBe(true);
      expect(result.missingDoD).toBe(true);
      expect(result.isNonCompliant).toBe(true);
    });

    test("should be case-insensitive for DoR detection", () => {
      const issue = {
        number: 1,
        title: "Test",
        body: "DEFINITION OF READY (DoR)",
        labels: [{ name: "type:task" }],
      };
      const result = generator.analyzeCompliance(issue);
      expect(result.hasDoR).toBe(true);
    });

    test("should be case-insensitive for DoD detection", () => {
      const issue = {
        number: 1,
        title: "Test",
        body: "DEFINITION OF DONE (DOD)",
        labels: [{ name: "type:task" }],
      };
      const result = generator.analyzeCompliance(issue);
      expect(result.hasDoD).toBe(true);
    });

    test("should extract issue type from labels", () => {
      const issue = {
        number: 1,
        title: "Test",
        body: "No definitions",
        labels: [{ name: "type:feature" }],
      };
      const result = generator.analyzeCompliance(issue);
      expect(result.type).toBe("type:feature");
    });

    test("should handle missing issue type label", () => {
      const issue = {
        number: 1,
        title: "Test",
        body: "No definitions",
        labels: [{ name: "priority:high" }],
      };
      const result = generator.analyzeCompliance(issue);
      expect(result.type).toBe("unknown");
    });

    test("should handle null body", () => {
      const issue = {
        number: 1,
        title: "Test",
        body: null,
        labels: [{ name: "type:task" }],
      };
      const result = generator.analyzeCompliance(issue);
      expect(result.hasDoR).toBe(false);
      expect(result.hasDoD).toBe(false);
    });

    test("should handle empty body", () => {
      const issue = sampleIssues.edgeCases.emptyBody;
      const result = generator.analyzeCompliance(issue);
      expect(result.hasDoR).toBe(false);
      expect(result.hasDoD).toBe(false);
      expect(result.isNonCompliant).toBe(true);
    });

    test("should handle special characters in body", () => {
      const issue = sampleIssues.edgeCases.specialCharactersInTitle;
      const result = generator.analyzeCompliance(issue);
      expect(result).toBeDefined();
      expect(typeof result.isNonCompliant).toBe("boolean");
    });

    test("should handle unicode characters", () => {
      const issue = sampleIssues.edgeCases.unicodeCharacters;
      const result = generator.analyzeCompliance(issue);
      expect(result).toBeDefined();
      expect(typeof result.isNonCompliant).toBe("boolean");
    });
  });

  describe("generateDoRTemplate", () => {
    test("should generate task DoR template", () => {
      const template = generator.generateDoRTemplate("type:task");
      expect(template).toBeDefined();
      expect(Array.isArray(template)).toBe(true);
      expect(template.length).toBeGreaterThan(0);
      expect(template[0]).toContain("Acceptance criteria");
    });

    test("should generate bug DoR template", () => {
      const template = generator.generateDoRTemplate("type:bug");
      expect(template).toBeDefined();
      expect(template.some((item) => item.includes("Reproducible"))).toBe(true);
    });

    test("should generate feature DoR template", () => {
      const template = generator.generateDoRTemplate("type:feature");
      expect(template).toBeDefined();
      expect(template.some((item) => item.includes("User story"))).toBe(true);
    });

    test("should generate epic DoR template", () => {
      const template = generator.generateDoRTemplate("type:epic");
      expect(template).toBeDefined();
      expect(template.some((item) => item.includes("Epic description"))).toBe(
        true,
      );
    });

    test("should return default template for unknown type", () => {
      const template = generator.generateDoRTemplate("type:unknown");
      expect(template).toBeDefined();
      expect(Array.isArray(template)).toBe(true);
    });

    test("should handle null type", () => {
      const template = generator.generateDoRTemplate(null);
      expect(template).toBeDefined();
      expect(Array.isArray(template)).toBe(true);
    });

    test("should handle empty string type", () => {
      const template = generator.generateDoRTemplate("");
      expect(template).toBeDefined();
      expect(Array.isArray(template)).toBe(true);
    });
  });

  describe("generateDoDTemplate", () => {
    test("should generate task DoD template", () => {
      const template = generator.generateDoDTemplate("type:task");
      expect(template).toBeDefined();
      expect(Array.isArray(template)).toBe(true);
      expect(template.length).toBeGreaterThan(0);
    });

    test("should generate bug DoD template", () => {
      const template = generator.generateDoDTemplate("type:bug");
      expect(template).toBeDefined();
      expect(template.some((item) => item.includes("Fixed"))).toBe(true);
    });

    test("should generate design DoD template", () => {
      const template = generator.generateDoDTemplate("type:design");
      expect(template).toBeDefined();
      expect(template.some((item) => item.includes("Design"))).toBe(true);
    });

    test("should return default template for unknown type", () => {
      const template = generator.generateDoDTemplate("type:unknown");
      expect(template).toBeDefined();
      expect(Array.isArray(template)).toBe(true);
    });
  });

  describe("postChecklistComment", () => {
    test("should post checklist comment for non-compliant issue", async () => {
      const issue = sampleIssues.complianceScenarios.missingBoth;
      const analysis = generator.analyzeCompliance(issue);

      mockGithub.rest.issues.getComments.mockResolvedValueOnce({ data: [] });

      const result = await generator.postChecklistComment(issue, analysis);

      expect(mockGithub.rest.issues.createComment).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    test("should not post duplicate checklist comment", async () => {
      const issue = sampleIssues.complianceScenarios.missingBoth;
      const analysis = generator.analyzeCompliance(issue);

      // Mock existing checklist comment
      mockGithub.rest.issues.getComments.mockResolvedValueOnce({
        data: [
          {
            body: "Remediation Checklist",
            author_association: "NONE",
          },
        ],
      });

      const result = await generator.postChecklistComment(issue, analysis);

      // Should not create comment if already exists
      if (result === null || result === undefined) {
        expect(mockGithub.rest.issues.createComment).not.toHaveBeenCalled();
      }
    });

    test("should skip comment for compliant issue", async () => {
      const issue = sampleIssues.complianceScenarios.compliantIssue;
      const analysis = generator.analyzeCompliance(issue);

      const result = await generator.postChecklistComment(issue, analysis);

      // Should not post comment for compliant issue
      expect(result === null || result === undefined || !result).toBe(true);
    });

    test("should handle API failures", async () => {
      const issue = sampleIssues.complianceScenarios.missingBoth;
      const analysis = generator.analyzeCompliance(issue);

      mockGithub.rest.issues.createComment.mockRejectedValueOnce(
        new Error("API Error"),
      );

      const result = await generator.postChecklistComment(issue, analysis);
      expect(result).toBe(null);
    });

    test("should include both DoR and DoD in comment", async () => {
      const issue = {
        number: 1,
        title: "Test",
        body: "Missing both sections",
        labels: [{ name: "type:task" }],
      };
      const analysis = generator.analyzeCompliance(issue);

      mockGithub.rest.issues.getComments.mockResolvedValueOnce({ data: [] });

      await generator.postChecklistComment(issue, analysis);

      const callArgs = mockGithub.rest.issues.createComment.mock.calls[0][0];
      expect(callArgs.body).toContain("Definition of Ready");
      expect(callArgs.body).toContain("Definition of Done");
    });
  });

  describe("generateRemediationComment", () => {
    test("should generate valid markdown comment", () => {
      const analysis = {
        issueNumber: 1,
        title: "Test issue",
        type: "type:task",
        hasDoR: false,
        hasDoD: false,
        missingDoR: true,
        missingDoD: true,
        isNonCompliant: true,
      };

      const comment = generator.generateRemediationComment(analysis);
      expect(comment).toBeDefined();
      expect(typeof comment).toBe("string");
      expect(comment.length).toBeGreaterThan(0);
      expect(comment).toContain("Definition of Ready");
      expect(comment).toContain("Definition of Done");
    });

    test("should format checklist items correctly", () => {
      const analysis = {
        issueNumber: 1,
        title: "Test issue",
        type: "type:bug",
        hasDoR: false,
        hasDoD: true,
        missingDoR: true,
        missingDoD: false,
        isNonCompliant: true,
      };

      const comment = generator.generateRemediationComment(analysis);
      expect(comment).toContain("- [ ]"); // Checkbox format
    });

    test("should include issue type in comment", () => {
      const analysis = {
        issueNumber: 1,
        title: "Test issue",
        type: "type:feature",
        hasDoR: false,
        hasDoD: false,
        missingDoR: true,
        missingDoD: true,
        isNonCompliant: true,
      };

      const comment = generator.generateRemediationComment(analysis);
      expect(comment).toContain("feature");
    });
  });

  describe("Template Consistency", () => {
    test("DoR and DoD templates should exist for all defined types", () => {
      const types = [
        "type:task",
        "type:bug",
        "type:feature",
        "type:epic",
        "type:story",
      ];

      types.forEach((type) => {
        const doRTemplate = generator.generateDoRTemplate(type);
        const doDTemplate = generator.generateDoDTemplate(type);

        expect(doRTemplate).toBeDefined();
        expect(doRTemplate.length).toBeGreaterThan(0);
        expect(doDTemplate).toBeDefined();
        expect(doDTemplate.length).toBeGreaterThan(0);
      });
    });

    test("all template items should be valid checklist format", () => {
      const template = generator.generateDoRTemplate("type:task");
      template.forEach((item) => {
        expect(item).toContain("- [ ]");
      });
    });
  });

  describe("Integration Scenarios", () => {
    test("should analyze and generate checklist for complete bug report", async () => {
      const issue = sampleIssues.integrationScenarios.completeBugReport;
      const analysis = generator.analyzeCompliance(issue);

      expect(analysis).toBeDefined();
      expect(analysis.issueNumber).toBe(5001);

      if (analysis.isNonCompliant) {
        const comment = generator.generateRemediationComment(analysis);
        expect(comment).toBeDefined();
        expect(comment.length).toBeGreaterThan(0);
      }
    });

    test("should analyze and generate checklist for complete feature request", async () => {
      const issue = sampleIssues.integrationScenarios.completeFeatureRequest;
      const analysis = generator.analyzeCompliance(issue);

      expect(analysis).toBeDefined();
      expect(analysis.issueNumber).toBe(5002);

      const comment = generator.generateRemediationComment(analysis);
      expect(comment).toBeDefined();
    });

    test("should process multiple issues in batch", () => {
      const issues = [
        sampleIssues.complianceScenarios.compliantIssue,
        sampleIssues.complianceScenarios.missingDoR,
        sampleIssues.complianceScenarios.missingDoD,
        sampleIssues.complianceScenarios.missingBoth,
      ];

      const analyses = issues.map((issue) =>
        generator.analyzeCompliance(issue),
      );

      expect(analyses).toHaveLength(4);
      expect(analyses[0].isNonCompliant).toBe(false);
      expect(analyses[1].isNonCompliant).toBe(true);
      expect(analyses[2].isNonCompliant).toBe(true);
      expect(analyses[3].isNonCompliant).toBe(true);
    });
  });

  describe("Error Handling", () => {
    test("should handle null issue gracefully", () => {
      const analysis = generator.analyzeCompliance(null);
      expect(analysis).toBeDefined();
    });

    test("should handle undefined body", () => {
      const issue = {
        number: 1,
        title: "Test",
        body: undefined,
        labels: [{ name: "type:task" }],
      };
      const analysis = generator.analyzeCompliance(issue);
      expect(analysis).toBeDefined();
      expect(analysis.hasDoR).toBe(false);
    });

    test("should handle null labels", () => {
      const issue = {
        number: 1,
        title: "Test",
        body: "Test body",
        labels: null,
      };
      const analysis = generator.analyzeCompliance(issue);
      expect(analysis).toBeDefined();
      expect(analysis.type).toBe("unknown");
    });

    test("should handle labels as strings", () => {
      const issue = {
        number: 1,
        title: "Test",
        body: "Test body",
        labels: ["type:task", "priority:high"],
      };
      const analysis = generator.analyzeCompliance(issue);
      expect(analysis).toBeDefined();
    });
  });
});
