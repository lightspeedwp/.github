/**
 * Executes the github-script steps of the organisation reusable workflows
 * (ai-feedback-validation.yml, orchestrate-phase-progression.yml) against
 * mocked `github`, `context` and `core`, the way actions/github-script runs
 * them: as the body of an async function.
 */
const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const repositoryRoot = path.resolve(__dirname, '../../..');

function loadStep(workflowFile, jobId, stepName) {
  const workflow = YAML.parse(
    fs.readFileSync(path.join(repositoryRoot, '.github/workflows', workflowFile), 'utf8')
  );
  const step = workflow.jobs[jobId].steps.find((candidate) => candidate.name === stepName);

  if (!step) {
    throw new Error(`${stepName} not found in ${workflowFile}#${jobId}`);
  }

  return step;
}

// github-script resolves relative requires from the workspace root, which
// is this repository's checkout in the called workflow.
function workspaceRequire(request) {
  return require(request.startsWith('./') ? path.join(repositoryRoot, request) : request);
}

function httpError(status) {
  const error = new Error(`HTTP ${status}`);
  error.status = status;
  return error;
}

function makeCore() {
  return {
    info: jest.fn(),
    warning: jest.fn(),
    setFailed: jest.fn(),
  };
}

function makeGithub(overrides = {}) {
  const calls = {
    addLabels: [],
    removeLabel: [],
    createComment: [],
    updateComment: [],
    deleteComment: [],
  };
  const issues = {
    listComments: jest.fn(async () => overrides.comments || []),
    createComment: jest.fn(async (params) => calls.createComment.push(params)),
    updateComment: jest.fn(async (params) => calls.updateComment.push(params)),
    deleteComment: jest.fn(async (params) => calls.deleteComment.push(params)),
    listLabelsForRepo: jest.fn(async () => (overrides.repoLabels || []).map((name) => ({ name }))),
    addLabels: jest.fn(async (params) => calls.addLabels.push(params)),
    removeLabel: jest.fn(async (params) => calls.removeLabel.push(params)),
    get: jest.fn(async ({ issue_number: number }) => ({ data: overrides.issues[number] })),
    ...overrides.issuesApi,
  };
  const repos = {
    getContent: jest.fn(async () => {
      if (overrides.feedbackFile === undefined) {
        throw httpError(404);
      }
      return { data: { content: Buffer.from(overrides.feedbackFile).toString('base64') } };
    }),
  };

  return {
    calls,
    github: {
      rest: { issues, repos },
      paginate: jest.fn(async (method, params) => method(params)),
    },
  };
}

async function runScript(step, { github, context, core, env = {} }) {
  const saved = {};
  for (const [name, value] of Object.entries(env)) {
    saved[name] = process.env[name];
    process.env[name] = value;
  }

  try {
    const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
    const fn = new AsyncFunction('require', 'github', 'context', 'core', step.with.script);
    await fn(workspaceRequire, github, context, core);
  } finally {
    for (const [name, value] of Object.entries(saved)) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
  }
}

const repo = { owner: 'lightspeedwp', repo: 'example' };

function prContext({ body = '', author = 'someone', action = 'opened', merged = false } = {}) {
  return {
    repo,
    payload: {
      action,
      pull_request: {
        number: 42,
        body,
        merged,
        user: { login: author },
        head: { sha: 'abc123', repo: { name: 'example', owner: { login: 'lightspeedwp' } } },
      },
    },
  };
}

const VALID_FEEDBACK = [
  '# AI Feedback Response',
  '## Feedback',
  '| Feedback | Status |',
  '| Quote it | ✅ Addressed |',
  'All feedback addressed.',
].join('\n');

