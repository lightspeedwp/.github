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

Qodo PR-Agent is an open-source AI pull-request assistant ([`the-pr-agent/pr-agent`](https://github.com/the-pr-agent/pr-agent), formerly `qodo-ai/pr-agent`). LightSpeed runs it in our own GitHub Actions on `lightspeedwp/.github` as a **pilot**, and it **complements CodeRabbit** rather than replacing it.

> [!IMPORTANT]
> Qodo PR-Agent is **not** the internal [`agents/pr-agent/`](../agents/pr-agent/AGENT.md). That is LightSpeed's own agent for creating PRs, validating branch names, routing templates and applying labels. To avoid confusion, we always write "Qodo PR-Agent" for the third-party tool.

- Specification: [`.github/specs/017-qodo-pr-agent-integration/`](../.github/specs/017-qodo-pr-agent-integration/spec.md)
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
| `/generate_labels` | Qodo PR-Agent never applies labels. Label suggestions reach the labelling agent through the shared skill and are filtered against `.github/labels.yml` ([research R7](../.github/specs/017-qodo-pr-agent-integration/research.md#r7-keeping-governance-intact-labels-descriptions-changelog)). |
| `/similar_issue` | Deferred. The upstream tool is experimental, needs OpenAI embeddings, and isn't included in the Action image ([research R8](../.github/specs/017-qodo-pr-agent-integration/research.md#r8-similar-issues-integration-is-not-viable-in-the-pilot)). |
| `/config`, other commands | Not allow-listed; they are skipped. |

## Who does what

The source of truth is the [responsibility matrix contract](../.github/specs/017-qodo-pr-agent-integration/contracts/responsibility-matrix.md). In short:

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
- **Fork PRs** receive no secrets, so they are skipped with a notice. A maintainer can still run commands on them.
- **It never blocks a PR.** A missing or invalid credential, the kill-switch, or an ineligible event all produce a notice and a successful check.
- **It never commits, merges, approves or labels.** The locked keys in `.pr_agent.toml` enforce this, and `tests/js/qodo-pr-agent-config.test.js` asserts them.
- **Configuration is read from the default branch.** A PR cannot change its own review settings.
- **Known limitation**: upstream's fixed headings are in US English, even though the generated text is UK English. If a model call fails part-way, the persistent comment may be incomplete. The check still passes, and `/describe` or `/improve` refreshes it.

## Operations

### Kill-switch

Set the GitHub Actions **variable** `QODO_PR_AGENT_ENABLED` to `false`, at repository or organisation level. It takes effect on the next event, with no commit needed, and every run is skipped with `kill-switch`. Delete the variable, or set it to anything else, to resume.

As a second line of defence, revoke or cap the dedicated key in the Anthropic console.

### Credential and spend

- **Secret**: the organisation secret `ANTHROPIC_API_KEY_QODO_PR_AGENT`. It holds a key used **only** by Qodo PR-Agent, with repository access set to *selected repositories*.
- **Monthly spend limit**: set on that key in the Anthropic console. Its usage page gives exact spend.
- **Provisioning**: requested in [lightspeedwp/.github#3535](https://github.com/lightspeedwp/.github/issues/3535) (task T002).

### Run records and the pilot report

Every eligible event, and every skip that isn't just a normal comment, writes a run record. The record goes to the job summary and to an artefact named `qodo-pr-agent-run-<run id>`, kept for 30 days. The report aggregates those artefacts:

```bash
GITHUB_TOKEN=<token with actions:read> \
  node scripts/metrics/qodo-pr-agent-report.cjs --since 2026-10-01 --out .github/reports/metrics/qodo-pr-agent/
```

The [daily report workflow](../.github/workflows/qodo-pr-agent-report.yml) runs this every day at 06:43 UTC for the last 14 days. It publishes the report to the job summary and as an artefact, which satisfies the constitution's daily-metrics rule (Principle X). You can also start it manually, with an optional `since` date.

### Upgrading the pinned version

1. Resolve the new digest: `docker buildx imagetools inspect pragent/pr-agent:<version>-github_action --format '{{.Manifest.Digest}}'`.
2. Verify provenance: `gh attestation verify "oci://index.docker.io/pragent/pr-agent@sha256:<digest>" --repo The-PR-Agent/pr-agent`.
3. In **one PR**, update the digest in `.github/workflows/qodo-pr-agent-reusable.yml` and `skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh` (a test checks they match), plus the table above. Add a `CHANGELOG.md` entry.
4. Read the upstream release notes for changes to configuration keys.

## Enable in another repository

Only `lightspeedwp/.github` is enabled in the pilot. These steps are for later opt-in.

1. **Credential**: ask the organisation owner to add the repository to the `ANTHROPIC_API_KEY_QODO_PR_AGENT` secret's selected repositories.
2. **Workflow**: copy [`.github/workflows/qodo-pr-agent.yml`](../.github/workflows/qodo-pr-agent.yml) into the repository's `.github/workflows/`, and change the `uses:` line to:

   ```yaml
   uses: lightspeedwp/.github/.github/workflows/qodo-pr-agent-reusable.yml@main
   ```

   `@main` follows the released organisation standard. Use a release tag instead to pin a version and upgrade deliberately.
3. **Configuration (optional)**: by default the repository inherits this repository's `.pr_agent.toml`. Pass `with: config_ref: <tag>` to load it from a specific ref.
4. **Overrides (optional)**: add a `.pr_agent.toml` at the repository root and follow the rules below. It takes effect once merged to that repository's default branch.
5. **Check**: open a small non-draft PR. Within 10 minutes you should see a summary comment and a suggestions comment, and no label changes. Then comment `/ask What does this change affect?` and expect a reply.

### Overrides

- Put a `# override: <reason>` comment directly above every key you override.
- **Locked** keys can't be overridden: `config.response_language`, `config.enable_custom_labels`, `pr_description.publish_description_as_comment`, `pr_description.publish_labels`, `pr_description.generate_ai_title`, `pr_reviewer.enable_review_labels_security`, `pr_reviewer.enable_review_labels_effort`, `pr_code_suggestions.commitable_code_suggestions` and `pr_update_changelog.push_changelog_changes`. They are marked `# locked:` in `.pr_agent.toml`.
- List every override in the repository's `README.md` or `AGENTS.md`, under a heading **"Qodo PR-Agent overrides"**.
- Never put credentials in `.pr_agent.toml`.
