#!/usr/bin/env node
/**
 * Handle meta-agent PR creation and auto-merge
 * Safely replaces multiline shell logic with Node.js
 */

import { execSync } from "child_process";

function runCommand(cmd, options = {}) {
  try {
    return execSync(cmd, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      ...options,
    }).trim();
  } catch (error) {
    if (options.ignoreErrors) {
      return null;
    }
    throw error;
  }
}

// Configure git
runCommand('git config user.name "lightspeed-bot"');
runCommand('git config user.email "ops@lightspeedwp.agency"');
runCommand("git add -A");

// Check if there are changes
const hasChanges = !runCommand("git diff --cached --quiet", {
  ignoreErrors: true,
});

if (!hasChanges) {
  console.log("No content or metrics changes to apply.");
  process.exit(0);
}

const branch = "chore/meta-agent-sync";

// Checkout or create branch
try {
  runCommand(`git checkout -b "${branch}"`);
} catch {
  runCommand(`git checkout "${branch}"`);
}

// Commit changes
runCommand(
  'git commit -m "chore(meta): apply frontmatter/badges/references/footer + metrics snapshot"',
);

// Push to remote
runCommand(`git push origin "${branch}" --force`);

// Create PR body
const prBody = [
  "## Linked issues",
  "",
  "Relates to #1070",
  "",
  "## Summary",
  "",
  "Automated meta-agent run: applies frontmatter/badge/footer metadata and refreshes the metrics snapshot. Content-only, no functional code changes.",
  "",
  "## Changelog",
  "",
  "No changelog entry - internal automation metadata only (see the meta:no-changelog label).",
  "",
  "### Checklist (Global DoD / PR)",
  "",
  "- [x] Automated content-only change - no functional code modified",
  "- [x] CI must pass before auto-merge completes",
].join("\n");

// Check for existing PR
const existingPr = runCommand(
  `gh pr list --base develop --head "${branch}" --state open --json url --jq '.[0].url'`,
  { ignoreErrors: true },
);

let prUrl;
if (existingPr) {
  console.log(`Updating existing PR: ${existingPr}`);
  prUrl = existingPr;
} else {
  prUrl = runCommand(`gh pr create \
    --base develop \
    --head "${branch}" \
    --title "chore(meta): automated meta-agent sync" \
    --label "meta:no-changelog" \
    --body ${JSON.stringify(prBody)}`);
  console.log(`Created new PR: ${prUrl}`);
}

// Enable auto-merge
runCommand(
  `gh pr merge --auto --squash \
    --subject "chore(meta): apply frontmatter/badges/references/footer + metrics snapshot [skip ci]" \
    "${prUrl}"`,
  { ignoreErrors: true },
);

console.log("Meta-agent PR operation completed successfully.");
