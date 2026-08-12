---
title: "Label Validation FAQ"
description: "Frequently asked questions about GitHub label validation, canonical labels, and troubleshooting."
file_type: "documentation"
version: 'v1.0.0'
last_updated: '2026-08-06'
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp"]
tags: ["labels", "validation", "faq", "troubleshooting"]
---

# Label Validation FAQ

Quick answers to common questions about label validation, canonical labels, and fixing validation errors.

---

## General Questions

### What is label validation?

Label validation is an automated system that checks all labels on issues and PRs **when creating, editing, or labeling** to ensure they follow the canonical label system. It prevents bare labels (like `bug`, `feature`, `urgent`) and enforces the use of prefixed labels (like `type:bug`, `type:feature`, `priority:critical`).

### Why are bare labels not allowed?

Bare labels create inconsistency and make automation harder:

- `bug` vs `type:bug` vs `type:defect` — multiple ways to say the same thing
- Automation can't reliably find or filter on inconsistent labels
- Reporting and metrics become unreliable

Using prefixed labels ensures:

- ✅ One canonical way to label each concept
- ✅ Automation can reliably find and process labels
- ✅ Reporting is consistent and meaningful
- ✅ Everyone follows the same system

### Where can I find the list of all 158 canonical labels?

The authoritative source is [`.github/labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml) in this repository. It contains:

- Label name (e.g., `type:bug`)
- Description
- Colour (WCAG AA compliant)
- Aliases (if any)

You can also read the summary in [`docs/LABELING.md`](./LABELING.md).

### Can I create custom labels?

No. All labels must come from the canonical set in `.github/labels.yml` (158 total). Custom labels:

- Break automation
- Create inconsistency
- Are rejected by the validation workflow

If you need a new label, open an issue to request it. The label will be added to the canonical set, then you can use it.

---

## Using Labels

### I want to label an issue with "bug". What should I use?

Use **`type:bug`** instead of bare `bug`.

- **Wrong:** `bug`
- **Correct:** `type:bug`

### What about "feature" or "task"?

Same principle:

| What You Want | Correct Label | Wrong Label |
|---|---|---|
| New functionality | `type:feature` | `feature` |
| Maintenance work | `type:chore` | `chore` |
| A task to do | `type:task` | `task` |
| Performance work | `type:performance` | `performance` |
| Accessibility work | `type:a11y` | `a11y` |
| Design work | `type:design` | `design` |
| Documentation | `type:documentation` | `documentation` |
| Testing | `type:test` | `test` |
| Refactoring | `type:refactor` | `refactor` |
| Security fix | `type:security` | `security` |

### What about priority and urgency?

Use **`priority:`** labels:

| What You Want | Correct Label | Wrong Label |
|---|---|---|
| Very urgent | `priority:critical` | `critical` or `urgent` |
| High priority | `priority:important` | `important` |
| Standard priority | `priority:normal` | (no label needed, it's default) |
| Nice to have | `priority:minor` | `minor` |

### What about status (ready, in-progress, done)?

Use **`status:`** labels:

| Status | Correct Label |
|---|---|
| New, needs review | `status:needs-triage` |
| Clear and ready to work | `status:ready` |
| Currently being worked on | `status:in-progress` |
| Waiting for code review | `status:needs-review` |
| Blocked by something else | `status:blocked` |
| Completed | `status:done` |
| Intentionally not fixing | `status:wontfix` |

### How many labels should an issue have?

**Minimum required:**

- 1 `type:*` label (required for all issues/PRs)
- 1 `status:*` label (required for workflow)
- 1 `priority:*` label (required for prioritization)
- 1 `area:*` or `comp:*` label (required for scoping)

**Total:** 4 minimum

**Maximum:** As many as needed (no hard limit), but:

- Only 1 label per family (except meta:, comp:, lang: which allow multiples)
- Add meta:, area:, comp: labels as needed for context

**Typical example:**

```
type:bug
status:needs-triage
priority:critical
area:ci
meta:needs-changelog
```

= 5 labels total

### Can I have multiple labels from the same family?

**Most families: No (one-hot rule)**

You can have:

- ❌ `type:bug` and `type:feature` — only one type:
- ❌ `priority:critical` and `priority:normal` — only one priority:
- ❌ `status:ready` and `status:in-progress` — only one status:

**Exceptions: Multiple allowed**

These families allow multiples:

- ✅ `meta:needs-changelog` and `meta:has-pr` — multiple meta: labels OK
- ✅ `comp:block-editor` and `comp:theme-json` — multiple comp: labels OK
- ✅ `lang:js` and `lang:css` — multiple lang: labels OK
- ✅ `area:ci` and `area:documentation` — multiple area: labels OK (different families)

---

## Validation Errors

### "Label 'bug' missing required family prefix"

You used a bare label without a prefix.

**What's wrong:** The label `bug` doesn't have a family prefix like `type:`, `status:`, `priority:`, etc.

**How to fix:**

1. Identify what the label means:
   - Is it a type of work? → Use `type:bug`
   - Is it a priority? → Use `priority:critical`
   - Is it a status? → Use `status:blocked`
2. Apply the correct prefixed label
3. Edit the issue/PR to update labels
4. Validation runs automatically

**Example:**

- ❌ Remove: `bug`, `feature`, `urgent`, `ci`, `docs`
- ✅ Add: `type:bug`, `type:feature`, `priority:critical`, `area:ci`, `type:documentation`

### "Label 'X' not found in canonical set"

The label you used doesn't exist.

**What's wrong:** Either:

- Typo in the label name (e.g., `type:bugfix` instead of `type:bug`)
- Label is custom/non-canonical
- Label was renamed in the canonical set

**How to fix:**

1. Check [`.github/labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml) for the correct name
2. Use the exact label from the canonical set
3. Edit the issue/PR with the correct label
4. Validation re-runs automatically

