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
//   1. Skip files matched by ignorePaths as a cheap pre-filter (cli2 applies
//      its own, fully-resolved ignore/config rules regardless — see below —
//      so an under-filter here just costs an extra invocation, never
//      correctness).
//   2. Record which lines are staged/added, by diffing the index against
//      HEAD — not the working tree, which can carry unstaged edits too.
//   3. Snapshot three states: the index, the pre-fix working tree (index
//      content plus any unstaged edits already on disk), and — after
//      --fix runs — the post-fix working tree. Map the staged-added lines
//      forward through each transition in turn (index -> pre-fix working
//      tree, then pre-fix -> post-fix working tree) rather than diffing
//      index straight to post-fix, so a shift caused by an unstaged edit
//      is never misattributed to the fix (or vice versa) — two adjacent
//      single-line changes, one staged and one not, can otherwise land in
//      the same diff hunk.
//   4. Parse the remaining violations straight out of that same --fix run's
//      own output, rather than re-deriving "the config" and re-linting with
//      the markdownlint library directly. This repo carries three
//      overlapping markdownlint config files (.markdownlint.config.cjs,
//      .markdownlint-cli2.cjs, .markdownlint.jsonc — the last of which cli2
//      also auto-discovers and merges in, per-directory, on top of the
//      cli2-level config); reconstructing "the effective config" by hand
//      reliably drifted from what --fix itself actually applied (e.g. an
//      allowed_elements list for MD033 that disagreed with the live one).
//      Asking cli2 to report on the very file it just fixed sidesteps that
//      entirely — there is exactly one source of truth for what still
//      violates the repo's real, resolved rules.
//   5. Only fail if a remaining violation lands on a mapped added/changed
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

// Resolve the locally-installed markdownlint-cli2 binary directly instead of
// shelling out via "npx". On Windows, spawnSync("npx", ...) fails with
// ENOENT: npx is a .cmd shim, and spawnSync does not resolve .cmd/.bat PATH
// shims without shell: true. Reading package.json's own "bin" field and
// invoking that script with process.execPath sidesteps the shim entirely --
// deterministic (the exact locally-installed version, no npm registry
// resolution), and needs no shell layer on any platform.
//
// require.resolve("markdownlint-cli2/package.json") is deliberately not
// used here: the package's "exports" field doesn't list that subpath, so
// Node's resolver rejects it (ERR_PACKAGE_PATH_NOT_EXPORTED) even though
// the file exists on disk. Resolving the main entry point instead and
// reading package.json from its directory via fs sidesteps that
// restriction -- it's a plain file read, not a module import, so "exports"
// doesn't apply.
const markdownlintCli2Dir = path.dirname(require.resolve("markdownlint-cli2"));
const markdownlintCli2Pkg = JSON.parse(
  fs.readFileSync(path.join(markdownlintCli2Dir, "package.json"), "utf8"),
);
const markdownlintCli2Bin = path.join(markdownlintCli2Dir, markdownlintCli2Pkg.bin["markdownlint-cli2"]);

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

