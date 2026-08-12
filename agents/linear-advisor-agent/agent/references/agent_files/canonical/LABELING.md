# LightSpeedWP Labeling Agent: Usage & Integration Guide

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
