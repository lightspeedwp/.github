/**
 * Tests for the consolidation run lock, log, private-evidence rules and plans
 * (spec 008, T062b, T062c, T065, T065a; FR-016, FR-023).
 *
 * Everything runs in temporary directories; nothing is written to the repository.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  RunLockError,
  StaleEpochError,
  abandonRun,
  attachRun,
  createOpId,
  createRunId,
  readLog,
  readLock,
  resumeRun,
  startRun,
  truncatePartialLine,
  unmatchedIntended,
} from '../includes/consolidation-run.js';
import {
  PrivateEvidenceError,
  consolidationLogPathFor,
  dryRunPathFor,
  gateFor,
  isPrivateRepository,
  splitByVisibility,
  verifyApproval,
} from '../includes/private-evidence.js';
import {
  buildApprovedSet,
  buildDryRunRecord,
  buildMappingIndex,
  detectStaleness,
  planStage3,
  planStage4,
  resolveTarget,
  stageStillToRun,
  validateDryRun,
} from '../includes/consolidation-plan.js';

const temporaryDirectories = [];

/** @returns {string} A fresh temporary directory. */
function temporaryDirectory() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'consolidation-run-'));
  temporaryDirectories.push(dir);
  return dir;
}

afterAll(() => {
  temporaryDirectories.forEach((dir) => fs.rmSync(dir, { force: true, recursive: true }));
});

describe('run ids and operation ids', () => {
  test('a run id is the UTC start time to the second plus eight hex digits', () => {
    expect(
      createRunId(new Date('2026-10-05T09:00:00.789Z'), () => Buffer.from('3f9a1c7e', 'hex'))
    ).toBe('run-20261005T090000-3f9a1c7e');
  });

  test('two fresh runs started within the same second get different run ids', () => {
    const now = new Date('2026-10-05T09:00:00Z');
    expect(createRunId(now)).not.toBe(createRunId(now));
  });

  test('an op id starts with its run id and carries a four-digit sequence', () => {
    expect(createOpId('run-20261005T090000-3f9a1c7e', 7)).toBe('run-20261005T090000-3f9a1c7e-0007');
  });
});

