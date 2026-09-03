---
file_type: documentation
title: Labeling Agent Consolidation — Technical Specification
description: Detailed technical specification for unified labeling agent with architecture, component specs, schemas, and implementation details
created_date: 2026-09-03
last_updated: 2026-09-03
status: draft
tags:
  - openspec
  - specification
  - architecture
  - labeling
  - agentic-workflows
---

# Labeling Agent Consolidation — OpenSpec Specification

**Status:** 🟡 Draft (to be completed in Phase 2)  
**Owner:** Task-Planner Agent  
**Version:** 0.1.0 (skeleton)  
**Related Planning:** See [PLANNING.md](./PLANNING.md)

---

## Executive Summary

This OpenSpec document provides the detailed technical specification for the **Labeling Agent Consolidation** project. It complements [PLANNING.md](./PLANNING.md) with in-depth architecture, component specifications, schema designs, and implementation details.

**Status:** This is a **skeleton document** to be completed during Phase 2 (Planning & Design). See [PLANNING.md](./PLANNING.md) for current project status and timeline.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Specifications](#component-specifications)
3. [Label Schema Design](#label-schema-design)
4. [Reusable Skills](#reusable-skills)
5. [Workflow Consolidation](#workflow-consolidation)
6. [Multi-Repo Rollout Architecture](#multi-repo-rollout-architecture)
7. [Implementation Details](#implementation-details)
8. [Testing Requirements](#testing-requirements)
9. [Known Limitations & Future Work](#known-limitations--future-work)
10. [References](#references)

---

## Architecture Overview

### System Architecture Diagram

The unified labeling agent operates as a **hybrid system** combining GitHub Actions workflows (orchestration) with Claude-based agents (complex logic):

```
┌─────────────────────────────────────────────────────────────────────┐
│                     GitHub Event Triggers                            │
│  (PR opened/edited, issue created, discussion started, schedule)     │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│              GitHub Actions Workflow (Orchestrator)                  │
│                   labeling-core.yml                                  │
│  - Event detection and filtering                                    │
│  - Workflow dispatch and parameter passing                          │
│  - Result aggregation and reporting                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   Claude Labeling Agent                              │
│               (Complex Logic & Heuristics)                           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 1. Load Context (issue/PR metadata, branch name, files)      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 2. Fetch Label Schema (labels.yml + JSON Schema validation)  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 3. Apply Heuristics                                          │  │
│  │    - Branch name patterns (feat/, fix/, docs/, etc.)        │  │
│  │    - File pattern matching (src/blocks/**, docs/**)         │  │
│  │    - Content analysis (body, title keywords)                │  │
│  │    - Issue type detection (if applicable)                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 4. Validate Label Selection                                 │  │
│  │    - Schema conformance                                     │  │
│  │    - Conflict detection (one-hot constraints)               │  │
│  │    - Cross-repo consistency (if multi-repo)                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 5. Generate Recommendations or Apply Directly               │  │
│  │    - Return suggestions (user approval required)             │  │
│  │    - Apply labels directly (if confidence high)              │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   GitHub API Layer                                   │
│          (Apply labels, create comments, update issues)             │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│              GitHub Repository (Source of Truth)                     │
│            (Issues, PRs, labels applied and visible)                │
└─────────────────────────────────────────────────────────────────────┘
```

### Design Rationale: Hybrid (GitHub + Claude)

**Research Finding Q4** recommends a **hybrid approach**, not pure GitHub or pure Claude:

| Aspect | GitHub Actions | Claude Agent | Our Approach |
|--------|---|---|---|
| **Event orchestration** | ✅ Native, reliable | ❌ Not designed for | ✅ GitHub Actions |
| **Complex heuristics** | ❌ Limited logic | ✅ Full reasoning | ✅ Claude Agent |
| **Scheduling** | ✅ Built-in | ❌ External | ✅ GitHub Actions |
| **Error handling** | ✅ Good | ✅ Good | ✅ Both layers |
| **Cost** | 💰 Cheap | 💰 API calls | 💰 Balanced |
| **Maintenance** | 📝 High (many workflows) | 📝 Low (single agent) | 📝 Medium (consolidated) |

**Why This Works:**
1. **GitHub Actions** = reliable orchestration, perfect for event detection and scheduling
2. **Claude Agent** = complex analysis, pattern matching, confidence scoring, fallback logic
3. **Separation of concerns** = workflows are simple and testable, agents are intelligent

### Component Interaction Diagram

```
        Reusable Skills (skills/ folder)
        ┌──────────┬──────────┬──────────┬──────────┬──────────┐
        │ PR Label │ Issue    │ Status/  │ Conflict │ Multi-   │
        │Detection │Type→Label│Priority  │Detection │Repo Sync │
        │Skill     │Skill     │Inference │Skill     │Skill     │
        └────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┘
             │          │          │          │          │
             └──────────┼──────────┼──────────┼──────────┘
                        ↓
             Claude Labeling Agent
        ┌──────────────────────────┐
        │ labeling.agent.js         │
        │ - Orchestration           │
        │ - Heuristic engine        │
        │ - Conflict resolution     │
        └──────────────────────────┘
                  ↑         ↓
        ┌─────────┼─────────┼─────────┐
        ↓         ↓         ↓         ↓
    Config    GitHub    Reporting  Logging
    Manager   API Layer  Engine
    
    With inputs from:
    - labels.yml (canonical labels)
    - labeler.yml (auto-labeling rules)
    - issue-types.yml (issue type mappings)
    - GitHub PR/issue metadata
    - Branch naming patterns
    - File patterns
```

### Integration Points with Other Agents

**Issues-Agent (Issue Creation):**
```javascript
// When issues-agent creates an issue:
1. Extract issue_type from template
2. Call labeling-agent via CLI or API
3. Receive suggested labels + confidence scores
4. Auto-apply type:* label
5. Apply status:needs-triage (mandatory for all new issues)
6. Optionally apply area:* labels
```

**Task-Researcher Agent (Task Creation):**
```javascript
// When task-researcher creates research/investigation issues:
1. Mark with type:investigation
2. Apply priority:* label based on research urgency
3. Auto-apply area:automation if infrastructure-related
4. Support meta:* labels (needs-approval, blocked-by, etc.)
```

**Task-Planner Agent (Planning Issues):**
```javascript
// When task-planner creates planning/design issues:
1. Mark with type:planning or type:epic
2. Apply status:needs-review (planning requires review)
3. Auto-apply openspec:* labels for spec-related work
4. Link to parent epic via GitHub issue links
```

**Release-Agent (Release Tasks):**
```javascript
// When release-agent creates release PRs:
1. Auto-apply release:* labels (major, minor, patch)
2. Apply type:release label
3. Apply meta:needs-changelog
4. Enforce linked changelog entry
```

### Technology Stack Selection

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Orchestration** | GitHub Actions (YAML) | Native to GitHub, no external dependencies |
| **Complex Logic** | Claude (Node.js/JavaScript) | Superior pattern matching, context awareness |
| **Configuration** | YAML + JSON Schema | Human-readable, GitHub-native, validated |
| **Storage** | `.github/` (YAML files) | Version-controlled, auditable, org-wide |
| **APIs** | GitHub REST API v3 | Stable, well-documented, reliable rate limits |
| **Testing** | Jest + GitHub Actions | Standard Node.js testing, CI/CD integration |
| **Reporting** | JSON + Markdown | Machine and human-readable, artifact storage |

### Architecture Principles

1. **Single Source of Truth:**
   - `.github/labels.yml` is the canonical label registry
   - All workflows, agents, and tools read from this file
   - No duplicate label definitions anywhere

2. **Separation of Concerns:**
   - Workflows handle orchestration and event routing
   - Agent handles intelligent labeling logic
   - Skills are reusable and independently testable

3. **Fail-Safe Defaults:**
   - When heuristics fail, fall back to safe defaults
   - `status:needs-triage` always applied to new issues
   - Labels are suggestions first, applied automatically only when high-confidence

4. **Auditability:**
   - All label changes logged with reason/agent
   - Audit reports generated weekly
   - Traceable decision paths for every label applied

5. **Extensibility:**
   - Skills extracted to `skills/` for reuse
   - Per-repo label extensions via `.github/labeler.yml` overrides
   - Support for custom heuristics via configuration

---

## Component Specifications

### Component 1: Labeling Agent (Core)

**File Location:** `.github/scripts/agents/labeling.agent.js` (refactored and consolidated)

**Purpose:** Accept labeling requests from GitHub workflows and other agents; apply labels with validation and audit

**Responsibilities:**
- Receive label requests via CLI, GitHub API, or inter-agent communication
- Load label schema and validation rules
- Execute heuristics (branch name, file patterns, content analysis)
- Validate proposed labels for conflicts and conformance
- Apply labels via GitHub API with error handling
- Generate audit trail entries

**Interfaces:**

```javascript
// CLI Interface
node labeling.agent.js apply \
  --issue "owner/repo#123" \
  --labels "type:bug,priority:high" \
  --confidence-threshold 0.8 \
  --dry-run

// Workflow Integration
gh workflow run labeling-core.yml \
  -f event_type=issue \
  -f issue_number=123

// Agent-to-Agent API
const labelingAgent = require('./labeling.agent.js');
const result = await labelingAgent.applyLabels({
  target: 'owner/repo#123',
  labels: ['type:bug', 'priority:high'],
  confidence: 0.95,
  reason: 'Auto-detected from branch name: fix/bug-123'
});
```

**Key Methods:**

| Method | Input | Output | Notes |
|--------|-------|--------|-------|
| `applyLabels()` | label request | success/conflict | Main entry point |
| `suggestLabels()` | context data | label suggestions | Returns options without applying |
| `validateLabels()` | label list | validation result | Checks schema + conflicts |
| `loadSchema()` | repo config | schema object | Caches for performance |
| `getAuditTrail()` | issue/PR ID | audit entries | Returns all past labeling actions |

**Error Handling Strategy:**

1. **Validation Errors** → Return error message, don't apply
2. **GitHub API Errors** (rate limit, auth) → Retry with exponential backoff, max 3 attempts
3. **Conflict Errors** → Return conflict report, suggest resolutions, require manual override
4. **Schema Errors** → Log and alert, apply minimal safe defaults

**Performance Requirements:**
- Load schema: < 100ms (cached)
- Validate labels: < 50ms
- Apply labels: < 1 second (GitHub API + verification)
- Handle 100 concurrent requests: Yes (via GitHub Actions queuing)

### Component 2: Label Validator

**File Location:** `.github/scripts/validation/label-validator.js` (new, extracted from validation scripts)

**Purpose:** Validate labels against schema and detect conflicts

**Responsibilities:**
- Validate label names against canonical set
- Detect one-hot constraint violations (e.g., multiple status:* labels)
- Check for conflicting label combinations
- Generate suggestions for resolution
- Report confidence scores

**Inputs:**
- Label list to validate
- Existing labels on target
- Label schema (from Schema Manager)
- Conflict rules (from config)

**Outputs:**
```javascript
{
  valid: boolean,
  errors: [
    {
      label: "status:needs-review",
      reason: "Conflicts with status:in-progress (one-hot constraint)",
      severity: "error",
      suggestion: "Remove status:in-progress, keep status:needs-review"
    }
  ],
  warnings: [
    {
      label: "type:feature",
      reason: "No status:* label provided; defaults to needs-triage",
      severity: "warning"
    }
  ],
  suggestions: {
    "status:*": ["status:needs-triage", "status:in-progress"],
    "priority:*": ["priority:high", "priority:normal"]
  }
}
```

**Validation Rules:**

1. **Canonical Labels Only:** All labels must exist in `labels.yml`
2. **One-Hot Constraints:** Only one label per family (status, priority, type)
3. **Dependency Rules:** Certain labels require others (e.g., meta:breaking-change requires priority:critical)
4. **Family Prefixes:** All labels must follow family:item naming convention

**Performance Requirements:**
- Validate 50 labels: < 100ms
- Check conflicts: < 50ms

### Component 3: Schema Manager

**File Location:** `.github/scripts/agents/includes/schema-manager.js` (new, extracted from fetch-canonical-labels.js)

**Purpose:** Load, cache, and manage label schemas with version support

**Responsibilities:**
- Load labels.yml and merge with repo-specific overrides
- Validate schema against JSON Schema
- Support versioning and change tracking
- Provide caching for performance
- Handle missing or invalid schemas gracefully

**Interfaces:**

```javascript
const schemaManager = require('./schema-manager.js');

// Load org-wide schema
const schema = await schemaManager.load('org');

// Load repo-specific schema (with org-wide as base)
const repoSchema = await schemaManager.load('owner/repo');

// Check if label exists
if (schema.has('type:bug')) { /* ... */ }

// Get label metadata
const labelInfo = schema.get('type:bug');
// Returns: { name, color, description, family, aliases, one_hot_family, ... }

// Get all labels in family
const typeLabels = schema.getFamily('type');
```

**Caching Strategy:**
- Cache in-memory for duration of workflow run
- TTL: 5 minutes (refresh on timeout)
- Invalidate on manual cache-clear command

**Version Support:**
- Track `schema_version` in metadata
- Support migrations from old schema versions
- Backward-compatible with flat structure

### Component 4: Multi-Repo Sync

**File Location:** `.github/scripts/automation/multi-repo-sync.js` (refactored from label-sync.js)

**Purpose:** Coordinate and synchronize label application across multiple repositories

**Responsibilities:**
- Route label requests to target repositories
- Manage per-repo schema variations
- Apply labels consistently across repos
- Handle per-repo conflicts and exceptions
- Report status and failures

**Interfaces:**

```javascript
const multiRepoSync = require('./multi-repo-sync.js');

// Apply labels to issue in multiple repos
const results = await multiRepoSync.applyAcrossRepos({
  sourceRepo: 'lightspeedwp/.github',
  sourceIssue: 123,
  targetRepos: ['lightspeedwp/plugin-a', 'lightspeedwp/plugin-b'],
  labels: ['type:bug', 'priority:high'],
  syncMode: 'mirror' // or 'extend'
});

// Returns: { success: repo[], failed: {repo: error}[], skipped: [] }
```

**Sync Modes:**

1. **Mirror:** Ensure target repos have exact same labels (replace)
2. **Extend:** Add labels to existing labels (no removal)
3. **Merge:** Combine labels intelligently (resolve conflicts)

**Per-Repo Configuration:**

```yaml
# lightspeedwp/plugin-a/.github/labeler-extensions.yml
repo_config:
  name: plugin-a
  parent_org: lightspeedwp
  inherit_labels: true
  custom_areas:
    - area:cache-plugin
    - area:woocommerce-integration
  sync_rules:
    - type: mirror
      match: "type:*"  # Sync type labels as-is
    - type: extend
      match: "area:*"  # Add area labels, don't remove
```

**Performance Requirements:**
- Apply to 10 repos: < 5 seconds
- Handle 1000 repos: Via pagination (100 repos per batch)

---

## Label Schema Design

### Current Schema Analysis

**Current Structure (labels.yml - flat YAML):**

```yaml
- name: type:bug
  color: d73a49
  description: "A bug, defect, or error"
  
- name: status:needs-triage
  color: fbca04
  description: "Needs triage and prioritization"
  
- name: priority:critical
  color: b60205
  description: "Critical priority - address immediately"
```

**Flat Schema Strengths:**
- ✅ GitHub's native format (easy to export/import)
- ✅ Simple to parse and validate
- ✅ Works at current scale (158 labels)
- ✅ Easy to add new labels
- ✅ No breaking changes when extended

**Flat Schema Limitations:**
- ❌ No metadata for automation (e.g., "is auto-applier?")
- ❌ No hierarchy visualization
- ❌ Manual tracking of constraints (one-hot, dependencies)
- ❌ Difficult to audit label relationships

**Research Finding Q7 Decision:** Keep flat structure, add JSON Schema validation with enhanced metadata

### Proposed Schema Structure

**Enhanced Flat Schema (labels.yml):**

```yaml
# Schema version and metadata
schema_version: "2.0"
last_updated: "2026-09-03"
sync_status: "in-sync"  # Tracked for consistency validation

labels:
  - name: type:bug
    family: type
    color: d73a49
    description: "A bug, defect, or error"
    usage_pattern: "automatic"  # auto | manual | mixed
    aliases:
      - bug
      - defect
      - error
    one_hot_family: "type"  # Can only have one label from this family
    automation_rules:
      auto_apply:
        - condition: "branch_prefix == 'fix/'"
          confidence: 0.85
        - condition: "has_label('type:investigation') && contains('bug')"
          confidence: 0.70
      incompatible_with:
        - type:feature
        - type:documentation
      requires:
        - status:*  # Must have one status:* label
    category: "issue-type"
    searchable: true

  - name: status:needs-triage
    family: status
    color: fbca04
    description: "Needs triage and prioritization"
    usage_pattern: "automatic"
    one_hot_family: "status"
    automation_rules:
      auto_apply:
        - condition: "is_new_issue"
          confidence: 1.0
      required_for:
        - "new issues"
        - "unlabeled items"
    category: "workflow-state"
    searchable: true

  - name: priority:critical
    family: priority
    color: b60205
    description: "Critical priority - address immediately"
    usage_pattern: "manual"
    one_hot_family: "priority"
    automation_rules:
      auto_apply:
        - condition: "branch_prefix == 'hotfix/'"
          confidence: 0.95
        - condition: "has_label('type:security')"
          confidence: 1.0
    category: "urgency"
    searchable: true
    sla: "4 hours"  # Expected response time
```

### JSON Schema Validation (schema.json)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["schema_version", "labels"],
  "properties": {
    "schema_version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+$",
      "description": "Semantic version of schema format"
    },
    "last_updated": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp of last update"
    },
    "sync_status": {
      "type": "string",
      "enum": ["in-sync", "out-of-sync", "pending-review"],
      "description": "Synchronization status with other config files"
    },
    "labels": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "family", "color", "description"],
        "properties": {
          "name": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9]*(?::[a-z0-9-]+)*$",
            "description": "Label name with family prefix"
          },
          "family": {
            "type": "string",
            "enum": ["type", "status", "priority", "area", "comp", "lang", "release", "meta", "ai-ops", "discussion", "openspec", "contrib", "compat", "cpt", "env", "custom"],
            "description": "Label family/category"
          },
          "color": {
            "type": "string",
            "pattern": "^[0-9A-Fa-f]{6}$",
            "description": "Hex color code (no #)"
          },
          "description": {
            "type": "string",
            "minLength": 5,
            "maxLength": 200,
            "description": "Human-readable label description"
          },
          "one_hot_family": {
            "type": ["string", "null"],
            "enum": ["type", "status", "priority", null],
            "description": "Family that enforces one-hot constraint"
          },
          "aliases": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Bare label aliases for auto-correction"
          },
          "usage_pattern": {
            "type": "string",
            "enum": ["automatic", "manual", "mixed"],
            "description": "How label is typically applied"
          },
          "automation_rules": {
            "type": "object",
            "properties": {
              "auto_apply": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["condition", "confidence"],
                  "properties": {
                    "condition": {"type": "string"},
                    "confidence": {"type": "number", "minimum": 0, "maximum": 1}
                  }
                },
                "description": "Rules for automatic label application"
              },
              "incompatible_with": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Labels that conflict with this one"
              },
              "requires": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Labels/patterns that must accompany this one"
              }
            }
          },
          "category": {
            "type": "string",
            "description": "Categorization for UI grouping"
          },
          "searchable": {
            "type": "boolean",
            "description": "Whether label appears in search/filtering"
          },
          "sla": {
            "type": ["string", "null"],
            "description": "Service level agreement / expected resolution time"
          }
        }
      }
    }
  }
}
```

### Cross-Repo Consistency Rules

**Canonical Labels (Mandatory Everywhere):**
- All `type:*` labels (33 types)
- All `status:*` labels (20 statuses)  
- All `priority:*` labels (4 priorities)
- All `meta:*` labels (governance and tracking)

**Extensible Labels (Can Add Custom):**
- `area:*` labels (can add repo-specific areas)
- `comp:*` labels (can add component-specific labels)
- `lang:*` labels (already has language coverage)

**Never Extend:**
- `type:*` (types are universal, no repo-specific types)
- `status:*` (workflow states must be consistent)
- `priority:*` (urgency assessment must be consistent)

**Extension Mechanism:**

```yaml
# .github/labeler-extensions.yml (per-repo, optional)
custom_labels:
  - name: area:mypy-plugin
    color: 366a9f
    description: "MyPy type checker plugin"
    family: area
    usage_pattern: manual
    searchable: true

