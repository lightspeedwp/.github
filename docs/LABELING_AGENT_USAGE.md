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
  It uses `.github/automation/labels.yml`, `.github/automation/labeler.yml`, and `.github/automation/issue-types.yml` for all canonical label/type logic.
- **Modular Utilities:**
  The agent orchestrates core logic by calling a suite of shared utility modules in `scripts/utility/`, each responsible for one aspect (label lookup, type assignment, file/branch rules, reporting, etc.).

---

## 3. **Utility Modules (Modularization)**

**Utilities are located in `.github/agents/includes/` and imported as needed:**

| Utility File                | Core Functions (examples)                                 | Used by                        |
|-----------------------------|----------------------------------------------------------|--------------------------------|
| `label-lookup.js`           | `fetchCanonicalLabels`, `buildLabelAliasMap`, `findStandardLabel` | labeling.agent.js, others      |
| `labeler-utils.js`          | `fetchLabelerRules`, `applyLabelerRules`                 | labeling.agent.js              |
| `label-sync.js`             | `syncLabelsWithCanonical`, `validateRepoLabels`, `standardizeLabelsOnRepo` | labeling.agent.js, scripts     |
| `status-enforcer.js`        | `enforceOneHotStatus`, `applyDefaultStatus`, `applyDefaultPriority` | labeling.agent.js              |
| `label-reporting.js`        | `buildLabelingReport`, `buildStandardizationReport`      | labeling.agent.js, reporting   |
| `type-lookup.js`            | `loadIssueTypes`, `findIssueTypeByNameOrAlias`           | labeling.agent.js, issue-type  |
| `label-heuristics.js`       | `suggestLabelsFromContent`                               | labeling.agent.js, automation  |

---

## 4. **Agent Usage: Example Orchestration**

```javascript
// Import utilities in labeling.agent.js
const { fetchCanonicalLabels, buildLabelAliasMap, findStandardLabel } = require('./includes/label-lookup');
const { fetchLabelerRules, applyLabelerRules } = require('./includes/labeler-utils');
const { syncLabelsWithCanonical, standardizeLabelsOnRepo } = require('./includes/label-sync');
const { enforceOneHotStatus, applyDefaultStatus, applyDefaultPriority } = require('./includes/status-enforcer');
const { buildLabelingReport } = require('./includes/label-reporting');
const { loadIssueTypes, findIssueTypeByNameOrAlias } = require('./includes/type-lookup');
const { suggestLabelsFromContent } = require('./includes/label-heuristics');

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
  const typeLabel = findIssueTypeByNameOrAlias(context.payload.issue?.title, issueTypes);
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

- `.github/automation/labels.yml`: Canonical label definitions (names, colors, aliases)
- `.github/automation/labeler.yml`: File/branch-based label rules
- `.github/automation/issue-types.yml`: Canonical issue type definitions
- `.github/agents/includes/`: Shared JS helpers for all agents/scripts

---

## 6. **Best Practices**

- **Agents orchestrate, utilities do the work:**  
  Keep agent files lean—just call helpers, passing context and config.
- **Always use canonical config:**  
  Never hardcode label/type lists; always read from YAML.
- **Write utility tests:**
  Each utility in `.github/agents/includes/` should have a test in `.github/agents/includes/__tests__/`.
- **Keep logic DRY:**  
  Avoid duplicate logic for label lookup, migration, or reporting.
- **Document all new utility functions:**  
  Use JSDoc or comment blocks so team members can easily extend.

---

## 7. **Troubleshooting & Extension**

- **Missing labels or types?**
  Check `.github/automation/labels.yml` and `.github/automation/issue-types.yml` for missing/typo entries.
- **Label not applied as expected?**
  Debug with utility tests in `.github/agents/includes/__tests__/`.
- **Want to add a new heuristic or report?**
  Add it as a new utility in `.github/agents/includes/`, write a test in `__tests__/`, and import it in the agent.

---

## 8. **References**

- [labels.yml](../.github/automation/labels.yml)
- [labeler.yml](../.github/automation/labeler.yml)
- [issue-types.yml](../.github/automation/issue-types.yml)
- [Coding Standards](../.github/instructions/coding-standards.instructions.md)
- [Custom Instructions](../.github/custom-instructions.md)
- [Main Agent Spec](../.github/agents/labeling.agent.md)

---

**With this modular approach, the labeling agent is robust, easy to test, and simple to extend—making automation scalable for all LightSpeedWP projects.**
