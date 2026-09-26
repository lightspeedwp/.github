# Tasks: Qodo PR-Agent Installation & Agent/Skill Integration

**Input**: Design documents from `.github/specs/017-qodo-pr-agent-integration/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Included. Plan decision R12 and constitution Principle X require automated contract tests, which are Jest tests in `tests/js/`. Write each test before its implementation and confirm it fails first.

**Organisation**: Tasks are grouped by user story (US1–US5 from spec.md), so each story can be implemented and validated on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (a different file, with no dependency on an incomplete task)
- **[Story]**: US1–US5; Setup, Foundational and Polish tasks carry no story label
- Paths are relative to the repository root

## Conventions every task must follow

- UK English; pin every action by full SHA or image digest with a version comment; set an explicit `permissions:` block; never use `actions/checkout` in Qodo PR-Agent workflows; pass untrusted event values only through `env:`.
- Use the name "Qodo PR-Agent" (`qodo-pr-agent` in file names). Never use a bare "pr-agent" for this tool, because `agents/pr-agent/` is a different, internal agent.
- Do not edit LOCKED files (`.github/labels.yml`, `.github/issue-types.yml`, `.github/ISSUE_TEMPLATE/*`, `.github/PULL_REQUEST_TEMPLATE/*`).
- Before each commit, run `npm run lint:md` on the changed Markdown and `npx jest <changed test files>`.

---

## Phase 1: Setup (shared prerequisites)

**Purpose**: resolve the external facts and access that every later task depends on.

- [ ] T001 Verify the provenance of the pinned Qodo PR-Agent image. The digest `sha256:65e5b196e38cecd7df8a71fe29942052e081a0c6645132c2ac874df60b1760c7` (`0.46.0-github_action`) is already resolved, pinned in the reusable workflow and the skill runner, and recorded in the "Pinned version" table of `docs/QODO_PR_AGENT.md`. Run `gh attestation verify "oci://index.docker.io/pragent/pr-agent@sha256:65e5b196e38cecd7df8a71fe29942052e081a0c6645132c2ac874df60b1760c7" --repo The-PR-Agent/pr-agent` from a machine with the `gh` CLI, and record the verification date in that table and in `.github/reports/metrics/qodo-pr-agent/pilot-validation.md`. If verification fails, don't go live: raise it on lightspeedwp/.github#3535.
- [X] T002 Open a GitHub issue on `lightspeedwp/.github` titled "Qodo PR-Agent pilot: provision model credential". Labels: `type:task`, `area:ci`, `priority:normal`, `status:needs-triage`. The body asks @ashley for quickstart prerequisites P-1 and P-2: a dedicated Anthropic API key with a monthly spend limit, stored as organisation secret `ANTHROPIC_API_KEY_QODO_PR_AGENT` with repository access set to "selected → lightspeedwp/.github". Link the issue in `docs/QODO_PR_AGENT.md`. This is a human dependency, and US1 can't be validated live until it's closed.

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: the central configuration that every story reads. This phase must finish before any user story starts.

- [X] T003 [P] Create `tests/js/qodo-pr-agent-config.test.js`. It parses the root `.pr_agent.toml` with `smol-toml` and asserts **every** row of [contracts/pr-agent-config.md](./contracts/pr-agent-config.md) with its exact value, including:
  - `config.response_language == "en-GB"` and `config.enable_custom_labels == false`
  - `pr_description.publish_description_as_comment == true`, `pr_description.publish_labels == false`, `pr_description.generate_ai_title == false`
  - `pr_reviewer.enable_review_labels_security == false`, `pr_reviewer.enable_review_labels_effort == false`
  - `pr_code_suggestions.commitable_code_suggestions == false`, `pr_update_changelog.push_changelog_changes == false`
  - `config.model == "anthropic/claude-sonnet-5"`, `config.fallback_models` deep-equals `["anthropic/claude-haiku-4-5-20251001"]`, `config.max_model_tokens == 64000`, `config.large_patch_policy == "clip"`
  - `ignore.glob` contains `node_modules/**`, `.github/workflows/archived/**`, `.github/reports/**`, `**/*.lock` and `package-lock.json`

  It also asserts the "must NOT appear" list: there is no `[custom_labels.*]` table, no `github_action_config` section, `pr_description.use_description_markers` is not `true`, and no value matches `/sk-ant-|api[_-]?key\s*=/i`. For each `extra_instructions` (describe, reviewer, code_suggestions, questions, update_changelog, add_docs), it asserts the value is non-empty, contains "UK English" and "AGENTS.md", and does not match `/WordPress|PHP|React|block theme/i`. For `pr_update_changelog.extra_instructions`, it asserts the value mentions "250 characters". Run it and confirm it fails because the file doesn't exist yet.
- [X] T004 Create the root `.pr_agent.toml` so that T003 passes. Start it with a comment header: its purpose (organisation-standard Qodo PR-Agent configuration), links to `docs/QODO_PR_AGENT.md` and this spec, and a note that Qodo PR-Agent reads it from the default branch, so changes apply only after merge. Mark each **locked** key from the config contract with a `# locked:` comment. Write the `extra_instructions` values:
  - Describe, review, improve, ask and add_docs: write in UK English; follow the organisation standards in AGENTS.md; stay technology-agnostic; be concise; never suggest editing `.github/labels.yml`, `.github/issue-types.yml` or the issue/PR templates (they are locked).
  - Update changelog: additionally, entries must be at most 250 characters, user-facing, contain no implementation detail, link the PR, and use Keep a Changelog categories (Added, Changed, Fixed, Removed).

  Then run `npx jest tests/js/qodo-pr-agent-config.test.js`, which should pass.

