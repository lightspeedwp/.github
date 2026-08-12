---
title: "Bidirectional Project ↔ Issue Linking Standard"
description: "Standard templates and patterns for linking GitHub projects to issues and vice versa"
type: "standard"
created_date: "2026-08-11"
status: "published"
---

# Bidirectional Project ↔ Issue Linking Standard

## Vision

All active projects shall be discoverable from their related GitHub issues, and vice versa. This standard ensures:

✅ **Link Integrity** — Projects remain accessible even if renamed or archived  
✅ **Discoverability** — No orphaned projects; all issues connect to project work  
✅ **Maintenance** — Clear ownership and lifecycle tracking  
✅ **Automation** — CI can validate linking completeness

---

## 1. PROJECT → ISSUE Linking (Project Docs Link To Issues)

### 1.1 Location & Format

**Where:** In the project's main README or index file (e.g., `.github/projects/active/{slug}/README.md`)

**Section:** Add after the main description, before "Phases" or "Deliverables"

```markdown
## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1234](https://github.com/lightspeedwp/.github/issues/1234) | epic | Master coordination for this project | 🟢 Open |
| [#1245](https://github.com/lightspeedwp/.github/issues/1245) | task | Phase 1: Planning & scoping | 🟢 Open |
| [#1256](https://github.com/lightspeedwp/.github/issues/1256) | task | Phase 2: Implementation | ⏳ Blocked |
| [#1267](https://github.com/lightspeedwp/.github/issues/1267) | task | Phase 3: Testing & validation | ⏰ Planned |

## Related Active Projects

| Project | Relation | Link |
|---------|----------|------|
| [agent-standards-initiative](../../projects/active/agent-standards-initiative/) | Dependency | Aligns standards with this project |
| [wave-5-documentation-audit](../../projects/active/wave-5-documentation-audit/) | Referenced | Planning reference |
```

### 1.2 Template (Copy & Paste)

```markdown
## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#__](https://github.com/lightspeedwp/.github/issues/__) | epic | Master epic for this project | 🟢 Open |
| [#__](https://github.com/lightspeedwp/.github/issues/__) | task | [Phase/Component]: [Description] | 🟢 Open |

**Note:** If this project has no linked issues, add them first or create an issue for this project before releasing it.
```

### 1.3 Validation Rules

✅ **Every active project must have:**

- At least 1 master epic or tracking issue
- Issue links as absolute GitHub URLs (`https://github.com/lightspeedwp/.github/issues/1234`)
- Status badges per issue (🟢 Open, ⏰ Planned, 🟡 In Progress, 🟠 Blocked, 🔴 Closed)

❌ **Invalid:**

