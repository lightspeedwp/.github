/**
 * Unit Tests: Activity Analyzer
 */

import { ActivityAnalyzer } from "../../includes/activity-analyzer.js";

describe("ActivityAnalyzer", () => {
  let analyzer;
  let now;
  let oneWeekAgo;
  let thirtyDaysAgo;
  let ninetyDaysAgo;

  beforeAll(() => {
    now = new Date();
    oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  });

  beforeEach(() => {
    analyzer = new ActivityAnalyzer();
  });

  describe("getLastActivityDate", () => {
    it("should return updated_at date", () => {
      const issue = {
        number: 1,
        updated_at: oneWeekAgo.toISOString(),
        created_at: thirtyDaysAgo.toISOString(),
      };

      const result = analyzer.getLastActivityDate(issue);
      expect(result.getTime()).toBeCloseTo(oneWeekAgo.getTime(), -3);
    });

    it("should return epoch for null issue", () => {
      const result = analyzer.getLastActivityDate(null);
      expect(result.getTime()).toBe(new Date(0).getTime());
    });

    it("should return epoch for issue without dates", () => {
      const issue = { number: 1 };
      const result = analyzer.getLastActivityDate(issue);
      expect(result.getTime()).toBe(new Date(0).getTime());
    });
  });

  describe("getDaysSinceActivity", () => {
    it("should calculate days since activity", () => {
      const sevenDaysAgoDate = new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000,
      );
      const issue = {
        number: 1,
        updated_at: sevenDaysAgoDate.toISOString(),
      };

      const result = analyzer.getDaysSinceActivity(issue);
      expect(result).toBeGreaterThanOrEqual(7);
      expect(result).toBeLessThanOrEqual(8);
    });

    it("should return 0 for recently updated issue", () => {
      const issue = {
        number: 1,
        updated_at: now.toISOString(),
      };

      const result = analyzer.getDaysSinceActivity(issue);
      expect(result).toBe(0);
    });
  });

  describe("isStale", () => {
    it("should return true if inactive for 30+ days", () => {
      const issue = {
        number: 1,
        updated_at: thirtyDaysAgo.toISOString(),
      };

      const result = analyzer.isStale(issue, 30);
      expect(result).toBe(true);
    });

    it("should return false if active within threshold", () => {
      const issue = {
        number: 1,
        updated_at: oneWeekAgo.toISOString(),
      };

      const result = analyzer.isStale(issue, 30);
      expect(result).toBe(false);
    });

    it("should use 30 day default threshold", () => {
      const issue = {
        number: 1,
        updated_at: thirtyDaysAgo.toISOString(),
      };

      const result = analyzer.isStale(issue);
      expect(result).toBe(true);
    });

    it("should return false for null issue", () => {
      const result = analyzer.isStale(null, 30);
      expect(result).toBe(false);
    });
  });

  describe("hasRecentChange", () => {
    it("should return true for recent updates", () => {
      const issue = {
        number: 1,
        updated_at: oneWeekAgo.toISOString(),
      };

      const result = analyzer.hasRecentChange(issue, "update", 7);
      expect(result).toBe(true);
    });

    it("should return false for old updates", () => {
      const issue = {
        number: 1,
        updated_at: thirtyDaysAgo.toISOString(),
      };

      const result = analyzer.hasRecentChange(issue, "update", 7);
      expect(result).toBe(false);
    });

    it("should handle different activity types", () => {
      const issue = {
        number: 1,
        updated_at: oneWeekAgo.toISOString(),
      };

      expect(analyzer.hasRecentChange(issue, "comment", 14)).toBe(true);
      expect(analyzer.hasRecentChange(issue, "label", 14)).toBe(true);
      expect(analyzer.hasRecentChange(issue, "assignment", 14)).toBe(true);
    });
  });

  describe("categorizeByActivity", () => {
    it("should categorize active issues", () => {
      const oneDay = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      const issue = {
        number: 1,
        updated_at: oneDay.toISOString(),
      };

      const result = analyzer.categorizeByActivity(issue);
      expect(result).toBe("active");
    });

    it("should categorize stale issues", () => {
      const issue = {
        number: 1,
        updated_at: oneWeekAgo.toISOString(),
      };

      const result = analyzer.categorizeByActivity(issue);
      expect(result).toBe("stale");
    });

    it("should categorize dormant issues", () => {
      const issue = {
        number: 1,
        updated_at: ninetyDaysAgo.toISOString(),
      };

      const result = analyzer.categorizeByActivity(issue);
      expect(result).toBe("dormant");
    });

    it("should categorize forgotten issues", () => {
      const longAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      const issue = {
        number: 1,
        updated_at: longAgo.toISOString(),
      };

      const result = analyzer.categorizeByActivity(issue);
      expect(result).toBe("forgotten");
    });
  });

  describe("shouldExcludeFromStale", () => {
    it("should exclude epic issues", () => {
      const issue = {
        number: 1,
        labels: [{ name: "type:epic" }],
      };

      const result = analyzer.shouldExcludeFromStale(issue);
      expect(result).toBe(true);
    });

    it("should exclude in-progress issues", () => {
      const issue = {
        number: 1,
        labels: [{ name: "status:in-progress" }],
      };

      const result = analyzer.shouldExcludeFromStale(issue);
      expect(result).toBe(true);
    });

    it("should exclude critical priority", () => {
      const issue = {
        number: 1,
        labels: [{ name: "priority:critical" }],
      };

      const result = analyzer.shouldExcludeFromStale(issue);
      expect(result).toBe(true);
    });

    it("should exclude issues in milestone", () => {
      const issue = {
        number: 1,
        milestone: { title: "v1.0" },
      };

      const result = analyzer.shouldExcludeFromStale(issue);
      expect(result).toBe(true);
    });

    it("should include regular issues", () => {
      const issue = {
        number: 1,
        labels: [{ name: "type:bug" }],
      };

      const result = analyzer.shouldExcludeFromStale(issue);
      expect(result).toBe(false);
    });

    it("should return false for null issue", () => {
      const result = analyzer.shouldExcludeFromStale(null);
      expect(result).toBe(false);
    });
  });

  describe("analyzeBatch", () => {
    it("should analyze batch of issues", () => {
      const issues = [
        { number: 1, updated_at: now.toISOString() },
        { number: 2, updated_at: oneWeekAgo.toISOString() },
        { number: 3, updated_at: thirtyDaysAgo.toISOString() },
        { number: 4, updated_at: ninetyDaysAgo.toISOString() },
        {
          number: 5,
          updated_at: new Date(
            now.getTime() - 180 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ];

      const result = analyzer.analyzeBatch(issues);

      expect(result.total).toBe(5);
      expect(result.active).toBe(1);
      expect(result.stale).toBe(1);
      expect(result.dormant).toBe(1);
      expect(result.forgotten).toBe(1);
      expect(result.avgDaysSinceActivity).toBeGreaterThan(0);
      expect(result.oldestIssue).toBeDefined();
      expect(result.newestIssue).toBeDefined();
    });

    it("should handle empty array", () => {
      const result = analyzer.analyzeBatch([]);

      expect(result.total).toBe(0);
      expect(result.avgDaysSinceActivity).toBe(0);
    });

    it("should handle non-array input", () => {
      const result = analyzer.analyzeBatch(null);

      expect(result.total).toBe(0);
    });
  });

  describe("findExcludedStaleIssues", () => {
    it("should find stale but excluded issues", () => {
      const issues = [
        {
          number: 1,
          updated_at: thirtyDaysAgo.toISOString(),
          labels: [{ name: "type:epic" }],
        },
        {
          number: 2,
          updated_at: thirtyDaysAgo.toISOString(),
          labels: [{ name: "type:bug" }],
        },
      ];

      const result = analyzer.findExcludedStaleIssues(issues, 30);

      expect(result.length).toBe(1);
      expect(result[0].number).toBe(1);
    });

    it("should return empty if no excluded stale issues", () => {
      const issues = [
        {
          number: 1,
          updated_at: oneWeekAgo.toISOString(),
          labels: [{ name: "type:epic" }],
        },
      ];

      const result = analyzer.findExcludedStaleIssues(issues, 30);

      expect(result.length).toBe(0);
    });
  });

  describe("getIssueAgeDays", () => {
    it("should calculate issue age in days", () => {
      const issue = {
        number: 1,
        created_at: thirtyDaysAgo.toISOString(),
      };

      const result = analyzer.getIssueAgeDays(issue);

      expect(result).toBeGreaterThanOrEqual(30);
      expect(result).toBeLessThanOrEqual(31);
    });

    it("should return 0 for null or missing created_at", () => {
      expect(analyzer.getIssueAgeDays(null)).toBe(0);
      expect(analyzer.getIssueAgeDays({ number: 1 })).toBe(0);
    });
  });
});
