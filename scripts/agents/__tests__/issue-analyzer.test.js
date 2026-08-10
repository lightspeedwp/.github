/**
 * Tests for issue-analyzer.js module
 * Coverage: detectIssueType, detectAreaLabels, assessPriority, suggestAssignees, detectProjectContext, analyzeIssue
 */

import {
  detectIssueType,
  detectAreaLabels,
  assessPriority,
  suggestAssignees,
  detectProjectContext,
  analyzeIssue,
} from "../includes/issue-analyzer.js";

describe("Issue Analyzer", () => {
  describe("detectIssueType", () => {
    it("detects bug from title keywords", () => {
      const result = detectIssueType(
        "Bug: Login button broken",
        "User cannot click login",
      );
      expect(result.type).toBe("type:bug");
      expect(result.confidence).toBeGreaterThanOrEqual(50);
    });

    it("detects feature from title keywords", () => {
      const result = detectIssueType(
        "Feature: Add dark mode",
        "Implement dark theme",
      );
      expect(result.type).toBe("type:feature");
      expect(result.confidence).toBeGreaterThanOrEqual(50);
    });

    it("returns confidence score", () => {
      const result = detectIssueType("Bug", "Error");
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe("detectAreaLabels", () => {
    it("detects area labels from keywords", () => {
      const result = detectAreaLabels("Frontend work", "React component CSS");
      expect(Array.isArray(result)).toBe(true);
    });

    it("includes confidence scores", () => {
      const result = detectAreaLabels("Backend API", "Database endpoint");
      result.forEach((area) => {
        expect(area.confidence).toBeGreaterThanOrEqual(0);
        expect(area.confidence).toBeLessThanOrEqual(100);
      });
    });
  });

  describe("assessPriority", () => {
    it("assesses priority level", () => {
      const result = assessPriority("Critical", "Production down");
      expect(result.level).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });
  });

  describe("suggestAssignees", () => {
    it("suggests assignees with confidence", () => {
      const result = suggestAssignees("Mention @john", []);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("detectProjectContext", () => {
    it("detects project context", () => {
      const result = detectProjectContext("Phase 2", "Phase 2 work");
      expect(result).toHaveProperty("project");
      expect(result).toHaveProperty("milestone");
    });
  });

  describe("analyzeIssue", () => {
    it("returns comprehensive analysis", () => {
      const issue = { title: "Bug: Login broken", body: "Auth failed" };
      const result = analyzeIssue(issue);
      expect(result).toHaveProperty("type");
      expect(result).toHaveProperty("areas");
      expect(result).toHaveProperty("priority");
      expect(result).toHaveProperty("confidence");
    });
  });
});
