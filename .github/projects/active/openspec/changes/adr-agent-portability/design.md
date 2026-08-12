---
title: ADR Agent Portability — Design
description: Technical design and implementation approach for the portable ADR Generator Agent
type: design
status: approved
created_date: 2026-08-12
owner: ash
---

# ADR Agent Portability — Design

## Design Principles

1. **Configuration Over Hardcoding** — All repository-specific behavior in `.adr-config.json`
2. **Sensible Defaults** — Zero-config scenario works without customization
3. **Extensibility Without Forking** — One agent, many configurations
4. **Modular Validation** — Independent, composable validation rules
5. **Comprehensive Testing** — >85% coverage with focus on critical paths
6. **Clear Documentation** — Installation, configuration, examples, best practices

---

## 4-Tier Architecture

### Tier 1: Portable Agent Specification

**Location:** `agents/adr-generator/`

**Files:**

```
agents/adr-generator/
├── adr-generator.agent.md          # Core agent spec
├── config/
│   ├── adr-config.schema.json      # JSON schema
│   └── defaults.json               # Default configuration
├── examples/
│   ├── org-repo-config.json        # Org repos example
│   ├── plugin-config.json          # WordPress plugin example
│   ├── theme-config.json           # WordPress theme example
│   └── control-plane-config.json   # Control-plane example
├── templates/
│   ├── standard-adr.template.md    # Full-featured (400–500 lines)
│   ├── lightweight-adr.template.md # Minimal (200–250 lines)
│   ├── security-adr.template.md    # Security-focused (350–400 lines)
│   └── infrastructure-adr.template.md # Infrastructure-focused (350–400 lines)
├── skills/
│   ├── adr-config-loader.md        # Config loading (>95% coverage)
│   ├── adr-template-loader.md      # Template rendering
│   ├── adr-validator.md            # Validation orchestrator
│   ├── adr-discovery.md            # ADR discovery utility
│   ├── adr-registry.md             # Registry integration
│   └── cross-repo-linker.md        # Cross-repo linking
└── SKILL.md                        # Skill entrypoint
```

**Agent Specification:**

The agent accepts a simple input:

```json
{
  "decision_title": "Migrate to microservices",
  "context": "System scaling challenges",
  "options": ["Monolithic refactor", "Microservices", "Serverless"],
  "recommendation": "Microservices",
  "consequences": "Increased complexity, better scalability"
}
```

Configuration determines:

- Where to save the ADR file
- Which template to use
- Metadata fields to include
- Validation rules to apply
- Linking behavior

---

### Tier 2: Configuration & Templates

#### Configuration Schema

**File:** `agents/adr-generator/config/adr-config.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
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
      "description": "Filename prefix (e.g., 'adr', 'decision')",
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
          "items": { "type": "string" },
          "default": []
        },
        "custom_fields": {
          "type": "object",
          "description": "Custom fields per domain"
        }
      }
    },
    "templates": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Available template variants",
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

#### Template Variants

**1. Standard ADR** (`templates/standard-adr.template.md`)

- Full-featured, comprehensive
- 400–500 lines
- Sections: Title, Status, Context, Decision, Consequences, Alternatives, Rationale, Related ADRs
- Target: General-purpose architectural decisions

**2. Lightweight ADR** (`templates/lightweight-adr.template.md`)

- Minimal, fast to write
- 200–250 lines
- Sections: Title, Context, Decision, Consequences
- Target: Quick decisions, minor changes

**3. Security ADR** (`templates/security-adr.template.md`)

- Security-focused
- 350–400 lines
- Extra sections: Threat Model, Security Considerations, Compliance, Incident Response
- Target: Security and compliance decisions

**4. Infrastructure ADR** (`templates/infrastructure-adr.template.md`)

- Infrastructure-focused
- 350–400 lines
- Extra sections: Architecture Diagram, Resource Requirements, Disaster Recovery, Monitoring
- Target: Infrastructure and deployment decisions

---

### Tier 3: Validation & Skills

#### Modular Validation Rules

**Six Independent Rules:**

1. **no-duplicates** — Prevent duplicate ADR numbers
2. **metadata-completeness** — Ensure required fields present
3. **format-validation** — Verify markdown structure
4. **filename-compliance** — Check filename matches numbering scheme
5. **reference-validity** — Validate cross-repo links
6. **status-consistency** — Ensure status values are valid

**Each rule:**

- Runs independently (can enable/disable in config)
- Has unit tests (target >90%)
- Returns structured feedback
- Can be composed into validation pipeline

#### Skills Architecture

**adr-config-loader** (`skills/adr-config-loader.md`)

- Loads `.adr-config.json` from repository root
- Falls back to defaults when missing
- Validates against schema
- Merges org + repo configs (inheritance model)
- **Test Coverage:** >95% (critical component)
- **Tests:**
  - Load valid config
  - Fall back to defaults
  - Merge configs (inheritance)
  - Validate schema compliance
  - Error on invalid schema
  - Zero-config works
  - Environment-aware defaults

**adr-template-loader** (`skills/adr-template-loader.md`)

- Loads template by name from `templates/` directory
- Renders template with configuration values
- Substitutes metadata fields
- **Test Coverage:** >90%

**adr-validator** (`skills/adr-validator.md`)

- Orchestrates validation rules
- Runs enabled rules from config
- Collects feedback from each rule
- Returns structured validation report
- **Test Coverage:** >90%

**adr-discovery** (`skills/adr-discovery.md`)

- Scans ADR directory for existing ADRs
- Detects next ADR number
- Finds related ADRs by topic
- **Test Coverage:** >85%

**adr-registry** (`skills/adr-registry.md`)

- Registers new ADRs in central index
- Updates registry on each new ADR
- Phase 3 feature (opt-in)
- **Test Coverage:** >80%

**cross-repo-linker** (`skills/cross-repo-linker.md`)

- Links ADRs across repositories
- Validates cross-repo references
- Phase 2 feature
- **Test Coverage:** >80%

---

### Tier 4: GitHub Integration

#### Validation Workflow

**File:** `.github/workflows/adr-validation.yml`

```yaml
name: ADR Validation

