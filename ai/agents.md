---
title: "AI Agents Canonical Reference"
description: "Authoritative index for LightSpeed AI agent governance and implementation sources."
version: "v1.0.0"
last_updated: "2026-05-28"
file_type: "documentation"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team"]
license: "GPL-3.0"
tags: ["ai", "agents", "governance", "automation"]
domain: "governance"
stability: "stable"
---

# AI Agents Canonical Reference

This file is the canonical AI agents index for the LightSpeed `.github` control
plane.

## Primary Sources

- [AGENTS.md](../AGENTS.md) - organisation-wide AI rules and coding standards.
- [Main agent index](../agents/agent.md) - portable agent specs.
- [Repo-local custom instructions](../.github/custom-instructions.md) -
  maintenance boundaries for this repository.

## Agent Source-of-Truth Policy

- Global governance and behaviour rules belong in `AGENTS.md`.
- Reusable agent specs belong in `agents/`.
- Repo-local operational instructions belong in `.github/instructions/` and
  `.github/custom-instructions.md`.
- Legacy `.github/agents/` content is transitional and should not become the
  long-term canonical source for reusable specs.

## Related Canonical AI Docs

- [Claude](./Claude.md)
- [Gemini](./Gemini.md)
- [Runners](./RUNNERS.md)
