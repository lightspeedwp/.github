/**
 * Jest globalSetup/globalTeardown: fail the run if tests change the Git
 * working tree (#3498).
 *
 * Tests must write to a temporary directory (os.tmpdir()), never into the
 * repository: stray files get committed by accident and dirty worktrees and
 * CI checkouts. The guard compares `git status --porcelain` before and after
 * the run and fails on any entry that appeared or changed.
 *
 * Skipped outside a Git work tree. Set ALLOW_TEST_ARTEFACTS=1 to bypass,
 * e.g. when deliberately regenerating reports with GENERATE_REPORTS=true.
 */
const { execFileSync } = require("node:child_process");

const KEY = "__workingTreeGuardBefore";
const NOT_A_WORK_TREE = "not-a-work-tree";

/**
 * Status entries as `XY path`. With -z, a rename or copy (X or Y is R/C) is
 * followed by a separate field holding the original path, which is skipped.
 */
function status() {
  let output;
  try {
    output = execFileSync(
      "git",
      ["status", "--porcelain=v1", "-z", "--untracked-files=all"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
  } catch {
    return null; // Not a Git work tree.
  }

  const fields = output.split("\0");
  const entries = [];
  for (let i = 0; i < fields.length; i += 1) {
    const entry = fields[i];
    if (!entry) continue;
    entries.push(entry);
    if (/[RC]/.test(entry.slice(0, 2))) i += 1;
  }
  return entries;
}

function hashOf(entry) {
  const file = entry.slice(3);
  try {
    return execFileSync("git", ["hash-object", "--", file], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "missing";
  }
}

function snapshot() {
  const entries = status();
  if (!entries) return NOT_A_WORK_TREE;
  return new Map(entries.map((entry) => [entry, hashOf(entry)]));
}

function disabled() {
  return process.env.ALLOW_TEST_ARTEFACTS === "1";
}

async function setup() {
  if (disabled()) return;
  globalThis[KEY] = snapshot();
}

async function teardown() {
  if (disabled()) return;
  const before = globalThis[KEY];
  if (before === NOT_A_WORK_TREE) return;
  if (!(before instanceof Map)) {
    // Setup did not record a snapshot, so the guard cannot check this run.
    console.warn(
      "⚠️  Working tree guard did not run: no snapshot from globalSetup (#3498).",
    );
    return;
  }

  const after = snapshot();
  if (!(after instanceof Map)) return;
  const changed = [...after]
    .filter(([entry, hash]) => before.get(entry) !== hash)
    .map(([entry]) => entry);

  if (changed.length) {
    throw new Error(
      [
        "Tests changed the working tree; write test output to os.tmpdir() instead (#3498):",
        ...changed.map((entry) => `  ${entry}`),
        "Set ALLOW_TEST_ARTEFACTS=1 to bypass when regenerating reports on purpose.",
      ].join("\n"),
    );
  }
}

module.exports = { setup, teardown };
