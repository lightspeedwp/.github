/**
 * Integration Tests for WordPress Agent
 */

import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import wordpress from "../wordpress.agent.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(__dirname, "temp-integration");

const createTempDir = () => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
};

const cleanupTemp = () => {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
};

const createPluginFile = (name = "test-plugin.php") => {
  createTempDir();
  const content = `<?php
/*
Plugin Name: Test Plugin
Description: A test plugin
Version: 1.0.0
Author: Test Author
License: GPL v2 or later
Text Domain: test-plugin
*/`;
  fs.writeFileSync(path.join(tempDir, name), content, "utf8");
};

const createThemeFile = () => {
  createTempDir();
  const content = `/*
Theme Name: Test Theme
Description: A test theme
Version: 1.0.0
Author: Test Author
License: GPL v2 or later
*/
body { color: black; }`;
  fs.writeFileSync(path.join(tempDir, "style.css"), content, "utf8");
};

const createReadmeFile = () => {
  createTempDir();
  const content = `=== Test Plugin ===
Contributors: testauthor
Author: Test Author
License: GPL v2 or later
Requires at least: 5.0
Tested up to: 6.0
Stable tag: 1.0.0
Text Domain: test-plugin

This is a test plugin.`;
  fs.writeFileSync(path.join(tempDir, "readme.txt"), content, "utf8");
};

