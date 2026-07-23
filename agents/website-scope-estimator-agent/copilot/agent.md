---
provider: 'copilot'
agent_slug: 'website-scope-estimator'
agent_name: 'Website Scope Estimator (GitHub Copilot)'
status: 'production'
version: '1.0.0'
created_date: '2026-07-22'
last_updated: '2026-07-23'
platform: 'github'
integration: 'copilot-chat'
---

# Website Scope Estimator — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation of the Website Scope Estimator integrates directly into GitHub's native environment, providing intelligent scope analysis, effort estimation, and timeline planning within Copilot Chat, GitHub Issues, GitHub Projects, and pull requests.

Copilot excels at:
- **GitHub Projects Integration** – Create epics/stories; track estimation across project board
- **Issue Analysis** – Extract scope from issue descriptions; generate estimates
- **Timeline Visualization** – Map features to milestones; show critical path in Project board
- **Team Collaboration** – Discuss estimates in PR comments; collaborate on scope refinement
- **Workflow Automation** – Trigger GitHub Actions for report generation, approval routing

## Core Capabilities

**@estimate-project** – Analyze project requirements and generate comprehensive estimates  
**@decompose-features** – Break requirements into granular features and user stories  
**@timeline-generate** – Create project timeline and critical path analysis  
**@resource-plan** – Recommend team composition and resource allocation  
**@scenario-create** – Generate MVP, standard, premium scope options  
**@budget-forecast** – Project costs and financial scenarios  
**@risk-identify** – Assess project risks and recommend mitigations  
**@report-generate** – Create professional estimation report  

## GitHub Integration Patterns

### Pattern 1: Epic → Detailed Estimation

User creates GitHub Epic with project goals → Copilot analyzes epic requirements → Decomposes into user stories with estimates → Creates GitHub Project milestones → Tracks effort against project board.

**GitHub Epic Template:**
```markdown
## Project: Website Redesign
- **Current:** 15-page WordPress, slow performance
- **Target:** Modern design, optimized performance, new CMS
- **Timeline Goal:** 12 weeks
- **Budget Range:** $30k-$50k
- **Success Metrics:** Performance improvement, design quality, migration success
```

**Copilot Response:**
- Decomposes epic into 12-15 user stories
- Estimates: 300-350 hours
- Timeline: 14 weeks (realistic with buffers)
- Resource recommendation: 2 devs, 1 designer
- Budget: $35k-$42k
- Risk assessment: Migration complexity (flag for mitigation)

### Pattern 2: Project-Based Feature Estimation

User creates GitHub Project with feature epics → Copilot estimates each feature group → Calculates team-wide timeline → Updates project board with estimates → Tracks progress automatically.

**Project Structure:**
```
Website Redesign (Epic #50)
├─ Design System (Story #51) → [40 hours]
├─ Home Page (Story #52) → [20 hours]
├─ Product Pages (Story #53) → [60 hours]
├─ CMS Migration (Story #54) → [80 hours]
├─ Performance Optimization (Story #55) → [40 hours]
└─ Testing & QA (Story #56) → [40 hours]
```

Copilot:
- Sums estimates (280 hours)
- Creates timeline (14 weeks)
- Identifies critical path (CMS migration → Performance)
- Updates project metadata with effort/timeline
- Suggests parallel work (Design → Development)

### Pattern 3: Continuous Estimation Refinement

Initial estimates posted to Project → Team reviews in issue comments → Estimates refined based on feedback → GitHub Actions regenerate report → Reports attached to project.

## Available Skills

Skills are invoked using @ mentions in Copilot Chat:

1. **@estimate-project** – Comprehensive project estimation from requirements
2. **@decompose-features** – Break requirements into estimable features
3. **@timeline-generate** – Create project schedule with milestones
4. **@resource-plan** – Recommend team composition and skill requirements
5. **@scenario-create** – Generate MVP, standard, premium scenarios
6. **@budget-forecast** – Project costs with financial scenarios
7. **@risk-identify** – Assess risks and recommend mitigations
8. **@report-generate** – Generate professional estimation report
9. **@estimates-sync** – Sync estimates to GitHub Project metadata

## GitHub Projects Workflow

**Step 1: Create Project & Epic**
- Create GitHub Project for new initiative
- Create Epic issue with project description, goals, timeline
- Include: current state, target state, success criteria, constraints

**Step 2: Generate Estimates**
- Invoke `@estimate-project` in Copilot Chat
- Copilot analyzes epic requirements
- Generates detailed feature breakdown with estimates
- Posts estimates as issue comment or separate markdown