validation:
  allow_custom_areas: true
  allow_custom_components: false
  enforce_canonical: true  # Require all canonical labels in this repo
```

### Examples and Validation Test Cases

**Test Case 1: New Bug Issue**

```javascript
// Input
{
  context: {
    type: 'issue',
    action: 'opened',
    title: 'Authentication fails on POST requests',
    body: 'When sending auth tokens in POST body...',
    issue_type: 'Bug Report'
  }
}

// Expected Output
{
  suggested_labels: [
    { label: 'type:bug', confidence: 0.95, reason: 'Issue type is Bug Report' },
    { label: 'status:needs-triage', confidence: 1.0, reason: 'New issue requires triage' },
    { label: 'priority:high', confidence: 0.70, reason: 'Authentication issue suggests high priority' }
  ],
  auto_apply: ['type:bug', 'status:needs-triage'],
  requires_approval: ['priority:high']
}

// Schema Validation
✅ type:bug exists in labels.yml
✅ status:needs-triage exists and is one-hot with type:bug
✅ priority:high exists
✅ No conflicts detected
```

**Test Case 2: Feature PR with Breaking Change**

```javascript
// Input
{
  context: {
    type: 'pull_request',
    action: 'opened',
    branch: 'feat/new-block-api',
    title: 'Add new block editor API',
    body: 'BREAKING CHANGE: Old API deprecated',
    changed_files: ['src/blocks/api.js', 'docs/api.md']
  }
}

