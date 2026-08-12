---
name: adr-config-loader
description: Load, validate, and merge ADR configuration from files with inheritance support
category: infrastructure
tags:
  - configuration
  - validation
  - inheritance
  - schema
file_type: skill
created_date: 2026-08-12
last_updated: 2026-08-12
owners:
  - LightSpeed Team
status: active
stability: beta
domain: infrastructure
language: en
---

# ADR Config Loader Skill

Load, validate, and merge ADR configuration from `.adr-config.json` files with support for configuration inheritance (org defaults + repo overrides).

## Overview

The config loader provides:

- **Schema Validation** — Validates configuration against JSON schema
- **Configuration Inheritance** — Two-level inheritance (org defaults + repo overrides)
- **Error Handling** — Comprehensive error messages for invalid configs
- **Type Safety** — Ensures all config values are correct types
- **Defaults** — Sensible defaults when fields are omitted

## API

### `loadConfig(searchPath, options)`

Load and validate configuration, starting from `searchPath` and walking up directory tree.

**Parameters:**

- `searchPath` (string) — Directory to start searching from (typically repo root)
- `options` (object, optional)
  - `orgConfigPath` (string) — Path to organization-level config (optional)
  - `strict` (boolean) — If true, reject unknown properties (default: false)
  - `debug` (boolean) — If true, log debug information (default: false)

**Returns:**

```javascript
{
  adr: { ... },
  source: {
    orgConfig: boolean,
    repoConfig: boolean,
    merged: boolean
  },
  errors: []
}
```

**Throws:**

- `ConfigNotFoundError` — No `.adr-config.json` found
- `ConfigInvalidError` — Configuration fails schema validation
- `ConfigParseError` — JSON parse error in config file

## Configuration Inheritance

The loader follows a two-level inheritance model:

1. **Organization Defaults** — `.adr-config.json` at org level (optional)
2. **Repository Overrides** — `.adr-config.json` at repo root (required)

**Merge Rules:**

- If both exist: repo values override org values (recursive merge)
- If only repo exists: use repo config
- If only org exists: use org config
- If neither exist: throw `ConfigNotFoundError`

## Testing

The config loader includes comprehensive unit tests covering:

- Schema validation (valid/invalid configs)
- Configuration inheritance (org + repo merging)
- File loading (found/not found, parse errors)
- Error handling (detailed error messages)
- Edge cases (empty fields, minimal configs, all optional fields)

**Test Coverage:** >95%

## References

- **Schema:** `config/adr-config.schema.json`
- **Definitions:** `config/adr-config.definitions.md`
- **Defaults:** `config/defaults.json`
- **Tests:** `tests/config-loader.test.js`
- **Examples:** `examples/*.json`
