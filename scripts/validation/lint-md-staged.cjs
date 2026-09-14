#!/usr/bin/env node
/* eslint-disable no-console */
// Lints staged Markdown files, but only fails the commit on violations that
// fall on lines the commit actually touches.
//
// lint-staged passes whole files to markdownlint-cli2, which lints full file
// content. scripts/validation/lint-md-changed.cjs already documents why CI
// can't do that: "the repository carries a large backlog of pre-existing
// markdownlint violations in authored documentation. Linting the whole tree
// fails on that backlog and blocks every pull request." CI works around it by
// linting only changed files; this script applies the same principle at
// line granularity, since a single touched file can mix new content with
// untouched legacy violations elsewhere in the same file.
//
// Flow per file:
//   1. Auto-fix what markdownlint-cli2 can fix in place (as before).
//   2. Diff the (now fixed) working copy against HEAD to find added/changed
//      line numbers.
//   3. Re-lint with the markdownlint library directly to get violations with
//      line numbers.
//   4. Only fail if a remaining violation lands on an added/changed line.
//      Pre-existing violations on untouched lines are reported but do not
//      block the commit — matching the changed-files CI policy.

const { spawnSync, execFileSync } = require("child_process");
const path = require("path");

const files = process.argv.slice(2);

if (files.length === 0) {
  console.log("No staged Markdown files to lint.");
  process.exit(0);
}

const fixResult = spawnSync("npx", ["markdownlint-cli2", "--fix", ...files], {
  stdio: "inherit",
});
if (fixResult.error) {
  console.error(`Failed to run markdownlint-cli2 --fix: ${fixResult.error.message}`);
  process.exit(1);
}

function addedLineNumbers(file) {
  let diff;
  try {
    diff = execFileSync(
      "git",
      ["diff", "--unified=0", "--no-color", "HEAD", "--", file],
      { encoding: "utf8" },
    );
  } catch {
    // No HEAD yet (root commit) — treat every line as added so nothing is
    // silently skipped.
    return null;
  }

  if (!diff) return new Set();

  const added = new Set();
  let currentNewLine = null;
  for (const line of diff.split("\n")) {
    const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
    if (hunk) {
      currentNewLine = parseInt(hunk[1], 10);
      continue;
    }
    if (currentNewLine === null) continue;
    if (line.startsWith("\\")) {
      // "\ No newline at end of file" — diff metadata, not a content line.
      continue;
    }
    if (line.startsWith("+") && !line.startsWith("+++")) {
      added.add(currentNewLine);
      currentNewLine += 1;
    } else if (!line.startsWith("-") && !line.startsWith("---")) {
      currentNewLine += 1;
    }
  }
  return added;
}

async function lintFile(file) {
  const { lint } = await import("markdownlint/promise");
  const configPath = path.join(__dirname, "../../.markdownlint.config.cjs");
  // eslint-disable-next-line global-require
  const baseConfig = require(configPath) || {};
  const result = await lint({
    files: [file],
    config: { default: true, ...(baseConfig.rules || {}) },
  });
  return result[file] || [];
}

async function main() {
  let blocking = false;

  for (const file of files) {
    const added = addedLineNumbers(file);
    const violations = await lintFile(file);

    for (const violation of violations) {
      const onAddedLine = added === null || added.has(violation.lineNumber);
      const label = onAddedLine ? "❌" : "⚠️ pre-existing (not blocking)";
      console.log(
        `${label} ${file}:${violation.lineNumber} ${violation.ruleNames[0]} ${violation.ruleDescription}`,
      );
      if (onAddedLine) blocking = true;
    }
  }

  if (blocking) {
    console.error(
      "\nMarkdown lint violations on changed lines must be fixed before committing.",
    );
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
