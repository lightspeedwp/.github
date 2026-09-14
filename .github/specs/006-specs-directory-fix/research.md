# Research & Findings: Specs Directory Configuration

**Date**: 2026-09-14  
**Phase**: Phase 0 (Research & Clarification)  
**Status**: Complete

## Problem Analysis

### Current State
- Specs are created in repository root: `/home/user/.github/specs/`
- Shell script hardcodes path: `.specify/scripts/bash/create-new-feature.sh` line 200
- Configuration has no specs_directory setting: `.specify/init-options.json`
- CLAUDE.md Repository Boundaries section lacks explicit guidance

### Issue Chain
1. `create-new-feature.sh` hardcodes `SPECS_DIR="$REPO_ROOT/specs"`
2. No configuration override mechanism exists
3. No documentation in CLAUDE.md about intended specs location
4. Result: Specs violate Repository Boundaries principle

## Research Findings

### Finding 1: Speckit Architecture
**Decision**: Speckit uses shell scripts in `.specify/scripts/bash/` to orchestrate feature creation  
**Rationale**: The tooling is shell-based with JSON outputs for integration  
**Alternatives Considered**:
- Python-based reconfiguration (rejected: would require rewriting core tools)
- Environment variable override (considered: adds runtime complexity)

**Approach Chosen**: Configuration-driven solution via `.specify/init-options.json`

### Finding 2: Configuration Loading Mechanism
**Decision**: `.specify/init-options.json` is the appropriate place for specs_directory setting  
**Rationale**:
- Already stores other settings (`feature_numbering`, `ai`, `script`)
- Scripts have access to $REPO_ROOT to resolve relative paths
- Can be version-controlled and audited

**Alternatives Considered**:
- Environment variables (rejected: harder to audit, not version-controlled)
- Separate `.specify/specs-config.json` (rejected: unnecessary duplication)

**Approach Chosen**: Add `specs_directory` field to existing init-options.json

### Finding 3: Shell Script Modification Strategy
**Decision**: Update `create-new-feature.sh` to read specs_directory from config  
**Rationale**:
- Single source of truth for configuration
- Backward compatible if we provide sensible default
- Other speckit scripts (setup-plan.sh, etc.) can follow same pattern

**Modifications Needed**:
1. Load JSON config from `$REPO_ROOT/.specify/init-options.json`
2. Read `specs_directory` value (default to `.github/specs` if missing)
3. Replace hardcoded `SPECS_DIR="$REPO_ROOT/specs"` with configured value
4. Update `common.sh` with config loading helper function

**Alternatives Considered**:
- Search and replace approach (rejected: fragile, hard to maintain)
- Full rewrite in Python (rejected: out of scope, breaks existing ecosystem)

### Finding 4: Migration Strategy
**Decision**: Move existing specs with directory structure preserved  
**Rationale**:
- Only 1 existing spec found: `002-coderabbit-config-improvements`
- Zero-downtime migration possible
- `.specify/feature.json` already tracks feature locations

**Alternatives Considered**:
- Dual-location support (rejected: creates confusion, maintenance burden)
- Leave legacy location in place (rejected: violates Repository Boundaries)

**Approach Chosen**: Clean migration to `.github/specs/` with proper symlink cleanup

### Finding 5: Documentation Updates
**Decision**: Update CLAUDE.md Repository Boundaries section  
**Rationale**:
- Constitution explicitly requires clear asset boundaries
- Currently no mention of specs location creates ambiguity
- Addition improves governance transparency

**Alternatives Considered**:
- Inline comments in code only (rejected: not discoverable, governance-level decision)
- Create separate SPECS.md file (rejected: duplicates CLAUDE.md guidance)

**Approach Chosen**: Add row to Repository Boundaries table in CLAUDE.md

## Implementation Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Config Location | `.specify/init-options.json` | Existing, auditable, version-controlled |
| Default Value | `.github/specs` | Aligns with Repository Boundaries principle |
| Backward Compat | Provide default if key missing | Existing projects still work |
| Migration | Move to `.github/specs/` | Clean boundaries, no dual locations |
| Documentation | Update CLAUDE.md | Single source of truth for governance |

## Risk Analysis

| Risk | Mitigation |
|------|-----------|
| Breaking existing scripts | Make field optional with sensible default |
| Broken references to old path | Update all config files before migration |
| Lost specs during migration | Run in dry-run first, verify file counts |
| Downstream repos using specs | Change is transparent (spec resolution stays same) |

## Assumptions Validated

✅ `.specify/` configuration is centrally managed  
✅ Shell scripts have access to read JSON configs  
✅ Repository uses git; migration via git commands is safe  
✅ Only 1 existing spec (confirmed: `002-coderabbit-config-improvements`)  
✅ No downstream repos depend on specs file paths  

## Conclusion

All research questions resolved. Implementation can proceed with:
1. `.specify/init-options.json` updated with `specs_directory: ".github/specs"`
2. `create-new-feature.sh` modified to read config
3. CLAUDE.md Repository Boundaries updated
4. Existing specs migrated to new location
5. Verification that all speckit commands work correctly

**Status**: Ready for Phase 1 Design