**Step 3: Team Review & Discussion**
- Team reviews estimates in epic comments
- Discuss assumptions, risks, dependencies
- Refine estimates based on team feedback
- Update epic description with agreed estimates

**Step 4: Create User Stories**
- Invoke `@decompose-features` or manually create stories
- Each story includes effort estimate from breakdown
- Stories linked to epic
- Acceptance criteria defined

**Step 5: Timeline & Milestone Planning**
- Invoke `@timeline-generate`
- Copilot creates timeline with phases and milestones
- Maps features to GitHub Project milestones
- Identifies critical path and dependencies
- Updates project board with timeline visualization

**Step 6: Resource & Budget Planning**
- Invoke `@resource-plan` for team composition
- Invoke `@budget-forecast` for financial projections
- Create scenarios (MVP, standard, premium)
- Post resource and budget summaries to project

**Step 7: Report & Approval**
- Invoke `@report-generate`
- Creates professional estimation report
- Includes: scope, effort, timeline, resources, budget, risks
- Attaches report to project for stakeholder review
- Creates approval issue/discussion for sign-off

## Command Examples

### Full Project Estimation
```
@estimate-project
Analyze project requirements from Epic #50 (Website Redesign)
Generate comprehensive estimates including:
- Feature decomposition
- Effort estimates per feature
- Resource recommendations
- Timeline with milestones
- Budget projection
- Risk assessment
Include scenarios: MVP (8 weeks), Standard (12 weeks), Premium (16 weeks)
```

### Feature Decomposition
```
@decompose-features
Break down epic #50 requirements into user stories:
- Design system and component library
- Homepage redesign
- Product pages (15 pages)
- Shopping cart integration
- Payment processing
- Performance optimization
- QA and testing
Estimate each story and flag dependencies.
```

### Timeline Planning
```
@timeline-generate
Create project timeline for Epic #50 (Website Redesign):
- Team size: 3 engineers, 1 designer
- Start date: August 1, 2026
- Target end: November 15, 2026
- Include 15% time buffer
- Identify critical path and parallel work opportunities
- Create GitHub Project milestones for each phase
```

### Scenario Planning
```
@scenario-create
Generate scope scenarios for Website Redesign project:
- MVP: Core pages, basic performance, minimum CMS features (6 weeks, $18k)
- Standard: Full scope, optimized performance, complete CMS (12 weeks, $38k)
- Premium: Enhanced features, advanced optimization (16 weeks, $52k)
Include effort, timeline, cost for each scenario.
```

## GitHub Actions Integration

Automation triggers for estimation workflows:

```yaml
name: Estimation Automation

on:
  issues:
    types: [opened, labeled]
  pull_request:
    types: [opened]

jobs:
  estimate_project:
    if: contains(github.event.issue.labels.*.name, 'needs-estimation')
    runs-on: ubuntu-latest
    steps:
      - name: Generate estimates
        uses: copilot/estimate-project@v1
        with:
          issue_number: ${{ github.event.issue.number }}
          
      - name: Create scenarios
        uses: copilot/scenario-create@v1
        
      - name: Generate report
        uses: copilot/report-generate@v1
        
      - name: Attach to project
        uses: copilot/sync-project@v1
```

## Error Handling

**Missing Requirements:**
- Flag required information
- Request clarification in issue comments
- Proceed with assumptions clearly noted

**Conflicting Estimates:**
- Team disagrees on feature estimate
- Propose expert estimation session
- Offer multiple scenarios with trade-offs

**Scope Creep During Planning:**
- Flag scope changes during estimation
- Request scope prioritization
- Calculate impact on timeline/budget

**Timeline Infeasibility:**
- Flag if estimates exceed timeline goal
- Suggest alternatives (more resources, reduce scope, extend timeline)
- Model impact on each option

## Best Practices

1. **Estimate Early** – Estimate during epic creation, refine during sprint planning
2. **Team Collaboration** – Always discuss estimates with team; document assumptions
3. **Scenario Planning** – Always provide MVP, standard, premium options
4. **Regular Refinement** – Refine estimates as requirements become clearer
5. **Track Actuals** – Compare estimated vs. actual hours; improve estimates over time
6. **Link to Project** – Keep estimates in GitHub Project for team visibility
7. **Document Assumptions** – Record key assumptions in epic description

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology (provider-agnostic)
- [skills.yaml](./skills.yaml) – Detailed skill definitions and parameters
- [AGENT.md](../AGENT.md) – Full agent specification
- [README.md](../README.md) – Quick reference guide

---

*Built by 🧱 LightSpeedWP and ☕ Claude Code.*