describe("WordPress Agent Integration", () => {
  afterEach(cleanupTemp);

  describe("Plugin Repository", () => {
    beforeEach(createPluginFile);

    it("detects plugin repository", () => {
      const component = wordpress.detectWordPressComponent(tempDir);
      expect(component.hasPlugin).toBe(true);
      expect(component.hasTheme).toBe(false);
      expect(component.primaryComponent).toBeTruthy();
    });

    it("validates version consistency", () => {
      const validation = wordpress.validateVersionConsistency(tempDir);
      expect(validation.isConsistent).toBe(true);
      expect(validation.baseVersion).toBe("1.0.0");
      expect(validation.mismatches.length).toBe(0);
    });

    it("updates plugin version", () => {
      const result = wordpress.updateAllVersions(tempDir, "2.0.0");
      expect(result.success).toBe(true);
      expect(result.updated.length).toBeGreaterThan(0);

      // Verify version was updated
      const validation = wordpress.validateVersionConsistency(tempDir);
      expect(validation.baseVersion).toBe("2.0.0");
    });

    it("bumps plugin version", () => {
      const result = wordpress.bumpAllVersions(tempDir, "minor");
      expect(result.success).toBe(true);
      expect(result.newVersion).toBe("1.1.0");

      // Verify in file
      const validation = wordpress.validateVersionConsistency(tempDir);
      expect(validation.baseVersion).toBe("1.1.0");
    });

    it("reads plugin metadata", () => {
      const metadata = wordpress.getComponentMetadata(tempDir);
      expect(metadata.hasPlugin).toBe(true);
      expect(metadata.plugin).toBeTruthy();
      expect(metadata.plugin.name).toBe("Test Plugin");
      expect(metadata.plugin.version).toBe("1.0.0");
      expect(metadata.plugin.author).toBe("Test Author");
    });
  });

  describe("Theme Repository", () => {
    beforeEach(createThemeFile);

    it("detects theme repository", () => {
      const component = wordpress.detectWordPressComponent(tempDir);
      expect(component.hasTheme).toBe(true);
      expect(component.hasPlugin).toBe(false);
      expect(component.primaryComponent).toBeTruthy();
    });

    it("validates theme version", () => {
      const validation = wordpress.validateVersionConsistency(tempDir);
      expect(validation.isConsistent).toBe(true);
      expect(validation.baseVersion).toBe("1.0.0");
    });

    it("updates theme version", () => {
      const result = wordpress.updateAllVersions(tempDir, "2.0.0");
      expect(result.success).toBe(true);

      const validation = wordpress.validateVersionConsistency(tempDir);
      expect(validation.baseVersion).toBe("2.0.0");
    });

    it("bumps theme version", () => {
      const result = wordpress.bumpAllVersions(tempDir, "major");
      expect(result.newVersion).toBe("2.0.0");

      const validation = wordpress.validateVersionConsistency(tempDir);
      expect(validation.baseVersion).toBe("2.0.0");
    });

    it("reads theme metadata", () => {
      const metadata = wordpress.getComponentMetadata(tempDir);
      expect(metadata.hasTheme).toBe(true);
      expect(metadata.theme).toBeTruthy();
      expect(metadata.theme.name).toBe("Test Theme");
    });
  });

  describe("Plugin with Readme", () => {
    beforeEach(() => {
      createPluginFile();
      createReadmeFile();
    });

    it("detects both plugin and readme", () => {
      const component = wordpress.detectWordPressComponent(tempDir);
      expect(component.hasPlugin).toBe(true);
      expect(component.hasReadme).toBe(true);
    });

    it("maintains version consistency across files", () => {
      // Update all versions
      const result = wordpress.updateAllVersions(tempDir, "2.0.0");
      expect(result.updated.length).toBeGreaterThanOrEqual(2);

      // Verify all are consistent
      const validation = wordpress.validateVersionConsistency(tempDir);
      expect(validation.isConsistent).toBe(true);
      expect(validation.baseVersion).toBe("2.0.0");
      expect(validation.mismatches.length).toBe(0);
    });

    it("bumps all versions together", () => {
      const result = wordpress.bumpAllVersions(tempDir, "patch");
      expect(result.newVersion).toBe("1.0.1");
      expect(result.updated.length).toBeGreaterThanOrEqual(2);

      // Verify consistency
      const validation = wordpress.validateVersionConsistency(tempDir);
      expect(validation.isConsistent).toBe(true);
      expect(validation.baseVersion).toBe("1.0.1");
    });

    it("reports metadata for all components", () => {
      const metadata = wordpress.getComponentMetadata(tempDir);
      expect(metadata.plugin).toBeTruthy();
      expect(metadata.readme).toBeTruthy();
    });
  });

  describe("Complex Workflows", () => {
    it("handles major version bump with consistency check", () => {
      createPluginFile();
      createReadmeFile();

      // Initial check
      let validation = wordpress.validateVersionConsistency(tempDir);
      expect(validation.isConsistent).toBe(true);

      // Bump version
      const bump = wordpress.bumpAllVersions(tempDir, "major");
      expect(bump.newVersion).toBe("2.0.0");

      // Verify final state
      validation = wordpress.validateVersionConsistency(tempDir);
      expect(validation.isConsistent).toBe(true);
      expect(validation.baseVersion).toBe("2.0.0");
    });

    it("handles sequential version updates", () => {
      createPluginFile();

      // Update to 1.1.0
      let result = wordpress.updateAllVersions(tempDir, "1.1.0");
      expect(result.success).toBe(true);

      // Update to 1.2.0
      result = wordpress.updateAllVersions(tempDir, "1.2.0");
      expect(result.success).toBe(true);

      // Verify final
      const validation = wordpress.validateVersionConsistency(tempDir);
      expect(validation.baseVersion).toBe("1.2.0");
    });
  });

  describe("Error Handling", () => {
    it("returns sensible defaults for non-WordPress repo", () => {
      createTempDir();
      const component = wordpress.detectWordPressComponent(tempDir);
      expect(component.hasPlugin).toBe(false);
      expect(component.hasTheme).toBe(false);
      expect(component.primaryComponent).toBeNull();
    });

    it("rejects invalid version format", () => {
      createPluginFile();
      const result = wordpress.updateAllVersions(tempDir, "invalid");
      expect(result.success).toBe(false);
      expect(result.failed.length).toBeGreaterThan(0);
    });

    it("returns message for non-existent repo", () => {
      const component =
        wordpress.detectWordPressComponent("/non/existent/path");
      expect(component.hasPlugin).toBe(false);
      expect(component.primaryComponent).toBeNull();
    });
  });
});
