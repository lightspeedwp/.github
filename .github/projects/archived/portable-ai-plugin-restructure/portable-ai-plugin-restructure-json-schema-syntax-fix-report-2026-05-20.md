---
title: "Portable AI Plugin Restructure JSON Schema Syntax Fix Report"
description: "Issue #311 report for fixing invalid JSON syntax in active schema files before the validator reset."
version: "v0.1.0"
last_updated: "2026-05-20"
file_type: "project-report"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["maintenance", "json-schema", "validation", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "portable-ai-plugin-restructure-baseline-report-2026-05-15.md"
    description: "Baseline report documenting the original schema syntax failure."
  - path: "issues/children/batch-05-validation-reset/05-01-maintenance-fix-invalid-json-schema-syntax.md"
    description: "GitHub issue #311 local source draft."
---

# Portable AI Plugin Restructure JSON Schema Syntax Fix Report

Parent epic: #285. Child issue: #311.

## Summary

The strict JSON syntax failure in `.github/schemas/project-fields.schema.json`
has been fixed without changing schema intent.

## Root Cause

The schema contained a JavaScript-style inline comment inside
`patternProperties`:

```json
"^[A-Za-z0-9_]+$": {  // keys like "product_dev", "client_services"
```

JSON does not allow comments, so strict parsing failed before the validator
reset could proceed.

## Fix

The inline comment was converted into a valid JSON Schema `description` field:

```json
"description": "Project field archetype keyed by values such as product_dev or client_services."
```

This preserves the explanatory meaning while keeping the file valid JSON.

## Validation Evidence

- Direct `JSON.parse` check across `.github/schemas/*.json`: all five files
  parse successfully.
- Read-only schema validation command:
  `node scripts/validation/validate-json.js --glob '.github/schemas/**/*.schema.json' --validate-only --strict --read-only --report-dir .github/tmp`
- Validator result: 4 schema files found, 4 syntax-valid, 0 invalid.

## Dependency Note

The first `npm ci` attempt hung in the `puppeteer` postinstall step and was
stopped. Dependencies were then installed with `npm ci --ignore-scripts`, which
provided the validator dependencies without running heavyweight postinstall
downloads. This keeps #311 focused on JSON syntax; #312 still owns the broader
validation-command split.

## Acceptance Criteria Status

- [x] Schema files that fail strict JSON parsing are identified.
- [x] Invalid comments are converted to valid schema descriptions.
- [x] Active schema files parse as valid JSON.
- [x] Replacement read-only schema check no longer fails on syntax.
- [x] No schema meaning is lost without documentation.
