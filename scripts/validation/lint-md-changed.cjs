#!/usr/bin/env node
/* eslint-disable no-console */
// Lints only the Markdown files changed against the base ref.
//
// The repository carries a large backlog of pre-existing markdownlint
// violations in authored documentation. Linting the whole tree fails on that
// backlog and blocks every pull request, so CI lints what the pull request
// actually touches. Run `npm run lint:md` for the full-tree report.
//
// Base/head come from BASE_SHA / HEAD_SHA when CI sets them (see
// .github/workflows/checks.yml) and fall back to origin/develop...HEAD locally.

const { execFileSync, spawnSync } = require("child_process");

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function isCommit(ref) {
  if (!ref) return false;
  try {
    git(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]);
    return true;
  } catch {
    // Also covers the all-zero SHA GitHub sends as github.event.before on the
    // first push to a branch, which resolves to nothing.
    return false;
  }
}

function resolveRange() {
  const base = process.env.BASE_SHA;
  const head = process.env.HEAD_SHA;
  if (isCommit(base) && isCommit(head)) return [base, head];

  for (const ref of ["origin/develop", "origin/main", "develop", "main"]) {
    if (isCommit(ref)) return [ref, "HEAD"];
  }

  // Nothing to compare against — e.g. the first push to a new branch, where
  // github.event.before is all zeros. Fall back to the previous commit so the
  // push is still linted; a root commit has no previous commit and no baseline.
  if (isCommit("HEAD~1")) return ["HEAD~1", "HEAD"];
  return null;
}

const range = resolveRange();
if (!range) {
  // Reached only when HEAD is a root commit, so there is genuinely nothing to
  // diff. Failing here would block a legitimate first push.
  console.log(
    "No base commit to diff against — skipping markdown lint. Run npm run lint:md for the full tree.",
  );
  process.exit(0);
}

let files;
try {
  files = git(["diff", "--name-only", "--diff-filter=ACMR", `${range[0]}...${range[1]}`])
    .split("\n")
    .filter((f) => /\.mdx?$/.test(f));
} catch (err) {
  console.error(`Could not diff ${range[0]}...${range[1]}: ${err.message}`);
  process.exit(1);
}

if (files.length === 0) {
  console.log("No Markdown files changed — nothing to lint.");
  process.exit(0);
}

console.log(`Linting ${files.length} changed Markdown file(s).`);
const result = spawnSync("npx", ["markdownlint-cli2", ...files], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
