/**
 * Tests for the label consolidation engine and CLI (spec 008, T062, T062b,
 * T062c, T065, T065a, T067; FR-016, FR-023).
 *
 * GitHub is replaced by an in-memory fake and every file lands in a temporary
 * checkout, so nothing touches the network or the repository.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  ConsolidationError,
  applyStage3,
  applyStage4,
  generateDryRun,
  postSummary,
  readJsonFile,
  recordApproval,
  recordManualStep,
  runStage,
} from '../includes/consolidation-engine.js';
import { buildApprovedSet, buildMappingIndex } from '../includes/consolidation-plan.js';
import { PrivateEvidenceError } from '../includes/private-evidence.js';
import { readLog, resumeRun, startRun, StaleEpochError } from '../includes/consolidation-run.js';
import { main } from '../label-consolidate.js';

const roots = [];
const EVIDENCE = '.github/reports/audits/2026-09-14-label-audit/evidence';

/** An in-memory stand-in for the consolidation client. */
class FakeGithub {
  constructor() {
    this.repos = new Map();
    this.writes = [];
    this.comments = new Map();
    this.nextCommentId = 1;
    this.failures = [];
    this.openIssues = new Set();
  }

  addRepo(fullName, { labels = [], items = [] } = {}) {
    this.repos.set(fullName, {
      labels: labels.map((l) => ({ color: 'ededed', description: '', ...l })),
      items: items.map((i) => ({ state: 'open', ...i, labels: [...i.labels] })),
    });
  }

  /** Throws on the next write that matches, before (default) or after it mutates. */
  failOnce(op, { after = false, match = () => true } = {}) {
    this.failures.push({ op, after, match });
  }

  repo(fullName) {
    const repo = this.repos.get(fullName);
    if (!repo) {
      throw new Error(`GitHub API error: 404 ${fullName}`);
    }
    return repo;
  }

  async write(op, args, mutate) {
    const index = this.failures.findIndex((f) => f.op === op && f.match(args));
    const failure = index >= 0 ? this.failures.splice(index, 1)[0] : null;
    if (failure && !failure.after) {
      throw new Error(`injected failure before ${op}`);
    }
    mutate();
    this.writes.push({ op, ...args });
    if (failure) {
      throw new Error(`injected failure after ${op}`);
    }
  }

  async listLabels(fullName) {
    const { labels } = this.repo(fullName);
    return {
      labels: labels.map((l) => ({ ...l })),
      pages: Math.max(1, Math.ceil(labels.length / 100)),
    };
  }

  async listItemsByLabel(fullName, label) {
    return this.repo(fullName)
      .items.filter((i) => i.kind !== 'discussion' && i.labels.includes(label))
      .map((i) => ({ ...i, labels: [...i.labels] }));
  }

  async listDiscussionsByLabel(fullName, label) {
    return this.repo(fullName)
      .items.filter((i) => i.kind === 'discussion' && i.labels.includes(label))
      .map((i) => ({ ...i, labels: [...i.labels] }));
  }

  forgetDiscussions() {}

  async getIssue(fullName, number) {
    if (this.openIssues.has(`${fullName}#${number}`)) {
      return { number, state: 'open' };
    }
    const found = this.repos
      .get(fullName)
      ?.items.find((i) => i.number === number && i.kind !== 'discussion');
    return found ? { number, state: found.state } : null;
  }

  async getViewerLogin() {
    return 'ashleyshaw';
  }

  async listRepos() {
    return [...this.repos.keys()].map((full) => ({
      full_name: full,
      name: full.split('/')[1],
      private: false,
    }));
  }

  async createLabel(fullName, label) {
    return this.write('createLabel', { fullName, label }, () =>
      this.repo(fullName).labels.push({ color: 'ededed', description: '', ...label })
    );
  }

  async updateLabel(fullName, currentName, patch) {
    return this.write('updateLabel', { fullName, currentName, patch }, () => {
      const repo = this.repo(fullName);
      const label = repo.labels.find((l) => l.name === currentName);
      const { new_name: newName, ...rest } = patch;
      Object.assign(label, rest);
      if (newName) {
        label.name = newName;
        repo.items.forEach((i) => {
          i.labels = i.labels.map((n) => (n === currentName ? newName : n));
        });
      }
    });
  }

  async deleteLabel(fullName, name) {
    return this.write('deleteLabel', { fullName, name }, () => {
      const repo = this.repo(fullName);
      repo.labels = repo.labels.filter((l) => l.name !== name);
      repo.items.forEach((i) => {
        i.labels = i.labels.filter((n) => n !== name);
      });
    });
  }

  async addLabelToItem(fullName, number, label) {
    return this.write('addLabel', { fullName, number, label }, () => {
      const item = this.repo(fullName).items.find(
        (i) => i.number === number && i.kind !== 'discussion'
      );
      if (!item.labels.includes(label)) item.labels.push(label);
    });
  }

  async removeLabelFromItem(fullName, number, label) {
    return this.write('removeLabel', { fullName, number, label }, () => {
      const item = this.repo(fullName).items.find(
        (i) => i.number === number && i.kind !== 'discussion'
      );
      item.labels = item.labels.filter((n) => n !== label);
    });
  }

