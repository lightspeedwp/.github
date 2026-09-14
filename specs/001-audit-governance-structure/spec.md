# Feature Specification: Governance Files Audit & Refactor

**Feature Branch**: `audit/governance-files-refactor`

**Created**: 2026-09-14

**Status**: Draft

**Input**: User description: "Audit CLAUDE.md and AGENTS.md governance files to fix branch naming configuration issues, improve structure, establish proper AI client workflow (branch → spec → draft PR → review → merge), and resolve duplicates and bad references."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Governance Files Quality Baseline (Priority: P1)

As a **project maintainer**, I need to understand the current state of governance files (CLAUDE.md, AGENTS.md) so that I can identify structural issues, duplicates, and misaligned content that undermines their authority as the single source of truth.

**Why this priority**: The governance files are foundational for all AI client behavior, branch naming enforcement, PR routing, and automation. Issues in these files cascade across 50+ repositories. A quality baseline is essential before any refactoring can succeed. This is the prerequisite for all downstream work.

**Independent Test**: Audit completeness test—can verify by: (1) reading both files end-to-end, (2) mapping section overlap, (3) cross-referencing claims against actual file locations (e.g., does `.github/instructions/branch-naming.instructions.md` actually exist?), (4) identifying duplicate sections with diff analysis.

**Acceptance Scenarios**:

1. **Given** both governance files are in their current state, **When** audit is performed, **Then** a detailed report is generated identifying all duplicate sections, bad references, orphaned content, and structural inconsistencies
2. **Given** references in the files, **When** cross-referenced against actual repository structure, **Then** all broken or outdated links are identified and prioritized
3. **Given** claims about consolidated instruction files, **When** mapped against actual file locations, **Then** gaps between intended and actual structure are documented

### User Story 2 - Branch Naming Configuration Alignment (Priority: P1)

As an **AI client user**, I need the branch naming conventions to be consistently enforced across all tools so that my branches are created with correct prefixes (e.g., `audit/`, `feat/`, `refactor/`) instead of forbidden prefixes (e.g., `claude/`, `copilot/`), which prevents PR template routing failures and GitHub Actions workflow breakage.

**Why this priority**: Claude Code's default behavior creates branches with `claude/` prefix, violating the established naming convention. This causes cascading failures: PR templates don't route correctly, GitHub Actions workflows skip, validation checks fail, and users waste time fixing branches. This is a critical pain point affecting every user session.

**Independent Test**: Can be tested by: (1) verifying that AI client configuration and CLAUDE.md/AGENTS.md guidance are aligned on forbidden prefixes, (2) confirming no conflicting guidance exists in consolidated instruction files, (3) ensuring clear warnings about why `claude/` is forbidden and when to use alternatives.

**Acceptance Scenarios**:

1. **Given** an AI client following CLAUDE.md guidance, **When** creating a branch for an audit task, **Then** the branch is correctly named `audit/governance-files-refactor` (not `claude/...`)
2. **Given** conflicting guidance exists in multiple files, **When** consolidated, **Then** a single authoritative statement exists about which prefixes are forbidden and why
3. **Given** a developer reading CLAUDE.md, **When** they look for branch naming rules, **Then** they find clear, actionable guidance without needing to cross-reference multiple files

### User Story 3 - Duplicate Content Resolution (Priority: P1)

As a **content maintainer**, I need to eliminate the duplicate "Label Creation Governance (CRITICAL)" section that appears twice in AGENTS.md with slightly different content, so that there is a single source of truth and no confusion about which version is authoritative.

**Why this priority**: AGENTS.md contains the identical "Label Creation Governance (CRITICAL)" section at lines 209–252 and again at lines 285–338. This duplication creates maintenance debt, confuses readers about which version is correct, and violates the constitution's principle of "no duplication." Consolidating this section is essential before any other refactoring.

**Independent Test**: Can be tested by: (1) diffing both sections to confirm duplication, (2) verifying that consolidated version contains all unique information from both occurrences, (3) confirming no content loss in consolidation.

**Acceptance Scenarios**:

