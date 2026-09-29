/**
 * @jest-environment node
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

jest.setTimeout(60000);

const SETUP = path.join(__dirname, '..', '..', '.claude', 'cloud', 'setup.sh');

/**
 * Run install_node from the real script, with the download forced to fail and the
 * absolute paths it writes redirected into a sandbox.
 *
 * The function is extracted from the script rather than stubbed, so the test fails
 * if the script's own control flow changes. `curl` is shadowed with a function that
 * always fails, which is what a fresh machine with no cached install looks like: the
 * first step of the install condition fails and the else branch runs.
 */
function runInstallNode({ existingNode }) {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'setup-node-'));
  const opt = path.join(sandbox, 'opt');
  const localBin = path.join(sandbox, 'local-bin');
  fs.mkdirSync(localBin, { recursive: true });
  if (existingNode) {
    // The function looks in ${dir}/bin/node, and ${dir} is keyed by major version,
    // so the fixture has to be at node<major>/bin/node.
    const dir = path.join(opt, 'node24');
    fs.mkdirSync(path.join(dir, 'bin'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'bin', 'node'), '#!/bin/sh\necho v24.20.0\n');
    fs.chmodSync(path.join(dir, 'bin', 'node'), 0o755);
  }

  const script = fs.readFileSync(SETUP, 'utf8');
  const start = script.indexOf('install_node() {');
  const end = script.indexOf('\n}\n', start) + 3;
  const body = script.slice(start, end);

  // The install directory is /opt/node<major>, so the sandbox has to provide one
  // for the existing-install case, and `curl` is shadowed so the download cannot
  // succeed. `timeout` is a shell builtin wrapper here only so the harness does not
  // depend on coreutils being on PATH; the real flag handling is left alone.
  // The install condition is a pipeline of `timeout ... && ... && [ -x ... ]`. A
  // shell function cannot shim that: `timeout` resolves to the external binary, so
  // a `curl` function is never called and a real download happens — which made this
  // test pass against the unfixed script. A PATH directory holding failing `curl`,
  // `tar` and `timeout` stand-ins comes first instead, so the condition genuinely
  // fails the way it does on a machine whose download does not succeed.
  const shim = path.join(sandbox, 'shim');
  fs.mkdirSync(shim, { recursive: true });
  for (const tool of ['curl', 'tar', 'timeout']) {
    fs.writeFileSync(path.join(shim, tool), '#!/bin/sh\nexit 22\n');
    fs.chmodSync(path.join(shim, tool), 0o755);
  }
  const harness = `#!/bin/bash
set -uo pipefail
NODE_VERSION="\${LS_NODE_VERSION:-24.20.0}"
log() { echo "LOG: $1"; }
${body}
install_node
echo "RC=$?"
`;
  // The function hard-codes /opt/node<major> and /root/.local/bin, so both are
  // redirected into the sandbox. The body is the script's own, only its two paths
  // are changed, so a control-flow change in the script still fails this test.
  const redirected = body
    .replace(
      'local dir="/opt/node${NODE_VERSION%%.*}"',
      `local dir="${opt}/node\${NODE_VERSION%%.*}"`
    )
    .replaceAll('/root/.local/bin', localBin);
  const file = path.join(sandbox, 'harness.sh');
  fs.writeFileSync(file, harness.replace(body, redirected));
  const result = spawnSync('bash', [file], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${shim}${path.delimiter}${process.env.PATH}` },
  });
  const links = fs.readdirSync(localBin);
  const dangling = links.filter((link) => !fs.existsSync(path.join(localBin, link)));
  return { out: result.stdout + result.stderr, links, dangling, sandbox };
}

describe('the setup script links Node only when there is one', () => {
  test('creates no links at all when the install fails on a fresh machine', () => {
    const { out, links, dangling, sandbox } = runInstallNode({ existingNode: false });
    try {
      // The failure is reported, and the script says it is leaving Node alone
      // rather than claiming a version it does not have.
      expect(out).toMatch(/install failed/);
      // The version line is the tell: the old flow printed "Node  is the default"
      // with an empty version, which reads as success in the snapshot log.
      expect(out).not.toMatch(/is the default/);
      expect(out).not.toMatch(/Node {2}is the default/);
      // Nothing is linked, so nothing can dangle: this is the whole defect. Before
      // the guard the loop ran anyway and produced links pointing at a directory
      // that was never created.
      expect(links).toEqual([]);
      expect(dangling).toEqual([]);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('leaves an existing install usable and links it when the download fails', () => {
    const { out, links, sandbox } = runInstallNode({ existingNode: true });
    try {
      // The existing install is preserved and the script links it, which is the case
      // the guard must not break: a failed download on a machine that already has
      // Node is not fatal. The link loop is reached, and node resolves, which is
      // what the log line asserts.
      expect(out).toMatch(/is the default/);
      expect(out).toMatch(/Node v24\.20\.0 is the default/);
      expect(links).toContain('node');
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });
});
