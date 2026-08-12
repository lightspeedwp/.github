---
title: "Architecture Decisions — ADR Agent Portability"
description: "Key architectural decisions and trade-offs for the portable ADR Generator Agent"
created_date: 2026-08-12
status: approved
---

# Architecture Decisions

**Document Version:** 1.0  
**Last Updated:** 2026-08-12  
**Decision Status:** All decisions approved and ready for implementation

---

## AD-001: Single Configurable Agent vs. Multiple Variants

**Status:** ✅ APPROVED  
**Date:** 2026-08-12  
**Owner:** @ash

### Decision

Implement a **single portable agent** with configuration-driven behavior, rather than multiple agent variants.

### Context

- Current state: ADR agent in `.github/agents/` is tightly coupled to control-plane
- Need: Support adoption across control-plane, organization repos, WordPress plugins/themes
- Trade-off: Single agent flexibility vs. multiple specialized agents

### Options Considered

1. **Single configurable agent** (CHOSEN)
   - Pros: One codebase to maintain, consistent API, configuration-driven
   - Cons: Configuration complexity, may not optimize for every scenario
   - Best for: Organization with diverse contexts

2. Multiple specialized agents
   - Pros: Each agent optimized for its context, simpler per-agent code
   - Cons: Multiple codebases, version sync challenges, adoption friction
   - Best for: Monolithic single-context use

### Rationale

A single configurable agent aligns with LightSpeedWP's philosophy of reusability and portability. Configuration complexity is manageable with good defaults and documentation. Benefits:

- ✅ Single source of truth for ADR generation logic
- ✅ Consistent user experience across all repository types
- ✅ Reduced maintenance burden (one codebase)
- ✅ Configuration inheritance enables org + repo customization
- ✅ Clear upgrade path (no version sync issues)

### Implementation Impact

- **Phase 1:** Configuration system enables this decision
- **All Phases:** Consistent agent with varying configuration
- **Support:** Clear documentation for each context (control-plane, plugins, themes)

### Related Decisions

- AD-002: WordPress Adaptation Strategy
- AD-003: Configuration Location & Format
- AD-004: Configuration Inheritance Model

---

## AD-002: WordPress Adaptation Strategy

**Status:** ✅ APPROVED  
**Date:** 2026-08-12  
**Owner:** @ash

### Decision

Support WordPress customization through **configuration-driven custom fields**, not separate agents or hard-coded logic.

### Context

- WordPress plugins & themes have specific metadata needs (compatibility, min versions)
- Need flexible metadata without architectural complexity
- Related to AD-001 (single agent decision)

### Options Considered

1. **Custom metadata via configuration** (CHOSEN)
   - Pros: Flexible, no code changes, configuration-driven
   - Cons: Requires clear examples
   - Best for: One agent with many contexts

2. Separate WordPress variant agents
   - Pros: Optimized for WordPress
   - Cons: Maintenance burden, version sync issues
   - Best for: WordPress-only shops

3. Hard-coded WordPress support
   - Pros: No configuration needed
   - Cons: Rigid, maintenance nightmare, hard to extend
   - Best for: WordPress-primary organization

### Rationale

Custom metadata fields in configuration provide the flexibility needed without architectural overhead. WordPress shops can define custom fields in `.adr-config.json`:

```json
{
  "metadata": {
    "custom_fields": {
      "plugin_compatibility": ["WordPress 6.0+", "PHP 8.0+"],
      "minimum_version": "6.0",
      "block_type": ["Custom Block", "ACF Block"]
    }
  }
}
```

Benefits:

- ✅ No WordPress-specific code in core agent
- ✅ Flexible for any custom fields (not just WordPress)
- ✅ Examples document WordPress best practices
- ✅ Can evolve without agent changes
- ✅ Clear separation: agent logic vs. domain customization

### Implementation Impact

- **Phase 1:** Configuration schema supports custom_fields
- **Phase 1 Docs:** Examples show WordPress plugin/theme configurations
- **Support:** Clear documentation for common WordPress scenarios

### Related Decisions

- AD-001: Single Agent
- AD-003: Configuration Format
- AD-004: Inheritance Model

---

