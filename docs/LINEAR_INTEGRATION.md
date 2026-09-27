---
file_type: documentation
title: Linear Integration
description: Setup and operating guide for the Linear Review Platform, Code Intelligence, and Triage Intelligence in this governance repository.
version: v1.0.0
created_date: '2026-09-26'
last_updated: '2026-09-26'
owners:
  - LightSpeed Team
tags:
  - linear
  - code-review
  - automation
  - governance
status: active
stability: stable
domain: governance
---

# Linear Integration

How this repository uses Linear, and exactly what a workspace Admin has to
switch on. Everything here is scoped to the Linear **Business** plan.

Authoritative source for the integration contract:
<https://linear.app/docs/diffs>.

## Table of Contents

1. [Scope and plan](#scope-and-plan)
2. [Setup](#setup)
3. [Review Platform](#review-platform)
4. [.gitattributes review categories](#gitattributes-review-categories)
5. [Code Intelligence](#code-intelligence)
6. [Triage Intelligence](#triage-intelligence)
7. [Issue status on merge](#issue-status-on-merge)
8. [What is deliberately not wired](#what-is-deliberately-not-wired)
9. [Troubleshooting](#troubleshooting)

## Scope and plan

This integration targets Linear **Business**. Business covers every feature we
use:

| Capability          | What we use it for                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Reviews / Diffs     | Read the diff, comment, approve, request changes, and merge without leaving Linear        |
| Guides              | Guided reviews that group a large PR and explain what each part is for                    |
| Review Platform     | The `riskScore` and `onBehalfOf` plugins described in [Review Platform](#review-platform) |
| Code Intelligence   | Answer "where does X live" questions against this repository                              |
| Triage Intelligence | Suggest labels, teams, and assignees on synced issues                                     |

### Out of scope: Enterprise-only features

The following need the **Enterprise** plan and are deliberately not part of this
integration. Do not plan work that depends on them:

| Feature                             | Why it is out of scope                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| The **workspace owner** role        | Business tops out at Admin, so every instruction below says **workspace Admin**, never **owner** |
| SCIM provisioning                   | Enterprise                                                                                       |
| Audit logs                          | Enterprise                                                                                       |
| Workspace exports                   | Enterprise                                                                                       |
| OAuth app approvals                 | Enterprise                                                                                       |
| Private-team issue sharing          | Enterprise                                                                                       |
| Owner-only "Workspace restrictions" | Enterprise                                                                                       |

Which steps need a **workspace Admin** and which do not:

| Step                                                           | Needs                                                       |
| -------------------------------------------------------------- | ----------------------------------------------------------- |
| Install the GitHub App, grant code access, pick repositories   | **GitHub organisation owner** (GitHub's rule, not Linear's) |
| Enable the integration, Code Intelligence, Triage Intelligence | **Workspace Admin**                                         |
| Connect your own GitHub account, turn on your own code reviews | **You** — self-service, no Admin needed                     |

So a reviewer can be reading and reviewing in Linear on their own without any
Admin involvement. Ask an Admin only for the workspace-level switches.

## Setup

Integration setup has **three independent axes**. Code access is what Diffs and
Reviews need; the **Issues Sync mapping** is a separate switch that decides
whether GitHub issues reach Linear at all. Getting only the first is the most
common reason issues never appear.

| Axis                | Enables                                           | Needed for                                                       |
| ------------------- | ------------------------------------------------- | ---------------------------------------------------------------- |
| App + code access   | Diffs, Reviews, guided reviews, Code Intelligence | Reading files and pull requests in Linear                        |
| **Issues Sync**     | A repository mapped to a Linear team              | GitHub issues reaching Linear, and therefore Triage Intelligence |
| Personal connection | Reviewer identity, mentions, notifications        | Each person acting in Linear                                     |

### Organisation setup (workspace Admin)

1. Install the **Linear** GitHub App on the `lightspeedwp` organisation. This
   must be done by a **GitHub organisation owner** — GitHub will not let a
   non-owner install an app with code access on the organisation.
2. Grant the app **code access** for this repository. Without it Linear cannot
   read file contents, so no diffs appear.
3. Leave **Generate Pull Request guides** on if you want guided reviews.

### GitHub Issues Sync (workspace Admin)

Code access alone does **not** sync issues. Without this mapping, issues opened
in GitHub never reach Linear, and [Triage Intelligence](#triage-intelligence)
never sees them.

In <https://linear.app/settings/integrations/github>, under **GitHub Issues**,
click **+** and choose:

- **Repository**: `lightspeedwp/.github`
- **Linear team**: **GitHub** (`GIT`), which is where the automated issue
  templates and the labelling automation expect their issues to live
- **Direction**: pick deliberately, because it is not symmetric across repos
  - **One-way** — issues created in GitHub create a synced copy in Linear.
    Several repositories may feed one Linear team this way.
  - **Two-way** — issues created in either system create a synced copy in the
    other. **Only one repository can be two-way at a time**, so this is a
    decision about which repository owns the round trip, and it is the wrong
    choice for a governance repository that fans out across many.

This repository is better served by **one-way**, because issues here are
created deliberately through the templates and routed by
`.github/labels.yml`. Two-way would invite issues filed in Linear to reappear
in GitHub and be re-triaged by the labelling agent.

Two constraints worth knowing before you change it:

- Sync applies to **newly created** issues only. Existing issues need the
  [GitHub Issues Importer](https://linear.app/docs/import-issues#github-issues).
- Synced properties are title, description, status, assignee, labels,
  sub-issues, and comments. A comment made outside the synced Linear thread is
  deliberately **not** copied to GitHub, which is what keeps private
  discussions private.

If a synced issue shows a banner reporting an error, follow the banner rather
than re-triggering it. To stop one issue syncing, remove the attachment from
the Linear issue through its overflow menu.

### Personal setup (each reviewer)

1. Connect your personal GitHub account to Linear at
   <https://linear.app/enable-reviews>. Reviewer identity, mentions, and
   notifications all depend on this.
2. Turn on **Settings → Code & reviews → Enable code reviews**. Without this
   toggle the Reviews section does not appear in the sidebar at all.

### IP allow list

If the GitHub organisation uses an IP allow list, a GitHub organisation owner
must add Linear's addresses under
**GitHub → Organization Settings → Security → IP allow list**. Review actions
are performed on behalf of the authenticated GitHub user, so GitHub applies your
allow list even though the app is installed.

```text
35.231.147.226
35.243.134.228
35.196.141.51
34.140.253.14
34.38.87.206
34.62.119.29
34.134.222.122
35.222.25.142
34.60.255.158
```

### Everyday use

- Open a pull request already in Linear by swapping the host in its URL:
  `github.com/owner/repo/pull/123` becomes `linear.review/owner/repo/pull/123`.
- Press `G` then `R` to jump to Linear Code.
- Press `O` then `R` to open a specific review.
- Toggle Unified and Split diff views with `Ctrl` (or `Cmd`) + `B`.

## Review Platform

The Review Platform is how any connected tool attaches metadata to a GitHub
pull request: post an HTML comment containing a `linear:extension` JSON block.
Both plugins below can appear in the **same** block.

### The contract

```html
<!-- linear:extension {
  "version": 1,
  "plugins": [
    { "plugin": "riskScore", "sha": "...", "level": 3, "explanations": ["Touches authentication"] },
    { "plugin": "onBehalfOf", "agent": "claude", "model": "Opus 4.5" }
  ]
} -->
```

**`riskScore`**

| Field          | Required | Constraint                                                            |
| -------------- | -------- | --------------------------------------------------------------------- |
| `level`        | Yes      | Integer `1` (low risk) to `4` (very high risk)                        |
| `sha`          | No       | Exactly 40 hexadecimal characters; omit to score the current revision |
| `explanations` | No       | Up to 8 non-empty strings, each at most 200 characters                |

**`onBehalfOf`**

| Field     | Required | Constraint                                                                               |
| --------- | -------- | ---------------------------------------------------------------------------------------- |
| `agent`   | Yes      | `claude`, `codex`, `linear`, `pi`, or `opencode`. Other values render as a generic agent |
| `model`   | No       | At most 200 characters                                                                   |
| `visible` | No       | Boolean; see below                                                                       |

**`visible` semantics.** Extension-only comments are hidden in Linear by
default. Set `"visible": true` to also surface the comment in Linear's activity
feed. On-behalf-of blocks are visible by default unless `"visible": false` is
set. Put `visible` on each plugin object, not on the block.

### Emitting an attributed comment

Any local AI agent produces the block with one command:

```bash
node scripts/automation/linear-review-extension.cjs --files <paths> --agent claude --model "<model>" --sha <sha>
```

**Prepend it to the comment you already post.** Linear reads the block from a
pull request comment, a review, or a review comment, so it does not need a
comment of its own. Prepending leaves one comment, and editing that comment on
a later push updates the attribution in place.

```bash
node scripts/automation/linear-review-extension.cjs \
  --files "$PR_FILES" --agent claude --model "Opus 4.5" --sha "$PR_SHA" \
  > /tmp/linear-extension.md
# compose your review with that block at the top, then post that one comment
```

`gh pr comment` can also post the block on its own, but it is **create-only** —
it has no update mode, so use it once per pull request rather than once per push,
or it leaves a trail of near-identical comments. The skill
`skills/linear-review-attribution/SKILL.md` has the delete-then-repost variant
for when a standalone comment really is wanted.

`onBehalfOf` is what makes Linear show the agent's name and avatar next to the
comment. The script in `scripts/automation/linear-review-extension.cjs` is the
single source of truth for the contract, so every AI tool in this repository —
Claude Code, opencode, Qodo, CodeRabbit — attributes its comments identically.
Do not hand-write the JSON block; the script validates it and fails loudly on an
out-of-range `level` or a malformed `sha`, because Linear would otherwise
silently ignore an invalid block.

Supported `agent` values: `claude`, `codex`, `linear`, `pi`, `opencode`.

### Risk scoring

The risk level is computed by the emitter from the changed paths, the labels,
and the diff size — no LLM is involved and no model output can influence it.
It starts at level 1 and adds one level per high-risk signal: a category
(GitHub Actions workflows, locked governance config, repository rulesets,
dependency lockfiles, security policy and secret-scanning config,
security-sensitive paths), an escalating label (`priority:critical`,
`type:security`, `area:security`), or a large diff (500 changed lines, or 1500
for two levels). The result is clamped to 1–4.

The workflow `.github/workflows/linear-review-platform.yml` runs the same code on
every pull request targeting `develop`.

**Attribution is never guessed.** On a `pull_request` trigger no agent is
running — the comment is written by GitHub Actions — so the workflow publishes
the risk score with **no** `onBehalfOf` entry rather than naming an agent that
did not write it. `onBehalfOf` comes from the local agent skills, which really
are agents acting for a person. A reusable caller can pass `agent` and `model`
to attribute the comment deliberately.

**`dry_run` behaves differently by trigger**, because a `pull_request` trigger
has no `workflow_call` inputs:

| Trigger         | `dry_run` | Result                                     |
| --------------- | --------- | ------------------------------------------ |
| `pull_request`  | not set   | Publishes the comment                      |
| `workflow_call` | unset     | Logs only (the documented default is true) |
| `workflow_call` | `false`   | Publishes the comment                      |
| `workflow_call` | `true`    | Logs only                                  |

## .gitattributes review categories

Linear reads `.gitattributes` to group files in a pull request diff and to count
**implementation** lines separately from tests and documentation. Choose **File
type** grouping in a pull request to see the result.

| Attribute               | Paths in this repository                                                                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `review-generated`      | `coverage/**`, `node_modules/**`, `website/dist/**`, `logs/**`, `.github/reports/**`, `metrics-artifacts/**`, `package-lock.json`, minified bundles                                                 |
| `review-assets`         | `assets/**`, `website/public/assets/**`, `website/public/fonts/**`, images and fonts                                                                                                                |
| `review-test`           | `**/__tests__/**`, `tests/**`, `*.test.js`, `*.spec.js`, `*.bats`                                                                                                                                   |
| `review-documentation`  | `docs/**`, `cookbook/**`, and every other `*.md`                                                                                                                                                    |
| `review-agent-guidance` | `AGENTS.md`, `CLAUDE.md`, `.github/custom-instructions.md`, `.github/copilot-instructions.md`, `.github/instructions/**`, `agents/**`, `skills/**`, `prompts/**`, `instructions/**`, `workflows/**` |

| `review-localization` | Reserved; no locale trees exist yet |
| `review-implementation` | Everything else — workflows, scripts, config, schemas |

### Why each file gets exactly one category

Linear counts implementation lines as "everything not claimed as something
else", so a file carrying two categories is still counted as implementation and
the split stops working. `.gitattributes` is not last-match-wins overall: Git
resolves **each attribute name independently**, and the last matching rule wins
per name. That means a negation inside a rule only holds until some later rule
sets the attribute again, so negating in place is not enough on its own.

The rule that actually holds is: **the last matching rule sets one category and
clears the other six.** Every rule in the block does exactly that, which is why
it looks repetitive, and it is enforced by a test
(`scripts/automation/__tests__/linear-review-platform-config.test.js`). Two
consequences to keep in mind when editing the file:

- The `* review-implementation` baseline is **first**, not last. Putting it last
  tags every document as both documentation and implementation.
- The blocks run broad to specific, and **tests are last**, so a test bundled
  inside `skills/` or `agents/` is counted as a test rather than as guidance.

`* text=auto` stays at the very top because every later rule assumes
line-ending normalisation has already run.

## Code Intelligence

Code Intelligence gives Linear read access to the repositories connected through
the GitHub integration, so the team can ask how something works without leaving
Linear. Responses are grounded in the code and link back to the files, commits,
and pull requests behind the answer. Because it analyses the codebase rather than
just workspace data, replies can take longer.

**Setup (workspace Admin)**

1. Confirm the GitHub integration is installed with code access for this
   repository.
2. Go to **Settings → AI & Agents → Code Intelligence** and switch it on.

**Repository access is permission-aware.** By default Code Intelligence only
searches repositories the member can already access in GitHub — if someone
cannot reach a repository on GitHub, Code Intelligence will not use it for them.
Admins can also enable **Extend access to all members** to expose technical
context to Support, Sales, and Product without direct repository access. Do not
enable that for this repository without a decision: everything here is
governance configuration, and broadening read access to it broadens access to
the automation that governs the organisation.

### Code Intelligence guidance

The guidance that shapes Code Intelligence's answers lives in its own file so it
can be version-controlled, validated, and fingerprinted:

[`docs/LINEAR_AGENT_GUIDANCE.md`](LINEAR_AGENT_GUIDANCE.md)

That file is the single source of truth. Paste its `text` fence into
**Settings → AI & Agents → Agent guidance**, then record the fingerprint next to
the pasted block:

```bash
npm run validate:linear-guidance
```

Code Intelligence reads the copy configured in Linear, not the file, and that
copy cannot be read back through the API. A different fingerprint means Linear
is answering from stale guidance. The validator is wired into
`npm run validate:all`, so guidance that loses a required topic, or that starts
referring to an Enterprise-only setting this Business workspace cannot act on,
fails the suite rather than shipping quietly.

## Triage Intelligence

Triage Intelligence infers issue properties and relationships with models. It is
enabled by a workspace Admin at **Settings → AI**, which turns it on for every
team; teams where it is not useful can be excluded in that team's own triage
suggestion settings.

> ⚠️ **Read this before enabling it on this organisation.**
>
> Because this repository is mapped to the Linear team through
> [GitHub Issues Sync](#github-issues-sync-workspace-admin), every issue opened
> here also appears in Linear, and Triage Intelligence runs on all of them. An
> auto-applied label does not change the label definitions in
> `.github/labels.yml` — it puts that label **on an issue**, and that is the
> risk. Labels are the routing key for this
> organisation: 158 labels across 8 families and 24 issue types, mirrored into
> organisation settings and consumed by the labeler, metrics, and agent
> routing. A wrong label on an issue steers it to the wrong team and the wrong
> automation, and skews the metrics that report on all of it. A one-off
> mislabel is a five-second fix; a batch of them is a cleanup across 300+
> issues and PRs.

Therefore, when enabling Triage Intelligence:

1. Set every issue property type — team, project, assignee, label — to
   **suggest only, never auto-apply**. No exceptions.
2. Keep **Include suggestions from** scoped to the **GitHub** team, so a
   suggestion never drags in an issue from another team.
3. Treat the workspace-level guidance as read-only history. The locked files are
   the source of truth; a suggestion that conflicts with them is wrong.

Suggestions are advisory by design here: a human still applies the change
through the normal locked-configuration process.

### Running suggestions outside Triage

Triage Intelligence also runs on issues in any other status. Press `Cmd` (or
`Ctrl`) + `K` and search for **Find Suggestions**. The run happens in the
background and enriches the issue when it finishes.

Generating suggestions takes **1–4 minutes**. That latency is expected — Linear
trades speed for quality, and most issues are not triaged faster than that.

## Issue status on merge

Linear can move a linked issue through your workflow as a pull request changes
state. It is a **per-team setting**, so it is configured on the team rather than
in the integration:

**Settings → Team: GitHub → Workflows & automations → Pull request and commit
automations**

The two that matter here:

- **On PR or commit open** → move to the team's first started status
- **On PR or commit merge** → move to the completed status

Two behaviours are worth knowing before you rely on it:

- **An issue still in Triage is skipped.** Triage is a queue for issues nobody
  has picked up, and the automation only applies to issues that have been
  accepted into the workflow. This fails **silently** — nothing in GitHub or
  Linear reports the skip, so a pull request can merge and ship while its
  linked issue stays open. **Move an issue out of Triage before starting work
  on it.**
- **Ready to merge needs a stable check state.** Linear does not fire
  ready-to-merge automations if GitHub reports the pull request as unstable,
  which includes **any** failing check, not only required ones.

## What is deliberately not wired

**Linear Releases — deferred.** Business supports up to 15 release pipelines,
so the feature is available to us. It is not wired because it needs a pipeline
access key secret in our Actions secrets, and because it would duplicate the
existing `changelog-unified.yml` workflow, which already produces the changelog
and GitHub release. Record as a follow-up; wire it only if the GitHub release
flow is retired first.

**A custom bi-directional GraphQL sync — must not be built.** GitHub issue #2234
and #2232, tracked in Linear as GIT-424, planned a bespoke GraphQL sync between
this organisation and Linear. That plan is **superseded** by Linear's official
GitHub App. Building it now would double-write every issue, label, and comment
and fight the app's own sync. Do not implement it; close or supersede those
issues against this document.

## Troubleshooting

| Symptom                                  | Cause and fix                                                                                                                                                                                                                                                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No diffs in Linear                       | Code access was not granted to the repository by a GitHub organisation owner, **or** the reviewer's personal GitHub account is not connected, **or** **Enable code reviews** is off.                                                                                                                      |
| Pull request state looks stale in Linear | A webhook was missed. Make a small edit to the pull request description in GitHub to force a re-sync.                                                                                                                                                                                                     |
| Cannot find Linear Code                  | Press `G` then `R`. If the shortcut does nothing, the personal GitHub account is not connected.                                                                                                                                                                                                           |
| A merged PR left its Linear issue open   | The issue was still in **Triage** when the pull request merged, and the [merge automation](#issue-status-on-merge) skips Triage. The skip is silent. Move the issue to a started or unstarted status and close it by hand.                                                                                |
| GitHub issues never reach Linear         | Code access does not sync issues. The [GitHub Issues Sync](#github-issues-sync-workspace-admin) mapping is a separate switch, off by default. Check <https://linear.app/settings/integrations/github> → **GitHub Issues**.                                                                                |
| Triage suggestions never arrive          | Same cause: no Issues Sync mapping, or the issue predates it, since sync covers newly created issues only.                                                                                                                                                                                                |
| Risk score does not appear               | The comment must be **bot-authored**, must contain the `<!-- lightspeed-linear-review -->` marker, and `level` must be an integer 1–4. Reproduce the block locally with `node scripts/automation/linear-review-extension.cjs --files <paths> --json` and check the `level` and `explanations` it reports. |
| On-behalf-of does not show               | `agent` was not one of `claude`, `codex`, `linear`, `pi`, `opencode`, **or** the comment was a plain comment rather than a `linear:extension` block. This is expected on the workflow's own comment, which is deliberately unattributed.                                                                  |
| Risk level is always 1                   | The emitter only sees what the workflow passes it. Check the job log: a sparse `listFiles` result or missing labels means the signals were never present.                                                                                                                                                 |
| Nothing was written                      | A reusable caller left `dry_run` unset or set it to `true`; set `dry_run: false`. A `pull_request` trigger always publishes.                                                                                                                                                                              |