  async setDiscussionLabel(fullName, number, label, mode) {
    return this.write('discussionLabel', { fullName, number, label, mode }, () => {
      const item = this.repo(fullName).items.find(
        (i) => i.number === number && i.kind === 'discussion'
      );
      item.labels =
        mode === 'add'
          ? [...new Set([...item.labels, label])]
          : item.labels.filter((n) => n !== label);
    });
  }

  async postComment(fullName, number, body) {
    const key = `${fullName}#${number}`;
    const comment = {
      id: this.nextCommentId,
      user: { login: 'bot' },
      body,
      created_at: '2026-10-05T10:00:00Z',
    };
    this.nextCommentId += 1;
    this.comments.set(key, [...(this.comments.get(key) ?? []), comment]);
    this.writes.push({ op: 'comment', fullName, number, body });
    return comment;
  }

  /** Adds a comment as a given user and returns its URL. */
  addComment(fullName, number, login, body) {
    const key = `${fullName}#${number}`;
    const comment = {
      id: this.nextCommentId,
      user: { login },
      body,
      created_at: '2026-10-05T11:00:00Z',
    };
    this.nextCommentId += 1;
    this.comments.set(key, [...(this.comments.get(key) ?? []), comment]);
    return `https://github.com/${fullName}/issues/${number}#issuecomment-${comment.id}`;
  }

  async getCommentByUrl(url) {
    const match = /^https:\/\/github\.com\/(.+)\/issues\/(\d+)#issuecomment-(\d+)$/.exec(url);
    if (!match) return null;
    return (
      (this.comments.get(`${match[1]}#${match[2]}`) ?? []).find((c) => String(c.id) === match[3]) ??
      null
    );
  }

  async listIssueComments(fullName, number) {
    return this.comments.get(`${fullName}#${number}`) ?? [];
  }

  /** Writes made to GitHub, excluding gate comments. */
  labelWrites() {
    return this.writes.filter((w) => w.op !== 'comment');
  }
}

/** Creates a temporary checkout with Git and the private directory ignored. */
function makeRoot({ ignorePrivate = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'label-consolidate-'));
  roots.push(root);
  execFileSync('git', ['init', '-q'], { cwd: root });
  if (ignorePrivate) {
    fs.writeFileSync(path.join(root, '.gitignore'), '/.private-evidence/\n');
  }
  return root;
}

const APPROVED = buildApprovedSet([
  { name: 'aiops:agents', color: '0E8A16', description: 'AI ops agents' },
  { name: 'priority:normal', color: 'FBCA04', description: 'Normal priority' },
  { name: 'type:bug', color: 'D73A4A', description: 'Bug' },
]);
const MAPPINGS = buildMappingIndex({
  mappings: [
    { source: 'ai-ops:agents', systems: ['github'], action: 'rename', target: 'aiops:agents' },
    { source: 'priority:medium', systems: ['github'], action: 'merge', target: 'priority:normal' },
  ],
});

const PUBLIC_REPO = { name: 'open-repo', full_name: 'lightspeedwp/open-repo', private: false };
const PRIVATE_REPO = { name: 'client-x', full_name: 'lightspeedwp/client-x', private: true };
const GATE_PUBLIC = 100;
const GATE_PRIVATE = 7;
const PRIVATE_REPORTS = 'lightspeedwp/private-reports';

let tick = 0;

/** Builds an engine context. */
function makeCtx({ gh, root, apply = false, run, privateClient }) {
  return {
    client: gh,
    privateClient,
    org: 'lightspeedwp',
    root,
    apply,
    run,
    approved: APPROVED,
    mappingIndex: MAPPINGS,
    currentApprovedSetCommit: 'commit-a',
    gates: {
      publicRepository: 'lightspeedwp/.github',
      publicIssue: GATE_PUBLIC,
      privateRepository: PRIVATE_REPORTS,
      privateIssue: GATE_PRIVATE,
    },
    now: () => new Date(Date.UTC(2026, 9, 5, 9, 0, (tick += 1))),
    done: [],
  };
}

const evidenceDir = (root) => path.join(root, EVIDENCE);
const publicLog = (root) => path.join(evidenceDir(root), 'consolidation-log.jsonl');
const privateLog = (root) => path.join(root, '.private-evidence', 'consolidation-log.jsonl');

/** A repository with something to rename, create, relabel and delete. */
function seedRepo(gh, fullName) {
  gh.addRepo(fullName, {
    labels: [
      { name: 'ai-ops:agents', color: 'ffffff' },
      { name: 'priority:medium' },
      { name: 'priority:normal', color: 'fbca04', description: 'Normal priority' },
      { name: 'legacy', color: 'ededed' },
      { name: 'stale-tag' },
    ],
    items: [
      { kind: 'issue', number: 1, labels: ['priority:medium'] },
      { kind: 'pull_request', number: 2, state: 'closed', labels: ['priority:medium'] },
      { kind: 'discussion', number: 3, labels: ['priority:medium'] },
      { kind: 'issue', number: 4, labels: ['legacy'] },
    ],
  });
}

