---
title: "LightSpeed Global AI Rules"
description: "Organisation-wide AI agent rules, coding standards, and contribution guidelines for all LightSpeed WordPress projects."
version: 'v1.8'
last_updated: '2026-06-18'
file_type: "agents-index"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team"]
license: "GPL-3.0"
tags: ["agents", "ai", "coding-standards", "governance", "wordpress"]
domain: "governance"
stability: "stable"
---

# LightSpeed – Global AI Rules (AGENTS.md)

- Use UK English; optimise for clarity, scalability, maintainability and profitable outcomes.
- Prefer minimal, modular solutions; justify heavier tools with return on investment and maintenance cost.
- Follow WordPress Coding Standards (CSS, HTML, JavaScript, PHP) and inline‑documentation standards at all times.
- All code changes must include lint fixes, relevant tests and a short rationale summarising the change.
- Never output secrets. Treat production and customer data as sensitive. Follow the OWASP top 10 for web security.
- Accessibility and performance are non‑negotiable; highlight potential issues during reviews.
- Prefer `theme.json` and block components over bespoke code when feasible to avoid vendor lock‑in.
- When unsure, propose safe defaults and ask **one** focused question to clarify requirements.
- Core instructions consolidated: see `instructions/{languages,documentation-formats,quality-assurance,automation,community-standards}.instructions.md` (mapping in `docs/MIGRATION.md`).
- Canonical instruction reference policy: use `.github/instructions/` for
  repo-local maintenance guidance and `instructions/` for portable standards;
  see `instructions/file-organisation.instructions.md#canonical-instruction-reference-policy`.

## Agent Directory

- Canonical AI source map: [ai/agents.md](ai/agents.md)
- See [Main Agent Index](agents/agent.md) for all agent implementations and specs.
- Each agent must have both a code file (`.js`, `.py`, etc.) and a spec (`.md`) following the template.
- All contributors must follow the org [Coding Standards](instructions/coding-standards.instructions.md).

## Agent Test Status

| Agent | Tests | Notes                        |
| ----- | ----- | ---------------------------- |
| *TBD* | ⏳    | Awaiting test implementation |

> **Note:** As agents are developed and tested, this table will be updated with their status. ✅ indicates passing tests, ❌ indicates failing tests, and ⏳ indicates tests pending implementation.

---

## Branch Governance

All AI agents **must** follow these branching rules before editing files:

1. **Validate the branch name** — run `npm run validate:branch-name -- --branch <name>` before the first edit. The branch must match `{type}/{scope}-{short-title}` format.
2. **Check for branch reuse** — the validation script automatically detects branches that have already been merged. If flagged, create a new branch with a distinct name.
3. **Verify the merge target** — feature/fix/chore branches target `develop`. Only `release/*` and `hotfix/*` may target `main`.
4. **Never use `claude/` as a branch prefix** — this prefix is explicitly forbidden.
5. **Delete branches after merge** — remote and local branches must be cleaned up immediately after a successful squash merge.

See [docs/BRANCHING_STRATEGY.md](docs/BRANCHING_STRATEGY.md) and [CLAUDE.md](CLAUDE.md) for the full policy.

---

## GitHub Template Governance

All AI agents **must** enforce template compliance when creating pull requests and issues. This section provides programmatic guidance.

### Pull Request Templates (Preventative Enforcement)

PR template enforcement is **preventative**—the workflow blocks merges that don't include required sections:

**When creating PRs via `gh pr create`:**

1. Determine the PR type from the branch prefix (`fix/`, `feat/`, `docs/`, etc.)
2. Read the corresponding template from `.github/PULL_REQUEST_TEMPLATE/pr_*.md`
3. Include required sections in the PR body:
   - **Linked issues** — use `Fixes #123` or `Relates to #456`
   - **Changelog** — add entries under `### Fixed`, `### Added`, `### Changed`, `### Removed`
   - **Checklist** — mark items as `[x]` (completed) or `[ ]` (incomplete)
4. The workflow `validate-pr-template.yml` will validate and block merge if sections are missing

**Template locations:**

