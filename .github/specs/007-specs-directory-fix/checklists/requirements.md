# Requirements Quality Checklist: Fix Specs Directory Configuration

**Purpose**: Unit tests for requirements writing—validate that spec.md, plan.md, data-model.md, contracts/, and quickstart.md are complete, clear, consistent, and ready for implementation

**Created**: 2026-09-14

**Feature**: [spec.md](../spec.md) | [plan.md](../plan.md) | [data-model.md](../data-model.md) | [contracts/](../contracts/) | [quickstart.md](../quickstart.md)

**Note**: This checklist is reviewer-owned. Mark item `[x]` only when the reviewer determines the requirements-quality criterion is satisfied. `[x]` does NOT mean implementation work is complete.

---

## Requirement Completeness

Verify all necessary requirements are documented and no critical gaps exist.

- [ ] CHK001 Are all 9 functional requirements (FR-001 through FR-009) clearly identified in spec.md? [Completeness, Spec §Requirements]
- [ ] CHK002 Is automatic rollback requirement (FR-009) explicitly specified with conditions (permission denied, disk full, partial failure)? [Completeness, Spec §FR-009]
- [ ] CHK003 Are all 6 success criteria (SC-001 through SC-006) measurable and verifiable without implementation details? [Completeness, Spec §Success Criteria]
- [ ] CHK004 Does the spec define what happens when `.github/specs/` doesn't exist yet? [Completeness, Spec §Edge Cases]
- [ ] CHK005 Are error handling requirements specified for all three error scenarios (permission errors, disk full, partial failures)? [Completeness, Gap]
- [ ] CHK006 Are configuration backward-compatibility requirements documented (missing field default behavior)? [Completeness, Spec §FR-002]
- [ ] CHK007 Is the migration conflict resolution requirement documented (prioritize .github/specs if specs exist in both locations)? [Completeness, Spec §Edge Cases]
- [ ] CHK008 Is post-migration cleanup requirement specified (old specs/ directory MUST be removed)? [Completeness, Spec §FR-008]
- [ ] CHK009 Is the feature numbering continuity requirement documented (sequential 001, 002, 003 continues across migration)? [Completeness, Gap]

---

## Requirement Clarity

Validate requirements are specific, unambiguous, and measurable—not vague.

- [ ] CHK010 Is "configuration-driven solution" defined with specifics (which file, which field name, which default)? [Clarity, Spec §plan.md line 97]
- [ ] CHK011 Is "safely migrated" quantified in SC-005 as "100% content preservation"—can this be objectively verified? [Clarity, Spec §SC-005]
- [ ] CHK012 Is the `specs_directory` field requirement clear (optional, defaults to `.github/specs`, relative path only)? [Clarity, Spec §FR-002, data-model.md]
- [ ] CHK013 Are "all speckit scripts" in FR-004 explicitly identified by name (create-new-feature.sh, setup-plan.sh, setup-tasks.sh, etc.)? [Clarity, Gap]
- [ ] CHK014 Is "correctly reference features" in FR-006 defined with examples (e.g., path resolution behavior)? [Clarity, Spec §FR-006]
- [ ] CHK015 Is "canonical specs location" in FR-007 defined (currently unspecified which documents must say this)? [Clarity, Spec §FR-007]
- [ ] CHK016 Is "clear error reporting" in FR-009 quantified (what error message format, what information must be included)? [Clarity, Gap]
- [ ] CHK017 Is the data model's `specs_directory` field validation rule clearly specified (no `..`, no leading `/`, valid characters)? [Clarity, data-model.md §Validation Rules]

---

## Requirement Consistency

Check requirements don't conflict and are aligned across documents.

- [ ] CHK018 Does Clarification Q1 (clean cutover, remove old location) align with FR-008 (old directory MUST be removed)? [Consistency, Spec §Clarifications + FR-008]
- [ ] CHK019 Does Clarification Q2 (optional field with default) align with FR-002 (MAY include optional field)? [Consistency, Spec §Clarifications + FR-002]
- [ ] CHK020 Does Clarification Q3 (automatic rollback) align with FR-009 (automatic rollback on error)? [Consistency, Spec §Clarifications + FR-009]
- [ ] CHK021 Do configuration requirements (FR-002, FR-004) align with data-model.md schema definition? [Consistency, data-model.md]
- [ ] CHK022 Do script requirements (FR-001, FR-004) align with contract specifications in init-options-schema.md? [Consistency, contracts/]
- [ ] CHK023 Do migration requirements (FR-005, FR-008, FR-009) align with quickstart.md validation scenarios? [Consistency, quickstart.md]
- [ ] CHK024 Does the reference to "Constitution Principle III" in plan.md align with actual constitution content? [Consistency, plan.md §Constitution Check]
- [ ] CHK025 Are acceptance scenarios for each user story consistent with their corresponding functional requirements? [Consistency, Spec §User Scenarios + §Requirements]