afterAll(() => {
  roots.forEach((root) => fs.rmSync(root, { force: true, recursive: true }));
});

describe('dry run (the default)', () => {
  test('writes the dry-run file and makes no change on GitHub', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PUBLIC_REPO.full_name);
    const ctx = makeCtx({ gh, root });
    const outcomes = await runStage(ctx, [PUBLIC_REPO], '4');
    expect(outcomes).toEqual([
      { repository: 'lightspeedwp/open-repo', status: 'dry-run', problems: [] },
    ]);
    expect(gh.labelWrites()).toEqual([]);
    const record = readJsonFile(path.join(evidenceDir(root), 'dry-run', 'open-repo.json'));
    expect(record).toMatchObject({
      repository: 'lightspeedwp/open-repo',
      approved_set_commit: 'commit-a',
      label_count: 5,
      pages_read: 1,
      approved_set_count: 3,
      executed_at: { 3: null, 4: null },
      to_rename: [{ from: 'ai-ops:agents', to: 'aiops:agents' }],
      approval: { status: 'pending' },
    });
    expect(record.to_delete.map((d) => d.name)).toEqual([
      'ai-ops:agents',
      'priority:medium',
      'legacy',
      'stale-tag',
    ]);
    expect(record.to_delete.find((d) => d.name === 'priority:medium')).toMatchObject({
      migrate_to: 'priority:normal',
      open_items: [
        { kind: 'issue', number: 1 },
        { kind: 'discussion', number: 3 },
      ],
      closed_items: [{ kind: 'pull_request', number: 2 }],
    });
    expect(record.needs_decision).toEqual(['legacy']);
  });

  test('the apply functions refuse to write without apply, even when called directly', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PUBLIC_REPO.full_name);
    const dry = makeCtx({ gh, root });
    await generateDryRun(dry, PUBLIC_REPO);
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '3' });
    await expect(applyStage3({ ...dry, run }, PUBLIC_REPO)).rejects.toThrow(/dry run/);
    expect(gh.labelWrites()).toEqual([]);
  });

  test('regenerating a dry run after Stage 4 finished is refused (rule 7)', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PUBLIC_REPO.full_name);
    const ctx = makeCtx({ gh, root });
    await generateDryRun(ctx, PUBLIC_REPO);
    const file = path.join(evidenceDir(root), 'dry-run', 'open-repo.json');
    const record = readJsonFile(file);
    record.executed_at['4'] = '2026-10-06T00:00:00Z';
    fs.writeFileSync(file, JSON.stringify(record));
    await expect(generateDryRun(ctx, PUBLIC_REPO)).rejects.toThrow(/already finished Stage 4/);
  });
});

