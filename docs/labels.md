---
file_type: "documentation"
title: "GitHub Labels Guide"
description: "Comprehensive guide to LightSpeed label semantics, usage examples, and automation workflows"
version: "1.0"
last_updated: "2025-11-12"
maintainer: "LightSpeed Team"
tags: ["labels", "github", "automation", "workflow", "triage"]
related_docs:
  - "/.github/automation/labels.yml"
  - "/.github/automation/ISSUE_LABELS.md"
  - "/.github/automation/PR_LABELS.md"
  - "/docs/label-automation/README.md"
---

# GitHub Labels Guide

This guide explains the semantics, usage, and automation workflows for all LightSpeed GitHub labels defined in [labels.yml](../.github/automation/labels.yml).

## Table of Contents

- [Label Families](#label-families)
- [Label Semantics](#label-semantics)
- [Usage Examples](#usage-examples)
- [Automation Workflows](#automation-workflows)
- [Best Practices](#best-practices)

---

## Label Families

LightSpeed uses a structured label taxonomy organized into families by prefix:

| Family          | Prefix         | Purpose                                                   | Count |
| --------------- | -------------- | --------------------------------------------------------- | ----- |
| **Type**        | `type:*`       | Categorizes the nature of work (bug, feature, docs, etc.) | 23    |
| **Status**      | `status:*`     | Tracks workflow state and progress                        | 9     |
| **Priority**    | `priority:*`   | Indicates urgency and importance                          | 4     |
| **Area**        | `area:*`       | Identifies system component or domain                     | 9     |
| **Language**    | `lang:*`       | Specifies programming language                            | 3     |
| **Release**     | `release:*`    | Indicates semantic version impact                         | 3     |
| **Meta**        | `meta:*`       | Metadata flags for automation                             | 3     |
| **Contributor** | `contrib:*`    | Community engagement labels                               | 3     |
| **Discussion**  | `discussion:*` | Discussion categorization                                 | 7     |

---

## Label Semantics

### Type Labels (`type:*`)

Categorize the nature of work being done. **Required** for all issues and PRs.

| Label                | When to Use                                     | Example                                          |
| -------------------- | ----------------------------------------------- | ------------------------------------------------ |
| `type:bug`           | Defects, errors, or unintended behavior         | "Header alignment broken on mobile"              |
| `type:feature`       | New functionality or capabilities               | "Add user profile avatar upload"                 |
| `type:task`          | General tasks or to-dos                         | "Update dependencies to latest versions"         |
| `type:story`         | User stories (agile methodology)                | "As a user, I want to save my preferences"       |
| `type:documentation` | Documentation updates                           | "Add API endpoint documentation"                 |
| `type:refactor`      | Code restructuring without changing behavior    | "Extract utility functions into separate module" |
| `type:build`         | Build system, CI/CD, or tooling changes         | "Update GitHub Actions to v4"                    |
| `type:automation`    | Workflow automation improvements                | "Add automated label sync workflow"              |
| `type:performance`   | Performance optimizations                       | "Reduce page load time by lazy-loading images"   |
| `type:test`          | Testing and test coverage improvements          | "Add unit tests for user service"                |
| `type:security`      | Security vulnerabilities or hardening           | "Patch XSS vulnerability in search form"         |
| `type:a11y`          | Accessibility improvements                      | "Add ARIA labels to navigation menu"             |
| `type:design`        | Design work, mockups, or visual changes         | "Design new dashboard layout"                    |
| `type:compatibility` | Compatibility fixes (browser, WP version, etc.) | "Fix compatibility with WordPress 6.6"           |
| `type:integration`   | Third-party integrations                        | "Integrate Stripe payment gateway"               |
| `type:release`       | Release preparation tasks                       | "Prepare v2.0 release notes"                     |
| `type:maintenance`   | Routine maintenance tasks                       | "Clean up deprecated code"                       |
| `type:improve`       | General improvements                            | "Improve error messaging clarity"                |
| `type:qa`            | Quality assurance tasks                         | "QA test checkout flow"                          |
| `type:chore`         | Miscellaneous chores                            | "Update copyright year"                          |
| `type:audit`         | Code, security, or performance audits           | "Audit API endpoint performance"                 |
| `type:epic`          | Large multi-scope initiatives                   | "Complete user authentication system"            |
| `type:research`      | Research and investigation                      | "Research best CSS-in-JS library"                |
| `type:review`        | Code or design review tasks                     | "Review PR #123 for security issues"             |

### Status Labels (`status:*`)

Track workflow state and progress. **Automatically updated** by automation workflows.

| Label                   | Meaning                         | When Applied                            | Next Action                             |
| ----------------------- | ------------------------------- | --------------------------------------- | --------------------------------------- |
| `status:needs-triage`   | Needs triage and prioritization | Automatically on new issues             | Maintainer reviews and assigns labels   |
| `status:needs-planning` | Awaiting planning or scoping    | Maintainer applies after triage         | Team plans approach and assigns         |
| `status:ready`          | Ready to start work             | After planning is complete              | Developer picks up and starts work      |
| `status:in-progress`    | Work currently underway         | When PR is opened or issue assigned     | Continue work until ready for review    |
| `status:needs-review`   | Awaiting code or design review  | When PR is ready for review             | Reviewer examines and provides feedback |
| `status:needs-qa`       | Quality assurance required      | After code review approval              | QA team tests functionality             |
| `status:blocked`        | Blocked by dependency or issue  | When external blocker prevents progress | Resolve blocker before continuing       |
| `status:on-hold`        | Work temporarily paused         | When work is deferred                   | Resume when circumstances change        |
| `status:done`           | Completed and merged/closed     | When PR is merged or issue resolved     | Archive and celebrate! 🎉               |

**Status Workflow:**

```
needs-triage → needs-planning → ready → in-progress → needs-review → needs-qa → done
                                                         ↓
                                                    blocked/on-hold
```

### Priority Labels (`priority:*`)

Indicate urgency and importance. **Applied manually** during triage.

| Label                | Meaning                                  | SLA                          | Example                                |
| -------------------- | ---------------------------------------- | ---------------------------- | -------------------------------------- |
| `priority:critical`  | Production blocking, urgent fix required | Fix within 24 hours          | Site completely down, security breach  |
| `priority:important` | Must-do high priority                    | Address in current sprint    | Major feature blocker, significant bug |
| `priority:normal`    | Default priority                         | Address in backlog order     | Standard feature request, minor bug    |
| `priority:minor`     | Low priority, nice-to-have               | Address when capacity allows | Cosmetic issue, documentation typo     |

**Priority Assignment Rules:**

- **Critical:** Production outages, data loss, security vulnerabilities
- **Important:** Significant bugs affecting multiple users, key features
- **Normal:** Default for all new issues unless otherwise specified
- **Minor:** Cosmetic issues, small improvements, documentation tweaks

### Area Labels (`area:*`)

Identify system component or domain affected.

| Label                | Component                             | Example                                |
| -------------------- | ------------------------------------- | -------------------------------------- |
| `area:core`          | Core infrastructure, shared utilities | "Refactor authentication service"      |
| `area:block-editor`  | Gutenberg block editor                | "Add custom block toolbar controls"    |
| `area:theme`         | WordPress theme                       | "Update theme.json color palette"      |
| `area:ci`            | Continuous integration                | "Add automated accessibility testing"  |
| `area:documentation` | Documentation files                   | "Update README installation steps"     |
| `area:tests`         | Test suites                           | "Add E2E tests for checkout flow"      |
| `area:scripts`       | Build scripts, automation             | "Optimize webpack build configuration" |
| `area:assets`        | Images, fonts, media                  | "Compress header images"               |
| `area:woocommerce`   | WooCommerce integration               | "Add custom product fields"            |

### Language Labels (`lang:*`)

Specify primary programming language affected.

| Label             | Language              | When to Use                       |
| ----------------- | --------------------- | --------------------------------- |
| `lang:php`        | PHP                   | Backend code, WordPress functions |
| `lang:javascript` | JavaScript/TypeScript | Frontend code, React components   |
| `lang:css`        | CSS/SCSS              | Styles, design system             |

### Release Labels (`release:*`)

Indicate semantic versioning impact. **Required** for all user-facing changes.

| Label           | Version Impact                                       | Example                           |
| --------------- | ---------------------------------------------------- | --------------------------------- |
| `release:patch` | Bug fixes, patches (v1.0.0 → v1.0.1)                 | "Fix typo in error message"       |
| `release:minor` | New features, backwards-compatible (v1.0.0 → v1.1.0) | "Add user profile page"           |
| `release:major` | Breaking changes (v1.0.0 → v2.0.0)                   | "Remove deprecated API endpoints" |

### Meta Labels (`meta:*`)

Metadata flags for automation and workflow control.

| Label                  | Purpose                       | When Applied                           |
| ---------------------- | ----------------------------- | -------------------------------------- |
| `meta:needs-changelog` | PR needs changelog entry      | Automatically if no changelog detected |
| `meta:no-changelog`    | PR does not require changelog | Apply to internal-only changes         |
| `meta:duplicate`       | Duplicate issue or PR         | Apply when closing as duplicate        |

### Contributor Labels (`contrib:*`)

Community engagement and contribution facilitation.

| Label                      | Purpose                    | When to Use                                     |
| -------------------------- | -------------------------- | ----------------------------------------------- |
| `contrib:good-first-issue` | Beginner-friendly issue    | Simple, well-scoped issues for new contributors |
| `contrib:help-wanted`      | Community help requested   | Issues where maintainers welcome community PRs  |
| `contrib:discussion`       | Community discussion topic | Open-ended discussions, RFCs, brainstorming     |

### Discussion Labels (`discussion:*`)

Categorize GitHub Discussions topics.

| Label                     | Category                  | When to Use                                |
| ------------------------- | ------------------------- | ------------------------------------------ |
| `discussion:announcement` | Official announcements    | Product updates, release announcements     |
| `discussion:showcase`     | Show & Tell               | Community showcases, success stories       |
| `discussion:community`    | Community/general         | General community chat, introductions      |
| `discussion:feedback`     | Feedback/suggestions      | Product feedback, feature suggestions      |
| `discussion:support`      | Support/troubleshooting   | Help requests, troubleshooting             |
| `discussion:sponsorship`  | Sponsorship/funding       | Sponsorship inquiries, funding discussions |
| `discussion:partnership`  | Partnership/collaboration | Partnership opportunities, collaborations  |

---

## Usage Examples

### Example 1: Bug Report Triage

**Scenario:** User reports header alignment issue on mobile.

```yaml
Labels Applied:
  - type:bug                  # It's a defect
  - priority:important        # Affects mobile users
  - area:theme               # Theme-related issue
  - lang:css                 # Requires CSS fix
  - status:needs-planning    # After triage, needs scoping

Workflow:
1. Issue created → status:needs-triage (automatic)
2. Maintainer triages → adds type:bug, priority:important, area:theme
3. Maintainer scopes → changes to status:needs-planning
4. Developer assigned → changes to status:ready
5. PR opened → changes to status:in-progress
6. PR ready → changes to status:needs-review
7. PR approved → changes to status:needs-qa
8. PR merged → changes to status:done
```

### Example 2: Feature Request Workflow

**Scenario:** Add user profile avatar upload functionality.

```yaml
Labels Applied:
  - type:feature              # New functionality
  - priority:normal           # Standard priority
  - area:core                # Core functionality
  - lang:php                 # Backend work
  - lang:javascript          # Frontend work
  - release:minor            # New feature = minor version bump
  - status:needs-planning    # Needs technical design

Workflow:
1. Issue created → status:needs-triage
2. Maintainer approves → type:feature, priority:normal, release:minor
3. Tech lead creates design doc → status:needs-planning
4. Design approved → status:ready
5. Developer starts work → status:in-progress
6. PR opened with changelog entry → meta:needs-changelog removed
7. Code review → status:needs-review
8. QA testing → status:needs-qa
9. Merged to main → status:done, issue closed
```

### Example 3: Security Vulnerability

**Scenario:** XSS vulnerability discovered in search form.

```yaml
Labels Applied:
  - type:security            # Security issue
  - priority:critical        # Production vulnerability
  - area:core               # Core search functionality
  - lang:php                # Backend sanitization needed
  - release:patch           # Security patch = patch version
  - status:in-progress      # Immediate fix in progress

Workflow:
1. Private security report received
2. Maintainer confirms → type:security, priority:critical
3. Immediate fix starts → status:in-progress
4. Hotfix PR created → release:patch, meta:no-changelog (security)
5. Expedited review → status:needs-review (priority lane)
6. Merged to main and patched → status:done
7. Security advisory published (post-fix)
```

### Example 4: Documentation Update

**Scenario:** Add API endpoint documentation.

```yaml
Labels Applied:
  - type:documentation       # Docs update
  - priority:normal          # Standard priority
  - area:documentation      # Documentation files
  - meta:no-changelog       # Internal-only, no user-facing changelog
  - status:ready            # Simple task, ready to start

Workflow:
1. Issue created → status:needs-triage
2. Maintainer approves → type:documentation, meta:no-changelog
3. Contributor picks up → status:in-progress
4. PR opened → status:needs-review
5. Approved and merged → status:done
```

### Example 5: Performance Optimization

**Scenario:** Reduce page load time by lazy-loading images.

```yaml
Labels Applied:
  - type:performance         # Performance improvement
  - priority:important       # Significant user experience impact
  - area:theme              # Theme templates affected
  - lang:javascript         # Lazy-loading script
  - release:minor           # Enhancement = minor version
  - status:needs-planning   # Needs performance testing plan

Workflow:
1. Issue created with performance metrics → status:needs-triage
2. Maintainer prioritizes → type:performance, priority:important
3. Performance testing plan created → status:ready
4. Developer implements lazy-loading → status:in-progress
5. PR includes before/after metrics → status:needs-review
6. Performance validated → status:needs-qa
7. Merged with changelog entry → status:done, release:minor
```

---

## Automation Workflows

### Automatic Label Application

Labels are automatically applied based on:

1. **Issue/PR Templates** – Template selection applies initial labels
2. **Branch Names** – Branch prefix maps to labels (e.g., `feat/` → `type:feature`)
3. **File Paths** – Modified files trigger area labels (e.g., `*.php` → `lang:php`)
4. **Keywords** – Content keywords trigger labels (e.g., "security" → `type:security`)

**Example: Branch-Based Auto-Labeling**

```yaml
Branch: feat/user-dashboard
Auto-applied labels:
  - type:feature
  - status:in-progress

Branch: fix/wp6-6-compat
Auto-applied labels:
  - type:bug
  - type:compatibility
  - status:in-progress

Branch: docs/api-reference
Auto-applied labels:
  - type:documentation
  - area:documentation
  - status:in-progress
```

### Status Transitions

Status labels are automatically updated during PR lifecycle:

```yaml
Event: PR opened
Action: Apply status:in-progress

Event: PR marked ready for review
Action: Apply status:needs-review

Event: PR approved by reviewer
Action: Apply status:needs-qa

Event: PR merged
Action: Apply status:done, close linked issues
```

### Changelog Enforcement

PRs without changelog entries are flagged:

```yaml
Condition: PR modifies user-facing code
  AND PR does not update CHANGELOG.md
  AND PR does not have meta:no-changelog
Action: Apply meta:needs-changelog
  Add comment requesting changelog entry
```

---

## Best Practices

### For Issue Creators

1. **Use Issue Templates** – Templates apply correct initial labels automatically
2. **Be Descriptive** – Detailed descriptions help maintainers apply accurate labels
3. **Don't Over-Label** – Let maintainers apply type, priority, and area labels during triage
4. **Do Apply Meta Labels** – If you know the change doesn't need a changelog, apply `meta:no-changelog`

### For Maintainers

1. **Triage Promptly** – Review `status:needs-triage` issues within 2 business days
2. **Be Specific** – Apply all relevant labels (type, priority, area, language)
3. **Explain Priority** – Add a comment justifying `priority:critical` or `priority:important`
4. **Use Status Workflow** – Follow the canonical status progression
5. **Keep Labels Clean** – Remove labels that no longer apply

### For Contributors

1. **Check Existing Labels** – Review labels before starting work to understand scope
2. **Use Correct Branch Prefix** – Match your branch name to the issue type for auto-labeling
3. **Update Status** – Move issues to `status:in-progress` when you start work
4. **Add Changelog Entries** – All user-facing changes need changelog entries unless `meta:no-changelog`
5. **Request Label Changes** – Ask maintainers to update labels if the scope changes

### For Reviewers

1. **Verify Labels** – Ensure PR labels match the actual changes
2. **Update Status** – Move PRs through status workflow (review → QA → done)
3. **Check Changelog** – Verify changelog entry exists for user-facing changes
4. **Validate Priority** – Confirm priority labels match urgency and impact

---

## When to Use Each Label

### Use `status:needs-info` vs `status:blocked`

- **`status:needs-info`** – Missing information from reporter (user input required)
- **`status:blocked`** – External dependency or technical blocker (not user input)

**Example:**

- Needs info: "Can you provide steps to reproduce this bug?"
- Blocked: "Waiting for upstream library to fix API endpoint"

### Use `type:bug` vs `type:improve`

- **`type:bug`** – Unintended behavior, defect, or error
- **`type:improve`** – Intentional behavior that could be better

**Example:**

- Bug: "Button doesn't submit form" (broken functionality)
- Improve: "Button could have better hover animation" (enhancement)

### Use `priority:critical` vs `priority:important`

- **`priority:critical`** – Production down, data loss, security breach (fix immediately)
- **`priority:important`** – Significant impact, key feature affected (fix this sprint)

**Example:**

- Critical: "Payment processing completely broken" (revenue impact)
- Important: "Checkout flow has confusing UX" (user experience impact)

### Use `meta:no-changelog` vs `meta:needs-changelog`

- **`meta:no-changelog`** – Internal-only changes (refactors, tests, docs, CI)
- **`meta:needs-changelog`** – User-facing changes missing changelog entry

**Example:**

- No changelog: "Refactor internal utility functions" (no user impact)
- Needs changelog: "Add user profile page" (new user-facing feature)

---

## Label Sync Workflow

All LightSpeed repositories should sync labels from the canonical [labels.yml](../.github/automation/labels.yml) using the automated label sync workflow.

**See:** [Label Sync Workflow Documentation](../.github/workflows/label-sync.yml)

---

## Related Documentation

- [Canonical Labels YAML](../.github/automation/labels.yml) – Single source of truth for all labels
- [Issue Labels Guide](../.github/automation/ISSUE_LABELS.md) – Issue-specific label documentation
- [PR Labels Guide](../.github/automation/PR_LABELS.md) – PR-specific label documentation
- [Label Automation Strategy](./label-automation/README.md) – Comprehensive automation documentation
- [Automation Governance](../.github/automation/AUTOMATION_GOVERNANCE.md) – Org-wide automation rules
- [Contributing Guidelines](../CONTRIBUTING.md) – Contribution workflow

---

**Maintained by LightSpeed Team** • For updates or questions, see [CONTRIBUTING.md](../CONTRIBUTING.md)
