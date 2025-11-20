---
title: "Automation Governance"
version: "v1.0.0"
last_updated: "2025-11-17"
author: "LightSpeed WP Team"
description: "Governance policies for GitHub automation, agents, and labeling workflows"
tags: ["governance", "automation", "labels", "workflows", "agents"]
---

# LightSpeed Automation Governance

This document defines the governance policies, standards, and procedures for GitHub automation across LightSpeed projects, with a focus on labeling agents, workflows, and configuration management.

---

## 1. Purpose & Scope

### Purpose

- Ensure consistency and quality in automation across all LightSpeed repositories
- Define clear ownership and approval processes for automation changes
- Establish standards for creating, maintaining, and deprecating automation

### Scope

This governance applies to:

- GitHub Actions workflows
- Labeling agents and automation
- Configuration files (labels.yml, labeler.yml, issue-types.yml)
- Custom scripts and utilities in `.github/`
- Reusable workflows and actions

---

## 2. Label Governance

### 2.1 Canonical Label Set

**Ownership:** Platform Team
**Location:** `.github/automation/labels.yml`

#### Adding New Labels

**Requirements:**

1. **Justification:** Document why the label is needed
2. **Category:** Assign to appropriate category (status, priority, type, area, etc.)
3. **Naming Convention:** Follow `category:name` format (e.g., `status:in-progress`)
4. **Color Coding:** Use category-appropriate colors (defined below)
5. **Description:** Provide clear, concise description

**Color Standards:**

- **Status:** Blue tones (`BFD4F2`, `C5DEF5`, `1D76DB`)
- **Priority:** Red/Orange gradient (`B60205` critical → `C2E0C6` minor)
- **Type:** Green for features (`3FB950`), Red for bugs (`9F3734`), Purple for docs (`D4C5F9`)
- **Area/Component:** Light blue (`C5DEF5`)
- **Meta:** Grey (`E1E4E8`)

**Approval Process:**

1. Create PR with label addition to `labels.yml`
2. Document use case in PR description
3. Require approval from 2 Platform Team members
4. Label takes effect on next label-sync workflow run

#### Deprecating Labels

**Process:**

1. Add label to deprecation list with replacement (if any)
2. Add alias mapping old → new label in `labels.yml`
3. Run migration script to update existing issues/PRs
4. After 30-day grace period, remove deprecated label

**Example:**

```yaml
- name: status:in-progress
  aliases: ["in progress", "wip", "status:wip"] # Deprecated aliases
```

### 2.2 Repository-Specific Labels

Repositories may have specific labels not in the canonical set.

**Allowed:**

- Component-specific areas (e.g., `comp:custom-block`)
- Project-specific contexts (e.g., `project:migration-2024`)
- Temporary labels for initiatives (prefix with `temp:`)

**Not Allowed:**

- Alternative status/priority/type labels
- Labels that conflict with canonical naming

**Documentation:**
Repository-specific labels must be documented in the repository's README.

---

## 3. Workflow Governance

### 3.1 Workflow Approval

**Standard Workflows (require Platform Team approval):**

- Labeling workflows
- Label sync workflows
- Security scanning
- Dependency management
- Release automation

**Repository-Specific Workflows (require Maintainer approval):**

- Build/test workflows
- Deployment workflows
- Custom automation

### 3.2 Workflow Standards

All workflows must:

1. **Include skip condition:** Support `[skip workflow-name]` in commit messages
2. **Have concurrency control:** Prevent overlapping runs where appropriate
3. **Use semantic names:** Clear, descriptive names (e.g., `Labeling • Issues & PRs`)
4. **Set appropriate permissions:** Minimal required permissions only
5. **Include failure handling:** Appropriate `continue-on-error` or `if: failure()`
6. **Generate summaries:** Use `$GITHUB_STEP_SUMMARY` for output
7. **Follow UK English:** All text, comments, and documentation

### 3.3 Secrets Management

**Prohibited:**

- Hardcoded credentials in workflows
- Secrets in public repositories
- Sharing secrets across unrelated workflows

**Required:**

- Use GitHub Secrets or environment secrets
- Document required secrets in workflow README
- Rotate secrets quarterly
- Use least-privilege principle

---

## 4. Agent Governance

### 4.1 Agent Development Standards

**Location:** `.github/agents/`
**Includes:** `.github/agents/includes/`
**Tests:** `.github/agents/includes/__tests__/`

**Requirements:**

1. **Modular Design:** Agents orchestrate; utilities implement logic
2. **Configuration-Driven:** No hardcoded values; use YAML configs
3. **Test Coverage:** Minimum 80% coverage for new utilities
4. **Error Handling:** Comprehensive error handling with retry logic
5. **Logging:** Use `@actions/core` for consistent logging
6. **Documentation:** JSDoc for all functions, README for agents

### 4.2 Agent Deployment

**Deployment Process:**

1. Develop in feature branch
2. Add/update tests
3. Update documentation
4. Create PR with `type:automation` label
5. Require 2 Platform Team approvals
6. Test in sandbox repository (if available)
7. Deploy to production via merge

**Rollback Procedure:**

1. Revert PR if critical issues detected
2. Create hotfix for critical bugs
3. Document incident in post-mortem

---

## 5. Configuration Management

### 5.1 Configuration Files

**Canonical Configurations:**

| File              | Purpose                       | Owner         | Approval Required |
| ----------------- | ----------------------------- | ------------- | ----------------- |
| `labels.yml`      | Label definitions             | Platform Team | 2 approvals       |
| `labeler.yml`     | File/branch-based label rules | Platform Team | 2 approvals       |
| `issue-types.yml` | Issue type definitions        | Platform Team | 2 approvals       |

