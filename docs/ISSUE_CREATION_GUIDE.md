---
---

> **Note:** This file follows LightSpeedWP governance, frontmatter, naming, and versioning conventions as described in [VERSIONING.md](./VERSIONING.md) and [FRONTMATTER_SCHEMA.md](./FRONTMATTER_SCHEMA.md).

# LightSpeed Issue Creation Guide

This guide describes how to create actionable, well-labeled issues in LightSpeed projects, ensuring clarity, automation, and traceability. Following these steps helps the team triage, prioritize, and address work efficiently.

---

## 1. **Before Creating an Issue**

- **Search existing issues** to avoid duplicates.
- **Decide on the right issue type:** Is this a bug, feature, task, doc update, design, or something else?
- **Is your question general or exploratory?**
  For open-ended questions, proposals, or feedback, use [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions).

---

## 2. **Choose the Correct Issue Template**

Visit the repository’s [Issues page](https://github.com/lightspeedwp/.github/issues/new/choose) and select the template that matches your intent:

- **Bug Report:** Broken features, regressions, or unexpected behavior.
- **Feature Request:** Proposing new capabilities or enhancements.
- **Task:** Small, well-scoped units of work.
- **Documentation:** Docs, onboarding guides, or knowledge base updates.
- **Design:** Design artifacts, specs, a11y checks.
- **Epic/Story:** For grouping related work or user stories.
- **Other templates:** (Performance, QA, Security, Integration, etc., if available.)

Each template is pre-filled with required fields and checklists.

---

## 3. **Fill Out the Template Thoroughly**

Be specific and complete. Most templates include:

- **Overview:** What needs to be done and why?
- **Context:** Phase, dependencies, and related issues.
- **Acceptance Criteria:** Measurable outcomes, tests, documentation updates.
- **Technical Details:** Implementation notes, design decisions, or constraints.
- **Effort Estimate:** Small, Medium, or Large.

> **Tip:** Link related issues with `#issue-number` and reference relevant docs or standards.

---

## 4. **Set the Correct Issue Type and Labels**

- Pick **one** [issue type](../.github/ISSUE_TYPES.md) (e.g., `type:bug`, `type:feature`, `type:task`, etc.).
- **Branch prefixes** (`feat/`, `fix/`, etc.) and issue type drive automation and label application.
- Add companion labels to improve search and automation:
  - **Priority:** `priority:critical`, `priority:normal`, `priority:minor`
  - **Status:** Start with `status:needs-triage`
  - **Area/Component:** `area:ci`, `comp:block-editor`, etc.
  - **Context:** `phase:6`, `env:staging`, etc.
  - **Meta:** `contrib:good-first-issue`, `meta:needs-changelog`
  - **Effort:** `easy`, `medium`, `hard`

Labels are managed automatically, but review and adjust as needed.

---

## 5. **Write a Clear and Consistent Title**

Format:
`[Phase X.Y] Area/Component: Brief description`

Examples:

- `[Phase 6] GC: Implement reference counting for ObjectRef`
- `[Phase 5.5] CI: Set up branch protection rules`
- `[Docs] README: Add benchmark examples`

---

## 6. **Reference Issues, Milestones, and Projects**

- Link related issues using `#issue-number`.
- Assign to the relevant **milestone** (e.g., "Phase 6 - GC & Production").
- Add to the correct **project board** if applicable.

---

## 7. **Submit and Monitor**

- Submit your issue.
- Automation adds default labels (e.g., `status:needs-triage`, `priority:normal` if not set).
- A maintainer or triager will review, update status, and assign as needed.

---

## 8. **Issue Lifecycle**

1. **Created:** Labeled `status:needs-triage`
2. **Triaged:** Maintainer reviews and updates to `status:ready`
3. **In Progress:** Assigned and moved to `status:in-progress`
4. **Review/QA:** Status updated as needed (`status:needs-review`, `status:needs-qa`, etc.)
5. **Closed/Merged:** Linked PR auto-closes the issue

---

## 9. **Bulk Issue Creation (Advanced)**

For larger roadmap phases or sprints, you may create issues in batch with the GitHub CLI:

```bash
gh issue create \
  --title "[Phase 6] GC: Implement reference counting" \
  --body-file issue-body.md \
  --label "type:task,priority:high,phase:6,area:object-store"
```

---

## 10. **Tips for Excellent Issues**

- **Keep issues focused:** One clear outcome per issue.
- **Be specific:** Use concrete acceptance criteria.
- **Include context:** For future contributors and reviewers.
- **Estimate effort honestly:** Mark as easy, medium, or hard.
- **Cross-reference:** Link PRs and related issues.
- **Update the issue title/labels if scope changes.**

---

## 11. **Sample Issue Template (Markdown)**

```markdown
## Overview

Brief description of what needs to be done and why.

## Context

- Which phase this belongs to
- Dependencies on other work
- Related issues: #xxx, #yyy

## Acceptance Criteria

- [ ] Specific measurable outcome 1
- [ ] Specific measurable outcome 2
- [ ] Tests added/updated
- [ ] Documentation updated

## Technical Details

Any implementation notes, design decisions, or technical context.

## Effort Estimate

- [ ] Small (< 1 day)
- [ ] Medium (1-3 days)
- [ ] Large (3+ days)
```

---

*Use this guide to create clear, automated, and contributor-friendly issues in all LightSpeed projects. If you’re not sure where your request fits, start with [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions) or ask a maintainer!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
