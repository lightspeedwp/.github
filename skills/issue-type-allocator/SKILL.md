---
title: Issue Type Allocator
description: Skill for selecting and allocating correct issue types across lightspeedwp projects
version: 1.0.0
last_updated: 2026-09-03
keywords: [issue-types, issue-allocation, GitHub, automation, release-agent, issues-agent, pr-agent]
author: Claude (AI)
---

# Issue Type Allocator Skill

> **Purpose**: Help agents (Release Agent, Issues Agent, PR Agent, Changelog Agent, Automation Agent) and humans select the correct GitHub issue type for any work item.

## Quick Start

When you need to assign an issue type:

1. **Is the work an improvement or new feature?** → Use **Feature** or **Enhancement**
2. **Is something broken?** → Use **Bug**
3. **Is this a small task or housekeeping?** → Use **Task** or **Chore**
4. **Is this large, coordinated work?** → Use **Epic** or **Story**
5. **Does it involve code changes?** → Consider **Code Refactor**, **Performance**, **Test Coverage**
6. **Is it critical or special?** → Consider **Security**, **A11y**, **Audit**

## Issue Type Taxonomy

### 🎯 Core Types (Always Available)

| Type | Purpose | When to Use | Example | Label |
|------|---------|-----------|---------|-------|
| **Task** | Small, focused unit of work | Specific, actionable, self-contained work | Update PR template section, fix label color, rename folder | `type:task` |
| **Bug** | Defect or broken behavior | Something doesn't work as expected | Button doesn't respond, API returns wrong status code | `type:bug` |
| **Feature** | New user-facing capability | Add entirely new feature or endpoint | "User can export as PDF", "Add dark mode toggle" | `type:feature` |
| **Enhancement** | Improvement to existing capability | Make feature better/faster/clearer | "Sort list by date", "Add search filters", "Optimize query" | `type:enhancement` |
| **Chore** | Housekeeping/maintenance work | Repo hygiene, config, non-functional changes | Add .gitignore rules, update dependencies, clean up comments | `type:chore` |

### 📐 Planning Types

| Type | Purpose | When to Use | Example | Label |
|------|---------|-----------|---------|-------|
| **Epic** | Large initiative spanning multiple sprints | Coordinate multiple stories/features | "WordPress 6.5 Compatibility", "Full redesign of dashboard" | `type:epic` |
| **Story** | User-centric narrative (often under Epic) | Describe feature from user's perspective | "As an admin, I need to export user data so I can comply with GDPR" | `type:story` |

### 🔨 Code Quality Types

| Type | Purpose | When to Use | Example | Label |
|------|---------|-----------|---------|-------|
| **Code Refactor** | Restructure code for maintainability | Technical debt, code smells, unclear patterns | "Extract utilities module", "Consolidate similar functions", "Improve variable names" | `type:refactor` |
| **Performance** | Speed/efficiency improvements | Optimize bottlenecks, reduce resource usage | "Cache API responses", "Defer JS loading", "Optimize SQL queries" | `type:performance` |
| **Test Coverage** | Add/improve test suite | Increase coverage, add missing test cases | "Add unit tests for auth module", "Write integration tests for API" | `type:test` |

### 🔒 Critical & Special Types

| Type | Purpose | When to Use | Example | Label |
|------|---------|-----------|---------|-------|
| **Security** | Security vulnerabilities/fixes | Exploits, vulnerabilities, security audit findings | "XSS vulnerability in user input", "Update outdated package with CVE" | `type:security` |
| **A11y** | Accessibility (WCAG 2.2 AA compliance) | Accessibility bugs/improvements | "Add ARIA labels to buttons", "Improve color contrast", "Support keyboard navigation" | `type:a11y` |
| **Audit** | Compliance/audit/review | Audit findings, compliance checks | "Security audit review", "Code quality review", "Documentation audit" | `type:audit` |

### 🔗 Integration & Infrastructure

| Type | Purpose | When to Use | Example | Label |
|------|---------|-----------|---------|-------|
| **Build/CI** | Build system, CI/CD pipeline work | Update workflows, fix build scripts | "Add GitHub Actions workflow", "Fix failing CI check", "Update Docker build" | `type:build` or `type:ci` |
| **Integration** | External system integration | Connect to third-party services | "Add Stripe integration", "Sync with Salesforce", "Add Slack notifications" | `type:integration` |
| **Compatibility** | Browser/version compatibility | Support specific browser/version | "Fix IE11 compatibility", "Test on iOS 15", "Support Node 18+" | `type:compatibility` |
| **Dependency** | Third-party dependency updates | Update libraries, frameworks | "Upgrade React to 19", "Update WordPress to 6.5", "Security patch npm packages" | `type:dependency` |

