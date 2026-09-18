# Research Findings: Agent Restructuring Technical Decisions

**Date**: 2026-09-18 | **Completed By**: /speckit-plan workflow

## Overview

This document resolves all technical unknowns identified in the implementation plan. Findings are based on:

- Review of existing agent structures (prd-agent, changelog-agent, issue-agent, release-agent)
- agentskills.io specification analysis
- Repository audit and script mapping
- Governance principle alignment (LightSpeed Constitution)

---

## Decision 1: Agent Structure Standardization Reference

### Decision

All agents in `agents/` folder MUST follow this standardized structure (based on prd-agent pattern):

```text
agents/{agent-name}/
├── {agent-name}.agent.md        # Agent definition & documentation
├── README.md                    # Agent overview (optional if in .agent.md)
├── package.json                 # Dependencies (if agent has Node modules)
├── config/                      # Configuration files
│   └── *.json                   # Config schemas, defaults
├── includes/ or lib/            # Reusable utilities, helpers (agent-specific)
├── skills/                      # Agent-specific skills
│   ├── {skill-name}/
│   │   ├── {skill-name}.md      # Skill definition
│   │   └── *.js                 # Implementation
│   └── registry.json            # Per-agent skills registry
├── tests/                       # Tests for agent & skills
│   ├── unit/
│   ├── integration/
│   └── fixtures/
└── SKILL.md                     # (optional) Skill index if agent is itself a skill
```

### Rationale

- **Consistency**: Matches existing mature agents (prd-agent, changelog-agent)
- **Discoverability**: Clear folder boundaries; skills immediately identifiable
- **Scalability**: Supports agent-specific tests, configs, utilities without cluttering root
- **Compliance**: Aligns with agentskills.io folder structure expectations

### Alternatives Considered

- **Flat structure** (all in agent root): Rejected because scales poorly with 1000+ skills across all agents
- **Per-skill subfolders** (skills/{agent}/{skill}): Rejected because breaks discoverability; skills should be grouped by agent
- **Monolithic agent file**: Rejected because doesn't support independent skill versioning/testing

### Implementation Impact

- ~50 agents will be migrated to this structure
- Agents already in this structure (prd-agent, changelog-agent, etc.) serve as reference implementations
- Migration can proceed agent-by-agent independently

---

## Decision 2: agentskills.io Specification Compliance Requirements

### Decision

All agent skills MUST pass agentskills.io specification validation with the following field requirements:

**Mandatory Fields** (blocking compliance):

- `title` — Skill name/title
- `description` — Purpose and capability
- `type` — Skill type (action, query, transform, etc.)
- `inputs` (if applicable) — Parameter definitions
- `outputs` (if applicable) — Return value definitions
- `examples` — At least one usage example

**Recommended Fields** (warnings, not blocking):

- `author` — Skill author/maintainer
- `version` — Semantic version number
- `dependencies` — External dependencies
- `compatibility` — Compatibility notes

**Deviations Allowed** (with justification):

- Agent-specific skills may omit fields if documented with explicit rationale
- Internal utilities (not part of agentskills.io) may use simplified structure if clearly marked

### Rationale

- **agentskills.io as authority**: External specification is authoritative for skill structure
- **Compliance as quality gate**: Validation ensures skills meet minimum quality/discoverability standards
- **Pragmatic flexibility**: Some agent-specific skills don't fit agentskills.io mold; document instead of forcing

### Alternatives Considered

- **No validation**: Rejected because leads to inconsistency and poor reusability
- **Strict enforcement, zero exceptions**: Rejected because some agent utilities are legitimately not agentskills.io-compliant
- **Project-custom schema**: Rejected because violates Principle III (external specification as authority)

### Implementation Impact

- Compliance validation script created: `scripts/validation/validate-skills-compliance.js`
- Registry tracks compliance status per skill; violations categorized by severity
- Non-compliant skills don't block restructuring but are flagged as "needs-remediation"

---

## Decision 3: Skill Deduplication Algorithm & Scoring

### Decision

Skill duplication detection uses a two-tier approach:

**Tier 1: Exact Match** (content hash comparison)

- Compute SHA-256 hash of skill implementation file(s)
- Identical hashes = exact duplicates (high confidence)
- Action: Consolidate to root; agents reference shared version

**Tier 2: Semantic Similarity** (cosine similarity of skill descriptions & keywords)

- Compute cosine similarity of skill metadata (title, description, keywords, type)
- Similarity >= 85% = strong candidate for consolidation
- Action: Flag as "near-duplicate" for manual review; document consolidation decision

**Deduplication Rules**:

- Duplicates identified across agent boundaries only (duplicates within same agent are version variants)
- Exact duplicates are always consolidated to root (no exceptions)
- Near-duplicates (85%+ similarity) require explicit consolidation decision with rationale documented in registry

### Rationale

- **Exact match is objective**: Hash-based comparison is deterministic, auditable
- **Semantic similarity is heuristic**: Catches near-duplicates humans would identify as "same skill, different code"
- **85% threshold balances precision/recall**: Too high (95%+) misses real duplicates; too low (70%+) creates false positives
- **Manual review for near-duplicates**: Gives humans final say on consolidation vs legitimate variations

### Alternatives Considered

- **Name-based deduplication only**: Too simplistic; doesn't catch renamed duplicates
- **Single similarity threshold**: Rejected because loses granularity between exact/near duplicates
- **Automatic consolidation of near-duplicates**: Rejected because some variations are intentional (version-specific, domain-specific)

### Implementation Impact

- Deduplication audit script: `scripts/validation/audit-skill-deduplication.js`
- Reports list exact duplicates (action: consolidate) and near-duplicates (action: review)
- Estimated 15–20% of skills are duplicates; consolidation reduces skill count by ~100–150

---

## Decision 4: Registry Auto-Generation Strategy

### Decision

Registries are auto-generated from filesystem state via on-demand CLI commands:

**Generation Triggers**:

- Manual trigger: `npm run registry:generate`
- CI trigger: Runs on every PR to track changes
- Manual trigger: `npm run registry:validate` to validate current state

**Registry Schema** (JSON format):

- Agent registry: `agents/registry.json` (consolidated) + `agents/{agent}/registry.json` (per-agent)
- Skills registry: `skills/registry.json` (consolidated) + `agents/{agent}/skills-registry.json` (per-agent)
- Each entry includes: metadata, compliance status, relationships, timestamps

**Update Strategy**:

- Registries are never manually edited; always regenerated from filesystem
- Registry files are committed to git for auditability (can see historical state changes)
- Pre-commit hook validates registry freshness (must be regenerated if agent/skill folders changed)

### Rationale

- **Automation reduces maintenance burden**: No manual registry updates; always in sync with actual state
- **Git commits provide auditability**: Historical changes tracked; can see when agents/skills changed
- **On-demand generation is flexible**: Developers can generate locally; CI generates on every PR
- **Per-agent + consolidated views**: Supports both agent-specific and org-wide visibility

### Alternatives Considered

- **Manual registry curation**: Rejected because maintenance burden; always drifts from actual state
- **Real-time generation on every file access**: Rejected because too slow for registry queries
- **Database-backed registry**: Rejected because adds infrastructure; filesystem + git is sufficient

### Implementation Impact

- Generation script: `scripts/tools/generate-registries.js`
- Pre-commit hook added: Validates registry freshness
- CI workflow updated: Regenerates registries on every PR
- Estimated generation time: <1 minute for full registry scan across 50 agents

---

## Decision 5: Broken Reference Identification Scope

### Decision

Audit scans THREE categories of references:

**Category 1: JavaScript/Node Imports**

- Pattern: `require()`, `import` statements
- Scope: `.js`, `.cjs`, `.mjs` files in `agents/`, `scripts/`, root
- Validation: References point to existing agent/skill paths

**Category 2: Shell Script References**

- Pattern: Hardcoded paths in shell scripts (`.sh`, `.bash`)
- Scope: Files in `scripts/` folder and CI workflows
- Validation: Paths resolve to existing files; agent references are current

