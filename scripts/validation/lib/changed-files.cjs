// Shared "what changed against the base ref" resolution for changed-files-only
// validators (see lint-md-changed.cjs, validate-workflow-npm-scripts.cjs).
//
// BASE_SHA / HEAD_SHA are set by CI (see .github/workflows/checks.yml). When
// they're absent or unresolvable, fall back to the previous commit rather
// than a branch ref: after a push-triggered checkout, origin/<branch> already
// points at HEAD, so diffing against it silently reports no changes even when
// real changes shipped. The branch-ref fallback below exists for local/manual
// use only, and is skipped whenever it would resolve to HEAD for that reason.

const { execFileSync } = require("child_process");

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function commitSha(ref) {
  if (!ref) return null;
  try {
    return git(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]);
  } catch {
    // Also covers the all-zero SHA GitHub sends as github.event.before on the
    // first push to a branch, which resolves to nothing.
    return null;
  }
}

function resolveRange() {
  const baseSha = commitSha(process.env.BASE_SHA);
  const headSha = commitSha(process.env.HEAD_SHA);
  if (baseSha && headSha) return [baseSha, headSha];

  const prevCommit = commitSha("HEAD~1");
  if (prevCommit) return [prevCommit, "HEAD"];

  const headCommit = commitSha("HEAD");
  for (const ref of ["origin/develop", "origin/main", "develop", "main"]) {
    const sha = commitSha(ref);
    if (sha && sha !== headCommit) return [sha, "HEAD"];
  }

  // Root commit: no previous state exists to compare against.
  return null;
}

function changedFiles(filterFn) {
  const range = resolveRange();
  if (!range) return null;
  const files = git(["diff", "--name-only", "--diff-filter=ACMR", `${range[0]}...${range[1]}`])
    .split("\n")
    .filter(Boolean);
  return filterFn ? files.filter(filterFn) : files;
}

module.exports = { resolveRange, changedFiles };
