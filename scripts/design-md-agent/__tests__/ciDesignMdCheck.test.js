const fs = require("fs");
const path = require("path");
const os = require("os");
const { _execSync } = require("child_process");
const {
  ciDesignMdCheck,
  generatePrComment,
  parseJsonReport,
  runLintWithAvailableCli,
} = require("../ciDesignMdCheck");

jest.mock("../validateDesignMd", () => ({
  validateDesignMd: jest.fn(),
  findDesignMdCliCmd: jest.fn(),
}));

const { validateDesignMd, findDesignMdCliCmd } = require("../validateDesignMd");

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

  describe("runLintWithAvailableCli", () => {
    it("should return false if no CLI command found", () => {
      findDesignMdCliCmd.mockReturnValue({
        cmd: null,
        source: "not available",
      });

      const designFile = path.join(tempDir, "DESIGN.md");
      const jsonFile = path.join(tempDir, "report.json");
      fs.writeFileSync(designFile, "# Test");

      const result = runLintWithAvailableCli(designFile, jsonFile);
      expect(result).toBe(false);
    });

    it("should return true when CLI successfully generates JSON report", () => {
      findDesignMdCliCmd.mockReturnValue({ cmd: "echo", cwd: "." });

      const designFile = path.join(tempDir, "DESIGN.md");
      const jsonFile = path.join(tempDir, "report.json");
      const mockOutput = JSON.stringify({ summary: { errors: 0 } });

      fs.writeFileSync(designFile, "# Test");

      // Mock the child_process module's execSync to return valid JSON
      const childProcess = require("child_process");
      const originalExecSync = childProcess.execSync;
      childProcess.execSync = jest.fn().mockReturnValue(mockOutput);

      const result = runLintWithAvailableCli(designFile, jsonFile);
      expect(result).toBe(true);
      expect(fs.existsSync(jsonFile)).toBe(true);

      childProcess.execSync = originalExecSync;
    });

    it("should return false when error has no stdout", () => {
      findDesignMdCliCmd.mockReturnValue({ cmd: "test-cmd", cwd: "." });

      const designFile = path.join(tempDir, "DESIGN.md");
      const jsonFile = path.join(tempDir, "report.json");

      fs.writeFileSync(designFile, "# Test");

      const error = new Error("Command failed");
      error.stderr = "Some stderr output";

      // Mock the child_process module's execSync to throw without stdout
      const childProcess = require("child_process");
      const originalExecSync = childProcess.execSync;
      childProcess.execSync = jest.fn().mockImplementation(() => {
        throw error;
      });

      const result = runLintWithAvailableCli(designFile, jsonFile);
      expect(result).toBe(false);

      childProcess.execSync = originalExecSync;
    });
  });

  describe("ciDesignMdCheck", () => {
    it("should exit with error if DESIGN.md not found", () => {
      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
      const errorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      ciDesignMdCheck(tempDir);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("DESIGN.md not found"),
      );
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it("should exit with error if validation fails", () => {
      const designFile = path.join(tempDir, "DESIGN.md");
      fs.writeFileSync(designFile, "# Invalid");

      validateDesignMd.mockImplementation(() => {
        throw new Error("Validation failed");
      });

      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
      const errorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      ciDesignMdCheck(tempDir);

      expect(errorSpy).toHaveBeenCalledWith("Validation failed");
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it("should exit with error if CLI not found", () => {
      const designFile = path.join(tempDir, "DESIGN.md");
      fs.writeFileSync(designFile, "# Test");

      validateDesignMd.mockImplementation(() => {});
      findDesignMdCliCmd.mockReturnValue({ cmd: null });

      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
      const errorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      ciDesignMdCheck(tempDir);

      expect(errorSpy).toHaveBeenCalled();
      const firstCall = errorSpy.mock.calls[0];
      expect(firstCall[0]).toContain("No runnable DESIGN.md CLI");
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it("should exit with error if lint finds errors", () => {
      const designFile = path.join(tempDir, "DESIGN.md");
      const jsonFile = path.join(tempDir, "designmd-lint.json");
      fs.writeFileSync(designFile, "# Test");

      const report = {
        summary: { errors: 3, warnings: 0, infos: 0 },
        findings: [{ severity: "error", message: "Test error" }],
      };
      fs.writeFileSync(jsonFile, JSON.stringify(report));

      validateDesignMd.mockImplementation(() => {});
      findDesignMdCliCmd.mockReturnValue({ cmd: "test-cmd", cwd: "." });

      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
      const errorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      ciDesignMdCheck(tempDir);

      expect(errorSpy).toHaveBeenCalled();
      const lastCall = errorSpy.mock.calls[errorSpy.mock.calls.length - 1];
      expect(lastCall[0]).toContain("lint failed with 3 error");
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it("should exit with success if validation and lint pass", () => {
      const designFile = path.join(tempDir, "DESIGN.md");
      const jsonFile = path.join(tempDir, "designmd-lint.json");
      fs.writeFileSync(designFile, "# Test");

      const report = {
        summary: { errors: 0, warnings: 0, infos: 0 },
        findings: [],
      };

      validateDesignMd.mockImplementation(() => {});
      findDesignMdCliCmd.mockReturnValue({ cmd: "test-cmd", cwd: "." });

      const childProcess = require("child_process");
      const originalExecSync = childProcess.execSync;
      childProcess.execSync = jest.fn().mockImplementation(() => {
        fs.writeFileSync(jsonFile, JSON.stringify(report));
        return JSON.stringify(report);
      });

      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      ciDesignMdCheck(tempDir);

      expect(logSpy).toHaveBeenCalled();
      const lastCall = logSpy.mock.calls[logSpy.mock.calls.length - 1];
      expect(lastCall[0]).toContain("validation completed");
      expect(exitSpy).toHaveBeenCalledWith(0);

      exitSpy.mockRestore();
      logSpy.mockRestore();
      childProcess.execSync = originalExecSync;
    });
  });
});
