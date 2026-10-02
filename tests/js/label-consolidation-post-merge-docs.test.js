const fs = require('fs');
const path = require('path');

const specRoot = path.resolve(__dirname, '../../.github/specs/008-label-audit-consolidation');
const read = (file) => fs.readFileSync(path.join(specRoot, file), 'utf8');

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

    expect(taskRows).toHaveLength(110);
    expect(new Set(taskRows.map(({ id }) => id)).size).toBe(taskRows.length);
    expect(taskRows.filter(({ done }) => done)).toHaveLength(55);
    expect(phase8Count).toBe(66);
    expect(tasks).toContain(`**Total Tasks**: ${taskRows.length}`);
    expect(tasks).toContain(`All ${taskRows.length} tasks in phases 1-9`);
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
    for (const id of ['T040c', 'T040n', 'T046c', 'T055']) {
      expect(task(id).done).toBe(false);
    }
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
    ['T069a', ['T042', 'T062a']],
    ['T069', ['T067', 'T064c', 'T069a']],
    ['T070', ['T067', 'T069a']],
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
    expect(task('T067a').text).toMatch(/T064 pre-run snapshot has exactly one/);
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
      'consolidation-log.json',
      '### `consolidation-log.json` (GitHub, Stages 3 and 4)',
      '### 14. Consolidation Log Entry',
    ],
    [
      'linear-writes.json',
      '### `linear-writes.json` (Linear, Stage 5)',
      '### 15. Linear Write Log Entry',
    ],
  ])(
    '%s example contains exactly the fields declared in its data model',
    (file, heading, modelHeading) => {
      const example = section(contract, heading).match(/```json\n([\s\S]*?)\n```/);
      expect(example).not.toBeNull();
      const entries = JSON.parse(example[1]);
      const fields = [...section(model, modelHeading).matchAll(/^\| (`[^|]+) \|/gm)].flatMap(
        ([, cell]) => [...cell.matchAll(/`([^`]+)`/g)].map(([, field]) => field)
      );

      expect(Array.isArray(entries)).toBe(true);
      expect(entries).toHaveLength(1);
      expect(fields.length).toBeGreaterThan(0);
      expect(Object.keys(entries[0]).sort()).toEqual(fields.sort());
      expect(entries[0].at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
      expect(Number.isNaN(Date.parse(entries[0].at))).toBe(false);
      expect(research).toContain(`evidence/${file}`);
    }
  );

  test('the deletion example preserves the dry-run label snapshot and uses a null after state', () => {
    const [dryRun, log] = [...contract.matchAll(/```json\n([\s\S]*?)\n```/g)].map(([, json]) =>
      JSON.parse(json)
    );
    const [entry] = log;
    const { name, color, description } = dryRun.to_delete.find(({ name }) => name === entry.label);

    expect(entry.action).toBe('delete');
    expect(entry.repository).toBe(dryRun.repository);
    expect(entry.before).toEqual({ name, color, description });
    expect(entry.after).toBeNull();
    expect(Number.isInteger(entry.gate_issue)).toBe(true);
  });

  test('the Linear example identifies both sides of its mapping by ID and scope', () => {
    const example = section(contract, '### `linear-writes.json` (Linear, Stage 5)');
    const [entry] = JSON.parse(example.match(/```json\n([\s\S]*?)\n```/)[1]);
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
    expect(task('T065a').text).toMatch(
      /approved_set_commit.*stale.*skip.*new dry run and approval/
    );
    expect(model).toMatch(/approved → stale .*→ regenerated → approved again/);
  });

  test('requires completed repositories and matching state to produce no writes or log records', () => {
    const resume = rules.split('\n').find((line) => line.startsWith('7. '));
    expect(resume).toMatch(/finishes.*sets `executed_at`/);
    expect(resume).toMatch(/skips any repository with `executed_at` set/);
    expect(resume).toMatch(/no API write.*current state already matches the approved set/);
    expect(section(model, '### 14. Consolidation Log Entry')).toMatch(
      /re-run that makes no write adds no record/
    );
    expect(task('T062c').text).toMatch(/failed API call writes no log record/);
    expect(logs).toMatch(/append-only JSON arrays/);
    expect(logs).toMatch(
      /`intended` record before the API call and a `done` record after it succeeds/
    );
    expect(read('quickstart.md')).toMatch(
      /no API write and adds no record to `evidence\/consolidation-log.json`/
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
      /consolidation-log\.json` has a `done` record for every change.*no `intended` record without a matching `done` record.*summary comment/
    );
    expect(quickstart).toMatch(
      /linear-writes\.json` has a `done` record for every relabelled Linear issue.*ID and scope.*no unmatched `intended` record/
    );
  });
});
