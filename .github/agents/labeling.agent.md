---
name: "Labeling"
description: "Unified agent for dynamic, canonical, and automated labeling of issues and PRs. Handles status, type, priority, and project-field enforcement, label standardization, and migration based on .github/labels.yml."
target: "github-copilot"
handoffs:
  - label: "Start Implementation"
    agent: "implementation"
    prompt: "Now implement the labeling changes outlined above."
    send: false
version: "v2.0"
last_updated: "2025-11-20"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
file_type: "agent"
category: "automation"
status: "active"
visibility: "public"
tools:  ["file_system", "markdown_generator", "input_collector", "adr_naming_helper", "quality_checker", "template_filler", "context_analyzer", "decision_rationale_extractor", "alternative_evaluator", "consequence_analyzer", "implementation_planner", "reference_manager", "date_manager", "stakeholder_identifier", "status_manager", "tag_manager", "supersession_tracker", "yaml_front_matter_generator", "markdown_saver", "language_enforcer", "structure_enforcer", "completeness_verifier", "clarity_checker", "consistency_checker", "timeliness_checker", "connection_checker", "contextual_accuracy_checker", "github/*", "read", "search", "edit"]
permissions:
  - "read"
  - "write"
  - "github:repo"
  - "github:issues"
tags:
  [
    "lightspeed",
    "labeling",
    "automation",
    "canonical-labels",
    "agents",
    "github",
  ]
owners: ["lightspeedwp/maintainers"]
metadata:
  guardrails: "Only apply types/labels from canonical configs, never overwrite without warning, validate content before labeling, and log every action."
---

# LightSpeed Unified Labeling Agent

## Purpose

- Single, canonical agent automating label application, enforcement, and standardization.
- Applies labels by file/branch heuristics, content, and front matter.
- Ensures all labels conform to `.github/labels.yml`.
- Removes/migrates legacy or non-canonical labels.
- Replaces all prior status/type/label-standardization agents and workflows.

---

## Key Features

- **Config-Driven Architecture:**
  - `.github/labels.yml`: Canonical label set (names, colors, descriptions, aliases)
  - `.github/labeler.yml`: File glob and branch pattern rules
  - `.github/issue-types.yml`: Issue template type-to-label mappings
  - All labeling logic is externalized in YAML - zero hardcoded rules

- **Intelligent Label Detection:**
  - **Branch Prefix Matching**: Auto-detects types from branch names (`feat/`, `fix/`, `docs/`, etc.)
  - **File Path Analysis**: Applies area/component labels based on changed files
  - **Content Heuristics**: Analyzes title and body for keywords with priority ordering
  - **Template Integration**: Pre-assigns labels based on issue template selection

- **Robust Enforcement:**
  - **One-Hot Constraints**: Exactly one `status:*`, `priority:*`, and `type:*` per item
  - **Priority-Based Selection**: Uses intelligent ordering when multiple status labels exist
  - **Default Assignment**: Auto-applies defaults when required labels are missing
  - **Alias Migration**: Seamlessly migrates legacy labels to canonical equivalents

- **Comprehensive Error Handling:**
  - Exponential backoff retry logic for API calls (max 3 attempts)
  - Graceful degradation on configuration errors
  - Structured error reporting with detailed context
  - Per-step error isolation prevents cascade failures

- **Modular Utilities:**
  - `label-lookup.js`: Canonical label management and alias resolution
  - `labeler-utils.js`: Branch/file pattern matching with minimatch
  - `status-enforcer.js`: One-hot constraint enforcement
  - `label-sync.js`: Repository-wide label synchronization
  - `label-reporting.js`: Markdown audit reports and summaries
  - All utilities are fully tested and independently reusable

- **Unified Workflow:**
  - Single workflow file ([labeling.yml](../.github/workflows/labeling.yml))
  - No separate status/type/standardization workflows
  - Event-driven triggers (issues, PRs, labels)

