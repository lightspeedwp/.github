# PR Agent Consolidation & Portability — Planning Brief

*Temporary input file for `/speckit-specify` — not intended to be committed. Source material only.*

# PR Agent Consolidation & Portability — Planning Brief

This is source material for /speckit-specify in lightspeedwp/.github, not the spec itself. It contains four sources that must be reconciled by the resulting spec, not concatenated blindly.

- Source A: the organisation's consolidation requirements (the attached plan document, verbatim)
- Source B: a validated, admin-approved reference implementation from lightspeedwp/ls-theme (kept open as PR #53, not merged, not deleted)
- Source C: an audit of what already exists in lightspeedwp/.github right now
- Source D: verified factual conflicts between B and C that the new spec must resolve, not silently pick a side on
# SOURCE A — Org Consolidation Plan (verbatim, full text)

## Overview

The LightSpeedWP .github repository acts as the organisation's control plane repository for shared GitHub configuration, agent infrastructure, documentation, standards, and reusable workflows.

The current PR-related agent structure should be consolidated so that there is a single, portable pr-agent capable of operating both within the .github repository itself and across other LightSpeedWP organisation repositories.

The goal is to remove duplication, formalise the agent's supporting skills and documentation, introduce testing and linting, and ensure the resulting agent follows the Agent Skills specification.

## 1. Consolidate the PR Agents

The following two agent directories currently overlap in responsibility:

- agents/pr-agent/
- agents/pr-creation-agent/
These should be merged into a single agent.

### Required outcome

Only the following directory should remain: agents/pr-agent/

The pr-creation-agent should no longer exist as a separate agent once its required functionality has been incorporated into pr-agent.

## 2. Merge the Agent Instructions

The contents and relevant behaviour from agents/pr-creation-agent/pr-creation.agent.md should be merged into agents/pr-agent/AGENT.md.

The resulting AGENT.md should become the primary instruction set for the consolidated PR agent.

It should cover both:

- PR creation responsibilities.
- Existing PR-agent responsibilities, including handling PR-related issues and errors.
Care should be taken to remove duplicated or conflicting instructions during the merge rather than simply appending one document to the other.

## 3. Agent Skills Structure

The PR agent already contains a skills directory: agents/pr-agent/skills/

Existing example: agents/pr-agent/skills/handle-pr-errors/SKILL.md

Skills should follow the Agent Skills specification: https://agentskills.io/specification

### Expected skill structure

```
skill-name/
├── SKILL.md
├── scripts/
├── references/
├── assets/
└── ...
```

Where:

- SKILL.md — required metadata and skill instructions.
- scripts/ — optional executable or supporting code.
- references/ — optional supporting documentation.
- assets/ — optional templates and resources.
- Additional directories may be included where appropriate.
A skill's SKILL.md should contain valid metadata such as:

```
---
name: skill-name
description: Description of what the skill does and when the agent should use it.
---
```

Followed by the actual skill instructions.

## 4. Skill Testing

Skills that contain executable logic should include tests. Recommended structure:

```
scripts/
└── __tests__/
```

Testing should be added for applicable scripts to ensure agent functionality remains reliable as the PR agent evolves. Tests should cover important PR-agent behaviours where practical, particularly reusable or deterministic script logic.

## 5. Linting

The PR-agent implementation should include linting for the files it maintains. At minimum, linting should cover:

- Markdown.
- JavaScript.
The intention is to prevent malformed documentation, invalid agent instructions, formatting inconsistencies, and JavaScript errors from entering the shared agent infrastructure.

## 6. Package Configuration

The agent tooling should include the necessary Node/package configuration for its tests and linting. Expected files include: package.json, package-lock.json. These should define the required development dependencies and scripts for testing and linting.

## 7. Changelog

Add and maintain CHANGELOG.md. The changelog should record meaningful changes to the PR agent, its skills, supporting scripts, documentation, and behaviour. This is particularly important because the .github repository acts as the control plane for organisation-wide tooling.

## 8. Agent README

Add README.md. The README should provide an overview of the PR agent and explain:

- Its purpose.
- Its supported use cases.
- Its directory structure.
- Available skills.
- How testing works.
- How linting works.
- How repository documentation is referenced.
- How the agent is intended to be reused across LightSpeedWP repositories.
## 9. Documentation References

The PR agent should make use of the existing organisational documentation rather than duplicating governance rules inside the agent wherever possible. Relevant documentation can be found under docs/.

The agent should specifically identify and reference documentation related to:

- Branching.
- Pull requests.
- Labels.
- Issues.
- Issue and PR title governance.
Relevant document patterns include: docs/BRANCHING_*.md, docs/PR_*.md, docs/LABEL*.md, docs/ISSUE*.md

Specific known documents include: docs/LABELING.md, docs/ISSUE_PR_TITLE_GOVERNANCE.md

### Important wildcard rule

Patterns such as docs/BRANCHING_*.md, docs/PR_*.md, docs/LABEL*.md, docs/ISSUE*.md are file patterns, not literal filenames. The * character is a wildcard.

Any Spec Kit or agent implementation dealing with these references must understand that these patterns mean: "Find the files matching this pattern." It must NOT interpret something such as BRANCHING_*.md as the name of a single file.

## 10. Agent-Specific Documentation

Existing agent-related documentation can be found under docs/agents/. The PR agent should use this area for supporting documentation where appropriate. A dedicated PR-agent documentation area may be used, for example: docs/agents/pr-agent/. This would allow detailed documentation to remain outside the runtime agent instructions while still being available as supporting reference material.

## 11. References Integration

Where appropriate, supporting PR documentation should be exposed to individual skills through their references/ directories. One possible approach is to create references from a PR agent skill to relevant documentation under docs/agents/pr-agent/. A symlink may be used where appropriate so that documentation does not need to be duplicated. This is a possible implementation approach, not a strict requirement.

## 12. Shared Assets

Skills may use an assets/ directory for templates and other reusable resources. One possible improvement is to expose the organisation's existing pull request templates to the PR agent. Existing templates are located under .github/PULL_REQUEST_TEMPLATE/. A symlink from an appropriate assets/ directory to the existing pull request templates could allow the PR agent to use the organisation's canonical templates without maintaining duplicate copies. This should be evaluated as an implementation option rather than treated as mandatory.

## 13. Portability Requirements

The consolidated PR agent must be portable.

### Primary environment

The first and most important target is lightspeedwp/.github. The agent must work correctly inside the .github repository. This repository is the organisation's control plane and therefore serves as the reference implementation and primary development environment for the agent.

### Organisation repositories

The same PR agent should also be usable across LightSpeedWP organisation repositories. It should support repositories such as:

- WordPress block plugin projects.
- WordPress block theme projects.
- Other applicable LightSpeedWP GitHub repositories.
The agent should therefore avoid unnecessary assumptions that only hold true inside the .github repository. Repository-specific behaviour should be detected or configured where necessary.

## 14. Control Plane Principle

The .github repository should be treated as the control plane repository. This means it is the central source for shared organisational:

- GitHub governance.
- Agent definitions.
- Agent skills.
- PR standards.
- Branching standards.
- Label standards.
- Issue and PR title conventions.
- Documentation.
- Shared automation and tooling.
The PR agent should consume and enforce these organisational standards while remaining portable enough to operate inside downstream repositories.

## Proposed Resulting Structure

A possible final structure could resemble:

```
agents/
└── pr-agent/
    ├── AGENT.md
    ├── README.md
    ├── CHANGELOG.md
    ├── package.json
    ├── package-lock.json
    ├── assets/
    │   └── ...
    └── skills/
        ├── handle-pr-errors/
        │   ├── SKILL.md
        │   ├── scripts/
        │   │   └── __tests__/
        │   ├── references/
        │   └── assets/
        └── ...
```

Supporting documentation may live under:

```
docs/
├── agents/
│   └── pr-agent/
│       └── ...
├── BRANCHING_*.md
├── PR_*.md
├── LABEL*.md
├── ISSUE*.md
├── LABELING.md
└── ISSUE_PR_TITLE_GOVERNANCE.md
```

## Implementation Requirements Summary

The completed work should result in:

- 1. pr-agent being the single PR-related agent.
- 2. pr-creation-agent functionality being incorporated into pr-agent.
- 3. pr-creation.agent.md content being appropriately merged into AGENT.md.
- 4. Agent Skills following the Agent Skills specification.
- 5. Tests being added for applicable executable skill logic.
- 6. Markdown and JavaScript linting being introduced.
- 7. package.json and package-lock.json supporting the required tooling.
- 8. A CHANGELOG.md being maintained.
- 9. A README.md documenting the agent.
- 10. Existing branch, PR, label, issue, and title-governance documentation being reused as references.
- 11. Wildcard document references being treated as patterns rather than literal filenames.
- 12. Potential use of symlinks for shared documentation and PR-template assets being evaluated.
- 13. The agent working first-class inside the .github control plane repository.
- 14. The same agent remaining portable to WordPress block plugin, WordPress block theme, and other LightSpeedWP organisation repositories.
## Core Design Principle

The final PR agent should provide one canonical PR workflow agent backed by central LightSpeedWP governance, rather than maintaining multiple overlapping agents or duplicating standards across repositories.

The .github repository defines the organisational rules; the PR agent consumes those rules and applies them consistently wherever it is used.

## Reference Links (retained as source references for implementation)

- Main agents directory: https://github.com/lightspeedwp/.github/tree/develop/agents
- Existing PR agent: https://github.com/lightspeedwp/.github/tree/develop/agents/pr-agent
- Existing PR creation agent to be merged: https://github.com/lightspeedwp/.github/tree/develop/agents/pr-creation-agent
- pr-creation.agent.md: https://github.com/lightspeedwp/.github/blob/develop/agents/pr-creation-agent/pr-creation.agent.md
- pr-agent/AGENT.md: https://github.com/lightspeedwp/.github/blob/develop/agents/pr-agent/AGENT.md
- PR agent skills directory: https://github.com/lightspeedwp/.github/tree/develop/agents/pr-agent/skills
- Existing handle-pr-errors skill: https://github.com/lightspeedwp/.github/blob/develop/agents/pr-agent/skills/handle-pr-errors/SKILL.md
- Agent Skills specification: https://agentskills.io/specification
- Agent documentation directory: https://github.com/lightspeedwp/.github/tree/develop/docs/agents
- Organisation pull request templates: https://github.com/lightspeedwp/.github/tree/develop/.github/PULL_REQUEST_TEMPLATE
- Main documentation directory: https://github.com/lightspeedwp/.github/tree/develop/docs
- BRANCHING_*.md pattern: https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_*.md
- PR_*.md pattern: https://github.com/lightspeedwp/.github/blob/develop/docs/PR_*.md
- LABEL*.md pattern: https://github.com/lightspeedwp/.github/blob/develop/docs/LABEL*.md
- LABELING.md: https://github.com/lightspeedwp/.github/blob/develop/docs/LABELING.md
- ISSUE_PR_TITLE_GOVERNANCE.md: https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE_PR_TITLE_GOVERNANCE.md
- ISSUE*.md pattern: https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE*.md
# SOURCE B — Validated ls-theme reference implementation (PR #53, kept open, not merged)

Everything in this section comes from lightspeedwp/ls-theme, branch feature/ls-3223-aiops-openspec-plan-new-skills, open as PR #53 against develop. This work went through a full Spec Kit planning cycle and was validated against org guidelines set by an admin. It is authoritative for BEHAVIOR. Source A is authoritative for STRUCTURE/PORTABILITY. Where they conflict, the new spec must flag it, not silently pick one.

## B1. Feature Specification — specs/002-open-pr-skill/spec.md (verbatim)

Feature Specification: Open PR Skill

Feature Branch: feature/ls-3223-aiops-openspec-plan-new-skills. Created: 2026-09-17. Status: Draft.

Input: User description: "An agent skill (open-pr) that creates and updates pull requests for the current branch in the ls-theme repository, callable both via an explicit /open-pr command and via natural-language requests like 'create the PR for me' or 'get this ready for review.' ... [full LightSpeed Pull Request Creation Workflow requirements, see conversation history]"

### Clarifications — Session 2026-09-17

Q: What should the skill do if there's no tool available to actually link the PR back to its Linear/Asana issue? A: Warn and continue — note in its output that this step needs doing manually, but still finish successfully.

### User Story 1 - Open a new PR from a finished branch (Priority: P1)

A contributor has finished work on a branch and wants a pull request opened that accurately reflects what changed, targets the correct base branch, and carries the labels, assignee, and changelog decision required by team convention — without having to manually reconstruct that context or remember every required field.

Why this priority: This is the core value of the skill — every other capability (updating, stacking, drafts) is a variation on this baseline action. Without it, the skill delivers nothing.

Independent Test: Can be fully tested by running the skill on a real branch with committed, pushed changes and confirming a PR is opened with the correct base, an accurate description of the change, an assignee, and exactly one changelog-decision indicator — deliverable and demonstrable on its own.

Acceptance Scenarios:

- 1. Given a branch with committed, pushed changes and no existing open PR, When the skill is run, Then a PR is opened against the correct base branch with a title and description derived from the branch's own commits and diff, an assignee, and exactly one changelog-decision label.
- 2. Given a branch whose name doesn't follow the approved naming convention, When the skill is run, Then the mismatch is flagged to the user before a PR is created, rather than silently proceeding.
- 3. Given a branch whose change exceeds the preferred review-size guidance, When the skill is run, Then the resulting PR clearly notes that it exceeds the preferred size and that it should either be split or have a documented exception.
### User Story 2 - Update an existing PR instead of duplicating it (Priority: P2)

A contributor has pushed additional commits to a branch that already has an open PR, and wants the PR's description and metadata refreshed to reflect the current state of the branch — without losing parts of the existing description that are still accurate, and without ending up with two PRs for the same branch.

Why this priority: Branches are iterated on more often than they're opened fresh; without this, every re-run after User Story 1 would either duplicate PRs or require manual editing, undermining the skill's core promise.

Independent Test: Can be fully tested by running the skill twice against the same branch (once to create, once after adding commits) and confirming the second run updates the original PR in place, preserving accurate prior content and refreshing only what changed.

Acceptance Scenarios:

- 1. Given a branch that already has an open PR, When the skill is run again, Then the existing PR is updated rather than a new one being created.
- 2. Given an existing PR missing its assignee, labels, or changelog-decision indicator, When the skill updates it, Then those are backfilled immediately rather than left for a later pass.
### User Story 3 - Coordinate a stacked set of PRs (Priority: P3)

A contributor is delivering a large change as multiple dependent, independently-reviewable PRs (a "stack"), and wants each PR to clearly show its position in the stack, its dependencies, and to close the originating issue only once the full stack lands — not on an intermediate layer.

Why this priority: This only matters once a change is too large for a single PR (see User Story 1's size guidance); it extends the core flow rather than replacing it, so it's valuable but not required for the skill's baseline usefulness.

Independent Test: Can be fully tested by opening two or more related PRs in sequence and confirming each correctly states its stack position/dependencies, and that only the final layer uses a closing reference to the originating issue.

Acceptance Scenarios:

- 1. Given a PR that is one layer of a multi-layer stacked change, When it is opened, Then its description states its position, the issue/epic it belongs to, its dependencies, and its own review scope — and it references the issue with a non-closing phrase.
- 2. Given a PR that is the final layer completing the originating issue, When it is opened, Then it uses a closing reference so the issue resolves only once that layer merges.
### User Story 4 - Open early as a draft for large or multi-day work (Priority: P4)

A contributor starting large or multi-day work wants to open a PR early, once there's a useful initial diff, to surface architecture decisions and scope problems early — without that draft being treated as a formal request for review.

Why this priority: A refinement on top of User Story 1 for a specific working style; valuable for larger work but not needed for the common case of a finished, ready-to-review change.

Independent Test: Can be fully tested by requesting a draft PR on a branch with a partial diff and confirming it's marked as a draft and does not trigger the ready-for-review steps (CI confirmation, reviewer request, status labelling) until explicitly marked ready later.

Acceptance Scenarios:

- 1. Given a request to open a draft PR, When the skill runs, Then the PR is opened as a draft and the ready-for-review steps are skipped until the user explicitly asks for it to be marked ready.
- 2. Given a draft PR that later needs substantial rework after review has already started on a non-draft PR, When this is detected, Then the user is prompted about returning it to draft rather than the skill deciding unprompted.
### Edge Cases

- What happens when the branch is hotfix/ or a release branch rather than normal development work? The correct base branch is main, not the repository's general default branch, and a follow-up sync back to develop must be flagged rather than silently assumed complete.
- What happens when the current branch name doesn't match any known type-prefix convention, including deliberately-disallowed tool-specific prefixes (e.g. claude/)? The mismatch must be surfaced to the user, not silently ignored.
- What happens when this repository has no PR template configuration at all? The skill falls back to a standard description structure rather than failing.
- What happens when a suggested label (from a template's own defaults) doesn't actually exist in the repository's real label set? The skill must not invent it — it proceeds without that specific label rather than creating one.
- What happens when the skill is invoked by a vague natural-language request rather than an explicit command? It must confirm the intended branch and base with the user before creating or changing anything, rather than acting on an assumption.
- What happens when a lower layer of a stacked PR set needs a fix after a higher layer has already been reviewed? The fix must land in the owning (lower) layer, with the higher layer updated afterward — not patched around from the higher layer.
- What happens when a reviewer requests changes? Every review thread must eventually receive a reply; fixes must not be pushed silently without addressing the thread that prompted them.
### Functional Requirements

- FR-001: The skill MUST derive all pull request content (what changed, why, and any related ticket) from the branch's own commit history and diff, without relying on assumed context from prior conversation.
- FR-002: The skill MUST NOT create branches, and MUST NOT commit or push changes unrelated to the pull request itself, with the sole exception of a changelog update committed after the pull request already exists.
- FR-003: The skill MUST determine the correct base branch according to branch type: standard development branches target the repository's normal integration branch; a hotfix or release branch targets the production branch instead, with any required post-merge synchronization flagged as a manual follow-up rather than performed automatically.
- FR-004: The skill MUST verify the current branch name follows the organization's approved naming convention, and MUST flag a mismatch to the user rather than proceeding silently — including explicitly rejecting tool-specific branch-name prefixes.
- FR-005: The skill MUST check for an already-open pull request on the current branch before creating a new one, updating the existing one instead of creating a duplicate.
- FR-006: The skill MUST calculate the size of the change (files and lines meaningfully subject to review, excluding generated/compiled/lock/snapshot/translation content) and flag when that size exceeds the organization's preferred review-size guidance, escalating to a stronger flag (recommending a stacked set of PRs or a documented exception) beyond a larger threshold.
- FR-007: The skill MUST perform a self-review pass before drafting the pull request, confirming: the full diff (not only individual commits) has been considered; the change remains one coherent, reviewable outcome; it is within the review-size guidance or has a documented exception; applicable automated checks (lint, unit, build, and any others this repository defines) have been run; debugging or unrelated formatting changes have been removed; and, where the repository has automated AI code review enabled, its findings have been considered and responded to.
- FR-008: The skill MUST hold the accessibility bar for this self-review at WCAG 2.2 AA, taking this figure as authoritative even where other repository documentation states an older accessibility standard.
- FR-009: Where this repository defines a pull-request-template routing configuration, the skill MUST use it to select the correct template for the current branch, and MUST follow that template's own structure (title format, section order, and checklist) rather than substituting a different structure.
- FR-010: Where a selected template's own suggested labels do not exist in the repository's actual label set, the skill MUST NOT create or invent them — it proceeds using only labels that genuinely exist.
- FR-011: Where no pull-request-template configuration exists in the repository, the skill MUST fall back to a standard description structure covering: a plain-English summary, grouped subsections of what changed, anything deliberately investigated but not changed, scope and exclusions, visual evidence for user-facing changes, accessibility/performance/backward-compatibility notes where relevant, an optional stack section, a testing summary reflecting only what was genuinely verified, and a stated changelog decision.
- FR-012: The skill MUST set the assignee and all applicable labels — including exactly one changelog-decision indicator (needs an entry vs. does not) — as part of the same action that creates or updates the pull request, never as a separate follow-up step.
- FR-013: The skill MUST add a changelog entry, linked back to the pull request, only after the pull request exists, and only when the changelog-decision indicator states one is required; it must never add that entry beforehand, and must never add one when the indicator says none is needed.
- FR-014: For a pull request that is one layer of a coordinated, multi-layer ("stacked") set, the skill MUST record that PR's position, the issue/epic it belongs to, its dependencies, and its specific review scope, and MUST use a non-closing reference to the originating issue on every layer except the one that actually completes the work.
- FR-015: The skill MUST support opening a pull request as a draft for larger or multi-day work, and MUST NOT perform ready-for-review actions (confirming required checks, requesting a reviewer, applying a review-status indicator) while the pull request remains a draft.
- FR-016: When explicitly marking a pull request ready for review, the skill MUST confirm required automated checks are passing, request an appropriate reviewer, and apply the appropriate review-status indicator. It MUST also link back to the originating tracked work item and note that it should move to an in-review state; if no tool is available to perform that link, the skill MUST warn that this step needs doing manually and still complete successfully, rather than failing or skipping the notice silently.
- FR-017: When updating an existing pull request, the skill MUST read its current description first, preserve any part that remains accurate, and rewrite only what has gone stale — including refreshing what has and hasn't actually been verified.
- FR-018: Once a pull request is under review, the skill's guidance MUST require a reply to every review thread rather than a silent fix, and MUST require that a fix for a defect belonging to a lower layer of a stacked set be made in that owning layer, with layers above it updated afterward — never worked around from a higher layer.
- FR-019: The skill MUST be usable both via an explicit, unambiguous invocation and via a natural-language request describing the same intent; for the latter, it MUST confirm the intended branch and base with the user before creating or changing anything.
- FR-020: The skill MUST never fabricate verification results, metrics, or checks that were not genuinely performed, and MUST never attribute the description of a change to anyone other than the branch's actual author.
### Key Entities

- Pull Request: The reviewable unit this skill creates or updates — has a title, base branch, description, labels (including exactly one changelog-decision indicator), an assignee, and a draft/ready state.
- Branch: The unit of work the pull request represents — has a name (encoding its type/scope), a commit history, and a diff against its base.
- PR Template: An organization-defined structure (title format, sections, checklist) that a pull request should follow when one is configured for the repository, selected according to the branch's type.
- Stack: A coordinated, ordered set of pull requests representing one larger change split into independently reviewable layers, where each member records its position and dependencies relative to the others.
- Changelog Entry: A user-facing record of a change, linked to its pull request, added only when the pull request's changelog-decision indicator requires one.
### Success Criteria — Measurable Outcomes

- SC-001: A contributor can go from "branch is ready" to "pull request opened with correct base, description, assignee, and labels" without manually re-deriving any of that information themselves.
- SC-002: 100% of pull requests opened or updated by this skill carry an assignee and exactly one changelog-decision indicator — none are left with zero or with both.
- SC-003: 0% of pull requests opened by this skill target the wrong base branch for hotfix/release work.
- SC-004: 100% of oversized changes (beyond the organization's stronger size threshold) are clearly flagged as needing a stack or a documented exception, rather than silently opened as a single oversized pull request.
- SC-005: A reviewer opening any pull request produced by this skill can determine, without asking the author, whether it's part of a larger stack and — if so — its position and dependencies.
- SC-006: When a natural-language request is used instead of the explicit command, the user is asked to confirm branch and base before anything is created, in 100% of such invocations.
- SC-007: A changelog entry never appears for a pull request before that pull request exists, and never appears at all when the changelog-decision indicator states one isn't needed.
### Assumptions

- This repository does not currently define a constitutional principle governing branch/PR/changelog conventions (the merged-in project constitution covers styling, reuse, tokens, core blocks, accessibility/security, validation, and PHP discipline, but not this area) — this feature's requirements are instead sourced directly from the LightSpeedWP organization's Pull Request Creation Workflow documentation and the organization's shared PR-template repository, both authoritative outside this repository's own constitution. (Note: this assumption was true when the ls-theme spec was written, but a Principle VIII was added afterward — see Source B10 below.)
- Where this repository's own contributor documentation states an older accessibility standard than WCAG 2.2 AA, the newer organization-wide figure takes precedence for this feature specifically; reconciling that repository documentation itself is out of scope for this feature.
- "Natural-language invocation" is assumed to mean any request that expresses the intent to open, update, or prepare a pull request without using the feature's explicit, unambiguous command form.
- The organization's pull-request-template routing configuration and template files are assumed to already exist within the repository (not fetched from elsewhere at run time) so that this feature has no external network dependency during normal operation.
- Creating any missing labels this feature depends on (such as the changelog-decision indicators) is assumed to be a one-time repository setup concern, not an action this feature performs itself.
## B2. Implementation Plan — specs/002-open-pr-skill/plan.md (verbatim)

Implementation Plan: Open PR Skill. Branch: feature/ls-3223-aiops-openspec-plan-new-skills | Date: 2026-09-17 | Spec: spec.md

### Summary

An agent skill (open-pr) that creates and updates pull requests for the current branch, invocable both explicitly (/open-pr) and via natural language, following this repo's PR conventions plus the LightSpeedWP organization's Pull Request Creation Workflow and shared PR-template repository. Technical approach: a single Markdown SKILL.md file at .claude/skills/open-pr/ containing procedural instructions an agent follows step by step — branch/base validation, review-size and template-routing logic, labels/assignee/changelog handling, and stack/draft/feedback-response behavior — with no runtime code, build step, or external service beyond git/gh and this repository's own files.

### Technical Context

- Language/Version: N/A — the artifact is a Markdown instruction file (SKILL.md) interpreted by an AI coding agent, not compiled/executed code.
- Primary Dependencies: git and the GitHub CLI (gh) for all branch/PR/label operations; this repository's own .github/PULL_REQUEST_TEMPLATE/config.yml and template files for PR structure selection; this repository's contributor guidance (AGENTS.md) for WordPress-specific self-review checks.
- Storage: N/A — no persistent state; all context is re-derived from the branch/repository on each invocation (per spec FR-001).
- Testing: Manual/live verification against a real branch and a real GitHub repository (see quickstart.md) — there is no unit-test framework applicable to a Markdown instruction file; correctness is verified by observing the actual gh pr create/gh pr edit calls and resulting PR state.
- Target Platform: Claude Code (or another agentskills.io-compatible agent) with Bash and gh CLI access, operating inside the ls-theme git repository.
- Project Type: Agent skill (single-file Markdown instruction set) — not a library, service, or application in the traditional sense.
- Performance Goals: N/A — not a running service; success is measured by correctness of the resulting PR, not latency/throughput.
- Constraints: MUST NOT fabricate verification results (spec FR-020); MUST set labels/assignee in the same gh invocation that creates/updates the PR (FR-012); MUST NOT create branches or push unrelated changes (FR-002); MUST confirm branch/base before acting on an implicit (natural-language) invocation (FR-019).
- Scale/Scope: Single repository (ls-theme); one skill file (.claude/skills/open-pr/SKILL.md), expected to remain well under the 500-line/5000-token progressive-disclosure ceiling recommended for agent skills.
### Constitution Check (GATE: must pass before Phase 0 research; re-checked after Phase 1 design)

- I. Theme-First Styling — N/A, this feature touches no theme.json/styles/src/scss; it produces a single Markdown skill file. PASS (N/A).
- II. Reuse Before Create — Applicable in spirit: no existing skill in this repo covers PR creation, so this is genuinely new, not a duplicate. The org's own PR templates (.github/PULL_REQUEST_TEMPLATE/) are reused rather than a bespoke structure invented. PASS.
- III. Token Parity — N/A, no color/spacing/typography tokens involved. PASS (N/A).
- IV. Core Blocks First — N/A, no WordPress blocks involved. PASS (N/A).
- V. Accessibility and Security Non-Negotiables — Partially applicable: the skill enforces a WCAG standard as part of PR self-review (spec FR-008), but produces no PHP output/markup itself, so the escaping/sanitization rules don't apply to the artifact. PASS.
- VI. Validation Before Done — N/A in the literal sense (no PHP/JSON produced to lint/validate), but the same spirit is honored via quickstart.md's live-verification requirement. PASS.
- VII. PHP Minimalism & Engineering Discipline — Applicable in spirit: keep the skill file itself minimal and targeted, no invented architecture. PASS.
- VIII. Branch, PR & Changelog Discipline — Directly implements this principle: this feature IS the codification of Principle VIII as an executable skill. Spec requirements (FR-003 through FR-020) were derived from, and must stay consistent with, this principle's text. PASS.
No violations requiring justification — Complexity Tracking section is empty. Re-checked after Phase 1 design (data-model.md, contracts/, quickstart.md): no new dependencies, architecture, or source/test directories were introduced by the design artifacts — the gate result above is unchanged.

### Project Structure

Documentation (this feature):

```
specs/002-open-pr-skill/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── open-pr-invocation.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

Source Code (repository root): this feature has no traditional src/tests split — the entire deliverable is one Markdown file consumed by an AI agent, not compiled or executed code. The real, concrete structure:

```
.claude/skills/open-pr/
└── SKILL.md              # The skill: frontmatter (name, description) + full procedural body

.github/PULL_REQUEST_TEMPLATE/
├── config.yml             # Already present (added in a prior change) — branch-prefix routing table
└── pr_*.md, README.md      # Already present — org templates the skill's Choosing-a-PR-template
                             # logic reads from; not modified by this feature
```

Structure Decision: Single-file agent skill at .claude/skills/open-pr/SKILL.md, per the design decision already validated in this repository (see "Alternatives considered" in research.md) that this must be a native Claude Code skill location (not .agents/skills/) to get slash-command registration and natural-language auto-invocation. No new source or test directories are introduced.

Complexity Tracking: No Constitution Check violations — this section is intentionally empty.

## B3. Tasks — specs/002-open-pr-skill/tasks.md (verbatim)

Tasks: Open PR Skill. Input: Design documents from /specs/002-open-pr-skill/. Prerequisites: plan.md, spec.md, research.md, data-model.md, contracts/open-pr-invocation.md, quickstart.md — all present.

Tests: Not requested for this feature. Verification instead uses the 7 live scenarios in quickstart.md (running the actual skill against real branches/PRs), since there is no unit-test framework applicable to a Markdown instruction file.

Organization: Tasks are grouped by user story (from spec.md) to enable independent implementation and testing of each story. All implementation tasks target the same single file, .claude/skills/open-pr/SKILL.md — noted explicitly where this constrains parallelism.

Context found while planning: .claude/skills/open-pr/SKILL.md already exists on this branch (built earlier via the OpenSpec workflow, before this feature switched planning tools to Spec Kit), but its content predates every LightSpeed-doc/org-template refinement made afterward to the validated personal command file. The tasks below sync SKILL.md to match that finalized content — this is an update, not a from-scratch build.

### Phase 1: Setup

- [X] T001 Verify .claude/skills/open-pr/SKILL.md frontmatter matches spec: name: open-pr, and a description covering both explicit and natural-language trigger phrasing per FR-019, under the 1024-character agentskills.io limit.
### Phase 2: Foundational (Blocking Prerequisites)

Purpose: Core content every user story depends on — context gathering, pre-flight checks, and base-branch/naming logic. No user story's PR can be created or updated correctly until this phase is synced. CRITICAL: No user story work can begin until this phase is complete.

- [X] T002 Sync "Step 1: Gather context from the branch itself" (commit/diff/ticket derivation, FR-001) into SKILL.md.
- [X] T003 Sync Step 2 pre-flight checks 1-4, 6-7 (branch/push state, existing-PR check, merged-PR convention check, real label set, changelog-requirement check, lint/test run per FR-005, FR-020) into SKILL.md.
- [X] T004 Sync the branch-type base-branch logic (Step 2.5: develop for normal work, main for hotfix/release with sync-back flagged, per FR-003 and data-model.md's Branch entity) into SKILL.md.
- [X] T005 Sync branch-naming validation including the stacked-layer-prefix rule (Step 2.8, per FR-004) into SKILL.md.
Checkpoint: Foundation ready — user story sections can now be synced.

### Phase 3: User Story 1 - Open a new PR from a finished branch (Priority: P1) — MVP

Goal: Running the skill on a finished, pushed branch produces a correctly-based, correctly-labeled, correctly-assigned PR in one action.

Independent Test: Run the skill on a real branch with committed, pushed changes and confirm a PR is opened with the correct base, an accurate description, an assignee, and exactly one changelog-decision label (quickstart.md Scenario 1).

- [X] T006 [US1] Sync the review-budget calculation and flagging thresholds (Step 2.9: ~15 files/~400 lines preferred, ~25 files/~800 lines requiring a stack or exception, per FR-006) into SKILL.md.
- [X] T007 [US1] Sync the self-review gate (Step 2.10: coherent-outcome check, budget re-check, build checks, WCAG 2.2 AA, CodeRabbit/AI-review-findings check, per FR-007 and FR-008) into SKILL.md.
- [X] T008 [US1] Sync the "Choosing a PR template" section (config.yml routing lookup, verbatim template structure, label-existence guard, per FR-009 and FR-010, and the PR Template entity in data-model.md) into SKILL.md.
- [X] T009 [US1] Sync the fallback "PR structure" section — all 10 body sections including Scope and exclusions, Screenshots/video, a11y/perf/backcompat notes (per FR-011) — into SKILL.md.
- [X] T010 [US1] Sync the "Creating the PR" section (labels + assignee + exactly one changelog-decision label in the same gh pr create call, per FR-012) into SKILL.md.
- [X] T011 [US1] Sync the "Changelog — after the PR is created" section (gated on meta:needs-changelog, changelog-validation command, per FR-013) into SKILL.md.
- [ ] T012 [P][US1] Run quickstart.md Scenario 1 (explicit invocation creates a compliant PR) against a real branch and confirm all fields per the "Create a new Pull Request" contract.
- [ ] T013 [P][US1] Run quickstart.md Scenario 3 (oversized change is flagged) against a branch exceeding the larger threshold.
- [ ] T014 [P][US1] Run quickstart.md Scenario 6 (natural-language invocation confirms branch/base before acting, per FR-019) and confirm the invocation-guard wording already in SKILL.md's header still matches this behavior.
Checkpoint: User Story 1 fully functional and testable independently — this is the MVP.

### Phase 4: User Story 2 - Update an existing PR instead of duplicating it (Priority: P2)

Goal: Re-running the skill against a branch that already has an open PR updates it in place rather than creating a duplicate, preserving accurate content and backfilling anything missing.

Independent Test: Run the skill twice against the same branch (create, then after adding commits) and confirm the second run updates the original PR (quickstart.md Scenario 2).

- [X] T015 [US2] Sync the "Updating an existing PR" section (read current body first, preserve accurate content, rewrite only what's stale, refresh Test Plan checkboxes, backfill missing labels/assignee/changelog-decision label immediately, per FR-017) into SKILL.md.
- [ ] T016 [US2] Run quickstart.md Scenario 2 (re-run updates instead of duplicating) against a real branch with an existing open PR, confirming the "Update an existing Pull Request" contract.
Checkpoint: User Stories 1 AND 2 both work independently.

### Phase 5: User Story 3 - Coordinate a stacked set of PRs (Priority: P3)

Goal: A PR that's one layer of a multi-layer stack correctly states its position/dependencies and uses the right issue-closing phrasing for its position in the stack.

Independent Test: Open two or more related PRs in sequence and confirm each correctly states its stack position/dependencies, with only the final layer using a closing reference (quickstart.md Scenario 4).

- [X] T017 [US3] Sync the "Stack information" section — the ## Stack template, the 5-PR-per-stack / split-under-an-epic rule, and the Closes/Fixes/Resolves vs. Relates to/Part of phrasing rule (per FR-014 and the Stack entity in data-model.md) — into SKILL.md.
- [ ] T018 [US3] Run quickstart.md Scenario 4 (stacked PR carries position/dependency info, correct closing phrasing) against two related PRs.
Checkpoint: User Stories 1, 2, and 3 all independently functional.

### Phase 6: User Story 4 - Open early as a draft for large or multi-day work (Priority: P4)

Goal: A PR opened as a draft skips ready-for-review actions until explicitly marked ready, and marking ready performs the full CI/reviewer/status/tracked-work-item sequence — warning rather than failing if work-item linking isn't available.

Independent Test: Request a draft PR on a branch with a partial diff and confirm ready-for-review steps are skipped until explicitly requested (quickstart.md Scenario 5).

- [X] T019 [US4] Sync the "Draft PRs" section (draft creation for larger/multi-day work, skipping ready-for-review gating, stack draft sequencing — bottom layer ready first, "return to draft" trigger on substantial rework, per FR-015) into SKILL.md.
- [X] T020 [US4] Sync the "Marking Ready for Review" section (CI confirmation, gh pr ready, reviewer request, status:needs-review, and the Linear/Asana link step that warns and continues rather than blocking when no tool is available, per FR-016 and the 2026-09-17 Clarification) into SKILL.md.
- [ ] T021 [P][US4] Run quickstart.md Scenario 5 (draft PR skips ready-for-review actions) against a partial-diff branch.
- [ ] T022 [P][US4] Run quickstart.md Scenario 7 (missing Linear/Asana tool warns, doesn't block) confirming the "Mark ready for review" contract.
Checkpoint: All four user stories independently functional.

### Phase 7: Polish & Cross-Cutting Concerns

- [X] T023 [P] Sync the "Responding to feedback" section (reply to every review thread, no silent pushes, stacked-PR fix-in-owning-layer + rebase-above, --force-with-lease only, per FR-018) into SKILL.md.
- [X] T024 [P] Sync the full "What NOT to do" list, cross-checked against every FR in spec.md, into SKILL.md.
- [X] T025 Update the location-note comment at the top of SKILL.md to reference specs/002-open-pr-skill/research.md (Decision: Skill location) instead of the now-removed openspec/changes/open-pr-skill/design.md.
- [X] T026 Diff SKILL.md against the validated personal command (~/.claude/commands/open-pr.md) and confirm full content parity, accounting only for the skill-specific frontmatter and location-note additions.
- [ ] T027 Run all 7 quickstart.md scenarios as one final end-to-end pass.
### Dependencies & Execution Order

- Setup (Phase 1): No dependencies — can start immediately.
- Foundational (Phase 2): Depends on Setup — BLOCKS all user stories.
- User Story 1 (Phase 3): Depends on Foundational. No dependency on other stories — this is the MVP.
- User Story 2 (Phase 4): Depends on Foundational and, practically, on User Story 1's PR-creation content existing to have something to update — but is independently testable once synced.
- User Story 3 (Phase 5): Depends on Foundational and User Story 1 (a stack layer is still a PR created via US1's logic, with additional stack fields).
- User Story 4 (Phase 6): Depends on Foundational and User Story 1 (a draft is still created via US1's logic, with the ready-for-review gate added on top).
- Polish (Phase 7): Depends on all four user stories being synced.
Within Each Phase: Sync tasks (editing SKILL.md) are sequential within a phase — they touch the same file and are ordered to match the section order the file already follows. Verification tasks marked [P] within a phase can run in parallel with each other once that phase's sync tasks are done.

Parallel Opportunities: T012, T013, T014 (US1 verification) can run in parallel with each other after T006-T011 are synced. T021, T022 (US4 verification) can run in parallel with each other after T019-T020 are synced. T023, T024 (Polish sync tasks) touch distinct sections and can be done in parallel.

### Implementation Strategy

MVP First (User Story 1 Only): 1. Complete Phase 1: Setup. 2. Complete Phase 2: Foundational (blocks everything else). 3. Complete Phase 3: User Story 1. 4. STOP and VALIDATE: Run quickstart.md Scenarios 1, 3, and 6 independently. 5. At this point, SKILL.md is fully synced for the single-PR happy path — the same milestone the earlier OpenSpec-driven build reached, now re-verified against the finalized LightSpeed-doc requirements.

Incremental Delivery: 1. Setup + Foundational → foundation ready. 2. Add User Story 1 → validate → this is the MVP (matches what PR #53 already needed). 3. Add User Story 2 → validate re-run/update behavior. 4. Add User Story 3 → validate stack behavior. 5. Add User Story 4 → validate draft/ready-for-review behavior. 6. Polish → cross-cutting sections + final full quickstart pass. Each story adds a self-contained section of SKILL.md without requiring the others to be redone.

## B4. Data Model — specs/002-open-pr-skill/data-model.md (verbatim)

This feature has no persistent storage or database — "entities" here are the conceptual objects the skill's instructions reason about, re-derived fresh from git/gh state on every invocation (per spec FR-001), not stored anywhere by the skill itself.

### Pull Request

The reviewable unit this skill creates or updates.

- title — Plain description of what the diff does, or the matched template's title format. Derived from branch commits/diff (FR-001); never fabricated (FR-020).
- base — Target branch. develop for normal work, main for hotfix/release (FR-003).
- body — Description content. Either the matched org template's structure, or the fallback structure (FR-009, FR-011).
- labels — Set of applied labels. Must exist in the repo's real label set (FR-010); must include exactly one changelog-decision label (FR-012).
- assignee — Responsible person. Fixed value (brandonmarshal), set in the same action as creation/update (FR-012).
- draft — Draft vs. ready state. true for large/multi-day work opened early (FR-015); gates whether ready-for-review actions run (FR-016).
- closingReference — Issue-closing phrase, if any. Only present on the stack layer that actually completes the issue (FR-014).
Relationships: A Pull Request references exactly one Branch (1:1 for the PR's own commits), may belong to zero or one Stack, and is described by zero or one PR Template.

### Branch

The unit of work a Pull Request represents.

- name — Branch name. Must match {type}/{scope}-{short-title} with an approved prefix; tool-specific prefixes rejected (FR-004).
- commits — Commit history since base. Read-only source of PR content; never fabricated.
- diff — Changed files/lines vs. base. Used to calculate review-budget size, excluding generated/compiled/lock/snapshot/translation files.
Lifecycle: Assumed to already exist with commits already made — this feature never creates a branch (spec FR-002).

### PR Template

An organization-defined structure a Pull Request should follow, when one is configured.

- routingKey — Branch prefix (or, for tool-specific prefixes, the linked issue's type) used to select a template.
- titleFormat — The template's own title convention.
- sections — The template's own section order/checklist.
- suggestedLabels — Labels the template's frontmatter proposes — only applied if they exist in the repo's real label set (FR-010).
Relationships: Resolved from a Branch's prefix via the repository's routing configuration (.github/PULL_REQUEST_TEMPLATE/config.yml), then applied to a Pull Request.

### Stack

A coordinated, ordered set of Pull Requests representing one larger change split into independently reviewable layers.

- position — This PR's position (e.g. "PR 2 of 4").
- issueOrEpic — The overarching issue/epic reference.
- dependsOn — The PR this layer depends on, if any.
- followedBy — The PR that depends on this layer, if any.
- reviewScope — What this specific layer covers.
Constraints: No more than 5 PRs per stack; larger work splits into multiple stacks under an epic instead. Only the top/completing layer uses a closing reference; every other layer uses a non-closing one (FR-014).

### Changelog Entry

A user-facing record of a change, linked to its Pull Request.

- content — What changed, in user-facing terms — not implementation detail.
- prLink — Reference back to the Pull Request this entry belongs to.
Lifecycle: Created only after the Pull Request already exists (so prLink can be populated), and only when that PR's changelog-decision label requires one (FR-013). Never duplicated across every layer of a stack — the owning/final-delivery layer carries it.

## B5. Research / Decisions — specs/002-open-pr-skill/research.md (verbatim)

No NEEDS CLARIFICATION markers remained in the Technical Context after drafting plan.md — this feature's requirements were fully decided before spec-kit planning began (see spec.md's Assumptions section). This document instead records the key technical decisions already validated in practice, so they're preserved alongside the plan rather than only living in conversation history.

### Decision: Skill location is .claude/skills/open-pr/, not .agents/skills/

Rationale: This repository's own convention (constitution Principle II / AGENTS.md) points portable, cross-tool skills at .agents/skills/. However, Claude Code's native skill discovery and slash-command registration only scans .claude/skills/<name>/SKILL.md — .agents/skills/ content is only read when something explicitly tells an agent to go read it (as happens for wp-block-style-audit). Since this feature has two hard requirements — an explicit /open-pr command and natural-language auto-invocation (spec FR-019) — it needs the native mechanism, which only .claude/skills/ provides.

Alternatives considered: .agents/skills/open-pr/ for consistency with the repo's stated portable-skill convention. Rejected — it would silently break both invocation modes the spec requires. This is a deliberate, scoped exception, not a precedent for all future skills (documented inline in the skill file's own header comment).

### Decision: Auto-invocation stays enabled, with a confirmation guard on implicit triggers

Rationale: Spec FR-019 requires both explicit and natural-language invocation to work. Claude Code's own best-practice guidance recommends disable-model-invocation: true for side-effect operations (this skill opens PRs, assigns people, applies labels) — but that flag would block natural-language triggering entirely, directly contradicting the requirement. The resolution: leave auto-invocation on, but require the skill to confirm target branch and base with the user specifically when triggered implicitly (not via the literal /open-pr command) before running gh pr create.

Alternatives considered: disable-model-invocation: true (slash-only). Rejected as contradicting FR-019. No guard at all on implicit invocation. Rejected as an unacceptable side-effect risk (a vague prompt could silently open/relabel a PR).

### Decision: Follow the matched org PR template verbatim, layering in only what it lacks

Rationale: Spec FR-009/FR-010 require using this repository's .github/PULL_REQUEST_TEMPLATE/config.yml routing table and the matched template's own title/section/checklist structure, rather than a bespoke structure. The org's 20-file template set (already copied into this repo in a prior change) is the authoritative, team-maintained source; substituting a different structure would fragment PR conventions across the LightSpeedWP organization. Sections the spec requires that a given template may lack (Scope and exclusions, Screenshots/video, a11y/perf/backcompat notes, ## Stack, Changelog decision) are layered in additively rather than replacing the template's own sections.

Alternatives considered: A single freeform structure ignoring org templates entirely. Rejected outright per explicit requirement — kept only as the fallback for repositories that have no template configuration at all (spec FR-011), since this skill's underlying command file is also used outside ls-theme.

### Decision: WCAG 2.2 AA for PR self-review, overriding this repo's own older figure

Rationale: The LightSpeedWP organization's Pull Request Creation Workflow and its shared PR-template repository both independently state 2.2 AA as the current standard. This repository's constitution (Principle V) and other contributor docs still reference 2.1 AA. Per explicit decision, the newer org-wide figure takes precedence for PR-review purposes specifically (spec FR-008; constitution Principle VIII notes this precedence and flags the inconsistency with Principle V as a separate, unresolved follow-up rather than silently editing Principle V).

Alternatives considered: Deferring silently to whatever this repo's own docs say. Rejected — would silently regress to an outdated standard the organization has already moved past.

### Decision: Missing Linear/Asana link tooling warns and continues, rather than blocking

Rationale: Resolved directly during /speckit-clarify (see spec.md Clarifications, 2026-09-17). The skill's core value — a correct, well-labeled PR — shouldn't be gated on an unrelated project-management integration being connected in a given session.

Alternatives considered: Fail/block until linked (rejected — too strict, blocks the skill's primary output over a secondary step). Skip silently with no notice (rejected — the manual follow-up would be too easy to forget).

## B6. Quickstart — specs/002-open-pr-skill/quickstart.md (verbatim)

A runnable guide to prove the feature works end-to-end. This is a validation guide, not the implementation itself — see contracts/open-pr-invocation.md for the exact guarantees being checked and data-model.md for the fields referenced below.

### Prerequisites

- The skill file exists at .claude/skills/open-pr/SKILL.md in this repository.
- gh CLI is authenticated against lightspeedwp/ls-theme.
- A branch exists with committed, pushed changes, named per the approved convention (e.g. feat/example-validation-run).
- .github/PULL_REQUEST_TEMPLATE/config.yml and its template files are present (already true in this repo as of a prior change).
### Scenario 1 — Explicit invocation creates a compliant PR (User Story 1)

1. On the prepared branch, run /open-pr. 2. Expected: a PR is opened in one action, with: base branch correct for the branch's type (develop unless it's hotfix/release); title/body following the org template matched by config.yml for this branch's prefix; exactly one of meta:needs-changelog / meta:no-changelog applied; assignee set to brandonmarshal. 3. Verify: gh pr view <number> --json labels,assignees,baseRefName shows all of the above in a single existing PR — not added in a follow-up edit.

### Scenario 2 — Re-running against the same branch updates instead of duplicating (User Story 2)

1. Push an additional commit to the same branch. 2. Run /open-pr again. 3. Expected: gh pr list --head <branch> still shows exactly one PR; its body reflects the new commit; any test-plan checkboxes are refreshed, not left stale.

### Scenario 3 — Oversized change is flagged (Review Budget)

1. On a branch whose diff exceeds ~25 files or ~800 lines, run /open-pr. 2. Expected: the resulting PR body explicitly notes the size and recommends a stacked PR set or a documented maintainer exception — it is not opened silently as a normal-sized PR.

### Scenario 4 — Stacked PR carries position/dependency info (User Story 3)

1. Open two related PRs in sequence representing a two-layer stack, using the natural-language or explicit trigger with stack context provided. 2. Expected: each PR body includes a ## Stack section (position, issue/epic, dependencies, review scope); only the final layer uses a closing reference (Closes/Fixes/Resolves) to the originating issue — the first layer uses Relates to/Part of.

### Scenario 5 — Draft PR skips ready-for-review actions (User Story 4)

1. Request a draft PR on a branch with a partial diff. 2. Expected: the PR is created as a draft; no reviewer request, CI-confirmation, or review-status label is applied until the user explicitly asks for it to be marked ready.

### Scenario 6 — Natural-language invocation confirms before acting

1. Instead of /open-pr, ask in natural language: "create the PR for me." 2. Expected: the skill asks you to confirm the branch and base before creating anything — it does not act on the assumption silently.

### Scenario 7 — Missing Linear/Asana link tool warns, doesn't block

1. In a session/environment with no Linear/Asana integration tool available, mark a PR ready for review. 2. Expected: the skill still completes (CI check, reviewer request, review-status label all still applied), but explicitly notes that linking the work item needs to be done manually.

Pass/fail: All seven scenarios passing constitutes this feature working end-to-end. Any scenario the skill can't yet satisfy should become a tasks.md item during /speckit-tasks.

## B7. Invocation Contract — specs/002-open-pr-skill/contracts/open-pr-invocation.md (verbatim)

This feature has no network API — its "interface" is the agent-invocation contract: what triggers it, what it guarantees on success, and what it must never do regardless of trigger.

### Trigger forms

- Explicit command /open-pr — None (no pre-action requirement) — proceeds directly (spec FR-019).
- Natural-language request ("create the PR for me", "get this ready for review") — MUST confirm target branch and base with the user before creating or changing anything (FR-019).
### Preconditions (checked before any PR is created or modified)

- Current branch is not develop/main, has commits ahead of base, and is pushed to origin.
- No existing open PR for this branch — if one exists, the "Update" contract applies instead of "Create."
- Repository's real label set is known (via gh label list), not assumed.
- Correct base branch is known, by branch type (FR-003).
### Contract: Create a new Pull Request

Given the preconditions above are satisfied and no open PR exists for this branch, When the skill runs, Then it MUST produce, in one atomic action:

- A PR against the correct base branch (FR-003)
- Title and body derived from the branch's own commits/diff (FR-001), following the matched org template if one exists (FR-009) or the fallback structure otherwise (FR-011)
- An assignee and applicable labels, including exactly one changelog-decision label, set in that same action (FR-012)
- If the change exceeds review-size guidance: an explicit note in the PR body, and — beyond the larger threshold — a flag that this should be a stack or have a documented exception
And must NOT: create a branch, or commit/push unrelated changes (FR-002); fabricate verification results not actually run (FR-020); apply a label absent from the repository's real label set (FR-010).

### Contract: Update an existing Pull Request

Given an open PR already exists for this branch, When the skill runs, Then it MUST: read the current PR body first, preserving accurate content and rewriting only what's stale (FR-017); backfill any missing labels, assignee, or changelog-decision label immediately (FR-017); refresh the testing/verification summary to reflect what's true now.

### Contract: Mark ready for review

Given a draft PR the user explicitly confirms is ready, When the skill runs this step, Then it MUST confirm required checks are passing, request a reviewer, and apply the review-status indicator (FR-016), and MUST attempt to link back to the originating tracked work item — warning (not failing) if no tool is available to do so.

### Contract: Changelog entry

Given a PR that requires a changelog entry (per its changelog-decision label), When the skill adds one, Then it MUST do so only after the PR already exists, linking back to it (FR-013) — and MUST NOT add one at all when the label states none is needed.

## B8. Spec Quality Checklist — specs/002-open-pr-skill/checklists/requirements.md (verbatim)

Purpose: Validate specification completeness and quality before proceeding to planning. Created: 2026-09-17.

### Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed
### Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified
### Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification
### Notes

SC-001 and SC-005 are stated as binary/verifiable outcomes rather than numeric metrics — appropriate for this workflow-process feature (there is no natural time/percentage/volume metric for "the author didn't have to re-derive information themselves"), but flagged here for visibility rather than silently treated as a standard quantitative success criterion.

This specification intentionally used zero [NEEDS CLARIFICATION] markers: the feature description it was derived from already reflects a fully decided set of requirements (branch-naming convention, review-budget thresholds, WCAG 2.2 AA, template-routing behavior, changelog-label naming) worked out in advance, rather than an underspecified starting point.

## B9. The Skill Itself — .claude/skills/open-pr/SKILL.md (verbatim, full 163 lines)

Frontmatter — name: open-pr. description: Create or update a pull request for the current branch, following this repo's established PR conventions exactly — gathers context from the branch's own commits/diff, applies labels and assignee (brandonmarshal) in the same gh pr create/edit call, and adds a CHANGELOG.md entry that links the PR afterward. Use this skill whenever the user asks to open a PR, create a pull request, ship/submit the current branch, or says things like "create the PR for me" or "get this ready for review" — even if they don't say "pull request" explicitly, as long as they mean getting the current branch's work up on GitHub.

Location note (header comment): this skill intentionally lives at .claude/skills/ rather than this repo's usual .agents/skills/ (portable-skill) location. It needs native Claude Code slash-command registration (/open-pr) and natural-language auto-invocation, neither of which Claude Code provides for .agents/skills/. This is a deliberate, scoped exception — not an oversight of AGENTS.md rule 11. See specs/002-open-pr-skill/research.md ("Decision: Skill location") for the full rationale and alternatives considered.

Create a pull request for the current branch, following this repo's established conventions exactly, plus the LightSpeed Pull Request Creation Workflow. This skill only creates/updates a PR — it does not create branches, commit changes, or push to develop. Assume the branch and its commits already exist.

Invocation guard: if this skill was triggered by a natural-language request (e.g. "create the PR for me") rather than the explicit /open-pr command, confirm the target branch and base with the user before running gh pr create. Skip this confirmation when invoked via the literal /open-pr command.

### Step 1: Gather context from the branch itself — never assume prior conversation context

This command must work correctly even with zero memory of what was discussed to get here. Before writing anything:

- 1. Identify the base branch and diff range: git log <base>..HEAD --oneline for the commit list, git diff <base>...HEAD --stat for the full list of changed files.
- 2. Read every commit message in that range — they're the primary source of "what was done and why."
- 3. For any file whose change isn't self-explanatory from its commit message alone, read the actual diff (git diff <base>...HEAD -- <file>) to understand it.
- 4. If the changes reference an issue/ticket number (in commit messages, branch name, or code comments), look it up for additional context if a tool for that is available — don't invent ticket details.
- 5. From the actual file types and paths touched, work out what this change is about — don't assume a category of work (performance, a bug fix, a new feature, refactoring, docs) based on anything other than what the diff itself shows.
### Step 2: Pre-flight checks

- 1. Confirm the current branch is not develop/main, has commits ahead of it, and is pushed to origin. Push it first if it isn't.
- 2. Check for an existing open PR on this branch: gh pr list --head <branch-name>. If one exists, update it instead of creating a duplicate.
- 3. Look at 2-3 recent merged PRs (gh pr list --state merged --limit 3 --json title,body,labels) to confirm title/body/label conventions haven't drifted — don't assume any previously-seen pattern is permanently fixed.
- 4. Check gh label list for the full current label set — never invent a label that doesn't exist in the repo.
- 5. Confirm the base branch by branch type, not just the repo default: normal development branches (feat/, fix/, chore/, etc.) target develop; a hotfix/ branch or a release branch targets main (and, once approved and merged, must be synchronised back to develop — flag this to the user as a follow-up, since this command doesn't perform that sync itself). Only fall back to gh repo view --json defaultBranchRef when the branch type doesn't clearly indicate one of the above.
- 6. Check whether this repo maintains a CHANGELOG.md (or equivalent) with a documented rule requiring an entry (check its contributor guidance file — e.g. AGENTS.md, CONTRIBUTING.md). If so, note that an entry is required — but do not add it yet; the entry is written after the PR exists, so it can link to the PR.
- 7. Identify which validation/lint/test commands this repo defines (check its contributor guidance file and package.json/composer.json scripts) and run whichever ones apply to the file types actually changed in this branch. Use these fresh, real results for the Test Plan section — never rely on memory of checks run earlier in an unrelated conversation.
- 8. Branch naming (LightSpeed convention): confirm the current branch name matches {type}/{scope}-{short-title} using one of the approved prefixes: feat/, fix/, hotfix/, refactor/, chore/, task/, docs/, test/, perf/, ci/, build/, deps/, security/, design/, a11y/, seo/, config/. Never use a tool-specific prefix (claude/, copilot/, openai/). Each branch in a stacked PR must use the prefix that describes that layer's own work, not the stack's overall type. This command does not rename branches — if the current branch doesn't match, flag it to the user before proceeding rather than silently creating the PR anyway.
- 9. Review budget (LightSpeed convention): from the diff stat gathered in Step 1, count reviewable files/lines — excluding generated assets, lock files, compiled/build output, snapshots, and translation files (call these exclusions out explicitly in the PR body if any were excluded from the count). Preferred budget is roughly ≤15 files / ≤400 lines / ~30-45 min human review time. Over ~15 files or ~400 lines: note in the PR that it exceeds the preferred budget. Over ~25 files or ~800 lines: flag clearly to the user that this should either be split into a stacked PR or have a maintainer-approved exception recorded before requesting review. Do not silently proceed as if this were a normal-sized PR.
- 10. Self-review gate: before drafting the PR, confirm (don't just assume) all of the following: the final diff (not just individual commits) was reviewed; the PR still contains one coherent outcome a reviewer can understand (if it's drifted into multiple unrelated outcomes, flag this rather than proceeding); it remains within the review budget from Step 2.9, or has a documented exception; applicable lint, unit, build, and other automated checks were run — not just lint/test in isolation; PHP/JavaScript errors were checked, and debugging/temporary code and unrelated formatting changes have been removed; responsive, editor/front-end, and accessibility behaviour were tested where relevant, accessibility target is WCAG 2.2 AA — use this figure even if this repo's own docs reference an older WCAG version, since 2.2 AA is the current LightSpeed org-wide standard; documentation was updated where required; if this repo has AI code-review automation enabled (e.g. CodeRabbit), its findings on this PR have been reviewed and responded to — noted in the PR, not silently ignored, AI review assists but never substitutes for the required human review; use this repo's own AGENTS.md/CONTRIBUTING.md for the concrete WordPress-specific checks (coding standards, sanitize/escape, capabilities, nonces, backwards compatibility, block.json/theme.json/editor-front-end parity) rather than re-deriving them here.
### Choosing a PR template (if this repo has one)

Before drafting the PR body, check whether this repo has .github/PULL_REQUEST_TEMPLATE/config.yml.

If it exists: use it as the branch-prefix to template routing table (it supersedes the shorter prefix list in Step 2.8 for this purpose — treat it as the fuller, authoritative version). Resolve the current branch's prefix to its mapped template file under .github/PULL_REQUEST_TEMPLATE/, and follow that template's own title format, section order, and checklist verbatim — don't substitute your own freeform structure over it. If the branch prefix is one of the forbidden tool-specific ones (claude/, copilot/, openai/), resolve the template via the linked issue's type instead, per the config's documented fallback strategy. Layer in any of the following sections from "PR structure" below that the matched template doesn't already have: Scope and exclusions, Screenshots/video, Accessibility/performance/backwards-compatibility notes, ## Stack (when applicable), and a stated Changelog decision. Add them in the same relative position "PR structure" specifies. Still apply every rule from "Creating the PR" and "Changelog" below (labels + assignee in the same command, changelog gated on meta:needs-changelog) — a template defining its own suggested labels in frontmatter doesn't override "never invent a label that doesn't exist in this repo": only apply a template-suggested label if it's actually present in gh label list.

If it doesn't exist: use the freeform "PR structure" below as-is.

### PR structure (fallback structure when this repo has no PR template; also the source for sections to layer into a matched template above)

- Title: plain description of what the diff actually does, derived from Step 1 — not from assumption. Append (TICKET-ID) only if a real ticket reference was found in Step 1. Never invent one.
- Base: the branch confirmed in Step 2.5.
- Body, in this order: 1. ## Summary — plain-English explanation of what was broken/needed and why, written as if the PR author wrote it directly. Never refer to "the user," any third party, or narrate an assistant's working process ("I found...", "we decided...") — state the facts of the change only. 2. Subsections (###) grouping related changes, one per distinct area touched — derived from the actual diff, not a fixed template of section names. 3. A section covering anything investigated but deliberately not changed, if applicable — explain why, with evidence, not just "not done." 4. Scope and exclusions — what this PR deliberately does not cover, and any files excluded from the review-budget count. 5. Screenshots/video — required for any visible/UI change; note explicitly if none apply. 6. Accessibility/performance/backwards-compatibility notes — where relevant to the change; omit the heading entirely if genuinely not applicable rather than writing "N/A". 7. ## Stack — only when this PR is one layer of a stacked PR set; omit entirely for a standalone PR. 8. ## Test plan — checklist of what was actually verified using Step 2.7's fresh results. Only check off what was genuinely run/verified just now — leave manual-QA items unchecked/pending. Never mark an item done to make the list look complete. 9. Changelog decision — state which of meta:needs-changelog / meta:no-changelog applies and why. 10. A closing reference to the ticket, only if one was genuinely found in Step 1.
### Stack information (only when this PR is part of a stacked PR set)

A stack is used when the change contains multiple dependent-but-independently-reviewable layers, a foundation must land before UI/integration work, a refactor must land before behavioural changes, or the full change would be too large/hard to review as one PR. A normal stack should contain no more than 5 PRs — larger work should normally be split into multiple stacks under an epic rather than one oversized stack. Don't split work arbitrarily just to reduce file counts — each layer must be coherent and testable on its own.

When this PR is part of a stack, include in the body a ## Stack section with: Position: PR <n> of <total>; Issue/Epic: #<issue>; Depends on: #<pr> (omit if bottom layer); Followed by: #<pr> (omit if top layer); Review scope: <what this specific layer covers>.

Ticket-closing phrasing depends on stack position: only the PR that actually completes the issue uses Closes #123 / Fixes #123 / Resolves #123. Every supporting/intermediate layer uses Relates to #123 / Part of #123 instead — never a closing keyword on a layer that doesn't finish the work, since that would let the issue auto-close before the full stack merges.

### Draft PRs (for larger or multi-day work)

Once there's a useful initial diff for larger or multi-day work, prefer opening as a draft rather than waiting until everything is finished: gh pr create --draft (still with --label/--assignee in the same call — draft status doesn't change that rule). A draft is not a formal review request — skip the "Marking Ready for Review" gating below until the user explicitly says it's ready.

For a stack opened as drafts: create the planned layers as drafts, mark the bottom layer ready first, and mark later layers ready only once their dependency and incremental diff are stable. If substantial rework begins after review has started on a non-draft PR, that's a signal to return it to draft — flag this to the user rather than doing it unprompted.

### Creating the PR — labels and assignee are part of the same command, not a follow-up step

Run gh pr create with --label and --assignee included in that same invocation — never run a bare gh pr create and add these afterward as a separate step.

- Labels: pull the real set from gh label list first — never guess or invent one. Choose labels based on what Step 1 actually found changed (area/component/language touched), not a fixed default set. Pass each chosen label with its own --label "<name>" flag.
- Changelog label (required, LightSpeed convention): every PR must carry exactly one of meta:needs-changelog or meta:no-changelog, in addition to the type/area/status/priority labels above. Use meta:needs-changelog for a user-facing change on the owning/final-delivery PR; supporting/internal stack layers normally use meta:no-changelog even if the overall change is user-facing, since the owning PR carries that entry.
- Assignee: always --assignee brandonmarshal.
Example shape: gh pr create --base <base> --title "<title>" --body "<body>" --label "area:block-editor" --label "meta:needs-changelog" --assignee brandonmarshal

### Changelog — after the PR is created

If Step 2.6 found this repo requires a changelog entry, and this PR is labelled meta:needs-changelog, add it now — only after the PR exists, never before: 1. Take the PR URL and/or number from the gh pr create output in the previous step. 2. Add the CHANGELOG.md entry per this repo's existing format/conventions, and include a link to that PR in the entry. Describe what changed, not implementation details, and avoid repeating the same entry across every layer of a stack. 3. Run this repo's changelog validation command if it has one, and follow its changelog automation rather than hand-editing CHANGELOG.md where automation generates it. 4. Commit and push that changelog update to the same branch.

If the PR is labelled meta:no-changelog, skip this section entirely — don't add an entry.

### Marking Ready for Review

Once the PR is genuinely ready (not applicable while it's intentionally a draft): 1. Confirm required CI is passing before asking for review. 2. Mark the PR ready for review if it was opened as a draft (gh pr ready <number>). 3. Request the appropriate reviewer/code owner if one can be determined; otherwise flag to the user that a reviewer still needs to be chosen. 4. Confirm status:needs-review is applied (add it if this repo tracks review status via labels and it's missing). 5. Link the PR back to its Linear/Asana issue and note that the work item should move to "In Review" — do this via an available tool if one exists. If no such tool is available, warn that this step needs doing manually and still finish successfully — don't fail or skip the notice silently.

### Updating an existing PR

- Read the current PR body first (gh pr view <number> --json body) before rewriting it.
- Preserve any part that still accurately reflects the current code — don't blindly overwrite everything. Rewrite only what's gone stale, and refresh the Test Plan checkboxes to reflect what's true now, not what was true when it was first opened.
- If labels or assignee are missing from the existing PR, add them now with gh pr edit <number> --add-label "<name>" --add-assignee brandonmarshal — don't leave them for later. This includes the meta:needs-changelog/meta:no-changelog label if it's missing from an existing PR.
### Responding to feedback (once review is underway)

- Respond to every review thread — don't leave any unaddressed.
- Do not silently push fixes: when changes are requested, fix the owning branch, test again, push, let CI run again, reply to the review threads explaining what changed, then re-request review.
- For stacked PRs, fix the issue in the layer that actually owns the affected code — never work around a defect in a lower layer from a higher one in the stack. After fixing the owning layer, rebase/update the layers above it and confirm their CI reruns.
- Use git push --force-with-lease only where stack rebasing genuinely requires it after fixing a lower layer. Avoid unqualified --force pushes.
### What NOT to do

- Don't create branches or commit/push unrelated changes as part of this command — assume the branch and commits already exist. The one exception is the changelog entry itself.
- Don't push to develop/main or merge anything — this only opens/updates a PR against the base branch.
- Don't fabricate test results, metrics, or verification steps that weren't actually run in Step 2.7.
- Don't write the PR body from assumed context — every claim in it must trace back to something found in Step 1's actual branch inspection.
- Don't use conversational framing ("the user," "senior," "we discussed") in the PR body — it should read as if the developer wrote it themselves.
- Don't add the changelog entry before the PR exists — it must link to the PR, so it can only be written afterward.
- Don't run gh pr create without --label and --assignee already in that same command.
- Don't create a PR without exactly one of meta:needs-changelog / meta:no-changelog applied.
- Don't use a closing keyword (Closes/Fixes/Resolves) on a supporting layer of a stack — only the layer that actually completes the issue.
- Don't silently create an oversized PR (>~25 files/~800 lines) without flagging that it should be a stack or needs a documented exception.
- Don't apply a template's suggested label from its frontmatter if that label doesn't actually exist in this repo's gh label list.
- Don't silently push a fix without replying to the review thread it addresses, and don't force-push without --force-with-lease during stack rebasing.
## B10. Project Constitution — Principle VIII and Sync Impact Report (verbatim, from .specify/memory/constitution.md)

### Sync Impact Report (for the amendment that added Principle VIII)

Version change: 1.2.0 → 1.3.0. Modified principles: none (I-VII preserved verbatim, no rewording). Added principles: VIII. Branch, PR & Changelog Discipline — sourced from the LightSpeedWP organization's Pull Request Creation Workflow document and shared PR-template repository (lightspeedwp/.github), validated in practice while building this repo's own open-pr agent skill (specs/002-open-pr-skill/). Covers branch naming/base-branch selection, review-size and stacked-PR guidance, mandatory changelog-decision labelling, PR-template routing, a WCAG 2.2 AA PR-review accessibility bar, and post-review feedback discipline. Added sections: none.

Modified sections: Workflow & Process — the "CHANGELOG.md gets one dated entry per PR" and "Never branch directly from a remote-tracking ref" bullets are now cross-referenced to Principle VIII (which restates and materially expands both) instead of duplicated verbatim, to avoid the two locations drifting out of sync. No information was removed — both rules are fully covered, in more detail, under Principle VIII.

Removed sections: none.

Flagged inconsistency (NOT resolved by this amendment): Principle V states "WCAG 2.1 AA" as the general baseline. Principle VIII sets WCAG 2.2 AA specifically for PR self-review, per the current LightSpeedWP org-wide standard, and notes it supersedes Principle V's figure for that purpose. Principle V's own text was intentionally left unedited per this amendment's scope (additive only) — reconciling the two into one consistent figure is a follow-up TODO.

Follow-up TODO: TODO(WCAG_BASELINE_RECONCILIATION) — Decide whether to bump Principle V's baseline from 2.1 AA to 2.2 AA org-wide, or keep the two figures deliberately scoped differently (general theme baseline vs. PR-review bar). Requires a maintainer decision, not just an editorial fix.

### V. Accessibility and Security Non-Negotiables (excerpt, for contrast with Principle VIII below)

Heading hierarchy MUST be correct (no skipped levels), images MUST have descriptive alt text, interactive elements MUST be keyboard-accessible, and focus states MUST NOT be removed — WCAG 2.1 AA is the baseline. [...] Rationale: These are non-negotiable because they are either legally/ethically required (accessibility, security) or a specific, repeatedly-reintroduced structural bug in this exact codebase that is cheaper to prevent by rule than to keep re-diagnosing.

### VIII. Branch, PR & Changelog Discipline (full text)

Branch names MUST follow {type}/{scope}-{short-title} using the organization's approved prefixes (feat/, fix/, hotfix/, refactor/, chore/, task/, docs/, test/, perf/, ci/, build/, deps/, security/, design/, a11y/, seo/, config/); tool-specific prefixes (claude/, copilot/, openai/) MUST NOT be used. Each layer of a stacked PR MUST use the prefix describing that layer's own work, not the stack's overall type. Branches MUST NOT be created directly from a remote-tracking ref (e.g. git checkout -b x origin/develop), which silently sets the wrong upstream and misdirects pushes; branch creation MUST be verified with git branch -vv.

The base branch MUST be chosen by branch type, not assumed from the repository default: normal development targets develop; a hotfix/ branch or a release branch targets main, and MUST be flagged for synchronisation back to develop after merge rather than assumed automatic.

A PR MUST contain one coherent, reviewable outcome and SHOULD stay within a preferred review budget (~15 files / ~400 lines / ~30-45 minutes of review time), excluding generated/compiled/lock/snapshot/translation files from that count (but identifying them in the PR). Beyond ~25 files or ~800 lines, the change MUST either be split into a stacked PR set or have a documented maintainer-approved exception recorded before requesting review. A stack MUST contain no more than 5 PRs; larger work MUST be split into multiple stacks under an epic rather than one oversized stack, and layers MUST NOT be split arbitrarily just to reduce file counts. Only the PR that actually completes an issue MAY use a closing reference (Closes/Fixes/Resolves #N); every supporting/intermediate layer MUST use a non-closing reference (Relates to/Part of #N) instead, so the issue cannot auto-close before the full stack lands.

Every PR MUST carry an assignee and its applicable labels — including exactly one changelog-decision label (meta:needs-changelog or meta:no-changelog) — set in the same action that creates or updates the PR, never as a separate follow-up step. CHANGELOG.md MUST receive one dated entry per PR (Keep a Changelog format), added only after the PR exists (so it can link back to it) and only when meta:needs-changelog applies — never batched retroactively, and never repeated across every layer of a stack (the owning/final-delivery layer carries it). Where this repository defines a PR-template routing configuration (e.g. .github/PULL_REQUEST_TEMPLATE/config.yml), the matching template's own title format, section order, and checklist MUST be followed rather than a different structure substituted in; a template's own suggested labels only apply if they actually exist in this repository's real label set.

The accessibility bar for PR self-review is WCAG 2.2 AA — this is the current LightSpeedWP organization-wide standard and takes precedence over any older figure referenced elsewhere in this repository's own documentation for PR-review purposes specifically (see the flagged inconsistency with Principle V's general 2.1 AA baseline in this file's Sync Impact Report).

Once a PR is under review, every review thread MUST receive a reply — fixes MUST NOT be pushed silently. For a stacked PR, a defect belonging to a lower layer MUST be fixed in that owning layer, with layers above it rebased/updated afterward; a lower layer's defect MUST NOT be worked around from a higher layer. Force-pushes during stack rebasing MUST use --force-with-lease, never an unqualified --force.

Rationale: These rules were validated in practice while building and refining this repo's own open-pr agent skill (specs/002-open-pr-skill/), and are sourced directly from the LightSpeedWP organization's canonical Pull Request Creation Workflow and shared PR-template repository. Codifying them here means every future Spec Kit-planned feature is automatically checked against this same standard during /speckit-plan, instead of each feature having to rediscover or restate these rules independently.

## B11. AGENTS.md context — the rule the SKILL.md's location note refers to (verbatim)

Rule 11 (of "Rules for AI Agents"): Keep portable skills in .agents/skills/. Skills should be self-contained and reusable.

Rule 12 (immediately following, for context): Keep agent personas in .agents/agents/. Agent persona files describe specialist roles.

This is the exact rule the open-pr SKILL.md's header comment cites when explaining why it deliberately breaks convention by living at .claude/skills/open-pr/ instead of .agents/skills/open-pr/ — documented in research.md (Source B5) as a scoped, deliberate exception, not an oversight.

# SOURCE C — Audit of what already exists in lightspeedwp/.github (develop branch, verified by direct inspection)

agents/pr-agent/ already contains real, working code and tests — not scaffolding:

- AGENT.md, package.json, package-lock.json, jest.config.js, .gitignore
- Six skills with working .js implementations and Jest unit tests: route-pr-template, handle-pr-errors, validate-branch-name, orchestrate-pr-creation, validate-and-apply-labels, submit-pr
- Implementation line counts: handle-pr-errors.js 329, validate-and-apply-labels.js 305, validate-branch-name.js 271, submit-pr.js 214, orchestrate-pr-creation.js 117, route-pr-template.js 109 (about 1,345 lines total)
- Unit test line counts: validate-and-apply-labels.test.js 514, validate-branch-name.test.js 477, submit-pr-and-error-handling.test.js 473, route-pr-template.test.js 311, orchestrate-pr-creation.test.js 167 (about 1,942 lines)
- A separate integration test suite under __tests__/integration/: setup.js, real-github-workflows.test.js, performance-edge-cases.test.js, sequential-skill-execution.test.js, label-application-scenarios.test.js, template-routing-scenarios.test.js, error-recovery-workflows.test.js (about 1,091 lines)
Gaps against Source A's requirements, verified by direct inspection:

- Every skill's SKILL.md is still the unfilled agentskills.io template placeholder: "name: template-skill / description: Replace with description of the skill and when Claude should use it. / # Insert instructions below" — none contain real procedural content, despite the .js files beside them being fully implemented and tested.
- No scripts/, references/, or assets/ subdirectories exist under any skill folder — the .js implementation and its SKILL.md sit as flat siblings, not nested per the Agent Skills spec structure Source A requires.
- AGENT.md itself is thin and appears auto-generated: generic bullet points ("Branch Validation – Validate branch naming conventions") with no procedural detail comparable to Source B9's 163-line skill, and its footer literally repeats the same boilerplate block ("This page brought to you by the Magic Automation Unicorns of LightSpeedWP" + an Automation Docs link) 15 times in sequence — a clear sign of generation cruft that was never cleaned up.
- AGENT.md's own frontmatter still says implementation: "agents/pr-creation-agent/" and its "Implementation Reference" section still points to pr-creation-agent/package.json and pr-creation-agent/pr-orchestrator.js — both stale, since the real, tested implementation now lives at agents/pr-agent/skills/*, not agents/pr-creation-agent/.
- agents/pr-creation-agent/pr-creation.agent.md is confirmed, by direct diff, to be a near-exact duplicate of AGENT.md — the only difference across all 124 lines is the closing signature line (AGENT.md ends "Have questions? Ping us on GitHub!"; pr-creation.agent.md ends "Docs signed by Copilot for LightSpeedWP"). No unique content would be lost by removing this directory.
- agents/pr-agent/package.json still declares itself as "name": "@lightspeedwp/pr-creation-agent" with "repository":{"directory":"agents/pr-creation-agent"} — both stale relative to its actual location at agents/pr-agent/.
- No README.md or CHANGELOG.md exists anywhere under agents/pr-agent/.
- docs/agents/ contains only docs/agents/prd-agent/ — there is no docs/agents/pr-agent/ yet.
- Root-level lint configuration exists (.eslintrc.js, .eslintrc.json, eslint.config.cjs, .eslint.config.cjs, .markdownlint-cli2.cjs, .markdownlint.config.cjs, .markdownlint.jsonc, .prettierrc) but whether it actually covers agents/pr-agent/** specifically has not been confirmed — this needs to be checked, not assumed, before the new spec can claim linting is "already wired."
- A separate, apparently unrelated agent — agents/linear-advisor-agent/agent/references/agent_files/canonical/PR_CREATION_PROCESS.md — holds its own copy of the PR creation process doc. This is outside the scope of the pr-agent consolidation itself, but is flagged here as a second, independent source of the same governance content that could drift from docs/PR_CREATION_PROCESS.md over time — worth a follow-up note in the new spec's Assumptions, not something this feature needs to fix.
# SOURCE D — Verified factual conflicts between Source B (ls-theme) and Source C (.github) that the new spec MUST resolve

## D1. A real bug: validate-branch-name.js's forbidden-prefix list does not match .github's own canonical doc

agents/pr-agent/skills/validate-branch-name/validate-branch-name.js defines: const FORBIDDEN_PREFIXES = ["claude", "bot", "automated"];

This contradicts .github's own docs/BRANCHING_STRATEGY.md, Section 4.1 "Forbidden Prefixes (AI Agent Governance)", which states verbatim: "The following prefixes are strictly forbidden for all branches... claude/ ... copilot/ — ... openai/ — OpenAI-related work must use appropriate type prefixes... Enforcement: CI will reject any branch matching claude/, copilot/, or openai/ prefixes."

It also contradicts .github's own .github/PULL_REQUEST_TEMPLATE/config.yml, which lists the same three (claude/, copilot/, openai/) under its "FORBIDDEN PREFIXES" fallback-routing comment, and it contradicts Source B (ls-theme's constitution Principle VIII and SKILL.md), which independently arrived at the same claude/, copilot/, openai/ list, sourced from the same org doc.

Conclusion for the new spec: this is not a matter of reconciling two valid conventions — validate-branch-name.js is simply wrong relative to its own repository's canonical documentation, and must be corrected to enforce claude/, copilot/, openai/ (or read that list from docs/BRANCHING_STRATEGY.md / config.yml at run time rather than hardcoding it a third time).

## D2. Incompleteness: ls-theme's approved-prefix list is a narrower subset of .github's actual canonical list

ls-theme's constitution Principle VIII and SKILL.md both use this 17-item approved-prefix list: feat/, fix/, hotfix/, refactor/, chore/, task/, docs/, test/, perf/, ci/, build/, deps/, security/, design/, a11y/, seo/, config/

.github's docs/BRANCHING_STRATEGY.md Section 3 defines a much larger canonical list, split into three tiers:

3.1 Shared Core Prefixes (all repos): feat/, fix/, hotfix/, release/, refactor/, chore/, task/, docs/ or doc/, test/, perf/, ci/, build/, deps/, security/, revert/, research/, design/, a11y/, ux/, i18n/, ops/, audit/, codex/, aiops/, automation/, epic/

3.2 Product-specific Prefixes (optional): proto/, ds/, api/, schema/, telemetry/

3.3 Client-specific Prefixes (optional): content/, seo/, config/, migrate/, qa/, uat/

Conclusion for the new spec: ls-theme's list isn't wrong, it's incomplete — it's missing release/, revert/, research/, ux/, i18n/, ops/, audit/, codex/, aiops/, automation/, epic/, and all of tiers 3.2/3.3. Since aiops/ is literally the prefix used by the very branch this brief is about (feature/ls-3223-aiops-...— note: this branch actually uses feature/, which is not in ANY of the three lists above either, a further discrepancy worth flagging separately), the portable agent must read the full canonical list from .github's own docs/BRANCHING_STRATEGY.md (or a config file derived from it), not re-embed ls-theme's narrower subset or any other repo's local subset.

## D3. An additional discrepancy noticed while verifying D2: the reference branch's own name doesn't match any documented prefix list

The branch this entire brief is about, feature/ls-3223-aiops-openspec-plan-new-skills, uses the prefix feature/ — which does not appear in .github's docs/BRANCHING_STRATEGY.md Section 3 (shared, product, or client tiers), nor in ls-theme's own 17-item constitution list, nor in .github's PULL_REQUEST_TEMPLATE/config.yml routing table (which has feat/ but not feature/). This is noted here factually, not as something this brief resolves — it may be worth a maintainer decision on whether feature/ should be added as a recognized alias of feat/, or whether the branch should be renamed, but that decision belongs to the org, not to this consolidation spec.

## D4. Confirmed non-conflict: the PR template routing config is already genuinely shared, not duplicated-and-drifted

Direct diff of .github/PULL_REQUEST_TEMPLATE/config.yml in lightspeedwp/.github against the copy at .github/PULL_REQUEST_TEMPLATE/config.yml in lightspeedwp/ls-theme (added to ls-theme in a prior change, per its own commit "Add LightSpeedWP org PR templates to ls-theme") produced zero diff output — the files are byte-identical. .github's own README.md and PR_CREATION_PROCESS.md name .github as the canonical source for these templates.

Conclusion for the new spec: Source A's item 12 (evaluate symlinking assets/ to .github/PULL_REQUEST_TEMPLATE/) is validated by this finding — .github genuinely is the authoritative source here already, in practice as well as in principle. No reconciliation needed for this specific file, only a decision on symlink vs. reference for the portable agent's own assets/ directory.

## D5. Behavioral gap: Source B's skill logic is far more detailed than Source C's implemented skills currently express

Source B9 (the 163-line SKILL.md) encodes review-budget thresholds, self-review gating (including a specific, named check for CodeRabbit/AI-review findings), PR-template verbatim-structure-following with additive layering, stacked-PR position/dependency/closing-phrase rules, draft/ready-for-review sequencing including a warn-don't-block rule for missing Linear/Asana tooling, and an "Updating an existing PR" preserve-then-rewrite-only-what's-stale rule.

Source C's six existing skills (route-pr-template, handle-pr-errors, validate-branch-name, orchestrate-pr-creation, validate-and-apply-labels, submit-pr) cover branch validation, label validation, template routing, PR submission, and error handling as deterministic, tested JavaScript — but their current line counts and test coverage suggest they do not yet encode the review-budget/self-review/stack/draft/ready-for-review/update-in-place logic that Source B's skill already has validated in practice. This needs direct code-reading (not assumed from file/skill names) before the new spec decides which of Source B's behaviors become new JS logic in existing or new skills, versus which remain as agent-level Markdown instructions layered on top of the JS skills (the same architecture question already flagged as a design decision the new spec must make, not avoid).

# WHAT THE RESULTING SPEC MUST DO

- Treat Source C's existing .js implementations and Jest tests as an asset to retrofit and extend, not discard and rebuild.
- Treat Source B's procedural logic (B1-B9) as the validated, org-admin-approved source of truth for PR-creation/orchestration BEHAVIOR, and Source A as authoritative for STRUCTURE and PORTABILITY — reconciling the two deliberately, including generalizing Source B's ls-theme-specific hardcoded values (fixed assignee, fixed base-branch names, fixed review-budget thresholds, ls-theme's narrower prefix list) into configuration the portable agent can vary per repository.
- Fix the verified bug in D1 (validate-branch-name.js's forbidden-prefix list) as part of this work, not as a separate unrelated fix.
- Source the full, canonical branch-prefix list from .github's own docs/BRANCHING_STRATEGY.md rather than re-embedding any one repository's narrower subset (D2), and flag the feature/ prefix discrepancy (D3) for a maintainer decision rather than silently resolving it.
- Carry forward, rather than resolve, the constitution's own unresolved TODO(WCAG_BASELINE_RECONCILIATION) (Source B10) — the new spec should note it as a known open question, matching how ls-theme's own constitution already treats it.
- Merge agents/pr-creation-agent/ into agents/pr-agent/ per Source A items 1-2, informed by the confirmed near-duplicate finding in Source C (safe to remove once merged) and fix AGENT.md's stale implementation: path pointer and package.json's stale name/directory fields.
- Restructure every skill folder to the Agent Skills spec shape (scripts/, references/, assets/, per Source A item 3), fill in every placeholder SKILL.md with real instructions, and add scripts/__tests__/ per Source A item 4 (moving/reorganizing existing tests as needed rather than duplicating them).
- Add markdown + JavaScript linting scoped to agents/pr-agent/** (confirming, not assuming, whether root configs already cover it), a README.md, and a CHANGELOG.md (Source A items 5-8).
- Add docs/agents/pr-agent/ and reference the docs/BRANCHING_*.md, docs/PR_*.md, docs/LABEL*.md, docs/ISSUE*.md wildcard patterns as patterns, not literal filenames, per Source A's explicit wildcard rule (item 9 and its "Important wildcard rule" subsection) — and evaluate the optional symlink approaches in Source A items 11-12, informed by the confirmed template-file non-conflict in D4.
- Produce one feature spec split into phases/user stories, mirroring how Source B1's spec split into P1-P4 priorities, rather than one flat, undifferentiated task list — so the resulting work stays reviewable and independently testable phase by phase, the same discipline Source B already demonstrated successfully.
- Keep the agent working first-class inside lightspeedwp/.github (Source A item 13) while remaining portable to other LightSpeedWP repositories (item 14) — meaning nothing in the final skills may hardcode an assignee, a base-branch name, a review-budget threshold, or a prefix list that only makes sense for one specific repository.
# APPENDIX — PR Template Routing Table (verbatim, .github/PULL_REQUEST_TEMPLATE/config.yml)

Confirmed byte-identical between lightspeedwp/.github and lightspeedwp/ls-theme's copy (see Source D4). Reproduced here in full so the new spec has the actual routing table on hand rather than a description of it.

```
# Pull request template routing map
#
# GitHub does not auto-route templates by branch prefix, so this file is the
# canonical routing contract for docs, automation, and validation logic.
#
# Source of truth alignment:
# - Branch naming: docs/BRANCHING_STRATEGY.md
# - Root router: .github/pull_request_template.md
# - Template files: .github/PULL_REQUEST_TEMPLATE/*.md
# - PR creation guide: docs/PR_CREATION_PROCESS.md
#
# The route map below is explicit for all supported branch prefixes. Where the
# repository does not have a specialised PR template, the closest active
# template is reused so automation still has a stable, documented contract.
#
# FALLBACK ROUTING STRATEGY (for claude/* and copilot/* branches):
#
# When a PR branch uses a claude/, copilot/ or openai/ prefix
# template resolution uses a fallback mechanism:
#
# 1. Query linked issue (via GitHub API)
# 2. Extract issue type in this order:
#    a. Issue type field (if custom field available)
#    b. type:* label on issue
#    c. type:* label on PR
#    d. PR description (scan for type indicators)
#    e. Default fallback: type-feature (pr_feature.md)
# 3. Map resolved type to correct template using this routing table
# 4. GitHub Action (pr-template-resolver.yml) handles fallback logic

default_template: pr_feature.md

routes:
  feat/: pr_feature.md
  fix/: pr_bug.md
  hotfix/: pr_hotfix.md
  refactor/: pr_refactor.md
  chore/: pr_chore.md
  docs/: pr_docs.md
  task/: pr_task.md
  doc/: pr_docs.md
  test/: pr_chore.md
  perf/: pr_feature.md
  ci/: pr_ci.md
  build/: pr_ci.md
  automation/: pr_ci.md
  deps/: pr_dep_update.md
  security/: pr_bug.md
  design/: pr_feature.md
  a11y/: pr_feature.md
  ux/: pr_feature.md
  release/: pr_release.md
  research/: pr_feature.md
  revert/: pr_chore.md
  i18n/: pr_feature.md
  ops/: pr_chore.md
  proto/: pr_feature.md
  ds/: pr_feature.md
  api/: pr_feature.md
  schema/: pr_feature.md
  telemetry/: pr_feature.md
  content/: pr_docs.md
  seo/: pr_docs.md
  config/: pr_chore.md
  migrate/: pr_chore.md
  qa/: pr_chore.md
  uat/: pr_chore.md
  audit/: pr_feature.md
  codex/: pr_docs.md
  aiops/: pr_aiops.md
  epic/: pr_epic.md

  # FORBIDDEN PREFIXES: Fallback routing required
  #
  # These prefixes violate branch naming rules (.github/custom-instructions.md).
  # When encountered, the GitHub Action (pr-template-resolver.yml) resolves the
  # correct template via linked issue type using the fallback strategy above.
  # These entries document the expected fallback type for auditing purposes only.
  #
  claude/: pr_feature.md # Fallback resolved via linked issue type
  copilot/: pr_feature.md # Fallback resolved via linked issue type
  openai/: pr_feature.md # Fallback resolved via linked issue type

available_templates:
  - pr_feature.md
  - pr_bug.md
  - pr_hotfix.md
  - pr_refactor.md
  - pr_chore.md
  - pr_docs.md
  - pr_ci.md
  - pr_dep_update.md
  - pr_release.md
  - pr_task.md
  - pr_aiops.md
  - pr_epic.md
```

Note: .github's actual .github/PULL_REQUEST_TEMPLATE/ directory also contains pr_a11y.md, pr_audit.md, pr_design.md, pr_security.md, and pr_test.md — five template files that exist but are NOT yet referenced in the routes: map above (a11y/, audit/, design/, security/, and test/ currently route to pr_feature.md, pr_feature.md, pr_feature.md, pr_bug.md, and pr_chore.md respectively instead of their own same-named templates). This is an additional, independent discrepancy noticed while inlining this file — flagged here factually, not resolved by this brief. Whether the new pr-agent spec should fix this routing gap is a decision for the spec/maintainer, not assumed here.

## Verification note: the personal command file this skill was synced from

tasks.md T026 references a "validated personal command" at ~/.claude/commands/open-pr.md as the file SKILL.md was diffed against for content parity. That file was read directly (it is local to this machine, outside any repository) and confirmed to be content-identical to Source B9's SKILL.md — same steps, same rules, word-for-word — differing only in the frontmatter, the location-note header comment, and the invocation-guard paragraph that make it a Claude Code skill rather than a plain slash command. It introduces no information not already captured in Source B9, so nothing further was added to this brief from it.
