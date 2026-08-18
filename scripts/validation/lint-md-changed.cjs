#!/usr/bin/env node
/* eslint-disable no-console */
// Lints only the Markdown files changed against the base ref.
//
// The repository carries a large backlog of pre-existing markdownlint
// violations in authored documentation. Linting the whole tree fails on that
// backlog and blocks every pull request, so CI lints what the pull request
// actually touches. Run `npm run lint:md` for the full-tree report.

const { spawnSync } = require("child_process");
const { changedFiles } = require("./lib/changed-files.cjs");

const files = changedFiles((f) => /\.mdx?$/.test(f));

if (files === null) {
  // Only reached when HEAD is a root commit (see lib/changed-files.cjs) —
  // any other case resolves to a real range. Skipping silently in CI would
  // let violations through unlinted, so this must be a loud, actionable
  // failure rather than a quiet no-op that leaves the job green.
  const message = "Could not resolve a base commit to diff against.";
  if (process.env.CI) {
    console.error(`${message} Set BASE_SHA and HEAD_SHA, or check out with fetch-depth: 0.`);
    process.exit(1);
  }
  console.log(`${message} Skipping — run npm run lint:md for the full tree.`);
  process.exit(0);
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