**Checkpoint**: the configuration exists and is under contract test.

---

## Phase 3: User Story 1 — Governed Qodo PR-Agent pilot on this repository (Priority: P1) 🎯 MVP

**Goal**: on this repository, non-draft human PRs automatically receive a Qodo PR-Agent description comment and improvement suggestions, and maintainers can run allow-listed commands. The runs are safe for forks and never block a PR.

**Independent Test**: quickstart scenarios Q-01, Q-02, Q-05, Q-06, Q-10 and Q-11 pass on a throw-away PR after merge to `develop`.

### Tests for User Story 1

- [X] T005 [P] [US1] Create `tests/js/qodo-pr-agent-workflow.test.js`. It parses `.github/workflows/qodo-pr-agent-reusable.yml` and `.github/workflows/qodo-pr-agent.yml` with the `yaml` package and asserts the "Acceptance checks" in [contracts/reusable-workflow.md](./contracts/reusable-workflow.md):
  - The reusable workflow has `on.workflow_call` with inputs `config_ref` (default `main`), `auto_describe` (default `true`), `auto_improve` (default `true`) and `excluded_authors` (default `["dependabot[bot]","lightspeed-docs-bot[bot]"]`), and an optional secret `model_credential`. There is no `auto_review` input.
  - The top-level `permissions` is `{contents: read}`. Job `preflight` has `permissions: {}` and `timeout-minutes: 2`. Job `run` has `needs: preflight`, `if` containing `needs.preflight.outputs.enabled == 'true'`, permissions exactly `{contents: read, pull-requests: write, issues: write}`, and `timeout-minutes: 15`.
  - No step anywhere `uses` a value starting `actions/checkout`. The Qodo PR-Agent step `uses` matches `/^docker:\/\/pragent\/pr-agent@sha256:[a-f0-9]{64}$/`.
  - The step env has `github_action_config.auto_review: "false"`, plus `ANTHROPIC.KEY`, `GITHUB_TOKEN`, `CONFIG.EXTRA_CONFIG_URL` (containing `raw.githubusercontent.com/lightspeedwp/.github/` and `inputs.config_ref`) and `github_action_config.pr_actions`.
  - The preflight script text contains `QODO_PR_AGENT_ENABLED`, `author_association`, `OWNER`, `MEMBER` and `COLLABORATOR`, and the seven allow-listed commands `/describe /improve /review /ask /update_changelog /add_docs /help`. It does not list `/generate_labels` or `/similar_issue` as allowed. It contains `::notice::`, and never contains `exit 1`.
  - Concurrency group starts `qodo-pr-agent-`, and `cancel-in-progress` is `false`.
  - The caller's `on.pull_request.types` deep-equals `[opened, reopened, ready_for_review]`, `on.issue_comment.types` is `[created]`, and there is no `synchronize`, `pull_request_target` or `push`. The caller has one job that `uses: ./.github/workflows/qodo-pr-agent-reusable.yml` and passes `secrets.model_credential: ${{ secrets.ANTHROPIC_API_KEY_QODO_PR_AGENT }}`.

  Run it and confirm it fails.

### Implementation for User Story 1

