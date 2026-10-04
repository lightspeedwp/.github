/**
 * Tests for validate-ruleset-drift.
 *
 * The check exists because applying a ruleset is a manual step, so a required
 * status check can quietly stop being enforced while the JSON still claims it.
 * These tests drive the real script against a local HTTP server serving a
 * synthetic "live" ruleset, covering each outcome it must distinguish:
 *
 * - matching        -> in sync, exit 0
 * - required contexts differ -> drift, exit 1 (the check this guards)
 * - bypass actors differ -> drift, exit 1
 * - declaration not deployed -> pending, exit 0 (not a failure)
 * - required_status_checks rule missing live -> drift, exit 1
 *
 * The live fixture deliberately omits an id and the API's default-filled
 * required_status_checks keys, so the comparison is proved to tolerate the
 * fields the API injects rather than demanding literal equality.
 *
 * The mock server runs in a child process: the script is invoked with
 * spawnSync, which blocks this process's event loop, so an in-process server
 * would never accept the request the child is waiting on and the test would
 * deadlock.
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const SCRIPT = path.join(__dirname, '..', 'validate-ruleset-drift.cjs');
const DECLARATION = path.join(__dirname, '..', '..', '..', '.github/rulesets/develop.ruleset.json');
const SERVER_SCRIPT = path.join(__dirname, 'fixtures', 'ruleset-mock-server.cjs');

function declaredRuleset() {
  return JSON.parse(fs.readFileSync(DECLARATION, 'utf8'));
}

/** A live ruleset built from the declaration, with API-injected extras removed. */
function liveMatching(declaration) {
  return {
    ...declaration,
    id: 999,
    node_id: 'RRS_live',
    rules: declaration.rules.map((rule) =>
      rule.type === 'required_status_checks'
        ? { type: rule.type, parameters: rule.parameters }
        : { type: rule.type }
    ),
    bypass_actors: [],
  };
}

/**
 * Start the mock server in a child process, run the drift script against it,
 * and resolve with the script's exit status and output.
 */
function runAgainst(liveRulesets) {
  return new Promise((resolve, reject) => {
    const server = spawn(process.execPath, [SERVER_SCRIPT], {
      cwd: path.join(__dirname, '..', '..', '..'),
      stdio: ['ignore', 'pipe', 'inherit'],
      env: { ...process.env, MOCK_RULESETS: JSON.stringify(liveRulesets) },
    });

    let buffer = '';
    const timer = setTimeout(() => {
      server.kill();
      reject(new Error('mock server did not report a port in time'));
    }, 10000);

    server.stdout.on('data', (chunk) => {
      buffer += chunk.toString();
      const newline = buffer.indexOf('\n');
      if (newline === -1) return;

      const port = Number.parseInt(buffer.slice(0, newline), 10);
      clearTimeout(timer);
      server.stdout.removeAllListeners('data');

      const result = spawnSync(process.execPath, [SCRIPT], {
        cwd: path.join(__dirname, '..', '..', '..'),
        encoding: 'utf8',
        env: {
          ...process.env,
          GITHUB_REPOSITORY: 'lightspeedwp/.github',
          RULESETS_API_BASE: `http://127.0.0.1:${port}`,
          GITHUB_TOKEN: '',
        },
      });

      server.kill();
      resolve({ status: result.status, output: result.stdout + result.stderr });
    });

    server.on('error', reject);
  });
}

describe('validate-ruleset-drift', () => {
  it('reports in sync and exits 0 when the live ruleset matches', async () => {
    const result = await runAgainst([liveMatching(declaredRuleset())]);

    expect(result.output).toContain('OK');
    expect(result.output).toContain('develop-branch-ruleset');
    expect(result.status).toBe(0);
  });

  it('fails when a required status check is declared but not enforced live', async () => {
    const live = liveMatching(declaredRuleset());
    const rule = live.rules.find((entry) => entry.type === 'required_status_checks');
    rule.parameters = {
      ...rule.parameters,
      required_status_checks: rule.parameters.required_status_checks.filter(
        (entry) => entry.context !== 'Typecheck'
      ),
    };

    const result = await runAgainst([live]);

    expect(result.output).toContain('DRIFT');
    expect(result.output).toContain('required status checks');
    expect(result.output).toContain('Typecheck');
    expect(result.status).toBe(1);
  });

  it('fails when live has a bypass actor the declaration does not', async () => {
    const live = liveMatching(declaredRuleset());
    live.bypass_actors = [{ actor_id: 1577675, actor_type: 'User', bypass_mode: 'pull_request' }];

    const result = await runAgainst([live]);

    expect(result.output).toContain('DRIFT');
    expect(result.output).toContain('bypass actors');
    expect(result.status).toBe(1);
  });

  it('treats a declaration with no live ruleset as pending, not drift', async () => {
    // Only the develop ruleset is served; main is documented as not applied.
    const result = await runAgainst([liveMatching(declaredRuleset())]);

    expect(result.output).toContain('PENDING');
    expect(result.output).toContain('main-branch-ruleset');
    expect(result.status).toBe(0);
  });

  it('does not report drift when live is only served in summary shape', async () => {
    // Regression guard: the list endpoint omits rules/conditions, so a validator
    // comparing against summaries sees every field empty and calls it total
    // drift. The mock strips those fields from the list response, so an in-sync
    // declaration must still be reported OK.
    const result = await runAgainst([liveMatching(declaredRuleset())]);

    expect(result.output).toContain('OK');
    expect(result.output).not.toContain('DRIFT');
    expect(result.status).toBe(0);
  });

  it('fails when the required_status_checks rule is missing live', async () => {
    const live = liveMatching(declaredRuleset());
    live.rules = live.rules.filter((rule) => rule.type !== 'required_status_checks');

    const result = await runAgainst([live]);

    expect(result.output).toContain('DRIFT');
    expect(result.status).toBe(1);
  });
});
