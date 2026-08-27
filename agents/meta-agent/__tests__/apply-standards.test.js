const fs = require("fs");
const path = require("path");
const os = require("os");
const {
  applyStandards,
  applyUkEnglish,
  generateFooter,
} = require("../skills/apply-standards.cjs");

describe("apply-standards skill", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "meta-agent-test-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe("applyUkEnglish", () => {
    it("converts US English to UK English", () => {
      const text = "optimized organization";
      const result = applyUkEnglish(text);
      expect(result).toBe("optimised organisation");
    });

    it("preserves capitalization", () => {
      const text = "Optimize your Organization";
      const result = applyUkEnglish(text);
      expect(result).toBe("Optimise your Organisation");
    });

    it("handles multiple corrections in same word boundary", () => {
      const text = "normalize color behavior";
      const result = applyUkEnglish(text);
      expect(result).toBe("normalise colour behaviour");
    });

    it("does not modify words with partial matches", () => {
      const text = "organization is not the same as organizer";
      const result = applyUkEnglish(text);
      expect(result).toContain("organisation");
      expect(result).toContain("organiser");
    });
  });

  describe("generateFooter", () => {
    it("generates footer for block-plugin", () => {
      const frontmatter = {
        status: "active",
        author: "John Doe",
        version: "1.0.0",
      };
      const footer = generateFooter("block-plugin", frontmatter);
      expect(footer).toContain("**Status:** active");
      expect(footer).toContain("**Author:** John Doe");
      expect(footer).toContain("**Version:** 1.0.0");
    });

    it("generates footer for block-theme", () => {
      const frontmatter = { status: "review", version: "2.0.0" };
      const footer = generateFooter("block-theme", frontmatter);
      expect(footer).toContain("**Status:** review");
      expect(footer).toContain("**Version:** 2.0.0");
    });

    it("generates footer for control-plane", () => {
      const frontmatter = { status: "active", maintainer: "LightSpeed Team" };
      const footer = generateFooter("control-plane", frontmatter);
      expect(footer).toContain("**Maintainer:** LightSpeed Team");
      expect(footer).toContain("**Status:** active");
    });

    it("includes last_updated date", () => {
      const frontmatter = { status: "active", last_updated: "2026-08-18" };
      const footer = generateFooter("generic", frontmatter);
      expect(footer).toContain("2026-08-18");
    });
  });

  describe("applyStandards", () => {
    it("returns error for non-existent file", () => {
      const result = applyStandards("/nonexistent/file.md");
      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });

    it("skips files marked with meta:ignore", () => {
      const filePath = path.join(tempDir, "test.md");
      fs.writeFileSync(
        filePath,
        "<!-- meta:ignore -->\n# Test\noptimized content",
      );
      const result = applyStandards(filePath);
      expect(result.skipped).toBe(true);
      expect(result.reason).toContain("meta:ignore");
    });

    it("applies UK English corrections", () => {
      const filePath = path.join(tempDir, "test.md");
      fs.writeFileSync(
        filePath,
        "---\ntitle: Test\n---\noptimized organization",
      );
      const result = applyStandards(filePath, { dryRun: true });
      expect(result.changes).toContain("Applied UK English corrections");
    });

    it("adds missing required frontmatter fields", () => {
      const filePath = path.join(tempDir, "test.md");
      fs.writeFileSync(filePath, "---\ntitle: Test\n---\n# Content");
      const result = applyStandards(filePath, { dryRun: true });
      expect(result.changes.some((c) => c.includes("status"))).toBe(true);
      expect(result.changes.some((c) => c.includes("last_updated"))).toBe(true);
      expect(result.changes.some((c) => c.includes("language"))).toBe(true);
    });

    it("writes changes when not in dry-run mode", () => {
      const filePath = path.join(tempDir, "test.md");
      fs.writeFileSync(filePath, "---\ntitle: Test\n---\n# Content");
      const result = applyStandards(filePath, { dryRun: false });
      expect(result.dryRun).toBe(false);
      const updated = fs.readFileSync(filePath, "utf8");
      expect(updated).toContain("status:");
    });

    it("preserves content when applying standards", () => {
      const content =
        "---\ntitle: Test\nauthor: Jane\n---\n## Section\n\nImportant content here.";
      const filePath = path.join(tempDir, "test.md");
      fs.writeFileSync(filePath, content);
      applyStandards(filePath, { dryRun: false });
      const updated = fs.readFileSync(filePath, "utf8");
      expect(updated).toContain("## Section");
      expect(updated).toContain("Important content here");
    });

    it("returns success with changes array", () => {
      const filePath = path.join(tempDir, "test.md");
      fs.writeFileSync(filePath, "---\ntitle: Test\n---\noptimized");
      const result = applyStandards(filePath, { dryRun: true });
      expect(result.success).toBe(true);
      expect(Array.isArray(result.changes)).toBe(true);
      expect(result.changes.length).toBeGreaterThan(0);
    });

    it("respects the repoType parameter", () => {
      const filePath = path.join(tempDir, "test.md");
      fs.writeFileSync(filePath, "---\ntitle: Test\n---\n# Content");
      const result = applyStandards(filePath, {
        repoType: "block-plugin",
        dryRun: true,
      });
      expect(result.filePath).toBe(filePath);
    });
  });

  describe("edge cases", () => {
    it("handles files without frontmatter", () => {
      const filePath = path.join(tempDir, "test.md");
      fs.writeFileSync(filePath, "# No frontmatter\n\nJust content");
      const result = applyStandards(filePath, { dryRun: true });
      expect(result.success).toBe(true);
    });

    it("handles malformed YAML frontmatter", () => {
      const filePath = path.join(tempDir, "test.md");
      fs.writeFileSync(filePath, "---\ninvalid: yaml: content:\n---\nContent");
      const result = applyStandards(filePath, { dryRun: true });
      expect(result.success).toBe(false);
      expect(result.error).toContain("YAML");
    });

    it("does not add duplicate footer blocks", () => {
      const filePath = path.join(tempDir, "test.md");
      const content =
        "---\ntitle: Test\n---\n# Content\n\n---\n\n**Status:** active";
      fs.writeFileSync(filePath, content);
      const result = applyStandards(filePath, { dryRun: true });
      const footerAdds = result.changes.filter((c) =>
        c.includes("footer"),
      ).length;
      expect(footerAdds).toBeLessThanOrEqual(1);
    });
  });
});
