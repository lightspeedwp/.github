---
file_type: "recipe"
title: "WordPress Plugin Checklist"
description: "Checklist for shipping a WordPress block-first plugin with LightSpeed governance, security, and quality controls."
version: "v0.1.0"
last_updated: "2026-05-28"
owners: ["LightSpeedWP Team"]
---

# WordPress Plugin Checklist

## Scope

Use this checklist before releasing a WordPress plugin pack.

## Checklist

- Confirm `block.json` is authoritative for each block.
- Validate sanitisation, escaping, and capability checks.
- Verify accessibility and keyboard interaction flows.
- Run lint, tests, and plugin validation scripts.
- Ensure plugin manifests include supported platform targets.
- Document installation and rollback instructions.
