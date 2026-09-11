# Feature Specification: CodeRabbit Configuration Optimization

**Feature Branch**: `feat/coderabbit-config-optimization`

**Created**: 2026-09-11

**Status**: Draft

**Input**: User description: "Analyze the current CodeRabbit configuration and create improvements that increase code review coverage and quality, improve consistency across reviewed file types, better integrate with branch naming strategy and labeling system, ensure critical file types have comprehensive review instructions, and optimize instruction clarity and actionability"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Code Reviewer Gets Clear, Actionable Guidance (Priority: P1)

As a CodeRabbit AI reviewer examining changes to any project file, I need clear, specific, actionable review instructions for each file type, so that I can provide consistent, high-quality feedback regardless of which file I'm reviewing.

**Why this priority**: This is the core value of CodeRabbit itself. Without clear instructions, reviews become inconsistent or miss critical issues. This directly impacts code quality across all repositories.

**Independent Test**: Can be tested by submitting PRs with changes to different file types and verifying that CodeRabbit provides relevant, specific feedback addressing the instructions defined for that file type.

**Acceptance Scenarios**:

1. **Given** a PR modifying `.github/workflows/*.yml`, **When** CodeRabbit reviews it, **Then** feedback includes checks from "Review .github workflows for CI/CD" instruction block
2. **Given** a PR modifying code files in the repository, **When** CodeRabbit reviews it, **Then** feedback covers accessibility, performance, and code quality per the configuration's language-appropriate instructions
3. **Given** a PR modifying security-related files, **When** CodeRabbit reviews it, **Then** security-specific guidance is prominently featured
4. **Given** a PR from `feat/*` branch with code changes, **When** CodeRabbit reviews it, **Then** feedback includes feature-context-specific guidance (new functionality review)

---

### User Story 2 - Maintainers Can Verify Review Coverage Completeness (Priority: P2)

As a repository maintainer, I need to verify that all file types in the repository have appropriate CodeRabbit review instructions, so I can identify gaps where code changes might be reviewed inadequately.

**Why this priority**: Prevents blind spots where changes to critical files might not get proper review. Enables data-driven decisions about where to add or improve review instructions.

**Independent Test**: Can be tested by comparing the config's path_instructions against actual files in the repository structure and verifying coverage. Maintainers should be able to run a report listing under-reviewed paths.

**Acceptance Scenarios**:

1. **Given** all file paths in repository, **When** cross-referenced against path_instructions, **Then** coverage report shows which directories/file types lack instructions
2. **Given** new files added to `.specify/` or `plugins/` directories, **When** config is updated, **Then** these paths have specific review instructions
3. **Given** security-related files, **When** reviewing coverage, **Then** all security-critical files have dedicated or inherited security review instructions

---

### User Story 3 - Branch Strategy Enforcement Aligns with Reviews (Priority: P2)

As a developer creating a PR from a specific branch type (feat/, fix/, security/), I need the CodeRabbit review instructions to adapt to my branch type context, so that the feedback I receive is relevant to the type of change I'm making.

**Why this priority**: Currently branch types (feat, fix, docs, security, etc.) define PR templates and labeling, but review instructions don't differentiate. This means a security fix gets the same review as a documentation update, which is inefficient.

**Independent Test**: Can be tested by examining instructions for common file types and verifying context-awareness based on branch prefix.

**Acceptance Scenarios**:

1. **Given** a PR from `security/*` branch modifying authentication code, **When** CodeRabbit reviews, **Then** security-specific checks are highlighted
2. **Given** a PR from `docs/*` branch modifying documentation, **When** CodeRabbit reviews, **Then** documentation-specific criteria (clarity, structure, links) are prioritized
3. **Given** a PR from `perf/*` branch modifying algorithms, **When** CodeRabbit reviews, **Then** performance-specific guidance about benchmarking is included

---

### User Story 4 - New File Types and Tooling Are Covered (Priority: P3)

As a contributor adding SpecKit, workflow, or plugin files, I need CodeRabbit to understand and review these new file types appropriately, so that I get feedback relevant to these specialized project assets.

**Why this priority**: These are emerging file types in the organization. Without specific instructions, reviews might miss important patterns or best practices specific to these files.

**Independent Test**: Can be tested by creating/modifying files in `.specify/`, `workflows/`, `plugins/` directories and verifying CodeRabbit provides relevant feedback.

**Acceptance Scenarios**:

