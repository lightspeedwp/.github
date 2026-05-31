const fs = require("fs");
const path = require("path");
const os = require("os");
const {
  ciDesignMdCheck,
  generatePrComment,
  parseJsonReport,
} = require("../ciDesignMdCheck");

describe("ciDesignMdCheck", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ci-design-md-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe("parseJsonReport", () => {
    it("should parse valid JSON report", () => {
      const jsonFile = path.join(tempDir, "report.json");
      const report = {
        summary: {
          errors: 2,
          warnings: 5,
          infos: 1,
        },
        findings: [
          { severity: "error", path: "section", message: "Missing section" },
          { severity: "warning", path: null, message: "Style issue" },
        ],
      };

      fs.writeFileSync(jsonFile, JSON.stringify(report));

      const result = parseJsonReport(jsonFile);
      expect(result.errors).toBe(2);
      expect(result.warnings).toBe(5);
      expect(result.infos).toBe(1);
      expect(result.findings).toHaveLength(2);
    });

    it("should return defaults for non-existent file", () => {
      const result = parseJsonReport("/nonexistent/file.json");
      expect(result.errors).toBe(0);
      expect(result.warnings).toBe(0);
      expect(result.infos).toBe(0);
      expect(result.findings).toEqual([]);
    });

    it("should handle invalid JSON gracefully", () => {
      const jsonFile = path.join(tempDir, "invalid.json");
      fs.writeFileSync(jsonFile, "not valid json");

      const result = parseJsonReport(jsonFile);
      expect(result.errors).toBe(0);
      expect(result.warnings).toBe(0);
      expect(result.infos).toBe(0);
    });

    it("should handle missing summary fields", () => {
      const jsonFile = path.join(tempDir, "partial.json");
      fs.writeFileSync(jsonFile, JSON.stringify({ findings: [] }));

      const result = parseJsonReport(jsonFile);
      expect(result.errors).toBe(0);
      expect(result.warnings).toBe(0);
      expect(result.infos).toBe(0);
    });
  });

  describe("generatePrComment", () => {
    it("should generate comment with findings", () => {
      const jsonFile = path.join(tempDir, "report.json");
      const commentFile = path.join(tempDir, "comment.md");

      const report = {
        summary: {
          errors: 2,
          warnings: 3,
          infos: 0,
        },
        findings: [
          {
            severity: "error",
            path: "Colors",
            message: "Colors section missing",
          },
          {
            severity: "warning",
            path: "Typography",
            message: "Typography incomplete",
          },
        ],
      };

      fs.writeFileSync(jsonFile, JSON.stringify(report));
      generatePrComment(jsonFile, commentFile);

      const comment = fs.readFileSync(commentFile, "utf8");
      expect(comment).toContain("## DESIGN.md Lint Summary");
      expect(comment).toContain("- Errors: 2");
      expect(comment).toContain("- Warnings: 3");
      expect(comment).toContain("- Infos: 0");
      expect(comment).toContain("ERROR");
      expect(comment).toContain("WARNING");
      expect(comment).toContain("Colors section missing");
    });

    it("should handle empty findings", () => {
      const jsonFile = path.join(tempDir, "report.json");
      const commentFile = path.join(tempDir, "comment.md");

      const report = {
        summary: {
          errors: 0,
          warnings: 0,
          infos: 0,
        },
        findings: [],
      };

      fs.writeFileSync(jsonFile, JSON.stringify(report));
      generatePrComment(jsonFile, commentFile);

      const comment = fs.readFileSync(commentFile, "utf8");
      expect(comment).toContain("No findings reported by the CLI");
    });

    it("should limit findings to top 10", () => {
      const jsonFile = path.join(tempDir, "report.json");
      const commentFile = path.join(tempDir, "comment.md");

      const findings = Array.from({ length: 20 }, (_, i) => ({
        severity: "warning",
        path: `section${i}`,
        message: `Issue ${i}`,
      }));

      const report = {
        summary: { errors: 0, warnings: 20, infos: 0 },
        findings,
      };

      fs.writeFileSync(jsonFile, JSON.stringify(report));
      generatePrComment(jsonFile, commentFile);

      const comment = fs.readFileSync(commentFile, "utf8");
      expect(comment).toContain("Issue 0");
      expect(comment).toContain("Issue 9");
      expect(comment).not.toContain("Issue 15");
    });

    it("should include markdown formatting", () => {
      const jsonFile = path.join(tempDir, "report.json");
      const commentFile = path.join(tempDir, "comment.md");

      const report = {
        summary: { errors: 1, warnings: 0, infos: 0 },
        findings: [{ severity: "error", path: "Colors", message: "Missing" }],
      };

      fs.writeFileSync(jsonFile, JSON.stringify(report));
      generatePrComment(jsonFile, commentFile);

      const comment = fs.readFileSync(commentFile, "utf8");
      expect(comment).toContain("<!-- design-md-lint-comment -->");
      expect(comment).toContain("**ERROR**");
      expect(comment).toContain("`Colors`");
    });

    it("should include report file reference", () => {
      const jsonFile = path.join(tempDir, "report.json");
      const commentFile = path.join(tempDir, "comment.md");

      const report = {
        summary: { errors: 0, warnings: 0, infos: 0 },
        findings: [],
      };

      fs.writeFileSync(jsonFile, JSON.stringify(report));
      generatePrComment(jsonFile, commentFile);

      const comment = fs.readFileSync(commentFile, "utf8");
      expect(comment).toContain("design-md-validation-report.md");
    });

    it("should handle findings without path", () => {
      const jsonFile = path.join(tempDir, "report.json");
      const commentFile = path.join(tempDir, "comment.md");

      const report = {
        summary: { errors: 0, warnings: 1, infos: 0 },
        findings: [{ severity: "warning", message: "Generic warning" }],
      };

      fs.writeFileSync(jsonFile, JSON.stringify(report));
      generatePrComment(jsonFile, commentFile);

      const comment = fs.readFileSync(commentFile, "utf8");
      expect(comment).toContain("WARNING");
      expect(comment).toContain("Generic warning");
    });

    it("should handle various severity levels", () => {
      const jsonFile = path.join(tempDir, "report.json");
      const commentFile = path.join(tempDir, "comment.md");

      const report = {
        summary: { errors: 0, warnings: 0, infos: 0 },
        findings: [
          { severity: "error", path: "A", message: "Error" },
          { severity: "warning", path: "B", message: "Warning" },
          { severity: "info", path: "C", message: "Info" },
        ],
      };

      fs.writeFileSync(jsonFile, JSON.stringify(report));
      generatePrComment(jsonFile, commentFile);

      const comment = fs.readFileSync(commentFile, "utf8");
      expect(comment).toContain("**ERROR**");
      expect(comment).toContain("**WARNING**");
      expect(comment).toContain("**INFO**");
    });
  });
});