describe('the run lock', () => {
  test('a second run refuses to start while run-lock.json exists, naming the holder', () => {
    const dir = temporaryDirectory();
    const first = startRun({ dir, runBy: 'ashleyshaw', stage: '3' });
    expect(() => startRun({ dir, runBy: 'ashleyshaw', stage: '3' })).toThrow(first.runId);
  });

  test('the lock records run id, epoch, host, stage and a null resumed_from', () => {
    const dir = temporaryDirectory();
    const run = startRun({ dir, runBy: 'ashleyshaw', stage: '4', host: 'box', pid: 1234 });
    expect(readLock(path.join(dir, 'run-lock.json'))).toMatchObject({
      run_id: run.runId,
      run_by: 'ashleyshaw',
      stage: '4',
      epoch: 1,
      host: 'box',
      pid: 1234,
      resumed_from: null,
    });
  });

  test('only stages 3, 4 and 5 are accepted', () => {
    expect(() => startRun({ dir: temporaryDirectory(), runBy: 'a', stage: '2' })).toThrow(
      RunLockError
    );
  });

  test('finishing a run deletes the lock so a new run can start', () => {
    const dir = temporaryDirectory();
    startRun({ dir, runBy: 'a', stage: '3' }).finish();
    expect(fs.existsSync(path.join(dir, 'run-lock.json'))).toBe(false);
    expect(() => startRun({ dir, runBy: 'a', stage: '3' })).not.toThrow();
  });

  test('a run killed mid-write leaves a lock that a plain start refuses', () => {
    const dir = temporaryDirectory();
    startRun({ dir, runBy: 'a', stage: '3', pid: 999999 });
    expect(() => startRun({ dir, runBy: 'a', stage: '3' })).toThrow(RunLockError);
  });

  test('--resume is refused while the original process is still alive', () => {
    const dir = temporaryDirectory();
    const first = startRun({ dir, runBy: 'a', stage: '3', host: 'box', pid: 4321 });
    expect(() => resumeRun({ dir, runId: first.runId, host: 'box', isAlive: () => true })).toThrow(
      /still running/
    );
  });

  test('--resume keeps the run id, raises the epoch by one and records resumed_from', () => {
    const dir = temporaryDirectory();
    const first = startRun({ dir, runBy: 'a', stage: '3', host: 'box', pid: 4321 });
    const resumed = resumeRun({
      dir,
      runId: first.runId,
      host: 'box',
      pid: 5555,
      isAlive: () => false,
      now: () => new Date('2026-10-05T10:00:00Z'),
    });
    expect(resumed.runId).toBe(first.runId);
    expect(resumed.epoch).toBe(2);
    expect(resumed.resumedFrom).toEqual({ epoch: 1, at: '2026-10-05T10:00:00.000Z' });
    expect(readLock(path.join(dir, 'run-lock.json'))).toMatchObject({ epoch: 2, pid: 5555 });
  });

  test('--resume needs the matching run id and the same host', () => {
    const dir = temporaryDirectory();
    const first = startRun({ dir, runBy: 'a', stage: '3', host: 'box' });
    expect(() => resumeRun({ dir, runId: 'run-other', host: 'box', isAlive: () => false })).toThrow(
      /belongs to/
    );
    expect(() =>
      resumeRun({ dir, runId: first.runId, host: 'elsewhere', isAlive: () => false })
    ).toThrow(/started on box/);
  });

  test('a holder with a stale epoch cannot append to any log', () => {
    const dir = temporaryDirectory();
    const log = path.join(dir, 'log.jsonl');
    const first = startRun({ dir, runBy: 'a', stage: '3', host: 'box' });
    resumeRun({ dir, runId: first.runId, host: 'box', isAlive: () => false });
    expect(() => first.append(log, { state: 'intended' })).toThrow(StaleEpochError);
    expect(fs.existsSync(log)).toBe(false);
  });

  test('--abandon-run removes the lock so a fresh run can start', () => {
    const dir = temporaryDirectory();
    const first = startRun({ dir, runBy: 'a', stage: '3' });
    abandonRun({ dir, runId: first.runId });
    expect(() => startRun({ dir, runBy: 'a', stage: '3' })).not.toThrow();
  });

  test('the record subcommand attaches at the lock epoch and cannot attach to another run', () => {
    const dir = temporaryDirectory();
    const first = startRun({ dir, runBy: 'a', stage: '3' });
    const attached = attachRun({ dir, runId: first.runId });
    expect(attached.epoch).toBe(first.epoch);
    expect(() => attachRun({ dir, runId: 'run-other' })).toThrow(RunLockError);
  });
});

describe('the append-only log', () => {
  test('every appended record is one line ending in a newline', () => {
    const dir = temporaryDirectory();
    const log = path.join(dir, 'log.jsonl');
    const run = startRun({ dir, runBy: 'a', stage: '3' });
    run.append(log, { op_id: run.nextOpId(), state: 'intended' });
    run.append(log, { op_id: run.nextOpId(), state: 'intended' });
    const text = fs.readFileSync(log, 'utf8');
    expect(text.endsWith('\n')).toBe(true);
    expect(text.trim().split('\n')).toHaveLength(2);
  });

  test('a log cut off mid-write is truncated back to its last newline, keeping the bytes in .partial', () => {
    const dir = temporaryDirectory();
    const log = path.join(dir, 'log.jsonl');
    fs.writeFileSync(log, '{"op_id":"a","state":"intended"}\n{"op_id":"b","sta');
    expect(truncatePartialLine(log)).toBeGreaterThan(0);
    expect(fs.readFileSync(log, 'utf8')).toBe('{"op_id":"a","state":"intended"}\n');
    expect(fs.readFileSync(`${log}.partial`, 'utf8')).toContain('{"op_id":"b","sta');
  });

  test('after truncation the next record parses and the log stays valid', () => {
    const dir = temporaryDirectory();
    const log = path.join(dir, 'log.jsonl');
    fs.writeFileSync(log, '{"op_id":"a","state":"intended"}\n{"op_id":"b","sta');
    truncatePartialLine(log);
    const run = startRun({ dir, runBy: 'a', stage: '3' });
    run.append(log, { op_id: 'c', state: 'intended' });
    expect(readLog(log).map((r) => r.op_id)).toEqual(['a', 'c']);
  });

  test('a reader ignores a final partial line but rejects a bad line in the middle', () => {
    const dir = temporaryDirectory();
    const log = path.join(dir, 'log.jsonl');
    fs.writeFileSync(log, '{"op_id":"a"}\n{"op_id":"b"');
    expect(readLog(log)).toEqual([{ op_id: 'a' }]);
    fs.writeFileSync(log, '{"op_id":"a"}\nnot json\n{"op_id":"c"}\n');
    expect(() => readLog(log)).toThrow(/line 2/);
  });

  test('a log that already ends in a newline is left alone', () => {
    const dir = temporaryDirectory();
    const log = path.join(dir, 'log.jsonl');
    fs.writeFileSync(log, '{"op_id":"a"}\n');
    expect(truncatePartialLine(log)).toBe(0);
    expect(fs.existsSync(`${log}.partial`)).toBe(false);
  });

  test('a resume ignores intended records from another run id', () => {
    const records = [
      { op_id: 'run-A-0001', state: 'intended' },
      { op_id: 'run-B-0001', state: 'intended' },
      { op_id: 'run-B-0002', state: 'intended' },
      { op_id: 'run-B-0002', state: 'done' },
    ];
    expect(unmatchedIntended(records, 'run-B').map((r) => r.op_id)).toEqual(['run-B-0001']);
    expect(unmatchedIntended(records).map((r) => r.op_id)).toEqual(['run-A-0001', 'run-B-0001']);
  });

  test('a resumed run continues numbering after its own highest op id', () => {
    const dir = temporaryDirectory();
    const first = startRun({ dir, runBy: 'a', stage: '3', host: 'box' });
    const resumed = resumeRun({ dir, runId: first.runId, host: 'box', isAlive: () => false });
    resumed.continueFrom([{ op_id: `${first.runId}-0003` }, { op_id: 'run-other-0009' }]);
    expect(resumed.nextOpId()).toBe(`${first.runId}-0004`);
  });
});