- [X] T006 [US1] Create `.github/workflows/qodo-pr-agent-reusable.yml` (`name: Qodo PR-Agent • Reusable`) per [contracts/reusable-workflow.md](./contracts/reusable-workflow.md). Open it with a header comment block: what it does, that the automatic review verdict belongs to CodeRabbit, no-checkout and fork safety, the kill-switch, and a link to `docs/QODO_PR_AGENT.md`.
  - **Job `preflight`**: a single `actions/github-script` step pinned to the repo's canonical SHA (`3a2844b7e9c422d3c10d287c895573f7108da1b3 # v9.0.0`). Its env carries `HAS_CREDENTIAL: ${{ secrets.model_credential != '' }}`, `KILL_SWITCH: ${{ vars.QODO_PR_AGENT_ENABLED }}` and `EXCLUDED_AUTHORS: ${{ inputs.excluded_authors }}`. It reads `context.payload` and sets outputs `enabled` and `reason`, with reason one of `kill-switch`, `no-credential`, `draft`, `bot-sender`, `excluded-author`, `not-a-pr`, `author-not-allowed`, `command-not-allowed` or `ok`. It emits `core.notice(\`Qodo PR-Agent skipped: ${reason}\`)` when disabled.
  - **Job `run`**: the Qodo PR-Agent step `uses: docker://pragent/pr-agent@sha256:<T001 digest> # 0.46.0-github_action`, with the env from the contract. After it, an `if: always()` step writes the run record JSON (fields `repository`, `pr`, `tool`, `trigger`, `outcome`, `duration_seconds`, `model`, `started_at`, `event_at`; `event_at` is when the triggering comment was posted, or the PR's `updated_at` for PR events, and feeds the SC-001 measure; `tool` is `auto` for PR events, otherwise the first word of the comment without `/`; `outcome` is one of `success`, `skipped:<reason>`, `failure`) to `$GITHUB_STEP_SUMMARY` and to `qodo-pr-agent-run.json`. Then comes `actions/upload-artifact` at the canonical SHA (`043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1`), with name `qodo-pr-agent-run-${{ github.run_id }}` and `retention-days: 30`.
  - Metrics collection is added in T028 (US5); leave a `# metrics: see T028` comment here.
- [X] T007 [US1] Create `.github/workflows/qodo-pr-agent.yml` (`name: Qodo PR-Agent • Pilot`). Triggers: `pull_request: types [opened, reopened, ready_for_review]` and `issue_comment: types [created]`. Top-level `permissions: contents: read`. One job, `qodo`, with `uses: ./.github/workflows/qodo-pr-agent-reusable.yml`, job permissions `contents: read, pull-requests: write, issues: write`, and `secrets: model_credential: ${{ secrets.ANTHROPIC_API_KEY_QODO_PR_AGENT }}`. It relies on the defaults for all inputs. Add a header comment saying this caller is the template other repositories copy. Then run `npx jest tests/js/qodo-pr-agent-workflow.test.js` (it should pass), `npm run validate:workflows`, `npm run lint:workflows` and `npx actionlint .github/workflows/qodo-pr-agent*.yml`.
- [X] T008 [US1] Write the core sections of `docs/QODO_PR_AGENT.md`:
  - **What it is**, including a callout that it is *not* the internal `agents/pr-agent/`
  - **What runs automatically**: describe as a comment, improve
  - **Commands**: a table of the seven allow-listed commands with one-line uses, maintainers only
  - **Not available**: `/generate_labels` and `/similar_issue`, with reasons linked to research R7/R8
  - **Safety**: no checkout, fork PRs skipped, never blocks merge, never commits or labels
  - **Upstream project**: `the-pr-agent/pr-agent`, formerly `qodo-ai/pr-agent`
  - **Recognising Qodo PR-Agent feedback**: a placeholder that T010 fills in
- [ ] T009 [US1] After T002 is closed and T004–T008 are merged to `develop`, run quickstart Q-01, Q-02, Q-03, Q-04, Q-05, Q-06, Q-08, Q-09, Q-10, Q-11 and Q-12 on branch `test/qodo-pr-agent-smoke`. Q-03 and Q-04 confirm that on-demand reviews apply no labels and that `/generate_labels` and `/similar_issue` are rejected (FR-008); Q-08 confirms changelog proposals arrive as comments and are never committed (FR-009); Q-12 covers the large-PR edge case. Q-13 is T039. Record pass or fail and evidence links in `.github/reports/metrics/qodo-pr-agent/pilot-validation.md`. For Q-09: if `extra_config_url` was **not** loaded, record it and open a follow-up issue for the R3 fallback (a consumer copy plus a parity test). Don't block US1 on it, because the local `.pr_agent.toml` still applies here.
- [ ] T010 [US1] From the Q-01 PR, copy the exact header or marker text Qodo PR-Agent puts on its description, suggestions and review comments into the "Recognising Qodo PR-Agent feedback" section of `docs/QODO_PR_AGENT.md`. Note that the author is `github-actions[bot]`, so the marker is what identifies the comment.

**Checkpoint**: the MVP is live and validated on this repository.

---

## Phase 4: User Story 2 — Clear division of labour with existing AI review (Priority: P1)

**Goal**: contributors can see which bot owns which concern, and the two bots produce no duplicated primary findings.

**Independent Test**: across five pilot PRs, every automatic Qodo PR-Agent output maps to one matrix row, and no concern is flagged as primary by both tools (spec US2).

- [X] T011 [P] [US2] Add a "Who does what" section to `docs/QODO_PR_AGENT.md` with the full review-concerns table from [contracts/responsibility-matrix.md](./contracts/responsibility-matrix.md). The contract file stays the source, so link it; don't paraphrase. Include "Talking to the bots": `@coderabbitai review` versus `/review`, and when to use each.
- [X] T012 [P] [US2] In `docs/CODERABBIT_LABELS_ALIGNMENT.md`, add a short "Relationship to Qodo PR-Agent" note: CodeRabbit remains the primary automatic reviewer, and Qodo PR-Agent adds description, suggestions and on-demand tools. Link `docs/QODO_PR_AGENT.md`. Do **not** change `.coderabbit.yml`.
- [ ] T013 [US2] During the pilot, review five PRs that received both CodeRabbit and Qodo PR-Agent output. For each automatic Qodo PR-Agent comment, record its matrix row and whether it duplicates a CodeRabbit primary finding. Write the results to `.github/reports/metrics/qodo-pr-agent/pilot-validation.md` under "US2 duplication check". Target: under 20% duplicates (SC-004).

**Checkpoint**: US1 and US2 together complete the P1 scope.

---

## Phase 5: User Story 3 — Existing agents and skills can invoke and consume Qodo PR-Agent (Priority: P2)

**Goal**: one shared skill lets agents request any allow-listed tool with publishing off, and every in-scope integration point documents its use and fallback.

**Independent Test**: for each in-scope row in the [integration points table](./contracts/responsibility-matrix.md#integration-points-us3), the asset reflects Qodo PR-Agent output when the key is set, and completes with "Qodo PR-Agent input skipped: no-credential" when it isn't (quickstart "Integration checks", SC-005).

### Tests for User Story 3

- [X] T014 [P] [US3] Create `tests/js/qodo-pr-agent-integrations.test.js`. It asserts:
  - (a) `skills/qodo-pr-agent/SKILL.md` exists with frontmatter `name: "lightspeed-qodo-pr-agent"` and a `description`, and documents the output fields `status`, `reason`, `tool`, `markdown`, `data`, `truncated` and the statuses `ok`, `skipped`, `error`.
  - (b) `skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh` exists and is executable. It contains `publish_output=false`, `propagate_tool_errors=true` and `response_language=en-GB`, and uses the same `sha256:` digest as `.github/workflows/qodo-pr-agent-reusable.yml`, compared by reading both files.
  - (c) `skills/SKILL_REGISTRY.json` has `lightspeed-qodo-pr-agent` in the `core` group.
  - (d) Each of these files contains a heading `## Qodo PR-Agent integration`, and within that section the words "fallback" (case-insensitive) and "skipped": `skills/pr-review/SKILL.md`, `agents/reviewer-agent/AGENT.md`, `skills/gh-address-comments/SKILL.md`, `agents/address-comments.agent.md`, `agents/pr-agent/AGENT.md`, `agents/labeling-agent/AGENT.md`, `skills/label-governance/SKILL.md`, `agents/changelog-agent/AGENT.md`, `skills/changelog-generator/SKILL.md`, `agents/document-reviewer-agent/AGENT.md`, `skills/documentation-writer/SKILL.md`, `agents/qa-subagent.agent.md`.
  - (e) `agents/issue-agent/AGENT.md` mentions `similar_issue` together with "deferred".

  Run it and confirm it fails.

### Implementation for User Story 3

- [X] T015 [US3] Create `skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh` (bash, `set -euo pipefail`, executable) per [contracts/skill-interface.md](./contracts/skill-interface.md).
  - **Arguments**: `<tool> (--pr-url <url> | --diff-file <path>) [--question "<text>"] [--out <dir>]`. Allowed tools are `review improve describe ask generate_labels update_changelog add_docs`. With `--diff-file`, only `review improve describe ask` are allowed. `--question` is required for `ask`.
  - **Credentials**: the credential comes only from the dedicated `ANTHROPIC_API_KEY_QODO_PR_AGENT` (FR-002; no fallback to a shared `ANTHROPIC_API_KEY`), exported as `ANTHROPIC__KEY`. PR mode requires `GITHUB_TOKEN`, exported as `GITHUB__USER_TOKEN`.
  - **Runtime**: prefer `docker run --rm` of `pragent/pr-agent@sha256:<same digest as T006>`. Otherwise use `pipx run pr-agent==0.46.0`, which needs Python ≥ 3.12. If neither is available, return `skipped` with reason `no-runtime`.
  - **Upstream flags**: always pass `--config.publish_output=false --config.verbosity_level=2 --config.propagate_tool_errors=true --config.response_language=en-GB --config.model=anthropic/claude-sonnet-5`. In diff mode use `--diff-file <path> --output <out>/out.md --json-output <out>/out.json`.
  - **Result**: write `<out>/result.json` and echo it, with `{"status","reason","tool","markdown","data","truncated"}`. `truncated` is true if the output mentions clipped or omitted files. Map a missing key to `skipped`/`no-credential`, a disallowed tool to `skipped`/`tool-disabled`, rate-limit (HTTP 429) text to `error`/`rate-limited`, and any other non-zero exit to `error`/`upstream-error`.
  - **Exit codes**: 0 for ok and skipped, 2 for error.
  - Never print the credential, and never pass it on the command line; use `-e` or `env` only.
- [X] T016 [US3] Create `skills/qodo-pr-agent/SKILL.md`, with frontmatter `name: "lightspeed-qodo-pr-agent"` and a `description` starting "Use this skill when an agent needs Qodo PR-Agent output (review, improve, describe, ask, labels, changelog, docs) for a PR or diff without publishing to GitHub". Use the `docs/SKILLS_STANDARDS.md` sections: Purpose, Capabilities, Input Interface, Output Interface, Usage in Agents (the caller obligations 1–4 from the skill contract, verbatim), Error Handling, Examples (PR mode, diff mode, and a skipped result), Testing. Also create `skills/qodo-pr-agent/metadata.yml`, mirroring `skills/pr-review/metadata.yml` (`version: v0.1.0`, `owners`, platforms).
- [X] T017 [US3] Add `"lightspeed-qodo-pr-agent"` to the `core` group `skills` array in `skills/SKILL_REGISTRY.json`, keeping alphabetical order. Then run `npm run validate:skills` and `npm run audit:registry`.
- [X] T018 [P] [US3] Add a `## Qodo PR-Agent integration` section to `skills/pr-review/SKILL.md` and `agents/reviewer-agent/AGENT.md`. In the reviewer agent it goes under its "Configuration" section, as a new optional input. The section says:
  - **Invocation**: `skills/qodo-pr-agent` with `review` (and `ask` for targeted questions)
  - **On output**: merge the findings as inputs and apply LightSpeed standards on top; Qodo PR-Agent is not a separate verdict
  - **Fallback**: continue without it and state `Qodo PR-Agent input skipped: <reason>`
- [X] T019 [P] [US3] Add a `## Qodo PR-Agent integration` section to `skills/gh-address-comments/SKILL.md` and `agents/address-comments.agent.md`. It says:
  - **Invocation**: pr-comment. Read the persistent Qodo PR-Agent suggestions comment, identified by the marker from T010.
  - **On output**: triage each suggestion like any review comment, either addressing it or replying with a reason.
  - **Fallback**: if there is no Qodo PR-Agent comment, there is nothing to triage ("skipped").
- [X] T020 [P] [US3] Add a `## Qodo PR-Agent integration` section to `agents/pr-agent/AGENT.md` (the internal PR agent). It covers two things:
  - (1) The `describe` summary via `skills/qodo-pr-agent` in **diff mode**, as an optional source for the diff-derived body section. Routed-template ownership stays with the internal agent.
  - (2) `review`/`improve` findings as the "AI-review findings" input to the self-review gate (spec 015 US2).
  - **Fallback**: existing behaviour, plus the gate records "no Qodo PR-Agent input (skipped)".

  Before editing, check the open stacked spec-015 PRs (lightspeedwp/.github#3400, lightspeedwp/.github#3401, lightspeedwp/.github#3403) for changes to this file, and merge `develop` first to avoid conflicts.
- [X] T021 [P] [US3] Add a `## Qodo PR-Agent integration` section to `agents/labeling-agent/AGENT.md` (after "Configuration Files") and `skills/label-governance/SKILL.md`. It says:
  - **Invocation**: `skills/qodo-pr-agent` with `generate_labels` (publishing off).
  - **On output**: keep only names that exist exactly in `.github/labels.yml`; never create or apply any other name; record the dropped names in the agent output.
  - **Fallback**: the existing labelling rules ("skipped").
  - State that Qodo PR-Agent itself never applies labels (FR-008).
- [X] T022 [P] [US3] Add a `## Qodo PR-Agent integration` section to `agents/changelog-agent/AGENT.md` and `skills/changelog-generator/SKILL.md`. It says:
  - **Invocation**: pr-comment, which is the `/update_changelog` proposal comment, or the skill with `update_changelog`.
  - **On output**: validate against the changelog rules (≤250 characters, user-facing, no implementation detail, linked to a PR or issue, Keep a Changelog category). Reject naming the failing rule; the entry is never committed by Qodo PR-Agent.
  - **Fallback**: the existing changelog flow ("skipped").
- [X] T023 [P] [US3] Add a `## Qodo PR-Agent integration` section to `agents/document-reviewer-agent/AGENT.md` and `skills/documentation-writer/SKILL.md`. It says:
  - **Invocation**: pr-comment, which is the `/add_docs` output.
  - **On output**: review the suggestions before any adoption.
  - **Fallback**: none needed ("skipped").
- [X] T024 [P] [US3] Add a `## Qodo PR-Agent integration` section to `agents/qa-subagent.agent.md`. It says:
  - **Invocation**: `skills/qodo-pr-agent` with `ask` and a targeted question.
  - **On output**: use the answer as test-planning input.
  - **Fallback**: proceed without it ("skipped").

  Also, in `agents/issue-agent/AGENT.md` under "Integration Points", add a bullet: "Qodo PR-Agent `similar_issue`: deferred. The upstream tool is experimental, needs OpenAI embeddings and isn't in the Action image (spec 017, research R8)."
- [ ] T025 [US3] Run `npx jest tests/js/qodo-pr-agent-integrations.test.js` (it should pass), then `npm run validate:agents`, `npm run validate:frontmatter` and `npm run lint:md`. Then run the quickstart "Integration checks" with the key set and unset, and record the results in `.github/reports/metrics/qodo-pr-agent/pilot-validation.md` under "US3 integration checks".

**Checkpoint**: every in-scope integration is documented, contract-tested and validated with and without Qodo PR-Agent.

---

## Phase 6: User Story 4 — Organisation-standard configuration that other repositories can adopt (Priority: P3)

**Goal**: a documented, tested path for another repository to opt in later. Only `.github` is enabled in this feature.

**Independent Test**: the pilot runs purely from the central configuration, and a walkthrough of the opt-in guide against a non-`.github` repository finds no missing step (spec US4, SC-006).

- [X] T026 [US4] Add an "Enable in another repository" section to `docs/QODO_PR_AGENT.md`, with numbered steps:
  1. Ask the org owner to add the repository to the `ANTHROPIC_API_KEY_QODO_PR_AGENT` secret's selected repositories.
  2. Copy `.github/workflows/qodo-pr-agent.yml` from this repository, and replace the `uses:` line with `lightspeedwp/.github/.github/workflows/qodo-pr-agent-reusable.yml@<ref>`, explaining `main` versus a release tag.
  3. Optionally set the `config_ref` input.
  4. Optionally add a local `.pr_agent.toml` for overrides.
  5. Open a test PR and check quickstart Q-01.

  Add an "Overrides" subsection: every overridden key needs a `# override: <reason>` comment directly above it (data model "Repository override"); **locked** keys (from [contracts/pr-agent-config.md](./contracts/pr-agent-config.md)) can't be overridden; and each override must be listed in the repository's README or `AGENTS.md` under "Qodo PR-Agent overrides".
- [ ] T027 [US4] Have a second maintainer walk through T026 against a non-`.github` LightSpeed repository **without enabling it**. Record every gap found, and fix it in `docs/QODO_PR_AGENT.md`. Record the walkthrough result in `.github/reports/metrics/qodo-pr-agent/pilot-validation.md` under "US4 opt-in walkthrough".

**Checkpoint**: another repository can opt in using the docs alone.

---

## Phase 7: User Story 5 — Documented operation, cost visibility and exit path (Priority: P3)

**Goal**: runs, failures and spend are reported, and the owner can stop Qodo PR-Agent within minutes.

**Independent Test**: after 14 days, the pilot report shows runs per tool, failures and estimated spend. Setting the kill-switch stops new runs (quickstart Q-10, SC-007, SC-008).

- [X] T028 [US5] In `.github/workflows/qodo-pr-agent-reusable.yml` job `run`, after the upload step, add a step using `./.github/actions/collect-metrics` with `workflow-name: qodo-pr-agent`, `job-name: run` and `metrics-file: qodo-pr-agent-metrics.json`, plus `continue-on-error: true`. Note that consumers outside this repository can't use the local action path: add `if: github.repository == 'lightspeedwp/.github'` and a comment explaining why. Remove the T006 placeholder comment. Re-run `npx jest tests/js/qodo-pr-agent-workflow.test.js` and `npm run validate:workflows`.
- [X] T029 [P] [US5] Create `scripts/metrics/qodo-pr-agent-report.cjs` (CommonJS, Node ≥ 20, no new dependencies, using the built-in `fetch` with `GITHUB_TOKEN`). CLI: `--since YYYY-MM-DD --out <dir> [--repo lightspeedwp/.github] [--tokens-per-run <n>] [--price-per-mtok <usd>]`. It lists workflow runs of `qodo-pr-agent.yml` since the date, downloads each `qodo-pr-agent-run-*` artefact's `qodo-pr-agent-run.json`, and writes `<out>/pilot-report-YYYY-MM-DD.md`. The report has tables for runs per `tool`, outcome counts (success, failure, and each `skipped:<reason>`) and median `duration_seconds`, the SC-001 line (the percentage of eligible automatic runs whose output landed within 10 minutes of `event_at`, against the 95% target), plus an "Estimated spend" line (runs × tokens-per-run × price, labelled as an estimate) and a reminder to cross-check the dedicated key's usage in the Anthropic console. Add a unit test `tests/js/qodo-pr-agent-report.test.js` for the aggregation function with fixture run records, and export the aggregation function for it.
- [X] T030 [P] [US5] Add an "Operations" section to `docs/QODO_PR_AGENT.md`:
  - **Kill-switch**: set the Actions variable `QODO_PR_AGENT_ENABLED` to `false` at repository or organisation level. It takes effect on the next event, and no commit is needed. Second line: revoke or cap the key in the Anthropic console.
  - **Upgrading the pinned version**: repeat T001, update the digest in both the workflow and the skill script in one PR, and add a CHANGELOG note.
  - **Pilot report**: the T029 command.
  - **Monthly spend limit**: set on the key.
- [X] T040 [P] [US5] Add a "Secrets in Qodo PR-Agent comments" subsection to the "Operations" section of `docs/QODO_PR_AGENT.md`, as required by the clarified spec edge case (2026-09-24). State that the model's output can't be guaranteed never to repeat a secret from the diff, and give the response in order: (1) a maintainer deletes the comment; (2) the exposed secret is rotated wherever it is used; (3) if it happens again, set `QODO_PR_AGENT_ENABLED` to `false` and raise an issue. Note that the workflow's own logs mask the model credential. Add a contract assertion for the subsection heading to `tests/js/qodo-pr-agent-integrations.test.js`.
- [ ] T031 [US5] After 14 days of pilot operation, run `node scripts/metrics/qodo-pr-agent-report.cjs`, write `.github/reports/metrics/qodo-pr-agent/pilot-report-YYYY-MM-DD.md`, and add the maintainer usefulness result: a short survey or reaction count, with the SC-004 target ≥ 70% useful. Open a follow-up issue that summarises the keep, adjust or roll-out recommendation for @ashley, including the monthly budget needed for SC-008.

- [X] T037 [US5] Create `.github/workflows/qodo-pr-agent-report.yml` (`name: Qodo PR-Agent • Daily report`). It runs on `schedule` (daily, `43 6 * * *`) and `workflow_dispatch` (optional `since` input); has top-level `permissions: contents: read`, with the job adding `actions: read`; does a sparse checkout of `scripts/metrics` with `persist-credentials: false`; and runs `node scripts/metrics/qodo-pr-agent-report.cjs --since <14 days ago>`, publishing to the job summary and an artefact. Nothing is committed. Added by `/speckit-analyze` finding C2: constitution Principle X requires metrics that update at least daily.

**Checkpoint**: all user stories are complete.

---

## Phase 8: Polish & cross-cutting concerns

- [X] T032 [P] Add a `### Added` entry to `CHANGELOG.md` under Unreleased, at most 250 characters and user-facing: "Qodo PR-Agent pilot on this repository: automatic PR summaries and improvement suggestions alongside CodeRabbit, plus maintainer commands such as /ask and /update_changelog." Link the implementation PR.
- [X] T033 [P] Register both new workflows in the inventory tables of `docs/WORKFLOWS.md` and `.github/workflows/README.md`, one row each with purpose and triggers. Don't rewrite the portable-workflow guidance, which is covered by a separate task.
- [X] T034 [P] In `docs/AI_FEEDBACK_SYSTEM_SUMMARY.md`, list Qodo PR-Agent as an AI reviewer whose feedback follows the same `FEEDBACK_RESPONSE.md` process as CodeRabbit, and link the "Recognising Qodo PR-Agent feedback" section of `docs/QODO_PR_AGENT.md`. Add `docs/QODO_PR_AGENT.md` to the `docs/README.md` index.
- [X] T035 Run the full local check set from quickstart "Local checks": `npm test`, `npm run validate:all`, `npm run lint:md`, `npm run lint:workflows`. Fix anything they report.
- [X] T038 Add keyless Workload Identity Federation to the reusable workflow as an alternative to the key secret: `federation_rule_id`, `organization_id`, `service_account_id` and `workspace_id` inputs (from Actions variables in the caller); a `token` step that exchanges the job's GitHub OIDC token (audience `https://api.anthropic.com`) at `/v1/oauth/token`, masks the result and passes it to Qodo PR-Agent; the `id-token` permission set to `write` on the `run` job and the caller; a stored key takes precedence; a failed exchange is recorded as `failure` without blocking the PR; fork PRs skip with `fork`. Covered by `tests/js/qodo-pr-agent-workflow.test.js`, the reusable-workflow contract and `docs/QODO_PR_AGENT.md`.
- [ ] T039 Live check: run quickstart Q-13 once the federation resources exist, and record whether Qodo PR-Agent accepts the exchanged token in `.github/reports/metrics/qodo-pr-agent/pilot-validation.md`.
- [ ] T036 Set `**Status**:` in `.github/specs/017-qodo-pr-agent-integration/spec.md` to `Implemented (pilot)`. Add or update the 017 row in `.github/specs/CATALOG.md` (`| 017 | qodo-pr-agent-integration | Qodo PR-Agent Installation & Agent/Skill Integration | Active | 2026-09-24 | [./017-qodo-pr-agent-integration/spec.md](./017-qodo-pr-agent-integration/spec.md) |`). Do this after spec 016 (lightspeedwp/.github#3525) has landed, so the numbering stays contiguous.

---

## Dependencies & execution order

### Phase dependencies

- **Setup (T001–T002)**: no dependencies. T002 is a human hand-off, and only the *live* validation tasks (T009, T013, T025 checks, T031) wait for it.
- **Foundational (T003–T004)**: depends on nothing. It blocks every user story.
- **US1 (T005–T010)**: depends on T001 (the digest) and T004. The MVP is complete at T010.
- **US2 (T011–T013)**: T011 and T012 need only T008. T013 needs live pilot data, so it comes after T009.
- **US3 (T014–T025)**: T015 needs T001 (the same digest), and T019 needs T010 (the marker text). Everything else only needs Foundational. It can proceed in parallel with US1 implementation.
- **US4 (T026–T027)**: needs T007 (the caller exists) and T008.
- **US5 (T028–T031, T037, T040)**: T028 needs T006. T029, T030, T037 and T040 are independent. T031 needs 14 days of pilot runs after T009.
- **Polish (T032–T036, T038–T039)**: after the stories it describes. T038 needs T006 and T007. T039 needs T038 plus federation resources in the Claude Console, and only applies if the keyless route is used. T036 also waits on lightspeedwp/.github#3525.
- **FR-023**: no LOCKED-file change is needed for the pilot, so there is no task. Any later need goes through a tagged change-request issue.

### Story completion order

```text
Setup ─► Foundational ─► US1 (MVP) ─► US2
                    ├──► US3 (parallel with US1; T019 waits for T010)
                    ├──► US4 (after T007/T008)
                    └──► US5 (T028 after T006; T031 after 14-day pilot)
                                             └──► Polish
```

### Within each story

The test task comes first and must fail. Then implementation, then the local checks, then live validation.

## Parallel opportunities

- **Foundational**: T003 (test) can be drafted while T001 resolves the digest.
- **US1**: T005 (workflow test) runs in parallel with T008 (docs).
- **US2**: T011 ∥ T012.
- **US3**: after T014–T017, the documentation tasks **T018–T024 are all [P]**, each touching different files, and could go to up to seven parallel workers.
- **US5**: T029 (report script) ∥ T030 (ops docs).
- **Polish**: T032 ∥ T033 ∥ T034.

### Parallel example: User Story 3

```text
Worker A: T018  skills/pr-review/SKILL.md + agents/reviewer-agent/AGENT.md
Worker B: T019  skills/gh-address-comments/SKILL.md + agents/address-comments.agent.md
Worker C: T020  agents/pr-agent/AGENT.md
Worker D: T021  agents/labeling-agent/AGENT.md + skills/label-governance/SKILL.md
Worker E: T022  agents/changelog-agent/AGENT.md + skills/changelog-generator/SKILL.md
Worker F: T023  agents/document-reviewer-agent/AGENT.md + skills/documentation-writer/SKILL.md
Worker G: T024  agents/qa-subagent.agent.md + agents/issue-agent/AGENT.md
Then:     T025  run the tests and integration checks
```

## Implementation strategy

1. **MVP (P1)**: Setup → Foundational → US1 (T001–T010). Merge and validate live. This alone delivers value: automatic summaries and suggestions, plus maintainer commands.
2. **Complete P1**: US2 (T011–T013) documents and measures the CodeRabbit split.
3. **P2**: US3 (T014–T025) connects the agents and skills. It can be a separate PR stacked on the MVP.
4. **P3**: US4 (T026–T027) and US5 (T028–T031), then Polish.
5. **Suggested PR slicing** (each at most about 15 files or 400 lines, per the organisation's review budget):
   - PR-A: T001–T008, T032, T033
   - PR-B: T014–T025
   - PR-C: T026–T030, T034
   - Validation-only commits: T009, T010, T013, T027, T031, T036
