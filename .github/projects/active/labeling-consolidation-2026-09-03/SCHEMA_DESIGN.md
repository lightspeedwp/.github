---
file_type: documentation
title: "Label Schema Design — Detailed Specifications"
description: "Comprehensive design for label schema structure, validation, metadata, cross-repo consistency rules, and examples"
created_date: 2026-09-03
last_updated: 2026-09-03
status: complete
tags:
  - schema
  - design
  - validation
  - labeling
  - consolidation
---

# Label Schema Design

**Status:** ✅ Complete (Phase 2 Deliverable)  
**Owner:** Task-Planner Agent  
**Version:** 1.0.0  

## Executive Summary

This document provides detailed technical specification for the **unified label schema** that serves as the foundation for the consolidated labeling system. The design maintains the existing flat YAML structure for GitHub compatibility while adding JSON Schema validation, metadata for automation, and cross-repo consistency rules.

**Key Decisions (from Research Finding Q7):**
- Keep flat structure: Proven, GitHub-native, simple to manage
- Add JSON Schema validation: Enforce structure programmatically
- Enhance with metadata: Enable intelligent automation
- Defer nested hierarchies: Evaluate in Phase 3 if needed

---

## Current Schema Analysis

### Existing Structure (labels.yml)

**Current Statistics:**
- Total Labels: 158 canonical labels
- Families: 10 families (type, status, priority, area, comp, lang, release, meta, ai-ops, etc.)
- File Size: ~704 lines of YAML
- Last Updated: 2026-06-01

**Current Fields Per Label:**
```yaml
- name: type:bug              # Label name with family prefix
  color: d73a49               # Hex color (no #)
  description: "Bug report"   # Human-readable description
```

---

## Proposed Schema Structure (v2.0)

### Enhanced YAML Schema

The proposed schema adds metadata fields while maintaining backward compatibility:

**Metadata Categories:**

1. **Automation Fields:**
   - `usage_pattern`: How typically applied (automatic/manual/mixed)
   - `automation_rules`: Conditions for auto-application with confidence scores
   - `aliases`: Bare label mappings for auto-correction

2. **Constraint Fields:**
   - `one_hot_family`: Family with one-label-only constraint
   - `incompatible_with`: Labels that conflict
   - `requires`: Labels that must accompany this
   - `forbids`: Labels that must not appear together

3. **Workflow Fields (for status labels):**
   - `valid_transitions`: State machine transitions
   - `terminal`: Whether this is an end state

4. **Governance Fields:**
   - `enforces_policy`: Policy name this enforces
   - `requires_approval`: Needs explicit approval
   - `requires_evidence`: Proof/documentation needed

5. **UI & Display Fields:**
   - `category`: UI grouping category
   - `searchable`: Include in label search
   - `default_priority`: Default priority level

---

## JSON Schema Validation

### Schema Definition (Excerpt)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["schema_version", "labels"],
  "properties": {
    "schema_version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+$"
    },
    "labels": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "family", "color", "description"],
        "properties": {
          "name": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9]*(?::[a-z0-9-]+)*$"
          },
          "color": {
            "type": "string",
            "pattern": "^[0-9A-Fa-f]{6}$"
          },
          "one_hot_family": {
            "type": ["string", "null"],
            "enum": ["type", "status", "priority", null]
          }
        }
      }
    }
  }
}
```

### Validation Process

**Runtime Validation (Every Load):**

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

// Load schema
const labelSchema = require('./schema.json');

// Validate labels.yml
const valid = ajv.validate(labelSchema, labelsYaml);
if (!valid) {
  const errors = ajv.errorsText();
  throw new ValidationError(`Schema validation failed: ${errors}`);
}
```

---

## Cross-Repo Consistency Rules

### Canonical vs. Extensible Labels

**Canonical Labels (Org-Wide, Mandatory):**
- All `type:*` labels (33 types)
- All `status:*` labels (20 statuses)
- All `priority:*` labels (4 priorities)
- All `meta:*` labels (governance)

**Extensible Labels (Can Customize Per Repo):**
- Additional `area:*` labels (custom domains)
- Custom `comp:*` labels (component-specific)
- Custom `env:*` labels (environment-specific)

**Never Extensible:**
- `type:*` — Types are universal
- `status:*` — Workflow states must be consistent
- `priority:*` — Urgency assessment must be uniform
- `meta:*` — Governance labels are non-negotiable

### Per-Repo Extension Mechanism

**File:** `.github/labeler-extensions.yml` (optional per repo)

```yaml
repo_config:
  name: plugin-woocommerce-integration
  parent_org: lightspeedwp
  inherit_canonical: true
  
  custom_areas:
    - name: area:woocommerce
      color: 9e9e9e
      description: "WooCommerce integration"
    - name: area:payment-gateway
      color: 757575
      description: "Payment gateway integration"
  
  validation:
    enforce_canonical: true
    allow_custom_areas: true
    allow_custom_meta: false  # Never allow custom meta labels
```

---

## Implementation Roadmap

### Phase 1: Current → Schema 1.0 (Week of Sept 3)

- [ ] Expand labels.yml with metadata fields
- [ ] Create schema.json with JSON Schema validation
- [ ] Implement schema validation in CI
- [ ] Migrate existing labels with automation rules

### Phase 2: Schema Evolution (Phase 4, during implementation)

- [ ] Add support for custom families
- [ ] Implement label versioning
- [ ] Add label deprecation mechanism
- [ ] Add label dependency resolution

### Phase 3: Nested Hierarchy Evaluation (Phase 6+)

**Only if:**
- Label count > 300 (currently 158)
- Automated tools require hierarchy
- Organization requests semantic organization

---

**Status:** ✅ COMPLETE (Phase 2 Deliverable)  
**Version:** 1.0.0  
**Last Updated:** 2026-09-03  
**Maintained By:** Task-Planner Agent
