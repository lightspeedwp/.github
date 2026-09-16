# Data Model: Specification Catalog & Quality Framework

**Date**: 2026-09-16 | **Specification**: [013-spec-folder-refactor/spec.md](./spec.md)

## Overview

This document defines the data structures and relationships for the SpecKit folder organization system, including specification metadata, quality dimensions, and audit results.

## Core Entities

### 1. Specification

**Entity Name**: `Specification`  
**Location**: `.github/specs/{NNN}-{slug}/spec.md`  
**Purpose**: Governance document defining requirements, user scenarios, success criteria, and assumptions

**Fields**:

| Field | Type | Required | Example | Constraints |
|-------|------|----------|---------|-------------|
| `number` | String (3-digit) | Yes | "013" | Format: `[0-9]{3}`, must be unique, immutable |
| `title` | String | Yes | "SpecKit Folder Organization Refactoring & Quality Audit" | Max 150 chars, descriptive |
| `slug` | String | Yes | "spec-folder-refactor" | Format: lowercase, hyphens, no special chars |
| `folder_path` | String | Yes | `.github/specs/013-spec-folder-refactor/` | Format: `.github/specs/{NNN}-{slug}/` |
| `spec_file` | String | Yes | `.github/specs/013-spec-folder-refactor/spec.md` | Always `{folder_path}/spec.md` |
| `status` | Enum | Yes | "Draft" | Values: Draft, Active, Complete, Archived, Deprecated |
| `created_date` | Date | Yes | 2026-09-16 | ISO 8601 format |
| `updated_date` | Date | Yes | 2026-09-16 | ISO 8601 format; updates on any change |
| `phase` | Enum | Yes | "Clarified" | Values: Draft, Clarified, Planned, TasksGenerated, InProgress, Complete |
| `description` | String | Yes | "Audit .github/specs/ structure, create catalog, audit quality across all specs" | Purpose summary |

**Relationships**:

