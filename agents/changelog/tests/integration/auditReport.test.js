/**
 * Audit Report Integration Tests
 * Tests full audit workflow (parse → validate → report)
 */

const fs = require("fs");
const path = require("path");
const agent = require("../../changelog.agent.js");
const auditBuilder = require("../../includes/auditReportBuilder.cjs");
const markdownGenerator = require("../../includes/markdownReportGenerator.cjs");

const TEST_DIR = path.join(__dirname, "../fixtures");
const TEST_CHANGELOG = path.join(TEST_DIR, "CHANGELOG_AUDIT.md");
const REPORTS_DIR = path.join(TEST_DIR, "reports");

// Ensure test fixtures directory exists
beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
});

// Clean up test files after tests
afterAll(() => {
  // Clean up reports
  if (fs.existsSync(REPORTS_DIR)) {
    fs.rmSync(REPORTS_DIR, { recursive: true, force: true });
  }
});

describe("Audit Report Workflow Integration", () => {
  describe("Release Audit End-to-End", () => {
    beforeAll(() => {
      // Create a test changelog with multiple entries
      const changelogContent = `# Changelog

## [Unreleased]

### Added
- Feature not yet released

## [1.0.0] - 2026-09-12

### Added
- User dashboard with analytics
- Real-time notifications for important events
- Mobile app support for iOS and Android

### Fixed
- Authentication timeout issue that affected login flow
- Database query performance improved by 40%

### Security
- Fixed XSS vulnerability in user input validation
- Updated dependencies to latest secure versions

### Deprecated
- Legacy API endpoints will be removed in v2.0

## [0.9.0] - 2026-09-01

### Added
- Beta support for integrations
`;

      fs.writeFileSync(TEST_CHANGELOG, changelogContent, "utf8");
    });

    afterAll(() => {
      if (fs.existsSync(TEST_CHANGELOG)) {
        fs.unlinkSync(TEST_CHANGELOG);
      }
    });

    test("should audit release entries and generate validation report", async () => {
      const auditResult = await agent.auditRelease(
        TEST_CHANGELOG,
        "1.0.0",
      );

      expect(auditResult.success).toBe(true);
      expect(auditResult.version).toBe("1.0.0");
      expect(auditResult.scope).toBe("release:1.0.0");
      expect(auditResult.total_entries).toBeGreaterThan(0);
      expect(auditResult.entries).toBeInstanceOf(Array);
      expect(auditResult.compliance_percentage).toBeDefined();
    });

    test("should build comprehensive ValidationReport", async () => {
      const auditResult = await agent.auditRelease(
        TEST_CHANGELOG,
        "1.0.0",
      );
      const report = auditBuilder.buildValidationReport(auditResult);

      expect(report).toHaveProperty("report_date");
      expect(report).toHaveProperty("scope");
      expect(report.scope).toBe("release:1.0.0");
      expect(report).toHaveProperty("total_entries_audited");
      expect(report).toHaveProperty("passed_count");
      expect(report).toHaveProperty("failed_count");
      expect(report).toHaveProperty("compliance_percentage");
      expect(report).toHaveProperty("compliance_status");
      expect(report).toHaveProperty("issues_by_category");
      expect(report).toHaveProperty("passing_entries");
      expect(report).toHaveProperty("recommendations");
    });

    test("should determine compliance status correctly", async () => {
      const auditResult = await agent.auditRelease(
        TEST_CHANGELOG,
        "1.0.0",
      );
      const report = auditBuilder.buildValidationReport(auditResult);

      // Compliance status should be one of the valid values
      expect(["PASS", "CONDITIONAL_PASS", "FAIL"]).toContain(
        report.compliance_status,
      );

      // Compliance status should match percentage
      if (report.compliance_percentage === 100) {
        expect(report.compliance_status).toBe("PASS");
      } else if (report.compliance_percentage >= 90) {
        expect(report.compliance_status).toBe("CONDITIONAL_PASS");
      } else {
        expect(report.compliance_status).toBe("FAIL");
      }
    });

    test("should generate human-readable Markdown report", async () => {
      const auditResult = await agent.auditRelease(
        TEST_CHANGELOG,
        "1.0.0",
      );
      const report = auditBuilder.buildValidationReport(auditResult);
      const markdown = markdownGenerator.generateMarkdownReport(report);

      expect(markdown).toContain("# Changelog Quality Audit Report");
      expect(markdown).toContain("Version");
      expect(markdown).toContain("1.0.0");
      expect(markdown).toContain("Compliance");
      expect(markdown).toContain("%");
      expect(markdown).toContain("Passing");
    });

    test("should save report to disk", async () => {
      const auditResult = await agent.auditRelease(
        TEST_CHANGELOG,
        "1.0.0",
      );
      const report = auditBuilder.buildValidationReport(auditResult);
      const saveResult = auditBuilder.saveReport(report, REPORTS_DIR);

      expect(saveResult.success).toBe(true);
      expect(saveResult.file_path).toBeDefined();
      expect(fs.existsSync(saveResult.file_path)).toBe(true);

      // Verify saved file contents
      const savedContent = fs.readFileSync(saveResult.file_path, "utf8");
      const savedReport = JSON.parse(savedContent);
      expect(savedReport.version).toBe("1.0.0");
      expect(savedReport.scope).toBe("release:1.0.0");
    });

    test("should calculate compliance percentage correctly", async () => {
      const auditResult = await agent.auditRelease(
        TEST_CHANGELOG,
        "1.0.0",
      );

      const passed = auditResult.passing_entries.length;
      const total = auditResult.total_entries;
      const expectedCompliance = total > 0 ? (passed / total) * 100 : 0;

      expect(auditResult.compliance_percentage).toBe(
        Math.round(expectedCompliance * 10) / 10,
      );
    });

    test("should categorize issues by category", async () => {
      const auditResult = await agent.auditRelease(
        TEST_CHANGELOG,
        "1.0.0",
      );
      const report = auditBuilder.buildValidationReport(auditResult);

      // Should have issues_by_category with statistics
      expect(Object.keys(report.issues_by_category).length).toBeGreaterThan(
        0,
      );

      for (const category in report.issues_by_category) {
        const stats = report.issues_by_category[category];
        expect(stats).toHaveProperty("total");
        expect(stats).toHaveProperty("passed");
        expect(stats).toHaveProperty("failed");
      }
    });

    test("should handle non-existent version gracefully", async () => {
      const auditResult = await agent.auditRelease(
        TEST_CHANGELOG,
        "99.99.99",
      );

      expect(auditResult.success).toBe(false);
      expect(auditResult.error).toBeDefined();
      expect(auditResult.status).toBe("failed");
    });
  });

  describe("Report Generation Utilities", () => {
    test("should generate remediation summary for failing entries", () => {
      const failingEntries = [
        {
          index: 1,
          category: "Added",
          text: "New dashboard feature",
          issues: [
            {
              ruleId: "R001",
              message: "Contains implementation details",
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
      expect(remediations[0].fixes_needed).toHaveLength(1);
      expect(remediations[0].fixes_needed[0].rule_id).toBe("R001");
    });

    test("should format status badges correctly", () => {
      expect(markdownGenerator.getStatusBadge("PASS")).toContain("✅");
      expect(markdownGenerator.getStatusBadge("CONDITIONAL_PASS")).toContain(
        "⚠️",
      );
      expect(markdownGenerator.getStatusBadge("FAIL")).toContain("❌");
    });
  });
});
