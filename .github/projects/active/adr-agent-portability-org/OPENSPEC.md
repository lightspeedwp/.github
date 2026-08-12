# ADR Agent Portability — OpenSpec Specification

**Status:** 🟡 In Progress  
**Last Updated:** 2026-08-12  
**Owner:** @ash

---

## Executive Summary

This OpenSpec document captures the detailed specification for making the ADR Generator Agent portable across the LightSpeedWP organization. The agent will support configuration-driven behavior, allowing adoption in all repository contexts (control-plane, organization repos, WordPress plugins/themes) without modification.

The solution emphasizes:

- **Extensibility without forking** — One agent, many configurations
- **Configuration over hardcoding** — All paths, metadata, templates configurable
- **Comprehensive test coverage** — >85% coverage for production quality
- **Clear migration path** — Existing repos can adopt gradually

---

## Phase 1: Core Portability (8–10 weeks)

### Objective

Establish a configurable, portable ADR agent that can be installed in any repository with minimal customization.

---

### 1.1 Configuration System

**Deliverable:** `.adr-config.json` schema and loader skill

**Files to Create:**

```
agents/adr-generator/
├── config/
│   ├── adr-config.schema.json      # JSON schema for validation
│   └── defaults.json               # Default configuration values
├── examples/
│   ├── org-config-example.json     # Organization-level defaults
│   ├── repo-config-example.json    # Repository-specific config
│   ├── wordpress-plugin-example.json
│   └── wordpress-theme-example.json
└── skills/
    └── adr-config-loader.md        # Config loading and validation skill
```

**Configuration Schema:**

```json
{
  "organization": "lightspeedwp",
  "adr_directory": "docs/adr",
  "numbering_scheme": "sequential",
  "prefix": "adr",
  "metadata": {
    "required_fields": ["status", "date", "authors"],
    "optional_fields": [],
    "custom_fields": {}
  },
  "templates": ["standard"],
  "validation": {
    "enabled": true,
    "rules": ["no-duplicates", "metadata-completeness"]
  },
  "governance": {
    "review_required": false
  }
}
```

**Features:**

- JSON schema validation
- Sensible defaults (zero-config works)
- Configuration inheritance (org defaults + repo overrides)
- Support for custom fields per repository
- Environment-aware defaults

**Tests:**

| Test | Type | Coverage |
|------|------|----------|
| Load valid `.adr-config.json` | Unit | Schema validation |
| Fall back to defaults when no config | Unit | Default behavior |
| Merge org + repo configs | Unit | Inheritance |
| Validate config schema | Unit | Schema compliance |
| Error on invalid schema | Unit | Error handling |
| Zero-config scenario | Integration | Works without config |
| Configuration inheritance | Integration | Multi-level merging |

**Coverage Target:** >95% (critical component)

---

### 1.2 Template System

**Deliverable:** Multiple ADR templates with variant support

**Files to Create:**

```
agents/adr-generator/
├── templates/
│   ├── standard-adr.template.md        # Full-featured template
│   ├── lightweight-adr.template.md     # Minimal, 1-page
│   ├── security-adr.template.md        # Domain example
│   ├── infrastructure-adr.template.md  # Domain example
│   └── TEMPLATE-GUIDE.md              # How to create custom templates
└── skills/
    └── adr-template-loader.md          # Template selection and rendering
```

**Template Features:**

All templates include:

- YAML front matter with customizable fields
- Consequence tracking (positive/negative with codes)
- Alternative evaluation section
- Implementation guidance
- References and relationships

**Template Variants:**

| Template | Use Case | Sections | Target |
|----------|----------|----------|--------|
| Standard | Full decisions | 12+ (all sections) | Architecture, major decisions |
| Lightweight | Quick decisions | 6 (core only) | Minor decisions, constraints |
| Security | Security decisions | 8 (security-focused) | Security policies, threat model |
| Infrastructure | Infrastructure | 10 (infra-focused) | Cloud, DevOps, systems |
| Custom | Org-specific | Variable | Defined per org |

**Tests:**

| Test | Type | Coverage |
|------|------|----------|
| Load all template variants | Unit | File loading |
| Render templates with values | Unit | Template rendering |
| Validate template structure | Unit | Markdown structure |
| Error on missing required placeholders | Unit | Error handling |
| Support custom template paths | Unit | Configuration |
| All templates generate valid ADRs | Integration | Output validation |
| Template selection via config | Integration | Config-driven selection |

**Coverage Target:** >90% (core functionality)

---

### 1.3 Validation & Quality Framework

**Deliverable:** Reusable validation rules and quality checking

**Files to Create:**

```
agents/adr-generator/
└── skills/
    ├── adr-validator.md                # Orchestrator
    ├── adr-structure-validator.md      # Markdown + front matter
    ├── adr-metadata-validator.md       # YAML fields
    ├── adr-duplicate-detector.md       # No duplicates
    ├── adr-completeness-checker.md     # Required sections
    └── adr-clarity-checker.md          # Language quality
```

**Validation Rules:**

