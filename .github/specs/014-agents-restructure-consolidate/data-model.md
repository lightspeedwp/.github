# Data Model: Agent & Skill Registries

**Date**: 2026-09-18 | **Phase**: 1 Design | **Status**: Ready for Implementation

## Entity Definitions

### Agent

**Core Attributes**

- `id` (string): Unique agent identifier (matches folder name)
- `name` (string): Human-readable agent name
- `description` (string): Purpose and capability
- `version` (string): Semantic version (e.g., "1.0.0")
- `folder_path` (string): Relative path from repository root (e.g., "agents/prd-agent")
- `status` (enum): One of `active`, `deprecated`, `in-restructure`, `needs-remediation`

**Metadata**

- `created_date` (ISO 8601): When agent was first created
- `last_modified` (ISO 8601): Last change date
- `restructure_priority` (enum): One of `P1`, `P2`, `P3` (from spec)
- `owner_team` (string): Team responsible for maintenance

**Relationships**

- `skills` (array): List of skill IDs used by this agent
- `depends_on` (array): List of agent IDs this agent depends on
- `references_scripts` (array): List of script paths referenced by this agent

**Validation Rules**

- `id` must match folder name (e.g., agent in "agents/prd-agent" has id="prd-agent")
- `version` must follow semantic versioning format
- `status` must be one of canonical enum values
- `folder_path` must exist and be accessible
- `dependencies` must reference existing agents (no dangling references)

**Lifecycle States**

```
PENDING 
  → IN_RESTRUCTURE (restructuring work begins)
  → COMPLETED (restructuring done, all checks pass)
  → NEEDS_REMEDIATION (failures detected; require fixes)
```

---

### Skill

**Core Attributes**

- `id` (string): Unique skill identifier (e.g., "analyze-prompt")
- `name` (string): Human-readable skill name
- `version` (string): Semantic version
- `location` (enum): One of `root` (in `skills/` folder) or `{agent-id}` (in agent folder)
- `description` (string): What the skill does
- `type` (string): Skill type from agentskills.io (e.g., "action", "query", "transform")
- `status` (enum): One of `active`, `deprecated`, `in-development`

**Compliance Attributes**

- `agentskills_compliant` (boolean): Passes agentskills.io validation
- `compliance_violations` (array): List of missing/invalid fields
- `last_validated_date` (ISO 8601): When compliance was last checked
- `schema_version` (string): agentskills.io specification version used

**Deduplication Attributes**

- `content_hash` (string): SHA-256 hash of implementation file(s)
- `semantic_similarity_score` (number): Similarity to other skills (0–1)
- `duplicate_of` (string, optional): If this is a duplicate, ID of source skill

**Relationships**

- `used_by` (array): List of agent IDs that use this skill
- `depends_on` (array): List of skill IDs this depends on
- `has_tests` (boolean): Whether tests exist for this skill

**Validation Rules**

- `id` and `name` must be unique within location (root or agent)
- `version` must follow semantic versioning
- `type` must be valid agentskills.io skill type
- `used_by` agents must exist in agent registry
- `content_hash` must be deterministic (same content = same hash)

---

### Agent Registry

**Structure**: Array of agent entries with metadata

**File Locations**:

- Consolidated: `agents/registry.json` (all agents)
- Per-agent: `agents/{agent-id}/registry.json` (single agent)

**Registry Entry Schema**

```json
{
  "id": "prd-agent",
  "name": "PRD Agent",
  "description": "Generates product requirement documents",
  "version": "1.2.3",
  "folder_path": "agents/prd-agent",
  "status": "active",
  "created_date": "2026-06-15T10:30:00Z",
  "last_modified": "2026-09-18T08:00:00Z",
  "restructure_priority": "P1",
  "owner_team": "platform-eng",
  "skills": [
    "prd-template-loader",
    "prd-outline-generator",
    "prd-validator"
  ],
  "depends_on": [],
  "references_scripts": [
    "scripts/agents/prd-agent/generate.js",
    "scripts/validation/prd-validator.js"
  ],
  "restructure_status": "completed",
  "skill_count": 3,
  "missing_dependencies": [],
  "validation_errors": []
}
```

**Registry Metadata**

- `timestamp` (ISO 8601): When registry was generated
- `generated_from_commit` (string): Git commit hash when generated
- `total_agents` (number): Count of all agents in registry
- `agents_in_scope` (number): Count of agents included in restructuring
- `status_breakdown` (object): Count by status (e.g., `{ "active": 45, "deprecated": 3, "in-restructure": 2 }`)

---

### Skills Registry

**Structure**: Array of skill entries with metadata

**File Locations**:

- Consolidated: `skills/registry.json` (all skills across root + agents)
- Per-agent: `agents/{agent-id}/skills-registry.json` (skills in that agent)

**Registry Entry Schema**

