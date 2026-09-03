---
file_type: documentation
title: Reusable Skills Extraction Plan
description: Strategy for extracting high-reuse labeling components as portable skills for the agent ecosystem
created_date: 2026-09-03
last_updated: 2026-09-03
status: draft
tags:
  - skills
  - extraction
  - reusability
  - agent-ecosystem
---

# Reusable Skills Extraction Plan

**Status:** 🟡 Draft (Phase 2 specification)  
**Owner:** Task-Planner Agent  
**Version:** 1.0.0  
**Related:** [PLANNING.md](./PLANNING.md) | [AUDIT_FINDINGS.md](./AUDIT_FINDINGS.md) | [OPENSPEC.md](./OPENSPEC.md)

---

## Executive Summary

This document outlines the extraction strategy for identifying high-reuse labeling components as portable skills for the agent ecosystem. From Phase 1 audit findings, 5 core skills have been identified with 70%+ reuse potential across labeling workflows.

**Skills to Extract:**
1. **PR Label Detection Skill** — Auto-label PRs by branch name, files changed, description
2. **Issue Type→Label Mapping Skill** — Map issue types to appropriate labels
3. **Status/Priority Inference Skill** — Infer workflow state and urgency from issue/PR content
4. **Label Conflict Detection Skill** — Validate label combinations against schema rules
5. **Multi-Repo Label Sync Skill** — Synchronize labels across repositories

**Target Location:** `skills/labeling/` (portable, reusable across agent ecosystem)  
**Reuse Potential:** 70%+ (used by issues-agent, task-planner, task-researcher, release-agent, changelog-agent)

---

## 1. High-Reuse Skills Identified

### 1.1 Skill Audit from Phase 1

**From AUDIT_FINDINGS.md:**
- 37 labeling scripts identified (consolidation target)
- Duplicated logic across 3+ workflows per function
- High reuse potential: PR labeling, issue typing, sync logic

**Reuse Pattern Analysis:**

| Skill | Workflows Using | Scripts Using | Reuse % | Priority |
|-------|-----------------|---------------|---------|----------|
| **PR Label Detection** | 3 (pr-labeler, labeling, governance-validation) | 4 | 85% | **HIGH** |
| **Issue Type→Label Mapping** | 2 (issue-labeler, labeling) | 3 | 80% | **HIGH** |
| **Status/Priority Inference** | 3 (issue-labeler, governance-validation, release-labeling) | 2 | 75% | **HIGH** |
| **Label Conflict Detection** | 2 (validate-labels, governance-validation) | 3 | 70% | **MEDIUM** |
| **Multi-Repo Label Sync** | 2 (sync-labels, milestone-sync) | 2 | 70% | **MEDIUM** |
| **Changelog Label Application** | 1 (auto-changelog-labels) | 1 | 65% | **MEDIUM** |
| **Metrics Collection** | 1 (issue-metrics) | 1 | 50% | **LOW** |

---

## 2. Skill Specifications

### 2.1 Skill 1: PR Label Detection

**Purpose:** Auto-label PRs based on branch name, changed files, and description

**Interface:**
```javascript
{
  // Input
  pr: {
    title: string,
    body: string,
    branch: string,
    files_changed: string[],
    author: string
  },
  
  // Output
  labels: string[],  // e.g., ["type:feature", "area:ci", "lang:typescript"]
  confidence: {
    label_name: number  // 0-1 confidence score
  },
  reasoning: {
    label_name: string  // Why this label was assigned
  }
}
```

**Detection Logic:**
1. **Branch-based** — Parse branch prefix (e.g., `feat/` → `type:feature`)
2. **File-based** — Match changed files to areas (e.g., `.github/workflows/` → `area:ci`)
3. **Content-based** — Keyword matching in title/body for type, priority, area
4. **Author-based** — Detect first-time contributor (→ `meta:first-time-contributor`)

**Conflict Resolution:**
- Type labels: One per PR (pick highest confidence)
- Area labels: Multiple allowed
- Meta labels: Multiple allowed

**Success Criteria:**
- ≥90% accuracy on manual test set
- Handles edge cases (multiple types, conflicting signals)
- Fallback to human review when confidence <60%

---

### 2.2 Skill 2: Issue Type→Label Mapping

**Purpose:** Map GitHub issue types to canonical label set

**Interface:**
```javascript
{
  // Input
  issue_type: string,  // e.g., "Bug", "Feature Request", "Question"
  keywords: string[],  // From issue title + body
  reporter: {
    is_maintainer: boolean,
    past_issues: number
  },
  
  // Output
  labels: string[],
  confidence: {
    label_name: number
  },
  suggestions: [
    {
      label: string,
      trigger: string,
      confidence: number
    }
  ]
}
```

**Mapping Rules:**
- `Bug` → `type:bug`, `status:needs-triage`
- `Feature Request` → `type:feature`, `status:needs-triage`
- `Documentation` → `type:documentation`
- `Question` → `type:question`, `area:support`
- `Security` → `type:security`, `priority:critical`, `status:needs-review`

