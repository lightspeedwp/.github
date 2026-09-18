"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const {
  validateProjectLinking,
  validateIssueNumbers,
} = require("../lib/project-linking-validator");

describe("project-linking-validator", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "project-linking-"));
  });

  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  // ---------------------------------------------------------------------------
  // validateProjectLinking tests
  // ---------------------------------------------------------------------------

  describe("validateProjectLinking", () => {
    it("returns all zeros when path does not exist", () => {
      const result = validateProjectLinking("/nonexistent/path");
      expect(result.projectsFound).toBe(0);
      expect(result.projectsWithLinks).toBe(0);
      expect(result.missingLinks).toEqual([]);
      expect(result.valid).toBe(false);
    });

    it("finds projects and counts them correctly", () => {
      fs.mkdirSync(path.join(tmpDir, "project-1"));
      fs.mkdirSync(path.join(tmpDir, "project-2"));
      fs.mkdirSync(path.join(tmpDir, "project-3"));

      const result = validateProjectLinking(tmpDir);
      expect(result.projectsFound).toBe(3);
    });

    it("counts projects with Related Issues section", () => {
      // Project with Related Issues section
      fs.mkdirSync(path.join(tmpDir, "project-1"));
      fs.writeFileSync(
        path.join(tmpDir, "project-1", "README.md"),
        "# Project 1\n\n## Related Issues\n\n- #123",
      );

      // Project without Related Issues section
      fs.mkdirSync(path.join(tmpDir, "project-2"));
      fs.writeFileSync(
        path.join(tmpDir, "project-2", "README.md"),
        "# Project 2\n\nNo issues here",
      );

      const result = validateProjectLinking(tmpDir);
      expect(result.projectsFound).toBe(2);
      expect(result.projectsWithLinks).toBe(1);
      expect(result.missingLinks).toContain("project-2");
    });

    it("accepts emoji-prefixed Related Issues headers", () => {
      fs.mkdirSync(path.join(tmpDir, "emoji-project"));
      fs.writeFileSync(
        path.join(tmpDir, "emoji-project", "README.md"),
        "# Project\n\n## 🔗 Related Issues\n\n- #456",
      );

      const result = validateProjectLinking(tmpDir);
      expect(result.projectsWithLinks).toBe(1);
    });

    it("detects missing README.md files", () => {
      fs.mkdirSync(path.join(tmpDir, "no-readme"));

      const result = validateProjectLinking(tmpDir);
      expect(result.projectsFound).toBe(1);
      expect(result.projectsWithLinks).toBe(0);
      expect(result.missingLinks).toContain("no-readme");
      expect(result.valid).toBe(false);
    });

    it("marks validation as invalid when projects lack Related Issues", () => {
      fs.mkdirSync(path.join(tmpDir, "bad-project"));
      fs.writeFileSync(
        path.join(tmpDir, "bad-project", "README.md"),
        "# Just a project",
      );

      const result = validateProjectLinking(tmpDir);
      expect(result.valid).toBe(false);
    });

    it("marks validation as valid when all projects have Related Issues", () => {
      fs.mkdirSync(path.join(tmpDir, "good-project"));
      fs.writeFileSync(
        path.join(tmpDir, "good-project", "README.md"),
        "# Project\n\n## Related Issues\n\n- #789",
      );

      const result = validateProjectLinking(tmpDir);
      expect(result.valid).toBe(true);
    });

    it("ignores non-directory entries", () => {
      fs.mkdirSync(path.join(tmpDir, "project-1"));
      fs.writeFileSync(path.join(tmpDir, "project-1", "README.md"), "# P1");
      fs.writeFileSync(path.join(tmpDir, "README.txt"), "Some file");

      const result = validateProjectLinking(tmpDir);
      expect(result.projectsFound).toBe(1);
    });

    it("handles multiple Related Issues sections", () => {
      fs.mkdirSync(path.join(tmpDir, "multi-issue"));
      fs.writeFileSync(
        path.join(tmpDir, "multi-issue", "README.md"),
        "# Project\n\n## Related Issues\n\n- #111\n- #222",
      );

      const result = validateProjectLinking(tmpDir);
      expect(result.projectsWithLinks).toBe(1);
    });

    it("case-sensitive headers match Related Issues", () => {
      fs.mkdirSync(path.join(tmpDir, "case-sensitive"));
      fs.writeFileSync(
        path.join(tmpDir, "case-sensitive", "README.md"),
        "# Project\n\n## related issues\n\n(lowercase should not match)",
      );

      const result = validateProjectLinking(tmpDir);
      expect(result.projectsWithLinks).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // validateIssueNumbers tests
  // ---------------------------------------------------------------------------

  describe("validateIssueNumbers", () => {
    it("returns empty array when path does not exist", () => {
      const result = validateIssueNumbers("/nonexistent/path");
      expect(result.invalidIssues).toEqual([]);
      expect(result.valid).toBe(true);
    });

    it("validates valid issue numbers", () => {
      fs.mkdirSync(path.join(tmpDir, "valid-project"));
      fs.writeFileSync(
        path.join(tmpDir, "valid-project", "README.md"),
        "# Project\n\n## Related Issues\n\n- #1\n- #12\n- #123\n- #1234\n- #12345",
      );

      const result = validateIssueNumbers(tmpDir);
      expect(result.invalidIssues).toEqual([]);
      expect(result.valid).toBe(true);
    });

    it("detects invalid issue numbers (too many digits)", () => {
      fs.mkdirSync(path.join(tmpDir, "invalid-project"));
      fs.writeFileSync(
        path.join(tmpDir, "invalid-project", "README.md"),
        "# Project\n\n- #123456 (too many digits)",
      );

      const result = validateIssueNumbers(tmpDir);
      expect(result.invalidIssues).toContainEqual({
        project: "invalid-project",
        issue: "123456",
      });
      expect(result.valid).toBe(false);
    });

    it("detects issue numbers with leading zeros", () => {
      fs.mkdirSync(path.join(tmpDir, "leading-zeros"));
      fs.writeFileSync(
        path.join(tmpDir, "leading-zeros", "README.md"),
        "# Project\n\n- #00123",
      );

      const result = validateIssueNumbers(tmpDir);
      expect(result.invalidIssues.length).toBe(0); // #00123 is valid (5 digits)
      expect(result.valid).toBe(true);
    });

    it("ignores non-issue number patterns", () => {
      fs.mkdirSync(path.join(tmpDir, "patterns"));
      fs.writeFileSync(
        path.join(tmpDir, "patterns", "README.md"),
        "# Project\n\nThis is version #3.0 and issue #456",
      );

      const result = validateIssueNumbers(tmpDir);
      // #3 is valid (1 digit), #0 from 3.0 is valid, #456 is valid
      expect(result.valid).toBe(true);
    });

    it("detects multiple invalid issues in same project", () => {
      fs.mkdirSync(path.join(tmpDir, "multi-invalid"));
      fs.writeFileSync(
        path.join(tmpDir, "multi-invalid", "README.md"),
        "# Project\n\n- #123456\n- #999999",
      );

      const result = validateIssueNumbers(tmpDir);
      expect(result.invalidIssues.length).toBe(2);
      expect(result.valid).toBe(false);
    });

    it("handles projects without README.md", () => {
      fs.mkdirSync(path.join(tmpDir, "no-readme"));

      const result = validateIssueNumbers(tmpDir);
      expect(result.invalidIssues).toEqual([]);
      expect(result.valid).toBe(true);
    });

    it("validates mixed valid and invalid issues", () => {
      fs.mkdirSync(path.join(tmpDir, "mixed"));
      fs.writeFileSync(
        path.join(tmpDir, "mixed", "README.md"),
        "# Project\n\n## Issues\n\n- #123 (valid)\n- #1234567 (invalid)",
      );

      const result = validateIssueNumbers(tmpDir);
      expect(result.invalidIssues).toContainEqual({
        project: "mixed",
        issue: "1234567",
      });
      expect(result.valid).toBe(false);
    });

    it("scans all projects for invalid issues", () => {
      fs.mkdirSync(path.join(tmpDir, "good"));
      fs.writeFileSync(
        path.join(tmpDir, "good", "README.md"),
        "# Good\n\n- #123",
      );

      fs.mkdirSync(path.join(tmpDir, "bad"));
      fs.writeFileSync(
        path.join(tmpDir, "bad", "README.md"),
        "# Bad\n\n- #999999",
      );

      const result = validateIssueNumbers(tmpDir);
      expect(result.invalidIssues.length).toBe(1);
      expect(result.invalidIssues[0].project).toBe("bad");
    });

    it("handles issue numbers at document boundaries", () => {
      fs.mkdirSync(path.join(tmpDir, "boundary"));
      fs.writeFileSync(
        path.join(tmpDir, "boundary", "README.md"),
        "#12345\nEnd of line #123\n#456 Start of line",
      );

      const result = validateIssueNumbers(tmpDir);
      expect(result.valid).toBe(true);
    });
  });
});
