# Governance Audit & Refactor: Comprehensive Requirements Checklist

**Purpose**: Multi-dimensional validation of governance audit specification quality and refactored governance files (CLAUDE.md, AGENTS.md) across specification completeness, content clarity, reference validity, and constitution alignment.

**Created**: 2026-09-14

**Feature**: [Governance Files Audit & Refactor](../spec.md)

**Review Ownership**: This checklist is a reviewer-owned requirements-quality review artifact. Mark an item `[x]` only when the reviewer determines the requirements-quality criterion is satisfied. `[x]` means the criterion has been reviewed and satisfied for requirements quality. It does NOT mean implementation or refactoring work is complete.

---

## DIMENSION A: Specification Quality

*Testing whether the governance audit specification itself is complete, clear, and well-structured.*

- [ ] CHK001 - Are all six user stories in the specification assigned clear priority levels (P1 vs P2) with documented rationale? [Completeness, Spec §US1-US6]
- [ ] CHK002 - Does each user story have measurable, independently testable acceptance scenarios that don't overlap? [Clarity, Spec §US1-US6]
- [ ] CHK003 - Are success criteria quantified with specific, measurable targets (e.g., "15–25% reduction", "100% of references") rather than vague goals? [Measurability, Spec §SC-001 through SC-009]
- [ ] CHK004 - Does the specification clearly distinguish between what's IN scope (CLAUDE.md and AGENTS.md only) and OUT of scope (locked config files, constitution, instruction folder structure)? [Clarity, Spec §Scope]
- [ ] CHK005 - Are all assumptions documented (e.g., "@ashley has final approval", "branch naming is non-negotiable", "phased rollout approach")? [Completeness, Spec §Assumptions]
- [ ] CHK006 - Is the relationship between this audit and the Constitution clearly documented as the audit's purpose being to improve compliance? [Clarity, Spec §Context]
- [ ] CHK007 - Are edge cases identified and documented (e.g., concurrent edits, consolidated files, archived projects)? [Coverage, Spec §Edge Cases]
- [ ] CHK008 - Does the specification define how "duplicate content" will be detected and measured for success? [Measurability, Spec §FR-001, §SC-003]
- [ ] CHK009 - Are acceptance criteria linked back to user stories so a reader can trace why each criterion matters? [Traceability, Spec §US1-US6 → SC-001-SC-009]
- [ ] CHK010 - Does the specification include a recovery strategy for if refactoring causes downstream breakage? [Coverage, Spec §Clarifications §Q1]

---

## DIMENSION B: Governance File Content Quality

*Testing whether the refactored CLAUDE.md and AGENTS.md are well-structured, clear, and comprehensive.*

### Branch Naming Guidance (CLAUDE.md)

- [ ] CHK011 - Is the branch naming section marked as CRITICAL and positioned prominently (Read First)? [Clarity, CLAUDE.md §Branch Naming]
- [ ] CHK012 - Are all 34 allowed branch type prefixes explicitly listed with examples and purpose? [Completeness, CLAUDE.md §Allowed Type Values]
- [ ] CHK013 - Are the three forbidden prefixes (`claude/`, `copilot/`, `openai/`) clearly marked as NEVER allowed with explicit rationale? [Clarity, CLAUDE.md §FORBIDDEN Prefixes]
- [ ] CHK014 - Does the section explain the cascading consequences of violating branch naming rules (5 specific failure modes)? [Completeness, CLAUDE.md §Why This Matters]
- [ ] CHK015 - Is a validation command provided (npm run validate:branch-name)? [Actionability, CLAUDE.md §Before You Push]
- [ ] CHK016 - Are all branch naming examples consistent in format and only use allowed prefixes? [Consistency, CLAUDE.md §Branch Naming examples]
- [ ] CHK017 - Is the specification-first workflow section documented with clear entry/exit criteria for each phase? [Completeness, CLAUDE.md §Specification-First Workflow]
- [ ] CHK018 - Does the workflow guidance explicitly state "Do NOT create PR automatically after creating a branch"? [Clarity, CLAUDE.md §When to Create Draft PR]

### Label Governance (AGENTS.md)