describe('private repositories', () => {
  const publicRepo = { name: 'open-repo', full_name: 'lightspeedwp/open-repo', private: false };
  const privateRepo = { name: 'client-x', full_name: 'lightspeedwp/client-x', private: true };
  const gates = {
    publicRepository: 'lightspeedwp/.github',
    publicIssue: 100,
    privateRepository: 'lightspeedwp/private-reports',
    privateIssue: 7,
  };

  test('visibility comes from the API object, and unknown visibility fails closed', () => {
    expect(isPrivateRepository(publicRepo)).toBe(false);
    expect(isPrivateRepository(privateRepo)).toBe(true);
    expect(isPrivateRepository({ visibility: 'internal' })).toBe(true);
    expect(() => isPrivateRepository({ name: 'mystery' })).toThrow(PrivateEvidenceError);
  });

  test('a private repository never uses the committed evidence directory', () => {
    const root = '/checkout';
    expect(dryRunPathFor(publicRepo, root).file).toBe(
      '/checkout/.github/reports/audits/2026-09-14-label-audit/evidence/dry-run/open-repo.json'
    );
    expect(dryRunPathFor(privateRepo, root).file).toBe(
      '/checkout/.private-evidence/dry-run/client-x.json'
    );
    expect(consolidationLogPathFor(privateRepo, root).file).toBe(
      '/checkout/.private-evidence/consolidation-log.jsonl'
    );
    expect(consolidationLogPathFor(publicRepo, root).file).toContain(
      '/evidence/consolidation-log.jsonl'
    );
  });

  test('a private repository gates on the private report repository, never the public issue', () => {
    expect(gateFor(publicRepo, gates)).toEqual({
      repository: 'lightspeedwp/.github',
      issue: 100,
      isPrivate: false,
    });
    expect(gateFor(privateRepo, gates)).toEqual({
      repository: 'lightspeedwp/private-reports',
      issue: 7,
      isPrivate: true,
    });
    expect(() => gateFor(privateRepo, { ...gates, privateRepository: undefined })).toThrow(
      /private gate/
    );
    expect(() => gateFor(privateRepo, { ...gates, privateIssue: undefined })).toThrow(
      /private gate/
    );
    expect(() =>
      gateFor(privateRepo, { ...gates, privateRepository: 'lightspeedwp/.github' })
    ).toThrow(/must not be/);
  });

  test('repositories split by visibility', () => {
    expect(splitByVisibility([publicRepo, privateRepo])).toEqual({
      publicRepos: [publicRepo],
      privateRepos: [privateRepo],
    });
  });

  describe('approval verification', () => {
    const record = {
      repository: 'lightspeedwp/open-repo',
      generated_at: '2026-10-05T09:00:00Z',
      approval: {
        status: 'approved',
        approved_by: 'ashleyshaw',
        approved_at: '2026-10-05T10:00:00Z',
        gate_comment_url: 'https://github.com/lightspeedwp/.github/issues/100#issuecomment-55',
      },
    };
    const goodComment = {
      user: { login: 'ashleyshaw' },
      body: 'Approved: lightspeedwp/open-repo dry run 2026-10-05T09:00:00Z',
    };
    const gate = { repository: 'lightspeedwp/.github', issue: 100 };

    test('accepts the exact approval comment from @ashleyshaw on the right gate', async () => {
      await expect(
        verifyApproval(record, publicRepo, gate, async () => goodComment)
      ).resolves.toEqual({ ok: true });
    });

    test.each([
      [
        'a comment by someone else',
        { ...goodComment, user: { login: 'someone' } },
        /not written by/,
      ],
      [
        'an approval for an older dry run',
        { ...goodComment, body: 'Approved: lightspeedwp/open-repo dry run 2026-10-01T00:00:00Z' },
        /does not read/,
      ],
      [
        'an approval for another repository',
        { ...goodComment, body: 'Approved: lightspeedwp/other dry run 2026-10-05T09:00:00Z' },
        /does not read/,
      ],
      ['a comment that cannot be read', null, /cannot be read/],
    ])('refuses %s', async (_name, comment, pattern) => {
      const verdict = await verifyApproval(record, publicRepo, gate, async () => comment);
      expect(verdict.ok).toBe(false);
      expect(verdict.reason).toMatch(pattern);
    });

    test('refuses a pending approval, another approver and a missing URL', async () => {
      const read = async () => goodComment;
      expect(
        (
          await verifyApproval(
            { ...record, approval: { ...record.approval, status: 'pending' } },
            publicRepo,
            gate,
            read
          )
        ).ok
      ).toBe(false);
      expect(
        (
          await verifyApproval(
            { ...record, approval: { ...record.approval, approved_by: 'x' } },
            publicRepo,
            gate,
            read
          )
        ).ok
      ).toBe(false);
      expect(
        (
          await verifyApproval(
            { ...record, approval: { ...record.approval, gate_comment_url: null } },
            publicRepo,
            gate,
            read
          )
        ).ok
      ).toBe(false);
    });

    test('a private repository cannot cite a comment on the public gate issue', async () => {
      const privateRecord = { ...record, repository: 'lightspeedwp/client-x' };
      const verdict = await verifyApproval(
        privateRecord,
        privateRepo,
        { repository: 'lightspeedwp/private-reports', issue: 7 },
        async () => goodComment
      );
      expect(verdict.ok).toBe(false);
      expect(verdict.reason).toMatch(/private gate issue/);
    });
  });
});