1. **Given** changes to `.specify/spec.md` or `.specify/plan.md`, **When** CodeRabbit reviews, **Then** feedback includes checks for specification completeness and planning rigor
2. **Given** changes to `workflows/*.md` (agentic workflow documentation), **When** CodeRabbit reviews, **Then** feedback verifies workflow structure and clarity
3. **Given** changes to `plugins/*/SKILL.md`, **When** CodeRabbit reviews, **Then** feedback ensures proper documentation and usability guidelines

---

### User Story 5 - Consistency Across Instructions Improves Usability (Priority: P3)

As a CodeRabbit configuration maintainer, I need consistent structure, tone, and formatting across all review instructions, so that the config is easier to maintain and extend.

**Why this priority**: Currently instructions vary in structure, detail level, and formatting. This makes the config harder to parse and maintain. Consistency enables better tooling and understanding.

**Independent Test**: Can be tested by analyzing instruction blocks for structural consistency, common patterns, and adherence to style guidelines.

**Acceptance Scenarios**:

1. **Given** all instruction blocks, **When** analyzed, **Then** each follows consistent structure: description → review focus areas → specific checks → references
2. **Given** instructions mentioning similar concepts, **When** reviewed, **Then** terminology is consistent (e.g., "validation" vs "verification" used consistently)
3. **Given** formatting across blocks, **When** inspected, **Then** bullet structure, indentation, and emphasis follow consistent patterns

---

### Edge Cases

- When a file matches multiple path patterns, more specific patterns override general ones (e.g., `**/e2e/*.spec.js` takes priority over `**/*.js`)
- Generic patterns (e.g., `**/*.md`) serve as fallback instructions for files not matching specific patterns
- Files in nested `.github/` directories in sub-repositories follow the same pattern priority rules
- Instructions must evolve without breaking existing review workflows - additions/clarifications only, no breaking changes

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Configuration MUST define review instructions for all file types currently used in the `.github` repository (workflows, templates, issue/PR config, documentation, agents, prompts, etc.)
- **FR-002**: Each path pattern MUST have a clear, actionable instruction block that includes specific review focus areas
- **FR-003**: Security-critical file types MUST have prominent security review guidance (authentication, secrets handling, access control)
- **FR-004**: Performance-related file types MUST include performance review criteria where applicable
- **FR-005**: Accessibility-related file types MUST reference WCAG 2.2 AA standards per organizational requirement
- **FR-006**: Configuration MUST provide branch-type-specific review instructions for the top 15-20 branch types by organizational usage frequency (feat/, fix/, hotfix/, release/, refactor/, chore/, task/, docs/, test/, perf/, ci/, security/, design/, a11y/, ops/, and 5-10 additional high-frequency types) - enabling context-aware feedback adapted to the nature of each change category
- **FR-007**: SpecKit-related files (`.specify/spec.md`, `.specify/plan.md`, `.specify/tasks.md`) MUST have dedicated review instructions
- **FR-008**: Workflow and plugin files MUST have review instructions
- **FR-009**: Configuration MUST be internally consistent (terminology, structure, formatting)
- **FR-010**: Instructions MUST avoid duplication with content in AGENTS.md, CLAUDE.md, or other centralized documentation
- **FR-011**: Label automation workflow documentation MUST be reviewed for accuracy against `.github/labels.yml` reality
- **FR-012**: PR and issue template standards documented in config MUST match actual templates in `.github/PULL_REQUEST_TEMPLATE/` and `.github/ISSUE_TEMPLATE/`
- **FR-013**: Review instructions MUST be contextualized by branch type - each of the top 15-20 branch types by usage frequency MUST have adapted guidance that reflects the specific review priorities for that change category (e.g., security-focused for security/, performance-focused for perf/, etc.)
- **FR-014**: Path pattern matching MUST follow explicit priority/specificity order - when files match multiple patterns, more specific patterns override general patterns (e.g., `**/e2e/*.js` before `**/*.js`). Pattern priority MUST be documented in config.
- **FR-015**: Documentation MUST include an external "CodeRabbit Configuration Audit Guide" (separate from `.coderabbit.yml`) that helps maintainers verify review coverage completeness and identify gaps.

### Key Entities