describe('ai-feedback-validation.yml', () => {
  const step = loadStep(
    'ai-feedback-validation.yml',
    'validate-feedback-linkage',
    'Check PR-issue linkage and feedback response'
  );

  test('skips bot authors without any API call', async () => {
    const { github } = makeGithub();
    const core = makeCore();

    await runScript(step, { github, context: prContext({ author: 'dependabot[bot]' }), core });

    expect(github.rest.repos.getContent).not.toHaveBeenCalled();
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('warn-only by default: comments and warns, never fails', async () => {
    const { github, calls } = makeGithub();
    const core = makeCore();

    await runScript(step, {
      github,
      context: prContext({ body: 'no link' }),
      core,
      env: { ENFORCE: 'false' },
    });

    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.warning).toHaveBeenCalledWith(expect.stringContaining('warn-only'));
    expect(calls.createComment).toHaveLength(1);
    expect(calls.createComment[0].body).toContain('No issue link found');
  });

  test('enforce: true fails the check', async () => {
    const { github } = makeGithub();
    const core = makeCore();

    await runScript(step, {
      github,
      context: prContext({ body: 'no link' }),
      core,
      env: { ENFORCE: 'true' },
    });

    expect(core.setFailed).toHaveBeenCalledWith('AI feedback validation failed for PR #42');
  });

  test('reads FEEDBACK_RESPONSE.md from the PR head via the API', async () => {
    const { github, calls } = makeGithub({ feedbackFile: VALID_FEEDBACK });
    const core = makeCore();

    await runScript(step, {
      github,
      context: prContext({ body: 'Closes #7' }),
      core,
      env: { ENFORCE: 'true' },
    });

    expect(github.rest.repos.getContent).toHaveBeenCalledWith({
      owner: 'lightspeedwp',
      repo: 'example',
      path: 'FEEDBACK_RESPONSE.md',
      ref: 'abc123',
    });
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(calls.createComment).toHaveLength(0);
  });

  test('deletes a stale report once the PR passes', async () => {
    const { github, calls } = makeGithub({
      comments: [{ id: 9, user: { type: 'Bot' }, body: '<!-- ai-feedback-validation --> old' }],
    });
    const core = makeCore();

    await runScript(step, { github, context: prContext({ body: 'Resolves #7' }), core });

    expect(calls.deleteComment).toEqual([{ ...repo, comment_id: 9 }]);
  });

  test('a read-only token (403) degrades to a warning', async () => {
    const { github } = makeGithub({
      issuesApi: {
        listComments: jest.fn(async () => {
          throw httpError(403);
        }),
      },
    });
    const core = makeCore();

    await expect(
      runScript(step, { github, context: prContext({ body: 'no link' }), core })
    ).resolves.toBeUndefined();
    expect(core.warning).toHaveBeenCalledWith(expect.stringContaining('No permission to comment'));
  });

  test('a fork whose head repository was deleted is treated as no feedback file', async () => {
    const { github } = makeGithub();
    const core = makeCore();
    const context = prContext({ body: 'Closes #7' });
    context.payload.pull_request.head.repo = null;

    await runScript(step, { github, context, core, env: { ENFORCE: 'true' } });

    expect(github.rest.repos.getContent).not.toHaveBeenCalled();
    expect(core.setFailed).not.toHaveBeenCalled();
  });
});

describe('orchestrate-phase-progression.yml', () => {
  const syncStep = loadStep(
    'orchestrate-phase-progression.yml',
    'sync-labels-on-issue-event',
    'Sync labels'
  );
  const prStep = loadStep(
    'orchestrate-phase-progression.yml',
    'orchestrate-pr-progression',
    'Advance linked issues'
  );

  function issueContext(action, labels) {
    return {
      repo,
      payload: {
        action,
        issue: { number: 5, title: 't', body: '', labels: labels.map((name) => ({ name })) },
      },
    };
  }

  test('issue opened: adds the recommended status label that exists, skips missing ones', async () => {
    const { github, calls } = makeGithub({ repoLabels: ['status:needs-planning'] });
    const core = makeCore();

    await runScript(syncStep, {
      github,
      context: issueContext('opened', ['openspec:specification-pending', 'type:feature']),
      core,
      env: { DRY_RUN: 'false' },
    });

    expect(calls.addLabels).toEqual([
      { ...repo, issue_number: 5, labels: ['status:needs-planning'] },
    ]);
    expect(core.warning).toHaveBeenCalledWith(expect.stringContaining('priority:important'));
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('issue event with no openspec label changes nothing', async () => {
    const { github, calls } = makeGithub({ repoLabels: ['status:needs-planning'] });
    const core = makeCore();

    await runScript(syncStep, {
      github,
      context: issueContext('labeled', ['type:bug']),
      core,
      env: { DRY_RUN: 'false' },
    });

    expect(calls.addLabels).toEqual([]);
    expect(calls.removeLabel).toEqual([]);
  });

  test('dry run writes nothing', async () => {
    const { github, calls } = makeGithub({
      repoLabels: ['status:needs-planning', 'priority:important'],
    });
    const core = makeCore();

    await runScript(syncStep, {
      github,
      context: issueContext('opened', ['openspec:specification-pending']),
      core,
      env: { DRY_RUN: 'true' },
    });

    expect(calls.addLabels).toEqual([]);
  });

  test('PR opened advances a linked issue one phase', async () => {
    const { github, calls } = makeGithub({
      repoLabels: ['openspec:specification-pending', 'openspec:specification-in-progress'],
      issues: {
        7: {
          number: 7,
          title: 't',
          body: '',
          labels: [{ name: 'openspec:specification-pending' }],
        },
      },
    });
    const core = makeCore();

    await runScript(prStep, {
      github,
      context: prContext({ body: 'Closes #7' }),
      core,
      env: { DRY_RUN: 'false' },
    });

    expect(calls.removeLabel).toEqual([
      { ...repo, issue_number: 7, name: 'openspec:specification-pending' },
    ]);
    expect(calls.addLabels).toEqual([
      { ...repo, issue_number: 7, labels: ['openspec:specification-in-progress'] },
    ]);
  });

  test('PR merged completes an in-progress phase', async () => {
    const { github, calls } = makeGithub({
      repoLabels: ['openspec:implementation-in-progress', 'openspec:implementation-complete'],
      issues: {
        7: {
          number: 7,
          title: 't',
          body: '',
          labels: [{ name: 'openspec:implementation-in-progress' }],
        },
      },
    });
    const core = makeCore();

    await runScript(prStep, {
      github,
      context: prContext({ body: 'Fixes #7', action: 'closed', merged: true }),
      core,
      env: { DRY_RUN: 'false' },
    });

    expect(calls.addLabels[0].labels).toEqual(['openspec:implementation-complete']);
  });

  test('never strips the current phase when the next label is missing from the repository', async () => {
    const { github, calls } = makeGithub({
      repoLabels: ['openspec:specification-pending'],
      issues: {
        7: {
          number: 7,
          title: 't',
          body: '',
          labels: [{ name: 'openspec:specification-pending' }],
        },
      },
    });
    const core = makeCore();

    await runScript(prStep, {
      github,
      context: prContext({ body: 'Closes #7' }),
      core,
      env: { DRY_RUN: 'false' },
    });

    expect(calls.removeLabel).toEqual([]);
    expect(calls.addLabels).toEqual([]);
    expect(core.warning).toHaveBeenCalledWith(expect.stringContaining('phase not advanced'));
  });

  test('skips linked numbers that are pull requests', async () => {
    const { github, calls } = makeGithub({
      repoLabels: ['openspec:specification-in-progress'],
      issues: {
        8: { number: 8, pull_request: {}, labels: [{ name: 'openspec:specification-pending' }] },
      },
    });
    const core = makeCore();

    await runScript(prStep, {
      github,
      context: prContext({ body: 'Closes #8' }),
      core,
      env: { DRY_RUN: 'false' },
    });

    expect(calls.addLabels).toEqual([]);
    expect(calls.removeLabel).toEqual([]);
  });

  test('PR without linked issues makes no label calls', async () => {
    const { github } = makeGithub();
    const core = makeCore();

    await runScript(prStep, {
      github,
      context: prContext({ body: 'nothing linked' }),
      core,
      env: { DRY_RUN: 'false' },
    });

    expect(github.rest.issues.listLabelsForRepo).not.toHaveBeenCalled();
  });
});
