# Data Model: Requirements Quality Checklist Framework

**Phase**: Phase 1 (Design & Contracts) | **Date**: 2026-09-13 | **Status**: Complete

## Overview

This document defines the core entities and relationships that drive the Requirements Quality Checklist Framework. All entities are serialisable (JSON/YAML) and technology-agnostic, enabling portability across projects and integrations.

---

## Entity Definitions

### 1. ChecklistDimension

Represents one of 8 quality dimensions that structure the checklist.

**Purpose**: Provide a named, defined quality standard that can be measured and tracked independently.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (e.g., `completeness`, `clarity`, `consistency`, `measurability`, `scenario-coverage`, `edge-cases`, `dependencies`, `ambiguities`) |
| `name` | string | Yes | Human-readable name (e.g., "Completeness") |
| `description` | string | Yes | Definition and scope (e.g., "All required sections and content are present") |
| `priority` | number | No | Relative importance (1-8; used for sorting/emphasis) |
| `success_threshold` | number | No | Minimum score (0-100) to pass this dimension (default: 75) |
| `items` | array[ChecklistItem] | Yes | Checklist items in this dimension |

**Validation Rules**:
- `id` MUST be lowercase, hyphen-separated (regex: `^[a-z-]+$`)
- `name` MUST be unique within a checklist
- `success_threshold` MUST be 0-100
- `items` MUST contain at least 1 item per dimension

**Example**:

```yaml
id: clarity
name: Clarity
description: Language is precise and unambiguous; no vague adjectives without measurable thresholds
priority: 2
success_threshold: 80
items:
  - id: clarity-001
    question: "Are all requirements free of vague adjectives (fast, scalable, robust, intuitive)?"
    pass_criteria: "No requirement contains subjective terms without quantifiable thresholds"
    reference_examples:
      bad: "The system must be fast"
      good: "The system must respond to queries in <500ms"
```

---

### 2. ChecklistItem

Represents an individual quality checkpoint within a dimension.

**Purpose**: Define a single, testable validation point that an author or reviewer evaluates against a specification.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (e.g., `clarity-001`) |
| `dimension_id` | string | Yes | Reference to parent ChecklistDimension (`id` field) |
| `question` | string | Yes | The actual checklist question asked (e.g., "Are all success criteria measurable?") |
| `pass_criteria` | string | Yes | How to determine if this item passes (e.g., "All SC-### items include quantifiable metrics") |
| `fail_criteria` | string | No | Clarification on what constitutes a failure (optional) |
| `guidance` | string | No | Helpful explanation or tips for evaluating this item |
| `reference_examples` | object | No | Good vs. poor examples for clarity |
| `audience_applicability` | array[string] | No | Which audiences use this item (e.g., `["author", "peer", "stakeholder"]`; empty = all) |
| `score_scale` | enum | No | Scoring method: `binary` (yes/no) or `scale` (0-3). Default: `binary` |

**Validation Rules**:
- `id` MUST be unique within a checklist
- `question` MUST be answerable by reviewing the specification
- `pass_criteria` MUST be specific enough to avoid ambiguity
- `score_scale` if `scale`, then pass_criteria SHOULD define thresholds (0=fail, 3=excellent)
- `audience_applicability` if provided, MUST reference valid audiences (`author`, `peer`, `stakeholder`, `integration`)

**Example**:

```yaml
id: completeness-002
dimension_id: completeness
question: "Are all user scenarios/stories prioritised (P1, P2, etc.)?"
pass_criteria: "User Scenarios section has at least 1 P1 story; all stories assigned explicit priority"
guidance: "Check spec's 'User Scenarios & Testing' section. Each story title should include (Priority: P#)"
reference_examples:
  good: "### User Story 1 - Author Review (Priority: P1)"
  bad: "### User Story 1 - Author Review"
audience_applicability: ["author", "peer", "stakeholder"]
score_scale: binary
```

---

### 3. ChecklistTemplate

Represents a named checklist variant configured for a specific audience and workflow.