describe('Stage 3', () => {
  async function prepared() {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PUBLIC_REPO.full_name);
    await generateDryRun(makeCtx({ gh, root }), PUBLIC_REPO);
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '3', host: 'box' });
    return { root, gh, run, ctx: makeCtx({ gh, root, apply: true, run }) };
  }

  test('renames, creates, updates and relabels, logging an intended and a done record for each', async () => {
    const { root, gh, run, ctx } = await prepared();
    const result = await applyStage3(ctx, PUBLIC_REPO);
    expect(result.status).toBe('finished');
    const labels = gh.repos.get(PUBLIC_REPO.full_name).labels.map((l) => l.name);
    expect(labels).toEqual(expect.arrayContaining(['aiops:agents', 'type:bug']));
    expect(labels).not.toContain('ai-ops:agents');
    // The mapped source keeps its items' label until the gated Stage 4 deletion, but the target is added.
    const items = gh.repos.get(PUBLIC_REPO.full_name).items;
    expect(items.find((i) => i.number === 1).labels).toEqual([
      'priority:medium',
      'priority:normal',
    ]);
    expect(items.find((i) => i.number === 3).labels).toEqual([
      'priority:medium',
      'priority:normal',
    ]);
    const log = readLog(publicLog(root));
    expect(log.length).toBeGreaterThan(0);
    log.forEach((r) => expect(r.op_id.startsWith(`${run.runId}-`)).toBe(true));
    const intended = log.filter((r) => r.state === 'intended').map((r) => r.op_id);
    const done = log.filter((r) => r.state === 'done').map((r) => r.op_id);
    expect(done).toEqual(intended);
    expect(log[0]).toMatchObject({
      run_by: 'ashleyshaw',
      gate_issue: GATE_PUBLIC,
      state: 'intended',
    });
    expect(
      readJsonFile(path.join(evidenceDir(root), 'dry-run', 'open-repo.json')).executed_at[3]
    ).toBeTruthy();
  });

  test('a re-run on a finished repository makes no API write and adds no log record', async () => {
    const { root, gh, ctx } = await prepared();
    await applyStage3(ctx, PUBLIC_REPO);
    const writes = gh.writes.length;
    const lines = fs.readFileSync(publicLog(root), 'utf8').split('\n').length;
    const again = await applyStage3(ctx, PUBLIC_REPO);
    expect(again).toMatchObject({ status: 'skipped', reason: 'Stage 3 already finished' });
    expect(gh.writes).toHaveLength(writes);
    expect(fs.readFileSync(publicLog(root), 'utf8').split('\n')).toHaveLength(lines);
  });

  test('a Stage 3 finish never hides the repository from Stage 4', async () => {
    const { root, ctx } = await prepared();
    await applyStage3(ctx, PUBLIC_REPO);
    const record = readJsonFile(path.join(evidenceDir(root), 'dry-run', 'open-repo.json'));
    expect(record.executed_at[4]).toBeNull();
  });

  test('a failed API call writes no done record and leaves its intended record', async () => {
    const { root, gh, ctx } = await prepared();
    gh.failOnce('createLabel');
    await expect(applyStage3(ctx, PUBLIC_REPO)).rejects.toThrow(/injected failure/);
    const log = readLog(publicLog(root));
    const last = log[log.length - 1];
    expect(last.state).toBe('intended');
    expect(log.filter((r) => r.op_id === last.op_id)).toHaveLength(1);
    expect(
      readJsonFile(path.join(evidenceDir(root), 'dry-run', 'open-repo.json')).executed_at[3]
    ).toBeNull();
  });

  test('a resume retries an intended change that did not happen, then finishes', async () => {
    const { root, gh, run, ctx } = await prepared();
    gh.failOnce('createLabel');
    await expect(applyStage3(ctx, PUBLIC_REPO)).rejects.toThrow();
    const resumed = resumeRun({
      dir: evidenceDir(root),
      runId: run.runId,
      host: 'box',
      isAlive: () => false,
    });
    const outcomes = await runStage(
      makeCtx({ gh, root, apply: true, run: resumed }),
      [PUBLIC_REPO],
      '3'
    );
    expect(outcomes[0].status).toBe('finished');
    const log = readLog(publicLog(root));
    const unmatched = log.filter(
      (r) => r.state === 'intended' && !log.some((d) => d.state === 'done' && d.op_id === r.op_id)
    );
    expect(unmatched).toEqual([]);
    const created = gh.writes.filter((w) => w.op === 'createLabel').map((w) => w.label.name);
    expect(new Set(created).size).toBe(created.length);
    expect(gh.repos.get(PUBLIC_REPO.full_name).labels.map((l) => l.name)).toContain('type:bug');
  });

  test('a resume completes an intended change that already happened without writing it twice', async () => {
    const { root, gh, run, ctx } = await prepared();
    gh.failOnce('createLabel', { after: true });
    await expect(applyStage3(ctx, PUBLIC_REPO)).rejects.toThrow(/after createLabel/);
    const createsBefore = gh.writes.filter((w) => w.op === 'createLabel').length;
    const resumed = resumeRun({
      dir: evidenceDir(root),
      runId: run.runId,
      host: 'box',
      isAlive: () => false,
    });
    await runStage(makeCtx({ gh, root, apply: true, run: resumed }), [PUBLIC_REPO], '3');
    const labels = gh.repos.get(PUBLIC_REPO.full_name).labels.map((l) => l.name);
    // The label whose create "failed after" exists exactly once.
    expect(
      labels.filter((n) => n === gh.writes.find((w) => w.op === 'createLabel').label.name)
    ).toHaveLength(1);
    expect(gh.writes.filter((w) => w.op === 'createLabel').length).toBeGreaterThanOrEqual(
      createsBefore
    );
  });

  test('a stopped run is resumed with the repositories that have no executed_at for its stage', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    const other = { name: 'second', full_name: 'lightspeedwp/second', private: false };
    seedRepo(gh, PUBLIC_REPO.full_name);
    seedRepo(gh, other.full_name);
    const dry = makeCtx({ gh, root });
    await generateDryRun(dry, PUBLIC_REPO);
    await generateDryRun(dry, other);
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '3', host: 'box' });
    const ctx = makeCtx({ gh, root, apply: true, run });
    await applyStage3(ctx, PUBLIC_REPO);
    gh.failOnce('createLabel', { match: (a) => a.fullName === other.full_name });
    await expect(runStage(ctx, [PUBLIC_REPO, other], '3')).rejects.toThrow();
    const resumed = resumeRun({
      dir: evidenceDir(root),
      runId: run.runId,
      host: 'box',
      isAlive: () => false,
    });
    const writesBefore = gh.writes.filter((w) => w.fullName === PUBLIC_REPO.full_name).length;
    const outcomes = await runStage(
      makeCtx({ gh, root, apply: true, run: resumed }),
      [PUBLIC_REPO, other],
      '3'
    );
    expect(outcomes.map((o) => o.status)).toEqual(['skipped', 'finished']);
    expect(gh.writes.filter((w) => w.fullName === PUBLIC_REPO.full_name)).toHaveLength(
      writesBefore
    );
  });

  test('a repository with no dry-run file is skipped, not guessed at', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PUBLIC_REPO.full_name);
    const run = startRun({ dir: evidenceDir(root), runBy: 'a', stage: '3' });
    const result = await applyStage3(makeCtx({ gh, root, apply: true, run }), PUBLIC_REPO);
    expect(result.status).toBe('skipped');
    expect(gh.labelWrites()).toEqual([]);
  });
});

