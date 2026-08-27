const fs = require("fs");
const path = require("path");
const os = require("os");
const { extractMetadata } = require("../skills/metadata-extraction.cjs");

describe("metadata-extraction skill", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "meta-agent-test-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe("extractMetadata", () => {
    it("extracts block-plugin metadata", () => {
      const blockJson = { name: "test/block", title: "Test Block" };
      fs.writeFileSync(
        path.join(tempDir, "block.json"),
        JSON.stringify(blockJson),
      );
      const result = extractMetadata(tempDir, "block-plugin");
      expect(result.repoType).toBe("block-plugin");
      expect(result.foundMarkers.blockJson).toBe(true);
      expect(result.blockMetadata).toBeDefined();
    });

    it("extracts block-theme metadata", () => {
      const themeJson = { name: "My Theme", version: "1.0.0" };
      fs.writeFileSync(
        path.join(tempDir, "theme.json"),
        JSON.stringify(themeJson),
      );
      fs.writeFileSync(
        path.join(tempDir, "style.css"),
        "Text Domain: my-theme",
      );
      const result = extractMetadata(tempDir, "block-theme");
      expect(result.repoType).toBe("block-theme");
      expect(result.foundMarkers.themeJson).toBe(true);
      expect(result.themeMetadata).toBeDefined();
    });

    it("extracts control-plane metadata", () => {
      fs.mkdirSync(path.join(tempDir, ".github", "agents"), {
        recursive: true,
      });
      fs.mkdirSync(path.join(tempDir, ".github", "workflows"), {
        recursive: true,
      });
      const result = extractMetadata(tempDir, "control-plane");
      expect(result.repoType).toBe("control-plane");
      expect(result.foundMarkers.agents).toBe(true);
      expect(result.foundMarkers.workflows).toBe(true);
    });

    it("handles missing optional files", () => {
      const result = extractMetadata(tempDir, "block-plugin");
      expect(result.foundMarkers.blockJson).toBe(false);
      expect(result.foundMarkers.composerJson).toBe(false);
    });

    it("includes all found markers in result", () => {
      fs.writeFileSync(path.join(tempDir, "block.json"), "{}");
      fs.writeFileSync(path.join(tempDir, "composer.json"), "{}");
      const result = extractMetadata(tempDir, "block-plugin");
      expect(Object.keys(result.foundMarkers).length).toBeGreaterThan(0);
    });

    it("parses JSON metadata files", () => {
      const blockJson = {
        name: "test/block",
        title: "Test Block",
        supports: ["align", "anchor"],
      };
      fs.writeFileSync(
        path.join(tempDir, "block.json"),
        JSON.stringify(blockJson),
      );
      const result = extractMetadata(tempDir, "block-plugin");
      expect(result.blockMetadata.title).toBe("Test Block");
      expect(result.blockMetadata.supports).toEqual(["align", "anchor"]);
    });

    it("handles generic repo type", () => {
      const result = extractMetadata(tempDir, "generic");
      expect(result.repoType).toBe("generic");
      expect(result.foundMarkers).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("handles malformed JSON in block.json", () => {
      fs.writeFileSync(path.join(tempDir, "block.json"), "invalid json{]");
      // Should not crash, just skip parsing
      expect(() => {
        extractMetadata(tempDir, "block-plugin");
      }).not.toThrow();
    });

    it("handles missing .github/agents directory for control-plane", () => {
      fs.mkdirSync(path.join(tempDir, ".github"), { recursive: true });
      const result = extractMetadata(tempDir, "control-plane");
      expect(result.foundMarkers.agents).toBe(false);
    });

    it("returns empty markers for unknown repo type", () => {
      const result = extractMetadata(tempDir, "unknown-type");
      expect(result.repoType).toBe("unknown-type");
      expect(result.foundMarkers).toBeDefined();
    });

    it("handles composer.json with array license", () => {
      const composer = {
        name: "test/plugin",
        license: ["GPL-2.0", "MIT"],
      };
      fs.writeFileSync(
        path.join(tempDir, "composer.json"),
        JSON.stringify(composer),
      );
      expect(() => {
        extractMetadata(tempDir, "block-plugin");
      }).not.toThrow();
    });

    it("includes repoType in result", () => {
      const result = extractMetadata(tempDir, "block-plugin");
      expect(result.repoType).toBe("block-plugin");
    });
  });
});
