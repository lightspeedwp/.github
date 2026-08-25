# Linear Advisor Agent — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation of the Linear Advisor Agent integrates directly with GitHub's development environment, providing intelligent assistance within code editors and pull requests.

Copilot excels at:

- **GitHub Projects integration** – Manage issues and projects
- **Code analysis** – Review and improve code
- **Workflow automation** – Trigger GitHub Actions
- **Pull request assistance** – Review and comment on PRs

## Available Skills

Skills are triggered using @ mentions in Copilot Chat:

1. **@linear-create-issue** – Create Linear issues from requirements
2. **@linear-plan-sprint** – Plan and organize sprints
3. **@linear-manage-release** – Manage releases and versions
4. **@linear-analyze-project** – Analyze project status and metrics
5. **@linear-team-coordination** – Facilitate team communication
6. **@linear-automation-setup** – Configure workflow automation

## Skill Implementation

### @linear-create-issue

Creates Linear issues directly from conversation context. Understands issue requirements, estimates effort, and assigns to team members.

**Usage:**

```
@linear-create-issue Fix authentication bug in login flow
- Priority: High
- Estimate: 8 points
- Assign to: @dev-team
```

### @linear-plan-sprint

Plans sprints by analyzing backlog, team capacity, and priorities.

**Usage:**

```
@linear-plan-sprint Spring 2024 Q3 Planning
- Duration: 2 weeks
- Team capacity: 120 points
- Goals: Feature completion, bug fixes
```

### @linear-manage-release

Coordinates release planning, versioning, and deployment.

**Usage:**

```
@linear-manage-release v2.0.0 Release
- Features: New dashboard, API improvements
- Date: Next Friday
- Verification: QA checklist
```

### @linear-analyze-project

Provides project health status, metrics, and recommendations.

**Usage:**

```
@linear-analyze-project Website Redesign
- Show: Burndown, velocity, blockers
- Compare: Baseline vs actual
```

### @linear-team-coordination

Facilitates team communication and coordination.

**Usage:**

```
@linear-team-coordination Daily Standup
- Team: Backend team
- Format: Issues completed, blockers, next steps
```

### @linear-automation-setup

Configures workflow automation rules and triggers.

**Usage:**

```
@linear-automation-setup Auto-assign bugs
- Trigger: Bug reported
- Action: Assign to QA team lead
- Notify: Dev team
```

## Response Format

Copilot provides responses optimized for GitHub:

### Issue Creation Response

```markdown
## Issue Created: [ISSUE-123]
- Title: [Issue title]
- Project: [Project name]
- Status: Ready for development
- Assigned to: [Team member]
- Estimate: [Points]
```

### Sprint Planning Response

```markdown
## Sprint [N] Plan
- Duration: [Dates]
- Committed issues: [Count]
- Team capacity: [Points]
- Risk assessment: [Assessment]
```

### Release Coordination Response

```markdown
## Release Plan: [Version]
- Features: [Count]
- Timeline: [Dates]
- Deployment: [Steps]
- Verification: [Checklist]
```

## GitHub Integration

Works with:

- **GitHub Projects (beta)** – Sync Linear issues and milestones
- **GitHub Discussions** – Link Linear issues to discussions
- **Pull Requests** – Reference Linear issues in PR descriptions
- **GitHub Actions** – Trigger Linear workflows from CI/CD
- **GitHub Teams** – Sync team membership and permissions

## Workflow Integration

### PR to Linear Issue Linking

- Automatically link merged PRs to Linear issues
- Update issue status based on PR merge
- Generate release notes from closed issues
- Close issues when PR is merged
- Track deployment from PR description

### GitHub Actions Automation

- Trigger Linear workflows from push events
- Create issues from GitHub alerts
- Update project status from CI results
- Sync metrics to GitHub Projects
- Auto-comment on issues with CI status
- Link GitHub Actions to Linear milestones

### Team Collaboration

- Mention Linear issues in discussions (#LIN-123)
- Auto-assign based on GitHub team membership
- Link pull requests to Linear issues
- Track deployment status in GitHub
- Create automated team notifications
- Sync GitHub team changes to Linear

## Advanced Integration Patterns

### Issue Lifecycle

1. Issue created in Linear
2. Developer mentions in PR description
3. CI runs and reports status
4. PR merged triggers status update
5. Issue auto-closes when PR merges
6. Release notes generated from issue
7. Metrics updated in dashboard

### Release Coordination

1. Release planned in Linear
2. Features added as milestone issues
3. PRs linked to issues
4. CI verifies all changes
5. Release branch created from milestone
6. Release notes auto-generated
7. GitHub Release created with notes
8. Deployment status tracked

### Sprint Automation

1. Sprint created in Linear
2. Issues committed to sprint
3. Daily standup triggers status check
4. Burndown chart updated
5. Blockers auto-flagged
6. Retrospective feedback collected
7. Metrics calculated and reported

## Performance Metrics Tracking

Copilot helps track:

- Sprint velocity and trends
- Issue resolution rate
- PR review time
- Deployment frequency
- Bug escape rate
- Team productivity metrics

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [skills.yaml](./skills.yaml) – Skill definitions
- [AGENT.md](../AGENT.md) – Agent specification

---

*Built by LightSpeedWP with open-source spirit!*

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
