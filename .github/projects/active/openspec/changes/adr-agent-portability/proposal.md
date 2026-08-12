---
title: ADR Agent Portability — Proposal
description: Specification for making the ADR Generator Agent portable across all LightSpeedWP repositories
type: proposal
status: approved
created_date: 2026-08-12
owner: ash
---

# ADR Agent Portability — Proposal

## Problem Statement

The current ADR Generator Agent (`.github/agents/adr.agent.md`) is tightly coupled to the `.github` control plane with several limitations:

1. **Hardcoded paths** — ADR directory paths are baked into the agent spec
2. **Organization-specific branding** — LightSpeedWP references throughout
3. **Inflexible metadata** — Cannot accommodate domain-specific fields (WordPress plugins, themes, organization repos)
4. **No configuration system** — Every repository adoption requires fork and modification
5. **Limited template variants** — Single template for all use cases
6. **No cross-repository capabilities** — Cannot discover or link ADRs across repositories

**Impact:** Adoption across the organization (organization repos, WordPress plugins, WordPress themes) requires maintaining multiple agent variants or extensive manual customization.

---

## Proposed Solution

Create a **single portable ADR Generator Agent** in `agents/adr-generator/` that:

1. **Is configuration-driven** — Uses `.adr-config.json` for all customization
2. **Supports multiple templates** — Standard, lightweight, security, infrastructure variants
3. **Has modular validation** — Composable, independent validation rules
4. **Enables cross-repo linking** — Discovers and links ADRs across repositories
5. **Is fully tested** — >85% code coverage with comprehensive test suite
6. **Is well-documented** — Installation, configuration, and best practices guides

**Key Principle:** One agent, many configurations. No forking required.

---

## Scope

### In Scope

- ✅ Portable agent specification (`agents/adr-generator/adr-generator.agent.md`)
- ✅ Configuration schema (`.adr-config.json`) with inheritance model
- ✅ Four template variants (standard, lightweight, security, infrastructure)
- ✅ Six modular validation rules (no-duplicates, metadata-check, format-check, etc.)
- ✅ Reusable skills: config-loader, template-loader, validator, discovery, registry, linker
- ✅ Jest test suite with >85% overall coverage (>95% for critical config, >90% for templates/validation)
- ✅ Comprehensive documentation with mermaid diagrams
- ✅ GitHub Actions integration (validation workflows)
- ✅ Support for control-plane, organization repos, WordPress plugins, WordPress themes

### Out of Scope

- ❌ Central ADR registry (Phase 3)
- ❌ Approval workflows (future enhancement)
- ❌ Metrics and reporting (Phase 3)
- ❌ Integration with external systems (future)

---

## Implementation Approach

### 4-Tier Architecture

```
Tier 1: Portable Agent Specification
  └─ agents/adr-generator/adr-generator.agent.md

Tier 2: Configuration & Templates
  ├─ Configuration Schema (.adr-config.json)
  └─ Template System (4 variants)

Tier 3: Validation & Skills
  ├─ adr-config-loader (>95% coverage)
  ├─ adr-template-loader
  ├─ adr-validator (orchestrator)
  ├─ adr-discovery
  ├─ adr-registry
  └─ cross-repo-linker

Tier 4: GitHub Integration
  ├─ .github/workflows/adr-validation.yml
  ├─ .github/workflows/adr-registry-sync.yml
  └─ Hooks & Extensions
```

### Configuration-Driven Design

All repository-specific behavior driven by `.adr-config.json`:

```json
{
  "organization": "lightspeedwp",
  "repository": "my-repo",
  "adr_directory": "docs/adr",
  "numbering_scheme": "sequential",
  "metadata": {
    "required_fields": ["status", "date", "authors"],
    "custom_fields": {}
  },
  "templates": ["standard"],
  "validation": {
    "enabled": true,
    "rules": ["no-duplicates", "metadata-completeness"]
  }
}
```

---

## Success Criteria

- ✅ Agent is portable and installable without modification
- ✅ Configuration system enables per-repo customization
- ✅ Test coverage >85% across all code
- ✅ Documentation complete with mermaid diagrams
- ✅ ADRs can be discovered and linked across repositories
- ✅ WordPress repos can adopt with minimal effort
- ✅ Governance integration supports org-wide decision tracking
- ✅ All related GitHub issues are linked and tracked

---

## GitHub Coordination

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1828](../../../issues/1828) | epic | Master Initiative Epic — ADR Agent Portability | 🟢 Open |
| [#1829](../../../issues/1829) | task | Phase 1A: Design & Configuration System | ⏳ Planned |
| [#1830](../../../issues/1830) | task | Phase 1B: Template & Validation Framework | ⏳ Planned |
| [#1831](../../../issues/1831) | task | Phase 1C: Test Suite & Documentation | ⏳ Planned |
| [#1832](../../../issues/1832) | task | Phase 2: Cross-Repository Integration | ⏳ Planned |
| [#1833](../../../issues/1833) | task | Phase 3: Registry & Organization-Wide Features | ⏳ Planned |

---

## Timeline

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Phase 1: Core Portability | 8–10 weeks | 2026-08-12 | ~2026-10-21 |
| Phase 2: Cross-Repo Integration | 6–8 weeks | ~2026-10-22 | ~2026-12-16 |
| Phase 3: Org-Wide Features | 4–6 weeks | ~2026-12-17 | ~2027-01-27 |
| **Total** | **18–24 weeks** | **2026-08-12** | **~2027-01-27** |

---

## Decision Points

| DP | Question | Recommendation | Owner |
|---|----------|-----------------|-------|
| DP-001 | Single agent vs. multiple variants? | Single configurable agent | @ash |
| DP-002 | Special handling for WordPress? | Custom metadata via configuration | @ash |
| DP-003 | Configuration location & format? | `.adr-config.json` at repo root | @ash |
| DP-004 | Central registry? | Hybrid (Phase 1: local, Phase 3: optional) | @ash |
| DP-005 | ADR numbering scheme? | Sequential per repository | @ash |
| DP-006 | Approval workflow? | Configurable per repository | @ash |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Configuration complexity | Sensible defaults, zero-config works |
| Template variant explosion | Start with 4 core variants, extensible model |
| Cross-repo linking fragility | Robust discovery, fallback to local only |
| Test coverage gaps | >85% target with critical path >95% |
| Adoption friction | Clear migration path, existing agent remains |

---

## Related Documents

- **Active Project:** [.github/projects/active/adr-agent-portability-org/README.md](.github/projects/active/adr-agent-portability-org/README.md)
- **Detailed Specification:** [OPENSPEC.md](.github/projects/active/adr-agent-portability-org/OPENSPEC.md)
- **Design Spec:** [design.md](./design.md)
- **Planning PR:** [#1826](../../../pull/1826)

---

**Proposal Status:** ✅ Approved  
**Next Step:** Create design.md and begin Phase 1 implementation
