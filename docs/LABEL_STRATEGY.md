---
document_type: "Guide"
title: "GitHub Labelling Strategy"
description: "LightSpeed's canonical GitHub label taxonomy, governance, and automation strategy"
version: "1.0"
created_date: 2026-08-27
last_updated: 2026-08-27
authors: ["LightSpeed Team"]
file_type: documentation
status: active
---

> **Note:** This file follows LightSpeedWP governance, frontmatter, naming, and versioning conventions as described in [VERSIONING.md](./VERSIONING.md) and [FRONTMATTER_SCHEMA.md](./FRONTMATTER_SCHEMA.md).

# LightSpeed GitHub Labelling Strategy

This document describes how LightSpeed uses GitHub labels to power automation, search, workflow routing, and community management across all repositories—including issues, pull requests (PRs), and discussions.

---

## 1. Purpose & Principles

- **Clarity & Automation:** Labels provide high-signal metadata for automation, project boards, and contributors.
- **Consistency:** All repositories follow a shared, canonical taxonomy (see `.github/labels.yml`).
- **Discoverability:** Labels make it easy to filter, search, and report on work across code, docs, and community.
- **Community Engagement:** Dedicated labels for discussions and non-code topics ensure inclusive collaboration.

---

## 2. Unified Labeling Agent & Workflow

- **Single Agent, Single Workflow:** All issue and PR labeling, status/priority enforcement, and type assignment is handled by the unified `labeling.agent.js` and `labeling.yml`.
- **Agent-Driven:** No separate status/type/standardization agents—everything is managed by the labeling agent, using canonical configs.
- **File/Branch/Front Matter/Heuristics:** Labels are applied automatically based on file changes, branch prefixes, PR body front matter, and content heuristics.
- **Org-wide Config:** All label logic is controlled by `.github/labels.yml`, `.github/labeler.yml`, and `.github/issue-types.yml`.

---

## 3. Label Families & Categories

- **Status:** `status:*` — workflow progression (e.g. `needs-triage`, `in-progress`, `needs-review`, `blocked`)
- **Priority:** `priority:*` — urgency and scheduling (`critical`, `important`, `normal`, `minor`)
- **Type:** `type:*` — nature of work (`bug`, `feature`, `docs`, `test`, `refactor`, `performance`, `security`, etc.)
- **Area/Component:** `area:*`, `comp:*` — codebase/product area (e.g., `area:ci`, `comp:block-editor`)
- **Context:** `phase:*`, `env:*`, `device:*`, etc.
- **Meta:** `meta:*` — release hygiene, automation, triage, changelog, and workflow signals
- **Contributor:** `contrib:*` — contributor workflow (`good-first-issue`, `help-wanted`)
- **Discussion/Community:** `community`, `showcase`, `announcement`, `feedback`, `support`, `sponsorship`, `partnership`

---

## 4. Issue Labelling

### A. Automated & Manual Application

- **Templates and Forms:** Issue templates auto-assign `type:*`, `priority:*`, and initial status labels.
- **Manual Curation:** Triage and maintainers may adjust labels for clarity, routing, or as issue status changes.

### B. Minimum Required Labels per Issue

- **One** `status:*` (e.g., `status:needs-triage`, then progressing to `status:ready`, `status:in-progress`, `status:needs-review`, etc.)
- **One** `priority:*` (e.g., `priority:normal`)
- **One** `type:*` (e.g., `type:bug`, `type:feature`)
- **At least one** `area:*` or `comp:*` (e.g., `area:ci`, `comp:block-editor`)
- **Contextual/meta labels** as needed (`phase:6`, `meta:needs-changelog`, `contrib:good-first-issue`)

### C. Issue Automation

- **Labeler:** `.github/labeler.yml` auto-applies labels based on file paths, branch prefixes, and patterns.
- **Workflow Enforcement:** Issues must have required labels before work can begin or before closing.
- **Project Board Sync:** Labels map to project fields for auto-triage, status tracking, and reporting.
- **Changelog/Release:** Meta and release labels (`meta:needs-changelog`, `release:*`) trigger automation for changelog generation and versioning.

---

## 4. Pull Request (PR) Labelling

### A. Automated & Manual Application

- **Branch Prefix Mapping:** PR branch names (e.g., `feat/`, `fix/`, `docs/`) auto-assign `type:*` and `status:needs-review`.
- **File Path Matching:** PRs touching specific files/folders auto-get `area:*`, `comp:*`, or language labels.
- **PR Templates:** Prompt for changelog entries, release labels, and linked issues.

### B. Minimum Required Labels per PR

- **One** `status:*` (automatically set to `status:needs-review` on open)
- **One** `type:*` (matched to branch prefix: `feat/` → `type:feature`, etc.)
- **One** `priority:*` (derived from branch or set manually, e.g., `priority:normal`)
- **At least one** `area:*` or `comp:*`
- **Release:** `release:patch`, `release:minor`, or `release:major` as required
- **Meta:** `meta:needs-changelog`, `meta:triage` as needed

### C. PR Automation