**Keyword-Based Enhancements:**
- Keywords: `[crash, error, failing]` → `priority:high`
- Keywords: `[docs, readme, example]` → `area:docs`
- Keywords: `[breaking, incompatible]` → `release:breaking`

---

### 2.3 Skill 3: Status/Priority Inference

**Purpose:** Infer workflow state and urgency from content signals

**Interface:**
```javascript
{
  // Input
  content: string,  // Issue/PR title + body
  metadata: {
    created_by: string,
    existing_labels: string[],
    milestone: string
  },
  
  // Output
  inferred_status: string,  // "needs-triage", "ready", "in-progress", "blocked"
  inferred_priority: string,  // "critical", "high", "normal", "low"
  confidence: {
    status: number,
    priority: number
  },
  reasoning: {
    status: string,
    priority: string
  }
}
```

**Inference Logic:**

**Status Inference:**
- Default: `status:needs-triage` (on creation)
- Keywords: `[blocked, waiting, cannot, depends]` → `status:blocked`
- Keywords: `[in progress, wip, working]` → `status:in-progress`
- If has assignee → `status:ready` (implied accepted)

**Priority Inference:**
- Keywords: `[critical, urgent, breaking, security]` → `priority:critical`
- Keywords: `[high, important]` → `priority:high`
- Multiple ⬆️ urgent signals → escalate priority
- If reopened → `priority:high`

---

### 2.4 Skill 4: Label Conflict Detection

**Purpose:** Validate label combinations against schema conflict matrix

**Interface:**
```javascript
{
  // Input
  labels: string[],
  
  // Output
  is_valid: boolean,
  conflicts: [
    {
      label1: string,
      label2: string,
      conflict_type: "mutual_exclusion" | "requires_pair" | "forbidden_combo"
    }
  ],
  suggestions: [
    {
      action: "remove" | "add" | "replace",
      label: string,
      reason: string
    }
  ]
}
```

**Conflict Rules:**
```yaml
mutual_exclusion:
  - [type:bug, type:feature]
  - [type:bug, type:documentation]
  - [type:epic, type:task]

requires_pair:
  - label: priority:critical
    requires: [area:*, status:needs-review]
  
  - label: type:security
    requires: [priority:critical, status:needs-review]

forbidden_combos:
  - [status:done, status:in-progress]
  - [release:breaking, type:documentation]
```

**Output Examples:**
- ✅ No conflicts: `["type:bug", "status:needs-triage", "priority:high"]`
- ❌ Conflict: `["type:bug", "type:feature"]` → "Mutual exclusion: only one type: label allowed"
- ⚠️ Warning: `["priority:critical"]` → "Missing recommended status:needs-review label"

---

### 2.5 Skill 5: Multi-Repo Label Sync

**Purpose:** Synchronize labels across repositories with canonical → custom resolution

**Interface:**
```javascript
{
  // Input
  source_repo: string,
  target_repos: string[],
  labels: {
    name: string,
    color: string,
    description: string
  }[],
  sync_mode: "canonical" | "merge" | "validate",
  
  // Output
  sync_results: {
    repo: string,
    status: "synced" | "conflict" | "custom-override" | "error",
    changes: {
      created: number,
      updated: number,
      skipped: number
    },
    conflicts: [
      {
        label: string,
        reason: string,
        resolution: string
      }
    ]
  }[]
}
```

**Sync Modes:**

1. **Canonical Mode**
   - Force all canonical labels to match source
   - Reject custom labels in target repos
   - Use case: Org-wide consistency enforcement

2. **Merge Mode**
   - Sync canonical labels
   - Preserve target-repo custom labels
   - Warn on conflicts
   - Use case: Multi-repo with custom extensions

3. **Validate Mode**
   - Check target repos against canonical
   - Report differences without changes
   - Recommend actions
   - Use case: Pre-deployment validation

**Conflict Resolution:**
- Custom label in target with same name: Flag as conflict, offer to:
  - Rename custom label (add `-custom` suffix)
  - Override canonical with custom (preserve target behavior)
  - Use canonical version (discard custom)

---

## 3. Skill Organization Structure

### 3.1 Directory Layout

```
skills/labeling/
├── README.md                          (Skill overview & index)
├── SKILL.md                          (Standard skill entrypoint)
├── package.json                      (Shared dependencies)
├── pr-label-detection/
│   ├── SKILL.md                     (Skill spec + examples)
│   ├── index.js                     (Exported function)
│   ├── rules.yml                    (Detection rules)
│   ├── test/
│   │   ├── fixtures.json           (Test cases)
│   │   └── pr-label-detection.test.js
│   └── docs/
│       └── EXAMPLES.md
├── issue-type-mapping/
│   ├── SKILL.md
│   ├── index.js
│   ├── rules.yml
│   ├── test/
│   └── docs/
├── status-priority-inference/
│   ├── SKILL.md
│   ├── index.js
│   ├── rules.yml
│   └── ...
├── label-conflict-detection/
│   ├── SKILL.md
│   ├── index.js
│   ├── schema.json
│   └── ...
├── multi-repo-label-sync/
│   ├── SKILL.md
│   ├── index.js
│   ├── sync-modes.yml
│   └── ...
└── utils/
    ├── label-utils.js               (Shared utilities)
    ├── schema-validator.js
    └── conflict-matrix.js
```

