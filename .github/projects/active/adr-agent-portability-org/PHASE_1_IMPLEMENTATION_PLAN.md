---
title: "Phase 1 Implementation Plan — ADR Agent Portability"
description: "Detailed week-by-week implementation roadmap for Phase 1: Core Portability (8–10 weeks)"
created_date: 2026-08-12
updated_date: 2026-08-12
owners:
  - ash
---

# Phase 1 Implementation Plan — Core Portability

**Duration:** 8–10 weeks  
**Target Completion:** ~2026-10-21  
**Related Issue:** [#1829](https://github.com/lightspeedwp/.github/issues/1829)

---

## Phase 1 Overview

Transform the ADR Generator Agent into a configurable, portable system that can be installed in any repository without modification. Phase 1 establishes the foundation for cross-repository adoption.

### Deliverables Summary

| Deliverable | Scope | Owner | Status |
|-------------|-------|-------|--------|
| Configuration System | JSON schema, loader, examples, tests | @ash | ⏳ Planned |
| Template System | 4 variants, loader, tests | @ash | ⏳ Planned |
| Validation Framework | 6 rules, orchestrator, tests | @ash | ⏳ Planned |
| Agent Specification | Portable agent spec | @ash | ⏳ Planned |
| Test Suite | Unit + integration, >85% coverage | @ash | ⏳ Planned |
| Documentation | Installation, config, best practices | @ash | ⏳ Planned |

---

## Weeks 1–2: Configuration System

### Objectives

- Design and implement `.adr-config.json` schema
- Create configuration loader skill with validation
- Define configuration inheritance model (org + repo)
- Establish sensible defaults (zero-config scenario)
- Write comprehensive tests (>95% coverage)

### Deliverables

**Files to Create:**

```
agents/adr-generator/
├── config/
│   ├── adr-config.schema.json       # JSON schema for validation
│   ├── adr-config.definitions.md    # Schema field reference
│   └── defaults.json                # Default configuration values
├── examples/
│   ├── control-plane-config.json
│   ├── org-repo-config.json
│   ├── wordpress-plugin-config.json
│   └── wordpress-theme-config.json
├── skills/
│   └── adr-config-loader.md         # Config loading & validation skill
└── __tests__/
    └── config-loader.test.js        # Unit tests (>95% coverage)
```

### Configuration Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ADR Configuration Schema",
  "type": "object",
  "required": ["adr_directory"],
  "properties": {
    "organization": {
      "type": "string",
      "description": "Organization name for branding",
      "default": "LightSpeedWP"
    },
    "repository": {
      "type": "string",
      "description": "Repository name (for cross-repo linking)"
    },
    "adr_directory": {
      "type": "string",
      "description": "Directory where ADRs are stored",
      "default": "docs/adr"
    },
    "numbering_scheme": {
      "type": "string",
      "enum": ["sequential", "date-based", "uuid"],
      "default": "sequential"
    },
    "prefix": {
      "type": "string",
      "default": "adr"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "required_fields": {
          "type": "array",
          "items": { "type": "string" },
          "default": ["status", "date", "authors"]
        },
        "optional_fields": {
          "type": "array",
          "items": { "type": "string" }
        },
        "custom_fields": {
          "type": "object"
        }
      }
    },
    "templates": {
      "type": "array",
      "items": { "type": "string" },
      "default": ["standard"]
    },
    "validation": {
      "type": "object",
      "properties": {
        "enabled": { "type": "boolean", "default": true },
        "rules": {
          "type": "array",
          "items": { "type": "string" },
          "default": ["no-duplicates", "metadata-completeness"]
        }
      }
    },
    "governance": {
      "type": "object",
      "properties": {
        "review_required": { "type": "boolean", "default": false },
        "approvers": { "type": "array", "items": { "type": "string" } }
      }
    }
  }
}
```

### Test Scenarios (>95% coverage)

| Test | Scenario | Expected | Coverage |
|------|----------|----------|----------|
| Load valid config | `.adr-config.json` exists and valid | Config loaded ✓ | Validation |
| Load missing config | No `.adr-config.json` | Defaults applied ✓ | Fallback behavior |
| Merge configs | Org config + repo config | Merged correctly ✓ | Inheritance |
| Validate schema | Valid/invalid against schema | Validation result ✓ | Schema compliance |
| Error handling | Invalid JSON/schema | Error thrown ✓ | Error handling |
| Zero-config | No config file at all | Works with defaults ✓ | Default behavior |
| Environment override | Env vars override config | Env value used ✓ | Env awareness |
| Custom fields | Custom metadata fields | Fields preserved ✓ | Custom fields |

### Acceptance Criteria

- [ ] Schema validates all config examples
- [ ] Config loader passes all unit tests (>95% coverage)
- [ ] Zero-config scenario works without errors
- [ ] Inheritance model merges org + repo configs correctly
- [ ] Documentation includes schema reference and examples
- [ ] Error messages clear and actionable

---

## Weeks 3–5: Templates & Validation Framework

### Objectives

- Implement four ADR template variants
- Create template loader and renderer
- Design six modular validation rules
- Build validation orchestrator
- Write comprehensive tests (>90% coverage)

### Template Variants

**1. Standard ADR** (400–500 lines)

- Full-featured, comprehensive
- All sections included
- Target: General-purpose architectural decisions

**2. Lightweight ADR** (200–250 lines)

- Minimal, fast to write
- Core sections only
- Target: Quick decisions, minor changes

**3. Security ADR** (350–400 lines)

- Security-focused
- Threat model, compliance sections
- Target: Security/compliance decisions

**4. Infrastructure ADR** (350–400 lines)

- Infrastructure-focused
- Architecture diagrams, resource requirements
- Target: Infrastructure/deployment decisions

### Validation Rules (Modular, Independent)

```
Rule 1: no-duplicates
  - Prevents duplicate ADR numbers/titles
  - Scans existing ADRs
  - Returns conflict list