**Purpose**: Define which items apply to which audience, with tailored language, time estimates, and sequencing.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (e.g., `author-pre-review`, `peer-review`, `stakeholder-gate`, `cross-project-integration`) |
| `name` | string | Yes | Human-readable name (e.g., "Author Pre-Review") |
| `description` | string | Yes | Context and purpose (e.g., "Self-validation before sending to peer review") |
| `audience` | string | Yes | Target audience type (one of: `author`, `peer`, `stakeholder`, `integration`) |
| `time_estimate_minutes` | number | Yes | Expected completion time (30 for author, 45 for peer, 15 for stakeholder, 20 for integration) |
| `dimensions` | array[object] | Yes | List of `{dimension_id, items: [item_ids]}` to include in this template |
| `language_tone` | string | No | Guidance on language style (e.g., "non-technical", "business-focused", "technical") |
| `item_order` | array[string] | No | Recommended order of item presentation (item IDs) |
| `intro_message` | string | No | Welcome message shown to user |
| `success_message` | string | No | Message shown when checklist passes |

**Validation Rules**:
- `id` MUST be lowercase, hyphen-separated
- `audience` MUST be one of: `author`, `peer`, `stakeholder`, `integration`
- `dimensions` MUST include at least one dimension
- `dimensions.items` MUST reference valid ChecklistItem IDs
- `time_estimate_minutes` MUST be > 0

**Example**:

```yaml
id: author-pre-review
name: Author Pre-Review
description: "Self-validation checklist for spec authors before peer review (30 min)"
audience: author
time_estimate_minutes: 30
language_tone: "non-technical, self-directed"
intro_message: "You're about to review your own specification for quality. This checklist covers 8 dimensions. Aim to complete in 30 minutes."
success_message: "Great! Your spec meets baseline quality standards. Ready to send to peer review."
dimensions:
  - dimension_id: completeness
    items: ["completeness-001", "completeness-002", "completeness-003"]
  - dimension_id: clarity
    items: ["clarity-001", "clarity-002"]
  - dimension_id: consistency
    items: ["consistency-001"]
  # ... more dimensions
```

---

### 4. ChecklistResult

Represents the output of running a checklist against a specification.

**Purpose**: Capture validation results in a machine-readable and human-readable format for storage, trending, and action.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (e.g., UUID or timestamp + hash) |
| `created_at` | ISO8601 | Yes | When the checklist was executed |
| `specification_reference` | SpecificationReference | Yes | Link to the spec that was validated (path, version, author) |
| `template_id` | string | Yes | Which template was used (e.g., `author-pre-review`) |
| `audience` | string | Yes | Target audience (from template) |
| `completion_time_seconds` | number | Yes | How long the checklist took to run |
| `overall_score` | number | Yes | 0-100 aggregate score (average of dimension scores or weighted) |
| `dimension_scores` | object | Yes | Map of `{dimension_id: score}` where score is 0-100 |
| `dimension_results` | array[DimensionResult] | Yes | Per-dimension detailed results (see below) |
| `passed` | boolean | Yes | Overall pass/fail (true if all dimensions ≥ success_threshold) |
| `findings` | array[Finding] | Yes | List of items that failed and recommendations (see below) |
| `metadata` | object | No | Additional context (e.g., reviewer name, review round number, integration source) |

**Validation Rules**:
- `overall_score` MUST be 0-100
- Each dimension_score MUST be 0-100
- `findings` MUST include at least one item per failed dimension
- `passed` MUST equal `all(dimension_scores >= dimension.success_threshold)`

**Example**:

```json
{
  "id": "result-20260913-abc123",
  "created_at": "2026-09-13T14:30:00Z",
  "specification_reference": {
    "spec_path": ".github/specs/003-requirements-checklist/spec.md",
    "spec_version": "draft",
    "author": "ashley@lightspeedwp.agency"
  },
  "template_id": "author-pre-review",
  "audience": "author",
  "completion_time_seconds": 4.2,
  "overall_score": 92,
  "dimension_scores": {
    "completeness": 95,
    "clarity": 88,
    "consistency": 100,
    "measurability": 90,
    "scenario-coverage": 95,
    "edge-cases": 85,
    "dependencies": 90,
    "ambiguities": 92
  },
  "passed": true,
  "findings": [
    {
      "item_id": "clarity-003",
      "item_question": "Do success criteria avoid implementation-specific language?",
      "item_pass_criteria": "No mention of specific tech (database, API, framework) in SC items",
      "status": "FAIL",
      "evidence": "SC-006 mentions '<5 seconds for checklist running' - this is implementation-focused; better: 'Checklist execution is perceived as instantaneous'",
      "recommendation": "Revise SC-006 to be technology-agnostic"
    }
  ],
  "metadata": {
    "reviewer_type": "self",
    "review_round": 1
  }
}
```

