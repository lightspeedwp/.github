---
file_type: "documentation"
title: "Plugin Installation Guide"
description: "Guide for installing LightSpeed portable plugin packs across Claude, Codex, Copilot, and Gemini."
version: "v0.1.0"
last_updated: "2026-05-28"
owners: ["LightSpeedWP Team"]
---

# Plugin Installation Guide

## Supported packs

- `plugins/lightspeed-github-ops`
- `plugins/lightspeed-wordpress-planning`
- `plugins/lightspeed-wordpress-governance`
- `plugins/lightspeed-release-ops`
- `plugins/lightspeed-quality-assurance`
- `plugins/lightspeed-metrics-and-reporting`

## Generic install flow

1. Select plugin folder.
2. Load platform manifest for your tool.
3. Confirm referenced files exist under plugin root.
4. Run validation scripts before rollout.

## Validation commands

- `npm run validate:plugins`
- `npm run validate:skill-manifests`
- `npm run lint:yaml`
- `npm run lint:md`

## Current rollout note

- All active packs now include specialized skills with strict per-platform manifest parity.
- Use `skills/SKILL_REGISTRY.json` scopes (`phase1PlatformYamlScope`, `batch2PlatformYamlScope`, `batch3PlatformYamlScope`, `batch4PlatformYamlScope`, `batch5PlatformYamlScope`, `batch6PlatformYamlScope`) for staged validation and rollout.
