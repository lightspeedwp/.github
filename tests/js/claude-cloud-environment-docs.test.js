import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '../..');
const specDirectory = '.github/specs/018-claude-cloud-environment';

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
const docs = readDocument('docs/CLAUDE_CLOUD_ENVIRONMENT.md');

// The guard workflow skips the suite when no watched file changed, so any file
// the contract test reads must be in that workflow's change filter. An edit to a
// document outside the filter would otherwise pass CI having tested nothing.
describe('the guard workflow change filter', () => {
  const workflow = readDocument('.github/workflows/claude-guard-tests.yml');
  const pattern = new RegExp(workflow.match(/grep -qE '([^']+)'/)[1]);

  test.each([
    ['.github/specs/CATALOG.md', catalogue],
    ['.github/specs/018-claude-cloud-environment/spec.md', spec],
    ['.github/specs/018-claude-cloud-environment/plan.md', plan],
    ['.github/specs/018-claude-cloud-environment/tasks.md', tasks],
    ['.github/specs/018-claude-cloud-environment/data-model.md', model],
    ['.github/specs/018-claude-cloud-environment/research.md', research],
    ['.github/specs/018-claude-cloud-environment/checklists/requirements.md', checklist],
    ['.github/specs/018-claude-cloud-environment/quickstart.md', quickstart],
    ['docs/CLAUDE_CLOUD_ENVIRONMENT.md', docs],
  ])('runs the guard tests when %s changes', (file, content) => {
    expect(content.length).toBeGreaterThan(0);
    expect(pattern.test(file)).toBe(true);
  });

  test.each([
    'package.json',
    'package-lock.json',
    '.nvmrc',
    '.jest.config.cjs',
    'lib/validate-branch-name.js',
  ])('runs the guard tests when %s changes', (file) => {
    expect(pattern.test(file)).toBe(true);
  });

  // The guard suites import from the harness helpers directory, so any file in
  // it must trigger them. Matching one filename left every other helper, and
  // every future one, unwatched.
  test.each([
    'scripts/__tests__/helpers/claude-hook-harness.js',
    'scripts/__tests__/helpers/any-other-helper.js',
  ])('runs the guard tests when %s changes', (file) => {
    expect(pattern.test(file)).toBe(true);
  });

  test.each(['README.md', '.github/specs/017-ci-failure-remediation/spec.md'])(
    'does not run the guard tests for unrelated %s',
    (file) => {
      expect(pattern.test(file)).toBe(false);
    }
  );
});