describe('Stage 4', () => {
  /** Dry run, approval comment and a Stage 4 run for one repository. */
  async function approvedRepo({
    repo = PUBLIC_REPO,
    author = 'ashleyshaw',
    gateRepo,
    gateIssue,
  } = {}) {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, repo.full_name);
    // Pre-resolve the needs_decision label so the dry run can be approved.
    gh.repos.get(repo.full_name).items = gh.repos
      .get(repo.full_name)
      .items.filter((i) => i.number !== 4);
    const dry = makeCtx({ gh, root });
    const { record } = await generateDryRun(dry, repo);
    const gate = repo.private
      ? { repo: PRIVATE_REPORTS, issue: GATE_PRIVATE }
      : { repo: 'lightspeedwp/.github', issue: GATE_PUBLIC };
    const url = gh.addComment(
      gateRepo ?? gate.repo,
      gateIssue ?? gate.issue,
      author,
      `Approved: ${record.repository} dry run ${record.generated_at}`
    );
    const verdict = await recordApproval(dry, repo, url);
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '4', host: 'box' });
    return { root, gh, run, record, url, verdict, ctx: makeCtx({ gh, root, apply: true, run }) };
  }

  test('deletes only after migrating the items to the target label, and logs every change', async () => {
    const { root, gh, ctx, verdict } = await approvedRepo();
    expect(verdict.ok).toBe(true);
    const result = await applyStage4(ctx, PUBLIC_REPO);
    expect(result.status).toBe('finished');
    const repo = gh.repos.get(PUBLIC_REPO.full_name);
    expect(repo.labels.map((l) => l.name)).toEqual(['priority:normal']);
    expect(repo.items.find((i) => i.number === 1).labels).toEqual(['priority:normal']);
    expect(repo.items.find((i) => i.number === 3).labels).toEqual(['priority:normal']);
    expect(repo.items.find((i) => i.number === 2).labels).toEqual(['priority:normal']);
    // Each label is migrated before it is deleted.
    const writes = gh.labelWrites();
    const deleteAt = writes.findIndex(
      (w) => w.op === 'deleteLabel' && w.name === 'priority:medium'
    );
    const addsBefore = writes
      .slice(0, deleteAt)
      .filter(
        (w) => (w.op === 'addLabel' || w.op === 'discussionLabel') && w.label === 'priority:normal'
      );
    expect(addsBefore).toHaveLength(3);
    const log = readLog(publicLog(root));
    expect(
      log.some((r) => r.action === 'delete' && r.label === 'priority:medium' && r.state === 'done')
    ).toBe(true);
    expect(
      readJsonFile(path.join(evidenceDir(root), 'dry-run', 'open-repo.json')).executed_at[4]
    ).toBeTruthy();
  });

  test('refuses a repository whose dry run was never approved', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PUBLIC_REPO.full_name);
    const dry = makeCtx({ gh, root });
    await generateDryRun(dry, PUBLIC_REPO);
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '4' });
    const result = await applyStage4(makeCtx({ gh, root, apply: true, run }), PUBLIC_REPO);
    expect(result).toMatchObject({ status: 'skipped' });
    expect(result.reason).toMatch(/not approved/);
    expect(gh.labelWrites()).toEqual([]);
  });

  test('an approval comment from anyone but @ashleyshaw is not recorded', async () => {
    const { verdict, root } = await approvedRepo({ author: 'someone-else' });
    expect(verdict.ok).toBe(false);
    expect(
      readJsonFile(path.join(evidenceDir(root), 'dry-run', 'open-repo.json')).approval.status
    ).toBe('pending');
  });

  test('an approval does not carry over to a regenerated dry run', async () => {
    const { gh, root, ctx, verdict } = await approvedRepo();
    expect(verdict.ok).toBe(true);
    await generateDryRun({ ...ctx, apply: false }, PUBLIC_REPO);
    const result = await applyStage4(ctx, PUBLIC_REPO);
    expect(result.status).toBe('skipped');
    expect(result.reason).toMatch(/not approved/);
    expect(gh.labelWrites()).toEqual([]);
    expect(
      readJsonFile(path.join(evidenceDir(root), 'dry-run', 'open-repo.json')).approval.status
    ).toBe('pending');
  });

  test('a repository that changed since the dry run is stale: nothing is deleted and the reason is posted', async () => {
    const { gh, ctx } = await approvedRepo();
    gh.repos
      .get(PUBLIC_REPO.full_name)
      .items.push({ kind: 'issue', number: 50, state: 'open', labels: ['priority:medium'] });
    const result = await applyStage4(ctx, PUBLIC_REPO);
    expect(result.status).toBe('stale');
    expect(result.reasons.join(' ')).toMatch(/priority:medium items differ/);
    expect(gh.labelWrites()).toEqual([]);
    const posted = gh.comments.get(`lightspeedwp/.github#${GATE_PUBLIC}`).at(-1).body;
    expect(posted).toMatch(/Stale dry run.*open-repo/);
    expect((await applyStage4(ctx, PUBLIC_REPO)).reason).toMatch(/stale/);
  });

  test('labels.yml changing on develop makes the approval stale', async () => {
    const { gh, ctx } = await approvedRepo();
    const result = await applyStage4({ ...ctx, currentApprovedSetCommit: 'commit-b' }, PUBLIC_REPO);
    expect(result.status).toBe('stale');
    expect(gh.labelWrites()).toEqual([]);
  });

  test('a resumed run does not mistake its own earlier deletions for drift', async () => {
    const { root, gh, run, ctx } = await approvedRepo();
    gh.failOnce('deleteLabel', { match: (a) => a.name === 'legacy' });
    await expect(applyStage4(ctx, PUBLIC_REPO)).rejects.toThrow(/injected failure/);
    expect(
      gh.repos.get(PUBLIC_REPO.full_name).labels.some((l) => l.name === 'priority:medium')
    ).toBe(false);
    const resumed = resumeRun({
      dir: evidenceDir(root),
      runId: run.runId,
      host: 'box',
      isAlive: () => false,
    });
    const outcomes = await runStage(
      makeCtx({ gh, root, apply: true, run: resumed }),
      [PUBLIC_REPO],
      '4'
    );
    expect(outcomes[0].status).toBe('finished');
    const deletes = gh.writes.filter((w) => w.op === 'deleteLabel' && w.name === 'priority:medium');
    expect(deletes).toHaveLength(1);
    expect(gh.repos.get(PUBLIC_REPO.full_name).labels.some((l) => l.name === 'legacy')).toBe(false);
  });

  test('a label with open items and no target blocks the repository until a decision', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PUBLIC_REPO.full_name);
    const dry = makeCtx({ gh, root });
    const { record } = await generateDryRun(dry, PUBLIC_REPO);
    const url = gh.addComment(
      'lightspeedwp/.github',
      GATE_PUBLIC,
      'ashleyshaw',
      `Approved: ${record.repository} dry run ${record.generated_at}`
    );
    await recordApproval(dry, PUBLIC_REPO, url);
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '4' });
    const result = await applyStage4(makeCtx({ gh, root, apply: true, run }), PUBLIC_REPO);
    expect(result.reason).toMatch(/legacy/);
    expect(gh.labelWrites()).toEqual([]);
  });
});

