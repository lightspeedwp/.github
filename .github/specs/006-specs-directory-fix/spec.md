# Feature Specification: Fix Specs Directory Configuration

**Feature Branch**: `config/specs-directory-configuration`

**Created**: 2026-09-14

**Status**: Ready for Planning

**Input**: User description: "Fix specs directory configuration to use .github/specs instead of root specs folder"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Creates Feature Spec (Priority: P1)

Developer uses `/speckit-specify` to create a new feature specification. Currently, specs are incorrectly written to the repository root (`/specs/`), breaking repository structure conventions.

**Why this priority**: This is the core problem—spec creation must place files in the configured specs directory (defaulting to `.github/specs/`) to maintain repository organization and comply with CLAUDE.md guidelines.

**Independent Test**: Can be fully tested by running `/speckit-specify` and verifying that generated specs are in the configured `specs_directory`, including alternatives such as `specs` or `docs/specs`.

**Acceptance Scenarios**:

1. **Given** `specs_directory` is not specified and a developer runs `/speckit-specify "add user authentication"`, **When** the command completes, **Then** the spec should be created in the default `.github/specs/` directory structure
2. **Given** `specs_directory` is set to a valid relative path such as `specs` or `docs/specs`, **When** a developer creates a feature, **Then** the spec should be created under that configured directory
3. **Given** multiple specs exist in the configured directory, **When** downstream speckit commands like `/speckit-plan` resolve spec locations, **Then** they should correctly locate those specs

---

### User Story 2 - Repository Structure Compliance (Priority: P2)

Repository structure should follow CLAUDE.md conventions where governance and specification files are organized under `.github/` rather than scattered at the root level.

**Why this priority**: Maintains repository organization consistency and enables other workflows that depend on predictable file locations.

**Independent Test**: Can be fully tested by auditing repository structure and confirming all spec-related files are under `.github/specs/`.

**Acceptance Scenarios**:

1. **Given** the repository is examined, **When** looking for spec directories, **Then** only `.github/specs/` should contain active specifications
2. **Given** CLAUDE.md Repository Boundaries section is read, **When** checked against actual structure, **Then** specs should be documented and located in `.github/specs/`

---

### User Story 3 - Migrate Existing Specs (Priority: P3)

Existing specs in the root `specs/` directory should be migrated to `.github/specs/` to ensure consistency.

**Why this priority**: Cleanup of existing data; ensures all specs follow the new structure.

**Independent Test**: Can be fully tested by verifying migration completes without data loss and all existing specs are accessible in new location.

**Acceptance Scenarios**:

1. **Given** specs exist in `/specs/`, **When** migration runs, **Then** all content should be moved to `.github/specs/` without loss
2. **Given** migration is complete, **When** old `/specs/` location is checked, **Then** it should be empty or removed

---

### Edge Cases

- What happens if `.github/specs/` doesn't exist yet? (Create it)
- How does the system handle if specs already exist in both locations? (Migrate with conflict detection)
- What if speckit configuration files reference the old location? (Update all configuration references)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `.specify/scripts/bash/create-new-feature.sh` MUST create feature directories under the configured `specs_directory`, using `.github/specs` when the setting is unspecified and respecting valid alternatives such as `specs` or `docs/specs`
- **FR-002**: `.specify/init-options.json` MUST include `specs_directory` configuration field to document and enforce the correct specs location
- **FR-003**: CLAUDE.md MUST explicitly document that specification files belong in `.github/specs/` in the Repository Boundaries section
- **FR-004**: All speckit scripts (create-new-feature.sh, setup-plan.sh, etc.) MUST resolve the specs directory from `.specify/init-options.json` configuration
- **FR-005**: Existing specs in `/specs/` MUST be migrated to `.github/specs/` with directory structure preserved
- **FR-006**: The `.specify/feature.json` context file MUST correctly reference features in the new `.github/specs/` location
- **FR-007**: Documentation in `.specify/` must reference `.github/specs/` as the canonical specs location

### Key Entities

- **Configuration Files**: `.specify/init-options.json` (contains specs_directory setting)
- **Spec Directories**: Feature spec folders under `.github/specs/` containing spec.md and supporting artifacts
- **Documentation Files**: CLAUDE.md Repository Boundaries section, speckit README/docs

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of new specs created with `/speckit-specify` are placed in the configured `specs_directory` (default `.github/specs`)
- **SC-002**: All speckit commands (`/speckit-plan`, `/speckit-clarify`, etc.) correctly resolve spec locations from the configured `specs_directory`
- **SC-003**: CLAUDE.md Repository Boundaries section explicitly documents spec file location
- **SC-004**: Zero specs exist in the root-level `/specs/` directory after migration
- **SC-005**: Existing specs in `/specs/` are successfully migrated to `.github/specs/` with 100% content preservation
- **SC-006**: All downstream workflows that depend on spec locations work correctly with the new structure

## Assumptions

- `.github/specs/` will be created if it doesn't exist during implementation
- Existing specs in `/specs/` have already been identified (002-coderabbit-config-improvements confirmed)
- The speckit `.specify/` configuration can be updated without breaking existing functionality
- All speckit shell scripts are centrally maintained and can be updated in one location
- Repository maintainers approve the `.github/specs/` location as the canonical specs directory
- The feature numbering system (sequential 001, 002, 003, etc.) will continue to work with the new directory structure
