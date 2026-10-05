const fs = require('fs');
const path = require('path');

const specRoot = path.resolve(__dirname, '../../.github/specs/008-label-audit-consolidation');
const read = (file) => fs.readFileSync(path.join(specRoot, file), 'utf8');
const changeRequests = JSON.parse(
  fs.readFileSync(
    path.resolve(
      specRoot,
      '../../reports/audits/2026-09-14-label-audit/evidence/change-requests.json'
    ),
    'utf8'
  )
).requests;

// These are acceptance checks for planning artefacts. The consolidation and
// Linear write tooling described here has not been implemented by this PR.
function section(markdown, heading) {
  const lines = markdown.split('\n');
  const start = lines.indexOf(heading);
  if (start === -1) throw new Error(`Missing heading: ${heading}`);
  const depth = heading.match(/^#+/)[0].length;
  const end = lines.findIndex((line, index) => {
    const match = line.match(/^(#+) /);
    return index > start && match && match[1].length <= depth;
  });
  return lines.slice(start + 1, end === -1 ? undefined : end).join('\n');
}

const tasks = read('tasks.md');
const taskRows = [...tasks.matchAll(/^- \[([ xX])\] (T\d{3}[a-z]?)\b (.+)$/gm)].map(
  ([, checked, id, text]) => ({ id, done: checked.toLowerCase() === 'x', text })
);
const task = (id) => {
  const matches = taskRows.filter((row) => row.id === id);
  expect(matches).toHaveLength(1);
  return matches[0];
};
const dependencies = (id) => {
  const match = task(id).text.match(/\(depends on ([^)]+)\)/i);
  expect(match).not.toBeNull();
  // Text after the semicolon describes the exit condition, not a prerequisite.
  return match[1].split(';')[0].match(/T\d{3}[a-z]?\b/g);
};

describe('Label consolidation post-merge task plan', () => {
  test('reports totals derived from unique task rows, including Phase 8', () => {
    const phase8 = section(
      tasks,
      '## Phase 8: User Story 4 - Governance Lead Aligns GitHub and Linear Labels (Priority: P1)'
    );
    const phase8Count = [...phase8.matchAll(/^- \[[ xX]\] T\d{3}[a-z]?\b/gm)].length;

    expect(taskRows).toHaveLength(118);
    expect(new Set(taskRows.map(({ id }) => id)).size).toBe(taskRows.length);
    expect(taskRows.filter(({ done }) => done)).toHaveLength(64);
    expect(phase8Count).toBe(67);
    expect(tasks).toContain(`**Total Tasks**: ${taskRows.length}`);
    expect(tasks).toContain(`All ${taskRows.length} tasks in phases 1-10`);
    expect(tasks).toContain(`Phase 8, User Story 4, is ${phase8Count} of the ${taskRows.length}`);
  });

  test.each([
    ['T040b', '3534'],
    ['T053', '3534'],
    ['T054', '3534'],
    ['T040d', '3564'],
    ['T040e', '3564'],
    ['T040f', '3564'],
    ['T040g', '3564'],
  ])('marks %s complete with its implementing PR', (id, pr) => {
    expect(task(id).done).toBe(true);
    expect(task(id).text).toMatch(new RegExp(`(?:#|/pull/)${pr}\\b`));
  });

  test('keeps manual settings, sign-off and gate setup open after configuration completion', () => {
    expect(task('T052').done).toBe(true);
    for (const id of ['T040c', 'T046c', 'T055']) {
      expect(task(id).done).toBe(false);
    }
    // T040n tracks the dated sign-off on #3556 and #3557: it may be checked
    // only once both are approved in the evidence file, and stays open until.
    const signedOff = [3556, 3557].every((number) =>
      changeRequests.some(
        ({ issue_number, status }) => issue_number === number && status === 'approved'
      )
    );
    expect(task('T040n').done).toBe(signedOff);
    expect(task('T055').text).toMatch(/partly done in #3362/);
    expect(task('T055').text).toMatch(/`gated_by_issue` still waits/);
  });

  test.each([
    ['T046a', ['T046c']],
    ['T062b', ['T062', 'T062a']],
    ['T062c', ['T062b']],
    ['T064', ['T062b', 'T062c', 'T063', 'T071']],
    ['T065a', ['T065', 'T062c']],
    ['T067', ['T066', 'T065a']],
    ['T067a', ['T067']],
    ['T069a', ['T042', 'T062a', 'T062b']],
    ['T069', ['T067', 'T064c', 'T069a']],
    ['T070', ['T067', 'T069', 'T069a']],
    ['T071', ['T059']],
    ['T084', ['T080']],
    ['T083', ['T069', 'T070', 'T071']],
    ['T071', ['T059']],
  ])('preserves the execution prerequisites for %s', (id, required) => {
    expect(dependencies(id)).toEqual(required);
    required.forEach((dependency) => task(dependency));
  });

  test('does not reintroduce the Stage 3 / Stage 5 dependency cycle', () => {
    expect(dependencies('T064')).toContain('T071');
    expect(dependencies('T071')).not.toContain('T069');
    expect(dependencies('T071')).not.toContain('T070');
    expect(task('T071').text).toMatch(/must finish before T064 runs/);
  });

  test('links the pre-run type snapshot to both post-deletion integrity checks', () => {
    expect(task('T064').text).toMatch(/pre-run snapshot.*T067a.*SC-011/);
    expect(task('T067a').text).toMatch(/SC-011 and SC-012/);
    expect(task('T067a').text).toMatch(/T063 pre-run snapshot has exactly one/);
    expect(task('T067a').text).toMatch(/every deleted label has a snapshot entry/);
  });
});

describe('Post-merge approval and replacement contracts', () => {
  const plan = read('plan.md');
  const spec = read('spec.md');
  const replacement = section(read('contracts/decision-issue-template.md'), '## Replacement rules');

  test('requires dated approval evidence or a partial revert before later locked-file work', () => {
    const rule = spec.split('\n').find((line) => line.startsWith('- **FR-009**:'));
    for (const text of [rule, task('T040n').text]) {
      expect(text).toMatch(/reopen/i);
      expect(text).toContain('#3557');
      expect(text).toMatch(/dated sign-off/);
      expect(text).toMatch(/reject.*revert|revert.*reject/i);
      expect(text).toContain('change-requests.json');
    }
    expect(rule).toMatch(/No later locked-file change starts until the sign-off or revert is done/);
    expect(task('T040n').text).toContain('Blocks T051 onwards');
    for (const field of ['approved_by', 'approved_at', 'approval_comment']) {
      expect(task('T040n').text).toContain(`\`${field}\``);
    }
    expect(plan).toMatch(/opened as a draft.*until its change requests show `approved`/);
    expect(plan).toMatch(/#3554.*closed as completed/);
    expect(plan).toContain('reopened before T046a');
  });

  test('separates the template replacement, policy clean-up and actual label deletion', () => {
    expect(replacement).toMatch(/Two change requests.*#3556.*#3557.*approved in #3530/);
    expect(replacement).toMatch(/06-decision\.md.*06-question\.md.*#3534/);
    expect(replacement).toMatch(/never-delete list.*#3362.*T055/);
    expect(replacement).toMatch(/T055 stays open until `gated_by_issue`/);
    expect(replacement).toMatch(
      /deleted only in Stage 4, after open `type:question` issues are converted/
    );
    expect(replacement).not.toContain('until the three change requests merge');
  });

  test.each([3, 4, 5])('assigns FR-023 to execution Stage %i', (stage) => {
    const row = plan.split('\n').find((line) => line.startsWith(`| ${stage}. `));
    expect(row).toBeDefined();
    expect(row.split('|').at(-2)).toContain('FR-023');
  });
});

describe('Run-safety documentation and log examples', () => {
  const contract = read('contracts/dry-run-and-drift-report-schema.md');
  const model = read('data-model.md');
  const research = section(
    read('research.md'),
    '### R21. Run safety for Stages 3 to 5 (FR-023, SC-011, SC-012)'
  );
  const rules = section(contract, '### Rules');
  const logs = section(contract, '## Run logs (FR-023)');

  test.each([
    [
      'consolidation-log.jsonl',
      '### `consolidation-log.jsonl` (GitHub, Stages 3 and 4)',
      '### 14. Consolidation Log Entry',
    ],
    [
      'linear-writes.jsonl',
      '### `linear-writes.jsonl` (Linear, Stage 5)',
      '### 15. Linear Write Log Entry',
    ],
    [
      'linear-changes.jsonl',
      '### `linear-changes.jsonl` (Linear labels, Stage 5)',
      '### 17. Linear Label Change Log Entry',
    ],
  ])(
    '%s example contains exactly the fields declared in its data model',
    (file, heading, modelHeading) => {
      const example = section(contract, heading).match(/```jsonl\n([\s\S]*?)\n```/);
      expect(example).not.toBeNull();
      const entries = example[1].split('\n').map((line) => JSON.parse(line));
      const fields = [...section(model, modelHeading).matchAll(/^\| (`[^|]+) \|/gm)].flatMap(
        ([, cell]) => [...cell.matchAll(/`([^`]+)`/g)].map(([, field]) => field)
      );

      expect(Array.isArray(entries)).toBe(true);
      expect(entries).toHaveLength(2);
      expect(fields.length).toBeGreaterThan(0);
      for (const entry of entries) {
        expect(Object.keys(entry).sort()).toEqual([...fields].sort());
        expect(entry.at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
        expect(Number.isNaN(Date.parse(entry.at))).toBe(false);
      }
      // One change is an ordered intended/done pair sharing a run-prefixed op_id.
      const [intended, done] = entries;
      expect([intended.state, done.state]).toEqual(['intended', 'done']);
      expect(done.op_id).toBe(intended.op_id);
      expect(intended.op_id).toMatch(/^run-\d{8}T\d{6}-[0-9a-f]{8}-\d{4}$/);
      expect(Date.parse(done.at)).toBeGreaterThan(Date.parse(intended.at));
      // An operation cannot happen before the run named in its op_id started.
      const [, y, mo, d, h, mi, s] = intended.op_id.match(
        /^run-(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})-/
      );
      expect(Date.parse(intended.at)).toBeGreaterThanOrEqual(
        Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)
      );
      expect(research).toContain(`evidence/${file}`);
    }
  );

  test('the deletion example preserves the dry-run label snapshot and uses a null after state', () => {
    const dryRun = JSON.parse(contract.match(/```json\n([\s\S]*?)\n```/)[1]);
    const log = section(contract, '### `consolidation-log.jsonl` (GitHub, Stages 3 and 4)')
      .match(/```jsonl\n([\s\S]*?)\n```/)[1]
      .split('\n')
      .map((line) => JSON.parse(line));
    const [entry] = log;
    const { name, color, description } = dryRun.to_delete.find(({ name }) => name === entry.label);

    expect(entry.action).toBe('delete');
    expect(entry.repository).toBe(dryRun.repository);
    expect(entry.before).toEqual({ name, color, description });
    expect(entry.after).toBeNull();
    // A GitHub issue number is a positive integer, so the example must not use 0.
    expect(Number.isInteger(entry.gate_issue)).toBe(true);
    expect(entry.gate_issue).toBeGreaterThan(0);
  });

  test('the Linear example identifies both sides of its mapping by ID and scope', () => {
    const example = section(contract, '### `linear-writes.jsonl` (Linear, Stage 5)');
    const [entry] = example
      .match(/```jsonl\n([\s\S]*?)\n```/)[1]
      .split('\n')
      .map((line) => JSON.parse(line));
    for (const label of [entry.old_label, entry.new_label]) {
      expect(label).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        scope: 'workspace',
      });
      expect(label.id.length).toBeGreaterThan(0);
    }
    expect(entry.mapping).toBe(`${entry.old_label.name} -> ${entry.new_label.name}`);
    expect(section(model, '### 15. Linear Write Log Entry')).toMatch(
      /either may be null for a pure add or removal/
    );
    expect(logs).toMatch(/identified by `id` and `scope`, never by name alone/);
    expect(task('T069a').text).toMatch(
      /team label that shares a workspace label's name is mapped separately/
    );
  });

  test('invalidates approval when either labels or their item assignments change', () => {
    const reread = rules.split('\n').find((line) => line.startsWith('6. '));
    expect(reread).toMatch(/re-reads.*labels and the items carrying each `to_delete` label/);
    expect(reread).toMatch(
      /either differs.*skips.*reason on the gate issue.*new dry run and approval/
    );
    expect(reread).toMatch(/this run's own `done` records/);
    expect(task('T065a').text).toMatch(
      /approved_set_commit.*stale.*skip.*new dry run and approval/
    );
    expect(model).toMatch(/approved → stale .*→ regenerated → approved again/);
  });

  test('records item kind with number, keeps logs as durable JSON Lines, and defers removal to Stage 4', () => {
    const spec = read('spec.md');
    expect(spec).toMatch(/the kind and number of every issue, PR and Discussion carrying it/);
    expect(rules).toMatch(
      /each item's kind \(`issue`, `pull_request` or `discussion`\) and number/
    );
    expect(contract).toMatch(/"open_items": \[\{ "kind": "issue", "number": 95 \}\]/);
    expect(task('T065').text).toMatch(/kind and number of each open and closed item/);
    expect(logs).toMatch(/JSON Lines in `evidence\/` \(one JSON object per line/);
    expect(logs).toMatch(/flushed to disk \(`fsync`\)/);
    expect(logs).toMatch(/A reader skips a final line that does not parse as JSON/);
    expect(task('T063').text).toMatch(/\[US4\] First, before changing any label, write a snapshot/);
    expect(task('T064').text).toMatch(/pre-run snapshot that T063 wrote before any change/);
    expect(spec).toMatch(/still removes no label that lacks a mapping/);
    expect(task('T064d').text).toMatch(/keeping unmapped removal off/);
    expect(spec).toMatch(/every non-archived, non-fork `lightspeedwp` repository's label set/);
    expect(spec).toMatch(/Archived repositories and forks are out of scope \(FR-016\)/);
  });

  test('separates the Linear credential, shares one write queue, and recovers every Linear write', () => {
    const spec = read('spec.md');
    expect(spec).toMatch(/Linear write operations \(Stage 5\) use a separate credential/);
    expect(spec).toMatch(/never the read-only `LINEAR_API_KEY`/);
    expect(task('T062a').text).toMatch(/transport-specific callback.*Linear adapter/);
    expect(task('T062a').text).toMatch(/pause-and-resume and both adapters/);
    expect(task('T065a').text).toMatch(/own completed `done` records are applied/);
    expect(task('T065a').text).toMatch(/resumed-run case/);
    expect(task('T070').text).toMatch(/Stage 5 run lock from T062b/);
    expect(task('T070').text).toMatch(
      /`intended` record before the call and a `done` record after it/
    );
    expect(task('T070').text).toMatch(/full before-state/);
    expect(task('T070').text).toMatch(/a query shows zero left/);
    expect(spec).toMatch(/live automation reads or applies it/);
    expect(spec).toMatch(
      /does not count\. The mapping's `notes` cite the file, the line and that operative use/
    );
    expect(spec).toMatch(
      /names every locked file the PR changes \(its `covers` list, added by T084/
    );
    expect(read('plan.md')).toMatch(/T040n's dated sign-off on #3556 and #3557/);
    expect(read('quickstart.md')).toMatch(/# Expected: `\[\]` \(an empty JSON array\)/);
  });

  test('identifies items, runs and actors unambiguously in every log', () => {
    const spec = read('spec.md');
    const logModel = section(model, '### 14. Consolidation Log Entry');
    expect(logModel).toMatch(/`item`, an object `\{ kind, number \}`/);
    expect(logModel).toMatch(
      /source issue in `before\.item` and the resulting Discussion in `after\.item`/
    );
    expect(logs).toMatch(/`before\.item` \(for example `\{ "kind": "issue", "number": 12 \}`\)/);
    expect(logs).toMatch(/`after\.item` \(`\{ "kind": "discussion", "number": 3 \}`\)/);
    expect(task('T063').text).toMatch(
      /source issue in `before\.item` and the resulting Discussion in `after\.item`/
    );
    expect(section(model, '### 16. Run Lock')).toMatch(
      /eight random hex digits, so two runs started in the same minute or second never share one/
    );
    expect(task('T062b').text).toMatch(
      /eight random hex digits, so two runs started in the same minute never share one/
    );
    expect(task('T062c').text).toMatch(
      /two fresh runs started within the same second get different `run_id`s/
    );
    expect(spec).toMatch(
      /the UTC start time to the second plus eight random hex digits, unique per run/
    );
    expect(section(model, '### 15. Linear Write Log Entry')).toMatch(/\| `run_by` \|/);
    expect(task('T069a').text).toMatch(/\(`run_by`, `issue`, `old_label`/);
    expect(section(model, '### 17. Linear Label Change Log Entry')).toMatch(
      /`retire`.*`move_to_team`.*`restyle`/
    );
    expect(task('T070').text).toMatch(/Linear Label Change Log Entry fields from `data-model\.md`/);
    expect(spec).toMatch(/every label-level Linear change \(retire, move to team scope, restyle\)/);
    expect(read('plan.md')).toMatch(/linear-changes\.jsonl {6}# US4: every Linear label change/);
    expect(read('quickstart.md')).toMatch(
      /`evidence\/linear-changes\.jsonl` has a `done` record for every retired, moved or restyled label/
    );
    expect(contract).toMatch(/the three run logs/);
  });

  test('recovers a torn log tail before appending, and keeps R6 inside FR-017', () => {
    expect(logs).toMatch(
      /A writer that resumes first truncates the log back to its last newline, keeping the removed bytes in a `\.partial` file/
    );
    expect(logs).toMatch(
      /a cut-off `done` line leaves its `intended` record unmatched, which the reconciliation in rule 4 then completes/
    );
    expect(research).toMatch(
      /a writer that resumes first truncates the log back to its last newline/
    );
    expect(task('T062b').text).toMatch(
      /truncate a log whose last line was cut off back to its last newline/
    );
    expect(task('T062c').text).toMatch(
      /last line was cut off mid-write is truncated back to its last newline/
    );
    expect(read('quickstart.md')).toMatch(
      /Cut the last line of `evidence\/consolidation-log\.jsonl` off mid-record/
    );
    expect(section(model, '### 16. Run Lock')).toMatch(
      /a resumed run deletes the file when it finishes successfully/
    );
    const r6 = section(read('research.md'), '### R6. Stopping labels from being recreated');
    expect(r6).toMatch(
      /restrict repository label creation only where GitHub allows it without reducing anyone's existing repository access \(FR-017\)/
    );
    expect(r6).not.toMatch(/limit repository label management to maintainers/);
  });

  test('orders Stage 5 work serially and bounds the sync gap with its own task', () => {
    expect(task('T070').text).not.toMatch(/^\[P\]/);
    expect(task('T069').text).not.toMatch(/^\[P\]/);
    expect(task('T070').text).toMatch(
      /runs after T069, because retiring a label before its issues are relabelled/
    );
    expect(tasks).toMatch(/T069 then T070 in sequence after T069a/);
    expect(tasks).not.toMatch(/T069 and T070 in parallel/);
    expect(task('T071').text).toMatch(/T083 turns it back on when Stage 5 ends/);
    expect(task('T071').text).not.toMatch(/record both times/);
    expect(task('T071').text).toMatch(
      /every team's sync-off state has been read back and verified/
    );
    expect(task('T083').text).toMatch(/After T069 and T070 finish \(Stage 5 ends\)/);
    expect(read('quickstart.md')).toMatch(
      /turned the GitHub issue sync off for has it back on \(T083\)/
    );
    expect(tasks).toMatch(/\*\*Total Tasks\*\*: 118/);
  });

  test('keeps the plan current with merged PRs, the lock complete, and settings out of the run logs', () => {
    const plan = read('plan.md');
    expect(section(model, '### 16. Run Lock')).toMatch(/\| `host` \| string \|/);
    expect(task('T062b').text).toMatch(
      /`epoch`, `host` and `resumed_from`, which is null on a first start/
    );
    expect(read('research.md')).toMatch(
      /an `epoch`, its `host` and, after a resume, `resumed_from`/
    );
    expect(task('T062c').text).toMatch(
      /recording `resumed_from` \(the previous `epoch` and the takeover time\)/
    );
    expect(read('research.md')).toMatch(/All three logs are JSON Lines/);
    expect(task('T071').text).not.toMatch(/linear-changes\.jsonl/);
    expect(task('T071').text).toMatch(/are not written to the run logs/);
    expect(plan).toMatch(/\*\*Status \(2026-10-03\)\*\*/);
    expect(plan).toMatch(/#3725 \(#3730\) merged on 2026-10-02/);
    expect(plan).toMatch(/#3732 \(#3731\) merged on 2026-10-03/);
    expect(plan).not.toMatch(/^- #3725 \(#3730\)/m);
    expect(plan).not.toMatch(/^- #3732 \(#3731\)/m);
    expect(plan).not.toMatch(/not yet merged\)\*\*/);
    expect(plan).not.toMatch(/It waits for #3732 to merge/);
    expect(plan).toMatch(/v1\.4\.0 is the active authority/);
    expect(task('T076').text).toMatch(/#3732 has merged/);
    expect(task('T079').text).toMatch(
      /After #3703 and #3704 merge \(#3725 and #3732 have merged\)/
    );
    const tree = section(plan, '### Audit Output (repository root: `.github/`)');
    expect(tree).toMatch(/│ {11}├── evidence\//);
    expect(tree).toMatch(/│ {11}│ {3}└── dry-run\/\{repo\}\.json/);
    expect(tree).toMatch(/│ {11}└── change-requests\//);
    expect(tree.match(/^│ {11}└── /gm)).toHaveLength(1);
  });

  test('completes the approver-handle migration T078 claims', () => {
    expect(task('T078').done).toBe(true);
    const gate = fs.readFileSync(
      path.resolve(
        specRoot,
        '../../reports/audits/2026-09-14-label-audit/change-requests/label-deletion-gate.md'
      ),
      'utf8'
    );
    const walk = (dir) =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(full) : entry.name.endsWith('.md') ? [full] : [];
      });
    // tasks.md is excluded on purpose: T050 keeps `@ashley` for T079 and T078 quotes it.
    const files = walk(specRoot).filter((file) => path.basename(file) !== 'tasks.md');
    for (const [name, text] of [
      ['label-deletion-gate.md', gate],
      ...files.map((f) => [path.relative(specRoot, f), fs.readFileSync(f, 'utf8')]),
    ]) {
      const stray = [...text.matchAll(/@ashley(?!shaw)\b/g)];
      expect({ name, stray: stray.length }).toEqual({ name, stray: 0 });
    }
    expect(task('T078').text).toMatch(/last handle in the gate draft/);
  });

  test('keeps status claims true: T075 follows #3734, Stage 0a is not called fully approved, migrate_to is explained', () => {
    const spec = read('spec.md');
    const t075 = task('T075');
    // T075 may be checked only once its text no longer says the PR is open.
    expect(t075.done).toBe(!/still open/.test(t075.text));
    expect(t075.text).toMatch(/#3734/);
    // T080 follows the same rule: it stays open while #3734 is open and says what it does not check.
    const t080 = task('T080');
    expect(t080.done).toBe(!/still open/.test(t080.text));
    expect(t080.text).toMatch(
      /does not compare which locked files that request covers, which T084 adds/
    );
    expect(task('T084').text).toMatch(/`covers` list/);
    expect(task('T081').text).toMatch(/#3732 has merged/);
    // FR-009 must not present the unmerged guard as enforcing anything yet.
    expect(spec).toMatch(
      /it is pending implementation: T080's guard is in open PR #3734, T080a must make it a required check on `develop` and `main`, and T084 must add the `covers` validation/
    );
    expect(spec).toMatch(
      /readers must not rely on it\. Once active, a PR that changes one fails until/
    );
    expect(spec).not.toMatch(/A required check enforces this for every locked file/);
    expect(task('T041').text).toMatch(/does not run before that/);
    expect(read('plan.md')).toMatch(/#3557 is pending until T040n's dated sign-off/);
    expect(read('plan.md')).not.toMatch(/approved via #3530, #3556 and #3557/);
    expect(spec).toMatch(/#3557 is pending until the dated sign-off in T040n/);
    expect(spec).toMatch(/does not bar the per-repository `migrate_to` target/);
    expect(rules).toMatch(/`migrate_to` is the approved label its name points to/);
    expect(contract).toMatch(/`convert` \(an issue converted to a Discussion\)/);
    expect(section(model, '### 14. Consolidation Log Entry')).toMatch(
      /`convert` \(an issue converted/
    );
    expect(task('T063').text).toMatch(
      /Record every conversion and fallback relabel through `label-consolidate.js record`/
    );
    expect(task('T062b').text).toMatch(/`record` subcommand/);
    expect(dependencies('T063')).toEqual(['T059', 'T062b']);
    expect(read('plan.md')).toMatch(/recorded through `label-consolidate.js record`/);
  });

  test('scopes the completion marker to a stage so Stage 3 never hides a repository from Stage 4', () => {
    const resume = rules.split('\n').find((line) => line.startsWith('7. '));
    expect(resume).toMatch(/`executed_at\.3`.*`executed_at\.4`/);
    expect(resume).toMatch(
      /set for the stage it is running.*never hides a repository from Stage 4/
    );
    expect(resume).toMatch(/\(T065\).*`executed_at\.4` to be null/);
    expect(read('contracts/dry-run-and-drift-report-schema.md')).toMatch(
      /"executed_at": \{ "3": null, "4": null \}/
    );
    expect(task('T062b').text).toMatch(/`executed_at` set for the stage being run/);
    expect(task('T062c').text).toMatch(/finished for Stage 3 is still processed by Stage 4/);
    expect(task('T064').text).toMatch(/`executed_at` for Stage 3 set per repository/);
    expect(task('T065').text).toMatch(/requires the Stage 4 `executed_at` to be null/);
    expect(task('T067').text).toMatch(/sets the Stage 4 `executed_at`/);
    expect(read('quickstart.md')).toMatch(/Stage 4 still processes it/);
  });

  test('makes a crashed run resumable with an advisory lock and a fencing epoch', () => {
    const lock = section(model, '### 16. Run Lock');
    expect(lock).toMatch(/\| `epoch` \| integer \|/);
    expect(lock).toMatch(/operating-system advisory lock \(`flock`\)/);
    expect(lock).toMatch(
      /`--resume <run_id>` takes the advisory lock, keeps the `run_id`, raises `epoch` by one/
    );
    expect(lock).toMatch(/fails while the original process still holds the advisory lock/);
    expect(lock).toMatch(/abandoned \(`--abandon-run <run_id>`\) only after @ashleyshaw confirms/);
    expect(model).toMatch(/held → stale \(process died\) → held with epoch \+ 1/);
    expect(task('T062b').text).toMatch(/`--resume <run_id>`.*`--abandon-run <run_id>`/);
    expect(task('T062b').text).toMatch(
      /delete `run-lock\.json` when the run, or a run resumed with `--resume <run_id>`, finishes successfully \(an interrupted run keeps the file so it can be resumed again\)/
    );
    expect(task('T062b').text).toMatch(
      /refuse any append when the lock's `epoch` is not the run's own/
    );
    expect(task('T062c').text).toMatch(
      /killed mid-write.*`--resume <run_id>`.*adopting the same `run_id`/
    );
    expect(task('T062c').text).toMatch(/holder with a stale `epoch` cannot append/);
    expect(read('spec.md')).toMatch(/`--resume <run_id>`.*raises the `epoch` by one/);
    expect(read('quickstart.md')).toMatch(
      /`--resume` fails while the first process is still alive/
    );
  });

  test('requires completed repositories and matching state to produce no writes or log records', () => {
    const resume = rules.split('\n').find((line) => line.startsWith('7. '));
    expect(resume).toMatch(/finishes.*sets `executed_at`/);
    expect(resume).toMatch(/skips any repository with `executed_at` set/);
    expect(resume).toMatch(/no API write.*current state already matches the approved set/);
    expect(section(model, '### 14. Consolidation Log Entry')).toMatch(
      /re-run that makes no write adds no record/
    );
    expect(task('T062c').text).toMatch(
      /failed API call writes no `done` record and leaves its `intended` record/
    );
    expect(logs).toMatch(/are JSON Lines|JSON Lines in `evidence\/`/);
    expect(logs).toMatch(
      /`intended` record before the API call and a `done` record after it succeeds/
    );
    expect(read('quickstart.md')).toMatch(
      /no API write and adds no record to `evidence\/consolidation-log.jsonl`/
    );
  });

  test('keeps the rate-limit, case-variant and rollback safeguards explicit', () => {
    for (const text of [logs, task('T062a').text]) {
      expect(text).toMatch(/one at a time.*at least one second apart/);
      expect(text).toContain('Retry-After');
      expect(text).toContain('x-ratelimit-reset');
      expect(text).toContain("Linear's complexity limits");
    }
    expect(research).toMatch(/case or spacing.*separate sources.*never merged automatically/);
    expect(task('T062b').text).toMatch(/case-only change as an in-place rename/);
    expect(logs).toMatch(/dry-run snapshot plus its `delete` records/);
    expect(logs).toMatch(/reapplying `old_label` and restoring the retired label/);
    expect(task('T040c').text).toMatch(/step fails.*stop.*last completed step.*resume/);
  });

  test('quickstart checks both audit logs and the per-run gate summary', () => {
    const quickstart = read('quickstart.md');
    expect(quickstart).toMatch(
      /consolidation-log\.jsonl` has a `done` record for every change.*no `intended` record without a matching `done` record.*summary comment/
    );
    expect(quickstart).toMatch(
      /linear-writes\.jsonl` has a `done` record for every relabelled Linear issue.*ID and scope.*no unmatched `intended` record/
    );
  });
});
