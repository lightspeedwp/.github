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
  getUnreleasedChanges,
  hasUnreleasedChanges,
} = require(changelogUtilsPath);
const { validateVersion, parseVersion } = require(validateVersionPath);

/**
 * Execute shell command
 * @param {string} cmd - Command to execute
 * @param {boolean} dryRun - Dry run mode
 * @param {boolean} allowError - Swallow errors and return empty string
 * @returns {string} Command output
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
    throw new Error(`Command failed: ${cmd}\n${error.message}`);
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
 * Fetch merged PRs between two tags (inclusive of toTag)
 */
function getMergedPRs(fromTag, toTag = "HEAD") {
  console.log(
    `Fetching merged PRs from ${fromTag || "start"} to ${toTag || "HEAD"}...`,
  );

  let gitLog = "";
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
        const unreleased = getUnreleasedChanges(changelogData);
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
};
