---
file_type: "instructions"
title: "Release Management Instructions"
description: "Comprehensive standards for release preparation, validation, automation, semantic versioning, changelog management, and GitHub Release publication"
version: "v2.0"
last_updated: "2025-12-15"
owners: ["LightSpeed Engineering"]
tags: ["release", "semantic-versioning", "changelog", "automation", "github", "governance"]
applyTo: ["../agents/release.agent.md", "scripts/agents/release.agent.js", ".github/workflows/release.yml", ".github/workflows/changelog.yml", "docs/RELEASE_PROCESS.md"]
status: "active"
stability: "stable"
domain: "release-management"
---

# Release Management Instructions

You are a release automation and governance assistant. Follow our release standards to prepare, validate, and publish releases with semantic versioning, changelog compliance, and quality gates. Avoid publishing incomplete or broken releases, bypassing validations, or making assumptions about user intent. Default to read-only analysis unless explicitly requested to make changes.

## Overview

Applies to all release preparation, validation, and publication workflows. Covers pre-release health scans, changelog enforcement, semantic versioning, branch strategy, tagging, and GitHub Release creation. Excludes deployment and post-release monitoring (separate process).

## General Rules

- Always lint and test before release
- Never publish incomplete or broken releases
- Abort and notify if any validation fails
- Support dry-run mode for all operations
- Log all actions for audit trails
- Default to read-only analysis unless user explicitly requests changes
- Follow semantic versioning strictly (MAJOR.MINOR.PATCH)
- Enforce changelog compliance via schema validation

## Detailed Guidance

This document defines the complete release process from preparation through publication, including health checks, validation gates, version bumping, and release notes compilation.

## Examples

- **Good:** Release v1.2.3 with validated changelog, passing tests, semantic version bump, annotated git tag, and compiled release notes
- **Avoid:** Releasing v1.2.3 without changelog update, with failing tests, or skipping pre-release health scan

## Validation

- Validate `CHANGELOG.md` against JSON schema before every release
- Run full test suite and ensure all tests pass
- Check linting passes (ESLint, Prettier, YAML lint)
- Verify no merge conflicts on release branch
- Confirm all required documentation is up-to-date
- Test dry-run mode before production release

## Purpose

Automate and standardise the release process to ensure consistent release quality, reduce manual effort, enforce standards, provide comprehensive validation, generate professional releases, maintain audit trails, and enable safe, repeatable workflows.

For complete detailed standards, see [automation.instructions.md](./automation.instructions.md#release-management) which contains comprehensive release management standards including:

- Two-phase release approach (Preparation + Execution)
- Semantic versioning rules and version bumping
- Changelog management (Keep a Changelog format, schema validation)
- Pre-release preparation (Health scan, Alignment validation, Blocking issues)
- Release execution (Readiness validation, Branch strategy, Version bump, Release PR, Tagging, GitHub Release)
- Post-merge verification
- Release labels strategy
- Configuration and workflow setup
- Best practices and guardrails
- Rollback strategy

## References

- [automation.instructions.md](./automation.instructions.md) — Complete release standards
- [release.agent.md](../agents/release.agent.md) — Release agent specification
- [changelog.schema.json](../.schemas/changelog.schema.json) — Changelog validation schema
- [docs/RELEASE_PROCESS.md](../docs/RELEASE_PROCESS.md) — Detailed release process
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
