# Research: Qodo PR-Agent Installation & Agent/Skill Integration

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-09-24

Sources:

- Qodo PR-Agent source at `main` (HEAD `1f11725b4d96afbaad8ed956afd074ecf4642426`, 2026-09-23): `action.yaml`, `Dockerfile.github_action_dockerhub`, `pr_agent/settings/configuration.toml`, `pr_agent/servers/github_action_runner.py`, `pr_agent/algo/token_budget.py`, `pr_agent/config_security.py`, and `docs/docs/**`, which is the source of docs.pr-agent.ai.
- Docker Hub (`pragent/pr-agent`) and PyPI (`pr-agent`).
- The existing conventions of this repository.

The upstream repository now presents itself as **`the-pr-agent/pr-agent`**. `qodo-ai/pr-agent` resolves to the same commits and tags. All references below use the new name.

Each item below uses the Decision / Rationale / Alternatives format. Items marked **Verify in pilot** could not be proven from source alone and have a matching check in [quickstart.md](./quickstart.md).

---

## R1. How Qodo PR-Agent is executed in CI

- **Decision**: Run the upstream GitHub Action's container image directly, referenced by **image digest**: `uses: docker://pragent/pr-agent@sha256:<digest>`. The digest is recorded in the workflow with a version comment (`# 0.46.0-github_action`). At research time, `0.46.0-github_action` resolved to `sha256:65e5b196e38cecd7df8a71fe29942052e081a0c6645132c2ac874df60b1760c7`. Re-resolve the digest when implementing with `docker buildx imagetools inspect pragent/pr-agent:0.46.0-github_action --format '{{.Manifest.Digest}}'`, and verify provenance with `gh attestation verify "oci://index.docker.io/pragent/pr-agent@sha256:<digest>" --repo The-PR-Agent/pr-agent`.
- **Rationale**: `uses: the-pr-agent/pr-agent@<sha or tag>` does **not** pin the code that runs. The action's Dockerfile is `FROM pragent/pr-agent:github_action`, a floating tag, even at the `v0.46.0` tag. Only a digest reference makes a run reproducible, which matches the repo rule that every action is pinned to a full SHA (FR-003).
- **Alternatives considered**:
  - `the-pr-agent/pr-agent@main`: this is what the docs show. It floats on every upstream commit, so it was rejected.
  - Pinning the action to a SHA: this looks pinned but isn't, because of the floating base image. Rejected.
  - `docker://pragent/pr-agent:0.46.0-github_action` by tag: readable, but a tag can be re-pushed. Rejected in favour of the digest.
  - Installing the `pr-agent` pip package in a job: this works (see R9), but would duplicate the action's entry point and event handling.

## R2. Where the workflows live (platform constraint versus Principle III)

- **Decision**: Use two files, both in `.github/workflows/`:
  1. `.github/workflows/qodo-pr-agent-reusable.yml` (`on: workflow_call`): the organisation-standard run definition. Other repositories consume it with `uses: lightspeedwp/.github/.github/workflows/qodo-pr-agent-reusable.yml@<ref>`.
  2. `.github/workflows/qodo-pr-agent.yml`: the pilot caller for this repository. It declares the triggers and calls the reusable workflow locally (`uses: ./.github/workflows/qodo-pr-agent-reusable.yml`), so the pilot uses exactly the same path a future repository would (US4, Independent Test).
- **Rationale**: GitHub only resolves reusable workflows from `{owner}/{repo}/.github/workflows/<file>.yml@ref`. A file in the root `workflows/` folder cannot be called. `docs/WORKFLOWS.md` currently implies it can (`uses: lightspeedwp/.github/workflows/ai-feedback-validation@main`), which is inaccurate. Placing the reusable workflow under `.github/` is therefore forced by the platform. Constitution v1.3.0 covers this with the Principle III "platform-required locations" exception, so the plan records it as an exception in its Constitution Check rather than as a violation (FR-018, clarified 2026-09-24).
- **Alternatives considered**:
  - Putting the workflow in root `workflows/` for consumers to copy: copies drift, and FR-018/US4 AS2 require that changes reach consumers without per-repository edits. Rejected.
  - A single non-reusable workflow: meets the pilot but not US4. Rejected.

