---
title: "Qodo PR-Agent"
description: "How LightSpeed runs Qodo PR-Agent alongside CodeRabbit: what it does, the maintainer commands, who owns which review concern, operations and opting in."
version: "v0.1.0"
last_updated: "2026-09-24"
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
- Workflows: [`qodo-pr-agent-reusable.yml`](../.github/workflows/qodo-pr-agent-reusable.yml) (the shared definition) and [`qodo-pr-agent.yml`](../.github/workflows/qodo-pr-agent.yml) (this repository's caller)
- Shared skill for agents: [`skills/qodo-pr-agent/`](../skills/qodo-pr-agent/SKILL.md)

## Pinned version

| Version | Image digest | Resolved | Provenance verified |
| --- | --- | --- | --- |
| `0.46.0-github_action` | `sha256:65e5b196e38cecd7df8a71fe29942052e081a0c6645132c2ac874df60b1760c7` | 2026-09-24, from Docker Hub tag metadata and the registry manifest | **Pending**. Run the attestation command in [Upgrading the pinned version](#upgrading-the-pinned-version) before the pilot goes live. |

The workflow and the skill both reference the image **by digest**. Pinning the upstream action by tag or commit would not pin the code that runs, because the action's Dockerfile uses a floating image tag.

## What runs automatically

On a **non-draft** PR opened by a person, when it is opened, reopened or marked ready for review:

| Output | Where it appears |
| --- | --- |
| **Summary**: PR type, summary and walkthrough (`describe`) | One persistent **comment**. The PR body and title are never changed, so the routed PR template stays intact. |
| **Improvement suggestions** (`improve`) | One persistent comment. Nothing is committed. |

Qodo PR-Agent does **not** run on every push, on draft PRs, or on PRs from `dependabot[bot]` or `lightspeed-docs-bot[bot]`. It never posts an automatic review verdict, because that belongs to CodeRabbit.

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
| `/generate_labels` | Qodo PR-Agent never applies labels. Label suggestions reach the labelling agent through the shared skill and are filtered against `.github/labels.yml` ([research R7](../.github/specs/019-qodo-pr-agent-integration/research.md#r7-keeping-governance-intact-labels-descriptions-changelog)). |
| `/similar_issue` | Deferred. The upstream tool is experimental, needs OpenAI embeddings, and isn't included in the Action image ([research R8](../.github/specs/019-qodo-pr-agent-integration/research.md#r8-similar-issues-integration-is-not-viable-in-the-pilot)). |
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
- **Fork PRs**: automatic runs on fork `pull_request` events receive neither secrets nor an OIDC token, so they are skipped with a `fork` notice. A maintainer command on a fork PR is a separate `issue_comment` path: it runs in this repository's context and does use the configured credential, so only run commands on fork PRs you trust.
- **It never blocks a PR.** A missing or invalid credential, a provider rate limit or outage, the kill-switch, or an ineligible event all produce a notice and a successful check. Failed runs are still recorded as `failure` in the run record.
- **It never commits, merges, approves or labels.** The locked keys in `.pr_agent.toml` enforce this, and `tests/js/qodo-pr-agent-config.test.js` asserts them.
- **Configuration is read from the default branch.** A PR cannot change its own review settings.
- **Known limitation**: upstream's fixed headings are in US English, even though the generated text is UK English. If a model call fails part-way, the persistent comment may be incomplete. The check still passes, and `/describe` or `/improve` refreshes it.

## Operations

### Kill-switch

Set the GitHub Actions **variable** `QODO_PR_AGENT_ENABLED` to `false`, at repository or organisation level. It takes effect on the next event, with no commit needed, and every run is skipped with `kill-switch`. Delete the variable, or set it to anything else, to resume.

As a second line of defence, revoke or cap the dedicated key in the Anthropic console.

### Secrets in Qodo PR-Agent comments

This is a known limitation: the model's output can't be guaranteed never to repeat a secret that appears in a PR's changes. The workflow's own logs mask the model credential, but a comment Qodo PR-Agent posts is ordinary PR content. If a comment contains a secret:

1. **Delete the comment.** Any maintainer can do this, and it should be done straight away.
2. **Rotate the exposed secret** wherever it's used. Deleting the comment doesn't undo the exposure, because notifications and caches may already hold a copy.
3. **If it happens again**, set `QODO_PR_AGENT_ENABLED` to `false` (see [Kill-switch](#kill-switch)) and open an issue describing the PR and the kind of secret, without repeating it.

### Credential and spend

There is one way to provide the credential: a stored key.

- **Secret**: the repository secret `ANTHROPIC_API_KEY_QODO_PR_AGENT` for this pilot. It holds a key used **only** by Qodo PR-Agent. A repository that opts in later needs the organisation secret of the same name, with that repository added to its selected repositories; a repository secret does not reach other repositories.
- **Monthly spend limit**: US$50 for the pilot (spec 019, SC-008). Set it on that key in the Anthropic console. The console's usage page gives exact spend.
- **Provisioning**: tracked in [lightspeedwp/.github#3535](https://github.com/lightspeedwp/.github/issues/3535) (task T002).

#### Workload Identity Federation is not configured

Keyless authentication through Workload Identity Federation is **deliberately not part of the pilot**, and nothing in the shipped workflows supports it. It was removed on 2026-10-01 because it required `id-token: write` on the same job that runs the third-party `pragent/pr-agent` container, which gave that container the job's OIDC capability. No job in either workflow holds `id-token: write` now, and no federation input exists.

If it is ever wanted, it must not be added back to the `run` job. It needs **its own job** whose only content is the token exchange, with `id-token: write` on that job and no third-party or untrusted code in it, passing the short-lived token to `run` as a masked output. Treat that as its own change with its own review, and re-check the two findings it was removed for.

### What limits who can run the pilot

The caller triggers on `pull_request` (`opened`, `reopened`, `ready_for_review`) and `issue_comment` (`created`). Those two paths are limited very differently.

| Trigger | Which copy of the workflow runs | What limits it |
| --- | --- | --- |
| `issue_comment` | The **default branch** copy, so a pull request author cannot change the code that runs. | The comment's `author_association` must be `OWNER`, `MEMBER` or `COLLABORATOR`; the command must be allow-listed; the comment must be on a pull request; and any `--section.key=value` token is refused. |
| `pull_request` | The **pull request's** ref, so a branch that edits `qodo-pr-agent-reusable.yml` runs its own version of it. | Not a fork (checked fail-closed, including a deleted fork), not a draft, not a bot sender, not `dependabot[bot]` or `lightspeed-docs-bot[bot]`, and a credential must be present. There is **no** author-association or label gate on this path. |
| Fork `pull_request` | Same as above, but no credential is in scope. | GitHub withholds repository secrets from fork events, and the `fork` check is a second, independent barrier. |

The `pull_request` row is the reason the caller keeps a local `./` reference only temporarily. See [Pin the caller to a commit SHA](#pin-the-caller-to-a-commit-sha).

No further gate was added to the automatic path, and the reason is specific rather than a shrug: the residual actor is someone with **push access to this repository**, and any gate such an actor can satisfy on their own pull request — applying a label, adding themselves to an allow-list — is not a security boundary, because push access already allows editing any workflow here and therefore reading any repository secret. A control that does bound it has to be a review or approval control (branch protection, `CODEOWNERS`), not a workflow condition. A label or actor gate would also contradict spec 019's automatic-run promise and its SC-001 measurement.

### Pin the caller to a commit SHA

`qodo-pr-agent.yml` currently calls the reusable workflow locally:

```yaml
uses: ./.github/workflows/qodo-pr-agent-reusable.yml
```

A commit-SHA pin **cannot** be applied in the pull request that first introduces the workflow, because no trusted ref contains it yet — any SHA written there would 404 or point at the same unreviewed content. Once this lands on `develop`, a follow-up pins the caller to a full commit SHA, matching how `.github/actions/collect-metrics` is already pinned. Tracked in [lightspeedwp/.github#3710](https://github.com/lightspeedwp/.github/issues/3710), which also carries the acceptance criteria and the validation plan.

Until that pin lands, the trigger table above is the accurate statement of the boundary. Do not read the local reference as equivalent to a pinned one. This pilot caller is the only **live** cross-repository reference in this repository that is not pinned: the one other, `.github/actions/collect-metrics`, is pinned to a full commit SHA.

There is also no release tag of this workflow. Consumers are pointed at `@develop`, which tracks the branch; cutting a tag so consumers have an immutable ref is a separate release-policy decision, noted in #3710.

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
3. In **one PR**, update the digest in `.github/workflows/qodo-pr-agent-reusable.yml` and `skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh` (a test checks they match), plus the table above. Add a `CHANGELOG.md` entry.
4. Read the upstream release notes for changes to configuration keys.

## Enable in another repository

Only `lightspeedwp/.github` is enabled in the pilot. These steps are for later opt-in.

1. **Credential**: ask the organisation owner to add the repository to the `ANTHROPIC_API_KEY_QODO_PR_AGENT` organisation secret's selected repositories. The copied caller needs no other permission: it does not request `id-token: write`, and it passes only `model_credential`. If you later want keyless authentication, follow [Workload Identity Federation is not configured](#workload-identity-federation-is-not-configured) rather than adding the federation inputs back.
2. **Workflow**: copy [`.github/workflows/qodo-pr-agent.yml`](../.github/workflows/qodo-pr-agent.yml) into the repository's `.github/workflows/`, and change the `uses:` line to:

   ```yaml
   uses: lightspeedwp/.github/.github/workflows/qodo-pr-agent-reusable.yml@develop
   ```

   The ref must be one where the reusable workflow actually exists. `develop` is this repository's default branch and carries it; `main` does not. A ref is tracked in the URL, so it follows that branch — if the standard must not move under an opt-in, wait for a release tag and use that instead.
3. **Configuration (optional)**: by default the repository inherits this repository's `.pr_agent.toml`. Pass `with: config_ref: <tag>` to load it from a specific ref.
4. **Overrides (optional)**: add a `.pr_agent.toml` at the repository root and follow the rules below. It takes effect once merged to that repository's default branch.
5. **Check**: open a small non-draft PR. Within 10 minutes you should see a summary comment and a suggestions comment, and no label changes. Then comment `/ask What does this change affect?` and expect a reply.

### Overrides

- Put a `# override: <reason>` comment directly above every key you override.
- **Locked** keys can't be overridden: `config.response_language`, `config.enable_custom_labels`, `pr_description.publish_description_as_comment`, `pr_description.publish_labels`, `pr_description.generate_ai_title`, `pr_reviewer.enable_review_labels_security`, `pr_reviewer.enable_review_labels_effort`, `pr_code_suggestions.commitable_code_suggestions` and `pr_update_changelog.push_changelog_changes`. They are marked `# locked:` in `.pr_agent.toml`, and the reusable workflow re-sets them as environment variables, which take precedence over a repository's own `.pr_agent.toml`. An override of a locked key therefore has no effect.
- List every override in the repository's `README.md` or `AGENTS.md`, under a heading **"Qodo PR-Agent overrides"**.
- Never put credentials in `.pr_agent.toml`.