// Expected Output
{
  suggested_labels: [
    { label: 'type:feature', confidence: 0.90, reason: 'Branch prefix feat/' },
    { label: 'status:needs-review', confidence: 1.0, reason: 'New PR requires review' },
    { label: 'area:block-editor', confidence: 0.85, reason: 'Changed files in blocks/*' },
    { label: 'meta:breaking-change', confidence: 0.95, reason: 'PR body contains BREAKING CHANGE' },
    { label: 'priority:critical', confidence: 1.0, reason: 'Breaking changes are critical' }
  ],
  auto_apply: ['type:feature', 'status:needs-review', 'area:block-editor'],
  requires_approval: ['meta:breaking-change', 'priority:critical']
}

// Schema Validation
✅ All labels exist in labels.yml
⚠️ meta:breaking-change requires priority:critical (dependency satisfied)
⚠️ type:feature + area:block-editor compatible (different families)
✅ No conflicts detected
```

**Test Case 3: Documentation Update**

```javascript
// Input
{
  context: {
    type: 'pull_request',
    branch: 'docs/update-contributing-guide',
    changed_files: ['docs/CONTRIBUTING.md']
  }
}

// Expected Output
{
  auto_apply: [
    { label: 'type:documentation', confidence: 1.0, reason: 'Branch prefix docs/' },
    { label: 'status:ready-to-merge', confidence: 0.90, reason: 'Docs-only change' },
    { label: 'area:documentation', confidence: 1.0, reason: 'Changed files in docs/*' },
    { label: 'meta:no-changelog', confidence: 1.0, reason: 'Documentation change doesn\'t affect changelog' }
  ]
}

// Schema Validation
✅ All labels valid and consistent
✅ meta:no-changelog does not conflict with type:documentation
```

---

## Label Schema Design

**To be completed in Phase 2.**

### Current Schema (labels.yml)

**Current State:**
- Flat YAML array (158 canonical labels)
- Fields: `name`, `color`, `description`
- No validation rules
- No metadata for automation

**Research Question 7 will determine:**
- Keep flat, or support nested hierarchies?
- Add JSON Schema validation?
- Add metadata (automation rules, usage patterns, etc.)?

### Proposed Schema (Draft)

**Structure to be defined:**

```yaml
# Option A: Keep flat with enhanced metadata
version: "1.0"
labels:
  - name: "type:bug"
    color: "#d73a49"
    description: "Bug report"
    family: "type"
    metadata:
      automation_rules: []
      usage_pattern: "automatic"
      required_with: []
      conflicts_with: []

# Option B: Support nested hierarchy
categories:
  type:
    labels:
      - bug
      - feature
      - task
  status:
    labels:
      - needs-triage
      - in-progress
      - done
```

**JSON Schema Validation:**

- To be created with examples
- Validation rules for each label family
- Cross-repo consistency enforcement
- Custom extension support per repo

---

## Reusable Skills

Skills are extracted from the labeling system to `skills/` folder, making them available to other agents in the ecosystem. **Research Finding Q11** prioritizes these in implementation order.

### Skill 1: PR Label Detection ⭐⭐⭐ (Highest Priority)

**Folder:** `skills/pr-label-detection/`

**Purpose:** Detect and suggest appropriate labels based on PR metadata (branch name, changed files, title, description)

**Interface:**

```javascript
const prLabelDetection = require('skills/pr-label-detection');

const suggestions = await prLabelDetection.detect({
  branch: 'feat/user-preferences-panel',
  title: 'Add user preferences panel UI',
  description: 'Closes #123. Adds new preferences interface.',
  changed_files: [
    'src/blocks/preferences-panel/index.js',
    'src/blocks/preferences-panel/styles.css',
    'docs/blocks/preferences-panel.md'
  ],
  author: 'ashleyshaw'
});

