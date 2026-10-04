/**
 * Contract test for the Qodo PR-Agent workflows.
 *
 * Three files, split so that a pull request author cannot reach the model key:
 * the trigger holds the unprivileged half and publishes a hint, the pilot caller
 * is the privileged receiver, and the reusable workflow is the organisation
 * standard other repositories call.
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

// The model the run record must carry, read from the authority rather than
// restated, so this suite cannot drift from .pr_agent.toml. The drift guard in
// qodo-pr-agent-config.test.js checks the record literal itself.
const PRIMARY_MODEL = (() => {
  const toml = fs.readFileSync(path.join(repoRoot, '.pr_agent.toml'), 'utf8');
  const match = toml.match(/^model\s*=\s*"([^"]+)"/m);
  if (!match) throw new Error('could not read config.model from .pr_agent.toml');
  return match[1];
})();
const reusablePath = '.github/workflows/qodo-pr-agent-reusable.yml';
const callerPath = '.github/workflows/qodo-pr-agent.yml';
const triggerPath = '.github/workflows/qodo-pr-agent-trigger.yml';
const reportPath = '.github/workflows/qodo-pr-agent-report.yml';

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
const trigger = load(triggerPath);
const report = load(reportPath);

const ALLOWED_COMMANDS = [
  '/describe',
  '/improve',
  '/review',
  '/ask',
  '/update_changelog',
  '/add_docs',
  '/help',
];

// A same-repository, non-draft, human-authored pull request. The harness reads it
// only to derive environment variables, so a case may replace any branch of it.
const REPO = 'lightspeedwp/.github';
const PR_NUMBER = 42;
const PR_PAYLOAD = {
  sender: { type: 'User' },
  repository: { full_name: REPO },
  pull_request: {
    number: PR_NUMBER,
    draft: false,
    user: { login: 'maintainer' },
    head: { repo: { full_name: REPO } },
  },
};

/**
 * Gather steps from every job in a workflow.
 * @param {object} doc - Parsed workflow document.
 * @returns {object[]} Job steps in workflow order.
 */
function allSteps(doc) {
  return Object.values(doc.jobs || {}).flatMap((job) => job.steps || []);
}

/**
 * Find the step that writes the run record.
 * @param {object} doc - Parsed workflow document.
 * @returns {object} The record step.
 */
function qodoRecordStep(doc) {
  return allSteps(doc).find((step) => step.env && step.env.EVENT_AT);
}

/**
 * Find the step that runs the pinned PR-Agent container.
 *
 * The reusable standard invokes the image as a Docker container action. The pilot
 * receiver overrides the entry point with `docker run` and calls PR-Agent's CLI,
 * so both shapes count and neither is assumed.
 * @param {object} doc - Parsed workflow document.
 * @returns {object|undefined} Container step, if present.
 */
