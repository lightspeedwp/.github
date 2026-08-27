---
name: adr-generator
description: Generate architectural decision records with configuration-driven templates and validation
category: infrastructure
tags:
  - architecture
  - decisions
  - documentation
  - configuration
---

# ADR Generator

Generate architectural decision records (ADRs) with flexible, configuration-driven behavior. Supports multiple template variants, custom numbering schemes, approval workflows, and WordPress-specific customizations.

## Overview

The ADR Generator is a **portable, configuration-driven agent** that creates architectural decision records in any context: control-plane repositories, organization repositories, WordPress plugins, WordPress themes, and more.

**Key Features:**

- 🎯 **Configuration-First Design** — All behavior driven by `.adr-config.json` (no hardcoded paths or templates)
- 📋 **4 Template Variants** — Standard, Lightweight, Security, Infrastructure
- 🔢 **Flexible Numbering** — Sequential (zero-padded), date-based, or custom patterns
- ✅ **Validation Rules** — 6 composable validators (unique titles, references, status, format, filename, metadata)
- 🔒 **Approval Workflows** — Optional CODEOWNERS or custom approver integration
- 🎨 **WordPress Support** — Custom fields for plugin/theme-specific metadata
- 🏗️ **Inheritance Model** — Org defaults + repo overrides for configuration

## Quick Start

1. **Initialize Configuration**

   ```bash
   claude adr-generator init
   ```

   Creates `.adr-config.json` in repo root with sensible defaults.

2. **Generate an ADR**

   ```bash
   claude adr-generator create "Decision about X"
   ```

   Creates `docs/adr/0001-decision-about-x.md` (path based on config).

3. **Validate ADRs**

   ```bash
   claude adr-generator validate
   ```

   Runs all configured validation rules across the ADR directory.

## Configuration

The agent is configured via `.adr-config.json` in the repository root. Configuration supports:

- **ADR Storage** — Where to store ADRs (directory path)
- **Templates** — Which template variant to use (standard, lightweight, security, infrastructure)
- **Numbering** — How to number ADRs (sequential, date-based, custom pattern)
- **Approval Workflows** — How (if at all) ADRs are approved
- **Metadata** — Required and optional frontmatter fields
- **Custom Fields** — WordPress-specific or other custom metadata
- **Validation Rules** — Which validation rules are enforced

### Configuration Inheritance

The agent follows a **two-level inheritance model**:

1. **Organization Defaults** — Org-level `.adr-config.json` (if present)
2. **Repository Overrides** — Repo-level `.adr-config.json` (repo values override org)

Both files use the same schema defined in `config/adr-config.schema.json`.

### Examples

See `examples/` for configuration templates:

- `control-plane-config.json` — LightSpeed .github control-plane setup
- `org-repo-config.json` — Standard org repository setup
- `wordpress-plugin-config.json` — WordPress plugin context
- `wordpress-theme-config.json` — WordPress theme context

## Architecture

```
agents/adr-generator/
├── adr-generator.agent.md       # Main agent specification
├── SKILL.md                      # This file (skill entrypoint)
├── config/
│   ├── adr-config.schema.json   # JSON schema (validation)
│   ├── adr-config.definitions.md # Field reference
│   └── defaults.json             # Sensible defaults
├── examples/
│   ├── control-plane-config.json
│   ├── org-repo-config.json
│   ├── wordpress-plugin-config.json
│   └── wordpress-theme-config.json
├── skills/
│   ├── adr-config-loader.md     # Config loading & validation
│   ├── adr-template-loader.md   # Template management
│   ├── adr-validators.md        # Validation rules
│   └── adr-discovery.md         # Find next ADR number
├── tests/
│   ├── config-loader.test.js
│   ├── template-loader.test.js
│   ├── validators.test.js
│   └── discovery.test.js
└── docs/
    ├── INSTALLATION.md           # Setup guide
    ├── CONFIGURATION_REFERENCE.md # All options explained
    ├── BEST_PRACTICES.md         # When & how to write ADRs
    └── ARCHITECTURE.md           # System overview
```

## Phases

### Phase 1A (Weeks 1–2) — Configuration System

- ✅ JSON schema for `.adr-config.json`
- ✅ Config loader skill with validation
- ✅ Configuration inheritance (org + repo)
- ✅ Examples for all 4 contexts
- ✅ Unit tests (>95% coverage)

### Phase 1B (Weeks 3–5) — Templates & Validation

- ✅ 4 template variants (standard, lightweight, security, infrastructure)
- ✅ 6 modular validation rules
- ✅ Template loader skill
- ✅ Validation orchestrator
- ✅ Tests (54 tests, 100% pass rate, >90% coverage)

### Phase 1C (Weeks 6–8) — Agent, Skills, Tests & Documentation

- ✅ Discovery skill (find next ADR number) — 34 tests passing
- ⏳ Core agent specification (portable, configuration-driven)
- ⏳ Registry skill (Phase 3 stub)
- ⏳ Complete Jest test suite (88 tests, target >85% overall)
- ⏳ Documentation: Installation guide, configuration reference, best practices
- ⏳ Architecture documentation with mermaid diagrams

## Related Issues

- **Epic:** #1828 — Master Initiative Epic
- **Phase 1A:** #1829 — Configuration System (Weeks 1–2)
- **Phase 1B:** #1830 — Templates & Validation (Weeks 3–5)
- **Phase 1C:** #1831 — Tests & Documentation (Weeks 6–8)

## References

- **Planning:** `.github/projects/active/adr-agent-portability-org/PHASE_1_IMPLEMENTATION_PLAN.md`
- **Decisions:** `.github/projects/active/adr-agent-portability-org/ARCHITECTURE_DECISIONS.md`
- **Specifications:** `.github/projects/active/adr-agent-portability-org/OPENSPEC.md`
- **Schema:** `agents/adr-generator/config/adr-config.schema.json`

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
