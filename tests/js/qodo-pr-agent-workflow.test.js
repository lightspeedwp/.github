/**
 * Contract test for the Qodo PR-Agent workflows.
 *
 * Source of truth: .github/specs/019-qodo-pr-agent-integration/contracts/reusable-workflow.md
 */
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import YAML from 'yaml';

const repoRoot = path.resolve(__dirname, '../..');
const reusablePath = '.github/workflows/qodo-pr-agent-reusable.yml';
const callerPath = '.github/workflows/qodo-pr-agent.yml';

/**
 * Read and parse a workflow fixture, tolerating a missing file.
 * @param {string} relativePath - Path relative to the repository root.
 * @returns {{raw: string, doc: object}} Source text and parsed workflow.
 */
function load(relativePath) {
  const full = path.join(repoRoot, relativePath);
  if (!fs.existsSync(full)) return { raw: '', doc: {} };
  const raw = fs.readFileSync(full, 'utf8');
  return { raw, doc: YAML.parse(raw) };
}

const reusable = load(reusablePath);
const caller = load(callerPath);

const ALLOWED_COMMANDS = [
  '/describe',
  '/improve',
  '/review',
  '/ask',
  '/update_changelog',
  '/add_docs',
  '/help',
];

/**
 * Gather steps from every job in a workflow.
 * @param {object} doc - Parsed workflow document.
 * @returns {object[]} Job steps in workflow order.
 */
function allSteps(doc) {
  return Object.values(doc.jobs || {}).flatMap((job) => job.steps || []);
}

/**
 * Find the step that runs the pinned PR-Agent container.
 * @param {object} doc - Parsed workflow document.
 * @returns {object|undefined} Container step, if present.
 */
function qodoStep(doc) {
  return allSteps(doc).find((step) =>
    String(step.uses || '').startsWith('docker://pragent/pr-agent')
  );
}

/**
 * Find the token exchange step in the run job.
 * @param {object} doc - Parsed workflow document.
 * @returns {object|undefined} Token step, if present.
 */
function tokenStep(doc) {
  return (doc.jobs?.run?.steps || []).find((step) => step.id === 'token');
}

/**
 * Execute the workflow's token exchange script with mocked Actions services.
 * @param {object} [options] - Environment overrides and mock HTTP response.
 * @param {object} [options.env] - Variables supplied to the script.
 * @param {object} [options.response] - Fields overriding a successful response.
 * @returns {Promise<object>} Captured outputs and service mocks.
 */
async function runTokenExchange({ env = {}, response } = {}) {
  const outputs = {};
  const core = {
    getIDToken: jest.fn(async () => 'github-oidc-jwt'),
    setSecret: jest.fn(),
    setOutput: jest.fn((key, value) => {
      outputs[key] = value;
    }),
    setFailed: jest.fn(),
    info: jest.fn(),
  };
  const fetch = jest.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ access_token: 'sk-ant-oat01-test', expires_in: 600 }),
    ...response,
  }));
  // actions/github-script runs the script as the body of an async function.
  const run = vm.runInNewContext(`(async () => {\n${tokenStep(reusable.doc).with.script}\n})`, {
    core,
    fetch,
    process: {
      env: {
        HAS_API_KEY: 'false',
        FEDERATION_RULE_ID: 'fdrl_test',
        ORGANIZATION_ID: '00000000-0000-0000-0000-000000000000',
        SERVICE_ACCOUNT_ID: 'svac_test',
        WORKSPACE_ID: '',
        ...env,
      },
    },
  });
  await run();
  return { outputs, core, fetch };
}

/**
 * Join the preflight scripts from the workflow steps.
 * @param {object} doc - Parsed workflow document.
 * @returns {string} Script bodies joined with newlines.
 */
function preflightScript(doc) {
  const steps = doc.jobs?.preflight?.steps || [];
  return steps.map((step) => String(step.with?.script || step.run || '')).join('\n');
}