## AD-003: Configuration Location & Format

**Status:** ✅ APPROVED  
**Date:** 2026-08-12  
**Owner:** @ash

### Decision

Store configuration in `.adr-config.json` at repository root, using JSON format with schema validation.

### Context

- Configuration must be discoverable by agent
- Format should be standard, validated, easily edited
- Must support inheritance (org defaults + repo overrides)

### Options Considered

1. **.adr-config.json with JSON schema** (CHOSEN)
   - Pros: Schema validation, IDE autocomplete, easy to parse, standard format
   - Cons: JSON verbosity
   - Best for: Validation-first approach

2. .adr-config.yml with YAML
   - Pros: More readable, less verbose
   - Cons: No standard schema validation, YAML parsing complexity
   - Best for: Human-first configuration

3. Inside existing config (package.json, .github/config.yml)
   - Pros: Fewer files
   - Cons: Mixed concerns, harder to find, context pollution
   - Best for: Monolithic configuration

### Rationale

JSON with schema enables:

- ✅ IDE autocomplete and validation (VS Code, IntelliJ)
- ✅ Typed schema validation during load
- ✅ Standard JSON parsing (no dependencies)
- ✅ Schema documentation (can generate from schema)
- ✅ CI validation (lint against schema)
- ✅ Clear, machine-readable configuration

Repository root location ensures:

- ✅ Agent can find it with no search
- ✅ VCS visibility (easy to see in file tree)
- ✅ CI can validate on push
- ✅ Not buried in nested directories

### Implementation Impact

- **Phase 1:** Schema design & validation
- **Docs:** Schema reference guide
- **Examples:** 4 complete example configs

### Related Decisions

- AD-004: Inheritance Model
- AD-005: ADR Numbering Scheme

---

## AD-004: Configuration Inheritance Model

**Status:** ✅ APPROVED  
**Date:** 2026-08-12  
**Owner:** @ash

### Decision

Support **two-level configuration inheritance**: Organization defaults (optional) + Repository config (required).

### Context

- Different repositories may have different ADR standards
- Organization may want consistent baseline
- Inheritance simplifies per-repo configuration

### Inheritance Flow

```
1. Start with built-in defaults
   (adr_directory: "docs/adr", numbering: "sequential", ...)

2. Load organization config (if exists)
   - File: .github/adr-config.json (in control-plane or .github repo)
   - Overrides built-in defaults
   - Applied to all repositories

3. Load repository config (if exists)
   - File: .adr-config.json (at repo root)
   - Overrides both built-in AND org defaults
   - Final configuration used

Final Config = Defaults + Org Overrides + Repo Overrides
```

### Rationale

Two-level inheritance provides:

- ✅ Sensible built-in defaults (zero-config works)
- ✅ Organization baseline consistency
- ✅ Per-repo flexibility and overrides
- ✅ Clear precedence rules (no ambiguity)
- ✅ Easy to understand and maintain

Example scenarios:

- **Org-wide setting:** ADR directory is always `docs/decisions/`
  - Set in `.github/adr-config.json`
  - All repos inherit unless they override

- **Repo override:** This repo uses `decisions/` instead
  - Set in `.adr-config.json`
  - Overrides org default

- **Custom fields:** Only WordPress themes use block compatibility
  - Not in org config
  - Each WordPress theme sets in repo config

### Implementation Impact

- **Phase 1:** Config loader implements merge logic
- **Docs:** Clear examples of inheritance in action
- **Tests:** Comprehensive inheritance test scenarios

### Related Decisions

- AD-003: Configuration Format
- AD-005: Numbering Scheme

---

## AD-005: ADR Numbering Scheme

**Status:** ✅ APPROVED  
**Date:** 2026-08-12  
**Owner:** @ash

### Decision

Use **sequential numbering per repository** (e.g., 0001, 0002, ...) as the default, with support for alternatives.

### Context

- ADRs need unique identifiers
- Different organizations have different preferences
- Must be simple to implement and understand

### Options Considered

1. **Sequential per repository** (CHOSEN)
   - Example: `adr-0001-microservices.md`, `adr-0002-database.md`
   - Pros: Simple, local autonomy, natural order, human-readable
   - Cons: Can't sort across orgs
   - Best for: Per-repo independence

