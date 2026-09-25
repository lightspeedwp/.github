# Feature Specification: GitHub Label Audit & Consolidation

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Feature Branch**: `audit/label-consolidation`

**Created**: 2026-09-14

**Status**: Draft

**Input**: Comprehensive audit of GitHub label taxonomy across `.github` repository, including analysis of canonical labels (169 total), issue types (25 mappings, 26 canonical labels), governance policy, documentation, and archived labeling workflows.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Audit Team Discovers Label Family Inconsistencies (Priority: P1)

As a GitHub governance administrator, I need to understand which labels exist in the system but are missing from the canonical `labels.yml` file, and which labels are documented in supporting files (governance policy, issue-types mapping) but have different names or implementations than what's in the canonical file.

**Why this priority**: This is the foundation for the entire audit. Without understanding what's missing and what's inconsistent, we cannot make informed decisions about consolidation or expansion. This directly blocks planning remediation steps.

**Independent Test**: Audit can be fully completed by comparing:

1. Current canonical `labels.yml` (169 labels across 15+ families)
2. `issue-types.yml` (25 type mappings; note: 26 type labels in canonical, including type:decision)
3. `label-governance-policy.yml` (never-delete list)
4. All documentation files (`LABEL_*.md`, `ISSUE_*.md`, `PR_*.md`)
5. Archived workflow definitions
6. GitHub API labels currently in use on the repository

And delivering a reconciliation report showing:

- Missing labels (exist in GitHub but not in canonical file)
- Misnamed labels (e.g., `type:documentation` vs `type:docs`)
- Duplicate labels across families
- Labels referenced in workflows but not in canonical file

**Acceptance Scenarios**:

1. **Given** the canonical `labels.yml` has 169 labels across 15+ families, **When** we compare against governance policy never-delete list, **Then** we identify which labels in the policy don't exist in canonical file or have different names
2. **Given** the `issue-types.yml` defines 25 type labels with specific mappings, **When** we cross-reference with labels.yml type family, **Then** we confirm all 25 type labels are present and identify any mismatches (e.g., `type:documentation` vs `type:docs`)
3. **Given** documentation files (LABEL_*.md, ISSUE_*.md, PR_*.md) describe labeling strategy and taxonomy, **When** we audit these against canonical file, **Then** we identify what's documented but not implemented
4. **Given** 11 archived workflows in `.github/workflows/archived/2026-09-11/labeling/`, **When** we analyze these workflows, **Then** we identify what labels they were trying to manage and why they were archived

---

### User Story 2 - Identify & Catalog Duplicate Labels (Priority: P2)

As an automation engineer, I need to identify all duplicate labels that should be consolidated (e.g., `type:documentation` should merge into `type:docs`), so we can plan a consolidation strategy that doesn't break existing automation or user workflows.

**Why this priority**: Once we know what's inconsistent, we need to identify duplicates that represent the same concept with different naming. This enables informed decisions about which labels to keep and which to retire.

**Independent Test**: Completed by creating a detailed catalog of:

- All label families with duplicates marked
- Suggested consolidation pairs (source → target)
- Impact analysis (which workflows/automations use each label)
- Migration strategy (renaming, aliasing, or deprecation timeline)

**Acceptance Scenarios**:

1. **Given** `type:documentation` exists in policy but `type:docs` is canonical, **When** we analyze usage, **Then** we identify which should be the source of truth and plan migration
2. **Given** area labels like `area:ai`, `area:agents`, `area:skills`, `area:instructions`, `area:prompts` might overlap conceptually, **When** we audit their definitions and usage, **Then** we determine if any should be consolidated or if they serve distinct purposes
3. **Given** multiple families might have labeling gaps, **When** we identify all labels across families that lack documentation or policy definition, **Then** we flag these as potential duplicates or policy issues

---

### User Story 3 - Audit Archived Labeling Workflows & Plan Restoration (Priority: P3)

As a DevOps/automation lead, I need to understand why 11 labeling workflows were archived, what they were meant to do, and whether they should be restored or replaced with improved implementations.

**Why this priority**: The workflows are archived because they're not working properly. Understanding their purpose and issues is critical for either fixing them or designing better solutions. This supports future automation improvements.

**Independent Test**: Completed by delivering:

- Analysis of each archived workflow (purpose, implementation, failure points)
- Root cause assessment (why each was archived)
- Recommendations (restore, rebuild, or retire)
- Implementation plan for restoring working workflow automation

**Acceptance Scenarios**:

1. **Given** 11 archived workflow files in `workflows/archived/2026-09-11/labeling/`, **When** we analyze each workflow's logic and failure points, **Then** we document what each was attempting to automate and why it failed
2. **Given** labeling automation is critical to issue/PR routing and release workflows, **When** we assess the archived workflows, **Then** we identify which automation gaps still exist and need to be filled
3. **Given** the unified labeling agent and workflow are meant to be the single source for labeling automation, **When** we review archived workflows, **Then** we confirm they're duplicates/obsolete or identify legitimate gaps in current automation

