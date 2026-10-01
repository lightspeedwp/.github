# Research: Qodo PR-Agent Installation & Agent/Skill Integration

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-09-24

Sources:

- Qodo PR-Agent source at `main` (HEAD `1f11725b4d96afbaad8ed956afd074ecf4642426`, 2026-09-23): `action.yaml`, `Dockerfile.github_action_dockerhub`, `pr_agent/settings/configuration.toml`, `pr_agent/servers/github_action_runner.py`, `pr_agent/algo/token_budget.py`, `pr_agent/config_security.py`, and `docs/docs/**`, which is the source of docs.pr-agent.ai.
- Docker Hub (`pragent/pr-agent`) and PyPI (`pr-agent`).
- The existing conventions of this repository.

The upstream repository now presents itself as **`The-PR-Agent/pr-agent`** (Qodo donated the project; the old `the-pr-agent/pr-agent` and `qodo-ai/pr-agent` names still redirect to it). Its documentation is `docs.pr-agent.ai`, not the older `qodo-merge-docs.qodo.ai`. Re-checked against the `v0.46.0` tag on 2026-10-01: latest release `v0.46.0`, published 2026-09-21.

Each item below uses the Decision / Rationale / Alternatives format. Items marked **Verify in pilot** could not be proven from source alone and have a matching check in [quickstart.md](./quickstart.md).

---

## R1. How Qodo PR-Agent is executed in CI

- **Decision**: Run the upstream image's **own CLI**, by overriding its entry point: `docker run --rm -i --entrypoint python "${env_args[@]}" "$image" -m pr_agent.cli --pr_url "$pr_url" "$command"`, where `image` is `pragent/pr-agent@sha256:<digest>` — referenced by **image digest**, not by tag.
- **Rationale**: `uses: the-pr-agent/pr-agent@<sha or tag>` does **not** pin the code that runs. The action's Dockerfile is `FROM pragent/pr-agent:github_action`, a floating tag, even at the `v0.46.0` tag. Only a digest reference makes a run reproducible, which matches the repo rule that every action is pinned to a full SHA (FR-003).
- **Alternatives considered**:
  - `The-PR-Agent/pr-agent@main`: this is what the docs show. It floats on every upstream commit, so it was rejected.
  - Pinning the action to a SHA: this looks pinned but isn't, because of the floating base image. Rejected.
  - `docker://pragent/pr-agent:0.46.0-github_action` by tag: readable, but a tag can be re-pushed. Rejected in favour of the digest.
  - Installing the `pr-agent` pip package on the runner: rejected. It needs an unpinned install on the runner host, and it would put the code outside the digest pin.
  - Leaving the image's own entry point, which runs the GitHub action runner: **rejected 2026-10-01 after reading its source at `v0.46.0`.** It dispatches on `GITHUB_EVENT_NAME` over five branches only, its `workflow_run` branch returns unless the originating event is `pull_request` or `pull_request_target`, there is no `workflow_dispatch` branch, and it never reads `PR_NUMBER` or `PR_AGENT_COMMAND`. A maintainer command and a manual dispatch would therefore have run no tool at all while reporting success. The CLI takes the pull request explicitly and does not depend on the event, so one invocation serves the automatic path, a command and a dispatch.
  - The `pr_mode_adapter.py` skill script: it needs `pr_agent` importable on the runner, which has the same unpinned-install problem. Rejected for the pilot and the shared standard; it remains the right entry point for an agent on a host that already has the package.

## R2. Where the workflows live (platform constraint versus Principle III)

- **Decision**: four files, all in `.github/workflows/`:
  1. `qodo-pr-agent-reusable.yml` (`on: workflow_call`): the organisation-standard run definition. Other repositories consume it with `uses: lightspeedwp/.github/.github/workflows/qodo-pr-agent-reusable.yml@<ref>`, so changes reach them without a per-repository edit (US4).
  2. `qodo-pr-agent-trigger.yml`: the **unprivileged half**. It runs on `pull_request` and `issue_comment`, which is the only way a repository-owned workflow can act on a comment. It holds no secret and no write scope, and publishes a request hint and nothing else.
  3. `qodo-pr-agent.yml`: the **privileged receiver** for this repository. It triggers on `workflow_run` and `workflow_dispatch`, reads the key, and **inlines its run job** rather than calling file 1 — see R6 for why an inlined run, and R1 for why the CLI.
  4. `qodo-pr-agent-report.yml`: the daily pilot report. It reads run records and holds no model credential.