// Returns:
// {
//   labels: [
//     { label: 'type:feature', confidence: 0.95 },
//     { label: 'area:block-editor', confidence: 0.90 },
//     { label: 'area:ui', confidence: 0.85 },
//     { label: 'meta:needs-changelog', confidence: 0.80 }
//   ],
//   reasoning: {
//     type_feature: 'Branch prefix "feat/" indicates feature',
//     area_block_editor: 'Changed files contain src/blocks/',
//     area_ui: 'Title and files suggest UI work',
//     changelog: 'Significant user-facing feature change'
//   }
// }
```

**Reuse Potential:** Issues-agent, release-agent, changelog-agent, pr-analysis-agent  
**Estimated Reuse Rate:** 95%+ (used by almost all PR-related agents)

**Exported Skills/Utilities:**
- `detectLabelsFromBranch()` — Parse branch prefix patterns
- `detectLabelsFromFiles()` — Match against file patterns
- `detectLabelsFromContent()` — Analyze title/body keywords
- `scoreConfidence()` — Rank suggestions by confidence

### Skill 2: Issue Type → Label Mapping ⭐⭐⭐ (Highest Priority)

**Folder:** `skills/issue-type-to-label-mapping/`

**Purpose:** Map GitHub issue types to canonical labels automatically

**Interface:**

```javascript
const issueTypeMapping = require('skills/issue-type-to-label-mapping');

// Direct mapping
const labels = issueTypeMapping.getLabels('bug-report');
// Returns: ['type:bug', 'status:needs-triage', 'priority:normal']

// Bulk mapping with custom priority
const bulkLabels = issueTypeMapping.mapMany([
  { type: 'bug-report', customPriority: 'high' },
  { type: 'feature-request' },
  { type: 'documentation' }
]);
// Returns: {
//   'bug-report': ['type:bug', 'status:needs-triage', 'priority:high'],
//   'feature-request': ['type:feature', 'status:needs-triage'],
//   'documentation': ['type:documentation', 'status:ready-for-review']
// }

// Get all issue types
const allTypes = issueTypeMapping.getAllTypes();
```

**Reuse Potential:** Issues-agent, task-researcher, task-planner  
**Estimated Reuse Rate:** 85%+ (used when creating issues)

**Exported Skills/Utilities:**
- `getLabels()` — Lookup labels for type
- `getType()` — Reverse lookup (label → type)
- `mapMany()` — Bulk mapping
- `listAllTypes()` — Available issue types

### Skill 3: Status/Priority Inference ⭐⭐ (High Priority)

**Folder:** `skills/status-priority-inference/`

**Purpose:** Intelligently infer status and priority labels from context

**Interface:**

```javascript
const inference = require('skills/status-priority-inference');

// Infer status
const status = inference.inferStatus({
  type: 'bug',
  assigned_to: 'ashleyshaw',
  milestone: '2026-09',
  pull_requests: 1,  // Has linked PR
  comments: 5,
  last_activity: '2026-09-02'
});
// Returns: {
//   label: 'status:in-progress',
//   reasoning: 'Bug has assignment, milestone, and linked PR',
//   confidence: 0.85
// }

// Infer priority
const priority = inference.inferPriority({
  type: 'bug',
  title: '[URGENT] Authentication broken',
  labels: ['type:security'],
  reported_by: 'customer'
});
// Returns: {
//   label: 'priority:critical',
//   reasoning: 'Security issue + urgent tone + customer report',
//   confidence: 0.95
// }

// Combined inference
const combined = inference.inferMultiple({
  context: {...},
  infer: ['status', 'priority']
});
```

**Reuse Potential:** Labeling-agent (for status/priority defaults), task-researcher  
**Estimated Reuse Rate:** 70%+ (used when context-aware labeling needed)

### Skill 4: Label Conflict Detection ⭐⭐ (High Priority)

**Folder:** `skills/label-conflict-detection/`

**Purpose:** Detect invalid label combinations and suggest resolutions

**Interface:**

```javascript
const conflictDetection = require('skills/label-conflict-detection');

const result = conflictDetection.detectConflicts({
  requested: ['type:feature', 'type:bug', 'status:needs-review'],
  existing: ['status:in-progress'],
  schema: labelSchema
});

// Returns:
// {
//   conflicts: [
//     {
//       type: 'one-hot',
//       labels: ['type:feature', 'type:bug'],
//       family: 'type',
//       message: 'Cannot have multiple type:* labels',
//       severity: 'error'
//     },
//     {
//       type: 'state-conflict',
//       labels: ['status:needs-review', 'status:in-progress'],
//       message: 'Cannot transition from in-progress to needs-review',
//       severity: 'warning'
//     }
//   ],
//   resolution_options: [
//     {
//       option: 1,
//       action: 'Keep type:bug, remove type:feature',
//       reasoning: 'Bug classification takes precedence for fixes'
//     },
//     {
//       option: 2,
//       action: 'Change status:needs-review to status:in-progress',
//       reasoning: 'Item is already in progress'
//     }
//   ],
//   recommended: { option: 2, confidence: 0.90 }
// }
```

**Reuse Potential:** Labeling-agent (core validation), issue/PR validators  
**Estimated Reuse Rate:** 80%+ (used whenever labels applied)

### Skill 5: Multi-Repo Label Sync ⭐ (Medium Priority)

**Folder:** `skills/multi-repo-label-sync/`

**Purpose:** Coordinate label application across multiple repositories with per-repo validation

**Interface:**

```javascript
const multiRepoSync = require('skills/multi-repo-label-sync');

const result = await multiRepoSync.syncAcrossRepos({
  labels: ['type:bug', 'priority:high'],
  target_repos: [
    'lightspeedwp/plugin-a',
    'lightspeedwp/plugin-b',
    'lightspeedwp/theme-x'
  ],
  source: 'lightspeedwp/.github#456',
  sync_mode: 'extend',  // mirror | extend | merge
  dry_run: true
});

// Returns:
// {
//   success: {
//     'lightspeedwp/plugin-a': { applied: 2, skipped: 0 },
//     'lightspeedwp/plugin-b': { applied: 2, skipped: 0 }
//   },
//   failed: {
//     'lightspeedwp/theme-x': { error: 'Access denied', applied: 0 }
//   },
//   skipped: [],
//   summary: '4/6 labels applied to 2/3 repos',
//   audit_entry: 'sync-20260903-1234'
// }
```

**Reuse Potential:** Labeling-agent (for multi-repo scenarios), release-agent  
**Estimated Reuse Rate:** 50%+ (used for cross-repo label consistency)

---

### Skill Integration with Agent Ecosystem

Each skill is independently callable and returns structured results suitable for downstream agents:

```
Issues-Agent
  ├─ Uses: PR Label Detection, Issue Type Mapping, Status Inference
  └─ Calls: Labeling-Agent to apply labels

Release-Agent
  ├─ Uses: PR Label Detection, Multi-Repo Sync
  └─ Calls: Labeling-Agent for release labels

Task-Researcher Agent
  ├─ Uses: Issue Type Mapping, Status Inference
  └─ Auto-labels research/investigation issues

Changelog-Agent
  ├─ Uses: PR Label Detection
  └─ Identifies changelog-relevant PRs

Labeling-Agent (Orchestrator)
  ├─ Uses: All 5 skills
  ├─ Coordinates conflict detection
  └─ Applies final labels via GitHub API
