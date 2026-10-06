# [LABEL-UPDATE-REQUEST] Consolidate labels across GitHub and Linear (spec 008)

> Issue body for spec 008 task T046 (FR-021), opened as #3834 and labelled `meta:needs-approval`. Generated from `evidence/linear-labels.json` by `scripts/automation/label-mapping.cjs`, which also checks the mapping against label-mapping schema rules 1 to 9.

## Chore Summary

Approve the mapping that Stage 2 (the `.github/labels.yml` configuration PR, T059) and later stages apply. It covers 471 source labels and ends with 66 distinct targets. The type family ends at exactly 25.

Nothing changes until @ashleyshaw records a dated decision on this issue. Each repository's deletion has its own later gate (the deletion gate issue, T049).

## Decisions needed

1. **Spec-listed rules (no judgement).** The FR-011 prefix renames, the 32 FR-012 merges, the FR-015 re-prefixes and the team-scope labels follow the spec as written.
2. **Proposed by this mapping (spec is silent).** The 48 merges and 9 gap entries below are judgement calls. Approve, or replace the target in a comment.

## Linked Stories/Tasks

- Spec: `.github/specs/008-label-audit-consolidation/spec.md` (FR-011, FR-012, FR-014, FR-015, FR-021, FR-023)
- Tasks: T043, T043a, T044, T046, T046a, T059
- Already covers five imports: #3554. Also pending: #3757 (`area:labels`), #3548 (PR template frontmatter labels)
- Parent: #449

## Mapping by action

### rename (29)

| Source | Target | Items | Rule | Notes |
| --- | --- | ---: | --- | --- |
| `ai-ops:instructions` | `aiops:instructions` | 0 | FR-011 |  |
| `ai-ops:chat-modes` | `aiops:chat-modes` | 0 | FR-011 |  |
| `ai-ops:agents` | `aiops:agents` | 0 | FR-011 |  |
| `ai-ops:prompts` | `aiops:prompts` | 0 | FR-011 |  |
| `ai-ops:datasets` | `aiops:datasets` | 0 | FR-011 |  |
| `ai-ops:evaluations` | `aiops:evaluations` | 0 | FR-011 |  |
| `ai-ops:tools` | `aiops:tools` | 0 | FR-011 |  |
| `openspec:discovery` | `spec:discovery` | 0 | FR-011 |  |
| `openspec:planning` | `spec:planning` | 0 | FR-011 |  |
| `openspec:specification-in-progress` | `spec:specification-in-progress` | 0 | FR-011 |  |
| `openspec:specification-complete` | `spec:specification-complete` | 0 | FR-011 |  |
| `openspec:implementation-pending` | `spec:implementation-pending` | 0 | FR-011 |  |
| `openspec:implementation-in-progress` | `spec:implementation-in-progress` | 0 | FR-011 |  |
| `openspec:status-testing` | `spec:status-testing` | 0 | FR-011 |  |
| `openspec:status-production` | `spec:status-production` | 0 | FR-011 |  |
| `openspec:implementation-complete` | `spec:implementation-complete` | 0 | FR-011 |  |
| `openspec:implementation` | `spec:implementation-in-progress` | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed rename to spec:implementation-in-progress: generic implementation stage. |
| `openspec:specification` | `spec:specification-in-progress` | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed rename to spec:specification-in-progress: generic specification stage. |
| `openspec:specification-pending` | `spec:planning` | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed rename to spec:planning: specification not started yet; closest status is planning. |
| `spec:001` | `spec-id:001` | 0 | FR-011 | Spec numbers move to spec-id:NNN so spec:* holds only status labels. |
| `area/changelog` | `area:changelog` | 0 | FR-016 | Same name as area:changelog apart from case or separator (1 public repository, 0 counted items (lower bound)). |
| `area/security` | `area:security` | 0 | FR-016 | Same name as area:security apart from case or separator (1 public repository, 0 counted items (lower bound)). |
| `area/testing` | `area:testing` | 0 | FR-016 | Same name as area:testing apart from case or separator (1 public repository, 0 counted items (lower bound)). |
| `area/workflows` | `area:workflows` | 0 | FR-016 | Same name as area:workflows apart from case or separator (1 public repository, 0 counted items (lower bound)). |
| `priority/high` | `priority:high` | 0 | FR-016 | Same name as priority:high apart from case or separator (1 public repository, 0 counted items (lower bound)). |
| `priority/normal` | `priority:normal` | 0 | FR-016 | Same name as priority:normal apart from case or separator (1 public repository, 0 counted items (lower bound)). |
| `status/in-progress` | `status:in-progress` | 0 | FR-016 | Same name as status:in-progress apart from case or separator (1 public repository, 0 counted items (lower bound)). |
| `type/feature` | `type:feature` | 0 | FR-016 | Same name as type:feature apart from case or separator (1 public repository, 0 counted items (lower bound)). |
| `type/refactor` | `type:refactor` | 0 | FR-016 | Same name as type:refactor apart from case or separator (1 public repository, 0 counted items (lower bound)). |