1. **Given** two duplicate "Label Creation Governance" sections in AGENTS.md, **When** consolidated, **Then** only one authoritative version remains with all unique content preserved
2. **Given** references in both sections, **When** consolidated, **Then** all unique references are retained and deduplicated
3. **Given** a reader looking for label governance rules, **When** they search AGENTS.md, **Then** they find exactly one section with no ambiguity about which is canonical

### User Story 4 - Governance File Organization & Structure (Priority: P2)

As a **contributor**, I need the governance files to be organized logically with clear hierarchies and minimal cross-referencing, so that I can navigate them efficiently and find relevant guidance without needing to read the entire file or switch between documents.

**Why this priority**: CLAUDE.md and AGENTS.md mix different concerns (branch naming, label governance, script organization, AI rules, etc.) with inconsistent section ordering and unclear relationships between concepts. This makes the files harder to maintain and harder for users to navigate. Better organization improves discoverability and reduces time to find guidance.

**Independent Test**: Can be tested by: (1) creating a table of contents showing section hierarchy, (2) verifying that related sections are grouped together, (3) confirming that cross-references use clear link anchors and follow a consistent pattern.

**Acceptance Scenarios**:

1. **Given** current file structure, **When** a new section is needed, **Then** there is a clear pattern for where it should go
2. **Given** a section about branch naming, **When** a reader needs related information, **Then** all related topics are either in the same section or clearly linked with context
3. **Given** CLAUDE.md and AGENTS.md, **When** a user needs AI client guidance, **Then** they can quickly determine which file contains the relevant section without reading both files in full

### User Story 5 - Establish Specification-First Workflow Guidance (Priority: P2)

As a **spec user**, I need clear, documented workflow guidance for the specification-first process (branch → spec → draft PR → review → merge to develop), so that I can follow a consistent process and know exactly when to create branches, when to create specs, and when to convert specs to draft PRs.

**Why this priority**: The constitution mentions the SpecKit workflow but CLAUDE.md and AGENTS.md don't provide step-by-step guidance for the complete workflow from branch creation through spec writing to PR creation. This creates ambiguity for users like @ashley who want to work in branches before creating PRs.

**Independent Test**: Can be tested by: (1) following the documented workflow step-by-step, (2) verifying that each step has clear entry and exit criteria, (3) confirming that success criteria for each phase are measurable.

**Acceptance Scenarios**:

1. **Given** a new task to implement, **When** following the documented workflow, **Then** I know exactly which branch to create first
2. **Given** a complete spec, **When** following the documented workflow, **Then** I know when and how to create a draft PR
3. **Given** CI failures on a PR, **When** following the documented workflow, **Then** I have clear guidance on how to address them before requesting review

### User Story 6 - Reference & Link Validation (Priority: P2)

As a **reader**, I need all references and links in governance files to point to actual, valid locations, so that I can trust the guidance and not waste time chasing dead links or outdated references.

**Why this priority**: Both files contain references to files that may not exist, outdated paths, or incomplete migrations (e.g., `.github/prompts/prompts.md` is marked as "legacy pending migration"). These bad references undermine trust in the governance files and waste user time when they can't find referenced documentation.

**Independent Test**: Can be tested by: (1) scanning all file paths and URLs in both governance files, (2) verifying each exists in the repository, (3) checking for outdated or deprecated references, (4) confirming migration status of legacy references.

**Acceptance Scenarios**:

1. **Given** a reference in CLAUDE.md to `.github/instructions/branch-naming.instructions.md`, **When** verified, **Then** the file exists and contains the referenced content
2. **Given** a reference to legacy files, **When** verified, **Then** either the file exists or clear migration guidance is documented
3. **Given** all references in both files, **When** systematically checked, **Then** no broken links or outdated references remain

### Edge Cases