/**
 * Execute preflight with a synthetic event and mocked Actions core.
 * @param {object} [options] - Event, payload and environment overrides.
 * @param {string} [options.eventName] - GitHub event name.
 * @param {object} [options.payload] - Event payload; a fixture is used when absent.
 * @param {object} [options.env] - Variables supplied to the script.
 * @returns {object} Captured outputs and Actions core mock.
 */
function runPreflight({ eventName = 'pull_request', payload, env = {} } = {}) {
  const outputs = {};
  const core = {
    setOutput: jest.fn((key, value) => {
      outputs[key] = value;
    }),
    notice: jest.fn(),
    warning: jest.fn(),
  };
  const defaultPayload =
    eventName === 'pull_request'
      ? { sender: { type: 'User' }, pull_request: { draft: false, user: { login: 'maintainer' } } }
      : {
          sender: { type: 'User' },
          issue: { pull_request: {} },
          comment: { body: '/review', author_association: 'OWNER' },
        };
  vm.runInNewContext(
    preflightScript(reusable.doc),
    {
      context: { eventName, payload: payload || defaultPayload },
      process: { env: { HAS_CREDENTIAL: 'true', ...env } },
      core,
    },
    { timeout: 1000 }
  );
  return { outputs, core };
}

describe('Qodo PR-Agent reusable workflow', () => {
  const { doc, raw } = reusable;

  it('exists', () => {
    expect(raw.length).toBeGreaterThan(0);
  });

  it('is a workflow_call workflow with the contracted inputs and secret', () => {
    const call = doc.on?.workflow_call;
    expect(call).toBeDefined();
    expect(call.inputs.config_ref.default).toBe('main');
    expect(call.inputs.auto_describe.default).toBe(true);
    expect(call.inputs.auto_improve.default).toBe(true);
    expect(JSON.parse(call.inputs.excluded_authors.default)).toStrictEqual([
      'dependabot[bot]',
      'lightspeed-docs-bot[bot]',
    ]);
    expect(call.inputs.auto_review).toBeUndefined();
    expect(call.secrets.model_credential.required).toBe(false);
    for (const input of [
      'federation_rule_id',
      'organization_id',
      'service_account_id',
      'workspace_id',
    ]) {
      expect(call.inputs[input]).toMatchObject({ type: 'string', required: false, default: '' });
    }
  });

  it('uses least-privilege permissions', () => {
    expect(doc.permissions).toStrictEqual({ contents: 'read' });
    expect(doc.jobs.preflight.permissions).toStrictEqual({});
    expect(doc.jobs.preflight['timeout-minutes']).toBe(2);
    expect(doc.jobs.run.permissions).toStrictEqual({
      contents: 'read',
      'pull-requests': 'write',
      issues: 'write',
      'id-token': 'write',
    });
    expect(doc.jobs.run['timeout-minutes']).toBe(15);
    expect(doc.jobs.preflight.permissions).not.toHaveProperty('id-token');
    expect(doc.jobs.record.permissions).toStrictEqual({});
  });

  it('only runs when preflight enables it', () => {
    expect(doc.jobs.run.needs).toBe('preflight');
    expect(String(doc.jobs.run.if)).toContain("needs.preflight.outputs.enabled == 'true'");
  });

  it('never checks out repository code', () => {
    for (const step of allSteps(doc)) {
      expect(String(step.uses || '')).not.toMatch(/^actions\/checkout/);
    }
  });

  it('pins the Qodo PR-Agent image by digest', () => {
    const step = qodoStep(doc);
    expect(step).toBeDefined();
    expect(step.uses).toMatch(/^docker:\/\/pragent\/pr-agent@sha256:[a-f0-9]{64}$/);
  });

  it('re-sets every locked key in the environment so repository config cannot weaken it', () => {
    const env = qodoStep(doc).env;
    expect(env).toMatchObject({
      'config.response_language': 'en-GB',
      'config.enable_custom_labels': 'false',
      'pr_description.publish_description_as_comment': 'true',
      'pr_description.publish_labels': 'false',
      'pr_description.generate_ai_title': 'false',
      'pr_reviewer.enable_review_labels_security': 'false',
      'pr_reviewer.enable_review_labels_effort': 'false',
      'pr_code_suggestions.commitable_code_suggestions': 'false',
      'pr_update_changelog.push_changelog_changes': 'false',
    });
  });

  it('never fails the PR when Qodo PR-Agent itself fails, and records the real outcome', () => {
    expect(qodoStep(doc)['continue-on-error']).toBe(true);
    expect(doc.jobs.run.outputs.outcome).toContain('steps.qodo.outcome');
    const recordEnv = doc.jobs.record.steps.find((step) => step.name === 'Write run record').env;
    expect(recordEnv.RUN_RESULT).toContain('needs.run.outputs.outcome');
  });

  it.each([
    ['ok', 'success', 'success'],
    ['ok', 'failure', 'failure'],
    ['no-credential', 'skipped', 'skipped:no-credential'],
  ])('writes a %s/%s run record as %s', (reason, runResult, outcome) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qodo-record-test-'));
    const summaryPath = path.join(directory, 'summary.md');
    const recordStep = doc.jobs.record.steps.find((step) => step.name === 'Write run record');
    try {
      const result = spawnSync('bash', ['-e', '-c', recordStep.run], {
        cwd: directory,
        encoding: 'utf8',
        timeout: 10000,
        env: {
          ...process.env,
          REPOSITORY: 'lightspeedwp/.github',
          PR_NUMBER: '42',
          TOOL: 'auto',
          TRIGGER: 'pull_request',
          REASON: reason,
          RUN_RESULT: runResult,
          STARTED_AT: '',
          EVENT_AT: '2026-10-01T10:00:00Z',
          GITHUB_STEP_SUMMARY: summaryPath,
        },
      });
      expect(result.status).toBe(0);
      const record = JSON.parse(fs.readFileSync(path.join(directory, 'qodo-pr-agent-run.json')));
      expect(record).toStrictEqual({
        repository: 'lightspeedwp/.github',
        pr: 42,
        tool: 'auto',
        trigger: 'pull_request',
        outcome,
        duration_seconds: 0,
        model: 'anthropic/claude-sonnet-5',
        started_at: '',
        event_at: '2026-10-01T10:00:00Z',
      });
      expect(fs.readFileSync(summaryPath, 'utf8')).toContain(JSON.stringify(record, null, 2));
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  it('passes the contracted environment to Qodo PR-Agent', () => {
    const env = qodoStep(doc).env;
    expect(env['github_action_config.auto_review']).toBe('false');
    expect(env['ANTHROPIC.KEY']).toContain('secrets.model_credential');
    expect(env.GITHUB_TOKEN).toContain('secrets.GITHUB_TOKEN');
    expect(env['CONFIG.EXTRA_CONFIG_URL']).toContain(
      'raw.githubusercontent.com/lightspeedwp/.github/'
    );
    expect(env['CONFIG.EXTRA_CONFIG_URL']).toContain('inputs.config_ref');
    expect(JSON.parse(env['github_action_config.pr_actions'])).toStrictEqual([
      'opened',
      'reopened',
      'ready_for_review',
    ]);
  });

  describe('preflight guard', () => {
    const script = preflightScript(doc);

    it('checks the kill-switch, credential and commenter association', () => {
      expect(raw).toContain('QODO_PR_AGENT_ENABLED');
      for (const token of ['author_association', 'OWNER', 'MEMBER', 'COLLABORATOR']) {
        expect(script).toContain(token);
      }
    });

    it('allow-lists exactly the contracted commands', () => {
      for (const command of ALLOWED_COMMANDS) {
        expect(script).toContain(`'${command}'`);
      }
      expect(script).not.toContain("'/generate_labels'");
      expect(script).not.toContain("'/similar_issue'");
    });

    it('skips with a notice and never fails', () => {
      expect(script).toMatch(/core\.notice\(/);
      expect(script).not.toMatch(/exit 1|core\.setFailed\(/);
    });

    it('enables a non-draft human PR with a credential', () => {
      const { outputs, core } = runPreflight();
      expect(outputs).toStrictEqual({ enabled: 'true', reason: 'ok', tool: 'auto' });
      expect(core.notice).not.toHaveBeenCalled();
    });

    it.each([
      // PR-event skips after the kill-switch and bot checks are automatic attempts ('auto'),
      // so the report can count them against SC-001.
      ['kill-switch', { env: { KILL_SWITCH: 'FALSE' } }, 'none'],
      ['bot-sender', { payload: { sender: { type: 'Bot' } } }, 'none'],
      ['draft', { payload: { pull_request: { draft: true } } }, 'auto'],
      ['excluded-author', { env: { EXCLUDED_AUTHORS: '["maintainer"]' } }, 'auto'],
      ['no-credential', { env: { HAS_CREDENTIAL: 'false' } }, 'auto'],
      [
        'fork',
        {
          payload: {
            repository: { full_name: 'lightspeedwp/.github' },
            pull_request: {
              draft: false,
              user: { login: 'maintainer' },
              head: { repo: { full_name: 'someone/.github' } },
            },
          },
        },
        'auto',
      ],
    ])('skips a PR on %s without failing the check', (reason, overrides, tool) => {
      const defaultPayload = {
        sender: { type: 'User' },
        pull_request: { draft: false, user: { login: 'maintainer' } },
      };
      const { outputs, core } = runPreflight({
        ...overrides,
        payload: { ...defaultPayload, ...overrides.payload },
      });
      expect(outputs).toStrictEqual({ enabled: 'false', reason, tool });
      expect(core.notice).toHaveBeenCalledWith(`Qodo PR-Agent skipped: ${reason}`);
    });

    it('runs a same-repository PR whose head repository matches', () => {
      const { outputs } = runPreflight({
        payload: {
          sender: { type: 'User' },
          repository: { full_name: 'lightspeedwp/.github' },
          pull_request: {
            draft: false,
            user: { login: 'maintainer' },
            head: { repo: { full_name: 'lightspeedwp/.github' } },
          },
        },
      });
      expect(outputs).toStrictEqual({ enabled: 'true', reason: 'ok', tool: 'auto' });
    });

    it('treats either a stored key or a complete federation configuration as a credential', () => {
      const expression = String(doc.jobs.preflight.steps[0].env.HAS_CREDENTIAL);
      expect(expression).toContain("secrets.model_credential != ''");
      for (const input of ['federation_rule_id', 'organization_id', 'service_account_id']) {
        expect(expression).toContain(`inputs.${input} != ''`);
      }
      expect(expression).not.toContain('workspace_id');
    });

    it('warns on malformed excluded authors and still handles a valid PR', () => {
      const { outputs, core } = runPreflight({ env: { EXCLUDED_AUTHORS: '[invalid' } });
      expect(outputs).toStrictEqual({ enabled: 'true', reason: 'ok', tool: 'auto' });
      expect(core.warning).toHaveBeenCalledWith(
        'excluded_authors is not valid JSON; treating it as empty.'
      );
    });

    it.each(ALLOWED_COMMANDS)('enables authorised maintainer command %s', (command) => {
      const { outputs } = runPreflight({
        eventName: 'issue_comment',
        payload: {
          issue: { pull_request: {} },
          comment: {
            body: `  ${command.toUpperCase()} extra arguments  `,
            author_association: 'MEMBER',
          },
        },
      });
      expect(outputs).toStrictEqual({ enabled: 'true', reason: 'ok', tool: command.slice(1) });
    });

    // Five reasons never reach a parsed command — kill-switch, bot-sender,
    // not-a-pr, not-a-command and unsupported-event — so they carry no tool.
    // Every other reason names the requested tool, but only when the command is
    // on the allow list: the comment body is untrusted, so a refused request
    // must not be able to write an arbitrary value into the pilot report.
    it.each([
      [
        'not-a-pr',
        'none',
        { issue: {}, comment: { body: '/review', author_association: 'OWNER' } },
      ],
      [
        'not-a-command',
        'none',
        {
          issue: { pull_request: {} },
          comment: { body: 'ordinary comment', author_association: 'OWNER' },
        },
      ],
      [
        'author-not-allowed',
        'review',
        {
          issue: { pull_request: {} },
          comment: { body: '/review', author_association: 'CONTRIBUTOR' },
        },
      ],
      [
        'command-not-allowed',
        'none',
        {
          issue: { pull_request: {} },
          comment: { body: '/generate_labels', author_association: 'OWNER' },
        },
      ],
    ])('rejects issue comments with reason %s and tool %s', (reason, tool, payload) => {
      const { outputs, core } = runPreflight({ eventName: 'issue_comment', payload });
      expect(outputs).toStrictEqual({ enabled: 'false', reason, tool });
      expect(core.notice).toHaveBeenCalledTimes(reason === 'not-a-command' ? 0 : 1);
    });

    // The comment body is untrusted input. These pin the boundaries that stop a
    // refused request writing an unrecognised or reserved value into the report.
    it.each([
      // The association check runs first, so a non-allow-listed command from an
      // unauthorised author stops there; OWNER is used to reach the allow list.
      ['a bare slash', 'OWNER', '/', 'not-a-command', 'none'],
      ['a slash with trailing text', 'OWNER', '  /  extra', 'not-a-command', 'none'],
      ['an attempt to forge the auto sentinel', 'OWNER', '/auto', 'command-not-allowed', 'none'],
      ['an attempt to forge the none sentinel', 'OWNER', '/none', 'command-not-allowed', 'none'],
      [
        'an allow-listed command from an unauthorised author',
        'CONTRIBUTOR',
        '/review',
        'author-not-allowed',
        'review',
      ],
      [
        'a non-allow-listed command from an unauthorised author',
        'CONTRIBUTOR',
        '/auto',
        'author-not-allowed',
        'none',
      ],
    ])('refuses %s without leaking a tool value', (_label, association, body, reason, tool) => {
      const { outputs } = runPreflight({
        eventName: 'issue_comment',
        payload: {
          issue: { pull_request: {} },
          comment: { body, author_association: association },
        },
      });
      expect(outputs).toStrictEqual({ enabled: 'false', reason, tool });
    });

    it('rejects authorised commands when the credential is missing', () => {
      const { outputs } = runPreflight({
        eventName: 'issue_comment',
        env: { HAS_CREDENTIAL: 'false' },
      });
      expect(outputs).toStrictEqual({ enabled: 'false', reason: 'no-credential', tool: 'review' });
    });

    it.each(['OWNER', 'MEMBER', 'COLLABORATOR'])(
      'accepts a command from %s on a fork PR in the base repository context',
      (association) => {
        const { outputs, core } = runPreflight({
          eventName: 'issue_comment',
          payload: {
            sender: { type: 'User' },
            repository: { full_name: 'lightspeedwp/.github' },
            issue: {
              pull_request: { url: 'https://api.github.com/repos/lightspeedwp/.github/pulls/42' },
            },
            comment: { body: '\t/ASK\nWhy?  ', author_association: association },
          },
        });
        expect(outputs).toStrictEqual({ enabled: 'true', reason: 'ok', tool: 'ask' });
        expect(core.notice).not.toHaveBeenCalled();
      }
    );

    it.each(['NONE', 'FIRST_TIMER', 'FIRST_TIME_CONTRIBUTOR', undefined])(
      'denies a recognised command from an unauthorised association: %s',
      (association) => {
        const { outputs, core } = runPreflight({
          eventName: 'issue_comment',
          payload: {
            issue: { pull_request: {} },
            comment: { body: '/review', author_association: association },
          },
        });
        expect(outputs).toStrictEqual({
          enabled: 'false',
          reason: 'author-not-allowed',
          tool: 'review',
        });
        expect(core.notice).toHaveBeenCalledWith('Qodo PR-Agent skipped: author-not-allowed');
      }
    );

    it.each(['/reviewer', '/review;echo', '/ask?why', '/review/'])(
      'requires an exact command token instead of accepting %s',
      (body) => {
        const { outputs } = runPreflight({
          eventName: 'issue_comment',
          payload: {
            issue: { pull_request: {} },
            comment: { body, author_association: 'OWNER' },
          },
        });
        expect(outputs).toStrictEqual({
          enabled: 'false',
          reason: 'command-not-allowed',
          tool: 'none',
        });
      }
    );

    it.each([
      ['kill-switch', { KILL_SWITCH: 'FaLsE' }, { type: 'User' }],
      ['bot-sender', {}, { type: 'Bot' }],
    ])('applies the %s guard even to an authorised maintainer command', (reason, env, sender) => {
      const { outputs } = runPreflight({
        eventName: 'issue_comment',
        env,
        payload: {
          sender,
          issue: { pull_request: {} },
          comment: { body: '/review', author_association: 'OWNER' },
        },
      });
      expect(outputs).toStrictEqual({ enabled: 'false', reason, tool: 'none' });
    });

    it.each(['', '  ', 'Please /review this PR', '> /review'])(
      'ignores an ordinary comment without emitting a skip notice: %j',
      (body) => {
        const { outputs, core } = runPreflight({
          eventName: 'issue_comment',
          payload: { issue: { pull_request: {} }, comment: { body, author_association: 'OWNER' } },
        });
        expect(outputs).toStrictEqual({ enabled: 'false', reason: 'not-a-command', tool: 'none' });
        expect(core.notice).not.toHaveBeenCalled();
      }
    );

    it('skips unsupported events rather than running a tool', () => {
      const { outputs } = runPreflight({ eventName: 'push' });
      expect(outputs).toStrictEqual({
        enabled: 'false',
        reason: 'unsupported-event',
        tool: 'none',
      });
    });
  });

  describe('Workload Identity Federation token exchange', () => {
    const steps = doc.jobs.run.steps;

    it('runs before Qodo PR-Agent, only when federation is configured, and never fails the PR', () => {
      const step = tokenStep(doc);
      expect(step).toBeDefined();
      expect(steps.indexOf(step)).toBeLessThan(steps.indexOf(qodoStep(doc)));
      expect(String(step.if)).toContain("inputs.federation_rule_id != ''");
      expect(step['continue-on-error']).toBe(true);
      expect(step.uses).toMatch(/^actions\/github-script@[a-f0-9]{40}$/);
      expect(step.env).toMatchObject({
        HAS_API_KEY: "${{ secrets.model_credential != '' }}",
        FEDERATION_RULE_ID: '${{ inputs.federation_rule_id }}',
        ORGANIZATION_ID: '${{ inputs.organization_id }}',
        SERVICE_ACCOUNT_ID: '${{ inputs.service_account_id }}',
        WORKSPACE_ID: '${{ inputs.workspace_id }}',
      });
    });

    it('hands the exchanged token to Qodo PR-Agent, falling back to the stored key', () => {
      const qodo = qodoStep(doc);
      expect(qodo.env['ANTHROPIC.KEY']).toBe(
        '${{ steps.token.outputs.credential || secrets.model_credential }}'
      );
      expect(String(qodo.if)).toContain("steps.token.outcome != 'failure'");
      expect(doc.jobs.run.outputs.outcome).toContain("steps.token.outcome == 'failure'");
      const notice = steps.find(
        (step) => step.name === 'Report a failed run without blocking the PR'
      );
      expect(String(notice.if)).toContain("steps.token.outcome == 'failure'");
    });

    it('exchanges the GitHub OIDC token and masks the Anthropic token', async () => {
      const { outputs, core, fetch } = await runTokenExchange();
      expect(core.getIDToken).toHaveBeenCalledWith('https://api.anthropic.com');
      expect(fetch).toHaveBeenCalledTimes(1);
      const [url, request] = fetch.mock.calls[0];
      expect(url).toBe('https://api.anthropic.com/v1/oauth/token');
      expect(request.method).toBe('POST');
      expect(request.headers).toStrictEqual({ 'content-type': 'application/json' });
      expect(JSON.parse(request.body)).toStrictEqual({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: 'github-oidc-jwt',
        federation_rule_id: 'fdrl_test',
        organization_id: '00000000-0000-0000-0000-000000000000',
        service_account_id: 'svac_test',
      });
      expect(core.setSecret).toHaveBeenCalledWith('sk-ant-oat01-test');
      expect(core.setSecret.mock.invocationCallOrder[0]).toBeLessThan(
        core.setOutput.mock.invocationCallOrder[0]
      );
      expect(outputs).toStrictEqual({ credential: 'sk-ant-oat01-test' });
      expect(core.setFailed).not.toHaveBeenCalled();
    });

    it('sends the workspace only when one is configured', async () => {
      const { fetch } = await runTokenExchange({ env: { WORKSPACE_ID: 'wrkspc_test' } });
      expect(JSON.parse(fetch.mock.calls[0][1].body).workspace_id).toBe('wrkspc_test');
    });

    it('lets a stored key take precedence without requesting any token', async () => {
      const { outputs, core, fetch } = await runTokenExchange({ env: { HAS_API_KEY: 'true' } });
      expect(core.getIDToken).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
      expect(outputs).toStrictEqual({});
      expect(core.setFailed).not.toHaveBeenCalled();
    });

    it('fails the step, not the PR, when the configuration is incomplete', async () => {
      const { outputs, core, fetch } = await runTokenExchange({ env: { SERVICE_ACCOUNT_ID: '' } });
      expect(fetch).not.toHaveBeenCalled();
      expect(core.setFailed).toHaveBeenCalledTimes(1);
      expect(outputs).toStrictEqual({});
    });

    it('fails the step with the status, and no token, when the exchange is denied', async () => {
      const { outputs, core } = await runTokenExchange({
        response: { ok: false, status: 401, json: async () => ({}) },
      });
      expect(core.setFailed).toHaveBeenCalledWith(expect.stringContaining('HTTP 401'));
      expect(core.setFailed.mock.calls[0][0]).not.toContain('github-oidc-jwt');
      expect(core.setSecret).not.toHaveBeenCalled();
      expect(outputs).toStrictEqual({});
    });

    it('fails the step when the response has no access token', async () => {
      const { outputs, core } = await runTokenExchange({ response: { json: async () => ({}) } });
      expect(core.setFailed).toHaveBeenCalledWith(expect.stringContaining('no access token'));
      expect(outputs).toStrictEqual({});
    });
  });

  it('serialises runs per PR without cancelling commands', () => {
    expect(String(doc.concurrency.group)).toMatch(/^qodo-pr-agent-/);
    expect(doc.concurrency['cancel-in-progress']).toBe(false);
  });

  it('pins every other action by full SHA', () => {
    for (const step of allSteps(doc)) {
      const uses = String(step.uses || '');
      if (!uses || uses.startsWith('docker://') || uses.startsWith('./')) continue;
      expect(uses).toMatch(/@[a-f0-9]{40}$/);
    }
  });

  /**
   * T028 and contracts/reusable-workflow.md disagreed for a while: the task
   * text asked for the local `./.github/actions/collect-metrics` path behind an
   * `if: github.repository == 'lightspeedwp/.github'` gate, while the contract
   * requires the action to run in consuming repositories too. The contract is
   * authoritative and the shipped workflow follows it, so these assertions pin
   * that behaviour down, including the absence of the gate, so the two
   * documents cannot drift apart again.
   */
  describe('record job metrics action', () => {
    const metricsStep = (job) =>
      (doc.jobs[job]?.steps || []).find((step) =>
        String(step.uses || '').includes('collect-metrics')
      );

    it('calls the central action by owner, path and SHA so it needs no checkout', () => {
      const step = metricsStep('record');
      expect(step).toBeDefined();
      expect(step.uses).toMatch(
        /^lightspeedwp\/\.github\/\.github\/actions\/collect-metrics@[a-f0-9]{40}$/
      );
      expect(String(step.uses).startsWith('./')).toBe(false);
      // The SHA is literal, not an expression, so the reference cannot drift
      // with a branch name.
      expect(step.uses).not.toContain('${{');
    });

    it('carries the contracted metric identity and stays non-blocking', () => {
      const step = metricsStep('record');
      expect(step.with).toMatchObject({
        'workflow-name': 'qodo-pr-agent',
        'job-name': 'run',
        'metrics-file': 'qodo-pr-agent-metrics.json',
      });
      expect(step['continue-on-error']).toBe(true);
    });

    it('is not gated to this repository, so consuming repositories still record metrics', () => {
      // The gate this replaces would have skipped the step everywhere except
      // lightspeedwp/.github, which is the opposite of the contract's
      // requirement that it "works in consuming repositories too".
      const step = metricsStep('record');
      expect(step.if).toBeUndefined();
      expect(JSON.stringify(doc.jobs.record)).not.toContain(
        "github.repository == 'lightspeedwp/.github'"
      );
    });

    it('keeps T028 and the contract agreeing on the reference form', () => {
      const contract = fs.readFileSync(
        path.join(
          repoRoot,
          '.github/specs/019-qodo-pr-agent-integration/contracts/reusable-workflow.md'
        ),
        'utf8'
      );
      const tasks = fs.readFileSync(
        path.join(repoRoot, '.github/specs/019-qodo-pr-agent-integration/tasks.md'),
        'utf8'
      );
      const t028 = tasks.split('\n').find((line) => line.startsWith('- [X] T028'));

      expect(t028).toBeDefined();
      // Both documents must name the SHA-pinned cross-repository reference and
      // neither may still mandate the local path or the repository gate. Each
      // comparison carries the document's name, so a failure says which drifted.
      for (const [label, text] of [
        ['contract', contract],
        ['T028', t028],
      ]) {
        expect({
          document: label,
          namesCrossRepositoryReference: text.includes(
            'lightspeedwp/.github/.github/actions/collect-metrics'
          ),
          stillMandatesLocalPath: text.includes('./.github/actions/collect-metrics` with'),
          stillMandatesRepositoryGate: text.includes(
            "if: github.repository == 'lightspeedwp/.github'` and"
          ),
        }).toStrictEqual({
          document: label,
          namesCrossRepositoryReference: true,
          stillMandatesLocalPath: false,
          stillMandatesRepositoryGate: false,
        });
      }
      // The contract keeps ownership of the requirement.
      expect(contract).toContain('works in consuming repositories too');
    });
  });
});

describe('Qodo PR-Agent pilot caller workflow', () => {
  const { doc, raw } = caller;

  it('exists', () => {
    expect(raw.length).toBeGreaterThan(0);
  });

  it('triggers only on the contracted events', () => {
    expect(doc.on.pull_request.types).toStrictEqual(['opened', 'reopened', 'ready_for_review']);
    expect(doc.on.issue_comment.types).toStrictEqual(['created']);
    expect(doc.on.pull_request_target).toBeUndefined();
    expect(doc.on.push).toBeUndefined();
    expect(raw).not.toMatch(/synchronize/);
  });

  it('calls the local reusable workflow with the dedicated credential', () => {
    const jobs = Object.values(doc.jobs);
    expect(jobs).toHaveLength(1);
    const [job] = jobs;
    expect(job.uses).toBe('./.github/workflows/qodo-pr-agent-reusable.yml');
    expect(job.secrets.model_credential).toBe('${{ secrets.ANTHROPIC_API_KEY_QODO_PR_AGENT }}');
    expect(job.permissions).toStrictEqual({
      contents: 'read',
      'pull-requests': 'write',
      issues: 'write',
      'id-token': 'write',
    });
    expect(doc.permissions).toStrictEqual({ contents: 'read' });
  });

  it('passes the keyless federation identifiers from Actions variables, never secrets', () => {
    const [job] = Object.values(doc.jobs);
    expect(job.with).toStrictEqual({
      federation_rule_id: '${{ vars.QODO_PR_AGENT_FEDERATION_RULE_ID }}',
      organization_id: '${{ vars.ANTHROPIC_ORGANIZATION_ID }}',
      service_account_id: '${{ vars.QODO_PR_AGENT_SERVICE_ACCOUNT_ID }}',
      workspace_id: '${{ vars.QODO_PR_AGENT_WORKSPACE_ID }}',
    });
  });
});