### 📋 Documentation & Knowledge

| Type | Purpose | When to Use | Example | Label |
|------|---------|-----------|---------|-------|
| **Documentation** | Write guides, specs, documentation | Create/update docs, specs, guides | "Document API endpoints", "Write setup guide", "Create architecture diagram" | `type:documentation` |
| **Research** | Investigation, spike, discovery | Research question, proof of concept | "Investigate performance bottleneck", "Evaluate third-party library", "Research best practices" | `type:investigation` |

### 🎨 Design & Content

| Type | Purpose | When to Use | Example | Label |
|------|---------|-----------|---------|-------|
| **Design** | Design system, UI design work | Design components, mockups, specs | "Design login flow", "Update button component", "Create design system tokens" | `type:design` |
| **Content Modelling** | Content structure and schemas (WordPress-specific) | Content types, taxonomy, schema design | "Create CPT for testimonials", "Design field structure for custom post type" | `type:content-modelling` |
| **UI** | User interface improvements | Improve visual/interactive aspects | "Redesign navigation", "Update form styling", "Improve mobile layout" | `type:ui` |
| **UX Feedback** | User experience feedback/insights | Usability issues, user feedback | "Users report confusing navigation", "Feedback on search experience" | `type:ux-feedback` |

### 🤖 Operations & Specialized

| Type | Purpose | When to Use | Example | Label |
|------|---------|-----------|---------|-------|
| **Automation** | Process automation, workflow automation | Automate tasks, improve efficiency | "Auto-label issues", "Automate release notes", "Scheduled backups" | `type:automation` |
| **AI Ops** | AI-specific operations (Code, Copilot, Agents) | AI-assisted workflows, agent configuration | "Configure release agent", "Set up Copilot instructions", "Fine-tune AI prompt" | `type:ai-ops` |
| **QA** | Quality assurance, testing processes | Manual QA, testing workflows, test plans | "Create QA test plan", "Manual regression testing", "Acceptance testing" | `type:qa` |
| **Release** | Release planning and coordination | Version bumps, release planning | "Release v2.0", "Plan quarterly release", "Create release notes" | `type:release` |
| **Maintenance** | Maintenance tasks and upkeep | Regular maintenance, system upkeep | "Database cleanup", "Server maintenance window", "Update SSL certificate" | `type:maintenance` |

---

## Decision Tree

```
START: What is this work?

├─ Something is BROKEN or NOT WORKING?
│  └─ → BUG ✓
│     (If specific browser/version) → also add COMPATIBILITY label
│     (If security issue) → → SECURITY ✓
│     (If accessibility issue) → → A11Y ✓
│
├─ Adding ENTIRELY NEW capability?
│  └─ → FEATURE ✓
│
├─ Making existing capability BETTER/FASTER?
│  └─ → ENHANCEMENT ✓
│
├─ SMALL, FOCUSED WORK?
│  ├─ (Related to features/code) → TASK
│  └─ (Housekeeping/config) → CHORE
│
├─ LARGE, COORDINATED INITIATIVE?
│  ├─ (Strategic/milestone) → EPIC
│  └─ (User-centric story) → STORY
│
├─ CODE QUALITY / TECHNICAL WORK?
│  ├─ (Improve code structure) → CODE REFACTOR
│  ├─ (Speed/efficiency) → PERFORMANCE
│  ├─ (Testing) → TEST COVERAGE
│  └─ (CI/Build system) → BUILD/CI
│
├─ INFRASTRUCTURE / INTEGRATIONS?
│  ├─ (Connect external system) → INTEGRATION
│  ├─ (Third-party library) → DEPENDENCY
│  ├─ (Browser/version support) → COMPATIBILITY
│  └─ (Automate process) → AUTOMATION
│
├─ CRITICAL CONCERNS?
│  ├─ (Security vulnerability) → SECURITY
│  ├─ (Accessibility issue) → A11Y
│  └─ (Audit/compliance) → AUDIT
│
├─ PLANNING / STRATEGY?
│  ├─ (Design mockups) → DESIGN
│  ├─ (Content structure/WP) → CONTENT MODELLING
│  ├─ (Research/spike) → RESEARCH
│  └─ (Documentation) → DOCUMENTATION
│
└─ SPECIAL / OPERATIONAL?
   ├─ (Release coordination) → RELEASE
   ├─ (QA/testing process) → QA
   ├─ (AI/Copilot config) → AI OPS
   └─ (System upkeep) → MAINTENANCE
```

