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
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const SCRIPT = path.join(__dirname, '..', 'validate-ruleset-drift.cjs');
const DECLARATION = path.join(__dirname, '..', '..', '..', '.github/rulesets/develop.ruleset.json');
const SERVER_SCRIPT = path.join(__dirname, 'fixtures', 'ruleset-mock-server.cjs');

function declaredRuleset() {
  return JSON.parse(fs.readFileSync(DECLARATION, 'utf8'));
}

/** The main-branch declaration: every case in a temporary checkout needs both. */
function mainDeclaration() {
  return JSON.parse(
    fs.readFileSync(path.join(path.dirname(DECLARATION), 'main.ruleset.json'), 'utf8')
  );
}

/** A live ruleset built from the declaration, with API-injected extras removed. */
function liveMatching(declaration) {
  return {
    ...declaration,
    id: 999,
    node_id: 'RRS_live',
    // The live API returns each rule's parameters, so they are kept: the check
    // compares every declared parameter, not only the status-check list.
    rules: declaration.rules.map((rule) =>
      rule.parameters ? { type: rule.type, parameters: rule.parameters } : { type: rule.type }
    ),
    bypass_actors: declaration.bypass_actors || [],
  };
}

/**
 * Start the mock server in a child process, run the drift script against it,
 * and resolve with the script's exit status and output.
 */
function runAgainst(liveRulesets, { declarations, onDevelop = [] } = {}) {
  // With `declarations`, the script runs in a temporary working directory holding
  // exactly those declarations, so a case can declare what the repository does not.
  let workdir = path.join(__dirname, '..', '..', '..');
  let temporary = null;
  if (declarations) {
    temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ruleset-drift-'));
    fs.mkdirSync(path.join(temporary, '.github', 'rulesets'), { recursive: true });
    declarations.forEach((declaration, index) => {
      fs.writeFileSync(
        path.join(temporary, '.github', 'rulesets', `case-${index}.ruleset.json`),
        JSON.stringify(declaration)
      );
    });
    workdir = temporary;
  }

  return new Promise((resolve, reject) => {
    const server = spawn(process.execPath, [SERVER_SCRIPT], {
      cwd: path.join(__dirname, '..', '..', '..'),
      stdio: ['ignore', 'pipe', 'inherit'],
      env: {
        ...process.env,
        MOCK_RULESETS: JSON.stringify(liveRulesets),
        // Files on the develop branch, for the pending-context rule.
        MOCK_FILES_ON_DEVELOP: JSON.stringify(onDevelop),
      },
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
        cwd: workdir,
        encoding: 'utf8',
        env: {
          ...process.env,
          GITHUB_REPOSITORY: 'lightspeedwp/.github',
          RULESETS_API_BASE: `http://127.0.0.1:${port}`,
          GITHUB_TOKEN: '',
        },
      });

      server.kill();
      if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
      resolve({ status: result.status, output: result.stdout + result.stderr });
    });

    server.on('error', reject);
  });
}

