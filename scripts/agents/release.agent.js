/**
 * ============================================================================
 * Agent: release.agent.js
 * Location: scripts/agents/release.agent.js
 * Description:
 *   - Automates release validation, changelog enforcement, versioning, tagging, and GitHub Releases
 *   - Main functions: run(), validateRelease(), bumpVersion(), createTag(), publishRelease()
 *   - Uses shared utilities: changelogUtils, validate-version, validate-changelog
 *   - Supports dry-run mode for testing
 * Standards:
 *   - Follows [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/HEAD/instructions/coding-standards.instructions.md)
 *   - See org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 *   - See spec: ../../agents/release.agent.md
 * ============================================================================
 * @module scripts/agents/release.agent.js
 * @see ../../agents/release.agent.md
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";

// ES Module __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// TODO (a): Expand CLI parsing to accept changelog/version overrides and plug in explicit changelog detection before determining the next release.

// Import utilities (CommonJS modules via require)
const changelogUtilsPath = path.join(__dirname, "includes/changelogUtils.cjs");
const validateVersionPath = path.join(
  __dirname,
  "../validation/validate-version.cjs",
);

const {
  parseChangelog,
  validateChangelog,
  hasUnreleasedChanges,
} = require(changelogUtilsPath);
const { validateVersion, parseVersion } = require(validateVersionPath);

/**
 * Execute shell command
 * @param {string} cmd - Command to execute
 * @param {boolean} dryRun - Dry run mode
 * @param {boolean} allowError - Swallow errors and return empty string
 * @returns {string} Command output
 * @throws {Error} If the command fails and `allowError` is false
 */
function exec(cmd, dryRun = false, allowError = false) {
  if (dryRun) {
    console.log(`[DRY-RUN] Would execute: ${cmd}`);
    return "";
  }
  try {
    return execSync(cmd, { encoding: "utf8" });
  } catch (error) {
    if (allowError) {
      console.warn(`Command failed (allowed): ${cmd}\n${error.message}`);
      return "";
    }
    throw new Error(`Command failed: ${cmd}\n${error.message}`, {
      cause: error,
    });
  }
}

/**
 * Determine next version based on labels
 * @param {string} currentVersion - Current version
 * @param {string} scope - Release scope (major, minor, patch)
 * @returns {string} Next version
 */
function determineNextVersion(currentVersion, scope = "patch") {
  const parsed = parseVersion(currentVersion);
  if (!parsed) {
    throw new Error(`Invalid current version: ${currentVersion}`);
  }

  let { major, minor, patch } = parsed;

  switch (scope.toLowerCase()) {
    case "major":
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case "minor":
      minor += 1;
      patch = 0;
      break;
    case "patch":
    default:
      patch += 1;
      break;
  }

  return `${major}.${minor}.${patch}`;
}

/**
 * Fetch merged pull requests between two Git references, including `toTag`.
 *
 * Only merge commits with GitHub's standard pull request message are returned.
 * Git command failures and ranges without matching commits return an empty array.
 *
 * @param {string|null|undefined} fromTag - Exclusive lower bound, or a falsy value to inspect all reachable history
 * @param {string} toTag - Inclusive upper Git reference
 * @returns {Array<Object>} Pull request metadata parsed from matching merge commits
 */
function getMergedPRs(fromTag, toTag = "HEAD") {
  console.log(
    `Fetching merged PRs from ${fromTag || "start"} to ${toTag || "HEAD"}...`,
  );

  let gitLog;
  if (fromTag) {
    gitLog = exec(
      `git log ${fromTag}..${toTag} --merges --format="%H|%s|%an|%ae"`,
      false,
      true,
    );
  } else {
    gitLog = exec(
      `git log ${toTag} --merges --format="%H|%s|%an|%ae"`,
      false,
      true,
    );
  }

  if (!gitLog) return [];

  const prPattern = /Merge pull request #(\\d+) from (.+)/;
  const prs = [];

  gitLog
    .split("\n")
    .filter(Boolean)
    .forEach((line) => {
      const parts = line.split("|");
      if (parts.length >= 4) {
        const [hash, message, author, email] = parts;
        const match = message.match(prPattern);

        if (match) {
          prs.push({
            number: match[1],
            branch: match[2],
            hash,
            message,
            author: { name: author, email },
          });
        }
      }
    });

  return prs;
}

