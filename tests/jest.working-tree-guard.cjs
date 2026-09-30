/**
 * Jest globalSetup/globalTeardown: fail the run if tests change the Git
 * working tree (#3498).
 *
 * Tests must write to a temporary directory (os.tmpdir()), never into the
 * repository: stray files get committed by accident and dirty worktrees and
 * CI checkouts. The guard compares `git status --porcelain` before and after
 * the run and fails on any entry that appeared or changed.
 *
 * Coverage boundary: the guard only runs for Jest invocations that load
 * `.jest.config.cjs`, which is the root configuration. The package-local `test`
 * scripts that invoke a bare `jest` -- packages/metadata-agent,
 * skills/audit-label-coverage, agents/wordpress-release-utilities-agent,
 * agents/changelog-agent, agents/pr-agent and agents/meta-agent -- and the
 * separate jest.config.js files do not load it, so a test run through one of
 * those paths is unguarded. All six were checked and none currently dirties the
 * repository, so this is a latent gap rather than an active defect; wire them up
 * if one of them ever needs to write into the tree.
 *
 * The repository is located from Jest's globalConfig.rootDir, not
 * process.cwd(), so an absolute `--config` path still guards the right tree.
 *
 * Set ALLOW_TEST_ARTEFACTS=1 to bypass, e.g. when deliberately regenerating
 * reports with GENERATE_REPORTS=true.
 */
const { execFileSync } = require('node:child_process');
const { lstatSync, readlinkSync, statSync } = require('node:fs');
const path = require('node:path');

const KEY = '__workingTreeGuardBefore';
const NOT_A_WORK_TREE = 'not-a-work-tree';

/**
 * The directory Git commands run in. Jest may be launched from anywhere -- an
 * absolute `--config` path is enough -- so process.cwd() is not the repository.
 * Jest passes globalConfig.rootDir, which is the directory holding the config,
 * so prefer that and only fall back to the process directory.
 * @param {object} [globalConfig]
 * @returns {string}
 */
function repoDir(globalConfig) {
  const rootDir = globalConfig && globalConfig.rootDir;
  return typeof rootDir === 'string' && rootDir !== '' ? rootDir : process.cwd();
}

/**
 * Status entries as `XY path`. With -z, a rename or copy (X or Y is R/C) is
 * followed by a separate field holding the original path, which is skipped.
 */
function status(cwd) {
  let output;
  try {
    output = execFileSync('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const message = `${error.stderr || ''}${error.stdout || ''}${error.message || ''}`;
    if (/not a git repository/i.test(message)) return null;
    throw error;
  }

  const fields = output.split('\0');
  const entries = [];
  for (let i = 0; i < fields.length; i += 1) {
    const entry = fields[i];
    if (!entry) continue;
    entries.push(entry);
    if (/[RC]/.test(entry.slice(0, 2))) i += 1;
  }
  return entries;
}

function hashOf(entry, cwd) {
  const file = entry.slice(3);
  const absolute = path.resolve(cwd, file);

  // A symlink must be snapshotted by its link text, not by what it points at.
  // Both `git hash-object` and `statSync` follow the link, so replacing a file
  // with a symlink to identical content -- or retargeting a symlink between two
  // files with identical content -- left the value unchanged and the mutation
  // passed. lstatSync does not follow, so the type and link target are visible.
  let link;
  try {
    if (lstatSync(absolute).isSymbolicLink()) link = readlinkSync(absolute);
  } catch {
    // Deleted between the status call and here; the content hash covers it.
  }
  if (link !== undefined) return `symlink:${link}`;

  const content = (() => {
    try {
      return execFileSync('git', ['hash-object', '--', file], {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
    } catch {
      return 'missing';
    }
  })();

  // `git hash-object` hashes content only, so a chmod leaves the content hash
  // unchanged even though `git status` reports the entry as modified. Git
  // records the executable bit, so include it and the change is caught.
  let mode = 'no-mode';
  try {
    mode = (statSync(absolute).mode & 0o111).toString(8);
  } catch {
    // Deleted or unreadable: the content hash already reflects that.
  }
  return `${content}:${mode}`;
}

function snapshot(cwd) {
  const entries = status(cwd);
  if (!entries) return NOT_A_WORK_TREE;
  return new Map(entries.map((entry) => [entry, hashOf(entry, cwd)]));
}

function disabled() {
  return process.env.ALLOW_TEST_ARTEFACTS === '1';
}

async function setup(globalConfig) {
  if (disabled()) return;
  globalThis[KEY] = snapshot(repoDir(globalConfig));
}

async function teardown(globalConfig) {
  if (disabled()) return;
  const cwd = repoDir(globalConfig);
  const before = globalThis[KEY];
  if (before === NOT_A_WORK_TREE) return;
  if (!(before instanceof Map)) {
    // Setup did not record a snapshot, so the guard cannot check this run.
    console.warn('⚠️  Working tree guard did not run: no snapshot from globalSetup (#3498).');
    return;
  }

  const after = snapshot(cwd);
  if (!(after instanceof Map)) return;
  const entries = new Set([...before.keys(), ...after.keys()]);
  const changed = [...entries].filter((entry) => before.get(entry) !== after.get(entry));

  if (changed.length) {
    throw new Error(
      [
        'Tests changed the working tree; write test output to os.tmpdir() instead (#3498):',
        ...changed.map((entry) => `  ${entry}`),
        'Set ALLOW_TEST_ARTEFACTS=1 to bypass when regenerating reports on purpose.',
      ].join('\n')
    );
  }
}

module.exports = { setup, teardown, repoDir, hashOf, snapshot };