- **Rationale**: GitHub only resolves a reusable workflow from `{owner}/{repo}/.github/workflows/<file>.yml@ref`, so file 1 cannot live in a root `workflows/` folder. The privileged half must be reachable on the default branch, which is what `workflow_run` gives: GitHub reads that workflow's definition from the default branch, so a branch edit to it does not execute.
- **The pilot does not exercise file 1.** That is the point of the split and the cost of it. `qodo-pr-agent.yml` inlines its run job, so the shared standard's code path is not covered by this repository's own runs; it is covered by the entry-point tests, which execute both invocations, and it will first run for real in the first adopting repository. A consumer therefore inherits code this repository has tested structurally rather than live, which is stated in the reusable contract rather than left to be discovered.
- **Alternatives considered**:
  - Putting the workflow in root `workflows/` for consumers to copy: copies drift, and FR-018/US4 AS2 require that changes reach consumers without per-repository edits.
  - A single non-reusable workflow: met the pilot but not US4. Rejected.
  - The receiver calling file 1 by a local `uses: ./`: reintroduces a reference a same-repository branch can repoint, which is the CWE-200 shape T042 closed. Rejected — see the contract's caller security requirements.
  - The receiver calling file 1 by a pinned `@<sha>`: safer than a local path, but it still runs code a pull request author cannot influence, and it adds a second privileged reference to keep pinned. Rejected in favour of the inlined run, with the reusable kept for consumers.

## R3. Central configuration and how consumers inherit it

- **Decision**:
  - A root-level **`.pr_agent.toml`** in `lightspeedwp/.github` holds the organisation-standard settings. Qodo PR-Agent requires this file name and location for repository-local configuration, and `.coderabbit.yml` sets the root-level precedent.
  - Both workflows pass `PR_AGENT_EXTRA_CONFIG_URL` pointing at the raw URL of that file at the fixed ref `develop`, written as a constant: there is no caller-supplied `config_ref` input, so no caller can select the configuration. `develop` replaced `main` on 2026-10-01: `main` is this repository's oldest branch and carries neither `.pr_agent.toml` nor the reusable workflow, so a `main` URL 404s and PR-Agent would silently run on upstream defaults.
  - A consuming repository's own `.pr_agent.toml`, if present, overrides individual keys, **except locked keys**, which the workflow re-sets as environment variables (the top precedence layer) so they cannot be weakened (review finding, 2026-09-24). Precedence, as documented upstream: defaults < `extra_config_url` < org `pr-agent-settings` repo < local `.pr_agent.toml` < environment variables.
- **Rationale**:
  - `extra_config_url` is a *host-only* key, so a repository's own `.pr_agent.toml` cannot set it. It can be set by the workflow environment, which is the host.
  - This gives central defaults, per-repository overrides (FR-019) and change propagation (US4 AS2) without creating a new repository.
  - In the pilot repository, the local `.pr_agent.toml` *is* the central file, so both layers carry identical values.
  - Qodo PR-Agent reads `.pr_agent.toml` from the **default branch** (`develop`), so configuration changes take effect only after merge. This is a safety property: a PR cannot change its own review settings.
- **Alternatives considered**:
  - An org-wide `lightspeedwp/pr-agent-settings` repository, the upstream mechanism: it needs a new repository and a token that can read it (the default `GITHUB_TOKEN` cannot read another private repository). Deferred as a possible follow-up once more repositories opt in.
  - Environment variables only: these cannot be overridden per repository, because env has the highest precedence. Rejected.
- **Verify in pilot**: that `PR_AGENT_EXTRA_CONFIG_URL` set through the workflow environment is honoured by the CLI (quickstart Q-09). The action runner read it as `CONFIG.EXTRA_CONFIG_URL`; the CLI reads the `PR_AGENT_` name, which is the default of its own `--extra_config_url` argument. Fallback if it isn't: consumers keep a `.pr_agent.toml` copied from the documented template, and a parity test flags drift.

## R4. Language model and credential

