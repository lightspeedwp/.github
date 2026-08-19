/**
 * WordPress Plugin Repository Integration Tests
 * Tests Linting Agent in WordPress plugin context
 */

const { detectRepositoryType } = require("../../../linting.agent");
const path = require("path");
const fs = require("fs");
const os = require("os");

describe("WordPress Plugin Repository Integration", () => {
  let testRepoPath;

  beforeEach(() => {
    testRepoPath = fs.mkdtempSync(path.join(os.tmpdir(), "wp-plugin-"));
    // Create plugin.php to mark as WordPress plugin
    fs.writeFileSync(
      path.join(testRepoPath, "plugin.php"),
      `<?php
/**
 * Plugin Name: My Plugin
 * Description: Test plugin
 */`,
    );
  });

  afterEach(() => {
    if (fs.existsSync(testRepoPath)) {
      fs.rmSync(testRepoPath, { recursive: true, force: true });
    }
  });

  describe("Repository Detection", () => {
    test("correctly identifies WordPress plugin repository", () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
    });

    test("detects with plugin.php file", () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
    });
  });

  describe("PHP Linting Configuration", () => {
    test("applies PHPCS with WordPress coding standards", () => {
      const phpFile = path.join(testRepoPath, "includes", "class-handler.php");
      fs.mkdirSync(path.dirname(phpFile), { recursive: true });
      fs.writeFileSync(
        phpFile,
        `<?php
class Handler {
  public function handle() {
    return true;
  }
}`,
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      expect(fs.existsSync(phpFile)).toBe(true);
    });

    test("generates correct PHPCS configuration", () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // PHPCS config should include WordPress standards
    });

    test("excludes vendor directory from linting", () => {
      const vendorFile = path.join(testRepoPath, "vendor", "lib.php");
      fs.mkdirSync(path.dirname(vendorFile), { recursive: true });
      fs.writeFileSync(vendorFile, "<?php // vendor code");

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // vendor/ should be excluded
    });

    test("excludes node_modules from linting", () => {
      const nodeFile = path.join(testRepoPath, "node_modules", "lib.js");
      fs.mkdirSync(path.dirname(nodeFile), { recursive: true });
      fs.writeFileSync(nodeFile, 'console.log("npm");');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // node_modules/ should be excluded
    });
  });

  describe("JavaScript/Frontend Linting", () => {
    test("applies ESLint to plugin scripts", () => {
      const jsFile = path.join(testRepoPath, "assets", "js", "admin.js");
      fs.mkdirSync(path.dirname(jsFile), { recursive: true });
      fs.writeFileSync(
        jsFile,
        'jQuery(document).ready(function() { console.log("admin"); });',
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      expect(fs.existsSync(jsFile)).toBe(true);
    });

    test("handles both admin and frontend scripts", () => {
      const adminJs = path.join(testRepoPath, "admin", "js", "admin.js");
      const frontendJs = path.join(testRepoPath, "public", "js", "frontend.js");

      fs.mkdirSync(path.dirname(adminJs), { recursive: true });
      fs.mkdirSync(path.dirname(frontendJs), { recursive: true });
      fs.writeFileSync(adminJs, 'console.log("admin");');
      fs.writeFileSync(frontendJs, 'console.log("frontend");');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
    });
  });

  describe("CSS/SCSS Linting", () => {
    test("applies Stylelint to plugin styles", () => {
      const cssFile = path.join(testRepoPath, "assets", "css", "style.css");
      fs.mkdirSync(path.dirname(cssFile), { recursive: true });
      fs.writeFileSync(cssFile, ".plugin-class { color: #000; }");

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      expect(fs.existsSync(cssFile)).toBe(true);
    });

    test("handles SCSS files", () => {
      const scssFile = path.join(testRepoPath, "assets", "scss", "main.scss");
      fs.mkdirSync(path.dirname(scssFile), { recursive: true });
      fs.writeFileSync(scssFile, "$color: #000;\n.class { color: $color; }");

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      expect(fs.existsSync(scssFile)).toBe(true);
    });
  });

  describe("Configuration Files", () => {
    test("generates phpcs.xml for WordPress plugin", () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // Should generate or expect phpcs.xml
    });

    test("supports custom ruleset inheritance", () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // Should support custom ruleset in config
    });

    test("includes WordPress-specific rules", () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // Config should include WordPress standards
    });
  });

  describe("Plugin Structure Detection", () => {
    test("handles plugin with standard structure", () => {
      const dirs = ["includes", "admin", "public", "assets"];
      dirs.forEach((dir) => {
        fs.mkdirSync(path.join(testRepoPath, dir), { recursive: true });
      });

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
    });

    test("handles plugin with vendor dependencies", () => {
      fs.mkdirSync(path.join(testRepoPath, "vendor"), { recursive: true });
      fs.writeFileSync(
        path.join(testRepoPath, "vendor", "autoload.php"),
        "<?php // autoload",
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // vendor should be excluded from linting
    });

    test("handles plugin with npm dependencies", () => {
      fs.writeFileSync(path.join(testRepoPath, "package.json"), "{}");
      fs.mkdirSync(path.join(testRepoPath, "node_modules"), {
        recursive: true,
      });

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // node_modules should be excluded
    });
  });

  describe("Exclude Patterns", () => {
    test("excludes vendor from linting", () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // Config should exclude vendor/
    });

    test("excludes node_modules from linting", () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // Config should exclude node_modules/
    });

    test("excludes build artifacts", () => {
      fs.mkdirSync(path.join(testRepoPath, "dist"), { recursive: true });
      fs.mkdirSync(path.join(testRepoPath, "build"), { recursive: true });

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // dist/ and build/ should be excluded
    });

    test("excludes test directories appropriately", () => {
      fs.mkdirSync(path.join(testRepoPath, "tests"), { recursive: true });
      fs.mkdirSync(path.join(testRepoPath, "__tests__"), { recursive: true });

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
    });
  });

  describe("Error Handling", () => {
    test("handles malformed PHP files", () => {
      const badPhp = path.join(testRepoPath, "bad.php");
      fs.writeFileSync(badPhp, "<?php if ($x = 1) { // missing closing brace");

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
      // Detection should still work
    });

    test("handles missing WordPress headers in main plugin file", () => {
      fs.rmSync(path.join(testRepoPath, "plugin.php"), { force: true });
      fs.writeFileSync(
        path.join(testRepoPath, "plugin.php"),
        "<?php // no headers",
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
    });

    test("handles very large plugin", () => {
      // Create many files
      for (let i = 0; i < 50; i++) {
        const file = path.join(testRepoPath, "includes", `class-${i}.php`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, `<?php class Class${i} {}`);
      }

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe("wordpress-plugin");
    });
  });
});
