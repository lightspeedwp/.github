const { applyLabelChanges, listRepoLabels } = require('../handlers/apply-label-changes.cjs');

function mockGithub({ labels = [], removeStatus } = {}) {
  const calls = { add: [], remove: [], list: 0 };
  const github = {
    paginate: jest.fn(async (method, params) => method(params)),
    rest: {
      issues: {
        listLabelsForRepo: jest.fn(async () => {
          calls.list += 1;
          return labels.map((name) => ({ name }));
        }),
        addLabels: jest.fn(async (params) => {
          calls.add.push(params);
        }),
        removeLabel: jest.fn(async (params) => {
          if (removeStatus) {
            const error = new Error('remove failed');
            error.status = removeStatus;
            throw error;
          }
          calls.remove.push(params);
        }),
      },
    },
  };

  return { github, calls };
}

const base = { owner: 'lightspeedwp', repo: 'example', issueNumber: 7 };

describe('applyLabelChanges', () => {
  test('removes then adds, only adding labels that exist in the repository', async () => {
    const { github, calls } = mockGithub({
      labels: ['openspec:implementation-in-progress', 'status:in-progress'],
    });

    const result = await applyLabelChanges({
      ...base,
      github,
      add: ['openspec:implementation-in-progress', 'meta:has-pr'],
      remove: ['openspec:implementation-pending'],
    });

    expect(calls.remove).toEqual([
      {
        owner: 'lightspeedwp',
        repo: 'example',
        issue_number: 7,
        name: 'openspec:implementation-pending',
      },
    ]);
    expect(calls.add).toEqual([
      {
        owner: 'lightspeedwp',
        repo: 'example',
        issue_number: 7,
        labels: ['openspec:implementation-in-progress'],
      },
    ]);
    expect(result).toEqual({
      added: ['openspec:implementation-in-progress'],
      removed: ['openspec:implementation-pending'],
      skipped: ['meta:has-pr'],
    });
  });

  test('treats removing an absent label (404) as done', async () => {
    const { github } = mockGithub({ labels: [], removeStatus: 404 });

    const result = await applyLabelChanges({ ...base, github, remove: ['gone'] });

    expect(result.removed).toEqual([]);
  });

  test('rethrows other removal errors', async () => {
    const { github } = mockGithub({ labels: [], removeStatus: 403 });

    await expect(applyLabelChanges({ ...base, github, remove: ['x'] })).rejects.toThrow(
      'remove failed'
    );
  });

  test('makes no API calls for an empty change set', async () => {
    const { github, calls } = mockGithub({ labels: ['a'] });

    const result = await applyLabelChanges({ ...base, github });

    expect(calls.list).toBe(0);
    expect(result).toEqual({ added: [], removed: [], skipped: [] });
  });

  test('dry run reports the plan without writing', async () => {
    const { github, calls } = mockGithub({ labels: ['a'] });

    const result = await applyLabelChanges({
      ...base,
      github,
      add: ['a', 'b'],
      remove: ['c'],
      dryRun: true,
    });

    expect(calls.add).toEqual([]);
    expect(calls.remove).toEqual([]);
    expect(result).toEqual({ added: ['a'], removed: ['c'], skipped: ['b'] });
  });

  test('never adds a label that is also being removed, and reuses supplied repo labels', async () => {
    const { github, calls } = mockGithub();

    await applyLabelChanges({
      ...base,
      github,
      add: ['a', 'a', 'b'],
      remove: ['b'],
      repoLabels: new Set(['a', 'b']),
    });

    expect(calls.list).toBe(0);
    expect(calls.add[0].labels).toEqual(['a']);
  });
});

describe('listRepoLabels', () => {
  test('returns a set of label names', async () => {
    const { github } = mockGithub({ labels: ['x', 'y'] });

    await expect(listRepoLabels(github, 'o', 'r')).resolves.toEqual(new Set(['x', 'y']));
  });
});