- **Decision**:
  - `config.model = "anthropic/claude-sonnet-5"` and `config.fallback_models = ["anthropic/claude-haiku-4-5-20251001"]`.
  - `config.max_model_tokens = 64000`. The upstream default is 32000, and every model is clamped to this value.
  - Large patches use `large_patch_policy = "clip"`.
  - The credential is a **dedicated** Anthropic API key, held only as the environment secret `ANTHROPIC_API_KEY_QODO_PR_AGENT` on the `qodo-pr-agent` Environment, whose deployment branch policy admits the default branch only. Each opting-in repository creates its own Environment. The reusable workflow maps it to the env var the runner reads, `ANTHROPIC.KEY`.
  - **Keyless alternative — added 2026-09-24, removed 2026-10-01**: Workload Identity Federation exchanged the job's GitHub OIDC token for a short-lived Anthropic access token, so no key was stored. It was removed because it required `id-token` set to `write` on the same job that runs the third-party `pragent/pr-agent` container, and it was never configured in the first place. The dedicated key is the only route; reinstating keyless needs its own job for the exchange.
- **Rationale**:
  - Both model IDs are in the runner's built-in model table, so no `custom_model_max_tokens` is needed.
  - Sonnet balances quality and cost for description and suggestions, and Haiku is a cheap fallback.
  - A key used only by Qodo PR-Agent makes spend attributable exactly in the Anthropic console (FR-021, SC-008), and lets the organisation revoke or cap it independently.
  - The secret name follows the organisation's `ANTHROPIC_API_KEY*` convention (FR-002).
  - The runner reads `ANTHROPIC.KEY` or `ANTHROPIC__KEY`, and ambient `ANTHROPIC_API_KEY` is intentionally not relied on.
- **Alternatives considered**:
  - Reusing a shared `ANTHROPIC_API_KEY`: spend can't be separated. Rejected.
  - Opus models: higher cost for a pilot whose main outputs are summaries. Rejected for the default; a repository can override.
  - OpenAI: no existing organisation convention. Rejected.
  - Federation only, with no key option: rejected, and since removed (2026-10-01). The dedicated key is the supported route, and Q-13 no longer exists because there is no keyless path to check.

## R5. Triggers, eligibility and command guard

- **Decision**:
  - **Triggers**: `pull_request: [opened, reopened, ready_for_review]` and `issue_comment: [created]`. There is no `synchronize` trigger (no re-run on every push), which mirrors CodeRabbit's non-incremental policy (#3517).
  - **Automatic eligibility** (workflow `if:`): the PR is not a draft; `sender.type != 'Bot'`; the PR author is not `dependabot[bot]` or `lightspeed-docs-bot[bot]`; and the enable variable `vars.QODO_PR_AGENT_ENABLED == 'true'` (opt-in since 2026-10-01: unset or any other value is a `kill-switch` skip).
  - **Comment eligibility**: the comment is on a PR (`github.event.issue.pull_request`); `author_association` is `OWNER`, `MEMBER` or `COLLABORATOR`; and the body starts with an **allow-listed** command: `/describe`, `/improve`, `/review`, `/ask`, `/update_changelog`, `/add_docs`, `/help`.
  - **Automatic tools**: the CLI names the two tools directly — `run_tool describe` and `run_tool improve` — and no review is ever run automatically. An automatic review cannot be requested through this path at all, which satisfies FR-010 more strongly than switching an `auto_review` setting off did. The shared standard still gates the two tools on its `auto_describe` and `auto_improve` inputs, so a consumer can turn either off. The upstream runner required all three to be set explicitly, because unset means *on*.
- **Rationale**:
  - The upstream runner performs **no commenter permission check**. Any user who can comment could run tools and spend budget. The author-association guard enforces the spec assumption that commands are for maintainers only.
  - The PR-level ignore settings (`ignore_pr_authors`, `ignore_pr_labels`, `ignore_pr_title`) are **not applied by the Action runner**, only by the webhook servers. So exclusions must be expressed as workflow `if:` conditions, which is also how existing workflows do it.
  - The command allow-list enforces the responsibility matrix. `/generate_labels` and `/similar_issue` are excluded (see R7 and R8).
  - Disabling automatic review satisfies FR-010. Review stays available on demand.