- **Labeler:** `.github/labeler.yml` applies labels based on branch and file changes.
- **Changelog Enforcement:** PRs missing changelog/release labels block merges; workflows auto-add `meta:needs-changelog` if absent.
- **Status Transition:** Only one `status:*` at a time (e.g., `needs-review` → `needs-qa` → `ready-for-deployment`)
- **Release Workflow:** Labels guide automated changelog compilation and semantic versioning after merge.

---

## 5. Discussion Labelling

### A. Community & Discussion-Specific Labels

- **discussion:community:** For social, networking, or open-ended topics
- **discussion:showcase:** User projects, demos, "Show & Tell" threads
- **discussion:announcement:** Official news and team updates
- **discussion:feedback:** Suggestions, general ideas, and user experience comments
- **discussion:support:** “How do I…” setup, troubleshooting, or help requests that aren’t confirmed bugs
- **discussion:sponsorship:** Funding, GitHub Sponsors, and financial topics
- **discussion:partnership:** Collaboration, business, or outreach threads

### B. How to Use

- Apply at creation or via moderator assignment.
- Encourage users to select a label when starting a new discussion.
- Use labels to filter, moderate, and prioritize community engagement.

---

## 6. Automation, Workflow, and Agents

- **Labeler Config:**
  `.github/labeler.yml` auto-applies labels based on:
  - Branch prefixes (e.g., `feat/`, `fix/`)
  - File paths/globs (e.g., `src/blocks/**` → `area:block-editor`)
- **Workflow Enforcement:**
  - CI fails if required labels are missing or conflicting.
  - Status and priority labels drive automation in project boards and release gating.
- **Project Board Sync:**
  - Labels map to project fields for triage, status, priority, and reporting.
- **Changelog & Release:**
  - Meta and release labels trigger workflows for changelog entries and semantic version bumps.
- **Bots/Agents:**
  - Use labels to assign reviewers, escalate support, route discussions, or automate notifications.

---

## 5. How Labels Are Applied

- **Automation:**
  - File/branch changes and PR body front matter trigger label application via the labeling agent.
  - The agent enforces one-hot (single) status, priority, and type.
  - Missing or non-canonical labels are auto-corrected to match `.github/labels.yml`.
  - Changelog and release hygiene labels are nudged as needed (`meta:needs-changelog`, etc).

- **Manual adjustment:**
  - Maintainers may adjust labels as needed for clarity or triage.

---

## 6. Best Practices

- Use the most specific `area:*` or `comp:*` for filtering.
- Update labels as work progresses or scope changes.
- Review and clean up labels quarterly; remove unused or redundant entries.
- Reference [labeling.agent.md](./agents/labeling.agent.md) for agent logic details.
- See `.github/labels.yml`, `.github/labeler.yml`, and `.github/issue-types.yml` for configs.

---

## 7. Best Practices

- Keep **exactly one** `status:*` and `priority:*` label per issue/PR.
- Use the most specific `area:*`, `comp:*`, or context label for filtering.
- Update labels as work progresses or if scope changes.
- Use discussion/community labels to keep conversations organized and welcoming.
- Review and clean up labels quarterly, removing unused or redundant entries.

---

## 8. References

- [Automation Governance](./AUTOMATION_GOVERNANCE.md)
- [Issue Labels Guide](./ISSUE_LABELS.md)
- [Canonical Labels & Colours](../.github/labels.yml)
- [Labeler rules](../.github/labeler.yml)
- [Issue Types Guide](./ISSUE_TYPES.md)
- [Canonical Issue Types](../.github/issue-types.yml)
- [PR Labels Guide](./PR_LABELS.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions)
- [Agent Spec for Labeling](../agents/labeling.agent.md)
- [labeling.yml Workflow](../.github/workflows/labeling.yml)

*For questions or changes, open a PR or discussion in the `.github` repository.*

---

# LightSpeedWP Labeling Agent: Usage & Integration Guide

This document provides detailed instructions for using the unified labeling agent (`labeling.agent.js`) in your GitHub workflows. It covers configuration, modular utilities, agent orchestration, and best practices for automation across issues and PRs.

---

## 1. **Purpose**

The labeling agent automates all aspects of labeling, status/priority enforcement, issue type assignment, and label standardization for issues and pull requests. It replaces multiple legacy agents and workflows with a single, unified logic and configuration set.

---

## 2. **How It Works**

- **Entry Point:**
  The agent is triggered via the `labeling.yml` workflow on issue and PR events.
- **Config-Driven:**
  It uses `.github/labels.yml`, `.github/labeler.yml`, and `.github/issue-types.yml` for all canonical label/type logic.
- **Modular Utilities:**
  The agent orchestrates core logic by calling a suite of shared utility modules in `scripts/utility/`, each responsible for one aspect (label lookup, type assignment, file/branch rules, reporting, etc.).

---

## 3. **Utility Modules (Modularization)**

**Utilities are located in `../scripts/agents/includes/` and imported as needed:**