describe('Claude cloud environment specification contracts', () => {
  test('catalogues the draft under the correct number and a working spec link', () => {
    const entries = catalogue.split('\n').filter((line) => /^\| 0(18) \|/.test(line));
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
          'Cloud and source is `startup`/`resume`, the `claude/*` placeholder was just renamed by this hook, clean tree, 0 commits ahead of `origin/<base>`'
        )
      ).toMatch(/Hard-reset to `origin\/<base>`/);
      // The reset must be gated on the rename, so a clean branch parked behind
      // the base branch is never moved.
      // The reset must be gated on the rename, so a clean branch parked behind
      // the base branch is never moved.
      expect(
        contractRow(
          hooks,
          'Cloud and source is `startup`/`resume`, the `claude/*` placeholder was just renamed by this hook, clean tree, 0 commits ahead of `origin/<base>`'
        )
      ).toMatch(/is gated on the rename this hook performed.*never reset/);
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
          'Cloud and source is `startup`/`resume`, installed dependency tree missing, or `package-lock.json` or `package.json` newer than the installed tree'
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
        /`gh api repos\/\{owner\}\/\{repo\}\/pulls\?head=\{owner\}:<branch>&state=open&per_page=1`/
      );
      // The timeout is a per-call figure, and the total is bounded separately: the
      // check runs per refspec and per commit, so without a total a single command
      // could hold the guard well past the hook timeout, and a hook that reaches
      // its timeout fails open.
      expect(hooks).toMatch(/timeout of up to 5 seconds/);
      expect(hooks).toMatch(/bounded to 5 seconds per invocation and cached per branch/);
      expect(hooks).toMatch(/Any failure means/);
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
      expect(model).toMatch(
        /still a platform placeholder, still has no commits of its own, and still has no open PR/
      );
      expect(model).toMatch(/Merge status is deliberately not re-checked/);
      expect(model).not.toMatch(/Re-check that the branch is still merged/);
      expect(model).toMatch(/Any failure → carry on with the other branches.*exit 2/);
      expect(contractRow(cleanup, 'Auto-delete (deferred)')).toMatch(
        /still a platform placeholder.*still no commits of its own.*still no open PR/
      );
      expect(contractRow(cleanup, 'Schedule')).toContain('At least daily');
      expect(contractRow(cleanup, 'Permissions')).toMatch(
        /`contents: write`.*`pull-requests: read`/
      );
    });

    test('requires a proven placeholder origin, verified absence of an open PR, and a full day of age', () => {
      // The origin condition is a separate branch-origin check, not merge
      // status. Spec 009 FR-002 counts a branch as merged once its tip appears
      // in a base branch's merge-base history, which is also true of a
      // `claude/*` branch holding real work that was later merged upstream.
      // FR-021 requires such a branch to follow normal categorisation, so the
      // merge test cannot stand in for "is a platform placeholder".
      // Read in order, so assert each clause on its own rather than one long
      // pattern that would silently pass on any reordering.
      const fr020 = requirement('FR-020');
      expect(fr020).toMatch(/separate branch-origin check/);
      expect(fr020).toMatch(/still has no commits of its own/);
      expect(fr020).toMatch(/is not the same test as being merged/);
      expect(fr020).toMatch(/open-PR verification succeeded and found none/);
      expect(fr020).toMatch(/at least 24 hours/);
      expect(contractRow(cleanup, 'Condition')).toMatch(
        /platform placeholder by a separate branch-origin check, not by merge status.*no commits of its own.*no open PR.*`AUTO_DELETE_MIN_AGE_DAYS` \(1\)/
      );
      expect(requirement('FR-021')).toMatch(/fails an FR-020 condition MUST NOT be auto-deleted/);
    });

    test('keeps a placeholder that received commits out of auto-approval', () => {
      // Scenario 6 promises a branch with its own commits is never
      // auto-deleted. An origin check identifies how a branch was *created*, so
      // a placeholder that later received commits could still satisfy the other
      // conditions. The no-own-commits test therefore has to be stated
      // explicitly rather than left to implication, and re-checked before
      // deletion because the branch can change in between.
      expect(requirement('FR-020')).toMatch(
        /still has no commits of its own, because a placeholder that later received commits stops being one/
      );
      expect(contractRow(cleanup, 'Condition')).toMatch(
        /no commits of its own, re-checked immediately before deletion/
      );
      // Scenario 5 is the other half of the same promise: a placeholder that has
      // received commits must not satisfy the positive scenario either, or the
      // two acceptance criteria disagree about the same branch.
      expect(spec).toMatch(
        /branch-origin check identifies as a platform placeholder, has no commits of its own/
      );
      expect(spec).toMatch(
        /branch that has its own commits.*it is not auto-deleted: it follows spec 009's normal categorisation/
      );
    });

    test('re-checks placeholder origin and own commits before deleting, not merge status', () => {
      // The lease binds the delete to one tip OID, so every eligibility
      // condition must be re-checked against that same tip. A placeholder that
      // received a commit after the audit would otherwise be deleted with the
      // new work still on it, and merge status is no longer a condition at all.
      expect(contractRow(cleanup, 'Auto-delete (deferred)')).toMatch(
        /re-check against the same tip the delete will act on.*still a platform placeholder.*still no commits of its own.*still no open PR.*Record that tip OID/
      );
      expect(contractRow(cleanup, 'Auto-delete (deferred)')).not.toMatch(
        /re-check merged and no open PR/
      );
    });

    test('does not promise draft-PR approval for every deferred candidate', () => {
      // Spec 009's unchanged naming rule sends an invalid `claude/*` name, or
      // one carrying its own commits, to DISCUSS, and nothing routes DISCUSS to
      // draft-PR approval. Claiming every candidate gets a draft PR would
      // contradict the documented rule order in data-model.md.
      expect(contractRow(cleanup, 'Configuration')).toMatch(
        /follows 009's categorisation, which is not always draft-PR approval.*routed to DISCUSS.*no route from DISCUSS to draft-PR approval/
      );
      expect(model).toMatch(/Invalid name .*claude\/\*.* → DISCUSS/);
      // The same promise must not survive in FR-020 or research.md.
      expect(requirement('FR-020')).not.toMatch(
        /every candidate follows spec 009's normal categorisation and draft-PR approval/
      );
      expect(requirement('FR-020')).toMatch(/KEEP, DISCUSS, or a draft-PR-approved DELETE/);
      expect(research).not.toMatch(
        /every candidate goes through 009's categorisation and draft-PR approval instead/
      );
    });

    test('records the missing branch-origin signal as a second blocker', () => {
      expect(contractRow(cleanup, 'Branch-origin check')).toMatch(
        /Not specified.*second blocker.*FR-021 requires a branch failing an FR-020 condition/
      );
      // The spec must not still assert the merge test as the origin condition.
      expect(requirement('FR-020')).not.toMatch(
        /merged to a base branch \(no commits of its own\)/
      );
      expect(contractRow(cleanup, 'Condition')).not.toMatch(/merged to a base branch/);
    });

    test('keeps audit dry-run-only and rechecks eligibility before deletion', () => {
      expect(requirement('FR-022')).toMatch(
        /audit command never deletes.*re-verifies each branch first/
      );
      expect(cleanup).toMatch(/`--dryRun=false` is still rejected with exit 1/);
      expect(contractRow(cleanup, 'Auto-delete (deferred)')).toMatch(
        /still no open PR.*manual run chooses report-only/
      );
    });

    test('keeps open-PR and unverifiable branches out of automatic deletion', () => {
      expect(model).toMatch(/3\. Has an open PR → KEEP/);
      expect(model).toMatch(/If open-PR verification is unavailable, rule 4 never applies/);
      expect(model).toMatch(/"verification unavailable" DISCUSS rule/);
      expect(cleanup).toMatch(/All other results carry `autoApproved: false`/);
    });

    test('keeps younger agent branches out of the auto-delete rule', () => {
      // The placeholder-origin condition is asserted above, where the reasoning
      // for separating it from merge status is recorded. Here the subject is the
      // age gate.
      expect(requirement('FR-020')).toMatch(/at least 24 hours/);
      // The age gate must come from a branch-age signal, not the age of the
      // tip commit: a branch created recently can carry an old tip commit.
      expect(requirement('FR-020')).toMatch(/branch-age signal/);
      expect(requirement('FR-020')).toMatch(/never from the age of its tip commit/);
      expect(requirement('FR-021')).toMatch(/fails an FR-020 condition MUST NOT be auto-deleted/);
      expect(contractRow(cleanup, 'Condition')).toMatch(
        /separate branch-origin check.*at least `AUTO_DELETE_MIN_AGE_DAYS` \(1\)/
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
  });

  // The environment cache limit is about five minutes and the setup script must
  // finish inside it. Bounding each install individually is not enough, because
  // those bounds run one after another: 90 + 150 + 150 is over six minutes. The
  // function therefore carries one deadline that each step is capped by.
  test('gives the linter installs a total deadline, not only per-step timeouts', () => {
    const setup = readDocument('.claude/cloud/setup.sh');
    const body = setup.slice(setup.indexOf('install_linters() {'));
    const fn = body.slice(0, body.indexOf('\n}\n'));
    expect(fn).toMatch(/LINTERS_BUDGET_SECONDS/);
    // The deadline is computed once and each step is capped by what is left of it,
    // so a slow first step cannot consume the whole budget.
    expect(fn).toMatch(/deadline=\$\(\(SECONDS \+ LINTERS_BUDGET_SECONDS\)\)/);
    const perStep = (fn.match(/timeout "\$\(remaining\)"/g) || []).length;
    expect(perStep).toBeGreaterThanOrEqual(3);
    // And the budget is inside the cache limit, with room to spare.
    const budget = Number(
      setup.match(/LINTERS_BUDGET_SECONDS="\$\{LS_LINTERS_BUDGET_SECONDS:-(\d+)\}"/)[1]
    );
    expect(budget).toBeGreaterThan(0);
    expect(budget).toBeLessThanOrEqual(240);
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

// The operations document and the validator's known limitation, kept in step with
// the feedback record rather than asserting an agreement that does not hold.
describe('the operations document', () => {
  // The mismatch this used to state is gone: #3558 merged and the library now
  // accepts the semver release form, so the document describes it as accepted
  // rather than pointing at a fixed issue. The guard is still not the library,
  // so the claim stays sourced to the library rather than asserted outright.
  test('describes the semver release form as accepted, with no open mismatch', () => {
    expect(docs).not.toMatch(/always agree/);
    expect(docs).toMatch(/release\/v1\.2\.3/);
    expect(docs).toMatch(/accepts/);
    expect(docs).not.toMatch(/known mismatch/);
    expect(docs).not.toMatch(/#3558/);
  });

  // Branch protection and rulesets are configured separately, so the verification
  // step has to cover both or an Owner on a ruleset cannot confirm the setting.
  // The check is required on the rulesets, which carry a merge-queue rule. A check
  // that only runs on a pull request is never reported for a batch, so the
  // requirement would block every queued merge.
  test('runs the guard workflow for merge-queue batches as well as pull requests', () => {
    const guardWorkflow = readDocument('.github/workflows/claude-guard-tests.yml');
    expect(guardWorkflow).toMatch(/merge_group:/);
    // And the event-specific fields it needs have to degrade rather than go empty,
    // since a merge-queue event carries no pull_request.
    expect(guardWorkflow).toMatch(
      /pull_request\.base\.sha \|\| github\.event\.merge_group\.base_sha/
    );
    expect(guardWorkflow).toMatch(/pull_request\.number \|\| github\.event\.merge_group\.head_sha/);
  });

  // FEEDBACK_RESPONSE.md is this pull request's record and is replaced by the next
  // one, so nothing here asserts its contents: a test that bound to this file would
  // fail every later pull request for no reason. Its rules are enforced by the
  // repository's own ai-feedback validation, which runs on every pull request.

  // A hook that reaches its timeout is killed, and a killed hook is treated as
  // non-blocking, so the guard's own network budget has to sit well inside the
  // hook timeout. This is asserted rather than left to be re-derived.
  test('keeps the guard network budget well below the hook timeout', () => {
    const guard = readDocument('.claude/hooks/enforce-branch-name.mjs');
    const budget = Number(guard.match(/const PR_CHECK_BUDGET_MS = (\d+);/)[1]);
    const settings = JSON.parse(readDocument('.claude/settings.json'));
    const hook = settings.hooks.PreToolUse.flatMap((entry) => entry.hooks).find((h) =>
      h.command.includes('run-guard')
    );
    const timeoutSeconds = hook.timeout;
    expect(timeoutSeconds).toBeGreaterThan(0);
    // At most a third of it, and in milliseconds against a seconds value.
    expect(budget).toBeLessThanOrEqual((timeoutSeconds * 1000) / 3);
  });

  test('covers both branch protection and rulesets in the verification step', () => {
    expect(docs).toMatch(/branches\/develop\/protection/);
    expect(docs).toMatch(/repos\/lightspeedwp\/\.github\/rulesets/);
  });

  // The documented queries have to name the fields that actually exist: a
  // ruleset reports branch coverage under conditions.ref_name and the code-owner
  // requirement under parameters.require_code_owner_review.
  // The limitation is stated, not implicit: a reader must not assume the guard
  // inspects a command handed to another interpreter.
  // The guard now reads a command handed to another shell, so these forms are
  // covered rather than disclaimed. The test still has to name them: a form that
  // quietly stopped being recognised would otherwise be invisible here.
  test.each(['sh -c', 'bash -c', 'zsh -c', 'eval'])(
    'covers %s rather than disclaiming it',
    (form) => {
      expect(docs).toMatch(new RegExp(form.replace(/[-]/g, '\\-')));
      expect(docs).not.toMatch(new RegExp(`${form.replace(/[-]/g, '\\-')} .*out of scope`));
    }
  );

  test('states the depth limit and the limits that remain in the hooks contract', () => {
    expect(hooks).toMatch(/SC-009/);
    expect(hooks).toMatch(/NESTED_DEPTH/);
    // The remaining out-of-scope case is a command in another language, which
    // the guard does not read. It has to stay stated or the claim becomes a
    // blanket guarantee.
    expect(hooks).toMatch(/out of scope/);
    expect(hooks).toMatch(/python -c/);
  });

  test('documents the ruleset fields that the API actually returns', () => {
    expect(docs).toMatch(/\.parameters\.require_code_owner_review/);
    expect(docs).toMatch(/\.conditions\.ref_name/);
    expect(docs).toMatch(/required_status_checks\[\]\.context/);
  });
});