describe('private repositories', () => {
  test('a private dry run, log and approval stay out of the committed evidence and the public gate', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PRIVATE_REPO.full_name);
    gh.repos.get(PRIVATE_REPO.full_name).items = gh.repos
      .get(PRIVATE_REPO.full_name)
      .items.filter((i) => i.number !== 4);
    const dry = makeCtx({ gh, root });
    const { record, file } = await generateDryRun(dry, PRIVATE_REPO);
    expect(file).toBe(path.join(root, '.private-evidence', 'dry-run', 'client-x.json'));
    const url = gh.addComment(
      PRIVATE_REPORTS,
      GATE_PRIVATE,
      'ashleyshaw',
      `Approved: ${record.repository} dry run ${record.generated_at}`
    );
    expect((await recordApproval(dry, PRIVATE_REPO, url)).ok).toBe(true);
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '4', host: 'box' });
    const ctx = makeCtx({ gh, root, apply: true, run });
    expect((await applyStage4(ctx, PRIVATE_REPO)).status).toBe('finished');

    expect(fs.existsSync(privateLog(root))).toBe(true);
    expect(fs.existsSync(publicLog(root))).toBe(false);
    // Nothing that names the private repository exists under the committed evidence directory.
    const stack = [evidenceDir(root)];
    const committed = [];
    while (stack.length > 0) {
      const dir = stack.pop();
      if (!fs.existsSync(dir)) continue;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else committed.push(fs.readFileSync(full, 'utf8'));
      }
    }
    committed.forEach((text) => expect(text).not.toContain('client-x'));
    expect((gh.comments.get(`lightspeedwp/.github#${GATE_PUBLIC}`) ?? []).length).toBe(0);
  });

  test('an approval cited from the public gate issue is refused for a private repository', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PRIVATE_REPO.full_name);
    const dry = makeCtx({ gh, root });
    const { record } = await generateDryRun(dry, PRIVATE_REPO);
    const url = gh.addComment(
      'lightspeedwp/.github',
      GATE_PUBLIC,
      'ashleyshaw',
      `Approved: ${record.repository} dry run ${record.generated_at}`
    );
    const verdict = await recordApproval(dry, PRIVATE_REPO, url);
    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toMatch(/private gate issue/);
  });

  test('a private repository with no private file is refused and never read from the public path', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PRIVATE_REPO.full_name);
    // A look-alike file in the public evidence directory must not be picked up.
    const lookAlike = path.join(evidenceDir(root), 'dry-run', 'client-x.json');
    fs.mkdirSync(path.dirname(lookAlike), { recursive: true });
    fs.writeFileSync(
      lookAlike,
      JSON.stringify({
        repository: 'lightspeedwp/client-x',
        executed_at: { 3: null, 4: null },
        approval: { status: 'approved', approved_by: 'ashleyshaw' },
      })
    );
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '4' });
    const result = await applyStage4(makeCtx({ gh, root, apply: true, run }), PRIVATE_REPO);
    expect(result).toMatchObject({ status: 'skipped', reason: 'no dry run' });
    expect(gh.labelWrites()).toEqual([]);
  });

  test('a private repository without a private gate can be dry-run locally but never applied or posted', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PRIVATE_REPO.full_name);
    const noGate = { privateRepository: undefined, privateIssue: undefined };
    const dry = makeCtx({ gh, root });
    dry.gates = { ...dry.gates, ...noGate };
    await expect(generateDryRun(dry, PRIVATE_REPO)).resolves.toMatchObject({ isPrivate: true });
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '3' });
    const apply = makeCtx({ gh, root, apply: true, run });
    apply.gates = { ...apply.gates, ...noGate };
    await expect(applyStage3(apply, PRIVATE_REPO)).rejects.toThrow(PrivateEvidenceError);
    await expect(postSummary(apply, PRIVATE_REPO)).rejects.toThrow(PrivateEvidenceError);
    expect(gh.labelWrites()).toEqual([]);
    expect(gh.comments.size).toBe(0);
  });

  test('private evidence is not written when Git would not ignore it', async () => {
    const root = makeRoot({ ignorePrivate: false });
    const gh = new FakeGithub();
    seedRepo(gh, PRIVATE_REPO.full_name);
    await expect(generateDryRun(makeCtx({ gh, root }), PRIVATE_REPO)).rejects.toThrow(
      /not ignored/
    );
    expect(fs.existsSync(path.join(root, '.private-evidence'))).toBe(false);
  });

  test('stale reasons for a private repository go to the private gate and do not name it', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PRIVATE_REPO.full_name);
    gh.repos.get(PRIVATE_REPO.full_name).items = gh.repos
      .get(PRIVATE_REPO.full_name)
      .items.filter((i) => i.number !== 4);
    const dry = makeCtx({ gh, root });
    const { record } = await generateDryRun(dry, PRIVATE_REPO);
    const url = gh.addComment(
      PRIVATE_REPORTS,
      GATE_PRIVATE,
      'ashleyshaw',
      `Approved: ${record.repository} dry run ${record.generated_at}`
    );
    await recordApproval(dry, PRIVATE_REPO, url);
    gh.repos
      .get(PRIVATE_REPO.full_name)
      .items.push({ kind: 'issue', number: 70, state: 'open', labels: ['priority:medium'] });
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '4' });
    const result = await applyStage4(makeCtx({ gh, root, apply: true, run }), PRIVATE_REPO);
    expect(result.status).toBe('stale');
    expect(gh.comments.get(`${PRIVATE_REPORTS}#${GATE_PRIVATE}`).at(-1).body).toMatch(
      /a private repository/
    );
    expect(gh.comments.get(`lightspeedwp/.github#${GATE_PUBLIC}`)).toBeUndefined();
  });

  test('console outcomes do not name a private repository', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    seedRepo(gh, PRIVATE_REPO.full_name);
    const outcomes = await runStage(makeCtx({ gh, root }), [PRIVATE_REPO], '4');
    expect(JSON.stringify(outcomes)).not.toContain('client-x');
  });
});