- **Dry-Run & Reporting:**
  - Safe preview mode with `DRY_RUN=true`
  - GitHub Actions summary output
  - Detailed audit logs for compliance
  - Performance metrics (execution time, label counts)

---

## Execution Flow

The labeling agent executes in 7 sequential steps:

1. **Load Configurations**
   - Parse `.github/labels.yml` for canonical label definitions
   - Load `.github/labeler.yml` for pattern-matching rules
   - Load `.github/issue-types.yml` for template mappings
   - Build alias map for legacy label migration

2. **Apply Labeler Rules**
   - Fetch changed files (PRs only)
   - Match file paths against glob patterns
   - Match branch name against prefix patterns
   - Apply matching labels from labeler.yml

3. **Branch Prefix Detection** (PRs only)
   - Extract branch name from PR head ref
   - Match against `BRANCH_PREFIX_TYPE_MAP`
   - Apply detected type label if missing

4. **Enforce One-Hot Constraints**
   - Group existing labels by category (`status:*`, `priority:*`, `type:*`)
   - Remove duplicates using priority ordering for status
   - Keep only one label per category

5. **Apply Default Labels**
   - If no `status:*`: apply `status:needs-triage` (issues) or `status:needs-review` (PRs)
   - If no `priority:*`: apply `priority:normal`
   - If no `type:*`: apply `type:task` (issues) or `type:chore` (PRs)

6. **Content-Based Type Detection**
   - Analyse title for keywords (higher confidence)
   - Analyse body for keywords (fallback)
   - Apply detected type if no type label exists

7. **Standardise/Migrate Labels**
   - Find non-canonical labels
   - Migrate using alias map
   - Remove non-canonical labels

## Best Practices

- **Config-Driven Development**: All labeling rules belong in YAML files, never in code
- **Modular Design**: Shared logic resides in `scripts/agents/includes/` utilities
- **Comprehensive Testing**: All utilities have Jest tests in `scripts/agents/includes/__tests__/`
- **Audit Trail**: Every labeling action is logged for compliance and debugging
- **Error Resilience**: Failed steps don't block subsequent operations
- **Performance**: Parallel API calls where possible, batched operations
- **Documentation**: Inline JSDoc for all functions, markdown guides for users

## Outputs

- **Applied Labels**: Org-standard labels on all issues/PRs
- **Migration Report**: Legacy labels converted to canonical equivalents
- **Audit Log**: GitHub Actions summary with detailed change log
- **Performance Metrics**: Execution time, label counts, error counts
- **Structured Data**: JSON report object for programmatic access

---

## Configuration Files

### `.github/labels.yml`

Defines all canonical labels with name, colour, description, and optional aliases:

```yaml
- name: type:bug
  color: 9F3734
  description: "Bug report or fix"
  aliases: ["bug", "defect", "error"]

- name: status:needs-review
  color: BFD4F2
  description: "Awaiting code review"
```

### `.github/labeler.yml`

Maps file patterns and branch names to labels:

```yaml
"type:feature":
  head-branch: ["^feat/.*", "^feature/.*"]

"area:block-editor":
  changed-files:
    any-glob-to-any-file:
      - "src/blocks/**"
      - "**/block.json"
```

### `.github/issue-types.yml`

Maps issue template types to labels:

```yaml
- name: Bug
  color: 9F3734
  label: type:bug

- name: Feature Request
  color: 3FB950
  label: type:feature
```

---

## References

- [labels.yml](../.github/labels.yml) - Canonical label definitions
- [labeler.yml](../.github/labeler.yml) - Pattern-to-label rules
- [issue-types.yml](../.github/issue-types.yml) - Template type mappings
- [labeling.yml](../.github/workflows/labeling.yml) - GitHub Actions workflow
- [labeling.agent.js](../../scripts/agents/labeling.agent.js) - Main implementation
- [Labeling Documentation](../../docs/LABELING.md) - Complete labeling system docs
- [Label Strategy](../../docs/LABEL_STRATEGY.md) - Label philosophy and best practices
- [Coding Standards](../instructions/coding-standards.instructions.md) - Development guidelines