```
.github/PULL_REQUEST_TEMPLATE/
├── pr_feature.md      ← feat/, design/, a11y/, ux/, i18n/, perf/, research/
├── pr_bug.md          ← fix/, security/
├── pr_hotfix.md       ← hotfix/
├── pr_refactor.md     ← refactor/
├── pr_chore.md        ← chore/, test/, ops/, config/, migrate/, qa/, uat/
├── pr_ci.md           ← ci/, build/
├── pr_dep_update.md   ← deps/
├── pr_docs.md         ← docs/, content/, seo/
├── pr_release.md      ← release/
└── config.yml         ← routing rules
```

### Issue Templates (Reactive Enforcement)

Issue template enforcement is **reactive**—the workflow validates after creation and flags non-compliant issues with `status:needs-more-info`.

**When creating issues via `gh issue create`:**

1. **Determine the issue type** based on the problem:
   - `bug.md` — reproducible defects, errors, crashes
   - `code-refactor.md` — code cleanup, simplification (not user-facing)
   - `feature.md` — new capabilities or user-visible enhancements
   - `design.md` — UI/UX, token, or accessibility design
   - `epic.md` — large, multi-part initiatives
   - `story.md` — user-centric narratives with acceptance criteria
   - `improvement.md` — enhancements to existing functionality
   - `task.md` — scoped work, config updates, small delivery items
   - `chore.md` — small housekeeping (label hygiene, repo tweaks)
   - `testing-coverage.md` — new or refactored automated tests
   - `performance.md` — speed, resource, or latency work
   - `a11y.md` — accessibility compliance (WCAG 2.2 AA)
   - `security.md` — vulnerabilities or hardening
   - `compatibility.md` — cross-version, browser, or platform issues
   - Other types: `build-ci.md`, `automation.md`, `integration-issue.md`, `release.md`, `maintenance.md`, `documentation.md`, `research.md`, `audit.md`, `code-review.md`, `ai-ops.md`, `content-modelling.md`

2. **Read the template file** from `.github/ISSUE_TEMPLATE/{NN}-{type}.md`

3. **Extract required sections** from the template:
   - All issue templates require:
     - `## Definition of Ready (DoR)` — pre-work checklist
     - `## Definition of Done (DoD)` — completion checklist
   - Template-specific sections (e.g., "Describe the bug", "Reproduction", "Expected behavior")

4. **Build the issue body** by:
   - Including all template sections
   - Marking appropriate checklist items as `[x]` (completed)
   - Filling in content for each section
   - Removing placeholder text

5. **Validate before posting:**

   ```javascript
   function validateIssueBody(body) {
     const required = [
       'Definition of Ready (DoR)',
       'Definition of Done (DoD)'
     ];
     return required.every(section => 
       body.includes(`## ${section}`)
     );
   }
   
   if (!validateIssueBody(body)) {
     throw new Error('Missing required template sections: DoR and/or DoD');
   }
   ```

6. **Create the issue** with the validated body:

   ```bash
   gh issue create --title "Title" --body "$body"
   ```

7. **The workflow `template-enforcement.yml` will validate:**
   - If compliant: Issue progresses normally
   - If non-compliant: Gets flagged with `status:needs-more-info` label
   - AI-created issues: Specific automation feedback is added

**Template directory structure:**

```
.github/ISSUE_TEMPLATE/
├── 01-bug.md
├── 02-code-refactor.md
├── 03-feature.md
├── 04-design.md
├── 05-epic.md
├── 06-story.md
├── 07-improvement.md
├── 08-task.md
├── 09-chore.md
├── 10-testing-coverage.md
├── 11-performance.md
├── 12-a11y.md
├── 13-security.md
├── 14-compatibility.md
├── 15-build-ci.md
├── 16-automation.md
├── 17-integration-issue.md
├── 18-release.md
├── 19-maintenance.md
├── 20-documentation.md
├── 21-research.md
├── 22-audit.md
├── 23-code-review.md
├── 24-ai-ops.md
├── 25-content-modelling.md
└── config.yml
```

**Key Enforcement Rules:**

- ✅ Both DoR and DoD sections **must** be present in the body
- ✅ Sections must be visible text (not in HTML comments)
- ✅ Follow the template structure from the issue template file
- ✅ Validate before creation to avoid reactive flagging
- ✅ If flagged with `status:needs-more-info`, update the issue with proper sections

**Example: Creating a bug issue programmatically**

```bash
#!/bin/bash

# Read template
TEMPLATE=$(cat .github/ISSUE_TEMPLATE/01-bug.md)