- **Alternatives considered**:
  - `synchronize`: this would give re-runs on every push, at a cost the pilot shouldn't carry. Deferred; it can be switched on later through `handle_push_trigger`.
  - No command allow-list: that would allow label and similar-issue commands that break FR-008 or can't run (R8). Rejected.

## R5b. Why a run refuses a pull request whose head has moved

- **Decision**: the receiver compares the pull request's current head SHA with the one the triggering run saw, and returns `trigger-head-superseded` when they differ.
- **Rationale**: the run's record, and the `head_sha` the report counts, must describe the commit the eligibility check was actually performed against. Analysing a different commit would make that record wrong rather than merely stale. A later push does not retrigger the pilot — the trigger fires only on `opened`, `reopened` and `ready_for_review` — so the commit the author most recently pushed is covered by the next one of those events, not by a re-analysis of the earlier trigger.
- **The trade-off, stated rather than hidden**: a run in flight when a push lands is refused, so that push is not analysed until the next qualifying event. That is a coverage gap of seconds-to-minutes, in exchange for the record never lying about which commit it analysed. The opposite choice — analysing whatever the head happens to be when the privileged job starts — is defensible too, and would close the gap.
- **Why it is not removed on a review suggestion**: a suggestion to drop the check was verified against the source and against the data model, and declined. The check is a property of the record, not only of the analysis, and removing it would let `head_sha` and the triggering event disagree. If the trade-off above is judged wrong, this is the place to change it, and the two tests that assert the reason change with it.

## R6. Fork and secret safety

- **Decision**:
  - Split the pilot in two. The **unprivileged trigger** (`.github/workflows/qodo-pr-agent-trigger.yml`) runs on `pull_request` and `issue_comment`, holds no secret, grants no write scope, and publishes a request hint. The **privileged receiver** (`.github/workflows/qodo-pr-agent.yml`) runs on `workflow_run` and `workflow_dispatch`, and is the only workflow that touches the key.
  - The credential is an **Environment** secret, never a repository secret, and only the receiver's `run` job declares that Environment.
  - **Never** add `actions/checkout`, because Qodo PR-Agent reads the PR through the API.
  - A **preflight** job in the receiver re-derives every eligibility fact from the API, so the trigger's artefact is a hint and never an authority.
  - No required reviewers on the Environment. That control is correct but puts a person in the loop on every automatic run, which breaks SC-001.
- **Rationale**: This is the only shape that closes the CWE-200 finding without a human gate. The finding is that a same-repository PR author controls the definition GitHub executes under `pull_request`, and that repository secrets are present in that run's secret context. Both were confirmed on a scratch pull request: a `pull_request` run reported `workflow_ref` of `refs/pull/<n>/merge` and `repo_secret_present=true`. `workflow_run` supplies the missing half — GitHub reads the receiver's definition from the default branch — which a scratch edit to an existing `workflow_run` workflow confirmed: the branch's marker step did not execute, and the run's `head_sha` was the `develop` tip. The Environment's deployment branch policy is the second, independent layer: the rule is matched against the run's `GITHUB_REF`, so a `refs/pull/<n>/merge` run cannot start the job at all.
- **`pull_request_target` remains excluded, and the reason is unchanged**: the unsafe-checkout objection never applied to the pilot, which checks out nothing, and this decision said so at the time. The live reason is the event's withdrawal. GitHub adds a default Actions event policy that blocks `pull_request_target` in public repositories, in evaluate mode now and enforced from 2026-11-02 (<https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target>). This repository is public, the documented exceptions are private/internal repositories and a pre-existing applicable policy, and there is no fork-versus-same-repository carve-out in the docs. The opt-out is itself a settings change to revisit. `workflow_run` is not in the scope of that default policy and gives the same default-branch definition, so the exclusion stands and `workflow_run` replaces it rather than lifting it.
- **Alternatives considered**:
  - `pull_request_target` with no checkout: rejected, as above.
  - Environment with **required reviewers**: correct, and explicitly rejected for the pilot because every automatic run would wait for a person, breaking SC-001 and the FR-009 no-blocking constraint. Recorded as the escalation if the owner later wants a human gate.
  - A repository or organisation ruleset restricting who may change `.github/workflows/**` (CODEOWNERS, workflow execution protections with actor rules): valuable defence in depth, and it narrows *who* can obtain the key, but it does not change *where* the key is available once merged code runs. Recommended as an additional control, not as the resolution.
  - A GitHub App installation token with narrowly scoped permissions in place of `GITHUB_TOKEN`: reduces the blast radius of a stolen token, and does not touch the finding, which is about the key's reachability. Recommended as a follow-up.
  - A per-repo model key with a spend cap and rotation, plus an egress allow-list: bounds the cost and the destination of a leak, and does not prevent the exposure. The US$20 cap is already an open prerequisite on #3535.