---

## Common Type Distinctions

### Task vs. Chore vs. Improvement vs. Enhancement

| Scenario | Best Type | Why |
|----------|-----------|-----|
| "Add a button to the form" | **Task** | Specific, actionable item |
| "Form needs styling fixes" | **Task** | Specific adjustment |
| "Update dependencies to latest" | **Chore** | Maintenance/housekeeping |
| "Clean up unused CSS" | **Chore** | Non-functional cleanup |
| "Add sorting to table" | **Enhancement** | Improves existing feature |
| "Optimize search performance" | **Performance** | Efficiency improvement |
| "Refactor search module" | **Code Refactor** | Code structure improvement |
| "Add tests for search" | **Test Coverage** | Testing work |

### Bug vs. Feature vs. Enhancement

| Issue | Type | Why |
|-------|------|-----|
| "Button doesn't work when clicked" | **Bug** | Broken behavior (should work, doesn't) |
| "Add a new button for export" | **Feature** | New capability (didn't exist) |
| "Make button text more visible" | **Enhancement** | Improve existing button |
| "Button appears on mobile" | **Enhancement** | Extend existing feature |
| "Button missing accessibility label" | **A11y** | Special concern (compliance) |

### Build/CI vs. Dependency vs. Automation

| Issue | Type | Why |
|-------|------|-----|
| "Update GitHub Actions workflow" | **Build/CI** | CI/build system change |
| "Upgrade React to v19" | **Dependency** | Third-party library update |
| "Update npm packages" | **Dependency** | Dependency update |
| "Auto-label issues with labels" | **Automation** | Process automation |
| "Set up release automation" | **Automation** | Workflow automation |
| "Configure agent for releases" | **AI Ops** | AI agent configuration |

### Design vs. UI vs. UX Feedback

| Issue | Type | Why |
|-------|------|-----|
| "Create design mockup for login" | **Design** | Design system/planning work |
| "Update button styling" | **UI** | Visual/interactive improvement |
| "Redesign navigation layout" | **UI** | Interface restructure |
| "Users say search is confusing" | **UX Feedback** | Feedback/discovery (not actionable yet) |
| "Improve form validation messages" | **Enhancement** | Actionable improvement |

### Documentation vs. Research vs. Investigation

| Issue | Type | Why |
|-------|------|-----|
| "Write setup guide" | **Documentation** | Authoring documentation |
| "Document API endpoints" | **Documentation** | Reference documentation |
| "Investigate slow query" | **Research** | Investigation/spike |
| "POC new caching strategy" | **Research** | Research/proof-of-concept |
| "Review performance bottleneck" | **Audit** | Review/verification (if compliance-related) |
| "Check memory usage" | **Research** | Investigation work |

---

## Integration Guide for Agents

### Release Agent

**Primary types**:

- `type:release` - Create release issues
- `type:chore` - For release prep tasks
- `type:documentation` - Release notes
- `type:dependency` - If bumping versions

**Rules**:

- Auto-assign Release issues to release coordinator
- Add `priority:critical` if blocking release
- Link to Release milestone
- Ensure changelog is updated (Documentation type)

### Issues Agent

**Primary types**:

- Any type can be filed as issue
- Auto-triage untyped issues (ask for clarification)
- Use decision tree to suggest type if unclear
- Apply secondary labels (priority, area, status)

**Rules**:

- Reject issues without issue type
- Validate description matches type
- Suggest type consolidation if overlapping

### PR Agent

**Primary types**:

- Infer issue type from PR content
- Add matching `type:X` label to PR
- Auto-convert PR type labels when merged (→ closes issue with same type)

**Rules**:

- If PR mentions "fixes #123", check issue type
- Add corresponding type label to PR
- Comment if issue type seems mismatched

### Changelog Agent

**Primary types**:

- `type:feature` → Features section
- `type:bug` → Bug Fixes section
- `type:enhancement` → Improvements section
- `type:security` → Security section (top priority)
- `type:a11y` → Accessibility section
- `type:refactor` → Technical section

**Rules**:

- Skip: Chore, Task, Research, Documentation, Maintenance
- Prioritize: Security, A11y, Release
- Group by type in changelog

### Automation Agent

**Primary types**:

- `type:automation` - Create automation issues
- `type:ai-ops` - For AI agent configuration
- `type:build` - For workflow changes
- `type:chore` - For cleanup tasks

**Rules**:

- Auto-create issues for detected automation opportunities
- Link to related GitHub Actions workflows
- Tag with area (area:ci, area:automation)

---

## Validation Checklist

Before assigning an issue type, verify:

- [ ] **Type matches description**: Issue description clearly supports the chosen type
- [ ] **Not a duplicate**: Check if similar issue already exists
- [ ] **Clear boundary**: If multiple types fit, choose the PRIMARY work (why it exists)
- [ ] **Labels correct**: Apply `type:X` label matching the type
- [ ] **Additional labels**: Add priority, area, status labels
- [ ] **Assignment**: Is there an assignee? Or needs-triage?
- [ ] **Scope clear**: Is the work well-defined? Or needs refinement?

---

## Examples by Type

### Task

```
🎯 Task: Update PR template section headers
Description: Reorganize PR template headers for clarity
Type: Task
Expected: Clear, organized PR sections
```

### Feature

```
🚀 Feature: Export issues as CSV
Description: Users need to export issue data for reporting
Type: Feature
Expected: CSV export button in UI, download file
```

### Bug

```
🐛 Bug: Button doesn't respond on Safari
Description: Export button click not working in Safari 16
Type: Bug
Expected: Button works across all modern browsers
```

### Enhancement

```
⬆️ Enhancement: Add sorting to issue table
Description: Allow sorting by date, status, assignee
Type: Enhancement
Expected: Sortable columns with visual indicators
```

### Code Refactor

```
♻️ Code Refactor: Extract auth utilities module
Description: Consolidate repeated auth checks into reusable module
Type: Code Refactor
Expected: Cleaner code, DRY principle applied
```

### Security

```
🔐 Security: Update vulnerable npm package
Description: Security advisory for lodash <4.17.21
Type: Security
Expected: Updated lodash version, no vulnerabilities
```

### A11y

```
♿ A11y: Add ARIA labels to form fields
Description: Form fields missing accessibility labels for screen readers
Type: A11y
Expected: All form inputs have proper ARIA labels
```

### Build/CI

```
⚙️ Build/CI: Add GitHub Actions workflow for tests
Description: Automate test runs on every PR
Type: Build/CI
Expected: Tests run automatically, report passes/fails
```

### Design

```
🎨 Design: Create design tokens for spacing
Description: Establish consistent spacing scale
Type: Design
Expected: Documented token set, implemented in CSS
```

### Content Modelling

```
📖 Content Modelling: Create testimonial CPT
Description: Design custom post type for client testimonials
Type: Content Modelling
Expected: CPT registered with fields and taxonomy
```

### Release

```
🚀 Release: Version 2.5.0
Description: Coordinate 2.5.0 release (features X, Y, Z)
Type: Release
Expected: Version bumped, changelog updated, released
```

---

## Troubleshooting

### "This could be Type A or Type B"

**Solution**: Choose the PRIMARY reason it exists:

- If it exists because something is broken → **Bug**
- If it exists to add new capability → **Feature**
- If it exists to make existing better → **Enhancement**
- If it exists to refactor/improve code → **Code Refactor**

### "This seems like multiple types"

**Solution**: Break it into separate issues:

- ✅ Good: One feature + one test coverage issue
- ✅ Good: One bug + one A11y issue (both critical)
- ❌ Bad: Mixing unrelated work in one issue

### "I'm unsure between Code Refactor and Enhancement"

**Solution**:

- **Enhancement**: User sees/experiences the change
- **Code Refactor**: Only internal code changes, users don't see difference

---

## References

- [Issue Types YAML Configuration](.github/issue-types.yml)
- [Issue Templates](.github/ISSUE_TEMPLATE/)
- [Label Strategy](../../docs/LABEL_STRATEGY.md)
- [Labeling Guide](../../docs/LABELING.md)
- [Branching Strategy](../../docs/BRANCHING_STRATEGY.md)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-09-03 | Initial skill creation with 35 issue types, decision tree, agent integration guide |

---

**Last Updated**: 2026-09-03 by Claude (AI)
**Status**: Active
**Maintainer**: Issue Type Allocator Working Group