---

### User Story 4 - Governance Lead Aligns GitHub and Linear Labels (Priority: P1)

As the label governance owner (@ashley), I need GitHub and Linear to share one approved label set, so that labels created ad hoc in any repository stop syncing into Linear, every issue carries exactly one valid type label, and automation and reporting read consistent labels across both systems.

**Why this priority**: Unapproved GitHub labels are actively syncing into Linear and creating duplicates (for example `scope:website` and `scope: website`, and `status:done` being recreated). The audit (User Story 1) identifies the problems; this story fixes them. It starts once User Story 1 evidence is available and the `[LABEL-UPDATE-REQUEST]` mapping is approved.

**Independent Test**: Completed when, after one approved consolidation run, every `lightspeedwp` repository and the Linear workspace show only labels from `labels.yml` (plus documented team-scoped project labels), the type family contains exactly 25 labels each tied to one issue type, and the first weekly drift report lists zero differences (SC-003, SC-009).

**Acceptance Scenarios**:

1. **Given** `labels.yml` defines `ai-ops:*` (7) and `openspec:*` (9) labels, **When** the approved rename runs, **Then** every repository shows `aiops:*` and `spec:*` in their place, and issues that carried the old labels now carry the new ones (FR-011)
2. **Given** a Linear-only label applied to at least one issue or required by automation (for example `area:builds`, 232 issues, or `status:needs-template-fix`), **When** the import runs, **Then** it appears in `labels.yml` and in every repository; **and given** a Linear-only label with zero issues, **Then** it is retired in Linear and not imported (FR-012)
3. **Given** an approved merge pair (for example `priority:medium` → `priority:normal`), **When** consolidation runs, **Then** every issue and PR that carried the source label carries the target label, and the source label no longer exists in GitHub or Linear (FR-012)
4. **Given** the Question issue type and `type:question`, **When** the swap is applied, **Then** the Decision issue type and template replace them, open `type:question` issues are converted to Discussions, closed ones are relabelled `type:task` + `discussion:support`, and the type family has exactly 25 labels (FR-014, SC-003)
5. **Given** a Linear issue carrying one of the eight Linear-only type labels (for example `type:maintenance`), **When** the re-prefix runs, **Then** it carries exactly one approved `type:*` label plus the mapped concept label (for example `type:chore` + `area:maintenance`) (FR-015)
6. **Given** live files that reference OpenSpec in content or path, **When** the Spec Kit rename is complete, **Then** a case-insensitive search for `openspec` in contents and paths returns zero matches outside `node_modules/`, `*/reports/*` and `*/archived/*`, and every renamed path is recorded in the migration issue (FR-013)
7. **Given** a repository label outside the approved set, **When** @ashley has approved that repository's dry-run list, **Then** the label is deleted, after any open issue or PR carrying it has been moved to its approved equivalent; **and given** no approval for a repository, **Then** nothing in it is deleted (FR-016)
8. **Given** the issue-type list in `contracts/issue-types-org-settings.md`, **When** the first consolidation step is done, **Then** `issue-types.yml`, the `type:*` labels in `labels.yml` and the organisation's issue types settings page show the same 25 names, descriptions and colours (FR-019, FR-020)
9. **Given** someone creates an unapproved label after consolidation, **When** the weekly drift check runs, **Then** the single drift report issue lists the label, the repository or Linear location, and when it was first seen (FR-017)
10. **Given** the labels requested in [#3554](https://github.com/lightspeedwp/.github/issues/3554) (`area:builds`, `area:monitoring`, `area:observability`, `area:workflows`, `meta:needs-approval`), which already exist in Linear, **When** the configuration change merges, **Then** each is declared once in `labels.yml` with the description from #3554 and the colour set by FR-012 (`meta:needs-approval` `57606A`; the `area:*` labels as given in #3554), and the Linear label of the same name is updated to match rather than recreated (FR-012)
11. **Given** a change request or gate issue that cannot proceed until a named person records a decision, **When** it is opened, **Then** it carries `meta:needs-approval`, and the label is removed once a dated approval or rejection and the resulting scope are recorded on the issue (FR-021)

---

### Edge Cases

- What happens when a label exists in GitHub but nowhere in our documentation (orphan labels)?
- How are labels that were accidentally created (typos, test labels) identified and marked for cleanup?
- What if workflows reference labels that no longer align with the current taxonomy?
- How do we handle labels that exist but have zero usage (dormant labels)?
- A target label already exists in a repository (for example `status:done` next to `status:completed`), so an in-place rename is impossible: the source label is replaced on every issue and PR first, then retired (FR-012)
- A repository has more than 100 labels: inventory and deletion must page through all of them, or orphans are silently missed (FR-016)
- The Linear GitHub sync recreates a label while consolidation is running (as happened to `status:done` on 2026-09-24): GitHub deletions are completed before Linear clean-up, and the drift check reports any label that reappears (FR-016, FR-017)
- An issue would end up with two `type:*` labels after a merge: the concept label is retired instead of merged, so exactly one type label remains (FR-012, FR-015)
- An open `type:question` issue cannot be converted to a Discussion (for example, Discussions are disabled in that repository): it is relabelled `type:task` + `discussion:support` and listed in the dry run (FR-014)
- A renamed OpenSpec path is still linked from a dated report or archived file: those links are left as historical record and excluded from the completion check (FR-013)
- A label change request contradicts an approved merge or rename (for example #3554 asked for `area:observability` as its own label while FR-012 merged it into `area:monitoring`; resolved by keeping both): the conflict is resolved in this specification before the request is approved, so the mapping never holds both (FR-012)
- A label imported from Linear already exists there with a different colour or description: the Linear label is updated in place to match `labels.yml`, never deleted and recreated, so its issue associations are kept (FR-012)
- The labelling agent meets a label that is not in `labels.yml` before Stage 3 (for example a Linear-only label that the mapping will import): it leaves the label in place, so nothing is lost before the approved mapping exists (FR-022)
- `meta:needs-approval` is left on an issue after the decision is recorded, or added to ordinary review work: the SC-010 check finds it and the label is removed (FR-021)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST identify and catalog all labels currently defined in the canonical `labels.yml` file (169 labels), organized by family, with counts and descriptions
- **FR-002**: System MUST extract all 25 type mappings from `issue-types.yml` and verify each has a corresponding entry in `labels.yml` with matching name and color. Canonical `labels.yml` currently contains 26 `type:*` labels: the 25-label mapping set plus `type:decision`, which is currently excluded from that mapping set (resolved by FR-014)
- **FR-003**: System MUST compare canonical labels against the `label-governance-policy.yml` never-delete list and identify:
  - Labels in the policy that don't exist in canonical file
  - Labels with name mismatches between files (e.g., `type:documentation` vs `type:docs`)
  - Labels with different color assignments
- **FR-004**: System MUST audit all documentation files (`docs/LABEL_*.md`, `docs/ISSUE_*.md`, `docs/PR_*.md`) against canonical labels and identify:
  - Labels mentioned in docs that aren't in canonical file
  - Discrepancies between documented behavior and actual label definitions
  - Documentation gaps for labels that exist in canonical file
- **FR-005**: System MUST analyze all 11 archived workflow files in `.github/workflows/archived/2026-09-11/labeling/` and extract:
  - Purpose/intent of each workflow
  - Labels referenced in each workflow
  - Apparent failure points or design issues
  - Relationships to the current unified labeling agent
- **FR-006 (Incomplete)**: System MUST query the GitHub API to obtain the full repository label set and identify labels that may not be in the canonical file (orphan/undocumented labels). `github-api-labels.json` contains no verified GitHub label inventory, so the orphan-label audit MUST remain incomplete until that inventory is obtained
- **FR-007**: System MUST identify potential duplicate labels (multiple labels that represent the same concept with different naming conventions)
- **FR-008**: The audit phase MUST NOT change any `type:*` label. In the consolidation phase, the only permitted type-family change is the FR-014 swap (`type:question` retired, `type:decision` mapped); no other `type:*` label may be added, removed or renamed
- **FR-009**: The audit phase (User Stories 1-3) MUST NOT edit locked configuration files (`labels.yml`, `issue-types.yml`, `label-governance-policy.yml`). The consolidation phase MAY change them only after the mapping in FR-012 is approved through a `[LABEL-UPDATE-REQUEST]` issue by @ashley. Two changes are exempt and may happen before that approval: (1) the Stage 0a issue-type change (FR-014, FR-020: `issue-types.yml`, the `type:*` labels in `labels.yml`, the Decision template), approved through #3530, the `[ISSUE-TYPE-UPDATE-REQUEST]` #3556 and the `[TEMPLATE-UPDATE-REQUEST]` #3557; and (2) removing labels that are not in `labels.yml` from the `label-governance-policy.yml` never-delete list, which cannot delete anything while `destructive_cleanup.enabled` stays `false`
- **FR-010**: System MUST document assumptions about which labels can be consolidated vs. which must be preserved due to existing automation
- **FR-011**: The target prefixes for the AI operations and specification-status families are `aiops:` and `spec:`. Until the approved rename is applied, the current prefixes in `.github/labels.yml` remain `ai-ops:` and `openspec:`, and the audit MUST treat them as the current declarations. Before the audit PR (#3362) merges, the spec 008 artefacts, the audit's analysis reports and the label docs on the audit branch MUST use the target names `aiops:*`, `type:aiops` and `spec:*`. The snapshot evidence files (`canonical-labels.json`, `label-families.json`, `label-inventory.json`, `label-inventory.csv`) MUST keep the names recorded on 2026-09-14, add each label's target name in a `target_name` field (a column in the CSV), and note this in `evidence/README.md`. `renamed-label-references.json` MUST keep the old names it records, since it lists the references still to change. The audit MUST catalogue the rename mappings `ai-ops:*` → `aiops:*` (7 labels) and `openspec:*` → `spec:*` (9 labels), and list every workflow, script, configuration and documentation reference to the old prefixes as impact evidence under FR-010
- **FR-012**: System MUST import into GitHub only those Linear-only labels that are applied to at least one Linear issue or are required by repository automation (for example `status:needs-template-fix`, used by `handle-needs-template-fix.js`), excluding labels resolved by FR-011 renames, FR-015 re-prefixes or the merges below. Linear-only labels with zero issues MUST be retired, not imported. Project-specific labels (`area:xero`, `area:flow`, `area:jobs`, `area:monorepo`) MUST be moved to team scope in Linear rather than imported. Approved merges: `area:ci-cd` → `area:ci`; `type:content-model` → `type:content-modelling`; `type:ai-ops` → `type:aiops`; `area:docs` → `area:documentation`; `area:ops` → `area:operations`; `scope:website` and `scope: website` → `area:website`; `status:planned` and `status:planning` → `status:needs-planning`; `priority:medium` → `priority:normal`; `status:completed` and `status:resolved` → `status:done`; `area:tests` → `area:testing` (test code and harnesses); `area:quality` → `area:qa` (QA processes and validation); `status:no-issue-activity` → `meta:no-issue-activity`; `status:ready-for-development` → `status:ready`; `status:in-review` → `status:needs-review`; `lang:scss` → `lang:css`; `comp:workflows` → `area:workflows`; `area:platform` → `area:infrastructure`; `area:process` and `area:standards` → `area:governance`; `area:pr-automation` and `area:issue-management` → `area:automation`; `area:design` → `area:design-system`; `scope:audit` → `meta:audit`; `scope:project-management` → `area:projects`; `meta:documentation` → `area:documentation`; `meta:ai-ops` → `area:ai`; `area:agents` → `aiops:agents`, `area:instructions` → `aiops:instructions` and `area:prompts` → `aiops:prompts` (AI assets live in `aiops:*`; `area:ai` stays as the single umbrella area label for AI work; `area:skills` stays until the mapping decides whether to add an `aiops:skills` label). `area:ci-cd`, `type:content-model`, `type:ai-ops` and `status:resolved` were already removed from Linear on 2026-09-24, so those merges apply to GitHub repositories only. Labels that would duplicate an issue's existing `type:*` label (`meta:enhancement`, `meta:refactor-rules`, `scope:restructuring`) are retired rather than merged. Where the target label already exists in a repo (for example `status:done`), the source label MUST be replaced on every issue and PR before it is retired. The import list and merge table MUST be recorded as evidence (`evidence/linear-labels.json`) before the `[LABEL-UPDATE-REQUEST]` is raised. [#3554](https://github.com/lightspeedwp/.github/issues/3554) is the `[LABEL-UPDATE-REQUEST]` for the first five imports (`area:builds`, `area:monitoring`, `area:observability`, `area:workflows`, `meta:needs-approval`), using the descriptions it gives; the Stage 1 `[LABEL-UPDATE-REQUEST]` covers the rest of the mapping and references #3554, and both are applied in the one configuration change. Every imported label MUST have a recorded colour and description in the mapping. Where `docs/LABEL_COLOR_STRATEGY.md` has a rule for the label's family, the imported label MUST use that colour (for example every `meta:*` label is `57606A`, so `meta:needs-approval` is `57606A`, not the `E1E4E8` in #3554); where it has no rule (currently `area:*`), the colour in the approved request is used, so #3554's `area:*` colours stand (`area:builds` `BFD4F2`, `area:monitoring` and `area:observability` `006B75`, `area:workflows` `0F448A`) until an `area:*` rule is added to the strategy. GitHub repos MUST be updated by renaming labels in place (never delete-and-recreate) so existing issue and PR associations are kept; deletion of labels outside the approved set follows FR-016
- **FR-014**: The type family MUST end at exactly 25 labels matching the 25 issue types allowed in GitHub and Linear. `type:question` is retired and `type:decision` takes its issue-type slot; questions move to GitHub Discussions (`discussion:support`). This requires `[ISSUE-TYPE-UPDATE-REQUEST]` and `[TEMPLATE-UPDATE-REQUEST]` approval to replace the Question issue type and `.github/ISSUE_TEMPLATE/06-question.md` with a Decision issue type and template. Decision work that changes files uses a `docs/` branch, so its PR is labelled `type:docs` and routed to `pr_docs.md` by branch prefix; the linked issue keeps `type:decision`. `type:question` leaves `labels.yml` in Stage 0a, but the label stays on repositories and in Linear until it is deleted (FR-016). Before it is deleted from any repository or from Linear, open issues carrying it MUST be converted to GitHub Discussions (Q&A category, `discussion:support`) and closed ones relabelled `type:task` + `discussion:support`; the same rule applies to `type:question` in Linear. PR routing stays branch-only in this spec: issue-type fallback routing (the `pr-template-resolver.yml` behaviour described in the constitution) is out of scope and deferred to a separate follow-up spec
- **FR-015**: The eight Linear-only type labels MUST NOT be imported as `type:*`. Every issue and PR keeps exactly one `type:*` label, so each affected Linear issue receives the listed type label and its concept moves to another family: `type:help` and `type:support` → `type:task` + `discussion:support`; `type:investigation` → `type:research`; `type:maintenance` → `type:chore` + `area:maintenance`; `type:qa` → `type:test` + `area:qa`; `type:ui` → `type:design` + `area:frontend`; `type:ux-feedback` → `type:design` + `discussion:feedback`; `type:integration` → `type:feature` + `area:integration`
- **FR-016**: After the FR-012 import is approved, the approved label set is `labels.yml`. Every label outside it MUST be deleted from all `lightspeedwp` repositories, because unapproved GitHub labels sync into Linear. Deletion MUST be gated: a new gate issue replaces closed issue #95 in `label-governance-policy.yml`, `destructive_cleanup.enabled` stays `false` in the repository (the policy file records the gate issue and approved labels, not an on/off switch), the deletion tooling deletes only when run with an explicit apply flag naming the gate issue and only for repositories whose dry run is marked approved, refusing otherwise, and a per-repository dry-run list is approved by @ashley before anything is deleted. Labels still applied to open issues or PRs MUST be migrated to their approved equivalent first. The inventory and deletion tooling MUST paginate so that no label is missed (`label-sync.js` reads only the first 100)
- **FR-017**: To prevent drift after consolidation, a scheduled workflow MUST run at least weekly, compare every `lightspeedwp` repository's labels and the Linear workspace labels against `labels.yml`, and open or update a single report issue listing every difference. Automation that creates labels MUST create only labels defined in `labels.yml`. Label creation from Linear's GitHub integration and repository label creation by people SHOULD be restricted where the platform allows, without reducing anyone's existing repository access; the drift check and the automation rule are the required controls
- **FR-018**: Organisation-wide label changes and the drift check MUST authenticate with a GitHub App installed across the `lightspeedwp` organisation with only Issues (read/write) and Metadata (read) permissions, using short-lived installation tokens (the repository already stores `BOT_PR_APP_*` secrets for an App). The drift check reads Linear with a read-only API key stored as the `LINEAR_API_KEY` repository secret. Deletion runs (FR-016) and Linear write operations are performed from @ashley's own session, not from CI. No credential may be committed to the repository
- **FR-019**: `.github/issue-types.yml` (after the FR-014 swap) is the source of truth for issue types. The GitHub organisation's native issue types MUST be changed to match it exactly, one native type per entry, in this order because the organisation is limited to 25 types: (1) rename A11y → Accessibility, Code Refactor → Refactor, Code Review → Review, Build & CI → CI; (2) migrate every issue using Maintenance, Story or Integration to its mapped type (Maintenance → Chore plus `area:maintenance`, Integration → Feature plus `area:integration`, Story → Feature), updating its `type:*` label to match, then remove those three types; (3) add Build, Dependency Update and Decision. There is no native Question type, so FR-014's organisation step is covered by adding Decision here
- **FR-020**: As the first consolidation step, every issue type's colour MUST follow `docs/LABEL_COLOR_STRATEGY.md`, and each issue type MUST have a description. `.github/issue-types.yml` (which gains a `description` field) and the `type:*` labels in `.github/labels.yml` MUST use the same hex colour for each type, and the organisation's native issue types MUST use the same names, descriptions and the matching native colour name (Teal maps to green). The authoritative list is `contracts/issue-types-org-settings.md`
- **FR-013**: OpenSpec has been replaced by GitHub Spec Kit. Every live file that references OpenSpec (`openspec`, `OpenSpec`, `OPENSPEC`), meaning code, workflows, scripts, skills, agents, prompts, docs, configuration and active project artefacts (about 454 files on 2026-09-24), MUST be updated to reference Spec Kit (`speckit`) for the tool and process, and `spec`/`specs` for specification artefacts and labels. Dated reports (`*/reports/*`) and archived files (`*/archived/*`) keep their original wording as historical record. File and folder names are renamed too (`OPENSPEC*.md` → `SPEC*.md`, the root `openspec` symlink removed and its target `.github/projects/active/openspec/` renamed to `.github/projects/active/speckit-changes/`, `skills/openspec-estimate-planner/` → `skills/speckit-estimate-planner/`), with every link updated in the same change and a migration issue recording each source → target path. Completion is measured by a case-insensitive search for `openspec` in both file contents and paths returning zero matches outside `node_modules/`, `*/reports/*` and `*/archived/*`
- **FR-021**: `meta:needs-approval` is the one label for an explicit approval gate. It MUST be applied only when a named pending decision stops work, and the issue MUST state the approver, the decision requested, the affected scope, the options or proposed change, the risk, and the evidence that will show acceptance. It MUST NOT be used for ordinary review (`status:needs-review`) or a generic block (`status:blocked`), and review completion is not treated as consent. It MUST be removed once a dated approval or rejection and the resulting scope are recorded on the issue. The spec 008 change requests and the FR-016 deletion gate issue use it while they wait for @ashley
- **FR-022**: Until Stage 3 of the consolidation starts, labelling automation (the unified labelling agent, `scripts/agents/labeling.agent.js`) MUST NOT remove any label from an issue or PR because it is missing from `labels.yml`; it may still add labels, which must come from `labels.yml` (FR-017). From Stage 3, the agent MUST use the approved FR-012 mapping as its alias list: it replaces a mapped label with its approved label and removes only labels that have no mapping. Its dry-run setting MUST be honoured, so a dry run changes nothing

### Key Entities

- **Label Families**: status, priority, type, meta, release, area, comp, lang, env, compat, cpt, ai-ops (target: `aiops`, FR-011), contrib, discussion, openspec (target: `spec`, FR-011) (and any others discovered during audit)
- **Type Labels**: Exactly 25 `type:*` labels, each mapped to one issue type. The audit found 26 (25 mapped, plus unmapped `type:decision`); Stage 0a applied the FR-014 swap
- **Canonical Labels**: The 169 labels currently defined in `.github/labels.yml`
- **Governance Policy**: The never-delete label list and related rules in `label-governance-policy.yml`
- **Archived Workflows**: 11 workflow files that were disabled due to non-functional status
- **Documentation**: All files describing label taxonomy and labeling strategy
- **GitHub API Labels**: The full current repository label set required for orphan-label validation; no verified inventory has yet been retrieved
- **Linear Labels**: The Linear workspace label set (244 labels on 2026-09-24), the source for labels imported into GitHub under FR-012
- **Approval Gate Label**: `meta:needs-approval`, applied to an issue while a named approver's decision is pending and removed when the dated decision is recorded (FR-021)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (Incomplete)**: Audit report identifies all missing labels (those in GitHub but not in the canonical file with 169 labels) with 100% accuracy. This criterion MUST remain incomplete until a verified full repository label set replaces the empty inventory in `github-api-labels.json`
- **SC-002**: Audit report identifies all label mismatches (different names/colors between files) with 100% accuracy
- **SC-003**: The audit verifies all 25 issue-type mappings are present and correct in the canonical file, with `type:decision` mapped and `type:question` retired (Stage 0a; the 2026-09-14 audit recorded `type:decision` as unmapped). After consolidation, the type family contains exactly 25 labels, each mapped to one issue type and template, with `type:decision` mapped and `type:question` retired
- **SC-004**: Audit report identifies ALL duplicate/overlapping labels across families, ranked by consolidation impact and usage frequency. Usage frequency is the total number of open and closed issues and PRs carrying the label, summed across all `lightspeedwp` repositories (from the paginated inventory), plus the label's Linear issue count
- **SC-005**: All 11 archived workflows are analyzed with documented findings (purpose, issues, recommendations) for each
- **SC-006**: Audit identifies all discrepancies between canonical `labels.yml` (169 labels) and its documented purpose as "single source of truth", including type label mapping gaps
- **SC-007**: Audit creates a prioritized roadmap for label family expansion, cleanup, and workflow restoration
- **SC-008**: All audit findings can be traced to specific files/sections (quotable evidence)
- **SC-009**: After consolidation, every `lightspeedwp` repository's label set exactly matches `labels.yml` (zero unapproved labels, zero missing canonical labels), and no Linear workspace label exists outside `labels.yml` apart from documented team-scoped project labels
- **SC-010**: Every open spec 008 change request and gate issue awaiting a decision carries `meta:needs-approval`, and no issue still carries it more than one day after its dated approval or rejection is recorded

## Assumptions

- The canonical `labels.yml` file is considered final and the baseline for this audit (169 labels total); changes are limited to the FR-011 renames, the FR-012 merges and imports, and duplicates identified by the audit
- At the audit, the canonical `type:*` family contained 26 labels: the 25-label `issue-types.yml` mapping set and unmapped `type:decision`. GitHub and Linear allow at most 25 issue types, so the only type-family change is the FR-014 swap
- At the audit, the `label-governance-policy.yml` never-delete list contained 12 labels that were not in the canonical file. The never-delete list now protects only labels in `labels.yml` (FR-009 exemption); labels outside `labels.yml` are handled by the FR-012 mapping and the gated deletion in FR-016
- Archived workflows were disabled due to conflicts, performance issues, or obsolescence rather than planned retirement
- The full GitHub API label inventory represents the true repository state, but `github-api-labels.json` currently contains no verified labels; orphan-label conclusions remain pending until the inventory is obtained
- Documentation files (LABEL_*.md, ISSUE_*.md, PR_*.md) reflect intended labeling strategy even if implementation gaps exist
- The unified labeling agent (`labeling.agent.js` / `labeling.yml`) is the current and future canonical source for label automation (its label-removal behaviour is limited by FR-022 until the approved mapping exists)
- Future work will address workflow restoration and label expansion, but this audit focuses on analysis and documentation
- No label merging or deletion occurs during the audit phase; merges, renames and imports happen only in the consolidation phase after `[LABEL-UPDATE-REQUEST]` approval (FR-009, FR-012)
- The repository structure and conventions follow UK English spelling and LightSpeed coding standards (from CLAUDE.md)

## Phase Outcome

This specification results in a **comprehensive audit report** documenting:

1. Complete local canonical label inventory and family taxonomy; the live repository inventory and orphan-label audit remain pending
2. All mismatches and inconsistencies between files
3. Identified duplicate/overlapping labels (with consolidation recommendations)
4. Analysis of archived workflows and automation gaps
5. Prioritized roadmap for label governance improvements
6. Documented evidence for all findings (with file/line references)

The audit itself makes no changes to the production label configuration. The approved consolidation phase then applies the FR-011 renames, FR-012 Linear imports and merges, and the FR-013 OpenSpec-to-Spec Kit rename; workflow restoration remains future work.

## Clarifications

### Session 2026-09-14

- Q: Should the audit identify and consolidate exactly 5-10 duplicate labels, or is that range just an estimate? → A: Find ALL possible duplicate/overlapping labels and report them ranked by consolidation impact. This gives the governance team complete visibility across verified local sources; complete repository visibility remains pending until the full GitHub label inventory is obtained.

### Session 2026-09-24

- Q: Which prefixes are canonical for the AI operations and OpenSpec label families? → A: `ai-ops` becomes `aiops` and `openspec` becomes `spec`
- Q: Which labels should flow between Linear and GitHub? → A: Import every Linear-only label into GitHub, applying the approved renames and merges; `labels.yml` stays the source of truth
- Q: How should OpenSpec references be handled now that it has been replaced? → A: OpenSpec is replaced by GitHub Spec Kit; every file referencing OpenSpec must reference `speckit` and `spec`/`specs` instead
- Q: Should `type:question` be swapped for `type:decision` (keeping exactly 25 types), with the eight Linear type labels re-prefixed and every issue keeping one type label? → A: Yes, swap and re-prefix; the Question issue template must be replaced and `type:decision` needs a defined PR routing path
- Q: Which single label should mean "finished": `status:done`, `status:completed` or `status:resolved`? → A: `status:done`; the other two merge into it
- Q: Should the OpenSpec-to-Spec Kit rename also rewrite past records, or only live files? → A: Live and active files only; dated reports and archived files stay as historical record
- Q: Should the OpenSpec rename also rename files and folders, or only change text inside files? → A: Rename paths too, update every link in the same change, and record source → target paths in a migration issue
- Q: Which labels should cover testing and QA work? → A: Two labels: `area:testing` for test code and harnesses (absorbs `area:tests`) and `area:qa` for QA processes (absorbs `area:quality`)
- Q: Should the fallback PR routing by linked issue type be dropped or built? → A: Build later: out of scope for spec 008, recorded as a separate follow-up spec; routing stays branch-only
- Q: Which Linear-only labels should be imported into GitHub's `labels.yml`? → A: Only labels used on at least one issue or required by automation; zero-use labels are retired, the additional duplicate merges apply, and project-specific labels become team-scoped in Linear
- Q: How far should deletion of unapproved GitHub labels go, and what should gate it? → A: All org repositories, gated by a new gate issue replacing #95 with a per-repository dry-run list approved by @ashley; labels on open issues are migrated first
- Q: How should we stop unapproved labels coming back after the clean-up? → A: A weekly scheduled comparison that opens or updates one report issue, plus restricting label creation in Linear's GitHub integration and limiting repository label creation to maintainers
- Q: What should happen to existing issues labelled `type:question` when Decision replaces Question? → A: Open ones convert to GitHub Discussions; closed ones are relabelled `type:task` + `discussion:support`; same rule in Linear
- Q: Where should the `openspec/` folder go? → A: Remove the root `openspec` symlink and rename its target `.github/projects/active/openspec/` to `.github/projects/active/speckit-changes/`
- Q: How strict should FR-017 be about who can create labels in GitHub repositories? → A: Best effort: restrict label creation where GitHub and Linear permissions allow without reducing existing access; the drift check and the "automation creates only `labels.yml` labels" rule are the required controls
- Q: Which credentials should the label scripts and weekly drift check use? → A: An org-wide GitHub App limited to Issues read/write and Metadata read, plus a read-only Linear key (`LINEAR_API_KEY`); deletion and Linear writes run from @ashley's session, not CI
- Q: How should duplicate labels be ranked by usage on the GitHub side? → A: Count open and closed issues and PRs per label across all repositories, and add the Linear issue count
- Q: How should deletion be switched on for each approved run? → A: `destructive_cleanup.enabled` stays `false` in the repository; the deletion tooling requires an explicit apply flag naming the gate issue and an approved dry run for each repository
- Q: Which list is the source of truth for the 25 issue types: `issue-types.yml` or GitHub's current native types? → A: `issue-types.yml` (after the Decision swap); GitHub native types are renamed, trimmed and extended to match it
- Q: Which type should issues on the removed Maintenance, Story and Integration native types move to? → A: Maintenance → Chore, Integration → Feature (matching FR-015), Story → Feature
- Q: What should come first in the consolidation work? → A: Updating `issue-types.yml` and `labels.yml` with the correct issue type labels, descriptions and colours from `docs/LABEL_COLOR_STRATEGY.md`, then using that list to update the organisation's issue types settings page by hand
- Q: How does the Linear-created `[LABEL-UPDATE-REQUEST]` #3554 fit the plan's single label update request? → A: #3554 is the request for its five imports (all already in Linear); the Stage 1 request covers the rest of the mapping and references it, and both are applied in the one configuration change. #3554 itself changes no Linear issue labels
- Q: Should the `meta:needs-approval` approval-gate policy from #3554 be part of this specification? → A: Yes, as FR-021; the spec 008 change requests and the deletion gate issue use the label while waiting for approval
- Q: Should `area:observability` stay as its own label next to `area:monitoring`, or be merged into it? → A: Keep both, as defined in #3554: `area:monitoring` for checks, alerts and failure detection; `area:observability` for logs, metrics, traces and dashboards. The `area:observability` → `area:monitoring` merge is removed from FR-012
- Q: Which colours should labels imported from Linear use: the colour strategy's families, or the colours given in the request? → A: The strategy's colour where it has a rule for the family (so `meta:needs-approval` is `57606A`); otherwise the colour in the approved request (so #3554's `area:*` colours stand until an `area:*` rule exists)
- Q: Should the locked label files be allowed to change before the full label mapping is approved, for the two changes already under way? → A: Yes. FR-009 exempts the Stage 0a issue-type change (approved via #3530, #3556 and #3557) and the never-delete list clean-up, which cannot delete anything while `enabled: false`
- Q: When must open `type:question` issues be converted to Discussions: before `type:question` leaves `labels.yml`, or before the label is deleted from repositories and Linear? → A: Before it is deleted. Removing it from `labels.yml` (Stage 0a, #3534) deletes nothing while `enabled: false`; the conversion (T063) must finish before Stage 4 deletes the label
- Q: Should the active labelling agent stop removing labels that aren't in `labels.yml` from issues and PRs until the consolidation has moved those items to approved labels? → A: Yes. Until Stage 3 it removes nothing for being outside `labels.yml`; from Stage 3 it uses the approved FR-012 mapping as aliases and removes only unmapped labels; its dry-run setting must work (FR-022)
- Q: Which family should hold AI work: the `area:ai` family or the `aiops:*` family? → A: Split. `aiops:*` holds AI assets (agents, instructions, prompts, datasets, evaluations, tools); `area:ai` stays as the single umbrella area label; `area:agents`, `area:instructions` and `area:prompts` merge into their `aiops:*` equivalents; `area:skills` is decided in the mapping (T043)

### Session 2026-09-25

- Q: When label names change from `ai-ops` to `aiops` and from `openspec` to `spec` on the audit branch, should the audit's 14 September snapshot files be renamed too? → A: No. The snapshot files keep the recorded names and gain a `target_name` for each label; the spec, analysis reports and docs on the branch use the new names; `renamed-label-references.json` keeps the old names it records

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
