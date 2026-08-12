/**
 * Unit Tests: Review Meta Labels Script
 */

import { auditMetaLabels } from "../review-meta-labels.js";
import { LabelManager } from "../includes/label-management.js";

jest.mock("../includes/label-management.js");
jest.mock("../includes/report-generator.js");

describe("Review Meta Labels Script", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GITHUB_TOKEN = "test-token";
  });

  describe("auditMetaLabels", () => {
    it("should audit meta labels successfully", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [{ name: "meta:needs-changelog" }, { name: "type:bug" }],
        },
        {
          number: 2,
          title: "Issue 2",
          labels: [{ name: "meta:has-pr" }, { name: "type:feature" }],
        },
        {
          number: 3,
          title: "Issue 3",
          labels: [{ name: "meta:stale" }],
        },
      ];

      LabelManager.mockImplementation(() => ({
        fetchAllIssues: jest.fn().mockResolvedValue(mockIssues),
      }));

      const result = await auditMetaLabels({
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(result.report.total_issues_analyzed).toBe(3);
      expect(result.report.meta_labels).toBeDefined();
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it("should count meta labels correctly", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [{ name: "meta:needs-changelog" }, { name: "meta:has-pr" }],
        },
        {
          number: 2,
          title: "Issue 2",
          labels: [{ name: "meta:needs-changelog" }],
        },
        {
          number: 3,
          title: "Issue 3",
          labels: [{ name: "type:bug" }],
        },
      ];

      LabelManager.mockImplementation(() => ({
        fetchAllIssues: jest.fn().mockResolvedValue(mockIssues),
      }));

      const result = await auditMetaLabels();

      expect(result.success).toBe(true);
      expect(result.report.meta_labels["meta:needs-changelog"].count).toBe(2);
      expect(result.report.meta_labels["meta:has-pr"].count).toBe(1);
    });

    it("should calculate percentages correctly", async () => {
      const mockIssues = Array(100)
        .fill(0)
        .map((_, i) => ({
          number: i + 1,
          title: `Issue ${i + 1}`,
          labels: i < 50 ? [{ name: "meta:stale" }] : [{ name: "type:bug" }],
        }));

      LabelManager.mockImplementation(() => ({
        fetchAllIssues: jest.fn().mockResolvedValue(mockIssues),
      }));

      const result = await auditMetaLabels();

      expect(result.success).toBe(true);
      expect(result.report.meta_labels["meta:stale"].percentage).toBe(50);
    });

    it("should filter by specific label", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [{ name: "meta:needs-changelog" }],
        },
        {
          number: 2,
          title: "Issue 2",
          labels: [{ name: "meta:has-pr" }],
        },
      ];

      LabelManager.mockImplementation(() => ({
        fetchAllIssues: jest.fn().mockResolvedValue(mockIssues),
      }));

      const result = await auditMetaLabels({
        label: "meta:needs-changelog",
      });

      expect(result.success).toBe(true);
      expect(result.report.meta_labels).toEqual({
        "meta:needs-changelog":
          result.report.meta_labels["meta:needs-changelog"],
      });
    });

    it("should handle invalid label filter", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [{ name: "meta:needs-changelog" }],
        },
      ];

      LabelManager.mockImplementation(() => ({
        fetchAllIssues: jest.fn().mockResolvedValue(mockIssues),
      }));

      const result = await auditMetaLabels({
        label: "invalid:label",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Label not found");
    });

    it("should generate recommendations", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [{ name: "type:bug" }], // No changelog label
        },
        {
          number: 2,
          title: "Issue 2",
          labels: [{ name: "meta:needs-changelog" }],
        },
      ];

      LabelManager.mockImplementation(() => ({
        fetchAllIssues: jest.fn().mockResolvedValue(mockIssues),
      }));

      const result = await auditMetaLabels();

      expect(result.success).toBe(true);
      expect(result.report.recommendations.length).toBeGreaterThan(0);
    });

    it("should include all 7 meta labels in report", async () => {
      LabelManager.mockImplementation(() => ({
        fetchAllIssues: jest.fn().mockResolvedValue([]),
      }));

      const result = await auditMetaLabels();

      expect(result.success).toBe(true);
      expect(Object.keys(result.report.meta_labels).length).toBe(7);
      expect(result.report.meta_labels["meta:needs-changelog"]).toBeDefined();
      expect(result.report.meta_labels["meta:no-changelog"]).toBeDefined();
      expect(result.report.meta_labels["meta:has-pr"]).toBeDefined();
      expect(result.report.meta_labels["meta:no-issue-activity"]).toBeDefined();
      expect(result.report.meta_labels["meta:no-pr-activity"]).toBeDefined();
      expect(result.report.meta_labels["meta:stale"]).toBeDefined();
      expect(
        result.report.meta_labels["meta:dependabot-security"],
      ).toBeDefined();
    });

    it("should handle API errors gracefully", async () => {
      LabelManager.mockImplementation(() => ({
        fetchAllIssues: jest.fn().mockRejectedValue(new Error("API Error")),
      }));

      const result = await auditMetaLabels();

      expect(result.success).toBe(false);
      expect(result.error).toContain("API Error");
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it("should limit issues array in report", async () => {
      const mockIssues = Array(50)
        .fill(0)
        .map((_, i) => ({
          number: i + 1,
          title: `Issue ${i + 1}`,
          labels: [{ name: "meta:needs-changelog" }],
        }));

      LabelManager.mockImplementation(() => ({
        fetchAllIssues: jest.fn().mockResolvedValue(mockIssues),
      }));

      const result = await auditMetaLabels();

      expect(result.success).toBe(true);
      // Issues array should be limited to first 10 for report size
      expect(
        result.report.meta_labels["meta:needs-changelog"].issues.length,
      ).toBeLessThanOrEqual(10);
    });

    it("should track audit duration", async () => {
      LabelManager.mockImplementation(() => ({
        fetchAllIssues: jest.fn().mockResolvedValue([]),
      }));

      const result = await auditMetaLabels();

      expect(result.success).toBe(true);
      expect(typeof result.duration).toBe("number");
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it("should include audit date in report", async () => {
      LabelManager.mockImplementation(() => ({
        fetchAllIssues: jest.fn().mockResolvedValue([]),
      }));

      const beforeAudit = new Date();
      const result = await auditMetaLabels();
      const afterAudit = new Date();

      expect(result.success).toBe(true);
      const auditDate = new Date(result.report.audit_date);
      expect(auditDate.getTime()).toBeGreaterThanOrEqual(beforeAudit.getTime());
      expect(auditDate.getTime()).toBeLessThanOrEqual(afterAudit.getTime());
    });
  });
});