/**
 * Compile contributor list from PRs
 */
function getContributors(prs) {
  const contributorsMap = new Map();

  prs.forEach((pr) => {
    const key = pr.author.email || pr.author.name;
    if (!contributorsMap.has(key)) {
      contributorsMap.set(key, {
        name: pr.author.name,
        email: pr.author.email,
        prCount: 0,
      });
    }
    contributorsMap.get(key).prCount += 1;
  });

  return Array.from(contributorsMap.values()).sort(
    (a, b) => b.prCount - a.prCount,
  );
}

/**
 * Detect breaking changes in a release section
 */
function detectBreakingChanges(changelogData, version) {
  const release = changelogData.releases.find((r) => r.version === version);
  if (!release || !release.sections) return [];

  const breakingChanges = [];

  Object.keys(release.sections).forEach((section) => {
    const items = release.sections[section] || [];
    items.forEach((item) => {
      const lowerItem = item.toLowerCase();
      if (
        lowerItem.includes("breaking") ||
        lowerItem.includes("incompatible") ||
        lowerItem.includes("removed") ||
        (section === "removed" && !lowerItem.includes("deprecated"))
      ) {
        breakingChanges.push({ section, item });
      }
    });
  });

  return breakingChanges;
}

/**
 * Generate short highlights from the changelog
 */
function generateHighlights(changelogData, version) {
  const release = changelogData.releases.find((r) => r.version === version);
  if (!release || !release.sections) return [];

  const highlights = [];
  const prioritySections = ["added", "changed", "security"];

  prioritySections.forEach((section) => {
    const items = release.sections[section] || [];
    items.slice(0, 3).forEach((item) => {
      highlights.push({ section, item });
    });
  });

  return highlights.slice(0, 5);
}

/**
 * Build release notes (Markdown)
 */
function formatReleaseNotes(options = {}) {
  const {
    version,
    changelogPath = "CHANGELOG.md",
    includeContributors = true,
    includeBreakingChanges = true,
    includeHighlights = true,
  } = options;

  if (!version) {
    throw new Error("Version is required to format release notes");
  }

  const changelogData = parseChangelog(changelogPath);
  const release = changelogData.releases.find((r) => r.version === version);
  if (!release) {
    throw new Error(`Version ${version} not found in CHANGELOG`);
  }

  // Determine tag range
  const tagsOutput = exec("git tag --sort=-version:refname", false, true);
  const tags = tagsOutput ? tagsOutput.split("\n").filter(Boolean) : [];
  const currentTag = `v${version}`;
  const currentIndex = tags.indexOf(currentTag);
  const previousTag =
    currentIndex >= 0 && currentIndex < tags.length - 1
      ? tags[currentIndex + 1]
      : null;

  const prs = getMergedPRs(previousTag, currentTag);
  const contributors = getContributors(prs);
  const breakingChanges = includeBreakingChanges
    ? detectBreakingChanges(changelogData, version)
    : [];
  const highlights = includeHighlights
    ? generateHighlights(changelogData, version)
    : [];

  let notes = `# Release ${version}\n\n`;

  if (highlights.length > 0) {
    notes += "## ✨ Highlights\n\n";
    highlights.forEach((h) => {
      notes += `- **${h.section.charAt(0).toUpperCase() + h.section.slice(1)}**: ${h.item}\n`;
    });
    notes += "\n";
  }

  if (breakingChanges.length > 0) {
    notes += "## ⚠️ Breaking Changes\n\n";
    notes += `This release contains **${breakingChanges.length}** breaking change(s):\n\n`;
    breakingChanges.forEach((bc) => {
      notes += `- ${bc.item}\n`;
    });
    notes +=
      "\nPlease review any migration notes and update your code accordingly.\n\n";
  }

  notes += "## 📋 Changes\n\n";
  const sectionOrder = [
    "added",
    "changed",
    "deprecated",
    "removed",
    "fixed",
    "security",
    "documentation",
    "performance",
  ];
  const sectionEmojis = {
    added: "✨",
    changed: "🔄",
    deprecated: "⚠️",
    removed: "🗑️",
    fixed: "🐛",
    security: "🔒",
    documentation: "📚",
    performance: "⚡",
  };

  sectionOrder.forEach((section) => {
    const items = release.sections[section] || [];
    if (items.length > 0) {
      const emoji = sectionEmojis[section] || "•";
      const title = section.charAt(0).toUpperCase() + section.slice(1);
      notes += `### ${emoji} ${title}\n\n`;
      items.forEach((item) => {
        notes += `- ${item}\n`;
      });
      notes += "\n";
    }
  });

  if (includeContributors && contributors.length > 0) {
    notes += "## 👥 Contributors\n\n";
    notes += `This release was made possible by ${contributors.length} contributor(s):\n\n`;
    contributors.forEach((c) => {
      notes += `- **${c.name}** (${c.prCount} PR${c.prCount > 1 ? "s" : ""})\n`;
    });
    notes += "\n";
  }

  notes += "## 📦 Installation\n\n";
  notes += "```bash\n";
  notes += `npm install @lightspeedwp/github-community-health@${version}\n`;
  notes += "```\n\n";

  notes += "---\n\n";
  notes += "**Full Changelog**: ";
  if (previousTag) {
    notes += `[\`${previousTag}...v${version}\`](../../compare/${previousTag}...v${version})\n`;
  } else {
    notes += `[View all changes](../../commits/v${version})\n`;
  }

  return notes;
}