// Computes the diff hunks between two in-memory content strings, via a pair
// of throwaway temp files. Returns [] when they're identical.
function hunksBetween(oldContent, newContent, baseName) {
  if (oldContent === newContent) return [];
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "lint-md-staged-"));
  const oldFile = path.join(tmpDir, `old-${baseName}`);
  const newFile = path.join(tmpDir, `new-${baseName}`);
  fs.writeFileSync(oldFile, oldContent);
  fs.writeFileSync(newFile, newContent);
  try {
    const diffProc = spawnSync(
      "git",
      ["diff", "--no-index", "--unified=0", "--no-color", oldFile, newFile],
      { encoding: "utf8" },
    );
    if (diffProc.error) {
      throw new Error(`Failed to compute diff: ${diffProc.error.message}`);
    }
    // git diff --no-index: 0 = identical, 1 = differences found (the normal,
    // expected case here). Anything else is a real failure — signal or a
    // status of 2+ — and parsing its output would be incorrect/partial.
    if (diffProc.signal || (diffProc.status !== 0 && diffProc.status !== 1)) {
      throw new Error(
        `git diff --no-index failed: ${diffProc.stderr || `status ${diffProc.status}`}`,
      );
    }
    return parseHunks(diffProc.stdout || "");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// markdownlint-cli2's pretty formatter reports each remaining (unfixable, or
// not-yet-fixed) violation on stderr as e.g.:
//   docs/scratch-test/sample.md:7 MD001/heading-increment Heading levels ...
//   docs/scratch-test/probe4.md:5:1 MD033/no-inline-html Inline HTML ...
// Path is relative to cwd (repoRoot, since --fix runs with cwd: repoRoot).
const VIOLATION_LINE = /^(.+?):(\d+)(?::\d+)? (MD\d+)\/(\S+) (.+)$/;

// Groups cli2's own reported violations by file, keyed the same way `files`
// is (repo-root-relative). This is the actual, fully-resolved rule set —
// see the flow comment above for why that can't be safely reconstructed by
// hand.
function parseViolations(stderrText) {
  const byFile = new Map();
  for (const line of stderrText.split("\n")) {
    const m = line.match(VIOLATION_LINE);
    if (!m) continue;
    const [, file, lineNumber, ruleId, ruleName, description] = m;
    if (!byFile.has(file)) byFile.set(file, []);
    byFile.get(file).push({
      lineNumber: parseInt(lineNumber, 10),
      ruleId,
      ruleName,
      description,
    });
  }
  return byFile;
}

async function main() {
  if (files.length === 0) {
    console.log("No staged Markdown files to lint.");
    return;
  }

  let blocking = false;

  // Snapshot three states before --fix mutates the working tree:
  //   - the index (what will actually be committed)
  //   - the pre-fix working tree (index content plus any unstaged edits
  //     sitting alongside it on disk — a normal `git add -p` outcome)
  //   - (after --fix runs, below) the post-fix working tree
  // Reconciling all three, rather than diffing index straight to post-fix,
  // keeps unstaged edits from being misattributed as part of the fix: two
  // adjacent single-line changes — one staged, one not — can land in the
  // same diff hunk, and treating that hunk as "the fix" would pull the
  // unstaged line into the blocking set.
  const preFixState = new Map();
  for (const file of files) {
    preFixState.set(file, {
      indexContent: indexContent(file),
      preFixWorkingContent: fs.readFileSync(absPath(file), "utf8"),
      headDiff: diffAgainstHead(file),
    });
  }

  const fixResult = spawnSync(process.execPath, [markdownlintCli2Bin, "--fix", ...files], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  // Mirror what stdio: "inherit" used to show, now that output is captured
  // for parsing rather than streamed directly.
  if (fixResult.stdout) process.stdout.write(fixResult.stdout);
  if (fixResult.stderr) process.stderr.write(fixResult.stderr);
  if (fixResult.error) {
    console.error(
      `Failed to run markdownlint-cli2 --fix: ${fixResult.error.message}`,
    );
    process.exitCode = 1;
    return;
  }
  // Exit 0 = clean, 1 = violations remain after fixing — both are normal,
  // expected outcomes we still need to line-scope below. Anything else
  // (config load failure, crash, signal) means --fix didn't run as intended.
  if (fixResult.status !== 0 && fixResult.status !== 1) {
    console.error(
      `markdownlint-cli2 --fix exited with unexpected status ${fixResult.status}`,
    );
    process.exitCode = 1;
    return;
  }

  const violationsByFile = parseViolations(
    (fixResult.stderr || "") + (fixResult.stdout || ""),
  );

  for (const file of files) {
    const {
      indexContent: idxContent,
      preFixWorkingContent,
      headDiff,
    } = preFixState.get(file);
    let added;
    if (headDiff === null) {
      added = null; // no HEAD yet — treat everything as added.
    } else {
      const preFixAdded = headDiff ? addedLinesFromDiff(headDiff) : new Set();

      if (preFixAdded.size === 0) {
        added = preFixAdded;
      } else {
        const baseName = path.basename(file);

        // Stage 1: index -> pre-fix working tree. Any shift here is
        // attributed to unstaged edits, not to the fix.
        const throughUnstaged = mapLinesForward(
          preFixAdded,
          hunksBetween(idxContent, preFixWorkingContent, baseName),
        );

        // Stage 2: pre-fix working tree -> post-fix working tree. This is
        // purely the fix's own changes now, since both sides already
        // include the same unstaged edits.
        const postFixContent = fs.readFileSync(absPath(file), "utf8");
        added = mapLinesForward(
          throughUnstaged,
          hunksBetween(preFixWorkingContent, postFixContent, baseName),
        );
      }
    }

    const violations = violationsByFile.get(file) || [];

    for (const violation of violations) {
      const onAddedLine = added === null || added.has(violation.lineNumber);
      const label = onAddedLine ? "❌" : "⚠️ pre-existing (not blocking)";
      console.log(
        `${label} ${file}:${violation.lineNumber} ${violation.ruleId} ${violation.description}`,
      );
      if (onAddedLine) blocking = true;
    }
  }

  if (blocking) {
    console.error(
      "\nMarkdown lint violations on changed lines must be fixed before committing.",
    );
    process.exitCode = 1;
    return;
  }

  process.exitCode = 0;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