function qodoStep(doc) {
  return allSteps(doc).find(
    (step) =>
      String(step.uses || '').startsWith('docker://pragent/pr-agent') ||
      /pragent\/pr-agent@sha256:[a-f0-9]{64}/.test(String(step.run || ''))
  );
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
 * Read one step's script by its step id.
 * @param {object} doc - Parsed workflow document.
 * @param {string} jobName - Job that holds the step.
 * @param {string} stepId - Step id declared on the step.
 * @returns {string} The github-script body, or the run body.
 */
function stepScript(doc, jobName, stepId) {
  const step = (doc.jobs?.[jobName]?.steps || []).find((candidate) => candidate.id === stepId);
  return String(step?.with?.script || step?.run || '');
}

/**
 * List the jobs whose definition mentions a token, in workflow order.
 * @param {object} doc - Parsed workflow document.
 * @param {string} token - Text to look for.
 * @returns {string[]} Job names that mention the token.
 */
function jobsMentioning(doc, token) {
  return Object.entries(doc.jobs || {})
    .filter(([, job]) => JSON.stringify(job).includes(token))
    .map(([name]) => name);
}

/**
 * Build the environment the reusable preflight's verify step reads.
 *
 * The step is env-driven on purpose: it runs in a job with no environment, in a
 * workflow whose definition came from the default branch, so the caller's request
 * may only reach it as values. The command token is therefore derived here the
 * way the trigger workflow's classify step derives it, and nothing else about the
 * event is carried across.
 * @param {object} [options] - Event, payload and explicit environment overrides.
 * @param {string} [options.eventName] - GitHub event name the caller ran on.
 * @param {object} [options.payload] - Event payload of that run.
 * @param {object} [options.env] - Variables that replace the derived ones.
 * @returns {object} Environment for the verify step.
 */
function preflightEnv({ eventName = 'pull_request', payload = PR_PAYLOAD, env = {} } = {}) {
  const comment = payload.comment || {};
  const token = String(comment.body || '')
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();
  return {
    KILL_SWITCH: 'true',
    // A caller that already refused hands its reason over and it is not
    // reinterpreted here.
    CALLER_REASON: 'ok',
    // Read in a job with no environment, so a value here can only have come from
    // repository scope. Absent in a correctly wired pilot.
    HAS_REPO_SECRET: 'false',
    HAS_CREDENTIAL: 'false',
    PR_NUMBER: String(payload.pull_request?.number ?? payload.issue?.number ?? PR_NUMBER),
    COMMAND: token.length >= 2 && token.startsWith('/') ? token : '',
    EXCLUDED_AUTHORS: '["dependabot[bot]","lightspeed-docs-bot[bot]"]',
    PAYLOAD_SENDER: payload.sender?.type || 'User',
    PAYLOAD_DRAFT: String(Boolean(payload.pull_request?.draft)),
    PAYLOAD_HEAD_REPO:
      eventName === 'pull_request' ? payload.pull_request?.head?.repo?.full_name || '' : '',
    PAYLOAD_REPO: payload.repository?.full_name || REPO,
    PAYLOAD_BODY: comment.body || '',
    PAYLOAD_ASSOCIATION: comment.author_association || '',
    PAYLOAD_ISSUE_STATE: payload.issue?.state || '',
    ...env,
  };
}

/**
 * Execute the reusable preflight's verify step with a synthetic event.
 *
 * Only the verify step runs here. Its sibling, the confirm step, awaits the
 * GitHub API and is asserted structurally in the API-confirming guard block.
 * @param {object} [options] - Event, payload and environment overrides.
 * @param {string} [options.eventName] - GitHub event name.
 * @param {object} [options.payload] - Event payload; a fixture is used when absent.
 * @param {object} [options.env] - Variables that replace the derived ones.
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
  vm.runInNewContext(
    stepScript(reusable.doc, 'preflight', 'verify'),
    { process: { env: preflightEnv({ eventName, payload, env }) }, core },
    { timeout: 1000 }
  );
  return { outputs, core };
}

/**
 * Execute the trigger workflow's classify step with a synthetic event.
 * @param {object} [options] - Event, payload and environment overrides.
 * @param {string} [options.eventName] - GitHub event name.
 * @param {object} [options.payload] - Event payload; a fixture is used when absent.
 * @param {object} [options.env] - Variables that replace the derived ones.
 * @returns {object} Captured outputs and Actions core mock.
 */
function runTriggerClassify({ eventName = 'pull_request', payload, env = {} } = {}) {
  const outputs = {};
  const core = {
    setOutput: jest.fn((key, value) => {
      outputs[key] = value;
    }),
    notice: jest.fn(),
    warning: jest.fn(),
  };
  vm.runInNewContext(
    stepScript(trigger.doc, 'signal', 'classify'),
    {
      context: { eventName, payload: payload || PR_PAYLOAD },
      process: { env: { KILL_SWITCH: 'true', ...env } },
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
    expect(Object.keys(call.inputs).sort()).toStrictEqual([
      'auto_describe',
      'auto_improve',
      'command',
      'comment_id',
      'decision_reason',
      'environment_name',
      'excluded_authors',
      'pr_number',
    ]);
    // `config_ref` is gone with it: PR-Agent's --config-branch indirection would
    // let the ref that names the config come from the caller, and with it a
    // repository's own .pr_agent.toml. The run job holds a constant instead.
    expect(call.inputs.config_ref).toBeUndefined();
    expect(call.inputs.auto_describe.default).toBe(true);
    expect(call.inputs.auto_improve.default).toBe(true);
    expect(call.inputs.pr_number.required).toBe(true);
    expect(call.inputs.command.default).toBe('');
    expect(call.inputs.decision_reason.default).toBe('ok');
    // The name of the Environment holding the credential is an input, so a
    // repository that provisions its own Environment can use this definition.
    expect(call.inputs.environment_name.default).toBe('qodo-pr-agent');
    expect(JSON.parse(call.inputs.excluded_authors.default)).toStrictEqual([
      'dependabot[bot]',
      'lightspeed-docs-bot[bot]',
    ]);
    expect(call.inputs.auto_review).toBeUndefined();
    expect(call.secrets.model_credential.required).toBe(false);
    // Workload Identity Federation is deliberately not part of the pilot: no
    // federation input may reappear, because each one needs `id-token: write`
    // on the job that runs the third-party container.
    for (const input of [
      'federation_rule_id',
      'organization_id',
      'service_account_id',
      'workspace_id',
    ]) {
      expect(call.inputs[input]).toBeUndefined();
    }
  });

  it('uses least-privilege permissions', () => {
    expect(doc.permissions).toStrictEqual({ contents: 'read' });
    // confirm calls pulls.get and issues.getComment; a token with no permissions
    // cannot read them in a private repository. Read only, nothing writes.
    expect(doc.jobs.preflight.permissions).toStrictEqual({ 'pull-requests': 'read' });
    // Three minutes, because the confirm step makes two API calls after the
    // env-driven one. Two was enough for a single script.
    expect(doc.jobs.preflight['timeout-minutes']).toBe(3);
    expect(doc.jobs.run.permissions).toStrictEqual({
      contents: 'read',
      'pull-requests': 'write',
      issues: 'write',
    });
    expect(doc.jobs.run['timeout-minutes']).toBe(15);
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
    // Either invocation form, but never a floating tag: the digest is the pin.
    const reference = step.uses || String(step.run);
    expect(reference).toMatch(/pragent\/pr-agent@sha256:[a-f0-9]{64}/);
    expect(reference).not.toMatch(/pragent\/pr-agent:(latest|v?\d)/);
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
    // `no-credential` is gone from the enum: the credential is an Environment
    // secret, so a missing one is a deployment-policy failure that stops the run
    // job rather than a skip. The record still maps any other reason verbatim.
    ['credential-not-environment-scoped', 'skipped', 'skipped:credential-not-environment-scoped'],
    // A preflight job that errors leaves every output empty. Interpolating that
    // straight into the outcome produced `skipped:` — a value outside the declared
    // `skipped:<reason>` enum, which the pilot report then listed as its own row.
    ['', 'skipped', 'skipped:preflight-error'],
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
        model: PRIMARY_MODEL,
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
    expect(env['ANTHROPIC.KEY']).toContain('secrets.model_credential');
    expect(env.GITHUB_TOKEN).toContain('secrets.GITHUB_TOKEN');
    // A constant, not `inputs.config_ref`: an expression here would hand the ref
    // that names the config to whoever controls the call, and PR-Agent would then
    // read that ref's .pr_agent.toml. The CLI reads this name, not the action
    // runner's CONFIG.EXTRA_CONFIG_URL.
    expect(env.PR_AGENT_EXTRA_CONFIG_URL).toBe(
      'https://raw.githubusercontent.com/lightspeedwp/.github/develop/.pr_agent.toml'
    );
    expect(env.PR_AGENT_EXTRA_CONFIG_URL).not.toMatch(/\$\{\{/);
    // Which tool to run is passed explicitly, so the action runner's trigger-policy
    // settings are gone rather than inert.
    const keys = Object.keys(env);
    expect(keys.filter((key) => key.startsWith('github_action_config'))).toStrictEqual([]);
    expect(env.QODO_PR).toContain('pr_number');
    expect(env.QODO_TOOL).toContain('needs.preflight.outputs.tool');
    // The automatic path is still the consumer's choice, and it cannot be widened.
    expect(env.QODO_AUTO_DESCRIBE).toContain('inputs.auto_describe');
    expect(env.QODO_AUTO_IMPROVE).toContain('inputs.auto_improve');
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

    // The step reads the caller's request, never the event. Pinned so a future
    // edit cannot reintroduce a `context.payload` read, which under workflow_run
    // is a hint the same repository's pull request author wrote.
    it('reads its request from the environment only', () => {
      expect(stepScript(doc, 'preflight', 'verify')).not.toMatch(/context\.|github\.event/);
    });

    it('enables a non-draft human PR from a same-repository head', () => {
      const { outputs, core } = runPreflight();
      // The tool is `none` on the automatic path, not `auto`: this step
      // sanitises its own output to an allow-listed command id, and `auto` is
      // reserved. Only the confirm step, which has re-read the pull request
      // through the API, may write it, and the job output prefers that verdict.
      expect(outputs).toStrictEqual({ enabled: 'true', reason: 'ok', tool: 'none' });
      expect(core.notice).not.toHaveBeenCalled();
    });

    it.each([
      ['kill-switch', { env: { KILL_SWITCH: 'FALSE' } }, 'none'],
      ['kill-switch', { env: { KILL_SWITCH: '' } }, 'none'],
      ['kill-switch', { env: { KILL_SWITCH: 'yes' } }, 'none'],
      ['bot-sender', { payload: { sender: { type: 'Bot' } } }, 'none'],
      ['draft', { payload: { pull_request: { draft: true } } }, 'none'],
      // A caller that already refused passes its own reason along rather than
      // having it reinterpreted here, so the report names the trigger's verdict.
      ['caller-refused', { env: { CALLER_REASON: 'draft' } }, 'none'],
      // Replaces the old `no-credential` row. A repository-scoped credential is
      // no longer a skip condition but the CWE-200 misconfiguration itself: this
      // job holds no environment, so a readable secret can only be repository
      // scope. A missing Environment secret is a hard failure in the run job
      // instead, so it is not a reason here.
      ['credential-not-environment-scoped', { env: { HAS_REPO_SECRET: 'true' } }, 'none'],
      // PR-event skips are automatic attempts ('auto'), so the report can count
      // them against SC-001.
      [
        'fork',
        {
          payload: {
            repository: { full_name: REPO },
            pull_request: {
              draft: false,
              user: { login: 'maintainer' },
              head: { repo: { full_name: 'someone/.github' } },
            },
          },
        },
        'none',
      ],
    ])('skips a PR on %s without failing the check', (reason, overrides, tool) => {
      const { outputs, core } = runPreflight({
        ...overrides,
        payload: { ...PR_PAYLOAD, ...(overrides.payload || {}) },
      });
      expect(outputs).toStrictEqual({ enabled: 'false', reason, tool });
      expect(core.notice).toHaveBeenCalledWith(`Qodo PR-Agent skipped: ${reason}`);
    });

    it('runs a same-repository PR whose head repository matches', () => {
      const { outputs } = runPreflight({
        payload: {
          sender: { type: 'User' },
          repository: { full_name: REPO },
          pull_request: {
            draft: false,
            user: { login: 'maintainer' },
            head: { repo: { full_name: REPO } },
          },
        },
      });
      expect(outputs).toStrictEqual({ enabled: 'true', reason: 'ok', tool: 'none' });
    });

    // The old payload-driven fork test was fail-closed: a deleted fork leaves
    // head.repo null, and a null or missing head repository was a fork. The
    // verify step no longer decides fork status from the caller's payload, because
    // that payload is a hint rather than authority; it refuses only a head
    // repository that contradicts the base. The fail-closed test now lives in the
    // confirm step, which compares head against base after re-reading the pull
    // request, and it is asserted in the API-confirming guard block.
    it.each([
      ['a null head repository', { head: { repo: null } }],
      ['a missing head key', {}],
      ['an undefined head repository', { head: { repo: undefined } }],
    ])('defers %s to the API-confirming step', (_label, override) => {
      const { outputs } = runPreflight({
        payload: { ...PR_PAYLOAD, pull_request: { ...PR_PAYLOAD.pull_request, ...override } },
      });
      expect(outputs).toStrictEqual({ enabled: 'true', reason: 'ok', tool: 'none' });
    });

    it('treats the stored key as the only credential', () => {
      const verifyStep = doc.jobs.preflight.steps.find((step) => step.id === 'verify');
      const expression = String(verifyStep.env.HAS_CREDENTIAL);
      expect(expression).toBe("${{ secrets.model_credential != '' }}");
    });

    // Replaces the old malformed-`excluded_authors` warning. The exclusion list
    // is now a constant in the steps that can see the author, so a caller can
    // neither widen the list nor break the guard with a malformed value.
    // The input ADDS to the defaults rather than replacing them, so a malformed
    // or absent value cannot silently re-admit a bot author.
    // The verify step is env-driven, so the reusable's closed-pull-request case
    // arrives as PAYLOAD_ISSUE_STATE rather than in the event context. The
    // API-confirming step then re-checks it authoritatively via pull.state.
    it('skips a command on a closed or merged pull request', () => {
      const { outputs } = runPreflight({
        eventName: 'issue_comment',
        payload: {
          sender: { type: 'User' },
          issue: { pull_request: {} },
          comment: { body: '/review', author_association: 'OWNER' },
        },
        env: { PAYLOAD_ISSUE_STATE: 'closed' },
      });
      expect(outputs).toStrictEqual({ enabled: 'false', reason: 'pr-closed', tool: 'review' });
    });

    it('keeps the default excluded authors when the input is malformed', () => {
      const { outputs, core } = runPreflight({ env: { EXCLUDED_AUTHORS: '[invalid' } });
      expect(outputs).toStrictEqual({ enabled: 'true', reason: 'ok', tool: 'none' });
      expect(core.warning).not.toHaveBeenCalled();
      // The verify step is env-driven and does no author filtering of its own.
      expect(stepScript(doc, 'preflight', 'verify')).not.toContain('EXCLUDED_AUTHORS');
      const confirm = stepScript(doc, 'preflight', 'confirm');
      expect(confirm).toContain(
        "const DEFAULT_EXCLUDED = ['dependabot[bot]', 'lightspeed-docs-bot[bot]']"
      );
      // The defaults are spread in first, so the union keeps them.
      expect(confirm).toContain('[...DEFAULT_EXCLUDED, ...extra.filter');
      // Both fallbacks yield the defaults rather than an empty list: a
      // non-array JSON value, and a parse failure.
      expect(confirm.match(/(?:return|:) DEFAULT_EXCLUDED;/g)).toHaveLength(2);
      expect(confirm).toContain("core.warning('excluded_authors is not valid JSON");
    });

    it('lets a valid excluded_authors input add an author', () => {
      const confirm = stepScript(doc, 'preflight', 'confirm');
      expect(confirm).toContain('JSON.parse(process.env.EXCLUDED_AUTHORS');
      expect(confirm).toContain('EXCLUDED.includes(pull.user?.login)');
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

    // Only two of the four reasons this step used to produce survive here. The
    // other two, `not-a-pr` and `not-a-command`, are decided by the trigger's
    // classify step, because the receiver only ever sees a request the trigger
    // published; both are asserted in the trigger workflow block.
    it.each([
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
      expect(core.notice).toHaveBeenCalledWith(`Qodo PR-Agent skipped: ${reason}`);
    });

    // The comment body is untrusted input. These pin the boundaries that stop a
    // refused request writing an unrecognised or reserved value into the report.
    // A one-character token is not among them: the trigger refuses `/` and
    // `  /  extra` as `not-a-command` before publishing anything, so this step
    // never sees a command token that is not on the allow-list. Both are asserted
    // in the trigger workflow block.
    it.each([
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
        'command-not-allowed',
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

    it('still accepts a question that mentions a flag without a value', () => {
      const { outputs } = runPreflight({
        eventName: 'issue_comment',
        payload: {
          issue: { pull_request: {} },
          comment: {
            id: 7788,
            body: '/ask What does --verbose do here?',
            author_association: 'OWNER',
          },
        },
      });
      expect(outputs).toStrictEqual({ enabled: 'true', reason: 'ok', tool: 'ask' });
    });

    it.each(['OWNER', 'MEMBER', 'COLLABORATOR'])(
      'accepts a command from %s on a fork PR in the base repository context',
      (association) => {
        const { outputs, core } = runPreflight({
          eventName: 'issue_comment',
          payload: {
            sender: { type: 'User' },
            repository: { full_name: REPO },
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

    // An association this step was given and does not recognise stops the run
    // here. A missing one cannot: the caller's payload is a hint, so the verdict
    // belongs to the confirm step, which re-reads the comment and requires the
    // association to be in the allow list.
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
        const expected =
          association === undefined
            ? { enabled: 'true', reason: 'ok', tool: 'review' }
            : { enabled: 'false', reason: 'author-not-allowed', tool: 'review' };
        expect(outputs).toStrictEqual(expected);
        if (association !== undefined) {
          expect(core.notice).toHaveBeenCalledWith('Qodo PR-Agent skipped: author-not-allowed');
        }
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
  });

  // The confirm step awaits the GitHub API, so the vm harness cannot run it. Its
  // structure is what matters: it is the second, independent gate, and it must
  // re-derive every eligibility fact the caller's hint claimed.
  describe('API-confirming guard', () => {
    const script = stepScript(doc, 'preflight', 'confirm');
    const step = doc.jobs.preflight.steps.find((candidate) => candidate.id === 'confirm');

    it('runs only when the env-driven step enabled the request', () => {
      expect(step.if).toBe("steps.verify.outputs.enabled == 'true'");
      // The confirm verdict wins wherever it exists, so a skip is attributed to
      // the reason the API gave rather than to the hint's.
      for (const name of ['enabled', 'reason', 'tool']) {
        expect(doc.jobs.preflight.outputs[name]).toBe(
          '${{ steps.confirm.outputs.' + name + ' || steps.verify.outputs.' + name + ' }}'
        );
      }
    });

    it('re-reads the pull request and re-checks draft, author and fork status', () => {
      expect(script).toContain('github.rest.pulls.get');
      expect(script).toContain("if (pull.state !== 'open') return refuse('pr-not-open')");
      expect(script).toContain("if (pull.draft) return refuse('draft')");
      expect(script).toContain(
        "if (EXCLUDED.includes(pull.user?.login)) return refuse('excluded-author')"
      );
      // Fail-closed: only an identical head and base is same-repository, so a
      // deleted fork, whose head repository is null, is a fork.
      expect(script).toContain('pull.head?.repo?.full_name !== pull.base?.repo?.full_name');
    });

    it('re-validates the command against the allow-list', () => {
      for (const command of ALLOWED_COMMANDS) {
        expect(script).toContain(`'${command}'`);
      }
      expect(script).toContain(
        "if (!ALLOWED_COMMANDS.includes(command)) return refuse('command-not-allowed')"
      );
    });

    it('re-reads the comments and re-checks the author association', () => {
      // Bound to the exact comment the caller named, never the newest match.
      expect(script).toContain('github.rest.issues.getComment');
      expect(script).toContain('comment_id');
      expect(script).not.toContain('github.paginate(github.rest.issues.listComments');
      // An unresolvable id is refused rather than falling back to a search.
      expect(script).toContain("return refuse('unreadable-request')");
      expect(script).toContain("return refuse('no-matching-comment')");
      // A comment on another pull request, or whose command word differs, is refused
      // rather than followed.
      expect(script).toContain("return refuse('comment-not-on-this-pull-request')");
      expect(script).toContain('match.author_association');
      expect(script).toContain("return refuse('author-not-allowed', command.slice(1))");
    });

    // PR-Agent applies a later `--section.key=value` token as a setting after the
    // environment, which would override the locked keys, so the arguments of the
    // re-read comment are refused as well as its command.
    it('refuses setting arguments in the re-read comment', () => {
      expect(script).toContain("return refuse('arguments-not-allowed', command.slice(1))");
      expect(script).toMatch(/a\.startsWith\('--'\) && a\.includes\('='\)/);
      // A joined argument starting with '-' is a setting to PR-Agent even when its
      // '=' sits in a later word, so the per-word check alone is not enough.
      expect(script).toContain(
        "if (args.startsWith('-')) return refuse('arguments-not-allowed', command.slice(1))"
      );
    });

    // /ask has no question without the trailing text, so the shared standard has to
    // carry it from the re-read comment to the CLI, as the pilot receiver does.
    it('passes the validated trailing text to the tool as one argument', () => {
      expect(script).toContain("core.setOutput('args', args)");
      expect(reusable.doc.jobs.preflight.outputs.args).toBe('${{ steps.confirm.outputs.args }}');
      const qodo = reusable.doc.jobs.run.steps.find((s) => s.id === 'qodo');
      expect(qodo.env.QODO_ARGS).toBe('${{ needs.preflight.outputs.args }}');
      expect(qodo.run).toContain('run_tool "$QODO_TOOL" "$QODO_ARGS"');
    });

    it('cannot reach the credential or the event from this step', () => {
      expect(JSON.stringify(step)).not.toContain('secrets.');
      // Only `context.repo` is read, for the API owner and name. No event data
      // reaches this step, so a forged hint cannot steer it.
      expect(script).not.toMatch(/context\.payload|github\.event/);
    });
  });

  describe('environment-gated credential', () => {
    it('declares the environment on the job that reads the key', () => {
      expect(doc.jobs.run.environment).toBe("${{ inputs.environment_name || 'qodo-pr-agent' }}");
    });

    it('hands the key to a step only from that job', () => {
      // preflight references the name twice, both as a `!= ''` probe in a job with
      // no environment: that is how a repository-scoped copy is caught, and the
      // value never reaches a step.
      expect(doc.jobs.preflight.environment).toBeUndefined();
      const references =
        JSON.stringify(doc.jobs.preflight).match(/secrets\.model_credential[^}]*/g) || [];
      for (const reference of references) {
        expect(reference.trim()).toBe("secrets.model_credential != ''");
      }
      expect(jobsMentioning(doc, 'secrets.model_credential }}')).toStrictEqual(['run']);
    });

    // Replaces the old `no-credential` skip. The credential is an Environment
    // secret, so a missing one means the deployment branch policy refused this
    // ref. That must stop the run rather than quietly skip it, because a skipped
    // run looks identical to a pull request that was never eligible.
    it('fails closed when the Environment did not release the key', () => {
      const step = doc.jobs.run.steps.find((candidate) =>
        String(candidate.name || '').startsWith('Fail closed')
      );
      expect(step.env.HAS_CREDENTIAL).toBe("${{ secrets.model_credential != '' }}");
      const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qodo-credential-test-'));
      try {
        const run = (credential) =>
          spawnSync('bash', ['-e', '-c', step.run], {
            cwd: directory,
            encoding: 'utf8',
            timeout: 10000,
            env: {
              ...process.env,
              HAS_CREDENTIAL: credential,
              GITHUB_REF: 'refs/pull/3532/merge',
            },
          });
        const released = run('true');
        expect(released.status).toBe(0);
        const withheld = run('false');
        expect({
          status: withheld.status,
          namesTheEnvironment: withheld.stdout.includes(
            '::error::The qodo-pr-agent Environment did not release model_credential.'
          ),
          namesTheRef: withheld.stdout.includes('refs/pull/3532/merge'),
        }).toStrictEqual({ status: 1, namesTheEnvironment: true, namesTheRef: true });
      } finally {
        fs.rmSync(directory, { recursive: true, force: true });
      }
    });
  });

  it('serialises runs per PR without cancelling commands', () => {
    // Only runs preflight enabled may enter the group: at workflow level every
    // comment would join it, and GitHub cancels the older pending run.
    expect(doc.concurrency).toBeUndefined();
    expect(doc.jobs.preflight.concurrency).toBeUndefined();
    expect(String(doc.jobs.run.concurrency.group)).toMatch(/^qodo-pr-agent-/);
    expect(doc.jobs.run.concurrency['cancel-in-progress']).toBe(false);
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

describe('Qodo PR-Agent trigger workflow', () => {
  const { doc, raw } = trigger;

  it('exists', () => {
    expect(raw.length).toBeGreaterThan(0);
  });

  // The whole split rests on this file being unable to see the key. Structural
  // rather than a text search: the comments explain at length why it must stay
  // unprivileged, so what matters is the definition GitHub reads.
  it('holds no secret and grants no write scope', () => {
    expect(JSON.stringify(doc)).not.toContain('secrets');
    expect(doc.permissions).toStrictEqual({ contents: 'read' });
    for (const [name, job] of Object.entries(doc.jobs)) {
      expect({ job: name, permissions: job.permissions }).toStrictEqual({
        job: name,
        permissions: {},
      });
    }
    for (const scope of [doc, ...Object.values(doc.jobs)]) {
      for (const [scopeName, value] of Object.entries(scope.permissions || {})) {
        expect({ scope: scopeName, value }).not.toBe('write');
      }
    }
  });

  it('classifies the event with no environment of its own', () => {
    const step = doc.jobs.signal.steps.find((candidate) => candidate.id === 'classify');
    expect(step.uses).toMatch(/^actions\/github-script@[a-f0-9]{40}$/);
    expect(Object.keys(step.env)).toStrictEqual(['KILL_SWITCH']);
    expect(doc.jobs.signal.environment).toBeUndefined();
  });

  // The hint is a request, not an authority: it is written from step outputs only,
  // so a pull request author who edits this file can put no field of their own
  // into it, and both receivers re-derive eligibility from the API.
  it('publishes a request hint that is only a request', () => {
    const publish = doc.jobs.signal.steps.find((candidate) =>
      String(candidate.name || '').startsWith('Publish the decision')
    );
    expect(publish.if).toBe("steps.classify.outputs.analyse == 'true'");
    expect(publish.run).toContain('--argjson pr "$PR_NUMBER"');
    expect(publish.env).toStrictEqual({
      PR_NUMBER: '${{ steps.classify.outputs.pr }}',
      COMMAND: '${{ steps.classify.outputs.command }}',
      COMMENT_ID: '${{ steps.classify.outputs.comment_id }}',
      REASON: '${{ steps.classify.outputs.reason }}',
    });
    expect(publish.run).not.toMatch(/github\.event|event_name|head_ref/);
    const upload = doc.jobs.signal.steps.find(
      (candidate) => candidate.with?.name === 'qodo-pr-agent-signal'
    );
    expect(upload.if).toBe("steps.classify.outputs.analyse == 'true'");
    expect(upload.with['if-no-files-found']).toBe('error');
  });

  it('triggers only on the contracted events', () => {
    expect(doc.on.pull_request.types).toStrictEqual(['opened', 'reopened', 'ready_for_review']);
    expect(doc.on.issue_comment.types).toStrictEqual(['created']);
    expect(doc.on.pull_request_target).toBeUndefined();
    expect(doc.on.push).toBeUndefined();
    expect(raw).not.toMatch(/synchronize/);
  });

  // These verdicts live here and nowhere else now. The receivers only ever see a
  // request this step published, so a comment that is not an allow-listed command
  // on a pull request never reaches them at all.
  describe('classify step', () => {
    it('enables a non-draft human PR and names its number', () => {
      const { outputs } = runTriggerClassify();
      expect(outputs).toStrictEqual({
        analyse: 'true',
        reason: 'ok',
        pr: String(PR_NUMBER),
        command: '',
        comment_id: '',
      });
    });

    it.each([
      ['the kill-switch', 'kill-switch', { env: { KILL_SWITCH: 'false' } }],
      ['a bot sender', 'bot-sender', { payload: { sender: { type: 'Bot' } } }],
      [
        'a draft pull request',
        'draft',
        { payload: { pull_request: { ...PR_PAYLOAD.pull_request, draft: true } } },
      ],
      [
        'an excluded author',
        'excluded-author',
        {
          payload: {
            pull_request: { ...PR_PAYLOAD.pull_request, user: { login: 'dependabot[bot]' } },
          },
        },
      ],
      [
        'a fork head',
        'fork',
        {
          payload: {
            pull_request: {
              ...PR_PAYLOAD.pull_request,
              head: { repo: { full_name: 'someone/.github' } },
            },
          },
        },
      ],
      [
        'a deleted fork',
        'fork',
        { payload: { pull_request: { ...PR_PAYLOAD.pull_request, head: { repo: null } } } },
      ],
    ])('refuses a pull request from %s', (_label, reason, overrides) => {
      const { outputs, core } = runTriggerClassify({
        ...overrides,
        payload: { ...PR_PAYLOAD, ...(overrides.payload || {}) },
      });
      expect(outputs).toStrictEqual({
        analyse: 'false',
        reason,
        pr: '',
        command: '',
        comment_id: '',
      });
      expect(core.notice).toHaveBeenCalledWith(`Qodo PR-Agent not requested: ${reason}`);
    });

    it.each([
      [
        'not-a-pr',
        { issue: { number: PR_NUMBER }, comment: { body: '/review', author_association: 'OWNER' } },
      ],
      [
        'not-a-command',
        {
          issue: { pull_request: {} },
          comment: { body: 'ordinary comment', author_association: 'OWNER' },
        },
      ],
    ])('refuses an issue comment with reason %s and publishes no request', (reason, payload) => {
      const { outputs, core } = runTriggerClassify({ eventName: 'issue_comment', payload });
      expect(outputs).toStrictEqual({
        analyse: 'false',
        reason,
        pr: '',
        command: '',
        comment_id: '',
      });
      expect(core.notice).toHaveBeenCalledTimes(reason === 'not-a-command' ? 0 : 1);
    });

    // A one-character token is not a command. The receivers only ever see
    // allow-listed commands, so this refusal happens before anything is published.
    it.each(['/', '  /  extra'])('refuses the bare token %j as not-a-command', (body) => {
      const { outputs, core } = runTriggerClassify({
        eventName: 'issue_comment',
        payload: {
          issue: { pull_request: {} },
          comment: { body, author_association: 'OWNER' },
        },
      });
      expect(outputs).toStrictEqual({
        analyse: 'false',
        reason: 'not-a-command',
        pr: '',
        command: '',
        comment_id: '',
      });
      expect(core.notice).not.toHaveBeenCalled();
    });

    it.each(['/generate_labels', '/reviewer', '/review;echo'])(
      'refuses the non-allow-listed command %s',
      (body) => {
        const { outputs, core } = runTriggerClassify({
          eventName: 'issue_comment',
          payload: {
            issue: { pull_request: {} },
            comment: { body, author_association: 'OWNER' },
          },
        });
        expect(outputs).toStrictEqual({
          analyse: 'false',
          reason: 'command-not-allowed',
          pr: '',
          command: '',
          comment_id: '',
        });
        expect(core.notice).toHaveBeenCalledWith(
          'Qodo PR-Agent not requested: command-not-allowed'
        );
      }
    );

    it('refuses a command from an unauthorised commenter without publishing it', () => {
      const { outputs, core } = runTriggerClassify({
        eventName: 'issue_comment',
        payload: {
          issue: { pull_request: {} },
          comment: { body: '/review', author_association: 'CONTRIBUTOR' },
        },
      });
      expect(outputs).toStrictEqual({
        analyse: 'false',
        reason: 'author-not-allowed',
        pr: '',
        command: '',
        comment_id: '',
      });
      expect(core.notice).toHaveBeenCalledWith('Qodo PR-Agent not requested: author-not-allowed');
    });

    // PR-Agent applies a later `--section.key=value` token as a setting after the
    // environment, which would override the locked keys, so the untrusted body is
    // refused here as well as in both receivers.
    it.each([
      '/review --config.model=gpt-4o',
      '/ask why? --pr_description.publish_description_as_comment=false',
      '/describe\n--config.response_language=fr',
      // Split fragments: no single word is --x=y, but the receiver joins the rest
      // into one argument, which PR-Agent then reads as a setting.
      '/ask --config.model =other-model',
      '/ask --config.model = other-model',
    ])('refuses setting arguments in %j', (body) => {
      const { outputs, core } = runTriggerClassify({
        eventName: 'issue_comment',
        payload: {
          issue: { pull_request: { number: PR_NUMBER } },
          comment: { body, author_association: 'OWNER' },
        },
      });
      expect(outputs).toStrictEqual({
        analyse: 'false',
        reason: 'arguments-not-allowed',
        pr: '',
        command: '',
        comment_id: '',
      });
      expect(core.notice).toHaveBeenCalledWith(
        'Qodo PR-Agent not requested: arguments-not-allowed'
      );
    });

    it('accepts a question that mentions a flag without a value', () => {
      const { outputs } = runTriggerClassify({
        eventName: 'issue_comment',
        payload: {
          issue: { pull_request: {}, number: PR_NUMBER },
          comment: {
            id: 7788,
            body: '/ask What does --verbose do here?',
            author_association: 'OWNER',
          },
        },
      });
      expect(outputs).toStrictEqual({
        analyse: 'true',
        reason: 'ok',
        pr: String(PR_NUMBER),
        command: '/ask',
        comment_id: '7788',
      });
    });

    it('skips a command on a closed or merged pull request', () => {
      const { outputs } = runTriggerClassify({
        eventName: 'issue_comment',
        payload: {
          sender: { type: 'User' },
          issue: { pull_request: {}, state: 'closed' },
          comment: { body: '/review', author_association: 'OWNER' },
        },
      });
      expect(outputs).toStrictEqual({
        analyse: 'false',
        reason: 'pr-closed',
        pr: '',
        command: '',
        comment_id: '',
      });
    });

    it.each(['', '  ', 'Please /review this PR', '> /review'])(
      'ignores an ordinary comment without emitting a skip notice: %j',
      (body) => {
        const { outputs, core } = runTriggerClassify({
          eventName: 'issue_comment',
          payload: {
            issue: { pull_request: {} },
            comment: { body, author_association: 'OWNER' },
          },
        });
        expect(outputs).toStrictEqual({
          analyse: 'false',
          reason: 'not-a-command',
          pr: '',
          command: '',
          comment_id: '',
        });
        expect(core.notice).not.toHaveBeenCalled();
      }
    );

    it('refuses an unsupported event rather than publishing a request', () => {
      const { outputs } = runTriggerClassify({ eventName: 'push' });
      expect(outputs).toStrictEqual({
        analyse: 'false',
        reason: 'unsupported-event',
        pr: '',
        command: '',
        comment_id: '',
      });
    });
  });
});

/**
 * Execute the reusable standard's API-confirming step with a synthetic event.
 *
 * The pilot receiver has a harness for its own preflight; this is the equivalent
 * for the step that re-derives eligibility for every other repository that adopts
 * the standard. A string assertion on this step would pass against a broken
 * implementation, which is how the argument-injection guard survived review
 * untested in both halves.
 * @param {object} [options] - Command, comment list and pull request overrides.
 * @param {string} [options.command] - The command input.
 * @param {Array} [options.comments] - Comments listComments returns, oldest first.
 * @param {object} [options.pullRequest] - Pull request pulls.get returns.
 * @param {object} [options.requestedTool] - The verify step's tool output.
 * @param {object} [options.env] - Variables that replace the derived ones.
 * @returns {Promise<object>} The decision: outputs and whether the run was refused.
 */
async function runReusableConfirm({
  command = '',
  comments = [],
  pullRequest = {
    number: PR_NUMBER,
    state: 'open',
    draft: false,
    merged: false,
    user: { login: 'maintainer' },
    head: { repo: { full_name: REPO } },
    base: { repo: { full_name: REPO } },
  },
  requestedTool = 'auto',
  env = {},
} = {}) {
  const outputs = {};
  const core = {
    setOutput: jest.fn((key, value) => {
      outputs[key] = value;
    }),
    notice: jest.fn(),
    warning: jest.fn(),
  };
  const github = {
    rest: {
      pulls: { get: jest.fn(async () => ({ data: pullRequest })) },
      // Present because the step names it in the call; paginate is the mock that
      // decides what it returns.
      issues: {
        listComments: jest.fn(),
        getComment: jest.fn(async ({ comment_id: id }) => {
          const found = comments.find((c) => Number(c.id) === Number(id));
          if (!found) throw new Error('not found');
          return { data: found };
        }),
      },
    },
    paginate: jest.fn(async () => comments),
  };
  const context = {
    eventName: 'workflow_call',
    payload: {},
    repo: { owner: 'lightspeedwp', repo: '.github' },
  };
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
  const body = stepScript(reusable.doc, 'preflight', 'confirm');
  await new AsyncFunction('core', 'context', 'github', 'require', 'process', body)(
    core,
    context,
    github,
    require,
    {
      env: {
        PR_NUMBER: String(PR_NUMBER),
        COMMAND: command,
        // The reusable now resolves the exact comment the caller named. Default to
        // the first fixture comment so existing cases keep working, and let an
        // explicit env override name a different one.
        COMMENT_ID: comments.length ? String(comments[0].id) : '',
        REQUESTED_TOOL: requestedTool,
        EXCLUDED_AUTHORS: '["dependabot[bot]","lightspeed-docs-bot[bot]"]',
        ...env,
      },
    }
  );
  return { outputs, core, refused: outputs.enabled !== 'true' };
}

/**
 * List the jobs that reference the model key, in workflow order.
 * @param {object} doc - Parsed receiver workflow.
 * @returns {string[]} Job names naming the secret.
 */
function jobsWithSecret(doc) {
  return Object.entries(doc.jobs || {})
    .filter(([, job]) => JSON.stringify(job).includes('ANTHROPIC_API_KEY_QODO_PR_AGENT'))
    .map(([name]) => name);
}

/**
 * Execute the receiver's preflight step with a synthetic triggering run.
 *
 * This runs the real script out of the workflow file rather than asserting on its
 * text. String assertions pass against a broken implementation, which is how a
 * nullable `workflow_run.pull_requests[0].number` read survived review: the
 * command path compared NaN to a pull request number and refused every command.
 * Each case drives the script and reads the decision it actually took, and the
 * suite is mutation-checked, so removing a guard fails it.
 *
 * The hint is written to a real temporary workspace so the script's own file
 * handling is exercised, and GitHub is mocked at the API boundary.
 * @param {object} [options] - Trigger event and overrides.
 * @param {string} [options.event] - The event that started the triggering run.
 * @param {object|string|null} [options.hint] - Published hint, or null for none.
 * @param {object} [options.comment] - Comment returned by issues.getComment.
 * @param {string} [options.headSha] - Head SHA the triggering run observed.
 * @param {object} [options.pullRequest] - Pull request returned by pulls.get.
 * @param {object} [options.env] - Variables that replace the derived ones.
 * @returns {Promise<object>} The decision: outputs, the API calls made, and
 * whether the run was refused.
 */
async function runReceiverPreflight({
  event = 'pull_request',
  hint = { pr: PR_NUMBER, command: '', reason: 'ok' },
  comment = null,
  headSha = 'a'.repeat(40),
  pullRequest = {
    number: PR_NUMBER,
    state: 'open',
    merged: false,
    draft: false,
    user: { login: 'maintainer' },
    head: { sha: headSha, repo: { full_name: REPO } },
    base: { repo: { full_name: REPO } },
  },
  env = {},
} = {}) {
  const outputs = {};
  const core = {
    setOutput: jest.fn((key, value) => {
      outputs[key] = value;
    }),
    notice: jest.fn(),
    warning: jest.fn(),
  };
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'qodo-hint-'));
  if (hint) {
    fs.mkdirSync(path.join(workspace, 'qodo-signal'));
    fs.writeFileSync(
      path.join(workspace, 'qodo-signal', 'qodo-signal.json'),
      typeof hint === 'string' ? hint : JSON.stringify(hint),
      'utf8'
    );
  }
  const calls = { getComment: [], pulls: [] };
  const github = {
    rest: {
      issues: {
        getComment: jest.fn(async (args) => {
          calls.getComment.push(args);
          if (!comment) {
            const error = new Error('Not Found');
            error.status = 404;
            throw error;
          }
          return { data: comment };
        }),
      },
      pulls: {
        get: jest.fn(async (args) => {
          calls.pulls.push(args);
          return { data: pullRequest };
        }),
      },
    },
  };
  const context = {
    eventName: 'workflow_run',
    payload: { workflow_run: { event, head_sha: headSha } },
    repo: { owner: 'lightspeedwp', repo: '.github' },
  };
  const base = {
    KILL_SWITCH: 'true',
    DOWNLOAD_OUTCOME: 'success',
    TRIGGER_CONCLUSION: 'success',
    TRIGGER_EVENT: event,
    TRIGGER_REPO: REPO,
    // A pull_request run is bound to its pull request by the platform. A command
    // run leaves this empty, so a case that depends on the field has to set it.
    TRIGGER_PR: String(PR_NUMBER),
    GITHUB_WORKSPACE: workspace,
    DISPATCH_PR: '',
    ...env,
  };
  // github-script evaluates the body inside an async function, so a top-level
  // `return` is a decision rather than a syntax error. The harness matches that.
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
  const body = stepScript(caller.doc, 'preflight', 'hint');
  await new AsyncFunction('core', 'context', 'github', 'require', 'process', body)(
    core,
    context,
    github,
    require,
    { env: base }
  );
  fs.rmSync(workspace, { recursive: true, force: true });
  return { outputs, core, api: calls, refused: outputs.enabled !== 'true' };
}

/**
 * Execute the receiver's preflight for a workflow_dispatch run.
 *
 * The dispatch paths call `pulls.get`: a blank command is the automatic tool
 * path and carries the automatic eligibility rules, and a named command still
 * refuses a closed pull request. The harness therefore models the API rather
 * than passing an empty `pulls`, which is what let those checks be absent
 * without any test noticing.
 * @param {object} [options] - Pull request number, command and pull request state.
 * @param {string} [options.pr] - The pr input.
 * @param {string} [options.command] - The command input.
 * @param {object} [options.pullRequest] - Pull request pulls.get returns.
 * @returns {Promise<object>} The decision.
 */
function runReceiverDispatch({
  pr = String(PR_NUMBER),
  command = '',
  pullRequest = {
    number: PR_NUMBER,
    state: 'open',
    draft: false,
    user: { login: 'maintainer' },
    head: { repo: { full_name: 'lightspeedwp/.github' } },
    base: { repo: { full_name: 'lightspeedwp/.github' } },
  },
} = {}) {
  const outputs = {};
  const core = {
    setOutput: jest.fn((key, value) => {
      outputs[key] = value;
    }),
    notice: jest.fn(),
    warning: jest.fn(),
  };
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
  const body = stepScript(caller.doc, 'preflight', 'hint');
  return new AsyncFunction('core', 'context', 'github', 'require', 'process', body)(
    core,
    {
      eventName: 'workflow_dispatch',
      payload: {},
      repo: { owner: 'lightspeedwp', repo: '.github' },
    },
    { rest: { issues: {}, pulls: { get: jest.fn(async () => ({ data: pullRequest })) } } },
    require,
    { env: { KILL_SWITCH: 'true', DISPATCH_PR: pr, DISPATCH_COMMAND: command } }
  ).then(() => ({ outputs, core, refused: outputs.enabled !== 'true' }));
}

/** The pull request fields the eligibility rules read, with one override applied. */
function pullWith(override) {
  return {
    number: PR_NUMBER,
    state: 'open',
    draft: false,
    user: { login: 'maintainer' },
    head: { repo: { full_name: 'lightspeedwp/.github' } },
    base: { repo: { full_name: 'lightspeedwp/.github' } },
    ...override,
  };
}

/**
 * The receiver's PR-Agent invocation, as it ships.
 *
 * The image's entry point runs the GitHub action runner, which in v0.46.0 skips a
 * workflow_run whose originating event is not pull_request, has no
 * workflow_dispatch branch, and never reads PR_NUMBER or PR_AGENT_COMMAND. Left as
 * a `docker://` action, a maintainer command and a manual dispatch would exit
 * having run nothing, and continue-on-error would hide it. These assertions are
 * what stop that shape coming back.
 */
describe.each([
  ['pilot receiver', () => caller],
  ['shared reusable standard', () => reusable],
])('Qodo PR-Agent entry point: %s', (_label, load) => {
  const doc = load().doc;
  const run = doc.jobs.run;
  const step = qodoStep(doc);
  const script = String(step?.run || '');

  it('overrides the image entry point instead of using the action runner', () => {
    // The upstream image is an action runner, not a general CLI. Reaching PR-Agent
    // through it is what made commands and dispatches silently do nothing.
    expect(step.uses).toBeUndefined();
    expect(script).toContain('--entrypoint python');
    expect(script).toContain('-m pr_agent.cli');
  });

  it('passes the pull request explicitly rather than through the event', () => {
    expect(script).toContain('--pr_url');
    expect(script).toContain('pr_url="https://github.com/${{ github.repository }}/pull/$QODO_PR"');
    // The two variables the upstream runner never reads. Checked as env keys, so a
    // renamed or nested declaration still fails rather than passing as a substring.
    const envKeys = Object.keys(step.env || {});
    expect({
      keys: envKeys.filter((key) =>
        /PR_AGENT_COMMAND|auto_describe|auto_improve|auto_review/.test(key)
      ),
      inScript: /PR_AGENT_COMMAND|auto_describe|auto_improve|auto_review/.test(script),
    }).toStrictEqual({ keys: [], inScript: false });
  });

  it('names the automatic path explicitly rather than through auto_* settings', () => {
    expect(script).toContain('run_tool describe');
    expect(script).toContain('run_tool improve');
    // Where the workflow has a consumer switch for the automatic path, the script
    // must actually consult it, so a consumer that turns a tool off does not get it.
    if (step.env.QODO_AUTO_DESCRIBE) {
      expect(script).toContain('[ "$QODO_AUTO_DESCRIBE" = \'true\' ]');
      expect(script).toMatch(/if \[ "\$QODO_AUTO_DESCRIBE" = 'true' \]; then\s+run_tool describe/);
    }
    if (step.env.QODO_AUTO_IMPROVE) {
      expect(script).toMatch(/if \[ "\$QODO_AUTO_IMPROVE" = 'true' \]; then\s+run_tool improve/);
    }
  });

  it('refuses a pull request value that is not a plain number', () => {
    // QODO_PR becomes shell and API input, so it is checked rather than trusted.
    expect(script).toMatch(/QODO_PR[\s\S]{0,200}\*\[!0-9\]\*/);
  });

  it('runs a named command with no free arguments, so no text can become a flag', () => {
    // The shared standard's `command` input is the allow-listed token only, so it has
    // no trailing text to pass. The pilot does, and quotes it. Neither form lets a
    // comment reach the argv unquoted.
    expect(script).not.toMatch(/run_tool\s+"?\$QODO_TOOL"?\s+\$[A-Z_]+(?!")/);
    if (/QODO_ARGS/.test(script)) {
      expect(script).toContain('run_tool "$QODO_TOOL" "$QODO_ARGS"');
    }
  });

  it('keeps the image pinned by digest on the new invocation path', () => {
    expect(script).toMatch(/pragent\/pr-agent@sha256:[a-f0-9]{64}/);
    expect(script).not.toMatch(/pragent\/pr-agent:(latest|v?\d)/);
  });

  it('gives the container no more than the environment variables it needs', () => {
    // An explicit allow-list, so a future step cannot widen what enters by accident.
    // The allow-list is an explicit array, and the run passes exactly its entries,
    // so a later edit to this job's env cannot widen what enters the container.
    const block = script.match(/container_env=\(([^)]*)\)/);
    expect(block).not.toBeNull();
    const passed = block[1]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    expect(passed.length).toBeGreaterThan(0);
    expect(passed).toContain('GITHUB_TOKEN');
    // pr_agent.cli reads get_settings().github.user_token with no GITHUB_TOKEN
    // fallback; without this every tool run fails before it posts anything.
    expect(passed).toContain('GITHUB.USER_TOKEN');
    expect(passed).toContain('ANTHROPIC.KEY');
    // Neither workflow's raw secret name may be handed in under its own name: the
    // container is given the key as ANTHROPIC.KEY, which is what the image reads.
    expect(
      passed.filter((name) => /model_credential|ANTHROPIC_API_KEY_QODO_PR_AGENT/.test(name))
    ).toStrictEqual([]);
    expect(new Set(passed).size).toBe(passed.length);
    // The step's own env holds the key under the name the image expects, and never
    // under the secret's own name. The source differs by design: the pilot reads its
    // environment secret, the shared standard a declared input.
    expect(step.env['ANTHROPIC.KEY']).toMatch(/^\$\{\{ secrets\.[A-Za-z_]+ \}\}$/);
    expect(Object.keys(step.env)).not.toContain('ANTHROPIC_API_KEY_QODO_PR_AGENT');
  });

  it('still fails closed when the environment did not release the key', () => {
    const guard = allSteps(caller.doc).find((candidate) =>
      String(candidate.run || '').includes('did not release')
    );
    expect(guard).toBeDefined();
    expect(guard.env.HAS_CREDENTIAL).toBe("${{ secrets.ANTHROPIC_API_KEY_QODO_PR_AGENT != '' }}");
    expect(run.if).toBe("needs.preflight.outputs.enabled == 'true'");
  });
});

/**
 * The receiver's preflight, executed.
 *
 * The privileged half of the split. Every case drives the real script and asserts
 * the reason it returned, so a change that weakens a guard fails here rather than
 * passing on a string match. The environment holding the key is attached to the
 * `run` job alone and that job is gated on `enabled`, so a refusal leaves the key
 * unreachable. That is the assertion the CWE-200 finding turns on.
 */
/**
 * The argument-injection guards, executed in all three places they exist.
 *
 * PR-Agent applies a later `--section.key=value` token as a setting after the
 * environment, which would override the locked keys. The refusal therefore has to
 * be in the trigger, the receiver and the shared standard, and each has to be
 * exercised rather than matched.
 */
describe('Qodo PR-Agent argument-injection guards, executed', () => {
  const INJECTION = '/review please check --config.model=gpt-4o';
  const comment = (body) => ({
    id: 555,
    body,
    author_association: 'MEMBER',
    issue_url: `https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}`,
  });

  it('refuses a setting token that is not the first word, in the receiver', async () => {
    // Isolates the `=` check: the token is not leading, so only that check can
    // refuse it. A leading-hyphen refusal would mask the removal.
    const { outputs, refused } = await runReceiverPreflight({
      event: 'issue_comment',
      hint: { pr: PR_NUMBER, command: '/review', comment_id: '555', reason: 'ok' },
      comment: comment(INJECTION),
      env: { TRIGGER_PR: '' },
    });
    expect({ refused, reason: outputs.reason }).toStrictEqual({
      refused: true,
      reason: 'arguments-not-allowed',
    });
  });

  it('refuses a leading hyphen in the receiver', async () => {
    const { outputs, refused } = await runReceiverPreflight({
      event: 'issue_comment',
      hint: { pr: PR_NUMBER, command: '/review', comment_id: '555', reason: 'ok' },
      comment: comment('/review -x'),
      env: { TRIGGER_PR: '' },
    });
    expect({ refused, reason: outputs.reason }).toStrictEqual({
      refused: true,
      reason: 'arguments-not-allowed',
    });
  });

  it('refuses both shapes in the trigger, before anything is published', () => {
    const payload = (body) => ({
      issue: { pull_request: { number: PR_NUMBER } },
      comment: { id: 7788, body, author_association: 'OWNER' },
    });
    for (const body of [INJECTION, '/review -x']) {
      const { outputs } = runTriggerClassify({
        eventName: 'issue_comment',
        payload: payload(body),
      });
      expect({ body, analyse: outputs.analyse, reason: outputs.reason }).toStrictEqual({
        body,
        analyse: 'false',
        reason: 'arguments-not-allowed',
      });
    }
  });

  it('answers the comment the caller named, not a later one with the same command', async () => {
    // Two /ask comments before confirmation. The newest-matching behaviour that the
    // reusable used to have would answer the second; resolving by id answers the
    // first, which is the request that caused the run.
    const first = { ...comment('/ask What does this change affect?'), id: 111 };
    const second = { ...comment('/ask What does the second comment ask?'), id: 222 };
    const { outputs } = await runReusableConfirm({
      command: '/ask',
      comments: [first, second],
      env: { COMMENT_ID: '111' },
    });
    expect(outputs.args).toBe('What does this change affect?');

    // Naming the second asks the second question, so the id really is the selector.
    const other = await runReusableConfirm({
      command: '/ask',
      comments: [first, second],
      env: { COMMENT_ID: '222' },
    });
    expect(other.outputs.args).toBe('What does the second comment ask?');
  });

  it('refuses a command when the caller names no comment', async () => {
    // Without an id there is nothing to bind to, so the reusable must not search.
    const { outputs, refused } = await runReusableConfirm({
      command: '/review',
      comments: [comment('/review')],
      env: { COMMENT_ID: '' },
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('unreadable-request');
  });

  it('refuses a comment that belongs to another pull request', async () => {
    const { outputs, refused } = await runReusableConfirm({
      command: '/review',
      comments: [{ ...comment('/review'), id: 333, issue_url: `https://api.github.com/repos/lightspeedwp/.github/issues/${PR_NUMBER + 1}` }],
      env: { COMMENT_ID: '333' },
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('comment-not-on-this-pull-request');
  });

  it('refuses both shapes in the shared standard, before any tool runs', async () => {
    for (const body of [INJECTION, '/review -x']) {
      const { outputs, refused } = await runReusableConfirm({
        command: '/review',
        comments: [comment(body)],
      });
      expect({ body, refused, reason: outputs.reason }).toStrictEqual({
        body,
        refused: true,
        reason: 'arguments-not-allowed',
      });
    }
  });

  it('still answers a question that mentions a flag mid-sentence', async () => {
    const question = '/ask What does --verbose do here?';
    const { outputs, refused } = await runReusableConfirm({
      command: '/ask',
      comments: [comment(question)],
    });
    expect(refused).toBe(false);
    expect(outputs).toMatchObject({ enabled: 'true', tool: 'ask' });
  });
});

describe('Qodo PR-Agent receiver preflight, executed', () => {
  const COMMENT_ID = '555';
  const SHA = 'a'.repeat(40);

  /**
   * A comment the API would return, on the given pull request.
   * @param {number} [pr] - Pull request the comment lives on.
   * @param {string} [association] - author_association the API reports.
   * @param {string} [body] - Comment body.
   * @returns {object} A comment object.
   */
  const commentOn = (
    pr = PR_NUMBER,
    association = 'MEMBER',
    body = '/review look at the retry path'
  ) => ({
    id: 555,
    body,
    author_association: association,
    issue_url: `https://api.github.com/repos/${REPO}/issues/${pr}`,
  });

  /**
   * A pull request the API would return.
   * @param {object} [over] - Fields to override.
   * @returns {object} A pull request object.
   */
  const pullOn = (over = {}) => ({
    number: PR_NUMBER,
    state: 'open',
    merged: false,
    draft: false,
    user: { login: 'maintainer' },
    head: { sha: SHA, repo: { full_name: REPO } },
    base: { repo: { full_name: REPO } },
    ...over,
  });

  /**
   * Run the command path, which leaves TRIGGER_PR empty the way a real
   * issue_comment triggering run does.
   * @param {object} [over] - Harness overrides.
   * @returns {Promise<object>} The decision.
   */
  const command = (over = {}) =>
    runReceiverPreflight({ event: 'issue_comment', env: { TRIGGER_PR: '' }, ...over });

  it('runs the automatic path for a pull_request trigger', async () => {
    const { outputs, api } = await runReceiverPreflight();
    expect(outputs).toMatchObject({
      enabled: 'true',
      reason: 'ok',
      tool: 'auto',
      pr: String(PR_NUMBER),
    });
    expect(api.pulls).toHaveLength(1);
  });

  it('accepts a command on an issue_comment trigger whose run carries no pull request', async () => {
    const { outputs, refused, api } = await command({
      hint: { pr: PR_NUMBER, command: '/review', comment_id: COMMENT_ID, reason: 'ok' },
      comment: commentOn(),
    });
    expect(refused).toBe(false);
    expect(outputs).toMatchObject({
      enabled: 'true',
      reason: 'ok',
      pr: String(PR_NUMBER),
      command: '/review',
    });
    expect(api.getComment).toHaveLength(1);
  });

  it('refuses a command on a closed pull request', async () => {
    // The open-state rule is not an automatic-path rule. Without it on the shared
    // path, a maintainer comment on a merged or closed pull request started the
    // credentialed run, because every command check assumes an open pull request.
    const { outputs, refused } = await command({
      hint: { pr: PR_NUMBER, command: '/review', comment_id: COMMENT_ID, reason: 'ok' },
      comment: commentOn(),
      pullRequest: {
        number: PR_NUMBER,
        state: 'closed',
        draft: false,
        user: { login: 'maintainer' },
        head: { repo: { full_name: 'lightspeedwp/.github' } },
        base: { repo: { full_name: 'lightspeedwp/.github' } },
      },
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('pr-not-open');
  });

  it('still runs a command on an open draft or fork pull request', async () => {
    // Draft, excluded-author and fork are automatic-path rules; an authorised
    // maintainer command must not inherit them.
    for (const override of [
      { draft: true },
      { head: { repo: { full_name: 'someone/fork' } } },
    ]) {
      const { outputs, refused } = await command({
        hint: { pr: PR_NUMBER, command: '/review', comment_id: COMMENT_ID, reason: 'ok' },
        comment: commentOn(),
        pullRequest: {
          number: PR_NUMBER,
          state: 'open',
          user: { login: 'maintainer' },
          head: { repo: { full_name: 'lightspeedwp/.github' } },
          base: { repo: { full_name: 'lightspeedwp/.github' } },
          ...override,
        },
      });
      expect({ refused }).toStrictEqual({ refused: false });
      expect(outputs.command).toBe('/review');
    }
  });

  it('refuses a command hint with no comment id', async () => {
    const { outputs, refused } = await command({
      hint: { pr: PR_NUMBER, command: '/review', reason: 'ok' },
      comment: commentOn(),
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('unreadable-request');
  });

  it('refuses a comment id that does not exist', async () => {
    const { outputs, refused } = await command({
      hint: { pr: PR_NUMBER, command: '/review', comment_id: '999', reason: 'ok' },
      comment: null,
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('no-matching-comment');
  });

  it('refuses a comment id taken from a different pull request', async () => {
    const { outputs, refused } = await command({
      hint: { pr: PR_NUMBER, command: '/review', comment_id: COMMENT_ID, reason: 'ok' },
      comment: commentOn(PR_NUMBER + 1),
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('comment-not-on-this-pull-request');
  });

  it('refuses a comment whose command is not allow-listed', async () => {
    const { outputs, refused } = await command({
      hint: { pr: PR_NUMBER, command: '/deploy', comment_id: COMMENT_ID, reason: 'ok' },
      comment: commentOn(PR_NUMBER, 'MEMBER', '/deploy to production'),
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('command-not-allowed');
  });

  it('refuses a command from an author who is not a maintainer', async () => {
    const { outputs, refused } = await command({
      hint: { pr: PR_NUMBER, command: '/review', comment_id: COMMENT_ID, reason: 'ok' },
      comment: commentOn(PR_NUMBER, 'NONE'),
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('author-not-allowed');
  });

  it('refuses trailing text that begins with a hyphen', async () => {
    // A setting is only applied upstream when the token carries an `=`, so the
    // existing refusal already covers the dangerous shape. This refuses a leading
    // hyphen anyway, so nothing depends on how a future upstream version might treat
    // one, and it is the case that would otherwise look like a second flag.
    for (const body of ['/review -x', '/review --config', '/ask --pr_url=https://evil.example/x']) {
      const { outputs, refused } = await runReceiverPreflight({
        event: 'issue_comment',
        hint: {
          pr: PR_NUMBER,
          command: String(body).split(' ')[0],
          comment_id: COMMENT_ID,
          reason: 'ok',
        },
        comment: {
          id: 555,
          body,
          author_association: 'MEMBER',
          issue_url: `https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}`,
        },
        env: { TRIGGER_PR: '' },
      });
      expect({ body, refused, reason: outputs.reason }).toStrictEqual({
        body,
        refused: true,
        reason: 'arguments-not-allowed',
      });
    }
  });

  it('keeps a mid-sentence flag question answerable', async () => {
    const { outputs, refused } = await runReceiverPreflight({
      event: 'issue_comment',
      hint: { pr: PR_NUMBER, command: '/ask', comment_id: COMMENT_ID, reason: 'ok' },
      comment: {
        id: 555,
        body: '/ask What does --verbose do here?',
        author_association: 'MEMBER',
        issue_url: `https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}`,
      },
      env: { TRIGGER_PR: '' },
    });
    expect(refused).toBe(false);
    expect(outputs).toMatchObject({ args: 'What does --verbose do here?' });
  });

  it('refuses an argument injection in a command', async () => {
    const { outputs, refused } = await command({
      hint: { pr: PR_NUMBER, command: '/review', comment_id: COMMENT_ID, reason: 'ok' },
      comment: commentOn(PR_NUMBER, 'MEMBER', '/review --config.url=https://evil.example/x.toml'),
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('arguments-not-allowed');
  });

  // The trailing text reaches PR-Agent as one argument, and PR-Agent reads one that
  // starts with '--' as a setting, splitting on the first '=' wherever it falls. A
  // split fragment passes the per-word check, so the joined text is checked too.
  it.each(['/ask --config.model =other-model', '/ask --config.model = other-model', '/ask -x'])(
    'refuses a split setting fragment in %j',
    async (body) => {
      const { outputs, refused } = await command({
        hint: { pr: PR_NUMBER, command: '/ask', comment_id: COMMENT_ID, reason: 'ok' },
        comment: commentOn(PR_NUMBER, 'MEMBER', body),
      });
      expect(refused).toBe(true);
      expect(outputs.reason).toBe('arguments-not-allowed');
    }
  );

  it('keeps a question that mentions a flag mid-sentence', async () => {
    const { outputs, refused } = await command({
      hint: { pr: PR_NUMBER, command: '/ask', comment_id: COMMENT_ID, reason: 'ok' },
      comment: commentOn(PR_NUMBER, 'MEMBER', '/ask What does --verbose do here?'),
    });
    expect(refused).toBe(false);
    expect(outputs.args).toBe('What does --verbose do here?');
  });

  it('refuses a pull request that is closed', async () => {
    const { outputs, refused } = await runReceiverPreflight({
      pullRequest: pullOn({ state: 'closed', merged: true }),
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('pr-not-open');
  });

  it('refuses a draft pull request', async () => {
    const { outputs, refused } = await runReceiverPreflight({
      pullRequest: pullOn({ draft: true }),
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('draft');
  });

  it('refuses an excluded bot author', async () => {
    const { outputs, refused } = await runReceiverPreflight({
      pullRequest: pullOn({ user: { login: 'dependabot[bot]' } }),
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('excluded-author');
  });

  it('refuses a pull request whose head is a fork', async () => {
    const { outputs, refused } = await runReceiverPreflight({
      pullRequest: pullOn({ head: { sha: SHA, repo: { full_name: 'someone/fork' } } }),
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('fork');
  });

  it('refuses a pull request whose head has moved since the trigger', async () => {
    // The run saw one head; the pull request has since moved to another.
    const { outputs, refused } = await runReceiverPreflight({
      headSha: 'b'.repeat(40),
      pullRequest: pullOn({ head: { sha: 'c'.repeat(40), repo: { full_name: REPO } } }),
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('trigger-head-superseded');
  });

  it('refuses a hint naming a pull request other than the one the trigger ran for', async () => {
    const { outputs, refused } = await runReceiverPreflight({
      env: { TRIGGER_PR: String(PR_NUMBER + 1) },
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('hint-does-not-match-trigger');
  });

  it('refuses a run that did not succeed', async () => {
    const { outputs, refused } = await runReceiverPreflight({
      env: { TRIGGER_CONCLUSION: 'failure' },
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('trigger-not-successful');
  });

  it('refuses a triggering run from a fork', async () => {
    const { outputs, refused } = await runReceiverPreflight({
      env: { TRIGGER_REPO: 'someone/fork' },
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('fork');
  });

  it('refuses a trigger event it does not handle', async () => {
    const { outputs, refused } = await runReceiverPreflight({ env: { TRIGGER_EVENT: 'push' } });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('unsupported-trigger-event');
  });

  it('refuses when the kill switch is not exactly true', async () => {
    const { outputs, refused } = await runReceiverPreflight({ env: { KILL_SWITCH: 'false' } });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('kill-switch');
  });

  it('refuses a malformed hint', async () => {
    const { outputs, refused } = await runReceiverPreflight({ hint: 'not json' });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('unreadable-request');
  });

  it('refuses when no hint was published', async () => {
    const { outputs, refused } = await runReceiverPreflight({ hint: null });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('no-request');
  });

  it('refuses when the hint could not be downloaded', async () => {
    const { outputs, refused } = await runReceiverPreflight({
      env: { DOWNLOAD_OUTCOME: 'failure' },
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('no-request');
  });

  it('runs the automatic path for a dispatch with a blank command', async () => {
    const { outputs, refused } = await runReceiverDispatch({});
    expect(refused).toBe(false);
    expect(outputs).toMatchObject({ enabled: 'true', reason: 'ok', tool: 'auto' });
  });

  it('honours an allow-listed command typed on a dispatch', async () => {
    const { outputs, refused } = await runReceiverDispatch({ command: '/improve' });
    expect(refused).toBe(false);
    expect(outputs).toMatchObject({ enabled: 'true', reason: 'ok', tool: 'improve', command: '/improve' });
  });

  it('refuses a command typed on a dispatch that is not allow-listed', async () => {
    const { outputs, refused } = await runReceiverDispatch({ command: '/deploy' });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('command-not-allowed');
  });

  it('refuses /ask on a dispatch, which has no comment to take a question from', async () => {
    // A dispatched command carries no trailing text, so /ask would reach the CLI
    // with no argument. The tool stores no result, which would record a silent
    // no-output run rather than saying the question was missing.
    const { outputs, refused } = await runReceiverDispatch({ command: '/ask' });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('ask-needs-question');
  });

  it('applies the automatic eligibility rules to a blank dispatch', async () => {
    // A blank command is the automatic tool path, so it must be vetted exactly as
    // the trigger's automatic run is.
    const cases = [
      ['pr-not-open', { state: 'closed' }],
      ['draft', { draft: true }],
      ['excluded-author', { user: { login: 'dependabot[bot]' } }],
      ['fork', { head: { repo: { full_name: 'someone/fork' } } }],
    ];
    for (const [reason, override] of cases) {
      const { outputs, refused } = await runReceiverDispatch({
        pullRequest: pullWith(override),
      });
      expect({ reason, refused, got: outputs.reason }).toStrictEqual({
        reason,
        refused: true,
        got: reason,
      });
    }
  });

  it('refuses a named dispatch command on a closed pull request', async () => {
    const { outputs, refused } = await runReceiverDispatch({
      command: '/review',
      pullRequest: pullWith({ state: 'closed' }),
    });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('pr-not-open');
  });

  it('lets a named dispatch command run on an open draft or fork pull request', async () => {
    // Draft, excluded-author and fork are automatic-path rules. An authorised
    // command must not inherit them, or a maintainer could not review a draft.
    for (const override of [
      { draft: true },
      { head: { repo: { full_name: 'someone/fork' } } },
      { user: { login: 'dependabot[bot]' } },
    ]) {
      const { outputs, refused } = await runReceiverDispatch({
        command: '/review',
        pullRequest: pullWith(override),
      });
      expect({ refused }).toStrictEqual({ refused: false });
      expect(outputs.command).toBe('/review');
    }
  });

  it('still runs every other allowed command on a dispatch', async () => {
    for (const command of ['/review', '/describe', '/improve', '/update_changelog']) {
      const { outputs, refused } = await runReceiverDispatch({ command });
      expect({ command, refused }).toStrictEqual({ command, refused: false });
      expect(outputs.command).toBe(command);
    }
  });

  it('refuses a dispatch with no pull request number', async () => {
    const { outputs, refused } = await runReceiverDispatch({ pr: 'nope' });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('bad-dispatch-input');
  });

  it('emits the trailing text so a question can reach the CLI', async () => {
    const { outputs, refused } = await runReceiverPreflight({
      event: 'issue_comment',
      hint: { pr: PR_NUMBER, command: '/ask', comment_id: COMMENT_ID, reason: 'ok' },
      comment: {
        id: 555,
        body: '/ask why is the retry unbounded here?',
        author_association: 'MEMBER',
        issue_url: `https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}`,
      },
      env: { TRIGGER_PR: '' },
    });
    expect(refused).toBe(false);
    expect(outputs).toMatchObject({ args: 'why is the retry unbounded here?', command: '/ask' });
  });

  it('clears the trailing text on every refusal', async () => {
    const { outputs } = await runReceiverPreflight({ env: { KILL_SWITCH: 'false' } });
    expect(outputs.args).toBe('');
  });

  it('enables only on the literal string true, in any workflow that checks it', async () => {
    // FR-020 requires the exact string. A case-insensitive match would also accept
    // 'True' and 'TRUE', which the requirement does not, so the comparison is
    // asserted on the parsed workflow rather than left to a comment.
    for (const [name, workflow] of [
      ['trigger', trigger],
      ['reusable', reusable],
      ['caller', caller],
    ]) {
      const body = JSON.stringify(workflow.doc);
      expect({
        workflow: name,
        caseInsensitive: /KILL_SWITCH\)\.toLowerCase\(\)/.test(body),
      }).toStrictEqual({ workflow: name, caseInsensitive: false });
      expect({ workflow: name, strict: /KILL_SWITCH\) !== 'true'/.test(body) }).toStrictEqual({
        workflow: name,
        strict: true,
      });
    }
  });

  it('leaves the pilot off for a capitalised true', async () => {
    const { outputs, refused } = await runReceiverPreflight({ env: { KILL_SWITCH: 'True' } });
    expect(refused).toBe(true);
    expect(outputs.reason).toBe('kill-switch');
  });

  it('releases no key on any refusal path', async () => {
    // The environment is attached to the run job alone, and that job is gated on
    // this output, so enabled: false on every refusal means the key is
    // unreachable on all of them.
    const refusals = [
      { env: { KILL_SWITCH: 'false' } },
      { env: { TRIGGER_CONCLUSION: 'failure' } },
      { env: { TRIGGER_REPO: 'someone/fork' } },
      { env: { TRIGGER_EVENT: 'push' } },
      { env: { TRIGGER_PR: String(PR_NUMBER + 1) } },
      { env: { DOWNLOAD_OUTCOME: 'failure' } },
      { hint: null },
      { hint: 'not json' },
      { pullRequest: pullOn({ state: 'closed', merged: true }) },
      { pullRequest: pullOn({ draft: true }) },
      { pullRequest: pullOn({ user: { login: 'dependabot[bot]' } }) },
      { pullRequest: pullOn({ head: { sha: SHA, repo: { full_name: 'someone/fork' } } }) },
      {
        headSha: 'b'.repeat(40),
        pullRequest: pullOn({ head: { sha: 'c'.repeat(40), repo: { full_name: REPO } } }),
      },
      {
        event: 'issue_comment',
        env: { TRIGGER_PR: '' },
        hint: { pr: PR_NUMBER, command: '/review', reason: 'ok' },
        comment: commentOn(),
      },
      {
        event: 'issue_comment',
        env: { TRIGGER_PR: '' },
        hint: { pr: PR_NUMBER, command: '/review', comment_id: '999', reason: 'ok' },
        comment: null,
      },
      {
        event: 'issue_comment',
        env: { TRIGGER_PR: '' },
        hint: { pr: PR_NUMBER, command: '/review', comment_id: COMMENT_ID, reason: 'ok' },
        comment: commentOn(PR_NUMBER + 1),
      },
      {
        event: 'issue_comment',
        env: { TRIGGER_PR: '' },
        hint: { pr: PR_NUMBER, command: '/review', comment_id: COMMENT_ID, reason: 'ok' },
        comment: commentOn(PR_NUMBER, 'NONE'),
      },
      {
        event: 'issue_comment',
        env: { TRIGGER_PR: '' },
        hint: { pr: PR_NUMBER, command: '/review', comment_id: COMMENT_ID, reason: 'ok' },
        comment: commentOn(PR_NUMBER, 'MEMBER', '/review --config.url=https://evil.example/x.toml'),
      },
    ];
    for (const options of refusals) {
      const { outputs, refused } = await runReceiverPreflight(options);
      expect(refused).toBe(true);
      expect(outputs.reason).not.toBe('ok');
    }
    // Structural half: only the run job may name the environment or the key, so
    // there is no second path to the secret.
    const envOf = (job) =>
      typeof job?.environment === 'string' ? job.environment : job?.environment?.name;
    const holders = Object.entries(caller.doc.jobs || {}).filter(([, job]) => envOf(job));
    expect(holders.map(([name]) => name)).toEqual(['run']);
    expect(envOf(caller.doc.jobs.run)).toBe('qodo-pr-agent');
    expect(jobsWithSecret(caller.doc)).toEqual(['run']);
    expect(caller.doc.jobs.run.if).toBe("needs.preflight.outputs.enabled == 'true'");
  });
});

describe('Qodo PR-Agent pilot caller workflow', () => {
  const { doc, raw } = caller;

  it('exists', () => {
    expect(raw.length).toBeGreaterThan(0);
  });

  // The receiver's own event is workflow_run or workflow_dispatch. SC-001 needs the
  // originating event and when GitHub received it, not when the trigger finished.
  it('records the originating event and its time, not the receiver event', () => {
    const recordStep = doc.jobs.record.steps.find((step) => step.name === 'Write run record');
    expect(recordStep.env.TRIGGER).toBe(
      '${{ github.event.workflow_run.event || github.event_name }}'
    );
    expect(recordStep.env.EVENT_AT).toBe("${{ github.event.workflow_run.created_at || '' }}");
    expect(raw).not.toContain('workflow_run.updated_at');
    expect(raw).not.toContain('repository.updated_at');
  });

  // Under `pull_request` GitHub evaluates the definition from the PR merge commit
  // and passes repository secrets to that run, which is the CWE-200 finding. Only
  // `workflow_run` and `workflow_dispatch` are resolved against the default
  // branch, so they are the only triggers the key may hang off.
  it('triggers only on default-branch events', () => {
    expect(Object.keys(doc.on).sort()).toStrictEqual(['workflow_dispatch', 'workflow_run']);
    expect(doc.on.workflow_run).toStrictEqual({
      workflows: ['Qodo PR-Agent • Trigger'],
      types: ['completed'],
    });
    expect(doc.on.workflow_dispatch.inputs.pr.required).toBe(true);
    expect(doc.on.workflow_dispatch.inputs.command.default).toBe('');
    expect(doc.on.pull_request).toBeUndefined();
    expect(doc.on.pull_request_target).toBeUndefined();
    expect(doc.on.issue_comment).toBeUndefined();
    expect(doc.on.push).toBeUndefined();
    expect(raw).not.toMatch(/synchronize/);
  });

  // Replaces the old `uses:` call. A workflow_call job cannot declare an
  // environment of its own, so the privileged half is inlined and the Environment
  // is declared on the job that reads the key.
  it('inlines the privileged run behind the qodo-pr-agent environment', () => {
    expect(Object.values(doc.jobs).some((job) => job.uses)).toBe(false);
    expect(doc.jobs.run.environment).toStrictEqual({ name: 'qodo-pr-agent' });
    expect(doc.jobs.run.needs).toBe('preflight');
    expect(doc.jobs.run.if).toBe("needs.preflight.outputs.enabled == 'true'");
    // The credential is named by nothing but the run job, so the deciding job
    // cannot read it even when the run came from a fork's pull request. The
    // receiver is not a workflow_call, so it names the environment secret
    // literally rather than receiving a `secrets:` mapping.
    expect(jobsMentioning(doc, 'secrets.ANTHROPIC_API_KEY_QODO_PR_AGENT')).toStrictEqual(['run']);
    expect(jobsMentioning(doc, 'secrets.model_credential')).toStrictEqual([]);
    expect(doc.permissions).toStrictEqual({ contents: 'read' });
    // Enough to download the trigger's artifact, and nothing more.
    expect(doc.jobs.preflight.permissions).toStrictEqual({ actions: 'read' });
    expect(doc.jobs.record.permissions).toStrictEqual({});
  });

  // The artifact is downloaded and parsed as data, and every field it claims is
  // re-derived from the API. A pull request author who edits the trigger can at
  // worst cause this run to disagree with itself, which skips the run.
  it('treats the request hint as a hint and re-derives it from the API', () => {
    // Downloaded with the pinned action, so extraction is a reviewed
    // dependency rather than a require() of whatever the runner bundles.
    const download = (doc.jobs.preflight.steps || []).find((s) => s.id === 'download');
    expect(download.uses).toBe(
      'actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c'
    );
    expect(download.with.name).toBe('qodo-pr-agent-signal');
    expect(download.with['run-id']).toContain('github.event.workflow_run.id');
    // A missing hint is a skip, not a failure, so the download must not go red.
    expect(download['continue-on-error']).toBe(true);

    const script = stepScript(doc, 'preflight', 'hint');
    // A failed or absent download is a plain skip.
    expect(script).toContain('DOWNLOAD_OUTCOME');
    expect(script).toContain("return out('no-request')");
    // Parsed as data from disk, never executed.
    expect(script).toContain('JSON.parse(fs.readFileSync');
    expect(script).toContain("return out('unreadable-request')");
    // Every fact is re-derived: the PR itself, and the comment and its author.
    expect(script).toContain('github.rest.pulls.get');
    // The comment is fetched by id, so the pull request and the author come from
    // GitHub rather than from a hint a pull request author can rewrite.
    expect(script).toContain('github.rest.issues.getComment');
    expect(script).toContain('comment-not-on-this-pull-request');
    expect(script).toContain('match.author_association');
    expect(script).toContain("return out('arguments-not-allowed')");
    // The triggering run must be one of ours, from this repository, or the
    // receiver refuses it as a fork.
    expect(script).toContain("return out('fork')");
  });

  it('binds the run to the pull request and head the trigger saw', () => {
    // A hint is only usable if it names the pull request the triggering run was
    // for, at the head that run observed. Otherwise a stale or forged hint
    // points a successful trigger at an unrelated or already-pushed pull request.
    const env = (doc.jobs.preflight.steps || []).find((s) => s.id === 'hint').env;
    expect(env.TRIGGER_PR).toContain('github.event.workflow_run.pull_requests[0].number');
    const script = stepScript(doc, 'preflight', 'hint');
    expect(script).toContain('hint-does-not-match-trigger');
    expect(script).toContain('pull.head?.sha !== context.payload.workflow_run.head_sha');
    expect(script).toContain('trigger-head-superseded');
    // A closed pull request is not analysed on a stale trigger either.
    expect(script).toContain("return out('pr-not-open')");
  });

  it('reads the triggering run event, not its own', () => {
    // Under workflow_run, github.event_name is 'workflow_run'. Reading it here
    // would make every automatic run look like an unsupported trigger.
    const env = (doc.jobs.preflight.steps || []).find((s) => s.id === 'hint').env;
    expect(env.TRIGGER_EVENT).toContain('github.event.workflow_run.event');
    expect(env.TRIGGER_EVENT).not.toContain('${{ github.event_name }}');
  });

  it('grants no OIDC capability and passes no federation input', () => {
    for (const job of Object.values(doc.jobs)) {
      expect(job.permissions).not.toHaveProperty('id-token');
      expect(job.with).toBeUndefined();
    }
    // Structural, not a text search: the workflows still explain in comments why
    // federation is absent, so the guarantee is about what the jobs can actually do.
    for (const workflowDoc of [doc, reusable.doc, trigger.doc]) {
      for (const scope of [workflowDoc, ...Object.values(workflowDoc.jobs || {})]) {
        expect(scope.permissions || {}).not.toHaveProperty('id-token');
      }
      for (const input of Object.keys(workflowDoc.on?.workflow_call?.inputs || {})) {
        expect(input).not.toMatch(/federation|organization_id|service_account_id|workspace_id/);
      }
    }
    const serialised = JSON.stringify([doc, reusable.doc, trigger.doc]);
    for (const token of [
      'getIDToken',
      'v1/oauth_token',
      'v1/oauth/token',
      'federation_rule_id',
      'id-token',
    ]) {
      expect(serialised).not.toContain(token);
    }
  });
});

/**
 * The properties that keep the model key out of a pull request author's reach.
 * They span all three files, so they are asserted together: a change that
 * satisfies one workflow while breaking another has to fail here.
 */
describe('Qodo PR-Agent secret boundary', () => {
  it('reaches the key only from an environment-gated run job', () => {
    // The two workflows name the key differently, and both names are correct.
    // The reusable workflow is a workflow_call, so it receives it as a declared
    // `secrets:` input. The receiver inlines its privileged run rather than
    // calling the reusable workflow, so it has no mapping to inherit and names
    // the environment secret directly. What matters is the same in both: exactly
    // one job declares the environment, and it is the only job that can read the
    // value.
    for (const [name, workflowDoc, secretRef] of [
      ['reusable', reusable.doc, 'secrets.model_credential'],
      ['caller', caller.doc, 'secrets.ANTHROPIC_API_KEY_QODO_PR_AGENT'],
    ]) {
      const gated = Object.entries(workflowDoc.jobs)
        .filter(([, job]) => job.environment)
        .map(([jobName]) => jobName);
      expect({ workflow: name, gatedJobs: gated }).toStrictEqual({
        workflow: name,
        gatedJobs: ['run'],
      });
      // Anywhere else, the name may only appear as the `!= ''` probe that proves
      // the credential is not repository-scoped. The value is passed on from the
      // run job alone.
      for (const [jobName, job] of Object.entries(workflowDoc.jobs)) {
        if (jobName === 'run') continue;
        const escaped = secretRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const references = JSON.stringify(job).match(new RegExp(`${escaped}[^}]*`, 'g')) || [];
        for (const reference of references) {
          expect({ workflow: name, job: jobName, reference: reference.trim() }).toStrictEqual({
            workflow: name,
            job: jobName,
            reference: `${secretRef} != ''`,
          });
        }
      }
      expect({
        workflow: name,
        reads: jobsMentioning(workflowDoc, `${secretRef} }}`),
      }).toStrictEqual({ workflow: name, reads: ['run'] });
    }
  });

  it('reads the environment secret by name in the receiver, not a workflow_call mapping', () => {
    // A receiver that `uses:` the reusable workflow would receive the key as a
    // declared secret. It does not, so the name must appear literally, or the
    // key resolves to nothing and the run fails closed on every pull request.
    const run = caller.doc.jobs.run;
    expect(JSON.stringify(run)).toContain('secrets.ANTHROPIC_API_KEY_QODO_PR_AGENT');
    expect(caller.doc.on?.workflow_call).toBeUndefined();
    // The reusable workflow keeps the declared-secret form, since it is called.
    expect(reusable.doc.on.workflow_call.secrets.model_credential).toBeDefined();
  });

  it('records the originating event and the trigger start time in both workflows', () => {
    // The record must describe the event that asked for the run, not the receiver's
    // own event, and the time GitHub received that event, not the time the trigger
    // finished. updated_at would start the SC-001 clock late.
    for (const [name, workflow] of [
      ['reusable', reusable],
      ['caller', caller],
    ]) {
      const env = qodoRecordStep(workflow.doc).env;
      expect({ workflow: name, trigger: env.TRIGGER, eventAt: env.EVENT_AT }).toStrictEqual({
        workflow: name,
        trigger: '${{ github.event.workflow_run.event || github.event_name }}',
        eventAt: "${{ github.event.workflow_run.created_at || '' }}",
      });
      // Neither the old field nor the repository fallback may come back.
      expect({
        workflow: name,
        stale: /workflow_run\.updated_at|repository\.updated_at/.test(JSON.stringify(workflow.doc)),
      }).toStrictEqual({ workflow: name, stale: false });
    }
  });

  it('grants no OIDC capability in any of the four Qodo PR-Agent workflows', () => {
    // Enumerated from the directory rather than listed by hand, so a fifth file
    // cannot be added without this assertion covering it.
    const onDisk = fs
      .readdirSync(path.join(repoRoot, '.github/workflows'))
      .filter((name) => name.startsWith('qodo-pr-agent') && name.endsWith('.yml'))
      .sort();
    expect(onDisk).toStrictEqual([
      'qodo-pr-agent-report.yml',
      'qodo-pr-agent-reusable.yml',
      'qodo-pr-agent-trigger.yml',
      'qodo-pr-agent.yml',
    ]);
    for (const [name, workflow] of [
      ['trigger', trigger],
      ['reusable', reusable],
      ['caller', caller],
      ['report', report],
    ]) {
      for (const scope of [workflow.doc, ...Object.values(workflow.doc.jobs || {})]) {
        expect(Object.keys(scope.permissions || {})).not.toContain('id-token');
      }
      expect({
        workflow: name,
        namesIt: JSON.stringify(workflow.doc).includes('id-token'),
      }).toStrictEqual({ workflow: name, namesIt: false });
    }
  });

  // PR-Agent reads `.pr_agent.toml` from the ref named by the config URL, so an
  // expression there would hand that ref to the caller and let a pull request
  // supply its own configuration. Both privileged workflows hold the same literal.
  it('loads the Qodo config from a constant develop URL in both run jobs', () => {
    const constant =
      'https://raw.githubusercontent.com/lightspeedwp/.github/develop/.pr_agent.toml';
    for (const [name, workflowDoc] of [
      ['reusable', reusable.doc],
      ['caller', caller.doc],
    ]) {
      // The action runner reads CONFIG.EXTRA_CONFIG_URL; the CLI reads
      // PR_AGENT_EXTRA_CONFIG_URL. Both are constants, so either spelling is a
      // constant and neither may carry an expression.
      const env = qodoStep(workflowDoc).env;
      const url = env['CONFIG.EXTRA_CONFIG_URL'] || env.PR_AGENT_EXTRA_CONFIG_URL;
      expect({ workflow: name, url, derived: /\$\{\{/.test(url) }).toStrictEqual({
        workflow: name,
        url: constant,
        derived: false,
      });
    }
  });

  it('treats the trigger artifact as a hint in both receivers', () => {
    // The pilot receiver resolves the command comment by id; the reusable
    // Both now bind to the exact comment the trigger named. The reusable used to
    // list comments and take the newest match, which let a run answer a later
    // `/ask` than the one that triggered it.
    for (const [name, job] of [
      ['caller', caller.doc.jobs.preflight],
      ['reusable', reusable.doc.jobs.preflight],
    ]) {
      const serialised = JSON.stringify(job);
      expect({
        receiver: name,
        readsPullRequest: serialised.includes('github.rest.pulls.get'),
        // Exactly one comment-read method per receiver, so neither can quietly
        // fall back to scanning comments and lose the binding the id gives.
        listsComments: serialised.includes('github.rest.issues.listComments'),
        fetchesCommentById: serialised.includes('github.rest.issues.getComment'),
        hasEnvironment: job.environment !== undefined,
      }).toStrictEqual({
        receiver: name,
        readsPullRequest: true,
        listsComments: false,
        fetchesCommentById: true,
        hasEnvironment: false,
      });
    }
    // Neither receiver may quietly fall back to scanning comments.
    expect(JSON.stringify(caller.doc.jobs.preflight)).not.toContain('listComments');
    expect(JSON.stringify(reusable.doc.jobs.preflight)).not.toContain('listComments');
  });

  it('states the split contract in the specification, not the superseded one', () => {
    const contract = fs.readFileSync(
      path.join(
        repoRoot,
        '.github/specs/019-qodo-pr-agent-integration/contracts/reusable-workflow.md'
      ),
      'utf8'
    );
    // One label per clause, so a failure says which one drifted. The superseded
    // clauses are matched on the table rows that declared them, not on the words
    // alone: the updated document may name a removed input while explaining why
    // it went, and that must not read as a live requirement.
    expect({
      namesPrivilegedReceiver: contract.includes('workflow_run'),
      namesUnprivilegedTrigger:
        contract.includes('pull_request') && contract.includes('issue_comment'),
      namesTheTriggerWorkflow: contract.includes('qodo-pr-agent-trigger.yml'),
      namesTheConstantDevelopConfigUrl: contract.includes('develop/.pr_agent.toml'),
      namesTheEnvironmentSecret: contract.includes('qodo-pr-agent'),
      forbidsCheckout: contract.includes('actions/checkout'),
      stillDeclaresAConfigRefInput: /^\|\s*`config_ref`\s*\|/m.test(contract),
      stillBuildsTheConfigUrlFromAnInput: /^\|\s*`CONFIG\.EXTRA_CONFIG_URL`\s*\|.*\$\{\{/m.test(
        contract
      ),
      stillDocumentsTheNoCredentialSkip: /^\|\s*`model_credential`\s*\|.*no-credential/m.test(
        contract
      ),
    }).toStrictEqual({
      namesPrivilegedReceiver: true,
      namesUnprivilegedTrigger: true,
      namesTheTriggerWorkflow: true,
      namesTheConstantDevelopConfigUrl: true,
      namesTheEnvironmentSecret: true,
      forbidsCheckout: true,
      stillDeclaresAConfigRefInput: false,
      stillBuildsTheConfigUrlFromAnInput: false,
      stillDocumentsTheNoCredentialSkip: false,
    });
    // The tasks file still points its acceptance list at this suite. Its clause
    // text is what the contract above replaces, so only the pointer is asserted.
    const tasks = fs.readFileSync(
      path.join(repoRoot, '.github/specs/019-qodo-pr-agent-integration/tasks.md'),
      'utf8'
    );
    const t005 = tasks.split('\n').find((line) => line.startsWith('- [X] T005'));
    expect(t005).toBeDefined();
    expect(t005).toContain('tests/js/qodo-pr-agent-workflow.test.js');
  });
});
