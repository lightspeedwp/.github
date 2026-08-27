---
file_type: "index"
title: "Portable Agents"
description: "Ownership index for portable LightSpeed AI agent specifications."
version: "v0.2.0"
last_updated: "2026-05-26"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["agents", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
---

# Portable Agents

This folder owns reusable agent specifications that can be packaged into
LightSpeed AI plugins or installed into other repositories.

## Ownership

- Owns portable agent specs that avoid `.github`-relative assumptions.
- Does not own repo-maintenance agents that only operate on this `.github`
  repository.
- Keeps runtime code out of this folder until a later migration issue defines
  the implementation model.

## Structure

| Path | Purpose |
| --- | --- |
| `agents/<agent-id>.agent.md` | Portable agent specification. |
| `agents/agent.md` | Portable agent specification index. |
| `agents/<agent-id>/` | Future home for a larger portable agent package, if needed. |
| `agents/README.md` | This ownership index. |
