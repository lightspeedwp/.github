---
file_type: "index"
title: "Portable Hooks"
description: "Ownership index for safe portable hooks, guardrails, and tool adapters."
version: "v0.2.0"
last_updated: "2026-05-26"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["hooks", "guardrails", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
---

# Portable Hooks

This folder owns portable hooks, guardrails, and adapters that help AI tools
run safer checks before or after agent actions.

## Structure

| Path | Purpose |
| --- | --- |
| `hooks/<hook-id>/README.md` | Hook purpose, inputs, outputs, and safety behaviour. |
| `hooks/<hook-id>/` | Hook implementation, tests, fixtures, and adapter files. |
| `hooks/README.md` | This ownership index. |