# Extract DoR and DoD sections
DOR=$(echo "$TEMPLATE" | sed -n '/## Definition of Ready/,/## Definition of Done/p' | head -n -1)
DOD=$(echo "$TEMPLATE" | sed -n '/## Definition of Done/,$p')

# Build issue body with content
BODY="## Describe the bug
The bug description here.

## To Reproduce
1. Step one
2. Step two
3. See error

## Expected behavior
What should happen instead.

## Additional Context
Any other info.

---

$DOR

$DOD"

# Validate
if ! echo "$BODY" | grep -q "Definition of Ready\|Definition of Done"; then
  echo "ERROR: Missing required template sections"
  exit 1
fi

# Create issue
gh issue create --title "Bug title" --body "$BODY"
```

---

## Contribution Guidelines & Indexes

| Area                      | File Reference                                                                                                                 | Notes / Usage                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| **Coding Standards**      | [instructions/coding-standards.instructions.md](instructions/coding-standards.instructions.md)                 | Unified standards for all code                                |
| **File Organisation**     | [instructions/file-organisation.instructions.md](instructions/file-organisation.instructions.md) | Where to create reports, tasks, and project files (CRITICAL)  |
| **Quality Assurance**     | [instructions/quality-assurance.instructions.md](instructions/quality-assurance.instructions.md)               | Testing pyramid, Jest, coverage, CI/CD (3 files consolidated) |
| **Languages & Linting**   | [instructions/languages.instructions.md](instructions/languages.instructions.md)                               | JS/TS, JSON, YAML, JSDoc, linting (4 files consolidated)      |
| **Documentation Formats** | [instructions/documentation-formats.instructions.md](instructions/documentation-formats.instructions.md)       | Markdown, YAML frontmatter, Mermaid (3 files consolidated)    |
| **Automation**            | [instructions/automation.instructions.md](instructions/automation.instructions.md)                             | Agents, labeling, release, metrics (8 files consolidated)     |
| **Community Standards**   | [instructions/community-standards.instructions.md](instructions/community-standards.instructions.md)           | Files, naming, README, replies (4 files consolidated)         |

**Consolidated Instructions (5 Files):**

- **languages.instructions.md** - JS/TS, JSON, YAML, JSDoc, linting (consolidated 4 files)
- **documentation-formats.instructions.md** - Markdown, frontmatter, Mermaid, A11y (consolidated 3 files)
- **quality-assurance.instructions.md** - Testing, Jest, coverage, CI/CD (consolidated 3 files)
- **automation.instructions.md** - Agents, labeling, release, metrics (consolidated 8 files)
- **community-standards.instructions.md** - Files, naming, README, saved replies (consolidated 4 files)

---

## PR Templates

- Use the default PR template: [.github/pull_request_template.md](.github/pull_request_template.md)
- Additional PR templates are available in: [.github/PULL_REQUEST_TEMPLATE/](.github/PULL_REQUEST_TEMPLATE/)
  - Use the template most relevant to your change (e.g. feature, fix, documentation, etc.)

## Template Routing

Use [.github/PULL_REQUEST_TEMPLATE/config.yml](.github/PULL_REQUEST_TEMPLATE/config.yml) as the canonical PR routing map, and keep it aligned with [docs/BRANCHING_STRATEGY.md](docs/BRANCHING_STRATEGY.md) and [docs/PR_CREATION_PROCESS.md](docs/PR_CREATION_PROCESS.md).

### PR Template Selection

| Branch prefix | PR template |
| --- | --- |
| `feat/` | `pr_feature.md` |
| `fix/` | `pr_bug.md` |
| `hotfix/` | `pr_hotfix.md` |
| `refactor/` | `pr_refactor.md` |
| `chore/` | `pr_chore.md` |
| `docs/` | `pr_docs.md` |
| `test/` | `pr_chore.md` |
| `perf/` | `pr_feature.md` |
| `ci/` | `pr_ci.md` |
| `build/` | `pr_ci.md` |
| `deps/` | `pr_dep_update.md` |
| `security/` | `pr_bug.md` |
| `design/` | `pr_feature.md` |
| `a11y/` | `pr_feature.md` |
| `ux/` | `pr_feature.md` |
| `release/` | `pr_release.md` |
| `research/` | `pr_feature.md` |
| `revert/` | `pr_chore.md` |
| `i18n/` | `pr_feature.md` |
| `ops/` | `pr_chore.md` |
| `proto/` | `pr_feature.md` |
| `ds/` | `pr_feature.md` |
| `api/` | `pr_feature.md` |
| `schema/` | `pr_feature.md` |
| `telemetry/` | `pr_feature.md` |
| `content/` | `pr_docs.md` |
| `seo/` | `pr_docs.md` |
| `config/` | `pr_chore.md` |
| `migrate/` | `pr_chore.md` |
| `qa/` | `pr_chore.md` |
| `uat/` | `pr_chore.md` |

### Issue Template Selection

Use [.github/ISSUE_TEMPLATE/config.yml](.github/ISSUE_TEMPLATE/config.yml) and [.github/issue-types.yml](.github/issue-types.yml) as the canonical issue intake source.

- `task` for scoped work, config updates, and small delivery items.
- `bug` for reproducible defects with environment and reproduction details.
- `feature` for new capabilities or user-visible enhancements.
- `design` for UI/UX, token, or accessibility design work.
- `epic` for large, multi-part initiatives grouping stories, features, and tasks.
- `story` for user-centric narratives with acceptance criteria and business value.
- `improvement` for suggested enhancements to existing functionality.
- `chore` for small housekeeping tasks: label hygiene, repo tweaks, file moves.
- `code-refactor` for structured code cleanup without changing external behaviour.
- `build-ci` for build system, CI/CD, and pipeline changes.
- `automation` for workflow automation and tooling.
- `testing-coverage` for new or refactored automated tests.
- `performance` for speed, resource, or latency work.
- `a11y` for accessibility compliance and WCAG 2.2 AA improvements.
- `security` for vulnerabilities or security hardening.
- `compatibility` for cross-version, browser, or platform compatibility issues.
- `integration-issue` for third-party system integration problems.
- `release` for release planning, coordination, and delivery.
- `maintenance` for system maintenance, dependency updates, and housekeeping.
- `documentation` for docs and content updates.
- `research` and `audit` for exploratory or assessment work.
- `code-review` for code quality discussions and review standards.
- `ai-ops` and `content-modelling` for specialist AI and content workflows.

### Saved Replies

Canonical saved replies for common issue/PR/discussion responses live in `.github/SAVED_REPLIES/`. When drafting a comment or response, check whether a saved reply applies before writing from scratch. Replies are organised by context:

- `issues/` — triage, labels, stale, duplicate, escalation responses
- `pull-requests/` — review guidance, blocking, merge readiness
- `technical/` — environment, reproduction, dependency responses
- `workflow/` — branch, release, CI/CD status updates

Use the saved reply content directly or adapt it to the specific context. Do not acknowledge to the user that you are using a saved reply unless asked.

---

## Core Index Instructions

Start here for all key standards:

- [Coding Standards Index](instructions/coding-standards.instructions.md): Unified standards, best practices, and documentation for all LightSpeed projects.
- [Linting Instructions Index](instructions/linting.instructions.md): Primary index and guidance for all linting rules, tools, and file-type-specific standards.

---

## Cross-References & Discoverability

| Resource Name             | Reference                                                        | Purpose / Notes                                                    |
| ------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Instructions Guide**    | [instructions/instructions.instructions.md](instructions/instructions.instructions.md) | Guide for authoring and maintaining instruction files              |
| **Custom Instructions**   | [.github/custom-instructions.md](.github/custom-instructions.md) | Repo-local Copilot instructions and `.github` boundary rules       |
| **Claude Instructions**   | [CLAUDE.md](CLAUDE.md)                                           | Claude-specific project instructions; companion to this file       |
| **Main Agent Index**      | [agents/agent.md](agents/agent.md)                               | Directory of agent specs, stubs, usage, implementation             |
| **Prompts Index**         | [.github/prompts/prompts.md](.github/prompts/prompts.md)         | Legacy prompt index pending skills/cookbook migration              |
| **Instruction Migration** | [docs/MIGRATION.md](docs/MIGRATION.md)                         | Mapping from legacy instruction files to the 5 consolidated guides |

---

## References

- [Contributing Guidelines](CONTRIBUTING.md) - For human contributors
- [Main Documentation](README.md) - Project overview
- [Frontmatter Schema](schema/frontmatter.schema.json) - Schema validation

*This file is the canonical reference for all AI agent rules and coding standards in LightSpeedWP projects.
All contributors, agents, and AI assistants must comply with these standards.*

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
