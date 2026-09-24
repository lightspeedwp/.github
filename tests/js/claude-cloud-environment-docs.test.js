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

  test('retains the complete set of functional requirements, including the fault, security and CI-gate additions', () => {
    const declarations = [...spec.matchAll(/^- \*\*(FR-\d{3}[a-z]?)\*\*:/gm)].map(
      (match) => match[1]
    );
    const expected = Array.from(
      { length: 23 },
      (_, index) => `FR-${String(index + 1).padStart(3, '0')}`
    );

    expect(declarations.sort()).toEqual([...expected, 'FR-012a', 'FR-013a'].sort());
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
    test('emits one parseable context response containing every required branching rule', () => {
      const output = hooks.match(
        /\*\*Output \(stdout\)\*\*: exactly one JSON object:\s*```json\s*([^\n]+)\s*```/
      );
      expect(output).not.toBeNull();
      expect(JSON.parse(output[1])).toEqual({
        hookSpecificOutput: {
          hookEventName: 'SessionStart',
          additionalContext: '<rules text>',
        },
      });
      for (const rule of [
        'current branch and the base branch',
        'pattern',
        'authorised types',
        'forbidden prefixes',
        'placeholder warning',
        'rename and validate commands',
        'PR base rule',
        'documentation exception',
        'legacy PR exception',
        "guard's own files can't be edited",
        'override any platform `claude/*` instruction',
      ]) {
        expect(hooks).toContain(rule);
      }
      expect(hooks).toMatch(/All other output goes to stderr\. The exit code is always 0/);
    });

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

    test('does not rename local branches or reset branches with uncommitted changes or commits', () => {
      expect(requirement('FR-001')).toMatch(/in a cloud session/);
      expect(requirement('FR-002')).toMatch(/no commits of its own and no uncommitted changes/);
      expect(hooks).toMatch(/Cloud and source is `startup`\/`resume`.*Rename locally/m);
      expect(contractRow(hooks, 'Any source, cloud or local')).toContain('context');
      expect(model).toMatch(/When the tree is clean and has no local commits.*resets/s);
    });

    test('treats dependency installation failures as non-fatal', () => {
      expect(requirement('FR-004')).toMatch(/missing or out of date and skipped when current/);
      expect(requirement('FR-004')).toMatch(/failed install MUST NOT prevent the session/);
      expect(
        contractRow(
          hooks,
          'Cloud and source is `startup`/`resume`, installed dependency tree missing or lockfile newer than the installed tree'
        )
      ).toMatch(/`npm install`\. Failure is logged and not fatal/);
    });
  });

  describe('branch guard behaviour', () => {
    test('keeps placeholders blocked and legacy PR branches write-only', () => {
      expect(contractRow(model, 'Placeholder')).toMatch(/\^chore\/session-\[a-z0-9\]\+\$/);
      expect(contractRow(model, 'Placeholder')).toMatch(/\| refused \| refused \|/);
      expect(contractRow(model, 'Legacy PR branch')).toMatch(/exists on GitHub.*open PR/);
      expect(contractRow(model, 'Legacy PR branch')).toMatch(/\| refused \| allowed/);
      expect(contractRow(hooks, '`git commit`')).toMatch(/placeholder.*legacy PR exception fails/);
      expect(contractRow(hooks, '`git push` (not `--delete`/`--tags`)')).toMatch(
        /placeholder.*legacy PR exception fails/
      );
    });

    test('checks every affected path before allowing the base-branch documentation exception', () => {
      expect(model).toMatch(/every affected path is a normalised repository-relative path/);
      expect(model).toMatch(
        /\*\*Commit\*\*: staged paths, plus `-a` tracked changes, plus paths from an earlier `git add`/
      );
      expect(model).toContain('`git diff --name-only origin/<target>...<source>`');
      expect(model).toContain('**MCP**: the paths in the tool input');
      expect(research).toMatch(/`docs\/\.\.\/x` is\s+rejected after normalisation/);
      expect(model).toMatch(/An empty or unknown path set fails closed/);
    });

    test('makes refused actions actionable without leaking hook output into stdout', () => {
      expect(requirement('FR-011')).toMatch(
        /which rule was broken.*corrected name.*exact rename and validation steps/
      );
      expect(hooks).toMatch(/One line per problem, naming the rule/);
      expect(hooks).toContain('`git branch -m <type>/<scope>-<title>`');
      expect(hooks).toContain('`npm run validate:branch-name -- --current`');
      expect(contractRow(hooks, 'Refused, enforcing')).toMatch(/\| 2 \| empty \| Refusal message/);
    });

    test('scopes legacy PR lookups and GitHub guard calls to the intended owner', () => {
      expect(hooks).toMatch(/`git ls-remote --exit-code --heads origin <branch>`/);
      expect(hooks).toMatch(
        /`gh pr list --head <branch> --state open --json number,isCrossRepository --limit 1`/
      );
      expect(hooks).toMatch(/each with a 5-second timeout\. Any failure means/);
      expect(hooks).toMatch(
        /MCP calls and `gh` commands whose owner isn't `lightspeedwp`.*are always allowed/
      );
      expect(contractRow(hooks, '`mcp__github__create_pull_request`')).toMatch(
        /`base == main`.*`release\/\*`\/`hotfix\/\*`/
      );
    });

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
      expect(requirement('FR-006')).toMatch(
        /can't be verified \(.*longer than 5 seconds\), the exception doesn't apply/
      );
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
        contractRow(
          hooks,
          'Guard fault, git write or GitHub branch/file/PR tool, enforcing (FR-012a)'
        )
      ).toMatch(/\| 2 \| empty \| `Branch guard unavailable:/);
      expect(
        contractRow(
          hooks,
          'Guard fault, git write or GitHub branch/file/PR tool, `LS_ENFORCE_BRANCH_NAMES=0` (FR-013)'
        )
      ).toMatch(/\| 0; write proceeds \| `\{"systemMessage":"Branch guard \(warning only\):/);
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
      expect(hooks).toMatch(
        /Bash write verb or redirection \(outside quotes\) naming a protected guard file/
      );
    });

    test('refuses documentation-only writes to main and unknown path sets on develop', () => {
      expect(requirement('FR-005')).toMatch(/always for `main`/);
      expect(requirement('FR-006')).toMatch(/never `main`/);
      expect(requirement('FR-008')).toMatch(/never `main`/);
      expect(quickstart).toMatch(/Commit on `main` with only `docs\/` files staged \| exit 2/);
      expect(model).toMatch(
        /normalised repository-relative path under `\.github\/specs\/`\s+or `docs\/`/
      );
      expect(model).toMatch(/An empty or unknown path set fails closed/);
    });

    test('covers branch creation, renaming and GitHub file writes as well as git commits', () => {
      expect(requirement('FR-007')).toMatch(/locally or through the GitHub integration/);
      expect(requirement('FR-008')).toMatch(
        /Writing files to a non-compliant or placeholder branch/
      );
      for (const operation of [
        '`git branch -m/-M`',
        '`git checkout -b/-B`, `git switch -c/-C`',
        '`mcp__github__create_branch`',
        '`mcp__github__push_files` / `create_or_update_file` / `delete_file`',
      ]) {
        expect(contractRow(hooks, operation)).toMatch(/not compliant|placeholder/);
      }
    });

    test('restricts PRs into main on this repository without blocking other owners', () => {
      expect(requirement('FR-009')).toMatch(/base is `main`.*`release\/\*` or `hotfix\/\*`/);
      expect(contractRow(hooks, '`mcp__github__create_pull_request`')).toMatch(
        /`base == main`.*`release\/\*`\/`hotfix\/\*`/
      );
      expect(hooks).toMatch(
        /MCP calls and `gh` commands whose owner isn't `lightspeedwp`.*are always allowed/
      );
      expect(quickstart).toMatch(/MCP PR from `feat\/a-b` into `main`.*exit 2/);
    });

    test('uses the CI validator and ignores branch-like text inside commit messages', () => {
      expect(requirement('FR-010')).toContain('`lib/validate-branch-name.js`');
      expect(requirement('FR-010')).toContain('`scripts/validation/validate-branch-name.js`');
      expect(requirement('FR-012')).toMatch(/quoted strings and here-documents/);
      expect(quickstart).toMatch(/`git commit -m "mentions claude\/x"`.*exit 0/);
    });

    test('prevents per-command overrides of enforcement while allowing configured warnings', () => {
      expect(requirement('FR-013')).toMatch(/only from the environment the session started with/);
      expect(hooks).toMatch(/Variables set in the agent's\s+Bash commands never reach the hook/);
      expect(quickstart).toMatch(/`LS_ENFORCE_BRANCH_NAMES=0 git commit -m x`.*exit 2/);
      expect(contractRow(hooks, 'Refused, `LS_ENFORCE_BRANCH_NAMES=0`')).toContain('warning only');
    });

    test('covers user-level settings and read-only access to protected guard files', () => {
      expect(requirement('FR-013a')).toContain('`~/.claude/settings.json`');
      expect(model).toMatch(/Reads are always allowed/);
      expect(quickstart).toMatch(/`cat \.claude\/settings\.json` \| exit 0/);
      expect(quickstart).toMatch(/`Edit` of `\.claude\/settings\.local\.json`.*exit 2/);
    });
  });

  describe('empty agent-branch cleanup', () => {
    test('evaluates protection and open PRs before auto-approval, then preserves ordinary review', () => {
      const decisions = model.slice(model.indexOf('## Cleanup decision'));
      const order = [
        'Protected branch → KEEP',
        'Matches an exclusion pattern → KEEP',
        'Has an open PR → KEEP',
        '**DELETE, auto-approved**',
        'Invalid name',
      ].map((rule) => decisions.indexOf(rule));

      expect(order.every((position) => position >= 0)).toBe(true);
      expect(order).toEqual([...order].sort((left, right) => left - right));
      expect(contractRow(cleanup, 'Draft PR')).toMatch(/remaining `DELETE` candidates.*approval/);
      expect(contractRow(cleanup, 'DISCUSS issue')).toContain('Unchanged');
    });

    test('rechecks before deletion and continues after an individual failure', () => {
      expect(model).toMatch(/Re-check that the branch is still merged and has no open PR/);
      expect(model).toMatch(/Any failure → carry on with the other branches.*exit 2/);
      expect(contractRow(cleanup, 'Auto-delete (new)')).toMatch(/re-check merged and no open PR/);
      expect(contractRow(cleanup, 'Schedule')).toContain('At least daily');
      expect(contractRow(cleanup, 'Permissions')).toMatch(
        /`contents: write`.*`pull-requests: read`/
      );
    });

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

    test('keeps younger or unmerged agent branches out of the auto-delete rule', () => {
      expect(requirement('FR-020')).toMatch(/merged to a base branch \(no commits of its own\)/);
      expect(requirement('FR-020')).toMatch(/at least 24 hours old/);
      expect(requirement('FR-021')).toMatch(/fails an FR-020 condition MUST NOT be auto-deleted/);
      expect(contractRow(cleanup, 'Condition')).toMatch(
        /merged to a base branch.*at least `AUTO_DELETE_MIN_AGE_DAYS` \(1\)/
      );
      expect(model).toMatch(
        /Invalid name \(including `claude\/\*` branches with their own commits\) → DISCUSS/
      );
    });

    test('reports auto-approvals and preserves the partial-failure status', () => {
      expect(cleanup).toContain('`summary.autoApprovedDelete`');
      expect(cleanup).toMatch(/`autoApproved` to each candidate in `deleted\[\]`/);
      expect(contractRow(cleanup, 'Exit status')).toMatch(/partial-failure status/);
      expect(model).toMatch(/Any failure → carry on with the other branches.*exit 2/);
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

  test('identifies a single canonical, versioned environment and its bounded configuration', () => {
    expect(requirement('FR-015')).toMatch(
      /canonical provisioning script and environment variables/
    );
    expect(model).toContain('The canonical copy is kept in `.claude/cloud/`');
    expect(contractRow(model, 'Environment variables')).toContain(
      '`.claude/cloud/environment.env`'
    );
    expect(contractRow(model, 'Setup script')).toContain('`.claude/cloud/setup.sh`');
    expect(requirement('FR-018')).toMatch(/MUST NOT contain secrets/);
  });

  test('does not make optional setup failures fatal or drift from the pinned runtime', () => {
    expect(requirement('FR-016')).toMatch(/exit successfully even when an optional install fails/);
    expect(requirement('FR-016')).toMatch(/five-minute limit/);
    expect(requirement('FR-017')).toMatch(/runtime version pinned by the repository/);
    expect(contractRow(model, 'Setup script')).toMatch(/exits 0, under 5 min, idempotent/);
    expect(contractRow(model, '`LS_NODE_VERSION`')).toContain('`.nvmrc`');
  });
});
