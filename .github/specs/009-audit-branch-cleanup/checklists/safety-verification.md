---
title: "Safety & Correctness Verification Checklist: Branch Cleanup Audit"
description: "Requirements-quality verification for deletion safety, merge detection, and error handling"
---

# Safety & Correctness Verification Checklist: Branch Cleanup Audit

**Purpose**: Unit test of requirements writing — validate that all safety, correctness, and verification requirements for branch cleanup are fully specified, unambiguous, measurable, and complete.

**Created**: 2026-09-14

**Feature**: [Branch Cleanup Audit & Refactoring Specification](../spec.md)

**Domain Focus**: Safety verification (50%), Functional correctness (40%), Error handling & recovery (10%)

**Audience**: Peer/team reviewers during PR review (code review gate)

**Ownership**: This checklist is a reviewer-owned requirements-quality review artifact. Mark an item `[x]` only when the reviewer determines the requirements-quality criterion is satisfied. `[x]` means the criterion has been reviewed and satisfied for requirements quality — it does NOT mean implementation work is complete.

---

## Deletion Safety & Verification Requirements

**Goal**: Validate that all safety checks for branch deletion are unambiguously specified

- [ ] CHK001 Are all 7 deletion safety verification checks explicitly documented in spec or data-model? (branch exists, is merged, no open PR, not protected, valid name, meets age threshold, not excluded) [Completeness, Spec §FR-010, §FR-003, §FR-004, §FR-005]
- [ ] CHK002 Is "fully merged" quantified with a specific merge detection method (git merge-base to develop OR main)? [Clarity, Spec §FR-002, data-model.md merge status]
- [ ] CHK003 Are protected branch patterns explicitly listed? (main, develop, production, release/*, hotfix/*, or others?) [Completeness, Spec §FR-003, CLAUDE.md]
- [ ] CHK004 Is the "30 days" inactivity threshold documented as a configurable parameter (--inactiveDays) with default value? [Clarity, Spec §FR-005]
- [ ] CHK005 Are the 3 forbidden branch prefixes (claude, copilot, openai) and validation requirements documented? [Completeness, Spec §FR-006, CLAUDE.md]
- [ ] CHK006 Is dry-run mode (default=true, never deletes without explicit opt-in) specified as a requirement? [Completeness, Spec §FR-011, plan.md]
- [ ] CHK007 Are the steps for safely deleting a branch specified? (verify merge first, handle "already deleted" gracefully, report success/failure) [Completeness, Spec §FR-010, Spec §Edge Cases]
- [ ] CHK008 Is it specified that verification checks must ALL pass before a branch is marked deletion-safe? (AND logic, not OR) [Clarity, data-model.md DeletionCandidate]
- [ ] CHK009 Is the merge verification order specified? (check merge to develop first, then main, respect most permissive state) [Clarity, Spec §Edge Cases, data-model.md merge status validation]
- [ ] CHK010 Are the consequences of race conditions specified? (branch deleted between audit and cleanup execution) [Completeness, Spec §Edge Cases]

---

## Merge Detection & PR Status Requirements

**Goal**: Validate that merge detection and PR querying requirements are precisely specified

- [ ] CHK011 Is the git merge detection method explicitly documented? (git merge-base --is-ancestor branch develop/main) [Completeness, plan.md research.md]
- [ ] CHK012 Is it specified that GitHub CLI (gh pr list) is the method for PR detection? [Completeness, plan.md]
- [ ] CHK013 Are the error scenarios for gh CLI specified? (not installed, auth failure, rate limit, API errors) [Completeness, Spec §FR-002]
- [ ] CHK014 Is it documented how to handle branches with open draft PRs? (should they be preserved?) [Ambiguity, Spec §FR-004]
- [ ] CHK015 Is the branch merge status categorisation logic complete? (merged_to_develop, merged_to_main, unmerged, detached, or other states?) [Completeness, data-model.md Branch.merge_status]
- [ ] CHK016 Are the rules for mixed merge states documented? (e.g., merged to develop but not main — which takes precedence?) [Clarity, Spec §Edge Cases]
- [ ] CHK017 Is the GitHub API rate limiting strategy documented in requirements? (batch requests, caching, fallback behavior) [Completeness, plan.md performance target]
- [ ] CHK018 Can "merged" be objectively verified without manual inspection? (i.e., git commands alone, no human judgment) [Measurability, Spec §FR-002]

---

## Categorisation Logic & Decision Tree

**Goal**: Validate that the 8-gate categorisation decision tree is complete and unambiguous

- [ ] CHK019 Are all 8 gates in the decision tree explicitly documented in order of evaluation? [Completeness, data-model.md decision tree]
- [ ] CHK020 Is the ordering of gates justified? (e.g., check protected branches first to avoid unnecessary operations) [Clarity]
- [ ] CHK021 Are the outputs of each gate documented? (KEEP/DELETE/DISCUSS with reason codes) [Completeness, data-model.md reason codes]
- [ ] CHK022 Are all reason codes for KEEP category documented? (protected_branch, active_pr, active_development, excluded_pattern, unmerged_recent) [Completeness, data-model.md]
- [ ] CHK023 Are all reason codes for DELETE category documented? (merged_stale only, or others?) [Completeness, data-model.md]
- [ ] CHK024 Are all reason codes for DISCUSS category documented? (naming_violation, unmerged_stale, orphaned, excluded_policy, unclear_status, or others?) [Completeness, data-model.md]
- [ ] CHK025 Are branch type definitions from CLAUDE.md validated? (30+ types documented and referenced) [Completeness, Spec §FR-015, CLAUDE.md]
- [ ] CHK026 Is the categorisation logic deterministic? (same input always produces same output, no randomness or conditional human judgment) [Measurability, data-model.md decision tree]
- [ ] CHK027 Are edge cases handled in the decision tree? (What happens when multiple conditions could apply?) [Completeness, Spec §Edge Cases]
- [ ] CHK028 Is it documented that every branch MUST be categorised into exactly one category? (no unhandled cases, no branches left uncategorised) [Clarity]

---

## Report Format & Output Specifications

**Goal**: Validate that audit and deletion reports are precisely specified

- [ ] CHK029 Are the required fields for Markdown audit reports documented? [Completeness, contracts/audit-report.schema.json]
- [ ] CHK030 Are the required fields for JSON audit reports documented? [Completeness, contracts/audit-report.schema.json]
- [ ] CHK031 Are the required fields for deletion candidates report documented? [Completeness, contracts/deletion-candidates.schema.json]
- [ ] CHK032 Is the report timestamp format specified? (ISO8601) [Clarity, contracts/audit-report.schema.json]
- [ ] CHK033 Is the repository identifier format specified in reports? (owner/repo) [Clarity, contracts/audit-report.schema.json]
- [ ] CHK034 Are all metadata fields per branch documented? (name, type, author, last_commit_date, age_days, merge_status, merge_commit_sha, open_pr if any) [Completeness, data-model.md Branch]
- [ ] CHK035 Is the summary counts structure documented? (keep_count, delete_count, discuss_count) [Completeness, contracts/audit-report.schema.json]
- [ ] CHK036 Are the report sections for KEEP/DELETE/DISCUSS specified with subsection structure? [Completeness, contracts/audit-report.schema.json]
- [ ] CHK037 Is fallback behavior specified when branch data is incomplete? (e.g., can't get author or last commit date) [Completeness, Spec §Edge Cases]
- [ ] CHK038 Can both Markdown and JSON outputs be generated in a single run? (--reportFormat=both) [Completeness]

---

## Performance & Scalability Requirements

**Goal**: Validate that performance targets are measurable and complete

- [ ] CHK039 Is the audit performance target (<5 seconds for 500+ branches) quantified and testable? [Clarity, Spec §SC-004]
- [ ] CHK040 Are performance assumptions documented? (git performance, gh CLI performance, network latency) [Completeness, plan.md]
- [ ] CHK041 Is merge-base caching strategy specified to meet performance target? [Completeness, plan.md]
- [ ] CHK042 Are batch PR query requirements documented to meet performance target? [Completeness, plan.md]
- [ ] CHK043 Is the scalability range documented? (minimum branches, maximum branches tested) [Clarity, Spec §SC-004]
- [ ] CHK044 Are degradation scenarios specified? (What happens at 1000+ branches? 10000+ branches?) [Completeness, Edge Case]

---

## Exclusion Patterns & Custom Rules

**Goal**: Validate that custom exclusion pattern requirements are complete and unambiguous

- [ ] CHK045 Is the regex-based exclusion pattern format documented? (e.g., pattern syntax, how to combine multiple patterns) [Clarity, Spec §FR-007]
- [ ] CHK046 Are example exclusion patterns provided? (dependabot/*, renovate/*, etc.) [Completeness, Spec §FR-007]
- [ ] CHK047 Is the behavior of excluded branches specified? (preserved, flagged for discussion, or another action?) [Clarity, Spec §FR-007, data-model.md]
- [ ] CHK048 Are edge cases for exclusion patterns documented? (overlapping patterns, pattern matching order) [Completeness]
- [ ] CHK049 Is it specified that exclusion patterns are optional with sensible defaults? (should work without --excludePatterns flag) [Clarity, Spec §FR-007]

---

## Error Handling & Recovery

**Goal**: Validate that error scenarios and recovery procedures are specified

- [ ] CHK050 Are all error scenarios documented for the audit phase? (git errors, gh CLI errors, permission errors, network timeouts) [Completeness, Spec Edge Cases]
- [ ] CHK051 Are all error scenarios documented for the deletion phase? (branch deleted by another process, merge conflicts, protected branch attempts) [Completeness, Spec §Edge Cases]
- [ ] CHK052 Is graceful error handling specified? (tool should not crash, should report errors clearly) [Completeness]
- [ ] CHK053 Is it documented what happens when branch deletion fails? (should it log and continue, or stop?) [Clarity]
- [ ] CHK054 Are rollback requirements specified if deletion partially fails? (e.g., deleted 5/10 branches, then error) [Completeness, Spec Edge Cases]
- [ ] CHK055 Is the "already deleted" scenario explicitly handled? (branch no longer exists when deletion attempts) [Completeness, Spec §Edge Cases]
- [ ] CHK056 Is it specified that gh CLI authentication errors should be reported with actionable guidance? [Completeness]

---

## Documentation & User Guidance

**Goal**: Validate that documentation requirements are complete

- [ ] CHK057 Are CLI usage examples documented for: basic audit, JSON output, dry-run, deletion, exclusion patterns? [Completeness, Spec §FR-013]
- [ ] CHK058 Is the decision matrix for KEEP/DELETE/DISCUSS branches documented? [Completeness, Spec §FR-012]
- [ ] CHK059 Are troubleshooting scenarios documented? (gh CLI not installed, API rate limits, auth failures) [Completeness, Spec §FR-012]
- [ ] CHK060 Is the branch naming validation documented to include all 30+ types and reject forbidden prefixes? [Completeness, Spec §FR-015]
- [ ] CHK061 Are examples of valid and invalid branch names provided? [Completeness, Spec §FR-015]
- [ ] CHK062 Is it documented which branches are never deleted? (protected patterns and reasons) [Completeness, Spec §FR-003]
- [ ] CHK063 Is the relationship between audit, deletion candidates, and discussion candidates explained? [Completeness, Spec §FR-001]

---

## Acceptance Criteria Measurability

**Goal**: Validate that success criteria are objective and testable

- [ ] CHK064 Is SC-001 measurable? ("100% of branches categorised" — what constitutes verification?) [Measurability, Spec §SC-001]
- [ ] CHK065 Is SC-002 measurable? ("300+ to <50 branches" — how will branch count reduction be verified?) [Measurability, Spec §SC-002]
- [ ] CHK066 Is SC-003 measurable? ("100% merge verification" — what specific tests verify this?) [Measurability, Spec §SC-003]
- [ ] CHK067 Is SC-004 measurable? ("<5 seconds for 500+ branches" — under what conditions? which repository? network conditions?) [Measurability, Spec §SC-004]
- [ ] CHK068 Is SC-005 measurable? ("All example commands execute successfully" — which examples? on which platforms?) [Measurability, Spec §SC-005]
- [ ] CHK069 Is SC-006 measurable? ("Team confidence increases" — how will this be measured? survey? incident rate?) [Measurability, Spec §SC-006]
- [ ] CHK070 Is SC-007 measurable? ("Workflow successfully runs on schedule" — success definition? which schedule?) [Measurability, Spec §SC-007]
- [ ] CHK071 Is SC-008 measurable? ("Naming validation enforces types and rejects prefixes" — unit test coverage? regression tests?) [Measurability, Spec §SC-008]

---

## Branch Naming & Validation

**Goal**: Validate that branch naming requirements are complete and aligned with CLAUDE.md

- [ ] CHK072 Are all 30+ branch types from CLAUDE.md listed and referenced? [Completeness, Spec §FR-015, CLAUDE.md]
- [ ] CHK073 Are the 3 forbidden prefixes (claude, copilot, openai) and WHY they're forbidden documented? [Clarity, Spec §FR-006, CLAUDE.md]
- [ ] CHK074 Is the {type}/{scope}-{title} pattern precisely documented? (allowed characters, case sensitivity, hyphen rules) [Clarity, Spec §FR-006]
- [ ] CHK075 Is it documented that naming validation must reject ALL forbidden prefixes? (not just warn) [Clarity, Spec §FR-006]
- [ ] CHK076 Are the validation rules consistent between spec, data-model, and quickstart? [Consistency, Spec §FR-015]
- [ ] CHK077 Are edge cases for branch naming documented? (branches without standard pattern: main, develop, production) [Completeness]

---

## Workflow & Automation

**Goal**: Validate that scheduled workflow requirements are complete

- [ ] CHK078 Is the workflow trigger specified? (schedule frequency, manual trigger, or both?) [Completeness, Spec §US5]
- [ ] CHK079 Is the report artifact generation documented? (where stored, naming convention, retention policy) [Completeness, Spec §US5]
- [ ] CHK080 Is optional GitHub issue creation for DISCUSS branches documented? (format, assignee, labels) [Completeness, Spec §US5, Spec §Edge Cases]
- [ ] CHK081 Is optional draft PR creation for deletion candidates documented? (how is it generated, what are the safeguards?) [Completeness, Spec §US5]
- [ ] CHK082 Is the workflow failure handling documented? (what happens if audit fails, if gh CLI unavailable) [Completeness]
- [ ] CHK083 Is the workflow success criteria specified? (which artifacts must be generated, what constitutes success?) [Clarity, Spec §US5]

---

## Traceability & Cross-References

**Goal**: Validate that requirements are traceable and properly cross-referenced

- [ ] CHK084 Are all spec requirements (FR-001 through FR-016) mapped to at least one task in tasks.md? [Completeness, Traceability]
- [ ] CHK085 Are all user stories (US1 through US5) mapped to acceptance scenarios and acceptance criteria? [Completeness, Spec §User Scenarios]
- [ ] CHK086 Are all data model entities (Branch, BranchAuditReport, DeletionCandidate) referenced in requirements? [Completeness, data-model.md]
- [ ] CHK087 Are all contracts (audit-report.schema.json, deletion-candidates.schema.json) referenced in report format requirements? [Completeness, Traceability]
- [ ] CHK088 Are all quickstart scenarios (1-7) mapped to requirements they validate? [Completeness, quickstart.md]

---

## Assumptions & Dependencies

**Goal**: Validate that assumptions and external dependencies are documented and validated

- [ ] CHK089 Are all assumptions listed and validated? (git version, gh CLI, GitHub API, repository structure) [Completeness, Spec §Assumptions]
- [ ] CHK090 Are external dependencies documented? (GitHub CLI required, git 2.30+ required, Node.js 22 required) [Completeness, plan.md]
- [ ] CHK091 Is the GitHub API versioning assumption documented? [Completeness, plan.md]
- [ ] CHK092 Is it documented that tool requires repository clone access? (remote branches must be fetched) [Completeness, Spec §Assumptions]
- [ ] CHK093 Are fallback behaviors documented when assumptions don't hold? (gh not installed, git too old) [Completeness]

---

## Potential Ambiguities & Conflicts

**Goal**: Identify and flag unresolved ambiguities and requirement conflicts

- [ ] CHK094 Is there any conflict between branch naming validation (CLAUDE.md) and deletion criteria? [Conflict, Spec §FR-006 vs FR-010]
- [ ] CHK095 Is there potential ambiguity in "recent" branch definition? (30 days per spec, but is this documented consistently?) [Ambiguity, Spec §FR-005, data-model.md]
- [ ] CHK096 Is there potential conflict between protected branch patterns and legitimate-but-stale protected branches? (specified they're never deleted, but is this appropriate?) [Conflict, Spec §FR-003 vs FR-005]
- [ ] CHK097 Is the handling of excluded branches clear? (preserved vs. discussed — are both possibilities documented?) [Ambiguity, Spec §FR-007]
- [ ] CHK098 Is it clear what "author" field means? (last commit author, branch creator, or something else?) [Ambiguity, data-model.md]
- [ ] CHK099 Are there unresolved questions about GitHub API reliability? (should we implement fallback to manual git detection?) [Assumption, plan.md]

---

## Completeness Check

**Goal**: Final check that all critical requirements aspects are covered

- [ ] CHK100 Are primary, alternate, and exception flow requirements all specified for audit (US1)? [Coverage]
- [ ] CHK101 Are primary, alternate, and exception flow requirements all specified for deletion (US2)? [Coverage]
- [ ] CHK102 Are primary, alternate, and exception flow requirements all specified for discussion (US3)? [Coverage]
- [ ] CHK103 Are refactoring requirements (US4) specific to deliverables (scripts, docs, agents)? [Clarity, Spec §US4]
- [ ] CHK104 Are automation requirements (US5) specific to trigger and artifact generation? [Clarity, Spec §US5]
- [ ] CHK105 Are non-functional requirements (performance, security, accessibility) all specified? [Completeness]

---

## Notes

- **Ownership**: This is a reviewer-owned requirements-quality artifact. Reviewers: Mark `[x]` when the requirement-quality criterion is satisfied.
- **Semantics**: `[x]` = requirements quality is satisfied, NOT that implementation is complete.
- **Usage**: `/speckit-implement` reads checkbox state as a gate; reviewers may uncheck items if clarification is needed.
- **Related**: `checklists/requirements.md` (spec completeness checklist, maintained by `/speckit-specify` and `/speckit-clarify`)
- **Focus**: Safety & correctness emphasis (50%), functional requirements (40%), error handling (10%)
- **Audience**: Peer/team review during PR review stage
- **Total Items**: 105 requirement-quality verification items
- **Traceability**: 80%+ of items reference spec sections, gaps, or conflicts
- **Measurability**: Focus on objective, testable, unambiguous criteria
