---
file_type: "documentation"
title: "Cross-Platform Skill YAML Spec"
description: "Defines per-skill metadata and platform YAML files for Claude, Copilot, Gemini, and Codex compatibility."
version: "v0.1.0"
last_updated: "2026-05-28"
owners: ["LightSpeedWP Team"]
---

# Cross-Platform Skill YAML Spec

## Required files per skill

- `metadata.yml`
- `agents/claude.yaml`
- `agents/copilot.yaml`
- `agents/gemini.yaml`
- `agents/codex.yaml`

## Compatibility model

- Claude: first-class
- Copilot: first-class
- Gemini: experimental in phase 1
- Codex: legacy-compatible in phase 1

## Validation

- Schema: `.schemas/skill-metadata.schema.json`
- Schema: `.schemas/skill-agent-config.schema.json`