on:
  pull_request:
    paths:
      - 'docs/adr/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate ADRs
        run: |
          npm run adr:validate
      - name: Check coverage
        run: |
          npm run test:adr-coverage
```

#### Registry Sync Workflow

**File:** `.github/workflows/adr-registry-sync.yml`

```yaml
name: ADR Registry Sync

on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'docs/adr/**'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Sync to registry
        run: |
          npm run adr:registry-sync
```

---

## Test Strategy

### Unit Tests (Jest)

**Configuration Loading** (`config-loader.test.js`)

- Load valid `.adr-config.json` ✓
- Fall back to defaults ✓
- Merge org + repo configs ✓
- Validate schema ✓
- Error on invalid schema ✓
- Zero-config scenario ✓
- **Coverage:** >95%

**Template Rendering** (`template-loader.test.js`)

- Load standard template ✓
- Load lightweight template ✓
- Load security template ✓
- Load infrastructure template ✓
- Substitute variables ✓
- **Coverage:** >90%

**Validation Rules** (`validators/*.test.js`)

- no-duplicates rule ✓
- metadata-completeness rule ✓
- format-validation rule ✓
- filename-compliance rule ✓
- reference-validity rule ✓
- status-consistency rule ✓
- **Coverage:** >90% per rule

### Integration Tests

**End-to-End ADR Creation**

- Full workflow from input to file creation ✓
- Configuration inheritance ✓
- Template rendering ✓
- Validation execution ✓
- File written to correct location ✓
- **Coverage:** >80%

**Cross-Repository Linking** (Phase 2)

- Discover ADRs across repos ✓
- Link ADRs with cross-repo references ✓
- Validate links remain valid ✓
- **Coverage:** >80%

### Acceptance Tests

**Real-World Adoption**

- Control-plane use case ✓
- Organization repo use case ✓
- WordPress plugin use case ✓
- **Coverage:** All scenarios pass

---

## Configuration Examples

### Organization Repository

```json
{
  "organization": "lightspeedwp",
  "repository": "awesome-plugin",
  "adr_directory": "docs/adr",
  "numbering_scheme": "sequential",
  "prefix": "adr",
  "metadata": {
    "required_fields": ["status", "date", "authors"],
    "optional_fields": []
  },
  "templates": ["standard", "lightweight"],
  "validation": {
    "enabled": true,
    "rules": ["no-duplicates", "metadata-completeness"]
  }
}
```

### WordPress Plugin

```json
{
  "organization": "lightspeedwp",
  "repository": "wp-awesome-plugin",
  "adr_directory": "docs/adr",
  "numbering_scheme": "sequential",
  "metadata": {
    "required_fields": ["status", "date", "authors"],
    "custom_fields": {
      "compatibility": ["WordPress 6.0+", "PHP 8.0+"]
    }
  },
  "templates": ["lightweight"],
  "validation": {
    "enabled": true,
    "rules": ["no-duplicates", "metadata-completeness"]
  }
}
```

### WordPress Theme

```json
{
  "organization": "lightspeedwp",
  "repository": "wp-awesome-theme",
  "adr_directory": "docs/adr",
  "numbering_scheme": "sequential",
  "metadata": {
    "custom_fields": {
      "block_compatibility": ["Core blocks", "ACF blocks"],
      "minimum_version": "6.0"
    }
  },
  "templates": ["lightweight"],
  "validation": {
    "enabled": true,
    "rules": ["no-duplicates", "metadata-completeness"]
  }
}
```

---

## File Structure Summary

```
agents/adr-generator/
├── adr-generator.agent.md         # Main agent (organization-agnostic)
├── SKILL.md                       # Skill entrypoint
├── config/
│   ├── adr-config.schema.json     # JSON schema (>95% coverage)
│   └── defaults.json              # Default configuration
├── examples/
│   ├── org-repo-config.json
│   ├── plugin-config.json
│   ├── theme-config.json
│   └── control-plane-config.json
├── templates/
│   ├── standard-adr.template.md   # 400–500 lines (>90% coverage)
│   ├── lightweight-adr.template.md # 200–250 lines (>90% coverage)
│   ├── security-adr.template.md   # 350–400 lines (>90% coverage)
│   └── infrastructure-adr.template.md # 350–400 lines (>90% coverage)
├── skills/
│   ├── adr-config-loader.md       # >95% coverage (critical)
│   ├── adr-template-loader.md     # >90% coverage
│   ├── adr-validator.md           # >90% coverage
│   ├── adr-discovery.md           # >85% coverage
│   ├── adr-registry.md            # >80% coverage (Phase 3)
│   └── cross-repo-linker.md       # >80% coverage (Phase 2)
├── __tests__/
│   ├── config-loader.test.js      # >95% coverage
│   ├── template-loader.test.js    # >90% coverage
│   ├── validators/
│   │   ├── no-duplicates.test.js
│   │   ├── metadata-completeness.test.js
│   │   ├── format-validation.test.js
│   │   ├── filename-compliance.test.js
│   │   ├── reference-validity.test.js
│   │   └── status-consistency.test.js
│   └── integration/
│       ├── end-to-end.test.js
│       └── cross-repo-linking.test.js
├── docs/
│   ├── INSTALLATION.md            # Setup guide
│   ├── CONFIGURATION_REFERENCE.md # All options
│   ├── BEST_PRACTICES.md          # When & how to write ADRs
│   └── ARCHITECTURE.md            # System diagrams (mermaid)
└── README.md                      # Skill overview
```

---

## Week-by-Week Implementation (Phase 1)

### Weeks 1–2: Configuration System

**Deliverables:**

- JSON schema (`adr-config.schema.json`)
- Default configuration (`config/defaults.json`)
- Config loader skill (`adr-config-loader.md`)
- Configuration examples (4 contexts)
- Unit tests (>95% coverage)
- Configuration reference documentation

**Acceptance Criteria:**

- Schema validates all example configs
- Loader passes all unit tests
- Zero-config scenario works
- Documentation complete with examples

### Weeks 3–5: Templates & Validation

**Deliverables:**

- Four template variants (standard, lightweight, security, infrastructure)
- Template loader skill (`adr-template-loader.md`)
- Six validation rules (modular, independent)
- Validator orchestrator skill (`adr-validator.md`)
- Unit tests (>90% coverage)
- Integration tests (>80% coverage)
- Validation reference documentation

**Acceptance Criteria:**

- All templates render without errors
- All validation rules execute independently
- Composition works (enable/disable rules via config)
- Test coverage >85% across validators

### Weeks 6–8: Agent, Skills, Tests & Docs

**Deliverables:**

- Core agent spec (`adr-generator.agent.md`)
- Discovery skill (`adr-discovery.md`)
- Registry skill (`adr-registry.md`, Phase 3 stub)
- Cross-repo linker skill (`cross-repo-linker.md`, Phase 2 stub)
- Complete Jest test suite
- Installation guide
- Best practices guide
- Architecture documentation (mermaid diagrams)
- Examples for each domain

**Acceptance Criteria:**

- All tests passing
- Overall coverage >85%
- Installation guide complete
- All domains can adopt with examples
- Documentation includes mermaid diagrams

---

## Success Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| Code Coverage | >85% | Critical paths >95% |
| Configuration Loading | >95% | Must be bulletproof |
| Template Variants | 4 | Standard, lightweight, security, infrastructure |
| Validation Rules | 6 | All modular & independent |
| Test Suites | 3 | Unit, integration, acceptance |
| Documentation Pages | 6+ | Installation, config, best practices, architecture |
| Example Configurations | 4 | Org repo, plugin, theme, control-plane |
| Supported Contexts | 4 | Control-plane, org repos, plugins, themes |

---

## Related Documents

- **Proposal:** [proposal.md](./proposal.md)
- **Active Project:** [.github/projects/active/adr-agent-portability-org/README.md](.github/projects/active/adr-agent-portability-org/README.md)
- **Detailed Specification:** [OPENSPEC.md](.github/projects/active/adr-agent-portability-org/OPENSPEC.md)
- **Planning PR:** [#1826](../../../pull/1826)

---

**Design Status:** ✅ Approved  
**Next Step:** Begin Phase 1 implementation (Weeks 1–2: Configuration system)
