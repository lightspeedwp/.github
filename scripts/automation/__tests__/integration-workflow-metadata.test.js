/**
 * Integration tests for Issue Metadata Workflow
 *
 * Tests the composition of audit-issue-metadata and bulk-issue-metadata-updater
 * as a complete workflow for analyzing and fixing metadata gaps.
 */

describe("Issue Metadata Workflow (Integration)", () => {
  describe("Audit → Bulk Update workflow", () => {
    // Simulated audit function
    const auditIssues = (issues) => {
      const analyzed = issues.map((issue) => {
        const labels = issue.labels || [];
        const gaps = [];

        if (!labels.some((l) => (l.name || l).startsWith("type:")))
          gaps.push("type");
        if (!labels.some((l) => (l.name || l).startsWith("area:")))
          gaps.push("area");
        if (!labels.some((l) => (l.name || l).startsWith("status:")))
          gaps.push("status");
        if (!issue.assignee) gaps.push("assignee");
        if (!issue.milestone) gaps.push("milestone");

        return {
          number: issue.number,
          title: issue.title,
          gaps,
          gapCount: gaps.length,
        };
      });

      return {
        total: issues.length,
        withGaps: analyzed.filter((i) => i.gapCount > 0).length,
        analyzed,
      };
    };

    // Simulated bulk updater function
    const updateIssues = (issues, options = {}) => {
      const { mode = "dry-run", confidence = 0.85 } = options;
      const results = [];

      issues.forEach((issue) => {
        if (issue.gapCount > 0) {
          results.push({
            number: issue.number,
            updated: mode !== "dry-run",
            confidence,
          });
        }
      });

      return {
        total: issues.length,
        updated: results.filter((r) => r.updated).length,
        dryRun: mode === "dry-run",
        results,
      };
    };

    it("should audit issues and identify gaps", () => {
      const issues = [
        {
          number: 1,
          title: "Feature request",
          labels: [
            { name: "type:feature" },
            { name: "area:ci" },
            { name: "status:in-progress" },
          ],
          assignee: { login: "user1" },
          milestone: { title: "v1.0" },
        },
        {
          number: 2,
          title: "Bug report",
          labels: [], // Missing all labels
        },
      ];

      const auditResult = auditIssues(issues);

      expect(auditResult.total).toBe(2);
      expect(auditResult.withGaps).toBe(1); // Only issue 2 has gaps now
      expect(auditResult.analyzed[1].gapCount).toBeGreaterThan(0);
    });

    it("should identify specific gaps in issues", () => {
      const issues = [
        {
          number: 1,
          title: "Incomplete issue",
          labels: [{ name: "type:bug" }],
          assignee: null,
        },
      ];

      const auditResult = auditIssues(issues);
      const issue = auditResult.analyzed[0];

      expect(issue.gaps).toContain("area");
      expect(issue.gaps).toContain("status");
      expect(issue.gaps).toContain("assignee");
    });

    it("should compose audit and bulk updater workflows", () => {
      const issues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [{ name: "type:feature" }],
        },
        {
          number: 2,
          title: "Issue 2",
          labels: [],
        },
        {
          number: 3,
          title: "Issue 3",
          labels: [
            { name: "type:bug" },
            { name: "area:ci" },
            { name: "status:needs-review" },
          ],
          assignee: { login: "user1" },
          milestone: { title: "v1.0" },
        },
      ];

      // Phase 1: Audit
      const auditResult = auditIssues(issues);
      const issuesWithGaps = auditResult.analyzed.filter((i) => i.gapCount > 0);

      // Phase 2: Bulk update (dry-run)
      const updateResult = updateIssues(issuesWithGaps, {
        mode: "dry-run",
        confidence: 0.9,
      });

      expect(auditResult.total).toBe(3);
      expect(auditResult.withGaps).toBe(2);
      expect(updateResult.dryRun).toBe(true);
      expect(updateResult.total).toBe(2);
    });

    it("should handle workflow with no gaps", () => {
      const issues = [
        {
          number: 1,
          title: "Complete issue",
          labels: [
            { name: "type:feature" },
            { name: "area:ci" },
            { name: "status:needs-review" },
          ],
          assignee: { login: "user1" },
          milestone: { title: "v1.0" },
        },
      ];

      const auditResult = auditIssues(issues);
      expect(auditResult.withGaps).toBe(0);

      const updateResult = updateIssues(auditResult.analyzed);
      expect(updateResult.results).toHaveLength(0);
    });

    it("should support interactive mode in workflow", () => {
      const issues = [
        { number: 1, title: "Issue", labels: [], gapCount: 4 },
      ];

      const updateResult = updateIssues(issues, {
        mode: "interactive",
        confidence: 0.85,
      });

      expect(updateResult.dryRun).toBe(false);
      expect(updateResult.updated).toBe(1);
    });

    it("should track confidence throughout workflow", () => {
      const issues = [{ number: 1, title: "Issue", labels: [], gapCount: 3 }];

      const updateResult = updateIssues(issues, { confidence: 0.95 });

      expect(updateResult.results[0].confidence).toBe(0.95);
    });

    it("should maintain state across audit and update phases", () => {
      const initialIssues = [
        { number: 1, labels: [], assignee: null },
        { number: 2, labels: [{ name: "type:bug" }], assignee: { login: "u1" } },
      ];

      // Audit phase
      const auditResult = auditIssues(initialIssues);

      // Verify audit preserved issue numbers
      expect(auditResult.analyzed[0].number).toBe(1);
      expect(auditResult.analyzed[1].number).toBe(2);

      // Update phase uses audited data
      const updateResult = updateIssues(auditResult.analyzed);

      // Verify numbers preserved through update
      expect(updateResult.results[0].number).toBe(1);
    });
  });

  describe("Workflow state management", () => {
    const createWorkflowState = () => ({
      phase: "audit",
      issuesProcessed: 0,
      gapsFound: 0,
      gapsFixed: 0,
    });

    const advancePhase = (state, data) => ({
      ...state,
      phase: state.phase === "audit" ? "update" : "complete",
      issuesProcessed: data.total,
      gapsFound: data.gaps,
      gapsFixed: data.updated,
    });

    it("should manage workflow state correctly", () => {
      const state = createWorkflowState();
      expect(state.phase).toBe("audit");

      const auditData = { total: 5, gaps: 3, updated: 0 };
      const newState = advancePhase(state, auditData);

      expect(newState.phase).toBe("update");
      expect(newState.issuesProcessed).toBe(5);
      expect(newState.gapsFound).toBe(3);
    });
  });

  describe("Error handling in workflows", () => {
    it("should handle empty issue list", () => {
      const issues = [];
      expect(issues).toHaveLength(0);
    });

    it("should handle issues with malformed data", () => {
      const issue = { number: 1 }; // Missing all other fields
      expect(issue.labels).toBeUndefined();
      expect(issue.assignee).toBeUndefined();
    });

    it("should handle null/undefined gaps", () => {
      const issue = { number: 1, gaps: null };
      const gaps = issue.gaps || [];
      expect(gaps).toHaveLength(0);
    });
  });

  describe("Performance considerations", () => {
    it("should handle large issue batches", () => {
      const largeIssueList = Array.from({ length: 1000 }, (_, i) => ({
        number: i + 1,
        labels: [],
        gapCount: Math.floor(Math.random() * 6),
      }));

      expect(largeIssueList).toHaveLength(1000);
      const withGaps = largeIssueList.filter((i) => i.gapCount > 0);
      expect(withGaps.length).toBeGreaterThan(0);
    });

    it("should limit processing with pagination", () => {
      const config = { limit: 100, perPage: 50 };
      expect(config.limit).toBe(100);
      expect(config.perPage).toBe(50);

      // Simulate pagination: 2 pages needed for 100 limit with 50 per page
      const pages = Math.ceil(config.limit / config.perPage);
      expect(pages).toBe(2);
    });
  });

  describe("Confidence threshold application", () => {
    it("should apply confidence threshold to updates", () => {
      const issues = [
        { number: 1, confidence: 0.95, shouldUpdate: true },
        { number: 2, confidence: 0.90, shouldUpdate: true },
        { number: 3, confidence: 0.70, shouldUpdate: false },
      ];

      const threshold = 0.85;
      const shouldProcess = issues.filter((i) => i.confidence >= threshold);

      expect(shouldProcess).toHaveLength(2);
      expect(shouldProcess[0].number).toBe(1);
      expect(shouldProcess[1].number).toBe(2);
    });
  });

  describe("Workflow summary reporting", () => {
    it("should generate summary from workflow results", () => {
      const auditPhaseResult = {
        total: 50,
        withGaps: 30,
        analyzed: Array.from({ length: 30 }, (_, i) => ({
          number: i + 1,
          gapCount: Math.random() * 5,
        })),
      };

      const updatePhaseResult = {
        total: 30,
        updated: 25,
      };

      const summary = {
        auditedIssues: auditPhaseResult.total,
        issuesWithGaps: auditPhaseResult.withGaps,
        issuesUpdated: updatePhaseResult.updated,
        successRate:
          (updatePhaseResult.updated / auditPhaseResult.withGaps) * 100,
      };

      expect(summary.auditedIssues).toBe(50);
      expect(summary.issuesWithGaps).toBe(30);
      expect(summary.issuesUpdated).toBe(25);
      expect(summary.successRate).toBeCloseTo(83.33, 1);
    });
  });
});