Rule 2: metadata-completeness
  - Ensures required fields present
  - Checks YAML frontmatter
  - Returns missing fields list

Rule 3: format-validation
  - Verifies markdown structure
  - Checks heading hierarchy
  - Returns format issues

Rule 4: filename-compliance
  - Validates filename matches numbering scheme
  - Checks prefix and number format
  - Returns filename violations

Rule 5: reference-validity
  - Validates cross-repo links
  - Checks ADR references resolve
  - Returns broken references

Rule 6: status-consistency
  - Ensures valid status values
  - Checks status transitions
  - Returns status violations
```

### Files to Create

```
agents/adr-generator/
├── templates/
│   ├── standard-adr.template.md
│   ├── lightweight-adr.template.md
│   ├── security-adr.template.md
│   ├── infrastructure-adr.template.md
│   └── TEMPLATE_GUIDE.md
├── skills/
│   ├── adr-template-loader.md
│   └── adr-validator.md
└── __tests__/
    ├── template-loader.test.js
    └── validators/
        ├── no-duplicates.test.js
        ├── metadata-completeness.test.js
        ├── format-validation.test.js
        ├── filename-compliance.test.js
        ├── reference-validity.test.js
        └── status-consistency.test.js
```

### Test Coverage Targets

- Template loading & rendering: >90%
- Template variants: >90%
- Validation rules (each): >90%
- Orchestrator: >85%
- **Overall:** >88%

### Acceptance Criteria

- [ ] All 4 templates render without errors
- [ ] All 6 validation rules execute independently
- [ ] Rules can be enabled/disabled via config
- [ ] Composition works (enable/disable multiple rules)
- [ ] All tests passing (>88% coverage)
- [ ] Error messages guide users to fixes

---

## Weeks 6–8: Agent, Skills, Tests & Documentation

### Objectives

- Implement core agent specification
- Create discovery and registry skills
- Complete full Jest test suite
- Write installation and best practices guides
- Generate architecture documentation with diagrams

### Core Agent Specification

**File:** `agents/adr-generator/adr-generator.agent.md`

Input:

```json
{
  "decision_title": "Migrate to microservices",
  "context": "System scaling challenges",
  "options": ["Monolithic refactor", "Microservices", "Serverless"],
  "recommendation": "Microservices",
  "consequences": "Increased complexity, better scalability"
}
```

Flow:

1. Load configuration from `.adr-config.json`
2. Select template based on config
3. Run enabled validation rules
4. Generate ADR file
5. Register in ADR registry (Phase 3)
6. Create PR with ADR (optional)

### Skills to Implement

```
adr-discovery
  - Scans ADR directory
  - Detects next ADR number
  - Finds related ADRs by topic
  - Returns ADR metadata

adr-registry (Phase 3)
  - Registers new ADRs
  - Updates central index
  - Stub implementation OK for Phase 1

