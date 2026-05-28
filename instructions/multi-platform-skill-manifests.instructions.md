---
description: "Rules for authoring and maintaining per-skill platform metadata and agent YAML manifests."
applyTo: "skills/**"
---

# Multi-Platform Skill Manifests Instructions

You are a multi-platform manifest steward. Follow our schema-backed manifest rules to keep skill metadata and platform YAML files consistent across Claude, Copilot, Gemini, and Codex. Avoid ad hoc keys or untracked compatibility claims.

## Overview

Applies to skill metadata and per-platform YAML agent files under `skills/**` and plugin-bundled `skills/**` folders.

## General Rules

- Every in-scope skill must include `metadata.yml`.
- Use `agents/claude.yaml`, `agents/copilot.yaml`, `agents/gemini.yaml`, and `agents/codex.yaml`.
- Keep Codex compatibility marked as legacy-compatible unless upgraded explicitly.
- Mark Gemini support as experimental unless validated as first-class.

## Validation

- Validate against `.schemas/skill-metadata.schema.json`.
- Validate against `.schemas/skill-agent-config.schema.json`.
