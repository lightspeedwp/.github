---
file_type: documentation
title: "Skills Extraction Plan"
description: "Plan to extract 5 high-reuse labeling skills for use by agent ecosystem with interfaces, priorities, and integration points"
created_date: 2026-09-03
last_updated: 2026-09-03
status: complete
tags:
  - skills
  - extraction
  - agents
  - reusability
---

# Skills Extraction Plan

**Status:** ✅ Complete (Phase 2 Deliverable)  
**Owner:** Task-Planner Agent  
**Version:** 1.0.0  
**Related:** [OPENSPEC.md](./OPENSPEC.md), [RESEARCH_FINDINGS.md](./RESEARCH_FINDINGS.md#q11-shared-skills-priority)

---

## Executive Summary

This plan extracts **5 high-reuse labeling skills** from the unified labeling system into the `skills/` folder, making them available to any agent in the ecosystem (issues-agent, release-agent, task-researcher, changelog-agent, etc.).

**Research Finding Q11** prioritizes skills by reuse potential and implementation order:

| Priority | Skill | Reuse Rate | Effort | ROI |
|----------|-------|-----------|--------|-----|
| 🥇 **1** | PR Label Detection | 95%+ | Low | High |
| 🥇 **1** | Issue Type → Label Mapping | 85%+ | Low | High |
| 🥈 **2** | Status/Priority Inference | 70%+ | Medium | Medium |
| 🥈 **2** | Label Conflict Detection | 80%+ | Medium | High |
| 🥉 **3** | Multi-Repo Label Sync | 50%+ | High | Medium |

**Deliverable:** Detailed specification, interfaces, integration points, and implementation roadmap for Phase 4 developers.

---

## Skills Overview

### Skill 1: PR Label Detection ⭐⭐⭐ (Highest Priority)

**Purpose:** Detect and suggest appropriate labels based on PR metadata (branch name, changed files, title, description)

**Current Location:** Logic in `labeling.yml` + `labeler.yml` rules

**Reuse Potential:** 95%+  
**Used By:** issues-agent, release-agent, changelog-agent, pr-analyzer-agent

**Folder Structure:**
```
skills/pr-label-detection/
├── SKILL.md                 # Skill documentation
├── index.js                 # Main export
├── detect-from-branch.js    # Branch pattern parsing
├── detect-from-files.js     # File pattern matching
├── detect-from-content.js   # Content analysis (title/body keywords)
├── score-confidence.js      # Confidence scoring
├── __tests__/
│   ├── detect-from-branch.test.js
│   ├── detect-from-files.test.js
│   ├── detect-from-content.test.js
│   └── integration.test.js
└── README.md                # Usage examples
```

**Interface Definition:**

```javascript
// skills/pr-label-detection/index.js
module.exports = {
  /**
   * Detect labels from PR metadata
   * @param {Object} context - PR context
   * @param {string} context.branch - Branch name
   * @param {string} context.title - PR title
   * @param {string} context.description - PR description
   * @param {string[]} context.changed_files - Changed file paths
   * @param {string} context.author - Author GitHub handle
   * @returns {Promise<{labels, reasoning, confidence}>}
   */
  async detect(context) {},
  
  /**
   * Detect labels from branch name
   * Examples: feat/, fix/, docs/, release/, etc.
   */
  detectFromBranch(branchName) {},
  
  /**
   * Detect labels from changed files
   * Examples: src/blocks/**, docs/**, etc.
   */
  detectFromFiles(changedFiles) {},
  
  /**
   * Detect labels from PR content (title + body)
   * Keyword matching, sentiment analysis, etc.
   */
  detectFromContent(title, description) {},
  
  /**
   * Score and rank suggestions by confidence
   */
  scoreConfidence(suggestions) {}
};
```

**Usage Example:**

```javascript
const prLabelDetection = require('skills/pr-label-detection');

const suggestions = await prLabelDetection.detect({
  branch: 'feat/add-user-prefs',
  title: 'Add user preferences UI',
  description: 'Closes #456',
  changed_files: ['src/blocks/prefs-panel/**', 'docs/api.md'],
  author: 'ashleyshaw'
});

// Returns: {
//   labels: [
//     { label: 'type:feature', confidence: 0.95 },
//     { label: 'area:block-editor', confidence: 0.90 },
//     { label: 'meta:needs-changelog', confidence: 0.80 }
//   ],
//   reasoning: { ... }
// }
```

---

### Skill 2: Issue Type → Label Mapping ⭐⭐⭐ (Highest Priority)

**Purpose:** Map GitHub issue types to canonical labels automatically

**Current Location:** `issue-types.yml` mapping, labeling logic

**Reuse Potential:** 85%+  
**Used By:** issues-agent, task-researcher, task-planner

**Folder Structure:**
```
skills/issue-type-to-label-mapping/
├── SKILL.md
├── index.js
├── type-label-mapping.json  # Mapping data
├── __tests__/
│   └── mapping.test.js
└── README.md
```

**Interface Definition:**

```javascript
// skills/issue-type-to-label-mapping/index.js
module.exports = {
  /**
   * Get labels for issue type
   * @param {string} issueType - GitHub issue type ID
   * @param {Object} options - Optional overrides
   * @returns {string[]} Array of labels to apply
   */
  getLabels(issueType, options = {}) {},
  
  /**
   * Map multiple issue types
   * @param {Array<{type, customPriority?}>} items
   * @returns {Object} Type → labels mapping
   */
  mapMany(items) {},
  
  /**
   * Reverse lookup: label → issue type
   * @param {string} label - Label name
   * @returns {string} Issue type
   */
  getType(label) {},
  
  /**
   * Get all available issue types
   * @returns {string[]}
   */
  getAllTypes() {},
  
  /**
   * Get default labels for new issues
   * @returns {string[]}
   */
  getDefaultLabels() {}
};
```

**Mapping Data:**

```json
{
  "bug-report": {
    "labels": ["type:bug", "status:needs-triage", "priority:normal"],
    "priority_overrides": {
      "high": ["type:bug", "status:needs-triage", "priority:high"],
      "critical": ["type:bug", "status:needs-triage", "priority:critical"]
    }
  },
  "feature-request": {
    "labels": ["type:feature", "status:needs-triage"],
    "priority_overrides": {}
  }
}
```

---

### Skill 3: Status/Priority Inference ⭐⭐ (High Priority)

**Purpose:** Intelligently infer status and priority labels from context

**Reuse Potential:** 70%+  
**Used By:** labeling-agent (for defaults), task-researcher

**Folder Structure:**
```
skills/status-priority-inference/
├── SKILL.md
├── index.js
├── status-inference.js
├── priority-inference.js
├── __tests__/
│   ├── status-inference.test.js
│   └── priority-inference.test.js
└── README.md
```

**Interface Definition:**

```javascript
// skills/status-priority-inference/index.js
module.exports = {
  /**
   * Infer status label from context
   */
  inferStatus(context) {},
  
  /**
   * Infer priority label from context
   */
  inferPriority(context) {},
  
  /**
   * Infer both status and priority
   */
  inferMultiple(context, fields = ['status', 'priority']) {}
};
```

---

### Skill 4: Label Conflict Detection ⭐⭐ (High Priority)

**Purpose:** Detect invalid label combinations and suggest resolutions

**Reuse Potential:** 80%+  
**Used By:** labeling-agent (core validation), validators

**Folder Structure:**
```
skills/label-conflict-detection/
├── SKILL.md
├── index.js
├── detect-conflicts.js
├── resolve-conflicts.js
├── __tests__/
│   ├── detect-conflicts.test.js
│   └── resolve-conflicts.test.js
└── README.md
```

**Interface Definition:**

```javascript
// skills/label-conflict-detection/index.js
module.exports = {
  /**
   * Detect conflicts in label combination
   */
  detectConflicts(options) {},
  
  /**
   * Get resolution recommendations
   */
  getRecommendations(conflicts) {},
  
  /**
   * Resolve conflicts automatically (if confidence high)
   */
  autoResolve(conflicts) {}
};
```

---

### Skill 5: Multi-Repo Label Sync ⭐ (Medium Priority)

**Purpose:** Coordinate label application across multiple repositories

**Reuse Potential:** 50%+  
**Used By:** labeling-agent (for multi-repo scenarios), release-agent

**Folder Structure:**
```
skills/multi-repo-label-sync/
├── SKILL.md
├── index.js
├── sync-across-repos.js
├── per-repo-validator.js
├── __tests__/
│   └── sync-across-repos.test.js
└── README.md
```

**Interface Definition:**

```javascript
// skills/multi-repo-label-sync/index.js
module.exports = {
  /**
   * Sync labels across multiple repos
   */
  syncAcrossRepos(options) {},
  
  /**
   * Validate per-repo schema compatibility
   */
  validatePerRepo(repo, labels) {},
  
  /**
   * Get sync status for all target repos
   */
  getStatus() {}
};
```

---

## Integration with Agent Ecosystem

### Agent Integration Points

**Issues-Agent:**
```javascript
// When creating a new issue
const issueTypeMapping = require('skills/issue-type-to-label-mapping');
const prLabelDetection = require('skills/pr-label-detection');
const statusInference = require('skills/status-priority-inference');

const labels = issueTypeMapping.getLabels(issueType);
const inferredStatus = statusInference.inferStatus({...});
const allLabels = [...labels, inferredStatus];

// Then call labeling-agent to apply
```

**Release-Agent:**
```javascript
// When preparing a release
const prLabelDetection = require('skills/pr-label-detection');
const multiRepoSync = require('skills/multi-repo-label-sync');

// Find all release PRs
const releasePRs = findReleasePRs();

// Detect labels
releasePRs.forEach(pr => {
  const labels = prLabelDetection.detect({...});
  // Apply release:* labels
});

// Sync across repos if needed
multiRepoSync.syncAcrossRepos({...});
```

**Task-Researcher:**
```javascript
// When creating research/investigation issues
const issueTypeMapping = require('skills/issue-type-to-label-mapping');
const statusInference = require('skills/status-priority-inference');

const labels = issueTypeMapping.getLabels('investigation');
const priority = statusInference.inferPriority({
  urgency: 'high'
});
```

**Changelog-Agent:**
```javascript
// When identifying changelog-relevant PRs
const prLabelDetection = require('skills/pr-label-detection');

releasePRs.forEach(pr => {
  const labels = await prLabelDetection.detect({
    branch: pr.headRef,
    title: pr.title,
    description: pr.body,
    changed_files: pr.files
  });
  
  if (labels.some(l => l.label === 'type:feature')) {
    // Add to changelog
  }
});
```

---

## Implementation Roadmap

### Phase 4, Week 1: Skills 1 & 2 (Highest Priority)

- [ ] Extract PR label detection logic to `skills/pr-label-detection/`
- [ ] Extract issue type mapping to `skills/issue-type-to-label-mapping/`
- [ ] Document interfaces and usage
- [ ] Write unit tests (> 90% coverage)
- [ ] Publish to Skills Registry

**Effort:** 3–4 days

### Phase 4, Week 2: Skills 3 & 4 (High Priority)

- [ ] Implement status/priority inference in `skills/status-priority-inference/`
- [ ] Implement conflict detection in `skills/label-conflict-detection/`
- [ ] Write unit tests
- [ ] Document interfaces

**Effort:** 3–4 days

### Phase 4, Week 3: Skill 5 (Medium Priority)

- [ ] Implement multi-repo sync in `skills/multi-repo-label-sync/`
- [ ] Write unit tests
- [ ] Document interfaces
- [ ] Integration testing with labeling-agent

**Effort:** 2–3 days

### Phase 4, Week 4: Integration & Validation

- [ ] Integrate all skills with unified labeling agent
- [ ] End-to-end testing of skill ecosystem
- [ ] Performance benchmarking
- [ ] Documentation and examples

**Effort:** 2–3 days

---

## File Locations & Folder Structure

### Organization

```
skills/
├── pr-label-detection/
│   ├── SKILL.md
│   ├── package.json
│   ├── index.js
│   ├── detect-from-branch.js
│   ├── detect-from-files.js
│   ├── detect-from-content.js
│   ├── score-confidence.js
│   ├── __tests__/
│   └── README.md
│
├── issue-type-to-label-mapping/
│   ├── SKILL.md
│   ├── package.json
│   ├── index.js
│   ├── type-label-mapping.json
│   ├── __tests__/
│   └── README.md
│
├── status-priority-inference/
│   ├── SKILL.md
│   ├── package.json
│   ├── index.js
│   ├── status-inference.js
│   ├── priority-inference.js
│   ├── __tests__/
│   └── README.md
│
├── label-conflict-detection/
│   ├── SKILL.md
│   ├── package.json
│   ├── index.js
│   ├── detect-conflicts.js
│   ├── resolve-conflicts.js
│   ├── __tests__/
│   └── README.md
│
└── multi-repo-label-sync/
    ├── SKILL.md
    ├── package.json
    ├── index.js
    ├── sync-across-repos.js
    ├── per-repo-validator.js
    ├── __tests__/
    └── README.md
```

### SKILL.md Template

Each skill includes a SKILL.md file:

```markdown
# [Skill Name]

## Summary
[Brief description]

## Interface
[Function signatures]

## Usage Examples
[Real-world usage]

## Performance
[Timing requirements]

## Testing
[Test coverage and examples]

## Integration Points
[How other agents use this]

## References
[Related documentation]
```

---

## Success Criteria

- ✅ All 5 skills extracted and independently testable
- ✅ > 90% test coverage for each skill
- ✅ Clear, documented interfaces for external use
- ✅ Zero breaking changes to existing workflows
- ✅ Reuse confirmed with at least 1 external agent
- ✅ Performance benchmarks met (< 100ms per skill call)

---

**Status:** ✅ COMPLETE (Phase 2 Deliverable)  
**Version:** 1.0.0  
**Last Updated:** 2026-09-03  
**Maintained By:** Task-Planner Agent