---

## Acceptance Criteria Quality

Validate success criteria and acceptance scenarios are measurable and specific.

- [ ] CHK026 Is SC-001 measurable ("100% of new specs created...") with clear verification method? [Measurability, Spec §SC-001]
- [ ] CHK027 Is SC-002 measurable (which speckit commands, how to test they "correctly resolve")? [Measurability, Spec §SC-002]
- [ ] CHK028 Is SC-003 measurable (how to verify CLAUDE.md "explicitly documents" the location)? [Measurability, Spec §SC-003]
- [ ] CHK029 Is SC-004 measurable ("Zero specs in root-level") with clear verification (grep, find, or manual audit)? [Measurability, Spec §SC-004]
- [ ] CHK030 Is SC-005 measurable ("100% content preservation") with defined comparison method? [Measurability, Spec §SC-005]
- [ ] CHK031 Is SC-006 measurable ("downstream workflows work correctly") with defined test scenarios? [Measurability, Spec §SC-006]
- [ ] CHK032 Are User Story 1 acceptance scenarios concrete (specific developer action, specific expected output location)? [Measurability, Spec §US1 Acceptance Scenarios]
- [ ] CHK033 Are User Story 3 acceptance scenarios verifiable (migration before/after state is auditable)? [Measurability, Spec §US3 Acceptance Scenarios]

---

## Scenario Coverage

Verify all critical scenarios and flows are addressed in requirements.

- [ ] CHK034 Are requirements defined for "specs exist in both locations" scenario (prioritize .github/specs)? [Coverage, Spec §Edge Cases]
- [ ] CHK035 Are requirements defined for each error type (permission denied, disk full, partial failure) separately? [Coverage, Gap]
- [ ] CHK036 Are zero-error-state requirements defined (happy path: migration succeeds completely)? [Coverage, Gap]
- [ ] CHK037 Are "downstream speckit commands" requirements complete (all commands that need updating identified)? [Coverage, Gap]
- [ ] CHK038 Are nested specs requirements clear (specs with subdirectories, e.g., 002-coderabbit-config-improvements/plan.md)? [Coverage, Gap]
- [ ] CHK039 Are concurrent spec creation scenarios addressed (multiple /speckit-specify commands running simultaneously)? [Coverage, Gap]
- [ ] CHK040 Are requirements defined for the reconfiguration scenario (changing specs_directory mid-project)? [Coverage, Gap]

---

## Non-Functional Requirements

Validate performance, security, accessibility, and maintainability requirements are specified.

- [ ] CHK041 Are performance requirements specified (migration time limits, script execution time)? [Gap, Non-Functional]
- [ ] CHK042 Are security requirements specified (path validation, injection prevention, permissions checking)? [Completeness, Spec §data-model.md §Validation Rules]
- [ ] CHK043 Are maintainability requirements specified (configuration must be self-documenting, code comments)? [Gap, Non-Functional]
- [ ] CHK044 Are cross-platform compatibility requirements specified (POSIX shell, cross-OS filesystem)? [Completeness, Spec §plan.md §Target Platform]

---

## Dependencies & Assumptions

Verify dependencies are documented and assumptions are validated.

- [ ] CHK045 Are all assumptions listed in Assumptions section (e.g., "existing specs identified")? [Completeness, Spec §Assumptions]
- [ ] CHK046 Is each assumption validated or marked as requiring validation? [Traceability, Spec §Assumptions]
- [ ] CHK047 Are dependencies on ".specify/ configuration centrally maintained" documented? [Completeness, Spec §Assumptions line 111]
- [ ] CHK048 Is the dependency on "repository maintainers approve .github/specs location" documented? [Completeness, Spec §Assumptions]
- [ ] CHK049 Is the dependency on git workflows documented (migration requires git operations)? [Gap, Spec §plan.md §Primary Dependencies]
- [ ] CHK050 Are transitive dependencies documented (if create-new-feature.sh changes, does it affect other scripts)? [Completeness, Gap]

---

## Configuration Schema Quality

Validate the specs_directory configuration specification is complete and precise.

