#!/usr/bin/env node
/**
 * Runs actionlint over the active workflows on any platform.
 *
 * The repository carries one `actionlint` binary, an x86-64 Linux build that CI
 * uses. A developer's own installation is preferred, so macOS, Windows and ARM
 * Linux contributors only need `actionlint` on their PATH; the checked-in binary
 * is used only where it can run (Linux x64) and no installation is found.
 *
 * The ignore patterns mirror `.github/workflows/workflow-lint.yml`, which is the
 * authoritative run: they cover inputs and context properties that actionlint
 * 1.7.12 does not know yet.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');

const IGNORE_PATTERNS = [
  'missing input "app-id" which is required by action "actions/create-github-app-token@',
  'input "client-id" is not defined in action "actions/create-github-app-token@',
  'property "workflow_repository" is not defined in object type \\{check_run_id',
  'property "workflow_sha" is not defined in object type \\{check_run_id',
];

const INSTALL_HELP = [
  'actionlint was not found on your PATH. Install it, then run this again:',
  '  macOS:    brew install actionlint',
  '  Windows:  scoop install actionlint   (or: winget install rhysd.actionlint)',
  '  Linux:    download a release from https://github.com/rhysd/actionlint/releases',
  '  Any OS:   go install github.com/rhysd/actionlint/cmd/actionlint@latest',
].join('\n');

/**
 * Chooses which actionlint executable to run.
 * @param {{ onPath: boolean, hasLocal: boolean, platform: string, arch: string }} facts
 * @returns {{ command: string } | { error: string }}
 */
function resolveActionlint({ onPath, hasLocal, platform, arch }) {
  if (onPath) return { command: 'actionlint' };
  if (hasLocal && platform === 'linux' && arch === 'x64') {
    return { command: path.join(ROOT, 'actionlint') };
  }
  return { error: INSTALL_HELP };
}

/** Whether `command --version` runs. */
function runs(command) {
  const result = spawnSync(command, ['--version'], { stdio: 'ignore' });
  return !result.error && result.status === 0;
}

/**
 * The workflow files actionlint checks: every `.yml` or `.yaml` directly in
 * `.github/workflows`, relative to the repository root. Subdirectories
 * (`archived/`, `__tests__/`) hold frozen history and test fixtures and are not
 * linted. The list is read from the directory rather than curated, so a new
 * workflow is checked from the day it lands and cannot be omitted silently.
 * @param {string} [directory] - Workflows directory, for tests
 * @returns {string[]}
 */
function workflowFiles(directory = WORKFLOWS_DIR) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name))
    .map((entry) => path.join('.github', 'workflows', entry.name))
    .sort();
}

function main() {
  const choice = resolveActionlint({
    onPath: runs('actionlint'),
    hasLocal: fs.existsSync(path.join(ROOT, 'actionlint')),
    platform: process.platform,
    arch: process.arch,
  });
  if (choice.error) {
    console.error(choice.error);
    return 1;
  }

  const args = [];
  if (runs('shellcheck')) args.push('-shellcheck=shellcheck');
  for (const pattern of IGNORE_PATTERNS) args.push('-ignore', pattern);
  args.push(...workflowFiles());

  return spawnSync(choice.command, args, { cwd: ROOT, stdio: 'inherit' }).status ?? 1;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { resolveActionlint, workflowFiles, IGNORE_PATTERNS };