| Utility File          | Core Functions (examples)                                                  | Used by                       |
| --------------------- | -------------------------------------------------------------------------- | ----------------------------- |
| `label-lookup.js`     | `fetchCanonicalLabels`, `buildLabelAliasMap`, `findStandardLabel`          | labeling.agent.js, others     |
| `labeler-utils.js`    | `fetchLabelerRules`, `applyLabelerRules`                                   | labeling.agent.js             |
| `label-sync.js`       | `syncLabelsWithCanonical`, `validateRepoLabels`, `standardizeLabelsOnRepo` | labeling.agent.js, scripts    |
| `status-enforcer.js`  | `enforceOneHotStatus`, `applyDefaultStatus`, `applyDefaultPriority`        | labeling.agent.js             |
| `label-reporting.js`  | `buildLabelingReport`, `buildStandardizationReport`                        | labeling.agent.js, reporting  |
| `type-lookup.js`      | `loadIssueTypes`, `findIssueTypeByNameOrAlias`                             | labeling.agent.js, issue-type |
| `label-heuristics.js` | `suggestLabelsFromContent`                                                 | labeling.agent.js, automation |

---

## 4. **Agent Usage: Example Orchestration**

```javascript
// Import utilities in labeling.agent.js
const {
  fetchCanonicalLabels,
  buildLabelAliasMap,
  findStandardLabel,
} = require("../scripts/agents/includes/label-lookup");
const {
  fetchLabelerRules,
  applyLabelerRules,
} = require("../scripts/agents/includes/labeler-utils");
const {
  syncLabelsWithCanonical,
  standardizeLabelsOnRepo,
} = require("../scripts/agents/includes/label-sync");
const {
  enforceOneHotStatus,
  applyDefaultStatus,
  applyDefaultPriority,
} = require("../scripts/agents/includes/status-enforcer");
const {
  buildLabelingReport,
} = require("../scripts/agents/includes/label-reporting");
const {
  loadIssueTypes,
  findIssueTypeByNameOrAlias,
} = require("../scripts/agents/includes/type-lookup");
const {
  suggestLabelsFromContent,
} = require("../scripts/agents/includes/label-heuristics");

// Example usage in agent's main function:
async function runLabelingAgent(context, configs, dryRun = false) {
  const canonicalLabels = fetchCanonicalLabels();
  const labelerRules = fetchLabelerRules();
  const issueTypes = loadIssueTypes();

  // 1. File/branch-based labeling using labeler rules
  await applyLabelerRules(context, labelerRules, dryRun);

  // 2. One-hot status enforcement
  await enforceOneHotStatus(context, canonicalLabels, dryRun);

  // 3. Default priority/status for issues/PRs
  await applyDefaultStatus(context, canonicalLabels, dryRun);
  await applyDefaultPriority(context, canonicalLabels, dryRun);

  // 4. Issue type assignment from title/body
  const typeLabel = findIssueTypeByNameOrAlias(
    context.payload.issue?.title,
    issueTypes,
  );
  if (typeLabel) {
    // ...add type label if missing
  }

  // 5. Standardize/migrate labels
  await standardizeLabelsOnRepo(context, canonicalLabels, dryRun);

  // 6. (Optional) Reporting
  const report = buildLabelingReport(/* ... */);
  // ...post report as comment or log

  // 7. (Optional) Suggest labels from content heuristics
  const suggestions = suggestLabelsFromContent(context.payload.issue?.body);
  // ...log or post suggestions
}
```

---

## 5. **Configuration & Files**

- `.github/labels.yml`: Canonical label definitions (names, colors, aliases)
- `.github/labeler.yml`: File/branch-based label rules
- `.github/issue-types.yml`: Canonical issue type definitions
- `../scripts/agents/includes/`: Shared JS helpers for all agents/scripts

---

## 6. **Best Practices**

- **Agents orchestrate, utilities do the work:**
  Keep agent files lean—just call helpers, passing context and config.
- **Always use canonical config:**
  Never hardcode label/type lists; always read from YAML.
- **Write utility tests:**
  Each utility in `scripts/agents/includes/` should have a test in `scripts/agents/includes/__tests__/`.
- **Keep logic DRY:**
  Avoid duplicate logic for label lookup, migration, or reporting.
- **Document all new utility functions:**
  Use JSDoc or comment blocks so team members can easily extend.

---

## 7. **Troubleshooting & Extension**

- **Missing labels or types?**
  Check `.github/labels.yml` and `.github/issue-types.yml` for missing/typo entries.
- **Label not applied as expected?**
  Debug with utility tests in `../scripts/agents/includes/__tests__/`.
- **Want to add a new heuristic or report?**
  Add it as a new utility in `../scripts/agents/includes/`, write a test in `__tests__/`, and import it in the agent.

---

## 8. **References**

- [labels.yml](../.github/labels.yml)
- [labeler.yml](../.github/labeler.yml)
- [issue-types.yml](../.github/issue-types.yml)
- [Coding Standards](../instructions/coding-standards.instructions.md)
- [Custom Instructions](../.github/custom-instructions.md)
- [Main Agent Spec](../agents/labeling.agent.md)

---

**With this modular approach, the labeling agent is robust, easy to test, and simple to extend—making automation scalable for all LightSpeedWP projects.**

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
