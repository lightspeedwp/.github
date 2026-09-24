import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '../..');
const specDirectory = '.github/specs/016-claude-cloud-environment';

function readDocument(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function requirement(id) {
  const start = spec.indexOf(`- **${id}**:`);
  expect(start).not.toBe(-1);
  const remainder = spec.slice(start);
  const next = remainder.search(/\n(?:- \*\*FR-\d{3}[a-z]?\*\*:|#{2,4} )/);
  return next === -1 ? remainder : remainder.slice(0, next);
}

function contractRow(document, label) {
  const row = document.split('\n').find((line) => line.startsWith(`| ${label} |`));
  expect(row).toBeDefined();
  return row;
}

const spec = readDocument(`${specDirectory}/spec.md`);
const plan = readDocument(`${specDirectory}/plan.md`);
const tasks = readDocument(`${specDirectory}/tasks.md`);
const model = readDocument(`${specDirectory}/data-model.md`);
const research = readDocument(`${specDirectory}/research.md`);
const checklist = readDocument(`${specDirectory}/checklists/requirements.md`);
const quickstart = readDocument(`${specDirectory}/quickstart.md`);
const hooks = readDocument(`${specDirectory}/contracts/hooks.md`);
const cleanup = readDocument(`${specDirectory}/contracts/branch-cleanup.md`);
const catalogue = readDocument('.github/specs/CATALOG.md');

describe('Claude cloud environment specification contracts', () => {
  test('catalogues the draft under the correct number and a working spec link', () => {
    const entries = catalogue.split('\n').filter((line) => /^\| 016 \|/.test(line));
    expect(entries).toHaveLength(1);

    const columns = entries[0].split('|').map((column) => column.trim());
    expect(columns.slice(2, 6)).toEqual([
      'claude-cloud-environment',
      'Standardised Claude Code Cloud Environment',
      'Draft',
      '2026-09-23',
    ]);
    const link = columns[6].match(/^\[[^\]]+\]\(([^)]+)\)$/);
    expect(link).not.toBeNull();
    expect(fs.existsSync(path.resolve(repoRoot, '.github/specs', link[1]))).toBe(true);
    expect(spec).toContain('**Status**: Draft');
  });

  test('declares every referenced functional requirement exactly once', () => {
    const declarations = [...spec.matchAll(/^- \*\*(FR-\d{3}[a-z]?)\*\*:/gm)].map(
      (match) => match[1]
    );
    const references = [
      plan,
      tasks,
      model,
      research,
      checklist,
      quickstart,
      hooks,
      cleanup,
    ].flatMap((document) => [...document.matchAll(/\bFR-\d{3}[a-z]?\b/g)].map((match) => match[0]));

    expect(declarations.length).toBeGreaterThan(0);
    expect(new Set(declarations).size).toBe(declarations.length);
    expect(new Set(references).size).toBeGreaterThan(0);
    expect(references.filter((id) => !declarations.includes(id))).toEqual([]);
  });

  test.each([
    ['1', 'P1', 'US1'],
    ['2', 'P2', 'US2'],
    ['3', 'P3', 'US3'],
  ])('traces user story %s through priorities and tasks', (story, priority, tag) => {
    expect(spec).toMatch(new RegExp(`^### User Story ${story} .*Priority: ${priority}`, 'm'));
    expect(tasks).toMatch(
      new RegExp(`^## Phase \\d+: User Story ${story} .*Priority: ${priority}`, 'm')
    );
    expect(tasks).toContain(`[${tag}]`);
  });

  describe('session-start behaviour', () => {
    test('renames only an empty cloud branch, never one with its own commits', () => {
      expect(requirement('FR-001')).toMatch(/no commits of its own.*renamed locally/);
      expect(requirement('FR-001')).toMatch(/already has commits.*MUST NOT be renamed/);
      expect(
        contractRow(
          hooks,
          'Cloud and source is `startup`/`resume`, branch `claude/*` with 0 commits ahead of `origin/<base>`'
        )
      ).toMatch(/Rename locally to `chore\/session-<hash>`\. Never push/);
      expect(
        contractRow(
          hooks,
          'Cloud and source is `startup`/`resume`, branch `claude/*` with its own commits'
        )
      ).toMatch(/Leave it unchanged/);
    });

    test('syncs only clean branches and emits context after compaction', () => {
      expect(requirement('FR-002')).toMatch(/no uncommitted changes.*up to date/);
      expect(
        contractRow(
          hooks,
          'Cloud and source is `startup`/`resume`, clean tree, 0 commits ahead of `origin/<base>`'
        )
      ).toMatch(/Hard-reset to `origin\/<base>`/);
      expect(requirement('FR-003')).toMatch(/after context compaction/);
      expect(contractRow(hooks, 'Any source, cloud or local')).toMatch(
        /Emit branching rules as context/
      );
      expect(quickstart).toContain('{"source":"compact"}');
    });
  });

  describe('branch guard behaviour', () => {
    test('refuses mixed protected-branch changes but permits documentation-only changes', () => {
      expect(requirement('FR-005')).toMatch(
        /protected.*unless every file.*`\.github\/specs\/` or `docs\/`/s
      );
      expect(requirement('FR-006')).toMatch(/protected branch.*every file changed/);
      expect(quickstart).toMatch(
        /Commit on `develop` with only `docs\/` and `\.github\/specs\/` files staged \| exit 0/
      );
      expect(quickstart).toMatch(
        /Commit on `develop` with any other file staged \| exit 2, lists the other files/
      );
    });

    test('fails closed if a protected-branch write has no known affected paths', () => {
      expect(model).toMatch(/An empty or unknown path set fails closed/);
      expect(model).toMatch(/\*\*Commit\*\*: staged paths, plus `-a` tracked changes/);
      expect(model).toMatch(/\*\*MCP\*\*: the paths in the tool input/);
    });

    test('does not extend the legacy PR exception to unverifiable open PRs', () => {
      expect(requirement('FR-006')).toMatch(
        /already exists on GitHub and is the head of an open PR/
      );
      expect(requirement('FR-006')).toMatch(/can't be verified, the exception doesn't apply/);
      expect(quickstart).toMatch(/with no open PR, or `gh` failing \| exit 2/);
    });

    test('allows deletion and tag-only pushes without a branch-name refusal', () => {
      expect(requirement('FR-006')).toMatch(
        /delete a remote branch or push only tags MUST be allowed/
      );
      expect(contractRow(hooks, '`git push` (not `--delete`/`--tags`)')).toContain('target branch');
    });

    test('fails closed on guard faults, but does not block ordinary commands or malformed input', () => {
      expect(
        contractRow(hooks, 'Guard fault, git write or GitHub branch/file/PR tool (FR-012a)')
      ).toMatch(/\| 2 \| empty \| `Branch guard unavailable:/);
      expect(contractRow(hooks, 'Guard fault, any other call (FR-012a)')).toMatch(
        /\| 0 \| `\{"systemMessage":"Branch guard unavailable:/
      );
      expect(contractRow(hooks, 'Malformed input')).toMatch(/\| 0 \| empty \| empty \|/);
      expect(contractRow(hooks, 'Refused, `LS_ENFORCE_BRANCH_NAMES=0`')).toMatch(
        /\| 0 \| `\{"systemMessage":"Branch guard \(warning only\):/
      );
    });

    test('protects the guard in both local and cloud sessions', () => {
      expect(requirement('FR-014')).toMatch(/both cloud and local agent sessions/);
      for (const protectedPath of [
        '`.claude/hooks/**`',
        '`.claude/settings.json`',
        '`.claude/settings.local.json`',
        '`~/.claude/settings.json`',
      ]) {
        expect(requirement('FR-013a')).toContain(protectedPath);
      }
      expect(hooks).toMatch(/`Edit` \/ `Write` \/ `MultiEdit` \/ `NotebookEdit`/);
      expect(hooks).toMatch(/Bash write verb or redirection naming a protected guard file/);
    });
  });

  describe('empty agent-branch cleanup', () => {
    test('requires a merged branch, verified absence of an open PR, and a full day of age', () => {
      expect(requirement('FR-020')).toMatch(
        /merged to a base branch.*open-PR verification succeeded.*at least 24 hours old/
      );
      expect(contractRow(cleanup, 'Condition')).toMatch(
        /merged to a base branch.*no open PR.*`AUTO_DELETE_MIN_AGE_DAYS` \(1\)/
      );
      expect(requirement('FR-021')).toMatch(/fails an FR-020 condition MUST NOT be auto-deleted/);
    });

    test('keeps audit dry-run-only and rechecks eligibility before deletion', () => {
      expect(requirement('FR-022')).toMatch(
        /audit command never deletes.*re-verifies each branch first/
      );
      expect(cleanup).toMatch(/`--dryRun=false` is still rejected with exit 1/);
      expect(contractRow(cleanup, 'Auto-delete (new)')).toMatch(
        /re-check merged and no open PR.*manual run chooses report-only/
      );
    });

    test('keeps open-PR and unverifiable branches out of automatic deletion', () => {
      expect(model).toMatch(/3\. Has an open PR → KEEP/);
      expect(model).toMatch(/If open-PR verification is unavailable, rule 4 never applies/);
      expect(model).toMatch(/"verification unavailable" DISCUSS rule/);
      expect(cleanup).toMatch(/All other results carry `autoApproved: false`/);
    });
  });

  test('defines a repeatable, secret-free shared environment', () => {
    expect(requirement('FR-016')).toMatch(/safe to run more than once/);
    expect(requirement('FR-018')).toMatch(
      /base branch and the enforcement switch.*MUST NOT contain secrets/
    );
    expect(contractRow(model, '`LS_BASE_BRANCH`')).toContain('`develop`');
    expect(contractRow(model, '`LS_ENFORCE_BRANCH_NAMES`')).toContain('`1`');
    expect(contractRow(model, '`LS_NODE_VERSION`')).toContain('from `.nvmrc`');
  });
});