#### DimensionResult (nested in ChecklistResult)

```yaml
dimension_id: clarity
dimension_name: Clarity
dimension_score: 88
items_passed: 8
items_failed: 1
total_items: 9
failed_items: ["clarity-003"]
```

#### Finding (nested in ChecklistResult)

```yaml
item_id: clarity-003
item_question: "Do success criteria avoid implementation-specific language?"
item_pass_criteria: "No mention of specific tech (database, API, framework)"
status: "FAIL" # or "PASS"
evidence: "SC-006 mentions '<5 seconds for checklist running' - implementation-focused"
recommendation: "Revise SC-006 to be technology-agnostic"
severity: "medium" # "low", "medium", "high"
```

---

### 5. SpecificationReference

Represents metadata linking a ChecklistResult to its source specification.

**Purpose**: Enable traceability and trending (e.g., "show me all results for spec X", "track quality improvements for spec Y over time").

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `spec_path` | string | Yes | Relative path to spec file (e.g., `.github/specs/003-requirements-checklist/spec.md`) |
| `spec_version` | string | No | Version or branch name when result was captured (e.g., `draft`, `v1.0`, `main`) |
| `title` | string | No | Spec title (from heading, for readability) |
| `author` | string | No | Original spec author (from git blame or metadata) |
| `repository` | string | No | Repository where spec lives (e.g., `lightspeedwp/.github`) |
| `last_modified` | ISO8601 | No | Last modification time of the spec file |

**Validation Rules**:
- `spec_path` MUST point to a valid spec file
- `repository` if provided, MUST be a valid GitHub repository path

**Example**:

```yaml
spec_path: ".github/specs/003-requirements-checklist/spec.md"
spec_version: "draft"
title: "Requirements Quality Checklist Framework"
author: "ashley@lightspeedwp.agency"
repository: "lightspeedwp/.github"
last_modified: "2026-09-13T14:00:00Z"
```

---

## Entity Relationships

```
ChecklistTemplate
  ├─ references multiple ChecklistDimensions
  │    ├─ contains multiple ChecklistItems
  │    │    └─ used in ChecklistResult.findings
  │    └─ generates dimension_score in ChecklistResult
  └─ produces ChecklistResult

ChecklistResult
  ├─ links to SpecificationReference (source spec)
  ├─ contains per-dimension results (DimensionResult)
  └─ contains findings (Failed ChecklistItems with evidence & recommendations)
```

---

## Serialisation & Schema

All entities are JSON/YAML serialisable. JSON Schema definitions for validation are in `contracts/`:

- `checklist-dimension.schema.json` — Validates ChecklistDimension
- `checklist-item.schema.json` — Validates ChecklistItem  
- `checklist-template.schema.json` — Validates ChecklistTemplate
- `checklist-result.schema.json` — Validates ChecklistResult
- `specification-reference.schema.json` — Validates SpecificationReference

---

## State Transitions

**Checklist Lifecycle**:

```
1. Load ChecklistTemplate (e.g., "author-pre-review")
   ↓
2. Parse Specification (extract structure, content)
   ↓
3. Execute ChecklistItems against spec
   ├─ For each item: evaluate pass_criteria against spec
   ├─ Collect evidence (quotes from spec that triggered failure)
   ├─ Generate recommendations
   ↓
4. Aggregate per ChecklistDimension
   ├─ Calculate dimension_score (% of passing items)
   ├─ Check if >= success_threshold
   ↓
5. Create ChecklistResult
   ├─ Set overall_score (average or weighted)
   ├─ Set passed = all dimensions pass
   ├─ List findings (failed items with evidence)
   ↓
6. Output result (console, JSON file, HTML report)
```

---

## Extensibility Points

**Project-Specific Extensions**:

1. **Add custom ChecklistDimensions** — Create new dimension definitions (YAML config)
2. **Add custom ChecklistItems** — Add items to existing dimensions (YAML overlay)
3. **Override ChecklistTemplates** — Create project-specific template (e.g., `my-project-security-review.yaml`)
4. **Enhance Finding recommendations** — Modify recommendation text per project standards

**Architectural Extensibility** (Phase 2+):

- Plugin interface: `class CustomDimension extends Dimension { }` (TypeScript)
- Custom scoring: Override aggregation logic (dimension_score calculation)
- Custom parsers: Add spec format support beyond markdown/YAML

---

**Data Model Status**: ✅ COMPLETE — Ready for contract definition and quickstart.
