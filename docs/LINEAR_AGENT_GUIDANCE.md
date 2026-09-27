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

## Why this guidance exists

It applies to the whole organisation, not just this repository. LightSpeedWP
maintains roughly **315 repositories** with **149 of them PHP-primary**, mostly
WordPress plugins, mu-plugins, and client site enhancements. They do not share
one stack, so the guidance names the repository families and then tells Linear to
read the target repository's own documentation before answering. Applying one
repository's conventions to another produces confidently wrong answers, which is
the failure this is meant to prevent.

`lightspeedwp/.github` gets the most detail because it is a control plane with
no application runtime and no end-user product, so a question about "the
application" there is usually a question about workflow behaviour, label
routing, or agent instructions. It is also the largest: **18,693 tracked
files**, **405 skill directories**, **75 agent directories**, **136 documents**.
Searching that tree blind produces confident answers with no file paths, so the
guidance names the indexes to read instead.

## The guidance

Everything between the fences is the payload. The file must contain exactly one
`text` fence, and the validator enforces that.

```text
LightSpeedWP maintains roughly 315 repositories. They do not share one stack,
so never answer from the assumption that a convention in one repository holds
in another. Identify the repository the question is about, then read that
repository's own documentation before answering.

REPOSITORY FAMILIES

- lightspeedwp/.github - the governance and automation control plane. Community
  health files, GitHub Actions workflows, agent and skill definitions, label
  and issue-type configuration, and issue and pull request templates. It has no
  application runtime. Detailed guidance for it is in its own section below.
- lightspeed-hosting-infra - version-controlled hosting configuration for the
  LightSpeed Plesk servers.
- lightspeed-nexus and lightspeed-nexus-* - one product family. platform holds
  backend AI services including indexing and vector search, components is a
  Svelte and TypeScript frontend library, plugin connects client websites,
  infra holds deployment configuration, runner holds self-hosted Actions runner
  configuration, and nexus holds the documentation and architecture decisions.
- Client site enhancements - nfc-co-za-enhancements, diepapier-enhancements,
  africanfarming-enhancements, sd-enhancements-2026. Site-specific mu-plugins
  and performance fixes, each scoped to one client site.
- Client and product plugins - nova-smart-read, ma-plugin,
  tour-operator-db-updater, ls-flow, and the ls-flow-extension browser
  extension.
- Supporting infrastructure - grounded-docs-infra, dependency-merge-controller,
  and the dependency-merge staging and probe repositories.

The organisation is predominantly PHP, and predominantly WordPress: plugins,
mu-plugins, and site enhancements are the common case. Those repositories
follow WordPress Coding Standards, and their code is version-controlled in git
rather than added to a live site. A small number are TypeScript, shell, or
infrastructure configuration.

CROSS-REPOSITORY RULES

- The organisation uses UK English. Write optimise, colour, behaviour, licence.
- .github holds the shared governance. Its reusable workflows, label and
  issue-type definitions, and templates affect the other repositories, so a
  change there is broader than a change in any single product repository.
- Branch naming across the organisation is {type}/{scope}-{title}, with a fixed
  list of authorised types. Check the repository's own instructions before
  assuming a prefix is valid.
- When a repository has its own AGENTS.md, CONTRIBUTING, or documentation, that
  takes precedence over anything here. Say so rather than substituting a
  general answer.
- Locked configuration is changed by a human through a review, never by an
  agent as a routine edit. In .github that covers .github/labels.yml,
  .github/issue-types.yml, the issue templates, and the pull request templates.
- Prefer citing a file path, function name, or commit behind a claim. If the
  evidence is not in the repository, say the answer is uncertain and name what
  would resolve it.

WHEN THE QUESTION IS ABOUT lightspeedwp/.github

That repository is a control plane, so a question about "the application" there
is usually a question about workflow behaviour, label or issue-type routing, or
agent instructions. It is also large: 18,693 tracked files, 405 skill
directories, 75 agent directories, 136 documents. Read the index that covers
the question first rather than scanning the tree.

- AGENTS.md at the repository root is canonical: where scripts live, branch
  naming, locked files, label governance, and the testing requirement for new
  scripts.
- docs/ARCHITECTURE.md explains how the pieces fit together.
- docs/AGENT-INDEX.md indexes every agent specification. Use it to pick the
  right agent before reading an agent directory.
- agents/agent.md is the short index and the conventions for agent directories.
- docs/AUTOMATION.md, docs/LABELING.md, docs/BRANCHING_STRATEGY.md and
  docs/AGENT_STANDARDS.md are the topic references.

Where things live in that repository:

- .github/workflows/ - GitHub Actions workflows for CI, labelling, releases,
  review checks, and metrics. They carry the repository's own permissions and
  gates, so a change can alter merge gating or what runs on other people's pull
  requests.
- .github/rulesets/ - merge rulesets for develop and main.
- scripts/ - Node.js tooling. The package is ESM, but helpers consumed by
  actions/github-script are CommonJS .cjs so they can be require()d. Scripts live
  in scripts/{category}/ and never in .github/scripts/, which is reserved for
  GitHub-native governance files.
- agents/, skills/, prompts/, instructions/ - agent and human instruction
  definitions, mostly markdown, some shipping runnable scripts.
- docs/ - documentation, including architecture decision records under docs/ADRs.
- .gitattributes - assigns every tracked file to exactly one Linear review
  category and normalises line endings. The text=auto rule must stay first.

Conventions specific to that repository:

- Tests sit in a __tests__/ directory beside the code they cover, or in tests/.
  Jest is the runner. There is no typecheck script; TypeScript is present only
  as an ESLint parser dependency.
- Executable code is Node.js on Node 24.20.0, pinned by .nvmrc, with npm and a
  committed package-lock.json.
- Documentation is Markdown with YAML frontmatter, validated against
  .schemas/frontmatter.schema.json.

Linear integration, if the question is about it:

- Pull requests are scored and attributed in Linear. A pull request comment
  carries a linear:extension block with a risk score and, when an AI agent wrote
  it, the agent and model. The contract lives in
  scripts/automation/linear-review-extension.cjs and is documented in
  docs/LINEAR_INTEGRATION.md. The risk score is derived deterministically from
  changed paths, labels, and diff size, and is never chosen by a model.
- Attribution is never guessed, so a comment with no agent was written by CI
  rather than by an assistant.
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