describe('planning', () => {
  const approved = buildApprovedSet([
    { name: 'aiops:agents', color: '0E8A16', description: 'AI ops agents' },
    { name: 'priority:normal', color: 'FBCA04', description: 'Normal priority' },
    { name: 'scope:website', color: '1D76DB', description: '' },
  ]);
  const mappings = buildMappingIndex({
    mappings: [
      { source: 'ai-ops:agents', systems: ['github'], action: 'rename', target: 'aiops:agents' },
      {
        source: 'priority:medium',
        systems: ['github', 'linear'],
        action: 'merge',
        target: 'priority:normal',
      },
      { source: 'scope: website', systems: ['github'], action: 'merge', target: 'scope:website' },
      { source: 'only:linear', systems: ['linear'], action: 'merge', target: 'priority:normal' },
      { source: 'meta:old', systems: ['github'], action: 'retire', target: null },
    ],
  });

  test('a mapped rename becomes an in-place rename and the target is not also created', () => {
    const plan = planStage3(approved, mappings, [
      { name: 'ai-ops:agents', color: '0e8a16', description: 'AI ops agents' },
    ]);
    expect(plan.to_rename).toEqual([{ from: 'ai-ops:agents', to: 'aiops:agents' }]);
    expect(plan.to_create.map((l) => l.name)).not.toContain('aiops:agents');
    expect(plan.to_create.map((l) => l.name).sort()).toEqual(['priority:normal', 'scope:website']);
  });

  test('a rename whose target exists becomes a relabel instead', () => {
    const plan = planStage3(approved, mappings, [
      { name: 'ai-ops:agents', color: 'ffffff' },
      { name: 'aiops:agents', color: '0E8A16', description: 'AI ops agents' },
    ]);
    expect(plan.to_rename).toEqual([]);
    expect(plan.to_relabel).toEqual([
      { from: 'ai-ops:agents', to: 'aiops:agents', concept_label: null },
    ]);
  });

  test('labels that differ only by case or spacing stay separate sources', () => {
    const plan = planStage3(approved, mappings, [
      { name: 'scope: website', color: 'ffffff' },
      { name: 'Scope:Website', color: '1D76DB', description: '' },
    ]);
    // "scope: website" (a spacing variant) is its own mapping source and is relabelled; the case variant is renamed in place.
    expect(plan.to_relabel).toEqual([
      { from: 'scope: website', to: 'scope:website', concept_label: null },
    ]);
    expect(plan.to_rename).toEqual([
      { from: 'Scope:Website', to: 'scope:website', reason: 'case' },
    ]);
    expect(resolveTarget('Scope:Website', approved, mappings)).toBeNull();
  });

  test('colour and description drift on an approved label is an update, not a recreate', () => {
    const plan = planStage3(approved, mappings, [
      { name: 'priority:normal', color: '#ffffff', description: 'Old' },
    ]);
    expect(plan.to_update).toEqual([
      { name: 'priority:normal', color: 'fbca04', description: 'Normal priority' },
    ]);
  });

  test('mapping entries for Linear only are ignored on GitHub', () => {
    expect(
      buildMappingIndex({
        mappings: [{ source: 'x', systems: ['linear'], action: 'merge', target: 'y' }],
      }).size
    ).toBe(0);
  });

  test('a mapping that needs a target but has none is rejected', () => {
    expect(() =>
      buildMappingIndex({
        mappings: [{ source: 'x', systems: ['github'], action: 'merge', target: null }],
      })
    ).toThrow(/no target/);
  });

  describe('Stage 4 plan', () => {
    const labels = [
      { name: 'priority:normal', color: 'fbca04', description: 'Normal priority' },
      { name: 'priority:medium', color: 'ededed', description: '' },
      { name: 'migrate:priority:normal', color: 'ededed', description: '' },
      { name: 'orphan', color: 'ededed', description: '' },
      { name: 'unused', color: 'ededed', description: '' },
    ];
    const items = {
      'priority:medium': [
        { kind: 'issue', number: 1, state: 'open' },
        { kind: 'pull_request', number: 2, state: 'closed' },
      ],
      'migrate:priority:normal': [{ kind: 'discussion', number: 3, state: 'open' }],
      orphan: [{ kind: 'issue', number: 4, state: 'open' }],
      unused: [],
    };
    const plan = planStage4(approved, mappings, labels, (name) => items[name] ?? []);

    test('only labels outside the approved set are listed, with a full snapshot', () => {
      expect(plan.to_delete.map((d) => d.name)).toEqual([
        'priority:medium',
        'migrate:priority:normal',
        'orphan',
        'unused',
      ]);
      expect(plan.to_delete[0]).toMatchObject({
        color: 'ededed',
        open_items: [{ kind: 'issue', number: 1 }],
        closed_items: [{ kind: 'pull_request', number: 2 }],
        migrate_to: 'priority:normal',
      });
    });

    test('a migrate:* label points at the approved label its name names', () => {
      expect(plan.to_delete[1].migrate_to).toBe('priority:normal');
    });

    test('open items with no target are listed for a decision', () => {
      expect(plan.needs_decision).toEqual(['orphan']);
    });

    test('a dry run with open items and no target or decision is invalid; an unread repository is invalid', () => {
      const record = buildDryRunRecord({
        repository: 'o/r',
        generatedAt: 'T',
        approvedSetCommit: 'c',
        labelCount: 250,
        pagesRead: 2,
        approvedSetCount: 3,
        stage4: plan,
      });
      expect(validateDryRun(record, approved)).toEqual([
        expect.stringMatching(/cannot cover label_count/),
      ]);
      const broken = { ...record, pages_read: 3, needs_decision: [] };
      expect(validateDryRun(broken, approved)).toEqual([
        expect.stringMatching(/orphan has open items/),
      ]);
      expect(validateDryRun({ ...record, pages_read: 3 }, approved)).toEqual([]);
    });
  });

  test('regenerating a dry run resets the approval and keeps the earlier stage timestamps', () => {
    const previous = { executed_at: { 3: '2026-10-01T00:00:00Z', 4: null } };
    const record = buildDryRunRecord({
      repository: 'o/r',
      generatedAt: 'T2',
      approvedSetCommit: 'c',
      labelCount: 1,
      pagesRead: 1,
      approvedSetCount: 1,
      previous,
    });
    expect(record.executed_at).toEqual({ 3: '2026-10-01T00:00:00Z', 4: null });
    expect(record.approval).toEqual({
      status: 'pending',
      approved_by: null,
      approved_at: null,
      gate_comment_url: null,
    });
    expect(stageStillToRun(record, '3')).toBe(false);
    expect(stageStillToRun(record, '4')).toBe(true);
  });
});