- [ ] CHK019 - Is "Label Creation Governance (CRITICAL)" present exactly ONCE in AGENTS.md with no duplicate sections? [Consistency, AGENTS.md]
- [ ] CHK020 - Does the consolidated label section include all content from both previous versions (lines 209-252 and 285-338 in original)? [Completeness, AGENTS.md §Label Creation Governance]
- [ ] CHK021 - Are label prefix families defined with examples (type:*, status:*, priority:*, area:*, meta:*)? [Clarity, AGENTS.md §Label Creation Governance]
- [ ] CHK022 - Is the rule "ALL labels MUST include their family prefix" explicitly stated and emphasized? [Clarity, AGENTS.md §Label Creation Governance §The Rule]
- [ ] CHK023 - Are both correct and incorrect label examples provided side-by-side for comparison? [Clarity, AGENTS.md §Label Creation Governance §Example]

### Script Organization Rules (AGENTS.md)

- [ ] CHK024 - Are script organization rules (CRITICAL section) clearly documented with correct and incorrect locations? [Completeness, AGENTS.md §Repository Scripts Organisation]
- [ ] CHK025 - Are exceptions to the "scripts/ not .github/scripts/" rule explicitly listed (.github/website/src/scripts/, .github/agentic-workflows/)? [Completeness, AGENTS.md §The ONLY Exceptions]
- [ ] CHK026 - Is the rationale for script organization rules documented (GitHub-native governance vs executable code)? [Clarity, AGENTS.md §Why This Matters]

### Locked Configuration Files Guidance

- [ ] CHK027 - Are locked configuration files (.github/labels.yml, issue-types.yml, templates) clearly identified with their protection status? [Completeness, CLAUDE.md/AGENTS.md §🔒 Locked Files]
- [ ] CHK028 - Is the change request process documented (issues with specific tags: [LABEL-UPDATE-REQUEST], [TEMPLATE-UPDATE-REQUEST], etc.)? [Actionability, CLAUDE.md/AGENTS.md §Locked Files]
- [ ] CHK029 - Is @ashley's approval authority documented as required for all locked file changes? [Clarity, CLAUDE.md/AGENTS.md §Locked Files]

### File Organization & Structure

- [ ] CHK030 - Does CLAUDE.md clearly state "Full organisation-wide rules live in AGENTS.md"? [Clarity, CLAUDE.md §intro]
- [ ] CHK031 - Are repository folders (agents/, skills/, workflows/, instructions/, plugins/, etc.) documented with their purposes? [Completeness, CLAUDE.md §Portable AI Operations Assets]
- [ ] CHK032 - Is the distinction between `.github/` governance and top-level reusable assets clearly explained? [Clarity, CLAUDE.md §Repository Boundaries]
- [ ] CHK033 - Are there visible section headings that allow readers to quickly locate topics? [Actionability, CLAUDE.md/AGENTS.md]
- [ ] CHK034 - Does AGENTS.md avoid using `references` frontmatter field and use inline links instead? [Consistency, AGENTS.md §references handling]

---

## DIMENSION C: Reference & Link Validation

*Testing whether all references in governance files point to valid, documented locations.*

### File Path References

- [ ] CHK035 - Does CLAUDE.md reference `.github/instructions/branch-naming.instructions.md`? If so, does the file exist? [Gap/Reference Validation]
- [ ] CHK036 - Does CLAUDE.md reference `docs/BRANCHING_STRATEGY.md`? If so, is it documented or does it exist? [Gap/Reference Validation]
- [ ] CHK037 - Does CLAUDE.md reference `docs/PR_CREATION_PROCESS.md`? If so, is it documented or does it exist? [Gap/Reference Validation]
- [ ] CHK038 - Does AGENTS.md reference `.github/instructions/coding-standards.instructions.md`? If so, does it exist? [Gap/Reference Validation]
- [ ] CHK039 - Does AGENTS.md reference `.github/scripts/validation/validate-labels-before-creation.cjs`? If so, does it exist or is migration status documented? [Gap/Reference Validation]
- [ ] CHK040 - Does AGENTS.md reference `instructions/` consolidated files? If so, are the actual files verified to exist and contain claimed consolidations? [Gap/Reference Validation]
- [ ] CHK041 - Are all file path references in AGENTS.md frontmatter valid (e.g., agents/agent.md, .github/custom-instructions.md)? [Completeness, AGENTS.md §references frontmatter]
- [ ] CHK042 - Does AGENTS.md mark `.github/prompts/prompts.md` as "legacy pending migration"? If so, is the migration status clear or is clarification needed? [Ambiguity/Reference Validation]
- [ ] CHK043 - Are GitHub project references (`.github/projects/active/...`) verifiable or documented as archived? [Reference Validation, Spec §Edge Cases]
- [ ] CHK044 - Do all cross-references between CLAUDE.md and AGENTS.md use consistent link anchor format? [Consistency, Spec §FR-009]

