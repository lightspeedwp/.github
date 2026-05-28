---
title: "Gemini Canonical Reference"
description: "Authoritative Gemini-specific guidance and pointers for LightSpeed repositories."
version: "v1.0.0"
last_updated: "2026-05-28"
file_type: "documentation"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team"]
license: "GPL-3.0"
tags: ["ai", "gemini", "agents", "governance"]
domain: "governance"
stability: "stable"
---

# Gemini Canonical Reference

This document is the canonical Gemini-specific entry point.

## Core References

- [AGENTS.md](../AGENTS.md) - global AI rules and contribution standards.
- [Custom instructions](../.github/custom-instructions.md) - repo-local
  operating constraints.
- [Model recommendation prompt](../.github/prompts/model-recommendation.prompt.md)
  - legacy reference for model selection and migration notes.

## Usage Notes

- Follow `AGENTS.md` as the baseline for all Gemini-authored changes.
- Keep repo-native governance changes in `.github/` and reusable assets in top
  level portable folders.
- Treat prompt-library model notes as secondary guidance, not canonical policy.