/**
 * Validate release readiness
 * @param {Object} options - Validation options
 * @returns {Promise<Object>} Validation results
 */
async function validateRelease(options = {}) {
  const {
    versionPath = "VERSION",
    changelogPath = "CHANGELOG.md",
    dryRun = false,
  } = options;

  console.log("=== Release Validation ===");
  const errors = [];
  const warnings = [];

  // 1. Validate VERSION file exists and is valid
  console.log("\n1. Validating VERSION file...");
  if (!fs.existsSync(versionPath)) {
    errors.push(`VERSION file not found: ${versionPath}`);
  } else {
    const versionContent = fs.readFileSync(versionPath, "utf8").trim();
    const versionResult = validateVersion(versionContent);
    if (!versionResult.valid) {
      errors.push(`Invalid VERSION: ${versionResult.error}`);
    } else {
      console.log(`   ✓ Current version: ${versionContent}`);
    }
  }

  // 2. Validate CHANGELOG.md exists and is valid
  console.log("\n2. Validating CHANGELOG.md...");
  if (!fs.existsSync(changelogPath)) {
    errors.push(`CHANGELOG.md not found: ${changelogPath}`);
  } else {
    try {
      const changelogData = parseChangelog(changelogPath);
      const changelogResult = validateChangelog(changelogData);

      if (!changelogResult.valid) {
        errors.push(`Invalid CHANGELOG: ${changelogResult.errors.join(", ")}`);
      } else {
        console.log(
          `   ✓ CHANGELOG is valid (${changelogData.releases.length} releases)`,
        );

        // Check for unreleased changes
        if (hasUnreleasedChanges(changelogData)) {
          console.log("   ✓ Unreleased changes found");
        } else {
          errors.push(
            "No unreleased changes in CHANGELOG — add entries before releasing",
          );
        }
      }
    } catch (error) {
      errors.push(`CHANGELOG parsing error: ${error.message}`);
    }
  }

  // 3. Check git status
  console.log("\n3. Checking git status...");
  try {
    const status = exec("git status --porcelain", dryRun);
    if (status && !dryRun) {
      warnings.push("Working directory has uncommitted changes");
      console.log("   ⚠ Uncommitted changes detected");
    } else {
      console.log("   ✓ Working directory is clean");
    }
  } catch (error) {
    warnings.push(`Git status check failed: ${error.message}`);
  }

  // 4. Run tests (if package.json has test script)
  console.log("\n4. Checking test suite...");
  if (fs.existsSync("package.json")) {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    if (pkg.scripts && pkg.scripts.test) {
      console.log("   ℹ Test script found (run separately via CI)");
    } else {
      console.log("   ℹ No test script defined");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Bump version in VERSION file
 * @param {string} newVersion - New version string
 * @param {Object} options - Options
 */
function bumpVersion(newVersion, options = {}) {
  const { versionPath = "VERSION", dryRun = false } = options;

  console.log(`\n=== Bumping Version to ${newVersion} ===`);

  if (dryRun) {
    console.log(`[DRY-RUN] Would write "${newVersion}" to ${versionPath}`);
    return;
  }

  fs.writeFileSync(versionPath, `${newVersion}\n`, "utf8");
  console.log(`✓ Version bumped to ${newVersion}`);
}

/**
 * Update CHANGELOG.md with new version
 * @param {string} newVersion - New version string
 * @param {Object} options - Options
 */
function updateChangelog(newVersion, options = {}) {
  const { changelogPath = "CHANGELOG.md", dryRun = false } = options;

  console.log(`\n=== Updating CHANGELOG for ${newVersion} ===`);

  if (!fs.existsSync(changelogPath)) {
    throw new Error(`CHANGELOG not found: ${changelogPath}`);
  }

  const content = fs.readFileSync(changelogPath, "utf8");
  const today = new Date().toISOString().split("T")[0];

  // Replace [Unreleased] - DD-MM-YYYY with [newVersion] - YYYY-MM-DD
  const updatedContent = content.replace(
    /^## \[Unreleased\] - (?:DD-MM-YYYY|YYYY-MM-DD|\d{4}-\d{2}-\d{2})$/m,
    `## [${newVersion}] - ${today}`,
  );

  if (dryRun) {
    console.log(
      `[DRY-RUN] Would update CHANGELOG.md Unreleased section to [${newVersion}] - ${today}`,
    );
    return;
  }

  fs.writeFileSync(changelogPath, updatedContent, "utf8");
  console.log(`✓ CHANGELOG updated with version ${newVersion}`);
}

/**
 * Create git tag
 * @param {string} version - Version to tag
 * @param {Object} options - Options
 */
function createTag(version, options = {}) {
  const { dryRun = false } = options;

  const tagName = `v${version}`;
  console.log(`\n=== Creating Git Tag: ${tagName} ===`);

  exec(`git tag -a ${tagName} -m "Release ${tagName}"`, dryRun);
  console.log(`✓ Tag ${tagName} created`);
}

/**
 * Push changes and tags
 * @param {Object} options - Options
 */
function pushChanges(options = {}) {
  const { dryRun = false, branch = "develop" } = options;

  console.log("\n=== Pushing Changes ===");

  exec(`git push origin ${branch}`, dryRun);
  exec("git push --tags", dryRun);

  console.log("✓ Changes and tags pushed");
}

/**
 * Create GitHub Release
 * @param {string} version - Version for release
 * @param {Object} options - Options
 */
function createRelease(version, options = {}) {
  const { changelogPath = "CHANGELOG.md", dryRun = false } = options;

  console.log(`\n=== Creating GitHub Release for v${version} ===`);

  // Extract release notes from changelog
  const releaseNotes = formatReleaseNotes({ version, changelogPath });

  // TODO (c): Harden GitHub release/tag creation with retries, templated notes, and PR gating before publishing.

  if (dryRun) {
    console.log("[DRY-RUN] Would create GitHub release:");
    console.log(releaseNotes);
    return;
  }

  // Use gh CLI to create release
  const notesFile = `/tmp/release-notes-${version}.md`;
  fs.writeFileSync(notesFile, releaseNotes, "utf8");

  try {
    exec(
      `gh release create v${version} --title "Release v${version}" --notes-file "${notesFile}"`,
      dryRun,
    );
    console.log(`✓ GitHub Release v${version} created`);
  } finally {
    if (fs.existsSync(notesFile)) {
      fs.unlinkSync(notesFile);
    }
  }
}

/**
 * Create release PR from release branch to main
 */
function createReleasePR(version, branch, options = {}) {
  const { dryRun = false } = options;
  const title = `chore(release): v${version}`;
  const body =
    "Automated release PR generated by release.agent.js. Includes version bump, changelog update, and tag creation.";

  if (dryRun) {
    console.log(
      `[DRY-RUN] Would create PR from ${branch} to main with title "${title}"`,
    );
    return;
  }

  try {
    exec(
      `gh pr create --base main --head ${branch} --title "${title}" --body "${body}"`,
      dryRun,
    );
    console.log("✓ Release PR created");
  } catch (error) {
    console.warn(
      `⚠️  Failed to auto-create release PR. Please create manually from ${branch} to main. (${error.message})`,
    );
  }
}

/**
 * Main release orchestrator
 */
async function run() {
  try {
    // Parse command-line arguments
    const args = process.argv.slice(2);
    const dryRun =
      args.includes("--dry-run") || args.includes("--dry-run=true");
    const scopeArg = args.find((arg) => arg.startsWith("--scope="));
    const scope = scopeArg ? scopeArg.split("=")[1] : "patch";
    const providerArg = args.find((arg) => arg.startsWith("--provider="));
    const provider = providerArg ? providerArg.split("=")[1] : "shell";

    console.log("╔════════════════════════════════════════╗");
    console.log("║     LightSpeed Release Agent           ║");
    console.log("╚════════════════════════════════════════╝");
    console.log("");
    console.log(`Mode: ${dryRun ? "DRY-RUN" : "LIVE"}`);
    console.log(`Scope: ${scope}`);
    // TODO (d): Clarify dry-run vs apply controls (additional flags or safeguards) so we can safely exercise the workflow end-to-end.
    console.log("");

    // Step 1: Validate release readiness
    const validation = await validateRelease({ dryRun });

    if (!validation.valid) {
      console.error("\n❌ Release validation failed:");
      validation.errors.forEach((err) => console.error(`  - ${err}`));
      process.exit(1);
    }

    if (validation.warnings.length > 0) {
      console.warn("\n⚠️  Warnings:");
      validation.warnings.forEach((warn) => console.warn(`  - ${warn}`));
    }

    console.log("\n✅ All validations passed");

    // Step 2: Determine next version
    const currentVersion = fs.readFileSync("VERSION", "utf8").trim();
    const nextVersion = determineNextVersion(currentVersion, scope);
    const releaseBranch = `release/v${nextVersion}`;

    console.log(`\nVersion bump: ${currentVersion} → ${nextVersion}`);
    // TODO (b): Strengthen the version bump + validation steps to lock changelog sections, dependencies, and metadata before mutating files.

    // MCP provider path: API-driven release without a local checkout.
    // Kept separate from the shell flow below, which mutates the working
    // tree (branches, version files, tags via git/gh).
    if (provider === "mcp") {
      const mcp = createMcpReleaseProvider();
      await mcp.preflight(nextVersion, { dryRun });
      await mcp.createTag(nextVersion, { dryRun });
      await mcp.createReleasePR(nextVersion, releaseBranch, { dryRun });

      console.log("\n");
      console.log("╔════════════════════════════════════════╗");
      console.log("║   ✅ Release completed successfully!   ║");
      console.log("╚════════════════════════════════════════╝");
      console.log(`\nVersion: ${nextVersion}`);
      console.log(`Tag: v${nextVersion}`);

      if (dryRun) {
        console.log("\n⚠️  This was a DRY-RUN. No changes were made.");
      }
      return;
    }

    // Step 2b: Create release branch
    if (!dryRun) {
      exec(`git checkout -b ${releaseBranch}`);
    } else {
      console.log(`[DRY-RUN] Would create branch ${releaseBranch}`);
    }

    // Step 3: Bump version
    bumpVersion(nextVersion, { dryRun });

    // Step 4: Update changelog
    updateChangelog(nextVersion, { dryRun });

    // Step 5: Stage all changes and run Husky pre-commit hooks, then commit
    if (!dryRun) {
      exec("git add .");
      exec("npx husky run pre-commit");
      exec(`git commit -m "chore(release): bump version to ${nextVersion}"`);
    } else {
      console.log(
        `\n[DRY-RUN] Would stage all changes, run Husky pre-commit hooks, and commit with message: "chore(release): bump version to ${nextVersion}"`,
      );
    }

    // Step 6: Create tag
    createTag(nextVersion, { dryRun });

    // Step 7: Push changes
    pushChanges({ dryRun, branch: releaseBranch });

    // Step 7b: Open release PR (develop -> main via release branch)
    createReleasePR(nextVersion, releaseBranch, { dryRun });

    // Step 8: Create GitHub Release
    createRelease(nextVersion, { dryRun });

    console.log("\n");
    console.log("╔════════════════════════════════════════╗");
    console.log("║   ✅ Release completed successfully!   ║");
    console.log("╚════════════════════════════════════════╝");
    console.log(`\nVersion: ${nextVersion}`);
    console.log(`Tag: v${nextVersion}`);

    if (dryRun) {
      console.log("\n⚠️  This was a DRY-RUN. No changes were made.");
    }
  } catch (error) {
    console.error("\n❌ Release failed:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  run();
}

/**
 * Resolve the target repository from the environment.
 * @returns {{owner: string, repo: string}}
 */
function getTargetRepo() {
  const [owner = "lightspeedwp", repo = ".github"] = (
    process.env.GITHUB_REPOSITORY || "lightspeedwp/.github"
  ).split("/");
  return { owner, repo };
}

/**
 * Call the GitHub REST API with retries on retryable failures.
 * @param {string} apiPath - API path (e.g. "/repos/o/r/pulls")
 * @param {Object} options - { method, body, retries, initialBackoffMs, backoffFactor }
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} With a `status` property when the API responds with an error
 */
async function githubApiRequest(apiPath, options = {}) {
  const {
    method = "GET",
    body,
    retries = 2,
    initialBackoffMs = 500,
    backoffFactor = 2,
  } = options;

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is required for GitHub API requests");
  }

  let attempt = 0;
  let delayMs = initialBackoffMs;
  for (;;) {
    const response = await globalThis.fetch(
      `https://api.github.com${apiPath}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "lightspeedwp-release-agent",
          ...(body !== undefined
            ? { "Content-Type": "application/json" }
            : {}),
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      },
    );
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // Non-JSON response body: data stays null.
    }

    if (response.ok) {
      return data;
    }

    const retryable = response.status >= 500 || response.status === 429;
    if (!retryable || attempt >= retries) {
      const error = new Error(
        `GitHub API ${method} ${apiPath} failed: ${response.status} ${response.statusText}`,
      );
      error.status = response.status;
      throw error;
    }

    attempt += 1;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    delayMs *= backoffFactor;
  }
}

/**
 * Check whether a tag or release already exists (404 means absent).
 * @param {() => Promise<any>} probe - API call to attempt
 * @returns {Promise<boolean>} True when the probed resource exists
 */
async function apiResourceExists(probe) {
  try {
    await probe();
    return true;
  } catch (error) {
    if (error && error.status === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Create the API (MCP) release provider. Performs release operations
 * through the GitHub REST API instead of local git/gh commands, so it
 * works in environments without a checkout (e.g. release workflows).
 * @returns {{name: string, preflight: Function, createTag: Function, createReleasePR: Function, createReleasePRToMain: Function}}
 */
function createMcpReleaseProvider() {
  const { owner, repo } = getTargetRepo();
  const base = `/repos/${owner}/${repo}`;

  return {
    name: "mcp",

    async preflight(version, options = {}) {
      const { dryRun = false } = options;
      const tag = `v${version}`;

      if (
        await apiResourceExists(() =>
          githubApiRequest(`${base}/git/ref/tags/${tag}`),
        )
      ) {
        throw new Error(`Tag ${tag} already exists`);
      }
      if (
        await apiResourceExists(() =>
          githubApiRequest(`${base}/releases/tags/${tag}`),
        )
      ) {
        throw new Error(`Release ${tag} already exists`);
      }

      console.log(
        `${dryRun ? "[DRY-RUN] " : ""}[MCP] Preflight passed for ${tag}`,
      );
      return { tagExists: false, releaseExists: false };
    },

    async createTag(version, options = {}) {
      const { dryRun = false } = options;
      const tag = `v${version}`;
      if (dryRun) {
        console.log(`[DRY-RUN] [MCP] Would create tag ref ${tag}`);
        return { ref: `refs/tags/${tag}`, dryRun: true };
      }
      // GITHUB_SHA is always set on Actions runners; "HEAD" keeps local
      // usage working without inventing a commit hash.
      const sha = process.env.GITHUB_SHA || "HEAD";
      return githubApiRequest(`${base}/git/refs`, {
        method: "POST",
        body: { ref: `refs/tags/${tag}`, sha },
      });
    },

    async createReleasePR(version, branch, options = {}) {
      const { dryRun = false } = options;
      if (dryRun) {
        console.log(
          `[DRY-RUN] [MCP] Would create release PR from ${branch} to develop`,
        );
        return { dryRun: true, head: branch, base: "develop" };
      }
      return githubApiRequest(`${base}/pulls`, {
        method: "POST",
        body: {
          title: `chore(release): v${version}`,
          head: branch,
          base: "develop",
          body: "Automated release PR generated by release.agent.js (MCP provider).",
        },
      });
    },

    async createReleasePRToMain(version, options = {}) {
      const { dryRun = false, branch = "develop", developPRNumber } = options;
      const head = developPRNumber ? "develop" : branch;
      if (dryRun) {
        console.log(
          `[DRY-RUN] [MCP] Would create release PR from ${head} to main`,
        );
        return { dryRun: true, head, base: "main" };
      }
      const created = await githubApiRequest(`${base}/pulls`, {
        method: "POST",
        body: {
          title: `chore(release): v${version}`,
          head,
          base: "main",
          body: `Automated main release PR generated by release.agent.js (MCP provider).${developPRNumber ? ` Develop PR: #${developPRNumber}.` : ""}`,
        },
      });
      return created && created.number !== undefined ? created.number : created;
    },
  };
}

/**
 * Create the shell release provider. Thin wrapper over this module's
 * existing git/gh-based functions for environments with a checkout.
 */
function createShellReleaseProvider() {
  return {
    name: "shell",

    async preflight() {
      return { ok: true, provider: "shell" };
    },

    async createTag(version, options = {}) {
      return createTag(version, options);
    },

    async createReleasePR(version, branch, options = {}) {
      return createReleasePR(version, branch, options);
    },

    async createReleasePRToMain(version, options = {}) {
      const { dryRun = false, branch = "develop" } = options;
      const title = `chore(release): v${version}`;
      if (dryRun) {
        console.log(
          `[DRY-RUN] Would create PR from ${branch} to main with title "${title}"`,
        );
        return;
      }
      // Strict on purpose: unlike createReleasePR (which warns and
      // continues for the interactive flow), a workflow-called release PR
      // must fail loudly when gh cannot create it.
      const output = exec(
        `gh pr create --base main --head ${branch} --title "${title}" --body "Automated main release PR generated by release.agent.js (shell provider)."`,
        dryRun,
      );
      console.log("✓ Main release PR created");
      const match = String(output || "").match(/\/pull\/(\d+)/);
      return match ? match[1] : undefined;
    },

    async createRelease(version, options = {}) {
      return createRelease(version, options);
    },
  };
}

export {
  run,
  validateRelease,
  bumpVersion,
  updateChangelog,
  createTag,
  pushChanges,
  createRelease,
  determineNextVersion,
  formatReleaseNotes,
  createReleasePR,
  githubApiRequest,
  createMcpReleaseProvider,
  createShellReleaseProvider,
};