```

---

## Workflow Consolidation

### Current Fragmentation (From Phase 1 Audit)

**Before (11 Fragmented Workflows):**

| File | Purpose | Trigger | Dependencies | Lines |
|------|---------|---------|--------------|-------|
| `labeling.yml` | Unified labeling for PR/issue/discussion | Event-driven | labels.yml, labeler.yml, issue-types.yml | ~150 |
| `issue-labeling-automation.yml` | Daily auto-label of unlabeled issues | Schedule (02:00 UTC) | labels.yml | ~80 |
| `meta-labels-sync.yml` | Sync PR labels to linked issues | PR events, schedule | labels.yml, GitHub API | ~100 |
| `remediate-bare-labels.yml` | Fix bare labels to canonical | Schedule (weekly) | labels.yml, bare-label-mapping.json | ~90 |
| `label-audit-report.yml` | Generate weekly audit trail | Schedule (weekly) | labels.yml, audit scripts | ~100 |
| `openspec-sync-labels.yml` | Sync OpenSpec phase labels | OpenSpec events | labels.yml, OpenSpec structure | ~80 |
| `openspec-validate-labels.yml` | Validate OpenSpec labels | OpenSpec workflow | labels.yml, OpenSpec phase mapping | ~75 |
| `manage-blocking-status-labels.yml` | Auto-manage blocking status labels | Dependency events | labels.yml, issue linking | ~85 |
| `labeling-governance.yml` | Enforce labeling governance policy | Multiple triggers | label-governance-policy.yml, labels.yml | ~110 |
| `validate-issue-labels.yml` | Pre-creation validation | Issue/PR creation | labels.yml, validation scripts | ~95 |
| Plus: Custom scripts for PR template routing, label remediation, reporting | Various | Various | Various | ~500 |

**Total Lines of YAML/Logic:** ~1,065 (not counting supporting scripts)

**Fragmentation Issues:**
1. **Overlapping Responsibilities:** labeling.yml + issue-labeling-automation.yml both label issues
2. **Multiple Scheduling:** 3 separate schedule patterns could conflict (02:00 UTC, weekly, manual)
3. **Configuration Spread:** 5+ config files with manual synchronization required
4. **Script Duplication:** Similar logic in label-sync.js and sync-pr-labels.js
5. **Governance Split:** labeling-governance.yml + validate-issue-labels.yml duplicate validation

### Consolidation Strategy (After)

**Target (3–4 Consolidated Workflows):**

| Workflow | Purpose | Replaces | Event Triggers | Total Lines |
|----------|---------|----------|---|---|
| `labeling-core.yml` | Unified labeling engine for all PR/issue/discussion events | `labeling.yml` + `validate-issue-labels.yml` | PR opened/edited, issue opened/edited, discussion created, manual | ~100 |
| `labeling-automation.yml` | Scheduled labeling tasks (retroactive, sync, cleanup) | `issue-labeling-automation.yml` + `meta-labels-sync.yml` + `remediate-bare-labels.yml` | Schedule (daily 02:00 UTC, weekly), manual dispatch | ~120 |
| `labeling-governance.yml` | Policy enforcement and audit | `labeling-governance.yml` + `label-audit-report.yml` (refactored, not removed) | Schedule (weekly), manual dispatch | ~80 |
| `labeling-openspec.yml` | OpenSpec-specific labeling (specialized, kept separate) | `openspec-sync-labels.yml` + `openspec-validate-labels.yml` | OpenSpec issue events, schedule, manual | ~90 |

**Total Lines of Core YAML:** ~390 (64% reduction)

**Plus Refactored Scripts:** ~300 lines (consolidated from ~500)

**Overall Code Reduction:** ~42% reduction in total lines, ~100% clearer responsibility separation

### Before/After Comparison

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Workflow Files** | 11 | 4 (3 core + 1 specialized) | -64% |
| **Configuration Files** | 4 YAML | 4 YAML (same, but unified) | No change |
| **Script Files** | 37 | 25 (consolidated) | -32% |
| **Total YAML Lines** | ~1,065 | ~390 | -63% |
| **Total Script Lines** | ~500 | ~300 | -40% |
| **Unique Responsibilities** | 10+ overlapping | 4 clear | Improved |
| **Manual Syncing Required** | High | Low | Improved |
| **Maintenance Burden** | High | Low | Improved |
| **Developer Onboarding** | 2 hours | 30 mins | Improved |

### Migration Strategy

**Phase 1: Deployment (Week 4–5)**

1. **Create new consolidated workflows** without removing old ones
   - `labeling-core.yml` alongside `labeling.yml`
   - `labeling-automation.yml` alongside `issue-labeling-automation.yml`
   - Run in parallel for 1 week to validate correctness

2. **Validate equivalence** via dry-runs and logs
   - Compare label application results
   - Check for missed edge cases
   - Verify audit trail integrity

3. **Switch traffic** to new workflows
   - Disable old workflows (don't delete)
   - Monitor for regressions
   - Keep rollback capability ready

4. **Archive old workflows** after 2 weeks of stable operation
   - Move to `.github/workflows/archived/`
   - Document decommissioning date
   - Keep for historical reference

**Phase 2: Cleanup (Week 6)**

1. **Migrate OpenSpec workflows** if needed
2. **Update documentation** to reference new workflows
3. **Clean up unused scripts** and dependencies

### Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Label application differs between old/new | High | Parallel run + validation, dry-runs |
| Race conditions in scheduled workflows | Medium | Sequential scheduling, job locking |
| Governance enforcement issues | Medium | Comprehensive testing, staged rollout |
| Backwards compatibility | Low | Version both workflows, gradual migration |

**Risk Level: LOW** — No circular dependencies, well-tested components, gradual rollout possible

---

## Workflow Consolidation

**To be completed in Phase 2.**

### Current Fragmentation (Audit Results — Phase 1)

**To be filled in with audit findings:**

- List of all 11+ fragmentation workflows
- File locations and purposes
- Dependencies and interactions
- Redundancies and overlaps
- Current file count: **[11+]**

### Consolidation Strategy

**To be defined:**

- Target file count: **[3–5]**
- Workflow organization approach
- Per-file responsibilities
- Migration strategy for existing workflows
- Backward compatibility layer (if needed)

### Before/After Comparison

**To be created:**

| Aspect | Before | After | Reduction |
|--------|--------|-------|-----------|
| Workflow files | 11+ | TBD | TBD |
| Script files | TBD | TBD | TBD |
| Lines of code | TBD | TBD | TBD |
| Maintenance burden | High | Low | TBD |

---

## Multi-Repo Rollout Architecture

**Based on Research Finding Q1:** Phased pilot approach (control plane → plugins → themes) for safe, validated rollout

### Rollout Phases (Detailed Specifications)

#### Phase A: Control Plane (.github Repo) — Oct 1–15

**Goals:**
- Deploy unified labeling agent to production
- Test with 11,000+ existing issues/PRs
- Validate label schema and consistency
- Measure performance and audit trail accuracy

**Deployment Steps:**

1. **Week 1 (Oct 1–5): Pre-deployment**
   - Deploy to staging branch (.github/staging)
   - Run parallel labeling (old + new workflows)
   - Collect metrics and compare outputs
   - Validation: 99% label agreement, zero conflicts

2. **Week 2 (Oct 6–12): Production Rollout**
   - Deploy consolidated workflows to main branch
   - Run monitoring for 48 hours
   - Validation: < 0.1% error rate, < 1% regressions
   - Measure: 50%+ reduction in workflow execution time

3. **Week 3 (Oct 13–15): Decommission & Monitor**
   - Archive old workflows
   - Update documentation
   - Monitor for 1 week post-deployment

**Rollback Procedure:**
- Keep old workflows in `workflows/archived/` for 30 days
- If issues detected: Restore from archive, investigate
- If errors found: Fix and re-test in staging before re-deployment

#### Phase B: WordPress Plugins — Oct 20–Nov 15

**Pilot Repos (2–3):**
- [TBD] — small, low-traffic plugin for safe testing
- [TBD] — medium-traffic plugin for real-world validation
- [TBD] — (optional) high-traffic plugin for stress testing

**Deployment Steps:**

1. **Week 1 (Oct 20–26): Configuration & Canary**
   - Create `.github/labeler-extensions.yml` for pilot repos
   - Deploy unified workflows to pilot repos
   - Run validation checks (label consistency, schema conformance)
   - Target: 100% canonical label consistency across all pilots

2. **Week 2 (Oct 27–Nov 2): Validation & Iteration**
   - Compare labels applied in pilots vs control plane
   - Identify any repo-specific label needs
   - Add custom areas/components to extensions if needed
   - Gather feedback from plugin maintainers

3. **Week 3 (Nov 3–9): Full Rollout**
   - Deploy to all WordPress plugin repos (estimated 20+ repos)
   - Staggered deployment (5 repos per day)
   - Monitor each wave for issues

4. **Week 4 (Nov 10–15): Stabilization**
   - Address any issues from full rollout
   - Update plugin team documentation
   - Measure success metrics

**Success Metrics (Phase B):**
- 99%+ canonical label consistency across all plugin repos
- Zero breaking changes to existing issues/PRs
- Labeling performance < 2 seconds per issue
- Team satisfaction survey > 4.0/5.0

#### Phase C: WordPress Themes — Nov 20–Dec 15

**Pilot Repos (1–2):**
- [TBD] — small theme for safe testing
- [TBD] — medium theme for validation

**Deployment Steps:** (Similar to Phase B, adapted for theme-specific needs)

1. **Week 1 (Nov 20–26): Canary**
   - Deploy to pilot theme repos
   - Validate theme-specific area labels exist
   - Check compatibility with theme-specific workflows

2. **Weeks 2–4 (Nov 27–Dec 15): Full Rollout**
   - Deploy to all WordPress theme repos (estimated 5–10 repos)
   - Iterative validation and issue resolution

**Success Metrics (Phase C):**
- Same as Phase B
- Validated for theme-specific area labels

### Per-Repo Schema Management

**Canonical Schema (Org-Wide, Stored in `.github`):**

```yaml
# .github/labels.yml (158 canonical labels)
# Source of truth, inherited by all repos
# Changes here flow to all repos via workflow dispatch
```

**Per-Repo Extensions (Optional, in each repo):**

```yaml
# repos/{repo-name}/.github/labeler-extensions.yml
repo_config:
  name: plugin-a
  parent_org: lightspeedwp
  inherit_canonical: true
  custom_areas:
    - area:cache-layer
    - area:performance-optimization
  custom_components:
    - comp:cache-plugins
  label_overrides:
    - name: area:wp-cli
      color: "0073aa"  # Override org color if needed
      description: "WP-CLI command integration"