## R3. Central configuration and how consumers inherit it

- **Decision**:
  - A root-level **`.pr_agent.toml`** in `lightspeedwp/.github` holds the organisation-standard settings. Qodo PR-Agent requires this file name and location for repository-local configuration, and `.coderabbit.yml` sets the root-level precedent.
  - The reusable workflow passes `CONFIG.EXTRA_CONFIG_URL` pointing at the raw URL of that file at the **same ref the caller pinned** (input `config_ref`, default `main`).
  - A consuming repository's own `.pr_agent.toml`, if present, overrides individual keys, **except locked keys**, which the workflow re-sets as environment variables (the top precedence layer) so they cannot be weakened (review finding, 2026-09-24). Precedence, as documented upstream: defaults < `extra_config_url` < org `pr-agent-settings` repo < local `.pr_agent.toml` < environment variables.
- **Rationale**:
  - `extra_config_url` is a *host-only* key, so a repository's own `.pr_agent.toml` cannot set it. It can be set by the workflow environment, which is the host.
  - This gives central defaults, per-repository overrides (FR-019) and change propagation (US4 AS2) without creating a new repository.
  - In the pilot repository, the local `.pr_agent.toml` *is* the central file, so both layers carry identical values.
  - Qodo PR-Agent reads `.pr_agent.toml` from the **default branch** (`develop`), so configuration changes take effect only after merge. This is a safety property: a PR cannot change its own review settings.
- **Alternatives considered**:
  - An org-wide `lightspeedwp/pr-agent-settings` repository, the upstream mechanism: it needs a new repository and a token that can read it (the default `GITHUB_TOKEN` cannot read another private repository). Deferred as a possible follow-up once more repositories opt in.
  - Environment variables only: these cannot be overridden per repository, because env has the highest precedence. Rejected.
- **Verify in pilot**: that `CONFIG.EXTRA_CONFIG_URL` set through the workflow environment is honoured by the Action runner (quickstart Q-09). Fallback if it isn't: consumers keep a `.pr_agent.toml` copied from the documented template, and a parity test flags drift.

## R4. Language model and credential

- **Decision**:
  - `config.model = "anthropic/claude-sonnet-5"` and `config.fallback_models = ["anthropic/claude-haiku-4-5-20251001"]`.
  - `config.max_model_tokens = 64000`. The upstream default is 32000, and every model is clamped to this value.
  - Large patches use `large_patch_policy = "clip"`.
  - The credential is a **dedicated** Anthropic API key held as the organisation secret `ANTHROPIC_API_KEY_QODO_PR_AGENT`, scoped to selected repositories. The reusable workflow maps it to the env var the runner reads, `ANTHROPIC.KEY`.
  - **Keyless alternative (added 2026-09-24)**: Workload Identity Federation. The reusable workflow exchanges the job's GitHub OIDC token for a short-lived Anthropic access token and passes that as `ANTHROPIC.KEY`, so no key is stored. A stored key still takes precedence. Spend is attributed to the federation rule's service account and capped on its workspace. *Unverified until quickstart Q-13*: the runner sends the key in the `x-api-key` header, and Anthropic documents federated tokens with `Authorization: Bearer`.
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
  - Federation only, with no key option: blocked until Q-13 confirms the runner accepts the exchanged token. Rejected for now. The federation route is implemented but stays unverified, and pending validation, until Q-13 passes; the dedicated key is the supported route.

## R5. Triggers, eligibility and command guard

- **Decision**:
  - **Triggers**: `pull_request: [opened, reopened, ready_for_review]` and `issue_comment: [created]`. There is no `synchronize` trigger (no re-run on every push), which mirrors CodeRabbit's non-incremental policy (#3517).
  - **Automatic eligibility** (workflow `if:`): the PR is not a draft; `sender.type != 'Bot'`; the PR author is not `dependabot[bot]` or `lightspeed-docs-bot[bot]`; and the kill-switch variable `vars.QODO_PR_AGENT_ENABLED != 'false'`.
  - **Comment eligibility**: the comment is on a PR (`github.event.issue.pull_request`); `author_association` is `OWNER`, `MEMBER` or `COLLABORATOR`; and the body starts with an **allow-listed** command: `/describe`, `/improve`, `/review`, `/ask`, `/update_changelog`, `/add_docs`, `/help`.
  - **Automatic tools**: `github_action_config.auto_describe = "true"`, `auto_improve = "true"`, `auto_review = "false"`. All three must be set explicitly, because unset means *on*.
