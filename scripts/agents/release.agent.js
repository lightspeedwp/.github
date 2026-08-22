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
 *   - See spec: ../../../.github/agents/release.agent.md
 * ============================================================================
 * @module scripts/agents/release.agent.js
 * @see ../../../.github/agents/release.agent.md
 */

import fs from "fs";
import os from "os";
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
const validateBranchNamePath = path.join(
  __dirname,
  "../validation/validate-branch-name.cjs",
);

const { parseChangelog, validateChangelog, hasUnreleasedChanges } = require(
  changelogUtilsPath,
);
const { validateVersion, parseVersion } = require(validateVersionPath);
const { validateBranchName } = require(validateBranchNamePath);
const VALID_PROVIDERS = new Set(["shell", "mcp"]);

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
    throw new Error(`Command failed: ${cmd}\n${error.message}`, {
      cause: error,
    });
  }
}

/**
 * Resolve repository owner/name from environment.
 * @returns {{owner: string, repo: string}}
 */
function getRepositoryContext() {
  const fromPair = process.env.GITHUB_REPOSITORY || "";
  if (fromPair.includes("/")) {
    const [owner, repo] = fromPair.split("/");
    if (owner && repo) {
      return { owner, repo };
    }
  }

  const owner = process.env.RELEASE_REPO_OWNER || "";
  const repo = process.env.RELEASE_REPO_NAME || "";
  if (owner && repo) {
    return { owner, repo };
  }

  throw new Error(
    "Repository context missing. Set GITHUB_REPOSITORY or RELEASE_REPO_OWNER and RELEASE_REPO_NAME.",
  );
}

/**
 * Execute a GitHub API request for release provider operations.
 * @param {string} endpoint - API endpoint beginning with '/'
 * @param {Object} options - Request options
 * @returns {Promise<any>} Parsed response body
 */