## R7. Keeping governance intact: labels, descriptions, changelog

- **Decision**:
  - **Descriptions**: `pr_description.publish_description_as_comment = true`, with `publish_description_as_comment_persistent = true`. The routed PR template body is never modified (FR-012, edge case). Set `publish_labels = false` and `generate_ai_title = false`.
  - **Labels**: Qodo PR-Agent applies **no labels**. Set `pr_reviewer.enable_review_labels_security = false` and `enable_review_labels_effort = false` (the defaults add the unprefixed labels `possible security issue` and `Review effort x/5`). Keep `config.enable_custom_labels = false`. `/generate_labels` is not allow-listed. Label *suggestions* reach the labelling agent only through the shared skill, which runs with publishing off (R9), and are then filtered against `.github/labels.yml` (FR-008, FR-015).
  - **Changelog**: `pr_update_changelog.push_changelog_changes = false` means proposals are posted as a comment and never committed (FR-009). The `extra_instructions` state the ≤250-character, user-facing, PR-linked rule. The changelog agent validates any proposal before a human adopts it.
  - **Language**: `config.response_language = "en-GB"` (FR-007). Upstream static headings stay in US English, which is a documented and accepted limitation.
  - **Guidance**: `extra_instructions` for describe, improve, review and ask are technology-agnostic and point to AGENTS.md. Upstream already injects `AGENTS.md` through `config.repo_context_files` (default `["AGENTS.md"]`), so central guidance isn't duplicated (FR-011).
- **Rationale**:
  - Custom labels auto-remove "no longer relevant" labels, which would fight `labeling-unified.yml`.
  - Description markers (`use_description_markers`) would need marker tokens in the LOCKED PR templates, which means a `[TEMPLATE-UPDATE-REQUEST]` (FR-023). Posting the description as a comment avoids that for the pilot, and markers can be proposed later.
- **Alternatives considered**:
  - Overwriting the PR body (the upstream default): destroys the template sections. Rejected.
  - Custom labels restricted to `type:*`: auto-removal risk. Rejected.

## R8. Similar-issues integration is not viable in the pilot

- **Decision**: **Defer** the "similar issues ↔ `agents/issue-agent/`, `skills/ticket-triage`" integration row. `/similar_issue` is not allow-listed.
- **Rationale**: The upstream tool is marked **experimental** and excluded from stability guarantees. It hard-codes OpenAI embeddings (`text-embedding-ada-002`), so it needs an OpenAI key the organisation doesn't use. It needs an optional dependency group that the Action image doesn't install. With a local vector store, it rebuilds its index on every ephemeral run. The spec allows each integration row to be delivered independently. This row is recorded as deferred in the spec, not silently dropped.
- **Alternatives considered**:
  - Adding an OpenAI key plus a Pinecone or Qdrant service: new vendors and cost for an experimental feature. Rejected.
  - Building on `issue-agent`'s own Anthropic enrichment: out of scope for this feature.

## R9. How existing agents and skills call Qodo PR-Agent (FR-017)