2. Sequential organization-wide
   - Pros: Single counter, easy to track total
   - Cons: Requires shared state, coordination overhead
   - Best for: Centralized management

3. Date-based (YYYY-MM-DD)
   - Example: `adr-2026-08-12-microservices.md`
   - Pros: Natural sort, temporal context
   - Cons: Hard to reference ("that August decision"), longer filenames
   - Best for: Temporal analysis

4. UUID-based
   - Pros: Guaranteed unique globally
   - Cons: Non-human-readable, hard to reference
   - Best for: Distributed systems with UUID preference

### Rationale

Sequential per-repository is LightSpeedWP's default because:

- ✅ Simple to implement (just count existing ADRs)
- ✅ Easy to reference ("see adr-0005" is clear)
- ✅ Local autonomy (each repo independent)
- ✅ Natural reading order
- ✅ Minimal naming complexity

Configuration allows alternatives:

```json
{
  "numbering_scheme": "sequential",  // default
  "numbering_scheme": "date-based",  // alternative
  "numbering_scheme": "uuid"         // alternative
}
```

### Implementation Impact

- **Phase 1:** Default is sequential
- **Config:** Schema supports all three schemes
- **Agent:** Discovery skill handles all schemes
- **Docs:** Examples use sequential, mention alternatives

### Related Decisions

- AD-003: Configuration Format
- AD-004: Inheritance Model
- AD-006: Approval Workflow

---

## AD-006: Approval Workflow

**Status:** ✅ APPROVED  
**Date:** 2026-08-12  
**Owner:** @ash

### Decision

Support **configurable approval workflows** with three patterns: none (optional), CODEOWNERS (automatic), configurable approvers.

### Context

- Different organizations have different governance needs
- Control-plane may require approval; plugin might not
- Must be flexible but simple

### Approval Patterns

```json
// Pattern 1: No approval required
{
  "governance": {
    "review_required": false
  }
}

// Pattern 2: CODEOWNERS auto-approval
{
  "governance": {
    "review_required": true,
    "approval_method": "codeowners"
  }
}

// Pattern 3: Specific approvers
{
  "governance": {
    "review_required": true,
    "approvers": ["@ash", "@team-leads"]
  }
}
```

### Rationale

Configurable approval enables:

- ✅ Organization control-plane: Requires approval (strict governance)
- ✅ Organization repos: Optional approval (faster iteration)
- ✅ WordPress plugins: No approval (distributed development)
- ✅ Each repo can define its own rules

Implementation approach (Phase 3):

- If `review_required: false` → Create ADR file directly
- If `approval_method: codeowners` → Request review from CODEOWNERS
- If `approvers: [list]` → Request review from specific people

### Implementation Impact

- **Phase 1:** Configuration schema supports all patterns
- **Phase 3:** Workflow implementation selects approval strategy
- **Docs:** Examples for each pattern with use cases

### Related Decisions

- AD-001: Single Agent
- AD-005: Numbering Scheme

---

## Summary: Decision Interdependencies

```
AD-001: Single Agent
    ├── AD-002: WordPress Adaptation (via config)
    ├── AD-003: Config Format & Location
    ├── AD-004: Inheritance Model
    ├── AD-005: Numbering Scheme
    └── AD-006: Approval Workflow

All decisions enable configuration-driven behavior
All decisions reduce code complexity
All decisions support Phase 1 through Phase 3
```

---

## Approval Status

| Decision | Status | Approved By | Date |
|----------|--------|------------|------|
| AD-001 | ✅ Approved | @ash | 2026-08-12 |
| AD-002 | ✅ Approved | @ash | 2026-08-12 |
| AD-003 | ✅ Approved | @ash | 2026-08-12 |
| AD-004 | ✅ Approved | @ash | 2026-08-12 |
| AD-005 | ✅ Approved | @ash | 2026-08-12 |
| AD-006 | ✅ Approved | @ash | 2026-08-12 |

All architecture decisions are aligned and ready for Phase 1 implementation.

---

**Built by 🧱 LightSpeedWP**
