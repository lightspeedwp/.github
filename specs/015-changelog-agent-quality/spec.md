# Feature Specification: Changelog Agent Quality & Validation Framework

**Feature Branch**: `refactor/changelog-agent-quality`

**Created**: 2026-09-18

**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Local Changelog Validation with Clear Feedback (Priority: P1)

Developers and CI systems need to validate changelog entries locally before committing, with clear, actionable error messages that explain exactly what failed and how to fix it. Currently, the validation script runs in CI but fails silently or produces confusing output; developers cannot debug locally.

**Why this priority**: This is the blocking issue preventing the changelog quality validation workflow from working. Until developers can validate locally with clear feedback, the entire validation system fails.

**Independent Test**: Can be fully tested by running `npm run changelog:validate` locally on a branch with intentionally invalid entries and verifying: (1) the command exits with error code, (2) feedback lists specific validation failures with line numbers, (3) feedback includes actionable fix suggestions, (4) output formatting is clear and parsable.

**Acceptance Scenarios**:

1. **Given** a changelog entry that is too long (>250 chars), **When** developer runs validation locally, **Then** the tool reports "Entry exceeds 250-character limit (256 chars found): '[entry text]...'" with line number and fix suggestion
2. **Given** a changelog entry with no linked PR/issue, **When** developer runs validation locally, **Then** the tool reports "Entry missing PR/issue link (required format: #123 or PR-456)" with fix suggestion
3. **Given** all valid entries, **When** developer runs validation locally, **Then** the tool exits with code 0 and reports "✅ All entries pass validation"
4. **Given** mixed valid and invalid entries, **When** developer runs validation, **Then** tool reports all failures with specific guidance for each, allows developer to see all issues before fixing (not fail-fast)

---

### User Story 2 - Changelog Agent Skills Conformance to agentskills.io Spec (Priority: P2)

The changelog agent needs to be restructured with proper skills that conform to the agentskills.io specification, with clear metadata, documentation, and integration with the skill registry. Currently, validation logic is scattered across multiple scripts with no formal skill structure.

**Why this priority**: Without proper skill structure, the agent cannot be reliably invoked by other systems or agents. Conformance to the spec enables reusability and consistent integration patterns.

**Independent Test**: Can be fully tested by verifying: (1) each changelog skill has valid `metadata.yml` conforming to agentskills.io spec, (2) skills have unique identifiers and version info, (3) skills are discoverable via the skill registry, (4) skills can be invoked standalone with correct parameters, (5) skill documentation is complete and accurate.

**Acceptance Scenarios**:

1. **Given** the changelog agent, **When** scanning the agent's skill directory, **Then** each skill file has a `metadata.yml` with: id, version, description, triggers, inputs, outputs, error handling
2. **Given** the changelog-validate skill, **When** invoking it with `--changelog-path`, **Then** it executes correctly and returns structured JSON with validation results
3. **Given** the skill registry lookup, **When** searching for "changelog" skills, **Then** all changelog skills appear with correct metadata and version info
4. **Given** external systems, **When** attempting to invoke changelog skills via agent API, **Then** they receive consistent, documented responses with proper error handling

---

### User Story 3 - Changelog Agent Documentation (Priority: P3)

Comprehensive documentation for the changelog agent must exist at `docs/agents/changelog-agent/`, following the same structure and depth as the prd-agent documentation, enabling developers to understand agent capabilities, skills, workflows, and usage patterns.

**Why this priority**: Documentation enables adoption and reduces onboarding friction. Without it, the agent's capabilities remain hidden and the team cannot reliably use it.

**Independent Test**: Can be fully tested by verifying: (1) docs exist at expected path, (2) all sections from prd-agent docs are present, (3) examples are runnable locally, (4) API documentation is complete, (5) troubleshooting section exists and addresses common issues.

**Acceptance Scenarios**:

1. **Given** a new developer, **When** reading `docs/agents/changelog-agent/README.md`, **Then** they understand: agent purpose, which skills are available, how to invoke each skill, expected inputs/outputs, common failure modes and fixes
2. **Given** the agent skill documentation, **When** reviewing `docs/agents/changelog-agent/SKILLS.md`, **Then** each skill is documented with: name, purpose, required parameters, example invocation, expected output, error codes
3. **Given** troubleshooting needs, **When** consulting `docs/agents/changelog-agent/TROUBLESHOOTING.md`, **Then** they find solutions for: validation failures, script not found errors, workflow integration issues, common parameter mistakes
4. **Given** integration requirements, **When** reviewing `docs/agents/changelog-agent/INTEGRATION.md`, **Then** they understand: how to invoke from workflows, how to invoke from other agents, how to chain skills, authentication/permissions needed

---

### User Story 4 - Changelog Workflow Labeling Integration (Priority: P4)

The changelog validation workflow must be tied to the labeling strategy, ensuring that changelog-related labels are correctly applied by the agent during PR processing, and that the workflow enforces compliance with the canonical label set defined in `.github/labels.yml`.

**Why this priority**: Changelog labels are part of the broader labeling strategy and must be synchronized with PR routing, automation, and metrics tracking. This integration ensures end-to-end consistency.

**Independent Test**: Can be fully tested by verifying: (1) changelog validation applies correct `meta:changelog-*` labels to PRs, (2) workflow rejects PRs with non-canonical changelog labels, (3) PR template includes changelog-related label guidance, (4) labeling is consistent across all changelog workflows.

**Acceptance Scenarios**:

1. **Given** a PR with changelog entries, **When** the workflow validates, **Then** it applies label `meta:has-changelog` if all entries pass validation
2. **Given** a PR with changelog entries that fail validation, **When** the workflow validates, **Then** it applies label `meta:needs-changelog-fix` and blocks merge with clear feedback
3. **Given** the canonical label set, **When** scanning PR labels, **Then** all changelog-related labels (`meta:has-changelog`, `meta:needs-changelog-fix`, `meta:changelog-*`) are from the canonical set in `.github/labels.yml`
4. **Given** PR processing, **When** the labeling workflow runs, **Then** changelog labels are applied automatically with no manual intervention needed

---

### Edge Cases

- What happens when a changelog file doesn't exist in a PR (new repo or first release)?
- How does the system handle changelog entries for automated commits (deps, chores)?
- What happens when multiple changelog agents run concurrently (race conditions)?
- How does the system handle changelog entries with special characters or Unicode?
- What happens when a changelog skill fails due to file system permissions?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Changelog validation tool MUST run locally with `npm run changelog:validate [--changelog-path PATH]` and provide structured output (JSON or parsable text) with all validation results
- **FR-002**: Validation tool MUST check changelog entries for: length (≤250 chars), PR/issue linking, formatting consistency (Keep a Changelog format), no implementation details
- **FR-003**: Changelog agent MUST have at minimum 3 skills: `validate` (entry validation), `check-links` (PR/issue verification), `merge` (changelog consolidation), each with `metadata.yml` conforming to agentskills.io spec
- **FR-004**: Each changelog skill MUST have: unique ID, version, description, triggers, input schema, output schema, error handling specification
- **FR-005**: Validation failures MUST be clearly reported with: specific error type, location (line number/entry), expected format, actual content, fix suggestion
- **FR-006**: Changelog documentation MUST exist at `docs/agents/changelog-agent/` with: README.md (overview, quick start), SKILLS.md (skill reference), INTEGRATION.md (workflow integration), TROUBLESHOOTING.md (common issues and fixes), API.md (detailed API documentation)
- **FR-007**: Changelog workflow MUST apply labels from canonical set (`.github/labels.yml`) with prefix `meta:` for changelog status tracking
- **FR-008**: Validation workflow MUST run on every PR that modifies CHANGELOG.md and provide feedback via GitHub PR comments or status checks
- **FR-009**: Workflow MUST block merge if changelog entries fail validation (configurable bypass for chores/deps with explicit label)
- **FR-010**: Scripts and validation logic currently scattered across `scripts/validation/`, `agents/changelog-agent/`, and `scripts/workflows/` MUST be reorganized into changelog agent skill directories with clear purpose and no duplication

### Key Entities

- **Changelog Entry**: A single line or paragraph in CHANGELOG.md representing a user-facing change; attributes: version, type (feat/fix/breaking), content, PR/issue link, character count
- **Validation Result**: Output of changelog validation; attributes: entry ID, valid (boolean), errors (array of error objects), warnings (array), fix suggestions
- **Error Object**: Structured error report; attributes: error_type (length/formatting/linking/clarity), message, location (line number), expected_format, actual_value, fix_suggestion
- **Skill Metadata**: Configuration for a changelog skill; attributes: id, version, description, triggers, input_schema, output_schema, error_codes

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can run changelog validation locally and see all validation results within 5 seconds (no CI wait needed for feedback)
- **SC-002**: Validation error messages are clear enough that 90% of developers can fix issues without additional guidance
- **SC-003**: 100% of changelog skills have documented metadata conforming to agentskills.io spec with zero validation errors
- **SC-004**: Changelog agent documentation at `docs/agents/changelog-agent/` has equivalent depth and clarity to existing prd-agent documentation (measurable: same number of sections, examples, troubleshooting entries)
- **SC-005**: Changelog validation workflow runs on every PR modifying CHANGELOG.md within 30 seconds of PR creation
- **SC-006**: Workflow blocks merge for invalid changelog entries in 100% of cases (unless explicitly bypassed with documented reason)
- **SC-007**: Changelog-related labels are applied correctly in 100% of PR processing runs
- **SC-008**: Test coverage for changelog agent reaches ≥85% (lines executed during test suite)
- **SC-009**: All changelog scripts are colocated within the changelog agent directory structure with no duplication or orphaned validation code in `scripts/validation/`
- **SC-010**: Developers report ≥80% confidence in changelog quality when using the validation tool locally

## Assumptions

- The existing changelog validation rules (entry length ≤250 chars, PR linking required, etc.) remain stable and are documented in `docs/CHANGELOG_RULES.md`
- The agentskills.io specification (<https://agentskills.io/specification>) remains the authoritative source for skill metadata structure
- The prd-agent documentation at `docs/agents/prd-agent/` serves as the style and structure template for changelog agent docs
- Changelog validation is non-blocking for automated commits (chores, deps) and can be configured per PR type or with explicit label
- The canonical label set in `.github/labels.yml` already includes changelog-related labels or they will be added as part of this work
- Node.js and npm are available in all environments where changelog validation runs (local, CI, agent runtime)
- The changelog agent is a Node.js-based system (consistent with existing agent implementations in the repository)
- The validation workflow integrates with GitHub Actions and PR status checks (no external CI system required)
- Existing changelog scripts in `scripts/validation/fix-changelog-format.cjs` and `scripts/workflows/changelog/merge-entries.cjs` are candidates for refactoring into skills
