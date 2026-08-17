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

function resolveRange() {
  const base = process.env.BASE_SHA;
  const head = process.env.HEAD_SHA;
  if (base && head) return [base, head];

  for (const ref of ["origin/develop", "origin/main", "develop", "main"]) {
    try {
      git(["rev-parse", "--verify", `${ref}^{commit}`]);
      return [ref, "HEAD"];
    } catch {
      // try the next candidate
    }
  }
  return null;
}

const range = resolveRange();
if (!range) {
  const message = "No base ref available to diff against.";
  if (process.env.CI) {
    // Skipping silently in CI would let violations through unlinted.
    console.error(`${message} Set BASE_SHA and HEAD_SHA, or check out with fetch-depth: 0.`);
    process.exit(1);
  }
  console.log(`${message} Skipping markdown lint — run npm run lint:md for the full tree.`);
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