| Rule | Purpose | Triggered | Configurable |
|------|---------|-----------|--------------|
| `no-duplicates` | Prevent duplicate titles/decisions | on-creation | Yes |
| `metadata-completeness` | Ensure required fields present | on-creation | Yes |
| `structure-validity` | Valid markdown + front matter | on-creation | No |
| `clarity-check` | Language clarity suggestions | on-creation | Yes |
| `consequence-coverage` | At least 1 positive & 1 negative | on-creation | Yes |
| `alternative-coverage` | At least 2–3 alternatives | on-creation | Yes |

**Tests:**

| Test | Type | Coverage |
|------|------|----------|
| Detect duplicate ADR titles | Unit | Duplicate detection |
| Check metadata completeness | Unit | Field validation |
| Validate markdown structure | Unit | Structure validation |
| Enforce consequence coverage | Unit | Content requirements |
| Full validation pipeline | Integration | End-to-end flow |
| Error message generation | Unit | User feedback |
| Quality checks prevent low-quality ADRs | Integration | Acceptance criteria |

**Coverage Target:** >90% per rule

---

### 1.4 Portable Agent Specification

**Deliverable:** Organization-agnostic agent spec

**Files to Create:**

```
agents/adr-generator/
└── adr-generator.agent.md             # Main agent specification
```

**Agent Responsibilities:**

1. Load configuration at startup
2. Select appropriate template based on config
3. Orchestrate validation pipeline
4. Generate ADR with proper numbering
5. Return user-friendly feedback

**Changes from Current:**

| Current | Change | Reason |
|---------|--------|--------|
| Hardcoded `/docs/adr/` | Use config path | Flexibility |
| LightSpeedWP branding | Use org name from config | Portability |
| Single template | Multiple templates | Flexibility |
| Limited validation | Modular validation rules | Extensibility |

**Tests:**

| Test | Type | Coverage |
|------|------|----------|
| Agent workflow start-to-finish | Integration | Full flow |
| Config-driven behavior | Integration | Configuration impact |
| Different configs produce different outputs | Integration | Behavior variance |

**Coverage Target:** >85% (integration focus)

---

### 1.5 Test Suite

**Deliverable:** Comprehensive unit + integration tests

**Test Infrastructure:**

```
agents/adr-generator/
├── __tests__/
│   ├── config-loader.test.js
│   ├── template-loader.test.js
│   ├── validators/
│   │   ├── structure-validator.test.js
│   │   ├── metadata-validator.test.js
│   │   ├── duplicate-detector.test.js
│   │   ├── completeness-checker.test.js
│   │   └── clarity-checker.test.js
│   ├── integration/
│   │   ├── end-to-end-workflow.test.js
│   │   ├── config-inheritance.test.js
│   │   └── cross-repo-linking.test.js
│   └── fixtures/
│       ├── valid-config.json
│       ├── invalid-config.json
│       ├── sample-adr.md
│       └── expected-output.md
├── jest.config.js
└── .testignore
```

**Test Scenarios:**

**Config Loader Tests:**

- ✓ Load valid `.adr-config.json`
- ✓ Fall back to defaults when no config
- ✓ Merge org defaults with repo-specific overrides
- ✓ Validate config schema
- ✓ Error gracefully on invalid schema
- ✓ Handle missing required fields

**Template Loader Tests:**

- ✓ Load all template variants
- ✓ Render templates with actual values
- ✓ Error on missing required placeholders
- ✓ Support custom template paths
- ✓ Handle template inheritance

**Validator Tests (per rule):**

- ✓ Detect duplicate ADR titles
- ✓ Check metadata completeness
- ✓ Validate markdown structure
- ✓ Enforce consequence coverage
- ✓ Suggest improvements for clarity

**Integration Tests:**

- ✓ Full workflow: config → template → validation → file
- ✓ Different configs produce different ADR structures
- ✓ Error handling and user messaging
- ✓ Configuration inheritance edge cases

**Test Frameworks & Tools:**

- **Jest** — Unit and integration tests
- **Node.js fs module** — File system operations
- **Mock GitHub file system** — Simulate repo structure
- **Snapshot testing** — Validate output consistency

**CI/CD Integration:**

```yaml
# Run on every PR to ADR agent changes
- Run tests: npm run test:adr
- Report coverage: codecov
- Block merge if coverage <85%
- Run linting: npm run lint:adr
```

**Coverage Report:**

| Component | Target | Method |
|-----------|--------|--------|
| Config loader | >95% | Unit + integration |
| Template system | >90% | Unit + integration |
| Validators | >90% | Unit (per rule) |
| Agent spec | >85% | Integration |
| **Overall** | **>85%** | Combined |

---

### 1.6 Documentation

**Deliverable:** Complete documentation with mermaid diagrams

**Files to Create:**

```
agents/adr-generator/
├── INSTALL.md                       # Installation guide
├── CONFIG.md                        # Configuration reference
├── BEST-PRACTICES.md               # Best practices guide
├── ARCHITECTURE.md                 # System architecture
├── API.md                          # Skills and functions
├── TROUBLESHOOTING.md              # Common issues
└── examples/
    ├── standard-adr-output.md
    ├── lightweight-adr-output.md
    └── custom-config-example.json
```

