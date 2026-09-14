# LightSpeedWP Labeling Agent: Usage & Integration Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

This document provides detailed instructions for using the unified labeling agent (`labeling.agent.js`) in your GitHub workflows. It covers configuration, modular utilities, agent orchestration, and best practices for automation across issues and PRs.

---

## 1. **Purpose**

The labeling agent automates all aspects of labeling, status/priority enforcement, issue type assignment, and label standardization for issues and pull requests. It replaces multiple legacy agents and workflows with a single, unified logic and configuration set.

---

## 2. How It Works

- **Entry Point:**
  The agent is triggered via the `labeling.yml` workflow on issue and PR events.
- **Config-Driven:**
  It uses `.github/labels.yml`, `.github/labeler.yml`, and `.github/issue-types.yml` for all canonical label/type logic.
- **Modular Utilities:**
  The agent orchestrates core logic by calling a suite of shared utility modules in `scripts/agent/includes/`, each responsible for one aspect (label lookup, type assignment, file/branch rules, reporting, etc.).

---

## 3. Utility Modules (Modularization)

**Utilities are located in `scrip../.github/agents/includes/` and imported as needed:**

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

## 4. Agent Usage: Example Orchestration

```javascript
// Import utilities in labeling.agent.js
const {
  fetchCanonicalLabels,
  buildLabelAliasMap,
  findStandardLabel,
} = require("../../scrip../.github/agents/includes/label-lookup");
const {
  fetchLabelerRules,
  applyLabelerRules,
} = require("../../scrip../.github/agents/includes/labeler-utils");
const {
  syncLabelsWithCanonical,
  standardizeLabelsOnRepo,
} = require("../../scrip../.github/agents/includes/label-sync");
const {
  enforceOneHotStatus,
  applyDefaultStatus,
  applyDefaultPriority,
} = require("../../scrip../.github/agents/includes/status-enforcer");
const {
  buildLabelingReport,
} = require("../../scrip../.github/agents/includes/label-reporting");
const {
  loadIssueTypes,
  findIssueTypeByNameOrAlias,
} = require("../../scrip../.github/agents/includes/type-lookup");
const {
  suggestLabelsFromContent,
} = require("../../scrip../.github/agents/includes/label-heuristics");

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
- `.github/includes/`: Shared JS helpers for all agents/scripts

---

## 6. **Best Practices**

- **Agents orchestrate, utilities do the work:**
  Keep agent files lean—just call helpers, passing context and config.
- **Always use canonical config:**
  Never hardcode label/type lists; always read from YAML.
- **Write utility tests:**
  Each utility in `scrip../.github/agents/includes/` should have a test in `scrip../.github/agents/includes/__tests__/`.
- **Keep logic DRY:**
  Avoid duplicate logic for label lookup, migration, or reporting.
- **Document all new utility functions:**
  Use JSDoc or comment blocks so team members can easily extend.

---

## 7. Troubleshooting & Extension

- **Missing labels or types?**
  Check `.github/labels.yml` and `.github/issue-types.yml` for missing/typo entries.
- **Label not applied as expected?**
  Debug with utility tests in `scrip../.github/agents/includes/__tests__/`.
- **Want to add a new heuristic or report?**
  Add it as a new utility in `scrip../.github/agents/includes/`, write a test in `__tests__/`, and import it in the agent.

---

## 8. **References**

- [labels.yml](../.github/labels.yml)
- [labeler.yml](../.github/labeler.yml)
- [issue-types.yml](../.github/issue-types.yml)
- [Coding Standards](../.github/instructions/coding-standards.instructions.md)
- [Custom Instructions](../.github/custom-instructions.md)
- [Main Agent Spec](../.gith../.github/agents/labeling.agent.md)

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
