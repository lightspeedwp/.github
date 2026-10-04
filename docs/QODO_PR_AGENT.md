---
title: "Qodo PR-Agent"
description: "How LightSpeed runs Qodo PR-Agent alongside CodeRabbit: what it does, the maintainer commands, who owns which review concern, operations and opting in."
version: "v0.1.0"
last_updated: "2026-10-01"
file_type: "documentation"
owners: ["lightspeedwp"]
tags: ["ai-ops", "code-review", "qodo-pr-agent", "automation"]
---

# Qodo PR-Agent

Qodo PR-Agent is an open-source AI pull-request assistant ([`The-PR-Agent/pr-agent`](https://github.com/The-PR-Agent/pr-agent), formerly `qodo-ai/pr-agent`; documentation at [`docs.pr-agent.ai`](https://docs.pr-agent.ai/)). LightSpeed runs it in our own GitHub Actions on `lightspeedwp/.github` as a **pilot**, and it **complements CodeRabbit** rather than replacing it.

> [!IMPORTANT]
> Qodo PR-Agent is **not** the internal [`agents/pr-agent/`](../agents/pr-agent/AGENT.md). That is LightSpeed's own agent for creating PRs, validating branch names, routing templates and applying labels. To avoid confusion, we always write "Qodo PR-Agent" for the third-party tool.

- Specification: [`.github/specs/019-qodo-pr-agent-integration/`](../.github/specs/019-qodo-pr-agent-integration/spec.md)
- Configuration: [`.pr_agent.toml`](../.pr_agent.toml)
- Workflows: three files. [`qodo-pr-agent-trigger.yml`](../.github/workflows/qodo-pr-agent-trigger.yml) is the **unprivileged trigger** — the half a pull request author can edit, holding no secret and no write scope. [`qodo-pr-agent.yml`](../.github/workflows/qodo-pr-agent.yml) is the **privileged receiver**, reached by `workflow_run`, which never checks out pull request files and re-reads the pull request and the command comment by id with `issues.getComment` rather than trusting the trigger. [`qodo-pr-agent-reusable.yml`](../.github/workflows/qodo-pr-agent-reusable.yml) is the **shared definition** other repositories call.
- Shared skill for agents: [`skills/qodo-pr-agent/`](../skills/qodo-pr-agent/SKILL.md)

## Pinned version

| Version | Image digest | Resolved | Provenance verified |
| --- | --- | --- | --- |
| `0.46.0-github_action` | `sha256:65e5b196e38cecd7df8a71fe29942052e081a0c6645132c2ac874df60b1760c7` | 2026-09-24 from Docker Hub tag metadata, and **re-confirmed 2026-10-01**: the registry's `docker-content-digest` for the tag is the digest above | **Yes, 2026-10-01**. `gh attestation verify` returns a valid Sigstore bundle for this digest, issued by `https://token.actions.githubusercontent.com` for `The-PR-Agent/pr-agent/.github/workflows/publish.yml@refs/tags/v0.46.0` (workflow run 6627664820) |

The workflow and the skill both reference the image **by digest**. Pinning the upstream action by tag or commit would not pin the code that runs, because the action's Dockerfile uses a floating image tag.

## What runs automatically

On a **non-draft** PR opened by a person, when it is opened, reopened or marked ready for review:

| Output | Where it appears |
| --- | --- |
| **Summary**: PR type, summary and walkthrough (`describe`) | One persistent **comment**. The PR body and title are never changed, so the routed PR template stays intact. |
| **Improvement suggestions** (`improve`) | One persistent comment. Nothing is committed. |

Qodo PR-Agent does **not** run on every push, on draft PRs, or on PRs from `dependabot[bot]` or `lightspeed-docs-bot[bot]`. It never posts an automatic review verdict, because that belongs to human reviewers; CodeRabbit supplies findings, not a verdict.

## Commands

Only repository **owners, members and collaborators** can run commands. Comment on the PR with one of these:

| Command | Use it to |
| --- | --- |
| `/describe` | Refresh the summary comment |
| `/improve` | Refresh the improvement suggestions |
| `/review` | Get an on-demand second-opinion review, with no labels and no verdict |
| `/ask <question>` | Ask a question about the PR's changes |
| `/update_changelog` | Get a proposed `CHANGELOG.md` entry **as a comment**; adopt it only after it passes the changelog rules |
| `/add_docs` | Get suggested documentation for code that is missing it |
| `/help` | List the commands |

### Not available

| Command | Why |
| --- | --- |
| `/generate_labels` | Refused as `command-not-allowed`, and the shared skill cannot return it either, so Qodo PR-Agent offers no label suggestions at all. Labels come from `labeling-unified.yml` and the labelling agent, and are filtered against `.github/labels.yml` ([research R7](../.github/specs/019-qodo-pr-agent-integration/research.md#r7-keeping-governance-intact-labels-descriptions-changelog)). |
| `/similar_issue` | Deferred. The upstream tool is experimental, hard-codes OpenAI embeddings, and needs an optional dependency group the Action image does not install ([research R8](../.github/specs/019-qodo-pr-agent-integration/research.md#r8-similar-issues-integration-is-not-viable-in-the-pilot)). |
| `/config`, other commands | Not allow-listed; they are skipped. |
| Any command with a `--section.key=value` setting | Skipped with `arguments-not-allowed`, `/ask` included, because a setting in a comment would override the locked keys. |

## Who does what

The source of truth is the [responsibility matrix contract](../.github/specs/019-qodo-pr-agent-integration/contracts/responsibility-matrix.md). In short:

| Concern | Owner |
| --- | --- |
| Code review and the review verdict | **CodeRabbit** and human reviewers |
| PR summary and walkthrough | **Qodo PR-Agent** (automatic comment) |
| Improvement suggestions | **Qodo PR-Agent** (automatic comment) |
| Second-opinion review, questions, changelog drafts, docs suggestions | **Qodo PR-Agent** (on demand) |
| Labels, branch names, PR templates, changelog gate | Existing workflows and agents (unchanged) |

### Talking to the bots

- `@coderabbitai review` asks CodeRabbit for a (re-)review. Use it after pushing fixes.
- `/review` asks Qodo PR-Agent for a second opinion. Use it when you want another perspective, not as a replacement.
- Treat Qodo PR-Agent suggestions like any review comment: address each one, or reply with the reason you're not.

## Recognising Qodo PR-Agent feedback

Qodo PR-Agent comments are posted by **`github-actions[bot]`**. Other LightSpeed workflows share that author, so identify Qodo PR-Agent by the header or marker text in the comment body.

> Pilot task T010: record the exact header or marker text from the first live pilot PR here.

Qodo PR-Agent feedback is AI review feedback, and follows the same `FEEDBACK_RESPONSE.md` process as CodeRabbit (see [AI feedback system](./AI_FEEDBACK_SYSTEM_SUMMARY.md)).

## Safety

- **No code is checked out or executed.** Qodo PR-Agent reads the PR through the GitHub API.
- **Fork PRs**: they are skipped with a `fork` notice, checked fail-closed, so a deleted or renamed fork is treated as a fork. A maintainer command on a fork PR is a separate path: it runs in this repository's context and does use the configured credential, so only run commands on fork PRs you trust.
- **It never blocks a PR.** An invalid credential, a provider rate limit or outage, the kill-switch, or an ineligible event all produce a notice and a successful check. Failed runs are still recorded as `failure` in the run record. The privileged receiver runs on `workflow_run`, so even a hard failure there is on the receiver's own run and cannot gate the pull request.
- **A key the environment never released is an error, not a skip.** If the `qodo-pr-agent` environment does not hand over `ANTHROPIC_API_KEY_QODO_PR_AGENT`, the run job exits 1 with an `::error::` naming the ref. That is deliberate: it means the environment's deployment branch policy is wrong, and a quiet skip would hide a broken credential behind a green run. It does not block the pull request.
- **It never commits, merges, approves or labels.** The locked keys in `.pr_agent.toml` enforce this, and `tests/js/qodo-pr-agent-config.test.js` asserts them.
- **Configuration is read from the default branch.** A PR cannot change its own review settings: the ref is a constant `develop` URL, never an event or input value.
- **The key is not reachable from a pull request branch.** The workflow that runs on `pull_request` holds no secret, and the one that holds the key is triggered by `workflow_run`, so GitHub reads its definition from `develop`. See [What limits who can run the pilot](#what-limits-who-can-run-the-pilot).
- **Known limitation**: upstream's fixed headings are in US English, even though the generated text is UK English. If a model call fails part-way, the persistent comment may be incomplete. The check still passes, and `/describe` or `/improve` refreshes it.

## Operations

### Kill-switch

Set the GitHub Actions **variable** `QODO_PR_AGENT_ENABLED` to anything other than exactly `true`, at repository or organisation level. The pilot is opt-in: it runs only while the value is the string `true`, so deleting the variable, setting it to `false`, or setting it to anything else all stop it. Setting it back to exactly `true` resumes the pilot. It takes effect on the next event, with no commit needed, and every run is skipped with `kill-switch`.

As a second line of defence, revoke or cap the dedicated key in the Anthropic console.

### Secrets in Qodo PR-Agent comments

This is a known limitation: the model's output can't be guaranteed never to repeat a secret that appears in a PR's changes. The workflow's own logs mask the model credential, but a comment Qodo PR-Agent posts is ordinary PR content. If a comment contains a secret:

1. **Delete the comment.** Any maintainer can do this, and it should be done straight away.
2. **Rotate the exposed secret** wherever it's used. Deleting the comment doesn't undo the exposure, because notifications and caches may already hold a copy.
3. **If it happens again**, set `QODO_PR_AGENT_ENABLED` to `false` (see [Kill-switch](#kill-switch)) and open an issue describing the PR and the kind of secret, without repeating it.

### Credential and spend

There is one way to provide the credential: a stored key.

- **Secret**: the **environment** secret `ANTHROPIC_API_KEY_QODO_PR_AGENT` on the `qodo-pr-agent` environment. It holds a key used **only** by Qodo PR-Agent. It is deliberately an environment secret and not a repository secret: GitHub passes repository secrets to a same-repository `pull_request` run, so a repository secret is reachable by a pull request author, while an environment secret can be withheld by the environment's deployment branch policy. See [What limits who can run the pilot](#what-limits-who-can-run-the-pilot). A repository that opts in later needs its own environment, because the deployment branch policy is a per-repository setting.
- **Monthly spend limit: US$20** (spec 019, SC-008). The limit is **set on the key in the Anthropic console by a maintainer**, confirmed by the maintainer on 2026-10-02. This repository cannot set it, read it back or verify it — no workflow, script or file under `.github` touches the console — so the console's usage page is the only authoritative record of both the limit and what was actually spent. Because the repository cannot check it, the limit must be **re-confirmed whenever the key is rotated**, and a rotation without that re-confirmation leaves the pilot unbounded in fact.
- **Per-review cost: about US$0.14 for an automatic run — an estimate computed on 2026-10-01 from the cited prices.** The arithmetic, so it can be checked and redone when a price changes:

  | Input | Value | Source |
  | --- | --- | --- |
  | Calls per automatic run | 2 — `describe` then `improve` | the receiver's automatic path |
  | Input tokens per call | ~15,000 | a medium diff plus the locked repo context, at `repo_context_max_lines = 500` |
  | Output tokens per call | ~4,000 | `max_description_tokens = 500` for the description; code suggestions run longer |
  | Input price | US$2 / MTok | [Sonnet 5 pricing](https://platform.claude.com/docs/en/models/sonnet-5/overview) |
  | Output price | US$10 / MTok | same |

  2 × 15,000 = 30,000 input tokens → 30,000 ÷ 1,000,000 × US$2 = **US$0.06**
  2 × 4,000 = 8,000 output tokens → 8,000 ÷ 1,000,000 × US$10 = **US$0.08**
  **Total ≈ US$0.14 per automatic run**, so US$20 covers **roughly 140 automatic runs a month** before the cap bites.

  **This is an estimate, not a measurement.** It assumes a medium-sized pull request; cost scales with the diff, so a large one costs proportionally more. A single on-demand command is one call, so about **US$0.07**. Prompt caching is not credited — a cache read is 10% of the input price — so the real figure may come out lower. The two token counts are the only assumed numbers, and they are what to revisit if actual spend disagrees with this estimate.
- **Second line of defence**: revoke or cap the key in the Anthropic console.
- **Provisioning**: the key is tracked in [lightspeedwp/.github#3535](https://github.com/lightspeedwp/.github/issues/3535) (task T002); the environment and its deployment branch policy are the repository owner's settings, listed in [Validate the credential boundary](#validate-the-credential-boundary).

#### Model and version, as verified

Checked 2026-10-01. Nothing below is inferred; each row says where it came from.

| Item | Value | Source |
| --- | --- | --- |
| Claude Sonnet 5.5, current | id `claude-sonnet-5-5`, alias `claude-sonnet-5-5`, **Active**, retire not sooner than 2027-09-28, 1M context, 128K max output, **US$2 in / US$10 out per MTok**, cache read 10% of input, batch 50% off | [Models overview](https://platform.claude.com/docs/en/models/overview), [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations) |
| Claude Sonnet 5, **in use** | id `claude-sonnet-5`, alias `claude-sonnet-5` (a dateless id is its own alias), **Active**, retire not sooner than 2027-06-30, same price and limits as 5.5. `claude-sonnet-5-5` is a **separate model**, not an alias of this one. Its page marks the generation Legacy — no further updates — and recommends 5.5 | [Sonnet 5 overview](https://platform.claude.com/docs/en/models/sonnet-5/overview) |
| Claude Haiku 4.5, **fallback in use** | id `claude-haiku-4-5-20251001`, alias `claude-haiku-4-5`, **Active and not deprecated**, tentative retirement not sooner than 2026-10-15, 200K context, 64K max output, **US$1 in / US$5 out per MTok** | [Models overview](https://platform.claude.com/docs/en/models/overview), [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations) |
| PR-Agent / Qodo | **v0.46.0**, latest release (2026-09-21) | GitHub releases for `The-PR-Agent/pr-agent` |
| litellm | **1.101.0**, pinned in `uv.lock`; the map is frozen at build time by `LITELLM_LOCAL_MODEL_COST_MAP=True` | `uv.lock`, `docker/Dockerfile` |
| Image | `pragent/pr-agent` `0.46.0-github_action`, pinned by digest `sha256:65e5b196e38cecd7df8a71fe29942052e081a0c6645132c2ac874df60b1760c7` | the receiver step, with the tag beside it |

**Is `claude-sonnet-5` a valid id, and does it reach 5.5?** Both answered from the documentation, 2026-10-01. It is a valid, **Active** id, and its alias is itself: a dateless id from the 4.6 generation on is its own pinned snapshot, so `claude-sonnet-5` resolves to Sonnet 5 and **not** to `claude-sonnet-5-5`. The two are separate models that happen to share a price. What is legacy is the *generation* — its page says Legacy, meaning no further updates, and recommends migrating to 5.5.

**Why the primary is not 5.5 yet.** The image freezes litellm's model map at build time and pins litellm 1.101.0. That bundled map has **29** Claude ids; its newest Sonnet is `claude-sonnet-5` and there is **no `claude-sonnet-5-5` entry**. Naming 5.5 today would leave PR-Agent without cost or token metadata for it, which is why upstream's Dockerfile says new models arrive with a deliberate litellm bump. Moving needs a pr-agent release that bumps litellm, then a new image digest and a fresh provenance check — the upgrade procedure below, not a config edit.

**Nothing needs to change on the fallback today.** `claude-haiku-4-5-20251001` is the exact API id, is in the map, and Anthropic lists it **Active and not deprecated** — the deprecations page lists no replacement for it, because that column is only populated for deprecated models. The 2026-10-15 date is the column headed *tentative retirement date*: a floor on support, "not sooner than", not a deadline. **An earlier note in this file called that a retirement date and treated it as two days away. That was wrong and is corrected here.** There is no replacement id to migrate to today; if the fallback ever must change, the constraint is that the new id must be in the image's frozen map.

**The model is declared once.** `.pr_agent.toml` is the authority, because it is what PR-Agent reads. The run records, this table, the contract, the plan and the tests all restate the id for a human or a report, and `tests/js/qodo-pr-agent-config.test.js` fails if any of them diverges from the authority. The shared skill's runner used to hardcode a model as well; it now passes no `--config.model` at all, so the repository config decides.

**Token limit.** `max_model_tokens = 64000` is the *fallback's* max output rather than the primary's 128000, so a run that falls back mid-flight cannot request more than the fallback supports. Both ids resolve in the frozen map, so `custom_model_max_tokens` — the setting for models litellm does not know — is not used.

#### Workload Identity Federation is not configured

Keyless authentication through Workload Identity Federation is **deliberately not part of the pilot**, and nothing in the shipped workflows supports it. It was removed on 2026-10-01 because it required `id-token: write` on the same job that runs the third-party `pragent/pr-agent` container, which gave that container the job's OIDC capability. No job in any of the three workflows holds `id-token: write` now, and no federation input exists.

If it is ever wanted, it must not be added back to the `run` job. It needs **its own job** whose only content is the token exchange, with `id-token: write` on that job and no third-party or untrusted code in it. It also needs a supported way to hand the short-lived token to `run`: a job output cannot carry it, because GitHub treats a masked value as a secret and does not pass it to downstream jobs. Design that handoff (for example through a short-lived secret store) as part of the change. Treat that as its own change with its own review, and re-check the two findings it was removed for.

### What limits who can run the pilot

The pilot is two workflows. The split is the security boundary, so it is worth being exact about which copy of which file runs.

| Workflow | Trigger | Which copy of the definition runs | What it can reach |
| --- | --- | --- | --- |
| `qodo-pr-agent-trigger.yml` | `pull_request` (`opened`, `reopened`, `ready_for_review`) and `issue_comment` (`created`) | `pull_request` runs the definition at the **pull request's** merge ref. `issue_comment` runs the **default branch** definition. | **Nothing.** No secret, no write scope, no environment. It classifies the event and publishes a request hint. |
| `qodo-pr-agent.yml` | `workflow_run` on the trigger's completion, and `workflow_dispatch` | The **default branch** copy, always. A pull request author cannot change the code that runs. | The model key, through the `qodo-pr-agent` environment, and `pull-requests: write` / `issues: write` on `GITHUB_TOKEN`. |

Both facts were verified on a scratch pull request rather than assumed:

- A `pull_request` run of a branch-only workflow reported `workflow_ref` of `refs/pull/<n>/merge` and a repository secret **present** in its secret context. That is the exposure the split removes.
- A branch edit to an existing `workflow_run` workflow did **not** execute, and that run's `head_sha` was the `develop` tip. That is the boundary the design relies on.

The receiver does not trust the trigger. It downloads the `qodo-pr-agent-signal` artefact, parses it as data, and then re-reads the pull request and the specific comment the trigger named by id through the API. What it checks depends on the request type, and the difference matters when you read a run record. On an **automatic** `pull_request` run it re-checks that the hint names the right pull request, that it is still **open and at the head that run observed**, and that it is not a draft, not by an excluded author and not a fork. On the **maintainer-command** path it resolves the comment by id and re-checks that comment's pull request, command word, the allow-list, the commenter's `author_association` and the refusal of `--section.key=value` tokens; it compares no head SHA there, so a command is not rejected merely because the pull request was pushed to since the comment. Both paths refuse a pull request that is not open. A pull request author who edits the trigger can at worst cause a receiver run that immediately skips.

`workflow_dispatch` is the one trigger that is **not** protected by the default-branch rule, because it runs the definition from the ref you select. It is safe here only because of the environment: a dispatch from a branch the deployment branch policy does not admit cannot start the `run` job, and so cannot read the key. If the environment is ever removed, remove the `workflow_dispatch` trigger with it.

#### Why not `pull_request_target`

`pull_request_target` would also give a default-branch definition, and it is still excluded. Two reasons, and only one of them is the checkout:

- **The event is being withdrawn for public repositories.** GitHub adds a default Actions event policy that blocks `pull_request_target` in public repositories, in evaluate mode now and enforced from **2 November 2026**. This repository is public. The documented exceptions are private or internal repositories and a pre-existing applicable policy; there is no fork-versus-same-repository carve-out. Using it would mean buying a boundary with a five-week shelf life, plus a settings change to revisit.
- **The checkout objection never applied here.** Neither the old design nor this one uses `actions/checkout`, and the original R6 reasoning said so at the time. `actions/checkout` v7 refuses fork pull request code under `pull_request_target` unless `allow-unsafe-pr-checkout` is set, while stating that same-repository pull requests are unaffected — which is a different threat from the one the finding describes.

`workflow_run` is not in the scope of that default policy and its definition is likewise read from the default branch, so the exclusion **stands**: `workflow_run` meets the same goal without relying on a withdrawing event. See [research.md R6](../.github/specs/019-qodo-pr-agent-integration/research.md).

#### Static analysis and the `workflow_run` trade-off

`zizmor --offline --persona regular` over the three pilot workflows reports one unsuppressed finding, `dangerous-triggers` on the receiver's `workflow_run`. That is the trade-off being made deliberately, so it is recorded rather than silenced.

The audit is right about the pattern in general: `workflow_run` hands a privileged run to code that a pull request can influence, and the usual failure is downloading the triggering run's artefact and executing it. This pilot does not do that. The receiver downloads the trigger's `qodo-pr-agent-signal` artefact, **parses it as JSON, and re-derives every field from the API** — the pull request with `pulls.get`, the comment by id with `issues.getComment` — and refuses when the hint does not name the pull request the triggering run was for, or when that pull request has moved on. It never checks out the triggering run, never runs anything from the artefact, and reads the key only in a job whose environment admits the default branch. `tests/js/qodo-pr-agent-workflow.test.js` asserts each of those properties, so the audit cannot be satisfied by accident later.

The alternative trigger, `pull_request_target`, produces the same default-branch definition and would not draw the finding, but it is blocked in public repositories by default from 2 November 2026. Trading an audited-and-tested `workflow_run` for an event with a five-week shelf life is the wrong direction.

#### Why there are no required reviewers

The control that withholds the key until a person approves is an environment with **required reviewers**. It is deliberately not used, because every automatic run would then wait for a human, which contradicts SC-001 (95% of eligible pull requests answered within 10 minutes) and the FR-009 constraint that the pilot never blocks. The environment's **deployment branch policy** is the control used instead: it is automatic, needs no person, and fails closed. The rule is matched against the run's `GITHUB_REF`, and a `pull_request` run's ref is `refs/pull/<n>/merge`, which the policy must not admit.

If the owner later decides a human gate is worth the wait, adding required reviewers to the `qodo-pr-agent` environment is a settings-only change and needs no code edit.

#### The trust boundary, stated plainly

**The boundary is the authority to merge to `develop`.** Anyone who can merge can obtain the key: they change the receiver, and the receiver's definition is read from `develop`. That is unavoidable — a key in CI is reachable by whoever controls the code CI runs — and it is the same trust GitHub already gives push access.

What has changed is that a branch can no longer reach the key *before review*. Branch protection, `CODEOWNERS` and workflow execution protections narrow *who* holds merge authority; they are defence in depth, not the fix, because they govern merging rather than what a run can read. Recommended as an additional control:

- `CODEOWNERS` on `.github/workflows/**` requiring a review from someone other than the author.
- A repository Actions **event policy** with an actor rule, so contributing code and executing privileged workflows are separable. This also gives the 2 November 2026 `pull_request_target` default somewhere to be evaluated deliberately rather than inherited.
- A **GitHub App installation token** with narrowly scoped permissions in place of `GITHUB_TOKEN`, which bounds the blast radius of a stolen token. It does not address this finding and is a follow-up.

The key itself is worth bounding regardless: a per-repository key with a spend cap and a rotation schedule limits what a leak costs and how long it is good for. The US$20 monthly cap is set on the key in the Anthropic console and was confirmed by a maintainer on 2026-10-02, as recorded on [lightspeedwp/.github#3535](https://github.com/lightspeedwp/.github/issues/3535). The repository cannot verify it, so re-confirm it whenever the key is rotated (see [Credential and spend](#credential-and-spend)).

#### Validate the credential boundary

After the environment exists, two runs confirm the gate. Both are read-only checks:

1. Open a scratch pull request that adds a workflow with `environment: qodo-pr-agent`. Its run must fail closed rather than receive the key, because the ref is `refs/pull/<n>/merge`.
2. Trigger one `workflow_dispatch` run on `develop`. It must receive the key and complete.

Delete the scratch branch afterwards.

### Run records and the pilot report

Every eligible event, and every skip that isn't just a normal comment, writes a run record. The record goes to the job summary and to an artefact named `qodo-pr-agent-run-<run id>`, kept for 30 days. The report aggregates those artefacts:

```bash
# The pilot's first day, as recorded in .github/reports/metrics/qodo-pr-agent/pilot-validation.md
PILOT_START=YYYY-MM-DD
GITHUB_TOKEN=<token with actions:read> \
  node scripts/metrics/qodo-pr-agent-report.cjs --since "$PILOT_START" --out .github/reports/metrics/qodo-pr-agent/
```

The [daily report workflow](../.github/workflows/qodo-pr-agent-report.yml) runs this every day at 06:43 UTC for the last 14 days. It publishes the report to the job summary and as an artefact, which satisfies the constitution's daily-metrics rule (Principle X). You can also start it manually, with an optional `since` date.

### Upgrading the pinned version

1. Resolve the new digest: `docker buildx imagetools inspect pragent/pr-agent:<version>-github_action --format '{{.Manifest.Digest}}'`.
2. Verify provenance: `gh attestation verify "oci://index.docker.io/pragent/pr-agent@sha256:<digest>" --repo The-PR-Agent/pr-agent`.
3. In **one PR**, update the digest in all three places that pin it: `.github/workflows/qodo-pr-agent-reusable.yml`, `.github/workflows/qodo-pr-agent.yml` and `skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh` (a test checks they match), plus the table above. Add a `CHANGELOG.md` entry.
4. Read the upstream release notes for changes to configuration keys.

## Enable in another repository

Only `lightspeedwp/.github` is enabled in the pilot. These steps are for later opt-in.

Both files are needed. The split is the security boundary, so copying only the privileged half reintroduces the exposure it removes.

1. **Environment** (a repository setting, so the owner does this): create an environment, for example `qodo-pr-agent`; set **Selected branches and tags** to your default branch only, with **no** `refs/pull/*/merge` pattern and **no** required reviewers; and add `ANTHROPIC_API_KEY_QODO_PR_AGENT` as an **environment** secret on it. A repository secret will not work — it is reachable from a same-repository `pull_request` run.

   Add the **single** bare pattern `develop`, and nothing else. **Corrected 2026-10-02**: this previously instructed adopters to add both `develop` and `refs/heads/develop`, on the reasoning that GitHub does not document whether the rule compares against the bare or the fully qualified `GITHUB_REF`. That uncertainty does not exist in practice: read-only on 2026-10-01 this repository's `qodo-pr-agent` Environment carries exactly one deployment branch policy, name `develop`, type `branch`, and GitHub Actions has run the pilot's `develop`-sourced dispatches through it. One pattern is sufficient and it is what is actually configured. A pattern admitting a pull request ref is what would break the control, so add nothing beyond `develop`. This repository's `github-pages` environment likewise gates on the bare `develop` alone. Confirm with the two runs in [Validate the credential boundary](#validate-the-credential-boundary) before relying on it.
2. **Credential**: the same key, added to that environment. Each repository needs its own environment because the deployment branch policy is a per-repository setting.
3. **Workflows**: copy [`.github/workflows/qodo-pr-agent-trigger.yml`](../.github/workflows/qodo-pr-agent-trigger.yml) and [`.github/workflows/qodo-pr-agent.yml`](../.github/workflows/qodo-pr-agent.yml) into the repository's `.github/workflows/`, keeping both filenames — the receiver's `workflow_run` trigger names the trigger's `name:` value, not a path, so changing either `name:` silently stops the split working.

   The shipped receiver inlines the privileged run, so it works with no cross-repository reference at all. To use the shared run definition instead, **keep the receiver's `preflight` job** (it resolves the request and re-derives it from the API), **delete its inlined `run` and `record` jobs**, and add a `qodo` job that calls the reusable workflow. The reusable workflow runs its own preflight, run and record, so the receiver's `preflight` is the only one left and it is what feeds the call:

   ```yaml
   jobs:
     preflight:
       # unchanged: resolves the request and re-derives it from the API
     qodo:
       needs: preflight
       if: needs.preflight.outputs.enabled == 'true'
       uses: lightspeedwp/.github/.github/workflows/qodo-pr-agent-reusable.yml@<ref>
       with:
         pr_number: ${{ needs.preflight.outputs.pr }}
         command: ${{ needs.preflight.outputs.command }}
         comment_id: ${{ needs.preflight.outputs.comment_id }}
         decision_reason: ${{ needs.preflight.outputs.reason }}
         environment_name: <your environment>
       # No `secrets:` mapping. The reusable `run` job declares the environment,
       # so its environment secret MODEL_CREDENTIAL is the one it reads.
   ```

   Note the `needs:` and the `if:`. The `with:` expressions read `needs.preflight.outputs`, which do not resolve without them, and gating on `enabled` keeps a skipped request from starting a second preflight downstream. There is deliberately no `secrets:` mapping: a calling job cannot read an environment secret, so a mapping could only forward an empty value or a repository secret, and the reusable preflight refuses a visible value as `credential-not-environment-scoped`.

   Two things matter here. The **environment name goes in `with: environment_name:`**, not in an `environment:` key on the calling job: a reusable-workflow call job cannot declare its own environment, and the reusable workflow's own `run` job declares the environment named by that input. And the key is stored on that environment as the **environment** secret `MODEL_CREDENTIAL`, not as `ANTHROPIC_API_KEY_QODO_PR_AGENT`: when a called job declares an environment, GitHub resolves `secrets.model_credential` from that environment's secret of the same name. A repository secret of that name would be reachable from a `pull_request` run, which is what the preflight refusal guards against. The ref must be one where the reusable workflow exists: `develop` is this repository's default branch and carries it; `main` does not. A ref is tracked in the URL, so it follows that branch — if the standard must not move under an opt-in, wait for a release tag.
4. **Keep the triggers as shipped.** The trigger takes `pull_request` and `issue_comment`; the receiver takes `workflow_run` and `workflow_dispatch` and **must not** take `pull_request`, `issue_comment` or `pull_request_target`. Only one of those three would make GitHub read the receiver's definition from the pull request: `pull_request` does, because GitHub uses the pull request's merge ref. `issue_comment` runs the default-branch definition, and `pull_request_target` also runs against the default branch (`GITHUB_REF` and `GITHUB_SHA` are the default branch for both, per GitHub's events table) while additionally carrying a token that can write to the base repository. They are excluded as policy, on their own merits, and because `pull_request_target` is being withdrawn for public repositories — not because they load the pull request's code. Adding any of them would still mean re-reading this boundary. The full list of constraints a caller must satisfy is in [contracts/reusable-workflow.md](../.github/specs/019-qodo-pr-agent-integration/contracts/reusable-workflow.md).
5. **Configuration (optional)**: by default the repository inherits this repository's `.pr_agent.toml` from `develop`. To load it from elsewhere, change the constant `PR_AGENT_EXTRA_CONFIG_URL` in the receiver — as a literal. That is the variable PR-Agent's command-line tool reads; the image's action runner used `CONFIG.EXTRA_CONFIG_URL` for the same setting. Do not build it from an event value: PR-Agent's own `--config-branch` would then let a pull request supply its own configuration.
6. **Overrides (optional)**: add a `.pr_agent.toml` at the repository root and follow the rules below. It takes effect once merged to that repository's default branch.
7. **Check**: open a small non-draft PR. Within 10 minutes you should see a summary comment and a suggestions comment, and no label changes. Then comment `/ask What does this change affect?` and expect a reply.

### Overrides

- Put a `# override: <reason>` comment directly above every key you override.
- **Locked** keys can't be overridden: `config.response_language`, `config.enable_custom_labels`, `pr_description.publish_description_as_comment`, `pr_description.publish_labels`, `pr_description.generate_ai_title`, `pr_reviewer.enable_review_labels_security`, `pr_reviewer.enable_review_labels_effort`, `pr_code_suggestions.commitable_code_suggestions` and `pr_update_changelog.push_changelog_changes`. They are marked `# locked:` in `.pr_agent.toml`, and the reusable workflow re-sets them as environment variables, which take precedence over a repository's own `.pr_agent.toml`. An override of a locked key therefore has no effect.
- List every override in the repository's `README.md` or `AGENTS.md`, under a heading **"Qodo PR-Agent overrides"**.
- Never put credentials in `.pr_agent.toml`.
