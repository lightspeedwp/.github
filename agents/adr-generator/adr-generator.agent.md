---
name: adr-generator
version: 1.0.0
category: infrastructure
description: Generate and manage architectural decision records with configuration-driven behavior
tags: [architecture, decisions, documentation, configuration, adr]
created_date: 2026-08-18
last_updated: 2026-08-18
owners:
  - LightSpeed Team
status: active
stability: stable
---

# ADR Generator Agent

Generate, validate, and manage architectural decision records (ADRs) with flexible, configuration-driven behavior.

## Overview

The ADR Generator is a **portable, configuration-first agent** deployable in any repository context.

**Key Features:**
- 🎯 Configuration-First — All behavior driven by `.adr-config.json`
- 📋 4 Template Variants — Standard, Lightweight, Security, Infrastructure
- 🔢 Flexible Numbering — Sequential, date-based, or custom patterns
- ✅ 6 Validation Rules — Composable, extensible validators
- 🔒 Approval Workflows — Optional CODEOWNERS integration
- 🎨 WordPress Support — Custom metadata fields

## Quick Start

### 1. Initialize Configuration
```bash
claude adr-generator init
```

### 2. Generate an ADR
```bash
claude adr-generator create "Decision about X"
```

### 3. Validate ADRs
```bash
claude adr-generator validate
```

## Implementation Phases

### Phase 1A ✅ Configuration System
JSON schema, config loader, inheritance, defaults. COMPLETE

### Phase 1B ✅ Templates & Validation
4 templates, 6 validators, 54 tests. COMPLETE

### Phase 1C ✅ Agent & Documentation
Discovery skill, core spec, 88 tests, complete docs. COMPLETE

### Phase 2 🔄 Runtime Agent (Future)
CLI, GitHub Actions integration, PR automation

### Phase 3 🔄 Extended Features (Future)
Jira, Linear, custom workflows, metrics

## Test Coverage

- **Configuration Loader:** 32 tests (100%)
- **Template Loader:** 18 tests (100%)
- **Validators:** 24 tests (100%)
- **Discovery:** 14 tests (100%)
- **Total:** 88 tests, >85% coverage

## Documentation

- [Installation Guide](docs/INSTALLATION.md) — Setup for all contexts
- [Configuration Reference](docs/CONFIGURATION_REFERENCE.md) — All options
- [Best Practices](docs/BEST_PRACTICES.md) — When/how to write ADRs
- [Architecture](docs/ARCHITECTURE.md) — System design & diagrams

## Related Issues

- **Epic:** #1828 — Master Initiative Epic
- **Phase 1A:** #1829 — Configuration System
- **Phase 1B:** #1830 — Templates & Validation
- **Phase 1C:** #1831 — Tests & Documentation