- Bare issue numbers (#1234 without link)
- Absolute URLs (hardcoded github.com URLs)
- Missing status info

---

## 2. ISSUE → PROJECT Linking (Issues Link To Project Docs)

### 2.1 Location & Format

**Where:** In the GitHub issue body (description), add a "Related Projects" section

**Format:** Markdown comment with a structured table

```markdown
## Related Active Projects

This issue is part of the following active project(s):
- [reports-projects-restructuring-2026-08-11](./.github/projects/active/reports-projects-restructuring-2026-08-11/) — Phase 2 restructuring initiative

**How this issue contributes:**
- Links this issue to project documentation
- Allows discovery of related tasks and phases
- Tracks project progress from issue perspective
```

### 2.2 Template (Copy & Paste)

Use this template when creating a GitHub issue that's part of an active project:

```markdown
## Related Active Projects

This issue is part of the following active project(s):
- [__PROJECT_NAME__](./.github/projects/active/__PROJECT_SLUG__/) — [brief purpose]

**How this issue contributes:**
- [Phase/component description]
- [Expected outcome or deliverable]

---

[Rest of issue body...]
```

### 2.3 When to Use

✅ **Add "Related Projects" section to:**

- Issues that are deliverables from active projects
- Issues that track phases or components of projects
- Issues that coordinate work across multiple teams
- Blockers or dependencies for project work

❌ **Do NOT add if:**

- Issue is unrelated to any active project (orphaned issue is fine)
- Issue is a one-off bug/chore with no project context

### 2.4 Validation Rules

✅ **Valid project link:**

- Relative path starting with `./.github/projects/active/`
- Brief description of purpose
- Explains how issue contributes to project

❌ **Invalid:**

- Bare project name without link
- Absolute URLs
- No explanation of connection

---

## 3. Examples

### Example 1: Active Project with Full Linking

**File:** `.github/projects/active/wave-5-documentation-audit/README.md`

```markdown
# Wave 5 Documentation Audit

[Project description...]

## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1079](../../../issues/1079) | epic | Master epic: Wave 5 documentation initiatives | 🟢 Open |
| [#1080](../../../issues/1080) | task | Phase 1: Audit existing documentation | 🟢 Open |
| [#1081](../../../issues/1081) | task | Phase 2: Design standards & templates | 🟢 Open |
| [#1082](../../../issues/1082) | task | Phase 3: Implement standards across codebase | ⏰ Planned |

---

[Rest of project documentation...]
```

**GitHub Issue #1080:**

```markdown
# Phase 1: Audit Existing Documentation

## Related Active Projects

This issue is part of the following active project(s):
- [wave-5-documentation-audit](./.github/projects/active/wave-5-documentation-audit/) — Wave 5 documentation audit initiative

**How this issue contributes:**
- Completes Phase 1 audit of all documentation across the codebase
- Generates baseline report for Wave 5 initiative
- Identifies gaps and inconsistencies for remediation

---

## Description

This issue tracks the audit of existing documentation across all repositories...

[Rest of issue body...]
```

### Example 2: Project with Multiple Related Issues

**File:** `.github/projects/active/openspec/README.md`

```markdown
# OpenSpec Project

[Description of OpenSpec...]

## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1434](../../../issues/1434) | epic | OpenSpec coordination & specification tracking | 🟢 Open |
| [#1435](../../../issues/1435) | task | Agent-Tool Permission Alignment spec | 🟢 Open |
| [#1436](../../../issues/1436) | task | Test Coverage Implementation spec | 🟢 Open |
| [#1437](../../../issues/1437) | task | OpenSpec → GitHub Issues sync | ⏰ Planned |

---

[Rest of documentation...]
```

---

## 4. Patterns & Best Practices

### 4.1 Epic Pattern (Master Coordination)

**Use when:** Project requires overall coordination across multiple work streams

```markdown
## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1234](../../../issues/1234) | epic | Master: [Project Name] Initiative | 🟢 Open |
| [#1235](../../../issues/1235) | task | Workstream A: [Scope] | 🟢 Open |
| [#1236](../../../issues/1236) | task | Workstream B: [Scope] | ⏰ Planned |
```

### 4.2 Phase Pattern (Sequential Work)

**Use when:** Project has distinct phases executed in order

```markdown
## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1240](../../../issues/1240) | task | Phase 1: [Description] | 🟢 Open |
| [#1241](../../../issues/1241) | task | Phase 2: [Description] | ⏰ Planned |
| [#1242](../../../issues/1242) | task | Phase 3: [Description] | ⏰ Planned |
```

### 4.3 Component Pattern (Parallel Work)

**Use when:** Project consists of independent components

```markdown
## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1250](../../../issues/1250) | task | Component A: [Description] | 🟢 Open |
| [#1251](../../../issues/1251) | task | Component B: [Description] | 🟢 Open |
| [#1252](../../../issues/1252) | task | Component C: [Description] | ⏰ Planned |
```

---

## 5. Status Badges

Use these badges to indicate issue status in linking tables:

| Badge | Meaning | When to Use |
|-------|---------|------------|
| 🟢 | Open & Active | Issue is open and actively worked |
| 🟡 | In Progress | Someone is currently working |
| 🟠 | Blocked | Waiting on dependency |
| ⏰ | Planned | Queued for future work |
| 🔴 | Closed | Issue completed or rejected |
| ❓ | Unknown | Status unclear, review needed |

---

## 6. Automation & Validation

### 6.1 CI Validation Rules

**Rule 1:** Every active project in `.github/projects/active/` must have a "Related Issues" section

**Rule 2:** Every issue in a "Related Issues" table must be a valid GitHub issue number

**Rule 3:** Every "Related Projects" comment in an issue must link to a valid project folder

**Rule 4:** Projects without any issues should be flagged for review

### 6.2 Example CI Check

Validation is implemented in `.github/workflows/validate-project-linking.yml`

---

## 7. Implementation Checklist

Use this checklist when linking a project to issues:

### For Existing Projects (Link Retrospectively)

- [ ] Read project README and identify related work
- [ ] Find or create GitHub issues for major project phases
- [ ] Add "Related Issues" table to project README
- [ ] For each issue, add "Related Projects" comment
- [ ] Validate all links work (relative paths, valid issue numbers)
- [ ] Test in GitHub preview
- [ ] Commit changes

### For New Projects (Link Proactively)

- [ ] Create GitHub issue(s) for project coordination
- [ ] Add issue numbers to project README before publishing
- [ ] Add "Related Projects" comment to each issue
- [ ] Follow linking standard from the start
- [ ] Include linking checklist in project creation template

---

## 8. FAQ

**Q: Can a project link to issues outside this repo?**  
A: No. Links must be relative paths within this repo. Use absolute URLs only in external documentation.

**Q: What if a project has no related issues?**  
A: Create issues before or immediately after creating the project. Every active project should have at least a master tracking issue.

**Q: Can one issue link to multiple projects?**  
A: Yes. If an issue contributes to multiple projects, list all of them in the "Related Projects" section.

**Q: Do archived projects need linking?**  
A: Yes, but update status to "🔴 Closed" or "📦 Archived". Links preserve historical context.

**Q: Who maintains these links?**  
A: Project owner (for project→issue) and issue reporter (for issue→project). Both parties keep links current as work progresses.

---

## 9. Related Documents

- [CLAUDE.md](../CLAUDE.md) — Repository standards & linking requirements
- [.github/ARCHIVE_WORKFLOW_GUIDE.md](./.github/ARCHIVE_WORKFLOW_GUIDE.md) — Project archival process
- [.github/projects/active/reports-projects-restructuring-2026-08-11/](../.github/projects/active/reports-projects-restructuring-2026-08-11/) — Initiative details

---

**Status:** Published  
**Last Updated:** 2026-08-12  
**Version:** 1.0  
**Owner:** Ash Shaw
