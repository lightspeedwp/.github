#!/usr/bin/env node

/**
 * WCEU 2026 Readiness Verification Script
 * Validates all Phase 1 completion requirements
 *
 * @module scripts/verify-wceu-readiness
 * @fileoverview Validates Phase 1 completion for WCEU 2026
 * @author LightSpeedWP Team
 * @version 1.0.0
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const COLORS = {
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  RESET: "\x1b[0m",
};

let checksPassed = 0;
let checksFailed = 0;

function passCheck(msg) {
  console.log(`${COLORS.GREEN}✓${COLORS.RESET} ${msg}`);
  checksPassed++;
}

function failCheck(msg) {
  console.log(`${COLORS.RED}✗${COLORS.RESET} ${msg}`);
  checksFailed++;
}

function warnCheck(msg) {
  console.log(`${COLORS.YELLOW}⚠${COLORS.RESET} ${msg}`);
}

function checkFileExists(filePath, invertLogic = false) {
  const exists = fs.existsSync(filePath);
  if (invertLogic ? exists : !exists) {
    if (invertLogic) {
      failCheck(`${filePath} still exists`);
    } else {
      failCheck(`${filePath} missing`);
    }
    return false;
  }
  if (invertLogic) {
    passCheck(`${filePath} deleted`);
  } else {
    passCheck(`${filePath} exists`);
  }
  return true;
}

function checkDirExists(dirPath, invertLogic = false) {
  const exists = fs.existsSync(dirPath);
  if (invertLogic ? exists : !exists) {
    if (invertLogic) {
      failCheck(`${dirPath} directory still exists`);
    } else {
      failCheck(`${dirPath} directory missing`);
    }
    return false;
  }
  if (invertLogic) {
    passCheck(`${dirPath} directory deleted`);
  } else {
    passCheck(`${dirPath} subdirectory exists`);
  }
  return true;
}

function countFiles(dirPath, pattern = null) {
  try {
    if (!fs.existsSync(dirPath)) return 0;
    const files = fs.readdirSync(dirPath);
    if (!pattern) return files.length;
    const regex = new RegExp(pattern);
    return files.filter((f) => regex.test(f)).length;
  } catch {
    return 0;
  }
}

function grepCount(filePath, pattern, excludePattern = null) {
  try {
    if (!fs.existsSync(filePath)) return 0;
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    const regex = new RegExp(pattern);
    const excludeRegex = excludePattern ? new RegExp(excludePattern) : null;
    let matches = 0;
    for (const line of lines) {
      if (regex.test(line)) {
        if (!excludeRegex || !excludeRegex.test(line)) {
          matches++;
        }
      }
    }
    return matches;
  } catch {
    return 0;
  }
}

function getLineCount(filePath) {
  try {
    if (!fs.existsSync(filePath)) return 0;
    const content = fs.readFileSync(filePath, "utf8");
    return content.split("\n").filter((line) => line.trim()).length;
  } catch {
    return 0;
  }
}

function grepRecursive(dirPath, pattern, options = {}) {
  const { exclude = [] } = options;
  const defaultExcludes = [".git", "node_modules"];
  const allExcludes = [...defaultExcludes, ...exclude];
  let matches = 0;
  const regex = new RegExp(pattern);

  const walk = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // Skip unreadable directories
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip excluded paths
      if (allExcludes.some((ex) => fullPath.includes(ex))) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        try {
          const content = fs.readFileSync(fullPath, "utf8");
          const lines = content.split("\n");
          matches += lines.filter((l) => regex.test(l)).length;
        } catch {
          // Skip unreadable files
        }
      }
    }
  };

  walk(dirPath);
  return matches;
}

function main() {
  console.log("==========================================");
  console.log("WCEU 2026 Phase 1 Readiness Check");
  console.log("==========================================");
  console.log("");

  // 1. Schema Migration Checks
  console.log("=== Schema Migration ===");

  checkDirExists(".schemas"); // Schema consolidation target directory
  checkFileExists(".schemas/frontmatter.schema.json");
  checkFileExists(".schemas/plugin-manifest.schema.json");
  checkDirExists(".schemas/memory");

  const memorySchemaCount = countFiles(".schemas/memory", ".json$");
  if (memorySchemaCount === 5) {
    passCheck(".schemas/memory/ has 5 memory schemas");
  } else {
    failCheck(`schema/memory/ has ${memorySchemaCount} schemas (expected 5)`);
  }

  checkFileExists(".schemas/schema-registry.json");

  // Check for remaining .schemas references
  const schemasRefs = grepRecursive(".", "\\.schemas", {
    exclude: [
      "node_modules",
      "archived",
      "metrics.config.json",
      ".claude/settings",
    ],
  });

  if (schemasRefs === 0) {
    passCheck("No orphaned .schemas/ references");
  } else {
    failCheck(`Found ${schemasRefs} .schemas/ references`);
  }

  console.log("");
  console.log("=== Agent Slides Reorganization ===");

  checkDirExists("agent-slide-decks", true); // Inverted - should NOT exist

  const agentSlidesCount = countFiles("wceu-2026/agent-slides");
  if (agentSlidesCount === 27) {
    passCheck("wceu-2026/agent-slides/ has 27 files (26 slides + README)");
  } else {
    failCheck(
      `wceu-2026/agent-slides/ has ${agentSlidesCount} files (expected 27)`,
    );
  }

  checkFileExists("wceu-2026/agent-slides/INDEX.md");

  console.log("");
  console.log("=== Content Files ===");

  checkFileExists("wceu-2026/talk-outline-25min.md");

  const outlineLines = getLineCount("wceu-2026/talk-outline-25min.md");
  if (outlineLines > 50) {
    passCheck(
      `wceu-2026/talk-outline-25min.md has content (${outlineLines} lines)`,
    );
  } else {
    failCheck(
      `wceu-2026/talk-outline-25min.md is stub (${outlineLines} lines)`,
    );
  }

  const readmeLines = getLineCount("wceu-2026/README.md");
  if (fs.existsSync("wceu-2026/README.md") && readmeLines > 10) {
    passCheck("wceu-2026/README.md exists with content");
  } else {
    warnCheck("wceu-2026/README.md missing or incomplete");
  }

  const slidesCount = countFiles("wceu-2026/slides", "^slide-.*\\.md$");
  if (slidesCount === 20) {
    passCheck("wceu-2026/slides/ has 20 slide files");
  } else {
    failCheck(`wceu-2026/slides/ has ${slidesCount} files (expected 20)`);
  }

  console.log("");
  console.log("=== Frontmatter Validation ===");

  try {
    execSync("npm run validate:frontmatter", {
      stdio: "pipe",
      cwd: process.cwd(),
    });
    passCheck("npm run validate:frontmatter passed");
  } catch (_err) {
    failCheck("npm run validate:frontmatter failed");
  }

  console.log("");
  console.log("=== Markdown Linting ===");

  try {
    execSync("npm run lint:md -- wceu-2026/", {
      stdio: "pipe",
      cwd: process.cwd(),
    });
    passCheck("npm run lint:md wceu-2026/ passed");
  } catch (_err) {
    failCheck("npm run lint:md wceu-2026/ failed");
  }

  console.log("");
  console.log("=== File References ===");

  // Check that CHANGELOG mentions wceu-2026/agent-slides
  if (grepCount("CHANGELOG.md", "wceu-2026/agent-slides") > 0) {
    passCheck("CHANGELOG.md references wceu-2026/agent-slides");
  } else {
    failCheck("CHANGELOG.md does not reference wceu-2026/agent-slides");
  }

  // Check that scripts reference wceu-2026/agent-slides
  if (
    grepCount("scripts/audit-branding-patterns.js", "wceu-2026/agent-slides") >
    0
  ) {
    passCheck(
      "scripts/audit-branding-patterns.js references wceu-2026/agent-slides",
    );
  } else {
    failCheck(
      "scripts/audit-branding-patterns.js does not reference wceu-2026/agent-slides",
    );
  }

  console.log("");
  console.log("==========================================");
  console.log(
    `Results: ${COLORS.GREEN}${checksPassed} passed${COLORS.RESET}, ${COLORS.RED}${checksFailed} failed${COLORS.RESET}`,
  );
  console.log("==========================================");

  process.exit(checksFailed > 0 ? 1 : 0);
}

main();
