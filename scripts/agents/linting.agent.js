/**
 * file_type: agent-js
 * title: "Linting JavaScript Agent"
 * description: Runs linting checks on code files to ensure coding standards.
 * references: ["./linting.agent.md"]
 * @module scripts/agents/linting.agent.js
 * @see ../../agents/linting.agent.md
 */

const fs = require("fs");
const path = require("path");

/**
 * Repository type constants returned by detectRepositoryType(). Casing is
 * deliberately inconsistent across types (BLOCK_PLUGIN vs
 * wordpress-plugin) -- this matches the exact strings the linting-agent
 * integration test suite asserts on; changing it would just move the
 * inconsistency into the tests instead of removing it.
 */
const REPO_TYPES = {
  BLOCK_PLUGIN: "BLOCK_PLUGIN",
  CONTROL_PLANE: "control-plane",
  WORDPRESS_PLUGIN: "wordpress-plugin",
  WORDPRESS_THEME: "wordpress-theme",
  UNKNOWN: "UNKNOWN",
};

function fileExists(repoPath, ...segments) {
  return fs.existsSync(path.join(repoPath, ...segments));
}

function hasRootFileWithExtension(repoPath, extension) {
  let entries;
  try {
    entries = fs.readdirSync(repoPath, { withFileTypes: true });
  } catch {
    return false;
  }
  return entries.some(
    (entry) => entry.isFile() && entry.name.endsWith(extension),
  );
}

/**
 * Detect the kind of repository at `repoPath` so the caller can select an
 * appropriate linting configuration (JS/TS + PHP for block plugins, PHP
 * only for classic plugins/themes, JS/Markdown/YAML/Shell for the
 * .github control-plane repo, etc).
 *
 * Checked in priority order, most-specific first, since a repository can
 * carry markers for more than one type at once (e.g. a block plugin also
 * has a package.json and may include a root .php file):
 *   1. BLOCK_PLUGIN     - a block.json at the repo root
 *   2. wordpress-theme  - theme.json, style.css, or functions.php at root
 *   3. control-plane    - .github/workflows or .github/actions
 *   4. wordpress-plugin - any .php file at the repo root
 *   5. UNKNOWN          - none of the above
 *
 * control-plane is checked before the generic wordpress-plugin .php check
 * because the control-plane repo itself may contain a stray root .php
 * file (verified not to be linted as PHP there) alongside its
 * .github/workflows directory.
 *
 * @param {string} repoPath - Absolute path to the repository root.
 * @returns {string} One of the REPO_TYPES values.
 */
function detectRepositoryType(repoPath) {
  if (fileExists(repoPath, "block.json")) {
    return REPO_TYPES.BLOCK_PLUGIN;
  }

  if (
    fileExists(repoPath, "theme.json") ||
    fileExists(repoPath, "style.css") ||
    fileExists(repoPath, "functions.php")
  ) {
    return REPO_TYPES.WORDPRESS_THEME;
  }

  if (
    fileExists(repoPath, ".github", "workflows") ||
    fileExists(repoPath, ".github", "actions")
  ) {
    return REPO_TYPES.CONTROL_PLANE;
  }

  if (hasRootFileWithExtension(repoPath, ".php")) {
    return REPO_TYPES.WORDPRESS_PLUGIN;
  }

  return REPO_TYPES.UNKNOWN;
}

// Example stub: integrate with ESLint or other linters as needed.
function lintCodebase(rootDir = process.cwd()) {
  console.log("Linting codebase in: " + rootDir);
  // Insert linter logic here
}

module.exports = lintCodebase;
module.exports.lintCodebase = lintCodebase;
module.exports.detectRepositoryType = detectRepositoryType;
module.exports.REPO_TYPES = REPO_TYPES;
