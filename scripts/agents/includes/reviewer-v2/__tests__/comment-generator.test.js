const { CommentGenerator } = require("../comment-generator");

describe("CommentGenerator", () => {
  let generator;

  beforeEach(() => {
    generator = new CommentGenerator();
  });

  describe("initialization", () => {
    test("should create with default options", () => {
      expect(generator.options.maxFindingsPerCategory).toBe(10);
      expect(generator.options.includeToolBreakdown).toBe(true);
      expect(generator.options.includeLinks).toBe(true);
      expect(generator.options.format).toBe("markdown");
    });

    test("should accept custom options", () => {
      const customGen = new CommentGenerator({
        maxFindingsPerCategory: 5,
        format: "html",
      });

      expect(customGen.options.maxFindingsPerCategory).toBe(5);
      expect(customGen.options.format).toBe("html");
    });
  });

  describe("generate", () => {
    test("should return empty string for null input", () => {
      const result = generator.generate(null);
      expect(result).toBe("");
    });

    test("should return empty string for undefined input", () => {
      const result = generator.generate(undefined);
      expect(result).toBe("");
    });

    test("should generate no findings message when all arrays are empty", () => {
      const result = generator.generate({
        auto_resolved: [],
        suppressed: [],
        requires_review: [],
      });

      expect(result).toContain("No findings");
      expect(result).toContain("✅");
    });

    test("should generate comment with requires_review findings", () => {
      const decisions = {
        requires_review: [
          {
            id: "1",
            file: "src/app.js",
            line: 10,
            suggestion: "Security issue",
            severity: "critical",
            category: "security",
            tool: "coderabbit",
          },
        ],
        auto_resolved: [],
        suppressed: [],
      };

      const result = generator.generate(decisions);

      expect(result).toContain("Code Review Summary");
      expect(result).toContain("Requires Review");
      expect(result).toContain("Security issue");
      expect(result).toContain("1");
    });

    test("should generate comment with auto_resolved findings", () => {
      const decisions = {
        requires_review: [],
        auto_resolved: [
          {
            id: "1",
            file: "src/app.js",
            line: 10,
            suggestion: "Use const",
            severity: "minor",
            category: "code-quality",
          },
        ],
        suppressed: [],
      };

      const result = generator.generate(decisions);

      expect(result).toContain("Auto-Resolved");
      expect(result).toContain("automatically resolved");
    });

    test("should generate comment with suppressed findings", () => {
      const decisions = {
        requires_review: [],
        auto_resolved: [],
        suppressed: [
          {
            id: "1",
            file: "src/app.js",
            line: 10,
            suggestion: "Style issue",
            severity: "minor",
            category: "style",
          },
        ],
      };

      const result = generator.generate(decisions);

      expect(result).toContain("Suppressed");
      expect(result).toContain("suppressed");
    });

    test("should generate comment with all sections", () => {
      const decisions = {
        requires_review: [
          {
            id: "1",
            file: "src/app.js",
            line: 10,
            suggestion: "Critical issue",
            severity: "critical",
            category: "security",
          },
        ],
        auto_resolved: [
          {
            id: "2",
            file: "src/utils.js",
            line: 5,
            suggestion: "Minor fix",
            severity: "minor",
            category: "code-quality",
          },
        ],
        suppressed: [
          {
            id: "3",
            file: "src/style.js",
            line: 8,
            suggestion: "Style",
            severity: "minor",
            category: "style",
          },
        ],
      };

      const result = generator.generate(decisions);

      expect(result).toContain("Requires Review");
      expect(result).toContain("Auto-Resolved");
      expect(result).toContain("Suppressed");
      expect(result).toContain("1");
      expect(result).toContain("2");
      expect(result).toContain("3");
    });
  });

  describe("generateHeader", () => {
    test("should include summary counts", () => {
      const requiresReview = [{ escalated: false }, { escalated: false }];
      const autoResolved = [{}];
      const suppressed = [{}, {}];

      const result = generator.generateHeader(
        requiresReview,
        autoResolved,
        suppressed,
      );

      expect(result).toContain("Requires Review");
      expect(result).toContain("2");
      expect(result).toContain("Auto-Resolved");
      expect(result).toContain("1");
      expect(result).toContain("Suppressed");
    });

    test("should highlight escalated findings", () => {
      const requiresReview = [{ escalated: true }, { escalated: true }];
      const autoResolved = [];
      const suppressed = [];

      const result = generator.generateHeader(
        requiresReview,
        autoResolved,
        suppressed,
      );

      expect(result).toContain("🚨");
      expect(result).toContain("2 critical finding");
    });

    test("should include summary table", () => {
      const requiresReview = [{}];
      const autoResolved = [];
      const suppressed = [];

      const result = generator.generateHeader(
        requiresReview,
        autoResolved,
        suppressed,
      );

      expect(result).toContain("| Status | Count |");
      expect(result).toContain("|--------|-------|");
    });
  });

  describe("formatters", () => {
    test("formatFile should format file path", () => {
      const result = generator.formatFile("src/components/App.js");
      expect(result).toContain("App.js");
      expect(result).toContain("`");
    });

    test("formatFile should handle null", () => {
      const result = generator.formatFile(null);
      expect(result).toBe("-");
    });

    test("formatSeverity should map severity to icons", () => {
      expect(generator.formatSeverity("critical")).toContain("🔴");
      expect(generator.formatSeverity("major")).toContain("🟠");
      expect(generator.formatSeverity("minor")).toContain("🟡");
      expect(generator.formatSeverity("unknown")).toContain("⚪");
    });

    test("formatCategory should capitalize words", () => {
      expect(generator.formatCategory("code-quality")).toBe("Code Quality");
      expect(generator.formatCategory("security")).toBe("Security");
      expect(generator.formatCategory("wordpress-quality")).toBe(
        "Wordpress Quality",
      );
    });

    test("toolBadge should format tool names with icons", () => {
      expect(generator.toolBadge("coderabbit")).toContain("🐰");
      expect(generator.toolBadge("code-quality")).toContain("📊");
      expect(generator.toolBadge("copilot")).toContain("✨");
      expect(generator.toolBadge("wordpress-quality")).toContain("🔌");
      expect(generator.toolBadge("unknown")).toContain("🔧");
    });

    test("truncateMessage should limit message length", () => {
      const long = "A".repeat(100);
      const result = generator.truncateMessage(long, 30);

      expect(result.length).toBeLessThanOrEqual(33);
      expect(result).toContain("...");
    });

    test("truncateMessage should escape pipe characters", () => {
      const message = "Issue | with | pipes";
      const result = generator.truncateMessage(message, 100);

      expect(result).toContain("\\|");
    });

    test("truncateMessage should return dash for null", () => {
      const result = generator.truncateMessage(null);
      expect(result).toBe("-");
    });
  });

  describe("groupByCategory", () => {
    test("should group findings by category", () => {
      const findings = [
        { id: "1", category: "security" },
        { id: "2", category: "style" },
        { id: "3", category: "security" },
      ];

      const result = generator.groupByCategory(findings);

      expect(result.security).toHaveLength(2);
      expect(result.style).toHaveLength(1);
    });

    test("should handle findings with no category", () => {
      const findings = [{ id: "1" }, { id: "2", category: "security" }];

      const result = generator.groupByCategory(findings);

      expect(result.unknown).toHaveLength(1);
      expect(result.security).toHaveLength(1);
    });
  });

  describe("generateInlineComments", () => {
    test("should generate inline comments for findings", () => {
      const findings = [
        {
          id: "1",
          file: "src/app.js",
          line: 10,
          suggestion: "Security issue",
          severity: "critical",
          category: "security",
          tool: "coderabbit",
        },
      ];

      const result = generator.generateInlineComments(findings);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          path: "src/app.js",
          line: 10,
        }),
      );
      expect(result[0].body).toContain("CRITICAL");
      expect(result[0].body).toContain("Security issue");
    });

    test("should skip findings without file or line", () => {
      const findings = [
        { id: "1", suggestion: "No file" },
        { id: "2", file: "app.js", suggestion: "No line" },
        {
          id: "3",
          file: "src/app.js",
          line: 10,
          suggestion: "Complete",
        },
      ];

      const result = generator.generateInlineComments(findings);

      expect(result).toHaveLength(1);
      expect(result[0].path).toBe("src/app.js");
    });

    test("should return empty array for null input", () => {
      const result = generator.generateInlineComments(null);
      expect(result).toEqual([]);
    });
  });

  describe("generateInlineComment", () => {
    test("should format inline comment properly", () => {
      const finding = {
        id: "1",
        file: "src/app.js",
        line: 10,
        suggestion: "Potential issue detected",
        severity: "major",
        category: "security",
        tools: ["coderabbit", "copilot"],
        decision_reason: ["Requires review", "Not auto-resolved"],
      };

      const result = generator.generateInlineComment(finding);

      expect(result).toContain("MAJOR");
      expect(result).toContain("Potential issue detected");
      expect(result).toContain("security");
      expect(result).toContain("coderabbit");
      expect(result).toContain("copilot");
      expect(result).toContain("Requires review");
    });

    test("should handle finding with minimal data", () => {
      const finding = {
        suggestion: "Issue",
      };

      const result = generator.generateInlineComment(finding);

      expect(result).toContain("Issue");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("generateSummaryStats", () => {
    test("should count findings by severity", () => {
      const findings = [
        { severity: "critical" },
        { severity: "critical" },
        { severity: "major" },
        { severity: "minor" },
      ];

      const result = generator.generateSummaryStats(findings);

      expect(result.by_severity.critical).toBe(2);
      expect(result.by_severity.major).toBe(1);
      expect(result.by_severity.minor).toBe(1);
      expect(result.total).toBe(4);
    });

    test("should count findings by category", () => {
      const findings = [
        { category: "security" },
        { category: "security" },
        { category: "style" },
      ];

      const result = generator.generateSummaryStats(findings);

      expect(result.by_category.security).toBe(2);
      expect(result.by_category.style).toBe(1);
    });

    test("should count findings by tool", () => {
      const findings = [
        { tool: "coderabbit" },
        { tools: ["coderabbit", "copilot"] },
        { tool: "copilot" },
      ];

      const result = generator.generateSummaryStats(findings);

      expect(result.by_tool.coderabbit).toBe(2);
      expect(result.by_tool.copilot).toBe(2);
    });
  });

  describe("generateFindingsTable", () => {
    test("should create markdown table", () => {
      const findings = [
        {
          id: "1",
          file: "src/app.js",
          line: 10,
          suggestion: "Issue",
          severity: "major",
          category: "code-quality",
          tool: "coderabbit",
        },
      ];

      const result = generator.generateFindingsTable(findings);

      expect(result).toContain("| File | Line | Severity");
      expect(result).toContain("app.js");
      expect(result).toContain("10");
      expect(result).toContain("🟠");
    });

    test("should truncate long findings", () => {
      const gen = new CommentGenerator({ maxFindingsPerCategory: 2 });
      const findings = Array.from({ length: 5 }, (_, i) => ({
        id: String(i),
        file: "app.js",
        line: i,
        suggestion: "Issue",
        severity: "minor",
        category: "code-quality",
      }));

      const result = gen.generateFindingsTable(findings);

      expect(result).toContain("... and 3 more");
    });
  });

  describe("edge cases", () => {
    test("should handle findings with multiple tools", () => {
      const decisions = {
        requires_review: [
          {
            id: "1",
            file: "app.js",
            line: 10,
            suggestion: "Issue",
            severity: "major",
            category: "security",
            tools: ["coderabbit", "copilot", "code-quality"],
          },
        ],
        auto_resolved: [],
        suppressed: [],
      };

      const result = generator.generate(decisions);

      expect(result).toContain("coderabbit");
      expect(result).toContain("copilot");
      expect(result).toContain("code-quality");
    });

    test("should handle escalated findings prominently", () => {
      const decisions = {
        requires_review: [
          {
            id: "1",
            file: "app.js",
            line: 10,
            suggestion: "Critical issue",
            severity: "critical",
            category: "security",
            escalated: true,
          },
        ],
        auto_resolved: [],
        suppressed: [],
      };

      const result = generator.generate(decisions);

      expect(result).toContain("🚨");
      expect(result).toContain("Critical/Escalated");
    });

    test("should handle empty suggestion text", () => {
      const findings = [
        {
          id: "1",
          file: "app.js",
          line: 10,
          suggestion: "",
          severity: "major",
          category: "code-quality",
        },
      ];

      const result = generator.generateFindingsTable(findings);

      expect(result).toContain("app.js");
    });

    test("should generate footer with action items", () => {
      const decisions = {
        requires_review: [{}],
        auto_resolved: [{}],
        suppressed: [],
      };

      const result = generator.generate(decisions);

      expect(result).toContain("Review Actions");
      expect(result).toContain("[ ]");
      expect(result).toContain("auto-resolved");
    });
  });

  describe("reset", () => {
    test("should have reset method", () => {
      expect(() => generator.reset()).not.toThrow();
    });
  });
});