**Documentation Sections:**

**INSTALL.md:**

- Prerequisites (Node.js, npm, git)
- Step-by-step setup for adopting repositories
- Configuration template with explanations
- Troubleshooting common setup issues

**CONFIG.md:**

- Full schema documentation
- All configuration options with defaults
- Per-repository customization patterns
- Configuration inheritance examples
- WordPress-specific configuration

**BEST-PRACTICES.md:**

- When to write an ADR
- How to structure decisions effectively
- Examples across domains (security, infrastructure, etc.)
- Common pitfalls to avoid
- Decision templates and patterns

**ARCHITECTURE.md:**

- System overview
- Component relationships
- Data flow diagrams (mermaid)
- Extension points and hooks
- Plugin development guide

**Mermaid Diagrams Required:**

```mermaid
graph LR
    A[User Input] --> B[Config Loader]
    B --> C[Template Selector]
    C --> D[Template Renderer]
    D --> E[Validation Pipeline]
    E --> F{Valid?}
    F -->|Yes| G[Write File]
    F -->|No| H[Return Errors]
    G --> I[Success Message]
    H --> J[User Feedback]
```

```mermaid
graph TB
    Config["User provides decision info"]
    Config --> CheckConfig["Load .adr-config.json"]
    CheckConfig --> GetTemplate["Select template"]
    GetTemplate --> ValidateTemplate["Render with values"]
    ValidateTemplate --> RunValidation["Run validators"]
    RunValidation --> Decision{All rules pass?}
    Decision -->|No| ShowErrors["Show error details"]
    ShowErrors --> End["Stop"]
    Decision -->|Yes| WriteFile["Write ADR file"]
    WriteFile --> Success["Success confirmation"]
```

---

### 1.7 Acceptance Criteria (Phase 1)

✅ Configuration system implemented and tested  
✅ Template system supports standard + lightweight + examples  
✅ All validation rules are modular and testable  
✅ Agent spec is portable and organization-agnostic  
✅ Test coverage >85% for all code  
✅ Documentation complete with mermaid diagrams  
✅ Works in 3+ test repositories (control-plane, org repo, WordPress)  
✅ Zero hardcoded organization-specific assumptions  
✅ All skills are reusable and independent

---

## Phase 2: Cross-Repository Integration (6–8 weeks)

### Objective

Enable ADR discovery and linking across repositories.

### High-Level Scope

- Cross-repo ADR discovery and linking
- GitHub Actions for validation in PRs
- Governance hooks for org-specific workflows
- Support for different repo contexts (control-plane, WordPress)

**Files to Create:** Skills and workflows for cross-repo operations

---

## Phase 3: Organization-Wide Features (4–6 weeks)

### Objective

Central ADR registry and organization-wide decision tracking.

### High-Level Scope

- Central ADR registry and index
- Metrics and reporting
- Knowledge management and archival
- Organizational decision tracking

---

## Decision Points (Ready for Team Input)

### DP-001: Single Agent vs. Multiple Variants

**Status:** ⏳ Awaiting decision

### DP-002: WordPress Adaptation Strategy

**Status:** ⏳ Awaiting decision

### DP-003: Configuration Format & Location

**Status:** ⏳ Awaiting decision

### DP-004: Registry Integration Type

**Status:** ⏳ Awaiting decision

### DP-005: ADR Numbering Scheme

**Status:** ⏳ Awaiting decision

### DP-006: Approval Workflow Requirements

**Status:** ⏳ Awaiting decision

---

## Success Metrics

✅ Code Quality: >85% test coverage across all components  
✅ Adoption: 5+ repositories successfully using agent by end of Phase 1  
✅ Documentation: Complete with mermaid diagrams, 0 outstanding clarifications  
✅ Test Results: All CI checks passing, 0 known bugs  
✅ User Feedback: Positive feedback from adopting teams

---

## Timeline (Detailed)

| Phase | Duration | Start | Key Milestones |
|-------|----------|-------|-----------------|
| Phase 1A | 2–3 weeks | 2026-08-12 | Config system, schema, loader |
| Phase 1B | 3–4 weeks | 2026-08-26 | Templates, validation, quality |
| Phase 1C | 2–3 weeks | 2026-09-09 | Test suite, documentation |
| Phase 1 Review | 1 week | 2026-09-23 | Acceptance tests, sign-off |
| Phase 2 | 6–8 weeks | 2026-09-30 | Cross-repo, GitHub Actions, governance |
| Phase 3 | 4–6 weeks | 2026-11-24 | Registry, metrics, knowledge mgmt |

---

## Risk Mitigation

### Risk: Configuration Complexity

**Mitigation:** Sensible defaults, interactive config wizard, comprehensive documentation

### Risk: Version Incompatibility

**Mitigation:** Semantic versioning, backward-compatible config, migration guide

### Risk: Adoption Friction

**Mitigation:** One-command setup, detailed guides, example configs, proof-of-concept in 2 repos

---

*Last Updated: 2026-08-12 by @ash*  
*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