### 5.2 Validation

**Pre-commit:**

- YAML syntax validation
- Schema validation (via `yaml-validator.js`)
- Referential integrity (labels in templates exist in `labels.yml`)

**CI Validation:**

- All PRs touching config files trigger validation workflow
- Failed validation blocks merge

**Post-deployment:**

- `label-sync` workflow validates and syncs across repositories
- Orphan label detection creates issues for review

---

## 6. Change Management

### 6.1 Change Categories

**Minor Changes (Single Approver):**

- Label description updates
- Color adjustments
- Documentation improvements
- Bug fixes in non-critical paths

**Major Changes (Platform Team Approval):**

- New label categories
- Workflow logic changes
- Breaking changes to automation
- Schema changes

**Emergency Changes (Post-approval):**

- Security fixes
- Critical bug fixes affecting production
- Require post-merge review within 24 hours

### 6.2 Communication

**Required Notifications:**

- **Slack:** #platform channel for all automation changes
- **GitHub Discussions:** Major changes with community impact
- **Release Notes:** Document in CHANGELOG.md

---

## 7. Quality & Compliance

### 7.1 Quality Gates

**Pre-merge:**

- ✅ All tests pass
- ✅ Lint checks pass
- ✅ YAML validation passes
- ✅ Required approvals obtained
- ✅ Documentation updated

**Post-merge:**

- ✅ Automation runs successfully in production
- ✅ No increase in error rates
- ✅ Performance metrics within acceptable range

### 7.2 Monitoring

**Tracked Metrics:**

- Workflow success/failure rates
- Agent execution time
- Label drift (repositories with orphan labels)
- Configuration validation failures

**Review Cadence:**

- Weekly: Review failed workflow runs
- Monthly: Review agent performance
- Quarterly: Audit label usage and cleanup

---

## 8. Training & Onboarding

### 8.1 Required Knowledge

**For Contributors:**

- GitHub Actions basics
- YAML syntax
- Label taxonomy and categories
- How to use labeling agent

**For Maintainers:**

- Agent architecture
- Configuration management
- Workflow debugging
- Incident response

### 8.2 Resources

- **Documentation:** [docs/LABELING_AGENT_USAGE.md](../docs/LABELING_AGENT_USAGE.md)
- **Agent Spec:** [.github/agents/labeling.agent.md](.github/agents/labeling.agent.md)
- **Label Strategy:** [docs/LABEL_STRATEGY.md](../docs/LABEL_STRATEGY.md)
- **Coding Standards:** [.github/instructions/coding-standards.instructions.md](.github/instructions/coding-standards.instructions.md)

---

## 9. Incident Management

### 9.1 Incident Classification

**Severity Levels:**

- **P0 (Critical):** Automation blocking all PRs/issues
- **P1 (High):** Incorrect labels applied at scale
- **P2 (Medium):** Workflow failures, degraded functionality
- **P3 (Low):** Minor bugs, cosmetic issues

### 9.2 Response Procedures

**P0/P1 Incidents:**

1. Immediately disable affected workflow if needed
2. Notify Platform Team in #platform-alerts
3. Create incident issue with `priority:critical`
4. Investigate and implement hotfix
5. Document in post-mortem

**P2/P3 Incidents:**

1. Create issue with appropriate priority
2. Assign to next sprint or backlog
3. Fix via standard PR process

---

## 10. Deprecation & Retirement

### 10.1 Deprecation Process

**For Workflows:**

1. Add deprecation notice to workflow documentation
2. Set 90-day deprecation period
3. Create migration guide
4. Notify users via GitHub Discussions
5. Disable workflow after grace period
6. Archive workflow file

**For Labels:**

1. Add to deprecation list with replacement
2. Add alias mapping
3. Run migration across repositories
4. 30-day grace period
5. Remove label from canonical set

---

## 11. Contacts & Escalation

**Platform Team:**

- Primary contact for automation issues
- Approvers for major changes
- Incident response team

**Escalation Path:**

1. Create issue in `.github` repository
2. Mention `@platform-team` for urgent issues
3. Use `#platform` Slack channel for real-time help
4. Email <platform-team@lightspeedwp.com> for critical issues

---

## 12. Review & Updates

**This document is reviewed:**

- Quarterly by Platform Team
- After major incidents
- When significant automation changes are proposed

**Version History:**

- v1.0.0 (2025-11-17): Initial version

---

## Appendix A: Label Categories Reference

| Category    | Prefix        | Example                    | Purpose               |
| ----------- | ------------- | -------------------------- | --------------------- |
| Status      | `status:`     | `status:in-progress`       | Workflow state        |
| Priority    | `priority:`   | `priority:high`            | Urgency level         |
| Type        | `type:`       | `type:bug`                 | Nature of work        |
| Area        | `area:`       | `area:core`                | Codebase area         |
| Component   | `comp:`       | `comp:block-editor`        | Specific component    |
| Language    | `lang:`       | `lang:php`                 | Programming language  |
| Meta        | `meta:`       | `meta:needs-changelog`     | Process/admin         |
| Contributor | `contrib:`    | `contrib:good-first-issue` | Community labels      |
| Discussion  | `discussion:` | `discussion:feedback`      | Discussion categories |
| Release     | `release:`    | `release:patch`            | Release type          |

---

*For questions about this governance document, create an issue in the [`.github` repository](https://github.com/lightspeedwp/.github/issues) or contact the Platform Team.*
