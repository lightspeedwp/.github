---
title: GitHub Issue Creation Guide
description: How to create well-formed issues, select templates, and trigger automation
file_type: documentation
version: "1.0.0"
created_date: "2026-05-31"
last_updated: "2026-05-31"
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

- ✅ Choose the correct template based on issue type
- ✅ Fill in all required sections clearly
- ⚠️ Add labels manually for now (issue automation planned for Wave 5.1.2)
- ✅ Include effort estimates and success criteria
- ✅ Link related issues and blockers

---

## Quick Reference: Template Selection

### Pick Your Issue Type

| I want to... | Template | Type Label |
| --- | --- | --- |
| Report a **defect or bug** | 🐛 Bug | `type:bug` |
| Request a **new feature** | 🚀 Feature | `type:feature` |
| Propose a **small, focused change** | 📝 Task | `type:task` |
| Request **design/UX work** | 🎨 Design | `type:design` |
| Create a **large, multi-part project** | 📦 Epic | `type:epic` |
| Write a **user-centric story** (Agile) | 📑 Story | `type:story` |
| Suggest **improvements** | 🔧 Improvement | `type:improvement` |
| Share **user feedback** | 💡 User Experience | `type:feedback` |
| Request **code cleanup** | ♻️ Code Refactor | `type:refactor` |
| Discuss **build/CI/CD** | ⚙️ Build & CI | `type:build` |
| Propose **automation** | 🤖 Automation | `type:automation` |
| Request **tests** | 🧪 Test Coverage | `type:test` |
| Report **performance** | ⚡ Performance | `type:performance` |
| Report **accessibility** | ♿ Accessibility | `type:a11y` |
| Report **security** | 🔐 Security | `type:security` |

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

### 4. Add Labels

**Currently**, you must add labels manually:

- Add the appropriate `type:*` label (e.g., `type:bug`, `type:feature`)
- Add `area:*` labels if relevant (e.g., `area:ci`, `area:documentation`)
- Add `priority:*` if critical (e.g., `priority:critical` for security issues)

> **Note**: Issue-based automation is planned for Wave 5.1.2. Once implemented, labels will apply automatically based on template selection.

### 5. Submit

Click **Submit new issue**. Your issue is now visible to the team and ready for triage.

---

## Automation: Current State & Future Work

### ✅ Currently Implemented

- PR/branch-based labeling: branch prefix (e.g., `fix/`, `feat/`) triggers automatic type labels on pull requests
- Markdown linting and frontmatter validation

### 🔄 Planned (Wave 5.1.2)

**Issue-based template automation** will enable:

- Template selection → automatic `type:*` label (e.g., 🐛 Bug → `type:bug`)
- Content keyword matching → area labels (e.g., ".github/workflows" → `area:ci`)
- Priority inference from security/accessibility keywords
- Automatic triage routing and status application

**See** [Issue Template Audit Report](../.github/reports/issue-template-audit-2026-05-31.md) for the complete automation specification.

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

## For AI Agents: Template Selection Logic

When creating an issue:

1. **Classify the request** into one of 25 types (see Quick Reference above)
2. **Select the matching template** from the quick reference table
3. **Fill all required sections** with structured information and examples
4. **Add labels manually**:
   - Primary `type:*` label matching the template
   - Any relevant `area:*` labels based on content
   - `priority:critical` or `priority:high` if security/accessibility/blocking
5. **Link related issues** using `#issue-number` references
6. **Submit and notify** relevant team (until automated routing is implemented)

---

## Related Documentation

- [Labeling Strategy](./LABELING.md)
- [Automation Governance](./AUTOMATION.md)
- [Issue Templates README](../.github/ISSUE_TEMPLATE/README.md)

---
