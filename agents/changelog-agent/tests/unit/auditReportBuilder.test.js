/**
 * Audit Report Builder Unit Tests
 * Tests report generation with mock validation results
 */

const auditBuilder = require("../../includes/auditReportBuilder.cjs");

describe("Audit Report Builder", () => {
  describe("Compliance Status Determination", () => {
    test("should return PASS for 100% compliance", () => {
      const status = auditBuilder.determineComplianceStatus(100);
      expect(status).toBe("PASS");
    });

    test("should return CONDITIONAL_PASS for >=90% compliance", () => {
      expect(auditBuilder.determineComplianceStatus(95)).toBe(
        "CONDITIONAL_PASS",
      );
      expect(auditBuilder.determineComplianceStatus(90)).toBe(
        "CONDITIONAL_PASS",
      );
    });

    test("should return FAIL for <90% compliance", () => {
      expect(auditBuilder.determineComplianceStatus(89)).toBe("FAIL");
      expect(auditBuilder.determineComplianceStatus(50)).toBe("FAIL");
      expect(auditBuilder.determineComplianceStatus(0)).toBe("FAIL");
    });
  });

  describe("Issue Breakdown by Category", () => {
    test("should aggregate issues by category", () => {
      const entries = [
        {
          index: 1,
          category: "Added",
          text: "Feature A",
          validation: {
            complianceStatus: "passing",
            summary: { passed: 1 },
          },
        },
        {
          index: 2,
          category: "Added",
          text: "Feature B",
          validation: {
            complianceStatus: "failing",
            summary: {
              issues: [
                {
                  ruleId: "R001",
                  message: "Implementation details",
                  severity: "error",
                },
              ],
            },
          },
        },
        {
          index: 3,
          category: "Fixed",
          text: "Bug fix",
          validation: {
            complianceStatus: "passing",
            summary: { passed: 1 },
          },
        },
      ];

      const breakdown = auditBuilder.buildIssueBreakdown(entries);

      expect(breakdown.Added).toBeDefined();
      expect(breakdown.Added.total).toBe(2);
      expect(breakdown.Added.passed).toBe(1);
      expect(breakdown.Added.failed).toBe(1);

      expect(breakdown.Fixed).toBeDefined();
      expect(breakdown.Fixed.total).toBe(1);
      expect(breakdown.Fixed.passed).toBe(1);
    });

    test("should track issues for each category", () => {
      const entries = [
        {
          index: 1,
          category: "Added",
          text: "Feature with implementation details",
          validation: {
            complianceStatus: "failing",
            summary: {
              issues: [
                {
                  ruleId: "R001",
                  message: "Remove implementation details",
                  severity: "error",
                },
              ],
            },
          },
        },
      ];

      const breakdown = auditBuilder.buildIssueBreakdown(entries);

      expect(breakdown.Added.issues).toHaveLength(1);
      expect(breakdown.Added.issues[0].rule).toBe("R001");
      expect(breakdown.Added.issues[0].severity).toBe("error");
    });
  });

  describe("Recommendations Generation", () => {
    test("should generate rule-violation recommendations", () => {
      const failingEntries = [
        {
          index: 1,
          category: "Added",
          text: "Test",
          validation: {
            summary: {
              issues: [
                { ruleId: "R001", message: "Implementation detail found" },
              ],
            },
          },
        },
      ];

      const breakdown = {
        Added: {
          total: 1,
          passed: 0,
          failed: 1,
          issues: [
            {
              ruleId: "R001",
              message: "Implementation detail found",
            },
          ],
        },
      };

      const recommendations = auditBuilder.generateRecommendations(
        failingEntries,
        breakdown,
      );

      const ruleRec = recommendations.find((r) => r.type === "rule_violation");
      expect(ruleRec).toBeDefined();
      expect(ruleRec.rule_id).toBe("R001");
    });

    test("should generate category-focus recommendations for lowest compliance", () => {
      const failingEntries = [];
      const breakdown = {
        Added: { total: 10, passed: 8, failed: 2 },
        Fixed: { total: 5, passed: 1, failed: 4 },
      };

      const recommendations = auditBuilder.generateRecommendations(
        failingEntries,
        breakdown,
      );

      const categoryRec = recommendations.find((r) => r.type === "category_focus");
      expect(categoryRec).toBeDefined();
      expect(categoryRec.category).toBe("Fixed");
      expect(categoryRec.compliance).toBe(20);
    });

    test("should return empty recommendations for no failures", () => {
      const recommendations = auditBuilder.generateRecommendations([], {});
      expect(recommendations).toEqual([]);
    });
  });

  describe("Remediation Summary Generation", () => {
    test("should generate remediation for failing entries", () => {
      const failingEntries = [
        {
          index: 1,
          category: "Added",
          text: "User dashboard API response object structure",
          issues: [
            {
              ruleId: "R001",
              message: "Contains API names",
              severity: "error",
            },
            {
              ruleId: "R003",
              message: "Missing title",
              severity: "error",
            },
          ],
        },
      ];

      const remediations = auditBuilder.generateRemediationSummary(
        failingEntries,
      );

      expect(remediations).toHaveLength(1);
      expect(remediations[0].entry_index).toBe(1);
      expect(remediations[0].fixes_needed).toHaveLength(2);
      expect(remediations[0].fixes_needed[0].rule_id).toBe("R001");
    });

    test("should provide rule-specific fix guidance", () => {
      const failingEntries = [
        {
          index: 1,
          category: "Added",
          text: "Test entry",
          issues: [
            { ruleId: "R009", message: "Missing PR reference" },
            { ruleId: "R010", message: "PR link broken" },
          ],
        },
      ];

      const remediations = auditBuilder.generateRemediationSummary(
        failingEntries,
      );
      const fixes = remediations[0].fixes_needed;

      expect(fixes[0].fix).toContain("Add or fix PR reference");
      expect(fixes[1].fix).toContain("Verify PR reference");
    });
  });

  describe("ValidationReport Building", () => {
    test("should build complete validation report", () => {
      const auditResult = {
        audit_date: "2026-09-12T14:30:00Z",
        scope: "release:1.0.0",
        version: "1.0.0",
        total_entries: 10,
        entries: [],
        passing_entries: [
          { index: 1, category: "Added", text: "Feature A" },
          { index: 2, category: "Added", text: "Feature B" },
          { index: 3, category: "Fixed", text: "Bug fix" },
        ],
        failing_entries: [
          {
            index: 4,
            category: "Added",
            text: "Bad feature",
            validation: {
              summary: {
                issues: [
                  { ruleId: "R001", message: "Implementation details" },
                ],
              },
            },
          },
        ],
        warning_entries: [],
        compliance_percentage: 90,
      };

      const report = auditBuilder.buildValidationReport(auditResult);

      expect(report.report_date).toBe("2026-09-12T14:30:00Z");
      expect(report.scope).toBe("release:1.0.0");
      expect(report.total_entries_audited).toBe(10);
      expect(report.passed_count).toBe(3);
      expect(report.failed_count).toBe(1);
      expect(report.compliance_percentage).toBe(90);
      expect(report.compliance_status).toBe("CONDITIONAL_PASS");
    });

    test("should include issue breakdown by category", () => {
      const auditResult = {
        audit_date: "2026-09-12T14:30:00Z",
        scope: "release:1.0.0",
        version: "1.0.0",
        total_entries: 2,
        entries: [
          {
            index: 1,
            category: "Added",
            text: "Feature",
            validation: { complianceStatus: "passing" },
          },
          {
            index: 2,
            category: "Fixed",
            text: "Bug",
            validation: { complianceStatus: "failing" },
          },
        ],
        passing_entries: [
          { index: 1, category: "Added", text: "Feature" },
        ],
        failing_entries: [{ index: 2, category: "Fixed", text: "Bug" }],
        warning_entries: [],
        compliance_percentage: 50,
      };

      const report = auditBuilder.buildValidationReport(auditResult);

      expect(report.issues_by_category).toBeDefined();
      expect(report.issues_by_category.Added).toBeDefined();
      expect(report.issues_by_category.Fixed).toBeDefined();
    });

    test("should include recommendations", () => {
      const auditResult = {
        audit_date: "2026-09-12T14:30:00Z",
        scope: "release:1.0.0",
        version: "1.0.0",
        total_entries: 1,
        entries: [
          {
            index: 1,
            category: "Added",
            text: "Bad feature",
            validation: {
              summary: {
                issues: [
                  { ruleId: "R001", message: "Implementation detail" },
                ],
              },
            },
          },
        ],
        passing_entries: [],
        failing_entries: [
          {
            index: 1,
            category: "Added",
            text: "Bad feature",
            validation: {
              summary: {
                issues: [
                  { ruleId: "R001", message: "Implementation detail" },
                ],
              },
            },
          },
        ],
        warning_entries: [],
        compliance_percentage: 0,
      };

      const report = auditBuilder.buildValidationReport(auditResult);

      expect(report.recommendations).toHaveLength(1);
      expect(report.recommendations[0].type).toBe("rule_violation");
    });
  });
});
