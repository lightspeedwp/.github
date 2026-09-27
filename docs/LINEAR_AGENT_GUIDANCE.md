---
file_type: documentation
title: Linear Agent Guidance
description: Canonical agent guidance for Linear Code Intelligence, and how to verify the copy configured in Linear still matches this file.
version: v1.0.0
created_date: '2026-09-27'
last_updated: '2026-09-27'
owners:
  - LightSpeed Team
tags:
  - linear
  - code-intelligence
  - agent-guidance
  - governance
status: active
stability: stable
domain: governance
language: en
---

# Linear Agent Guidance

This file is the **single source of truth** for the agent guidance configured in
Linear for this repository. Linear's Code Intelligence reads the guidance
configured in the Linear workspace, not this file, so the text below has to be
copied into Linear. That copy lives outside version control, which means it
drifts silently.

Two things resolve that:

1. Paste the block below into **Settings → AI & Agents → Agent guidance** (or
   the team-level equivalent).
2. Record the fingerprint in Linear so you can tell when the two have diverged.

```bash
npm run validate:linear-guidance          # validate, print the fingerprint
npm run validate:linear-guidance -- --json
```

The fingerprint is a short digest of the guidance text. Note it in Linear next
to the pasted block, then re-run the validator after any edit here: a different
fingerprint means Linear's copy is stale.

## Why this repository needs explicit guidance

This is a governance and automation control plane. It has no application runtime
and no end-user product. The "product" is the governance plane that configures
the LightSpeedWP GitHub organisation, so a question about "the application" is
usually a question about workflow behaviour, label routing, or agent
instructions.

It is also large. A repository-wide sweep finds **18,693 tracked files**, **405
skill directories**, and **75 agent directories**. Searching that tree blind
produces confident answers with no file paths, so the guidance below names the
indexes to read instead.

## The guidance

Everything between the fences is the payload. The file must contain exactly one
`text` fence, and the validator enforces that.

```text
This repository is a governance and automation control plane for the LightSpeedWP
GitHub organisation. It has no application runtime and no end-user product. The
product is the governance plane: workflows, labels, issue types, agent
instructions, and the automation that keeps them consistent. A question about
"the application" is usually a question about workflow behaviour, label or
issue-type routing, or agent instructions.

SIZE AND SHAPE

18,693 tracked files, 405 skill directories, 75 agent directories, 136 documents.
Never answer by scanning that tree. Read the index that covers the question
first, then open only the specific file it points at.

START HERE, IN THIS ORDER

1. AGENTS.md at the repository root. Canonical rules for every contributor and
   agent: where scripts live, branch naming, locked files, label governance, and
   the testing requirement for new scripts.
2. docs/ARCHITECTURE.md. How the pieces fit together.
3. docs/AGENT-INDEX.md. The index of every agent specification. Use it to find
   the right agent before reading an agent directory.
4. agents/agent.md. The short index and conventions for agent directories.
5. docs/AUTOMATION.md, docs/LABELING.md, docs/BRANCHING_STRATEGY.md,
   docs/AGENT_STANDARDS.md. Topic-specific references.

WHERE THINGS LIVE

- .github/workflows/ - GitHub Actions workflows: CI, labelling, releases, review
  checks, and the metrics aggregator. These carry the repository's own
  permissions and gates.
- .github/rulesets/ - merge rulesets for develop and main.
- .github/labels.yml, .github/issue-types.yml, .github/labeler.yml, CODEOWNERS -
  canonical, manually curated configuration. Locked: changes require human
  approval and are made by hand.
- .github/ISSUE_TEMPLATE/ and .github/PULL_REQUEST_TEMPLATE/ - 26 issue and 19
  pull request templates, routed by branch prefix and issue type. Also locked.
- scripts/ - Node.js tooling. The package is ESM, but helpers consumed by
  actions/github-script are CommonJS .cjs so they can be require()d. Scripts live
  in scripts/{category}/ and never in .github/scripts/, which is reserved for
  GitHub-native governance files.
- agents/, skills/, prompts/, instructions/ - agent and human instruction
  definitions. Most are markdown; some skills ship runnable scripts. Every new
  script needs tests in a matching __tests__/ subdirectory.
- docs/ - documentation, including architecture decision records under docs/ADRs.
- .gitattributes - assigns every tracked file to exactly one Linear review
  category, and normalises line endings. The text=auto rule must stay first.

CONVENTIONS THAT AFFECT ANSWERS

- Tests sit in a __tests__/ directory beside the code they cover, or in tests/.
  Jest is the runner. There is no typecheck script; TypeScript is present only
  as an ESLint parser dependency.
- Executable code is Node.js on Node 24.20.0, pinned by .nvmrc, with npm and a
  committed package-lock.json.
- Documentation is Markdown with YAML frontmatter, validated against
  .schemas/frontmatter.schema.json.
- This repository uses UK English: optimise, colour, behaviour, licence.

ANSWERING ABOUT CHANGE

- A change to a workflow can change permissions, merge gating, or what runs on
  other people's pull requests. Call that out explicitly rather than describing
  it as a routine edit.
- A change to .github/labels.yml, .github/issue-types.yml, the issue templates,
  or the pull request templates requires human approval. Say so; do not present
  it as a normal edit.
- Prefer citing the file path, function name, or commit behind a claim. If the
  evidence is not in the repository, say the answer is uncertain and name what
  would resolve it.

LINEAR INTEGRATION

Pull requests are scored and attributed in Linear. A pull request comment
carries a linear:extension block with a risk score and, when an AI agent wrote
it, the agent and model. The contract lives in
scripts/automation/linear-review-extension.cjs and is documented in
docs/LINEAR_INTEGRATION.md. The risk score is derived deterministically from
changed paths, labels, and diff size; it is never chosen by a model.
Attribution is never guessed, so a comment with no agent is written by CI rather
than by an assistant.
```

## Verifying the Linear copy

The validator is deliberately strict, because the two mistakes that matter here
are both silent:

- **Enterprise-only guidance.** This workspace is on the **Business** plan, where
  the top role is Admin. The workspace **owner** role is Enterprise-only. Guidance
  that tells someone to ask an owner, or that relies on SCIM, audit logs, or
  workspace exports, sends them after settings they cannot reach. The validator
  rejects those references.
- **Stale copies.** The block in Linear cannot be read back through the API, so
  the fingerprint is the only available signal.

```bash
# Validate and print the current fingerprint
npm run validate:linear-guidance

# Machine-readable, for checking against a recorded fingerprint
npm run validate:linear-guidance -- --json
```

## Related

- [`docs/LINEAR_INTEGRATION.md`](LINEAR_INTEGRATION.md) - the full setup and
  operating guide for the Linear integration
- [Code Intelligence](https://linear.app/docs/code-intelligence) - Linear's
  documentation
- [Linear Agent](https://linear.app/docs/linear-agent#guidance) - how guidance is
  scoped
