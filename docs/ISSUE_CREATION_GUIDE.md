---
title: GitHub Issue Creation Guide
description: How to create well-formed issues, select templates, and trigger automation
file_type: documentation
version: "1.0.2"
created_date: "2026-05-31"
last_updated: "2026-06-18"
author: Claude Code
maintainer: Ash Shaw
owners:
  - lightspeedwp/maintainers
tags:
  - github
  - issues
  - templates
  - automation
category: github
---

## Overview

This guide helps contributors, team members, and AI agents create high-quality GitHub issues that trigger proper automation, get triaged efficiently, and align with project workflows.

**Key Principles**:

- ✅ Choose the correct template based on issue intent and canonical type
- ✅ Fill in all required sections clearly
- ✅ Add canonical labels explicitly (type/status/priority/area)
- ✅ Include effort estimates and success criteria
- ✅ Link related issues and blockers

---

## Quick Reference: Intent -> Template -> Canonical Type

### Pick Your Issue Type

| I want to... | Template | Canonical Type Label |
| --- | --- | --- |
| Report a **defect or bug** | 🐛 Bug | `type:bug` |
| Request a **new feature** | 🚀 Feature | `type:feature` |
| Propose a **small, focused change** | 📝 Task | `type:task` |
| Request **design/UX work** | 🎨 Design | `type:design` |
| Create a **large, multi-part project** | 📦 Epic | `type:epic` |
| Write a **user-centric story** (Agile) | 📑 Story | `type:story` |
| Suggest **improvements** | 🔧 Improvement | `type:improve` |
| Request **code cleanup** | ♻️ Code Refactor | `type:refactor` |
| Discuss **build/CI/CD** | ⚙️ Build & CI | `type:build` |
| Propose **automation** | 🤖 Automation | `type:automation` |
| Request **tests** | 🧪 Test Coverage | `type:test` |
| Report **performance** | ⚡ Performance | `type:performance` |
| Report **accessibility** | ♿ Accessibility | `type:a11y` |
| Report **security** | 🔐 Security | `type:security` |
| Small **housekeeping tasks** | 🏠 Chore | `type:chore` |

### Current Template Parity Note

- Numbered issue templates available: 25 (`01`-`25`), one per canonical org issue type
- Label-only types (no dedicated template): `type:ux-feedback`, `type:question`, `type:support`, `type:help`

For UX feedback or improvement suggestions that do not fit an existing template, use **🔧 Improvement** and apply `type:ux-feedback` in the issue body. For help or support requests, use the **LightSpeedWP Support** contact link in the issue chooser.

Where a template is broader than the request, use the nearest numbered template and state the intended canonical type in the issue body.

---

## Creating an Issue: Step-by-Step

### 1. Click "New Issue" on the Repository

Go to **Issues** tab → **New Issue** button.

### 2. Select the Appropriate Template

**Select the template that best matches your issue type** (see Quick Reference above).

### 3. Fill in All Sections

Each template includes standard sections:

#### Definition of Ready (DoR)

Before you submit, ensure:

- [ ] Issue is clearly described
- [ ] Steps to reproduce (or acceptance criteria) provided
- [ ] Any screenshots, logs, or examples attached
- [ ] Related issues or PRs linked
- [ ] Effort estimate added (if applicable)

#### Issue Details

Fill in the primary sections for your template with structured information.

#### Definition of Done (DoD)

Review these checkboxes to ensure they align with your scope.

### 4. Add Labels and Metadata

Issue templates currently do not pre-populate labels. Add labels manually:

- Add the appropriate `type:*` label (e.g., `type:bug`, `type:feature`)
- Add exactly one `status:*` label
- Add exactly one `priority:*` label
- Add `area:*` labels if relevant (e.g., `area:ci`, `area:documentation`)

Use canonical labels from `.github/labels.yml` and canonical types from `.github/issue-types.yml`.

### 5. Submit

Click **Submit new issue**. Your issue is now visible to the team and ready for triage.

---

## Automation: Current State

### ✅ Current Behaviour

- `labeling.yml` runs on issue events (`opened`, `edited`, `reopened`, `labeled`, `unlabeled`, `transferred`)
- Unified labeling agent applies canonicalization, one-hot enforcement, defaults, and content-based type detection
- PR automation remains stronger due to branch/file signals available in PR context

### ⚠️ Practical Implication

- Issue outcomes are not yet fully deterministic from template choice alone.
- Include clear issue text and apply canonical labels explicitly for reliable triage.

### AI / Automation Issue Creation

For AI-assisted or workflow-driven issue creation, use the canonical template before opening the issue.

1. Select the correct template key from the numbered templates.
2. Render the full template body first.
3. Create the issue with the template body already in place.
4. Only then add any extra context, labels, or metadata.

Recommended workflow:

- `.github/workflows/issue-create-from-template.yml`

This workflow creates the issue from the repository template body instead of opening a blank issue and backfilling content later. That keeps the issue body aligned with the template enforcement rules and avoids `not_planned` closures caused by missing sections.

## End-to-End Flow (Intent -> Template -> Automation -> Result)

1. Determine intent and canonical type label.
2. Choose the closest numbered template.
3. Complete all required sections.
4. Add canonical labels (`type`, `status`, `priority`, optional `area`).
5. Submit issue.
6. Labeling workflow runs and normalises/augments labels.
7. Issue enters triage with predictable metadata.

---

## Good Example: Bug Report

```
**Describe the bug**
The form fails to submit on Safari 16.x when autofill is enabled.

**To Reproduce**
1. Open page on Safari 16.x
2. Enable autofill
3. Fill form with autofill
4. Click Submit
→ See error: "TypeError: Cannot read property 'dataset'"

**Expected behavior**
Form submits successfully.

**Environment**
- WordPress: 6.4
- PHP: 8.2
- Browser: Safari 16.6
```

**Labels to Add**: `type:bug`, `area:ui` (manually, as of 2026-05-31)

---

## For AI Agents: Operational Logic

When creating an issue:

1. **Classify the request** into canonical issue types (see Quick Reference above)
2. **Select the matching template** from the quick reference table
3. **Fill all required sections** with structured information and examples
4. **Add labels explicitly** using one primary `type:*` label, one `status:*` label, one `priority:*` label, and any relevant `area:*` labels based on content.
5. **Link related issues** using `#issue-number` references
6. **Submit and verify** labeling workflow outcome

## Troubleshooting

### Wrong or missing labels after submit

- Check labels against `.github/labels.yml`.
- Ensure one-hot families (`type`, `status`, `priority`) contain exactly one label each.
- Edit/reopen issue to trigger workflow again if required.

### Chosen template does not exist for intended type

- Use nearest available numbered template.
- Add `Intended canonical type: type:<value>` near the top of the issue body.

### Automation does not match expected outcome

- Confirm the issue event is covered by `.github/workflows/labeling.yml`.
- Remember `.github/labeler.yml` is PR-signal heavy; issue automation relies more on content + canonical enforcement.

---

## Related Documentation

- [Labeling Strategy](./LABELING.md)
- [Automation Governance](./AUTOMATION.md)
- [Issue Templates README](../.github/ISSUE_TEMPLATE/README.md)
- [Issue Types](./ISSUE_TYPES.md)

---
