---
provider: 'copilot'
agent_slug: 'website-scope-estimator'
agent_name: 'Website Scope Estimator (GitHub Copilot)'
status: 'production'
version: '1.0.1'
created_date: '2026-07-22'
last_updated: '2026-08-05'
platform: 'github'
integration: 'copilot-chat'
---

# Website Scope Estimator — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation of the Website Scope Estimator integrates directly with GitHub's development environment, providing intelligent assistance within code editors and pull requests.

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

## Available Skills

Estimation-specific skills triggered with @ mentions:

| Skill | Purpose | Usage |
|-------|---------|-------|
| **@estimate-scope** | Analyze and estimate project scope | `@estimate-scope for website redesign` |
| **@effort-calculate** | Calculate effort estimates | `@effort-calculate features` |
| **@timeline-generate** | Create project timeline | `@timeline-generate 8 weeks` |
| **@resource-plan** | Plan resource allocation | `@resource-plan team-size: 3` |
| **@budget-project** | Project budget and costs | `@budget-project rate: $100/hr` |
| **@risk-assess** | Identify and assess risks | `@risk-assess high-complexity` |

## GitHub Integration Patterns

### Pattern 1: Issue-Based Estimation

```
1. Create GitHub issue with project requirements
2. @estimate-scope analyzes issue
3. Agent breaks down features
4. Posts effort estimates as comment
5. Creates tasks from feature list
6. Links to related documentation
```

### Pattern 2: Project-Based Planning

```
1. Create GitHub Project for estimation
2. Create column for each estimation phase
3. Add requirements as issues
4. Move through estimation pipeline
5. @timeline-generate creates schedule
6. Auto-assign tasks based on effort
```

### Pattern 3: Team Estimation

```
1. Create discussion for estimation session
2. @estimate-scope starts estimation
3. Team members provide input
4. Copilot synthesizes estimates
5. Posts comparison matrix
6. Gets team consensus
```

### Pattern 4: Proposal Generation

```
1. Complete estimation in GitHub
2. @budget-project calculates costs
3. Generate proposal document
4. Create Linear epic automatically
5. Link to GitHub issue
6. Send to client portal
```

## Response Format

Copilot provides GitHub-optimized responses:

```markdown
## Scope Estimate for [Project]

### Feature Breakdown
| Feature | Hours | Days | Complexity |
|---------|-------|------|-----------|
| Feature 1 | 40 | 5 | Medium |
| Feature 2 | 60 | 7.5 | High |
| Feature 3 | 30 | 4 | Low |

**Total: 130 hours (16.25 days)**

### Timeline
- Week 1-2: Core features
- Week 3: Integration & testing
- Week 4: Review & launch

### Resource Plan
- 1 Developer (full-time)
- 0.5 QA (part-time)
- PM oversight (5 hours/week)

### Budget
- Developer: 104 hours @ $100/hr = $10,400
- QA: 26 hours @ $75/hr = $1,950
- **Total: $12,350**

### Risks
- [ ] Technology selection
- [ ] Team availability
- [ ] Third-party integrations

### Next Steps
- [ ] Create Linear epic
- [ ] Assign to team members
- [ ] Schedule kickoff
```

## GitHub Actions Automation

**Auto-Estimation on Issue Creation:**

```yaml
name: Auto-Estimate Issues
on:
  issues:
    types: [opened, labeled]

jobs:
  estimate:
    if: contains(github.event.issue.labels.*.name, 'needs-estimate')
    runs-on: ubuntu-latest
    steps:
      - name: Extract requirements
        id: extract
        uses: actions/github-script@v7
        with:
          script: |
            const body = context.issue.body;
            // Parse requirements
      
      - name: Calculate estimate
        id: calc
        run: npm run estimate:calculate
      
      - name: Post estimate
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '${{ steps.calc.outputs.estimate }}'
            })
```

**Weekly Sprint Planning:**

```yaml
name: Sprint Planning
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday morning

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - name: Analyze upcoming work
        run: npm run plan:sprint
      
      - name: Post planning document
        uses: actions/github-script@v7
        with:
          script: |
            # Create discussion with sprint plan
```

## Command Examples

```
@estimate-scope
Estimate scope for new e-commerce website redesign
Features: Homepage, product pages, cart, checkout

@effort-calculate
Calculate effort for:
- Design system (8 days)
- Database schema (3 days)
- API development (10 days)
- Frontend (12 days)

@timeline-generate
Create timeline for 12-week project
Team: 2 developers, 1 QA, 1 PM

@resource-plan
Plan resources for mobile app development
Budget: $80,000
Timeline: 16 weeks

@budget-project
Project budget with team:
- 2 Developers @ $100/hr
- 1 QA @ $75/hr
- PM: 10 hours/week @ $120/hr

@risk-assess
Assess risks for new technology stack
Complexity: High
Team experience: Medium
```

## Best Practices

1. **Always link to Linear** – Sync estimates with project management
2. **Document assumptions** – Write them in GitHub issue
3. **Include confidence** – State estimate confidence level
4. **Plan buffers** – Add contingency in timelines
5. **Track actuals** – Update with real hours spent
6. **Iterate estimates** – Refine as project progresses

## Error Handling

**Incomplete Requirements:**
- Request more details
- Make reasonable assumptions
- Flag risky assumptions
- Ask clarifying questions

**Unrealistic Timeline:**
- Flag impossible schedule
- Show realistic alternatives
- Recommend phased approach
- Suggest MVP strategy

**Budget Constraints:**
- Prioritize features by value
- Suggest cost optimization
- Recommend timeline extension
- Plan phased delivery

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [skills.yaml](./skills.yaml) – Skill definitions
- [AGENT.md](../AGENT.md) – Agent specification
- [README.md](../README.md) – Quick reference

---

*Built by LightSpeedWP with open-source spirit!*