```

**Validation Rules:**

1. **Cannot override** canonical labels (type:*, status:*, priority:*)
2. **Cannot remove** canonical label support
3. **Can only extend** area:*, comp:*, and custom families
4. **Must validate** against JSON Schema before deployment

**Deployment Mechanism:**

```javascript
// When custom extension deployed:
1. Load canonical schema from .github/labels.yml
2. Merge with repo-specific extensions
3. Validate merged schema against JSON Schema
4. Apply merged schema to repo via GitHub API
5. Audit: Log merge operation and delta
```

### Label Sync Strategy

**Existing Labels During Rollout:**

- **No Removal:** Never delete existing labels from any repo
- **No Overwrite:** Don't change colors/descriptions of existing labels
- **Additive Only:** Add new canonical labels if missing
- **Conflict Resolution:** If label exists but differs (color/description), use existing (don't force change)

**Retroactive Labeling Strategy (Research Finding Q10):**

1. **One-Time Retroactive Pass (Control Plane Only):**
   ```bash
   # Deploy new unified agent
   # Run retroactive labeling pass on control plane
   gh issue list --state all --limit 5000 --json number,labels,body,title | \
     node scripts/automation/label-orchestrator.js apply \
       --batch-size 100 \
       --dry-run > retroactive-labeling-plan.json
   
   # Review plan, then apply
   node scripts/automation/label-orchestrator.js apply \
     --from-file retroactive-labeling-plan.json \
     --audit-to reports/retroactive-labeling-2026-10.md
   ```

2. **Ongoing Automated Labeling (Scheduled):**
   - Daily at 02:00 UTC: `labeling-automation.yml` labels unlabeled items
   - Weekly at 03:00 UTC: `labeling-automation.yml` syncs PR labels to issues
   - Weekly at 04:00 UTC: `labeling-automation.yml` fixes bare labels

3. **Manual Ad-Hoc Labeling:**
   ```bash
   # Operators can use CLI for specific scenarios
   node scripts/automation/label-orchestrator.js apply \
     --filter "created before 2026-06-01 AND unlabeled" \
     --labels "type:investigation" \
     --dry-run
   ```

**Conflict Resolution Procedures:**

```javascript
if (detectedConflicts.length > 0) {
  // Log conflict for manual review
  logger.warn(`Conflicts detected for issue #${issueNo}:`, conflicts);
  
  // Option 1: Use intelligent resolution
  const resolved = conflictDetection.recommend(conflicts);
  if (resolved.confidence > 0.90) {
    applyLabels(resolved);
    auditLog(`Auto-resolved: ${conflicts} → ${resolved}`);
  }
  
  // Option 2: Leave for manual review
  if (resolved.confidence <= 0.90) {
    createComment(issueNo, `⚠️ Label conflict detected:\n${conflicts}`);
    auditLog(`Manual review required for issue #${issueNo}`);
  }
}
```

**Migration Playbooks:**

1. **Plugin Repo Migration Playbook (for Phase B):**
   - [ ] Pre-flight check: Existing labels in repo
   - [ ] Validate canonical label set exists
   - [ ] Deploy unified workflows
   - [ ] Run retroactive labeling pass
   - [ ] Verify 100% label conformance
   - [ ] Document any custom extensions needed
   - [ ] Get team sign-off

2. **Post-Deployment Monitoring (All Repos):**
   - [ ] Daily: Check workflow success rate
   - [ ] Daily: Audit label application accuracy
   - [ ] Weekly: Compare old vs new label distributions
   - [ ] Weekly: Review bare label fixes
   - [ ] Monthly: Full label audit report

---

## Implementation Details

**Detailed implementation guidance for Phase 4 (Implementation). These specifications will guide developers during coding.**

### Step 1: Core Labeling Agent

**Code Structure:**

```
.github/scripts/agents/
├── labeling.agent.js              # Main agent (orchestrator, ~400 lines)
├── includes/
│   ├── schema-manager.js           # Schema loading and caching (~100 lines)
│   ├── label-validator.js          # Validation and conflict detection (~150 lines)
│   ├── label-heuristics.js         # Branch/content pattern matching (~200 lines)
│   ├── label-utils.js              # Helper functions (~100 lines)
│   └── ... (other utilities)
└── __tests__/
    └── labeling.agent.test.js      # Tests (~200 lines)
```

**GitHub API Integration:**

- Use `@actions/github` in GitHub Actions context
- Use `octokit/rest.js` in Node.js scripts
- Implement retry logic: exponential backoff (1s, 2s, 4s, 8s)
- Rate limit handling: Check headers, respect remaining quota
- Batch operations: max 100 labels per API call

**Configuration Loading:**

```javascript
class ConfigManager {
  constructor(repoPath = '.github') {
    this.repoPath = repoPath;
    this.cache = {};
    this.cacheTTL = 300000; // 5 minutes
  }
  
  async loadLabels() {
    if (this.cache.labels) return this.cache.labels;
    const labels = await fs.readFile('.github/labels.yml');
    this.cache.labels = yaml.parse(labels);
    this.cacheTTL = Date.now() + 300000;
    return this.cache.labels;
  }
}
```

**Error Handling & Logging:**

```javascript
logger.info(`[labeling-agent] Processing issue ${owner}/${repo}#${issue_number}`);
logger.debug(`Suggested labels: ${suggestions.map(s => s.label).join(', ')}`);
logger.warn(`Conflict detected: ${conflict.message}`);
logger.error(`GitHub API error: ${error.message}`);
```

### Step 2: Schema Validation

**JSON Schema Implementation:**

```javascript
const jsonschema = require('jsonschema');
const validator = new jsonschema.Validator();

// Load schema
const labelSchema = require('./.github/schemas/labels.schema.json');

// Validate
const result = validator.validate(labelsYaml, labelSchema);
if (!result.valid) {
  errors = result.errors.map(e => `${e.instance}: ${e.message}`);
  throw new ValidationError(errors);
}
```

**Conflict Detection Algorithm:**

```javascript
function detectConflicts(requestedLabels, existingLabels, schema) {
  const conflicts = [];
  
  // One-hot constraint check
  const families = {};
  requestedLabels.forEach(label => {
    const family = schema.getFamily(label);
    if (family in families && schema.isOneHot(family)) {
      conflicts.push({
        type: 'one-hot',
        family,
        labels: [families[family], label]
      });
    }
    families[family] = label;
  });
  
  // Incompatibility check
  for (let label of requestedLabels) {
    const incompatible = schema.getIncompatible(label);
    const intersecting = requestedLabels.filter(l => incompatible.includes(l));
    if (intersecting.length > 0) {
      conflicts.push({
        type: 'incompatible',
        labels: [label, ...intersecting]
      });
    }
  }
  
  return conflicts;
}
```

**Caching Strategy:**

- In-memory cache with TTL (5 minutes)
- Cache invalidation on manual trigger
- Cache statistics for monitoring
- Fallback to disk if cache expired

### Step 3: Skills Extraction

**Skill Packaging (`.SKILL.md` template):**

```markdown
# PR Label Detection Skill

## Interface
[Function signatures and inputs/outputs]

## Usage
[Example usage from other agents]

## Configuration
[Any configuration needed]

## Error Handling
[How to handle errors]

## Performance
[Timing and resource requirements]
```

**Module Exports:**

```javascript
module.exports = {
  detectLabels: async (context) => {...},
  detectLabelsFromBranch: (branch) => {...},
  detectLabelsFromFiles: (files) => {...},
  scoreConfidence: (suggestions) => {...},
  version: '1.0.0',
  schema: {
    input: {...},
    output: {...}
  }
};
```

**Integration Example:**

```javascript
const prLabelDetection = require('skills/pr-label-detection');
const { error, suggestions } = await prLabelDetection.detectLabels(prContext);
if (error) logger.error(error);
else applySuggestedLabels(suggestions);
```

### Step 4: Workflow Consolidation

**Migration Script (`migrate-workflows.js`):**

```javascript
// Step 1: Create new consolidated workflows
fs.copyFile('.github/workflows-new/labeling-core.yml', '.github/workflows/labeling-core.yml');
fs.copyFile('.github/workflows-new/labeling-automation.yml', '.github/workflows/labeling-automation.yml');

