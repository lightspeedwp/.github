#!/usr/bin/env node
/**
 * Resolve impacted README files from git diff.
 *
 * Output format: Comma-separated list of README file paths written to GITHUB_OUTPUT.
 * This matches the format expected by GitHub Actions workflow variable interpolation
 * when passing values to shell commands via ${{ steps.readmes.outputs.files }}.
 *
 * Example output:
 *   files=README.md,.github/projects/README.md,docs/README.md
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Directories the regeneration bot must never write into.
 *
 * GitHub treats a file directly in `.github/workflows/` as a workflow
 * definition -- including a plain Markdown file such as
 * `.github/workflows/README.md` -- and refuses a push that touches one unless
 * the pushing token carries the `workflows` permission:
 *
 *   refusing to allow a GitHub App to create or update workflow
 *   '.github/workflows/README.md' without 'workflows' permission
 *
 * The App token minted in documentation.yml is deliberately least-privilege
 * (`permission-contents: write` and `permission-pull-requests: write` only), so
 * any run that regenerated that README failed at the push.
 *
 * The whole subtree is excluded, not just the top level. GitHub only reads
 * workflow files placed directly in `.github/workflows/`, so the nested
 * directories (`archived/`, `__tests__/`) are not themselves a risk; excluding
 * them costs nothing and removes the need to reason about which is which. The
 * bot is kept away from the directory outright rather than the App's
 * permissions being widened.
 */
const EXCLUDED_README_DIRS = [".github/workflows"];

/**
 * Normalise a git-reported path to a POSIX-style relative path.
 *
 * `git diff --name-only` emits forward slashes, but a path reaching this
 * function from any other caller (or a Windows-style input) may carry backslashes
 * or a leading `./`. Comparing raw strings would let `.github\workflows\x.yml`
 * slip past the exclusion, so both spellings are folded to one form first.
 */
function toPosixPath(file) {
  return file.replace(/\\/g, "/").replace(/^\.\//, "");
}

/**
 * True when `readmePath` lives inside one of the excluded directories.
 *
 * The check is on a path-segment boundary, so `.github/workflows-old/README.md`
 * is NOT excluded -- only `.github/workflows` and its descendants are.
 */
function isExcludedReadme(readmePath) {
  const posix = toPosixPath(readmePath);
  return EXCLUDED_README_DIRS.some(
    (dir) => posix === dir || posix.startsWith(`${dir}/`),
  );
}

function getChangedFiles(baseSha, headSha) {
  try {
    const output = execFileSync(
      "git",
      ["diff", "--name-only", baseSha, headSha],
      {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    );
    return output
      .trim()
      .split("\n")
      .filter((f) => f.length > 0);
  } catch {
    return [];
  }
}

function resolveReadmeFiles(changedFiles) {
  const readmes = new Set();
  let hasSubdirChanges = false;

  changedFiles.forEach((file) => {
    const dir = path.dirname(toPosixPath(file));

    // Check for README.md in the changed file's directory
    const readmeInDir = path.join(dir, "README.md");
    if (fs.existsSync(readmeInDir) && !isExcludedReadme(readmeInDir)) {
      readmes.add(readmeInDir);
    }

    // Track if changes are in subdirectories (not root)
    if (dir !== ".") {
      hasSubdirChanges = true;
    }
  });

  // Only add root README if files in subdirectories changed AND root README exists
  if (hasSubdirChanges && fs.existsSync("README.md")) {
    readmes.add("README.md");
  }

  return Array.from(readmes).sort();
}

function main() {
  const eventName = process.env.EVENT_NAME;
  let baseSha;
  let headSha = process.env.PUSH_SHA || process.env.PR_HEAD;

  // Determine base SHA based on event type
  if (eventName === "pull_request") {
    baseSha = process.env.PR_BASE;
  } else if (eventName === "push") {
    baseSha = process.env.PUSH_BEFORE;
  } else {
    baseSha = "HEAD~1";
  }

  // Get changed files
  const changedFiles = getChangedFiles(baseSha, headSha);

  // Resolve README files
  const readmes = resolveReadmeFiles(changedFiles);

  // Output to GITHUB_OUTPUT
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile && fs.existsSync(path.dirname(outputFile))) {
    const files = readmes.join(",");
    fs.appendFileSync(outputFile, `files=${files}\n`);
  }
}

module.exports = { getChangedFiles, resolveReadmeFiles, main };

if (require.main === module) {
  main();
}