async function githubApiRequest(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    allowNotFound = false,
    token = process.env.GITHUB_TOKEN,
    retries = Number.parseInt(process.env.RELEASE_MCP_RETRIES || "3", 10),
    initialBackoffMs = Number.parseInt(
      process.env.RELEASE_MCP_BACKOFF_MS || "250",
      10,
    ),
    backoffFactor = Number.parseFloat(
      process.env.RELEASE_MCP_BACKOFF_FACTOR || "2",
    ),
  } = options;

  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is required for MCP release provider operations.",
    );
  }

  const url = `https://api.github.com${endpoint}`;
  const fetchFn = globalThis.fetch;
  if (typeof fetchFn !== "function") {
    throw new Error(
      "Fetch API is unavailable in this runtime. Use Node.js 18+ for MCP release provider operations.",
    );
  }

  let attempt = 0;
  let delayMs = Number.isNaN(initialBackoffMs) ? 250 : initialBackoffMs;
  const maxRetries = Number.isNaN(retries) ? 3 : Math.max(retries, 0);
  const growth = Number.isNaN(backoffFactor) ? 2 : Math.max(backoffFactor, 1);

  while (attempt <= maxRetries) {
    let response;
    try {
      response = await fetchFn(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      if (attempt >= maxRetries) {
        throw new Error(
          `GitHub API ${method} ${endpoint} request failed after ${attempt + 1} attempt(s): ${error.message}`,
          { cause: error },
        );
      }

      await new Promise((resolve) => {
        setTimeout(resolve, delayMs);
      });
      delayMs = Math.max(Math.ceil(delayMs * growth), delayMs);
      attempt += 1;
      continue;
    }

    if (allowNotFound && response.status === 404) {
      return null;
    }

    const text = await response.text();
    const parsed = text ? JSON.parse(text) : null;

    if (response.ok) {
      return parsed;
    }

    const shouldRetry = response.status === 429 || response.status >= 500;
    const details = parsed?.message || text || response.statusText;
    if (!shouldRetry || attempt >= maxRetries) {
      throw new Error(
        `GitHub API ${method} ${endpoint} failed (${response.status}): ${details}`,
      );
    }

    await new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
    delayMs = Math.max(Math.ceil(delayMs * growth), delayMs);
    attempt += 1;
  }

  throw new Error(
    `GitHub API ${method} ${endpoint} failed unexpectedly after retries.`,
  );
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
 * Compare two semver strings.
 * @param {string} leftVersion - Left version
 * @param {string} rightVersion - Right version
 * @returns {number} -1 if left < right, 0 if equal, 1 if left > right
 */
function compareVersions(leftVersion, rightVersion) {
  const left = parseVersion(leftVersion);
  const right = parseVersion(rightVersion);
  if (!left || !right) {
    throw new Error(
      `Cannot compare invalid versions: ${leftVersion}, ${rightVersion}`,
    );
  }

  if (left.major !== right.major) return left.major > right.major ? 1 : -1;
  if (left.minor !== right.minor) return left.minor > right.minor ? 1 : -1;
  if (left.patch !== right.patch) return left.patch > right.patch ? 1 : -1;
  return 0;
}

/**
 * Fetch merged PRs between two tags (inclusive of toTag)
 */
function isValidGitRef(ref) {
  if (!ref || typeof ref !== "string") {
    return false;
  }
  const trimmed = ref.trim();
  // Reject dangerous patterns: whitespace, leading -, git rev-spec operators (^, ~, @, etc)
  if (/[\s]|^-|[\^~@*?:]/.test(trimmed)) {
    return false;
  }
  // Allow: SHAs, tags (v1.2.3), branch names (develop, main, release/*)
  // Roughly matches git refspec constraints
  return /^[a-zA-Z0-9_./:-]+$/.test(trimmed);
}

function getMergedPRs(fromTag, toTag = "HEAD") {
  console.log(
    `Fetching merged PRs from ${fromTag || "start"} to ${toTag || "HEAD"}...`,
  );

  if (fromTag && !isValidGitRef(fromTag)) {
    throw new Error(
      `Invalid git ref for notes-from: "${fromTag}". Must be a commit SHA (7-40 hex), version tag, or ref path.`,
    );
  }

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

  const prPattern = /Merge pull request #(\d+) from (.+)/;
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
    notesFrom = "",
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
  const rangeStart = notesFrom || previousTag;

  const prs = getMergedPRs(rangeStart, currentTag);
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
  if (rangeStart) {
    notes += `[\`${rangeStart}...v${version}\`](../../compare/${rangeStart}...v${version})\n`;
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

  // Replace [Unreleased] (with or without date) with new [Unreleased] section + released version
  const unreleasedTemplate = `## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

### Documentation

### Performance

## [${newVersion}] - ${today}`;

  const updatedContent = content.replace(
    /^## \[Unreleased\](?:\s*-\s*(?:DD-MM-YYYY|YYYY-MM-DD|\d{4}-\d{2}-\d{2}))?$/m,
    unreleasedTemplate,
  );

  if (dryRun) {
    console.log(
      `[DRY-RUN] Would update CHANGELOG.md: [Unreleased] → [Unreleased] + [${newVersion}] - ${today}`,
    );
    return updatedContent;
  }

  fs.writeFileSync(changelogPath, updatedContent, "utf8");
  console.log(`✓ CHANGELOG updated with version ${newVersion}`);
  console.log(`✓ New [Unreleased] section injected for next cycle`);
  return updatedContent;
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

  exec(`git push -u origin ${branch}`, dryRun);
  exec("git push --tags", dryRun);

  console.log("✓ Changes and tags pushed");
}

/**
 * Create GitHub Release
 * @param {string} version - Version for release
 * @param {Object} options - Options
 */
function createRelease(version, options = {}) {
  const {
    changelogPath = "CHANGELOG.md",
    dryRun = false,
    notesFrom = "",
  } = options;

  console.log(`\n=== Creating GitHub Release for v${version} ===`);

  // Extract release notes from changelog
  const releaseNotes = formatReleaseNotes({
    version,
    changelogPath,
    notesFrom,
  });

  // TODO (c): Harden GitHub release/tag creation with retries, templated notes, and PR gating before publishing.

  if (dryRun) {
    console.log("[DRY-RUN] Would create GitHub release:");
    console.log(releaseNotes);
    return;
  }

  // Use gh CLI to create release
  const notesFile = path.join(os.tmpdir(), `release-notes-${version}.md`);
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
 * Validate changelog structure after release update
 * Ensures the new [Unreleased] section conforms to schema
 * @param {string} changelogPath - Path to CHANGELOG.md
 * @param {string} nextVersion - Version that was just released
 * @throws {Error} If validation fails
 */
function validatePostReleaseChangelog(
  changelogPath = "CHANGELOG.md",
  nextVersion,
) {
  console.log(`\n=== Validating Post-Release CHANGELOG ===`);

  if (!nextVersion || typeof nextVersion !== "string") {
    throw new Error(
      `Invalid nextVersion parameter: "${nextVersion}" (expected semver string)`,
    );
  }

  if (!fs.existsSync(changelogPath)) {
    throw new Error(`CHANGELOG not found: ${changelogPath}`);
  }

  const content = fs.readFileSync(changelogPath, "utf8");

  // Validate [Unreleased] section exists
  if (!content.includes("## [Unreleased]")) {
    throw new Error(
      "New [Unreleased] section missing from CHANGELOG after update",
    );
  }

  // Validate new version section exists
  if (!content.includes(`## [${nextVersion}]`)) {
    throw new Error(
      `Release section [${nextVersion}] missing from CHANGELOG after update`,
    );
  }

  // Validate schema via parseChangelog and validateChangelog
  try {
    const changelogData = parseChangelog(changelogPath);
    const changelogResult = validateChangelog(changelogData);

    if (!changelogResult.valid) {
      throw new Error(
        `CHANGELOG schema validation failed: ${changelogResult.errors.join(", ")}`,
      );
    }

    console.log(`✓ [Unreleased] section is properly formatted`);
    console.log(`✓ [${nextVersion}] section is properly formatted`);
    console.log(`✓ CHANGELOG schema validation passed`);
  } catch (error) {
    throw new Error(
      `Post-release CHANGELOG validation failed: ${error.message}`,
      { cause: error },
    );
  }
}

/**
 * Build a release PR body that satisfies the main-branch-guard required sections.
 * @param {string} version - Release version (e.g. "1.2.3")
 * @returns {string} PR body markdown
 */
function buildReleasePRBody(version) {
  const today = new Date().toISOString().split("T")[0];
  return `## Linked issues & merged PRs

<!-- Auto-generated release PR. List any additional issues or PRs here. -->

## Changelog

See \`CHANGELOG.md\` for the full [\`${version}\`] entry dated ${today}.

### Checklist (Global DoD / PR)

- [x] Release branch \`release/v${version}\` created from \`develop\`
- [x] \`VERSION\` bumped to \`${version}\`
- [x] \`CHANGELOG.md\` \`[Unreleased]\` rolled to \`[${version}] - ${today}\`
- [x] Release notes compiled
- [ ] CI checks green
- [ ] Approved by maintainer
`;
}

/**
 * Build release PR body for develop target (first PR in develop-first flow)
 */
function buildReleasePRBodyToDevelop(version) {
  const today = new Date().toISOString().split("T")[0];
  return `## Linked issues & merged PRs

<!-- Auto-generated release PR (Phase 1: develop-first flow). List any additional issues or PRs here. -->

## Changelog

See \`CHANGELOG.md\` for the full [\`${version}\`] entry dated ${today}.

### Release Flow (Develop-First)

This is **Phase 1** of the two-phase release flow:

1. ✅ **Phase 1 (This PR):** Merge release branch → \`develop\`
   - Bumped VERSION to \`${version}\`
   - Updated CHANGELOG.md with release notes
   - Ready for integration testing on develop

2. ⏳ **Phase 2 (Automatic):** Create second PR \`develop\` → \`main\`
   - Created after this PR merges
   - Ready for production deployment

### Checklist (Global DoD / PR)

- [x] Release branch \`release/v${version}\` created from \`develop\`
- [x] \`VERSION\` bumped to \`${version}\`
- [x] \`CHANGELOG.md\` \`[Unreleased]\` rolled to \`[${version}] - ${today}\`
- [x] Release notes compiled
- [ ] CI checks green
- [ ] Approved by maintainer
`;
}

/**
 * Build release PR body for main target (second PR in develop-first flow)
 */
function buildReleasePRBodyToMain(version, developPRNumber) {
  return `## Release v${version} (Develop → Main)

This is **Phase 2** of the two-phase release flow (develop-first):

### Phase 1 ✅ Complete
- PR #${developPRNumber}: Merged release branch to \`develop\`
- VERSION and CHANGELOG updated and integrated

### Phase 2 (This PR) 🚀
- Promoting \`develop\` to \`main\` for production
- Ready for GitHub Release creation

### Release Notes

See #${developPRNumber} for full release notes and changelog.

### Checklist (Global DoD / PR)

- [x] Phase 1 (develop) PR merged: #${developPRNumber}
- [x] Develop branch contains v${version} with all changes
- [ ] CI checks green on this PR
- [ ] Approved by maintainer
- [ ] Merge to main
`;
}

/**
 * Create release PR from release branch to develop (Phase 1 of develop-first flow)
 */
function createReleasePRToDevelop(version, branch, options = {}) {
  const { dryRun = false } = options;
  const title = `chore(release): v${version}`;
  const body = buildReleasePRBodyToDevelop(version);

  if (dryRun) {
    console.log(
      `[DRY-RUN] Would create PR from ${branch} to develop with title "${title}"`,
    );
    return;
  }

  const bodyFile = path.join(os.tmpdir(), `release-pr-body-${version}.md`);
  fs.writeFileSync(bodyFile, body, "utf8");
  try {
    exec(
      `gh pr create --base develop --head ${branch} --title "${title}" --body-file "${bodyFile}"`,
      dryRun,
    );
    console.log("✓ Release PR (develop) created");
  } finally {
    if (fs.existsSync(bodyFile)) fs.unlinkSync(bodyFile);
  }
}

/**
 * Create release PR from develop to main (Phase 2 of develop-first flow)
 */
function createReleasePRToMain(version, options = {}) {
  const { dryRun = false, branch, developPRNumber } = options;
  const headBranch = branch || "develop";
  const title = `chore(release): v${version} (${headBranch} → main)`;
  const body = buildReleasePRBodyToMain(version, developPRNumber || "N/A");

  if (dryRun) {
    console.log(
      `[DRY-RUN] Would create PR from ${headBranch} to main with title "${title}"`,
    );
    return;
  }

  const bodyFile = path.join(os.tmpdir(), `release-pr-main-${version}.md`);
  fs.writeFileSync(bodyFile, body, "utf8");
  try {
    exec(
      `gh pr create --base main --head ${headBranch} --title "${title}" --body-file "${bodyFile}"`,
      dryRun,
    );
    console.log(`✓ Release PR (${headBranch} → main) created`);
    return headBranch; // Return the branch for logging purposes
  } finally {
    if (fs.existsSync(bodyFile)) fs.unlinkSync(bodyFile);
  }
}

/**
 * Create release PR (legacy, redirects to develop-first flow)
 * @deprecated Use createReleasePRToDevelop for new code
 */
function createReleasePR(version, branch, options = {}) {
  return createReleasePRToDevelop(version, branch, options);
}

/**
 * Create shell-backed release provider.
 * @returns {{name: string, preflight: Function, createTag: Function, pushChanges: Function, createReleasePR: Function, createRelease: Function}}
 */
function createShellReleaseProvider() {
  return {
    name: "shell",
    async preflight(version, options = {}) {
      const { dryRun = false } = options;
      const tagName = `v${version}`;
      const remoteTag = exec(
        `git ls-remote --tags origin refs/tags/${tagName}`,
        dryRun,
        true,
      );

      if (!dryRun && remoteTag && remoteTag.trim().length > 0) {
        throw new Error(`Remote tag ${tagName} already exists.`);
      }

      if (dryRun) {
        console.log(
          `[DRY-RUN] [SHELL] Preflight check completed for ${tagName}`,
        );
      } else {
        console.log(`✓ [SHELL] Preflight passed for ${tagName}`);
      }
    },
    createTag,
    pushChanges,
    createReleasePR,
    createReleasePRToDevelop,
    createReleasePRToMain,
    createRelease,
  };
}

/**
 * Create MCP-backed release provider using GitHub API operations.
 * @returns {{name: string, preflight: Function, createTag: Function, pushChanges: Function, createReleasePR: Function, createRelease: Function}}
 */
function createMcpReleaseProvider() {
  const getTagRefEndpoint = (owner, repo, tagName) =>
    `/repos/${owner}/${repo}/git/ref/tags/${tagName}`;
  const getReleaseByTagEndpoint = (owner, repo, tagName) =>
    `/repos/${owner}/${repo}/releases/tags/${tagName}`;
  const createTagRefEndpoint = (owner, repo) =>
    `/repos/${owner}/${repo}/git/refs`;
  const createPrEndpoint = (owner, repo) => `/repos/${owner}/${repo}/pulls`;
  const createReleaseEndpoint = (owner, repo) =>
    `/repos/${owner}/${repo}/releases`;

  return {
    name: "mcp",
    async preflight(version, options = {}) {
      const { dryRun = false } = options;
      const { owner, repo } = getRepositoryContext();
      const tagName = `v${version}`;

      const existingTag = await githubApiRequest(
        getTagRefEndpoint(owner, repo, tagName),
        {
          allowNotFound: true,
        },
      );
      if (existingTag) {
        throw new Error(
          `Remote tag ${tagName} already exists in ${owner}/${repo}.`,
        );
      }

      const existingRelease = await githubApiRequest(
        getReleaseByTagEndpoint(owner, repo, tagName),
        {
          allowNotFound: true,
        },
      );
      if (existingRelease) {
        throw new Error(
          `GitHub release ${tagName} already exists in ${owner}/${repo}.`,
        );
      }

      if (dryRun) {
        console.log(`[DRY-RUN] [MCP] Preflight passed for ${tagName}`);
      } else {
        console.log(`✓ [MCP] Preflight passed for ${tagName}`);
      }
    },
    async createTag(version, options = {}) {
      const { dryRun = false } = options;
      const { owner, repo } = getRepositoryContext();
      const tagName = `v${version}`;
      if (dryRun) {
        console.log(`[DRY-RUN] [MCP] Would create tag ref ${tagName}`);
        return;
      }

      const sha = exec("git rev-parse HEAD").trim();
      await githubApiRequest(createTagRefEndpoint(owner, repo), {
        method: "POST",
        body: {
          ref: `refs/tags/${tagName}`,
          sha,
        },
      });
      console.log(`✓ [MCP] Tag ${tagName} created`);
    },
    pushChanges(options = {}) {
      const { dryRun = false, branch = "develop" } = options;
      console.log("\n=== Pushing Changes ===");
      exec(`git push -u origin ${branch}`, dryRun);
      console.log("✓ Changes pushed");
    },
    async createReleasePR(version, branch, options = {}) {
      return this.createReleasePRToDevelop(version, branch, options);
    },
    async createReleasePRToDevelop(version, branch, options = {}) {
      const { dryRun = false } = options;
      const { owner, repo } = getRepositoryContext();
      const title = `chore(release): v${version}`;
      const body = buildReleasePRBodyToDevelop(version);

      if (dryRun) {
        console.log(
          `[DRY-RUN] [MCP] Would create release PR from ${branch} to develop for v${version}`,
        );
        return;
      }

      await githubApiRequest(createPrEndpoint(owner, repo), {
        method: "POST",
        body: {
          title,
          head: branch,
          base: "develop",
          body,
        },
      });
      console.log("✓ [MCP] Release PR (develop) created");
    },
    async createReleasePRToMain(version, options = {}) {
      const { dryRun = false, branch, developPRNumber } = options;
      const headBranch = branch || "develop";
      const { owner, repo } = getRepositoryContext();
      const title = `chore(release): v${version} (${headBranch} → main)`;
      const body = buildReleasePRBodyToMain(version, developPRNumber || "N/A");

      if (dryRun) {
        console.log(
          `[DRY-RUN] [MCP] Would create release PR from ${headBranch} to main for v${version}`,
        );
        return;
      }

      await githubApiRequest(createPrEndpoint(owner, repo), {
        method: "POST",
        body: {
          title,
          head: headBranch,
          base: "main",
          body,
        },
      });
      console.log(`✓ [MCP] Release PR (${headBranch} → main) created`);
      return headBranch;
    },
    async createRelease(version, options = {}) {
      const { dryRun = false } = options;
      const { owner, repo } = getRepositoryContext();
      const releaseNotes = formatReleaseNotes({
        version,
        changelogPath: options.changelogPath,
        notesFrom: options.notesFrom,
      });

      if (dryRun) {
        console.log(`[DRY-RUN] [MCP] Would publish release v${version}`);
        return;
      }

      await githubApiRequest(createReleaseEndpoint(owner, repo), {
        method: "POST",
        body: {
          tag_name: `v${version}`,
          target_commitish: "main",
          name: `Release v${version}`,
          body: releaseNotes,
          draft: false,
          prerelease: false,
        },
      });
      console.log(`✓ [MCP] GitHub Release v${version} created`);
    },
  };
}

/**
 * Resolve release provider from runtime config.
 * @param {string} providerName - Provider identifier
 * @returns {{name: string, preflight: Function, createTag: Function, pushChanges: Function, createReleasePR: Function, createRelease: Function}}
 */
function getReleaseProvider(providerName = "shell") {
  if (!VALID_PROVIDERS.has(providerName)) {
    throw new Error(
      `Invalid release provider "${providerName}". Use one of: ${Array.from(VALID_PROVIDERS).join(", ")}.`,
    );
  }

  if (providerName === "mcp") {
    return createMcpReleaseProvider();
  }

  return createShellReleaseProvider();
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
    const versionArg = args.find((arg) => arg.startsWith("--version="));
    const notesFromArg = args.find((arg) => arg.startsWith("--notes-from="));
    const providerArg = args.find((arg) => arg.startsWith("--provider="));
    const scope = scopeArg ? scopeArg.split("=")[1] : "patch";
    const explicitVersion = versionArg ? versionArg.split("=")[1] : "";
    const notesFrom = notesFromArg ? notesFromArg.split("=")[1] : "";
    const providerName =
      (providerArg
        ? providerArg.split("=")[1]
        : process.env.RELEASE_PROVIDER || "shell"
      )
        .toLowerCase()
        .trim() || "shell";
    const provider = getReleaseProvider(providerName);

    console.log("╔════════════════════════════════════════╗");
    console.log("║     LightSpeed Release Agent           ║");
    console.log("╚════════════════════════════════════════╝");
    console.log("");
    console.log(`Mode: ${dryRun ? "DRY-RUN" : "LIVE"}`);
    console.log(`Scope: ${scope}`);
    console.log(`Provider: ${provider.name}`);
    if (explicitVersion) {
      console.log(`Target Version: ${explicitVersion}`);
    }
    if (notesFrom) {
      console.log(`Release Notes Start: ${notesFrom}`);
    }
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
    const expectedVersion = determineNextVersion(currentVersion, scope);
    let nextVersion = expectedVersion;
    if (explicitVersion) {
      const versionResult = validateVersion(explicitVersion);
      if (!versionResult.valid) {
        throw new Error(
          `Invalid explicit version "${explicitVersion}": ${versionResult.error}`,
        );
      }
      if (compareVersions(explicitVersion, currentVersion) <= 0) {
        throw new Error(
          `Explicit version ${explicitVersion} must be greater than current version ${currentVersion}`,
        );
      }

      if (explicitVersion !== expectedVersion) {
        const forced = process.env.RELEASE_FORCE_VERSION === "1";
        if (!forced) {
          throw new Error(
            `Explicit version ${explicitVersion} does not match scope ${scope} (expected ${expectedVersion}). Set RELEASE_FORCE_VERSION=1 to override.`,
          );
        }
        console.warn(
          `⚠️  Forced version override enabled: ${expectedVersion} → ${explicitVersion}`,
        );
      }

      nextVersion = explicitVersion;
    }
    const releaseBranch = `release/v${nextVersion}`;

    console.log(`\nVersion bump: ${currentVersion} → ${nextVersion}`);
    // TODO (b): Strengthen the version bump + validation steps to lock changelog sections, dependencies, and metadata before mutating files.

    // Step 2b: Preflight remote collision checks
    await provider.preflight(nextVersion, { dryRun });

    // Step 2c: Validate release branch name before creation
    const branchValidation = validateBranchName(releaseBranch);
    if (!branchValidation.valid) {
      throw new Error(
        `Invalid release branch name "${releaseBranch}": ${branchValidation.message}. ` +
        `Check docs/BRANCHING_STRATEGY.md for valid branch naming patterns.`,
      );
    }

    // Step 2d: Create release branch
    if (!dryRun) {
      exec(`git checkout -b ${releaseBranch}`);
    } else {
      console.log(`[DRY-RUN] Would create branch ${releaseBranch}`);
    }

    // Step 3: Bump version
    bumpVersion(nextVersion, { dryRun });

    // Step 4: Update changelog
    const updatedChangelogContent = updateChangelog(nextVersion, { dryRun });

    // Step 4b: Validate post-release changelog (runs in both dry-run and live)
    if (dryRun && updatedChangelogContent) {
      try {
        // In dry-run, write to temp file and validate
        const tempPath = ".CHANGELOG.tmp";
        fs.writeFileSync(tempPath, updatedChangelogContent, "utf8");
        validatePostReleaseChangelog(tempPath, nextVersion);
        fs.unlinkSync(tempPath);
      } catch (error) {
        console.error(
          `❌ Post-release changelog validation failed: ${error.message}`,
        );
        throw error;
      }
    } else if (!dryRun) {
      try {
        validatePostReleaseChangelog("CHANGELOG.md", nextVersion);
      } catch (error) {
        console.error(
          `❌ Post-release changelog validation failed: ${error.message}`,
        );
        throw error;
      }
    }

    // Step 5: Stage all changes and run lint-staged, then commit
    if (!dryRun) {
      exec("git add VERSION CHANGELOG.md");
      exec("npx lint-staged");
      exec(`git commit -m "chore(release): bump version to ${nextVersion}"`);
    } else {
      console.log(
        `\n[DRY-RUN] Would stage VERSION and CHANGELOG.md, run lint-staged, and commit with message: "chore(release): bump version to ${nextVersion}"`,
      );
    }

    // Step 6: Create tag
    provider.createTag(nextVersion, { dryRun });

    // Step 7: Push changes
    provider.pushChanges({ dryRun, branch: releaseBranch });

    // Step 7b: Open release PR to develop (Phase 1 of stacked PR flow)
    provider.createReleasePRToDevelop(nextVersion, releaseBranch, { dryRun });

    console.log("\n");
    console.log("╔════════════════════════════════════════╗");
    console.log("║   ✅ Phase 1 completed successfully!   ║");
    console.log("╚════════════════════════════════════════╝");
    console.log(`\nVersion: ${nextVersion}`);
    console.log(`Release Branch: ${releaseBranch}`);
    console.log(
      `\nNext Step: Phase 2 (release → main) will run automatically after PR merge.`,
    );

    if (dryRun) {
      console.log("\n⚠️  This was a DRY-RUN. No changes were made.");
    }
  } catch (error) {
    console.error("\n❌ Release failed:", error.message);
    if (/release\//.test(error.message) || /version/i.test(error.message)) {
      const failedVersion =
        process.argv
          .find((arg) => arg.startsWith("--version="))
          ?.split("=")[1] || "<target-version>";
      console.error(
        `Recovery hint: node scripts/workflows/release/rollback.cjs --version=${failedVersion}`,
      );
    }
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
  validatePostReleaseChangelog,
  createTag,
  pushChanges,
  createRelease,
  determineNextVersion,
  compareVersions,
  isValidGitRef,
  detectBreakingChanges,
  generateHighlights,
  formatReleaseNotes,
  buildReleasePRBody,
  buildReleasePRBodyToDevelop,
  buildReleasePRBodyToMain,
  createReleasePR,
  createReleasePRToDevelop,
  createReleasePRToMain,
  createShellReleaseProvider,
  createMcpReleaseProvider,
  getReleaseProvider,
  githubApiRequest,
};