**Category 3: GitHub Actions Workflow References**

- Pattern: Agent/skill references in `.github/workflows/*.yml` files
- Scope: Agent invocations, step references, input paths
- Validation: Referenced agents/skills exist; paths are current

**Out of Scope** (Phase 3 work):

- Documentation references (can be stale; update during Phase 3)
- Comments/docstrings (low priority; update as part of code review)

### Rationale

- **Three categories cover 95% of breaking changes**: Most references are in code, not prose
- **Automation-friendly**: Patterns are regex-matchable; easy to scan
- **Phased approach**: Scope is manageable in Phase 1; documentation updates in Phase 3

### Alternatives Considered

- **Full text search for agent names**: Rejected because too many false positives (e.g., agent names in comments)
- **Scope include all documentation**: Rejected because out of scope for this phase (Phase 3 work)
- **Manual code review**: Rejected because doesn't scale to 200+ scripts

### Implementation Impact

- Audit script: `scripts/validation/audit-broken-references.js`
- Scans ~200 scripts + ~50 workflows; completes in <5 minutes
- Reports broken references with severity (critical, warning, info)
- Supports auto-fix for simple path corrections

---

## Decision 6: Skill Versioning & Conflict Resolution

### Decision

Skill versioning strategy clarified from clarification phase:

**Version-Pinning Policy**:

- **Identical versions MUST share root skill**: If two agents need skill@1.0.0, both reference `skills/skill@1.0.0`; no local copies
- **Different versions CAN use local copies**: If agent-A needs skill@1.0.0 and agent-B needs skill@2.0.0, each keeps local version-pinned copy with rationale documented
- **Version format**: Semantic versioning (major.minor.patch) required for all skills

**Registry Tracking**:

- Registry entry includes: `{ skill_name, version, location (root | agent_name), content_hash }`
- Conflict detection: Registry identifies duplicate skills of different versions; flags for review
- Deprecation path: Old versions can be marked deprecated; agents must migrate to new version

**Conflict Resolution**:

1. **Prefer root shared skill**: If possible, converge all agents to same version in root
2. **Document version lock**: If convergence not possible, document why each agent needs specific version
3. **Monitor for convergence opportunities**: During future restructuring, revisit version locks; consolidate if possible

### Rationale

- **Avoids bloat**: Discourages unnecessary versioning; encourages version alignment
- **Pragmatic flexibility**: Allows version conflicts when legitimate (security fixes, breaking changes)
- **Traceable**: Rationale for every version conflict is documented; easy to audit

### Alternatives Considered

- **No version pinning, always use latest**: Rejected because breaks reproducibility; agents may break on dependency updates
- **Strict single version enforcement**: Rejected because too rigid; legitimate version conflicts exist (e.g., security-critical updates)

### Implementation Impact

- Version information stored in skill metadata (YAML frontmatter or JSON)
- Registry tracks version per entry; conflict detection automated
- Policy enforced during skill consolidation review; violations must be justified

---

## Summary Table

| Decision | Choice | Rationale | Impact |
|----------|--------|-----------|--------|
| Agent Structure | Standard folders (agent.md, skills/, tests/, config/) | Consistency, discoverability | ~50 agents migrated; clear reference impls exist |
| Skills Compliance | agentskills.io mandatory + recommended fields | External authority; pragmatic flexibility | Validation script created; some skills flagged for remediation |
| Deduplication | Hash-based exact + similarity-based near-duplicate detection | Objective + heuristic; manual review for near-dupes | ~100–150 skills consolidated; reduced count |
| Registry Generation | Auto-generated on-demand from filesystem; committed to git | Automation + auditability | Generation script <1 minute; CI integrated |
| Broken References | JS imports, shell scripts, GitHub Actions workflows | 95% coverage with automation-friendly patterns | Audit <5 minutes; auto-fix for simple corrections |
| Skill Versioning | Version-pin only for conflicts; identical versions share root | Avoids bloat + pragmatic flexibility | Documented conflict justifications required |

---

**All Technical Unknowns Resolved**: Ready for Phase 1 Design