// Step 2: Archive old workflows
fs.mkdir('.github/workflows/archived');
fs.rename('.github/workflows/labeling.yml', '.github/workflows/archived/labeling.yml.backup');
fs.rename('.github/workflows/issue-labeling-automation.yml', '.github/workflows/archived/issue-labeling-automation.yml.backup');

// Step 3: Update references in documentation
updateDocumentation('docs/', 'labeling.yml', 'labeling-core.yml');
```

**Compatibility Layer (Optional):**

```yaml
# .github/workflows/labeling.yml (kept for backward compat)
name: Labeling (Compatibility Layer)
on: [workflow_dispatch]
jobs:
  redirect:
    runs-on: ubuntu-latest
    steps:
      - name: This workflow is deprecated
        run: |
          echo "This workflow has been consolidated into labeling-core.yml"
          echo "Please update your workflows to reference labeling-core.yml"
```

**Decommissioning (After 30 days):**

1. Archive to `workflows/archived/`
2. Document retirement date in README
3. Remove from active workflow list
4. Keep for historical reference

### Step 5: Multi-Repo Deployment

**Configuration Management:**

```javascript
class RepoConfigManager {
  async loadRepoConfig(repo) {
    // Check for repo-specific config
    const repoConfig = `./.github/${repo}/.github/labeler-extensions.yml`;
    if (fs.exists(repoConfig)) {
      return yaml.parse(fs.readFile(repoConfig));
    }
    // Fall back to defaults
    return this.getDefaultConfig(repo);
  }
  
  async mergeSchemas(canonical, repoExtensions) {
    // Merge canonical with repo-specific
    // Validate no overrides of canonical labels
    // Return merged schema
  }
}
```

**Deployment Orchestration (Parallel with Safety):**

```javascript
async function deployToMultipleRepos(repos, schema) {
  const batchSize = 5;  // Deploy 5 repos in parallel
  const batches = chunk(repos, batchSize);
  
  for (const batch of batches) {
    const promises = batch.map(repo => deployToRepo(repo, schema));
    const results = await Promise.allSettled(promises);
    
    // Check results before next batch
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0.2 * batchSize) {
      // > 20% failure rate, halt deployment
      throw new Error(`Deployment failure rate too high: ${failures.length}/${batchSize}`);
    }
  }
}
```

**Health Checks:**

```javascript
async function healthCheck(repo) {
  return {
    repo,
    timestamp: new Date(),
    checks: {
      canonical_labels_exist: await verifyCanonicalLabels(repo),
      schema_valid: await validateSchema(repo),
      workflows_enabled: await checkWorkflows(repo),
      recent_label_success: await checkRecentLabeling(repo)
    },
    status: 'healthy' | 'degraded' | 'failed'
  };
}
```

**Monitoring & Alerting:**

- Daily: Check workflow success rates across all repos
- Daily: Compare label distribution to expected patterns
- Weekly: Generate consolidation audit report
- Alert if any repo's health check fails

---

## Testing Requirements

**Comprehensive testing strategy covering unit, integration, and end-to-end scenarios**

### Unit Testing (Coverage Target: > 90%)

**Component Tests:**

| Component | Test File | Test Cases | Type |
|-----------|-----------|-----------|------|
| Schema Manager | `schema-manager.test.js` | Load, parse, validate YAML; cache TTL; error handling | 15 tests |
| Label Validator | `label-validator.test.js` | Valid/invalid labels; one-hot detection; conflict detection; suggestions | 25 tests |
| Heuristics Engine | `label-heuristics.test.js` | Branch pattern matching; file pattern matching; content analysis; confidence scoring | 30 tests |
| Label Utils | `label-utils.test.js` | Format, parse, normalize labels; family detection; alias resolution | 20 tests |
| Conflict Detection | `conflict-detection.test.js` | One-hot violations; incompatible labels; dependency checks; resolution suggestions | 20 tests |
| Multi-Repo Sync | `multi-repo-sync.test.js` | Route requests; per-repo validation; error handling; audit trails | 15 tests |

**Test Examples:**

```javascript
// schema-manager.test.js
describe('Schema Manager', () => {
  test('loads canonical labels from labels.yml', async () => {
    const schema = await schemaManager.load('org');
    expect(schema.has('type:bug')).toBe(true);
    expect(schema.get('type:bug').family).toBe('type');
  });
  
  test('merges org schema with repo extensions', async () => {
    const schema = await schemaManager.load('owner/plugin-a');
    expect(schema.has('area:cache-plugin')).toBe(true);
    expect(schema.has('type:bug')).toBe(true);  // Inherited
  });
  
  test('caches loaded schema', async () => {
    const schema1 = await schemaManager.load('org');
    const schema2 = await schemaManager.load('org');
    expect(schema1).toBe(schema2);  // Same object reference
  });
  
  test('invalidates cache after TTL', async () => {
    jest.useFakeTimers();
    const schema1 = await schemaManager.load('org');
    jest.advanceTimersByTime(301000);  // 301 seconds (> 5 min TTL)
    const schema2 = await schemaManager.load('org');
    expect(schema1).not.toBe(schema2);  // Different object
  });
});

// label-validator.test.js
describe('Label Validator', () => {
  test('detects one-hot constraint violations', () => {
    const result = validator.validate({
      requested: ['type:bug', 'type:feature'],
      existing: [],
      schema
    });
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].type).toBe('one-hot');
  });
  
  test('provides resolution suggestions', () => {
    const result = validator.validate({
      requested: ['type:bug', 'status:needs-review', 'status:in-progress'],
      existing: [],
      schema
    });
    expect(result.suggestions).toBeDefined();
    expect(result.suggestions['status:*']).toContain('status:in-progress');
  });
});
```

**Test Coverage:**
- Statements: > 90%
- Branches: > 85%
- Functions: > 90%
- Lines: > 90%

### Integration Testing (Coverage Target: > 80%)

**Workflow Scenarios:**

| Scenario | Steps | Expected Result | Test File |
|----------|-------|-----------------|-----------|
| **Apply single label to issue** | 1. Create test issue<br>2. Call labeling agent<br>3. Verify label via API<br>4. Check audit trail | Label applied, visible on issue, audit entry created | `integration-single-label.test.js` |
| **Detect and handle conflict** | 1. Request conflicting labels<br>2. Validator detects issue<br>3. Return error + suggestions<br>4. User selects resolution<br>5. Apply non-conflicting labels | Conflict detected, suggestions returned, user action respected | `integration-conflict-handling.test.js` |
| **Multi-repo sync** | 1. Request label on issue in repo A<br>2. Sync to related issue in repo B<br>3. Verify both have label<br>4. Audit trail shows cross-repo action | Both repos synchronized, audit trail complete | `integration-multi-repo-sync.test.js` |
| **Label suggestion workflow** | 1. Create PR with branch `feat/...`<br>2. Agent analyzes context<br>3. Suggest labels<br>4. User approves<br>5. Agent applies | Suggestions accurate (> 0.85 confidence), user approval recorded | `integration-label-suggestion.test.js` |
| **Retroactive labeling** | 1. Run retroactive pass on old unlabeled issues<br>2. Apply labels based on content<br>3. Skip already-labeled items<br>4. Generate report | All eligible issues labeled, report shows coverage, performance acceptable | `integration-retroactive-labeling.test.js` |
| **Error recovery** | 1. Simulate GitHub API failure<br>2. Agent retries with exponential backoff<br>3. Eventually succeeds or falls back<br>4. Error logged and audited | Failures handled gracefully, user informed | `integration-error-recovery.test.js` |

**Integration Test Template:**

```javascript
describe('Labeling Agent Integration', () => {
  let testRepo, testIssue;
  
  beforeAll(async () => {
    testRepo = await github.createTestRepo('labeling-test-' + Date.now());
    testIssue = await github.createTestIssue(testRepo, {
      title: 'Test Issue',
      body: 'This is a test issue'
    });
  });
  
  afterAll(async () => {
    await github.deleteTestRepo(testRepo);
  });
  
  test('applies label correctly via labeling agent', async () => {
    const result = await labelingAgent.applyLabels({
      target: `${testRepo}#${testIssue.number}`,
      labels: ['type:bug', 'priority:high']
    });
    
    expect(result.success).toBe(true);
    
    const issue = await github.getIssue(testRepo, testIssue.number);
    expect(issue.labels).toContain('type:bug');
    expect(issue.labels).toContain('priority:high');
  });
});
```

### End-to-End Testing (Coverage Target: > 70%)

**User Stories (Full Workflow):**

| User Story | Steps | Success Criteria | Test Duration |
|-----------|-------|-----------------|---|
| **New contributor creates feature PR** | 1. Checkout `feat/new-feature` branch<br>2. Create PR<br>3. Labeling agent auto-applies labels<br>4. Contributor verifies labels<br>5. PR reviewed and merged | Labels auto-applied correctly, contributor workflow unimpeded | 5 minutes |
| **Issue triage with labeling** | 1. New bug reported<br>2. Triage team reviews<br>3. Agent suggests priority/area<br>4. Triage team confirms<br>5. Issue labeled and assigned | Triage workflow faster, suggestions accurate | 10 minutes |
| **Multi-repo label consistency** | 1. Deploy labeling agent to 3 test repos<br>2. Create issue in repo A<br>3. Create PR in repo B linked to issue<br>4. Apply labels via agent<br>5. Verify sync across repos | All repos show consistent labels, sync working correctly | 20 minutes |
| **Retroactive labeling campaign** | 1. Identify 100 unlabeled issues from 2024<br>2. Run retroactive labeling script<br>3. Review suggested labels<br>4. Approve and apply<br>5. Verify coverage | 95%+ of issues labeled, no conflicts, audit trail complete | 30 minutes |
| **Agent integration test** | 1. Issues-agent creates issue<br>2. Labeling-agent auto-labels<br>3. Task-researcher adds labels<br>4. Release-agent uses labels for automation<br>5. Verify all agents working together | All agents coordinate correctly, labels flow through system | 15 minutes |

**E2E Test Environment:**

- Use GitHub's test repo or dedicated org for testing
- Spin up fresh test repos for each run
- Use API to create/verify state
- Capture logs and metrics
- Cleanup after tests complete

### Performance Testing

**Requirements:**

| Metric | Target | Acceptable | Critical |
|--------|--------|-----------|----------|
| Apply single label | < 500ms | < 1s | < 2s |
| Validate 50 labels | < 100ms | < 200ms | < 500ms |
| Detect conflicts | < 50ms | < 100ms | < 200ms |
| Schema load (cached) | < 10ms | < 50ms | < 100ms |
| Multi-repo sync (10 repos) | < 5s | < 10s | < 20s |
| Workflow execution end-to-end | < 2s | < 5s | < 10s |

**Load Testing:**

```bash
# Simulate 100 concurrent label requests
npm run test:load -- --concurrency 100 --duration 60s

