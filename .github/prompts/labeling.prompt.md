---
name: "Unified Labeling"
description: "Unified labeling automation for issues, PRs, and discussions using canonical config-driven rules."
agent: "Labeling"
tools: ["read", "edit", "search"]
---

# Unified Labeling Prompt

Apply canonical labels to issues, pull requests, and discussions using the unified labeling system.

## Purpose

Automate label application, enforcement, and standardization across:

- Issues (via templates and type field)
- Pull requests (via branch patterns and file changes)
- Discussions (via category mapping)

## Usage Instructions

When asked to apply labels, ensure you:

1. **Fetch canonical rules** from:
   - `.github/labels.yml` - All valid label definitions
   - `.github/labeler.yml` - Pattern-to-label mapping rules
   - `.github/issue-types.yml` - Issue type to label mappings

2. **Analyze the item**:
   - For PRs: Check branch name, changed files
   - For Issues: Check issue type, template used, content
   - For Discussions: Check category

3. **Apply labels** based on rules:
   - Match file paths to area/component labels
   - Match branch prefixes to type labels (feat/ → type:feature)
   - Match issue types to canonical type labels
   - Apply default status and priority if missing

4. **Enforce one-hot constraints**:
   - Exactly ONE `status:*` label (default: status:needs-triage for issues, status:needs-review for PRs)
   - Exactly ONE `priority:*` label (default: priority:normal)
   - Exactly ONE `type:*` label (derived from branch/template/content)

5. **Standardize labels**:
   - Replace non-canonical labels with canonical equivalents
   - Use alias mappings from labels.yml
   - Remove labels not in canonical set

## Example Scenarios

### Scenario 1: New PR on branch `feat/user-authentication`

**Apply:**

- `type:feature` (from branch prefix)
- `status:needs-review` (default for PRs)
- `priority:normal` (default)
- Area labels based on changed files

### Scenario 2: Bug report issue using template

**Apply:**

- `type:bug` (from issue type field)
- `status:needs-triage` (default for issues)
- `priority:normal` or higher based on severity
- Area labels based on affected components

### Scenario 3: PR with mixed labels

**Standardize:**

- Remove duplicate status labels, keep highest priority
- Migrate `enhancement` → `type:feature` (alias)
- Ensure all labels exist in labels.yml

## Guardrails

- Never apply labels not defined in `.github/labels.yml`
- Never overwrite manually-set labels without warning
- Always log label changes for audit
- Respect user intent for manually applied labels
- Use dry-run mode when testing rules

## References

- [Labeling Agent](../agents/labeling.agent.md) - Full agent specification
- [Labeling Instructions](../instructions/labeling.instructions.md) - Complete documentation
- [GitHub Actions Labeler](https://github.com/actions/labeler) - Actions integration
- [Label Strategy](../../docs/LABEL_STRATEGY.md) - Organization philosophy
