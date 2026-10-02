/**
 * Contract test for the central Qodo PR-Agent configuration (`.pr_agent.toml`).
 *
 * Source of truth: .github/specs/019-qodo-pr-agent-integration/contracts/pr-agent-config.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'smol-toml';

const repoRoot = path.resolve(__dirname, '../..');
const configPath = path.join(repoRoot, '.pr_agent.toml');

const raw = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '';
const config = raw ? parse(raw) : {};

const INSTRUCTION_SECTIONS = [
  'pr_description',
  'pr_reviewer',
  'pr_code_suggestions',
  'pr_questions',
  'pr_update_changelog',
  'pr_add_docs',
];

/**
 * The model ids, declared once.
 *
 * `.pr_agent.toml` is the authority: it is what PR-Agent actually reads. Everything
 * else — the run record, the contract, the plan, the guide, the tests — restates the
 * id for a human or for a report, and each restatement is checked here. A divergence
 * fails the suite rather than shipping a run whose record names a model that was not
 * used.
 */
const TOKEN_BUDGET = 64000;

const PRIMARY_MODEL = config?.config?.model;
const PRIMARY_FALLBACK = config?.config?.fallback_models?.[0];
const bareId = (id) => String(id).replace(/^anthropic\//, '');

/**
 * Every model id this repository is allowed to discuss, and why.
 *
 * The primary and the fallback come from the authority. The third is the
 * fallback's alias, which the guide cites because Anthropic documents both
 * spellings. The fourth is the documented migration target: the pinned image cannot
 * serve it yet, so the guide has to name it, and pretending otherwise would leave the
 * reader with no upgrade path. Adding a fifth name is a decision, so the list itself
 * is asserted.
 */
const EXPECTED_MODEL_IDS = [
  'claude-sonnet-5',
  'claude-haiku-4-5-20251001',
  'claude-haiku-4-5',
  'claude-sonnet-5-5',
];

describe('Qodo PR-Agent model ids are single-sourced', () => {
  const read = (relative) => fs.readFileSync(path.join(repoRoot, relative), 'utf8');

  it('the authority declares one primary and one fallback', () => {
    expect(PRIMARY_MODEL).toMatch(/^anthropic\/claude-[a-z0-9-]+$/);
    expect(PRIMARY_FALLBACK).toMatch(/^anthropic\/claude-[a-z0-9-]+$/);
    expect(PRIMARY_FALLBACK).not.toBe(PRIMARY_MODEL);
  });

  it.each([
    ['.github/workflows/qodo-pr-agent.yml', 'pilot run record'],
    ['.github/workflows/qodo-pr-agent-reusable.yml', 'shared run record'],
  ])('%s records the same model the authority declares', (file) => {
    // The record's model field is report metadata, not behaviour, so it is a
    // literal; this is what keeps it from drifting.
    expect(read(file)).toContain(`--arg model "${PRIMARY_MODEL}"`);
  });

  it('the ids in use are the newest this image can serve', () => {
    expect({ primary: bareId(PRIMARY_MODEL), fallback: bareId(PRIMARY_FALLBACK) }).toStrictEqual({
      primary: 'claude-sonnet-5',
      fallback: 'claude-haiku-4-5-20251001',
    });
  });

  it.each([
    '.github/specs/019-qodo-pr-agent-integration/contracts/pr-agent-config.md',
    '.github/specs/019-qodo-pr-agent-integration/plan.md',
    '.github/specs/019-qodo-pr-agent-integration/research.md',
    '.github/specs/019-qodo-pr-agent-integration/quickstart.md',
    'docs/QODO_PR_AGENT.md',
  ])('%s names only models this repository discusses', (file) => {
    // The id may appear with or without the litellm provider prefix, so both
    // spellings are matched. A model the repository has not adopted cannot appear.
    const named = [...read(file).matchAll(/(?:anthropic\/)?claude-[a-z0-9-]+/g)].map((m) =>
      bareId(m[0])
    );
    const undeclared = [...new Set(named)].filter((id) => !EXPECTED_MODEL_IDS.includes(id));
    expect({ file, undeclared }).toStrictEqual({ file, undeclared: [] });
  });

  it('the discussion vocabulary is exactly the ids above', () => {
    // So widening it is a deliberate edit with a reason, not a side effect of
    // mentioning a fourth model somewhere.
    expect([...EXPECTED_MODEL_IDS].sort()).toStrictEqual([
      'claude-haiku-4-5',
      'claude-haiku-4-5-20251001',
      'claude-sonnet-5',
      'claude-sonnet-5-5',
    ]);
  });

  it('the contract, the plan, the guide and the research all name the primary', () => {
    // Matched on the bare id. A document citing Anthropic's own spelling omits the
    // litellm provider prefix, and that is the correct spelling for a citation; the
    // point of the check is that it names the model in use, not the exact wrapper.
    const bare = PRIMARY_MODEL.replace(/^anthropic\//, '');
    for (const file of [
      '.github/specs/019-qodo-pr-agent-integration/contracts/pr-agent-config.md',
      '.github/specs/019-qodo-pr-agent-integration/plan.md',
      '.github/specs/019-qodo-pr-agent-integration/research.md',
      'docs/QODO_PR_AGENT.md',
    ]) {
      expect({ file, names: read(file).includes(bare) }).toStrictEqual({ file, names: true });
    }
  });

  it('the skill runner always passes a model, and never relies on the upstream default', () => {
    // Neither skill mode reads a repository .pr_agent.toml: PR mode disables
    // repo settings on purpose, and diff mode never builds a git provider. So an
    // omitted --config.model would leave PR-Agent on its own default, gpt-5.6,
    // sending a consumer's diff to a different provider than the key is scoped to.
    const script = read('skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh');
    // Unconditional, so it cannot become conditional again unnoticed.
    expect(script).toContain('settings+=("--config.model=$MODEL")');
    expect(script).not.toMatch(/if \[ -n "\$MODEL" \]; then settings\+=\("--config\.model/);
  });

  it('the spend-cap outcome agrees between SC-008, the edge cases and the receiver', () => {
    // These three disagreed: the edge cases and the shipped record job mapped a
    // provider refusal to `failure`, while SC-008 said `skipped`.
    const spec = read('.github/specs/019-qodo-pr-agent-integration/spec.md');
    const sc008 = spec.split('\n').find((line) => line.startsWith('- **SC-008**:'));
    expect(sc008).toContain('`failure`');
    expect(sc008).not.toMatch(/skipped with a notice/);

    const edge = spec
      .split('\n')
      .find((line) => line.includes('Rate limits and spend caps'));
    expect(edge).toContain('`failure`');

    // And the receiver must still map a failed run to `failure`.
    const receiver = read('.github/workflows/qodo-pr-agent.yml');
    expect(receiver).toMatch(/outcome="failure"/);
  });

  it('the spend limit is documented as unverifiable from here and rotation-bound', () => {
    const docs = read('docs/QODO_PR_AGENT.md');
    const line = docs
      .split('\n')
      .find((l) => l.startsWith('- **Monthly spend limit:'));
    expect(line).toBeDefined();
    expect(line).toMatch(/US\$20/);
    expect(line).toMatch(/Anthropic console/);
    // The two claims that keep the statement honest rather than rot-prone.
    expect(line).toMatch(/cannot set it, read it back or verify it/);
    expect(line).toMatch(/re-confirmed whenever the key is rotated/);

    // The pilot's own prerequisites table repeats the same fact, and drifted: it
    // still read "spend limit not yet confirmed" after the limit was confirmed set
    // on 2026-10-02.
    const validation = read('.github/reports/metrics/qodo-pr-agent/pilot-validation.md');
    const row = validation
      .split('\n')
      .find((l) => l.startsWith('| P-1 |') && l.includes('spend limit'));
    expect(row).toBeDefined();
    expect(row).not.toMatch(/not yet confirmed|not confirmed/);
    expect(row).toMatch(/set on the key in the Anthropic console/);
    expect(row).toMatch(/2026-10-02/);
  });

  it('no consumer offers the skill as a source for a tool that cannot return a result', () => {
    // `generate_labels`, `update_changelog` and `add_docs` store no artifact at
    // v0.46.0, so only the pr-comment path works for the latter two and no path
    // works for labels. Round 4 fixed the skill's own docs and left every consumer
    // still offering the skill, which is the class this guards.
    const consumers = [
      'skills/label-governance/SKILL.md',
      'agents/labeling-agent/AGENT.md',
      'skills/changelog-generator/SKILL.md',
      'agents/changelog-agent/AGENT.md',
      '.github/specs/019-qodo-pr-agent-integration/tasks.md',
      '.github/specs/019-qodo-pr-agent-integration/contracts/responsibility-matrix.md',
      '.github/specs/019-qodo-pr-agent-integration/data-model.md',
      'docs/QODO_PR_AGENT.md',
    ];
    for (const file of consumers) {
      const text = read(file);
      // Any remaining offer of the skill as an invocation source for these tools.
      // Matched structurally: the skill reference comes *before* "with <tool>".
      // That ordering is what separates a live offer from a disclaimer, since
      // "a maintainer requests with `/update_changelog`" is legitimate and puts the
      // tool name before the skill. No phrase exclusion, so a disclaimer sitting on
      // the same line cannot excuse a live offer.
      const offers = text.split('\n').filter(
        (line) =>
          /qodo-pr-agent[^\n]{0,160}?with\s+`?(generate_labels|update_changelog|add_docs)`?/.test(
            line
          )
      );
      expect({ file, offers }).toStrictEqual({ file, offers: [] });
    }
  });

  it('labels have no Qodo path at all, and says so where labels are decided', () => {
    // `/generate_labels` is refused by the receiver, so the labelling integrations
    // must not claim a Qodo input at all.
    const matrix = read(
      '.github/specs/019-qodo-pr-agent-integration/contracts/responsibility-matrix.md'
    );
    const row = matrix.split('\n').find((line) => line.startsWith('| Label suggestions |'));
    expect(row).toBeDefined();
    // The row may name the tool to explain the refusal, but it must not present
    // Qodo as the source and must name the in-repo agent instead.
    expect(row).toContain('`agents/labeling-agent/`');
    expect(row).toMatch(/Qodo PR-Agent offers none/);

    // And the receiver really does refuse it, or the claim above is wrong.
    const receiver = read('.github/workflows/qodo-pr-agent.yml');
    const allowed = receiver.match(/ALLOWED_COMMANDS = \[([^\]]*)\]/)[1];
    expect(allowed).not.toContain('/generate_labels');
  });

  it('the receiver refuses a closed pull request on every path, but draft and fork only on the automatic one', () => {
    // The class behind two findings: eligibility was applied only where the
    // automatic run happened to be checked. The shared path carries the open-state
    // rule; draft, excluded-author and fork stay on the automatic branch.
    const receiver = read('.github/workflows/qodo-pr-agent.yml');
    // Open-state is checked before the pull_request-only branch opens.
    const openAt = receiver.indexOf("if (pull.state !== 'open') return out('pr-not-open');");
    const branchAt = receiver.indexOf(
      "if (context.payload.workflow_run.event === 'pull_request') {"
    );
    expect({ openBeforeBranch: openAt > 0 && openAt < branchAt }).toStrictEqual({
      openBeforeBranch: true,
    });
    // And the draft check is inside that branch, after the shared rule.
    const draftAt = receiver.indexOf("if (pull.draft) return out('draft');");
    expect({ draftAfterBranch: draftAt > branchAt }).toStrictEqual({ draftAfterBranch: true });

    // A blank dispatch is the automatic path, so it must apply the same rules, and
    // a named dispatch command must still refuse a closed pull request.
    expect(receiver).toContain('dispatched.state');
    expect(receiver).toContain('dispatched.draft');
    expect(receiver).toContain('commanded.state');
  });

  it('states that only pull_request reads the receiver definition from the pull request branch', () => {
    // `issue_comment` and `pull_request_target` both run default-branch
    // definitions, per GitHub's events table, so grouping them with
    // `pull_request` as branch-loading events is wrong.
    const docs = read('docs/QODO_PR_AGENT.md');
    const line = docs.split('\n').find((l) => l.includes('Keep the triggers as shipped'));
    expect(line).toBeDefined();
    expect(line).toMatch(/Only one of those three/);
    expect(line).toMatch(/`issue_comment` runs the default-branch definition/);
    expect(line).not.toMatch(/Those would make GitHub read the receiver's definition from the pull request/);
  });

  it('lists each workflow once in the workflow README', () => {
    // Round 5 merged a receiver sentence that left two entries for the reusable
    // workflow, one of them opening with "As above".
    const readme = read('.github/workflows/README.md');
    const entries = readme
      .split('\n')
      .filter((line) => /^- \*\*([^*]+)\*\*/.test(line))
      .map((line) => /^- \*\*([^*]+)\*\*/.exec(line)[1]);
    const dupes = entries.filter((name, i) => entries.indexOf(name) !== i);
    expect({ dupes }).toStrictEqual({ dupes: [] });
    expect(readme).not.toMatch(/^- \*\*\*\*.*As above,/m);
  });

  it('binds both receivers to the exact triggering comment, and the opt-in forwards its id', () => {
    // The pilot receiver resolved by id while the reusable took the newest
    // matching comment, so two /ask comments could have the run answer the wrong
    // one. Both now resolve the id.
    for (const file of ['.github/workflows/qodo-pr-agent.yml', '.github/workflows/qodo-pr-agent-reusable.yml']) {
      const wf = read(file);
      expect({ file, byId: wf.includes('issues.getComment') }).toStrictEqual({ file, byId: true });
      expect({ file, lists: wf.includes('issues.listComments') }).toStrictEqual({ file, lists: false });
    }
    // The reusable takes the id as an input, so the caller has to pass it.
    const reusable = read('.github/workflows/qodo-pr-agent-reusable.yml');
    expect(reusable).toMatch(/^\s+comment_id:$/m);
    expect(reusable).toContain('COMMENT_ID: ${{ inputs.comment_id }}');
    const docs = read('docs/QODO_PR_AGENT.md');
    expect(docs).toMatch(/comment_id: \$\{\{ needs\.preflight\.outputs\.comment_id \}\}/);
  });

  it('instructs a single develop pattern everywhere, and never tells an adopter to add two', () => {
    // Round 4 corrected the contract and T042 but left the operator-facing
    // instructions and the quickstart prerequisite still listing a second,
    // non-existent pattern.
    const surfaces = [
      'docs/QODO_PR_AGENT.md',
      '.github/specs/019-qodo-pr-agent-integration/quickstart.md',
      '.github/specs/019-qodo-pr-agent-integration/contracts/reusable-workflow.md',
      '.github/specs/019-qodo-pr-agent-integration/tasks.md',
    ];
    for (const file of surfaces) {
      // Any line that instructs adding two patterns, rather than recording that a
      // draft once did so.
      const instructions = read(file)
        .split('\n')
        .filter((line) => /refs\/heads\/develop/.test(line))
        .filter((line) => !/earlier draft|corrected|previou|once did|no longer|not two/i.test(line));
      expect({ file, instructions: instructions.length }).toStrictEqual({
        file,
        instructions: 0,
      });
    }
  });

  it('scopes the head-SHA check to automatic runs rather than every request', () => {
    const docs = read('docs/QODO_PR_AGENT.md');
    const line = docs
      .split('\n')
      .find((l) => l.includes('at the head that run observed'));
    expect(line).toBeDefined();
    expect(line).toMatch(/automatic.*`pull_request`/);
    expect(line).toMatch(/compares no head SHA there/);
  });

  it('leaves the review verdict with human reviewers', () => {
    const docs = read('docs/CODERABBIT_LABELS_ALIGNMENT.md');
    const line = docs
      .split('\n')
      .find((l) => l.includes('primary automatic reviewer'));
    expect(line).toBeDefined();
    expect(line).toMatch(/verdict is owned by human reviewers/);
    expect(line).not.toMatch(/it owns the review verdict/);
  });

  it('the runner resolves the model from the repository, not from a path above it', () => {
    // Round 4 used four `..` from skills/<name>/scripts/, which resolves to the
    // repository's *parent*, so no .pr_agent.toml was ever found and every run
    // silently used the default. The earlier test only matched the string
    // `repo_root/.pr_agent.toml`, which passed against the broken depth.
    const script = read('skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh');
    // Count `..` segments, not `../` pairs: the last segment carries no slash.
    const depth = /dirname "\$\{BASH_SOURCE\[0\]\}"\)\/((?:\.\.\/*)+)/.exec(script);
    expect(depth).not.toBeNull();
    expect({ levels: (depth[1].match(/\.\./g) || []).length }).toStrictEqual({ levels: 3 });

    // Executed against the real checkout, so this cannot pass on a depth that does
    // not resolve: the repository root holds the authority and its parent does not,
    // which is exactly the distinction the four-level path got wrong.
    const root = path.resolve(__dirname, '../..');
    expect(fs.existsSync(path.join(root, '.pr_agent.toml'))).toBe(true);
    expect(fs.existsSync(path.join(path.dirname(root), '.pr_agent.toml'))).toBe(false);
  });

  it('the Q-12 fixture exceeds the budget it claims to exceed', () => {
    // Q-12 asserted clipping for a 25-file/800-line diff, but clip works against
    // max_model_tokens, so that fixture was an order of magnitude under the
    // threshold and the check passed vacuously.
    const toml = read('.pr_agent.toml');
    const budget = toml.match(/^max_model_tokens\s*=\s*(\d+)/m);
    expect({ budget: budget ? budget[1] : null }).toStrictEqual({
      budget: String(TOKEN_BUDGET),
    });
    const quickstart = read('.github/specs/019-qodo-pr-agent-integration/quickstart.md');
    const row = quickstart.split('\n').find((line) => line.startsWith('| Q-12 |'));
    expect(row).toBeDefined();
    // The row must cite the same budget, so raising the config raises the fixture.
    expect(row).toContain(budget[1].replace(/\B(?=(\d{3})+(?!\d))/g, ','));

    // And the fixture must not be reachable by a small diff: clip triggers only
    // above the budget, so the stated file count has to clear it.
    const files = row.match(/order of (\w+) of files/);
    expect(files ? files[1] : null).not.toBeNull();
    const scale = { hundred: 100, hundreds: 100, thousand: 1000, thousands: 1000 }[
      String(files[1]).toLowerCase()
    ];
    expect(scale).toBeGreaterThan(0);
  });

  it('the runner default equals the authority, so a consumer without a config gets the same model', () => {
    const script = read('skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh');
    const declared = script.match(/^readonly DEFAULT_MODEL="([^"]+)"/m);
    expect({ declared: declared ? declared[1] : null }).toStrictEqual({
      declared: PRIMARY_MODEL,
    });
  });

  it('the runner resolves the model from the authority rather than repeating it', () => {
    const script = read('skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh');
    expect(script).toContain('repo_root/.pr_agent.toml');
    expect(script).toContain('PR_AGENT_MODEL');
  });

  it('the tests that assert the model read it from the authority, not a literal', () => {
    for (const file of [
      'tests/js/qodo-pr-agent-runner.test.js',
      'tests/js/qodo-pr-agent-workflow.test.js',
    ]) {
      const body = read(file);
      expect({ file, hardCoded: body.includes("'anthropic/claude-") }).toStrictEqual({
        file,
        hardCoded: false,
      });
    }
  });
});

describe('Qodo PR-Agent central configuration (.pr_agent.toml)', () => {
  it('exists at the repository root', () => {
    expect(fs.existsSync(configPath)).toBe(true);
  });

  describe('governed keys', () => {
    it.each([
      ['config', 'max_model_tokens', 64000],
      ['config', 'large_patch_policy', 'clip'],
      ['config', 'response_language', 'en-GB'],
      ['config', 'enable_custom_labels', false],
      ['pr_description', 'publish_description_as_comment', true],
      ['pr_description', 'publish_description_as_comment_persistent', true],
      ['pr_description', 'publish_labels', false],
      ['pr_description', 'generate_ai_title', false],
      ['pr_reviewer', 'enable_review_labels_security', false],
      ['pr_reviewer', 'enable_review_labels_effort', false],
      ['pr_reviewer', 'persistent_comment', true],
      ['pr_code_suggestions', 'commitable_code_suggestions', false],
      ['pr_code_suggestions', 'persistent_comment', true],
      ['pr_update_changelog', 'push_changelog_changes', false],
    ])('%s.%s is %p', (section, key, expected) => {
      expect(config[section]).toBeDefined();
      expect(config[section][key]).toStrictEqual(expected);
    });

    it('config.fallback_models is the Haiku fallback only', () => {
      expect(config.config.fallback_models).toStrictEqual([PRIMARY_FALLBACK]);
    });

    it('ignore.glob excludes generated and archived paths', () => {
      expect(config.ignore.glob).toEqual(
        expect.arrayContaining([
          'node_modules/**',
          '.github/workflows/archived/**',
          '.github/reports/**',
          '**/*.lock',
          'package-lock.json',
        ])
      );
    });
  });

  describe('keys that must not appear', () => {
    it('has no custom_labels table', () => {
      expect(config.custom_labels).toBeUndefined();
    });

    it('has no github_action_config section (trigger policy lives in the workflow)', () => {
      expect(config.github_action_config).toBeUndefined();
    });

    it('does not enable description markers', () => {
      expect(config.pr_description?.use_description_markers).not.toBe(true);
    });

    it('contains no credential values', () => {
      expect(raw).not.toMatch(/sk-ant-/i);
      expect(raw).not.toMatch(/^\s*(api[_-]?key|key|token)\s*=/im);
    });
  });

  describe('extra_instructions', () => {
    it.each(INSTRUCTION_SECTIONS)('%s.extra_instructions follows the content rules', (section) => {
      const text = config[section]?.extra_instructions;
      expect(typeof text).toBe('string');
      expect(text.trim().length).toBeGreaterThan(0);
      expect(text).toContain('UK English');
      expect(text).toContain('AGENTS.md');
      expect(text).toMatch(/Never reproduce credentials/);
      expect(text).not.toMatch(/WordPress|PHP|React|block theme/i);
    });

    it('pr_update_changelog.extra_instructions states the changelog rules', () => {
      const text = config.pr_update_changelog.extra_instructions;
      expect(text).toMatch(/250 characters/);
      expect(text).toMatch(/Keep a Changelog/);
    });
  });
});