describe('steps done by hand (the record subcommand)', () => {
  test('appends intended and done records under the lock, with op ids from the run', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '3' });
    const ctx = makeCtx({ gh, root, apply: true, run });
    const id = recordManualStep(ctx, PUBLIC_REPO, {
      action: 'convert',
      label: 'type:question',
      state: 'intended',
      before: { name: 'type:question', item: { kind: 'issue', number: 12 } },
      after: { name: 'discussion:support', item: { kind: 'discussion', number: 3 } },
    });
    recordManualStep(
      ctx,
      PUBLIC_REPO,
      { action: 'convert', label: 'type:question', state: 'done' },
      id
    );
    const log = readLog(publicLog(root));
    expect(log.map((r) => r.state)).toEqual(['intended', 'done']);
    expect(log.every((r) => r.op_id === id && r.op_id.startsWith(run.runId))).toBe(true);
    expect(log[0].before.item).toEqual({ kind: 'issue', number: 12 });
  });

  test('a manual record cannot override the repository, run or gate fields', () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '3' });
    const ctx = makeCtx({ gh, root, apply: true, run });
    recordManualStep(ctx, PUBLIC_REPO, {
      action: 'convert',
      label: 'type:question',
      state: 'intended',
      repository: PRIVATE_REPO.full_name,
      run_by: 'someone-else',
      gate_issue: 999,
      op_id: 'forged',
      extra: 'ignored',
    });
    const [entry] = readLog(publicLog(root));
    expect(entry).toMatchObject({
      repository: PUBLIC_REPO.full_name,
      run_by: 'ashleyshaw',
      gate_issue: GATE_PUBLIC,
    });
    expect(entry.op_id.startsWith(run.runId)).toBe(true);
    expect(entry.extra).toBeUndefined();
    expect(JSON.stringify(entry)).not.toContain('client-x');
  });

  test('rejects another run id, an unknown action and a holder with a stale epoch', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    const run = startRun({ dir: evidenceDir(root), runBy: 'a', stage: '3', host: 'box' });
    const ctx = makeCtx({ gh, root, apply: true, run });
    expect(() =>
      recordManualStep(
        ctx,
        PUBLIC_REPO,
        { action: 'convert', label: 'x', state: 'done' },
        'run-other-0001'
      )
    ).toThrow(ConsolidationError);
    expect(() =>
      recordManualStep(ctx, PUBLIC_REPO, { action: 'explode', label: 'x', state: 'done' })
    ).toThrow(/Unknown action/);
    resumeRun({ dir: evidenceDir(root), runId: run.runId, host: 'box', isAlive: () => false });
    expect(() =>
      recordManualStep(ctx, PUBLIC_REPO, { action: 'convert', label: 'x', state: 'done' })
    ).toThrow(StaleEpochError);
  });

  test('an unmatched manual conversion is checked against live state on resume', async () => {
    const root = makeRoot();
    const gh = new FakeGithub();
    gh.addRepo(PUBLIC_REPO.full_name, { labels: [{ name: 'type:bug' }] });
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '3', host: 'box' });
    const ctx = makeCtx({ gh, root, apply: true, run });
    recordManualStep(ctx, PUBLIC_REPO, {
      action: 'convert',
      label: 'type:question',
      state: 'intended',
      before: { name: 'type:question', item: { kind: 'issue', number: 12 } },
      after: { name: 'discussion:support', item: { kind: 'discussion', number: 3 } },
    });
    const resumed = resumeRun({
      dir: evidenceDir(root),
      runId: run.runId,
      host: 'box',
      isAlive: () => false,
    });
    // Issue #12 no longer exists (it became a Discussion), so the change is recorded as done and not repeated.
    await runStage(makeCtx({ gh, root, apply: true, run: resumed }), [PUBLIC_REPO], '3');
    const log = readLog(publicLog(root));
    expect(log.filter((r) => r.state === 'done' && r.action === 'convert')).toHaveLength(1);
  });
});

