---
file_type: documentation
title: agent-spec-validator Hook
description: Validates agent AGENT.md YAML frontmatter for required multi-provider fields and value formats.
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

# agent-spec-validator

Validates agent AGENT.md YAML frontmatter for required multi-provider fields and value formats.

## Triggers

pre-commit, pre-push

## Usage

```bash
node hooks/agent-spec-validator/index.js <path>
```

Programmatic:

```js
const hook = require("./hooks/agent-spec-validator");
const { valid, errors, warnings } = hook.validate("<path>");
```

Returns `{ valid: boolean, errors: string[], warnings: string[] }`. Exit code is
`1` when `valid` is `false`. Tests live in `__tests__/`.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

[🔗 Website](https://lightspeedwp.agency) · [📧 Contact](https://lightspeedwp.agency/contact) · [👥 Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.
