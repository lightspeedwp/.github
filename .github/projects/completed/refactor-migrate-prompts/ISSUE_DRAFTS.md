---
file_type: documentation
title: "Issue Drafts - Refactor Migrate Prompts"
description: "Manual fallback issue drafts aligned to OpenSpec strict proposal files"
version: "1.0.0"
last_updated: "2026-06-01"
status: completed
---

# Issue Drafts

## Parent Epic Draft

- Title: `[Epic] Prompt library scope classification and migration governance`
- Template: `.github/ISSUE_TEMPLATE/05-epic.md`
- Labels: `status:needs-planning`, `priority:important`, `type:task`, `area:documentation`, `area:automation`

### Body

Define and execute the migration strategy for prompt assets between `.github/prompts/` and root `prompts/`.

#### Goals

1. Establish canonical prompt boundaries.
2. Execute migration with explicit mapping, refactoring, and validation.
3. Prevent path breakage with deprecation guidance and updated indexes.

#### Acceptance Criteria

- [x] Final prompt matrix approved.
- [x] Approved move set refactored to root standard.
- [x] References and discoverability updated in both prompt directories.
- [x] Validation completed for formatting, links, and smoke usage paths.

#### Child Issue Links

- [x] Child 01-1 Inventory/classification
- [x] Child 01-2 Refactor org-wide prompts
- [x] Child 01-3 Migrate references/deprecations
- [x] Child 01-4 Validation/rollout controls

## Child Drafts

### Child 01-1

- Title: `[Task] Inventory and classify .github prompt assets with final target mapping`
- Template: `.github/ISSUE_TEMPLATE/22-audit.md`
- Labels: `status:needs-review`, `priority:important`, `type:audit`, `area:documentation`

Deliverables:

1. Final migration matrix covering all source prompts.
2. Explicit rename/target mapping for every moved prompt.
3. Successor mapping for every merged/deprecated prompt.

Acceptance criteria:

- [x] Matrix coverage equals source prompt count.
- [x] Every `move` has a concrete `prompts/*.prompt` target path.
- [x] Every `merge/deprecate` has a named successor prompt.
- [x] Action counts are internally consistent with matrix rows.

### Child 01-2

- Title: `[Task] Refactor org-wide prompts to root prompts standard`
- Template: `.github/ISSUE_TEMPLATE/20-documentation.md`
- Labels: `status:needs-review`, `priority:important`, `type:documentation`, `area:documentation`

Deliverables:

1. Refactored root prompt targets for all approved move items.
2. Standardised frontmatter and section structure.
3. Execution evidence listing produced files and validation checks.

Acceptance criteria:

- [x] All move targets exist at mapped paths.
- [x] Prompt files have consistent frontmatter and structure.
- [x] Legacy intent is preserved during transition.
- [x] Output evidence file documents completion and counts.

### Child 01-3

- Title: `[Task] Migrate files, update prompt references, and add deprecation paths`
- Template: `.github/ISSUE_TEMPLATE/01-task.md`
- Labels: `status:needs-review`, `priority:normal`, `type:task`, `area:documentation`, `area:automation`

Deliverables:

1. Updated `prompts/README.md` with migrated prompt catalogue.
2. Updated `.github/prompts/README.md` clarifying control-plane-only scope.
3. Deprecation notes for legacy prompts that moved or merged.

Acceptance criteria:

- [x] Both prompt READMEs reflect canonical boundaries.
- [x] Legacy prompts include clear successor path notes where required.
- [x] Link checks pass for prompt indexes and cross-references.
- [x] Migration guidance is explicit and reproducible.

### Child 01-4

- Title: `[Task] Validate migrated prompt library and define rollout controls`
- Template: `.github/ISSUE_TEMPLATE/12-testing-coverage.md`
- Labels: `status:needs-review`, `priority:normal`, `type:task`, `area:quality`, `area:documentation`

Deliverables:

1. Validation checklist and evidence (format, links, smoke usage).
2. Known caveats and compatibility notes.
3. Rollout and fallback guidance for one release cycle.

Acceptance criteria:

- [x] Markdown/frontmatter validation passes for migrated files.
- [x] Prompt index and cross-reference links resolve correctly.
- [x] Representative prompt usage smoke tests are documented.
- [x] Rollout notes specify fallback behaviour and sunset timing.