- `has_many` → `SpecificationFile` (spec.md, checklists/*, research.md, plan.md, data-model.md, etc.)
- `has_many` → `QualityDimension` (8 dimensions evaluated per spec)
- `has_many` → `Assumption` (assumptions documented in spec)
- `has_one` → `SpecificationChecklist` (quality validation checklist)

**State Transitions**:

```
Draft → Clarified → Planned → TasksGenerated → InProgress → Complete
                                                    ↓
                                              Archived (end state, no further changes)
                              ↓
                         Deprecated (marked obsolete, preserved for traceability)
```

**Validation Rules**:

- `number` must be unique across all specifications
- `number` must be sequential (001, 002, 003...) with no gaps (per numbering strategy: preserve 001-012, start new at 013)
- `slug` must be unique and match folder name
- `folder_path` must follow pattern `.github/specs/{number}-{slug}/`
- `spec_file` must exist (audit will flag missing)
- `status` determines allowed operations (archived specs are read-only)

---

### 2. Quality Dimension

**Entity Name**: `QualityDimension`  
**Purpose**: One of 8 dimensions used to validate specification quality (from Constitution Principle VII)

**Fields**:

| Field | Type | Required | Example | Constraints |
|-------|------|----------|---------|-------------|
| `dimension_name` | String | Yes | "Completeness" | One of: Completeness, Clarity, Consistency, Measurability, ScenarioCoverage, EdgeCases, Dependencies, Ambiguities |
| `definition` | String | Yes | "All requirements present, user stories complete, edge cases identified" | Plain-language description |
| `pass_criteria` | String | Yes | "All 5 user stories complete with independent value; all 12 FRs specified" | What must be true to pass |
| `evaluation_status` | Enum | Yes | "PASS" | Values: PASS, FAIL, PARTIAL |
| `findings` | String | No | "Spec 001 missing edge case for file deletion scenario" | Specific examples if FAIL/PARTIAL |
| `remediation_action` | String | No | "Add acceptance scenario for file deletion workflow" | Action to fix FAIL status |

**Relationships**:

- `belongs_to` → `Specification`
- `has_many` → `AuditResult` (one per spec per dimension)

**Validation Rules**:

- `dimension_name` must be one of 8 canonical dimensions (no custom dimensions)
- `evaluation_status` changes require audit evidence
- Dimensions are evaluated consistently across all specifications

---

### 3. Specification Checklist

**Entity Name**: `SpecificationChecklist`  
**Location**: `.github/specs/{NNN}-{slug}/checklists/requirements.md`  
**Purpose**: Quality validation checklist tracking pass/fail status for specification completeness

**Fields**:

| Field | Type | Required | Example | Constraints |
|-------|------|----------|---------|-------------|
| `spec_number` | String | Yes | "013" | Reference to parent Specification |
| `section` | String | Yes | "Requirement Completeness" | Checklist section name |
| `item_text` | String | Yes | "No [NEEDS CLARIFICATION] markers remain" | Checkbox item text |
| `is_checked` | Boolean | Yes | true | Validation pass/fail |
| `notes` | String | No | "Clarification resolved: numbering strategy decided" | Additional context |

**Relationships**:

- `belongs_to` → `Specification`

**Validation Rules**:

- Each checklist item is objectively verifiable
- Item becomes checked only when evidence supports pass
- Unchecked items block advancement to next phase (e.g., clarify, plan, tasks)

---

### 4. Specification Catalog Entry

**Entity Name**: `CatalogEntry`  
**Location**: `.github/specs/CATALOG.md`  
**Purpose**: Single-source-of-truth index of all specifications with quick navigation

**Fields**:

| Field | Type | Required | Example | Constraints |
|-------|------|----------|---------|-------------|
| `number` | String | Yes | "013" | Links to Specification.number |
| `title` | String | Yes | "SpecKit Folder Organization Refactoring & Quality Audit" | Links to Specification.title |
| `purpose` | String | Yes | "Audit `.github/specs/` structure, create catalog, audit quality" | Concise purpose statement |
| `status` | Enum | Yes | "Draft" | Links to Specification.status |
| `created_date` | Date | Yes | 2026-09-16 | ISO 8601 format |
| `link` | String | Yes | "[spec/link](./013-spec-folder-refactor/spec.md)" | Markdown link to spec directory |

**Relationships**:

- `references` → `Specification` (one-to-one)

**Validation Rules**:

- Every Specification must have exactly one CatalogEntry
- CatalogEntry must be created within 7 days of specification creation (per SC-008)
- Link must be valid (spec directory exists and contains spec.md)
- Entries maintained in ascending number order (001, 002, 003..., 013)

---

### 5. Maintenance Procedure

**Entity Name**: `MaintenanceProcedure`  
**Location**: `.github/specs/MAINTENANCE.md`  
**Purpose**: Documented procedures for maintaining the speckit structure going forward

**Fields**:

| Field | Type | Required | Example | Constraints |
|-------|------|----------|---------|-------------|
| `procedure_name` | String | Yes | "Create New Specification" | Procedure title |
| `description` | String | Yes | "Follow these steps to create and number a new specification" | Purpose statement |
| `steps` | Array[String] | Yes | ["1. Run /speckit-specify", "2. Clarify if needed", ...] | Step-by-step instructions |
| `approval_gate` | String | Yes | "@ashley (governance authority)" | Who must approve |
| `checklist_items` | Array[String] | Yes | ["Folder created as NNN-slug", "spec.md present", ...] | Verification items |

**Relationships**:

- Defines workflow for creating, updating, archiving Specification entities
- References quality gates from QualityDimension validation

**Validation Rules**:

- All procedures must be non-technical (suitable for governance stakeholders)
- Approval gates must reference valid governance authority
- Procedures must be reviewed and approved before enforcement

---

## Derived Entities (Audit Results)

### 6. Audit Result

**Entity Name**: `AuditResult`  
**Location**: `013-spec-folder-refactor/audit-report.md`  
**Purpose**: Consolidated quality audit findings for a single specification

**Fields**:

| Field | Type | Required | Example | Constraints |
|-------|------|----------|---------|-------------|
| `spec_number` | String | Yes | "001" | Reference to audited Specification |
| `overall_quality_score` | Decimal (0-100) | Yes | 85.5 | Calculated from 8 dimensions |
| `dimensions_passing` | Integer | Yes | 6 | Count of PASS results |
| `dimensions_failing` | Integer | Yes | 2 | Count of FAIL results |
| `specific_gaps` | Array[Gap] | Yes | [{dimension: "Clarity", example: "Vague requirement X"}, ...] | Evidence of failures |

**Gap Structure**:

```
{
  dimension: "Clarity",
  severity: "high" | "medium" | "low",
  line_reference: "FR-012, line 123",
  quote: "System MUST ensure predictable numbering",
  gap_description: "What makes this a gap",
  remediation: "How to fix it"
}
```

**Relationships**:

- References Specification, QualityDimension
- Part of overall quality audit (AuditReport)

---

### 7. Audit Report

**Entity Name**: `AuditReport`  
**Location**: `013-spec-folder-refactor/audit-report.md`  
**Purpose**: Comprehensive quality audit across all 12 specifications

**Fields**:

| Field | Type | Required | Example | Constraints |
|-------|------|----------|---------|-------------|
| `audit_date` | Date | Yes | 2026-09-16 | ISO 8601 format |
| `specs_audited_count` | Integer | Yes | 12 | Number of specifications evaluated |
| `average_quality_score` | Decimal (0-100) | Yes | 82.3 | Mean of all spec scores |
| `highest_quality_spec` | String | Yes | "005" | Spec number with highest score |
| `most_common_gap_dimension` | String | Yes | "Clarity" | Most frequently failing dimension |
| `remediation_plan` | String | Yes | "10 remediation actions identified" | Link to remediation plan |
| `audit_results` | Array[AuditResult] | Yes | [AuditResult{spec: 001}, ...] | All per-spec results |

**Validation Rules**:

- All 12 specifications must be audited (no gaps)
- Average score and pass counts must be mathematically consistent
- Remediation plan must have ≥1 action per failing spec (per SC-005)

---

## Relationships & Constraints

### Primary Key Uniqueness

- `Specification.number`: Must be unique and immutable (001-013+)
- `Specification.slug`: Must be unique
- `CatalogEntry.number`: Must reference unique Specification

### Foreign Key Relationships

```
CatalogEntry.number → Specification.number (1:1)
AuditResult.spec_number → Specification.number (many:1)
QualityDimension ← AuditResult.dimension (many:1)
Specification ← SpecificationChecklist.spec_number (1:1)
```

### Consistency Rules

- Specification.phase controls allowed operations (complete specs are read-only)
- CatalogEntry must be created within 7 days of Specification creation (SC-008)
- AuditResult.overall_quality_score calculated from 8 dimension results
- All QualityDimension results must follow same evaluation criteria across all specs

---

## State Validation

**Specification Lifecycle Validation**:

```
Draft
  ↓ (after /speckit-clarify)
Clarified
  ↓ (after /speckit-plan)
Planned
  ↓ (after /speckit-tasks)
TasksGenerated
  ↓ (during implementation)
InProgress
  ↓ (after completion & merge)
Complete
  ↓ (optional: mark as archived)
Archived (immutable, preserved for traceability)
```

**Audit Result Validation**:

- No audit can proceed on Specification in Draft state (must be Clarified first)
- AuditResult can be generated at any phase ≥ Planned

---

**Data Model Complete**: 2026-09-16 | **Designer**: Claude Haiku 4.5
