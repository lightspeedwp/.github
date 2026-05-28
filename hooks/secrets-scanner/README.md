---
file_type: "hook"
title: "secrets-scanner hook"
description: "Scans changed files for likely secrets before commit or release workflows."
version: "v0.1.0"
last_updated: "2026-05-28"
owners: ["LightSpeedWP Team"]
---

# secrets-scanner hook

## Purpose

Run lightweight secret detection on staged or changed files.

## Inputs

- File list
- Diff content

## Outputs

- pass
- findings with file and line hints
