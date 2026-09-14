#!/usr/bin/env node

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
//   1. Skip files matched by the same ignorePaths the CLI2 config applies,
//      since the markdownlint library API (used below for line numbers)
//      does not honour them itself.
//   2. Record which lines are added/changed *before* auto-fixing, by diffing
//      the pre-fix content against HEAD.
//   3. Auto-fix what markdownlint-cli2 can fix in place (as before).
//   4. Map the pre-fix added-line numbers onto the post-fix file by diffing
//      pre-fix content against post-fix content. A fix that only reformats
//      an already-added line still resolves to "added"; a fix that touches
//      an untouched legacy line is never seeded into this set, so it can't
//      leak in as a false "added" line.
//   5. Re-lint the post-fix file with the markdownlint library directly to
//      get violations with line numbers.
//   6. Only fail if a remaining violation lands on a mapped added/changed
//      line. Pre-existing violations on untouched lines are reported but do
//      not block the commit — matching the changed-files CI policy.

const { spawnSync, execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { minimatch } = require("minimatch");

const configPath = path.join(__dirname, "../../.markdownlint.config.cjs");

const baseConfig = require(configPath) || {};
const ignorePaths = baseConfig.ignorePaths || [];

// Resolve once, and run every git/fs operation against it — lint-staged (and
// a developer running it manually) may invoke this from any cwd, but
// ignorePaths and the repo's other tooling all assume repo-root-relative
// paths.
const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();

function isIgnored(file) {
  return ignorePaths.some((pattern) => minimatch(file, pattern, { dot: true }));
}

const files = process.argv
  .slice(2)
  .map((file) => path.relative(repoRoot, path.resolve(process.cwd(), file)))
  .filter((file) => {
    if (isIgnored(file)) {
      console.log(`⏭️  Skipped (ignored): ${file}`);
      return false;
    }
    return true;
  });

if (files.length === 0) {
  console.log("No staged Markdown files to lint.");
  process.exit(0);
}

function absPath(file) {
  return path.join(repoRoot, file);
}

// Parses a unified diff into hunks of { oldStart, oldCount, newStart, newCount }.
function parseHunks(diffText) {
  const hunks = [];
  for (const line of diffText.split("\n")) {
    const m = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    if (m) {
      hunks.push({
        oldStart: parseInt(m[1], 10),
        oldCount: m[2] === undefined ? 1 : parseInt(m[2], 10),
        newStart: parseInt(m[3], 10),
        newCount: m[4] === undefined ? 1 : parseInt(m[4], 10),
      });
    }
  }
  return hunks;
}

// Given a unified diff (old -> new), returns the set of new-side line
// numbers introduced or modified by it.
function addedLinesFromDiff(diffText) {
  const added = new Set();
  let currentNewLine = null;
  for (const line of diffText.split("\n")) {
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
    // The "+++ b/file" / "--- a/file" header lines occur only before the
    // first "@@" hunk marker, already excluded by the currentNewLine === null
    // check above — so a content line here that happens to start with "++"
    // or "--" (its own text, prefixed by the diff's own +/-) is genuine
    // content, not a header, and must not be special-cased away.
    if (line.startsWith("+")) {
      added.add(currentNewLine);
      currentNewLine += 1;
    } else if (!line.startsWith("-")) {
      currentNewLine += 1;
    }
  }
  return added;
}

function diffAgainstHead(file) {
  try {
    // --cached: compare the index (what will actually be committed) against
    // HEAD, not the working tree. A file can carry unstaged edits alongside
    // staged ones (partial `git add -p` commits); those unstaged lines are
    // not part of this commit and must not count as "added".
    return execFileSync(
      "git",
      ["diff", "--cached", "--unified=0", "--no-color", "HEAD", "--", file],
      { encoding: "utf8", cwd: repoRoot },
    );
  } catch {
    // No HEAD yet (root commit).
    return null;
  }
}

// Reads the file's staged (index) content — what --cached diffed against
// HEAD — rather than the working tree, which can carry additional unstaged
// edits that would otherwise shift line numbers out from under that diff.
function indexContent(file) {
  try {
    return execFileSync("git", ["show", `:${file}`], {
      encoding: "utf8",
      cwd: repoRoot,
    });
  } catch {
    // Not in the index yet (e.g. no HEAD/root commit) — fall back to disk.
    return fs.readFileSync(absPath(file), "utf8");
  }
}

// Maps a set of old-side line numbers onto their new-side equivalents using
// diff hunks between the old and new content. A line inside a hunk's old
// range has no 1:1 mapping (the fix rewrote that exact line) — in that case
// the whole corresponding new range is included instead, since the fix
// touched content the caller already identified as added.
function mapLinesForward(oldLines, hunks) {
  const mapped = new Set();
  for (const oldLine of oldLines) {
    let shift = 0;
    let mappedInsideHunk = false;
    for (const h of hunks) {
      if (h.oldCount === 0) {
        // Pure insertion after old line h.oldStart (e.g. "@@ -5,0 +6,2 @@").
        // h.oldStart itself is untouched old content and must not receive
        // this hunk's shift; only lines strictly after it do.
        if (oldLine <= h.oldStart) break;
        shift += h.newCount;
        continue;
      }
      if (oldLine < h.oldStart) break;
      const oldEnd = h.oldStart + h.oldCount;
      if (oldLine < oldEnd) {
        for (let n = h.newStart; n < h.newStart + h.newCount; n += 1) {
          mapped.add(n);
        }
        mappedInsideHunk = true;
        break;
      }
      shift += h.newCount - h.oldCount;
    }
    if (!mappedInsideHunk) mapped.add(oldLine + shift);
  }
  return mapped;
}

async function lintFile(file) {
  const { lint } = await import("markdownlint/promise");
  const result = await lint({
    files: [absPath(file)],
    config: { default: true, ...(baseConfig.rules || {}) },
  });
  return result[absPath(file)] || [];
}

async function main() {
  let blocking = false;

  // Snapshot the staged (index) content and the HEAD diff *before* --fix
  // mutates the working tree — this is the source of truth for what the
  // commit actually touches, independent of any unstaged edits sitting
  // alongside it on disk.
  const preFixState = new Map();
  for (const file of files) {
    preFixState.set(file, {
      content: indexContent(file),
      headDiff: diffAgainstHead(file),
    });
  }

  const fixResult = spawnSync("npx", ["markdownlint-cli2", "--fix", ...files], {
    stdio: "inherit",
    cwd: repoRoot,
  });
  if (fixResult.error) {
    console.error(
      `Failed to run markdownlint-cli2 --fix: ${fixResult.error.message}`,
    );
    process.exit(1);
  }
  // Exit 0 = clean, 1 = violations remain after fixing — both are normal,
  // expected outcomes we still need to line-scope below. Anything else
  // (config load failure, crash, signal) means --fix didn't run as intended.
  if (fixResult.status !== 0 && fixResult.status !== 1) {
    console.error(
      `markdownlint-cli2 --fix exited with unexpected status ${fixResult.status}`,
    );
    process.exit(1);
  }

  for (const file of files) {
    const { content: preFixContent, headDiff } = preFixState.get(file);
    let added;
    if (headDiff === null) {
      added = null; // no HEAD yet — treat everything as added.
    } else {
      const preFixAdded = headDiff ? addedLinesFromDiff(headDiff) : new Set();
      const postFixContent = fs.readFileSync(absPath(file), "utf8");

      if (preFixAdded.size === 0 || postFixContent === preFixContent) {
        added = preFixAdded;
      } else {
        const tmpDir = fs.mkdtempSync(
          path.join(os.tmpdir(), "lint-md-staged-"),
        );
        const tmpFile = path.join(tmpDir, path.basename(file));
        fs.writeFileSync(tmpFile, preFixContent);
        let fixDiffText;
        try {
          const diffProc = spawnSync(
            "git",
            [
              "diff",
              "--no-index",
              "--unified=0",
              "--no-color",
              tmpFile,
              absPath(file),
            ],
            { encoding: "utf8" },
          );
          if (diffProc.error) {
            console.error(
              `Failed to compute fix diff for ${file}: ${diffProc.error.message}`,
            );
            process.exit(1);
          }
          fixDiffText = diffProc.stdout || "";
        } finally {
          fs.rmSync(tmpDir, { recursive: true, force: true });
        }
        const fixHunks = parseHunks(fixDiffText);
        added = mapLinesForward(preFixAdded, fixHunks);
      }
    }

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
