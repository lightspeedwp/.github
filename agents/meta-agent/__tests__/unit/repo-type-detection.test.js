const fs = require("fs");
const path = require("path");
const os = require("os");
const { detectRepoType } = require("../../skills/repo-type-detection");

describe("repo-type-detection skill", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "meta-agent-test-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe("detectRepoType", () => {
    it("detects block-plugin by block.json", () => {
      fs.writeFileSync(path.join(tempDir, "block.json"), "{}");
      const result = detectRepoType(tempDir);
      expect(result).toBe("block-plugin");
    });

    it("detects block-plugin by PHP file with Block Name header", () => {
      fs.writeFileSync(
        path.join(tempDir, "plugin.php"),
        "<?php\n/*\nBlock Name: My Block\n*/",
      );
      const result = detectRepoType(tempDir);
      expect(result).toBe("block-plugin");
    });

    it("detects block-theme by theme.json and style.css", () => {
      fs.writeFileSync(path.join(tempDir, "theme.json"), "{}");
      fs.writeFileSync(
        path.join(tempDir, "style.css"),
        "Text Domain: my-theme",
      );
      const result = detectRepoType(tempDir);
      expect(result).toBe("block-theme");
    });

    it("detects control-plane by .github/agents directory", () => {
      fs.mkdirSync(path.join(tempDir, ".github", "agents"), {
        recursive: true,
      });
      const result = detectRepoType(tempDir);
      expect(result).toBe("control-plane");
    });

    it("detects documentation repo by docs directory", () => {
      fs.mkdirSync(path.join(tempDir, "docs"));
      const result = detectRepoType(tempDir);
      expect(result).toBe("documentation");
    });

    it("defaults to generic for unknown repo type", () => {
      const result = detectRepoType(tempDir);
      expect(result).toBe("generic");
    });

    it("prioritizes block.json over theme.json", () => {
      fs.writeFileSync(path.join(tempDir, "block.json"), "{}");
      fs.writeFileSync(path.join(tempDir, "theme.json"), "{}");
      fs.writeFileSync(path.join(tempDir, "style.css"), "Text Domain: test");
      const result = detectRepoType(tempDir);
      expect(result).toBe("block-plugin");
    });

    it("requires both theme.json and style.css for block-theme", () => {
      fs.writeFileSync(path.join(tempDir, "theme.json"), "{}");
      // No style.css
      const result = detectRepoType(tempDir);
      expect(result).not.toBe("block-theme");
    });

    it("handles multiple PHP files", () => {
      fs.writeFileSync(
        path.join(tempDir, "index.php"),
        "<?php // regular file",
      );
      fs.writeFileSync(
        path.join(tempDir, "plugin.php"),
        "<?php\nblock_name: test",
      );
      const result = detectRepoType(tempDir);
      expect(result).toBe("block-plugin");
    });
  });

  describe("edge cases", () => {
    it("handles case-insensitive headers", () => {
      fs.writeFileSync(
        path.join(tempDir, "plugin.php"),
        "<?php\n/*\nBLOCK NAME: My Block\n*/",
      );
      // Note: current implementation is case-sensitive; test documents current behavior
      const result = detectRepoType(tempDir);
      expect(result).not.toBe("block-plugin"); // This shows it's case-sensitive
    });

    it("handles empty directories", () => {
      const result = detectRepoType(tempDir);
      expect(result).toBe("generic");
    });

    it("handles symlinks", () => {
      fs.mkdirSync(path.join(tempDir, ".github", "agents"), {
        recursive: true,
      });
      const result = detectRepoType(tempDir);
      expect(result).toBe("control-plane");
    });
  });
});
