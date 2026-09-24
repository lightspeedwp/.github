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

## Qodo PR-Agent integration

[Qodo PR-Agent](../../docs/QODO_PR_AGENT.md) is an optional input to this asset. It is the third-party tool, not the internal `agents/pr-agent/`. The full map of integrations is in the [responsibility matrix](../../.github/specs/017-qodo-pr-agent-integration/contracts/responsibility-matrix.md).

- **Invocation**: pr-comment (the proposal a maintainer requests with `/update_changelog`) or [`skills/qodo-pr-agent`](../../skills/qodo-pr-agent/SKILL.md) with `update_changelog`.
- **On output**: Validate the proposal against the changelog rules: at most 250 characters, user-facing, no implementation detail, linked to a PR or issue, and in a Keep a Changelog category. Reject it and name the failing rule if it fails. Qodo PR-Agent never commits the entry.
- **Fallback**: The existing changelog flow applies unchanged. When the skill returns `skipped` or `error`, say `Qodo PR-Agent input skipped: <reason>` in this asset's own output.

## Implementation Reference

- **Folder:** `agents/changelog/`
- **Entry Point:** [README.md](changelog/README.md)
- **Related:** [package.json](changelog/package.json)

---

*Generated during Phase 2 Agent Specification Audit*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
