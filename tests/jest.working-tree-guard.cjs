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

function status() {
  try {
    const output = execFileSync(
      "git",
      ["status", "--porcelain=v1", "-z", "--untracked-files=all"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
    return output.split("\0").filter(Boolean);
  } catch {
    return null; // Not a Git work tree.
  }
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
  if (!entries) return null;
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
  const before = globalThis[KEY];
  if (disabled() || !before) return;

  const after = snapshot();
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