cross-repo-linker (Phase 2)
  - Links ADRs across repos
  - Validates cross-repo references
  - Stub implementation OK for Phase 1
```

### Documentation Files

```
agents/adr-generator/docs/
├── INSTALLATION.md (400 lines)
│   - Setup guide for each repo type
│   - Configuration walkthrough
│   - Troubleshooting section
├── CONFIGURATION_REFERENCE.md (300 lines)
│   - Complete schema documentation
│   - All options with examples
│   - Per-repo customization patterns
├── BEST_PRACTICES.md (250 lines)
│   - When to write ADRs
│   - Structure guidelines
│   - Examples across domains
├── ARCHITECTURE.md (300 lines)
│   - System overview (mermaid)
│   - Data flow (mermaid)
│   - Integration points (mermaid)
│   - Configuration decision tree (mermaid)
└── README.md (150 lines)
    - Quick start
    - Key concepts
    - Links to other docs
```

### Test Suite Structure

```
__tests__/
├── unit/
│   ├── config-loader.test.js         (>95% coverage)
│   ├── template-loader.test.js       (>90% coverage)
│   ├── validators/
│   │   ├── no-duplicates.test.js     (>90% coverage)
│   │   ├── metadata-completeness.test.js
│   │   ├── format-validation.test.js
│   │   ├── filename-compliance.test.js
│   │   ├── reference-validity.test.js
│   │   └── status-consistency.test.js
│   └── discovery.test.js             (>85% coverage)
├── integration/
│   ├── end-to-end.test.js            (>85% coverage)
│   └── cross-repo-linking.test.js    (>80% coverage)
└── acceptance/
    └── real-world-scenarios.test.js   (>80% coverage)
```

### Acceptance Criteria

- [ ] All unit tests passing (>95% config, >90% templates/validators)
- [ ] Integration tests passing (>85% coverage)
- [ ] Acceptance tests covering real-world scenarios
- [ ] Overall coverage >85%
- [ ] Installation guide step-by-step working
- [ ] Configuration reference complete with examples
- [ ] Best practices document covers all domains
- [ ] Architecture documentation includes 4+ mermaid diagrams
- [ ] All examples render correctly in GitHub

---

## Success Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| Code coverage | >85% | Critical paths >95% |
| Configuration | >95% | Must be bulletproof |
| Templates | >90% | All variants working |
| Validation rules | >90% | Each rule independent |
| Test suites | 3 | Unit, integration, acceptance |
| Documentation | 6+ pages | Installation, config, best practices, architecture |
| Examples | 4 | Org repo, plugin, theme, control-plane |
| Support contexts | 4 | All repository types supported |

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Configuration too complex | Medium | High | Start with defaults, gradual complexity |
| Template variant conflicts | Low | Medium | Clear naming, selection logic |
| Validation rule interactions | Medium | Medium | Independent rules, clear documentation |
| Zero-config failures | Low | High | Comprehensive default testing |
| Cross-repo linking fragility | Medium | Medium | Phase 2, not Phase 1 |
| Documentation gaps | Medium | High | Multiple examples per concept |

---

## Weekly Deliverables

### Week 1–2 Summary

- [ ] JSON schema finalized
- [ ] Config loader skill implemented
- [ ] 4 config examples created
- [ ] Unit tests written (>95% coverage)
- [ ] Configuration reference docs

### Week 3–5 Summary

- [ ] 4 templates created and tested (>90% coverage)
- [ ] 6 validation rules implemented
- [ ] Validator orchestrator working
- [ ] All tests passing
- [ ] Template guide documentation

### Week 6–8 Summary

- [ ] Core agent spec complete
- [ ] Discovery skill implemented
- [ ] Full test suite passing (>85%)
- [ ] All documentation complete
- [ ] Installation guide tested end-to-end

---

## Dependencies & Blocking Issues

- None within Phase 1
- Phase 2 depends on Phase 1 completion
- Phase 3 depends on Phase 1 & 2 completion

---

## Related Issues

- Epic: [#1828](https://github.com/lightspeedwp/.github/issues/1828)
- Phase 1A Task: [#1829](https://github.com/lightspeedwp/.github/issues/1829)
- Phase 1B Task: [#1830](https://github.com/lightspeedwp/.github/issues/1830)
- Phase 1C Task: [#1831](https://github.com/lightspeedwp/.github/issues/1831)

---

**Built by 🧱 LightSpeedWP**