describe('validate-ruleset-drift', () => {
  it('reports in sync and exits 0 when the live ruleset matches', async () => {
    // The mock strips rules and conditions from its list response, as the real API
    // does, so this also guards that the full ruleset is fetched by id: comparing
    // against the summary shape would read every live field as empty and report
    // total drift.
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
        (entry) => entry.context !== 'Validate changelog on PR'
      ),
    };

    const result = await runAgainst([live]);

    expect(result.output).toContain('DRIFT');
    expect(result.output).toContain('required status checks');
    expect(result.output).toContain('Validate changelog on PR');
    expect(result.status).toBe(1);
  });

  describe('contexts declared but not yet required live', () => {
    const withoutContexts = (live, contexts) => {
      const rule = live.rules.find((entry) => entry.type === 'required_status_checks');
      rule.parameters = {
        ...rule.parameters,
        required_status_checks: rule.parameters.required_status_checks.filter(
          (entry) => !contexts.includes(entry.context)
        ),
      };
      return live;
    };
    const pending = ['Lint (JS/YAML/package.json)', 'Typecheck'];

    it('reports them as pending, not drift, while they are absent live', async () => {
      // lint.yml is not on develop, so the workflow that reports them has not landed.
      const result = await runAgainst([withoutContexts(liveMatching(declaredRuleset()), pending)], {
        declarations: [declaredRuleset(), mainDeclaration()],
      });

      expect(result.output).not.toContain('DRIFT');
      expect(result.output).toContain('PENDING');
      expect(result.output).toContain('Typecheck');
      expect(result.status).toBe(0);
    });

    it('is drift once the workflow that reports them is on develop', async () => {
      // The state comes from develop, so it cannot revert to pending after the workflow
      // lands: a context absent live is then a deleted or never-applied check.
      const result = await runAgainst([withoutContexts(liveMatching(declaredRuleset()), pending)], {
        declarations: [declaredRuleset(), mainDeclaration()],
        onDevelop: ['.github/workflows/lint.yml'],
      });

      expect(result.output).toContain('DRIFT');
      expect(result.output).toContain('Typecheck');
      expect(result.status).toBe(1);
    });

    it('still reports any other missing context as drift beside them', async () => {
      const live = withoutContexts(liveMatching(declaredRuleset()), [
        ...pending,
        'Validate changelog on PR',
      ]);

      const result = await runAgainst([live], {
        declarations: [declaredRuleset(), mainDeclaration()],
      });

      expect(result.output).toContain('DRIFT');
      expect(result.output).toContain('Validate changelog on PR');
      expect(result.status).toBe(1);
    });

    it('compares them like any other context once they are required live', async () => {
      const live = liveMatching(declaredRuleset());
      const rule = live.rules.find((entry) => entry.type === 'required_status_checks');
      rule.parameters = {
        ...rule.parameters,
        required_status_checks: [
          ...rule.parameters.required_status_checks,
          { context: 'An unexpected live check' },
        ],
      };

      const result = await runAgainst([live]);

      expect(result.output).toContain('DRIFT');
      expect(result.output).toContain('An unexpected live check');
      expect(result.status).toBe(1);
    });
  });

  it('does not compare bypass actors the token cannot see', async () => {
    // A non-admin token gets the ruleset with `bypass_actors` omitted entirely. That
    // is "not visible", not "no actors": reading it as an empty list would report
    // drift against every declared actor in CI.
    const live = liveMatching(declaredRuleset());
    delete live.bypass_actors;

    const result = await runAgainst([live]);

    expect(result.output).not.toContain('DRIFT');
    expect(result.output).toContain('not visible to this token');
    expect(result.status).toBe(0);
  });

  it('fails when the declared bypass actor is missing live', async () => {
    const live = liveMatching(declaredRuleset());
    live.bypass_actors = [];

    const result = await runAgainst([live]);

    expect(result.output).toContain('DRIFT');
    expect(result.output).toContain('bypass actors');
    expect(result.status).toBe(1);
  });

  it('fails when live has a bypass actor the declaration does not', async () => {
    const live = liveMatching(declaredRuleset());
    live.bypass_actors = [{ actor_id: 42, actor_type: 'User', bypass_mode: 'pull_request' }];

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

  describe('declarations that are missing or unmatched', () => {
    it('fails when the develop declaration file is deleted but its ruleset is live', async () => {
      const result = await runAgainst([liveMatching(declaredRuleset())], {
        declarations: [mainDeclaration()],
      });

      expect(result.output).toContain('DRIFT');
      expect(result.output).toContain('no declaration in .github/rulesets/');
      expect(result.output).toContain('develop-branch-ruleset');
      expect(result.output).toContain('unversioned');
      expect(result.status).toBe(1);
    });

    it('fails when there are no declarations at all, rather than reporting nothing to compare', async () => {
      const result = await runAgainst([liveMatching(declaredRuleset())], { declarations: [] });

      expect(result.output).toContain('DRIFT');
      expect(result.output).not.toContain('nothing to compare');
      expect(result.status).toBe(1);
    });

    it('does not flag a platform-managed live ruleset', async () => {
      const managed = {
        ...declaredRuleset(),
        name: 'Code Quality Copilot review for default branch',
        id: 4343,
      };

      const result = await runAgainst([liveMatching(declaredRuleset()), managed], {
        declarations: [declaredRuleset(), mainDeclaration()],
      });

      expect(result.output).not.toContain('has no declaration');
    });

    it('fails when a live ruleset has no declaration', async () => {
      const stray = { ...declaredRuleset(), name: 'stray-ruleset', id: 4242 };

      const result = await runAgainst([liveMatching(declaredRuleset()), stray]);

      expect(result.output).toContain('DRIFT');
      expect(result.output).toContain('stray-ruleset');
      expect(result.output).toContain('has no declaration');
      expect(result.status).toBe(1);
    });
  });

  it('fails when the deployed develop ruleset has been deleted', async () => {
    // Only main is served. Main is documented as not yet applied, but develop is
    // not, so its absence is the most severe drift rather than a pending item.
    const main = JSON.parse(
      fs.readFileSync(path.join(path.dirname(DECLARATION), 'main.ruleset.json'), 'utf8')
    );
    const result = await runAgainst([{ ...main, id: 1000 }]);

    expect(result.output).toContain('DRIFT');
    expect(result.output).toContain('develop-branch-ruleset');
    expect(result.output).toContain('no live ruleset with this name');
    expect(result.status).toBe(1);
  });

  it.each([
    ['the approval count drops', 'pull_request', { required_approving_review_count: 0 }],
    ['code owner review is disabled', 'pull_request', { require_code_owner_review: false }],
    ['thread resolution is disabled', 'pull_request', { required_review_thread_resolution: false }],
    [
      'the strict status-check policy is disabled',
      'required_status_checks',
      { strict_required_status_checks_policy: false },
    ],
  ])('fails when %s live but the rule types are unchanged', async (_label, type, change) => {
    const live = liveMatching(declaredRuleset());
    const rule = live.rules.find((entry) => entry.type === type);
    rule.parameters = { ...rule.parameters, ...change };

    const result = await runAgainst([live]);

    expect(result.output).toContain('DRIFT');
    expect(result.output).toContain(Object.keys(change)[0]);
    expect(result.status).toBe(1);
  });

  it('does not read an API-added default parameter as drift', async () => {
    const live = liveMatching(declaredRuleset());
    const rule = live.rules.find((entry) => entry.type === 'pull_request');
    rule.parameters = { ...rule.parameters, allowed_merge_methods: ['merge', 'squash'] };

    const result = await runAgainst([live]);

    expect(result.output).not.toContain('DRIFT');
    expect(result.status).toBe(0);
  });

  it.each([
    ['an exclusion of the target branch', { exclude: ['refs/heads/develop'] }],
    ['an extra included ref', { include: ['refs/heads/develop', 'refs/heads/other'] }],
  ])('fails on %s', async (_label, change) => {
    const live = liveMatching(declaredRuleset());
    live.conditions = { ref_name: { ...live.conditions.ref_name, ...change } };

    const result = await runAgainst([live]);

    expect(result.output).toContain('DRIFT');
    expect(result.output).toContain(`ref ${Object.keys(change)[0]}`);
    expect(result.status).toBe(1);
  });

  it('fails when the same actor bypasses in a different mode', async () => {
    const actor = { actor_id: 1577675, actor_type: 'User', bypass_mode: 'pull_request' };
    const declaration = { ...declaredRuleset(), bypass_actors: [actor] };
    const live = {
      ...liveMatching(declaration),
      bypass_actors: [{ ...actor, bypass_mode: 'always' }],
    };

    const result = await runAgainst([live], { declarations: [declaration, mainDeclaration()] });

    expect(result.output).toContain('DRIFT');
    expect(result.output).toContain('bypass actors');
    expect(result.output).toContain('always');
    expect(result.status).toBe(1);
  });

  it('is in sync when the same actor keeps the same bypass mode', async () => {
    const actor = { actor_id: 1577675, actor_type: 'User', bypass_mode: 'pull_request' };
    const declaration = { ...declaredRuleset(), bypass_actors: [actor] };
    const live = { ...liveMatching(declaration), bypass_actors: [actor] };

    const result = await runAgainst([live], { declarations: [declaration, mainDeclaration()] });

    expect(result.output).toContain('OK');
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
