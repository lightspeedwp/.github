---
file_type: documentation
title: multi-provider-consistency-checker Hook
description: Detects divergences across an agent's Claude, Copilot, and OpenAI provider configurations.
version: v0.1.0
last_updated: '2026-07-22'
owners:
  - lightspeedwp/maintainers
domain: governance
tags:
  - hooks
  - agents
  - validation
---

# multi-provider-consistency-checker

Detects divergences across an agent's Claude, Copilot, and OpenAI provider configurations.

## Triggers

pre-commit, pre-push

## Usage

```bash
node hooks/multi-provider-consistency-checker/index.js <path>
```

Programmatic:

```js
const hook = require("./hooks/multi-provider-consistency-checker");
const { valid, errors, warnings } = hook.validate("<path>");
```

Returns `{ valid: boolean, errors: string[], warnings: string[] }`. Exit code is
`1` when `valid` is `false`. Tests live in `__tests__/`.
