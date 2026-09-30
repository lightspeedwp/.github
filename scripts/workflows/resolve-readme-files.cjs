#!/usr/bin/env node
/**
 * Resolve impacted README files from git diff.
 *
 * Output format: Comma-separated list of README file paths written to GITHUB_OUTPUT.
 * This matches the format expected by GitHub Actions workflow variable interpolation
 * when passing values to shell commands via ${{ steps.readmes.outputs.files }}.
 *
 * Example output (sorted, so '.' sorts before letters):
 *   files=.github/projects/README.md,README.md,docs/README.md
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
 *
 * Folds every backslash to a forward slash and strips a single leading `./`.
 * It does not collapse `..` or strip drive letters: nothing that can reach it
 * from `getChangedFiles` contains either, and inventing normalisation beyond
 * that would be a behaviour change rather than a portability fix.
 *
 * @param {string} file Path as reported, with any platform's separators.
 * @returns {string} The same path spelled with forward slashes and no leading `./`.
 */
function toPosixPath(file) {
  return file.replace(/\\/g, "/").replace(/^\.\//, "");
}

/**
 * True when `readmePath` lives inside one of the excluded directories.
 *
 * The check is on a path-segment boundary, so `.github/workflows-old/README.md`
 * is NOT excluded -- only `.github/workflows` and its descendants are. The
 * value is normalised first, so a backslash spelling is judged identically to
 * a forward-slash one.
 *
 * @param {string} readmePath Candidate README path, in any platform's spelling.
 * @returns {boolean} True when the path is one of the {@link EXCLUDED_README_DIRS}
 *   entries or sits inside one of them.
 */
function isExcludedReadme(readmePath) {
  const posix = toPosixPath(readmePath);
  return EXCLUDED_README_DIRS.some(
    (dir) => posix === dir || posix.startsWith(`${dir}/`),
  );
}

/**
 * List the files that differ between two commits.
 *
 * `execFileSync` is used rather than a shell so no path is ever interpreted as
 * a command. A git failure (an unresolvable range, a missing object on a shallow
 * clone) resolves to an empty list rather than throwing: an empty list makes the
 * caller emit no README files, which the workflow already treats as "nothing to
 * do", whereas propagating the error would fail the whole regeneration job.
 *
 * @param {string} baseSha Commit to compare from.
 * @param {string} headSha Commit to compare to.
 * @returns {string[]} Repository-relative paths, in the order git reported them; empty on failure.
 */
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

/**
 * Pick the README files a change set makes worth regenerating.
 *
 * A changed file nominates the `README.md` sitting beside it, because that is
 * the file whose index, badges and footer can go stale when the directory
 * changes. The root `README.md` is added when anything below it changed, since
 * it indexes the tree.
 *
 * Two invariants matter to the caller:
 *
 * - **Nothing under `.github/workflows/` is ever returned.** See
 *   {@link EXCLUDED_README_DIRS} for why; briefly, the App token that pushes
 *   the regeneration branch has no `workflows` permission, so a README there
 *   cannot be committed at all.
 * - **Every returned path is POSIX.** The result is compared against, and
 *   consumed alongside, the forward-slash paths git reports, and it is written
 *   to `GITHUB_OUTPUT` for `meta.agent.js`; a backslash would be the one place
 *   the output disagreed with its own input. On POSIX the normalisation is a
 *   no-op.
 *
 * Existence is checked on the filesystem rather than assumed, so a directory
 * with no README contributes nothing.
 *
 * @param {string[]} changedFiles Repository-relative paths that changed.
 * @returns {string[]} Deduplicated, lexicographically sorted, forward-slash
 *   README paths that exist and are not under an excluded directory.
 */
function resolveReadmeFiles(changedFiles) {
  const readmes = new Set();
  let hasSubdirChanges = false;

  changedFiles.forEach((file) => {
    const dir = path.dirname(toPosixPath(file));

    // Check for README.md in the changed file's directory
    const readmeInDir = path.join(dir, "README.md");
    if (fs.existsSync(readmeInDir) && !isExcludedReadme(readmeInDir)) {
      // Emit the POSIX spelling even when `path.join` produced backslashes. The
      // probe above deliberately keeps the joined form, because that is the
      // path the filesystem understands on the host running this.
      readmes.add(toPosixPath(readmeInDir));
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

/**
 * Resolve the impacted READMEs for the current event and write them to the
 * step output.
 *
 * The base commit depends on the trigger: a pull request uses `PR_BASE`, a push
 * uses the event's `before`, and anything else falls back to `HEAD~1`. The head
 * is `PUSH_SHA` when set, else `PR_HEAD`. Note that `documentation.yml` exports
 * `PUSH_SHA` as `${{ github.sha }}` unconditionally, so on a pull_request it is
 * already the merge commit's SHA and `PR_HEAD` is not consulted. The chosen
 * range is handed to {@link getChangedFiles} and the result to
 * {@link resolveReadmeFiles}.
 *
 * Output is appended to `$GITHUB_OUTPUT` as `files=a,b,c`, which is the format
 * `documentation.yml` interpolates into `meta.agent.js --files`. Writing is
 * skipped when `GITHUB_OUTPUT` is unset or its directory does not exist, so the
 * module can be imported for its exports without writing a step output file.
 *
 * @returns {void} Nothing; the resolved list is written to `$GITHUB_OUTPUT`.
 */
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