### 3.2 Shared Dependencies

**Common utilities to extract:**
- `label-utils.js` — Label parsing, family detection, normalization
- `schema-validator.js` — JSON Schema validation against canonical schema
- `conflict-matrix.js` — Label conflict lookup and resolution
- `pattern-matcher.js` — Regex-based keyword/branch matching

**External Dependencies:**
- `minimatch` — File glob matching for file-changed detection
- `json-schema-validator` — Schema validation
- Node.js built-ins only (no framework dependencies)

---

## 4. Integration with Agent Ecosystem

### 4.1 Usage by Existing Agents

| Agent | Skills Used | Integration Point |
|-------|-------------|-------------------|
| **issues-agent** | Issue Type→Label Mapping, Status/Priority Inference | Auto-label on issue creation |
| **task-researcher** | PR Label Detection, Label Conflict Detection | Validate labeling in audit workflow |
| **task-planner** | Status/Priority Inference, Label Conflict Detection | Infer task status from labels |
| **release-agent** | PR Label Detection, Conflict Detection | Find release-related PRs, validate labels |
| **changelog-agent** | PR Label Detection, Multi-Repo Label Sync | Identify PRs for changelog, sync data |

### 4.2 Skill Consumption Pattern

```javascript
// Example: How issues-agent uses skills
const { mapIssueTypeToLabels } = require('skills/labeling/issue-type-mapping');
const { validateConflicts } = require('skills/labeling/label-conflict-detection');

async function processNewIssue(issue) {
  // Step 1: Map issue type to labels
  const { labels, confidence } = await mapIssueTypeToLabels({
    issue_type: issue.body.type,
    keywords: extractKeywords(issue.body),
    reporter: issue.user
  });
  
  // Step 2: Validate for conflicts
  const { is_valid, conflicts } = await validateConflicts(labels);
  
  // Step 3: Apply if valid, else flag for review
  if (is_valid) {
    applyLabels(issue, labels);
  } else {
    flagForManualReview(issue, conflicts);
  }
}
```

---

## 5. Extraction & Development Timeline

### 5.1 Phase 4 Timeline (Extraction)

**Week 1 (Oct 1-5):** Extract & test skills
- [ ] Task 4.1: Extract PR Label Detection skill (3 scripts → 1 reusable module)
- [ ] Task 4.2: Extract Issue Type→Label Mapping skill
- [ ] Task 4.3: Extract Status/Priority Inference skill
- [ ] Task 4.4: Create shared utilities module

**Week 2 (Oct 8-12):** Advanced skills + integration
- [ ] Task 4.5: Extract Label Conflict Detection skill (2 scripts + schema)
- [ ] Task 4.6: Extract Multi-Repo Label Sync skill
- [ ] Task 4.7: Integrate with agent ecosystem (issues-agent, release-agent)
- [ ] Task 4.8: Create comprehensive test suite (>80% coverage)

### 5.2 Success Criteria

- All 5 skills extracted and tested independently
- Shared utilities module covers 90%+ of duplicated code
- Each skill has ≥3 integration tests
- Documentation includes usage examples
- Zero breaking changes to existing agent interfaces
- Performance: <500ms per skill invocation (including validation)

---

## 6. Backward Compatibility & Migration

### 6.1 Current → New Skill Migration

**Compatibility Strategy:**
- Existing workflows continue using inline logic
- New skills available as imports for new workflows
- Phased migration: new workflows use skills, old workflows deprecated gradually
- Wrapper function for legacy script compatibility

**Example Migration Path:**
```javascript
// OLD (before extraction)
const { labelPRByFiles } = require('./scripts/sync-pr-labels.js');

// NEW (after extraction)
const { detectLabels } = require('skills/labeling/pr-label-detection');

// BRIDGE (for backward compatibility)
async function labelPRByFiles(pr) {
  return await detectLabels({ pr, rules: legacyRules });
}
```

### 6.2 Validation & Testing

- Reproduce 100+ historical PR labelings with both old and new logic
- Compare results: expect ≥95% match rate
- Document intentional behavior changes
- Create migration guide for workflow authors

---

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Code Duplication Reduction | 80% (37 scripts → 5 skills + utils) | Line count comparison |
| Skill Reuse Rate | ≥70% | Used by 4+ agents |
| Test Coverage | >85% | Code coverage tool |
| Skill Performance | <500ms per invocation | Benchmark suite |
| Agent Integration Success | 100% | All 5 agents passing tests |
| Documentation Completeness | 100% | All skills have SKILL.md + examples |

---

## References

- [PLANNING.md](./PLANNING.md) — Project timeline and phases
- [AUDIT_FINDINGS.md](./AUDIT_FINDINGS.md) — Component audit with reuse analysis
- [OPENSPEC.md](./OPENSPEC.md) — Architecture overview
- [.github/AGENTS.md](../../AGENTS.md) — Agent ecosystem rules
- `skills/` directory structure — Portable skill format

---

**Plan Version:** 1.0.0  
**Created:** 2026-09-03  
**Last Updated:** 2026-09-03  
**Maintained By:** Claude