```json
{
  "id": "prd-template-loader",
  "name": "PRD Template Loader",
  "version": "1.0.0",
  "location": "prd-agent",
  "description": "Loads and parses PRD templates",
  "type": "action",
  "agentskills_compliant": true,
  "compliance_violations": [],
  "last_validated_date": "2026-09-18T08:00:00Z",
  "schema_version": "1.0",
  "content_hash": "abc123def456...",
  "semantic_similarity_score": 0.92,
  "duplicate_of": null,
  "used_by": ["prd-agent", "prd-factory-planner-agent"],
  "depends_on": [],
  "has_tests": true
}
```

**Registry Metadata**

- `timestamp` (ISO 8601): When registry was generated
- `total_skills` (number): Total skills across all agents + root
- `root_skills_count` (number): Skills in root `skills/` folder
- `agent_specific_count` (number): Skills in agent folders
- `compliance_summary` (object): Compliance statistics (e.g., `{ "compliant": 890, "violations": 110 }`)
- `duplicate_summary` (object): Deduplication statistics (e.g., `{ "exact_matches": 45, "near_duplicates": 23 }`)

---

## State Transitions

### Agent Restructuring Workflow

```
┌─────────────┐
│   PENDING   │  Agent not yet in standardized structure
└──────┬──────┘
       │ (restructuring work starts)
       ▼
┌──────────────────┐
│  IN_RESTRUCTURE  │  Restructuring in progress
└──────┬───────────┘
       │ (all checks pass)
       ├────────────────────► ┌───────────┐
       │                       │ COMPLETED │ Restructuring done
       │ (failures detected)   └───────────┘
       └────────────────────► ┌──────────────────┐
                              │ NEEDS_REMEDIATION│ Failed checks
                              └────────┬─────────┘
                                       │
                      (fixes applied)  │
                                       ▼
                              ┌──────────────────┐
                              │  IN_RESTRUCTURE  │
                              └────────┬─────────┘
                                       │
                    (cannot proceed)   │
                                       ▼
                              ┌──────────────────┐
                              │     BLOCKED      │
                              └──────────────────┘
```

### Registry Generation Workflow

```
┌───────┐
│ STALE │  Registry not recently generated
└───┬───┘
    │ (generation triggered)
    ▼
┌────────────┐
│ GENERATING │  Scan in progress
└────┬───────┘
     │ (scan complete, no errors)
     ├─────────────► ┌───────┐
     │               │ VALID │ Registry fresh and correct
     │ (errors found)└───────┘
     └─────────────► ┌─────────┐
                     │ INVALID │ Errors detected
                     └─────────┘
```

---

## Relationships & Constraints

### Agent → Skill Relationships

**One Agent, Multiple Skills**

- Agent `prd-agent` uses skills: `prd-template-loader`, `prd-outline-generator`, `prd-validator`
- Each skill can be used by multiple agents
- Constraint: If agent uses skill of different version, version must be justified in registry

**Skill Duplication Detection**

- If two agents use same skill@1.0.0, single shared copy in `skills/` folder
- If two agents use different versions (skill@1.0.0 vs skill@2.0.0), each has local version-pinned copy
- Registry documents why each version is needed

### Script → Agent Relationships

**Script Ownership Mapping** (Phase 3 planning)

- Script can logically belong to one primary agent
- Script can have secondary dependencies on other agents
- Some scripts belong to no specific agent (utilities)
- Each script must have ownership documented for migration planning

---

## Validation & Consistency Rules

### Registry Freshness

Registries must be regenerated when:

- Agent folder added, removed, or renamed
- Agent status changed
- Skill added, removed, or version changed
- Skill compliance status changed

**Validation**: Pre-commit hook checks if registry is fresh relative to agent/skill changes. Fails if stale.

### Referential Integrity

- Agent `depends_on` references must point to existing agents
- Skill `used_by` references must point to existing agents
- Skill `depends_on` references must point to existing skills
- No dangling references allowed

**Validation**: Registry validation script checks all references exist.

### Deduplication Consistency

- If skill A is marked `duplicate_of` skill B, then B must exist
- Exact duplicates (same hash) must have `semantic_similarity_score` >= 0.99
- Near-duplicates must have `semantic_similarity_score` 0.85–0.99
- No circular "duplicate_of" chains

**Validation**: Deduplication audit script validates consistency.

---

## Implementation Notes

1. **Registry generation is deterministic**: Same agent/skill state produces identical registry (same field order, formatting)
2. **Registries are version-controlled**: Committed to git; history shows changes over time
3. **Per-agent registries enable fast queries**: Agents can query their own registry without loading full registry
4. **Consolidated registry enables org-wide views**: Dependency analysis, compliance summaries, deduplication across all agents

---

**Data Model Complete**: Ready for contract specification and quickstart validation