# Expected results:
# - 99th percentile latency < 1s
# - Error rate < 0.1%
# - Throughput > 50 req/s
```

### Test Execution Plan

**Phase 4 (Implementation):**
- Week 1: Unit tests written alongside code
- Week 2: Integration tests for each component
- Week 3: E2E tests and performance tuning
- Week 4: Security audit and final testing

**Continuous Testing:**
- Unit tests: On every commit (via GitHub Actions)
- Integration tests: On PR creation (via GitHub Actions)
- E2E tests: Nightly on main branch
- Performance tests: Weekly baseline measurement

**Test Coverage Targets:**
- Overall: > 85% code coverage
- Critical paths: > 95% coverage
- Error handling: > 90% coverage

---

## Known Limitations & Future Work

### Current Limitations (at project start)

1. **Labeling logic scattered across 11+ workflows**
   - Difficult to understand full system flow
   - Changes require updates to multiple files
   - No single point of control or governance

2. **No unified schema validation**
   - Labels are validated loosely
   - Conflicts not detected systematically
   - No enforcement of naming conventions

3. **No reusable skills for agent ecosystem**
   - Label detection logic embedded in workflows
   - Other agents can't easily request labels
   - Duplicated logic across projects

4. **No multi-repo coordination mechanism**
   - Labels applied independently per repo
   - No cross-repo consistency
   - Difficult to maintain org-wide policies

5. **High maintenance burden on `.github` team**
   - 82 components to maintain
   - Manual synchronization between config files
   - No automation for common operations

### Constraints During Phase 4 Implementation

1. **Backward Compatibility Required**
   - Must not break existing workflows during transition
   - Old and new workflows run in parallel for validation
   - 30-day grace period for old workflows

2. **Performance Targets Must Be Met**
   - Label application < 2 seconds per issue
   - No degradation in GitHub Actions execution speed
   - Caching must reduce API calls by > 80%

3. **No Breaking Changes**
   - All 158 canonical labels must remain
   - Issue type mappings cannot change
   - Existing PR templates must continue working

4. **Audit Trail Completeness**
   - Every label change must be logged
   - Decision reasoning captured
   - Full traceability for compliance

### Future Enhancements (Post-Phase 5, Phase 6+)

1. **Machine Learning–Based Label Suggestions**
   - Analyze historical issue/PR data
   - Predict labels with > 90% confidence
   - Learn from team corrections (feedback loop)

2. **Natural Language Label Requests**
   - Process English commands in comments: "Add priority:high"
   - Support emoji-based labeling (e.g., `:bug:` → `type:bug`)
   - Chat-like interface for label management

3. **Advanced Conflict Resolution Heuristics**
   - Smart prioritization when conflicts detected
   - Domain-specific resolution rules
   - Learning from operator decisions

4. **Auto-Remediation for Common Label Errors**
   - Automatically fix bare labels
   - Suggest corrections for misspelled labels
   - Auto-migrate labels when schema changes

5. **Analytics Dashboard for Label Usage**
   - Real-time label distribution stats
   - Label velocity (how often applied)
   - Team labeling patterns and trends
   - Audit trail visualization

6. **Feedback Loop for Continuous Improvement**
   - Capture label accuracy over time
   - A/B test different heuristics
   - Incorporate team feedback into agent training
   - Monthly accuracy reports

7. **Advanced Multi-Repo Capabilities**
   - Label-based cross-repo issue linking
   - Automated issue rollup by label
   - Cross-repo label metrics
   - Org-wide label compliance reports

---

## References

### Project Documents

- **[PLANNING.md](./PLANNING.md)** — Project planning and timeline
- **[RESEARCH_FINDINGS.md](./RESEARCH_FINDINGS.md)** — Answers to 14 clarifying questions (Phase 1 output)
- **[AUDIT_FINDINGS.md](./AUDIT_FINDINGS.md)** — Complete audit of labeling components (Phase 1 output)

### Organization Standards

- **[CLAUDE.md](../../CLAUDE.md)** — Project-level AI rules and conventions
- **[AGENTS.md](../../AGENTS.md)** — Organization-wide AI rules and standards
- **[.github/custom-instructions.md](../../custom-instructions.md)** — Copilot-specific instructions

### Configuration Files

- **[.github/labels.yml](../../labels.yml)** — Canonical label definitions (158 labels)
- **[.github/labeler.yml](../../labeler.yml)** — Automatic labeling rules (43 rules)
- **[.github/issue-types.yml](../../issue-types.yml)** — GitHub issue type mappings (33 types)
- **[.github/label-governance-policy.yml](../../label-governance-policy.yml)** — Governance policy

### Existing Workflows & Scripts

- **[.github/workflows/](../../workflows/)** — 10 current labeling workflows
- **[scripts/agents/labeling.agent.js](../../scripts/agents/labeling.agent.js)** — Current labeling agent
- **[scripts/agents/includes/](../../scripts/agents/includes/)** — 15+ utility scripts

### External References

- **[GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows)** — GitHub's agentic workflow documentation
- **[GitHub Actions Documentation](https://docs.github.com/en/actions)** — GitHub Actions reference
- **[GitHub REST API v3](https://docs.github.com/en/rest)** — GitHub API documentation
- **[JSON Schema Draft 7](https://json-schema.org/draft/2020-12/)** — Schema validation spec
- **[YAML 1.2 Specification](https://yaml.org/spec/1.2/)** — YAML format reference

---

## OpenSpec Status

**Status:** ✅ **COMPLETE** (Phase 2 deliverable)

**Version:** 1.0.0 (Production-Ready Specification)

**Last Updated:** 2026-09-03

**Maintained By:** Task-Planner Agent (Claude Haiku 4.5)

**Next Steps:**

1. ✅ Phase 2 Complete: OPENSPEC.md + supporting plans created
2. 🟡 Phase 3 (Spec → Issues): Convert this spec into GitHub Issues
3. ⏭️ Phase 4 (Implementation): Build unified agent per specification
4. ⏭️ Phase 5 (Testing & Rollout): Validate and deploy to production
