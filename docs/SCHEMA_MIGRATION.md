---
file_type: documentation
title: Schema Consolidation Migration Guide
description: Path updates for the Phase 2 schema consolidation (2026-08-11)
version: '1.0'
last_updated: '2026-08-18'
status: active
owners:
  - LightSpeedWP Maintainers
tags:
  - schema
  - consolidation
  - migration
  - documentation
---

# Schema Consolidation Migration Guide

**Date:** 2026-08-11  
**Phase:** Phase 2 — Schema Consolidation & Validation  
**Status:** ✅ Complete

---

## What Changed

### Schema Folder Consolidation

The repository has consolidated all JSON schemas into a single location:

| Old Location | New Location | Status |
|---|---|---|
| `.schemas/` | `schemas/` | ✅ Consolidated |
| `schema/` | `schemas/` | ✅ Consolidated |
| `.github/schemas/` | (removed) | ✅ Removed |

### Files Consolidated

All 26 portable JSON schemas are now in `schemas/`:

- **17 core schemas** — frontmatter, agent-config, changelog, etc.
- **5 memory schemas** — in `schemas/memory/` subdirectory
- **2 example schemas** — in `schemas/examples/` subdirectory
- **1 registry** — schema-registry.json
- **1 documentation** — agent-config.example.md

---

## Updated Path References

### For Script References

If your scripts reference schemas, update the paths:

**OLD PATTERN:**

```javascript
path.join(__dirname, '../../.schemas/')
path.join(__dirname, '../../schema/')
require('../../.schemas/frontmatter.schema.json')
import schema from '../../schema/agent-config.schema.json'
```

**NEW PATTERN:**

```javascript
path.join(__dirname, '../../../schemas/')
path.join(__dirname, '../../../schemas/')
require('../../../schemas/frontmatter.schema.json')
import schema from '../../../schemas/agent-config.schema.json'
```

### Path Depth by Location

**Portable scripts (in root `scripts/` folder):**

- From `scripts/validation/` → `../../../schemas/`
- From `scripts/agents/` → `../../../../schemas/`
- From `scripts/workflows/` → `../../../../schemas/`

**Control-plane scripts (in `.github/scripts/` folder):**

- From `.github/scripts/validation/` → `../../../schemas/`
- From `.github/scripts/agents/` → `../../schemas/`
- From `.github/scripts/workflows/` → `../../../schemas/`

### For Import Statements

```javascript
// OLD
const schema = require('../../.schemas/frontmatter.schema.json');
const agentSchema = require('../../schema/agent-config.schema.json');

// NEW
const schema = require('../../../schemas/frontmatter.schema.json');
const agentSchema = require('../../../schemas/agent-config.schema.json');
```

---

## Removed Directories

The following directories have been removed after confirming consolidation:

### `.github/schemas/` — Removed ✅

- **Reason:** Control-plane schemas marker folder (minimal content, only README)
- **Alternative:** Use `schemas/` at repo root
- **Confirmed:** All 26 portable schemas present in `schemas/`

### `schema/` — Removed ✅

- **Reason:** Legacy duplicate folder from pre-consolidation structure
- **Alternative:** Use `schemas/` at repo root  
- **Confirmed:** All 26 portable schemas present in `schemas/`

---

## Validation & Testing

All validation scripts have been updated and tested:

✅ `npm run validate:json` — JSON schema validation  
✅ `npm run validate:frontmatter` — Frontmatter validation  
✅ `npm run validate:agents` — Agent spec validation  
✅ `npm run validate:plugins` — Plugin manifest validation  
✅ `npm test` — Full test suite

---

## Timeline & Grace Period

**Completion Date:** 2026-08-11  
**Phase 2 Status:** ✅ Complete  
**Next Phase:** Phase 3 — VSCode Workspace Setup

The `schema/` legacy directory has been removed. The `.schemas/` directory still exists in the repository for backward compatibility, but `schemas/` is the canonical portable location going forward.

---

## If You Have Old References

If you see references to `.schemas/` or `schema/` in your code:

1. **Check file location** — Determine the directory depth
2. **Count levels up** — Use the path depth table above
3. **Update import** — Replace with `../...../schemas/`
4. **Test** — Run validation scripts to confirm

Example for `.github/scripts/validation/validate-frontmatter.js`:

```javascript
// OLD: path.join(__dirname, '../../.schemas/')
// NEW: path.join(__dirname, '../../../schemas/')
```

---

## Questions?

See:

- **CLAUDE.md** — Repository boundaries and folder organization
- **schemas/README.md** — Schema inventory and organization
- **Repository Restructuring Project** — `.github/projects/active/repo-restructuring-2026-07-25/`

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