- What happens if a referenced instruction file has been consolidated or moved but not updated in governance files?
- How do we handle references to GitHub projects (`.github/projects/active/`) that may be archived or renamed?
- What if governance guidance conflicts with constitution principles but has been implemented in practice?
- How do we validate that consolidated instruction files mentioned in AGENTS.md actually contain all the content they claim to consolidate?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Governance audit MUST identify all duplicate content sections across CLAUDE.md and AGENTS.md with specific line number references
- **FR-002**: Audit MUST validate all file path references against actual repository structure and report broken or outdated links
- **FR-003**: Audit MUST identify conflicting guidance about branch naming, label creation, script organization, and AI rules that exists in multiple files
- **FR-004**: Audit MUST map relationships between CLAUDE.md, AGENTS.md, constitution, instruction files, and dependent systems (workflows, agents, scripts)
- **FR-005**: Refactored CLAUDE.md MUST contain clear, actionable branch naming guidance aligned with constitution, with no forbidden prefixes created by default AI tools
- **FR-006**: Refactored AGENTS.md MUST have single-source-of-truth sections for each topic (no duplicate "Label Creation Governance" or other sections)
- **FR-007**: Refactored governance files MUST include specification-first workflow guidance showing branch → spec → draft PR → review → merge process
- **FR-008**: Refactored governance files MUST clearly distinguish between constraints that are constitution-level (unchangeable) versus implementation details (changeable per project)
- **FR-009**: All cross-references between CLAUDE.md and AGENTS.md MUST use consistent link anchors and clearly indicate which file to consult for each topic
- **FR-010**: Instruction files referenced in governance MUST be verified to exist; if consolidated/migrated, governance MUST be updated to match actual locations

### Key Entities

- **Governance File**: CLAUDE.md or AGENTS.md—contains standards, conventions, and guidance (static, manually curated by @ashley)
- **Constitution**: Principles document defining non-negotiable governance rules and scope boundaries (supersedes all other files)
- **Instruction Files**: Portable, reusable guidance files in `instructions/` folder (organization-wide standards)
- **Configuration Files**: LOCKED files like `.github/labels.yml`, `.github/issue-types.yml`, templates (require explicit approval to change)
- **Branch Name**: Git branch following pattern `{type}/{scope}-{title}` (determines PR template routing and workflow assignment)
- **Reference**: Link or path in governance files pointing to another file, section, or external resource

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Audit report identifies and categorizes ALL duplicate sections, bad references, and structural issues in CLAUDE.md and AGENTS.md (must be 100% complete, not sampling)
- **SC-002**: Refactored CLAUDE.md contains zero forbidden branch prefixes in examples and guidance; all examples use correct prefixes (audit, feat, fix, etc.)
- **SC-003**: AGENTS.md reduced from 2 duplicate "Label Creation Governance" sections to 1 authoritative section with no content loss
- **SC-004**: All file path references validated; 100% of referenced files either exist in repository or have documented migration status
- **SC-005**: New workflow section added to governance files clearly explaining spec-first process with entry/exit criteria for each phase
- **SC-006**: Governance files reduced by 15–25% in duplicate content while maintaining 100% of unique information and guidance
- **SC-007**: Cross-references between CLAUDE.md and AGENTS.md use consistent anchor format; a reader can quickly find related content in the "other" file
- **SC-008**: All consolidated instruction files referenced in AGENTS.md verified to contain claimed consolidations (e.g., if file claims "consolidated 4 files," all 4 topics are present)

## Assumptions

- **Assumption**: CLAUDE.md and AGENTS.md are authoritative governance files that supersede project-specific instruction files (per constitution)
- **Assumption**: The constitution (`.specify/memory/constitution.md`) defines non-negotiable principles; any conflicts indicate governance file error, not constitution error
- **Assumption**: @ashley maintains final approval for changes to locked governance files; audit may identify issues but implementation requires her approval
- **Assumption**: Branch naming rules are non-negotiable and MUST be enforced consistently across all AI tools and GitHub Actions workflows
- **Assumption**: Spec-first workflow (branch → spec → draft PR) is the standard process; audit should reinforce this pattern, not change it
- **Assumption**: Duplicates and bad references are unintentional technical debt, not deliberate (e.g., for backward compatibility reasons)
- **Assumption**: All referenced instruction files in `instructions/` folder exist and are discoverable; if missing, they represent incomplete migration
- **Assumption**: The target audience for governance files includes: AI agents, AI clients (Claude Code), human contributors, and GitHub Actions workflows