### merge (76)

| Source | Target | Items | Rule | Notes |
| --- | --- | ---: | --- | --- |
| `area:ci-cd` | `area:ci` | 1 | FR-012 |  |
| `type:content-model` | `type:content-modelling` | 0 | FR-012 |  |
| `type:ai-ops` | `type:aiops` | 0 | FR-012 |  |
| `area:docs` | `area:documentation` | 1 | FR-012 |  |
| `area:ops` | `area:operations` | 0 | FR-012 |  |
| `scope:website` | `area:website` | 7 | FR-012 |  |
| `scope: website` | `area:website` | 1 | FR-012 |  |
| `status:planned` | `status:needs-planning` | 0 | FR-012 |  |
| `status:planning` | `status:needs-planning` | 1 | FR-012 |  |
| `priority:medium` | `priority:normal` | 81 | FR-012 |  |
| `status:completed` | `status:done` | 0 | FR-012 |  |
| `status:resolved` | `status:done` | 0 | FR-012 |  |
| `area:tests` | `area:testing` | 52 | FR-012 |  |
| `area:quality` | `area:qa` | 9 | FR-012 |  |
| `status:no-issue-activity` | `meta:no-issue-activity` | 3 | FR-012 |  |
| `status:ready-for-development` | `status:ready` | 14 | FR-012 |  |
| `status:in-review` | `status:needs-review` | 1 | FR-012 |  |
| `lang:scss` | `lang:css` | 36 | FR-012 |  |
| `comp:workflows` | `area:workflows` | 1 | FR-012 |  |
| `area:platform` | `area:infrastructure` | 2 | FR-012 |  |
| `area:process` | `area:governance` | 2 | FR-012 |  |
| `area:standards` | `area:governance` | 6 | FR-012 |  |
| `area:pr-automation` | `area:automation` | 2 | FR-012 |  |
| `area:issue-management` | `area:automation` | 4 | FR-012 |  |
| `area:design` | `area:design-system` | 4 | FR-012 |  |
| `scope:audit` | `meta:audit` | 3 | FR-012 |  |
| `scope:project-management` | `area:projects` | 2 | FR-012 |  |
| `meta:documentation` | `area:documentation` | 4 | FR-012 |  |
| `meta:ai-ops` | `area:ai` | 0 | FR-012 |  |
| `area:agents` | `aiops:agents` | 113 | FR-012 |  |
| `area:instructions` | `aiops:instructions` | 0 | FR-012 |  |
| `area:prompts` | `aiops:prompts` | 0 | FR-012 |  |
| `type: feature` | `type:feature` | 1 | FR-014 | Proposed (not listed in FR-012): spacing variant of type:feature; spacing variants are separate sources (FR-023 point 8). Needed so the type family ends at exactly 25. |
| `type:build-ci` | `type:ci` | 1 | FR-014 | Proposed (not listed in FR-012): Linear-only duplicate; FR-019 renames the Build & CI type to CI. Needed so the type family ends at exactly 25. |
| `type:code-refactor` | `type:refactor` | 3 | FR-014 | Proposed (not listed in FR-012): Linear-only duplicate; FR-019 renames the Code Refactor type to Refactor. Needed so the type family ends at exactly 25. |
| `type:documentation` | `type:docs` | 1 | FR-014 | Proposed (not listed in FR-012): Linear-only duplicate of type:docs. Needed so the type family ends at exactly 25. |
| `a11y` | `type:a11y` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:a11y, which resolves to type:a11y (1 public repository, 0 counted items (lower bound)). |
| `A11y` | `type:a11y` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:a11y, which resolves to type:a11y (1 public repository, 0 counted items (lower bound)). |
| `accessibility` | `type:a11y` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:a11y, which resolves to type:a11y (1 public repository, 0 counted items (lower bound)). |
| `area:accessibility` | `area:a11y` | 1 | FR-016 | Proposed merge: area:a11y is described as "Accessibility (WCAG compliance)"; same family (1 public repository, 1 counted item (lower bound)). Change request #3834. |
| `area/ci-cd` | `area:ci` | 0 | FR-016 | Same name as area:ci-cd apart from case or separator, which resolves to area:ci (1 public repository, 0 counted items (lower bound)). |
| `Chore` | `type:chore` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:chore, which resolves to type:chore (1 public repository, 0 counted items (lower bound)). |
| `ci` | `area:ci` | 0 | FR-016 | Earlier bare-label mapping (#2523) names area:ci, which resolves to area:ci (1 public repository, 0 counted items (lower bound)). |
| `component:ci` | `area:ci` | 4 | FR-016 | Proposed merge: same family as comp:workflows (merged into area:*); area:ci is "Build and CI pipelines" (1 public repository, 4 counted items (lower bound)). Change request #3834. |
| `component:workflows` | `area:workflows` | 2 | FR-016 | Proposed merge: same family and word as comp:workflows, which FR-012 merges into area:workflows (1 public repository, 2 counted items (lower bound)). Change request #3834. |
| `content` | `area:content` | 0 | FR-016 | Earlier bare-label mapping (#2523) names area:content, which resolves to area:content (1 public repository, 0 counted items (lower bound)). |
| `critical` | `priority:critical` | 0 | FR-016 | Earlier bare-label mapping (#2523) names priority:critical, which resolves to priority:critical (1 public repository, 0 counted items (lower bound)). |
| `dependencies` | `area:dependencies` | 0 | FR-016 | Earlier bare-label mapping (#2523) names area:dependencies, which resolves to area:dependencies (38 public repositories, 0 counted items (lower bound)). |
| `design` | `type:design` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:design, which resolves to type:design (1 public repository, 0 counted items (lower bound)). |
| `Documentation` | `type:docs` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:documentation, which resolves to type:docs (1 public repository, 0 counted items (lower bound)). |
| `duplicate` | `status:duplicate` | 0 | FR-016 | Earlier bare-label mapping (#2523) names status:duplicate, which resolves to status:duplicate (2 public repositories, 0 counted items (lower bound)). |
| `enhancement` | `type:improve` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:improve, which resolves to type:improve (7 public repositories, 0 counted items (lower bound)). |
| `feature` | `type:feature` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:feature, which resolves to type:feature (1 public repository, 0 counted items (lower bound)). |
| `help wanted` | `contrib:help-wanted` | 0 | FR-016 | Earlier bare-label mapping (#2523) names contrib:help-wanted, which resolves to contrib:help-wanted (2 public repositories, 0 counted items (lower bound)). |
| `Improvement` | `type:improve` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:improve, which resolves to type:improve (1 public repository, 0 counted items (lower bound)). |
| `infrastructure` | `area:infrastructure` | 0 | FR-016 | Earlier bare-label mapping (#2523) names area:infrastructure, which resolves to area:infrastructure (1 public repository, 0 counted items (lower bound)). |
| `invalid` | `status:wontfix` | 0 | FR-016 | Earlier bare-label mapping (#2523) names status:wontfix, which resolves to status:wontfix (2 public repositories, 0 counted items (lower bound)). |
| `meta:refactor` | `type:refactor` | 1 | FR-016 | Proposed merge: same word as refactor and type/refactor, which already resolve to type:refactor (1 public repository, 1 counted item (lower bound)). Change request #3834. |
| `migrate:ai-ops:agents` | `aiops:agents` | 2 | FR-016 | migrate:* label; its name points to ai-ops:agents, which resolves to aiops:agents (1 public repository, 2 counted items (lower bound)). |
| `migrate:area:tests` | `area:testing` | 27 | FR-016 | migrate:* label; its name points to area:tests, which resolves to area:testing (1 public repository, 27 counted items (lower bound)). |
| `migrate:type:investigation` | `type:research` | 0 | FR-016 | migrate:* label; its name points to type:investigation, which resolves to type:research (1 public repository, 0 counted items (lower bound)). |
| `migrate:type:ui` | `type:design` | 0 | FR-016 | migrate:* label; its name points to type:ui, which resolves to type:design (1 public repository, 0 counted items (lower bound)). |
| `needs-triage` | `status:needs-triage` | 0 | FR-016 | Earlier bare-label mapping (#2523) names status:needs-triage, which resolves to status:needs-triage (1 public repository, 0 counted items (lower bound)). |
| `observability` | `area:observability` | 1 | FR-016 | Proposed merge: same word as area:observability, requested in #3554 for logs, metrics and traces (1 public repository, 1 counted item (lower bound)). Change request #3834. |
| `performance` | `type:performance` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:performance, which resolves to type:performance (1 public repository, 0 counted items (lower bound)). |
| `Performance` | `type:performance` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:performance, which resolves to type:performance (1 public repository, 0 counted items (lower bound)). |
| `refactor` | `type:refactor` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:refactor, which resolves to type:refactor (2 public repositories, 0 counted items (lower bound)). |
| `release` | `type:release` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:release, which resolves to type:release (1 public repository, 0 counted items (lower bound)). |
| `status: completed` | `status:done` | 0 | FR-016 | Same name as status:completed apart from case or separator, which resolves to status:done (1 public repository, 0 counted items (lower bound)). |
| `Task` | `type:task` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:task, which resolves to type:task (1 public repository, 0 counted items (lower bound)). |
| `test` | `type:test` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:test, which resolves to type:test (3 public repositories, 0 counted items (lower bound)). |
| `testing` | `area:testing` | 0 | FR-016 | Earlier bare-label mapping (#2523) names area:tests, which resolves to area:testing (2 public repositories, 0 counted items (lower bound)). |
| `type/documentation` | `type:docs` | 0 | FR-016 | Same name as type:documentation apart from case or separator, which resolves to type:docs (1 public repository, 0 counted items (lower bound)). |
| `ui` | `type:design` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:ui, which resolves to type:design (1 public repository, 0 counted items (lower bound)). |
| `ux` | `type:design` | 0 | FR-016 | Earlier bare-label mapping (#2523) names type:ux-feedback, which resolves to type:design (1 public repository, 0 counted items (lower bound)). |
| `wontfix` | `status:wontfix` | 0 | FR-016 | Earlier bare-label mapping (#2523) names status:wontfix, which resolves to status:wontfix (2 public repositories, 0 counted items (lower bound)). |

### re-prefix (8)

| Source | Target | Items | Rule | Notes |
| --- | --- | ---: | --- | --- |
| `type:help` | `type:task` | 0 | FR-015 |  |
| `type:support` | `type:task` | 0 | FR-015 |  |
| `type:investigation` | `type:research` | 0 | FR-015 |  |
| `type:maintenance` | `type:chore` | 10 | FR-015 |  |
| `type:qa` | `type:test` | 0 | FR-015 |  |
| `type:ui` | `type:design` | 0 | FR-015 |  |
| `type:ux-feedback` | `type:design` | 0 | FR-015 |  |
| `type:integration` | `type:feature` | 0 | FR-015 |  |

### swap (1)

| Source | Target | Items | Rule | Notes |
| --- | --- | ---: | --- | --- |
| `type:question` | retire | 0 | FR-014 | Retired; open questions become Discussions (discussion:support) and closed ones are relabelled type:task + discussion:support before deletion. type:decision already holds its slot (Stage 0a). |

### team-scope (4)

| Source | Target | Items | Rule | Notes |
| --- | --- | ---: | --- | --- |
| `area:xero` | retire | 1 | FR-012 | Project-specific; moved to a Linear team, not imported. |
| `area:flow` | retire | 11 | FR-012 | Project-specific; moved to a Linear team, not imported. |
| `area:jobs` | retire | 2 | FR-012 | Project-specific; moved to a Linear team, not imported. |
| `area:monorepo` | retire | 1 | FR-012 | Project-specific; moved to a Linear team, not imported. |

### import (49)

| Source | Target | Items | Rule | Notes |
| --- | --- | ---: | --- | --- |
| `area:builds` | retire | 424 | FR-012 | Requested in #3554. |
| `area:monitoring` | retire | 8 | FR-012 | Requested in #3554. |
| `area:observability` | retire | 3 | FR-012 | Requested in #3554. |
| `area:workflows` | retire | 12 | FR-012 | Requested in #3554. |
| `meta:needs-approval` | retire | 3 | FR-012, FR-021 | Requested in #3554. |
| `CI/CD` | retire | 1 | FR-012 | Proposed: applied to 1 Linear issue. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `Hosting` | retire | 13 | FR-012 | Proposed: applied to 13 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `aiops:instructions` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `aiops:tools` | retire | 4 | FR-012 | Proposed: applied to 4 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `area:api` | retire | 3 | FR-012 | Proposed: applied to 3 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:auth` | retire | 6 | FR-012 | Proposed: applied to 6 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:backend` | retire | 24 | FR-012 | Proposed: applied to 24 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:changelog` | retire | 7 | FR-012 | Proposed: applied to 7 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:communication` | retire | 4 | FR-012 | Proposed: applied to 4 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:db` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:extension` | retire | 5 | FR-012 | Proposed: applied to 5 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:frontend` | retire | 22 | FR-012 | Proposed: applied to 22 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:hosting` | retire | 6 | FR-012 | Proposed: applied to 6 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:labels` | retire | 56 | FR-012 | Proposed: applied to 56 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3757. |
| `area:mcp` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:migration` | retire | 7 | FR-012 | Proposed: applied to 7 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:projects` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:reports` | retire | 5 | FR-012 | Proposed: applied to 5 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:specification` | retire | 40 | FR-012 | Proposed: applied to 40 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:templates` | retire | 11 | FR-012 | Proposed: applied to 11 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:website` | retire | 106 | FR-012 | Proposed: applied to 106 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `bug` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the Linear label's own; description is a placeholder. Check both at approval. Change request #3834. |
| `ci-runner-audit-2026-07-20` | retire | 13 | FR-012 | Proposed: applied to 13 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `comp:query-loop` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `comp:readme-mermaid` | retire | 3 | FR-012 | Proposed: applied to 3 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `epic` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `harvest-parity` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `master-ci-red` | retire | 8 | FR-012 | Proposed: applied to 8 Linear issues. Colour is the Linear label's own; description is a placeholder. Check both at approval. Change request #3834. |
| `meta:aiops` | retire | 1 | FR-012 | Proposed: applied to 1 Linear issue. Colour is the family default; description is a placeholder. Check both at approval. Change request #3834. |
| `meta:audit` | retire | 42 | FR-012 | Proposed: applied to 42 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:dependabot-security` | retire | 1 | FR-012 | Proposed: applied to 1 Linear issue. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:enhancement` | retire | 4 | FR-012 | Proposed: applied to 4 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:incident-report` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:infrastructure-blocker` | retire | 3 | FR-012 | Proposed: applied to 3 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:needs-audit` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is a placeholder. Check both at approval. Change request #3834. |
| `meta:needs-triage` | retire | 1 | FR-012 | Proposed: applied to 1 Linear issue. Colour is the family default; description is a placeholder. Check both at approval. Change request #3834. |
| `meta:refactor-rules` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:release-plan` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:tech-debt` | retire | 1 | FR-012 | Proposed: applied to 1 Linear issue. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:tracking` | retire | 3 | FR-012 | Proposed: applied to 3 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `security` | retire | 11 | FR-012 | Proposed: applied to 11 Linear issues. Colour is the Linear label's own; description is a placeholder. Check both at approval. Change request #3834. |
| `status:needs-analysis` | retire | 3 | FR-012 | Proposed: applied to 3 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `status:needs-cleanup` | retire | 5 | FR-012 | Proposed: applied to 5 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `status:needs-template-fix` | retire | 207 | FR-012 | Proposed: applied to 207 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |

### retire (57)

| Source | Target | Items | Rule | Notes |
| --- | --- | ---: | --- | --- |
| `openspec:domain` | retire | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed retirement: a namespace prefix used in examples (openspec:domain/governance), not a label. |
| `openspec:priority` | retire | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed retirement: a namespace prefix used in examples (openspec:priority/medium), not a label. |
| `openspec:status` | retire | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed retirement: a namespace prefix used in examples (openspec:status/production), not a label. |
| `openspec:tracking` | retire | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed retirement: no spec status label matches tracking. |
| `openspec:unknown` | retire | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed retirement: a placeholder value, not a label. |
| `agent-audit` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `aiops:agents` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `aiops:chat-modes` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `aiops:datasets` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `aiops:evaluations` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `aiops:prompts` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `area:linting` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `area:onboarding` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `documentation` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `important` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `meta:analysis` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `migrate:area:automation` | retire | 162 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:area:ci` | retire | 109 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:area:documentation` | retire | 65 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:area:scripts` | retire | 5 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:openspec:status/implementation` | retire | 2 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:openspec:status/planning` | retire | 4 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:openspec:status/production` | retire | 1 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:openspec:status/testing` | retire | 1 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:priority:critical` | retire | 49 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:priority:important` | retire | 112 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:priority:minor` | retire | 1 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:priority:normal` | retire | 288 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:status:needs-more-info` | retire | 311 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:status:needs-triage` | retire | 29 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:status:ready` | retire | 58 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:a11y` | retire | 0 | FR-012 | migrate:* labels are never imported. |
| `migrate:type:ai-ops` | `type:aiops` | 2 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). For the GitHub dry run it migrates to type:aiops, the label its name points to after renames (FR-016). |
| `migrate:type:audit` | retire | 51 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:automation` | retire | 39 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:bug` | retire | 102 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:compatibility` | retire | 1 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:documentation` | `type:docs` | 1 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). For the GitHub dry run it migrates to type:docs, the label its name points to after renames (FR-016). |
| `migrate:type:epic` | retire | 1 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:feature` | retire | 84 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:improve` | retire | 2 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:maintenance` | `type:chore` | 11 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). For the GitHub dry run it migrates to type:chore, the label its name points to after renames (FR-016). |
| `migrate:type:refactor` | retire | 19 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:security` | retire | 5 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:task` | retire | 287 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:test` | retire | 30 | FR-012 | migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run). |
| `migrate:type:ux-feedback` | `type:design` | 0 | FR-012 | migrate:* labels are never imported. For the GitHub dry run it migrates to type:design, the label its name points to after renames (FR-016). |
| `scope:restructuring` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `spec:discovery` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `spec:implementation-complete` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `spec:implementation-in-progress` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `spec:implementation-pending` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `spec:planning` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `spec:specification-complete` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `spec:specification-in-progress` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `spec:status-production` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |
| `spec:status-testing` | retire | 0 | FR-012 | Linear-only with zero issues; retire, not import. |

## Gap entries needing a decision

| Source | Target | Items | Rule | Notes |
| --- | --- | ---: | --- | --- |
| `openspec:domain` | retire | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed retirement: a namespace prefix used in examples (openspec:domain/governance), not a label. |
| `openspec:implementation` | `spec:implementation-in-progress` | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed rename to spec:implementation-in-progress: generic implementation stage. |
| `openspec:priority` | retire | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed retirement: a namespace prefix used in examples (openspec:priority/medium), not a label. |
| `openspec:specification` | `spec:specification-in-progress` | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed rename to spec:specification-in-progress: generic specification stage. |
| `openspec:specification-pending` | `spec:planning` | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed rename to spec:planning: specification not started yet; closest status is planning. |
| `openspec:status` | retire | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed retirement: a namespace prefix used in examples (openspec:status/production), not a label. |
| `openspec:tracking` | retire | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed retirement: no spec status label matches tracking. |
| `openspec:unknown` | retire | 0 | FR-011 | Used in files but not defined in labels.yml. Proposed retirement: a placeholder value, not a label. |
| `spec:001` | `spec-id:001` | 0 | FR-011 | Spec numbers move to spec-id:NNN so spec:* holds only status labels. |

## Proposed beyond the spec

| Source | Target | Items | Rule | Notes |
| --- | --- | ---: | --- | --- |
| `type: feature` | `type:feature` | 1 | FR-014 | Proposed (not listed in FR-012): spacing variant of type:feature; spacing variants are separate sources (FR-023 point 8). Needed so the type family ends at exactly 25. |
| `type:build-ci` | `type:ci` | 1 | FR-014 | Proposed (not listed in FR-012): Linear-only duplicate; FR-019 renames the Build & CI type to CI. Needed so the type family ends at exactly 25. |
| `type:code-refactor` | `type:refactor` | 3 | FR-014 | Proposed (not listed in FR-012): Linear-only duplicate; FR-019 renames the Code Refactor type to Refactor. Needed so the type family ends at exactly 25. |
| `type:documentation` | `type:docs` | 1 | FR-014 | Proposed (not listed in FR-012): Linear-only duplicate of type:docs. Needed so the type family ends at exactly 25. |
| `CI/CD` | retire | 1 | FR-012 | Proposed: applied to 1 Linear issue. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `Hosting` | retire | 13 | FR-012 | Proposed: applied to 13 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `aiops:instructions` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `aiops:tools` | retire | 4 | FR-012 | Proposed: applied to 4 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `area:api` | retire | 3 | FR-012 | Proposed: applied to 3 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:auth` | retire | 6 | FR-012 | Proposed: applied to 6 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:backend` | retire | 24 | FR-012 | Proposed: applied to 24 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:changelog` | retire | 7 | FR-012 | Proposed: applied to 7 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:communication` | retire | 4 | FR-012 | Proposed: applied to 4 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:db` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:extension` | retire | 5 | FR-012 | Proposed: applied to 5 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:frontend` | retire | 22 | FR-012 | Proposed: applied to 22 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:hosting` | retire | 6 | FR-012 | Proposed: applied to 6 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:labels` | retire | 56 | FR-012 | Proposed: applied to 56 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3757. |
| `area:mcp` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:migration` | retire | 7 | FR-012 | Proposed: applied to 7 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:projects` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:reports` | retire | 5 | FR-012 | Proposed: applied to 5 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:specification` | retire | 40 | FR-012 | Proposed: applied to 40 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:templates` | retire | 11 | FR-012 | Proposed: applied to 11 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `area:website` | retire | 106 | FR-012 | Proposed: applied to 106 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `bug` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the Linear label's own; description is a placeholder. Check both at approval. Change request #3834. |
| `ci-runner-audit-2026-07-20` | retire | 13 | FR-012 | Proposed: applied to 13 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `comp:query-loop` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `comp:readme-mermaid` | retire | 3 | FR-012 | Proposed: applied to 3 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `epic` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `harvest-parity` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the Linear label's own; description is Linear's own. Check both at approval. Change request #3834. |
| `master-ci-red` | retire | 8 | FR-012 | Proposed: applied to 8 Linear issues. Colour is the Linear label's own; description is a placeholder. Check both at approval. Change request #3834. |
| `meta:aiops` | retire | 1 | FR-012 | Proposed: applied to 1 Linear issue. Colour is the family default; description is a placeholder. Check both at approval. Change request #3834. |
| `meta:audit` | retire | 42 | FR-012 | Proposed: applied to 42 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:dependabot-security` | retire | 1 | FR-012 | Proposed: applied to 1 Linear issue. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:enhancement` | retire | 4 | FR-012 | Proposed: applied to 4 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:incident-report` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:infrastructure-blocker` | retire | 3 | FR-012 | Proposed: applied to 3 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:needs-audit` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is a placeholder. Check both at approval. Change request #3834. |
| `meta:needs-triage` | retire | 1 | FR-012 | Proposed: applied to 1 Linear issue. Colour is the family default; description is a placeholder. Check both at approval. Change request #3834. |
| `meta:refactor-rules` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:release-plan` | retire | 2 | FR-012 | Proposed: applied to 2 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:tech-debt` | retire | 1 | FR-012 | Proposed: applied to 1 Linear issue. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `meta:tracking` | retire | 3 | FR-012 | Proposed: applied to 3 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `security` | retire | 11 | FR-012 | Proposed: applied to 11 Linear issues. Colour is the Linear label's own; description is a placeholder. Check both at approval. Change request #3834. |
| `status:needs-analysis` | retire | 3 | FR-012 | Proposed: applied to 3 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `status:needs-cleanup` | retire | 5 | FR-012 | Proposed: applied to 5 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |
| `status:needs-template-fix` | retire | 207 | FR-012 | Proposed: applied to 207 Linear issues. Colour is the family default; description is Linear's own. Check both at approval. Change request #3834. |

## Where the FR-015 labels live

FR-015 calls its eight type labels "Linear-only". Checked on 2026-10-06, all eight exist as live GitHub labels in `lightspeedwp/.github` (`evidence/github-live-labels.json`). In Linear only `type:maintenance` exists. Six complete team listings, the workspace listing and the Stage 1 export show none of the other seven. The GitHub team listing was cut off at 250, so that is not absolute. They are not imported into Linear (FR-015 and the 25-label type family), so each row is a GitHub re-prefix. The spec wording should say "GitHub" and not "Linear-only". 

## Label coverage across the organisation

Source: the weekly label drift check run of 2026-10-04 (283 repositories read, 59 skipped as archived or forks), kept in `evidence/github-label-coverage.json`. It lists 446 labels that exist in public repositories but not in `labels.yml`, and counts 57 more that exist only in private repositories and are not named here.

Every one of them now has a row (296 new rows for 446 names, the rest were already approved or mapped): 247 retire, 40 merge, 9 rename. A name that differs only in case or separator is renamed, the earlier bare-label mapping (#2523) is followed through the current renames, and every other label is retired with a stated reason. Run against the real tool, all 374 labels outside the approved set in `lightspeedwp/.github` have a row.

20 labels carry known items and have no target that the spec or the label documents define, so the tool lists them under `needs_decision` per repository, as FR-016 requires, until a target is chosen: `area:monorepo`, `agent-audit`, `migrate:openspec:status/implementation`, `migrate:openspec:status/planning`, `migrate:openspec:status/production`, `migrate:openspec:status/testing`, `migrate:type:compatibility`, `ag-p14`, `ag-phase`, `bug-fix`, `code-quality`, `error-handling`, `logging`, `migrate:type:enhancement`, `phase-1-critical`, `phase-2-medium`, `phase-3-polish`, `phase:1`, `reliability`, `reviewer`. The item counts are a lower bound, because the drift report caps counted rows.

The 2026-10-06 drift run reports the 85 active public repositories only and summarises the private ones, so it is not comparable; the 2026-10-04 run, which included the private repositories, is the inventory of record.

## Impact

- Items carrying a source label move to its target. Open items move first; closed items only where a target exists.
- Retired labels are deleted only after the per-repository dry-run approval on the deletion gate issue.
- Linear: label creation is restricted afterwards (T071), so the imports are the last new labels.

## Platform checks (Linear documentation, read 2026-10-06)

- Linear merges labels natively and rescopes them between workspace and team ([Issue labels](https://linear.app/docs/labels)), so each `merge` row is a supported operation.
- Deleting a label removes it from every issue and cannot be undone; archiving keeps it on past issues and blocks new use. This matches the spec: Linear labels are retired (archived), never deleted.
- Only one label from a label group can sit on an issue. A live read-only check on 2026-10-06 found no label groups in the workspace, so the type labels are flat and Linear does not enforce one type per issue. The "exactly one `type:*` per issue" rule must be enforced and verified by the consolidation tool (T064, T069), not assumed from Linear.
- The same check confirmed that `type: feature`, `type:build-ci` and `type:code-refactor` are team-scoped (GIT team, 1, 1 and 3 issues in the export) and `type:documentation` is workspace-scoped. Team and workspace labels can both be merged. Counts are from the Stage 1 export and have since moved, so Stage 5 re-reads live counts before it writes.
- The GitHub issue sync is bidirectional and includes labels ([GitHub Issues Sync](https://linear.app/changelog/2023-12-14-github-issues-sync)). That is why the spec turns the sync off from Stage 3 to Stage 5 (T071, T083).
- Issue label management can be limited to team owners ([Teams](https://linear.app/docs/teams)), which is how T071 restricts label creation.

## Approval

Reply on this issue with a comment starting `Approved` and the date. Edits to individual rows can be listed in the same comment.
