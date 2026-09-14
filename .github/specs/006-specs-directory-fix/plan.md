# Implementation Plan: Fix Specs Directory Configuration

**Branch**: `fix/specs-directory-configuration` | **Date**: 2026-09-14 | **Spec**: [./spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/003-specs-directory-fix/spec.md`

## Summary

Correct the speckit configuration to place all feature specifications under `.github/specs/` instead of the repository root `specs/` directory. This aligns with CLAUDE.md Repository Boundaries and ensures consistency with other repository governance assets. Update configuration files, shell scripts, documentation, and migrate existing specs to the correct location.

## Technical Context

**Language/Version**: Bash (POSIX shell) + JSON + Markdown | Repository configuration project

**Primary Dependencies**: 
- `.specify/scripts/bash/create-new-feature.sh` — core script requiring configuration update
- `.specify/init-options.json` — feature numbering configuration
- CLAUDE.md — repository governance documentation
- Git workflows and branch naming validation

**Storage**: File-based (configuration files, markdown documentation, directory structure)

**Testing**: Manual verification of directory creation, script behavior, migration success

**Target Platform**: Linux (bash), cross-platform compatible

**Project Type**: Repository governance and configuration tooling

**Performance Goals**: N/A (configuration/documentation project)

**Constraints**: 
- Must not break existing speckit functionality
- Zero data loss during migration
- Configuration must be backward-compatible where possible

**Scale/Scope**: 
- Impact: All new feature specs created via speckit
- Scope: 4 main file changes (CLAUDE.md, init-options.json, create-new-feature.sh, migration of 1 existing spec)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle III: Clear Asset Boundaries (No Duplication)** ✅
- **Status**: PASS with alignment improvement
- **Rationale**: Feature specifications are repository-local governance assets (per constitution: "Repository-local governance lives in `.github/`"). Currently specs are at root level, violating clean boundaries. Fix aligns them with `.github/` structure alongside other governance assets.
- **Verification**: Post-implementation, `.github/specs/` will house all feature specs alongside `.github/labels.yml`, `.github/issue-types.yml`, and other central governance files.

**Principle V: Branch Naming Strategy** ✅
- **Status**: PASS
- **Verification**: Branch `fix/specs-directory-configuration` follows `{type}/{scope}-{title}` pattern with `fix` type (bug fix for incorrect directory placement).

**Principle I: Organisation-Wide Governance Authority** ✅
- **Status**: PASS with consistency improvement
- **Rationale**: This fix ensures all consuming projects that use `.specify` will correctly place specs in the authoritative location, improving governance consistency across the organisation.

**Gates Summary**: ✅ All gates pass. Feature aligns with constitution and improves governance compliance.

## Project Structure

### Documentation (this feature)

```text
.github/specs/003-specs-directory-fix/
├── spec.md              # Feature specification
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (clarification & decision rationale)
├── data-model.md        # Phase 1 output (configuration structure)
├── contracts/           # Phase 1 output (interface/contract specs)
├── quickstart.md        # Phase 1 output (validation/testing guide)
└── tasks.md             # Phase 2 output (task breakdown)
```

### Configuration & Implementation Files (repository)

```text
.github/
├── specs/               # MOVED: Feature specifications (destination)
│   └── 003-specs-directory-fix/
│       └── [spec artifacts above]
├── CLAUDE.md            # UPDATE: Repository Boundaries section
├── instructions/        # MODIFIED if needed: reference updated specs location
└── projects/active/     # Reference only: active project artifacts

.specify/
├── init-options.json    # UPDATE: Add specs_directory configuration
├── scripts/bash/
│   └── create-new-feature.sh  # UPDATE: Use .github/specs/ from config
└── memory/
    └── constitution.md  # Reference: governance principles

specs/                   # MIGRATE: Move existing specs to .github/specs/
├── 002-coderabbit-config-improvements/  # TO BE MIGRATED
│   └── [existing spec files]
```

**Structure Decision**: Configuration-driven approach. The `.specify/init-options.json` will specify `specs_directory: ".github/specs"` and `create-new-feature.sh` will read this configuration to place specs in the correct location. This allows future changes without modifying shell scripts.

## Phases & Delivery

### Phase 0: Research & Clarification

**Tasks**:
1. Document current speckit architecture and configuration loading mechanism
2. Identify all shell scripts that reference specs directory hardcoded path
3. Research `.specify/` directory resolution and configuration precedence
4. Consolidate findings in `research.md`

**Deliverable**: `research.md` with complete architectural understanding

### Phase 1: Design & Contracts

**Tasks**:
1. **Data Model** (`data-model.md`): Define configuration schema for specs_directory
2. **Contracts** (`contracts/config-schema.md`): Document expected init-options.json format
3. **Quickstart** (`quickstart.md`): Provide validation steps to verify specs placement

**Deliverable**: Design artifacts ready for implementation

### Phase 2: Implementation & Testing

*(Handled by `/speckit-tasks` workflow)*
- Update CLAUDE.md Repository Boundaries
- Modify `.specify/init-options.json` with specs_directory config
- Update `create-new-feature.sh` to read configuration
- Migrate existing specs from `/specs/` to `.github/specs/`
- Verify all speckit commands work with new location
