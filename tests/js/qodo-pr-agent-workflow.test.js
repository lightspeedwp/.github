/**
 * Contract test for the Qodo PR-Agent workflows.
 *
 * Source of truth: .github/specs/017-qodo-pr-agent-integration/contracts/reusable-workflow.md
 */
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const repoRoot = path.resolve(__dirname, '../..');
const reusablePath = '.github/workflows/qodo-pr-agent-reusable.yml';
const callerPath = '.github/workflows/qodo-pr-agent.yml';

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

function allSteps(doc) {
  return Object.values(doc.jobs || {}).flatMap((job) => job.steps || []);
}

function qodoStep(doc) {
  return allSteps(doc).find((step) =>
    String(step.uses || '').startsWith('docker://pragent/pr-agent')
  );
}

function preflightScript(doc) {
  const steps = doc.jobs?.preflight?.steps || [];
  return steps.map((step) => String(step.with?.script || step.run || '')).join('\n');
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
  });

  it('uses least-privilege permissions', () => {
    expect(doc.permissions).toStrictEqual({ contents: 'read' });
    expect(doc.jobs.preflight.permissions).toStrictEqual({});
    expect(doc.jobs.preflight['timeout-minutes']).toBe(2);
    expect(doc.jobs.run.permissions).toStrictEqual({
      contents: 'read',
      'pull-requests': 'write',
      issues: 'write',
    });
    expect(doc.jobs.run['timeout-minutes']).toBe(15);
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
    });
    expect(doc.permissions).toStrictEqual({ contents: 'read' });
  });
});
