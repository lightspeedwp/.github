---
name: "WordPress Release Utilities"
description: "Manages version updates across WordPress plugins, themes, and readme files for multi-repo release automation."
file_type: "agent"
category: "release-management"
status: "active"
visibility: "public"
tags:
  - wordpress
  - release-management
  - versioning
  - plugin-management
  - theme-management
version: "v1.0"
created_date: "2026-08-01"
last_updated: "2026-08-19"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/wordpress/"
permissions:
  - read
  - write
  - wordpress-management
---

# WordPress Release Utilities Agent

## Purpose

Provide modular utilities for versioning WordPress plugins and themes, enabling seamless version management across all repository types in multi-repo release automation.

## Core Responsibilities

1. **Plugin Versioning** – Update `Version:` header in main plugin file
2. **Theme Versioning** – Update `Version:` in `style.css`
3. **Readme Versioning** – Update `Stable tag:` in `readme.txt`
4. **Component Detection** – Detect WordPress plugins, themes, and readme files
5. **Version Validation** – Ensure SemVer format compliance
6. **Version Consistency** – Detect and report version mismatches
7. **Bulk Updates** – Update all WordPress versions at once
8. **Version Bumping** – Bump versions (major, minor, patch)

## Key Features

- Plugin version header updates
- Theme version updates
- Readme version management
- Component detection and analysis
- SemVer validation
- Version consistency checking
- Bulk version updates
- Version bump support (major/minor/patch)
- Metadata extraction

## Operating Modes

**Update Mode** - Update all versions to specific version
**Bump Mode** - Bump versions (major/minor/patch)
**Detect Mode** - Detect WordPress components
**Validate Mode** - Check version consistency

## Implementation Reference

- **Folder:** `agents/wordpress/`
- **Entry Point:** [README.md](wordpress/README.md)
- **Related:** [package.json](wordpress/package.json)

---

*Generated during Phase 2 Agent Specification Audit*
