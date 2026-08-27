---
file_type: documentation
title: plugin-integrity-checker Hook
description: Validates a plugin's four provider manifests and that referenced agent/skill files resolve.
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

# plugin-integrity-checker

Validates a plugin's four provider manifests and that referenced agent/skill files resolve.

## Triggers

pre-commit, pre-push

## Usage

```bash
node hooks/plugin-integrity-checker/index.js <path>
```

Programmatic:

```js
const hook = require("./hooks/plugin-integrity-checker");
const { valid, errors, warnings } = hook.validate("<path>");
```

Returns `{ valid: boolean, errors: string[], warnings: string[] }`. Exit code is
`1` when `valid` is `false`. Tests live in `__tests__/`.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

[🔗 Website](https://lightspeedwp.agency) · [📧 Contact](https://lightspeedwp.agency/contact) · [👥 Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.