describe('stale dry-run detection', () => {
  const record = {
    repository: 'o/r',
    approved_set_commit: 'abc',
    label_count: 4,
    to_delete: [
      {
        name: 'old-a',
        color: 'ededed',
        description: '',
        open_items: [{ kind: 'issue', number: 1 }],
        closed_items: [],
        migrate_to: 'keep',
      },
      {
        name: 'old-b',
        color: 'ededed',
        description: '',
        open_items: [
          { kind: 'issue', number: 2 },
          { kind: 'issue', number: 3 },
        ],
        closed_items: [],
        migrate_to: 'keep',
      },
    ],
  };
  const labels = [
    { name: 'keep', color: 'fff' },
    { name: 'old-a', color: 'ededed', description: '' },
    { name: 'old-b', color: 'ededed', description: '' },
    { name: 'other', color: 'fff' },
  ];
  const itemsFor = (name) =>
    ({
      'old-a': [{ kind: 'issue', number: 1 }],
      'old-b': [
        { kind: 'issue', number: 2 },
        { kind: 'issue', number: 3 },
      ],
    })[name] ?? [];
  const base = {
    record,
    liveLabels: labels,
    liveItemsFor: itemsFor,
    currentApprovedSetCommit: 'abc',
  };

  test('a repository that still matches is not stale', () => {
    expect(detectStaleness(base)).toEqual({ stale: false, reasons: [] });
  });

  test('labels.yml changing on develop makes the approval stale', () => {
    expect(detectStaleness({ ...base, currentApprovedSetCommit: 'def' }).reasons[0]).toMatch(
      /labels.yml on develop changed/
    );
  });

  test('a new item on a listed label, or a new label, is drift', () => {
    const withNewItem = (name) => [
      ...itemsFor(name),
      ...(name === 'old-a' ? [{ kind: 'issue', number: 9 }] : []),
    ];
    expect(detectStaleness({ ...base, liveItemsFor: withNewItem }).reasons).toEqual([
      expect.stringMatching(/old-a items differ.*1 new/),
    ]);
    expect(
      detectStaleness({ ...base, liveLabels: [...labels, { name: 'extra' }] }).reasons[0]
    ).toMatch(/dry run expected 4/);
  });

  test("a resumed run's own deletions and migrations are not drift", () => {
    const done = [
      {
        repository: 'o/r',
        state: 'done',
        action: 'relabel',
        label: 'old-a',
        before: { item: { kind: 'issue', number: 1 } },
      },
      { repository: 'o/r', state: 'done', action: 'delete', label: 'old-a' },
    ];
    const afterRun = {
      ...base,
      doneRecords: done,
      liveLabels: labels.filter((l) => l.name !== 'old-a'),
      liveItemsFor: (name) => (name === 'old-a' ? [] : itemsFor(name)),
    };
    expect(detectStaleness(afterRun)).toEqual({ stale: false, reasons: [] });
  });

  test('a label deleted by someone else, not this run, is drift', () => {
    expect(
      detectStaleness({
        ...base,
        liveLabels: labels.filter((l) => l.name !== 'old-b'),
      }).reasons.join(' ')
    ).toMatch(/old-b is gone/);
  });

  test("another run's done records do not excuse drift", () => {
    const foreign = [
      { repository: 'someone/else', state: 'done', action: 'delete', label: 'old-a' },
    ];
    expect(
      detectStaleness({
        ...base,
        doneRecords: foreign,
        liveLabels: labels.filter((l) => l.name !== 'old-a'),
      }).stale
    ).toBe(true);
  });
});