- **Rationale**:
  - The upstream runner performs **no commenter permission check**. Any user who can comment could run tools and spend budget. The author-association guard enforces the spec assumption that commands are for maintainers only.
  - The PR-level ignore settings (`ignore_pr_authors`, `ignore_pr_labels`, `ignore_pr_title`) are **not applied by the Action runner**, only by the webhook servers. So exclusions must be expressed as workflow `if:` conditions, which is also how existing workflows do it.
  - The command allow-list enforces the responsibility matrix. `/generate_labels` and `/similar_issue` are excluded (see R7 and R8).
  - Disabling automatic review satisfies FR-010. Review stays available on demand.
- **Alternatives considered**:
  - `synchronize`: this would give re-runs on every push, at a cost the pilot shouldn't carry. Deferred; it can be switched on later through `handle_push_trigger`.
  - No command allow-list: that would allow label and similar-issue commands that break FR-008 or can't run (R8). Rejected.

## R6. Fork and secret safety

- **Decision**:
  - Use `pull_request`, **not** `pull_request_target`, for PR events.
  - Never add `actions/checkout`, because Qodo PR-Agent reads the PR through the API.
  - A **preflight** job checks whether the credential is present. If it's missing (fork PRs receive no secrets), it emits `::notice::` and skips the run, so the check never fails (FR-004, FR-006).
  - `issue_comment` runs in the base-repository context. There, the author-association guard is the protection, and no PR code is ever executed because nothing is checked out.
- **Rationale**: This follows the preflight pattern already proven in this repository (archived `project-meta-sync.yml`: check the secret via env → `enabled=false` + `::notice::`). It also follows the upstream warning against checking out code under `pull_request_target`. Fork PRs are rare on this control-plane repository, and a maintainer can still run commands on them through comments.
- **Alternatives considered**: `pull_request_target` with no checkout. This is safe as long as nothing is ever checked out, but it is a known foot-gun if the workflow is edited later. Rejected for the pilot.

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
  - **PR mode**: `--pr_url <url> <tool>`. Needs `GITHUB__USER_TOKEN` plus the model key.
  - **Diff mode**: `--diff-file <file> --output <md> --json-output <json> <tool>`, for review, improve, describe or ask with no GitHub token, e.g. before a PR exists (the internal PR agent's pre-PR self-review).

  It runs the pinned container image by digest (R1) when Docker is available, and otherwise the pinned pip package (`pr-agent==0.46.0`, Python ≥ 3.12).
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
  - **Kill-switch**: the organisation or repository Actions variable `QODO_PR_AGENT_ENABLED = 'false'` short-circuits every job. It needs no commit, and takes effect on the next event (SC-007). Revoking the key is the second-line stop.
- **Rationale**: This reuses the existing metrics action and report locations, and a variable flip is faster than a code change.
- **Alternatives considered**: upstream `[push_outputs]` JSONL/webhook. It's a possible enrichment later, but adds a moving part now. Deferred.

## R12. Testing approach

- **Decision**: Use docs- and config-contract Jest tests in `tests/js/`, following the existing `governance-files.test.js` pattern:
  - Parse `.pr_agent.toml` with `smol-toml` (already a dependency) and assert the governed keys (FR-007/008/009/012).
  - Parse both workflows with `yaml` and assert the digest pin, permissions, guards, allow-list, kill-switch and preflight (FR-003–006, FR-020).
  - Assert that the skill contract and every integrated `AGENT.md`/`SKILL.md` contain an "Qodo PR-Agent integration" section with a fallback statement (FR-013/014).

  End-to-end behaviour is validated manually through [quickstart.md](./quickstart.md) on real pilot PRs. Also run the existing `npm run validate:workflows`, `lint:workflows`, `validate:skills` and `lint:md`.
- **Rationale**: This is how the repository already gates governance files, and it makes the guarantees regression-proof without calling a paid model in CI.