describe('the command line', () => {
  const env = { LABEL_CONSOLIDATE_TOKEN: 'test-token-not-real' };
  const withClient = (gh) => ({ createClient: () => gh });

  test('needs a token', async () => {
    await expect(main(['--stage', '3'], {}, withClient(new FakeGithub()))).rejects.toThrow(
      /LABEL_CONSOLIDATE_TOKEN/
    );
  });

  test('--apply is refused without --confirm-gate', async () => {
    await expect(
      main(['--stage', '3', '--apply'], env, withClient(new FakeGithub()))
    ).rejects.toThrow(/--confirm-gate/);
  });

  test('--confirm-gate must name an open issue, not a pull request or a closed issue', async () => {
    const gh = new FakeGithub();
    gh.getIssue = async () => ({ number: 5, state: 'closed' });
    await expect(
      main(['--stage', '3', '--apply', '--confirm-gate', '5'], env, withClient(gh))
    ).rejects.toThrow(/not an open issue/);
    gh.getIssue = async () => ({ number: 5, state: 'open', pull_request: {} });
    await expect(
      main(['--stage', '3', '--apply', '--confirm-gate', '5'], env, withClient(gh))
    ).rejects.toThrow(/not an open issue/);
  });

  test('--confirm-gate must be a number', async () => {
    await expect(
      main(['--stage', '3', '--apply', '--confirm-gate', 'abc'], env, withClient(new FakeGithub()))
    ).rejects.toThrow(/must be an issue number/);
  });

  test('--abandon-run needs @ashleyshaw to confirm on the gate issue, then removes the lock', async () => {
    const root = makeRoot();
    const run = startRun({ dir: evidenceDir(root), runBy: 'ashleyshaw', stage: '3' });
    const gh = new FakeGithub();
    gh.openIssues.add('lightspeedwp/.github#100');
    const argv = ['--abandon-run', run.runId, '--confirm-gate', '100', '--root', root];
    await expect(main(argv, env, withClient(gh))).rejects.toThrow(/has not commented/);
    gh.addComment('lightspeedwp/.github', 100, 'someone-else', `Abandon run ${run.runId}`);
    await expect(main(argv, env, withClient(gh))).rejects.toThrow(/has not commented/);
    expect(fs.existsSync(path.join(evidenceDir(root), 'run-lock.json'))).toBe(true);
    gh.addComment('lightspeedwp/.github', 100, 'ashleyshaw', `Abandon run ${run.runId}`);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    await expect(main(argv, env, withClient(gh))).resolves.toBe(0);
    expect(fs.existsSync(path.join(evidenceDir(root), 'run-lock.json'))).toBe(false);
    console.log.mockRestore();
  });
});
