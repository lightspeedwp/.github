# Data Model: Agent & Skill Registries

**Date**: 2026-09-18 (Enhanced with Clarifications) | **Phase**: 1 Design | **Status**: Ready for Implementation

## Entity Definitions

### Agent

**Core Attributes**
- `id` (string): Unique agent identifier, matches folder name (e.g., "prd-agent")
- `name` (string): Human-readable name
- `description` (string): Purpose and capabilities
- `version` (string): Semantic version (e.g., "1.0.0")
- `folder_path` (string): Relative path from repo root (e.g., "agents/prd-agent")
- `status` (enum): one of `active`, `deprecated`, `in-restructure`, `needs-remediation`

**Metadata**
- `created_date` (ISO 8601): Creation date
- `last_modified` (ISO 8601): Last update date
- `restructure_priority` (enum): P1, P2, P3 (from spec)
- `owner_team` (string): Responsible team

**Folder Structure** (per Decision 1: Agent Folder Structure)
- `AGENT.md` - Agent definition file
- `CHANGELOG.md` - Version history
- `package.json` - Dependencies declaration
- `README.md` - Human-readable documentation
- `skills/` - Agent-specific skills subfolder
- `tests/` - Test files subfolder (framework: Jest/Bats/Playwright)
- `config/` - Configuration files subfolder

**Relationships**
- `skills` (array): Skill IDs used by this agent
- `depends_on` (array): Agent IDs this depends on
- `references_scripts` (array): Script paths referenced

**Validation Rules**
- `id` must match folder name (e.g., agent in "agents/prd-agent" has id="prd-agent")
- `version` must follow semantic versioning
- `folder_path` must exist and be accessible
- All 7 folder structure components must be present (per Decision 1)
- `dependencies` must reference existing agents (no dangling refs)

**Lifecycle States**
```
PENDING 
  → IN_RESTRUCTURE (restructuring work begins)
  → COMPLETED (all checks pass)
  → NEEDS_REMEDIATION (failures detected; require fixes)
```

---

### Skill

**Core Attributes**
- `id` (string): Unique skill identifier (e.g., "broken-refs-finder")
- `name` (string): Human-readable name
- `version` (string): Semantic version
- `location` (enum): `root` (in `skills/` folder) or agent ID (in agent folder)
- `category` (string): Categorical subfolder (per Decision 2: validation, audit, reporting, registry, etc.)
- `description` (string): What the skill does
- `type` (string): agentskills.io skill type (action, query, transform, etc.)
- `status` (enum): `active`, `deprecated`, `in-development`

**Naming Convention** (per Decision 2: Skills Naming)
- Pattern: `{category}/{scope}-{title}`
- Examples: `validation/broken-refs-finder`, `audit/structure-checker`
- Full path: `skills/{category}/{scope}-{title}/`

**Compliance Attributes**
- `agentskills_compliant` (boolean): Passes agentskills.io validation
- `compliance_violations` (array): List of missing/invalid fields
- `last_validated_date` (ISO 8601): Last compliance check
- `schema_version` (string): agentskills.io spec version

**Deduplication Attributes**
- `content_hash` (string): SHA-256 hash of implementation
- `semantic_similarity_score` (number): Similarity to other skills (0–1)
- `duplicate_of` (string, optional): Source skill ID if duplicate

**Relationships**
- `used_by` (array): Agent IDs that use this skill
- `depends_on` (array): Skill IDs this depends on
- `has_tests` (boolean): Whether tests exist

**Validation Rules**
- `id` and `name` must be unique within location
- `version` must follow semantic versioning
- `type` must be valid agentskills.io skill type
- `used_by` agents must exist
- `content_hash` must be deterministic

---

### Agent Registry

**File Locations**
- Consolidated: `agents/registry.json` (all agents)
- Per-agent: `agents/{agent-id}/registry.json` (single agent)

**Entry Fields** (per Decision 4: Registry Format)
- `id` (string): Unique agent identifier
- `name` (string): Human-readable name
- `version` (string): Semantic version
- `folder_path` (string): Relative path from repo root
- `status` (enum): active, deprecated, in-restructure, needs-remediation
- `skills` (array): Skill IDs used by this agent
- `depends_on` (array): Agent IDs this depends on
- `references_scripts` (array): Script paths referenced

**Generation & Maintenance** (per Decision 4)
- Auto-generated from filesystem state
- Never manually maintained
- Regenerated on-demand via CLI: `npm run audit:registry`
- Can be integrated into pre-commit hooks or CI/CD

---

### Skill Registry

**File Locations**
- Consolidated: `skills/registry.json` (all skills)
- Per-category: `skills/{category}/registry.json` (skills in category)

**Entry Fields**
- `id` (string): Unique skill identifier
- `name` (string): Human-readable name
- `version` (string): Semantic version
- `location` (string): root or agent ID
- `category` (string): Categorical subfolder
- `type` (string): agentskills.io skill type
- `status` (enum): active, deprecated, in-development
- `agentskills_compliant` (boolean): Compliance status
- `compliance_violations` (array): Missing/invalid fields
- `used_by` (array): Agent IDs that use this skill

**Generation & Maintenance** (per Decision 4)
- Auto-generated from filesystem scan of `skills/` and `agents/*/skills/`
- Preserves categorical organization
- Regenerated on-demand via CLI

---

## State Transitions

### Agent States
```
PENDING → IN_RESTRUCTURE → COMPLETED
              ↓
         NEEDS_REMEDIATION
```

**Transition Rules**:
- PENDING → IN_RESTRUCTURE: Manual transition when restructuring work begins
- IN_RESTRUCTURE → COMPLETED: Automatic when all 7 folder structure components verified
- IN_RESTRUCTURE → NEEDS_REMEDIATION: Automatic when structure checks fail
- NEEDS_REMEDIATION → IN_RESTRUCTURE: Manual transition after fixes applied

### Skill States
```
IN_DEVELOPMENT → ACTIVE → DEPRECATED
```

**Transition Rules**:
- IN_DEVELOPMENT: New skills being created
- ACTIVE: Publicly available and maintained
- DEPRECATED: Marked for removal; has migration path

---

## Validation & Constraints

### Referential Integrity
- All agent `depends_on` must reference existing agents (no dangling references)
- All skill `used_by` agents must exist
- All agent `references_scripts` must exist in repo

### Dependency Rules
- Circular dependencies detected and reported (no cycles allowed)
- Missing skill dependencies block agent restructuring
- Version-pinned skill copies allowed ONLY when versions differ

---

## Notes

All generated registries follow the JSON schema defined in `contracts/registry-schema.json`. Registries are machine-parseable and serve as the source of truth for agent and skill discovery, dependency tracking, and compliance validation.
