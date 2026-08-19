const fs = require("fs");
const path = require("path");
const os = require("os");
const {
  generateBadges,
  formatBadgesAsMarkdown,
  injectBadges,
} = require("../../skills/generate-badges");

describe("generate-badges skill", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "meta-agent-test-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe("generateBadges", () => {
    it("generates badges for block-plugin", () => {
      const result = generateBadges(tempDir, "block-plugin");
      expect(result.repoType).toBe("block-plugin");
      expect(result.badges).toBeDefined();
      expect(result.badges.length).toBeGreaterThan(0);
    });

    it("generates badges for block-theme", () => {
      const result = generateBadges(tempDir, "block-theme");
      expect(result.repoType).toBe("block-theme");
      expect(result.badges).toBeDefined();
      expect(result.badges.some((b) => b.name === "License")).toBe(true);
    });

    it("generates badges for control-plane", () => {
      const result = generateBadges(tempDir, "control-plane");
      expect(result.repoType).toBe("control-plane");
      expect(result.badges.some((b) => b.name.includes("Governance"))).toBe(
        true,
      );
    });

    it("includes version from package.json", () => {
      const pkgJson = { name: "test-plugin", version: "1.2.3", license: "MIT" };
      fs.writeFileSync(
        path.join(tempDir, "package.json"),
        JSON.stringify(pkgJson),
      );
      const result = generateBadges(tempDir, "block-plugin");
      const versionBadge = result.badges.find((b) => b.name === "Version");
      expect(versionBadge).toBeDefined();
      expect(versionBadge.badge).toContain("1.2.3");
    });

    it("includes license from composer.json", () => {
      const composer = {
        name: "test/plugin",
        version: "2.0.0",
        license: ["GPL-2.0-or-later"],
      };
      fs.writeFileSync(
        path.join(tempDir, "composer.json"),
        JSON.stringify(composer),
      );
      const result = generateBadges(tempDir, "block-plugin");
      expect(result.badges.some((b) => b.badge.includes("GPL"))).toBe(true);
    });

    it("returns markdown-formatted badge block", () => {
      const result = generateBadges(tempDir, "block-plugin");
      expect(result.markdownBlock).toBeDefined();
      expect(typeof result.markdownBlock).toBe("string");
    });
  });

  describe("formatBadgesAsMarkdown", () => {
    it("formats control-plane badges as inline", () => {
      const badges = [
        { name: "Status", badge: "![Active](...)" },
        { name: "Maintained", badge: "![LightSpeed](...)" },
      ];
      const result = formatBadgesAsMarkdown(badges, "control-plane");
      expect(result).toContain("![Active](...)");
      expect(result).toContain("![LightSpeed](...)");
      expect(result).not.toContain("## Badges");
    });

    it("formats plugin badges with section header", () => {
      const badges = [{ name: "License", badge: "![MIT](...)" }];
      const result = formatBadgesAsMarkdown(badges, "block-plugin");
      expect(result).toContain("## Badges");
      expect(result).toContain("License:");
    });

    it("handles links in badges", () => {
      const badges = [
        { name: "CI", badge: "![CI](url)", link: "https://example.com" },
      ];
      const result = formatBadgesAsMarkdown(badges, "block-plugin");
      expect(result).toContain("https://example.com");
    });
  });

  describe("injectBadges", () => {
    it("returns error for non-existent file", () => {
      const result = injectBadges("/nonexistent/file.md", "## Badges");
      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });

    it("injects badges after frontmatter", () => {
      const filePath = path.join(tempDir, "test.md");
      const content = "---\ntitle: Test\n---\n# Content";
      fs.writeFileSync(filePath, content);
      const result = injectBadges(
        filePath,
        "## Badges\n\n![Badge](url)",
        "after-frontmatter",
      );
      expect(result.success).toBe(true);
      expect(result.content).toContain("## Badges");
      const parts = result.content.split("---");
      expect(parts.length).toBe(3); // before, frontmatter, after
    });

    it("injects badges at top of file", () => {
      const filePath = path.join(tempDir, "test.md");
      const content = "# Content\n\nBody";
      fs.writeFileSync(filePath, content);
      const result = injectBadges(filePath, "## Badges", "top");
      expect(result.success).toBe(true);
      expect(result.content).toMatch(/^## Badges/);
    });

    it("detects existing badges and returns error", () => {
      const filePath = path.join(tempDir, "test.md");
      const content = "---\ntitle: Test\n---\n## Badges\n\nExisting";
      fs.writeFileSync(filePath, content);
      const result = injectBadges(filePath, "## Badges");
      expect(result.alreadyExists).toBe(true);
    });

    it("handles files without frontmatter", () => {
      const filePath = path.join(tempDir, "test.md");
      const content = "# Content\n\nBody";
      fs.writeFileSync(filePath, content);
      const result = injectBadges(filePath, "## Badges", "after-frontmatter");
      expect(result.success).toBe(true);
      expect(result.content).toContain("## Badges");
    });

    it("preserves existing content when injecting", () => {
      const filePath = path.join(tempDir, "test.md");
      const originalContent =
        "---\ntitle: Test\n---\n# Important Section\n\nContent";
      fs.writeFileSync(filePath, originalContent);
      const result = injectBadges(filePath, "## Badges");
      expect(result.content).toContain("# Important Section");
      expect(result.content).toContain("Content");
    });
  });

  describe("integration scenarios", () => {
    it("generates and formats badges for block-plugin", () => {
      const result = generateBadges(tempDir, "block-plugin");
      expect(result.markdownBlock).toContain("CI Status") ||
        expect(result.markdownBlock).toContain("License");
    });

    it("generates and injects badges into file", () => {
      const filePath = path.join(tempDir, "README.md");
      const content = "---\ntitle: Plugin\n---\n# My Plugin";
      fs.writeFileSync(filePath, content);

      const badges = generateBadges(tempDir, "block-plugin");
      const injection = injectBadges(filePath, badges.markdownBlock);
      expect(injection.success).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles missing package.json gracefully", () => {
      const result = generateBadges(tempDir, "block-plugin");
      expect(result.success === undefined || result.success === true).toBe(
        true,
      );
    });

    it("handles malformed package.json", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "invalid json{]");
      const result = generateBadges(tempDir, "block-plugin");
      expect(result.badges).toBeDefined();
      expect(Array.isArray(result.badges)).toBe(true);
    });

    it("handles unknown repo type", () => {
      const result = generateBadges(tempDir, "unknown-type");
      expect(result.badges).toBeDefined();
      expect(result.badges.length).toBeGreaterThan(0);
    });

    it("handles badges with special characters", () => {
      const badges = [
        { name: "Test", badge: "![Badge with special chars & symbols](url)" },
      ];
      const result = formatBadgesAsMarkdown(badges, "block-plugin");
      expect(result).toContain("Badge with special chars");
    });
  });
});
