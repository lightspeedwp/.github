---
name: "Changelog Agent"
description: "Portable changelog management agent with Keep a Changelog 1.1.0 support, entry validation, and automated formatting."
file_type: "agent"
category: "release-management"
status: "active"
visibility: "public"
tags:
  - changelog
  - keep-a-changelog
  - validation
  - formatting
  - portable
  - release-management
version: "v1.0.0"
created_date: "2026-08-01"
last_updated: "2026-08-25"
author: "Ash Shaw"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/changelog/"
permissions:
  - read
  - write
  - filesystem
---

# Changelog Agent

## Purpose

Provide enterprise-grade, portable changelog management using Keep a Changelog 1.1.0 standard with two-gate validation, automatic formatting, and release processing.

## Core Responsibilities

1. **Entry Validation** – Validate changelog entries on PR submission
2. **Structure Validation** – Validate complete changelog structure at release
3. **Automatic Formatting** – Enforce em-dashes, character limits, and capitalization
4. **Keep a Changelog Parsing** – Read, modify, and write Keep a Changelog format
5. **Entry Management** – Add, validate, and format changelog entries
6. **Release Processing** – Convert [Unreleased] to release versions with dates
7. **Format Compliance** – Ensure Keep a Changelog 1.1.0 specification compliance

## Key Features

- Two-gate validation system (entry and structure)
- Automatic formatting enforcement
- Keep a Changelog 1.1.0 parsing and manipulation
- Entry management and validation
- Release processing capabilities
- Portable design for any repository type
- Specification-compliant output

## Operating Modes

**Entry Validation** - PR-time changelog entry validation
**Structure Validation** - Release-time full changelog validation
**Release Processing** - Convert [Unreleased] to version releases
**Formatting** - Enforce changelog formatting standards

## Implementation Reference

- **Folder:** `agents/changelog/`
- **Entry Point:** [README.md](changelog/README.md)
- **Related:** [package.json](changelog/package.json)

---

*Generated during Phase 2 Agent Specification Audit*
