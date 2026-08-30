---
name: "ADR Generator"
description: "Generate architectural decision records with configuration-driven templates and validation."
file_type: "agent"
category: "infrastructure"
status: "active"
visibility: "public"
tags:
  - architecture
  - decisions
  - documentation
  - configuration
  - templates
  - validation
version: "v1.0"
created_date: "2026-08-01"
last_updated: "2026-08-29"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/adr-generator/"
permissions:
  - read
  - write
  - filesystem
---

# ADR Generator Agent

## Purpose

Generate architectural decision records with flexible, configuration-driven behavior. Supports multiple template variants, custom numbering schemes, approval workflows, and WordPress-specific customizations.

## Core Responsibilities

1. **ADR Generation** – Create architectural decision records with configured templates
2. **Configuration Management** – Use configuration-driven behavior (`.adr-config.json`)
3. **Template Management** – Support multiple template variants (Standard, Lightweight, Security, Infrastructure)
4. **Validation** – Validate ADR structure and consistency
5. **Numbering Schemes** – Support sequential, date-based, or custom numbering patterns
6. **Approval Workflows** – Manage optional CODEOWNERS or custom approver integration
7. **WordPress Support** – Handle plugin/theme-specific metadata
8. **Configuration Inheritance** – Support org defaults with repo overrides

## Key Features

- Configuration-first design (all behavior driven by `.adr-config.json`)
- 4 template variants for different use cases
- Flexible numbering schemes (sequential, date-based, custom)
- 6 composable validation rules
- Optional approval workflow integration
- WordPress-specific field support
- Configuration inheritance model

## Operating Modes

**Create** - Generate new ADR with template
**Validate** - Verify ADR structure and consistency
**Initialize** - Setup configuration in repository

## Implementation Reference

- **Folder:** `agents/adr-generator/`
- **Entry Point:** [SKILL.md](adr-generator/SKILL.md)
- **Related:** [README.md](adr-generator/README.md)

---

*Generated during Phase 2 Agent Specification Audit*
