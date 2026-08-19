---
name: linting-agent
description: Linting agent entry under agents root with runtime implementation in scripts/agents.
---

# Linting Agent

This folder exists to keep the linting agent discoverable under the top-level `agents/` namespace.

## Runtime

- Script: `scripts/agents/linting.agent.js`
- Unit tests: `scripts/agents/__tests__/linting.agent.test.js`
- Integration tests: `scripts/agents/__tests__/linting-agent/integration/*.integration.test.js`

## Notes

- Runtime scripts stay in `scripts/` per repository policy.
- Tests stay in `__tests__/` folders relevant to the script location.