### Citation & Traceability

- [ ] CHK045 - Are Constitution principles cited with specific principle numbers when governance rules depend on them? [Traceability, CLAUDE.md/AGENTS.md]
- [ ] CHK046 - When AGENTS.md references "consolidated instruction files," are specific file names provided (e.g., languages.instructions.md)? [Clarity, AGENTS.md §Core instructions consolidated]
- [ ] CHK047 - Is SC-009 (GOVERNANCE_CHANGELOG.md) documented as a deliverable for post-refactoring tracking? [Completeness, Spec §SC-009]

---

## DIMENSION D: Constitution Alignment & Governance Compliance

*Testing whether refactored governance files align with Constitution principles and are themselves well-governed.*

### Principle I: Organization-Wide Governance Authority

- [ ] CHK048 - Does CLAUDE.md clearly state it is the authoritative source for LightSpeed .github standards? [Clarity, CLAUDE.md §What This Repository Is]
- [ ] CHK049 - Does AGENTS.md clearly state these are organisation-wide rules superseding local practices? [Clarity, AGENTS.md §intro]
- [ ] CHK050 - Is the relationship between Constitution, CLAUDE.md, and AGENTS.md documented (hierarchy of authority)? [Clarity, Constitution §Runtime Guidance Separation]

### Principle III: Clear Asset Boundaries (No Duplication)

- [ ] CHK051 - Are there any duplicate sections in refactored CLAUDE.md (duplicates must be eliminated)? [Consistency, Constitution §Principle III]
- [ ] CHK052 - Are there any duplicate sections in refactored AGENTS.md? If DUP-001 was to consolidate "Label Creation Governance", has it been done? [Consistency, Constitution §Principle III]
- [ ] CHK053 - Are portable reusable assets properly placed in top-level folders (agents/, skills/, etc.) rather than `.github/`? [Compliance, Constitution §Asset Organization]
- [ ] CHK054 - Does CLAUDE.md explicitly state "Do not place reusable assets under .github/"? [Clarity, CLAUDE.md §Repository Boundaries]
- [ ] CHK055 - Is duplication between CLAUDE.md and instruction files avoided (guidance not repeated)? [Consistency, Constitution §Principle III]

### Principle V: Branch Naming Strategy is Non-Negotiable

- [ ] CHK056 - Is branch naming marked as CRITICAL and non-negotiable in CLAUDE.md? [Emphasis, Constitution §Principle V]
- [ ] CHK057 - Does the branch naming section explain that branch names determine PR template routing, workflow assignment, and validation? [Clarity, Constitution §Principle V §Rationale]
- [ ] CHK058 - Are the consequences of violating branch naming clearly documented (template failures, workflow skips, manual rework)? [Completeness, Constitution §Principle V]
- [ ] CHK059 - Is the validation command (npm run validate:branch-name) provided as mandatory before push? [Actionability, Constitution §Principle V]
- [ ] CHK060 - Do all guidance examples use only allowed branch type prefixes (no claude/, copilot/, openai/ in examples)? [Compliance, Constitution §Principle V]

### Principle VI: UK English, Accessibility, Security Standards

- [ ] CHK061 - Is UK English spelling used throughout (optimise, colour, organisation, behaviour)? [Consistency, Constitution §Principle VI]
- [ ] CHK062 - Are code examples accessible and properly documented with context? [Accessibility, Constitution §Principle VI]
- [ ] CHK063 - Does security guidance emphasize input validation and secret protection? [Coverage, Constitution §Principle VI, AGENTS.md §security rules]

### Specification-First Workflow Alignment

- [ ] CHK064 - Does CLAUDE.md document the complete SpecKit workflow (specify → clarify → plan → tasks → implement)? [Completeness, Constitution §Specification-First Process]
- [ ] CHK065 - Is the workflow guidance explicit that branch creation precedes PR creation (user controls when to create draft PR)? [Clarity, Constitution §Specification-First Process, Spec §US5]
- [ ] CHK066 - Are success criteria defined for each workflow phase (entry/exit conditions)? [Measurability, Spec §US5]