- **CodeRabbit Configuration**: The YAML structure defining review settings and path-specific instructions
- **Path Pattern**: A glob pattern (e.g., `**/*.js`) that matches file paths requiring review
- **Review Instruction Block**: A structured set of guidance for a specific file type or path
- **Branch Type**: A category from the branch naming strategy (feat/, fix/, security/, etc.)
- **Review Coverage Gap**: A file type or path currently under-reviewed or missing instructions

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Configuration MUST include explicit review instruction blocks for at least 95% of file types/paths used in the repository (baseline: ~50 file types identified in Phase 1 audit, targeting coverage of at least 47-50 types)
- **SC-002**: Every instruction block MUST have at least 3 specific, testable review focus areas
- **SC-003**: Security-critical files (`.github/workflows/`, secrets handling, auth code) MUST have dedicated security guidance appearing before generic guidance
- **SC-004**: All path patterns MUST be non-overlapping or clearly document priority/cascading behavior (reviewed within 1 day by maintainer)
- **SC-005**: Documentation in the config MUST match actual GitHub automation behavior (labels, templates, workflows) with zero discrepancies
- **SC-006**: Configuration file MUST be structured for maintainability: logically grouped sections, clear comments, consistent formatting (evaluable through code review)
- **SC-007**: New file types (`.specify/`, `workflows/`, `plugins/`) MUST be covered with review instructions
- **SC-008**: Instruction consistency MUST be validated: terminology standardized, structure uniform across all blocks (measurable through analysis tool)
- **SC-009**: CodeRabbit reviews using the updated config MUST cite relevant specific guidance from path_instructions for at least 85% of reviews (measured by review audit)
- **SC-010**: Maintainability MUST improve: adding a new file type instruction should take <5 minutes and not require edits to multiple sections
- **SC-011**: Branch-type-specific guidance MUST be present for at least the top 15 branch types by usage frequency (security/, feat/, fix/, docs/, perf/, a11y/, refactor/, chore/, test/, ci/, hotfix/, release/, design/, task/, ops/) verified through review
- **SC-012**: Path pattern priority MUST be clearly documented - specificity order rules documented in comments, and priority conflicts resolved in favor of more specific patterns with zero ambiguity
- **SC-013**: External audit guide MUST be created at `.github/docs/CODERABBIT_COVERAGE_AUDIT.md` with step-by-step instructions for maintainers to verify config completeness and identify under-reviewed file types

## Assumptions

- **Scope**: This specification covers improvements to the `.coderabbit.yml` file itself, not changes to CodeRabbit's platform, API, or core functionality
- **Backward Compatibility**: Updates must not break existing CodeRabbit workflows or PR review flows—they should be additive or clarifying only
- **File Coverage**: The specification addresses file types currently in the repository; future new file types will be handled via separate updates
- **Labeling System**: Current label taxonomy in `.github/labels.yml` is frozen (marked LOCKED in CLAUDE.md). Improvements won't alter labeling but will reference existing labels accurately
- **Template Accuracy**: Current PR and issue templates in `.github/PULL_REQUEST_TEMPLATE/` and `.github/ISSUE_TEMPLATE/` are the source of truth; config documentation will be updated to reflect their actual requirements
- **Branch Strategy**: The 30+ branch types defined in CLAUDE.md branch naming section are authoritative; review instructions will align with this categorization
- **Organization Standards**: Configuration assumes adherence to UK English, WordPress Coding Standards, WCAG 2.2 AA accessibility, as defined in CLAUDE.md and AGENTS.md
- **No Duplication**: Improvements will avoid duplicating guidance already documented in AGENTS.md (global AI rules), CLAUDE.md (repo instructions), and `.github/instructions/*.instructions.md` (specific guidance files)
- **Maintainability Over Completeness**: When faced with a choice between comprehensive coverage and maintainability, maintainability wins. Instructions should be clear and actionable, not exhaustive encyclopedic lists.
- **Branch-Specific Reviews**: Review instructions will differentiate by branch type for the top 15-20 branch types by organizational usage frequency (feat/, fix/, security/, docs/, perf/, a11y/, ci/, hotfix/, refactor/, task/, release/, chore/, test/, design/, ops/, and additional high-frequency types), enabling context-aware feedback tailored to the nature of each change.

## Clarifications

### Session 2026-09-11

- Q: Should review instructions adapt based on branch type (feat/, fix/, security/, etc.)? → A: Yes, for top 15-20 branch types by usage frequency - context-aware review guidance for high-impact change categories. Reduces scope from all 30+ types while covering 80%+ of actual branch usage patterns.
- Q: When files match multiple path patterns, should instructions cascade or use priority order? → A: Explicit priority/specificity order - more specific patterns override general ones (e.g., `**/e2e/*.js` before `**/*.js`).
- Q: Should config include a "review coverage audit checklist" or keep this external? → A: External reference guide - document audit approach in project documentation, maintainers reference as needed. Keeps config focused on review instructions.
- Q: Should branch-type-specific guidance cover all 30+ types or focus on high-frequency types? → A: Top 15-20 by usage frequency (Option A) - delivers 80% value with cleaner maintainability, avoids comprehensive but fragile coverage of rarely-used branch types (security/, proto/, codex/, etc.).