- **Decision**: Add one shared skill, `skills/qodo-pr-agent/`, that runs Qodo PR-Agent's CLI with **publishing disabled** (`--config.publish_output=false`, `--config.verbosity_level=2`, `--config.propagate_tool_errors=true`). It returns a normalised result: `status: ok | skipped | error`, `reason`, `markdown`, `data`. It supports two modes:
  - **PR mode**: a small adapter, `scripts/pr_mode_adapter.py`, run inside the pinned image. It calls `PRAgent().handle_request(<url>, [<tool>, …])` and writes the result the tool stores in `get_settings().data["artifact"]`. Needs `GITHUB__USER_TOKEN` plus the model key, and Docker.
  - **Diff mode**: the CLI, `--diff-file <file> --output <md> <tool>` (plus `--json-output <json>` for review), for review, improve, describe or ask with no GitHub token, e.g. before a PR exists (the internal PR agent's pre-PR self-review).

  It runs the pinned container image by digest (R1) when Docker is available. In diff mode only, it otherwise falls back to the pinned pip package (`pr-agent==0.46.0`, Python ≥ 3.12).
- **Correction (2026-10-01)**: the first version of this decision used the CLI with `--pr_url` in PR mode. PR-Agent 0.46.0's `cli.py` accepts `--output` and `--json-output` only in plain-diff mode, and with `publish_output=false` a PR run prints nothing, so the CLI has no non-publishing output for a PR. `push_outputs` runs only when publishing, so it cannot help either. `review`, `describe` and `improve` store their result as an artifact when publishing is off; `ask` does not, so PR-mode `ask` returns `no-output`. pipx can run only the CLI, which is why PR mode needs Docker.
- **Rationale**:
  - One entry point prevents every agent from re-implementing invocation and fallback.
  - "Publishing off" guarantees agents only *consume* output, which fits the matrix and FR-009.
  - The `skipped` status with a reason is the uniform "unavailable" path every integration must handle (FR-014, SC-005).
- **Alternatives considered**:
  - Agents reading Qodo PR-Agent's PR comments: brittle, and only works after a workflow run. Rejected as the primary path, though still acceptable as a secondary source.
  - An MCP server: none exists upstream. Rejected.

## R10. Recognising Qodo PR-Agent feedback (FR-016)

- **Decision**: Record Qodo PR-Agent as an AI reviewer in the AI-feedback process documentation. Identify its comments as author `github-actions[bot]` plus the upstream persistent-comment headers, which include the "Generated by" header (`include_generated_by_header = true`). Pin the exact header strings during the pilot.
- **Rationale**: `workflows/ai-feedback-validation.yml` doesn't identify any AI bot by login today. It validates that `FEEDBACK_RESPONSE.md` and issue links are present. So recognition is a documentation and process change, not a code change. `github-actions[bot]` is shared with other org workflows, so a body marker is required to tell the comments apart.
- **Verify in pilot**: the exact marker text (quickstart Q-07).

## R11. Metrics, cost and kill-switch (FR-020, FR-021)

- **Decision**:
  - **Run records**: each run writes one JSON [Run record](./data-model.md#run-record) to the job summary and to a 30-day artefact, and calls the existing `.github/actions/collect-metrics` action.
  - **Report**: a small report script aggregates the artefacts over the 14-day pilot into `.github/reports/metrics/qodo-pr-agent/`, covering runs per tool, failures and estimated spend. Spend comes from the dedicated key's usage in the Anthropic console (exact), with a token-based estimate in the report.
  - **Kill-switch**: the pilot runs only while the organisation or repository Actions variable `QODO_PR_AGENT_ENABLED` is `'true'`; unset or any other value short-circuits every job. It was opt-out until 2026-10-01 and is now opt-in, so it cannot start spending before the key's limit is confirmed. It needs no commit, and takes effect on the next event (SC-007). Revoking the key is the second-line stop.
- **Rationale**: This reuses the existing metrics action and report locations, and a variable flip is faster than a code change.
- **Alternatives considered**: upstream `[push_outputs]` JSONL/webhook. It's a possible enrichment later, but adds a moving part now. Deferred.

## R12. Testing approach

- **Decision**: Use docs- and config-contract Jest tests in `tests/js/`, following the existing `governance-files.test.js` pattern:
  - Parse `.pr_agent.toml` with `smol-toml` (already a dependency) and assert the governed keys (FR-007/008/009/012).
  - Parse both workflows with `yaml` and assert the digest pin, permissions, guards, allow-list, kill-switch and preflight (FR-003–006, FR-020).
  - Assert that the skill contract and every integrated `AGENT.md`/`SKILL.md` contain an "Qodo PR-Agent integration" section with a fallback statement (FR-013/014).

  End-to-end behaviour is validated manually through [quickstart.md](./quickstart.md) on real pilot PRs. Also run the existing `npm run validate:workflows`, `lint:workflows`, `validate:skills` and `lint:md`.
- **Rationale**: This is how the repository already gates governance files, and it makes the guarantees regression-proof without calling a paid model in CI.