### Locked Configuration Files Governance

- [ ] CHK067 - Are locked files (.github/labels.yml, issue-types.yml, templates) clearly identified and protected? [Completeness, Constitution §Configuration Governance §LOCKED Files]
- [ ] CHK068 - Is the amendment process documented (issues with specific tags, @ashley approval required)? [Clarity, Constitution §Configuration Governance]
- [ ] CHK069 - Are impact analysis requirements documented for locked file changes (what systems are affected)? [Completeness, Constitution §Configuration Governance]

### Changeability vs Non-Negotiable Constraints

- [ ] CHK070 - Does the governance guidance clearly distinguish between Constitution-level constraints (unchangeable) and implementation details (changeable)? [Clarity, Spec §FR-008]
- [ ] CHK071 - When marking something as "non-negotiable", is the reason explained from a Constitution principle? [Rationale, Constitution §Amendment]
- [ ] CHK072 - Are there clear rules about what can be changed via standard PR review vs what requires @ashley approval? [Clarity, CLAUDE.md/AGENTS.md §Configuration Files]

### Cross-Document Consistency

- [ ] CHK073 - Are branch naming rules identical between CLAUDE.md and any references in AGENTS.md (no conflicting guidance)? [Consistency, Spec §FR-003]
- [ ] CHK074 - Are label governance rules identical between AGENTS.md's two sections (if not consolidated, this is a failure)? [Consistency, Spec §US3]
- [ ] CHK075 - Are script organization rules consistently documented (same folder structure advice everywhere)? [Consistency, Spec §FR-003]
- [ ] CHK076 - Are security requirements consistent throughout (input validation, secret protection, OWASP principles)? [Consistency, CLAUDE.md/AGENTS.md]

---

## DIMENSION A+B+C+D: Integration & Traceability

*Testing that all dimensions work together coherently.*

- [ ] CHK077 - Can a reader trace from a Constitution principle → governance rule → implementation guidance → validation method? [Traceability]
- [ ] CHK078 - Are all success criteria from the specification (SC-001 through SC-009) measurably addressable by checking these checklist items? [Traceability, Spec §Success Criteria]
- [ ] CHK079 - Is a GOVERNANCE_CHANGELOG.md documented as a deliverable showing which spec requirements were addressed by which refactoring changes? [Completeness, Spec §SC-009]
- [ ] CHK080 - Can this checklist be used by @ashley and reviewers to validate compliance before approving the refactored governance files for merge? [Usability]

---

## Notes

- **Specification Quality (CHK001–CHK010)**: Tests whether the audit spec itself is well-written—not whether implementation is done
- **Content Quality (CHK011–CHK034)**: Tests whether governance file requirements are clearly written and complete—not whether readers will understand them perfectly (reading comprehension is reader-dependent)
- **Reference Validation (CHK035–CHK047)**: Tests whether references are documented or verified to exist—broken links are failures, unclear migration paths are failures
- **Constitution Alignment (CHK048–CHK076)**: Tests whether refactored files comply with Constitution principles and clearly communicate governance authority
- **Integration (CHK077–CHK080)**: Tests whether all dimensions work together as a coherent system

**Ownership Note**: This checklist is reviewer-owned. Mark items checked only after confirming the requirements-quality criterion is satisfied. Leave items unchecked when they require clarification, correction, or additional verification.

**Cross-Reference**: See also `checklists/requirements.md` (built-in spec-quality checklist auto-maintained by /speckit-specify and /speckit-clarify).

**Validation Scope**: This checklist does NOT test:
- ❌ Whether readers will understand the governance files (subjective/UX)
- ❌ Whether AI clients will follow the guidance (implementation-dependent)
- ❌ Whether locked configuration files are correctly updated (out of scope per spec)
- ❌ Whether dependent repositories have been notified (post-approval concern)

**Validation Scope**: This checklist DOES test:
- ✅ Whether requirements are completely written and unambiguous
- ✅ Whether references are documented/verified
- ✅ Whether governance is clearly communicated and justified
- ✅ Whether Constitution principles are reflected in governance files
- ✅ Whether the refactored files serve as single source of truth for their topics
