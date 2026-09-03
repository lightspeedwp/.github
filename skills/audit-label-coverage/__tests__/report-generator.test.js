const { ReportGenerator } = require("../lib/report-generator");

describe("ReportGenerator", () => {
  let generator;

  const mockAuditResult = {
    total: 10,
    fullyLabeled: 3,
    partiallyLabeled: 5,
    unlabeled: 2,
    averageCoverage: 72.5,
    familyCoverage: {
      type: { labeled: 10, coverage: 100 },
      status: { labeled: 8, coverage: 80 },
      priority: { labeled: 6, coverage: 60 },
      area: { labeled: 7, coverage: 70 },
    },
    topMissingLabels: [
      { family: "priority", count: 4, percentage: 40 },
      { family: "area", count: 3, percentage: 30 },
    ],
    topSuggestedLabels: [
      { label: "status:needs-triage", count: 5 },
      { label: "priority:normal", count: 4 },
    ],
    issues: [
      {
        number: 1,
        title: "Bug in auth",
        coverage: 100,
        missing: {},
        suggestions: [],
      },
      {
        number: 2,
        title: "Feature request",
        coverage: 50,
        missing: { status: true, priority: true },
        suggestions: ["status:needs-triage", "priority:normal"],
      },
    ],
  };

  beforeEach(() => {
    generator = new ReportGenerator();
  });

  describe("generateCliReport", () => {
    test("generates formatted CLI output", () => {
      const output = generator.generateCliReport(mockAuditResult);

      expect(output).toContain("Label Coverage Audit Report");
      expect(output).toContain("Total Issues: 10");
      expect(output).toContain("Fully Labeled");
      expect(output).toContain("3");
      expect(output).toContain("Partially Labeled");
      expect(output).toContain("5");
      expect(output).toContain("Average Coverage: 72.5%");
    });

    test("includes family coverage table", () => {
      const output = generator.generateCliReport(mockAuditResult);

      expect(output).toContain("type");
      expect(output).toContain("100%");
      expect(output).toContain("status");
      expect(output).toContain("80%");
      expect(output).toContain("priority");
      expect(output).toContain("60%");
    });

    test("includes top missing labels section", () => {
      const output = generator.generateCliReport(mockAuditResult);

      expect(output).toContain("TOP MISSING LABEL FAMILIES");
      expect(output).toContain("priority");
      expect(output).toContain("4");
      expect(output).toContain("40%");
    });

    test("includes top suggested labels section", () => {
      const output = generator.generateCliReport(mockAuditResult);

      expect(output).toContain("TOP SUGGESTED LABELS");
      expect(output).toContain("status:needs-triage");
      expect(output).toContain("5");
    });

    test("handles edge case with no issues", () => {
      const emptyResult = {
        total: 0,
        fullyLabeled: 0,
        partiallyLabeled: 0,
        unlabeled: 0,
        averageCoverage: 0,
        familyCoverage: {},
        topMissingLabels: [],
        topSuggestedLabels: [],
        issues: [],
      };

      const output = generator.generateCliReport(emptyResult);

      expect(output).toContain("Total Issues: 0");
      expect(output).not.toThrow;
    });
  });

  describe("generateMarkdownReport", () => {
    test("generates valid markdown", () => {
      const markdown = generator.generateMarkdownReport(mockAuditResult);

      expect(markdown).toMatch(/^#+ Label Coverage Audit Report/m);
      expect(markdown).toContain("## Summary");
      expect(markdown).toContain("## Family Coverage");
      expect(markdown).toContain("## Recommendations");
    });

    test("includes summary metrics", () => {
      const markdown = generator.generateMarkdownReport(mockAuditResult);

      expect(markdown).toContain("**Total Issues:** 10");
      expect(markdown).toContain("**Fully Labeled:** 3 (30%)");
      expect(markdown).toContain("**Average Coverage:** 72.5%");
    });

    test("includes detailed family breakdown", () => {
      const markdown = generator.generateMarkdownReport(mockAuditResult);

      expect(markdown).toContain("| type |");
      expect(markdown).toContain("| 10 |");
      expect(markdown).toContain("| 100% |");
      expect(markdown).toContain("| status |");
      expect(markdown).toContain("| 80% |");
    });

    test("includes recommendations section", () => {
      const markdown = generator.generateMarkdownReport(mockAuditResult);

      expect(markdown).toContain("### High Priority Gaps");
      expect(markdown).toContain("40% missing");
      expect(markdown).toContain("priority");
      expect(markdown).toContain(
        "Most common suggestion: `status:needs-triage`",
      );
    });

    test("includes actionable steps", () => {
      const markdown = generator.generateMarkdownReport(mockAuditResult);

      expect(markdown).toContain("## Next Steps");
      expect(markdown).toContain("Review low-coverage issues");
      expect(markdown).toContain("Apply suggested labels");
    });
  });

  describe("generateJsonReport", () => {
    test("generates valid JSON structure", () => {
      const json = generator.generateJsonReport(mockAuditResult);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveProperty("metadata");
      expect(parsed).toHaveProperty("summary");
      expect(parsed).toHaveProperty("familyCoverage");
      expect(parsed).toHaveProperty("topMissingLabels");
      expect(parsed).toHaveProperty("issues");
    });

    test("includes all relevant data", () => {
      const json = generator.generateJsonReport(mockAuditResult);
      const parsed = JSON.parse(json);

      expect(parsed.summary.total).toBe(10);
      expect(parsed.summary.fullyLabeled).toBe(3);
      expect(parsed.summary.averageCoverage).toBe(72.5);
    });

    test("preserves issue-level details", () => {
      const json = generator.generateJsonReport(mockAuditResult);
      const parsed = JSON.parse(json);

      expect(parsed.issues).toHaveLength(2);
      expect(parsed.issues[0]).toHaveProperty("number");
      expect(parsed.issues[0]).toHaveProperty("title");
      expect(parsed.issues[0]).toHaveProperty("coverage");
      expect(parsed.issues[0]).toHaveProperty("suggestions");
    });

    test("includes metadata with timestamp", () => {
      const json = generator.generateJsonReport(mockAuditResult);
      const parsed = JSON.parse(json);

      expect(parsed.metadata).toHaveProperty("timestamp");
      expect(parsed.metadata).toHaveProperty("format");
      expect(parsed.metadata.format).toBe("json");
    });
  });

  describe("recommendations", () => {
    test("prioritizes high-impact recommendations", () => {
      const markdown = generator.generateMarkdownReport(mockAuditResult);

      // Priority should appear before area since it has higher missing %
      const priorityIndex = markdown.indexOf("priority");
      const areaIndex = markdown.indexOf("area");

      expect(priorityIndex).toBeLessThan(areaIndex);
    });

    test("suggests most common missing labels", () => {
      const markdown = generator.generateMarkdownReport(mockAuditResult);

      expect(markdown).toContain("status:needs-triage");
    });

    test("includes automation suggestions", () => {
      const markdown = generator.generateMarkdownReport(mockAuditResult);

      expect(markdown).toContain("bulk");
      expect(markdown).toContain("Suggested bulk labels");
    });
  });

  describe("output formats", () => {
    test("generateCliReport returns string", () => {
      const output = generator.generateCliReport(mockAuditResult);
      expect(typeof output).toBe("string");
      expect(output.length).toBeGreaterThan(0);
    });

    test("generateMarkdownReport returns valid markdown", () => {
      const markdown = generator.generateMarkdownReport(mockAuditResult);
      expect(markdown).toContain("#");
      expect(markdown).toContain("|");
    });

    test("generateJsonReport returns valid JSON", () => {
      const json = generator.generateJsonReport(mockAuditResult);
      expect(() => JSON.parse(json)).not.toThrow();
    });

    test("all formats contain summary", () => {
      const cli = generator.generateCliReport(mockAuditResult);
      const markdown = generator.generateMarkdownReport(mockAuditResult);
      const json = generator.generateJsonReport(mockAuditResult);
      const parsed = JSON.parse(json);

      expect(cli).toContain("10");
      expect(markdown).toContain("10");
      expect(parsed.summary.total).toBe(10);
    });
  });
});
