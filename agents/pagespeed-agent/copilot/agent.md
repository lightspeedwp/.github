---
provider: copilot
agent_slug: pagespeed
agent_name: PageSpeed Agent (GitHub Copilot)
status: production
version: 1.0.2
created_date: '2026-07-22'
last_updated: '2026-08-18'
platform: github
integration: copilot-chat
---

# PageSpeed Agent — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation of the PageSpeed Agent integrates directly with GitHub's development environment, providing intelligent assistance within code editors and pull requests.

Copilot excels at:
- **GitHub Projects integration** – Manage issues and projects
- **Code analysis** – Review and improve code
- **Workflow automation** – Trigger GitHub Actions
- **Pull request assistance** – Review and comment on PRs

## Available Skills

Skills are triggered using @ mentions in Copilot Chat:

1. **@skill-analyze** – Analyze requirements
2. **@skill-plan** – Create implementation plan
3. **@skill-review** – Review outputs
4. **@skill-document** – Generate documentation
5. **@skill-validate** – Validate results
6. **@skill-sync** – Sync with project tools

## Response Format

Copilot provides responses optimized for GitHub:
- Markdown-formatted explanations
- Code snippets with syntax highlighting
- Links to related GitHub issues and discussions
- Action buttons for common tasks

## GitHub Integration

Works with:
- **GitHub Projects (beta)** – Task management and optimization issue tracking
- **GitHub Discussions** – Team collaboration and feedback
- **Pull Requests** – Code review and performance impact analysis
- **GitHub Actions** – Workflow automation and CI/CD integration
- **GitHub Wiki** – Documentation and best practices

## Command Examples

```
@pagespeed-analyze
Analyze performance for this website. Current URL in issue #42.

@pagespeed-recommend
Generate optimization recommendations for the repository.

@pagespeed-monitor
Set up performance monitoring in GitHub Actions.

@pagespeed-report
Create a performance report and post it to the discussion.
```

## GitHub Actions Integration

**Automated Performance Checks on Pull Requests:**
```yaml
name: Performance Check
on: [pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run performance audit
        run: |
          # Call PageSpeed agent
          # Post results as PR comment
```

**Scheduled Performance Analysis:**
```yaml
name: Weekly Performance Report
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9 AM

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - name: Analyze website performance
        run: npm run analyze:performance
      - name: Post results to discussions
        uses: actions/github-script@v7
```

## Workflow Patterns

### Pattern 1: Issue → Analysis → Recommendations → PR

1. User creates GitHub issue: "Performance optimization needed"
2. @pagespeed-analyze extracts requirements
3. Agent generates analysis and recommendations
4. Results posted as issue comment
5. Team discusses in issue comments
6. Implementation PR created with link to issue
7. Performance impact tracked in PR

### Pattern 2: PR Performance Impact Analysis

1. Developer creates PR with code changes
2. GitHub Actions runs performance check
3. @pagespeed-review compares metrics before/after
4. Flags if metrics regressed
5. Suggests optimizations if needed
6. Requires approval if performance threshold exceeded

### Pattern 3: Milestone-Based Performance Tracking

1. Team creates GitHub Milestone for performance quarter
2. Optimization tasks created as issues under milestone
3. @pagespeed-monitor tracks progress against targets
4. Weekly status updates posted to milestone discussion
5. Final report generated at milestone completion

### Pattern 4: Knowledge Base Integration

1. Performance best practices documented in Wiki
2. Each optimization issue links to relevant wiki page
3. @pagespeed-document generates documentation from issues
4. Team reviews and approves additions to wiki
5. Wiki becomes living reference for team

## Performance Monitoring Setup

```yaml
# GitHub Projects automation
name: Performance Tracking
on:
  issues:
    types: [opened, edited]

jobs:
  track:
    if: contains(github.event.issue.labels.*.name, 'performance')
    steps:
      - name: Add to project
        uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/.../projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Error Handling in Copilot Chat

**Missing URL Information:**
- Request user to provide website URL
- Suggest checking issue description
- Ask for environment if needed

**API Failures:**
- Continue with local analysis
- Suggest manual sync when connection restored
- Provide fallback recommendations

**Ambiguous Scope:**
- Ask clarifying questions in chat
- Suggest breaking into smaller issues
- Offer to create multiple sub-issues

## Response Format for GitHub

Copilot optimizes responses for GitHub platform:
- **Tables** – Performance metrics in markdown tables
- **Code blocks** – Configuration examples with syntax highlighting
- **Checkboxes** – Implementation checklists
- **Links** – References to related issues and wiki pages
- **Buttons** – "Create Issue", "Open Discussion", "Link PR" actions
- **Mentions** – @team members for approvals

## Best Practices

1. **Always reference** GitHub issue numbers when discussing optimizations
2. **Track progress** using milestone and project board status
3. **Link discussions** between performance issues and implementation PRs
4. **Document decisions** in issue comments for future reference
5. **Automate reporting** using GitHub Actions on schedule

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [skills.yaml](./skills.yaml) – Skill definitions
- [AGENT.md](../AGENT.md) – Agent specification
- [README.md](../README.md) – Quick reference

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