- [ ] CHK051 Is the JSON schema in init-options-schema.md complete with all field constraints? [Completeness, contracts/init-options-schema.md]
- [ ] CHK052 Is the default value ".github/specs" documented in both schema and validation rules? [Consistency, contracts/init-options-schema.md]
- [ ] CHK053 Is the pattern rule ^(?!\.\.[a-zA-Z0-9._/\-]+$ clearly explained with valid/invalid examples? [Clarity, contracts/init-options-schema.md §Validation]
- [ ] CHK054 Is backward compatibility (field absent = use default) explicitly specified in contract? [Completeness, contracts/init-options-schema.md]
- [ ] CHK055 Is the migration path from old to new configuration documented (how to update init-options.json)? [Completeness, Gap]

---

## Shell Script Requirements

Validate requirements for script modifications are clear and complete.

- [ ] CHK056 Is the read_specs_directory() helper function signature specified (inputs, outputs, error handling)? [Clarity, Spec §FR-004, Gap]
- [ ] CHK057 Is the multi-parser fallback strategy documented (jq → python3 → grep/sed) in requirements? [Completeness, Gap]
- [ ] CHK058 Is error handling defined for config file missing (abort vs. use default)? [Clarity, Gap]
- [ ] CHK059 Is error handling defined for JSON parse failure (abort vs. use default)? [Clarity, Gap]
- [ ] CHK060 Is the behavior for invalid specs_directory specified (validation error vs. use default)? [Clarity, Gap]
- [ ] CHK061 Are all scripts that read specs_directory identified by name? [Completeness, Gap]

---

## Migration Safety Requirements

Verify migration-specific requirements are complete and safety mechanisms are specified.

- [ ] CHK062 Is pre-migration backup requirement specified (backup strategy, format, retention)? [Completeness, Gap]
- [ ] CHK063 Is conflict detection requirement clear (how to identify specs in both locations)? [Clarity, Gap]
- [ ] CHK064 Is atomic operation requirement specified (all-or-nothing behavior, not incremental)? [Completeness, Spec §FR-009]
- [ ] CHK065 Is the rollback trigger condition fully specified (any error triggers rollback)? [Clarity, Spec §FR-009]
- [ ] CHK066 Is the post-rollback state documented (old location restored, new location empty/removed)? [Completeness, Gap]
- [ ] CHK067 Is the error reporting requirement specified (what error details must be logged)? [Clarity, Spec §FR-009]
- [ ] CHK068 Is the data loss prevention requirement verified (file count verification, content checksums)? [Completeness, quickstart.md]

---

## Documentation Requirements

Validate documentation changes are clearly specified.

- [ ] CHK069 Is the exact CLAUDE.md update documented (which section, exact row addition)? [Clarity, Gap]
- [ ] CHK070 Is the .specify/ documentation update scope defined (README vs. comments vs. separate file)? [Clarity, Spec §FR-007]
- [ ] CHK071 Does quickstart.md cover all five validation scenarios comprehensively? [Completeness, quickstart.md]
- [ ] CHK072 Are troubleshooting steps documented for common migration issues? [Completeness, quickstart.md §Troubleshooting]

---

## Ambiguities & Conflicts

Surface remaining unclear areas and potential contradictions.

- [ ] CHK073 Is "downstream workflows that depend on spec locations" in SC-006 specifically enumerated (CI/CD, agents, etc.)? [Ambiguity, Spec §SC-006]
- [ ] CHK074 Does the specification address whether CHANGELOG.md entry is in scope? [Ambiguity, Gap]
- [ ] CHK075 Is the git workflow for migration documented (commit strategy, branch handling during migration)? [Ambiguity, Gap]
- [ ] CHK076 Does the spec clarify whether existing .specify/feature.json references need updating? [Ambiguity, Spec §FR-006]

---

## Traceability & Linkage

Verify all requirements link to acceptance criteria and vice versa.

- [ ] CHK077 Is each FR linked to 1+ success criteria or acceptance scenarios? [Traceability, Spec]
- [ ] CHK078 Is each user story linked to specific FR requirements? [Traceability, Spec]
- [ ] CHK079 Are edge cases linked to specific FR/SC? [Traceability, Spec §Edge Cases]
- [ ] CHK080 Is each contract element (init-options-schema.md) traceable to a requirement? [Traceability, contracts/]

---

## Notes

- Mark items `[x]` only after requirements review confirms the quality criterion is satisfied
- Leave unchecked when clarification, correction, or reviewer evaluation is still needed
- Use inline comments to document specific issues or questions
- Reference exact line numbers from spec.md, plan.md, etc. for findings
- `/speckit-implement` will read this checklist state; all items should be resolved before implementation begins

---

## Summary

**Reviewer Sign-Off**: Checklist completed by: _________________ | Date: _________________

**Action Items**:

- [ ] All items reviewed
- [ ] Critical gaps resolved (items CHK001-CHK009, CHK042)
- [ ] Ambiguities documented (CHK073-CHK076)
- [ ] Ready for implementation phase