**Common typos:**

- `type:bugfix` → `type:bug`
- `type:improvment` → `type:improve` or `type:enhancement`
- `area:documention` → `area:documentation`
- `status:todo` → `status:ready` (no "todo" status)

### "Multiple labels from family 'type' found"

You applied more than one `type:` label.

**What's wrong:** Each issue/PR has ONE type. You can't be both `type:bug` and `type:feature`.

**How to fix:**

1. Choose the PRIMARY type of work (what is this issue MOST about?)
2. Remove the other type: labels
3. Edit the issue/PR to keep only one type:
4. Validation re-runs automatically

**Example:**

- ❌ Remove: `type:bug`, `type:feature`, `type:improvement`
- ✅ Keep only: `type:bug` (if it's primarily a defect)

### "Missing required 'type:\*' label"

Your issue/PR has no `type:` label.

**What's wrong:** All issues and PRs must be classified by type (bug, feature, task, etc.). Missing this label breaks automation.

**How to fix:**

1. Determine the type of work (use one):
   - Bug report or defect → `type:bug`
   - New feature → `type:feature`
   - Enhancement to existing feature → `type:improve`
   - Maintenance, cleanup → `type:chore`
   - Documentation → `type:documentation`
   - Other type from [canonical labels](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml)
2. Add the type: label to the issue/PR
3. Validation re-runs automatically

---

## Workflow & Process

### When does validation run?

Validation runs automatically on:

- 📝 Issue creation
- 🏷️ Issue label changes (add/remove)
- 📝 PR creation
- 🏷️ PR label changes
- 🔄 PR synchronization (new commits pushed)

You don't need to manually trigger it—it's automatic.

### What happens if validation fails?

1. ❌ The workflow posts a **comment on your issue/PR** with:
   - What's wrong (which validation rules failed)
   - How to fix it (step-by-step)
   - Valid examples you can copy-paste
   - Link to this documentation
2. 🚫 The issue/PR **cannot merge** if validation is still failing (if it's a required check)
3. ✅ Once you fix the labels, validation **automatically re-runs** and passes

### How do I fix a validation error?

1. **Read the comment** the validation workflow posted
2. **Identify the problem** (missing prefix, non-existent label, too many from same family, etc.)
3. **Edit the issue/PR** and apply the corrected labels
4. **Validation re-runs** automatically (you don't need to do anything)
5. ✅ Once fixed, the comment updates to show "validation passed"

### Can I override validation?

No. Validation is enforced and cannot be bypassed. This is intentional—it ensures consistency.

If you think validation should allow something:

- Open an issue requesting a new canonical label, or
- Propose a change to the validation rules

---

## Getting Help

### Where can I see all canonical labels?

- **Complete list:** [`.github/labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml) (158 labels)
- **Summary by family:** [`docs/LABELING.md`](./LABELING.md) (organized by type, status, area, etc.)
- **This FAQ:** You're reading it!

### Where is the validation script?

The validation script is in:

- **Script:** `scripts/validation/validate-labels-before-creation.cjs`
- **Tests:** `scripts/validation/__tests__/validate-labels-before-creation.test.cjs`
- **Workflow:** `.github/workflows/validate-issue-labels.yml`

You can read these to understand exactly what validation checks.

### What if I have a question not answered here?

1. Check [`docs/LABELING.md`](./LABELING.md) for more details
2. Open an issue with your question and tag it `type:question`, `area:labels`
3. Ask in #engineering Slack channel

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
